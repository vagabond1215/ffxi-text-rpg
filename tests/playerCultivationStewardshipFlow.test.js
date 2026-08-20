import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionDefinition } from '../js/text/data/productionCatalog.js';
import { getResourceItem } from '../js/text/data/resourceItems.js';
import { createNewGameState } from '../js/text/gameState.js';
import { createAccountWithPassword, loadCharacter, saveGame } from '../js/text/save.js';
import { advanceActiveActivityToCompletion } from '../js/text/systems/activityAdvanceEngine.js';
import {
    CULTIVATION_BASE_PREPARE_SECONDS,
    CULTIVATION_GROWTH_SECONDS,
    CULTIVATION_ITEM_ID,
    CULTIVATION_PLOT_ID,
    CULTIVATION_TEND_DUE_SECONDS,
    createCultivationModel,
    getCultivationPlotStatus,
    harvestCultivationCrop,
    reconcileCultivationWork,
} from '../js/text/systems/cultivationEngine.js';
import { canSellItem } from '../js/text/systems/itemBehaviorEngine.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { validateGameState } from '../js/text/systems/validation.js';
import { getWorkProficiency } from '../js/text/systems/workProficiencyEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';
import { renderGameScreen } from '../js/text/ui/domRenderer.js';
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
    assert.ok(entry, 'cultivation opportunity should be present');
    return { view, entry };
}

function dispatchCultivationAction(state, uiState) {
    const { view, entry } = cultivationEntry(state, uiState);
    assert.ok(entry.action, `expected cultivation action while status=${entry.status}`);
    const result = dispatchUiIntent({
        intent: entry.action.intent,
        payload: entry.action.payload,
        state,
        uiState,
        session: {},
        services: {},
    });
    if (result.cultivationResult) assert.equal(result.cultivationResult.ok, true, result.message);
    else assert.equal(result.ok, true, result.reason);
    return { view, entry, result };
}

function addWildSweetroot(state, quantity = 1) {
    const item = getResourceItem(CULTIVATION_ITEM_ID);
    assert.ok(item);
    const stored = addItemToContainer(state.player.inventoryState, 'inventory', { ...item, quantity });
    assert.equal(stored.ok, true, stored.reason);
    return stored.item;
}

function sweetrootQuantity(state) {
    return state.player.inventoryState.containers.inventory.items
        .filter((item) => item.id === CULTIVATION_ITEM_ID)
        .reduce((total, item) => total + (Number(item.quantity) || 1), 0);
}

