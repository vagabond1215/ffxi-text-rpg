import test from 'node:test';
import assert from 'node:assert/strict';

import { validateCommitmentCatalog } from '../js/text/data/commitments.js';
import { getProductionItem } from '../js/text/data/productionItems.js';
import { createNewGameState } from '../js/text/gameState.js';
import {
    createAccountWithPassword,
    loadCharacter,
    saveGame,
} from '../js/text/save.js';
import {
    acceptCommitment,
    getCommitmentRecord,
    isCommitmentFollowUpAvailable,
    performCommitmentFollowUp,
    resolveCommitment,
    validateCommitmentState,
} from '../js/text/systems/commitmentEngine.js';
import {
    advanceSimulationWithDayPolicy,
    ensureDayCycleState,
    getLatestDaySummary,
} from '../js/text/systems/dayCycleEngine.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { performLocalityPoiAction } from '../js/text/systems/localityEngine.js';
import { getNpcRelationship, validateRelationshipState } from '../js/text/systems/relationshipEngine.js';
import { listSemanticEvents } from '../js/text/systems/semanticEventEngine.js';
import { setEndOfDayPause } from '../js/text/systems/simulationControlEngine.js';
import { SECONDS_PER_DAY } from '../js/text/systems/worldTimeEngine.js';

const COMMITMENT_ID = 'commitment-brasshaven-copper-return';

class MemoryStorage {
    constructor() {
        this.values = new Map();
    }

    getItem(key) {
        return this.values.has(key) ? this.values.get(key) : null;
    }

    setItem(key, value) {
        this.values.set(key, String(value));
    }

    removeItem(key) {
        this.values.delete(key);
    }
}

function installStorage() {
    globalThis.localStorage = new MemoryStorage();
}

test('first commitment catalog is original, cross-linked, and new games own additive continuity state', () => {
    assert.deepEqual(validateCommitmentCatalog(), []);
    const state = createNewGameState({ nationId: 'brasshaven' });

    assert.deepEqual(validateCommitmentState(state.commitments), []);
    assert.deepEqual(validateRelationshipState(state.relationships), []);
    const varric = state.npcs.find((npc) => npc.id === 'npc-brasshaven-marshal-varric-stone');
    assert.ok(varric);
    assert.equal(varric.identity.name, 'Marshal Varric Stone');
    assert.ok(varric.questIds.includes(COMMITMENT_ID));
});

test('commitment acceptance persists independently of Journal guidance', () => {
    const state = createNewGameState({ nationId: 'brasshaven' });
    assert.equal(performLocalityPoiAction(state, 'poi-bastok-markets-rabid-wolf', 'talk').ok, true);

    const accepted = acceptCommitment(state, COMMITMENT_ID);
    assert.equal(accepted.ok, true, accepted.display?.text ?? accepted.reason);
    const record = getCommitmentRecord(state, COMMITMENT_ID);
    assert.equal(record.status, 'active');
    assert.equal(record.giverNpcId, 'npc-brasshaven-marshal-varric-stone');
    assert.equal(record.rewardClaimed, false);

    const repeated = acceptCommitment(state, COMMITMENT_ID);
    assert.equal(repeated.ok, true);
    assert.equal(repeated.outcome, 'unchanged');
    assert.equal(listSemanticEvents(state).filter((event) => event.type === 'commitment.accepted').length, 1);
});

test('provenance-qualified delivery resolves exactly once and changes a named NPC relationship', () => {
    const state = createNewGameState({ nationId: 'brasshaven' });
    performLocalityPoiAction(state, 'poi-bastok-markets-rabid-wolf', 'talk');
    assert.equal(acceptCommitment(state, COMMITMENT_ID).ok, true);

    const ingot = getProductionItem('item-redstone-copper-ingot');
    assert.equal(addItemToContainer(state.player.inventoryState, 'inventory', ingot).ok, true);
    const gilBefore = state.player.wallet.gil;

    const resolved = resolveCommitment(state, COMMITMENT_ID);
    assert.equal(resolved.ok, true, resolved.display?.text ?? resolved.reason);
    assert.equal(resolved.outcome, 'resolved');
    assert.equal(state.player.wallet.gil, gilBefore + 36);
    assert.equal(state.player.inventory.some((item) => item.id === 'item-redstone-copper-ingot'), false);

    const relationship = getNpcRelationship(state, 'npc-brasshaven-marshal-varric-stone');
    assert.equal(relationship.dimensions.familiarity, 1);
    assert.equal(relationship.dimensions.respect, 2);
    assert.equal(relationship.dimensions.trust, 0);
    assert.equal(relationship.dimensions.obligation, 0);

    const record = getCommitmentRecord(state, COMMITMENT_ID);
    assert.equal(record.status, 'resolved');
    assert.equal(record.rewardClaimed, true);
    assert.equal(record.followUpAvailableDay, record.resolvedDay + 1);

    const eventTypes = listSemanticEvents(state).map((event) => event.type);
    assert.equal(eventTypes.filter((type) => type === 'commitment.resolved').length, 1);
    assert.equal(eventTypes.filter((type) => type === 'relationship.changed').length, 1);

    const second = resolveCommitment(state, COMMITMENT_ID);
    assert.equal(second.ok, true);
    assert.equal(second.outcome, 'unchanged');
    assert.equal(state.player.wallet.gil, gilBefore + 36);
    assert.equal(getNpcRelationship(state, 'npc-brasshaven-marshal-varric-stone').dimensions.respect, 2);
});

