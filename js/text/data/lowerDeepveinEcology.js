import { ECOLOGY_CONDITION_TYPES, ECOLOGY_DENSITIES, ECOLOGY_RARITIES, ECOLOGY_SOURCE_TYPES, getEcologyFamily } from './ecologyCatalog.js';
import { getLowerDeepveinResourceItem } from './lowerDeepveinResourceItems.js';
import { getPlace } from './places.js';
import { getRegionalEcologyFamily } from './regionalEcologyExpansion.js';
import { RESOURCE_RECOVERY_ACTIONS } from './resourceProvenance.js';

export const LOWER_DEEPVEIN_ECOLOGY_VERSION = 1;

const FAMILIES = Object.freeze({
    'family-threadfin-cavefish': family('family-threadfin-cavefish', 'Threadfin Cavefish', ['fish', 'subterranean', 'freshwater']),
    'family-salt-springtail': family('family-salt-springtail', 'Salt Springtail', ['insect', 'detritivore', 'subterranean']),
    'family-slateback-cave-isopod': family('family-slateback-cave-isopod', 'Slateback Cave Isopod', ['crustacean', 'detritivore', 'subterranean']),
});

const SPECIES = Object.freeze({
    'species-lower-deepvein-sootwing-bat': species({
        id: 'species-lower-deepvein-sootwing-bat', name: 'Lower Deepvein Sootwing Bat', familyId: 'family-bat', ecosystem: 'beast',
        habitatTags: ['timbered-gallery', 'high-cave', 'darkness'], behavior: behavior('territorial', ['sound'], 'colony', []), encounterTemplateId: null,
    }),
    'species-lower-deepvein-glass-salamander': species({
        id: 'species-lower-deepvein-glass-salamander', name: 'Lower Deepvein Glass Salamander', familyId: 'family-salamander', ecosystem: 'amphibian',
        habitatTags: ['seep-wall', 'cool-stone', 'cave'], behavior: behavior('passive', ['vibration'], 'solitary', []), encounterTemplateId: null,
    }),
    'species-lower-deepvein-blind-sump-crab': species({
        id: 'species-lower-deepvein-blind-sump-crab', name: 'Blind Sump Crab', familyId: 'family-crab', ecosystem: 'crustacean',
        habitatTags: ['black-water-pool', 'sump', 'stone-margin'], behavior: behavior('territorial', ['vibration'], 'cluster', []), encounterTemplateId: null,
    }),
    'species-lower-deepvein-pale-threadspider': species({
        id: 'species-lower-deepvein-pale-threadspider', name: 'Pale Threadspider', familyId: 'family-spider', ecosystem: 'arachnid',
        habitatTags: ['dry-crevice', 'collapsed-working', 'cave'], behavior: behavior('territorial', ['vibration'], 'solitary', []), encounterTemplateId: null,
    }),
    'species-lower-deepvein-ashwing-lantern-moth': species({
        id: 'species-lower-deepvein-ashwing-lantern-moth', name: 'Ashwing Lantern Moth', familyId: 'family-lantern-moth', ecosystem: 'insect',
        habitatTags: ['lampcap-bank', 'glowmoss-wall', 'cave'], behavior: behavior('passive', ['light'], 'swarm', []), encounterTemplateId: null,
    }),
    'species-lower-deepvein-threadfin': species({
        id: 'species-lower-deepvein-threadfin', name: 'Threadfin Cavefish', familyId: 'family-threadfin-cavefish', ecosystem: 'fish',
        habitatTags: ['black-water-pool', 'spring-fed-sump', 'cave'], behavior: behavior('passive', ['vibration'], 'shoal', []), encounterTemplateId: null,
    }),
    'species-lower-deepvein-salt-springtail': species({
        id: 'species-lower-deepvein-salt-springtail', name: 'Deepvein Salt Springtail', familyId: 'family-salt-springtail', ecosystem: 'insect',
        habitatTags: ['salt-bloom', 'damp-stone', 'fungus-bank'], behavior: behavior('passive', [], 'cluster', []), encounterTemplateId: null,
    }),
    'species-lower-deepvein-slateback-isopod': species({
        id: 'species-lower-deepvein-slateback-isopod', name: 'Slateback Cave Isopod', familyId: 'family-slateback-cave-isopod', ecosystem: 'crustacean',
        habitatTags: ['sump-clay', 'wet-rubble', 'cave'], behavior: behavior('passive', ['vibration'], 'cluster', []), encounterTemplateId: null,
    }),
});

