import test from 'node:test';
import assert from 'node:assert/strict';

import { listCompanionDefinitions } from '../js/text/data/companions.js';
import { listCommitmentDefinitions } from '../js/text/data/commitments.js';
import { REGIONAL_CONTENT_PACKS } from '../js/text/data/regionalContentPacks.js';
import { getPlace } from '../js/text/data/places.js';
import { createNewGameState } from '../js/text/gameState.js';
import { VERSION } from '../js/text/version.js';
import { advanceActiveActivityToCompletion } from '../js/text/systems/activityAdvanceEngine.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import {
    acceptCommitment,
    getCommitmentRecord,
    resolveCommitment,
} from '../js/text/systems/commitmentEngine.js';
import { validateContentPacks } from '../js/text/systems/contentPackValidator.js';
import { collectContentScaleCounts } from '../js/text/systems/contentScaleGate.js';
import { startGatheringWork } from '../js/text/systems/gatheringWorkEngine.js';
import {
    leaveLocalityPoi,
    performLocalityPoiAction,
} from '../js/text/systems/localityEngine.js';
import {
    canRecruitCompanion,
    getRecruitedCompanion,
    listActiveCompanions,
} from '../js/text/systems/partyEngine.js';
import { createCommitmentOpportunities } from '../js/text/systems/playerContinuityEngine.js';
import { applyNpcRelationshipChange } from '../js/text/systems/relationshipEngine.js';
import { startTravel } from '../js/text/systems/travelEngine.js';
import { validateGameState, validateWorldData } from '../js/text/systems/validation.js';
import { getWorkProficiency } from '../js/text/systems/workProficiencyEngine.js';
import {
    createAccountWithPassword,
    loadCharacter,
    saveGame,
} from '../js/text/save.js';
import { reachPoi } from './helpers/localKnowledgeTestSupport.js';

const SCOUT_POI_ID = 'poi-slatewater-road-scout';
const SCOUT_COMPANION_ID = 'companion-sable-renn';
const FIRST_COMMITMENT_ID = 'commitment-slatewater-resin-waymarks';
const SECOND_COMMITMENT_ID = 'commitment-slatewater-lichen-fogmarks';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() {
    globalThis.localStorage = new MemoryStorage();
}

function relocate(state, placeId) {
    const place = getPlace(placeId);
    assert.ok(place);
    const positioned = setPositionAndDiscover(state, placeId, place.coordinateSystem.start, {
        important: [`Adventure slice test entered ${place.name}`],
    });
    assert.equal(positioned.ok, true, positioned.reason);
}

function travelAndFinish(state, destinationId) {
    if (state.activePoiId) assert.equal(leaveLocalityPoi(state).ok, true);
    const travel = startTravel(state, destinationId);
    assert.equal(travel.ok, true, travel.display?.text ?? travel.reason);
    const finished = advanceActiveActivityToCompletion(state);
    assert.equal(finished.ok, true, finished.display?.text ?? finished.reason);
    assert.equal(state.currentPlaceId, destinationId);
}

function interactWithScout(state, action = 'talk') {
    reachPoi(state, SCOUT_POI_ID);
    return performLocalityPoiAction(state, SCOUT_POI_ID, action);
}

