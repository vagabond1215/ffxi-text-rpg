import { VERSION } from '../version.js';
import { validateAbilityRuntimeState } from './abilityEngine.js';
import { validateCapabilityState } from './capabilityEngine.js';
import { validateCommitmentState } from './commitmentEngine.js';
import { validateEcologyState } from './ecologyEngine.js';
import { validatePartyState } from './partyEngine.js';
import { validateProjectState } from './projectEngine.js';
import { validateRelationshipState } from './relationshipEngine.js';
import { validateResourceOpportunityState } from './resourceOpportunityEngine.js';
import { validateSimulationControlState } from './simulationControlEngine.js';
import { validateTimedTaskState } from './timedTaskEngine.js';
import { TRAVEL_KINDS, validateActiveTravel } from './transportEngine.js';
import { validateInventoryState } from './validation.js';
import { validateWorldTimeState } from './worldTimeEngine.js';

const REQUIRED_OBJECT_FIELDS = Object.freeze([
    'worldTime',
    'simulation',
    'tasks',
    'abilities',
    'party',
    'projects',
    'commitments',
    'relationships',
    'resourceOpportunities',
    'ecology',
    'position',
    'atlas',
    'discoveredPois',
    'player',
    'flags',
    'events',
]);

const REQUIRED_ARRAY_FIELDS = Object.freeze(['npcs', 'enemies', 'log']);

const REQUIRED_PLAYER_OBJECT_FIELDS = Object.freeze([
    'identity',
    'jobs',
    'progression',
    'wallet',
    'equipment',
    'inventoryState',
    'combat',
    'resources',
    'flags',
]);

const REQUIRED_PLAYER_ARRAY_FIELDS = Object.freeze(['inventory', 'keyItems', 'statuses']);

export function validateCurrentGameStateStructure(state, options = {}) {
    const issues = [];
    if (!isObject(state)) return ['state must be an object.'];

    if (state.version !== VERSION.gameState) {
        issues.push(`version must be current Game State ${VERSION.gameState}.`);
    }

    for (const field of REQUIRED_OBJECT_FIELDS) {
        if (!isObject(state[field])) issues.push(`${field} must be a persisted object.`);
    }
    for (const field of REQUIRED_ARRAY_FIELDS) {
        if (!Array.isArray(state[field])) issues.push(`${field} must be a persisted array.`);
    }

    if (isObject(state.worldTime)) issues.push(...validateWorldTimeState(state.worldTime));
    if (isObject(state.simulation)) issues.push(...validateSimulationControlState(state.simulation));
    if (isObject(state.tasks)) issues.push(...validateTimedTaskState(state.tasks));
    if (isObject(state.abilities)) issues.push(...validateAbilityRuntimeState(state.abilities));
    if (isObject(state.party)) issues.push(...validatePartyState(state.party));
    if (isObject(state.projects)) issues.push(...validateProjectState(state.projects));
    if (isObject(state.commitments)) issues.push(...validateCommitmentState(state.commitments));
    if (isObject(state.relationships)) issues.push(...validateRelationshipState(state.relationships));
    if (isObject(state.resourceOpportunities)) issues.push(...validateResourceOpportunityState(state.resourceOpportunities));
    if (isObject(state.ecology)) issues.push(...validateEcologyState(state.ecology));

    if (typeof state.currentPlaceId !== 'string' || !state.currentPlaceId.trim()) issues.push('currentPlaceId must be a persisted non-empty string.');
    if (typeof state.location !== 'string' || !state.location.trim()) issues.push('location must be a persisted non-empty string.');
    if (state.travel !== null && !isObject(state.travel)) issues.push('travel must be persisted as null or an object.');
    if (isObject(state.travel)) issues.push(...validateCurrentActiveTravel(state));
    issues.push(...validateCurrentTaskOwnerLinks(state));
    if (!Number.isInteger(state.combatSequence) || state.combatSequence < 0) issues.push('combatSequence must be a persisted non-negative integer.');
    if (state.activeBattle !== null && !isObject(state.activeBattle)) issues.push('activeBattle must be persisted as null or an object.');

    if (isObject(state.player)) {
        for (const field of REQUIRED_PLAYER_OBJECT_FIELDS) {
            if (!isObject(state.player[field])) issues.push(`player.${field} must be a persisted object.`);
        }
        for (const field of REQUIRED_PLAYER_ARRAY_FIELDS) {
            if (!Array.isArray(state.player[field])) issues.push(`player.${field} must be a persisted array.`);
        }
        if (isObject(state.player.inventoryState)) {
            issues.push(...validateInventoryState(state.player.inventoryState).map((issue) => `player.inventoryState.${issue}`));
        }
        if (isObject(state.player.progression)) {
            if (!isObject(state.player.progression.capabilities)) {
                issues.push('player.progression.capabilities must be a persisted object.');
            } else {
                issues.push(...validateCapabilityState(state.player).map((issue) => `player.${issue}`));
            }
        }
    }

    if (options.requireMeta === true) {
        if (!isObject(state.meta)) {
            issues.push('meta must be a persisted object.');
        } else {
            if (typeof state.meta.characterId !== 'string' || !state.meta.characterId.trim()) issues.push('meta.characterId must be a persisted non-empty string.');
            if (typeof state.meta.updatedAt !== 'string' || !state.meta.updatedAt.trim()) issues.push('meta.updatedAt must be a persisted non-empty string.');
        }
    }

    return issues;
}

