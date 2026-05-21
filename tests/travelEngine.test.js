import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { createCommandRouter } from '../js/text/commandRouter.js';
import {
    advanceTravel,
    describePlace,
    findTravelRoute,
    startTravel,
} from '../js/text/systems/travelEngine.js';


test('describePlace includes exits for starting city', () => {
    const text = describePlace('southern-sandoria');

    assert.match(text, /Southern San/);
    assert.match(text, /West Ronfaure/);
});

test('findTravelRoute finds connected destination', () => {
    const state = createInitialState();
    const route = findTravelRoute(state, 'West Ronfaure');

    assert.equal(route.ok, true);
    assert.equal(route.to, 'west-ronfaure');
});

test('findTravelRoute rejects disconnected destination', () => {
    const state = createInitialState();
    const route = findTravelRoute(state, 'Ghelsba Outpost');

    assert.equal(route.ok, false);
    assert.match(route.reason, /No direct route/);
});

test('startTravel and advanceTravel move current place', () => {
    const state = createInitialState();
    const started = startTravel(state, 'West Ronfaure');

    assert.equal(started.ok, true);
    assert.equal(state.travel.active, true);

    const advanced = advanceTravel(state, 45);

    assert.equal(advanced.completed, true);
    assert.equal(state.currentPlaceId, 'west-ronfaure');
    assert.equal(state.location, 'West Ronfaure');
});

test('router exposes zones travel and wait commands', () => {
    const state = createInitialState();
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });

    assert.match(router('zones'), /southern-sandoria/);
    assert.match(router('travel West Ronfaure'), /Traveling to West Ronfaure/);
    assert.match(router('wait 45'), /Arrived at West Ronfaure/);
});
