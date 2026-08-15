import { getBlockingHandsOnTask } from './characterActivityEngine.js';
import { collectAvailableToolTags } from './equipmentToolEngine.js';
import {
    RESOURCE_RECOVERY_ACTION_DEFINITIONS,
    reconcileResourceRecoveries,
    startResourceRecovery,
} from './resourceOpportunityEngine.js';
import {
    gainWorkProficiency,
    getWorkProficiencyMap,
} from './workProficiencyEngine.js';

export const RESOURCE_RECOVERY_WORK_ADAPTER_VERSION = 1;

export function startCharacterResourceRecovery(state, opportunityId, actionId, options = {}) {
    if (state.activeBattle?.phase === 'active') {
        return blocked('resource.in-combat', 'Resource recovery cannot start during combat.');
    }
    if (state.travel?.active) {
        return blocked('resource.travel-active', 'Resource recovery cannot start during active travel.');
    }
    const blockingTask = getBlockingHandsOnTask(state);
    if (blockingTask) return blocked('resource.work-active', `${blockingTask.label} is already in progress.`);

    return startResourceRecovery(state, opportunityId, actionId, {
        ...options,
        toolTags: collectAvailableToolTags(state.player, options.toolTags),
        proficiencies: {
            ...getWorkProficiencyMap(state.player),
            ...(options.proficiencies ?? {}),
        },
    });
}

export function reconcileCharacterResourceRecoveries(state, options = {}) {
    const completed = reconcileResourceRecoveries(state, options);
    for (const result of completed) {
        const definition = RESOURCE_RECOVERY_ACTION_DEFINITIONS[result.actionId];
        if (!definition?.proficiencyId) continue;
        gainWorkProficiency(state, definition.proficiencyId, 1, {
            sourceId: `${result.opportunityId}:${result.actionId}`,
        });
    }
    return completed;
}

function blocked(code, text) {
    return {
        ok: false,
        action: 'resource.recovery-start',
        code,
        outcome: 'blocked',
        data: {},
        display: { text },
        reason: text,
        message: text,
    };
}
