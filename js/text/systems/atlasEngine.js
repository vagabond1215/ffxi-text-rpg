import {
    coordinateKey as normalizedCoordinateKey,
    getNavigableCoordinateKeys,
    isNavigableCoordinate,
    isTopologyPlace,
    normalizePositionForPlace,
} from '../data/coordinates.js';
import { getPlace, isCoordinateInsidePlace } from '../data/places.js';

export function createAtlasState(startPlaceId, coordinate, options = {}) {
    const atlas = {};
    markVisited(atlas, startPlaceId, coordinate, {
        important: ['Starting position'],
        worldTimeSeconds: options.worldTimeSeconds ?? 0,
    });
    return atlas;
}

export function markVisited(atlas, placeId, coordinate, details = {}) {
    atlas[placeId] ??= {
        placeId,
        visited: {},
        notes: [],
    };

    const key = coordinateKey(coordinate);
    atlas[placeId].visited[key] = {
        ...(Number.isInteger(coordinate.x) && Number.isInteger(coordinate.y)
            ? { x: coordinate.x, y: coordinate.y }
            : { coord: coordinateKey(coordinate), levelId: coordinate.levelId ?? 'main' }),
        visitedAtWorldSeconds: normalizeWorldTimeSeconds(details.worldTimeSeconds),
        important: details.important ?? [],
        notes: details.notes ?? [],
    };

    return atlas[placeId].visited[key];
}

export function hasVisited(atlas, placeId, coordinate) {
    return Boolean(atlas?.[placeId]?.visited?.[coordinateKey(coordinate)]);
}

export function describeAtlas(state, placeId = state.currentPlaceId) {
    const place = getPlace(placeId);
    if (!place) return `Unknown place: ${placeId}`;

    const atlasEntry = state.atlas?.[place.id];
    if (!atlasEntry) {
        return `${place.name} has not been visited. Atlas details are unknown.`;
    }

    const visitedCount = Object.keys(atlasEntry.visited).length;
    const currentRecorded = state.currentPlaceId === place.id && hasVisited(state.atlas, place.id, state.position);

    return [
        `${place.name} Atlas`,
        `Known areas: ${visitedCount}`,
        currentRecorded ? 'Your current area is recorded.' : 'Your current area is elsewhere.',
        'Unexplored layout and total map extent remain hidden until discovered through play.',
    ].join('\n');
}

export function describeCurrentGrid(state) {
    const place = getPlace(state.currentPlaceId);
    if (!place) return `Unknown place: ${state.currentPlaceId}`;
    const position = state.position ?? place.coordinateSystem.start;
    const visited = hasVisited(state.atlas, place.id, position);

    return [
        `${place.name} local area`,
        visited ? 'This area is recorded in your atlas.' : 'This area has not been recorded yet.',
        describeGridSpawnHints(place, position, visited),
    ].join('\n');
}

export function describeGridSpawnHints(place, coordinate, visited = true) {
    if (!visited) return 'Spawn details are unknown until visited.';

    const matching = place.spawnRules.filter((rule) => rule.grids.includes(coordinateKey(coordinate)));
    if (!matching.length) return 'No known hostile spawn information recorded here.';

    return [
        'Known spawn pressure:',
        ...matching.map((rule) => `- ${rule.enemyId}: count ${rule.count}, aggro ${rule.aggroTypes.length ? rule.aggroTypes.join('/') : 'none'}, base ${Math.round(rule.baseChance * 100)}%`),
    ].join('\n');
}

export function setPositionAndDiscover(state, placeId, coordinate, details = {}) {
    const place = getPlace(placeId);
    if (!place) return { ok: false, reason: `Unknown place: ${placeId}` };
    if (!isCoordinateInsidePlace(place, coordinate)) {
        return { ok: false, reason: `That destination is outside ${place.name}.` };
    }
    if (isTopologyPlace(place) && !isNavigableCoordinate(place, coordinate, coordinate?.levelId ?? 'main')) {
        return { ok: false, reason: `That destination is not navigable in ${place.name}.` };
    }

    if (details.preserveLocalContext !== true) {
        state.activePoiId = null;
        if (state.localKnowledge) state.localKnowledge.currentAnchor = null;
    }
    state.currentPlaceId = place.id;
    state.location = place.name;
    state.position = normalizePositionForPlace(place, coordinate, coordinate?.facing);
    state.atlas ??= {};
    markVisited(state.atlas, place.id, state.position, {
        ...details,
        worldTimeSeconds: state.worldTime?.totalSeconds,
    });

    return { ok: true, place, coordinate: state.position };
}

export function coordinateKey(coordinate) {
    return normalizedCoordinateKey(coordinate);
}

function normalizeWorldTimeSeconds(value) {
    return Number.isInteger(value) && value >= 0 ? value : 0;
}

function describeGridAtlasRows(state, place) {
    const rows = [];
    for (let y = 0; y < place.coordinateSystem.height; y += 1) {
        const cells = [];
        for (let x = 0; x < place.coordinateSystem.width; x += 1) {
            const here = state.position?.placeId === place.id && state.position.x === x && state.position.y === y;
            const visited = hasVisited(state.atlas, place.id, { x, y });
            cells.push(here ? '@' : visited ? '.' : '?');
        }
        rows.push(cells.join(' '));
    }
    return rows;
}

function describeTopologyAtlasRows(state, place) {
    return getNavigableCoordinateKeys(place).map((coord) => {
        const here = state.position?.placeId === place.id && coordinateKey(state.position) === coord;
        const visited = hasVisited(state.atlas, place.id, { coord });
        return `${coord}: ${here ? '@' : visited ? '.' : '?'}`;
    });
}
