import {
    ECOLOGY_CONDITION_TYPES,
    ECOLOGY_DENSITIES,
    ECOLOGY_RARITIES,
    ECOLOGY_SOURCE_TYPES,
    getEcologyFamily,
    getSpecies,
} from './ecologyCatalog.js';
import { getHeadwaterEcologyFamily, getHeadwaterSpecies } from './headwaterEcology.js';
import { getIronspineEcologyFamily, getIronspineSpecies } from './ironspineEcology.js';
import { getPlace } from './places.js';
import { getRegionalEcologyFamily, getRegionalSpecies } from './regionalEcologyExpansion.js';
import { RESOURCE_RECOVERY_ACTIONS } from './resourceProvenance.js';
import { getWaymeetMarchesEcologyFamily, getWaymeetMarchesSpecies } from './waymeetMarchesEcology.js';
import { getHeadwaterHighlandTransitionRepairResourceItem } from './headwaterHighlandTransitionRepairResourceItems.js';

export const HEADWATER_HIGHLAND_TRANSITION_REPAIR_ECOLOGY_VERSION = 1;

const FAMILIES = Object.freeze({});

const SPECIES = Object.freeze({
    'species-headwater-meadow-grouse': species({
        id: 'species-headwater-meadow-grouse',
        name: 'Headwater Meadow Grouse',
        familyId: 'family-grouse',
        ecosystem: 'bird',
        habitatTags: ['upland-meadow', 'berry-scrub', 'forest-edge'],
        behavior: behavior('wary', ['sight', 'sound'], 'covey', []),
        encounterTemplateId: null,
    }),
    'species-headwater-meadow-bee': species({
        id: 'species-headwater-meadow-bee',
        name: 'Headwater Meadow Bee',
        familyId: 'family-bee',
        ecosystem: 'insect',
        habitatTags: ['flowering-meadow', 'berry-bank', 'forest-edge'],
        behavior: behavior('passive', ['sight'], 'swarm', []),
        encounterTemplateId: null,
    }),
    'species-slatewater-thyme-bee': species({
        id: 'species-slatewater-thyme-bee',
        name: 'Slatewater Thyme Bee',
        familyId: 'family-bee',
        ecosystem: 'insect',
        habitatTags: ['mountain-thyme', 'serviceberry-brake', 'upland-meadow'],
        behavior: behavior('passive', ['sight'], 'swarm', []),
        encounterTemplateId: null,
    }),
    'species-ironspine-snow-hare': species({
        id: 'species-ironspine-snow-hare',
        name: 'Ironspine Snow Hare',
        familyId: 'family-hare',
        ecosystem: 'beast',
        habitatTags: ['alpine-meadow', 'dwarf-willow', 'snow-edge'],
        behavior: behavior('wary', ['sight', 'sound'], 'solitary', []),
        encounterTemplateId: null,
    }),
    'species-ironspine-sorrel-bee': species({
        id: 'species-ironspine-sorrel-bee',
        name: 'Ironspine Sorrel Bee',
        familyId: 'family-bee',
        ecosystem: 'insect',
        habitatTags: ['alpine-sorrel', 'subalpine-flower', 'dwarf-willow'],
        behavior: behavior('passive', ['sight'], 'swarm', []),
        encounterTemplateId: null,
    }),
});

