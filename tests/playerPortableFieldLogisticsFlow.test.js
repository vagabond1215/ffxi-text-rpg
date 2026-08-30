import test from 'node:test';
import assert from 'node:assert/strict';
import { learnLocality, moveToKnownLocality } from './helpers/localKnowledgeTestSupport.js';

import { EQUIPMENT_CATALOG } from '../js/text/data/equipmentCatalog.js';
import { validateHomeInfrastructureCatalog } from '../js/text/data/homeInfrastructure.js';
import { getProductionItem } from '../js/text/data/productionItems.js';
import { createNewGameState } from '../js/text/gameState.js';
import { createAccountWithPassword, loadCharacter, saveGame } from '../js/text/save.js';
import { advanceActiveActivityToCompletion } from '../js/text/systems/activityAdvanceEngine.js';
import { getCarriedCargoLoad } from '../js/text/systems/carriedLoadEngine.js';
import {
    createHomeInfrastructureModel,
    reconcileHomeInfrastructureProjects,
    validateHomeInfrastructureState,
} from '../js/text/systems/homeInfrastructureEngine.js';
import {
    addItemToContainer,
    getContainerCapacity,
    isContainerAccessible,
    setHomeAccess,
    transferItemBetweenContainers,
} from '../js/text/systems/inventoryEngine.js';
import { moveWithinLocality } from '../js/text/systems/localityEngine.js';
import { setEndOfDayPause } from '../js/text/systems/simulationControlEngine.js';
import { startScheduledTransport } from '../js/text/systems/transportEngine.js';
import { createTransportServiceBoard } from '../js/text/systems/transportServiceBoardEngine.js';
import { validateGameState } from '../js/text/systems/validation.js';
import { renderGameScreen } from '../js/text/ui/domRenderer.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { dispatchUiIntent } from '../js/text/ui/uiIntentDispatcher.js';
import { createUiState } from '../js/text/ui/uiState.js';

const SATCHEL_ENTRY_ID = 'home-infrastructure-field-satchel';
const SERVICE_ID = 'service-crown-forge-caravan';
const DESTINATION_ID = 'brasshaven-iron-quay';

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

