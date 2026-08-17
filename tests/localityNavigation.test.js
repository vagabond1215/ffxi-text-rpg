import test from 'node:test';
import assert from 'node:assert/strict';

import { createNewGameState } from '../js/text/gameState.js';
import {
    getNavigationMode,
    listLocalityDestinations,
    listLocalityPoints,
    moveWithinLocality,
    performLocalityPoiAction,
} from '../js/text/systems/localityEngine.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { listSemanticEvents } from '../js/text/systems/semanticEventEngine.js';

test('guarded settlement districts use locality navigation instead of grid movement presentation', () => {
    const state = createNewGameState();
    const model = createGameViewModel(state, { outputLines: [] });

    assert.equal(getNavigationMode(state), 'locality');
    assert.equal(model.navigation.mode, 'locality');
    assert.equal(model.map, null);
    assert.deepEqual(model.movement, []);
    assert.equal(model.header.coordinate, 'Local streets');
    assert.ok(model.navigation.destinations.some((entry) => entry.id === 'thornwall-crownward'));
    assert.ok(model.contextualActions.some((entry) => entry.intent === 'locality.move'));
});

test('wilderness keeps discovery map and directional exploration controls', () => {
    const state = createNewGameState();
    state.currentPlaceId = 'west-elderwood';
    state.location = 'West Elderwood';
    state.position = { placeId: 'west-elderwood', x: 4, y: 4 };
    state.atlas['west-elderwood'] = { placeId: 'west-elderwood', visited: { '4,4': { x: 4, y: 4 } }, notes: [] };

    const model = createGameViewModel(state, { outputLines: [] });

    assert.equal(getNavigationMode(state), 'exploration');
    assert.equal(model.navigation.mode, 'exploration');
    assert.ok(model.map);
    assert.equal(model.movement.length, 8);
});

test('locality crossings use existing place graph and authored fictional travel time', () => {
    const state = createNewGameState({ startWorldTimeSeconds: 100 });
    const destination = listLocalityDestinations(state).find((entry) => entry.id === 'thornwall-crownward');
    assert.equal(destination.travelSeconds, 20);

    const result = moveWithinLocality(state, destination.id);

    assert.equal(result.ok, true);
    assert.equal(state.currentPlaceId, 'thornwall-crownward');
    assert.equal(state.worldTime.totalSeconds, 120);
    assert.equal(listSemanticEvents(state, { type: 'locality.changed' }).length, 1);
});

test('safe locality exposes a bounded set of points without requiring compass movement', () => {
    const state = createNewGameState();
    const points = listLocalityPoints(state, { limit: 6 });

    assert.equal(points.length, 6);
    assert.ok(points.every((poi) => poi.placeId === 'thornwall-southgate'));
    assert.ok(points.some((poi) => poi.actions.includes('shop')));
});

test('locality point action focuses an internal POI coordinate while keeping interaction semantic', () => {
    const state = createNewGameState();
    const vendor = listLocalityPoints(state, { limit: 20 }).find((poi) => poi.actions.includes('shop'));

    const result = performLocalityPoiAction(state, vendor.id, 'shop');

    assert.equal(result.ok, true);
    assert.equal(state.activePoiId, vendor.id);
    assert.match(result.message, new RegExp(vendor.name));
    assert.match(result.message, /Action: shop/);
    assert.equal(listSemanticEvents(state, { type: 'locality.poi-used' }).length, 1);
});

test('Brasshaven and Mistmere existing city records also form locality graphs', () => {
    const brass = createNewGameState({ nationId: 'brasshaven' });
    const mist = createNewGameState({ nationId: 'mistmere' });

    assert.equal(getNavigationMode(brass), 'locality');
    assert.ok(listLocalityDestinations(brass).some((entry) => entry.id === 'brasshaven-delvers-ward'));
    assert.equal(getNavigationMode(mist), 'locality');
    assert.ok(listLocalityDestinations(mist).some((entry) => entry.id === 'mistmere-spire-ward'));
});
