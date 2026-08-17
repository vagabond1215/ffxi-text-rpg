import { getFurniture } from './mogHouseFurniture.js';
import { getProductionItem } from './productionItems.js';

export const HOME_INFRASTRUCTURE_CATALOG_VERSION = 1;

const HOME_INFRASTRUCTURE_DEFINITIONS = Object.freeze({
    'storage-chest': improvement({
        id: 'storage-chest',
        name: 'Build a Storage Chest',
        projectKind: 'home.infrastructure.storage-chest',
        description: 'Fit a stout travel chest for your lodging so useful materials can stay at home instead of following every journey.',
        laborSeconds: 1800,
        materials: [
            { itemId: 'item-elderwood-resin-board', quantity: 2 },
            { itemId: 'item-redstone-copper-ingot', quantity: 1 },
        ],
        furnitureId: 'storage-chest',
    }),
});

export function getHomeInfrastructureDefinition(improvementId) {
    return HOME_INFRASTRUCTURE_DEFINITIONS[String(improvementId ?? '').trim()] ?? null;
}

export function listHomeInfrastructureDefinitions() {
    return Object.values(HOME_INFRASTRUCTURE_DEFINITIONS);
}

export function validateHomeInfrastructureCatalog() {
    const issues = [];
    const ids = new Set();
    for (const definition of listHomeInfrastructureDefinitions()) {
        if (!/^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(definition.id)) issues.push(`Invalid home infrastructure id ${definition.id}.`);
        if (ids.has(definition.id)) issues.push(`Duplicate home infrastructure id ${definition.id}.`);
        ids.add(definition.id);
        if (!definition.name) issues.push(`${definition.id} requires a name.`);
        if (!definition.description) issues.push(`${definition.id} requires a description.`);
        if (!Number.isInteger(definition.laborSeconds) || definition.laborSeconds <= 0) issues.push(`${definition.id} requires positive laborSeconds.`);
        if (!getFurniture(definition.benefit?.furnitureId)) issues.push(`${definition.id} references unknown furnishing ${definition.benefit?.furnitureId}.`);
        for (const material of definition.materials) {
            if (!getProductionItem(material.itemId)) issues.push(`${definition.id} references unknown construction material ${material.itemId}.`);
            if (!Number.isInteger(material.quantity) || material.quantity <= 0) issues.push(`${definition.id} has invalid quantity for ${material.itemId}.`);
        }
    }
    return issues;
}

function improvement(definition) {
    const furniture = getFurniture(definition.furnitureId);
    return deepFreeze({
        id: String(definition.id),
        name: String(definition.name),
        projectKind: String(definition.projectKind),
        description: String(definition.description),
        laborSeconds: Math.max(1, Math.floor(Number(definition.laborSeconds) || 1)),
        materials: definition.materials.map((entry) => {
            const item = getProductionItem(entry.itemId);
            return {
                itemId: String(entry.itemId),
                name: item?.name ?? String(entry.itemId),
                quantity: Math.max(1, Math.floor(Number(entry.quantity) || 1)),
            };
        }),
        benefit: {
            furnitureId: String(definition.furnitureId),
            furnitureName: furniture?.name ?? String(definition.furnitureId),
            storageSlots: Math.max(0, Number(furniture?.storageSlots) || 0),
        },
    });
}

function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
}
