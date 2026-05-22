import { listGuildServices } from '../data/guildServices.js';
import { listEquipmentCatalogEntries } from '../data/equipmentCatalog.js';
import { listContainerDefinitions } from '../data/inventoryContainers.js';
import { CONFIDENCE_LABELS, ITEM_FLAGS, ITEM_KINDS, normalizeItem } from '../data/itemSchema.js';
import { JOB_DEFINITIONS } from '../data/jobs.js';
import { getMap, listMaps } from '../data/maps.js';
import { getPlace, isCoordinateInsidePlace, listPlaces, ZONE_CONNECTIONS } from '../data/places.js';
import { getPointOfInterest, listPointsOfInterest } from '../data/pointsOfInterest.js';
import { listQuestHooks } from '../data/questHooks.js';
import { RACES } from '../data/races.js';
import { listShopCatalogs } from '../data/shopCatalogs.js';
import {
    ATTRIBUTE_KEYS,
    DERIVED_STAT_KEYS,
    ELEMENT_KEYS,
    ENTITY_TYPES,
    EQUIPMENT_SLOTS,
    RESOURCE_KEYS,
    SKILL_KEYS,
} from '../data/systemConstants.js';
import { listSkillRankEntries, SKILL_RANK_CAP_RULES } from '../data/skillCaps.js';
import { getContainerCapacity } from './inventoryEngine.js';

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
    if (!isObject(state.discoveredPois)) issues.push('discoveredPois must be an object.');
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

    for (const poi of listPointsOfInterest()) {
        const place = getPlace(poi.placeId);
        if (!place) {
            issues.push(`${poi.id} references unknown place ${poi.placeId}.`);
            continue;
        }
        if (!isCoordinateInsidePlace(place, poi.coordinate)) {
            issues.push(`${poi.id} coordinate (${poi.coordinate.x}, ${poi.coordinate.y}) is outside ${place.name}.`);
        }
        if (!Array.isArray(poi.actions) || !poi.actions.length) {
            issues.push(`${poi.id} has no actions.`);
        }
    }

    for (const catalog of listShopCatalogs()) {
        const poi = getPointOfInterest(catalog.poiId);
        if (!poi) issues.push(`shop catalog ${catalog.name} references unknown POI ${catalog.poiId}.`);
        if (poi && !poi.actions.includes('shop')) issues.push(`shop catalog ${catalog.name} references POI without shop action.`);
    }

    for (const guild of listGuildServices()) {
        const poi = getPointOfInterest(guild.poiId);
        if (!poi) issues.push(`guild service ${guild.name} references unknown POI ${guild.poiId}.`);
        if (poi && !poi.actions.includes('guild')) issues.push(`guild service ${guild.name} references POI without guild action.`);
    }

    for (const hook of listQuestHooks()) {
        const poi = getPointOfInterest(hook.poiId);
        if (!poi) issues.push(`quest hook ${hook.name} references unknown POI ${hook.poiId}.`);
        if (poi && !poi.actions.includes('quest')) issues.push(`quest hook ${hook.name} references POI without quest action.`);
    }

    for (const entry of listEquipmentCatalogEntries()) {
        issues.push(...validateEquipmentCatalogEntry(entry).map((issue) => `equipmentCatalog.${entry.id}: ${issue}`));
    }

    for (const entry of listSkillRankEntries()) {
        if (!JOB_DEFINITIONS[entry.jobId]) issues.push(`skillCaps.${entry.jobId}.${entry.skillId} references unknown job.`);
        if (!SKILL_KEYS.includes(entry.skillId)) issues.push(`skillCaps.${entry.jobId}.${entry.skillId} references unknown skill.`);
        if (!SKILL_RANK_CAP_RULES[entry.rank]) issues.push(`skillCaps.${entry.jobId}.${entry.skillId} has unknown rank ${entry.rank}.`);
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
    if (!isObject(player.inventoryState)) issues.push('inventoryState must be an object.');
    if (isObject(player.inventoryState)) issues.push(...validateInventoryState(player.inventoryState).map((issue) => `inventoryState.${issue}`));
    if (!Array.isArray(player.inventory)) issues.push('inventory must be an array.');
    if (player.inventoryState?.containers?.inventory && player.inventory !== player.inventoryState.containers.inventory.items) {
        issues.push('inventory must reference inventoryState.containers.inventory.items.');
    }
    if (!Array.isArray(player.statuses)) issues.push('statuses must be an array.');

    return issues;
}

