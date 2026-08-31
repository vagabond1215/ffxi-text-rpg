import test from 'node:test';
import assert from 'node:assert/strict';
import { moveToKnownLocality, useKnownPoi } from './helpers/localKnowledgeTestSupport.js';

import { getNation } from '../js/text/data/nations.js';
import { createNewGameState } from '../js/text/gameState.js';
import { createAccountWithPassword, loadCharacter, saveGame } from '../js/text/save.js';
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
import { moveWithinLocality, performLocalityPoiAction } from '../js/text/systems/localityEngine.js';
import { claimOriginStarterKit } from '../js/text/systems/playerExperienceEngine.js';
import { getNpcRelationship } from '../js/text/systems/relationshipEngine.js';
import { setEndOfDayPause } from '../js/text/systems/simulationControlEngine.js';
import { startTravel } from '../js/text/systems/travelEngine.js';
import { validateGameState, validateWorldData } from '../js/text/systems/validation.js';
import { SECONDS_PER_DAY } from '../js/text/systems/worldTimeEngine.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { createUiState } from '../js/text/ui/uiState.js';

const COMMITMENT_ID = 'commitment-mistmere-marrowleaf-return';
const SOLI_NPC_ID = 'npc-mistmere-reader-soli-venn';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() {
    globalThis.localStorage = new MemoryStorage();
}

function model(state) {
    return createGameViewModel(state, createUiState({ screen: 'game', activeView: 'journal' }));
}

function category(view, categoryId) {
    return view.opportunities.entries.find((entry) => entry.category === categoryId) ?? null;
}

function commitment(view) {
    return view.opportunities.entries.find((entry) => entry.category === 'commitment'
        && entry.action?.payload?.commitmentId === COMMITMENT_ID)
        ?? view.opportunities.entries.find((entry) => entry.id.includes(COMMITMENT_ID))
        ?? null;
}

function quantity(state, itemId) {
    return (state.player.inventoryState?.containers?.inventory?.items ?? [])
        .filter((item) => item.id === itemId || item.templateId === itemId)
        .reduce((total, item) => total + Math.max(1, Number(item.quantity) || 1), 0);
}

