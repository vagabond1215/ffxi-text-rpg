import test from 'node:test';
import assert from 'node:assert/strict';

import { listCapabilities } from '../js/text/data/capabilities.js';
import { createInitialState } from '../js/text/gameState.js';
import { createAccountWithPassword, decodePayload, encodePayload, loadCharacter, saveGame } from '../js/text/save.js';
import { grantCapability } from '../js/text/systems/capabilityEngine.js';
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

function stateWithKnownCapability() {
    const state = createInitialState();
    const capability = listCapabilities()[0];
    assert.ok(capability);
    const granted = grantCapability(state.player, capability.id, {
        source: 'grant',
        worldSeconds: state.worldTime.totalSeconds,
    });
    assert.equal(granted.ok, true);
    return { state, capabilityId: capability.id };
}

test('current schema accepts a non-empty persisted capability registry', () => {
    const { state, capabilityId } = stateWithKnownCapability();
    assert.equal(state.player.progression.capabilities.known[capabilityId].capabilityId, capabilityId);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects malformed capability authority before ensure-state reset', () => {
    const { state, capabilityId } = stateWithKnownCapability();
    state.player.progression.capabilities.version = 99;
    state.player.progression.capabilities.known[capabilityId].source = 'unknown-source';
    state.player.progression.capabilities.known[capabilityId].learnedAtWorldSeconds = -1;
    state.player.progression.capabilities.known['missing-capability'] = {
        capabilityId: 'different-id',
        source: 'grant',
        learnedAtWorldSeconds: 0,
        learnedFromDisciplineId: null,
    };

    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('player.progression.capabilities.version must be 1')));
    assert.ok(issues.some((issue) => issue.includes(`player.progression.capabilities.known.${capabilityId}.source is unknown`)));
    assert.ok(issues.some((issue) => issue.includes(`player.progression.capabilities.known.${capabilityId}.learnedAtWorldSeconds`)));
    assert.ok(issues.some((issue) => issue.includes('references unknown capability missing-capability')));
    assert.ok(issues.some((issue) => issue.includes('missing-capability.capabilityId must match its key')));
});

test('non-empty capability state survives current save and load', () => {
    installAccount('Capability Registry');
    const { state, capabilityId } = stateWithKnownCapability();
    state.player.identity.name = 'Lorekeeper';
    const expected = structuredClone(state.player.progression.capabilities.known[capabilityId]);
    assert.equal(saveGame(state), true);

    const loaded = loadCharacter('Lorekeeper');
    assert.ok(loaded);
    assert.deepEqual(loaded.player.progression.capabilities.known[capabilityId], expected);
    assert.deepEqual(validateCurrentGameStateStructure(loaded, { requireMeta: true }), []);
});

test('load rejects a malformed current capability version without repairing it', () => {
    installAccount('Strict Capability Version');
    const { state } = stateWithKnownCapability();
    state.player.identity.name = 'Versionkeeper';
    assert.equal(saveGame(state), true);
    corruptStoredCharacter('Versionkeeper', (stored) => {
        stored.player.progression.capabilities.version = 99;
    });

    assert.equal(loadCharacter('Versionkeeper'), null);
    const registry = decodePayload(globalThis.localStorage.getItem('hearthHorizonAccounts'));
    const unchanged = decodePayload(registry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.player.progression.capabilities.version, 99);
});

test('load rejects an incomplete current capability registry without backfilling known', () => {
    installAccount('Strict Capability Known');
    const { state } = stateWithKnownCapability();
    state.player.identity.name = 'Knownkeeper';
    assert.equal(saveGame(state), true);
    corruptStoredCharacter('Knownkeeper', (stored) => {
        delete stored.player.progression.capabilities.known;
    });

    assert.equal(loadCharacter('Knownkeeper'), null);
    const registry = decodePayload(globalThis.localStorage.getItem('hearthHorizonAccounts'));
    const unchanged = decodePayload(registry.accounts[0].characters[0].encodedState);
    assert.equal(Object.hasOwn(unchanged.player.progression.capabilities, 'known'), false);
});