function validateCurrentActiveTravel(state) {
    const travel = state.travel;
    const issues = validateActiveTravel(travel);
    if (issues.length) return issues;

    const task = findPersistedTask(state, travel.taskId);
    if (!task) return [`travel.taskId ${travel.taskId} must reference a persisted timed task.`];

    const expectedKind = travel.kind === TRAVEL_KINDS.SCHEDULED ? 'transport.journey' : 'travel.route';
    if (task.kind !== expectedKind) issues.push(`travel.taskId ${travel.taskId} must reference ${expectedKind}.`);
    if (task.channel !== 'travel') issues.push(`travel.taskId ${travel.taskId} must use the travel task channel.`);
    if (!activeOwnerTaskStatus(task.status)) issues.push(`travel.taskId ${travel.taskId} must be active or completed until travel reconciliation.`);
    if (task.data?.from !== travel.from || task.data?.to !== travel.to) issues.push(`travel.taskId ${travel.taskId} endpoints must match active travel.`);
    if (task.completesAtWorldSeconds !== travel.arriveAtWorldSeconds) issues.push(`travel.taskId ${travel.taskId} completion time must match travel arrival.`);
    return issues;
}

function validateCurrentTaskOwnerLinks(state) {
    const issues = [];

    for (const project of state.projects?.records ?? []) {
        if (project?.status !== 'active') continue;
        issues.push(...validateOwnerTask(state, {
            path: `project ${project.id}`,
            taskId: project.taskId,
            kind: 'project.labor',
            channel: `project:${project.id}`,
            data: { projectId: project.id },
        }));
    }

    for (const work of state.work?.records ?? []) {
        if (work?.status !== 'active') continue;
        issues.push(...validateOwnerTask(state, {
            path: `work ${work.id}`,
            taskId: work.taskId,
            kind: `work.${work.kind}`,
            channel: work.channel,
            data: { workId: work.id },
        }));
    }

    const activation = state.abilities?.active;
    if (isObject(activation)) {
        issues.push(...validateOwnerTask(state, {
            path: `ability ${activation.abilityId}`,
            taskId: activation.taskId,
            kind: 'ability.activation',
            channel: 'ability',
            data: { abilityId: activation.abilityId },
        }));
    }

    for (const opportunity of state.resourceOpportunities?.records ?? []) {
        for (const action of opportunity?.actions ?? []) {
            if (action?.status !== 'active') continue;
            issues.push(...validateOwnerTask(state, {
                path: `resource recovery ${opportunity.id}/${action.id}`,
                taskId: action.taskId,
                kind: 'resource.recovery',
                channel: `resource:${opportunity.id}`,
                data: { opportunityId: opportunity.id, actionId: action.id },
            }));
        }
    }

    return issues;
}

function validateOwnerTask(state, expected) {
    if (typeof expected.taskId !== 'string' || !expected.taskId.trim()) return [`${expected.path} must reference a persisted timed task.`];
    const task = findPersistedTask(state, expected.taskId);
    if (!task) return [`${expected.path} taskId ${expected.taskId} must reference a persisted timed task.`];

    const issues = [];
    if (task.kind !== expected.kind) issues.push(`${expected.path} task ${expected.taskId} must have kind ${expected.kind}.`);
    if (task.channel !== expected.channel) issues.push(`${expected.path} task ${expected.taskId} must use channel ${expected.channel}.`);
    if (!activeOwnerTaskStatus(task.status)) issues.push(`${expected.path} task ${expected.taskId} must be active or completed until owner reconciliation.`);
    for (const [key, value] of Object.entries(expected.data ?? {})) {
        if (task.data?.[key] !== value) issues.push(`${expected.path} task ${expected.taskId} must match ${key}.`);
    }
    return issues;
}

function findPersistedTask(state, taskId) {
    return Array.isArray(state.tasks?.records)
        ? state.tasks.records.find((record) => record?.id === taskId) ?? null
        : null;
}

function activeOwnerTaskStatus(status) {
    return status === 'active' || status === 'completed';
}

function isObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
