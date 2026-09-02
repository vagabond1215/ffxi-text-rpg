import test from 'node:test';
import assert from 'node:assert/strict';

import { getCompanionDefinition, listCompanionDefinitions } from '../js/text/data/companions.js';
import { listCommitmentDefinitions } from '../js/text/data/commitments.js';
import { getPlace } from '../js/text/data/places.js';
import { getPointOfInterest } from '../js/text/data/pointsOfInterest.js';
import { getProductionItem } from '../js/text/data/productionItems.js';
import { REGIONAL_CONTENT_PACKS } from '../js/text/data/regionalContentPacks.js';
import { createNewGameState } from '../js/text/gameState.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { advanceActiveActivityToCompletion } from '../js/text/systems/activityAdvanceEngine.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { startEncounter } from '../js/text/systems/combatActionEngine.js';
import {
    acceptCommitment,
    getCommitmentRecord,
    resolveCommitment,
} from '../js/text/systems/commitmentEngine.js';
import { validateContentPacks } from '../js/text/systems/contentPackValidator.js';
import { collectContentScaleCounts } from '../js/text/systems/contentScaleGate.js';
import {
    enterLocalityPoi,
    leaveLocalityPoi,
    performLocalityPoiAction,
} from '../js/text/systems/localityEngine.js';
import { requiresPoiEntryTransition } from '../js/text/systems/localKnowledgeEngine.js';
import {
    canRecruitCompanion,
    getRecruitedCompanion,
    joinCompanion,
    leaveCompanion,
    listActiveCompanions,
} from '../js/text/systems/partyEngine.js';
import { createCommitmentOpportunities } from '../js/text/systems/playerContinuityEngine.js';
import { applyNpcRelationshipChange, getNpcRelationship } from '../js/text/systems/relationshipEngine.js';
import { startTravel } from '../js/text/systems/travelEngine.js';
import { validateGameState, validateWorldData } from '../js/text/systems/validation.js';
import { advanceWorldTime, getWorldTimeParts } from '../js/text/systems/worldTimeEngine.js';
import {
    createAccountWithPassword,
    loadCharacter,
    saveGame,
} from '../js/text/save.js';
import { reachPoi } from './helpers/localKnowledgeTestSupport.js';

const VARA_POI_ID = 'poi-ironspine-survey-exchange';
const DAIN_POI_ID = 'poi-ironspine-warden-desk';
const MARA_POI_ID = 'poi-ironspine-common-hearth';
const DAIN_COMPANION_ID = 'companion-dain-rove';

const SURVEY_ID = 'commitment-ironspine-survey-compass';
const READINESS_ID = 'commitment-ironspine-frost-salve-readiness';
const BEDROLL_ID = 'commitment-ironspine-bearhide-bedroll';

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
    if (state.activePoiId) {
        const left = leaveLocalityPoi(state);
        assert.equal(left.ok, true, left.reason ?? left.message);
    }
    const place = getPlace(placeId);
    assert.ok(place, `Expected place ${placeId}.`);
    const positioned = setPositionAndDiscover(state, place.id, place.coordinateSystem.start, {
        important: [`Q1 Ironspine test entered ${place.name}`],
    });
    assert.equal(positioned.ok, true, positioned.reason);
    assert.equal(state.currentPlaceId, placeId);
}

function positionAtPoi(state, poiId) {
    const poi = reachPoi(state, poiId);
    if (requiresPoiEntryTransition(poi)) {
        const entered = enterLocalityPoi(state, poi.id);
        assert.equal(entered.ok, true, entered.reason ?? entered.message);
    }
    return poi;
}

function talkAtPoi(state, poiId) {
    positionAtPoi(state, poiId);
    const result = performLocalityPoiAction(state, poiId, 'talk');
    assert.equal(result.ok, true, result.message ?? result.reason);
    return result;
}

function grantCrafted(state, itemId) {
    const item = getProductionItem(itemId);
    assert.ok(item, `Expected canonical production item ${itemId}.`);
    const stored = addItemToContainer(state.player.inventoryState, 'inventory', item);
    assert.equal(stored.ok, true, stored.reason);
    return stored.item;
}

