import { ITEM_KINDS, normalizeItem } from './itemSchema.js';

export const HEADWATER_HIGHLAND_TRANSITION_REPAIR_RESOURCE_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-headwater-upper-bilberry': resource({
        id: 'item-headwater-upper-bilberry',
        name: 'Upper Vale Bilberries',
        tags: ['flora', 'berry', 'food', 'shrub', 'upland', 'headwater'],
        valueGil: 9,
        sourceId: 'source-headwater-upper-bilberry-bank',
        placeId: 'headwater-upper-vale',
        action: 'forage',
        consumption: {
            mode: 'direct',
            hazard: 'none',
            preparation: ['rinse'],
            notes: 'Ripe bilberries from clean upland banks are eaten fresh after ordinary washing or cooked into preserves.',
        },
        sinks: ['consume', 'processInput', 'craftIngredient', 'trade'],
    }),
});

export function getHeadwaterHighlandTransitionRepairResourceItem(id) {
    const entry = DEFINITIONS[String(id ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}
export function listHeadwaterHighlandTransitionRepairResourceItems() {
    return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry));
}

function resource({ id, name, tags, valueGil, sourceId, placeId, action, consumption = null, sinks }) {
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
            type: 'flora',
            sourceId,
            placeId,
            action,
            data: Object.freeze({ catalogVersion: HEADWATER_HIGHLAND_TRANSITION_REPAIR_RESOURCE_ITEM_CATALOG_VERSION }),
        })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        metadata: Object.freeze({
            confidence: 'intentionalSimplification',
            source: 'Hearth & Horizon Headwater / Highland transition repair',
            notes: 'Canonical Upper Vale berry resource with exact place/source/action provenance and connected preservation demand.',
        }),
    });
}
