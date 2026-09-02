import { getCanonicalItem } from '../data/canonicalItemRegistry.js';
import { enrichEquipmentItem } from '../data/equipmentCatalog.js';
import { getShopCatalogForPoi } from '../data/shopCatalogs.js';
import { getContextualPois } from '../data/pointsOfInterest.js';
import { actionFailure, actionSuccess, describeActionResult } from './actionResult.js';
import { canSellItem } from './itemBehaviorEngine.js';
import { addItemToContainer, findItemInContainer, removeItemQuantityFromContainer } from './inventoryEngine.js';
import { discoverPoi } from './poiEngine.js';
import { emitSemanticEvent } from './semanticEventEngine.js';

export function buyFromCurrentShop(state, itemQuery = '', shopQuery = '') {
    return describeActionResult(buyFromCurrentShopAction(state, itemQuery, shopQuery));
}

export function buyFromCurrentShopAction(state, itemQuery = '', shopQuery = '') {
    const shopPoi = findCurrentShopPoi(state, shopQuery);
    if (!shopPoi) return failure('shop.not-found', 'There is no matching shop at this coordinate.', { itemQuery, shopQuery });

    const catalog = getShopCatalogForPoi(shopPoi.id);
    if (!catalog) return failure('shop.catalog-missing', `${shopPoi.name} has no shop catalog yet.`, { shopPoiId: shopPoi.id });

    const item = findCatalogItem(catalog, itemQuery);
    if (!item) {
        return failure('shop.item-not-found', [
            `No matching item in ${catalog.name}: ${itemQuery || '<empty>'}`,
            'Available:',
            ...catalog.items.map((entry) => `- ${entry.name}: ${entry.priceGil} gil`),
        ].join('\n'), { shopPoiId: shopPoi.id, itemQuery });
    }

    const gil = state.player?.wallet?.gil ?? 0;
    if (gil < item.priceGil) {
        return failure('shop.insufficient-funds', `Not enough gil. ${item.name} costs ${item.priceGil} gil; you have ${gil}.`, {
            shopPoiId: shopPoi.id,
            itemId: item.id,
            priceGil: item.priceGil,
            gil,
        });
    }

    const inventoryState = state.player?.inventoryState;
    const purchaseItem = createInventoryItemFromShopItem(item, shopPoi, catalog);
    const addResult = addItemToContainer(inventoryState, 'inventory', purchaseItem);
    if (!addResult.ok) return failure('shop.storage-blocked', addResult.reason, { shopPoiId: shopPoi.id, itemId: item.id });

    state.player.wallet.gil -= item.priceGil;
    discoverPoi(state, shopPoi);
    const event = emitSemanticEvent(state, 'shop.purchase', {
        shopPoiId: shopPoi.id,
        catalogName: catalog.name,
        itemId: item.id,
        quantity: 1,
        gilSpent: item.priceGil,
        gilRemaining: state.player.wallet.gil,
    }, { source: 'shopEngine' });

    return actionSuccess({
        action: 'shop.buy',
        code: 'shop.purchased',
        outcome: 'purchased',
        data: {
            shopPoiId: shopPoi.id,
            itemId: item.id,
            quantity: 1,
            gilSpent: item.priceGil,
            gilRemaining: state.player.wallet.gil,
            eventId: event.id,
        },
        display: {
            text: [
                `Bought ${item.name} for ${item.priceGil} gil from ${shopPoi.name}.`,
                `Gil remaining: ${state.player.wallet.gil}`,
                'Stored in Inventory.',
            ].join('\n'),
        },
    });
}

export function sellToCurrentShop(state, itemQuery = '', shopQuery = '') {
    return describeActionResult(sellToCurrentShopAction(state, itemQuery, shopQuery));
}

