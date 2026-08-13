import {
    coordinateKey,
    describeCoordinate,
    getNavigableCoordinateKeys,
    isTopologyPlace,
    normalizeDirection,
    normalizePositionForPlace,
} from '../data/coordinates.js';
import { findRouteLeg, listRoutes } from '../data/routeCatalog.js';
import { getConnectionsFrom, getPlace, listPlaces } from '../data/places.js';
import { actionFailure } from './actionResult.js';
import {
    advanceTravelJourney,
    provideTravelInterrupts,
    reconcileTravelJourney,
    startRouteJourney,
    TRAVEL_STATUSES,
} from './transportEngine.js';
import { ensureWorldTimeState } from './worldTimeEngine.js';

export { provideTravelInterrupts, reconcileTravelJourney };

export function describePlace(placeId) {
    const place = getPlace(placeId);
    if (!place) return `Unknown place: ${placeId}`;

    const exits = getConnectionsFrom(place.id)
        .map((connection) => {
            const destination = getPlace(connection.to);
            const restrictionText = connection.restrictions.length ? ' restricted' : ' open';
            const departText = connection.departFrom ? ` from ${describeCoordinate(connection.departFrom)}` : '';
            const directionText = connection.directions?.length ? ` ${connection.directions.join('/')}` : '';
            return `- ${destination?.name ?? connection.to} via ${connection.mode}${departText}${directionText}, ${connection.travelSeconds}s,${restrictionText}`;
        });
    const canonicalRoutes = listRoutes()
        .filter((route) => route.stops.some((stop) => stop.placeId === place.id))
        .map((route) => `- ${route.name} (${route.id}) [${route.type}; ${route.allowedModes.join(', ')}]`);

    return [
        place.name,
        `Type: ${place.type}`,
        `Region: ${place.region}`,
        `Danger Level: ${place.dangerLevel}`,
        describeCoordinateSystem(place),
        place.description,
        '',
        'Exits:',
        ...(exits.length ? exits : ['- None']),
        '',
        'Known route records:',
        ...(canonicalRoutes.length ? canonicalRoutes : ['- None']),
    ].join('\n');
}

export function describePlaces() {
    return listPlaces()
        .map((place) => `${place.id} - ${place.name} [${place.type}, danger ${place.dangerLevel}, ${describeCoordinateSystem(place)}]`)
        .join('\n');
}

export function findTravelRoute(state, destinationQuery, options = {}) {
    const from = state.currentPlaceId ?? 'thornwall-southgate';
    const destination = findPlaceByQuery(destinationQuery);
    if (!destination) {
        return { ok: false, code: 'unknown-destination', reason: `Unknown destination: ${destinationQuery}` };
    }

    const canonicalLeg = findRouteLeg(from, destination.id, { mode: options.mode ?? 'walk' });
    if (canonicalLeg) {
        const departureCheck = requireRouteStopPosition(state, canonicalLeg.fromStop);
        if (!departureCheck.ok) return { ...departureCheck, from, to: destination.id };
        const placeRestriction = findBlockingRestriction(state, destination.restrictions);
        if (placeRestriction) {
            return {
                ok: false,
                code: 'destination-restricted',
                reason: placeRestriction.reason ?? `Entry blocked by ${placeRestriction.type}.`,
                from,
                to: destination.id,
                restrictionType: placeRestriction.type,
            };
        }
        return {
            ok: true,
            code: 'route-found',
            from,
            to: destination.id,
            destination,
            routeRecord: canonicalLeg.route,
            routeLeg: canonicalLeg,
            connection: null,
        };
    }

    const connections = getConnectionsFrom(from).filter((candidate) => candidate.to === destination.id);
    const connection = selectConnectionForPosition(state, connections, options.direction);
    if (!connection) {
        if (connections.length) return describeBlockedConnection(state, connections, destination);
        return {
            ok: false,
            code: 'no-direct-route',
            reason: `No direct route from ${getPlace(from)?.name ?? from} to ${destination.name}.`,
            from,
            to: destination.id,
        };
    }

    const restriction = findBlockingRestriction(state, connection.restrictions);
    if (restriction) {
        return {
            ok: false,
            code: 'route-restricted',
            reason: restriction.reason ?? `Travel blocked by ${restriction.type}.`,
            from,
            to: destination.id,
            restrictionType: restriction.type,
        };
    }

    const placeRestriction = findBlockingRestriction(state, destination.restrictions);
    if (placeRestriction) {
        return {
            ok: false,
            code: 'destination-restricted',
            reason: placeRestriction.reason ?? `Entry blocked by ${placeRestriction.type}.`,
            from,
            to: destination.id,
            restrictionType: placeRestriction.type,
        };
    }

    return {
        ok: true,
        code: 'route-found',
        from,
        to: destination.id,
        connection,
        destination,
        routeRecord: null,
        routeLeg: null,
    };
}

