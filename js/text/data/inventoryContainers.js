export const INVENTORY_ACCESS_CONTEXTS = Object.freeze({
    ANYWHERE: 'anywhere',
    MOG_HOUSE: 'mogHouse',
    EQUIPMENT_ANYWHERE: 'equipmentAnywhere',
});

export const INVENTORY_CONTAINER_DEFINITIONS = Object.freeze({
    inventory: container('inventory', 'Inventory', 30, INVENTORY_ACCESS_CONTEXTS.ANYWHERE, {
        description: 'Main carried inventory. Accessible anywhere.',
        itemKinds: ['all'],
    }),
    mogSafe: container('mogSafe', 'Mog Safe', 50, INVENTORY_ACCESS_CONTEXTS.MOG_HOUSE, {
        description: 'Mog House storage. Accessible from Mog House context.',
        itemKinds: ['all'],
    }),
    mogSafe2: container('mogSafe2', 'Mog Safe 2', 0, INVENTORY_ACCESS_CONTEXTS.MOG_HOUSE, {
        description: 'Second safe container. Locked until expansion rules are implemented.',
        itemKinds: ['all'],
        unlockedByDefault: false,
    }),
    storage: container('storage', 'Storage', 0, INVENTORY_ACCESS_CONTEXTS.MOG_HOUSE, {
        description: 'Furniture-derived Mog House storage. Capacity comes from placed storage furniture only.',
        itemKinds: ['all'],
        capacityMode: 'furniture',
    }),
    mogLocker: container('mogLocker', 'Mog Locker', 0, INVENTORY_ACCESS_CONTEXTS.MOG_HOUSE, {
        description: 'Locker-style storage. Locked until regional/unlock rules are implemented.',
        itemKinds: ['all'],
        unlockedByDefault: false,
    }),
    mogSatchel: container('mogSatchel', 'Mog Satchel', 0, INVENTORY_ACCESS_CONTEXTS.ANYWHERE, {
        description: 'Portable satchel container. Locked until account/security unlock rules are implemented.',
        itemKinds: ['all'],
        unlockedByDefault: false,
    }),
    mogSack: container('mogSack', 'Mog Sack', 0, INVENTORY_ACCESS_CONTEXTS.ANYWHERE, {
        description: 'Portable sack container. Locked until unlock rules are implemented.',
        itemKinds: ['all'],
        unlockedByDefault: false,
    }),
    mogCase: container('mogCase', 'Mog Case', 0, INVENTORY_ACCESS_CONTEXTS.ANYWHERE, {
        description: 'Portable case container. Locked until unlock rules are implemented.',
        itemKinds: ['all'],
        unlockedByDefault: false,
    }),
    wardrobe1: wardrobe('wardrobe1', 'Mog Wardrobe 1', true),
    wardrobe2: wardrobe('wardrobe2', 'Mog Wardrobe 2', false),
    wardrobe3: wardrobe('wardrobe3', 'Mog Wardrobe 3', false),
    wardrobe4: wardrobe('wardrobe4', 'Mog Wardrobe 4', false),
    wardrobe5: wardrobe('wardrobe5', 'Mog Wardrobe 5', false),
    wardrobe6: wardrobe('wardrobe6', 'Mog Wardrobe 6', false),
    wardrobe7: wardrobe('wardrobe7', 'Mog Wardrobe 7', false),
    wardrobe8: wardrobe('wardrobe8', 'Mog Wardrobe 8', false),
});

export function getContainerDefinition(containerId) {
    return INVENTORY_CONTAINER_DEFINITIONS[containerId] ?? null;
}

export function listContainerDefinitions() {
    return Object.values(INVENTORY_CONTAINER_DEFINITIONS);
}

export function listWardrobeContainerIds() {
    return listContainerDefinitions().filter((definition) => definition.kind === 'wardrobe').map((definition) => definition.id);
}

function container(id, label, baseCapacity, access, options = {}) {
    return Object.freeze({
        id,
        label,
        kind: options.kind ?? 'storage',
        baseCapacity,
        access,
        description: options.description ?? '',
        itemKinds: Object.freeze(options.itemKinds ?? ['all']),
        unlockedByDefault: options.unlockedByDefault ?? true,
        capacityMode: options.capacityMode ?? 'fixed',
    });
}

function wardrobe(id, label, unlockedByDefault) {
    return container(id, label, 80, INVENTORY_ACCESS_CONTEXTS.EQUIPMENT_ANYWHERE, {
        kind: 'wardrobe',
        description: `${label}. Equipment storage usable for gear access anywhere once unlocked.`,
        itemKinds: ['equipment'],
        unlockedByDefault,
    });
}
