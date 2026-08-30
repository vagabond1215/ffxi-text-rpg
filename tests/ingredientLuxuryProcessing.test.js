import test from 'node:test';
import assert from 'node:assert/strict';

import {
    listIngredientLuxuryProcessDefinitions,
} from '../js/text/data/ingredientLuxuryProductionCatalog.js';
import {
    listIngredientLuxuryProductionItems,
} from '../js/text/data/ingredientLuxuryProductionItems.js';
import {
    getProductionDefinition,
    listProductionDefinitions,
    validateProductionCatalog,
} from '../js/text/data/productionCatalog.js';
import { getProductionItem } from '../js/text/data/productionItems.js';
import {
    getCanonicalResourceItem,
    listCanonicalResourceItems,
} from '../js/text/data/resourceItemRegistry.js';
import { createNewGameState } from '../js/text/gameState.js';
import { advanceActiveActivityToCompletion } from '../js/text/systems/activityAdvanceEngine.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { startProductionWork } from '../js/text/systems/productionEngine.js';
import { gainWorkProficiency } from '../js/text/systems/workProficiencyEngine.js';

const LUXURY_RAW_IDS = Object.freeze([
    'item-elderwood-ghost-orchid',
    'item-elderwood-blackheart-heartwood',
    'item-redstone-sun-crocus-stigma',
    'item-redstone-fire-opal',
    'item-starfen-indigo-iris-petal',
    'item-starfen-moonlotus-blossom',
    'item-coppergrass-crimson-madder',
    'item-coppergrass-windglass-agate',
    'item-slatewater-silver-lichen',
    'item-slatewater-blue-slate',
    'item-crownfields-dyers-woad',
]);

function addCanonicalRaw(state, itemId, quantity = 1) {
    const template = getCanonicalResourceItem(itemId);
    assert.ok(template, `missing raw item ${itemId}`);
    const result = addItemToContainer(state.player.inventoryState, 'inventory', { ...template, quantity });
    assert.equal(result.ok, true, result.reason);
}

function quantity(state, itemId) {
    return state.player.inventory
        .filter((item) => item.id === itemId || item.templateId === itemId)
        .reduce((sum, item) => sum + Math.max(1, Number(item.quantity) || 1), 0);
}

test('regional ingredient and luxury tranche contributes thirty chainable outputs and thirty transformations', () => {
    assert.equal(listIngredientLuxuryProductionItems().length, 30);
    assert.equal(listIngredientLuxuryProcessDefinitions().length, 30);
    assert.deepEqual(validateProductionCatalog(), []);

    for (const definition of listIngredientLuxuryProcessDefinitions()) {
        assert.ok(definition.inputs.length >= 1, `${definition.id} requires an input`);
        assert.ok(definition.outputs.length >= 1, `${definition.id} requires an output`);
        for (const output of definition.outputs) {
            assert.ok(getProductionItem(output.itemId), `${definition.id} missing output ${output.itemId}`);
        }
    }

    assert.deepEqual(
        getProductionDefinition('craft-regional-dyers-sample-book').inputs.map((entry) => entry.itemId),
        [
            'item-crownfields-linen-cloth',
            'item-crownfields-woad-pigment',
            'item-redstone-crocus-pigment',
            'item-starfen-indigo-pigment',
            'item-coppergrass-madder-pigment',
            'item-slatewater-lichen-pigment',
        ],
    );
});

test('all eleven established luxury raw resources now have direct production demand', () => {
    const newInputIds = new Set(
        listIngredientLuxuryProcessDefinitions().flatMap((definition) => definition.inputs.map((entry) => entry.itemId)),
    );

    for (const itemId of LUXURY_RAW_IDS) {
        assert.ok(newInputIds.has(itemId), `${itemId} should feed a real production transformation`);
    }

    const luxuryRawIds = new Set(listCanonicalResourceItems().filter((item) => item.tags?.includes('luxury')).map((item) => item.id));
    assert.ok(luxuryRawIds.size >= LUXURY_RAW_IDS.length);
    for (const itemId of LUXURY_RAW_IDS) assert.ok(luxuryRawIds.has(itemId));
});

test('combined production catalog consumes at least three quarters of current canonical raw resources', () => {
    const rawIds = new Set(listCanonicalResourceItems().map((item) => item.id));
    const usedRawIds = new Set(
        listProductionDefinitions()
            .flatMap((definition) => definition.inputs.map((entry) => entry.itemId))
            .filter((itemId) => rawIds.has(itemId)),
    );

    assert.equal(rawIds.size, 145);
    assert.equal(usedRawIds.size, 135);
    assert.ok(usedRawIds.size / rawIds.size >= 0.75);
});

test('Crownfields flour is an intermediate that chains into bread with inherited provenance', () => {
    const state = createNewGameState({ nationId: 'thornwall', name: 'Ingredient Chain Auditor' });
    state.currentPlaceId = 'crownfields-grange';
    state.location = 'Crownfields Grange';
    addCanonicalRaw(state, 'item-crownfields-crown-rye', 2);
    addCanonicalRaw(state, 'item-redstone-rock-salt', 1);

    const flour = startProductionWork(state, 'process-crownfields-rye-flour', { stationTags: ['workshop'] });
    assert.equal(flour.ok, true, flour.display?.text);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(quantity(state, 'item-crownfields-rye-flour'), 2);

    const loaf = startProductionWork(state, 'cook-crownfields-rye-loaf', { stationTags: ['kitchen'] });
    assert.equal(loaf.ok, true, loaf.display?.text);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(quantity(state, 'item-crownfields-rye-flour'), 0);
    assert.equal(quantity(state, 'item-crownfields-rye-loaf'), 2);

    const baked = state.player.inventory.find((item) => item.id === 'item-crownfields-rye-loaf');
    assert.equal(baked.provenance[0].sourceId, 'cook-crownfields-rye-loaf');
    assert.ok(
        baked.provenance[0].data.inputSources.some((input) =>
            input.itemId === 'item-crownfields-rye-flour'
            && input.provenance.some((entry) => entry.sourceId === 'process-crownfields-rye-flour')),
    );
});

test('two regional luxury raws become intermediates before a cross-regional finished perfume', () => {
    const state = createNewGameState({ nationId: 'thornwall', name: 'Luxury Chain Auditor' });
    state.currentPlaceId = 'thornwall-crownward';
    state.location = 'Thornwall Crownward';
    gainWorkProficiency(state, 'crafting', 2);
    gainWorkProficiency(state, 'cooking', 2);
    addCanonicalRaw(state, 'item-elderwood-ghost-orchid', 1);
    addCanonicalRaw(state, 'item-starfen-moonlotus-blossom', 1);

    let result = startProductionWork(state, 'process-elderwood-orchid-absolute', { stationTags: ['workshop'] });
    assert.equal(result.ok, true, result.display?.text);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(quantity(state, 'item-elderwood-orchid-absolute'), 1);

    result = startProductionWork(state, 'process-starfen-moonlotus-essence', { stationTags: ['kitchen'] });
    assert.equal(result.ok, true, result.display?.text);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(quantity(state, 'item-starfen-moonlotus-essence'), 1);

    result = startProductionWork(state, 'craft-starfen-moonlotus-orchid-perfume', { stationTags: ['workshop'] });
    assert.equal(result.ok, true, result.display?.text);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(quantity(state, 'item-elderwood-orchid-absolute'), 0);
    assert.equal(quantity(state, 'item-starfen-moonlotus-essence'), 0);
    assert.equal(quantity(state, 'item-starfen-moonlotus-orchid-perfume'), 1);
});
