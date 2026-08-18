import { listContainerDefinitions } from '../data/inventoryContainers.js';

export const CARRIED_INVENTORY_ENGINE_VERSION = 1;

export function listCarriedContainerEntries(stateOrInventoryState) {
    const inventoryState = resolveInventoryState(stateOrInventoryState);
    if (!inventoryState) return [];

    return listContainerDefinitions()
        .filter((definition) => definition.countsAsCarriedCargo)
        .map((definition) => ({
            definition,
            container: inventoryState.containers?.[definition.id] ?? null,
        }))
        .filter((entry) => entry.container?.unlocked && Array.isArray(entry.container.items));
}

export function listCarriedItemEntries(stateOrInventoryState, predicate = null) {
    const matches = typeof predicate === 'function' ? predicate : () => true;
    const entries = [];

    for (const { definition, container } of listCarriedContainerEntries(stateOrInventoryState)) {
        for (let index = 0; index < container.items.length; index += 1) {
            const item = container.items[index];
            if (!matches(item, definition.id)) continue;
            entries.push({
                containerId: definition.id,
                container,
                index,
                item,
            });
        }
    }

    return entries;
}

export function getCarriedItemQuantity(stateOrInventoryState, predicate) {
    return listCarriedItemEntries(stateOrInventoryState, predicate)
        .reduce((sum, entry) => sum + itemQuantity(entry.item), 0);
}

export function applyCarriedItemRemovalPlan(stateOrInventoryState, removals = []) {
    const inventoryState = resolveInventoryState(stateOrInventoryState);
    if (!inventoryState) return { ok: false, reason: 'Inventory state is unavailable.', removed: [] };
    if (!Array.isArray(removals)) return { ok: false, reason: 'Removal plan must be an array.', removed: [] };

    const carriedIds = new Set(listContainerDefinitions()
        .filter((definition) => definition.countsAsCarriedCargo)
        .map((definition) => definition.id));
    const totals = new Map();

    for (const removal of removals) {
        const containerId = String(removal?.containerId ?? '');
        const index = Number(removal?.index);
        const quantity = Number(removal?.quantity);
        if (!carriedIds.has(containerId)) return { ok: false, reason: `Container ${containerId} is not carried cargo.`, removed: [] };
        const container = inventoryState.containers?.[containerId];
        if (!container?.unlocked || !Array.isArray(container.items)) return { ok: false, reason: `Carried container ${containerId} is unavailable.`, removed: [] };
        if (!Number.isInteger(index) || index < 0 || index >= container.items.length) return { ok: false, reason: `Removal index ${String(removal?.index)} is invalid for ${containerId}.`, removed: [] };
        if (!Number.isInteger(quantity) || quantity <= 0) return { ok: false, reason: 'Removal quantity must be a positive integer.', removed: [] };
        const key = `${containerId}:${index}`;
        totals.set(key, {
            containerId,
            index,
            quantity: (totals.get(key)?.quantity ?? 0) + quantity,
        });
    }

    const planned = [...totals.values()];
    for (const removal of planned) {
        const item = inventoryState.containers[removal.containerId].items[removal.index];
        if (removal.quantity > itemQuantity(item)) {
            return { ok: false, reason: `Removal plan exceeds available quantity in ${removal.containerId}.`, removed: [] };
        }
    }

    const removed = planned.map((removal) => {
        const item = inventoryState.containers[removal.containerId].items[removal.index];
        return { ...item, quantity: removal.quantity, containerId: removal.containerId };
    });

    const byContainer = new Map();
    for (const removal of planned) {
        if (!byContainer.has(removal.containerId)) byContainer.set(removal.containerId, []);
        byContainer.get(removal.containerId).push(removal);
    }

    for (const [containerId, containerRemovals] of byContainer) {
        const container = inventoryState.containers[containerId];
        for (const removal of containerRemovals.sort((left, right) => right.index - left.index)) {
            const item = container.items[removal.index];
            const available = itemQuantity(item);
            if (removal.quantity >= available || item.stackable === false) container.items.splice(removal.index, 1);
            else item.quantity = available - removal.quantity;
        }
    }

    return { ok: true, removed };
}

function resolveInventoryState(stateOrInventoryState) {
    return stateOrInventoryState?.player?.inventoryState
        ?? stateOrInventoryState?.inventoryState
        ?? (stateOrInventoryState?.containers ? stateOrInventoryState : null);
}

function itemQuantity(item) {
    return Math.max(1, Number.parseInt(item?.quantity, 10) || 1);
}
