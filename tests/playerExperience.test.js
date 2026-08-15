import test from 'node:test';
import assert from 'node:assert/strict';

import { listQuestHooks } from '../js/text/data/questHooks.js';
import { createNewGameState, DEFAULT_START_WORLD_TIME_SECONDS } from '../js/text/gameState.js';
import {
    createCreatorGameOptions,
    createGuidedCreatorState,
    describeCreatorOpening,
} from '../js/text/systems/characterCreationModel.js';
import { performLocalityPoiAction } from '../js/text/systems/localityEngine.js';
import { createPlayerExperienceModel } from '../js/text/systems/playerExperienceEngine.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';

const ORIGINS = Object.freeze([
    ['thornwall', 'Sera Talwin', 'Elderwood'],
    ['brasshaven', 'Marshal Varric Stone', 'Redstone Reach'],
    ['mistmere', 'Reader Soli Venn', 'Starfen'],
]);

test('new characters begin at a believable morning hour and the opening names the first contact', () => {
    for (const [nationId, guideName, regionName] of ORIGINS) {
        const creator = createGuidedCreatorState({ name: 'Ari', nationId });
        const options = createCreatorGameOptions(creator);
        const state = createNewGameState(options);
        const opening = describeCreatorOpening(creator).join('\n');

        assert.equal(state.worldTime.totalSeconds, DEFAULT_START_WORLD_TIME_SECONDS);
        assert.match(opening, new RegExp(guideName));
        assert.match(opening, new RegExp(regionName));
        assert.match(opening, /more mastery, material capability, knowledge, or useful connections/i);
    }
});

test('each origin surfaces a lore-friendly first contact before generic locality actions', () => {
    for (const [nationId, guideName, regionName] of ORIGINS) {
        const state = createNewGameState({ nationId });
        const before = createPlayerExperienceModel(state);
        const view = createGameViewModel(state, { outputLines: [] });

        assert.equal(before.phase, 'orientation');
        assert.equal(before.guide.name, guideName);
        assert.equal(before.guide.met, false);
        assert.equal(before.primaryAction.intent, 'locality.poi');
        assert.equal(view.contextualActions[0].id, before.primaryAction.id);
        assert.match(view.scene.description, new RegExp(guideName));

        const contact = performLocalityPoiAction(state, before.guide.poiId, 'talk');
        assert.equal(contact.ok, true);
        assert.match(contact.message, /Effort becomes mastery/i);
        assert.match(contact.message, new RegExp(regionName));
        assert.doesNotMatch(contact.message, /Dialogue scripting is not implemented/i);

        const after = createPlayerExperienceModel(state);
        const afterView = createGameViewModel(state, { outputLines: [] });
        assert.equal(after.guide.met, true);
        assert.equal(after.phase, 'foothold');
        assert.equal(after.primaryAction, null);
        assert.equal(after.paths.length, 4);
        assert.match(afterView.scene.description, /prepare, practice, work, or explore/i);
    }
});

test('player-experience guidance states how persistent progress compounds', () => {
    const state = createNewGameState();
    const guidance = createPlayerExperienceModel(state);

    assert.equal(guidance.progressionLaw, 'Effort → mastery → efficiency → capability → larger ambition.');
    assert.deepEqual(guidance.paths.map((entry) => entry.id), ['training', 'livelihood', 'exploration', 'preparation']);
    assert.ok(guidance.paths.every((entry) => entry.how.length > 20 && entry.grows.length > 20));
});

test('canonical commission presentation no longer carries legacy world names', () => {
    const presentation = listQuestHooks().map(({ name, description, tags }) => ({ name, description, tags }));
    const text = JSON.stringify(presentation);
    assert.doesNotMatch(text, /San d.Oria|Bastok|Windurst|Cid|Cornelia|Iron Eater|Raibaht|Apururu|Heavens Tower/i);
    assert.match(text, /Thornwall/);
    assert.match(text, /Brasshaven/);
    assert.match(text, /Mistmere/);
});