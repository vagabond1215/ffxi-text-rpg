import {
    ECOLOGY_CONDITION_TYPES,
    ECOLOGY_DENSITIES,
    ECOLOGY_RARITIES,
    ECOLOGY_SOURCE_TYPES,
    getEcologyFamily,
    getSpecies,
} from './ecologyCatalog.js';
import { getPlace } from './places.js';
import { getRegionalEcologyFamily, getRegionalSpecies } from './regionalEcologyExpansion.js';
import { RESOURCE_RECOVERY_ACTIONS } from './resourceProvenance.js';
import { getElderwoodRepairResourceItem } from './elderwoodRepairResourceItems.js';

export const ELDERWOOD_REPAIR_ECOLOGY_VERSION = 1;

const FAMILIES = Object.freeze({
    'family-river-dace': family('family-river-dace', 'River Dace', ['fish','freshwater','river','shoaling']),
});

const SPECIES = Object.freeze({
    'species-east-elderwood-crownwood-hart': species({
        id: 'species-east-elderwood-crownwood-hart', name: 'Crownwood Hart', familyId: 'family-hart', ecosystem: 'beast',
        habitatTags: ['temperate-woodland','woodland-glade','coppice-edge'],
        behavior: behavior('wary', ['sight','sound'], 'small-herd', []), encounterTemplateId: null,
    }),
    'species-thornwall-cellar-bat': species({
        id: 'species-thornwall-cellar-bat', name: 'Thornwall Cellar Bat', familyId: 'family-bat', ecosystem: 'beast',
        habitatTags: ['cistern-passage','old-vault','darkness'],
        behavior: behavior('wary', ['sound'], 'colony', []), encounterTemplateId: null,
    }),
    'species-timbercross-bronze-dace': species({
        id: 'species-timbercross-bronze-dace', name: 'Timbercross Bronze Dace', familyId: 'family-river-dace', ecosystem: 'fish',
        habitatTags: ['navigable-river','gravel-run','woody-margin'],
        behavior: behavior('passive', ['vibration'], 'shoal', []), encounterTemplateId: null,
    }),
    'species-timbercross-river-teal': species({
        id: 'species-timbercross-river-teal', name: 'Timbercross River Teal', familyId: 'family-waterfowl', ecosystem: 'bird',
        habitatTags: ['river-bend','reed-margin','quiet-backwater'],
        behavior: behavior('wary', ['sight','sound'], 'flock', []), encounterTemplateId: null,
    }),
    'species-timbercross-bank-frog': species({
        id: 'species-timbercross-bank-frog', name: 'Timbercross Bank Frog', familyId: 'family-frog', ecosystem: 'amphibian',
        habitatTags: ['damp-bank','sedge-margin','backwater'],
        behavior: behavior('passive', ['vibration'], 'cluster', []), encounterTemplateId: null,
    }),
    'species-thornwall-gaol-webspider': species({
        id: 'species-thornwall-gaol-webspider', name: 'Gaol Webspider', familyId: 'family-spider', ecosystem: 'arachnid',
        habitatTags: ['cellar-wall','dry-cistern-edge','old-masonry'],
        behavior: behavior('territorial', ['vibration'], 'solitary', []), encounterTemplateId: null,
    }),
});

