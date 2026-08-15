import test from 'node:test';
import assert from 'node:assert/strict';

import { createTestState } from './helpers/createTestState.js';
import { createSimulationAdvanceDriver, setSimulationSpeed } from '../js/text/systems/simulationControlEngine.js';
import {
    advanceSimulationUntilInterrupt,
    collectInterruptCandidates,
    createInterruptAwareAdvanceFunction,
    createInterruptCandidate,
    findNextInterrupt,
    INTERRUPT_PRIORITIES,
} from '../js/text/systems/simulationInterruptEngine.js';
import { listSemanticEvents } from '../js/text/systems/semanticEventEngine.js';
import { startTimedTask } from '../js/text/systems/timedTaskEngine.js';


test('interrupt candidates sort by earliest time then higher priority deterministically', () => {
    const state = createTestState();
    const candidates = collectInterruptCandidates(state, {
        maxSeconds: 100,
        candidates: [
            { id: 'later', type: 'combat.encounter', atWorldSeconds: 50 },
            { id: 'low', type: 'day.boundary', atWorldSeconds: 20 },
            { id: 'high', type: 'combat.encounter', atWorldSeconds: 20 },
        ],
    });

    assert.deepEqual(candidates.map((candidate) => candidate.id), ['high', 'low', 'later']);
    assert.equal(candidates[0].priority, INTERRUPT_PRIORITIES.COMBAT);
});

test('task completion is a built-in interrupt source', () => {
    const state = createTestState();
    const started = startTimedTask(state, { kind: 'work.test', durationSeconds: 30 });

    const next = findNextInterrupt(state, { maxSeconds: 60 });

    assert.equal(next.type, 'task.completed');
    assert.equal(next.atWorldSeconds, 30);
    assert.equal(next.data.taskId, started.data.task.id);
});

test('advance-until-interrupt stops exactly at task completion and reconciles the task', () => {
    const state = createTestState();
    startTimedTask(state, { kind: 'work.test', durationSeconds: 30 });

    const result = advanceSimulationUntilInterrupt(state, 120);

    assert.equal(result.ok, true);
    assert.equal(result.code, 'simulation.interrupted');
    assert.equal(result.data.secondsAdvanced, 30);
    assert.equal(result.data.afterWorldSeconds, 30);
    assert.equal(result.data.interrupt.type, 'task.completed');
    assert.equal(result.data.completedTasks.length, 1);
    assert.equal(result.data.completedTasks[0].task.status, 'completed');
    assert.deepEqual(listSemanticEvents(state).map((event) => event.type), [
        'task.started',
        'time.advanced',
        'task.completed',
        'simulation.interrupted',
    ]);
});

test('simulation advances the full request when no interrupt occurs', () => {
    const state = createTestState();

    const result = advanceSimulationUntilInterrupt(state, 75);

    assert.equal(result.code, 'simulation.advance-complete');
    assert.equal(result.data.interrupted, false);
    assert.equal(result.data.secondsAdvanced, 75);
    assert.equal(state.worldTime.totalSeconds, 75);
});

test('higher-priority custom interrupt wins a same-time tie while due tasks still reconcile', () => {
    const state = createTestState();
    startTimedTask(state, { kind: 'work.test', durationSeconds: 20 });

    const result = advanceSimulationUntilInterrupt(state, 100, {
        candidates: [{ id: 'ambush', type: 'combat.encounter', atWorldSeconds: 20, data: { enemyId: 'orc' } }],
    });

    assert.equal(result.data.interrupt.id, 'ambush');
    assert.equal(result.data.interrupt.priority, INTERRUPT_PRIORITIES.COMBAT);
    assert.equal(result.data.completedTasks.length, 1);
    assert.equal(state.worldTime.totalSeconds, 20);
});

test('interrupt providers can contribute future conditions without coupling them to the clock', () => {
    const state = createTestState();
    const provider = ({ nowWorldSeconds }) => [{
        id: 'fatigue-threshold',
        type: 'exhaustion.threshold',
        atWorldSeconds: nowWorldSeconds + 45,
        data: { resource: 'energy' },
    }];

    const result = advanceSimulationUntilInterrupt(state, 100, { providers: [provider] });

    assert.equal(result.data.secondsAdvanced, 45);
    assert.equal(result.data.interrupt.type, 'exhaustion.threshold');
    assert.equal(result.data.interrupt.priority, INTERRUPT_PRIORITIES.EXHAUSTION);
});

test('accelerated scheduler advancement discards remaining budget after an interrupt', () => {
    const state = createTestState();
    setSimulationSpeed(state, 60);
    startTimedTask(state, { kind: 'work.test', durationSeconds: 10 });
    const driver = createSimulationAdvanceDriver({
        advanceSeconds: createInterruptAwareAdvanceFunction(),
    });

    const result = driver.advance(state, 1000);

    assert.equal(result.code, 'simulation.interrupted');
    assert.equal(result.data.requestedSimulationSeconds, 60);
    assert.equal(result.data.secondsAdvanced, 10);
    assert.equal(state.worldTime.totalSeconds, 10);

    const next = driver.advance(state, 1000);
    assert.equal(next.data.secondsAdvanced, 60);
    assert.equal(state.worldTime.totalSeconds, 70);
});

test('late task completion is surfaced immediately before new advancement', () => {
    const state = createTestState();
    startTimedTask(state, { kind: 'work.test', durationSeconds: 10 });
    state.worldTime.totalSeconds = 25;

    const result = advanceSimulationUntilInterrupt(state, 100);

    assert.equal(result.code, 'simulation.interrupted');
    assert.equal(result.data.secondsAdvanced, 0);
    assert.equal(result.data.interrupt.type, 'task.completed');
    assert.equal(result.data.interrupt.data.observedLate, true);
    assert.equal(state.worldTime.totalSeconds, 25);
});

test('interrupt candidate validation rejects unstable definitions', () => {
    assert.throws(() => createInterruptCandidate({ type: '', atWorldSeconds: 1 }), /Invalid interrupt type/);
    assert.throws(() => createInterruptCandidate({ type: 'combat.encounter', atWorldSeconds: -1 }), /non-negative integer/);
    assert.throws(() => createInterruptCandidate({ type: 'combat.encounter', atWorldSeconds: 1, priority: 1.5 }), /priority must be an integer/);
});
