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
    listBasicLeatherGarmentProcessDefinitions,
} from '../js/text/data/basicLeatherGarmentProductionCatalog.js';
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
import { gainWorkProficiency } from '../js/text/systems/workProficiencyEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

const EQUIPMENT_IDS = Object.freeze([
    'leather-vest',
    'leather-trousers',
]);

const RECIPE_IDS = Object.freeze([
    'craft-leather-vest',
    'craft-leather-trousers',
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

function prepareCrafting(state) {
    gainWorkProficiency(state, 'crafting', 4);
}

test('A5 owns exactly two existing leather garment identities and two recipes without duplicate item authority', () => {
    assert.equal(listBasicLeatherGarmentProcessDefinitions().length, 2);
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

    const pack = getRegionalContentPack('pack-basic-leather-garments');
    assert.ok(pack);
    assert.deepEqual(pack.dependencies, [
        'pack-shared-foundation',
        'pack-elderwood-hunt-timber',
    ]);
    assert.deepEqual(pack.records.items.map((entry) => entry.id), EQUIPMENT_IDS);
    assert.deepEqual(pack.records.recipes.map((entry) => entry.id), RECIPE_IDS);
});

test('A5 recipes reuse the established Elderwood tanned-hide and hide-binding supply chain', () => {
    const vest = getProductionDefinition('craft-leather-vest');
    assert.deepEqual(vest.inputs.map((entry) => [entry.itemId, entry.quantity]), [
        ['item-elderwood-tanned-hide', 2],
        ['item-elderwood-hide-binding', 1],
    ]);
    assert.deepEqual(vest.requiredToolTags, ['cutting']);
    assert.deepEqual(vest.requiredStationTags, ['tannery']);
    assert.equal(vest.proficiencyId, 'crafting');

    const trousers = getProductionDefinition('craft-leather-trousers');
    assert.deepEqual(trousers.inputs.map((entry) => [entry.itemId, entry.quantity]), [
        ['item-elderwood-tanned-hide', 1],
        ['item-elderwood-hide-binding', 1],
    ]);
    assert.deepEqual(trousers.requiredToolTags, ['cutting']);
    assert.deepEqual(trousers.requiredStationTags, ['tannery']);
    assert.equal(trousers.proficiencyId, 'crafting');
});

test('A1 crafted Field Knife binds into both A5 leather garment recipes', () => {
    const state = createNewGameState();
    prepareCrafting(state);

    for (const itemId of [
        'item-material-steel-blade-blank',
        'item-material-ash-handle-blank',
        'item-material-iron-ferrule-socket-set',
    ]) addCanonicalItem(state, itemId);

    completeProduction(state, 'craft-field-knife', { stationTags: ['forge'] });
    assert.match(equipItem(state, 'Field Knife'), /Equipped Field Knife/);

    addCanonicalItem(state, 'item-elderwood-tanned-hide', 3);
    addCanonicalItem(state, 'item-elderwood-hide-binding', 2);

    const vest = completeProduction(state, 'craft-leather-vest', { stationTags: ['tannery'] });
    const trousers = completeProduction(state, 'craft-leather-trousers', { stationTags: ['tannery'] });

    for (const work of [vest, trousers]) {
        assert.equal(work.started.data.work.data.toolBindings.length, 1);
        assert.equal(work.started.data.work.data.toolBindings[0].itemId, 'field-knife');
        assert.equal(work.started.data.work.data.toolBindings[0].sourceType, 'equipment');
    }

    assert.equal(state.player.inventory.find((item) => item.id === 'leather-vest')?.provenance[0].sourceId, 'craft-leather-vest');
    assert.equal(state.player.inventory.find((item) => item.id === 'leather-trousers')?.provenance[0].sourceId, 'craft-leather-trousers');
});

test('crafted Leather Vest and Leather Trousers drive canonical light-armor stats', () => {
    const state = createNewGameState();
    prepareCrafting(state);

    addCanonicalItem(state, 'field-knife');
    assert.match(equipItem(state, 'Field Knife'), /Equipped Field Knife/);
    addCanonicalItem(state, 'item-elderwood-tanned-hide', 3);
    addCanonicalItem(state, 'item-elderwood-hide-binding', 2);

    completeProduction(state, 'craft-leather-vest', { stationTags: ['tannery'] });
    completeProduction(state, 'craft-leather-trousers', { stationTags: ['tannery'] });

    assert.match(equipItem(state, 'Leather Vest'), /Leather Vest/);
    assert.match(equipItem(state, 'Leather Trousers'), /Leather Trousers/);

    const profile = calculateCombatProfile(state.player);
    assert.ok(profile.resources.maxHp >= 2);
    assert.ok(profile.derived.defense >= 6);

    assert.equal(state.player.equipment.body.id, 'leather-vest');
    assert.equal(state.player.equipment.legs.id, 'leather-trousers');
    assert.equal(state.player.equipment.body.provenance[0].action, 'craft');
    assert.equal(state.player.equipment.legs.provenance[0].action, 'craft');
});

test('A5 crafted leather loadout preserves canonical identities and provenance through current-schema save load', () => {
    installStorage();
    assert.equal(createAccountWithPassword('A5 Leatherworker', 'pwd', { persistentLogin: true }).ok, true);

    const state = createNewGameState();
    state.player.identity.name = 'Leatherworker';
    prepareCrafting(state);

    addCanonicalItem(state, 'field-knife');
    assert.match(equipItem(state, 'Field Knife'), /Equipped Field Knife/);
    addCanonicalItem(state, 'item-elderwood-tanned-hide', 3);
    addCanonicalItem(state, 'item-elderwood-hide-binding', 2);

    completeProduction(state, 'craft-leather-vest', { stationTags: ['tannery'] });
    completeProduction(state, 'craft-leather-trousers', { stationTags: ['tannery'] });

    assert.match(equipItem(state, 'Leather Vest'), /Leather Vest/);
    assert.match(equipItem(state, 'Leather Trousers'), /Leather Trousers/);

    assert.equal(saveGame(state), true);
    const loaded = loadActiveCharacter();
    assert.ok(loaded);
    assert.equal(loaded.player.equipment.body.id, 'leather-vest');
    assert.equal(loaded.player.equipment.legs.id, 'leather-trousers');
    assert.equal(loaded.player.equipment.body.provenance[0].sourceId, 'craft-leather-vest');
    assert.equal(loaded.player.equipment.legs.provenance[0].sourceId, 'craft-leather-trousers');
});
