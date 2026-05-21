import { getPlace, isCoordinateInsidePlace } from '../data/places.js';

export function createAtlasState(startPlaceId, coordinate) {
    const atlas = {};
    markVisited(atlas, startPlaceId, coordinate, { important: ['Starting position'] });
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
        x: coordinate.x,
        y: coordinate.y,
        visitedAt: new Date().toISOString(),
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

    const visitedCount = Object.keys(atlasEntry.visited).length;
    const total = place.coordinateSystem.width * place.coordinateSystem.height;

    return [
        `${place.name} Atlas`,
        `Visited: ${visitedCount}/${total} grids`,
        'Legend: @ current, . visited, ? unknown',
        '',
        ...rows,
    ].join('\n');
}

export function describeCurrentGrid(state) {
    const place = getPlace(state.currentPlaceId);
    if (!place) return `Unknown place: ${state.currentPlaceId}`;
    const position = state.position ?? place.coordinateSystem.start;
    const visited = hasVisited(state.atlas, place.id, position);

    return [
        `${place.name} grid (${position.x}, ${position.y})`,
        visited ? 'This grid is recorded in your atlas.' : 'This grid has not been recorded yet.',
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
        return { ok: false, reason: `Coordinate (${coordinate.x}, ${coordinate.y}) is outside ${place.name}.` };
    }

    state.currentPlaceId = place.id;
    state.location = place.name;
    state.position = { placeId: place.id, x: coordinate.x, y: coordinate.y };
    state.atlas ??= {};
    markVisited(state.atlas, place.id, coordinate, details);

    return { ok: true, place, coordinate };
}

export function coordinateKey(coordinate) {
    return `${coordinate.x},${coordinate.y}`;
}
