import { ECOLOGY_CONDITION_TYPES, ECOLOGY_DENSITIES, ECOLOGY_RARITIES, ECOLOGY_SOURCE_TYPES } from './ecologyCatalog.js';
import { getEmberwashResourceItem } from './emberwashResourceItems.js';
import { getPlace } from './places.js';
import { getRegionalEcologyFamily } from './regionalEcologyExpansion.js';
import { RESOURCE_RECOVERY_ACTIONS } from './resourceProvenance.js';

export const EMBERWASH_ECOLOGY_VERSION = 1;

const FAMILIES = Object.freeze({
    'family-dust-hare': family('family-dust-hare', 'Dust Hare', ['beast', 'herbivore', 'arid']),
    'family-washrunner-quail': family('family-washrunner-quail', 'Washrunner Quail', ['bird', 'omnivore', 'arid']),
    'family-glasswing-beetle': family('family-glasswing-beetle', 'Glasswing Beetle', ['insect', 'detritivore', 'arid']),
    'family-saltbrush-tortoise': family('family-saltbrush-tortoise', 'Saltbrush Tortoise', ['reptile', 'herbivore', 'arid']),
});

const SPECIES = Object.freeze({
    'species-emberwash-ashhorn-ibex': species({
        id: 'species-emberwash-ashhorn-ibex', name: 'Ashhorn Ridge Ibex', familyId: 'family-ridge-ibex', ecosystem: 'beast',
        habitatTags: ['rocky-grass', 'wash-rim', 'badland-slope'], behavior: behavior('wary', ['sight', 'sound'], 'herd', []), encounterTemplateId: null,
    }),
    'species-emberwash-copperback-lizard': species({
        id: 'species-emberwash-copperback-lizard', name: 'Copperback Sun Lizard', familyId: 'family-lizard', ecosystem: 'reptile',
        habitatTags: ['sun-rock', 'dry-wash', 'thorn-scrub'], behavior: behavior('passive', ['vibration'], 'solitary', []), encounterTemplateId: null,
    }),
    'species-emberwash-redtail-scorpion': species({
        id: 'species-emberwash-redtail-scorpion', name: 'Redtail Scorpion', familyId: 'family-scorpion', ecosystem: 'arachnid',
        habitatTags: ['saltpan-edge', 'stone-pocket', 'dry-channel'], behavior: behavior('territorial', ['vibration'], 'solitary', []), encounterTemplateId: null,
    }),
    'species-emberwash-saltwind-vulture': species({
        id: 'species-emberwash-saltwind-vulture', name: 'Saltwind Vulture', familyId: 'family-vulture', ecosystem: 'bird',
        habitatTags: ['badland-spire', 'saltpan', 'thermal-ridge'], behavior: behavior('wary', ['sight'], 'flock', []), encounterTemplateId: null,
    }),
    'species-emberwash-dust-hare': species({
        id: 'species-emberwash-dust-hare', name: 'Emberwash Dust Hare', familyId: 'family-dust-hare', ecosystem: 'beast',
        habitatTags: ['saltbrush', 'dry-wash', 'scrub-flat'], behavior: behavior('wary', ['sight', 'sound'], 'solitary', []), encounterTemplateId: null,
    }),
    'species-emberwash-washrunner-quail': species({
        id: 'species-emberwash-washrunner-quail', name: 'Washrunner Quail', familyId: 'family-washrunner-quail', ecosystem: 'bird',
        habitatTags: ['rocky-grass', 'thorn-scrub', 'wash-bank'], behavior: behavior('wary', ['sight', 'sound'], 'covey', []), encounterTemplateId: null,
    }),
    'species-emberwash-glasswing-beetle': species({
        id: 'species-emberwash-glasswing-beetle', name: 'Glasswing Beetle', familyId: 'family-glasswing-beetle', ecosystem: 'insect',
        habitatTags: ['gypsum-shelf', 'dry-wash', 'cinderbrush'], behavior: behavior('passive', [], 'cluster', []), encounterTemplateId: null,
    }),
    'species-emberwash-saltbrush-tortoise': species({
        id: 'species-emberwash-saltbrush-tortoise', name: 'Saltbrush Tortoise', familyId: 'family-saltbrush-tortoise', ecosystem: 'reptile',
        habitatTags: ['saltbrush', 'saltpan-verge', 'hardpan'], behavior: behavior('passive', ['vibration'], 'solitary', []), encounterTemplateId: null,
    }),
});

