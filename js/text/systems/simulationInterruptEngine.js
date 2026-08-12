import { actionFailure, actionSuccess } from './actionResult.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import { listTimedTasks, reconcileTimedTasks } from './timedTaskEngine.js';
import { advanceWorldTime, ensureWorldTimeState } from './worldTimeEngine.js';

export const INTERRUPT_PRIORITIES = Object.freeze({
    CRITICAL: 1000,
    COMBAT: 900,
    EXHAUSTION: 800,
    TOOL_FAILURE: 700,
    PROJECT_COMPLETION: 600,
    TASK_COMPLETION: 500,
    DAY_BOUNDARY: 400,
    DEFAULT: 100,
});

export function createInterruptCandidate(options = {}) {
    const type = String(options.type ?? '').trim();
    const atWorldSeconds = Number(options.atWorldSeconds);
    const priority = options.priority ?? priorityForInterruptType(type);
    const source = String(options.source ?? 'system').trim() || 'system';
    const data = options.data ?? {};
    const id = String(options.id ?? `${type}@${atWorldSeconds}`).trim();

    if (!validType(type)) throw new Error(`Invalid interrupt type: ${type}`);
    if (!nonNegativeInteger(atWorldSeconds)) throw new Error('Interrupt atWorldSeconds must be a non-negative integer.');
    if (!Number.isInteger(priority)) throw new Error('Interrupt priority must be an integer.');
    if (!plainObject(data)) throw new Error('Interrupt data must be an object.');

    return Object.freeze({ id, type, atWorldSeconds, priority, source, data: Object.freeze({ ...data }) });
}

export function priorityForInterruptType(type) {
    const value = String(type ?? '');
    if (value.startsWith('critical.')) return INTERRUPT_PRIORITIES.CRITICAL;
    if (value.startsWith('combat.')) return INTERRUPT_PRIORITIES.COMBAT;
    if (value.startsWith('exhaustion.')) return INTERRUPT_PRIORITIES.EXHAUSTION;
    if (value.startsWith('tool.failure')) return INTERRUPT_PRIORITIES.TOOL_FAILURE;
    if (value.startsWith('project.completed')) return INTERRUPT_PRIORITIES.PROJECT_COMPLETION;
    if (value.startsWith('task.completed')) return INTERRUPT_PRIORITIES.TASK_COMPLETION;
    if (value.startsWith('day.boundary')) return INTERRUPT_PRIORITIES.DAY_BOUNDARY;
    return INTERRUPT_PRIORITIES.DEFAULT;
}

export function collectInterruptCandidates(state, options = {}) {
    const now = ensureWorldTimeState(state).totalSeconds;
    const horizon = options.maxSeconds === undefined
        ? Number.POSITIVE_INFINITY
        : now + normalizeRequestedSeconds(options.maxSeconds);
    const candidates = [];

    if (options.includeTaskCompletions !== false) {
        for (const task of listTimedTasks(state, { status: 'active' })) {
            if (task.completesAtWorldSeconds < now || task.completesAtWorldSeconds > horizon) continue;
            candidates.push(createInterruptCandidate({
                id: `task-completion:${task.id}`,
                type: 'task.completed',
                atWorldSeconds: task.completesAtWorldSeconds,
                priority: INTERRUPT_PRIORITIES.TASK_COMPLETION,
                source: 'timedTaskEngine',
                data: { taskId: task.id, kind: task.kind, channel: task.channel },
            }));
        }
    }

    for (const raw of options.candidates ?? []) {
        const candidate = createInterruptCandidate(raw);
        if (candidate.atWorldSeconds >= now && candidate.atWorldSeconds <= horizon) candidates.push(candidate);
    }

    for (const provider of options.providers ?? []) {
        if (typeof provider !== 'function') throw new Error('Interrupt providers must be functions.');
        const provided = provider({ state, nowWorldSeconds: now, horizonWorldSeconds: horizon }) ?? [];
        for (const raw of provided) {
            const candidate = createInterruptCandidate(raw);
            if (candidate.atWorldSeconds >= now && candidate.atWorldSeconds <= horizon) candidates.push(candidate);
        }
    }

    return candidates.sort(compareInterrupts);
}

export function findNextInterrupt(state, options = {}) {
    return collectInterruptCandidates(state, options)[0] ?? null;
}

