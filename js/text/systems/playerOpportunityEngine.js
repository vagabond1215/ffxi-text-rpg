import { getCanonicalGatheringSource } from '../data/ecologyRegistry.js';
import { getEquipmentCatalogEntry } from '../data/equipmentCatalog.js';
import { getNation } from '../data/nations.js';
import { getOriginExperienceContent } from '../data/playerExperienceContent.js';
import { getPointOfInterest } from '../data/pointsOfInterest.js';
import { getPlace } from '../data/places.js';
import { checkGatheringWorkRequirements } from './gatheringWorkEngine.js';
import { findItemInContainer } from './inventoryEngine.js';
import { hasDiscoveredPoi } from './poiEngine.js';
import { createPlayerExperienceModel } from './playerExperienceEngine.js';
import { findTravelRoute } from './travelEngine.js';
import { listWorkRecords, WORK_STATUSES } from './workTaskEngine.js';

export const PLAYER_OPPORTUNITY_VERSION = 1;
export const OPPORTUNITY_STATUSES = Object.freeze({
    READY: 'ready',
    BLOCKED: 'blocked',
    ACTIVE: 'active',
    COMPLETE: 'complete',
    AVAILABLE: 'available',
});

export function createPlayerOpportunityModel(state) {
    const experience = createPlayerExperienceModel(state);
    const origin = getOriginExperienceContent(experience.originId);
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

    const preparation = createPreparationOpportunity({ origin, starterItem, starterItemId, starterEquipped, starterCarried });
    const livelihood = createLivelihoodOpportunity({ state, origin, destination, source, starterItem, starterEquipped, inDestination });
    const training = createTrainingOpportunity({ state, origin, destination, inDestination });
    const exploration = createExplorationOpportunity({ state, origin, destination, destinationVisited, inDestination });
    const serviceOpportunity = createServiceOpportunity({ state, origin, service, serviceDiscovered, inStart });
    const entries = [preparation, livelihood, training, exploration, serviceOpportunity].filter(Boolean);
    const recommended = entries.find((entry) => entry.status === OPPORTUNITY_STATUSES.READY)
        ?? entries.find((entry) => entry.status === OPPORTUNITY_STATUSES.AVAILABLE)
        ?? entries.find((entry) => entry.status === OPPORTUNITY_STATUSES.ACTIVE)
        ?? null;
    return freezeModel(origin, entries, recommended?.id ?? null);
}

function createPreparationOpportunity({ origin, starterItem, starterItemId, starterEquipped, starterCarried }) {
    if (!starterItemId || !starterItem) return null;
    const status = starterEquipped
        ? OPPORTUNITY_STATUSES.COMPLETE
        : starterCarried ? OPPORTUNITY_STATUSES.READY : OPPORTUNITY_STATUSES.BLOCKED;
    return freezeOpportunity({
        id: `prepare-${origin.nationId}`,
        category: 'preparation',
        title: starterEquipped ? `${starterItem.name} ready` : `Ready your ${starterItem.name}`,
        summary: starterEquipped
            ? `${starterItem.name} is equipped and can satisfy field-tool requirements.`
            : `Your origin kit includes a ${starterItem.name}; equip it before relying on it in the field.`,
        reason: 'Preparation changes what actions are actually available. Possession alone does not satisfy an equipped-tool requirement.',
        progress: 'A usable loadout opens livelihood and recovery actions without changing your permanent identity.',
        status,
        requirements: [
            requirement(`Carry ${starterItem.name}`, starterCarried || starterEquipped),
            requirement(`Equip ${starterItem.name}`, starterEquipped),
        ],
        action: !starterEquipped && starterCarried
            ? action('equip-starter-tool', `Equip ${starterItem.name}`, 'equipment.equip', { itemId: starterItemId })
            : null,
    });
}

