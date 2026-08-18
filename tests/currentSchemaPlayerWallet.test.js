import test from 'node:test';
import assert from 'node:assert/strict';

import { CURRENCY_KEYS } from '../js/text/data/systemConstants.js';
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

test('current schema accepts the canonical persisted wallet with nonzero balances', () => {
    const state = createInitialState();
    state.player.wallet.gil = 4321;
    state.player.wallet.sparks = 17;

    assert.deepEqual(Object.keys(state.player.wallet).sort(), [...CURRENCY_KEYS].sort());
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects missing negative fractional string and unknown wallet currency values', () => {
    const missing = createInitialState();
    delete missing.player.wallet.gil;
    assert.ok(validateCurrentGameStateStructure(missing).some((issue) => issue.includes('player.wallet.gil must be a non-negative integer')));

    const negative = createInitialState();
    negative.player.wallet.gil = -1;
    assert.ok(validateCurrentGameStateStructure(negative).some((issue) => issue.includes('player.wallet.gil must be a non-negative integer')));

    const fractional = createInitialState();
    fractional.player.wallet.sparks = 1.5;
    assert.ok(validateCurrentGameStateStructure(fractional).some((issue) => issue.includes('player.wallet.sparks must be a non-negative integer')));

    const stringValue = createInitialState();
    stringValue.player.wallet.gil = '12';
    assert.ok(validateCurrentGameStateStructure(stringValue).some((issue) => issue.includes('player.wallet.gil must be a non-negative integer')));

    const unknown = createInitialState();
    unknown.player.wallet.legacyTokens = 10;
    assert.ok(validateCurrentGameStateStructure(unknown).some((issue) => issue.includes('player.wallet.legacyTokens is not a canonical currency key')));
});

test('nonzero canonical wallet balances survive real current save and load unchanged', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Wallet Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Ledger';
    state.player.wallet.gil = 4321;
    state.player.wallet.conquestPoints = 25;
    state.player.wallet.sparks = 17;
    const expected = structuredClone(state.player.wallet);

    assert.equal(saveGame(state), true);
    const loaded = loadCharacter('Ledger');

    assert.ok(loaded);
    assert.deepEqual(loaded.player.wallet, expected);
});

test('load rejects malformed current wallet values without coercing or deleting them', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Strict Wallet Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Badledger';
    state.player.wallet.gil = 20;
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    malformed.player.wallet.gil = '20';
    malformed.player.wallet.legacyTokens = 3;
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Badledger'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.player.wallet.gil, '20');
    assert.equal(unchanged.player.wallet.legacyTokens, 3);
});
