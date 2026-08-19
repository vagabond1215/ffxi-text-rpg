import { createCharacterStatState } from './characterStatEngine.js';
import { calculateCombatProfile } from './statEngine.js';

export const ACTIVE_BATTLE_PLAYER_LINK_PERSISTENCE_VERSION = 1;

export function validatePersistedActiveBattlePlayerLink(state) {
    const battle = state?.activeBattle;
    const rootPlayer = state?.player;
    if (!battle || !Array.isArray(battle.combatants) || !rootPlayer) return [];
    const battlePlayer = battle.combatants.find((combatant) => combatant?.type === 'player');
    if (!battlePlayer) return [];

    const issues = [];
    if (battlePlayer.id !== rootPlayer.id) issues.push('activeBattle player id must match root player id.');
    if (battle.phase !== 'active') return issues;

    comparePlain(battlePlayer.resources, rootPlayer.resources, 'resources', issues);
    comparePlain(battlePlayer.statuses, rootPlayer.statuses, 'statuses', issues);

    const rootSnapshot = clonePlain(rootPlayer);
    delete rootSnapshot.combat;
    delete rootSnapshot.statState;
    rootSnapshot.statState = createCharacterStatState(rootSnapshot);
    const expectedCombat = calculateCombatProfile(rootSnapshot);
    if (!plainEqual(battlePlayer.combat, expectedCombat)) {
        issues.push('activeBattle active player combat profile must match root player combat-driving authority.');
    }
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

function clonePlain(value) {
    if (Array.isArray(value)) return value.map(clonePlain);
    if (!isObject(value)) return value;
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, clonePlain(child)]));
}

function isObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
