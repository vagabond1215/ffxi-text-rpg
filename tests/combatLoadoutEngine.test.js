import test from 'node:test';
import assert from 'node:assert/strict';

import { EQUIPMENT_CATALOG } from '../js/text/data/equipmentCatalog.js';
import { createNewGameState } from '../js/text/gameState.js';
import { createAccountWithPassword, loadCharacter, saveGame } from '../js/text/save.js';
import { createBattleState } from '../js/text/systems/battleEngine.js';
import { canActivateAbility } from '../js/text/systems/abilityEngine.js';
import { addEnmity, setAggroTarget, setFixation } from '../js/text/systems/combatAttentionEngine.js';
import {
    getArmorPressureReport,
    interruptCombatLoadoutIfHardDisabled,
    startCombatEquipTransition,
} from '../js/text/systems/combatLoadoutEngine.js';
import { performPlayerAttack, startEncounter } from '../js/text/systems/combatActionEngine.js';
import { advanceCombatSimulation } from '../js/text/systems/combatSimulationEngine.js';
import { ensureCombatContract, getCombatantReadyAt, initializeCombatTimeline, setCombatantReadyAt } from '../js/text/systems/combatTurnEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { equipItem } from '../js/text/systems/equipmentEngine.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { applyStatus } from '../js/text/systems/statusEngine.js';
import { findTimedTask, listTimedTasks } from '../js/text/systems/timedTaskEngine.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() { globalThis.localStorage = new MemoryStorage(); }

function addEquipment(state, id) {
    const item = structuredClone(EQUIPMENT_CATALOG[id]);
    const stored = addItemToContainer(state.player.inventoryState, 'inventory', item);
    assert.equal(stored.ok, true, stored.reason);
    return item;
}

function equipBeforeBattle(state, id) {
    addEquipment(state, id);
    const message = equipItem(state, id);
    assert.match(message, /Equipped/);
}

function beginSimpleBattle(state) {
    const started = startEncounter(state, 'Brush Hare', { rng: () => 0 });
    assert.equal(started.ok, true);
    const enemy = state.activeBattle.combatants.find((entry) => entry.type === 'enemy');
    setCombatantReadyAt(state, enemy.id, 999999);
    return { enemy, player: state.activeBattle.combatants.find((entry) => entry.type === 'player') };
}

