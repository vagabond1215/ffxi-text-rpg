import test from 'node:test';
import assert from 'node:assert/strict';

import { createCommandRouter } from '../js/text/commandRouter.js';
import { createInitialState } from '../js/text/gameState.js';
import {
    castSpell,
    performPlayerAttack,
    performWeaponSkill,
    startEncounter,
} from '../js/text/systems/combatActionEngine.js';


test('startEncounter creates an active battle', () => {
    const state = createInitialState();
    const result = startEncounter(state, 'Forest Hare');

    assert.equal(result.ok, true);
    assert.equal(state.activeBattle.phase, 'active');
    assert.match(result.message, /Battle/);
});

test('performPlayerAttack advances battle log', () => {
    const state = createInitialState();
    startEncounter(state, 'Forest Hare');
    const before = state.activeBattle.log.length;
    const result = performPlayerAttack(state);

    assert.ok(state.activeBattle.log.length > before);
    assert.match(result, /Battle/);
});

test('weapon skill requires TP', () => {
    const state = createInitialState();
    startEncounter(state, 'Forest Hare');

    assert.match(performWeaponSkill(state, 'Fast Blade'), /Not enough TP/);
});

test('cast spell requires active battle', () => {
    const state = createInitialState();

    assert.equal(castSpell(state, 'Cure'), 'You are not in battle.');
});

test('router exposes encounter battle attack and slash commands', () => {
    const state = createInitialState();
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });

    assert.match(router('encounter Forest Hare'), /Battle/);
    assert.match(router('battle'), /Battle/);
    assert.match(router('attack'), /Battle/);
    assert.match(router('/attack'), /Battle/);
});
