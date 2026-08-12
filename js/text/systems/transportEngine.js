import { getServiceJourney, getTransportService, getNextServiceDeparture, listTransportServices } from '../data/routeCatalog.js';
import { getPlace } from '../data/places.js';
import { actionFailure, actionSuccess } from './actionResult.js';
import { setPositionAndDiscover } from './atlasEngine.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import { cancelTimedTask, findTimedTask, reconcileTimedTasks, startTimedTask, TIMED_TASK_STATUSES } from './timedTaskEngine.js';
import { advanceWorldTime, ensureWorldTimeState } from './worldTimeEngine.js';

export const TRAVEL_STATE_VERSION = 2;
export const TRAVEL_KINDS = Object.freeze({ ROUTE: 'route', SCHEDULED: 'scheduled' });
export const TRAVEL_STATUSES = Object.freeze({ WAITING: 'waiting', IN_TRANSIT: 'inTransit' });

export function startRouteJourney(state, options = {}) {
    return beginJourney(state, {
        kind: TRAVEL_KINDS.ROUTE,
        routeId: options.routeId,
        serviceId: null,
        from: options.from,
        to: options.to,
        fromStopId: options.fromStopId ?? null,
        toStopId: options.toStopId ?? null,
        mode: options.mode ?? 'walk',
        durationSeconds: options.durationSeconds,
        departAtWorldSeconds: ensureWorldTimeState(state).totalSeconds,
        arriveAt: options.arriveAt ?? null,
        distanceYalms: options.distanceYalms ?? null,
        hazardTags: options.hazardTags ?? [],
        knowledge: options.knowledge ?? null,
        cargoUnits: options.cargoUnits ?? 0,
        fare: null,
        startEventType: 'travel.started',
        startEventSource: 'transportEngine',
    });
}

export function startScheduledTransport(state, serviceId, destinationPlaceId, options = {}) {
    if (state.travel?.active) return failure('transport.already-active', { activeTravel: snapshotTravel(state.travel) }, 'Another journey is already active.');
    const service = getTransportService(serviceId);
    if (!service) return failure('transport.service-not-found', { serviceId }, `Unknown transport service: ${serviceId}.`);
    const from = state.currentPlaceId;
    const journey = getServiceJourney(service.id, from, destinationPlaceId);
    if (!journey) return failure('transport.invalid-journey', { serviceId, from, to: destinationPlaceId }, `${service.name} does not serve that journey from the current place.`);

    const cargoUnits = nonNegativeInteger(options.cargoUnits) ? options.cargoUnits : 0;
    if (cargoUnits > service.cargoAllowanceUnits) {
        return failure('transport.cargo-over-limit', { serviceId, cargoUnits, allowance: service.cargoAllowanceUnits }, `${service.name} allows ${service.cargoAllowanceUnits} cargo units; requested ${cargoUnits}.`);
    }

    const worldTime = ensureWorldTimeState(state);
    let departure = getNextServiceDeparture(service, worldTime.totalSeconds);
    if (departure - worldTime.totalSeconds < service.boardingLeadSeconds) departure += service.cadenceSeconds;
    const fareAmount = service.fare.baseAmount + service.fare.perSegmentAmount * journey.segmentCount;
    const wallet = state.player?.wallet;
    const currencyId = service.fare.currencyId;
    if (!wallet || !Number.isFinite(wallet[currencyId]) || wallet[currencyId] < fareAmount) {
        return failure('transport.fare-required', { serviceId, currencyId, fareAmount, available: wallet?.[currencyId] ?? 0 }, `${service.name} costs ${fareAmount} ${currencyId}; insufficient funds.`);
    }

    wallet[currencyId] -= fareAmount;
    const started = beginJourney(state, {
        kind: TRAVEL_KINDS.SCHEDULED,
        routeId: journey.route.id,
        serviceId: service.id,
        from,
        to: destinationPlaceId,
        fromStopId: journey.fromStop.id,
        toStopId: journey.toStop.id,
        mode: service.mode,
        durationSeconds: journey.durationSeconds,
        departAtWorldSeconds: departure,
        arriveAt: journey.toStop.coordinate ?? getPlace(destinationPlaceId)?.coordinateSystem?.start ?? null,
        distanceYalms: journey.distanceYalms,
        hazardTags: journey.hazardTags,
        knowledge: journey.route.knowledge,
        cargoUnits,
        fare: { currencyId, amount: fareAmount },
        startEventType: 'transport.booked',
        startEventSource: 'transportEngine',
    });
    if (!started.ok) wallet[currencyId] += fareAmount;
    return started;
}

