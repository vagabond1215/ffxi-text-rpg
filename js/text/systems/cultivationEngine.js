import { getResourceItem } from '../data/resourceItems.js';
import { validateProvenance } from '../data/resourceProvenance.js';
import { actionFailure, actionSuccess } from './actionResult.js';
import { getBlockingHandsOnTask } from './characterActivityEngine.js';
import { getHomePlaceId, isAtHomePlace } from './homeInfrastructureEngine.js';
import {
    addItemToContainer,
    canStoreItemInContainer,
    removeItemQuantityFromContainer,
} from './inventoryEngine.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import { findTimedTask } from './timedTaskEngine.js';
import {
    gainWorkProficiency,
    getWorkProficiency,
    workDurationForProficiency,
} from './workProficiencyEngine.js';
import {
    findWorkRecord,
    markWorkCompleted,
    reconcileWorkTasks,
    startWorkTask,
    WORK_STATUSES,
} from './workTaskEngine.js';
import { ensureWorldTimeState, SECONDS_PER_DAY } from './worldTimeEngine.js';

export const CULTIVATION_STATE_VERSION = 1;
export const CULTIVATION_PLOT_ID = 'plot-home-sweetroot-bed';
export const CULTIVATION_ITEM_ID = 'item-elderwood-sweetroot';
export const CULTIVATION_PROFICIENCY_ID = 'cultivation';
export const CULTIVATION_GROWTH_SECONDS = 2 * SECONDS_PER_DAY;
export const CULTIVATION_TEND_DUE_SECONDS = SECONDS_PER_DAY;
export const CULTIVATION_BASE_PREPARE_SECONDS = 15 * 60;
export const CULTIVATION_BASE_TEND_SECONDS = 10 * 60;
export const CULTIVATION_BASE_HARVEST_QUANTITY = 3;

const CULTIVATION_PHASES = Object.freeze(['unprepared', 'prepared', 'growing']);
const CULTIVATION_WORK_KINDS = Object.freeze({
    prepare: 'cultivation-prepare',
    tend: 'cultivation-tend',
});

export function createCultivationState(options = {}) {
    return {
        version: CULTIVATION_STATE_VERSION,
        plot: {
            id: CULTIVATION_PLOT_ID,
            homePlaceId: String(options.homePlaceId ?? '').trim(),
            phase: 'unprepared',
            cycle: 0,
            harvestCount: 0,
            activeWorkId: null,
            activeWorkKind: null,
            preparedAtWorldSeconds: null,
            lastHarvestedAtWorldSeconds: null,
            crop: null,
        },
    };
}

export function ensureCultivationState(state) {
    if (!state || typeof state !== 'object') throw new Error('Cultivation requires game state.');
    if (!state.cultivation || typeof state.cultivation !== 'object' || Array.isArray(state.cultivation)) {
        state.cultivation = createCultivationState({ homePlaceId: getHomePlaceId(state) });
    }
    const issues = validateCultivationState(state.cultivation, state.work);
    if (issues.length) throw new Error(issues.join(' '));
    return state.cultivation;
}

export function getCultivationPlotStatus(state) {
    const cultivation = ensureCultivationState(state);
    const plot = cultivation.plot;
    if (plot.activeWorkId) return plot.activeWorkKind === 'tend' ? 'tending' : 'preparing';
    if (plot.phase !== 'growing' || !plot.crop) return plot.phase;
    const now = ensureWorldTimeState(state).totalSeconds;
    if (plot.crop.tendedAtWorldSeconds !== null && now >= plot.crop.readyAtWorldSeconds) return 'ready';
    if (plot.crop.tendedAtWorldSeconds === null && now >= plot.crop.tendDueAtWorldSeconds) return 'needsTending';
    return 'growing';
}

