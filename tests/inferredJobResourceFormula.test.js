import test from 'node:test';
import assert from 'node:assert/strict';

import { createPlayerCharacter } from '../js/text/entities/entityFactory.js';
import { getInferredJobHpMpGrades } from '../js/text/data/ffxiInferredJobGrades.js';
import { calculateInferredJobResources, canUseInferredJobResourceFormula } from '../js/text/systems/inferredJobResourceFormula.js';
import { calculateCombatProfile } from '../js/text/systems/statEngine.js';

test('Rune Fencer historical research uses inferred HP B and MP F resource grades', () => {
    const player = createPlayerCharacter({ raceId: 'hume', mainJobId: 'runeFencer', level: 1 });
    const inferred = calculateInferredJobResources(player);

    assert.equal(canUseInferredJobResourceFormula(player), true);
    assert.equal(getInferredJobHpMpGrades('runeFencer').hp, 'B');
    assert.equal(getInferredJobHpMpGrades('runeFencer').mp, 'F');
    assert.equal(inferred.resources.maxHp, 31);
    assert.equal(inferred.resources.maxMp, 16);
});

test('Blue Mage historical research retains inferred hybrid HP and MP grades', () => {
    const player = createPlayerCharacter({ raceId: 'hume', mainJobId: 'blueMage', level: 1 });
    const inferred = calculateInferredJobResources(player);

    assert.equal(getInferredJobHpMpGrades('blueMage').hp, 'D');
    assert.equal(getInferredJobHpMpGrades('blueMage').mp, 'D');
    assert.equal(inferred.resources.maxHp, 28);
    assert.equal(inferred.resources.maxMp, 20);
});

test('Dancer historical research has inferred HP but no native MP', () => {
    const player = createPlayerCharacter({ raceId: 'hume', mainJobId: 'dancer', level: 1 });
    const inferred = calculateInferredJobResources(player);

    assert.equal(getInferredJobHpMpGrades('dancer').hp, 'D');
    assert.equal(getInferredJobHpMpGrades('dancer').mp, 'X');
    assert.equal(inferred.resources.maxHp, 28);
    assert.equal(inferred.resources.maxMp, 0);
});

test('Geomancer inferred grades remain marked provisional through confidence metadata', () => {
    const grades = getInferredJobHpMpGrades('geomancer');
    const player = createPlayerCharacter({ raceId: 'tarutaru', mainJobId: 'geomancer', level: 1 });
    const inferred = calculateInferredJobResources(player);

    assert.equal(grades.confidence, 'medium');
    assert.equal(grades.hp, 'F');
    assert.equal(grades.mp, 'C');
    assert.equal(inferred.mainJobConfidence, 'medium');
    assert.equal(inferred.resources.maxMp, 28);
});

test('inferred historical resources are not canonical runtime authority', () => {
    const player = createPlayerCharacter({ raceId: 'hume', mainJobId: 'blueMage', level: 1 });
    const inferred = calculateInferredJobResources(player);
    const runtime = calculateCombatProfile(player);

    assert.equal(runtime.metadata.historicalReferenceRuntimeAuthority, false);
    assert.notEqual(runtime.resources.maxHp, inferred.resources.maxHp);
});
