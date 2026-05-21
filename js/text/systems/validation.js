import { getMap, listMaps } from '../data/maps.js';
import { getPlace, isCoordinateInsidePlace, listPlaces, ZONE_CONNECTIONS } from '../data/places.js';
import { ENTITY_TYPES, EQUIPMENT_SLOTS } from '../data/systemConstants.js';

export const CURRENT_SAVE_VERSION = 2;

export function validateGameState(state) {
    const issues = [];

    if (!isObject(state)) {
        return ['State must be an object.'];
    }

    if (state.version !== CURRENT_SAVE_VERSION) {
        issues.push(`Expected state version ${CURRENT_SAVE_VERSION}, received ${String(state.version)}.`);
    }

    const place = getPlace(state.currentPlaceId);
    if (!state.currentPlaceId) issues.push('currentPlaceId is required.');
    if (state.currentPlaceId && !place) issues.push(`currentPlaceId references unknown place ${state.currentPlaceId}.`);
    if (!isObject(state.position)) {
        issues.push('position must be an object.');
    } else if (place && !isCoordinateInsidePlace(place, state.position)) {
        issues.push(`position (${state.position.x}, ${state.position.y}) is outside ${place.name}.`);
    }
    if (!isObject(state.atlas)) issues.push('atlas must be an object.');
    if (state.travel !== null && state.travel !== undefined && !isObject(state.travel)) issues.push('travel must be null or an object.');

    if (!state.player) {
        issues.push('State is missing player.');
    } else {
        issues.push(...validatePlayer(state.player).map((issue) => `player.${issue}`));
    }

    if (!Array.isArray(state.npcs)) issues.push('npcs must be an array.');
    if (!Array.isArray(state.enemies)) issues.push('enemies must be an array.');
    if (!Array.isArray(state.log)) issues.push('log must be an array.');

    return issues;
}

export function validateWorldData() {
    const issues = [];
    const places = listPlaces();
    const placeIds = new Set(places.map((place) => place.id));
    const maps = listMaps();
    const mapIds = new Set(maps.map((map) => map.id));

    for (const place of places) {
        if (!place.mapId) issues.push(`${place.id} is missing mapId.`);
        if (place.mapId && !mapIds.has(place.mapId)) issues.push(`${place.id} references unknown map ${place.mapId}.`);
        if (!isObject(place.coordinateSystem)) issues.push(`${place.id} is missing coordinateSystem.`);
        if (place.coordinateSystem && !isCoordinateInsidePlace(place, place.coordinateSystem.start)) {
            issues.push(`${place.id} start coordinate is outside its grid.`);
        }
        for (const rule of place.spawnRules ?? []) {
            for (const key of rule.grids ?? []) {
                const [x, y] = key.split(',').map(Number);
                if (!isCoordinateInsidePlace(place, { x, y })) {
                    issues.push(`${place.id} spawn ${rule.enemyId} references out-of-bounds grid ${key}.`);
                }
            }
        }
    }

    for (const map of maps) {
        for (const placeId of map.placeIds) {
            if (!placeIds.has(placeId)) issues.push(`${map.id} references unknown place ${placeId}.`);
        }
    }

    for (const connection of ZONE_CONNECTIONS) {
        const from = getPlace(connection.from);
        const to = getPlace(connection.to);
        if (!from) issues.push(`${connection.id} has unknown from place ${connection.from}.`);
        if (!to) issues.push(`${connection.id} has unknown to place ${connection.to}.`);
        if (from && connection.departFrom && !isCoordinateInsidePlace(from, connection.departFrom)) {
            issues.push(`${connection.id} departFrom is outside ${from.name}.`);
        }
        if (to && connection.arriveAt && !isCoordinateInsidePlace(to, connection.arriveAt)) {
            issues.push(`${connection.id} arriveAt is outside ${to.name}.`);
        }
    }

    return issues;
}

export function isValidGameState(state) {
    return validateGameState(state).length === 0;
}

export function validatePlayer(player) {
    const issues = validateEntityBase(player, ENTITY_TYPES.PLAYER);

    if (!isObject(player.identity)) issues.push('identity must be an object.');
    if (!player.identity?.name) issues.push('identity.name is required.');
    if (!player.identity?.raceId) issues.push('identity.raceId is required.');
    if (!isObject(player.jobs)) issues.push('jobs must be an object.');
    if (!player.jobs?.mainJobId) issues.push('jobs.mainJobId is required.');
    if (!Number.isInteger(player.jobs?.level)) issues.push('jobs.level must be an integer.');
    if (!isObject(player.wallet)) issues.push('wallet must be an object.');
    if (!isObject(player.equipment)) issues.push('equipment must be an object.');
    if (isObject(player.equipment)) {
        for (const slot of EQUIPMENT_SLOTS) {
            if (!(slot in player.equipment)) issues.push(`equipment.${slot} is missing.`);
        }
    }
    if (!Array.isArray(player.inventory)) issues.push('inventory must be an array.');
    if (!Array.isArray(player.statuses)) issues.push('statuses must be an array.');

    return issues;
}

export function validateNpc(npc) {
    const issues = validateEntityBase(npc, ENTITY_TYPES.NPC);
    if (!npc.identity?.name) issues.push('identity.name is required.');
    if (!Array.isArray(npc.services)) issues.push('services must be an array.');
    if (!Array.isArray(npc.questIds)) issues.push('questIds must be an array.');
    return issues;
}

export function validateEnemy(enemy) {
    const issues = validateEntityBase(enemy, ENTITY_TYPES.ENEMY);
    if (!enemy.identity?.name) issues.push('identity.name is required.');
    if (!Number.isInteger(enemy.level)) issues.push('level must be an integer.');
    if (!isObject(enemy.resources)) issues.push('resources must be an object.');
    if (!isObject(enemy.combat)) issues.push('combat must be an object.');
    return issues;
}

function validateEntityBase(entity, expectedType) {
    const issues = [];
    if (!isObject(entity)) return ['entity must be an object.'];
    if (!entity.id) issues.push('id is required.');
    if (entity.type !== expectedType) issues.push(`type must be ${expectedType}.`);
    if (!isObject(entity.identity)) issues.push('identity must be an object.');
    return issues;
}

function isObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
