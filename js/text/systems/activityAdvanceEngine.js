import { actionFailure, actionSuccess } from './actionResult.js';
import { reconcileGatheringWork } from './gatheringWorkEngine.js';
import { reconcileProductionWork } from './productionEngine.js';
import { advanceSimulationUntilInterrupt } from './simulationInterruptEngine.js';
import { getTimedTaskProgress, listTimedTasks } from './timedTaskEngine.js';
import { advanceTravel } from './travelEngine.js';
import { listWorkRecords, WORK_STATUSES } from './workTaskEngine.js';
import { ensureWorldTimeState } from './worldTimeEngine.js';

export const ACTIVITY_ADVANCE_VERSION = 1;

export function advanceActiveActivityToCompletion(state) {
    if (state?.activeBattle?.phase === 'active') {
        return failure('activity.combat-active', 'Finish or leave the current battle before advancing another activity.');
    }

    if (state?.travel?.active) return advanceActiveTravel(state);

    const work = listWorkRecords(state, { status: WORK_STATUSES.ACTIVE })
        .sort((a, b) => a.startedAtWorldSeconds - b.startedAtWorldSeconds || a.id.localeCompare(b.id))[0];
    if (!work) return failure('activity.none-active', 'There is no active travel or hands-on work to finish.');

    const task = listTimedTasks(state, { status: 'active' }).find((entry) => entry.id === work.taskId);
    if (!task) return failure('activity.task-missing', `${work.label} has no active timed task.`);
    const progress = getTimedTaskProgress(state, task.id);
    const remainingSeconds = Math.max(0, Number(progress?.remainingSeconds) || 0);
    const advance = advanceSimulationUntilInterrupt(state, remainingSeconds, {
        worldTimeOptions: { source: 'activityAdvanceEngine' },
    });
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
