import { getProductionDefinition, getProductionInputItem, listProductionDefinitions } from '../data/productionCatalog.js';
import { getProductionItem } from '../data/productionItems.js';
import { getBlockingHandsOnTask } from './characterActivityEngine.js';
import { collectAvailableToolTags } from './equipmentToolEngine.js';
import {
    addItemToContainer,
    findItemInContainer,
    removeItemQuantityFromContainer,
} from './inventoryEngine.js';
import { actionFailure, actionSuccess } from './actionResult.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import { hasWorkstationTags } from './workstationEngine.js';
import {
    gainWorkProficiency,
    getWorkProficiency,
    workDurationForProficiency,
} from './workProficiencyEngine.js';
import {
    cancelWorkTask,
    findWorkRecord,
    markWorkAwaitingStorage,
    markWorkCompleted,
    reconcileWorkTasks,
    startWorkTask,
    WORK_STATUSES,
} from './workTaskEngine.js';

export const PRODUCTION_ENGINE_VERSION = 1;

export function listAvailableProduction(state, options = {}) {
    return listProductionDefinitions().map((definition) => {
        const check = checkProductionRequirements(state, definition, options);
        return Object.freeze({
            id: definition.id,
            name: definition.name,
            kind: definition.kind,
            durationSeconds: workDurationForProficiency(definition.durationSeconds, getWorkProficiency(state.player, definition.proficiencyId)),
            proficiencyId: definition.proficiencyId,
            available: check.ok,
            blockers: check.blockers,
        });
    });
}

export function startProductionWork(state, processId, options = {}) {
    const definition = getProductionDefinition(processId);
    if (!definition) return failure('production.not-found', { processId }, `Unknown production process: ${processId}`);
    const check = checkProductionRequirements(state, definition, options);
    if (!check.ok) return failure(check.code, { processId: definition.id, blockers: check.blockers }, check.blockers[0] ?? `${definition.name} is unavailable.`);

    const inventoryState = state.player?.inventoryState;
    if (!inventoryState) return failure('production.inventory-missing', { processId: definition.id }, 'No inventory state is available for production.');
    const containerId = String(options.containerId ?? 'inventory');
    const proficiency = getWorkProficiency(state.player, definition.proficiencyId);
    const durationSeconds = workDurationForProficiency(definition.durationSeconds, proficiency);

    const taskResult = startWorkTask(state, {
        kind: definition.kind,
        label: definition.name,
        channel: 'work:character',
        durationSeconds,
        data: {
            processId: definition.id,
            processKind: definition.kind,
            containerId,
            startPlaceId: state.currentPlaceId ?? null,
            requiredStationTags: [...definition.requiredStationTags],
            requiredToolTags: [...definition.requiredToolTags],
            proficiencyId: definition.proficiencyId,
            proficiencyAtStart: proficiency,
            inputItems: [],
            pendingOutputs: [],
            outputsMaterialized: false,
            proficiencyGranted: false,
        },
    });
    if (!taskResult.ok) return taskResult;

    const workId = taskResult.data.work.id;
    const removed = removeInputsAtomically(inventoryState, containerId, definition.inputs);
    if (!removed.ok) {
        cancelWorkTask(state, workId);
        return failure('production.inputs-unavailable', { processId: definition.id, reason: removed.reason }, removed.reason);
    }

    const record = findWorkRecord(state, workId);
    record.data.inputItems = removed.items.map((item) => snapshotConsumedItem(item));
    const event = emitSemanticEvent(state, 'production.started', {
        workId,
        processId: definition.id,
        kind: definition.kind,
        durationSeconds,
        proficiencyId: definition.proficiencyId,
        proficiencyAtStart: proficiency,
        inputs: record.data.inputItems.map((item) => ({ itemId: item.id, quantity: item.quantity })),
    }, { source: 'productionEngine' });

    return actionSuccess({
        action: 'production.start',
        code: 'production.started',
        outcome: 'started',
        data: { work: findWorkRecord(state, workId), task: taskResult.data.task, process: definition, eventId: event.id },
        display: { text: `Started ${definition.name}; ${durationSeconds}s required.` },
    });
}

export function reconcileProductionWork(state, options = {}) {
    const due = reconcileWorkTasks(state);
    const completed = [];
    for (const { record } of due) {
        if (!getProductionDefinition(record.data?.processId)) continue;
        const result = resolveProductionOutput(state, record.id, options);
        completed.push(result);
    }
    return completed;
}

