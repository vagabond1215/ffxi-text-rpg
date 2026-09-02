export const STARTER_CASTER_OFFHAND_PRODUCTION_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'craft-ash-staff': process({
        id: 'craft-ash-staff',
        name: 'Shape Ash Staff',
        kind: 'crafting',
        durationSeconds: 360,
        proficiencyId: 'crafting',
        minProficiency: 2,
        proficiencyGain: 3,
        requiredToolTags: ['cutting'],
        requiredStationTags: ['woodshop'],
        inputs: [
            { itemId: 'item-elderwood-ash-timber', quantity: 1 },
            { itemId: 'item-material-hemp-twine', quantity: 1 },
            { itemId: 'item-material-hide-glue', quantity: 1 },
        ],
        outputs: [{ itemId: 'ash-staff', quantity: 1 }],
    }),
    'craft-maple-wand': process({
        id: 'craft-maple-wand',
        name: 'Craft Maple Wand',
        kind: 'crafting',
        durationSeconds: 300,
        proficiencyId: 'crafting',
        minProficiency: 2,
        proficiencyGain: 3,
        requiredToolTags: ['cutting'],
        requiredStationTags: ['woodshop'],
        inputs: [
            { itemId: 'item-material-maple-fine-board', quantity: 1 },
            { itemId: 'item-material-brass-sheet', quantity: 1 },
            { itemId: 'item-material-hide-glue', quantity: 1 },
        ],
        outputs: [{ itemId: 'maple-wand', quantity: 1 }],
    }),
    'craft-iron-buckler': process({
        id: 'craft-iron-buckler',
        name: 'Forge Iron Buckler',
        kind: 'crafting',
        durationSeconds: 420,
        proficiencyId: 'metalworking',
        minProficiency: 3,
        proficiencyGain: 4,
        requiredStationTags: ['forge'],
        inputs: [
            { itemId: 'item-redstone-tempered-iron-bar', quantity: 1 },
            { itemId: 'item-redstone-rivet-set', quantity: 1 },
            { itemId: 'item-material-hemp-cord', quantity: 1 },
        ],
        outputs: [{ itemId: 'iron-buckler', quantity: 1 }],
    }),
    'craft-brass-ring': process({
        id: 'craft-brass-ring',
        name: 'Forge Brass Ring',
        kind: 'crafting',
        durationSeconds: 180,
        proficiencyId: 'metalworking',
        minProficiency: 2,
        proficiencyGain: 2,
        requiredStationTags: ['forge'],
        inputs: [
            { itemId: 'item-material-brass-ingot', quantity: 1 },
        ],
        outputs: [{ itemId: 'brass-ring', quantity: 1 }],
    }),
});

export function getStarterCasterOffhandProcessDefinition(id) {
    return DEFINITIONS[String(id ?? '').trim()] ?? null;
}

export function listStarterCasterOffhandProcessDefinitions() {
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
