import test from 'node:test';
import assert from 'node:assert/strict';

import { parseCommand, tokenize } from '../js/text/commands/parser.js';
import { createInitialState } from '../js/text/gameState.js';
import { createCommandRouter } from '../js/text/commandRouter.js';
import { isValidGameState, validateGameState } from '../js/text/systems/validation.js';


test('tokenize preserves quoted arguments', () => {
    assert.deepEqual(tokenize('inspect "Brush Hare" --detail=full'), ['inspect', 'Brush Hare', '--detail=full']);
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

    assert.match(router('inspect player'), /Traveler/);
    assert.match(router('validate'), /valid/);
});

test('router help advertises canonical original-world command vocabulary', () => {
    const state = createInitialState();
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });

    const help = router('help');

    assert.match(help, /powers/);
    assert.match(help, /ancestries/);
    assert.match(help, /disciplines/);
    assert.match(help, /home enter\|leave/);
    assert.match(help, /companion/);
    assert.match(help, /exits/);
    assert.doesNotMatch(help, /Mog House/);
    assert.doesNotMatch(help, /FFXI-style/);
});
