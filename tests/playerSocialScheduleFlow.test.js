import test from 'node:test';
import assert from 'node:assert/strict';
import { reachPoi, useKnownPoi } from './helpers/localKnowledgeTestSupport.js';

import { createNewGameState } from '../js/text/gameState.js';
import { createAccountWithPassword, loadCharacter, saveGame } from '../js/text/save.js';
import { acceptCommitment } from '../js/text/systems/commitmentEngine.js';
import { performLocalityPoiAction } from '../js/text/systems/localityEngine.js';
import {
    getNpcScheduleStatus,
    validateNpcScheduleCatalog,
} from '../js/text/systems/npcScheduleEngine.js';
import { talkAtCurrentGrid } from '../js/text/systems/poiEngine.js';
import { validateGameState, validateWorldData } from '../js/text/systems/validation.js';
import { advanceWorldTime, SECONDS_PER_HOUR } from '../js/text/systems/worldTimeEngine.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { createUiState } from '../js/text/ui/uiState.js';

const SERA_NPC_ID = 'npc-thornwall-sera-talwin';
const SERA_POI_ID = 'poi-sandoria-s-alaune';
const COMMITMENT_ID = 'commitment-thornwall-sweetroot-return';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() {
    globalThis.localStorage = new MemoryStorage();
}

function gameModel(state) {
    return createGameViewModel(state, createUiState({ screen: 'game', activeView: 'journal' }));
}

function seraCommitment(model) {
    return model.opportunities.entries.find((entry) => entry.id.includes(COMMITMENT_ID)) ?? null;
}

test('0.8.500 makes Sera availability depend on canonical fictional time without persisted schedule state', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Social Schedule Audit', 'pwd', { persistentLogin: true }).ok, true);

    let state = createNewGameState({ nationId: 'thornwall', name: 'Evening Caller' });
    assert.equal(state.worldTime.totalSeconds, 8 * SECONDS_PER_HOUR);
    assert.equal('npcSchedules' in state, false, 'schedule authority must stay derived rather than becoming persisted runtime state');
    assert.deepEqual(validateNpcScheduleCatalog(), []);

    let status = getNpcScheduleStatus(state, SERA_NPC_ID);
    assert.equal(status.scheduled, true);
    assert.equal(status.available, true);
    assert.equal(status.windowSummary, '08:00–18:00');
    assert.equal(status.currentWindowEndSecond, 18 * SECONDS_PER_HOUR);

    const morningTalk = useKnownPoi(state, SERA_POI_ID, 'talk');
    assert.equal(morningTalk.ok, true, morningTalk.message);
    assert.match(morningTalk.message, /Sera Talwin/i);

    let model = gameModel(state);
    let nearbySera = model.scene.nearby.find((entry) => entry.id === SERA_POI_ID);
    assert.ok(nearbySera);
    assert.match(nearbySera.notes, /08:00–18:00|until 18:00/i);
    assert.equal(seraCommitment(model)?.action?.intent, 'commitment.accept');

    assert.equal(advanceWorldTime(state, (10 * SECONDS_PER_HOUR) + (30 * 60)).ok, true);
    assert.equal(state.worldTime.totalSeconds, (18 * SECONDS_PER_HOUR) + (30 * 60));
    status = getNpcScheduleStatus(state, SERA_NPC_ID);
    assert.equal(status.available, false);
    assert.equal(status.nextAvailableInSeconds, (13 * SECONDS_PER_HOUR) + (30 * 60));
    assert.equal(status.nextAvailableSecondOfDay, 8 * SECONDS_PER_HOUR);

    const positionBeforeBlockedTalk = { ...state.position };
    reachPoi(state, SERA_POI_ID);
    const eveningTalk = performLocalityPoiAction(state, SERA_POI_ID, 'talk');
    assert.equal(eveningTalk.ok, false);
    assert.equal(eveningTalk.code, 'locality.poi-unavailable-now');
    assert.match(eveningTalk.message, /away from Southgate duties/i);
    assert.match(eveningTalk.message, /returns 08:00/i);
    assert.deepEqual(state.position, positionBeforeBlockedTalk, 'blocked social interaction must not move the character or create hidden time cost');
    assert.match(talkAtCurrentGrid(state, 'Sera Talwin'), /returns 08:00/i, 'command-path talk must share the same schedule authority');

    const blockedAccept = acceptCommitment(state, COMMITMENT_ID);
    assert.equal(blockedAccept.ok, false);
    assert.equal(blockedAccept.code, 'commitment.giver-unavailable');
    assert.match(blockedAccept.display.text, /08:00–18:00/i);

    model = gameModel(state);
    nearbySera = model.scene.nearby.find((entry) => entry.id === SERA_POI_ID);
    assert.ok(nearbySera);
    assert.match(nearbySera.notes, /away from Southgate duties/i);
    const blockedJournal = seraCommitment(model);
    assert.ok(blockedJournal);
    assert.equal(blockedJournal.status, 'blocked');
    assert.equal(blockedJournal.action, null, 'Journal must not advertise a conversation action the domain engine will reject');
    assert.match(blockedJournal.summary, /away from Southgate duties/i);

    assert.equal(saveGame(state), true);
    state = loadCharacter('Evening Caller');
    assert.ok(state);
    assert.equal('npcSchedules' in state, false);
    status = getNpcScheduleStatus(state, SERA_NPC_ID);
    assert.equal(status.available, false, 'availability must re-derive from persisted fictional time after load');
    assert.equal(status.nextAvailableInSeconds, (13 * SECONDS_PER_HOUR) + (30 * 60));

    assert.equal(advanceWorldTime(state, status.nextAvailableInSeconds).ok, true);
    status = getNpcScheduleStatus(state, SERA_NPC_ID);
    assert.equal(status.available, true);
    assert.equal(status.nextAvailableInSeconds, 0);
    const nextMorningAccept = acceptCommitment(state, COMMITMENT_ID);
    assert.equal(nextMorningAccept.ok, true, nextMorningAccept.display?.text);

    assert.deepEqual(validateGameState(state), []);
    assert.deepEqual(validateWorldData(), []);
});
