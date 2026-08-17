import test from 'node:test';
import assert from 'node:assert/strict';

import { createNewGameState } from '../js/text/gameState.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { createGuidedCreatorState } from '../js/text/systems/characterCreationModel.js';
import { renderCreatorScreen, renderGameScreen } from '../js/text/ui/domRenderer.js';
import { createContextualActions, createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { createUiState } from '../js/text/ui/uiState.js';

test('semantic game view model presents safe settlement locality status and context without parsing command prose', () => {
    const state = createNewGameState({ name: 'Lark' });
    const uiState = createUiState({
        screen: 'game',
        outputLines: ['> look', 'A road bell sounds.', '', '> stats', 'Attributes:', 'STR 12'],
    });

    const model = createGameViewModel(state, uiState);

    assert.equal(model.scene.title, 'Thornwall Southgate');
    assert.equal(model.header.placeName, 'Thornwall Southgate');
    assert.match(model.header.worldTime, /^Day 1,/);
    assert.equal(model.header.coordinate, 'Named locality');
    assert.equal(model.character.name, 'Lark');
    assert.equal(model.character.resources.length, 3);
    assert.equal(model.character.attributes.length, 7);
    assert.equal(model.navigation.mode, 'locality');
    assert.equal(model.map, null);
    assert.deepEqual(model.movement, []);
    assert.ok(model.navigation.destinations.some((entry) => entry.id === 'thornwall-crownward'));
    assert.deepEqual(model.scene.recent, ['A road bell sounds.', 'Attributes:', 'STR 12']);
    assert.equal(model.scene.recent.some((line) => line.startsWith('> ')), false);
});

test('settlement context actions prioritize named destinations and local interactions over command catalogs', () => {
    const state = createNewGameState({ name: 'Lark' });
    const model = createGameViewModel(state, createUiState({ screen: 'game' }));

    assert.ok(model.contextualActions.length <= 6);
    assert.ok(model.contextualActions.some((action) => action.intent === 'locality.move'));
    assert.ok(model.contextualActions.some((action) => action.intent === 'locality.poi'));
    assert.equal(model.contextualActions.some((action) => action.label === 'Character'), false);
    assert.equal(model.contextualActions.some((action) => action.label === 'Validate'), false);
});

test('travel context exposes a semantic stop action without routing an incomplete travel command', () => {
    const state = createNewGameState({ name: 'Lark' });
    state.travel = { active: true };
    const actions = createContextualActions(state, []);

    assert.deepEqual(actions.map((action) => action.label), ['Stop Travel']);
    assert.equal(actions[0].intent, 'navigation.stop');
    assert.equal(actions.some((action) => action.payload?.command === 'travel'), false);
});

test('DOM game shell omits exploration map and compass in safe settlement locality mode', () => {
    const state = createNewGameState({ name: 'Lark' });
    const uiState = createUiState({ screen: 'game', activeView: 'scene' });
    const html = renderGameScreen(createGameViewModel(state, uiState), uiState, { displayName: 'Local Player' });

    assert.match(html, /Thornwall Southgate/);
    assert.match(html, /aria-label="Context actions"/);
    assert.match(html, /Search what you know or can do/);
    assert.match(html, /aria-label="Character status"/);
    assert.doesNotMatch(html, /Local Map/);
    assert.doesNotMatch(html, /<svg class="minimap"/);
    assert.doesNotMatch(html, /aria-label="Movement controls"/);
    assert.doesNotMatch(html, /Output Log/);
    assert.doesNotMatch(html, /Command Chips/);
});

test('DOM game shell retains discovery-safe map and movement controls in wilderness exploration mode', () => {
    const state = createNewGameState({ name: 'Lark' });
    setPositionAndDiscover(state, 'west-elderwood', { x: 4, y: 4 });
    const uiState = createUiState({ screen: 'game', activeView: 'scene' });
    const html = renderGameScreen(createGameViewModel(state, uiState), uiState, { displayName: 'Local Player' });

    assert.match(html, /Local Map/);
    assert.match(html, /<svg class="minimap"/);
    assert.match(html, /1\/\? explored/);
    assert.match(html, /aria-label="Movement controls"/);
    assert.doesNotMatch(html, /G-10|A-M|1\/32 explored/);
});

test('single-screen creator exposes all foundational choices and a live summary without wizard navigation', () => {
    const uiState = createUiState({
        screen: 'creator',
        creator: createGuidedCreatorState({ name: 'Lark', raceId: 'human', nationId: 'thornwall', mainJobId: 'vanguard' }),
    });
    const html = renderCreatorScreen(uiState, { displayName: 'Local Player' });

    assert.match(html, />Ancestry</);
    assert.match(html, />Sex</);
    assert.match(html, />Origin</);
    assert.match(html, />Starting Discipline</);
    assert.match(html, /Starting Profile/);
    assert.match(html, /Create Character/);
    assert.match(html, /initial training/i);
    assert.doesNotMatch(html, />Continue</);
    assert.doesNotMatch(html, />Back</);
    assert.doesNotMatch(html, /Review Character/);
});

test('DOM creator descriptions are native wrapping content rather than pre-truncated canvas labels', () => {
    const uiState = createUiState({ screen: 'creator', creator: createGuidedCreatorState({ name: 'Lark' }) });
    const html = renderCreatorScreen(uiState);

    assert.match(html, /choice-description/);
    assert.doesNotMatch(html, /\.\.\.<\/p>/);
    assert.match(html, /does not erase or forbid capabilities|found throughout|opening circumstances/i);
});
