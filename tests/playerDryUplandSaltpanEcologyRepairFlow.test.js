import test from 'node:test';
import assert from 'node:assert/strict';

import {
    getCanonicalGatheringSource,
    getCanonicalPopulation,
    getCanonicalSpecies,
    validateEcologyRegistry,
} from '../js/text/data/ecologyRegistry.js';
import {
    listDryUplandSaltpanRepairEcologyFamilies,
    listDryUplandSaltpanRepairGatheringSources,
    listDryUplandSaltpanRepairPopulations,
    listDryUplandSaltpanRepairSpecies,
} from '../js/text/data/dryUplandSaltpanRepairEcology.js';
import { listDryUplandSaltpanRepairResourceItems } from '../js/text/data/dryUplandSaltpanRepairResourceItems.js';
import { listDryUplandSaltpanRepairProcessDefinitions } from '../js/text/data/dryUplandSaltpanRepairProductionCatalog.js';
import { getProductionDefinition, validateProductionCatalog } from '../js/text/data/productionCatalog.js';
import { getProductionItem, validateProductionItemCatalog } from '../js/text/data/productionItems.js';
import { getCanonicalResourceItem, validateResourceItemRegistry } from '../js/text/data/resourceItemRegistry.js';
import { getPlace } from '../js/text/data/places.js';
import { REGIONAL_CONTENT_PACKS } from '../js/text/data/regionalContentPacks.js';
import { validateContentPacks } from '../js/text/systems/contentPackValidator.js';

const RAW_IDS = Object.freeze([
    'item-redstone-sunbent-bunchgrass',
    'item-redstone-stone-thyme',
    'item-redstone-drythorn-resin',
    'item-redstone-wind-juniper-berry',
    'item-redstone-ridge-yarrow',
    'item-emberwash-saltbrush-shoot',
    'item-emberwash-saltgrass-fiber',
    'item-emberwash-panbloom-petal',
]);

test('dry upland repair reuses established fauna families and adds only one transition species', () => {
    assert.deepEqual(validateEcologyRegistry(), []);
    assert.equal(listDryUplandSaltpanRepairEcologyFamilies().length, 0);
    assert.equal(listDryUplandSaltpanRepairSpecies().length, 1);
    assert.equal(listDryUplandSaltpanRepairPopulations().length, 3);

    const grouse = getCanonicalSpecies('species-redstone-stone-grouse');
    assert.ok(grouse);
    assert.equal(grouse.familyId, 'family-grouse');

    for (const id of [
        'population-north-redstone-ridge-ibex',
        'population-north-redstone-sunscale-lizards',
        'population-north-redstone-stone-grouse',
    ]) assert.ok(getCanonicalPopulation(id), id);
});

test('eight repair flora resources cover grass, shrub, food, medicine, resin, halophyte, fiber, and decorative dye roles', () => {
    assert.equal(listDryUplandSaltpanRepairGatheringSources().length, 8);
    assert.equal(listDryUplandSaltpanRepairResourceItems().length, 8);
    assert.deepEqual(validateResourceItemRegistry(), []);

    const south = listDryUplandSaltpanRepairResourceItems().filter((item) => item.provenance.some((p) => p.placeId === 'south-redstone-reach'));
    assert.ok(south.some((item) => item.tags.includes('grass') && item.tags.includes('fiber')));
    assert.ok(south.some((item) => item.tags.includes('food') && item.tags.includes('aromatic')));
    assert.ok(south.some((item) => item.tags.includes('resin') && item.tags.includes('alchemical')));

    const north = listDryUplandSaltpanRepairResourceItems().filter((item) => item.provenance.some((p) => p.placeId === 'north-redstone-reach'));
    assert.ok(north.some((item) => item.tags.includes('food') && item.tags.includes('shrub')));
    assert.ok(north.some((item) => item.tags.includes('medicine') && item.tags.includes('flower')));

    const saltpan = listDryUplandSaltpanRepairResourceItems().filter((item) => item.provenance.some((p) => p.placeId === 'emberwash-saltpan-verge'));
    assert.equal(saltpan.length, 3);
    assert.ok(saltpan.every((item) => item.tags.includes('halophyte')));
    assert.ok(saltpan.some((item) => item.tags.includes('food')));
    assert.ok(saltpan.some((item) => item.tags.includes('fiber')));
    assert.ok(saltpan.some((item) => item.tags.includes('decorative') && item.tags.includes('dye')));

    for (const source of listDryUplandSaltpanRepairGatheringSources()) {
        const item = getCanonicalResourceItem(source.outputItemId);
        assert.ok(item, source.outputItemId);
        assert.ok(item.provenance.some((p) => p.sourceId === source.id && p.placeId === source.placeId && p.action === source.action), source.id);
        assert.ok(getCanonicalGatheringSource(source.id), source.id);
    }
});

