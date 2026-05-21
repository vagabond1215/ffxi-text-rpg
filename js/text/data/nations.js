export const NATIONS = Object.freeze({
    sandoria: nation({
        id: 'sandoria',
        name: 'San d\u2019Oria',
        aliases: ['san-doria', 'sandoria', 'sandy', 'san'],
        startingPlaceId: 'southern-sandoria',
        startingMapIds: ['map-san-doria', 'map-ronfaure'],
        startingKeyItems: ['map-san-doria', 'map-ronfaure'],
        description: 'A proud northern kingdom with immediate access to the Ronfaure starter region.',
    }),
    bastok: nation({
        id: 'bastok',
        name: 'Bastok',
        aliases: ['bastok', 'basty'],
        startingPlaceId: 'bastok-markets',
        startingMapIds: ['map-bastok', 'map-gustaberg'],
        startingKeyItems: ['map-bastok', 'map-gustaberg'],
        description: 'An industrial republic with immediate access to the Gustaberg starter region.',
    }),
    windurst: nation({
        id: 'windurst',
        name: 'Windurst',
        aliases: ['windurst', 'windy'],
        startingPlaceId: 'windurst-waters',
        startingMapIds: ['map-windurst', 'map-sarutabaruta'],
        startingKeyItems: ['map-windurst', 'map-sarutabaruta'],
        description: 'A magical federation with immediate access to the Sarutabaruta starter region.',
    }),
});

export const DEFAULT_NATION_ID = 'sandoria';

export function getNation(nationId = DEFAULT_NATION_ID) {
    return NATIONS[normalizeNationId(nationId)] ?? NATIONS[DEFAULT_NATION_ID];
}

export function findNation(query = DEFAULT_NATION_ID) {
    const normalized = normalizeNationId(query);
    return Object.values(NATIONS).find((nation) => nation.id === normalized || nation.aliases.includes(normalized) || normalizeNationId(nation.name) === normalized) ?? null;
}

export function listNations() {
    return Object.values(NATIONS);
}

export function describeNations() {
    return listNations()
        .map((nation) => `${nation.id} - ${nation.name}: starts in ${nation.startingPlaceId}`)
        .join('\n');
}

function nation(definition) {
    return Object.freeze(definition);
}

function normalizeNationId(value) {
    return String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/[’']/g, '')
        .replace(/\s+/g, '-')
        .replace(/^san-doria$/, 'sandoria');
}