test('inventory and commitment delivery preserve provenance when same-id material stacks have different histories', () => {
    const state = createNewGameState({ nationId: 'brasshaven' });
    performLocalityPoiAction(state, 'poi-bastok-markets-rabid-wolf', 'talk');
    assert.equal(acceptCommitment(state, COMMITMENT_ID).ok, true);

    const ingot = getProductionItem('item-redstone-copper-ingot');
    const unrelated = { ...ingot, provenance: [] };
    assert.equal(addItemToContainer(state.player.inventoryState, 'inventory', unrelated).ok, true);
    assert.equal(addItemToContainer(state.player.inventoryState, 'inventory', ingot).ok, true);

    const ingotStacks = state.player.inventory.filter((item) => item.id === ingot.id);
    assert.equal(ingotStacks.length, 2, 'different provenance must not collapse into one stack');
    assert.equal(ingotStacks[0].provenance.length, 0);
    assert.ok(ingotStacks[1].provenance.some((entry) => entry.sourceId === 'process-redstone-copper-ingot'));

    const resolved = resolveCommitment(state, COMMITMENT_ID);
    assert.equal(resolved.ok, true, resolved.display?.text ?? resolved.reason);
    const remaining = state.player.inventory.filter((item) => item.id === ingot.id);
    assert.equal(remaining.length, 1);
    assert.equal(remaining[0].provenance.length, 0, 'delivery must consume the qualifying provenance-bearing stack');

    const event = listSemanticEvents(state).find((entry) => entry.type === 'commitment.resolved');
    assert.ok(event.data.deliveredItems[0].provenance.some((entry) => entry.sourceId === 'process-redstone-copper-ingot'));
});

test('resolved commitment surfaces in day review and the same NPC has changed follow-up on a later fictional day', () => {
    const state = createNewGameState({ nationId: 'brasshaven' });
    performLocalityPoiAction(state, 'poi-bastok-markets-rabid-wolf', 'talk');
    acceptCommitment(state, COMMITMENT_ID);
    addItemToContainer(state.player.inventoryState, 'inventory', getProductionItem('item-redstone-copper-ingot'));
    assert.equal(resolveCommitment(state, COMMITMENT_ID).ok, true);

    const early = performCommitmentFollowUp(state, COMMITMENT_ID);
    assert.equal(early.ok, false);
    assert.equal(early.code, 'commitment.followup-too-early');

    setEndOfDayPause(state, false);
    ensureDayCycleState(state);
    const advanced = advanceSimulationWithDayPolicy(state, SECONDS_PER_DAY);
    assert.equal(advanced.ok, true);
    const summary = getLatestDaySummary(state);
    assert.equal(summary.day, 1);
    assert.equal(summary.eventTypeCounts['commitment.accepted'], 1);
    assert.equal(summary.eventTypeCounts['commitment.resolved'], 1);
    assert.equal(summary.eventTypeCounts['relationship.changed'], 1);

    const followUp = performCommitmentFollowUp(state, COMMITMENT_ID);
    assert.equal(followUp.ok, true, followUp.display?.text ?? followUp.reason);
    assert.match(followUp.display.text, /remembers the copper/i);
    assert.match(followUp.display.text, /Starfen reed fiber/i);
    assert.equal(getNpcRelationship(state, 'npc-brasshaven-marshal-varric-stone').dimensions.familiarity, 2);
    assert.equal(getCommitmentRecord(state, COMMITMENT_ID).followUpSeenAtWorldSeconds, state.worldTime.totalSeconds);

    const repeated = performCommitmentFollowUp(state, COMMITMENT_ID);
    assert.equal(repeated.ok, true);
    assert.equal(repeated.outcome, 'unchanged');
    assert.equal(listSemanticEvents(state).filter((event) => event.type === 'commitment.followup-viewed').length, 1);
});