test('0.8.700 turns one physical Sweetroot into a deterministic multi-day home crop with provenance, mastery, and exactly-once harvest', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Cultivation Audit', 'pwd', { persistentLogin: true }).ok, true);

    let state = createNewGameState({ nationId: 'thornwall', name: 'Cultivation Auditor' });
    const uiState = createUiState({ screen: 'game', activeView: 'journal' });
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
    assert.deepEqual(validateGameState(state), []);
    assert.equal(getCultivationPlotStatus(state), 'unprepared');

    const initial = cultivationEntry(state, uiState);
    const group = initial.view.opportunities.groups.find((candidate) => candidate.id === 'cultivation-stewardship');
    assert.ok(group);
    assert.equal(group.label, 'Cultivation & Stewardship');
    assert.equal(initial.entry.status, 'ready');
    assert.equal(initial.entry.action.intent, 'cultivation.prepare');

    const prepare = dispatchCultivationAction(state, uiState);
    assert.equal(prepare.entry.action.intent, 'cultivation.prepare');
    assert.equal(state.cultivation.plot.activeWorkKind, 'prepare');
    const firstPrepareWork = state.work.records.find((record) => record.id === state.cultivation.plot.activeWorkId);
    assert.ok(firstPrepareWork);
    const firstPrepareTask = state.tasks.records.find((task) => task.id === firstPrepareWork.taskId);
    assert.equal(firstPrepareTask.kind, 'work.cultivation-prepare');
    assert.equal(firstPrepareTask.completesAtWorldSeconds - firstPrepareTask.startedAtWorldSeconds, CULTIVATION_BASE_PREPARE_SECONDS);

    const prepareComplete = advanceActiveActivityToCompletion(state);
    assert.equal(prepareComplete.ok, true, prepareComplete.display?.text);
    assert.equal(prepareComplete.code, 'activity.completed');
    assert.equal(getCultivationPlotStatus(state), 'prepared');
    assert.equal(state.cultivation.plot.activeWorkId, null);
    assert.equal(state.tasks.records.some((task) => task.id === firstPrepareTask.id), false, 'completed cultivation labor releases its timed task');
    assert.equal(getWorkProficiency(state.player, 'cultivation'), 1);

    const wildRoot = addWildSweetroot(state, 1);
    const wildSourceId = wildRoot.provenance[0].sourceId;
    assert.equal(wildSourceId, 'source-west-elderwood-sweetroot-patch');
    const plantedAt = state.worldTime.totalSeconds;
    const planted = dispatchCultivationAction(state, uiState);
    assert.equal(planted.entry.action.intent, 'cultivation.plant');
    assert.equal(sweetrootQuantity(state), 0, 'planting consumes one physical propagation root');
    assert.equal(getCultivationPlotStatus(state), 'growing');
    assert.equal(state.cultivation.plot.crop.plantedAtWorldSeconds, plantedAt);
    assert.equal(state.cultivation.plot.crop.tendDueAtWorldSeconds, plantedAt + CULTIVATION_TEND_DUE_SECONDS);
    assert.equal(state.cultivation.plot.crop.readyAtWorldSeconds, plantedAt + CULTIVATION_GROWTH_SECONDS);
    assert.equal(state.cultivation.plot.crop.seedProvenance[0].sourceId, wildSourceId);
    assert.equal(state.tasks.records.some((task) => task.kind.includes('cultivation') && task.status === 'active'), false, 'crop growth has no long-lived timed task');

    assert.equal(saveGame(state), true);
    state = loadCharacter('Cultivation Auditor');
    assert.ok(state);
    assert.equal(state.cultivation.plot.crop.plantedAtWorldSeconds, plantedAt);
    assert.equal(state.cultivation.plot.crop.readyAtWorldSeconds, plantedAt + CULTIVATION_GROWTH_SECONDS);
    assert.equal(state.cultivation.plot.crop.seedProvenance[0].sourceId, wildSourceId);
    assert.equal(state.tasks.records.some((task) => task.kind.includes('cultivation') && task.status === 'active'), false);

    const toTending = state.cultivation.plot.crop.tendDueAtWorldSeconds - state.worldTime.totalSeconds;
    assert.ok(toTending > 0);
    assert.equal(advanceWorldTime(state, toTending, { source: 'cultivation-test' }).ok, true);
    assert.equal(getCultivationPlotStatus(state), 'needsTending');

    const tending = dispatchCultivationAction(state, uiState);
    assert.equal(tending.entry.action.intent, 'cultivation.tend');
    const tendWork = state.work.records.find((record) => record.id === state.cultivation.plot.activeWorkId);
    const tendTask = state.tasks.records.find((task) => task.id === tendWork.taskId);
    assert.equal(tendTask.kind, 'work.cultivation-tend');
    assert.ok(tendTask.completesAtWorldSeconds - tendTask.startedAtWorldSeconds < 10 * 60, 'prior cultivation practice reduces later hands-on duration');

    const tendComplete = advanceActiveActivityToCompletion(state);
    assert.equal(tendComplete.ok, true, tendComplete.display?.text);
    assert.equal(state.cultivation.plot.crop.tendedAtWorldSeconds, state.worldTime.totalSeconds);
    assert.equal(getWorkProficiency(state.player, 'cultivation'), 2);
    assert.deepEqual(reconcileCultivationWork(state), [], 'completed tending cannot replay its consequence');

    assert.equal(saveGame(state), true);
    state = loadCharacter('Cultivation Auditor');
    assert.ok(state);
    assert.equal(getWorkProficiency(state.player, 'cultivation'), 2);
    assert.ok(state.cultivation.plot.crop.tendedAtWorldSeconds !== null);

    const toHarvest = state.cultivation.plot.crop.readyAtWorldSeconds - state.worldTime.totalSeconds;
    assert.ok(toHarvest > 0);
    assert.equal(advanceWorldTime(state, toHarvest, { source: 'cultivation-test' }).ok, true);
    assert.equal(getCultivationPlotStatus(state), 'ready');

    const readyView = cultivationEntry(state, uiState);
    assert.equal(readyView.entry.action.intent, 'cultivation.harvest');
    const html = renderGameScreen(readyView.view, uiState, {});
    assert.match(html, /Cultivation &amp; Stewardship/);
    assert.match(html, /Sweetroot Stewardship/);
    assert.doesNotMatch(html, /plot-home-sweetroot-bed|cultivation\.plot|readyAtWorldSeconds|seedProvenance/);

    const harvested = dispatchCultivationAction(state, uiState);
    assert.equal(harvested.entry.action.intent, 'cultivation.harvest');
    assert.equal(sweetrootQuantity(state), 3);
    assert.equal(state.cultivation.plot.harvestCount, 1);
    assert.equal(state.cultivation.plot.crop, null);
    assert.equal(getWorkProficiency(state.player, 'cultivation'), 4);

    const cultivatedStack = state.player.inventoryState.containers.inventory.items.find((item) =>
        item.id === CULTIVATION_ITEM_ID && item.provenance?.[0]?.sourceId === CULTIVATION_PLOT_ID,
    );
    assert.ok(cultivatedStack, 'harvest should create home-cultivated provenance rather than field provenance');
    assert.equal(cultivatedStack.quantity, 3);
    assert.equal(cultivatedStack.provenance[0].placeId, state.cultivation.plot.homePlaceId);
    assert.equal(cultivatedStack.provenance[0].data.cultivated, true);
    assert.equal(cultivatedStack.provenance[0].data.seedProvenance[0].sourceId, wildSourceId);

    const sinkTypes = new Set(cultivatedStack.sinks.map((sink) => sink.type));
    assert.ok(sinkTypes.has('consume'), 'cultivated Sweetroot retains its food/medicine consumption sink');
    assert.ok(sinkTypes.has('craftIngredient'), 'cultivated Sweetroot retains its production sink');
    assert.ok(sinkTypes.has('trade'), 'cultivated Sweetroot retains its trade sink');
    const stew = getProductionDefinition('cook-silverfin-sweetroot-stew');
    assert.ok(stew.inputs.some((input) => input.itemId === CULTIVATION_ITEM_ID));
    assert.equal(canSellItem(cultivatedStack).ok, true, 'cultivated output participates in the existing shop-sale economy');

    const beforeSecondHarvest = sweetrootQuantity(state);
    const secondHarvest = harvestCultivationCrop(state);
    assert.equal(secondHarvest.ok, false);
    assert.equal(secondHarvest.code, 'cultivation.harvest-blocked');
    assert.equal(sweetrootQuantity(state), beforeSecondHarvest, 'harvest cannot duplicate output');
    assert.equal(state.cultivation.plot.harvestCount, 1);

    const nextPrepare = dispatchCultivationAction(state, uiState);
    assert.equal(nextPrepare.entry.action.intent, 'cultivation.prepare');
    const nextWork = state.work.records.find((record) => record.id === state.cultivation.plot.activeWorkId);
    const nextTask = state.tasks.records.find((task) => task.id === nextWork.taskId);
    assert.ok(nextTask.completesAtWorldSeconds - nextTask.startedAtWorldSeconds < CULTIVATION_BASE_PREPARE_SECONDS, 'cultivation mastery reduces later bed preparation time');

    assert.deepEqual(validateCurrentGameStateStructure(state), []);
    assert.deepEqual(validateGameState(state), []);
    const model = createCultivationModel(state);
    assert.equal(model.status, 'preparing');
});
