import test from 'node:test';
import assert from 'node:assert/strict';

import { getCanonicalItem, getCanonicalItemAuthority } from '../js/text/data/canonicalItemRegistry.js';
import { getEquipmentCatalogEntry } from '../js/text/data/equipmentCatalog.js';
import {
    getProductionDefinition,
    validateProductionCatalog,
} from '../js/text/data/productionCatalog.js';
import { getProductionItem } from '../js/text/data/productionItems.js';
import {
    getRegionalContentPack,
    listRegionalContentPacks,
} from '../js/text/data/regionalContentPacks.js';
import {
    listStarterCasterOffhandProcessDefinitions,
} from '../js/text/data/starterCasterOffhandProductionCatalog.js';
import { createNewGameState } from '../js/text/gameState.js';
import {
    createAccountWithPassword,
    loadActiveCharacter,
    saveGame,
} from '../js/text/save.js';
import { validateContentPacks } from '../js/text/systems/contentPackValidator.js';
import { equipItem } from '../js/text/systems/equipmentEngine.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import {
    reconcileProductionWork,
    startProductionWork,
} from '../js/text/systems/productionEngine.js';
import { calculateCombatProfile } from '../js/text/systems/statEngine.js';
import { getMeleeCadenceProfile } from '../js/text/systems/weaponCadenceEngine.js';
import { gainWorkProficiency } from '../js/text/systems/workProficiencyEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

const EQUIPMENT_IDS = Object.freeze([
    'ash-staff',
    'maple-wand',
    'iron-buckler',
    'brass-ring',
]);

const RECIPE_IDS = Object.freeze([
    'craft-ash-staff',
    'craft-maple-wand',
    'craft-iron-buckler',
    'craft-brass-ring',
]);

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
    clear() { this.values.clear(); }
}

function installStorage() {
    globalThis.localStorage = new MemoryStorage();
}

function addCanonicalItem(state, itemId, quantity = 1) {
    const item = getCanonicalItem(itemId);
    assert.ok(item, `missing canonical item ${itemId}`);
    const result = addItemToContainer(state.player.inventoryState, 'inventory', { ...item, quantity });
    assert.equal(result.ok, true, result.reason);
}

function completeProduction(state, processId, options = {}) {
    const started = startProductionWork(state, processId, options);
    assert.equal(started.ok, true, started.display?.text);
    advanceWorldTime(state, started.data.task.durationSeconds);
    const results = reconcileProductionWork(state);
    const completed = results.find((entry) => entry.data?.work?.data?.processId === processId) ?? results[0];
    assert.ok(completed, `expected completion for ${processId}`);
    assert.equal(completed.ok, true, completed.display?.text);
    return { started, completed };
}

function prepareProficiencies(state) {
    gainWorkProficiency(state, 'crafting', 3);
    gainWorkProficiency(state, 'metalworking', 4);
}

function addWoodRecipeInputs(state) {
    addCanonicalItem(state, 'item-elderwood-ash-timber');
    addCanonicalItem(state, 'item-material-hemp-twine');
    addCanonicalItem(state, 'item-material-hide-glue', 2);
    addCanonicalItem(state, 'item-material-maple-fine-board');
    addCanonicalItem(state, 'item-material-brass-sheet');
}

function addMetalRecipeInputs(state) {
    addCanonicalItem(state, 'item-redstone-tempered-iron-bar');
    addCanonicalItem(state, 'item-redstone-rivet-set');
    addCanonicalItem(state, 'item-material-hemp-cord');
    addCanonicalItem(state, 'item-material-brass-ingot');
}

test('A3 owns exactly four existing starter equipment identities and four recipes without duplicate item authority', () => {
    assert.equal(listStarterCasterOffhandProcessDefinitions().length, 4);
    assert.deepEqual(validateProductionCatalog(), []);
    assert.deepEqual(validateContentPacks(listRegionalContentPacks()), []);

    for (const [index, recipeId] of RECIPE_IDS.entries()) {
        const equipmentId = EQUIPMENT_IDS[index];
        const recipe = getProductionDefinition(recipeId);
        assert.ok(recipe, `missing recipe ${recipeId}`);
        assert.deepEqual(recipe.outputs, [{ itemId: equipmentId, quantity: 1 }]);
        assert.equal(getCanonicalItemAuthority(equipmentId), 'equipment');
        assert.ok(getEquipmentCatalogEntry(equipmentId));
        assert.equal(getProductionItem(equipmentId), null, `${equipmentId} must not be duplicated in productionItems`);
        for (const input of recipe.inputs) assert.ok(getCanonicalItem(input.itemId), `${recipeId} missing input ${input.itemId}`);
    }

    const pack = getRegionalContentPack('pack-starter-caster-offhand-equipment');
    assert.ok(pack);
    assert.deepEqual(pack.dependencies, [
        'pack-shared-foundation',
        'pack-material-foundations-common-components',
        'pack-redstone-forge-road',
    ]);
    assert.deepEqual(pack.records.items.map((entry) => entry.id), EQUIPMENT_IDS);
    assert.deepEqual(pack.records.recipes.map((entry) => entry.id), RECIPE_IDS);
});

