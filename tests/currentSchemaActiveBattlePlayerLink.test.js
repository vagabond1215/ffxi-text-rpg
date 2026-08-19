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
import { performPlayerAttack, startEncounter } from '../js/text/systems/combatActionEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() { globalThis.localStorage = new MemoryStorage(); }

function createBattleState() {
    const state = createInitialState();
    state.player.identity.name = 'Linkguard';
    assert.equal(startEncounter(state, 'Brush Hare', { rng: () => 0 }).ok, true);
    return state;
}

function battlePlayer(state) {
    return state.activeBattle.combatants.find((entry) => entry.type === 'player');
}

test('active battle player snapshot matches durable root combat-driving authority', () => {
    const state = createBattleState();
    const player = battlePlayer(state);

    assert.equal(player.id, state.player.id);
    assert.deepEqual(player.identity, state.player.identity);
    assert.deepEqual(player.jobs, state.player.jobs);
    assert.deepEqual(player.progression, state.player.progression);
    assert.deepEqual(player.equipment, state.player.equipment);
    assert.deepEqual(player.resources, state.player.resources);
    assert.deepEqual(player.statuses, state.player.statuses);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects battle player snapshots that disagree with root player authority', () => {
    const identity = createBattleState();
    battlePlayer(identity).identity.name = 'Someone Else';
    assert.ok(validateCurrentGameStateStructure(identity).some((issue) => issue.includes('activeBattle player identity must match root player identity')));

    const progression = createBattleState();
    battlePlayer(progression).progression.exp += 1;
    assert.ok(validateCurrentGameStateStructure(progression).some((issue) => issue.includes('activeBattle player progression must match root player progression')));

    const equipment = createBattleState();
    battlePlayer(equipment).equipment.mainHand = { id: 'phantom-blade', name: 'Phantom Blade', kind: 'equipment', quantity: 1, tags: ['weapon', 'sword'] };
    assert.ok(validateCurrentGameStateStructure(equipment).some((issue) => issue.includes('activeBattle player equipment must match root player equipment')));

    const resources = createBattleState();
    resources.player.resources.hp = Math.max(0, resources.player.resources.hp - 1);
    assert.ok(validateCurrentGameStateStructure(resources).some((issue) => issue.includes('activeBattle player resources must match root player resources')));
});

test('ordinary combat keeps root and battle player links coherent', () => {
    const state = createBattleState();
    assert.match(performPlayerAttack(state), /Battle:/);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('load rejects a battle/root player split without repairing either authority', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Battle Link Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = createBattleState();
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    malformed.activeBattle.combatants.find((entry) => entry.type === 'player').identity.name = 'Split Identity';
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Linkguard'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.player.identity.name, 'Linkguard');
    assert.equal(unchanged.activeBattle.combatants.find((entry) => entry.type === 'player').identity.name, 'Split Identity');
});
