import { ELEMENT_KEYS } from '../data/systemConstants.js';

export const CHARACTER_AFFINITY_STATE_VERSION = 1;
export const CHARACTER_AFFINITY_MAX_RANK = 5;

export function createCharacterAffinityState(overrides = {}) {
    const values = Object.fromEntries(ELEMENT_KEYS.map((element) => [element, 0]));
    for (const [element, rank] of Object.entries(overrides.values ?? overrides)) {
        if (ELEMENT_KEYS.includes(element) && validRank(rank)) values[element] = rank;
    }
    return {
        version: CHARACTER_AFFINITY_STATE_VERSION,
        values,
    };
}

export function ensureCharacterAffinityState(player) {
    if (!player || player.type !== 'player') return null;
    player.progression ??= {};
    const existing = player.progression.affinities;
    if (validateCharacterAffinityState(existing).length) {
        player.progression.affinities = createCharacterAffinityState();
    }
    return player.progression.affinities;
}

export function getCharacterAffinityRank(player, element) {
    if (!ELEMENT_KEYS.includes(element)) return 0;
    const state = ensureCharacterAffinityState(player);
    return state?.values?.[element] ?? 0;
}

export function setCharacterAffinityRank(player, element, rank, options = {}) {
    if (!player || player.type !== 'player') return failure('no-player', 'Character affinity requires a player.');
    if (!ELEMENT_KEYS.includes(element)) return failure('unknown-element', `Unknown affinity element: ${String(element)}`);
    if (!validRank(rank)) return failure('invalid-rank', `Affinity rank must be an integer from 0 to ${CHARACTER_AFFINITY_MAX_RANK}.`);

    const state = ensureCharacterAffinityState(player);
    const previousRank = state.values[element];
    state.values[element] = rank;
    return {
        ok: true,
        element,
        previousRank,
        rank,
        gained: rank > previousRank ? rank - previousRank : 0,
        source: String(options.source ?? 'training'),
        worldSeconds: normalizeWorldSeconds(options.worldSeconds),
    };
}

export function gainCharacterAffinity(player, element, amount = 1, options = {}) {
    const current = getCharacterAffinityRank(player, element);
    const gained = Math.max(0, Math.floor(Number(amount) || 0));
    return setCharacterAffinityRank(player, element, Math.min(CHARACTER_AFFINITY_MAX_RANK, current + gained), options);
}

export function validateCharacterAffinityState(value) {
    const issues = [];
    if (!isObject(value)) return ['affinities must be an object.'];
    if (value.version !== CHARACTER_AFFINITY_STATE_VERSION) issues.push(`affinities.version must be ${CHARACTER_AFFINITY_STATE_VERSION}.`);
    if (!isObject(value.values)) return [...issues, 'affinities.values must be an object.'];

    for (const element of ELEMENT_KEYS) {
        if (!Object.hasOwn(value.values, element)) {
            issues.push(`affinities.values.${element} must be persisted.`);
            continue;
        }
        if (!validRank(value.values[element])) issues.push(`affinities.values.${element} must be an integer from 0 to ${CHARACTER_AFFINITY_MAX_RANK}.`);
    }
    for (const element of Object.keys(value.values)) {
        if (!ELEMENT_KEYS.includes(element)) issues.push(`affinities.values contains unknown element ${element}.`);
    }
    return issues;
}

function validRank(value) {
    return Number.isInteger(value) && value >= 0 && value <= CHARACTER_AFFINITY_MAX_RANK;
}

function normalizeWorldSeconds(value) {
    return Number.isInteger(value) && value >= 0 ? value : null;
}

function failure(code, reason) {
    return { ok: false, code, reason };
}

function isObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
