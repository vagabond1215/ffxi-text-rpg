import test from 'node:test';
import assert from 'node:assert/strict';

import { createCommandRouter } from '../js/text/commandRouter.js';
import { createInitialState } from '../js/text/gameState.js';

function createTestRouter() {
    const state = createInitialState();
    state.player.progression.skills.axe = 2;
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });
    return { state, router };
}

test('skills command describes character-owned skills', () => {
    const { router } = createTestRouter();

    const output = router('skills');

    assert.match(output, /Skills:/);
    assert.match(output, /Job: Warrior Lv\.1/);
    assert.match(output, /- axe: 2\/3 \(rank A\)/);
    assert.match(output, /Confidence: placeholder/);
});

test('skill command describes one requested skill', () => {
    const { router } = createTestRouter();

    const output = router('skill axe');

    assert.match(output, /Skill: axe/);
    assert.match(output, /Current: 2/);
    assert.match(output, /Cap: 3/);
});

test('inspect skills aliases to skill summary', () => {
    const { router } = createTestRouter();

    const output = router('inspect skills');

    assert.match(output, /Skills:/);
    assert.match(output, /- axe: 2\/3 \(rank A\)/);
});

test('inspect skill aliases to single skill inspection', () => {
    const { router } = createTestRouter();

    const output = router('inspect skill axe');

    assert.match(output, /Skill: axe/);
    assert.match(output, /Rank: A/);
});
