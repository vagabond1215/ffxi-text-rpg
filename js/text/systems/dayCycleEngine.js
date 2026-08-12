import { actionFailure, actionSuccess } from './actionResult.js';
import { pauseSimulation, ensureSimulationControlState } from './simulationControlEngine.js';
import { advanceSimulationUntilInterrupt, INTERRUPT_PRIORITIES } from './simulationInterruptEngine.js';
import { emitSemanticEvent, listSemanticEvents } from './semanticEventEngine.js';
import { ensureWorldTimeState, SECONDS_PER_DAY } from './worldTimeEngine.js';

export const DAY_CYCLE_STATE_VERSION = 1;
export const DEFAULT_DAY_SUMMARY_LIMIT = 120;

export function createDayCycleState(options = {}) {
    return {
        version: DAY_CYCLE_STATE_VERSION,
        lastFinalizedDay: nonNegativeInteger(options.lastFinalizedDay) ? options.lastFinalizedDay : 0,
        summaries: Array.isArray(options.summaries) ? [...options.summaries] : [],
    };
}

export function ensureDayCycleState(state) {
    if (!state || typeof state !== 'object') throw new Error('Day cycle requires game state.');
    if (!state.dayCycle || typeof state.dayCycle !== 'object' || Array.isArray(state.dayCycle)) {
        const worldTime = ensureWorldTimeState(state);
        state.dayCycle = createDayCycleState({
            // Existing saves cannot reconstruct already elapsed days reliably from bounded event history.
            lastFinalizedDay: Math.floor(worldTime.totalSeconds / SECONDS_PER_DAY),
        });
    }
    const issues = validateDayCycleState(state.dayCycle);
    if (issues.length) throw new Error(issues.join(' '));
    return state.dayCycle;
}

export function createDayBoundaryInterruptProvider() {
    return ({ nowWorldSeconds, horizonWorldSeconds }) => {
        const nextBoundary = (Math.floor(nowWorldSeconds / SECONDS_PER_DAY) + 1) * SECONDS_PER_DAY;
        if (nextBoundary > horizonWorldSeconds) return [];
        const dayEnded = Math.floor(nextBoundary / SECONDS_PER_DAY);
        return [{
            id: `day-boundary:${dayEnded}`,
            type: 'day.boundary',
            atWorldSeconds: nextBoundary,
            priority: INTERRUPT_PRIORITIES.DAY_BOUNDARY,
            source: 'dayCycleEngine',
            data: { dayEnded, nextDay: dayEnded + 1 },
        }];
    };
}

export function buildDaySummary(state, dayNumber) {
    const day = Number(dayNumber);
    if (!positiveInteger(day)) throw new Error('dayNumber must be a positive integer.');
    const startWorldSeconds = (day - 1) * SECONDS_PER_DAY;
    const endWorldSeconds = day * SECONDS_PER_DAY;
    const events = listSemanticEvents(state).filter((event) => {
        if (!Number.isFinite(event.worldTimeSeconds)) return false;
        return day === 1
            ? event.worldTimeSeconds >= startWorldSeconds && event.worldTimeSeconds <= endWorldSeconds
            : event.worldTimeSeconds > startWorldSeconds && event.worldTimeSeconds <= endWorldSeconds;
    });
    const eventTypeCounts = {};
    const categoryCounts = {};
    for (const event of events) {
        eventTypeCounts[event.type] = (eventTypeCounts[event.type] ?? 0) + 1;
        const category = classifyEvent(event.type);
        categoryCounts[category] = (categoryCounts[category] ?? 0) + 1;
    }

    return Object.freeze({
        day,
        startWorldSeconds,
        endWorldSeconds,
        eventCount: events.length,
        eventTypeCounts: Object.freeze(eventTypeCounts),
        categoryCounts: Object.freeze(categoryCounts),
        notableEvents: Object.freeze(events
            .filter((event) => isNotableEvent(event.type))
            .slice(-20)
            .map((event) => Object.freeze({
                id: event.id,
                type: event.type,
                worldTimeSeconds: event.worldTimeSeconds,
                data: event.data,
            }))),
    });
}