export function startCultivationPreparation(state) {
    reconcileCultivationWork(state);
    const cultivation = ensureCultivationState(state);
    const plot = cultivation.plot;
    const blockers = handsOnBlockers(state, plot, 'prepare');
    if (plot.phase !== 'unprepared' || plot.crop) blockers.push('The Sweetroot bed does not need preparing right now.');
    if (blockers.length) return failure('cultivation.prepare-blocked', blockers[0], { blockers });

    const proficiency = getWorkProficiency(state.player, CULTIVATION_PROFICIENCY_ID);
    const durationSeconds = workDurationForProficiency(CULTIVATION_BASE_PREPARE_SECONDS, proficiency);
    const work = startWorkTask(state, {
        kind: CULTIVATION_WORK_KINDS.prepare,
        label: 'Prepare the Sweetroot bed',
        channel: 'work:character',
        durationSeconds,
        data: {
            cultivationPlotId: plot.id,
            cultivationAction: 'prepare',
            startPlaceId: state.currentPlaceId,
            proficiencyId: CULTIVATION_PROFICIENCY_ID,
            proficiencyAtStart: proficiency,
        },
    });
    if (!work.ok) return work;

    plot.activeWorkId = work.data.work.id;
    plot.activeWorkKind = 'prepare';
    const event = emitSemanticEvent(state, 'cultivation.preparation-started', {
        plotId: plot.id,
        homePlaceId: plot.homePlaceId,
        workId: work.data.work.id,
        durationSeconds,
        proficiency,
    }, { source: 'cultivationEngine' });
    return actionSuccess({
        action: 'cultivation.prepare',
        code: 'cultivation.preparation-started',
        outcome: 'started',
        data: { work: work.data.work, durationSeconds, proficiency, eventId: event.id },
        display: { text: `You begin preparing the Sweetroot bed. The work will take ${formatDuration(durationSeconds)}.` },
    });
}

export function plantCultivationCrop(state, options = {}) {
    reconcileCultivationWork(state);
    const cultivation = ensureCultivationState(state);
    const plot = cultivation.plot;
    const blockers = handsOnBlockers(state, plot, 'plant');
    if (plot.phase !== 'prepared' || plot.crop) blockers.push('Prepare the Sweetroot bed before planting it.');
    if (blockers.length) return failure('cultivation.plant-blocked', blockers[0], { blockers });

    const containerId = String(options.containerId ?? 'inventory');
    const inventoryState = state.player?.inventoryState;
    if (!inventoryState) return failure('cultivation.no-inventory', 'No inventory state is available for planting.');
    const removed = removeItemQuantityFromContainer(inventoryState, containerId, CULTIVATION_ITEM_ID, 1);
    if (!removed.ok) return failure('cultivation.seed-unavailable', 'Bring one Elderwood Sweetroot to propagate in the prepared bed.', { containerId });

    const now = ensureWorldTimeState(state).totalSeconds;
    plot.cycle += 1;
    plot.phase = 'growing';
    plot.crop = {
        itemId: CULTIVATION_ITEM_ID,
        cycle: plot.cycle,
        plantedAtWorldSeconds: now,
        tendDueAtWorldSeconds: now + CULTIVATION_TEND_DUE_SECONDS,
        readyAtWorldSeconds: now + CULTIVATION_GROWTH_SECONDS,
        tendedAtWorldSeconds: null,
        seedProvenance: structuredCloneSafe(removed.item.provenance ?? []),
    };

    const event = emitSemanticEvent(state, 'cultivation.planted', {
        plotId: plot.id,
        homePlaceId: plot.homePlaceId,
        itemId: CULTIVATION_ITEM_ID,
        cycle: plot.cycle,
        plantedAtWorldSeconds: now,
        tendDueAtWorldSeconds: plot.crop.tendDueAtWorldSeconds,
        readyAtWorldSeconds: plot.crop.readyAtWorldSeconds,
    }, { source: 'cultivationEngine' });
    return actionSuccess({
        action: 'cultivation.plant',
        code: 'cultivation.planted',
        outcome: 'planted',
        data: { crop: snapshotCrop(plot.crop), eventId: event.id },
        display: { text: 'You plant one Elderwood Sweetroot in the prepared bed. It will need tending after one fictional day and can mature after two.' },
    });
}

