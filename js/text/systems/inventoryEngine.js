import {
    getContainerDefinition,
    INVENTORY_ACCESS_CONTEXTS,
    INVENTORY_CONTAINER_DEFINITIONS,
    listContainerDefinitions,
    listWardrobeContainerIds,
} from '../data/inventoryContainers.js';
import {
    calculateFurnitureStorageCapacity,
    describeFurnitureStorage,
    STARTING_FURNITURE_IDS,
} from '../data/mogHouseFurniture.js';

export function createInventoryState(options = {}) {
    const mogHouse = {
        isInMogHouse: options.isInMogHouse ?? false,
        placedFurniture: options.placedFurniture ?? [...STARTING_FURNITURE_IDS],
    };

    return {
        containers: Object.fromEntries(listContainerDefinitions().map((definition) => [definition.id, {
            id: definition.id,
            unlocked: options.unlockedContainers?.includes(definition.id) ?? definition.unlockedByDefault,
            items: options.containers?.[definition.id]?.items ?? [],
        }])),
        mogHouse,
    };
}

export function getContainerCapacity(inventoryState, containerId) {
    const definition = getContainerDefinition(containerId);
    if (!definition) return 0;
    if (definition.capacityMode === 'furniture') {
        return calculateFurnitureStorageCapacity(inventoryState?.mogHouse?.placedFurniture ?? []);
    }
    return definition.baseCapacity;
}

export function isContainerAccessible(inventoryState, containerId, context = {}) {
    const definition = getContainerDefinition(containerId);
    const container = inventoryState?.containers?.[containerId];
    if (!definition || !container?.unlocked) return false;

    const inMogHouse = context.isInMogHouse ?? inventoryState?.mogHouse?.isInMogHouse ?? false;
    switch (definition.access) {
        case INVENTORY_ACCESS_CONTEXTS.ANYWHERE:
        case INVENTORY_ACCESS_CONTEXTS.EQUIPMENT_ANYWHERE:
            return true;
        case INVENTORY_ACCESS_CONTEXTS.MOG_HOUSE:
            return inMogHouse;
        default:
            return false;
    }
}

export function canStoreItemInContainer(inventoryState, containerId, item, context = {}) {
    const definition = getContainerDefinition(containerId);
    const container = inventoryState?.containers?.[containerId];
    if (!definition || !container) return { ok: false, reason: `Unknown container: ${containerId}` };
    if (!container.unlocked) return { ok: false, reason: `${definition.label} is locked.` };
    if (!isContainerAccessible(inventoryState, containerId, context)) return { ok: false, reason: `${definition.label} is not accessible from here.` };
    if (!definition.itemKinds.includes('all') && !definition.itemKinds.includes(item.kind ?? 'misc')) {
        return { ok: false, reason: `${definition.label} cannot store ${item.kind ?? 'misc'} items.` };
    }
    if (container.items.length >= getContainerCapacity(inventoryState, containerId)) {
        return { ok: false, reason: `${definition.label} is full.` };
    }
    return { ok: true };
}

export function addItemToContainer(inventoryState, containerId, item, context = {}) {
    const check = canStoreItemInContainer(inventoryState, containerId, item, context);
    if (!check.ok) return check;
    inventoryState.containers[containerId].items.push({ quantity: 1, ...item });
    return { ok: true, item, containerId };
}

export function describeInventoryContainers(state, context = {}) {
    const inventoryState = state.player?.inventoryState ?? state.inventoryState;
    if (!inventoryState) return 'No inventory container state found.';

    return [
        'Inventory Containers:',
        ...listContainerDefinitions().map((definition) => describeContainerLine(inventoryState, definition.id, context)),
        '',
        describeFurnitureStorage(inventoryState.mogHouse?.placedFurniture ?? []),
    ].join('\n');
}

export function describeContainerContents(state, containerId = 'inventory', context = {}) {
    const inventoryState = state.player?.inventoryState ?? state.inventoryState;
    const definition = getContainerDefinition(containerId);
    const container = inventoryState?.containers?.[containerId];
    if (!definition || !container) return `Unknown container: ${containerId}`;

    const access = isContainerAccessible(inventoryState, containerId, context) ? 'accessible' : 'not accessible';
    const capacity = getContainerCapacity(inventoryState, containerId);
    return [
        `${definition.label} (${access}) ${container.items.length}/${capacity}`,
        definition.description,
        ...(container.items.length ? container.items.map((item, index) => `${index + 1}. ${item.name ?? item.id}${item.quantity > 1 ? ` x${item.quantity}` : ''}`) : ['- empty']),
    ].join('\n');
}

export function describeEquipmentAndWardrobes(state, context = {}) {
    const equipment = state.player?.equipment ?? {};
    const wardrobeLines = listWardrobeContainerIds().map((containerId) => describeContainerLine(state.player.inventoryState, containerId, context));
    return [
        'Equipment:',
        ...Object.entries(equipment).map(([slot, item]) => `- ${slot}: ${item?.name ?? item ?? 'empty'}`),
        '',
        'Wardrobes:',
        ...wardrobeLines,
    ].join('\n');
}

export function setMogHouseAccess(state, isInMogHouse) {
    const inventoryState = state.player?.inventoryState ?? state.inventoryState;
    if (!inventoryState) return { ok: false, message: 'No inventory container state found.' };
    inventoryState.mogHouse.isInMogHouse = Boolean(isInMogHouse);
    return { ok: true, message: `Mog House context: ${inventoryState.mogHouse.isInMogHouse ? 'entered' : 'left'}.` };
}

function describeContainerLine(inventoryState, containerId, context = {}) {
    const definition = INVENTORY_CONTAINER_DEFINITIONS[containerId];
    const container = inventoryState?.containers?.[containerId];
    if (!definition || !container) return `- ${containerId}: missing`;
    const capacity = getContainerCapacity(inventoryState, containerId);
    const accessible = isContainerAccessible(inventoryState, containerId, context) ? 'accessible' : 'locked/inaccessible';
    return `- ${definition.label}: ${container.items.length}/${capacity}, ${accessible}, access=${definition.access}`;
}
