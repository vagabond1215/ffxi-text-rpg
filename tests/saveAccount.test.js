import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import {
    clearSave,
    decodePayload,
    encodePayload,
    listCharacters,
    loadActiveCharacter,
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

    clear() {
        this.values.clear();
    }
}

function installStorage() {
    globalThis.localStorage = new MemoryStorage();
}

test('encodePayload and decodePayload round-trip account-safe JSON', () => {
    const value = { name: 'San d’Oria', nested: { count: 2 } };
    const encoded = encodePayload(value);

    assert.match(encoded, /^base64-json-v1:/);
    assert.deepEqual(decodePayload(encoded), value);
});

test('saveGame stores encoded account with character summary', () => {
    installStorage();
    const state = createInitialState();
    state.player.identity.name = 'Testhero';

    assert.equal(saveGame(state), true);

    const raw = globalThis.localStorage.getItem('ffxiTextRpgAccount');
    assert.match(raw, /^base64-json-v1:/);
    assert.equal(globalThis.localStorage.getItem('ffxiTextRpgSave'), null);

    const account = loadAccount();
    assert.equal(account.characters.length, 1);
    assert.equal(account.characters[0].name, 'Testhero');
    assert.equal(listCharacters()[0].name, 'Testhero');
});

test('loadCharacter restores state and relinks flat inventory to main container', () => {
    installStorage();
    const state = createInitialState();
    state.player.identity.name = 'Relink';
    state.player.inventoryState.containers.inventory.items.push({ id: 'test-item', name: 'Test Item', kind: 'misc', quantity: 1 });
    saveGame(state);

    const loaded = loadCharacter('Relink');

    assert.equal(loaded.player.identity.name, 'Relink');
    assert.equal(loaded.player.inventory, loaded.player.inventoryState.containers.inventory.items);
    assert.equal(loaded.player.inventory[0].name, 'Test Item');
});

test('loadActiveCharacter returns last saved character', () => {
    installStorage();
    const first = createInitialState();
    first.player.identity.name = 'First';
    saveGame(first);

    const second = createInitialState();
    second.player.identity.name = 'Second';
    saveGame(second);

    assert.equal(loadActiveCharacter().player.identity.name, 'Second');
});

test('clearSave removes encoded account data', () => {
    installStorage();
    const state = createInitialState();
    saveGame(state);
    clearSave();

    assert.equal(globalThis.localStorage.getItem('ffxiTextRpgAccount'), null);
    assert.equal(loadAccount().characters.length, 0);
});
