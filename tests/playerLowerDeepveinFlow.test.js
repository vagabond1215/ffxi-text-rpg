import test from 'node:test';
import assert from 'node:assert/strict';

import { getCanonicalPopulation, validateEcologyRegistry } from '../js/text/data/ecologyRegistry.js';
import {
    listLowerDeepveinEcologyFamilies,
    listLowerDeepveinGatheringSources,
    listLowerDeepveinPopulations,
    listLowerDeepveinSpecies,
    validateLowerDeepveinEcology,
} from '../js/text/data/lowerDeepveinEcology.js';
import { listLowerDeepveinProductionItems } from '../js/text/data/lowerDeepveinProductionItems.js';
import { listLowerDeepveinResourceItems } from '../js/text/data/lowerDeepveinResourceItems.js';
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

test('Lower Deepvein establishes a controlled walk-only first Deep World leg and stops at Echoing Shelf', () => {
    const map = getMap('map-lower-deepvein');
    assert.deepEqual(map.placeIds, ['deepvein-lower-decline', 'lantern-sump-station', 'lower-deepvein-echoing-shelf']);
    for (const placeId of map.placeIds) assert.equal(getPlace(placeId).mapId, map.id);

    const decline = getRoute('route-lower-deepvein-haulage-decline');
    const shelf = getRoute('route-lower-deepvein-echoing-shelf');
    assert.deepEqual(decline.allowedModes, ['walk']);
    assert.deepEqual(shelf.allowedModes, ['walk']);
    assert.ok(decline.stops.some((stop) => stop.placeId === 'deepvein-mine'));
    assert.ok(decline.stops.some((stop) => stop.placeId === 'lantern-sump-station'));
    assert.ok(shelf.stops.some((stop) => stop.placeId === 'lantern-sump-station'));

    const edgeRoutes = listRoutes().filter((route) => route.stops.some((stop) => stop.placeId === 'lower-deepvein-echoing-shelf'));
    assert.deepEqual(edgeRoutes.map((route) => route.id), ['route-lower-deepvein-echoing-shelf']);
    assert.match(getPlace('lower-deepvein-echoing-shelf').description, /no ordinary route continues.*Korren/i);
    assert.deepEqual(validateRouteCatalog(), []);
});

test('Lower Deepvein ecology is provenance-complete and does not manufacture hostile cave wildlife', () => {
    assert.deepEqual(validateLowerDeepveinEcology(), []);
    assert.deepEqual(validateEcologyRegistry(), []);
    assert.deepEqual(validateResourceItemRegistry(), []);
    assert.equal(listLowerDeepveinEcologyFamilies().length, 3);
    assert.equal(listLowerDeepveinSpecies().length, 8);
    assert.equal(listLowerDeepveinPopulations().length, 8);
    assert.equal(listLowerDeepveinGatheringSources().length, 7);
    assert.equal(listLowerDeepveinResourceItems().length, 7);

    for (const species of listLowerDeepveinSpecies()) {
        assert.ok(['passive', 'wary', 'territorial'].includes(species.behavior.aggression), species.id);
        assert.equal(species.encounterTemplateId, null, species.id);
    }
    for (const population of listLowerDeepveinPopulations()) assert.ok(getCanonicalPopulation(population.id), population.id);
    for (const source of listLowerDeepveinGatheringSources()) {
        const item = getCanonicalResourceItem(source.outputItemId);
        assert.ok(item, source.outputItemId);
        assert.ok(
            item.provenance.some((entry) => entry.sourceId === source.id && entry.placeId === source.placeId && entry.action === source.action),
            source.id,
        );
    }

    const localSourceIds = new Set(listLowerDeepveinGatheringSources().map((entry) => entry.id));
    assert.equal(localSourceIds.has('source-deepvein-lead-seam'), false);
    assert.equal(localSourceIds.has('source-deepvein-silver-stringer'), false);
});

