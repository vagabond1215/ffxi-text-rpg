import { getResourceItem } from './resourceItems.js';
import { getProductionItem } from './productionItems.js';

export const PRODUCTION_CATALOG_VERSION = 1;
export const PRODUCTION_KINDS = Object.freeze(['processing', 'crafting', 'cooking', 'salvage']);

const PRODUCTION_DEFINITIONS = Object.freeze({
    'process-redstone-copper-ingot': processDefinition({
        id: 'process-redstone-copper-ingot',
        name: 'Smelt Redstone Copper',
        kind: 'processing',
        durationSeconds: 300,
        proficiencyId: 'metalworking',
        proficiencyGain: 2,
        requiredStationTags: ['forge'],
        inputs: [{ itemId: 'item-redstone-copper-ore', quantity: 2 }],
        outputs: [{ itemId: 'item-redstone-copper-ingot', quantity: 1 }],
    }),
    'craft-copper-trail-clasp': processDefinition({
        id: 'craft-copper-trail-clasp',
        name: 'Craft Copper Trail Clasp',
        kind: 'crafting',
        durationSeconds: 240,
        proficiencyId: 'metalworking',
        proficiencyGain: 2,
        requiredStationTags: ['forge'],
        inputs: [
            { itemId: 'item-redstone-copper-ingot', quantity: 1 },
            { itemId: 'item-starfen-reed-fiber', quantity: 1 },
        ],
        outputs: [{ itemId: 'item-copper-trail-clasp', quantity: 1 }],
    }),
    'cook-silverfin-sweetroot-stew': processDefinition({
        id: 'cook-silverfin-sweetroot-stew',
        name: 'Cook Silverfin Sweetroot Stew',
        kind: 'cooking',
        durationSeconds: 180,
        proficiencyId: 'cooking',
        proficiencyGain: 2,
        requiredStationTags: ['kitchen'],
        inputs: [
            { itemId: 'item-starfen-silverfin', quantity: 1 },
            { itemId: 'item-elderwood-sweetroot', quantity: 1 },
        ],
        outputs: [{ itemId: 'item-silverfin-sweetroot-stew', quantity: 2 }],
    }),
    'salvage-copper-trail-clasp': processDefinition({
        id: 'salvage-copper-trail-clasp',
        name: 'Salvage Copper Trail Clasp',
        kind: 'salvage',
        durationSeconds: 120,
        proficiencyId: 'salvage',
        proficiencyGain: 1,
        requiredStationTags: ['forge'],
        inputs: [{ itemId: 'item-copper-trail-clasp', quantity: 1 }],
        outputs: [{ itemId: 'item-copper-scrap', quantity: 1 }],
    }),
    'process-copper-scrap-remelt': processDefinition({
        id: 'process-copper-scrap-remelt',
        name: 'Remelt Copper Scrap',
        kind: 'processing',
        durationSeconds: 240,
        proficiencyId: 'metalworking',
        proficiencyGain: 1,
        requiredStationTags: ['forge'],
        inputs: [{ itemId: 'item-copper-scrap', quantity: 2 }],
        outputs: [{ itemId: 'item-redstone-copper-ingot', quantity: 1 }],
    }),
});

export function getProductionDefinition(processId) {
    return PRODUCTION_DEFINITIONS[String(processId ?? '').trim()] ?? null;
}

export function listProductionDefinitions() {
    return Object.values(PRODUCTION_DEFINITIONS);
}

export function getProductionInputItem(itemId) {
    return getResourceItem(itemId) ?? getProductionItem(itemId);
}

export function validateProductionCatalog() {
    const issues = [];
    const ids = new Set();
    for (const definition of listProductionDefinitions()) {
        if (!validStableId(definition.id)) issues.push(`Invalid production id ${definition.id}.`);
        if (ids.has(definition.id)) issues.push(`Duplicate production id ${definition.id}.`);
        ids.add(definition.id);
        if (!definition.name) issues.push(`${definition.id} requires a name.`);
        if (!PRODUCTION_KINDS.includes(definition.kind)) issues.push(`${definition.id} has unknown kind ${definition.kind}.`);
        if (!positiveInteger(definition.durationSeconds)) issues.push(`${definition.id} requires positive durationSeconds.`);
        if (!validStableId(definition.proficiencyId)) issues.push(`${definition.id} requires a stable proficiencyId.`);
        if (!positiveInteger(definition.proficiencyGain)) issues.push(`${definition.id} requires positive proficiencyGain.`);
        if (!Array.isArray(definition.requiredToolTags)) issues.push(`${definition.id}.requiredToolTags must be an array.`);
        if (!Array.isArray(definition.requiredStationTags)) issues.push(`${definition.id}.requiredStationTags must be an array.`);
        if (!Array.isArray(definition.inputs) || !definition.inputs.length) issues.push(`${definition.id} requires inputs.`);
        if (!Array.isArray(definition.outputs) || !definition.outputs.length) issues.push(`${definition.id} requires outputs.`);
        for (const input of definition.inputs ?? []) {
            if (!getProductionInputItem(input.itemId)) issues.push(`${definition.id} input references unknown item ${input.itemId}.`);
            if (!positiveInteger(input.quantity)) issues.push(`${definition.id} input ${input.itemId} has invalid quantity.`);
        }
        for (const output of definition.outputs ?? []) {
            if (!getProductionItem(output.itemId)) issues.push(`${definition.id} output references unknown production item ${output.itemId}.`);
            if (!positiveInteger(output.quantity)) issues.push(`${definition.id} output ${output.itemId} has invalid quantity.`);
        }
    }
    return issues;
}

function processDefinition(definition) {
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
        inputs: (definition.inputs ?? []).map((entry) => ({ itemId: String(entry.itemId), quantity: Math.max(1, Math.floor(Number(entry.quantity) || 1)) })),
        outputs: (definition.outputs ?? []).map((entry) => ({ itemId: String(entry.itemId), quantity: Math.max(1, Math.floor(Number(entry.quantity) || 1)) })),
    });
}

function validStableId(value) {
    return typeof value === 'string' && /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(value);
}
function positiveInteger(value) { return Number.isInteger(value) && value > 0; }
function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
}
