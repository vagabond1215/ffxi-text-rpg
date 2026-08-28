import { ITEM_KINDS, normalizeItem } from './itemSchema.js';

export const INGREDIENT_LUXURY_PRODUCTION_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-crownfields-rye-flour': item({
        id: 'item-crownfields-rye-flour', name: 'Crown Rye Flour', kind: ITEM_KINDS.MATERIAL,
        tags: ['food', 'grain', 'flour', 'ingredient', 'crownfields'], valueGil: 14,
        sourceId: 'process-crownfields-rye-flour', action: 'process',
        sinks: ['craftIngredient', 'processInput', 'trade'],
    }),
    'item-crownfields-rye-loaf': item({
        id: 'item-crownfields-rye-loaf', name: 'Crown Rye Hearth Loaf', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food', 'bread', 'meal', 'cooked', 'crownfields'], valueGil: 28,
        sourceId: 'cook-crownfields-rye-loaf', action: 'craft',
        sinks: ['consume', 'trade'],
    }),
    'item-crownfields-pea-meal': item({
        id: 'item-crownfields-pea-meal', name: 'Field Pea Meal', kind: ITEM_KINDS.MATERIAL,
        tags: ['food', 'pulse', 'meal', 'ingredient', 'crownfields'], valueGil: 15,
        sourceId: 'process-crownfields-pea-meal', action: 'process',
        sinks: ['craftIngredient', 'processInput', 'trade'],
    }),
    'item-crownfields-herbed-pea-pottage': item({
        id: 'item-crownfields-herbed-pea-pottage', name: 'Herbed Field Pea Pottage', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food', 'meal', 'pulse', 'cooked', 'crownfields'], valueGil: 32,
        sourceId: 'cook-crownfields-herbed-pea-pottage', action: 'craft',
        sinks: ['consume', 'trade'],
    }),
    'item-crownfields-flax-thread': item({
        id: 'item-crownfields-flax-thread', name: 'Crownfields Flax Thread', kind: ITEM_KINDS.MATERIAL,
        tags: ['fiber', 'thread', 'textile', 'ingredient', 'crownfields'], valueGil: 18,
        sourceId: 'process-crownfields-flax-thread', action: 'process',
        sinks: ['craftIngredient', 'processInput', 'repair', 'trade'],
    }),
    'item-crownfields-linen-cloth': item({
        id: 'item-crownfields-linen-cloth', name: 'Crownfields Linen Cloth', kind: ITEM_KINDS.MATERIAL,
        tags: ['fiber', 'linen', 'textile', 'cloth', 'component', 'crownfields'], valueGil: 42,
        sourceId: 'process-crownfields-linen-cloth', action: 'process',
        sinks: ['craftIngredient', 'processInput', 'repair', 'trade'],
    }),
    'item-crownfields-woad-pigment': item({
        id: 'item-crownfields-woad-pigment', name: 'Crownfields Woad Pigment', kind: ITEM_KINDS.MATERIAL,
        tags: ['dye', 'pigment', 'blue', 'ingredient', 'luxury', 'crownfields'], valueGil: 44,
        sourceId: 'process-crownfields-woad-pigment', action: 'process',
        sinks: ['craftIngredient', 'processInput', 'trade', 'decorative'],
    }),
    'item-crownfields-woad-linen': item({
        id: 'item-crownfields-woad-linen', name: 'Woad-Blue Linen Bolt', kind: ITEM_KINDS.MATERIAL,
        tags: ['textile', 'linen', 'dyed', 'blue', 'luxury', 'crownfields'], valueGil: 92,
        sourceId: 'craft-crownfields-woad-linen', action: 'craft',
        sinks: ['craftIngredient', 'trade', 'decorative'],
    }),
    'item-crownfields-apple-must': item({
        id: 'item-crownfields-apple-must', name: 'Pressed Cider Apple Must', kind: ITEM_KINDS.MATERIAL,
        tags: ['food', 'fruit', 'pressed', 'ingredient', 'crownfields'], valueGil: 16,
        sourceId: 'process-crownfields-apple-must', action: 'process',
        sinks: ['craftIngredient', 'processInput', 'trade'],
    }),
    'item-crownfields-cider-vinegar': item({
        id: 'item-crownfields-cider-vinegar', name: 'Crownfields Cider Vinegar', kind: ITEM_KINDS.MATERIAL,
        tags: ['food', 'vinegar', 'preservation', 'ingredient', 'crownfields'], valueGil: 27,
        sourceId: 'cook-crownfields-cider-vinegar', action: 'craft',
        sinks: ['craftIngredient', 'processInput', 'trade'],
    }),

    'item-elderwood-orchid-absolute': item({
        id: 'item-elderwood-orchid-absolute', name: 'Ghost Orchid Absolute', kind: ITEM_KINDS.MATERIAL,
        tags: ['perfume', 'aromatic', 'extract', 'ingredient', 'luxury', 'elderwood'], valueGil: 88,
        sourceId: 'process-elderwood-orchid-absolute', action: 'process',
        sinks: ['craftIngredient', 'processInput', 'trade', 'collectible'],
    }),
    'item-elderwood-blackheart-veneer': item({
        id: 'item-elderwood-blackheart-veneer', name: 'Blackheart Fine Veneer', kind: ITEM_KINDS.MATERIAL,
        tags: ['wood', 'veneer', 'fine-craft', 'component', 'luxury', 'elderwood'], valueGil: 96,
        sourceId: 'process-elderwood-blackheart-veneer', action: 'process',
        sinks: ['craftIngredient', 'construction', 'trade', 'decorative'],
    }),
    'item-elderwood-orchid-scent-casket': item({
        id: 'item-elderwood-orchid-scent-casket', name: 'Orchid-Scented Blackheart Casket', kind: ITEM_KINDS.MATERIAL,
        tags: ['furniture', 'fine-craft', 'perfume', 'decorative', 'luxury', 'elderwood'], valueGil: 210,
        sourceId: 'craft-elderwood-orchid-scent-casket', action: 'craft',
        sinks: ['trade', 'decorative', 'collectible'],
    }),

    'item-redstone-crocus-pigment': item({
        id: 'item-redstone-crocus-pigment', name: 'Sun Crocus Gold Pigment', kind: ITEM_KINDS.MATERIAL,
        tags: ['dye', 'pigment', 'gold', 'ingredient', 'luxury', 'redstone'], valueGil: 68,
        sourceId: 'process-redstone-crocus-pigment', action: 'process',
        sinks: ['craftIngredient', 'processInput', 'trade', 'decorative'],
    }),
    'item-redstone-cut-fire-opal': item({
        id: 'item-redstone-cut-fire-opal', name: 'Cut Redstone Fire Opal', kind: ITEM_KINDS.MATERIAL,
        tags: ['gem', 'opal', 'jewelry', 'component', 'luxury', 'redstone'], valueGil: 150,
        sourceId: 'process-redstone-fire-opal-cut', action: 'process',
        sinks: ['craftIngredient', 'trade', 'decorative', 'collectible'],
    }),
    'item-redstone-fire-opal-brooch': item({
        id: 'item-redstone-fire-opal-brooch', name: 'Copper-Set Fire Opal Brooch', kind: ITEM_KINDS.MATERIAL,
        tags: ['jewelry', 'brooch', 'gem', 'decorative', 'luxury', 'redstone'], valueGil: 245,
        sourceId: 'craft-redstone-fire-opal-brooch', action: 'craft',
        sinks: ['trade', 'decorative', 'collectible'],
    }),

    'item-starfen-indigo-pigment': item({
        id: 'item-starfen-indigo-pigment', name: 'Starfen Indigo Pigment', kind: ITEM_KINDS.MATERIAL,
        tags: ['dye', 'pigment', 'indigo', 'ingredient', 'luxury', 'starfen'], valueGil: 58,
        sourceId: 'process-starfen-indigo-pigment', action: 'process',
        sinks: ['craftIngredient', 'processInput', 'trade', 'decorative'],
    }),
    'item-starfen-moonlotus-essence': item({
        id: 'item-starfen-moonlotus-essence', name: 'Moonlotus Essence', kind: ITEM_KINDS.MATERIAL,
        tags: ['perfume', 'medicine', 'extract', 'ingredient', 'luxury', 'starfen'], valueGil: 94,
        sourceId: 'process-starfen-moonlotus-essence', action: 'process',
        sinks: ['craftIngredient', 'processInput', 'trade', 'collectible'],
    }),
    'item-starfen-indigo-linen': item({
        id: 'item-starfen-indigo-linen', name: 'Starfen Indigo Linen Bolt', kind: ITEM_KINDS.MATERIAL,
        tags: ['textile', 'linen', 'dyed', 'indigo', 'luxury', 'starfen'], valueGil: 104,
        sourceId: 'craft-starfen-indigo-linen', action: 'craft',
        sinks: ['craftIngredient', 'trade', 'decorative'],
    }),
    'item-starfen-moonlotus-orchid-perfume': item({
        id: 'item-starfen-moonlotus-orchid-perfume', name: 'Moonlotus-Orchid Perfume', kind: ITEM_KINDS.MATERIAL,
        tags: ['perfume', 'aromatic', 'fine-craft', 'collectible', 'luxury', 'starfen'], valueGil: 230,
        sourceId: 'craft-starfen-moonlotus-orchid-perfume', action: 'craft',
        sinks: ['trade', 'decorative', 'collectible'],
    }),

    'item-coppergrass-madder-pigment': item({
        id: 'item-coppergrass-madder-pigment', name: 'Coppergrass Crimson Pigment', kind: ITEM_KINDS.MATERIAL,
        tags: ['dye', 'pigment', 'crimson', 'ingredient', 'luxury', 'coppergrass'], valueGil: 46,
        sourceId: 'process-coppergrass-madder-pigment', action: 'process',
        sinks: ['craftIngredient', 'processInput', 'trade', 'decorative'],
    }),
    'item-coppergrass-windglass-cabochon': item({
        id: 'item-coppergrass-windglass-cabochon', name: 'Windglass Agate Cabochon', kind: ITEM_KINDS.MATERIAL,
        tags: ['gem', 'agate', 'ornament', 'component', 'luxury', 'coppergrass'], valueGil: 82,
        sourceId: 'process-coppergrass-windglass-cabochon', action: 'process',
        sinks: ['craftIngredient', 'trade', 'decorative', 'collectible'],
    }),
    'item-coppergrass-crimson-linen': item({
        id: 'item-coppergrass-crimson-linen', name: 'Coppergrass Crimson Linen Bolt', kind: ITEM_KINDS.MATERIAL,
        tags: ['textile', 'linen', 'dyed', 'crimson', 'luxury', 'coppergrass'], valueGil: 96,
        sourceId: 'craft-coppergrass-crimson-linen', action: 'craft',
        sinks: ['craftIngredient', 'trade', 'decorative'],
    }),
    'item-coppergrass-windglass-travel-charm': item({
        id: 'item-coppergrass-windglass-travel-charm', name: 'Windglass Road Charm', kind: ITEM_KINDS.MATERIAL,
        tags: ['ornament', 'travel', 'gem', 'fine-craft', 'luxury', 'coppergrass'], valueGil: 165,
        sourceId: 'craft-coppergrass-windglass-travel-charm', action: 'craft',
        sinks: ['trade', 'decorative', 'collectible'],
    }),

    'item-slatewater-lichen-pigment': item({
        id: 'item-slatewater-lichen-pigment', name: 'Silver Lichen Pigment', kind: ITEM_KINDS.MATERIAL,
        tags: ['dye', 'pigment', 'silver', 'alchemical', 'ingredient', 'luxury', 'slatewater'], valueGil: 62,
        sourceId: 'process-slatewater-lichen-pigment', action: 'process',
        sinks: ['craftIngredient', 'processInput', 'trade', 'decorative'],
    }),
    'item-slatewater-polished-blue-slate-tile': item({
        id: 'item-slatewater-polished-blue-slate-tile', name: 'Polished Slatewater Blue Tile', kind: ITEM_KINDS.MATERIAL,
        tags: ['stone', 'tile', 'masonry', 'fine-craft', 'component', 'luxury', 'slatewater'], valueGil: 70,
        sourceId: 'process-slatewater-blue-slate-tile', action: 'process',
        sinks: ['craftIngredient', 'construction', 'trade', 'decorative'],
    }),
    'item-slatewater-fine-white-slip': item({
        id: 'item-slatewater-fine-white-slip', name: 'Slatewater Fine White Slip', kind: ITEM_KINDS.MATERIAL,
        tags: ['clay', 'ceramic', 'slip', 'ingredient', 'slatewater'], valueGil: 19,
        sourceId: 'process-slatewater-white-clay-slip', action: 'process',
        sinks: ['craftIngredient', 'processInput', 'construction', 'trade'],
    }),
    'item-slatewater-silver-lichen-glaze': item({
        id: 'item-slatewater-silver-lichen-glaze', name: 'Silver Lichen Ceramic Glaze', kind: ITEM_KINDS.MATERIAL,
        tags: ['ceramic', 'glaze', 'silver', 'decorative', 'component', 'luxury', 'slatewater'], valueGil: 98,
        sourceId: 'craft-slatewater-silver-glaze', action: 'craft',
        sinks: ['craftIngredient', 'construction', 'trade', 'decorative'],
    }),
    'item-slatewater-glazed-blue-slate-plaque': item({
        id: 'item-slatewater-glazed-blue-slate-plaque', name: 'Silver-Glazed Blue Slate Plaque', kind: ITEM_KINDS.MATERIAL,
        tags: ['stone', 'ceramic', 'decorative', 'fine-craft', 'luxury', 'slatewater'], valueGil: 195,
        sourceId: 'craft-slatewater-glazed-blue-slate-plaque', action: 'craft',
        sinks: ['trade', 'decorative', 'collectible'],
    }),

    'item-regional-dyers-sample-book': item({
        id: 'item-regional-dyers-sample-book', name: 'Five-Region Dyer’s Sample Book', kind: ITEM_KINDS.MATERIAL,
        tags: ['textile', 'dye', 'reference', 'collectible', 'fine-craft', 'luxury'], valueGil: 320,
        sourceId: 'craft-regional-dyers-sample-book', action: 'craft',
        sinks: ['trade', 'decorative', 'collectible'],
    }),
});

export function getIngredientLuxuryProductionItem(itemId) {
    const entry = DEFINITIONS[String(itemId ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}

export function listIngredientLuxuryProductionItems() {
    return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry));
}

function item({ id, name, kind, tags, valueGil, sourceId, action, sinks }) {
    return Object.freeze({
        id,
        name,
        kind,
        quantity: 1,
        maxStack: 99,
        valueGil,
        tags: Object.freeze([...tags]),
        provenance: Object.freeze([Object.freeze({
            type: 'crafting',
            sourceId,
            placeId: null,
            action,
            data: Object.freeze({ catalogVersion: INGREDIENT_LUXURY_PRODUCTION_ITEM_CATALOG_VERSION }),
        })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        equipmentSlot: null,
        allowedSlots: Object.freeze([]),
        requirements: Object.freeze({ minLevel: 1, allowedJobs: [], allowedRaces: [] }),
        flags: Object.freeze([]),
        modifiers: Object.freeze({}),
        metadata: Object.freeze({
            confidence: 'intentionalSimplification',
            source: 'Hearth & Horizon regional ingredient and luxury processing',
            notes: 'Original intermediate or finished production output designed to deepen existing raw-resource demand without introducing a second production authority.',
        }),
    });
}
