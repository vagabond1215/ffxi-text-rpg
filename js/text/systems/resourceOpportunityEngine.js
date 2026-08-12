import { getLootTable } from '../data/lootTables.js';
import { addItemToContainer } from './inventoryEngine.js';
import { actionFailure, actionSuccess } from './actionResult.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import {
    findTimedTask,
    reconcileTimedTasks,
    startTimedTask,
    TIMED_TASK_STATUSES,
} from './timedTaskEngine.js';
import { ensureWorldTimeState } from './worldTimeEngine.js';

export const RESOURCE_OPPORTUNITY_STATE_VERSION = 1;
export const RESOURCE_OPPORTUNITY_STATUSES = Object.freeze({
    AVAILABLE: 'available',
    EXHAUSTED: 'exhausted',
});
export const RESOURCE_RECOVERY_STATUSES = Object.freeze({
    AVAILABLE: 'available',
    ACTIVE: 'active',
    COMPLETED: 'completed',
});

export const RESOURCE_RECOVERY_ACTION_DEFINITIONS = Object.freeze({
    search: actionDefinition('search', 15, [], null, 0, 0),
    skin: actionDefinition('skin', 90, ['cutting'], 'fieldDressing', 0, 0.15),
    butcher: actionDefinition('butcher', 120, ['cutting'], 'fieldDressing', 0, 0.1),
    pluck: actionDefinition('pluck', 75, [], 'fieldDressing', 0, 0.1),
    extract: actionDefinition('extract', 105, ['cutting'], 'fieldDressing', 0, 0.1),
    salvage: actionDefinition('salvage', 120, ['salvage'], 'salvage', 0, 0.05),
});

export function createResourceOpportunityState(options = {}) {
    return {
        version: RESOURCE_OPPORTUNITY_STATE_VERSION,
        nextSequence: positiveInteger(options.nextSequence) ? options.nextSequence : 1,
        records: Array.isArray(options.records) ? options.records.map(cloneOpportunity) : [],
    };
}

export function ensureResourceOpportunityState(state) {
    if (!state || typeof state !== 'object') throw new Error('Resource opportunities require game state.');
    if (!state.resourceOpportunities || typeof state.resourceOpportunities !== 'object' || Array.isArray(state.resourceOpportunities)) {
        state.resourceOpportunities = createResourceOpportunityState();
    }
    const issues = validateResourceOpportunityState(state.resourceOpportunities);
    if (issues.length) throw new Error(issues.join(' '));
    return state.resourceOpportunities;
}

export function createDefeatedEnemyResourceOpportunity(state, enemy, options = {}) {
    if (!enemy || typeof enemy !== 'object') return failure('resource.invalid-enemy', {}, 'A defeated enemy record is required.');
    const table = getLootTable(enemy.lootTableId);
    if (!table?.drops?.length) return null;

    const sourceEnemyId = String(enemy.sourceEnemyId ?? enemy.id ?? '').replace(/-encounter-.+$/, '');
    const ecosystem = enemy.identity?.ecosystem ?? enemy.ecosystem ?? 'neutral';
    const family = enemy.identity?.family ?? enemy.family ?? 'unknown';
    const type = inferOpportunityType(ecosystem, family);
    const recoveryActions = Array.from(new Set(table.drops.map((drop) => inferRecoveryAction(drop, ecosystem, family))));
    const registry = ensureResourceOpportunityState(state);
    const sequence = registry.nextSequence++;
    const id = `resource-${String(sequence).padStart(6, '0')}`;
    const createdAtWorldSeconds = ensureWorldTimeState(state).totalSeconds;
    const condition = clampNumber(options.condition ?? 1, 0, 1);
    const opportunity = {
        id,
        version: RESOURCE_OPPORTUNITY_STATE_VERSION,
        type,
        status: RESOURCE_OPPORTUNITY_STATUSES.AVAILABLE,
        sourceEnemyId,
        sourceName: enemy.identity?.name ?? sourceEnemyId,
        family,
        ecosystem,
        placeId: options.placeId ?? state.currentPlaceId ?? null,
        battleId: options.battleId ?? null,
        condition,
        createdAtWorldSeconds,
        exhaustedAtWorldSeconds: null,
        actions: recoveryActions.map((actionId) => createRecoveryActionState(actionId)),
        outputs: table.drops.map((drop) => ({
            itemId: drop.id,
            name: drop.name,
            kind: drop.kind,
            quantity: drop.quantity,
            valueGil: drop.valueGil,
            tags: [...drop.tags],
            chance: drop.chance,
            recoveryAction: inferRecoveryAction(drop, ecosystem, family),
        })),
    };
    registry.records.push(opportunity);

    const event = emitSemanticEvent(state, 'resource.opportunity-created', opportunityEventData(opportunity), { source: 'resourceOpportunityEngine' });
    return actionSuccess({
        action: 'resource.opportunity-create',
        code: 'resource.opportunity-created',
        outcome: 'created',
        data: { opportunity: snapshotOpportunity(opportunity), eventId: event.id },
        display: { text: `${opportunity.sourceName} leaves a recoverable ${type} opportunity.` },
    });
}

