export const STARFEN_DELTA_PRODUCTION_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'process-delta-clean-eel': process({ id:'process-delta-clean-eel',name:'Clean Brackish Reed Eel',kind:'processing',durationSeconds:120,proficiencyId:'cooking',proficiencyGain:1,requiredToolTags:['cutting'],requiredStationTags:['kitchen'],inputs:[{itemId:'item-delta-brackish-reed-eel',quantity:1}],outputs:[{itemId:'item-delta-cleaned-eel',quantity:1}] }),
    'process-delta-smoke-eel': process({ id:'process-delta-smoke-eel',name:'Willow-Smoke Brackish Eel',kind:'processing',durationSeconds:330,proficiencyId:'cooking',minProficiency:2,proficiencyGain:3,requiredStationTags:['kitchen'],inputs:[{itemId:'item-delta-cleaned-eel',quantity:1},{itemId:'item-starfen-marsh-willow-timber',quantity:1}],outputs:[{itemId:'item-delta-smoked-eel',quantity:2}] }),
    'cook-delta-boiled-mud-crab': process({ id:'cook-delta-boiled-mud-crab',name:'Boil Saltflat Mud Crab',kind:'cooking',durationSeconds:210,proficiencyId:'cooking',proficiencyGain:2,requiredStationTags:['kitchen'],inputs:[{itemId:'item-delta-saltflat-mud-crab',quantity:1}],outputs:[{itemId:'item-delta-boiled-mud-crab',quantity:1}] }),
    'process-delta-shuck-oysters': process({ id:'process-delta-shuck-oysters',name:'Shuck Tideglass Oysters',kind:'processing',durationSeconds:150,proficiencyId:'cooking',proficiencyGain:1,requiredToolTags:['cutting'],requiredStationTags:['kitchen'],inputs:[{itemId:'item-delta-tide-oyster',quantity:2}],outputs:[{itemId:'item-delta-oyster-meat',quantity:2},{itemId:'item-delta-oyster-shell',quantity:2}] }),
    'cook-delta-roasted-oysters': process({ id:'cook-delta-roasted-oysters',name:'Roast Tide Oysters',kind:'cooking',durationSeconds:180,proficiencyId:'cooking',proficiencyGain:2,requiredStationTags:['kitchen'],inputs:[{itemId:'item-delta-oyster-meat',quantity:2}],outputs:[{itemId:'item-delta-roasted-oysters',quantity:2}] }),
    'process-delta-shell-lime': process({ id:'process-delta-shell-lime',name:'Burn Coastal Shell Lime',kind:'processing',durationSeconds:360,proficiencyId:'crafting',minProficiency:2,proficiencyGain:3,requiredStationTags:['workshop'],inputs:[{itemId:'item-delta-oyster-shell',quantity:2}],outputs:[{itemId:'item-delta-shell-lime',quantity:1}] }),
    'process-delta-dry-kelp': process({ id:'process-delta-dry-kelp',name:'Dry Coast Kelp',kind:'processing',durationSeconds:180,proficiencyId:'cooking',proficiencyGain:1,requiredStationTags:['kitchen'],inputs:[{itemId:'item-delta-coast-kelp',quantity:2}],outputs:[{itemId:'item-delta-dried-kelp',quantity:2}] }),
    'process-delta-refine-sea-salt': process({ id:'process-delta-refine-sea-salt',name:'Refine Tideglass Sea Salt',kind:'processing',durationSeconds:240,proficiencyId:'crafting',proficiencyGain:2,requiredStationTags:['workshop'],inputs:[{itemId:'item-delta-tidepan-salt-crust',quantity:2}],outputs:[{itemId:'item-delta-refined-sea-salt',quantity:1}] }),
    'craft-delta-woven-reed-matting': process({ id:'craft-delta-woven-reed-matting',name:'Weave Saltmarsh Matting',kind:'crafting',durationSeconds:240,proficiencyId:'crafting',proficiencyGain:2,requiredStationTags:['workshop'],inputs:[{itemId:'item-delta-saltmarsh-reed',quantity:2},{itemId:'item-material-hemp-twine',quantity:1}],outputs:[{itemId:'item-delta-woven-reed-matting',quantity:1}] }),
    'cook-delta-pickled-samphire': process({ id:'cook-delta-pickled-samphire',name:'Pickle Marsh Samphire',kind:'cooking',durationSeconds:240,proficiencyId:'cooking',minProficiency:2,proficiencyGain:2,requiredStationTags:['kitchen'],inputs:[{itemId:'item-delta-marsh-samphire',quantity:2},{itemId:'item-delta-refined-sea-salt',quantity:1},{itemId:'item-crownfields-cider-vinegar',quantity:1}],outputs:[{itemId:'item-delta-pickled-samphire',quantity:2}] }),
});
export function getStarfenDeltaProcessDefinition(id){return DEFINITIONS[String(id ?? '').trim()] ?? null;}
export function listStarfenDeltaProcessDefinitions(){return Object.values(DEFINITIONS);}
function process(definition){
    return deepFreeze({
        id:definition.id,name:definition.name,kind:definition.kind,durationSeconds:definition.durationSeconds,
        proficiencyId:definition.proficiencyId,minProficiency:definition.minProficiency ?? 0,proficiencyGain:definition.proficiencyGain,
        requiredToolTags:[...(definition.requiredToolTags ?? [])],requiredStationTags:[...(definition.requiredStationTags ?? [])],
        inputs:definition.inputs.map((entry)=>({...entry})),outputs:definition.outputs.map((entry)=>({...entry})),
    });
}
function deepFreeze(value){if(!value || typeof value!=='object' || Object.isFrozen(value)) return value;for(const child of Object.values(value)) deepFreeze(child);return Object.freeze(value);}
