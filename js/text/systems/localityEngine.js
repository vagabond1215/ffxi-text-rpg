import { getConnectionsFrom, getPlace } from '../data/places.js';
import { getPointOfInterest, getPoisForPlace } from '../data/pointsOfInterest.js';
import { setPositionAndDiscover } from './atlasEngine.js';
import { describeBlockingHandsOnTask, isCharacterHandsOnBusy } from './characterActivityEngine.js';
import { describeNpcScheduleStatus, getPoiScheduleStatus } from './npcScheduleEngine.js';
import { syncActivePartyLocation } from './partyEngine.js';
import { discoverPoi, performPoiAction, talkAtCurrentGrid } from './poiEngine.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import { advanceSimulationUntilInterrupt } from './simulationInterruptEngine.js';
import { ensureWorldTimeState } from './worldTimeEngine.js';

export const LOCALITY_NAVIGATION_VERSION = 2;
export const SETTLEMENT_LOCALITY_TYPES = Object.freeze(['city', 'cityInterior', 'travelHub']);

export function isSettlementLocality(placeOrId) {
    const place = typeof placeOrId === 'string' ? getPlace(placeOrId) : placeOrId;
    return Boolean(place
        && Number(place.dangerLevel ?? 0) === 0
        && SETTLEMENT_LOCALITY_TYPES.includes(place.type)
        && !place.flags?.externalPlaceholder);
}

export function getNavigationMode(state) {
    if (state?.activeBattle?.phase === 'active') return 'combat';
    if (state?.travel?.active) return 'route';
    return isSettlementLocality(state?.currentPlaceId) ? 'locality' : 'exploration';
}

export function listLocalityDestinations(state) {
    const current = getPlace(state?.currentPlaceId);
    if (!isSettlementLocality(current)) return [];
    return getConnectionsFrom(current.id)
        .filter((connection) => connection.mode === 'walk' && !connection.flags?.externalPlaceholder)
        .map((connection) => ({ connection, destination: getPlace(connection.to) }))
        .filter(({ destination }) => isSettlementLocality(destination) && destination.nation === current.nation)
        .map(({ connection, destination }) => Object.freeze({
            id: destination.id,
            name: destination.name,
            type: destination.type,
            travelSeconds: Math.max(0, Number(connection.travelSeconds) || 0),
            connectionId: connection.id,
        }));
}

export function listLocalityPoints(state, options = {}) {
    if (!isSettlementLocality(state?.currentPlaceId)) return [];
    const limit = Math.max(1, Number(options.limit) || 8);
    return getPoisForPlace(state.currentPlaceId)
        .filter((poi) => !['routeExit'].includes(poi.type))
        .slice(0, limit)
        .map((poi) => decoratePoiAvailability(state, poi));
}

export function moveWithinLocality(state, destinationId) {
    if (state?.activeBattle?.phase === 'active') return fail('locality.in-combat', 'You cannot cross the settlement while in battle.');
    if (state?.travel?.active) return fail('locality.travel-active', 'Finish or stop the current journey first.');
    if (isCharacterHandsOnBusy(state)) return fail('locality.work-active', describeBlockingHandsOnTask(state));
    const current = getPlace(state?.currentPlaceId);
    if (!isSettlementLocality(current)) return fail('locality.not-locality', 'Named locality movement is only available in safe settlement areas.');

    const destination = listLocalityDestinations(state).find((entry) => entry.id === getPlace(destinationId)?.id);
    if (!destination) return fail('locality.not-connected', `That locality is not directly reachable from ${current.name}.`);

    const beforeWorldSeconds = ensureWorldTimeState(state).totalSeconds;
    const advance = advanceSimulationUntilInterrupt(state, destination.travelSeconds, {
        worldTimeOptions: { source: 'localityEngine' },
    });
    if (advance.data?.interrupted) {
        return fail(
            'locality.interrupted',
            `Your crossing toward ${destination.name} is interrupted after ${advance.data.secondsAdvanced}s.`,
            { interrupt: advance.data.interrupt, secondsAdvanced: advance.data.secondsAdvanced },
        );
    }

    const place = getPlace(destination.id);
    const positioned = setPositionAndDiscover(state, place.id, place.coordinateSystem.start, {
        important: [`Entered ${place.name} by locality travel`],
    });
    if (!positioned.ok) return fail('locality.position-failed', positioned.reason);
    syncActivePartyLocation(state, place.id);
    state.activePoiId = null;

    const event = emitSemanticEvent(state, 'locality.changed', {
        fromPlaceId: current.id,
        toPlaceId: place.id,
        travelSeconds: destination.travelSeconds,
        beforeWorldSeconds,
        afterWorldSeconds: ensureWorldTimeState(state).totalSeconds,
    }, { source: 'localityEngine' });

    return ok('locality.changed', `Walked to ${place.name} (${destination.travelSeconds}s).`, {
        placeId: place.id,
        travelSeconds: destination.travelSeconds,
        eventId: event.id,
    });
}

