import test from 'node:test';
import assert from 'node:assert/strict';

import { createNewGameState } from '../js/text/gameState.js';
import {
    createAccountWithPassword,
    decodePayload,
    encodePayload,
    loadCharacter,
    saveGame,
} from '../js/text/save.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() { globalThis.localStorage = new MemoryStorage(); }

function createNonTrivialState() {
    const state = createNewGameState({
        name: 'Arden Vale',
        raceId: 'human',
        sex: 'female',
        nationId: 'brasshaven',
        mainJobId: 'vanguard',
    });
    state.player.identity.title = 'Road Surveyor';
    state.player.keyItems.push('brasshaven-guild-seal');
    state.player.flags['field-certified'] = true;
    state.player.flags['oath-broken'] = false;
    return state;
}

test('current schema accepts canonical non-trivial player identity key items and boolean flags', () => {
    const state = createNonTrivialState();

    assert.equal(state.player.identity.nation, 'Brasshaven');
    assert.equal(state.player.identity.startingCity, 'Brasshaven Market Ring');
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects contradictory or malformed persisted player identity facts', () => {
    const badName = createNonTrivialState();
    badName.player.identity.name = '  Arden';
    assert.ok(validateCurrentGameStateStructure(badName).some((issue) => issue.includes('player.identity.name must not have leading or trailing whitespace')));

    const badRace = createNonTrivialState();
    badRace.player.identity.raceId = 'legacy-hume';
    assert.ok(validateCurrentGameStateStructure(badRace).some((issue) => issue.includes('player.identity.raceId references unknown ancestry legacy-hume')));

    const staleRaceName = createNonTrivialState();
    staleRaceName.player.identity.raceName = 'Lethari';
    assert.ok(validateCurrentGameStateStructure(staleRaceName).some((issue) => issue.includes('player.identity.raceName must match canonical ancestry name Human')));

    const badSex = createNewGameState({ raceId: 'veyra', sex: 'female' });
    badSex.player.identity.sex = 'male';
    assert.ok(validateCurrentGameStateStructure(badSex).some((issue) => issue.includes('player.identity.sex male is not valid for ancestry veyra')));

    const badNation = createNonTrivialState();
    badNation.player.identity.nation = 'Legacy Republic';
    assert.ok(validateCurrentGameStateStructure(badNation).some((issue) => issue.includes('player.identity.nation references unknown canonical power Legacy Republic')));

    const badStartingCity = createNonTrivialState();
    badStartingCity.player.identity.startingCity = 'Thornwall Southgate';
    assert.ok(validateCurrentGameStateStructure(badStartingCity).some((issue) => issue.includes('player.identity.startingCity must match Brasshaven origin Brasshaven Market Ring')));

    const duplicateKeyItem = createNonTrivialState();
    duplicateKeyItem.player.keyItems.push(duplicateKeyItem.player.keyItems[0]);
    assert.ok(validateCurrentGameStateStructure(duplicateKeyItem).some((issue) => issue.includes('duplicates key item')));

    const malformedKeyItem = createNonTrivialState();
    malformedKeyItem.player.keyItems.push(' padded-id ');
    assert.ok(validateCurrentGameStateStructure(malformedKeyItem).some((issue) => issue.includes('must be a normalized non-empty string id')));

    const malformedFlag = createNonTrivialState();
    malformedFlag.player.flags['field-certified'] = 'yes';
    assert.ok(validateCurrentGameStateStructure(malformedFlag).some((issue) => issue.includes('player.flags.field-certified must be boolean')));
});

test('identity key-item and player-flag authority survives real current save and load unchanged', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Identity Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = createNonTrivialState();
    const expectedIdentity = structuredClone(state.player.identity);
    const expectedKeyItems = structuredClone(state.player.keyItems);
    const expectedFlags = structuredClone(state.player.flags);

    assert.equal(saveGame(state), true);
    const loaded = loadCharacter('Arden Vale');

    assert.ok(loaded);
    assert.deepEqual(loaded.player.identity, expectedIdentity);
    assert.deepEqual(loaded.player.keyItems, expectedKeyItems);
    assert.deepEqual(loaded.player.flags, expectedFlags);
});

test('load rejects malformed current player identity facts without repairing persisted data', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Strict Identity Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = createNonTrivialState();
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    malformed.player.identity.raceName = 'Lethari';
    malformed.player.flags['field-certified'] = 1;
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Arden Vale'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.player.identity.raceName, 'Lethari');
    assert.equal(unchanged.player.flags['field-certified'], 1);
});
