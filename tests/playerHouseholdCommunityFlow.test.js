import test from 'node:test';
import assert from 'node:assert/strict';

import { validateCommitmentCatalog } from '../js/text/data/commitments.js';
import { getResourceItem } from '../js/text/data/resourceItems.js';
import { createNewGameState } from '../js/text/gameState.js';
import { createAccountWithPassword, loadCharacter, saveGame } from '../js/text/save.js';
import {
    CULTIVATION_ITEM_ID,
    CULTIVATION_PLOT_ID,
} from '../js/text/systems/cultivationEngine.js';
import { getCommitmentRecord } from '../js/text/systems/commitmentEngine.js';
import { advanceSimulationWithDayPolicy, ensureDayCycleState } from '../js/text/systems/dayCycleEngine.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { performLocalityPoiAction } from '../js/text/systems/localityEngine.js';
import { getNpcScheduleStatus, validateNpcScheduleCatalog } from '../js/text/systems/npcScheduleEngine.js';
import { getNpcRelationship } from '../js/text/systems/relationshipEngine.js';
import { setEndOfDayPause } from '../js/text/systems/simulationControlEngine.js';
import { validateGameState, validateWorldData } from '../js/text/systems/validation.js';
import { advanceWorldTime, SECONDS_PER_DAY } from '../js/text/systems/worldTimeEngine.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { dispatchUiIntent } from '../js/text/ui/uiIntentDispatcher.js';
import { createUiState } from '../js/text/ui/uiState.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

const CASES = Object.freeze([
    Object.freeze({
        nationId: 'thornwall',
        contactNpcId: 'npc-thornwall-mira-fen',
        contactName: 'Mira Fen',
        poiId: 'poi-sandoria-s-aveline',
        commitmentId: 'commitment-thornwall-hearth-sweetroot-share',
        rewardGil: 18,
        followUpDelayDays: 2,
        relationshipAfterResolve: { familiarity: 1, respect: 0, trust: 0, obligation: 1 },
        followUpPattern: /neighbor|morning|lodging garden/i,
    }),
    Object.freeze({
        nationId: 'brasshaven',
        contactNpcId: 'npc-brasshaven-mae-oris',
        contactName: 'Mae Oris',
        poiId: 'poi-bastok-markets-carmelide',
        commitmentId: 'commitment-brasshaven-courtyard-sweetroot-share',
        rewardGil: 24,
        followUpDelayDays: 1,
        relationshipAfterResolve: { familiarity: 0, respect: 1, trust: 1, obligation: 0 },
        followUpPattern: /courtyard|routine work|bed/i,
    }),
    Object.freeze({
        nationId: 'mistmere',
        contactNpcId: 'npc-mistmere-kiri-fen',
        contactName: 'Kiri Fen',
        poiId: 'poi-waters-hilkomu-makimu',
        commitmentId: 'commitment-mistmere-canalside-sweetroot-share',
        rewardGil: 20,
        followUpDelayDays: 2,
        relationshipAfterResolve: { familiarity: 1, respect: 0, trust: 1, obligation: 0 },
        followUpPattern: /feverish neighbor|remedy|bed/i,
    }),
]);

function installStorage() {
    globalThis.localStorage = new MemoryStorage();
}

function journal(state) {
    return createGameViewModel(state, createUiState({ screen: 'game', activeView: 'journal' }));
}

function commitmentEntry(state, commitmentId) {
    return journal(state).opportunities.entries.find((entry) => entry.id === `commitment-${commitmentId}`) ?? null;
}

function dispatchEntry(state, entry) {
    assert.ok(entry?.action, `expected semantic action for ${entry?.id ?? 'missing entry'}`);
    const result = dispatchUiIntent({
        intent: entry.action.intent,
        payload: entry.action.payload,
        state,
        uiState: createUiState({ screen: 'game', activeView: 'journal' }),
        session: {},
        services: {},
    });
    assert.equal(result.ok, true, result.reason);
    const domainResult = result.commitmentResult ?? result.result ?? null;
    if (domainResult) assert.equal(domainResult.ok, true, domainResult.display?.text ?? result.message);
    return result;
}

