import { canonicalizeNationId } from './legacyIdentity.js';

export const NATIONS = Object.freeze({
    thornwall: nation({
        id: 'thornwall',
        name: 'Thornwall',
        aliases: ['thornwall', 'thorn', 'western-crown'],
        startingPlaceId: 'thornwall-southgate',
        startingMapIds: ['map-thornwall', 'map-elderwood'],
        startingKeyItems: ['map-thornwall', 'map-elderwood'],
        startingEquipmentIds: ['field-knife'],
        description: 'An old forest crown city shaped by timber, hunting, stone keeps, guild craft, court politics, and oath-bound service.',
    }),
    brasshaven: nation({
        id: 'brasshaven',
        name: 'Brasshaven',
        aliases: ['brasshaven', 'brass', 'forge-republic'],
        startingPlaceId: 'brasshaven-market-ring',
        startingMapIds: ['map-brasshaven', 'map-redstone-reach'],
        startingKeyItems: ['map-brasshaven', 'map-redstone-reach'],
        startingEquipmentIds: ['prospector-pick'],
        description: 'A mercantile-industrial republic built around mines, foundries, engineering, labor, and civic competition.',
    }),
    mistmere: nation({
        id: 'mistmere',
        name: 'Mistmere',
        aliases: ['mistmere', 'mist', 'canal-city'],
        startingPlaceId: 'mistmere-canal-ward',
        startingMapIds: ['map-mistmere', 'map-starfen'],
        startingKeyItems: ['map-mistmere', 'map-starfen'],
        startingEquipmentIds: ['reed-sickle'],
        description: 'A wetland city of colleges, gardens, observatories, canals, herbalists, practical magic, and civic scholarship.',
    }),
});

export const DEFAULT_NATION_ID = 'thornwall';

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
    return Object.freeze({
        startingEquipmentIds: [],
        ...definition,
        startingEquipmentIds: Object.freeze([...(definition.startingEquipmentIds ?? [])]),
    });
}

function normalizeNationId(value) {
    const normalized = String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/[’']/g, '')
        .replace(/\s+/g, '-');
    return canonicalizeNationId(normalized);
}
