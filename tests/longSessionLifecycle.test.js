import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { createAccountWithPassword, loadActiveCharacter, saveGame } from '../js/text/save.js';
import {
    advanceSimulationWithDayPolicy,
    DEFAULT_DAY_SUMMARY_LIMIT,
    listDaySummaries,
} from '../js/text/systems/dayCycleEngine.js';
import {
    DEFAULT_EVENT_HISTORY_LIMIT,
    listSemanticEvents,
} from '../js/text/systems/semanticEventEngine.js';
import { setEndOfDayPause } from '../js/text/systems/simulationControlEngine.js';
import {
    listTimedTasks,
    reconcileTimedTasks,
    startTimedTask,
    TIMED_TASK_STATUSES,
} from '../js/text/systems/timedTaskEngine.js';
import { advanceWorldTime, SECONDS_PER_DAY } from '../js/text/systems/worldTimeEngine.js';

class MemoryStorage {
    constructor() {
        this.values = new Map();
    }

    getItem(key) {
        return this.values.has(key) ? this.values.get(key) : null;
    }

    setItem(key, value) {
        this.values.set(key, String(value));
    }

    removeItem(key) {
        this.values.delete(key);
    }
}

function installStorage() {
    globalThis.localStorage = new MemoryStorage();
}

function saveAndReload(state) {
    assert.equal(saveGame(state), true);
    const loaded = loadActiveCharacter();
    assert.ok(loaded);
    return loaded;
}

test('multi-day save/load continuation keeps lifecycle-owned state deterministic and bounded', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Lifecycle Runner', 'pwd', { persistentLogin: true }).ok, true);

    let state = createInitialState();
    state.player.identity.name = 'Lifecycle Runner';
    setEndOfDayPause(state, false);

    const started = startTimedTask(state, {
        kind: 'test.lifecycle',
        label: 'Lifecycle smoke task',
        channel: 'test:lifecycle',
        durationSeconds: 3600,
        data: { purpose: 'long-session-smoke' },
    });
    assert.equal(started.ok, true);
    const taskId = started.data.task.id;

    for (let cycle = 0; cycle < 3; cycle += 1) {
        state = saveAndReload(state);
        const tasks = listTimedTasks(state);
        assert.equal(tasks.length, 1);
        assert.equal(tasks[0].id, taskId);
        assert.equal(tasks[0].status, TIMED_TASK_STATUSES.ACTIVE);
        assert.equal(listSemanticEvents(state, { type: 'task.started' }).length, 1);
    }

    advanceWorldTime(state, 3600, { source: 'test.long-session' });
    const completed = reconcileTimedTasks(state);
    assert.equal(completed.length, 1);
    assert.equal(completed[0].task.id, taskId);
    assert.equal(listTimedTasks(state)[0].status, TIMED_TASK_STATUSES.COMPLETED);
    assert.equal(listSemanticEvents(state, { type: 'task.completed' }).length, 1);

    state = saveAndReload(state);
    assert.deepEqual(reconcileTimedTasks(state), []);
    assert.equal(listTimedTasks(state).length, 1);
    assert.equal(listSemanticEvents(state, { type: 'task.completed' }).length, 1);

    const longRunStart = state.worldTime.totalSeconds;
    const daysToAdvance = DEFAULT_DAY_SUMMARY_LIMIT + 10;
    for (let day = 1; day <= daysToAdvance; day += 1) {
        const result = advanceSimulationWithDayPolicy(state, SECONDS_PER_DAY);
        assert.equal(result.ok, true);
        assert.equal(result.data.secondsAdvanced, SECONDS_PER_DAY);
        if (day % 10 === 0) state = saveAndReload(state);
    }

    assert.equal(state.worldTime.totalSeconds, longRunStart + (daysToAdvance * SECONDS_PER_DAY));
    assert.equal(listTimedTasks(state).length, 1);

    const summaries = listDaySummaries(state);
    assert.equal(summaries.length, DEFAULT_DAY_SUMMARY_LIMIT);
    assert.equal(summaries.at(-1).day, state.dayCycle.lastFinalizedDay);
    assert.equal(new Set(summaries.map((summary) => summary.day)).size, summaries.length);

    const events = listSemanticEvents(state);
    assert.equal(events.length, DEFAULT_EVENT_HISTORY_LIMIT);
    assert.equal(new Set(events.map((event) => event.id)).size, events.length);
    assert.equal(new Set(events.map((event) => event.sequence)).size, events.length);

    const finalWorldTime = state.worldTime.totalSeconds;
    const finalTaskCount = state.tasks.records.length;
    const finalEventCount = state.events.records.length;
    const finalSummaryCount = state.dayCycle.summaries.length;
    state = saveAndReload(state);

    assert.equal(state.worldTime.totalSeconds, finalWorldTime);
    assert.equal(state.tasks.records.length, finalTaskCount);
    assert.equal(state.events.records.length, finalEventCount);
    assert.equal(state.dayCycle.summaries.length, finalSummaryCount);
    assert.equal(listSemanticEvents(state).length, DEFAULT_EVENT_HISTORY_LIMIT);
});
