import { ITEM_KINDS, normalizeItem } from './itemSchema.js';

export const GREAT_MERE_PRODUCTION_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-great-mere-perch-fillet': item({
        id: 'item-great-mere-perch-fillet', name: 'Cleaned Silver Perch Fillet', kind: ITEM_KINDS.MATERIAL,
        tags: ['food', 'fish', 'fillet', 'ingredient', 'great-mere'], valueGil: 18,
        sourceId: 'process-great-mere-clean-perch', action: 'process',
        consumption: { mode: 'processRequired', hazard: 'pathogenRisk', preparation: ['cook-or-smoke'], notes: 'Cleaned freshwater fish is still raw and must be cooked or smoked.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-great-mere-smoked-perch-ration': item({
        id: 'item-great-mere-smoked-perch-ration', name: 'Smoked Perch Ration', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food', 'fish', 'smoked', 'preserved', 'great-mere'], valueGil: 30,
        sourceId: 'cook-great-mere-smoked-perch', action: 'craft',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Fully smoked and food-safe; ready to eat.' },
        sinks: ['consume', 'trade'],
    }),
    'item-great-mere-pike-fillet': item({
        id: 'item-great-mere-pike-fillet', name: 'Cleaned Reed Pike Fillet', kind: ITEM_KINDS.MATERIAL,
        tags: ['food', 'fish', 'fillet', 'ingredient', 'great-mere'], valueGil: 24,
        sourceId: 'process-great-mere-clean-pike', action: 'process',
        consumption: { mode: 'processRequired', hazard: 'pathogenRisk', preparation: ['cook-or-pickle'], notes: 'Cleaned freshwater pike remains raw until cooked or properly preserved.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-great-mere-preservation-brine': item({
        id: 'item-great-mere-preservation-brine', name: 'Merewatch Preservation Brine', kind: ITEM_KINDS.MATERIAL,
        tags: ['food', 'brine', 'preservation', 'ingredient', 'great-mere'], valueGil: 18,
        sourceId: 'process-great-mere-preservation-brine', action: 'process',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Food-safe pickling brine; normally used as an ingredient rather than consumed alone.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-great-mere-pickled-pike': item({
        id: 'item-great-mere-pickled-pike', name: 'Pickled Reed Pike', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food', 'fish', 'pickled', 'preserved', 'great-mere'], valueGil: 42,
        sourceId: 'cook-great-mere-pickled-pike', action: 'craft',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Properly cooked and pickled; ready to eat.' },
        sinks: ['consume', 'trade'],
    }),
    'item-great-mere-crayfish-tail-meat': item({
        id: 'item-great-mere-crayfish-tail-meat', name: 'Cleaned Blueclaw Tail Meat', kind: ITEM_KINDS.MATERIAL,
        tags: ['food', 'crustacean', 'ingredient', 'great-mere'], valueGil: 17,
        sourceId: 'process-great-mere-clean-crayfish', action: 'process',
        consumption: { mode: 'processRequired', hazard: 'pathogenRisk', preparation: ['cook'], notes: 'Cleaned crayfish meat must still be cooked thoroughly.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-great-mere-thyme-crayfish-pot': item({
        id: 'item-great-mere-thyme-crayfish-pot', name: 'Mountain-Thyme Blueclaw Pot', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food', 'crustacean', 'meal', 'cooked', 'great-mere'], valueGil: 38,
        sourceId: 'cook-great-mere-thyme-crayfish', action: 'craft',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Fully cooked shellfish meal; ready to eat.' },
        sinks: ['consume', 'trade'],
    }),
    'item-great-mere-mussel-meat': item({
        id: 'item-great-mere-mussel-meat', name: 'Cleaned Cloudwater Mussel Meat', kind: ITEM_KINDS.MATERIAL,
        tags: ['food', 'shellfish', 'ingredient', 'great-mere'], valueGil: 15,
        sourceId: 'process-great-mere-shuck-mussel', action: 'process',
        consumption: { mode: 'processRequired', hazard: 'pathogenRisk', preparation: ['cook'], notes: 'Shucked freshwater mussel meat must be cooked before eating.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-great-mere-mussel-shell': item({
        id: 'item-great-mere-mussel-shell', name: 'Cloudwater Mussel Shell', kind: ITEM_KINDS.MATERIAL,
        tags: ['shell', 'mineral', 'lime', 'crafting', 'great-mere'], valueGil: 5,
        sourceId: 'process-great-mere-shuck-mussel', action: 'process',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'Shell byproduct for lime and craft use; not food.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-great-mere-cress-mussel-broth': item({
        id: 'item-great-mere-cress-mussel-broth', name: 'Lake Cress Mussel Broth', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food', 'shellfish', 'meal', 'cooked', 'great-mere'], valueGil: 36,
        sourceId: 'cook-great-mere-cress-mussel-broth', action: 'craft',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Fully cooked broth; ready to eat.' },
        sinks: ['consume', 'trade'],
    }),
    'item-great-mere-arrowroot-starch': item({
        id: 'item-great-mere-arrowroot-starch', name: 'Washed Mere Arrowroot Starch', kind: ITEM_KINDS.MATERIAL,
        tags: ['food', 'starch', 'flour', 'ingredient', 'great-mere'], valueGil: 16,
        sourceId: 'process-great-mere-arrowroot-starch', action: 'process',
        consumption: { mode: 'processRequired', hazard: 'none', preparation: ['cook-or-bake'], notes: 'Washed starch is safe as a cooking ingredient but should be cooked before eating.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-great-mere-arrowroot-cake': item({
        id: 'item-great-mere-arrowroot-cake', name: 'Mere Arrowroot Griddle Cake', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food', 'starch', 'bread', 'cooked', 'great-mere'], valueGil: 28,
        sourceId: 'cook-great-mere-arrowroot-cake', action: 'craft',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Cooked griddle cake; ready to eat.' },
        sinks: ['consume', 'trade'],
    }),
    'item-great-mere-bitterflag-starch': item({
        id: 'item-great-mere-bitterflag-starch', name: 'Leached Bitterflag Starch', kind: ITEM_KINDS.MATERIAL,
        tags: ['food', 'starch', 'detoxified', 'ingredient', 'great-mere'], valueGil: 22,
        sourceId: 'process-great-mere-detox-bitterflag', action: 'process',
        consumption: { mode: 'processRequired', hazard: 'none', preparation: ['cook-or-bake'], notes: 'Leaching and boiling remove the raw toxin; the finished starch is then used as a cooking ingredient.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-great-mere-fisher-biscuit': item({
        id: 'item-great-mere-fisher-biscuit', name: 'Merewatch Fisher Biscuit', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food', 'bread', 'travel', 'cooked', 'great-mere'], valueGil: 31,
        sourceId: 'cook-great-mere-fisher-biscuit', action: 'craft',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Baked travel biscuit; ready to eat.' },
        sinks: ['consume', 'trade'],
    }),
    'item-great-mere-rush-cord': item({
        id: 'item-great-mere-rush-cord', name: 'Great Mere Rush Cord', kind: ITEM_KINDS.MATERIAL,
        tags: ['fiber', 'cord', 'fishing-gear', 'component', 'great-mere'], valueGil: 14,
        sourceId: 'process-great-mere-rush-cord', action: 'process',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'Braided rush cord; not food.' },
        sinks: ['processInput', 'craftIngredient', 'repair', 'trade'],
    }),
    'item-great-mere-tarred-net-line': item({
        id: 'item-great-mere-tarred-net-line', name: 'Pitch-Tarred Net Line', kind: ITEM_KINDS.MATERIAL,
        tags: ['fiber', 'resin', 'fishing-gear', 'waterproof', 'component', 'great-mere'], valueGil: 28,
        sourceId: 'craft-great-mere-tarred-net-line', action: 'craft',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'Water-resistant net line; not food.' },
        sinks: ['craftIngredient', 'repair', 'trade'],
    }),
    'item-great-mere-polished-cloudwater-pearl': item({
        id: 'item-great-mere-polished-cloudwater-pearl', name: 'Polished Cloudwater Pearl', kind: ITEM_KINDS.MATERIAL,
        tags: ['pearl', 'jewelry', 'ornament', 'component', 'luxury', 'great-mere'], valueGil: 110,
        sourceId: 'process-great-mere-polish-pearl', action: 'process',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'Polished freshwater pearl; not food.' },
        sinks: ['craftIngredient', 'trade', 'decorative', 'collectible'],
    }),
    'item-great-mere-pearl-net-needle': item({
        id: 'item-great-mere-pearl-net-needle', name: 'Pearl-Set Net Needle', kind: ITEM_KINDS.MATERIAL,
        tags: ['tool', 'fishing-gear', 'fine-craft', 'pearl', 'luxury', 'great-mere'], valueGil: 168,
        sourceId: 'craft-great-mere-pearl-net-needle', action: 'craft',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'Fine net-making implement; not food.' },
        sinks: ['toolUse', 'craftIngredient', 'trade', 'collectible'],
    }),
    'item-starfen-reedgrain-meal': item({
        id: 'item-starfen-reedgrain-meal', name: 'Starfen Reedgrain Meal', kind: ITEM_KINDS.MATERIAL,
        tags: ['food', 'grain', 'meal', 'ingredient', 'starfen'], valueGil: 13,
        sourceId: 'process-starfen-reedgrain-meal', action: 'process',
        consumption: { mode: 'processRequired', hazard: 'none', preparation: ['cook-or-bake'], notes: 'Milled grain meal is a cooking ingredient, not ready-to-eat food.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-great-mere-reedgrain-fishcake': item({
        id: 'item-great-mere-reedgrain-fishcake', name: 'Reedgrain Perch Fishcake', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food', 'fish', 'grain', 'cooked', 'great-mere'], valueGil: 37,
        sourceId: 'cook-great-mere-reedgrain-fishcake', action: 'craft',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Fully cooked fishcake; ready to eat.' },
        sinks: ['consume', 'trade'],
    }),
    'item-starfen-fen-mussel-cress-pot': item({
        id: 'item-starfen-fen-mussel-cress-pot', name: 'Fen Mussel and Lake Cress Pot', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food', 'shellfish', 'cooked', 'starfen', 'great-mere'], valueGil: 34,
        sourceId: 'cook-starfen-fen-mussel-cress-pot', action: 'craft',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Freshwater mussels are thoroughly cooked in this dish; ready to eat.' },
        sinks: ['consume', 'trade'],
    }),
    'item-great-mere-shell-lime': item({
        id: 'item-great-mere-shell-lime', name: 'Cloudwater Shell Lime', kind: ITEM_KINDS.MATERIAL,
        tags: ['lime', 'mineral', 'binder', 'construction', 'component', 'great-mere'], valueGil: 16,
        sourceId: 'process-great-mere-shell-lime', action: 'process',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'Calcined shell lime for craft and repair; not food.' },
        sinks: ['craftIngredient', 'construction', 'repair', 'trade'],
    }),
    'item-great-mere-fish-creel': item({
        id: 'item-great-mere-fish-creel', name: 'Merewatch Woven Fish Creel', kind: ITEM_KINDS.MATERIAL,
        tags: ['basketry', 'fishing-gear', 'container', 'crafted', 'great-mere'], valueGil: 54,
        sourceId: 'craft-great-mere-fish-creel', action: 'craft',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'Woven fishing gear; not food.' },
        sinks: ['toolUse', 'repair', 'trade'],
    }),
});

export function getGreatMereProductionItem(itemId) {
    const entry = DEFINITIONS[String(itemId ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}

export function listGreatMereProductionItems() {
    return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry));
}

function item({ id, name, kind, tags, valueGil, sourceId, action, consumption, sinks }) {
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
            data: Object.freeze({ catalogVersion: GREAT_MERE_PRODUCTION_ITEM_CATALOG_VERSION }),
        })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        equipmentSlot: null,
        allowedSlots: Object.freeze([]),
        requirements: Object.freeze({ minLevel: 1, allowedJobs: [], allowedRaces: [] }),
        flags: Object.freeze([]),
        modifiers: Object.freeze({}),
        metadata: Object.freeze({
            confidence: 'intentionalSimplification',
            source: 'Hearth & Horizon Great Mere freshwater production',
            notes: 'Original Great Mere intermediate or finished good connected to lake ecology and explicit food-safety metadata.',
        }),
    });
}
