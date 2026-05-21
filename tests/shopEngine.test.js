import test from 'node:test';
import assert from 'node:assert/strict';

import { createCommandRouter } from '../js/text/commandRouter.js';
import { createInitialState } from '../js/text/gameState.js';
import { getPoisForPlace } from '../js/text/data/pointsOfInterest.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { buyFromCurrentShop } from '../js/text/systems/shopEngine.js';

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
    assert.match(router('sell Bronze Sword'), /Selling is not implemented/);
});
