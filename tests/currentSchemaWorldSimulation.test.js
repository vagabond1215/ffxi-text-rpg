import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { createAccountWithPassword, decodePayload, encodePayload, loadCharacter, saveGame } from '../js/text/save.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installAccount(name) {
    globalThis.localStorage = new MemoryStorage();
    assert.equal(createAccountWithPassword(name, 'pwd', { persistentLogin: true }).ok, true);
}

function corruptStoredCharacter(characterName, mutate) {
    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters.find((entry) => entry.name === characterName);
    assert.ok(record);
    const state = decodePayload(record.encodedState);
    mutate(state);
    record.encodedState = encodePayload(state);
    globalThis.localStorage.setItem(key, encodePayload(registry));
}

test('current schema accepts non-default persisted world and simulation state', () => {
    const state = createInitialState();
    state.worldTime.totalSeconds = (5 * 24 * 60 * 60) + 12345;
    state.simulation.paused = true;
    state.simulation.speedMultiplier = 60;
    state.simulation.endOfDayPause = false;

    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects malformed canonical world time before runtime access', () => {
    const state = createInitialState();
    state.worldTime.totalSeconds = -1;

    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('worldTime.totalSeconds must be a non-negative integer')));
});

test('current schema rejects malformed simulation control before ensure-state backfill', () => {
    const state = createInitialState();
    state.simulation.paused = 'no';
    state.simulation.speedMultiplier = 0;
    delete state.simulation.endOfDayPause;

    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('simulation.paused must be boolean')));
    assert.ok(issues.some((issue) => issue.includes('simulation.speedMultiplier must be an integer')));
    assert.ok(issues.some((issue) => issue.includes('simulation.endOfDayPause must be boolean')));
});

test('non-default world and simulation state survive current save and load', () => {
    installAccount('World Simulation Registry');
    const state = createInitialState();
    state.player.identity.name = 'Clockwarden';
    state.worldTime.totalSeconds = (9 * 24 * 60 * 60) + 43210;
    state.simulation.paused = true;
    state.simulation.speedMultiplier = 120;
    state.simulation.endOfDayPause = false;
    assert.equal(saveGame(state), true);

    const loaded = loadCharacter('Clockwarden');
    assert.ok(loaded);
    assert.equal(loaded.worldTime.totalSeconds, state.worldTime.totalSeconds);
    assert.deepEqual(loaded.simulation, state.simulation);
    assert.deepEqual(validateCurrentGameStateStructure(loaded, { requireMeta: true }), []);
});

test('load rejects malformed current world time without repairing it', () => {
    installAccount('Strict World Time');
    const state = createInitialState();
    state.player.identity.name = 'Timekeeper';
    assert.equal(saveGame(state), true);
    corruptStoredCharacter('Timekeeper', (stored) => {
        stored.worldTime.totalSeconds = -10;
    });

    assert.equal(loadCharacter('Timekeeper'), null);
    const registry = decodePayload(globalThis.localStorage.getItem('hearthHorizonAccounts'));
    const unchanged = decodePayload(registry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.worldTime.totalSeconds, -10);
});

test('load rejects incomplete current simulation state without backfilling it', () => {
    installAccount('Strict Simulation Control');
    const state = createInitialState();
    state.player.identity.name = 'Simkeeper';
    assert.equal(saveGame(state), true);
    corruptStoredCharacter('Simkeeper', (stored) => {
        delete stored.simulation.endOfDayPause;
    });

    assert.equal(loadCharacter('Simkeeper'), null);
    const registry = decodePayload(globalThis.localStorage.getItem('hearthHorizonAccounts'));
    const unchanged = decodePayload(registry.accounts[0].characters[0].encodedState);
    assert.equal(Object.hasOwn(unchanged.simulation, 'endOfDayPause'), false);
});
