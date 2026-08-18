import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionInputItem } from '../js/text/data/productionCatalog.js';
import { validateHomeInfrastructureCatalog } from '../js/text/data/homeInfrastructure.js';
import { createNewGameState } from '../js/text/gameState.js';
import { createAccountWithPassword, loadCharacter, saveGame } from '../js/text/save.js';
import { advanceActiveActivityToCompletion } from '../js/text/systems/activityAdvanceEngine.js';
import {
    createHomeInfrastructureModel,
    reconcileHomeInfrastructureProjects,
    validateHomeInfrastructureState,
} from '../js/text/systems/homeInfrastructureEngine.js';
import { addItemToContainer, getContainerCapacity } from '../js/text/systems/inventoryEngine.js';
import { checkProductionRequirements, startProductionWork } from '../js/text/systems/productionEngine.js';
import { createSettlementServiceBoard } from '../js/text/systems/settlementServiceBoardEngine.js';
import { validateGameState } from '../js/text/systems/validation.js';
import { collectHomeWorkstationTags } from '../js/text/systems/workstationEngine.js';
import { getWorkProficiency } from '../js/text/systems/workProficiencyEngine.js';
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

function addItem(state, itemId, quantity = 1) {
    const item = getProductionInputItem(itemId);
    assert.ok(item, `missing canonical item ${itemId}`);
    const result = addItemToContainer(state.player.inventoryState, 'inventory', { ...item, quantity });
    assert.equal(result.ok, true, result.reason);
}

function quantity(state, itemId) {
    return state.player.inventory
        .filter((item) => item.id === itemId || item.templateId === itemId)
        .reduce((sum, item) => sum + Math.max(1, Number(item.quantity) || 1), 0);
}

function sinkTypes(itemId) {
    return (getProductionInputItem(itemId)?.sinks ?? []).map((sink) => sink.type);
}

function homeEntry(state, uiState, improvementId = 'joiners-workbench') {
    const view = createGameViewModel(state, uiState);
    return view.opportunities.entries.find((entry) => entry.id === `home-infrastructure-${improvementId}`) ?? null;
}

function dispatchHomeEntry(state, uiState, improvementId = 'joiners-workbench') {
    const entry = homeEntry(state, uiState, improvementId);
    assert.ok(entry, `${improvementId} opportunity should be present`);
    assert.ok(entry.action, `expected ${improvementId} action while status=${entry.status}`);
    const result = dispatchUiIntent({
        intent: entry.action.intent,
        payload: entry.action.payload,
        state,
        uiState,
        session: {},
        services: {},
    });
    if (result.homeResult) assert.equal(result.homeResult.ok, true, result.message);
    else assert.equal(result.ok, true, result.reason);
    return { entry, result };
}

