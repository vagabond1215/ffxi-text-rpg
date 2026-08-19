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
import { calculateCombatProfile } from '../js/text/systems/statEngine.js';
import { applyStatus } from '../js/text/systems/statusEngine.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() { globalThis.localStorage = new MemoryStorage(); }

function applyWard(state) {
    const before = calculateCombatProfile(state.player).derived.defense;
    applyStatus(state.player, {
        id: 'status-test-ward',
        name: 'Test Ward',
        category: 'buff',
        durationSeconds: 30,
        stackGroup: 'test-ward',
        stackRule: 'replace',
        modifiers: { defense: 4 },
        flags: { ward: true },
    }, { nowWorldSeconds: state.worldTime.totalSeconds });
    return before;
}

test('status creation canonicalizes flat authored modifiers into runtime stat authority', () => {
    const state = createInitialState();
    const before = applyWard(state);
    const status = state.player.statuses[0];

    assert.equal(status.modifiers.derived.defense, 4);
    assert.equal(Object.hasOwn(status.modifiers, 'defense'), false);
    assert.equal(calculateCombatProfile(state.player).derived.defense, before + 4);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects malformed timing duplicate stack groups and legacy flat status modifiers', () => {
    const flat = createInitialState();
    applyWard(flat);
    flat.player.statuses[0].modifiers = { defense: 4 };
    assert.ok(validateCurrentGameStateStructure(flat).some((issue) => issue.includes('modifiers.defense is not a canonical modifier category')));

    const timing = createInitialState();
    applyWard(timing);
    timing.player.statuses[0].expiresAtWorldSeconds += 1;
    assert.ok(validateCurrentGameStateStructure(timing).some((issue) => issue.includes('expiresAtWorldSeconds must equal')));

    const duplicate = createInitialState();
    applyWard(duplicate);
    duplicate.player.statuses.push(structuredClone(duplicate.player.statuses[0]));
    assert.ok(validateCurrentGameStateStructure(duplicate).some((issue) => issue.includes('stackGroup duplicates')));
});

test('canonical non-empty player status survives real current save and load', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Status Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = createInitialState();
    state.player.identity.name = 'Wardkeeper';
    applyWard(state);
    const expected = structuredClone(state.player.statuses);

    assert.equal(saveGame(state), true);
    const loaded = loadCharacter('Wardkeeper');
    assert.ok(loaded);
    assert.deepEqual(loaded.player.statuses, expected);
    assert.equal(loaded.player.statuses[0].modifiers.derived.defense, 4);
});

test('load rejects malformed persisted status state without canonicalizing it', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Strict Status Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = createInitialState();
    state.player.identity.name = 'Badstatus';
    applyWard(state);
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    malformed.player.statuses[0].modifiers = { defense: 999 };
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Badstatus'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.player.statuses[0].modifiers.defense, 999);
});
