import test from 'node:test';
import assert from 'node:assert/strict';

import {
    appendOutput,
    applyCanvasKey,
    createCanvasUiState,
    scrollOutput,
    setActiveFeedback,
    setCanvasScreen,
    submitCommandInput,
} from '../js/text/ui/canvasInput.js';
import { createCanvasLayout, hitTestAction } from '../js/text/ui/canvasLayout.js';
import { createCanvasContextSnapshot, getVisibleLogLines } from '../js/text/ui/canvasRenderer.js';
import {
    createActionList,
    createMenuActionList,
    dispatchAction,
    findActionById,
    TOP_ACTIONS,
} from '../js/text/ui/uiActions.js';
import { createInitialState } from '../js/text/gameState.js';

test('canvas action registry maps global buttons to existing commands', () => {
    assert.equal(findActionById('character').command, 'character');
    assert.equal(findActionById('stats').command, 'stats');
    assert.equal(findActionById('skills').command, 'skills');
    assert.equal(findActionById('save').command, 'save');
});

test('canvas action list marks unavailable battle action disabled', () => {
    const actions = createActionList({ activeBattle: null });

    assert.equal(findActionById('battle', actions).disabled, true);
    assert.equal(findActionById('stats', actions).disabled, false);
});

test('canvas layout creates clickable button bounds', () => {
    const actions = createActionList({ activeBattle: { phase: 'active' } });
    const layout = createCanvasLayout({ width: 1200, height: 800, actions });
    const statsButton = layout.actionButtons.find((button) => button.action.id === 'stats');

    assert.ok(statsButton.rect.w > 100);
    assert.ok(statsButton.rect.h > 20);
});

test('canvas hit testing returns the expected action', () => {
    const actions = createActionList({ activeBattle: { phase: 'active' } });
    const layout = createCanvasLayout({ width: 1200, height: 800, actions });
    const target = layout.actionButtons.find((button) => button.action.id === 'inventory');
    const hit = hitTestAction(layout, target.rect.x + target.rect.w / 2, target.rect.y + target.rect.h / 2);

    assert.equal(hit.action.id, 'inventory');
});

test('dispatching a canvas action calls the command router seam', () => {
    let routedCommand = null;
    const result = dispatchAction('skills', (command) => {
        routedCommand = command;
        return 'skills output';
    });

    assert.equal(result.ok, true);
    assert.equal(routedCommand, 'skills');
    assert.equal(result.response, 'skills output');
});

test('canvas keyboard input builds and submits command strings', () => {
    const uiState = createCanvasUiState();
    for (const key of 'stats') applyCanvasKey(uiState, key);

    const result = applyCanvasKey(uiState, 'Enter');

    assert.deepEqual(result, { type: 'submit', command: 'stats' });
    assert.equal(uiState.inputBuffer, '');
    assert.deepEqual(uiState.commandHistory, ['stats']);
});

test('canvas command history stores submitted commands and supports browsing', () => {
    const uiState = createCanvasUiState({ inputBuffer: 'look' });
    const first = submitCommandInput(uiState, (command) => `${command} output`);
    uiState.inputBuffer = 'inventory';
    const second = submitCommandInput(uiState, (command) => `${command} output`);

    applyCanvasKey(uiState, 'ArrowUp');
    assert.equal(uiState.inputBuffer, 'inventory');
    applyCanvasKey(uiState, 'ArrowUp');
    assert.equal(uiState.inputBuffer, 'look');
    applyCanvasKey(uiState, 'ArrowDown');
    assert.equal(uiState.inputBuffer, 'inventory');
    assert.equal(first.command, 'look');
    assert.equal(second.command, 'inventory');
});

test('canvas output appending trims old lines and resets scroll', () => {
    const uiState = createCanvasUiState({ outputScrollOffset: 5 });

    appendOutput(uiState, 'a\nb\nc', 2);

    assert.deepEqual(uiState.outputLines, ['b', 'c']);
    assert.equal(uiState.outputScrollOffset, 0);
});

