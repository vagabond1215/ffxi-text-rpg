import test from 'node:test';
import assert from 'node:assert/strict';

import { createNewGameState } from '../js/text/gameState.js';
import { createGuidedCreatorState } from '../js/text/systems/characterCreationModel.js';
import { renderCreatorScreen, renderGameScreen } from '../js/text/ui/domRenderer.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { createUiState } from '../js/text/ui/uiState.js';

test('semantic game view model presents scene map status and context without parsing command prose', () => {
    const state = createNewGameState({ name: 'Lark' });
    const uiState = createUiState({
        screen: 'game',
        outputLines: ['> look', 'A road bell sounds.', '', '> stats', 'Attributes:', 'STR 12'],
    });

    const model = createGameViewModel(state, uiState);

    assert.equal(model.scene.title, 'Thornwall Southgate');
    assert.equal(model.header.placeName, 'Thornwall Southgate');
    assert.match(model.header.worldTime, /^Day 1,/);
    assert.equal(model.character.name, 'Lark');
    assert.equal(model.character.resources.length, 3);
    assert.equal(model.character.attributes.length, 7);
    assert.equal(model.map.exploredCount, 1);
    assert.equal(model.movement.length, 8);
    assert.ok(model.movement.some((action) => !action.disabled));
    assert.deepEqual(model.scene.recent, ['A road bell sounds.', 'Attributes:', 'STR 12']);
    assert.equal(model.scene.recent.some((line) => line.startsWith('> ')), false);
});

test('context actions prioritize nearby world interaction over a permanent command catalog', () => {
    const state = createNewGameState({ name: 'Lark' });
    const model = createGameViewModel(state, createUiState({ screen: 'game' }));

    assert.ok(model.contextualActions.length <= 6);
    assert.ok(model.contextualActions.some((action) => action.label.startsWith('Talk ·')));
    assert.ok(model.contextualActions.some((action) => action.label === 'Look Around'));
    assert.equal(model.contextualActions.some((action) => action.label === 'Character'), false);
    assert.equal(model.contextualActions.some((action) => action.label === 'Validate'), false);
});

test('DOM game shell makes the scene primary and keeps map status actions and omnibox directly accessible', () => {
    const state = createNewGameState({ name: 'Lark' });
    const uiState = createUiState({ screen: 'game', activeView: 'scene' });
    const html = renderGameScreen(createGameViewModel(state, uiState), uiState, { displayName: 'Local Player' });

    assert.match(html, /Local Map/);
    assert.match(html, /Thornwall Southgate/);
    assert.match(html, /aria-label="Context actions"/);
    assert.match(html, /Search or act/);
    assert.match(html, /aria-label="Character status"/);
    assert.match(html, /<svg class="minimap"/);
    assert.doesNotMatch(html, /Output Log/);
    assert.doesNotMatch(html, /Command Chips/);
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
