import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { clearSave, saveGame } from '../js/text/save.js';
import { createSlashCommandRouter } from '../js/text/slashCommandRouter.js';

class MemoryStorage {
    constructor() {
        this.values = new Map();
    }

    getItem(key) {
        return this.values.has(key) ? this.values.get(key) : null;
    }

    setItem(key, value) {
        this.values.set(key, String(value));
    }

    removeItem(key) {
        this.values.delete(key);
    }
}

function createRouterWithState() {
    globalThis.localStorage = new MemoryStorage();
    const state = createInitialState();
    const router = createSlashCommandRouter(state, {
        saveGame,
        clearSave,
        reload: () => {},
    });
    return { state, router };
}

test('slash router rejects bare gameplay commands outside character creation prompts', () => {
    const { router } = createRouterWithState();

    assert.match(router('look'), /slash prefix/);
});

test('slash router exposes menu and command help', () => {
    const { router } = createRouterWithState();

    assert.match(router('/menu'), /Main Menu/);
    assert.match(router('/help'), /Slash commands/);
    assert.match(router('/commands'), /\/newcharacter/);
});

test('slash router forwards slash gameplay commands to engine router', () => {
    const { router } = createRouterWithState();

    assert.match(router('/look'), /Southern San/);
    assert.match(router('/stats'), /Attributes/);
});

test('slash router preserves FFXI macro-style slash commands for the adapter', () => {
    const { router } = createRouterWithState();

    assert.match(router('/macrohelp'), /FFXI Macro\/Text Command Reference/);
    assert.match(router('/ma Cure'), /You are not in battle/);
    assert.match(router('/ws "Fast Blade"'), /You are not in battle/);
    assert.match(router('/item Potion'), /Item command accepted/);
});

test('slash router supports account character save and listing commands', () => {
    const { state, router } = createRouterWithState();
    state.player.identity.name = 'Slashsave';

    assert.match(router('/save'), /Character saved/);
    assert.match(router('/characters'), /Slashsave/);
    assert.match(router('/account'), /Characters: 1/);
    assert.match(router('/load 1'), /Loaded Slashsave/);
});

test('slash router allows natural answers during creator prompts and saves after confirmation', () => {
    const { router } = createRouterWithState();

    assert.match(router('/newcharacter'), /What is your character name/);
    assert.match(router('Prompted'), /Choose starting nation/);
    assert.match(router('sandoria'), /Choose race/);
    assert.match(router('hume'), /Choose sex/);
    assert.match(router('male'), /Choose starting job/);
    assert.match(router('warrior'), /Confirm character/);
    assert.match(router('yes'), /Character saved/);
    assert.match(router('/characters'), /Prompted/);
});