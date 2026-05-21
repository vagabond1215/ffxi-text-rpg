export const PLACES = Object.freeze({
    southernSandoria: place({
        id: 'southern-sandoria',
        name: 'Southern San d\u2019Oria',
        type: 'city',
        region: 'Ronfaure',
        nation: 'San d\u2019Oria',
        dangerLevel: 0,
        description: 'A fortified San d\u2019Orian city district and current rebuild starting point.',
        services: ['gateGuard', 'training', 'shops', 'homePoint'],
        coordinateSystem: grid(5, 5, { x: 2, y: 2 }),
        spawnRules: [],
        restrictions: [],
    }),
    northernSandoria: place({
        id: 'northern-sandoria',
        name: 'Northern San d\u2019Oria',
        type: 'city',
        region: 'Ronfaure',
        nation: 'San d\u2019Oria',
        dangerLevel: 0,
        description: 'The northern district of San d\u2019Oria. Seeded for early city travel.',
        services: ['shops', 'guilds'],
        coordinateSystem: grid(5, 5, { x: 2, y: 2 }),
        spawnRules: [],
        restrictions: [],
    }),
    portSandoria: place({
        id: 'port-sandoria',
        name: 'Port San d\u2019Oria',
        type: 'city',
        region: 'Ronfaure',
        nation: 'San d\u2019Oria',
        dangerLevel: 0,
        description: 'The port district of San d\u2019Oria. Future ferry and airship hooks belong here.',
        services: ['shops', 'travel'],
        coordinateSystem: grid(5, 5, { x: 2, y: 2 }),
        spawnRules: [],
        restrictions: [],
    }),
    westRonfaure: place({
        id: 'west-ronfaure',
        name: 'West Ronfaure',
        type: 'wilderness',
        region: 'Ronfaure',
        nation: 'San d\u2019Oria',
        dangerLevel: 1,
        description: 'A low-level forest zone outside San d\u2019Oria. Early enemies and travel testing live here.',
        services: [],
        coordinateSystem: grid(8, 8, { x: 4, y: 4 }),
        spawnRules: [
            spawn('enemy-forest-hare', { grids: rect(1, 1, 6, 6), count: 8, aggroTypes: [], baseChance: 0.05 }),
            spawn('enemy-forest-goblin', { grids: rect(3, 2, 6, 5), count: 3, aggroTypes: ['sight'], baseChance: 0.12 }),
        ],
        restrictions: [],
    }),
    eastRonfaure: place({
        id: 'east-ronfaure',
        name: 'East Ronfaure',
        type: 'wilderness',
        region: 'Ronfaure',
        nation: 'San d\u2019Oria',
        dangerLevel: 1,
        description: 'A low-level forest zone east of San d\u2019Oria. Seeded for graph branching tests.',
        services: [],
        coordinateSystem: grid(8, 8, { x: 4, y: 4 }),
        spawnRules: [
            spawn('enemy-forest-hare', { grids: rect(1, 1, 6, 6), count: 6, aggroTypes: [], baseChance: 0.04 }),
        ],
        restrictions: [],
    }),
    ghelsbaOutpost: place({
        id: 'ghelsba-outpost',
        name: 'Ghelsba Outpost',
        type: 'dungeon',
        region: 'Ronfaure',
        nation: null,
        dangerLevel: 5,
        description: 'A hostile outpost used as an early restricted-zone placeholder.',
        services: [],
        coordinateSystem: grid(6, 6, { x: 2, y: 5 }),
        spawnRules: [
            spawn('enemy-ghelsba-orc', { grids: rect(1, 1, 5, 5), count: 10, aggroTypes: ['sight', 'sound'], baseChance: 0.2 }),
        ],
        restrictions: [{ type: 'minLevel', value: 5, reason: 'Recommended minimum level 5.' }],
    }),
});

export const ZONE_CONNECTIONS = Object.freeze([
    connection('southern-sandoria', 'northern-sandoria', { mode: 'walk', travelSeconds: 20 }),
    connection('northern-sandoria', 'southern-sandoria', { mode: 'walk', travelSeconds: 20 }),
    connection('southern-sandoria', 'port-sandoria', { mode: 'walk', travelSeconds: 25 }),
    connection('port-sandoria', 'southern-sandoria', { mode: 'walk', travelSeconds: 25 }),
    connection('southern-sandoria', 'west-ronfaure', { mode: 'walk', travelSeconds: 45, arriveAt: { x: 4, y: 7 } }),
    connection('west-ronfaure', 'southern-sandoria', { mode: 'walk', travelSeconds: 45, arriveAt: { x: 2, y: 2 } }),
    connection('northern-sandoria', 'east-ronfaure', { mode: 'walk', travelSeconds: 45, arriveAt: { x: 4, y: 7 } }),
    connection('east-ronfaure', 'northern-sandoria', { mode: 'walk', travelSeconds: 45, arriveAt: { x: 2, y: 2 } }),
    connection('west-ronfaure', 'ghelsba-outpost', {
        mode: 'walk',
        travelSeconds: 90,
        arriveAt: { x: 2, y: 5 },
        restrictions: [{ type: 'minLevel', value: 5, reason: 'The outpost is too dangerous for a brand-new adventurer.' }],
    }),
    connection('ghelsba-outpost', 'west-ronfaure', { mode: 'walk', travelSeconds: 90, arriveAt: { x: 4, y: 1 } }),
]);

export function getPlace(placeId) {
    return Object.values(PLACES).find((place) => place.id === placeId) ?? null;
}

export function listPlaces() {
    return Object.values(PLACES);
}

export function getConnectionsFrom(placeId) {
    return ZONE_CONNECTIONS.filter((connection) => connection.from === placeId);
}

export function isCoordinateInsidePlace(place, coordinate) {
    return coordinate.x >= 0
        && coordinate.y >= 0
        && coordinate.x < place.coordinateSystem.width
        && coordinate.y < place.coordinateSystem.height;
}

function place(definition) {
    return Object.freeze({
        services: [],
        restrictions: [],
        spawnRules: [],
        flags: {},
        ...definition,
    });
}

function connection(from, to, options = {}) {
    return Object.freeze({
        id: `${from}->${to}`,
        from,
        to,
        mode: options.mode ?? 'walk',
        travelSeconds: options.travelSeconds ?? 30,
        arriveAt: options.arriveAt ?? null,
        restrictions: options.restrictions ?? [],
        flags: options.flags ?? {},
    });
}

function grid(width, height, start) {
    return Object.freeze({ width, height, start });
}

function spawn(enemyId, options) {
    return Object.freeze({
        enemyId,
        grids: options.grids,
        count: options.count ?? 1,
        aggroTypes: options.aggroTypes ?? [],
        baseChance: options.baseChance ?? 0,
    });
}

function rect(x1, y1, x2, y2) {
    const coordinates = [];
    for (let y = y1; y <= y2; y += 1) {
        for (let x = x1; x <= x2; x += 1) {
            coordinates.push(`${x},${y}`);
        }
    }
    return coordinates;
}