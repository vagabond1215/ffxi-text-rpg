import test from 'node:test';
import assert from 'node:assert/strict';

import { createNewGameState } from '../js/text/gameState.js';
import { advanceActiveActivityToCompletion } from '../js/text/systems/activityAdvanceEngine.js';
import {
    acceptCommitment,
    getCommitmentRecord,
    performCommitmentFollowUp,
    resolveCommitment,
} from '../js/text/systems/commitmentEngine.js';
import {
    advanceSimulationWithDayPolicy,
    ensureDayCycleState,
} from '../js/text/systems/dayCycleEngine.js';
import { equipItem } from '../js/text/systems/equipmentEngine.js';
import { startGatheringWork } from '../js/text/systems/gatheringWorkEngine.js';
import { performLocalityPoiAction } from '../js/text/systems/localityEngine.js';
import { claimOriginStarterKit } from '../js/text/systems/playerExperienceEngine.js';
import { startProductionWork } from '../js/text/systems/productionEngine.js';
import { getNpcRelationship } from '../js/text/systems/relationshipEngine.js';
import { setEndOfDayPause } from '../js/text/systems/simulationControlEngine.js';
import { startTravel } from '../js/text/systems/travelEngine.js';
import { SECONDS_PER_DAY } from '../js/text/systems/worldTimeEngine.js';
import { renderGameScreen } from '../js/text/ui/domRenderer.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { createUiState } from '../js/text/ui/uiState.js';

const COMMITMENT_ID = 'commitment-brasshaven-copper-return';

function livelihood(model) {
    return model.opportunities.entries.find((entry) => entry.category === 'livelihood');
}

function commitment(model) {
    return model.opportunities.entries.find((entry) => entry.category === 'commitment');
}

function model(state) {
    return createGameViewModel(state, createUiState({ screen: 'game', activeView: 'journal' }));
}

