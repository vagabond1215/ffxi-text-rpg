import { getPlace } from './places.js';
import { getCanonicalResourceItem } from './resourceItemRegistry.js';

export const REGIONAL_ECOLOGY_VERSION = 1;

const FAMILIES = Object.freeze({
    'family-barkboar': family('family-barkboar', 'Barkboar', ['beast', 'omnivore', 'forest']),
    'family-lantern-moth': family('family-lantern-moth', 'Lantern Moth', ['insect', 'nocturnal', 'forest']),
    'family-ridge-ibex': family('family-ridge-ibex', 'Ridge Ibex', ['beast', 'herbivore', 'upland']),
    'family-glass-shell': family('family-glass-shell', 'Glass-Shell Crawler', ['arthropod', 'scavenger', 'rocky']),
    'family-mire-heron': family('family-mire-heron', 'Mire Heron', ['bird', 'predator', 'wetland']),
    'family-reed-eel': family('family-reed-eel', 'Reed Eel', ['fish', 'wetland', 'aquatic']),
});

const SPECIES = Object.freeze({
    'species-elderwood-barkboar': species({
        id: 'species-elderwood-barkboar', name: 'Elderwood Barkboar', familyId: 'family-barkboar', ecosystem: 'beast',
        habitatTags: ['temperate-woodland', 'root-thicket'], behavior: behavior('territorial', ['sight', 'sound'], 'sounder', []),
        encounterTemplateId: 'enemy-elderwood-barkboar',
    }),
    'species-elderwood-lantern-moth': species({
        id: 'species-elderwood-lantern-moth', name: 'Lantern Moth', familyId: 'family-lantern-moth', ecosystem: 'insect',
        habitatTags: ['old-growth', 'flowering-glade'], behavior: behavior('passive', [], 'swarm', []), encounterTemplateId: null,
    }),
    'species-redstone-ridge-ibex': species({
        id: 'species-redstone-ridge-ibex', name: 'Redstone Ridge Ibex', familyId: 'family-ridge-ibex', ecosystem: 'beast',
        habitatTags: ['dry-upland', 'exposed-ridge'], behavior: behavior('wary', ['sight', 'sound'], 'herd', []),
        encounterTemplateId: 'enemy-redstone-ridge-ibex',
    }),
    'species-redstone-glass-shell': species({
        id: 'species-redstone-glass-shell', name: 'Glass-Shell Crawler', familyId: 'family-glass-shell', ecosystem: 'arthropod',
        habitatTags: ['scree', 'mine-tailings'], behavior: behavior('territorial', ['vibration'], 'cluster', []), encounterTemplateId: null,
    }),
    'species-starfen-mire-heron': species({
        id: 'species-starfen-mire-heron', name: 'Mirecrest Heron', familyId: 'family-mire-heron', ecosystem: 'bird',
        habitatTags: ['wetland', 'shallow-water'], behavior: behavior('wary', ['sight'], 'solitary', ['family-reed-eel']),
        encounterTemplateId: 'enemy-starfen-mire-heron',
    }),
    'species-starfen-reed-eel': species({
        id: 'species-starfen-reed-eel', name: 'Reed Eel', familyId: 'family-reed-eel', ecosystem: 'fish',
        habitatTags: ['wetland', 'reed-channel'], behavior: behavior('passive', ['vibration'], 'shoal', []), encounterTemplateId: null,
    }),
});

