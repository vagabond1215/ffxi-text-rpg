import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { createCommandRouter } from '../js/text/commandRouter.js';
import { describeControls, NAV_KEYPAD } from '../js/text/data/actionControls.js';
import { evaluateAggroForGrid } from '../js/text/systems/aggroEngine.js';
import { describeAtlas, hasVisited, setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { startEncounter } from '../js/text/systems/combatActionEngine.js';


test('initial state starts with discovered atlas coordinate', () => {
    const state = createInitialState();

    assert.equal(state.position.placeId, 'southern-sandoria');
    assert.equal(state.position.coord, 'G-10');
    assert.equal(hasVisited(state.atlas, 'southern-sandoria', state.position), true);
    assert.match(describeAtlas(state), /@/);
    assert.match(describeAtlas(state), /\?/);
});

test('controls include resource bars tick bar keypad and action groups', () => {
    const text = describeControls();

    assert.match(text, /Resource Bars/);
    assert.match(text, /Timer Bar/);
    assert.equal(NAV_KEYPAD.length, 8);
    assert.match(text, /Auto Attack/);
    assert.match(text, /Weapon Skill/);
    assert.match(text, /Cast Magic/);
});

test('setPositionAndDiscover records a new visited coordinate', () => {
    const state = createInitialState();
    const result = setPositionAndDiscover(state, 'southern-sandoria', { coord: 'F-10' });

    assert.equal(result.ok, true);
    assert.equal(state.position.coord, 'F-10');
    assert.equal(hasVisited(state.atlas, 'southern-sandoria', { coord: 'F-10' }), true);
});

test('aggro engine can deterministically trigger on aggressive spawn grid', () => {
    const state = createInitialState();
    setPositionAndDiscover(state, 'west-ronfaure', { x: 3, y: 2 });
    const result = evaluateAggroForGrid(state, { rng: () => 0 });

    assert.equal(result.triggered, true);
    assert.equal(result.encounter.enemyId, 'enemy-forest-goblin');
});

test('router exposes controls atlas grid and move commands', () => {
    const state = createInitialState();
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });

    assert.match(router('controls'), /Resource Bars/);
    assert.match(router('atlas'), /Southern San/);
    assert.match(router('grid'), /coordinate/);
    assert.match(router('move e'), /Moved east/);
});

test('movement is blocked while in active battle', () => {
    const state = createInitialState();
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });

    startEncounter(state, 'Forest Hare');

    assert.match(router('move e'), /cannot move while engaged/);
    assert.match(router('travel West Ronfaure'), /cannot travel while engaged/);
});
