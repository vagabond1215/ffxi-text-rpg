import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { VERSION } from '../js/text/version.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { isActionResult } from '../js/text/systems/actionResult.js';
import { listSemanticEvents } from '../js/text/systems/semanticEventEngine.js';
import { createTickEngine } from '../js/text/systems/tickEngine.js';
import { advanceTravel, startTravel } from '../js/text/systems/travelEngine.js';
import { validateGameState } from '../js/text/systems/validation.js';


test('current state requires valid deterministic world-time state', () => {
    const state = createInitialState();

    assert.deepEqual(validateGameState(state), []);
    assert.equal(state.version, VERSION.gameState);
    assert.deepEqual(state.worldTime, { totalSeconds: 0 });
});

test('travel action and event seams can observe canonical world time without using log prose', () => {
    const state = createInitialState();
    state.worldTime.totalSeconds = 3600;
    setPositionAndDiscover(state, 'thornwall-southgate', { coord: 'F-10' });

    const started = startTravel(state, 'West Elderwood');
    assert.equal(isActionResult(started), true);
    assert.equal(started.code, 'travel.started');

    const [startedEvent] = listSemanticEvents(state, { type: 'travel.started' });
    assert.equal(startedEvent.worldTimeSeconds, 3600);
    assert.equal(startedEvent.data.to, 'west-elderwood');

    state.worldTime.totalSeconds += 45;
    advanceTravel(state, 45);
    const [arrivedEvent] = listSemanticEvents(state, { type: 'travel.arrived' });
    assert.equal(arrivedEvent.worldTimeSeconds, 3645);
    assert.equal(arrivedEvent.data.to, 'west-elderwood');
});

test('character-owned skill storage is outside the active job record', () => {
    const state = createInitialState();
    state.player.progression.skills.axe = 12;

    assert.equal(state.player.progression.skills.axe, 12);
    assert.equal(Object.hasOwn(state.player.jobs, 'skills'), false);
});

test('wall-clock tick scaffold remains a scheduler rather than canonical world time', () => {
    const state = createInitialState();
    state.worldTime.totalSeconds = 1234;
    const tickEngine = createTickEngine({ tickLengthMs: 1000 });

    tickEngine.tick({ state });

    assert.equal(tickEngine.elapsedTicks, 1);
    assert.equal(state.worldTime.totalSeconds, 1234);
});
