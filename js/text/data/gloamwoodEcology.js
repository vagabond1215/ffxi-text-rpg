import { ECOLOGY_CONDITION_TYPES, ECOLOGY_DENSITIES, ECOLOGY_RARITIES, ECOLOGY_SOURCE_TYPES } from './ecologyCatalog.js';
import { getGloamwoodResourceItem } from './gloamwoodResourceItems.js';
import { getPlace } from './places.js';
import { getRegionalEcologyFamily } from './regionalEcologyExpansion.js';
import { RESOURCE_RECOVERY_ACTIONS } from './resourceProvenance.js';

export const GLOAMWOOD_ECOLOGY_VERSION = 1;

const FAMILIES = Object.freeze({
    'family-rootback-newt': family('family-rootback-newt', 'Rootback Newt', ['amphibian','insectivore','old-growth','wet-forest']),
    'family-hollow-crow': family('family-hollow-crow', 'Hollow Crow', ['bird','omnivore','forest','scavenger']),
    'family-land-snail': family('family-land-snail', 'Land Snail', ['mollusk','detritivore','forest','damp']),
    'family-greywood-deer': family('family-greywood-deer', 'Greywood Deer', ['beast','herbivore','forest']),
});

const SPECIES = Object.freeze({
    'species-gloamwood-barkboar': species({
        id:'species-gloamwood-barkboar', name:'Gloam Barkboar', familyId:'family-barkboar', ecosystem:'beast',
        habitatTags:['old-growth-verge','root-thicket','wet-hollow'], behavior:behavior('territorial',['sight','sound'],'sounder',[]), encounterTemplateId:null,
    }),
    'species-gloamwood-embercoat-fox': species({
        id:'species-gloamwood-embercoat-fox', name:'Deep Embercoat Fox', familyId:'family-fox', ecosystem:'beast',
        habitatTags:['old-growth','deadfall','fern-hollow'], behavior:behavior('wary',['sight','sound'],'solitary',[]), encounterTemplateId:null,
    }),
    'species-gloamwood-moss-owl': species({
        id:'species-gloamwood-moss-owl', name:'Gloam Moss Owl', familyId:'family-owl', ecosystem:'bird',
        habitatTags:['deep-canopy','old-tree','ravine'], behavior:behavior('territorial',['sight','sound'],'solitary',[]), encounterTemplateId:null,
    }),
    'species-gloamwood-rain-lantern-moth': species({
        id:'species-gloamwood-rain-lantern-moth', name:'Rain Lantern Moth', familyId:'family-lantern-moth', ecosystem:'insect',
        habitatTags:['wet-canopy','moss-glade','rain-hollow'], behavior:behavior('passive',[],'swarm',[]), encounterTemplateId:null,
    }),
    'species-gloamwood-rootback-newt': species({
        id:'species-gloamwood-rootback-newt', name:'Rootback Newt', familyId:'family-rootback-newt', ecosystem:'amphibian',
        habitatTags:['blackwater-pool','root-seep','wet-deadfall'], behavior:behavior('passive',['vibration'],'cluster',[]), encounterTemplateId:null,
    }),
    'species-gloamwood-hollow-crow': species({
        id:'species-gloamwood-hollow-crow', name:'Hollow Crow', familyId:'family-hollow-crow', ecosystem:'bird',
        habitatTags:['old-growth','deadfall-opening','refuge-edge'], behavior:behavior('wary',['sight','sound'],'flock',[]), encounterTemplateId:null,
    }),
    'species-gloamwood-moss-shell-snail': species({
        id:'species-gloamwood-moss-shell-snail', name:'Moss-Shell Land Snail', familyId:'family-land-snail', ecosystem:'mollusk',
        habitatTags:['moss-bank','rotting-log','wet-stone'], behavior:behavior('passive',[],'cluster',[]), encounterTemplateId:null,
    }),
    'species-gloamwood-greywood-deer': species({
        id:'species-gloamwood-greywood-deer', name:'Greywood Deer', familyId:'family-greywood-deer', ecosystem:'beast',
        habitatTags:['deep-forest','fern-glade','old-trail'], behavior:behavior('wary',['sight','sound'],'herd',[]), encounterTemplateId:null,
    }),
});

