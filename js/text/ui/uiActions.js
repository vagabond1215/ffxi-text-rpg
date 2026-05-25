import { isCommandIntent } from './uiIntentDispatcher.js';

export const GLOBAL_ACTIONS = Object.freeze([
    commandAction('character', 'Character', 'character'),
    commandAction('stats', 'Stats', 'stats'),
    commandAction('job', 'Job', 'job'),
    commandAction('skills', 'Skills', 'skills'),
    commandAction('inventory', 'Inventory', 'inventory'),
    commandAction('equipment', 'Equipment', 'equipment'),
    commandAction('maps', 'Maps', 'maps'),
    commandAction('look', 'Look', 'look'),
    commandAction('here', 'Here', 'here'),
    commandAction('battle', 'Battle', 'battle'),
    commandAction('help', 'Help', 'help'),
    commandAction('validate', 'Validate', 'validate'),
    commandAction('save', 'Save', 'save'),
]);

export const TOP_ACTIONS = Object.freeze([
    uiAction('menu', '', 'ui.menu.open'),
]);

export function createActionList(state, actions = GLOBAL_ACTIONS) {
    return actions.map((item) => ({ ...item, disabled: isActionDisabled(item, state) }));
}

export function createMenuActionList(session, modal = null, modalPage = null) {
    if (modal === 'mainMenu') return createMainMenuActions(session);
    if (modal === 'login') return createLoginActions(session);
    if (modal === 'loginPassword') return [uiAction('confirmLogin', 'Login', 'account.login.confirm')];
    if (modal === 'createAccount') return [uiAction('confirmCreateAccount', 'Create Account', 'account.create.confirm')];
    if (modal === 'settings' && session?.loggedIn) return createSettingsActions(session, modalPage);

    if (!session?.loggedIn) {
        const accounts = session?.accounts ?? [];
        return [
            ...(accounts.length ? [uiAction('login', 'Login', 'account.login.open')] : []),
            uiAction('createAccount', 'New Account', 'account.create.open'),
        ];
    }

    const characters = session.characters ?? [];
    return [
        ...characters.map((character) => uiAction(`character:${character.id}`, `${character.name} - ${character.job} Lv.${character.level}`, 'character.select', {
            characterId: character.id,
            displayName: character.name,
        })),
        commandAction('newCharacter', characters.length ? 'New Character' : 'Create Character', '/newcharacter', { screenAfter: 'game', clearFeedback: true }),
    ];
}

function createMainMenuActions(session) {
    if (!session?.loggedIn) {
        const accounts = session?.accounts ?? [];
        return [
            ...(accounts.length ? [uiAction('login', 'Login', 'account.login.open')] : []),
            uiAction('createAccount', 'New Account', 'account.create.open'),
        ];
    }
    return [
        uiAction('settings', 'Settings', 'settings.open'),
        commandAction('account', 'Account', '/account'),
        uiAction('logout', 'Logout', 'account.logout'),
    ];
}

function createLoginActions(session) {
    return [
        ...(session?.accounts ?? []).map((account) => uiAction(`account:${account.id}`, account.displayName, 'account.select', {
            accountId: account.id,
            displayName: account.displayName,
        })),
    ];
}

function createSettingsActions(session, modalPage) {
    const settings = session.settings ?? {};
    if (modalPage === 'general') {
        return [
            uiAction('settingsBack', 'Back', 'settings.page.root'),
            uiAction('uiScale', `Page scale: ${settings.uiScale ?? 'auto'}`, 'settings.cycleUiScale'),
            uiAction('layoutMode', `Layout: ${settings.layoutMode ?? 'auto'}`, 'settings.cycleLayoutMode'),
            uiAction('layoutProportion', `Proportion: ${settings.layoutProportion ?? 'standard'}`, 'settings.cycleLayoutProportion'),
            uiAction('clockPage', 'Clock', 'settings.page.clock'),
        ];
    }
    if (modalPage === 'clock') {
        const manual = settings.timeZoneMode === 'manual';
        const offset = Number(settings.gmtOffset ?? 0);
        return [
            uiAction('settingsBack', 'Back', 'settings.page.general'),
            uiAction('clockToggle', `Clock: ${settings.showClock === false ? 'Hidden' : 'Shown'}`, 'settings.toggleClock'),
            uiAction('clockFormat', `Clock format: ${settings.clockFormat ?? '12h'}`, 'settings.toggleClockFormat'),
            uiAction('timeZoneMode', `Time zone: ${settings.timeZoneMode ?? 'auto'}`, 'settings.toggleTimeZoneMode'),
            ...(manual ? [
                uiAction('gmtDown', 'GMT -', 'settings.gmtDown'),
                uiAction('gmtValue', `GMT ${formatOffset(offset)}`, 'settings.noop'),
                uiAction('gmtUp', 'GMT +', 'settings.gmtUp'),
            ] : []),
            uiAction('daylightSavings', `Daylight savings: ${settings.daylightSavings ?? 'auto'}`, 'settings.cycleDaylightSavings'),
        ];
    }
    if (modalPage === 'account') {
        return [
            uiAction('settingsBack', 'Back', 'settings.page.root'),
            uiAction('accountName', `Account: ${session.displayName ?? 'Unknown'}`, 'settings.noop'),
            uiAction('characterCount', `Characters: ${session.characterCount ?? 0}`, 'settings.noop'),
            uiAction('logout', 'Logout', 'account.logout'),
        ];
    }
    return [
        uiAction('generalSettings', 'UI / General', 'settings.page.general'),
        uiAction('accountSettings', 'Account', 'settings.page.account'),
    ];
}

export function findActionById(actionId, actions = GLOBAL_ACTIONS) {
    return actions.find((item) => item.id === actionId) ?? null;
}

export function dispatchAction(actionId, routeCommand, actions = GLOBAL_ACTIONS) {
    const actionRecord = typeof actionId === 'object' ? actionId : findActionById(actionId, actions);
    if (!actionRecord) return { ok: false, reason: `Unknown action: ${actionId}` };
    if (actionRecord.disabled) return { ok: false, action: actionRecord, reason: `${actionRecord.label} is unavailable.` };
    if (!isCommandIntent(actionRecord.intent)) return { ok: false, action: actionRecord, reason: `${actionRecord.label} is not a command action.` };
    const response = routeCommand(actionRecord.payload.command, actionRecord);
    return { ok: true, action: actionRecord, command: actionRecord.payload.command, response };
}

function commandAction(id, label, command, payload = {}) {
    return Object.freeze({ id, label, command, intent: 'command.route', payload: Object.freeze({ command, ...payload }), kind: 'command' });
}

function uiAction(id, label, intent, payload = {}) {
    return Object.freeze({ id, label, command: payload.command ?? id, intent, payload: Object.freeze(payload), kind: 'ui' });
}

function isActionDisabled(actionRecord, state) {
    if (actionRecord.id === 'battle') return state?.activeBattle?.phase !== 'active';
    if (actionRecord.intent === 'settings.noop') return true;
    return false;
}

function formatOffset(offset) {
    return offset >= 0 ? `+${offset}` : String(offset);
}
