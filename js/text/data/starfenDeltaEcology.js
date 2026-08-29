import { ECOLOGY_CONDITION_TYPES, ECOLOGY_DENSITIES, ECOLOGY_RARITIES, ECOLOGY_SOURCE_TYPES } from './ecologyCatalog.js';
import { getPlace } from './places.js';
import { getRegionalEcologyFamily } from './regionalEcologyExpansion.js';
import { RESOURCE_RECOVERY_ACTIONS } from './resourceProvenance.js';
import { getStarfenDeltaResourceItem } from './starfenDeltaResourceItems.js';

export const STARFEN_DELTA_ECOLOGY_VERSION = 1;

const FAMILIES = Object.freeze({
    'family-tide-oyster': family('family-tide-oyster', 'Tide Oyster', ['mollusk', 'filter-feeder', 'brackish', 'coastal']),
    'family-shoal-ray': family('family-shoal-ray', 'Shoal Ray', ['fish', 'benthic', 'coastal']),
    'family-coast-seal': family('family-coast-seal', 'Coast Seal', ['beast', 'marine', 'carnivore']),
    'family-coast-gull': family('family-coast-gull', 'Coast Gull', ['bird', 'coastal', 'scavenger']),
});

const SPECIES = Object.freeze({
    'species-delta-brackish-reed-eel': species({
        id: 'species-delta-brackish-reed-eel', name: 'Brackish Reed Eel', familyId: 'family-reed-eel', ecosystem: 'fish',
        habitatTags: ['brackish-channel', 'reed-edge', 'mud-bank'],
        behavior: behavior('passive', ['vibration'], 'shoal', []), encounterTemplateId: null,
    }),
    'species-delta-saltflat-mud-crab': species({
        id: 'species-delta-saltflat-mud-crab', name: 'Saltflat Mud Crab', familyId: 'family-crab', ecosystem: 'crustacean',
        habitatTags: ['tidal-flat', 'saltmarsh-creek', 'mud-bank'],
        behavior: behavior('territorial', ['vibration'], 'cluster', []), encounterTemplateId: null,
    }),
    'species-delta-grey-mire-heron': species({
        id: 'species-delta-grey-mire-heron', name: 'Grey Delta Heron', familyId: 'family-mire-heron', ecosystem: 'bird',
        habitatTags: ['delta-levee', 'shallow-channel', 'tidal-creek'],
        behavior: behavior('wary', ['sight'], 'solitary', ['family-reed-eel']), encounterTemplateId: null,
    }),
    'species-delta-saltmarsh-duck': species({
        id: 'species-delta-saltmarsh-duck', name: 'Saltmarsh Duck', familyId: 'family-waterfowl', ecosystem: 'bird',
        habitatTags: ['saltmarsh', 'brackish-pool', 'reed-island'],
        behavior: behavior('wary', ['sight', 'sound'], 'flock', []), encounterTemplateId: null,
    }),
    'species-delta-tide-oyster': species({
        id: 'species-delta-tide-oyster', name: 'Tideglass Oyster', familyId: 'family-tide-oyster', ecosystem: 'mollusk',
        habitatTags: ['brackish-shoal', 'shell-bed', 'tidal-channel'],
        behavior: behavior('passive', [], 'bed', []), encounterTemplateId: null,
    }),
    'species-delta-shoal-ray': species({
        id: 'species-delta-shoal-ray', name: 'Pale Shoal Ray', familyId: 'family-shoal-ray', ecosystem: 'fish',
        habitatTags: ['shallow-coast', 'sandbar', 'eelgrass-bed'],
        behavior: behavior('wary', ['vibration'], 'solitary', []), encounterTemplateId: null,
    }),
    'species-delta-greyback-seal': species({
        id: 'species-delta-greyback-seal', name: 'Greyback Seal', familyId: 'family-coast-seal', ecosystem: 'beast',
        habitatTags: ['outer-sandbar', 'rocky-strand', 'nearshore-water'],
        behavior: behavior('wary', ['sight', 'sound'], 'colony', []), encounterTemplateId: null,
    }),
    'species-delta-windward-gull': species({
        id: 'species-delta-windward-gull', name: 'Windward Gull', familyId: 'family-coast-gull', ecosystem: 'bird',
        habitatTags: ['tidal-flat', 'strand', 'landing-roof'],
        behavior: behavior('wary', ['sight', 'sound'], 'flock', []), encounterTemplateId: null,
    }),
});

