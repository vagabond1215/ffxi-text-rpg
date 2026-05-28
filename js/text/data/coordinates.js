export const DIRECTION_ORDER = Object.freeze(['northwest', 'north', 'northeast', 'west', 'east', 'southwest', 'south', 'southeast']);

export const DIRECTION_ALIASES = Object.freeze({
    n: 'north',
    north: 'north',
    ne: 'northeast',
    northeast: 'northeast',
    e: 'east',
    east: 'east',
    se: 'southeast',
    southeast: 'southeast',
    s: 'south',
    south: 'south',
    sw: 'southwest',
    southwest: 'southwest',
    w: 'west',
    west: 'west',
    nw: 'northwest',
    northwest: 'northwest',
});

export const DIRECTION_DELTAS = Object.freeze({
    northwest: Object.freeze({ column: -1, row: -1, diagonal: true }),
    north: Object.freeze({ column: 0, row: -1, diagonal: false }),
    northeast: Object.freeze({ column: 1, row: -1, diagonal: true }),
    west: Object.freeze({ column: -1, row: 0, diagonal: false }),
    east: Object.freeze({ column: 1, row: 0, diagonal: false }),
    southwest: Object.freeze({ column: -1, row: 1, diagonal: true }),
    south: Object.freeze({ column: 0, row: 1, diagonal: false }),
    southeast: Object.freeze({ column: 1, row: 1, diagonal: true }),
});

export const DIRECTION_ARROWS = Object.freeze({
    northwest: '↖',
    north: '↑',
    northeast: '↗',
    west: '←',
    east: '→',
    southwest: '↙',
    south: '↓',
    southeast: '↘',
});

export function normalizeDirection(value) {
    return DIRECTION_ALIASES[String(value ?? '').trim().toLowerCase()] ?? null;
}

export function normalizeCoordinate(value) {
    const parsed = parseCoordinate(value);
    if (!parsed) return null;
    if (parsed.kind === 'alpha') return `${parsed.column}-${parsed.row}`;
    return `${parsed.x},${parsed.y}`;
}

export function parseCoordinate(value) {
    if (typeof value === 'string') {
        const match = value.trim().match(/^([A-Z]+)\s*-?\s*(\d+)$/i);
        if (!match) return null;
        return { kind: 'alpha', column: match[1].toUpperCase(), row: Number.parseInt(match[2], 10) };
    }
    if (value && typeof value === 'object') {
        if (value.coord) return parseCoordinate(value.coord);
        if (Number.isInteger(value.x) && Number.isInteger(value.y)) return { kind: 'numeric', x: value.x, y: value.y };
    }
    return null;
}

export function coordinateKey(value) {
    if (Number.isInteger(value?.x) && Number.isInteger(value?.y)) return `${value.x},${value.y}`;
    return normalizeCoordinate(value) ?? 'unknown';
}

export function describeCoordinate(value) {
    if (value?.coord) return normalizeCoordinate(value) ?? String(value.coord);
    const parsed = parseCoordinate(value);
    if (!parsed) return 'unknown';
    return parsed.kind === 'alpha' ? `${parsed.column}-${parsed.row}` : `(${parsed.x}, ${parsed.y})`;
}

export function getLevel(place, levelId = 'main') {
    const levels = place?.coordinateSystem?.levels ?? [];
    return levels.find((level) => level.id === (levelId ?? 'main')) ?? levels[0] ?? null;
}

export function isTopologyCoordinateSystem(coordinateSystem) {
    return coordinateSystem?.type === 'topology';
}

export function isTopologyPlace(place) {
    return isTopologyCoordinateSystem(place?.coordinateSystem);
}

export function isCoordinateWithinBounds(place, coord) {
    const system = place?.coordinateSystem;
    if (!system) return false;
    if (isTopologyCoordinateSystem(system)) {
        const parsed = parseCoordinate(coord);
        if (!parsed || parsed.kind !== 'alpha') return false;
        return columnIndex(parsed.column) >= columnIndex(system.bounds.minColumn)
            && columnIndex(parsed.column) <= columnIndex(system.bounds.maxColumn)
            && parsed.row >= system.bounds.minRow
            && parsed.row <= system.bounds.maxRow;
    }
    const parsed = parseCoordinate(coord);
    if (parsed?.kind === 'numeric') {
        return parsed.x >= 0
            && parsed.y >= 0
            && parsed.x < system.width
            && parsed.y < system.height;
    }
    const key = normalizeCoordinate(coord);
    return Boolean(key && resolveExternalCoordinate(system, key));
}

export function isNavigableCoordinate(place, coord, levelId = 'main') {
    if (!isTopologyPlace(place)) return isCoordinateWithinBounds(place, coord);
    const key = normalizeCoordinate(coord);
    const level = getLevel(place, levelId);
    return Boolean(key && level?.navigable?.includes(key));
}

export function getNavigableCoordinateKeys(place, levelId = 'main') {
    if (isTopologyPlace(place)) return [...(getLevel(place, levelId)?.navigable ?? [])];
    const keys = [];
    const width = Number(place?.coordinateSystem?.width) || 0;
    const height = Number(place?.coordinateSystem?.height) || 0;
    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) keys.push(`${x},${y}`);
    }
    return keys;
}

export function normalizePositionForPlace(place, coordinate, fallbackFacing = 'north') {
    const system = place?.coordinateSystem;
    const levelId = coordinate?.levelId ?? system?.start?.levelId ?? 'main';
    if (isTopologyCoordinateSystem(system)) {
        return {
            placeId: place.id,
            levelId,
            coord: normalizeCoordinate(coordinate) ?? normalizeCoordinate(system.start),
            facing: coordinate?.facing ?? fallbackFacing,
        };
    }
    const parsed = parseCoordinate(coordinate ?? system?.start);
    if (parsed?.kind === 'numeric') return { placeId: place.id, x: parsed.x, y: parsed.y };
    if (parsed?.kind === 'alpha') {
        const key = normalizeCoordinate(coordinate);
        const external = resolveExternalCoordinate(system, key);
        if (external && Number.isInteger(external.x) && Number.isInteger(external.y)) {
            return {
                placeId: place.id,
                x: external.x,
                y: external.y,
                coord: key,
                levelId,
                facing: coordinate?.facing ?? fallbackFacing,
            };
        }
    }
    return {
        placeId: place.id,
        levelId,
        coord: normalizeCoordinate(coordinate) ?? normalizeCoordinate(system?.start),
        facing: coordinate?.facing ?? fallbackFacing,
    };
}

export function columnIndex(column) {
    const text = String(column ?? '').toUpperCase();
    let value = 0;
    for (const char of text) value = value * 26 + (char.charCodeAt(0) - 64);
    return value;
}

export function resolveExternalCoordinate(coordinateSystem, coord) {
    const key = normalizeCoordinate(coord);
    if (!key) return null;
    for (const entry of coordinateSystem?.externalCoordinates ?? []) {
        if (typeof entry === 'string' && normalizeCoordinate(entry) === key) return { coord: key };
        if (entry && typeof entry === 'object' && normalizeCoordinate(entry.coord) === key) {
            return { coord: key, x: entry.x, y: entry.y };
        }
    }
    return null;
}