export function claimProductionOutputs(state, workId, options = {}) {
    const record = findWorkRecord(state, workId);
    if (!record) return failure('production.work-not-found', { workId }, `Unknown work record: ${workId}`);
    if (record.status !== WORK_STATUSES.AWAITING_STORAGE) {
        return failure('production.outputs-not-pending', { workId, status: record.status }, `${record.label} has no pending outputs.`);
    }
    return materializePendingOutputs(state, record, options);
}

export function checkProductionRequirements(state, definitionOrId, options = {}) {
    const definition = typeof definitionOrId === 'string' ? getProductionDefinition(definitionOrId) : definitionOrId;
    if (!definition) return { ok: false, code: 'production.not-found', blockers: ['Unknown production process.'] };
    const blockers = [];
    if (state.activeBattle?.phase === 'active') blockers.push('Production cannot start during combat.');
    if (state.travel?.active) blockers.push('Production cannot start during active travel.');
    const blockingTask = getBlockingHandsOnTask(state);
    if (blockingTask) blockers.push(`${blockingTask.label} is already in progress.`);

    const station = hasWorkstationTags(state, definition.requiredStationTags, options.stationTags);
    if (!station.ok) blockers.push(`Requires workstation: ${station.missing.join(', ')}.`);
    const availableTools = new Set(collectAvailableToolTags(state.player, options.toolTags));
    const missingTools = definition.requiredToolTags.filter((tag) => !availableTools.has(tag));
    if (missingTools.length) blockers.push(`Requires tool capability: ${missingTools.join(', ')}.`);

    const proficiency = getWorkProficiency(state.player, definition.proficiencyId);
    if (proficiency < definition.minProficiency) blockers.push(`Requires ${definition.proficiencyId} proficiency ${definition.minProficiency}.`);

    const inventoryState = state.player?.inventoryState;
    const containerId = String(options.containerId ?? 'inventory');
    if (!inventoryState) blockers.push('No inventory state is available.');
    else blockers.push(...findMissingInputs(inventoryState, containerId, definition.inputs));

    return {
        ok: blockers.length === 0,
        code: blockers.length ? 'production.requirements-not-met' : 'production.ready',
        blockers,
        proficiency,
        availableToolTags: Array.from(availableTools),
        availableStationTags: station.available,
    };
}

function resolveProductionOutput(state, workId, options = {}) {
    const record = findWorkRecord(state, workId);
    if (!record) return failure('production.work-not-found', { workId }, `Unknown work record: ${workId}`);
    const definition = getProductionDefinition(record.data?.processId);
    if (!definition) return failure('production.process-missing', { workId }, `${record.label} references an unknown process.`);
    if (record.data.outputsMaterialized) {
        return actionSuccess({ action: 'production.resolve', code: 'production.already-resolved', outcome: 'unchanged', data: { work: record }, display: { text: `${record.label} is already resolved.` } });
    }

    const outputs = definition.outputs.map((output) => buildRuntimeOutput(state, record, definition, output));
    record.data.pendingOutputs = outputs.map((item) => ({ ...item }));
    return materializePendingOutputs(state, record, options);
}

