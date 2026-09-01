import test from 'node:test';
import assert from 'node:assert/strict';

import { EQUIPMENT_CATALOG } from '../js/text/data/equipmentCatalog.js';
import { createNewGameState } from '../js/text/gameState.js';
import {
    performManualWeaponKataTechnique,
    performPlayerAttack,
    performPlayerRangedAttack,
    startEncounter,
} from '../js/text/systems/combatActionEngine.js';
import { advanceCombatSimulation } from '../js/text/systems/combatSimulationEngine.js';
import { startCombatEquipTransition } from '../js/text/systems/combatLoadoutEngine.js';
import { getCombatantReadyAt, setCombatantReadyAt } from '../js/text/systems/combatTurnEngine.js';
import { equipItem } from '../js/text/systems/equipmentEngine.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import {
    configureWeaponKataSelection,
    describeWeaponKata,
} from '../js/text/systems/weaponKataEngine.js';
import {
    getMeleeCadenceProfile,
    weaponDelayToRecoverySeconds,
} from '../js/text/systems/weaponCadenceEngine.js';

function addEquipment(state, id) {
    const stored = addItemToContainer(state.player.inventoryState, 'inventory', structuredClone(EQUIPMENT_CATALOG[id]));
    assert.equal(stored.ok, true, stored.reason);
}

function equip(state, id) {
    addEquipment(state, id);
    assert.match(equipItem(state, id), /Equipped/);
}

function begin(state) {
    const result = startEncounter(state, 'Training Dummy', { rng: () => 0.25 });
    assert.equal(result.ok, true);
    return {
        player: state.activeBattle.combatants.find((entry) => entry.type === 'player'),
        enemy: state.activeBattle.combatants.find((entry) => entry.type === 'enemy'),
    };
}

test('B4 weapon delay conversion produces distinct whole-second melee cadence', () => {
    assert.equal(weaponDelayToRecoverySeconds(190), 3);
    assert.equal(weaponDelayToRecoverySeconds(236), 4);
    assert.equal(weaponDelayToRecoverySeconds(288), 5);
    assert.equal(weaponDelayToRecoverySeconds(366), 6);

    const dagger = createNewGameState();
    equip(dagger, 'bronze-dagger');
    assert.equal(getMeleeCadenceProfile(dagger.player).recoverySeconds, 3);

    const staff = createNewGameState();
    equip(staff, 'ash-staff');
    assert.equal(getMeleeCadenceProfile(staff.player).recoverySeconds, 6);
});

test('player basic attack uses equipped weapon cadence and records automatic kata evidence', () => {
    const state = createNewGameState({ mainJobId: 'shadowhand' });
    equip(state, 'bronze-dagger');
    setLearnedSkill(state.player, 'dagger', 4);
    const { player } = begin(state);
    const now = state.worldTime.totalSeconds;

    performPlayerAttack(state);

    const action = state.activeBattle.contract.actions.find((entry) => entry.actorType === 'player' && entry.kind === 'basicAttack');
    assert.equal(action.sourceId, 'dagger-quick-thrust');
    assert.equal(action.data.kata.family, 'dagger');
    assert.equal(action.data.kata.slot, 1);
    assert.equal(action.data.cadence.delayUnits, 190);
    assert.equal(getCombatantReadyAt(state, player.id), now + 3);
    assert.equal(state.activeBattle.weaponKata.byActorId[player.id].nextSlot, 2);
});

test('automatic kata advances through proficiency-gated slots and wraps', () => {
    const state = createNewGameState({ mainJobId: 'shadowhand' });
    equip(state, 'bronze-dagger');
    setLearnedSkill(state.player, 'dagger', 4);
    const { player } = begin(state);

    performPlayerAttack(state);
    setCombatantReadyAt(state, player.id, state.worldTime.totalSeconds);
    performPlayerAttack(state);
    setCombatantReadyAt(state, player.id, state.worldTime.totalSeconds);
    performPlayerAttack(state);

    const actions = state.activeBattle.contract.actions.filter((entry) => entry.actorType === 'player' && entry.kind === 'basicAttack');
    assert.deepEqual(actions.slice(-3).map((entry) => entry.sourceId), ['dagger-quick-thrust', 'dagger-cross-cut', 'dagger-driving-thrust']);
    assert.equal(state.activeBattle.weaponKata.byActorId[player.id].nextSlot, 1);
});

