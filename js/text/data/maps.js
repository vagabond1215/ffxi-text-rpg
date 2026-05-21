export const MAP_DEFINITIONS = Object.freeze({
    mapSanDoria: map({
        id: 'map-san-doria',
        name: 'Map of San d\u2019Oria',
        nation: 'San d\u2019Oria',
        region: 'Ronfaure',
        placeIds: ['southern-sandoria', 'northern-sandoria', 'port-sandoria', 'chateau-doraguille'],
        notes: 'Starter city map covering the seeded San d\u2019Orian city districts.',
    }),
    mapRonfaure: map({
        id: 'map-ronfaure',
        name: 'Map of Ronfaure',
        nation: 'San d\u2019Oria',
        region: 'Ronfaure',
        placeIds: ['west-ronfaure', 'east-ronfaure'],
        notes: 'Starter outdoor region map for the Ronfaure forest zones.',
    }),
    mapGhelsba: map({
        id: 'map-ghelsba',
        name: 'Map of Ghelsba',
        nation: null,
        region: 'Ronfaure',
        placeIds: ['ghelsba-outpost'],
        notes: 'Starter dungeon hook map for Ghelsba Outpost.',
    }),
    mapBastok: map({
        id: 'map-bastok',
        name: 'Map of Bastok',
        nation: 'Bastok',
        region: 'Gustaberg',
        placeIds: ['bastok-markets', 'bastok-mines', 'port-bastok', 'metalworks'],
        notes: 'Starter city map covering the seeded Bastok city districts.',
    }),
    mapGustaberg: map({
        id: 'map-gustaberg',
        name: 'Map of Gustaberg',
        nation: 'Bastok',
        region: 'Gustaberg',
        placeIds: ['south-gustaberg', 'north-gustaberg'],
        notes: 'Starter outdoor region map for Gustaberg.',
    }),
    mapZeruhnMines: map({
        id: 'map-zeruhn-mines',
        name: 'Map of Zeruhn Mines',
        nation: 'Bastok',
        region: 'Gustaberg',
        placeIds: ['zeruhn-mines'],
        notes: 'Starter-adjacent mine map for Bastok.',
    }),
    mapWindurst: map({
        id: 'map-windurst',
        name: 'Map of Windurst',
        nation: 'Windurst',
        region: 'Sarutabaruta',
        placeIds: ['windurst-waters', 'windurst-walls', 'windurst-woods', 'port-windurst', 'heavens-tower'],
        notes: 'Starter city map covering the seeded Windurst districts.',
    }),
    mapSarutabaruta: map({
        id: 'map-sarutabaruta',
        name: 'Map of Sarutabaruta',
        nation: 'Windurst',
        region: 'Sarutabaruta',
        placeIds: ['west-sarutabaruta', 'east-sarutabaruta'],
        notes: 'Starter outdoor region map for Sarutabaruta.',
    }),
    mapHorutotoRuins: map({
        id: 'map-horutoto-ruins',
        name: 'Map of Horutoto Ruins',
        nation: 'Windurst',
        region: 'Sarutabaruta',
        placeIds: ['outer-horutoto-ruins'],
        notes: 'Starter-adjacent ruin map for Windurst.',
    }),
});

export function getMap(mapId) {
    return Object.values(MAP_DEFINITIONS).find((item) => item.id === mapId) ?? null;
}

export function listMaps() {
    return Object.values(MAP_DEFINITIONS);
}

export function describeMaps() {
    return listMaps()
        .map((item) => `${item.id} - ${item.name} [${item.region}] places=${item.placeIds.length}`)
        .join('\n');
}

export function describeMap(mapId) {
    const item = getMap(mapId);
    if (!item) return `Unknown map: ${mapId}`;

    return [
        item.name,
        `Region: ${item.region}`,
        `Nation: ${item.nation ?? 'none'}`,
        item.notes,
        '',
        'Places:',
        ...item.placeIds.map((placeId) => `- ${placeId}`),
    ].join('\n');
}

function map(definition) {
    return Object.freeze({
        nation: null,
        notes: '',
        ...definition,
    });
}
