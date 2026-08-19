import test from 'node:test';
import assert from 'node:assert/strict';

import { EQUIPMENT_CATALOG } from '../js/text/data/equipmentCatalog.js';
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

test('active battle player binds to root player live combat authority', () => {
    const state = createBattleState();
    const player = battlePlayer(state);

    assert.equal(player.id, state.player.id);
    assert.deepEqual(player.resources, state.player.resources);
    assert.deepEqual(player.statuses, state.player.statuses);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects active battle player identity resource and combat-driving splits', () => {
    const idSplit = createBattleState();
    battlePlayer(idSplit).id = 'different-player';
    assert.ok(validateCurrentGameStateStructure(idSplit).some((issue) => issue.includes('activeBattle player id must match root player id')));

    const resources = createBattleState();
    resources.player.resources = { ...resources.player.resources, hp: Math.max(0, resources.player.resources.hp - 1) };
    assert.ok(validateCurrentGameStateStructure(resources).some((issue) => issue.includes('activeBattle player resources must match root player resources')));

    const profile = createBattleState();
    profile.player.equipment = {
        ...profile.player.equipment,
        mainHand: structuredClone(EQUIPMENT_CATALOG['bronze-sword']),
    };
    assert.ok(validateCurrentGameStateStructure(profile).some((issue) => issue.includes('activeBattle active player combat profile must match root player combat-driving authority')));
});

test('ordinary combat keeps active root and battle player links coherent despite root-owned skill gain', () => {
    const state = createBattleState();
    assert.match(performPlayerAttack(state), /Battle:/);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('terminal battle remains historical while root resources may change afterward', () => {
    const state = createBattleState();
    const enemy = state.activeBattle.combatants.find((entry) => entry.type === 'enemy');
    enemy.resources.hp = 0;
    enemy.battle.defeated = true;
    state.activeBattle.phase = 'victory';
    state.player.resources = { ...state.player.resources, hp: Math.max(0, state.player.resources.hp - 1) };

    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('load rejects an active battle/root player id split without repairing either authority', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Battle Link Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = createBattleState();
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    malformed.player.id = 'split-root-player';
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Linkguard'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.player.id, 'split-root-player');
    assert.equal(unchanged.activeBattle.combatants.find((entry) => entry.type === 'player').id, 'player-1');
});