const POPULATIONS = Object.freeze({
    'population-west-elderwood-barkboars': population({
        id: 'population-west-elderwood-barkboars', speciesId: 'species-elderwood-barkboar', placeId: 'west-elderwood',
        biomeTags: ['temperate-woodland', 'root-thicket'], capacity: 5, density: 'moderate', rarity: 'common', respawn: regeneration(1, 2400),
    }),
    'population-west-elderwood-lantern-moths': population({
        id: 'population-west-elderwood-lantern-moths', speciesId: 'species-elderwood-lantern-moth', placeId: 'west-elderwood',
        biomeTags: ['old-growth', 'flowering-glade'], capacity: 6, density: 'moderate', rarity: 'uncommon', respawn: regeneration(1, 1800),
        appearanceConditions: [{ type: 'timeWindow', startHour: 18, endHour: 24 }],
    }),
    'population-south-redstone-ridge-ibex': population({
        id: 'population-south-redstone-ridge-ibex', speciesId: 'species-redstone-ridge-ibex', placeId: 'south-redstone-reach',
        biomeTags: ['dry-upland', 'exposed-ridge'], capacity: 4, density: 'moderate', rarity: 'common', respawn: regeneration(1, 3000),
    }),
    'population-south-redstone-glass-shells': population({
        id: 'population-south-redstone-glass-shells', speciesId: 'species-redstone-glass-shell', placeId: 'south-redstone-reach',
        biomeTags: ['scree', 'mine-tailings'], capacity: 6, density: 'moderate', rarity: 'uncommon', respawn: regeneration(1, 2400),
    }),
    'population-west-starfen-mire-herons': population({
        id: 'population-west-starfen-mire-herons', speciesId: 'species-starfen-mire-heron', placeId: 'west-starfen',
        biomeTags: ['wetland', 'shallow-water'], capacity: 4, density: 'low', rarity: 'common', respawn: regeneration(1, 2700),
        appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 20 }],
    }),
    'population-west-starfen-reed-eels': population({
        id: 'population-west-starfen-reed-eels', speciesId: 'species-starfen-reed-eel', placeId: 'west-starfen',
        biomeTags: ['wetland', 'reed-channel'], capacity: 9, density: 'high', rarity: 'common', respawn: regeneration(2, 1800),
    }),
});

const SOURCES = Object.freeze({
    'source-west-elderwood-amber-resin-grove': source({
        id: 'source-west-elderwood-amber-resin-grove', name: 'Amber Resin Grove', type: 'flora', placeId: 'west-elderwood',
        biomeTags: ['old-growth', 'resinous-bark'], action: 'forage', outputItemId: 'item-elderwood-amber-resin', capacity: 5,
        regeneration: regeneration(1, 3600), requiredToolTags: ['cutting'], proficiencyId: 'foraging',
    }),
    'source-west-elderwood-duskcap-ring': source({
        id: 'source-west-elderwood-duskcap-ring', name: 'Duskcap Ring', type: 'flora', placeId: 'west-elderwood',
        biomeTags: ['shaded-loam', 'old-growth'], action: 'forage', outputItemId: 'item-elderwood-duskcap', capacity: 4,
        regeneration: regeneration(1, 2700), requiredToolTags: [], proficiencyId: 'foraging',
        appearanceConditions: [{ type: 'timeWindow', startHour: 18, endHour: 24 }],
    }),
    'source-south-redstone-iron-vein': source({
        id: 'source-south-redstone-iron-vein', name: 'Red Iron Vein', type: 'mineral', placeId: 'south-redstone-reach',
        biomeTags: ['ore-bearing-rock', 'upland-cut'], action: 'mine', outputItemId: 'item-redstone-iron-ore', capacity: 4,
        regeneration: regeneration(1, 14400), requiredToolTags: ['mining'], proficiencyId: 'mining', minProficiency: 2,
    }),
    'source-south-redstone-sunstone-scree': source({
        id: 'source-south-redstone-sunstone-scree', name: 'Sunstone Scree', type: 'mineral', placeId: 'south-redstone-reach',
        biomeTags: ['sun-baked-scree', 'dry-upland'], action: 'gather', outputItemId: 'item-redstone-sunstone-grit', capacity: 6,
        regeneration: regeneration(1, 5400), requiredToolTags: ['digging'], proficiencyId: 'gathering',
    }),
    'source-west-starfen-bluekelp-pool': source({
        id: 'source-west-starfen-bluekelp-pool', name: 'Bluekelp Pool', type: 'flora', placeId: 'west-starfen',
        biomeTags: ['shallow-water', 'clear-pool'], action: 'gather', outputItemId: 'item-starfen-bluekelp', capacity: 7,
        regeneration: regeneration(2, 2700), requiredToolTags: ['cutting'], proficiencyId: 'gathering',
    }),
    'source-west-starfen-bogberry-brake': source({
        id: 'source-west-starfen-bogberry-brake', name: 'Bogberry Brake', type: 'flora', placeId: 'west-starfen',
        biomeTags: ['wetland-edge', 'peat-hummock'], action: 'forage', outputItemId: 'item-starfen-bogberry', capacity: 6,
        regeneration: regeneration(1, 2400), requiredToolTags: [], proficiencyId: 'foraging',
    }),
});

