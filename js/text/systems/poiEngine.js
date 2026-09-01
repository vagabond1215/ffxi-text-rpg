import {
    describeAllPoisSummary,
    findPoiInPlace,
    getContextualPois,
    getPointOfInterest,
    getPoisForPlace,
} from '../data/pointsOfInterest.js';
import { findCompanionDefinition } from '../data/companions.js';
import { describeGuildServiceForPoi } from '../data/guildServices.js';
import { describeTrainingServiceAtPoi } from './trainingServiceEngine.js';
import { describeQuestHookForPoi } from '../data/questHooks.js';
import { describeShopCatalogForPoi } from '../data/shopCatalogs.js';
import { getConnectionsFrom, getPlace } from '../data/places.js';
import { setPositionAndDiscover } from './atlasEngine.js';
import {
    KNOWLEDGE_STATES,
    canDirectlyNavigateToPoi,
    getPlayerFacingPoiName,
    getPoiKnowledge,
    identifyNpc,
    learnPoiName,
    recordPoiExposure,
    recordPoiInteraction,
    requiresPoiEntryTransition,
    setCurrentLocalAnchor,
} from './localKnowledgeEngine.js';
import { describeNpcScheduleStatus, getPoiScheduleStatus } from './npcScheduleEngine.js';
import { recruitCompanion } from './partyEngine.js';
import { applyOriginGuideReferral, describeOriginGuideDialogue } from './playerExperienceEngine.js';
import { describeTransportServiceBoard } from './transportServiceBoardEngine.js';

export function createPoiDiscoveryState() {
    return {};
}

export function discoverPoi(state, poi) {
    return recordPoiExposure(state, poi, { points: 1 });
}

export function hasDiscoveredPoi(state, poiId) {
    const knowledge = getPoiKnowledge(state, poiId);
    return Boolean(knowledge && knowledge.knowledgeState !== KNOWLEDGE_STATES.REFERENCED);
}

export function getDiscoveredPoisForPlace(state, placeId = state.currentPlaceId) {
    return getPoisForPlace(placeId).filter((poi) => hasDiscoveredPoi(state, poi.id));
}

export function describePoiSummary() {
    return describeAllPoisSummary();
}

export function describePlacePois(placeId) {
    const place = getPlace(placeId);
    const pois = getPoisForPlace(placeId);
    if (!pois.length) return `No points of interest seeded for ${place?.name ?? placeId}.`;
    return [
        `Points of interest in ${place?.name ?? placeId}:`,
        ...pois.map((poi) => `- ${poi.name} [${poi.type}] - ${poi.notes}`),
    ].join('\n');
}

export function describeCurrentPois(state) {
    const pois = getContextualPois(state);
    if (!pois.length) return 'No notable point of interest is immediately here.';
    return [
        'What stands out here:',
        ...pois.map((poi) => {
            const availability = getPoiScheduleStatus(state, poi);
            const scheduleText = availability.scheduled
                ? ` | ${availability.available ? 'available now' : 'not available now'}`
                : '';
            return `- ${getPlayerFacingPoiName(state, poi)} [${poi.type}] - ${poi.notes}${scheduleText}`;
        }),
    ].join('\n');
}

export function talkAtCurrentGrid(state, query = '') {
    const pois = getContextualPois(state);
    if (!pois.length) return 'There is no one or nothing notable to interact with here.';

    const poi = query
        ? pois.find((candidate) => normalize(candidate.name).includes(normalize(query)) || normalize(candidate.id).includes(normalize(query)))
        : pois[0];

    if (!poi) return `No matching point of interest here for: ${query}`;

    recordPoiInteraction(state, poi, { points: 1, learnedName: true });
    learnPoiName(state, poi);
    const availability = getPoiScheduleStatus(state, poi);
    if (availability.npcId) identifyNpc(state, availability.npcId, { points: 1 });
    applyOriginGuideReferral(state, poi);
    return describePoiInteraction(state, poi, 'talk');
}

export function performPoiAction(state, action, query = '') {
    const canonicalAction = canonicalizePoiAction(action);
    if (canonicalAction === 'companion') {
        const definition = findCompanionDefinition(query);
        if (definition) {
            const result = recruitCompanion(state, definition.id);
            return result.message ?? result.display?.text ?? result.code;
        }
    }

    const pois = getContextualPois(state);
    if (!pois.length) return 'There is no point of interest here.';

    const poi = query
        ? pois.find((candidate) => normalize(candidate.name).includes(normalize(query)) || normalize(candidate.id).includes(normalize(query)))
        : pois.find((candidate) => candidate.actions.includes(canonicalAction)) ?? pois[0];

    if (!poi) return `No matching point of interest here for: ${query}`;
    if (!poi.actions.includes(canonicalAction)) return `${getPlayerFacingPoiName(state, poi)} does not support action: ${canonicalAction}. Available: ${poi.actions.join(', ')}`;

    recordPoiInteraction(state, poi, { points: 1, learnedName: true });
    const availability = getPoiScheduleStatus(state, poi);
    if (availability.npcId) identifyNpc(state, availability.npcId, { points: 1 });
    return describePoiInteraction(state, poi, canonicalAction);
}

