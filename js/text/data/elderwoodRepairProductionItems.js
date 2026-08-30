import { ITEM_KINDS, normalizeItem, validateItemConsumption } from './itemSchema.js';

export const ELDERWOOD_REPAIR_PRODUCTION_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-elderwood-sorrel-crabapple-relish': item({
        id: 'item-elderwood-sorrel-crabapple-relish', name: 'Sorrel-Crabapple Relish', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food','preserve','fruit','herb','elderwood'], valueGil: 19,
        sourceId: 'cook-elderwood-sorrel-crabapple-relish', action: 'craft',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Clean sorrel and crabapple are cooked together into a tart relish that is ready to eat.' },
        sinks: ['consume','trade'],
    }),
    'item-elderwood-wayleaf-field-wash': item({
        id: 'item-elderwood-wayleaf-field-wash', name: 'Wayleaf Field Wash', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['remedy','wash','medicine','alchemical','elderwood'], valueGil: 25,
        sourceId: 'process-elderwood-wayleaf-field-wash', action: 'process',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'An external field wash for cleaning minor scrapes and cloth; it is not a drink.' },
        sinks: ['consume','trade'],
    }),
    'item-elderwood-bluebell-dye-bath': item({
        id: 'item-elderwood-bluebell-dye-bath', name: 'Bluebell Dye Bath', kind: ITEM_KINDS.MATERIAL,
        tags: ['dye','pigment','flower','decorative','elderwood'], valueGil: 22,
        sourceId: 'process-elderwood-bluebell-dye-bath', action: 'process',
        sinks: ['craftIngredient','processInput','decorative','trade'],
    }),
    'item-timbercross-river-mint-tea': item({
        id: 'item-timbercross-river-mint-tea', name: 'River-Mint Tea', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food','drink','herb','travel','elderwood'], valueGil: 15,
        sourceId: 'cook-timbercross-river-mint-tea', action: 'craft',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Fresh river mint is steeped in boiled water and served ready to drink.' },
        sinks: ['consume','trade'],
    }),
    'item-timbercross-willowherb-poultice': item({
        id: 'item-timbercross-willowherb-poultice', name: 'Willowherb Poultice', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['remedy','poultice','medicine','fieldcraft','elderwood'], valueGil: 27,
        sourceId: 'craft-timbercross-willowherb-poultice', action: 'craft',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'A prepared external poultice for field use; it is not food.' },
        sinks: ['consume','trade'],
    }),
    'item-timbercross-sedge-mat': item({
        id: 'item-timbercross-sedge-mat', name: 'Landing Sedge Mat', kind: ITEM_KINDS.MATERIAL,
        tags: ['fiber','matting','packing','bankwork','elderwood'], valueGil: 24,
        sourceId: 'craft-timbercross-sedge-mat', action: 'craft',
        sinks: ['construction','repair','trade'],
    }),
    'item-timbercross-river-currant-compote': item({
        id: 'item-timbercross-river-currant-compote', name: 'River Currant Compote', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food','fruit','preserve','elderwood'], valueGil: 18,
        sourceId: 'cook-timbercross-river-currant-compote', action: 'craft',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Sorted currants are cooked down into a ready-to-eat preserve.' },
        sinks: ['consume','trade'],
    }),
    'item-timbercross-cleaned-bronze-dace': item({
        id: 'item-timbercross-cleaned-bronze-dace', name: 'Cleaned Timbercross Bronze Dace', kind: ITEM_KINDS.MATERIAL,
        tags: ['fish','food','cleaned','freshwater','river','elderwood'], valueGil: 18,
        sourceId: 'process-timbercross-clean-bronze-dace', action: 'process',
        consumption: { mode: 'processRequired', hazard: 'pathogenRisk', preparation: ['cook-or-smoke'], notes: 'The fish has been gutted and cleaned but remains raw; cook or properly smoke it before eating.' },
        sinks: ['processInput','craftIngredient','trade'],
    }),
    'item-timbercross-minted-dace-pot': item({
        id: 'item-timbercross-minted-dace-pot', name: 'Minted Bronze Dace Pot', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food','meal','cooked','fish','herb','elderwood'], valueGil: 32,
        sourceId: 'cook-timbercross-minted-dace-pot', action: 'craft',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Cleaned dace is thoroughly cooked with river mint and is ready to eat.' },
        sinks: ['consume','trade'],
    }),
    'item-thornwall-clean-cistern-moss-packing': item({
        id: 'item-thornwall-clean-cistern-moss-packing', name: 'Clean Cistern Moss Packing', kind: ITEM_KINDS.MATERIAL,
        tags: ['moss','absorbent','packing','repair','alchemical','elderwood'], valueGil: 17,
        sourceId: 'process-thornwall-cistern-moss-packing', action: 'process',
        sinks: ['craftIngredient','repair','trade'],
    }),
    'item-thornwall-dried-gaol-fungus-tinder': item({
        id: 'item-thornwall-dried-gaol-fungus-tinder', name: 'Dried Gaol Fungus Tinder', kind: ITEM_KINDS.MATERIAL,
        tags: ['fungus','tinder','dye','utility','elderwood'], valueGil: 16,
        sourceId: 'process-thornwall-gaol-fungus-tinder', action: 'process',
        sinks: ['craftIngredient','processInput','trade'],
    }),
});

export function getElderwoodRepairProductionItem(id) {
    const entry = DEFINITIONS[String(id ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}
export function listElderwoodRepairProductionItems() {
    return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry));
}
export function validateElderwoodRepairProductionItems() {
    const issues = [];
    for (const entry of listElderwoodRepairProductionItems()) {
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
            data: Object.freeze({ catalogVersion: ELDERWOOD_REPAIR_PRODUCTION_ITEM_CATALOG_VERSION }),
        })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        equipmentSlot: null, allowedSlots: Object.freeze([]),
        requirements: Object.freeze({ minLevel: 1, allowedJobs: [], allowedRaces: [] }),
        flags: Object.freeze([]), modifiers: Object.freeze({}),
        metadata: Object.freeze({
            confidence: 'intentionalSimplification',
            source: 'Hearth & Horizon Legacy Elderwood ecology repair production',
            notes: 'Connected Elderwood output for food, field medicine, dye, matting, packing, tinder, repair, and trade.',
        }),
    });
}
