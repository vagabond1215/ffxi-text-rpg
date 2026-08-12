import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import {
    advanceSimulationWithDayPolicy,
    buildDaySummary,
    createDayBoundaryInterruptProvider,
    ensureDayCycleState,
    getLatestDaySummary,
    listDaySummaries,
} from '../js/text/systems/dayCycleEngine.js';
import { emitSemanticEvent, listSemanticEvents } from '../js/text/systems/semanticEventEngine.js';
import { resumeSimulation, setEndOfDayPause } from '../js/text/systems/simulationControlEngine.js';
import { SECONDS_PER_DAY } from '../js/text/systems/worldTimeEngine.js';


test('day boundary provider schedules the next boundary strictly after current time', () => {
    const provider = createDayBoundaryInterruptProvider();
    const first = provider({ nowWorldSeconds: 0, horizonWorldSeconds: SECONDS_PER_DAY });
    assert.equal(first.length, 1);
    assert.equal(first[0].type, 'day.boundary');
    assert.equal(first[0].atWorldSeconds, SECONDS_PER_DAY);
    assert.deepEqual(first[0].data, { dayEnded: 1, nextDay: 2 });

    const second = provider({ nowWorldSeconds: SECONDS_PER_DAY, horizonWorldSeconds: 2 * SECONDS_PER_DAY });
    assert.equal(second[0].atWorldSeconds, 2 * SECONDS_PER_DAY);
    assert.deepEqual(second[0].data, { dayEnded: 2, nextDay: 3 });
});

test('default end-of-day policy stops exactly at midnight and pauses for review', () => {
    const state = createInitialState();
    state.worldTime.totalSeconds = SECONDS_PER_DAY - 10;
    ensureDayCycleState(state);

    const result = advanceSimulationWithDayPolicy(state, 100);

    assert.equal(result.ok, true);
    assert.equal(result.code, 'day.end-paused');
    assert.equal(result.data.secondsAdvanced, 10);
    assert.equal(result.data.remainingSeconds, 90);
    assert.equal(state.worldTime.totalSeconds, SECONDS_PER_DAY);
    assert.equal(state.simulation.paused, true);
    assert.equal(result.data.summary.day, 1);
    assert.equal(getLatestDaySummary(state).day, 1);
    assert.equal(state.dayCycle.lastFinalizedDay, 1);
});

test('resuming after end-of-day review continues from the boundary without catch-up', () => {
    const state = createInitialState();
    state.worldTime.totalSeconds = SECONDS_PER_DAY - 1;
    ensureDayCycleState(state);

    const first = advanceSimulationWithDayPolicy(state, 60);
    assert.equal(first.data.secondsAdvanced, 1);
    assert.equal(state.simulation.paused, true);

    resumeSimulation(state);
    const second = advanceSimulationWithDayPolicy(state, 59);
    assert.equal(second.code, 'day.advance-complete');
    assert.equal(second.data.secondsAdvanced, 59);
    assert.equal(state.worldTime.totalSeconds, SECONDS_PER_DAY + 59);
});

test('disabling end-of-day pause records summaries while allowing multi-day advancement', () => {
    const state = createInitialState();
    setEndOfDayPause(state, false);
    ensureDayCycleState(state);

    const result = advanceSimulationWithDayPolicy(state, (2 * SECONDS_PER_DAY) + 30);

    assert.equal(result.code, 'day.advance-complete');
    assert.equal(result.data.secondsAdvanced, (2 * SECONDS_PER_DAY) + 30);
    assert.equal(state.simulation.paused, false);
    assert.equal(state.dayCycle.lastFinalizedDay, 2);
    assert.deepEqual(listDaySummaries(state).map((summary) => summary.day), [1, 2]);
    assert.equal(state.worldTime.totalSeconds, (2 * SECONDS_PER_DAY) + 30);
});

test('day summaries aggregate structured semantic event types and categories without parsing prose', () => {
    const state = createInitialState();
    emitSemanticEvent(state, 'task.completed', { taskId: 'task-a' }, { source: 'test' });
    state.worldTime.totalSeconds = 100;
    emitSemanticEvent(state, 'travel.arrived', { to: 'west-ronfaure' }, { source: 'test' });
    state.worldTime.totalSeconds = 200;
    emitSemanticEvent(state, 'project.completed', { projectId: 'shed' }, { source: 'test' });

    const summary = buildDaySummary(state, 1);

    assert.equal(summary.eventCount, 3);
    assert.deepEqual(summary.eventTypeCounts, {
        'task.completed': 1,
        'travel.arrived': 1,
        'project.completed': 1,
    });
    assert.deepEqual(summary.categoryCounts, { work: 1, travel: 1, projects: 1 });
    assert.deepEqual(summary.notableEvents.map((event) => event.type), [
        'task.completed',
        'travel.arrived',
        'project.completed',
    ]);
});

test('same-time higher-priority interrupt finalizes the day but remains the surfaced interrupt', () => {
    const state = createInitialState();
    state.worldTime.totalSeconds = SECONDS_PER_DAY - 5;
    ensureDayCycleState(state);

    const result = advanceSimulationWithDayPolicy(state, 20, {
        candidates: [{
            id: 'midnight-ambush',
            type: 'combat.encounter',
            atWorldSeconds: SECONDS_PER_DAY,
            data: { enemyId: 'orc' },
        }],
    });

    assert.equal(result.code, 'day.interrupted');
    assert.equal(result.data.interrupt.id, 'midnight-ambush');
    assert.equal(result.data.secondsAdvanced, 5);
    assert.equal(state.dayCycle.lastFinalizedDay, 1);
    assert.equal(getLatestDaySummary(state).day, 1);
    assert.equal(state.simulation.paused, false);
});

test('day transition emits structured day-ended and day-started events', () => {
    const state = createInitialState();
    setEndOfDayPause(state, false);
    ensureDayCycleState(state);

    advanceSimulationWithDayPolicy(state, SECONDS_PER_DAY);

    const dayEvents = listSemanticEvents(state).filter((event) => event.type.startsWith('day.'));
    assert.deepEqual(dayEvents.map((event) => event.type), ['day.ended', 'day.started']);
    assert.equal(dayEvents[0].data.day, 1);
    assert.equal(dayEvents[1].data.day, 2);
});

test('older saves initialize day-cycle bookkeeping at the current completed-day boundary', () => {
    const state = createInitialState();
    delete state.dayCycle;
    state.worldTime.totalSeconds = (3 * SECONDS_PER_DAY) + 500;

    const dayCycle = ensureDayCycleState(state);

    assert.equal(dayCycle.lastFinalizedDay, 3);
    assert.deepEqual(dayCycle.summaries, []);
    assert.equal(state.version, 4);
});
