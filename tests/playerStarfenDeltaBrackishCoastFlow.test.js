import test from 'node:test';
import assert from 'node:assert/strict';

import { getCanonicalPopulation, validateEcologyRegistry } from '../js/text/data/ecologyRegistry.js';
import { getMap } from '../js/text/data/maps.js';
import { validateNpcScheduleCatalog as validateNpcScheduleDefinitions } from '../js/text/data/npcSchedules.js';
import { getPlace } from '../js/text/data/places.js';
import { getPointOfInterest } from '../js/text/data/pointsOfInterest.js';
import { getProductionDefinition, validateProductionCatalog } from '../js/text/data/productionCatalog.js';
import { getProductionItem, validateProductionItemCatalog } from '../js/text/data/productionItems.js';
import { REGIONAL_CONTENT_PACKS } from '../js/text/data/regionalContentPacks.js';
import { getCanonicalResourceItem, validateResourceItemRegistry } from '../js/text/data/resourceItemRegistry.js';
import { getRoute, getServiceJourney, listRoutes, validateRouteCatalog } from '../js/text/data/routeCatalog.js';
import {
    listStarfenDeltaEcologyFamilies,
    listStarfenDeltaGatheringSources,
    listStarfenDeltaPopulations,
    listStarfenDeltaSpecies,
    validateStarfenDeltaEcology,
} from '../js/text/data/starfenDeltaEcology.js';
import { listStarfenDeltaProductionItems } from '../js/text/data/starfenDeltaProductionItems.js';
import { listStarfenDeltaResourceItems } from '../js/text/data/starfenDeltaResourceItems.js';
import { validateContentPacks } from '../js/text/systems/contentPackValidator.js';
import { getWorkstationTagsForPoi } from '../js/text/systems/workstationEngine.js';

test('Starfen Delta realizes the Great Mere outflow while keeping the Eastern Sea outside walkable authority', () => {
    const map = getMap('map-starfen-delta');
    assert.deepEqual(map.placeIds, ['starfen-lower-delta', 'tideglass-landing', 'starfen-brackish-coast']);
    for (const placeId of map.placeIds) assert.equal(getPlace(placeId).mapId, map.id);

    const levee = getRoute('route-east-starfen-lower-delta-levee');
    const waterway = getRoute('route-great-mere-delta-waterway');
    const coast = getRoute('route-tideglass-brackish-coast-track');
    assert.deepEqual(new Set(levee.allowedModes), new Set(['walk', 'mount']));
    assert.deepEqual(waterway.allowedModes, ['ferry']);
    assert.deepEqual(new Set(coast.allowedModes), new Set(['walk', 'mount']));

    const coastRoutes = listRoutes().filter((route) => route.stops.some((stop) => stop.placeId === 'starfen-brackish-coast'));
    assert.deepEqual(coastRoutes.map((route) => route.id), ['route-tideglass-brackish-coast-track']);
    assert.equal(coastRoutes.some((route) => route.type === 'waterway'), false);
    assert.match(getPlace('starfen-brackish-coast').description, /Eastern Sea.*not a walkable map edge/i);

    assert.deepEqual(validateRouteCatalog(), []);
});

test('Mere-Delta packet boat crosses the basin and distributaries without creating an ocean service', () => {
    const journey = getServiceJourney('service-mere-delta-packet', 'merewatch-landing', 'tideglass-landing');
    assert.ok(journey);
    assert.equal(journey.segmentCount, 2);
    assert.equal(journey.distanceYalms, 20000);
    assert.equal(journey.durationSeconds, 6000);
    assert.equal(journey.route.id, 'route-great-mere-delta-waterway');
});

