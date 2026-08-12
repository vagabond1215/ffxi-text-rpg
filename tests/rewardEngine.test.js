import test from 'node:test';
import assert from 'node:assert/strict';

import { getExpToNextLevel } from '../js/text/data/expTables.js';
import { createEnemy, createPlayerCharacter } from '../js/text/entities/entityFactory.js';
import { createBattleState, getCombatant } from '../js/text/systems/battleEngine.js';
import { resolveBattleRewards } from '../js/text/systems/rewardEngine.js';
import { createSequenceRng } from '../js/text/systems/rng.js';

function createStateWithBattle({ inventoryFill = 0, rngValues = [0], expValue = 35 } = {}) {
    const player = createPlayerCharacter({ id: 'reward-player', name: 'Reward Tester', level: 1 });
    for (let index = 0; index < inventoryFill; index += 1) {
        player.inventoryState.containers.inventory.items.push({ id: `filler-${index}`, name: `Filler ${index}`, kind: 'misc', quantity: 1 });
    }
    const enemy = createEnemy({
        id: 'reward-hare',
        name: 'Reward Hare',
        family: 'hare',
        ecosystem: 'beast',
        zoneId: 'west-elderwood',
        level: 1,
        expValue,
        lootTableId: 'starterBeast',
    });
    const state = { player, currentPlaceId: 'west-elderwood' };
    const battle = createBattleState({ player, enemies: [enemy], rng: createSequenceRng(rngValues) });
    const combatant = getCombatant(battle, 'reward-hare');
    combatant.resources.hp = 0;
    combatant.battle.defeated = true;
    battle.phase = 'victory';
    return { state, battle };
}

test('resolveBattleRewards awards EXP and currency while leaving creature materials as recoverable world resources', () => {
    const { state, battle } = createStateWithBattle({ rngValues: [0] });

    const result = resolveBattleRewards(state, battle);

    assert.equal(result.ok, true);
    assert.equal(result.exp, 35);
    assert.equal(result.gil, 3);
    assert.equal(state.player.progression.exp, 35);
    assert.equal(state.player.wallet.gil, 3);
    assert.deepEqual(result.items, []);
    assert.equal(result.resourceOpportunities.length, 1);
    assert.equal(result.resourceOpportunities[0].sourceName, 'Reward Hare');
    assert.equal(result.resourceOpportunities[0].type, 'body');
    assert.equal(result.resourceOpportunities[0].actions[0].id, 'skin');
    assert.equal(state.player.inventoryState.containers.inventory.items.length, 0);
    assert.match(result.message, /Materials remain in the world/);
});

test('resolveBattleRewards can level the player through the progression engine', () => {
    const expValue = getExpToNextLevel(1) + 15;
    const { state, battle } = createStateWithBattle({ rngValues: [1], expValue });

    const result = resolveBattleRewards(state, battle);

    assert.equal(result.ok, true);
    assert.deepEqual(result.progression.levelUps, [2]);
    assert.equal(state.player.jobs.level, 2);
    assert.equal(state.player.jobs.jobLevels.vanguard, 2);
    assert.equal(state.player.progression.exp, 15);
    assert.match(result.message, /Level up: 2/);
});

test('resolveBattleRewards does not pay twice or create duplicate resource opportunities', () => {
    const { state, battle } = createStateWithBattle({ rngValues: [0] });

    const first = resolveBattleRewards(state, battle);
    const second = resolveBattleRewards(state, battle);

    assert.equal(first.ok, true);
    assert.equal(second.duplicate, true);
    assert.equal(state.player.progression.exp, 35);
    assert.equal(state.player.wallet.gil, 3);
    assert.equal(state.resourceOpportunities.records.length, 1);
});

test('resource opportunities can be created even when inventory is full because recovery happens later', () => {
    const { state, battle } = createStateWithBattle({ inventoryFill: 30, rngValues: [0] });

    const result = resolveBattleRewards(state, battle);

    assert.equal(result.ok, true);
    assert.equal(result.resourceOpportunities.length, 1);
    assert.equal(state.player.inventoryState.containers.inventory.items.length, 30);
    assert.equal(state.player.progression.exp, 35);
    assert.equal(state.player.wallet.gil, 3);
});

test('resolveBattleRewards requires victory', () => {
    const { state, battle } = createStateWithBattle({ rngValues: [0] });
    battle.phase = 'active';

    const result = resolveBattleRewards(state, battle);

    assert.equal(result.ok, false);
    assert.match(result.message, /require victory/);
});
