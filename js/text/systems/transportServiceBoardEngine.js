import {
    getNextServiceDeparture,
    getRoute,
    getServiceJourney,
    listTransportServices,
} from '../data/routeCatalog.js';
import { getPlace } from '../data/places.js';
import { describeBlockingHandsOnTask, isCharacterHandsOnBusy } from './characterActivityEngine.js';
import { ensureWorldTimeState } from './worldTimeEngine.js';

export const TRANSPORT_SERVICE_BOARD_VERSION = 1;

export function createTransportServiceBoard(state, options = {}) {
    const fromPlaceId = options.placeId ?? state?.currentPlaceId ?? null;
    const nowWorldSeconds = ensureWorldTimeState(state).totalSeconds;
    const cargoUnits = nonNegativeInteger(options.cargoUnits) ? options.cargoUnits : 0;
    const entries = [];

    for (const service of listTransportServices()) {
        const route = getRoute(service.routeId);
        if (!route) continue;
        const servedStops = service.stopIds
            .map((stopId) => route.stops.find((stop) => stop.id === stopId) ?? null)
            .filter(Boolean);
        if (!servedStops.some((stop) => stop.placeId === fromPlaceId)) continue;

        for (const stop of servedStops) {
            if (stop.placeId === fromPlaceId) continue;
            const journey = getServiceJourney(service.id, fromPlaceId, stop.placeId);
            if (!journey) continue;
            entries.push(createQuote(state, service, journey, {
                fromPlaceId,
                destinationPlaceId: stop.placeId,
                nowWorldSeconds,
                cargoUnits,
            }));
        }
    }

    entries.sort((a, b) => a.departAtWorldSeconds - b.departAtWorldSeconds
        || a.fareAmount - b.fareAmount
        || a.destinationName.localeCompare(b.destinationName));

    return Object.freeze({
        version: TRANSPORT_SERVICE_BOARD_VERSION,
        placeId: fromPlaceId,
        placeName: getPlace(fromPlaceId)?.name ?? fromPlaceId ?? 'Unknown place',
        nowWorldSeconds,
        entries: Object.freeze(entries),
    });
}

export function describeTransportServiceBoard(state, options = {}) {
    const board = createTransportServiceBoard(state, options);
    if (!board.entries.length) return `No scheduled passenger services depart from ${board.placeName}.`;
    return [
        `Scheduled departures from ${board.placeName}:`,
        ...board.entries.map((entry) => {
            const readiness = entry.blockers.length
                ? `Blocked: ${entry.blockers.join(' ')}`
                : `Boardable; next departure in ${formatDuration(entry.waitSeconds)}.`;
            return `- ${entry.serviceName} to ${entry.destinationName}: ${entry.fareAmount} ${entry.currencyId}, every ${formatDuration(entry.cadenceSeconds)}, travel ${formatDuration(entry.durationSeconds)}. ${readiness}`;
        }),
    ].join('\n');
}

function createQuote(state, service, journey, context) {
    const departure = boardableDeparture(service, context.nowWorldSeconds);
    const fareAmount = service.fare.baseAmount + service.fare.perSegmentAmount * journey.segmentCount;
    const wallet = state.player?.wallet ?? {};
    const availableFunds = Number.isFinite(wallet[service.fare.currencyId]) ? wallet[service.fare.currencyId] : 0;
    const blockers = [];

    if (state.travel?.active) blockers.push('Finish or stop your current journey first.');
    if (isCharacterHandsOnBusy(state)) blockers.push(describeBlockingHandsOnTask(state));
    if (context.cargoUnits > service.cargoAllowanceUnits) {
        blockers.push(`${service.name} carries at most ${service.cargoAllowanceUnits} cargo units.`);
    }
    if (availableFunds < fareAmount) {
        blockers.push(`Fare is ${fareAmount} ${service.fare.currencyId}; you have ${availableFunds}.`);
    }

    return Object.freeze({
        id: `transport-board:${service.id}:${context.destinationPlaceId}`,
        serviceId: service.id,
        serviceName: service.name,
        mode: service.mode,
        routeId: service.routeId,
        fromPlaceId: context.fromPlaceId,
        destinationPlaceId: context.destinationPlaceId,
        destinationName: getPlace(context.destinationPlaceId)?.name ?? context.destinationPlaceId,
        segmentCount: journey.segmentCount,
        distanceYalms: journey.distanceYalms,
        durationSeconds: journey.durationSeconds,
        cadenceSeconds: service.cadenceSeconds,
        boardingLeadSeconds: service.boardingLeadSeconds,
        cargoAllowanceUnits: service.cargoAllowanceUnits,
        currencyId: service.fare.currencyId,
        fareAmount,
        availableFunds,
        departAtWorldSeconds: departure,
        waitSeconds: Math.max(0, departure - context.nowWorldSeconds),
        arriveAtWorldSeconds: departure + journey.durationSeconds,
        available: blockers.length === 0,
        blockers: Object.freeze(blockers),
    });
}

function boardableDeparture(service, nowWorldSeconds) {
    let departure = getNextServiceDeparture(service, nowWorldSeconds);
    if (departure - nowWorldSeconds < service.boardingLeadSeconds) departure += service.cadenceSeconds;
    return departure;
}

function formatDuration(seconds) {
    const total = Math.max(0, Math.floor(Number(seconds) || 0));
    if (total === 0) return 'now';
    if (total % 3600 === 0) {
        const hours = total / 3600;
        return `${hours}h`;
    }
    if (total >= 3600) {
        const hours = Math.floor(total / 3600);
        const minutes = Math.floor((total % 3600) / 60);
        return `${hours}h ${minutes}m`;
    }
    if (total % 60 === 0) return `${total / 60}m`;
    return `${total}s`;
}

function nonNegativeInteger(value) {
    return Number.isInteger(value) && value >= 0;
}
