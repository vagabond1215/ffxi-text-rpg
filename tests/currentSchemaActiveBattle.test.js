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
import { performPlayerAttack, startEncounter } from '../js/text/systems/combatActionEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() { globalThis.localStorage = new MemoryStorage(); }

function startBattle(state) {
    const result = startEncounter(state, 'Brush Hare', { rng: () => 0 });
    assert.equal(result.ok, true);
    assert.equal(state.activeBattle.phase, 'active');
    return state.activeBattle;
}

test('current schema accepts a non-empty active battle with canonical combat contract and timeline', () => {
    const state = createInitialState();
    const battle = startBattle(state);
    assert.equal(battle.contract.version, 2);
    assert.equal(Object.keys(battle.contract.timeline.readyAtByActorId).length, battle.combatants.length);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects malformed combatants phase and timeline ownership', () => {
    const duplicate = createInitialState();
    startBattle(duplicate);
    duplicate.activeBattle.combatants[1].id = duplicate.activeBattle.combatants[0].id;
    assert.ok(validateCurrentGameStateStructure(duplicate).some((issue) => issue.includes('duplicates')));

    const phase = createInitialState();
    startBattle(phase);
    phase.activeBattle.combatants.find((entry) => entry.type === 'enemy').battle.defeated = true;
    phase.activeBattle.combatants.find((entry) => entry.type === 'enemy').resources.hp = 0;
    assert.ok(validateCurrentGameStateStructure(phase).some((issue) => issue.includes('phase active requires')));

    const timeline = createInitialState();
    startBattle(timeline);
    delete timeline.activeBattle.contract.timeline.readyAtByActorId[timeline.activeBattle.combatants[0].id];
    timeline.activeBattle.contract.timeline.readyAtByActorId['ghost-actor'] = timeline.worldTime.totalSeconds;
    const timelineIssues = validateCurrentGameStateStructure(timeline);
    assert.ok(timelineIssues.some((issue) => issue.includes('unknown actor ghost-actor')));
    assert.ok(timelineIssues.some((issue) => issue.includes('is missing actor')));
});

test('current schema rejects corrupt combat action identity and references', () => {
    const state = createInitialState();
    startBattle(state);
    performPlayerAttack(state);
    const action = state.activeBattle.contract.actions[0];
    assert.ok(action);

    state.activeBattle.contract.actionSequence = 0;
    state.activeBattle.contract.lastActionId = 'combat-action-999999';
    action.targetId = 'missing-target';
    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('actionSequence must be at least')));
    assert.ok(issues.some((issue) => issue.includes('lastActionId must match')));
    assert.ok(issues.some((issue) => issue.includes('targetId must reference a combatant')));
});

test('active battle survives real current save and load and can continue', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Battle Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = createInitialState();
    state.player.identity.name = 'Battlesaver';
    startBattle(state);
    const expectedBattle = JSON.parse(JSON.stringify(state.activeBattle));

    assert.equal(saveGame(state), true);
    const loaded = loadCharacter('Battlesaver');
    assert.ok(loaded);
    assert.deepEqual(loaded.activeBattle, expectedBattle);
    assert.equal(loaded.activeBattle.rng, undefined);

    const before = loaded.activeBattle.contract.actionSequence;
    const result = performPlayerAttack(loaded);
    assert.match(result, /Battle:/);
    assert.ok(loaded.activeBattle.contract.actionSequence > before);
    assert.deepEqual(validateCurrentGameStateStructure(loaded), []);
});

test('load rejects malformed persisted active battle without ensureCombatContract repairing it', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Strict Battle Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = createInitialState();
    state.player.identity.name = 'Badbattle';
    startBattle(state);
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    malformed.activeBattle.contract.version = 99;
    delete malformed.activeBattle.contract.timeline;
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Badbattle'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.activeBattle.contract.version, 99);
    assert.equal(Object.hasOwn(unchanged.activeBattle.contract, 'timeline'), false);
});
