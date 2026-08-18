import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import {
    createAccountWithPassword,
    decodePayload,
    encodePayload,
    loadAccount,
    loadCharacter,
    saveGame,
} from '../js/text/save.js';
import { startRouteJourney } from '../js/text/systems/transportEngine.js';
import { VERSION } from '../js/text/version.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() {
    globalThis.localStorage = new MemoryStorage();
}

test('an older account registry is rejected instead of migrated', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Current Account', 'pwd', { persistentLogin: true }).ok, true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    registry.version = VERSION.accountSave - 1;
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadAccount(), null);
    const unchanged = decodePayload(globalThis.localStorage.getItem(key));
    assert.equal(unchanged.version, VERSION.accountSave - 1);
});

test('an older character state is rejected instead of migrated or rewritten', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Current Character Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Currenthero';
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const oldState = decodePayload(record.encodedState);
    oldState.version = VERSION.gameState - 1;
    record.encodedState = encodePayload(oldState);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Currenthero'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchangedState = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(unchangedState.version, VERSION.gameState - 1);
});

test('a current-version save missing a required top-level registry is rejected without lazy reconstruction', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Strict Structure Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Strictkeeper';
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const incomplete = decodePayload(record.encodedState);
    delete incomplete.tasks;
    record.encodedState = encodePayload(incomplete);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Strictkeeper'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchangedState = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(Object.hasOwn(unchangedState, 'tasks'), false);
});

test('a current-version save missing required character capability state is rejected without lazy reconstruction', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Strict Character Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Strictcap';
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const incomplete = decodePayload(record.encodedState);
    delete incomplete.player.progression.capabilities;
    record.encodedState = encodePayload(incomplete);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Strictcap'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchangedState = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(Object.hasOwn(unchangedState.player.progression, 'capabilities'), false);
});

test('saveGame rejects a malformed current runtime state instead of filling required registries', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Strict Save Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Strictsave';
    delete state.ecology;

    assert.equal(saveGame(state), false);
    assert.equal(loadAccount().characters.length, 0);
    assert.equal(Object.hasOwn(state, 'ecology'), false);
});

test('world time persists through current-schema save and load without wall-clock recomputation', () => {
    installStorage();
    assert.equal(createAccountWithPassword('World Time Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Clockkeeper';
    state.worldTime.totalSeconds = 123456;
    assert.equal(saveGame(state), true);

    const loaded = loadCharacter('Clockkeeper');

    assert.equal(loaded.version, VERSION.gameState);
    assert.equal(loaded.worldTime.totalSeconds, 123456);
});

test('current active travel survives save/load with the same linked timed task', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Travel Persistence Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Roadkeeper';
    const started = startRouteJourney(state, {
        routeId: 'strict-travel-route',
        from: state.currentPlaceId,
        to: 'west-elderwood',
        mode: 'walk',
        durationSeconds: 30,
    });
    assert.equal(started.ok, true, started.display?.text);
    const taskId = started.data.task.id;
    assert.equal(saveGame(state), true);

    const loaded = loadCharacter('Roadkeeper');
    assert.ok(loaded);
    assert.equal(loaded.travel.version, 2);
    assert.equal(loaded.travel.taskId, taskId);
    assert.equal(loaded.tasks.records.length, 1);
    assert.equal(loaded.tasks.records[0].id, taskId);
    assert.equal(loaded.tasks.records[0].completesAtWorldSeconds, loaded.travel.arriveAtWorldSeconds);
});

test('current-version legacy-shaped active travel is rejected instead of reconstructed', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Strict Travel Shape Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Strictroad';
    const started = startRouteJourney(state, {
        routeId: 'strict-travel-shape',
        from: state.currentPlaceId,
        to: 'west-elderwood',
        mode: 'walk',
        durationSeconds: 30,
    });
    assert.equal(started.ok, true);
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    delete malformed.travel.version;
    delete malformed.travel.status;
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Strictroad'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(Object.hasOwn(unchanged.travel, 'version'), false);
    assert.equal(Object.hasOwn(unchanged.travel, 'status'), false);
    assert.equal(unchanged.tasks.records.length, 1, 'load must not manufacture a replacement travel task');
});

test('current active travel with a missing linked task is rejected instead of repaired', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Strict Travel Link Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Strictlink';
    const started = startRouteJourney(state, {
        routeId: 'strict-travel-link',
        from: state.currentPlaceId,
        to: 'west-elderwood',
        mode: 'walk',
        durationSeconds: 30,
    });
    assert.equal(started.ok, true);
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    const taskId = malformed.travel.taskId;
    malformed.tasks.records = malformed.tasks.records.filter((task) => task.id !== taskId);
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Strictlink'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.travel.taskId, taskId);
    assert.equal(unchanged.tasks.records.length, 0, 'load must not reconstruct the missing task');
});
