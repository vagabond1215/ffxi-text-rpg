import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import {
    createAccountWithPassword,
    decodePayload,
    loadCharacter,
    saveGame,
} from '../js/text/save.js';
import { performPlayerAttack, startEncounter } from '../js/text/systems/combatActionEngine.js';
import { finalizeCombatState } from '../js/text/systems/combatTurnEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { equipItem } from '../js/text/systems/equipmentEngine.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { calculateCombatProfile } from '../js/text/systems/statEngine.js';
import { applyStatus } from '../js/text/systems/statusEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() { globalThis.localStorage = new MemoryStorage(); }

function preparePersistentCombatState() {
    const state = createInitialState();
    state.player.identity.name = 'Integrated';
    addItemToContainer(state.player.inventoryState, 'inventory', {
        id: 'bronze-sword', name: 'Bronze Sword', kind: 'equipment', quantity: 1, tags: ['weapon', 'sword', 'starter'],
    });
    assert.match(equipItem(state, 'Bronze Sword'), /Equipped Bronze Sword to mainHand/);
    state.player.resources = { hp: 17, mp: 3, tp: 444 };
    applyStatus(state.player, {
        id: 'status-integration-ward',
        name: 'Integration Ward',
        category: 'buff',
        durationSeconds: 30,
        stackGroup: 'integration-ward',
        stackRule: 'replace',
        modifiers: { defense: 4 },
        flags: { integration: true },
    }, { nowWorldSeconds: state.worldTime.totalSeconds });
    assert.equal(startEncounter(state, 'Brush Hare', { rng: () => 0 }).ok, true);
    return state;
}

test('combined player authority survives save load while derived root caches remain non-persisted', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Integration Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = preparePersistentCombatState();
    const expectedEquipment = structuredClone(state.player.equipment);
    const expectedResources = structuredClone(state.player.resources);
    const expectedStatuses = structuredClone(state.player.statuses);
    const expectedBattleId = state.activeBattle.id;

    assert.deepEqual(validateCurrentGameStateStructure(state), []);
    assert.equal(saveGame(state), true);

    const registry = decodePayload(globalThis.localStorage.getItem('hearthHorizonAccounts'));
    const encoded = decodePayload(registry.accounts[0].characters[0].encodedState);
    assert.equal(Object.hasOwn(encoded.player, 'combat'), false);
    assert.equal(Object.hasOwn(encoded.player, 'statState'), false);
    assert.deepEqual(encoded.player.equipment, expectedEquipment);
    assert.deepEqual(encoded.player.resources, expectedResources);
    assert.deepEqual(encoded.player.statuses, expectedStatuses);
    assert.equal(encoded.activeBattle.id, expectedBattleId);
    assert.equal(encoded.activeBattle.rng, undefined);
    assert.ok(encoded.activeBattle.combatants.find((entry) => entry.type === 'player').combat);

    const loaded = loadCharacter('Integrated');
    assert.ok(loaded);
    assert.deepEqual(loaded.player.equipment, expectedEquipment);
    assert.deepEqual(loaded.player.resources, expectedResources);
    assert.deepEqual(loaded.player.statuses, expectedStatuses);
    assert.equal(loaded.activeBattle.id, expectedBattleId);
    assert.deepEqual(loaded.player.combat, calculateCombatProfile(loaded.player));
    assert.deepEqual(validateCurrentGameStateStructure(loaded), []);
});

test('loaded active battle can expire status, resync derived caches, and continue combat', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Continuation Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = preparePersistentCombatState();
    assert.equal(saveGame(state), true);
    const loaded = loadCharacter('Integrated');
    assert.ok(loaded);

    finalizeCombatState(loaded);
    const rootStatus = loaded.player.statuses.find((status) => status.id === 'status-integration-ward');
    const battlePlayer = loaded.activeBattle.combatants.find((entry) => entry.type === 'player');
    const battleStatus = battlePlayer.statuses.find((status) => status.id === 'status-integration-ward');
    assert.ok(rootStatus && battleStatus);
    assert.notStrictEqual(rootStatus.modifiers.derived, battleStatus.modifiers.derived);

    const defenseWithWard = calculateCombatProfile(loaded.player).derived.defense;
    advanceWorldTime(loaded, 31);
    finalizeCombatState(loaded);
    assert.equal(loaded.player.statuses.some((status) => status.id === 'status-integration-ward'), false);
    assert.equal(battlePlayer.statuses.some((status) => status.id === 'status-integration-ward'), false);
    assert.equal(calculateCombatProfile(loaded.player).derived.defense, defenseWithWard - 4);
    assert.equal(battlePlayer.combat.derived.defense, defenseWithWard - 4);
    assert.deepEqual(loaded.player.combat, calculateCombatProfile(loaded.player));

    const before = loaded.activeBattle.contract.actionSequence;
    const result = performPlayerAttack(loaded);
    assert.match(result, /Battle:/);
    assert.ok(loaded.activeBattle.contract.actionSequence > before);
    assert.deepEqual(loaded.player.combat, calculateCombatProfile(loaded.player));
    assert.deepEqual(validateCurrentGameStateStructure(loaded), []);
});