const POPULATIONS = Object.freeze({
    'population-emberwash-ashhorn-ibex': population({ id: 'population-emberwash-ashhorn-ibex', speciesId: 'species-emberwash-ashhorn-ibex', placeId: 'emberwash-north-wash', biomeTags: ['rocky-grass', 'wash-rim'], capacity: 5, density: 'moderate', rarity: 'common', respawn: regeneration(1, 7200) }),
    'population-emberwash-copperback-lizards': population({ id: 'population-emberwash-copperback-lizards', speciesId: 'species-emberwash-copperback-lizard', placeId: 'emberwash-north-wash', biomeTags: ['sun-rock', 'dry-wash'], capacity: 7, density: 'moderate', rarity: 'common', respawn: regeneration(2, 3600), appearanceConditions: [{ type: 'timeWindow', startHour: 7, endHour: 19 }] }),
    'population-emberwash-washrunner-quail': population({ id: 'population-emberwash-washrunner-quail', speciesId: 'species-emberwash-washrunner-quail', placeId: 'emberwash-north-wash', biomeTags: ['rocky-grass', 'thorn-scrub'], capacity: 8, density: 'moderate', rarity: 'common', respawn: regeneration(2, 3600), appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 18 }] }),
    'population-emberwash-glasswing-beetles': population({ id: 'population-emberwash-glasswing-beetles', speciesId: 'species-emberwash-glasswing-beetle', placeId: 'emberwash-north-wash', biomeTags: ['gypsum-shelf', 'cinderbrush'], capacity: 10, density: 'high', rarity: 'common', respawn: regeneration(2, 2700) }),
    'population-emberwash-redtail-scorpions': population({ id: 'population-emberwash-redtail-scorpions', speciesId: 'species-emberwash-redtail-scorpion', placeId: 'emberwash-saltpan-verge', biomeTags: ['stone-pocket', 'dry-channel'], capacity: 5, density: 'low', rarity: 'uncommon', respawn: regeneration(1, 5400), appearanceConditions: [{ type: 'timeWindow', startHour: 17, endHour: 24 }] }),
    'population-emberwash-saltwind-vultures': population({ id: 'population-emberwash-saltwind-vultures', speciesId: 'species-emberwash-saltwind-vulture', placeId: 'emberwash-saltpan-verge', biomeTags: ['badland-spire', 'saltpan'], capacity: 5, density: 'low', rarity: 'common', respawn: regeneration(1, 7200), appearanceConditions: [{ type: 'timeWindow', startHour: 8, endHour: 20 }] }),
    'population-emberwash-dust-hares': population({ id: 'population-emberwash-dust-hares', speciesId: 'species-emberwash-dust-hare', placeId: 'emberwash-saltpan-verge', biomeTags: ['saltbrush', 'scrub-flat'], capacity: 7, density: 'moderate', rarity: 'common', respawn: regeneration(2, 3600), appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 20 }] }),
    'population-emberwash-saltbrush-tortoises': population({ id: 'population-emberwash-saltbrush-tortoises', speciesId: 'species-emberwash-saltbrush-tortoise', placeId: 'emberwash-saltpan-verge', biomeTags: ['saltbrush', 'hardpan'], capacity: 4, density: 'low', rarity: 'uncommon', respawn: regeneration(1, 7200) }),
});