export function startCultivationTending(state) {
    reconcileCultivationWork(state);
    const cultivation = ensureCultivationState(state);
    const plot = cultivation.plot;
    const blockers = handsOnBlockers(state, plot, 'tend');
    if (getCultivationPlotStatus(state) !== 'needsTending') blockers.push('The Sweetroot bed does not need tending yet.');
    if (blockers.length) return failure('cultivation.tend-blocked', blockers[0], { blockers });

    const proficiency = getWorkProficiency(state.player, CULTIVATION_PROFICIENCY_ID);
    const durationSeconds = workDurationForProficiency(CULTIVATION_BASE_TEND_SECONDS, proficiency);
    const work = startWorkTask(state, {
        kind: CULTIVATION_WORK_KINDS.tend,
        label: 'Tend the Sweetroot bed',
        channel: 'work:character',
        durationSeconds,
        data: {
            cultivationPlotId: plot.id,
            cultivationAction: 'tend',
            cropCycle: plot.crop.cycle,
            startPlaceId: state.currentPlaceId,
            proficiencyId: CULTIVATION_PROFICIENCY_ID,
            proficiencyAtStart: proficiency,
        },
    });
    if (!work.ok) return work;

    plot.activeWorkId = work.data.work.id;
    plot.activeWorkKind = 'tend';
    const event = emitSemanticEvent(state, 'cultivation.tending-started', {
        plotId: plot.id,
        cycle: plot.crop.cycle,
        workId: work.data.work.id,
        durationSeconds,
        proficiency,
    }, { source: 'cultivationEngine' });
    return actionSuccess({
        action: 'cultivation.tend',
        code: 'cultivation.tending-started',
        outcome: 'started',
        data: { work: work.data.work, durationSeconds, proficiency, eventId: event.id },
        display: { text: `You begin tending the Sweetroot bed. The work will take ${formatDuration(durationSeconds)}.` },
    });
}

export function reconcileCultivationWork(state) {
    const cultivation = ensureCultivationState(state);
    const plot = cultivation.plot;
    const due = reconcileWorkTasks(state);
    if (!plot.activeWorkId) return [];

    const dueEntry = due.find(({ record }) => record.id === plot.activeWorkId);
    if (!dueEntry) return [];
    const record = findWorkRecord(state, plot.activeWorkId);
    if (!record || record.status !== WORK_STATUSES.ACTIVE) return [];
    if (record.data?.cultivationPlotId !== plot.id) return [];

    const completedAtWorldSeconds = findTimedTask(state, record.taskId)?.completedAtWorldSeconds
        ?? ensureWorldTimeState(state).totalSeconds;
    const results = [];

    if (plot.activeWorkKind === 'prepare' && record.kind === CULTIVATION_WORK_KINDS.prepare) {
        plot.phase = 'prepared';
        plot.preparedAtWorldSeconds = completedAtWorldSeconds;
        plot.activeWorkId = null;
        plot.activeWorkKind = null;
        gainWorkProficiency(state, CULTIVATION_PROFICIENCY_ID, 1, { sourceId: plot.id });
        const completed = markWorkCompleted(state, record.id, { cultivationAction: 'prepare', plotId: plot.id });
        const event = emitSemanticEvent(state, 'cultivation.prepared', {
            plotId: plot.id,
            workId: record.id,
            preparedAtWorldSeconds: completedAtWorldSeconds,
        }, { source: 'cultivationEngine' });
        results.push(actionSuccess({
            action: 'cultivation.reconcile',
            code: 'cultivation.prepared',
            outcome: 'completed',
            data: { work: completed, eventId: event.id },
            display: { text: 'The Sweetroot bed is prepared and ready for one propagation root.' },
        }));
    } else if (plot.activeWorkKind === 'tend' && record.kind === CULTIVATION_WORK_KINDS.tend && plot.crop) {
        plot.crop.tendedAtWorldSeconds = completedAtWorldSeconds;
        plot.activeWorkId = null;
        plot.activeWorkKind = null;
        gainWorkProficiency(state, CULTIVATION_PROFICIENCY_ID, 1, { sourceId: plot.id });
        const completed = markWorkCompleted(state, record.id, { cultivationAction: 'tend', plotId: plot.id, cropCycle: plot.crop.cycle });
        const event = emitSemanticEvent(state, 'cultivation.tended', {
            plotId: plot.id,
            cycle: plot.crop.cycle,
            workId: record.id,
            tendedAtWorldSeconds: completedAtWorldSeconds,
            readyAtWorldSeconds: plot.crop.readyAtWorldSeconds,
        }, { source: 'cultivationEngine' });
        results.push(actionSuccess({
            action: 'cultivation.reconcile',
            code: 'cultivation.tended',
            outcome: 'completed',
            data: { work: completed, crop: snapshotCrop(plot.crop), eventId: event.id },
            display: { text: 'The Sweetroot bed is tended. Leave it to mature until its second fictional day.' },
        }));
    }

    return results;
}

