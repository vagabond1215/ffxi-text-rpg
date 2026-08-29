import { ECOLOGY_CONDITION_TYPES, ECOLOGY_DENSITIES, ECOLOGY_RARITIES, ECOLOGY_SOURCE_TYPES } from './ecologyCatalog.js';
import { getHeadwaterResourceItem } from './headwaterResourceItems.js';
import { getPlace } from './places.js';
import { getRegionalEcologyFamily } from './regionalEcologyExpansion.js';
import { RESOURCE_RECOVERY_ACTIONS } from './resourceProvenance.js';

export const HEADWATER_ECOLOGY_VERSION = 1;

const FAMILIES = Object.freeze({
    'family-red-deer': family('family-red-deer', 'Red Deer', ['beast', 'herbivore', 'forest', 'meadow']),
    'family-stream-trout': family('family-stream-trout', 'Stream Trout', ['fish', 'freshwater', 'cold-stream']),
});

const SPECIES = Object.freeze({
    'species-headwater-red-deer': species({
        id: 'species-headwater-red-deer', name: 'Headwater Red Deer', familyId: 'family-red-deer', ecosystem: 'beast',
        habitatTags: ['cool-river-valley', 'upland-meadow', 'forest-edge'],
        behavior: behavior('wary', ['sight', 'sound'], 'herd', []),
        encounterTemplateId: 'enemy-headwater-red-deer',
    }),
    'species-headwater-coldstream-trout': species({
        id: 'species-headwater-coldstream-trout', name: 'Coldstream Trout', familyId: 'family-stream-trout', ecosystem: 'fish',
        habitatTags: ['cold-stream', 'gravel-run', 'deep-pool'],
        behavior: behavior('passive', ['vibration'], 'shoal', []), encounterTemplateId: null,
    }),
    'species-headwater-river-otter': species({
        id: 'species-headwater-river-otter', name: 'Headwater River Otter', familyId: 'family-otter', ecosystem: 'beast',
        habitatTags: ['riverbank', 'deep-pool', 'alder-root'],
        behavior: behavior('wary', ['sight', 'sound'], 'pair', ['family-stream-trout']), encounterTemplateId: null,
    }),
    'species-headwater-embercoat-fox': species({
        id: 'species-headwater-embercoat-fox', name: 'Vale Embercoat Fox', familyId: 'family-fox', ecosystem: 'beast',
        habitatTags: ['mixed-forest', 'meadow-edge', 'fallen-timber'],
        behavior: behavior('wary', ['sight', 'sound'], 'solitary', []), encounterTemplateId: null,
    }),
    'species-headwater-moss-owl': species({
        id: 'species-headwater-moss-owl', name: 'Headwater Moss Owl', familyId: 'family-owl', ecosystem: 'bird',
        habitatTags: ['mixed-forest', 'river-cliff', 'old-tree'],
        behavior: behavior('territorial', ['sight', 'sound'], 'solitary', []), encounterTemplateId: null,
    }),
    'species-headwater-moss-shell-turtle': species({
        id: 'species-headwater-moss-shell-turtle', name: 'Headwater Moss-Shell Turtle', familyId: 'family-turtle', ecosystem: 'reptile',
        habitatTags: ['sun-warmed-bank', 'slow-pool', 'river-shingle'],
        behavior: behavior('passive', ['sight'], 'basking-group', []), encounterTemplateId: null,
    }),
});