export function reconcileTravelJourney(state) {
    if (!state.travel?.active) return { completed: false, departed: false, travel: null };
    normalizeLegacyActiveTravel(state);
    reconcileTimedTasks(state);
    const travel = state.travel;
    const now = ensureWorldTimeState(state).totalSeconds;
    let departed = false;
    let departureEventId = null;

    if (travel.status === TRAVEL_STATUSES.WAITING && now >= travel.departAtWorldSeconds) {
        travel.status = TRAVEL_STATUSES.IN_TRANSIT;
        travel.departedAtWorldSeconds = travel.departAtWorldSeconds;
        const departureEvent = emitSemanticEvent(state, travel.kind === TRAVEL_KINDS.SCHEDULED ? 'transport.departed' : 'travel.departed', travelEventData(travel), { source: 'transportEngine' });
        departureEventId = departureEvent.id;
        departed = true;
    }

    const task = travel.taskId ? findTimedTask(state, travel.taskId) : null;
    travel.remainingSeconds = Math.max(0, travel.arriveAtWorldSeconds - now);
    if (now < travel.arriveAtWorldSeconds && task?.status !== TIMED_TASK_STATUSES.COMPLETED) {
        return { completed: false, departed, departureEventId, travel: snapshotTravel(travel) };
    }

    const completed = { ...travel, hazardTags: [...travel.hazardTags] };
    const destination = getPlace(completed.to);
    const arrival = completed.arriveAt ?? destination?.coordinateSystem?.start ?? { x: 0, y: 0 };
    if (destination) setPositionAndDiscover(state, destination.id, arrival, { important: ['Place arrival'] });
    else {
        state.currentPlaceId = completed.to;
        state.location = completed.to;
        state.position = { placeId: completed.to, ...arrival };
    }
    state.travel = null;
    const eventType = completed.kind === TRAVEL_KINDS.SCHEDULED ? 'transport.arrived' : 'travel.arrived';
    const event = emitSemanticEvent(state, eventType, { ...travelEventData(completed), arrival }, { source: 'transportEngine' });
    return {
        completed: true,
        departed,
        departureEventId,
        travel: snapshotTravel(completed),
        destination,
        eventId: event.id,
        message: `Arrived at ${destination?.name ?? completed.to}.`,
    };
}

export function advanceTravelJourney(state, elapsedSeconds) {
    const seconds = Number(elapsedSeconds);
    if (!nonNegativeInteger(seconds)) return { completed: false, ok: false, reason: 'Travel advancement requires whole non-negative seconds.' };
    if (!state.travel?.active) return { completed: false, ok: true };
    if (seconds > 0) advanceWorldTime(state, seconds);
    return { ok: true, ...reconcileTravelJourney(state) };
}

export function cancelTravelJourney(state) {
    if (!state.travel?.active) return { ok: true, stopped: false, message: 'You are already stopped.' };
    normalizeLegacyActiveTravel(state);
    const travel = state.travel;
    if (travel.taskId) {
        const task = findTimedTask(state, travel.taskId);
        if (task?.status === TIMED_TASK_STATUSES.ACTIVE) cancelTimedTask(state, travel.taskId);
    }
    const destination = getPlace(travel.to);
    const eventType = travel.kind === TRAVEL_KINDS.SCHEDULED ? 'transport.cancelled' : 'travel.cancelled';
    emitSemanticEvent(state, eventType, travelEventData(travel), { source: 'transportEngine' });
    state.travel = null;
    return { ok: true, stopped: true, message: `Stopped traveling${destination ? ` to ${destination.name}` : ''}.` };
}

export function provideTravelInterrupts({ state, nowWorldSeconds, horizonWorldSeconds }) {
    if (!state.travel?.active) return [];
    normalizeLegacyActiveTravel(state);
    const travel = state.travel;
    const candidates = [];
    if (travel.status === TRAVEL_STATUSES.WAITING && travel.departAtWorldSeconds >= nowWorldSeconds && travel.departAtWorldSeconds <= horizonWorldSeconds) {
        candidates.push({
            id: `travel-departure:${travel.taskId ?? travel.routeId ?? travel.to}`,
            type: travel.kind === TRAVEL_KINDS.SCHEDULED ? 'transport.departure' : 'travel.departure',
            atWorldSeconds: travel.departAtWorldSeconds,
            priority: 540,
            source: 'transportEngine',
            data: { routeId: travel.routeId, serviceId: travel.serviceId, from: travel.from, to: travel.to },
        });
    }
    if (travel.arriveAtWorldSeconds >= nowWorldSeconds && travel.arriveAtWorldSeconds <= horizonWorldSeconds) {
        candidates.push({
            id: `travel-arrival:${travel.taskId ?? travel.routeId ?? travel.to}`,
            type: travel.kind === TRAVEL_KINDS.SCHEDULED ? 'transport.arrival' : 'travel.arrival',
            atWorldSeconds: travel.arriveAtWorldSeconds,
            priority: 560,
            source: 'transportEngine',
            data: { routeId: travel.routeId, serviceId: travel.serviceId, from: travel.from, to: travel.to },
        });
    }
    return candidates;
}

