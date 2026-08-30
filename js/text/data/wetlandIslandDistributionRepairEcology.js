import {
    ECOLOGY_CONDITION_TYPES,
    ECOLOGY_DENSITIES,
    ECOLOGY_RARITIES,
} from './ecologyCatalog.js';
import { getGreatMereSpecies } from './greatMereEcology.js';
import { getPlace } from './places.js';
import { getRegionalSpecies } from './regionalEcologyExpansion.js';
import { getStarfenDeltaSpecies } from './starfenDeltaEcology.js';

export const WETLAND_ISLAND_DISTRIBUTION_REPAIR_ECOLOGY_VERSION = 1;

const FAMILIES = Object.freeze({});
const SPECIES = Object.freeze({});

const POPULATIONS = Object.freeze({
    'population-east-starfen-mirecrest-herons': population({
        id: 'population-east-starfen-mirecrest-herons',
        speciesId: 'species-starfen-mire-heron',
        placeId: 'east-starfen',
        biomeTags: ['shallow-water', 'grass-island-margin', 'reed-channel'],
        capacity: 4, density: 'low', rarity: 'common',
        respawn: regeneration(1, 3600),
        appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 20 }],
    }),
    'population-east-starfen-reed-eels': population({
        id: 'population-east-starfen-reed-eels',
        speciesId: 'species-starfen-reed-eel',
        placeId: 'east-starfen',
        biomeTags: ['reed-channel', 'slow-water', 'fen-pool'],
        capacity: 8, density: 'moderate', rarity: 'common',
        respawn: regeneration(2, 2100),
    }),
    'population-east-starfen-reed-crabs': population({
        id: 'population-east-starfen-reed-crabs',
        speciesId: 'species-starfen-reed-crab',
        placeId: 'east-starfen',
        biomeTags: ['mud-bank', 'shallow-water', 'reed-margin'],
        capacity: 7, density: 'moderate', rarity: 'common',
        respawn: regeneration(2, 2400),
    }),
    'population-east-starfen-glasswing-dragonflies': population({
        id: 'population-east-starfen-glasswing-dragonflies',
        speciesId: 'species-great-mere-glasswing-dragonfly',
        placeId: 'east-starfen',
        biomeTags: ['reed-margin', 'flowering-marsh', 'shallow-water'],
        capacity: 10, density: 'high', rarity: 'common',
        respawn: regeneration(2, 1800),
        appearanceConditions: [{ type: 'timeWindow', startHour: 7, endHour: 19 }],
    }),
    'population-reedcrown-silver-perch': population({
        id: 'population-reedcrown-silver-perch',
        speciesId: 'species-great-mere-silver-perch',
        placeId: 'reedcrown-isle',
        biomeTags: ['clear-shallows', 'reed-margin', 'shoal-water'],
        capacity: 9, density: 'moderate', rarity: 'common',
        respawn: regeneration(2, 2400),
    }),
    'population-reedcrown-glasswing-dragonflies': population({
        id: 'population-reedcrown-glasswing-dragonflies',
        speciesId: 'species-great-mere-glasswing-dragonfly',
        placeId: 'reedcrown-isle',
        biomeTags: ['reed-crown', 'shallow-water', 'nesting-island-margin'],
        capacity: 8, density: 'moderate', rarity: 'common',
        respawn: regeneration(2, 2400),
        appearanceConditions: [{ type: 'timeWindow', startHour: 7, endHour: 19 }],
    }),
    'population-reedcrown-fen-ducks': population({
        id: 'population-reedcrown-fen-ducks',
        speciesId: 'species-starfen-fen-duck',
        placeId: 'reedcrown-isle',
        biomeTags: ['reed-crown', 'clear-shallows', 'nesting-island'],
        capacity: 6, density: 'moderate', rarity: 'common',
        respawn: regeneration(1, 3600),
        appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 20 }],
    }),
    'population-lower-delta-saltflat-mud-crabs': population({
        id: 'population-lower-delta-saltflat-mud-crabs',
        speciesId: 'species-delta-saltflat-mud-crab',
        placeId: 'starfen-lower-delta',
        biomeTags: ['mud-bank', 'brackish-creek', 'levee-margin'],
        capacity: 8, density: 'moderate', rarity: 'common',
        respawn: regeneration(2, 2700),
    }),
});

export function getWetlandIslandDistributionRepairEcologyFamily(id) { return FAMILIES[String(id ?? '').trim()] ?? null; }
export function getWetlandIslandDistributionRepairSpecies(id) { return SPECIES[String(id ?? '').trim()] ?? null; }
export function getWetlandIslandDistributionRepairPopulation(id) { return POPULATIONS[String(id ?? '').trim()] ?? null; }
export function getWetlandIslandDistributionRepairGatheringSource() { return null; }

export function listWetlandIslandDistributionRepairEcologyFamilies() { return Object.values(FAMILIES); }
export function listWetlandIslandDistributionRepairSpecies() { return Object.values(SPECIES); }
export function listWetlandIslandDistributionRepairPopulations() { return Object.values(POPULATIONS); }
export function listWetlandIslandDistributionRepairGatheringSources() { return []; }

export function validateWetlandIslandDistributionRepairEcology() {
    const issues = [];
    const resolveSpecies = (id) =>
        getWetlandIslandDistributionRepairSpecies(id)
        ?? getRegionalSpecies(id)
        ?? getGreatMereSpecies(id)
        ?? getStarfenDeltaSpecies(id);

    for (const entry of listWetlandIslandDistributionRepairPopulations()) {
        if (!resolveSpecies(entry.speciesId)) issues.push(`${entry.id} references unknown species ${entry.speciesId}.`);
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!Number.isInteger(entry.capacity) || entry.capacity <= 0) issues.push(`${entry.id} requires positive capacity.`);
        if (!ECOLOGY_DENSITIES.includes(entry.density)) issues.push(`${entry.id} has unknown density ${entry.density}.`);
        if (!ECOLOGY_RARITIES.includes(entry.rarity)) issues.push(`${entry.id} has unknown rarity ${entry.rarity}.`);
        for (const condition of entry.appearanceConditions) {
            if (!ECOLOGY_CONDITION_TYPES.includes(condition?.type)) issues.push(`${entry.id} has unknown condition type ${condition?.type}.`);
        }
    }
    return issues;
}

function population({ id, speciesId, placeId, biomeTags, capacity, density, rarity, respawn, appearanceConditions = [] }) {
    return deepFreeze({
        id,
        speciesId,
        placeId,
        biomeTags: [...biomeTags],
        capacity,
        density,
        rarity,
        respawn,
        appearanceConditions: [...appearanceConditions],
        namedVariantHooks: [],
    });
}
function regeneration(units, everySeconds) { return deepFreeze({ units, everySeconds }); }
function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
}