function advanceIntoContactWindow(state, npcId) {
    const status = getNpcScheduleStatus(state, npcId);
    assert.equal(status.scheduled, true);
    if (status.available) return;
    assert.ok(status.nextAvailableInSeconds >= 0);
    assert.equal(advanceWorldTime(state, status.nextAvailableInSeconds + 60, { source: 'household-community-test' }).ok, true);
    assert.equal(getNpcScheduleStatus(state, npcId).available, true);
}

function addWildSweetroot(state) {
    const item = getResourceItem(CULTIVATION_ITEM_ID);
    assert.ok(item);
    const stored = addItemToContainer(state.player.inventoryState, 'inventory', { ...item, quantity: 1 });
    assert.equal(stored.ok, true, stored.reason);
}

function addHomeSweetroot(state) {
    const item = getResourceItem(CULTIVATION_ITEM_ID);
    assert.ok(item);
    const stored = addItemToContainer(state.player.inventoryState, 'inventory', {
        ...item,
        quantity: 1,
        provenance: [{
            version: 1,
            type: 'flora',
            sourceId: CULTIVATION_PLOT_ID,
            placeId: state.currentPlaceId,
            action: 'gather',
            exceptional: false,
            notes: 'Cultivated at the character home foothold from a physical propagation root.',
            data: {
                cultivated: true,
                cycle: 1,
                plantedAtWorldSeconds: state.worldTime.totalSeconds - (2 * SECONDS_PER_DAY),
                tendedAtWorldSeconds: state.worldTime.totalSeconds - SECONDS_PER_DAY,
                readyAtWorldSeconds: state.worldTime.totalSeconds,
                tendingMode: 'manual',
                seedItemId: CULTIVATION_ITEM_ID,
                seedProvenance: [],
            },
        }],
    });
    assert.equal(stored.ok, true, stored.reason);
}

function quantityBySource(state, sourceId) {
    return (state.player.inventoryState?.containers?.inventory?.items ?? []).reduce((total, item) => {
        const matches = item.id === CULTIVATION_ITEM_ID
            && item.provenance?.some((entry) => entry.sourceId === sourceId);
        return matches ? total + Math.max(1, Number(item.quantity) || 1) : total;
    }, 0);
}

