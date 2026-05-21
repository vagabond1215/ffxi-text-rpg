import { getShopCatalogForPoi } from '../data/shopCatalogs.js';
import { getContextualPois } from '../data/pointsOfInterest.js';
import { addItemToContainer } from './inventoryEngine.js';
import { discoverPoi } from './poiEngine.js';

export function buyFromCurrentShop(state, itemQuery = '', shopQuery = '') {
    const shopPoi = findCurrentShopPoi(state, shopQuery);
    if (!shopPoi) return 'There is no matching shop at this grid.';

    const catalog = getShopCatalogForPoi(shopPoi.id);
    if (!catalog) return `${shopPoi.name} has no shop catalog yet.`;

    const item = findCatalogItem(catalog, itemQuery);
    if (!item) {
        return [
            `No matching item in ${catalog.name}: ${itemQuery || '<empty>'}`,
            'Available:',
            ...catalog.items.map((entry) => `- ${entry.name}: ${entry.priceGil} gil`),
        ].join('\n');
    }

    const gil = state.player?.wallet?.gil ?? 0;
    if (gil < item.priceGil) return `Not enough gil. ${item.name} costs ${item.priceGil} gil; you have ${gil}.`;

    const inventoryState = state.player?.inventoryState;
    const purchaseItem = createInventoryItemFromShopItem(item, shopPoi, catalog);
    const addResult = addItemToContainer(inventoryState, 'inventory', purchaseItem);
    if (!addResult.ok) return addResult.reason;

    state.player.wallet.gil -= item.priceGil;
    discoverPoi(state, shopPoi);

    return [
        `Bought ${item.name} for ${item.priceGil} gil from ${shopPoi.name}.`,
        `Gil remaining: ${state.player.wallet.gil}`,
        `Stored in Inventory.`,
    ].join('\n');
}

export function sellToCurrentShop(_state, _itemQuery = '') {
    return 'Selling is not implemented yet. The shop transaction framework currently supports buying only.';
}

function findCurrentShopPoi(state, shopQuery = '') {
    const pois = getContextualPois(state).filter((poi) => poi.actions.includes('shop'));
    if (!shopQuery) return pois[0] ?? null;
    const normalized = normalize(shopQuery);
    return pois.find((poi) => normalize(poi.name).includes(normalized) || normalize(poi.id).includes(normalized)) ?? null;
}

function findCatalogItem(catalog, itemQuery) {
    const normalized = normalize(itemQuery);
    if (!normalized) return null;
    return catalog.items.find((item) => normalize(item.id) === normalized || normalize(item.name).includes(normalized)) ?? null;
}

function createInventoryItemFromShopItem(item, shopPoi, catalog) {
    return {
        id: item.id,
        name: item.name,
        kind: inferItemKind(item.tags),
        quantity: 1,
        source: {
            type: 'shop',
            poiId: shopPoi.id,
            shopName: catalog.name,
        },
        valueGil: item.priceGil,
        tags: [...item.tags],
    };
}

function inferItemKind(tags = []) {
    if (tags.includes('weapon') || tags.includes('armor')) return 'equipment';
    if (tags.includes('consumable') || tags.includes('food')) return 'consumable';
    if (tags.includes('material')) return 'material';
    return 'misc';
}

function normalize(value) {
    return String(value ?? '').trim().toLowerCase().replace(/[’']/g, '').replace(/\s+/g, '-');
}
