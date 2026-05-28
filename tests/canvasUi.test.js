import test from 'node:test';
import assert from 'node:assert/strict';

import {
    appendOutput,
    applyCanvasKey,
    createCanvasUiState,
    handlePointerDown,
    handlePointerUp,
    scrollOutput,
    setActiveFeedback,
    setCanvasModal,
    setCanvasScreen,
    setModalPage,
    submitCommandInput,
} from '../js/text/ui/canvasInput.js';
import { createCanvasLayout, hitTestAction, hitTestModalField } from '../js/text/ui/canvasLayout.js';
import { createCanvasContextSnapshot, getVisibleLogLines } from '../js/text/ui/canvasRenderer.js';
import { createCanvasApp } from '../js/text/ui/canvasApp.js';
import { isCommandIntent, isUiIntent } from '../js/text/ui/uiIntentDispatcher.js';
import {
    createActionList,
    createCompassActionList,
    createMenuActionList,
    dispatchAction,
    findActionById,
    TOP_ACTIONS,
} from '../js/text/ui/uiActions.js';
import { createInitialState } from '../js/text/gameState.js';

class MemoryStorage {
    constructor() {
        this.values = new Map();
    }

    getItem(key) {
        return this.values.has(key) ? this.values.get(key) : null;
    }

    setItem(key, value) {
        this.values.set(key, String(value));
    }

    removeItem(key) {
        this.values.delete(key);
    }
}

test('canvas action registry maps global buttons to command intents', () => {
    assert.equal(findActionById('character').command, 'character');
    assert.equal(findActionById('stats').command, 'stats');
    assert.equal(findActionById('skills').command, 'skills');
    assert.equal(findActionById('save').command, 'save');
    assert.equal(findActionById('stats').intent, 'command.route');
    assert.deepEqual(findActionById('stats').payload, { command: 'stats' });
    assert.equal(TOP_ACTIONS[0].intent, 'ui.menu.open');
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
    assert.equal(snapshot.coordinate, 'G-10');
});

test('canvas compass exposes uniform 3x3 movement buttons and auto-run toggle', () => {
    const state = createInitialState();
    const uiState = createCanvasUiState({ screen: 'game' });
    const compassActions = createCompassActionList(state, uiState);
    const layout = createCanvasLayout({ width: 1200, height: 800, actions: createActionList(state), compassActions });

    assert.equal(layout.compassButtons.length, 9);
    const first = layout.compassButtons[0].rect;
    assert.equal(layout.compassButtons.every((button) => button.rect.w === first.w && button.rect.h === first.h), true);
    assert.equal(layout.compassButtons[0].action.label, '↖');
    assert.equal(layout.compassButtons[4].action.id, 'compassStop');
    assert.equal(layout.autoRunButton.action.id, 'autoRun');
    assert.equal(hitTestAction(layout, layout.compassButtons[1].rect.x + 2, layout.compassButtons[1].rect.y + 2).action.intent, 'navigation.move');
});

test('held compass movement clears on pointer release', () => {
    const state = createInitialState();
    const uiState = createCanvasUiState({ screen: 'game' });
    const compassActions = createCompassActionList(state, uiState);
    const layout = createCanvasLayout({ width: 1200, height: 800, actions: createActionList(state), compassActions });
    const east = layout.compassButtons.find((button) => button.action.payload?.direction === 'east');

    handlePointerDown(uiState, layout, east.rect.x + 2, east.rect.y + 2);
    assert.equal(uiState.heldDirection, 'east');
    const result = handlePointerUp(uiState, layout, 0, 0);

    assert.deepEqual(result, { type: 'none' });
    assert.equal(uiState.heldDirection, null);
    assert.equal(uiState.movementHeldSince, null);
});

test('quick compass press moves once and release prevents further held movement', () => {
    const harness = createCanvasAppHarness();
    try {
        const { app, canvas } = harness;
        app.uiState.screen = 'game';
        app.render();
        const layout = createCanvasLayout({
            width: 1200,
            height: 800,
            actions: createActionList(app.state),
            compassActions: createCompassActionList(app.state, app.uiState),
            topActions: TOP_ACTIONS,
        });
        const east = layout.compassButtons.find((button) => button.action.payload?.direction === 'east');

        canvas.listeners.pointerdown(pointerEvent(east.rect.x + 2, east.rect.y + 2));
        assert.equal(app.state.position.coord, 'H-10');
        assert.equal(app.uiState.heldDirection, 'east');

        canvas.listeners.pointerup(pointerEvent(east.rect.x + 2, east.rect.y + 2));
        assert.equal(app.uiState.heldDirection, null);
        harness.window.interval.handler();
        assert.equal(app.state.position.coord, 'H-10');
    } finally {
        harness.restore();
    }
});

