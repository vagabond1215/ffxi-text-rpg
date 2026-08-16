import { getCanonicalGatheringSource } from '../data/ecologyRegistry.js';
import { getEquipmentCatalogEntry } from '../data/equipmentCatalog.js';
import { getNation } from '../data/nations.js';
import { getPointOfInterest } from '../data/pointsOfInterest.js';
import { getPlace } from '../data/places.js';
import { getProductionDefinition } from '../data/productionCatalog.js';
import { checkGatheringWorkRequirements } from './gatheringWorkEngine.js';
import { findItemInContainer } from './inventoryEngine.js';
import { listLocalityDestinations } from './localityEngine.js';
import { hasDiscoveredPoi } from './poiEngine.js';
import { createPlayerExperienceModel, getOriginExperienceForState } from './playerExperienceEngine.js';
import { checkProductionRequirements } from './productionEngine.js';
import { findTravelRoute } from './travelEngine.js';
import { listWorkRecords, WORK_STATUSES } from './workTaskEngine.js';

export const PLAYER_OPPORTUNITY_VERSION = 3;
export const OPPORTUNITY_STATUSES = Object.freeze({
    READY: 'ready',
    BLOCKED: 'blocked',
    ACTIVE: 'active',
    COMPLETE: 'complete',
    AVAILABLE: 'available',
});

export function createPlayerOpportunityModel(state) {
    const experience = createPlayerExperienceModel(state);
    const origin = getOriginExperienceForState(state);
    const nation = getNation(origin.nationId);
    const destination = getPlace(origin.firstRegionalDestinationId);
    const source = getCanonicalGatheringSource(origin.livelihoodSourceId);
    const service = getPointOfInterest(origin.servicePoiId);
    const starterItemId = nation.startingEquipmentIds[0] ?? null;
    const starterItem = starterItemId ? getEquipmentCatalogEntry(starterItemId) : null;
    const starterEquipped = starterItemId ? isEquipped(state.player, starterItemId) : true;
    const starterCarried = starterItemId ? findItemInContainer(state.player.inventoryState, 'inventory', starterItemId).ok : true;
    const destinationVisited = Boolean(state.atlas?.[destination?.id]);
    const inDestination = state.currentPlaceId === destination?.id;
    const inStart = state.currentPlaceId === origin.startingPlaceId;
    const serviceDiscovered = service ? hasDiscoveredPoi(state, service.id) : false;

    if (!experience.guide.met) {
        const entry = freezeOpportunity({
            id: `orientation-${origin.nationId}`,
            category: 'orientation',
            title: `Meet ${origin.guideName}`,
            summary: `Your first useful contact can explain how people establish themselves in ${origin.nationName}.`,
            reason: 'A local contact turns an unfamiliar settlement into understandable choices without committing you to one path.',
            progress: `Knowledge of ${origin.nationName}, ${origin.regionalHorizon}, and the ways effort becomes persistent capability.`,
            status: OPPORTUNITY_STATUSES.READY,
            requirements: [requirement(`Be in ${getPlace(origin.startingPlaceId)?.name ?? origin.startingPlaceId}`, inStart)],
            action: experience.primaryAction,
        });
        return freezeModel(origin, [entry], entry.id);
    }

    const preparation = createPreparationOpportunity({ state, origin, starterItem, starterItemId, starterEquipped, starterCarried });
    const livelihood = createLivelihoodOpportunity({ state, origin, destination, source, starterItem, starterEquipped, inDestination });
    const training = createTrainingOpportunity({ state, origin, destination, inDestination });
    const exploration = createExplorationOpportunity({ state, origin, destination, destinationVisited, inDestination });
    const serviceOpportunity = createServiceOpportunity({ state, origin, service, serviceDiscovered, inStart });
    const entries = [preparation, livelihood, training, exploration, serviceOpportunity].filter(Boolean);
    const recommended = entries.find((entry) => entry.status === OPPORTUNITY_STATUSES.READY)
        ?? entries.find((entry) => entry.status === OPPORTUNITY_STATUSES.ACTIVE)
        ?? entries.find((entry) => entry.status === OPPORTUNITY_STATUSES.AVAILABLE)
        ?? null;
    return freezeModel(origin, entries, recommended?.id ?? null);
}

