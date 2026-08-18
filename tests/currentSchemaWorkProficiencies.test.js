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
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { gainWorkProficiency } from '../js/text/systems/workProficiencyEngine.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() {
    globalThis.localStorage = new MemoryStorage();
}

test('current schema keeps work proficiencies optional until character mastery exists', () => {
    const state = createInitialState();

    assert.equal(Object.hasOwn(state.player.progression, 'workProficiencies'), false);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema validates non-empty persisted work proficiency authority', () => {
    const state = createInitialState();
    const gained = gainWorkProficiency(state, 'mining', 7);

    assert.equal(gained.ok, true);
    assert.equal(state.player.progression.workProficiencies.version, 1);
    assert.equal(state.player.progression.workProficiencies.values.mining, 7);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects malformed persisted work proficiency state without making it required', () => {
    const nonObject = createInitialState();
    nonObject.player.progression.workProficiencies = null;
    assert.ok(validateCurrentGameStateStructure(nonObject).some((issue) => issue.includes('workProficiencies must be a persisted object when present')));

    const missingValues = createInitialState();
    missingValues.player.progression.workProficiencies = { version: 1 };
    assert.ok(validateCurrentGameStateStructure(missingValues).some((issue) => issue.includes('workProficiencies.values must be an object')));

    const malformedValue = createInitialState();
    malformedValue.player.progression.workProficiencies = {
        version: 1,
        values: { impossibleMastery: 3, mining: -1 },
    };
    const issues = validateCurrentGameStateStructure(malformedValue);
    assert.ok(issues.some((issue) => issue.includes('impossibleMastery is unknown')));
    assert.ok(issues.some((issue) => issue.includes('mining must be a non-negative integer')));
});

test('non-empty work proficiency mastery survives real current save and load', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Proficiency Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Craftkeeper';
    gainWorkProficiency(state, 'mining', 7);
    gainWorkProficiency(state, 'metalworking', 4);
    const expected = structuredClone(state.player.progression.workProficiencies);

    assert.equal(saveGame(state), true);
    const loaded = loadCharacter('Craftkeeper');

    assert.ok(loaded);
    assert.deepEqual(loaded.player.progression.workProficiencies, expected);
});

test('load rejects malformed persisted work proficiency state without backfilling it', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Strict Proficiency Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Strictcraft';
    gainWorkProficiency(state, 'mining', 2);
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    malformed.player.progression.workProficiencies = { version: 1 };
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Strictcraft'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.deepEqual(unchanged.player.progression.workProficiencies, { version: 1 });
    assert.equal(Object.hasOwn(unchanged.player.progression.workProficiencies, 'values'), false);
});
