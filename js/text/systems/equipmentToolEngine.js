import { enrichEquipmentItem } from '../data/equipmentCatalog.js';

export const EQUIPMENT_TOOL_ENGINE_VERSION = 2;

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

export function collectAccessibleToolBindings(player, contextualTags = []) {
    const bindings = [];

    for (const [slot, item] of Object.entries(player?.equipment ?? {})) {
        if (!item) continue;
        const normalized = enrichEquipmentItem(item);
        const tags = collectItemToolTags(normalized);
        if (!tags.length) continue;
        bindings.push(binding({
            itemId: normalized.id,
            itemName: normalized.name,
            sourceType: 'equipment',
            sourceId: slot,
            tags,
        }));
    }

    for (const item of player?.inventoryState?.containers?.inventory?.items ?? []) {
        const normalized = enrichEquipmentItem(item);
        const tags = collectItemToolTags(normalized);
        if (!tags.length || !isPortableTool(normalized)) continue;
        bindings.push(binding({
            itemId: normalized.id,
            itemName: normalized.name,
            sourceType: 'inventory',
            sourceId: 'inventory',
            tags,
        }));
    }

    for (const tag of normalizeTags(contextualTags)) {
        bindings.push(binding({
            itemId: null,
            itemName: `Contextual ${tag} capability`,
            sourceType: 'context',
            sourceId: tag,
            tags: [tag],
        }));
    }

    return bindings;
}

export function resolveRequiredToolBindings(player, requiredTags = [], contextualTags = []) {
    const required = unique(normalizeTags(requiredTags));
    const candidates = collectAccessibleToolBindings(player, contextualTags);
    const selected = [];
    const missing = [];

    for (const tag of required) {
        const candidate = candidates.find((entry) => entry.tags.includes(tag));
        if (!candidate) {
            missing.push(tag);
            continue;
        }
        if (!selected.some((entry) => sameBinding(entry, candidate))) selected.push(candidate);
    }

    return {
        ok: missing.length === 0,
        missing,
        bindings: selected,
        availableTags: unique(candidates.flatMap((entry) => entry.tags)),
    };
}

export function hasEquippedToolTag(player, tag) {
    const expected = String(tag ?? '').trim();
    return expected ? collectEquippedItemTags(player).includes(expected) : false;
}

function collectItemToolTags(item) {
    return unique([
        ...(item?.tags ?? []),
        item?.family,
        item?.archetype,
        item?.subtype,
        item?.weaponCategory,
    ]);
}

function isPortableTool(item) {
    const tags = new Set(item?.tags ?? []);
    return item?.kind === 'equipment' && (item?.family === 'tool' || tags.has('tool'));
}

function binding({ itemId, itemName, sourceType, sourceId, tags }) {
    return Object.freeze({
        itemId,
        itemName: String(itemName ?? itemId ?? 'Tool'),
        sourceType,
        sourceId,
        tags: Object.freeze(unique(tags)),
    });
}

function sameBinding(left, right) {
    return left.itemId === right.itemId
        && left.sourceType === right.sourceType
        && left.sourceId === right.sourceId;
}

function normalizeTags(values) {
    return (values ?? []).map((value) => String(value ?? '').trim()).filter(Boolean);
}

function unique(values) {
    return [...new Set(values.map((value) => String(value ?? '').trim()).filter(Boolean))];
}
