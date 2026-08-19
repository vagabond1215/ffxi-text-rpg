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
import { calculateCombatProfile } from '../js/text/systems/statEngine.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() { globalThis.localStorage = new MemoryStorage(); }

function storedCharacterState() {
    const registry = decodePayload(globalThis.localStorage.getItem('hearthHorizonAccounts'));
    return {
        registry,
        record: registry.accounts[0].characters[0],
        state: decodePayload(registry.accounts[0].characters[0].encodedState),
    };
}

test('Game State 8 raw payload does not require derived player combat or stat caches', () => {
    const state = createInitialState();
    delete state.player.combat;
    delete state.player.statState;
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('save omits derived player caches and load rebuilds them without changing mutable resources', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Derived Cache Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Cacheless';
    state.player.resources = { hp: 9, mp: 4, tp: 1222 };
    const expectedCombat = calculateCombatProfile(state.player);
    const expectedStatState = structuredClone(state.player.statState);

    assert.equal(saveGame(state), true);
    const stored = storedCharacterState().state;
    assert.equal(Object.hasOwn(stored.player, 'combat'), false);
    assert.equal(Object.hasOwn(stored.player, 'statState'), false);

    const loaded = loadCharacter('Cacheless');
    assert.ok(loaded);
    assert.deepEqual(loaded.player.resources, { hp: 9, mp: 4, tp: 1222 });
    assert.deepEqual(loaded.player.combat, expectedCombat);
    assert.deepEqual(loaded.player.statState, expectedStatState);
});

test('load ignores injected derived player caches and rebuilds from durable character authority', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Injected Cache Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Rebuilt';
    state.player.resources = { hp: 6, mp: 2, tp: 777 };
    assert.equal(saveGame(state), true);

    const { registry, record, state: encodedState } = storedCharacterState();
    encodedState.player.combat = { sentinel: 'stale-combat-cache' };
    encodedState.player.statState = { sentinel: 'stale-stat-cache' };
    record.encodedState = encodePayload(encodedState);
    globalThis.localStorage.setItem('hearthHorizonAccounts', encodePayload(registry));

    const loaded = loadCharacter('Rebuilt');
    assert.ok(loaded);
    assert.equal(loaded.player.combat.sentinel, undefined);
    assert.equal(loaded.player.statState.sentinel, undefined);
    assert.equal(loaded.player.statState.version, 1);
    assert.equal(loaded.player.statState.ancestryId, loaded.player.identity.raceId);
    assert.deepEqual(loaded.player.resources, { hp: 6, mp: 2, tp: 777 });
    assert.deepEqual(loaded.player.combat, calculateCombatProfile(loaded.player));
});
