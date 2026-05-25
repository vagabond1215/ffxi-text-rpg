import { replaceState as replaceGameState } from '../gameState.js';
import {
    appendOutput,
    setActiveFeedback,
    setCanvasModal,
    setCanvasScreen,
} from './canvasInput.js';

export function createIntentResult({ ok = true, message = '', data = null } = {}) {
    return { ok, message, data };
}

export function isCommandIntent(intent) {
    return intent === 'command.route';
}

export function isUiIntent(intent) {
    return typeof intent === 'string' && !isCommandIntent(intent);
}

export function describeIntent(action) {
    if (!action) return 'unknown';
    return action.intent ?? action.kind ?? action.id ?? 'unknown';
}

const THEMES = Object.freeze(['dark', 'light', 'highContrast']);
const TIME_ZONES = Object.freeze(['local', 'UTC', 'America/New_York', 'America/Los_Angeles']);

export function dispatchUiIntent(request = {}) {
    const context = createDispatchContext(request);
    switch (context.intent) {
        case 'ui.menu.open': return openMenu(context);
        case 'ui.modal.close': return closeModal(context);
        case 'account.login.open': return openLogin(context);
        case 'account.select': return selectAccount(context);
        case 'account.login.confirm': return confirmAccountLogin(context);
        case 'account.create': return createAccount(context);
        case 'account.logout': return logout(context);
        case 'character.select': return selectCharacter(context);
        case 'settings.open': return openSettings(context);
        case 'settings.cycleTheme': return updateSetting(context, 'theme');
        case 'settings.cycleTimeZone': return updateSetting(context, 'timezone');
        case 'settings.toggleClock': return updateSetting(context, 'clockToggle');
        case 'settings.toggleClockFormat': return updateSetting(context, 'clockFormat');
        case 'command.route': return routeCommand(context);
        default: return fail(context, `Unknown intent: ${context.intent || 'none'}`);
    }
}

function createDispatchContext({ intent, payload = {}, state, uiState, session = {}, services = {} }) {
    return {
        intent: String(intent ?? ''),
        payload: payload ?? {},
        state,
        uiState,
        session: session ?? {},
        services: services ?? {},
    };
}

function openMenu(context) {
    refreshSession(context);
    setCanvasScreen(context.uiState, 'menu');
    setCanvasModal(context.uiState, null);
    setActiveFeedback(context.uiState, '');
    return ok(context);
}

function closeModal(context) {
    setCanvasModal(context.uiState, null);
    setActiveFeedback(context.uiState, '');
    return ok(context);
}

function openLogin(context) {
    refreshSession(context);
    const accounts = context.session.accounts ?? [];
    if (!accounts.length) return feedback(context, 'No local accounts. Create an account first.');
    ensureSelectedAccount(context);
    setCanvasModal(context.uiState, 'login');
    setActiveFeedback(context.uiState, '');
    return ok(context);
}

function selectAccount(context) {
    refreshSession(context);
    const accountId = context.payload.accountId ?? context.payload.accountSelector ?? context.payload.value;
    if (!accountId) return feedback(context, 'No account selected.');
    context.uiState.selectedAccountId = accountId;
    setCanvasModal(context.uiState, 'loginPassword');
    const label = context.payload.displayName ?? findAccount(context.session, accountId)?.displayName ?? accountId;
    setActiveFeedback(context.uiState, `Selected ${label}.`);
    return ok(context, { selectedAccountId: accountId });
}

function confirmAccountLogin(context) {
    refreshSession(context);
    const password = parseLoginPassword(context.uiState.inputBuffer);
    const accountSelector = context.payload.accountId ?? context.uiState.selectedAccountId ?? context.session.accounts?.[0]?.id;
    const loginAccount = context.services.loginAccount;
    if (!loginAccount) return fail(context, 'Account login service unavailable.');
    const result = loginAccount(accountSelector, password, { persistentLogin: true });
    if (!result.ok) return feedback(context, result.reason);

    setSession(context, result.session);
    context.uiState.inputBuffer = '';
    setCanvasModal(context.uiState, null);
    setCanvasScreen(context.uiState, 'menu');
    const message = `Logged in as ${context.session.displayName}.`;
    setActiveFeedback(context.uiState, message);
    appendOutput(context.uiState, message);
    return ok(context, { account: result.account });
}

function createAccount(context) {
    const { accountName, password } = parseCredentialInput(context.uiState.inputBuffer);
    const createAccountWithPassword = context.services.createAccountWithPassword;
    if (!createAccountWithPassword) return fail(context, 'Account creation service unavailable.');
    const result = createAccountWithPassword(accountName, password, { persistentLogin: true });
    if (!result.ok) return feedback(context, result.reason);

    setSession(context, result.session);
    context.uiState.selectedAccountId = context.session.accountId;
    context.uiState.inputBuffer = '';
    setCanvasModal(context.uiState, null);
    setCanvasScreen(context.uiState, 'menu');
    const feedbackText = `Created ${context.session.displayName}.`;
    setActiveFeedback(context.uiState, feedbackText);
    appendOutput(context.uiState, `Created account: ${context.session.displayName}.`);
    return ok(context, { account: result.account });
}