test('PX7 gives Mistmere a second persistent community loop without collapsing Starfen into one breadcrumb', () => {
    installStorage();
    assert.equal(createAccountWithPassword('PX7 Save Audit', 'pwd', { persistentLogin: true }).ok, true);

    let state = createNewGameState({ nationId: 'mistmere', name: 'Fen Auditor' });
    assert.ok(state.npcs.some((npc) => npc.id === SOLI_NPC_ID), 'Reader Soli Venn should be a persistent NPC-backed contact');
    assert.equal(commitment(model(state)), null, 'the commitment should not appear before Soli is actually known');

    assert.equal(useKnownPoi(state, 'poi-waters-dagoza-beruza', 'talk').ok, true);
    const starterItemId = getNation('mistmere').startingEquipmentIds[0];
    assert.equal(claimOriginStarterKit(state).ok, true);
    assert.match(equipItem(state, starterItemId), /Equipped/);

    let view = model(state);
    let soliWork = commitment(view);
    assert.ok(soliWork);
    assert.match(soliWork.title, /Starfen · Marrowleaf for the Ward$/);
    assert.equal(soliWork.status, 'ready');
    assert.equal(soliWork.action?.intent, 'commitment.accept');
    assert.equal(soliWork.action?.payload.commitmentId, COMMITMENT_ID);
    assert.ok(view.opportunities.entries.some((entry) => entry.category === 'service' && entry.action), 'Kiri Fen/local service remains a competing practical choice');
    assert.ok(view.opportunities.entries.some((entry) => entry.category === 'exploration' && entry.action), 'Starfen exploration remains independently actionable');

    assert.equal(acceptCommitment(state, COMMITMENT_ID).ok, true);
    assert.equal(getCommitmentRecord(state, COMMITMENT_ID).status, 'active');

    view = model(state);
    let exploration = category(view, 'exploration');
    assert.equal(exploration.action?.intent, 'locality.explore');
    assert.equal(exploration.action?.payload.targetPlaceId, 'mistmere-reedport');
    assert.equal(moveToKnownLocality(state, exploration.action.payload.targetPlaceId).ok, true);

    view = model(state);
    exploration = category(view, 'exploration');
    assert.equal(exploration.action?.intent, 'travel.start');
    assert.equal(exploration.action?.payload.destinationId, 'west-starfen');
    assert.equal(startTravel(state, exploration.action.payload.destinationId).ok, true);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.currentPlaceId, 'west-starfen');

    view = model(state);
    soliWork = commitment(view);
    const training = category(view, 'training');
    const livelihood = category(view, 'livelihood');
    assert.ok(soliWork);
    assert.equal(soliWork.status, 'ready');
    assert.equal(soliWork.action?.intent, 'gathering.start');
    assert.equal(soliWork.action?.payload.sourceId, 'source-west-starfen-marrowleaf-bed');
    assert.equal(soliWork.action?.payload.quantity, 2);
    assert.equal(training.status, 'ready');
    assert.equal(training.action?.intent, 'combat.encounter');
    assert.equal(training.action?.payload.enemyId, 'enemy-starfen-rootling');
    assert.equal(livelihood.status, 'ready');
    assert.equal(livelihood.action?.intent, 'gathering.start');
    assert.notEqual(livelihood.action?.payload.sourceId, soliWork.action.payload.sourceId, 'ordinary reed work remains distinct from Soli’s Marrowleaf request');

    assert.equal(startGatheringWork(state, soliWork.action.payload.sourceId, { quantity: soliWork.action.payload.quantity }).ok, true);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(quantity(state, 'item-starfen-marrowleaf'), 2);
    const marrowleaf = state.player.inventory.find((item) => item.id === 'item-starfen-marrowleaf');
    assert.ok(marrowleaf?.provenance.some((entry) => entry.sourceId === 'source-west-starfen-marrowleaf-bed'));

    view = model(state);
    soliWork = commitment(view);
    assert.equal(soliWork.status, 'ready');
    assert.equal(soliWork.action?.intent, 'travel.start');
    assert.equal(soliWork.action?.payload.destinationId, 'mistmere-reedport');
    assert.equal(startTravel(state, soliWork.action.payload.destinationId).ok, true);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);

    view = model(state);
    soliWork = commitment(view);
    assert.equal(soliWork.action?.intent, 'locality.explore');
    assert.equal(soliWork.action?.payload.targetPlaceId, 'mistmere-canal-ward');
    assert.equal(moveToKnownLocality(state, soliWork.action.payload.targetPlaceId).ok, true);

    view = model(state);
    soliWork = commitment(view);
    assert.equal(soliWork.status, 'ready');
    assert.equal(soliWork.action?.intent, 'commitment.resolve');
    const gilBefore = state.player.wallet.gil;
    const resolved = resolveCommitment(state, COMMITMENT_ID);
    assert.equal(resolved.ok, true, resolved.display?.text ?? resolved.reason);
    assert.equal(state.player.wallet.gil, gilBefore + 24);
    assert.equal(quantity(state, 'item-starfen-marrowleaf'), 0, 'only the delivered, provenance-qualified Marrowleaf should be consumed');
    assert.deepEqual(getNpcRelationship(state, SOLI_NPC_ID).dimensions, {
        familiarity: 1,
        respect: 1,
        trust: 0,
        obligation: 0,
    });

    const repeatedResolution = resolveCommitment(state, COMMITMENT_ID);
    assert.equal(repeatedResolution.outcome, 'unchanged');
    assert.equal(state.player.wallet.gil, gilBefore + 24, 'delivery reward must remain exactly once');

    assert.equal(saveGame(state), true);
    state = loadCharacter('Fen Auditor');
    assert.ok(state);
    assert.equal(getCommitmentRecord(state, COMMITMENT_ID).status, 'resolved');
    assert.equal(getNpcRelationship(state, SOLI_NPC_ID).dimensions.respect, 1);

    setEndOfDayPause(state, false);
    ensureDayCycleState(state);
    assert.equal(advanceSimulationWithDayPolicy(state, SECONDS_PER_DAY).ok, true);
    assert.equal(saveGame(state), true);
    state = loadCharacter('Fen Auditor');
    assert.ok(state);

    view = model(state);
    soliWork = commitment(view);
    assert.equal(soliWork.status, 'ready');
    assert.equal(soliWork.action?.intent, 'commitment.followUp');
    assert.match(soliWork.progress, /rootlings/i);
    const competingAfterDay = view.opportunities.entries.filter((entry) => entry.id !== soliWork.id
        && entry.action
        && ['ready', 'active', 'available'].includes(entry.status));
    assert.ok(competingAfterDay.length >= 1, 'Soli’s later-day follow-up must remain one choice among other work, service, travel, or training goals');

    const followed = performCommitmentFollowUp(state, COMMITMENT_ID);
    assert.equal(followed.ok, true, followed.display?.text ?? followed.reason);
    assert.match(followed.display.text, /Marrowleaf/i);
    assert.match(followed.display.text, /rootlings/i);
    assert.equal(getNpcRelationship(state, SOLI_NPC_ID).dimensions.familiarity, 2);
    assert.equal(getNpcRelationship(state, SOLI_NPC_ID).dimensions.respect, 1);
    const repeatedFollowUp = performCommitmentFollowUp(state, COMMITMENT_ID);
    assert.equal(repeatedFollowUp.outcome, 'unchanged');
    assert.equal(getNpcRelationship(state, SOLI_NPC_ID).dimensions.familiarity, 2, 'follow-up relationship change must remain exactly once');

    assert.deepEqual(validateGameState(state), []);
    assert.deepEqual(validateWorldData(), []);
});
