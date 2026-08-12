import {
    getGatheringSource,
    getPopulation,
    listGatheringSources,
    listPopulations,
} from '../data/ecologyCatalog.js';
import { getResourceItem } from '../data/resourceItems.js';
import { addItemToContainer } from './inventoryEngine.js';
import { actionFailure, actionSuccess } from './actionResult.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import { ensureWorldTimeState } from './worldTimeEngine.js';

export const ECOLOGY_STATE_VERSION = 1;
const DAY_SECONDS = 86400;
const HOUR_SECONDS = 3600;

export function createEcologyState(options = {}) {
    return {
        version: ECOLOGY_STATE_VERSION,
        populations: cloneStateMap(options.populations),
        gatheringSources: cloneStateMap(options.gatheringSources),
    };
}

export function ensureEcologyState(state) {
    if (!state || typeof state !== 'object') throw new Error('Ecology state requires game state.');
    if (!state.ecology || typeof state.ecology !== 'object' || Array.isArray(state.ecology)) {
        state.ecology = createEcologyState();
    }
    if (!state.ecology.populations || typeof state.ecology.populations !== 'object' || Array.isArray(state.ecology.populations)) {
        state.ecology.populations = {};
    }
    if (!state.ecology.gatheringSources || typeof state.ecology.gatheringSources !== 'object' || Array.isArray(state.ecology.gatheringSources)) {
        state.ecology.gatheringSources = {};
    }
    const issues = validateEcologyState(state.ecology);
    if (issues.length) throw new Error(issues.join(' '));
    return state.ecology;
}

export function getPopulationAvailability(state, populationId) {
    const definition = getPopulation(populationId);
    if (!definition) return null;
    const record = ensurePopulationRecord(state, definition);
    reconcilePoolRecord(state, record, definition.capacity, definition.respawn);
    return populationSnapshot(state, definition, record);
}

export function consumePopulationUnits(state, populationId, quantity = 1) {
    const definition = getPopulation(populationId);
    if (!definition) return failure('ecology.population-not-found', { populationId }, `Unknown population: ${populationId}`);
    if (!conditionsMet(state, definition.appearanceConditions)) {
        return failure('ecology.population-inactive', { populationId }, `${definition.id} is not currently active.`);
    }

    const record = ensurePopulationRecord(state, definition);
    reconcilePoolRecord(state, record, definition.capacity, definition.respawn);
    const amount = normalizeQuantity(quantity);
    if (amount > record.availableUnits) {
        return failure('ecology.population-depleted', {
            populationId,
            requested: amount,
            available: record.availableUnits,
        }, `${definition.id} has only ${record.availableUnits} available population units.`);
    }

    const now = ensureWorldTimeState(state).totalSeconds;
    record.availableUnits -= amount;
    record.lastUpdatedAtWorldSeconds = now;
    const event = emitSemanticEvent(state, 'ecology.population-consumed', {
        populationId: definition.id,
        speciesId: definition.speciesId,
        placeId: definition.placeId,
        quantity: amount,
        remaining: record.availableUnits,
    }, { source: 'ecologyEngine' });

    return actionSuccess({
        action: 'ecology.population-consume',
        code: 'ecology.population-consumed',
        outcome: 'consumed',
        data: {
            population: populationSnapshot(state, definition, record),
            quantity: amount,
            eventId: event.id,
        },
        display: { text: `${definition.id} population reduced by ${amount}.` },
    });
}

export function getGatheringSourceAvailability(state, sourceId) {
    const definition = getGatheringSource(sourceId);
    if (!definition) return null;
    const record = ensureGatheringSourceRecord(state, definition);
    reconcilePoolRecord(state, record, definition.capacity, definition.regeneration);
    return gatheringSourceSnapshot(state, definition, record);
}

