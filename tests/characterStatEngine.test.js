import test from 'node:test';
import assert from 'node:assert/strict';

import { getExpToNextLevel } from '../js/text/data/expTables.js';
import { createPlayerCharacter } from '../js/text/entities/entityFactory.js';
import {
    CHARACTER_STAT_MODEL_ID,
    CHARACTER_STAT_STATE_VERSION,
    ensureCharacterStatState,
    getActiveDisciplineStatContext,
    validateCharacterStatState,
} from '../js/text/systems/characterStatEngine.js';
import { calculateFfxiBaseProfile } from '../js/text/systems/ffxiStatFormula.js';
import {
    awardExperience,
    CHARACTER_PROGRESSION_STATE_VERSION,
    getCharacterProgressionSummary,
    switchMainJob,
} from '../js/text/systems/progressionEngine.js';
import { calculateCombatProfile } from '../js/text/systems/statEngine.js';

const CANONICAL_ANCESTRIES = ['human', 'lethari', 'miri', 'veyra', 'korren'];

test('new players own a versioned canonical stat state and character progression record', () => {
    const player = createPlayerCharacter({ raceId: 'human', mainJobId: 'vanguard' });

    assert.equal(player.statState.version, CHARACTER_STAT_STATE_VERSION);
    assert.equal(player.statState.ancestryId, 'human');
    assert.equal(player.statState.provenance.kind, 'originalDesign');
    assert.equal(player.statState.provenance.modelId, CHARACTER_STAT_MODEL_ID);
    assert.equal(player.statState.provenance.confidence, 'provisional');
    assert.equal(player.progression.character.version, CHARACTER_PROGRESSION_STATE_VERSION);
    assert.equal(player.progression.character.totalExperience, 0);
    assert.equal(player.progression.character.highestDisciplineLevel, 1);
    assert.deepEqual(validateCharacterStatState(player.statState), []);
});

test('canonical ancestry stat states validate without legacy identity leakage', () => {
    for (const ancestryId of CANONICAL_ANCESTRIES) {
        const player = createPlayerCharacter({ raceId: ancestryId, mainJobId: 'vanguard' });
        const state = ensureCharacterStatState(player);

        assert.equal(state.ancestryId, ancestryId);
        assert.equal(state.provenance.modelId, CHARACTER_STAT_MODEL_ID);
        assert.deepEqual(validateCharacterStatState(state), []);
        assert.ok(Object.values(state.base.attributes).every((value) => Number.isInteger(value) && value > 0));
    }
});

test('active discipline is a contextual stat modifier rather than owner of character base stats', () => {
    const player = createPlayerCharacter({ raceId: 'human', mainJobId: 'vanguard' });
    const baseBefore = structuredClone(player.statState.base);
    const vanguardContext = getActiveDisciplineStatContext(player);
    const vanguardProfile = calculateCombatProfile(player);

    const result = switchMainJob(player, 'lifewarden');
    const lifewardenContext = getActiveDisciplineStatContext(player);
    const lifewardenProfile = calculateCombatProfile(player);

    assert.equal(result.ok, true);
    assert.deepEqual(player.statState.base, baseBefore);
    assert.equal(vanguardContext.provenance.capabilityGate, false);
    assert.equal(lifewardenContext.provenance.capabilityGate, false);
    assert.ok(vanguardProfile.attributes.str > lifewardenProfile.attributes.str);
    assert.ok(lifewardenProfile.attributes.mnd > vanguardProfile.attributes.mnd);
    assert.ok(lifewardenProfile.resources.maxMp > vanguardProfile.resources.maxMp);
});

test('highest attained discipline rank grows character base and switching lower training cannot reduce it', () => {
    const player = createPlayerCharacter({ raceId: 'lethari', mainJobId: 'vanguard' });
    const rankOneHp = player.statState.base.resources.maxHp;
    const needed = getExpToNextLevel(1, player.jobs.levelCap);

    awardExperience(player, needed);

    assert.equal(player.jobs.level, 2);
    assert.equal(player.statState.growthRank, 2);
    assert.ok(player.statState.base.resources.maxHp > rankOneHp);

    switchMainJob(player, 'pugilist');

    assert.equal(player.jobs.level, 1);
    assert.equal(player.statState.growthRank, 2);
    assert.equal(getCharacterProgressionSummary(player).highestDisciplineLevel, 2);
});

test('character-owned lifetime training accumulates across discipline records', () => {
    const player = createPlayerCharacter({ raceId: 'veyra', mainJobId: 'shadowhand' });

    awardExperience(player, 40);
    switchMainJob(player, 'pugilist');
    awardExperience(player, 60);

    const summary = getCharacterProgressionSummary(player);
    assert.equal(summary.totalExperience, 100);
    assert.equal(summary.activeDisciplineId, 'pugilist');
    assert.equal(player.progression.jobProgression.shadowhand.exp, 40);
    assert.equal(player.progression.jobProgression.pugilist.exp, 60);
});

test('historical FFXI stat research remains callable as reference but is not runtime authority', () => {
    const player = createPlayerCharacter({ raceId: 'hume', mainJobId: 'warrior', level: 1 });
    const historical = calculateFfxiBaseProfile(player);
    const runtime = calculateCombatProfile(player);

    assert.equal(historical.resources.maxHp, 31);
    assert.equal(historical.attributes.str, 8);
    assert.equal(runtime.metadata.baseModelId, CHARACTER_STAT_MODEL_ID);
    assert.equal(runtime.metadata.historicalReferenceRuntimeAuthority, false);
    assert.notEqual(runtime.resources.maxHp, historical.resources.maxHp);
});

test('missing additive character stat/progression state initializes lazily without save-version migration', () => {
    const player = createPlayerCharacter({ raceId: 'korren', mainJobId: 'vanguard' });
    delete player.statState;
    delete player.progression.character;

    const stats = ensureCharacterStatState(player);
    const progression = getCharacterProgressionSummary(player);

    assert.equal(stats.version, CHARACTER_STAT_STATE_VERSION);
    assert.equal(progression.version, CHARACTER_PROGRESSION_STATE_VERSION);
    assert.equal(stats.ancestryId, 'korren');
});