export function harvestCultivationCrop(state, options = {}) {
    reconcileCultivationWork(state);
    const cultivation = ensureCultivationState(state);
    const plot = cultivation.plot;
    const blockers = handsOnBlockers(state, plot, 'harvest');
    if (getCultivationPlotStatus(state) !== 'ready') blockers.push('The Sweetroot bed is not ready to harvest.');
    if (blockers.length) return failure('cultivation.harvest-blocked', blockers[0], { blockers });

    const inventoryState = state.player?.inventoryState;
    if (!inventoryState) return failure('cultivation.no-inventory', 'No inventory state is available for the harvest.');
    const containerId = String(options.containerId ?? 'inventory');
    const quantity = CULTIVATION_BASE_HARVEST_QUANTITY;
    const item = createCultivatedOutput(plot, quantity);
    const storeCheck = canStoreItemInContainer(inventoryState, containerId, item);
    if (!storeCheck.ok) return failure('cultivation.storage-full', storeCheck.reason, { containerId });

    const stored = addItemToContainer(inventoryState, containerId, item);
    if (!stored.ok) return failure('cultivation.storage-failed', stored.reason, { containerId });

    const now = ensureWorldTimeState(state).totalSeconds;
    const harvestedCrop = snapshotCrop(plot.crop);
    plot.crop = null;
    plot.phase = 'unprepared';
    plot.harvestCount += 1;
    plot.lastHarvestedAtWorldSeconds = now;
    plot.preparedAtWorldSeconds = null;
    gainWorkProficiency(state, CULTIVATION_PROFICIENCY_ID, 2, { sourceId: plot.id });

    const event = emitSemanticEvent(state, 'cultivation.harvested', {
        plotId: plot.id,
        homePlaceId: plot.homePlaceId,
        cycle: harvestedCrop.cycle,
        itemId: CULTIVATION_ITEM_ID,
        quantity,
        containerId,
        harvestedAtWorldSeconds: now,
    }, { source: 'cultivationEngine' });
    return actionSuccess({
        action: 'cultivation.harvest',
        code: 'cultivation.harvested',
        outcome: 'harvested',
        data: { item: stored.item, quantity, containerId, crop: harvestedCrop, eventId: event.id },
        display: { text: `You harvest ${quantity} Elderwood Sweetroots. Their provenance now records this home cultivation cycle.` },
    });
}