function createPreparationOpportunity({ state, origin, starterItem, starterItemId, starterEquipped, starterCarried }) {
    if (!starterItemId || !starterItem) return null;
    const inStart = state.currentPlaceId === origin.startingPlaceId;
    let status = OPPORTUNITY_STATUSES.COMPLETE;
    let nextAction = null;
    let summary = `${starterItem.name} is equipped and can satisfy field-tool requirements.`;
    let requirements = [requirement(`Equip ${starterItem.name}`, true)];

    if (!starterEquipped && starterCarried) {
        status = OPPORTUNITY_STATUSES.READY;
        summary = `You have the ${starterItem.name} from your newcomer field kit; equip it before relying on it in the field.`;
        requirements = [
            requirement(`Carry ${starterItem.name}`, true),
            requirement(`Equip ${starterItem.name}`, false),
        ];
        nextAction = action('equip-starter-tool', `Equip ${starterItem.name}`, 'equipment.equip', { itemId: starterItemId });
    } else if (!starterEquipped && !starterCarried && inStart) {
        status = OPPORTUNITY_STATUSES.READY;
        summary = `${origin.guideName} can issue the ${starterItem.name} reserved for your first field work.`;
        requirements = [
            requirement(`Meet ${origin.guideName}`, true),
            requirement(`Collect ${starterItem.name}`, false),
        ];
        nextAction = action('claim-starter-tool', `Collect ${starterItem.name}`, 'playerExperience.claimStarterKit');
    } else if (!starterEquipped && !starterCarried) {
        const returnStep = createTransitionStep(state, origin.startingPlaceId, {
            id: 'return-for-starter-tool',
            label: `Return for ${starterItem.name}`,
        });
        status = returnStep.status;
        summary = `Your newcomer field kit remains available from ${origin.guideName} in ${getPlace(origin.startingPlaceId)?.name ?? origin.nationName}.`;
        requirements = [
            requirement(`Return to ${getPlace(origin.startingPlaceId)?.name ?? origin.startingPlaceId}`, false),
            requirement(`Collect ${starterItem.name}`, false),
        ];
        nextAction = returnStep.action;
    }

    return freezeOpportunity({
        id: `prepare-${origin.nationId}`,
        category: 'preparation',
        title: starterEquipped ? `${starterItem.name} ready` : starterCarried ? `Ready your ${starterItem.name}` : `Collect your ${starterItem.name}`,
        summary,
        reason: 'Preparation changes what actions are actually available. Possession alone does not satisfy an equipped-tool requirement.',
        progress: 'A usable loadout opens livelihood and recovery actions without changing your permanent identity.',
        status,
        requirements,
        action: nextAction,
    });
}