export function startResourceRecovery(state, opportunityId, actionId, options = {}) {
    const opportunity = findResourceOpportunity(state, opportunityId);
    if (!opportunity) return failure('resource.not-found', { opportunityId }, `Unknown resource opportunity: ${opportunityId}`);
    if (opportunity.status !== RESOURCE_OPPORTUNITY_STATUSES.AVAILABLE) {
        return failure('resource.exhausted', { opportunityId }, `${opportunity.sourceName} has no remaining recoverable resources.`);
    }
    const action = opportunity.actions.find((candidate) => candidate.id === normalizeActionId(actionId));
    if (!action) return failure('resource.action-unsupported', { opportunityId, actionId }, `${opportunity.sourceName} does not support recovery action: ${actionId}.`);
    if (action.status !== RESOURCE_RECOVERY_STATUSES.AVAILABLE) {
        return failure('resource.action-unavailable', { opportunityId, actionId, status: action.status }, `${action.id} is already ${action.status}.`);
    }

    const definition = RESOURCE_RECOVERY_ACTION_DEFINITIONS[action.id];
    const toolTags = new Set((options.toolTags ?? []).map(String));
    const missingTools = definition.requiredToolTags.filter((tag) => !toolTags.has(tag));
    if (missingTools.length) {
        return failure('resource.tool-required', { opportunityId, actionId: action.id, missingTools }, `${action.id} requires tool capability: ${missingTools.join(', ')}.`);
    }
    const proficiency = Number(options.proficiencies?.[definition.proficiencyId] ?? 0);
    if (definition.proficiencyId && proficiency < definition.minProficiency) {
        return failure('resource.proficiency-required', {
            opportunityId,
            actionId: action.id,
            proficiencyId: definition.proficiencyId,
            required: definition.minProficiency,
            actual: proficiency,
        }, `${action.id} requires ${definition.proficiencyId} proficiency ${definition.minProficiency}.`);
    }
    if (opportunity.condition < definition.minCondition) {
        return failure('resource.condition-too-poor', { opportunityId, actionId: action.id, condition: opportunity.condition }, `${opportunity.sourceName} is in too poor a condition for ${action.id}.`);
    }

    const durationSeconds = Math.max(1, Math.ceil(definition.durationSeconds * conditionDurationMultiplier(opportunity.condition)));
    const task = startTimedTask(state, {
        kind: 'resource.recovery',
        label: `${action.id} ${opportunity.sourceName}`,
        channel: `resource:${opportunity.id}`,
        durationSeconds,
        data: {
            opportunityId: opportunity.id,
            actionId: action.id,
            sourceEnemyId: opportunity.sourceEnemyId,
        },
    });
    if (!task.ok) return task;

    action.status = RESOURCE_RECOVERY_STATUSES.ACTIVE;
    action.taskId = task.data.task.id;
    action.startedAtWorldSeconds = task.data.task.startedAtWorldSeconds;
    const event = emitSemanticEvent(state, 'resource.recovery-started', {
        opportunityId: opportunity.id,
        actionId: action.id,
        taskId: action.taskId,
        durationSeconds,
        condition: opportunity.condition,
        requiredToolTags: [...definition.requiredToolTags],
        proficiencyId: definition.proficiencyId,
    }, { source: 'resourceOpportunityEngine' });

    return actionSuccess({
        action: 'resource.recovery-start',
        code: 'resource.recovery-started',
        outcome: 'started',
        data: { opportunity: snapshotOpportunity(opportunity), task: task.data.task, eventId: event.id },
        display: { text: `Started ${action.id} on ${opportunity.sourceName}; ${durationSeconds}s required.` },
    });
}