const POPULATIONS = Object.freeze({
    'population-delta-brackish-reed-eels': population({
        id: 'population-delta-brackish-reed-eels', speciesId: 'species-delta-brackish-reed-eel', placeId: 'starfen-lower-delta',
        biomeTags: ['brackish-channel', 'reed-edge'], capacity: 12, density: 'high', rarity: 'common', respawn: regeneration(3, 1800),
    }),
    'population-delta-saltflat-mud-crabs': population({
        id: 'population-delta-saltflat-mud-crabs', speciesId: 'species-delta-saltflat-mud-crab', placeId: 'starfen-brackish-coast',
        biomeTags: ['tidal-flat', 'saltmarsh-creek'], capacity: 10, density: 'high', rarity: 'common', respawn: regeneration(2, 2400),
    }),
    'population-delta-grey-herons': population({
        id: 'population-delta-grey-herons', speciesId: 'species-delta-grey-mire-heron', placeId: 'starfen-lower-delta',
        biomeTags: ['delta-levee', 'shallow-channel'], capacity: 4, density: 'low', rarity: 'uncommon', respawn: regeneration(1, 5400),
    }),
    'population-delta-saltmarsh-ducks': population({
        id: 'population-delta-saltmarsh-ducks', speciesId: 'species-delta-saltmarsh-duck', placeId: 'starfen-lower-delta',
        biomeTags: ['saltmarsh', 'brackish-pool'], capacity: 8, density: 'moderate', rarity: 'common', respawn: regeneration(2, 3600),
    }),
    'population-delta-tide-oysters': population({
        id: 'population-delta-tide-oysters', speciesId: 'species-delta-tide-oyster', placeId: 'starfen-brackish-coast',
        biomeTags: ['brackish-shoal', 'shell-bed'], capacity: 14, density: 'high', rarity: 'common', respawn: regeneration(3, 3600),
    }),
    'population-delta-shoal-rays': population({
        id: 'population-delta-shoal-rays', speciesId: 'species-delta-shoal-ray', placeId: 'starfen-brackish-coast',
        biomeTags: ['shallow-coast', 'eelgrass-bed'], capacity: 4, density: 'low', rarity: 'uncommon', respawn: regeneration(1, 7200),
    }),
    'population-delta-greyback-seals': population({
        id: 'population-delta-greyback-seals', speciesId: 'species-delta-greyback-seal', placeId: 'starfen-brackish-coast',
        biomeTags: ['outer-sandbar', 'rocky-strand'], capacity: 5, density: 'low', rarity: 'uncommon', respawn: regeneration(1, 7200),
    }),
    'population-delta-windward-gulls': population({
        id: 'population-delta-windward-gulls', speciesId: 'species-delta-windward-gull', placeId: 'starfen-brackish-coast',
        biomeTags: ['tidal-flat', 'strand'], capacity: 10, density: 'high', rarity: 'common', respawn: regeneration(2, 2700),
    }),
});