export function startTravel(state, destinationQuery) {
    if (state.travel?.active) {
        const destinationName = getPlace(state.travel.to)?.name ?? state.travel.to;
        return actionFailure({
            action: 'travel.start',
            code: 'travel.already-active',
            outcome: 'blocked',
            data: { destinationId: state.travel.to },
            display: { text: `Already traveling to ${destinationName}.` },
        });
    }

    const route = findTravelRoute(state, destinationQuery);
    if (!route.ok) {
        return actionFailure({
            action: 'travel.start',
            code: `travel.${route.code ?? 'blocked'}`,
            outcome: 'blocked',
            data: {
                destinationQuery,
                from: route.from ?? state.currentPlaceId ?? null,
                to: route.to ?? null,
                restrictionType: route.restrictionType ?? null,
            },
            display: { text: route.reason ?? 'Travel is blocked.' },
        });
    }

    if (route.routeLeg) {
        return startRouteJourney(state, {
            routeId: route.routeRecord.id,
            from: route.from,
            to: route.to,
            fromStopId: route.routeLeg.fromStop.id,
            toStopId: route.routeLeg.toStop.id,
            mode: 'walk',
            durationSeconds: route.routeLeg.durationSeconds,
            arriveAt: route.routeLeg.toStop.coordinate ?? route.destination.coordinateSystem.start,
            distanceYalms: route.routeLeg.distanceYalms,
            hazardTags: route.routeLeg.hazardTags,
            knowledge: route.routeRecord.knowledge,
        });
    }

    return startRouteJourney(state, {
        routeId: null,
        from: route.from,
        to: route.to,
        mode: route.connection.mode,
        durationSeconds: route.connection.travelSeconds,
        arriveAt: route.connection.arriveAt ?? route.destination.coordinateSystem.start,
        distanceYalms: null,
        hazardTags: [],
        knowledge: null,
    });
}

export function advanceTravel(state, elapsedSeconds) {
    return advanceTravelJourney(state, elapsedSeconds);
}

export function describeTravel(state) {
    if (!state.travel?.active) return 'You are not currently traveling.';
    const destination = getPlace(state.travel.to);
    const now = ensureWorldTimeState(state).totalSeconds;
    const status = state.travel.status ?? TRAVEL_STATUSES.IN_TRANSIT;
    const remainingSeconds = state.travel.arriveAtWorldSeconds === undefined
        ? state.travel.remainingSeconds
        : Math.max(0, state.travel.arriveAtWorldSeconds - now);
    return [
        `${status === TRAVEL_STATUSES.WAITING ? 'Waiting to depart for' : 'Traveling to'} ${destination?.name ?? state.travel.to}.`,
        `Mode: ${state.travel.mode}`,
        `Route: ${state.travel.routeId ?? 'legacy direct connection'}`,
        `Status: ${status}`,
        `Remaining: ${remainingSeconds}/${state.travel.totalSeconds}s`,
        state.travel.departAtWorldSeconds !== undefined ? `Departure world time: ${state.travel.departAtWorldSeconds}` : null,
        state.travel.arriveAtWorldSeconds !== undefined ? `Arrival world time: ${state.travel.arriveAtWorldSeconds}` : null,
        state.travel.hazardTags?.length ? `Hazards: ${state.travel.hazardTags.join(', ')}` : null,
    ].filter(Boolean).join('\n');
}

export function findPlaceByQuery(query) {
    const normalized = normalize(query);
    return listPlaces().find((place) => place.id === normalized || normalize(place.name) === normalized || normalize(place.name).includes(normalized)) ?? null;
}

function requireRouteStopPosition(state, routeStop) {
    if (!routeStop?.coordinate) return { ok: true };
    const currentKey = coordinateKey(state.position ?? {});
    const requiredKey = coordinateKey(routeStop.coordinate);
    if (currentKey === requiredKey) return { ok: true };
    return {
        ok: false,
        code: 'departure-position-required',
        reason: `Reach ${describeCoordinate(routeStop.coordinate)} to use ${routeStop.id}. Current position: ${describeCoordinate(state.position ?? {})}.`,
    };
}

function findBlockingRestriction(state, restrictions = []) {
    return restrictions.find((restriction) => isRestrictionBlocking(state, restriction));
}

function isRestrictionBlocking(state, restriction) {
    switch (restriction.type) {
        case 'minLevel':
            return (state.player?.jobs?.level ?? 1) < restriction.value;
        case 'keyItem':
            return !(state.player?.keyItems ?? []).includes(restriction.value);
        case 'questFlag':
            return !state.flags?.[restriction.value];
        default:
            return false;
    }
}

function normalize(value) {
    return String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/[’']/g, '')
        .replace(/\s+/g, '-');
}

function describeCoordinateSystem(place) {
    return 'Layout: discovery-based';
}

function selectConnectionForPosition(state, connections, direction = null) {
    if (!connections.length) return null;
    const normalizedDirection = normalizeDirection(direction);
    const positionKey = coordinateKey(state.position ?? {});
    const matchingPosition = connections.filter((connection) => !connection.departFrom || coordinateKey(connection.departFrom) === positionKey);
    const candidates = matchingPosition.length ? matchingPosition : connections;
    if (normalizedDirection) {
        return candidates.find((connection) => (connection.directions ?? []).includes(normalizedDirection)) ?? null;
    }
    return matchingPosition[0] ?? null;
}

function describeBlockedConnection(state, connections, destination) {
    const place = getPlace(state.currentPlaceId);
    const current = state.position ?? normalizePositionForPlace(place, place.coordinateSystem.start);
    const options = connections
        .map((connection) => {
            const directionText = connection.directions?.length ? ` and move ${connection.directions.join(' or ')}` : '';
            return `${describeCoordinate(connection.departFrom)}${directionText}`;
        })
        .join('; ');
    return {
        ok: false,
        code: 'departure-position-required',
        from: state.currentPlaceId,
        to: destination.id,
        reason: `Reach ${options} to travel from ${place?.name ?? state.currentPlaceId} to ${destination.name}. Current position: ${describeCoordinate(current)}.`,
    };
}
