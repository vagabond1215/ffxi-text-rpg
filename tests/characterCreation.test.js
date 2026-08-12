import test from 'node:test';
import assert from 'node:assert/strict';

import { createCommandRouter } from '../js/text/commandRouter.js';
import { createInitialState, createNewGameState } from '../js/text/gameState.js';
import { describeNations, findNation } from '../js/text/data/nations.js';
import { validateGameState } from '../js/text/systems/validation.js';


test('power registry lists three original starting powers and accepts bounded legacy aliases', () => {
    assert.equal(findNation('thornwall').startingPlaceId, 'thornwall-southgate');
    assert.equal(findNation('brasshaven').startingPlaceId, 'brasshaven-market-ring');
    assert.equal(findNation('mistmere').startingPlaceId, 'mistmere-canal-ward');
    assert.equal(findNation('sandoria').id, 'thornwall');
    assert.equal(findNation('bastok').id, 'brasshaven');
    assert.equal(findNation('windurst').id, 'mistmere');
    assert.match(describeNations(), /Brasshaven/);
});

test('createNewGameState starts in Thornwall by default', () => {
    const state = createNewGameState();

    assert.equal(state.currentPlaceId, 'thornwall-southgate');
    assert.equal(state.player.identity.nation, 'Thornwall');
    assert.equal(state.player.identity.raceId, 'human');
    assert.equal(state.player.jobs.mainJobId, 'vanguard');
    assert.ok(state.player.progression.unlockedMaps.includes('map-thornwall'));
    assert.deepEqual(validateGameState(state), []);
});

test('createNewGameState supports Brasshaven start', () => {
    const state = createNewGameState({ nationId: 'brasshaven', raceId: 'korren', mainJobId: 'pugilist', name: 'Stone Son' });

    assert.equal(state.currentPlaceId, 'brasshaven-market-ring');
    assert.equal(state.player.identity.name, 'Stone Son');
    assert.equal(state.player.identity.raceId, 'korren');
    assert.equal(state.player.jobs.mainJobId, 'pugilist');
    assert.equal(state.player.identity.nation, 'Brasshaven');
    assert.ok(state.player.progression.unlockedMaps.includes('map-brasshaven'));
    assert.ok(state.player.keyItems.includes('map-redstone-reach'));
    assert.deepEqual(validateGameState(state), []);
});

test('createNewGameState supports Mistmere start', () => {
    const state = createNewGameState({ nationId: 'mistmere', raceId: 'miri', mainJobId: 'elementalist', name: 'Little Star' });

    assert.equal(state.currentPlaceId, 'mistmere-canal-ward');
    assert.equal(state.player.identity.name, 'Little Star');
    assert.equal(state.player.identity.raceId, 'miri');
    assert.equal(state.player.jobs.mainJobId, 'elementalist');
    assert.equal(state.player.identity.nation, 'Mistmere');
    assert.ok(state.player.progression.unlockedMaps.includes('map-mistmere'));
    assert.ok(state.player.keyItems.includes('map-starfen'));
    assert.deepEqual(validateGameState(state), []);
});

test('legacy creation identifiers resolve at the input boundary but canonical state is emitted', () => {
    const state = createNewGameState({ nationId: 'bastok', raceId: 'galka', mainJobId: 'monk', name: 'Old Save Test' });

    assert.equal(state.currentPlaceId, 'brasshaven-market-ring');
    assert.equal(state.player.identity.raceId, 'korren');
    assert.equal(state.player.jobs.mainJobId, 'pugilist');
    assert.equal(state.player.identity.nation, 'Brasshaven');
});

test('router fast-create command uses canonical power ancestry and discipline options', () => {
    const state = createInitialState();
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });

    const output = router('create --power=brasshaven --ancestry=korren --discipline=pugilist --name="Stone Son"');

    assert.match(output, /Created Stone Son/);
    assert.equal(state.currentPlaceId, 'brasshaven-market-ring');
    assert.equal(state.player.identity.nation, 'Brasshaven');
    assert.equal(state.player.identity.raceId, 'korren');
    assert.equal(state.player.jobs.mainJobId, 'pugilist');
    assert.equal(state.player.identity.name, 'Stone Son');
    assert.match(router('character'), /Brasshaven/);
});

test('router fast-create defaults are canonical when only a name is supplied', () => {
    const state = createInitialState();
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });

    router('create --name=Wayfarer');

    assert.equal(state.currentPlaceId, 'thornwall-southgate');
    assert.equal(state.player.identity.raceId, 'human');
    assert.equal(state.player.jobs.mainJobId, 'vanguard');
});
