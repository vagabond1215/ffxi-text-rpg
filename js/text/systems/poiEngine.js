import {
    describeAllPoisSummary,
    describeContextualPois,
    describePoisForPlace,
    findPoiInPlace,
    getContextualPois,
    getPointOfInterest,
    getPoisForPlace,
} from '../data/pointsOfInterest.js';
import { describeCoordinate } from '../data/coordinates.js';
import { describeGuildServiceForPoi } from '../data/guildServices.js';
import { describeQuestHookForPoi } from '../data/questHooks.js';
import { describeShopCatalogForPoi } from '../data/shopCatalogs.js';
import { getConnectionsFrom, getPlace } from '../data/places.js';
import { setPositionAndDiscover } from './atlasEngine.js';

export function createPoiDiscoveryState() {
    return {};
}

export function discoverPoi(state, poi) {
    state.discoveredPois ??= createPoiDiscoveryState();
    state.discoveredPois[poi.placeId] ??= [];
    if (!state.discoveredPois[poi.placeId].includes(poi.id)) {
        state.discoveredPois[poi.placeId].push(poi.id);
    }
    return state.discoveredPois[poi.placeId];
}

export function hasDiscoveredPoi(state, poiId) {
    return Object.values(state.discoveredPois ?? {}).some((ids) => ids.includes(poiId));
}

export function getDiscoveredPoisForPlace(state, placeId = state.currentPlaceId) {
    const discoveredIds = new Set(state.discoveredPois?.[placeId] ?? []);
    return getPoisForPlace(placeId).filter((poi) => discoveredIds.has(poi.id));
}

export function describePoiSummary() {
    return describeAllPoisSummary();
}

export function describePlacePois(placeId) {
    return describePoisForPlace(placeId);
}

export function describeCurrentPois(state) {
    return describeContextualPois(state);
}

export function talkAtCurrentGrid(state, query = '') {
    const pois = getContextualPois(state);
    if (!pois.length) return 'There is no one or nothing notable to interact with at this coordinate.';

    const poi = query
        ? pois.find((candidate) => normalize(candidate.name).includes(normalize(query)) || normalize(candidate.id).includes(normalize(query)))
        : pois[0];

    if (!poi) return `No matching point of interest here for: ${query}`;

    discoverPoi(state, poi);
    return describePoiInteraction(state, poi, 'talk');
}

export function performPoiAction(state, action, query = '') {
    const pois = getContextualPois(state);
    if (!pois.length) return 'There is no point of interest at this coordinate.';

    const poi = query
        ? pois.find((candidate) => normalize(candidate.name).includes(normalize(query)) || normalize(candidate.id).includes(normalize(query)))
        : pois.find((candidate) => candidate.actions.includes(action)) ?? pois[0];

    if (!poi) return `No matching point of interest here for: ${query}`;
    if (!poi.actions.includes(action)) return `${poi.name} does not support action: ${action}. Available: ${poi.actions.join(', ')}`;

    discoverPoi(state, poi);
    return describePoiInteraction(state, poi, action);
}

export function describePoiInteraction(state, poi, action) {
    const discovered = hasDiscoveredPoi(state, poi.id);
    const lines = [
        `${poi.name}`,
        `Type: ${poi.type}`,
        `Coordinate: ${describeCoordinate(poi.coordinate)} | Source position: ${poi.sourcePosition}`,
        `Action: ${action}`,
        poi.notes,
        discovered ? 'Discovered: yes. You can fast-travel to this POI while in the same zone.' : 'Discovered: no.',
    ];

    switch (action) {
        case 'shop':
            lines.push('', describeShopCatalogForPoi(poi));
            break;
        case 'guild':
            lines.push('', describeGuildServiceForPoi(poi));
            break;
        case 'quest':
            lines.push('', describeQuestHookForPoi(poi));
            break;
        case 'travel':
            lines.push('Travel service behavior is not implemented yet unless this is a zone connection.');
            break;
        case 'storage':
            lines.push('Storage behavior is not implemented yet.');
            break;
        case 'trust':
            lines.push('Trust unlock/summon behavior is not implemented yet.');
            break;
        default:
            lines.push('They acknowledge you. Dialogue scripting is not implemented yet.');
    }

    return lines.join('\n');
}

export function describeDiscoveredPois(state, placeId = state.currentPlaceId) {
    const place = getPlace(placeId);
    const pois = getDiscoveredPoisForPlace(state, placeId);
    if (!pois.length) return `No discovered POIs in ${place?.name ?? placeId}. Talk to NPCs or interact with POIs to unlock same-zone POI fast travel.`;

    return [
        `Discovered POIs in ${place?.name ?? placeId}:`,
        ...pois.map((poi) => `- ${poi.name} [${poi.type}] coordinate ${describeCoordinate(poi.coordinate)} actions: ${poi.actions.join(', ')}`),
    ].join('\n');
}

export function fastTravelToPoi(state, query) {
    if (!query) return 'Fast travel to which discovered POI? Try `discovered`.';
    const currentPlaceId = state.currentPlaceId;
    const candidates = getDiscoveredPoisForPlace(state, currentPlaceId);
    const poi = candidates.find((candidate) => normalize(candidate.name).includes(normalize(query)) || normalize(candidate.id).includes(normalize(query)));
    if (!poi) return `No discovered POI named "${query}" in this zone. Try \`discovered\`.`;

    const result = setPositionAndDiscover(state, currentPlaceId, poi.coordinate, { important: [`Fast traveled to ${poi.name}`] });
    if (!result.ok) return result.reason;
    return [`Fast traveled to ${poi.name}.`, describeCurrentPois(state)].join('\n\n');
}

export function describeZoneFastTravelOptions(state) {
    const place = getPlace(state.currentPlaceId);
    if (!place) return `Unknown current zone: ${state.currentPlaceId}`;
    const connections = getConnectionsFrom(place.id);
    if (!connections.length) return `No known zone exits from ${place.name}.`;

    return [
        `Known zone exits from ${place.name}:`,
        ...connections.map((connection) => {
            const destination = getPlace(connection.to);
            const requirementText = connection.restrictions.length
                ? ` requirements: ${connection.restrictions.map((restriction) => restriction.reason ?? restriction.type).join('; ')}`
                : ' requirements: none';
            return `- ${destination?.name ?? connection.to} via ${connection.mode} from ${describeCoordinate(connection.departFrom)}${requirementText}`;
        }),
    ].join('\n');
}

export function findPoiForCurrentPlace(state, query) {
    return findPoiInPlace(state.currentPlaceId, query) ?? getPointOfInterest(query);
}

function normalize(value) {
    return String(value ?? '').trim().toLowerCase().replace(/[’']/g, '').replace(/\s+/g, '-');
}