export function sellToCurrentShopAction(state, itemQuery = '', shopQuery = '') {
    const shopPoi = findCurrentShopPoi(state, shopQuery);
    if (!shopPoi) return failure('shop.not-found', 'There is no matching shop at this coordinate.', { itemQuery, shopQuery });

    const catalog = getShopCatalogForPoi(shopPoi.id);
    if (!catalog) return failure('shop.catalog-missing', `${shopPoi.name} has no shop catalog yet.`, { shopPoiId: shopPoi.id });

    const inventoryState = state.player?.inventoryState;
    if (!inventoryState) return failure('shop.inventory-missing', 'No inventory container state found.', { shopPoiId: shopPoi.id });

    const request = parseSellRequest(itemQuery);
    if (!request.itemQuery) return failure('shop.sell-item-required', 'Sell what? Use: sell <item> [quantity].', { shopPoiId: shopPoi.id });

    const found = findItemInContainer(inventoryState, 'inventory', request.itemQuery);
    if (!found.ok) return failure('shop.item-not-found', found.reason, { shopPoiId: shopPoi.id, itemQuery: request.itemQuery });

    const eligibility = canSellItem(found.item, { shopPoi, catalog });
    if (!eligibility.ok) return failure('shop.item-not-sellable', eligibility.reason, { shopPoiId: shopPoi.id, itemId: found.item.id });

    const removeResult = removeItemQuantityFromContainer(inventoryState, 'inventory', request.itemQuery, request.quantity);
    if (!removeResult.ok) return failure('shop.quantity-unavailable', removeResult.reason, { shopPoiId: shopPoi.id, itemId: found.item.id, quantity: request.quantity });

    const gilEarned = eligibility.sellValueGil * removeResult.quantity;
    state.player.wallet.gil = (state.player.wallet.gil ?? 0) + gilEarned;
    discoverPoi(state, shopPoi);
    const event = emitSemanticEvent(state, 'shop.sale', {
        shopPoiId: shopPoi.id,
        catalogName: catalog.name,
        itemId: removeResult.item.id,
        quantity: removeResult.quantity,
        unitValueGil: eligibility.sellValueGil,
        gilEarned,
        gilNow: state.player.wallet.gil,
    }, { source: 'shopEngine' });

    return actionSuccess({
        action: 'shop.sell',
        code: 'shop.sold',
        outcome: 'sold',
        data: {
            shopPoiId: shopPoi.id,
            itemId: removeResult.item.id,
            quantity: removeResult.quantity,
            unitValueGil: eligibility.sellValueGil,
            gilEarned,
            gilNow: state.player.wallet.gil,
            eventId: event.id,
        },
        display: {
            text: [
                `Sold ${removeResult.item.name}${removeResult.quantity > 1 ? ` x${removeResult.quantity}` : ''} for ${gilEarned} gil.`,
                `Gil now: ${state.player.wallet.gil}`,
            ].join('\n'),
        },
    });
}

export function findCurrentShopPoi(state, shopQuery = '') {
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
    const canonical = getCanonicalItem(item.id);
    if (canonical) {
        const baseItem = {
            ...canonical,
            quantity: 1,
            source: {
                type: 'shop',
                poiId: shopPoi.id,
                shopName: catalog.name,
            },
            valueGil: item.priceGil,
            provenance: [{
                type: 'commerce',
                sourceId: shopPoi.id,
                placeId: shopPoi.placeId ?? null,
                action: 'purchase',
                data: { catalogName: catalog.name, priceGil: item.priceGil },
            }],
        };
        return baseItem.kind === 'equipment' ? enrichEquipmentItem(baseItem) : baseItem;
    }

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
    if (tags.includes('equipment') || tags.includes('tool') || tags.includes('weapon') || tags.includes('armor') || tags.includes('shield') || tags.includes('ring')) return 'equipment';
    if (tags.includes('consumable') || tags.includes('food')) return 'consumable';
    if (tags.includes('material')) return 'material';
    return 'misc';
}

function failure(code, text, data = {}) {
    return actionFailure({ action: 'shop', code, outcome: 'blocked', data, display: { text } });
}

function normalize(value) {
    return String(value ?? '').trim().toLowerCase().replace(/[’']/g, '').replace(/\s+/g, '-');
}
