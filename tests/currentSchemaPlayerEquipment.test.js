import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import {
    createAccountWithPassword,
    decodePayload,
    encodePayload,
    loadCharacter,
    saveGame,
} from '../js/text/save.js';
import { equipItem } from '../js/text/systems/equipmentEngine.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() { globalThis.localStorage = new MemoryStorage(); }

function equipBronzeSword(state) {
    addItemToContainer(state.player.inventoryState, 'inventory', {
        id: 'bronze-sword', name: 'Bronze Sword', kind: 'equipment', quantity: 1, tags: ['weapon', 'sword', 'starter'],
    });
    assert.match(equipItem(state, 'Bronze Sword'), /Equipped Bronze Sword to mainHand/);
}

test('current schema accepts a non-empty canonical equipped loadout', () => {
    const state = createInitialState();
    equipBronzeSword(state);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema accepts stackable ammunition in the canonical ammo slot', () => {
    const state = createInitialState();
    addItemToContainer(state.player.inventoryState, 'inventory', {
        id: 'rounded-sling-stones',
        name: 'Rounded Sling Stones',
        kind: 'equipment',
        family: 'ammunition',
        equipmentSlot: 'ammo',
        allowedSlots: ['ammo'],
        weaponCategory: 'sling',
        quantity: 7,
        stackable: true,
        maxStack: 99,
        tags: ['equipment', 'ammo', 'sling-stone'],
        flags: ['equipmentOnly', 'ammo'],
    });
    assert.match(equipItem(state, 'Rounded Sling Stones'), /Equipped Rounded Sling Stones to ammo/);
    assert.equal(state.player.equipment.ammo.quantity, 7);
    assert.equal(state.player.equipment.ammo.stackable, true);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects missing unknown malformed and slot-incompatible equipment', () => {
    const missingSlot = createInitialState();
    delete missingSlot.player.equipment.head;
    assert.ok(validateCurrentGameStateStructure(missingSlot).some((issue) => issue.includes('player.equipment.head is missing')));

    const unknownSlot = createInitialState();
    unknownSlot.player.equipment.legacySlot = null;
    assert.ok(validateCurrentGameStateStructure(unknownSlot).some((issue) => issue.includes('legacySlot is not a canonical equipment slot')));

    const wrongKind = createInitialState();
    equipBronzeSword(wrongKind);
    wrongKind.player.equipment.mainHand.kind = 'consumable';
    assert.ok(validateCurrentGameStateStructure(wrongKind).some((issue) => issue.includes('player.equipment.mainHand.kind must be equipment')));

    const wrongSlot = createInitialState();
    equipBronzeSword(wrongSlot);
    wrongSlot.player.equipment.head = wrongSlot.player.equipment.mainHand;
    wrongSlot.player.equipment.mainHand = null;
    assert.ok(validateCurrentGameStateStructure(wrongSlot).some((issue) => issue.includes('occupied slot head')));
});

test('current schema rejects impossible two-handed main and off-hand persistence', () => {
    const state = createInitialState();
    addItemToContainer(state.player.inventoryState, 'inventory', {
        id: 'ash-staff', name: 'Ash Staff', kind: 'equipment', quantity: 1, tags: ['weapon', 'staff', 'starter'],
    });
    assert.match(equipItem(state, 'Ash Staff'), /Equipped Ash Staff to mainHand/);
    state.player.equipment.offHand = { ...state.player.equipment.mainHand, id: 'impossible-offhand', name: 'Impossible Offhand', flags: [] };
    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('offHand must be empty while a two-handed mainHand item is equipped')));
});

test('non-empty equipped loadout survives real current save and load', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Equipment Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = createInitialState();
    state.player.identity.name = 'Loadout';
    equipBronzeSword(state);
    const expected = structuredClone(state.player.equipment);

    assert.equal(saveGame(state), true);
    const loaded = loadCharacter('Loadout');
    assert.ok(loaded);
    assert.deepEqual(loaded.player.equipment, expected);
});

test('load rejects malformed persisted equipment without normalizing or moving it', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Strict Equipment Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = createInitialState();
    state.player.identity.name = 'Badloadout';
    equipBronzeSword(state);
    assert.equal(saveGame(state), true);

    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters[0];
    const malformed = decodePayload(record.encodedState);
    malformed.player.equipment.mainHand.quantity = 2;
    record.encodedState = encodePayload(malformed);
    globalThis.localStorage.setItem(key, encodePayload(registry));

    assert.equal(loadCharacter('Badloadout'), null);
    const unchangedRegistry = decodePayload(globalThis.localStorage.getItem(key));
    const unchanged = decodePayload(unchangedRegistry.accounts[0].characters[0].encodedState);
    assert.equal(unchanged.player.equipment.mainHand.quantity, 2);
});