export function performLocalityPoiAction(state, poiId, action = 'talk') {
    if (!isSettlementLocality(state?.currentPlaceId)) return fail('locality.poi-unavailable', 'Locality actions are only available in safe settlement areas.');
    if (isCharacterHandsOnBusy(state)) return fail('locality.work-active', describeBlockingHandsOnTask(state));
    const poi = getPointOfInterest(poiId);
    if (!poi || poi.placeId !== state.currentPlaceId) return fail('locality.poi-missing', 'That point of interest is not in this locality.');

    const availability = getPoiScheduleStatus(state, poi);
    if (availability.scheduled && !availability.available) {
        return fail('locality.poi-unavailable-now', describeNpcScheduleStatus(availability), {
            poiId: poi.id,
            scheduleId: availability.scheduleId,
            nextAvailableAtWorldSeconds: availability.nextAvailableAtWorldSeconds,
        });
    }

    const positioned = setPositionAndDiscover(state, state.currentPlaceId, poi.coordinate, {
        important: [`Visited ${poi.name}`],
    });
    if (!positioned.ok) return fail('locality.poi-position-failed', positioned.reason);
    discoverPoi(state, poi);
    state.activePoiId = poi.id;

    const canonicalAction = String(action ?? 'talk').trim().toLowerCase();
    const message = canonicalAction === 'talk'
        ? talkAtCurrentGrid(state, poi.name)
        : performPoiAction(state, canonicalAction, poi.name);

    emitSemanticEvent(state, 'locality.poi-used', {
        placeId: state.currentPlaceId,
        poiId: poi.id,
        action: canonicalAction,
    }, { source: 'localityEngine' });
    return ok('locality.poi-used', message, { poiId: poi.id, action: canonicalAction });
}

export function describeLocality(state) {
    const place = getPlace(state?.currentPlaceId);
    if (!isSettlementLocality(place)) return `${place?.name ?? 'This place'} uses exploration navigation.`;
    const destinations = listLocalityDestinations(state);
    const points = listLocalityPoints(state, { limit: 20 });
    return [
        `${place.name} — safe locality`,
        destinations.length ? `Connected localities: ${destinations.map((entry) => entry.name).join(', ')}` : 'Connected localities: none',
        points.length ? `Local points: ${points.map((poi) => poi.name).join(', ')}` : 'Local points: none',
        'Browsing is free; locality crossings consume authored fictional time and remain interruptible.',
    ].join('\n');
}

function decoratePoiAvailability(state, poi) {
    const availability = getPoiScheduleStatus(state, poi);
    if (!availability.scheduled) return poi;
    return Object.freeze({
        ...poi,
        notes: `${poi.notes} · ${describeNpcScheduleStatus(availability)}`,
        availability,
    });
}

function ok(code, message, data = {}) { return { ok: true, code, message, data }; }
function fail(code, message, data = {}) { return { ok: false, code, message, data }; }
