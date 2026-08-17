import { listContainerDefinitions } from '../data/inventoryContainers.js';

export const CARRIED_LOAD_ENGINE_VERSION = 2;

export function getCarriedCargoLoad(state) {
    const inventoryState = state?.player?.inventoryState ?? state?.inventoryState ?? null;
    const containers = listContainerDefinitions()
        .filter((definition) => definition.countsAsCarriedCargo)
        .map((definition) => {
            const container = inventoryState?.containers?.[definition.id] ?? null;
            const unlocked = Boolean(container?.unlocked);
            const occupiedSlots = unlocked && Array.isArray(container?.items) ? container.items.length : 0;
            return Object.freeze({
                containerId: definition.id,
                name: definition.label,
                unlocked,
                occupiedSlots,
                cargoUnits: occupiedSlots,
            });
        });
    const cargoUnits = containers.reduce((sum, container) => sum + container.cargoUnits, 0);

    return Object.freeze({
        containerId: 'portable-carried-containers',
        cargoUnits,
        occupiedSlots: cargoUnits,
        unitModel: 'occupied-portable-slots',
        containers: Object.freeze(containers),
    });
}

export function getCarriedCargoUnits(state) {
    return getCarriedCargoLoad(state).cargoUnits;
}
