import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { createAccountWithPassword, decodePayload, encodePayload, loadCharacter, saveGame } from '../js/text/save.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { emitSemanticEvent } from '../js/text/systems/semanticEventEngine.js';

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

function stateWithEvents() {
    const state = createInitialState();
    emitSemanticEvent(state, 'fixture.started', { targetId: 'alpha' }, { source: 'strict-event-test' });
    emitSemanticEvent(state, 'fixture.completed', { targetId: 'alpha' }, { source: 'strict-event-test' });
    return state;
}

test('current schema accepts non-empty persisted semantic event history', () => {
    const state = stateWithEvents();

    assert.equal(state.events.records.length, 2);
    assert.equal(state.events.nextSequence, 3);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects malformed semantic event sequence ordering and duplicate identity', () => {
    const state = stateWithEvents();
    state.events.records.push(structuredClone(state.events.records[1]));
    state.events.nextSequence = 2;

    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('duplicates event id evt-000002')));
    assert.ok(issues.some((issue) => issue.includes('events.records must be ordered by increasing sequence')));
    assert.ok(issues.some((issue) => issue.includes('events.nextSequence must be greater than all stored event sequences')));
});

test('current schema rejects malformed semantic event records before normalization', () => {
    const state = stateWithEvents();
    state.events.records[0] = { ...structuredClone(state.events.records[0]), type: 'INVALID TYPE' };
    state.events.records[1] = { ...structuredClone(state.events.records[1]), data: [] };

    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('events.records[0] is not a valid semantic event')));
    assert.ok(issues.some((issue) => issue.includes('events.records[1] is not a valid semantic event')));
});

test('non-empty semantic event state survives current save and load', () => {
    installAccount('Semantic Event Registry');
    const state = stateWithEvents();
    state.player.identity.name = 'Eventkeeper';
    const expected = structuredClone(state.events);
    assert.equal(saveGame(state), true);

    const loaded = loadCharacter('Eventkeeper');
    assert.ok(loaded);
    assert.deepEqual(loaded.events, expected);
    assert.deepEqual(validateCurrentGameStateStructure(loaded, { requireMeta: true }), []);
});

test('load rejects malformed current semantic event sequence without repairing it', () => {
    installAccount('Strict Event Sequence');
    const state = stateWithEvents();
    state.player.identity.name = 'Sequencekeeper';
    assert.equal(saveGame(state), true);
    corruptStoredCharacter('Sequencekeeper', (stored) => {
        stored.events.nextSequence = 0;
    });

    assert.equal(loadCharacter('Sequencekeeper'), null);
    const registry = decodePayload(globalThis.localStorage.getItem('hearthHorizonAccounts'));
    const unchanged = decodePayload(registry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.events.nextSequence, 0);
});

test('load rejects malformed current semantic event records without replacing history', () => {
    installAccount('Strict Event Records');
    const state = stateWithEvents();
    state.player.identity.name = 'Historykeeper';
    assert.equal(saveGame(state), true);
    corruptStoredCharacter('Historykeeper', (stored) => {
        stored.events.records = 'corrupt';
    });

    assert.equal(loadCharacter('Historykeeper'), null);
    const registry = decodePayload(globalThis.localStorage.getItem('hearthHorizonAccounts'));
    const unchanged = decodePayload(registry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.events.records, 'corrupt');
});
