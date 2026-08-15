import { actionFailure, actionSuccess } from './actionResult.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import {
    cancelTimedTask,
    findTimedTask,
    reconcileTimedTasks,
    startTimedTask,
    TIMED_TASK_STATUSES,
} from './timedTaskEngine.js';
import { ensureWorldTimeState } from './worldTimeEngine.js';

export const WORK_STATE_VERSION = 1;
export const WORK_STATUSES = Object.freeze({
    ACTIVE: 'active',
    AWAITING_STORAGE: 'awaitingStorage',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
});

export function createWorkState(options = {}) {
    return {
        version: WORK_STATE_VERSION,
        nextSequence: positiveInteger(options.nextSequence) ? options.nextSequence : 1,
        records: Array.isArray(options.records) ? options.records.map(cloneRecord) : [],
    };
}

export function ensureWorkState(state) {
    if (!state || typeof state !== 'object') throw new Error('Work state requires game state.');
    if (!state.work || typeof state.work !== 'object' || Array.isArray(state.work)) state.work = createWorkState();
    const issues = validateWorkState(state.work);
    if (issues.length) throw new Error(issues.join(' '));
    return state.work;
}

export function startWorkTask(state, definition = {}) {
    const kind = normalizeKind(definition.kind);
    const label = String(definition.label ?? kind).trim();
    const channel = String(definition.channel ?? 'work:character').trim() || 'work:character';
    const durationSeconds = Math.floor(Number(definition.durationSeconds));
    const data = plainObject(definition.data) ? structuredCloneSafe(definition.data) : {};

    if (!validKind(kind)) return failure('work.invalid-kind', { kind }, 'Work kind must be a stable identifier.');
    if (!label) return failure('work.invalid-label', {}, 'Work label is required.');
    if (!positiveInteger(durationSeconds)) return failure('work.invalid-duration', { durationSeconds }, 'Work duration must be a positive whole number of seconds.');

    const registry = ensureWorkState(state);
    const blocking = registry.records.find((record) => record.channel === channel && record.status === WORK_STATUSES.ACTIVE);
    if (blocking) return failure('work.channel-busy', { channel, workId: blocking.id }, `${blocking.label} is already using this work channel.`);

    const sequence = registry.nextSequence++;
    const id = `work-${String(sequence).padStart(6, '0')}`;
    const task = startTimedTask(state, {
        kind: `work.${kind}`,
        label,
        channel,
        durationSeconds,
        data: { workId: id, workKind: kind },
    });
    if (!task.ok) {
        registry.nextSequence -= 1;
        return task;
    }

    const record = {
        id,
        version: WORK_STATE_VERSION,
        kind,
        label,
        channel,
        status: WORK_STATUSES.ACTIVE,
        taskId: task.data.task.id,
        startedAtWorldSeconds: task.data.task.startedAtWorldSeconds,
        completedAtWorldSeconds: null,
        cancelledAtWorldSeconds: null,
        failureCode: null,
        data,
    };
    registry.records.push(record);
    const event = emitSemanticEvent(state, 'work.started', eventData(record), { source: 'workTaskEngine' });
    return actionSuccess({
        action: 'work.start',
        code: 'work.started',
        outcome: 'started',
        data: { work: snapshot(record), task: task.data.task, eventId: event.id },
        display: { text: `Started ${label}; ${durationSeconds}s required.` },
    });
}

export function reconcileWorkTasks(state) {
    reconcileTimedTasks(state);
    const registry = ensureWorkState(state);
    return registry.records
        .filter((record) => record.status === WORK_STATUSES.ACTIVE)
        .map((record) => ({ record, task: findTimedTask(state, record.taskId) }))
        .filter(({ task }) => task?.status === TIMED_TASK_STATUSES.COMPLETED);
}

export function markWorkCompleted(state, workId, data = {}) {
    const record = findWorkRecord(state, workId);
    if (!record) return null;
    if (record.status === WORK_STATUSES.COMPLETED) return snapshot(record);
    record.status = WORK_STATUSES.COMPLETED;
    const task = findTimedTask(state, record.taskId);
    record.completedAtWorldSeconds = task?.completedAtWorldSeconds ?? ensureWorldTimeState(state).totalSeconds;
    record.data = { ...record.data, ...structuredCloneSafe(data) };
    emitSemanticEvent(state, 'work.completed', eventData(record), { source: 'workTaskEngine' });
    return snapshot(record);
}

export function markWorkAwaitingStorage(state, workId, data = {}) {
    const record = findWorkRecord(state, workId);
    if (!record) return null;
    record.status = WORK_STATUSES.AWAITING_STORAGE;
    const task = findTimedTask(state, record.taskId);
    record.completedAtWorldSeconds ??= task?.completedAtWorldSeconds ?? ensureWorldTimeState(state).totalSeconds;
    record.data = { ...record.data, ...structuredCloneSafe(data) };
    emitSemanticEvent(state, 'work.awaiting-storage', eventData(record), { source: 'workTaskEngine' });
    return snapshot(record);
}

