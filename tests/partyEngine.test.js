import test from 'node:test';
import assert from 'node:assert/strict';

import { validateCompanionCatalog } from '../js/text/data/companions.js';
import { getPlace } from '../js/text/data/places.js';
import { createNewGameState } from '../js/text/gameState.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { startEncounter } from '../js/text/systems/combatActionEngine.js';
import {
    canRecruitCompanion,
    ensurePartyState,
    getRecruitedCompanion,
    joinCompanion,
    leaveCompanion,
    recruitCompanion,
    validatePartyState,
} from '../js/text/systems/partyEngine.js';
import { listSemanticEvents } from '../js/text/systems/semanticEventEngine.js';
import { advanceTravelJourney, startRouteJourney } from '../js/text/systems/transportEngine.js';

const MARA_ID = 'companion-mara-venn';
const MARA_NPC_ID = 'npc-elderwood-waywarden';

function moveTo(state, placeId) {
    const place = getPlace(placeId);
    assert.ok(place);
    const moved = setPositionAndDiscover(state, place.id, place.coordinateSystem.start);
    assert.equal(moved.ok, true);
    return place;
}

test('companion catalog and new-game party state validate independently of player class identity', () => {
    const state = createNewGameState();

    assert.deepEqual(validateCompanionCatalog(), []);
    assert.deepEqual(validatePartyState(state.party), []);
    assert.equal(state.party.version, 1);
    assert.equal(state.party.capacity, 2);
    assert.deepEqual(state.party.activeCompanionIds, []);
});

test('party state is additive for older Game State 5 saves', () => {
    const state = createNewGameState();
    delete state.party;

    const party = ensurePartyState(state);

    assert.deepEqual(validatePartyState(party), []);
    assert.deepEqual(party.activeCompanionIds, []);
    assert.deepEqual(party.companions, {});
});

test('Mara recruits as one persistent NPC-backed companion with separate relationship state', () => {
    const state = createNewGameState();
    assert.equal(canRecruitCompanion(state, MARA_ID).ok, false);
    moveTo(state, 'timbercross-landing');

    const available = canRecruitCompanion(state, MARA_ID);
    const recruited = recruitCompanion(state, MARA_ID);
    const companion = getRecruitedCompanion(state, MARA_ID);
    const npc = state.npcs.find((entry) => entry.id === MARA_NPC_ID);

    assert.equal(available.ok, true);
    assert.equal(recruited.ok, true);
    assert.equal(recruited.data.active, true);
    assert.ok(companion);
    assert.deepEqual(companion.relationship, { trust: 0, respect: 0, familiarity: 0 });
    assert.equal(companion.locationId, 'timbercross-landing');
    assert.equal(npc.identity.name, companion.identity.name);
    assert.equal(npc.identity.locationId, companion.locationId);
    assert.equal(npc.flags.companionId, MARA_ID);
    assert.equal(npc.flags.companionActive, true);
    assert.equal(listSemanticEvents(state, { type: 'party.companion-recruited' }).length, 1);
});

test('leave and join change active membership without discarding the persistent companion', () => {
    const state = createNewGameState();
    moveTo(state, 'timbercross-landing');
    recruitCompanion(state, MARA_ID);
    const hpBefore = getRecruitedCompanion(state, MARA_ID).resources.hp;

    const left = leaveCompanion(state, MARA_ID);
    const afterLeave = getRecruitedCompanion(state, MARA_ID);
    const joined = joinCompanion(state, MARA_ID);
    const afterJoin = getRecruitedCompanion(state, MARA_ID);

    assert.equal(left.ok, true);
    assert.equal(state.party.activeCompanionIds.includes(MARA_ID), true);
    assert.equal(afterLeave.resources.hp, hpBefore);
    assert.equal(joined.ok, true);
    assert.equal(afterJoin.resources.hp, hpBefore);
    assert.equal(state.npcs.find((entry) => entry.id === MARA_NPC_ID).flags.companionActive, true);
});

test('party membership cannot change during active combat', () => {
    const state = createNewGameState();
    moveTo(state, 'timbercross-landing');
    recruitCompanion(state, MARA_ID);
    startEncounter(state, 'Training Dummy');

    const leaving = leaveCompanion(state, MARA_ID);

    assert.equal(leaving.ok, false);
    assert.equal(leaving.code, 'party.in-combat');
    assert.deepEqual(state.party.activeCompanionIds, [MARA_ID]);
});

test('active companions follow completed canonical route travel and backing NPC location stays synchronized', () => {
    const state = createNewGameState();
    moveTo(state, 'timbercross-landing');
    recruitCompanion(state, MARA_ID);

    const started = startRouteJourney(state, {
        from: 'timbercross-landing',
        to: 'west-elderwood',
        mode: 'walk',
        durationSeconds: 10,
    });
    const arrived = advanceTravelJourney(state, 10);
    const companion = getRecruitedCompanion(state, MARA_ID);
    const npc = state.npcs.find((entry) => entry.id === MARA_NPC_ID);

    assert.equal(started.ok, true);
    assert.equal(arrived.completed, true);
    assert.equal(state.currentPlaceId, 'west-elderwood');
    assert.equal(companion.locationId, 'west-elderwood');
    assert.equal(npc.identity.locationId, 'west-elderwood');
});

test('missing backing NPC on an older save is reconstructed at the canonical companion location', () => {
    const state = createNewGameState();
    moveTo(state, 'timbercross-landing');
    state.npcs = state.npcs.filter((entry) => entry.id !== MARA_NPC_ID);

    const available = canRecruitCompanion(state, MARA_ID);
    const npc = state.npcs.find((entry) => entry.id === MARA_NPC_ID);

    assert.equal(available.ok, true);
    assert.ok(npc);
    assert.equal(npc.identity.locationId, 'timbercross-landing');
});
