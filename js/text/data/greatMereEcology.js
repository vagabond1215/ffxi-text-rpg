import { ECOLOGY_CONDITION_TYPES, ECOLOGY_DENSITIES, ECOLOGY_RARITIES, ECOLOGY_SOURCE_TYPES } from './ecologyCatalog.js';
import { getGreatMereResourceItem } from './greatMereResourceItems.js';
import { getPlace } from './places.js';
import { getRegionalEcologyFamily } from './regionalEcologyExpansion.js';
import { RESOURCE_RECOVERY_ACTIONS } from './resourceProvenance.js';

export const GREAT_MERE_ECOLOGY_VERSION = 1;

const FAMILIES = Object.freeze({
    'family-lake-perch': family('family-lake-perch', 'Lake Perch', ['fish', 'shoaling', 'freshwater']),
    'family-lake-pike': family('family-lake-pike', 'Lake Pike', ['fish', 'predator', 'freshwater']),
    'family-crayfish': family('family-crayfish', 'Crayfish', ['crustacean', 'omnivore', 'freshwater']),
    'family-grebe': family('family-grebe', 'Grebe', ['bird', 'diving-bird', 'freshwater']),
    'family-dragonfly': family('family-dragonfly', 'Dragonfly', ['insect', 'predator', 'freshwater']),
});

const SPECIES = Object.freeze({
    'species-great-mere-silver-perch': species({
        id: 'species-great-mere-silver-perch', name: 'Great Mere Silver Perch', familyId: 'family-lake-perch', ecosystem: 'fish',
        habitatTags: ['freshwater-lake', 'reed-margin', 'shoal-water'],
        behavior: behavior('passive', ['vibration'], 'shoal', []),
    }),
    'species-great-mere-reed-pike': species({
        id: 'species-great-mere-reed-pike', name: 'Great Mere Reed Pike', familyId: 'family-lake-pike', ecosystem: 'fish',
        habitatTags: ['freshwater-lake', 'reed-edge', 'dropoff'],
        behavior: behavior('wary', ['vibration'], 'solitary', ['family-lake-perch']),
    }),
    'species-great-mere-blueclaw-crayfish': species({
        id: 'species-great-mere-blueclaw-crayfish', name: 'Blueclaw Crayfish', familyId: 'family-crayfish', ecosystem: 'crustacean',
        habitatTags: ['rocky-shallows', 'reed-margin', 'freshwater-lake'],
        behavior: behavior('passive', ['vibration'], 'cluster', []),
    }),
    'species-great-mere-crown-grebe': species({
        id: 'species-great-mere-crown-grebe', name: 'Crown Grebe', familyId: 'family-grebe', ecosystem: 'bird',
        habitatTags: ['open-water', 'nesting-island', 'reed-margin'],
        behavior: behavior('wary', ['sight', 'sound'], 'pair', ['family-lake-perch']),
    }),
    'species-great-mere-glasswing-dragonfly': species({
        id: 'species-great-mere-glasswing-dragonfly', name: 'Glasswing Dragonfly', familyId: 'family-dragonfly', ecosystem: 'insect',
        habitatTags: ['reed-margin', 'shallow-water', 'summer-air'],
        behavior: behavior('passive', ['sight'], 'swarm', []),
    }),
    'species-great-mere-basking-turtle': species({
        id: 'species-great-mere-basking-turtle', name: 'Great Mere Basking Turtle', familyId: 'family-turtle', ecosystem: 'reptile',
        habitatTags: ['sun-warmed-rock', 'reed-margin', 'freshwater-lake'],
        behavior: behavior('passive', ['sight'], 'basking-group', []),
    }),
    'species-great-mere-cloudwater-mussel': species({
        id: 'species-great-mere-cloudwater-mussel', name: 'Cloudwater Mussel', familyId: 'family-mussel', ecosystem: 'mollusk',
        habitatTags: ['clear-shallows', 'gravel-bed', 'freshwater-lake'],
        behavior: behavior('passive', [], 'bed', []),
    }),
});

