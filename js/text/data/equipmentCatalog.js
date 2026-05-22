export const EQUIPMENT_CATALOG = Object.freeze({
    'bronze-sword': equipment('bronze-sword', 'Bronze Sword', 'mainHand', ['weapon', 'sword', 'starter'], {
        derived: { attack: 3, accuracy: 1 },
    }),
    'bronze-axe': equipment('bronze-axe', 'Bronze Axe', 'mainHand', ['weapon', 'axe', 'starter'], {
        derived: { attack: 4 },
    }),
    'bronze-dagger': equipment('bronze-dagger', 'Bronze Dagger', 'mainHand', ['weapon', 'dagger', 'starter'], {
        derived: { attack: 2, accuracy: 2 },
    }),
    'bronze-pick': equipment('bronze-pick', 'Bronze Pick', 'mainHand', ['weapon', 'axe', 'starter'], {
        derived: { attack: 3 },
    }),
    'ash-staff': equipment('ash-staff', 'Ash Staff', 'mainHand', ['weapon', 'staff', 'starter'], {
        resources: { mp: 3 },
        derived: { attack: 2, magicAccuracy: 1 },
    }),
    'maple-wand': equipment('maple-wand', 'Maple Wand', 'mainHand', ['weapon', 'club', 'starter'], {
        attributes: { int: 1, mnd: 1 },
        resources: { mp: 4 },
        derived: { magicAccuracy: 1 },
    }),
    'bronze-cap': equipment('bronze-cap', 'Bronze Cap', 'head', ['armor', 'head', 'starter'], {
        derived: { defense: 2 },
    }),
    'bronze-harness': equipment('bronze-harness', 'Bronze Harness', 'body', ['armor', 'body', 'starter'], {
        resources: { hp: 4 },
        derived: { defense: 5 },
    }),
    'bronze-subligar': equipment('bronze-subligar', 'Bronze Subligar', 'legs', ['armor', 'legs', 'starter'], {
        derived: { defense: 3 },
    }),
    'bronze-mittens': equipment('bronze-mittens', 'Bronze Mittens', 'hands', ['armor', 'hands', 'starter'], {
        derived: { defense: 2, attack: 1 },
    }),
});

export function getEquipmentCatalogEntry(itemId) {
    return EQUIPMENT_CATALOG[itemId] ?? null;
}

export function enrichEquipmentItem(item) {
    const entry = getEquipmentCatalogEntry(item.id);
    if (!entry) return item;
    return {
        ...item,
        name: item.name ?? entry.name,
        kind: 'equipment',
        equipmentSlot: item.equipmentSlot ?? entry.slot,
        tags: Array.from(new Set([...(item.tags ?? []), ...entry.tags])),
        modifiers: mergeModifiers(entry.modifiers, item.modifiers),
    };
}

export function listEquipmentCatalogEntries() {
    return Object.values(EQUIPMENT_CATALOG);
}

function equipment(id, name, slot, tags, modifiers) {
    return Object.freeze({ id, name, slot, tags: Object.freeze(tags), modifiers: freezeModifiers(modifiers) });
}

function freezeModifiers(modifiers = {}) {
    return Object.freeze({
        attributes: Object.freeze({ ...(modifiers.attributes ?? {}) }),
        resources: Object.freeze({ ...(modifiers.resources ?? {}) }),
        derived: Object.freeze({ ...(modifiers.derived ?? {}) }),
        resistances: Object.freeze({ ...(modifiers.resistances ?? {}) }),
    });
}

function mergeModifiers(base = {}, override = {}) {
    return {
        attributes: { ...(base.attributes ?? {}), ...(override.attributes ?? {}) },
        resources: { ...(base.resources ?? {}), ...(override.resources ?? {}) },
        derived: { ...(base.derived ?? {}), ...(override.derived ?? {}) },
        resistances: { ...(base.resistances ?? {}), ...(override.resistances ?? {}) },
    };
}