test('Slatewater Road Scout slice chains field trust into earned companion recruitment', () => {
    const state = createNewGameState({ nationId: 'thornwall', name: 'Slatewater Scout Auditor' });
    relocate(state, 'slatewater-waylodge');

    assert.equal(createCommitmentOpportunities(state).some((entry) => entry.id === `commitment-${FIRST_COMMITMENT_ID}`), false);
    assert.equal(createCommitmentOpportunities(state).some((entry) => entry.id === `commitment-${SECOND_COMMITMENT_ID}`), false);

    reachPoi(state, SCOUT_POI_ID);
    assert.equal(createCommitmentOpportunities(state).some((entry) => entry.id === `commitment-${FIRST_COMMITMENT_ID}`), false, 'reaching the scout is not yet a conversation');

    const greeting = performLocalityPoiAction(state, SCOUT_POI_ID, 'talk');
    assert.equal(greeting.ok, true, greeting.message ?? greeting.reason);

    const earlyRecruitment = performLocalityPoiAction(state, SCOUT_POI_ID, 'companion');
    assert.equal(earlyRecruitment.ok, false, 'the companion action itself must preserve the trust-gate failure');
    assert.equal(earlyRecruitment.code, 'party.commitment-requirement');

    let opportunities = createCommitmentOpportunities(state);
    assert.ok(opportunities.some((entry) => entry.id === `commitment-${FIRST_COMMITMENT_ID}`));
    assert.equal(opportunities.some((entry) => entry.id === `commitment-${SECOND_COMMITMENT_ID}`), false, 'second road test stays hidden before the first is resolved');

    const prematureSecond = acceptCommitment(state, SECOND_COMMITMENT_ID);
    assert.equal(prematureSecond.ok, false);
    assert.equal(prematureSecond.code, 'commitment.prerequisites-unmet');

    assert.equal(acceptCommitment(state, FIRST_COMMITMENT_ID).ok, true);
    let recruitment = canRecruitCompanion(state, SCOUT_COMPANION_ID);
    assert.equal(recruitment.ok, false);
    assert.equal(recruitment.code, 'party.commitment-requirement');

    travelAndFinish(state, 'slatewater-foothills');
    assert.equal(getWorkProficiency(state.player, 'foraging'), 0);

    const resin = startGatheringWork(state, 'source-slatewater-pitch-pine-stand', { quantity: 2 });
    assert.equal(resin.ok, true, resin.display?.text ?? resin.reason);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(getWorkProficiency(state.player, 'foraging'), 2, 'the first field proof naturally trains enough for the second');

    travelAndFinish(state, 'slatewater-waylodge');
    reachPoi(state, SCOUT_POI_ID);
    const firstResolved = resolveCommitment(state, FIRST_COMMITMENT_ID);
    assert.equal(firstResolved.ok, true, firstResolved.display?.text ?? firstResolved.reason);
    assert.equal(getCommitmentRecord(state, FIRST_COMMITMENT_ID).status, 'resolved');

    const reducedTrust = applyNpcRelationshipChange(state, 'npc-slatewater-sable-renn', { trust: -1 }, {
        reason: 'Q0 relationship-gate regression',
        source: 'test',
    });
    assert.equal(reducedTrust.ok, true);
    opportunities = createCommitmentOpportunities(state);
    assert.equal(opportunities.some((entry) => entry.id === `commitment-${SECOND_COMMITMENT_ID}`), false, 'resolved prerequisite alone does not reveal a trust-gated offer');
    const relationshipBlockedSecond = acceptCommitment(state, SECOND_COMMITMENT_ID);
    assert.equal(relationshipBlockedSecond.ok, false);
    assert.equal(relationshipBlockedSecond.code, 'commitment.prerequisites-unmet');
    assert.equal(relationshipBlockedSecond.data.unmetRelationshipRequirements[0].dimension, 'trust');

    assert.equal(applyNpcRelationshipChange(state, 'npc-slatewater-sable-renn', { trust: 1 }, {
        reason: 'Restore earned Q0 trust for normal slice path',
        source: 'test',
    }).ok, true);
    opportunities = createCommitmentOpportunities(state);
    assert.ok(opportunities.some((entry) => entry.id === `commitment-${SECOND_COMMITMENT_ID}`), 'second road test appears when commitment and trust requirements are both met');

    assert.equal(acceptCommitment(state, SECOND_COMMITMENT_ID).ok, true);
    recruitment = canRecruitCompanion(state, SCOUT_COMPANION_ID);
    assert.equal(recruitment.ok, false);
    assert.equal(recruitment.code, 'party.commitment-requirement');

    travelAndFinish(state, 'slatewater-foothills');
    const lichen = startGatheringWork(state, 'source-slatewater-silver-lichen-face');
    assert.equal(lichen.ok, true, lichen.display?.text ?? lichen.reason);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);

    travelAndFinish(state, 'slatewater-waylodge');
    reachPoi(state, SCOUT_POI_ID);
    const secondResolved = resolveCommitment(state, SECOND_COMMITMENT_ID);
    assert.equal(secondResolved.ok, true, secondResolved.display?.text ?? secondResolved.reason);
    assert.equal(getCommitmentRecord(state, SECOND_COMMITMENT_ID).status, 'resolved');

    recruitment = canRecruitCompanion(state, SCOUT_COMPANION_ID);
    assert.equal(recruitment.ok, true, recruitment.display?.text ?? recruitment.reason);

    assert.equal(applyNpcRelationshipChange(state, 'npc-slatewater-sable-renn', { trust: -1 }, {
        reason: 'Q0 companion relationship-gate regression',
        source: 'test',
    }).ok, true);
    const relationshipBlockedRecruitment = canRecruitCompanion(state, SCOUT_COMPANION_ID);
    assert.equal(relationshipBlockedRecruitment.ok, false);
    assert.equal(relationshipBlockedRecruitment.code, 'party.relationship-requirement');
    assert.equal(relationshipBlockedRecruitment.data.unmetRelationshipRequirements[0].dimension, 'trust');
    assert.equal(applyNpcRelationshipChange(state, 'npc-slatewater-sable-renn', { trust: 1 }, {
        reason: 'Restore earned Q0 trust for recruitment',
        source: 'test',
    }).ok, true);

    const recruited = performLocalityPoiAction(state, SCOUT_POI_ID, 'companion');
    assert.equal(recruited.ok, true, recruited.message ?? recruited.reason);
    assert.match(recruited.message, /falls into step beside you/i);
    const recruitedScout = getRecruitedCompanion(state, SCOUT_COMPANION_ID);
    assert.ok(recruitedScout);
    assert.equal(recruitedScout.relationship.trust, 3, 'the two trust rewards carry into the companion relationship');
    assert.equal(recruitedScout.relationship.respect, 1);
    assert.equal(recruitedScout.relationship.familiarity, 1);
    assert.equal(listActiveCompanions(state).some((entry) => entry.id === SCOUT_COMPANION_ID), true);

    travelAndFinish(state, 'slatewater-foothills');
    const activeScout = listActiveCompanions(state).find((entry) => entry.id === SCOUT_COMPANION_ID);
    assert.equal(activeScout.locationId, 'slatewater-foothills', 'the recruited scout follows canonical route travel');
    assert.equal(state.npcs.find((npc) => npc.id === 'npc-slatewater-sable-renn').identity.locationId, 'slatewater-foothills');

    const resolvedOpportunity = createCommitmentOpportunities(state)
        .find((entry) => entry.id === `commitment-${SECOND_COMMITMENT_ID}`);
    assert.ok(resolvedOpportunity);
    assert.equal(resolvedOpportunity.action, null, 'a mobile recruited giver is not represented as an actionable static quest marker');

    assert.deepEqual(validateGameState(state), []);
});

