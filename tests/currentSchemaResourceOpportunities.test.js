import test from 'node:test';
import assert from 'node:assert/strict';

import { createEnemy } from '../js/text/entities/entityFactory.js';
import { createInitialState } from '../js/text/gameState.js';
import { createAccountWithPassword, decodePayload, encodePayload, loadCharacter, saveGame } from '../js/text/save.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { createDefeatedEnemyResourceOpportunity } from '../js/text/systems/resourceOpportunityEngine.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function stateWithOpportunity() {
    const state = createInitialState();
    const enemy = createEnemy({
        id: 'enemy-resource-schema-hare',
        name: 'Resource Schema Hare',
        family: 'hare',
        ecosystem: 'beast',
        zoneId: 'west-elderwood',
        level: 1,
        lootTableId: 'starterBeast',
    });
    const created = createDefeatedEnemyResourceOpportunity(state, enemy, { battleId: 'resource-schema-battle' });
    assert.equal(created.ok, true);
    return state;
}

function installAccount(name) {
    globalThis.localStorage = new MemoryStorage();
    assert.equal(createAccountWithPassword(name, 'pwd', { persistentLogin: true }).ok, true);
}

test('current schema accepts a non-empty resource opportunity registry', () => {
    const state = stateWithOpportunity();
    assert.equal(state.resourceOpportunities.records.length, 1);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects malformed resource sequence status and outcome roll records', () => {
    const state = stateWithOpportunity();
    const opportunity = state.resourceOpportunities.records[0];
    state.resourceOpportunities.nextSequence = 1;
    opportunity.status = 'invented';
    opportunity.actions[0].outputRolls.push({ outputIndex: -1, roll: 2 });

    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('nextSequence must be greater than stored resource sequences')));
    assert.ok(issues.some((issue) => issue.includes('.status is invalid')));
    assert.ok(issues.some((issue) => issue.includes('.outputRolls[0] is invalid')));
});

test('current schema rejects duplicate persisted resource opportunity ids', () => {
    const state = stateWithOpportunity();
    state.resourceOpportunities.records.push(structuredClone(state.resourceOpportunities.records[0]));
    state.resourceOpportunities.nextSequence = 3;
    assert.ok(validateCurrentGameStateStructure(state).some((issue) => issue.includes('duplicates resource-000001')));
});

test('non-empty resource opportunities survive current save and load', () => {
    installAccount('Resource Registry');
    const state = stateWithOpportunity();
    state.player.identity.name = 'Resourcekeeper';
    const opportunityId = state.resourceOpportunities.records[0].id;
    assert.equal(saveGame(state), true);

    const loaded = loadCharacter('Resourcekeeper');
    assert.ok(loaded);
    assert.equal(loaded.resourceOpportunities.records.length, 1);
    assert.equal(loaded.resourceOpportunities.records[0].id, opportunityId);
    assert.deepEqual(validateCurrentGameStateStructure(loaded, { requireMeta: true }), []);
});

test('load rejects a malformed current resource opportunity registry without repairing it', () => {
    installAccount('Strict Resource Registry');
    const state = stateWithOpportunity();
    state.player.identity.name = 'Resourcewarden';
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    malformed.resourceOpportunities.version = 99;
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Resourcewarden'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.resourceOpportunities.version, 99);
    assert.equal(unchanged.resourceOpportunities.records.length, 1);
});
