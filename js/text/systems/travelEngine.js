import {
    coordinateKey,
    describeCoordinate,
    getNavigableCoordinateKeys,
    isTopologyPlace,
    normalizeDirection,
    normalizePositionForPlace,
} from '../data/coordinates.js';
import { getConnectionsFrom, getPlace, listPlaces } from '../data/places.js';
import { setPositionAndDiscover } from './atlasEngine.js';

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
    ].join('\n');
}

export function describePlaces() {
    return listPlaces()
        .map((place) => `${place.id} - ${place.name} [${place.type}, danger ${place.dangerLevel}, ${describeCoordinateSystem(place)}]`)
        .join('\n');
}

export function findTravelRoute(state, destinationQuery, options = {}) {
    const from = state.currentPlaceId ?? 'southern-sandoria';
    const destination = findPlaceByQuery(destinationQuery);
    if (!destination) {
        return { ok: false, reason: `Unknown destination: ${destinationQuery}` };
    }

    const connections = getConnectionsFrom(from).filter((candidate) => candidate.to === destination.id);
    const connection = selectConnectionForPosition(state, connections, options.direction);
    if (!connection) {
        if (connections.length) return describeBlockedConnection(state, connections, destination);
        return { ok: false, reason: `No direct route from ${getPlace(from)?.name ?? from} to ${destination.name}.` };
    }

    const restriction = findBlockingRestriction(state, connection.restrictions);
    if (restriction) {
        return { ok: false, reason: restriction.reason ?? `Travel blocked by ${restriction.type}.` };
    }

    const placeRestriction = findBlockingRestriction(state, destination.restrictions);
    if (placeRestriction) {
        return { ok: false, reason: placeRestriction.reason ?? `Entry blocked by ${placeRestriction.type}.` };
    }

    return {
        ok: true,
        from,
        to: destination.id,
        connection,
        destination,
    };
}

export function startTravel(state, destinationQuery) {
    if (state.travel?.active) {
        return { ok: false, reason: `Already traveling to ${getPlace(state.travel.to)?.name ?? state.travel.to}.` };
    }

    const route = findTravelRoute(state, destinationQuery);
    if (!route.ok) return route;

    state.travel = {
        active: true,
        from: route.from,
        to: route.to,
        mode: route.connection.mode,
        totalSeconds: route.connection.travelSeconds,
        remainingSeconds: route.connection.travelSeconds,
        arriveAt: route.connection.arriveAt ?? route.destination.coordinateSystem.start,
    };

    return {
        ok: true,
        message: `Traveling to ${route.destination.name}. Estimated time: ${route.connection.travelSeconds}s.`,
        travel: state.travel,
    };
}

export function advanceTravel(state, elapsedSeconds) {
    if (!state.travel?.active) return { completed: false };

    state.travel.remainingSeconds = Math.max(0, state.travel.remainingSeconds - elapsedSeconds);
    if (state.travel.remainingSeconds > 0) {
        return { completed: false, travel: state.travel };
    }

    const destination = getPlace(state.travel.to);
    const completed = state.travel;
    const arrival = completed.arriveAt ?? destination?.coordinateSystem.start ?? { x: 0, y: 0 };
    if (destination) {
        setPositionAndDiscover(state, destination.id, arrival, { important: ['Zone arrival'] });
    } else {
        state.currentPlaceId = completed.to;
        state.location = completed.to;
        state.position = { placeId: completed.to, ...arrival };
    }
    state.travel = null;

    return {
        completed: true,
        travel: completed,
        destination,
        message: `Arrived at ${destination?.name ?? completed.to} ${describeCoordinate(arrival)}.`,
    };
}

export function describeTravel(state) {
    if (!state.travel?.active) return 'You are not currently traveling.';
    const destination = getPlace(state.travel.to);
    return [
        `Traveling to ${destination?.name ?? state.travel.to}.`,
        `Mode: ${state.travel.mode}`,
        `Remaining: ${state.travel.remainingSeconds}/${state.travel.totalSeconds}s`,
        `Arrival: ${describeCoordinate(state.travel.arriveAt)}`,
    ].join('\n');
}

export function findPlaceByQuery(query) {
    const normalized = normalize(query);
    return listPlaces().find((place) => place.id === normalized || normalize(place.name) === normalized || normalize(place.name).includes(normalized)) ?? null;
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
    if (isTopologyPlace(place)) {
        const bounds = place.coordinateSystem.bounds;
        return `Coordinates: ${bounds.minColumn}-${bounds.maxColumn}/${bounds.minRow}-${bounds.maxRow}, navigable ${getNavigableCoordinateKeys(place).length}`;
    }
    return `Grid: ${place.coordinateSystem.width}x${place.coordinateSystem.height}`;
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
        reason: `Reach ${options} to travel from ${place?.name ?? state.currentPlaceId} to ${destination.name}. Current position: ${describeCoordinate(current)}.`,
    };
}
