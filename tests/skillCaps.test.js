import test from 'node:test';
import assert from 'node:assert/strict';

import { getEffectiveSkill, getSkillCap, getSkillRank } from '../js/text/data/skillCaps.js';
import { createPlayerCharacter } from '../js/text/entities/entityFactory.js';

test('skill cap helper returns stable sparse rank values', () => {
    assert.equal(getSkillRank('warrior', 'axe'), 'A');
    assert.equal(getSkillCap('warrior', 'axe', 10), 30);
    assert.equal(getSkillCap('whiteMage', 'healingMagic', 10), 30);
    assert.equal(getSkillCap('warrior', 'elementalMagic', 10), 0);
});

test('effective skill uses character-owned learned value and current job cap', () => {
    const player = createPlayerCharacter({ mainJobId: 'warrior', level: 10 });
    player.progression.skills = {
        axe: 40,
    };

    const effective = getEffectiveSkill(player, 'axe');

    assert.equal(effective.rank, 'A');
    assert.equal(effective.learned, 40);
    assert.equal(effective.cap, 30);
    assert.equal(effective.effective, 30);
    assert.equal(effective.current, 30);
    assert.equal(effective.cappedForCurrentJob, true);
    assert.equal(effective.overCurrentCap, true);
    assert.equal(effective.confidence, 'placeholder');
});

test('effective skill defaults missing learned skill to zero instead of cap', () => {
    const player = createPlayerCharacter({ mainJobId: 'warrior', level: 10 });

    const effective = getEffectiveSkill(player, 'axe');

    assert.equal(effective.learned, 0);
    assert.equal(effective.cap, 30);
    assert.equal(effective.effective, 0);
    assert.equal(effective.cappedForCurrentJob, false);
});

test('unsupported current-job skill preserves learned value but has zero effective cap', () => {
    const player = createPlayerCharacter({ mainJobId: 'warrior', level: 10 });
    player.progression.skills = {
        elementalMagic: 25,
    };

    const effective = getEffectiveSkill(player, 'elementalMagic');

    assert.equal(effective.rank, null);
    assert.equal(effective.learned, 25);
    assert.equal(effective.cap, 0);
    assert.equal(effective.effective, 0);
    assert.equal(effective.overCurrentCap, true);
});