test('0.8.900 adds three scheduled home-community relationships driven by cultivated produce', () => {
    assert.deepEqual(validateCommitmentCatalog(), []);
    assert.deepEqual(validateNpcScheduleCatalog(), []);
    assert.deepEqual(validateWorldData(), []);

    for (const fixture of CASES) {
        installStorage();
        const accountName = `${fixture.contactName} Household Audit`;
        const characterName = `${fixture.contactName} Neighbor`;
        assert.equal(createAccountWithPassword(accountName, 'pwd', { persistentLogin: true }).ok, true);

        let state = createNewGameState({ nationId: fixture.nationId, name: characterName });
        assert.ok(state.npcs.some((npc) => npc.id === fixture.contactNpcId && npc.identity?.name === fixture.contactName));
        assert.equal(commitmentEntry(state, fixture.commitmentId), null, 'the community request should remain unknown before meeting the person');

        const schedule = getNpcScheduleStatus(state, fixture.contactNpcId);
        assert.equal(schedule.scheduled, true);
        advanceIntoContactWindow(state, fixture.contactNpcId);
        assert.equal(performLocalityPoiAction(state, fixture.poiId, 'talk').ok, true);

        let entry = commitmentEntry(state, fixture.commitmentId);
        assert.ok(entry);
        assert.equal(entry.status, 'ready');
        assert.equal(entry.action.intent, 'commitment.accept');
        dispatchEntry(state, entry);
        assert.equal(getCommitmentRecord(state, fixture.commitmentId)?.status, 'active');

        addWildSweetroot(state);
        entry = commitmentEntry(state, fixture.commitmentId);
        assert.ok(entry);
        assert.notEqual(entry.action?.intent, 'commitment.resolve', 'a wild-foraged Sweetroot must not satisfy a request for home-grown produce');
        assert.equal(quantityBySource(state, 'source-west-elderwood-sweetroot-patch'), 1);

        addHomeSweetroot(state);
        entry = commitmentEntry(state, fixture.commitmentId);
        assert.equal(entry.status, 'ready');
        assert.equal(entry.action?.intent, 'commitment.resolve');
        const gilBefore = state.player.wallet.gil;
        dispatchEntry(state, entry);
        assert.equal(state.player.wallet.gil, gilBefore + fixture.rewardGil);
        assert.equal(quantityBySource(state, CULTIVATION_PLOT_ID), 0, 'the cultivated delivery is consumed exactly once');
        assert.equal(quantityBySource(state, 'source-west-elderwood-sweetroot-patch'), 1, 'the unrelated wild root remains carried');
        assert.deepEqual(getNpcRelationship(state, fixture.contactNpcId).dimensions, fixture.relationshipAfterResolve);

        const rewardGil = state.player.wallet.gil;
        entry = commitmentEntry(state, fixture.commitmentId);
        assert.ok(entry);
        assert.notEqual(entry.action?.intent, 'commitment.resolve');
        assert.equal(state.player.wallet.gil, rewardGil);

        assert.equal(saveGame(state), true);
        state = loadCharacter(characterName);
        assert.ok(state);
        assert.equal(getCommitmentRecord(state, fixture.commitmentId)?.status, 'resolved');
        assert.deepEqual(getNpcRelationship(state, fixture.contactNpcId).dimensions, fixture.relationshipAfterResolve);

        setEndOfDayPause(state, false);
        ensureDayCycleState(state);
        assert.equal(advanceSimulationWithDayPolicy(state, fixture.followUpDelayDays * SECONDS_PER_DAY).ok, true);
        assert.equal(getNpcScheduleStatus(state, fixture.contactNpcId).available, true, 'whole-day return should preserve the contact’s daily availability window');

        entry = commitmentEntry(state, fixture.commitmentId);
        assert.equal(entry.status, 'ready');
        assert.equal(entry.action?.intent, 'commitment.followUp');
        assert.match(entry.progress, fixture.followUpPattern);
        dispatchEntry(state, entry);
        const followed = getNpcRelationship(state, fixture.contactNpcId).dimensions;
        assert.equal(followed.familiarity, fixture.relationshipAfterResolve.familiarity + 1);
        assert.equal(followed.respect, fixture.relationshipAfterResolve.respect);
        assert.equal(followed.trust, fixture.relationshipAfterResolve.trust);
        assert.equal(followed.obligation, fixture.relationshipAfterResolve.obligation);

        const afterFollowUp = commitmentEntry(state, fixture.commitmentId);
        assert.equal(afterFollowUp.status, 'complete');
        assert.equal(afterFollowUp.action, null);
        assert.deepEqual(validateGameState(state), []);
    }
});

test('home-community contacts have distinct authored daily windows and do not create a social clock', () => {
    const state = createNewGameState({ nationId: 'thornwall' });
    const windows = CASES.map((fixture) => {
        const status = getNpcScheduleStatus(state, fixture.contactNpcId);
        return status.windowSummary;
    });
    assert.equal(new Set(windows).size, CASES.length);
    assert.deepEqual(windows, ['06:00–11:00', '11:00–17:00', '16:00–21:00']);
    assert.equal(Object.hasOwn(state, 'socialClock'), false);
    assert.equal(Object.hasOwn(state, 'householdRelationships'), false);
});