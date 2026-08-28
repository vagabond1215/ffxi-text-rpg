export const GREAT_MERE_PRODUCTION_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'process-great-mere-clean-perch': process({
        id: 'process-great-mere-clean-perch', name: 'Clean Great Mere Silver Perch', kind: 'processing',
        durationSeconds: 120, proficiencyId: 'cooking', proficiencyGain: 1, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-great-mere-silver-perch', quantity: 1 }],
        outputs: [{ itemId: 'item-great-mere-perch-fillet', quantity: 2 }],
    }),
    'cook-great-mere-smoked-perch': process({
        id: 'cook-great-mere-smoked-perch', name: 'Smoke Silver Perch Ration', kind: 'cooking',
        durationSeconds: 300, proficiencyId: 'cooking', minProficiency: 1, proficiencyGain: 2, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-great-mere-perch-fillet', quantity: 1 }, { itemId: 'item-redstone-rock-salt', quantity: 1 }],
        outputs: [{ itemId: 'item-great-mere-smoked-perch-ration', quantity: 2 }],
    }),
    'process-great-mere-clean-pike': process({
        id: 'process-great-mere-clean-pike', name: 'Clean Great Mere Reed Pike', kind: 'processing',
        durationSeconds: 150, proficiencyId: 'cooking', proficiencyGain: 1, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-great-mere-reed-pike', quantity: 1 }],
        outputs: [{ itemId: 'item-great-mere-pike-fillet', quantity: 2 }],
    }),
    'process-great-mere-preservation-brine': process({
        id: 'process-great-mere-preservation-brine', name: 'Mix Merewatch Preservation Brine', kind: 'processing',
        durationSeconds: 120, proficiencyId: 'cooking', proficiencyGain: 1, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-crownfields-cider-vinegar', quantity: 1 }, { itemId: 'item-redstone-rock-salt', quantity: 1 }],
        outputs: [{ itemId: 'item-great-mere-preservation-brine', quantity: 2 }],
    }),
    'cook-great-mere-pickled-pike': process({
        id: 'cook-great-mere-pickled-pike', name: 'Prepare Pickled Reed Pike', kind: 'cooking',
        durationSeconds: 300, proficiencyId: 'cooking', minProficiency: 2, proficiencyGain: 3, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-great-mere-pike-fillet', quantity: 1 }, { itemId: 'item-great-mere-preservation-brine', quantity: 1 }],
        outputs: [{ itemId: 'item-great-mere-pickled-pike', quantity: 2 }],
    }),
    'process-great-mere-clean-crayfish': process({
        id: 'process-great-mere-clean-crayfish', name: 'Clean Blueclaw Crayfish', kind: 'processing',
        durationSeconds: 120, proficiencyId: 'cooking', proficiencyGain: 1, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-great-mere-blueclaw-crayfish', quantity: 2 }],
        outputs: [{ itemId: 'item-great-mere-crayfish-tail-meat', quantity: 2 }],
    }),
    'cook-great-mere-thyme-crayfish': process({
        id: 'cook-great-mere-thyme-crayfish', name: 'Cook Mountain-Thyme Blueclaw Pot', kind: 'cooking',
        durationSeconds: 240, proficiencyId: 'cooking', minProficiency: 1, proficiencyGain: 2, requiredStationTags: ['kitchen'],
        inputs: [
            { itemId: 'item-great-mere-crayfish-tail-meat', quantity: 1 },
            { itemId: 'item-slatewater-mountain-thyme', quantity: 1 },
            { itemId: 'item-redstone-rock-salt', quantity: 1 },
        ],
        outputs: [{ itemId: 'item-great-mere-thyme-crayfish-pot', quantity: 2 }],
    }),
    'process-great-mere-shuck-mussel': process({
        id: 'process-great-mere-shuck-mussel', name: 'Purge and Shuck Cloudwater Mussels', kind: 'processing',
        durationSeconds: 180, proficiencyId: 'cooking', proficiencyGain: 2, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-great-mere-cloudwater-mussel', quantity: 2 }],
        outputs: [
            { itemId: 'item-great-mere-mussel-meat', quantity: 2 },
            { itemId: 'item-great-mere-mussel-shell', quantity: 2 },
        ],
    }),
    'cook-great-mere-cress-mussel-broth': process({
        id: 'cook-great-mere-cress-mussel-broth', name: 'Cook Lake Cress Mussel Broth', kind: 'cooking',
        durationSeconds: 240, proficiencyId: 'cooking', minProficiency: 1, proficiencyGain: 2, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-great-mere-mussel-meat', quantity: 1 }, { itemId: 'item-great-mere-lake-cress', quantity: 1 }],
        outputs: [{ itemId: 'item-great-mere-cress-mussel-broth', quantity: 2 }],
    }),
    'process-great-mere-arrowroot-starch': process({
        id: 'process-great-mere-arrowroot-starch', name: 'Wash Mere Arrowroot Starch', kind: 'processing',
        durationSeconds: 240, proficiencyId: 'cooking', proficiencyGain: 2, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-great-mere-arrowroot-corm', quantity: 2 }],
        outputs: [{ itemId: 'item-great-mere-arrowroot-starch', quantity: 2 }],
    }),
    'cook-great-mere-arrowroot-cake': process({
        id: 'cook-great-mere-arrowroot-cake', name: 'Cook Mere Arrowroot Griddle Cakes', kind: 'cooking',
        durationSeconds: 210, proficiencyId: 'cooking', minProficiency: 1, proficiencyGain: 2, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-great-mere-arrowroot-starch', quantity: 2 }, { itemId: 'item-redstone-rock-salt', quantity: 1 }],
        outputs: [{ itemId: 'item-great-mere-arrowroot-cake', quantity: 2 }],
    }),
    'process-great-mere-detox-bitterflag': process({
        id: 'process-great-mere-detox-bitterflag', name: 'Leach and Boil Bitterflag Starch', kind: 'processing',
        durationSeconds: 420, proficiencyId: 'cooking', minProficiency: 2, proficiencyGain: 3, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-great-mere-bitterflag-rhizome', quantity: 2 }],
        outputs: [{ itemId: 'item-great-mere-bitterflag-starch', quantity: 1 }],
    }),
    'cook-great-mere-fisher-biscuit': process({
        id: 'cook-great-mere-fisher-biscuit', name: 'Bake Merewatch Fisher Biscuits', kind: 'cooking',
        durationSeconds: 270, proficiencyId: 'cooking', minProficiency: 2, proficiencyGain: 3, requiredStationTags: ['kitchen'],
        inputs: [
            { itemId: 'item-great-mere-bitterflag-starch', quantity: 1 },
            { itemId: 'item-crownfields-rye-flour', quantity: 1 },
            { itemId: 'item-redstone-rock-salt', quantity: 1 },
        ],
        outputs: [{ itemId: 'item-great-mere-fisher-biscuit', quantity: 3 }],
    }),
    'process-great-mere-rush-cord': process({
        id: 'process-great-mere-rush-cord', name: 'Twist Great Mere Rush Cord', kind: 'processing',
        durationSeconds: 150, proficiencyId: 'crafting', proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-great-mere-lake-rush-stem', quantity: 2 }],
        outputs: [{ itemId: 'item-great-mere-rush-cord', quantity: 1 }],
    }),
    'craft-great-mere-tarred-net-line': process({
        id: 'craft-great-mere-tarred-net-line', name: 'Tar Merewatch Net Line', kind: 'crafting',
        durationSeconds: 240, proficiencyId: 'crafting', minProficiency: 1, proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-great-mere-rush-cord', quantity: 1 }, { itemId: 'item-slatewater-pitch-pine-resin', quantity: 1 }],
        outputs: [{ itemId: 'item-great-mere-tarred-net-line', quantity: 1 }],
    }),
    'process-great-mere-polish-pearl': process({
        id: 'process-great-mere-polish-pearl', name: 'Polish Cloudwater Pearl', kind: 'processing',
        durationSeconds: 240, proficiencyId: 'crafting', minProficiency: 2, proficiencyGain: 3, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-great-mere-cloudwater-pearl', quantity: 1 }],
        outputs: [{ itemId: 'item-great-mere-polished-cloudwater-pearl', quantity: 1 }],
    }),
    'craft-great-mere-pearl-net-needle': process({
        id: 'craft-great-mere-pearl-net-needle', name: 'Craft Pearl-Set Net Needle', kind: 'crafting',
        durationSeconds: 330, proficiencyId: 'crafting', minProficiency: 3, proficiencyGain: 3, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-great-mere-polished-cloudwater-pearl', quantity: 1 }, { itemId: 'item-redstone-copper-ingot', quantity: 1 }],
        outputs: [{ itemId: 'item-great-mere-pearl-net-needle', quantity: 1 }],
    }),
    'process-starfen-reedgrain-meal': process({
        id: 'process-starfen-reedgrain-meal', name: 'Mill Starfen Reedgrain Meal', kind: 'processing',
        durationSeconds: 180, proficiencyId: 'cooking', proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-starfen-reedgrain', quantity: 2 }],
        outputs: [{ itemId: 'item-starfen-reedgrain-meal', quantity: 2 }],
    }),
    'cook-great-mere-reedgrain-fishcake': process({
        id: 'cook-great-mere-reedgrain-fishcake', name: 'Cook Reedgrain Perch Fishcakes', kind: 'cooking',
        durationSeconds: 240, proficiencyId: 'cooking', minProficiency: 2, proficiencyGain: 3, requiredStationTags: ['kitchen'],
        inputs: [
            { itemId: 'item-starfen-reedgrain-meal', quantity: 1 },
            { itemId: 'item-great-mere-perch-fillet', quantity: 1 },
            { itemId: 'item-great-mere-lake-cress', quantity: 1 },
        ],
        outputs: [{ itemId: 'item-great-mere-reedgrain-fishcake', quantity: 2 }],
    }),
    'cook-starfen-fen-mussel-cress-pot': process({
        id: 'cook-starfen-fen-mussel-cress-pot', name: 'Cook Fen Mussel and Lake Cress Pot', kind: 'cooking',
        durationSeconds: 240, proficiencyId: 'cooking', minProficiency: 1, proficiencyGain: 2, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-starfen-fen-mussel', quantity: 2 }, { itemId: 'item-great-mere-lake-cress', quantity: 1 }],
        outputs: [{ itemId: 'item-starfen-fen-mussel-cress-pot', quantity: 2 }],
    }),
    'process-great-mere-shell-lime': process({
        id: 'process-great-mere-shell-lime', name: 'Burn Cloudwater Shell Lime', kind: 'processing',
        durationSeconds: 360, proficiencyId: 'crafting', minProficiency: 2, proficiencyGain: 3, requiredStationTags: ['forge'],
        inputs: [{ itemId: 'item-great-mere-mussel-shell', quantity: 2 }],
        outputs: [{ itemId: 'item-great-mere-shell-lime', quantity: 1 }],
    }),
    'craft-great-mere-fish-creel': process({
        id: 'craft-great-mere-fish-creel', name: 'Weave Merewatch Fish Creel', kind: 'crafting',
        durationSeconds: 300, proficiencyId: 'crafting', minProficiency: 2, proficiencyGain: 3, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-great-mere-rush-cord', quantity: 2 }, { itemId: 'item-great-mere-tarred-net-line', quantity: 1 }],
        outputs: [{ itemId: 'item-great-mere-fish-creel', quantity: 1 }],
    }),
});

export function getGreatMereProcessDefinition(processId) {
    return DEFINITIONS[String(processId ?? '').trim()] ?? null;
}

export function listGreatMereProcessDefinitions() {
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
        inputs: (definition.inputs ?? []).map((entry) => ({ itemId: String(entry.itemId), quantity: Math.max(1, Math.floor(Number(entry.quantity) || 1)) })),
        outputs: (definition.outputs ?? []).map((entry) => ({ itemId: String(entry.itemId), quantity: Math.max(1, Math.floor(Number(entry.quantity) || 1)) })),
    });
}

function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
}
