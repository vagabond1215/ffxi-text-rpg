export const RACES = Object.freeze({
    hume: {
        id: 'hume',
        name: 'Hume',
        description: 'Balanced baseline race for early system tuning.',
        allowedSexes: ['male', 'female'],
        attributeBias: { str: 0, dex: 0, vit: 0, agi: 0, int: 0, mnd: 0, chr: 0 },
        resourceBias: { hp: 0, mp: 0 },
    },
    elvaan: {
        id: 'elvaan',
        name: 'Elvaan',
        description: 'High physical presence with weaker agility and intelligence.',
        allowedSexes: ['male', 'female'],
        attributeBias: { str: 2, dex: -1, vit: 1, agi: -1, int: -2, mnd: 2, chr: 0 },
        resourceBias: { hp: 1, mp: -1 },
    },
    tarutaru: {
        id: 'tarutaru',
        name: 'Tarutaru',
        description: 'Exceptional magical capacity with low physical durability.',
        allowedSexes: ['male', 'female'],
        attributeBias: { str: -2, dex: 0, vit: -2, agi: 1, int: 3, mnd: 1, chr: 0 },
        resourceBias: { hp: -2, mp: 3 },
    },
    mithra: {
        id: 'mithra',
        name: 'Mithra',
        description: 'Agile and accurate physical race with modest magical bias.',
        allowedSexes: ['female'],
        attributeBias: { str: 0, dex: 2, vit: -1, agi: 2, int: 0, mnd: -1, chr: 0 },
        resourceBias: { hp: 0, mp: 0 },
    },
    galka: {
        id: 'galka',
        name: 'Galka',
        description: 'Very durable physical race with weak MP growth.',
        allowedSexes: ['male'],
        attributeBias: { str: 1, dex: 0, vit: 3, agi: -1, int: -1, mnd: -1, chr: -1 },
        resourceBias: { hp: 3, mp: -3 },
    },
});

export const DEFAULT_RACE_ID = 'hume';

export function getRace(raceId = DEFAULT_RACE_ID) {
    return RACES[raceId] ?? RACES[DEFAULT_RACE_ID];
}
