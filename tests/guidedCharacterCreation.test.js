import test from 'node:test';
import assert from 'node:assert/strict';

import { createNewGameState } from '../js/text/gameState.js';
import {
    advanceCreatorStep,
    createCreatorGameOptions,
    createGuidedCreatorState,
    describeCreatorOpening,
    getCreatorSummary,
    getRaceOptions,
    getStartingJobOptions,
    selectCreatorRace,
    selectCreatorSex,
    setCreatorName,
    validateCreator,
} from '../js/text/systems/characterCreationModel.js';

test('guided creator exposes meaningful ancestry and starting discipline choices', () => {
    assert.equal(getRaceOptions().length, 5);
    assert.deepEqual(getStartingJobOptions().map((job) => job.id), ['vanguard', 'pugilist', 'lifewarden', 'elementalist', 'spellblade', 'shadowhand']);
});

test('guided creator enforces allowed ancestry sex combinations', () => {
    let creator = createGuidedCreatorState({ raceId: 'human', sex: 'female' });
    creator = selectCreatorRace(creator, 'korren');

    assert.equal(creator.raceId, 'korren');
    assert.equal(creator.sex, 'male');
    assert.equal(selectCreatorSex(creator, 'female').sex, 'male');
});

test('guided creator builds summary and game-state options', () => {
    let creator = createGuidedCreatorState({ nationId: 'brasshaven', mainJobId: 'pugilist', raceId: 'korren' });
    creator = setCreatorName(creator, 'Stone Son');
    creator = advanceCreatorStep(creator, 3);

    assert.deepEqual(validateCreator(creator), []);
    assert.match(getCreatorSummary(creator).startingCity, /Brasshaven Market Ring/);

    const options = createCreatorGameOptions(creator);
    assert.equal(options.includeStartingDisciplineKit, true);
    const state = createNewGameState(options);
    assert.equal(state.player.identity.name, 'Stone Son');
    assert.equal(state.currentPlaceId, 'brasshaven-market-ring');
    assert.equal(state.player.jobs.mainJobId, 'pugilist');
    assert.equal(state.player.inventoryState.containers.inventory.items.length, 2);
});

test('guided creator requires a name before final confirmation', () => {
    const creator = createGuidedCreatorState();
    assert.match(validateCreator(creator).join('\n'), /Name is required/);
    const opening = describeCreatorOpening(setCreatorName(creator, 'Ashen')).join('\n');
    assert.match(opening, /Ashen/);
    assert.match(opening, /Halric Dane|Sera Talwin/);
});
