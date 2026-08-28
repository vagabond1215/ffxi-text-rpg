import { ITEM_KINDS, normalizeItem } from './itemSchema.js';

export const REGIONAL_RESOURCE_ITEM_CATALOG_VERSION = 2;

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
    'item-elderwood-hazel-nut': resource({
        id: 'item-elderwood-hazel-nut', name: 'Elderwood Hazel Nut', tags: ['flora', 'nut', 'food', 'oilseed', 'staple'], valueGil: 6,
        sourceId: 'source-east-elderwood-hazel-coppice', placeId: 'east-elderwood', action: 'forage',
        sinks: ['consume', 'processInput', 'craftIngredient', 'trade'],
    }),
    'item-elderwood-crabapple': resource({
        id: 'item-elderwood-crabapple', name: 'Elderwood Crabapple', tags: ['flora', 'fruit', 'food', 'preserve', 'staple'], valueGil: 5,
        sourceId: 'source-east-elderwood-crabapple-thicket', placeId: 'east-elderwood', action: 'forage',
        sinks: ['consume', 'processInput', 'craftIngredient', 'trade'],
    }),
    'item-elderwood-ghost-orchid': resource({
        id: 'item-elderwood-ghost-orchid', name: 'Ghost Orchid', tags: ['flora', 'flower', 'perfume', 'alchemical', 'luxury'], valueGil: 42,
        sourceId: 'source-west-elderwood-ghost-orchid-hollow', placeId: 'west-elderwood', action: 'forage',
        sinks: ['craftIngredient', 'trade', 'decorative', 'collectible'],
    }),
    'item-elderwood-blackheart-heartwood': resource({
        id: 'item-elderwood-blackheart-heartwood', name: 'Blackheart Heartwood', tags: ['timber', 'wood', 'fine-craft', 'furniture', 'luxury'], valueGil: 48,
        sourceId: 'source-west-elderwood-blackheart-windfall', placeId: 'west-elderwood', action: 'log',
        sinks: ['processInput', 'craftIngredient', 'construction', 'repair', 'trade', 'decorative'],
    }),
    'item-redstone-ridge-millet': resource({
        id: 'item-redstone-ridge-millet', name: 'Ridge Millet', tags: ['flora', 'grain', 'food', 'fodder', 'staple'], valueGil: 6,
        sourceId: 'source-north-redstone-ridge-millet-stand', placeId: 'north-redstone-reach', action: 'gather',
        sinks: ['consume', 'processInput', 'craftIngredient', 'trade'],
    }),
    'item-redstone-rock-salt': resource({
        id: 'item-redstone-rock-salt', name: 'Redstone Rock Salt', tags: ['mineral', 'salt', 'food', 'preservation', 'staple'], valueGil: 7,
        sourceId: 'source-south-redstone-rock-salt-pan', placeId: 'south-redstone-reach', action: 'gather',
        sinks: ['consume', 'processInput', 'craftIngredient', 'trade'],
    }),
    'item-redstone-sun-crocus-stigma': resource({
        id: 'item-redstone-sun-crocus-stigma', name: 'Sun Crocus Stigma', tags: ['flora', 'spice', 'dye', 'perfume', 'luxury'], valueGil: 38,
        sourceId: 'source-south-redstone-sun-crocus-terrace', placeId: 'south-redstone-reach', action: 'forage',
        sinks: ['craftIngredient', 'trade', 'decorative', 'collectible'],
    }),
    'item-redstone-fire-opal': resource({
        id: 'item-redstone-fire-opal', name: 'Redstone Fire Opal', tags: ['mineral', 'gem', 'jewelry', 'arcane-focus', 'luxury'], valueGil: 75,
        sourceId: 'source-north-redstone-fire-opal-pocket', placeId: 'north-redstone-reach', action: 'mine',
        sinks: ['craftIngredient', 'trade', 'decorative', 'collectible'],
    }),
    'item-starfen-reedgrain': resource({
        id: 'item-starfen-reedgrain', name: 'Starfen Reedgrain', tags: ['flora', 'grain', 'food', 'staple'], valueGil: 5,
        sourceId: 'source-east-starfen-reedgrain-shelf', placeId: 'east-starfen', action: 'gather',
        sinks: ['consume', 'processInput', 'craftIngredient', 'trade'],
    }),
    'item-starfen-fen-mussel': resource({
        id: 'item-starfen-fen-mussel', name: 'Fen Mussel', tags: ['shellfish', 'mollusk', 'food', 'protein', 'staple'], valueGil: 8,
        sourceId: 'source-west-starfen-fen-mussel-bed', placeId: 'west-starfen', action: 'fish',
        sinks: ['consume', 'craftIngredient', 'trade'],
    }),
    'item-starfen-indigo-iris-petal': resource({
        id: 'item-starfen-indigo-iris-petal', name: 'Indigo Iris Petal', tags: ['flora', 'flower', 'dye', 'textile', 'luxury'], valueGil: 30,
        sourceId: 'source-east-starfen-indigo-iris-patch', placeId: 'east-starfen', action: 'forage',
        sinks: ['processInput', 'craftIngredient', 'trade', 'decorative'],
    }),
    'item-starfen-moonlotus-blossom': resource({
        id: 'item-starfen-moonlotus-blossom', name: 'Moonlotus Blossom', tags: ['flora', 'flower', 'perfume', 'medicine', 'luxury'], valueGil: 45,
        sourceId: 'source-west-starfen-moonlotus-pool', placeId: 'west-starfen', action: 'gather',
        sinks: ['craftIngredient', 'trade', 'decorative', 'collectible'],
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
