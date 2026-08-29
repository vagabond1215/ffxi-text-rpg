import { ITEM_KINDS, normalizeItem } from './itemSchema.js';

export const GLOAMWOOD_RESOURCE_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-gloamwood-raincap': resource({
        id: 'item-gloamwood-raincap', name: 'Gloam Raincap', tags: ['flora','fungus','food','old-growth','gloamwood'], valueGil: 11,
        sourceId: 'source-gloamwood-raincap-ring', placeId: 'gloamwood-verge', action: 'forage', provenanceType: 'flora',
        consumption: { mode: 'processRequired', hazard: 'rawIrritant', preparation: ['cook-or-dry'], notes: 'Raincaps are cooked or properly dried before eating; raw caps can bring stomach sickness.' },
        sinks: ['processInput','craftIngredient','trade'],
    }),
    'item-gloamwood-bitterbark': resource({
        id: 'item-gloamwood-bitterbark', name: 'Gloam Bitterbark', tags: ['flora','bark','tannin','leatherworking','gloamwood'], valueGil: 9,
        sourceId: 'source-gloamwood-bitterbark-stand', placeId: 'gloamwood-verge', action: 'gather', provenanceType: 'flora',
        sinks: ['processInput','craftIngredient','trade'],
    }),
    'item-gloamwood-ironoak-deadfall': resource({
        id: 'item-gloamwood-ironoak-deadfall', name: 'Ironoak Deadfall', tags: ['timber','wood','hardwood','repair','gloamwood'], valueGil: 17,
        sourceId: 'source-gloamwood-ironoak-deadfall', placeId: 'gloamwood-deep', action: 'log', provenanceType: 'flora',
        sinks: ['processInput','craftIngredient','construction','repair','trade'],
    }),
    'item-gloamwood-velvet-moss': resource({
        id: 'item-gloamwood-velvet-moss', name: 'Velvet Moss', tags: ['flora','moss','packing','tinder','gloamwood'], valueGil: 7,
        sourceId: 'source-gloamwood-velvet-moss-bank', placeId: 'gloamwood-deep', action: 'gather', provenanceType: 'flora',
        sinks: ['processInput','craftIngredient','trade'],
    }),
    'item-gloamwood-nightberry': resource({
        id: 'item-gloamwood-nightberry', name: 'Gloam Nightberry', tags: ['flora','berry','food','old-growth','gloamwood'], valueGil: 8,
        sourceId: 'source-gloamwood-nightberry-brake', placeId: 'gloamwood-deep', action: 'forage', provenanceType: 'flora',
        consumption: { mode: 'direct', hazard: 'none', preparation: ['rinse'], notes: 'Ripe nightberries are safe to eat after ordinary cleaning and are often dried for the trail.' },
        sinks: ['consume','processInput','craftIngredient','trade'],
    }),
    'item-gloamwood-candle-resin': resource({
        id: 'item-gloamwood-candle-resin', name: 'Candle Resin', tags: ['flora','resin','sealant','woodworking','gloamwood'], valueGil: 13,
        sourceId: 'source-gloamwood-candle-resin-grove', placeId: 'gloamwood-verge', action: 'forage', provenanceType: 'flora',
        sinks: ['processInput','craftIngredient','repair','trade'],
    }),
    'item-gloamwood-bog-iron-nodule': resource({
        id: 'item-gloamwood-bog-iron-nodule', name: 'Bog-Iron Nodule', tags: ['mineral','ore','iron','wetland','gloamwood'], valueGil: 10,
        sourceId: 'source-gloamwood-bog-iron-seep', placeId: 'gloamwood-deep', action: 'mine', provenanceType: 'mineral',
        sinks: ['processInput','craftIngredient','trade'],
    }),
});

export function getGloamwoodResourceItem(itemId) {
    const entry = DEFINITIONS[String(itemId ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}
export function listGloamwoodResourceItems() { return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry)); }

function resource({ id,name,tags,valueGil,sourceId,placeId,action,provenanceType,consumption=null,sinks }) {
    return Object.freeze({
        id,name,kind:ITEM_KINDS.MATERIAL,quantity:1,maxStack:99,valueGil,tags:Object.freeze([...tags]),consumption,
        provenance:Object.freeze([Object.freeze({ type:provenanceType,sourceId,placeId,action,data:Object.freeze({ catalogVersion:GLOAMWOOD_RESOURCE_ITEM_CATALOG_VERSION }) })]),
        sinks:Object.freeze(sinks.map((type)=>Object.freeze({type,data:Object.freeze({})}))),
        metadata:Object.freeze({ confidence:'intentionalSimplification',source:'Hearth & Horizon Gloamwood',notes:'Canonical old-growth resource with exact authored source and connected downstream use.' }),
    });
}
