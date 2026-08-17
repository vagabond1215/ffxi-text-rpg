import { getHomeInfrastructureDefinition, listHomeInfrastructureDefinitions } from '../data/homeInfrastructure.js';
import { getFurniture, calculateFurnitureStorageCapacity } from '../data/mogHouseFurniture.js';
import { getPlace } from '../data/places.js';
import { actionFailure, actionSuccess } from './actionResult.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
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
import { ensureWorldTimeState } from './worldTimeEngine.js';

export const HOME_INFRASTRUCTURE_VERSION = 1;
export const DEFAULT_HOME_IMPROVEMENT_ID = 'storage-chest';

export function getHomePlaceId(state) {
    return state?.player?.progression?.unlockedHomePoints?.[0] ?? null;
}

export function isAtHomePlace(state) {
    const homePlaceId = getHomePlaceId(state);
    return Boolean(homePlaceId && state?.currentPlaceId === homePlaceId);
}

export function beginHomeInfrastructureProject(state, improvementId = DEFAULT_HOME_IMPROVEMENT_ID) {
    const definition = getHomeInfrastructureDefinition(improvementId);
    if (!definition) return failure('home.unknown-improvement', `Unknown home improvement: ${improvementId}`);
    if (!isAtHomePlace(state)) return failure('home.away', `Return to ${homePlaceName(state)} before beginning work on your lodging.`);

    const existing = findHomeInfrastructureProject(state, definition.id);
    if (existing && existing.status !== PROJECT_STATUSES.CANCELLED) {
        return failure('home.project-exists', `${definition.name.replace(/^Build a /, '')} is already ${playerStatus(existing.status)}.`);
    }

    return createProject(state, {
        kind: definition.projectKind,
        label: definition.name,
        laborSeconds: definition.laborSeconds,
        materials: definition.materials.map((material) => ({
            itemId: material.itemId,
            name: material.name,
            quantity: material.quantity,
        })),
        data: {
            homeInfrastructureId: definition.id,
            homePlaceId: getHomePlaceId(state),
            furnitureId: definition.benefit.furnitureId,
            completionApplied: false,
        },
    });
}

export function contributeHomeInfrastructureMaterial(state, projectId, itemId, quantity = 1) {
    const project = findProject(state, projectId);
    if (!project || !project.data?.homeInfrastructureId) return failure('home.project-not-found', 'That home improvement is no longer available.');
    if (!isAtHomePlace(state)) return failure('home.away', `Return to ${homePlaceName(state)} before adding construction materials.`);
    return contributeProjectMaterial(state, project.id, itemId, quantity, { containerId: 'inventory' });
}

export function startHomeInfrastructureLabor(state, projectId) {
    const project = findProject(state, projectId);
    if (!project || !project.data?.homeInfrastructureId) return failure('home.project-not-found', 'That home improvement is no longer available.');
    if (!isAtHomePlace(state)) return failure('home.away', `Return to ${homePlaceName(state)} before starting the work.`);
    const result = startProjectLabor(state, project.id);
    if (!result.ok) return result;
    return actionSuccess({
        action: 'home.infrastructure.start-labor',
        code: 'home.labor-started',
        outcome: 'started',
        data: result.data,
        display: { text: `${project.label} is underway. The work will take ${formatDuration(project.laborSeconds)} of your time.` },
    });
}