test('0.8.200 turns a home improvement into a real reusable woodshop capability and reduces future workshop travel', () => {
    installStorage();
    assert.deepEqual(validateHomeInfrastructureCatalog(), []);
    assert.ok(sinkTypes('item-elderwood-resin-board').includes('construction'));
    assert.ok(sinkTypes('item-copper-trail-clasp').includes('construction'));
    assert.ok(sinkTypes('item-redstone-copper-ingot').includes('construction'), 'the earlier Storage Chest material should also advertise its real infrastructure sink');
    assert.equal(createAccountWithPassword('Home Workshop Audit', 'pwd', { persistentLogin: true }).ok, true);

    let state = createNewGameState({ nationId: 'thornwall', name: 'Workshop Auditor' });
    const uiState = createUiState({ screen: 'game', activeView: 'journal' });

    const initialHome = createHomeInfrastructureModel(state);
    assert.equal(initialHome.atHome, true);
    assert.equal(initialHome.storageCapacity, 3);
    assert.ok(initialHome.entries.some((entry) => entry.id === 'home-infrastructure-storage-chest'));
    const initialWorkbench = initialHome.entries.find((entry) => entry.id === 'home-infrastructure-joiners-workbench');
    assert.ok(initialWorkbench);
    assert.equal(initialWorkbench.status, 'ready');
    assert.equal(initialWorkbench.action.intent, 'home.infrastructure.begin');
    assert.match(initialWorkbench.progress, /woodshop workstation at home/i);
    assert.deepEqual(collectHomeWorkstationTags(state), []);

    const beforeWorkbench = checkProductionRequirements(state, 'craft-elderwood-resin-board');
    assert.equal(beforeWorkbench.ok, false);
    assert.ok(beforeWorkbench.blockers.some((blocker) => /workstation: woodshop/i.test(blocker)));

    addItem(state, 'item-elderwood-resin-board', 2);
    addItem(state, 'item-copper-trail-clasp', 1);

    const begun = dispatchHomeEntry(state, uiState);
    assert.equal(begun.entry.action.intent, 'home.infrastructure.begin');
    const project = state.projects.records.find((entry) => entry.data?.homeInfrastructureId === 'joiners-workbench');
    assert.ok(project);
    assert.equal(project.kind, 'home.infrastructure.joiners-workbench');
    assert.equal(project.laborSeconds, 2700);

    const boards = dispatchHomeEntry(state, uiState);
    assert.equal(boards.entry.action.intent, 'home.infrastructure.contribute');
    assert.equal(boards.entry.action.payload.itemId, 'item-elderwood-resin-board');
    assert.equal(boards.entry.action.payload.quantity, 2);

    const clasp = dispatchHomeEntry(state, uiState);
    assert.equal(clasp.entry.action.intent, 'home.infrastructure.contribute');
    assert.equal(clasp.entry.action.payload.itemId, 'item-copper-trail-clasp');
    assert.equal(quantity(state, 'item-elderwood-resin-board'), 0);
    assert.equal(quantity(state, 'item-copper-trail-clasp'), 0);

    const started = dispatchHomeEntry(state, uiState);
    assert.equal(started.entry.action.intent, 'home.infrastructure.start');
    assert.equal(project.status, 'active');

    assert.equal(saveGame(state), true);
    state = loadCharacter('Workshop Auditor');
    assert.ok(state);
    const loadedProject = state.projects.records.find((entry) => entry.data?.homeInfrastructureId === 'joiners-workbench');
    assert.equal(loadedProject.status, 'active', 'home workshop construction survives real save/load');
    assert.deepEqual(collectHomeWorkstationTags(state), []);

    const built = advanceActiveActivityToCompletion(state);
    assert.equal(built.ok, true, built.display?.text ?? built.reason);
    assert.equal(built.code, 'activity.home-infrastructure-completed');
    assert.match(built.display.text, /woodshop workstation/i);
    assert.deepEqual(state.player.inventoryState.home.placedFurniture.filter((id) => id === 'joiners-workbench'), ['joiners-workbench']);
    assert.equal(getContainerCapacity(state.player.inventoryState, 'storage'), 3, 'the workbench adds capability rather than hidden storage capacity');
    assert.ok(collectHomeWorkstationTags(state).includes('woodshop'));
    assert.ok(collectHomeWorkstationTags(state).includes('workshop'));
    assert.deepEqual(reconcileHomeInfrastructureProjects(state), [], 'completed workstation furnishing cannot apply twice');

    addItem(state, 'item-elderwood-hardwood', 1);
    addItem(state, 'item-elderwood-amber-resin', 1);

    const readyAtHome = checkProductionRequirements(state, 'craft-elderwood-resin-board');
    assert.equal(readyAtHome.ok, true, readyAtHome.blockers.join(' '));
    assert.ok(readyAtHome.availableStationTags.includes('woodshop'));

    const board = createSettlementServiceBoard(state);
    assert.ok(board.homeWorkshop);
    assert.ok(board.homeWorkshop.stationTags.includes('woodshop'));
    const resinBoard = board.production.find((entry) => entry.id === 'craft-elderwood-resin-board');
    assert.ok(resinBoard, 'the ordinary Work, Trade & Recover surface should discover production enabled by the home furnishing');
    assert.equal(resinBoard.status, 'ready');
    assert.equal(resinBoard.action.intent, 'production.start');

    const productionStartedAt = state.worldTime.totalSeconds;
    const production = startProductionWork(state, resinBoard.action.payload.processId, { containerId: resinBoard.action.payload.containerId });
    assert.equal(production.ok, true, production.display?.text ?? production.reason);
    assert.equal(quantity(state, 'item-elderwood-hardwood'), 0);
    assert.equal(quantity(state, 'item-elderwood-amber-resin'), 0);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.worldTime.totalSeconds - productionStartedAt, 240);
    assert.equal(quantity(state, 'item-elderwood-resin-board'), 1);
    assert.equal(getWorkProficiency(state.player, 'crafting'), 2);

    const craftedBoard = state.player.inventory.find((item) => item.id === 'item-elderwood-resin-board');
    assert.ok(craftedBoard.provenance.some((entry) => entry.sourceId === 'craft-elderwood-resin-board'));
    assert.ok(craftedBoard.provenance.some((entry) => entry.placeId === state.currentPlaceId), 'home production records the real home place as transformation provenance');

    const finishedHome = createHomeInfrastructureModel(state);
    const finishedWorkbench = finishedHome.entries.find((entry) => entry.id === 'home-infrastructure-joiners-workbench');
    assert.equal(finishedWorkbench.status, 'complete');
    assert.match(finishedWorkbench.progress, /woodshop ready/i);

    const html = renderGameScreen(
        createGameViewModel(state, createUiState({ screen: 'game', activeView: 'craft' })),
        createUiState({ screen: 'game', activeView: 'craft' }),
    );
    assert.match(html, /Work, Trade &amp; Recover/);
    assert.match(html, /Seal Elderwood Hardwood Board/);
    assert.match(html, /data-service-action=/);
    assert.doesNotMatch(html, /homeInfrastructureId|project\.labor|mogHouse|workstationEngine/i);

    assert.deepEqual(validateHomeInfrastructureState(state), []);
    assert.deepEqual(validateGameState(state), []);

    const savedTime = state.worldTime.totalSeconds;
    assert.equal(saveGame(state), true);
    state = loadCharacter('Workshop Auditor');
    assert.ok(state);
    assert.equal(state.worldTime.totalSeconds, savedTime);
    assert.ok(state.player.inventoryState.home.placedFurniture.includes('joiners-workbench'));
    assert.ok(collectHomeWorkstationTags(state).includes('woodshop'));
    assert.equal(quantity(state, 'item-elderwood-resin-board'), 1);
    assert.equal(getWorkProficiency(state.player, 'crafting'), 2);
    assert.deepEqual(validateHomeInfrastructureState(state), []);
});
