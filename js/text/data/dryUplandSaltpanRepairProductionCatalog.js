export const DRY_UPLAND_SALTPAN_REPAIR_PRODUCTION_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'craft-redstone-bunchgrass-thatch-mat': process({
        id: 'craft-redstone-bunchgrass-thatch-mat', name: 'Bind Sunbent Bunchgrass Thatch Mat', kind: 'crafting',
        durationSeconds: 210, proficiencyId: 'crafting', proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-redstone-sunbent-bunchgrass', quantity: 2 }],
        outputs: [{ itemId: 'item-redstone-bunchgrass-thatch-mat', quantity: 1 }],
    }),
    'cook-redstone-stone-thyme-infusion': process({
        id: 'cook-redstone-stone-thyme-infusion', name: 'Steep Stone-Thyme Infusion', kind: 'cooking',
        durationSeconds: 120, proficiencyId: 'cooking', proficiencyGain: 1, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-redstone-stone-thyme', quantity: 1 }],
        outputs: [{ itemId: 'item-redstone-stone-thyme-infusion', quantity: 1 }],
    }),
    'process-redstone-drythorn-resin-sealant': process({
        id: 'process-redstone-drythorn-resin-sealant', name: 'Cook Drythorn Resin Sealant', kind: 'processing',
        durationSeconds: 180, proficiencyId: 'crafting', proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-redstone-drythorn-resin', quantity: 2 }],
        outputs: [{ itemId: 'item-redstone-drythorn-resin-sealant', quantity: 1 }],
    }),
    'cook-redstone-juniper-millet-pot': process({
        id: 'cook-redstone-juniper-millet-pot', name: 'Cook Juniper-Millet Pot', kind: 'cooking',
        durationSeconds: 180, proficiencyId: 'cooking', proficiencyGain: 2, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-redstone-wind-juniper-berry', quantity: 1 }, { itemId: 'item-redstone-ridge-millet', quantity: 1 }],
        outputs: [{ itemId: 'item-redstone-juniper-millet-pot', quantity: 1 }],
    }),
    'process-redstone-ridge-yarrow-field-wash': process({
        id: 'process-redstone-ridge-yarrow-field-wash', name: 'Steep Ridge Yarrow Field Wash', kind: 'processing',
        durationSeconds: 150, proficiencyId: 'cooking', proficiencyGain: 1, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-redstone-ridge-yarrow', quantity: 2 }],
        outputs: [{ itemId: 'item-redstone-ridge-yarrow-field-wash', quantity: 1 }],
    }),
    'cook-emberwash-saltbrush-pot-greens': process({
        id: 'cook-emberwash-saltbrush-pot-greens', name: 'Cook Saltbrush Pot Greens', kind: 'cooking',
        durationSeconds: 180, proficiencyId: 'cooking', proficiencyGain: 2, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-emberwash-saltbrush-shoot', quantity: 2 }],
        outputs: [{ itemId: 'item-emberwash-saltbrush-pot-greens', quantity: 1 }],
    }),
    'craft-emberwash-saltgrass-shade-mat': process({
        id: 'craft-emberwash-saltgrass-shade-mat', name: 'Weave Saltgrass Shade Mat', kind: 'crafting',
        durationSeconds: 240, proficiencyId: 'crafting', proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-emberwash-saltgrass-fiber', quantity: 2 }],
        outputs: [{ itemId: 'item-emberwash-saltgrass-shade-mat', quantity: 1 }],
    }),
    'process-emberwash-panbloom-dye-bath': process({
        id: 'process-emberwash-panbloom-dye-bath', name: 'Prepare Panbloom Dye Bath', kind: 'processing',
        durationSeconds: 210, proficiencyId: 'crafting', proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-emberwash-panbloom-petal', quantity: 2 }],
        outputs: [{ itemId: 'item-emberwash-panbloom-dye-bath', quantity: 1 }],
    }),
});

export function getDryUplandSaltpanRepairProcessDefinition(id) { return DEFINITIONS[String(id ?? '').trim()] ?? null; }
export function listDryUplandSaltpanRepairProcessDefinitions() { return Object.values(DEFINITIONS); }

function process(definition) {
    return freeze({
        id: definition.id, name: definition.name, kind: definition.kind,
        durationSeconds: definition.durationSeconds, proficiencyId: definition.proficiencyId,
        minProficiency: definition.minProficiency ?? 0, proficiencyGain: definition.proficiencyGain,
        requiredToolTags: [...(definition.requiredToolTags ?? [])],
        requiredStationTags: [...(definition.requiredStationTags ?? [])],
        inputs: definition.inputs.map((entry) => ({ ...entry })),
        outputs: definition.outputs.map((entry) => ({ ...entry })),
    });
}
function freeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) freeze(child);
    return Object.freeze(value);
}
