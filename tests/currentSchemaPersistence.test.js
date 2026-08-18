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
import { VERSION } from '../js/text/version.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() {
    globalThis.localStorage = new MemoryStorage();
}

test('an older account registry is rejected instead of migrated', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Current Account', 'pwd', { persistentLogin: true }).ok, true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    registry.version = VERSION.accountSave - 1;
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadAccount(), null);
    const unchanged = decodePayload(globalThis.localStorage.getItem(key));
    assert.equal(unchanged.version, VERSION.accountSave - 1);
});

test('an older character state is rejected instead of migrated or rewritten', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Current Character Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Currenthero';
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const oldState = decodePayload(record.encodedState);
    oldState.version = VERSION.gameState - 1;
    record.encodedState = encodePayload(oldState);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Currenthero'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchangedState = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(unchangedState.version, VERSION.gameState - 1);
});

test('a current-version save missing a required top-level registry is rejected without lazy reconstruction', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Strict Structure Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Strictkeeper';
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const incomplete = decodePayload(record.encodedState);
    delete incomplete.tasks;
    record.encodedState = encodePayload(incomplete);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Strictkeeper'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchangedState = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(Object.hasOwn(unchangedState, 'tasks'), false);
});

test('a current-version save missing required character capability state is rejected without lazy reconstruction', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Strict Character Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Strictcap';
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const incomplete = decodePayload(record.encodedState);
    delete incomplete.player.progression.capabilities;
    record.encodedState = encodePayload(incomplete);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Strictcap'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchangedState = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(Object.hasOwn(unchangedState.player.progression, 'capabilities'), false);
});

test('saveGame rejects a malformed current runtime state instead of filling required registries', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Strict Save Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Strictsave';
    delete state.ecology;

    assert.equal(saveGame(state), false);
    assert.equal(loadAccount().characters.length, 0);
    assert.equal(Object.hasOwn(state, 'ecology'), false);
});

test('world time persists through current-schema save and load without wall-clock recomputation', () => {
    installStorage();
    assert.equal(createAccountWithPassword('World Time Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Clockkeeper';
    state.worldTime.totalSeconds = 123456;
    assert.equal(saveGame(state), true);

    const loaded = loadCharacter('Clockkeeper');

    assert.equal(loaded.version, VERSION.gameState);
    assert.equal(loaded.worldTime.totalSeconds, 123456);
});
