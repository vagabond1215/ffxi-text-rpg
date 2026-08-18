import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { createAccountWithPassword, decodePayload, encodePayload, loadCharacter, saveGame } from '../js/text/save.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { startWorkTask } from '../js/text/systems/workTaskEngine.js';

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

function stateWithActiveWork() {
    const state = createInitialState();
    const started = startWorkTask(state, {
        kind: 'fixture',
        label: 'Strict work fixture',
        channel: 'work:strict-fixture',
        durationSeconds: 60,
        data: { purpose: 'persistence-proof' },
    });
    assert.equal(started.ok, true);
    return { state, work: started.data.work, task: started.data.task };
}

test('current schema keeps work optional when no work registry has been constructed', () => {
    const state = createInitialState();
    delete state.work;

    assert.equal(Object.hasOwn(state, 'work'), false);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects a malformed work value when the optional registry is persisted', () => {
    const state = createInitialState();
    state.work = [];

    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('work must be a persisted object when present')));
});

test('current schema validates a persisted work registry and its stable sequence contract', () => {
    const { state } = stateWithActiveWork();
    state.work.version = 99;
    state.work.nextSequence = 1;
    state.work.records[0].status = 'unknown';

    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('work.version must be 1')));
    assert.ok(issues.some((issue) => issue.includes('work.nextSequence must be greater than stored work sequences')));
    assert.ok(issues.some((issue) => issue.includes('work.records[0].status is invalid')));
});

test('active work survives current save and load with the same work and task identity', () => {
    installAccount('Work Registry');
    const { state, work, task } = stateWithActiveWork();
    state.player.identity.name = 'Workkeeper';
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
    assert.equal(saveGame(state), true);

    const loaded = loadCharacter('Workkeeper');
    assert.ok(loaded);
    assert.equal(loaded.work.records[0].id, work.id);
    assert.equal(loaded.work.records[0].taskId, task.id);
    assert.equal(loaded.tasks.records.some((record) => record.id === task.id), true);
    assert.deepEqual(validateCurrentGameStateStructure(loaded, { requireMeta: true }), []);
});

test('load rejects a malformed persisted work value without replacing it with an empty registry', () => {
    installAccount('Strict Work Registry');
    const { state } = stateWithActiveWork();
    state.player.identity.name = 'Registrykeeper';
    assert.equal(saveGame(state), true);
    corruptStoredCharacter('Registrykeeper', (stored) => {
        stored.work = [];
    });

    assert.equal(loadCharacter('Registrykeeper'), null);
    const registry = decodePayload(globalThis.localStorage.getItem('hearthHorizonAccounts'));
    const unchanged = decodePayload(registry.accounts[0].characters[0].encodedState);
    assert.deepEqual(unchanged.work, []);
});
