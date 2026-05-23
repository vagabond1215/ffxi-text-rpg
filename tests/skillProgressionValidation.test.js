import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { validateGameState } from '../js/text/systems/validation.js';

test('validation rejects unknown character-owned skill ids', () => {
    const state = createInitialState();
    state.player.progression.skills.notASkill = 1;

    const issues = validateGameState(state);

    assert.ok(issues.some((issue) => issue.includes('player.progression.skills.notASkill references unknown skill')));
});

test('validation rejects non-integer character-owned skill values', () => {
    const state = createInitialState();
    state.player.progression.skills.axe = 1.5;

    const issues = validateGameState(state);

    assert.ok(issues.some((issue) => issue.includes('player.progression.skills.axe must be a non-negative finite integer')));
});

test('validation rejects nested job-keyed skill maps clearly', () => {
    const state = createInitialState();
    state.player.progression.skills.warrior = {
        axe: 1,
    };

    const issues = validateGameState(state);

    assert.ok(issues.some((issue) => issue.includes('player.progression.skills.warrior appears to be a nested job-keyed skill map')));
});
