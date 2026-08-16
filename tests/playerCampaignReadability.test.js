import test from 'node:test';
import assert from 'node:assert/strict';

import { getServiceJourney, getTransportService } from '../js/text/data/routeCatalog.js';
import { createNewGameState } from '../js/text/gameState.js';
import { advanceActiveActivityToCompletion } from '../js/text/systems/activityAdvanceEngine.js';
import {
    acceptCommitment,
    performCommitmentFollowUp,
    resolveCommitment,
} from '../js/text/systems/commitmentEngine.js';
import {
    advanceSimulationWithDayPolicy,
    ensureDayCycleState,
} from '../js/text/systems/dayCycleEngine.js';
import { equipItem } from '../js/text/systems/equipmentEngine.js';
import { startGatheringWork } from '../js/text/systems/gatheringWorkEngine.js';
import { moveWithinLocality, performLocalityPoiAction } from '../js/text/systems/localityEngine.js';
import { claimOriginStarterKit } from '../js/text/systems/playerExperienceEngine.js';
import { startProductionWork } from '../js/text/systems/productionEngine.js';
import { setEndOfDayPause } from '../js/text/systems/simulationControlEngine.js';
import { startScheduledTransport } from '../js/text/systems/transportEngine.js';
import { startTravel } from '../js/text/systems/travelEngine.js';
import { SECONDS_PER_DAY } from '../js/text/systems/worldTimeEngine.js';
import { renderGameScreen } from '../js/text/ui/domRenderer.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { createUiState } from '../js/text/ui/uiState.js';

const COMMITMENT_ID = 'commitment-brasshaven-copper-return';
const CAMPAIGN_ID = 'campaign-copper-trail-clasp';
const LONG_ROAD_SERVICE_ID = 'service-forge-mere-caravan';

function model(state) {
    return createGameViewModel(state, createUiState({ screen: 'game', activeView: 'journal' }));
}

function entry(view, id) {
    return view.opportunities.entries.find((candidate) => candidate.id === id) ?? null;
}

function category(view, categoryId) {
    return view.opportunities.entries.find((candidate) => candidate.category === categoryId) ?? null;
}

function fareFor(serviceId, fromPlaceId, toPlaceId) {
    const service = getTransportService(serviceId);
    const journey = getServiceJourney(serviceId, fromPlaceId, toPlaceId);
    assert.ok(service && journey);
    return service.fare.baseAmount + service.fare.perSegmentAmount * journey.segmentCount;
}

function finishPx4ThroughFollowUp(state) {
    assert.equal(performLocalityPoiAction(state, 'poi-bastok-markets-rabid-wolf', 'talk').ok, true);
    assert.equal(claimOriginStarterKit(state).ok, true);
    assert.match(equipItem(state, 'prospector-pick'), /Equipped/);
    assert.equal(acceptCommitment(state, COMMITMENT_ID).ok, true);

    let view = model(state);
    let work = category(view, 'livelihood');
    assert.equal(work.action?.intent, 'travel.start');
    assert.equal(startTravel(state, work.action.payload.destinationId).ok, true);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);

    view = model(state);
    work = category(view, 'livelihood');
    assert.equal(work.action?.intent, 'gathering.start');
    assert.equal(startGatheringWork(state, work.action.payload.sourceId, { quantity: work.action.payload.quantity }).ok, true);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);

    view = model(state);
    work = category(view, 'livelihood');
    assert.equal(work.action?.intent, 'travel.start');
    assert.equal(startTravel(state, work.action.payload.destinationId).ok, true);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);

    view = model(state);
    work = category(view, 'livelihood');
    assert.equal(work.action?.intent, 'locality.poi');
    assert.equal(performLocalityPoiAction(state, work.action.payload.poiId, work.action.payload.action).ok, true);

    view = model(state);
    work = category(view, 'livelihood');
    assert.equal(work.action?.intent, 'production.start');
    assert.equal(startProductionWork(state, work.action.payload.processId).ok, true);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);

    assert.equal(resolveCommitment(state, COMMITMENT_ID).ok, true);
    setEndOfDayPause(state, false);
    ensureDayCycleState(state);
    assert.equal(advanceSimulationWithDayPolicy(state, SECONDS_PER_DAY).ok, true);
    assert.equal(performCommitmentFollowUp(state, COMMITMENT_ID).ok, true);
    return state;
}

