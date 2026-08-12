import { getPlace } from './places.js';
import { RESOURCE_RECOVERY_ACTIONS } from './resourceProvenance.js';
import { getResourceItem } from './resourceItems.js';

export const ECOLOGY_CATALOG_VERSION = 1;

export const ECOLOGY_DENSITIES = Object.freeze(['sparse', 'low', 'moderate', 'high']);
export const ECOLOGY_RARITIES = Object.freeze(['common', 'uncommon', 'rare', 'named']);
export const ECOLOGY_SOURCE_TYPES = Object.freeze(['flora', 'mineral', 'fishing']);
export const ECOLOGY_CONDITION_TYPES = Object.freeze(['timeWindow', 'dayModulo', 'requiresFlag']);

const FAMILY_DEFINITIONS = Object.freeze({
    'family-construct': family('family-construct', 'Construct', ['artificial', 'salvage']),
    'family-hare': family('family-hare', 'Hare', ['beast', 'herbivore']),
    'family-goblin': family('family-goblin', 'Goblin Kin', ['humanoid', 'raider']),
    'family-redfang': family('family-redfang', 'Redfang Kin', ['humanoid', 'raider']),
    'family-burrower': family('family-burrower', 'Stone Burrower', ['vermiform', 'subterranean']),
    'family-bat': family('family-bat', 'Cave Bat', ['beast', 'nocturnal']),
    'family-rootling': family('family-rootling', 'Rootling', ['plantoid', 'wetland']),
    'family-reedmask': family('family-reedmask', 'Reedmask Kin', ['humanoid', 'wetland', 'raider']),
    'family-hart': family('family-hart', 'Hart', ['beast', 'herbivore', 'forest']),
});

const SPECIES_DEFINITIONS = Object.freeze({
    'species-brush-hare': species({
        id: 'species-brush-hare',
        name: 'Brush Hare',
        familyId: 'family-hare',
        ecosystem: 'beast',
        habitatTags: ['temperate-woodland', 'forest-edge'],
        behavior: behavior('passive', [], 'solitary', []),
        encounterTemplateId: 'enemy-brush-hare',
    }),
    'species-mossback-goblin': species({
        id: 'species-mossback-goblin',
        name: 'Mossback Goblin',
        familyId: 'family-goblin',
        ecosystem: 'raider',
        habitatTags: ['temperate-woodland', 'roadside'],
        behavior: behavior('hostile', ['sight'], 'band', ['family-goblin']),
        encounterTemplateId: 'enemy-mossback-goblin',
    }),
    'species-redfang-raider': species({
        id: 'species-redfang-raider',
        name: 'Redfang Raider',
        familyId: 'family-redfang',
        ecosystem: 'raider',
        habitatTags: ['fortified-camp', 'forest'],
        behavior: behavior('hostile', ['sight', 'sound'], 'warband', ['family-redfang']),
        encounterTemplateId: 'enemy-redfang-raider',
    }),
    'species-redstone-burrower': species({
        id: 'species-redstone-burrower',
        name: 'Redstone Burrower',
        familyId: 'family-burrower',
        ecosystem: 'vermiform',
        habitatTags: ['dry-upland', 'rocky-soil'],
        behavior: behavior('passive', ['vibration'], 'solitary', []),
        encounterTemplateId: 'enemy-redstone-burrower',
    }),
    'species-ashcap-scavenger': species({
        id: 'species-ashcap-scavenger',
        name: 'Ashcap Scavenger',
        familyId: 'family-goblin',
        ecosystem: 'raider',
        habitatTags: ['dry-upland', 'mine-road'],
        behavior: behavior('hostile', ['sight'], 'band', ['family-goblin']),
        encounterTemplateId: 'enemy-ashcap-scavenger',
    }),
    'species-sootwing-bat': species({
        id: 'species-sootwing-bat',
        name: 'Sootwing Bat',
        familyId: 'family-bat',
        ecosystem: 'beast',
        habitatTags: ['cave', 'mine'],
        behavior: behavior('territorial', ['sound'], 'colony', ['family-bat']),
        encounterTemplateId: 'enemy-sootwing-bat',
    }),
    'species-starfen-rootling': species({
        id: 'species-starfen-rootling',
        name: 'Starfen Rootling',
        familyId: 'family-rootling',
        ecosystem: 'plantoid',
        habitatTags: ['wetland', 'reedbed'],
        behavior: behavior('passive', [], 'cluster', ['family-rootling']),
        encounterTemplateId: 'enemy-starfen-rootling',
    }),
    'species-reedmask-acolyte': species({
        id: 'species-reedmask-acolyte',
        name: 'Reedmask Acolyte',
        familyId: 'family-reedmask',
        ecosystem: 'raider',
        habitatTags: ['wetland', 'ruin-edge'],
        behavior: behavior('hostile', ['sight'], 'band', ['family-reedmask']),
        encounterTemplateId: 'enemy-reedmask-acolyte',
    }),
    'species-vaultwing-bat': species({
        id: 'species-vaultwing-bat',
        name: 'Vaultwing Bat',
        familyId: 'family-bat',
        ecosystem: 'beast',
        habitatTags: ['ruin', 'subterranean'],
        behavior: behavior('territorial', ['sound'], 'colony', ['family-bat']),
        encounterTemplateId: 'enemy-vaultwing-bat',
    }),
    'species-moon-antler-hart': species({
        id: 'species-moon-antler-hart',
        name: 'Moon-Antler Hart',
        familyId: 'family-hart',
        ecosystem: 'beast',
        habitatTags: ['old-growth', 'forest-glade'],
        behavior: behavior('wary', ['sight', 'sound'], 'solitary', []),
        encounterTemplateId: null,
    }),
});

