import test from 'node:test';
import assert from 'node:assert/strict';

import { createEnemy, createPlayerCharacter } from '../js/text/entities/entityFactory.js';
import { createBattleState, performBasicAttack } from '../js/text/systems/battleEngine.js';
import { createSequenceRng } from '../js/text/systems/rng.js';

function createBattle(rngValues) {
    const player = createPlayerCharacter({ id: 'player-rng', name: 'Tester', level: 5 });
    const enemy = createEnemy({ id: 'enemy-rng', name: 'Target Dummy', level: 1 });
    const battle = createBattleState({ player, enemies: [enemy], rng: createSequenceRng(rngValues) });
    return { battle, playerId: 'player-rng', enemyId: 'enemy-rng' };
}

test('createSequenceRng loops through deterministic values', () => {
    const rng = createSequenceRng([0.1, 0.2]);

    assert.equal(rng(), 0.1);
    assert.equal(rng(), 0.2);
    assert.equal(rng(), 0.1);
});

test('performBasicAttack can deterministically hit', () => {
    const { battle, playerId, enemyId } = createBattle([0.01, 0.5]);

    performBasicAttack(battle, playerId, enemyId);

    assert.match(battle.log.join('\n'), /hits Target Dummy/);
});

test('performBasicAttack can deterministically miss', () => {
    const { battle, playerId, enemyId } = createBattle([0.99]);

    performBasicAttack(battle, playerId, enemyId);

    assert.match(battle.log.join('\n'), /misses Target Dummy/);
});

test('performBasicAttack uses deterministic damage variance', () => {
    const low = createBattle([0.01, 0]);
    const high = createBattle([0.01, 0.999999]);

    performBasicAttack(low.battle, low.playerId, low.enemyId);
    performBasicAttack(high.battle, high.playerId, high.enemyId);

    const lowHp = low.battle.combatants.find((combatant) => combatant.id === low.enemyId).resources.hp;
    const highHp = high.battle.combatants.find((combatant) => combatant.id === high.enemyId).resources.hp;
    assert.ok(highHp <= lowHp);
});