function createLivelihoodOpportunity({ state, origin, destination, source, starterItem, starterEquipped, inDestination }) {
    if (!destination || !source) return null;
    if (origin.regionalLoop) {
        return createRegionalLoopLivelihood({ state, origin, destination, source, starterItem, starterEquipped, inDestination });
    }

    const activeWork = listWorkRecords(state, { kind: 'gathering', status: WORK_STATUSES.ACTIVE })
        .find((record) => record.data?.sourceId === source.id);
    const check = inDestination ? checkGatheringWorkRequirements(state, source.id) : null;
    let status = OPPORTUNITY_STATUSES.BLOCKED;
    let nextAction = null;
    let regionalRequirements = [];
    if (activeWork) {
        status = OPPORTUNITY_STATUSES.ACTIVE;
        nextAction = action('finish-first-gathering', `Finish · ${activeWork.label}`, 'activity.advanceToCompletion');
    } else if (!starterEquipped) status = OPPORTUNITY_STATUSES.BLOCKED;
    else if (!inDestination) {
        const step = createRegionalOutboundStep(state, origin, destination, 'livelihood');
        status = step.status;
        nextAction = step.action;
        regionalRequirements = step.requirements;
    } else if (check?.ok) {
        status = OPPORTUNITY_STATUSES.READY;
        nextAction = action('start-first-gathering', `${capitalize(source.action)} at ${source.name}`, 'gathering.start', { sourceId: source.id });
    }

    const blockers = check && !check.ok ? check.blockers : [];
    return freezeOpportunity({
        id: `livelihood-${origin.nationId}`,
        category: 'livelihood',
        title: `${capitalize(source.action)} at ${source.name}`,
        summary: `A real regional source in ${destination.name} produces material with physical provenance and builds ${source.proficiencyId} proficiency.`,
        reason: 'Livelihood is one route to capability: repeated work improves mastery and supplies material for trade or production.',
        progress: `${source.proficiencyId} proficiency, ${source.outputItemId} material, and practical familiarity with ${origin.regionalHorizon}.`,
        status,
        requirements: [
            requirement(`Equip ${starterItem?.name ?? 'the required field tool'}`, starterEquipped),
            ...regionalRequirements,
            requirement(`Reach ${destination.name}`, inDestination),
            ...source.requiredToolTags.map((tag) => requirement(`Tool capability: ${tag}`, starterEquipped && (starterItem?.tags ?? []).includes(tag))),
        ],
        blockers,
        action: nextAction,
    });
}

