import test from 'node:test';
import assert from 'node:assert/strict';

import { createCommandRouter } from '../js/text/commandRouter.js';
import { createInitialState, createNewGameState } from '../js/text/gameState.js';
import { describeNations, findNation } from '../js/text/data/nations.js';
import { validateGameState } from '../js/text/systems/validation.js';


test('nation registry lists three starting nations', () => {
    assert.equal(findNation('sandoria').startingPlaceId, 'southern-sandoria');
    assert.equal(findNation('bastok').startingPlaceId, 'bastok-markets');
    assert.equal(findNation('windurst').startingPlaceId, 'windurst-waters');
    assert.match(describeNations(), /Bastok/);
});

test('createNewGameState starts in San d’Oria by default', () => {
    const state = createNewGameState();

    assert.equal(state.currentPlaceId, 'southern-sandoria');
    assert.equal(state.player.identity.nation, 'San d’Oria');
    assert.ok(state.player.progression.unlockedMaps.includes('map-san-doria'));
    assert.deepEqual(validateGameState(state), []);
});

test('createNewGameState supports Bastok start', () => {
    const state = createNewGameState({ nationId: 'bastok', raceId: 'galka', mainJobId: 'monk', name: 'Stone Son' });

    assert.equal(state.currentPlaceId, 'bastok-markets');
    assert.equal(state.player.identity.name, 'Stone Son');
    assert.equal(state.player.identity.raceId, 'galka');
    assert.equal(state.player.jobs.mainJobId, 'monk');
    assert.equal(state.player.identity.nation, 'Bastok');
    assert.ok(state.player.progression.unlockedMaps.includes('map-bastok'));
    assert.ok(state.player.keyItems.includes('map-gustaberg'));
    assert.deepEqual(validateGameState(state), []);
});

test('createNewGameState supports Windurst start', () => {
    const state = createNewGameState({ nationId: 'windurst', raceId: 'tarutaru', mainJobId: 'blackMage', name: 'Little Star' });

    assert.equal(state.currentPlaceId, 'windurst-waters');
    assert.equal(state.player.identity.name, 'Little Star');
    assert.equal(state.player.identity.raceId, 'tarutaru');
    assert.equal(state.player.jobs.mainJobId, 'blackMage');
    assert.equal(state.player.identity.nation, 'Windurst');
    assert.ok(state.player.progression.unlockedMaps.includes('map-windurst'));
    assert.ok(state.player.keyItems.includes('map-sarutabaruta'));
    assert.deepEqual(validateGameState(state), []);
});

test('router create command replaces current state with requested nation start', () => {
    const state = createInitialState();
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });

    const output = router('create --nation=bastok --race=galka --job=monk --name="Stone Son"');

    assert.match(output, /Created Stone Son/);
    assert.equal(state.currentPlaceId, 'bastok-markets');
    assert.equal(state.player.identity.nation, 'Bastok');
    assert.equal(state.player.identity.name, 'Stone Son');
    assert.match(router('character'), /Bastok/);
});