test('canvas page keys and wheel helper adjust output scroll offset', () => {
    const uiState = createCanvasUiState({ outputLines: Array.from({ length: 40 }, (_, index) => `line ${index}`) });

    applyCanvasKey(uiState, 'PageUp');
    assert.equal(uiState.outputScrollOffset, 10);
    applyCanvasKey(uiState, 'PageDown');
    assert.equal(uiState.outputScrollOffset, 0);
    scrollOutput(uiState, 3);
    assert.equal(uiState.outputScrollOffset, 3);
});

test('visible log lines respect scroll offset', () => {
    const ctx = { font: '', measureText: (value) => ({ width: String(value).length * 8 }) };
    const lines = ['one', 'two', 'three', 'four'];
    const rect = { w: 200, h: 32 };
    const theme = { font: '12px monospace', lineHeight: 16 };

    assert.deepEqual(getVisibleLogLines(ctx, lines, rect, theme, 0), ['three', 'four']);
    assert.deepEqual(getVisibleLogLines(ctx, lines, rect, theme, 1), ['two', 'three']);
});

test('canvas active feedback is stored for rendering', () => {
    const uiState = createCanvasUiState();

    setActiveFeedback(uiState, 'Ran: skills');

    assert.equal(uiState.activeFeedback, 'Ran: skills');
});

test('canvas context snapshot recalculates derived combat values', () => {
    const state = createInitialState();
    state.player.combat.resources.maxHp = 1;

    const snapshot = createCanvasContextSnapshot(state);

    assert.notEqual(snapshot.maxHp, 1);
    assert.equal(snapshot.playerName, state.player.identity.name);
});

test('canvas UI state defaults to splash menu and can switch screens', () => {
    const uiState = createCanvasUiState();

    assert.equal(uiState.screen, 'menu');
    assert.equal(setCanvasScreen(uiState, 'game'), 'game');
    assert.equal(setCanvasScreen(uiState, 'menu'), 'menu');
});

test('escape opens menu from game screen', () => {
    const uiState = createCanvasUiState({ screen: 'game' });

    assert.deepEqual(applyCanvasKey(uiState, 'Escape'), { type: 'menu' });
});

test('canvas menu action list shows account selection and login when logged out', () => {
    const loggedOut = createMenuActionList({
        loggedIn: false,
        accounts: [{ id: 'account-1', displayName: 'Russell', characterCount: 0 }],
    });

    assert.equal(findActionById('account:account-1', loggedOut).kind, 'selectAccount');
    assert.equal(findActionById('createAccount', loggedOut).label, 'Create Account');
    assert.equal(findActionById('login', loggedOut).label, 'Login');
});

test('canvas menu action list shows character selection after login', () => {
    const loggedIn = createMenuActionList({
        loggedIn: true,
        characters: [{ id: 'character-1', name: 'Aldo', job: 'Warrior', level: 5 }],
    });

    assert.equal(findActionById('character:character-1', loggedIn).kind, 'selectCharacter');
    assert.equal(findActionById('newCharacter', loggedIn).label, 'New Character');
    assert.equal(findActionById('logout', loggedIn).label, 'Logout');
});

test('canvas menu action list prompts character creation when no characters exist', () => {
    const loggedIn = createMenuActionList({ loggedIn: true, characters: [] });

    assert.equal(findActionById('newCharacter', loggedIn).label, 'Create Character');
    assert.equal(loggedIn.some((action) => action.kind === 'selectCharacter'), false);
});

test('canvas layout creates splash menu and top menu button bounds', () => {
    const layout = createCanvasLayout({
        width: 1200,
        height: 800,
        actions: createActionList({ activeBattle: null }),
        menuActions: createMenuActionList({ loggedIn: false, accounts: [{ id: 'account-1', displayName: 'Russell' }] }),
        topActions: TOP_ACTIONS,
    });

    assert.ok(layout.menuButtons.find((button) => button.action.id === 'login').rect.w > 100);
    assert.ok(layout.topButtons.find((button) => button.action.id === 'menu').rect.w > 40);
});
