import { ECOLOGY_CONDITION_TYPES, ECOLOGY_DENSITIES, ECOLOGY_RARITIES, ECOLOGY_SOURCE_TYPES } from './ecologyCatalog.js';
import { getIronspineResourceItem } from './ironspineResourceItems.js';
import { getPlace } from './places.js';
import { getRegionalEcologyFamily } from './regionalEcologyExpansion.js';
import { RESOURCE_RECOVERY_ACTIONS } from './resourceProvenance.js';

export const IRONSPINE_ECOLOGY_VERSION = 1;

const SPECIES = Object.freeze({
    'species-ironspine-snowhorn-ibex': species({
        id: 'species-ironspine-snowhorn-ibex',
        name: 'Ironspine Snowhorn Ibex',
        familyId: 'family-ridge-ibex',
        ecosystem: 'beast',
        habitatTags: ['alpine-meadow', 'scree-slope', 'high-pass'],
        behavior: behavior('wary', ['sight', 'sound'], 'herd', []),
        encounterTemplateId: 'enemy-ironspine-snowhorn-ibex',
    }),
    'species-ironspine-cliff-bear': species({
        id: 'species-ironspine-cliff-bear',
        name: 'Ironspine Cliff Bear',
        familyId: 'family-bear',
        ecosystem: 'beast',
        habitatTags: ['subalpine-scrub', 'rock-shelter', 'lower-pass'],
        behavior: behavior('territorial', ['sight', 'sound'], 'solitary', []),
        encounterTemplateId: 'enemy-ironspine-cliff-bear',
    }),
    'species-ironspine-froststep-lynx': species({
        id: 'species-ironspine-froststep-lynx',
        name: 'Froststep Lynx',
        familyId: 'family-lynx',
        ecosystem: 'beast',
        habitatTags: ['alpine-scree', 'snow-pocket', 'high-meadow'],
        behavior: behavior('wary', ['sight', 'sound'], 'solitary', ['family-marmot', 'family-grouse']),
        encounterTemplateId: 'enemy-ironspine-froststep-lynx',
    }),
    'species-ironspine-crag-marmot': species({
        id: 'species-ironspine-crag-marmot',
        name: 'Ironspine Crag Marmot',
        familyId: 'family-marmot',
        ecosystem: 'beast',
        habitatTags: ['talus', 'alpine-meadow', 'sun-warmed-rock'],
        behavior: behavior('wary', ['sight', 'sound'], 'colony', []),
        encounterTemplateId: null,
    }),
    'species-ironspine-whitecrest-eagle': species({
        id: 'species-ironspine-whitecrest-eagle',
        name: 'Whitecrest Eagle',
        familyId: 'family-mountain-eagle',
        ecosystem: 'bird',
        habitatTags: ['cliff', 'high-pass', 'alpine-sky'],
        behavior: behavior('wary', ['sight'], 'pair', ['family-marmot', 'family-grouse']),
        encounterTemplateId: null,
    }),
    'species-ironspine-snow-grouse': species({
        id: 'species-ironspine-snow-grouse',
        name: 'Ironspine Snow Grouse',
        familyId: 'family-grouse',
        ecosystem: 'bird',
        habitatTags: ['dwarf-willow', 'alpine-meadow', 'snow-edge'],
        behavior: behavior('wary', ['sight', 'sound'], 'covey', []),
        encounterTemplateId: null,
    }),
});