function materializePendingOutputs(state, record, options = {}) {
    const inventoryState = state.player?.inventoryState;
    if (!inventoryState) return failure('production.inventory-missing', { workId: record.id }, 'No inventory state is available for production output.');
    const containerId = String(options.containerId ?? record.data.containerId ?? 'inventory');
    const outputs = (record.data.pendingOutputs ?? []).map((item) => ({ ...item }));
    if (!outputs.length) return failure('production.outputs-missing', { workId: record.id }, `${record.label} has no output definitions.`);

    const preflight = preflightOutputStorage(inventoryState, containerId, outputs, options.inventoryContext ?? {});
    if (!preflight.ok) {
        markWorkAwaitingStorage(state, record.id, { storageFailure: preflight.reason, pendingOutputs: outputs });
        const event = emitSemanticEvent(state, 'production.output-pending', {
            workId: record.id,
            processId: record.data.processId,
            containerId,
            reason: preflight.reason,
            outputs: outputs.map((item) => ({ itemId: item.id, quantity: item.quantity })),
        }, { source: 'productionEngine' });
        return actionSuccess({
            action: 'production.resolve',
            code: 'production.output-pending',
            outcome: 'awaitingStorage',
            data: { work: findWorkRecord(state, record.id), eventId: event.id },
            display: { text: `${record.label} is complete, but its outputs need storage space.` },
        });
    }

    const added = [];
    for (const item of outputs) {
        const addResult = addItemToContainer(inventoryState, containerId, item, options.inventoryContext ?? {});
        if (!addResult.ok) throw new Error(`Production storage preflight diverged: ${addResult.reason}`);
        added.push({ itemId: item.id, quantity: item.quantity });
    }

    record.data.pendingOutputs = [];
    record.data.outputsMaterialized = true;
    record.data.storageFailure = null;
    if (!record.data.proficiencyGranted) {
        gainWorkProficiency(state, record.data.proficiencyId, getProductionDefinition(record.data.processId).proficiencyGain, { sourceId: record.data.processId });
        record.data.proficiencyGranted = true;
    }
    const completedWork = markWorkCompleted(state, record.id, { outputsMaterialized: true, pendingOutputs: [], storageFailure: null });
    const event = emitSemanticEvent(state, 'production.completed', {
        workId: record.id,
        processId: record.data.processId,
        kind: record.data.processKind,
        outputs: added,
        inputItemIds: (record.data.inputItems ?? []).map((item) => item.id),
    }, { source: 'productionEngine' });

    return actionSuccess({
        action: 'production.resolve',
        code: 'production.completed',
        outcome: 'completed',
        data: { work: completedWork, outputs: added, eventId: event.id },
        display: { text: `Completed ${record.label}.` },
    });
}

function buildRuntimeOutput(state, record, definition, output) {
    const template = getProductionItem(output.itemId);
    if (!template) throw new Error(`${definition.id} references missing output ${output.itemId}.`);
    const sourceSummaries = (record.data.inputItems ?? []).map((item) => ({
        itemId: item.id,
        quantity: item.quantity,
        provenance: item.provenance ?? [],
    }));
    return {
        ...template,
        quantity: output.quantity,
        provenance: [{
            type: definition.kind === 'salvage' ? 'salvage' : 'crafting',
            sourceId: definition.id,
            placeId: record.data.startPlaceId ?? state.currentPlaceId ?? null,
            action: definition.kind === 'processing' ? 'process' : definition.kind === 'salvage' ? 'salvage' : 'craft',
            data: {
                workId: record.id,
                inputSources: sourceSummaries,
            },
        }],
    };
}

function findMissingInputs(inventoryState, containerId, inputs) {
    const blockers = [];
    for (const input of inputs) {
        const found = findItemInContainer(inventoryState, containerId, input.itemId);
        const available = found.ok ? Math.max(1, Number(found.item.quantity) || 1) : 0;
        if (available < input.quantity) {
            const name = getProductionInputItem(input.itemId)?.name ?? input.itemId;
            blockers.push(`Requires ${input.quantity} ${name}; ${available} available.`);
        }
    }
    return blockers;
}

function removeInputsAtomically(inventoryState, containerId, inputs) {
    const missing = findMissingInputs(inventoryState, containerId, inputs);
    if (missing.length) return { ok: false, reason: missing[0], items: [] };
    const removed = [];
    for (const input of inputs) {
        const result = removeItemQuantityFromContainer(inventoryState, containerId, input.itemId, input.quantity);
        if (!result.ok) {
            for (const item of removed) addItemToContainer(inventoryState, containerId, item);
            return { ok: false, reason: result.reason, items: [] };
        }
        removed.push(result.item);
    }
    return { ok: true, items: removed };
}

function preflightOutputStorage(inventoryState, containerId, outputs, context) {
    const clone = JSON.parse(JSON.stringify(inventoryState));
    for (const item of outputs) {
        const result = addItemToContainer(clone, containerId, item, context);
        if (!result.ok) return result;
    }
    return { ok: true };
}

function snapshotConsumedItem(item) {
    return {
        id: item.id,
        name: item.name,
        kind: item.kind,
        quantity: item.quantity,
        tags: [...(item.tags ?? [])],
        provenance: JSON.parse(JSON.stringify(item.provenance ?? [])),
        sinks: JSON.parse(JSON.stringify(item.sinks ?? [])),
    };
}

function failure(code, data, text) {
    return actionFailure({ action: 'production', code, outcome: 'blocked', data, display: { text } });
}
