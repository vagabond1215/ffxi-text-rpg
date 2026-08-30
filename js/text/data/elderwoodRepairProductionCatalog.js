export const ELDERWOOD_REPAIR_PRODUCTION_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'cook-elderwood-sorrel-crabapple-relish': process({
        id: 'cook-elderwood-sorrel-crabapple-relish', name: 'Prepare Sorrel-Crabapple Relish', kind: 'cooking',
        durationSeconds: 150, proficiencyId: 'cooking', proficiencyGain: 2, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-elderwood-wood-sorrel', quantity: 1 }, { itemId: 'item-elderwood-crabapple', quantity: 1 }],
        outputs: [{ itemId: 'item-elderwood-sorrel-crabapple-relish', quantity: 2 }],
    }),
    'process-elderwood-wayleaf-field-wash': process({
        id: 'process-elderwood-wayleaf-field-wash', name: 'Steep Wayleaf Field Wash', kind: 'processing',
        durationSeconds: 180, proficiencyId: 'cooking', proficiencyGain: 2, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-elderwood-wayleaf', quantity: 2 }],
        outputs: [{ itemId: 'item-elderwood-wayleaf-field-wash', quantity: 1 }],
    }),
    'process-elderwood-bluebell-dye-bath': process({
        id: 'process-elderwood-bluebell-dye-bath', name: 'Prepare Bluebell Dye Bath', kind: 'processing',
        durationSeconds: 210, proficiencyId: 'crafting', proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-elderwood-bluebell-petal', quantity: 2 }],
        outputs: [{ itemId: 'item-elderwood-bluebell-dye-bath', quantity: 1 }],
    }),
    'cook-timbercross-river-mint-tea': process({
        id: 'cook-timbercross-river-mint-tea', name: 'Brew River-Mint Tea', kind: 'cooking',
        durationSeconds: 120, proficiencyId: 'cooking', proficiencyGain: 1, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-timbercross-river-mint', quantity: 1 }],
        outputs: [{ itemId: 'item-timbercross-river-mint-tea', quantity: 1 }],
    }),
    'craft-timbercross-willowherb-poultice': process({
        id: 'craft-timbercross-willowherb-poultice', name: 'Prepare Willowherb Poultice', kind: 'crafting',
        durationSeconds: 180, proficiencyId: 'crafting', proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-timbercross-willowherb', quantity: 2 }],
        outputs: [{ itemId: 'item-timbercross-willowherb-poultice', quantity: 1 }],
    }),
    'craft-timbercross-sedge-mat': process({
        id: 'craft-timbercross-sedge-mat', name: 'Weave Landing Sedge Mat', kind: 'crafting',
        durationSeconds: 240, proficiencyId: 'crafting', proficiencyGain: 2, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-timbercross-sedge-fiber', quantity: 2 }],
        outputs: [{ itemId: 'item-timbercross-sedge-mat', quantity: 1 }],
    }),
    'cook-timbercross-river-currant-compote': process({
        id: 'cook-timbercross-river-currant-compote', name: 'Cook River Currant Compote', kind: 'cooking',
        durationSeconds: 180, proficiencyId: 'cooking', proficiencyGain: 2, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-timbercross-river-currant', quantity: 2 }],
        outputs: [{ itemId: 'item-timbercross-river-currant-compote', quantity: 1 }],
    }),
    'process-timbercross-clean-bronze-dace': process({
        id: 'process-timbercross-clean-bronze-dace', name: 'Clean and Dress Bronze Dace', kind: 'processing',
        durationSeconds: 120, proficiencyId: 'cooking', proficiencyGain: 1, requiredToolTags: ['cutting'], requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-timbercross-bronze-dace', quantity: 1 }],
        outputs: [{ itemId: 'item-timbercross-cleaned-bronze-dace', quantity: 1 }],
    }),
    'cook-timbercross-minted-dace-pot': process({
        id: 'cook-timbercross-minted-dace-pot', name: 'Cook Minted Bronze Dace Pot', kind: 'cooking',
        durationSeconds: 210, proficiencyId: 'cooking', proficiencyGain: 2, requiredStationTags: ['kitchen'],
        inputs: [{ itemId: 'item-timbercross-cleaned-bronze-dace', quantity: 1 }, { itemId: 'item-timbercross-river-mint', quantity: 1 }],
        outputs: [{ itemId: 'item-timbercross-minted-dace-pot', quantity: 1 }],
    }),
    'process-thornwall-cistern-moss-packing': process({
        id: 'process-thornwall-cistern-moss-packing', name: 'Clean Cistern Moss Packing', kind: 'processing',
        durationSeconds: 180, proficiencyId: 'crafting', proficiencyGain: 1, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-thornwall-cistern-moss', quantity: 2 }],
        outputs: [{ itemId: 'item-thornwall-clean-cistern-moss-packing', quantity: 1 }],
    }),
    'process-thornwall-gaol-fungus-tinder': process({
        id: 'process-thornwall-gaol-fungus-tinder', name: 'Dry Gaol Fungus Tinder', kind: 'processing',
        durationSeconds: 180, proficiencyId: 'crafting', proficiencyGain: 1, requiredStationTags: ['workshop'],
        inputs: [{ itemId: 'item-thornwall-gaol-shelf-fungus', quantity: 2 }],
        outputs: [{ itemId: 'item-thornwall-dried-gaol-fungus-tinder', quantity: 1 }],
    }),
});

export function getElderwoodRepairProcessDefinition(id) { return DEFINITIONS[String(id ?? '').trim()] ?? null; }
export function listElderwoodRepairProcessDefinitions() { return Object.values(DEFINITIONS); }

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
