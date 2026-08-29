import test from 'node:test';
import assert from 'node:assert/strict';

import { getCanonicalPopulation, validateEcologyRegistry } from '../js/text/data/ecologyRegistry.js';
import {
    listGloamwoodEcologyFamilies,
    listGloamwoodGatheringSources,
    listGloamwoodPopulations,
    listGloamwoodSpecies,
    validateGloamwoodEcology,
} from '../js/text/data/gloamwoodEcology.js';
import { listGloamwoodProductionItems } from '../js/text/data/gloamwoodProductionItems.js';
import { listGloamwoodResourceItems } from '../js/text/data/gloamwoodResourceItems.js';
import { getMap } from '../js/text/data/maps.js';
import { validateNpcScheduleCatalog } from '../js/text/data/npcSchedules.js';
import { getPlace } from '../js/text/data/places.js';
import { getPointOfInterest } from '../js/text/data/pointsOfInterest.js';
import { getProductionDefinition, validateProductionCatalog } from '../js/text/data/productionCatalog.js';
import { getProductionItem, validateProductionItemCatalog } from '../js/text/data/productionItems.js';
import { REGIONAL_CONTENT_PACKS } from '../js/text/data/regionalContentPacks.js';
import { getCanonicalResourceItem, validateResourceItemRegistry } from '../js/text/data/resourceItemRegistry.js';
import { getRoute, listRoutes, validateRouteCatalog } from '../js/text/data/routeCatalog.js';
import { validateContentPacks } from '../js/text/systems/contentPackValidator.js';
import { getWorkstationTagsForPoi } from '../js/text/systems/workstationEngine.js';

test('Gloamwood establishes an old-growth barrier with Oldbough as the wagon limit', () => {
    const map = getMap('map-gloamwood');
    assert.deepEqual(map.placeIds, ['gloamwood-verge', 'oldbough-refuge', 'gloamwood-deep']);
    for (const placeId of map.placeIds) assert.equal(getPlace(placeId).mapId, map.id);

    const cart = getRoute('route-gloamwood-oldgrowth-cart-track');
    const deep = getRoute('route-gloamwood-deepwood-forester-trail');
    assert.deepEqual(new Set(cart.allowedModes), new Set(['walk', 'mount', 'wagon']));
    assert.deepEqual(new Set(deep.allowedModes), new Set(['walk', 'mount']));
    assert.equal(deep.allowedModes.includes('wagon'), false);
    assert.ok(cart.stops.some((stop) => stop.placeId === 'oldbough-refuge'));
    assert.ok(deep.stops.some((stop) => stop.placeId === 'oldbough-refuge'));

    const deepRoutes = listRoutes().filter((route) => route.stops.some((stop) => stop.placeId === 'gloamwood-deep'));
    assert.deepEqual(deepRoutes.map((route) => route.id), ['route-gloamwood-deepwood-forester-trail']);
    assert.match(getPlace('gloamwood-deep').description, /No road or ordinary map edge continues west.*Lethari heartland/i);
    assert.deepEqual(validateRouteCatalog(), []);
});

test('Gloamwood ecology is old-growth, provenance-complete, and does not manufacture hostility for loot', () => {
    assert.deepEqual(validateGloamwoodEcology(), []);
    assert.deepEqual(validateEcologyRegistry(), []);
    assert.deepEqual(validateResourceItemRegistry(), []);
    assert.equal(listGloamwoodEcologyFamilies().length, 4);
    assert.equal(listGloamwoodSpecies().length, 8);
    assert.equal(listGloamwoodPopulations().length, 8);
    assert.equal(listGloamwoodGatheringSources().length, 7);
    assert.equal(listGloamwoodResourceItems().length, 7);

    for (const species of listGloamwoodSpecies()) {
        assert.ok(['passive', 'wary', 'territorial'].includes(species.behavior.aggression), species.id);
        assert.equal(species.encounterTemplateId, null, species.id);
    }
    for (const population of listGloamwoodPopulations()) assert.ok(getCanonicalPopulation(population.id), population.id);
    for (const source of listGloamwoodGatheringSources()) {
        const item = getCanonicalResourceItem(source.outputItemId);
        assert.ok(item, source.outputItemId);
        assert.ok(item.provenance.some((entry) =>
            entry.sourceId === source.id
            && entry.placeId === source.placeId
            && entry.action === source.action
        ), source.id);
    }
});