const POPULATIONS = Object.freeze({
    'population-lower-deepvein-sootwing-bats': population({ id: 'population-lower-deepvein-sootwing-bats', speciesId: 'species-lower-deepvein-sootwing-bat', placeId: 'deepvein-lower-decline', biomeTags: ['timbered-gallery', 'high-cave'], capacity: 6, density: 'moderate', rarity: 'common', respawn: regeneration(1, 5400) }),
    'population-lower-deepvein-glass-salamanders': population({ id: 'population-lower-deepvein-glass-salamanders', speciesId: 'species-lower-deepvein-glass-salamander', placeId: 'deepvein-lower-decline', biomeTags: ['seep-wall', 'cool-stone'], capacity: 7, density: 'moderate', rarity: 'common', respawn: regeneration(2, 3600) }),
    'population-lower-deepvein-ashwing-moths': population({ id: 'population-lower-deepvein-ashwing-moths', speciesId: 'species-lower-deepvein-ashwing-lantern-moth', placeId: 'deepvein-lower-decline', biomeTags: ['lampcap-bank', 'glowmoss-wall'], capacity: 10, density: 'high', rarity: 'common', respawn: regeneration(2, 2700) }),
    'population-lower-deepvein-salt-springtails': population({ id: 'population-lower-deepvein-salt-springtails', speciesId: 'species-lower-deepvein-salt-springtail', placeId: 'deepvein-lower-decline', biomeTags: ['salt-bloom', 'damp-stone'], capacity: 12, density: 'high', rarity: 'common', respawn: regeneration(3, 2400) }),
    'population-lower-deepvein-blind-sump-crabs': population({ id: 'population-lower-deepvein-blind-sump-crabs', speciesId: 'species-lower-deepvein-blind-sump-crab', placeId: 'lower-deepvein-echoing-shelf', biomeTags: ['black-water-pool', 'sump'], capacity: 7, density: 'moderate', rarity: 'common', respawn: regeneration(2, 3600) }),
    'population-lower-deepvein-pale-threadspiders': population({ id: 'population-lower-deepvein-pale-threadspiders', speciesId: 'species-lower-deepvein-pale-threadspider', placeId: 'lower-deepvein-echoing-shelf', biomeTags: ['dry-crevice', 'collapsed-working'], capacity: 5, density: 'low', rarity: 'uncommon', respawn: regeneration(1, 5400) }),
    'population-lower-deepvein-threadfin': population({ id: 'population-lower-deepvein-threadfin', speciesId: 'species-lower-deepvein-threadfin', placeId: 'lower-deepvein-echoing-shelf', biomeTags: ['black-water-pool', 'spring-fed-sump'], capacity: 10, density: 'moderate', rarity: 'common', respawn: regeneration(2, 3000) }),
    'population-lower-deepvein-slateback-isopods': population({ id: 'population-lower-deepvein-slateback-isopods', speciesId: 'species-lower-deepvein-slateback-isopod', placeId: 'lower-deepvein-echoing-shelf', biomeTags: ['sump-clay', 'wet-rubble'], capacity: 9, density: 'moderate', rarity: 'common', respawn: regeneration(2, 3600) }),
});

const SOURCES = Object.freeze({
    'source-lower-deepvein-lampcap-shelf': source({
        id: 'source-lower-deepvein-lampcap-shelf', name: 'Lampcap Shelf', type: 'flora', placeId: 'lower-deepvein-echoing-shelf',
        biomeTags: ['fungus-bank', 'cool-stone'], action: 'forage', outputItemId: 'item-lower-deepvein-lampcap', capacity: 7,
        regeneration: regeneration(2, 3600), requiredToolTags: [], proficiencyId: 'foraging',
    }),
    'source-lower-deepvein-threadfin-pool': source({
        id: 'source-lower-deepvein-threadfin-pool', name: 'Blackpool Threadfin Shoal', type: 'fishing', placeId: 'lower-deepvein-echoing-shelf',
        biomeTags: ['black-water-pool', 'spring-fed-sump'], action: 'fish', outputItemId: 'item-lower-deepvein-threadfin', capacity: 10,
        regeneration: regeneration(2, 3000), requiredToolTags: ['fishing'], proficiencyId: 'fishing',
    }),
    'source-lower-deepvein-blind-crab-trap-bed': source({
        id: 'source-lower-deepvein-blind-crab-trap-bed', name: 'Sump Crab Trap Bed', type: 'fishing', placeId: 'lower-deepvein-echoing-shelf',
        biomeTags: ['black-water-pool', 'stone-margin'], action: 'trap', outputItemId: 'item-lower-deepvein-blind-sump-crab', capacity: 7,
        regeneration: regeneration(2, 3600), requiredToolTags: ['fishing'], proficiencyId: 'fishing', minProficiency: 1,
    }),
    'source-lower-deepvein-glowmoss-wall': source({
        id: 'source-lower-deepvein-glowmoss-wall', name: 'Glowmoss Seep Wall', type: 'flora', placeId: 'deepvein-lower-decline',
        biomeTags: ['seep-wall', 'damp-stone'], action: 'gather', outputItemId: 'item-lower-deepvein-glowmoss-fiber', capacity: 8,
        regeneration: regeneration(2, 3600), requiredToolTags: ['cutting'], proficiencyId: 'gathering',
    }),
    'source-lower-deepvein-salt-bloom-gallery': source({
        id: 'source-lower-deepvein-salt-bloom-gallery', name: 'Salt Bloom Gallery', type: 'mineral', placeId: 'deepvein-lower-decline',
        biomeTags: ['dry-wall', 'mineral-bloom'], action: 'gather', outputItemId: 'item-lower-deepvein-cave-salt-bloom', capacity: 8,
        regeneration: regeneration(2, 5400), requiredToolTags: [], proficiencyId: 'gathering',
    }),
    'source-lower-deepvein-quartz-rib': source({
        id: 'source-lower-deepvein-quartz-rib', name: 'Lower Deepvein Quartz Rib', type: 'mineral', placeId: 'lower-deepvein-echoing-shelf',
        biomeTags: ['quartz-rib', 'cave-wall'], action: 'mine', outputItemId: 'item-lower-deepvein-quartz-cluster', capacity: 5,
        regeneration: regeneration(1, 7200), requiredToolTags: ['mining'], proficiencyId: 'gathering', minProficiency: 1,
    }),
    'source-lower-deepvein-sump-clay-bank': source({
        id: 'source-lower-deepvein-sump-clay-bank', name: 'Deepvein Sump Clay Bank', type: 'mineral', placeId: 'deepvein-lower-decline',
        biomeTags: ['sump-margin', 'clay-bank'], action: 'gather', outputItemId: 'item-lower-deepvein-sump-clay', capacity: 9,
        regeneration: regeneration(2, 3600), requiredToolTags: ['digging'], proficiencyId: 'gathering',
    }),
});

