import test from 'node:test';
import assert from 'node:assert/strict';

import { listAbilities } from '../js/text/data/abilities.js';
import { listCompanionDefinitions } from '../js/text/data/companions.js';
import { createInitialState } from '../js/text/gameState.js';
import { createAccountWithPassword, decodePayload, encodePayload, loadCharacter, saveGame } from '../js/text/save.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { recruitCompanion } from '../js/text/systems/partyEngine.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function stateWithCharacterRuntime() {
    const state = createInitialState();
    const companion = listCompanionDefinitions()[0];
    const ability = listAbilities()[0];
    assert.ok(companion);
    assert.ok(ability);
    const recruited = recruitCompanion(state, companion.id, { ignoreRequirements: true });
    assert.equal(recruited.ok, true);
    state.abilities.cooldowns[ability.id] = state.worldTime.totalSeconds + 60;
    return { state, companionId: companion.id, abilityId: ability.id };
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

test('current schema accepts non-empty party and ability runtime state', () => {
    const { state, companionId, abilityId } = stateWithCharacterRuntime();
    assert.ok(state.party.companions[companionId]);
    assert.ok(state.party.activeCompanionIds.includes(companionId));
    assert.ok(state.abilities.cooldowns[abilityId] > state.worldTime.totalSeconds);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects malformed party authority before runtime normalization', () => {
    const state = createInitialState();
    state.party.version = 99;
    state.party.capacity = 0;
    state.party.activeCompanionIds = ['missing-companion', 'missing-companion'];

    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('party.version must be 1')));
    assert.ok(issues.some((issue) => issue.includes('party.capacity must be positive')));
    assert.ok(issues.some((issue) => issue.includes('party.activeCompanionIds contains duplicates')));
    assert.ok(issues.some((issue) => issue.includes('Active companion missing-companion is not recruited')));
});

test('current schema rejects malformed ability runtime before ensure-state reset can hide it', () => {
    const state = createInitialState();
    state.abilities.version = 99;
    state.abilities.cooldowns = { 'unknown-ability': -1 };
    state.abilities.active = 'invalid-active-record';

    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('abilities.version must be 1')));
    assert.ok(issues.some((issue) => issue.includes('abilities.cooldowns references unknown ability unknown-ability')));
    assert.ok(issues.some((issue) => issue.includes('abilities.cooldowns.unknown-ability must be a non-negative integer')));
    assert.ok(issues.some((issue) => issue.includes('abilities.active must be null or an object')));
});

test('non-empty party and ability runtime state survive current save and load', () => {
    installAccount('Character Runtime Registry');
    const { state, companionId, abilityId } = stateWithCharacterRuntime();
    state.player.identity.name = 'Runtimekeeper';
    const readyAt = state.abilities.cooldowns[abilityId];
    assert.equal(saveGame(state), true);

    const loaded = loadCharacter('Runtimekeeper');
    assert.ok(loaded);
    assert.ok(loaded.party.activeCompanionIds.includes(companionId));
    assert.equal(loaded.party.companions[companionId].id, companionId);
    assert.equal(loaded.abilities.cooldowns[abilityId], readyAt);
    assert.deepEqual(validateCurrentGameStateStructure(loaded, { requireMeta: true }), []);
});

test('load rejects malformed current party state without repairing it', () => {
    installAccount('Strict Party Registry');
    const { state } = stateWithCharacterRuntime();
    state.player.identity.name = 'Partywarden';
    assert.equal(saveGame(state), true);
    corruptStoredCharacter('Partywarden', (stored) => {
        stored.party.version = 99;
        stored.party.capacity = 0;
    });

    assert.equal(loadCharacter('Partywarden'), null);
    const registry = decodePayload(globalThis.localStorage.getItem('hearthHorizonAccounts'));
    const unchanged = decodePayload(registry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.party.version, 99);
    assert.equal(unchanged.party.capacity, 0);
});

test('load rejects malformed current ability runtime without resetting it', () => {
    installAccount('Strict Ability Registry');
    const { state } = stateWithCharacterRuntime();
    state.player.identity.name = 'Abilitywarden';
    assert.equal(saveGame(state), true);
    corruptStoredCharacter('Abilitywarden', (stored) => {
        stored.abilities.version = 99;
        stored.abilities.cooldowns = null;
    });

    assert.equal(loadCharacter('Abilitywarden'), null);
    const registry = decodePayload(globalThis.localStorage.getItem('hearthHorizonAccounts'));
    const unchanged = decodePayload(registry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.abilities.version, 99);
    assert.equal(unchanged.abilities.cooldowns, null);
});