export function validateInventoryState(inventoryState) {
    const issues = [];
    if (!isObject(inventoryState.containers)) issues.push('containers must be an object.');
    if (!isObject(inventoryState.mogHouse)) issues.push('mogHouse must be an object.');

    for (const definition of listContainerDefinitions()) {
        const container = inventoryState.containers?.[definition.id];
        if (!container) {
            issues.push(`containers.${definition.id} is missing.`);
            continue;
        }
        if (!Array.isArray(container.items)) issues.push(`containers.${definition.id}.items must be an array.`);
        if (typeof container.unlocked !== 'boolean') issues.push(`containers.${definition.id}.unlocked must be boolean.`);
        if (Array.isArray(container.items) && container.items.length > getContainerCapacity(inventoryState, definition.id)) {
            issues.push(`containers.${definition.id} exceeds capacity.`);
        }
    }

    if (!Array.isArray(inventoryState.mogHouse?.placedFurniture)) issues.push('mogHouse.placedFurniture must be an array.');
    if (typeof inventoryState.mogHouse?.isInMogHouse !== 'boolean') issues.push('mogHouse.isInMogHouse must be boolean.');
    return issues;
}

export function validateEquipmentCatalogEntry(entry) {
    const issues = [];
    if (!isObject(entry)) return ['entry must be an object.'];

    try {
        normalizeItem(entry);
    } catch (error) {
        issues.push(`does not normalize cleanly: ${error.message}`);
    }

    if (!entry.id) issues.push('id is required.');
    if (!entry.name) issues.push('name is required.');
    if (entry.kind !== ITEM_KINDS.EQUIPMENT) issues.push('kind must be equipment.');
    if (!entry.equipmentSlot || !EQUIPMENT_SLOTS.includes(entry.equipmentSlot)) {
        issues.push(`equipmentSlot is unknown: ${entry.equipmentSlot}`);
    }
    if (!Array.isArray(entry.allowedSlots)) {
        issues.push('allowedSlots must be an array.');
    } else {
        for (const slot of entry.allowedSlots) {
            if (!EQUIPMENT_SLOTS.includes(slot)) issues.push(`allowedSlots contains unknown slot ${slot}.`);
        }
    }

    if (!Array.isArray(entry.flags)) {
        issues.push('flags must be an array.');
    } else {
        for (const flag of entry.flags) {
            if (!ITEM_FLAGS.includes(flag)) issues.push(`flags contains unknown flag ${flag}.`);
        }
    }

    issues.push(...validateEffectArray(entry.effects, 'effects'));
    issues.push(...validateLatentEffectArray(entry.latentEffects, 'latentEffects'));
    issues.push(...validateEffectLikeArray(entry.enchantments, 'enchantments'));
    issues.push(...validateEffectLikeArray(entry.augments, 'augments'));
    issues.push(...validateCharges(entry.charges, 'charges'));
    if (entry.weaponDelay !== null && entry.weaponDelay !== undefined && (!Number.isInteger(entry.weaponDelay) || entry.weaponDelay < 0)) {
        issues.push('weaponDelay must be a non-negative integer when present.');
    }

    issues.push(...validateRequirements(entry.requirements).map((issue) => `requirements.${issue}`));
    issues.push(...validateModifierBlock(entry.modifiers, 'modifiers'));
    issues.push(...validateMetadata(entry.metadata, 'metadata'));
    issues.push(...validateRequiredFieldMetadata(entry));
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

function validateRequirements(requirements) {
    const issues = [];
    if (!isObject(requirements)) return ['must be an object.'];
    if (!Number.isInteger(requirements.minLevel) || requirements.minLevel < 1) issues.push('minLevel must be an integer >= 1.');
    validateStringArray(requirements.allowedJobs, 'allowedJobs', issues);
    validateStringArray(requirements.allowedRaces, 'allowedRaces', issues);
    validateStringArray(requirements.allowedSexes, 'allowedSexes', issues);
    validateStringArray(requirements.requiredNations, 'requiredNations', issues);
    validateStringArray(requirements.requiredFame, 'requiredFame', issues);
    validateStringArray(requirements.requiredKeyItems, 'requiredKeyItems', issues);
    validateStringArray(requirements.requiredQuestFlags, 'requiredQuestFlags', issues);

    for (const jobId of requirements.allowedJobs ?? []) {
        if (!JOB_DEFINITIONS[jobId]) issues.push(`allowedJobs contains unknown job ${jobId}.`);
    }
    for (const raceId of requirements.allowedRaces ?? []) {
        if (!RACES[raceId]) issues.push(`allowedRaces contains unknown race ${raceId}.`);
    }
    return issues;
}

function validateModifierBlock(modifiers, label) {
    const issues = [];
    if (!isObject(modifiers)) return [`${label} must be an object.`];
    const allowedCategories = {
        attributes: ATTRIBUTE_KEYS,
        resources: RESOURCE_KEYS,
        derived: DERIVED_STAT_KEYS,
        resistances: ELEMENT_KEYS,
    };
    for (const category of Object.keys(modifiers)) {
        if (!allowedCategories[category]) {
            issues.push(`${label}.${category} is an unknown modifier category.`);
            continue;
        }
        if (!isObject(modifiers[category])) {
            issues.push(`${label}.${category} must be an object.`);
            continue;
        }
        for (const [key, value] of Object.entries(modifiers[category])) {
            if (!allowedCategories[category].includes(key)) issues.push(`${label}.${category}.${key} is an unknown modifier key.`);
            if (!Number.isFinite(Number(value))) issues.push(`${label}.${category}.${key} must be numeric.`);
        }
    }
    return issues;
}

function validateEffectArray(effects, label) {
    const issues = [];
    if (!Array.isArray(effects)) return [`${label} must be an array.`];
    effects.forEach((effect, index) => {
        const path = `${label}[${index}]`;
        if (!isObject(effect)) {
            issues.push(`${path} must be an object.`);
            return;
        }
        if (typeof effect.type !== 'string' || !effect.type.trim()) {
            issues.push(`${path}.type is required.`);
        }
        const hasModifiers = Object.hasOwn(effect, 'modifiers');
        if (effect.type === 'modifier' && !hasModifiers) {
            issues.push(`${path}.modifiers is required for modifier effects.`);
            return;
        }
        if (hasModifiers) {
            issues.push(...validateModifierBlock(effect.modifiers, `${path}.modifiers`));
            return;
        }
        if (effect.type !== 'modifier' && !hasBehaviorPayload(effect)) {
            issues.push(`${path} must include modifiers or a behavior payload.`);
        }
    });
    return issues;
}

function validateLatentEffectArray(latentEffects, label) {
    const issues = [];
    if (!Array.isArray(latentEffects)) return [`${label} must be an array.`];
    latentEffects.forEach((effect, index) => {
        const path = `${label}[${index}]`;
        if (!isObject(effect)) {
            issues.push(`${path} must be an object.`);
            return;
        }
        const hasCondition = Object.hasOwn(effect, 'condition') && effect.condition !== null && effect.condition !== undefined;
        const hasModifiers = Object.hasOwn(effect, 'modifiers');
        const hasBehavior = hasBehaviorPayload(effect);
        if (hasModifiers) issues.push(...validateModifierBlock(effect.modifiers, `${path}.modifiers`));
        if (!hasCondition && !hasModifiers && !hasBehavior) {
            issues.push(`${path} must include condition, modifiers, or a behavior payload.`);
        }
    });
    return issues;
}

function validateEffectLikeArray(entries, label) {
    const issues = [];
    if (!Array.isArray(entries)) return [`${label} must be an array.`];
    entries.forEach((entry, index) => {
        const path = `${label}[${index}]`;
        if (!isObject(entry)) {
            issues.push(`${path} must be an object.`);
            return;
        }
        const hasModifiers = Object.hasOwn(entry, 'modifiers');
        const hasTypedBehavior = typeof entry.type === 'string' && entry.type.trim() && hasBehaviorPayload(entry);
        if (hasModifiers) issues.push(...validateModifierBlock(entry.modifiers, `${path}.modifiers`));
        if (!hasModifiers && !hasTypedBehavior) {
            issues.push(`${path} must include modifiers or typed behavior/payload.`);
        }
    });
    return issues;
}

function hasBehaviorPayload(effect) {
    return isObject(effect.behavior) || isObject(effect.payload);
}

function validateCharges(charges, label) {
    const issues = [];
    if (charges === null || charges === undefined) return issues;
    if (!isObject(charges)) return [`${label} must be null or an object.`];
    validateNonNegativeInteger(charges.max, `${label}.max`, issues);
    validateNonNegativeInteger(charges.current, `${label}.current`, issues);
    validateNonNegativeInteger(charges.recastSeconds, `${label}.recastSeconds`, issues);
    validateNonNegativeInteger(charges.cooldownSeconds, `${label}.cooldownSeconds`, issues);
    if (Number.isInteger(charges.current) && Number.isInteger(charges.max) && charges.current > charges.max) {
        issues.push(`${label}.current cannot exceed ${label}.max.`);
    }
    return issues;
}

function validateNonNegativeInteger(value, label, issues) {
    if (!Number.isInteger(value) || value < 0) issues.push(`${label} must be a non-negative integer.`);
}

function validateRequiredFieldMetadata(entry) {
    const issues = [];
    if (!isObject(entry.fieldNotes)) return ['fieldNotes must be an object.'];
    const requiredFields = ['requirements', 'modifiers'];
    if (entry.weaponDelay !== null && entry.weaponDelay !== undefined) requiredFields.push('weaponDelay');
    for (const field of requiredFields) {
        issues.push(...validateMetadata(entry.fieldNotes?.[field], `fieldNotes.${field}`));
    }
    return issues;
}

function validateMetadata(metadata, label) {
    const issues = [];
    if (!isObject(metadata)) return [`${label} must be an object.`];
    if (!Object.values(CONFIDENCE_LABELS).includes(metadata.confidence)) issues.push(`${label}.confidence is invalid.`);
    if (!metadata.source) issues.push(`${label}.source is required.`);
    return issues;
}

function validateStringArray(value, label, issues) {
    if (!Array.isArray(value)) {
        issues.push(`${label} must be an array.`);
        return;
    }
    for (const entry of value) {
        if (typeof entry !== 'string' || !entry.trim()) issues.push(`${label} entries must be non-empty strings.`);
    }
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
