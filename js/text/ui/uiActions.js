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
    return actions.map((item) => ({
        ...item,
        disabled: isActionDisabled(item, state),
    }));
}

export function createMenuActionList(session, modal = null) {
    if (modal === 'login') {
        return [
            ...(session?.accounts ?? []).map((account) => uiAction(`account:${account.id}`, account.displayName, 'account.select', {
                accountId: account.id,
                displayName: account.displayName,
            })),
        ];
    }

    if (modal === 'loginPassword') {
        return [uiAction('confirmLogin', 'Login', 'account.login.confirm')];
    }

    if (modal === 'createAccount') {
        return [uiAction('confirmCreateAccount', 'Create Account', 'account.create.confirm')];
    }

    if (modal === 'settings' && session?.loggedIn) {
        const settings = session.settings ?? {};
        return [
            uiAction('theme', `Theme: ${settings.theme ?? 'dark'}`, 'settings.cycleTheme'),
            uiAction('timezone', `Time zone: ${settings.timeZone ?? 'local'}`, 'settings.cycleTimeZone'),
            uiAction('clockToggle', `Clock: ${settings.showClock === false ? 'Hidden' : 'Shown'}`, 'settings.toggleClock'),
            uiAction('clockFormat', `Clock format: ${settings.clockFormat ?? '12h'}`, 'settings.toggleClockFormat'),
        ];
    }

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
        uiAction('settings', 'Settings', 'settings.open'),
        commandAction('account', 'Account', '/account'),
        uiAction('logout', 'Logout', 'account.logout'),
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
    return Object.freeze({
        id,
        label,
        command,
        intent: 'command.route',
        payload: Object.freeze({ command, ...payload }),
        kind: 'command',
    });
}

function uiAction(id, label, intent, payload = {}) {
    return Object.freeze({
        id,
        label,
        command: payload.command ?? id,
        intent,
        payload: Object.freeze(payload),
        kind: 'ui',
    });
}

function isActionDisabled(actionRecord, state) {
    if (actionRecord.id === 'battle') return state?.activeBattle?.phase !== 'active';
    return false;
}
