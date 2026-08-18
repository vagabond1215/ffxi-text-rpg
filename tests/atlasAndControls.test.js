import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState, DEFAULT_START_WORLD_TIME_SECONDS } from '../js/text/gameState.js';
import { createCommandRouter } from '../js/text/commandRouter.js';
import { describeControls, NAV_KEYPAD } from '../js/text/data/actionControls.js';
import { evaluateAggroForGrid } from '../js/text/systems/aggroEngine.js';
import { describeAtlas, hasVisited, setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { startEncounter } from '../js/text/systems/combatActionEngine.js';


test('initial state keeps coordinate state internal while atlas text exposes discovery only', () => {
    const state = createInitialState();
    const initialVisit = state.atlas['thornwall-southgate'].visited['G-10'];

    assert.equal(state.position.placeId, 'thornwall-southgate');
    assert.equal(state.position.coord, 'G-10');
    assert.equal(hasVisited(state.atlas, 'thornwall-southgate', state.position), true);
    assert.equal(initialVisit.visitedAtWorldSeconds, DEFAULT_START_WORLD_TIME_SECONDS);
    assert.equal(Object.hasOwn(initialVisit, 'visitedAt'), false);
    assert.match(describeAtlas(state), /Known areas: 1/);
    assert.match(describeAtlas(state), /total map extent remain hidden/i);
    assert.doesNotMatch(describeAtlas(state), /G-10|A-M|13x13/);
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

test('setPositionAndDiscover records canonical world time for a new visited coordinate', () => {
    const state = createInitialState();
    state.worldTime.totalSeconds += 123;
    const result = setPositionAndDiscover(state, 'thornwall-southgate', { coord: 'F-10' });
    const visit = state.atlas['thornwall-southgate'].visited['F-10'];

    assert.equal(result.ok, true);
    assert.equal(state.position.coord, 'F-10');
    assert.equal(hasVisited(state.atlas, 'thornwall-southgate', { coord: 'F-10' }), true);
    assert.equal(visit.visitedAtWorldSeconds, DEFAULT_START_WORLD_TIME_SECONDS + 123);
    assert.equal(Object.hasOwn(visit, 'visitedAt'), false);
});

test('aggro engine can deterministically trigger on aggressive spawn grid', () => {
    const state = createInitialState();
    setPositionAndDiscover(state, 'west-elderwood', { x: 3, y: 2 });
    const result = evaluateAggroForGrid(state, { rng: () => 0 });

    assert.equal(result.triggered, true);
    assert.equal(result.encounter.enemyId, 'enemy-mossback-goblin');
});

test('router exposes controls atlas local area and move commands without coordinate values', () => {
    const state = createInitialState();
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });

    assert.match(router('controls'), /Resource Bars/);
    assert.match(router('atlas'), /Thornwall Southgate/);
    assert.match(router('grid'), /local area/i);
    assert.doesNotMatch(router('grid'), /G-10|\(\d+,\s*\d+\)/);
    assert.match(router('move e'), /Moved east/);
    assert.doesNotMatch(router('move w'), /G-10|H-10|\(\d+,\s*\d+\)/);
});

test('movement is blocked while in active battle', () => {
    const state = createInitialState();
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });

    startEncounter(state, 'Brush Hare');

    assert.match(router('move e'), /cannot move while engaged/);
    assert.match(router('travel West Elderwood'), /cannot travel while engaged/);
});
