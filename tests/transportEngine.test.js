import test from 'node:test';
import assert from 'node:assert/strict';

import { EQUIPMENT_CATALOG } from '../js/text/data/equipmentCatalog.js';
import { createTestState } from './helpers/createTestState.js';
import {
    getNextServiceDeparture,
    getServiceJourney,
    listRoutes,
    listTransportServices,
    validateRouteCatalog,
} from '../js/text/data/routeCatalog.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { addItemToContainer, removeItemQuantityFromContainer } from '../js/text/systems/inventoryEngine.js';
import { listSemanticEvents } from '../js/text/systems/semanticEventEngine.js';
import { advanceSimulationUntilInterrupt } from '../js/text/systems/simulationInterruptEngine.js';
import { findTimedTask } from '../js/text/systems/timedTaskEngine.js';
import {
    provideTravelInterrupts,
    reconcileTravelJourney,
    startScheduledTransport,
} from '../js/text/systems/transportEngine.js';
import { advanceTravel, startTravel } from '../js/text/systems/travelEngine.js';
import { stopTravel } from '../js/text/systems/navigationEngine.js';


test('canonical route and transport catalogs cross-validate known places, maps, stops, and modes', () => {
    assert.deepEqual(validateRouteCatalog(), []);
    assert.ok(listRoutes().length >= 7);
    assert.ok(listTransportServices().length >= 3);

    const journey = getServiceJourney('service-crown-forge-caravan', 'thornwall-rivergate', 'brasshaven-iron-quay');
    assert.equal(journey.route.id, 'route-crown-forge-caravan-road');
    assert.equal(journey.segmentCount, 2);
    assert.equal(journey.durationSeconds, 21600);
    assert.ok(journey.hazardTags.includes('roadside-raiders'));
});

test('service departures are deterministic from canonical world seconds', () => {
    assert.equal(getNextServiceDeparture('service-crown-forge-caravan', 0), 21600);
    assert.equal(getNextServiceDeparture('service-crown-forge-caravan', 21600), 21600);
    assert.equal(getNextServiceDeparture('service-crown-forge-caravan', 21601), 43200);
});

test('direct route travel releases its terminal task after arrival while retaining correlation in travel result and event', () => {
    const state = createTestState();
    setPositionAndDiscover(state, 'thornwall-southgate', { coord: 'F-10' });

    const started = startTravel(state, 'West Elderwood');
    assert.equal(started.ok, true);
    assert.equal(started.data.travel.routeId, 'route-thornwall-west-elderwood-road');
    assert.equal(started.data.travel.taskId, 'task-000001');
    assert.equal(started.data.durationSeconds, 1800);
    assert.equal(state.worldTime.totalSeconds, 0);

    const advanced = advanceTravel(state, 1800);
    assert.equal(advanced.completed, true);
    assert.equal(advanced.travel.taskId, 'task-000001');
    assert.equal(state.worldTime.totalSeconds, 1800);
    assert.equal(state.currentPlaceId, 'west-elderwood');
    assert.equal(findTimedTask(state, 'task-000001'), null);
    const [arrival] = listSemanticEvents(state, { type: 'travel.arrived' });
    assert.equal(arrival.data.taskId, 'task-000001');
});

test('scheduled caravan booking enforces fare and canonical carried cargo and exposes deterministic departure/arrival interrupts', () => {
    const state = createTestState();
    setPositionAndDiscover(state, 'thornwall-rivergate', { coord: 'H-5' });
    state.player.wallet.gil = 100;

    for (let index = 0; index < 25; index += 1) {
        assert.equal(addItemToContainer(state.player.inventoryState, 'inventory', EQUIPMENT_CATALOG['bronze-sword']).ok, true);
    }
    const overCargo = startScheduledTransport(state, 'service-crown-forge-caravan', 'brasshaven-iron-quay', { cargoUnits: 0 });
    assert.equal(overCargo.ok, false);
    assert.equal(overCargo.code, 'transport.cargo-over-limit');
    assert.equal(overCargo.data.cargoUnits, 25);
    assert.equal(state.player.wallet.gil, 100);

    assert.equal(removeItemQuantityFromContainer(state.player.inventoryState, 'inventory', 'bronze-sword', 1).ok, true);
    const booked = startScheduledTransport(state, 'service-crown-forge-caravan', 'brasshaven-iron-quay', { cargoUnits: 999 });
    assert.equal(booked.ok, true);
    assert.equal(booked.code, 'transport.booked');
    assert.equal(booked.outcome, 'booked');
    assert.equal(booked.data.travel.cargoUnits, 24);
    assert.equal(booked.data.departAtWorldSeconds, 21600);
    assert.equal(booked.data.arriveAtWorldSeconds, 43200);
    assert.equal(state.player.wallet.gil, 40);
    assert.equal(state.travel.status, 'waiting');
    const taskId = booked.data.travel.taskId;

    const departureAdvance = advanceSimulationUntilInterrupt(state, 50000, { providers: [provideTravelInterrupts] });
    assert.equal(departureAdvance.data.interrupt.type, 'transport.departure');
    assert.equal(departureAdvance.data.afterWorldSeconds, 21600);
    const departed = reconcileTravelJourney(state);
    assert.equal(departed.departed, true);
    assert.equal(state.travel.status, 'inTransit');
    assert.equal(state.currentPlaceId, 'thornwall-rivergate');

    const arrivalAdvance = advanceSimulationUntilInterrupt(state, 50000, { providers: [provideTravelInterrupts] });
    assert.equal(arrivalAdvance.data.interrupt.type, 'transport.arrival');
    assert.equal(arrivalAdvance.data.afterWorldSeconds, 43200);
    const arrived = reconcileTravelJourney(state);
    assert.equal(arrived.completed, true);
    assert.equal(arrived.travel.taskId, taskId);
    assert.equal(state.currentPlaceId, 'brasshaven-iron-quay');
    assert.equal(state.travel, null);
    assert.equal(findTimedTask(state, taskId), null);
});

test('stopping a canonical journey releases its cancelled task after cancellation event', () => {
    const state = createTestState();
    setPositionAndDiscover(state, 'thornwall-southgate', { coord: 'F-10' });
    const started = startTravel(state, 'West Elderwood');
    const taskId = started.data.travel.taskId;

    const stopped = stopTravel(state);
    assert.equal(stopped.ok, true);
    assert.equal(stopped.stopped, true);
    assert.equal(state.travel, null);
    assert.equal(findTimedTask(state, taskId), null);
    assert.equal(listSemanticEvents(state, { type: 'task.cancelled' }).length, 1);
    const [cancelled] = listSemanticEvents(state, { type: 'travel.cancelled' });
    assert.equal(cancelled.data.taskId, taskId);
});