export function finalizeCompletedDays(state, options = {}) {
    const dayCycle = ensureDayCycleState(state);
    const currentCompletedDay = Math.floor(ensureWorldTimeState(state).totalSeconds / SECONDS_PER_DAY);
    const summaries = [];

    for (let day = dayCycle.lastFinalizedDay + 1; day <= currentCompletedDay; day += 1) {
        const summary = buildDaySummary(state, day);
        recordDaySummary(dayCycle, summary, options.summaryLimit);
        dayCycle.lastFinalizedDay = day;
        const endedEvent = emitSemanticEvent(state, 'day.ended', summaryEventData(summary), { source: 'dayCycleEngine' });
        const startedEvent = emitSemanticEvent(state, 'day.started', { day: day + 1 }, { source: 'dayCycleEngine' });
        summaries.push({ summary, endedEventId: endedEvent.id, startedEventId: startedEvent.id });
    }

    return summaries;
}

export function advanceSimulationWithDayPolicy(state, requestedSeconds, options = {}) {
    const requested = Number(requestedSeconds);
    if (!nonNegativeInteger(requested)) {
        return actionFailure({
            action: 'day.advance',
            code: 'day.invalid-advance',
            outcome: 'rejected',
            data: { requestedSeconds },
            display: { text: 'Day-aware advancement must be a non-negative whole number of seconds.' },
        });
    }

    const simulation = ensureSimulationControlState(state);
    ensureDayCycleState(state);
    const dayProvider = createDayBoundaryInterruptProvider();
    const providers = [...(options.providers ?? []), dayProvider];
    const originalStart = ensureWorldTimeState(state).totalSeconds;
    let remainingSeconds = requested;
    const finalizedDays = [];

    while (remainingSeconds > 0) {
        const result = advanceSimulationUntilInterrupt(state, remainingSeconds, {
            ...options,
            providers,
        });
        if (!result.ok) return result;

        const advanced = result.data.secondsAdvanced ?? 0;
        remainingSeconds = Math.max(0, remainingSeconds - advanced);
        finalizedDays.push(...finalizeCompletedDays(state, options));

        if (!result.data.interrupted) {
            return completedAdvanceResult(state, requested, originalStart, finalizedDays, result);
        }

        if (result.data.interrupt?.type !== 'day.boundary') {
            return interruptedAdvanceResult(state, requested, originalStart, remainingSeconds, finalizedDays, result);
        }

        if (simulation.endOfDayPause) {
            const pauseResult = pauseSimulation(state);
            const latest = finalizedDays.at(-1)?.summary ?? null;
            return actionSuccess({
                action: 'day.advance',
                code: 'day.end-paused',
                outcome: 'interrupted',
                data: {
                    requestedSeconds: requested,
                    secondsAdvanced: ensureWorldTimeState(state).totalSeconds - originalStart,
                    remainingSeconds,
                    interrupted: true,
                    interrupt: result.data.interrupt,
                    summary: latest,
                    finalizedDays,
                    pauseEventId: pauseResult.data.eventId ?? null,
                },
                display: { text: `Day ${latest?.day ?? '?'} ended. Simulation paused for review.` },
            });
        }

        // With auto-pause disabled, a day boundary is informational. Continue any
        // remaining advancement until a higher-value interrupt or the request ends.
        if (advanced === 0) {
            return actionFailure({
                action: 'day.advance',
                code: 'day.zero-progress-boundary',
                outcome: 'blocked',
                data: { requestedSeconds: requested, remainingSeconds },
                display: { text: 'Day advancement could not make progress past a boundary.' },
            });
        }
    }

    return completedAdvanceResult(state, requested, originalStart, finalizedDays, null);
}

