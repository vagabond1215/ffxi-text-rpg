import test from 'node:test';
import assert from 'node:assert/strict';

import {
    getCanonicalGatheringSource,
    getCanonicalPopulation,
    validateEcologyRegistry,
} from '../js/text/data/ecologyRegistry.js';
import {
    listElderwoodRepairGatheringSources,
    listElderwoodRepairPopulations,
} from '../js/text/data/elderwoodRepairEcology.js';
import { listElderwoodRepairResourceItems } from '../js/text/data/elderwoodRepairResourceItems.js';
import { listElderwoodRepairProcessDefinitions } from '../js/text/data/elderwoodRepairProductionCatalog.js';
import { getProductionDefinition, validateProductionCatalog } from '../js/text/data/productionCatalog.js';
import { getProductionItem, validateProductionItemCatalog } from '../js/text/data/productionItems.js';
import { getCanonicalResourceItem, validateResourceItemRegistry } from '../js/text/data/resourceItemRegistry.js';
import { getPlace } from '../js/text/data/places.js';
import { REGIONAL_CONTENT_PACKS } from '../js/text/data/regionalContentPacks.js';
import { validateContentPacks } from '../js/text/systems/contentPackValidator.js';

const RAW_IDS = Object.freeze([
    'item-elderwood-wood-sorrel',
    'item-elderwood-wayleaf',
    'item-elderwood-bluebell-petal',
    'item-timbercross-river-mint',
    'item-timbercross-willowherb',
    'item-timbercross-sedge-fiber',
    'item-timbercross-river-currant',
    'item-timbercross-bronze-dace',
    'item-thornwall-cistern-moss',
    'item-thornwall-gaol-shelf-fungus',
]);

test('Legacy Elderwood repair fills East, Timbercross, and Old Gaol ecology with existing-family reuse', () => {
    assert.deepEqual(validateEcologyRegistry(), []);
    assert.equal(listElderwoodRepairPopulations().length, 9);
    for (const population of listElderwoodRepairPopulations()) assert.ok(getCanonicalPopulation(population.id), population.id);

    for (const id of [
        'population-east-elderwood-brush-hares',
        'population-east-elderwood-crownwood-harts',
        'population-east-elderwood-barkboars',
        'population-east-elderwood-moss-owls',
        'population-timbercross-bronze-dace',
        'population-timbercross-river-teal',
        'population-timbercross-bank-frogs',
        'population-thornwall-old-gaol-cellar-bats',
        'population-thornwall-old-gaol-webspiders',
    ]) assert.ok(getCanonicalPopulation(id), id);
});

test('Elderwood flora repair covers consumption, medicine, decorative dye, fiber, riparian and ruin substrate', () => {
    assert.equal(listElderwoodRepairGatheringSources().length, 10);
    assert.equal(listElderwoodRepairResourceItems().length, 10);
    assert.deepEqual(validateResourceItemRegistry(), []);

    const east = listElderwoodRepairResourceItems().filter((item) => item.provenance.some((p) => p.placeId === 'east-elderwood'));
    assert.ok(east.some((item) => item.tags.includes('food')));
    assert.ok(east.some((item) => item.tags.includes('medicine') || item.tags.includes('alchemical')));
    assert.ok(east.some((item) => item.tags.includes('decorative') || item.tags.includes('dye')));

    const timbercross = listElderwoodRepairResourceItems().filter((item) => item.provenance.some((p) => p.placeId === 'timbercross-landing'));
    assert.ok(timbercross.some((item) => item.tags.includes('food') && item.tags.includes('flora')));
    assert.ok(timbercross.some((item) => item.tags.includes('medicine')));
    assert.ok(timbercross.some((item) => item.tags.includes('fiber')));
    assert.ok(timbercross.some((item) => item.tags.includes('fish')));

    const gaol = listElderwoodRepairResourceItems().filter((item) => item.provenance.some((p) => p.placeId === 'thornwall-old-gaol'));
    assert.ok(gaol.some((item) => item.tags.includes('moss')));
    assert.ok(gaol.some((item) => item.tags.includes('fungus')));
    assert.equal(gaol.some((item) => item.tags.includes('food')), false);

    for (const source of listElderwoodRepairGatheringSources()) {
        const item = getCanonicalResourceItem(source.outputItemId);
        assert.ok(item, source.outputItemId);
        assert.ok(item.provenance.some((p) => p.sourceId === source.id && p.placeId === source.placeId && p.action === source.action), source.id);
        assert.ok(getCanonicalGatheringSource(source.id), source.id);
    }
});

test('Elderwood descriptions retain non-harvested botanical layers beyond resource nodes', () => {
    assert.match(getPlace('east-elderwood').description, /bracken|fern/i);
    assert.match(getPlace('east-elderwood').description, /moss|leaf litter/i);
    assert.match(getPlace('timbercross-landing').description, /alder|willow/i);
    assert.match(getPlace('timbercross-landing').description, /rush|sedge/i);
    assert.match(getPlace('thornwall-old-gaol').description, /moss/i);
    assert.match(getPlace('thornwall-old-gaol').description, /fung/i);
});

test('Legacy Elderwood food-capable raws and prepared outputs have practical safety metadata', () => {
    for (const id of ['item-elderwood-wood-sorrel','item-timbercross-river-mint','item-timbercross-river-currant']) {
        assert.equal(getCanonicalResourceItem(id).consumption.mode, 'direct', id);
    }
    const rawFish = getCanonicalResourceItem('item-timbercross-bronze-dace');
    assert.equal(rawFish.consumption.mode, 'processRequired');
    assert.equal(rawFish.consumption.hazard, 'pathogenRisk');
    assert.match(rawFish.consumption.notes, /clean|cook|smoke/i);

    const cleaned = getProductionItem('item-timbercross-cleaned-bronze-dace');
    assert.equal(cleaned.consumption.mode, 'processRequired');
    assert.equal(cleaned.consumption.hazard, 'pathogenRisk');

    for (const id of [
        'item-elderwood-sorrel-crabapple-relish',
        'item-timbercross-river-mint-tea',
        'item-timbercross-river-currant-compote',
        'item-timbercross-minted-dace-pot',
    ]) assert.equal(getProductionItem(id).consumption.mode, 'direct', id);

    assert.deepEqual(validateProductionCatalog(), []);
    assert.deepEqual(validateProductionItemCatalog(), []);
});

test('all ten Elderwood repair raws have direct production demand and Pack v2 owns the repair graph', () => {
    assert.equal(listElderwoodRepairProcessDefinitions().length, 11);
    const demanded = new Set(
        listElderwoodRepairProcessDefinitions().flatMap((definition) => definition.inputs.map((entry) => entry.itemId)),
    );
    for (const id of RAW_IDS) assert.ok(demanded.has(id), `${id} lacks production demand`);
    for (const definition of listElderwoodRepairProcessDefinitions()) assert.ok(getProductionDefinition(definition.id), definition.id);

    assert.deepEqual(validateContentPacks(REGIONAL_CONTENT_PACKS), []);
    const pack = REGIONAL_CONTENT_PACKS.find((entry) => entry.id === 'pack-elderwood-legacy-ecology-repair');
    assert.ok(pack);
    assert.ok(pack.dependencies.includes('pack-elderwood-opening'));
    assert.ok(pack.dependencies.includes('pack-elderwood-ecology-breadth'));
});
