import { actionFailure, actionSuccess } from './actionResult.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import { ensureWorldTimeState } from './worldTimeEngine.js';

export const TIMED_TASK_STATE_VERSION = 1;
export const TIMED_TASK_STATUSES = Object.freeze({
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
});

export function createTimedTaskState(options = {}) {
    return {
        version: TIMED_TASK_STATE_VERSION,
        nextSequence: positiveInteger(options.nextSequence) ? options.nextSequence : 1,
        records: Array.isArray(options.records) ? [...options.records] : [],
    };
}

export function ensureTimedTaskState(state) {
    if (!state || typeof state !== 'object') throw new Error('Timed tasks require game state.');
    if (!state.tasks || typeof state.tasks !== 'object' || Array.isArray(state.tasks)) {
        state.tasks = createTimedTaskState();
    }
    const issues = validateTimedTaskState(state.tasks);
    if (issues.length) throw new Error(issues.join(' '));
    return state.tasks;
}

export function startTimedTask(state, definition = {}) {
    const kind = String(definition.kind ?? '').trim();
    const durationSeconds = Number(definition.durationSeconds);
    const label = String(definition.label ?? kind).trim();
    const channel = String(definition.channel ?? 'character').trim() || 'character';
    const data = definition.data ?? {};

    if (!validKind(kind)) return failure('task.invalid-kind', { kind }, 'Timed task kind is required and must be a stable identifier.');
    if (!positiveInteger(durationSeconds)) return failure('task.invalid-duration', { durationSeconds: definition.durationSeconds }, 'Timed task duration must be a positive whole number of seconds.');
    if (!plainObject(data)) return failure('task.invalid-data', {}, 'Timed task data must be an object.');

    const worldTime = ensureWorldTimeState(state);
    const tasks = ensureTimedTaskState(state);
    const sequence = tasks.nextSequence++;
    const id = `task-${String(sequence).padStart(6, '0')}`;
    const startedAtWorldSeconds = worldTime.totalSeconds;
    const task = {
        id,
        version: TIMED_TASK_STATE_VERSION,
        kind,
        label: label || kind,
        channel,
        status: TIMED_TASK_STATUSES.ACTIVE,
        durationSeconds,
        startedAtWorldSeconds,
        completesAtWorldSeconds: startedAtWorldSeconds + durationSeconds,
        completedAtWorldSeconds: null,
        cancelledAtWorldSeconds: null,
        data: { ...data },
    };
    tasks.records.push(task);

    const event = emitSemanticEvent(state, 'task.started', taskEventData(task), { source: 'timedTaskEngine' });
    return actionSuccess({
        action: 'task.start',
        code: 'task.started',
        outcome: 'started',
        data: { task: snapshotTask(task), eventId: event.id },
        display: { text: `Started ${task.label}; duration ${durationSeconds}s.` },
    });
}

export function reconcileTimedTasks(state) {
    const tasks = ensureTimedTaskState(state);
    const now = ensureWorldTimeState(state).totalSeconds;
    const completed = [];

    for (const task of tasks.records) {
        if (task.status !== TIMED_TASK_STATUSES.ACTIVE) continue;
        if (now < task.completesAtWorldSeconds) continue;
        task.status = TIMED_TASK_STATUSES.COMPLETED;
        task.completedAtWorldSeconds = task.completesAtWorldSeconds;
        const event = emitSemanticEvent(state, 'task.completed', taskEventData(task), { source: 'timedTaskEngine' });
        completed.push({ task: snapshotTask(task), eventId: event.id });
    }

    return completed;
}

export function cancelTimedTask(state, taskId) {
    const task = findTimedTask(state, taskId);
    if (!task) return failure('task.not-found', { taskId }, `Unknown timed task: ${taskId}`);
    if (task.status !== TIMED_TASK_STATUSES.ACTIVE) {
        return failure('task.not-active', { task: snapshotTask(task) }, `${task.label} is ${task.status} and cannot be cancelled.`);
    }

    task.status = TIMED_TASK_STATUSES.CANCELLED;
    task.cancelledAtWorldSeconds = ensureWorldTimeState(state).totalSeconds;
    const event = emitSemanticEvent(state, 'task.cancelled', taskEventData(task), { source: 'timedTaskEngine' });
    return actionSuccess({
        action: 'task.cancel',
        code: 'task.cancelled',
        outcome: 'cancelled',
        data: { task: snapshotTask(task), eventId: event.id },
        display: { text: `Cancelled ${task.label}.` },
    });
}

export function releaseTimedTask(state, taskId) {
    const tasks = ensureTimedTaskState(state);
    const id = String(taskId ?? '').trim();
    if (!id) return failure('task.release-invalid-id', { taskId }, 'A timed task id is required for release.');
    const index = tasks.records.findIndex((task) => task.id === id);
    if (index < 0) return failure('task.not-found', { taskId: id }, `Unknown timed task: ${id}`);
    const task = tasks.records[index];
    if (task.status === TIMED_TASK_STATUSES.ACTIVE) {
        return failure('task.release-active', { task: snapshotTask(task) }, `${task.label} is still active and cannot be released.`);
    }

    tasks.records.splice(index, 1);
    return actionSuccess({
        action: 'task.release',
        code: 'task.released',
        outcome: 'released',
        data: { task: snapshotTask(task) },
        display: { text: `Released terminal task ${task.label}.` },
    });
}