const POPULATIONS = Object.freeze({
    'population-east-elderwood-brush-hares': population({
        id: 'population-east-elderwood-brush-hares', speciesId: 'species-brush-hare', placeId: 'east-elderwood',
        biomeTags: ['temperate-woodland','forest-edge'], capacity: 7, density: 'moderate', rarity: 'common',
        respawn: regen(2, 1800),
    }),
    'population-east-elderwood-crownwood-harts': population({
        id: 'population-east-elderwood-crownwood-harts', speciesId: 'species-east-elderwood-crownwood-hart', placeId: 'east-elderwood',
        biomeTags: ['woodland-glade','coppice-edge'], capacity: 4, density: 'low', rarity: 'common',
        respawn: regen(1, 7200),
    }),
    'population-east-elderwood-barkboars': population({
        id: 'population-east-elderwood-barkboars', speciesId: 'species-elderwood-barkboar', placeId: 'east-elderwood',
        biomeTags: ['root-thicket','mixed-woodland'], capacity: 3, density: 'low', rarity: 'uncommon',
        respawn: regen(1, 7200),
    }),
    'population-east-elderwood-moss-owls': population({
        id: 'population-east-elderwood-moss-owls', speciesId: 'species-elderwood-moss-owl', placeId: 'east-elderwood',
        biomeTags: ['mature-canopy','woodland-edge'], capacity: 2, density: 'sparse', rarity: 'uncommon',
        respawn: regen(1, 7200), appearanceConditions: [{ type: 'timeWindow', startHour: 18, endHour: 24 }],
    }),
    'population-timbercross-bronze-dace': population({
        id: 'population-timbercross-bronze-dace', speciesId: 'species-timbercross-bronze-dace', placeId: 'timbercross-landing',
        biomeTags: ['navigable-river','gravel-run'], capacity: 12, density: 'high', rarity: 'common',
        respawn: regen(3, 1800),
    }),
    'population-timbercross-river-teal': population({
        id: 'population-timbercross-river-teal', speciesId: 'species-timbercross-river-teal', placeId: 'timbercross-landing',
        biomeTags: ['river-bend','quiet-backwater'], capacity: 7, density: 'moderate', rarity: 'common',
        respawn: regen(2, 3600), appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 20 }],
    }),
    'population-timbercross-bank-frogs': population({
        id: 'population-timbercross-bank-frogs', speciesId: 'species-timbercross-bank-frog', placeId: 'timbercross-landing',
        biomeTags: ['damp-bank','sedge-margin'], capacity: 9, density: 'high', rarity: 'common',
        respawn: regen(2, 2700),
    }),
    'population-thornwall-old-gaol-cellar-bats': population({
        id: 'population-thornwall-old-gaol-cellar-bats', speciesId: 'species-thornwall-cellar-bat', placeId: 'thornwall-old-gaol',
        biomeTags: ['cistern-passage','old-vault'], capacity: 6, density: 'moderate', rarity: 'common',
        respawn: regen(1, 5400),
    }),
    'population-thornwall-old-gaol-webspiders': population({
        id: 'population-thornwall-old-gaol-webspiders', speciesId: 'species-thornwall-gaol-webspider', placeId: 'thornwall-old-gaol',
        biomeTags: ['cellar-wall','old-masonry'], capacity: 5, density: 'moderate', rarity: 'common',
        respawn: regen(1, 5400),
    }),
});