function createRegionalLoopLivelihood({ state, origin, destination, source, starterItem, starterEquipped, inDestination }) {
    const loop = origin.regionalLoop;
    const production = getProductionDefinition(loop.productionId);
    const workstation = getPointOfInterest(loop.workstationPoiId);
    const returnPlace = getPlace(loop.returnPlaceId);
    const resourceQuantity = inventoryQuantity(state, loop.targetResourceItemId);
    const outputQuantity = inventoryQuantity(state, loop.outputItemId);
    const activeWork = listWorkRecords(state, { status: WORK_STATUSES.ACTIVE })
        .find((record) => record.data?.sourceId === source.id || record.data?.processId === loop.productionId);

    if (outputQuantity > 0) {
        return freezeOpportunity({
            id: `livelihood-${origin.nationId}`,
            category: 'livelihood',
            title: 'Your first Redstone copper is smelted',
            summary: `You returned regional ore to ${returnPlace?.name ?? origin.nationName} and converted it into a provenance-bearing copper ingot through real timed production.`,
            reason: 'The loop matters because field work now feeds settlement production instead of ending at collection.',
            progress: loop.largerAmbition,
            status: OPPORTUNITY_STATUSES.COMPLETE,
            requirements: [
                requirement(`Gather ${loop.targetResourceQuantity} Redstone copper ore`, true),
                requirement(`Return to ${returnPlace?.name ?? loop.returnPlaceId}`, true),
                requirement(`Smelt copper at ${workstation?.name ?? 'a forge'}`, true),
            ],
            action: null,
        });
    }

    if (activeWork) {
        const isProduction = activeWork.data?.processId === loop.productionId;
        return freezeOpportunity({
            id: `livelihood-${origin.nationId}`,
            category: 'livelihood',
            title: isProduction ? `Finish ${production?.name ?? 'copper processing'}` : `Finish gathering at ${source.name}`,
            summary: isProduction
                ? 'The ore has already been consumed by the production authority; finishing the timed work will materialize the ingot exactly once.'
                : `The gathering task is active in ${destination.name}; completion will recover real material and increase ${source.proficiencyId} mastery.`,
            reason: 'Hands-on work owns fictional time. Completing it resolves the existing task rather than granting an instant tutorial reward.',
            progress: isProduction ? loop.largerAmbition : `${source.proficiencyId} proficiency and enough physical ore to justify a return trip.`,
            status: OPPORTUNITY_STATUSES.ACTIVE,
            requirements: [requirement(`Finish ${activeWork.label}`, false)],
            action: action(`finish-${activeWork.id}`, `Finish · ${activeWork.label}`, 'activity.advanceToCompletion'),
        });
    }

    if (!starterEquipped && resourceQuantity < loop.targetResourceQuantity) {
        return freezeOpportunity({
            id: `livelihood-${origin.nationId}`,
            category: 'livelihood',
            title: `Prepare for ${source.name}`,
            summary: `${source.name} is a real Redstone source, but the field tool must be equipped before mining can begin.`,
            reason: 'Preparation constrains practical work; the Journal does not bypass equipment requirements.',
            progress: `${source.proficiencyId} proficiency and regional copper once the tool is ready.`,
            status: OPPORTUNITY_STATUSES.BLOCKED,
            requirements: [requirement(`Equip ${starterItem?.name ?? 'the required field tool'}`, false)],
            action: null,
        });
    }

    if (resourceQuantity < loop.targetResourceQuantity) {
        const needed = loop.targetResourceQuantity - resourceQuantity;
        if (!inDestination) {
            const step = createRegionalOutboundStep(state, origin, destination, 'livelihood');
            return freezeOpportunity({
                id: `livelihood-${origin.nationId}`,
                category: 'livelihood',
                title: loop.title,
                summary: `Travel to ${destination.name} and recover ${needed} more copper ore from ${source.name}.`,
                reason: 'The first regional loop deliberately ties a settlement need to a real regional source and a real return route.',
                progress: `${source.proficiencyId} mastery, physical ore provenance, then settlement metalworking.`,
                status: step.status,
                requirements: [
                    requirement(`Equip ${starterItem?.name ?? 'the required field tool'}`, starterEquipped),
                    ...step.requirements,
                    requirement(`Gather ${loop.targetResourceQuantity} copper ore`, resourceQuantity >= loop.targetResourceQuantity),
                ],
                action: step.action,
            });
        }
        const check = checkGatheringWorkRequirements(state, source.id, { quantity: needed });
        return freezeOpportunity({
            id: `livelihood-${origin.nationId}`,
            category: 'livelihood',
            title: `Mine ${needed} copper ore at ${source.name}`,
            summary: `Recover the ore through canonical timed gathering in ${destination.name}; source capacity, tool requirements, proficiency, and provenance all remain authoritative.`,
            reason: 'Bringing enough ore home creates a reason for the return trip and a concrete processing step.',
            progress: `${source.proficiencyId} mastery now; metalworking mastery after the ore reaches a forge.`,
            status: check.ok ? OPPORTUNITY_STATUSES.READY : OPPORTUNITY_STATUSES.BLOCKED,
            requirements: [
                requirement(`Equip ${starterItem?.name ?? 'the required field tool'}`, starterEquipped),
                requirement(`Reach ${destination.name}`, true),
                requirement(`${needed} recoverable source unit${needed === 1 ? '' : 's'}`, check.ok),
            ],
            blockers: check.ok ? [] : check.blockers,
            action: check.ok ? action('gather-loop-copper', `Mine ${needed} copper ore`, 'gathering.start', { sourceId: source.id, quantity: needed }) : null,
        });
    }

    if (state.currentPlaceId !== loop.returnPlaceId) {
        const step = createTransitionStep(state, loop.returnPlaceId, {
            id: 'return-loop-copper',
            label: `Return to ${returnPlace?.name ?? loop.returnPlaceId}`,
        });
        return freezeOpportunity({
            id: `livelihood-${origin.nationId}`,
            category: 'livelihood',
            title: `Bring the copper back to ${returnPlace?.name ?? origin.nationName}`,
            summary: `You carry ${resourceQuantity} copper ore with physical Redstone provenance. The next useful step is to return it to a settlement forge.`,
            reason: 'Returning matters because settlements convert field gains into processing, trade, equipment, and larger plans.',
            progress: `${source.proficiencyId} mastery is already persistent; returning the ore makes metalworking progress possible.`,
            status: step.status,
            requirements: [
                requirement(`Carry ${loop.targetResourceQuantity} copper ore`, true),
                requirement(`Return to ${returnPlace?.name ?? loop.returnPlaceId}`, false),
            ],
            action: step.action,
        });
    }

    const productionCheck = checkProductionRequirements(state, production);
    if (productionCheck.ok) {
        return freezeOpportunity({
            id: `livelihood-${origin.nationId}`,
            category: 'livelihood',
            title: production?.name ?? 'Smelt Redstone copper',
            summary: `The ore, forge context, and production definition are all ready. Smelting consumes the ore at start and materializes the ingot only at completion.`,
            reason: 'Processing converts gathered material into a new capability-bearing economic input while preserving provenance.',
            progress: loop.largerAmbition,
            status: OPPORTUNITY_STATUSES.READY,
            requirements: [
                requirement(`Carry ${loop.targetResourceQuantity} copper ore`, true),
                requirement(`Use a forge`, true),
            ],
            action: action('start-loop-smelting', `Start · ${production?.name ?? 'Smelt copper'}`, 'production.start', { processId: loop.productionId }),
        });
    }

    const stationMissing = productionCheck.blockers.some((blocker) => blocker.startsWith('Requires workstation:'));
    if (stationMissing && workstation?.placeId === state.currentPlaceId) {
        return freezeOpportunity({
            id: `livelihood-${origin.nationId}`,
            category: 'livelihood',
            title: `Take the ore to ${workstation.name}`,
            summary: `${workstation.name} provides the forge context required by ${production?.name ?? 'copper processing'}; locality navigation can focus that real workshop without exposing internal coordinates.`,
            reason: 'Facilities matter as preparation. Production is available because the character is actually at a suitable workstation, not because the Journal grants one.',
            progress: loop.largerAmbition,
            status: OPPORTUNITY_STATUSES.READY,
            requirements: [
                requirement(`Carry ${loop.targetResourceQuantity} copper ore`, true),
                requirement(`Reach a forge`, false),
            ],
            blockers: productionCheck.blockers,
            action: action('visit-loop-forge', `Visit · ${workstation.name}`, 'locality.poi', { poiId: workstation.id, action: 'guild' }),
        });
    }

    return freezeOpportunity({
        id: `livelihood-${origin.nationId}`,
        category: 'livelihood',
        title: production?.name ?? 'Process the returned material',
        summary: 'The regional material is home, but a real production requirement still blocks the next step.',
        reason: 'The Journal reports canonical blockers instead of silently bypassing them.',
        progress: loop.largerAmbition,
        status: OPPORTUNITY_STATUSES.BLOCKED,
        requirements: [requirement(`Carry ${loop.targetResourceQuantity} copper ore`, true)],
        blockers: productionCheck.blockers,
        action: null,
    });
}

