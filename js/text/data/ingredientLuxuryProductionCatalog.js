export const INGREDIENT_LUXURY_PRODUCTION_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'process-crownfields-rye-flour': process({
        id: 'process-crownfields-rye-flour', name: 'Mill Crown Rye Flour', kind: 'processing',
        durationSeconds: 180, proficiencyId: 'cooking', proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-crownfields-crown-rye', quantity: 2 }],
        outputs: [{ itemId: 'item-crownfields-rye-flour', quantity: 2 }],
    }),
    'cook-crownfields-rye-loaf': process({
        id: 'cook-crownfields-rye-loaf', name: 'Bake Crown Rye Hearth Loaf', kind: 'cooking',
        durationSeconds: 240, proficiencyId: 'cooking', minProficiency: 1, proficiencyGain: 2, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-crownfields-rye-flour', quantity: 2 }, { itemId: 'item-redstone-rock-salt', quantity: 1 }],
        outputs: [{ itemId: 'item-crownfields-rye-loaf', quantity: 2 }],
    }),
    'process-crownfields-pea-meal': process({
        id: 'process-crownfields-pea-meal', name: 'Grind Field Pea Meal', kind: 'processing',
        durationSeconds: 150, proficiencyId: 'cooking', proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-crownfields-field-pea', quantity: 2 }],
        outputs: [{ itemId: 'item-crownfields-pea-meal', quantity: 2 }],
    }),
    'cook-crownfields-herbed-pea-pottage': process({
        id: 'cook-crownfields-herbed-pea-pottage', name: 'Cook Herbed Field Pea Pottage', kind: 'cooking',
        durationSeconds: 210, proficiencyId: 'cooking', minProficiency: 1, proficiencyGain: 2, requiredStationTags: ['kitchen'],
        inputs: [
            { itemId: 'item-crownfields-pea-meal', quantity: 1 },
            { itemId: 'item-slatewater-mountain-thyme', quantity: 1 },
            { itemId: 'item-redstone-rock-salt', quantity: 1 },
        ],
        outputs: [{ itemId: 'item-crownfields-herbed-pea-pottage', quantity: 2 }],
    }),
    'process-crownfields-flax-thread': process({
        id: 'process-crownfields-flax-thread', name: 'Dress and Spin Crownfields Flax', kind: 'processing',
        durationSeconds: 210, proficiencyId: 'crafting', proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-crownfields-flax-straw', quantity: 2 }],
        outputs: [{ itemId: 'item-crownfields-flax-thread', quantity: 2 }],
    }),
    'process-crownfields-linen-cloth': process({
        id: 'process-crownfields-linen-cloth', name: 'Weave Crownfields Linen Cloth', kind: 'processing',
        durationSeconds: 300, proficiencyId: 'crafting', minProficiency: 1, proficiencyGain: 3, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-crownfields-flax-thread', quantity: 2 }],
        outputs: [{ itemId: 'item-crownfields-linen-cloth', quantity: 1 }],
    }),
    'process-crownfields-woad-pigment': process({
        id: 'process-crownfields-woad-pigment', name: 'Prepare Crownfields Woad Pigment', kind: 'processing',
        durationSeconds: 240, proficiencyId: 'crafting', minProficiency: 1, proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-crownfields-dyers-woad', quantity: 2 }],
        outputs: [{ itemId: 'item-crownfields-woad-pigment', quantity: 1 }],
    }),
    'craft-crownfields-woad-linen': process({
        id: 'craft-crownfields-woad-linen', name: 'Dye Woad-Blue Linen', kind: 'crafting',
        durationSeconds: 300, proficiencyId: 'crafting', minProficiency: 2, proficiencyGain: 3, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-crownfields-linen-cloth', quantity: 1 }, { itemId: 'item-crownfields-woad-pigment', quantity: 1 }],
        outputs: [{ itemId: 'item-crownfields-woad-linen', quantity: 1 }],
    }),
    'process-crownfields-apple-must': process({
        id: 'process-crownfields-apple-must', name: 'Press Cider Apple Must', kind: 'processing',
        durationSeconds: 150, proficiencyId: 'cooking', proficiencyGain: 2, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-crownfields-cider-apple', quantity: 2 }],
        outputs: [{ itemId: 'item-crownfields-apple-must', quantity: 2 }],
    }),
    'cook-crownfields-cider-vinegar': process({
        id: 'cook-crownfields-cider-vinegar', name: 'Prepare Crownfields Cider Vinegar', kind: 'cooking',
        durationSeconds: 240, proficiencyId: 'cooking', minProficiency: 1, proficiencyGain: 2, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-crownfields-apple-must', quantity: 2 }],
        outputs: [{ itemId: 'item-crownfields-cider-vinegar', quantity: 1 }],
    }),

    'process-elderwood-orchid-absolute': process({
        id: 'process-elderwood-orchid-absolute', name: 'Extract Ghost Orchid Absolute', kind: 'processing',
        durationSeconds: 300, proficiencyId: 'crafting', minProficiency: 2, proficiencyGain: 3, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-elderwood-ghost-orchid', quantity: 1 }],
        outputs: [{ itemId: 'item-elderwood-orchid-absolute', quantity: 1 }],
    }),
    'process-elderwood-blackheart-veneer': process({
        id: 'process-elderwood-blackheart-veneer', name: 'Cut Blackheart Fine Veneer', kind: 'processing',
        durationSeconds: 300, proficiencyId: 'crafting', minProficiency: 2, proficiencyGain: 3, requiredStationTags: ['woodshop'],
        inputs: [{ itemId: 'item-elderwood-blackheart-heartwood', quantity: 1 }],
        outputs: [{ itemId: 'item-elderwood-blackheart-veneer', quantity: 2 }],
    }),
    'craft-elderwood-orchid-scent-casket': process({
        id: 'craft-elderwood-orchid-scent-casket', name: 'Craft Orchid-Scented Blackheart Casket', kind: 'crafting',
        durationSeconds: 420, proficiencyId: 'crafting', minProficiency: 3, proficiencyGain: 4, requiredStationTags: ['woodshop'],
        inputs: [
            { itemId: 'item-elderwood-blackheart-veneer', quantity: 2 },
            { itemId: 'item-elderwood-orchid-absolute', quantity: 1 },
            { itemId: 'item-coppergrass-windglass-cabochon', quantity: 1 },
        ],
        outputs: [{ itemId: 'item-elderwood-orchid-scent-casket', quantity: 1 }],
    }),

    'process-redstone-crocus-pigment': process({
        id: 'process-redstone-crocus-pigment', name: 'Prepare Sun Crocus Gold Pigment', kind: 'processing',
        durationSeconds: 240, proficiencyId: 'crafting', minProficiency: 2, proficiencyGain: 3, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-redstone-sun-crocus-stigma', quantity: 1 }],
        outputs: [{ itemId: 'item-redstone-crocus-pigment', quantity: 1 }],
    }),
    'process-redstone-fire-opal-cut': process({
        id: 'process-redstone-fire-opal-cut', name: 'Cut Redstone Fire Opal', kind: 'processing',
        durationSeconds: 300, proficiencyId: 'metalworking', minProficiency: 3, proficiencyGain: 3, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-redstone-fire-opal', quantity: 1 }],
        outputs: [{ itemId: 'item-redstone-cut-fire-opal', quantity: 1 }],
    }),
    'craft-redstone-fire-opal-brooch': process({
        id: 'craft-redstone-fire-opal-brooch', name: 'Set Fire Opal Brooch', kind: 'crafting',
        durationSeconds: 360, proficiencyId: 'metalworking', minProficiency: 3, proficiencyGain: 4, requiredStationTags: ['forge'],
        inputs: [{ itemId: 'item-redstone-cut-fire-opal', quantity: 1 }, { itemId: 'item-redstone-copper-ingot', quantity: 1 }],
        outputs: [{ itemId: 'item-redstone-fire-opal-brooch', quantity: 1 }],
    }),

    'process-starfen-indigo-pigment': process({
        id: 'process-starfen-indigo-pigment', name: 'Prepare Starfen Indigo Pigment', kind: 'processing',
        durationSeconds: 240, proficiencyId: 'crafting', minProficiency: 2, proficiencyGain: 3, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-starfen-indigo-iris-petal', quantity: 2 }],
        outputs: [{ itemId: 'item-starfen-indigo-pigment', quantity: 1 }],
    }),
    'process-starfen-moonlotus-essence': process({
        id: 'process-starfen-moonlotus-essence', name: 'Distill Moonlotus Essence', kind: 'processing',
        durationSeconds: 300, proficiencyId: 'cooking', minProficiency: 2, proficiencyGain: 3, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-starfen-moonlotus-blossom', quantity: 1 }],
        outputs: [{ itemId: 'item-starfen-moonlotus-essence', quantity: 1 }],
    }),
    'craft-starfen-indigo-linen': process({
        id: 'craft-starfen-indigo-linen', name: 'Dye Starfen Indigo Linen', kind: 'crafting',
        durationSeconds: 300, proficiencyId: 'crafting', minProficiency: 3, proficiencyGain: 3, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-crownfields-linen-cloth', quantity: 1 }, { itemId: 'item-starfen-indigo-pigment', quantity: 1 }],
        outputs: [{ itemId: 'item-starfen-indigo-linen', quantity: 1 }],
    }),
    'craft-starfen-moonlotus-orchid-perfume': process({
        id: 'craft-starfen-moonlotus-orchid-perfume', name: 'Blend Moonlotus-Orchid Perfume', kind: 'crafting',
        durationSeconds: 360, proficiencyId: 'crafting', minProficiency: 3, proficiencyGain: 4, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-starfen-moonlotus-essence', quantity: 1 }, { itemId: 'item-elderwood-orchid-absolute', quantity: 1 }],
        outputs: [{ itemId: 'item-starfen-moonlotus-orchid-perfume', quantity: 1 }],
    }),

    'process-coppergrass-madder-pigment': process({
        id: 'process-coppergrass-madder-pigment', name: 'Prepare Coppergrass Crimson Pigment', kind: 'processing',
        durationSeconds: 210, proficiencyId: 'crafting', minProficiency: 1, proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-coppergrass-crimson-madder', quantity: 2 }],
        outputs: [{ itemId: 'item-coppergrass-madder-pigment', quantity: 1 }],
    }),
    'process-coppergrass-windglass-cabochon': process({
        id: 'process-coppergrass-windglass-cabochon', name: 'Shape Windglass Agate Cabochon', kind: 'processing',
        durationSeconds: 270, proficiencyId: 'crafting', minProficiency: 2, proficiencyGain: 3, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-coppergrass-windglass-agate', quantity: 1 }],
        outputs: [{ itemId: 'item-coppergrass-windglass-cabochon', quantity: 1 }],
    }),
    'craft-coppergrass-crimson-linen': process({
        id: 'craft-coppergrass-crimson-linen', name: 'Dye Coppergrass Crimson Linen', kind: 'crafting',
        durationSeconds: 300, proficiencyId: 'crafting', minProficiency: 2, proficiencyGain: 3, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-crownfields-linen-cloth', quantity: 1 }, { itemId: 'item-coppergrass-madder-pigment', quantity: 1 }],
        outputs: [{ itemId: 'item-coppergrass-crimson-linen', quantity: 1 }],
    }),
    'craft-coppergrass-windglass-travel-charm': process({
        id: 'craft-coppergrass-windglass-travel-charm', name: 'Craft Windglass Road Charm', kind: 'crafting',
        durationSeconds: 330, proficiencyId: 'crafting', minProficiency: 3, proficiencyGain: 3, requiredStationTags: ['workshop'],
        inputs: [
            { itemId: 'item-coppergrass-windglass-cabochon', quantity: 1 },
            { itemId: 'item-crownfields-flax-thread', quantity: 1 },
            { itemId: 'item-redstone-copper-ingot', quantity: 1 },
        ],
        outputs: [{ itemId: 'item-coppergrass-windglass-travel-charm', quantity: 1 }],
    }),

    'process-slatewater-lichen-pigment': process({
        id: 'process-slatewater-lichen-pigment', name: 'Prepare Silver Lichen Pigment', kind: 'processing',
        durationSeconds: 240, proficiencyId: 'crafting', minProficiency: 2, proficiencyGain: 3, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-slatewater-silver-lichen', quantity: 1 }],
        outputs: [{ itemId: 'item-slatewater-lichen-pigment', quantity: 1 }],
    }),
    'process-slatewater-blue-slate-tile': process({
        id: 'process-slatewater-blue-slate-tile', name: 'Polish Slatewater Blue Tile', kind: 'processing',
        durationSeconds: 300, proficiencyId: 'crafting', minProficiency: 2, proficiencyGain: 3, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-slatewater-blue-slate', quantity: 1 }],
        outputs: [{ itemId: 'item-slatewater-polished-blue-slate-tile', quantity: 1 }],
    }),
    'process-slatewater-white-clay-slip': process({
        id: 'process-slatewater-white-clay-slip', name: 'Refine Slatewater Fine White Slip', kind: 'processing',
        durationSeconds: 180, proficiencyId: 'crafting', minProficiency: 1, proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-slatewater-white-clay', quantity: 2 }],
        outputs: [{ itemId: 'item-slatewater-fine-white-slip', quantity: 2 }],
    }),
    'craft-slatewater-silver-glaze': process({
        id: 'craft-slatewater-silver-glaze', name: 'Mix Silver Lichen Ceramic Glaze', kind: 'crafting',
        durationSeconds: 270, proficiencyId: 'crafting', minProficiency: 3, proficiencyGain: 3, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-slatewater-lichen-pigment', quantity: 1 }, { itemId: 'item-slatewater-fine-white-slip', quantity: 1 }],
        outputs: [{ itemId: 'item-slatewater-silver-lichen-glaze', quantity: 1 }],
    }),
    'craft-slatewater-glazed-blue-slate-plaque': process({
        id: 'craft-slatewater-glazed-blue-slate-plaque', name: 'Craft Silver-Glazed Blue Slate Plaque', kind: 'crafting',
        durationSeconds: 360, proficiencyId: 'crafting', minProficiency: 3, proficiencyGain: 4, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-slatewater-polished-blue-slate-tile', quantity: 1 }, { itemId: 'item-slatewater-silver-lichen-glaze', quantity: 1 }],
        outputs: [{ itemId: 'item-slatewater-glazed-blue-slate-plaque', quantity: 1 }],
    }),

    'craft-regional-dyers-sample-book': process({
        id: 'craft-regional-dyers-sample-book', name: 'Assemble Five-Region Dyer’s Sample Book', kind: 'crafting',
        durationSeconds: 480, proficiencyId: 'crafting', minProficiency: 4, proficiencyGain: 5, requiredStationTags: ['workshop'],
        inputs: [
            { itemId: 'item-crownfields-linen-cloth', quantity: 1 },
            { itemId: 'item-crownfields-woad-pigment', quantity: 1 },
            { itemId: 'item-redstone-crocus-pigment', quantity: 1 },
            { itemId: 'item-starfen-indigo-pigment', quantity: 1 },
            { itemId: 'item-coppergrass-madder-pigment', quantity: 1 },
            { itemId: 'item-slatewater-lichen-pigment', quantity: 1 },
        ],
        outputs: [{ itemId: 'item-regional-dyers-sample-book', quantity: 1 }],
    }),
});

