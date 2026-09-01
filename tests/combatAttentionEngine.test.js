import test from 'node:test';
import assert from 'node:assert/strict';

import { createNewGameState } from '../js/text/gameState.js';
import { validatePersistedActiveBattle } from '../js/text/systems/activeBattlePersistence.js';
import { createBattleState } from '../js/text/systems/battleEngine.js';
import {
    addEnmity,
    clearFixation,
    ensureBattleAttentionState,
    getEnemyAttentionSnapshot,
    selectEnemyAttentionTarget,
    setAggroTarget,
    setAttentionBaseline,
    setFixation,
} from '../js/text/systems/combatAttentionEngine.js';
import { ensureCombatContract, initializeCombatTimeline, recordCombatAction } from '../js/text/systems/combatTurnEngine.js';

test('enemy attention normalizes enmity into focus and nonlinear selection weight', () => {
    const fixture = threeActorBattle();
    const { battle, enemy, player, tank, third } = fixture;

    setAttentionBaseline(battle, enemy.id, player.id, { baseline: 40 });
    setAttentionBaseline(battle, enemy.id, tank.id, { baseline: 40 });
    setAttentionBaseline(battle, enemy.id, third.id, { baseline: 20 });

    const snapshot = getEnemyAttentionSnapshot(battle, enemy.id);
    const rows = Object.fromEntries(snapshot.entries.map((entry) => [entry.actorId, entry]));

    assert.equal(rows[player.id].focus, 0.4);
    assert.equal(rows[tank.id].focus, 0.4);
    assert.equal(rows[third.id].focus, 0.2);
    assert.ok(Math.abs(rows[player.id].selectionShare - 0.47058823529411764) < 1e-12);
    assert.ok(Math.abs(rows[third.id].selectionShare - 0.058823529411764705) < 1e-12);
});

test('sticky aggro resists one attention swing but repeated high-enmity actions can transfer it', () => {
    const fixture = threeActorBattle();
    const { state, battle, enemy, player, tank, third } = fixture;

    setAttentionBaseline(battle, enemy.id, player.id, { baseline: 60 });
    setAttentionBaseline(battle, enemy.id, tank.id, { baseline: 20 });
    setAttentionBaseline(battle, enemy.id, third.id, { baseline: 10 });
    setAggroTarget(battle, enemy.id, player.id);

    const before = getEnemyAttentionSnapshot(battle, enemy.id).entries.find((entry) => entry.actorId === tank.id).focus;
    recordCombatAction(state, {
        actorId: tank.id,
        actorType: 'companion',
        targetId: enemy.id,
        kind: 'ability',
        sourceId: 'test-shield-check',
        outcome: 'resolved',
        data: { attention: { enmityBonus: 20, reason: 'shield-bash-stun' } },
    });
    const afterOne = getEnemyAttentionSnapshot(battle, enemy.id).entries.find((entry) => entry.actorId === tank.id).focus;

    assert.ok(afterOne > before);
    assert.equal(selectEnemyAttentionTarget(battle, enemy.id, { reassess: true }), player.id);

    recordCombatAction(state, {
        actorId: tank.id,
        actorType: 'companion',
        targetId: enemy.id,
        kind: 'ability',
        sourceId: 'test-shield-check',
        outcome: 'resolved',
        data: { attention: { enmityBonus: 90, reason: 'shield-bash-stun' } },
    });

    assert.equal(selectEnemyAttentionTarget(battle, enemy.id, { reassess: true }), tank.id);
    const low = getEnemyAttentionSnapshot(battle, enemy.id).entries.find((entry) => entry.actorId === third.id);
    assert.ok(low.selectionShare < 0.01);
});

test('fixation overrides ordinary switching while underlying enmity keeps changing', () => {
    const { battle, enemy, player, tank, third } = threeActorBattle();

    setAttentionBaseline(battle, enemy.id, player.id, { baseline: 20 });
    setAttentionBaseline(battle, enemy.id, tank.id, { baseline: 20 });
    setAttentionBaseline(battle, enemy.id, third.id, { baseline: 20 });
    setAggroTarget(battle, enemy.id, player.id);
    setFixation(battle, enemy.id, third.id, { reason: 'predator-fixation' });
    addEnmity(battle, enemy.id, tank.id, 200);

    assert.equal(selectEnemyAttentionTarget(battle, enemy.id, { reassess: true }), third.id);
    assert.equal(getEnemyAttentionSnapshot(battle, enemy.id).aggroTargetId, player.id);

    clearFixation(battle, enemy.id);
    assert.equal(selectEnemyAttentionTarget(battle, enemy.id, { reassess: true }), tank.id);
});

test('enmity decay and floors remain deterministic in fictional time', () => {
    const { battle, enemy, tank } = threeActorBattle();

    setAttentionBaseline(battle, enemy.id, tank.id, { baseline: 10, floor: 12, decayPerSecond: 2 }, { nowWorldSeconds: 0 });
    addEnmity(battle, enemy.id, tank.id, 10, { nowWorldSeconds: 0 });

    const atThree = getEnemyAttentionSnapshot(battle, enemy.id, { nowWorldSeconds: 3 }).entries.find((entry) => entry.actorId === tank.id);
    const atTen = getEnemyAttentionSnapshot(battle, enemy.id, { nowWorldSeconds: 10 }).entries.find((entry) => entry.actorId === tank.id);

    assert.equal(atThree.effectiveEnmity, 14);
    assert.equal(atTen.effectiveEnmity, 12);
});

test('attention is required durable active-battle state and rejects unknown actor links', () => {
    const { battle, enemy } = threeActorBattle();

    assert.deepEqual(validatePersistedActiveBattle(battle), []);
    battle.enmity.byEnemyId[enemy.id].entries['unknown-actor'] = {
        baseline: 1,
        transient: 0,
        floor: 0,
        decayPerSecond: 0,
        lastUpdatedAtWorldSeconds: 0,
    };

    assert.match(validatePersistedActiveBattle(battle).join('\n'), /unknown actor/);
});

function threeActorBattle() {
    const state = createNewGameState({ startWorldTimeSeconds: 0 });
    const player = structuredClone(state.player);
    const tank = structuredClone(state.player);
    const third = structuredClone(state.player);
    tank.id = 'attention-tank';
    tank.type = 'companion';
    tank.identity = { ...tank.identity, name: 'Shield Warden' };
    third.id = 'attention-third';
    third.type = 'companion';
    third.identity = { ...third.identity, name: 'Quiet Scout' };

    const enemyDefinition = (state.enemies ?? []).find((entry) => entry.identity?.name === 'Training Dummy') ?? state.enemies[0];
    const enemySource = structuredClone(enemyDefinition);
    enemySource.id = 'attention-enemy';

    const battle = createBattleState({
        id: 'battle-attention-test',
        player,
        allies: [tank, third],
        enemies: [enemySource],
        rng: () => 0,
    });
    state.activeBattle = battle;
    ensureCombatContract(battle, { nowWorldSeconds: 0, combatants: battle.combatants });
    initializeCombatTimeline(state, battle);
    ensureBattleAttentionState(battle, { nowWorldSeconds: 0 });

    return {
        state,
        battle,
        player: battle.combatants.find((entry) => entry.type === 'player'),
        tank: battle.combatants.find((entry) => entry.id === tank.id),
        third: battle.combatants.find((entry) => entry.id === third.id),
        enemy: battle.combatants.find((entry) => entry.type === 'enemy'),
    };
}