test('Lower Deepvein food safety keeps raw cave foods preparation-required and finished provisions direct-ready', () => {
    const lampcap = getCanonicalResourceItem('item-lower-deepvein-lampcap');
    const threadfin = getCanonicalResourceItem('item-lower-deepvein-threadfin');
    const crab = getCanonicalResourceItem('item-lower-deepvein-blind-sump-crab');

    assert.equal(lampcap.consumption.mode, 'processRequired');
    assert.equal(lampcap.consumption.hazard, 'rawIrritant');
    assert.ok(lampcap.consumption.preparation.includes('slice-and-cook'));

    for (const item of [threadfin, crab]) {
        assert.equal(item.consumption.mode, 'processRequired');
        assert.equal(item.consumption.hazard, 'pathogenRisk');
    }

    const fillet = getProductionItem('item-lower-deepvein-threadfin-fillet');
    assert.equal(fillet.consumption.mode, 'processRequired');
    assert.equal(fillet.consumption.hazard, 'pathogenRisk');

    for (const id of [
        'item-lower-deepvein-cooked-lampcaps',
        'item-lower-deepvein-salt-baked-threadfin',
        'item-lower-deepvein-boiled-sump-crab',
    ]) {
        const item = getProductionItem(id);
        assert.equal(item.consumption.mode, 'direct', id);
        assert.equal(item.consumption.hazard, 'none', id);
    }

    assert.deepEqual(validateProductionCatalog(), []);
    assert.deepEqual(validateProductionItemCatalog(), []);
});

test('every Lower Deepvein raw has production demand and Lantern Sump exposes kitchen and workshop support', () => {
    const rawIds = listLowerDeepveinResourceItems().map((entry) => entry.id);
    const processIds = [
        'cook-lower-deepvein-lampcaps',
        'process-lower-deepvein-clean-threadfin',
        'cook-lower-deepvein-salt-baked-threadfin',
        'cook-lower-deepvein-blind-sump-crab',
        'process-lower-deepvein-glowmoss-wick-cord',
        'process-lower-deepvein-refine-cave-salt',
        'process-lower-deepvein-polish-quartz',
        'process-lower-deepvein-fire-lamp-cup',
        'craft-lower-deepvein-reflector-lamp-kit',
        'craft-lower-deepvein-gallery-seep-packing',
    ];
    const demanded = new Set(processIds.flatMap((id) => getProductionDefinition(id).inputs.map((entry) => entry.itemId)));
    for (const id of rawIds) assert.ok(demanded.has(id), `${id} lacks Lower Deepvein production demand`);
    assert.equal(listLowerDeepveinProductionItems().length, 10);

    const tags = new Set([
        ...getWorkstationTagsForPoi(getPointOfInterest('poi-lantern-sump-lampworks')),
        ...getWorkstationTagsForPoi(getPointOfInterest('poi-lantern-sump-hearth')),
    ]);
    for (const tag of ['kitchen', 'workshop']) assert.ok(tags.has(tag), tag);
});

test('Lantern Sump schedules and two-pack ownership validate without opening a Korren route', () => {
    assert.deepEqual(validateNpcScheduleCatalog(), []);
    assert.deepEqual(validateContentPacks(REGIONAL_CONTENT_PACKS), []);

    const ecology = REGIONAL_CONTENT_PACKS.find((entry) => entry.id === 'pack-lower-deepvein-ecology');
    const station = REGIONAL_CONTENT_PACKS.find((entry) => entry.id === 'pack-lower-deepvein-lantern-sump');
    assert.ok(ecology);
    assert.ok(station);
    assert.ok(station.dependencies.includes(ecology.id));
    assert.deepEqual(new Set(station.records.routes.map((entry) => entry.id)), new Set([
        'route-lower-deepvein-haulage-decline',
        'route-lower-deepvein-echoing-shelf',
    ]));
    assert.equal(station.records.routes.some((entry) => /korren|gate-city|deep-road/i.test(entry.id)), false);
});