function logout(context) {
    const logoutAccount = context.services.logoutAccount;
    if (!logoutAccount) return fail(context, 'Account logout service unavailable.');
    setSession(context, logoutAccount());
    setCanvasModal(context.uiState, null);
    setCanvasScreen(context.uiState, 'menu');
    setActiveFeedback(context.uiState, 'Logged out.');
    appendOutput(context.uiState, 'Logged out.');
    return ok(context);
}

function selectCharacter(context) {
    const characterSelector = context.payload.characterId ?? context.payload.characterSelector ?? context.payload.value;
    const loadCharacter = context.services.loadCharacter;
    if (!loadCharacter) return fail(context, 'Character load service unavailable.');
    const loaded = loadCharacter(characterSelector);
    if (!loaded) {
        const label = context.payload.displayName ?? characterSelector;
        return feedback(context, `Unable to load character: ${label}`);
    }

    const replaceState = context.services.replaceState ?? replaceGameState;
    replaceState(context.state, loaded);
    refreshSession(context);
    setCanvasModal(context.uiState, null);
    setCanvasScreen(context.uiState, 'game');
    const message = `Loaded ${loaded.player.identity.name}.`;
    setActiveFeedback(context.uiState, message);
    appendOutput(context.uiState, message);
    return ok(context, { character: loaded });
}

function openSettings(context) {
    refreshSession(context);
    if (!context.session.loggedIn) return feedback(context, 'Login required.');
    setCanvasModal(context.uiState, 'settings');
    return ok(context);
}

function updateSetting(context, actionId) {
    refreshSession(context);
    const updateAccountSettings = context.services.updateAccountSettings;
    if (!updateAccountSettings) return fail(context, 'Account settings service unavailable.');
    const settings = context.session.settings ?? {};
    const updates = {};
    if (actionId === 'theme') updates.theme = nextValue(settings.theme, THEMES);
    if (actionId === 'timezone') updates.timeZone = nextValue(settings.timeZone, TIME_ZONES);
    if (actionId === 'clockToggle') updates.showClock = !(settings.showClock !== false);
    if (actionId === 'clockFormat') updates.clockFormat = settings.clockFormat === '24h' ? '12h' : '24h';

    const result = updateAccountSettings(updates);
    if (!result.ok) return feedback(context, result.reason);
    setSession(context, result.session);
    setActiveFeedback(context.uiState, 'Settings saved.');
    return ok(context, { settings: result.settings });
}

function routeCommand(context) {
    const command = String(context.payload.command ?? '').trim();
    if (!command) return fail(context, 'No command to route.');
    if (!context.session.loggedIn && !command.startsWith('/account')) {
        return feedback(context, 'Login or create a local account first.');
    }

    const commandAdapter = context.services.commandAdapter ?? context.services.routeCommand;
    if (!commandAdapter) return fail(context, 'Command adapter unavailable.');
    const response = commandAdapter(command, context.payload.action ?? null);
    refreshSession(context);
    setActiveFeedback(context.uiState, `Ran: ${command}`);
    appendOutput(context.uiState, `> ${command}`);
    appendOutput(context.uiState, response);
    appendOutput(context.uiState, '');
    if (context.payload.screenAfter) setCanvasScreen(context.uiState, context.payload.screenAfter);
    if (context.payload.clearFeedback) setActiveFeedback(context.uiState, '');
    return ok(context, { command, response });
}

function parseCredentialInput(inputBuffer) {
    const value = String(inputBuffer ?? '').trim();
    const [namePart, passwordPart] = value.split('|').map((part) => String(part ?? '').trim());
    return { accountName: namePart, password: passwordPart };
}

function parseLoginPassword(inputBuffer) {
    const credentials = parseCredentialInput(inputBuffer);
    return credentials.password || credentials.accountName;
}

function feedback(context, message) {
    setActiveFeedback(context.uiState, message);
    appendOutput(context.uiState, message);
    return ok(context, { message });
}

function refreshSession(context) {
    const nextSession = context.services.loadAccountSession?.() ?? context.session;
    return setSession(context, nextSession);
}

function setSession(context, session) {
    context.session = session ?? context.session;
    ensureSelectedAccount(context);
    return context.session;
}

function ensureSelectedAccount(context) {
    const accounts = context.session?.accounts ?? [];
    const selected = context.uiState.selectedAccountId;
    if (!accounts.length) {
        context.uiState.selectedAccountId = null;
        return null;
    }
    if (!selected || !accounts.some((account) => account.id === selected)) {
        context.uiState.selectedAccountId = accounts[0].id;
    }
    return context.uiState.selectedAccountId;
}

function findAccount(session, accountId) {
    return (session.accounts ?? []).find((account) => account.id === accountId) ?? null;
}

function nextValue(current, values) {
    const index = values.indexOf(current);
    return values[(index + 1) % values.length];
}

function ok(context, result = {}) {
    return {
        ok: true,
        handled: true,
        intent: context.intent,
        session: context.session,
        ...result,
    };
}

function fail(context, reason) {
    return {
        ok: false,
        handled: false,
        intent: context.intent,
        session: context.session,
        reason,
    };
}
