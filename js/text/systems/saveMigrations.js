import { getJob } from '../data/jobs.js';
import {
    LEGACY_ENEMY_IDS,
    canonicalizeDisciplineId,
    canonicalizeEnemyId,
    canonicalizeMapId,
    canonicalizeNationId,
    canonicalizePlaceId,
    canonicalizeRaceId,
    migrateIdArray,
    migrateObjectKeys,
} from '../data/legacyIdentity.js';
import { getPlace } from '../data/places.js';
import { getRace } from '../data/races.js';
import { createSeedEnemies, createSeedNpcs } from '../data/seedEntities.js';
import { VERSION } from '../version.js';
import { createInventoryState } from './inventoryEngine.js';
import { migrateVersionedValue } from './migrationEngine.js';
import { CURRENT_SAVE_VERSION } from './validation.js';
import { createWorldTimeState } from './worldTimeEngine.js';

function migrateGameState2To3(state) {
    const next = { ...state, version: 3 };
    next.meta = { ...(state.meta ?? {}) };
    next.atlas = state.atlas && typeof state.atlas === 'object' ? state.atlas : {};
    next.discoveredPois = state.discoveredPois && typeof state.discoveredPois === 'object' ? state.discoveredPois : {};
    next.travel = state.travel ?? null;
    next.flags = state.flags && typeof state.flags === 'object' ? state.flags : {};
    next.log = Array.isArray(state.log) ? state.log : [];

    if (state.player && typeof state.player === 'object') {
        const player = { ...state.player };
        const defaults = createInventoryState();
        const existingInventory = Array.isArray(state.player.inventory) ? state.player.inventory : [];
        const existingStructuredItems = state.player.inventoryState?.containers?.inventory?.items;
        const inventoryState = state.player.inventoryState && typeof state.player.inventoryState === 'object'
            ? { ...state.player.inventoryState }
            : defaults;

        inventoryState.containers = inventoryState.containers && typeof inventoryState.containers === 'object'
            ? { ...inventoryState.containers }
            : defaults.containers;
        inventoryState.mogHouse = inventoryState.mogHouse && typeof inventoryState.mogHouse === 'object'
            ? { ...inventoryState.mogHouse }
            : defaults.mogHouse;

        const inventoryContainer = inventoryState.containers.inventory && typeof inventoryState.containers.inventory === 'object'
            ? { ...inventoryState.containers.inventory }
            : { ...defaults.containers.inventory };
        inventoryContainer.items = Array.isArray(existingStructuredItems)
            ? existingStructuredItems
            : existingInventory;
        inventoryState.containers.inventory = inventoryContainer;
        player.inventoryState = inventoryState;
        player.progression = player.progression && typeof player.progression === 'object'
            ? { ...player.progression }
            : {};
        player.progression.skills = player.progression.skills && typeof player.progression.skills === 'object'
            ? { ...player.progression.skills }
            : {};
        next.player = player;
    }

    return next;
}

function migrateGameState3To4(state) {
    return {
        ...state,
        version: 4,
        worldTime: createWorldTimeState({
            totalSeconds: Number.isInteger(state.worldTime?.totalSeconds) && state.worldTime.totalSeconds >= 0
                ? state.worldTime.totalSeconds
                : 0,
        }),
    };
}

function migrateGameState4To5(state) {
    const currentPlaceId = canonicalizePlaceId(state.currentPlaceId ?? 'southern-sandoria');
    const currentPlace = getPlace(currentPlaceId);
    const next = {
        ...state,
        version: 5,
        currentPlaceId,
        location: currentPlace?.name ?? state.location,
        position: migratePosition(state.position, currentPlaceId),
        atlas: migratePlaceKeyedRecord(state.atlas, migrateAtlasEntry),
        discoveredPois: migratePlaceKeyedRecord(state.discoveredPois),
        travel: migrateTravel(state.travel),
        npcs: createSeedNpcs(),
        enemies: createSeedEnemies(),
        activeBattle: null,
    };

    if (state.player && typeof state.player === 'object') {
        next.player = migratePlayerIdentity(state.player, currentPlaceId);
        next.inventory = next.player.inventoryState?.containers?.inventory?.items ?? next.player.inventory ?? [];
    }

    next.flags = {
        ...(state.flags ?? {}),
        originalWorldIdentityMigrated: true,
        activeBattleClearedByIdentityMigration: Boolean(state.activeBattle),
    };

    return next;
}

const GAME_STATE_MIGRATIONS = Object.freeze([
    Object.freeze({
        id: 'game-state-2-to-3-inventory-and-progression',
        from: 2,
        to: 3,
        migrate: migrateGameState2To3,
    }),
    Object.freeze({
        id: 'game-state-3-to-4-world-time',
        from: 3,
        to: 4,
        migrate: migrateGameState3To4,
    }),
    Object.freeze({
        id: 'game-state-4-to-5-original-world-identities',
        from: 4,
        to: 5,
        migrate: migrateGameState4To5,
    }),
]);

