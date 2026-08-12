import { canonicalizeRaceId } from './legacyIdentity.js';

export const RACES = Object.freeze({
    human: {
        id: 'human',
        name: 'Human',
        description: 'Adaptable people found throughout the major settlements and trade routes.',
        allowedSexes: ['male', 'female'],
        attributeBias: { str: 0, dex: 0, vit: 0, agi: 0, int: 0, mnd: 0, chr: 0 },
        resourceBias: { hp: 0, mp: 0 },
    },
    lethari: {
        id: 'lethari',
        name: 'Lethari',
        description: 'Tall, long-lived woodland and highland people with strong martial and oath traditions.',
        allowedSexes: ['male', 'female'],
        attributeBias: { str: 2, dex: -1, vit: 1, agi: -1, int: -2, mnd: 2, chr: 0 },
        resourceBias: { hp: 1, mp: -1 },
    },
    miri: {
        id: 'miri',
        name: 'Miri',
        description: 'Small-bodied people with strong traditions of scholarship, craft, and practical magic.',
        allowedSexes: ['male', 'female'],
        attributeBias: { str: -2, dex: 0, vit: -2, agi: 1, int: 3, mnd: 1, chr: 0 },
        resourceBias: { hp: -2, mp: 3 },
    },
    veyra: {
        id: 'veyra',
        name: 'Veyra',
        description: 'Agile clan-based people with deep hunting, scouting, travel, and mercantile traditions.',
        allowedSexes: ['female'],
        attributeBias: { str: 0, dex: 2, vit: -1, agi: 2, int: 0, mnd: -1, chr: 0 },
        resourceBias: { hp: 0, mp: 0 },
    },
    korren: {
        id: 'korren',
        name: 'Korren',
        description: 'Large resilient people with strong mining, masonry, engineering, and diasporic traditions.',
        allowedSexes: ['male'],
        attributeBias: { str: 1, dex: 0, vit: 3, agi: -1, int: -1, mnd: -1, chr: -1 },
        resourceBias: { hp: 3, mp: -3 },
    },
});

export const DEFAULT_RACE_ID = 'human';

export function getRace(raceId = DEFAULT_RACE_ID) {
    return RACES[canonicalizeRaceId(raceId)] ?? RACES[DEFAULT_RACE_ID];
}