test('active combat direct equip no longer mutates root or battle equipment', () => {
    const state = createNewGameState();
    addEquipment(state, 'bronze-sword');
    const { player } = beginSimpleBattle(state);

    const direct = equipItem(state, 'bronze-sword');
    assert.match(direct, /timed loadout transition/);
    assert.equal(state.player.equipment.mainHand, null);
    assert.equal(player.equipment.mainHand, null);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('weapon-set transition is atomic blocks actions and preserves cooldowns', () => {
    const state = createNewGameState();
    equipBeforeBattle(state, 'bronze-dagger');
    addEquipment(state, 'bronze-sword');
    const { player } = beginSimpleBattle(state);
    state.abilities.cooldowns['ability-ember-dart'] = 12345;

    const started = startCombatEquipTransition(state, 'bronze-sword');
    assert.equal(started.ok, true, started.display.text);
    assert.equal(started.data.transition.kind, 'weaponSet');
    assert.equal(started.data.transition.durationSeconds, 3);
    assert.equal(started.data.transition.recoverySeconds, 1);
    assert.equal(state.player.equipment.mainHand.id, 'bronze-dagger');
    assert.equal(player.equipment.mainHand.id, 'bronze-dagger');

    assert.match(performPlayerAttack(state), /changing equipment/);
    const blockedAbility = canActivateAbility(state, 'ability-ember-dart');
    assert.equal(blockedAbility.ok, false);
    assert.equal(blockedAbility.code, 'ability.loadout-transition');
    assert.equal(state.abilities.cooldowns['ability-ember-dart'], 12345);

    const advanced = advanceCombatSimulation(state, 3);
    assert.equal(advanced.loadoutResult?.ok, true, advanced.message);
    assert.equal(state.activeBattle.loadoutTransition, null);
    assert.equal(state.player.equipment.mainHand.id, 'bronze-sword');
    assert.equal(player.equipment.mainHand.id, 'bronze-sword');
    assert.deepEqual(player.combat, state.player.combat);
    assert.equal(state.abilities.cooldowns['ability-ember-dart'], 12345);
    assert.equal(getCombatantReadyAt(state, player.id) - state.worldTime.totalSeconds, 1);
    assert.equal(listTimedTasks(state).length, 0);
    assert.ok(state.activeBattle.contract.actions.some((action) => action.kind === 'loadoutTransition' && action.data.resetWeaponSequence === true));
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('directional handling makes dagger to staff slower than staff to dagger', () => {
    const toStaff = createNewGameState();
    equipBeforeBattle(toStaff, 'bronze-dagger');
    addEquipment(toStaff, 'ash-staff');
    beginSimpleBattle(toStaff);
    const first = startCombatEquipTransition(toStaff, 'ash-staff');
    assert.equal(first.ok, true, first.display.text);

    const toDagger = createNewGameState();
    equipBeforeBattle(toDagger, 'ash-staff');
    addEquipment(toDagger, 'bronze-dagger');
    beginSimpleBattle(toDagger);
    const second = startCombatEquipTransition(toDagger, 'bronze-dagger');
    assert.equal(second.ok, true, second.display.text);

    assert.equal(first.data.transition.durationSeconds, 4);
    assert.equal(second.data.transition.durationSeconds, 3);
    assert.ok(first.data.transition.durationSeconds > second.data.transition.durationSeconds);
});

test('armor pressure uses focus as pressure not literal target probability', () => {
    const { state, enemy, player, tank, scout } = threeActorBattle();
    addEquipment(state, 'leather-vest');

    setAggroTarget(state.activeBattle, enemy.id, tank.id);
    let pressure = getArmorPressureReport(state, player.id);
    assert.equal(pressure.blocked, true);
    assert.ok(pressure.hostiles[0].reasons.includes('focus'), 'equal one-third focus still blocks despite tank Aggro');

    addEnmity(state.activeBattle, enemy.id, tank.id, 30);
    pressure = getArmorPressureReport(state, player.id);
    assert.equal(pressure.blocked, false);
    const allowed = startCombatEquipTransition(state, 'leather-vest');
    assert.equal(allowed.ok, true, allowed.display.text);
    assert.equal(allowed.data.transition.kind, 'fullEquipment');

    interruptCombatLoadoutIfHardDisabled(state);
    assert.ok(state.activeBattle.loadoutTransition, 'transition should remain active without a player disable');

    // reset with a fresh fixture to prove fixation independently
    const fixed = threeActorBattle();
    addEquipment(fixed.state, 'leather-vest');
    addEnmity(fixed.state.activeBattle, fixed.enemy.id, fixed.tank.id, 30);
    setAggroTarget(fixed.state.activeBattle, fixed.enemy.id, fixed.tank.id);
    setFixation(fixed.state.activeBattle, fixed.enemy.id, fixed.player.id, { reason: 'test-fixation' });
    const blocked = startCombatEquipTransition(fixed.state, 'leather-vest');
    assert.equal(blocked.ok, false);
    assert.match(blocked.display.text, /fixation/);

    assert.ok(scout.id);
});

test('hard disable cancels an active transition without changing equipment', () => {
    const state = createNewGameState();
    equipBeforeBattle(state, 'bronze-dagger');
    addEquipment(state, 'bronze-sword');
    const { player } = beginSimpleBattle(state);

    const started = startCombatEquipTransition(state, 'bronze-sword');
    assert.equal(started.ok, true);
    const taskId = started.data.transition.taskId;

    applyStatus(player, {
        id: 'status-test-stunned',
        name: 'Test Stunned',
        category: 'debuff',
        durationSeconds: 10,
        stackGroup: 'test-disable',
        stackRule: 'replace',
        modifiers: {},
        flags: { stunned: true },
    }, { nowWorldSeconds: state.worldTime.totalSeconds });

    const interrupted = interruptCombatLoadoutIfHardDisabled(state);
    assert.equal(interrupted.ok, false);
    assert.equal(interrupted.code, 'combat.loadout.cancelled');
    assert.equal(state.activeBattle.loadoutTransition, null);
    assert.equal(state.player.equipment.mainHand.id, 'bronze-dagger');
    assert.equal(findTimedTask(state, taskId), null);
});

test('active loadout transition survives save load with owner task link intact', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Loadout Persistence Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createNewGameState();
    state.player.identity.name = 'Loadout Keeper';
    equipBeforeBattle(state, 'bronze-dagger');
    addEquipment(state, 'bronze-sword');
    beginSimpleBattle(state);

    const started = startCombatEquipTransition(state, 'bronze-sword');
    assert.equal(started.ok, true);
    const taskId = started.data.transition.taskId;
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
    assert.equal(saveGame(state), true);

    const loaded = loadCharacter('Loadout Keeper');
    assert.ok(loaded);
    assert.equal(loaded.activeBattle.loadoutTransition.taskId, taskId);
    assert.ok(findTimedTask(loaded, taskId));
    assert.equal(loaded.player.equipment.mainHand.id, 'bronze-dagger');
    assert.deepEqual(validateCurrentGameStateStructure(loaded), []);

    const enemy = loaded.activeBattle.combatants.find((entry) => entry.type === 'enemy');
    setCombatantReadyAt(loaded, enemy.id, 999999);
    const completed = advanceCombatSimulation(loaded, loaded.activeBattle.loadoutTransition.durationSeconds);
    assert.equal(completed.loadoutResult?.ok, true, completed.message);
    assert.equal(loaded.player.equipment.mainHand.id, 'bronze-sword');
    assert.equal(loaded.activeBattle.loadoutTransition, null);
    assert.equal(findTimedTask(loaded, taskId), null);
    assert.deepEqual(validateCurrentGameStateStructure(loaded), []);
});

test('current schema rejects malformed combat loadout owner task link', () => {
    const state = createNewGameState();
    equipBeforeBattle(state, 'bronze-dagger');
    addEquipment(state, 'bronze-sword');
    beginSimpleBattle(state);
    const started = startCombatEquipTransition(state, 'bronze-sword');
    assert.equal(started.ok, true);

    state.activeBattle.loadoutTransition.taskId = 'task-forged';
    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('combat loadout') && issue.includes('persisted timed task')));
});

function threeActorBattle() {
    const state = createNewGameState({ startWorldTimeSeconds: 0 });
    const tank = structuredClone(state.player);
    const scout = structuredClone(state.player);
    tank.id = 'b3-tank';
    tank.type = 'companion';
    tank.identity = { ...tank.identity, name: 'Shield Warden' };
    scout.id = 'b3-scout';
    scout.type = 'companion';
    scout.identity = { ...scout.identity, name: 'Quiet Scout' };

    const enemySource = structuredClone(state.enemies[0]);
    enemySource.id = 'b3-enemy';

    state.combatSequence = 1;
    state.activeBattle = createBattleState({
        id: 'battle-000001',
        player: state.player,
        allies: [tank, scout],
        enemies: [enemySource],
        rng: () => 0,
    });
    ensureCombatContract(state.activeBattle, { nowWorldSeconds: 0, combatants: state.activeBattle.combatants });
    initializeCombatTimeline(state, state.activeBattle);

    return {
        state,
        enemy: state.activeBattle.combatants.find((entry) => entry.type === 'enemy'),
        player: state.activeBattle.combatants.find((entry) => entry.type === 'player'),
        tank: state.activeBattle.combatants.find((entry) => entry.id === tank.id),
        scout: state.activeBattle.combatants.find((entry) => entry.id === scout.id),
    };
}
