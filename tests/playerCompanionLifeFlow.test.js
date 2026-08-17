import test from 'node:test';
import assert from 'node:assert/strict';

import { getCompanionDefinition, validateCompanionCatalog } from '../js/text/data/companions.js';
import { getPlace } from '../js/text/data/places.js';
import { createNewGameState } from '../js/text/gameState.js';
import { createAccountWithPassword, loadCharacter, saveGame } from '../js/text/save.js';
import { advanceActiveActivityToCompletion } from '../js/text/systems/activityAdvanceEngine.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { startEncounter } from '../js/text/systems/combatActionEngine.js';
import {
    getActiveCompanionCombatEntities,
    getRecruitedCompanion,
    recruitCompanion,
    setCompanionApproach,
    syncActivePartyLocation,
} from '../js/text/systems/partyEngine.js';
import { calculateCombatProfile } from '../js/text/systems/statEngine.js';
import { startTravel } from '../js/text/systems/travelEngine.js';
import { validateGameState } from '../js/text/systems/validation.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { dispatchUiIntent } from '../js/text/ui/uiIntentDispatcher.js';
import { createUiState } from '../js/text/ui/uiState.js';

const MARA_ID = 'companion-mara-venn';
const MARA_NPC_ID = 'npc-elderwood-waywarden';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() {
    globalThis.localStorage = new MemoryStorage();
}

function moveStateTo(state, placeId) {
    const place = getPlace(placeId);
    setPositionAndDiscover(state, place.id, place.coordinateSystem.start, { important: ['Companion life test setup'] });
    syncActivePartyLocation(state, place.id);
}

test('0.7.400 gives Mara a persistent voiced field approach that changes real combat preparation without becoming a second progression system', () => {
    installStorage();
    assert.deepEqual(validateCompanionCatalog(), []);
    assert.equal(createAccountWithPassword('Companion Life Audit', 'pwd', { persistentLogin: true }).ok, true);

    let state = createNewGameState({ nationId: 'thornwall', name: 'Road Companion Auditor' });
    moveStateTo(state, 'timbercross-landing');

    const recruited = recruitCompanion(state, MARA_ID);
    assert.equal(recruited.ok, true, recruited.display?.text ?? recruited.reason);
    let mara = getRecruitedCompanion(state, MARA_ID);
    assert.equal(mara.npcId, MARA_NPC_ID);
    assert.equal(mara.tactics.approachId, 'guard-the-road');
    const permanentAttributes = { ...mara.baseAttributes };

    let view = createGameViewModel(state, createUiState({ screen: 'game', activeView: 'character' }));
    const projectedMara = view.party.entries.find((entry) => entry.id === MARA_ID);
    assert.ok(projectedMara);
    assert.match(projectedMara.description, /bent grass/i);
    assert.equal(projectedMara.currentApproach.name, 'Guard the Road');
    const seekAction = projectedMara.approaches.find((entry) => entry.id === 'seek-the-opening').action;
    assert.equal(seekAction.intent, 'party.approach.set');

    const uiState = createUiState({ screen: 'game', activeView: 'character' });
    const semantic = dispatchUiIntent({
        intent: seekAction.intent,
        payload: seekAction.payload,
        state,
        uiState,
        session: {},
        services: {},
    });
    assert.equal(semantic.ok, true);
    assert.match(semantic.message, /find the seam/i);
    assert.equal(getRecruitedCompanion(state, MARA_ID).tactics.approachId, 'seek-the-opening');

    setCompanionApproach(state, MARA_ID, 'guard-the-road');
    const guardEntity = getActiveCompanionCombatEntities(state)[0];
    const guardProfile = calculateCombatProfile(guardEntity);
    setCompanionApproach(state, MARA_ID, 'seek-the-opening');
    const seekEntity = getActiveCompanionCombatEntities(state)[0];
    const seekProfile = calculateCombatProfile(seekEntity);
    assert.ok(seekProfile.attack > guardProfile.attack, 'Seek the Opening should trade caution for stronger attack');
    assert.ok(guardProfile.evasion > seekProfile.evasion, 'Guard the Road should make Mara harder to hit');
    assert.deepEqual(getRecruitedCompanion(state, MARA_ID).baseAttributes, permanentAttributes, 'field approach must not rewrite Mara’s permanent attributes');

    assert.equal(saveGame(state), true);
    state = loadCharacter('Road Companion Auditor');
    mara = getRecruitedCompanion(state, MARA_ID);
    assert.ok(mara);
    assert.equal(mara.id, MARA_ID);
    assert.equal(mara.npcId, MARA_NPC_ID);
    assert.equal(mara.tactics.approachId, 'seek-the-opening', 'chosen approach should survive real account save/load');

    moveStateTo(state, 'west-elderwood');
    const battle = startEncounter(state, 'enemy-brush-hare', { source: 'companion-life-test' });
    assert.equal(battle.ok, true, battle.display?.text ?? battle.reason);
    const battleMara = state.activeBattle.combatants.find((entry) => entry.id === MARA_ID);
    assert.ok(battleMara, 'the same persistent companion should enter battle');
    assert.ok(calculateCombatProfile(battleMara).attack >= seekProfile.attack);
    const blocked = setCompanionApproach(state, MARA_ID, 'guard-the-road');
    assert.equal(blocked.ok, false);
    assert.match(blocked.display.text, /before the fighting begins/i);
    assert.deepEqual(validateGameState(state), []);
});

test('active Mara remains the same NPC-backed person through canonical travel', () => {
    const state = createNewGameState({ nationId: 'thornwall', name: 'Road Sync Auditor' });
    moveStateTo(state, 'thornwall-crownward');
    assert.equal(recruitCompanion(state, MARA_ID, { ignoreRequirements: true }).ok, true);
    assert.equal(setCompanionApproach(state, MARA_ID, 'seek-the-opening').ok, true);

    const journey = startTravel(state, 'timbercross-landing');
    assert.equal(journey.ok, true, journey.display?.text ?? journey.reason);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.currentPlaceId, 'timbercross-landing');

    const mara = getRecruitedCompanion(state, MARA_ID);
    const backingNpc = state.npcs.find((npc) => npc.id === MARA_NPC_ID);
    assert.equal(mara.locationId, 'timbercross-landing');
    assert.equal(mara.tactics.approachId, 'seek-the-opening');
    assert.equal(backingNpc.identity.locationId, 'timbercross-landing');
    assert.equal(backingNpc.flags.companionActive, true);
});
