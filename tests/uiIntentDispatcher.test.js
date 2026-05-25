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
    const uiState = createCanvasUiState({ inputBuffer: 'Russell|pwd' });

    const result = dispatchUiIntent({
        intent: 'account.create',
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
    const uiState = createCanvasUiState({ inputBuffer: 'pwd' });

    const selected = dispatchUiIntent({
        intent: 'account.select',
        payload: { accountId: created.session.accountId, displayName: 'Russell' },
        state,
        uiState,
        session: loadAccountSession(),
        services: accountServices(),
    });
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
    const themed = dispatchUiIntent({ intent: 'settings.cycleTheme', state, uiState, session, services: accountServices() });
    session = themed.session;
    const zoned = dispatchUiIntent({ intent: 'settings.cycleTimeZone', state, uiState, session, services: accountServices() });
    session = zoned.session;
    const clocked = dispatchUiIntent({ intent: 'settings.toggleClock', state, uiState, session, services: accountServices() });
    session = clocked.session;
    const formatted = dispatchUiIntent({ intent: 'settings.toggleClockFormat', state, uiState, session, services: accountServices() });

    assert.equal(opened.ok, true);
    assert.equal(uiState.modal, 'settings');
    assert.equal(themed.session.settings.theme, 'light');
    assert.equal(zoned.session.settings.timeZone, 'UTC');
    assert.equal(clocked.session.settings.showClock, false);
    assert.equal(formatted.session.settings.clockFormat, '24h');
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

test('menu intent opens the menu without command routing', () => {
    const state = createInitialState();
    const uiState = createCanvasUiState({ screen: 'game', modal: 'settings' });
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
    assert.equal(uiState.screen, 'menu');
    assert.equal(uiState.modal, null);
});
