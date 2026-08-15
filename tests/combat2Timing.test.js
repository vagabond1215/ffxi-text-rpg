import test from 'node:test';
import assert from 'node:assert/strict';

import { validateEnemyAbilityCatalog } from '../js/text/data/enemyAbilities.js';
import { createNewGameState } from '../js/text/gameState.js';
import { activateAbility, ensureAbilityRuntimeState } from '../js/text/systems/abilityEngine.js';
import { grantCapability } from '../js/text/systems/capabilityEngine.js';
import { performPlayerAttack, startEncounter } from '../js/text/systems/combatActionEngine.js';
import { advanceCombatSimulation } from '../js/text/systems/combatSimulationEngine.js';
import {
    COMBAT_CONTRACT_VERSION,
    getCombatantReadyAt,
    reconcileCombatStatuses,
    resolveEnemyReadyAction,
    selectEnemyAction,
    setCombatantReadyAt,
    validateCombatContract,
} from '../js/text/systems/combatTurnEngine.js';
import { createSequenceRng } from '../js/text/systems/rng.js';
import { listSemanticEvents } from '../js/text/systems/semanticEventEngine.js';
import { setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';
import { applyStatus } from '../js/text/systems/statusEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

test('Combat 2.0 timeline uses deterministic battle ids and fictional-time readiness', () => {
    const state = createNewGameState({ startWorldTimeSeconds: 120 });
    startEncounter(state, 'Mossback Goblin');
    const player = battlePlayer(state);
    const enemy = battleEnemy(state);

    assert.equal(state.activeBattle.id, 'battle-000001');
    assert.equal(state.activeBattle.contract.version, COMBAT_CONTRACT_VERSION);
    assert.equal(getCombatantReadyAt(state, player.id), 120);
    assert.equal(getCombatantReadyAt(state, enemy.id), 123);
    assert.deepEqual(validateCombatContract(state.activeBattle), []);
});

test('player actions establish recovery instead of allowing zero-time action spam', () => {
    const state = createNewGameState();
    startEncounter(state, 'Training Dummy', { rng: createSequenceRng([0.1, 0.5, 0.1, 0.5]) });

    performPlayerAttack(state);
    const second = performPlayerAttack(state);

    assert.match(second, /recovering for 3s/i);
    assert.equal(state.activeBattle.contract.actions.filter((entry) => entry.actorType === 'player').length, 1);
});

test('enemy readiness interrupt can strike and interrupt a timed canonical spell before completion', () => {
    const state = createNewGameState({ mainJobId: 'elementalist' });
    grantCapability(state.player, 'spell-ember-dart');
    setLearnedSkill(state.player, 'elementalMagic', 1);
    startEncounter(state, 'Mossback Goblin', { rng: createSequenceRng([0.1, 0.5]) });

    const started = activateAbility(state, 'ability-ember-dart');
    assert.equal(started.code, 'ability.started');

    const advanced = advanceCombatSimulation(state, 6);

    assert.equal(advanced.ok, true);
    assert.equal(advanced.secondsAdvanced, 3);
    assert.equal(advanced.interrupt.type, 'combat.enemy-ready');
    assert.equal(advanced.enemyResult.action.actorType, 'enemy');
    assert.equal(advanced.abilityInterrupt.code, 'ability.interrupted');
    assert.equal(ensureAbilityRuntimeState(state).active, null);
    assert.equal(state.worldTime.totalSeconds, 3);
    assert.equal(listSemanticEvents(state, { type: 'ability.interrupted' }).length, 1);
});

test('status duration is anchored to canonical world time and expires by deadline', () => {
    const state = createNewGameState({ startWorldTimeSeconds: 50 });
    applyStatus(state.player, {
        id: 'status-test-ward',
        name: 'Test Ward',
        durationSeconds: 10,
        modifiers: { defense: 1 },
    });
    reconcileCombatStatuses(state);

    assert.equal(state.player.statuses[0].appliedAtWorldSeconds, 50);
    assert.equal(state.player.statuses[0].expiresAtWorldSeconds, 60);
    advanceWorldTime(state, 10, { source: 'test' });
    reconcileCombatStatuses(state);
    assert.equal(state.player.statuses.some((status) => status.id === 'status-test-ward'), false);
});

test('representative enemy active ability is original data and selected deterministically', () => {
    assert.deepEqual(validateEnemyAbilityCatalog(), []);
    const state = createNewGameState();
    startEncounter(state, 'Redfang Raider');
    const enemy = battleEnemy(state);
    state.activeBattle.round = 3;
    setCombatantReadyAt(state, enemy.id, state.worldTime.totalSeconds);

    const selection = selectEnemyAction(state.activeBattle, enemy);
    assert.equal(selection.kind, 'enemyAbility');
    assert.equal(selection.sourceId, 'enemy-ability-rushing-cleave');

    const resolved = resolveEnemyReadyAction(state, enemy.id);
    assert.equal(resolved.ok, true);
    assert.equal(resolved.action.kind, 'enemyAbility');
    assert.equal(resolved.action.sourceId, 'enemy-ability-rushing-cleave');
});

function battlePlayer(state) {
    return state.activeBattle.combatants.find((combatant) => combatant.type === 'player');
}

function battleEnemy(state) {
    return state.activeBattle.combatants.find((combatant) => combatant.type === 'enemy');
}
