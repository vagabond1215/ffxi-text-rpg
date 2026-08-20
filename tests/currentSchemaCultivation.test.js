import test from 'node:test';
import assert from 'node:assert/strict';

import { createNewGameState } from '../js/text/gameState.js';
import {
    CULTIVATION_GROWTH_SECONDS,
    CULTIVATION_TEND_DUE_SECONDS,
    startCultivationPreparation,
    validateCultivationState,
} from '../js/text/systems/cultivationEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { VERSION } from '../js/text/version.js';

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

test('Game State 13 requires durable cultivation authority before runtime normalization', () => {
    const state = createNewGameState({ nationId: 'thornwall' });
    assert.equal(VERSION.gameState, 13);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);

    const missing = clone(state);
    delete missing.cultivation;
    assert.ok(validateCurrentGameStateStructure(missing).includes('cultivation must be a persisted object.'));
});

test('cultivation schema rejects forged crop timing and malformed active work links', () => {
    const state = createNewGameState({ nationId: 'thornwall' });
    const now = state.worldTime.totalSeconds;
    state.cultivation.plot.phase = 'growing';
    state.cultivation.plot.cycle = 1;
    state.cultivation.plot.crop = {
        itemId: 'item-elderwood-sweetroot',
        cycle: 1,
        plantedAtWorldSeconds: now,
        tendDueAtWorldSeconds: now + CULTIVATION_TEND_DUE_SECONDS + 1,
        readyAtWorldSeconds: now + CULTIVATION_GROWTH_SECONDS,
        tendedAtWorldSeconds: null,
        seedProvenance: [],
    };
    const timingIssues = validateCultivationState(state.cultivation, state.work);
    assert.ok(timingIssues.some((issue) => issue.includes('tendDueAtWorldSeconds must derive from planted time')));

    const active = createNewGameState({ nationId: 'thornwall' });
    const started = startCultivationPreparation(active);
    assert.equal(started.ok, true, started.display?.text);
    assert.deepEqual(validateCurrentGameStateStructure(active), []);

    active.cultivation.plot.activeWorkId = 'work-999999';
    const workIssues = validateCurrentGameStateStructure(active);
    assert.ok(workIssues.some((issue) => issue.includes('activeWorkId work-999999 must reference persisted work')));
});
