import { listTimedTasks, TIMED_TASK_STATUSES } from './timedTaskEngine.js';

export const HANDS_ON_TASK_KINDS = Object.freeze([
    'resource.recovery',
    'recovery.field',
    'recovery.settlement',
    'recovery.defeat',
    'project.labor',
]);
export const HANDS_ON_TASK_CHANNELS = Object.freeze(['work:character', 'recovery:character']);

export function getBlockingHandsOnTask(state) {
    if (!state?.tasks) return null;
    return listTimedTasks(state, { status: TIMED_TASK_STATUSES.ACTIVE })
        .find((task) => HANDS_ON_TASK_CHANNELS.includes(task.channel) || HANDS_ON_TASK_KINDS.includes(task.kind)) ?? null;
}

export function isCharacterHandsOnBusy(state) {
    return Boolean(getBlockingHandsOnTask(state));
}

export function describeBlockingHandsOnTask(state) {
    const task = getBlockingHandsOnTask(state);
    return task ? `${task.label} is still in progress.` : '';
}
