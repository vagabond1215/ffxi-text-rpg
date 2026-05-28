import { createNewGameState, replaceState as replaceGameState } from '../gameState.js';
import {
    appendOutput,
    clearModalInputs,
    setActiveFeedback,
    setCanvasModal,
    setCanvasScreen,
    setModalPage,
    setAutoRunEnabled,
    isMovementOnCooldown,
    setMovementCooldown,
    stopUiMovement,
} from './canvasInput.js';
import {
    advanceCreatorStep,
    createCreatorGameOptions,
    createGuidedCreatorState,
    describeCreatorOpening,
    normalizeCreatorState,
    selectCreatorJob,
    selectCreatorNation,
    selectCreatorRace,
    selectCreatorSex,
    validateCreator,
} from '../systems/characterCreationModel.js';
import { moveInDirection, stopTravel } from '../systems/navigationEngine.js';

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
const UI_SCALES = Object.freeze(['auto', '90%', '100%', '110%', '125%']);
const LAYOUT_MODES = Object.freeze(['auto', 'portrait', 'landscape']);
const LAYOUT_PROPORTIONS = Object.freeze(['standard', 'compact', 'wide']);
const DST_MODES = Object.freeze(['auto', 'on', 'off']);

export function dispatchUiIntent(request = {}) {
    const context = createDispatchContext(request);
    switch (context.intent) {
        case 'ui.menu.open': return openTopMenu(context);
        case 'ui.modal.close': return closeModal(context);
        case 'account.login.open': return openLogin(context);
        case 'account.select': return selectAccount(context);
        case 'account.login.confirm': return confirmAccountLogin(context);
        case 'account.create.open': return openCreateAccount(context);
        case 'account.create.confirm': return createAccount(context);
        case 'account.create': return createAccount(context);
        case 'account.logout': return logout(context);
        case 'character.select': return selectCharacter(context);
        case 'settings.open': return openSettings(context);
        case 'settings.page.root': return setSettingsPage(context, null);
        case 'settings.page.general': return setSettingsPage(context, 'general');
        case 'settings.page.clock': return setSettingsPage(context, 'clock');
        case 'settings.page.account': return setSettingsPage(context, 'account');
        case 'settings.cycleTheme': return updateSetting(context, { theme: nextValue(context.session.settings?.theme, THEMES) });
        case 'settings.cycleUiScale': return updateSetting(context, { uiScale: nextValue(context.session.settings?.uiScale, UI_SCALES) });
        case 'settings.cycleLayoutMode': return updateSetting(context, { layoutMode: nextValue(context.session.settings?.layoutMode, LAYOUT_MODES) });
        case 'settings.cycleLayoutProportion': return updateSetting(context, { layoutProportion: nextValue(context.session.settings?.layoutProportion, LAYOUT_PROPORTIONS) });
        case 'settings.toggleClock': return updateSetting(context, { showClock: !(context.session.settings?.showClock !== false) });
        case 'settings.toggleClockFormat': return updateSetting(context, { clockFormat: context.session.settings?.clockFormat === '24h' ? '12h' : '24h' });
        case 'settings.toggleTimeZoneMode': return updateSetting(context, { timeZoneMode: context.session.settings?.timeZoneMode === 'manual' ? 'auto' : 'manual' });
        case 'settings.gmtDown': return updateSetting(context, { gmtOffset: clampGmt((context.session.settings?.gmtOffset ?? 0) - 1) });
        case 'settings.gmtUp': return updateSetting(context, { gmtOffset: clampGmt((context.session.settings?.gmtOffset ?? 0) + 1) });
        case 'settings.cycleDaylightSavings': return updateSetting(context, { daylightSavings: nextValue(context.session.settings?.daylightSavings, DST_MODES) });
        case 'settings.noop': return ok(context);
        case 'creator.open': return openCreator(context);
        case 'creator.goto': return updateCreator(context, { stepIndex: context.payload.stepIndex });
        case 'creator.selectRace': return updateCreator(context, (creator) => selectCreatorRace(creator, context.payload.raceId));
        case 'creator.selectSex': return updateCreator(context, (creator) => selectCreatorSex(creator, context.payload.sex));
        case 'creator.selectNation': return updateCreator(context, (creator) => selectCreatorNation(creator, context.payload.nationId));
        case 'creator.selectJob': return updateCreator(context, (creator) => selectCreatorJob(creator, context.payload.mainJobId));
        case 'creator.next': return updateCreator(context, (creator) => advanceCreatorStep(creator, 1));
        case 'creator.back': return updateCreator(context, (creator) => advanceCreatorStep(creator, -1));
        case 'creator.reset': return resetCreator(context);
        case 'creator.cancel': return cancelCreator(context);
        case 'creator.confirm': return confirmCreator(context);
        case 'creator.begin': return beginCreatedCharacter(context);
        case 'navigation.move': return moveNavigation(context);
        case 'navigation.stop': return stopNavigation(context);
        case 'navigation.toggleAutoRun': return toggleAutoRun(context);
        case 'command.route': return routeCommand(context);
        default: return fail(context, `Unknown intent: ${context.intent || 'none'}`);
    }
}

