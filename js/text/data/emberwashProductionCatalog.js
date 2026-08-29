export const EMBERWASH_PRODUCTION_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'process-emberwash-emberpod-meal': process({
        id: 'process-emberwash-emberpod-meal', name: 'Grind Emberpod Meal', kind: 'processing', durationSeconds: 180,
        proficiencyId: 'cooking', proficiencyGain: 1, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-emberwash-emberpod', quantity: 2 }],
        outputs: [{ itemId: 'item-emberwash-emberpod-meal', quantity: 2 }],
    }),
    'cook-emberwash-trail-cakes': process({
        id: 'cook-emberwash-trail-cakes', name: 'Bake Emberpod Trail Cakes', kind: 'cooking', durationSeconds: 240,
        proficiencyId: 'cooking', minProficiency: 1, proficiencyGain: 2, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-emberwash-emberpod-meal', quantity: 2 }, { itemId: 'item-redstone-rock-salt', quantity: 1 }],
        outputs: [{ itemId: 'item-emberwash-trail-cakes', quantity: 2 }],
    }),
    'process-emberwash-dry-cinder-pear': process({
        id: 'process-emberwash-dry-cinder-pear', name: 'Dry Cinder Pear Strips', kind: 'processing', durationSeconds: 210,
        proficiencyId: 'cooking', proficiencyGain: 1, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-emberwash-cinder-pear', quantity: 2 }],
        outputs: [{ itemId: 'item-emberwash-dried-cinder-pear', quantity: 2 }],
    }),
    'process-emberwash-dry-desert-sage': process({
        id: 'process-emberwash-dry-desert-sage', name: 'Dry Emberwash Desert Sage', kind: 'processing', durationSeconds: 180,
        proficiencyId: 'crafting', proficiencyGain: 1, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-emberwash-desert-sage', quantity: 2 }],
        outputs: [{ itemId: 'item-emberwash-dried-desert-sage', quantity: 2 }],
    }),
    'process-emberwash-cinderbrush-cord': process({
        id: 'process-emberwash-cinderbrush-cord', name: 'Twist Cinderbrush Cord', kind: 'processing', durationSeconds: 240,
        proficiencyId: 'crafting', proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-emberwash-cinderbrush-fiber', quantity: 2 }],
        outputs: [{ itemId: 'item-emberwash-cinderbrush-cord', quantity: 1 }],
    }),
    'process-emberwash-caravan-salt': process({
        id: 'process-emberwash-caravan-salt', name: 'Refine Emberwash Caravan Salt', kind: 'processing', durationSeconds: 240,
        proficiencyId: 'crafting', proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-emberwash-salt-crust', quantity: 2 }],
        outputs: [{ itemId: 'item-emberwash-caravan-salt', quantity: 1 }],
    }),
    'process-emberwash-red-ochre-pigment': process({
        id: 'process-emberwash-red-ochre-pigment', name: 'Grind Emberwash Red Ochre Pigment', kind: 'processing', durationSeconds: 210,
        proficiencyId: 'crafting', proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-emberwash-red-ochre', quantity: 2 }],
        outputs: [{ itemId: 'item-emberwash-red-ochre-pigment', quantity: 1 }],
    }),
    'process-emberwash-gypsum-plaster': process({
        id: 'process-emberwash-gypsum-plaster', name: 'Burn Emberwash Gypsum Plaster', kind: 'processing', durationSeconds: 300,
        proficiencyId: 'crafting', minProficiency: 1, proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-emberwash-gypsum-nodule', quantity: 2 }],
        outputs: [{ itemId: 'item-emberwash-gypsum-plaster', quantity: 1 }],
    }),
    'craft-emberwash-dustwrap-repair-kit': process({
        id: 'craft-emberwash-dustwrap-repair-kit', name: 'Assemble Emberwash Dustwrap Repair Kit', kind: 'crafting', durationSeconds: 300,
        proficiencyId: 'crafting', minProficiency: 2, proficiencyGain: 3, requiredStationTags: ['workshop'],
        inputs: [
            { itemId: 'item-emberwash-cinderbrush-cord', quantity: 1 },
            { itemId: 'item-crownfields-linen-cloth', quantity: 1 },
            { itemId: 'item-emberwash-dried-desert-sage', quantity: 1 },
        ],
        outputs: [{ itemId: 'item-emberwash-dustwrap-repair-kit', quantity: 1 }],
    }),
    'craft-emberwash-cistern-patch': process({
        id: 'craft-emberwash-cistern-patch', name: 'Mix Cinderwell Cistern Patch Compound', kind: 'crafting', durationSeconds: 300,
        proficiencyId: 'crafting', minProficiency: 2, proficiencyGain: 3, requiredStationTags: ['workshop'],
        inputs: [
            { itemId: 'item-emberwash-gypsum-plaster', quantity: 1 },
            { itemId: 'item-emberwash-cinderbrush-cord', quantity: 1 },
            { itemId: 'item-emberwash-red-ochre-pigment', quantity: 1 },
        ],
        outputs: [{ itemId: 'item-emberwash-cistern-patch-compound', quantity: 1 }],
    }),
});

export function getEmberwashProcessDefinition(id) {
    return DEFINITIONS[String(id ?? '').trim()] ?? null;
}

export function listEmberwashProcessDefinitions() {
    return Object.values(DEFINITIONS);
}

function process(definition) {
    return deepFreeze({
        id: definition.id,
        name: definition.name,
        kind: definition.kind,
        durationSeconds: definition.durationSeconds,
        proficiencyId: definition.proficiencyId,
        minProficiency: definition.minProficiency ?? 0,
        proficiencyGain: definition.proficiencyGain,
        requiredToolTags: [...(definition.requiredToolTags ?? [])],
        requiredStationTags: [...(definition.requiredStationTags ?? [])],
        inputs: definition.inputs.map((entry) => ({ ...entry })),
        outputs: definition.outputs.map((entry) => ({ ...entry })),
    });
}

function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
}
