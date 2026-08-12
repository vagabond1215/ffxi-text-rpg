import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { isActionResult } from '../js/text/systems/actionResult.js';
import { listSemanticEvents } from '../js/text/systems/semanticEventEngine.js';
import {
    advanceWorldTime,
    createWorldTimeState,
    describeWorldTime,
    getWorldTimeParts,
    SECONDS_PER_DAY,
    validateWorldTimeState,
} from '../js/text/systems/worldTimeEngine.js';


test('world clock derives day and clock fields from one canonical second count', () => {
    const worldTime = createWorldTimeState({ totalSeconds: SECONDS_PER_DAY + 3661 });
    const parts = getWorldTimeParts(worldTime);

    assert.deepEqual(parts, {
        totalSeconds: 90061,
        day: 2,
        dayIndex: 1,
        secondsOfDay: 3661,
        hour: 1,
        minute: 1,
        second: 1,
    });
    assert.equal(describeWorldTime(worldTime), 'Day 2, 01:01:01');
});

test('world time advances exactly across minute hour and day boundaries', () => {
    const state = createInitialState();
    state.worldTime.totalSeconds = SECONDS_PER_DAY - 2;

    const result = advanceWorldTime(state, 5);

    assert.equal(isActionResult(result), true);
    assert.equal(result.ok, true);
    assert.equal(result.code, 'time.advanced');
    assert.equal(result.data.beforeTotalSeconds, SECONDS_PER_DAY - 2);
    assert.equal(result.data.afterTotalSeconds, SECONDS_PER_DAY + 3);
    assert.equal(result.data.crossedDays, 1);
    assert.equal(describeWorldTime(state), 'Day 2, 00:00:03');
});

test('multi-day advancement is deterministic and independent of wall-clock time', () => {
    const state = createInitialState();
    const originalNow = Date.now;
    Date.now = () => { throw new Error('world clock must not read Date.now'); };

    try {
        const result = advanceWorldTime(state, (3 * SECONDS_PER_DAY) + 90);
        assert.equal(result.ok, true);
        assert.equal(result.data.crossedDays, 3);
        assert.equal(state.worldTime.totalSeconds, (3 * SECONDS_PER_DAY) + 90);
        assert.equal(describeWorldTime(state), 'Day 4, 00:01:30');
    } finally {
        Date.now = originalNow;
    }
});

test('world-time advancement emits structured semantic observation after advancement', () => {
    const state = createInitialState();
    const result = advanceWorldTime(state, 600);
    const events = listSemanticEvents(state, { type: 'time.advanced' });

    assert.equal(result.data.eventId, 'evt-000001');
    assert.equal(events.length, 1);
    assert.equal(events[0].worldTimeSeconds, 600);
    assert.deepEqual(events[0].data, {
        secondsAdvanced: 600,
        beforeTotalSeconds: 0,
        afterTotalSeconds: 600,
        crossedDays: 0,
    });
});

test('invalid time advancement is rejected without mutating state', () => {
    const state = createInitialState();

    for (const value of [-1, 1.5, Number.NaN]) {
        const result = advanceWorldTime(state, value);
        assert.equal(result.ok, false);
        assert.equal(result.code, 'time.invalid-advance');
        assert.equal(state.worldTime.totalSeconds, 0);
    }
});

test('world-time validation accepts only non-negative integer canonical seconds', () => {
    assert.deepEqual(validateWorldTimeState({ totalSeconds: 0 }), []);
    assert.deepEqual(validateWorldTimeState({ totalSeconds: 12 }), []);
    assert.match(validateWorldTimeState({ totalSeconds: -1 }).join('\n'), /non-negative integer/);
    assert.match(validateWorldTimeState({ totalSeconds: 1.5 }).join('\n'), /non-negative integer/);
});
