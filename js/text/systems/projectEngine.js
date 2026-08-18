import { removeItemQuantityFromContainer } from './inventoryEngine.js';
import { actionFailure, actionSuccess } from './actionResult.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import {
    cancelTimedTask,
    findTimedTask,
    getTimedTaskProgress,
    reconcileTimedTasks,
    releaseTimedTask,
    startTimedTask,
    TIMED_TASK_STATUSES,
} from './timedTaskEngine.js';
import { ensureWorldTimeState } from './worldTimeEngine.js';

export const PROJECT_STATE_VERSION = 1;
export const PROJECT_STATUSES = Object.freeze({
    PLANNED: 'planned',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
});

export function createProjectState(options = {}) {
    return {
        version: PROJECT_STATE_VERSION,
        nextSequence: positiveInteger(options.nextSequence) ? options.nextSequence : 1,
        records: Array.isArray(options.records) ? options.records.map((record) => cloneProject(record)) : [],
    };
}

export function ensureProjectState(state) {
    if (!state || typeof state !== 'object') throw new Error('Projects require game state.');
    if (!state.projects || typeof state.projects !== 'object' || Array.isArray(state.projects)) {
        state.projects = createProjectState();
    }
    const issues = validateProjectState(state.projects);
    if (issues.length) throw new Error(issues.join(' '));
    return state.projects;
}

export function createProject(state, definition = {}) {
    const kind = normalizeStableId(definition.kind);
    const label = String(definition.label ?? kind).trim();
    const laborSeconds = Number(definition.laborSeconds);
    const materials = normalizeMaterialRequirements(definition.materials);
    const data = definition.data ?? {};

    if (!validKind(kind)) return failure('project.invalid-kind', { kind }, 'Project kind is required and must be a stable identifier.');
    if (!label) return failure('project.invalid-label', {}, 'Project label is required.');
    if (!positiveInteger(laborSeconds)) return failure('project.invalid-labor', { laborSeconds: definition.laborSeconds }, 'Project labor must be a positive whole number of seconds.');
    if (!materials.ok) return failure('project.invalid-materials', {}, materials.reason);
    if (!plainObject(data)) return failure('project.invalid-data', {}, 'Project data must be an object.');

    const projects = ensureProjectState(state);
    const sequence = projects.nextSequence++;
    const id = `project-${String(sequence).padStart(6, '0')}`;
    const now = ensureWorldTimeState(state).totalSeconds;
    const project = {
        id,
        version: PROJECT_STATE_VERSION,
        kind,
        label,
        status: PROJECT_STATUSES.PLANNED,
        materials: materials.records,
        laborSeconds,
        taskId: null,
        createdAtWorldSeconds: now,
        startedAtWorldSeconds: null,
        completedAtWorldSeconds: null,
        cancelledAtWorldSeconds: null,
        data: { ...data },
    };
    projects.records.push(project);

    const event = emitSemanticEvent(state, 'project.created', projectEventData(project), { source: 'projectEngine' });
    return actionSuccess({
        action: 'project.create',
        code: 'project.created',
        outcome: 'created',
        data: { project: snapshotProject(project), eventId: event.id },
        display: { text: `Created project ${project.label}.` },
    });
}