export function harvestGatheringSource(state, sourceId, options = {}) {
    const definition = getGatheringSource(sourceId);
    if (!definition) return failure('ecology.source-not-found', { sourceId }, `Unknown gathering source: ${sourceId}`);
    if (!options.ignorePlace && state.currentPlaceId !== definition.placeId) {
        return failure('ecology.source-wrong-place', {
            sourceId,
            requiredPlaceId: definition.placeId,
            currentPlaceId: state.currentPlaceId ?? null,
        }, `${definition.name} is not available in the current place.`);
    }
    if (!conditionsMet(state, definition.appearanceConditions)) {
        return failure('ecology.source-inactive', { sourceId }, `${definition.name} is not currently available.`);
    }

    const toolTags = new Set((options.toolTags ?? []).map(String));
    const missingTools = definition.requiredToolTags.filter((tag) => !toolTags.has(tag));
    if (missingTools.length) {
        return failure('ecology.tool-required', { sourceId, missingTools }, `${definition.name} requires tool capability: ${missingTools.join(', ')}.`);
    }
    const proficiency = Number(options.proficiencies?.[definition.proficiencyId] ?? 0);
    if (proficiency < definition.minProficiency) {
        return failure('ecology.proficiency-required', {
            sourceId,
            proficiencyId: definition.proficiencyId,
            required: definition.minProficiency,
            actual: proficiency,
        }, `${definition.name} requires ${definition.proficiencyId} proficiency ${definition.minProficiency}.`);
    }

    const record = ensureGatheringSourceRecord(state, definition);
    reconcilePoolRecord(state, record, definition.capacity, definition.regeneration);
    const amount = normalizeQuantity(options.quantity ?? 1);
    if (amount > record.availableUnits) {
        return failure('ecology.source-depleted', {
            sourceId,
            requested: amount,
            available: record.availableUnits,
        }, `${definition.name} has only ${record.availableUnits} recoverable units available.`);
    }

    const template = getResourceItem(definition.outputItemId);
    if (!template) return failure('ecology.output-missing', { sourceId, itemId: definition.outputItemId }, `${definition.name} has no valid output item.`);
    const worldTimeSeconds = ensureWorldTimeState(state).totalSeconds;
    const item = {
        ...template,
        quantity: amount,
        provenance: [{
            type: definition.type,
            sourceId: definition.id,
            placeId: definition.placeId,
            action: definition.action,
            data: { worldTimeSeconds, units: amount },
        }],
    };
    const inventoryState = state.player?.inventoryState ?? state.inventoryState;
    if (!inventoryState) return failure('ecology.inventory-missing', { sourceId }, 'No inventory state is available for gathered material.');
    const addResult = addItemToContainer(inventoryState, options.containerId ?? 'inventory', item, options.inventoryContext ?? {});
    if (!addResult.ok) {
        return failure('ecology.storage-failed', { sourceId, itemId: item.id, reason: addResult.reason }, addResult.reason);
    }

    record.availableUnits -= amount;
    record.lastUpdatedAtWorldSeconds = worldTimeSeconds;
    const event = emitSemanticEvent(state, 'ecology.resource-harvested', {
        sourceId: definition.id,
        placeId: definition.placeId,
        action: definition.action,
        itemId: item.id,
        quantity: amount,
        remaining: record.availableUnits,
    }, { source: 'ecologyEngine' });

    return actionSuccess({
        action: 'ecology.harvest',
        code: 'ecology.resource-harvested',
        outcome: 'harvested',
        data: {
            source: gatheringSourceSnapshot(state, definition, record),
            item: addResult.item,
            quantity: amount,
            eventId: event.id,
        },
        display: { text: `Recovered ${amount} ${template.name} from ${definition.name}.` },
    });
}

export function listActiveNamedVariantHooks(state, populationId) {
    const definition = getPopulation(populationId);
    if (!definition || !conditionsMet(state, definition.appearanceConditions)) return [];
    return definition.namedVariantHooks
        .filter((hook) => conditionsMet(state, hook.conditions))
        .map((hook) => ({ id: hook.id, name: hook.name, populationId: definition.id, speciesId: definition.speciesId }));
}

export function isPopulationActive(state, populationId) {
    const definition = getPopulation(populationId);
    return Boolean(definition && conditionsMet(state, definition.appearanceConditions));
}

export function isGatheringSourceActive(state, sourceId) {
    const definition = getGatheringSource(sourceId);
    return Boolean(definition && conditionsMet(state, definition.appearanceConditions));
}

export function reconcileEcologyState(state) {
    for (const population of listPopulations()) {
        if (state.ecology?.populations?.[population.id]) getPopulationAvailability(state, population.id);
    }
    for (const source of listGatheringSources()) {
        if (state.ecology?.gatheringSources?.[source.id]) getGatheringSourceAvailability(state, source.id);
    }
    return ensureEcologyState(state);
}

export function validateEcologyState(ecologyState) {
    if (!ecologyState || typeof ecologyState !== 'object' || Array.isArray(ecologyState)) return ['ecology must be an object.'];
    const issues = [];
    if (ecologyState.version !== ECOLOGY_STATE_VERSION) issues.push(`ecology.version must be ${ECOLOGY_STATE_VERSION}.`);
    issues.push(...validateStateMap(ecologyState.populations, 'ecology.populations', getPopulation));
    issues.push(...validateStateMap(ecologyState.gatheringSources, 'ecology.gatheringSources', getGatheringSource));
    return issues;
}