const POPULATION_DEFINITIONS = Object.freeze({
    'population-west-elderwood-brush-hare': population({
        id: 'population-west-elderwood-brush-hare',
        speciesId: 'species-brush-hare',
        placeId: 'west-elderwood',
        biomeTags: ['temperate-woodland', 'forest-edge'],
        capacity: 8,
        density: 'high',
        rarity: 'common',
        respawn: regeneration(2, 900),
        namedVariantHooks: [{
            id: 'named-hook-pale-ear',
            name: 'Pale Ear',
            conditions: [{ type: 'requiresFlag', flagId: 'elderwood.pale-ear-trail' }],
        }],
    }),
    'population-west-elderwood-mossback-goblin': population({
        id: 'population-west-elderwood-mossback-goblin',
        speciesId: 'species-mossback-goblin',
        placeId: 'west-elderwood',
        biomeTags: ['temperate-woodland', 'roadside'],
        capacity: 3,
        density: 'moderate',
        rarity: 'common',
        respawn: regeneration(1, 1800),
    }),
    'population-redfang-camp-raiders': population({
        id: 'population-redfang-camp-raiders',
        speciesId: 'species-redfang-raider',
        placeId: 'redfang-camp',
        biomeTags: ['fortified-camp'],
        capacity: 10,
        density: 'high',
        rarity: 'common',
        respawn: regeneration(2, 3600),
    }),
    'population-south-redstone-burrowers': population({
        id: 'population-south-redstone-burrowers',
        speciesId: 'species-redstone-burrower',
        placeId: 'south-redstone-reach',
        biomeTags: ['dry-upland', 'rocky-soil'],
        capacity: 7,
        density: 'high',
        rarity: 'common',
        respawn: regeneration(2, 1200),
    }),
    'population-deepvein-sootwings': population({
        id: 'population-deepvein-sootwings',
        speciesId: 'species-sootwing-bat',
        placeId: 'deepvein-mine',
        biomeTags: ['cave', 'mine'],
        capacity: 8,
        density: 'high',
        rarity: 'common',
        respawn: regeneration(2, 1200),
        appearanceConditions: [{ type: 'timeWindow', startHour: 0, endHour: 24 }],
    }),
    'population-west-starfen-rootlings': population({
        id: 'population-west-starfen-rootlings',
        speciesId: 'species-starfen-rootling',
        placeId: 'west-starfen',
        biomeTags: ['wetland', 'reedbed'],
        capacity: 7,
        density: 'high',
        rarity: 'common',
        respawn: regeneration(2, 1200),
    }),
    'population-west-starfen-reedmasks': population({
        id: 'population-west-starfen-reedmasks',
        speciesId: 'species-reedmask-acolyte',
        placeId: 'west-starfen',
        biomeTags: ['wetland', 'ruin-edge'],
        capacity: 3,
        density: 'moderate',
        rarity: 'common',
        respawn: regeneration(1, 1800),
    }),
    'population-west-elderwood-moon-antler-hart': population({
        id: 'population-west-elderwood-moon-antler-hart',
        speciesId: 'species-moon-antler-hart',
        placeId: 'west-elderwood',
        biomeTags: ['old-growth', 'forest-glade'],
        capacity: 1,
        density: 'sparse',
        rarity: 'rare',
        respawn: regeneration(1, 86400),
        appearanceConditions: [
            { type: 'dayModulo', modulo: 5, remainder: 0 },
            { type: 'timeWindow', startHour: 4, endHour: 7 },
        ],
    }),
});

