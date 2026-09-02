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
    listStarterBronzeMartialProcessDefinitions,
} from '../js/text/data/starterBronzeMartialProductionCatalog.js';
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
    'bronze-sword',
    'bronze-cap',
    'bronze-harness',
]);

const RECIPE_IDS = Object.freeze([
    'craft-bronze-sword',
    'craft-bronze-cap',
    'craft-bronze-harness',
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

test('A2 retains its three original bronze martial recipes and canonical item authority after later pack extension', () => {
    assert.equal(listStarterBronzeMartialProcessDefinitions().length, 3);
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

    const pack = getRegionalContentPack('pack-starter-bronze-martial-equipment');
    assert.ok(pack);
    assert.deepEqual(pack.dependencies, ['pack-shared-foundation', 'pack-material-foundations-common-components']);
    assert.deepEqual(pack.records.items.map((entry) => entry.id).slice(0, EQUIPMENT_IDS.length), EQUIPMENT_IDS);
    assert.deepEqual(pack.records.recipes.map((entry) => entry.id).slice(0, RECIPE_IDS.length), RECIPE_IDS);
});

test('A2 bronze martial recipes reuse existing alloy wood textile and hardware stocks', () => {
    const sword = getProductionDefinition('craft-bronze-sword');
    assert.deepEqual(sword.inputs.map((entry) => [entry.itemId, entry.quantity]), [
        ['item-material-bronze-ingot', 1],
        ['item-material-ash-handle-blank', 1],
        ['item-material-hemp-twine', 1],
    ]);
    assert.deepEqual(sword.requiredToolTags, []);
    assert.deepEqual(sword.requiredStationTags, ['forge']);

    const cap = getProductionDefinition('craft-bronze-cap');
    assert.deepEqual(cap.inputs.map((entry) => [entry.itemId, entry.quantity]), [
        ['item-material-bronze-sheet', 1],
        ['item-material-hemp-canvas', 1],
    ]);
    assert.deepEqual(cap.requiredStationTags, ['forge']);

    const harness = getProductionDefinition('craft-bronze-harness');
    assert.deepEqual(harness.inputs.map((entry) => [entry.itemId, entry.quantity]), [
        ['item-material-bronze-sheet', 2],
        ['item-material-hemp-canvas', 1],
        ['item-material-iron-buckle-ring-set', 1],
    ]);
    assert.deepEqual(harness.requiredToolTags, ['cutting']);
    assert.deepEqual(harness.requiredStationTags, ['forge']);
});

test('A1 crafted Field Knife binds into A2 Bronze Harness assembly', () => {
    const state = createNewGameState();
    gainWorkProficiency(state, 'metalworking', 4);
    gainWorkProficiency(state, 'crafting', 2);

    for (const itemId of [
        'item-material-steel-blade-blank',
        'item-material-ash-handle-blank',
        'item-material-iron-ferrule-socket-set',
    ]) addCanonicalItem(state, itemId);

    completeProduction(state, 'craft-field-knife', { stationTags: ['forge'] });
    assert.match(equipItem(state, 'Field Knife'), /Equipped Field Knife/);

    addCanonicalItem(state, 'item-material-bronze-sheet', 2);
    addCanonicalItem(state, 'item-material-hemp-canvas');
    addCanonicalItem(state, 'item-material-iron-buckle-ring-set');

    const harnessWork = completeProduction(state, 'craft-bronze-harness', { stationTags: ['forge'] });
    assert.equal(harnessWork.started.data.work.data.toolBindings.length, 1);
    assert.equal(harnessWork.started.data.work.data.toolBindings[0].itemId, 'field-knife');
    assert.equal(harnessWork.started.data.work.data.toolBindings[0].sourceType, 'equipment');

    const harness = state.player.inventory.find((item) => item.id === 'bronze-harness');
    assert.ok(harness);
    assert.equal(harness.provenance[0].sourceId, 'craft-bronze-harness');
    assert.equal(harness.provenance[0].action, 'craft');
});

test('crafted bronze sword cap and harness drive canonical combat profile and weapon cadence', () => {
    const state = createNewGameState();
    gainWorkProficiency(state, 'metalworking', 4);

    addCanonicalItem(state, 'item-material-bronze-ingot');
    addCanonicalItem(state, 'item-material-ash-handle-blank');
    addCanonicalItem(state, 'item-material-hemp-twine');
    completeProduction(state, 'craft-bronze-sword', { stationTags: ['forge'] });

    addCanonicalItem(state, 'item-material-bronze-sheet');
    addCanonicalItem(state, 'item-material-hemp-canvas');
    completeProduction(state, 'craft-bronze-cap', { stationTags: ['forge'] });

    // Harness needs a real cutting tool; use the established canonical Field Knife directly here
    // because the cross-packet crafted-tool dependency is proven separately above.
    addCanonicalItem(state, 'field-knife');
    assert.match(equipItem(state, 'Field Knife'), /Equipped Field Knife/);
    addCanonicalItem(state, 'item-material-bronze-sheet', 2);
    addCanonicalItem(state, 'item-material-hemp-canvas');
    addCanonicalItem(state, 'item-material-iron-buckle-ring-set');
    completeProduction(state, 'craft-bronze-harness', { stationTags: ['forge'] });

    assert.match(equipItem(state, 'Bronze Sword'), /Bronze Sword/);
    assert.match(equipItem(state, 'Bronze Cap'), /Bronze Cap/);
    assert.match(equipItem(state, 'Bronze Harness'), /Bronze Harness/);

    const profile = calculateCombatProfile(state.player);
    assert.ok(profile.derived.attack >= 3);
    assert.ok(profile.derived.accuracy >= 1);
    assert.ok(profile.derived.defense >= 7);
    assert.ok(profile.resources.maxHp >= 4);

    const cadence = getMeleeCadenceProfile(state.player);
    assert.equal(cadence.itemId, 'bronze-sword');
    assert.equal(cadence.weaponFamily, 'sword');
    assert.equal(cadence.delayUnits, getEquipmentCatalogEntry('bronze-sword').weaponDelay);
    assert.equal(cadence.delaySource, 'equipment');

    for (const itemId of EQUIPMENT_IDS) {
        const equipped = Object.values(state.player.equipment).find((item) => item?.id === itemId);
        assert.ok(equipped, `${itemId} should be equipped`);
        assert.equal(equipped.provenance[0].action, 'craft');
    }
});

test('crafted bronze martial loadout preserves canonical identities and provenance through current-schema save/load', () => {
    installStorage();
    assert.equal(createAccountWithPassword('A2 Bronzesmith', 'pwd', { persistentLogin: true }).ok, true);

    const state = createNewGameState();
    state.player.identity.name = 'Bronzesmith';
    gainWorkProficiency(state, 'metalworking', 4);

    addCanonicalItem(state, 'item-material-bronze-ingot');
    addCanonicalItem(state, 'item-material-ash-handle-blank');
    addCanonicalItem(state, 'item-material-hemp-twine');
    completeProduction(state, 'craft-bronze-sword', { stationTags: ['forge'] });

    addCanonicalItem(state, 'item-material-bronze-sheet');
    addCanonicalItem(state, 'item-material-hemp-canvas');
    completeProduction(state, 'craft-bronze-cap', { stationTags: ['forge'] });

    addCanonicalItem(state, 'field-knife');
    assert.match(equipItem(state, 'Field Knife'), /Equipped Field Knife/);
    addCanonicalItem(state, 'item-material-bronze-sheet', 2);
    addCanonicalItem(state, 'item-material-hemp-canvas');
    addCanonicalItem(state, 'item-material-iron-buckle-ring-set');
    completeProduction(state, 'craft-bronze-harness', { stationTags: ['forge'] });

    assert.match(equipItem(state, 'Bronze Sword'), /Bronze Sword/);
    assert.match(equipItem(state, 'Bronze Cap'), /Bronze Cap/);
    assert.match(equipItem(state, 'Bronze Harness'), /Bronze Harness/);

    assert.equal(saveGame(state), true);
    const loaded = loadActiveCharacter();
    assert.ok(loaded);
    assert.equal(loaded.player.equipment.mainHand.id, 'bronze-sword');
    assert.equal(loaded.player.equipment.head.id, 'bronze-cap');
    assert.equal(loaded.player.equipment.body.id, 'bronze-harness');
    assert.equal(loaded.player.equipment.mainHand.provenance[0].sourceId, 'craft-bronze-sword');
    assert.equal(loaded.player.equipment.head.provenance[0].sourceId, 'craft-bronze-cap');
    assert.equal(loaded.player.equipment.body.provenance[0].sourceId, 'craft-bronze-harness');
});
