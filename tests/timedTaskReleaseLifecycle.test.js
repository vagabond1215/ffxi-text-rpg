import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { createAccountWithPassword, loadActiveCharacter, saveGame } from '../js/text/save.js';
import { reconcileCampaignRecoveries, startCampaignRecovery } from '../js/text/systems/campaignRecoveryEngine.js';
import { listSemanticEvents } from '../js/text/systems/semanticEventEngine.js';
import {
    findTimedTask,
    listTimedTasks,
    reconcileTimedTasks,
    releaseTimedTask,
    startTimedTask,
    TIMED_TASK_STATUSES,
} from '../js/text/systems/timedTaskEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() {
    globalThis.localStorage = new MemoryStorage();
}

test('terminal task release protects active ownership and never reuses task ids', () => {
    const state = createInitialState();
    const started = startTimedTask(state, {
        kind: 'test.release',
        label: 'Release lifecycle',
        durationSeconds: 60,
    });
    assert.equal(started.ok, true);
    const firstId = started.data.task.id;

    const activeRelease = releaseTimedTask(state, firstId);
    assert.equal(activeRelease.ok, false);
    assert.equal(activeRelease.code, 'task.release-active');
    assert.equal(findTimedTask(state, firstId)?.status, TIMED_TASK_STATUSES.ACTIVE);

    advanceWorldTime(state, 60, { source: 'test.task-release' });
    assert.equal(reconcileTimedTasks(state).length, 1);
    assert.equal(findTimedTask(state, firstId)?.status, TIMED_TASK_STATUSES.COMPLETED);

    const released = releaseTimedTask(state, firstId);
    assert.equal(released.ok, true);
    assert.equal(released.code, 'task.released');
    assert.equal(findTimedTask(state, firstId), null);
    assert.equal(listTimedTasks(state).length, 0);

    const second = startTimedTask(state, {
        kind: 'test.release-next',
        label: 'Next release lifecycle',
        durationSeconds: 60,
    });
    assert.equal(second.ok, true);
    assert.notEqual(second.data.task.id, firstId);
    assert.equal(second.data.task.id, 'task-000002');
});

test('campaign recovery retains a terminal task through save/load until owner reconciliation then releases it exactly once', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Task Release Runner', 'pwd', { persistentLogin: true }).ok, true);

    let state = createInitialState();
    state.player.identity.name = 'Task Release Runner';
    const maxHp = state.player.combat.resources.maxHp;
    state.player.resources.hp = Math.max(1, maxHp - 10);
    const hpBefore = state.player.resources.hp;

    const started = startCampaignRecovery(state);
    assert.equal(started.ok, true, started.display?.text);
    const taskId = started.data.task.id;
    const durationSeconds = started.data.task.durationSeconds;

    advanceWorldTime(state, durationSeconds, { source: 'test.recovery-release' });
    assert.equal(reconcileTimedTasks(state).length, 1);
    assert.equal(findTimedTask(state, taskId)?.status, TIMED_TASK_STATUSES.COMPLETED);
    assert.equal(state.player.resources.hp, hpBefore, 'domain consequence must wait for owner reconciliation');

    assert.equal(saveGame(state), true);
    state = loadActiveCharacter();
    assert.ok(state);
    assert.equal(findTimedTask(state, taskId)?.status, TIMED_TASK_STATUSES.COMPLETED, 'unreconciled terminal task must survive save/load');

    const resolved = reconcileCampaignRecoveries(state);
    assert.equal(resolved.length, 1);
    assert.equal(resolved[0].taskId, taskId);
    assert.ok(state.player.resources.hp > hpBefore);
    assert.equal(findTimedTask(state, taskId), null, 'owner releases the task only after durable consequence reconciliation');
    assert.equal(listTimedTasks(state).length, 0);
    assert.equal(listSemanticEvents(state, { type: 'task.completed' }).length, 1);
    assert.equal(listSemanticEvents(state, { type: 'recovery.completed' }).length, 1);

    const hpAfter = state.player.resources.hp;
    assert.equal(saveGame(state), true);
    state = loadActiveCharacter();
    assert.ok(state);
    assert.equal(listTimedTasks(state).length, 0);
    assert.deepEqual(reconcileCampaignRecoveries(state), []);
    assert.equal(state.player.resources.hp, hpAfter, 'released recovery cannot resolve twice after save/load');
    assert.equal(listSemanticEvents(state, { type: 'recovery.completed' }).length, 1);
});
