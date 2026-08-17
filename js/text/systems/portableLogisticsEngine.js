import { getPortableLogisticsDefinition, listPortableLogisticsDefinitions } from '../data/portableLogistics.js';
import { getContainerDefinition } from '../data/inventoryContainers.js';
import { getPlace } from '../data/places.js';
import { actionFailure, actionSuccess } from './actionResult.js';
import { getHomePlaceId, isAtHomePlace } from './homeInfrastructureEngine.js';
import { getContainerCapacity, unlockInventoryContainer } from './inventoryEngine.js';
import {
    contributeProjectMaterial,
    createProject,
    ensureProjectState,
    findProject,
    getProjectProgress,
    listProjects,
    PROJECT_STATUSES,
    reconcileProjects,
    startProjectLabor,
} from './projectEngine.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import { ensureWorldTimeState } from './worldTimeEngine.js';

export const PORTABLE_LOGISTICS_VERSION = 1;
export const DEFAULT_PORTABLE_LOGISTICS_ID = 'field-satchel';

export function beginPortableLogisticsProject(state, logisticsId = DEFAULT_PORTABLE_LOGISTICS_ID) {
    const definition = getPortableLogisticsDefinition(logisticsId);
    if (!definition) return failure('portable.unknown-project', `Unknown field-logistics project: ${logisticsId}.`);
    if (!isAtHomePlace(state)) return failure('portable.away', `Return to ${homePlaceName(state)} before laying out the field kit.`);

    const container = state.player?.inventoryState?.containers?.[definition.benefit.containerId];
    if (container?.unlocked) return failure('portable.already-unlocked', `${definition.benefit.containerName} is already ready for the road.`);

    const existing = findPortableLogisticsProject(state, definition.id);
    if (existing && existing.status !== PROJECT_STATUSES.CANCELLED) {
        return failure('portable.project-exists', `${definition.benefit.containerName} is already ${playerStatus(existing.status)}.`);
    }

    return createProject(state, {
        kind: definition.projectKind,
        label: definition.name,
        laborSeconds: definition.laborSeconds,
        materials: definition.materials.map((material) => ({ ...material })),
        data: {
            portableLogisticsId: definition.id,
            homePlaceId: getHomePlaceId(state),
            containerId: definition.benefit.containerId,
            completionApplied: false,
        },
    });
}

export function contributePortableLogisticsMaterial(state, projectId, itemId, quantity = 1) {
    const project = findProject(state, projectId);
    if (!project || !project.data?.portableLogisticsId) return failure('portable.project-not-found', 'That field-logistics project is no longer available.');
    if (!isAtHomePlace(state)) return failure('portable.away', `Return to ${homePlaceName(state)} before setting aside materials.`);
    return contributeProjectMaterial(state, project.id, itemId, quantity, { containerId: 'inventory' });
}

export function startPortableLogisticsLabor(state, projectId) {
    const project = findProject(state, projectId);
    if (!project || !project.data?.portableLogisticsId) return failure('portable.project-not-found', 'That field-logistics project is no longer available.');
    if (!isAtHomePlace(state)) return failure('portable.away', `Return to ${homePlaceName(state)} before fitting the field kit.`);
    const result = startProjectLabor(state, project.id);
    if (!result.ok) return result;
    return actionSuccess({
        action: 'portable.logistics.start-labor',
        code: 'portable.labor-started',
        outcome: 'started',
        data: result.data,
        display: { text: `${project.label} is underway. The fitting will take ${formatDuration(project.laborSeconds)} of your time.` },
    });
}

export function reconcilePortableLogisticsProjects(state) {
    reconcileProjects(state);
    const projects = ensureProjectState(state);
    const applied = [];

    for (const project of projects.records) {
        if (project.status !== PROJECT_STATUSES.COMPLETED || project.data?.completionApplied === true) continue;
        const definition = getPortableLogisticsDefinition(project.data?.portableLogisticsId);
        if (!definition || definition.projectKind !== project.kind) continue;

        const unlock = unlockInventoryContainer(state, definition.benefit.containerId);
        if (!unlock.ok) continue;
        project.data.completionApplied = true;
        project.data.completionAppliedAtWorldSeconds = ensureWorldTimeState(state).totalSeconds;
        const event = emitSemanticEvent(state, 'portable.logistics-completed', {
            projectId: project.id,
            portableLogisticsId: definition.id,
            homePlaceId: project.data.homePlaceId ?? getHomePlaceId(state),
            containerId: definition.benefit.containerId,
            portableSlots: unlock.capacity,
            alreadyUnlocked: unlock.alreadyUnlocked,
        }, { source: 'portableLogisticsEngine' });
        applied.push(Object.freeze({
            projectId: project.id,
            logisticsId: definition.id,
            containerId: definition.benefit.containerId,
            portableSlots: unlock.capacity,
            alreadyUnlocked: unlock.alreadyUnlocked,
            eventId: event.id,
        }));
    }
    return Object.freeze(applied);
}

