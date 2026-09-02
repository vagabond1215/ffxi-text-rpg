import test from 'node:test';
import assert from 'node:assert/strict';

import { getCanonicalItem, getCanonicalItemAuthority } from '../js/text/data/canonicalItemRegistry.js';
import { getEquipmentCatalogEntry } from '../js/text/data/equipmentCatalog.js';
import {
    listOccupationalFieldToolProcessDefinitions,
} from '../js/text/data/occupationalFieldToolProductionCatalog.js';
import {
    getProductionDefinition,
    validateProductionCatalog,
} from '../js/text/data/productionCatalog.js';
import { getProductionItem } from '../js/text/data/productionItems.js';
import { getCanonicalResourceItem } from '../js/text/data/resourceItemRegistry.js';
import {
    getRegionalContentPack,
    listRegionalContentPacks,
} from '../js/text/data/regionalContentPacks.js';
import { createNewGameState } from '../js/text/gameState.js';
import {
    createAccountWithPassword,
    loadActiveCharacter,
    saveGame,
} from '../js/text/save.js';
import { validateContentPacks } from '../js/text/systems/contentPackValidator.js';
import { equipItem } from '../js/text/systems/equipmentEngine.js';
import { collectAvailableToolTags } from '../js/text/systems/equipmentToolEngine.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import {
    reconcileProductionWork,
    startProductionWork,
} from '../js/text/systems/productionEngine.js';
import { gainWorkProficiency } from '../js/text/systems/workProficiencyEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

const TOOL_IDS = Object.freeze([
    'field-knife',
    'prospector-pick',
    'woodsman-hatchet',
    'digging-spade',
    'reed-sickle',
    'marsh-rod',
]);

