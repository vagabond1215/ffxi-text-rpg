import { actionFailure, actionSuccess } from './actionResult.js';
import { reconcileCampaignRecoveries } from './campaignRecoveryEngine.js';
import { getBlockingHandsOnTask } from './characterActivityEngine.js';
import { reconcileGatheringWork } from './gatheringWorkEngine.js';
import { reconcileProductionWork } from './productionEngine.js';
import { reconcileCharacterResourceRecoveries } from './resourceRecoveryWorkAdapter.js';
import { advanceSimulationUntilInterrupt } from './simulationInterruptEngine.js';
import { getTimedTaskProgress, listTimedTasks } from './timedTaskEngine.js';
import { advanceTravel } from './travelEngine.js';
import { listWorkRecords, WORK_STATUSES } from './workTaskEngine.js';
import { ensureWorldTimeState } from './worldTimeEngine.js';

export const ACTIVITY_ADVANCE_VERSION = 2;

export function advanceActiveActivityToCompletion(state) {
    if (state?.activeBattle?.phase === 'active') {
        return failure('activity.combat-active', 'Finish or leave the current battle before advancing another activity.');
    }

    if (state?.travel?.active) return advanceActiveTravel(state);

    const work = listWorkRecords(state, { status: WORK_STATUSES.ACTIVE })
        .sort((a, b) => a.startedAtWorldSeconds - b.startedAtWorldSeconds || a.id.localeCompare(b.id))[0];
    if (work) return advanceActiveWork(state, work);

    const handsOnTask = getBlockingHandsOnTask(state);
    if (handsOnTask) return advanceStandaloneHandsOnTask(state, handsOnTask);
    return failure('activity.none-active', 'There is no active travel or hands-on work to finish.');
}

function advanceActiveWork(state, work) {
    const task = listTimedTasks(state, { status: 'active' }).find((entry) => entry.id === work.taskId);
    if (!task) return failure('activity.task-missing', `${work.label} has no active timed task.`);
    const advance = advanceTaskToBoundary(state, task);
    if (!advance.ok) return advance;

    const resolution = resolveWorkDomain(state, work);
    const resolved = resolution.find((entry) => entry?.ok) ?? resolution[0] ?? null;
    const completed = resolved?.ok && ['completed', 'awaitingStorage'].includes(resolved.outcome ?? resolved.data?.work?.status);
    const message = resolved?.display?.text ?? resolved?.message ?? advance.display?.text ?? `Advanced ${work.label}.`;

    return actionSuccess({
        action: 'activity.advance-to-completion',
        code: completed ? 'activity.completed' : 'activity.advanced',
        outcome: completed ? 'completed' : 'advanced',
        data: {
            kind: 'work',
            workId: work.id,
            taskId: task.id,
            secondsAdvanced: advance.data?.secondsAdvanced ?? 0,
            interrupt: advance.data?.interrupt ?? null,
            resolutionCode: resolved?.code ?? null,
        },
        display: { text: message },
    });
}

function advanceStandaloneHandsOnTask(state, task) {
    const advance = advanceTaskToBoundary(state, task);
    if (!advance.ok) return advance;

    if (task.kind === 'resource.recovery') {
        const completed = reconcileCharacterResourceRecoveries(state);
        const result = completed.find((entry) => entry.opportunityId === task.data?.opportunityId && entry.actionId === task.data?.actionId) ?? completed[0] ?? null;
        const recoveredCount = result?.items?.reduce((total, item) => total + (Number(item.quantity) || 1), 0) ?? 0;
        return actionSuccess({
            action: 'activity.advance-to-completion',
            code: 'activity.resource-recovery-completed',
            outcome: 'completed',
            data: {
                kind: task.kind,
                taskId: task.id,
                secondsAdvanced: advance.data?.secondsAdvanced ?? 0,
                opportunityId: result?.opportunityId ?? task.data?.opportunityId ?? null,
                actionId: result?.actionId ?? task.data?.actionId ?? null,
                recoveredItemCount: recoveredCount,
            },
            display: { text: recoveredCount > 0 ? `Recovery work completed; ${recoveredCount} material unit${recoveredCount === 1 ? '' : 's'} recovered.` : 'Recovery work completed; no usable material was recovered.' },
        });
    }

    if (task.kind.startsWith('recovery.')) {
        const completed = reconcileCampaignRecoveries(state);
        const result = completed.find((entry) => entry.taskId === task.id) ?? completed[0] ?? null;
        return actionSuccess({
            action: 'activity.advance-to-completion',
            code: 'activity.recovery-completed',
            outcome: 'completed',
            data: {
                kind: task.kind,
                taskId: task.id,
                secondsAdvanced: advance.data?.secondsAdvanced ?? 0,
                fromPlaceId: result?.fromPlaceId ?? null,
                toPlaceId: result?.toPlaceId ?? state.currentPlaceId ?? null,
            },
            display: { text: task.kind === 'recovery.defeat'
                ? `Recovery completed. You are back in ${state.location ?? state.currentPlaceId} and able to continue, but the lost field time remains spent.`
                : 'Recovery completed. The fictional time spent resting remains part of the campaign.' },
        });
    }

    return failure('activity.unsupported-hands-on-task', `${task.label} cannot yet be completed through the activity action.`);
}

function advanceTaskToBoundary(state, task) {
    const progress = getTimedTaskProgress(state, task.id);
    const remainingSeconds = Math.max(0, Number(progress?.remainingSeconds) || 0);
    return advanceSimulationUntilInterrupt(state, remainingSeconds, {
        worldTimeOptions: { source: 'activityAdvanceEngine' },
    });
}

function advanceActiveTravel(state) {
    const now = ensureWorldTimeState(state).totalSeconds;
    const remainingSeconds = state.travel.arriveAtWorldSeconds === undefined
        ? Math.max(0, Number(state.travel.remainingSeconds) || 0)
        : Math.max(0, state.travel.arriveAtWorldSeconds - now);
    const result = advanceTravel(state, remainingSeconds);
    if (!result?.ok && result?.completed !== true) {
        return failure('activity.travel-advance-failed', result?.reason ?? result?.message ?? 'Travel could not advance.');
    }
    return actionSuccess({
        action: 'activity.advance-to-completion',
        code: result.completed ? 'activity.travel-completed' : 'activity.travel-advanced',
        outcome: result.completed ? 'completed' : 'advanced',
        data: {
            kind: 'travel',
            secondsAdvanced: remainingSeconds,
            completed: Boolean(result.completed),
            destinationId: state.currentPlaceId ?? null,
        },
        display: { text: result.message ?? (result.completed ? 'Travel completed.' : 'Travel advanced.') },
    });
}

function resolveWorkDomain(state, work) {
    if (work.kind === 'gathering' || work.data?.sourceId) return reconcileGatheringWork(state);
    if (work.data?.processId) return reconcileProductionWork(state);
    return [];
}

function failure(code, text) {
    return actionFailure({
        action: 'activity.advance-to-completion',
        code,
        outcome: 'blocked',
        display: { text },
    });
}
