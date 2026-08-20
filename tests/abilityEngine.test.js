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
    assert.equal(listAbilities().length, 13);
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
});

test('ability activation rejects unknown and unlearned executable effects', () => {
    const state = createNewGameState({ mainJobId: 'elementalist' });
    assert.equal(activateAbility(state, 'not-real').ok, false);
    assert.equal(activateAbility(state, 'ability-ember-dart').ok, false);
});

test('timed offensive magic spends once, resolves at canonical world time, starts cooldown, and releases its terminal task', () => {
    const state = createNewGameState({ mainJobId: 'elementalist' });
    grantCapability(state.player, 'spell-ember-dart', { source: 'training', worldSeconds: state.worldTime.totalSeconds });
    setLearnedSkill(state.player, 'elementalMagic', 1);
    startEncounter(state, 'Training Dummy', { rng: () => 0 });
    const beforeMp = state.player.resources.mp;

    const started = activateAbility(state, 'Ember Dart');
    assert.equal(started.ok, true, started.display?.text);
    assert.equal(started.code, 'ability.started');
    assert.equal(state.player.resources.mp, beforeMp - 10);
    const taskId = started.data.activation.taskId;
    assert.ok(findTimedTask(state, taskId));

    advanceWorldTime(state, 6);
    const resolved = reconcileAbilityActivation(state, { rng: () => 0 });
    assert.equal(resolved.ok, true, resolved.display?.text);
    assert.equal(resolved.code, 'ability.resolved');
    assert.equal(state.player.resources.mp, beforeMp - 10);
    assert.equal(state.abilities.active, null);
    assert.equal(findTimedTask(state, taskId), null);
    assert.equal(state.abilities.cooldowns['ability-ember-dart'], state.worldTime.totalSeconds + 12);
});

test('instant technique spends its TP cost once before deterministic enemy-response TP gain', () => {
    const state = createNewGameState({ mainJobId: 'vanguard' });
    grantCapability(state.player, 'technique-guarded-cut', { source: 'training', worldSeconds: state.worldTime.totalSeconds });
    setLearnedSkill(state.player, 'sword', 1);
    state.player.equipment.mainHand = getEquipmentCatalogEntry('bronze-sword');
    state.player.resources.tp = 400;
    startEncounter(state, 'Training Dummy', { rng: () => 0 });

    const result = activateAbility(state, 'Guarded Cut');
    assert.equal(result.ok, true, result.display?.text);
    assert.equal(result.code, 'ability.resolved');
    assert.ok(state.player.resources.tp >= 0);
    assert.equal(result.data.activation.costs.tp, 250);
    assert.equal(state.abilities.active, null);
});

test('restorative and support magic resolve outside combat through structured effects', () => {
    const state = createNewGameState({ mainJobId: 'lifewarden' });
    grantCapability(state.player, 'spell-mending-thread', { source: 'training', worldSeconds: state.worldTime.totalSeconds });
    grantCapability(state.player, 'spell-stone-ward', { source: 'training', worldSeconds: state.worldTime.totalSeconds });
    setLearnedSkill(state.player, 'healingMagic', 1);
    setLearnedSkill(state.player, 'enhancingMagic', 1);
    state.player.resources.hp = Math.max(1, state.player.resources.hp - 10);

    const healing = activateAbility(state, 'Mending Thread');
    assert.equal(healing.ok, true);
    advanceWorldTime(state, 5);
    const healingResolved = reconcileAbilityActivation(state);
    assert.equal(healingResolved.ok, true);
    assert.equal(healingResolved.data.effects[0].type, 'heal');

    const ward = activateAbility(state, 'Stone Ward');
    assert.equal(ward.ok, true);
    advanceWorldTime(state, 4);
    const wardResolved = reconcileAbilityActivation(state);
    assert.equal(wardResolved.ok, true);
    assert.equal(wardResolved.data.effects[0].type, 'status');
    assert.ok(state.player.statuses.some((entry) => entry.id === 'status-stone-ward'));
});

test('non-combat Waymark Reading resolves contextual world knowledge without revealing authored topology', () => {
    const state = createNewGameState({ mainJobId: 'wayfinder' });
    grantCapability(state.player, 'practical-waymark-reading', { source: 'training', worldSeconds: state.worldTime.totalSeconds });

    const started = activateAbility(state, 'Waymark Reading');
    assert.equal(started.ok, true);
    assert.equal(started.code, 'ability.started');
    advanceWorldTime(state, 3);
    const resolved = reconcileAbilityActivation(state);
    assert.equal(resolved.ok, true);
    assert.equal(resolved.data.effects[0].type, 'context');
    assert.equal(resolved.data.effects[0].operation, 'survey-current-place');
    assert.equal(resolved.display.text.includes('coordinate'), false);
});

test('interrupting a timed ability releases its cancelled task after the interruption event and keeps spent resources', () => {
    const state = createNewGameState({ mainJobId: 'elementalist' });
    grantCapability(state.player, 'spell-ember-dart', { source: 'training', worldSeconds: state.worldTime.totalSeconds });
    setLearnedSkill(state.player, 'elementalMagic', 1);
    startEncounter(state, 'Training Dummy', { rng: () => 0 });
    const beforeMp = state.player.resources.mp;

    const started = activateAbility(state, 'Ember Dart');
    const taskId = started.data.activation.taskId;
    const interrupted = interruptActiveAbility(state, { reason: 'test' });

    assert.equal(interrupted.ok, true);
    assert.equal(state.player.resources.mp, beforeMp - 10);
    assert.equal(state.abilities.active, null);
    assert.equal(findTimedTask(state, taskId), null);
    const events = listSemanticEvents(state, { types: ['ability.interrupted'] });
    assert.ok(events.some((event) => event.data.taskId === taskId));
});

test('ability completion interrupt outranks generic timed-task completion at the same boundary', () => {
    const state = createNewGameState({ mainJobId: 'elementalist' });
    grantCapability(state.player, 'spell-ember-dart', { source: 'training', worldSeconds: state.worldTime.totalSeconds });
    setLearnedSkill(state.player, 'elementalMagic', 1);
    startEncounter(state, 'Training Dummy', { rng: () => 0 });
    const started = activateAbility(state, 'Ember Dart');
    const interrupts = provideAbilityInterrupts(state);

    assert.equal(interrupts.length, 1);
    assert.equal(interrupts[0].atWorldSeconds, started.data.activation.completesAtWorldSeconds);
    assert.equal(interrupts[0].priority, ABILITY_INTERRUPT_PRIORITY);
});

test('ability lifecycle emits typed structured start and resolution events independent of display prose', () => {
    const state = createNewGameState({ mainJobId: 'elementalist' });
    grantCapability(state.player, 'spell-ember-dart', { source: 'training', worldSeconds: state.worldTime.totalSeconds });
    setLearnedSkill(state.player, 'elementalMagic', 1);
    startEncounter(state, 'Training Dummy', { rng: () => 0 });

    activateAbility(state, 'Ember Dart');
    advanceWorldTime(state, 6);
    reconcileAbilityActivation(state, { rng: () => 0 });

    const events = listSemanticEvents(state, { types: ['ability.started', 'ability.resolved'] });
    assert.equal(events.length, 2);
    assert.equal(events[0].data.abilityId, 'ability-ember-dart');
    assert.equal(events[1].data.abilityId, 'ability-ember-dart');
});