export function markWorkFailed(state, workId, code, data = {}) {
    const record = findWorkRecord(state, workId);
    if (!record) return null;
    record.status = WORK_STATUSES.FAILED;
    record.failureCode = String(code ?? 'work.failed');
    const task = findTimedTask(state, record.taskId);
    record.completedAtWorldSeconds ??= task?.completedAtWorldSeconds ?? ensureWorldTimeState(state).totalSeconds;
    record.data = { ...record.data, ...structuredCloneSafe(data) };
    emitSemanticEvent(state, 'work.failed', eventData(record), { source: 'workTaskEngine' });
    return snapshot(record);
}

export function cancelWorkTask(state, workId) {
    const record = findWorkRecord(state, workId);
    if (!record) return failure('work.not-found', { workId }, `Unknown work record: ${workId}`);
    if (record.status !== WORK_STATUSES.ACTIVE) return failure('work.not-active', { workId, status: record.status }, `${record.label} is ${record.status}.`);
    const task = findTimedTask(state, record.taskId);
    if (task?.status === TIMED_TASK_STATUSES.ACTIVE) cancelTimedTask(state, task.id);
    record.status = WORK_STATUSES.CANCELLED;
    record.cancelledAtWorldSeconds = ensureWorldTimeState(state).totalSeconds;
    const event = emitSemanticEvent(state, 'work.cancelled', eventData(record), { source: 'workTaskEngine' });
    return actionSuccess({
        action: 'work.cancel',
        code: 'work.cancelled',
        outcome: 'cancelled',
        data: { work: snapshot(record), eventId: event.id },
        display: { text: `Cancelled ${record.label}.` },
    });
}

export function findWorkRecord(state, workId) {
    const id = String(workId ?? '').trim();
    if (!id) return null;
    return ensureWorkState(state).records.find((record) => record.id === id) ?? null;
}

export function listWorkRecords(state, options = {}) {
    const kind = options.kind ? normalizeKind(options.kind) : null;
    const status = options.status ? String(options.status) : null;
    return ensureWorkState(state).records
        .filter((record) => (!kind || record.kind === kind) && (!status || record.status === status))
        .map(snapshot);
}

export function validateWorkState(registry) {
    if (!registry || typeof registry !== 'object' || Array.isArray(registry)) return ['work must be an object.'];
    const issues = [];
    if (registry.version !== WORK_STATE_VERSION) issues.push(`work.version must be ${WORK_STATE_VERSION}.`);
    if (!positiveInteger(registry.nextSequence)) issues.push('work.nextSequence must be positive.');
    if (!Array.isArray(registry.records)) return [...issues, 'work.records must be an array.'];
    const ids = new Set();
    let maxSequence = 0;
    for (const [index, record] of registry.records.entries()) {
        const prefix = `work.records[${index}]`;
        if (!plainObject(record)) { issues.push(`${prefix} must be an object.`); continue; }
        if (!/^work-\d{6,}$/.test(record.id ?? '')) issues.push(`${prefix}.id is invalid.`);
        if (ids.has(record.id)) issues.push(`${prefix}.id duplicates ${record.id}.`);
        ids.add(record.id);
        maxSequence = Math.max(maxSequence, Number.parseInt(String(record.id ?? '').replace('work-', ''), 10) || 0);
        if (record.version !== WORK_STATE_VERSION) issues.push(`${prefix}.version must be ${WORK_STATE_VERSION}.`);
        if (!validKind(record.kind)) issues.push(`${prefix}.kind is invalid.`);
        if (!Object.values(WORK_STATUSES).includes(record.status)) issues.push(`${prefix}.status is invalid.`);
        if (!/^task-\d{6,}$/.test(record.taskId ?? '')) issues.push(`${prefix}.taskId is invalid.`);
        if (!nonNegativeInteger(record.startedAtWorldSeconds)) issues.push(`${prefix}.startedAtWorldSeconds is invalid.`);
        if (!plainObject(record.data)) issues.push(`${prefix}.data must be an object.`);
    }
    if (registry.nextSequence <= maxSequence) issues.push('work.nextSequence must be greater than stored work sequences.');
    return issues;
}

function snapshot(record) {
    return Object.freeze({ ...record, data: Object.freeze(structuredCloneSafe(record.data)) });
}
function cloneRecord(record) { return { ...record, data: structuredCloneSafe(record?.data) }; }
function eventData(record) {
    return {
        workId: record.id,
        kind: record.kind,
        label: record.label,
        channel: record.channel,
        status: record.status,
        taskId: record.taskId,
        startedAtWorldSeconds: record.startedAtWorldSeconds,
        completedAtWorldSeconds: record.completedAtWorldSeconds,
        cancelledAtWorldSeconds: record.cancelledAtWorldSeconds,
        failureCode: record.failureCode,
        data: structuredCloneSafe(record.data),
    };
}
function structuredCloneSafe(value) {
    if (!value || typeof value !== 'object') return value ?? {};
    return JSON.parse(JSON.stringify(value));
}
function failure(code, data, text) {
    return actionFailure({ action: 'work', code, outcome: 'rejected', data, display: { text } });
}
function normalizeKind(value) { return String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9.-]+/g, '-').replace(/^-+|-+$/g, ''); }
function validKind(value) { return /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(value); }
function positiveInteger(value) { return Number.isInteger(value) && value > 0; }
function nonNegativeInteger(value) { return Number.isInteger(value) && value >= 0; }
function plainObject(value) { return Boolean(value && typeof value === 'object' && !Array.isArray(value)); }
