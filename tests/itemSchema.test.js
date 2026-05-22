import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { addItemToContainer, describeContainerContents, transferItemBetweenContainers } from '../js/text/systems/inventoryEngine.js';
import { canStackItems, normalizeItem } from '../js/text/data/itemSchema.js';

function potion(quantity = 1) {
    return { id: 'potion', name: 'Potion', kind: 'consumable', quantity, tags: ['consumable'] };
}

function bronzeSword() {
    return { id: 'bronze-sword', name: 'Bronze Sword', kind: 'equipment', quantity: 1, tags: ['weapon', 'sword'] };
}

test('normalizeItem adds stack metadata for stackable kinds', () => {
    const item = normalizeItem(potion(3));

    assert.equal(item.stackable, true);
    assert.equal(item.quantity, 3);
    assert.equal(item.maxStack, 99);
});

test('normalizeItem keeps equipment non-stackable', () => {
    const item = normalizeItem(bronzeSword());

    assert.equal(item.stackable, false);
    assert.equal(item.maxStack, 1);
});

test('canStackItems requires same id kind and stackable state', () => {
    assert.equal(canStackItems(normalizeItem(potion()), normalizeItem(potion())), true);
    assert.equal(canStackItems(normalizeItem(bronzeSword()), normalizeItem(bronzeSword())), false);
    assert.equal(canStackItems(normalizeItem(potion()), normalizeItem({ ...potion(), id: 'hi-potion' })), false);
});

test('addItemToContainer stacks matching consumables without consuming capacity slots', () => {
    const state = createInitialState();
    const inventoryState = state.player.inventoryState;

    assert.equal(addItemToContainer(inventoryState, 'inventory', potion(2)).ok, true);
    assert.equal(addItemToContainer(inventoryState, 'inventory', potion(3)).ok, true);

    assert.equal(inventoryState.containers.inventory.items.length, 1);
    assert.equal(inventoryState.containers.inventory.items[0].quantity, 5);
    assert.match(describeContainerContents(state, 'inventory'), /Potion x5/);
});

test('addItemToContainer does not stack equipment', () => {
    const state = createInitialState();
    const inventoryState = state.player.inventoryState;

    assert.equal(addItemToContainer(inventoryState, 'inventory', bronzeSword()).ok, true);
    assert.equal(addItemToContainer(inventoryState, 'inventory', bronzeSword()).ok, true);

    assert.equal(inventoryState.containers.inventory.items.length, 2);
});

test('addItemToContainer rejects split stack overflow when container is full', () => {
    const state = createInitialState();
    const inventoryState = state.player.inventoryState;
    inventoryState.containers.inventory.items.push(normalizeItem({ ...potion(98), maxStack: 99 }));
    for (let index = 1; index < 30; index += 1) {
        inventoryState.containers.inventory.items.push(normalizeItem({ id: `filler-${index}`, name: `Filler ${index}`, kind: 'misc', stackable: false }));
    }

    const result = addItemToContainer(inventoryState, 'inventory', potion(2));

    assert.equal(result.ok, false);
    assert.match(result.reason, /Inventory is full/);
    assert.equal(inventoryState.containers.inventory.items[0].quantity, 98);
});

test('transferItemBetweenContainers stacks into destination when possible', () => {
    const state = createInitialState();
    const inventoryState = state.player.inventoryState;
    addItemToContainer(inventoryState, 'inventory', potion(2));
    addItemToContainer(inventoryState, 'mogSafe', potion(3), { isInMogHouse: true });
    inventoryState.mogHouse.isInMogHouse = true;

    assert.match(transferItemBetweenContainers(state, 'Potion', 'inventory', 'mogSafe'), /Transferred Potion/);
    assert.equal(inventoryState.containers.mogSafe.items.length, 1);
    assert.equal(inventoryState.containers.mogSafe.items[0].quantity, 5);
});
