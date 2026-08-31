import test from 'node:test';
import assert from 'node:assert/strict';
import { useKnownPoi } from './helpers/localKnowledgeTestSupport.js';

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
import { lookAroundLocality, performLocalityPoiAction } from '../js/text/systems/localityEngine.js';
import { claimOriginStarterKit } from '../js/text/systems/playerExperienceEngine.js';
import { getNpcRelationship } from '../js/text/systems/relationshipEngine.js';
import { setEndOfDayPause } from '../js/text/systems/simulationControlEngine.js';
import { startTravel } from '../js/text/systems/travelEngine.js';
import { validateGameState, validateWorldData } from '../js/text/systems/validation.js';
import { SECONDS_PER_DAY } from '../js/text/systems/worldTimeEngine.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { createUiState } from '../js/text/ui/uiState.js';

const COMMITMENT_ID = 'commitment-thornwall-sweetroot-return';
const SERA_NPC_ID = 'npc-thornwall-sera-talwin';
const SWEETROOT_SOURCE_ID = 'source-west-elderwood-sweetroot-patch';
const AMBER_RESIN_SOURCE_ID = 'source-west-elderwood-amber-resin-grove';

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

test('PX8 gives Thornwall a third several-day community loop while Elderwood livelihood and danger remain independent choices', () => {
    installStorage();
    assert.equal(createAccountWithPassword('PX8 Save Audit', 'pwd', { persistentLogin: true }).ok, true);

    let state = createNewGameState({ nationId: 'thornwall', name: 'Woodroad Auditor' });
    assert.ok(state.npcs.some((npc) => npc.id === SERA_NPC_ID), 'Sera Talwin should be a persistent NPC-backed Thornwall contact');
    assert.equal(commitment(model(state)), null, 'Sera’s commitment should not appear before the player has actually met her');

    assert.equal(lookAroundLocality(state).ok, true);
    assert.equal(commitment(model(state)), null, 'sighting Sera still must not disclose her commitment before conversation');

    assert.equal(useKnownPoi(state, 'poi-sandoria-s-alaune', 'talk').ok, true);
    assert.equal(state.localKnowledge.pois['poi-sandoria-s-corua']?.knowledgeState, 'referenced', 'Sera should refer the player to Nessa without making Nessa directly locatable');
    assert.ok(state.localKnowledge.guidance.some((entry) => entry.targetId === 'poi-sandoria-s-corua'), 'the referral should create temporary search guidance');
    const starterItemId = getNation('thornwall').startingEquipmentIds[0];
    assert.equal(claimOriginStarterKit(state).ok, true);
    assert.match(equipItem(state, starterItemId), /Equipped/);

    let view = model(state);
    let seraWork = commitment(view);
    assert.ok(seraWork);
    assert.match(seraWork.title, /Elderwood · Sweetroot for Southgate$/);
    assert.equal(seraWork.status, 'ready');
    assert.equal(seraWork.action?.intent, 'commitment.accept');
    assert.equal(seraWork.action?.payload.commitmentId, COMMITMENT_ID);
    assert.ok(view.opportunities.entries.some((entry) => entry.category === 'service' && entry.action), 'Southgate service/preparation should remain a competing local choice');
    assert.ok(view.opportunities.entries.some((entry) => entry.category === 'exploration' && entry.action), 'West Elderwood exploration should remain independently actionable');

    assert.equal(acceptCommitment(state, COMMITMENT_ID).ok, true);
    assert.equal(getCommitmentRecord(state, COMMITMENT_ID).status, 'active');

    view = model(state);
    const exploration = category(view, 'exploration');
    assert.equal(exploration.action?.intent, 'travel.start');
    assert.equal(exploration.action?.payload.destinationId, 'west-elderwood');
    assert.equal(startTravel(state, exploration.action.payload.destinationId).ok, true);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.currentPlaceId, 'west-elderwood');

    view = model(state);
    seraWork = commitment(view);
    const livelihood = category(view, 'livelihood');
    const training = category(view, 'training');
    assert.ok(seraWork);
    assert.equal(seraWork.status, 'ready');
    assert.equal(seraWork.action?.intent, 'gathering.start');
    assert.equal(seraWork.action?.payload.sourceId, SWEETROOT_SOURCE_ID);
    assert.equal(seraWork.action?.payload.quantity, 2);
    assert.equal(livelihood.status, 'ready');
    assert.equal(livelihood.action?.intent, 'gathering.start');
    assert.equal(livelihood.action?.payload.sourceId, AMBER_RESIN_SOURCE_ID, 'ordinary Elderwood livelihood should remain the established Amber Resin route');
    assert.notEqual(livelihood.action.payload.sourceId, seraWork.action.payload.sourceId, 'Sera’s community need must not replace the ordinary livelihood choice');
    assert.equal(training.status, 'ready');
    assert.equal(training.action?.intent, 'combat.encounter');
    assert.equal(training.action?.payload.enemyId, 'enemy-brush-hare');

    assert.equal(startGatheringWork(state, SWEETROOT_SOURCE_ID, { quantity: 2 }).ok, true);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(quantity(state, 'item-elderwood-sweetroot'), 2);
    const sweetroot = state.player.inventory.find((item) => item.id === 'item-elderwood-sweetroot');
    assert.ok(sweetroot?.provenance.some((entry) => entry.sourceId === SWEETROOT_SOURCE_ID));

    view = model(state);
    seraWork = commitment(view);
    assert.equal(seraWork.status, 'ready');
    assert.equal(seraWork.action?.intent, 'travel.start');
    assert.equal(seraWork.action?.payload.destinationId, 'thornwall-southgate');
    assert.equal(startTravel(state, seraWork.action.payload.destinationId).ok, true);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.currentPlaceId, 'thornwall-southgate');

    view = model(state);
    seraWork = commitment(view);
    assert.equal(seraWork.status, 'ready');
    assert.equal(seraWork.action?.intent, 'commitment.resolve');
    const gilBefore = state.player.wallet.gil;
    const resolved = resolveCommitment(state, COMMITMENT_ID);
    assert.equal(resolved.ok, true, resolved.display?.text ?? resolved.reason);
    assert.equal(state.player.wallet.gil, gilBefore + 20);
    assert.equal(quantity(state, 'item-elderwood-sweetroot'), 0, 'only the delivered provenance-qualified Sweetroot should be consumed');
    assert.deepEqual(getNpcRelationship(state, SERA_NPC_ID).dimensions, {
        familiarity: 1,
        respect: 1,
        trust: 0,
        obligation: 0,
    });

    const repeatedResolution = resolveCommitment(state, COMMITMENT_ID);
    assert.equal(repeatedResolution.outcome, 'unchanged');
    assert.equal(state.player.wallet.gil, gilBefore + 20, 'Sweetroot payment must remain exactly once');

    assert.equal(saveGame(state), true);
    state = loadCharacter('Woodroad Auditor');
    assert.ok(state);
    assert.equal(getCommitmentRecord(state, COMMITMENT_ID).status, 'resolved');
    assert.equal(getNpcRelationship(state, SERA_NPC_ID).dimensions.respect, 1);

    setEndOfDayPause(state, false);
    ensureDayCycleState(state);
    assert.equal(advanceSimulationWithDayPolicy(state, SECONDS_PER_DAY).ok, true);
    assert.equal(saveGame(state), true);
    state = loadCharacter('Woodroad Auditor');
    assert.ok(state);

    view = model(state);
    seraWork = commitment(view);
    assert.equal(seraWork.status, 'ready');
    assert.equal(seraWork.action?.intent, 'commitment.followUp');
    assert.match(seraWork.progress, /resin/i);
    assert.match(seraWork.progress, /Brush Hares/i);
    const competingAfterDay = view.opportunities.entries.filter((entry) => entry.id !== seraWork.id
        && entry.action
        && ['ready', 'active', 'available'].includes(entry.status));
    assert.ok(competingAfterDay.length >= 1, 'Sera’s later-day follow-up must remain one choice among other livelihood, service, travel, or training goals');

    const followed = performCommitmentFollowUp(state, COMMITMENT_ID);
    assert.equal(followed.ok, true, followed.display?.text ?? followed.reason);
    assert.match(followed.display.text, /Sweetroot/i);
    assert.match(followed.display.text, /resin/i);
    assert.equal(getNpcRelationship(state, SERA_NPC_ID).dimensions.familiarity, 2);
    assert.equal(getNpcRelationship(state, SERA_NPC_ID).dimensions.respect, 1);
    const repeatedFollowUp = performCommitmentFollowUp(state, COMMITMENT_ID);
    assert.equal(repeatedFollowUp.outcome, 'unchanged');
    assert.equal(getNpcRelationship(state, SERA_NPC_ID).dimensions.familiarity, 2, 'follow-up relationship change must remain exactly once');

    assert.deepEqual(validateGameState(state), []);
    assert.deepEqual(validateWorldData(), []);
});