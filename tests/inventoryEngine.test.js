import test from 'node:test';
import assert from 'node:assert/strict';

import { createCommandRouter } from '../js/text/commandRouter.js';
import { createInitialState } from '../js/text/gameState.js';
import {
    addItemToContainer,
    canStoreItemInContainer,
    describeContainerContents,
    describeInventoryContainers,
    getContainerCapacity,
    isContainerAccessible,
    setMogHouseAccess,
} from '../js/text/systems/inventoryEngine.js';
import { validateGameState } from '../js/text/systems/validation.js';


test('player starts with structured inventory containers', () => {
    const state = createInitialState();
    const inventoryState = state.player.inventoryState;

    assert.ok(inventoryState.containers.inventory);
    assert.ok(inventoryState.containers.mogSafe);
    assert.ok(inventoryState.containers.storage);
    assert.ok(inventoryState.containers.wardrobe1);
    assert.equal(state.player.inventory, inventoryState.containers.inventory.items);
    assert.deepEqual(validateGameState(state), []);
});

test('Mog House storage accessibility follows context', () => {
    const state = createInitialState();
    const inventoryState = state.player.inventoryState;

    assert.equal(isContainerAccessible(inventoryState, 'storage'), false);
    assert.equal(isContainerAccessible(inventoryState, 'mogSafe'), false);
    setMogHouseAccess(state, true);
    assert.equal(isContainerAccessible(inventoryState, 'storage'), true);
    assert.equal(isContainerAccessible(inventoryState, 'mogSafe'), true);
});

test('furniture controls storage capacity', () => {
    const state = createInitialState();
    const capacity = getContainerCapacity(state.player.inventoryState, 'storage');

    assert.equal(capacity, 3);
});

test('portable containers and wardrobes follow unlock and item-kind rules', () => {
    const state = createInitialState();
    const inventoryState = state.player.inventoryState;

    assert.equal(isContainerAccessible(inventoryState, 'mogSatchel'), false);
    assert.equal(isContainerAccessible(inventoryState, 'wardrobe1'), true);
    assert.equal(canStoreItemInContainer(inventoryState, 'wardrobe1', { id: 'potion', name: 'Potion', kind: 'consumable' }).ok, false);
    assert.equal(canStoreItemInContainer(inventoryState, 'wardrobe1', { id: 'bronze-sword', name: 'Bronze Sword', kind: 'equipment' }).ok, true);
});

test('addItemToContainer respects access and capacity rules', () => {
    const state = createInitialState();
    const inventoryState = state.player.inventoryState;

    assert.equal(addItemToContainer(inventoryState, 'mogSafe', { id: 'potion', name: 'Potion', kind: 'consumable' }).ok, false);
    setMogHouseAccess(state, true);
    assert.equal(addItemToContainer(inventoryState, 'mogSafe', { id: 'potion', name: 'Potion', kind: 'consumable' }).ok, true);
    assert.match(describeContainerContents(state, 'mogSafe'), /Potion/);
});

test('router exposes container and moghouse commands', () => {
    const state = createInitialState();
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });

    assert.match(router('containers'), /Inventory Containers/);
    assert.match(router('container storage'), /Storage/);
    assert.match(router('moghouse enter'), /entered/);
    assert.match(router('containers'), /Mog Safe.*accessible/s);
});