test('typed stop dispatches navigation stop and clears UI movement state', () => {
    const harness = createCanvasAppHarness();
    try {
        const { app, canvas } = harness;
        app.uiState.screen = 'game';
        app.uiState.inputBuffer = 'stop';
        app.uiState.autoRunEnabled = true;
        app.uiState.activeAutoRunDirection = 'east';
        app.uiState.heldDirection = 'east';
        app.uiState.movementHeldSince = 1;
        app.uiState.queuedMove = { direction: 'east' };
        app.uiState.nextMoveAt = 10000;
        app.uiState.activeMoveEndsAt = 10000;
        app.uiState.lastMoveDurationSeconds = 10;

        canvas.listeners.keydown(keyEvent('Enter'));

        assert.equal(app.uiState.activeAutoRunDirection, null);
        assert.equal(app.uiState.heldDirection, null);
        assert.equal(app.uiState.queuedMove, null);
        assert.equal(app.uiState.nextMoveAt, null);
        assert.equal(app.uiState.activeMoveEndsAt, null);
        assert.match(app.uiState.outputLines.join('\n'), /already stopped|Stopped traveling/);
    } finally {
        harness.restore();
    }
});

test('canvas UI state defaults to splash menu and can switch screens and modals', () => {
    const uiState = createCanvasUiState();

    assert.equal(uiState.screen, 'menu');
    assert.equal(uiState.modal, null);
    assert.equal(uiState.modalPage, null);
    assert.equal(setCanvasScreen(uiState, 'game'), 'game');
    assert.equal(setCanvasModal(uiState, 'settings', 'clock'), 'settings');
    assert.equal(uiState.modalPage, 'clock');
    assert.equal(setModalPage(uiState, 'general'), 'general');
    assert.equal(uiState.modalPage, 'general');
    assert.equal(setCanvasModal(uiState, null), null);
    assert.equal(uiState.modalPage, null);
    assert.equal(setCanvasScreen(uiState, 'menu'), 'menu');
});

test('modal fields receive keyboard input and tab focus', () => {
    const uiState = createCanvasUiState({ modal: 'createAccount' });
    setCanvasModal(uiState, 'createAccount');

    for (const key of 'Russell') applyCanvasKey(uiState, key);
    assert.equal(uiState.modalInputs.accountName, 'Russell');
    applyCanvasKey(uiState, 'Tab');
    for (const key of 'pwd') applyCanvasKey(uiState, key);

    assert.equal(uiState.focusedModalField, 'password');
    assert.equal(uiState.modalInputs.password, 'pwd');
    assert.deepEqual(applyCanvasKey(uiState, 'Enter'), { type: 'submit', command: '__modal_create_account__' });
});

test('login password modal masks and submits password field', () => {
    const uiState = createCanvasUiState({ modal: 'loginPassword' });
    setCanvasModal(uiState, 'loginPassword');

    for (const key of 'secret') applyCanvasKey(uiState, key);

    assert.equal(uiState.focusedModalField, 'password');
    assert.equal(uiState.modalInputs.password, 'secret');
    assert.deepEqual(applyCanvasKey(uiState, 'Enter'), { type: 'submit', command: '__modal_login__' });
});

test('escape opens menu from game screen or closes a modal', () => {
    const uiState = createCanvasUiState({ screen: 'game' });

    assert.deepEqual(applyCanvasKey(uiState, 'Escape'), { type: 'menu' });
    uiState.modal = 'settings';
    uiState.modalPage = 'clock';
    assert.deepEqual(applyCanvasKey(uiState, 'Escape'), { type: 'modal' });
    assert.equal(uiState.modal, null);
    assert.equal(uiState.modalPage, null);
});

test('escape closes a non-field modal before creator cancellation', () => {
    const uiState = createCanvasUiState({ screen: 'creator', modal: 'mainMenu' });

    assert.deepEqual(applyCanvasKey(uiState, 'Escape'), { type: 'modal' });
    assert.equal(uiState.modal, null);
    assert.equal(uiState.screen, 'creator');
});

test('canvas menu action list shows only new account when logged out with no accounts', () => {
    const loggedOut = createMenuActionList({ loggedIn: false, accounts: [] });

    assert.equal(findActionById('login', loggedOut), null);
    assert.equal(findActionById('createAccount', loggedOut).label, 'New Account');
    assert.equal(findActionById('createAccount', loggedOut).intent, 'account.create.open');
});

