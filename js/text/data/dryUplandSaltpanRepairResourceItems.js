import { ITEM_KINDS, normalizeItem } from './itemSchema.js';

export const DRY_UPLAND_SALTPAN_REPAIR_RESOURCE_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-redstone-sunbent-bunchgrass': resource({
        id: 'item-redstone-sunbent-bunchgrass', name: 'Sunbent Bunchgrass',
        tags: ['flora','grass','fiber','thatch','dry-upland','redstone'], valueGil: 6,
        sourceId: 'source-south-redstone-sunbent-bunchgrass-bench', placeId: 'south-redstone-reach', action: 'gather', provenanceType: 'flora',
        sinks: ['processInput','craftIngredient','construction','repair','trade'],
    }),
    'item-redstone-stone-thyme': resource({
        id: 'item-redstone-stone-thyme', name: 'Redstone Stone Thyme',
        tags: ['flora','herb','food','aromatic','medicine','dry-upland','redstone'], valueGil: 8,
        sourceId: 'source-south-redstone-stone-thyme-slope', placeId: 'south-redstone-reach', action: 'forage', provenanceType: 'flora',
        consumption: { mode: 'direct', hazard: 'none', preparation: ['rinse'], notes: 'Clean stone-thyme leaves are used in small amounts as a sharp culinary herb and are commonly steeped into a hot infusion.' },
        sinks: ['consume','processInput','craftIngredient','trade'],
    }),
    'item-redstone-drythorn-resin': resource({
        id: 'item-redstone-drythorn-resin', name: 'Drythorn Resin',
        tags: ['flora','resin','shrub','adhesive','alchemical','repair','dry-upland','redstone'], valueGil: 10,
        sourceId: 'source-south-redstone-drythorn-resin-scrub', placeId: 'south-redstone-reach', action: 'gather', provenanceType: 'flora',
        sinks: ['processInput','craftIngredient','construction','repair','trade'],
    }),
    'item-redstone-wind-juniper-berry': resource({
        id: 'item-redstone-wind-juniper-berry', name: 'Wind Juniper Berries',
        tags: ['flora','berry','food','aromatic','shrub','upland','redstone'], valueGil: 9,
        sourceId: 'source-north-redstone-wind-juniper-brake', placeId: 'north-redstone-reach', action: 'forage', provenanceType: 'flora',
        consumption: { mode: 'processRequired', hazard: 'none', preparation: ['crush-and-cook'], notes: 'The sharp berries are a cooking spice rather than handful food; crush them and cook them into grain or meat dishes.' },
        sinks: ['processInput','craftIngredient','trade'],
    }),
    'item-redstone-ridge-yarrow': resource({
        id: 'item-redstone-ridge-yarrow', name: 'Redstone Ridge Yarrow',
        tags: ['flora','herb','flower','medicine','alchemical','upland','redstone'], valueGil: 9,
        sourceId: 'source-north-redstone-ridge-yarrow-patch', placeId: 'north-redstone-reach', action: 'forage', provenanceType: 'flora',
        sinks: ['processInput','craftIngredient','trade'],
    }),
    'item-emberwash-saltbrush-shoot': resource({
        id: 'item-emberwash-saltbrush-shoot', name: 'Saltbrush Shoots',
        tags: ['flora','halophyte','shrub','food','saltpan','emberwash'], valueGil: 8,
        sourceId: 'source-emberwash-saltbrush-shoot-brake', placeId: 'emberwash-saltpan-verge', action: 'gather', provenanceType: 'flora',
        consumption: { mode: 'processRequired', hazard: 'none', preparation: ['rinse-and-blanch'], notes: 'Field-cut saltbrush shoots carry grit and heavy surface salt; rinse them well and blanch or cook them before eating.' },
        sinks: ['processInput','craftIngredient','trade'],
    }),
    'item-emberwash-saltgrass-fiber': resource({
        id: 'item-emberwash-saltgrass-fiber', name: 'Saltgrass Fiber',
        tags: ['flora','halophyte','grass','fiber','matting','shelter','saltpan','emberwash'], valueGil: 7,
        sourceId: 'source-emberwash-saltgrass-flat', placeId: 'emberwash-saltpan-verge', action: 'gather', provenanceType: 'flora',
        sinks: ['processInput','craftIngredient','construction','repair','trade'],
    }),
    'item-emberwash-panbloom-petal': resource({
        id: 'item-emberwash-panbloom-petal', name: 'Panbloom Petals',
        tags: ['flora','halophyte','flower','dye','aromatic','decorative','saltpan','emberwash'], valueGil: 9,
        sourceId: 'source-emberwash-panbloom-verge', placeId: 'emberwash-saltpan-verge', action: 'forage', provenanceType: 'flora',
        sinks: ['processInput','craftIngredient','decorative','trade'],
    }),
});

export function getDryUplandSaltpanRepairResourceItem(id) {
    const entry = DEFINITIONS[String(id ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}
export function listDryUplandSaltpanRepairResourceItems() {
    return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry));
}

function resource({ id, name, tags, valueGil, sourceId, placeId, action, provenanceType, consumption = null, sinks }) {
    return Object.freeze({
        id, name, kind: ITEM_KINDS.MATERIAL, quantity: 1, maxStack: 99, valueGil,
        tags: Object.freeze([...tags]), consumption,
        provenance: Object.freeze([Object.freeze({
            type: provenanceType, sourceId, placeId, action,
            data: Object.freeze({ catalogVersion: DRY_UPLAND_SALTPAN_REPAIR_RESOURCE_ITEM_CATALOG_VERSION }),
        })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        metadata: Object.freeze({
            confidence: 'intentionalSimplification',
            source: 'Hearth & Horizon Dry Upland & Saltpan ecology repair',
            notes: 'Canonical dry-upland or saltpan repair resource with exact place/source/action provenance and connected downstream use.',
        }),
    });
}
