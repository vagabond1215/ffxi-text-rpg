import test from 'node:test';
import assert from 'node:assert/strict';

import { validateHomeInfrastructureCatalog } from '../js/text/data/homeInfrastructure.js';
import { getProductionItem } from '../js/text/data/productionItems.js';
import { createNewGameState } from '../js/text/gameState.js';
import { createAccountWithPassword, loadCharacter, saveGame } from '../js/text/save.js';
import { advanceActiveActivityToCompletion } from '../js/text/systems/activityAdvanceEngine.js';
import {
    createHomeInfrastructureModel,
    reconcileHomeInfrastructureProjects,
    validateHomeInfrastructureState,
} from '../js/text/systems/homeInfrastructureEngine.js';
import { addItemToContainer, getContainerCapacity } from '../js/text/systems/inventoryEngine.js';
import { validateGameState } from '../js/text/systems/validation.js';
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

function addMaterial(state, itemId, quantity) {
    const item = getProductionItem(itemId);
    assert.ok(item, `missing production item ${itemId}`);
    const result = addItemToContainer(state.player.inventoryState, 'inventory', { ...item, quantity });
    assert.equal(result.ok, true, result.reason);
}

function dispatchOpportunity(state, uiState) {
    const view = createGameViewModel(state, uiState);
    const entry = view.opportunities.entries.find((candidate) => candidate.id === 'home-infrastructure-storage-chest');
    assert.ok(entry, 'Home & Foothold opportunity should be present');
    assert.ok(entry.action, `expected an action while status=${entry.status}`);
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

test('0.8.100 turns real regional materials and fictional labor into an exactly-once home-storage improvement through semantic Journal actions', () => {
    installStorage();
    assert.deepEqual(validateHomeInfrastructureCatalog(), []);
    assert.equal(createAccountWithPassword('Home Foothold Audit', 'pwd', { persistentLogin: true }).ok, true);

    let state = createNewGameState({ nationId: 'thornwall', name: 'Foothold Auditor' });
    const uiState = createUiState({ screen: 'game', activeView: 'journal' });
    const initialHome = createHomeInfrastructureModel(state);
    assert.equal(initialHome.atHome, true);
    assert.equal(initialHome.storageCapacity, 3, 'starting furnishings provide three home-storage slots');

    const initialView = createGameViewModel(state, uiState);
    const homeGroup = initialView.opportunities.groups.find((group) => group.id === 'home-foothold');
    assert.ok(homeGroup);
    assert.equal(homeGroup.label, 'Home & Foothold');
    const initialEntry = homeGroup.entries[0];
    assert.equal(initialEntry.status, 'ready');
    assert.equal(initialEntry.action.intent, 'home.infrastructure.begin');
    assert.match(initialEntry.summary, /travel chest|lodging/i);
    assert.match(initialEntry.progress, /5 home-storage slots/i);

    addMaterial(state, 'item-elderwood-resin-board', 2);
    addMaterial(state, 'item-redstone-copper-ingot', 1);

    const begun = dispatchOpportunity(state, uiState);
    assert.equal(begun.entry.action.intent, 'home.infrastructure.begin');
    assert.equal(state.projects.records.length, 1);
    assert.equal(state.projects.records[0].kind, 'home.infrastructure.storage-chest');

    const boards = dispatchOpportunity(state, uiState);
    assert.equal(boards.entry.action.intent, 'home.infrastructure.contribute');
    assert.equal(boards.entry.action.payload.itemId, 'item-elderwood-resin-board');
    assert.equal(boards.entry.action.payload.quantity, 2);
    assert.equal(state.projects.records[0].materials.find((item) => item.itemId === 'item-elderwood-resin-board').quantityContributed, 2);

    const copper = dispatchOpportunity(state, uiState);
    assert.equal(copper.entry.action.intent, 'home.infrastructure.contribute');
    assert.equal(copper.entry.action.payload.itemId, 'item-redstone-copper-ingot');
    assert.equal(state.projects.records[0].materials.find((item) => item.itemId === 'item-redstone-copper-ingot').quantityContributed, 1);
    assert.equal(state.player.inventoryState.containers.inventory.items.some((item) => item.id === 'item-elderwood-resin-board'), false, 'contributed boards leave carried inventory exactly once');
    assert.equal(state.player.inventoryState.containers.inventory.items.some((item) => item.id === 'item-redstone-copper-ingot'), false, 'contributed copper leaves carried inventory exactly once');

    const started = dispatchOpportunity(state, uiState);
    assert.equal(started.entry.action.intent, 'home.infrastructure.start');
    assert.equal(state.projects.records[0].status, 'active');
    assert.equal(state.tasks.records.find((task) => task.id === state.projects.records[0].taskId).kind, 'project.labor');

    assert.equal(saveGame(state), true);
    state = loadCharacter('Foothold Auditor');
    assert.ok(state);
    assert.equal(state.projects.records[0].status, 'active', 'home project should survive real account save/load mid-build');
    assert.equal(getContainerCapacity(state.player.inventoryState, 'storage'), 3);

    const activeView = createGameViewModel(state, uiState);
    const activeEntry = activeView.opportunities.entries.find((entry) => entry.id === 'home-infrastructure-storage-chest');
    assert.equal(activeEntry.status, 'active');
    assert.equal(activeEntry.action.intent, 'activity.advanceToCompletion');
    assert.equal(activeView.opportunities.recommendedOpportunityId, activeEntry.id, 'active home labor should outrank unrelated ready leads');

    const completed = advanceActiveActivityToCompletion(state);
    assert.equal(completed.ok, true, completed.display?.text ?? completed.reason);
    assert.equal(completed.code, 'activity.home-infrastructure-completed');
    assert.match(completed.display.text, /5 more home-storage slots/i);
    assert.equal(state.projects.records[0].status, 'completed');
    assert.equal(state.projects.records[0].data.completionApplied, true);
    assert.deepEqual(state.player.inventoryState.mogHouse.placedFurniture.filter((id) => id === 'storage-chest'), ['storage-chest']);
    assert.equal(getContainerCapacity(state.player.inventoryState, 'storage'), 8, 'completed Storage Chest adds its real furnishing capacity');

    assert.deepEqual(reconcileHomeInfrastructureProjects(state), [], 'reconciliation after completion must not apply the benefit twice');
    assert.equal(getContainerCapacity(state.player.inventoryState, 'storage'), 8);
    assert.deepEqual(validateHomeInfrastructureState(state), []);
    assert.deepEqual(validateGameState(state), []);

    const finishedView = createGameViewModel(state, uiState);
    const finishedEntry = finishedView.opportunities.entries.find((entry) => entry.id === 'home-infrastructure-storage-chest');
    assert.equal(finishedEntry.status, 'complete');
    assert.match(finishedEntry.summary, /stands in your lodging/i);
    assert.match(finishedEntry.progress, /8 slots/i);

    const html = renderGameScreen(finishedView, uiState, {});
    assert.match(html, /Home &amp; Foothold/);
    assert.match(html, /Storage Chest/);
    assert.match(html, /Furnishing storage capacity: 8 slots/);
    assert.doesNotMatch(html, /project-\d+/i);
    assert.doesNotMatch(html, /project\.labor|mogHouse|completionApplied|homePlaceId/i);

    assert.equal(saveGame(state), true);
    state = loadCharacter('Foothold Auditor');
    assert.equal(getContainerCapacity(state.player.inventoryState, 'storage'), 8, 'completed infrastructure benefit survives real save/load');
    assert.equal(state.projects.records[0].data.completionApplied, true);
    assert.deepEqual(reconcileHomeInfrastructureProjects(state), []);
    assert.deepEqual(validateHomeInfrastructureState(state), []);
});
