import { ITEM_KINDS, normalizeItem } from './itemSchema.js';

export const RESOURCE_ITEM_CATALOG_VERSION = 1;

const RESOURCE_ITEM_DEFINITIONS = Object.freeze({
    'item-elderwood-sweetroot': resourceItem({
        id: 'item-elderwood-sweetroot',
        name: 'Elderwood Sweetroot',
        tags: ['flora', 'root', 'food', 'medicine'],
        valueGil: 6,
        sourceId: 'source-west-elderwood-sweetroot-patch',
        placeId: 'west-elderwood',
        action: 'forage',
        sinks: ['consume', 'craftIngredient', 'trade'],
    }),
    'item-elderwood-hardwood': resourceItem({
        id: 'item-elderwood-hardwood',
        name: 'Elderwood Hardwood',
        tags: ['timber', 'wood', 'construction'],
        valueGil: 12,
        sourceId: 'source-west-elderwood-hardwood-fall',
        placeId: 'west-elderwood',
        action: 'log',
        sinks: ['craftIngredient', 'construction', 'repair', 'trade'],
    }),
    'item-redstone-copper-ore': resourceItem({
        id: 'item-redstone-copper-ore',
        name: 'Redstone Copper Ore',
        tags: ['mineral', 'ore', 'metal'],
        valueGil: 10,
        sourceId: 'source-south-redstone-copper-seam',
        placeId: 'south-redstone-reach',
        action: 'mine',
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-redstone-clay': resourceItem({
        id: 'item-redstone-clay',
        name: 'Redstone Clay',
        tags: ['mineral', 'clay', 'ceramic'],
        valueGil: 5,
        sourceId: 'source-south-redstone-clay-bank',
        placeId: 'south-redstone-reach',
        action: 'gather',
        sinks: ['processInput', 'craftIngredient', 'construction', 'trade'],
    }),
    'item-starfen-reed-fiber': resourceItem({
        id: 'item-starfen-reed-fiber',
        name: 'Starfen Reed Fiber',
        tags: ['flora', 'fiber', 'textile'],
        valueGil: 7,
        sourceId: 'source-west-starfen-reedbed',
        placeId: 'west-starfen',
        action: 'gather',
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-starfen-marrowleaf': resourceItem({
        id: 'item-starfen-marrowleaf',
        name: 'Marrowleaf',
        tags: ['flora', 'herb', 'medicine'],
        valueGil: 9,
        sourceId: 'source-west-starfen-marrowleaf-bed',
        placeId: 'west-starfen',
        action: 'forage',
        sinks: ['consume', 'craftIngredient', 'trade'],
    }),
    'item-starfen-silverfin': resourceItem({
        id: 'item-starfen-silverfin',
        name: 'Starfen Silverfin',
        tags: ['fish', 'food'],
        valueGil: 11,
        sourceId: 'source-west-starfen-silverfin-water',
        placeId: 'west-starfen',
        action: 'fish',
        sinks: ['consume', 'craftIngredient', 'trade'],
    }),
});

export function getResourceItem(itemId) {
    const definition = RESOURCE_ITEM_DEFINITIONS[String(itemId ?? '').trim()] ?? null;
    return definition ? normalizeItem(definition) : null;
}

export function listResourceItems() {
    return Object.values(RESOURCE_ITEM_DEFINITIONS).map((definition) => normalizeItem(definition));
}

function resourceItem({ id, name, tags, valueGil, sourceId, placeId, action, sinks }) {
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
            data: Object.freeze({ catalogVersion: RESOURCE_ITEM_CATALOG_VERSION }),
        })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        metadata: Object.freeze({
            confidence: 'intentionalSimplification',
            source: 'Hearth & Horizon canonical ecology substrate',
            notes: 'Representative raw material used to validate ecology/source/sink cross references before large content expansion.',
        }),
    });
}
