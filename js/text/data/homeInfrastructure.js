import { getContainerDefinition } from './inventoryContainers.js';
import { getFurniture } from './homeFurnishings.js';
import { getProductionItem } from './productionItems.js';

export const HOME_INFRASTRUCTURE_CATALOG_VERSION = 4;

const HOME_INFRASTRUCTURE_DEFINITIONS = Object.freeze({
    'storage-chest': improvement({
        id: 'storage-chest',
        name: 'Build a Storage Chest',
        projectKind: 'home.infrastructure.storage-chest',
        description: 'Fit a stout travel chest for your lodging so useful materials can stay at home instead of following every journey.',
        motivation: 'A better foothold lets useful materials stay behind, making preparation for the next journey less wasteful.',
        benefitSummary: 'A Storage Chest adds 5 home-storage slots.',
        laborSeconds: 1800,
        materials: [
            { itemId: 'item-elderwood-resin-board', quantity: 2 },
            { itemId: 'item-redstone-copper-ingot', quantity: 1 },
        ],
        furnitureId: 'storage-chest',
    }),
    'joiners-workbench': improvement({
        id: 'joiners-workbench',
        name: "Build a Joiner's Workbench",
        projectKind: 'home.infrastructure.joiners-workbench',
        description: 'Brace a proper joinery bench in your lodging so timber can be fitted and sealed without returning to a public woodshop.',
        motivation: 'A home workshop turns regional materials and past travel into less travel for future production.',
        benefitSummary: "A Joiner's Workbench provides a woodshop workstation at home.",
        laborSeconds: 2700,
        materials: [
            { itemId: 'item-elderwood-resin-board', quantity: 2 },
            { itemId: 'item-copper-trail-clasp', quantity: 1 },
        ],
        furnitureId: 'joiners-workbench',
    }),
    'field-satchel': improvement({
        id: 'field-satchel',
        name: 'Make a Field Satchel',
        projectKind: 'home.infrastructure.field-satchel',
        description: 'Fit a reinforced field satchel that keeps more tools and supplies within reach on the road.',
        motivation: 'More portable space supports longer field loops, but everything in the satchel still counts as carried transport load.',
        benefitSummary: 'A Field Satchel unlocks 8 portable slots; its contents still count toward transport cargo limits.',
        laborSeconds: 1800,
        materials: [
            { itemId: 'item-elderwood-hide-binding', quantity: 2 },
            { itemId: 'item-copper-trail-clasp', quantity: 1 },
        ],
        containerId: 'fieldSatchel',
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
        if (!definition.motivation) issues.push(`${definition.id} requires a motivation.`);
        if (!definition.benefitSummary) issues.push(`${definition.id} requires a benefit summary.`);
        if (!Number.isInteger(definition.laborSeconds) || definition.laborSeconds <= 0) issues.push(`${definition.id} requires positive laborSeconds.`);
        const furnitureId = definition.benefit?.furnitureId;
        const containerId = definition.benefit?.containerId;
        if (Boolean(furnitureId) === Boolean(containerId)) issues.push(`${definition.id} must provide exactly one furnishing or container benefit.`);
        if (furnitureId && !getFurniture(furnitureId)) issues.push(`${definition.id} references unknown furnishing ${furnitureId}.`);
        if (containerId && !getContainerDefinition(containerId)) issues.push(`${definition.id} references unknown container ${containerId}.`);
        for (const material of definition.materials) {
            if (!getProductionItem(material.itemId)) issues.push(`${definition.id} references unknown construction material ${material.itemId}.`);
            if (!Number.isInteger(material.quantity) || material.quantity <= 0) issues.push(`${definition.id} has invalid quantity for ${material.itemId}.`);
        }
    }
    return issues;
}

function improvement(definition) {
    const furniture = definition.furnitureId ? getFurniture(definition.furnitureId) : null;
    const container = definition.containerId ? getContainerDefinition(definition.containerId) : null;
    return deepFreeze({
        id: String(definition.id),
        name: String(definition.name),
        projectKind: String(definition.projectKind),
        description: String(definition.description),
        motivation: String(definition.motivation),
        benefitSummary: String(definition.benefitSummary),
        laborSeconds: Math.max(1, Math.floor(Number(definition.laborSeconds) || 1)),
        materials: definition.materials.map((entry) => {
            const item = getProductionItem(entry.itemId);
            return {
                itemId: String(entry.itemId),
                name: item?.name ?? String(entry.itemId),
                quantity: Math.max(1, Math.floor(Number(entry.quantity) || 1)),
            };
        }),
        benefit: furniture
            ? {
                kind: 'furnishing',
                furnitureId: String(definition.furnitureId),
                furnitureName: furniture.name ?? String(definition.furnitureId),
                storageSlots: Math.max(0, Number(furniture.storageSlots) || 0),
                tags: [...(furniture.tags ?? [])],
            }
            : {
                kind: 'container',
                containerId: String(definition.containerId),
                containerName: container?.label ?? String(definition.containerId),
                portableSlots: Math.max(0, Number(container?.baseCapacity) || 0),
                tags: container?.countsAsCarriedCargo ? ['portable', 'carried-cargo'] : [],
            },
    });
}

function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
}