export function describePoiInteraction(state, poi, action) {
    const availability = getPoiScheduleStatus(state, poi);
    if (availability.scheduled && !availability.available) {
        if (availability.npcId) return describeNpcScheduleStatus(availability);
        return availability.currentWindowLabel
            ? `That service is not available right now. Its current schedule is ${availability.currentWindowLabel}.`
            : availability.windowSummary
                ? `That service is not available right now. Its schedule is ${availability.windowSummary}.`
                : 'That service is not available right now.';
    }

    const canonicalAction = canonicalizePoiAction(action);
    if (canonicalAction === 'talk') {
        const guideDialogue = describeOriginGuideDialogue(state, poi);
        if (guideDialogue) return guideDialogue;
    }

    const knowledge = getPoiKnowledge(state, poi.id);
    const lines = [
        `${getPlayerFacingPoiName(state, poi)}`,
        `Type: ${poi.type}`,
        `Action: ${canonicalAction}`,
        poi.notes,
        `Local knowledge: ${knowledge?.knowledgeState ?? KNOWLEDGE_STATES.SIGHTED}.`,
    ];

    switch (canonicalAction) {
        case 'shop':
            lines.push('', describeShopCatalogForPoi(poi));
            break;
        case 'guild':
            lines.push('', describeGuildServiceForPoi(poi));
            break;
        case 'quest':
            lines.push('', describeQuestHookForPoi(poi));
            break;
        case 'training':
            lines.push('', describeTrainingServiceAtPoi(state, poi.id));
            break;
        case 'travel':
            lines.push('', describeTransportServiceBoard(state));
            break;
        case 'storage':
            lines.push('Storage behavior is not implemented yet.');
            break;
        case 'companion':
            lines.push('This contact is not itself companion authority. Persistent recruitment is resolved through the party system.');
            break;
        default:
            lines.push('They acknowledge you.');
    }

    return lines.join('\n');
}

export function describeDiscoveredPois(state, placeId = state.currentPlaceId) {
    const place = getPlace(placeId);
    const pois = getDiscoveredPoisForPlace(state, placeId);
    if (!pois.length) return `No learned local points are recorded in ${place?.name ?? placeId} yet.`;

    return [
        `Learned points in ${place?.name ?? placeId}:`,
        ...pois.map((poi) => {
            const knowledge = getPoiKnowledge(state, poi.id);
            return `- ${getPlayerFacingPoiName(state, poi)} [${poi.type}] — ${knowledge?.knowledgeState ?? KNOWLEDGE_STATES.SIGHTED}`;
        }),
    ].join('\n');
}

export function fastTravelToPoi(state, query) {
    if (!query) return 'Go directly to which familiar local point? Try `discovered`.';
    const currentPlaceId = state.currentPlaceId;
    const candidates = getDiscoveredPoisForPlace(state, currentPlaceId);
    const poi = candidates.find((candidate) => normalize(candidate.name).includes(normalize(query)) || normalize(candidate.id).includes(normalize(query)));
    if (!poi) return `No learned local point named "${query}" is recorded here.`;
    if (!canDirectlyNavigateToPoi(state, poi.id)) {
        return `You recognize ${getPlayerFacingPoiName(state, poi)}, but do not yet know the locality well enough to go there directly.`;
    }

    const result = setPositionAndDiscover(state, currentPlaceId, poi.coordinate, { important: [`Returned to familiar POI ${poi.id}`] });
    if (!result.ok) return result.reason;
    const requiresEntry = requiresPoiEntryTransition(poi);
    state.activePoiId = requiresEntry ? null : poi.id;
    setCurrentLocalAnchor(state, { type: 'poi', id: poi.id, placeId: currentPlaceId });
    recordPoiExposure(state, poi, { points: 1 });
    const arrival = requiresEntry
        ? `Went directly to the entrance of ${getPlayerFacingPoiName(state, poi)}. Entering is still your choice.`
        : `Went directly to ${getPlayerFacingPoiName(state, poi)}.`;
    return [arrival, describeCurrentPois(state)].join('\n\n');
}

export function describeTravelExitOptions(state) {
    const place = getPlace(state.currentPlaceId);
    if (!place) return `Unknown current place: ${state.currentPlaceId}`;
    const connections = getConnectionsFrom(place.id);
    if (!connections.length) return `No known exits from ${place.name}.`;

    return [
        `Route connections from ${place.name}:`,
        ...connections.map((connection) => {
            const destination = getPlace(connection.to);
            const requirementText = connection.restrictions.length
                ? ` requirements: ${connection.restrictions.map((restriction) => restriction.reason ?? restriction.type).join('; ')}`
                : ' requirements: none';
            return `- ${destination?.name ?? connection.to} via ${connection.mode}${requirementText}`;
        }),
    ].join('\n');
}

// Legacy API alias retained while callers migrate from zone-oriented vocabulary.
export function describeZoneFastTravelOptions(state) {
    return describeTravelExitOptions(state);
}

export function findPoiForCurrentPlace(state, query) {
    return findPoiInPlace(state.currentPlaceId, query) ?? getPointOfInterest(query);
}

function canonicalizePoiAction(action) {
    const normalized = normalize(action);
    if (normalized === 'trust') return 'companion';
    return normalized;
}

function normalize(value) {
    return String(value ?? '').trim().toLowerCase().replace(/[’']/g, '').replace(/\s+/g, '-');
}
