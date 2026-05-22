import { EQUIPMENT_SLOTS } from '../data/systemConstants.js';
import { getContainerDefinition, listWardrobeContainerIds } from '../data/inventoryContainers.js';
import {
    canStoreItemInContainer,
    findItemInContainer,
    isContainerAccessible,
} from './inventoryEngine.js';

const DEFAULT_EQUIP_SEARCH_CONTAINERS = Object.freeze(['inventory', 'wardrobe1', 'wardrobe2', 'wardrobe3', 'wardrobe4', 'wardrobe5', 'wardrobe6', 'wardrobe7', 'wardrobe8']);

export function equipItem(state, itemQuery, options = {}) {
    if (!itemQuery) return 'Equip what?';
    const inventoryState = state.player?.inventoryState;
    if (!inventoryState) return 'No inventory container state found.';

    const source = findEquippableItem(state, itemQuery, options.fromContainerId);
    if (!source.ok) return source.reason;

    const item = source.item;
    if ((item.kind ?? 'misc') !== 'equipment') return `${item.name ?? item.id} is not equipment.`;

    const slot = options.slot ?? inferEquipmentSlot(item);
    if (!slot) return `Could not infer equipment slot for ${item.name ?? item.id}. Use: equip <item> to <slot>.`;
    if (!EQUIPMENT_SLOTS.includes(slot)) return `Unknown equipment slot: ${slot}`;

    const currentItem = state.player.equipment[slot] ?? null;
    const returnContainerId = options.returnContainerId ?? source.containerId;
    const returnDefinition = getContainerDefinition(returnContainerId);
    if (currentItem && !returnDefinition) return `Unknown return container: ${returnContainerId}`;

    const [removedItem] = source.container.items.splice(source.index, 1);
    if (currentItem) {
        const storeCheck = canStoreItemInContainer(inventoryState, returnContainerId, currentItem);
        if (!storeCheck.ok) {
            source.container.items.splice(source.index, 0, removedItem);
            return storeCheck.reason;
        }
    }

    state.player.equipment[slot] = removedItem;
    if (currentItem) inventoryState.containers[returnContainerId].items.push(currentItem);

    return [
        `Equipped ${removedItem.name ?? removedItem.id} to ${slot}.`,
        `Source: ${getContainerDefinition(source.containerId)?.label ?? source.containerId}`,
        currentItem ? `Replaced ${currentItem.name ?? currentItem.id} -> ${returnDefinition.label}.` : 'No previous item replaced.',
    ].join('\n');
}

export function unequipItem(state, slot, destinationContainerId = 'inventory') {
    const inventoryState = state.player?.inventoryState;
    if (!inventoryState) return 'No inventory container state found.';
    if (!slot) return 'Unequip which slot?';
    if (!EQUIPMENT_SLOTS.includes(slot)) return `Unknown equipment slot: ${slot}`;

    const item = state.player.equipment[slot];
    if (!item) return `Nothing is equipped in ${slot}.`;

    const destinationDefinition = getContainerDefinition(destinationContainerId);
    if (!destinationDefinition) return `Unknown destination container: ${destinationContainerId}`;

    const storeCheck = canStoreItemInContainer(inventoryState, destinationContainerId, item);
    if (!storeCheck.ok) return storeCheck.reason;

    state.player.equipment[slot] = null;
    inventoryState.containers[destinationContainerId].items.push(item);

    return [
        `Unequipped ${item.name ?? item.id} from ${slot}.`,
        `Stored in ${destinationDefinition.label}.`,
    ].join('\n');
}

export function describeEquippableSources(state) {
    const inventoryState = state.player?.inventoryState;
    if (!inventoryState) return 'No inventory container state found.';

    const lines = ['Equippable item sources:'];
    for (const containerId of DEFAULT_EQUIP_SEARCH_CONTAINERS) {
        const container = inventoryState.containers[containerId];
        const definition = getContainerDefinition(containerId);
        if (!container || !definition) continue;
        const accessible = isContainerAccessible(inventoryState, containerId);
        const equipmentItems = container.items.filter((item) => (item.kind ?? 'misc') === 'equipment');
        lines.push(`- ${definition.label}: ${accessible ? 'accessible' : 'not accessible'}, equipment items=${equipmentItems.length}`);
    }
    return lines.join('\n');
}

export function inferEquipmentSlot(item) {
    const tags = new Set(item.tags ?? []);
    if (tags.has('head')) return 'head';
    if (tags.has('body')) return 'body';
    if (tags.has('hands')) return 'hands';
    if (tags.has('legs')) return 'legs';
    if (tags.has('feet')) return 'feet';
    if (tags.has('neck')) return 'neck';
    if (tags.has('ear')) return 'leftEar';
    if (tags.has('ring')) return 'leftRing';
    if (tags.has('back')) return 'back';
    if (tags.has('waist')) return 'waist';
    if (tags.has('ranged')) return 'ranged';
    if (tags.has('ammo')) return 'ammo';
    if (tags.has('shield') || tags.has('offhand')) return 'offHand';
    if (tags.has('weapon') || tags.has('sword') || tags.has('axe') || tags.has('dagger') || tags.has('staff') || tags.has('club')) return 'mainHand';
    return null;
}

function findEquippableItem(state, itemQuery, fromContainerId = null) {
    const inventoryState = state.player?.inventoryState;
    const containerIds = fromContainerId ? [fromContainerId] : DEFAULT_EQUIP_SEARCH_CONTAINERS;

    for (const containerId of containerIds) {
        const definition = getContainerDefinition(containerId);
        if (!definition) return { ok: false, reason: `Unknown container: ${containerId}` };
        if (!isContainerAccessible(inventoryState, containerId)) continue;
        const found = findItemInContainer(inventoryState, containerId, itemQuery);
        if (found.ok) return { ...found, containerId };
    }

    return { ok: false, reason: `No accessible equipment item found: ${itemQuery}` };
}