const SOURCES = Object.freeze({
    'source-east-elderwood-wood-sorrel-bank': source({
        id: 'source-east-elderwood-wood-sorrel-bank', name: 'Wood Sorrel Bank', type: 'flora', placeId: 'east-elderwood',
        biomeTags: ['mossy-loam','dappled-understory'], action: 'forage', outputItemId: 'item-elderwood-wood-sorrel',
        capacity: 8, regeneration: regen(2, 2700), requiredToolTags: [], proficiencyId: 'foraging',
    }),
    'source-east-elderwood-wayleaf-patch': source({
        id: 'source-east-elderwood-wayleaf-patch', name: 'Wayleaf Patch', type: 'flora', placeId: 'east-elderwood',
        biomeTags: ['path-edge','open-understory'], action: 'forage', outputItemId: 'item-elderwood-wayleaf',
        capacity: 6, regeneration: regen(1, 3600), requiredToolTags: [], proficiencyId: 'foraging', minProficiency: 1,
    }),
    'source-east-elderwood-bluebell-glade': source({
        id: 'source-east-elderwood-bluebell-glade', name: 'Bluebell Glade', type: 'flora', placeId: 'east-elderwood',
        biomeTags: ['flowering-glade','mature-woodland'], action: 'forage', outputItemId: 'item-elderwood-bluebell-petal',
        capacity: 5, regeneration: regen(1, 5400), requiredToolTags: [], proficiencyId: 'foraging',
        appearanceConditions: [{ type: 'timeWindow', startHour: 6, endHour: 19 }],
    }),
    'source-timbercross-river-mint-bank': source({
        id: 'source-timbercross-river-mint-bank', name: 'River Mint Bank', type: 'flora', placeId: 'timbercross-landing',
        biomeTags: ['damp-bank','river-edge'], action: 'forage', outputItemId: 'item-timbercross-river-mint',
        capacity: 8, regeneration: regen(2, 2700), requiredToolTags: [], proficiencyId: 'foraging',
    }),
    'source-timbercross-willowherb-bank': source({
        id: 'source-timbercross-willowherb-bank', name: 'Willowherb Bank', type: 'flora', placeId: 'timbercross-landing',
        biomeTags: ['disturbed-bank','willow-margin'], action: 'forage', outputItemId: 'item-timbercross-willowherb',
        capacity: 7, regeneration: regen(1, 3600), requiredToolTags: [], proficiencyId: 'foraging', minProficiency: 1,
    }),
    'source-timbercross-sedge-stand': source({
        id: 'source-timbercross-sedge-stand', name: 'Landing Sedge Stand', type: 'flora', placeId: 'timbercross-landing',
        biomeTags: ['backwater-margin','wet-bank'], action: 'gather', outputItemId: 'item-timbercross-sedge-fiber',
        capacity: 10, regeneration: regen(2, 3600), requiredToolTags: ['cutting'], proficiencyId: 'gathering',
    }),
    'source-timbercross-river-currant-brake': source({
        id: 'source-timbercross-river-currant-brake', name: 'River Currant Brake', type: 'flora', placeId: 'timbercross-landing',
        biomeTags: ['alluvial-bank','forest-edge'], action: 'forage', outputItemId: 'item-timbercross-river-currant',
        capacity: 7, regeneration: regen(1, 3600), requiredToolTags: [], proficiencyId: 'foraging',
    }),
    'source-timbercross-bronze-dace-run': source({
        id: 'source-timbercross-bronze-dace-run', name: 'Bronze Dace Run', type: 'fishing', placeId: 'timbercross-landing',
        biomeTags: ['navigable-river','gravel-run','woody-margin'], action: 'fish', outputItemId: 'item-timbercross-bronze-dace',
        capacity: 12, regeneration: regen(3, 1800), requiredToolTags: ['fishing'], proficiencyId: 'fishing',
    }),
    'source-thornwall-old-gaol-cistern-moss': source({
        id: 'source-thornwall-old-gaol-cistern-moss', name: 'Cistern Moss Seam', type: 'flora', placeId: 'thornwall-old-gaol',
        biomeTags: ['damp-cistern','old-masonry'], action: 'gather', outputItemId: 'item-thornwall-cistern-moss',
        capacity: 6, regeneration: regen(1, 5400), requiredToolTags: [], proficiencyId: 'gathering',
    }),
    'source-thornwall-old-gaol-shelf-fungus': source({
        id: 'source-thornwall-old-gaol-shelf-fungus', name: 'Gaol Shelf-Fungus Cluster', type: 'flora', placeId: 'thornwall-old-gaol',
        biomeTags: ['damp-cellar','rotting-timber'], action: 'forage', outputItemId: 'item-thornwall-gaol-shelf-fungus',
        capacity: 5, regeneration: regen(1, 5400), requiredToolTags: [], proficiencyId: 'foraging',
    }),
});

export function getElderwoodRepairEcologyFamily(id) { return FAMILIES[String(id ?? '').trim()] ?? null; }
export function getElderwoodRepairSpecies(id) { return SPECIES[String(id ?? '').trim()] ?? null; }
export function getElderwoodRepairPopulation(id) { return POPULATIONS[String(id ?? '').trim()] ?? null; }
export function getElderwoodRepairGatheringSource(id) { return SOURCES[String(id ?? '').trim()] ?? null; }
export function listElderwoodRepairEcologyFamilies() { return Object.values(FAMILIES); }
export function listElderwoodRepairSpecies() { return Object.values(SPECIES); }
export function listElderwoodRepairPopulations() { return Object.values(POPULATIONS); }
export function listElderwoodRepairGatheringSources() { return Object.values(SOURCES); }

