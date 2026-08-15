import { getGatheringSource } from '../data/ecologyCatalog.js';
import { actionFailure, actionSuccess } from './actionResult.js';
import { getBlockingHandsOnTask } from './characterActivityEngine.js';
import { getGatheringSourceAvailability, harvestGatheringSource } from './ecologyEngine.js';
import { collectAvailableToolTags } from './equipmentToolEngine.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import {
    gainWorkProficiency,
    getWorkProficiency,
    getWorkProficiencyMap,
    workDurationForProficiency,
} from './workProficiencyEngine.js';
import {
    findWorkRecord,
    markWorkCompleted,
    markWorkFailed,
    reconcileWorkTasks,
    startWorkTask,
} from './workTaskEngine.js';

export const GATHERING_WORK_VERSION = 1;

const BASE_GATHERING_SECONDS = Object.freeze({
    forage: 45,
    gather: 60,
    log: 120,
    mine: 150,
    fish: 180,
});

export function checkGatheringWorkRequirements(state, sourceId, options = {}) {
    const definition = getGatheringSource(sourceId);
    if (!definition) return { ok: false, code: 'gathering.source-not-found', blockers: [`Unknown gathering source: ${sourceId}`] };
    const blockers = [];
    if (state.activeBattle?.phase === 'active') blockers.push('Gathering cannot start during combat.');
    if (state.travel?.active) blockers.push('Gathering cannot start during active travel.');
    const blockingTask = getBlockingHandsOnTask(state);
    if (blockingTask) blockers.push(`${blockingTask.label} is already in progress.`);
    if (!options.ignorePlace && state.currentPlaceId !== definition.placeId) blockers.push(`${definition.name} is not available in the current place.`);

    const availability = getGatheringSourceAvailability(state, definition.id);
    if (!availability?.active) blockers.push(`${definition.name} is not currently active.`);
    if ((availability?.availableUnits ?? 0) < Math.max(1, Number.parseInt(options.quantity, 10) || 1)) blockers.push(`${definition.name} does not have enough recoverable units.`);

    const availableTools = new Set(collectAvailableToolTags(state.player, options.toolTags));
    const missingTools = definition.requiredToolTags.filter((tag) => !availableTools.has(tag));
    if (missingTools.length) blockers.push(`Requires tool capability: ${missingTools.join(', ')}.`);

    const proficiency = getWorkProficiency(state.player, definition.proficiencyId);
    if (proficiency < definition.minProficiency) blockers.push(`Requires ${definition.proficiencyId} proficiency ${definition.minProficiency}.`);
    return {
        ok: blockers.length === 0,
        code: blockers.length ? 'gathering.requirements-not-met' : 'gathering.ready',
        blockers,
        definition,
        availability,
        proficiency,
    };
}

export function startGatheringWork(state, sourceId, options = {}) {
    const check = checkGatheringWorkRequirements(state, sourceId, options);
    if (!check.ok) return failure(check.code, { sourceId, blockers: check.blockers }, check.blockers[0]);
    const definition = check.definition;
    const quantity = Math.max(1, Number.parseInt(options.quantity, 10) || 1);
    const baseDuration = (BASE_GATHERING_SECONDS[definition.action] ?? 60) * quantity;
    const durationSeconds = workDurationForProficiency(baseDuration, check.proficiency);
    const work = startWorkTask(state, {
        kind: 'gathering',
        label: `${definition.action} ${definition.name}`,
        channel: 'work:character',
        durationSeconds,
        data: {
            sourceId: definition.id,
            startPlaceId: state.currentPlaceId,
            quantity,
            containerId: String(options.containerId ?? 'inventory'),
            proficiencyId: definition.proficiencyId,
            proficiencyAtStart: check.proficiency,
            requiredToolTags: [...definition.requiredToolTags],
        },
    });
    if (!work.ok) return work;
    const event = emitSemanticEvent(state, 'gathering.started', {
        workId: work.data.work.id,
        sourceId: definition.id,
        action: definition.action,
        quantity,
        durationSeconds,
        proficiencyId: definition.proficiencyId,
    }, { source: 'gatheringWorkEngine' });
    return actionSuccess({
        action: 'gathering.start',
        code: 'gathering.started',
        outcome: 'started',
        data: { ...work.data, source: check.availability, eventId: event.id },
        display: { text: `Started ${definition.action} at ${definition.name}; ${durationSeconds}s required.` },
    });
}

export function reconcileGatheringWork(state, options = {}) {
    const due = reconcileWorkTasks(state);
    const results = [];
    for (const { record } of due) {
        if (record.kind !== 'gathering' || !record.data?.sourceId) continue;
        results.push(resolveGatheringWork(state, record.id, options));
    }
    return results;
}

function resolveGatheringWork(state, workId, options) {
    const record = findWorkRecord(state, workId);
    const definition = getGatheringSource(record?.data?.sourceId);
    if (!record || !definition) return failure('gathering.work-invalid', { workId }, 'Gathering work references an unknown source.');
    if (state.currentPlaceId !== record.data.startPlaceId) {
        markWorkFailed(state, record.id, 'gathering.left-source', { finishPlaceId: state.currentPlaceId });
        return failure('gathering.left-source', { workId }, `${record.label} could not finish after leaving the source.`);
    }

    const result = harvestGatheringSource(state, definition.id, {
        quantity: record.data.quantity,
        containerId: options.containerId ?? record.data.containerId,
        inventoryContext: options.inventoryContext,
        toolTags: options.toolTags,
        proficiencies: getWorkProficiencyMap(state.player),
    });
    if (!result.ok) {
        markWorkFailed(state, record.id, result.code ?? 'gathering.harvest-failed', { harvestCode: result.code ?? null });
        return result;
    }

    gainWorkProficiency(state, definition.proficiencyId, Math.max(1, record.data.quantity), { sourceId: definition.id });
    const completed = markWorkCompleted(state, record.id, {
        itemId: result.data.item.id,
        quantity: result.data.quantity,
    });
    const event = emitSemanticEvent(state, 'gathering.completed', {
        workId: record.id,
        sourceId: definition.id,
        action: definition.action,
        itemId: result.data.item.id,
        quantity: result.data.quantity,
    }, { source: 'gatheringWorkEngine' });
    return actionSuccess({
        action: 'gathering.resolve',
        code: 'gathering.completed',
        outcome: 'completed',
        data: { work: completed, harvest: result.data, eventId: event.id },
        display: { text: `Completed ${definition.action} at ${definition.name}: ${result.data.quantity} ${result.data.item.name}.` },
    });
}

function failure(code, data, text) {
    return actionFailure({ action: 'gathering', code, outcome: 'blocked', data, display: { text } });
}
