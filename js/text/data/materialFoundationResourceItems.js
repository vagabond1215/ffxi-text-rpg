import { ITEM_KINDS, normalizeItem } from './itemSchema.js';

export const MATERIAL_FOUNDATION_RESOURCE_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-redstone-tin-ore': resource({ id: 'item-redstone-tin-ore', name: 'Redstone Tin Ore', tags: ['mineral','ore','tin','metal','industrial'], valueGil: 16, sourceId: 'source-north-redstone-tin-lode', placeId: 'north-redstone-reach', action: 'mine' }),
    'item-redstone-calamine-ore': resource({ id: 'item-redstone-calamine-ore', name: 'Redstone Calamine Ore', tags: ['mineral','ore','zinc','brass','industrial'], valueGil: 15, sourceId: 'source-south-redstone-calamine-pocket', placeId: 'south-redstone-reach', action: 'mine' }),
    'item-redstone-lead-ore': resource({ id: 'item-redstone-lead-ore', name: 'Deepvein Lead Ore', tags: ['mineral','ore','lead','metal','industrial'], valueGil: 13, sourceId: 'source-deepvein-lead-seam', placeId: 'deepvein-mine', action: 'mine' }),
    'item-redstone-silver-ore': resource({ id: 'item-redstone-silver-ore', name: 'Deepvein Silver Ore', tags: ['mineral','ore','silver','metal','decorative','conductive'], valueGil: 52, sourceId: 'source-deepvein-silver-stringer', placeId: 'deepvein-mine', action: 'mine' }),
    'item-ironspine-gold-ore': resource({ id: 'item-ironspine-gold-ore', name: 'Ironspine Gold Ore', tags: ['mineral','ore','gold','metal','decorative','conductive','luxury'], valueGil: 78, sourceId: 'source-ironspine-high-meadow-gold-vein', placeId: 'ironspine-high-meadow', action: 'mine' }),
    'item-slatewater-limestone': resource({ id: 'item-slatewater-limestone', name: 'Slatewater Limestone', tags: ['mineral','stone','lime','masonry','industrial'], valueGil: 9, sourceId: 'source-slatewater-limestone-bench', placeId: 'slatewater-foothills', action: 'mine' }),
    'item-slatewater-whetstone-stone': resource({ id: 'item-slatewater-whetstone-stone', name: 'Slatewater Whetstone Stone', tags: ['mineral','stone','abrasive','sharpening','industrial'], valueGil: 12, sourceId: 'source-slatewater-whetstone-ridge', placeId: 'slatewater-foothills', action: 'mine' }),
    'item-redstone-alum-shale': resource({ id: 'item-redstone-alum-shale', name: 'Redstone Alum Shale', tags: ['mineral','alum','mordant','tanning','dye','industrial'], valueGil: 14, sourceId: 'source-south-redstone-alum-shale-cut', placeId: 'south-redstone-reach', action: 'mine' }),
    'item-redstone-glass-sand': resource({ id: 'item-redstone-glass-sand', name: 'Redstone Glass Sand', tags: ['mineral','sand','silica','glass','industrial'], valueGil: 8, sourceId: 'source-south-redstone-glass-sand-wash', placeId: 'south-redstone-reach', action: 'gather' }),

    'item-elderwood-ash-timber': resource({ id: 'item-elderwood-ash-timber', name: 'Elderwood Ash Timber', tags: ['flora','timber','wood','ash','flexible','handle-stock'], valueGil: 14, sourceId: 'source-east-elderwood-ash-stand', placeId: 'east-elderwood', action: 'log' }),
    'item-elderwood-crown-oak-timber': resource({ id: 'item-elderwood-crown-oak-timber', name: 'Crown Oak Timber', tags: ['flora','timber','wood','oak','hardwood','structural','wide-board'], valueGil: 18, sourceId: 'source-west-elderwood-crown-oak-fall', placeId: 'west-elderwood', action: 'log' }),
    'item-elderwood-silvermaple-timber': resource({ id: 'item-elderwood-silvermaple-timber', name: 'Silvermaple Timber', tags: ['flora','timber','wood','maple','pale','fine-grain','decorative'], valueGil: 17, sourceId: 'source-east-elderwood-silvermaple-stand', placeId: 'east-elderwood', action: 'log' }),
    'item-elderwood-silvermaple-sap': resource({ id: 'item-elderwood-silvermaple-sap', name: 'Silvermaple Sap', tags: ['flora','sap','syrup','food','binder'], valueGil: 7, sourceId: 'source-east-elderwood-silvermaple-taps', placeId: 'east-elderwood', action: 'gather', consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Fresh, clean sap may be drunk as gathered, though it is usually boiled down for keeping and concentrated sweetness.' }, sinks: ['consume','processInput','craftIngredient','trade'] }),
    'item-elderwood-yew-stavewood': resource({ id: 'item-elderwood-yew-stavewood', name: 'Elderwood Yew Stavewood', tags: ['flora','timber','wood','yew','elastic','bowwood','fine-craft'], valueGil: 22, sourceId: 'source-west-elderwood-yew-grove', placeId: 'west-elderwood', action: 'log' }),
    'item-elderwood-hazel-rods': resource({ id: 'item-elderwood-hazel-rods', name: 'Hazel Coppice Rods', tags: ['flora','wood','hazel','coppice','flexible','hoop','wattle'], valueGil: 9, sourceId: 'source-east-elderwood-hazel-rod-coppice', placeId: 'east-elderwood', action: 'gather' }),
    'item-slatewater-spruce-timber': resource({ id: 'item-slatewater-spruce-timber', name: 'Slatewater Spruce Timber', tags: ['flora','timber','wood','softwood','spruce','tall','straight','mast-stock'], valueGil: 16, sourceId: 'source-slatewater-spruce-stand', placeId: 'slatewater-foothills', action: 'log' }),
    'item-slatewater-cedar-timber': resource({ id: 'item-slatewater-cedar-timber', name: 'Slatewater Fragrant Cedar', tags: ['flora','timber','wood','cedar','fragrant','rot-resistant','fine-craft'], valueGil: 20, sourceId: 'source-slatewater-fragrant-cedar-grove', placeId: 'slatewater-foothills', action: 'log' }),
    'item-crownfields-applewood': resource({ id: 'item-crownfields-applewood', name: 'Crownfields Applewood', tags: ['flora','wood','fruitwood','apple','fine-grain','carving'], valueGil: 11, sourceId: 'source-crownfields-orchard-pruning-stack', placeId: 'crownfields', action: 'gather' }),
    'item-starfen-giant-cane': resource({ id: 'item-starfen-giant-cane', name: 'Starfen Giant Cane', tags: ['flora','cane','hollow','lightweight','pole','bamboo-analogue','construction'], valueGil: 10, sourceId: 'source-east-starfen-giant-cane-brake', placeId: 'east-starfen', action: 'gather' }),
    'item-crownfields-hemp-stalk': resource({ id: 'item-crownfields-hemp-stalk', name: 'Crownfields Hemp Stalk', tags: ['flora','fiber','hemp','textile','cordage','canvas'], valueGil: 8, sourceId: 'source-crownfields-hemp-strip', placeId: 'crownfields', action: 'gather' }),
    'item-starfen-nettle-bast': resource({ id: 'item-starfen-nettle-bast', name: 'Starfen Nettle Bast', tags: ['flora','fiber','bast','nettle','textile','twine'], valueGil: 7, sourceId: 'source-east-starfen-nettle-bank', placeId: 'east-starfen', action: 'gather' }),
});

export function getMaterialFoundationResourceItem(id) {
    const entry = DEFINITIONS[String(id ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}
export function listMaterialFoundationResourceItems() {
    return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry));
}

function resource({ id, name, tags, valueGil, sourceId, placeId, action, consumption = null, sinks = ['processInput','craftIngredient','trade'] }) {
    return Object.freeze({
        id,
        name,
        kind: ITEM_KINDS.MATERIAL,
        quantity: 1,
        maxStack: 99,
        valueGil,
        tags: Object.freeze([...tags]),
        consumption,
        provenance: Object.freeze([Object.freeze({
            type: tags.includes('mineral') ? 'mineral' : 'flora',
            sourceId,
            placeId,
            action,
            data: Object.freeze({ catalogVersion: MATERIAL_FOUNDATION_RESOURCE_CATALOG_VERSION }),
        })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        metadata: Object.freeze({
            confidence: 'intentionalSimplification',
            source: 'Hearth & Horizon material foundations',
            notes: 'Original raw material chosen for a distinct physical property and downstream craft role in the shared profession economy.',
        }),
    });
}