test('PX4 turns the proven Brasshaven copper loop into persistent commitment and next-day social continuity', () => {
    let state = createNewGameState({ nationId: 'brasshaven' });
    assert.equal(performLocalityPoiAction(state, 'poi-bastok-markets-rabid-wolf', 'talk').ok, true);
    assert.equal(claimOriginStarterKit(state).ok, true);
    assert.match(equipItem(state, 'prospector-pick'), /Equipped/);

    let view = model(state);
    let contract = commitment(view);
    assert.ok(contract);
    assert.equal(contract.status, 'ready');
    assert.equal(contract.action.intent, 'commitment.accept');
    assert.equal(contract.action.payload.commitmentId, COMMITMENT_ID);
    assert.equal(acceptCommitment(state, COMMITMENT_ID).ok, true);

    // Prove the new authority is plain persisted game state rather than UI-owned state.
    state = JSON.parse(JSON.stringify(state));
    assert.equal(state.version, 5);
    assert.equal(getCommitmentRecord(state, COMMITMENT_ID).status, 'active');

    view = model(state);
    contract = commitment(view);
    assert.equal(contract.status, 'active');
    let work = livelihood(view);
    assert.equal(work.status, 'ready');
    assert.equal(work.action.intent, 'travel.start');

    assert.equal(startTravel(state, work.action.payload.destinationId).ok, true);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.currentPlaceId, 'south-redstone-reach');

    view = model(state);
    work = livelihood(view);
    assert.equal(work.action.intent, 'gathering.start');
    assert.equal(work.action.payload.quantity, 2);
    assert.equal(startGatheringWork(state, work.action.payload.sourceId, { quantity: work.action.payload.quantity }).ok, true);

    view = model(state);
    work = livelihood(view);
    assert.equal(work.status, 'active');
    assert.equal(view.opportunities.recommendedOpportunityId, work.id, 'active Finish action outranks unrelated ready leads');
    assert.equal(view.contextualActions[0].intent, 'activity.advanceToCompletion');
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);

    view = model(state);
    work = livelihood(view);
    assert.equal(work.action.intent, 'travel.start');
    assert.equal(startTravel(state, work.action.payload.destinationId).ok, true);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.currentPlaceId, 'brasshaven-market-ring');

    view = model(state);
    work = livelihood(view);
    assert.equal(work.action.intent, 'locality.poi');
    assert.equal(performLocalityPoiAction(state, work.action.payload.poiId, work.action.payload.action).ok, true);

    view = model(state);
    work = livelihood(view);
    assert.equal(work.action.intent, 'production.start');
    assert.equal(startProductionWork(state, work.action.payload.processId).ok, true);

    view = model(state);
    work = livelihood(view);
    assert.equal(work.status, 'active');
    assert.equal(view.opportunities.recommendedOpportunityId, work.id);
    assert.equal(view.contextualActions[0].intent, 'activity.advanceToCompletion');
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);

    view = model(state);
    contract = commitment(view);
    assert.equal(contract.status, 'ready');
    assert.equal(contract.action.intent, 'commitment.resolve');
    assert.equal(view.opportunities.recommendedOpportunityId, contract.id);
    assert.equal(view.contextualActions[0].intent, 'commitment.resolve');

    const gilBefore = state.player.wallet.gil;
    const resolved = resolveCommitment(state, COMMITMENT_ID);
    assert.equal(resolved.ok, true, resolved.display?.text ?? resolved.reason);
    assert.equal(state.player.wallet.gil, gilBefore + 36);
    assert.equal(state.player.inventory.some((item) => item.id === 'item-redstone-copper-ingot'), false);
    assert.deepEqual(getNpcRelationship(state, 'npc-brasshaven-marshal-varric-stone').dimensions, {
        familiarity: 1,
        respect: 2,
        trust: 0,
        obligation: 0,
    });

    const repeated = resolveCommitment(state, COMMITMENT_ID);
    assert.equal(repeated.outcome, 'unchanged');
    assert.equal(state.player.wallet.gil, gilBefore + 36);

    setEndOfDayPause(state, false);
    ensureDayCycleState(state);
    assert.equal(advanceSimulationWithDayPolicy(state, SECONDS_PER_DAY).ok, true);

    view = model(state);
    assert.ok(view.dayReview);
    assert.equal(view.dayReview.eventTypeCounts['commitment.resolved'], 1);
    assert.equal(view.dayReview.eventTypeCounts['relationship.changed'], 1);
    assert.equal(view.dayReview.categoryCounts.commitments, 2);
    assert.equal(view.dayReview.categoryCounts.relationships, 1);

    const review = view.opportunities.entries.find((entry) => entry.category === 'day-review');
    assert.ok(review);
    assert.equal(review.status, 'complete');
    assert.equal(review.action, null);
    assert.notEqual(view.opportunities.recommendedOpportunityId, review.id);
    const journalHtml = renderGameScreen(view, createUiState({ screen: 'game', activeView: 'journal' }));
    assert.match(journalHtml, /Latest day review · Day 1/);
    assert.match(journalHtml, /1 commitment resolution/);
    assert.match(journalHtml, /1 relationship change/);
    assert.match(journalHtml, /Commitments 2 · Relationships 1/);

    contract = commitment(view);
    assert.equal(contract.status, 'ready');
    assert.equal(contract.action.intent, 'commitment.followUp');
    assert.equal(view.opportunities.recommendedOpportunityId, contract.id);

    const competingActions = view.opportunities.entries.filter((entry) => entry.id !== contract.id
        && entry.action
        && ['ready', 'active', 'available'].includes(entry.status));
    assert.ok(competingActions.length >= 1, 'the next-day social follow-up must compete with another valid use of character time');

    const followUp = performCommitmentFollowUp(state, COMMITMENT_ID);
    assert.equal(followUp.ok, true, followUp.display?.text ?? followUp.reason);
    assert.match(followUp.display.text, /remembers the copper/i);
    assert.match(followUp.display.text, /Starfen reed fiber/i);
    assert.equal(getNpcRelationship(state, 'npc-brasshaven-marshal-varric-stone').dimensions.familiarity, 2);

    view = model(state);
    contract = commitment(view);
    assert.equal(contract.status, 'complete');
    assert.match(contract.progress, /Starfen/i);
});
