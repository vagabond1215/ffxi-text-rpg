import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { createAccountWithPassword, decodePayload, encodePayload, loadCharacter, saveGame } from '../js/text/save.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { getContainerCapacity } from '../js/text/systems/inventoryEngine.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installAccount(name) {
    globalThis.localStorage = new MemoryStorage();
    assert.equal(createAccountWithPassword(name, 'pwd', { persistentLogin: true }).ok, true);
}

function corruptStoredCharacter(characterName, mutate) {
    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters.find((entry) => entry.name === characterName);
    assert.ok(record);
    const state = decodePayload(record.encodedState);
    mutate(state);
    record.encodedState = encodePayload(state);
    globalThis.localStorage.setItem(key, encodePayload(registry));
}

function sampleItem(id = 'strict-inventory-sample') {
    return {
        id,
        name: 'Strict Inventory Sample',
        kind: 'misc',
        quantity: 1,
        stackable: false,
        maxStack: 1,
        flags: [],
        effects: [],
        provenance: [],
    };
}

test('current schema accepts non-default canonical inventory container state', () => {
    const state = createInitialState();
    const satchel = state.player.inventoryState.containers.fieldSatchel;
    satchel.unlocked = true;
    satchel.items.push(sampleItem());
    state.player.inventoryState.home.isAtHome = true;

    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects missing containers invalid unlock state and malformed home context', () => {
    const state = createInitialState();
    delete state.player.inventoryState.containers.fieldSatchel;
    state.player.inventoryState.containers.inventory.unlocked = 'yes';
    state.player.inventoryState.home.placedFurniture = null;
    state.player.inventoryState.home.isAtHome = 'home';

    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('player.inventoryState.containers.fieldSatchel is missing')));
    assert.ok(issues.some((issue) => issue.includes('player.inventoryState.containers.inventory.unlocked must be boolean')));
    assert.ok(issues.some((issue) => issue.includes('player.inventoryState.home.placedFurniture must be an array')));
    assert.ok(issues.some((issue) => issue.includes('player.inventoryState.home.isAtHome must be boolean')));
});

test('current schema rejects a persisted container that exceeds canonical capacity', () => {
    const state = createInitialState();
    const satchel = state.player.inventoryState.containers.fieldSatchel;
    const capacity = getContainerCapacity(state.player.inventoryState, 'fieldSatchel');
    satchel.items = Array.from({ length: capacity + 1 }, (_, index) => sampleItem(`overflow-${index}`));

    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('player.inventoryState.containers.fieldSatchel exceeds capacity')));
});

test('non-empty portable inventory state survives current save and load', () => {
    installAccount('Inventory Registry');
    const state = createInitialState();
    state.player.identity.name = 'Packkeeper';
    const satchel = state.player.inventoryState.containers.fieldSatchel;
    satchel.unlocked = true;
    satchel.items.push(sampleItem('portable-proof'));
    assert.equal(saveGame(state), true);

    const loaded = loadCharacter('Packkeeper');
    assert.ok(loaded);
    assert.equal(loaded.player.inventoryState.containers.fieldSatchel.unlocked, true);
    assert.equal(loaded.player.inventoryState.containers.fieldSatchel.items[0].id, 'portable-proof');
    assert.deepEqual(validateCurrentGameStateStructure(loaded, { requireMeta: true }), []);
});

test('load rejects malformed current inventory state without rebuilding a missing container', () => {
    installAccount('Strict Inventory Registry');
    const state = createInitialState();
    state.player.identity.name = 'Containerkeeper';
    assert.equal(saveGame(state), true);
    corruptStoredCharacter('Containerkeeper', (stored) => {
        delete stored.player.inventoryState.containers.fieldSatchel;
    });

    assert.equal(loadCharacter('Containerkeeper'), null);
    const registry = decodePayload(globalThis.localStorage.getItem('hearthHorizonAccounts'));
    const unchanged = decodePayload(registry.accounts[0].characters[0].encodedState);
    assert.equal(Object.hasOwn(unchanged.player.inventoryState.containers, 'fieldSatchel'), false);
});
