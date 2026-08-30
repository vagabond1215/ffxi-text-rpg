import {
    ECOLOGY_CONDITION_TYPES,
    ECOLOGY_DENSITIES,
    ECOLOGY_RARITIES,
    ECOLOGY_SOURCE_TYPES,
} from './ecologyCatalog.js';
import { getPlace } from './places.js';
import {
    getRegionalEcologyFamily,
    getRegionalSpecies,
} from './regionalEcologyExpansion.js';
import { RESOURCE_RECOVERY_ACTIONS } from './resourceProvenance.js';
import { getDryUplandSaltpanRepairResourceItem } from './dryUplandSaltpanRepairResourceItems.js';

export const DRY_UPLAND_SALTPAN_REPAIR_ECOLOGY_VERSION = 1;

const FAMILIES = Object.freeze({});

const SPECIES = Object.freeze({
    'species-redstone-stone-grouse': species({
        id: 'species-redstone-stone-grouse',
        name: 'Redstone Stone Grouse',
        familyId: 'family-grouse',
        ecosystem: 'bird',
        habitatTags: ['wind-scoured-ridge','dry-grassland','montane-scrub'],
        behavior: behavior('wary', ['sight','sound'], 'covey', []),
        encounterTemplateId: null,
    }),
});

const POPULATIONS = Object.freeze({
    'population-north-redstone-ridge-ibex': population({
        id: 'population-north-redstone-ridge-ibex',
        speciesId: 'species-redstone-ridge-ibex',
        placeId: 'north-redstone-reach',
        biomeTags: ['wind-scoured-ridge','rocky-upland'],
        capacity: 4, density: 'low', rarity: 'common',
        respawn: regen(1, 5400),
    }),
    'population-north-redstone-sunscale-lizards': population({
        id: 'population-north-redstone-sunscale-lizards',
        speciesId: 'species-redstone-sunscale-lizard',
        placeId: 'north-redstone-reach',
        biomeTags: ['sun-warmed-rock','dry-scrub'],
        capacity: 5, density: 'low', rarity: 'common',
        respawn: regen(1, 3600),
        appearanceConditions: [{ type: 'timeWindow', startHour: 8, endHour: 18 }],
    }),
    'population-north-redstone-stone-grouse': population({
        id: 'population-north-redstone-stone-grouse',
        speciesId: 'species-redstone-stone-grouse',
        placeId: 'north-redstone-reach',
        biomeTags: ['dry-grassland','montane-scrub','ridge-millet'],
        capacity: 7, density: 'moderate', rarity: 'common',
        respawn: regen(2, 3600),
        appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 19 }],
    }),
});

const SOURCES = Object.freeze({
    'source-south-redstone-sunbent-bunchgrass-bench': source({
        id: 'source-south-redstone-sunbent-bunchgrass-bench', name: 'Sunbent Bunchgrass Bench',
        type: 'flora', placeId: 'south-redstone-reach', biomeTags: ['dry-grassland','quarry-verge'],
        action: 'gather', outputItemId: 'item-redstone-sunbent-bunchgrass', capacity: 10,
        regeneration: regen(2, 3600), requiredToolTags: ['cutting'], proficiencyId: 'gathering',
    }),
    'source-south-redstone-stone-thyme-slope': source({
        id: 'source-south-redstone-stone-thyme-slope', name: 'Stone Thyme Slope',
        type: 'flora', placeId: 'south-redstone-reach', biomeTags: ['sun-baked-scree','dry-forb-slope'],
        action: 'forage', outputItemId: 'item-redstone-stone-thyme', capacity: 7,
        regeneration: regen(2, 3600), requiredToolTags: [], proficiencyId: 'foraging',
    }),
    'source-south-redstone-drythorn-resin-scrub': source({
        id: 'source-south-redstone-drythorn-resin-scrub', name: 'Drythorn Resin Scrub',
        type: 'flora', placeId: 'south-redstone-reach', biomeTags: ['dry-scrub','quarry-road'],
        action: 'gather', outputItemId: 'item-redstone-drythorn-resin', capacity: 6,
        regeneration: regen(1, 5400), requiredToolTags: ['cutting'], proficiencyId: 'gathering', minProficiency: 1,
    }),
    'source-north-redstone-wind-juniper-brake': source({
        id: 'source-north-redstone-wind-juniper-brake', name: 'Wind Juniper Brake',
        type: 'flora', placeId: 'north-redstone-reach', biomeTags: ['wind-scoured-ridge','montane-scrub'],
        action: 'forage', outputItemId: 'item-redstone-wind-juniper-berry', capacity: 7,
        regeneration: regen(1, 4200), requiredToolTags: [], proficiencyId: 'foraging',
    }),
    'source-north-redstone-ridge-yarrow-patch': source({
        id: 'source-north-redstone-ridge-yarrow-patch', name: 'Ridge Yarrow Patch',
        type: 'flora', placeId: 'north-redstone-reach', biomeTags: ['dry-grassland','sheltered-ridge'],
        action: 'forage', outputItemId: 'item-redstone-ridge-yarrow', capacity: 6,
        regeneration: regen(1, 4200), requiredToolTags: [], proficiencyId: 'foraging', minProficiency: 1,
    }),
    'source-emberwash-saltbrush-shoot-brake': source({
        id: 'source-emberwash-saltbrush-shoot-brake', name: 'Saltbrush Shoot Brake',
        type: 'flora', placeId: 'emberwash-saltpan-verge', biomeTags: ['saltbrush','scrub-flat','saltpan-verge'],
        action: 'gather', outputItemId: 'item-emberwash-saltbrush-shoot', capacity: 8,
        regeneration: regen(2, 4200), requiredToolTags: ['cutting'], proficiencyId: 'gathering',
    }),
    'source-emberwash-saltgrass-flat': source({
        id: 'source-emberwash-saltgrass-flat', name: 'Saltgrass Flat',
        type: 'flora', placeId: 'emberwash-saltpan-verge', biomeTags: ['saline-flat','dry-channel-margin'],
        action: 'gather', outputItemId: 'item-emberwash-saltgrass-fiber', capacity: 10,
        regeneration: regen(2, 4200), requiredToolTags: ['cutting'], proficiencyId: 'gathering',
    }),
    'source-emberwash-panbloom-verge': source({
        id: 'source-emberwash-panbloom-verge', name: 'Panbloom Verge',
        type: 'flora', placeId: 'emberwash-saltpan-verge', biomeTags: ['saltpan-verge','halophyte-bloom'],
        action: 'forage', outputItemId: 'item-emberwash-panbloom-petal', capacity: 5,
        regeneration: regen(1, 5400), requiredToolTags: [], proficiencyId: 'foraging', minProficiency: 1,
        appearanceConditions: [{ type: 'timeWindow', startHour: 6, endHour: 17 }],
    }),
});