const POPULATIONS = Object.freeze({
    'population-ironspine-snowhorn-ibex': population({
        id: 'population-ironspine-snowhorn-ibex',
        speciesId: 'species-ironspine-snowhorn-ibex',
        placeId: 'ironspine-high-meadow',
        biomeTags: ['alpine-meadow', 'scree-slope'],
        capacity: 6,
        density: 'moderate',
        rarity: 'common',
        respawn: regeneration(1, 7200),
        appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 19 }],
    }),
    'population-ironspine-cliff-bears': population({
        id: 'population-ironspine-cliff-bears',
        speciesId: 'species-ironspine-cliff-bear',
        placeId: 'ironspine-lower-pass',
        biomeTags: ['subalpine-scrub', 'rock-shelter'],
        capacity: 2,
        density: 'sparse',
        rarity: 'uncommon',
        respawn: regeneration(1, 14400),
    }),
    'population-ironspine-froststep-lynxes': population({
        id: 'population-ironspine-froststep-lynxes',
        speciesId: 'species-ironspine-froststep-lynx',
        placeId: 'ironspine-high-meadow',
        biomeTags: ['alpine-scree', 'snow-pocket'],
        capacity: 2,
        density: 'sparse',
        rarity: 'uncommon',
        respawn: regeneration(1, 14400),
        appearanceConditions: [{ type: 'timeWindow', startHour: 16, endHour: 24 }],
    }),
    'population-ironspine-crag-marmots': population({
        id: 'population-ironspine-crag-marmots',
        speciesId: 'species-ironspine-crag-marmot',
        placeId: 'ironspine-high-meadow',
        biomeTags: ['talus', 'sun-warmed-rock'],
        capacity: 9,
        density: 'high',
        rarity: 'common',
        respawn: regeneration(2, 2700),
        appearanceConditions: [{ type: 'timeWindow', startHour: 7, endHour: 18 }],
    }),
    'population-ironspine-whitecrest-eagles': population({
        id: 'population-ironspine-whitecrest-eagles',
        speciesId: 'species-ironspine-whitecrest-eagle',
        placeId: 'ironspine-high-meadow',
        biomeTags: ['cliff', 'alpine-sky'],
        capacity: 2,
        density: 'sparse',
        rarity: 'uncommon',
        respawn: regeneration(1, 10800),
        appearanceConditions: [{ type: 'timeWindow', startHour: 7, endHour: 18 }],
    }),
    'population-ironspine-snow-grouse': population({
        id: 'population-ironspine-snow-grouse',
        speciesId: 'species-ironspine-snow-grouse',
        placeId: 'ironspine-lower-pass',
        biomeTags: ['dwarf-willow', 'subalpine-meadow'],
        capacity: 8,
        density: 'moderate',
        rarity: 'common',
        respawn: regeneration(2, 2700),
        appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 19 }],
    }),
});

const SOURCES = Object.freeze({
    'source-ironspine-stonepine-grove': source({
        id: 'source-ironspine-stonepine-grove',
        name: 'Stonepine Cone Grove',
        type: 'flora',
        placeId: 'ironspine-lower-pass',
        biomeTags: ['subalpine-conifer', 'sheltered-slope'],
        action: 'forage',
        outputItemId: 'item-ironspine-stonepine-cone',
        capacity: 7,
        regeneration: regeneration(2, 3600),
        requiredToolTags: [],
        proficiencyId: 'foraging',
    }),
    'source-ironspine-alpine-sorrel-patch': source({
        id: 'source-ironspine-alpine-sorrel-patch',
        name: 'Alpine Sorrel Patch',
        type: 'flora',
        placeId: 'ironspine-high-meadow',
        biomeTags: ['alpine-meadow', 'spring-seep'],
        action: 'forage',
        outputItemId: 'item-ironspine-alpine-sorrel',
        capacity: 6,
        regeneration: regeneration(1, 2700),
        requiredToolTags: [],
        proficiencyId: 'foraging',
    }),
    'source-ironspine-frost-lichen-face': source({
        id: 'source-ironspine-frost-lichen-face',
        name: 'Frost Lichen Face',
        type: 'flora',
        placeId: 'ironspine-high-meadow',
        biomeTags: ['shaded-cliff', 'snowmelt-face'],
        action: 'forage',
        outputItemId: 'item-ironspine-frost-lichen',
        capacity: 4,
        regeneration: regeneration(1, 5400),
        requiredToolTags: [],
        proficiencyId: 'foraging',
        minProficiency: 2,
    }),
    'source-ironspine-dwarf-willow-scrub': source({
        id: 'source-ironspine-dwarf-willow-scrub',
        name: 'Dwarf Willow Scrub',
        type: 'flora',
        placeId: 'ironspine-lower-pass',
        biomeTags: ['subalpine-scrub', 'stream-edge'],
        action: 'forage',
        outputItemId: 'item-ironspine-dwarf-willow-bark',
        capacity: 6,
        regeneration: regeneration(1, 3600),
        requiredToolTags: ['cutting'],
        proficiencyId: 'foraging',
    }),
    'source-ironspine-lodestone-seam': source({
        id: 'source-ironspine-lodestone-seam',
        name: 'Lodestone Iron Seam',
        type: 'mineral',
        placeId: 'ironspine-high-meadow',
        biomeTags: ['exposed-ridge', 'ore-bearing-rock'],
        action: 'mine',
        outputItemId: 'item-ironspine-lodestone-ore',
        capacity: 4,
        regeneration: regeneration(1, 14400),
        requiredToolTags: ['mining'],
        proficiencyId: 'mining',
        minProficiency: 2,
    }),
    'source-ironspine-cloud-quartz-pocket': source({
        id: 'source-ironspine-cloud-quartz-pocket',
        name: 'Cloud Quartz Pocket',
        type: 'mineral',
        placeId: 'ironspine-high-meadow',
        biomeTags: ['quartz-vein', 'high-scree'],
        action: 'mine',
        outputItemId: 'item-ironspine-cloud-quartz',
        capacity: 2,
        regeneration: regeneration(1, 21600),
        requiredToolTags: ['mining'],
        proficiencyId: 'mining',
        minProficiency: 3,
    }),
});

