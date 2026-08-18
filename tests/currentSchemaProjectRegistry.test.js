import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { createAccountWithPassword, decodePayload, encodePayload, loadCharacter, saveGame } from '../js/text/save.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { createProject } from '../js/text/systems/projectEngine.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function withProject() {
    const state = createInitialState();
    const created = createProject(state, {
        kind: 'schema-project',
        label: 'Schema Project',
        laborSeconds: 60,
        materials: [{ itemId: 'oak-board', name: 'Oak Board', quantity: 2 }],
    });
    assert.equal(created.ok, true);
    return state;
}

test('current schema accepts a valid persisted project registry', () => {
    const state = withProject();
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects malformed project registry version sequence and material progress', () => {
    const state = withProject();
    state.projects.version = 99;
    state.projects.nextSequence = 1;
    state.projects.records[0].materials[0].quantityContributed = 3;

    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('projects.version must be 1')));
    assert.ok(issues.some((issue) => issue.includes('projects.nextSequence must be greater than stored project sequences')));
    assert.ok(issues.some((issue) => issue.includes('quantityContributed exceeds requirement')));
});

test('current schema rejects duplicate persisted project ids', () => {
    const state = withProject();
    state.projects.records.push(structuredClone(state.projects.records[0]));
    state.projects.nextSequence = 3;
    assert.ok(validateCurrentGameStateStructure(state).some((issue) => issue.includes('duplicates project-000001')));
});

test('valid project registry survives current save and load', () => {
    globalThis.localStorage = new MemoryStorage();
    assert.equal(createAccountWithPassword('Project Registry', 'pwd', { persistentLogin: true }).ok, true);
    const state = withProject();
    state.player.identity.name = 'Projectkeeper';
    assert.equal(saveGame(state), true);

    const loaded = loadCharacter('Projectkeeper');
    assert.ok(loaded);
    assert.equal(loaded.projects.version, 1);
    assert.equal(loaded.projects.nextSequence, 2);
    assert.equal(loaded.projects.records.length, 1);
    assert.equal(loaded.projects.records[0].id, 'project-000001');
});

test('load rejects a malformed current project registry without repairing it', () => {
    globalThis.localStorage = new MemoryStorage();
    assert.equal(createAccountWithPassword('Strict Project Registry', 'pwd', { persistentLogin: true }).ok, true);
    const state = withProject();
    state.player.identity.name = 'Projectwarden';
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    malformed.projects.version = 99;
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Projectwarden'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.projects.version, 99);
    assert.equal(unchanged.projects.records.length, 1);
});