const POPULATIONS = Object.freeze({
    'population-gloamwood-barkboars': population({ id:'population-gloamwood-barkboars',speciesId:'species-gloamwood-barkboar',placeId:'gloamwood-verge',biomeTags:['old-growth-verge','root-thicket'],capacity:5,density:'moderate',rarity:'common',respawn:regeneration(1,5400) }),
    'population-gloamwood-embercoat-foxes': population({ id:'population-gloamwood-embercoat-foxes',speciesId:'species-gloamwood-embercoat-fox',placeId:'gloamwood-verge',biomeTags:['old-growth','deadfall'],capacity:3,density:'low',rarity:'uncommon',respawn:regeneration(1,7200),appearanceConditions:[{type:'timeWindow',startHour:16,endHour:24}] }),
    'population-gloamwood-rain-lantern-moths': population({ id:'population-gloamwood-rain-lantern-moths',speciesId:'species-gloamwood-rain-lantern-moth',placeId:'gloamwood-verge',biomeTags:['wet-canopy','moss-glade'],capacity:9,density:'high',rarity:'common',respawn:regeneration(2,2700),appearanceConditions:[{type:'timeWindow',startHour:18,endHour:24}] }),
    'population-gloamwood-moss-owls': population({ id:'population-gloamwood-moss-owls',speciesId:'species-gloamwood-moss-owl',placeId:'gloamwood-deep',biomeTags:['deep-canopy','ravine'],capacity:3,density:'low',rarity:'uncommon',respawn:regeneration(1,7200),appearanceConditions:[{type:'timeWindow',startHour:18,endHour:24}] }),
    'population-gloamwood-rootback-newts': population({ id:'population-gloamwood-rootback-newts',speciesId:'species-gloamwood-rootback-newt',placeId:'gloamwood-deep',biomeTags:['blackwater-pool','root-seep'],capacity:7,density:'moderate',rarity:'common',respawn:regeneration(2,3600) }),
    'population-gloamwood-hollow-crows': population({ id:'population-gloamwood-hollow-crows',speciesId:'species-gloamwood-hollow-crow',placeId:'gloamwood-deep',biomeTags:['old-growth','deadfall-opening'],capacity:6,density:'moderate',rarity:'common',respawn:regeneration(1,3600) }),
    'population-gloamwood-moss-shell-snails': population({ id:'population-gloamwood-moss-shell-snails',speciesId:'species-gloamwood-moss-shell-snail',placeId:'gloamwood-deep',biomeTags:['moss-bank','wet-stone'],capacity:10,density:'high',rarity:'common',respawn:regeneration(2,2700) }),
    'population-gloamwood-greywood-deer': population({ id:'population-gloamwood-greywood-deer',speciesId:'species-gloamwood-greywood-deer',placeId:'gloamwood-deep',biomeTags:['deep-forest','fern-glade'],capacity:6,density:'moderate',rarity:'common',respawn:regeneration(1,7200),appearanceConditions:[{type:'timeWindow',startHour:5,endHour:20}] }),
});

