export const BASIC_LEATHER_GARMENT_PRODUCTION_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'craft-leather-vest': process({
        id: 'craft-leather-vest',
        name: 'Stitch Leather Vest',
        kind: 'crafting',
        durationSeconds: 360,
        proficiencyId: 'crafting',
        minProficiency: 3,
        proficiencyGain: 3,
        requiredToolTags: ['cutting'],
        requiredStationTags: ['tannery'],
        inputs: [
            { itemId: 'item-elderwood-tanned-hide', quantity: 2 },
            { itemId: 'item-elderwood-hide-binding', quantity: 1 },
        ],
        outputs: [{ itemId: 'leather-vest', quantity: 1 }],
    }),
    'craft-leather-trousers': process({
        id: 'craft-leather-trousers',
        name: 'Stitch Leather Trousers',
        kind: 'crafting',
        durationSeconds: 330,
        proficiencyId: 'crafting',
        minProficiency: 3,
        proficiencyGain: 3,
        requiredToolTags: ['cutting'],
        requiredStationTags: ['tannery'],
        inputs: [
            { itemId: 'item-elderwood-tanned-hide', quantity: 1 },
            { itemId: 'item-elderwood-hide-binding', quantity: 1 },
        ],
        outputs: [{ itemId: 'leather-trousers', quantity: 1 }],
    }),
});

export function getBasicLeatherGarmentProcessDefinition(id) {
    return DEFINITIONS[String(id ?? '').trim()] ?? null;
}

export function listBasicLeatherGarmentProcessDefinitions() {
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
