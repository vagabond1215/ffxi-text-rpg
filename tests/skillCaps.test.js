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

test('effective skill reports current value cap rank and confidence metadata', () => {
    const player = createPlayerCharacter({ mainJobId: 'warrior', level: 10 });
    player.progression.skills = {
        axe: 40,
    };

    const effective = getEffectiveSkill(player, 'axe');

    assert.equal(effective.rank, 'A');
    assert.equal(effective.cap, 30);
    assert.equal(effective.current, 30);
    assert.equal(effective.capped, true);
    assert.equal(effective.confidence, 'placeholder');
});

test('effective skill defaults missing character-owned skill values to zero', () => {
    const player = createPlayerCharacter({ mainJobId: 'warrior', level: 10 });

    const effective = getEffectiveSkill(player, 'axe');

    assert.equal(effective.current, 0);
    assert.equal(effective.cap, 30);
    assert.equal(effective.capped, false);
});
