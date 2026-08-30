import test from 'node:test';
import assert from 'node:assert/strict';
import { moveToKnownLocality, useKnownPoi } from './helpers/localKnowledgeTestSupport.js';

import { createNewGameState } from '../js/text/gameState.js';
import { createAccountWithPassword, loadCharacter, saveGame } from '../js/text/save.js';
import { advanceActiveActivityToCompletion } from '../js/text/systems/activityAdvanceEngine.js';
import { moveWithinLocality, performLocalityPoiAction } from '../js/text/systems/localityEngine.js';
import { setEndOfDayPause } from '../js/text/systems/simulationControlEngine.js';
import { startScheduledTransport } from '../js/text/systems/transportEngine.js';
import { createTransportServiceBoard } from '../js/text/systems/transportServiceBoardEngine.js';
import { validateGameState, validateWorldData } from '../js/text/systems/validation.js';
import { renderGameScreen } from '../js/text/ui/domRenderer.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { createUiState } from '../js/text/ui/uiState.js';

const CROWN_FORGE = 'service-crown-forge-caravan';
const FORGE_MERE = 'service-forge-mere-caravan';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() {
    globalThis.localStorage = new MemoryStorage();
}

function view(state) {
    return createGameViewModel(state, createUiState({ screen: 'game', activeView: 'scene' }));
}

function quote(state, serviceId, destinationPlaceId) {
    return createTransportServiceBoard(state).entries.find((entry) => entry.serviceId === serviceId
        && entry.destinationPlaceId === destinationPlaceId) ?? null;
}

function action(model, serviceId, destinationPlaceId) {
    return model.contextualActions.find((entry) => entry.intent === 'transport.start'
        && entry.payload?.serviceId === serviceId
        && entry.payload?.destinationPlaceId === destinationPlaceId) ?? null;
}

function bookFromModel(state, serviceId, destinationPlaceId) {
    const model = view(state);
    const booking = action(model, serviceId, destinationPlaceId);
    assert.ok(booking, `missing semantic ${serviceId} booking to ${destinationPlaceId}`);
    return startScheduledTransport(state, booking.payload.serviceId, booking.payload.destinationPlaceId, {
        cargoUnits: booking.payload.cargoUnits ?? 0,
    });
}

