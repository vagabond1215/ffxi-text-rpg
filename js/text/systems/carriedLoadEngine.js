export const CARRIED_LOAD_ENGINE_VERSION = 1;

export function getCarriedCargoLoad(state) {
    const inventoryState = state?.player?.inventoryState ?? state?.inventoryState ?? null;
    const container = inventoryState?.containers?.inventory ?? null;
    const occupiedSlots = Array.isArray(container?.items) ? container.items.length : 0;

    return Object.freeze({
        containerId: 'inventory',
        cargoUnits: occupiedSlots,
        occupiedSlots,
        unitModel: 'occupied-carried-slots',
    });
}

export function getCarriedCargoUnits(state) {
    return getCarriedCargoLoad(state).cargoUnits;
}
