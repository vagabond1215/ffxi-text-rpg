import test from 'node:test';
import assert from 'node:assert/strict';

import { getPoisForPlace } from '../js/text/data/pointsOfInterest.js';
import { createInitialState, DEFAULT_START_WORLD_TIME_SECONDS } from '../js/text/gameState.js';
import {
    createAccountWithPassword,
    decodePayload,
    encodePayload,
    loadCharacter,
    saveGame,
} from '../js/text/save.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import {
    addTemporaryGuidance,
    identifyNpc,
    recordPoiExposure,
} from '../js/text/systems/localKnowledgeEngine.js';
import { getPoiScheduleStatus } from '../js/text/systems/npcScheduleEngine.js';
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

test('current Game State persists atlas time plus layered locality and NPC knowledge', () => {
    const state = createInitialState();
    assert.equal(state.version, VERSION.gameState);
    assert.equal(VERSION.gameState, 20);
    assert.equal(firstVisit(state).visitedAtWorldSeconds, DEFAULT_START_WORLD_TIME_SECONDS);
    assert.equal(Object.hasOwn(firstVisit(state), 'visitedAt'), false);
    assert.equal(Object.hasOwn(state, 'discoveredPois'), false);
    assert.equal(state.localKnowledge.version, 1);

    state.worldTime.totalSeconds += 321;
    assert.equal(setPositionAndDiscover(state, 'thornwall-southgate', { coord: 'F-10' }).ok, true);
    assert.equal(state.atlas['thornwall-southgate'].visited['F-10'].visitedAtWorldSeconds, DEFAULT_START_WORLD_TIME_SECONDS + 321);

    const poi = getPoisForPlace('thornwall-southgate')[0];
    recordPoiExposure(state, poi, { points: 2, learnedName: true });
    const schedule = getPoiScheduleStatus(state, poi);
    if (schedule.npcId) identifyNpc(state, schedule.npcId);
    addTemporaryGuidance(state, { targetType: 'poi', targetId: poi.id, sourceId: 'test-guide', searchWeightBonus: 4 });

    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects legacy discoveredPois and malformed local knowledge references', () => {
    const legacy = createInitialState();
    legacy.discoveredPois = {};
    assert.ok(validateCurrentGameStateStructure(legacy).some((issue) => issue.includes('discoveredPois is legacy state')));

    const malformed = createInitialState();
    malformed.localKnowledge.pois['poi-missing'] = {
        poiId: 'poi-missing',
        placeId: malformed.currentPlaceId,
        knowledgeState: 'sighted',
        familiarityPoints: 1,
        learnedName: false,
        firstSeenAtWorldSeconds: 0,
        lastSeenAtWorldSeconds: 0,
    };
    assert.ok(validateCurrentGameStateStructure(malformed).some((issue) => issue.includes('unknown POI')));
});

test('local knowledge and temporary guidance survive real current save and load unchanged', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Knowledge Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Wayfinder';
    state.worldTime.totalSeconds += 777;
    const poi = getPoisForPlace(state.currentPlaceId)[0];
    recordPoiExposure(state, poi, { points: 3, learnedName: true });
    addTemporaryGuidance(state, {
        targetType: 'poi',
        targetId: poi.id,
        sourceId: 'guard-patrol',
        searchWeightBonus: 5,
        expiresAtWorldSeconds: state.worldTime.totalSeconds + 3600,
    });
    const expectedAtlas = structuredClone(state.atlas);
    const expectedKnowledge = structuredClone(state.localKnowledge);

    assert.equal(saveGame(state), true);
    const loaded = loadCharacter('Wayfinder');

    assert.ok(loaded);
    assert.equal(loaded.version, VERSION.gameState);
    assert.deepEqual(loaded.atlas, expectedAtlas);
    assert.deepEqual(loaded.localKnowledge, expectedKnowledge);
});

test('load rejects a current save carrying malformed local knowledge without rewriting it', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Malformed Knowledge Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createInitialState();
    state.player.identity.name = 'Badknowledge';
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    malformed.localKnowledge.currentAnchor = { type: 'poi', id: 'poi-missing', placeId: malformed.currentPlaceId };
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Badknowledge'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.localKnowledge.currentAnchor.id, 'poi-missing');
});
