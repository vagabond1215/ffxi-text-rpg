import test from 'node:test';
import assert from 'node:assert/strict';

import { createPlayerCharacter } from '../js/text/entities/entityFactory.js';
import { switchMainJob } from '../js/text/systems/progressionEngine.js';
import {
    addLearnedSkill,
    describeSkillProgression,
    getEffectiveSkillForCurrentJob,
    getLearnedSkill,
    setLearnedSkill,
} from '../js/text/systems/skillProgressionEngine.js';

test('new character has character-owned skill state object', () => {
    const player = createPlayerCharacter();

    assert.deepEqual(player.progression.skills, {});
});

test('learned skills are character-owned and capped by current job', () => {
    const player = createPlayerCharacter({ mainJobId: 'warrior', level: 10 });

    setLearnedSkill(player, 'axe', 40);
    const effective = getEffectiveSkillForCurrentJob(player, 'axe');

    assert.equal(getLearnedSkill(player, 'axe'), 40);
    assert.equal(effective.cap, 30);
    assert.equal(effective.effective, 30);
    assert.equal(effective.overCurrentCap, true);
});

test('job switching changes effective cap without moving learned skill', () => {
    const player = createPlayerCharacter({ mainJobId: 'warrior', level: 10 });
    setLearnedSkill(player, 'axe', 20);

    switchMainJob(player, 'monk');
    const monkAxe = getEffectiveSkillForCurrentJob(player, 'axe');

    assert.equal(getLearnedSkill(player, 'axe'), 20);
    assert.equal(monkAxe.cap, 0);
    assert.equal(monkAxe.effective, 0);
    assert.equal(monkAxe.learned, 20);
});

test('skill gain clamps to current job cap by default', () => {
    const player = createPlayerCharacter({ mainJobId: 'warrior', level: 1 });

    const result = addLearnedSkill(player, 'axe', 99);

    assert.equal(result.ok, true);
    assert.equal(result.cap, 3);
    assert.equal(result.learned, 3);
    assert.equal(getLearnedSkill(player, 'axe'), 3);
});

test('skill description shows learned cap effective rank and confidence', () => {
    const player = createPlayerCharacter({ mainJobId: 'warrior', level: 10 });
    setLearnedSkill(player, 'axe', 40);

    const output = describeSkillProgression(player, 'axe');

    assert.match(output, /axe: learned 40/);
    assert.match(output, /cap 30/);
    assert.match(output, /effective 30/);
    assert.match(output, /rank A/);
    assert.match(output, /over current cap/);
});
