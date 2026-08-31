import test from 'node:test';
import assert from 'node:assert/strict';

import { getConnectionsFrom } from '../js/text/data/places.js';
import { getPoisForPlace } from '../js/text/data/pointsOfInterest.js';
import { createNewGameState } from '../js/text/gameState.js';
import {
    exploreLocality,
    getNavigationMode,
    listLocalityDestinations,
    listLocalityPoints,
    lookAroundLocality,
    moveWithinLocality,
    performLocalityPoiAction,
    visitLocalityPoi,
} from '../js/text/systems/localityEngine.js';
import {
    recordConnectorExposure,
    recordPoiExposure,
} from '../js/text/systems/localKnowledgeEngine.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { listSemanticEvents } from '../js/text/systems/semanticEventEngine.js';

test('fresh settlement arrival hides canonical locality options behind Look Around and Explore', () => {
    const state = createNewGameState();
    const model = createGameViewModel(state, { outputLines: [] });

    assert.equal(getNavigationMode(state), 'locality');
    assert.equal(model.navigation.mode, 'locality');
    assert.equal(model.map, null);
    assert.deepEqual(model.movement, []);
    assert.equal(model.header.coordinate, 'Local streets');
    assert.deepEqual(model.navigation.destinations, []);
    assert.deepEqual(listLocalityPoints(state), []);
    assert.ok(model.contextualActions.some((entry) => entry.intent === 'locality.look' && entry.label === 'Look Around'));
    assert.ok(model.contextualActions.some((entry) => entry.intent === 'locality.explore' && entry.label === 'Explore'));
    assert.equal(model.contextualActions.some((entry) => entry.intent === 'locality.move'), false);
});

test('Look Around sights one immediate target without automatically entering or inventing new identity knowledge', () => {
    const state = createNewGameState();
    const result = lookAroundLocality(state);

    assert.equal(result.ok, true);
    assert.equal(result.data.targetType, 'poi');
    assert.equal(state.activePoiId ?? null, null);
    const points = listLocalityPoints(state, { limit: 20 });
    assert.equal(points.length, 1);
    assert.equal(points[0].knowledgeState, 'sighted');
    assert.equal(points[0].present, false);
    assert.equal(points[0].name, points[0].canonicalName, 'Sera was already named by the origin referral');
    assert.equal(state.localKnowledge.pois[points[0].id].interactionCount, 0, 'sighting a referred contact is not the same as meeting them');
});

test('Explore advances fictional time and uses injectable RNG for deterministic locality discovery', () => {
    const state = createNewGameState({ startWorldTimeSeconds: 100 });
    const result = exploreLocality(state, { durationSeconds: 120, rng: () => 0 });

    assert.equal(result.ok, true);
    assert.equal(state.worldTime.totalSeconds, 220);
    assert.equal(state.localKnowledge.explorationSequence, 1);
    assert.equal(result.data.outcome, 'poi');
    assert.equal(listSemanticEvents(state, { type: 'locality.explored' }).length, 1);
});

test('a sighted POI requires an explicit approach step before service interaction', () => {
    const state = createNewGameState();
    const vendor = getPoisForPlace('thornwall-southgate').find((poi) => poi.actions.includes('shop'));
    recordPoiExposure(state, vendor, { points: 1 });

    assert.equal(performLocalityPoiAction(state, vendor.id, 'shop').ok, false);

    state.localKnowledge.currentAnchor = { type: 'poi', id: vendor.id, placeId: state.currentPlaceId };
    const visit = visitLocalityPoi(state, vendor.id);
    assert.equal(visit.ok, true);
    assert.equal(state.activePoiId, vendor.id);

    const use = performLocalityPoiAction(state, vendor.id, 'shop');
    assert.equal(use.ok, true);
    assert.match(use.message, /Action: shop/);
    assert.equal(listSemanticEvents(state, { type: 'locality.poi-used' }).length, 1);
});

test('familiar POIs remain directly locatable after the immediate sighting anchor is gone', () => {
    const state = createNewGameState();
    const vendor = getPoisForPlace('thornwall-southgate').find((poi) => poi.actions.includes('shop'));
    recordPoiExposure(state, vendor, { points: 7, learnedName: true });
    state.localKnowledge.currentAnchor = null;

    const points = listLocalityPoints(state, { limit: 20 });
    const knownVendor = points.find((poi) => poi.id === vendor.id);
    assert.equal(knownVendor.knowledgeState, 'familiar');
    assert.equal(knownVendor.name, vendor.name);

    const visit = visitLocalityPoi(state, vendor.id);
    assert.equal(visit.ok, true);
    assert.equal(state.activePoiId, vendor.id);
});

test('adjacent settlement connections must be sighted or familiar before crossing', () => {
    const state = createNewGameState({ startWorldTimeSeconds: 100 });
    const connection = getConnectionsFrom(state.currentPlaceId)
        .find((entry) => entry.to === 'thornwall-crownward');

    assert.deepEqual(listLocalityDestinations(state), []);
    assert.equal(moveWithinLocality(state, 'thornwall-crownward').ok, false);

    recordConnectorExposure(state, connection, { points: 1, learnedDestinationName: true });
    state.localKnowledge.currentAnchor = { type: 'connection', id: connection.id, placeId: state.currentPlaceId };
    const destination = listLocalityDestinations(state).find((entry) => entry.id === 'thornwall-crownward');
    assert.equal(destination.navigationState, 'sighted');

    const result = moveWithinLocality(state, destination.id);
    assert.equal(result.ok, true);
    assert.equal(state.currentPlaceId, 'thornwall-crownward');
    assert.equal(state.worldTime.totalSeconds, 120);
    assert.equal(listSemanticEvents(state, { type: 'locality.changed' }).length, 1);
    assert.equal(state.localKnowledge.currentAnchor?.type, 'connection', 'arrival preserves the reverse entrance for immediate backtracking');
});

test('Brasshaven and Mistmere remain locality-mode places without omniscient adjacency lists', () => {
    const brass = createNewGameState({ nationId: 'brasshaven' });
    const mist = createNewGameState({ nationId: 'mistmere' });

    assert.equal(getNavigationMode(brass), 'locality');
    assert.deepEqual(listLocalityDestinations(brass), []);
    assert.equal(getNavigationMode(mist), 'locality');
    assert.deepEqual(listLocalityDestinations(mist), []);
});
