import { getContextualPois } from '../data/pointsOfInterest.js';

export const WORKSTATION_TAGS = Object.freeze(['forge', 'kitchen', 'woodshop', 'tannery', 'workshop']);

const POI_TAG_TO_STATIONS = Object.freeze({
    blacksmithing: ['forge', 'workshop'],
    goldsmithing: ['forge', 'workshop'],
    engineer: ['forge', 'workshop'],
    cooking: ['kitchen'],
    woodworking: ['woodshop', 'workshop'],
    tanning: ['tannery', 'workshop'],
    craftSupport: ['workshop'],
});

export function getWorkstationTagsForPoi(poi) {
    const tags = new Set();
    for (const poiTag of poi?.tags ?? []) {
        for (const stationTag of POI_TAG_TO_STATIONS[poiTag] ?? []) tags.add(stationTag);
    }
    return Array.from(tags);
}

export function collectAvailableWorkstationTags(state, explicitTags = []) {
    const tags = new Set((explicitTags ?? []).map(String));
    for (const poi of getContextualPois(state)) {
        for (const stationTag of getWorkstationTagsForPoi(poi)) tags.add(stationTag);
    }
    return Array.from(tags);
}

export function hasWorkstationTags(state, requiredTags = [], explicitTags = []) {
    const available = new Set(collectAvailableWorkstationTags(state, explicitTags));
    const missing = (requiredTags ?? []).filter((tag) => !available.has(tag));
    return { ok: missing.length === 0, available: Array.from(available), missing };
}
