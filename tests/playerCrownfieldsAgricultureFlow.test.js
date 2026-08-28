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

test('Crownfields turns managed field production into Grange trade, provisions, recovery, and wagon logistics', () => {
    const state = createNewGameState({ nationId: 'thornwall', name: 'Crownfields Field Auditor' });
    state.player.wallet.gil = 20;
    advanceWorldTime(state, 8 * 60 * 60);
    setPositionAndDiscover(state, 'crownfields', { x: 5, y: 1 });

    const gather = startGatheringWork(state, 'source-crownfields-field-pea-row');
    assert.equal(gather.ok, true, gather.display?.text ?? gather.reason);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(quantity(state, 'item-crownfields-field-pea'), 1);

    const travel = startTravel(state, 'crownfields-grange');
    assert.equal(travel.ok, true, travel.display?.text ?? travel.reason);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.currentPlaceId, 'crownfields-grange');

    const exchange = performLocalityPoiAction(state, 'poi-crownfields-grange-exchange', 'shop');
    assert.equal(exchange.ok, true, exchange.message ?? exchange.reason);

    let board = createSettlementServiceBoard(state);
    assert.equal(board.available, true);
    assert.equal(board.trade.currentShop.poiId, 'poi-crownfields-grange-exchange');
    assert.ok(board.trade.buyOffers.some((offer) => offer.itemId === 'loaf-of-bread'));
    assert.ok(board.trade.buyOffers.some((offer) => offer.itemId === 'item-crownfields-dyers-woad'));

    const peaOffer = board.trade.sellOffers.find((offer) => offer.itemId === 'item-crownfields-field-pea');
    assert.ok(peaOffer, 'the Grange exchange should buy nearby provenance-bearing agricultural goods');
    assert.equal(peaOffer.unitPriceGil, 3);

    const sold = sellToCurrentShopAction(state, peaOffer.action.payload.itemQuery, peaOffer.action.payload.shopQuery);
    assert.equal(sold.ok, true, sold.display?.text ?? sold.reason);
    assert.equal(sold.data.gilEarned, 3);
    assert.equal(state.player.wallet.gil, 23);
    assert.equal(quantity(state, 'item-crownfields-field-pea'), 0);

    board = createSettlementServiceBoard(state);
    const bread = board.trade.buyOffers.find((offer) => offer.itemId === 'loaf-of-bread');
    assert.ok(bread?.action);
    const bought = buyFromCurrentShopAction(state, bread.action.payload.itemQuery, bread.action.payload.shopQuery);
    assert.equal(bought.ok, true, bought.display?.text ?? bought.reason);
    assert.equal(state.player.wallet.gil, 13);
    assert.equal(quantity(state, 'loaf-of-bread'), 1);

    state.player.resources.hp = Math.max(1, state.player.resources.hp - 20);
    board = createSettlementServiceBoard(state);
    assert.equal(board.recovery.available, true);
    assert.equal(startCampaignRecovery(state).ok, true);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.player.resources.hp, createSettlementServiceBoard(state).recovery.maxHp);

    const wagonYard = performLocalityPoiAction(state, 'poi-crownfields-grange-wagon-yard', 'travel');
    assert.equal(wagonYard.ok, true, wagonYard.message ?? wagonYard.reason);
    assert.match(wagonYard.message ?? '', /wagon|stabling|produce/i);
});

test('Crownfields map, countryside, Grange, and local connection validate under Data 45 geography integrity rules', () => {
    assert.deepEqual(validateWorldData(), []);
});
