import test from 'node:test';
import assert from 'node:assert/strict';

import { createEnemy } from '../js/text/entities/entityFactory.js';
import { createInitialState } from '../js/text/gameState.js';
import { createAccountWithPassword, loadActiveCharacter, saveGame } from '../js/text/save.js';
import { activateAbility, reconcileAbilityActivation } from '../js/text/systems/abilityEngine.js';
import { grantCapability } from '../js/text/systems/capabilityEngine.js';
import {
    createDefeatedEnemyResourceOpportunity,
    reconcileResourceRecoveries,
    startResourceRecovery,
} from '../js/text/systems/resourceOpportunityEngine.js';
import { findTimedTask, listTimedTasks } from '../js/text/systems/timedTaskEngine.js';
import {
    findWorkRecord,
    markWorkCompleted,
    reconcileWorkTasks,
    startWorkTask,
} from '../js/text/systems/workTaskEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function createPersistedState(accountName, characterName) {
    globalThis.localStorage = new MemoryStorage();
    assert.equal(createAccountWithPassword(accountName, 'pwd', { persistentLogin: true }).ok, true);
    const state = createInitialState();
    state.player.identity.name = characterName;
    return state;
}

function saveAndReload(state) {
    assert.equal(saveGame(state), true);
    const loaded = loadActiveCharacter();
    assert.ok(loaded);
    return loaded;
}

test('active work survives save/load with the same task and releases after exactly-once completion', () => {
    let state = createPersistedState('Active Work Matrix', 'Workmatrix');
    const started = startWorkTask(state, {
        kind: 'persistence-matrix',
        label: 'Persistence matrix work',
        channel: 'work:persistence-matrix',
        durationSeconds: 30,
    });
    assert.equal(started.ok, true);
    const workId = started.data.work.id;
    const taskId = started.data.task.id;

    state = saveAndReload(state);
    assert.equal(findWorkRecord(state, workId)?.taskId, taskId);
    assert.equal(findTimedTask(state, taskId)?.status, 'active');

    advanceWorldTime(state, 30, { source: 'test.active-work-matrix' });
    const [due] = reconcileWorkTasks(state).filter(({ record }) => record.id === workId);
    assert.ok(due);
    const completed = markWorkCompleted(state, workId, { proof: 'save-load' });
    assert.equal(completed.status, 'completed');
    assert.equal(completed.taskId, taskId);
    assert.equal(findTimedTask(state, taskId), null);
    assert.equal(listTimedTasks(state).length, 0);

    state = saveAndReload(state);
    assert.equal(findWorkRecord(state, workId)?.status, 'completed');
    assert.equal(listTimedTasks(state).length, 0);
});

test('timed ability survives save/load with the same activation task and resolves once', () => {
    let state = createPersistedState('Active Ability Matrix', 'Abilitymatrix');
    grantCapability(state.player, 'practical-waymark-reading');
    const started = activateAbility(state, 'Waymark Reading');
    assert.equal(started.ok, true);
    assert.equal(started.code, 'ability.started');
    const taskId = started.data.activation.taskId;

    state = saveAndReload(state);
    assert.equal(state.abilities.active?.taskId, taskId);
    assert.equal(findTimedTask(state, taskId)?.status, 'active');

    advanceWorldTime(state, 3, { source: 'test.active-ability-matrix' });
    const resolved = reconcileAbilityActivation(state);
    assert.equal(resolved.ok, true);
    assert.equal(resolved.code, 'ability.resolved');
    assert.equal(resolved.data.activation.taskId, taskId);
    assert.equal(state.abilities.active, null);
    assert.equal(findTimedTask(state, taskId), null);
    assert.equal(listTimedTasks(state).length, 0);

    state = saveAndReload(state);
    assert.equal(state.abilities.active, null);
    assert.equal(listTimedTasks(state).length, 0);
    assert.equal(reconcileAbilityActivation(state), null);
});

test('active resource recovery preserves its task and persisted outcome through save/load then releases once', () => {
    let state = createPersistedState('Active Resource Matrix', 'Resourcematrix');
    const enemy = createEnemy({
        id: 'enemy-active-matrix-hare',
        name: 'Active Matrix Hare',
        family: 'hare',
        ecosystem: 'beast',
        zoneId: 'west-elderwood',
        level: 1,
        lootTableId: 'starterBeast',
    });
    const opportunity = createDefeatedEnemyResourceOpportunity(state, enemy, { battleId: 'active-matrix-battle' });
    assert.equal(opportunity.ok, true);
    const opportunityId = opportunity.data.opportunity.id;
    const started = startResourceRecovery(state, opportunityId, 'skin', {
        toolTags: ['cutting'],
        rng: () => 0,
    });
    assert.equal(started.ok, true);
    const taskId = started.data.task.id;
    const durationSeconds = started.data.task.durationSeconds;
    const startedAction = started.data.opportunity.actions.find((action) => action.id === 'skin');
    const persistedRolls = structuredClone(startedAction.outcomeRolls);

    state = saveAndReload(state);
    const loadedOpportunity = state.resourceOpportunities.records.find((record) => record.id === opportunityId);
    const loadedAction = loadedOpportunity.actions.find((action) => action.id === 'skin');
    assert.equal(loadedAction.taskId, taskId);
    assert.deepEqual(loadedAction.outcomeRolls, persistedRolls);
    assert.equal(findTimedTask(state, taskId)?.status, 'active');

    advanceWorldTime(state, durationSeconds, { source: 'test.active-resource-matrix' });
    const completed = reconcileResourceRecoveries(state, { rng: () => 1 });
    assert.equal(completed.length, 1);
    assert.equal(completed[0].opportunityId, opportunityId);
    assert.equal(completed[0].actionId, 'skin');
    const completedOpportunity = state.resourceOpportunities.records.find((record) => record.id === opportunityId);
    const completedAction = completedOpportunity.actions.find((action) => action.id === 'skin');
    assert.equal(completedAction.taskId, taskId, 'resource action retains historical correlation id');
    assert.deepEqual(completedAction.outcomeRolls, persistedRolls, 'resolution uses the persisted outcome rolls');
    assert.equal(findTimedTask(state, taskId), null);
    assert.equal(listTimedTasks(state).length, 0);

    state = saveAndReload(state);
    assert.equal(listTimedTasks(state).length, 0);
    assert.deepEqual(reconcileResourceRecoveries(state, { rng: () => 1 }), []);
});