test('Gloamwood food safety uses practical preparation rules and prepared foods are direct-ready', () => {
    const raincap = getCanonicalResourceItem('item-gloamwood-raincap');
    const nightberry = getCanonicalResourceItem('item-gloamwood-nightberry');
    assert.equal(raincap.consumption.mode, 'processRequired');
    assert.equal(raincap.consumption.hazard, 'rawIrritant');
    assert.ok(raincap.consumption.preparation.includes('cook-or-dry'));
    assert.equal(nightberry.consumption.mode, 'direct');
    assert.equal(nightberry.consumption.hazard, 'none');

    for (const id of ['item-gloamwood-cooked-raincaps', 'item-gloamwood-dried-raincaps', 'item-gloamwood-dried-nightberries']) {
        const item = getProductionItem(id);
        assert.equal(item.consumption.mode, 'direct', id);
        assert.equal(item.consumption.hazard, 'none', id);
    }
    assert.deepEqual(validateProductionCatalog(), []);
    assert.deepEqual(validateProductionItemCatalog(), []);
});

test('every new Gloamwood raw has production demand and the refuge exposes all required stations', () => {
    const rawIds = listGloamwoodResourceItems().map((entry) => entry.id);
    const processIds = [
        'cook-gloamwood-raincap-skillet',
        'process-gloamwood-dry-raincaps',
        'process-gloamwood-bitterbark-tannin',
        'process-gloamwood-season-ironoak',
        'process-gloamwood-dry-velvet-moss',
        'process-gloamwood-dry-nightberries',
        'process-gloamwood-candle-resin-sealant',
        'process-gloamwood-wash-bog-iron',
        'craft-gloamwood-route-repair-stakes',
        'craft-gloamwood-field-dressing-roll',
    ];
    const demanded = new Set(processIds.flatMap((id) => getProductionDefinition(id).inputs.map((entry) => entry.itemId)));
    for (const id of rawIds) assert.ok(demanded.has(id), `${id} lacks Gloamwood production demand`);
    assert.equal(listGloamwoodProductionItems().length, 10);

    const tags = new Set([
        ...getWorkstationTagsForPoi(getPointOfInterest('poi-oldbough-workyard')),
        ...getWorkstationTagsForPoi(getPointOfInterest('poi-oldbough-common-hearth')),
    ]);
    for (const tag of ['kitchen', 'workshop', 'woodshop']) assert.ok(tags.has(tag), tag);
});

test('Oldbough schedules and two-pack ownership validate without opening the Lethari corridor', () => {
    assert.deepEqual(validateNpcScheduleCatalog(), []);
    assert.deepEqual(validateContentPacks(REGIONAL_CONTENT_PACKS), []);

    const ecology = REGIONAL_CONTENT_PACKS.find((entry) => entry.id === 'pack-gloamwood-oldgrowth-ecology');
    const refuge = REGIONAL_CONTENT_PACKS.find((entry) => entry.id === 'pack-gloamwood-oldbough-refuge');
    assert.ok(ecology);
    assert.ok(refuge);
    assert.ok(refuge.dependencies.includes(ecology.id));
    assert.deepEqual(new Set(refuge.records.routes.map((entry) => entry.id)), new Set([
        'route-gloamwood-oldgrowth-cart-track',
        'route-gloamwood-deepwood-forester-trail',
    ]));
    assert.equal(refuge.records.routes.some((entry) => /lethari|mountain/i.test(entry.id)), false);
});
