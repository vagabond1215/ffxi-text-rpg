import test from 'node:test';
import assert from 'node:assert/strict';

import { getAbility, validateAbilityCatalog } from '../js/text/data/abilities.js';
import { getEquipmentCatalogEntry } from '../js/text/data/equipmentCatalog.js';
import { createNewGameState } from '../js/text/gameState.js';
import { activateAbility, canActivateAbility, reconcileAbilityActivation } from '../js/text/systems/abilityEngine.js';
import { resolveBasicAttack } from '../js/text/systems/battleEngine.js';
import { grantCapability } from '../js/text/systems/capabilityEngine.js';
import { startEncounter } from '../js/text/systems/combatActionEngine.js';
import {
    getCombatantReadyAt,
    reconcileCombatStatuses,
} from '../js/text/systems/combatTurnEngine.js';
import { createSequenceRng } from '../js/text/systems/rng.js';
import { setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';
import { applyStatus } from '../js/text/systems/statusEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

test('B1 ability catalog exposes validated recovery and structured resolution metadata', () => {
    assert.deepEqual(validateAbilityCatalog(), []);

    const ember = getAbility('ability-ember-dart');
    assert.equal(ember.recoverySeconds, 2);
    assert.deepEqual(ember.effects[0].resolution, {
        delivery: 'projectile',
        channel: 'magical',
        damageType: 'spell',
        element: 'fire',
        elementSource: 'ability',
        accuracyModel: 'magic',
        resistanceModel: 'magicDefense',
        criticalEligible: false,
    });

    const ridge = getAbility('ability-ridge-breaker');
    assert.equal(ridge.recoverySeconds, 4);
    assert.equal(ridge.effects[0].resolution.defensePenetration, 0.25);
    assert.equal(ridge.effects[0].resolution.criticalEligible, true);

    const rivet = getAbility('ability-rivet-guard');
    assert.equal(rivet.recoverySeconds, 3);
    assert.equal(rivet.effects[0].resolution.channel, 'physical');

    const fracture = getAbility('ability-fracture-sigil');
    assert.equal(fracture.recoverySeconds, 2);
    assert.equal(fracture.effects[0].resolution.resistanceModel, 'magicEvasion');
});

test('basic melee uses the shared physical accuracy and defense contract', () => {
    const baseline = createNewGameState();
    startEncounter(baseline, 'Training Dummy');
    const baselinePlayer = battlePlayer(baseline);
    const baselineEnemy = battleEnemy(baseline);
    const baselineResult = resolveBasicAttack(
        baseline.activeBattle,
        baselinePlayer.id,
        baselineEnemy.id,
        { rng: createSequenceRng([0, 0.5]) },
    );

    const defended = createNewGameState();
    startEncounter(defended, 'Training Dummy');
    const defendedPlayer = battlePlayer(defended);
    const defendedEnemy = battleEnemy(defended);
    applyStatus(defendedEnemy, {
        id: 'status-test-heavy-defense',
        name: 'Heavy Defense',
        durationSeconds: 30,
        modifiers: { defense: 100 },
    }, { nowWorldSeconds: defended.worldTime.totalSeconds });
    reconcileCombatStatuses(defended);
    const defendedResult = resolveBasicAttack(
        defended.activeBattle,
        defendedPlayer.id,
        defendedEnemy.id,
        { rng: createSequenceRng([0, 0.5]) },
    );

    assert.equal(baselineResult.hit, true);
    assert.equal(baselineResult.resolution.contract.channel, 'physical');
    assert.equal(baselineResult.resolution.contract.resistanceModel, 'physicalDefense');
    assert.equal(baselineResult.resolution.accuracy.model, 'physical');
    assert.ok(defendedResult.resolution.defense.effective > baselineResult.resolution.defense.effective);
    assert.ok(defendedResult.damage < baselineResult.damage);
});

test('Ember Dart uses magic accuracy, magic defense, and fire resistance', () => {
    const normal = createEmberState();
    const normalEnemy = battleEnemy(normal);
    normalEnemy.resources.hp = 999;
    const normalResult = resolveTimedAbility(normal, 'Ember Dart', 6);

    const resisted = createEmberState();
    const resistedEnemy = battleEnemy(resisted);
    resistedEnemy.resources.hp = 999;
    applyStatus(resistedEnemy, {
        id: 'status-test-fire-resistance',
        name: 'Fire Resistance',
        durationSeconds: 30,
        modifiers: { resistances: { fire: 50 } },
    }, { nowWorldSeconds: resisted.worldTime.totalSeconds });
    reconcileCombatStatuses(resisted);
    const resistedResult = resolveTimedAbility(resisted, 'Ember Dart', 6);

    const normalDamage = normalResult.data.effects[0];
    const resistedDamage = resistedResult.data.effects[0];
    assert.equal(normalDamage.applied, true);
    assert.equal(normalDamage.resolution.contract.accuracyModel, 'magic');
    assert.equal(normalDamage.resolution.contract.resistanceModel, 'magicDefense');
    assert.equal(normalDamage.resolution.element.element, 'fire');
    assert.equal(normalDamage.resolution.element.resistance, 0);
    assert.equal(resistedDamage.resolution.element.resistance, 50);
    assert.equal(resistedDamage.resolution.element.multiplier, 0.5);
    assert.ok(resistedDamage.amount < normalDamage.amount);
});

test('Fracture Sigil can land or be resisted through deterministic magic accuracy', () => {
    const landed = createFractureState(createSequenceRng([0, 0, 0.5]));
    const landedEnemy = battleEnemy(landed);
    const landedResult = resolveTimedAbility(landed, 'Fracture Sigil', 3);
    assert.equal(landedResult.data.effects[0].applied, true);
    assert.equal(landedResult.data.effects[0].resolution.outcome, 'landed');
    assert.ok(landedEnemy.statuses.some((status) => status.id === 'status-fracture-sigil'));

    const resisted = createFractureState(createSequenceRng([0.99, 0, 0.5]));
    const resistedEnemy = battleEnemy(resisted);
    const resistedResult = resolveTimedAbility(resisted, 'Fracture Sigil', 3);
    assert.equal(resistedResult.data.effects[0].applied, false);
    assert.equal(resistedResult.data.effects[0].reason, 'resisted');
    assert.equal(resistedResult.data.effects[0].resolution.outcome, 'resisted');
    assert.equal(resistedEnemy.statuses.some((status) => status.id === 'status-fracture-sigil'), false);
});

test('Ridge Breaker records defense penetration, critical resolution, and canonical recovery', () => {
    const state = createNewGameState({ nationId: 'brasshaven', mainJobId: 'vanguard' });
    grantCapability(state.player, 'technique-ridge-breaker');
    setLearnedSkill(state.player, 'axe', 2);
    state.player.equipment.mainHand = getEquipmentCatalogEntry('bronze-axe');
    state.player.resources.tp = 500;
    startEncounter(state, 'Training Dummy', { rng: () => 0 });
    battlePlayer(state).resources.tp = 500;

    const result = activateAbility(state, 'Ridge Breaker');
    const player = battlePlayer(state);
    const effect = result.data.effects[0];
    const playerAction = state.activeBattle.contract.actions.find((action) => action.actorType === 'player');

    assert.equal(result.ok, true);
    assert.equal(effect.applied, true);
    assert.equal(effect.resolution.contract.resistanceModel, 'physicalDefense');
    assert.equal(effect.resolution.defense.penetration, 0.25);
    assert.equal(effect.resolution.critical, true);
    assert.equal(playerAction.data.effects[0].resolution.contract.defensePenetration, 0.25);
    assert.equal(getCombatantReadyAt(state, player.id), state.worldTime.totalSeconds + 4);

    const blocked = canActivateAbility(state, 'Rivet Guard');
    assert.equal(blocked.code, 'ability.action-recovery');
});

function createEmberState() {
    const state = createNewGameState({ mainJobId: 'elementalist' });
    grantCapability(state.player, 'spell-ember-dart');
    setLearnedSkill(state.player, 'elementalMagic', 1);
    state.player.resources.mp = 100;
    startEncounter(state, 'Training Dummy', { rng: () => 0 });
    battlePlayer(state).resources.mp = 100;
    return state;
}

function createFractureState(rng) {
    const state = createNewGameState({ mainJobId: 'veilrunner' });
    grantCapability(state.player, 'spell-fracture-sigil');
    setLearnedSkill(state.player, 'ninjutsu', 1);
    state.player.resources.mp = 100;
    startEncounter(state, 'Training Dummy', { rng });
    battlePlayer(state).resources.mp = 100;
    return state;
}

function resolveTimedAbility(state, abilityName, seconds) {
    const started = activateAbility(state, abilityName);
    assert.equal(started.code, 'ability.started');
    advanceWorldTime(state, seconds);
    const resolved = reconcileAbilityActivation(state);
    assert.equal(resolved.code, 'ability.resolved');
    return resolved;
}

function battlePlayer(state) {
    return state.activeBattle.combatants.find((combatant) => combatant.type === 'player');
}

function battleEnemy(state) {
    return state.activeBattle.combatants.find((combatant) => combatant.type === 'enemy');
}
