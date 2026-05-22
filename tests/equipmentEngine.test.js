import test from 'node:test';
import assert from 'node:assert/strict';

import { enrichEquipmentItem } from '../js/text/data/equipmentCatalog.js';
import { createCommandRouter } from '../js/text/commandRouter.js';
import { createInitialState, createNewGameState } from '../js/text/gameState.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { equipItem, inferEquipmentSlot, inspectItem, unequipItem } from '../js/text/systems/equipmentEngine.js';
import { calculateCombatProfile } from '../js/text/systems/statEngine.js';

function bronzeSword() {
    return { id: 'bronze-sword', name: 'Bronze Sword', kind: 'equipment', quantity: 1, tags: ['weapon', 'sword', 'starter'] };
}

function bronzeAxe() {
    return { id: 'bronze-axe', name: 'Bronze Axe', kind: 'equipment', quantity: 1, tags: ['weapon', 'axe', 'starter'] };
}

function bronzeCap() {
    return { id: 'bronze-cap', name: 'Bronze Cap', kind: 'equipment', quantity: 1, tags: ['armor', 'head', 'starter'] };
}

function potion() {
    return { id: 'potion', name: 'Potion', kind: 'consumable', quantity: 1, tags: ['consumable'] };
}

function craftingMaterial() {
    return { id: 'copper-ore', name: 'Copper Ore', kind: 'material', quantity: 1, tags: ['material'] };
}

function levelTwoSword() {
    return {
        id: 'training-sword',
        name: 'Training Sword',
        kind: 'equipment',
        quantity: 1,
        family: 'weapon',
        archetype: 'oneHandedWeapon',
        subtype: 'sword',
        equipmentSlot: 'mainHand',
        allowedSlots: ['mainHand'],
        requirements: { minLevel: 2, allowedJobs: ['warrior'], allowedRaces: [] },
        flags: ['equipmentOnly'],
        modifiers: { derived: { attack: 1 } },
    };
}

function tarutaruHat() {
    return {
        id: 'tarutaru-training-hat',
        name: 'Tarutaru Training Hat',
        kind: 'equipment',
        quantity: 1,
        family: 'armor',
        archetype: 'starterArmor',
        subtype: 'head',
        equipmentSlot: 'head',
        allowedSlots: ['head'],
        requirements: { minLevel: 1, allowedJobs: ['warrior'], allowedRaces: ['tarutaru'] },
        flags: ['equipmentOnly'],
        modifiers: { derived: { defense: 1 } },
    };
}

