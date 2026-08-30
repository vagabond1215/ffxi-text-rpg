export const HEADWATER_HIGHLAND_TRANSITION_REPAIR_PRODUCTION_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'cook-headwater-bilberry-meadowsweet-preserve': process({
        id: 'cook-headwater-bilberry-meadowsweet-preserve',
        name: 'Cook Bilberry-Meadowsweet Preserve',
        kind: 'cooking',
        durationSeconds: 210,
        proficiencyId: 'cooking',
        proficiencyGain: 2,
        requiredStationTags: ['kitchen'],
        inputs: [
            { itemId: 'item-headwater-upper-bilberry', quantity: 2 },
            { itemId: 'item-headwater-dried-meadowsweet', quantity: 1 },
        ],
        outputs: [{ itemId: 'item-headwater-bilberry-meadowsweet-preserve', quantity: 1 }],
    }),
});

export function getHeadwaterHighlandTransitionRepairProcessDefinition(id) {
    return DEFINITIONS[String(id ?? '').trim()] ?? null;
}
export function listHeadwaterHighlandTransitionRepairProcessDefinitions() {
    return Object.values(DEFINITIONS);
}

function process(definition) {
    return freeze({
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
function freeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) freeze(child);
    return Object.freeze(value);
}