test('kata configuration is proficiency gated and selected slot changes automatic move', () => {
    const state = createNewGameState({ mainJobId: 'shadowhand' });
    equip(state, 'bronze-dagger');
    setLearnedSkill(state.player, 'dagger', 2);

    const configured = configureWeaponKataSelection(state, 'dagger', 1, 'dagger-careful-thrust');
    assert.equal(configured.ok, true, configured.display.text);
    assert.match(describeWeaponKata(state.player, 'dagger'), /Careful Thrust/);

    begin(state);
    performPlayerAttack(state);
    const action = state.activeBattle.contract.actions.find((entry) => entry.actorType === 'player' && entry.kind === 'basicAttack');
    assert.equal(action.sourceId, 'dagger-careful-thrust');

    const blocked = configureWeaponKataSelection(state, 'dagger', 1, 'dagger-quick-thrust');
    assert.equal(blocked.ok, false);
    assert.equal(blocked.code, 'combat.kata.configure-in-combat');
});

test('manual dagger recenter technique resets the automatic kata sequence', () => {
    const state = createNewGameState({ mainJobId: 'shadowhand' });
    equip(state, 'bronze-dagger');
    setLearnedSkill(state.player, 'dagger', 4);
    const { player } = begin(state);

    performPlayerAttack(state);
    assert.equal(state.activeBattle.weaponKata.byActorId[player.id].nextSlot, 2);
    setCombatantReadyAt(state, player.id, state.worldTime.totalSeconds);

    performManualWeaponKataTechnique(state, 'dagger-recenter-cut');

    const action = state.activeBattle.contract.actions.find((entry) => entry.actorType === 'player' && entry.kind === 'weaponKataTechnique');
    assert.equal(action.sourceId, 'dagger-recenter-cut');
    assert.equal(action.data.sequenceEffect, 'reset');
    assert.equal(state.activeBattle.weaponKata.byActorId[player.id].nextSlot, 1);
});

test('first-class ranged attack uses ranged stats consumes equipped ammo and records cadence', () => {
    const state = createNewGameState({ mainJobId: 'shadowhand' });
    equip(state, 'braided-sling');
    equip(state, 'rounded-sling-stones');
    const before = state.player.equipment.ammo.quantity;
    const { player } = begin(state);
    const now = state.worldTime.totalSeconds;

    performPlayerRangedAttack(state);

    const action = state.activeBattle.contract.actions.find((entry) => entry.actorType === 'player' && entry.kind === 'rangedAttack');
    assert.ok(action);
    assert.equal(action.sourceId, 'braided-sling');
    assert.equal(action.data.ammoItemId, 'rounded-sling-stones');
    assert.equal(action.data.ammoConsumed, 1);
    assert.equal(action.data.ammoRemaining, before - 1);
    assert.equal(action.data.cadence.delayUnits, 240);
    assert.equal(action.data.resolution.accuracy.model, 'ranged');
    assert.equal(state.player.equipment.ammo.quantity, before - 1);
    assert.equal(player.equipment.ammo.quantity, before - 1);
    assert.equal(getCombatantReadyAt(state, player.id), now + 4);
});

test('ranged attack clears depleted equipped ammo coherently', () => {
    const state = createNewGameState({ mainJobId: 'shadowhand' });
    equip(state, 'braided-sling');
    equip(state, 'rounded-sling-stones');
    state.player.equipment.ammo.quantity = 1;
    const { player } = begin(state);
    player.equipment.ammo.quantity = 1;

    performPlayerRangedAttack(state);

    assert.equal(state.player.equipment.ammo, null);
    assert.equal(player.equipment.ammo, null);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('B3 weapon loadout completion consumes resetWeaponSequence intent', () => {
    const state = createNewGameState({ mainJobId: 'shadowhand' });
    equip(state, 'bronze-dagger');
    addEquipment(state, 'bronze-sword');
    setLearnedSkill(state.player, 'dagger', 4);
    const { player, enemy } = begin(state);
    setCombatantReadyAt(state, enemy.id, 999999);

    performPlayerAttack(state);
    assert.equal(state.activeBattle.weaponKata.byActorId[player.id].nextSlot, 2);
    setCombatantReadyAt(state, player.id, state.worldTime.totalSeconds);

    const started = startCombatEquipTransition(state, 'bronze-sword');
    assert.equal(started.ok, true, started.display.text);
    const advanced = advanceCombatSimulation(state, started.data.transition.durationSeconds);
    assert.equal(advanced.loadoutResult?.ok, true, advanced.message);

    const sequence = state.activeBattle.weaponKata.byActorId[player.id];
    assert.equal(sequence.family, 'sword');
    assert.equal(sequence.nextSlot, 1);
    assert.match(sequence.lastResetReason, /^loadout:/);
    const loadoutAction = state.activeBattle.contract.actions.find((entry) => entry.kind === 'loadoutTransition');
    assert.equal(loadoutAction.data.resetWeaponSequence, true);
    assert.equal(loadoutAction.data.weaponSequence.nextSlot, 1);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});
