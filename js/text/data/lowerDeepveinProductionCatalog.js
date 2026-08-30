export const LOWER_DEEPVEIN_PRODUCTION_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'cook-lower-deepvein-lampcaps': process({
        id: 'cook-lower-deepvein-lampcaps', name: 'Cook Lower Deepvein Lampcaps', kind: 'cooking', durationSeconds: 210,
        proficiencyId: 'cooking', proficiencyGain: 2, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-lower-deepvein-lampcap', quantity: 2 }],
        outputs: [{ itemId: 'item-lower-deepvein-cooked-lampcaps', quantity: 2 }],
    }),
    'process-lower-deepvein-clean-threadfin': process({
        id: 'process-lower-deepvein-clean-threadfin', name: 'Clean Threadfin Cavefish', kind: 'processing', durationSeconds: 120,
        proficiencyId: 'cooking', proficiencyGain: 1, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-lower-deepvein-threadfin', quantity: 1 }],
        outputs: [{ itemId: 'item-lower-deepvein-threadfin-fillet', quantity: 2 }],
    }),
    'cook-lower-deepvein-salt-baked-threadfin': process({
        id: 'cook-lower-deepvein-salt-baked-threadfin', name: 'Bake Deepvein Salt Threadfin', kind: 'cooking', durationSeconds: 270,
        proficiencyId: 'cooking', minProficiency: 1, proficiencyGain: 2, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-lower-deepvein-threadfin-fillet', quantity: 1 }, { itemId: 'item-lower-deepvein-refined-cave-salt', quantity: 1 }],
        outputs: [{ itemId: 'item-lower-deepvein-salt-baked-threadfin', quantity: 2 }],
    }),
    'cook-lower-deepvein-blind-sump-crab': process({
        id: 'cook-lower-deepvein-blind-sump-crab', name: 'Boil Blind Sump Crab', kind: 'cooking', durationSeconds: 240,
        proficiencyId: 'cooking', proficiencyGain: 2, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-lower-deepvein-blind-sump-crab', quantity: 2 }],
        outputs: [{ itemId: 'item-lower-deepvein-boiled-sump-crab', quantity: 2 }],
    }),
    'process-lower-deepvein-glowmoss-wick-cord': process({
        id: 'process-lower-deepvein-glowmoss-wick-cord', name: 'Twist Glowmoss Wick Cord', kind: 'processing', durationSeconds: 180,
        proficiencyId: 'crafting', proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-lower-deepvein-glowmoss-fiber', quantity: 2 }],
        outputs: [{ itemId: 'item-lower-deepvein-glowmoss-wick-cord', quantity: 1 }],
    }),
    'process-lower-deepvein-refine-cave-salt': process({
        id: 'process-lower-deepvein-refine-cave-salt', name: 'Refine Deepvein Cave Salt', kind: 'processing', durationSeconds: 210,
        proficiencyId: 'crafting', proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-lower-deepvein-cave-salt-bloom', quantity: 2 }],
        outputs: [{ itemId: 'item-lower-deepvein-refined-cave-salt', quantity: 1 }],
    }),
    'process-lower-deepvein-polish-quartz': process({
        id: 'process-lower-deepvein-polish-quartz', name: 'Polish Deepvein Quartz', kind: 'processing', durationSeconds: 240,
        proficiencyId: 'crafting', minProficiency: 1, proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-lower-deepvein-quartz-cluster', quantity: 1 }],
        outputs: [{ itemId: 'item-lower-deepvein-polished-quartz', quantity: 1 }],
    }),
    'process-lower-deepvein-fire-lamp-cup': process({
        id: 'process-lower-deepvein-fire-lamp-cup', name: 'Fire Sump-Clay Lamp Cup', kind: 'processing', durationSeconds: 300,
        proficiencyId: 'crafting', minProficiency: 1, proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-lower-deepvein-sump-clay', quantity: 2 }],
        outputs: [{ itemId: 'item-lower-deepvein-fired-lamp-cup', quantity: 1 }],
    }),
    'craft-lower-deepvein-reflector-lamp-kit': process({
        id: 'craft-lower-deepvein-reflector-lamp-kit', name: 'Assemble Deepvein Reflector Lamp Kit', kind: 'crafting', durationSeconds: 300,
        proficiencyId: 'crafting', minProficiency: 2, proficiencyGain: 3, requiredStationTags: ['workshop'],
        inputs: [
            { itemId: 'item-lower-deepvein-fired-lamp-cup', quantity: 1 },
            { itemId: 'item-lower-deepvein-glowmoss-wick-cord', quantity: 1 },
            { itemId: 'item-lower-deepvein-polished-quartz', quantity: 1 },
        ],
        outputs: [{ itemId: 'item-lower-deepvein-reflector-lamp-kit', quantity: 1 }],
    }),
    'craft-lower-deepvein-gallery-seep-packing': process({
        id: 'craft-lower-deepvein-gallery-seep-packing', name: 'Pack Deepvein Gallery Seep Seal', kind: 'crafting', durationSeconds: 240,
        proficiencyId: 'crafting', minProficiency: 1, proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-lower-deepvein-glowmoss-fiber', quantity: 1 }, { itemId: 'item-lower-deepvein-sump-clay', quantity: 1 }],
        outputs: [{ itemId: 'item-lower-deepvein-gallery-seep-packing', quantity: 1 }],
    }),
});

export function getLowerDeepveinProcessDefinition(id) {
    return DEFINITIONS[String(id ?? '').trim()] ?? null;
}

export function listLowerDeepveinProcessDefinitions() {
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
