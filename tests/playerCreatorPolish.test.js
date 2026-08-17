import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { randomCharacterName } from '../js/text/data/characterNames.js';
import { getStartingDisciplineKit, validateStartingDisciplineKits } from '../js/text/data/startingDisciplineKits.js';
import { createNewGameState } from '../js/text/gameState.js';
import {
    createGuidedCreatorState,
    describeCreatorOpening,
    randomizeCreator,
    randomizeCreatorName,
    validateCreator,
} from '../js/text/systems/characterCreationModel.js';
import { describeDisciplinePreview } from '../js/text/ui/domOnboardingEnhancements.js';

const STARTING_DISCIPLINES = ['vanguard', 'pugilist', 'lifewarden', 'elementalist', 'spellblade', 'shadowhand'];

function sequence(values) {
    let index = 0;
    return () => values[index++ % values.length];
}

test('canonical random names respect ancestry sex and deterministic RNG', () => {
    assert.equal(randomCharacterName('veyra', 'female', () => 0), 'Asha');
    assert.equal(randomCharacterName('korren', 'male', () => 0.999999), 'Zorrek');
    assert.notEqual(randomCharacterName('human', 'male', () => 0), randomCharacterName('human', 'female', () => 0));

    const named = randomizeCreatorName(createGuidedCreatorState({ raceId: 'miri', sex: 'female' }), () => 0);
    assert.equal(named.name, 'Amiya');
});

test('whole-character randomization always returns a valid canonical creator state', () => {
    const creator = randomizeCreator(createGuidedCreatorState(), sequence([0.99, 0.7, 0.5, 0.2, 0.1]));

    assert.deepEqual(validateCreator(creator), []);
    assert.equal(creator.raceId, 'korren');
    assert.equal(creator.sex, 'male');
    assert.ok(['thornwall', 'brasshaven', 'mistmere'].includes(creator.nationId));
    assert.ok(STARTING_DISCIPLINES.includes(creator.mainJobId));
    assert.ok(creator.name.length > 0);
});

test('all six starting disciplines expose truthful mechanical and equipment previews', () => {
    assert.deepEqual(validateStartingDisciplineKits(), []);

    const previews = STARTING_DISCIPLINES.map((jobId) => describeDisciplinePreview(jobId));
    assert.equal(new Set(previews.map((entry) => entry.startingGear)).size >= 4, true);
    assert.match(describeDisciplinePreview('vanguard').attributes, /STR \+2.*VIT \+2/);
    assert.match(describeDisciplinePreview('elementalist').resources, /14 MP/);
    assert.match(describeDisciplinePreview('spellblade').weaponTraining, /Sword/i);
    assert.match(describeDisciplinePreview('lifewarden').magicTraining, /Healing magic/i);
    assert.match(describeDisciplinePreview('shadowhand').startingGear, /Bronze Dagger/);

    for (const preview of previews) {
        assert.ok(preview.playStyle.length > 20);
        assert.ok(preview.protection.length > 20);
        assert.ok(preview.startingGear.length > 0);
    }
});

test('new characters receive their real discipline starter kit through canonical inventory authority', () => {
    for (const jobId of STARTING_DISCIPLINES) {
        const state = createNewGameState({ name: `Test ${jobId}`, mainJobId: jobId });
        const expected = getStartingDisciplineKit(jobId).itemIds;
        const carried = state.player.inventoryState.containers.inventory.items.map((item) => item.templateId ?? item.id);
        for (const itemId of expected) assert.ok(carried.includes(itemId), `${jobId} should carry ${itemId}`);
        assert.equal(Object.values(state.player.equipment).every((item) => item === null), true, `${jobId} kit should start carried, not auto-equipped`);
    }
});

test('origin openings are distinct scenes with a credible first contact and no generic class tutorial prose', () => {
    const thornwall = describeCreatorOpening(createGuidedCreatorState({ name: 'Lark', nationId: 'thornwall', mainJobId: 'spellblade' })).join('\n');
    const brasshaven = describeCreatorOpening(createGuidedCreatorState({ name: 'Lark', nationId: 'brasshaven', mainJobId: 'vanguard' })).join('\n');
    const mistmere = describeCreatorOpening(createGuidedCreatorState({ name: 'Lark', nationId: 'mistmere', mainJobId: 'elementalist' })).join('\n');

    assert.match(thornwall, /timber wagon|Halric Dane|Sera Talwin/i);
    assert.match(thornwall, /hawker/i);
    assert.match(thornwall, /Spellblade|steel and ward-work/i);
    assert.match(brasshaven, /freight caravan|labor broker|Varric Stone/i);
    assert.match(mistmere, /ferry|visitor’s fee|Soli Venn/i);
    assert.equal(new Set([thornwall, brasshaven, mistmere]).size, 3);

    for (const opening of [thornwall, brasshaven, mistmere]) {
        assert.doesNotMatch(opening, /first person you have been told to find/i);
        assert.doesNotMatch(opening, /permanent class|does not need to choose one permanent path/i);
    }
});

test('active browser theme contract provides only the requested light and dark visual palettes', () => {
    const css = readFileSync(new URL('../css/theme.css', import.meta.url), 'utf8');
    const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

    assert.match(css, /html\[data-theme="dark"\]/);
    assert.match(css, /html\[data-theme="light"\]/);
    assert.match(css, /#171a1f/);
    assert.match(css, /#d9dde2/);
    assert.match(css, /#234b72/);
    assert.doesNotMatch(css, /#d2bc78|#ead89c|#8f7b44|#332d1f/i);
    assert.match(index, /css\/theme\.css/);
});
