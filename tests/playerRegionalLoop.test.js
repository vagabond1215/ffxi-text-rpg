import test from 'node:test';
import assert from 'node:assert/strict';

import { createNewGameState } from '../js/text/gameState.js';
import { advanceActiveActivityToCompletion } from '../js/text/systems/activityAdvanceEngine.js';
import { equipItem } from '../js/text/systems/equipmentEngine.js';
import { startGatheringWork } from '../js/text/systems/gatheringWorkEngine.js';
import { performLocalityPoiAction } from '../js/text/systems/localityEngine.js';
import { claimOriginStarterKit } from '../js/text/systems/playerExperienceEngine.js';
import { createPlayerOpportunityModel } from '../js/text/systems/playerOpportunityEngine.js';
import { startProductionWork } from '../js/text/systems/productionEngine.js';
import { startTravel } from '../js/text/systems/travelEngine.js';
import { getWorkProficiency } from '../js/text/systems/workProficiencyEngine.js';

function livelihood(state) {
    return createPlayerOpportunityModel(state).entries.find((entry) => entry.category === 'livelihood');
}

function inventoryQuantity(state, itemId) {
    return state.player.inventory
        .filter((item) => item.id === itemId || item.templateId === itemId)
        .reduce((sum, item) => sum + Math.max(1, Number(item.quantity) || 1), 0);
}

test('Brasshaven first regional loop leaves and returns with persistent material and mastery gains', () => {
    const state = createNewGameState({ nationId: 'brasshaven' });

    assert.equal(performLocalityPoiAction(state, 'poi-bastok-markets-rabid-wolf', 'talk').ok, true);
    assert.equal(claimOriginStarterKit(state).ok, true);
    assert.match(equipItem(state, 'prospector-pick'), /Equipped/);

    let step = livelihood(state);
    assert.equal(step.status, 'ready');
    assert.equal(step.action.intent, 'travel.start');
    assert.equal(step.action.payload.destinationId, 'south-redstone-reach');

    const outbound = startTravel(state, step.action.payload.destinationId);
    assert.equal(outbound.ok, true, outbound.display?.text ?? outbound.reason);
    const outboundFinish = advanceActiveActivityToCompletion(state);
    assert.equal(outboundFinish.ok, true, outboundFinish.display?.text ?? outboundFinish.reason);
    assert.equal(state.currentPlaceId, 'south-redstone-reach');

    step = livelihood(state);
    assert.equal(step.status, 'ready');
    assert.equal(step.action.intent, 'gathering.start');
    assert.equal(step.action.payload.sourceId, 'source-south-redstone-copper-seam');
    assert.equal(step.action.payload.quantity, 2);

    const gathering = startGatheringWork(state, step.action.payload.sourceId, { quantity: step.action.payload.quantity });
    assert.equal(gathering.ok, true, gathering.display?.text ?? gathering.reason);
    step = livelihood(state);
    assert.equal(step.status, 'active');
    assert.equal(step.action.intent, 'activity.advanceToCompletion');

    const gatheringFinish = advanceActiveActivityToCompletion(state);
    assert.equal(gatheringFinish.ok, true, gatheringFinish.display?.text ?? gatheringFinish.reason);
    assert.equal(inventoryQuantity(state, 'item-redstone-copper-ore'), 2);
    assert.equal(getWorkProficiency(state.player, 'mining'), 2);

    step = livelihood(state);
    assert.equal(step.status, 'ready');
    assert.equal(step.action.intent, 'travel.start');
    assert.equal(step.action.payload.destinationId, 'brasshaven-market-ring');

    const inbound = startTravel(state, step.action.payload.destinationId);
    assert.equal(inbound.ok, true, inbound.display?.text ?? inbound.reason);
    const inboundFinish = advanceActiveActivityToCompletion(state);
    assert.equal(inboundFinish.ok, true, inboundFinish.display?.text ?? inboundFinish.reason);
    assert.equal(state.currentPlaceId, 'brasshaven-market-ring');

    step = livelihood(state);
    assert.equal(step.status, 'ready');
    assert.equal(step.action.intent, 'locality.poi');
    assert.equal(step.action.payload.poiId, 'poi-bastok-markets-reinberta');
    assert.equal(performLocalityPoiAction(state, step.action.payload.poiId, step.action.payload.action).ok, true);

    step = livelihood(state);
    assert.equal(step.status, 'ready');
    assert.equal(step.action.intent, 'production.start');
    assert.equal(step.action.payload.processId, 'process-redstone-copper-ingot');

    const production = startProductionWork(state, step.action.payload.processId);
    assert.equal(production.ok, true, production.display?.text ?? production.reason);
    assert.equal(inventoryQuantity(state, 'item-redstone-copper-ore'), 0, 'production consumes ore at start');
    step = livelihood(state);
    assert.equal(step.status, 'active');
    assert.equal(step.action.intent, 'activity.advanceToCompletion');

    const productionFinish = advanceActiveActivityToCompletion(state);
    assert.equal(productionFinish.ok, true, productionFinish.display?.text ?? productionFinish.reason);
    assert.equal(inventoryQuantity(state, 'item-redstone-copper-ingot'), 1);
    assert.equal(getWorkProficiency(state.player, 'metalworking'), 2);

    step = livelihood(state);
    assert.equal(step.status, 'complete');
    assert.equal(step.action, null);
    assert.match(step.progress, /Copper Trail Clasp/);
    assert.match(step.progress, /Starfen reed fiber/);

    const ingot = state.player.inventory.find((item) => item.id === 'item-redstone-copper-ingot');
    assert.ok(ingot.provenance.some((entry) => entry.sourceId === 'process-redstone-copper-ingot'));
    assert.ok(ingot.provenance[0].data.inputSources.some((input) => input.itemId === 'item-redstone-copper-ore'));
});