export function getIronspineSpecies(id) { return SPECIES[String(id ?? '').trim()] ?? null; }
export function getIronspinePopulation(id) { return POPULATIONS[String(id ?? '').trim()] ?? null; }
export function getIronspineGatheringSource(id) { return SOURCES[String(id ?? '').trim()] ?? null; }

export function listIronspineSpecies() { return Object.values(SPECIES); }
export function listIronspinePopulations() { return Object.values(POPULATIONS); }
export function listIronspineGatheringSources() { return Object.values(SOURCES); }
export function listIronspineEcologyFamilies() { return []; }
export function getIronspineEcologyFamily() { return null; }

export function validateIronspineEcology() {
    const issues = [];

    for (const entry of listIronspineSpecies()) {
        if (!validStableId(entry.id)) issues.push(`${entry.id} has invalid species id.`);
        if (!getRegionalEcologyFamily(entry.familyId)) issues.push(`${entry.id} references unknown regional family ${entry.familyId}.`);
        if (!entry.name || !entry.ecosystem || !entry.habitatTags.length) issues.push(`${entry.id} requires name, ecosystem, and habitat tags.`);
        if (!entry.behavior?.aggression || !Array.isArray(entry.behavior.senses) || !entry.behavior.socialMode) issues.push(`${entry.id} has invalid behavior.`);
    }

    for (const entry of listIronspinePopulations()) {
        if (!getIronspineSpecies(entry.speciesId)) issues.push(`${entry.id} references unknown species ${entry.speciesId}.`);
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!positiveInteger(entry.capacity)) issues.push(`${entry.id} requires positive capacity.`);
        if (!ECOLOGY_DENSITIES.includes(entry.density)) issues.push(`${entry.id} has unknown density ${entry.density}.`);
        if (!ECOLOGY_RARITIES.includes(entry.rarity)) issues.push(`${entry.id} has unknown rarity ${entry.rarity}.`);
        validateConditions(entry.appearanceConditions, entry.id, issues);
    }

    for (const entry of listIronspineGatheringSources()) {
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!ECOLOGY_SOURCE_TYPES.includes(entry.type)) issues.push(`${entry.id} has unknown source type ${entry.type}.`);
        if (!RESOURCE_RECOVERY_ACTIONS.includes(entry.action)) issues.push(`${entry.id} has unknown action ${entry.action}.`);
        const item = getIronspineResourceItem(entry.outputItemId);
        if (!item) issues.push(`${entry.id} references unknown Ironspine item ${entry.outputItemId}.`);
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
function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
}
