export const ACTIVE_BATTLE_PLAYER_LINK_PERSISTENCE_VERSION = 1;

export function validatePersistedActiveBattlePlayerLink(state) {
    const battle = state?.activeBattle;
    const rootPlayer = state?.player;
    if (!battle || !Array.isArray(battle.combatants) || !rootPlayer) return [];
    const battlePlayer = battle.combatants.find((combatant) => combatant?.type === 'player');
    if (!battlePlayer) return [];

    const issues = [];
    if (battlePlayer.id !== rootPlayer.id) issues.push('activeBattle player id must match root player id.');
    comparePlain(battlePlayer.identity, rootPlayer.identity, 'identity', issues);
    comparePlain(battlePlayer.jobs, rootPlayer.jobs, 'jobs', issues);
    comparePlain(battlePlayer.progression, rootPlayer.progression, 'progression', issues);
    comparePlain(battlePlayer.equipment, rootPlayer.equipment, 'equipment', issues);
    comparePlain(battlePlayer.resources, rootPlayer.resources, 'resources', issues);
    comparePlain(battlePlayer.statuses, rootPlayer.statuses, 'statuses', issues);
    return issues;
}

function comparePlain(actual, expected, field, issues) {
    if (!plainEqual(actual, expected)) issues.push(`activeBattle player ${field} must match root player ${field}.`);
}

function plainEqual(left, right) {
    if (left === right) return true;
    if (Array.isArray(left) || Array.isArray(right)) {
        if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false;
        return left.every((value, index) => plainEqual(value, right[index]));
    }
    if (isObject(left) || isObject(right)) {
        if (!isObject(left) || !isObject(right)) return false;
        const leftKeys = Object.keys(left);
        const rightKeys = Object.keys(right);
        if (leftKeys.length !== rightKeys.length) return false;
        return leftKeys.every((key) => Object.hasOwn(right, key) && plainEqual(left[key], right[key]));
    }
    return false;
}

function isObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
