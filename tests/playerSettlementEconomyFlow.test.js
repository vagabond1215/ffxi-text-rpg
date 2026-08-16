import test from 'node:test';
import assert from 'node:assert/strict';

import { createNewGameState } from '../js/text/gameState.js';
import { createAccountWithPassword, loadCharacter, saveGame } from '../js/text/save.js';
import { advanceActiveActivityToCompletion } from '../js/text/systems/activityAdvanceEngine.js';
import { startCampaignRecovery } from '../js/text/systems/campaignRecoveryEngine.js';
import { equipItem } from '../js/text/systems/equipmentEngine.js';
import { startGatheringWork } from '../js/text/systems/gatheringWorkEngine.js';
import { performLocalityPoiAction } from '../js/text/systems/localityEngine.js';
import { claimOriginStarterKit } from '../js/text/systems/playerExperienceEngine.js';
import { startProductionWork } from '../js/text/systems/productionEngine.js';
import { createSettlementServiceBoard } from '../js/text/systems/settlementServiceBoardEngine.js';
import { sellToCurrentShopAction } from '../js/text/systems/shopEngine.js';
import { startTravel } from '../js/text/systems/travelEngine.js';
import { validateGameState } from '../js/text/systems/validation.js';
import { getWorkProficiency } from '../js/text/systems/workProficiencyEngine.js';
import { renderGameScreen } from '../js/text/ui/domRenderer.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { createUiState } from '../js/text/ui/uiState.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() {
    globalThis.localStorage = new MemoryStorage();
}

function quantity(state, itemId) {
    return state.player.inventory
        .filter((item) => item.id === itemId || item.templateId === itemId)
        .reduce((sum, item) => sum + Math.max(1, Number(item.quantity) || 1), 0);
}

function processEntry(state, processId = 'process-redstone-copper-ingot') {
    return createSettlementServiceBoard(state).production.find((entry) => entry.id === processId) ?? null;
}