const POPULATIONS = Object.freeze({
    'population-headwater-meadow-grouse': population({
        id: 'population-headwater-meadow-grouse',
        speciesId: 'species-headwater-meadow-grouse',
        placeId: 'headwater-upper-vale',
        biomeTags: ['upland-meadow', 'berry-scrub', 'forest-edge'],
        capacity: 7, density: 'moderate', rarity: 'common',
        respawn: regen(2, 3600),
        appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 19 }],
    }),
    'population-headwater-meadow-bees': population({
        id: 'population-headwater-meadow-bees',
        speciesId: 'species-headwater-meadow-bee',
        placeId: 'headwater-upper-vale',
        biomeTags: ['flowering-meadow', 'meadowsweet', 'berry-bank'],
        capacity: 10, density: 'high', rarity: 'common',
        respawn: regen(2, 2700),
        appearanceConditions: [{ type: 'timeWindow', startHour: 8, endHour: 18 }],
    }),
    'population-headwater-upper-coldstream-trout': population({
        id: 'population-headwater-upper-coldstream-trout',
        speciesId: 'species-headwater-coldstream-trout',
        placeId: 'headwater-upper-vale',
        biomeTags: ['cold-tributary', 'gravel-run', 'spring-channel'],
        capacity: 8, density: 'moderate', rarity: 'common',
        respawn: regen(2, 2700),
    }),
    'population-windscar-grey-grouse': population({
        id: 'population-windscar-grey-grouse',
        speciesId: 'species-waymeet-grey-grouse',
        placeId: 'windscar-saddle',
        biomeTags: ['heather-slope', 'short-grass', 'sheltered-bank'],
        capacity: 6, density: 'moderate', rarity: 'common',
        respawn: regen(1, 4200),
        appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 19 }],
    }),
    'population-slatewater-brush-hares': population({
        id: 'population-slatewater-brush-hares',
        speciesId: 'species-brush-hare',
        placeId: 'slatewater-foothills',
        biomeTags: ['mixed-woodland', 'forest-edge', 'serviceberry-brake'],
        capacity: 7, density: 'moderate', rarity: 'common',
        respawn: regen(2, 2400),
        appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 20 }],
    }),
    'population-slatewater-thyme-bees': population({
        id: 'population-slatewater-thyme-bees',
        speciesId: 'species-slatewater-thyme-bee',
        placeId: 'slatewater-foothills',
        biomeTags: ['mountain-thyme', 'serviceberry-brake', 'sunny-slope'],
        capacity: 9, density: 'high', rarity: 'common',
        respawn: regen(2, 2700),
        appearanceConditions: [{ type: 'timeWindow', startHour: 8, endHour: 18 }],
    }),
    'population-ironspine-snow-hares': population({
        id: 'population-ironspine-snow-hares',
        speciesId: 'species-ironspine-snow-hare',
        placeId: 'ironspine-high-meadow',
        biomeTags: ['alpine-meadow', 'dwarf-willow', 'snow-edge'],
        capacity: 6, density: 'moderate', rarity: 'common',
        respawn: regen(1, 4200),
        appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 20 }],
    }),
    'population-ironspine-lower-sorrel-bees': population({
        id: 'population-ironspine-lower-sorrel-bees',
        speciesId: 'species-ironspine-sorrel-bee',
        placeId: 'ironspine-lower-pass',
        biomeTags: ['subalpine-meadow', 'dwarf-willow', 'flowering-scrub'],
        capacity: 7, density: 'moderate', rarity: 'common',
        respawn: regen(1, 3600),
        appearanceConditions: [{ type: 'timeWindow', startHour: 8, endHour: 17 }],
    }),
    'population-ironspine-high-sorrel-bees': population({
        id: 'population-ironspine-high-sorrel-bees',
        speciesId: 'species-ironspine-sorrel-bee',
        placeId: 'ironspine-high-meadow',
        biomeTags: ['alpine-sorrel', 'snowmelt-meadow', 'flowering-turf'],
        capacity: 6, density: 'low', rarity: 'common',
        respawn: regen(1, 4200),
        appearanceConditions: [{ type: 'timeWindow', startHour: 9, endHour: 17 }],
    }),
    'population-ironspine-high-snow-grouse': population({
        id: 'population-ironspine-high-snow-grouse',
        speciesId: 'species-ironspine-snow-grouse',
        placeId: 'ironspine-high-meadow',
        biomeTags: ['alpine-meadow', 'dwarf-willow', 'snow-edge'],
        capacity: 7, density: 'moderate', rarity: 'common',
        respawn: regen(2, 3600),
        appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 19 }],
    }),
});