const POPULATIONS = Object.freeze({
    'population-great-mere-silver-perch': population({
        id: 'population-great-mere-silver-perch', speciesId: 'species-great-mere-silver-perch', placeId: 'great-mere-westshore',
        biomeTags: ['reed-margin', 'shoal-water'], capacity: 12, density: 'high', rarity: 'common', respawn: regeneration(3, 1800),
    }),
    'population-great-mere-reed-pike': population({
        id: 'population-great-mere-reed-pike', speciesId: 'species-great-mere-reed-pike', placeId: 'great-mere-westshore',
        biomeTags: ['reed-edge', 'dropoff'], capacity: 4, density: 'low', rarity: 'uncommon', respawn: regeneration(1, 5400),
        appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 10 }],
    }),
    'population-great-mere-blueclaw-crayfish': population({
        id: 'population-great-mere-blueclaw-crayfish', speciesId: 'species-great-mere-blueclaw-crayfish', placeId: 'great-mere-westshore',
        biomeTags: ['rocky-shallows', 'reed-margin'], capacity: 9, density: 'high', rarity: 'common', respawn: regeneration(2, 2400),
    }),
    'population-reedcrown-crown-grebes': population({
        id: 'population-reedcrown-crown-grebes', speciesId: 'species-great-mere-crown-grebe', placeId: 'reedcrown-isle',
        biomeTags: ['nesting-island', 'open-water'], capacity: 6, density: 'moderate', rarity: 'common', respawn: regeneration(1, 3600),
        appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 20 }],
    }),
    'population-great-mere-glasswing-dragonflies': population({
        id: 'population-great-mere-glasswing-dragonflies', speciesId: 'species-great-mere-glasswing-dragonfly', placeId: 'great-mere-westshore',
        biomeTags: ['reed-margin', 'shallow-water'], capacity: 12, density: 'high', rarity: 'common', respawn: regeneration(3, 1800),
        appearanceConditions: [{ type: 'timeWindow', startHour: 7, endHour: 19 }],
    }),
    'population-reedcrown-basking-turtles': population({
        id: 'population-reedcrown-basking-turtles', speciesId: 'species-great-mere-basking-turtle', placeId: 'reedcrown-isle',
        biomeTags: ['sun-warmed-rock', 'reed-margin'], capacity: 5, density: 'moderate', rarity: 'common', respawn: regeneration(1, 3600),
        appearanceConditions: [{ type: 'timeWindow', startHour: 8, endHour: 18 }],
    }),
    'population-great-mere-cloudwater-mussels': population({
        id: 'population-great-mere-cloudwater-mussels', speciesId: 'species-great-mere-cloudwater-mussel', placeId: 'great-mere-westshore',
        biomeTags: ['clear-shallows', 'gravel-bed'], capacity: 12, density: 'high', rarity: 'common', respawn: regeneration(2, 3600),
    }),
});