const SOURCES = Object.freeze({
    'source-delta-brackish-eel-channel': source({
        id: 'source-delta-brackish-eel-channel', name: 'Brackish Eel Channel', type: 'fishing', placeId: 'starfen-lower-delta',
        biomeTags: ['brackish-channel', 'reed-edge'], action: 'fish', outputItemId: 'item-delta-brackish-reed-eel',
        capacity: 12, regeneration: regeneration(3, 1800), requiredToolTags: ['fishing'], proficiencyId: 'fishing',
    }),
    'source-delta-mud-crab-flat': source({
        id: 'source-delta-mud-crab-flat', name: 'Saltflat Mud Crab Ground', type: 'fishing', placeId: 'starfen-brackish-coast',
        biomeTags: ['tidal-flat', 'saltmarsh-creek'], action: 'trap', outputItemId: 'item-delta-saltflat-mud-crab',
        capacity: 10, regeneration: regeneration(2, 2400), requiredToolTags: ['fishing'], proficiencyId: 'fishing', minProficiency: 1,
    }),
    'source-delta-tide-oyster-bed': source({
        id: 'source-delta-tide-oyster-bed', name: 'Tideglass Oyster Bed', type: 'fishing', placeId: 'starfen-brackish-coast',
        biomeTags: ['brackish-shoal', 'shell-bed'], action: 'fish', outputItemId: 'item-delta-tide-oyster',
        capacity: 12, regeneration: regeneration(2, 3600), requiredToolTags: ['fishing'], proficiencyId: 'fishing', minProficiency: 1,
    }),
    'source-delta-coast-kelp-wrack': source({
        id: 'source-delta-coast-kelp-wrack', name: 'Coast Kelp Wrack', type: 'flora', placeId: 'starfen-brackish-coast',
        biomeTags: ['strand', 'tidal-wrack'], action: 'gather', outputItemId: 'item-delta-coast-kelp',
        capacity: 9, regeneration: regeneration(2, 2700), requiredToolTags: [], proficiencyId: 'gathering',
    }),
    'source-delta-marsh-samphire-bed': source({
        id: 'source-delta-marsh-samphire-bed', name: 'Marsh Samphire Bed', type: 'flora', placeId: 'starfen-lower-delta',
        biomeTags: ['upper-saltmarsh', 'firm-levee'], action: 'forage', outputItemId: 'item-delta-marsh-samphire',
        capacity: 8, regeneration: regeneration(2, 2700), requiredToolTags: [], proficiencyId: 'foraging',
    }),
    'source-delta-saltmarsh-reed-bed': source({
        id: 'source-delta-saltmarsh-reed-bed', name: 'Saltmarsh Reed Bed', type: 'flora', placeId: 'starfen-lower-delta',
        biomeTags: ['saltmarsh', 'levee-edge'], action: 'gather', outputItemId: 'item-delta-saltmarsh-reed',
        capacity: 10, regeneration: regeneration(2, 3600), requiredToolTags: ['cutting'], proficiencyId: 'gathering', minProficiency: 1,
    }),
    'source-delta-tidepan-salt-crust': source({
        id: 'source-delta-tidepan-salt-crust', name: 'Tidepan Salt Crust', type: 'mineral', placeId: 'starfen-brackish-coast',
        biomeTags: ['upper-tidal-flat', 'evaporation-pan'], action: 'mine', outputItemId: 'item-delta-tidepan-salt-crust',
        capacity: 6, regeneration: regeneration(1, 7200), requiredToolTags: ['mining'], proficiencyId: 'mining', minProficiency: 1,
    }),
});

export function getStarfenDeltaEcologyFamily(id) { return FAMILIES[String(id ?? '').trim()] ?? null; }
export function getStarfenDeltaSpecies(id) { return SPECIES[String(id ?? '').trim()] ?? null; }
export function getStarfenDeltaPopulation(id) { return POPULATIONS[String(id ?? '').trim()] ?? null; }
export function getStarfenDeltaGatheringSource(id) { return SOURCES[String(id ?? '').trim()] ?? null; }
export function listStarfenDeltaEcologyFamilies() { return Object.values(FAMILIES); }
export function listStarfenDeltaSpecies() { return Object.values(SPECIES); }
export function listStarfenDeltaPopulations() { return Object.values(POPULATIONS); }
export function listStarfenDeltaGatheringSources() { return Object.values(SOURCES); }

