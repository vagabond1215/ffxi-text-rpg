import test from 'node:test';
import assert from 'node:assert/strict';

import { createEnemy, createPlayerCharacter } from '../js/text/entities/entityFactory.js';
import { calculateCombatProfile } from '../js/text/systems/statEngine.js';
import { createBattleState, performBasicAttack } from '../js/text/systems/battleEngine.js';


test('player factory creates a combat-ready character', () => {
    const player = createPlayerCharacter({ name: 'Tester', raceId: 'hume', mainJobId: 'warrior', level: 1 });
    const profile = calculateCombatProfile(player);

    assert.equal(player.type, 'player');
    assert.equal(player.identity.name, 'Tester');
    assert.ok(profile.resources.maxHp > 0);
    assert.ok(profile.derived.attack > 0);
});

test('enemy factory creates a combat-ready enemy', () => {
    const enemy = createEnemy({ name: 'Forest Hare', level: 1, family: 'beast' });
    const profile = calculateCombatProfile(enemy);

    assert.equal(enemy.type, 'enemy');
    assert.equal(enemy.identity.family, 'beast');
    assert.ok(profile.resources.maxHp > 0);
});

test('battle engine can perform a basic attack without crashing', () => {
    const player = createPlayerCharacter({ id: 'player-test', level: 1 });
    const enemy = createEnemy({ id: 'enemy-test', level: 1 });
    const battle = createBattleState({ player, enemies: [enemy] });

    performBasicAttack(battle, 'player-test', 'enemy-test');

    assert.ok(battle.log.length >= 2);
    assert.ok(['active', 'victory', 'defeat'].includes(battle.phase));
});