test('delta ecology is brackish/coastal, provenance-complete, and does not force ordinary wildlife into encounters', () => {
    assert.deepEqual(validateStarfenDeltaEcology(), []);
    assert.deepEqual(validateEcologyRegistry(), []);
    assert.deepEqual(validateResourceItemRegistry(), []);

    assert.equal(listStarfenDeltaEcologyFamilies().length, 4);
    assert.equal(listStarfenDeltaSpecies().length, 8);
    assert.equal(listStarfenDeltaPopulations().length, 8);
    assert.equal(listStarfenDeltaGatheringSources().length, 7);
    assert.equal(listStarfenDeltaResourceItems().length, 7);

    for (const species of listStarfenDeltaSpecies()) {
        assert.ok(['passive', 'wary', 'territorial'].includes(species.behavior.aggression), species.id);
        assert.equal(species.encounterTemplateId, null, `${species.id} should remain ordinary ecology in this tranche`);
    }
    for (const population of listStarfenDeltaPopulations()) {
        assert.ok(getCanonicalPopulation(population.id), population.id);
    }
    for (const source of listStarfenDeltaGatheringSources()) {
        const item = getCanonicalResourceItem(source.outputItemId);
        assert.ok(item, source.outputItemId);
        assert.ok(item.provenance.some((entry) =>
            entry.sourceId === source.id
            && entry.placeId === source.placeId
            && entry.action === source.action
        ), source.id);
    }
});

test('raw delta fish and shellfish require preparation while preserved/coooked outputs are direct-ready', () => {
    for (const id of ['item-delta-brackish-reed-eel', 'item-delta-saltflat-mud-crab', 'item-delta-tide-oyster']) {
        const item = getCanonicalResourceItem(id);
        assert.equal(item.consumption.mode, 'processRequired', id);
        assert.equal(item.consumption.hazard, 'pathogenRisk', id);
        assert.ok(item.consumption.preparation.length > 0, id);
    }
    for (const id of ['item-delta-smoked-eel', 'item-delta-boiled-mud-crab', 'item-delta-roasted-oysters', 'item-delta-dried-kelp', 'item-delta-pickled-samphire']) {
        assert.equal(getProductionItem(id).consumption.mode, 'direct', id);
        assert.equal(getProductionItem(id).consumption.hazard, 'none', id);
    }
    assert.deepEqual(validateProductionCatalog(), []);
    assert.deepEqual(validateProductionItemCatalog(), []);
});

test('every new delta raw is connected to production demand and oyster shucking preserves both meat and shell economies', () => {
    const rawIds = listStarfenDeltaResourceItems().map((entry) => entry.id);
    const processIds = [
        'process-delta-clean-eel',
        'process-delta-smoke-eel',
        'cook-delta-boiled-mud-crab',
        'process-delta-shuck-oysters',
        'cook-delta-roasted-oysters',
        'process-delta-shell-lime',
        'process-delta-dry-kelp',
        'process-delta-refine-sea-salt',
        'craft-delta-woven-reed-matting',
        'cook-delta-pickled-samphire',
    ];
    const demanded = new Set(processIds.flatMap((id) => getProductionDefinition(id).inputs.map((entry) => entry.itemId)));
    for (const id of rawIds) assert.ok(demanded.has(id), `${id} lacks production demand`);

    const shuck = getProductionDefinition('process-delta-shuck-oysters');
    assert.deepEqual(shuck.outputs, [
        { itemId: 'item-delta-oyster-meat', quantity: 2 },
        { itemId: 'item-delta-oyster-shell', quantity: 2 },
    ]);
    assert.ok(getProductionDefinition('process-delta-shell-lime').inputs.some((entry) => entry.itemId === 'item-delta-oyster-shell'));
    assert.equal(listStarfenDeltaProductionItems().length, 11);
});

test('Tideglass exposes the kitchen/workshop support used by its production graph and its schedules/packs validate', () => {
    const tags = new Set([
        ...getWorkstationTagsForPoi(getPointOfInterest('poi-tideglass-smokehouse')),
        ...getWorkstationTagsForPoi(getPointOfInterest('poi-tideglass-tideworks')),
    ]);
    assert.ok(tags.has('kitchen'));
    assert.ok(tags.has('workshop'));

    assert.deepEqual(validateNpcScheduleDefinitions(), []);
    assert.deepEqual(validateContentPacks(REGIONAL_CONTENT_PACKS), []);

    const ecology = REGIONAL_CONTENT_PACKS.find((entry) => entry.id === 'pack-starfen-delta-brackish-ecology');
    const landing = REGIONAL_CONTENT_PACKS.find((entry) => entry.id === 'pack-starfen-delta-tideglass');
    assert.ok(ecology);
    assert.ok(landing);
    assert.ok(landing.dependencies.includes(ecology.id));
    assert.ok(landing.records.transportServices.some((entry) => entry.id === 'service-mere-delta-packet'));
    assert.ok(landing.records.routes.some((entry) => entry.id === 'route-tideglass-brackish-coast-track'));
});
