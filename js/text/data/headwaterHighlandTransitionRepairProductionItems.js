import { ITEM_KINDS, normalizeItem, validateItemConsumption } from './itemSchema.js';

export const HEADWATER_HIGHLAND_TRANSITION_REPAIR_PRODUCTION_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-headwater-bilberry-meadowsweet-preserve': item({
        id: 'item-headwater-bilberry-meadowsweet-preserve',
        name: 'Bilberry-Meadowsweet Preserve',
        kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food', 'preserve', 'berry', 'herb', 'cooked', 'headwater'],
        valueGil: 28,
        sourceId: 'cook-headwater-bilberry-meadowsweet-preserve',
        action: 'craft',
        consumption: {
            mode: 'direct',
            hazard: 'none',
            preparation: [],
            notes: 'Bilberries are fully cooked with dried meadowsweet into a finished preserve ready for bread, porridge, or trail meals.',
        },
        sinks: ['consume', 'trade'],
    }),
});

export function getHeadwaterHighlandTransitionRepairProductionItem(id) {
    const entry = DEFINITIONS[String(id ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}
export function listHeadwaterHighlandTransitionRepairProductionItems() {
    return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry));
}
export function validateHeadwaterHighlandTransitionRepairProductionItems() {
    const issues = [];
    for (const entry of listHeadwaterHighlandTransitionRepairProductionItems()) {
        for (const issue of validateItemConsumption(entry)) issues.push(`${entry.id} ${issue}`);
    }
    return issues;
}

function item({ id, name, kind, tags, valueGil, sourceId, action, consumption = null, sinks }) {
    return Object.freeze({
        id,
        name,
        kind,
        quantity: 1,
        maxStack: 99,
        valueGil,
        tags: Object.freeze([...tags]),
        consumption,
        provenance: Object.freeze([Object.freeze({
            type: 'crafting',
            sourceId,
            placeId: null,
            action,
            data: Object.freeze({ catalogVersion: HEADWATER_HIGHLAND_TRANSITION_REPAIR_PRODUCTION_ITEM_CATALOG_VERSION }),
        })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        equipmentSlot: null,
        allowedSlots: Object.freeze([]),
        requirements: Object.freeze({ minLevel: 1, allowedJobs: [], allowedRaces: [] }),
        flags: Object.freeze([]),
        modifiers: Object.freeze({}),
        metadata: Object.freeze({
            confidence: 'intentionalSimplification',
            source: 'Hearth & Horizon Headwater / Highland transition repair production',
            notes: 'Connected cooked preserve for the Upper Vale berry-recovery loop.',
        }),
    });
}
