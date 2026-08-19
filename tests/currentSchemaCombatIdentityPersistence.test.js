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
import { startEncounter } from '../js/text/systems/combatActionEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() { globalThis.localStorage = new MemoryStorage(); }

function createEncounterState(name = 'Sequence Keeper') {
    const state = createInitialState();
    state.player.identity.name = name;
    const result = startEncounter(state, 'Brush Hare', { rng: () => 0 });
    assert.equal(result.ok, true);
    assert.equal(state.combatSequence, 1);
    assert.equal(state.activeBattle.id, 'battle-000001');
    return state;
}

test('current schema ties persisted active battle id to combat sequence allocator', () => {
    const initial = createInitialState();
    assert.equal(initial.combatSequence, 0);
    assert.equal(initial.activeBattle, null);
    assert.deepEqual(validateCurrentGameStateStructure(initial), []);

    const active = createEncounterState();
    assert.deepEqual(validateCurrentGameStateStructure(active), []);
});

test('current schema rejects forged combat sequence or battle identity before revival', () => {
    const lowSequence = createEncounterState();
    lowSequence.combatSequence = 0;
    assert.ok(validateCurrentGameStateStructure(lowSequence).some((issue) => issue.includes('combatSequence must be positive when activeBattle is persisted')));
    assert.ok(validateCurrentGameStateStructure(lowSequence).some((issue) => issue.includes('activeBattle.id must match combatSequence as battle-000000')));

    const highSequence = createEncounterState();
    highSequence.combatSequence = 7;
    assert.ok(validateCurrentGameStateStructure(highSequence).some((issue) => issue.includes('activeBattle.id must match combatSequence as battle-000007')));

    const forgedId = createEncounterState();
    forgedId.activeBattle.id = 'battle-000099';
    assert.ok(validateCurrentGameStateStructure(forgedId).some((issue) => issue.includes('activeBattle.id must match combatSequence as battle-000001')));
});

test('combat sequence and active battle identity survive real save load unchanged', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Combat Identity Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = createEncounterState('Sequence Keeper');
    assert.equal(saveGame(state), true);

    const loaded = loadCharacter('Sequence Keeper');
    assert.ok(loaded);
    assert.equal(loaded.combatSequence, 1);
    assert.equal(loaded.activeBattle.id, 'battle-000001');
    assert.deepEqual(validateCurrentGameStateStructure(loaded), []);
});

test('load rejects forged persisted combat sequence without repairing battle identity', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Strict Combat Identity Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = createEncounterState('Strict Sequence Keeper');
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    malformed.combatSequence = 0;
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Strict Sequence Keeper'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.combatSequence, 0);
    assert.equal(unchanged.activeBattle.id, 'battle-000001');
});

test('normal encounter allocation advances past the persisted latest battle id', () => {
    const state = createEncounterState();
    state.activeBattle.phase = 'victory';
    const second = startEncounter(state, 'Brush Hare', { rng: () => 0 });
    assert.equal(second.ok, true);
    assert.equal(state.combatSequence, 2);
    assert.equal(state.activeBattle.id, 'battle-000002');
});