test('A3 recipes reuse established wood alloy binding and Redstone iron supply chains', () => {
    const staff = getProductionDefinition('craft-ash-staff');
    assert.deepEqual(staff.inputs.map((entry) => [entry.itemId, entry.quantity]), [
        ['item-elderwood-ash-timber', 1],
        ['item-material-hemp-twine', 1],
        ['item-material-hide-glue', 1],
    ]);
    assert.deepEqual(staff.requiredToolTags, ['cutting']);
    assert.deepEqual(staff.requiredStationTags, ['woodshop']);

    const wand = getProductionDefinition('craft-maple-wand');
    assert.deepEqual(wand.inputs.map((entry) => [entry.itemId, entry.quantity]), [
        ['item-material-maple-fine-board', 1],
        ['item-material-brass-sheet', 1],
        ['item-material-hide-glue', 1],
    ]);
    assert.deepEqual(wand.requiredToolTags, ['cutting']);
    assert.deepEqual(wand.requiredStationTags, ['woodshop']);

    const buckler = getProductionDefinition('craft-iron-buckler');
    assert.deepEqual(buckler.inputs.map((entry) => [entry.itemId, entry.quantity]), [
        ['item-redstone-tempered-iron-bar', 1],
        ['item-redstone-rivet-set', 1],
        ['item-material-hemp-cord', 1],
    ]);
    assert.deepEqual(buckler.requiredStationTags, ['forge']);

    const ring = getProductionDefinition('craft-brass-ring');
    assert.deepEqual(ring.inputs.map((entry) => [entry.itemId, entry.quantity]), [
        ['item-material-brass-ingot', 1],
    ]);
    assert.deepEqual(ring.requiredStationTags, ['forge']);
});

test('A1 crafted Field Knife binds into both A3 wood-equipment recipes', () => {
    const state = createNewGameState();
    prepareProficiencies(state);

    for (const itemId of [
        'item-material-steel-blade-blank',
        'item-material-ash-handle-blank',
        'item-material-iron-ferrule-socket-set',
    ]) addCanonicalItem(state, itemId);

    completeProduction(state, 'craft-field-knife', { stationTags: ['forge'] });
    assert.match(equipItem(state, 'Field Knife'), /Equipped Field Knife/);

    addWoodRecipeInputs(state);

    const staffWork = completeProduction(state, 'craft-ash-staff', { stationTags: ['woodshop'] });
    assert.equal(staffWork.started.data.work.data.toolBindings[0].itemId, 'field-knife');
    assert.equal(staffWork.started.data.work.data.toolBindings[0].sourceType, 'equipment');

    const wandWork = completeProduction(state, 'craft-maple-wand', { stationTags: ['woodshop'] });
    assert.equal(wandWork.started.data.work.data.toolBindings[0].itemId, 'field-knife');
    assert.equal(wandWork.started.data.work.data.toolBindings[0].sourceType, 'equipment');

    assert.equal(state.player.inventory.find((item) => item.id === 'ash-staff')?.provenance[0].sourceId, 'craft-ash-staff');
    assert.equal(state.player.inventory.find((item) => item.id === 'maple-wand')?.provenance[0].sourceId, 'craft-maple-wand');
});

