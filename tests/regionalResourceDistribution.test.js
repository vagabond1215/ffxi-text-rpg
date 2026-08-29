import test from 'node:test';
import assert from 'node:assert/strict';

import { getPointOfInterest } from '../js/text/data/pointsOfInterest.js';
import { getProductionDefinition } from '../js/text/data/productionCatalog.js';
import { listCanonicalResourceItems } from '../js/text/data/resourceItemRegistry.js';
import { getRoute, getTransportService } from '../js/text/data/routeCatalog.js';
import { getPlace } from '../js/text/data/places.js';
import { getWorkstationTagsForPoi } from '../js/text/systems/workstationEngine.js';

const TRADE_BASINS = Object.freeze({
    Elderwood: ['Elderwood', 'Crownfields', 'Slatewater Foothills', 'Redstone Reach'],
    Crownfields: ['Crownfields', 'Elderwood', 'Slatewater Foothills', 'Redstone Reach'],
    'Slatewater Foothills': ['Slatewater Foothills', 'Elderwood', 'Crownfields', 'Redstone Reach'],
    'Redstone Reach': ['Redstone Reach', 'Slatewater Foothills', 'Coppergrass Steppe', 'Starfen', 'Ironspine Highlands'],
    'Coppergrass Steppe': ['Coppergrass Steppe', 'Redstone Reach', 'Starfen'],
    Starfen: ['Starfen', 'Coppergrass Steppe', 'Redstone Reach', 'Great Mere'],
    'Great Mere': ['Great Mere', 'Starfen', 'Coppergrass Steppe', 'Redstone Reach'],
    'Ironspine Highlands': ['Ironspine Highlands', 'Redstone Reach', 'Slatewater Foothills'],
});

const ESSENTIAL_FAMILIES = Object.freeze({
    food: ['food', 'grain', 'pulse', 'fruit', 'berry', 'nut', 'meat', 'fish', 'shellfish', 'crustacean', 'starch'],
    structural: ['wood', 'timber', 'cane', 'stone', 'clay'],
    metal: ['ore', 'metal', 'iron', 'copper', 'tin', 'silver', 'gold', 'zinc'],
    binding: ['fiber', 'textile', 'cordage', 'hide', 'fur'],
    medicine: ['medicine', 'remedy', 'herb'],
    fuel: ['wood', 'timber', 'resin', 'fat', 'fuel'],
});

function resourceRegion(item) {
    const placeId = item.provenance?.find((entry) => entry.placeId)?.placeId ?? null;
    return placeId ? getPlace(placeId)?.region ?? null : null;
}

function covers(item, tags) {
    return (item.tags ?? []).some((tag) => tags.includes(tag));
}

test('each established economic area plus reliable nearby trade basin covers basic subsistence and craft families', () => {
    const resources = listCanonicalResourceItems();
    for (const [homeRegion, basinRegions] of Object.entries(TRADE_BASINS)) {
        const basinItems = resources.filter((item) => basinRegions.includes(resourceRegion(item)));
        for (const [family, tags] of Object.entries(ESSENTIAL_FAMILIES)) {
            assert.ok(
                basinItems.some((item) => covers(item, tags)),
                `${homeRegion} trade basin should cover ${family}`,
            );
        }
    }
});

test('common-sense biome omissions are represented as canonical local resources', () => {
    const byId = new Map(listCanonicalResourceItems().map((item) => [item.id, item]));
    const expected = {
        'item-crownfields-brick-clay': 'Crownfields',
        'item-starfen-alluvial-clay': 'Starfen',
        'item-starfen-marsh-willow-timber': 'Starfen',
        'item-coppergrass-thornwood': 'Coppergrass Steppe',
        'item-ironspine-stonepine-timber': 'Ironspine Highlands',
        'item-ironspine-pass-stone': 'Ironspine Highlands',
    };
    for (const [id, region] of Object.entries(expected)) {
        const item = byId.get(id);
        assert.ok(item, `missing resilience resource ${id}`);
        assert.equal(resourceRegion(item), region);
    }
});

test('forge fuel has regional substitute paths instead of depending only on Crown Oak', () => {
    const alternatives = {
        'process-material-charcoal-slatewater-spruce': 'item-slatewater-spruce-timber',
        'process-material-charcoal-starfen-willow': 'item-starfen-marsh-willow-timber',
        'process-material-charcoal-coppergrass-thornwood': 'item-coppergrass-thornwood',
        'process-material-charcoal-ironspine-stonepine': 'item-ironspine-stonepine-timber',
    };
    for (const [processId, inputId] of Object.entries(alternatives)) {
        const process = getProductionDefinition(processId);
        assert.ok(process, `missing substitute process ${processId}`);
        assert.ok(process.inputs.some((entry) => entry.itemId === inputId));
        assert.ok(process.outputs.some((entry) => entry.itemId === 'item-material-charcoal'));
    }
});

test('Great Mere can preserve a basic fish ration without imported rock salt at reduced yield', () => {
    const process = getProductionDefinition('process-great-mere-dry-smoke-perch');
    assert.ok(process);
    assert.deepEqual(process.inputs, [{ itemId: 'item-great-mere-perch-fillet', quantity: 2 }]);
    assert.deepEqual(process.outputs, [{ itemId: 'item-great-mere-smoked-perch-ration', quantity: 1 }]);
    assert.ok(!process.inputs.some((entry) => entry.itemId === 'item-redstone-rock-salt'));
});

test('reliable trade spine and practical light-craft hubs remain connected', () => {
    assert.equal(getTransportService('service-crownfields-produce-wagon')?.routeId, 'route-thornwall-crownfields-road');
    assert.equal(getTransportService('service-crown-forge-caravan')?.routeId, 'route-crown-forge-caravan-road');
    assert.equal(getTransportService('service-slatewater-foothill-caravan')?.routeId, 'route-crown-forge-caravan-road');
    assert.equal(getTransportService('service-forge-mere-caravan')?.routeId, 'route-forge-mere-caravan-road');
    assert.equal(getTransportService('service-great-mere-ferry')?.routeId, 'route-mistmere-great-mere-waterway');
    assert.ok(getRoute('route-redstone-ironspine-pass-road')?.allowedModes.includes('wagon'));
    assert.ok(getRoute('route-forge-mere-caravan-road')?.stops.some((stop) => stop.placeId === 'coppergrass-steppe'));

    const slatewater = getWorkstationTagsForPoi(getPointOfInterest('poi-slatewater-waylodge-hearth'));
    assert.ok(slatewater.includes('kitchen'));
    assert.ok(slatewater.includes('workshop'));

    const ironspine = getWorkstationTagsForPoi(getPointOfInterest('poi-ironspine-common-hearth'));
    assert.ok(ironspine.includes('kitchen'));
    assert.ok(ironspine.includes('workshop'));

    const mistmere = getWorkstationTagsForPoi(getPointOfInterest('poi-waters-baehu-faehu'));
    assert.ok(mistmere.includes('workshop'));
});
