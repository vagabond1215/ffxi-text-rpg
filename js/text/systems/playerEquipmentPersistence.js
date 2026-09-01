import { EQUIPMENT_SLOTS } from '../data/systemConstants.js';
import { enrichEquipmentItem } from '../data/equipmentCatalog.js';
import { ITEM_KINDS, hasItemFlag } from '../data/itemSchema.js';

export const PLAYER_EQUIPMENT_PERSISTENCE_VERSION = 2;

export function validatePersistedPlayerEquipment(equipment) {
    const issues = [];
    if (!isObject(equipment)) return ['equipment must be an object.'];

    for (const slot of EQUIPMENT_SLOTS) {
        if (!Object.hasOwn(equipment, slot)) {
            issues.push(`equipment.${slot} is missing.`);
            continue;
        }
        const item = equipment[slot];
        if (item === null) continue;
        if (!isObject(item)) {
            issues.push(`equipment.${slot} must be null or an item object.`);
            continue;
        }
        issues.push(...validateEquippedItem(item, slot).map((issue) => `equipment.${slot}.${issue}`));
    }

    for (const key of Object.keys(equipment)) {
        if (!EQUIPMENT_SLOTS.includes(key)) issues.push(`equipment.${key} is not a canonical equipment slot.`);
    }

    const mainHand = equipment.mainHand;
    if (isObject(mainHand) && equipment.offHand !== null) {
        const enrichedMain = safeEnrich(mainHand);
        if (enrichedMain && hasItemFlag(enrichedMain, 'twoHanded')) {
            issues.push('equipment.offHand must be empty while a two-handed mainHand item is equipped.');
        }
    }

    return issues;
}

function validateEquippedItem(item, slot) {
    const issues = [];
    if (typeof item.id !== 'string' || !item.id.trim()) issues.push('id must be a non-empty string.');
    if (typeof item.name !== 'string' || !item.name.trim()) issues.push('name must be a non-empty string.');
    if (item.kind !== ITEM_KINDS.EQUIPMENT) issues.push('kind must be equipment.');
    if (slot === 'ammo') {
        if (!Number.isInteger(item.quantity) || item.quantity < 1) issues.push('quantity must be a positive integer.');
        if (typeof item.stackable !== 'boolean') issues.push('stackable must be boolean.');
        if (!Number.isInteger(item.maxStack) || item.maxStack < 1) issues.push('maxStack must be a positive integer.');
        if (item.stackable === true && Number.isInteger(item.maxStack) && item.maxStack < 2) issues.push('maxStack must exceed 1 when stackable is true.');
        if (item.stackable === false && item.maxStack !== 1) issues.push('maxStack must be 1 when stackable is false.');
        if (item.stackable === false && item.quantity !== 1) issues.push('quantity must be exactly 1 when stackable is false.');
        if (Number.isInteger(item.quantity) && Number.isInteger(item.maxStack) && item.quantity > item.maxStack) issues.push('quantity cannot exceed maxStack.');
    } else {
        if (!Number.isInteger(item.quantity) || item.quantity !== 1) issues.push('quantity must be exactly 1.');
        if (item.stackable !== false) issues.push('stackable must be false.');
        if (item.maxStack !== 1) issues.push('maxStack must be 1.');
    }
    if (!Array.isArray(item.allowedSlots)) issues.push('allowedSlots must be an array.');

    const enriched = safeEnrich(item);
    if (!enriched) {
        issues.push('must normalize as equipment.');
        return issues;
    }
    if (!enriched.allowedSlots.includes(slot)) issues.push(`allowedSlots must permit occupied slot ${slot}.`);
    if (!EQUIPMENT_SLOTS.includes(enriched.equipmentSlot)) issues.push('equipmentSlot must resolve to a canonical slot.');
    if (!Array.isArray(enriched.flags)) issues.push('flags must resolve to an array.');
    return issues;
}

function safeEnrich(item) {
    try {
        const enriched = enrichEquipmentItem(item);
        return enriched?.kind === ITEM_KINDS.EQUIPMENT ? enriched : null;
    } catch {
        return null;
    }
}

function isObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
