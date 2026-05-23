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

export function createActionList(state, actions = GLOBAL_ACTIONS) {
    return actions.map((item) => ({
        ...item,
        disabled: isActionDisabled(item, state),
    }));
}

export function findActionById(actionId, actions = GLOBAL_ACTIONS) {
    return actions.find((item) => item.id === actionId) ?? null;
}

export function dispatchAction(actionId, routeCommand, actions = GLOBAL_ACTIONS) {
    const actionRecord = typeof actionId === 'object' ? actionId : findActionById(actionId, actions);
    if (!actionRecord) return { ok: false, reason: `Unknown action: ${actionId}` };
    if (actionRecord.disabled) return { ok: false, action: actionRecord, reason: `${actionRecord.label} is unavailable.` };
    const response = routeCommand(actionRecord.command);
    return {
        ok: true,
        action: actionRecord,
        command: actionRecord.command,
        response,
    };
}

function action(id, label, command) {
    return Object.freeze({ id, label, command });
}

function isActionDisabled(actionRecord, state) {
    if (actionRecord.id === 'battle') return state?.activeBattle?.phase !== 'active';
    return false;
}
