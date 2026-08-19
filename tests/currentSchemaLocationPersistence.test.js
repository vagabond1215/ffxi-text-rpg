import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import {
    createAccountWithPassword,
    decodePayload,
    encodePayload,
    loadCharacter,
    saveGame,
} from '../js/text/save.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() { globalThis.localStorage = new MemoryStorage(); }

function createGridLocationState() {
    const state = createInitialState();
    state.player.identity.name = 'Waykeeper';
    const moved = setPositionAndDiscover(state, 'west-elderwood', {
        coord: 'I-6',
        levelId: 'main',
        facing: 'west',
    });
    assert.equal(moved.ok, true);
    return state;
}

test('current schema accepts canonical topology and external-grid location state', () => {
    const topology = createInitialState();
    assert.equal(topology.currentPlaceId, 'thornwall-southgate');
    assert.deepEqual(validateCurrentGameStateStructure(topology), []);

    const grid = createGridLocationState();
    assert.equal(grid.currentPlaceId, 'west-elderwood');
    assert.equal(grid.location, 'West Elderwood');
    assert.equal(grid.position.placeId, 'west-elderwood');
    assert.equal(grid.position.coord, 'I-6');
    assert.equal(grid.position.x, 4);
    assert.equal(grid.position.y, 7);
    assert.deepEqual(validateCurrentGameStateStructure(grid), []);
});

test('current schema rejects unknown place stale location and cross-place position authority', () => {
    const unknownPlace = createInitialState();
    unknownPlace.currentPlaceId = 'legacy-unknown-place';
    assert.ok(validateCurrentGameStateStructure(unknownPlace).some((issue) => issue.includes('currentPlaceId must reference a canonical place id')));

    const staleLocation = createInitialState();
    staleLocation.location = 'Somewhere Else';
    assert.ok(validateCurrentGameStateStructure(staleLocation).some((issue) => issue.includes('location must match canonical place name Thornwall Southgate')));

    const wrongPlaceId = createInitialState();
    wrongPlaceId.position.placeId = 'west-elderwood';
    assert.ok(validateCurrentGameStateStructure(wrongPlaceId).some((issue) => issue.includes('position.placeId must match currentPlaceId thornwall-southgate')));
});

test('current schema rejects malformed topology and grid coordinates before runtime normalization', () => {
    const badTopology = createInitialState();
    badTopology.position.coord = 'ZZ-999';
    assert.ok(validateCurrentGameStateStructure(badTopology).some((issue) => issue.includes('position.coord must be navigable in thornwall-southgate')));

    const badFacing = createInitialState();
    badFacing.position.facing = 'forward';
    assert.ok(validateCurrentGameStateStructure(badFacing).some((issue) => issue.includes('position.facing must be a canonical direction')));

    const badGrid = createGridLocationState();
    badGrid.position.x = 999;
    assert.ok(validateCurrentGameStateStructure(badGrid).some((issue) => issue.includes('position must be inside west-elderwood')));
    assert.ok(validateCurrentGameStateStructure(badGrid).some((issue) => issue.includes('position.coord must map to the persisted x/y position in west-elderwood')));
});

test('non-trivial current location survives real save and load unchanged', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Location Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = createGridLocationState();
    const expected = {
        currentPlaceId: state.currentPlaceId,
        location: state.location,
        position: structuredClone(state.position),
    };

    assert.equal(saveGame(state), true);
    const loaded = loadCharacter('Waykeeper');

    assert.ok(loaded);
    assert.equal(loaded.currentPlaceId, expected.currentPlaceId);
    assert.equal(loaded.location, expected.location);
    assert.deepEqual(loaded.position, expected.position);
    assert.deepEqual(validateCurrentGameStateStructure(loaded), []);
});

test('load rejects contradictory persisted location without repairing it', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Strict Location Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = createGridLocationState();
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    malformed.location = 'Thornwall Southgate';
    malformed.position.placeId = 'thornwall-southgate';
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Waykeeper'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.location, 'Thornwall Southgate');
    assert.equal(unchanged.position.placeId, 'thornwall-southgate');
});