export function getLowerDeepveinEcologyFamily(id) { return FAMILIES[String(id ?? '').trim()] ?? null; }
export function listLowerDeepveinEcologyFamilies() { return Object.values(FAMILIES); }
export function getLowerDeepveinSpecies(id) { return SPECIES[String(id ?? '').trim()] ?? null; }
export function listLowerDeepveinSpecies() { return Object.values(SPECIES); }
export function getLowerDeepveinPopulation(id) { return POPULATIONS[String(id ?? '').trim()] ?? null; }
export function listLowerDeepveinPopulations() { return Object.values(POPULATIONS); }
export function getLowerDeepveinGatheringSource(id) { return SOURCES[String(id ?? '').trim()] ?? null; }
export function listLowerDeepveinGatheringSources() { return Object.values(SOURCES); }

export function validateLowerDeepveinEcology() {
    const issues = [];
    const allFamily = (id) => getLowerDeepveinEcologyFamily(id) ?? getRegionalEcologyFamily(id) ?? getEcologyFamily(id);
    for (const entry of listLowerDeepveinEcologyFamilies()) {
        if (!validStableId(entry.id)) issues.push(`${entry.id} has invalid family id.`);
        if (!entry.name || !entry.tags.length) issues.push(`${entry.id} requires name and tags.`);
    }
    for (const entry of listLowerDeepveinSpecies()) {
        if (!validStableId(entry.id)) issues.push(`${entry.id} has invalid species id.`);
        if (!allFamily(entry.familyId)) issues.push(`${entry.id} references unknown family ${entry.familyId}.`);
        if (!entry.name || !entry.ecosystem || !entry.habitatTags.length) issues.push(`${entry.id} requires name, ecosystem, and habitat tags.`);
        if (!entry.behavior?.aggression || !Array.isArray(entry.behavior.senses) || !entry.behavior.socialMode) issues.push(`${entry.id} has invalid behavior.`);
    }
    for (const entry of listLowerDeepveinPopulations()) {
        if (!getLowerDeepveinSpecies(entry.speciesId)) issues.push(`${entry.id} references unknown species ${entry.speciesId}.`);
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!positiveInteger(entry.capacity)) issues.push(`${entry.id} requires positive capacity.`);
        if (!ECOLOGY_DENSITIES.includes(entry.density)) issues.push(`${entry.id} has unknown density ${entry.density}.`);
        if (!ECOLOGY_RARITIES.includes(entry.rarity)) issues.push(`${entry.id} has unknown rarity ${entry.rarity}.`);
        validateConditions(entry.appearanceConditions, entry.id, issues);
    }
    for (const entry of listLowerDeepveinGatheringSources()) {
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!ECOLOGY_SOURCE_TYPES.includes(entry.type)) issues.push(`${entry.id} has unknown source type ${entry.type}.`);
        if (!RESOURCE_RECOVERY_ACTIONS.includes(entry.action)) issues.push(`${entry.id} has unknown action ${entry.action}.`);
        const item = getLowerDeepveinResourceItem(entry.outputItemId);
        if (!item) issues.push(`${entry.id} references unknown Lower Deepvein item ${entry.outputItemId}.`);
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
