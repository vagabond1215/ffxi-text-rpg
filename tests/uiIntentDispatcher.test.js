import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState, replaceState } from '../js/text/gameState.js';
import {
    createAccountWithPassword,
    loadAccountSession,
    loadCharacter,
    loginAccount,
    logoutAccount,
    saveGame,
    updateAccountSettings,
} from '../js/text/save.js';
import { createCanvasUiState } from '../js/text/ui/canvasInput.js';
import { dispatchUiIntent } from '../js/text/ui/uiIntentDispatcher.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';

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

function installStorage() {
    globalThis.localStorage = new MemoryStorage();
}

function accountServices() {
    return {
        loadAccountSession,
        createAccountWithPassword,
        loginAccount,
        logoutAccount,
        updateAccountSettings,
        loadCharacter,
        replaceState,
    };
}

test('account create intent creates a local account without a command string', () => {
    installStorage();
    const state = createInitialState();
    const uiState = createCanvasUiState({ modalInputs: { accountName: 'Russell', password: 'pwd' } });

    const result = dispatchUiIntent({
        intent: 'account.create.confirm',
        payload: {},
        state,
        uiState,
        session: loadAccountSession(),
        services: accountServices(),
    });

    assert.equal(result.ok, true);
    assert.equal(result.session.loggedIn, true);
    assert.equal(result.session.displayName, 'Russell');
    assert.equal(uiState.inputBuffer, '');
    assert.equal(uiState.selectedAccountId, result.session.accountId);
    assert.deepEqual(uiState.commandHistory, []);
    assert.match(uiState.outputLines.join('\n'), /Created account: Russell/);
});

test('account select and login confirmation intents do not depend on command strings', () => {
    installStorage();
    const created = createAccountWithPassword('Russell', 'pwd');
    logoutAccount();
    const state = createInitialState();
    const uiState = createCanvasUiState();

    const selected = dispatchUiIntent({
        intent: 'account.select',
        payload: { accountId: created.session.accountId, displayName: 'Russell' },
        state,
        uiState,
        session: loadAccountSession(),
        services: accountServices(),
    });
    uiState.modalInputs.password = 'pwd';
    const confirmed = dispatchUiIntent({
        intent: 'account.login.confirm',
        payload: {},
        state,
        uiState,
        session: selected.session,
        services: accountServices(),
    });

    assert.equal(selected.ok, true);
    assert.equal(uiState.selectedAccountId, created.session.accountId);
    assert.equal(confirmed.ok, true);
    assert.equal(confirmed.session.loggedIn, true);
    assert.equal(confirmed.session.displayName, 'Russell');
    assert.equal(uiState.modal, null);
});

test('settings intents update account settings directly', () => {
    installStorage();
    createAccountWithPassword('Russell', 'pwd', { persistentLogin: true });
    const state = createInitialState();
    const uiState = createCanvasUiState();
    let session = loadAccountSession();

    const opened = dispatchUiIntent({ intent: 'settings.open', state, uiState, session, services: accountServices() });
    session = opened.session;
    const general = dispatchUiIntent({ intent: 'settings.page.general', state, uiState, session, services: accountServices() });
    const themed = dispatchUiIntent({ intent: 'settings.cycleTheme', state, uiState, session, services: accountServices() });
    session = themed.session;
    const scaled = dispatchUiIntent({ intent: 'settings.cycleUiScale', state, uiState, session, services: accountServices() });
    session = scaled.session;
    const clockPage = dispatchUiIntent({ intent: 'settings.page.clock', state, uiState, session, services: accountServices() });
    const clocked = dispatchUiIntent({ intent: 'settings.toggleClock', state, uiState, session, services: accountServices() });
    session = clocked.session;
    const formatted = dispatchUiIntent({ intent: 'settings.toggleClockFormat', state, uiState, session, services: accountServices() });
    session = formatted.session;
    const manual = dispatchUiIntent({ intent: 'settings.toggleTimeZoneMode', state, uiState, session, services: accountServices() });
    session = manual.session;
    const gmt = dispatchUiIntent({ intent: 'settings.gmtUp', state, uiState, session, services: accountServices() });

    assert.equal(opened.ok, true);
    assert.equal(uiState.modal, 'settings');
    assert.equal(opened.session.settings.theme, 'dark');
    assert.equal(general.ok, true);
    assert.equal(uiState.modalPage, 'clock');
    assert.equal(clockPage.ok, true);
    assert.equal(themed.session.settings.theme, 'light');
    assert.equal(scaled.session.settings.uiScale, '90%');
    assert.equal(clocked.session.settings.showClock, false);
    assert.equal(formatted.session.settings.clockFormat, '24h');
    assert.equal(manual.session.settings.timeZoneMode, 'manual');
    assert.equal(gmt.session.settings.gmtOffset, 1);
    assert.equal(uiState.activeFeedback, 'Settings saved.');
});

