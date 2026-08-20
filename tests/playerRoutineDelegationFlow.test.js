import test from 'node:test';
import assert from 'node:assert/strict';

import { getResourceItem } from '../js/text/data/resourceItems.js';
import { createNewGameState } from '../js/text/gameState.js';
import { createAccountWithPassword, loadCharacter, saveGame } from '../js/text/save.js';
import { advanceActiveActivityToCompletion } from '../js/text/systems/activityAdvanceEngine.js';
import { getBlockingHandsOnTask } from '../js/text/systems/characterActivityEngine.js';
import {
    CULTIVATION_DELEGATED_TEND_SECONDS,
    CULTIVATION_DELEGATION_WAGE_GIL,
    CULTIVATION_GROWTH_SECONDS,
    CULTIVATION_ITEM_ID,
    CULTIVATION_PLOT_ID,
    CULTIVATION_TEND_DUE_SECONDS,
    canDelegateCultivationTending,
    getCultivationPlotStatus,
    harvestCultivationCrop,
    reconcileCultivationDelegation,
    scheduleCultivationTendingDelegation,
} from '../js/text/systems/cultivationEngine.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { validateGameState } from '../js/text/systems/validation.js';
import { gainWorkProficiency, getWorkProficiency } from '../js/text/systems/workProficiencyEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { dispatchUiIntent } from '../js/text/ui/uiIntentDispatcher.js';
import { createUiState } from '../js/text/ui/uiState.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() {
    globalThis.localStorage = new MemoryStorage();
}

function cultivationEntry(state, uiState) {
    const view = createGameViewModel(state, uiState);
    const entry = view.opportunities.entries.find((candidate) => candidate.id === 'cultivation-home-sweetroot-bed');
    assert.ok(entry);
    return entry;
}

function dispatchCultivation(state, uiState) {
    const entry = cultivationEntry(state, uiState);
    assert.ok(entry.action, `expected cultivation action while ${entry.status}`);
    const result = dispatchUiIntent({
        intent: entry.action.intent,
        payload: entry.action.payload,
        state,
        uiState,
        session: {},
        services: {},
    });
    assert.equal(result.ok, true, result.reason);
    if (result.cultivationResult) assert.equal(result.cultivationResult.ok, true, result.message);
    return { entry, result };
}

function addSweetroot(state, quantity = 1) {
    const item = getResourceItem(CULTIVATION_ITEM_ID);
    assert.ok(item);
    const result = addItemToContainer(state.player.inventoryState, 'inventory', { ...item, quantity });
    assert.equal(result.ok, true, result.reason);
}

function advanceTo(state, worldSeconds) {
    const delta = worldSeconds - state.worldTime.totalSeconds;
    assert.ok(delta >= 0);
    if (delta === 0) return;
    assert.equal(advanceWorldTime(state, delta, { source: 'routine-delegation-test' }).ok, true);
}

function completeManualFirstCycle(state, uiState) {
    addSweetroot(state, 2);
    assert.equal(dispatchCultivation(state, uiState).entry.action.intent, 'cultivation.prepare');
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(dispatchCultivation(state, uiState).entry.action.intent, 'cultivation.plant');
    advanceTo(state, state.cultivation.plot.crop.tendDueAtWorldSeconds);
    assert.equal(getCultivationPlotStatus(state), 'needsTending');
    assert.equal(dispatchCultivation(state, uiState).entry.action.intent, 'cultivation.tend');
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    advanceTo(state, state.cultivation.plot.crop.readyAtWorldSeconds);
    assert.equal(dispatchCultivation(state, uiState).entry.action.intent, 'cultivation.harvest');
    assert.equal(state.cultivation.plot.harvestCount, 1);
    assert.equal(getWorkProficiency(state.player, 'cultivation'), 4);
}