export function findPortableLogisticsProject(state, logisticsId = DEFAULT_PORTABLE_LOGISTICS_ID) {
    return listProjects(state)
        .filter((project) => project.data?.portableLogisticsId === logisticsId)
        .sort((a, b) => b.createdAtWorldSeconds - a.createdAtWorldSeconds || b.id.localeCompare(a.id))[0] ?? null;
}

export function createPortableLogisticsModel(state) {
    if (!state?.player) return emptyModel();
    const definitions = listPortableLogisticsDefinitions();
    const atHome = isAtHomePlace(state);
    const entries = [];
    const actions = [];

    for (const definition of definitions) {
        const project = findPortableLogisticsProject(state, definition.id);
        const materials = buildMaterialState(state, definition, project);
        const entry = createOpportunity(state, definition, project, materials, atHome);
        entries.push(entry);
        if (entry.action) actions.push(entry.action);
    }

    return Object.freeze({
        version: PORTABLE_LOGISTICS_VERSION,
        available: Boolean(getHomePlaceId(state)),
        homePlaceId: getHomePlaceId(state),
        homePlaceName: homePlaceName(state),
        atHome,
        entries: Object.freeze(entries),
        actions: Object.freeze(actions),
    });
}

export function decoratePortableLogisticsOpportunityModel(state, baseModel) {
    if (!baseModel) return baseModel;
    const portable = createPortableLogisticsModel(state);
    if (!portable.available || !portable.entries.length) return baseModel;
    const ids = new Set(portable.entries.map((entry) => entry.id));
    const entries = [...(baseModel.entries ?? []).filter((entry) => !ids.has(entry.id)), ...portable.entries];
    const groups = [...(baseModel.groups ?? []).filter((group) => group.id !== 'field-logistics'), createGroup(portable.entries, portable.atHome)];
    const active = portable.entries.find((entry) => ['active', 'ready'].includes(entry.status) && entry.action);
    return Object.freeze({
        ...baseModel,
        version: Math.max(Number(baseModel.version) || 0, 11),
        portableLogisticsVersion: PORTABLE_LOGISTICS_VERSION,
        recommendedOpportunityId: active?.id ?? baseModel.recommendedOpportunityId,
        entries: Object.freeze(entries),
        groups: Object.freeze(groups),
    });
}

export function validatePortableLogisticsState(state) {
    const issues = [];
    const projects = ensureProjectState(state);
    for (const project of projects.records) {
        const logisticsId = project.data?.portableLogisticsId;
        if (!logisticsId) continue;
        const definition = getPortableLogisticsDefinition(logisticsId);
        if (!definition) issues.push(`${project.id} references unknown portable logistics project ${logisticsId}.`);
        else if (definition.projectKind !== project.kind) issues.push(`${project.id} kind does not match ${logisticsId}.`);
        if (!project.data?.homePlaceId) issues.push(`${project.id} is missing its homePlaceId.`);
        if (definition && project.data?.containerId !== definition.benefit.containerId) issues.push(`${project.id} container does not match ${logisticsId}.`);
        if (project.status === PROJECT_STATUSES.COMPLETED && project.data?.completionApplied === true) {
            const containerId = definition?.benefit?.containerId;
            if (containerId && !state.player?.inventoryState?.containers?.[containerId]?.unlocked) {
                issues.push(`${project.id} says its portable benefit was applied but ${containerId} remains locked.`);
            }
        }
    }
    return issues;
}

function buildMaterialState(state, definition, project) {
    return definition.materials.map((material) => {
        const requirement = project?.materials?.find((entry) => entry.itemId === material.itemId);
        const contributed = requirement?.quantityContributed ?? 0;
        const required = requirement?.quantityRequired ?? material.quantity;
        const carried = carriedQuantity(state, material.itemId);
        return Object.freeze({
            itemId: material.itemId,
            name: material.name,
            required,
            contributed,
            carried,
            missing: Math.max(0, required - contributed),
            met: contributed >= required,
        });
    });
}