test('canvas menu action list shows login and new account when local accounts exist', () => {
    const loggedOut = createMenuActionList({ loggedIn: false, accounts: [{ id: 'account-1', displayName: 'Russell', characterCount: 0 }] });

    assert.equal(findActionById('login', loggedOut).intent, 'account.login.open');
    assert.equal(findActionById('createAccount', loggedOut).intent, 'account.create.open');
});

test('canvas create account modal confirms account creation without cancel action', () => {
    const createModal = createMenuActionList({ loggedIn: false, accounts: [] }, 'createAccount');

    assert.equal(findActionById('confirmCreateAccount', createModal).label, 'Create Account');
    assert.equal(findActionById('confirmCreateAccount', createModal).intent, 'account.create.confirm');
    assert.equal(findActionById('cancelModal', createModal), null);
});

test('canvas login modal lists local accounts and password modal confirms login', () => {
    const session = { loggedIn: false, accounts: [{ id: 'account-1', displayName: 'Russell' }] };
    const loginModal = createMenuActionList(session, 'login');
    const passwordModal = createMenuActionList(session, 'loginPassword');

    assert.equal(findActionById('account:account-1', loginModal).intent, 'account.select');
    assert.equal(findActionById('account:account-1', loginModal).payload.accountId, 'account-1');
    assert.equal(findActionById('account:account-1', loginModal).payload.displayName, 'Russell');
    assert.equal(findActionById('cancelModal', loginModal), null);
    assert.equal(findActionById('confirmLogin', passwordModal).label, 'Login');
    assert.equal(findActionById('confirmLogin', passwordModal).intent, 'account.login.confirm');
});

test('canvas settings modal exposes explicit root and subpage actions', () => {
    const session = {
        loggedIn: true,
        displayName: 'Russell',
        characterCount: 2,
        settings: {
            theme: 'dark',
            uiScale: 'auto',
            layoutMode: 'auto',
            layoutProportion: 'standard',
            showClock: true,
            clockFormat: '12h',
            timeZoneMode: 'manual',
            gmtOffset: 0,
            daylightSavings: 'auto',
        },
    };
    const root = createMenuActionList(session, 'settings');
    const general = createMenuActionList(session, 'settings', 'general');
    const clock = createMenuActionList(session, 'settings', 'clock');
    const account = createMenuActionList(session, 'settings', 'account');
    const loggedOut = createMenuActionList({ loggedIn: false }, 'settings');

    assert.equal(findActionById('generalSettings', root).intent, 'settings.page.general');
    assert.equal(findActionById('accountSettings', root).intent, 'settings.page.account');
    assert.equal(findActionById('uiScale', general).label, 'Page scale: auto');
    assert.equal(findActionById('layoutMode', general).intent, 'settings.cycleLayoutMode');
    assert.equal(findActionById('layoutProportion', general).intent, 'settings.cycleLayoutProportion');
    assert.equal(findActionById('clockPage', general).intent, 'settings.page.clock');
    assert.equal(findActionById('clockToggle', clock).label, 'Clock: Shown');
    assert.equal(findActionById('clockFormat', clock).intent, 'settings.toggleClockFormat');
    assert.equal(findActionById('gmtDown', clock).intent, 'settings.gmtDown');
    assert.equal(findActionById('gmtValue', clock).disabled, undefined);
    assert.equal(findActionById('daylightSavings', clock).intent, 'settings.cycleDaylightSavings');
    assert.equal(findActionById('accountName', account).label, 'Account: Russell');
    assert.equal(findActionById('logout', account).intent, 'account.logout');
    assert.equal(loggedOut.length, 1);
    assert.equal(findActionById('createAccount', loggedOut).label, 'New Account');
});

test('canvas menu action list shows character selection and creation after login', () => {
    const loggedIn = createMenuActionList({ loggedIn: true, characters: [{ id: 'character-1', name: 'Aldo', job: 'Warrior', level: 5 }] });

    assert.equal(findActionById('character:character-1', loggedIn).intent, 'character.select');
    assert.equal(findActionById('character:character-1', loggedIn).payload.characterId, 'character-1');
    assert.equal(findActionById('character:character-1', loggedIn).payload.displayName, 'Aldo');
    assert.equal(findActionById('newCharacter', loggedIn).label, 'New Character');
    assert.equal(findActionById('newCharacter', loggedIn).intent, 'creator.open');
    assert.deepEqual(findActionById('newCharacter', loggedIn).payload, {});
    assert.equal(findActionById('settings', loggedIn), null);
    assert.equal(findActionById('logout', loggedIn), null);
});

