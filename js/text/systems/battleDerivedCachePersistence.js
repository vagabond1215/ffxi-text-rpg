import { createCharacterStatState } from './characterStatEngine.js';
import { calculateCombatProfile } from './statEngine.js';

export const BATTLE_DERIVED_CACHE_PERSISTENCE_VERSION = 1;

export function validatePersistedBattleDerivedCaches(combatant, path = 'combatant') {
    if (!isObject(combatant)) return [`${path} must be an object.`];
    const issues = [];
    const deterministic = clonePlain(combatant);
    delete deterministic.combat;

    if (combatant.type === 'player') {
        const expectedStatState = createCharacterStatState(deterministic);
        if (!plainEqual(combatant.statState, expectedStatState)) {
            issues.push(`${path}.statState must match the deterministic player stat cache.`);
        }
        deterministic.statState = expectedStatState;
    }

    const expectedCombat = calculateCombatProfile(deterministic);
    if (!plainEqual(combatant.combat, expectedCombat)) {
        issues.push(`${path}.combat must match the deterministic combat cache.`);
    }
    return issues;
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
