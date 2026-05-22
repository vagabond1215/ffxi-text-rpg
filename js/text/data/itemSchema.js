export const ITEM_KINDS = Object.freeze({
    EQUIPMENT: 'equipment',
    CONSUMABLE: 'consumable',
    MATERIAL: 'material',
    MISC: 'misc',
    KEY_ITEM: 'keyItem',
});

export function normalizeItem(rawItem = {}) {
    const kind = rawItem.kind ?? ITEM_KINDS.MISC;
    const stackable = rawItem.stackable ?? isStackableKind(kind);
    const quantity = Math.max(1, Number.parseInt(rawItem.quantity, 10) || 1);
    const maxStack = stackable ? Math.max(1, Number.parseInt(rawItem.maxStack, 10) || 99) : 1;

    return {
        id: rawItem.id ?? normalizeId(rawItem.name ?? 'unknown-item'),
        name: rawItem.name ?? rawItem.id ?? 'Unknown Item',
        kind,
        quantity,
        stackable,
        maxStack,
        valueGil: rawItem.valueGil ?? 0,
        tags: [...(rawItem.tags ?? [])],
        source: rawItem.source ?? null,
        flags: rawItem.flags ?? {},
        modifiers: rawItem.modifiers,
        equipmentSlot: rawItem.equipmentSlot,
    };
}

export function canStackItems(existingItem, incomingItem) {
    if (!existingItem || !incomingItem) return false;
    if (!existingItem.stackable || !incomingItem.stackable) return false;
    if (existingItem.id !== incomingItem.id) return false;
    if (existingItem.kind !== incomingItem.kind) return false;
    return (existingItem.quantity ?? 1) < (existingItem.maxStack ?? 1);
}

export function addToStack(existingItem, incomingItem) {
    const maxStack = existingItem.maxStack ?? 1;
    const current = existingItem.quantity ?? 1;
    const incoming = incomingItem.quantity ?? 1;
    const accepted = Math.min(incoming, Math.max(0, maxStack - current));
    existingItem.quantity = current + accepted;
    return {
        accepted,
        remaining: incoming - accepted,
    };
}

export function describeItem(item) {
    const quantity = item.quantity > 1 ? ` x${item.quantity}` : '';
    const stack = item.stackable ? ` stack ${item.quantity}/${item.maxStack}` : ' non-stackable';
    return `${item.name}${quantity} [${item.kind},${stack}]`;
}

function isStackableKind(kind) {
    return [ITEM_KINDS.CONSUMABLE, ITEM_KINDS.MATERIAL, ITEM_KINDS.MISC].includes(kind);
}

function normalizeId(value) {
    return String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/[’']/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'unknown-item';
}
