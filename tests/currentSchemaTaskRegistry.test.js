import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { createAccountWithPassword, decodePayload, encodePayload, loadCharacter, saveGame } from '../js/text/save.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { startTimedTask } from '../js/text/systems/timedTaskEngine.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function withTask() {
    const state = createInitialState();
    const started = startTimedTask(state, { kind: 'schema.task', label: 'Schema task', durationSeconds: 30 });
    assert.equal(started.ok, true);
    return state;
}

test('current schema rejects a mismatched timed-task registry version', () => {
    const state = withTask();
    state.tasks.version += 1;
    assert.ok(validateCurrentGameStateStructure(state).some((issue) => issue.includes('tasks.version must be 1')));
});

test('current schema rejects duplicate task ids and invalid statuses', () => {
    const state = withTask();
    const duplicate = structuredClone(state.tasks.records[0]);
    duplicate.status = 'forgotten';
    state.tasks.records.push(duplicate);
    state.tasks.nextSequence += 1;
    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('duplicates task-000001')));
    assert.ok(issues.some((issue) => issue.includes('.status is invalid')));
});

test('current schema rejects a task sequence counter that could reuse a stored id', () => {
    const state = withTask();
    state.tasks.nextSequence = 1;
    assert.ok(validateCurrentGameStateStructure(state).some((issue) => issue.includes('nextSequence must be greater than stored task sequences')));
});

test('load rejects a malformed current timed-task registry without repairing it', () => {
    globalThis.localStorage = new MemoryStorage();
    assert.equal(createAccountWithPassword('Strict Task Registry', 'pwd', { persistentLogin: true }).ok, true);
    const state = withTask();
    state.player.identity.name = 'Taskkeeper';
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    malformed.tasks.version = 99;
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Taskkeeper'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.tasks.version, 99);
    assert.equal(unchanged.tasks.records.length, 1);
});
