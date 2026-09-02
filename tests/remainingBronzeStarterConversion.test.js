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
    listRemainingBronzeStarterProcessDefinitions,
} from '../js/text/data/remainingBronzeStarterProductionCatalog.js';
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

const A4_EQUIPMENT_IDS = Object.freeze([
    'bronze-axe',
    'bronze-dagger',
    'bronze-pick',
    'bronze-subligar',
    'bronze-mittens',
]);

const A4_RECIPE_IDS = Object.freeze([
    'craft-bronze-axe',
    'craft-bronze-dagger',
    'craft-bronze-pick',
    'craft-bronze-subligar',
    'craft-bronze-mittens',
]);

const COMPLETE_BRONZE_PACK_ITEMS = Object.freeze([
    'bronze-sword',
    'bronze-cap',
    'bronze-harness',
    ...A4_EQUIPMENT_IDS,
]);

const COMPLETE_BRONZE_PACK_RECIPES = Object.freeze([
    'craft-bronze-sword',
    'craft-bronze-cap',
    'craft-bronze-harness',
    ...A4_RECIPE_IDS,
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

function prepareMetalworking(state) {
    gainWorkProficiency(state, 'metalworking', 4);
}

function addWeaponInputs(state) {
    addCanonicalItem(state, 'item-material-bronze-ingot', 3);
    addCanonicalItem(state, 'item-material-ash-handle-blank', 3);
    addCanonicalItem(state, 'item-material-hemp-twine', 2);
    addCanonicalItem(state, 'item-material-iron-ferrule-socket-set');
}

function addArmorInputs(state) {
    addCanonicalItem(state, 'item-material-bronze-sheet', 2);
    addCanonicalItem(state, 'item-material-hemp-canvas', 2);
    addCanonicalItem(state, 'item-material-iron-buckle-ring-set');
}

test('A4 adds exactly five recipes while extending the existing starter bronze Pack v2 authority', () => {
    assert.equal(listRemainingBronzeStarterProcessDefinitions().length, 5);
    assert.deepEqual(validateProductionCatalog(), []);
    assert.deepEqual(validateContentPacks(listRegionalContentPacks()), []);

    for (const [index, recipeId] of A4_RECIPE_IDS.entries()) {
        const equipmentId = A4_EQUIPMENT_IDS[index];
        const recipe = getProductionDefinition(recipeId);
        assert.ok(recipe, `missing recipe ${recipeId}`);
        assert.deepEqual(recipe.outputs, [{ itemId: equipmentId, quantity: 1 }]);
        assert.equal(getCanonicalItemAuthority(equipmentId), 'equipment');
        assert.ok(getEquipmentCatalogEntry(equipmentId));
        assert.equal(getProductionItem(equipmentId), null, `${equipmentId} must not be duplicated in productionItems`);
        for (const input of recipe.inputs) assert.ok(getCanonicalItem(input.itemId), `${recipeId} missing input ${input.itemId}`);
    }

    const pack = getRegionalContentPack('pack-starter-bronze-martial-equipment');
    assert.ok(pack);
    assert.deepEqual(pack.records.items.map((entry) => entry.id), COMPLETE_BRONZE_PACK_ITEMS);
    assert.deepEqual(pack.records.recipes.map((entry) => entry.id), COMPLETE_BRONZE_PACK_RECIPES);
    assert.equal(getRegionalContentPack('pack-remaining-bronze-starter-equipment'), null, 'A4 must not fragment bronze ownership into a second pack');
});

test('A4 recipes reuse the established bronze handle textile and hardware graph', () => {
    assert.deepEqual(getProductionDefinition('craft-bronze-axe').inputs.map((entry) => [entry.itemId, entry.quantity]), [
        ['item-material-bronze-ingot', 1],
        ['item-material-ash-handle-blank', 1],
        ['item-material-hemp-twine', 1],
    ]);
    assert.deepEqual(getProductionDefinition('craft-bronze-dagger').inputs.map((entry) => [entry.itemId, entry.quantity]), [
        ['item-material-bronze-ingot', 1],
        ['item-material-ash-handle-blank', 1],
        ['item-material-hemp-twine', 1],
    ]);
    assert.deepEqual(getProductionDefinition('craft-bronze-pick').inputs.map((entry) => [entry.itemId, entry.quantity]), [
        ['item-material-bronze-ingot', 1],
        ['item-material-ash-handle-blank', 1],
        ['item-material-iron-ferrule-socket-set', 1],
    ]);
    assert.deepEqual(getProductionDefinition('craft-bronze-subligar').inputs.map((entry) => [entry.itemId, entry.quantity]), [
        ['item-material-bronze-sheet', 1],
        ['item-material-hemp-canvas', 1],
        ['item-material-iron-buckle-ring-set', 1],
    ]);
    assert.deepEqual(getProductionDefinition('craft-bronze-mittens').inputs.map((entry) => [entry.itemId, entry.quantity]), [
        ['item-material-bronze-sheet', 1],
        ['item-material-hemp-canvas', 1],
    ]);
    assert.deepEqual(getProductionDefinition('craft-bronze-subligar').requiredToolTags, ['cutting']);
    assert.deepEqual(getProductionDefinition('craft-bronze-mittens').requiredToolTags, ['cutting']);
});

test('crafted Bronze Axe Dagger and Pick retain distinct canonical weapon cadence while Bronze Pick remains non-mining', () => {
    const state = createNewGameState();
    prepareMetalworking(state);
    addWeaponInputs(state);

    completeProduction(state, 'craft-bronze-axe', { stationTags: ['forge'] });
    completeProduction(state, 'craft-bronze-dagger', { stationTags: ['forge'] });
    completeProduction(state, 'craft-bronze-pick', { stationTags: ['forge'] });

    for (const [name, id, family] of [
        ['Bronze Axe', 'bronze-axe', 'axe'],
        ['Bronze Dagger', 'bronze-dagger', 'dagger'],
        ['Bronze Pick', 'bronze-pick', 'axe'],
    ]) {
        assert.match(equipItem(state, name), new RegExp(name));
        const cadence = getMeleeCadenceProfile(state.player);
        assert.equal(cadence.itemId, id);
        assert.equal(cadence.weaponFamily, family);
        assert.equal(cadence.delayUnits, getEquipmentCatalogEntry(id).weaponDelay);
        assert.equal(cadence.delaySource, 'equipment');
        assert.equal(state.player.equipment.mainHand.provenance[0].action, 'craft');
    }

    assert.equal(getEquipmentCatalogEntry('bronze-pick').tags.includes('mining'), false);
    assert.equal(getEquipmentCatalogEntry('prospector-pick').tags.includes('mining'), true);
});

test('A1 Field Knife binds into A4 armor assembly and crafted Subligar Mittens drive normal armor stats', () => {
    const state = createNewGameState();
    prepareMetalworking(state);
    addCanonicalItem(state, 'field-knife');
    assert.match(equipItem(state, 'Field Knife'), /Equipped Field Knife/);

    addArmorInputs(state);
    const subligar = completeProduction(state, 'craft-bronze-subligar', { stationTags: ['forge'] });
    const mittens = completeProduction(state, 'craft-bronze-mittens', { stationTags: ['forge'] });

    for (const work of [subligar, mittens]) {
        assert.equal(work.started.data.work.data.toolBindings.length, 1);
        assert.equal(work.started.data.work.data.toolBindings[0].itemId, 'field-knife');
        assert.equal(work.started.data.work.data.toolBindings[0].sourceType, 'equipment');
    }

    assert.match(equipItem(state, 'Bronze Subligar'), /Bronze Subligar/);
    assert.match(equipItem(state, 'Bronze Mittens'), /Bronze Mittens/);

    const profile = calculateCombatProfile(state.player);
    assert.ok(profile.derived.defense >= 5);
    assert.ok(profile.derived.attack >= 1);
    assert.equal(state.player.equipment.legs.provenance[0].sourceId, 'craft-bronze-subligar');
    assert.equal(state.player.equipment.hands.provenance[0].sourceId, 'craft-bronze-mittens');
});

test('A4 crafted Bronze Pick Subligar and Mittens preserve canonical identities and provenance through save load', () => {
    installStorage();
    assert.equal(createAccountWithPassword('A4 Bronzesmith', 'pwd', { persistentLogin: true }).ok, true);

    const state = createNewGameState();
    state.player.identity.name = 'Bronzesmith';
    prepareMetalworking(state);

    addCanonicalItem(state, 'item-material-bronze-ingot');
    addCanonicalItem(state, 'item-material-ash-handle-blank');
    addCanonicalItem(state, 'item-material-iron-ferrule-socket-set');
    completeProduction(state, 'craft-bronze-pick', { stationTags: ['forge'] });

    addCanonicalItem(state, 'field-knife');
    assert.match(equipItem(state, 'Field Knife'), /Equipped Field Knife/);
    addArmorInputs(state);
    completeProduction(state, 'craft-bronze-subligar', { stationTags: ['forge'] });
    completeProduction(state, 'craft-bronze-mittens', { stationTags: ['forge'] });

    assert.match(equipItem(state, 'Bronze Pick'), /Bronze Pick/);
    assert.match(equipItem(state, 'Bronze Subligar'), /Bronze Subligar/);
    assert.match(equipItem(state, 'Bronze Mittens'), /Bronze Mittens/);

    assert.equal(saveGame(state), true);
    const loaded = loadActiveCharacter();
    assert.ok(loaded);
    assert.equal(loaded.player.equipment.mainHand.id, 'bronze-pick');
    assert.equal(loaded.player.equipment.legs.id, 'bronze-subligar');
    assert.equal(loaded.player.equipment.hands.id, 'bronze-mittens');
    assert.equal(loaded.player.equipment.mainHand.provenance[0].sourceId, 'craft-bronze-pick');
    assert.equal(loaded.player.equipment.legs.provenance[0].sourceId, 'craft-bronze-subligar');
    assert.equal(loaded.player.equipment.hands.provenance[0].sourceId, 'craft-bronze-mittens');
    assert.equal(loaded.player.equipment.mainHand.tags.includes('mining'), false);
});
