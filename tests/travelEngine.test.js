import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { createCommandRouter } from '../js/text/commandRouter.js';
import { describeMap, describeMaps, listMaps } from '../js/text/data/maps.js';
import { getPlace, listPlaces, ZONE_CONNECTIONS } from '../js/text/data/places.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { validateWorldData } from '../js/text/systems/validation.js';
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

test('starter cities and associated maps are populated', () => {
    const placeIds = listPlaces().map((place) => place.id);
    const mapIds = listMaps().map((map) => map.id);

    assert.ok(placeIds.includes('southern-sandoria'));
    assert.ok(placeIds.includes('bastok-markets'));
    assert.ok(placeIds.includes('windurst-waters'));
    assert.ok(mapIds.includes('map-san-doria'));
    assert.ok(mapIds.includes('map-bastok'));
    assert.ok(mapIds.includes('map-windurst'));
    assert.match(describeMaps(), /Map of Bastok/);
    assert.match(describeMap('map-windurst'), /windurst-waters/);
});

test('world data validates maps places and connection grids', () => {
    assert.deepEqual(validateWorldData(), []);
});

test('all connections reference known places', () => {
    for (const connection of ZONE_CONNECTIONS) {
        assert.ok(getPlace(connection.from), `${connection.id} missing from place`);
        assert.ok(getPlace(connection.to), `${connection.id} missing to place`);
    }
});

test('findTravelRoute finds connected destination', () => {
    const state = createInitialState();
    setPositionAndDiscover(state, 'southern-sandoria', { coord: 'F-10' });
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
    setPositionAndDiscover(state, 'southern-sandoria', { coord: 'F-10' });
    const started = startTravel(state, 'West Ronfaure');

    assert.equal(started.ok, true);
    assert.equal(state.travel.active, true);

    const advanced = advanceTravel(state, 45);

    assert.equal(advanced.completed, true);
    assert.equal(state.currentPlaceId, 'west-ronfaure');
    assert.equal(state.location, 'West Ronfaure');
});

test('router exposes maps zones travel and wait commands', () => {
    const state = createInitialState();
    setPositionAndDiscover(state, 'southern-sandoria', { coord: 'F-10' });
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });

    assert.match(router('maps'), /map-san-doria/);
    assert.match(router('map map-bastok'), /Bastok/);
    assert.match(router('zones'), /southern-sandoria/);
    assert.match(router('zones'), /bastok-markets/);
    assert.match(router('zones'), /windurst-waters/);
    assert.match(router('travel West Ronfaure'), /Traveling to West Ronfaure/);
    assert.match(router('wait 45'), /Arrived at West Ronfaure/);
});
