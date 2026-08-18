import { coordinateKey, isNavigableCoordinate, isTopologyPlace } from '../data/coordinates.js';
import { getPlace, isCoordinateInsidePlace } from '../data/places.js';
import { getPointOfInterest } from '../data/pointsOfInterest.js';

export function validatePersistedDiscoveryState(state) {
    return [
        ...validateAtlasState(state?.atlas),
        ...validatePoiDiscoveryState(state?.discoveredPois),
    ];
}

export function validateAtlasState(atlas) {
    const issues = [];
    if (!isObject(atlas)) return ['atlas must be an object.'];

    for (const [placeId, entry] of Object.entries(atlas)) {
        const path = `atlas.${placeId}`;
        const place = getPlace(placeId);
        if (!place) issues.push(`${path} references unknown place.`);
        if (!isObject(entry)) {
            issues.push(`${path} must be an object.`);
            continue;
        }
        if (entry.placeId !== placeId) issues.push(`${path}.placeId must match its atlas key.`);
        if (!Array.isArray(entry.notes)) issues.push(`${path}.notes must be an array.`);
        if (!isObject(entry.visited)) {
            issues.push(`${path}.visited must be an object.`);
            continue;
        }

        for (const [visitKey, visit] of Object.entries(entry.visited)) {
            const visitPath = `${path}.visited.${visitKey}`;
            if (!isObject(visit)) {
                issues.push(`${visitPath} must be an object.`);
                continue;
            }
            if (!Number.isInteger(visit.visitedAtWorldSeconds) || visit.visitedAtWorldSeconds < 0) {
                issues.push(`${visitPath}.visitedAtWorldSeconds must be a non-negative integer.`);
            }
            if (Object.hasOwn(visit, 'visitedAt')) issues.push(`${visitPath}.visitedAt wall-clock timestamp is not part of the current discovery contract.`);
            if (!Array.isArray(visit.important)) issues.push(`${visitPath}.important must be an array.`);
            if (!Array.isArray(visit.notes)) issues.push(`${visitPath}.notes must be an array.`);

            if (!place) continue;
            const coordinate = visitCoordinate(visit);
            if (!coordinate) {
                issues.push(`${visitPath} must persist a valid coordinate.`);
                continue;
            }
            if (coordinateKey(coordinate) !== visitKey) issues.push(`${visitPath} key must match its persisted coordinate.`);
            if (!isCoordinateInsidePlace(place, coordinate)) issues.push(`${visitPath} coordinate is outside ${placeId}.`);
            if (isTopologyPlace(place) && !isNavigableCoordinate(place, coordinate, coordinate.levelId ?? 'main')) {
                issues.push(`${visitPath} coordinate is not navigable in ${placeId}.`);
            }
        }
    }
    return issues;
}

export function validatePoiDiscoveryState(discoveredPois) {
    const issues = [];
    if (!isObject(discoveredPois)) return ['discoveredPois must be an object.'];

    for (const [placeId, poiIds] of Object.entries(discoveredPois)) {
        if (!getPlace(placeId)) issues.push(`discoveredPois.${placeId} references unknown place.`);
        if (!Array.isArray(poiIds)) {
            issues.push(`discoveredPois.${placeId} must be an array.`);
            continue;
        }
        const seen = new Set();
        for (const [index, poiId] of poiIds.entries()) {
            const poi = getPointOfInterest(poiId);
            if (!poi) issues.push(`discoveredPois.${placeId}[${index}] references unknown POI ${String(poiId)}.`);
            else if (poi.placeId !== placeId) issues.push(`discoveredPois.${placeId}[${index}] belongs to ${poi.placeId}.`);
            if (seen.has(poiId)) issues.push(`discoveredPois.${placeId} duplicates ${String(poiId)}.`);
            seen.add(poiId);
        }
    }
    return issues;
}

function visitCoordinate(visit) {
    if (Number.isInteger(visit.x) && Number.isInteger(visit.y)) return { x: visit.x, y: visit.y };
    if (typeof visit.coord === 'string' && visit.coord.trim()) return { coord: visit.coord, levelId: visit.levelId ?? 'main' };
    return null;
}

function isObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
