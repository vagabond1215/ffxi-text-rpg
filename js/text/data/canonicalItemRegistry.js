import { getEquipmentCatalogEntry, listEquipmentCatalogEntries } from './equipmentCatalog.js';
import { getProductionItem, listProductionItems } from './productionItems.js';
import { getCanonicalResourceItem, listCanonicalResourceItems } from './resourceItemRegistry.js';

export const CANONICAL_ITEM_REGISTRY_VERSION = 1;

const AUTHORITIES = Object.freeze([
    Object.freeze({ id: 'resource', get: getCanonicalResourceItem, list: listCanonicalResourceItems }),
    Object.freeze({ id: 'production', get: getProductionItem, list: listProductionItems }),
    Object.freeze({ id: 'equipment', get: getEquipmentCatalogEntry, list: listEquipmentCatalogEntries }),
]);

export function getCanonicalItem(itemId) {
    const key = String(itemId ?? '').trim();
    if (!key) return null;
    for (const authority of AUTHORITIES) {
        const item = authority.get(key);
        if (item) return item;
    }
    return null;
}

export function getCanonicalItemAuthority(itemId) {
    const key = String(itemId ?? '').trim();
    if (!key) return null;
    for (const authority of AUTHORITIES) {
        if (authority.get(key)) return authority.id;
    }
    return null;
}

export function listCanonicalItems() {
    const seen = new Set();
    const items = [];
    for (const authority of AUTHORITIES) {
        for (const item of authority.list()) {
            if (!item?.id || seen.has(item.id)) continue;
            seen.add(item.id);
            items.push(item);
        }
    }
    return items;
}

export function validateCanonicalItemRegistry() {
    const issues = [];
    const ownerById = new Map();

    for (const authority of AUTHORITIES) {
        for (const item of authority.list()) {
            if (!item?.id) {
                issues.push(`[${authority.id}] canonical item requires an id.`);
                continue;
            }
            const prior = ownerById.get(item.id);
            if (prior && prior !== authority.id) {
                issues.push(`Canonical item id ${item.id} is defined by both ${prior} and ${authority.id} authorities.`);
                continue;
            }
            ownerById.set(item.id, authority.id);
            if (!String(item.name ?? '').trim()) issues.push(`[${authority.id}] ${item.id} requires a name.`);
            if (!String(item.kind ?? '').trim()) issues.push(`[${authority.id}] ${item.id} requires a kind.`);
        }
    }

    return issues;
}