test('Slatewater Road Scout records are canonical Pack-v2 content and move the mechanics census coherently', () => {
    assert.deepEqual(validateWorldData(), []);
    assert.deepEqual(validateContentPacks(REGIONAL_CONTENT_PACKS), []);

    const companion = listCompanionDefinitions().find((entry) => entry.id === SCOUT_COMPANION_ID);
    assert.ok(companion);
    assert.deepEqual(companion.recruitment.requiredCommitmentIds, [FIRST_COMMITMENT_ID, SECOND_COMMITMENT_ID]);
    assert.deepEqual(companion.recruitment.relationshipRequirements, [
        { npcId: 'npc-slatewater-sable-renn', minimums: { trust: 3, respect: 1 } },
    ]);

    const commitments = new Map(listCommitmentDefinitions().map((entry) => [entry.id, entry]));
    assert.deepEqual(commitments.get(SECOND_COMMITMENT_ID).prerequisiteCommitmentIds, [FIRST_COMMITMENT_ID]);
    assert.deepEqual(commitments.get(SECOND_COMMITMENT_ID).relationshipRequirements, [
        { npcId: 'npc-slatewater-sable-renn', minimums: { trust: 1 } },
    ]);

    const counts = collectContentScaleCounts();
    assert.equal(counts.npcs, 48);
    assert.equal(counts.quests, 20);
    assert.equal(counts.companions, 2);
    assert.equal(counts.supplemental.seedNpcs, 47);
    assert.equal(counts.supplemental.ownedPackRecords, 1365);
});

test('resolved Slatewater trust and recruited scout persist through the current Game State families', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Slatewater Scout Save', 'pwd', { persistentLogin: true }).ok, true);

    const state = createNewGameState({ nationId: 'thornwall', name: 'Road Scout Saver' });
    relocate(state, 'slatewater-waylodge');
    interactWithScout(state, 'talk');

    // This persistence proof seeds already-earned records through the existing canonical engines rather than inventing slice-specific save state.
    state.commitments.records[FIRST_COMMITMENT_ID] = {
        id: FIRST_COMMITMENT_ID,
        giverNpcId: 'npc-slatewater-sable-renn',
        status: 'resolved',
        acceptedAtWorldSeconds: state.worldTime.totalSeconds,
        resolvedAtWorldSeconds: state.worldTime.totalSeconds,
        resolvedDay: 1,
        rewardClaimed: true,
        followUpAvailableDay: 2,
        followUpSeenAtWorldSeconds: null,
    };
    state.commitments.records[SECOND_COMMITMENT_ID] = {
        id: SECOND_COMMITMENT_ID,
        giverNpcId: 'npc-slatewater-sable-renn',
        status: 'resolved',
        acceptedAtWorldSeconds: state.worldTime.totalSeconds,
        resolvedAtWorldSeconds: state.worldTime.totalSeconds,
        resolvedDay: 1,
        rewardClaimed: true,
        followUpAvailableDay: 2,
        followUpSeenAtWorldSeconds: null,
    };
    assert.equal(applyNpcRelationshipChange(state, 'npc-slatewater-sable-renn', {
        familiarity: 1,
        respect: 1,
        trust: 3,
    }, {
        reason: 'Seed already-earned Slatewater relationship for persistence proof',
        source: 'test',
    }).ok, true);

    reachPoi(state, SCOUT_POI_ID);
    const recruited = performLocalityPoiAction(state, SCOUT_POI_ID, 'companion');
    assert.equal(recruited.ok, true, recruited.message ?? recruited.reason);

    assert.equal(saveGame(state), true);
    const loaded = loadCharacter('Road Scout Saver');
    assert.ok(loaded);
    assert.equal(loaded.version, VERSION.gameState);
    assert.equal(getCommitmentRecord(loaded, FIRST_COMMITMENT_ID).status, 'resolved');
    assert.equal(getCommitmentRecord(loaded, SECOND_COMMITMENT_ID).status, 'resolved');
    assert.ok(getRecruitedCompanion(loaded, SCOUT_COMPANION_ID));
    assert.equal(listActiveCompanions(loaded).some((entry) => entry.id === SCOUT_COMPANION_ID), true);
    assert.deepEqual(validateGameState(loaded), []);
});