const SOURCES = Object.freeze({
    'source-great-mere-silver-perch-shoal': source({
        id: 'source-great-mere-silver-perch-shoal', name: 'Silver Perch Shoal', type: 'fishing', placeId: 'great-mere-westshore',
        biomeTags: ['shoal-water', 'reed-margin'], action: 'fish', outputItemId: 'item-great-mere-silver-perch', capacity: 12,
        regeneration: regeneration(3, 1800), requiredToolTags: ['fishing'], proficiencyId: 'fishing',
    }),
    'source-great-mere-reed-pike-dropoff': source({
        id: 'source-great-mere-reed-pike-dropoff', name: 'Reed Pike Dropoff', type: 'fishing', placeId: 'great-mere-westshore',
        biomeTags: ['reed-edge', 'dropoff'], action: 'fish', outputItemId: 'item-great-mere-reed-pike', capacity: 5,
        regeneration: regeneration(1, 3600), requiredToolTags: ['fishing'], proficiencyId: 'fishing', minProficiency: 2,
        appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 10 }],
    }),
    'source-great-mere-blueclaw-trap-bed': source({
        id: 'source-great-mere-blueclaw-trap-bed', name: 'Blueclaw Trap Bed', type: 'fishing', placeId: 'great-mere-westshore',
        biomeTags: ['rocky-shallows', 'reed-margin'], action: 'trap', outputItemId: 'item-great-mere-blueclaw-crayfish', capacity: 8,
        regeneration: regeneration(2, 2400), requiredToolTags: ['fishing'], proficiencyId: 'fishing',
    }),
    'source-great-mere-cloudwater-mussel-bed': source({
        id: 'source-great-mere-cloudwater-mussel-bed', name: 'Cloudwater Mussel Bed', type: 'fishing', placeId: 'great-mere-westshore',
        biomeTags: ['clear-shallows', 'gravel-bed'], action: 'fish', outputItemId: 'item-great-mere-cloudwater-mussel', capacity: 10,
        regeneration: regeneration(2, 3600), requiredToolTags: ['fishing'], proficiencyId: 'fishing',
    }),
    'source-great-mere-lake-cress-bank': source({
        id: 'source-great-mere-lake-cress-bank', name: 'Lake Cress Bank', type: 'flora', placeId: 'great-mere-westshore',
        biomeTags: ['spring-seep', 'shoreline'], action: 'forage', outputItemId: 'item-great-mere-lake-cress', capacity: 8,
        regeneration: regeneration(2, 2700), requiredToolTags: [], proficiencyId: 'foraging',
    }),
    'source-great-mere-arrowroot-bank': source({
        id: 'source-great-mere-arrowroot-bank', name: 'Mere Arrowroot Bank', type: 'flora', placeId: 'great-mere-westshore',
        biomeTags: ['wet-soil', 'shoreline'], action: 'gather', outputItemId: 'item-great-mere-arrowroot-corm', capacity: 7,
        regeneration: regeneration(2, 3600), requiredToolTags: ['digging'], proficiencyId: 'gathering',
    }),
    'source-great-mere-bitterflag-marsh': source({
        id: 'source-great-mere-bitterflag-marsh', name: 'Bitterflag Marsh', type: 'flora', placeId: 'great-mere-westshore',
        biomeTags: ['marsh-edge', 'wet-soil'], action: 'forage', outputItemId: 'item-great-mere-bitterflag-rhizome', capacity: 4,
        regeneration: regeneration(1, 7200), requiredToolTags: ['digging'], proficiencyId: 'foraging', minProficiency: 2,
    }),
    'source-great-mere-lake-rush-bed': source({
        id: 'source-great-mere-lake-rush-bed', name: 'Lake Rush Bed', type: 'flora', placeId: 'great-mere-westshore',
        biomeTags: ['reed-margin', 'shoreline'], action: 'gather', outputItemId: 'item-great-mere-lake-rush-stem', capacity: 10,
        regeneration: regeneration(2, 2700), requiredToolTags: ['cutting'], proficiencyId: 'gathering',
    }),
    'source-great-mere-cloudwater-pearl-bed': source({
        id: 'source-great-mere-cloudwater-pearl-bed', name: 'Cloudwater Pearl Bed', type: 'fishing', placeId: 'reedcrown-isle',
        biomeTags: ['clear-shallows', 'gravel-bed'], action: 'fish', outputItemId: 'item-great-mere-cloudwater-pearl', capacity: 2,
        regeneration: regeneration(1, 21600), requiredToolTags: ['fishing'], proficiencyId: 'fishing', minProficiency: 3,
    }),
});

export function getGreatMereEcologyFamily(id) { return FAMILIES[String(id ?? '').trim()] ?? null; }
export function getGreatMereSpecies(id) { return SPECIES[String(id ?? '').trim()] ?? null; }
export function getGreatMerePopulation(id) { return POPULATIONS[String(id ?? '').trim()] ?? null; }
export function getGreatMereGatheringSource(id) { return SOURCES[String(id ?? '').trim()] ?? null; }

export function listGreatMereEcologyFamilies() { return Object.values(FAMILIES); }
export function listGreatMereSpecies() { return Object.values(SPECIES); }
export function listGreatMerePopulations() { return Object.values(POPULATIONS); }
export function listGreatMereGatheringSources() { return Object.values(SOURCES); }

