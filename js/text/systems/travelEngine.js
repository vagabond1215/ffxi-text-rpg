import { getConnectionsFrom, getPlace, listPlaces } from '../data/places.js';

export function describePlace(placeId) {
    const place = getPlace(placeId);
    if (!place) return `Unknown place: ${placeId}`;

    const exits = getConnectionsFrom(place.id)
        .map((connection) => {
            const destination = getPlace(connection.to);
            const restrictionText = connection.restrictions.length ? ' restricted' : ' open';
            return `- ${destination?.name ?? connection.to} via ${connection.mode}, ${connection.travelSeconds}s,${restrictionText}`;
        });

    return [
        place.name,
        `Type: ${place.type}`,
        `Region: ${place.region}`,
        `Danger Level: ${place.dangerLevel}`,
        place.description,
        '',
        'Exits:',
        ...(exits.length ? exits : ['- None']),
    ].join('\n');
}

export function describePlaces() {
    return listPlaces()
        .map((place) => `${place.id} - ${place.name} [${place.type}, danger ${place.dangerLevel}]`)
        .join('\n');
}

export function findTravelRoute(state, destinationQuery) {
    const from = state.currentPlaceId ?? 'southern-sandoria';
    const destination = findPlaceByQuery(destinationQuery);
    if (!destination) {
        return { ok: false, reason: `Unknown destination: ${destinationQuery}` };
    }

    const connection = getConnectionsFrom(from).find((candidate) => candidate.to === destination.id);
    if (!connection) {
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
    state.currentPlaceId = state.travel.to;
    state.location = destination?.name ?? state.travel.to;
    const completed = state.travel;
    state.travel = null;

    return {
        completed: true,
        travel: completed,
        destination,
        message: `Arrived at ${destination?.name ?? completed.to}.`,
    };
}

export function describeTravel(state) {
    if (!state.travel?.active) return 'You are not currently traveling.';
    const destination = getPlace(state.travel.to);
    return [
        `Traveling to ${destination?.name ?? state.travel.to}.`,
        `Mode: ${state.travel.mode}`,
        `Remaining: ${state.travel.remainingSeconds}/${state.travel.totalSeconds}s`,
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