test('canvas main menu shows account actions after login', () => {
    const mainMenu = createMenuActionList({ loggedIn: true, characters: [], displayName: 'Russell', characterCount: 0 }, 'mainMenu');

    assert.equal(findActionById('settings', mainMenu).label, 'Settings');
    assert.equal(findActionById('settings', mainMenu).intent, 'settings.open');
    assert.equal(findActionById('account', mainMenu).payload.command, '/account');
    assert.equal(findActionById('logout', mainMenu).intent, 'account.logout');
});

test('canvas menu action list prompts character creation when no characters exist', () => {
    const loggedIn = createMenuActionList({ loggedIn: true, characters: [] });

    assert.equal(findActionById('newCharacter', loggedIn).label, 'Create Character');
    assert.equal(loggedIn.some((action) => action.intent === 'character.select'), false);
});

test('canvas layout creates compact modal fields and top-right close button', () => {
    const layout = createCanvasLayout({
        width: 1200,
        height: 800,
        actions: createActionList({ activeBattle: null }),
        menuActions: createMenuActionList({ loggedIn: false, accounts: [] }, 'createAccount'),
        topActions: TOP_ACTIONS,
        modal: 'createAccount',
    });

    assert.equal(layout.modalFields.length, 2);
    assert.equal(layout.modalFields[0].label, 'Account Name');
    assert.equal(layout.modalFields[1].label, 'Password');
    assert.equal(layout.modalCloseButton.action.intent, 'ui.modal.close');
    assert.ok(layout.panels.modal.w <= 340);
    assert.ok(layout.panels.modal.h <= 190);
    const accountField = layout.modalFields[0];
    assert.equal(hitTestModalField(layout, accountField.rect.x + 4, accountField.rect.y + 4).id, 'accountName');
    assert.equal(hitTestAction(layout, layout.modalCloseButton.rect.x + 2, layout.modalCloseButton.rect.y + 2).action.id, 'modalClose');
});

test('canvas layout creates splash menu and left top menu button bounds', () => {
    const layout = createCanvasLayout({
        width: 1200,
        height: 800,
        actions: createActionList({ activeBattle: null }),
        menuActions: createMenuActionList({ loggedIn: false, accounts: [{ id: 'account-1', displayName: 'Russell' }] }),
        topActions: TOP_ACTIONS,
    });

    assert.ok(layout.menuButtons.find((button) => button.action.id === 'login').rect.w > 100);
    const menuButton = layout.topButtons.find((button) => button.action.id === 'menu');
    assert.equal(menuButton.rect.w, 34);
    assert.ok(menuButton.rect.x < 40);
});

function createCanvasAppHarness() {
    const previousWindow = globalThis.window;
    const previousStorage = globalThis.localStorage;
    const windowListeners = {};
    const fakeWindow = {
        devicePixelRatio: 1,
        innerWidth: 1200,
        innerHeight: 800,
        location: { reload() {} },
        interval: null,
        addEventListener(type, handler) {
            windowListeners[type] = handler;
        },
        removeEventListener(type) {
            delete windowListeners[type];
        },
        setInterval(handler, ms) {
            this.interval = { handler, ms };
            return 1;
        },
        clearInterval() {
            this.interval = null;
        },
    };
    const canvas = createFakeCanvas();
    globalThis.window = fakeWindow;
    globalThis.localStorage = new MemoryStorage();
    const app = createCanvasApp({ canvas });
    return {
        app,
        canvas,
        window: fakeWindow,
        restore() {
            app.destroy();
            if (previousWindow === undefined) delete globalThis.window;
            else globalThis.window = previousWindow;
            if (previousStorage === undefined) delete globalThis.localStorage;
            else globalThis.localStorage = previousStorage;
        },
    };
}

function createFakeCanvas() {
    const listeners = {};
    return {
        clientWidth: 1200,
        clientHeight: 800,
        width: 0,
        height: 0,
        style: {},
        tabIndex: 0,
        listeners,
        addEventListener(type, handler) {
            listeners[type] = handler;
        },
        getBoundingClientRect() {
            return { left: 0, top: 0 };
        },
        getContext() {
            return createFakeContext();
        },
        focus() {},
    };
}

function createFakeContext() {
    return {
        font: '',
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        lineCap: 'butt',
        textAlign: 'left',
        clearRect() {},
        fillRect() {},
        setTransform() {},
        beginPath() {},
        moveTo() {},
        lineTo() {},
        quadraticCurveTo() {},
        closePath() {},
        fill() {},
        stroke() {},
        fillText() {},
        measureText(value) {
            return { width: String(value).length * 8 };
        },
    };
}

function pointerEvent(x, y) {
    return { clientX: x, clientY: y };
}

function keyEvent(key) {
    return {
        key,
        ctrlKey: false,
        metaKey: false,
        altKey: false,
        preventDefault() {},
    };
}