function ensurePopulationRecord(state, definition) {
    const ecology = ensureEcologyState(state);
    return ensurePoolRecord(state, ecology.populations, definition.id, definition.capacity);
}

function ensureGatheringSourceRecord(state, definition) {
    const ecology = ensureEcologyState(state);
    return ensurePoolRecord(state, ecology.gatheringSources, definition.id, definition.capacity);
}

function ensurePoolRecord(state, records, id, capacity) {
    if (!records[id]) {
        records[id] = {
            id,
            availableUnits: capacity,
            lastUpdatedAtWorldSeconds: ensureWorldTimeState(state).totalSeconds,
        };
    }
    return records[id];
}

function reconcilePoolRecord(state, record, capacity, rule) {
    const now = ensureWorldTimeState(state).totalSeconds;
    if (record.availableUnits >= capacity) {
        record.availableUnits = capacity;
        record.lastUpdatedAtWorldSeconds = now;
        return record;
    }
    const elapsed = Math.max(0, now - record.lastUpdatedAtWorldSeconds);
    const cycles = Math.floor(elapsed / rule.everySeconds);
    if (cycles <= 0) return record;
    record.availableUnits = Math.min(capacity, record.availableUnits + cycles * rule.units);
    record.lastUpdatedAtWorldSeconds = record.availableUnits >= capacity
        ? now
        : record.lastUpdatedAtWorldSeconds + cycles * rule.everySeconds;
    return record;
}

function populationSnapshot(state, definition, record) {
    return {
        id: definition.id,
        speciesId: definition.speciesId,
        placeId: definition.placeId,
        capacity: definition.capacity,
        availableUnits: record.availableUnits,
        density: definition.density,
        rarity: definition.rarity,
        active: conditionsMet(state, definition.appearanceConditions),
        lastUpdatedAtWorldSeconds: record.lastUpdatedAtWorldSeconds,
    };
}

function gatheringSourceSnapshot(state, definition, record) {
    return {
        id: definition.id,
        name: definition.name,
        type: definition.type,
        placeId: definition.placeId,
        action: definition.action,
        outputItemId: definition.outputItemId,
        capacity: definition.capacity,
        availableUnits: record.availableUnits,
        active: conditionsMet(state, definition.appearanceConditions),
        lastUpdatedAtWorldSeconds: record.lastUpdatedAtWorldSeconds,
    };
}

function conditionsMet(state, conditions = []) {
    const totalSeconds = ensureWorldTimeState(state).totalSeconds;
    const dayNumber = Math.floor(totalSeconds / DAY_SECONDS) + 1;
    const secondsInDay = ((totalSeconds % DAY_SECONDS) + DAY_SECONDS) % DAY_SECONDS;
    const hour = Math.floor(secondsInDay / HOUR_SECONDS);
    return conditions.every((condition) => {
        if (condition.type === 'timeWindow') {
            return condition.startHour < condition.endHour
                ? hour >= condition.startHour && hour < condition.endHour
                : hour >= condition.startHour || hour < condition.endHour;
        }
        if (condition.type === 'dayModulo') return dayNumber % condition.modulo === condition.remainder;
        if (condition.type === 'requiresFlag') return Boolean(state.flags?.[condition.flagId]);
        return false;
    });
}

function validateStateMap(records, label, lookupDefinition) {
    if (!records || typeof records !== 'object' || Array.isArray(records)) return [`${label} must be an object.`];
    const issues = [];
    for (const [id, record] of Object.entries(records)) {
        if (!lookupDefinition(id)) issues.push(`${label}.${id} references unknown definition.`);
        if (!record || typeof record !== 'object' || Array.isArray(record)) {
            issues.push(`${label}.${id} must be an object.`);
            continue;
        }
        if (record.id !== id) issues.push(`${label}.${id}.id must match its key.`);
        if (!Number.isInteger(record.availableUnits) || record.availableUnits < 0) issues.push(`${label}.${id}.availableUnits must be a non-negative integer.`);
        if (!Number.isInteger(record.lastUpdatedAtWorldSeconds) || record.lastUpdatedAtWorldSeconds < 0) issues.push(`${label}.${id}.lastUpdatedAtWorldSeconds must be a non-negative integer.`);
    }
    return issues;
}

function cloneStateMap(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).map(([id, record]) => [id, { ...record }]));
}

function normalizeQuantity(value) {
    return Math.max(1, Number.parseInt(value, 10) || 1);
}

function failure(code, data, text) {
    return actionFailure({ action: code.startsWith('ecology.population') ? 'ecology.population-consume' : 'ecology.harvest', code, outcome: 'blocked', data, display: { text } });
}
