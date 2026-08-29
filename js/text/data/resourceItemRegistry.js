import { validateItemConsumption } from './itemSchema.js';
import { getPlace } from './places.js';
import { validateItemResourceMetadata } from './resourceProvenance.js';
import { getGreatMereResourceItem, listGreatMereResourceItems } from './greatMereResourceItems.js';
import { getHuntingResourceItem, listHuntingResourceItems } from './huntingResourceItems.js';
import { getIronspineResourceItem, listIronspineResourceItems } from './ironspineResourceItems.js';
import { getMaterialFoundationResourceItem, listMaterialFoundationResourceItems } from './materialFoundationResourceItems.js';
import { getResourceItem, listResourceItems } from './resourceItems.js';
import { getRegionalResourceItem, listRegionalResourceItems } from './regionalResourceItems.js';

export const RESOURCE_ITEM_REGISTRY_VERSION = 5;

export function getCanonicalResourceItem(itemId) {
    return getResourceItem(itemId) ?? getRegionalResourceItem(itemId) ?? getHuntingResourceItem(itemId) ?? getGreatMereResourceItem(itemId) ?? getIronspineResourceItem(itemId) ?? getMaterialFoundationResourceItem(itemId);
}

export function listCanonicalResourceItems() {
    const items = [...listResourceItems(), ...listRegionalResourceItems(), ...listHuntingResourceItems(), ...listGreatMereResourceItems(), ...listIronspineResourceItems(), ...listMaterialFoundationResourceItems()];
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
    const items = [...listResourceItems(), ...listRegionalResourceItems(), ...listHuntingResourceItems(), ...listGreatMereResourceItems(), ...listIronspineResourceItems(), ...listMaterialFoundationResourceItems()];
    for (const item of items) {
        if (ids.has(item.id)) issues.push(`Duplicate canonical resource item ${item.id}.`);
        ids.add(item.id);
        for (const issue of validateItemResourceMetadata(item, { requireSource: true, requireSink: true })) {
            issues.push(`${item.id} ${issue}`);
        }
        for (const issue of validateItemConsumption(item)) issues.push(`${item.id} ${issue}`);
        for (const provenance of item.provenance ?? []) {
            if (provenance.placeId && !getPlace(provenance.placeId)) {
                issues.push(`${item.id} provenance references unknown place ${provenance.placeId}.`);
            }
        }
    }
    return issues;
}
