import test from 'node:test';
import assert from 'node:assert/strict';

import { parseCommand, tokenize } from '../js/text/commands/parser.js';
import { createInitialState } from '../js/text/gameState.js';
import { createCommandRouter } from '../js/text/commandRouter.js';
import { isValidGameState, validateGameState } from '../js/text/systems/validation.js';


test('tokenize preserves quoted arguments', () => {
    assert.deepEqual(tokenize('inspect "Forest Hare" --detail=full'), ['inspect', 'Forest Hare', '--detail=full']);
});

test('parseCommand normalizes aliases and named args', () => {
    const parsed = parseCommand('inv pouch --sort=name');

    assert.equal(parsed.command, 'inventory');
    assert.deepEqual(parsed.args, ['pouch']);
    assert.equal(parsed.named.sort, 'name');
});

test('initial state validates', () => {
    const state = createInitialState();

    assert.equal(isValidGameState(state), true);
    assert.deepEqual(validateGameState(state), []);
});

test('router supports inspect and validate commands', () => {
    const state = createInitialState();
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });

    assert.match(router('inspect player'), /Adventurer/);
    assert.match(router('validate'), /valid/);
});