function createTrainingOpportunity({ state, origin, destination, inDestination }) {
    if (!destination) return null;
    const activeBattle = state.activeBattle?.phase === 'active';
    let status = activeBattle ? OPPORTUNITY_STATUSES.ACTIVE : OPPORTUNITY_STATUSES.AVAILABLE;
    let nextAction = null;
    let regionalRequirements = [];
    if (!activeBattle && inDestination) {
        const present = destination.spawnRules.some((rule) => rule.enemyId === origin.trainingEnemyId);
        status = present ? OPPORTUNITY_STATUSES.READY : OPPORTUNITY_STATUSES.BLOCKED;
        if (present) nextAction = action('begin-field-training', 'Seek a manageable field encounter', 'combat.encounter', { enemyId: origin.trainingEnemyId });
    } else if (!activeBattle && !inDestination) {
        const step = createRegionalOutboundStep(state, origin, destination, 'training');
        status = step.status;
        nextAction = step.action;
        regionalRequirements = step.requirements;
    }
    return freezeOpportunity({
        id: `training-${origin.nationId}`,
        category: 'training',
        title: 'Practice against a manageable field threat',
        summary: `${destination.name} contains low-danger encounters suitable for learning how combat readiness, recovery, skills, and discipline training interact.`,
        reason: 'Combat effort can improve weapon or magic proficiency and discipline experience, but preparation and recovery still constrain action.',
        progress: 'Combat skill practice, discipline experience, and familiarity with field danger.',
        status,
        requirements: [...regionalRequirements, requirement(`Reach ${destination.name}`, inDestination)],
        action: nextAction,
    });
}