export function createCultivationModel(state) {
    const cultivation = ensureCultivationState(state);
    const plot = cultivation.plot;
    const status = getCultivationPlotStatus(state);
    const atHome = isAtHomePlace(state);
    const homeName = state?.player?.identity?.startingCity ?? plot.homePlaceId;
    const proficiency = getWorkProficiency(state.player, CULTIVATION_PROFICIENCY_ID);
    const prepareSeconds = workDurationForProficiency(CULTIVATION_BASE_PREPARE_SECONDS, proficiency);
    const tendSeconds = workDurationForProficiency(CULTIVATION_BASE_TEND_SECONDS, proficiency);
    const carriedSweetroot = carriedQuantity(state, CULTIVATION_ITEM_ID);
    const now = ensureWorldTimeState(state).totalSeconds;

    let opportunityStatus = atHome ? 'ready' : 'available';
    let summary = 'Keep a small Sweetroot bed at your lodging and turn field material into a repeatable local food-and-medicine crop.';
    let progress = `Cultivation proficiency ${proficiency}.`;
    let blockers = [];
    let action = null;

    if (status === 'unprepared') {
        progress = `Prepare the bed with ${formatDuration(prepareSeconds)} of hands-on work. Cultivation proficiency: ${proficiency}.`;
        if (atHome) action = cultivationAction('cultivation:prepare', `Prepare bed · ${formatDuration(prepareSeconds)}`, 'cultivation.prepare');
        else progress = `Return to ${homeName} to prepare the Sweetroot bed.`;
    } else if (status === 'preparing' || status === 'tending') {
        opportunityStatus = 'active';
        summary = status === 'preparing' ? 'You are preparing the Sweetroot bed.' : 'You are tending the growing Sweetroot crop.';
        progress = 'Finish the current hands-on work before taking another cultivation step.';
        action = cultivationAction('cultivation:finish-work', 'Finish cultivation work', 'activity.advanceToCompletion');
    } else if (status === 'prepared') {
        if (carriedSweetroot > 0 && atHome) {
            action = cultivationAction('cultivation:plant', 'Plant 1 Elderwood Sweetroot', 'cultivation.plant');
            progress = `1 Sweetroot becomes the propagation input; ${carriedSweetroot} carried. Growth uses fictional time, not wall-clock time.`;
        } else {
            opportunityStatus = atHome ? 'blocked' : 'available';
            progress = atHome ? 'Bring one Elderwood Sweetroot to propagate in the prepared bed.' : `Return to ${homeName} with one Elderwood Sweetroot.`;
            if (atHome) blockers = ['Bring one Elderwood Sweetroot from your existing field/economy loop.'];
        }
    } else if (status === 'growing') {
        opportunityStatus = 'available';
        const remaining = Math.max(0, plot.crop.tendDueAtWorldSeconds - now);
        progress = `Growing. Tending becomes due in ${formatDuration(remaining)}; maturity follows on the second fictional day.`;
    } else if (status === 'needsTending') {
        opportunityStatus = atHome ? 'ready' : 'available';
        progress = `The crop needs ${formatDuration(tendSeconds)} of tending before it can be harvested. Cultivation proficiency: ${proficiency}.`;
        if (atHome) action = cultivationAction('cultivation:tend', `Tend crop · ${formatDuration(tendSeconds)}`, 'cultivation.tend');
        else progress = `Return to ${homeName}; the Sweetroot bed needs tending.`;
    } else if (status === 'ready') {
        opportunityStatus = atHome ? 'ready' : 'available';
        progress = `Ready to harvest ${CULTIVATION_BASE_HARVEST_QUANTITY} Sweetroots into ordinary inventory with home-cultivation provenance.`;
        if (atHome) action = cultivationAction('cultivation:harvest', `Harvest ${CULTIVATION_BASE_HARVEST_QUANTITY} Sweetroots`, 'cultivation.harvest');
        else progress = `Return to ${homeName}; the Sweetroot crop is ready to harvest.`;
    }

    const entry = Object.freeze({
        id: 'cultivation-home-sweetroot-bed',
        category: 'livelihood',
        title: 'Sweetroot Stewardship',
        summary,
        motivation: 'A tended home crop turns prior field access into a repeatable local supply while preserving time, inventory, provenance, and mastery costs.',
        progress,
        status: opportunityStatus,
        reason: 'Your lodging includes one small reusable cultivation bed tied to your existing home foothold.',
        requirements: Object.freeze([
            Object.freeze({ label: `Work at ${homeName}`, met: atHome || ['growing', 'active'].includes(opportunityStatus) }),
            Object.freeze({ label: 'Use one physical Elderwood Sweetroot as propagation input', met: Boolean(plot.crop) || carriedSweetroot > 0 || plot.harvestCount > 0 }),
            Object.freeze({ label: 'Let two fictional days pass and tend after the first', met: status === 'ready' || plot.harvestCount > 0 }),
        ]),
        blockers: Object.freeze(blockers),
        action,
        regionLabel: null,
        groupKind: 'cultivation',
    });
    return Object.freeze({
        version: CULTIVATION_STATE_VERSION,
        status,
        proficiency,
        plot: snapshotPlot(plot),
        entries: Object.freeze([entry]),
        actions: Object.freeze(action ? [action] : []),
    });
}

