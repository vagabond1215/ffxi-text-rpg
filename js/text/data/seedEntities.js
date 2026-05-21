import { createEnemy, createNpc } from '../entities/entityFactory.js';

export function createSeedNpcs() {
    return [
        createNpc({
            id: 'npc-sandoria-gate-guard',
            name: 'San d\u2019Orian Gate Guard',
            title: 'Gate Guard',
            faction: 'San d\u2019Oria',
            locationId: 'southern-sandoria',
            services: ['signet', 'conquestRewards'],
        }),
        createNpc({
            id: 'npc-training-instructor',
            name: 'Training Instructor',
            title: 'Combat Tutor',
            locationId: 'southern-sandoria',
            services: ['tutorial', 'sparring'],
        }),
    ];
}

export function createSeedEnemies() {
    return [
        createEnemy({
            id: 'enemy-training-dummy',
            name: 'Training Dummy',
            family: 'construct',
            level: 1,
            expValue: 0,
            baseAttributes: { vit: 2, agi: -3 },
        }),
        createEnemy({
            id: 'enemy-forest-hare',
            name: 'Forest Hare',
            family: 'beast',
            ecosystem: 'beast',
            zoneId: 'west-ronfaure',
            level: 1,
            expValue: 35,
            baseAttributes: { agi: 2, vit: -1 },
            aggro: { sight: false, sound: false, magic: false, lowHp: false },
        }),
        createEnemy({
            id: 'enemy-forest-goblin',
            name: 'Forest Goblin',
            family: 'goblin',
            ecosystem: 'beastman',
            zoneId: 'west-ronfaure',
            level: 3,
            expValue: 75,
            baseAttributes: { str: 1, dex: 1 },
            aggro: { sight: true, sound: false, magic: false, lowHp: false },
        }),
        createEnemy({
            id: 'enemy-ghelsba-orc',
            name: 'Ghelsba Orc',
            family: 'orc',
            ecosystem: 'beastman',
            zoneId: 'ghelsba-outpost',
            level: 5,
            expValue: 120,
            baseAttributes: { str: 2, vit: 1 },
            aggro: { sight: true, sound: true, magic: false, lowHp: false },
        }),
    ];
}
