export const STARTER_BRONZE_MARTIAL_PRODUCTION_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'craft-bronze-sword': process({
        id: 'craft-bronze-sword',
        name: 'Forge Bronze Sword',
        kind: 'crafting',
        durationSeconds: 360,
        proficiencyId: 'metalworking',
        minProficiency: 2,
        proficiencyGain: 3,
        requiredStationTags: ['forge'],
        inputs: [
            { itemId: 'item-material-bronze-ingot', quantity: 1 },
            { itemId: 'item-material-ash-handle-blank', quantity: 1 },
            { itemId: 'item-material-hemp-twine', quantity: 1 },
        ],
        outputs: [{ itemId: 'bronze-sword', quantity: 1 }],
    }),
    'craft-bronze-cap': process({
        id: 'craft-bronze-cap',
        name: 'Shape Bronze Cap',
        kind: 'crafting',
        durationSeconds: 330,
        proficiencyId: 'metalworking',
        minProficiency: 2,
        proficiencyGain: 3,
        requiredStationTags: ['forge'],
        inputs: [
            { itemId: 'item-material-bronze-sheet', quantity: 1 },
            { itemId: 'item-material-hemp-canvas', quantity: 1 },
        ],
        outputs: [{ itemId: 'bronze-cap', quantity: 1 }],
    }),
    'craft-bronze-harness': process({
        id: 'craft-bronze-harness',
        name: 'Assemble Bronze Harness',
        kind: 'crafting',
        durationSeconds: 480,
        proficiencyId: 'metalworking',
        minProficiency: 3,
        proficiencyGain: 4,
        requiredToolTags: ['cutting'],
        requiredStationTags: ['forge'],
        inputs: [
            { itemId: 'item-material-bronze-sheet', quantity: 2 },
            { itemId: 'item-material-hemp-canvas', quantity: 1 },
            { itemId: 'item-material-iron-buckle-ring-set', quantity: 1 },
        ],
        outputs: [{ itemId: 'bronze-harness', quantity: 1 }],
    }),
});

export function getStarterBronzeMartialProcessDefinition(id) {
    return DEFINITIONS[String(id ?? '').trim()] ?? null;
}

export function listStarterBronzeMartialProcessDefinitions() {
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