function createExplorationOpportunity({ state, origin, destination, destinationVisited, inDestination }) {
    if (!destination) return null;
    let status = destinationVisited ? OPPORTUNITY_STATUSES.COMPLETE : OPPORTUNITY_STATUSES.AVAILABLE;
    let nextAction = null;
    let regionalRequirements = [];
    if (inDestination) status = destinationVisited ? OPPORTUNITY_STATUSES.COMPLETE : OPPORTUNITY_STATUSES.ACTIVE;
    else {
        const step = createRegionalOutboundStep(state, origin, destination, 'exploration');
        status = destinationVisited && step.status === OPPORTUNITY_STATUSES.READY ? OPPORTUNITY_STATUSES.AVAILABLE : step.status;
        nextAction = step.action;
        regionalRequirements = step.requirements;
    }
    return freezeOpportunity({
        id: `exploration-${origin.nationId}`,
        category: 'exploration',
        title: `Reach ${destination.name}`,
        summary: `Move from safe locality navigation into discovery-based exploration in ${origin.regionalHorizon}.`,
        reason: 'Travel and exploration expand acquired knowledge and expose resources, encounters, and routes rather than revealing the authored world in advance.',
        progress: `Atlas knowledge, regional access, and a practical route between ${origin.nationName} and ${destination.name}.`,
        status,
        requirements: regionalRequirements.length
            ? regionalRequirements
            : [requirement(`Reach ${destination.name}`, inDestination || destinationVisited)],
        action: nextAction,
    });
}

function createServiceOpportunity({ state, origin, service, serviceDiscovered, inStart }) {
    if (!service) return null;
    let status = serviceDiscovered ? OPPORTUNITY_STATUSES.COMPLETE : OPPORTUNITY_STATUSES.AVAILABLE;
    let nextAction = null;
    if (inStart) {
        status = serviceDiscovered ? OPPORTUNITY_STATUSES.AVAILABLE : OPPORTUNITY_STATUSES.READY;
        nextAction = action('visit-local-service', `Browse with ${service.name}`, 'locality.poi', { poiId: service.id, action: 'shop' });
    } else {
        const step = createTransitionStep(state, origin.startingPlaceId, {
            id: 'return-for-service',
            label: `Return to ${getPlace(origin.startingPlaceId)?.name ?? origin.nationName}`,
        });
        if (step.action) {
            nextAction = step.action;
            status = step.status;
        }
    }
    return freezeOpportunity({
        id: `service-${origin.nationId}`,
        category: 'service',
        title: `Learn what ${service.name} can supply`,
        summary: `${service.name} is an existing settlement service contact, not a future-system placeholder.`,
        reason: 'Shops, guilds, and useful people turn material capability into preparation and give regional resources economic context.',
        progress: 'Local service knowledge and a clearer picture of what equipment or supplies can expand your options.',
        status,
        requirements: [requirement(`Be in ${getPlace(origin.startingPlaceId)?.name ?? origin.startingPlaceId}`, inStart)],
        action: nextAction,
    });
}

