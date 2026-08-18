import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import {
    createAccountWithPassword,
    listAccounts,
    listCharacters,
    loadAccount,
    loadAccountSession,
    saveAccount,
    saveGame,
} from '../js/text/save.js';
import { clearAllLocalData, deleteCharacterSave } from '../js/text/systems/saveRecovery.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
    clear() { this.values.clear(); }
}

function installStorage() {
    globalThis.localStorage = new MemoryStorage();
}

function createCharacter(name) {
    const state = createInitialState();
    state.player.identity.name = name;
    assert.equal(saveGame(state), true);
    return state;
}

test('character save deletion works by registry id even when the encoded state is corrupted', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Recovery', 'pwd', { persistentLogin: true }).ok, true);
    createCharacter('Healthy');
    createCharacter('Broken');

    const summaries = listCharacters();
    const healthy = summaries.find((entry) => entry.name === 'Healthy');
    const broken = summaries.find((entry) => entry.name === 'Broken');
    const account = loadAccount();
    const record = account.characters.find((entry) => entry.id === broken.id);
    record.encodedState = 'this-is-not-decodable-json';
    saveAccount(account);

    const removed = deleteCharacterSave(broken.id);

    assert.equal(removed.ok, true);
    assert.equal(removed.deletedName, 'Broken');
    assert.equal(removed.nextCharacterId, healthy.id);
    assert.deepEqual(listCharacters().map((entry) => entry.name), ['Healthy']);
    assert.equal(loadAccountSession().lastCharacterId, healthy.id);
});

test('deleting the only character leaves a valid logged-in empty account', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Solo', 'pwd', { persistentLogin: true }).ok, true);
    createCharacter('Only');
    const id = listCharacters()[0].id;

    const removed = deleteCharacterSave(id);

    assert.equal(removed.ok, true);
    assert.equal(removed.nextCharacterId, null);
    assert.equal(loadAccountSession().loggedIn, true);
    assert.equal(loadAccountSession().characterCount, 0);
});

test('clear-all recovery removes account registry and session in one action', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Clear All', 'pwd', { persistentLogin: true }).ok, true);
    createCharacter('Disposable');

    const result = clearAllLocalData();

    assert.equal(result.ok, true);
    assert.equal(result.session.loggedIn, false);
    assert.equal(listAccounts().length, 0);
    assert.equal(globalThis.localStorage.getItem('hearthHorizonAccounts'), null);
    assert.equal(globalThis.localStorage.getItem('hearthHorizonAccountSession'), null);
});
