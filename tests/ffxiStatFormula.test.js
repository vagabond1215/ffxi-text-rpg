import test from 'node:test';
import assert from 'node:assert/strict';

import { createPlayerCharacter } from '../js/text/entities/entityFactory.js';
import { FFXI_JOB_GRADES, isNoMpGrade } from '../js/text/data/ffxiStatGrades.js';
import { calculateFfxiBaseProfile, calculateJobMp } from '../js/text/systems/ffxiStatFormula.js';
import { calculateCombatProfile } from '../js/text/systems/statEngine.js';

test('jobs with X MP grade produce no native job MP', () => {
    assert.equal(FFXI_JOB_GRADES.warrior.mp, 'X');
    assert.equal(isNoMpGrade(FFXI_JOB_GRADES.warrior.mp), true);
    assert.equal(calculateJobMp('X', 30, 'warrior'), 0);
});

test('race MP is locked out when main and support jobs have X/no MP', () => {
    const galkaWarrior = createPlayerCharacter({ raceId: 'galka', mainJobId: 'warrior', level: 1 });
    const profile = calculateFfxiBaseProfile(galkaWarrior);

    assert.equal(profile.resources.maxMp, 0);
});

test('caster jobs receive race and native job MP from grade formula', () => {
    const tarutaruBlackMage = createPlayerCharacter({ raceId: 'tarutaru', mainJobId: 'blackMage', level: 1 });
    const profile = calculateFfxiBaseProfile(tarutaruBlackMage);

    assert.equal(profile.resources.maxMp, 30);
    assert.equal(profile.attributes.int, 10);
});

test('stat engine uses FFXI formula for supported player jobs', () => {
    const humeWarrior = createPlayerCharacter({ raceId: 'hume', mainJobId: 'warrior', level: 1 });
    const profile = calculateCombatProfile(humeWarrior);

    assert.equal(profile.resources.maxHp, 31);
    assert.equal(profile.resources.maxMp, 0);
    assert.equal(profile.attributes.str, 8);
});