export function reconcileHomeInfrastructureProjects(state) {
    reconcileProjects(state);
    const projects = ensureProjectState(state);
    const applied = [];
    const placedFurniture = state?.player?.inventoryState?.mogHouse?.placedFurniture;
    if (!Array.isArray(placedFurniture)) return Object.freeze(applied);

    for (const project of projects.records) {
        if (project.status !== PROJECT_STATUSES.COMPLETED || project.data?.completionApplied === true) continue;
        const definition = getHomeInfrastructureDefinition(project.data?.homeInfrastructureId);
        if (!definition || definition.projectKind !== project.kind) continue;

        const furnitureId = definition.benefit.furnitureId;
        const alreadyPlaced = placedFurniture.includes(furnitureId);
        if (!alreadyPlaced) placedFurniture.push(furnitureId);
        project.data.completionApplied = true;
        project.data.completionAppliedAtWorldSeconds = ensureWorldTimeState(state).totalSeconds;

        const event = emitSemanticEvent(state, 'home.infrastructure-completed', {
            projectId: project.id,
            homeInfrastructureId: definition.id,
            homePlaceId: project.data.homePlaceId ?? getHomePlaceId(state),
            furnitureId,
            storageSlotsAdded: alreadyPlaced ? 0 : definition.benefit.storageSlots,
        }, { source: 'homeInfrastructureEngine' });
        applied.push(Object.freeze({
            projectId: project.id,
            improvementId: definition.id,
            furnitureId,
            storageSlotsAdded: alreadyPlaced ? 0 : definition.benefit.storageSlots,
            eventId: event.id,
        }));
    }
    return Object.freeze(applied);
}

export function findHomeInfrastructureProject(state, improvementId = DEFAULT_HOME_IMPROVEMENT_ID) {
    return listProjects(state)
        .filter((project) => project.data?.homeInfrastructureId === improvementId)
        .sort((a, b) => b.createdAtWorldSeconds - a.createdAtWorldSeconds || b.id.localeCompare(a.id))[0] ?? null;
}