function migrateAccountRegistry2To3(registry) {
    return {
        ...registry,
        version: 3,
        encoding: registry.encoding ?? 'base64-json-v1',
        accounts: Array.isArray(registry.accounts)
            ? registry.accounts.map((account) => ({ ...account, version: 3, encoding: account.encoding ?? registry.encoding ?? 'base64-json-v1' }))
            : [],
    };
}

function migrateAccountRegistry3To4(registry) {
    return {
        ...registry,
        version: 4,
        encoding: registry.encoding ?? 'base64-json-v1',
        accounts: Array.isArray(registry.accounts)
            ? registry.accounts.map((account) => ({ ...account, version: 4, encoding: account.encoding ?? registry.encoding ?? 'base64-json-v1' }))
            : [],
    };
}

const ACCOUNT_REGISTRY_MIGRATIONS = Object.freeze([
    Object.freeze({
        id: 'account-registry-2-to-3-version-contract',
        from: 2,
        to: 3,
        migrate: migrateAccountRegistry2To3,
    }),
    Object.freeze({
        id: 'account-registry-3-to-4-version-contract',
        from: 3,
        to: 4,
        migrate: migrateAccountRegistry3To4,
    }),
]);

export function migrateGameStatePayload(state) {
    return migrateVersionedValue(state, {
        currentVersion: CURRENT_SAVE_VERSION,
        migrations: GAME_STATE_MIGRATIONS,
        label: 'game state',
    });
}

export function migrateAccountRegistryPayload(registry) {
    return migrateVersionedValue(registry, {
        currentVersion: VERSION.accountSave,
        migrations: ACCOUNT_REGISTRY_MIGRATIONS,
        label: 'account registry',
    });
}

export function describeSaveMigrationSupport() {
    return {
        gameState: {
            currentVersion: CURRENT_SAVE_VERSION,
            supportedFrom: GAME_STATE_MIGRATIONS.length ? Math.min(...GAME_STATE_MIGRATIONS.map((migration) => migration.from)) : CURRENT_SAVE_VERSION,
            migrations: GAME_STATE_MIGRATIONS.map(({ id, from, to }) => ({ id, from, to })),
        },
        accountSave: {
            currentVersion: VERSION.accountSave,
            supportedFrom: ACCOUNT_REGISTRY_MIGRATIONS.length ? Math.min(...ACCOUNT_REGISTRY_MIGRATIONS.map((migration) => migration.from)) : VERSION.accountSave,
            migrations: ACCOUNT_REGISTRY_MIGRATIONS.map(({ id, from, to }) => ({ id, from, to })),
        },
    };
}

function migratePlayerIdentity(player, currentPlaceId) {
    const raceId = canonicalizeRaceId(player.identity?.raceId ?? 'hume');
    const race = getRace(raceId);
    const mainJobId = canonicalizeDisciplineId(player.jobs?.mainJobId ?? 'warrior');
    const mainJob = getJob(mainJobId);
    const supportJobId = player.jobs?.supportJobId ? canonicalizeDisciplineId(player.jobs.supportJobId) : null;
    const supportJob = supportJobId ? getJob(supportJobId) : null;
    const nationId = normalizeNationReference(player.identity?.nation);
    const nationName = nationDisplayName(nationId);
    const startingPlaceId = canonicalizePlaceId(placeIdFromLegacyDisplay(player.identity?.startingCity) ?? currentPlaceId);
    const startingPlaceName = getPlace(startingPlaceId)?.name ?? getPlace(currentPlaceId)?.name ?? player.identity?.startingCity;
    const jobs = {
        ...(player.jobs ?? {}),
        mainJobId,
        mainJobName: mainJob.name,
        supportJobId,
        supportJobName: supportJob?.name ?? null,
        unlockedJobs: migrateIdArray(player.jobs?.unlockedJobs ?? [], canonicalizeDisciplineId),
        jobLevels: migrateObjectKeys(player.jobs?.jobLevels ?? {}, canonicalizeDisciplineId),
    };
    jobs.jobLevels[mainJobId] ??= jobs.level ?? 1;
    if (!jobs.unlockedJobs.includes(mainJobId)) jobs.unlockedJobs.push(mainJobId);

    const progression = {
        ...(player.progression ?? {}),
        nationRanks: migrateObjectKeys(player.progression?.nationRanks ?? {}, normalizeNationReference),
        unlockedMaps: migrateIdArray(player.progression?.unlockedMaps ?? [], canonicalizeMapId),
        unlockedHomePoints: migrateIdArray(player.progression?.unlockedHomePoints ?? [], canonicalizePlaceId),
    };

    const inventoryState = migrateInventoryState(player.inventoryState);
    const equipment = Object.fromEntries(Object.entries(player.equipment ?? {}).map(([slot, item]) => [slot, migrateItem(item)]));
    const keyItems = Array.isArray(player.keyItems)
        ? player.keyItems.map((item) => typeof item === 'string' ? canonicalizeMapId(item) : migrateItem(item))
        : [];

    return {
        ...player,
        identity: {
            ...(player.identity ?? {}),
            raceId,
            raceName: race.name,
            nation: nationName,
            startingCity: startingPlaceName,
            title: player.identity?.title === 'New Adventurer' ? 'Newcomer' : player.identity?.title,
        },
        jobs,
        progression,
        inventoryState,
        inventory: inventoryState.containers.inventory.items,
        equipment,
        keyItems,
    };
}

