import test from 'node:test';
import assert from 'node:assert/strict';

import {
    appendOutput,
    applyCanvasKey,
    createCanvasUiState,
    scrollOutput,
    setActiveFeedback,
    setCanvasModal,
    setCanvasScreen,
    submitCommandInput,
} from '../js/text/ui/canvasInput.js';
import { createCanvasLayout, hitTestAction } from '../js/text/ui/canvasLayout.js';
import { createCanvasContextSnapshot, getVisibleLogLines } from '../js/text/ui/canvasRenderer.js';
import { isCommandIntent, isUiIntent } from '../js/text/ui/uiIntentDispatcher.js';
import {
    createActionList,
    createMenuActionList,
    dispatchAction,
    findActionById,
    TOP_ACTIONS,
} from '../js/text/ui/uiActions.js';
import { createInitialState } from '../js/text/gameState.js';

test('canvas action registry maps global buttons to command intents', () => {
    assert.equal(findActionById('character').payload.command, 'character');
    assert.equal(findActionById('stats').payload.command, 'stats');
    assert.equal(findActionById('skills').intent, 'command.route');
    assert.equal(findActionById('save').payload.command, 'save');
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

test('dispatching a command-intent canvas action calls the command router seam', () => {
    let routedCommand = null;
    const result = dispatchAction('skills', (command) => {
        routedCommand = command;
        return 'skills output';
    });

    assert.equal(result.ok, true);
    assert.equal(routedCommand, 'skills');
    assert.equal(result.response, 'skills output');
});

test('dispatching a UI intent is rejected by command dispatcher', () => {
    const result = dispatchAction({ id: 'logout', label: 'Logout', intent: 'account.logout', payload: {}, disabled: false }, () => 'bad');

    assert.equal(result.ok, false);
    assert.match(result.reason, /not a command action/);
});

test('UI intent helper classifies command and UI intents', () => {
    assert.equal(isCommandIntent('command.route'), true);
    assert.equal(isUiIntent('account.logout'), true);
    assert.equal(isUiIntent('command.route'), false);
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

test('canvas UI state defaults to splash menu and can switch screens and modals', () => {
    const uiState = createCanvasUiState();

    assert.equal(uiState.screen, 'menu');
    assert.equal(uiState.modal, null);
    assert.equal(setCanvasScreen(uiState, 'game'), 'game');
    assert.equal(setCanvasModal(uiState, 'settings'), 'settings');
    assert.equal(setCanvasModal(uiState, null), null);
    assert.equal(setCanvasScreen(uiState, 'menu'), 'menu');
});

test('escape opens menu from game screen or closes a modal', () => {
    const uiState = createCanvasUiState({ screen: 'game' });

    assert.deepEqual(applyCanvasKey(uiState, 'Escape'), { type: 'menu' });
    uiState.modal = 'settings';
    assert.deepEqual(applyCanvasKey(uiState, 'Escape'), { type: 'modal' });
    assert.equal(uiState.modal, null);
});

test('canvas menu action list shows only new account when logged out with no accounts', () => {
    const loggedOut = createMenuActionList({ loggedIn: false, accounts: [] });

    assert.equal(findActionById('login', loggedOut), null);
    assert.equal(findActionById('createAccount', loggedOut).label, 'New Account');
});

test('canvas menu action list shows login and new account when local accounts exist', () => {
    const loggedOut = createMenuActionList({
        loggedIn: false,
        accounts: [{ id: 'account-1', displayName: 'Russell', characterCount: 0 }],
    });

    assert.equal(findActionById('login', loggedOut).intent, 'account.login.open');
    assert.equal(findActionById('createAccount', loggedOut).intent, 'account.create');
});

test('canvas login modal lists local accounts and password modal confirms login', () => {
    const session = { loggedIn: false, accounts: [{ id: 'account-1', displayName: 'Russell' }] };
    const loginModal = createMenuActionList(session, 'login');
    const passwordModal = createMenuActionList(session, 'loginPassword');

    assert.equal(findActionById('account:account-1', loginModal).intent, 'account.select');
    assert.equal(findActionById('account:account-1', loginModal).payload.accountId, 'account-1');
    assert.equal(findActionById('confirmLogin', passwordModal).intent, 'account.login.confirm');
});

test('canvas settings modal is only available after login and includes clock controls', () => {
    const loggedIn = createMenuActionList({ loggedIn: true, settings: { theme: 'dark', timeZone: 'local', showClock: true, clockFormat: '12h' } }, 'settings');
    const loggedOut = createMenuActionList({ loggedIn: false }, 'settings');

    assert.equal(findActionById('theme', loggedIn).intent, 'settings.cycleTheme');
    assert.equal(findActionById('timezone', loggedIn).intent, 'settings.cycleTimeZone');
    assert.equal(findActionById('clockToggle', loggedIn).intent, 'settings.toggleClock');
    assert.equal(findActionById('clockFormat', loggedIn).intent, 'settings.toggleClockFormat');
    assert.equal(loggedOut.length, 1);
    assert.equal(findActionById('createAccount', loggedOut).label, 'New Account');
});

test('canvas menu action list shows character selection and logout after login', () => {
    const loggedIn = createMenuActionList({
        loggedIn: true,
        characters: [{ id: 'character-1', name: 'Aldo', job: 'Warrior', level: 5 }],
    });

    assert.equal(findActionById('character:character-1', loggedIn).intent, 'character.select');
    assert.equal(findActionById('character:character-1', loggedIn).payload.characterId, 'character-1');
    assert.equal(findActionById('newCharacter', loggedIn).intent, 'command.route');
    assert.equal(findActionById('settings', loggedIn).intent, 'settings.open');
    assert.equal(findActionById('logout', loggedIn).intent, 'account.logout');
});

test('canvas menu action list prompts character creation when no characters exist', () => {
    const loggedIn = createMenuActionList({ loggedIn: true, characters: [] });

    assert.equal(findActionById('newCharacter', loggedIn).label, 'Create Character');
    assert.equal(loggedIn.some((action) => action.intent === 'character.select'), false);
});

test('canvas layout creates splash menu, modal bounds, and left top menu button bounds', () => {
    const layout = createCanvasLayout({
        width: 1200,
        height: 800,
        actions: createActionList({ activeBattle: null }),
        menuActions: createMenuActionList({ loggedIn: false, accounts: [{ id: 'account-1', displayName: 'Russell' }] }),
        topActions: TOP_ACTIONS,
    });

    assert.ok(layout.menuButtons.find((button) => button.action.id === 'login').rect.w > 100);
    assert.ok(layout.modalButtons.length > 0);
    const menuButton = layout.topButtons.find((button) => button.action.id === 'menu');
    assert.equal(menuButton.rect.w, 34);
    assert.ok(menuButton.rect.x < 40);
});
