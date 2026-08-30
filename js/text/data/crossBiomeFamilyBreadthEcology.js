import {
    ECOLOGY_CONDITION_TYPES,
    ECOLOGY_DENSITIES,
    ECOLOGY_RARITIES,
} from './ecologyCatalog.js';
import { getPlace } from './places.js';

export const CROSS_BIOME_FAMILY_BREADTH_ECOLOGY_VERSION = 1;

const FAMILIES = Object.freeze({
    'family-ground-squirrel': family(
        'family-ground-squirrel',
        'Ground Squirrel',
        ['beast', 'small-mammal', 'burrower', 'herbivore'],
    ),
    'family-finch': family(
        'family-finch',
        'Finch',
        ['bird', 'passerine', 'seed-eater', 'small-bird'],
    ),
});

const SPECIES = Object.freeze({
    'species-coppergrass-loess-ground-squirrel': species({
        id: 'species-coppergrass-loess-ground-squirrel',
        name: 'Coppergrass Loess Ground Squirrel',
        familyId: 'family-ground-squirrel',
        ecosystem: 'beast',
        habitatTags: ['temperate-steppe', 'loess-bank', 'seedgrass', 'seasonal-basin'],
        behavior: behavior('wary', ['sight', 'sound'], 'colony'),
    }),
    'species-waymeet-cairn-ground-squirrel': species({
        id: 'species-waymeet-cairn-ground-squirrel',
        name: 'Waymeet Cairn Ground Squirrel',
        familyId: 'family-ground-squirrel',
        ecosystem: 'beast',
        habitatTags: ['plateau-grass', 'cairn-bank', 'road-verge', 'grass-rise'],
        behavior: behavior('wary', ['sight', 'sound'], 'colony'),
    }),
    'species-crownfields-hedgebank-ground-squirrel': species({
        id: 'species-crownfields-hedgebank-ground-squirrel',
        name: 'Crownfields Hedgebank Ground Squirrel',
        familyId: 'family-ground-squirrel',
        ecosystem: 'beast',
        habitatTags: ['hedgebank', 'hay-meadow', 'orchard-margin', 'rough-pasture'],
        behavior: behavior('wary', ['sight', 'sound'], 'colony'),
    }),
    'species-coppergrass-seed-finch': species({
        id: 'species-coppergrass-seed-finch',
        name: 'Coppergrass Seed Finch',
        familyId: 'family-finch',
        ecosystem: 'bird',
        habitatTags: ['seedgrass', 'bunchgrass', 'seasonal-basin', 'open-grassland'],
        behavior: behavior('wary', ['sight', 'sound'], 'flock'),
    }),
    'species-crownfields-hedgerow-finch': species({
        id: 'species-crownfields-hedgerow-finch',
        name: 'Crownfields Hedgerow Finch',
        familyId: 'family-finch',
        ecosystem: 'bird',
        habitatTags: ['hedgerow', 'orchard-margin', 'grain-strip', 'hay-meadow'],
        behavior: behavior('wary', ['sight', 'sound'], 'flock'),
    }),
    'species-east-elderwood-hazel-finch': species({
        id: 'species-east-elderwood-hazel-finch',
        name: 'Elderwood Hazel Finch',
        familyId: 'family-finch',
        ecosystem: 'bird',
        habitatTags: ['hazel-coppice', 'crabapple-thicket', 'forest-edge', 'woodland-glade'],
        behavior: behavior('wary', ['sight', 'sound'], 'flock'),
    }),
    'species-slatewater-thistle-finch': species({
        id: 'species-slatewater-thistle-finch',
        name: 'Slatewater Thistle Finch',
        familyId: 'family-finch',
        ecosystem: 'bird',
        habitatTags: ['montane-scrub', 'flowering-road-verge', 'grass-seed', 'serviceberry-brake'],
        behavior: behavior('wary', ['sight', 'sound'], 'flock'),
    }),
});

