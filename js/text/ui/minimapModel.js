import {
    columnIndex,
    coordinateKey,
    getLevel,
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
    const toCell = topologyCell;
    const cells = [...visitedKeys]
        .map((key) => ({ ...toCell(key), current: key === currentKey }))
        .filter((cell) => Number.isInteger(cell.x) && Number.isInteger(cell.y));
    const level = getLevel(place, state?.position?.levelId ?? 'main');
    const connections = buildTopologyConnections(level, visitedKeys, currentKey, toCell);
    const visible = fitVisibleGeometry(cells, connections);

    return Object.freeze({
        placeId: place.id,
        placeName: place.name,
        mode: 'topology',
        width: visible.width,
        height: visible.height,
        currentKey: 'current-area',
        currentLabel: 'Current area',
        exploredCount: visitedKeys.size,
        totalCount: '?',
        cells: Object.freeze(visible.cells.map((cell) => Object.freeze(cell))),
        connections: Object.freeze(visible.connections.map((connection) => Object.freeze(connection))),
    });
}

function createGridModel(state, place, currentKey, visitedKeys) {
    const cells = [...visitedKeys]
        .map((key) => {
            const parsed = parseCoordinate(key);
            return parsed?.kind === 'numeric'
                ? { x: parsed.x, y: parsed.y, current: key === currentKey }
                : null;
        })
        .filter(Boolean);
    const visible = fitVisibleGeometry(cells, []);

    return Object.freeze({
        placeId: place.id,
        placeName: place.name,
        mode: 'grid',
        width: visible.width,
        height: visible.height,
        currentKey: 'current-area',
        currentLabel: 'Current area',
        exploredCount: visitedKeys.size,
        totalCount: '?',
        cells: Object.freeze(visible.cells.map((cell) => Object.freeze(cell))),
        connections: Object.freeze([]),
    });
}

function fitVisibleGeometry(cells, connections) {
    const points = [
        ...cells,
        ...connections.flatMap((connection) => [connection.from, connection.to]),
    ].filter((point) => Number.isInteger(point?.x) && Number.isInteger(point?.y));
    if (!points.length) return { width: 1, height: 1, cells: [], connections: [] };

    const minX = Math.min(...points.map((point) => point.x));
    const maxX = Math.max(...points.map((point) => point.x));
    const minY = Math.min(...points.map((point) => point.y));
    const maxY = Math.max(...points.map((point) => point.y));
    const translate = (point) => ({ x: point.x - minX, y: point.y - minY });

    return {
        width: Math.max(1, maxX - minX + 1),
        height: Math.max(1, maxY - minY + 1),
        cells: cells.map((cell, index) => ({
            ...cell,
            ...translate(cell),
            key: cell.current ? 'Current area' : `Known area ${index + 1}`,
        })),
        connections: connections.map((connection) => ({
            ...connection,
            from: translate(connection.from),
            to: translate(connection.to),
        })),
    };
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

function topologyCell(key) {
    const parsed = parseCoordinate(key);
    if (parsed?.kind !== 'alpha') return { x: null, y: null };
    return {
        x: columnIndex(parsed.column),
        y: parsed.row,
    };
}