const GATHERING_SOURCE_DEFINITIONS = Object.freeze({
    'source-west-elderwood-sweetroot-patch': gatheringSource({
        id: 'source-west-elderwood-sweetroot-patch',
        name: 'Sweetroot Patch',
        type: 'flora',
        placeId: 'west-elderwood',
        biomeTags: ['forest-edge', 'loam'],
        action: 'forage',
        outputItemId: 'item-elderwood-sweetroot',
        capacity: 6,
        regeneration: regeneration(1, 1800),
        requiredToolTags: [],
        proficiencyId: 'foraging',
    }),
    'source-west-elderwood-hardwood-fall': gatheringSource({
        id: 'source-west-elderwood-hardwood-fall',
        name: 'Windfallen Hardwood Stand',
        type: 'flora',
        placeId: 'west-elderwood',
        biomeTags: ['temperate-woodland'],
        action: 'log',
        outputItemId: 'item-elderwood-hardwood',
        capacity: 4,
        regeneration: regeneration(1, 7200),
        requiredToolTags: ['woodcutting'],
        proficiencyId: 'logging',
    }),
    'source-south-redstone-copper-seam': gatheringSource({
        id: 'source-south-redstone-copper-seam',
        name: 'Shallow Copper Seam',
        type: 'mineral',
        placeId: 'south-redstone-reach',
        biomeTags: ['exposed-ridge', 'ore-bearing-rock'],
        action: 'mine',
        outputItemId: 'item-redstone-copper-ore',
        capacity: 5,
        regeneration: regeneration(1, 10800),
        requiredToolTags: ['mining'],
        proficiencyId: 'mining',
    }),
    'source-south-redstone-clay-bank': gatheringSource({
        id: 'source-south-redstone-clay-bank',
        name: 'Red Clay Bank',
        type: 'mineral',
        placeId: 'south-redstone-reach',
        biomeTags: ['dry-wash', 'clay-bank'],
        action: 'gather',
        outputItemId: 'item-redstone-clay',
        capacity: 7,
        regeneration: regeneration(1, 3600),
        requiredToolTags: ['digging'],
        proficiencyId: 'gathering',
    }),
    'source-west-starfen-reedbed': gatheringSource({
        id: 'source-west-starfen-reedbed',
        name: 'Tall Reedbed',
        type: 'flora',
        placeId: 'west-starfen',
        biomeTags: ['wetland', 'reedbed'],
        action: 'gather',
        outputItemId: 'item-starfen-reed-fiber',
        capacity: 8,
        regeneration: regeneration(2, 3600),
        requiredToolTags: ['cutting'],
        proficiencyId: 'gathering',
    }),
    'source-west-starfen-marrowleaf-bed': gatheringSource({
        id: 'source-west-starfen-marrowleaf-bed',
        name: 'Marrowleaf Bed',
        type: 'flora',
        placeId: 'west-starfen',
        biomeTags: ['wetland', 'herb-bed'],
        action: 'forage',
        outputItemId: 'item-starfen-marrowleaf',
        capacity: 5,
        regeneration: regeneration(1, 2700),
        requiredToolTags: [],
        proficiencyId: 'foraging',
    }),
    'source-west-starfen-silverfin-water': gatheringSource({
        id: 'source-west-starfen-silverfin-water',
        name: 'Silverfin Shallows',
        type: 'fishing',
        placeId: 'west-starfen',
        biomeTags: ['shallow-water', 'wetland'],
        action: 'fish',
        outputItemId: 'item-starfen-silverfin',
        capacity: 10,
        regeneration: regeneration(2, 1800),
        requiredToolTags: ['fishing'],
        proficiencyId: 'fishing',
        appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 21 }],
    }),
});

export function getEcologyFamily(familyId) {
    return FAMILY_DEFINITIONS[String(familyId ?? '').trim()] ?? null;
}