export function contributeProjectMaterial(state, projectId, itemQuery, quantity = 1, options = {}) {
    const project = findProject(state, projectId);
    if (!project) return failure('project.not-found', { projectId }, `Unknown project: ${projectId}`);
    if (project.status !== PROJECT_STATUSES.PLANNED) {
        return failure('project.not-planned', { project: snapshotProject(project) }, `${project.label} is ${project.status}; materials can only be contributed before labor begins.`);
    }

    const normalizedQuery = normalizeStableId(itemQuery);
    const requirement = project.materials.find((entry) => entry.itemId === normalizedQuery || normalizeStableId(entry.name) === normalizedQuery);
    if (!requirement) return failure('project.material-not-required', { itemQuery }, `${project.label} does not require ${itemQuery}.`);

    const remaining = Math.max(0, requirement.quantityRequired - requirement.quantityContributed);
    if (remaining <= 0) return failure('project.material-complete', { itemId: requirement.itemId }, `${requirement.name} is already fully contributed.`);

    const requested = positiveInteger(Number(quantity)) ? Number(quantity) : 1;
    const amount = Math.min(requested, remaining);
    const inventoryState = state.player?.inventoryState ?? state.inventoryState;
    if (!inventoryState) return failure('project.no-inventory', {}, 'No inventory state is available for project materials.');
    const containerId = String(options.containerId ?? 'inventory');
    const removed = removeItemQuantityFromContainer(inventoryState, containerId, itemQuery, amount);
    if (!removed.ok) return failure('project.material-unavailable', { itemQuery, amount, containerId }, removed.reason);

    requirement.quantityContributed += amount;
    const event = emitSemanticEvent(state, 'project.material-contributed', {
        projectId: project.id,
        itemId: requirement.itemId,
        quantity: amount,
        quantityContributed: requirement.quantityContributed,
        quantityRequired: requirement.quantityRequired,
        containerId,
    }, { source: 'projectEngine' });

    return actionSuccess({
        action: 'project.contribute-material',
        code: 'project.material-contributed',
        outcome: 'progressed',
        data: { project: snapshotProject(project), item: removed.item, eventId: event.id },
        display: { text: `Contributed ${amount} ${requirement.name} to ${project.label}.` },
    });
}

export function startProjectLabor(state, projectId) {
    const project = findProject(state, projectId);
    if (!project) return failure('project.not-found', { projectId }, `Unknown project: ${projectId}`);
    if (project.status !== PROJECT_STATUSES.PLANNED) {
        return failure('project.not-planned', { project: snapshotProject(project) }, `${project.label} is ${project.status}.`);
    }
    const missing = project.materials.filter((entry) => entry.quantityContributed < entry.quantityRequired);
    if (missing.length) {
        return failure('project.materials-incomplete', {
            projectId: project.id,
            missing: missing.map((entry) => ({
                itemId: entry.itemId,
                quantityMissing: entry.quantityRequired - entry.quantityContributed,
            })),
        }, `${project.label} is missing required materials.`);
    }

    const taskResult = startTimedTask(state, {
        kind: 'project.labor',
        label: project.label,
        channel: `project:${project.id}`,
        durationSeconds: project.laborSeconds,
        data: { projectId: project.id, projectKind: project.kind },
    });
    if (!taskResult.ok) return taskResult;

    project.status = PROJECT_STATUSES.ACTIVE;
    project.taskId = taskResult.data.task.id;
    project.startedAtWorldSeconds = taskResult.data.task.startedAtWorldSeconds;
    const event = emitSemanticEvent(state, 'project.started', projectEventData(project), { source: 'projectEngine' });
    return actionSuccess({
        action: 'project.start',
        code: 'project.started',
        outcome: 'started',
        data: { project: snapshotProject(project), task: taskResult.data.task, eventId: event.id },
        display: { text: `Started labor on ${project.label}; ${project.laborSeconds}s required.` },
    });
}

export function reconcileProjects(state) {
    const projects = ensureProjectState(state);
    reconcileTimedTasks(state);
    const completed = [];

    for (const project of projects.records) {
        if (project.status !== PROJECT_STATUSES.ACTIVE || !project.taskId) continue;
        const task = findTimedTask(state, project.taskId);
        if (!task || task.status !== TIMED_TASK_STATUSES.COMPLETED) continue;
        project.status = PROJECT_STATUSES.COMPLETED;
        project.completedAtWorldSeconds = task.completedAtWorldSeconds;
        const event = emitSemanticEvent(state, 'project.completed', projectEventData(project), { source: 'projectEngine' });
        releaseProjectTask(state, project);
        completed.push({ project: snapshotProject(project), eventId: event.id });
    }

    return completed;
}

