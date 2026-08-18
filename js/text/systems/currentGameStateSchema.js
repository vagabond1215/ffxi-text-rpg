import { VERSION } from '../version.js';
import { TRAVEL_KINDS, validateActiveTravel } from './transportEngine.js';

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

    if (typeof state.currentPlaceId !== 'string' || !state.currentPlaceId.trim()) issues.push('currentPlaceId must be a persisted non-empty string.');
    if (typeof state.location !== 'string' || !state.location.trim()) issues.push('location must be a persisted non-empty string.');
    if (state.travel !== null && !isObject(state.travel)) issues.push('travel must be persisted as null or an object.');
    if (isObject(state.travel)) issues.push(...validateCurrentActiveTravel(state));
    if (!Number.isInteger(state.combatSequence) || state.combatSequence < 0) issues.push('combatSequence must be a persisted non-negative integer.');
    if (state.activeBattle !== null && !isObject(state.activeBattle)) issues.push('activeBattle must be persisted as null or an object.');

    if (isObject(state.player)) {
        for (const field of REQUIRED_PLAYER_OBJECT_FIELDS) {
            if (!isObject(state.player[field])) issues.push(`player.${field} must be a persisted object.`);
        }
        for (const field of REQUIRED_PLAYER_ARRAY_FIELDS) {
            if (!Array.isArray(state.player[field])) issues.push(`player.${field} must be a persisted array.`);
        }
        if (isObject(state.player.progression) && !isObject(state.player.progression.capabilities)) {
            issues.push('player.progression.capabilities must be a persisted object.');
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

    const task = Array.isArray(state.tasks?.records)
        ? state.tasks.records.find((record) => record?.id === travel.taskId)
        : null;
    if (!task) return [`travel.taskId ${travel.taskId} must reference a persisted timed task.`];

    const expectedKind = travel.kind === TRAVEL_KINDS.SCHEDULED ? 'transport.journey' : 'travel.route';
    if (task.kind !== expectedKind) issues.push(`travel.taskId ${travel.taskId} must reference ${expectedKind}.`);
    if (task.channel !== 'travel') issues.push(`travel.taskId ${travel.taskId} must use the travel task channel.`);
    if (!['active', 'completed'].includes(task.status)) issues.push(`travel.taskId ${travel.taskId} must be active or completed until travel reconciliation.`);
    if (task.data?.from !== travel.from || task.data?.to !== travel.to) issues.push(`travel.taskId ${travel.taskId} endpoints must match active travel.`);
    if (task.completesAtWorldSeconds !== travel.arriveAtWorldSeconds) issues.push(`travel.taskId ${travel.taskId} completion time must match travel arrival.`);
    return issues;
}

function isObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
