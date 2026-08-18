import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { createAccountWithPassword, decodePayload, encodePayload, loadCharacter, saveGame } from '../js/text/save.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { applyNpcRelationshipChange } from '../js/text/systems/relationshipEngine.js';

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

test('current schema accepts valid commitment and relationship registries', () => {
    const state = createInitialState();
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects inconsistent commitment and relationship records', () => {
    const state = createInitialState();
    state.commitments.records['unknown-commitment'] = {
        id: 'unknown-commitment',
        giverNpcId: 'npc-missing',
        status: 'active',
        acceptedAtWorldSeconds: 0,
        resolvedAtWorldSeconds: null,
        resolvedDay: null,
        rewardClaimed: true,
        followUpAvailableDay: null,
        followUpSeenAtWorldSeconds: null,
    };
    const npcId = state.npcs[0].id;
    state.relationships.npcs[npcId] = {
        npcId,
        dimensions: { familiarity: 0, respect: 0.5, trust: 0, obligation: 0 },
        lastInteractionWorldSeconds: -1,
    };

    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('references unknown commitment')));
    assert.ok(issues.some((issue) => issue.includes('rewardClaimed must be false while active')));
    assert.ok(issues.some((issue) => issue.includes('.dimensions.respect must be an integer')));
    assert.ok(issues.some((issue) => issue.includes('.lastInteractionWorldSeconds must be null or a non-negative integer')));
});

test('non-empty relationship continuity survives current save and load', () => {
    installAccount('Continuity Registry');
    const state = createInitialState();
    state.player.identity.name = 'Continuitykeeper';
    const npcId = state.npcs[0].id;
    const changed = applyNpcRelationshipChange(state, npcId, { familiarity: 1, trust: 2 }, { reason: 'continuity registry proof' });
    assert.equal(changed.ok, true);
    assert.equal(saveGame(state), true);

    const loaded = loadCharacter('Continuitykeeper');
    assert.ok(loaded);
    assert.equal(loaded.relationships.npcs[npcId].dimensions.familiarity, 1);
    assert.equal(loaded.relationships.npcs[npcId].dimensions.trust, 2);
    assert.deepEqual(validateCurrentGameStateStructure(loaded, { requireMeta: true }), []);
});

test('load rejects a malformed current commitment registry without repairing it', () => {
    installAccount('Strict Commitment Registry');
    const state = createInitialState();
    state.player.identity.name = 'Commitmentkeeper';
    assert.equal(saveGame(state), true);
    corruptStoredCharacter('Commitmentkeeper', (stored) => { stored.commitments.version = 99; });

    assert.equal(loadCharacter('Commitmentkeeper'), null);
    const registry = decodePayload(globalThis.localStorage.getItem('hearthHorizonAccounts'));
    const unchanged = decodePayload(registry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.commitments.version, 99);
});

test('load rejects a malformed current relationship registry without repairing it', () => {
    installAccount('Strict Relationship Registry');
    const state = createInitialState();
    state.player.identity.name = 'Relationshipkeeper';
    assert.equal(saveGame(state), true);
    corruptStoredCharacter('Relationshipkeeper', (stored) => { stored.relationships.version = 99; });

    assert.equal(loadCharacter('Relationshipkeeper'), null);
    const registry = decodePayload(globalThis.localStorage.getItem('hearthHorizonAccounts'));
    const unchanged = decodePayload(registry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.relationships.version, 99);
});
