import { ENTITY_TYPES, CURRENCY_KEYS, EQUIPMENT_SLOTS, createZeroBlock } from '../data/systemConstants.js';
import { getRace } from '../data/races.js';
import { getJob } from '../data/jobs.js';
import { getExpToNextLevel } from '../data/expTables.js';
import { createInventoryState } from '../systems/inventoryEngine.js';
import { calculateCombatProfile } from '../systems/statEngine.js';

export function createPlayerCharacter(options = {}) {
    const race = getRace(options.raceId);
    const mainJob = getJob(options.mainJobId);
    const supportJob = options.supportJobId ? getJob(options.supportJobId) : null;
    const level = clampLevel(options.level ?? 1);
    const levelCap = options.levelCap ?? 50;
    const inventoryState = options.inventoryState ?? createInventoryState(options.inventoryOptions ?? {});

    const entity = {
        id: options.id ?? 'player-1',
        type: ENTITY_TYPES.PLAYER,
        identity: {
            name: options.name ?? 'Adventurer',
            raceId: race.id,
            raceName: race.name,
            sex: options.sex ?? race.allowedSexes[0],
            nation: options.nation ?? 'San d\u2019Oria',
            startingCity: options.startingCity ?? 'Southern San d\u2019Oria',
            title: options.title ?? 'New Adventurer',
        },
        jobs: {
            mainJobId: mainJob.id,
            mainJobName: mainJob.name,
            supportJobId: supportJob?.id ?? null,
            supportJobName: supportJob?.name ?? null,
            level,
            supportLevel: supportJob ? Math.floor(level / 2) : 0,
            unlockedJobs: ['warrior', 'monk', 'whiteMage', 'blackMage', 'redMage', 'thief'],
            jobLevels: {
                [mainJob.id]: level,
            },
            levelCap,
        },
        progression: createProgression({
            exp: options.progression?.exp ?? 0,
            expToNext: options.progression?.expToNext ?? getExpToNextLevel(level, levelCap),
            ...options.progression,
        }),
        wallet: createWallet(options.wallet),
        equipment: createEquipmentSet(options.equipment),
        inventoryState,
        inventory: inventoryState.containers.inventory.items,
        keyItems: options.keyItems ?? [],
        statuses: options.statuses ?? [],
        flags: options.flags ?? {},
    };

    entity.combat = calculateCombatProfile(entity);
    entity.resources = {
        hp: entity.combat.resources.maxHp,
        mp: entity.combat.resources.maxMp,
        tp: options.tp ?? 0,
    };

    return entity;
}

export function createNpc(options = {}) {
    return {
        id: options.id ?? `npc-${cryptoSafeId()}`,
        type: ENTITY_TYPES.NPC,
        identity: {
            name: options.name ?? 'Unnamed NPC',
            title: options.title ?? null,
            faction: options.faction ?? null,
            locationId: options.locationId ?? null,
        },
        disposition: options.disposition ?? 'neutral',
        services: options.services ?? [],
        dialogueId: options.dialogueId ?? null,
        questIds: options.questIds ?? [],
        shopId: options.shopId ?? null,
        flags: options.flags ?? {},
    };
}

export function createEnemy(options = {}) {
    const level = clampLevel(options.level ?? 1);
    const entity = {
        id: options.id ?? `enemy-${cryptoSafeId()}`,
        type: ENTITY_TYPES.ENEMY,
        identity: {
            name: options.name ?? 'Training Dummy',
            family: options.family ?? 'construct',
            ecosystem: options.ecosystem ?? 'neutral',
            zoneId: options.zoneId ?? null,
        },
        level,
        rank: options.rank ?? 'normal',
        baseAttributes: options.baseAttributes ?? {},
        skills: options.skills ?? {},
        lootTableId: options.lootTableId ?? null,
        expValue: options.expValue ?? level * 25,
        aggro: options.aggro ?? { sight: false, sound: false, magic: false, lowHp: false },
        links: options.links ?? false,
        statuses: options.statuses ?? [],
        flags: options.flags ?? {},
    };

    entity.combat = calculateCombatProfile(entity);
    entity.resources = {
        hp: entity.combat.resources.maxHp,
        mp: entity.combat.resources.maxMp,
        tp: 0,
    };

    return entity;
}

export function createWallet(overrides = {}) {
    return {
        ...createZeroBlock(CURRENCY_KEYS),
        ...overrides,
    };
}

export function createEquipmentSet(overrides = {}) {
    return {
        ...Object.fromEntries(EQUIPMENT_SLOTS.map((slot) => [slot, null])),
        ...overrides,
    };
}

export function createProgression(overrides = {}) {
    return {
        exp: 0,
        expToNext: getExpToNextLevel(1),
        nationRanks: {
            sandoria: 1,
            bastok: 1,
            windurst: 1,
        },
        fame: {},
        completedMissions: [],
        completedQuests: [],
        unlockedMaps: [],
        unlockedHomePoints: [],
        unlockedSurvivalGuides: [],
        skills: {},
        limitBreaks: [],
        merits: {},
        jobPoints: {},
        ...overrides,
    };
}

function clampLevel(value) {
    return Math.max(1, Math.min(99, Number(value) || 1));
}

function cryptoSafeId() {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    return Math.random().toString(36).slice(2, 10);
}