test('crafted staff wand buckler and ring exercise real two-handed offhand cadence and stat rules', () => {
    const state = createNewGameState();
    prepareProficiencies(state);

    addCanonicalItem(state, 'field-knife');
    assert.match(equipItem(state, 'Field Knife'), /Equipped Field Knife/);
    addWoodRecipeInputs(state);
    completeProduction(state, 'craft-ash-staff', { stationTags: ['woodshop'] });
    completeProduction(state, 'craft-maple-wand', { stationTags: ['woodshop'] });

    addMetalRecipeInputs(state);
    completeProduction(state, 'craft-iron-buckler', { stationTags: ['forge'] });
    completeProduction(state, 'craft-brass-ring', { stationTags: ['forge'] });

    assert.match(equipItem(state, 'Ash Staff'), /Ash Staff/);
    let cadence = getMeleeCadenceProfile(state.player);
    assert.equal(cadence.itemId, 'ash-staff');
    assert.equal(cadence.weaponFamily, 'staff');
    assert.equal(cadence.delayUnits, getEquipmentCatalogEntry('ash-staff').weaponDelay);

    const blockedBuckler = equipItem(state, 'Iron Buckler');
    assert.match(blockedBuckler, /while Ash Staff is two-handed/);
    assert.equal(state.player.equipment.offHand, null);

    assert.match(equipItem(state, 'Maple Wand'), /Maple Wand/);
    assert.match(equipItem(state, 'Iron Buckler'), /Iron Buckler/);
    assert.match(equipItem(state, 'Brass Ring'), /Brass Ring/);

    cadence = getMeleeCadenceProfile(state.player);
    assert.equal(cadence.itemId, 'maple-wand');
    assert.equal(cadence.weaponFamily, 'club');
    assert.equal(cadence.delayUnits, getEquipmentCatalogEntry('maple-wand').weaponDelay);

    const profile = calculateCombatProfile(state.player);
    assert.ok(profile.attributes.int >= 1);
    assert.ok(profile.attributes.mnd >= 1);
    assert.ok(profile.attributes.vit >= 1);
    assert.ok(profile.resources.maxMp >= 4);
    assert.ok(profile.derived.magicAccuracy >= 1);
    assert.ok(profile.derived.defense >= 3);
    assert.ok(profile.derived.shieldBlock >= 2);

    for (const itemId of ['maple-wand', 'iron-buckler', 'brass-ring']) {
        const equipped = Object.values(state.player.equipment).find((item) => item?.id === itemId);
        assert.ok(equipped, `${itemId} should be equipped`);
        assert.equal(equipped.provenance[0].action, 'craft');
    }
});

test('A3 crafted caster offhand loadout and stored Ash Staff preserve production provenance through save load', () => {
    installStorage();
    assert.equal(createAccountWithPassword('A3 Outfitter', 'pwd', { persistentLogin: true }).ok, true);

    const state = createNewGameState();
    state.player.identity.name = 'Outfitter';
    prepareProficiencies(state);

    addCanonicalItem(state, 'field-knife');
    assert.match(equipItem(state, 'Field Knife'), /Equipped Field Knife/);
    addWoodRecipeInputs(state);
    completeProduction(state, 'craft-ash-staff', { stationTags: ['woodshop'] });
    completeProduction(state, 'craft-maple-wand', { stationTags: ['woodshop'] });

    addMetalRecipeInputs(state);
    completeProduction(state, 'craft-iron-buckler', { stationTags: ['forge'] });
    completeProduction(state, 'craft-brass-ring', { stationTags: ['forge'] });

    assert.match(equipItem(state, 'Maple Wand'), /Maple Wand/);
    assert.match(equipItem(state, 'Iron Buckler'), /Iron Buckler/);
    assert.match(equipItem(state, 'Brass Ring'), /Brass Ring/);

    assert.equal(saveGame(state), true);
    const loaded = loadActiveCharacter();
    assert.ok(loaded);
    assert.equal(loaded.player.equipment.mainHand.id, 'maple-wand');
    assert.equal(loaded.player.equipment.offHand.id, 'iron-buckler');
    assert.equal(loaded.player.equipment.leftRing.id, 'brass-ring');
    assert.equal(loaded.player.equipment.mainHand.provenance[0].sourceId, 'craft-maple-wand');
    assert.equal(loaded.player.equipment.offHand.provenance[0].sourceId, 'craft-iron-buckler');
    assert.equal(loaded.player.equipment.leftRing.provenance[0].sourceId, 'craft-brass-ring');

    const staff = loaded.player.inventory.find((item) => item.id === 'ash-staff');
    assert.ok(staff);
    assert.equal(staff.provenance[0].sourceId, 'craft-ash-staff');
    assert.equal(staff.flags.includes('twoHanded'), true);
});