export function decorateCultivationOpportunityModel(state, baseModel) {
    if (!baseModel) return baseModel;
    const cultivation = createCultivationModel(state);
    const cultivationIds = new Set(cultivation.entries.map((entry) => entry.id));
    const entries = [...(baseModel.entries ?? []).filter((entry) => !cultivationIds.has(entry.id)), ...cultivation.entries];
    const groups = [...(baseModel.groups ?? []).filter((group) => group.id !== 'cultivation-stewardship'), createCultivationGroup(cultivation.entries, isAtHomePlace(state))];
    const activeEntry = cultivation.entries.find((entry) => entry.status === 'active' && entry.action);
    const readyEntry = cultivation.entries.find((entry) => entry.status === 'ready' && entry.action);
    return Object.freeze({
        ...baseModel,
        version: Math.max(Number(baseModel.version) || 0, 12),
        cultivationVersion: CULTIVATION_STATE_VERSION,
        recommendedOpportunityId: activeEntry?.id ?? readyEntry?.id ?? baseModel.recommendedOpportunityId,
        entries: Object.freeze(entries),
        groups: Object.freeze(groups),
    });
}

export function validateCultivationState(cultivation, workState = null) {
    if (!plainObject(cultivation)) return ['cultivation must be an object.'];
    const issues = [];
    if (cultivation.version !== CULTIVATION_STATE_VERSION) issues.push(`cultivation.version must be ${CULTIVATION_STATE_VERSION}.`);
    const plot = cultivation.plot;
    if (!plainObject(plot)) return [...issues, 'cultivation.plot must be an object.'];
    if (plot.id !== CULTIVATION_PLOT_ID) issues.push(`cultivation.plot.id must be ${CULTIVATION_PLOT_ID}.`);
    if (!validStableId(plot.homePlaceId)) issues.push('cultivation.plot.homePlaceId must be a stable place id.');
    if (!CULTIVATION_PHASES.includes(plot.phase)) issues.push('cultivation.plot.phase is invalid.');
    if (!nonNegativeInteger(plot.cycle)) issues.push('cultivation.plot.cycle must be a non-negative integer.');
    if (!nonNegativeInteger(plot.harvestCount)) issues.push('cultivation.plot.harvestCount must be a non-negative integer.');
    if (!nullableNonNegativeInteger(plot.preparedAtWorldSeconds)) issues.push('cultivation.plot.preparedAtWorldSeconds is invalid.');
    if (!nullableNonNegativeInteger(plot.lastHarvestedAtWorldSeconds)) issues.push('cultivation.plot.lastHarvestedAtWorldSeconds is invalid.');
    if (plot.activeWorkId !== null && !/^work-\d{6,}$/.test(plot.activeWorkId ?? '')) issues.push('cultivation.plot.activeWorkId is invalid.');
    if (plot.activeWorkKind !== null && !['prepare', 'tend'].includes(plot.activeWorkKind)) issues.push('cultivation.plot.activeWorkKind is invalid.');
    if ((plot.activeWorkId === null) !== (plot.activeWorkKind === null)) issues.push('cultivation.plot active work id/kind must be present together.');

    if (plot.phase === 'growing') {
        if (!plainObject(plot.crop)) issues.push('cultivation.plot.crop must exist while growing.');
    } else if (plot.crop !== null) {
        issues.push('cultivation.plot.crop must be null unless phase is growing.');
    }

    if (plainObject(plot.crop)) {
        const crop = plot.crop;
        if (crop.itemId !== CULTIVATION_ITEM_ID) issues.push(`cultivation.plot.crop.itemId must be ${CULTIVATION_ITEM_ID}.`);
        if (!positiveInteger(crop.cycle) || crop.cycle !== plot.cycle) issues.push('cultivation.plot.crop.cycle must match the current positive plot cycle.');
        if (!nonNegativeInteger(crop.plantedAtWorldSeconds)) issues.push('cultivation.plot.crop.plantedAtWorldSeconds is invalid.');
        if (!nonNegativeInteger(crop.tendDueAtWorldSeconds)) issues.push('cultivation.plot.crop.tendDueAtWorldSeconds is invalid.');
        if (!nonNegativeInteger(crop.readyAtWorldSeconds)) issues.push('cultivation.plot.crop.readyAtWorldSeconds is invalid.');
        if (!nullableNonNegativeInteger(crop.tendedAtWorldSeconds)) issues.push('cultivation.plot.crop.tendedAtWorldSeconds is invalid.');
        if (nonNegativeInteger(crop.plantedAtWorldSeconds) && crop.tendDueAtWorldSeconds !== crop.plantedAtWorldSeconds + CULTIVATION_TEND_DUE_SECONDS) {
            issues.push('cultivation.plot.crop.tendDueAtWorldSeconds must derive from planted time.');
        }
        if (nonNegativeInteger(crop.plantedAtWorldSeconds) && crop.readyAtWorldSeconds !== crop.plantedAtWorldSeconds + CULTIVATION_GROWTH_SECONDS) {
            issues.push('cultivation.plot.crop.readyAtWorldSeconds must derive from planted time.');
        }
        if (crop.tendedAtWorldSeconds !== null && nonNegativeInteger(crop.tendDueAtWorldSeconds) && crop.tendedAtWorldSeconds < crop.tendDueAtWorldSeconds) {
            issues.push('cultivation.plot.crop.tendedAtWorldSeconds cannot precede the tending boundary.');
        }
        if (!Array.isArray(crop.seedProvenance)) issues.push('cultivation.plot.crop.seedProvenance must be an array.');
        else issues.push(...validateProvenance(crop.seedProvenance).map((issue) => `cultivation.plot.crop.${issue}`));
    }

    if (plot.activeWorkId !== null) {
        if (!plainObject(workState) || !Array.isArray(workState.records)) {
            issues.push('cultivation active work requires a persisted work registry.');
        } else {
            const record = workState.records.find((entry) => entry?.id === plot.activeWorkId);
            if (!record) issues.push(`cultivation.plot.activeWorkId ${plot.activeWorkId} must reference persisted work.`);
            else {
                const expectedKind = CULTIVATION_WORK_KINDS[plot.activeWorkKind];
                if (record.kind !== expectedKind) issues.push(`cultivation work ${record.id} must use kind ${expectedKind}.`);
                if (record.data?.cultivationPlotId !== plot.id) issues.push(`cultivation work ${record.id} must reference plot ${plot.id}.`);
                if (record.status !== WORK_STATUSES.ACTIVE) issues.push(`cultivation work ${record.id} must remain active until cultivation reconciliation.`);
            }
        }
    }
    return issues;
}

