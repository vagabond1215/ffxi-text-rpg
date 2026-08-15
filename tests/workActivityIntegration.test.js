import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { startTimedTask } from '../js/text/systems/timedTaskEngine.js';
import { startScheduledTransport } from '../js/text/systems/transportEngine.js';
import { startTravel } from '../js/text/systems/travelEngine.js';

test('hands-on character work blocks direct route travel', () => {
    const state = createInitialState();
    setPositionAndDiscover(state, 'thornwall-southgate', { coord: 'F-10' });
    const task = startTimedTask(state, {
        kind: 'work.crafting',
        label: 'Test Crafting',
        channel: 'work:character',
        durationSeconds: 60,
    });
    assert.equal(task.ok, true);

    const travel = startTravel(state, 'West Elderwood');

    assert.equal(travel.ok, false);
    assert.equal(travel.code, 'travel.work-active');
    assert.match(travel.display.text, /Test Crafting is still in progress/);
    assert.equal(state.travel, null);
});

test('scheduled transport blocked by hands-on work refunds the fare atomically', () => {
    const state = createInitialState();
    setPositionAndDiscover(state, 'thornwall-rivergate', { coord: 'H-5' });
    state.player.wallet.gil = 100;
    const task = startTimedTask(state, {
        kind: 'work.processing',
        label: 'Test Smelting',
        channel: 'work:character',
        durationSeconds: 60,
    });
    assert.equal(task.ok, true);

    const booked = startScheduledTransport(state, 'service-crown-forge-caravan', 'brasshaven-iron-quay', { cargoUnits: 0 });

    assert.equal(booked.ok, false);
    assert.equal(booked.code, 'travel.work-active');
    assert.equal(state.player.wallet.gil, 100);
    assert.equal(state.travel, null);
});