const POPULATIONS = Object.freeze({
    'population-headwater-red-deer': population({
        id: 'population-headwater-red-deer', speciesId: 'species-headwater-red-deer', placeId: 'headwater-upper-vale',
        biomeTags: ['upland-meadow', 'forest-edge'], capacity: 7, density: 'moderate', rarity: 'common',
        respawn: regeneration(1, 7200), appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 20 }],
    }),
    'population-headwater-coldstream-trout': population({
        id: 'population-headwater-coldstream-trout', speciesId: 'species-headwater-coldstream-trout', placeId: 'headwater-lower-vale',
        biomeTags: ['cold-stream', 'gravel-run'], capacity: 12, density: 'high', rarity: 'common', respawn: regeneration(3, 1800),
    }),
    'population-headwater-river-otters': population({
        id: 'population-headwater-river-otters', speciesId: 'species-headwater-river-otter', placeId: 'headwater-lower-vale',
        biomeTags: ['riverbank', 'deep-pool'], capacity: 4, density: 'low', rarity: 'uncommon', respawn: regeneration(1, 5400),
    }),
    'population-headwater-embercoat-foxes': population({
        id: 'population-headwater-embercoat-foxes', speciesId: 'species-headwater-embercoat-fox', placeId: 'headwater-lower-vale',
        biomeTags: ['mixed-forest', 'meadow-edge'], capacity: 3, density: 'sparse', rarity: 'uncommon',
        respawn: regeneration(1, 7200), appearanceConditions: [{ type: 'timeWindow', startHour: 16, endHour: 24 }],
    }),
    'population-headwater-moss-owls': population({
        id: 'population-headwater-moss-owls', speciesId: 'species-headwater-moss-owl', placeId: 'headwater-upper-vale',
        biomeTags: ['mixed-forest', 'river-cliff'], capacity: 3, density: 'sparse', rarity: 'uncommon',
        respawn: regeneration(1, 7200), appearanceConditions: [{ type: 'timeWindow', startHour: 18, endHour: 24 }],
    }),
    'population-headwater-moss-shell-turtles': population({
        id: 'population-headwater-moss-shell-turtles', speciesId: 'species-headwater-moss-shell-turtle', placeId: 'headwater-lower-vale',
        biomeTags: ['sun-warmed-bank', 'slow-pool'], capacity: 5, density: 'moderate', rarity: 'common',
        respawn: regeneration(1, 3600), appearanceConditions: [{ type: 'timeWindow', startHour: 8, endHour: 18 }],
    }),
});

const SOURCES = Object.freeze({
    'source-headwater-coldstream-trout-run': source({
        id: 'source-headwater-coldstream-trout-run', name: 'Coldstream Trout Run', type: 'fishing', placeId: 'headwater-lower-vale',
        biomeTags: ['cold-stream', 'gravel-run', 'deep-pool'], action: 'fish', outputItemId: 'item-headwater-coldstream-trout',
        capacity: 12, regeneration: regeneration(3, 1800), requiredToolTags: ['fishing'], proficiencyId: 'fishing',
    }),
    'source-headwater-spring-cress-bank': source({
        id: 'source-headwater-spring-cress-bank', name: 'Spring Cress Bank', type: 'flora', placeId: 'headwater-lower-vale',
        biomeTags: ['spring-seep', 'riverbank'], action: 'forage', outputItemId: 'item-headwater-spring-cress',
        capacity: 8, regeneration: regeneration(2, 2700), requiredToolTags: [], proficiencyId: 'foraging',
    }),
    'source-headwater-meadowsweet-slope': source({
        id: 'source-headwater-meadowsweet-slope', name: 'Upland Meadowsweet Slope', type: 'flora', placeId: 'headwater-upper-vale',
        biomeTags: ['upland-meadow', 'moist-slope'], action: 'forage', outputItemId: 'item-headwater-meadowsweet',
        capacity: 7, regeneration: regeneration(2, 3600), requiredToolTags: [], proficiencyId: 'foraging', minProficiency: 1,
    }),
    'source-headwater-alder-bark-coppice': source({
        id: 'source-headwater-alder-bark-coppice', name: 'River Alder Bark Coppice', type: 'flora', placeId: 'headwater-lower-vale',
        biomeTags: ['riverbank', 'alder-coppice'], action: 'forage', outputItemId: 'item-headwater-alder-bark',
        capacity: 6, regeneration: regeneration(1, 5400), requiredToolTags: ['cutting'], proficiencyId: 'foraging', minProficiency: 1,
    }),
    'source-headwater-willow-withe-stand': source({
        id: 'source-headwater-willow-withe-stand', name: 'River Willow Withe Stand', type: 'flora', placeId: 'headwater-lower-vale',
        biomeTags: ['riverbank', 'willow-scrub'], action: 'gather', outputItemId: 'item-headwater-willow-withe',
        capacity: 8, regeneration: regeneration(2, 3600), requiredToolTags: ['cutting'], proficiencyId: 'gathering', minProficiency: 1,
    }),
    'source-headwater-alder-timber-stand': source({
        id: 'source-headwater-alder-timber-stand', name: 'Headwater Alder Stand', type: 'flora', placeId: 'headwater-lower-vale',
        biomeTags: ['river-terrace', 'alder-woodland'], action: 'log', outputItemId: 'item-headwater-alder-timber',
        capacity: 5, regeneration: regeneration(1, 18000), requiredToolTags: ['woodcutting'], proficiencyId: 'logging', minProficiency: 1,
    }),
});

