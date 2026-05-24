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
    action('save', 'save'),
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

export function createMenuActionList(session) {
    if (!session?.loggedIn) {
        const accounts = session?.accounts ?? [];
        return [
            ...accounts.map((account) => action(`account:${account.id}`, account.displayName, account.id, { kind: 'selectAccount' })),
            action('createAccount', 'Create Account', 'createAccount', { kind: 'ui' }),
            action('login', 'Login', 'login', { kind: 'ui' }),
        ];
    }

    const characters = session.characters ?? [];
    return [
        ...characters.map((character) => action(`character:${character.id}`, `${character.name} - ${character.job} Lv.${character.level}`, character.id, { kind: 'selectCharacter' })),
        action('newCharacter', characters.length ? 'New Character' : 'Create Character', '/newcharacter'),
        action('account', 'Account', '/account'),
        action('logout', 'Logout', 'logout', { kind: 'ui' }),
    ];
}

export function findActionById(actionId, actions = GLOBAL_ACTIONS) {
    return actions.find((item) => item.id === actionId) ?? null;
}

export function dispatchAction(actionId, routeCommand, actions = GLOBAL_ACTIONS) {
    const actionRecord = typeof actionId === 'object' ? actionId : findActionById(actionId, actions);
    if (!actionRecord) return { ok: false, reason: `Unknown action: ${actionId}` };
    if (actionRecord.disabled) return { ok: false, action: actionRecord, reason: `${actionRecord.label} is unavailable.` };
    const response = routeCommand(actionRecord.command, actionRecord);
    return { ok: true, action: actionRecord, command: actionRecord.command, response };
}

function action(id, label, command, options = {}) {
    return Object.freeze({ id, label, command, kind: options.kind ?? 'command' });
}

function isActionDisabled(actionRecord, state) {
    if (actionRecord.id === 'battle') return state?.activeBattle?.phase !== 'active';
    return false;
}