const SOURCES = Object.freeze({
    'source-gloamwood-raincap-ring': source({ id:'source-gloamwood-raincap-ring',name:'Raincap Ring',type:'flora',placeId:'gloamwood-verge',biomeTags:['wet-hollow','old-stump'],action:'forage',outputItemId:'item-gloamwood-raincap',capacity:8,regeneration:regeneration(2,2700),requiredToolTags:[],proficiencyId:'foraging' }),
    'source-gloamwood-bitterbark-stand': source({ id:'source-gloamwood-bitterbark-stand',name:'Bitterbark Stand',type:'flora',placeId:'gloamwood-verge',biomeTags:['old-growth-verge','wet-slope'],action:'gather',outputItemId:'item-gloamwood-bitterbark',capacity:8,regeneration:regeneration(2,3600),requiredToolTags:['cutting'],proficiencyId:'gathering',minProficiency:1 }),
    'source-gloamwood-ironoak-deadfall': source({ id:'source-gloamwood-ironoak-deadfall',name:'Ironoak Deadfall',type:'flora',placeId:'gloamwood-deep',biomeTags:['deadfall-field','deep-forest'],action:'log',outputItemId:'item-gloamwood-ironoak-deadfall',capacity:6,regeneration:regeneration(1,7200),requiredToolTags:['cutting'],proficiencyId:'gathering',minProficiency:2 }),
    'source-gloamwood-velvet-moss-bank': source({ id:'source-gloamwood-velvet-moss-bank',name:'Velvet Moss Bank',type:'flora',placeId:'gloamwood-deep',biomeTags:['moss-bank','wet-stone'],action:'gather',outputItemId:'item-gloamwood-velvet-moss',capacity:10,regeneration:regeneration(2,2700),requiredToolTags:[],proficiencyId:'gathering' }),
    'source-gloamwood-nightberry-brake': source({ id:'source-gloamwood-nightberry-brake',name:'Nightberry Brake',type:'flora',placeId:'gloamwood-deep',biomeTags:['fern-glade','old-trail'],action:'forage',outputItemId:'item-gloamwood-nightberry',capacity:8,regeneration:regeneration(2,2700),requiredToolTags:[],proficiencyId:'foraging' }),
    'source-gloamwood-candle-resin-grove': source({ id:'source-gloamwood-candle-resin-grove',name:'Candle-Resin Grove',type:'flora',placeId:'gloamwood-verge',biomeTags:['old-growth-verge','resin-tree'],action:'forage',outputItemId:'item-gloamwood-candle-resin',capacity:7,regeneration:regeneration(1,3600),requiredToolTags:['cutting'],proficiencyId:'foraging',minProficiency:1 }),
    'source-gloamwood-bog-iron-seep': source({ id:'source-gloamwood-bog-iron-seep',name:'Bog-Iron Seep',type:'mineral',placeId:'gloamwood-deep',biomeTags:['blackwater-seep','iron-stained-mud'],action:'mine',outputItemId:'item-gloamwood-bog-iron-nodule',capacity:6,regeneration:regeneration(1,7200),requiredToolTags:['mining'],proficiencyId:'mining',minProficiency:1 }),
});

export function getGloamwoodEcologyFamily(id) { return FAMILIES[String(id ?? '').trim()] ?? null; }
export function getGloamwoodSpecies(id) { return SPECIES[String(id ?? '').trim()] ?? null; }
export function getGloamwoodPopulation(id) { return POPULATIONS[String(id ?? '').trim()] ?? null; }
export function getGloamwoodGatheringSource(id) { return SOURCES[String(id ?? '').trim()] ?? null; }
export function listGloamwoodEcologyFamilies() { return Object.values(FAMILIES); }
export function listGloamwoodSpecies() { return Object.values(SPECIES); }
export function listGloamwoodPopulations() { return Object.values(POPULATIONS); }
export function listGloamwoodGatheringSources() { return Object.values(SOURCES); }