export function advanceSimulationUntilInterrupt(state, requestedSeconds, options = {}) {
    const seconds = Number(requestedSeconds);
    if (!nonNegativeInteger(seconds)) {
        return actionFailure({
            action: 'simulation.advance-until-interrupt',
            code: 'simulation.invalid-advance',
            outcome: 'rejected',
            data: { requestedSeconds },
            display: { text: 'Simulation advancement must be a non-negative whole number of seconds.' },
        });
    }

    const worldTime = ensureWorldTimeState(state);
    const beforeWorldSeconds = worldTime.totalSeconds;
    const alreadyCompleted = reconcileTimedTasks(state);
    if (alreadyCompleted.length) {
        const first = alreadyCompleted[0].task;
        return interruptResult(state, {
            id: `observed-completion:${first.id}`,
            type: 'task.completed',
            atWorldSeconds: beforeWorldSeconds,
            priority: INTERRUPT_PRIORITIES.TASK_COMPLETION,
            source: 'timedTaskEngine',
            data: { taskId: first.id, kind: first.kind, observedLate: true },
        }, seconds, 0, beforeWorldSeconds, alreadyCompleted);
    }

    const interrupt = findNextInterrupt(state, {
        ...options,
        maxSeconds: seconds,
    });
    const targetWorldSeconds = interrupt?.atWorldSeconds ?? beforeWorldSeconds + seconds;
    const secondsAdvanced = Math.max(0, targetWorldSeconds - beforeWorldSeconds);
    const timeResult = secondsAdvanced > 0
        ? advanceWorldTime(state, secondsAdvanced, options.worldTimeOptions)
        : null;
    const completedTasks = reconcileTimedTasks(state);

    if (interrupt) {
        return interruptResult(
            state,
            interrupt,
            seconds,
            secondsAdvanced,
            beforeWorldSeconds,
            completedTasks,
            timeResult,
        );
    }

    return actionSuccess({
        action: 'simulation.advance-until-interrupt',
        code: 'simulation.advance-complete',
        outcome: 'advanced',
        data: {
            requestedSeconds: seconds,
            secondsAdvanced,
            beforeWorldSeconds,
            afterWorldSeconds: worldTime.totalSeconds,
            interrupted: false,
            interrupt: null,
            completedTasks,
            timeEventId: timeResult?.data?.eventId ?? null,
        },
        display: { text: `Advanced simulation ${secondsAdvanced}s without interruption.` },
    });
}

export function createInterruptAwareAdvanceFunction(defaultOptions = {}) {
    return (state, requestedSeconds, callOptions = {}) => advanceSimulationUntilInterrupt(
        state,
        requestedSeconds,
        { ...defaultOptions, ...callOptions },
    );
}

function interruptResult(state, rawInterrupt, requestedSeconds, secondsAdvanced, beforeWorldSeconds, completedTasks, timeResult = null) {
    const interrupt = createInterruptCandidate(rawInterrupt);
    const event = emitSemanticEvent(state, 'simulation.interrupted', {
        interruptId: interrupt.id,
        interruptType: interrupt.type,
        interruptPriority: interrupt.priority,
        interruptSource: interrupt.source,
        interruptAtWorldSeconds: interrupt.atWorldSeconds,
        interruptData: { ...interrupt.data },
        requestedSeconds,
        secondsAdvanced,
    }, { source: 'simulationInterruptEngine' });

    return actionSuccess({
        action: 'simulation.advance-until-interrupt',
        code: 'simulation.interrupted',
        outcome: 'interrupted',
        data: {
            requestedSeconds,
            secondsAdvanced,
            beforeWorldSeconds,
            afterWorldSeconds: ensureWorldTimeState(state).totalSeconds,
            interrupted: true,
            interrupt,
            interruptEventId: event.id,
            completedTasks,
            timeEventId: timeResult?.data?.eventId ?? null,
        },
        display: { text: `Simulation stopped for ${interrupt.type} after ${secondsAdvanced}s.` },
    });
}

function compareInterrupts(a, b) {
    return a.atWorldSeconds - b.atWorldSeconds
        || b.priority - a.priority
        || a.type.localeCompare(b.type)
        || a.id.localeCompare(b.id);
}

function normalizeRequestedSeconds(value) {
    const number = Number(value);
    if (!nonNegativeInteger(number)) throw new Error('maxSeconds must be a non-negative integer.');
    return number;
}
function validType(value) { return /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)+$/.test(value); }
function nonNegativeInteger(value) { return Number.isInteger(value) && value >= 0; }
function plainObject(value) { return Boolean(value && typeof value === 'object' && !Array.isArray(value)); }
