import { enrichEquipmentItem } from '../data/equipmentCatalog.js';

export const EQUIPMENT_TOOL_ENGINE_VERSION = 1;

export function collectEquippedItemTags(player) {
    const tags = [];
    for (const item of Object.values(player?.equipment ?? {})) {
        if (!item) continue;
        const normalized = enrichEquipmentItem(item);
        tags.push(
            ...(normalized.tags ?? []),
            normalized.family,
            normalized.archetype,
            normalized.subtype,
            normalized.weaponCategory,
        );
    }
    return unique(tags);
}

export function collectAvailableToolTags(player, contextualTags = []) {
    return unique([
        ...collectEquippedItemTags(player),
        ...normalizeTags(contextualTags),
    ]);
}

export function hasEquippedToolTag(player, tag) {
    const expected = String(tag ?? '').trim();
    return expected ? collectEquippedItemTags(player).includes(expected) : false;
}

function normalizeTags(values) {
    return (values ?? []).map((value) => String(value ?? '').trim()).filter(Boolean);
}

function unique(values) {
    return [...new Set(values.map((value) => String(value ?? '').trim()).filter(Boolean))];
}
