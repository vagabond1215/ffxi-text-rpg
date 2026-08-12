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
