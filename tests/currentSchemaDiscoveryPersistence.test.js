import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState, DEFAULT_START_WORLD_TIME_SECONDS } from '../js/text/gameState.js';
import {
    createAccountWithPassword,
    decodePayload,
    encodePayload,
    loadCharacter,
    saveGame,
} from '../js/text/save.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { talkAtCurrentGrid } from '../js/text/systems/poiEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
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

function firstVisit(state) {
    const entry = state.atlas[state.currentPlaceId];
    const key = Object.keys(entry.visited)[0];
    return entry.visited[key];
}

test('current discovery uses canonical fictional time and validates acquired POI knowledge', () => {
    const state = createInitialState();
    assert.equal(state.version, VERSION.gameState);
    assert.equal(VERSION.gameState, 8);
    assert.equal(firstVisit(state).visitedAtWorldSeconds, DEFAULT_START_WORLD_TIME_SECONDS);
    assert.equal(Object.hasOwn(firstVisit(state), 'visitedAt'), false);

    state.worldTime.totalSeconds += 321;
    assert.equal(setPositionAndDiscover(state, 'thornwall-southgate', { coord: 'F-10' }).ok, true);
    assert.equal(state.atlas['thornwall-southgate'].visited['F-10'].visitedAtWorldSeconds, DEFAULT_START_WORLD_TIME_SECONDS + 321);

    talkAtCurrentGrid(state);
    const discovered = Object.values(state.discoveredPois).flat();
    assert.ok(discovered.length > 0, 'starting locality interaction should acquire at least one POI');
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects legacy wall-clock atlas visits and malformed POI discovery', () => {
    const legacyVisit = createInitialState();
    const visit = firstVisit(legacyVisit);
    delete visit.visitedAtWorldSeconds;
    visit.visitedAt = '2026-08-18T00:00:00.000Z';
    const legacyIssues = validateCurrentGameStateStructure(legacyVisit);
    assert.ok(legacyIssues.some((issue) => issue.includes('visitedAtWorldSeconds')));
    assert.ok(legacyIssues.some((issue) => issue.includes('wall-clock')));

    const wrongPoiPlace = createInitialState();
    talkAtCurrentGrid(wrongPoiPlace);
    const sourcePlaceId = Object.keys(wrongPoiPlace.discoveredPois)[0];
    const poiId = wrongPoiPlace.discoveredPois[sourcePlaceId][0];
    wrongPoiPlace.discoveredPois = { 'west-elderwood': [poiId, poiId] };
    const poiIssues = validateCurrentGameStateStructure(wrongPoiPlace);
    assert.ok(poiIssues.some((issue) => issue.includes('belongs to')));
    assert.ok(poiIssues.some((issue) => issue.includes('duplicates')));
});

test('canonical discovery state survives real current save and load unchanged', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Discovery Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Wayfinder';
    state.worldTime.totalSeconds += 777;
    assert.equal(setPositionAndDiscover(state, 'thornwall-southgate', { coord: 'F-10' }).ok, true);
    talkAtCurrentGrid(state);
    const expectedAtlas = structuredClone(state.atlas);
    const expectedPois = structuredClone(state.discoveredPois);

    assert.equal(saveGame(state), true);
    const loaded = loadCharacter('Wayfinder');

    assert.ok(loaded);
    assert.equal(loaded.version, VERSION.gameState);
    assert.deepEqual(loaded.atlas, expectedAtlas);
    assert.deepEqual(loaded.discoveredPois, expectedPois);
});

test('load rejects a current save carrying legacy wall-clock discovery without rewriting it', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Legacy Discovery Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Oldclock';
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    const atlasEntry = malformed.atlas[malformed.currentPlaceId];
    const visitKey = Object.keys(atlasEntry.visited)[0];
    const visit = atlasEntry.visited[visitKey];
    delete visit.visitedAtWorldSeconds;
    visit.visitedAt = '2026-08-18T00:00:00.000Z';
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Oldclock'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    const unchangedVisit = unchanged.atlas[unchanged.currentPlaceId].visited[visitKey];
    assert.equal(unchangedVisit.visitedAt, '2026-08-18T00:00:00.000Z');
    assert.equal(Object.hasOwn(unchangedVisit, 'visitedAtWorldSeconds'), false);
});
