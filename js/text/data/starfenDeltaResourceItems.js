import { ITEM_KINDS, normalizeItem } from './itemSchema.js';

export const STARFEN_DELTA_RESOURCE_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-delta-brackish-reed-eel': resource({
        id: 'item-delta-brackish-reed-eel', name: 'Brackish Reed Eel', tags: ['fish','food','brackish','protein','delta'], valueGil: 15,
        sourceId: 'source-delta-brackish-eel-channel', placeId: 'starfen-lower-delta', action: 'fish', provenanceType: 'fishing',
        consumption: { mode: 'processRequired', hazard: 'pathogenRisk', preparation: ['clean','cook-or-smoke'], notes: 'Fresh brackish eel is cleaned and cooked or properly smoked; raw eel can bring sickness.' },
        sinks: ['processInput','craftIngredient','trade'],
    }),
    'item-delta-saltflat-mud-crab': resource({
        id: 'item-delta-saltflat-mud-crab', name: 'Saltflat Mud Crab', tags: ['crustacean','food','brackish','protein','delta'], valueGil: 14,
        sourceId: 'source-delta-mud-crab-flat', placeId: 'starfen-brackish-coast', action: 'trap', provenanceType: 'fishing',
        consumption: { mode: 'processRequired', hazard: 'pathogenRisk', preparation: ['clean','boil-or-cook'], notes: 'Mud crab is cooked before eating; raw shellfish can bring sickness.' },
        sinks: ['processInput','craftIngredient','trade'],
    }),
    'item-delta-tide-oyster': resource({
        id: 'item-delta-tide-oyster', name: 'Tideglass Oyster', tags: ['shellfish','food','brackish','oyster','delta'], valueGil: 13,
        sourceId: 'source-delta-tide-oyster-bed', placeId: 'starfen-brackish-coast', action: 'fish', provenanceType: 'fishing',
        consumption: { mode: 'processRequired', hazard: 'pathogenRisk', preparation: ['shuck','cook'], notes: 'Tide oysters are opened and cooked before eating; raw shellfish can bring sickness.' },
        sinks: ['processInput','craftIngredient','trade'],
    }),
    'item-delta-coast-kelp': resource({
        id: 'item-delta-coast-kelp', name: 'Coast Kelp', tags: ['flora','seaweed','food','coastal','delta'], valueGil: 7,
        sourceId: 'source-delta-coast-kelp-wrack', placeId: 'starfen-brackish-coast', action: 'gather', provenanceType: 'flora',
        consumption: { mode: 'direct', hazard: 'none', preparation: ['rinse'], notes: 'Clean young kelp fronds may be eaten after rinsing, though they are commonly dried for travel and cooking.' },
        sinks: ['consume','processInput','craftIngredient','trade'],
    }),
    'item-delta-marsh-samphire': resource({
        id: 'item-delta-marsh-samphire', name: 'Marsh Samphire', tags: ['flora','food','greens','saltmarsh','delta'], valueGil: 8,
        sourceId: 'source-delta-marsh-samphire-bed', placeId: 'starfen-lower-delta', action: 'forage', provenanceType: 'flora',
        consumption: { mode: 'direct', hazard: 'none', preparation: ['rinse'], notes: 'Young samphire tips may be eaten after rinsing and are often pickled for keeping.' },
        sinks: ['consume','processInput','craftIngredient','trade'],
    }),
    'item-delta-saltmarsh-reed': resource({
        id: 'item-delta-saltmarsh-reed', name: 'Saltmarsh Reed', tags: ['flora','reed','fiber','basketry','delta'], valueGil: 8,
        sourceId: 'source-delta-saltmarsh-reed-bed', placeId: 'starfen-lower-delta', action: 'gather', provenanceType: 'flora',
        sinks: ['processInput','craftIngredient','construction','trade'],
    }),
    'item-delta-tidepan-salt-crust': resource({
        id: 'item-delta-tidepan-salt-crust', name: 'Tidepan Salt Crust', tags: ['mineral','salt','brine','preservation','delta'], valueGil: 10,
        sourceId: 'source-delta-tidepan-salt-crust', placeId: 'starfen-brackish-coast', action: 'mine', provenanceType: 'mineral',
        sinks: ['processInput','craftIngredient','trade'],
    }),
});
export function getStarfenDeltaResourceItem(itemId) {
    const entry=DEFINITIONS[String(itemId ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}
export function listStarfenDeltaResourceItems() { return Object.values(DEFINITIONS).map((entry)=>normalizeItem(entry)); }
function resource({ id,name,tags,valueGil,sourceId,placeId,action,provenanceType,consumption=null,sinks }) {
    return Object.freeze({
        id,name,kind:ITEM_KINDS.MATERIAL,quantity:1,maxStack:99,valueGil,tags:Object.freeze([...tags]),consumption,
        provenance:Object.freeze([Object.freeze({ type:provenanceType,sourceId,placeId,action,data:Object.freeze({ catalogVersion:STARFEN_DELTA_RESOURCE_ITEM_CATALOG_VERSION }) })]),
        sinks:Object.freeze(sinks.map((type)=>Object.freeze({type,data:Object.freeze({})}))),
        metadata:Object.freeze({ confidence:'intentionalSimplification',source:'Hearth & Horizon Starfen Delta',notes:'Canonical delta/coastal resource with exact authored source and connected downstream use.' }),
    });
}
