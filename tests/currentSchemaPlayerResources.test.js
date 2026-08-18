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

test('current schema accepts mutable player HP MP and TP without treating combat profile as authority', () => {
    const state = createInitialState();
    state.player.resources = { hp: 7, mp: 3, tp: 987 };

    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects missing fractional negative and non-numeric player resources', () => {
    for (const [key, value] of [
        ['hp', undefined],
        ['hp', -1],
        ['mp', 1.5],
        ['tp', '1000'],
    ]) {
        const state = createInitialState();
        if (value === undefined) delete state.player.resources[key];
        else state.player.resources[key] = value;
        assert.ok(
            validateCurrentGameStateStructure(state).some((issue) => issue.includes(`player.resources.${key} must be a non-negative integer`)),
            `${key}=${String(value)} should be rejected`,
        );
    }
});

test('damaged and partially spent player resources survive real save and load unchanged', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Resource Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Weathered';
    state.player.resources = { hp: 5, mp: 2, tp: 1337 };
    const expectedCombat = structuredClone(state.player.combat);

    assert.equal(saveGame(state), true);
    const loaded = loadCharacter('Weathered');

    assert.ok(loaded);
    assert.deepEqual(loaded.player.resources, { hp: 5, mp: 2, tp: 1337 });
    assert.deepEqual(loaded.player.combat, expectedCombat);
});

test('load rejects malformed current player resources without coercing them', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Strict Resource Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Badresource';
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    malformed.player.resources.hp = '12';
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Badresource'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.player.resources.hp, '12');
});
