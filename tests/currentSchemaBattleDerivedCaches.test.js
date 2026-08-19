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
import { createCharacterStatState } from '../js/text/systems/characterStatEngine.js';
import { calculateCombatProfile } from '../js/text/systems/statEngine.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() { globalThis.localStorage = new MemoryStorage(); }

function createBattleState() {
    const state = createInitialState();
    state.player.identity.name = 'Cacheguard';
    const result = startEncounter(state, 'Brush Hare', { rng: () => 0 });
    assert.equal(result.ok, true);
    return state;
}

function playerCombatant(state) {
    return state.activeBattle.combatants.find((entry) => entry.type === 'player');
}

function enemyCombatant(state) {
    return state.activeBattle.combatants.find((entry) => entry.type === 'enemy');
}

function expectedCombat(combatant) {
    const clone = structuredClone(combatant);
    delete clone.combat;
    if (clone.type === 'player') clone.statState = createCharacterStatState(clone);
    return calculateCombatProfile(clone);
}

test('current schema accepts deterministic combat and player stat caches inside an active battle', () => {
    const state = createBattleState();
    const player = playerCombatant(state);
    const enemy = enemyCombatant(state);

    assert.deepEqual(player.statState, createCharacterStatState(player));
    assert.deepEqual(player.combat, expectedCombat(player));
    assert.deepEqual(enemy.combat, expectedCombat(enemy));
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects forged battle combat caches and player stat cache', () => {
    const forgedPlayerCombat = createBattleState();
    playerCombatant(forgedPlayerCombat).combat.derived.attack += 5000;
    assert.ok(validateCurrentGameStateStructure(forgedPlayerCombat).some((issue) => issue.includes('.combat must match the deterministic combat cache')));

    const forgedEnemyCombat = createBattleState();
    enemyCombatant(forgedEnemyCombat).combat.derived.evasion += 5000;
    assert.ok(validateCurrentGameStateStructure(forgedEnemyCombat).some((issue) => issue.includes('.combat must match the deterministic combat cache')));

    const forgedStatState = createBattleState();
    playerCombatant(forgedStatState).statState.base.attributes.str += 5000;
    assert.ok(validateCurrentGameStateStructure(forgedStatState).some((issue) => issue.includes('.statState must match the deterministic player stat cache')));
});

test('deterministic battle caches survive real save load and resumed combat', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Battle Cache Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = createBattleState();
    const expectedPlayerCombat = structuredClone(playerCombatant(state).combat);
    const expectedPlayerStatState = structuredClone(playerCombatant(state).statState);
    const expectedEnemyCombat = structuredClone(enemyCombatant(state).combat);

    assert.equal(saveGame(state), true);
    const loaded = loadCharacter('Cacheguard');

    assert.ok(loaded);
    assert.deepEqual(playerCombatant(loaded).combat, expectedPlayerCombat);
    assert.deepEqual(playerCombatant(loaded).statState, expectedPlayerStatState);
    assert.deepEqual(enemyCombatant(loaded).combat, expectedEnemyCombat);
    const before = loaded.activeBattle.contract.actionSequence;
    assert.match(performPlayerAttack(loaded), /Battle:/);
    assert.ok(loaded.activeBattle.contract.actionSequence > before);
});

test('load rejects a forged persisted battle cache without normalizing or overwriting it', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Strict Battle Cache Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = createBattleState();
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    const player = malformed.activeBattle.combatants.find((entry) => entry.type === 'player');
    player.combat.derived.attack = 999999;
    player.statState.base.resources.maxHp = 999999;
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Cacheguard'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    const unchangedPlayer = unchanged.activeBattle.combatants.find((entry) => entry.type === 'player');
    assert.equal(unchangedPlayer.combat.derived.attack, 999999);
    assert.equal(unchangedPlayer.statState.base.resources.maxHp, 999999);
});
