import { getHuntingResourceItem, listHuntingResourceItems } from './huntingResourceItems.js';
import { getResourceItem, listResourceItems } from './resourceItems.js';
import { getRegionalResourceItem, listRegionalResourceItems } from './regionalResourceItems.js';

export const RESOURCE_ITEM_REGISTRY_VERSION = 2;

export function getCanonicalResourceItem(itemId) {
    return getResourceItem(itemId) ?? getRegionalResourceItem(itemId) ?? getHuntingResourceItem(itemId);
}

export function listCanonicalResourceItems() {
    const items = [...listResourceItems(), ...listRegionalResourceItems(), ...listHuntingResourceItems()];
    const ids = new Set();
    return items.filter((item) => {
        if (ids.has(item.id)) return false;
        ids.add(item.id);
        return true;
    });
}

export function validateResourceItemRegistry() {
    const issues = [];
    const ids = new Set();
    for (const item of listCanonicalResourceItems()) {
        if (ids.has(item.id)) issues.push(`Duplicate canonical resource item ${item.id}.`);
        ids.add(item.id);
        if (!Array.isArray(item.provenance) || item.provenance.length === 0) issues.push(`${item.id} requires provenance.`);
        if (!Array.isArray(item.sinks) || item.sinks.length === 0) issues.push(`${item.id} requires at least one sink.`);
    }
    return issues;
}
