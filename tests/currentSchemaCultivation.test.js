import test from 'node:test';
import assert from 'node:assert/strict';

import { createNewGameState } from '../js/text/gameState.js';
import {
    CULTIVATION_DELEGATED_TEND_SECONDS,
    CULTIVATION_DELEGATION_WAGE_GIL,
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

test('Game State 19 requires durable cultivation and delegation authority before runtime normalization', () => {
    const state = createNewGameState({ nationId: 'thornwall' });
    assert.equal(VERSION.gameState, 19);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
    assert.equal(state.cultivation.version, 2);
    assert.equal(state.cultivation.plot.delegation.version, 1);

    const missing = clone(state);
    delete missing.cultivation;
    assert.ok(validateCurrentGameStateStructure(missing).includes('cultivation must be a persisted object.'));

    const missingDelegation = clone(state);
    delete missingDelegation.cultivation.plot.delegation;
    assert.ok(validateCurrentGameStateStructure(missingDelegation)
        .some((issue) => issue.includes('cultivation.plot.delegation must be an object')));
});

test('cultivation schema rejects forged crop timing, delegated tending, and malformed active work links', () => {
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

    const delegated = createNewGameState({ nationId: 'thornwall' });
    const plantedAt = delegated.worldTime.totalSeconds;
    delegated.cultivation.plot.phase = 'growing';
    delegated.cultivation.plot.cycle = 1;
    delegated.cultivation.plot.crop = {
        itemId: 'item-elderwood-sweetroot',
        cycle: 1,
        plantedAtWorldSeconds: plantedAt,
        tendDueAtWorldSeconds: plantedAt + CULTIVATION_TEND_DUE_SECONDS,
        readyAtWorldSeconds: plantedAt + CULTIVATION_GROWTH_SECONDS,
        tendedAtWorldSeconds: null,
        seedProvenance: [],
    };
    delegated.cultivation.plot.delegation.assignment = {
        version: 1,
        cycle: 1,
        status: 'active',
        wageGil: CULTIVATION_DELEGATION_WAGE_GIL,
        hiredAtWorldSeconds: plantedAt + CULTIVATION_TEND_DUE_SECONDS,
        startsAtWorldSeconds: plantedAt + CULTIVATION_TEND_DUE_SECONDS,
        completesAtWorldSeconds: plantedAt + CULTIVATION_TEND_DUE_SECONDS + CULTIVATION_DELEGATED_TEND_SECONDS,
        completedAtWorldSeconds: null,
    };
    const delegationIssues = validateCultivationState(delegated.cultivation, delegated.work);
    assert.ok(delegationIssues.some((issue) => issue.includes('must be hired before the tending boundary')));

    const active = createNewGameState({ nationId: 'thornwall' });
    const started = startCultivationPreparation(active);
    assert.equal(started.ok, true, started.display?.text);
    assert.deepEqual(validateCurrentGameStateStructure(active), []);

    active.cultivation.plot.activeWorkId = 'work-999999';
    const workIssues = validateCurrentGameStateStructure(active);
    assert.ok(workIssues.some((issue) => issue.includes('activeWorkId work-999999 must reference persisted work')));
});