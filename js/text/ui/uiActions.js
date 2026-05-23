export const GLOBAL_ACTIONS = Object.freeze([
    action('character', 'Character', 'character'),
    action('stats', 'Stats', 'stats'),
    action('job', 'Job', 'job'),
    action('skills', 'Skills', 'skills'),
    action('inventory', 'Inventory', 'inventory'),
    action('equipment', 'Equipment', 'equipment'),
    action('maps', 'Maps', 'maps'),
    action('look', 'Look', 'look'),
    action('here', 'Here', 'here'),
    action('battle', 'Battle', 'battle'),
    action('help', 'Help', 'help'),
    action('validate', 'Validate', 'validate'),
    action('save', 'Save', 'save'),
]);

export const MENU_ACTIONS = Object.freeze([
    action('continue', 'Continue', 'continue', { kind: 'ui' }),
    action('login', 'Login / Select Account', 'login', { kind: 'ui' }),
    action('newCharacter', 'New Character', '/newcharacter'),
    action('characters', 'Characters', '/characters'),
    action('account', 'Account', '/account'),
    action('logout', 'Logout', 'logout', { kind: 'ui' }),
]);

export const TOP_ACTIONS = Object.freeze([
    action('menu', 'Menu', 'menu', { kind: 'ui' }),
]);

export function createActionList(state, actions = GLOBAL_ACTIONS) {
    return actions.map((item) => ({
        ...item,
        disabled: isActionDisabled(item, state),
    }));
}

export function createMenuActionList(session, actions = MENU_ACTIONS) {
    return actions.map((item) => ({
        ...item,
        disabled: isMenuActionDisabled(item, session),
    }));
}

export function findActionById(actionId, actions = GLOBAL_ACTIONS) {
    return actions.find((item) => item.id === actionId) ?? null;
}

export function dispatchAction(actionId, routeCommand, actions = GLOBAL_ACTIONS) {
    const actionRecord = typeof actionId === 'object' ? actionId : findActionById(actionId, actions);
    if (!actionRecord) return { ok: false, reason: `Unknown action: ${actionId}` };
    if (actionRecord.disabled) return { ok: false, action: actionRecord, reason: `${actionRecord.label} is unavailable.` };
    const response = routeCommand(actionRecord.command, actionRecord);
    return {
        ok: true,
        action: actionRecord,
        command: actionRecord.command,
        response,
    };
}

function action(id, label, command, options = {}) {
    return Object.freeze({ id, label, command, kind: options.kind ?? 'command' });
}

function isActionDisabled(actionRecord, state) {
    if (actionRecord.id === 'battle') return state?.activeBattle?.phase !== 'active';
    return false;
}

function isMenuActionDisabled(actionRecord, session) {
    if (actionRecord.id === 'continue') return !session?.loggedIn;
    if (actionRecord.id === 'logout') return !session?.loggedIn;
    return false;
}