export function validateGreatMereEcology() {
    const issues = [];
    const allFamily = (id) => getGreatMereEcologyFamily(id) ?? getRegionalEcologyFamily(id);

    for (const entry of listGreatMereEcologyFamilies()) {
        if (!validStableId(entry.id)) issues.push(`${entry.id} has invalid family id.`);
        if (!entry.name || !entry.tags.length) issues.push(`${entry.id} requires name and tags.`);
    }

    for (const entry of listGreatMereSpecies()) {
        if (!validStableId(entry.id)) issues.push(`${entry.id} has invalid species id.`);
        if (!allFamily(entry.familyId)) issues.push(`${entry.id} references unknown family ${entry.familyId}.`);
        if (!entry.name || !entry.ecosystem || !entry.habitatTags.length) issues.push(`${entry.id} requires name, ecosystem, and habitat tags.`);
        if (!entry.behavior?.aggression || !Array.isArray(entry.behavior.senses) || !entry.behavior.socialMode) issues.push(`${entry.id} has invalid behavior.`);
    }

    for (const entry of listGreatMerePopulations()) {
        if (!getGreatMereSpecies(entry.speciesId)) issues.push(`${entry.id} references unknown species ${entry.speciesId}.`);
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!positiveInteger(entry.capacity)) issues.push(`${entry.id} requires positive capacity.`);
        if (!ECOLOGY_DENSITIES.includes(entry.density)) issues.push(`${entry.id} has unknown density ${entry.density}.`);
        if (!ECOLOGY_RARITIES.includes(entry.rarity)) issues.push(`${entry.id} has unknown rarity ${entry.rarity}.`);
        validateConditions(entry.appearanceConditions, entry.id, issues);
    }

    for (const entry of listGreatMereGatheringSources()) {
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!ECOLOGY_SOURCE_TYPES.includes(entry.type)) issues.push(`${entry.id} has unknown source type ${entry.type}.`);
        if (!RESOURCE_RECOVERY_ACTIONS.includes(entry.action)) issues.push(`${entry.id} has unknown action ${entry.action}.`);
        const item = getGreatMereResourceItem(entry.outputItemId);
        if (!item) issues.push(`${entry.id} references unknown Great Mere item ${entry.outputItemId}.`);
        else if (!item.provenance.some((p) => p.sourceId === entry.id && p.placeId === entry.placeId && p.action === entry.action)) {
            issues.push(`${entry.id} output ${entry.outputItemId} lacks exact provenance backlink.`);
        }
        if (!positiveInteger(entry.capacity)) issues.push(`${entry.id} requires positive capacity.`);
        if (!Array.isArray(entry.requiredToolTags)) issues.push(`${entry.id}.requiredToolTags must be an array.`);
        if (!validStableId(entry.proficiencyId)) issues.push(`${entry.id} requires a stable proficiencyId.`);
        validateConditions(entry.appearanceConditions, entry.id, issues);
    }
    return issues;
}

function family(id, name, tags) {
    return deepFreeze({ id, name, tags: [...tags] });
}

function species({ id, name, familyId, ecosystem, habitatTags, behavior: behaviorDefinition }) {
    return deepFreeze({ id, name, familyId, ecosystem, habitatTags: [...habitatTags], behavior: behaviorDefinition, encounterTemplateId: null });
}

function behavior(aggression, senses, socialMode, preyFamilyIds) {
    return deepFreeze({ aggression, senses: [...senses], socialMode, preyFamilyIds: [...preyFamilyIds] });
}

function population({ id, speciesId, placeId, biomeTags, capacity, density, rarity, respawn, appearanceConditions = [] }) {
    return deepFreeze({ id, speciesId, placeId, biomeTags: [...biomeTags], capacity, density, rarity, respawn, appearanceConditions: [...appearanceConditions] });
}

function source({ id, name, type, placeId, biomeTags, action, outputItemId, capacity, regeneration: regenerationDefinition, requiredToolTags, proficiencyId, minProficiency = 0, appearanceConditions = [] }) {
    return deepFreeze({ id, name, type, placeId, biomeTags: [...biomeTags], action, outputItemId, capacity, regeneration: regenerationDefinition, requiredToolTags: [...requiredToolTags], proficiencyId, minProficiency, appearanceConditions: [...appearanceConditions] });
}

function regeneration(amount, everySeconds) {
    return deepFreeze({ amount, everySeconds });
}

function validateConditions(conditions = [], id, issues) {
    for (const condition of conditions ?? []) {
        if (!ECOLOGY_CONDITION_TYPES.includes(condition?.type)) issues.push(`${id} has unknown condition type ${condition?.type}.`);
        if (condition?.type === 'timeWindow' && (!Number.isFinite(condition.startHour) || !Number.isFinite(condition.endHour))) {
            issues.push(`${id} has invalid timeWindow condition.`);
        }
    }
}

function validStableId(value) {
    return typeof value === 'string' && /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(value);
}

function positiveInteger(value) {
    return Number.isInteger(value) && value > 0;
}

function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
}
