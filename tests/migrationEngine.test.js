import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { reviveGameState } from '../js/text/save.js';
import { migrateVersionedValue } from '../js/text/systems/migrationEngine.js';
import {
    describeSaveMigrationSupport,
    migrateAccountRegistryPayload,
    migrateGameStatePayload,
} from '../js/text/systems/saveMigrations.js';
import { isValidGameState } from '../js/text/systems/validation.js';


test('ordered migration engine applies every required step in sequence', () => {
    const source = { version: 1, values: [] };
    const result = migrateVersionedValue(source, {
        currentVersion: 3,
        label: 'fixture',
        migrations: [
            { id: 'one-to-two', from: 1, to: 2, migrate: (value) => ({ ...value, version: 2, values: [...value.values, 2] }) },
            { id: 'two-to-three', from: 2, to: 3, migrate: (value) => ({ ...value, version: 3, values: [...value.values, 3] }) },
        ],
    });

    assert.equal(result.ok, true);
    assert.equal(result.migrated, true);
    assert.deepEqual(result.applied, ['one-to-two', 'two-to-three']);
    assert.deepEqual(result.value.values, [2, 3]);
    assert.equal(source.version, 1);
    assert.deepEqual(source.values, []);
});

test('ordered migration engine fails deterministically on missing or future versions', () => {
    const missing = migrateVersionedValue({ version: 1 }, {
        currentVersion: 3,
        label: 'fixture',
        migrations: [{ id: 'two-to-three', from: 2, to: 3, migrate: (value) => ({ ...value, version: 3 }) }],
    });
    assert.equal(missing.ok, false);
    assert.equal(missing.code, 'missing-migration');
    assert.equal(missing.stoppedAtVersion, 1);

    const future = migrateVersionedValue({ version: 4 }, { currentVersion: 3, label: 'fixture' });
    assert.equal(future.ok, false);
    assert.equal(future.code, 'future-version');
});

test('game-state migration upgrades version 2 through inventory and world-time migrations to version 4', () => {
    const state = createInitialState();
    const flatInventory = [{ id: 'old-item', name: 'Old Item', kind: 'misc', quantity: 1 }];
    state.version = 2;
    delete state.worldTime;
    delete state.meta;
    delete state.player.inventoryState;
    state.player.inventory = flatInventory;
    state.player.progression = { ...state.player.progression };
    delete state.player.progression.skills;

    const result = migrateGameStatePayload(state);

    assert.equal(result.ok, true);
    assert.deepEqual(result.applied, [
        'game-state-2-to-3-inventory-and-progression',
        'game-state-3-to-4-world-time',
    ]);
    assert.equal(result.value.version, 4);
    assert.deepEqual(result.value.worldTime, { totalSeconds: 0 });
    assert.equal(result.value.player.inventoryState.containers.inventory.items[0].name, 'Old Item');
    assert.deepEqual(result.value.player.progression.skills, {});

    const revived = reviveGameState(result.value, 'migrated-character');
    assert.equal(revived.player.inventory, revived.player.inventoryState.containers.inventory.items);
    assert.equal(isValidGameState(revived), true);
});

test('game-state version 3 migration preserves an existing valid provisional world time', () => {
    const state = createInitialState();
    state.version = 3;
    state.worldTime = { totalSeconds: 9876 };

    const result = migrateGameStatePayload(state);

    assert.equal(result.ok, true);
    assert.deepEqual(result.applied, ['game-state-3-to-4-world-time']);
    assert.equal(result.value.version, 4);
    assert.deepEqual(result.value.worldTime, { totalSeconds: 9876 });
});

test('account registry migrations advance stored version 2 records through version 4', () => {
    const result = migrateAccountRegistryPayload({
        version: 2,
        encoding: 'base64-json-v1',
        accounts: [{ version: 2, encoding: 'base64-json-v1', profile: { accountId: 'account-1' }, characters: [] }],
    });

    assert.equal(result.ok, true);
    assert.deepEqual(result.applied, [
        'account-registry-2-to-3-version-contract',
        'account-registry-3-to-4-version-contract',
    ]);
    assert.equal(result.value.version, 4);
    assert.equal(result.value.accounts[0].version, 4);
});

test('save migration support describes current and oldest supported versions', () => {
    const support = describeSaveMigrationSupport();

    assert.equal(support.gameState.currentVersion, 4);
    assert.equal(support.gameState.supportedFrom, 2);
    assert.equal(support.accountSave.currentVersion, 4);
    assert.equal(support.accountSave.supportedFrom, 2);
});