function trainingShield() {
    return {
        id: 'training-shield',
        name: 'Training Shield',
        kind: 'equipment',
        quantity: 1,
        family: 'shield',
        archetype: 'shield',
        subtype: 'shield',
        equipmentSlot: 'offHand',
        allowedSlots: ['offHand'],
        requirements: { minLevel: 1, allowedJobs: ['whiteMage'], allowedRaces: [] },
        flags: ['equipmentOnly'],
        modifiers: { derived: { defense: 1, shieldBlock: 1 } },
    };
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

test('equipItem validates active job eligibility before equipping', () => {
    const state = createNewGameState({ mainJobId: 'whiteMage' });
    const inventoryState = state.player.inventoryState;
    addItemToContainer(inventoryState, 'inventory', bronzeAxe());

    const result = equipItem(state, 'Bronze Axe');

    assert.match(result, /cannot be equipped by White Mage/);
    assert.equal(state.player.equipment.mainHand, null);
    assert.equal(inventoryState.containers.inventory.items.length, 1);
});

test('equipItem rejects low-level gear without mutating the source container', () => {
    const state = createInitialState();
    const inventoryState = state.player.inventoryState;
    addItemToContainer(inventoryState, 'inventory', levelTwoSword());

    const result = equipItem(state, 'Training Sword');

    assert.match(result, /requires level 2/);
    assert.equal(state.player.equipment.mainHand, null);
    assert.equal(inventoryState.containers.inventory.items.length, 1);
    assert.equal(inventoryState.containers.inventory.items[0].name, 'Training Sword');
});

test('equipItem rejects race-restricted gear atomically', () => {
    const state = createInitialState();
    const inventoryState = state.player.inventoryState;
    addItemToContainer(inventoryState, 'inventory', tarutaruHat());

    const result = equipItem(state, 'Tarutaru Training Hat');

    assert.match(result, /cannot be equipped by Hume/);
    assert.equal(state.player.equipment.head, null);
    assert.equal(inventoryState.containers.inventory.items.length, 1);
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

test('two-handed mainHand gear blocks incompatible offHand equips', () => {
    const state = createNewGameState({ mainJobId: 'whiteMage' });
    const inventoryState = state.player.inventoryState;
    addItemToContainer(inventoryState, 'inventory', { id: 'ash-staff', name: 'Ash Staff', kind: 'equipment', quantity: 1, tags: ['weapon', 'staff', 'starter'] });
    addItemToContainer(inventoryState, 'inventory', trainingShield());

    assert.match(equipItem(state, 'Ash Staff'), /Equipped Ash Staff to mainHand/);
    const result = equipItem(state, 'Training Shield');

    assert.match(result, /while Ash Staff is two-handed/);
    assert.equal(state.player.equipment.offHand, null);
    assert.equal(inventoryState.containers.inventory.items.some((item) => item.name === 'Training Shield'), true);
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

test('enriched equipment changes combat profile when equipped', () => {
    const state = createInitialState();
    const before = calculateCombatProfile(state.player);
    addItemToContainer(state.player.inventoryState, 'inventory', enrichEquipmentItem(bronzeSword()));

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

test('enrichEquipmentItem ignores malformed runtime list fields without spreading garbage', () => {
    const stringMalformed = enrichEquipmentItem({
        ...bronzeSword(),
        allowedSlots: 'offHand',
        latentEffects: 'latentEffect',
        enchantments: 'enchantment',
        augments: 'augment',
    });
    const objectMalformed = enrichEquipmentItem({
        ...bronzeSword(),
        allowedSlots: { slot: 'offHand' },
        latentEffects: { id: 'bad-latent' },
        enchantments: { id: 'bad-enchantment' },
        augments: { id: 'bad-augment' },
    });

    assert.deepEqual(stringMalformed.allowedSlots, ['mainHand', 'offHand']);
    assert.equal(stringMalformed.allowedSlots.includes('o'), false);
    assert.deepEqual(stringMalformed.latentEffects, []);
    assert.deepEqual(stringMalformed.enchantments, []);
    assert.deepEqual(stringMalformed.augments, []);
    assert.deepEqual(objectMalformed.allowedSlots, ['mainHand']);
    assert.equal(objectMalformed.allowedSlots.includes('[object Object]'), false);
    assert.deepEqual(objectMalformed.latentEffects, []);
    assert.deepEqual(objectMalformed.enchantments, []);
    assert.deepEqual(objectMalformed.augments, []);
});

test('item inspection shows requirements flags effects and confidence notes', () => {
    const state = createInitialState();
    addItemToContainer(state.player.inventoryState, 'inventory', bronzeSword());

    const output = inspectItem(state, 'Bronze Sword');

    assert.match(output, /Bronze Sword/);
    assert.match(output, /Allowed jobs: warrior, redMage, paladin/);
    assert.match(output, /Flags: equipmentOnly/);
    assert.match(output, /Effects:/);
    assert.match(output, /weaponDelay: placeholder/);
});

test('item inspection searches accessible non-wardrobe containers for consumables and materials', () => {
    const state = createInitialState();
    const inventoryState = state.player.inventoryState;
    inventoryState.mogHouse.isInMogHouse = true;
    addItemToContainer(inventoryState, 'mogSafe', potion());
    addItemToContainer(inventoryState, 'storage', craftingMaterial());

    const potionOutput = inspectItem(state, 'Potion');
    const materialOutput = inspectItem(state, 'Copper Ore');

    assert.match(potionOutput, /Kind: consumable/);
    assert.match(potionOutput, /Source: Mog Safe/);
    assert.match(materialOutput, /Kind: material/);
    assert.match(materialOutput, /Source: Storage/);
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
    assert.match(router('item Bronze Sword'), /Allowed jobs: warrior, redMage, paladin/);
    assert.match(router('inspect item Bronze Sword'), /Flags: equipmentOnly/);
    assert.match(router('equip Bronze Sword'), /Equipped Bronze Sword/);
    assert.match(router('equipment'), /mainHand: Bronze Sword/);
    assert.match(router('unequip mainHand to wardrobe1'), /Stored in Mog Wardrobe 1/);
    assert.match(router('container wardrobe1'), /Bronze Sword/);
});
