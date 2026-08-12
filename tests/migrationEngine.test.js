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

    const future = migrateVersionedValue({ version: 6 }, { currentVersion: 5, label: 'fixture' });
    assert.equal(future.ok, false);
    assert.equal(future.code, 'future-version');
});

test('game-state migration upgrades version 2 through inventory, world-time, and identity migrations to version 5', () => {
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
        'game-state-4-to-5-original-world-identities',
    ]);
    assert.equal(result.value.version, 5);
    assert.deepEqual(result.value.worldTime, { totalSeconds: 0 });
    assert.equal(result.value.player.inventoryState.containers.inventory.items[0].name, 'Old Item');
    assert.deepEqual(result.value.player.progression.skills, {});

    const revived = reviveGameState(result.value, 'migrated-character');
    assert.equal(revived.player.inventory, revived.player.inventoryState.containers.inventory.items);
    assert.equal(isValidGameState(revived), true);
});

test('game-state version 3 migration preserves provisional world time and advances through identity migration', () => {
    const state = createInitialState();
    state.version = 3;
    state.worldTime = { totalSeconds: 9876 };

    const result = migrateGameStatePayload(state);

    assert.equal(result.ok, true);
    assert.deepEqual(result.applied, [
        'game-state-3-to-4-world-time',
        'game-state-4-to-5-original-world-identities',
    ]);
    assert.equal(result.value.version, 5);
    assert.deepEqual(result.value.worldTime, { totalSeconds: 9876 });
});

test('game-state v4 legacy identifiers migrate to canonical original-world IDs', () => {
    const state = createInitialState();
    state.version = 4;
    state.currentPlaceId = 'southern-sandoria';
    state.location = 'Southern San d’Oria';
    state.position = { placeId: 'southern-sandoria', levelId: 'main', coord: 'G-10' };
    state.atlas = {
        'southern-sandoria': {
            placeId: 'southern-sandoria',
            visited: ['main:G-10'],
            discovered: ['main:G-10'],
        },
    };
    state.discoveredPois = { 'southern-sandoria': [] };
    state.player.identity.raceId = 'hume';
    state.player.identity.raceName = 'Hume';
    state.player.identity.nation = 'San d’Oria';
    state.player.identity.startingCity = 'Southern San d’Oria';
    state.player.jobs.mainJobId = 'warrior';
    state.player.jobs.mainJobName = 'Warrior';
    state.player.jobs.unlockedJobs = ['warrior', 'monk'];
    state.player.jobs.jobLevels = { warrior: 4, monk: 2 };
    state.player.progression.jobProgression = {
        warrior: { level: 4, exp: 20 },
        monk: { level: 2, exp: 5 },
    };
    state.player.progression.nationRanks = { sandoria: 2, bastok: 1, windurst: 1 };
    state.player.progression.unlockedMaps = ['map-san-doria', 'map-ronfaure'];
    state.player.progression.unlockedHomePoints = ['southern-sandoria'];
    state.player.keyItems = ['map-san-doria', 'map-ronfaure'];

    const result = migrateGameStatePayload(state);

    assert.equal(result.ok, true);
    assert.deepEqual(result.applied, ['game-state-4-to-5-original-world-identities']);
    assert.equal(result.value.currentPlaceId, 'thornwall-southgate');
    assert.equal(result.value.location, 'Thornwall Southgate');
    assert.equal(result.value.player.identity.raceId, 'human');
    assert.equal(result.value.player.identity.raceName, 'Human');
    assert.equal(result.value.player.identity.nation, 'Thornwall');
    assert.equal(result.value.player.jobs.mainJobId, 'vanguard');
    assert.deepEqual(result.value.player.jobs.unlockedJobs, ['vanguard', 'pugilist']);
    assert.deepEqual(result.value.player.jobs.jobLevels, { vanguard: 4, pugilist: 2 });
    assert.deepEqual(result.value.player.progression.jobProgression, {
        vanguard: { level: 4, exp: 20 },
        pugilist: { level: 2, exp: 5 },
    });
    assert.deepEqual(result.value.player.progression.nationRanks, { thornwall: 2, brasshaven: 1, mistmere: 1 });
    assert.deepEqual(result.value.player.progression.unlockedMaps, ['map-thornwall', 'map-elderwood']);
    assert.deepEqual(result.value.player.progression.unlockedHomePoints, ['thornwall-southgate']);
    assert.deepEqual(result.value.player.keyItems, ['map-thornwall', 'map-elderwood']);
    assert.ok(result.value.atlas['thornwall-southgate']);
    assert.equal(result.value.flags.originalWorldIdentityMigrated, true);
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

    assert.equal(support.gameState.currentVersion, 5);
    assert.equal(support.gameState.supportedFrom, 2);
    assert.equal(support.accountSave.currentVersion, 4);
    assert.equal(support.accountSave.supportedFrom, 2);
});
