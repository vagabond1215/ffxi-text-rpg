import { ITEM_KINDS, normalizeItem, validateItemConsumption } from './itemSchema.js';

export const DRY_UPLAND_SALTPAN_REPAIR_PRODUCTION_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-redstone-bunchgrass-thatch-mat': item({
        id: 'item-redstone-bunchgrass-thatch-mat', name: 'Sunbent Bunchgrass Thatch Mat', kind: ITEM_KINDS.MATERIAL,
        tags: ['grass','thatch','matting','construction','repair','redstone'], valueGil: 18,
        sourceId: 'craft-redstone-bunchgrass-thatch-mat', action: 'craft',
        sinks: ['construction','repair','trade'],
    }),
    'item-redstone-stone-thyme-infusion': item({
        id: 'item-redstone-stone-thyme-infusion', name: 'Stone-Thyme Infusion', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food','drink','herb','aromatic','travel','redstone'], valueGil: 16,
        sourceId: 'cook-redstone-stone-thyme-infusion', action: 'craft',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Clean stone thyme is steeped in boiled water and served ready to drink.' },
        sinks: ['consume','trade'],
    }),
    'item-redstone-drythorn-resin-sealant': item({
        id: 'item-redstone-drythorn-resin-sealant', name: 'Drythorn Resin Sealant', kind: ITEM_KINDS.MATERIAL,
        tags: ['resin','sealant','adhesive','repair','component','redstone'], valueGil: 24,
        sourceId: 'process-redstone-drythorn-resin-sealant', action: 'process',
        sinks: ['craftIngredient','construction','repair','trade'],
    }),
    'item-redstone-juniper-millet-pot': item({
        id: 'item-redstone-juniper-millet-pot', name: 'Juniper-Millet Pot', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food','meal','grain','herb','cooked','redstone'], valueGil: 27,
        sourceId: 'cook-redstone-juniper-millet-pot', action: 'craft',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Ridge millet is fully cooked with crushed wind-juniper berries and is ready to eat.' },
        sinks: ['consume','trade'],
    }),
    'item-redstone-ridge-yarrow-field-wash': item({
        id: 'item-redstone-ridge-yarrow-field-wash', name: 'Ridge Yarrow Field Wash', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['remedy','wash','medicine','alchemical','redstone'], valueGil: 23,
        sourceId: 'process-redstone-ridge-yarrow-field-wash', action: 'process',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'An external herb wash for field cleaning and cloth use; it is not a drink.' },
        sinks: ['consume','trade'],
    }),
    'item-emberwash-saltbrush-pot-greens': item({
        id: 'item-emberwash-saltbrush-pot-greens', name: 'Saltbrush Pot Greens', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food','greens','cooked','halophyte','emberwash'], valueGil: 20,
        sourceId: 'cook-emberwash-saltbrush-pot-greens', action: 'craft',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Saltbrush shoots are rinsed, blanched, and cooked until tender; the prepared greens are ready to eat.' },
        sinks: ['consume','trade'],
    }),
    'item-emberwash-saltgrass-shade-mat': item({
        id: 'item-emberwash-saltgrass-shade-mat', name: 'Saltgrass Shade Mat', kind: ITEM_KINDS.MATERIAL,
        tags: ['fiber','matting','shade','shelter','repair','emberwash'], valueGil: 22,
        sourceId: 'craft-emberwash-saltgrass-shade-mat', action: 'craft',
        sinks: ['construction','repair','trade'],
    }),
    'item-emberwash-panbloom-dye-bath': item({
        id: 'item-emberwash-panbloom-dye-bath', name: 'Panbloom Dye Bath', kind: ITEM_KINDS.MATERIAL,
        tags: ['dye','pigment','flower','decorative','emberwash'], valueGil: 24,
        sourceId: 'process-emberwash-panbloom-dye-bath', action: 'process',
        sinks: ['craftIngredient','processInput','decorative','trade'],
    }),
});

export function getDryUplandSaltpanRepairProductionItem(id) {
    const entry = DEFINITIONS[String(id ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}
export function listDryUplandSaltpanRepairProductionItems() {
    return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry));
}
export function validateDryUplandSaltpanRepairProductionItems() {
    const issues = [];
    for (const entry of listDryUplandSaltpanRepairProductionItems()) {
        for (const issue of validateItemConsumption(entry)) issues.push(`${entry.id} ${issue}`);
    }
    return issues;
}

function item({ id, name, kind, tags, valueGil, sourceId, action, consumption = null, sinks }) {
    return Object.freeze({
        id, name, kind, quantity: 1, maxStack: 99, valueGil,
        tags: Object.freeze([...tags]), consumption,
        provenance: Object.freeze([Object.freeze({
            type: 'crafting', sourceId, placeId: null, action,
            data: Object.freeze({ catalogVersion: DRY_UPLAND_SALTPAN_REPAIR_PRODUCTION_ITEM_CATALOG_VERSION }),
        })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        equipmentSlot: null, allowedSlots: Object.freeze([]),
        requirements: Object.freeze({ minLevel: 1, allowedJobs: [], allowedRaces: [] }),
        flags: Object.freeze([]), modifiers: Object.freeze({}),
        metadata: Object.freeze({
            confidence: 'intentionalSimplification',
            source: 'Hearth & Horizon Dry Upland & Saltpan ecology repair production',
            notes: 'Connected output for dry-upland food, medicine, shelter, resin repair, saltpan food, fiber, decorative dye, and trade loops.',
        }),
    });
}
