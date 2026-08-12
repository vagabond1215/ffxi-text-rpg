export const SEMANTIC_EVENT_VERSION = 1;
export const DEFAULT_EVENT_HISTORY_LIMIT = 200;

export function createSemanticEventState(options = {}) {
    const nextSequence = Number.isInteger(options.nextSequence) && options.nextSequence > 0
        ? options.nextSequence
        : 1;
    const records = Array.isArray(options.records) ? [...options.records] : [];
    return { nextSequence, records };
}

export function ensureSemanticEventState(state) {
    if (!state || typeof state !== 'object') throw new Error('Semantic events require game state.');
    if (!state.events || typeof state.events !== 'object' || Array.isArray(state.events)) {
        state.events = createSemanticEventState();
    }
    if (!Number.isInteger(state.events.nextSequence) || state.events.nextSequence < 1) {
        const maxSequence = Array.isArray(state.events.records)
            ? state.events.records.reduce((max, event) => Math.max(max, Number(event?.sequence) || 0), 0)
            : 0;
        state.events.nextSequence = maxSequence + 1;
    }
    if (!Array.isArray(state.events.records)) state.events.records = [];
    return state.events;
}

export function emitSemanticEvent(state, type, data = {}, options = {}) {
    if (!isEventType(type)) throw new Error(`Invalid semantic event type: ${type}`);
    if (!isPlainObject(data)) throw new Error('Semantic event data must be an object.');

    const eventState = ensureSemanticEventState(state);
    const sequence = eventState.nextSequence;
    eventState.nextSequence += 1;

    const event = Object.freeze({
        id: `evt-${String(sequence).padStart(6, '0')}`,
        version: SEMANTIC_EVENT_VERSION,
        sequence,
        type,
        source: normalizeSource(options.source),
        worldTimeSeconds: Number.isFinite(state.worldTime?.totalSeconds) ? state.worldTime.totalSeconds : null,
        data: Object.freeze({ ...data }),
    });

    eventState.records.push(event);
    const limit = normalizeLimit(options.historyLimit ?? DEFAULT_EVENT_HISTORY_LIMIT);
    if (eventState.records.length > limit) {
        eventState.records.splice(0, eventState.records.length - limit);
    }
    return event;
}

export function listSemanticEvents(state, options = {}) {
    const eventState = ensureSemanticEventState(state);
    const type = options.type ? String(options.type) : null;
    const afterSequence = Number.isInteger(options.afterSequence) ? options.afterSequence : 0;
    const limit = normalizeLimit(options.limit ?? DEFAULT_EVENT_HISTORY_LIMIT);
    return eventState.records
        .filter((event) => (!type || event.type === type) && event.sequence > afterSequence)
        .slice(-limit);
}

export function hasSemanticEvent(state, type, predicate = null) {
    return listSemanticEvents(state, { type }).some((event) => (
        typeof predicate === 'function' ? predicate(event) : true
    ));
}

export function isSemanticEvent(value) {
    return Boolean(
        value
        && typeof value.id === 'string'
        && value.version === SEMANTIC_EVENT_VERSION
        && Number.isInteger(value.sequence)
        && value.sequence > 0
        && isEventType(value.type)
        && typeof value.source === 'string'
        && isPlainObject(value.data),
    );
}

export function validateSemanticEventState(eventState) {
    const issues = [];
    if (!eventState || typeof eventState !== 'object' || Array.isArray(eventState)) return ['events must be an object.'];
    if (!Number.isInteger(eventState.nextSequence) || eventState.nextSequence < 1) issues.push('events.nextSequence must be a positive integer.');
    if (!Array.isArray(eventState.records)) return [...issues, 'events.records must be an array.'];

    let previousSequence = 0;
    const ids = new Set();
    for (const [index, event] of eventState.records.entries()) {
        if (!isSemanticEvent(event)) {
            issues.push(`events.records[${index}] is not a valid semantic event.`);
            continue;
        }
        if (ids.has(event.id)) issues.push(`events.records[${index}] duplicates event id ${event.id}.`);
        ids.add(event.id);
        if (event.sequence <= previousSequence) issues.push('events.records must be ordered by increasing sequence.');
        previousSequence = event.sequence;
    }
    if (previousSequence >= eventState.nextSequence) issues.push('events.nextSequence must be greater than all stored event sequences.');
    return issues;
}

function normalizeLimit(value) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_EVENT_HISTORY_LIMIT;
    return parsed;
}

function normalizeSource(value) {
    const source = String(value ?? 'system').trim();
    return source || 'system';
}

function isEventType(value) {
    return typeof value === 'string' && /^[a-z][a-z0-9]*(?:\.[a-z0-9-]+)+$/.test(value);
}

function isPlainObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