test('0.8.800 earns paid Sweetroot tending delegation without a second clock, hands-on lock, or duplicate consequence', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Delegation Audit', 'pwd', { persistentLogin: true }).ok, true);

    let state = createNewGameState({ nationId: 'thornwall', name: 'Delegation Auditor' });
    const uiState = createUiState({ screen: 'game', activeView: 'journal' });
    completeManualFirstCycle(state, uiState);

    assert.equal(dispatchCultivation(state, uiState).entry.action.intent, 'cultivation.prepare');
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(dispatchCultivation(state, uiState).entry.action.intent, 'cultivation.plant');
    assert.equal(state.cultivation.plot.crop.cycle, 2);
    assert.equal(state.cultivation.plot.crop.readyAtWorldSeconds - state.cultivation.plot.crop.plantedAtWorldSeconds, CULTIVATION_GROWTH_SECONDS);
    assert.equal(state.cultivation.plot.crop.tendDueAtWorldSeconds - state.cultivation.plot.crop.plantedAtWorldSeconds, CULTIVATION_TEND_DUE_SECONDS);

    const delegateEntry = cultivationEntry(state, uiState);
    assert.equal(delegateEntry.status, 'available', 'delegation should be visible without stealing top recommendation priority');
    assert.equal(delegateEntry.action.intent, 'cultivation.tend');
    assert.match(delegateEntry.action.label, /Arrange tending help/i);
    assert.match(delegateEntry.action.label, new RegExp(`${CULTIVATION_DELEGATION_WAGE_GIL} gil`));
    assert.equal(canDelegateCultivationTending(state).ok, true);

    const proficiencyBefore = getWorkProficiency(state.player, 'cultivation');
    const gilBefore = state.player.wallet.gil;
    const delegated = dispatchCultivation(state, uiState);
    assert.equal(delegated.result.cultivationResult.code, 'cultivation.tending-delegated');
    assert.equal(state.player.wallet.gil, gilBefore - CULTIVATION_DELEGATION_WAGE_GIL);
    assert.equal(state.cultivation.plot.delegation.assignment.status, 'active');
    assert.equal(state.cultivation.plot.delegation.assignment.cycle, 2);
    assert.equal(
        state.cultivation.plot.delegation.assignment.completesAtWorldSeconds
            - state.cultivation.plot.delegation.assignment.startsAtWorldSeconds,
        CULTIVATION_DELEGATED_TEND_SECONDS,
    );
    assert.equal(getBlockingHandsOnTask(state), null, 'paid tending does not occupy the character hands-on work channel');
    assert.equal(state.tasks.records.some((task) => task.kind.includes('cultivation') && task.status === 'active'), false, 'delegated tending creates no crop/helper timed task');

    assert.equal(saveGame(state), true);
    state = loadCharacter('Delegation Auditor');
    assert.ok(state);
    const assignment = state.cultivation.plot.delegation.assignment;
    assert.equal(assignment.status, 'active');
    assert.equal(assignment.wageGil, CULTIVATION_DELEGATION_WAGE_GIL);
    assert.equal(state.player.wallet.gil, gilBefore - CULTIVATION_DELEGATION_WAGE_GIL, 'wage is not charged again on load');

    advanceTo(state, assignment.completesAtWorldSeconds - 1);
    assert.equal(getCultivationPlotStatus(state), 'delegatedTending');
    assert.equal(state.cultivation.plot.crop.tendedAtWorldSeconds, null);
    advanceTo(state, assignment.completesAtWorldSeconds);
    assert.equal(getCultivationPlotStatus(state), 'growing');
    assert.equal(state.cultivation.plot.crop.tendedAtWorldSeconds, assignment.completesAtWorldSeconds);
    assert.equal(state.cultivation.plot.delegation.assignment.status, 'completed');
    assert.equal(state.cultivation.plot.delegation.completedCount, 1);
    assert.equal(getWorkProficiency(state.player, 'cultivation'), proficiencyBefore, 'helper work does not grant player mastery');
    assert.deepEqual(reconcileCultivationDelegation(state), [], 'delegated tending cannot replay after completion');
    assert.equal(state.cultivation.plot.delegation.completedCount, 1);
    assert.equal(
        state.events.records.filter((event) => event.type === 'cultivation.delegated-tending-completed').length,
        1,
    );

    assert.equal(saveGame(state), true);
    state = loadCharacter('Delegation Auditor');
    assert.ok(state);
    assert.equal(state.cultivation.plot.delegation.assignment.status, 'completed');
    assert.equal(state.cultivation.plot.delegation.completedCount, 1);
    advanceTo(state, state.cultivation.plot.crop.readyAtWorldSeconds);
    assert.equal(getCultivationPlotStatus(state), 'ready');

    const harvested = harvestCultivationCrop(state);
    assert.equal(harvested.ok, true, harvested.display?.text);
    assert.equal(harvested.data.delegatedTending, true);
    assert.equal(state.cultivation.plot.harvestCount, 2);
    assert.equal(state.cultivation.plot.delegation.assignment, null);
    assert.equal(getWorkProficiency(state.player, 'cultivation'), proficiencyBefore + 2, 'player still gains mastery for their own harvest');
    const cultivated = state.player.inventoryState.containers.inventory.items.find((item) =>
        item.id === CULTIVATION_ITEM_ID
        && item.provenance?.[0]?.sourceId === CULTIVATION_PLOT_ID
        && item.provenance?.[0]?.data?.cycle === 2,
    );
    assert.ok(cultivated);
    assert.equal(cultivated.provenance[0].data.tendingMode, 'delegated');

    const quantityBeforeReplay = cultivated.quantity;
    const replay = harvestCultivationCrop(state);
    assert.equal(replay.ok, false);
    assert.equal(cultivated.quantity, quantityBeforeReplay);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
    assert.deepEqual(validateGameState(state), []);
});

test('delegated tending refuses insufficient wages atomically after the routine is earned', () => {
    const state = createNewGameState({ nationId: 'thornwall' });
    const now = state.worldTime.totalSeconds;
    state.cultivation.plot.harvestCount = 1;
    state.cultivation.plot.cycle = 1;
    state.cultivation.plot.phase = 'growing';
    state.cultivation.plot.crop = {
        itemId: CULTIVATION_ITEM_ID,
        cycle: 1,
        plantedAtWorldSeconds: now,
        tendDueAtWorldSeconds: now + CULTIVATION_TEND_DUE_SECONDS,
        readyAtWorldSeconds: now + CULTIVATION_GROWTH_SECONDS,
        tendedAtWorldSeconds: null,
        seedProvenance: [],
    };
    gainWorkProficiency(state, 'cultivation', 4, { sourceId: CULTIVATION_PLOT_ID });
    state.player.wallet.gil = CULTIVATION_DELEGATION_WAGE_GIL - 1;

    const gilBefore = state.player.wallet.gil;
    const result = scheduleCultivationTendingDelegation(state);
    assert.equal(result.ok, false);
    assert.equal(result.code, 'cultivation.delegation-blocked');
    assert.equal(state.player.wallet.gil, gilBefore);
    assert.equal(state.cultivation.plot.delegation.assignment, null);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});