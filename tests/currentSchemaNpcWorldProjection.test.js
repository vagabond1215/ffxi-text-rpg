import test from 'node:test';
import assert from 'node:assert/strict';

import { createSeedNpcs } from '../js/text/data/seedEntities.js';
import { createInitialState } from '../js/text/gameState.js';
import {
    createAccountWithPassword,
    decodePayload,
    encodePayload,
    loadCharacter,
    saveGame,
} from '../js/text/save.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { refreshNpcWorldProjection } from '../js/text/systems/npcWorldProjection.js';
import { recruitCompanion } from '../js/text/systems/partyEngine.js';
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

test('Game State 14 raw payload does not require derived NPC world projection', () => {
    const state = createInitialState();
    assert.equal(VERSION.gameState, 14);
    delete state.npcs;
    delete state.enemies;
    delete state.log;
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('NPC world projection rebuilds canonical seeds plus persisted companion participation', () => {
    const state = createInitialState();
    const recruited = recruitCompanion(state, 'companion-mara-venn', { ignoreRequirements: true });
    assert.equal(recruited.ok, true);
    const companion = state.party.companions['companion-mara-venn'];
    assert.ok(companion);

    state.npcs = [{ id: 'forged-runtime-npc' }];
    const rebuilt = refreshNpcWorldProjection(state);
    assert.equal(rebuilt.length, createSeedNpcs().length);
    assert.equal(rebuilt.some((npc) => npc.id === 'forged-runtime-npc'), false);

    const mara = rebuilt.find((npc) => npc.id === 'npc-elderwood-waywarden');
    assert.ok(mara);
    assert.equal(mara.identity.name, companion.identity.name);
    assert.equal(mara.identity.title, companion.identity.title);
    assert.equal(mara.identity.locationId, companion.locationId);
    assert.equal(mara.flags.companionId, companion.id);
    assert.equal(mara.flags.companionActive, true);
});

test('save omits NPC projection and load rebuilds it from seed and party authority', () => {
    installStorage('NPC Projection Account');
    const state = createInitialState();
    state.player.identity.name = 'Projectionkeeper';
    assert.equal(recruitCompanion(state, 'companion-mara-venn', { ignoreRequirements: true }).ok, true);
    const expectedCompanion = structuredClone(state.party.companions['companion-mara-venn']);

    assert.equal(saveGame(state), true);
    const stored = storedCharacterState().state;
    assert.equal(Object.hasOwn(stored, 'npcs'), false);
    assert.equal(Object.hasOwn(stored, 'enemies'), false);
    assert.equal(Object.hasOwn(stored, 'log'), false);
    assert.ok(stored.party.companions['companion-mara-venn']);

    const loaded = loadCharacter('Projectionkeeper');
    assert.ok(loaded);
    assert.equal(loaded.npcs.length, createSeedNpcs().length);
    assert.deepEqual(loaded.party.companions['companion-mara-venn'], expectedCompanion);

    const mara = loaded.npcs.find((npc) => npc.id === 'npc-elderwood-waywarden');
    assert.ok(mara);
    assert.equal(mara.identity.locationId, expectedCompanion.locationId);
    assert.equal(mara.flags.companionId, expectedCompanion.id);
    assert.equal(mara.flags.companionActive, true);
});

test('load ignores injected NPC projection and rebuilds from canonical authority', () => {
    installStorage('Injected NPC Projection Account');
    const state = createInitialState();
    state.player.identity.name = 'Projection Rebuilder';
    assert.equal(saveGame(state), true);

    const { registry, record, state: encodedState } = storedCharacterState();
    encodedState.npcs = [{ id: 'npc-forged', identity: { name: 'Forged', locationId: 'nowhere' } }];
    record.encodedState = encodePayload(encodedState);
    globalThis.localStorage.setItem('hearthHorizonAccounts', encodePayload(registry));

    const loaded = loadCharacter('Projection Rebuilder');
    assert.ok(loaded);
    assert.equal(loaded.npcs.some((npc) => npc.id === 'npc-forged'), false);
    assert.deepEqual(
        loaded.npcs.map((npc) => npc.id),
        createSeedNpcs().map((npc) => npc.id),
    );
});