test('PX5 groups and ranks only acquired opportunities without persisting a campaign-readability registry', () => {
    const state = createNewGameState({ nationId: 'brasshaven' });
    assert.equal(performLocalityPoiAction(state, 'poi-bastok-markets-rabid-wolf', 'talk').ok, true);

    // The broader view model is allowed to lazily normalize existing canonical authorities.
    // Once that established normalization has occurred, the PX5 readability projection itself
    // must be stable and must not create a new persisted registry.
    const view = model(state);
    const normalizedState = JSON.stringify(state);
    const secondView = model(state);

    assert.equal(view.opportunities.campaignReadabilityVersion, 1);
    assert.ok(Array.isArray(view.opportunities.groups));
    assert.ok(view.opportunities.groups.some((group) => group.label === 'Redstone Reach' && group.current));
    assert.equal(view.opportunities.groups.some((group) => group.label === 'Starfen'), false);
    assert.equal(entry(view, CAMPAIGN_ID), null);
    assert.doesNotMatch(view.opportunities.prompt, /Tall Reedbed|source-west-starfen-reedbed/i);
    assert.match(view.opportunities.prompt, /acquired knowledge/i);
    assert.match(view.opportunities.prompt, /Unknown places, routes, contacts, and resource sites are omitted/i);

    const actionable = view.opportunities.entries.filter((candidate) => ['active', 'ready'].includes(candidate.status) && candidate.action);
    assert.ok(actionable.length >= 2, 'the first-day Journal should retain several understandable choices');
    assert.ok(view.opportunities.entries.every((candidate) => candidate.regionLabel || candidate.groupKind === 'continuity'));
    assert.equal(JSON.stringify(state), normalizedState, 'repeated readability projection must not mutate normalized canonical state');
    assert.deepEqual(secondView.opportunities.groups, view.opportunities.groups);
    assert.equal(state.playerCampaignReadability, undefined);
    assert.equal(state.campaignReadability, undefined);

    const html = renderGameScreen(view, createUiState({ screen: 'game', activeView: 'journal' }));
    assert.match(html, /Redstone Reach ·/);
    assert.doesNotMatch(html, /Tall Reedbed|source-west-starfen-reedbed/i);
});

test('PX5 turns Varric follow-up into an honest semantic Brasshaven to Starfen route without revealing the remote source early', () => {
    const state = finishPx4ThroughFollowUp(createNewGameState({ nationId: 'brasshaven' }));

    let view = model(state);
    assert.ok(view.opportunities.groups.some((group) => group.label === 'Redstone Reach' && group.current));
    assert.ok(view.opportunities.groups.some((group) => group.label === 'Starfen'));
    let campaign = entry(view, CAMPAIGN_ID);
    assert.ok(campaign);
    assert.equal(campaign.regionLabel, 'Starfen');
    assert.equal(campaign.linkedAmbition, 'Copper Trail Clasp');
    assert.equal(campaign.knowledgeSource, 'Marshal Varric Stone follow-up');
    assert.equal(campaign.action?.intent, 'locality.move');
    assert.equal(campaign.action?.payload.destinationId, 'brasshaven-iron-quay');
    assert.doesNotMatch(`${campaign.title} ${campaign.summary} ${campaign.progress}`, /Tall Reedbed|source-west-starfen-reedbed/i);

    const competing = view.opportunities.entries.filter((candidate) => candidate.id !== CAMPAIGN_ID
        && ['active', 'ready', 'available'].includes(candidate.status));
    assert.ok(competing.length >= 1, 'the Starfen horizon must remain one option among other known goals');

    assert.equal(moveWithinLocality(state, 'brasshaven-iron-quay').ok, true);
    view = model(state);
    campaign = entry(view, CAMPAIGN_ID);

    // PX4 leaves 36 gil; the real Forge-Mere fare is 52. PX5 should not hide that
    // economy constraint or manufacture a free route merely to keep the quest arrow moving.
    const fare = fareFor(LONG_ROAD_SERVICE_ID, 'brasshaven-iron-quay', 'mistmere-reedport');
    assert.equal(fare, 52);
    assert.equal(state.player.wallet.gil, 36);
    assert.equal(campaign.status, 'blocked');
    assert.equal(campaign.action, null);
    assert.ok(campaign.blockers.some((blocker) => blocker.includes('52 gil') && blocker.includes('36')));
    assert.doesNotMatch(`${campaign.title} ${campaign.summary} ${campaign.progress}`, /Tall Reedbed|source-west-starfen-reedbed/i);

    // Give this focused readiness fixture exactly the missing canonical funds. The same
    // projection must now expose the existing scheduled-transport authority directly.
    state.player.wallet.gil = fare;
    view = model(state);
    campaign = entry(view, CAMPAIGN_ID);
    assert.equal(campaign.status, 'ready');
    assert.equal(campaign.action?.intent, 'transport.start');
    assert.equal(campaign.action?.payload.serviceId, LONG_ROAD_SERVICE_ID);
    assert.equal(campaign.action?.payload.destinationPlaceId, 'mistmere-reedport');

    const booked = startScheduledTransport(state, campaign.action.payload.serviceId, campaign.action.payload.destinationPlaceId);
    assert.equal(booked.ok, true, booked.display?.text ?? booked.reason);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.currentPlaceId, 'mistmere-reedport');

    view = model(state);
    campaign = entry(view, CAMPAIGN_ID);
    assert.equal(campaign.action?.intent, 'travel.start');
    assert.equal(campaign.action?.payload.destinationId, 'west-starfen');
    assert.doesNotMatch(`${campaign.title} ${campaign.summary} ${campaign.progress}`, /Tall Reedbed|source-west-starfen-reedbed/i);

    assert.equal(startTravel(state, campaign.action.payload.destinationId).ok, true);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.currentPlaceId, 'west-starfen');

    view = model(state);
    campaign = entry(view, CAMPAIGN_ID);
    assert.equal(campaign.status, 'blocked');
    assert.equal(campaign.action, null);
    assert.match(campaign.title, /Starfen/i);
    assert.match(campaign.summary, /Tall Reedbed/i);
    assert.ok(campaign.blockers.some((blocker) => /cutting|tool/i.test(blocker)));
    assert.equal(state.atlas['west-starfen'] !== undefined, true);
});