test('PX9 exposes canonical scheduled transport as an ordinary semantic Thornwall-Brasshaven-Mistmere rotation', () => {
    installStorage();
    assert.equal(createAccountWithPassword('PX9 Rotation Audit', 'pwd', { persistentLogin: true }).ok, true);

    let state = createNewGameState({ nationId: 'thornwall', name: 'Road Circuit Auditor' });
    setEndOfDayPause(state, false);

    assert.equal(moveToKnownLocality(state, 'thornwall-crownward').ok, true);
    assert.equal(moveToKnownLocality(state, 'thornwall-rivergate').ok, true);
    assert.equal(state.currentPlaceId, 'thornwall-rivergate');

    state.player.wallet.gil = 0;
    let board = createTransportServiceBoard(state);
    assert.deepEqual(
        board.entries.map((entry) => entry.destinationPlaceId).sort(),
        ['brasshaven-iron-quay', 'timbercross-landing'],
        'Rivergate should expose only stops served from the current canonical service hub',
    );
    assert.equal(board.entries.some((entry) => entry.destinationPlaceId === 'mistmere-reedport'), false, 'the board must not invent a direct remote connection');

    let brassQuote = quote(state, CROWN_FORGE, 'brasshaven-iron-quay');
    assert.ok(brassQuote);
    assert.equal(brassQuote.fareAmount, 60);
    assert.equal(brassQuote.cadenceSeconds, 21600);
    assert.equal(brassQuote.available, false);
    assert.ok(brassQuote.blockers.some((blocker) => /Fare is 60 gil; you have 0/i.test(blocker)));

    let model = view(state);
    let brassAction = action(model, CROWN_FORGE, 'brasshaven-iron-quay');
    assert.ok(brassAction, 'blocked scheduled transport should still be legible through the ordinary browser context');
    assert.match(brassAction.label, /Crown-Forge Caravan/);
    assert.match(brassAction.label, /Brasshaven Iron Quay/);
    assert.match(brassAction.label, /60 gil/);
    assert.match(brassAction.label, /every 6h/);
    assert.match(brassAction.label, /Fare is 60 gil; you have 0/);

    let html = renderGameScreen(model, createUiState({ screen: 'game', activeView: 'scene' }));
    assert.match(html, /Crown-Forge Caravan/);
    assert.match(html, /60 gil/);
    assert.doesNotMatch(html, /Tall Reedbed|source-west-starfen/i, 'transport presentation must not leak hidden remote resource topology');

    state.player.wallet.gil = 300;
    model = view(state);
    brassAction = action(model, CROWN_FORGE, 'brasshaven-iron-quay');
    assert.ok(brassAction);
    assert.match(brassAction.label, /departs in/i);

    const firstWallet = state.player.wallet.gil;
    const firstBooking = startScheduledTransport(state, brassAction.payload.serviceId, brassAction.payload.destinationPlaceId);
    assert.equal(firstBooking.ok, true, firstBooking.display?.text ?? firstBooking.reason);
    assert.equal(state.player.wallet.gil, firstWallet - 60);
    const duplicateBooking = startScheduledTransport(state, brassAction.payload.serviceId, brassAction.payload.destinationPlaceId);
    assert.equal(duplicateBooking.ok, false);
    assert.equal(state.player.wallet.gil, firstWallet - 60, 'an already-active booking must not deduct a second fare');

    assert.equal(saveGame(state), true);
    state = loadCharacter('Road Circuit Auditor');
    assert.ok(state);
    assert.equal(state.player.wallet.gil, firstWallet - 60, 'save/load must preserve the one paid fare without replaying it');
    assert.equal(state.travel?.serviceId, CROWN_FORGE);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.currentPlaceId, 'brasshaven-iron-quay');
    assert.equal(state.player.wallet.gil, firstWallet - 60);

    const transit = useKnownPoi(state, 'poi-port-bastok-travel-counter', 'travel');
    assert.equal(transit.ok, true);
    assert.match(transit.message, /Scheduled departures from Brasshaven Iron Quay/);
    assert.match(transit.message, /Forge-Mere Caravan to Mistmere Reedport: 52 gil/);
    assert.doesNotMatch(transit.message, /not implemented/i);

    board = createTransportServiceBoard(state);
    assert.ok(board.entries.some((entry) => entry.serviceId === CROWN_FORGE && entry.destinationPlaceId === 'thornwall-rivergate'));
    assert.ok(board.entries.some((entry) => entry.serviceId === FORGE_MERE && entry.destinationPlaceId === 'mistmere-reedport'));
    assert.equal(quote(state, FORGE_MERE, 'mistmere-reedport').fareAmount, 52);

    const toMistmereWallet = state.player.wallet.gil;
    const toMistmere = bookFromModel(state, FORGE_MERE, 'mistmere-reedport');
    assert.equal(toMistmere.ok, true, toMistmere.display?.text ?? toMistmere.reason);
    assert.equal(state.player.wallet.gil, toMistmereWallet - 52);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.currentPlaceId, 'mistmere-reedport');

    assert.equal(saveGame(state), true);
    state = loadCharacter('Road Circuit Auditor');
    assert.ok(state);
    assert.equal(state.currentPlaceId, 'mistmere-reedport');
    board = createTransportServiceBoard(state);
    assert.ok(board.entries.some((entry) => entry.serviceId === FORGE_MERE && entry.destinationPlaceId === 'brasshaven-iron-quay'));
    assert.ok(board.entries.some((entry) => entry.serviceId === 'service-mistmere-west-ferry' && entry.destinationPlaceId === 'west-starfen'));
    assert.equal(board.entries.some((entry) => entry.destinationPlaceId === 'thornwall-rivergate'), false, 'Reedport should not advertise a nonexistent direct Thornwall service');

    const backToBrass = bookFromModel(state, FORGE_MERE, 'brasshaven-iron-quay');
    assert.equal(backToBrass.ok, true, backToBrass.display?.text ?? backToBrass.reason);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.currentPlaceId, 'brasshaven-iron-quay');

    const backToThornwall = bookFromModel(state, CROWN_FORGE, 'thornwall-rivergate');
    assert.equal(backToThornwall.ok, true, backToThornwall.display?.text ?? backToThornwall.reason);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.currentPlaceId, 'thornwall-rivergate');
    assert.equal(state.travel, null);
    assert.equal(state.player.wallet.gil, 76, 'the full 60 + 52 + 52 + 60 fare circuit should be paid exactly once per booking');

    html = renderGameScreen(view(state), createUiState({ screen: 'game', activeView: 'scene' }));
    assert.match(html, /Crown-Forge Caravan/);
    assert.doesNotMatch(html, /Tall Reedbed|source-west-starfen/i);
    assert.deepEqual(validateGameState(state), []);
    assert.deepEqual(validateWorldData(), []);
});