export function createHomeInfrastructureModel(state) {
    const definition = getHomeInfrastructureDefinition(DEFAULT_HOME_IMPROVEMENT_ID);
    if (!state?.player || !definition) return Object.freeze({ version: HOME_INFRASTRUCTURE_VERSION, available: false, entries: Object.freeze([]), actions: Object.freeze([]) });
    const homePlaceId = getHomePlaceId(state);
    const atHome = isAtHomePlace(state);
    const project = findHomeInfrastructureProject(state, definition.id);
    const storageCapacity = calculateFurnitureStorageCapacity(state.player.inventoryState?.mogHouse?.placedFurniture ?? []);
    const materialState = definition.materials.map((material) => {
        const projectRequirement = project?.materials?.find((entry) => entry.itemId === material.itemId);
        const contributed = projectRequirement?.quantityContributed ?? 0;
        const required = projectRequirement?.quantityRequired ?? material.quantity;
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
    const actions = [];
    const opportunity = createHomeOpportunity(state, definition, project, materialState, { atHome, storageCapacity });
    if (opportunity.action) actions.push(opportunity.action);

    return Object.freeze({
        version: HOME_INFRASTRUCTURE_VERSION,
        available: Boolean(homePlaceId),
        homePlaceId,
        homePlaceName: homePlaceName(state),
        atHome,
        storageCapacity,
        placedFurniture: Object.freeze((state.player.inventoryState?.mogHouse?.placedFurniture ?? []).map((id) => {
            const furniture = getFurniture(id);
            return Object.freeze({ id, name: furniture?.name ?? id, storageSlots: furniture?.storageSlots ?? 0 });
        })),
        entries: Object.freeze([opportunity]),
        actions: Object.freeze(actions),
    });
}

export function decorateHomeInfrastructureOpportunityModel(state, baseModel) {
    if (!baseModel) return baseModel;
    const home = createHomeInfrastructureModel(state);
    if (!home.available || !home.entries.length) return baseModel;
    const entry = home.entries[0];
    const entries = [...(baseModel.entries ?? []).filter((candidate) => candidate.id !== entry.id), entry];
    const groups = [...(baseModel.groups ?? []).filter((group) => group.id !== 'home-foothold'), createHomeGroup(entry, home.atHome)];
    const shouldRecommend = entry.status === 'active' && Boolean(entry.action);
    return Object.freeze({
        ...baseModel,
        version: Math.max(Number(baseModel.version) || 0, 9),
        homeInfrastructureVersion: HOME_INFRASTRUCTURE_VERSION,
        recommendedOpportunityId: shouldRecommend ? entry.id : baseModel.recommendedOpportunityId,
        entries: Object.freeze(entries),
        groups: Object.freeze(groups),
    });
}

export function validateHomeInfrastructureState(state) {
    const issues = [];
    const projects = ensureProjectState(state);
    for (const project of projects.records) {
        const improvementId = project.data?.homeInfrastructureId;
        if (!improvementId) continue;
        const definition = getHomeInfrastructureDefinition(improvementId);
        if (!definition) issues.push(`${project.id} references unknown home improvement ${improvementId}.`);
        else if (definition.projectKind !== project.kind) issues.push(`${project.id} kind does not match ${improvementId}.`);
        if (!project.data?.homePlaceId) issues.push(`${project.id} is missing its homePlaceId.`);
        if (project.status === PROJECT_STATUSES.COMPLETED && project.data?.completionApplied === true) {
            const furnitureId = definition?.benefit?.furnitureId;
            if (furnitureId && !state.player?.inventoryState?.mogHouse?.placedFurniture?.includes(furnitureId)) {
                issues.push(`${project.id} says its completed furnishing was applied but the furnishing is absent.`);
            }
        }
    }
    return issues;
}

function createHomeOpportunity(state, definition, project, materials, { atHome, storageCapacity }) {
    const homeName = homePlaceName(state);
    const completed = project?.status === PROJECT_STATUSES.COMPLETED;
    const active = project?.status === PROJECT_STATUSES.ACTIVE;
    const cancelled = project?.status === PROJECT_STATUSES.CANCELLED;
    const effectiveProject = cancelled ? null : project;
    const allMaterials = effectiveProject && materials.every((entry) => entry.met);
    const firstMissing = effectiveProject ? materials.find((entry) => !entry.met) : null;
    const capacityAfter = storageCapacity + (completed ? 0 : definition.benefit.storageSlots);

    let status = atHome ? 'ready' : 'available';
    let summary = definition.description;
    let progress = `A ${definition.benefit.furnitureName} adds ${definition.benefit.storageSlots} home-storage slots.`;
    let blockers = [];
    let action = null;

    if (!effectiveProject) {
        if (atHome) action = homeAction(`home:${definition.id}:begin`, `Plan · ${definition.benefit.furnitureName}`, 'home.infrastructure.begin', { improvementId: definition.id });
        else progress = `Return to ${homeName} to lay out the work.`;
    } else if (completed) {
        status = 'complete';
        summary = `${definition.benefit.furnitureName} now stands in your lodging at ${homeName}.`;
        progress = `Furnishing storage capacity: ${storageCapacity} slots.`;
    } else if (active) {
        status = 'active';
        const projectProgress = getProjectProgress(state, effectiveProject.id);
        progress = `${formatPercent(projectProgress?.laborProgress)} of the hands-on work is finished.`;
        summary = `The materials are fitted and the ${definition.benefit.furnitureName.toLowerCase()} is taking shape.`;
        action = homeAction(`home:${definition.id}:finish`, `Finish · ${definition.benefit.furnitureName}`, 'activity.advanceToCompletion', {});
    } else if (allMaterials) {
        if (atHome) {
            status = 'ready';
            action = homeAction(`home:${definition.id}:start`, `Start work · ${formatDuration(definition.laborSeconds)}`, 'home.infrastructure.start', { projectId: effectiveProject.id });
            progress = `All materials are set aside. The remaining cost is ${formatDuration(definition.laborSeconds)} of your labor.`;
        } else {
            status = 'available';
            progress = `All materials are set aside. Return to ${homeName} to do the work.`;
        }
    } else if (firstMissing) {
        const canContribute = atHome && firstMissing.carried > 0;
        status = canContribute ? 'ready' : atHome ? 'blocked' : 'available';
        const amount = Math.min(firstMissing.missing, firstMissing.carried);
        progress = `${materials.map((entry) => `${entry.contributed}/${entry.required} ${entry.name}`).join(' · ')}. Finished capacity: ${capacityAfter} slots.`;
        if (canContribute) {
            action = homeAction(`home:${definition.id}:contribute:${firstMissing.itemId}`, `Set aside ${amount} ${firstMissing.name}`, 'home.infrastructure.contribute', {
                projectId: effectiveProject.id,
                itemId: firstMissing.itemId,
                quantity: amount,
            });
        } else if (atHome) {
            blockers = [`Bring ${firstMissing.missing} more ${firstMissing.name} home.`];
        }
    }

    return opportunity({
        id: `home-infrastructure-${definition.id}`,
        category: 'ambition',
        title: definition.name,
        summary,
        motivation: 'A better foothold lets useful materials stay behind, making preparation for the next journey less wasteful.',
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
        groupKind: 'home',
    });
}

function createHomeGroup(entry, current) {
    const statuses = { active: 0, ready: 0, available: 0, blocked: 0, complete: 0 };
    if (Object.hasOwn(statuses, entry.status)) statuses[entry.status] += 1;
    return Object.freeze({
        id: 'home-foothold',
        kind: 'home',
        label: 'Home & Foothold',
        current,
        entries: Object.freeze([entry]),
        activeCount: statuses.active,
        readyCount: statuses.ready,
        availableCount: statuses.available,
        blockedCount: statuses.blocked,
        completeCount: statuses.complete,
    });
}

function opportunity({ id, category, title, summary, motivation, progress, status, requirements = [], blockers = [], action = null, regionLabel = null, groupKind = null }) {
    return Object.freeze({
        id, category, title, summary, motivation, progress, status,
        reason: 'Your lodging can be improved with materials you carry and time you choose to spend.',
        requirements: Object.freeze(requirements),
        blockers: Object.freeze(blockers),
        action,
        regionLabel,
        groupKind,
    });
}

function requirement(label, met) {
    return Object.freeze({ label, met: Boolean(met) });
}

function homeAction(id, label, intent, payload) {
    return Object.freeze({ id, label, intent, payload: Object.freeze({ ...(payload ?? {}) }) });
}

function carriedQuantity(state, itemId) {
    return (state.player?.inventoryState?.containers?.inventory?.items ?? [])
        .filter((item) => item.id === itemId || item.templateId === itemId)
        .reduce((total, item) => total + (Number(item.quantity) || 1), 0);
}

function homePlaceName(state) {
    const homePlaceId = getHomePlaceId(state);
    return getPlace(homePlaceId)?.name ?? state?.player?.identity?.startingCity ?? 'your lodging';
}

function playerStatus(status) {
    if (status === PROJECT_STATUSES.PLANNED) return 'planned';
    if (status === PROJECT_STATUSES.ACTIVE) return 'underway';
    if (status === PROJECT_STATUSES.COMPLETED) return 'complete';
    return status;
}

function formatDuration(seconds) {
    const total = Math.max(0, Math.floor(Number(seconds) || 0));
    if (total >= 3600) {
        const hours = Math.floor(total / 3600);
        const minutes = Math.floor((total % 3600) / 60);
        return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    if (total >= 60) return `${Math.ceil(total / 60)}m`;
    return `${total}s`;
}

function formatPercent(value) {
    return `${Math.round(Math.max(0, Math.min(1, Number(value) || 0)) * 100)}%`;
}

function failure(code, text) {
    return actionFailure({ action: 'home.infrastructure', code, outcome: 'blocked', display: { text } });
}

export function describeHomeInfrastructure(state) {
    const model = createHomeInfrastructureModel(state);
    if (!model.available) return 'You do not yet have a settled foothold to improve.';
    const lines = [`Home & Foothold — ${model.homePlaceName}`, `Furnishing storage: ${model.storageCapacity} slots`];
    for (const entry of model.entries) lines.push(`${entry.title}: ${entry.summary} ${entry.progress}`);
    return lines.join('\n');
}

export function listHomeInfrastructureChoices() {
    return listHomeInfrastructureDefinitions();
}
