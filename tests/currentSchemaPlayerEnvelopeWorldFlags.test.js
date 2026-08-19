import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import {
    createAccountWithPassword,
    decodePayload,
    encodePayload,
    loadCharacter,
    saveGame,
} from '../js/text/save.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() { globalThis.localStorage = new MemoryStorage(); }

function createWorldFactState() {
    const state = createInitialState();
    state.player.id = 'player-arden';
    state.player.identity.name = 'Arden';
    state.flags['elderwood.pale-ear-trail'] = true;
    state.flags['starfen.old-causeway-open'] = false;
    return state;
}

test('current schema accepts stable player envelope and boolean world-condition flags', () => {
    const state = createWorldFactState();

    assert.equal(state.player.type, 'player');
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects malformed player envelope and truthy non-boolean world flags', () => {
    const missingId = createWorldFactState();
    missingId.player.id = '';
    assert.ok(validateCurrentGameStateStructure(missingId).some((issue) => issue.includes('player.id must be a normalized non-empty string')));

    const paddedId = createWorldFactState();
    paddedId.player.id = ' player-arden ';
    assert.ok(validateCurrentGameStateStructure(paddedId).some((issue) => issue.includes('player.id must be a normalized non-empty string')));

    const wrongType = createWorldFactState();
    wrongType.player.type = 'enemy';
    assert.ok(validateCurrentGameStateStructure(wrongType).some((issue) => issue.includes('player.type must be player')));

    const truthyString = createWorldFactState();
    truthyString.flags['elderwood.pale-ear-trail'] = 'false';
    assert.ok(validateCurrentGameStateStructure(truthyString).some((issue) => issue.includes('flags.elderwood.pale-ear-trail must be boolean')));

    const numericFlag = createWorldFactState();
    numericFlag.flags['elderwood.pale-ear-trail'] = 1;
    assert.ok(validateCurrentGameStateStructure(numericFlag).some((issue) => issue.includes('flags.elderwood.pale-ear-trail must be boolean')));

    const paddedFlag = createWorldFactState();
    paddedFlag.flags[' padded-world-flag '] = true;
    assert.ok(validateCurrentGameStateStructure(paddedFlag).some((issue) => issue.includes('flags key " padded-world-flag " must be a normalized non-empty id')));
});

test('player envelope and world flags survive real current save and load unchanged', () => {
    installStorage();
    assert.equal(createAccountWithPassword('World Fact Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = createWorldFactState();
    const expectedPlayerId = state.player.id;
    const expectedPlayerType = state.player.type;
    const expectedFlags = structuredClone(state.flags);

    assert.equal(saveGame(state), true);
    const loaded = loadCharacter('Arden');

    assert.ok(loaded);
    assert.equal(loaded.player.id, expectedPlayerId);
    assert.equal(loaded.player.type, expectedPlayerType);
    assert.deepEqual(loaded.flags, expectedFlags);
});

test('load rejects malformed player type and world flag without repairing persisted authority', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Strict World Fact Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = createWorldFactState();
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    malformed.player.type = 'enemy';
    malformed.flags['elderwood.pale-ear-trail'] = 'true';
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Arden'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.player.type, 'enemy');
    assert.equal(unchanged.flags['elderwood.pale-ear-trail'], 'true');
});