function travelAndFinish(state, destinationId) {
    if (state.activePoiId) {
        const left = leaveLocalityPoi(state);
        assert.equal(left.ok, true, left.reason ?? left.message);
    }
    const started = startTravel(state, destinationId);
    assert.equal(started.ok, true, started.display?.text ?? started.reason);
    const finished = advanceActiveActivityToCompletion(state);
    assert.equal(finished.ok, true, finished.display?.text ?? finished.reason);
    assert.equal(state.currentPlaceId, destinationId);
}

test('Q1 Ironspine chain turns real production into cross-NPC trust and earned Dain recruitment', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Ironspine Q1 Save', 'pwd', { persistentLogin: true }).ok, true);

    const state = createNewGameState({
        nationId: 'brasshaven',
        name: 'Ironspine Q1 Auditor',
        startWorldTimeSeconds: 8 * 60 * 60,
    });
    relocate(state, 'ironspine-watchpost');

    const dainPoi = getPointOfInterest(DAIN_POI_ID);
    assert.ok(dainPoi);
    assert.equal(dainPoi.type, 'guild', 'Dain remains a warden/guild contact rather than becoming a companion-only POI');
    assert.ok(dainPoi.actions.includes('guild'));
    assert.ok(dainPoi.actions.includes('companion'));

    talkAtPoi(state, VARA_POI_ID);
    let opportunities = createCommitmentOpportunities(state);
    assert.ok(opportunities.some((entry) => entry.id === `commitment-${SURVEY_ID}`));
    assert.equal(opportunities.some((entry) => entry.id === `commitment-${READINESS_ID}`), false);

    assert.equal(acceptCommitment(state, SURVEY_ID).ok, true);
    const compass = grantCrafted(state, 'item-ironspine-high-pass-compass');
    assert.ok(compass.provenance.some((entry) => entry.sourceId === 'craft-ironspine-high-pass-compass'));
    const surveyResolved = resolveCommitment(state, SURVEY_ID);
    assert.equal(surveyResolved.ok, true, surveyResolved.display?.text ?? surveyResolved.reason);
    assert.equal(getCommitmentRecord(state, SURVEY_ID).status, 'resolved');
    assert.deepEqual(getNpcRelationship(state, 'npc-ironspine-vara-kell').dimensions, {
        familiarity: 0,
        respect: 2,
        trust: 1,
        obligation: 0,
    });

    talkAtPoi(state, DAIN_POI_ID);
    assert.equal(applyNpcRelationshipChange(state, 'npc-ironspine-vara-kell', { trust: -1 }, {
        reason: 'Q1 cross-NPC gate regression',
        source: 'test',
    }).ok, true);

    opportunities = createCommitmentOpportunities(state);
    assert.equal(opportunities.some((entry) => entry.id === `commitment-${READINESS_ID}`), false, 'Vara trust is part of Dain offer eligibility');
    const relationshipBlockedReadiness = acceptCommitment(state, READINESS_ID);
    assert.equal(relationshipBlockedReadiness.ok, false);
    assert.equal(relationshipBlockedReadiness.code, 'commitment.prerequisites-unmet');
    assert.equal(relationshipBlockedReadiness.data.unmetRelationshipRequirements[0].npcId, 'npc-ironspine-vara-kell');

    assert.equal(applyNpcRelationshipChange(state, 'npc-ironspine-vara-kell', { trust: 1 }, {
        reason: 'Restore earned Vara trust',
        source: 'test',
    }).ok, true);
    opportunities = createCommitmentOpportunities(state);
    assert.ok(opportunities.some((entry) => entry.id === `commitment-${READINESS_ID}`));

    assert.equal(acceptCommitment(state, READINESS_ID).ok, true);
    const salve = grantCrafted(state, 'item-ironspine-frost-lichen-salve');
    assert.ok(salve.provenance.some((entry) => entry.sourceId === 'craft-ironspine-frost-lichen-salve'));
    const readinessResolved = resolveCommitment(state, READINESS_ID);
    assert.equal(readinessResolved.ok, true, readinessResolved.display?.text ?? readinessResolved.reason);
    assert.deepEqual(getNpcRelationship(state, 'npc-ironspine-dain-rove').dimensions, {
        familiarity: 1,
        respect: 1,
        trust: 2,
        obligation: 0,
    });

    talkAtPoi(state, MARA_POI_ID);
    assert.equal(applyNpcRelationshipChange(state, 'npc-ironspine-dain-rove', { respect: -1 }, {
        reason: 'Q1 Mara cross-NPC gate regression',
        source: 'test',
    }).ok, true);
    opportunities = createCommitmentOpportunities(state);
    assert.equal(opportunities.some((entry) => entry.id === `commitment-${BEDROLL_ID}`), false);

    assert.equal(applyNpcRelationshipChange(state, 'npc-ironspine-dain-rove', { respect: 1 }, {
        reason: 'Restore earned Dain respect',
        source: 'test',
    }).ok, true);
    opportunities = createCommitmentOpportunities(state);
    assert.ok(opportunities.some((entry) => entry.id === `commitment-${BEDROLL_ID}`));

    assert.equal(acceptCommitment(state, BEDROLL_ID).ok, true);
    const bedroll = grantCrafted(state, 'item-ironspine-bearhide-bedroll');
    assert.ok(bedroll.provenance.some((entry) => entry.sourceId === 'craft-ironspine-bearhide-bedroll'));
    const bedrollResolved = resolveCommitment(state, BEDROLL_ID);
    assert.equal(bedrollResolved.ok, true, bedrollResolved.display?.text ?? bedrollResolved.reason);
    assert.deepEqual(getNpcRelationship(state, 'npc-ironspine-mara-fell').dimensions, {
        familiarity: 1,
        respect: 0,
        trust: 0,
        obligation: 1,
    });

    let recruitment = canRecruitCompanion(state, DAIN_COMPANION_ID);
    assert.equal(recruitment.ok, true, recruitment.display?.text ?? recruitment.reason);

    assert.equal(advanceWorldTime(state, (10 * 60 + 30) * 60).ok, true);
    assert.deepEqual(
        { hour: getWorldTimeParts(state).hour, minute: getWorldTimeParts(state).minute },
        { hour: 18, minute: 30 },
    );
    recruitment = canRecruitCompanion(state, DAIN_COMPANION_ID);
    assert.equal(recruitment.ok, false);
    assert.equal(recruitment.code, 'party.npc-unavailable');

    positionAtPoi(state, DAIN_POI_ID);
    const offHoursRecruitment = performLocalityPoiAction(state, DAIN_POI_ID, 'companion');
    assert.equal(offHoursRecruitment.ok, false);
    assert.equal(offHoursRecruitment.code, 'locality.poi-unavailable-now');

    assert.equal(advanceWorldTime(state, (13 * 60 + 30) * 60).ok, true);
    assert.deepEqual(
        { day: getWorldTimeParts(state).day, hour: getWorldTimeParts(state).hour, minute: getWorldTimeParts(state).minute },
        { day: 2, hour: 8, minute: 0 },
    );

    const recruited = performLocalityPoiAction(state, DAIN_POI_ID, 'companion');
    assert.equal(recruited.ok, true, recruited.message ?? recruited.reason);
    const companion = getRecruitedCompanion(state, DAIN_COMPANION_ID);
    assert.ok(companion);
    assert.equal(companion.relationship.trust, 2);
    assert.equal(companion.relationship.respect, 1);
    assert.equal(companion.relationship.familiarity, 1);
    assert.equal(listActiveCompanions(state).some((entry) => entry.id === DAIN_COMPANION_ID), true);

    travelAndFinish(state, 'ironspine-high-meadow');
    assert.equal(getRecruitedCompanion(state, DAIN_COMPANION_ID).locationId, 'ironspine-high-meadow');
    assert.equal(state.npcs.find((npc) => npc.id === 'npc-ironspine-dain-rove').identity.locationId, 'ironspine-high-meadow');

    const left = leaveCompanion(state, DAIN_COMPANION_ID);
    assert.equal(left.ok, true, left.display?.text ?? left.reason);
    relocate(state, 'ironspine-watchpost');
    positionAtPoi(state, DAIN_POI_ID);
    const absentWarden = performLocalityPoiAction(state, DAIN_POI_ID, 'talk');
    assert.equal(absentWarden.ok, false);
    assert.equal(absentWarden.code, 'locality.poi-npc-absent');
    assert.equal(absentWarden.data.npcLocationId, 'ironspine-high-meadow');

    relocate(state, 'ironspine-high-meadow');
    const rejoined = joinCompanion(state, DAIN_COMPANION_ID);
    assert.equal(rejoined.ok, true, rejoined.display?.text ?? rejoined.reason);

    assert.equal(saveGame(state), true);
    const loaded = loadCharacter('Ironspine Q1 Auditor');
    assert.ok(loaded);
    assert.equal(getCommitmentRecord(loaded, SURVEY_ID).status, 'resolved');
    assert.equal(getCommitmentRecord(loaded, READINESS_ID).status, 'resolved');
    assert.equal(getCommitmentRecord(loaded, BEDROLL_ID).status, 'resolved');
    assert.ok(getRecruitedCompanion(loaded, DAIN_COMPANION_ID));
    assert.equal(listActiveCompanions(loaded).some((entry) => entry.id === DAIN_COMPANION_ID), true);
    assert.equal(getRecruitedCompanion(loaded, DAIN_COMPANION_ID).locationId, 'ironspine-high-meadow');

    const battle = startEncounter(loaded, 'Training Dummy');
    assert.equal(battle.ok, true, battle.message);
    assert.ok(loaded.activeBattle.combatants.some((combatant) => combatant.id === DAIN_COMPANION_ID && combatant.type === 'companion'));

    assert.deepEqual(validateGameState(loaded), []);
});