function createLivelihoodOpportunity({ state, origin, destination, source, starterItem, starterEquipped, inDestination }) {
    if (!destination || !source) return null;
    const activeWork = listWorkRecords(state, { kind: 'gathering', status: WORK_STATUSES.ACTIVE })
        .find((record) => record.data?.sourceId === source.id);
    const check = inDestination ? checkGatheringWorkRequirements(state, source.id) : null;
    let status = OPPORTUNITY_STATUSES.BLOCKED;
    let nextAction = null;
    if (activeWork) status = OPPORTUNITY_STATUSES.ACTIVE;
    else if (!starterEquipped) status = OPPORTUNITY_STATUSES.BLOCKED;
    else if (!inDestination) {
        const route = findTravelRoute(state, destination.id);
        status = route.ok ? OPPORTUNITY_STATUSES.READY : OPPORTUNITY_STATUSES.AVAILABLE;
        if (route.ok) nextAction = action('travel-for-livelihood', `Travel to ${destination.name}`, 'travel.start', { destinationId: destination.id });
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
            requirement(`Reach ${destination.name}`, inDestination),
            ...source.requiredToolTags.map((tag) => requirement(`Tool capability: ${tag}`, starterEquipped && (starterItem?.tags ?? []).includes(tag))),
        ],
        blockers,
        action: nextAction,
    });
}

function createTrainingOpportunity({ state, origin, destination, inDestination }) {
    if (!destination) return null;
    const activeBattle = state.activeBattle?.phase === 'active';
    let status = activeBattle ? OPPORTUNITY_STATUSES.ACTIVE : OPPORTUNITY_STATUSES.AVAILABLE;
    let nextAction = null;
    if (!activeBattle && inDestination) {
        const present = destination.spawnRules.some((rule) => rule.enemyId === origin.trainingEnemyId);
        status = present ? OPPORTUNITY_STATUSES.READY : OPPORTUNITY_STATUSES.BLOCKED;
        if (present) nextAction = action('begin-field-training', 'Seek a manageable field encounter', 'combat.encounter', { enemyId: origin.trainingEnemyId });
    } else if (!activeBattle && !inDestination) {
        const route = findTravelRoute(state, destination.id);
        status = route.ok ? OPPORTUNITY_STATUSES.READY : OPPORTUNITY_STATUSES.AVAILABLE;
        if (route.ok) nextAction = action('travel-for-training', `Travel to ${destination.name}`, 'travel.start', { destinationId: destination.id });
    }
    return freezeOpportunity({
        id: `training-${origin.nationId}`,
        category: 'training',
        title: 'Practice against a manageable field threat',
        summary: `${destination.name} contains low-danger encounters suitable for learning how combat readiness, recovery, skills, and discipline training interact.`,
        reason: 'Combat effort can improve weapon or magic proficiency and discipline experience, but preparation and recovery still constrain action.',
        progress: 'Combat skill practice, discipline experience, and familiarity with field danger.',
        status,
        requirements: [requirement(`Reach ${destination.name}`, inDestination)],
        action: nextAction,
    });
}

function createExplorationOpportunity({ state, origin, destination, destinationVisited, inDestination }) {
    if (!destination) return null;
    let status = destinationVisited ? OPPORTUNITY_STATUSES.COMPLETE : OPPORTUNITY_STATUSES.AVAILABLE;
    let nextAction = null;
    if (inDestination) status = destinationVisited ? OPPORTUNITY_STATUSES.COMPLETE : OPPORTUNITY_STATUSES.ACTIVE;
    else {
        const route = findTravelRoute(state, destination.id);
        if (route.ok) {
            status = destinationVisited ? OPPORTUNITY_STATUSES.AVAILABLE : OPPORTUNITY_STATUSES.READY;
            nextAction = action('travel-first-horizon', `Travel to ${destination.name}`, 'travel.start', { destinationId: destination.id });
        }
    }
    return freezeOpportunity({
        id: `exploration-${origin.nationId}`,
        category: 'exploration',
        title: `Reach ${destination.name}`,
        summary: `Move from safe locality navigation into discovery-based exploration in ${origin.regionalHorizon}.`,
        reason: 'Travel and exploration expand acquired knowledge and expose resources, encounters, and routes rather than revealing the authored world in advance.',
        progress: `Atlas knowledge, regional access, and a practical route between ${origin.nationName} and ${destination.name}.`,
        status,
        requirements: [requirement(`Know a route to ${destination.name}`, Boolean(findTravelRoute(state, destination.id).ok || destinationVisited || inDestination))],
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
        const route = findTravelRoute(state, origin.startingPlaceId);
        if (route.ok) {
            nextAction = action('return-for-service', `Return to ${getPlace(origin.startingPlaceId)?.name ?? origin.nationName}`, 'travel.start', { destinationId: origin.startingPlaceId });
            status = OPPORTUNITY_STATUSES.AVAILABLE;
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