const SOURCES = Object.freeze({
    'source-emberwash-emberpod-grove': source({ id: 'source-emberwash-emberpod-grove', name: 'Emberpod Grove', type: 'flora', placeId: 'emberwash-north-wash', biomeTags: ['wash-bank', 'thorn-scrub'], action: 'forage', outputItemId: 'item-emberwash-emberpod', capacity: 8, regeneration: regeneration(2, 3600), requiredToolTags: [], proficiencyId: 'foraging' }),
    'source-emberwash-cinder-pear-patch': source({ id: 'source-emberwash-cinder-pear-patch', name: 'Cinder Pear Patch', type: 'flora', placeId: 'emberwash-north-wash', biomeTags: ['sun-slope', 'wash-bank'], action: 'forage', outputItemId: 'item-emberwash-cinder-pear', capacity: 7, regeneration: regeneration(2, 3600), requiredToolTags: ['cutting'], proficiencyId: 'foraging', minProficiency: 1 }),
    'source-emberwash-desert-sage-slope': source({ id: 'source-emberwash-desert-sage-slope', name: 'Desert Sage Slope', type: 'flora', placeId: 'emberwash-north-wash', biomeTags: ['rocky-grass', 'dry-slope'], action: 'forage', outputItemId: 'item-emberwash-desert-sage', capacity: 8, regeneration: regeneration(2, 3600), requiredToolTags: [], proficiencyId: 'foraging' }),
    'source-emberwash-cinderbrush-stand': source({ id: 'source-emberwash-cinderbrush-stand', name: 'Cinderbrush Stand', type: 'flora', placeId: 'emberwash-north-wash', biomeTags: ['wash-bank', 'thorn-scrub'], action: 'gather', outputItemId: 'item-emberwash-cinderbrush-fiber', capacity: 8, regeneration: regeneration(2, 3600), requiredToolTags: ['cutting'], proficiencyId: 'gathering', minProficiency: 1 }),
    'source-emberwash-saltpan-crust': source({ id: 'source-emberwash-saltpan-crust', name: 'Saltpan Crust Shelf', type: 'mineral', placeId: 'emberwash-saltpan-verge', biomeTags: ['saltpan', 'hardpan'], action: 'gather', outputItemId: 'item-emberwash-salt-crust', capacity: 9, regeneration: regeneration(2, 5400), requiredToolTags: ['digging'], proficiencyId: 'gathering', minProficiency: 1 }),
    'source-emberwash-red-ochre-cut': source({ id: 'source-emberwash-red-ochre-cut', name: 'Red Ochre Cut', type: 'mineral', placeId: 'emberwash-north-wash', biomeTags: ['badland-cut', 'iron-earth'], action: 'mine', outputItemId: 'item-emberwash-red-ochre', capacity: 6, regeneration: regeneration(1, 7200), requiredToolTags: ['mining'], proficiencyId: 'mining', minProficiency: 1 }),
    'source-emberwash-gypsum-shelf': source({ id: 'source-emberwash-gypsum-shelf', name: 'Gypsum Shelf', type: 'mineral', placeId: 'emberwash-north-wash', biomeTags: ['gypsum-shelf', 'badland-face'], action: 'mine', outputItemId: 'item-emberwash-gypsum-nodule', capacity: 6, regeneration: regeneration(1, 7200), requiredToolTags: ['mining'], proficiencyId: 'mining', minProficiency: 1 }),
});

export function getEmberwashEcologyFamily(id) { return FAMILIES[String(id ?? '').trim()] ?? null; }
export function getEmberwashSpecies(id) { return SPECIES[String(id ?? '').trim()] ?? null; }
export function getEmberwashPopulation(id) { return POPULATIONS[String(id ?? '').trim()] ?? null; }
export function getEmberwashGatheringSource(id) { return SOURCES[String(id ?? '').trim()] ?? null; }
export function listEmberwashEcologyFamilies() { return Object.values(FAMILIES); }
export function listEmberwashSpecies() { return Object.values(SPECIES); }
export function listEmberwashPopulations() { return Object.values(POPULATIONS); }
export function listEmberwashGatheringSources() { return Object.values(SOURCES); }

