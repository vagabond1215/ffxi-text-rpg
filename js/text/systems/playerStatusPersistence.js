import {
    ATTRIBUTE_KEYS,
    DERIVED_STAT_KEYS,
    ELEMENT_KEYS,
    RESOURCE_KEYS,
    STATUS_CATEGORIES,
} from '../data/systemConstants.js';

export const PLAYER_STATUS_PERSISTENCE_VERSION = 1;
const STACK_RULES = Object.freeze(['replace', 'ignore']);
const MODIFIER_CATEGORIES = Object.freeze({
    attributes: ATTRIBUTE_KEYS,
    resources: RESOURCE_KEYS,
    derived: DERIVED_STAT_KEYS,
    resistances: ELEMENT_KEYS,
});

export function validatePersistedPlayerStatuses(statuses) {
    const issues = [];
    if (!Array.isArray(statuses)) return ['statuses must be an array.'];
    const stackGroups = new Set();

    statuses.forEach((status, index) => {
        const path = `statuses[${index}]`;
        if (!isObject(status)) {
            issues.push(`${path} must be an object.`);
            return;
        }
        if (!nonEmptyString(status.id)) issues.push(`${path}.id must be a non-empty string.`);
        if (!nonEmptyString(status.name)) issues.push(`${path}.name must be a non-empty string.`);
        if (!Object.values(STATUS_CATEGORIES).includes(status.category)) issues.push(`${path}.category is invalid.`);
        if (status.sourceId !== null && !nonEmptyString(status.sourceId)) issues.push(`${path}.sourceId must be null or a non-empty string.`);
        validateNullableNonNegativeInteger(status.durationSeconds, `${path}.durationSeconds`, issues);
        validateNullableNonNegativeInteger(status.remainingSeconds, `${path}.remainingSeconds`, issues);
        validateNullableNonNegativeInteger(status.appliedAtWorldSeconds, `${path}.appliedAtWorldSeconds`, issues);
        validateNullableNonNegativeInteger(status.expiresAtWorldSeconds, `${path}.expiresAtWorldSeconds`, issues);
        validateNullablePositiveInteger(status.tickSeconds, `${path}.tickSeconds`, issues);
        if (!Number.isFinite(status.tickAccumulator) || status.tickAccumulator < 0) issues.push(`${path}.tickAccumulator must be a non-negative number.`);
        if (Number.isInteger(status.tickSeconds) && status.tickSeconds > 0 && Number.isFinite(status.tickAccumulator) && status.tickAccumulator >= status.tickSeconds) {
            issues.push(`${path}.tickAccumulator must be less than tickSeconds.`);
        }
        if (!nonEmptyString(status.stackGroup)) issues.push(`${path}.stackGroup must be a non-empty string.`);
        else if (stackGroups.has(status.stackGroup)) issues.push(`${path}.stackGroup duplicates ${status.stackGroup}.`);
        else stackGroups.add(status.stackGroup);
        if (!STACK_RULES.includes(status.stackRule)) issues.push(`${path}.stackRule is invalid.`);
        issues.push(...validateModifierBlock(status.modifiers, `${path}.modifiers`));
        issues.push(...validateTick(status.tick, `${path}.tick`));
        if (!isObject(status.flags)) issues.push(`${path}.flags must be an object.`);

        if (Number.isInteger(status.appliedAtWorldSeconds) && Number.isInteger(status.durationSeconds)) {
            const expectedExpiry = status.appliedAtWorldSeconds + status.durationSeconds;
            if (status.expiresAtWorldSeconds !== expectedExpiry) issues.push(`${path}.expiresAtWorldSeconds must equal appliedAtWorldSeconds + durationSeconds.`);
        }
        if (Number.isInteger(status.remainingSeconds) && Number.isInteger(status.durationSeconds) && status.remainingSeconds > status.durationSeconds) {
            issues.push(`${path}.remainingSeconds cannot exceed durationSeconds.`);
        }
    });
    return issues;
}

function validateModifierBlock(modifiers, path) {
    const issues = [];
    if (!isObject(modifiers)) return [`${path} must be an object.`];
    for (const key of Object.keys(modifiers)) {
        if (!Object.hasOwn(MODIFIER_CATEGORIES, key)) {
            issues.push(`${path}.${key} is not a canonical modifier category.`);
            continue;
        }
        const block = modifiers[key];
        if (!isObject(block)) {
            issues.push(`${path}.${key} must be an object.`);
            continue;
        }
        for (const [modifierId, amount] of Object.entries(block)) {
            if (!MODIFIER_CATEGORIES[key].includes(modifierId)) issues.push(`${path}.${key}.${modifierId} is not a canonical modifier key.`);
            if (!Number.isFinite(amount)) issues.push(`${path}.${key}.${modifierId} must be numeric.`);
        }
    }
    for (const category of Object.keys(MODIFIER_CATEGORIES)) {
        if (!isObject(modifiers[category])) issues.push(`${path}.${category} must be an object.`);
    }
    return issues;
}

function validateTick(tick, path) {
    if (tick === null) return [];
    if (!isObject(tick)) return [`${path} must be null or an object.`];
    const issues = [];
    for (const [key, amount] of Object.entries(tick)) {
        if (!RESOURCE_KEYS.includes(key)) issues.push(`${path}.${key} is not a canonical resource key.`);
        if (!Number.isFinite(amount)) issues.push(`${path}.${key} must be numeric.`);
    }
    return issues;
}

function validateNullableNonNegativeInteger(value, path, issues) {
    if (value === null) return;
    if (!Number.isInteger(value) || value < 0) issues.push(`${path} must be null or a non-negative integer.`);
}

function validateNullablePositiveInteger(value, path, issues) {
    if (value === null) return;
    if (!Number.isInteger(value) || value <= 0) issues.push(`${path} must be null or a positive integer.`);
}

function nonEmptyString(value) {
    return typeof value === 'string' && Boolean(value.trim());
}

function isObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
