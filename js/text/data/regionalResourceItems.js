import { ITEM_KINDS, normalizeItem } from './itemSchema.js';

export const REGIONAL_RESOURCE_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-elderwood-amber-resin': resource({
        id: 'item-elderwood-amber-resin', name: 'Amber Resin', tags: ['flora', 'resin', 'binder', 'woodworking'], valueGil: 11,
        sourceId: 'source-west-elderwood-amber-resin-grove', placeId: 'west-elderwood', action: 'forage',
        sinks: ['processInput', 'craftIngredient', 'repair', 'trade'],
    }),
    'item-elderwood-duskcap': resource({
        id: 'item-elderwood-duskcap', name: 'Duskcap Mushroom', tags: ['flora', 'fungus', 'food', 'medicine'], valueGil: 10,
        sourceId: 'source-west-elderwood-duskcap-ring', placeId: 'west-elderwood', action: 'forage',
        sinks: ['consume', 'craftIngredient', 'trade'],
    }),
    'item-redstone-iron-ore': resource({
        id: 'item-redstone-iron-ore', name: 'Redstone Iron Ore', tags: ['mineral', 'ore', 'iron', 'metal'], valueGil: 14,
        sourceId: 'source-south-redstone-iron-vein', placeId: 'south-redstone-reach', action: 'mine',
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-redstone-sunstone-grit': resource({
        id: 'item-redstone-sunstone-grit', name: 'Sunstone Grit', tags: ['mineral', 'abrasive', 'stone'], valueGil: 9,
        sourceId: 'source-south-redstone-sunstone-scree', placeId: 'south-redstone-reach', action: 'gather',
        sinks: ['processInput', 'craftIngredient', 'repair', 'trade'],
    }),
    'item-starfen-bluekelp': resource({
        id: 'item-starfen-bluekelp', name: 'Bluekelp', tags: ['flora', 'aquatic', 'food', 'medicine'], valueGil: 8,
        sourceId: 'source-west-starfen-bluekelp-pool', placeId: 'west-starfen', action: 'gather',
        sinks: ['consume', 'craftIngredient', 'trade'],
    }),
    'item-starfen-bogberry': resource({
        id: 'item-starfen-bogberry', name: 'Bogberry', tags: ['flora', 'berry', 'food', 'dye'], valueGil: 7,
        sourceId: 'source-west-starfen-bogberry-brake', placeId: 'west-starfen', action: 'forage',
        sinks: ['consume', 'craftIngredient', 'trade'],
    }),
});

export function getRegionalResourceItem(itemId) {
    const entry = DEFINITIONS[String(itemId ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}

export function listRegionalResourceItems() {
    return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry));
}

function resource({ id, name, tags, valueGil, sourceId, placeId, action, sinks }) {
    return Object.freeze({
        id,
        name,
        kind: ITEM_KINDS.MATERIAL,
        quantity: 1,
        maxStack: 99,
        valueGil,
        tags: Object.freeze([...tags]),
        provenance: Object.freeze([Object.freeze({
            type: action === 'mine' || tags.includes('mineral') ? 'mineral' : action === 'fish' ? 'fishing' : 'flora',
            sourceId,
            placeId,
            action,
            data: Object.freeze({ catalogVersion: REGIONAL_RESOURCE_ITEM_CATALOG_VERSION }),
        })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        metadata: Object.freeze({
            confidence: 'intentionalSimplification',
            source: 'Hearth & Horizon regional ecology breadth',
            notes: 'Original regional raw material authored to support a distinct livelihood/trade loop.',
        }),
    });
}
