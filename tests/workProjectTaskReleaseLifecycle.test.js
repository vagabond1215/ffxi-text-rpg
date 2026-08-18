import test from 'node:test';
import assert from 'node:assert/strict';

import { createTestState } from './helpers/createTestState.js';
import {
    cancelProject,
    createProject,
    findProject,
    PROJECT_STATUSES,
    reconcileProjects,
    startProjectLabor,
} from '../js/text/systems/projectEngine.js';
import { listSemanticEvents } from '../js/text/systems/semanticEventEngine.js';
import { findTimedTask, TIMED_TASK_STATUSES } from '../js/text/systems/timedTaskEngine.js';
import {
    cancelWorkTask,
    findWorkRecord,
    markWorkAwaitingStorage,
    markWorkCompleted,
    markWorkFailed,
    reconcileWorkTasks,
    startWorkTask,
    WORK_STATUSES,
} from '../js/text/systems/workTaskEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

function startDueWork(state, kind) {
    const started = startWorkTask(state, {
        kind,
        label: kind,
        channel: `work:${kind}`,
        durationSeconds: 10,
    });
    assert.equal(started.ok, true);
    advanceWorldTime(state, 10, { source: `test.${kind}` });
    const [due] = reconcileWorkTasks(state).filter(({ record }) => record.id === started.data.work.id);
    assert.ok(due);
    assert.equal(due.task.status, TIMED_TASK_STATUSES.COMPLETED);
    return { workId: started.data.work.id, taskId: started.data.task.id };
}

test('work owner releases completed failed and awaiting-storage terminal tasks after durable transition', () => {
    const state = createTestState();

    const completed = startDueWork(state, 'release-completed');
    const completedRecord = markWorkCompleted(state, completed.workId, { result: 'done' });
    assert.equal(completedRecord.status, WORK_STATUSES.COMPLETED);
    assert.equal(completedRecord.taskId, completed.taskId, 'work record keeps historical correlation id');
    assert.equal(completedRecord.completedAtWorldSeconds, 10);
    assert.equal(findTimedTask(state, completed.taskId), null);

    const failed = startDueWork(state, 'release-failed');
    const failedRecord = markWorkFailed(state, failed.workId, 'test.failed', { result: 'failed' });
    assert.equal(failedRecord.status, WORK_STATUSES.FAILED);
    assert.equal(failedRecord.taskId, failed.taskId);
    assert.equal(failedRecord.failureCode, 'test.failed');
    assert.equal(findTimedTask(state, failed.taskId), null);

    const pending = startDueWork(state, 'release-awaiting-storage');
    const pendingRecord = markWorkAwaitingStorage(state, pending.workId, { pendingOutputs: [{ itemId: 'test-output' }] });
    assert.equal(pendingRecord.status, WORK_STATUSES.AWAITING_STORAGE);
    assert.equal(pendingRecord.taskId, pending.taskId);
    assert.deepEqual(pendingRecord.data.pendingOutputs, [{ itemId: 'test-output' }]);
    assert.equal(findTimedTask(state, pending.taskId), null);

    assert.equal(listSemanticEvents(state, { type: 'work.completed' }).length, 1);
    assert.equal(listSemanticEvents(state, { type: 'work.failed' }).length, 1);
    assert.equal(listSemanticEvents(state, { type: 'work.awaiting-storage' }).length, 1);
});

test('cancelled work releases its cancelled task after the work cancellation event is durable', () => {
    const state = createTestState();
    const started = startWorkTask(state, {
        kind: 'release-cancelled',
        label: 'Cancelled work',
        durationSeconds: 60,
    });
    assert.equal(started.ok, true);
    const taskId = started.data.task.id;

    advanceWorldTime(state, 15, { source: 'test.work-cancel' });
    const cancelled = cancelWorkTask(state, started.data.work.id);
    assert.equal(cancelled.ok, true);
    assert.equal(cancelled.data.work.status, WORK_STATUSES.CANCELLED);
    assert.equal(cancelled.data.work.taskId, taskId);
    assert.equal(cancelled.data.work.cancelledAtWorldSeconds, 15);
    assert.equal(findTimedTask(state, taskId), null);
    assert.equal(listSemanticEvents(state, { type: 'task.cancelled' }).length, 1);
    assert.equal(listSemanticEvents(state, { type: 'work.cancelled' }).length, 1);
});

test('project completion and cancellation retain correlation ids while releasing terminal task records', () => {
    const state = createTestState();
    const completedProject = createProject(state, {
        kind: 'release.project-completed',
        label: 'Completed project',
        laborSeconds: 30,
    });
    assert.equal(completedProject.ok, true);
    const completedStart = startProjectLabor(state, completedProject.data.project.id);
    assert.equal(completedStart.ok, true);
    const completedTaskId = completedStart.data.task.id;

    advanceWorldTime(state, 30, { source: 'test.project-complete' });
    const completed = reconcileProjects(state);
    assert.equal(completed.length, 1);
    assert.equal(completed[0].project.status, PROJECT_STATUSES.COMPLETED);
    assert.equal(completed[0].project.taskId, completedTaskId);
    assert.equal(completed[0].project.completedAtWorldSeconds, 30);
    assert.equal(findTimedTask(state, completedTaskId), null);
    assert.equal(findProject(state, completedProject.data.project.id).taskId, completedTaskId);

    const cancelledProject = createProject(state, {
        kind: 'release.project-cancelled',
        label: 'Cancelled project',
        laborSeconds: 90,
    });
    assert.equal(cancelledProject.ok, true);
    const cancelledStart = startProjectLabor(state, cancelledProject.data.project.id);
    assert.equal(cancelledStart.ok, true);
    const cancelledTaskId = cancelledStart.data.task.id;
    advanceWorldTime(state, 20, { source: 'test.project-cancel' });

    const cancelled = cancelProject(state, cancelledProject.data.project.id);
    assert.equal(cancelled.ok, true);
    assert.equal(cancelled.data.project.status, PROJECT_STATUSES.CANCELLED);
    assert.equal(cancelled.data.project.taskId, cancelledTaskId);
    assert.equal(findTimedTask(state, cancelledTaskId), null);
    assert.equal(listSemanticEvents(state, { type: 'project.completed' }).length, 1);
    assert.equal(listSemanticEvents(state, { type: 'project.cancelled' }).length, 1);
});


test('re-marking an already completed work record cleans up an older retained terminal task without replaying completion', () => {
    const state = createTestState();
    const started = startWorkTask(state, {
        kind: 'release-retained',
        label: 'Retained terminal task',
        durationSeconds: 10,
    });
    advanceWorldTime(state, 10, { source: 'test.retained' });
    reconcileWorkTasks(state);
    const record = findWorkRecord(state, started.data.work.id);
    record.status = WORK_STATUSES.COMPLETED;
    record.completedAtWorldSeconds = 10;

    assert.ok(findTimedTask(state, started.data.task.id));
    const completionEventsBefore = listSemanticEvents(state, { type: 'work.completed' }).length;
    const snapshot = markWorkCompleted(state, record.id);
    assert.equal(snapshot.status, WORK_STATUSES.COMPLETED);
    assert.equal(findTimedTask(state, started.data.task.id), null);
    assert.equal(listSemanticEvents(state, { type: 'work.completed' }).length, completionEventsBefore);
});
