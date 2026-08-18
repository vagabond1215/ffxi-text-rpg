import test from 'node:test';
import assert from 'node:assert/strict';

import { getAbility, listAbilities, listSpellSchools, validateAbilityCatalog } from '../js/text/data/abilities.js';
import { validateCapabilityCatalog } from '../js/text/data/capabilities.js';
import { getEquipmentCatalogEntry } from '../js/text/data/equipmentCatalog.js';
import { createNewGameState } from '../js/text/gameState.js';
import {
    ABILITY_INTERRUPT_PRIORITY,
    ABILITY_RUNTIME_STATE_VERSION,
    activateAbility,
    canActivateAbility,
    ensureAbilityRuntimeState,
    interruptActiveAbility,
    provideAbilityInterrupts,
    reconcileAbilityActivation,
    validateAbilityRuntimeState,
} from '../js/text/systems/abilityEngine.js';
import { grantCapability } from '../js/text/systems/capabilityEngine.js';
import { startEncounter } from '../js/text/systems/combatActionEngine.js';
import { listSemanticEvents } from '../js/text/systems/semanticEventEngine.js';
import { setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';
import { findTimedTask } from '../js/text/systems/timedTaskEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';
import { VERSION } from '../js/text/version.js';

test('original ability and spell-school catalogs validate against character capabilities', () => {
    assert.deepEqual(validateCapabilityCatalog(), []);
    assert.deepEqual(validateAbilityCatalog(), []);
    assert.equal(listSpellSchools().length, 3);
    assert.equal(listAbilities().length, 5);
    assert.equal(getAbility('ability-ember-dart').capabilityId, 'spell-ember-dart');
    assert.equal(listAbilities().some((entry) => ['Cure', 'Fire'].includes(entry.name)), false);
});

test('ability runtime state initializes lazily within the current game-state schema', () => {
    const state = createNewGameState();
    delete state.abilities;

    const abilityState = ensureAbilityRuntimeState(state);

    assert.equal(state.version, VERSION.gameState);
    assert.equal(abilityState.version, ABILITY_RUNTIME_STATE_VERSION);
    assert.deepEqual(abilityState.cooldowns, {});
    assert.equal(abilityState.active, null);
    assert.deepEqual(validateAbilityRuntimeState(abilityState), []);
});

test('ability activation rejects unknown and unlearned executable effects', () => {
    const state = createNewGameState({ mainJobId: 'elementalist' });

    assert.equal(activateAbility(state, 'missing-ability').code, 'ability.unknown');
    startEncounter(state, 'Brush Hare');
    const result = activateAbility(state, 'Ember Dart');
    assert.equal(result.ok, false);
    assert.equal(result.code, 'ability.capability-requirement');
    assert.equal(result.data.requirementCode, 'not-learned');
});

test('timed offensive magic spends once, resolves at canonical world time, starts cooldown, and releases its terminal task', () => {
    const state = createNewGameState({ mainJobId: 'elementalist' });
    grantCapability(state.player, 'spell-ember-dart');
    setLearnedSkill(state.player, 'elementalMagic', 1);
    state.player.resources.mp = 100;
    startEncounter(state, 'Brush Hare');
    const enemy = getBattleEnemy(state);
    enemy.resources.hp = 999;

    const started = activateAbility(state, 'Ember Dart');
    const taskId = started.data.activation.taskId;

    assert.equal(started.ok, true);
    assert.equal(started.code, 'ability.started');
    assert.equal(state.player.resources.mp, 90);
    assert.equal(state.abilities.active.abilityId, 'ability-ember-dart');
    assert.equal(reconcileAbilityActivation(state), null);

    advanceWorldTime(state, 5);
    assert.equal(reconcileAbilityActivation(state), null);
    assert.equal(enemy.resources.hp, 999);

    advanceWorldTime(state, 1);
    const resolved = reconcileAbilityActivation(state);

    assert.equal(resolved.ok, true);
    assert.equal(resolved.code, 'ability.resolved');
    assert.equal(resolved.data.activation.taskId, taskId);
    assert.equal(resolved.data.effects[0].type, 'damage');
    assert.ok(resolved.data.effects[0].amount > 0);
    assert.equal(enemy.resources.hp, 999 - resolved.data.effects[0].amount);
    assert.equal(state.player.resources.mp, 90);
    assert.equal(state.abilities.active, null);
    assert.equal(state.abilities.cooldowns['ability-ember-dart'], state.worldTime.totalSeconds + 12);
    assert.equal(findTimedTask(state, taskId), null);
    const [event] = listSemanticEvents(state, { type: 'ability.resolved' });
    assert.equal(event.data.taskId, taskId);

    const cooling = canActivateAbility(state, 'Ember Dart');
    assert.equal(cooling.ok, false);
    assert.equal(cooling.code, 'ability.cooldown');
});

test('instant technique spends its TP cost once before deterministic enemy-response TP gain', () => {
    const state = createNewGameState({ mainJobId: 'vanguard' });
    grantCapability(state.player, 'technique-guarded-cut');
    setLearnedSkill(state.player, 'sword', 1);
    state.player.equipment.mainHand = getEquipmentCatalogEntry('bronze-sword');
    state.player.resources.tp = 500;
    startEncounter(state, 'Brush Hare', { rng: () => 0 });

    const result = activateAbility(state, 'Guarded Cut');

    assert.equal(result.ok, true);
    assert.equal(result.code, 'ability.resolved');
    assert.equal(result.data.activation.costs.tp, 250);
    assert.equal(state.player.resources.tp, 280);
    assert.equal(result.data.enemyResponseActionIds.length, 1);
    assert.ok(state.player.statuses.some((status) => status.id === 'status-guarded-cut'));
    assert.equal(state.abilities.active, null);
});

test('restorative and support magic resolve outside combat through structured effects', () => {
    const healState = createNewGameState({ mainJobId: 'lifewarden' });
    grantCapability(healState.player, 'spell-mending-thread');
    setLearnedSkill(healState.player, 'healingMagic', 1);
    healState.player.resources.mp = 100;
    healState.player.resources.hp = 1;

    const healing = activateAbility(healState, 'Mending Thread');
    assert.equal(healing.code, 'ability.started');
    advanceWorldTime(healState, 5);
    const healed = reconcileAbilityActivation(healState);
    assert.equal(healed.data.effects[0].type, 'heal');
    assert.ok(healed.data.effects[0].amount > 0);
    assert.ok(healState.player.resources.hp > 1);

    const wardState = createNewGameState({ mainJobId: 'lifewarden' });
    grantCapability(wardState.player, 'spell-stone-ward');
    setLearnedSkill(wardState.player, 'enhancingMagic', 1);
    wardState.player.resources.mp = 100;

    const warding = activateAbility(wardState, 'Stone Ward');
    assert.equal(warding.code, 'ability.started');
    advanceWorldTime(wardState, 4);
    const warded = reconcileAbilityActivation(wardState);
    assert.equal(warded.data.effects[0].type, 'status');
    assert.ok(wardState.player.statuses.some((status) => status.id === 'status-stone-ward' && status.modifiers.defense === 4));
});

test('non-combat Waymark Reading resolves contextual world knowledge without revealing authored topology', () => {
    const state = createNewGameState({ mainJobId: 'wayfinder' });
    grantCapability(state.player, 'practical-waymark-reading');

    const started = activateAbility(state, 'Waymark Reading');
    assert.equal(started.code, 'ability.started');
    advanceWorldTime(state, 3);
    const resolved = reconcileAbilityActivation(state);
    const effect = resolved.data.effects[0];

    assert.equal(effect.type, 'context');
    assert.equal(effect.operation, 'survey-current-place');
    assert.equal(effect.placeId, state.currentPlaceId);
    assert.ok(effect.knownCoordinateCount >= 1);
    assert.equal(Object.hasOwn(effect, 'authoredCoordinateCount'), false);
});

test('interrupting a timed ability releases its cancelled task after the interruption event and keeps spent resources', () => {
    const state = createNewGameState({ mainJobId: 'lifewarden' });
    grantCapability(state.player, 'spell-mending-thread');
    setLearnedSkill(state.player, 'healingMagic', 1);
    state.player.resources.mp = 100;

    const started = activateAbility(state, 'Mending Thread');
    const taskId = started.data.activation.taskId;
    const interrupted = interruptActiveAbility(state, 'movement');

    assert.equal(interrupted.ok, true);
    assert.equal(interrupted.code, 'ability.interrupted');
    assert.equal(interrupted.data.costsRetained, true);
    assert.equal(interrupted.data.activation.taskId, taskId);
    assert.equal(state.player.resources.mp, 92);
    assert.equal(state.abilities.active, null);
    assert.equal(findTimedTask(state, taskId), null);
    assert.equal(state.abilities.cooldowns['ability-mending-thread'], undefined);

    const events = listSemanticEvents(state, { type: 'ability.interrupted' });
    assert.equal(events.length, 1);
    assert.equal(events[0].data.abilityId, 'ability-mending-thread');
    assert.equal(events[0].data.taskId, taskId);
    assert.equal(events[0].data.reason, 'movement');
});

test('ability completion interrupt outranks generic timed-task completion at the same boundary', () => {
    const state = createNewGameState({ mainJobId: 'lifewarden' });
    grantCapability(state.player, 'spell-mending-thread');
    setLearnedSkill(state.player, 'healingMagic', 1);
    state.player.resources.mp = 100;
    const started = activateAbility(state, 'Mending Thread');

    const candidates = provideAbilityInterrupts({
        state,
        nowWorldSeconds: state.worldTime.totalSeconds,
        horizonWorldSeconds: started.data.activation.completesAtWorldSeconds,
    });

    assert.equal(candidates.length, 1);
    assert.equal(candidates[0].type, 'ability.activation-complete');
    assert.equal(candidates[0].priority, ABILITY_INTERRUPT_PRIORITY);
    assert.ok(candidates[0].priority > 500);
});

test('ability lifecycle emits typed structured start and resolution events independent of display prose', () => {
    const state = createNewGameState({ mainJobId: 'wayfinder' });
    grantCapability(state.player, 'practical-waymark-reading');

    activateAbility(state, 'Waymark Reading');
    advanceWorldTime(state, 3);
    reconcileAbilityActivation(state);

    const started = listSemanticEvents(state, { type: 'ability.started' })[0];
    const resolved = listSemanticEvents(state, { type: 'ability.resolved' })[0];
    assert.equal(started.data.abilityId, 'ability-waymark-reading');
    assert.equal(started.data.capabilityId, 'practical-waymark-reading');
    assert.equal(resolved.data.abilityId, 'ability-waymark-reading');
    assert.equal(Array.isArray(resolved.data.effects), true);
    assert.equal(Object.hasOwn(resolved.data, 'message'), false);
});

function getBattleEnemy(state) {
    return state.activeBattle.combatants.find((combatant) => combatant.type === 'enemy');
}
