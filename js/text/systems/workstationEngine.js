import { getFurniture } from '../data/homeFurnishings.js';
import { getContextualPois } from '../data/pointsOfInterest.js';

export const WORKSTATION_ENGINE_VERSION = 3;
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

const HOME_FURNITURE_TAG_TO_STATIONS = Object.freeze({
    forge: ['forge', 'workshop'],
    kitchen: ['kitchen'],
    woodshop: ['woodshop', 'workshop'],
    tannery: ['tannery', 'workshop'],
    workshop: ['workshop'],
    workbench: ['workshop'],
});

export function getWorkstationTagsForPoi(poi) {
    const tags = new Set();
    for (const poiTag of poi?.tags ?? []) {
        for (const stationTag of POI_TAG_TO_STATIONS[poiTag] ?? []) tags.add(stationTag);
    }
    return Array.from(tags);
}

export function getWorkstationTagsForFurniture(furniture) {
    const tags = new Set();
    for (const furnitureTag of furniture?.tags ?? []) {
        for (const stationTag of HOME_FURNITURE_TAG_TO_STATIONS[furnitureTag] ?? []) tags.add(stationTag);
    }
    return Array.from(tags);
}

export function collectHomeWorkstationTags(state) {
    const homePlaceId = state?.player?.progression?.unlockedHomePoints?.[0] ?? null;
    if (!homePlaceId || state?.currentPlaceId !== homePlaceId) return [];

    const tags = new Set();
    for (const furnitureId of state?.player?.inventoryState?.home?.placedFurniture ?? []) {
        const furniture = getFurniture(furnitureId);
        for (const stationTag of getWorkstationTagsForFurniture(furniture)) tags.add(stationTag);
    }
    return Array.from(tags);
}

export function collectAvailableWorkstationTags(state, explicitTags = []) {
    const tags = new Set((explicitTags ?? []).map(String));
    for (const poi of getContextualPois(state)) {
        for (const stationTag of getWorkstationTagsForPoi(poi)) tags.add(stationTag);
    }
    for (const stationTag of collectHomeWorkstationTags(state)) tags.add(stationTag);
    return Array.from(tags);
}

export function hasWorkstationTags(state, requiredTags = [], explicitTags = []) {
    const available = new Set(collectAvailableWorkstationTags(state, explicitTags));
    const missing = (requiredTags ?? []).filter((tag) => !available.has(tag));
    return { ok: missing.length === 0, available: Array.from(available), missing };
}
