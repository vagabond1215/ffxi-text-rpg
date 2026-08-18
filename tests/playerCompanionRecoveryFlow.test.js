import test from 'node:test';
import assert from 'node:assert/strict';

import { getPlace } from '../js/text/data/places.js';
import { createNewGameState } from '../js/text/gameState.js';
import { createAccountWithPassword, loadCharacter, saveGame } from '../js/text/save.js';
import { advanceActiveActivityToCompletion } from '../js/text/systems/activityAdvanceEngine.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import {
    CAMPAIGN_RECOVERY_DURATIONS,
    CAMPAIGN_RECOVERY_KINDS,
    createCampaignRecoveryModel,
    startCampaignRecovery,
} from '../js/text/systems/campaignRecoveryEngine.js';
import {
    getRecruitedCompanion,
    joinCompanion,
    leaveCompanion,
    recruitCompanion,
    syncActivePartyLocation,
} from '../js/text/systems/partyEngine.js';
import { calculateCombatProfile } from '../js/text/systems/statEngine.js';
import { validateGameState } from '../js/text/systems/validation.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { createUiState } from '../js/text/ui/uiState.js';

const MARA_ID = 'companion-mara-venn';

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
    setPositionAndDiscover(state, place.id, place.coordinateSystem.start, { important: ['Companion recovery test setup'] });
    syncActivePartyLocation(state, place.id);
}

test('0.8.600 lets an injured inactive companion share safe settlement recovery and rejoin after real fictional time', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Companion Recovery Audit', 'pwd', { persistentLogin: true }).ok, true);

    let state = createNewGameState({ nationId: 'thornwall', name: 'Recovery Auditor' });
    moveStateTo(state, 'timbercross-landing');
    assert.equal(recruitCompanion(state, MARA_ID).ok, true);
    moveStateTo(state, 'thornwall-southgate');

    const canonicalMara = state.party.companions[MARA_ID];
    canonicalMara.resources.hp = 0;
    canonicalMara.resources.mp = 0;
    const maxBefore = calculateCombatProfile(canonicalMara).resources;

    const left = leaveCompanion(state, MARA_ID);
    assert.equal(left.ok, true, left.display?.text ?? left.reason);
    assert.equal(state.party.activeCompanionIds.includes(MARA_ID), false);
    assert.equal(getRecruitedCompanion(state, MARA_ID).locationId, 'thornwall-southgate');

    const blockedJoin = joinCompanion(state, MARA_ID);
    assert.equal(blockedJoin.ok, false);
    assert.match(blockedJoin.display.text, /recover before taking the road/i);

    const beforeView = createGameViewModel(state, createUiState({ screen: 'game', activeView: 'character' }));
    const projectedBefore = beforeView.party.entries.find((entry) => entry.id === MARA_ID);
    assert.equal(projectedBefore.hp, 0);

    const recovery = createCampaignRecoveryModel(state);
    assert.equal(recovery.mode, CAMPAIGN_RECOVERY_KINDS.SETTLEMENT);
    assert.equal(recovery.durationSeconds, CAMPAIGN_RECOVERY_DURATIONS[CAMPAIGN_RECOVERY_KINDS.SETTLEMENT]);
    assert.equal(recovery.playerInjured, false, 'the player can be healthy while a nearby companion needs rest');
    assert.equal(recovery.injuredCompanionCount, 1);
    assert.equal(recovery.companions.find((entry) => entry.id === MARA_ID)?.active, false);
    assert.equal(recovery.available, true);

    const startedAt = state.worldTime.totalSeconds;
    const started = startCampaignRecovery(state);
    assert.equal(started.ok, true, started.display?.text ?? started.reason);
    assert.match(started.display.text, /Nearby companions who stay here recover with you/i);
    const completed = advanceActiveActivityToCompletion(state);
    assert.equal(completed.ok, true, completed.display?.text ?? completed.reason);
    assert.equal(state.worldTime.totalSeconds, startedAt + 60 * 60);

    const recoveredMara = getRecruitedCompanion(state, MARA_ID);
    assert.equal(recoveredMara.resources.hp, maxBefore.maxHp);
    assert.equal(recoveredMara.resources.mp, maxBefore.maxMp);
    assert.equal(state.party.activeCompanionIds.includes(MARA_ID), false, 'safe rest does not silently change party membership');

    const afterView = createGameViewModel(state, createUiState({ screen: 'game', activeView: 'character' }));
    const projectedAfter = afterView.party.entries.find((entry) => entry.id === MARA_ID);
    assert.ok(projectedAfter.membershipAction, 'recovered companion should again expose the normal reunion action');
    assert.equal(projectedAfter.membershipAction.intent, 'party.join');

    const joined = joinCompanion(state, MARA_ID);
    assert.equal(joined.ok, true, joined.display?.text ?? joined.reason);
    assert.equal(state.party.activeCompanionIds.includes(MARA_ID), true);

    assert.equal(saveGame(state), true);
    state = loadCharacter('Recovery Auditor');
    assert.equal(getRecruitedCompanion(state, MARA_ID).resources.hp, maxBefore.maxHp);
    assert.equal(state.party.activeCompanionIds.includes(MARA_ID), true);
    assert.deepEqual(validateGameState(state), []);
});

test('0.8.600 refuses to leave a downed companion behind in unsafe wilderness', () => {
    const state = createNewGameState({ nationId: 'thornwall', name: 'Road Safety Auditor' });
    moveStateTo(state, 'timbercross-landing');
    assert.equal(recruitCompanion(state, MARA_ID).ok, true);
    moveStateTo(state, 'west-elderwood');
    state.party.companions[MARA_ID].resources.hp = 0;

    const result = leaveCompanion(state, MARA_ID);
    assert.equal(result.ok, false);
    assert.equal(result.code, 'party.downed-in-danger');
    assert.match(result.display.text, /safe settlement|recover together/i);
    assert.equal(state.party.activeCompanionIds.includes(MARA_ID), true, 'failed separation must not mutate party membership');
    assert.equal(getRecruitedCompanion(state, MARA_ID).locationId, 'west-elderwood');
    assert.deepEqual(validateGameState(state), []);
});