export function validateElderwoodRepairEcology() {
    const issues = [];
    const resolveFamily = (id) => getElderwoodRepairEcologyFamily(id) ?? getEcologyFamily(id) ?? getRegionalEcologyFamily(id);
    const resolveSpecies = (id) => getElderwoodRepairSpecies(id) ?? getSpecies(id) ?? getRegionalSpecies(id);

    for (const entry of listElderwoodRepairSpecies()) {
        if (!resolveFamily(entry.familyId)) issues.push(`${entry.id} references unknown family ${entry.familyId}.`);
        for (const linked of entry.behavior.linksWithFamilyIds) {
            if (!resolveFamily(linked)) issues.push(`${entry.id} links to unknown family ${linked}.`);
        }
    }
    for (const entry of listElderwoodRepairPopulations()) {
        if (!resolveSpecies(entry.speciesId)) issues.push(`${entry.id} references unknown species ${entry.speciesId}.`);
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!ECOLOGY_DENSITIES.includes(entry.density)) issues.push(`${entry.id} has unknown density ${entry.density}.`);
        if (!ECOLOGY_RARITIES.includes(entry.rarity)) issues.push(`${entry.id} has unknown rarity ${entry.rarity}.`);
        for (const condition of entry.appearanceConditions) {
            if (!ECOLOGY_CONDITION_TYPES.includes(condition?.type)) issues.push(`${entry.id} has unknown condition type ${condition?.type}.`);
        }
    }
    for (const entry of listElderwoodRepairGatheringSources()) {
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!ECOLOGY_SOURCE_TYPES.includes(entry.type)) issues.push(`${entry.id} has unknown source type ${entry.type}.`);
        if (!RESOURCE_RECOVERY_ACTIONS.includes(entry.action)) issues.push(`${entry.id} has unknown action ${entry.action}.`);
        const item = getElderwoodRepairResourceItem(entry.outputItemId);
        if (!item) issues.push(`${entry.id} references unknown Elderwood repair item ${entry.outputItemId}.`);
        else if (!item.provenance.some((p) => p.sourceId === entry.id && p.placeId === entry.placeId && p.action === entry.action)) {
            issues.push(`${entry.id} output lacks exact provenance backlink.`);
        }
    }
    return issues;
}

function family(id, name, tags) { return freeze({ id, name, tags: [...tags] }); }
function species({ id, name, familyId, ecosystem, habitatTags, behavior: b, encounterTemplateId }) {
    return freeze({ id, name, familyId, ecosystem, habitatTags: [...habitatTags], behavior: b, encounterTemplateId });
}
function behavior(aggression, senses, socialMode, linksWithFamilyIds) {
    return freeze({ aggression, senses: [...senses], socialMode, linksWithFamilyIds: [...linksWithFamilyIds] });
}
function population({ id, speciesId, placeId, biomeTags, capacity, density, rarity, respawn, appearanceConditions = [] }) {
    return freeze({ id, speciesId, placeId, biomeTags: [...biomeTags], capacity, density, rarity, respawn, appearanceConditions: [...appearanceConditions], namedVariantHooks: [] });
}
function source({ id, name, type, placeId, biomeTags, action, outputItemId, capacity, regeneration, requiredToolTags, proficiencyId, minProficiency = 0, appearanceConditions = [] }) {
    return freeze({ id, name, type, placeId, biomeTags: [...biomeTags], action, outputItemId, capacity, regeneration, requiredToolTags: [...requiredToolTags], proficiencyId, minProficiency, appearanceConditions: [...appearanceConditions] });
}
function regen(units, everySeconds) { return freeze({ units, everySeconds }); }
function freeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) freeze(child);
    return Object.freeze(value);
}
