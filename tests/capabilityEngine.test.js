import test from 'node:test';
import assert from 'node:assert/strict';

import { getCapability, validateCapabilityCatalog } from '../js/text/data/capabilities.js';
import { getEquipmentCatalogEntry } from '../js/text/data/equipmentCatalog.js';
import { createPlayerCharacter } from '../js/text/entities/entityFactory.js';
import {
    CAPABILITY_STATE_VERSION,
    canUseCapability,
    ensureCapabilityState,
    learnCapability,
    knowsCapability,
    validateCapabilityState,
} from '../js/text/systems/capabilityEngine.js';
import { switchMainJob } from '../js/text/systems/progressionEngine.js';
import { addLearnedSkill, getLearnedSkill, setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';

test('representative capability catalog validates learning and use references', () => {
    assert.deepEqual(validateCapabilityCatalog(), []);
    assert.equal(getCapability('technique-guarded-cut').learning.open, false);
    assert.equal(getCapability('practical-field-dressing').learning.open, true);
});

test('new players own an additive versioned character capability state', () => {
    const player = createPlayerCharacter({ mainJobId: 'vanguard' });

    assert.equal(player.progression.capabilities.version, CAPABILITY_STATE_VERSION);
    assert.deepEqual(player.progression.capabilities.known, {});
    assert.deepEqual(validateCapabilityState(player), []);
});

test('discipline training can teach a capability but does not own it after learning', () => {
    const player = createPlayerCharacter({ mainJobId: 'shadowhand', level: 1 });
    setLearnedSkill(player, 'dagger', 1);

    const learned = learnCapability(player, 'technique-shadow-feint', { worldSeconds: 120 });
    assert.equal(learned.ok, true);
    assert.equal(learned.record.learnedFromDisciplineId, 'shadowhand');

    switchMainJob(player, 'vanguard');
    player.equipment.mainHand = getEquipmentCatalogEntry('bronze-dagger');
    player.resources.tp = 500;

    const usable = canUseCapability(player, 'technique-shadow-feint', { type: 'combat' });
    assert.equal(knowsCapability(player, 'technique-shadow-feint'), true);
    assert.equal(usable.ok, true);
    assert.equal(usable.activeDisciplineId, 'vanguard');
    assert.equal(usable.disciplineUseGate, false);
});

test('historical discipline training records satisfy learning without requiring that discipline to be active', () => {
    const player = createPlayerCharacter({ mainJobId: 'vanguard', level: 1 });
    player.progression.jobProgression.spellblade.level = 2;
    player.jobs.jobLevels.spellblade = 2;

    const result = learnCapability(player, 'technique-guarded-cut');

    assert.equal(result.ok, true);
    assert.equal(result.record.learnedFromDisciplineId, 'vanguard');

    const second = createPlayerCharacter({ mainJobId: 'pugilist', level: 1 });
    second.progression.jobProgression.spellblade.level = 2;
    second.jobs.jobLevels.spellblade = 2;
    const learnedFromInactive = learnCapability(second, 'technique-guarded-cut');
    assert.equal(learnedFromInactive.ok, true);
    assert.equal(learnedFromInactive.record.learnedFromDisciplineId, 'spellblade');
});

test('capability use checks learned proficiency equipment context and resources independently', () => {
    const player = createPlayerCharacter({ mainJobId: 'vanguard', level: 1 });
    learnCapability(player, 'technique-guarded-cut');

    let result = canUseCapability(player, 'technique-guarded-cut', { type: 'combat' });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'insufficient-skill');

    setLearnedSkill(player, 'sword', 1);
    result = canUseCapability(player, 'technique-guarded-cut', { type: 'combat' });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'equipment-requirement');

    player.equipment.mainHand = getEquipmentCatalogEntry('bronze-sword');
    player.resources.tp = 100;
    result = canUseCapability(player, 'technique-guarded-cut', { type: 'combat' });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'resource-requirement');

    player.resources.tp = 500;
    result = canUseCapability(player, 'technique-guarded-cut', { type: 'travel' });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'invalid-context');

    result = canUseCapability(player, 'technique-guarded-cut', { type: 'combat' });
    assert.equal(result.ok, true);
});

test('practical capabilities use tool and world-context requirements rather than discipline identity', () => {
    const player = createPlayerCharacter({ mainJobId: 'elementalist' });
    const learned = learnCapability(player, 'practical-field-dressing', { source: 'instruction' });
    assert.equal(learned.ok, true);

    let result = canUseCapability(player, 'practical-field-dressing', { type: 'resourceRecovery' });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'tool-requirement');

    result = canUseCapability(player, 'practical-field-dressing', {
        type: 'resourceRecovery',
        toolTags: ['cutting'],
    });
    assert.equal(result.ok, true);
    assert.equal(result.disciplineUseGate, false);
});

test('active discipline training caps cannot erase character-owned proficiency', () => {
    const player = createPlayerCharacter({ mainJobId: 'vanguard', level: 10 });
    setLearnedSkill(player, 'axe', 20);
    switchMainJob(player, 'pugilist');

    const result = addLearnedSkill(player, 'axe', 1);

    assert.equal(result.ok, true);
    assert.equal(result.trainingCap, 0);
    assert.equal(result.gained, 0);
    assert.equal(result.learned, 20);
    assert.equal(getLearnedSkill(player, 'axe'), 20);
});

test('missing capability state initializes lazily without a persistence-version migration', () => {
    const player = createPlayerCharacter({ mainJobId: 'vanguard' });
    delete player.progression.capabilities;

    const state = ensureCapabilityState(player);

    assert.equal(state.version, CAPABILITY_STATE_VERSION);
    assert.deepEqual(state.known, {});
});
