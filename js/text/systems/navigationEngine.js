import {
    DIRECTION_DELTAS,
    DIRECTION_ORDER,
    describeCoordinate,
    getLevel,
    isTopologyPlace,
    normalizeDirection,
    normalizePositionForPlace,
} from '../data/coordinates.js';
import { getPlace } from '../data/places.js';
import { setPositionAndDiscover } from './atlasEngine.js';

export function canMoveDirection(state, direction) {
    if (state?.activeBattle?.phase === 'active') return false;
    return Boolean(getMovementEdge(state, direction));
}

export function getAvailableDirections(state) {
    return DIRECTION_ORDER.filter((direction) => canMoveDirection(state, direction));
}

export function getMovementEdge(state, direction) {
    const normalizedDirection = normalizeDirection(direction);
    if (!normalizedDirection) return null;

    const place = getPlace(state?.currentPlaceId);
    if (!place) return null;

    if (isTopologyPlace(place)) {
        const position = normalizePositionForPlace(place, state.position ?? place.coordinateSystem.start);
        const level = getLevel(place, position.levelId);
        const edge = level?.edges?.[position.coord]?.[normalizedDirection] ?? null;
        return edge ? { ...edge, from: position, place, direction: normalizedDirection } : null;
    }

    const delta = numericDirectionDelta(normalizedDirection);
    if (!delta) return null;
    const current = state.position ?? { placeId: place.id, ...place.coordinateSystem.start };
    if (!Number.isInteger(current.x) || !Number.isInteger(current.y)) return null;
    const next = { x: current.x + delta.dx, y: current.y + delta.dy };
    if (next.x < 0 || next.y < 0 || next.x >= place.coordinateSystem.width || next.y >= place.coordinateSystem.height) return null;
    return {
        type: 'move',
        from: current,
        to: next,
        place,
        direction: normalizedDirection,
        diagonal: delta.diagonal,
    };
}

export function moveInDirection(state, direction) {
    if (state?.activeBattle?.phase === 'active') return { ok: false, reason: 'You cannot move while engaged in battle.' };

    const normalizedDirection = normalizeDirection(direction);
    if (!normalizedDirection) return { ok: false, reason: `Unknown direction: ${direction}. Use n, ne, e, se, s, sw, w, or nw.` };

    const edge = getMovementEdge(state, normalizedDirection);
    const currentPlace = getPlace(state?.currentPlaceId);
    if (!currentPlace) return { ok: false, reason: `Unknown place: ${state?.currentPlaceId}` };
    if (!edge) {
        const current = state.position ?? currentPlace.coordinateSystem.start;
        return { ok: false, reason: `You cannot move ${normalizedDirection} from ${currentPlace.name} ${describeCoordinate(current)}.` };
    }

    if (edge.type === 'exit') return moveThroughExit(state, edge);
    return moveWithinPlace(state, edge);
}

export function stopTravel(state) {
    if (state?.travel?.active) {
        const destination = getPlace(state.travel.to);
        state.travel = null;
        return { ok: true, stopped: true, message: `Stopped traveling${destination ? ` to ${destination.name}` : ''}.` };
    }
    return { ok: true, stopped: false, message: 'You are already stopped.' };
}

export function calculateMoveDuration(placeOrMovement, edge = {}) {
    const movement = placeOrMovement?.coordinateSystem?.movement ?? placeOrMovement?.movement ?? placeOrMovement ?? {};
    const tickSeconds = Math.max(1, Number(movement.tickSeconds) || 1);
    const minimumTicks = Math.max(1, Number(movement.minimumMoveTicks) || 1);
    const explicitSeconds = Number(edge.travelSeconds);
    if (Number.isFinite(explicitSeconds) && explicitSeconds > 0) return roundUpToTick(explicitSeconds, tickSeconds, minimumTicks);

    const coordinateSize = Math.max(1, Number(movement.coordinateSizeYalms) || 100);
    const baseSpeed = Math.max(1, Number(movement.baseWalkYalmsPerSecond) || 4);
    const diagonalMultiplier = Math.max(1, Number(movement.diagonalCostMultiplier) || 1.414);
    const distanceYalms = Number(edge.distanceYalms) > 0
        ? Number(edge.distanceYalms)
        : coordinateSize * (edge.diagonal ? diagonalMultiplier : 1);
    return roundUpToTick(distanceYalms / baseSpeed, tickSeconds, minimumTicks);
}

function moveWithinPlace(state, edge) {
    const destination = getPlace(state.currentPlaceId);
    const next = isTopologyPlace(destination)
        ? { ...edge.to, facing: edge.direction }
        : edge.to;
    const result = setPositionAndDiscover(state, destination.id, next);
    if (!result.ok) return result;
    const seconds = calculateMoveDuration(destination, edge);
    return {
        ok: true,
        place: destination,
        coordinate: result.coordinate,
        durationSeconds: seconds,
        message: `Moved ${edge.direction} to ${destination.name} ${describeCoordinate(result.coordinate)}.`,
    };
}

function moveThroughExit(state, edge) {
    const destination = getPlace(edge.toPlaceId);
    if (!destination) return { ok: false, reason: `Exit points to unknown place: ${edge.toPlaceId}` };
    const arrival = { ...(edge.arriveAt ?? destination.coordinateSystem.start), facing: edge.arriveAt?.facing ?? edge.direction };
    const result = setPositionAndDiscover(state, destination.id, arrival, { important: ['Zone arrival'] });
    if (!result.ok) return result;
    const seconds = calculateMoveDuration(edge.place, edge);
    return {
        ok: true,
        place: destination,
        coordinate: result.coordinate,
        durationSeconds: seconds,
        exited: true,
        message: `Moved ${edge.direction} through the exit to ${destination.name} ${describeCoordinate(arrival)}.`,
    };
}

function numericDirectionDelta(direction) {
    const delta = DIRECTION_DELTAS[direction];
    if (!delta) return null;
    return { dx: delta.column, dy: delta.row, diagonal: delta.diagonal };
}

function roundUpToTick(seconds, tickSeconds, minimumTicks) {
    const ticks = Math.max(minimumTicks, Math.ceil(seconds / tickSeconds));
    return ticks * tickSeconds;
}