const SOURCES = Object.freeze({
    'source-headwater-upper-bilberry-bank': source({
        id: 'source-headwater-upper-bilberry-bank',
        name: 'Upper Vale Bilberry Bank',
        type: 'flora',
        placeId: 'headwater-upper-vale',
        biomeTags: ['berry-bank', 'upland-meadow', 'forest-edge'],
        action: 'forage',
        outputItemId: 'item-headwater-upper-bilberry',
        capacity: 8,
        regeneration: regen(2, 3600),
        requiredToolTags: [],
        proficiencyId: 'foraging',
    }),
});

export function getHeadwaterHighlandTransitionRepairEcologyFamily(id) { return FAMILIES[String(id ?? '').trim()] ?? null; }
export function getHeadwaterHighlandTransitionRepairSpecies(id) { return SPECIES[String(id ?? '').trim()] ?? null; }
export function getHeadwaterHighlandTransitionRepairPopulation(id) { return POPULATIONS[String(id ?? '').trim()] ?? null; }
export function getHeadwaterHighlandTransitionRepairGatheringSource(id) { return SOURCES[String(id ?? '').trim()] ?? null; }
export function listHeadwaterHighlandTransitionRepairEcologyFamilies() { return Object.values(FAMILIES); }
export function listHeadwaterHighlandTransitionRepairSpecies() { return Object.values(SPECIES); }
export function listHeadwaterHighlandTransitionRepairPopulations() { return Object.values(POPULATIONS); }
export function listHeadwaterHighlandTransitionRepairGatheringSources() { return Object.values(SOURCES); }

export function validateHeadwaterHighlandTransitionRepairEcology() {
    const issues = [];
    const resolveFamily = (id) =>
        getHeadwaterHighlandTransitionRepairEcologyFamily(id)
        ?? getEcologyFamily(id)
        ?? getRegionalEcologyFamily(id)
        ?? getHeadwaterEcologyFamily(id)
        ?? getIronspineEcologyFamily(id)
        ?? getWaymeetMarchesEcologyFamily(id);
    const resolveSpecies = (id) =>
        getHeadwaterHighlandTransitionRepairSpecies(id)
        ?? getSpecies(id)
        ?? getRegionalSpecies(id)
        ?? getHeadwaterSpecies(id)
        ?? getIronspineSpecies(id)
        ?? getWaymeetMarchesSpecies(id);

    for (const entry of listHeadwaterHighlandTransitionRepairSpecies()) {
        if (!resolveFamily(entry.familyId)) issues.push(`${entry.id} references unknown family ${entry.familyId}.`);
        for (const linked of entry.behavior.linksWithFamilyIds) {
            if (!resolveFamily(linked)) issues.push(`${entry.id} links to unknown family ${linked}.`);
        }
    }
    for (const entry of listHeadwaterHighlandTransitionRepairPopulations()) {
        if (!resolveSpecies(entry.speciesId)) issues.push(`${entry.id} references unknown species ${entry.speciesId}.`);
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!ECOLOGY_DENSITIES.includes(entry.density)) issues.push(`${entry.id} has unknown density ${entry.density}.`);
        if (!ECOLOGY_RARITIES.includes(entry.rarity)) issues.push(`${entry.id} has unknown rarity ${entry.rarity}.`);
        for (const condition of entry.appearanceConditions) {
            if (!ECOLOGY_CONDITION_TYPES.includes(condition?.type)) issues.push(`${entry.id} has unknown condition type ${condition?.type}.`);
        }
    }
    for (const entry of listHeadwaterHighlandTransitionRepairGatheringSources()) {
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!ECOLOGY_SOURCE_TYPES.includes(entry.type)) issues.push(`${entry.id} has unknown source type ${entry.type}.`);
        if (!RESOURCE_RECOVERY_ACTIONS.includes(entry.action)) issues.push(`${entry.id} has unknown action ${entry.action}.`);
        const item = getHeadwaterHighlandTransitionRepairResourceItem(entry.outputItemId);
        if (!item) issues.push(`${entry.id} references unknown transition-repair item ${entry.outputItemId}.`);
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
