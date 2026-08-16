import { getCanonicalResourceItem } from '../data/resourceItemRegistry.js';
import { getBlockingHandsOnTask } from './characterActivityEngine.js';
import { collectAvailableToolTags } from './equipmentToolEngine.js';
import {
    findResourceOpportunity,
    RESOURCE_OPPORTUNITY_STATUSES,
    RESOURCE_RECOVERY_ACTION_DEFINITIONS,
    RESOURCE_RECOVERY_STATUSES,
    reconcileResourceRecoveries,
    startResourceRecovery,
} from './resourceOpportunityEngine.js';
import {
    gainWorkProficiency,
    getWorkProficiencyMap,
} from './workProficiencyEngine.js';

export const RESOURCE_RECOVERY_WORK_ADAPTER_VERSION = 3;

export function checkCharacterResourceRecovery(state, opportunityId, actionId, options = {}) {
    if (state.activeBattle?.phase === 'active') return blocked('resource.in-combat', 'Resource recovery cannot start during combat.');
    if (state.travel?.active) return blocked('resource.travel-active', 'Resource recovery cannot start during active travel.');
    const blockingTask = getBlockingHandsOnTask(state);
    if (blockingTask) return blocked('resource.work-active', `${blockingTask.label} is already in progress.`);

    const opportunity = findResourceOpportunity(state, opportunityId);
    if (!opportunity) return blocked('resource.not-found', `Unknown resource opportunity: ${opportunityId}.`);
    if (opportunity.status !== RESOURCE_OPPORTUNITY_STATUSES.AVAILABLE) return blocked('resource.exhausted', `${opportunity.sourceName} has no remaining recoverable resources.`);
    const action = opportunity.actions.find((candidate) => candidate.id === String(actionId ?? '').trim().toLowerCase());
    if (!action) return blocked('resource.action-unsupported', `${opportunity.sourceName} does not support recovery action: ${actionId}.`);
    if (action.status !== RESOURCE_RECOVERY_STATUSES.AVAILABLE) return blocked('resource.action-unavailable', `${action.id} is already ${action.status}.`);

    const definition = RESOURCE_RECOVERY_ACTION_DEFINITIONS[action.id];
    const toolTags = collectAvailableToolTags(state.player, options.toolTags);
    const missingTools = definition.requiredToolTags.filter((tag) => !toolTags.includes(tag));
    if (missingTools.length) return blocked('resource.tool-required', `${action.id} requires tool capability: ${missingTools.join(', ')}.`, { missingTools });

    const proficiencies = { ...getWorkProficiencyMap(state.player), ...(options.proficiencies ?? {}) };
    const proficiency = Number(proficiencies[definition.proficiencyId] ?? 0);
    if (definition.proficiencyId && proficiency < definition.minProficiency) {
        return blocked('resource.proficiency-required', `${action.id} requires ${definition.proficiencyId} proficiency ${definition.minProficiency}.`, {
            proficiencyId: definition.proficiencyId,
            required: definition.minProficiency,
            actual: proficiency,
        });
    }
    if (opportunity.condition < definition.minCondition) return blocked('resource.condition-too-poor', `${opportunity.sourceName} is in too poor a condition for ${action.id}.`);

    return {
        ok: true,
        action: 'resource.recovery-check',
        code: 'resource.recovery-ready',
        outcome: 'available',
        data: { opportunityId, actionId: action.id, requiredToolTags: [...definition.requiredToolTags], proficiencyId: definition.proficiencyId },
        display: { text: `${action.id} is ready for ${opportunity.sourceName}.` },
        message: `${action.id} is ready for ${opportunity.sourceName}.`,
    };
}

export function startCharacterResourceRecovery(state, opportunityId, actionId, options = {}) {
    const check = checkCharacterResourceRecovery(state, opportunityId, actionId, options);
    if (!check.ok) return check;

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
        for (const item of result.items ?? []) restoreCanonicalResourceMetadata(item);
        const definition = RESOURCE_RECOVERY_ACTION_DEFINITIONS[result.actionId];
        if (!definition?.proficiencyId) continue;
        gainWorkProficiency(state, definition.proficiencyId, 1, {
            sourceId: `${result.opportunityId}:${result.actionId}`,
        });
    }
    return completed;
}

function restoreCanonicalResourceMetadata(item) {
    const canonical = getCanonicalResourceItem(item?.id);
    if (!canonical) return item;
    item.tags = [...canonical.tags];
    item.sinks = canonical.sinks.map((sink) => ({ ...sink, data: { ...(sink.data ?? {}) } }));
    item.valueGil = canonical.valueGil;
    item.metadata = canonical.metadata ? { ...canonical.metadata } : item.metadata;
    return item;
}

function blocked(code, text, data = {}) {
    return {
        ok: false,
        action: 'resource.recovery-start',
        code,
        outcome: 'blocked',
        data,
        display: { text },
        reason: text,
        message: text,
    };
}
