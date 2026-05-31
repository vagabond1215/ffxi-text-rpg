import { enrichEquipmentItem } from '../data/equipmentCatalog.js';
import { getShopCatalogForPoi } from '../data/shopCatalogs.js';
import { getContextualPois } from '../data/pointsOfInterest.js';
import { canSellItem } from './itemBehaviorEngine.js';
import { addItemToContainer, findItemInContainer, removeItemQuantityFromContainer } from './inventoryEngine.js';
import { discoverPoi } from './poiEngine.js';

export function buyFromCurrentShop(state, itemQuery = '', shopQuery = '') {
    const shopPoi = findCurrentShopPoi(state, shopQuery);
    if (!shopPoi) return 'There is no matching shop at this coordinate.';

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

export function sellToCurrentShop(state, itemQuery = '', shopQuery = '') {
    const shopPoi = findCurrentShopPoi(state, shopQuery);
    if (!shopPoi) return 'There is no matching shop at this coordinate.';

    const catalog = getShopCatalogForPoi(shopPoi.id);
    if (!catalog) return `${shopPoi.name} has no shop catalog yet.`;

    const inventoryState = state.player?.inventoryState;
    if (!inventoryState) return 'No inventory container state found.';

    const request = parseSellRequest(itemQuery);
    if (!request.itemQuery) return 'Sell what? Use: sell <item> [quantity].';

    const found = findItemInContainer(inventoryState, 'inventory', request.itemQuery);
    if (!found.ok) return found.reason;

    const eligibility = canSellItem(found.item, { shopPoi, catalog });
    if (!eligibility.ok) return eligibility.reason;

    const removeResult = removeItemQuantityFromContainer(inventoryState, 'inventory', request.itemQuery, request.quantity);
    if (!removeResult.ok) return removeResult.reason;

    const gilEarned = eligibility.sellValueGil * removeResult.quantity;
    state.player.wallet.gil = (state.player.wallet.gil ?? 0) + gilEarned;
    discoverPoi(state, shopPoi);

    return [
        `Sold ${removeResult.item.name}${removeResult.quantity > 1 ? ` x${removeResult.quantity}` : ''} for ${gilEarned} gil.`,
        `Gil now: ${state.player.wallet.gil}`,
    ].join('\n');
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

function parseSellRequest(itemQuery) {
    const text = String(itemQuery ?? '').trim();
    if (!text) return { itemQuery: '', quantity: 1 };
    const match = text.match(/^(.*?)\s+(?:(?:x(\d+))|(?:qty\s+(\d+)))$/i);
    if (!match || !match[1].trim()) return { itemQuery: text, quantity: 1 };
    return {
        itemQuery: match[1].trim(),
        quantity: Math.max(1, Number.parseInt(match[2] ?? match[3], 10) || 1),
    };
}

function createInventoryItemFromShopItem(item, shopPoi, catalog) {
    const baseItem = {
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
    return baseItem.kind === 'equipment' ? enrichEquipmentItem(baseItem) : baseItem;
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