export function getHeadwaterEcologyFamily(id) { return FAMILIES[String(id ?? '').trim()] ?? null; }
export function getHeadwaterSpecies(id) { return SPECIES[String(id ?? '').trim()] ?? null; }
export function getHeadwaterPopulation(id) { return POPULATIONS[String(id ?? '').trim()] ?? null; }
export function getHeadwaterGatheringSource(id) { return SOURCES[String(id ?? '').trim()] ?? null; }
export function listHeadwaterEcologyFamilies() { return Object.values(FAMILIES); }
export function listHeadwaterSpecies() { return Object.values(SPECIES); }
export function listHeadwaterPopulations() { return Object.values(POPULATIONS); }
export function listHeadwaterGatheringSources() { return Object.values(SOURCES); }

export function validateHeadwaterEcology() {
    const issues = [];
    const allFamily = (id) => getHeadwaterEcologyFamily(id) ?? getRegionalEcologyFamily(id);
    for (const entry of listHeadwaterEcologyFamilies()) {
        if (!validStableId(entry.id)) issues.push(`${entry.id} has invalid family id.`);
        if (!entry.name || !entry.tags.length) issues.push(`${entry.id} requires name and tags.`);
    }
    for (const entry of listHeadwaterSpecies()) {
        if (!validStableId(entry.id)) issues.push(`${entry.id} has invalid species id.`);
        if (!allFamily(entry.familyId)) issues.push(`${entry.id} references unknown family ${entry.familyId}.`);
        if (!entry.name || !entry.ecosystem || !entry.habitatTags.length) issues.push(`${entry.id} requires name, ecosystem, and habitat tags.`);
        if (!entry.behavior?.aggression || !Array.isArray(entry.behavior.senses) || !entry.behavior.socialMode) issues.push(`${entry.id} has invalid behavior.`);
    }
    for (const entry of listHeadwaterPopulations()) {
        if (!getHeadwaterSpecies(entry.speciesId)) issues.push(`${entry.id} references unknown species ${entry.speciesId}.`);
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!positiveInteger(entry.capacity)) issues.push(`${entry.id} requires positive capacity.`);
        if (!ECOLOGY_DENSITIES.includes(entry.density)) issues.push(`${entry.id} has unknown density ${entry.density}.`);
        if (!ECOLOGY_RARITIES.includes(entry.rarity)) issues.push(`${entry.id} has unknown rarity ${entry.rarity}.`);
        validateConditions(entry.appearanceConditions, entry.id, issues);
    }
    for (const entry of listHeadwaterGatheringSources()) {
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!ECOLOGY_SOURCE_TYPES.includes(entry.type)) issues.push(`${entry.id} has unknown source type ${entry.type}.`);
        if (!RESOURCE_RECOVERY_ACTIONS.includes(entry.action)) issues.push(`${entry.id} has unknown action ${entry.action}.`);
        const item = getHeadwaterResourceItem(entry.outputItemId);
        if (!item) issues.push(`${entry.id} references unknown Headwater item ${entry.outputItemId}.`);
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