export function getLatestDaySummary(state) {
    return ensureDayCycleState(state).summaries.at(-1) ?? null;
}

export function listDaySummaries(state, options = {}) {
    const limit = positiveInteger(options.limit) ? options.limit : DEFAULT_DAY_SUMMARY_LIMIT;
    return ensureDayCycleState(state).summaries.slice(-limit);
}

export function validateDayCycleState(dayCycle) {
    if (!dayCycle || typeof dayCycle !== 'object' || Array.isArray(dayCycle)) return ['dayCycle must be an object.'];
    const issues = [];
    if (dayCycle.version !== DAY_CYCLE_STATE_VERSION) issues.push(`dayCycle.version must be ${DAY_CYCLE_STATE_VERSION}.`);
    if (!nonNegativeInteger(dayCycle.lastFinalizedDay)) issues.push('dayCycle.lastFinalizedDay must be a non-negative integer.');
    if (!Array.isArray(dayCycle.summaries)) issues.push('dayCycle.summaries must be an array.');
    return issues;
}

function recordDaySummary(dayCycle, summary, requestedLimit) {
    const limit = positiveInteger(requestedLimit) ? requestedLimit : DEFAULT_DAY_SUMMARY_LIMIT;
    dayCycle.summaries.push(summary);
    if (dayCycle.summaries.length > limit) dayCycle.summaries.splice(0, dayCycle.summaries.length - limit);
}

function completedAdvanceResult(state, requested, originalStart, finalizedDays, underlying) {
    const advanced = ensureWorldTimeState(state).totalSeconds - originalStart;
    return actionSuccess({
        action: 'day.advance',
        code: 'day.advance-complete',
        outcome: 'advanced',
        data: {
            requestedSeconds: requested,
            secondsAdvanced: advanced,
            remainingSeconds: Math.max(0, requested - advanced),
            interrupted: false,
            finalizedDays,
            underlying: underlying?.data ?? null,
        },
        display: { text: `Advanced ${advanced}s with day-boundary policy.` },
    });
}

function interruptedAdvanceResult(state, requested, originalStart, remainingSeconds, finalizedDays, result) {
    return actionSuccess({
        action: 'day.advance',
        code: 'day.interrupted',
        outcome: 'interrupted',
        data: {
            requestedSeconds: requested,
            secondsAdvanced: ensureWorldTimeState(state).totalSeconds - originalStart,
            remainingSeconds,
            interrupted: true,
            interrupt: result.data.interrupt,
            finalizedDays,
            underlying: result.data,
        },
        display: { text: result.display.text },
    });
}

function classifyEvent(type) {
    const prefix = String(type).split('.')[0];
    if (['task', 'work', 'craft'].includes(prefix)) return 'work';
    if (['travel', 'navigation'].includes(prefix)) return 'travel';
    if (['combat', 'battle'].includes(prefix)) return 'combat';
    if (['project', 'construction'].includes(prefix)) return 'projects';
    if (['skill', 'level', 'progression', 'capability'].includes(prefix)) return 'progression';
    if (['resource', 'inventory', 'shop', 'economy'].includes(prefix)) return 'resources';
    if (['relationship', 'reputation'].includes(prefix)) return 'relationships';
    if (['day'].includes(prefix)) return 'day';
    return 'other';
}

function isNotableEvent(type) {
    return /(?:completed|arrived|victory|defeat|level|unlocked|relationship|reputation|project)/.test(type);
}

function summaryEventData(summary) {
    return {
        day: summary.day,
        startWorldSeconds: summary.startWorldSeconds,
        endWorldSeconds: summary.endWorldSeconds,
        eventCount: summary.eventCount,
        eventTypeCounts: { ...summary.eventTypeCounts },
        categoryCounts: { ...summary.categoryCounts },
    };
}

function positiveInteger(value) { return Number.isInteger(value) && value > 0; }
function nonNegativeInteger(value) { return Number.isInteger(value) && value >= 0; }