function createDispatchContext({ intent, payload = {}, state, uiState, session = {}, services = {} }) {
    return { intent: String(intent ?? ''), payload: payload ?? {}, state, uiState, session: session ?? {}, services: services ?? {} };
}

function openTopMenu(context) {
    refreshSession(context);
    setCanvasModal(context.uiState, 'mainMenu');
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

function openCreateAccount(context) {
    clearModalInputs(context.uiState);
    setCanvasModal(context.uiState, 'createAccount');
    setActiveFeedback(context.uiState, '');
    return ok(context);
}

function selectAccount(context) {
    refreshSession(context);
    const accountId = context.payload.accountId ?? context.payload.accountSelector ?? context.payload.value;
    if (!accountId) return feedback(context, 'No account selected.');
    context.uiState.selectedAccountId = accountId;
    clearModalInputs(context.uiState);
    setCanvasModal(context.uiState, 'loginPassword');
    const label = context.payload.displayName ?? findAccount(context.session, accountId)?.displayName ?? accountId;
    setActiveFeedback(context.uiState, `Selected ${label}.`);
    return ok(context, { selectedAccountId: accountId });
}

function confirmAccountLogin(context) {
    refreshSession(context);
    const password = context.uiState.modalInputs?.password ?? '';
    const accountSelector = context.payload.accountId ?? context.uiState.selectedAccountId ?? context.session.accounts?.[0]?.id;
    const loginAccount = context.services.loginAccount;
    if (!loginAccount) return fail(context, 'Account login service unavailable.');
    const result = loginAccount(accountSelector, password, { persistentLogin: true });
    if (!result.ok) return feedback(context, result.reason);
    setSession(context, result.session);
    setCanvasModal(context.uiState, null);
    setCanvasScreen(context.uiState, 'menu');
    const message = `Logged in as ${context.session.displayName}.`;
    setActiveFeedback(context.uiState, message);
    appendOutput(context.uiState, message);
    return ok(context, { account: result.account });
}

function createAccount(context) {
    const accountName = context.uiState.modalInputs?.accountName ?? '';
    const password = context.uiState.modalInputs?.password ?? '';
    const createAccountWithPassword = context.services.createAccountWithPassword;
    if (!createAccountWithPassword) return fail(context, 'Account creation service unavailable.');
    const result = createAccountWithPassword(accountName, password, { persistentLogin: true });
    if (!result.ok) return feedback(context, result.reason);
    setSession(context, result.session);
    context.uiState.selectedAccountId = context.session.accountId;
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
    if (!loaded) return feedback(context, `Unable to load character: ${context.payload.displayName ?? characterSelector}`);
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
    setModalPage(context.uiState, null);
    return ok(context);
}

function setSettingsPage(context, page) {
    setCanvasModal(context.uiState, 'settings', page);
    setActiveFeedback(context.uiState, '');
    return ok(context);
}

function updateSetting(context, updates) {
    refreshSession(context);
    const updateAccountSettings = context.services.updateAccountSettings;
    if (!updateAccountSettings) return fail(context, 'Account settings service unavailable.');
    const result = updateAccountSettings(updates);
    if (!result.ok) return feedback(context, result.reason);
    setSession(context, result.session);
    setActiveFeedback(context.uiState, 'Settings saved.');
    return ok(context, { settings: result.settings });
}

function openCreator(context) {
    refreshSession(context);
    if (!context.session.loggedIn) return feedback(context, 'Login or create a local account first.');
    context.uiState.creator = createGuidedCreatorState();
    context.uiState.creatorIntro = [];
    setCanvasModal(context.uiState, null);
    setCanvasScreen(context.uiState, 'creator');
    setActiveFeedback(context.uiState, 'Choose race and sex.');
    return ok(context, { creator: context.uiState.creator });
}

function updateCreator(context, updater) {
    context.uiState.creator ??= createGuidedCreatorState();
    const next = typeof updater === 'function' ? updater(context.uiState.creator) : { ...context.uiState.creator, ...updater };
    context.uiState.creator = normalizeCreatorState(next);
    setActiveFeedback(context.uiState, '');
    return ok(context, { creator: context.uiState.creator });
}

function resetCreator(context) {
    context.uiState.creator = createGuidedCreatorState();
    setActiveFeedback(context.uiState, 'Character creation reset.');
    return ok(context, { creator: context.uiState.creator });
}

function cancelCreator(context) {
    context.uiState.creator = null;
    context.uiState.creatorIntro = [];
    setCanvasScreen(context.uiState, 'menu');
    setActiveFeedback(context.uiState, 'Character creation cancelled.');
    return ok(context);
}

function confirmCreator(context) {
    context.uiState.creator = normalizeCreatorState(context.uiState.creator ?? createGuidedCreatorState());
    const issues = validateCreator(context.uiState.creator);
    if (issues.length) return feedback(context, issues[0]);
    const nextState = createNewGameState(createCreatorGameOptions(context.uiState.creator));
    const replaceState = context.services.replaceState ?? replaceGameState;
    replaceState(context.state, nextState);
    const saveGame = context.services.saveGame;
    const saved = saveGame ? saveGame(context.state) : false;
    refreshSession(context);
    context.uiState.creatorIntro = describeCreatorOpening(context.uiState.creator);
    setCanvasScreen(context.uiState, 'creatorIntro');
    const message = saved ? `Created ${context.state.player.identity.name}. Character saved.` : `Created ${context.state.player.identity.name}. Save unavailable.`;
    setActiveFeedback(context.uiState, message);
    return ok(context, { character: context.state, saved, message });
}

function beginCreatedCharacter(context) {
    setCanvasScreen(context.uiState, 'game');
    const message = `Begin ${context.state.player.identity.name}'s adventure.`;
    setActiveFeedback(context.uiState, message);
    if (context.payload.command) {
        context.payload.command = String(context.payload.command);
        return routeCommand(context);
    }
    return ok(context, { message });
}

function moveNavigation(context) {
    const direction = context.payload.direction;
    const source = context.payload.source ?? 'ui';
    const nowMs = Number(context.payload.nowMs ?? Date.now());
    if (['autoRun', 'held'].includes(source) && isMovementOnCooldown(context.uiState, nowMs)) {
        return ok(context, { cooldown: true, nextMoveAt: context.uiState.nextMoveAt });
    }
    if (context.uiState.autoRunEnabled && source !== 'autoRun') {
        if (context.uiState.activeAutoRunDirection === direction) {
            stopUiMovement(context.uiState);
            setActiveFeedback(context.uiState, 'Auto Run stopped.');
            return ok(context, { message: 'Auto Run stopped.' });
        }
        context.uiState.heldDirection = null;
        context.uiState.movementHeldSince = null;
        context.uiState.activeAutoRunDirection = direction;
    }
    const result = moveInDirection(context.state, direction);
    if (!result.ok) {
        if (source === 'autoRun' || source === 'held' || context.uiState.activeAutoRunDirection === direction) stopUiMovement(context.uiState);
        setActiveFeedback(context.uiState, result.reason);
        appendOutput(context.uiState, result.reason);
        return ok(context, { message: result.reason, movement: result });
    }
    if (result.exited) stopUiMovement(context.uiState);
    else setMovementCooldown(context.uiState, result.durationSeconds, nowMs);
    setActiveFeedback(context.uiState, result.message);
    appendOutput(context.uiState, result.message);
    appendOutput(context.uiState, '');
    return ok(context, { message: result.message, movement: result });
}

function stopNavigation(context) {
    stopUiMovement(context.uiState);
    const result = stopTravel(context.state);
    setActiveFeedback(context.uiState, result.message);
    appendOutput(context.uiState, result.message);
    return ok(context, { message: result.message, stopped: result.stopped });
}

function toggleAutoRun(context) {
    const enabled = setAutoRunEnabled(context.uiState, !context.uiState.autoRunEnabled);
    const message = `Auto Run ${enabled ? 'on' : 'off'}.`;
    setActiveFeedback(context.uiState, message);
    return ok(context, { message, autoRunEnabled: enabled });
}

function routeCommand(context) {
    const command = String(context.payload.command ?? '').trim();
    if (!command) return fail(context, 'No command to route.');
    if (!context.session.loggedIn && !command.startsWith('/account')) return feedback(context, 'Login or create a local account first.');
    if (command === '/newcharacter' || command === 'newcharacter') return openCreator(context);
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

function feedback(context, message) {
    setActiveFeedback(context.uiState, message);
    appendOutput(context.uiState, message);
    return ok(context, { message });
}

function refreshSession(context) {
    return setSession(context, context.services.loadAccountSession?.() ?? context.session);
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
    if (!selected || !accounts.some((account) => account.id === selected)) context.uiState.selectedAccountId = accounts[0].id;
    return context.uiState.selectedAccountId;
}

function findAccount(session, accountId) {
    return (session.accounts ?? []).find((account) => account.id === accountId) ?? null;
}

function nextValue(current, values) {
    const index = values.indexOf(current);
    return values[(index + 1) % values.length];
}

function clampGmt(value) {
    return Math.max(-12, Math.min(14, Number.parseInt(value, 10) || 0));
}

function ok(context, result = {}) {
    return { ok: true, handled: true, intent: context.intent, session: context.session, ...result };
}

function fail(context, reason) {
    return { ok: false, handled: false, intent: context.intent, session: context.session, reason };
}
