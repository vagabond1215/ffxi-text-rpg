export const OCCUPATIONAL_FIELD_TOOL_PRODUCTION_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'craft-field-knife': process({
        id: 'craft-field-knife',
        name: 'Assemble Field Knife',
        kind: 'crafting',
        durationSeconds: 360,
        proficiencyId: 'metalworking',
        minProficiency: 4,
        proficiencyGain: 3,
        requiredStationTags: ['forge'],
        inputs: [
            { itemId: 'item-material-steel-blade-blank', quantity: 1 },
            { itemId: 'item-material-ash-handle-blank', quantity: 1 },
            { itemId: 'item-material-iron-ferrule-socket-set', quantity: 1 },
        ],
        outputs: [{ itemId: 'field-knife', quantity: 1 }],
    }),
    'craft-prospector-pick': process({
        id: 'craft-prospector-pick',
        name: 'Fit Prospector Pick',
        kind: 'crafting',
        durationSeconds: 360,
        proficiencyId: 'metalworking',
        minProficiency: 3,
        proficiencyGain: 3,
        requiredStationTags: ['forge'],
        inputs: [
            { itemId: 'item-material-iron-tool-head-blank', quantity: 1 },
            { itemId: 'item-material-ash-handle-blank', quantity: 1 },
            { itemId: 'item-material-iron-ferrule-socket-set', quantity: 1 },
        ],
        outputs: [{ itemId: 'prospector-pick', quantity: 1 }],
    }),
    'craft-woodsman-hatchet': process({
        id: 'craft-woodsman-hatchet',
        name: 'Fit Woodsman Hatchet',
        kind: 'crafting',
        durationSeconds: 330,
        proficiencyId: 'metalworking',
        minProficiency: 3,
        proficiencyGain: 3,
        requiredStationTags: ['forge'],
        inputs: [
            { itemId: 'item-material-iron-tool-head-blank', quantity: 1 },
            { itemId: 'item-material-ash-handle-blank', quantity: 1 },
            { itemId: 'item-material-iron-ferrule-socket-set', quantity: 1 },
        ],
        outputs: [{ itemId: 'woodsman-hatchet', quantity: 1 }],
    }),
    'craft-digging-spade': process({
        id: 'craft-digging-spade',
        name: 'Fit Digging Spade',
        kind: 'crafting',
        durationSeconds: 390,
        proficiencyId: 'metalworking',
        minProficiency: 3,
        proficiencyGain: 3,
        requiredStationTags: ['forge'],
        inputs: [
            { itemId: 'item-material-iron-tool-head-blank', quantity: 1 },
            { itemId: 'item-material-ash-handle-blank', quantity: 1 },
            { itemId: 'item-material-iron-ferrule-socket-set', quantity: 1 },
        ],
        outputs: [{ itemId: 'digging-spade', quantity: 1 }],
    }),
    'craft-reed-sickle': process({
        id: 'craft-reed-sickle',
        name: 'Assemble Reed Sickle',
        kind: 'crafting',
        durationSeconds: 300,
        proficiencyId: 'metalworking',
        minProficiency: 3,
        proficiencyGain: 3,
        requiredStationTags: ['forge'],
        inputs: [
            { itemId: 'item-material-steel-blade-blank', quantity: 1 },
            { itemId: 'item-material-ash-handle-blank', quantity: 1 },
            { itemId: 'item-material-iron-ferrule-socket-set', quantity: 1 },
        ],
        outputs: [{ itemId: 'reed-sickle', quantity: 1 }],
    }),
    'craft-marsh-fishing-rod': process({
        id: 'craft-marsh-fishing-rod',
        name: 'Rig Marsh Fishing Rod',
        kind: 'crafting',
        durationSeconds: 360,
        proficiencyId: 'crafting',
        minProficiency: 2,
        proficiencyGain: 3,
        requiredToolTags: ['cutting'],
        requiredStationTags: ['workshop'],
        inputs: [
            { itemId: 'item-material-giant-cane-poles', quantity: 1 },
            { itemId: 'item-material-hemp-twine', quantity: 1 },
            { itemId: 'item-material-iron-ferrule-socket-set', quantity: 1 },
        ],
        outputs: [{ itemId: 'marsh-rod', quantity: 1 }],
    }),
});

export function getOccupationalFieldToolProcessDefinition(id) {
    return DEFINITIONS[String(id ?? '').trim()] ?? null;
}

export function listOccupationalFieldToolProcessDefinitions() {
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
        inputs: definition.inputs.map((entry) => ({
            itemId: String(entry.itemId),
            quantity: Math.max(1, Math.floor(Number(entry.quantity) || 1)),
        })),
        outputs: definition.outputs.map((entry) => ({
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
