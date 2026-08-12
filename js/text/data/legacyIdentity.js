// Compatibility boundary for pre-original-world saves, commands, and historical
// research tables. Canonical runtime data must use the values on the right.
// Do not add new gameplay content under the legacy identifiers on the left.

export const LEGACY_NATION_IDS = Object.freeze({
    sandoria: 'thornwall',
    bastok: 'brasshaven',
    windurst: 'mistmere',
});

export const LEGACY_RACE_IDS = Object.freeze({
    hume: 'human',
    elvaan: 'lethari',
    tarutaru: 'miri',
    mithra: 'veyra',
    galka: 'korren',
});

export const LEGACY_DISCIPLINE_IDS = Object.freeze({
    warrior: 'vanguard',
    monk: 'pugilist',
    whiteMage: 'lifewarden',
    blackMage: 'elementalist',
    redMage: 'spellblade',
    thief: 'shadowhand',
    paladin: 'oathguard',
    darkKnight: 'duskblade',
    beastmaster: 'wildbinder',
    bard: 'cantor',
    ranger: 'wayfinder',
    samurai: 'bladeAdept',
    ninja: 'veilrunner',
    dragoon: 'skyLancer',
    summoner: 'eidolist',
    blueMage: 'echoSage',
    corsair: 'freeCaptain',
    puppetmaster: 'artificer',
    dancer: 'rhythmblade',
    scholar: 'savant',
    geomancer: 'leykeeper',
    runeFencer: 'wardsword',
});

export const LEGACY_PLACE_IDS = Object.freeze({
    'southern-sandoria': 'thornwall-southgate',
    'northern-sandoria': 'thornwall-crownward',
    'port-sandoria': 'thornwall-rivergate',
    'chateau-doraguille': 'thornwall-high-citadel',
    'chocobo-circuit': 'thornwall-strider-yard',
    'carpenters-landing': 'timbercross-landing',
    'bostaunieux-oubliette': 'thornwall-old-gaol',
    'airship-jeuno-sandoria': 'skyferry-waymeet-thornwall',
    'west-ronfaure': 'west-elderwood',
    'east-ronfaure': 'east-elderwood',
    'ghelsba-outpost': 'redfang-camp',

    'bastok-markets': 'brasshaven-market-ring',
    'bastok-mines': 'brasshaven-delvers-ward',
    'port-bastok': 'brasshaven-iron-quay',
    metalworks: 'brasshaven-foundry-hall',
    'south-gustaberg': 'south-redstone-reach',
    'north-gustaberg': 'north-redstone-reach',
    'zeruhn-mines': 'deepvein-mine',

    'windurst-waters': 'mistmere-canal-ward',
    'windurst-walls': 'mistmere-spire-ward',
    'windurst-woods': 'mistmere-garden-ward',
    'port-windurst': 'mistmere-reedport',
    'heavens-tower': 'mistmere-observatory',
    'west-sarutabaruta': 'west-starfen',
    'east-sarutabaruta': 'east-starfen',
    'outer-horutoto-ruins': 'sunken-archive',
});

export const LEGACY_MAP_IDS = Object.freeze({
    'map-san-doria': 'map-thornwall',
    'map-ronfaure': 'map-elderwood',
    'map-ghelsba': 'map-redfang-camp',
    'map-bastok': 'map-brasshaven',
    'map-gustaberg': 'map-redstone-reach',
    'map-zeruhn-mines': 'map-deepvein-mine',
    'map-windurst': 'map-mistmere',
    'map-sarutabaruta': 'map-starfen',
    'map-horutoto-ruins': 'map-sunken-archive',
});

export const LEGACY_ENEMY_IDS = Object.freeze({
    'enemy-forest-hare': 'enemy-brush-hare',
    'enemy-forest-goblin': 'enemy-mossback-goblin',
    'enemy-ghelsba-orc': 'enemy-redfang-raider',
    'enemy-gustaberg-worm': 'enemy-redstone-burrower',
    'enemy-gustaberg-goblin': 'enemy-ashcap-scavenger',
    'enemy-mine-bat': 'enemy-sootwing-bat',
    'enemy-sarutabaruta-mandragora': 'enemy-starfen-rootling',
    'enemy-yagudo-initiate': 'enemy-reedmask-acolyte',
    'enemy-ruin-bat': 'enemy-vaultwing-bat',
});

const LEGACY_RACE_RESEARCH_IDS = reverse(LEGACY_RACE_IDS);
const LEGACY_DISCIPLINE_RESEARCH_IDS = reverse(LEGACY_DISCIPLINE_IDS);

export function canonicalizeNationId(value) {
    return canonicalize(value, LEGACY_NATION_IDS);
}

export function canonicalizeRaceId(value) {
    return canonicalize(value, LEGACY_RACE_IDS);
}

export function canonicalizeDisciplineId(value) {
    return canonicalize(value, LEGACY_DISCIPLINE_IDS);
}

export function canonicalizePlaceId(value) {
    return canonicalize(value, LEGACY_PLACE_IDS);
}

export function canonicalizeMapId(value) {
    return canonicalize(value, LEGACY_MAP_IDS);
}

export function canonicalizeEnemyId(value) {
    return canonicalize(value, LEGACY_ENEMY_IDS);
}

export function toLegacyRaceResearchId(canonicalRaceId) {
    return LEGACY_RACE_RESEARCH_IDS[canonicalRaceId] ?? canonicalRaceId;
}

export function toLegacyDisciplineResearchId(canonicalDisciplineId) {
    return LEGACY_DISCIPLINE_RESEARCH_IDS[canonicalDisciplineId] ?? canonicalDisciplineId;
}

export function migrateIdArray(values, canonicalizer) {
    if (!Array.isArray(values)) return [];
    return values.map((value) => canonicalizer(value));
}

export function migrateObjectKeys(record, canonicalizer) {
    if (!record || typeof record !== 'object' || Array.isArray(record)) return {};
    return Object.fromEntries(Object.entries(record).map(([key, value]) => [canonicalizer(key), value]));
}

function canonicalize(value, mapping) {
    if (value === null || value === undefined) return value;
    const text = String(value);
    return mapping[text] ?? text;
}

function reverse(mapping) {
    return Object.freeze(Object.fromEntries(Object.entries(mapping).map(([legacy, canonical]) => [canonical, legacy])));
}
