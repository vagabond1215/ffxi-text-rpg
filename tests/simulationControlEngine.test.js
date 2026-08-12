import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { listSemanticEvents } from '../js/text/systems/semanticEventEngine.js';
import {
    createSimulationAdvanceDriver,
    ensureSimulationControlState,
    pauseSimulation,
    resumeSimulation,
    setEndOfDayPause,
    setSimulationSpeed,
    validateSimulationControlState,
} from '../js/text/systems/simulationControlEngine.js';


test('new games start running at normal simulation speed with end-of-day review enabled', () => {
    const state = createInitialState();

    assert.deepEqual(state.simulation, { paused: false, speedMultiplier: 1, endOfDayPause: true });
    assert.deepEqual(validateSimulationControlState(state.simulation), []);
});

test('older simulation-control state lazily acquires end-of-day preference without changing save version', () => {
    const state = createInitialState();
    const versionBefore = state.version;
    delete state.simulation.endOfDayPause;

    const simulation = ensureSimulationControlState(state);

    assert.equal(simulation.endOfDayPause, true);
    assert.equal(state.version, versionBefore);
});

test('pause and resume change simulation control without advancing world time', () => {
    const state = createInitialState();
    state.worldTime.totalSeconds = 120;

    const paused = pauseSimulation(state);
    assert.equal(paused.code, 'simulation.paused');
    assert.equal(state.simulation.paused, true);
    assert.equal(state.worldTime.totalSeconds, 120);

    const resumed = resumeSimulation(state);
    assert.equal(resumed.code, 'simulation.resumed');
    assert.equal(state.simulation.paused, false);
    assert.equal(state.worldTime.totalSeconds, 120);

    assert.deepEqual(listSemanticEvents(state).map((event) => event.type), [
        'simulation.paused',
        'simulation.resumed',
    ]);
});

test('speed control accepts arbitrary whole-number multipliers within the engine limit', () => {
    const state = createInitialState();

    const result = setSimulationSpeed(state, 60);

    assert.equal(result.ok, true);
    assert.equal(result.code, 'simulation.speed-changed');
    assert.equal(state.simulation.speedMultiplier, 60);
    const [event] = listSemanticEvents(state, { type: 'simulation.speed-changed' });
    assert.deepEqual(event.data, { previousSpeed: 1, speedMultiplier: 60, paused: false });
});

test('end-of-day pause preference can be disabled and emits structured change event', () => {
    const state = createInitialState();

    const result = setEndOfDayPause(state, false);

    assert.equal(result.ok, true);
    assert.equal(result.code, 'simulation.end-of-day-pause-changed');
    assert.equal(state.simulation.endOfDayPause, false);
    const [event] = listSemanticEvents(state, { type: 'simulation.end-of-day-pause-changed' });
    assert.deepEqual(event.data, { previousEndOfDayPause: true, endOfDayPause: false });
});

test('scheduled advancement converts wall elapsed time into deterministic simulated seconds', () => {
    const state = createInitialState();
    setSimulationSpeed(state, 60);
    const driver = createSimulationAdvanceDriver();
    const originalNow = Date.now;
    Date.now = () => { throw new Error('simulation driver must not read Date.now'); };

    try {
        const result = driver.advance(state, 500);
        assert.equal(result.code, 'simulation.advanced');
        assert.equal(result.data.secondsAdvanced, 30);
        assert.equal(state.worldTime.totalSeconds, 30);
    } finally {
        Date.now = originalNow;
    }
});

test('simulation driver preserves sub-second remainder without drift', () => {
    const state = createInitialState();
    const driver = createSimulationAdvanceDriver();

    assert.equal(driver.advance(state, 250).data.secondsAdvanced, 0);
    assert.equal(driver.advance(state, 250).data.secondsAdvanced, 0);
    assert.equal(driver.advance(state, 250).data.secondsAdvanced, 0);
    const fourth = driver.advance(state, 250);

    assert.equal(fourth.data.secondsAdvanced, 1);
    assert.equal(driver.remainderMs, 0);
    assert.equal(state.worldTime.totalSeconds, 1);
});

test('paused scheduler time is discarded rather than accumulated for later advancement', () => {
    const state = createInitialState();
    const driver = createSimulationAdvanceDriver();
    pauseSimulation(state);

    const paused = driver.advance(state, 5000);
    assert.equal(paused.code, 'simulation.paused-no-advance');
    assert.equal(state.worldTime.totalSeconds, 0);
    assert.equal(driver.remainderMs, 0);

    resumeSimulation(state);
    const running = driver.advance(state, 1000);
    assert.equal(running.data.secondsAdvanced, 1);
    assert.equal(state.worldTime.totalSeconds, 1);
});

test('invalid speed values are rejected without mutating simulation state', () => {
    const state = createInitialState();

    for (const speed of [0, -1, 1.5, 3601]) {
        const result = setSimulationSpeed(state, speed);
        assert.equal(result.ok, false);
        assert.equal(result.code, 'simulation.invalid-speed');
        assert.equal(state.simulation.speedMultiplier, 1);
    }
});

test('invalid end-of-day pause values are rejected without mutation', () => {
    const state = createInitialState();

    const result = setEndOfDayPause(state, 'no');

    assert.equal(result.ok, false);
    assert.equal(state.simulation.endOfDayPause, true);
});