export function describeTransportServices(state = null) {
    const now = state ? ensureWorldTimeState(state).totalSeconds : 0;
    return [
        'Scheduled transport services:',
        ...listTransportServices().map((service) => {
            const next = getNextServiceDeparture(service, now);
            return `- ${service.id}: ${service.name} [${service.mode}] route=${service.routeId}, cadence=${service.cadenceSeconds}s, next=${next}, cargo=${service.cargoAllowanceUnits}`;
        }),
    ].join('\n');
}

export function validateActiveTravel(travel) {
    if (travel === null || travel === undefined) return [];
    if (!plainObject(travel)) return ['travel must be null or an object.'];
    const issues = [];
    if (travel.active !== true) issues.push('travel.active must be true when travel is present.');
    if (travel.version !== undefined && travel.version !== TRAVEL_STATE_VERSION) issues.push(`travel.version must be ${TRAVEL_STATE_VERSION}.`);
    if (travel.kind !== undefined && !Object.values(TRAVEL_KINDS).includes(travel.kind)) issues.push('travel.kind is invalid.');
    if (travel.status !== undefined && !Object.values(TRAVEL_STATUSES).includes(travel.status)) issues.push('travel.status is invalid.');
    if (!travel.from || !getPlace(travel.from)) issues.push('travel.from references an unknown place.');
    if (!travel.to || !getPlace(travel.to)) issues.push('travel.to references an unknown place.');
    if (travel.departAtWorldSeconds !== undefined && !nonNegativeInteger(travel.departAtWorldSeconds)) issues.push('travel.departAtWorldSeconds is invalid.');
    if (travel.arriveAtWorldSeconds !== undefined && !nonNegativeInteger(travel.arriveAtWorldSeconds)) issues.push('travel.arriveAtWorldSeconds is invalid.');
    if (travel.departAtWorldSeconds !== undefined && travel.arriveAtWorldSeconds !== undefined && travel.arriveAtWorldSeconds < travel.departAtWorldSeconds) issues.push('travel arrival precedes departure.');
    return issues;
}

function beginJourney(state, definition) {
    if (state.travel?.active) return failure('travel.already-active', { activeTravel: snapshotTravel(state.travel) }, 'Another journey is already active.');
    if (!getPlace(definition.from) || !getPlace(definition.to)) return failure('travel.invalid-place', { from: definition.from, to: definition.to }, 'Journey endpoints must reference known places.');
    if (!positiveInteger(definition.durationSeconds)) return failure('travel.invalid-duration', { durationSeconds: definition.durationSeconds }, 'Journey duration must be a positive whole number of seconds.');

    const worldTime = ensureWorldTimeState(state);
    const departAtWorldSeconds = Math.max(worldTime.totalSeconds, Number(definition.departAtWorldSeconds) || worldTime.totalSeconds);
    const arriveAtWorldSeconds = departAtWorldSeconds + definition.durationSeconds;
    const totalSeconds = arriveAtWorldSeconds - worldTime.totalSeconds;
    const task = startTimedTask(state, {
        kind: definition.kind === TRAVEL_KINDS.SCHEDULED ? 'transport.journey' : 'travel.route',
        label: `${definition.mode} ${getPlace(definition.from)?.name ?? definition.from} to ${getPlace(definition.to)?.name ?? definition.to}`,
        channel: 'travel',
        durationSeconds: totalSeconds,
        data: { routeId: definition.routeId ?? null, serviceId: definition.serviceId ?? null, from: definition.from, to: definition.to },
    });
    if (!task.ok) return task;

    const status = departAtWorldSeconds > worldTime.totalSeconds ? TRAVEL_STATUSES.WAITING : TRAVEL_STATUSES.IN_TRANSIT;
    state.travel = {
        version: TRAVEL_STATE_VERSION,
        active: true,
        kind: definition.kind,
        status,
        routeId: definition.routeId ?? null,
        serviceId: definition.serviceId ?? null,
        taskId: task.data.task.id,
        from: definition.from,
        to: definition.to,
        fromStopId: definition.fromStopId ?? null,
        toStopId: definition.toStopId ?? null,
        mode: definition.mode,
        durationSeconds: definition.durationSeconds,
        totalSeconds,
        remainingSeconds: totalSeconds,
        bookedAtWorldSeconds: worldTime.totalSeconds,
        departAtWorldSeconds,
        departedAtWorldSeconds: status === TRAVEL_STATUSES.IN_TRANSIT ? departAtWorldSeconds : null,
        arriveAtWorldSeconds,
        arriveAt: definition.arriveAt ? { ...definition.arriveAt } : null,
        distanceYalms: definition.distanceYalms ?? null,
        hazardTags: [...definition.hazardTags],
        knowledge: definition.knowledge ? { ...definition.knowledge } : null,
        cargoUnits: definition.cargoUnits ?? 0,
        fare: definition.fare ? { ...definition.fare } : null,
    };

    const event = emitSemanticEvent(state, definition.startEventType, travelEventData(state.travel), { source: definition.startEventSource });
    if (status === TRAVEL_STATUSES.IN_TRANSIT) emitSemanticEvent(state, definition.kind === TRAVEL_KINDS.SCHEDULED ? 'transport.departed' : 'travel.departed', travelEventData(state.travel), { source: 'transportEngine' });
    return actionSuccess({
        action: definition.kind === TRAVEL_KINDS.SCHEDULED ? 'transport.start' : 'travel.start',
        code: definition.kind === TRAVEL_KINDS.SCHEDULED ? 'transport.booked' : 'travel.started',
        outcome: status === TRAVEL_STATUSES.WAITING ? 'booked' : 'started',
        data: { travel: snapshotTravel(state.travel), task: task.data.task, eventId: event.id, from: definition.from, to: definition.to, durationSeconds: definition.durationSeconds, departAtWorldSeconds, arriveAtWorldSeconds },
        display: { text: status === TRAVEL_STATUSES.WAITING ? `Booked ${definition.mode} travel; departure at ${departAtWorldSeconds}, arrival at ${arriveAtWorldSeconds}.` : `Traveling to ${getPlace(definition.to)?.name ?? definition.to}. Estimated time: ${definition.durationSeconds}s.` },
    });
}