export function getDryUplandSaltpanRepairEcologyFamily(id) { return FAMILIES[String(id ?? '').trim()] ?? null; }
export function getDryUplandSaltpanRepairSpecies(id) { return SPECIES[String(id ?? '').trim()] ?? null; }
export function getDryUplandSaltpanRepairPopulation(id) { return POPULATIONS[String(id ?? '').trim()] ?? null; }
export function getDryUplandSaltpanRepairGatheringSource(id) { return SOURCES[String(id ?? '').trim()] ?? null; }
export function listDryUplandSaltpanRepairEcologyFamilies() { return Object.values(FAMILIES); }
export function listDryUplandSaltpanRepairSpecies() { return Object.values(SPECIES); }
export function listDryUplandSaltpanRepairPopulations() { return Object.values(POPULATIONS); }
export function listDryUplandSaltpanRepairGatheringSources() { return Object.values(SOURCES); }

export function validateDryUplandSaltpanRepairEcology() {
    const issues = [];
    const resolveFamily = (id) => getDryUplandSaltpanRepairEcologyFamily(id) ?? getRegionalEcologyFamily(id);
    const resolveSpecies = (id) => getDryUplandSaltpanRepairSpecies(id) ?? getRegionalSpecies(id);

    for (const entry of listDryUplandSaltpanRepairSpecies()) {
        if (!resolveFamily(entry.familyId)) issues.push(`${entry.id} references unknown family ${entry.familyId}.`);
        for (const linked of entry.behavior.linksWithFamilyIds) {
            if (!resolveFamily(linked)) issues.push(`${entry.id} links to unknown family ${linked}.`);
        }
    }
    for (const entry of listDryUplandSaltpanRepairPopulations()) {
        if (!resolveSpecies(entry.speciesId)) issues.push(`${entry.id} references unknown species ${entry.speciesId}.`);
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!ECOLOGY_DENSITIES.includes(entry.density)) issues.push(`${entry.id} has unknown density ${entry.density}.`);
        if (!ECOLOGY_RARITIES.includes(entry.rarity)) issues.push(`${entry.id} has unknown rarity ${entry.rarity}.`);
        for (const condition of entry.appearanceConditions) {
            if (!ECOLOGY_CONDITION_TYPES.includes(condition?.type)) issues.push(`${entry.id} has unknown condition type ${condition?.type}.`);
        }
    }
    for (const entry of listDryUplandSaltpanRepairGatheringSources()) {
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!ECOLOGY_SOURCE_TYPES.includes(entry.type)) issues.push(`${entry.id} has unknown source type ${entry.type}.`);
        if (!RESOURCE_RECOVERY_ACTIONS.includes(entry.action)) issues.push(`${entry.id} has unknown action ${entry.action}.`);
        const item = getDryUplandSaltpanRepairResourceItem(entry.outputItemId);
        if (!item) issues.push(`${entry.id} references unknown dry-upland/saltpan repair item ${entry.outputItemId}.`);
        else if (!item.provenance.some((p) => p.sourceId === entry.id && p.placeId === entry.placeId && p.action === entry.action)) {
            issues.push(`${entry.id} output lacks exact provenance backlink.`);
        }
    }
    return issues;
}

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
