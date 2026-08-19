import {
    DIRECTION_ORDER,
    getLevel,
    isNavigableCoordinate,
    isTopologyPlace,
    normalizeCoordinate,
    resolveExternalCoordinate,
} from '../data/coordinates.js';
import { getPlace } from '../data/places.js';

export const LOCATION_PERSISTENCE_VERSION = 1;

export function validatePersistedCurrentLocation(state) {
    if (!isObject(state)) return ['location state must be an object.'];
    const issues = [];
    const place = typeof state.currentPlaceId === 'string' ? getPlace(state.currentPlaceId) : null;
    if (!place || place.id !== state.currentPlaceId) {
        issues.push(`currentPlaceId must reference a canonical place id; received ${String(state.currentPlaceId)}.`);
        return issues;
    }
    if (state.location !== place.name) issues.push(`location must match canonical place name ${place.name}.`);
    issues.push(...validatePosition(place, state.position));
    return issues;
}

function validatePosition(place, position) {
    const path = 'position';
    if (!isObject(position)) return [`${path} must be a persisted object.`];
    const issues = [];
    if (position.placeId !== place.id) issues.push(`${path}.placeId must match currentPlaceId ${place.id}.`);

    if (isTopologyPlace(place)) {
        const coordinate = normalizeCoordinate(position.coord);
        if (!coordinate || coordinate !== position.coord) issues.push(`${path}.coord must be a normalized topology coordinate.`);
        if (typeof position.levelId !== 'string' || !position.levelId.trim() || !getLevel(place, position.levelId)) {
            issues.push(`${path}.levelId must reference a canonical level in ${place.id}.`);
        }
        if (!DIRECTION_ORDER.includes(position.facing)) issues.push(`${path}.facing must be a canonical direction.`);
        if (coordinate && getLevel(place, position.levelId) && !isNavigableCoordinate(place, position, position.levelId)) {
            issues.push(`${path}.coord must be navigable in ${place.id}.`);
        }
        if (position.x !== undefined || position.y !== undefined) issues.push(`${path} must not persist numeric x/y fields for topology places.`);
        return issues;
    }

    if (!Number.isInteger(position.x) || !Number.isInteger(position.y)) {
        issues.push(`${path}.x and ${path}.y must be persisted integers for grid places.`);
        return issues;
    }
    const width = Number(place.coordinateSystem?.width) || 0;
    const height = Number(place.coordinateSystem?.height) || 0;
    if (position.x < 0 || position.y < 0 || position.x >= width || position.y >= height) {
        issues.push(`${path} must be inside ${place.id}.`);
    }

    if (position.coord !== undefined) {
        const coordinate = normalizeCoordinate(position.coord);
        if (!coordinate || coordinate !== position.coord) issues.push(`${path}.coord must be normalized when present.`);
        const external = coordinate ? resolveExternalCoordinate(place.coordinateSystem, coordinate) : null;
        if (!external || external.x !== position.x || external.y !== position.y) {
            issues.push(`${path}.coord must map to the persisted x/y position in ${place.id}.`);
        }
        if (position.levelId !== 'main') issues.push(`${path}.levelId must be main when an external grid coordinate is persisted.`);
        if (!DIRECTION_ORDER.includes(position.facing)) issues.push(`${path}.facing must be a canonical direction when present.`);
    } else {
        if (position.levelId !== undefined) issues.push(`${path}.levelId requires an external grid coordinate.`);
        if (position.facing !== undefined) issues.push(`${path}.facing requires an external grid coordinate.`);
    }
    return issues;
}

function isObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
