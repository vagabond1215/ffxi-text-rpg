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
import { advanceSimulationWithDayPolicy } from '../js/text/systems/dayCycleEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() { globalThis.localStorage = new MemoryStorage(); }
function finalizeFirstDay(state) { return advanceSimulationWithDayPolicy(state, 16 * 60 * 60); }

test('current schema keeps day-cycle bookkeeping optional before day-aware simulation uses it', () => {
    const state = createInitialState();
    assert.equal(Object.hasOwn(state, 'dayCycle'), false);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema accepts canonical persisted day-cycle summaries after a real day boundary', () => {
    const state = createInitialState();
    const result = finalizeFirstDay(state);

    assert.equal(result.ok, true);
    assert.equal(state.dayCycle.lastFinalizedDay, 1);
    assert.equal(state.dayCycle.summaries.length, 1);
    assert.equal(state.dayCycle.summaries[0].day, 1);
    assert.equal(state.dayCycle.summaries[0].startWorldSeconds, 0);
    assert.equal(state.dayCycle.summaries[0].endWorldSeconds, 86400);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects malformed or temporally impossible persisted day-cycle state', () => {
    const malformedSummary = createInitialState();
    finalizeFirstDay(malformedSummary);
    malformedSummary.dayCycle.summaries[0].endWorldSeconds = 999;
    assert.ok(validateCurrentGameStateStructure(malformedSummary).some((issue) => issue.includes('endWorldSeconds must match its canonical day boundary')));

    const futureFinalizedDay = createInitialState();
    futureFinalizedDay.dayCycle = { version: 1, lastFinalizedDay: 3, summaries: [] };
    assert.ok(validateCurrentGameStateStructure(futureFinalizedDay).some((issue) => issue.includes('cannot exceed completed canonical world days')));

    const nonObject = createInitialState();
    nonObject.dayCycle = null;
    assert.ok(validateCurrentGameStateStructure(nonObject).some((issue) => issue.includes('dayCycle must be a persisted object when present')));
});

test('non-empty day-cycle history survives real current save and load unchanged', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Day Cycle Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = createInitialState();
    state.player.identity.name = 'Daykeeper';
    finalizeFirstDay(state);
    const expected = structuredClone(state.dayCycle);

    assert.equal(saveGame(state), true);
    const loaded = loadCharacter('Daykeeper');
    assert.ok(loaded);
    assert.deepEqual(loaded.dayCycle, expected);
});

test('load rejects malformed persisted day-cycle history without reconstructing it', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Strict Day Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = createInitialState();
    state.player.identity.name = 'BadDay';
    finalizeFirstDay(state);
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    malformed.dayCycle.summaries[0].startWorldSeconds = 5;
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('BadDay'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.dayCycle.summaries[0].startWorldSeconds, 5);
});