function dispatchSatchelOpportunity(state, uiState) {
    const view = createGameViewModel(state, uiState);
    const entry = view.opportunities.entries.find((candidate) => candidate.id === SATCHEL_ENTRY_ID);
    assert.ok(entry, 'Field Satchel opportunity should be present in the ordinary Journal model');
    assert.ok(entry.action, `expected a Field Satchel action while status=${entry.status}`);
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

function moveToRivergate(state) {
    assert.equal(moveToKnownLocality(state, 'thornwall-crownward').ok, true);
    assert.equal(moveToKnownLocality(state, 'thornwall-rivergate').ok, true);
    assert.equal(state.currentPlaceId, 'thornwall-rivergate');
    learnLocality(state);
}

function moveHome(state) {
    assert.equal(moveToKnownLocality(state, 'thornwall-crownward').ok, true);
    assert.equal(moveToKnownLocality(state, 'thornwall-southgate').ok, true);
    assert.equal(state.currentPlaceId, 'thornwall-southgate');
}

test('0.8.400 earns portable Field Satchel capacity without turning it into free transport cargo', () => {
    installStorage();
    assert.deepEqual(validateHomeInfrastructureCatalog(), []);
    assert.equal(createAccountWithPassword('Field Logistics Audit', 'pwd', { persistentLogin: true }).ok, true);

    let state = createNewGameState({ nationId: 'thornwall', name: 'Satchel Auditor' });
    setEndOfDayPause(state, false);
    state.player.wallet.gil = 300;
    const uiState = createUiState({ screen: 'game', activeView: 'journal' });

    const initialHome = createHomeInfrastructureModel(state);
    const initialSatchel = initialHome.entries.find((entry) => entry.id === SATCHEL_ENTRY_ID);
    assert.ok(initialSatchel);
    assert.equal(state.player.inventoryState.containers.fieldSatchel.unlocked, false);
    assert.equal(getContainerCapacity(state.player.inventoryState, 'fieldSatchel'), 8);
    assert.equal(isContainerAccessible(state.player.inventoryState, 'fieldSatchel'), false);
    assert.equal(initialSatchel.action.intent, 'home.infrastructure.begin');
    assert.match(initialSatchel.progress, /8 portable slots/i);
    assert.match(initialSatchel.motivation, /still counts as carried transport load/i);

    addMaterial(state, 'item-elderwood-hide-binding', 2);
    addMaterial(state, 'item-copper-trail-clasp', 1);

    assert.equal(dispatchSatchelOpportunity(state, uiState).entry.action.intent, 'home.infrastructure.begin');
    assert.equal(state.projects.records.length, 1);
    assert.equal(state.projects.records[0].kind, 'home.infrastructure.field-satchel');

    const hide = dispatchSatchelOpportunity(state, uiState);
    assert.equal(hide.entry.action.intent, 'home.infrastructure.contribute');
    assert.equal(hide.entry.action.payload.itemId, 'item-elderwood-hide-binding');
    assert.equal(hide.entry.action.payload.quantity, 2);

    const clasp = dispatchSatchelOpportunity(state, uiState);
    assert.equal(clasp.entry.action.intent, 'home.infrastructure.contribute');
    assert.equal(clasp.entry.action.payload.itemId, 'item-copper-trail-clasp');

    const started = dispatchSatchelOpportunity(state, uiState);
    assert.equal(started.entry.action.intent, 'home.infrastructure.start');
    assert.equal(state.projects.records[0].status, 'active');

    const activeView = createGameViewModel(state, uiState);
    const activeSatchel = activeView.opportunities.entries.find((entry) => entry.id === SATCHEL_ENTRY_ID);
    assert.equal(activeSatchel.status, 'active');
    assert.equal(activeSatchel.action.intent, 'activity.advanceToCompletion');
    assert.equal(activeView.opportunities.recommendedOpportunityId, SATCHEL_ENTRY_ID);

    const completed = advanceActiveActivityToCompletion(state);
    assert.equal(completed.ok, true, completed.display?.text ?? completed.reason);
    assert.equal(completed.code, 'activity.home-infrastructure-completed');
    assert.equal(completed.data.containerId, 'fieldSatchel');
    assert.equal(completed.data.portableSlots, 8);
    assert.match(completed.display.text, /8 portable slots/i);
    assert.match(completed.display.text, /still count as carried transport load/i);
    assert.equal(state.projects.records[0].data.completionApplied, true);
    assert.equal(state.player.inventoryState.containers.fieldSatchel.unlocked, true);
    assert.equal(isContainerAccessible(state.player.inventoryState, 'fieldSatchel'), true);
    assert.deepEqual(reconcileHomeInfrastructureProjects(state), [], 'satchel unlock must be exactly once');

    for (let index = 0; index < 30; index += 1) {
        const stored = addItemToContainer(state.player.inventoryState, 'inventory', EQUIPMENT_CATALOG['bronze-sword']);
        assert.equal(stored.ok, true, stored.reason);
    }
    assert.equal(getCarriedCargoLoad(state).cargoUnits, 30);
    const shifted = transferItemBetweenContainers(state, 'Bronze Sword', 'inventory', 'fieldSatchel');
    assert.match(shifted, /Field Satchel/);
    assert.equal(getCarriedCargoLoad(state).cargoUnits, 30, 'moving carried goods between portable containers must not reduce load');
    assert.equal(state.player.inventoryState.containers.fieldSatchel.items.length, 1);

    const extra = addItemToContainer(state.player.inventoryState, 'inventory', EQUIPMENT_CATALOG['bronze-sword']);
    assert.equal(extra.ok, true, extra.reason);
    assert.equal(getCarriedCargoLoad(state).cargoUnits, 31, 'satchel should expand portable capacity beyond the main inventory limit');

    assert.equal(saveGame(state), true);
    state = loadCharacter('Satchel Auditor');
    assert.ok(state);
    assert.equal(state.player.inventoryState.containers.fieldSatchel.unlocked, true);
    assert.equal(state.player.inventoryState.containers.fieldSatchel.items.length, 1);
    assert.equal(getCarriedCargoLoad(state).cargoUnits, 31);

    moveToRivergate(state);
    let board = createTransportServiceBoard(state);
    let brass = board.entries.find((entry) => entry.serviceId === SERVICE_ID && entry.destinationPlaceId === DESTINATION_ID);
    assert.ok(brass);
    assert.equal(board.cargoUnits, 31);
    assert.equal(brass.available, false);
    assert.ok(brass.blockers.some((blocker) => /carrying 31 cargo units/i.test(blocker)));

    moveHome(state);
    assert.equal(setHomeAccess(state, true).ok, true);
    for (let index = 0; index < 7; index += 1) {
        assert.match(transferItemBetweenContainers(state, 'Bronze Sword', 'inventory', 'homeSafe', { isAtHome: true }), /Home Safe/);
    }
    assert.equal(getCarriedCargoLoad(state).cargoUnits, 24, 'only leaving goods in non-carried home storage should reduce transport load');
    assert.equal(state.player.inventoryState.containers.fieldSatchel.items.length, 1);
    assert.equal(setHomeAccess(state, false).ok, true);

    moveToRivergate(state);
    board = createTransportServiceBoard(state);
    brass = board.entries.find((entry) => entry.serviceId === SERVICE_ID && entry.destinationPlaceId === DESTINATION_ID);
    assert.equal(brass.available, true, brass.blockers.join(' '));
    const booking = startScheduledTransport(state, SERVICE_ID, DESTINATION_ID);
    assert.equal(booking.ok, true, booking.display?.text ?? booking.reason);
    assert.equal(state.travel?.cargoUnits, 24, 'scheduled travel must include the item still carried in the satchel');

    assert.deepEqual(validateHomeInfrastructureState(state), []);
    assert.deepEqual(validateGameState(state), []);

    const finishedView = createGameViewModel(state, uiState);
    const finishedSatchel = finishedView.opportunities.entries.find((entry) => entry.id === SATCHEL_ENTRY_ID);
    assert.equal(finishedSatchel.status, 'complete');
    assert.match(finishedSatchel.progress, /8 slots/i);
    const html = renderGameScreen(finishedView, uiState, {});
    assert.match(html, /Field Satchel/);
    assert.match(html, /carried transport load/i);
    assert.doesNotMatch(html, /fieldSatchel|completionApplied|containerId/i);
});