export function validateStarfenDeltaEcology() {
    const issues = [];
    const allFamily = (id) => getStarfenDeltaEcologyFamily(id) ?? getRegionalEcologyFamily(id);
    for (const entry of listStarfenDeltaEcologyFamilies()) {
        if (!validStableId(entry.id)) issues.push(`${entry.id} has invalid family id.`);
        if (!entry.name || !entry.tags.length) issues.push(`${entry.id} requires name and tags.`);
    }
    for (const entry of listStarfenDeltaSpecies()) {
        if (!validStableId(entry.id)) issues.push(`${entry.id} has invalid species id.`);
        if (!allFamily(entry.familyId)) issues.push(`${entry.id} references unknown family ${entry.familyId}.`);
        if (!entry.name || !entry.ecosystem || !entry.habitatTags.length) issues.push(`${entry.id} requires name, ecosystem, and habitat tags.`);
        if (!entry.behavior?.aggression || !Array.isArray(entry.behavior.senses) || !entry.behavior.socialMode) issues.push(`${entry.id} has invalid behavior.`);
    }
    for (const entry of listStarfenDeltaPopulations()) {
        if (!getStarfenDeltaSpecies(entry.speciesId)) issues.push(`${entry.id} references unknown species ${entry.speciesId}.`);
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!positiveInteger(entry.capacity)) issues.push(`${entry.id} requires positive capacity.`);
        if (!ECOLOGY_DENSITIES.includes(entry.density)) issues.push(`${entry.id} has unknown density ${entry.density}.`);
        if (!ECOLOGY_RARITIES.includes(entry.rarity)) issues.push(`${entry.id} has unknown rarity ${entry.rarity}.`);
        validateConditions(entry.appearanceConditions, entry.id, issues);
    }
    for (const entry of listStarfenDeltaGatheringSources()) {
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!ECOLOGY_SOURCE_TYPES.includes(entry.type)) issues.push(`${entry.id} has unknown source type ${entry.type}.`);
        if (!RESOURCE_RECOVERY_ACTIONS.includes(entry.action)) issues.push(`${entry.id} has unknown action ${entry.action}.`);
        const item = getStarfenDeltaResourceItem(entry.outputItemId);
        if (!item) issues.push(`${entry.id} references unknown delta item ${entry.outputItemId}.`);
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
function family(id, name, tags) { return deepFreeze({ id, name, tags: [...tags] }); }
function species({ id, name, familyId, ecosystem, habitatTags, behavior: behaviorDefinition, encounterTemplateId }) {
    return deepFreeze({ id, name, familyId, ecosystem, habitatTags: [...habitatTags], behavior: behaviorDefinition, encounterTemplateId });
}
function behavior(aggression, senses, socialMode, linksWithFamilyIds) {
    return deepFreeze({ aggression, senses: [...senses], socialMode, linksWithFamilyIds: [...linksWithFamilyIds] });
}
function population({ id, speciesId, placeId, biomeTags, capacity, density, rarity, respawn, appearanceConditions = [] }) {
    return deepFreeze({ id, speciesId, placeId, biomeTags: [...biomeTags], capacity, density, rarity, respawn, appearanceConditions: [...appearanceConditions], namedVariantHooks: [] });
}
function source({ id, name, type, placeId, biomeTags, action, outputItemId, capacity, regeneration: regenerationDefinition, requiredToolTags, proficiencyId, minProficiency = 0, appearanceConditions = [] }) {
    return deepFreeze({ id, name, type, placeId, biomeTags: [...biomeTags], action, outputItemId, capacity, regeneration: regenerationDefinition, requiredToolTags: [...requiredToolTags], proficiencyId, minProficiency, appearanceConditions: [...appearanceConditions] });
}
function regeneration(amount, everySeconds) { return deepFreeze({ amount, everySeconds }); }
function validateConditions(conditions = [], id, issues) {
    for (const condition of conditions ?? []) {
        if (!ECOLOGY_CONDITION_TYPES.includes(condition?.type)) issues.push(`${id} has unknown condition type ${condition?.type}.`);
        if (condition?.type === 'timeWindow' && (!Number.isFinite(condition.startHour) || !Number.isFinite(condition.endHour))) issues.push(`${id} has invalid timeWindow condition.`);
    }
}
function validStableId(value) { return typeof value === 'string' && /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(value); }
function positiveInteger(value) { return Number.isInteger(value) && value > 0; }
function deepFreeze(value) { if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value; for (const child of Object.values(value)) deepFreeze(child); return Object.freeze(value); }