export function validateEmberwashEcology() {
    const issues = [];
    const allFamily = (id) => getEmberwashEcologyFamily(id) ?? getRegionalEcologyFamily(id);
    for (const entry of listEmberwashEcologyFamilies()) {
        if (!validStableId(entry.id)) issues.push(`${entry.id} has invalid family id.`);
        if (!entry.name || !entry.tags.length) issues.push(`${entry.id} requires name and tags.`);
    }
    for (const entry of listEmberwashSpecies()) {
        if (!validStableId(entry.id)) issues.push(`${entry.id} has invalid species id.`);
        if (!allFamily(entry.familyId)) issues.push(`${entry.id} references unknown family ${entry.familyId}.`);
        if (!entry.name || !entry.ecosystem || !entry.habitatTags.length) issues.push(`${entry.id} requires name, ecosystem, and habitat tags.`);
        if (!entry.behavior?.aggression || !Array.isArray(entry.behavior.senses) || !entry.behavior.socialMode) issues.push(`${entry.id} has invalid behavior.`);
    }
    for (const entry of listEmberwashPopulations()) {
        if (!getEmberwashSpecies(entry.speciesId)) issues.push(`${entry.id} references unknown species ${entry.speciesId}.`);
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!positiveInteger(entry.capacity)) issues.push(`${entry.id} requires positive capacity.`);
        if (!ECOLOGY_DENSITIES.includes(entry.density)) issues.push(`${entry.id} has unknown density ${entry.density}.`);
        if (!ECOLOGY_RARITIES.includes(entry.rarity)) issues.push(`${entry.id} has unknown rarity ${entry.rarity}.`);
        validateConditions(entry.appearanceConditions, entry.id, issues);
    }
    for (const entry of listEmberwashGatheringSources()) {
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!ECOLOGY_SOURCE_TYPES.includes(entry.type)) issues.push(`${entry.id} has unknown source type ${entry.type}.`);
        if (!RESOURCE_RECOVERY_ACTIONS.includes(entry.action)) issues.push(`${entry.id} has unknown action ${entry.action}.`);
        const item = getEmberwashResourceItem(entry.outputItemId);
        if (!item) issues.push(`${entry.id} references unknown Emberwash item ${entry.outputItemId}.`);
        else if (!item.provenance.some((p) => p.sourceId === entry.id && p.placeId === entry.placeId && p.action === entry.action)) issues.push(`${entry.id} output ${entry.outputItemId} lacks exact provenance backlink.`);
        if (!positiveInteger(entry.capacity)) issues.push(`${entry.id} requires positive capacity.`);
        if (!Array.isArray(entry.requiredToolTags)) issues.push(`${entry.id}.requiredToolTags must be an array.`);
        if (!validStableId(entry.proficiencyId)) issues.push(`${entry.id} requires a stable proficiencyId.`);
        validateConditions(entry.appearanceConditions, entry.id, issues);
    }
    return issues;
}

function family(id, name, tags) { return deepFreeze({ id, name, tags: [...tags] }); }
function species({ id, name, familyId, ecosystem, habitatTags, behavior: behaviorDefinition, encounterTemplateId }) { return deepFreeze({ id, name, familyId, ecosystem, habitatTags: [...habitatTags], behavior: behaviorDefinition, encounterTemplateId }); }
function behavior(aggression, senses, socialMode, linksWithFamilyIds) { return deepFreeze({ aggression, senses: [...senses], socialMode, linksWithFamilyIds: [...linksWithFamilyIds] }); }
function population({ id, speciesId, placeId, biomeTags, capacity, density, rarity, respawn, appearanceConditions = [] }) { return deepFreeze({ id, speciesId, placeId, biomeTags: [...biomeTags], capacity, density, rarity, respawn, appearanceConditions: [...appearanceConditions], namedVariantHooks: [] }); }
function source({ id, name, type, placeId, biomeTags, action, outputItemId, capacity, regeneration: regenerationDefinition, requiredToolTags, proficiencyId, minProficiency = 0, appearanceConditions = [] }) { return deepFreeze({ id, name, type, placeId, biomeTags: [...biomeTags], action, outputItemId, capacity, regeneration: regenerationDefinition, requiredToolTags: [...requiredToolTags], proficiencyId, minProficiency, appearanceConditions: [...appearanceConditions] }); }
function regeneration(amount, everySeconds) { return deepFreeze({ amount, everySeconds }); }
function validateConditions(conditions = [], id, issues) { for (const condition of conditions ?? []) { if (!ECOLOGY_CONDITION_TYPES.includes(condition?.type)) issues.push(`${id} has unknown condition type ${condition?.type}.`); if (condition?.type === 'timeWindow' && (!Number.isFinite(condition.startHour) || !Number.isFinite(condition.endHour))) issues.push(`${id} has invalid timeWindow condition.`); } }
function validStableId(value) { return typeof value === 'string' && /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(value); }
function positiveInteger(value) { return Number.isInteger(value) && value > 0; }
function deepFreeze(value) { if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value; for (const child of Object.values(value)) deepFreeze(child); return Object.freeze(value); }
