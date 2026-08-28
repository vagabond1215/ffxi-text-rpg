import test from 'node:test';
import assert from 'node:assert/strict';

import {
    getAbility,
    listAbilities,
    listSpellSchools,
    validateAbilityCatalog,
} from '../js/text/data/abilities.js';
import {
    getCapability,
    listCapabilities,
    validateCapabilityCatalog,
} from '../js/text/data/capabilities.js';
import {
    REGIONAL_CONTENT_PACKS,
    SHARED_FOUNDATION_PACK,
} from '../js/text/data/regionalContentPacks.js';
import { createNewGameState } from '../js/text/gameState.js';
import {
    activateAbility,
    reconcileAbilityActivation,
} from '../js/text/systems/abilityEngine.js';
import { learnCapability } from '../js/text/systems/capabilityEngine.js';
import { validateContentPacks } from '../js/text/systems/contentPackValidator.js';
import { startEncounter } from '../js/text/systems/combatActionEngine.js';
import { setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

const REGION_TAGS = new Set(['redstone', 'elderwood', 'starfen']);

test('canonical magic is universal shared content rather than regional ownership', () => {
    assert.deepEqual(validateCapabilityCatalog(), []);
    assert.deepEqual(validateAbilityCatalog(), []);
    assert.deepEqual(validateContentPacks(REGIONAL_CONTENT_PACKS), []);

    const spells = listCapabilities().filter((entry) => entry.type === 'spell');
    const spellAbilities = listAbilities().filter((entry) => entry.kind === 'spell');
    assert.equal(spells.length, 33);
    assert.equal(spellAbilities.length, 33);

    for (const spell of spells) {
        assert.equal(spell.tags.some((tag) => REGION_TAGS.has(tag)), false, `${spell.id} must not be region-tagged`);
        assert.ok(SHARED_FOUNDATION_PACK.records.capabilities.some((entry) => entry.id === spell.id), `${spell.id} must be shared-owned`);
    }
    for (const ability of spellAbilities) {
        assert.equal(ability.tags.some((tag) => REGION_TAGS.has(tag)), false, `${ability.id} must not be region-tagged`);
        assert.ok(SHARED_FOUNDATION_PACK.records.abilities.some((entry) => entry.id === ability.id), `${ability.id} must be shared-owned`);
    }

    for (const pack of REGIONAL_CONTENT_PACKS.filter((entry) => entry.id !== SHARED_FOUNDATION_PACK.id)) {
        for (const record of pack.records.capabilities) {
            assert.notEqual(getCapability(record.id)?.type, 'spell', `${pack.id} must not own spell ${record.id}`);
        }
        for (const record of pack.records.abilities) {
            assert.notEqual(getAbility(record.id)?.kind, 'spell', `${pack.id} must not own spell ability ${record.id}`);
        }
    }
});

test('universal magic covers eight elemental families plus Veilscript ninjutsu', () => {
    assert.deepEqual(listSpellSchools().map((entry) => entry.id), [
        'school-elemental-form',
        'school-vital-weave',
        'school-ward-lore',
        'school-veilscript',
    ]);
    assert.equal(listAbilities().length, 41);
    assert.equal(listCapabilities().length, 44);

    const spellTags = new Set(listCapabilities().filter((entry) => entry.type === 'spell').flatMap((entry) => entry.tags));
    for (const element of ['fire', 'earth', 'wind', 'water', 'lightning', 'ice', 'light', 'dark']) {
        assert.equal(spellTags.has(element), true, `missing universal ${element} magic family`);
    }

    const veilscript = listCapabilities().filter((entry) => entry.tags.includes('veilscript'));
    assert.deepEqual(veilscript.map((entry) => entry.id), [
        'spell-fracture-sigil',
        'spell-haze-sigil',
        'spell-snare-sigil',
        'spell-guardian-sigil',
    ]);
    for (const spell of veilscript) {
        assert.ok(spell.use.requiredSkills.some((entry) => entry.skillId === 'ninjutsu'));
        assert.equal(spell.tags.includes('starfen'), false);
    }
});

test('an elemental spell learned in Brasshaven uses character training rather than location ownership', () => {
    const state = createNewGameState({ nationId: 'brasshaven', mainJobId: 'elementalist' });
    const learned = learnCapability(state.player, 'spell-cinder-bolt', {
        source: 'instruction',
        worldSeconds: state.worldTime.totalSeconds,
    });
    assert.equal(learned.ok, true, learned.reason);
    setLearnedSkill(state.player, 'elementalMagic', 1);
    state.player.resources.mp = 100;
    startEncounter(state, 'Redstone Ridge Ibex', { rng: () => 0 });

    const started = activateAbility(state, 'Cinder Bolt');
    assert.equal(started.ok, true, started.display?.text);
    assert.equal(started.code, 'ability.started');
    advanceWorldTime(state, 4);
    const resolved = reconcileAbilityActivation(state);
    assert.equal(resolved.ok, true, resolved.display?.text);
    assert.equal(resolved.code, 'ability.resolved');
    assert.equal(resolved.data.activation.abilityId, 'ability-cinder-bolt');
    assert.equal(resolved.data.effects[0].type, 'damage');
});

test('Veilscript sigils use the existing ninjutsu skill without a regional prerequisite', () => {
    const state = createNewGameState({ nationId: 'mistmere', mainJobId: 'veilrunner' });
    const learned = learnCapability(state.player, 'spell-fracture-sigil', {
        source: 'instruction',
        worldSeconds: state.worldTime.totalSeconds,
    });
    assert.equal(learned.ok, true, learned.reason);
    setLearnedSkill(state.player, 'ninjutsu', 1);
    state.player.resources.mp = 100;
    startEncounter(state, 'Starfen Rootling', { rng: () => 0 });

    const started = activateAbility(state, 'Fracture Sigil');
    assert.equal(started.ok, true, started.display?.text);
    assert.equal(started.code, 'ability.started');
    advanceWorldTime(state, 3);
    const resolved = reconcileAbilityActivation(state);
    assert.equal(resolved.ok, true, resolved.display?.text);
    const enemy = state.activeBattle.combatants.find((entry) => entry.type === 'enemy');
    assert.ok(enemy.statuses.some((status) => status.id === 'status-fracture-sigil'));
});
