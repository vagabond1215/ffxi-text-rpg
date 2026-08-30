import { validateItemConsumption } from './itemSchema.js';
import { getPlace } from './places.js';
import { validateItemResourceMetadata } from './resourceProvenance.js';
import { getEmberwashResourceItem, listEmberwashResourceItems } from './emberwashResourceItems.js';
import { getElderwoodRepairResourceItem, listElderwoodRepairResourceItems } from './elderwoodRepairResourceItems.js';
import { getGreatMereResourceItem, listGreatMereResourceItems } from './greatMereResourceItems.js';
import { getGloamwoodResourceItem, listGloamwoodResourceItems } from './gloamwoodResourceItems.js';
import { getHeadwaterResourceItem, listHeadwaterResourceItems } from './headwaterResourceItems.js';
import { getHuntingResourceItem, listHuntingResourceItems } from './huntingResourceItems.js';
import { getIronspineResourceItem, listIronspineResourceItems } from './ironspineResourceItems.js';
import { getLowerDeepveinResourceItem, listLowerDeepveinResourceItems } from './lowerDeepveinResourceItems.js';
import { getMaterialFoundationResourceItem, listMaterialFoundationResourceItems } from './materialFoundationResourceItems.js';
import { getStarfenDeltaResourceItem, listStarfenDeltaResourceItems } from './starfenDeltaResourceItems.js';
import { getWaymeetMarchesResourceItem, listWaymeetMarchesResourceItems } from './waymeetMarchesResourceItems.js';
import { getResourceItem, listResourceItems } from './resourceItems.js';
import { getRegionalResourceItem, listRegionalResourceItems } from './regionalResourceItems.js';

export const RESOURCE_ITEM_REGISTRY_VERSION = 12;

export function getCanonicalResourceItem(itemId) {
    return getResourceItem(itemId) ?? getRegionalResourceItem(itemId) ?? getElderwoodRepairResourceItem(itemId) ?? getHuntingResourceItem(itemId) ?? getEmberwashResourceItem(itemId) ?? getLowerDeepveinResourceItem(itemId) ?? getGreatMereResourceItem(itemId) ?? getIronspineResourceItem(itemId) ?? getHeadwaterResourceItem(itemId) ?? getStarfenDeltaResourceItem(itemId) ?? getGloamwoodResourceItem(itemId) ?? getWaymeetMarchesResourceItem(itemId) ?? getMaterialFoundationResourceItem(itemId);
}

export function listCanonicalResourceItems() {
    const items = [...listResourceItems(), ...listRegionalResourceItems(), ...listElderwoodRepairResourceItems(), ...listHuntingResourceItems(), ...listEmberwashResourceItems(), ...listLowerDeepveinResourceItems(), ...listGreatMereResourceItems(), ...listIronspineResourceItems(), ...listHeadwaterResourceItems(), ...listStarfenDeltaResourceItems(), ...listGloamwoodResourceItems(), ...listWaymeetMarchesResourceItems(), ...listMaterialFoundationResourceItems()];
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
    const items = [...listResourceItems(), ...listRegionalResourceItems(), ...listElderwoodRepairResourceItems(), ...listHuntingResourceItems(), ...listEmberwashResourceItems(), ...listLowerDeepveinResourceItems(), ...listGreatMereResourceItems(), ...listIronspineResourceItems(), ...listHeadwaterResourceItems(), ...listStarfenDeltaResourceItems(), ...listGloamwoodResourceItems(), ...listWaymeetMarchesResourceItems(), ...listMaterialFoundationResourceItems()];
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
