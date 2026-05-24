import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import {
    clearSave,
    createAccountWithPassword,
    decodePayload,
    encodePayload,
    listAccounts,
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

function createLoggedInAccount(name = 'Russell', password = 'pwd') {
    const created = createAccountWithPassword(name, password, { persistentLogin: true });
    assert.equal(created.ok, true);
    return created;
}

test('encodePayload and decodePayload round-trip account-safe JSON', () => {
    const value = { name: 'San d’Oria', nested: { count: 2 } };
    const encoded = encodePayload(value);

    assert.match(encoded, /^base64-json-v1:/);
    assert.deepEqual(decodePayload(encoded), value);
});

test('saveGame refuses to save without a logged-in account', () => {
    installStorage();
    const state = createInitialState();

    assert.equal(saveGame(state), false);
    assert.equal(globalThis.localStorage.getItem('ffxiTextRpgAccounts'), null);
});

test('saveGame stores encoded account registry with character summary after login', () => {
    installStorage();
    createLoggedInAccount();
    const state = createInitialState();
    state.player.identity.name = 'Testhero';

    assert.equal(saveGame(state), true);

    const raw = globalThis.localStorage.getItem('ffxiTextRpgAccounts');
    assert.match(raw, /^base64-json-v1:/);
    assert.equal(globalThis.localStorage.getItem('ffxiTextRpgSave'), null);

    const account = loadAccount();
    assert.equal(account.characters.length, 1);
    assert.equal(account.characters[0].name, 'Testhero');
    assert.equal(listCharacters()[0].name, 'Testhero');
});

test('loadCharacter restores state and relinks flat inventory to main container', () => {
    installStorage();
    createLoggedInAccount();
    const state = createInitialState();
    state.player.identity.name = 'Relink';
    state.player.inventoryState.containers.inventory.items.push({ id: 'test-item', name: 'Test Item', kind: 'misc', quantity: 1 });
    saveGame(state);

    const loaded = loadCharacter('Relink');

    assert.equal(loaded.player.identity.name, 'Relink');
    assert.equal(loaded.player.inventory, loaded.player.inventoryState.containers.inventory.items);
    assert.equal(loaded.player.inventory[0].name, 'Test Item');
});

test('loadActiveCharacter returns last saved character for logged-in account', () => {
    installStorage();
    createLoggedInAccount();
    const first = createInitialState();
    first.player.identity.name = 'First';
    saveGame(first);

    const second = createInitialState();
    second.player.identity.name = 'Second';
    saveGame(second);

    assert.equal(loadActiveCharacter().player.identity.name, 'Second');
});

test('createAccountWithPassword persists a real local account and session', () => {
    installStorage();

    const result = createAccountWithPassword('Russell', 'pwd', { persistentLogin: true });

    assert.equal(result.ok, true);
    assert.equal(result.session.loggedIn, true);
    assert.equal(result.session.displayName, 'Russell');
    assert.equal(result.session.persistentLogin, true);
    assert.equal(loadAccount().profile.displayName, 'Russell');
    assert.equal(listAccounts()[0].displayName, 'Russell');
    assert.match(globalThis.localStorage.getItem('ffxiTextRpgAccountSession'), /^base64-json-v1:/);
});

test('placeholder account names are rejected explicitly', () => {
    installStorage();

    const result = createAccountWithPassword('Local Adventurer', 'pwd');

    assert.equal(result.ok, false);
    assert.match(result.reason, /reserved/i);
    assert.equal(listAccounts().length, 0);
});

test('loginAccount requires the correct password', () => {
    installStorage();
    createAccountWithPassword('Russell', 'pwd');
    logoutAccount();

    assert.equal(loginAccount('Russell', 'bad').ok, false);
    const result = loginAccount('Russell', 'pwd', { persistentLogin: true });

    assert.equal(result.ok, true);
    assert.equal(loadAccountSession().loggedIn, true);
});

test('account logout clears session without deleting saved account', () => {
    installStorage();
    createLoggedInAccount();

    const session = logoutAccount();

    assert.equal(session.loggedIn, false);
    assert.equal(listAccounts()[0].displayName, 'Russell');
    assert.equal(globalThis.localStorage.getItem('ffxiTextRpgAccountSession'), null);
});

test('saveAccount keeps logged-in session display name synchronized', () => {
    installStorage();
    createLoggedInAccount('Old Name');
    const account = loadAccount();
    account.profile.displayName = 'New Name';

    saveAccount(account);

    assert.equal(loadAccountSession().displayName, 'New Name');
});

test('clearSave removes encoded account registry and session data', () => {
    installStorage();
    createLoggedInAccount('Clear Me');
    const state = createInitialState();
    saveGame(state);
    clearSave();

    assert.equal(globalThis.localStorage.getItem('ffxiTextRpgAccounts'), null);
    assert.equal(globalThis.localStorage.getItem('ffxiTextRpgAccountSession'), null);
    assert.equal(listAccounts().length, 0);
});
