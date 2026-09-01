import test from 'node:test';
import assert from 'node:assert/strict';

import { createCommandRouter } from '../js/text/commandRouter.js';
import { createInitialState } from '../js/text/gameState.js';
import {
    createAccountWithPassword,
    decodePayload,
    encodePayload,
    loadCharacter,
    saveGame,
} from '../js/text/save.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { emitSemanticEvent } from '../js/text/systems/semanticEventEngine.js';
import { VERSION } from '../js/text/version.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage(accountName) {
    globalThis.localStorage = new MemoryStorage();
    assert.equal(createAccountWithPassword(accountName, 'pwd', { persistentLogin: true }).ok, true);
}

function storedCharacterState() {
    const registry = decodePayload(globalThis.localStorage.getItem('hearthHorizonAccounts'));
    const record = registry.accounts[0].characters[0];
    return { registry, record, state: decodePayload(record.encodedState) };
}

test('Game State 16 raw payload does not require runtime presentation projections', () => {
    const state = createInitialState();
    assert.equal(VERSION.gameState, 16);
    delete state.npcs;
    delete state.enemies;
    delete state.log;
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('command log is wall-clock presentation history without semantic or world-time authority', () => {
    const state = createInitialState();
    const router = createCommandRouter(state);
    const worldTimeBefore = state.worldTime.totalSeconds;
    const eventsBefore = structuredClone(state.events);

    const help = router('help');
    assert.match(help, /Available commands:/);
    assert.equal(state.log.length, 1);
    assert.equal(state.log[0].entry, '> help');
    assert.equal(typeof state.log[0].at, 'string');
    assert.ok(Number.isFinite(Date.parse(state.log[0].at)));
    assert.equal(state.worldTime.totalSeconds, worldTimeBefore);
    assert.deepEqual(state.events, eventsBefore);

    const history = router('log');
    assert.match(history, /> help/);
    assert.match(history, /> log/);
    assert.equal(state.log.length, 2);
});

test('save omits command presentation history while preserving live session log and semantic events', () => {
    installStorage('Presentation Log Account');
    const state = createInitialState();
    state.player.identity.name = 'Sessionkeeper';
    const router = createCommandRouter(state);
    router('help');
    emitSemanticEvent(state, 'fixture.recorded', { marker: 'durable-observation' }, { source: 'test' });
    const expectedEvents = structuredClone(state.events);

    assert.equal(saveGame(state), true);
    assert.equal(state.log.length, 1, 'saving should not clear current-session presentation history');

    const stored = storedCharacterState().state;
    assert.equal(Object.hasOwn(stored, 'npcs'), false);
    assert.equal(Object.hasOwn(stored, 'enemies'), false);
    assert.equal(Object.hasOwn(stored, 'log'), false);
    assert.deepEqual(stored.events, expectedEvents);

    const loaded = loadCharacter('Sessionkeeper');
    assert.ok(loaded);
    assert.deepEqual(loaded.log, []);
    assert.deepEqual(loaded.events, expectedEvents);

    const loadedRouter = createCommandRouter(loaded);
    loadedRouter('version');
    assert.equal(loaded.log.length, 1);
    assert.equal(loaded.log[0].entry, '> version');
});

test('load resets injected serialized command history instead of treating it as character authority', () => {
    installStorage('Injected Presentation Log Account');
    const state = createInitialState();
    state.player.identity.name = 'Fresh Session';
    assert.equal(saveGame(state), true);

    const { registry, record, state: encodedState } = storedCharacterState();
    encodedState.log = [{ at: '1900-01-01T00:00:00.000Z', entry: '> forged-history' }];
    record.encodedState = encodePayload(encodedState);
    globalThis.localStorage.setItem('hearthHorizonAccounts', encodePayload(registry));

    const loaded = loadCharacter('Fresh Session');
    assert.ok(loaded);
    assert.deepEqual(loaded.log, []);
});
