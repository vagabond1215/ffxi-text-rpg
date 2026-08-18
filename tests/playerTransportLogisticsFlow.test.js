import test from 'node:test';
import assert from 'node:assert/strict';

import { EQUIPMENT_CATALOG } from '../js/text/data/equipmentCatalog.js';
import { createNewGameState } from '../js/text/gameState.js';
import { createAccountWithPassword, loadCharacter, saveGame } from '../js/text/save.js';
import { advanceActiveActivityToCompletion } from '../js/text/systems/activityAdvanceEngine.js';
import { getCarriedCargoLoad } from '../js/text/systems/carriedLoadEngine.js';
import { addItemToContainer, setHomeAccess, transferItemBetweenContainers } from '../js/text/systems/inventoryEngine.js';
import { moveWithinLocality } from '../js/text/systems/localityEngine.js';
import { setEndOfDayPause } from '../js/text/systems/simulationControlEngine.js';
import { startScheduledTransport } from '../js/text/systems/transportEngine.js';
import { createTransportServiceBoard, describeTransportServiceBoard } from '../js/text/systems/transportServiceBoardEngine.js';
import { validateGameState } from '../js/text/systems/validation.js';
import { renderGameScreen } from '../js/text/ui/domRenderer.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { createUiState } from '../js/text/ui/uiState.js';

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

function quote(state) {
    return createTransportServiceBoard(state).entries.find((entry) => entry.serviceId === SERVICE_ID
        && entry.destinationPlaceId === DESTINATION_ID) ?? null;
}

function moveToRivergate(state) {
    assert.equal(moveWithinLocality(state, 'thornwall-crownward').ok, true);
    assert.equal(moveWithinLocality(state, 'thornwall-rivergate').ok, true);
    assert.equal(state.currentPlaceId, 'thornwall-rivergate');
}

function moveHome(state) {
    assert.equal(moveWithinLocality(state, 'thornwall-crownward').ok, true);
    assert.equal(moveWithinLocality(state, 'thornwall-southgate').ok, true);
    assert.equal(state.currentPlaceId, 'thornwall-southgate');
}

test('0.8.300 makes scheduled transport capacity depend on actual carried inventory and home storage planning', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Logistics Audit', 'pwd', { persistentLogin: true }).ok, true);

    let state = createNewGameState({ nationId: 'thornwall', name: 'Load Planner' });
    setEndOfDayPause(state, false);
    state.player.wallet.gil = 300;

    for (let index = 0; index < 25; index += 1) {
        const stored = addItemToContainer(state.player.inventoryState, 'inventory', EQUIPMENT_CATALOG['bronze-sword']);
        assert.equal(stored.ok, true, stored.reason);
    }
    const initialLoad = getCarriedCargoLoad(state);
    assert.equal(initialLoad.cargoUnits, 25);
    assert.equal(initialLoad.occupiedSlots, 25);
    assert.match(initialLoad.unitModel, /occupied-.*slots/);
    assert.equal(initialLoad.containers.find((container) => container.containerId === 'inventory')?.cargoUnits, 25);

    moveToRivergate(state);
    let board = createTransportServiceBoard(state, { cargoUnits: 0 });
    assert.equal(board.cargoUnits, 25, 'the service board must ignore caller-supplied cargo and derive the actual carried load');
    let brass = quote(state);
    assert.ok(brass);
    assert.equal(brass.cargoAllowanceUnits, 24);
    assert.equal(brass.available, false);
    assert.ok(brass.blockers.some((blocker) => /carrying 25 cargo units/i.test(blocker)));
    assert.match(describeTransportServiceBoard(state), /load 25\/24/i);

    const uiState = createUiState({ screen: 'game', activeView: 'scene' });
    const html = renderGameScreen(createGameViewModel(state, uiState), uiState);
    assert.match(html, /carrying 25 cargo units/i, 'ordinary browser context should expose the real load blocker');

    const walletBeforeBlockedBooking = state.player.wallet.gil;
    const spoofedBooking = startScheduledTransport(state, SERVICE_ID, DESTINATION_ID, { cargoUnits: 0 });
    assert.equal(spoofedBooking.ok, false);
    assert.equal(spoofedBooking.code, 'transport.cargo-over-limit');
    assert.equal(state.player.wallet.gil, walletBeforeBlockedBooking, 'a cargo-blocked booking must not charge fare');
    assert.equal(state.travel, null);

    moveHome(state);
    assert.equal(setHomeAccess(state, true).ok, true);
    const storedAtHome = transferItemBetweenContainers(state, 'Bronze Sword', 'inventory', 'homeSafe', { isAtHome: true });
    assert.match(storedAtHome, /Transferred Bronze Sword/);
    assert.equal(getCarriedCargoLoad(state).cargoUnits, 24);
    assert.equal(state.player.inventoryState.containers.homeSafe.items.length, 1);
    assert.equal(setHomeAccess(state, false).ok, true);

    moveToRivergate(state);
    board = createTransportServiceBoard(state);
    brass = quote(state);
    assert.equal(board.cargoUnits, 24);
    assert.equal(brass.available, true, brass.blockers.join(' '));
    assert.equal(brass.cargoUnits, 24);

    const walletBeforeBooking = state.player.wallet.gil;
    const booking = startScheduledTransport(state, SERVICE_ID, DESTINATION_ID, { cargoUnits: 999 });
    assert.equal(booking.ok, true, booking.display?.text ?? booking.reason);
    assert.equal(state.travel?.cargoUnits, 24, 'the journey snapshot must record the canonical carried load, not the supplied payload');
    assert.equal(state.player.wallet.gil, walletBeforeBooking - 60);

    assert.equal(saveGame(state), true);
    state = loadCharacter('Load Planner');
    assert.ok(state);
    assert.equal(state.travel?.cargoUnits, 24);
    assert.equal(state.player.inventoryState.containers.homeSafe.items.length, 1);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.currentPlaceId, DESTINATION_ID);
    assert.equal(state.travel, null);
    assert.deepEqual(validateGameState(state), []);
});
