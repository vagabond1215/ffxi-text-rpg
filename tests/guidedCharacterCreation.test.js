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

test('guided creator exposes meaningful race and starting job choices', () => {
    assert.equal(getRaceOptions().length, 5);
    assert.deepEqual(getStartingJobOptions().map((job) => job.id), ['warrior', 'monk', 'whiteMage', 'blackMage', 'redMage', 'thief']);
});

test('guided creator enforces allowed race sex combinations', () => {
    let creator = createGuidedCreatorState({ raceId: 'hume', sex: 'female' });
    creator = selectCreatorRace(creator, 'galka');

    assert.equal(creator.raceId, 'galka');
    assert.equal(creator.sex, 'male');
    assert.equal(selectCreatorSex(creator, 'female').sex, 'male');
});

test('guided creator builds summary and game-state options', () => {
    let creator = createGuidedCreatorState({ nationId: 'bastok', mainJobId: 'monk', raceId: 'galka' });
    creator = setCreatorName(creator, 'Stone Son');
    creator = advanceCreatorStep(creator, 3);

    assert.deepEqual(validateCreator(creator), []);
    assert.match(getCreatorSummary(creator).startingCity, /Bastok Markets/);

    const state = createNewGameState(createCreatorGameOptions(creator));
    assert.equal(state.player.identity.name, 'Stone Son');
    assert.equal(state.currentPlaceId, 'bastok-markets');
    assert.equal(state.player.jobs.mainJobId, 'monk');
});

test('guided creator requires a name before final confirmation', () => {
    const creator = createGuidedCreatorState();
    assert.match(validateCreator(creator).join('\n'), /Name is required/);
    assert.match(describeCreatorOpening(setCreatorName(creator, 'Ashen'))[0], /Ashen/);
});