export function validateGloamwoodEcology() {
    const issues = [];
    const allFamily = (id) => getGloamwoodEcologyFamily(id) ?? getRegionalEcologyFamily(id);
    for (const entry of listGloamwoodEcologyFamilies()) {
        if (!validStableId(entry.id)) issues.push(`${entry.id} has invalid family id.`);
        if (!entry.name || !entry.tags.length) issues.push(`${entry.id} requires name and tags.`);
    }
    for (const entry of listGloamwoodSpecies()) {
        if (!validStableId(entry.id)) issues.push(`${entry.id} has invalid species id.`);
        if (!allFamily(entry.familyId)) issues.push(`${entry.id} references unknown family ${entry.familyId}.`);
        if (!entry.name || !entry.ecosystem || !entry.habitatTags.length) issues.push(`${entry.id} requires name, ecosystem, and habitat tags.`);
        if (!entry.behavior?.aggression || !Array.isArray(entry.behavior.senses) || !entry.behavior.socialMode) issues.push(`${entry.id} has invalid behavior.`);
    }
    for (const entry of listGloamwoodPopulations()) {
        if (!getGloamwoodSpecies(entry.speciesId)) issues.push(`${entry.id} references unknown species ${entry.speciesId}.`);
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!positiveInteger(entry.capacity)) issues.push(`${entry.id} requires positive capacity.`);
        if (!ECOLOGY_DENSITIES.includes(entry.density)) issues.push(`${entry.id} has unknown density ${entry.density}.`);
        if (!ECOLOGY_RARITIES.includes(entry.rarity)) issues.push(`${entry.id} has unknown rarity ${entry.rarity}.`);
        validateConditions(entry.appearanceConditions, entry.id, issues);
    }
    for (const entry of listGloamwoodGatheringSources()) {
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!ECOLOGY_SOURCE_TYPES.includes(entry.type)) issues.push(`${entry.id} has unknown source type ${entry.type}.`);
        if (!RESOURCE_RECOVERY_ACTIONS.includes(entry.action)) issues.push(`${entry.id} has unknown action ${entry.action}.`);
        const item = getGloamwoodResourceItem(entry.outputItemId);
        if (!item) issues.push(`${entry.id} references unknown Gloamwood item ${entry.outputItemId}.`);
        else if (!item.provenance.some((p) => p.sourceId === entry.id && p.placeId === entry.placeId && p.action === entry.action)) issues.push(`${entry.id} output ${entry.outputItemId} lacks exact provenance backlink.`);
        if (!positiveInteger(entry.capacity)) issues.push(`${entry.id} requires positive capacity.`);
        if (!Array.isArray(entry.requiredToolTags)) issues.push(`${entry.id}.requiredToolTags must be an array.`);
        if (!validStableId(entry.proficiencyId)) issues.push(`${entry.id} requires a stable proficiencyId.`);
        validateConditions(entry.appearanceConditions, entry.id, issues);
    }
    return issues;
}

function family(id,name,tags){return deepFreeze({id,name,tags:[...tags]});}
function species({id,name,familyId,ecosystem,habitatTags,behavior:behaviorDefinition,encounterTemplateId}){return deepFreeze({id,name,familyId,ecosystem,habitatTags:[...habitatTags],behavior:behaviorDefinition,encounterTemplateId});}
function behavior(aggression,senses,socialMode,linksWithFamilyIds){return deepFreeze({aggression,senses:[...senses],socialMode,linksWithFamilyIds:[...linksWithFamilyIds]});}
function population({id,speciesId,placeId,biomeTags,capacity,density,rarity,respawn,appearanceConditions=[]}){return deepFreeze({id,speciesId,placeId,biomeTags:[...biomeTags],capacity,density,rarity,respawn,appearanceConditions:[...appearanceConditions],namedVariantHooks:[]});}
function source({id,name,type,placeId,biomeTags,action,outputItemId,capacity,regeneration:regenerationDefinition,requiredToolTags,proficiencyId,minProficiency=0,appearanceConditions=[]}){return deepFreeze({id,name,type,placeId,biomeTags:[...biomeTags],action,outputItemId,capacity,regeneration:regenerationDefinition,requiredToolTags:[...requiredToolTags],proficiencyId,minProficiency,appearanceConditions:[...appearanceConditions]});}
function regeneration(amount,everySeconds){return deepFreeze({amount,everySeconds});}
function validateConditions(conditions=[],id,issues){for(const condition of conditions??[]){if(!ECOLOGY_CONDITION_TYPES.includes(condition?.type)) issues.push(`${id} has unknown condition type ${condition?.type}.`);if(condition?.type==='timeWindow'&&(!Number.isFinite(condition.startHour)||!Number.isFinite(condition.endHour))) issues.push(`${id} has invalid timeWindow condition.`);}}
function validStableId(value){return typeof value==='string'&&/^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(value);}
function positiveInteger(value){return Number.isInteger(value)&&value>0;}
function deepFreeze(value){if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;for(const child of Object.values(value)) deepFreeze(child);return Object.freeze(value);}