const RECIPE_IDS = Object.freeze([
    'craft-field-knife',
    'craft-prospector-pick',
    'craft-woodsman-hatchet',
    'craft-digging-spade',
    'craft-reed-sickle',
    'craft-marsh-fishing-rod',
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
    const [completed] = reconcileProductionWork(state);
    assert.equal(completed.ok, true, completed.display?.text);
    return { started, completed };
}

test('A1 owns exactly six existing field tools and six new production definitions without duplicating item authority', () => {
    assert.equal(listOccupationalFieldToolProcessDefinitions().length, 6);
    assert.deepEqual(validateProductionCatalog(), []);
    assert.deepEqual(validateContentPacks(listRegionalContentPacks()), []);

    for (const [index, recipeId] of RECIPE_IDS.entries()) {
        const recipe = getProductionDefinition(recipeId);
        const toolId = TOOL_IDS[index];
        assert.ok(recipe, `missing recipe ${recipeId}`);
        assert.equal(recipe.outputs.length, 1);
        assert.equal(recipe.outputs[0].itemId, toolId);
        assert.equal(recipe.outputs[0].quantity, 1);
        assert.equal(getCanonicalItemAuthority(toolId), 'equipment');
        assert.ok(getEquipmentCatalogEntry(toolId));
        assert.equal(getProductionItem(toolId), null, `${toolId} must not be duplicated in productionItems`);
        for (const input of recipe.inputs) assert.ok(getCanonicalItem(input.itemId), `${recipeId} missing input ${input.itemId}`);
    }

    const pack = getRegionalContentPack('pack-occupational-field-tools');
    assert.ok(pack);
    assert.deepEqual(pack.dependencies, ['pack-shared-foundation', 'pack-material-foundations-common-components']);
    assert.deepEqual(pack.records.items.map((entry) => entry.id), TOOL_IDS);
    assert.deepEqual(pack.records.recipes.map((entry) => entry.id), RECIPE_IDS);
});

test('A1 field tools use existing shared stocks with a cutting-gated marsh rod assembly', () => {
    const fieldKnife = getProductionDefinition('craft-field-knife');
    assert.deepEqual(fieldKnife.inputs.map((entry) => entry.itemId), [
        'item-material-steel-blade-blank',
        'item-material-ash-handle-blank',
        'item-material-iron-ferrule-socket-set',
    ]);
    assert.deepEqual(fieldKnife.requiredStationTags, ['forge']);

    for (const id of ['craft-prospector-pick', 'craft-woodsman-hatchet', 'craft-digging-spade']) {
        const recipe = getProductionDefinition(id);
        assert.deepEqual(recipe.inputs.map((entry) => entry.itemId), [
            'item-material-iron-tool-head-blank',
            'item-material-ash-handle-blank',
            'item-material-iron-ferrule-socket-set',
        ]);
        assert.deepEqual(recipe.requiredStationTags, ['forge']);
    }

    const sickle = getProductionDefinition('craft-reed-sickle');
    assert.deepEqual(sickle.inputs.map((entry) => entry.itemId), [
        'item-material-steel-blade-blank',
        'item-material-ash-handle-blank',
        'item-material-iron-ferrule-socket-set',
    ]);

    const rod = getProductionDefinition('craft-marsh-fishing-rod');
    assert.deepEqual(rod.inputs.map((entry) => entry.itemId), [
        'item-material-giant-cane-poles',
        'item-material-hemp-twine',
        'item-material-iron-ferrule-socket-set',
    ]);
    assert.deepEqual(rod.requiredToolTags, ['cutting']);
    assert.deepEqual(rod.requiredStationTags, ['workshop']);
});

test('crafted Field Knife keeps canonical equipment behavior and unlocks real cutting-gated downstream work', () => {
    const state = createNewGameState();
    gainWorkProficiency(state, 'metalworking', 4);
    gainWorkProficiency(state, 'crafting', 2);

    addCanonicalItem(state, 'item-material-steel-blade-blank');
    addCanonicalItem(state, 'item-material-ash-handle-blank');
    addCanonicalItem(state, 'item-material-iron-ferrule-socket-set');

    const { completed } = completeProduction(state, 'craft-field-knife', { stationTags: ['forge'] });
    assert.deepEqual(completed.data.outputs, [{ itemId: 'field-knife', quantity: 1 }]);

    const craftedKnife = state.player.inventory.find((item) => item.id === 'field-knife');
    const canonicalKnife = getEquipmentCatalogEntry('field-knife');
    assert.ok(craftedKnife);
    assert.equal(craftedKnife.kind, 'equipment');
    assert.equal(craftedKnife.family, canonicalKnife.family);
    assert.equal(craftedKnife.subtype, canonicalKnife.subtype);
    assert.equal(craftedKnife.equipmentSlot, canonicalKnife.equipmentSlot);
    assert.deepEqual(craftedKnife.allowedSlots, canonicalKnife.allowedSlots);
    assert.deepEqual(craftedKnife.modifiers, canonicalKnife.modifiers);
    assert.ok(craftedKnife.tags.includes('cutting'));
    assert.equal(craftedKnife.provenance[0].sourceId, 'craft-field-knife');
    assert.equal(craftedKnife.provenance[0].action, 'craft');

    assert.match(equipItem(state, 'Field Knife'), /Equipped Field Knife/);
    assert.ok(collectAvailableToolTags(state.player).includes('cutting'));

    addCanonicalItem(state, 'item-elderwood-ash-timber');
    const downstream = completeProduction(state, 'craft-material-ash-handle-blank', { stationTags: ['woodshop'] });
    assert.equal(downstream.started.data.work.data.toolBindings[0].itemId, 'field-knife');
    assert.equal(downstream.started.data.work.data.toolBindings[0].sourceType, 'equipment');
    assert.ok(state.player.inventory.some((item) => item.id === 'item-material-ash-handle-blank'));
});

test('crafted Field Knife can bind into Marsh Fishing Rod production and both crafted identities survive real save/load', () => {
    installStorage();
    const account = createAccountWithPassword('A1 Toolwright', 'pwd', { persistentLogin: true });
    assert.equal(account.ok, true);

    const state = createNewGameState();
    state.player.identity.name = 'Toolwright';
    gainWorkProficiency(state, 'metalworking', 4);
    gainWorkProficiency(state, 'crafting', 2);

    for (const itemId of [
        'item-material-steel-blade-blank',
        'item-material-ash-handle-blank',
        'item-material-iron-ferrule-socket-set',
    ]) addCanonicalItem(state, itemId);

    completeProduction(state, 'craft-field-knife', { stationTags: ['forge'] });
    assert.match(equipItem(state, 'Field Knife'), /Equipped Field Knife/);

    addCanonicalItem(state, 'item-material-giant-cane-poles');
    addCanonicalItem(state, 'item-material-hemp-twine');
    addCanonicalItem(state, 'item-material-iron-ferrule-socket-set');

    const rodWork = completeProduction(state, 'craft-marsh-fishing-rod', { stationTags: ['workshop'] });
    assert.equal(rodWork.started.data.work.data.toolBindings[0].itemId, 'field-knife');

    const rod = state.player.inventory.find((item) => item.id === 'marsh-rod');
    assert.ok(rod);
    assert.equal(rod.kind, 'equipment');
    assert.equal(rod.provenance[0].sourceId, 'craft-marsh-fishing-rod');
    assert.match(equipItem(state, 'Marsh Fishing Rod'), /Equipped Marsh Fishing Rod/);
    assert.ok(collectAvailableToolTags(state.player).includes('fishing'));

    assert.equal(saveGame(state), true);
    const loaded = loadActiveCharacter();
    assert.ok(loaded);
    assert.equal(loaded.player.equipment.mainHand.id, 'marsh-rod');
    assert.equal(loaded.player.equipment.mainHand.provenance[0].sourceId, 'craft-marsh-fishing-rod');
    const loadedKnife = loaded.player.inventory.find((item) => item.id === 'field-knife');
    assert.ok(loadedKnife);
    assert.equal(loadedKnife.provenance[0].sourceId, 'craft-field-knife');
    assert.ok(loadedKnife.tags.includes('cutting'));
});

test('A1 does not counterfeit new resource or production-item identities for existing equipment tools', () => {
    for (const toolId of TOOL_IDS) {
        assert.equal(getCanonicalResourceItem(toolId), null);
        assert.equal(getProductionItem(toolId), null);
        assert.equal(getCanonicalItemAuthority(toolId), 'equipment');
    }
});