export function getRegionalEcologyFamily(id) { return FAMILIES[String(id ?? '').trim()] ?? null; }
export function listRegionalEcologyFamilies() { return Object.values(FAMILIES); }
export function getRegionalSpecies(id) { return SPECIES[String(id ?? '').trim()] ?? null; }
export function listRegionalSpecies() { return Object.values(SPECIES); }
export function getRegionalPopulation(id) { return POPULATIONS[String(id ?? '').trim()] ?? null; }
export function listRegionalPopulations() { return Object.values(POPULATIONS); }
export function getRegionalGatheringSource(id) { return SOURCES[String(id ?? '').trim()] ?? null; }
export function listRegionalGatheringSources() { return Object.values(SOURCES); }

export function validateRegionalEcologyExpansion() {
    const issues = [];
    const familyIds = new Set(listRegionalEcologyFamilies().map((entry) => entry.id));
    const speciesIds = new Set(listRegionalSpecies().map((entry) => entry.id));
    for (const entry of listRegionalSpecies()) {
        if (!familyIds.has(entry.familyId)) issues.push(`${entry.id} references unknown regional family ${entry.familyId}.`);
        for (const linked of entry.behavior.linksWithFamilyIds) {
            if (!familyIds.has(linked)) issues.push(`${entry.id} links to unknown regional family ${linked}.`);
        }
    }
    for (const entry of listRegionalPopulations()) {
        if (!speciesIds.has(entry.speciesId)) issues.push(`${entry.id} references unknown regional species ${entry.speciesId}.`);
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!positive(entry.capacity) || !positive(entry.respawn.units) || !positive(entry.respawn.everySeconds)) issues.push(`${entry.id} has invalid capacity/respawn.`);
    }
    for (const entry of listRegionalGatheringSources()) {
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        const item = getCanonicalResourceItem(entry.outputItemId);
        if (!item) issues.push(`${entry.id} references unknown output ${entry.outputItemId}.`);
        else if (!item.provenance.some((p) => p.sourceId === entry.id && p.placeId === entry.placeId && p.action === entry.action)) issues.push(`${entry.id} output provenance does not match source.`);
        if (!positive(entry.capacity) || !positive(entry.regeneration.units) || !positive(entry.regeneration.everySeconds)) issues.push(`${entry.id} has invalid capacity/regeneration.`);
    }
    return issues;
}

function family(id, name, tags) { return Object.freeze({ id, version: REGIONAL_ECOLOGY_VERSION, name, tags: Object.freeze([...tags]) }); }
function species({ id, name, familyId, ecosystem, habitatTags, behavior: b, encounterTemplateId }) {
    return Object.freeze({ id, version: REGIONAL_ECOLOGY_VERSION, name, familyId, ecosystem, habitatTags: Object.freeze([...habitatTags]), behavior: b, encounterTemplateId });
}
function behavior(aggression, senses, socialMode, linksWithFamilyIds) {
    return Object.freeze({ aggression, senses: Object.freeze([...senses]), socialMode, linksWithFamilyIds: Object.freeze([...linksWithFamilyIds]) });
}
function population({ id, speciesId, placeId, biomeTags, capacity, density, rarity, respawn, appearanceConditions = [] }) {
    return Object.freeze({ id, version: REGIONAL_ECOLOGY_VERSION, speciesId, placeId, biomeTags: Object.freeze([...biomeTags]), capacity, density, rarity, respawn, appearanceConditions: freezeConditions(appearanceConditions), namedVariantHooks: Object.freeze([]) });
}
function source({ id, name, type, placeId, biomeTags, action, outputItemId, capacity, regeneration: regen, requiredToolTags, proficiencyId, minProficiency = 0, appearanceConditions = [] }) {
    return Object.freeze({ id, version: REGIONAL_ECOLOGY_VERSION, name, type, placeId, biomeTags: Object.freeze([...biomeTags]), action, outputItemId, capacity, regeneration: regen, requiredToolTags: Object.freeze([...requiredToolTags]), proficiencyId, minProficiency, appearanceConditions: freezeConditions(appearanceConditions) });
}
function regeneration(units, everySeconds) { return Object.freeze({ units, everySeconds }); }
function freezeConditions(conditions) { return Object.freeze(conditions.map((condition) => Object.freeze({ ...condition }))); }
function positive(value) { return Number.isInteger(value) && value > 0; }
