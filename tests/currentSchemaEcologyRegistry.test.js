import test from 'node:test';
import assert from 'node:assert/strict';

import { listCanonicalPopulations } from '../js/text/data/ecologyRegistry.js';
import { createInitialState } from '../js/text/gameState.js';
import { createAccountWithPassword, decodePayload, encodePayload, loadCharacter, saveGame } from '../js/text/save.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { getPopulationAvailability } from '../js/text/systems/ecologyEngine.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function stateWithPopulationRecord() {
    const state = createInitialState();
    const population = listCanonicalPopulations()[0];
    assert.ok(population);
    const availability = getPopulationAvailability(state, population.id);
    assert.ok(availability);
    return { state, populationId: population.id };
}

function installAccount(name) {
    globalThis.localStorage = new MemoryStorage();
    assert.equal(createAccountWithPassword(name, 'pwd', { persistentLogin: true }).ok, true);
}

test('current schema accepts a non-empty persisted ecology registry', () => {
    const { state, populationId } = stateWithPopulationRecord();
    assert.ok(state.ecology.populations[populationId]);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects malformed ecology child registries and records', () => {
    const { state, populationId } = stateWithPopulationRecord();
    state.ecology.populations[populationId].availableUnits = -1;
    state.ecology.populations['unknown-population'] = {
        id: 'mismatched-id',
        availableUnits: 1,
        lastUpdatedAtWorldSeconds: -1,
    };
    delete state.ecology.gatheringSources;

    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes(`${populationId}.availableUnits must be a non-negative integer`)));
    assert.ok(issues.some((issue) => issue.includes('unknown-population references unknown definition')));
    assert.ok(issues.some((issue) => issue.includes('unknown-population.id must match its key')));
    assert.ok(issues.some((issue) => issue.includes('unknown-population.lastUpdatedAtWorldSeconds must be a non-negative integer')));
    assert.ok(issues.some((issue) => issue.includes('ecology.gatheringSources must be an object')));
});

test('non-empty ecology state survives current save and load', () => {
    installAccount('Ecology Registry');
    const { state, populationId } = stateWithPopulationRecord();
    state.player.identity.name = 'Ecologykeeper';
    const before = structuredClone(state.ecology.populations[populationId]);
    assert.equal(saveGame(state), true);

    const loaded = loadCharacter('Ecologykeeper');
    assert.ok(loaded);
    assert.deepEqual(loaded.ecology.populations[populationId], before);
    assert.deepEqual(validateCurrentGameStateStructure(loaded, { requireMeta: true }), []);
});

test('load rejects a malformed current ecology registry without repairing it', () => {
    installAccount('Strict Ecology Registry');
    const { state } = stateWithPopulationRecord();
    state.player.identity.name = 'Ecologywarden';
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    malformed.ecology.version = 99;
    delete malformed.ecology.gatheringSources;
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Ecologywarden'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.ecology.version, 99);
    assert.equal(Object.hasOwn(unchanged.ecology, 'gatheringSources'), false);
});