test('Q1 Ironspine records are canonical Pack-v2 content with bounded census growth', () => {
    assert.deepEqual(validateWorldData(), []);
    assert.deepEqual(validateContentPacks(REGIONAL_CONTENT_PACKS), []);

    const commitments = new Map(listCommitmentDefinitions().map((entry) => [entry.id, entry]));
    assert.deepEqual(commitments.get(READINESS_ID).prerequisiteCommitmentIds, [SURVEY_ID]);
    assert.deepEqual(commitments.get(READINESS_ID).relationshipRequirements, [
        { npcId: 'npc-ironspine-vara-kell', minimums: { respect: 2, trust: 1 } },
    ]);
    assert.deepEqual(commitments.get(BEDROLL_ID).prerequisiteCommitmentIds, [READINESS_ID]);
    assert.deepEqual(commitments.get(BEDROLL_ID).relationshipRequirements, [
        { npcId: 'npc-ironspine-dain-rove', minimums: { trust: 2, respect: 1 } },
    ]);

    const dain = getCompanionDefinition(DAIN_COMPANION_ID);
    assert.ok(dain);
    assert.deepEqual(dain.recruitment.requiredCommitmentIds, [SURVEY_ID, READINESS_ID, BEDROLL_ID]);
    assert.deepEqual(dain.recruitment.relationshipRequirements, [
        { npcId: 'npc-ironspine-dain-rove', minimums: { trust: 2, respect: 1 } },
    ]);
    assert.equal(dain.tactics.defaultApproachId, 'hold-the-pass');
    assert.deepEqual(dain.fieldApproaches.map((entry) => entry.id), ['hold-the-pass', 'drive-the-ridge']);
    assert.equal(listCompanionDefinitions().length, 3);

    const pack = REGIONAL_CONTENT_PACKS.find((entry) => entry.id === 'pack-ironspine-highlands');
    assert.ok(pack);
    assert.deepEqual(pack.records.quests.map((entry) => entry.id), [SURVEY_ID, READINESS_ID, BEDROLL_ID]);
    assert.deepEqual(pack.records.companions.map((entry) => entry.id), [DAIN_COMPANION_ID]);
    assert.deepEqual(pack.records.relationships.map((entry) => entry.id), [
        'relationship-ironspine-vara-kell',
        'relationship-ironspine-dain-rove',
        'relationship-ironspine-mara-fell',
    ]);

    const counts = collectContentScaleCounts();
    assert.equal(counts.npcs, 48);
    assert.equal(counts.quests, 23);
    assert.equal(counts.companions, 3);
    assert.equal(counts.supplemental.seedNpcs, 47);
    assert.equal(counts.supplemental.regionalContentPacks, 43);
    assert.equal(counts.supplemental.ownedPackRecords, 1372);
});