export function reconcileResourceRecoveries(state, options = {}) {
    const registry = ensureResourceOpportunityState(state);
    reconcileTimedTasks(state);
    const rng = options.rng ?? Math.random;
    const completed = [];

    for (const opportunity of registry.records) {
        if (opportunity.status !== RESOURCE_OPPORTUNITY_STATUSES.AVAILABLE) continue;
        for (const action of opportunity.actions) {
            if (action.status !== RESOURCE_RECOVERY_STATUSES.ACTIVE || !action.taskId) continue;
            const task = findTimedTask(state, action.taskId);
            if (!task || task.status !== TIMED_TASK_STATUSES.COMPLETED) continue;

            const recovery = resolveRecoveryOutputs(state, opportunity, action.id, rng, options.containerId ?? 'inventory');
            action.status = RESOURCE_RECOVERY_STATUSES.COMPLETED;
            action.completedAtWorldSeconds = task.completedAtWorldSeconds;
            const event = emitSemanticEvent(state, 'resource.recovery-completed', {
                opportunityId: opportunity.id,
                actionId: action.id,
                taskId: action.taskId,
                completedAtWorldSeconds: action.completedAtWorldSeconds,
                recoveredItemIds: recovery.items.map((item) => item.id),
                failedItemIds: recovery.failedItems.map((entry) => entry.item.id),
            }, { source: 'resourceOpportunityEngine' });
            completed.push({
                opportunityId: opportunity.id,
                actionId: action.id,
                completedAtWorldSeconds: action.completedAtWorldSeconds,
                items: recovery.items,
                failedItems: recovery.failedItems,
                eventId: event.id,
            });
        }

        if (opportunity.actions.every((action) => action.status === RESOURCE_RECOVERY_STATUSES.COMPLETED)) {
            opportunity.status = RESOURCE_OPPORTUNITY_STATUSES.EXHAUSTED;
            opportunity.exhaustedAtWorldSeconds = Math.max(...opportunity.actions.map((action) => action.completedAtWorldSeconds ?? opportunity.createdAtWorldSeconds));
            emitSemanticEvent(state, 'resource.opportunity-exhausted', opportunityEventData(opportunity), { source: 'resourceOpportunityEngine' });
        }
    }

    return completed;
}

export function findResourceOpportunity(state, opportunityId) {
    const id = String(opportunityId ?? '').trim();
    if (!id) return null;
    return ensureResourceOpportunityState(state).records.find((record) => record.id === id) ?? null;
}

export function listResourceOpportunities(state, options = {}) {
    const status = options.status ? String(options.status) : null;
    const placeId = options.placeId ? String(options.placeId) : null;
    return ensureResourceOpportunityState(state).records
        .filter((record) => (!status || record.status === status) && (!placeId || record.placeId === placeId))
        .map(snapshotOpportunity);
}

export function describeResourceOpportunities(state, options = {}) {
    const records = listResourceOpportunities(state, { status: options.status ?? RESOURCE_OPPORTUNITY_STATUSES.AVAILABLE, placeId: options.placeId ?? state.currentPlaceId });
    if (!records.length) return 'No recoverable resource opportunities are available here.';
    return [
        'Recoverable resources:',
        ...records.map((record) => {
            const actions = record.actions.map((action) => `${action.id}:${action.status}`).join(', ');
            return `- ${record.id} ${record.sourceName} [${record.type}, condition ${Math.round(record.condition * 100)}%] actions: ${actions}`;
        }),
    ].join('\n');
}