export function getIngredientLuxuryProcessDefinition(processId) {
    return DEFINITIONS[String(processId ?? '').trim()] ?? null;
}

export function listIngredientLuxuryProcessDefinitions() {
    return Object.values(DEFINITIONS);
}

function process(definition) {
    return deepFreeze({
        id: String(definition.id),
        name: String(definition.name),
        kind: definition.kind,
        durationSeconds: Math.max(1, Math.floor(Number(definition.durationSeconds) || 1)),
        proficiencyId: String(definition.proficiencyId),
        minProficiency: Math.max(0, Math.floor(Number(definition.minProficiency) || 0)),
        proficiencyGain: Math.max(1, Math.floor(Number(definition.proficiencyGain) || 1)),
        requiredToolTags: [...(definition.requiredToolTags ?? [])],
        requiredStationTags: [...(definition.requiredStationTags ?? [])],
        inputs: (definition.inputs ?? []).map((entry) => ({
            itemId: String(entry.itemId),
            quantity: Math.max(1, Math.floor(Number(entry.quantity) || 1)),
        })),
        outputs: (definition.outputs ?? []).map((entry) => ({
            itemId: String(entry.itemId),
            quantity: Math.max(1, Math.floor(Number(entry.quantity) || 1)),
        })),
    });
}

function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
}