test('dry upland and saltpan descriptions include non-harvested botanical structure beyond resource nodes', () => {
    assert.match(getPlace('south-redstone-reach').description, /lichen|seedhead/i);
    assert.match(getPlace('south-redstone-reach').description, /scrub|bunchgrass/i);
    assert.match(getPlace('north-redstone-reach').description, /lichen|dwarf scrub/i);
    assert.match(getPlace('north-redstone-reach').description, /juniper|yarrow|bunchgrass/i);
    assert.match(getPlace('emberwash-saltpan-verge').description, /succulent|crust lichen/i);
    assert.match(getPlace('emberwash-saltpan-verge').description, /saltgrass|panbloom/i);
});

test('repair food raws and prepared outputs use practical consumption safety', () => {
    const thyme = getCanonicalResourceItem('item-redstone-stone-thyme');
    const juniper = getCanonicalResourceItem('item-redstone-wind-juniper-berry');
    const saltbrush = getCanonicalResourceItem('item-emberwash-saltbrush-shoot');

    assert.equal(thyme.consumption.mode, 'direct');
    assert.equal(juniper.consumption.mode, 'processRequired');
    assert.match(juniper.consumption.notes, /crush|cook/i);
    assert.equal(saltbrush.consumption.mode, 'processRequired');
    assert.match(saltbrush.consumption.notes, /rinse|blanch|cook/i);

    for (const id of [
        'item-redstone-stone-thyme-infusion',
        'item-redstone-juniper-millet-pot',
        'item-emberwash-saltbrush-pot-greens',
    ]) {
        const item = getProductionItem(id);
        assert.equal(item.consumption.mode, 'direct', id);
        assert.equal(item.consumption.hazard, 'none', id);
    }

    assert.equal(getProductionItem('item-redstone-ridge-yarrow-field-wash').consumption.mode, 'nonFood');
    assert.deepEqual(validateProductionCatalog(), []);
    assert.deepEqual(validateProductionItemCatalog(), []);
});

test('all eight repair raws have production demand and Pack v2 owns two bounded regional repair graphs', () => {
    assert.equal(listDryUplandSaltpanRepairProcessDefinitions().length, 8);
    const demanded = new Set(
        listDryUplandSaltpanRepairProcessDefinitions().flatMap((definition) => definition.inputs.map((entry) => entry.itemId)),
    );
    for (const id of RAW_IDS) assert.ok(demanded.has(id), `${id} lacks production demand`);
    for (const definition of listDryUplandSaltpanRepairProcessDefinitions()) assert.ok(getProductionDefinition(definition.id), definition.id);

    assert.deepEqual(validateContentPacks(REGIONAL_CONTENT_PACKS), []);
    const redstone = REGIONAL_CONTENT_PACKS.find((entry) => entry.id === 'pack-redstone-dry-upland-ecology-repair');
    const saltpan = REGIONAL_CONTENT_PACKS.find((entry) => entry.id === 'pack-emberwash-saltpan-ecology-repair');
    assert.ok(redstone);
    assert.ok(saltpan);
    assert.ok(redstone.dependencies.includes('pack-redstone-ecology-breadth'));
    assert.ok(redstone.dependencies.includes('pack-slatewater-foothills-ecology'));
    assert.ok(saltpan.dependencies.includes('pack-emberwash-badlands-ecology'));
});