export function validateResourceOpportunityState(registry) {
    if (!registry || typeof registry !== 'object' || Array.isArray(registry)) return ['resourceOpportunities must be an object.'];
    const issues = [];
    if (registry.version !== RESOURCE_OPPORTUNITY_STATE_VERSION) issues.push(`resourceOpportunities.version must be ${RESOURCE_OPPORTUNITY_STATE_VERSION}.`);
    if (!positiveInteger(registry.nextSequence)) issues.push('resourceOpportunities.nextSequence must be a positive integer.');
    if (!Array.isArray(registry.records)) return [...issues, 'resourceOpportunities.records must be an array.'];

    const ids = new Set();
    let maxSequence = 0;
    for (const [index, record] of registry.records.entries()) {
        const prefix = `resourceOpportunities.records[${index}]`;
        if (!plainObject(record)) {
            issues.push(`${prefix} must be an object.`);
            continue;
        }
        if (!/^resource-\d{6,}$/.test(record.id ?? '')) issues.push(`${prefix}.id is invalid.`);
        if (ids.has(record.id)) issues.push(`${prefix}.id duplicates ${record.id}.`);
        ids.add(record.id);
        maxSequence = Math.max(maxSequence, Number.parseInt(String(record.id ?? '').replace('resource-', ''), 10) || 0);
        if (!Object.values(RESOURCE_OPPORTUNITY_STATUSES).includes(record.status)) issues.push(`${prefix}.status is invalid.`);
        if (!Number.isFinite(record.condition) || record.condition < 0 || record.condition > 1) issues.push(`${prefix}.condition must be between 0 and 1.`);
        if (!Array.isArray(record.actions) || !record.actions.length) issues.push(`${prefix}.actions must be a non-empty array.`);
        if (!Array.isArray(record.outputs)) issues.push(`${prefix}.outputs must be an array.`);
        for (const [actionIndex, action] of (record.actions ?? []).entries()) {
            const actionPrefix = `${prefix}.actions[${actionIndex}]`;
            if (!RESOURCE_RECOVERY_ACTION_DEFINITIONS[action?.id]) issues.push(`${actionPrefix}.id is unknown.`);
            if (!Object.values(RESOURCE_RECOVERY_STATUSES).includes(action?.status)) issues.push(`${actionPrefix}.status is invalid.`);
        }
    }
    if (registry.nextSequence <= maxSequence) issues.push('resourceOpportunities.nextSequence must be greater than stored resource sequences.');
    return issues;
}

function resolveRecoveryOutputs(state, opportunity, actionId, rng, containerId) {
    const inventoryState = state.player?.inventoryState ?? state.inventoryState;
    const items = [];
    const failedItems = [];
    if (!inventoryState) return { items, failedItems };

    for (const output of opportunity.outputs.filter((entry) => entry.recoveryAction === actionId)) {
        if (rng() >= output.chance) continue;
        const item = {
            id: output.itemId,
            name: output.name,
            kind: output.kind,
            quantity: output.quantity,
            valueGil: output.valueGil,
            tags: [...output.tags],
            provenance: [{
                type: provenanceTypeForOpportunity(opportunity.type),
                sourceId: opportunity.sourceEnemyId,
                placeId: opportunity.placeId,
                action: actionId,
                data: { opportunityId: opportunity.id, condition: opportunity.condition },
            }],
            sinks: [{ type: 'trade' }],
        };
        const result = addItemToContainer(inventoryState, containerId, item);
        if (result.ok) items.push(result.item);
        else failedItems.push({ item, reason: result.reason });
    }
    return { items, failedItems };
}

