import test from 'node:test';
import assert from 'node:assert/strict';

import {
    getCanonicalGatheringSource,
    validateEcologyRegistry,
} from '../js/text/data/ecologyRegistry.js';
import {
    listMaterialFoundationProcessDefinitions,
} from '../js/text/data/materialFoundationProductionCatalog.js';
import {
    listMaterialFoundationProductionItems,
} from '../js/text/data/materialFoundationProductionItems.js';
import {
    listMaterialFoundationResourceItems,
} from '../js/text/data/materialFoundationResourceItems.js';
import {
    listMaterialFoundationGatheringSources,
} from '../js/text/data/materialFoundationSources.js';
import {
    getProductionDefinition,
    listProductionDefinitions,
    validateProductionCatalog,
} from '../js/text/data/productionCatalog.js';
import { getProductionItem } from '../js/text/data/productionItems.js';
import {
    getCanonicalResourceItem,
    validateResourceItemRegistry,
} from '../js/text/data/resourceItemRegistry.js';
import { getRegionalContentPack, listRegionalContentPacks } from '../js/text/data/regionalContentPacks.js';
import { validateContentPacks } from '../js/text/systems/contentPackValidator.js';

test('material foundations contributes twenty-one sourced raws and fifty-five reusable transformations', () => {
    assert.equal(listMaterialFoundationResourceItems().length, 21);
    assert.equal(listMaterialFoundationGatheringSources().length, 21);
    assert.equal(listMaterialFoundationProductionItems().length, 55);
    assert.equal(listMaterialFoundationProcessDefinitions().length, 55);

    assert.deepEqual(validateResourceItemRegistry(), []);
    assert.deepEqual(validateEcologyRegistry(), []);
    assert.deepEqual(validateProductionCatalog(), []);
    assert.deepEqual(validateContentPacks(listRegionalContentPacks()), []);

    for (const source of listMaterialFoundationGatheringSources()) {
        const item = getCanonicalResourceItem(source.outputItemId);
        assert.ok(item, `${source.id} missing output item`);
        assert.equal(getCanonicalGatheringSource(source.id)?.id, source.id);
        assert.ok(item.provenance.some((entry) =>
            entry.sourceId === source.id
            && entry.placeId === source.placeId
            && entry.action === source.action));
    }

    for (const recipe of listMaterialFoundationProcessDefinitions()) {
        for (const output of recipe.outputs) {
            assert.ok(getProductionItem(output.itemId), `${recipe.id} missing output ${output.itemId}`);
        }
    }
});

test('every new raw material has direct production demand', () => {
    const rawIds = new Set(listMaterialFoundationResourceItems().map((item) => item.id));
    const used = new Set(
        listProductionDefinitions()
            .flatMap((definition) => definition.inputs.map((entry) => entry.itemId))
            .filter((id) => rawIds.has(id)),
    );

    assert.equal(used.size, rawIds.size);
    for (const id of rawIds) assert.ok(used.has(id), `${id} should feed production`);
});

test('metal families cover structural, decorative, corrosion-resistant, conductive, and arcane-conductive roles', () => {
    const ids = new Set(listMaterialFoundationProductionItems().map((item) => item.id));
    for (const id of [
        'item-material-steel-bar',
        'item-material-bronze-ingot',
        'item-material-brass-ingot',
        'item-material-silver-ingot',
        'item-material-gold-ingot',
        'item-material-copper-wire',
        'item-material-silver-wire',
        'item-material-cloudsilver-spellwire',
    ]) assert.ok(ids.has(id), `missing material family ${id}`);

    const spellwire = getProductionDefinition('craft-material-cloudsilver-spellwire');
    assert.deepEqual(spellwire.inputs.map((entry) => entry.itemId), [
        'item-material-silver-wire',
        'item-ironspine-polished-cloud-quartz',
        'item-ironspine-lodestone-billet',
    ]);
});

test('wood resources encode distinct working properties instead of one generic timber', () => {
    const byId = new Map(listMaterialFoundationResourceItems().map((item) => [item.id, item]));
    const expected = {
        'item-elderwood-ash-timber': 'handle-stock',
        'item-elderwood-crown-oak-timber': 'wide-board',
        'item-elderwood-silvermaple-timber': 'pale',
        'item-elderwood-yew-stavewood': 'elastic',
        'item-slatewater-spruce-timber': 'mast-stock',
        'item-slatewater-cedar-timber': 'fragrant',
        'item-crownfields-applewood': 'fruitwood',
        'item-starfen-giant-cane': 'bamboo-analogue',
        'item-elderwood-silvermaple-sap': 'sap',
    };
    for (const [id, tag] of Object.entries(expected)) {
        assert.ok(byId.get(id)?.tags.includes(tag), `${id} should carry ${tag}`);
    }

    for (const recipeId of [
        'craft-material-ash-handle-blank',
        'craft-material-oak-plank',
        'craft-material-maple-fine-board',
        'craft-material-yew-bow-stave',
        'craft-material-spruce-spar',
        'craft-material-cedar-board',
    ]) {
        assert.ok(getProductionDefinition(recipeId).requiredToolTags.includes('cutting'));
    }
});

test('fiber stock forms an explicit yarn-to-hawser and netting hierarchy', () => {
    const chain = [
        ['process-material-hemp-fiber', 'item-material-hemp-fiber'],
        ['process-material-hemp-yarn', 'item-material-hemp-yarn'],
        ['process-material-hemp-twine', 'item-material-hemp-twine'],
        ['process-material-hemp-cord', 'item-material-hemp-cord'],
        ['process-material-hemp-rope', 'item-material-hemp-rope'],
        ['process-material-hemp-hawser', 'item-material-hemp-hawser'],
    ];
    for (const [recipeId, outputId] of chain) {
        assert.equal(getProductionDefinition(recipeId).outputs[0].itemId, outputId);
    }
    assert.equal(getProductionDefinition('process-material-hemp-canvas').outputs[0].itemId, 'item-material-hemp-canvas');
    assert.equal(getProductionDefinition('craft-material-hemp-net-webbing').outputs[0].itemId, 'item-material-hemp-net-webbing');
    assert.equal(getProductionDefinition('craft-material-flax-lamp-wick').outputs[0].itemId, 'item-material-flax-lamp-wick');
    assert.equal(getProductionDefinition('process-material-nettle-thread').outputs[0].itemId, 'item-material-nettle-thread');
});

test('shared pack owns the material foundation graph and records the husbandry boundary', () => {
    const pack = getRegionalContentPack('pack-material-foundations-common-components');
    assert.ok(pack);
    assert.equal(pack.records.gatheringSources.length, 21);
    assert.equal(pack.records.items.length, 76);
    assert.equal(pack.records.recipes.length, 55);
    assert.match(pack.metadata.notes, /Wool remains deferred to an explicit husbandry source model/);
});