export function listEcologyFamilies() {
    return Object.values(FAMILY_DEFINITIONS);
}

export function getSpecies(speciesId) {
    return SPECIES_DEFINITIONS[String(speciesId ?? '').trim()] ?? null;
}

export function listSpecies() {
    return Object.values(SPECIES_DEFINITIONS);
}

export function getPopulation(populationId) {
    return POPULATION_DEFINITIONS[String(populationId ?? '').trim()] ?? null;
}

export function listPopulations() {
    return Object.values(POPULATION_DEFINITIONS);
}

export function getGatheringSource(sourceId) {
    return GATHERING_SOURCE_DEFINITIONS[String(sourceId ?? '').trim()] ?? null;
}

export function listGatheringSources() {
    return Object.values(GATHERING_SOURCE_DEFINITIONS);
}

export function validateEcologyCatalog() {
    const issues = [];
    const familyIds = new Set(listEcologyFamilies().map((entry) => entry.id));
    const speciesIds = new Set(listSpecies().map((entry) => entry.id));

    for (const speciesEntry of listSpecies()) {
        if (!validStableId(speciesEntry.id)) issues.push(`species ${speciesEntry.id} has invalid id.`);
        if (!familyIds.has(speciesEntry.familyId)) issues.push(`${speciesEntry.id} references unknown family ${speciesEntry.familyId}.`);
        for (const linkedFamilyId of speciesEntry.behavior.linksWithFamilyIds) {
            if (!familyIds.has(linkedFamilyId)) issues.push(`${speciesEntry.id} links to unknown family ${linkedFamilyId}.`);
        }
    }

    for (const populationEntry of listPopulations()) {
        if (!validStableId(populationEntry.id)) issues.push(`population ${populationEntry.id} has invalid id.`);
        if (!speciesIds.has(populationEntry.speciesId)) issues.push(`${populationEntry.id} references unknown species ${populationEntry.speciesId}.`);
        if (!getPlace(populationEntry.placeId)) issues.push(`${populationEntry.id} references unknown place ${populationEntry.placeId}.`);
        if (!positiveInteger(populationEntry.capacity)) issues.push(`${populationEntry.id} capacity must be a positive integer.`);
        if (!ECOLOGY_DENSITIES.includes(populationEntry.density)) issues.push(`${populationEntry.id} density is unknown: ${populationEntry.density}.`);
        if (!ECOLOGY_RARITIES.includes(populationEntry.rarity)) issues.push(`${populationEntry.id} rarity is unknown: ${populationEntry.rarity}.`);
        issues.push(...validateRegeneration(populationEntry.respawn).map((issue) => `${populationEntry.id}.respawn ${issue}`));
        issues.push(...validateConditions(populationEntry.appearanceConditions).map((issue) => `${populationEntry.id}.appearanceConditions ${issue}`));
        for (const hook of populationEntry.namedVariantHooks) {
            if (!validStableId(hook.id)) issues.push(`${populationEntry.id} named hook has invalid id ${hook.id}.`);
            issues.push(...validateConditions(hook.conditions).map((issue) => `${populationEntry.id}.${hook.id} ${issue}`));
        }
    }

    for (const source of listGatheringSources()) {
        if (!validStableId(source.id)) issues.push(`gathering source ${source.id} has invalid id.`);
        if (!ECOLOGY_SOURCE_TYPES.includes(source.type)) issues.push(`${source.id} source type is unknown: ${source.type}.`);
        if (!getPlace(source.placeId)) issues.push(`${source.id} references unknown place ${source.placeId}.`);
        if (!RESOURCE_RECOVERY_ACTIONS.includes(source.action)) issues.push(`${source.id} references unknown action ${source.action}.`);
        const item = getResourceItem(source.outputItemId);
        if (!item) {
            issues.push(`${source.id} references unknown output item ${source.outputItemId}.`);
        } else if (!item.provenance.some((entry) => entry.sourceId === source.id && entry.placeId === source.placeId && entry.action === source.action)) {
            issues.push(`${source.id} output item ${source.outputItemId} lacks matching source provenance.`);
        }
        if (!positiveInteger(source.capacity)) issues.push(`${source.id} capacity must be a positive integer.`);
        issues.push(...validateRegeneration(source.regeneration).map((issue) => `${source.id}.regeneration ${issue}`));
        issues.push(...validateConditions(source.appearanceConditions).map((issue) => `${source.id}.appearanceConditions ${issue}`));
    }

    return issues;
}

