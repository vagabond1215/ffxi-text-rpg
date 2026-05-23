import test from 'node:test';
import assert from 'node:assert/strict';

import { createNewGameState } from '../js/text/gameState.js';
import { createCommandRouter } from '../js/text/commandRouter.js';
import { setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';

test('skills command displays current job skill progression', () => {
    const state = createNewGameState();
    setLearnedSkill(state.player, 'axe', 3);
    const route = createCommandRouter(state, { saveGame: () => true, clearSave: () => {}, reload: () => {} });

    const output = route('skills');

    assert.match(output, /Skills for Warrior Lv\.1/);
    assert.match(output, /axe: learned 3/);
    assert.match(output, /effective 3/);
});

test('skill command displays a single skill', () => {
    const state = createNewGameState();
    setLearnedSkill(state.player, 'axe', 3);
    const route = createCommandRouter(state, { saveGame: () => true, clearSave: () => {}, reload: () => {} });

    const output = route('skill axe');

    assert.match(output, /axe: learned 3/);
    assert.match(output, /rank A/);
});

test('inspect skills and inspect skill route to skill descriptions', () => {
    const state = createNewGameState();
    setLearnedSkill(state.player, 'axe', 3);
    const route = createCommandRouter(state, { saveGame: () => true, clearSave: () => {}, reload: () => {} });

    assert.match(route('inspect skills'), /Skills for Warrior Lv\.1/);
    assert.match(route('inspect skill axe'), /axe: learned 3/);
});
