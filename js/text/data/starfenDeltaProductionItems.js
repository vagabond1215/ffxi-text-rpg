import { ITEM_KINDS, normalizeItem, validateItemConsumption } from './itemSchema.js';

export const STARFEN_DELTA_PRODUCTION_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-delta-cleaned-eel': item({ id:'item-delta-cleaned-eel',name:'Cleaned Brackish Eel',kind:ITEM_KINDS.MATERIAL,tags:['fish','food','cleaned','brackish','delta'],valueGil:21,sourceId:'process-delta-clean-eel',action:'process',consumption:{mode:'processRequired',hazard:'pathogenRisk',preparation:['cook-or-smoke'],notes:'The eel has been cleaned but is still raw; cook or properly smoke it before eating.'},sinks:['processInput','craftIngredient','trade'] }),
    'item-delta-smoked-eel': item({ id:'item-delta-smoked-eel',name:'Willow-Smoked Brackish Eel',kind:ITEM_KINDS.CONSUMABLE,tags:['food','preserved','smoked','fish','travel','delta'],valueGil:38,sourceId:'process-delta-smoke-eel',action:'process',consumption:{mode:'direct',hazard:'none',preparation:[],notes:'Cleaned eel is thoroughly smoked over marsh willow and is ready to eat or carry.'},sinks:['consume','trade'] }),
    'item-delta-boiled-mud-crab': item({ id:'item-delta-boiled-mud-crab',name:'Boiled Saltflat Mud Crab',kind:ITEM_KINDS.CONSUMABLE,tags:['food','cooked','shellfish','crab','delta'],valueGil:32,sourceId:'cook-delta-boiled-mud-crab',action:'craft',consumption:{mode:'direct',hazard:'none',preparation:[],notes:'The crab is thoroughly boiled and ready to eat.'},sinks:['consume','trade'] }),
    'item-delta-oyster-meat': item({ id:'item-delta-oyster-meat',name:'Shucked Tide Oyster Meat',kind:ITEM_KINDS.MATERIAL,tags:['food','shellfish','oyster','raw','delta'],valueGil:19,sourceId:'process-delta-shuck-oysters',action:'process',consumption:{mode:'processRequired',hazard:'pathogenRisk',preparation:['cook'],notes:'The oyster has been shucked but remains raw; cook it before eating.'},sinks:['processInput','craftIngredient','trade'] }),
    'item-delta-oyster-shell': item({ id:'item-delta-oyster-shell',name:'Tide Oyster Shell',kind:ITEM_KINDS.MATERIAL,tags:['shell','mineral','lime','component','delta'],valueGil:8,sourceId:'process-delta-shuck-oysters',action:'process',sinks:['processInput','craftIngredient','construction','trade'] }),
    'item-delta-roasted-oysters': item({ id:'item-delta-roasted-oysters',name:'Roasted Tide Oysters',kind:ITEM_KINDS.CONSUMABLE,tags:['food','cooked','shellfish','oyster','delta'],valueGil:36,sourceId:'cook-delta-roasted-oysters',action:'craft',consumption:{mode:'direct',hazard:'none',preparation:[],notes:'The oysters are thoroughly roasted and ready to eat.'},sinks:['consume','trade'] }),
    'item-delta-shell-lime': item({ id:'item-delta-shell-lime',name:'Coastal Shell Lime',kind:ITEM_KINDS.MATERIAL,tags:['lime','shell','masonry','whitewash','component','delta'],valueGil:27,sourceId:'process-delta-shell-lime',action:'process',sinks:['craftIngredient','construction','repair','trade'] }),
    'item-delta-dried-kelp': item({ id:'item-delta-dried-kelp',name:'Dried Coast Kelp',kind:ITEM_KINDS.CONSUMABLE,tags:['food','dried','seaweed','travel','delta'],valueGil:18,sourceId:'process-delta-dry-kelp',action:'process',consumption:{mode:'direct',hazard:'none',preparation:[],notes:'Rinsed kelp has been dried for keeping and may be eaten or used in cooking.'},sinks:['consume','craftIngredient','trade'] }),
    'item-delta-refined-sea-salt': item({ id:'item-delta-refined-sea-salt',name:'Tideglass Sea Salt',kind:ITEM_KINDS.MATERIAL,tags:['salt','preservation','seasoning','ingredient','delta'],valueGil:24,sourceId:'process-delta-refine-sea-salt',action:'process',sinks:['processInput','craftIngredient','trade'] }),
    'item-delta-woven-reed-matting': item({ id:'item-delta-woven-reed-matting',name:'Woven Saltmarsh Matting',kind:ITEM_KINDS.MATERIAL,tags:['reed','woven','matting','basketry','packing','delta'],valueGil:34,sourceId:'craft-delta-woven-reed-matting',action:'craft',sinks:['craftIngredient','construction','repair','trade'] }),
    'item-delta-pickled-samphire': item({ id:'item-delta-pickled-samphire',name:'Pickled Marsh Samphire',kind:ITEM_KINDS.CONSUMABLE,tags:['food','pickled','greens','preserved','delta'],valueGil:29,sourceId:'cook-delta-pickled-samphire',action:'craft',consumption:{mode:'direct',hazard:'none',preparation:[],notes:'The samphire has been rinsed and properly pickled for keeping and is ready to eat.'},sinks:['consume','trade'] }),
});
export function getStarfenDeltaProductionItem(id){const entry=DEFINITIONS[String(id ?? '').trim()] ?? null;return entry?normalizeItem(entry):null;}
export function listStarfenDeltaProductionItems(){return Object.values(DEFINITIONS).map((entry)=>normalizeItem(entry));}
export function validateStarfenDeltaProductionItems(){
    const issues=[]; const ids=new Set();
    for(const entry of listStarfenDeltaProductionItems()){
        if(ids.has(entry.id)) issues.push(`Duplicate delta production item ${entry.id}.`);
        ids.add(entry.id);
        for(const issue of validateItemConsumption(entry)) issues.push(`${entry.id} ${issue}`);
    }
    return issues;
}
function item({id,name,kind,tags,valueGil,sourceId,action,consumption=null,sinks}){
    return Object.freeze({
        id,name,kind,quantity:1,maxStack:99,valueGil,tags:Object.freeze([...tags]),consumption,
        provenance:Object.freeze([Object.freeze({type:'crafting',sourceId,placeId:null,action,data:Object.freeze({catalogVersion:STARFEN_DELTA_PRODUCTION_ITEM_CATALOG_VERSION})})]),
        sinks:Object.freeze(sinks.map((type)=>Object.freeze({type,data:Object.freeze({})}))),
        equipmentSlot:null,allowedSlots:Object.freeze([]),requirements:Object.freeze({minLevel:1,allowedJobs:[],allowedRaces:[]}),
        flags:Object.freeze([]),modifiers:Object.freeze({}),
        metadata:Object.freeze({confidence:'intentionalSimplification',source:'Hearth & Horizon Starfen Delta production',notes:'Original coastal production output connected to delta food, preservation, packing, repair, construction, and trade loops.'}),
    });
}