test('character select intent loads a saved character into game state', () => {
    installStorage();
    createAccountWithPassword('Russell', 'pwd', { persistentLogin: true });
    const savedState = createInitialState();
    savedState.player.identity.name = 'Aldo';
    assert.equal(saveGame(savedState), true);
    const session = loadAccountSession();
    const state = createInitialState();
    state.player.identity.name = 'Before';
    const uiState = createCanvasUiState({ modal: 'characters' });

    const result = dispatchUiIntent({
        intent: 'character.select',
        payload: { characterId: session.characters[0].id, displayName: 'Aldo' },
        state,
        uiState,
        session,
        services: accountServices(),
    });

    assert.equal(result.ok, true);
    assert.equal(state.player.identity.name, 'Aldo');
    assert.equal(uiState.screen, 'game');
    assert.equal(uiState.modal, null);
    assert.match(uiState.outputLines.join('\n'), /Loaded Aldo/);
});

test('command route intent remains routed through the command adapter', () => {
    const state = createInitialState();
    const uiState = createCanvasUiState();
    const session = { loggedIn: true, accounts: [], settings: {} };
    let routedCommand = null;

    const result = dispatchUiIntent({
        intent: 'command.route',
        payload: { command: 'stats' },
        state,
        uiState,
        session,
        services: {
            commandAdapter(command) {
                routedCommand = command;
                return 'adapter output';
            },
            loadAccountSession: () => session,
        },
    });

    assert.equal(result.ok, true);
    assert.equal(routedCommand, 'stats');
    assert.equal(result.response, 'adapter output');
    assert.match(uiState.outputLines.join('\n'), /> stats\nadapter output/);
});

test('navigation intent moves through engine without a command string', () => {
    const state = createInitialState();
    const uiState = createCanvasUiState({ screen: 'game' });
    const session = { loggedIn: true, accounts: [], settings: {} };

    const result = dispatchUiIntent({
        intent: 'navigation.move',
        payload: { direction: 'east' },
        state,
        uiState,
        session,
        services: { loadAccountSession: () => session },
    });

    assert.equal(result.ok, true);
    assert.equal(state.position.coord, 'H-10');
    assert.deepEqual(uiState.commandHistory, []);
    assert.match(uiState.outputLines.join('\n'), /Moved east/);
});

