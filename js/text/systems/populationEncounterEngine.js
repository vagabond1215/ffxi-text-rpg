import {
    getCanonicalPopulation,
    getCanonicalSpecies,
    listCanonicalPopulations,
} from '../data/ecologyRegistry.js';
import { actionFailure, actionSuccess } from './actionResult.js';
import { startEncounter } from './combatActionEngine.js';
import { getPopulationAvailability } from './ecologyEngine.js';
import { emitSemanticEvent } from './semanticEventEngine.js';

export const POPULATION_ENCOUNTER_VERSION = 1;
const TRACKABLE_AGGRESSIONS = Object.freeze(['passive', 'wary', 'territorial']);

export function listPopulationEncounterOptions(state, options = {}) {
    const placeId = options.placeId ?? state?.currentPlaceId ?? null;
    if (!placeId) return [];

    return listCanonicalPopulations()
        .filter((population) => population.placeId === placeId)
        .map((population) => {
            const species = getCanonicalSpecies(population.speciesId);
            if (!species?.encounterTemplateId) return null;
            if (!TRACKABLE_AGGRESSIONS.includes(species.behavior?.aggression)) return null;
            const availability = getPopulationAvailability(state, population.id);
            if (!availability) return null;
            return Object.freeze({
                populationId: population.id,
                speciesId: species.id,
                name: species.name,
                encounterTemplateId: species.encounterTemplateId,
                aggression: species.behavior.aggression,
                density: population.density,
                rarity: population.rarity,
                active: availability.active,
                availableUnits: availability.availableUnits,
                capacity: availability.capacity,
                placeId: population.placeId,
            });
        })
        .filter(Boolean)
        .filter((entry) => options.includeInactive === true || entry.active)
        .filter((entry) => options.includeDepleted === true || entry.availableUnits > 0);
}

export function startPopulationEncounter(state, query, options = {}) {
    if (!state || typeof state !== 'object') {
        return failure('population-encounter.state-required', {}, 'Population encounter discovery requires game state.');
    }
    if (state.activeBattle?.phase === 'active') {
        return failure('population-encounter.battle-active', {}, 'You cannot track another animal while already in battle.');
    }

    const population = resolvePopulationQuery(state, query);
    if (!population) {
        return failure('population-encounter.not-found', { query: String(query ?? '') }, 'No trackable wildlife population here matches that query.');
    }
    const species = getCanonicalSpecies(population.speciesId);
    if (!species?.encounterTemplateId || !TRACKABLE_AGGRESSIONS.includes(species.behavior?.aggression)) {
        return failure('population-encounter.not-trackable', {
            populationId: population.id,
            speciesId: population.speciesId,
        }, `${species?.name ?? population.speciesId} is not available through deliberate wildlife tracking.`);
    }
    if (population.placeId !== state.currentPlaceId) {
        return failure('population-encounter.wrong-place', {
            populationId: population.id,
            requiredPlaceId: population.placeId,
            currentPlaceId: state.currentPlaceId ?? null,
        }, `${species.name} is not a local population in the current place.`);
    }

    const availability = getPopulationAvailability(state, population.id);
    if (!availability?.active) {
        return failure('population-encounter.inactive', { populationId: population.id }, `${species.name} is not currently active here.`);
    }
    if (availability.availableUnits < 1) {
        return failure('population-encounter.depleted', { populationId: population.id }, `${species.name} signs are too scarce to locate another animal right now.`);
    }

    const encounter = startEncounter(state, species.encounterTemplateId, {
        rng: options.rng,
        rngSeed: options.rngSeed,
        source: 'population',
        reason: `you deliberately located ${species.name} sign`,
    });
    if (!encounter.ok) {
        return failure('population-encounter.start-failed', {
            populationId: population.id,
            enemyId: species.encounterTemplateId,
        }, encounter.message ?? `Unable to start an encounter with ${species.name}.`);
    }

    state.activeBattle.sourcePopulationId = population.id;
    state.activeBattle.sourceSpeciesId = species.id;
    state.activeBattle.sourcePopulationConsumed = false;

    const event = emitSemanticEvent(state, 'ecology.population-encountered', {
        populationId: population.id,
        speciesId: species.id,
        placeId: population.placeId,
        battleId: state.activeBattle.id,
        availableUnits: availability.availableUnits,
    }, { source: 'populationEncounterEngine' });

    return actionSuccess({
        action: 'population-encounter.start',
        code: 'population-encounter.started',
        outcome: 'encountered',
        data: {
            populationId: population.id,
            speciesId: species.id,
            battleId: state.activeBattle.id,
            availableUnits: availability.availableUnits,
            eventId: event.id,
        },
        display: {
            text: `You locate ${species.name} sign and deliberately close for an encounter. The population is only reduced if the animal is actually defeated.`,
        },
    });
}

export function describePopulationEncounterOptions(state) {
    const entries = listPopulationEncounterOptions(state, { includeInactive: true, includeDepleted: true });
    if (!entries.length) return 'No trackable wildlife populations are recorded here.';

    const lines = ['Trackable wildlife:'];
    for (const entry of entries) {
        const status = !entry.active
            ? 'not active at this time'
            : entry.availableUnits < 1
                ? 'signs exhausted for now'
                : `${entry.availableUnits}/${entry.capacity} available`;
        lines.push(`- ${entry.name} [${entry.aggression}; ${entry.density}; ${entry.rarity}] — ${status} (${entry.populationId})`);
    }
    lines.push('Use `hunt <name or population id>` to deliberately locate one. Hostile populations remain governed by ordinary aggro/encounter rules.');
    return lines.join('\n');
}

function resolvePopulationQuery(state, query) {
    const normalized = normalize(query);
    const local = listCanonicalPopulations().filter((population) => population.placeId === state.currentPlaceId);
    if (!normalized) {
        return local.find((population) => {
            const species = getCanonicalSpecies(population.speciesId);
            return Boolean(species?.encounterTemplateId && TRACKABLE_AGGRESSIONS.includes(species.behavior?.aggression));
        }) ?? null;
    }

    return local.find((population) => {
        const species = getCanonicalSpecies(population.speciesId);
        if (!species) return false;
        return normalize(population.id) === normalized
            || normalize(species.id) === normalized
            || normalize(species.name) === normalized
            || normalize(species.name).includes(normalized);
    }) ?? null;
}

function normalize(value) {
    return String(value ?? '').trim().toLowerCase().replace(/\s+/g, '-');
}

function failure(code, data, text) {
    return actionFailure({
        action: 'population-encounter.start',
        code,
        outcome: 'blocked',
        data,
        display: { text },
    });
}
