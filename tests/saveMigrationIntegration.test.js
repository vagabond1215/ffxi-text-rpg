import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import {
    createAccountWithPassword,
    decodePayload,
    encodePayload,
    loadAccount,
    loadCharacter,
    saveGame,
} from '../js/text/save.js';

class MemoryStorage {
    constructor() {
        this.values = new Map();
    }

    getItem(key) {
        return this.values.has(key) ? this.values.get(key) : null;
    }

    setItem(key, value) {
        this.values.set(key, String(value));
    }

    removeItem(key) {
        this.values.delete(key);
    }
}

function installStorage() {
    globalThis.localStorage = new MemoryStorage();
}

test('loading a version 2 account registry migrates and persists it as account save version 4', () => {
    installStorage();
    const created = createAccountWithPassword('Legacy Account', 'pwd', { persistentLogin: true });
    assert.equal(created.ok, true);

    const key = 'ffxiTextRpgAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    registry.version = 2;
    registry.accounts = registry.accounts.map((account) => ({ ...account, version: 2 }));
    globalThis.localStorage.setItem(key, encodePayload(registry));

    const loaded = loadAccount();
    const migratedRegistry = decodePayload(globalThis.localStorage.getItem(key));

    assert.equal(loaded.profile.displayName, 'Legacy Account');
    assert.equal(migratedRegistry.version, 4);
    assert.equal(migratedRegistry.accounts[0].version, 4);
});

test('loading a version 2 character migrates and persists game state version 4 with world time', () => {
    installStorage();
    const created = createAccountWithPassword('Legacy Character Account', 'pwd', { persistentLogin: true });
    assert.equal(created.ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Legacyhero';
    assert.equal(saveGame(state), true);

    const key = 'ffxiTextRpgAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const oldState = decodePayload(record.encodedState);
    oldState.version = 2;
    delete oldState.worldTime;
    delete oldState.meta;
    record.encodedState = encodePayload(oldState);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    const loaded = loadCharacter('Legacyhero');
    const migratedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const migratedState = decodePayload(migratedRegistry.accounts[0].characters[0].encodedState);

    assert.equal(loaded.version, 4);
    assert.equal(loaded.meta.characterId, record.id);
    assert.deepEqual(loaded.worldTime, { totalSeconds: 0 });
    assert.equal(migratedState.version, 4);
    assert.deepEqual(migratedState.worldTime, { totalSeconds: 0 });
    assert.equal(migratedState.meta.characterId, record.id);
});

test('world time persists through normal save and load without wall-clock recomputation', () => {
    installStorage();
    const created = createAccountWithPassword('World Time Account', 'pwd', { persistentLogin: true });
    assert.equal(created.ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Clockkeeper';
    state.worldTime.totalSeconds = 123456;
    assert.equal(saveGame(state), true);

    const loaded = loadCharacter('Clockkeeper');

    assert.equal(loaded.version, 4);
    assert.equal(loaded.worldTime.totalSeconds, 123456);
});