function family(id, name, tags) {
    return Object.freeze({ id, version: ECOLOGY_CATALOG_VERSION, name, tags: Object.freeze([...tags]) });
}

function species({ id, name, familyId, ecosystem, habitatTags, behavior: speciesBehavior, encounterTemplateId }) {
    return Object.freeze({
        id,
        version: ECOLOGY_CATALOG_VERSION,
        name,
        familyId,
        ecosystem,
        habitatTags: Object.freeze([...habitatTags]),
        behavior: speciesBehavior,
        encounterTemplateId,
    });
}

function behavior(aggression, senses, socialMode, linksWithFamilyIds) {
    return Object.freeze({
        aggression,
        senses: Object.freeze([...senses]),
        socialMode,
        linksWithFamilyIds: Object.freeze([...linksWithFamilyIds]),
    });
}

function population({ id, speciesId, placeId, biomeTags, capacity, density, rarity, respawn, appearanceConditions = [], namedVariantHooks = [] }) {
    return Object.freeze({
        id,
        version: ECOLOGY_CATALOG_VERSION,
        speciesId,
        placeId,
        biomeTags: Object.freeze([...biomeTags]),
        capacity,
        density,
        rarity,
        respawn,
        appearanceConditions: Object.freeze(appearanceConditions.map((entry) => Object.freeze({ ...entry }))),
        namedVariantHooks: Object.freeze(namedVariantHooks.map((hook) => Object.freeze({
            ...hook,
            conditions: Object.freeze((hook.conditions ?? []).map((entry) => Object.freeze({ ...entry }))),
        }))),
    });
}

function gatheringSource({ id, name, type, placeId, biomeTags, action, outputItemId, capacity, regeneration: regenerationRule, requiredToolTags, proficiencyId, minProficiency = 0, appearanceConditions = [] }) {
    return Object.freeze({
        id,
        version: ECOLOGY_CATALOG_VERSION,
        name,
        type,
        placeId,
        biomeTags: Object.freeze([...biomeTags]),
        action,
        outputItemId,
        capacity,
        regeneration: regenerationRule,
        requiredToolTags: Object.freeze([...requiredToolTags]),
        proficiencyId,
        minProficiency,
        appearanceConditions: Object.freeze(appearanceConditions.map((entry) => Object.freeze({ ...entry }))),
    });
}

function regeneration(units, everySeconds) {
    return Object.freeze({ units, everySeconds });
}

function validateRegeneration(rule) {
    const issues = [];
    if (!rule || typeof rule !== 'object' || Array.isArray(rule)) return ['must be an object.'];
    if (!positiveInteger(rule.units)) issues.push('units must be a positive integer.');
    if (!positiveInteger(rule.everySeconds)) issues.push('everySeconds must be a positive integer.');
    return issues;
}

function validateConditions(conditions) {
    const issues = [];
    if (!Array.isArray(conditions)) return ['must be an array.'];
    for (const [index, condition] of conditions.entries()) {
        if (!condition || typeof condition !== 'object' || Array.isArray(condition)) {
            issues.push(`[${index}] must be an object.`);
            continue;
        }
        if (!ECOLOGY_CONDITION_TYPES.includes(condition.type)) {
            issues.push(`[${index}] type is unknown: ${condition.type}.`);
            continue;
        }
        if (condition.type === 'timeWindow') {
            if (!Number.isInteger(condition.startHour) || condition.startHour < 0 || condition.startHour > 23) issues.push(`[${index}] startHour must be 0-23.`);
            if (!Number.isInteger(condition.endHour) || condition.endHour < 1 || condition.endHour > 24) issues.push(`[${index}] endHour must be 1-24.`);
        }
        if (condition.type === 'dayModulo') {
            if (!positiveInteger(condition.modulo)) issues.push(`[${index}] modulo must be positive.`);
            if (!Number.isInteger(condition.remainder) || condition.remainder < 0 || condition.remainder >= condition.modulo) issues.push(`[${index}] remainder must be within modulo.`);
        }
        if (condition.type === 'requiresFlag' && !validStableId(condition.flagId)) issues.push(`[${index}] flagId is invalid.`);
    }
    return issues;
}

function validStableId(value) {
    return typeof value === 'string' && /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(value);
}

function positiveInteger(value) {
    return Number.isInteger(value) && value > 0;
}
