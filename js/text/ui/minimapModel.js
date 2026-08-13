import {
    columnIndex,
    coordinateKey,
    getLevel,
    getNavigableCoordinateKeys,
    isTopologyPlace,
    normalizeCoordinate,
    parseCoordinate,
} from '../data/coordinates.js';
import { getPlace } from '../data/places.js';

const DIRECTION_VECTORS = Object.freeze({
    northwest: Object.freeze({ x: -1, y: -1 }),
    north: Object.freeze({ x: 0, y: -1 }),
    northeast: Object.freeze({ x: 1, y: -1 }),
    west: Object.freeze({ x: -1, y: 0 }),
    east: Object.freeze({ x: 1, y: 0 }),
    southwest: Object.freeze({ x: -1, y: 1 }),
    south: Object.freeze({ x: 0, y: 1 }),
    southeast: Object.freeze({ x: 1, y: 1 }),
});

export function createMinimapModel(state) {
    const place = getPlace(state?.currentPlaceId);
    if (!place?.coordinateSystem) return null;

    const currentKey = coordinateKey(state?.position);
    const atlasEntry = state?.atlas?.[place.id];
    const visitedKeys = new Set(Object.keys(atlasEntry?.visited ?? {}));
    if (currentKey !== 'unknown') visitedKeys.add(currentKey);

    return isTopologyPlace(place)
        ? createTopologyModel(state, place, currentKey, visitedKeys)
        : createGridModel(state, place, currentKey, visitedKeys);
}

function createTopologyModel(state, place, currentKey, visitedKeys) {
    const system = place.coordinateSystem;
    const bounds = system.bounds ?? { minColumn: 'A', maxColumn: 'A', minRow: 1, maxRow: 1 };
    const minColumnIndex = columnIndex(bounds.minColumn);
    const maxColumnIndex = columnIndex(bounds.maxColumn);
    const width = Math.max(1, maxColumnIndex - minColumnIndex + 1);
    const height = Math.max(1, Number(bounds.maxRow) - Number(bounds.minRow) + 1);
    const toCell = (key) => topologyCell(key, minColumnIndex, Number(bounds.minRow));
    const cells = [...visitedKeys]
        .map((key) => ({ ...toCell(key), key, current: key === currentKey }))
        .filter((cell) => Number.isInteger(cell.x) && Number.isInteger(cell.y));
    const level = getLevel(place, state?.position?.levelId ?? 'main');
    const connections = buildTopologyConnections(level, visitedKeys, currentKey, toCell);

    return Object.freeze({
        placeId: place.id,
        placeName: place.name,
        mode: 'topology',
        width,
        height,
        currentKey,
        currentLabel: 'Current area',
        exploredCount: visitedKeys.size,
        totalCount: '?',
        cells: Object.freeze(cells.map((cell) => Object.freeze(cell))),
        connections: Object.freeze(connections.map((connection) => Object.freeze(connection))),
    });
}

function createGridModel(state, place, currentKey, visitedKeys) {
    const system = place.coordinateSystem;
    const width = Math.max(1, Number(system.width) || 1);
    const height = Math.max(1, Number(system.height) || 1);
    const cells = [...visitedKeys]
        .map((key) => {
            const parsed = parseCoordinate(key);
            return parsed?.kind === 'numeric'
                ? { x: parsed.x, y: parsed.y, key, current: key === currentKey }
                : null;
        })
        .filter(Boolean);

    return Object.freeze({
        placeId: place.id,
        placeName: place.name,
        mode: 'grid',
        width,
        height,
        currentKey,
        currentLabel: 'Current area',
        exploredCount: visitedKeys.size,
        totalCount: '?',
        cells: Object.freeze(cells.map((cell) => Object.freeze(cell))),
        connections: Object.freeze([]),
    });
}

function buildTopologyConnections(level, visitedKeys, currentKey, toCell) {
    const connections = [];
    const knownPairs = new Set();

    for (const fromKey of visitedKeys) {
        const from = toCell(fromKey);
        if (!Number.isInteger(from.x) || !Number.isInteger(from.y)) continue;
        const edges = level?.edges?.[normalizeCoordinate(fromKey)] ?? {};

        for (const [direction, edge] of Object.entries(edges)) {
            if (edge?.type === 'move' && edge.to?.coord) {
                const toKey = normalizeCoordinate(edge.to.coord);
                const to = toCell(toKey);
                if (!Number.isInteger(to.x) || !Number.isInteger(to.y)) continue;
                const targetVisited = visitedKeys.has(toKey);
                if (targetVisited) {
                    const pairKey = [fromKey, toKey].sort().join('|');
                    if (knownPairs.has(pairKey)) continue;
                    knownPairs.add(pairKey);
                }
                connections.push({
                    from,
                    to,
                    direction,
                    targetVisited,
                    exit: false,
                    currentSource: fromKey === currentKey,
                });
                continue;
            }

            if (edge?.type === 'exit') {
                const vector = DIRECTION_VECTORS[direction];
                if (!vector) continue;
                connections.push({
                    from,
                    to: { x: from.x + vector.x, y: from.y + vector.y },
                    direction,
                    targetVisited: false,
                    exit: true,
                    currentSource: fromKey === currentKey,
                });
            }
        }
    }

    return connections;
}

function topologyCell(key, minColumnIndex, minRow) {
    const parsed = parseCoordinate(key);
    if (parsed?.kind !== 'alpha') return { x: null, y: null };
    return {
        x: columnIndex(parsed.column) - minColumnIndex,
        y: parsed.row - minRow,
    };
}
