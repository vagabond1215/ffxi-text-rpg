import test from 'node:test';
import assert from 'node:assert/strict';

import { enrichEquipmentItem } from '../js/text/data/equipmentCatalog.js';
import { createCommandRouter } from '../js/text/commandRouter.js';
import { createInitialState } from '../js/text/gameState.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import {
    describeEquipmentRequirements,
    equipItem,
    inferEquipmentSlot,
    unequipItem,
    validateEquipmentRequirements,
} from '../js/text/systems/equipmentEngine.js';
import { switchMainJob } from '../js/text/systems/progressionEngine.js';
import { calculateCombatProfile } from '../js/text/systems/statEngine.js';

function bronzeSword() {
    return enrichEquipmentItem({ id: 'bronze-sword', name: 'Bronze Sword', kind: 'equipment', quantity: 1, tags: ['weapon', 'sword', 'starter'] });
}

function bronzeAxe() {
    return enrichEquipmentItem({ id: 'bronze-axe', name: 'Bronze Axe', kind: 'equipment', quantity: 1, tags: ['weapon', 'axe', 'starter'] });
}

function bronzeCap() {
    return enrichEquipmentItem({ id: 'bronze-cap', name: 'Bronze Cap', kind: 'equipment', quantity: 1, tags: ['armor', 'head', 'starter'] });
}

function potion() {
    return { id: 'potion', name: 'Potion', kind: 'consumable', quantity: 1, tags: ['consumable'] };
}

test('inferEquipmentSlot maps basic shop tags and explicit slot metadata to slots', () => {
    assert.equal(inferEquipmentSlot(bronzeSword()), 'mainHand');
    assert.equal(inferEquipmentSlot(bronzeCap()), 'head');
    assert.equal(inferEquipmentSlot({ ...bronzeCap(), equipmentSlot: 'body' }), 'body');
});

test('equipItem equips gear from inventory and removes it from container', () => {
    const state = createInitialState();
    const inventoryState = state.player.inventoryState;
    addItemToContainer(inventoryState, 'inventory', bronzeSword());

    const result = equipItem(state, 'Bronze Sword');

    assert.match(result, /Equipped Bronze Sword to mainHand/);
    assert.equal(state.player.equipment.mainHand.name, 'Bronze Sword');
    assert.equal(inventoryState.containers.inventory.items.length, 0);
});

test('equipItem equips gear from wardrobe', () => {
    const state = createInitialState();
    const inventoryState = state.player.inventoryState;
    addItemToContainer(inventoryState, 'wardrobe1', bronzeCap());

    const result = equipItem(state, 'Bronze Cap');

    assert.match(result, /Equipped Bronze Cap to head/);
    assert.equal(state.player.equipment.head.name, 'Bronze Cap');
    assert.equal(inventoryState.containers.wardrobe1.items.length, 0);
});

test('equipItem replaces existing gear and returns previous item to source container', () => {
    const state = createInitialState();
    const inventoryState = state.player.inventoryState;
    addItemToContainer(inventoryState, 'inventory', bronzeSword());
    addItemToContainer(inventoryState, 'inventory', bronzeAxe());
    equipItem(state, 'Bronze Sword');

    const result = equipItem(state, 'Bronze Axe');

    assert.match(result, /Replaced Bronze Sword/);
    assert.equal(state.player.equipment.mainHand.name, 'Bronze Axe');
    assert.equal(inventoryState.containers.inventory.items.length, 1);
    assert.equal(inventoryState.containers.inventory.items[0].name, 'Bronze Sword');
});

test('equipItem rejects non-equipment items without removing them', () => {
    const state = createInitialState();
    const inventoryState = state.player.inventoryState;
    addItemToContainer(inventoryState, 'inventory', potion());

    const result = equipItem(state, 'Potion');

    assert.match(result, /is not equipment/);
    assert.equal(inventoryState.containers.inventory.items.length, 1);
    assert.equal(state.player.equipment.mainHand, null);
});