function createCultivatedOutput(plot, quantity) {
    const base = getResourceItem(CULTIVATION_ITEM_ID);
    if (!base) throw new Error(`Missing cultivation item ${CULTIVATION_ITEM_ID}.`);
    const crop = plot.crop;
    return {
        ...base,
        quantity,
        provenance: [{
            version: 1,
            type: 'flora',
            sourceId: plot.id,
            placeId: plot.homePlaceId,
            action: 'gather',
            exceptional: false,
            notes: 'Cultivated at the character home foothold from a physical propagation root.',
            data: {
                cultivated: true,
                cycle: crop.cycle,
                plantedAtWorldSeconds: crop.plantedAtWorldSeconds,
                tendedAtWorldSeconds: crop.tendedAtWorldSeconds,
                readyAtWorldSeconds: crop.readyAtWorldSeconds,
                seedItemId: crop.itemId,
                seedProvenance: structuredCloneSafe(crop.seedProvenance),
            },
        }],
    };
}

function handsOnBlockers(state, plot, action) {
    const blockers = [];
    if (!isAtHomePlace(state) || state.currentPlaceId !== plot.homePlaceId) blockers.push('Return to your home foothold before working the Sweetroot bed.');
    if (state.activeBattle?.phase === 'active') blockers.push('Cultivation cannot start during combat.');
    if (state.travel?.active) blockers.push('Cultivation cannot start during active travel.');
    const blockingTask = getBlockingHandsOnTask(state);
    const ownActiveWork = plot.activeWorkId && findWorkRecord(state, plot.activeWorkId);
    if (blockingTask && !ownActiveWork) blockers.push(`${blockingTask.label} is already in progress.`);
    if (plot.activeWorkId && !['prepare', 'tend'].includes(action)) blockers.push('Finish the current cultivation work first.');
    return blockers;
}

