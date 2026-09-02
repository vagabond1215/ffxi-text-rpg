export const REMAINING_BRONZE_STARTER_PRODUCTION_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'craft-bronze-axe': process({
        id: 'craft-bronze-axe',
        name: 'Forge Bronze Axe',
        kind: 'crafting',
        durationSeconds: 390,
        proficiencyId: 'metalworking',
        minProficiency: 2,
        proficiencyGain: 3,
        requiredStationTags: ['forge'],
        inputs: [
            { itemId: 'item-material-bronze-ingot', quantity: 1 },
            { itemId: 'item-material-ash-handle-blank', quantity: 1 },
            { itemId: 'item-material-hemp-twine', quantity: 1 },
        ],
        outputs: [{ itemId: 'bronze-axe', quantity: 1 }],
    }),
    'craft-bronze-dagger': process({
        id: 'craft-bronze-dagger',
        name: 'Forge Bronze Dagger',
        kind: 'crafting',
        durationSeconds: 270,
        proficiencyId: 'metalworking',
        minProficiency: 2,
        proficiencyGain: 3,
        requiredStationTags: ['forge'],
        inputs: [
            { itemId: 'item-material-bronze-ingot', quantity: 1 },
            { itemId: 'item-material-ash-handle-blank', quantity: 1 },
            { itemId: 'item-material-hemp-twine', quantity: 1 },
        ],
        outputs: [{ itemId: 'bronze-dagger', quantity: 1 }],
    }),
    'craft-bronze-pick': process({
        id: 'craft-bronze-pick',
        name: 'Forge Bronze Combat Pick',
        kind: 'crafting',
        durationSeconds: 390,
        proficiencyId: 'metalworking',
        minProficiency: 2,
        proficiencyGain: 3,
        requiredStationTags: ['forge'],
        inputs: [
            { itemId: 'item-material-bronze-ingot', quantity: 1 },
            { itemId: 'item-material-ash-handle-blank', quantity: 1 },
            { itemId: 'item-material-iron-ferrule-socket-set', quantity: 1 },
        ],
        outputs: [{ itemId: 'bronze-pick', quantity: 1 }],
    }),
    'craft-bronze-subligar': process({
        id: 'craft-bronze-subligar',
        name: 'Assemble Bronze Subligar',
        kind: 'crafting',
        durationSeconds: 360,
        proficiencyId: 'metalworking',
        minProficiency: 2,
        proficiencyGain: 3,
        requiredToolTags: ['cutting'],
        requiredStationTags: ['forge'],
        inputs: [
            { itemId: 'item-material-bronze-sheet', quantity: 1 },
            { itemId: 'item-material-hemp-canvas', quantity: 1 },
            { itemId: 'item-material-iron-buckle-ring-set', quantity: 1 },
        ],
        outputs: [{ itemId: 'bronze-subligar', quantity: 1 }],
    }),
    'craft-bronze-mittens': process({
        id: 'craft-bronze-mittens',
        name: 'Assemble Bronze Mittens',
        kind: 'crafting',
        durationSeconds: 330,
        proficiencyId: 'metalworking',
        minProficiency: 2,
        proficiencyGain: 3,
        requiredToolTags: ['cutting'],
        requiredStationTags: ['forge'],
        inputs: [
            { itemId: 'item-material-bronze-sheet', quantity: 1 },
            { itemId: 'item-material-hemp-canvas', quantity: 1 },
        ],
        outputs: [{ itemId: 'bronze-mittens', quantity: 1 }],
    }),
});

export function getRemainingBronzeStarterProcessDefinition(id) {
    return DEFINITIONS[String(id ?? '').trim()] ?? null;
}

export function listRemainingBronzeStarterProcessDefinitions() {
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
