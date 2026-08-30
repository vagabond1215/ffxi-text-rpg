import assert from 'node:assert/strict';

import { getConnectionsFrom } from '../../js/text/data/places.js';
import { getPointOfInterest, getPoisForPlace } from '../../js/text/data/pointsOfInterest.js';
import {
    FAMILIARITY_THRESHOLDS,
    getPoiFamiliarityThreshold,
    identifyNpc,
    requiresPoiEntryTransition,
    recordConnectorExposure,
    recordPoiExposure,
    setCurrentLocalAnchor,
} from '../../js/text/systems/localKnowledgeEngine.js';
import {
    enterLocalityPoi,
    moveWithinLocality,
    performLocalityPoiAction,
    visitLocalityPoi,
} from '../../js/text/systems/localityEngine.js';
import { getPoiScheduleStatus } from '../../js/text/systems/npcScheduleEngine.js';

export function makePoiFamiliar(state, poiOrId, options = {}) {
    const poi = resolvePoi(state, poiOrId);
    assert.ok(poi, `Expected POI ${String(poiOrId)} in ${state.currentPlaceId}.`);
    recordPoiExposure(state, poi, {
        points: options.points ?? getPoiFamiliarityThreshold(poi),
        learnedName: options.learnedName !== false,
    });
    if (options.identifyNpc !== false) {
        const schedule = getPoiScheduleStatus(state, poi);
        if (schedule.npcId) identifyNpc(state, schedule.npcId, { points: 1 });
    }
    return poi;
}

export function reachPoi(state, poiOrId, options = {}) {
    const poi = makePoiFamiliar(state, poiOrId, options);
    setCurrentLocalAnchor(state, { type: 'poi', id: poi.id, placeId: state.currentPlaceId });
    const result = visitLocalityPoi(state, poi.id);
    assert.equal(result.ok, true, result.reason ?? result.message);
    return poi;
}

export function useKnownPoi(state, poiOrId, action = 'talk', options = {}) {
    const poi = reachPoi(state, poiOrId, options);
    if (requiresPoiEntryTransition(poi)) {
        const entered = enterLocalityPoi(state, poi.id);
        assert.equal(entered.ok, true, entered.reason ?? entered.message);
    }
    const result = performLocalityPoiAction(state, poi.id, action);
    assert.equal(result.ok, true, result.reason ?? result.message);
    return result;
}

export function learnLocality(state, options = {}) {
    for (const poi of getPoisForPlace(state.currentPlaceId)) {
        makePoiFamiliar(state, poi, { identifyNpc: options.identifyNpcs !== false });
    }
    for (const connection of getConnectionsFrom(state.currentPlaceId)) {
        recordConnectorExposure(state, connection, {
            points: FAMILIARITY_THRESHOLDS[1],
            learnedDestinationName: true,
        });
    }
    return state;
}

export function learnConnectionTo(state, destinationId, options = {}) {
    const connection = getConnectionsFrom(state.currentPlaceId)
        .find((candidate) => candidate.to === destinationId);
    assert.ok(connection, `Expected a canonical connection from ${state.currentPlaceId} to ${destinationId}.`);
    recordConnectorExposure(state, connection, {
        points: options.points ?? FAMILIARITY_THRESHOLDS[1],
        learnedDestinationName: true,
    });
    return connection;
}

export function moveToKnownLocality(state, destinationId, options = {}) {
    const connection = learnConnectionTo(state, destinationId, options);
    setCurrentLocalAnchor(state, { type: 'connection', id: connection.id, placeId: state.currentPlaceId });
    const result = moveWithinLocality(state, destinationId);
    assert.equal(result.ok, true, result.reason ?? result.message);
    return result;
}

export function learnAllPoisInPlace(state, placeId = state.currentPlaceId) {
    for (const poi of getPoisForPlace(placeId)) {
        recordPoiExposure(state, poi, {
            points: getPoiFamiliarityThreshold(poi),
            learnedName: true,
        });
    }
    return state;
}

function resolvePoi(state, poiOrId) {
    if (poiOrId && typeof poiOrId === 'object') return getPointOfInterest(poiOrId.id);
    const query = String(poiOrId ?? '').trim().toLowerCase();
    return getPointOfInterest(poiOrId)
        ?? getPoisForPlace(state.currentPlaceId)
            .find((poi) => poi.name.toLowerCase() === query || poi.name.toLowerCase().includes(query));
}
