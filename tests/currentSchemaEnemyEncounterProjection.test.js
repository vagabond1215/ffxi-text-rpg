import test from 'node:test';
import assert from 'node:assert/strict';

import { createSeedEnemies } from '../js/text/data/seedEntities.js';
import { createInitialState } from '../js/text/gameState.js';
import {
    createAccountWithPassword,
    decodePayload,
    encodePayload,
    loadCharacter,
    saveGame,
} from '../js/text/save.js';
import { startEncounter } from '../js/text/systems/combatActionEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { refreshEnemyEncounterProjection } from '../js/text/systems/enemyEncounterProjection.js';
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

test('Game State 12 raw payload does not require derived enemy encounter projection', () => {
    const state = createInitialState();
    assert.equal(VERSION.gameState, 12);
    delete state.enemies;
    delete state.log;
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('enemy encounter projection rebuilds fresh canonical seed entities', () => {
    const state = createInitialState();
    const canonicalIds = createSeedEnemies().map((enemy) => enemy.id);
    state.enemies = [{ id: 'enemy-forged' }];

    const rebuilt = refreshEnemyEncounterProjection(state);
    assert.deepEqual(rebuilt.map((enemy) => enemy.id), canonicalIds);
    assert.equal(rebuilt.some((enemy) => enemy.id === 'enemy-forged'), false);

    const hare = rebuilt.find((enemy) => enemy.id === 'enemy-brush-hare');
    assert.ok(hare);
    const fullHp = hare.resources.hp;
    hare.resources.hp = 0;
    const refreshed = refreshEnemyEncounterProjection(state).find((enemy) => enemy.id === 'enemy-brush-hare');
    assert.ok(refreshed);
    assert.equal(refreshed.resources.hp, fullHp);
});

test('save omits enemy projection and load rebuilds it before combat lookup', () => {
    installStorage('Enemy Projection Account');
    const state = createInitialState();
    state.player.identity.name = 'Encounterkeeper';

    assert.equal(saveGame(state), true);
    const stored = storedCharacterState().state;
    assert.equal(Object.hasOwn(stored, 'enemies'), false);

    const loaded = loadCharacter('Encounterkeeper');
    assert.ok(loaded);
    assert.deepEqual(
        loaded.enemies.map((enemy) => enemy.id),
        createSeedEnemies().map((enemy) => enemy.id),
    );

    const started = startEncounter(loaded, 'enemy-brush-hare', { rng: () => 0.5 });
    assert.equal(started.ok, true);
    assert.equal(loaded.activeBattle.sourceEnemyId, 'enemy-brush-hare');
    assert.ok(loaded.activeBattle.combatants.some((combatant) => combatant.id.startsWith('enemy-brush-hare-encounter-')));
});

test('load ignores injected enemy projection and rebuilds canonical definitions', () => {
    installStorage('Injected Enemy Projection Account');
    const state = createInitialState();
    state.player.identity.name = 'Encounter Rebuilder';
    assert.equal(saveGame(state), true);

    const { registry, record, state: encodedState } = storedCharacterState();
    encodedState.enemies = [{
        id: 'enemy-forged',
        type: 'enemy',
        identity: { name: 'Forged', family: 'forged', ecosystem: 'forged', zoneId: 'nowhere' },
        level: 99,
        resources: { hp: 1, mp: 0, tp: 0 },
    }];
    record.encodedState = encodePayload(encodedState);
    globalThis.localStorage.setItem('hearthHorizonAccounts', encodePayload(registry));

    const loaded = loadCharacter('Encounter Rebuilder');
    assert.ok(loaded);
    assert.equal(loaded.enemies.some((enemy) => enemy.id === 'enemy-forged'), false);
    assert.deepEqual(
        loaded.enemies.map((enemy) => enemy.id),
        createSeedEnemies().map((enemy) => enemy.id),
    );
});