function createCultivationGroup(entries, current) {
    const statuses = { active: 0, ready: 0, available: 0, blocked: 0, complete: 0 };
    for (const entry of entries) if (Object.hasOwn(statuses, entry.status)) statuses[entry.status] += 1;
    return Object.freeze({
        id: 'cultivation-stewardship',
        kind: 'cultivation',
        label: 'Cultivation & Stewardship',
        current,
        entries: Object.freeze([...entries]),
        activeCount: statuses.active,
        readyCount: statuses.ready,
        availableCount: statuses.available,
        blockedCount: statuses.blocked,
        completeCount: statuses.complete,
    });
}

function cultivationAction(id, label, intent, payload = {}) {
    return Object.freeze({ id, label, intent, payload: Object.freeze({ ...payload }) });
}

function carriedQuantity(state, itemId) {
    return (state.player?.inventoryState?.containers?.inventory?.items ?? [])
        .filter((item) => item.id === itemId || item.templateId === itemId)
        .reduce((total, item) => total + (Number(item.quantity) || 1), 0);
}

function snapshotCrop(crop) {
    if (!crop) return null;
    return Object.freeze({ ...crop, seedProvenance: Object.freeze(structuredCloneSafe(crop.seedProvenance ?? [])) });
}

function snapshotPlot(plot) {
    return Object.freeze({ ...plot, crop: snapshotCrop(plot.crop) });
}

function structuredCloneSafe(value) {
    if (!value || typeof value !== 'object') return value ?? null;
    return JSON.parse(JSON.stringify(value));
}

function formatDuration(seconds) {
    const total = Math.max(0, Math.floor(Number(seconds) || 0));
    if (total >= SECONDS_PER_DAY) {
        const days = Math.floor(total / SECONDS_PER_DAY);
        const hours = Math.floor((total % SECONDS_PER_DAY) / 3600);
        return hours ? `${days}d ${hours}h` : `${days}d`;
    }
    if (total >= 3600) {
        const hours = Math.floor(total / 3600);
        const minutes = Math.floor((total % 3600) / 60);
        return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    if (total >= 60) return `${Math.ceil(total / 60)}m`;
    return `${total}s`;
}

function failure(code, text, data = {}) {
    return actionFailure({ action: 'cultivation', code, outcome: 'blocked', data, display: { text } });
}
function plainObject(value) { return Boolean(value && typeof value === 'object' && !Array.isArray(value)); }
function validStableId(value) { return typeof value === 'string' && /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(value); }
function nonNegativeInteger(value) { return Number.isInteger(value) && value >= 0; }
function positiveInteger(value) { return Number.isInteger(value) && value > 0; }
function nullableNonNegativeInteger(value) { return value === null || nonNegativeInteger(value); }