test('auto run waits for movement duration before moving again', () => {
    const state = createInitialState();
    const uiState = createCanvasUiState({ screen: 'game', autoRunEnabled: true });
    const session = { loggedIn: true, accounts: [], settings: {} };

    const first = dispatchUiIntent({
        intent: 'navigation.move',
        payload: { direction: 'east', nowMs: 1000 },
        state,
        uiState,
        session,
        services: { loadAccountSession: () => session },
    });
    const blocked = dispatchUiIntent({
        intent: 'navigation.move',
        payload: { direction: 'east', source: 'autoRun', nowMs: 10999 },
        state,
        uiState,
        session,
        services: { loadAccountSession: () => session },
    });
    const second = dispatchUiIntent({
        intent: 'navigation.move',
        payload: { direction: 'east', source: 'autoRun', nowMs: 11000 },
        state,
        uiState,
        session,
        services: { loadAccountSession: () => session },
    });

    assert.equal(first.ok, true);
    assert.equal(first.movement.coordinate.coord, 'H-10');
    assert.equal(first.movement.durationSeconds, 10);
    assert.equal(uiState.lastMoveDurationSeconds, 10);
    assert.equal(blocked.cooldown, true);
    assert.equal(second.cooldown, undefined);
    assert.equal(second.movement.coordinate.coord, 'I-10');
    assert.equal(state.position.coord, 'I-10');
});

test('auto run clears movement state after a zone exit', () => {
    const state = createInitialState();
    setPositionAndDiscover(state, 'southern-sandoria', { coord: 'F-10' });
    const uiState = createCanvasUiState({
        screen: 'game',
        autoRunEnabled: true,
        heldDirection: 'west',
        activeAutoRunDirection: 'west',
        movementHeldSince: 1,
        queuedMove: { direction: 'west' },
        nextMoveAt: 9999,
        activeMoveEndsAt: 9999,
        lastMoveDurationSeconds: 10,
    });
    const session = { loggedIn: true, accounts: [], settings: {} };

    const result = dispatchUiIntent({
        intent: 'navigation.move',
        payload: { direction: 'west', source: 'autoRun', nowMs: 10000 },
        state,
        uiState,
        session,
        services: { loadAccountSession: () => session },
    });

    assert.equal(result.ok, true);
    assert.equal(result.movement.exited, true);
    assert.equal(state.currentPlaceId, 'west-ronfaure');
    assert.equal(uiState.activeAutoRunDirection, null);
    assert.equal(uiState.heldDirection, null);
    assert.equal(uiState.movementHeldSince, null);
    assert.equal(uiState.queuedMove, null);
    assert.equal(uiState.nextMoveAt, null);
    assert.equal(uiState.activeMoveEndsAt, null);
});

test('auto run toggle off clears held and queued movement state', () => {
    const state = createInitialState();
    const uiState = createCanvasUiState({
        screen: 'game',
        autoRunEnabled: true,
        heldDirection: 'north',
        activeAutoRunDirection: 'east',
        movementHeldSince: 1,
        queuedMove: { direction: 'east' },
        nextMoveAt: 10000,
        activeMoveEndsAt: 10000,
        lastMoveDurationSeconds: 10,
    });
    const session = { loggedIn: true, accounts: [], settings: {} };

    const result = dispatchUiIntent({
        intent: 'navigation.toggleAutoRun',
        state,
        uiState,
        session,
        services: { loadAccountSession: () => session },
    });

    assert.equal(result.autoRunEnabled, false);
    assert.equal(uiState.heldDirection, null);
    assert.equal(uiState.activeAutoRunDirection, null);
    assert.equal(uiState.movementHeldSince, null);
    assert.equal(uiState.queuedMove, null);
    assert.equal(uiState.nextMoveAt, null);
    assert.equal(uiState.activeMoveEndsAt, null);
});

test('menu intent opens the top menu modal without command routing', () => {
    const state = createInitialState();
    const uiState = createCanvasUiState({ screen: 'game', modal: 'settings', modalPage: 'clock' });
    const session = { loggedIn: true, accounts: [], settings: {} };

    const result = dispatchUiIntent({
        intent: 'ui.menu.open',
        payload: {},
        state,
        uiState,
        session,
        services: { loadAccountSession: () => session },
    });

    assert.equal(result.ok, true);
    assert.equal(uiState.screen, 'game');
    assert.equal(uiState.modal, 'mainMenu');
    assert.equal(uiState.modalPage, null);
});