function normalizeLegacyActiveTravel(state) {
    const travel = state.travel;
    if (!travel?.active || travel.version === TRAVEL_STATE_VERSION) return travel;
    const now = ensureWorldTimeState(state).totalSeconds;
    const remainingSeconds = Math.max(1, Number.parseInt(travel.remainingSeconds, 10) || Number.parseInt(travel.totalSeconds, 10) || 1);
    const task = startTimedTask(state, {
        kind: 'travel.route',
        label: `${travel.mode ?? 'walk'} legacy travel`,
        channel: 'travel',
        durationSeconds: remainingSeconds,
        data: { routeId: null, serviceId: null, from: travel.from, to: travel.to, legacyTravel: true },
    });
    Object.assign(travel, {
        version: TRAVEL_STATE_VERSION,
        kind: TRAVEL_KINDS.ROUTE,
        status: TRAVEL_STATUSES.IN_TRANSIT,
        routeId: null,
        serviceId: null,
        taskId: task.ok ? task.data.task.id : null,
        durationSeconds: remainingSeconds,
        totalSeconds: remainingSeconds,
        remainingSeconds,
        bookedAtWorldSeconds: now,
        departAtWorldSeconds: now,
        departedAtWorldSeconds: now,
        arriveAtWorldSeconds: now + remainingSeconds,
        distanceYalms: null,
        hazardTags: [],
        knowledge: null,
        cargoUnits: 0,
        fare: null,
    });
    return travel;
}

function travelEventData(travel) {
    return {
        kind: travel.kind,
        routeId: travel.routeId,
        serviceId: travel.serviceId,
        taskId: travel.taskId,
        from: travel.from,
        to: travel.to,
        mode: travel.mode,
        status: travel.status,
        durationSeconds: travel.durationSeconds,
        departAtWorldSeconds: travel.departAtWorldSeconds,
        arriveAtWorldSeconds: travel.arriveAtWorldSeconds,
        distanceYalms: travel.distanceYalms,
        hazardTags: [...(travel.hazardTags ?? [])],
        cargoUnits: travel.cargoUnits ?? 0,
        fare: travel.fare ? { ...travel.fare } : null,
    };
}

function snapshotTravel(travel) {
    return Object.freeze({
        ...travel,
        arriveAt: travel.arriveAt ? Object.freeze({ ...travel.arriveAt }) : null,
        hazardTags: Object.freeze([...(travel.hazardTags ?? [])]),
        knowledge: travel.knowledge ? Object.freeze({ ...travel.knowledge }) : null,
        fare: travel.fare ? Object.freeze({ ...travel.fare }) : null,
    });
}

function failure(code, data, text) {
    return actionFailure({ action: 'transport', code, outcome: 'blocked', data, display: { text } });
}
function positiveInteger(value) { return Number.isInteger(value) && value > 0; }
function nonNegativeInteger(value) { return Number.isInteger(value) && value >= 0; }
function plainObject(value) { return Boolean(value && typeof value === 'object' && !Array.isArray(value)); }
