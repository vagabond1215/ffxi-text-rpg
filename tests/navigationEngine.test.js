import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { getPlace } from '../js/text/data/places.js';
import { isNavigableCoordinate } from '../js/text/data/coordinates.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import {
    calculateMoveDuration,
    canMoveDirection,
    getMovementEdge,
    moveInDirection,
} from '../js/text/systems/navigationEngine.js';

test('Southern San d’Oria topology exposes required valid and invalid coordinates', () => {
    const place = getPlace('southern-sandoria');

    assert.equal(place.coordinateSystem.start.coord, 'G-10');
    assert.equal(isNavigableCoordinate(place, { coord: 'B-2' }), false);
    for (const coord of ['G-10', 'F-10', 'I-7', 'L-10', 'H-11']) {
        assert.equal(isNavigableCoordinate(place, { coord }), true, coord);
    }
});

test('topology movement fails without an edge and succeeds on a defined edge', () => {
    const state = createInitialState();

    assert.equal(moveInDirection(state, 'sw').ok, false);

    const moved = moveInDirection(state, 'e');
    assert.equal(moved.ok, true);
    assert.equal(state.position.coord, 'H-10');
    assert.equal(canMoveDirection(state, 'w'), true);
});

test('San d’Oria exits are coordinate and direction aware', () => {
    const state = createInitialState();

    setPositionAndDiscover(state, 'southern-sandoria', { coord: 'F-10' });
    assert.equal(getMovementEdge(state, 'west')?.toPlaceId, 'west-ronfaure');
    assert.equal(getMovementEdge(state, 'east')?.toPlaceId, undefined);
    const west = moveInDirection(state, 'west');
    assert.equal(west.ok, true);
    assert.equal(state.currentPlaceId, 'west-ronfaure');
    assert.equal(state.position.coord, 'I-6');

    setPositionAndDiscover(state, 'southern-sandoria', { coord: 'L-10' });
    assert.equal(moveInDirection(state, 'east').place.id, 'east-ronfaure');

    setPositionAndDiscover(state, 'southern-sandoria', { coord: 'I-7' });
    assert.equal(moveInDirection(state, 'north').place.id, 'northern-sandoria');
});

test('movement timing rounds up to whole ticks and varies by metadata', () => {
    assert.equal(calculateMoveDuration({ movement: { coordinateSizeYalms: 80, baseWalkYalmsPerSecond: 8, tickSeconds: 1, minimumMoveTicks: 1 } }, { diagonal: false }), 10);
    assert.equal(calculateMoveDuration({ movement: { coordinateSizeYalms: 81, baseWalkYalmsPerSecond: 8, tickSeconds: 1, minimumMoveTicks: 1 } }, { diagonal: false }), 11);
    assert.equal(calculateMoveDuration({ movement: { coordinateSizeYalms: 20, baseWalkYalmsPerSecond: 100, tickSeconds: 1, minimumMoveTicks: 1 } }, { diagonal: false }), 1);
});
