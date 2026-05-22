import test from 'node:test';
import assert from 'node:assert/strict';

import { getExpToNextLevel } from '../js/text/data/expTables.js';
import { createPlayerCharacter } from '../js/text/entities/entityFactory.js';
import {
    awardExperience,
    describeJobProgression,
    switchMainJob,
} from '../js/text/systems/progressionEngine.js';

function createPlayer(options = {}) {
    return createPlayerCharacter({ id: 'progression-player', name: 'Progression Tester', ...options });
}

test('awardExperience stores EXP without leveling when below threshold', () => {
    const player = createPlayer();
    const needed = getExpToNextLevel(1, player.jobs.levelCap);

    const result = awardExperience(player, needed - 1);

    assert.equal(result.ok, true);
    assert.deepEqual(result.levelUps, []);
    assert.equal(player.jobs.level, 1);
    assert.equal(player.progression.exp, needed - 1);
    assert.equal(player.progression.expToNext, needed);
});

test('awardExperience applies a single level-up and carries remainder EXP', () => {
    const player = createPlayer();
    const needed = getExpToNextLevel(1, player.jobs.levelCap);

    const result = awardExperience(player, needed + 25);

    assert.equal(result.ok, true);
    assert.deepEqual(result.levelUps, [2]);
    assert.equal(player.jobs.level, 2);
    assert.equal(player.jobs.jobLevels.warrior, 2);
    assert.equal(player.progression.exp, 25);
    assert.equal(player.progression.jobProgression.warrior.exp, 25);
    assert.equal(player.progression.expToNext, getExpToNextLevel(2, player.jobs.levelCap));
});

test('awardExperience can apply multiple level-ups in one grant', () => {
    const player = createPlayer();
    const grant = getExpToNextLevel(1, player.jobs.levelCap)
        + getExpToNextLevel(2, player.jobs.levelCap)
        + 10;

    const result = awardExperience(player, grant);

    assert.equal(result.ok, true);
    assert.deepEqual(result.levelUps, [2, 3]);
    assert.equal(player.jobs.level, 3);
    assert.equal(player.jobs.jobLevels.warrior, 3);
    assert.equal(player.progression.exp, 10);
    assert.equal(player.progression.jobProgression.warrior.level, 3);
});

test('awardExperience respects the current level cap', () => {
    const player = createPlayer({ level: 2, levelCap: 2 });

    const result = awardExperience(player, 999999);

    assert.equal(result.ok, true);
    assert.deepEqual(result.levelUps, []);
    assert.equal(player.jobs.level, 2);
    assert.equal(player.progression.exp, 999999);
    assert.equal(player.progression.expToNext, 0);
});

test('awardExperience refreshes HP MP and clamps TP after level-up', () => {
    const player = createPlayer();
    player.resources.hp = 1;
    player.resources.mp = 1;
    player.resources.tp = 999999;

    awardExperience(player, getExpToNextLevel(1, player.jobs.levelCap));

    assert.equal(player.resources.hp, player.combat.resources.maxHp);
    assert.equal(player.resources.mp, player.combat.resources.maxMp);
    assert.ok(player.resources.tp <= player.combat.resources.maxTp);
});

test('switchMainJob preserves independent EXP and levels per unlocked job', () => {
    const player = createPlayer();
    awardExperience(player, getExpToNextLevel(1, player.jobs.levelCap) + 33);

    const switchResult = switchMainJob(player, 'monk');
    assert.equal(switchResult.ok, true);
    assert.equal(player.jobs.mainJobId, 'monk');
    assert.equal(player.jobs.level, 1);
    assert.equal(player.progression.exp, 0);

    awardExperience(player, 44);
    assert.equal(player.progression.jobProgression.monk.exp, 44);

    const back = switchMainJob(player, 'warrior');
    assert.equal(back.ok, true);
    assert.equal(player.jobs.mainJobId, 'warrior');
    assert.equal(player.jobs.level, 2);
    assert.equal(player.progression.exp, 33);
    assert.equal(player.progression.jobProgression.monk.exp, 44);
});

test('switchMainJob rejects locked jobs without mutating active job', () => {
    const player = createPlayer();

    const result = switchMainJob(player, 'paladin');

    assert.equal(result.ok, false);
    assert.match(result.message, /not unlocked/);
    assert.equal(player.jobs.mainJobId, 'warrior');
});

test('switchMainJob refreshes combat resources and clears TP by default', () => {
    const player = createPlayer();
    player.resources.hp = 1;
    player.resources.mp = 1;
    player.resources.tp = 1000;

    switchMainJob(player, 'monk');

    assert.equal(player.resources.hp, player.combat.resources.maxHp);
    assert.equal(player.resources.mp, player.combat.resources.maxMp);
    assert.equal(player.resources.tp, 0);
});

test('describeJobProgression lists active and unlocked jobs', () => {
    const player = createPlayer();
    switchMainJob(player, 'monk');

    const output = describeJobProgression(player);

    assert.match(output, /Warrior/);
    assert.match(output, /Monk/);
    assert.match(output, /Monk .*\*active\*/);
});
