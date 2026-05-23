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
    loadAccountSession,
    loadCharacter,
    loginAccount,
    logoutAccount,
    saveAccount,
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

test('account login persists a recognized local session', () => {
    installStorage();

    const session = loginAccount('Russell');

    assert.equal(session.loggedIn, true);
    assert.equal(session.displayName, 'Russell');
    assert.equal(loadAccount().profile.displayName, 'Russell');
    assert.equal(loadAccountSession().loggedIn, true);
    assert.match(globalThis.localStorage.getItem('ffxiTextRpgAccountSession'), /^base64-json-v1:/);
});

test('account logout clears session without deleting saved account', () => {
    installStorage();
    loginAccount('Russell');

    const session = logoutAccount();

    assert.equal(session.loggedIn, false);
    assert.equal(loadAccount().profile.displayName, 'Russell');
    assert.equal(globalThis.localStorage.getItem('ffxiTextRpgAccountSession'), null);
});

test('saveAccount keeps logged-in session display name synchronized', () => {
    installStorage();
    loginAccount('Old Name');
    const account = loadAccount();
    account.profile.displayName = 'New Name';

    saveAccount(account);

    assert.equal(loadAccountSession().displayName, 'New Name');
});

test('clearSave removes encoded account and session data', () => {
    installStorage();
    const state = createInitialState();
    saveGame(state);
    loginAccount('Clear Me');
    clearSave();

    assert.equal(globalThis.localStorage.getItem('ffxiTextRpgAccount'), null);
    assert.equal(globalThis.localStorage.getItem('ffxiTextRpgAccountSession'), null);
    assert.equal(loadAccount().characters.length, 0);
});