function createOpportunity(state, definition, project, materials, atHome) {
    const homeName = homePlaceName(state);
    const container = state.player?.inventoryState?.containers?.[definition.benefit.containerId];
    const unlocked = Boolean(container?.unlocked);
    const effectiveProject = project?.status === PROJECT_STATUSES.CANCELLED ? null : project;
    const completed = unlocked || effectiveProject?.status === PROJECT_STATUSES.COMPLETED;
    const active = effectiveProject?.status === PROJECT_STATUSES.ACTIVE;
    const allMaterials = effectiveProject && materials.every((entry) => entry.met);
    const firstMissing = effectiveProject ? materials.find((entry) => !entry.met) : null;

    let status = atHome ? 'ready' : 'available';
    let summary = definition.description;
    let progress = definition.benefitSummary;
    let blockers = [];
    let action = null;

    if (completed) {
        status = 'complete';
        summary = `${definition.benefit.containerName} is fitted and ready for travel.`;
        progress = `${getContainerCapacity(state.player.inventoryState, definition.benefit.containerId)} portable slots available. Its contents remain part of your carried load.`;
    } else if (!effectiveProject) {
        if (atHome) action = portableAction(`portable:${definition.id}:begin`, `Plan · ${definition.benefit.containerName}`, 'portable.logistics.begin', { logisticsId: definition.id });
        else progress = `Return to ${homeName} to lay out the work. ${definition.benefitSummary}`;
    } else if (active) {
        status = 'active';
        const projectProgress = getProjectProgress(state, effectiveProject.id);
        progress = `${formatPercent(projectProgress?.laborProgress)} of the hands-on fitting is finished.`;
        summary = `${definition.benefit.containerName} is taking shape.`;
        action = portableAction(`portable:${definition.id}:finish`, `Finish · ${definition.benefit.containerName}`, 'activity.advanceToCompletion', {});
    } else if (allMaterials) {
        if (atHome) {
            status = 'ready';
            progress = `All materials are set aside. The remaining cost is ${formatDuration(definition.laborSeconds)} of your labor.`;
            action = portableAction(`portable:${definition.id}:start`, `Start work · ${formatDuration(definition.laborSeconds)}`, 'portable.logistics.start', { projectId: effectiveProject.id });
        } else {
            progress = `All materials are set aside. Return to ${homeName} to do the fitting.`;
        }
    } else if (firstMissing) {
        const canContribute = atHome && firstMissing.carried > 0;
        status = canContribute ? 'ready' : atHome ? 'blocked' : 'available';
        const amount = Math.min(firstMissing.missing, firstMissing.carried);
        progress = `${materials.map((entry) => `${entry.contributed}/${entry.required} ${entry.name}`).join(' · ')}. Benefit: ${definition.benefitSummary}`;
        if (canContribute) {
            action = portableAction(`portable:${definition.id}:contribute:${firstMissing.itemId}`, `Set aside ${amount} ${firstMissing.name}`, 'portable.logistics.contribute', {
                projectId: effectiveProject.id,
                itemId: firstMissing.itemId,
                quantity: amount,
            });
        } else if (atHome) blockers = [`Bring ${firstMissing.missing} more ${firstMissing.name} home.`];
    }

    return opportunity({
        id: `portable-logistics-${definition.id}`,
        category: 'preparation',
        title: definition.name,
        summary,
        motivation: definition.motivation,
        progress,
        status,
        requirements: [
            requirement(`Return to ${homeName}`, atHome || active || completed),
            ...materials.map((material) => requirement(`Set aside ${material.required} ${material.name}`, completed || material.met)),
            requirement(`${formatDuration(definition.laborSeconds)} of hands-on work`, completed),
        ],
        blockers,
        action,
        regionLabel: getPlace(getHomePlaceId(state))?.region ?? null,
        groupKind: 'field-logistics',
    });
}

function createGroup(entries, current) {
    const statuses = { active: 0, ready: 0, available: 0, blocked: 0, complete: 0 };
    for (const entry of entries) if (Object.hasOwn(statuses, entry.status)) statuses[entry.status] += 1;
    return Object.freeze({
        id: 'field-logistics',
        kind: 'field-logistics',
        label: 'Field Logistics',
        current,
        entries: Object.freeze([...entries]),
        activeCount: statuses.active,
        readyCount: statuses.ready,
        availableCount: statuses.available,
        blockedCount: statuses.blocked,
        completeCount: statuses.complete,
    });
}

function carriedQuantity(state, itemId) {
    return (state.player?.inventoryState?.containers?.inventory?.items ?? [])
        .filter((item) => item.id === itemId)
        .reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
}

function homePlaceName(state) {
    const id = getHomePlaceId(state);
    return getPlace(id)?.name ?? 'your lodging';
}

function portableAction(id, label, intent, payload) {
    return Object.freeze({ id, label, intent, payload: Object.freeze({ ...(payload ?? {}) }) });
}

function opportunity({ id, category, title, summary, motivation, progress, status, requirements, blockers, action, regionLabel, groupKind }) {
    return Object.freeze({
        id, category, title, summary, motivation, progress, status,
        reason: 'A durable field kit can turn crafted regional materials into more portable preparation space.',
        requirements: Object.freeze(requirements),
        blockers: Object.freeze(blockers),
        action,
        regionLabel,
        groupKind,
    });
}

function requirement(label, met) { return Object.freeze({ label, met: Boolean(met) }); }
function playerStatus(status) { return status === PROJECT_STATUSES.ACTIVE ? 'underway' : status === PROJECT_STATUSES.COMPLETED ? 'complete' : 'planned'; }
function formatDuration(seconds) { const minutes = Math.max(1, Math.round((Number(seconds) || 0) / 60)); return minutes >= 60 && minutes % 60 === 0 ? `${minutes / 60}h` : `${minutes}m`; }
function formatPercent(value) { return `${Math.round(Math.max(0, Math.min(1, Number(value) || 0)) * 100)}%`; }
function emptyModel() { return Object.freeze({ version: PORTABLE_LOGISTICS_VERSION, available: false, homePlaceId: null, homePlaceName: '', atHome: false, entries: Object.freeze([]), actions: Object.freeze([]) }); }
function failure(code, text) { return actionFailure({ action: 'portable.logistics', code, outcome: 'blocked', display: { text } }); }