test('validateEquipmentRequirements blocks invalid jobs', () => {
    const state = createInitialState();
    switchMainJob(state.player, 'monk');

    const result = validateEquipmentRequirements(state.player, bronzeSword());

    assert.equal(result.ok, false);
    assert.match(result.reason, /cannot be equipped by Monk/i);
});

test('equipItem rejects invalid jobs without mutating inventory', () => {
    const state = createInitialState();
    switchMainJob(state.player, 'monk');
    const inventoryState = state.player.inventoryState;
    addItemToContainer(inventoryState, 'inventory', bronzeSword());

    const result = equipItem(state, 'Bronze Sword');

    assert.match(result, /cannot be equipped by/i);
    assert.equal(inventoryState.containers.inventory.items.length, 1);
    assert.equal(state.player.equipment.mainHand, null);
});

test('validateEquipmentRequirements blocks insufficient level', () => {
    const state = createInitialState();
    const item = {
        ...bronzeSword(),
        requirements: {
            ...bronzeSword().requirements,
            level: 10,
        },
    };

    const result = validateEquipmentRequirements(state.player, item);

    assert.equal(result.ok, false);
    assert.match(result.reason, /requires level 10/i);
});

test('describeEquipmentRequirements summarizes requirement metadata', () => {
    const output = describeEquipmentRequirements(bronzeSword());

    assert.match(output, /Requirements:/);
    assert.match(output, /Level: 1/);
    assert.match(output, /warrior/i);
});

test('enriched equipment changes combat profile when equipped', () => {
    const state = createInitialState();
    const before = calculateCombatProfile(state.player);
    addItemToContainer(state.player.inventoryState, 'inventory', bronzeSword());

    equipItem(state, 'Bronze Sword');
    const after = calculateCombatProfile(state.player);

    assert.equal(after.derived.attack, before.derived.attack + 3);
    assert.equal(after.derived.accuracy, before.derived.accuracy + 1);
});

test('enriched armor changes defense and hp when equipped', () => {
    const state = createInitialState();
    const before = calculateCombatProfile(state.player);
    addItemToContainer(state.player.inventoryState, 'inventory', enrichEquipmentItem({ id: 'bronze-harness', name: 'Bronze Harness', kind: 'equipment', quantity: 1, tags: ['armor', 'body', 'starter'] }));

    equipItem(state, 'Bronze Harness');
    const after = calculateCombatProfile(state.player);

    assert.equal(after.derived.defense, before.derived.defense + 5);
    assert.equal(after.resources.maxHp, before.resources.maxHp + 4);
});

test('unequipItem returns gear to inventory', () => {
    const state = createInitialState();
    const inventoryState = state.player.inventoryState;
    addItemToContainer(inventoryState, 'inventory', bronzeSword());
    equipItem(state, 'Bronze Sword');

    const result = unequipItem(state, 'mainHand');

    assert.match(result, /Unequipped Bronze Sword/);
    assert.equal(state.player.equipment.mainHand, null);
    assert.equal(inventoryState.containers.inventory.items.length, 1);
});

test('unequipItem can return gear to wardrobe', () => {
    const state = createInitialState();
    const inventoryState = state.player.inventoryState;
    addItemToContainer(inventoryState, 'inventory', bronzeSword());
    equipItem(state, 'Bronze Sword');

    const result = unequipItem(state, 'mainHand', 'wardrobe1');

    assert.match(result, /Stored in Mog Wardrobe 1/);
    assert.equal(state.player.equipment.mainHand, null);
    assert.equal(inventoryState.containers.wardrobe1.items.length, 1);
});

test('router exposes equip unequip and equipSources commands', () => {
    const state = createInitialState();
    addItemToContainer(state.player.inventoryState, 'inventory', bronzeSword());
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });

    assert.match(router('equipSources'), /Equippable item sources/);
    assert.match(router('equip Bronze Sword'), /Equipped Bronze Sword/);
    assert.match(router('equipment'), /mainHand: Bronze Sword/);
    assert.match(router('unequip mainHand to wardrobe1'), /Stored in Mog Wardrobe 1/);
    assert.match(router('container wardrobe1'), /Bronze Sword/);
});