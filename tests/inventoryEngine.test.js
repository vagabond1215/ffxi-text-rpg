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
    transferItemBetweenContainers,
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

test('transferItemBetweenContainers enforces Mog House access', () => {
    const state = createInitialState();
    const inventoryState = state.player.inventoryState;
    addItemToContainer(inventoryState, 'inventory', { id: 'potion', name: 'Potion', kind: 'consumable' });

    assert.match(transferItemBetweenContainers(state, 'Potion', 'inventory', 'mogSafe'), /Mog Safe is not accessible/);
    assert.equal(inventoryState.containers.inventory.items.length, 1);

    setMogHouseAccess(state, true);
    assert.match(transferItemBetweenContainers(state, 'Potion', 'inventory', 'mogSafe'), /Transferred Potion/);
    assert.equal(inventoryState.containers.inventory.items.length, 0);
    assert.equal(inventoryState.containers.mogSafe.items.length, 1);
});

test('transferItemBetweenContainers supports equipment transfer to wardrobe anywhere', () => {
    const state = createInitialState();
    const inventoryState = state.player.inventoryState;
    addItemToContainer(inventoryState, 'inventory', { id: 'bronze-sword', name: 'Bronze Sword', kind: 'equipment' });

    assert.match(transferItemBetweenContainers(state, 'Bronze Sword', 'inventory', 'wardrobe1'), /Transferred Bronze Sword/);
    assert.equal(inventoryState.containers.inventory.items.length, 0);
    assert.equal(inventoryState.containers.wardrobe1.items.length, 1);
});

test('transferItemBetweenContainers rejects consumable transfer to wardrobe', () => {
    const state = createInitialState();
    const inventoryState = state.player.inventoryState;
    addItemToContainer(inventoryState, 'inventory', { id: 'potion', name: 'Potion', kind: 'consumable' });

    assert.match(transferItemBetweenContainers(state, 'Potion', 'inventory', 'wardrobe1'), /cannot store consumable/);
    assert.equal(inventoryState.containers.inventory.items.length, 1);
    assert.equal(inventoryState.containers.wardrobe1.items.length, 0);
});

test('router exposes container transfer command', () => {
    const state = createInitialState();
    const inventoryState = state.player.inventoryState;
    addItemToContainer(inventoryState, 'inventory', { id: 'bronze-sword', name: 'Bronze Sword', kind: 'equipment' });
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });

    assert.match(router('transfer Bronze Sword from inventory to wardrobe1'), /Transferred Bronze Sword/);
    assert.match(router('container wardrobe1'), /Bronze Sword/);
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
