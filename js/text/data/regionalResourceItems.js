import { ITEM_KINDS, normalizeItem } from './itemSchema.js';

export const REGIONAL_RESOURCE_ITEM_CATALOG_VERSION = 5;

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
    'item-coppergrass-groundpea': resource({
        id: 'item-coppergrass-groundpea', name: 'Coppergrass Groundpea', tags: ['flora', 'pulse', 'food', 'protein', 'staple'], valueGil: 6,
        sourceId: 'source-coppergrass-groundpea-patch', placeId: 'coppergrass-steppe', action: 'forage',
        sinks: ['consume', 'processInput', 'craftIngredient', 'trade'],
    }),
    'item-coppergrass-prairie-flax': resource({
        id: 'item-coppergrass-prairie-flax', name: 'Prairie Flax', tags: ['flora', 'fiber', 'oilseed', 'textile', 'staple'], valueGil: 7,
        sourceId: 'source-coppergrass-prairie-flax-stand', placeId: 'coppergrass-steppe', action: 'gather',
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-coppergrass-crimson-madder': resource({
        id: 'item-coppergrass-crimson-madder', name: 'Crimson Madder Root', tags: ['flora', 'root', 'dye', 'textile', 'luxury'], valueGil: 24,
        sourceId: 'source-coppergrass-crimson-madder-bed', placeId: 'coppergrass-steppe', action: 'forage',
        sinks: ['processInput', 'craftIngredient', 'trade', 'decorative'],
    }),
    'item-coppergrass-windglass-agate': resource({
        id: 'item-coppergrass-windglass-agate', name: 'Windglass Agate', tags: ['mineral', 'agate', 'gem', 'ornament', 'luxury'], valueGil: 40,
        sourceId: 'source-coppergrass-windglass-gravel', placeId: 'coppergrass-steppe', action: 'gather',
        sinks: ['craftIngredient', 'trade', 'decorative', 'collectible'],
    }),
    'item-slatewater-serviceberry': resource({
        id: 'item-slatewater-serviceberry', name: 'Slatewater Serviceberry', tags: ['flora', 'berry', 'food', 'preserve', 'staple'], valueGil: 6,
        sourceId: 'source-slatewater-serviceberry-brake', placeId: 'slatewater-foothills', action: 'forage',
        sinks: ['consume', 'processInput', 'craftIngredient', 'trade'],
    }),
    'item-slatewater-pitch-pine-resin': resource({
        id: 'item-slatewater-pitch-pine-resin', name: 'Pitch Pine Resin', tags: ['flora', 'resin', 'binder', 'repair', 'staple'], valueGil: 8,
        sourceId: 'source-slatewater-pitch-pine-stand', placeId: 'slatewater-foothills', action: 'forage',
        sinks: ['processInput', 'craftIngredient', 'repair', 'trade'],
    }),
    'item-slatewater-white-clay': resource({
        id: 'item-slatewater-white-clay', name: 'Slatewater White Clay', tags: ['mineral', 'clay', 'ceramic', 'construction', 'staple'], valueGil: 7,
        sourceId: 'source-slatewater-white-clay-bank', placeId: 'slatewater-foothills', action: 'gather',
        sinks: ['processInput', 'craftIngredient', 'construction', 'trade'],
    }),
    'item-slatewater-mountain-thyme': resource({
        id: 'item-slatewater-mountain-thyme', name: 'Mountain Thyme', tags: ['flora', 'herb', 'food', 'medicine', 'staple'], valueGil: 7,
        sourceId: 'source-slatewater-mountain-thyme-slope', placeId: 'slatewater-foothills', action: 'forage',
        sinks: ['consume', 'craftIngredient', 'trade'],
    }),
    'item-slatewater-silver-lichen': resource({
        id: 'item-slatewater-silver-lichen', name: 'Silver Lichen', tags: ['flora', 'lichen', 'dye', 'alchemical', 'luxury'], valueGil: 34,
        sourceId: 'source-slatewater-silver-lichen-face', placeId: 'slatewater-foothills', action: 'forage',
        sinks: ['processInput', 'craftIngredient', 'trade', 'collectible'],
    }),
    'item-slatewater-blue-slate': resource({
        id: 'item-slatewater-blue-slate', name: 'Slatewater Blue Slate', tags: ['mineral', 'stone', 'fine-craft', 'masonry', 'luxury'], valueGil: 32,
        sourceId: 'source-slatewater-blue-slate-shelf', placeId: 'slatewater-foothills', action: 'mine',
        sinks: ['processInput', 'craftIngredient', 'construction', 'trade', 'decorative'],
    }),
    'item-crownfields-crown-rye': resource({
        id: 'item-crownfields-crown-rye', name: 'Crown Rye', tags: ['flora', 'grain', 'food', 'agriculture', 'staple'], valueGil: 5,
        sourceId: 'source-crownfields-crown-rye-strip', placeId: 'crownfields', action: 'gather',
        sinks: ['consume', 'processInput', 'craftIngredient', 'trade'],
    }),
    'item-crownfields-field-pea': resource({
        id: 'item-crownfields-field-pea', name: 'Field Pea', tags: ['flora', 'pulse', 'food', 'agriculture', 'staple'], valueGil: 6,
        sourceId: 'source-crownfields-field-pea-row', placeId: 'crownfields', action: 'gather',
        sinks: ['consume', 'processInput', 'craftIngredient', 'trade'],
    }),
    'item-crownfields-flax-straw': resource({
        id: 'item-crownfields-flax-straw', name: 'Blue Flax Straw', tags: ['flora', 'fiber', 'textile', 'agriculture', 'staple'], valueGil: 7,
        sourceId: 'source-crownfields-flax-strip', placeId: 'crownfields', action: 'gather',
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-crownfields-cider-apple': resource({
        id: 'item-crownfields-cider-apple', name: 'Cider Apple', tags: ['flora', 'fruit', 'food', 'orchard', 'staple'], valueGil: 7,
        sourceId: 'source-crownfields-cider-apple-orchard', placeId: 'crownfields', action: 'gather',
        sinks: ['consume', 'processInput', 'craftIngredient', 'trade'],
    }),
    'item-crownfields-meadow-hay': resource({
        id: 'item-crownfields-meadow-hay', name: 'Meadow Hay', tags: ['flora', 'fodder', 'bedding', 'agriculture', 'staple'], valueGil: 4,
        sourceId: 'source-crownfields-hay-meadow', placeId: 'crownfields', action: 'gather',
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-crownfields-dyers-woad': resource({
        id: 'item-crownfields-dyers-woad', name: 'Dyer’s Woad', tags: ['flora', 'dye', 'agriculture', 'specialty', 'luxury'], valueGil: 24,
        sourceId: 'source-crownfields-woad-bed', placeId: 'crownfields', action: 'gather',
        sinks: ['processInput', 'craftIngredient', 'trade'],
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
