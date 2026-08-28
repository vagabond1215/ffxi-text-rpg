import test from 'node:test';
import assert from 'node:assert/strict';

import { createTestState } from './helpers/createTestState.js';
import { createCommandRouter } from '../js/text/commandRouter.js';
import { describeMap, describeMaps, listMaps } from '../js/text/data/maps.js';
import { getPlace, listPlaces, ZONE_CONNECTIONS } from '../js/text/data/places.js';
import { describeActionResult, isActionResult } from '../js/text/systems/actionResult.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { validateWorldData } from '../js/text/systems/validation.js';
import {
    advanceTravel,
    describePlace,
    findTravelRoute,
    startTravel,
} from '../js/text/systems/travelEngine.js';


test('describePlace includes exits for starting city', () => {
    const text = describePlace('thornwall-southgate');

    assert.match(text, /Thornwall Southgate/);
    assert.match(text, /West Elderwood/);
    assert.match(text, /Southgate Forest Road/);
    assert.match(text, /Southfield Farm Road/);
    assert.match(text, /Crownfields Grange/);
});

test('starter cities and associated maps are populated', () => {
    const placeIds = listPlaces().map((place) => place.id);
    const mapIds = listMaps().map((map) => map.id);

    assert.ok(placeIds.includes('thornwall-southgate'));
    assert.ok(placeIds.includes('brasshaven-market-ring'));
    assert.ok(placeIds.includes('mistmere-canal-ward'));
    assert.ok(placeIds.includes('coppergrass-steppe'));
    assert.ok(placeIds.includes('slatewater-foothills'));
    assert.ok(placeIds.includes('slatewater-waylodge'));
    assert.ok(placeIds.includes('crownfields'));
    assert.ok(placeIds.includes('crownfields-grange'));
    assert.ok(mapIds.includes('map-thornwall'));
    assert.ok(mapIds.includes('map-brasshaven'));
    assert.ok(mapIds.includes('map-mistmere'));
    assert.ok(mapIds.includes('map-coppergrass-steppe'));
    assert.ok(mapIds.includes('map-slatewater-foothills'));
    assert.ok(mapIds.includes('map-crownfields'));
    assert.match(describeMaps(), /Map of Brasshaven/);
    assert.match(describeMap('map-mistmere'), /mistmere-canal-ward/);
    assert.match(describeMap('map-coppergrass-steppe'), /coppergrass-steppe/);
    assert.match(describeMap('map-slatewater-foothills'), /slatewater-waylodge/);
    assert.match(describeMap('map-crownfields'), /crownfields-grange/);
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
    const state = createTestState();
    setPositionAndDiscover(state, 'thornwall-southgate', { coord: 'F-10' });
    const route = findTravelRoute(state, 'West Elderwood');

    assert.equal(route.ok, true);
    assert.equal(route.code, 'route-found');
    assert.equal(route.to, 'west-elderwood');
    assert.equal(route.routeRecord.id, 'route-thornwall-west-elderwood-road');
});

test('findTravelRoute rejects disconnected destination', () => {
    const state = createTestState();
    const route = findTravelRoute(state, 'Redfang Camp');

    assert.equal(route.ok, false);
    assert.equal(route.code, 'no-direct-route');
    assert.match(route.reason, /No direct route/);
});

test('startTravel returns semantic ActionResult and advanceTravel moves current place through canonical world time', () => {
    const state = createTestState();
    setPositionAndDiscover(state, 'thornwall-southgate', { coord: 'F-10' });
    const started = startTravel(state, 'West Elderwood');

    assert.equal(isActionResult(started), true);
    assert.equal(started.ok, true);
    assert.equal(started.action, 'travel.start');
    assert.equal(started.code, 'travel.started');
    assert.equal(started.outcome, 'started');
    assert.equal(started.data.to, 'west-elderwood');
    assert.equal(started.data.durationSeconds, 1800);
    assert.match(started.display.text, /Traveling to West Elderwood/);
    assert.equal(state.travel.active, true);
    assert.equal(state.travel.routeId, 'route-thornwall-west-elderwood-road');

    const advanced = advanceTravel(state, 1800);

    assert.equal(advanced.completed, true);
    assert.equal(state.worldTime.totalSeconds, 1800);
    assert.equal(state.currentPlaceId, 'west-elderwood');
    assert.equal(state.location, 'West Elderwood');
});

test('startTravel failure exposes semantic code and canonical display text only', () => {
    const state = createTestState();
    const result = startTravel(state, 'Unknown Somewhere');

    assert.equal(isActionResult(result), true);
    assert.equal(result.ok, false);
    assert.equal(result.code, 'travel.unknown-destination');
    assert.equal(result.outcome, 'blocked');
    assert.equal(result.data.destinationQuery, 'Unknown Somewhere');
    assert.match(result.display.text, /Unknown destination/);
    assert.match(describeActionResult(result), /Unknown destination/);
    assert.equal(Object.hasOwn(result, 'reason'), false);
});

test('router exposes maps places travel and wait commands', () => {
    const state = createTestState();
    setPositionAndDiscover(state, 'thornwall-southgate', { coord: 'F-10' });
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });

    assert.match(router('maps'), /map-thornwall/);
    assert.match(router('map map-brasshaven'), /Brasshaven/);
    assert.match(router('places'), /thornwall-southgate/);
    assert.match(router('places'), /brasshaven-market-ring/);
    assert.match(router('places'), /mistmere-canal-ward/);
    assert.match(router('travel West Elderwood'), /Traveling to West Elderwood/);
    assert.match(router('wait 1800'), /Arrived at West Elderwood/);
});
