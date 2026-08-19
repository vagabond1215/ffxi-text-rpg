import { ENTITY_TYPES } from '../data/systemConstants.js';
import { listNations } from '../data/nations.js';
import { getPlace } from '../data/places.js';
import { RACES } from '../data/races.js';

const PLAYER_NAME_MAX_LENGTH = 24;
const PLAYER_TITLE_MAX_LENGTH = 80;

export function validatePersistedPlayerEnvelope(player) {
    if (!isObject(player)) return ['player must be an object.'];
    const issues = [];
    if (typeof player.id !== 'string' || !player.id.trim() || player.id !== player.id.trim()) {
        issues.push('id must be a normalized non-empty string.');
    }
    if (player.type !== ENTITY_TYPES.PLAYER) issues.push(`type must be ${ENTITY_TYPES.PLAYER}.`);
    return issues;
}

export function validatePersistedPlayerIdentity(identity) {
    if (!isObject(identity)) return ['identity must be an object.'];
    const issues = [];

    validateNormalizedString(identity.name, 'identity.name', issues, { maxLength: PLAYER_NAME_MAX_LENGTH });

    const race = typeof identity.raceId === 'string' ? RACES[identity.raceId] ?? null : null;
    if (!race) {
        issues.push(`identity.raceId references unknown ancestry ${String(identity.raceId)}.`);
    } else {
        if (identity.raceName !== race.name) issues.push(`identity.raceName must match canonical ancestry name ${race.name}.`);
        if (!race.allowedSexes.includes(identity.sex)) issues.push(`identity.sex ${String(identity.sex)} is not valid for ancestry ${race.id}.`);
    }

    const nation = listNations().find((entry) => entry.name === identity.nation) ?? null;
    if (!nation) {
        issues.push(`identity.nation references unknown canonical power ${String(identity.nation)}.`);
    } else {
        const startingPlace = getPlace(nation.startingPlaceId);
        if (!startingPlace || identity.startingCity !== startingPlace.name) {
            issues.push(`identity.startingCity must match ${nation.name} origin ${startingPlace?.name ?? nation.startingPlaceId}.`);
        }
    }

    validateNormalizedString(identity.title, 'identity.title', issues, { maxLength: PLAYER_TITLE_MAX_LENGTH });
    return issues;
}

export function validatePersistedPlayerKeyItems(keyItems) {
    if (!Array.isArray(keyItems)) return ['keyItems must be an array.'];
    const issues = [];
    const seen = new Set();
    keyItems.forEach((keyItemId, index) => {
        const path = `keyItems[${index}]`;
        if (typeof keyItemId !== 'string' || !keyItemId.trim() || keyItemId !== keyItemId.trim()) {
            issues.push(`${path} must be a normalized non-empty string id.`);
            return;
        }
        if (seen.has(keyItemId)) issues.push(`${path} duplicates key item ${keyItemId}.`);
        seen.add(keyItemId);
    });
    return issues;
}

export function validatePersistedPlayerFlags(flags) {
    return validateBooleanFlagMap(flags, 'flags');
}

export function validatePersistedWorldFlags(flags) {
    return validateBooleanFlagMap(flags, 'flags');
}

function validateBooleanFlagMap(flags, path) {
    if (!isObject(flags)) return [`${path} must be an object.`];
    const issues = [];
    for (const [flagId, value] of Object.entries(flags)) {
        if (!flagId.trim() || flagId !== flagId.trim()) issues.push(`${path} key ${JSON.stringify(flagId)} must be a normalized non-empty id.`);
        if (typeof value !== 'boolean') issues.push(`${path}.${flagId} must be boolean.`);
    }
    return issues;
}

function validateNormalizedString(value, path, issues, options = {}) {
    if (typeof value !== 'string' || !value.trim()) {
        issues.push(`${path} must be a non-empty string.`);
        return;
    }
    if (value !== value.trim()) issues.push(`${path} must not have leading or trailing whitespace.`);
    if (options.maxLength && value.length > options.maxLength) issues.push(`${path} must be at most ${options.maxLength} characters.`);
}

function isObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