export function cancelProject(state, projectId) {
    const project = findProject(state, projectId);
    if (!project) return failure('project.not-found', { projectId }, `Unknown project: ${projectId}`);
    if ([PROJECT_STATUSES.COMPLETED, PROJECT_STATUSES.CANCELLED].includes(project.status)) {
        return failure('project.not-cancellable', { project: snapshotProject(project) }, `${project.label} is already ${project.status}.`);
    }

    if (project.taskId) {
        const task = findTimedTask(state, project.taskId);
        if (task?.status === TIMED_TASK_STATUSES.ACTIVE) cancelTimedTask(state, task.id);
    }
    project.status = PROJECT_STATUSES.CANCELLED;
    project.cancelledAtWorldSeconds = ensureWorldTimeState(state).totalSeconds;
    const event = emitSemanticEvent(state, 'project.cancelled', projectEventData(project), { source: 'projectEngine' });
    releaseProjectTask(state, project);
    return actionSuccess({
        action: 'project.cancel',
        code: 'project.cancelled',
        outcome: 'cancelled',
        data: { project: snapshotProject(project), eventId: event.id },
        display: { text: `Cancelled ${project.label}.` },
    });
}

export function getProjectProgress(state, projectId) {
    const project = findProject(state, projectId);
    if (!project) return null;
    const required = project.materials.reduce((sum, entry) => sum + entry.quantityRequired, 0);
    const contributed = project.materials.reduce((sum, entry) => sum + Math.min(entry.quantityRequired, entry.quantityContributed), 0);
    const materialsProgress = required ? contributed / required : 1;
    const taskProgress = project.taskId ? getTimedTaskProgress(state, project.taskId) : null;
    const laborProgress = project.status === PROJECT_STATUSES.COMPLETED ? 1 : (taskProgress?.progress ?? 0);
    return Object.freeze({
        projectId: project.id,
        status: project.status,
        materialsRequired: required,
        materialsContributed: contributed,
        materialsProgress,
        laborSeconds: project.laborSeconds,
        laborProgress,
        progress: (materialsProgress + laborProgress) / 2,
        taskId: project.taskId,
    });
}

export function findProject(state, projectId) {
    const id = String(projectId ?? '').trim();
    if (!id) return null;
    return ensureProjectState(state).records.find((project) => project.id === id) ?? null;
}

export function listProjects(state, options = {}) {
    const status = options.status ? String(options.status) : null;
    const kind = options.kind ? normalizeStableId(options.kind) : null;
    return ensureProjectState(state).records
        .filter((project) => (!status || project.status === status) && (!kind || project.kind === kind))
        .map(snapshotProject);
}

export function validateProjectState(projects) {
    if (!projects || typeof projects !== 'object' || Array.isArray(projects)) return ['projects must be an object.'];
    const issues = [];
    if (projects.version !== PROJECT_STATE_VERSION) issues.push(`projects.version must be ${PROJECT_STATE_VERSION}.`);
    if (!positiveInteger(projects.nextSequence)) issues.push('projects.nextSequence must be a positive integer.');
    if (!Array.isArray(projects.records)) return [...issues, 'projects.records must be an array.'];

    const ids = new Set();
    let maxSequence = 0;
    for (const [index, project] of projects.records.entries()) {
        const prefix = `projects.records[${index}]`;
        if (!plainObject(project)) {
            issues.push(`${prefix} must be an object.`);
            continue;
        }
        if (!/^project-\d{6,}$/.test(project.id ?? '')) issues.push(`${prefix}.id is invalid.`);
        if (ids.has(project.id)) issues.push(`${prefix}.id duplicates ${project.id}.`);
        ids.add(project.id);
        maxSequence = Math.max(maxSequence, Number.parseInt(String(project.id ?? '').replace('project-', ''), 10) || 0);
        if (project.version !== PROJECT_STATE_VERSION) issues.push(`${prefix}.version must be ${PROJECT_STATE_VERSION}.`);
        if (!validKind(project.kind)) issues.push(`${prefix}.kind is invalid.`);
        if (!Object.values(PROJECT_STATUSES).includes(project.status)) issues.push(`${prefix}.status is invalid.`);
        if (!positiveInteger(project.laborSeconds)) issues.push(`${prefix}.laborSeconds must be positive.`);
        if (!Array.isArray(project.materials)) issues.push(`${prefix}.materials must be an array.`);
        for (const [materialIndex, material] of (project.materials ?? []).entries()) {
            const materialPrefix = `${prefix}.materials[${materialIndex}]`;
            if (!plainObject(material)) {
                issues.push(`${materialPrefix} must be an object.`);
                continue;
            }
            if (!validKind(material.itemId)) issues.push(`${materialPrefix}.itemId is invalid.`);
            if (!positiveInteger(material.quantityRequired)) issues.push(`${materialPrefix}.quantityRequired must be positive.`);
            if (!nonNegativeInteger(material.quantityContributed)) issues.push(`${materialPrefix}.quantityContributed must be non-negative.`);
            if (Number.isInteger(material.quantityRequired) && Number.isInteger(material.quantityContributed)
                && material.quantityContributed > material.quantityRequired) issues.push(`${materialPrefix}.quantityContributed exceeds requirement.`);
        }
        if (!nonNegativeInteger(project.createdAtWorldSeconds)) issues.push(`${prefix}.createdAtWorldSeconds is invalid.`);
        if (!plainObject(project.data)) issues.push(`${prefix}.data must be an object.`);
    }
    if (projects.nextSequence <= maxSequence) issues.push('projects.nextSequence must be greater than stored project sequences.');
    return issues;
}

