import test from 'node:test';
import assert from 'node:assert/strict';

import {
    getCanonicalGatheringSource,
    getCanonicalSpecies,
    listCanonicalGatheringSources,
    listCanonicalPopulations,
    listCanonicalSpecies,
    validateEcologyRegistry,
} from '../js/text/data/ecologyRegistry.js';
import { listMaps } from '../js/text/data/maps.js';
import {
    getPlace,
    isCoordinateInsidePlace,
    listPlaces,
    ZONE_CONNECTIONS,
} from '../js/text/data/places.js';
import { listRegionalContentPacks } from '../js/text/data/regionalContentPacks.js';
import {
    listCanonicalResourceItems,
    validateResourceItemRegistry,
} from '../js/text/data/resourceItemRegistry.js';
import {
    listRoutes,
    validateRouteCatalog,
} from '../js/text/data/routeCatalog.js';
import { createSeedEnemies } from '../js/text/data/seedEntities.js';
import {
    isNavigableCoordinate,
    isTopologyPlace,
} from '../js/text/data/coordinates.js';
import { validateConnectedContentCatalogs } from '../js/text/data/contentCatalogRegistry.js';
import { validateContentPacks } from '../js/text/systems/contentPackValidator.js';
import { validateWorldData } from '../js/text/systems/validation.js';

test('ecology and geography registries validate as one connected canonical graph', () => {
    assert.deepEqual(validateWorldData(), []);
    assert.deepEqual(validateRouteCatalog(), []);
    assert.deepEqual(validateEcologyRegistry(), []);
    assert.deepEqual(validateResourceItemRegistry(), []);
    assert.deepEqual(validateConnectedContentCatalogs(), []);
    assert.deepEqual(validateContentPacks(listRegionalContentPacks()), []);
});

test('every place and map reference is reciprocal and every current place has an escape path', () => {
    const places = listPlaces();
    const maps = listMaps();
    const mapMembership = new Map();

    for (const map of maps) {
        for (const placeId of map.placeIds) {
            mapMembership.set(placeId, (mapMembership.get(placeId) ?? 0) + 1);
            assert.equal(getPlace(placeId)?.mapId, map.id, `${map.id} and ${placeId} must point to each other`);
        }
    }

    for (const place of places) {
        assert.equal(mapMembership.get(place.id), 1, `${place.id} should belong to exactly one authored map`);
    }

    const outbound = new Set(ZONE_CONNECTIONS.map((connection) => connection.from));
    for (const route of listRoutes()) {
        for (const [index, stop] of route.stops.entries()) {
            if (route.bidirectional || index < route.stops.length - 1) outbound.add(stop.placeId);
        }
    }
    for (const place of places) {
        assert.ok(outbound.has(place.id), `${place.id} has no outbound connection or route and can trap the player`);
    }
});

test('canonical route stop coordinates are usable and legacy zone edges do not duplicate route legs', () => {
    const routePairs = new Set();
    for (const route of listRoutes()) {
        for (const [index, stop] of route.stops.entries()) {
            const place = getPlace(stop.placeId);
            assert.ok(place, `${route.id} references missing place ${stop.placeId}`);
            if (stop.coordinate) {
                assert.ok(isCoordinateInsidePlace(place, stop.coordinate), `${route.id}/${stop.id} is outside ${place.id}`);
                if (isTopologyPlace(place)) {
                    assert.ok(isNavigableCoordinate(place, stop.coordinate, stop.coordinate.levelId), `${route.id}/${stop.id} is not navigable`);
                }
            }
            if (index >= route.stops.length - 1) continue;
            const next = route.stops[index + 1];
            routePairs.add(`${stop.placeId}->${next.placeId}`);
            if (route.bidirectional) routePairs.add(`${next.placeId}->${stop.placeId}`);
        }
    }

    for (const connection of ZONE_CONNECTIONS) {
        assert.equal(
            routePairs.has(`${connection.from}->${connection.to}`),
            false,
            `${connection.id} duplicates a canonical route leg and creates competing geography authority`,
        );
    }
});

test('species encounter templates, populations, sources, and resource provenance resolve end to end', () => {
    const enemyIds = new Set(createSeedEnemies().map((enemy) => enemy.id));

    for (const species of listCanonicalSpecies()) {
        assert.equal(getCanonicalSpecies(species.id)?.id, species.id);
        if (species.encounterTemplateId) {
            assert.ok(enemyIds.has(species.encounterTemplateId), `${species.id} references missing encounter template ${species.encounterTemplateId}`);
        }
    }

    for (const population of listCanonicalPopulations()) {
        assert.ok(getCanonicalSpecies(population.speciesId), `${population.id} references missing species ${population.speciesId}`);
        assert.ok(getPlace(population.placeId), `${population.id} references missing place ${population.placeId}`);
    }

    for (const source of listCanonicalGatheringSources()) {
        const item = listCanonicalResourceItems().find((candidate) => candidate.id === source.outputItemId);
        assert.ok(item, `${source.id} references missing output item ${source.outputItemId}`);
        assert.ok(getPlace(source.placeId), `${source.id} references missing place ${source.placeId}`);
        assert.ok(
            item.provenance.some((entry) => entry.sourceId === source.id && entry.placeId === source.placeId && entry.action === source.action),
            `${source.id} output provenance does not point back to the source`,
        );
    }

    for (const item of listCanonicalResourceItems()) {
        for (const provenance of item.provenance) {
            if (provenance.placeId) assert.ok(getPlace(provenance.placeId), `${item.id} references missing provenance place ${provenance.placeId}`);
            if (['flora', 'mineral', 'fishing'].includes(provenance.type)) {
                const source = getCanonicalGatheringSource(provenance.sourceId);
                assert.ok(source, `${item.id} references missing gathering source ${provenance.sourceId}`);
                assert.equal(source.outputItemId, item.id);
                assert.equal(source.placeId, provenance.placeId);
                assert.equal(source.action, provenance.action);
            }
            if (provenance.type === 'body') {
                assert.ok(enemyIds.has(provenance.sourceId), `${item.id} references missing body source ${provenance.sourceId}`);
            }
        }
    }
});
