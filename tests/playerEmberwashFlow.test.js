import test from 'node:test';
import assert from 'node:assert/strict';

import { getCanonicalPopulation, validateEcologyRegistry } from '../js/text/data/ecologyRegistry.js';
import {
    listEmberwashEcologyFamilies,
    listEmberwashGatheringSources,
    listEmberwashPopulations,
    listEmberwashSpecies,
    validateEmberwashEcology,
} from '../js/text/data/emberwashEcology.js';
import { listEmberwashProductionItems } from '../js/text/data/emberwashProductionItems.js';
import { listEmberwashResourceItems } from '../js/text/data/emberwashResourceItems.js';
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

test('Emberwash establishes a preparation-sensitive frontier with Cinderwell as the wagon limit', () => {
    const map = getMap('map-emberwash-badlands');
    assert.deepEqual(map.placeIds, ['emberwash-north-wash', 'cinderwell-station', 'emberwash-saltpan-verge']);
    for (const placeId of map.placeIds) assert.equal(getPlace(placeId).mapId, map.id);

    const road = getRoute('route-emberwash-cinderwell-caravan-road');
    const foretrail = getRoute('route-emberwash-saltpan-foretrail');
    assert.deepEqual(new Set(road.allowedModes), new Set(['walk', 'mount', 'wagon', 'caravan']));
    assert.deepEqual(new Set(foretrail.allowedModes), new Set(['walk', 'mount', 'caravan']));
    assert.equal(foretrail.allowedModes.includes('wagon'), false);
    assert.ok(road.stops.some((stop) => stop.placeId === 'cinderwell-station'));
    assert.ok(foretrail.stops.some((stop) => stop.placeId === 'cinderwell-station'));

    const edgeRoutes = listRoutes().filter((route) => route.stops.some((stop) => stop.placeId === 'emberwash-saltpan-verge'));
    assert.deepEqual(edgeRoutes.map((route) => route.id), ['route-emberwash-saltpan-foretrail']);
    assert.match(getPlace('emberwash-saltpan-verge').description, /No ordinary route continues south.*Veyra/i);
    assert.deepEqual(validateRouteCatalog(), []);
});

test('Emberwash ecology is arid-frontier, provenance-complete, and does not manufacture hostility for loot', () => {
    assert.deepEqual(validateEmberwashEcology(), []);
    assert.deepEqual(validateEcologyRegistry(), []);
    assert.deepEqual(validateResourceItemRegistry(), []);
    assert.equal(listEmberwashEcologyFamilies().length, 4);
    assert.equal(listEmberwashSpecies().length, 8);
    assert.equal(listEmberwashPopulations().length, 8);
    assert.equal(listEmberwashGatheringSources().length, 7);
    assert.equal(listEmberwashResourceItems().length, 7);

    for (const species of listEmberwashSpecies()) {
        assert.ok(['passive', 'wary', 'territorial'].includes(species.behavior.aggression), species.id);
        assert.equal(species.encounterTemplateId, null, species.id);
    }
    for (const population of listEmberwashPopulations()) assert.ok(getCanonicalPopulation(population.id), population.id);
    for (const source of listEmberwashGatheringSources()) {
        const item = getCanonicalResourceItem(source.outputItemId);
        assert.ok(item, source.outputItemId);
        assert.ok(
            item.provenance.some((entry) => entry.sourceId === source.id && entry.placeId === source.placeId && entry.action === source.action),
            source.id,
        );
    }
});

test('Emberwash food safety uses practical preparation rules and prepared foods are direct-ready', () => {
    const emberpod = getCanonicalResourceItem('item-emberwash-emberpod');
    const pear = getCanonicalResourceItem('item-emberwash-cinder-pear');

    assert.equal(emberpod.consumption.mode, 'processRequired');
    assert.equal(emberpod.consumption.hazard, 'none');
    assert.ok(emberpod.consumption.preparation.includes('grind-and-cook'));

    assert.equal(pear.consumption.mode, 'direct');
    assert.equal(pear.consumption.hazard, 'none');
    assert.ok(pear.consumption.preparation.includes('peel-and-despine'));

    assert.equal(getProductionItem('item-emberwash-emberpod-meal').consumption.mode, 'processRequired');
    for (const id of ['item-emberwash-trail-cakes', 'item-emberwash-dried-cinder-pear']) {
        const item = getProductionItem(id);
        assert.equal(item.consumption.mode, 'direct', id);
        assert.equal(item.consumption.hazard, 'none', id);
    }

    assert.deepEqual(validateProductionCatalog(), []);
    assert.deepEqual(validateProductionItemCatalog(), []);
});

test('every new Emberwash raw has production demand and Cinderwell exposes required stations', () => {
    const rawIds = listEmberwashResourceItems().map((entry) => entry.id);
    const processIds = [
        'process-emberwash-emberpod-meal',
        'cook-emberwash-trail-cakes',
        'process-emberwash-dry-cinder-pear',
        'process-emberwash-dry-desert-sage',
        'process-emberwash-cinderbrush-cord',
        'process-emberwash-caravan-salt',
        'process-emberwash-red-ochre-pigment',
        'process-emberwash-gypsum-plaster',
        'craft-emberwash-dustwrap-repair-kit',
        'craft-emberwash-cistern-patch',
    ];
    const demanded = new Set(processIds.flatMap((id) => getProductionDefinition(id).inputs.map((entry) => entry.itemId)));
    for (const id of rawIds) assert.ok(demanded.has(id), `${id} lacks Emberwash production demand`);
    assert.equal(listEmberwashProductionItems().length, 10);

    const tags = new Set([
        ...getWorkstationTagsForPoi(getPointOfInterest('poi-cinderwell-cistern-workyard')),
        ...getWorkstationTagsForPoi(getPointOfInterest('poi-cinderwell-shade-hearth')),
    ]);
    for (const tag of ['kitchen', 'workshop']) assert.ok(tags.has(tag), tag);
});

test('Cinderwell schedules and two-pack ownership validate without opening the southern/Veyra corridor', () => {
    assert.deepEqual(validateNpcScheduleCatalog(), []);
    assert.deepEqual(validateContentPacks(REGIONAL_CONTENT_PACKS), []);

    const ecology = REGIONAL_CONTENT_PACKS.find((entry) => entry.id === 'pack-emberwash-badlands-ecology');
    const station = REGIONAL_CONTENT_PACKS.find((entry) => entry.id === 'pack-emberwash-cinderwell-station');
    assert.ok(ecology);
    assert.ok(station);
    assert.ok(station.dependencies.includes(ecology.id));
    assert.deepEqual(new Set(station.records.routes.map((entry) => entry.id)), new Set([
        'route-emberwash-cinderwell-caravan-road',
        'route-emberwash-saltpan-foretrail',
    ]));
    assert.equal(station.records.routes.some((entry) => /veyra|strait/i.test(entry.id)), false);
});
