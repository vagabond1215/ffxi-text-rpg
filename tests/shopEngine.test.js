import test from 'node:test';
import assert from 'node:assert/strict';

import { createCommandRouter } from '../js/text/commandRouter.js';
import { createInitialState } from '../js/text/gameState.js';
import { getPoisForPlace } from '../js/text/data/pointsOfInterest.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { buyFromCurrentShop, sellToCurrentShop } from '../js/text/systems/shopEngine.js';

function moveToAshene(state) {
    const ashene = getPoisForPlace('southern-sandoria').find((poi) => poi.name === 'Ashene');
    setPositionAndDiscover(state, 'southern-sandoria', ashene.coordinate);
    return ashene;
}

test('buyFromCurrentShop spends gil and adds item to inventory', () => {
    const state = createInitialState();
    moveToAshene(state);
    state.player.wallet.gil = 100;

    const result = buyFromCurrentShop(state, 'Bronze Sword');

    assert.match(result, /Bought Bronze Sword/);
    assert.equal(state.player.wallet.gil, 24);
    assert.equal(state.player.inventory.length, 1);
    assert.equal(state.player.inventory[0].id, 'bronze-sword');
    assert.equal(state.player.inventory[0].kind, 'equipment');
});

test('buyFromCurrentShop rejects insufficient gil', () => {
    const state = createInitialState();
    moveToAshene(state);
    state.player.wallet.gil = 10;

    const result = buyFromCurrentShop(state, 'Bronze Sword');

    assert.match(result, /Not enough gil/);
    assert.equal(state.player.inventory.length, 0);
});

test('buyFromCurrentShop rejects missing shop context', () => {
    const state = createInitialState();
    setPositionAndDiscover(state, 'southern-sandoria', { x: 0, y: 0 });
    state.player.wallet.gil = 1000;

    assert.match(buyFromCurrentShop(state, 'Bronze Sword'), /no matching shop/i);
});

test('buyFromCurrentShop respects inventory capacity', () => {
    const state = createInitialState();
    moveToAshene(state);
    state.player.wallet.gil = 10000;
    const inventory = state.player.inventoryState.containers.inventory.items;
    for (let index = 0; index < 30; index += 1) {
        inventory.push({ id: `filler-${index}`, name: `Filler ${index}`, kind: 'misc', quantity: 1 });
    }

    const result = buyFromCurrentShop(state, 'Bronze Sword');

    assert.match(result, /Inventory is full/);
    assert.equal(inventory.length, 30);
});

test('sellToCurrentShop rejects noSell item without mutating inventory or gil', () => {
    const state = createInitialState();
    moveToAshene(state);
    state.player.wallet.gil = 10;
    addItemToContainer(state.player.inventoryState, 'inventory', {
        id: 'royal-keepsake',
        name: 'Royal Keepsake',
        kind: 'misc',
        valueGil: 100,
        flags: ['noSell'],
    });

    const result = sellToCurrentShop(state, 'Royal Keepsake');

    assert.match(result, /noSell/);
    assert.equal(state.player.wallet.gil, 10);
    assert.equal(state.player.inventory.length, 1);
});

test('sellToCurrentShop rejects key items', () => {
    const state = createInitialState();
    moveToAshene(state);
    addItemToContainer(state.player.inventoryState, 'inventory', {
        id: 'gate-pass',
        name: 'Gate Pass',
        kind: 'keyItem',
        valueGil: 100,
    });

    const result = sellToCurrentShop(state, 'Gate Pass');

    assert.match(result, /key item/i);
    assert.equal(state.player.inventory.length, 1);
});

test('sellToCurrentShop rejects zero-value items unless explicitly allowed', () => {
    const state = createInitialState();
    moveToAshene(state);
    state.player.wallet.gil = 5;
    addItemToContainer(state.player.inventoryState, 'inventory', {
        id: 'weathered-note',
        name: 'Weathered Note',
        kind: 'misc',
        valueGil: 0,
    });

    const result = sellToCurrentShop(state, 'Weathered Note');

    assert.match(result, /no vendor value/i);
    assert.equal(state.player.wallet.gil, 5);
    assert.equal(state.player.inventory.length, 1);
});

test('sellToCurrentShop removes one stack item by default and adds gil after removal', () => {
    const state = createInitialState();
    moveToAshene(state);
    state.player.wallet.gil = 10;
    addItemToContainer(state.player.inventoryState, 'inventory', {
        id: 'wild-rabbit-hide',
        name: 'Wild Rabbit Hide',
        kind: 'material',
        quantity: 3,
        valueGil: 8,
    });

    const result = sellToCurrentShop(state, 'Wild Rabbit Hide');

    assert.match(result, /Sold Wild Rabbit Hide for 4 gil/);
    assert.match(result, /Gil now: 14/);
    assert.equal(state.player.inventory.length, 1);
    assert.equal(state.player.inventory[0].quantity, 2);
    assert.equal(state.player.wallet.gil, 14);
});

test('sellToCurrentShop does not add gil when quantity removal fails', () => {
    const state = createInitialState();
    moveToAshene(state);
    state.player.wallet.gil = 10;
    addItemToContainer(state.player.inventoryState, 'inventory', {
        id: 'wild-rabbit-hide',
        name: 'Wild Rabbit Hide',
        kind: 'material',
        quantity: 2,
        valueGil: 8,
    });

    const result = sellToCurrentShop(state, 'Wild Rabbit Hide 5');

    assert.match(result, /Only 2 Wild Rabbit Hide available/);
    assert.equal(state.player.wallet.gil, 10);
    assert.equal(state.player.inventory.length, 1);
    assert.equal(state.player.inventory[0].quantity, 2);
});

test('sellToCurrentShop requires a current shop POI', () => {
    const state = createInitialState();
    state.player.wallet.gil = 10;
    addItemToContainer(state.player.inventoryState, 'inventory', {
        id: 'wild-rabbit-hide',
        name: 'Wild Rabbit Hide',
        kind: 'material',
        quantity: 1,
        valueGil: 8,
    });

    const result = sellToCurrentShop(state, 'Wild Rabbit Hide');

    assert.match(result, /no matching shop/i);
    assert.equal(state.player.wallet.gil, 10);
    assert.equal(state.player.inventory.length, 1);
});

test('router exposes buy and sell commands', () => {
    const state = createInitialState();
    moveToAshene(state);
    state.player.wallet.gil = 100;
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });

    assert.match(router('shop Ashene'), /Bronze Sword/);
    assert.match(router('buy Bronze Sword'), /Bought Bronze Sword/);
    assert.match(router('inventory'), /Bronze Sword/);
    assert.match(router('sell Bronze Sword'), /Sold Bronze Sword for 38 gil/);
    assert.match(router('inventory'), /empty/);
});