function inferOpportunityType(ecosystem, family) {
    if (family === 'construct' || ecosystem === 'construct') return 'salvage';
    if (ecosystem === 'raider' || ecosystem === 'humanoid') return 'carriedInventory';
    return 'body';
}

function inferRecoveryAction(drop, ecosystem, family) {
    if (family === 'construct' || ecosystem === 'construct') return 'salvage';
    if (ecosystem === 'raider' || ecosystem === 'humanoid') return 'search';
    if ((drop.tags ?? []).includes('hide')) return 'skin';
    if ((drop.tags ?? []).includes('feather')) return 'pluck';
    if (ecosystem === 'plantoid') return 'extract';
    if (ecosystem === 'vermiform') return 'extract';
    if ((drop.id ?? '').includes('wing')) return 'extract';
    return 'butcher';
}

function provenanceTypeForOpportunity(type) {
    if (type === 'carriedInventory') return 'carriedInventory';
    if (type === 'salvage') return 'salvage';
    return 'body';
}

function createRecoveryActionState(actionId) {
    const definition = RESOURCE_RECOVERY_ACTION_DEFINITIONS[actionId];
    return {
        id: actionId,
        status: RESOURCE_RECOVERY_STATUSES.AVAILABLE,
        taskId: null,
        startedAtWorldSeconds: null,
        completedAtWorldSeconds: null,
        durationSeconds: definition.durationSeconds,
        requiredToolTags: [...definition.requiredToolTags],
        proficiencyId: definition.proficiencyId,
        minProficiency: definition.minProficiency,
        minCondition: definition.minCondition,
    };
}

function actionDefinition(id, durationSeconds, requiredToolTags, proficiencyId, minProficiency, minCondition) {
    return Object.freeze({ id, durationSeconds, requiredToolTags: Object.freeze(requiredToolTags), proficiencyId, minProficiency, minCondition });
}

function opportunityEventData(opportunity) {
    return {
        opportunityId: opportunity.id,
        type: opportunity.type,
        status: opportunity.status,
        sourceEnemyId: opportunity.sourceEnemyId,
        sourceName: opportunity.sourceName,
        family: opportunity.family,
        ecosystem: opportunity.ecosystem,
        placeId: opportunity.placeId,
        battleId: opportunity.battleId,
        condition: opportunity.condition,
        createdAtWorldSeconds: opportunity.createdAtWorldSeconds,
        exhaustedAtWorldSeconds: opportunity.exhaustedAtWorldSeconds,
        actions: opportunity.actions.map((action) => ({ id: action.id, status: action.status, taskId: action.taskId })),
    };
}

function snapshotOpportunity(opportunity) {
    return Object.freeze({
        ...opportunity,
        actions: Object.freeze(opportunity.actions.map((action) => Object.freeze({ ...action, requiredToolTags: Object.freeze([...action.requiredToolTags]) }))),
        outputs: Object.freeze(opportunity.outputs.map((output) => Object.freeze({ ...output, tags: Object.freeze([...output.tags]) }))),
    });
}

function cloneOpportunity(opportunity) {
    return {
        ...opportunity,
        actions: Array.isArray(opportunity?.actions) ? opportunity.actions.map((action) => ({ ...action, requiredToolTags: [...(action.requiredToolTags ?? [])] })) : [],
        outputs: Array.isArray(opportunity?.outputs) ? opportunity.outputs.map((output) => ({ ...output, tags: [...(output.tags ?? [])] })) : [],
    };
}

function conditionDurationMultiplier(condition) {
    return 1 + Math.max(0, 1 - condition) * 0.5;
}

function normalizeActionId(value) {
    return String(value ?? '').trim().toLowerCase();
}
function clampNumber(value, min, max) { return Math.max(min, Math.min(max, Number(value) || 0)); }
function positiveInteger(value) { return Number.isInteger(value) && value > 0; }
function plainObject(value) { return Boolean(value && typeof value === 'object' && !Array.isArray(value)); }
function failure(code, data, text) {
    return actionFailure({ action: 'resource', code, outcome: 'rejected', data, display: { text } });
}