test('0.7.200 settlement loop turns regional material into a semantic work-or-trade decision with persistent mastery', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Settlement Economy Audit', 'pwd', { persistentLogin: true }).ok, true);

    let state = createNewGameState({ nationId: 'brasshaven', name: 'Market Circuit Auditor' });
    assert.equal(performLocalityPoiAction(state, 'poi-bastok-markets-rabid-wolf', 'talk').ok, true);
    assert.equal(claimOriginStarterKit(state).ok, true);
    assert.match(equipItem(state, 'prospector-pick'), /Equipped/);

    assert.equal(startTravel(state, 'south-redstone-reach').ok, true);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(startGatheringWork(state, 'source-south-redstone-copper-seam', { quantity: 2 }).ok, true);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(quantity(state, 'item-redstone-copper-ore'), 2);

    assert.equal(startTravel(state, 'brasshaven-market-ring').ok, true);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);

    let board = createSettlementServiceBoard(state);
    assert.equal(board.available, true);
    assert.ok(board.workshops.some((entry) => entry.poiId === 'poi-bastok-markets-reinberta' && entry.stationTags.includes('forge')));
    let smelt = processEntry(state);
    assert.ok(smelt);
    assert.equal(smelt.status, 'needsWorkshop');
    assert.equal(smelt.action.intent, 'locality.poi');
    assert.equal(smelt.action.payload.poiId, 'poi-bastok-markets-reinberta');
    assert.equal(smelt.inputSellGil, 10);
    assert.equal(smelt.outputSellGil, 14);
    assert.equal(smelt.tradeDeltaGil, 4);
    assert.equal(smelt.durationSeconds, 300);

    assert.equal(performLocalityPoiAction(state, smelt.action.payload.poiId, smelt.action.payload.action).ok, true);
    board = createSettlementServiceBoard(state);
    smelt = processEntry(state);
    assert.equal(smelt.status, 'ready');
    assert.equal(smelt.action.intent, 'production.start');
    assert.equal(board.trade.currentShop.poiId, 'poi-bastok-markets-carmelide', 'the I-8 workshop coordinate should also expose the real Mae Oris merchant');
    assert.ok(board.trade.buyOffers.some((offer) => offer.action?.intent === 'shop.buy'));

    const beforeWork = state.time.totalSeconds;
    const started = startProductionWork(state, smelt.action.payload.processId, { containerId: smelt.action.payload.containerId });
    assert.equal(started.ok, true, started.display?.text ?? started.reason);
    assert.equal(quantity(state, 'item-redstone-copper-ore'), 0, 'materials remain owned by production once work begins');
    assert.equal(processEntry(state).status, 'active');
    assert.equal(processEntry(state).action.intent, 'activity.advanceToCompletion');
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.time.totalSeconds - beforeWork, 300);
    assert.equal(quantity(state, 'item-redstone-copper-ingot'), 1);
    assert.equal(getWorkProficiency(state.player, 'metalworking'), 2);
    assert.equal(processEntry(state).durationSeconds, 295, 'settlement presentation should reflect persistent mastery efficiency');

    const ingot = state.player.inventory.find((item) => item.id === 'item-redstone-copper-ingot');
    assert.ok(ingot.provenance.some((entry) => entry.sourceId === 'process-redstone-copper-ingot'));
    assert.ok(ingot.provenance[0].data.inputSources.some((entry) => entry.itemId === 'item-redstone-copper-ore'));

    board = createSettlementServiceBoard(state);
    const ingotOffer = board.trade.sellOffers.find((offer) => offer.itemId === 'item-redstone-copper-ingot');
    assert.ok(ingotOffer);
    assert.equal(ingotOffer.unitPriceGil, 14);
    assert.equal(ingotOffer.action.intent, 'shop.sell');

    const walletBeforeSale = state.player.wallet.gil;
    const sold = sellToCurrentShopAction(state, ingotOffer.action.payload.itemQuery, ingotOffer.action.payload.shopQuery);
    assert.equal(sold.ok, true, sold.display?.text ?? sold.reason);
    assert.equal(sold.data.gilEarned, 14);
    assert.equal(state.player.wallet.gil, walletBeforeSale + 14);
    assert.equal(quantity(state, 'item-redstone-copper-ingot'), 0);
    const duplicateSale = sellToCurrentShopAction(state, ingotOffer.action.payload.itemQuery, ingotOffer.action.payload.shopQuery);
    assert.equal(duplicateSale.ok, false);
    assert.equal(state.player.wallet.gil, walletBeforeSale + 14, 'a sold item cannot pay twice');

    state.player.resources.hp = Math.max(1, state.player.resources.hp - 20);
    board = createSettlementServiceBoard(state);
    assert.equal(board.recovery.available, true);
    assert.equal(board.recovery.durationSeconds, 3600);
    assert.equal(board.recovery.action.intent, 'recovery.start');
    const recoveryStartedAt = state.time.totalSeconds;
    assert.equal(startCampaignRecovery(state).ok, true);
    assert.equal(createSettlementServiceBoard(state).recovery.action.intent, 'activity.advanceToCompletion');
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.time.totalSeconds - recoveryStartedAt, 3600);
    assert.equal(state.player.resources.hp, createSettlementServiceBoard(state).recovery.maxHp);

    const html = renderGameScreen(
        createGameViewModel(state, createUiState({ screen: 'game', activeView: 'craft' })),
        createUiState({ screen: 'game', activeView: 'craft' }),
    );
    assert.match(html, /Work, Trade &amp; Recover/);
    assert.match(html, /Smelt Redstone Copper/);
    assert.match(html, /materials 10 gil → output 14 gil \(\+4 gil\)/);
    assert.match(html, /data-service-action=/);
    assert.doesNotMatch(html, /data-command="production"/);
    assert.doesNotMatch(html, /canonical authority|semantic event|exactly once/i);

    const walletAfterLoop = state.player.wallet.gil;
    const timeAfterLoop = state.time.totalSeconds;
    assert.equal(saveGame(state), true);
    state = loadCharacter('Market Circuit Auditor');
    assert.ok(state);
    assert.equal(state.player.wallet.gil, walletAfterLoop);
    assert.equal(state.time.totalSeconds, timeAfterLoop);
    assert.equal(getWorkProficiency(state.player, 'metalworking'), 2);
    assert.equal(quantity(state, 'item-redstone-copper-ingot'), 0);
    assert.deepEqual(validateGameState(state), []);
});