export function getTimedTaskProgress(state, taskId) {
    const task = findTimedTask(state, taskId);
    if (!task) return null;
    const now = ensureWorldTimeState(state).totalSeconds;
    const terminalAt = task.completedAtWorldSeconds ?? task.cancelledAtWorldSeconds ?? now;
    const observedAt = task.status === TIMED_TASK_STATUSES.ACTIVE ? now : terminalAt;
    const elapsedSeconds = Math.max(0, Math.min(task.durationSeconds, observedAt - task.startedAtWorldSeconds));
    const remainingSeconds = Math.max(0, task.durationSeconds - elapsedSeconds);
    return Object.freeze({
        taskId: task.id,
        status: task.status,
        elapsedSeconds,
        remainingSeconds,
        progress: elapsedSeconds / task.durationSeconds,
        due: task.status === TIMED_TASK_STATUSES.ACTIVE && now >= task.completesAtWorldSeconds,
    });
}

export function findTimedTask(state, taskId) {
    const id = String(taskId ?? '').trim();
    if (!id) return null;
    return ensureTimedTaskState(state).records.find((task) => task.id === id) ?? null;
}

export function listTimedTasks(state, options = {}) {
    const status = options.status ? String(options.status) : null;
    const channel = options.channel ? String(options.channel) : null;
    return ensureTimedTaskState(state).records
        .filter((task) => (!status || task.status === status) && (!channel || task.channel === channel))
        .map(snapshotTask);
}

export function validateTimedTaskState(tasks) {
    if (!tasks || typeof tasks !== 'object' || Array.isArray(tasks)) return ['tasks must be an object.'];
    const issues = [];
    if (tasks.version !== TIMED_TASK_STATE_VERSION) issues.push(`tasks.version must be ${TIMED_TASK_STATE_VERSION}.`);
    if (!positiveInteger(tasks.nextSequence)) issues.push('tasks.nextSequence must be a positive integer.');
    if (!Array.isArray(tasks.records)) return [...issues, 'tasks.records must be an array.'];

    const ids = new Set();
    let maxSequence = 0;
    for (const [index, task] of tasks.records.entries()) {
        const prefix = `tasks.records[${index}]`;
        if (!task || typeof task !== 'object' || Array.isArray(task)) {
            issues.push(`${prefix} must be an object.`);
            continue;
        }
        if (!/^task-\d{6,}$/.test(task.id ?? '')) issues.push(`${prefix}.id is invalid.`);
        if (ids.has(task.id)) issues.push(`${prefix}.id duplicates ${task.id}.`);
        ids.add(task.id);
        maxSequence = Math.max(maxSequence, Number.parseInt(String(task.id ?? '').replace('task-', ''), 10) || 0);
        if (!validKind(task.kind)) issues.push(`${prefix}.kind is invalid.`);
        if (!Object.values(TIMED_TASK_STATUSES).includes(task.status)) issues.push(`${prefix}.status is invalid.`);
        if (!positiveInteger(task.durationSeconds)) issues.push(`${prefix}.durationSeconds must be positive.`);
        if (!nonNegativeInteger(task.startedAtWorldSeconds)) issues.push(`${prefix}.startedAtWorldSeconds is invalid.`);
        if (!nonNegativeInteger(task.completesAtWorldSeconds)) issues.push(`${prefix}.completesAtWorldSeconds is invalid.`);
        if (nonNegativeInteger(task.startedAtWorldSeconds) && nonNegativeInteger(task.completesAtWorldSeconds)
            && task.completesAtWorldSeconds !== task.startedAtWorldSeconds + task.durationSeconds) {
            issues.push(`${prefix}.completesAtWorldSeconds does not match duration.`);
        }
        if (!plainObject(task.data)) issues.push(`${prefix}.data must be an object.`);
    }
    if (tasks.nextSequence <= maxSequence) issues.push('tasks.nextSequence must be greater than stored task sequences.');
    return issues;
}

function snapshotTask(task) {
    return Object.freeze({ ...task, data: Object.freeze({ ...task.data }) });
}

function taskEventData(task) {
    return {
        taskId: task.id,
        kind: task.kind,
        label: task.label,
        channel: task.channel,
        status: task.status,
        durationSeconds: task.durationSeconds,
        startedAtWorldSeconds: task.startedAtWorldSeconds,
        completesAtWorldSeconds: task.completesAtWorldSeconds,
        completedAtWorldSeconds: task.completedAtWorldSeconds,
        cancelledAtWorldSeconds: task.cancelledAtWorldSeconds,
        data: { ...task.data },
    };
}

function failure(code, data, text) {
    return actionFailure({ action: 'task', code, outcome: 'rejected', data, display: { text } });
}
function validKind(value) { return /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(value); }
function positiveInteger(value) { return Number.isInteger(value) && value > 0; }
function nonNegativeInteger(value) { return Number.isInteger(value) && value >= 0; }
function plainObject(value) { return Boolean(value && typeof value === 'object' && !Array.isArray(value)); }
