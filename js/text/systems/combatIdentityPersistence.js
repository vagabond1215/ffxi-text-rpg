import { createCharacterStatState } from './characterStatEngine.js';
import { calculateCombatProfile } from './statEngine.js';

export const COMBAT_IDENTITY_PERSISTENCE_VERSION = 2;

export function validatePersistedCombatIdentity(state) {
    const issues = [];
    if (!Number.isInteger(state?.combatSequence) || state.combatSequence < 0) {
        return ['combatSequence must be a persisted non-negative integer.'];
    }
    const battle = state?.activeBattle;
    if (battle === null || battle === undefined) return issues;
    if (!battle || typeof battle !== 'object' || Array.isArray(battle)) return issues;

    const expectedId = formatBattleId(state.combatSequence);
    if (state.combatSequence < 1) issues.push('combatSequence must be positive when activeBattle is persisted.');
    if (battle.id !== expectedId) issues.push(`activeBattle.id must match combatSequence as ${expectedId}.`);

    const rootPlayer = state?.player;
    const battlePlayer = Array.isArray(battle.combatants)
        ? battle.combatants.find((combatant) => combatant?.type === 'player') ?? null
        : null;
    if (!rootPlayer || !battlePlayer) return issues;

    if (battlePlayer.id !== rootPlayer.id) issues.push('activeBattle player id must match root player id.');
    if (battle.phase !== 'active') return issues;

    if (!plainEqual(battlePlayer.resources, rootPlayer.resources)) {
        issues.push('activeBattle active player resources must match root player resources.');
    }
    if (!plainEqual(battlePlayer.statuses, rootPlayer.statuses)) {
        issues.push('activeBattle active player statuses must match root player statuses.');
    }
    if (!plainEqual(battlePlayer.equipment, rootPlayer.equipment)) {
        issues.push('activeBattle active player equipment must match root player equipment.');
    }

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

export function formatBattleId(sequence) {
    return `battle-${String(Math.max(0, Number(sequence) || 0)).padStart(6, '0')}`;
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
