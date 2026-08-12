export const INVENTORY_ACCESS_CONTEXTS = Object.freeze({
    ANYWHERE: 'anywhere',
    // Legacy persistence/access token retained until the inventory schema receives its own ordered migration.
    MOG_HOUSE: 'mogHouse',
    EQUIPMENT_ANYWHERE: 'equipmentAnywhere',
});

// Several stable container IDs intentionally remain legacy-shaped for save compatibility.
// Player-facing labels and descriptions are canonical Hearth & Horizon terminology.
export const INVENTORY_CONTAINER_DEFINITIONS = Object.freeze({
    inventory: container('inventory', 'Inventory', 30, INVENTORY_ACCESS_CONTEXTS.ANYWHERE, {
        description: 'Main carried inventory. Accessible anywhere.',
        itemKinds: ['all'],
    }),
    mogSafe: container('mogSafe', 'Home Safe', 50, INVENTORY_ACCESS_CONTEXTS.MOG_HOUSE, {
        description: 'Secure home storage. Accessible while at your home or lodging.',
        itemKinds: ['all'],
    }),
    mogSafe2: container('mogSafe2', 'Home Safe II', 0, INVENTORY_ACCESS_CONTEXTS.MOG_HOUSE, {
        description: 'Second home safe. Locked until expansion rules are implemented.',
        itemKinds: ['all'],
        unlockedByDefault: false,
    }),
    storage: container('storage', 'Furnishing Storage', 0, INVENTORY_ACCESS_CONTEXTS.MOG_HOUSE, {
        description: 'Home storage capacity provided by placed storage furnishings.',
        itemKinds: ['all'],
        capacityMode: 'furniture',
    }),
    mogLocker: container('mogLocker', 'Home Locker', 0, INVENTORY_ACCESS_CONTEXTS.MOG_HOUSE, {
        description: 'Locker-style home storage. Locked until regional or property unlock rules are implemented.',
        itemKinds: ['all'],
        unlockedByDefault: false,
    }),
    mogSatchel: container('mogSatchel', 'Field Satchel', 0, INVENTORY_ACCESS_CONTEXTS.ANYWHERE, {
        description: 'Portable satchel container. Locked until account or character unlock rules are implemented.',
        itemKinds: ['all'],
        unlockedByDefault: false,
    }),
    mogSack: container('mogSack', 'Field Sack', 0, INVENTORY_ACCESS_CONTEXTS.ANYWHERE, {
        description: 'Portable sack container. Locked until unlock rules are implemented.',
        itemKinds: ['all'],
        unlockedByDefault: false,
    }),
    mogCase: container('mogCase', 'Field Case', 0, INVENTORY_ACCESS_CONTEXTS.ANYWHERE, {
        description: 'Portable case container. Locked until unlock rules are implemented.',
        itemKinds: ['all'],
        unlockedByDefault: false,
    }),
    wardrobe1: wardrobe('wardrobe1', 'Wardrobe 1', true),
    wardrobe2: wardrobe('wardrobe2', 'Wardrobe 2', false),
    wardrobe3: wardrobe('wardrobe3', 'Wardrobe 3', false),
    wardrobe4: wardrobe('wardrobe4', 'Wardrobe 4', false),
    wardrobe5: wardrobe('wardrobe5', 'Wardrobe 5', false),
    wardrobe6: wardrobe('wardrobe6', 'Wardrobe 6', false),
    wardrobe7: wardrobe('wardrobe7', 'Wardrobe 7', false),
    wardrobe8: wardrobe('wardrobe8', 'Wardrobe 8', false),
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
