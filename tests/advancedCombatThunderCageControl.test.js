import test from 'node:test';
import assert from 'node:assert/strict';

import {
    ABILITY_CATALOG_VERSION,
    getAbility,
    listAbilities,
    validateAbilityCatalog,
} from '../js/text/data/abilities.js';
import { createNewGameState } from '../js/text/gameState.js';
import { activateAbility, reconcileAbilityActivation } from '../js/text/systems/abilityEngine.js';
import { startEncounter } from '../js/text/systems/combatActionEngine.js';
import { advanceCombatSimulation } from '../js/text/systems/combatSimulationEngine.js';
import { getArmorPressureReport, isCombatActorHardDisabled } from '../js/text/systems/combatLoadoutEngine.js';
import {
    getCombatantReadyAt,
    resolveEnemyReadyAction,
    setCombatantReadyAt,
} from '../js/text/systems/combatTurnEngine.js';
import { grantCapability } from '../js/text/systems/capabilityEngine.js';
import { createSequenceRng } from '../js/text/systems/rng.js';
import { setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';
import {
    HARD_DISABLE_STATUS_FLAGS,
    applyStatus,
    getHardDisableUntilWorldSeconds,
    isHardDisabledByStatus,
} from '../js/text/systems/statusEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

test('Packet 4 gives Thunder Cage explicit lightning damage and separate resistible control', () => {
    assert.equal(ABILITY_CATALOG_VERSION, 8);
    assert.equal(listAbilities().length, 41);
    assert.deepEqual(validateAbilityCatalog(), []);

    const cage = getAbility('ability-thunder-cage');
    assert.ok(cage);
    assert.equal(cage.capabilityId, 'spell-thunder-cage');
    assert.equal(cage.schoolId, 'school-elemental-form');
    assert.deepEqual(cage.activation, { durationSeconds: 6, interruptible: true });
    assert.equal(cage.recoverySeconds, 3);
    assert.equal(cage.cooldownSeconds, 18);
    assert.deepEqual(cage.costs, { mp: 20 });
    assert.equal(cage.effects.length, 2);

    assert.deepEqual(cage.effects[0], {
        type: 'damage',
        recipient: 'target',
        stat: 'int',
        base: 16,
        coefficient: 1.75,
        resolution: {
            delivery: 'spell',
            channel: 'magical',
            damageType: 'spell',
            element: 'lightning',
            elementSource: 'ability',
            accuracyModel: 'magic',
            resistanceModel: 'magicDefense',
            criticalEligible: false,
        },
        status: undefined,
    });

    assert.equal(cage.effects[1].type, 'status');
    assert.equal(cage.effects[1].recipient, 'target');
    assert.deepEqual(cage.effects[1].resolution, {
        delivery: 'spell',
        channel: 'magical',
        element: 'lightning',
        elementSource: 'ability',
        accuracyModel: 'magic',
        resistanceModel: 'magicEvasion',
    });
    assert.equal(cage.effects[1].status.id, 'status-thunder-cage');
    assert.equal(cage.effects[1].status.durationSeconds, 6);
    assert.deepEqual(cage.effects[1].status.flags, { cannotAct: true, caged: true });
    assert.ok(HARD_DISABLE_STATUS_FLAGS.includes('cannotAct'));
});

test('Thunder Cage can deal damage while its containment is resisted', () => {
    const state = createCageState(createSequenceRng([0, 0.99]));
    const enemy = battleEnemy(state);
    enemy.resources.hp = 999;

    const result = resolveThunderCage(state);
    const [damage, control] = result.data.effects;

    assert.equal(damage.applied, true);
    assert.equal(damage.resolution.contract.element, 'lightning');
    assert.equal(damage.resolution.contract.resistanceModel, 'magicDefense');
    assert.equal(control.applied, false);
    assert.equal(control.reason, 'resisted');
    assert.equal(control.resolution.contract.resistanceModel, 'magicEvasion');
    assert.equal(enemy.statuses.some((status) => status.id === 'status-thunder-cage'), false);
});

test('Thunder Cage lightning resistance changes damage evidence and damage amount', () => {
    const normal = createCageState(createSequenceRng([0, 0]));
    battleEnemy(normal).resources.hp = 999;
    const normalResult = resolveThunderCage(normal);

    const resisted = createCageState(createSequenceRng([0, 0]));
    const enemy = battleEnemy(resisted);
    enemy.resources.hp = 999;
    applyStatus(enemy, {
        id: 'status-test-lightning-resistance',
        name: 'Lightning Resistance',
        category: 'buff',
        durationSeconds: 30,
        stackGroup: 'test-lightning-resistance',
        stackRule: 'replace',
        modifiers: { resistances: { lightning: 50 } },
        flags: {},
    }, { nowWorldSeconds: resisted.worldTime.totalSeconds });
    const resistedResult = resolveThunderCage(resisted);

    const normalDamage = normalResult.data.effects[0];
    const resistedDamage = resistedResult.data.effects[0];
    assert.equal(normalDamage.resolution.element.resistance, 0);
    assert.equal(resistedDamage.resolution.element.resistance, 50);
    assert.equal(resistedDamage.resolution.element.multiplier, 0.5);
    assert.ok(resistedDamage.amount < normalDamage.amount);
});

test('landed Thunder Cage suppresses enemy actions and defers readiness to status expiry', () => {
    const state = createCageState(createSequenceRng([0, 0]));
    const enemy = battleEnemy(state);
    enemy.resources.hp = 999;

    const result = resolveThunderCage(state);
    const control = result.data.effects[1];
    assert.equal(control.applied, true);

    const cage = enemy.statuses.find((status) => status.id === 'status-thunder-cage');
    assert.ok(cage);
    assert.equal(cage.flags.cannotAct, true);
    assert.equal(isHardDisabledByStatus(enemy, state.worldTime.totalSeconds), true);
    assert.equal(isCombatActorHardDisabled(enemy, state.worldTime.totalSeconds), true);
    assert.equal(getHardDisableUntilWorldSeconds(enemy, state.worldTime.totalSeconds), state.worldTime.totalSeconds + 6);

    const forced = resolveEnemyReadyAction(state, enemy.id, { force: true });
    assert.equal(forced.ok, false);
    assert.equal(forced.code, 'combat.enemy-disabled');

    setCombatantReadyAt(state, enemy.id, state.worldTime.totalSeconds);
    const beforeEnemyActions = enemyActionCount(state);

    const held = advanceCombatSimulation(state, 5);
    assert.equal(held.ok, true);
    assert.equal(held.secondsAdvanced, 5);
    assert.equal(enemyActionCount(state), beforeEnemyActions);
    assert.equal(enemy.statuses.some((status) => status.id === 'status-thunder-cage'), true);

    const release = advanceCombatSimulation(state, 1);
    assert.equal(release.ok, true);
    assert.equal(release.secondsAdvanced, 1);
    assert.equal(enemy.statuses.some((status) => status.id === 'status-thunder-cage'), false);
    assert.equal(enemyActionCount(state), beforeEnemyActions + 1);
    assert.ok(getCombatantReadyAt(state, enemy.id) > state.worldTime.totalSeconds);
});

test('Thunder Cage shared hard-disable semantics remove immediate armor pressure', () => {
    const state = createCageState(createSequenceRng([0, 0]));
    const player = battlePlayer(state);
    const enemy = battleEnemy(state);

    const before = getArmorPressureReport(state, player.id);
    assert.equal(before.blocked, true);

    resolveThunderCage(state);
    assert.equal(isCombatActorHardDisabled(enemy, state.worldTime.totalSeconds), true);
    assert.equal(getArmorPressureReport(state, player.id).blocked, false);
});

function createCageState(rng) {
    const state = createNewGameState({ mainJobId: 'elementalist' });
    grantCapability(state.player, 'spell-thunder-cage');
    setLearnedSkill(state.player, 'elementalMagic', 3);
    state.player.resources.mp = 100;
    startEncounter(state, 'Training Dummy', { rng });
    battlePlayer(state).resources.mp = 100;
    setCombatantReadyAt(state, battleEnemy(state).id, state.worldTime.totalSeconds + 100000);
    return state;
}

function resolveThunderCage(state) {
    const started = activateAbility(state, 'Thunder Cage');
    assert.equal(started.code, 'ability.started');
    advanceWorldTime(state, 6);
    const result = reconcileAbilityActivation(state);
    assert.equal(result.code, 'ability.resolved');
    return result;
}

function enemyActionCount(state) {
    return state.activeBattle.contract.actions.filter((action) => action.actorType === 'enemy').length;
}

function battlePlayer(state) {
    return state.activeBattle.combatants.find((entry) => entry.type === 'player');
}

function battleEnemy(state) {
    return state.activeBattle.combatants.find((entry) => entry.type === 'enemy');
}