function createRegionalOutboundStep(state, origin, destination, purpose) {
    const departureId = origin.regionalDeparturePlaceId ?? origin.startingPlaceId;
    const departure = getPlace(departureId);
    if (state.currentPlaceId !== departureId) {
        const step = createTransitionStep(state, departureId, {
            id: `reach-regional-departure-${purpose}`,
            label: `Go to ${departure?.name ?? departureId}`,
        });
        return {
            ...step,
            requirements: [requirement(`Reach ${departure?.name ?? departureId}`, false)],
        };
    }

    const route = findTravelRoute(state, destination.id);
    if (!route.ok) {
        return {
            status: OPPORTUNITY_STATUSES.AVAILABLE,
            action: null,
            requirements: [requirement(`Know a route from ${departure?.name ?? departureId} to ${destination.name}`, false)],
        };
    }
    return {
        status: OPPORTUNITY_STATUSES.READY,
        action: action(`travel-for-${purpose}`, `Travel to ${destination.name}`, 'travel.start', { destinationId: destination.id }),
        requirements: [requirement(`Depart through ${departure?.name ?? departureId}`, true)],
    };
}

function createTransitionStep(state, targetPlaceId, options = {}) {
    if (state.currentPlaceId === targetPlaceId) {
        return { status: OPPORTUNITY_STATUSES.COMPLETE, action: null };
    }
    const target = getPlace(targetPlaceId);
    const localityDestination = listLocalityDestinations(state).find((entry) => entry.id === targetPlaceId);
    if (localityDestination) {
        return {
            status: OPPORTUNITY_STATUSES.READY,
            action: action(options.id ?? `go-${targetPlaceId}`, options.label ?? `Go to ${target?.name ?? targetPlaceId}`, 'locality.move', { destinationId: targetPlaceId }),
        };
    }
    const route = findTravelRoute(state, targetPlaceId);
    if (route.ok) {
        return {
            status: OPPORTUNITY_STATUSES.READY,
            action: action(options.id ?? `travel-${targetPlaceId}`, options.label ?? `Travel to ${target?.name ?? targetPlaceId}`, 'travel.start', { destinationId: targetPlaceId }),
        };
    }
    return { status: OPPORTUNITY_STATUSES.AVAILABLE, action: null };
}

function inventoryQuantity(state, itemId, containerId = 'inventory') {
    const items = state.player?.inventoryState?.containers?.[containerId]?.items ?? [];
    return items
        .filter((item) => item.id === itemId || item.templateId === itemId)
        .reduce((sum, item) => sum + Math.max(1, Number(item.quantity) || 1), 0);
}

function freezeModel(origin, entries, recommendedOpportunityId) {
    return Object.freeze({
        version: PLAYER_OPPORTUNITY_VERSION,
        originId: origin.nationId,
        heading: 'Opportunities',
        prompt: 'Choose a useful next step. These are leads from your current state, not a mandatory quest chain.',
        recommendedOpportunityId,
        entries: Object.freeze(entries),
    });
}

function freezeOpportunity(definition) {
    return Object.freeze({
        ...definition,
        blockers: Object.freeze([...(definition.blockers ?? [])]),
        requirements: Object.freeze((definition.requirements ?? []).map((entry) => Object.freeze({ ...entry }))),
        action: definition.action ? Object.freeze({ ...definition.action, payload: Object.freeze({ ...(definition.action.payload ?? {}) }) }) : null,
    });
}

function action(id, label, intent, payload = {}) {
    return { id, label, intent, payload };
}

function requirement(label, met) {
    return { label, met: Boolean(met) };
}

function isEquipped(player, itemId) {
    return Object.values(player?.equipment ?? {}).some((item) => item && (item.templateId === itemId || item.id === itemId));
}

function capitalize(value) {
    const text = String(value ?? 'work');
    return text.charAt(0).toUpperCase() + text.slice(1);
}