function normalizeMaterialRequirements(rawMaterials = []) {
    if (rawMaterials === null || rawMaterials === undefined) return { ok: true, records: [] };
    if (!Array.isArray(rawMaterials)) return { ok: false, reason: 'Project materials must be an array.' };
    const records = [];
    const seen = new Set();
    for (const entry of rawMaterials) {
        if (!plainObject(entry)) return { ok: false, reason: 'Each project material requirement must be an object.' };
        const itemId = normalizeStableId(entry.itemId ?? entry.id ?? entry.name);
        const quantityRequired = Number(entry.quantityRequired ?? entry.quantity ?? 1);
        if (!validKind(itemId)) return { ok: false, reason: `Invalid project material item id: ${entry.itemId ?? entry.id ?? entry.name}` };
        if (!positiveInteger(quantityRequired)) return { ok: false, reason: `Invalid material quantity for ${itemId}.` };
        if (seen.has(itemId)) return { ok: false, reason: `Duplicate project material requirement: ${itemId}.` };
        seen.add(itemId);
        records.push({
            itemId,
            name: String(entry.name ?? itemId),
            quantityRequired,
            quantityContributed: 0,
        });
    }
    return { ok: true, records };
}

function releaseProjectTask(state, project) {
    const task = findTimedTask(state, project?.taskId);
    if (!task || task.status === TIMED_TASK_STATUSES.ACTIVE) return false;
    const released = releaseTimedTask(state, task.id);
    if (!released.ok) throw new Error(`Terminal project task ${task.id} could not be released: ${released.code}`);
    return true;
}

function snapshotProject(project) {
    return Object.freeze({
        ...project,
        materials: Object.freeze(project.materials.map((entry) => Object.freeze({ ...entry }))),
        data: Object.freeze({ ...project.data }),
    });
}

function cloneProject(project) {
    return {
        ...project,
        materials: Array.isArray(project?.materials) ? project.materials.map((entry) => ({ ...entry })) : [],
        data: plainObject(project?.data) ? { ...project.data } : {},
    };
}

function projectEventData(project) {
    return {
        projectId: project.id,
        kind: project.kind,
        label: project.label,
        status: project.status,
        laborSeconds: project.laborSeconds,
        taskId: project.taskId,
        createdAtWorldSeconds: project.createdAtWorldSeconds,
        startedAtWorldSeconds: project.startedAtWorldSeconds,
        completedAtWorldSeconds: project.completedAtWorldSeconds,
        cancelledAtWorldSeconds: project.cancelledAtWorldSeconds,
        materials: project.materials.map((entry) => ({ ...entry })),
        data: { ...project.data },
    };
}

function failure(code, data, text) {
    return actionFailure({ action: 'project', code, outcome: 'rejected', data, display: { text } });
}
function normalizeStableId(value) {
    return String(value ?? '').trim().toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9.-]+/g, '-').replace(/^-+|-+$/g, '');
}
function validKind(value) { return /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(value); }
function positiveInteger(value) { return Number.isInteger(value) && value > 0; }
function nonNegativeInteger(value) { return Number.isInteger(value) && value >= 0; }
function plainObject(value) { return Boolean(value && typeof value === 'object' && !Array.isArray(value)); }