test('PX4 continuity survives the real account save/load path without duplicate social rewards', () => {
    installStorage();
    assert.equal(createAccountWithPassword('PX4 Save Audit', 'pwd', { persistentLogin: true }).ok, true);
    const state = createNewGameState({ nationId: 'brasshaven', name: 'Copper Auditor' });
    performLocalityPoiAction(state, 'poi-bastok-markets-rabid-wolf', 'talk');
    assert.equal(acceptCommitment(state, COMMITMENT_ID).ok, true);
    assert.equal(addItemToContainer(state.player.inventoryState, 'inventory', getProductionItem('item-redstone-copper-ingot')).ok, true);
    assert.equal(resolveCommitment(state, COMMITMENT_ID).ok, true);
    setEndOfDayPause(state, false);
    ensureDayCycleState(state);
    assert.equal(advanceSimulationWithDayPolicy(state, SECONDS_PER_DAY).ok, true);
    assert.equal(isCommitmentFollowUpAvailable(state, COMMITMENT_ID), true);
    assert.equal(saveGame(state), true);

    let loaded = loadCharacter('Copper Auditor');
    assert.ok(loaded);
    assert.equal(getCommitmentRecord(loaded, COMMITMENT_ID).status, 'resolved');
    assert.equal(isCommitmentFollowUpAvailable(loaded, COMMITMENT_ID), true);
    assert.deepEqual(getNpcRelationship(loaded, 'npc-brasshaven-marshal-varric-stone').dimensions, {
        familiarity: 1,
        respect: 2,
        trust: 0,
        obligation: 0,
    });

    assert.equal(performCommitmentFollowUp(loaded, COMMITMENT_ID).ok, true);
    assert.equal(getNpcRelationship(loaded, 'npc-brasshaven-marshal-varric-stone').dimensions.familiarity, 2);
    assert.equal(saveGame(loaded), true);

    loaded = loadCharacter('Copper Auditor');
    const repeated = performCommitmentFollowUp(loaded, COMMITMENT_ID);
    assert.equal(repeated.ok, true);
    assert.equal(repeated.outcome, 'unchanged');
    assert.equal(getNpcRelationship(loaded, 'npc-brasshaven-marshal-varric-stone').dimensions.familiarity, 2);
    assert.equal(listSemanticEvents(loaded).filter((event) => event.type === 'commitment.followup-viewed').length, 1);
});

test('commitment state validation rejects inconsistent reward and follow-up bookkeeping', () => {
    const state = createNewGameState({ nationId: 'brasshaven' });
    performLocalityPoiAction(state, 'poi-bastok-markets-rabid-wolf', 'talk');
    acceptCommitment(state, COMMITMENT_ID);
    const active = getCommitmentRecord(state, COMMITMENT_ID);
    active.rewardClaimed = true;
    assert.match(validateCommitmentState(state.commitments).join(' '), /rewardClaimed must be false while active/);

    active.rewardClaimed = false;
    addItemToContainer(state.player.inventoryState, 'inventory', getProductionItem('item-redstone-copper-ingot'));
    assert.equal(resolveCommitment(state, COMMITMENT_ID).ok, true);
    const resolved = getCommitmentRecord(state, COMMITMENT_ID);
    resolved.followUpAvailableDay += 1;
    assert.match(validateCommitmentState(state.commitments).join(' '), /followUpAvailableDay must match the definition delay/);
});

test('missing additive continuity registries reconstruct lazily without changing Game State 5', () => {
    const state = createNewGameState({ nationId: 'brasshaven' });
    const version = state.version;
    delete state.commitments;
    delete state.relationships;
    performLocalityPoiAction(state, 'poi-bastok-markets-rabid-wolf', 'talk');

    const accepted = acceptCommitment(state, COMMITMENT_ID);
    assert.equal(accepted.ok, true);
    assert.equal(state.version, version);
    assert.deepEqual(validateCommitmentState(state.commitments), []);
    assert.deepEqual(validateRelationshipState(state.relationships), []);
});
