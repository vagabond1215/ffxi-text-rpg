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
        restrictions: [{ type: 'minLevel', value: 5, reason: 'Recommended minimum level 5.' }],
    }),
});

export const ZONE_CONNECTIONS = Object.freeze([
    connection('southern-sandoria', 'northern-sandoria', { mode: 'walk', travelSeconds: 20 }),
    connection('northern-sandoria', 'southern-sandoria', { mode: 'walk', travelSeconds: 20 }),
    connection('southern-sandoria', 'port-sandoria', { mode: 'walk', travelSeconds: 25 }),
    connection('port-sandoria', 'southern-sandoria', { mode: 'walk', travelSeconds: 25 }),
    connection('southern-sandoria', 'west-ronfaure', { mode: 'walk', travelSeconds: 45 }),
    connection('west-ronfaure', 'southern-sandoria', { mode: 'walk', travelSeconds: 45 }),
    connection('northern-sandoria', 'east-ronfaure', { mode: 'walk', travelSeconds: 45 }),
    connection('east-ronfaure', 'northern-sandoria', { mode: 'walk', travelSeconds: 45 }),
    connection('west-ronfaure', 'ghelsba-outpost', {
        mode: 'walk',
        travelSeconds: 90,
        restrictions: [{ type: 'minLevel', value: 5, reason: 'The outpost is too dangerous for a brand-new adventurer.' }],
    }),
    connection('ghelsba-outpost', 'west-ronfaure', { mode: 'walk', travelSeconds: 90 }),
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

function place(definition) {
    return Object.freeze({
        services: [],
        restrictions: [],
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
        restrictions: options.restrictions ?? [],
        flags: options.flags ?? {},
    });
}
