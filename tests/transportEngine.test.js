import test from 'node:test';
import assert from 'node:assert/strict';

import { EQUIPMENT_CATALOG } from '../js/text/data/equipmentCatalog.js';
import { createTestState } from './helpers/createTestState.js';
import {
    findRouteLeg,
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
    assert.ok(listRoutes().length >= 8);
    assert.ok(listTransportServices().length >= 5);

    const journey = getServiceJourney('service-crown-forge-caravan', 'thornwall-rivergate', 'brasshaven-iron-quay');
    assert.equal(journey.route.id, 'route-crown-forge-caravan-road');
    assert.equal(journey.segmentCount, 2);
    assert.equal(journey.durationSeconds, 21600);
    assert.ok(journey.hazardTags.includes('roadside-raiders'));
});

test('Forge-Mere road now crosses Coppergrass without changing the full corridor distance or duration', () => {
    const westLeg = findRouteLeg('brasshaven-iron-quay', 'coppergrass-steppe', { mode: 'walk' });
    const eastLeg = findRouteLeg('coppergrass-steppe', 'mistmere-reedport', { mode: 'walk' });
    const fullJourney = getServiceJourney('service-forge-mere-caravan', 'brasshaven-iron-quay', 'mistmere-reedport');

    assert.ok(westLeg);
    assert.ok(eastLeg);
    assert.equal(westLeg.durationSeconds, 9000);
    assert.equal(eastLeg.durationSeconds, 9000);
    assert.equal(westLeg.distanceYalms, 22500);
    assert.equal(eastLeg.distanceYalms, 22500);
    assert.ok(westLeg.hazardTags.includes('grassfire'));
    assert.ok(eastLeg.hazardTags.includes('seasonal-flood'));

    assert.equal(fullJourney.durationSeconds, 18000);
    assert.equal(fullJourney.distanceYalms, 45000);
    assert.ok(fullJourney.hazardTags.includes('crosswind'));
    assert.ok(fullJourney.hazardTags.includes('fen-weather'));
});

test('Crown-Forge road now crosses Slatewater while preserving the established through journey', () => {
    const westLeg = findRouteLeg('timbercross-landing', 'slatewater-waylodge', { mode: 'walk' });
    const eastLeg = findRouteLeg('slatewater-waylodge', 'brasshaven-iron-quay', { mode: 'walk' });
    const throughJourney = getServiceJourney('service-crown-forge-caravan', 'thornwall-rivergate', 'brasshaven-iron-quay');
    const localJourney = getServiceJourney('service-slatewater-foothill-caravan', 'timbercross-landing', 'brasshaven-iron-quay');

    assert.ok(westLeg);
    assert.ok(eastLeg);
    assert.equal(westLeg.durationSeconds, 7200);
    assert.equal(eastLeg.durationSeconds, 7200);
    assert.equal(westLeg.distanceYalms, 18000);
    assert.equal(eastLeg.distanceYalms, 18000);
    assert.ok(westLeg.hazardTags.includes('river-crossings'));
    assert.ok(eastLeg.hazardTags.includes('steep-grades'));

    assert.equal(throughJourney.durationSeconds, 21600);
    assert.equal(throughJourney.distanceYalms, 54000);
    assert.equal(localJourney.durationSeconds, 14400);
    assert.equal(localJourney.distanceYalms, 36000);
    assert.equal(localJourney.segmentCount, 2);
});

test('Southfield Farm Road connects Thornwall to Crownfields with scheduled produce transport', () => {
    const leg = findRouteLeg('thornwall-southgate', 'crownfields-grange', { mode: 'wagon' });
    const journey = getServiceJourney('service-crownfields-produce-wagon', 'thornwall-southgate', 'crownfields-grange');

    assert.ok(leg);
    assert.equal(leg.route.id, 'route-thornwall-crownfields-road');
    assert.equal(leg.durationSeconds, 3600);
    assert.equal(leg.distanceYalms, 9000);
    assert.ok(leg.hazardTags.includes('seasonal-mud'));
    assert.ok(leg.hazardTags.includes('livestock-crossing'));

    assert.ok(journey);
    assert.equal(journey.segmentCount, 1);
    assert.equal(journey.durationSeconds, 3600);
    assert.equal(journey.distanceYalms, 9000);
    assert.equal(journey.service.mode, 'wagon');
    assert.equal(getNextServiceDeparture('service-crownfields-produce-wagon', 0), 5400);
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
