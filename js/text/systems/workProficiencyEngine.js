import { emitSemanticEvent } from './semanticEventEngine.js';

export const WORK_PROFICIENCY_STATE_VERSION = 1;
export const WORK_PROFICIENCY_IDS = Object.freeze([
    'foraging',
    'logging',
    'mining',
    'gathering',
    'fishing',
    'fieldDressing',
    'salvage',
    'metalworking',
    'crafting',
    'cooking',
]);

export function ensureWorkProficiencies(player) {
    if (!player || typeof player !== 'object') throw new Error('Work proficiency requires a player.');
    player.progression ??= {};
    const current = player.progression.workProficiencies;
    if (!current || typeof current !== 'object' || Array.isArray(current)) {
        player.progression.workProficiencies = { version: WORK_PROFICIENCY_STATE_VERSION, values: {} };
    }
    const state = player.progression.workProficiencies;
    state.version ??= WORK_PROFICIENCY_STATE_VERSION;
    state.values ??= {};
    const issues = validateWorkProficiencies(state);
    if (issues.length) throw new Error(issues.join(' '));
    return state;
}

export function getWorkProficiency(player, proficiencyId) {
    const id = normalizeId(proficiencyId);
    if (!WORK_PROFICIENCY_IDS.includes(id)) return 0;
    return ensureWorkProficiencies(player).values[id] ?? 0;
}

export function getWorkProficiencyMap(player) {
    const state = ensureWorkProficiencies(player);
    return Object.fromEntries(WORK_PROFICIENCY_IDS.map((id) => [id, state.values[id] ?? 0]));
}

export function gainWorkProficiency(state, proficiencyId, amount = 1, options = {}) {
    const player = state?.player ?? state;
    const id = normalizeId(proficiencyId);
    if (!WORK_PROFICIENCY_IDS.includes(id)) return { ok: false, reason: `Unknown work proficiency: ${proficiencyId}` };
    const gain = Math.max(0, Math.floor(Number(amount) || 0));
    const record = ensureWorkProficiencies(player);
    const before = record.values[id] ?? 0;
    const after = Math.min(Math.max(before, before + gain), Math.max(1, Number(options.cap ?? 9999)));
    record.values[id] = after;

    let eventId = null;
    if (state?.player && after > before) {
        const event = emitSemanticEvent(state, 'work.proficiency-gained', {
            proficiencyId: id,
            before,
            after,
            gained: after - before,
            sourceId: options.sourceId ?? null,
        }, { source: 'workProficiencyEngine' });
        eventId = event.id;
    }
    return { ok: true, proficiencyId: id, before, after, gained: after - before, eventId };
}

export function workDurationForProficiency(baseSeconds, proficiency) {
    const base = Math.max(1, Math.ceil(Number(baseSeconds) || 1));
    const value = Math.max(0, Number(proficiency) || 0);
    const multiplier = Math.max(0.5, 1 / (1 + value / 100));
    return Math.max(1, Math.ceil(base * multiplier));
}

export function validateWorkProficiencies(record) {
    if (!record || typeof record !== 'object' || Array.isArray(record)) return ['workProficiencies must be an object.'];
    const issues = [];
    if (record.version !== WORK_PROFICIENCY_STATE_VERSION) issues.push(`workProficiencies.version must be ${WORK_PROFICIENCY_STATE_VERSION}.`);
    if (!record.values || typeof record.values !== 'object' || Array.isArray(record.values)) return [...issues, 'workProficiencies.values must be an object.'];
    for (const [id, value] of Object.entries(record.values)) {
        if (!WORK_PROFICIENCY_IDS.includes(id)) issues.push(`workProficiencies.values.${id} is unknown.`);
        if (!Number.isInteger(value) || value < 0) issues.push(`workProficiencies.values.${id} must be a non-negative integer.`);
    }
    return issues;
}

function normalizeId(value) {
    return String(value ?? '').trim();
}
