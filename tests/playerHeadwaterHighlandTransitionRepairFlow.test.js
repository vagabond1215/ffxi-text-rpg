import test from 'node:test';
import assert from 'node:assert/strict';

import {
    getCanonicalGatheringSource,
    getCanonicalPopulation,
    getCanonicalSpecies,
    validateEcologyRegistry,
} from '../js/text/data/ecologyRegistry.js';
import {
    listHeadwaterHighlandTransitionRepairEcologyFamilies,
    listHeadwaterHighlandTransitionRepairGatheringSources,
    listHeadwaterHighlandTransitionRepairPopulations,
    listHeadwaterHighlandTransitionRepairSpecies,
} from '../js/text/data/headwaterHighlandTransitionRepairEcology.js';
import { listHeadwaterHighlandTransitionRepairResourceItems } from '../js/text/data/headwaterHighlandTransitionRepairResourceItems.js';
import { listHeadwaterHighlandTransitionRepairProcessDefinitions } from '../js/text/data/headwaterHighlandTransitionRepairProductionCatalog.js';
import { getProductionDefinition, validateProductionCatalog } from '../js/text/data/productionCatalog.js';
import { getProductionItem, validateProductionItemCatalog } from '../js/text/data/productionItems.js';
import { getCanonicalResourceItem, validateResourceItemRegistry } from '../js/text/data/resourceItemRegistry.js';
import { getPlace } from '../js/text/data/places.js';
import { REGIONAL_CONTENT_PACKS } from '../js/text/data/regionalContentPacks.js';
import { validateContentPacks } from '../js/text/systems/contentPackValidator.js';

test('headwater highland repair adds no ecology family and reuses established transition families', () => {
    assert.deepEqual(validateEcologyRegistry(), []);
    assert.equal(listHeadwaterHighlandTransitionRepairEcologyFamilies().length, 0);
    assert.equal(listHeadwaterHighlandTransitionRepairSpecies().length, 5);
    assert.equal(listHeadwaterHighlandTransitionRepairPopulations().length, 10);

    const families = new Map(listHeadwaterHighlandTransitionRepairSpecies().map((entry) => [entry.id, entry.familyId]));
    assert.equal(families.get('species-headwater-meadow-grouse'), 'family-grouse');
    assert.equal(families.get('species-headwater-meadow-bee'), 'family-bee');
    assert.equal(families.get('species-slatewater-thyme-bee'), 'family-bee');
    assert.equal(families.get('species-ironspine-snow-hare'), 'family-hare');
    assert.equal(families.get('species-ironspine-sorrel-bee'), 'family-bee');

    assert.equal(getCanonicalSpecies('species-brush-hare').familyId, 'family-hare');
    assert.equal(getCanonicalSpecies('species-headwater-coldstream-trout').familyId, 'family-stream-trout');
    assert.equal(getCanonicalSpecies('species-waymeet-grey-grouse').familyId, 'family-grouse');
    assert.equal(getCanonicalSpecies('species-ironspine-snow-grouse').familyId, 'family-grouse');
});

test('Upper Vale gains grouse, pollinator, trout, berry recovery, and non-node meadow layers', () => {
    for (const id of [
        'population-headwater-meadow-grouse',
        'population-headwater-meadow-bees',
        'population-headwater-upper-coldstream-trout',
    ]) assert.ok(getCanonicalPopulation(id), id);

    const source = getCanonicalGatheringSource('source-headwater-upper-bilberry-bank');
    assert.ok(source);
    assert.equal(source.placeId, 'headwater-upper-vale');

    const item = getCanonicalResourceItem('item-headwater-upper-bilberry');
    assert.ok(item);
    assert.ok(item.provenance.some((p) => p.sourceId === source.id && p.placeId === source.placeId && p.action === source.action));
    assert.equal(item.consumption.mode, 'direct');
    assert.equal(item.consumption.hazard, 'none');

    const description = getPlace('headwater-upper-vale').description;
    assert.match(description, /bilberry/i);
    assert.match(description, /fescue|sedge/i);
    assert.match(description, /harebell|clover|dwarf willow|moss/i);
});

test('Windscar, Slatewater, and Ironspine gain local family overlap without new recovery-node inflation', () => {
    for (const id of [
        'population-windscar-grey-grouse',
        'population-slatewater-brush-hares',
        'population-slatewater-thyme-bees',
        'population-ironspine-snow-hares',
        'population-ironspine-lower-sorrel-bees',
        'population-ironspine-high-sorrel-bees',
        'population-ironspine-high-snow-grouse',
    ]) assert.ok(getCanonicalPopulation(id), id);

    assert.equal(listHeadwaterHighlandTransitionRepairGatheringSources().length, 1);
    assert.match(getPlace('slatewater-foothills').description, /serviceberry|thyme/i);
    assert.match(getPlace('slatewater-foothills').description, /clover|flower/i);
    assert.match(getPlace('ironspine-lower-pass').description, /flower|sorrel/i);
    assert.match(getPlace('ironspine-high-meadow').description, /sorrel|flower/i);
});

test('Upper Vale bilberries have one connected preservation loop with explicit prepared-food safety', () => {
    assert.equal(listHeadwaterHighlandTransitionRepairResourceItems().length, 1);
    assert.equal(listHeadwaterHighlandTransitionRepairProcessDefinitions().length, 1);
    assert.deepEqual(validateResourceItemRegistry(), []);
    assert.deepEqual(validateProductionCatalog(), []);
    assert.deepEqual(validateProductionItemCatalog(), []);

    const process = getProductionDefinition('cook-headwater-bilberry-meadowsweet-preserve');
    assert.ok(process);
    assert.ok(process.inputs.some((entry) => entry.itemId === 'item-headwater-upper-bilberry'));
    assert.ok(process.inputs.some((entry) => entry.itemId === 'item-headwater-dried-meadowsweet'));

    const output = getProductionItem('item-headwater-bilberry-meadowsweet-preserve');
    assert.ok(output);
    assert.equal(output.consumption.mode, 'direct');
    assert.equal(output.consumption.hazard, 'none');
});

test('one Pack-v2 repair graph owns only the new cross-region transition records', () => {
    assert.deepEqual(validateContentPacks(REGIONAL_CONTENT_PACKS), []);
    const pack = REGIONAL_CONTENT_PACKS.find((entry) => entry.id === 'pack-headwater-highland-transition-repair');
    assert.ok(pack);
    assert.deepEqual(pack.ownership.regionIds, [
        'headwater-vale',
        'waymeet-marches',
        'slatewater-foothills',
        'ironspine-highlands',
    ]);
    for (const dependency of [
        'pack-elderwood-opening',
        'pack-elderwood-ecology-breadth',
        'pack-slatewater-foothills-ecology',
        'pack-headwater-vale-ecology',
        'pack-headwater-vale',
        'pack-waymeet-marches-ecology',
        'pack-ironspine-highlands-ecology',
    ]) assert.ok(pack.dependencies.includes(dependency), dependency);
    assert.equal(pack.records.species.length, 5);
    assert.equal(pack.records.populations.length, 10);
    assert.equal(pack.records.gatheringSources.length, 1);
    assert.equal(pack.records.items.length, 2);
    assert.equal(pack.records.recipes.length, 1);
});
