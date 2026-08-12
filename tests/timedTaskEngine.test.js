import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { listSemanticEvents } from '../js/text/systems/semanticEventEngine.js';
import {
    cancelTimedTask,
    getTimedTaskProgress,
    listTimedTasks,
    reconcileTimedTasks,
    startTimedTask,
    TIMED_TASK_STATUSES,
    validateTimedTaskState,
} from '../js/text/systems/timedTaskEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';


test('new games initialize an empty versioned timed-task registry', () => {
    const state = createInitialState();

    assert.equal(state.tasks.version, 1);
    assert.equal(state.tasks.nextSequence, 1);
    assert.deepEqual(state.tasks.records, []);
    assert.deepEqual(validateTimedTaskState(state.tasks), []);
});

test('timed task start records canonical world-time boundaries and structured event data', () => {
    const state = createInitialState();
    state.worldTime.totalSeconds = 90;

    const result = startTimedTask(state, {
        kind: 'work.gather',
        label: 'Gather firewood',
        durationSeconds: 120,
        data: { resourceId: 'firewood' },
    });

    assert.equal(result.ok, true);
    assert.equal(result.code, 'task.started');
    assert.equal(result.data.task.id, 'task-000001');
    assert.equal(result.data.task.startedAtWorldSeconds, 90);
    assert.equal(result.data.task.completesAtWorldSeconds, 210);
    assert.equal(result.data.task.status, TIMED_TASK_STATUSES.ACTIVE);
    const [event] = listSemanticEvents(state, { type: 'task.started' });
    assert.equal(event.data.taskId, 'task-000001');
    assert.equal(event.data.kind, 'work.gather');
});

test('task progress is derived from canonical world time and completes exactly at its deadline', () => {
    const state = createInitialState();
    const started = startTimedTask(state, { kind: 'work.test', label: 'Test work', durationSeconds: 60 });
    const taskId = started.data.task.id;

    advanceWorldTime(state, 30);
    assert.deepEqual(getTimedTaskProgress(state, taskId), {
        taskId,
        status: 'active',
        elapsedSeconds: 30,
        remainingSeconds: 30,
        progress: 0.5,
        due: false,
    });
    assert.deepEqual(reconcileTimedTasks(state), []);

    advanceWorldTime(state, 30);
    const beforeReconcile = getTimedTaskProgress(state, taskId);
    assert.equal(beforeReconcile.due, true);
    assert.equal(beforeReconcile.remainingSeconds, 0);

    const completed = reconcileTimedTasks(state);
    assert.equal(completed.length, 1);
    assert.equal(completed[0].task.status, 'completed');
    assert.equal(completed[0].task.completedAtWorldSeconds, 60);
    assert.equal(getTimedTaskProgress(state, taskId).progress, 1);
});

test('overshooting world time records scheduled completion time rather than observation time', () => {
    const state = createInitialState();
    const started = startTimedTask(state, { kind: 'work.test', durationSeconds: 10 });

    advanceWorldTime(state, 100);
    const [completed] = reconcileTimedTasks(state);

    assert.equal(state.worldTime.totalSeconds, 100);
    assert.equal(completed.task.completedAtWorldSeconds, 10);
    const [event] = listSemanticEvents(state, { type: 'task.completed' });
    assert.equal(event.worldTimeSeconds, 100);
    assert.equal(event.data.completedAtWorldSeconds, 10);
});

test('cancelled tasks stop progressing and never complete during reconciliation', () => {
    const state = createInitialState();
    const started = startTimedTask(state, { kind: 'work.test', durationSeconds: 100 });
    const taskId = started.data.task.id;

    advanceWorldTime(state, 25);
    const cancelled = cancelTimedTask(state, taskId);
    assert.equal(cancelled.code, 'task.cancelled');
    assert.equal(cancelled.data.task.cancelledAtWorldSeconds, 25);

    advanceWorldTime(state, 500);
    assert.deepEqual(reconcileTimedTasks(state), []);
    const progress = getTimedTaskProgress(state, taskId);
    assert.equal(progress.status, 'cancelled');
    assert.equal(progress.elapsedSeconds, 25);
    assert.equal(progress.remainingSeconds, 75);
});

test('multiple task channels can coexist without premature concurrency policy', () => {
    const state = createInitialState();
    startTimedTask(state, { kind: 'craft.smelt', channel: 'workshop', durationSeconds: 30 });
    startTimedTask(state, { kind: 'travel.walk', channel: 'character', durationSeconds: 60 });

    assert.equal(listTimedTasks(state, { status: 'active' }).length, 2);
    assert.equal(listTimedTasks(state, { channel: 'workshop' }).length, 1);

    advanceWorldTime(state, 30);
    const completed = reconcileTimedTasks(state);
    assert.equal(completed.length, 1);
    assert.equal(completed[0].task.kind, 'craft.smelt');
    assert.equal(listTimedTasks(state, { status: 'active' })[0].kind, 'travel.walk');
});

test('missing timed-task registry lazily initializes without changing save version', () => {
    const state = createInitialState();
    const versionBefore = state.version;
    delete state.tasks;

    const started = startTimedTask(state, { kind: 'work.test', durationSeconds: 5 });

    assert.equal(started.ok, true);
    assert.equal(state.tasks.version, 1);
    assert.equal(state.version, versionBefore);
});

test('invalid task definitions are rejected without allocating task IDs', () => {
    const state = createInitialState();

    assert.equal(startTimedTask(state, { kind: '', durationSeconds: 10 }).ok, false);
    assert.equal(startTimedTask(state, { kind: 'work.test', durationSeconds: 0 }).ok, false);
    assert.equal(startTimedTask(state, { kind: 'work.test', durationSeconds: 2.5 }).ok, false);
    assert.equal(state.tasks.nextSequence, 1);
    assert.equal(state.tasks.records.length, 0);
});