const POPULATIONS = Object.freeze({
    'population-coppergrass-loess-ground-squirrels': population({
        id: 'population-coppergrass-loess-ground-squirrels',
        speciesId: 'species-coppergrass-loess-ground-squirrel',
        placeId: 'coppergrass-steppe',
        biomeTags: ['loess-bank', 'bunchgrass', 'seasonal-basin-margin'],
        capacity: 10, density: 'high', rarity: 'common',
        respawn: regeneration(2, 2400),
        appearanceConditions: [{ type: 'timeWindow', startHour: 6, endHour: 19 }],
    }),
    'population-waymeet-cairn-ground-squirrels': population({
        id: 'population-waymeet-cairn-ground-squirrels',
        speciesId: 'species-waymeet-cairn-ground-squirrel',
        placeId: 'waymeet-south-marches',
        biomeTags: ['cairn-bank', 'grass-rise', 'road-verge'],
        capacity: 8, density: 'moderate', rarity: 'common',
        respawn: regeneration(2, 3000),
        appearanceConditions: [{ type: 'timeWindow', startHour: 7, endHour: 18 }],
    }),
    'population-crownfields-hedgebank-ground-squirrels': population({
        id: 'population-crownfields-hedgebank-ground-squirrels',
        speciesId: 'species-crownfields-hedgebank-ground-squirrel',
        placeId: 'crownfields',
        biomeTags: ['hedgebank', 'hay-meadow', 'orchard-margin'],
        capacity: 9, density: 'moderate', rarity: 'common',
        respawn: regeneration(2, 2700),
        appearanceConditions: [{ type: 'timeWindow', startHour: 6, endHour: 20 }],
    }),
    'population-coppergrass-seed-finches': population({
        id: 'population-coppergrass-seed-finches',
        speciesId: 'species-coppergrass-seed-finch',
        placeId: 'coppergrass-steppe',
        biomeTags: ['seedgrass', 'bunchgrass', 'seasonal-basin-margin'],
        capacity: 12, density: 'high', rarity: 'common',
        respawn: regeneration(3, 2100),
        appearanceConditions: [{ type: 'timeWindow', startHour: 6, endHour: 19 }],
    }),
    'population-crownfields-hedgerow-finches': population({
        id: 'population-crownfields-hedgerow-finches',
        speciesId: 'species-crownfields-hedgerow-finch',
        placeId: 'crownfields',
        biomeTags: ['hedgerow', 'orchard-margin', 'grain-strip'],
        capacity: 12, density: 'high', rarity: 'common',
        respawn: regeneration(3, 2100),
        appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 20 }],
    }),
    'population-east-elderwood-hazel-finches': population({
        id: 'population-east-elderwood-hazel-finches',
        speciesId: 'species-east-elderwood-hazel-finch',
        placeId: 'east-elderwood',
        biomeTags: ['hazel-coppice', 'crabapple-thicket', 'woodland-edge'],
        capacity: 10, density: 'moderate', rarity: 'common',
        respawn: regeneration(2, 2400),
        appearanceConditions: [{ type: 'timeWindow', startHour: 6, endHour: 19 }],
    }),
    'population-slatewater-thistle-finches': population({
        id: 'population-slatewater-thistle-finches',
        speciesId: 'species-slatewater-thistle-finch',
        placeId: 'slatewater-foothills',
        biomeTags: ['flowering-road-verge', 'montane-scrub', 'grass-seed'],
        capacity: 9, density: 'moderate', rarity: 'common',
        respawn: regeneration(2, 2700),
        appearanceConditions: [{ type: 'timeWindow', startHour: 6, endHour: 19 }],
    }),
});

export function getCrossBiomeFamilyBreadthEcologyFamily(id) { return FAMILIES[String(id ?? '').trim()] ?? null; }
export function getCrossBiomeFamilyBreadthSpecies(id) { return SPECIES[String(id ?? '').trim()] ?? null; }
export function getCrossBiomeFamilyBreadthPopulation(id) { return POPULATIONS[String(id ?? '').trim()] ?? null; }
export function getCrossBiomeFamilyBreadthGatheringSource() { return null; }

export function listCrossBiomeFamilyBreadthEcologyFamilies() { return Object.values(FAMILIES); }
export function listCrossBiomeFamilyBreadthSpecies() { return Object.values(SPECIES); }
export function listCrossBiomeFamilyBreadthPopulations() { return Object.values(POPULATIONS); }
export function listCrossBiomeFamilyBreadthGatheringSources() { return []; }

export function validateCrossBiomeFamilyBreadthEcology() {
    const issues = [];

    for (const entry of listCrossBiomeFamilyBreadthEcologyFamilies()) {
        if (!entry.id || !entry.name) issues.push('Cross-biome family requires stable id and name.');
    }
    for (const entry of listCrossBiomeFamilyBreadthSpecies()) {
        if (!getCrossBiomeFamilyBreadthEcologyFamily(entry.familyId)) {
            issues.push(`${entry.id} references unknown family ${entry.familyId}.`);
        }
        if (!['passive', 'wary'].includes(entry.behavior.aggression)) {
            issues.push(`${entry.id} must remain passive/wary in this repair.`);
        }
    }
    for (const entry of listCrossBiomeFamilyBreadthPopulations()) {
        if (!getCrossBiomeFamilyBreadthSpecies(entry.speciesId)) issues.push(`${entry.id} references unknown species ${entry.speciesId}.`);
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

function family(id, name, tags) {
    return deepFreeze({ id, name, tags: [...tags] });
}
function species({ id, name, familyId, ecosystem, habitatTags, behavior: behaviorDefinition }) {
    return deepFreeze({
        id,
        name,
        familyId,
        ecosystem,
        habitatTags: [...habitatTags],
        behavior: behaviorDefinition,
        encounterTemplateId: null,
    });
}
function behavior(aggression, senses, socialMode) {
    return deepFreeze({
        aggression,
        senses: [...senses],
        socialMode,
        linksWithFamilyIds: [],
    });
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
function regeneration(units, everySeconds) {
    return deepFreeze({ units, everySeconds });
}
function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
}
