import test from 'node:test';
import assert from 'node:assert/strict';

import { createNewGameState } from '../js/text/gameState.js';
import { advanceActiveActivityToCompletion } from '../js/text/systems/activityAdvanceEngine.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { startCampaignRecovery } from '../js/text/systems/campaignRecoveryEngine.js';
import { startGatheringWork } from '../js/text/systems/gatheringWorkEngine.js';
import { performLocalityPoiAction } from '../js/text/systems/localityEngine.js';
import { createSettlementServiceBoard } from '../js/text/systems/settlementServiceBoardEngine.js';
import { buyFromCurrentShopAction, sellToCurrentShopAction } from '../js/text/systems/shopEngine.js';
import { startTravel } from '../js/text/systems/travelEngine.js';
import { validateWorldData } from '../js/text/systems/validation.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

function quantity(state, itemId) {
    return state.player.inventory
        .filter((item) => item.id === itemId || item.templateId === itemId)
        .reduce((sum, item) => sum + Math.max(1, Number(item.quantity) || 1), 0);
}

test('Slatewater Waylodge turns nearby field work into trade, provisions, safe rest, and onward travel', () => {
    const state = createNewGameState({ nationId: 'thornwall', name: 'Slatewater Field Auditor' });
    state.player.wallet.gil = 20;
    advanceWorldTime(state, 8 * 60 * 60);
    setPositionAndDiscover(state, 'slatewater-foothills', { x: 5, y: 4 });

    const gather = startGatheringWork(state, 'source-slatewater-serviceberry-brake');
    assert.equal(gather.ok, true, gather.display?.text ?? gather.reason);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(quantity(state, 'item-slatewater-serviceberry'), 1);

    const travel = startTravel(state, 'slatewater-waylodge');
    assert.equal(travel.ok, true, travel.display?.text ?? travel.reason);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.currentPlaceId, 'slatewater-waylodge');

    const exchange = performLocalityPoiAction(state, 'poi-slatewater-waylodge-exchange', 'shop');
    assert.equal(exchange.ok, true, exchange.display?.text ?? exchange.reason);

    let board = createSettlementServiceBoard(state);
    assert.equal(board.available, true);
    assert.equal(board.trade.currentShop.poiId, 'poi-slatewater-waylodge-exchange');
    assert.ok(board.trade.buyOffers.some((offer) => offer.itemId === 'flask-of-water'));
    assert.ok(board.trade.buyOffers.some((offer) => offer.itemId === 'item-slatewater-blue-slate'));

    const berryOffer = board.trade.sellOffers.find((offer) => offer.itemId === 'item-slatewater-serviceberry');
    assert.ok(berryOffer, 'the lodge exchange should buy nearby provenance-bearing field goods');
    assert.equal(berryOffer.unitPriceGil, 3);

    const sold = sellToCurrentShopAction(state, berryOffer.action.payload.itemQuery, berryOffer.action.payload.shopQuery);
    assert.equal(sold.ok, true, sold.display?.text ?? sold.reason);
    assert.equal(sold.data.gilEarned, 3);
    assert.equal(state.player.wallet.gil, 23);
    assert.equal(quantity(state, 'item-slatewater-serviceberry'), 0);

    board = createSettlementServiceBoard(state);
    const water = board.trade.buyOffers.find((offer) => offer.itemId === 'flask-of-water');
    assert.ok(water?.action);
    const bought = buyFromCurrentShopAction(state, water.action.payload.itemQuery, water.action.payload.shopQuery);
    assert.equal(bought.ok, true, bought.display?.text ?? bought.reason);
    assert.equal(state.player.wallet.gil, 15);
    assert.equal(quantity(state, 'flask-of-water'), 1);

    state.player.resources.hp = Math.max(1, state.player.resources.hp - 20);
    board = createSettlementServiceBoard(state);
    assert.equal(board.recovery.available, true, 'danger-0 travel hub should provide the lodge safe-rest path');
    assert.equal(startCampaignRecovery(state).ok, true);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.player.resources.hp, createSettlementServiceBoard(state).recovery.maxHp);

    const stableyard = performLocalityPoiAction(state, 'poi-slatewater-waylodge-stableyard', 'travel');
    assert.equal(stableyard.ok, true, stableyard.message ?? stableyard.reason);
    assert.match(stableyard.message ?? '', /Stableyard|stabling|pack animals/i);
});

test('Slatewater map, lodge, wilderness, and local connection validate as canonical world data', () => {
    assert.deepEqual(validateWorldData(), []);
});
