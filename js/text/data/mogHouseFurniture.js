export const MOG_HOUSE_FURNITURE = Object.freeze({
    bronzeBed: furniture('bronze-bed', 'Bronze Bed', 1, ['bed']),
    mapleTable: furniture('maple-table', 'Maple Table', 2, ['table']),
    storageChest: furniture('storage-chest', 'Storage Chest', 5, ['chest', 'storage']),
    simpleCabinet: furniture('simple-cabinet', 'Simple Cabinet', 8, ['cabinet', 'storage']),
});

export const STARTING_FURNITURE_IDS = Object.freeze([
    'bronze-bed',
    'maple-table',
]);

export function getFurniture(furnitureId) {
    return Object.values(MOG_HOUSE_FURNITURE).find((item) => item.id === furnitureId) ?? null;
}

export function calculateFurnitureStorageCapacity(furnitureIds = []) {
    return furnitureIds.reduce((total, furnitureId) => total + (getFurniture(furnitureId)?.storageSlots ?? 0), 0);
}

export function describeFurnitureStorage(furnitureIds = []) {
    if (!furnitureIds.length) return 'No Mog House furniture placed.';
    return [
        'Mog House Furniture:',
        ...furnitureIds.map((id) => {
            const furniture = getFurniture(id);
            return furniture ? `- ${furniture.name}: +${furniture.storageSlots} storage` : `- ${id}: unknown furniture`;
        }),
        `Total storage capacity: ${calculateFurnitureStorageCapacity(furnitureIds)}`,
    ].join('\n');
}

function furniture(id, name, storageSlots, tags = []) {
    return Object.freeze({ id, name, storageSlots, tags: Object.freeze(tags) });
}