function migrateInventoryState(inventoryState) {
    const defaults = createInventoryState();
    if (!inventoryState || typeof inventoryState !== 'object') return defaults;
    const next = {
        ...inventoryState,
        containers: { ...(inventoryState.containers ?? {}) },
        mogHouse: { ...(inventoryState.mogHouse ?? defaults.mogHouse) },
    };
    for (const [containerId, container] of Object.entries(next.containers)) {
        next.containers[containerId] = {
            ...container,
            items: Array.isArray(container?.items) ? container.items.map(migrateItem) : [],
        };
    }
    if (!next.containers.inventory) next.containers.inventory = defaults.containers.inventory;
    return next;
}

function migrateItem(item) {
    if (!item || typeof item !== 'object') return item;
    const requirements = item.requirements && typeof item.requirements === 'object'
        ? {
            ...item.requirements,
            allowedJobs: migrateIdArray(item.requirements.allowedJobs ?? [], canonicalizeDisciplineId),
            allowedRaces: migrateIdArray(item.requirements.allowedRaces ?? [], canonicalizeRaceId),
            requiredNations: migrateIdArray(item.requirements.requiredNations ?? [], normalizeNationReference),
            requiredKeyItems: migrateIdArray(item.requirements.requiredKeyItems ?? [], canonicalizeMapId),
        }
        : item.requirements;
    return { ...item, requirements };
}

function migratePlaceKeyedRecord(record, valueMigrator = (value) => value) {
    if (!record || typeof record !== 'object' || Array.isArray(record)) return {};
    const next = {};
    for (const [placeId, value] of Object.entries(record)) {
        const canonicalPlaceId = canonicalizePlaceId(placeId);
        next[canonicalPlaceId] = valueMigrator(value, canonicalPlaceId);
    }
    return next;
}

function migrateAtlasEntry(entry, canonicalPlaceId) {
    if (!entry || typeof entry !== 'object') return entry;
    return {
        ...entry,
        placeId: canonicalPlaceId,
    };
}

function migrateTravel(travel) {
    if (!travel || typeof travel !== 'object') return travel ?? null;
    return {
        ...travel,
        from: canonicalizePlaceId(travel.from),
        to: canonicalizePlaceId(travel.to),
    };
}

function migratePosition(position, placeId) {
    if (!position || typeof position !== 'object') return position;
    return {
        ...position,
        placeId,
    };
}

function normalizeNationReference(value) {
    if (value === null || value === undefined) return value;
    const normalized = String(value)
        .trim()
        .toLowerCase()
        .replace(/[’']/g, '')
        .replace(/[^a-z0-9]+/g, '-');
    if (normalized === 'san-doria' || normalized === 'sandoria') return 'thornwall';
    if (normalized === 'bastok') return 'brasshaven';
    if (normalized === 'windurst') return 'mistmere';
    return canonicalizeNationId(normalized);
}

function nationDisplayName(nationId) {
    if (nationId === 'thornwall') return 'Thornwall';
    if (nationId === 'brasshaven') return 'Brasshaven';
    if (nationId === 'mistmere') return 'Mistmere';
    return nationId;
}

function placeIdFromLegacyDisplay(value) {
    const normalized = String(value ?? '').trim().toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-');
    const aliases = {
        'southern-san-doria': 'southern-sandoria',
        'northern-san-doria': 'northern-sandoria',
        'port-san-doria': 'port-sandoria',
        'bastok-markets': 'bastok-markets',
        'bastok-mines': 'bastok-mines',
        'port-bastok': 'port-bastok',
        'windurst-waters': 'windurst-waters',
        'windurst-walls': 'windurst-walls',
        'windurst-woods': 'windurst-woods',
        'port-windurst': 'port-windurst',
    };
    return aliases[normalized] ?? null;
}

export function canonicalizeEnemyInstanceId(value) {
    const text = String(value ?? '');
    const direct = canonicalizeEnemyId(text);
    if (direct !== text) return direct;
    for (const [legacyId, canonicalId] of Object.entries(LEGACY_ENEMY_IDS)) {
        if (text.startsWith(`${legacyId}-encounter-`)) return text.replace(legacyId, canonicalId);
    }
    return text;
}
