import test from 'node:test';
import assert from 'node:assert/strict';

import { getMap } from '../js/text/data/maps.js';
import { getCanonicalPopulation, validateEcologyRegistry } from '../js/text/data/ecologyRegistry.js';
import { getCanonicalResourceItem, validateResourceItemRegistry } from '../js/text/data/resourceItemRegistry.js';
import { getProductionDefinition, validateProductionCatalog } from '../js/text/data/productionCatalog.js';
import { getProductionItem, validateProductionItemCatalog } from '../js/text/data/productionItems.js';
import { getRoute, validateRouteCatalog } from '../js/text/data/routeCatalog.js';
import { REGIONAL_CONTENT_PACKS } from '../js/text/data/regionalContentPacks.js';
import { validateContentPacks } from '../js/text/systems/contentPackValidator.js';
import { describeItemConsumption } from '../js/text/data/itemSchema.js';
import { getPlace } from '../js/text/data/places.js';
import { getPointOfInterest } from '../js/text/data/pointsOfInterest.js';
import { createNewGameState } from '../js/text/gameState.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { performPlayerAttack } from '../js/text/systems/combatActionEngine.js';
import { getPopulationAvailability } from '../js/text/systems/ecologyEngine.js';
import { listPopulationEncounterOptions, startPopulationEncounter } from '../js/text/systems/populationEncounterEngine.js';
import { getWorkstationTagsForPoi } from '../js/text/systems/workstationEngine.js';

function stateAt(placeId) {
    const state = createNewGameState({ nationId: 'thornwall', name: 'Headwater Auditor' });
    const place = getPlace(placeId);
    const moved = setPositionAndDiscover(state, place.id, place.coordinateSystem.start);
    assert.equal(moved.ok, true, moved.reason);
    return state;
}

test('Headwater Vale establishes the Timbercross headwaters with a wagon-limited upper approach', () => {
    const map = getMap('map-headwater-vale');
    assert.deepEqual(map.placeIds, ['headwater-lower-vale', 'headwater-warden-lodge', 'headwater-upper-vale']);
    const lower = getRoute('route-timbercross-headwater-road');
    const upper = getRoute('route-headwater-upper-trail');
    assert.ok(lower.allowedModes.includes('wagon'));
    assert.ok(lower.allowedModes.includes('mount'));
    assert.equal(upper.allowedModes.includes('wagon'), false);
    assert.deepEqual(new Set(upper.allowedModes), new Set(['walk', 'mount']));
    assert.ok(lower.segments.some((entry) => entry.hazardTags.includes('bridge-crossing')));
    assert.ok(upper.segments[0].hazardTags.includes('steep-side-ridges'));
    assert.ok(upper.segments[0].hazardTags.includes('spring-flood'));
    assert.deepEqual(validateRouteCatalog(), []);
});

test('Headwater ecology and resources validate with fish, forest wildlife, and exact provenance', () => {
    assert.deepEqual(validateEcologyRegistry(), []);
    assert.deepEqual(validateResourceItemRegistry(), []);
    for (const id of [
        'population-headwater-red-deer',
        'population-headwater-coldstream-trout',
        'population-headwater-river-otters',
        'population-headwater-embercoat-foxes',
        'population-headwater-moss-owls',
        'population-headwater-moss-shell-turtles',
    ]) assert.ok(getCanonicalPopulation(id), id);
    const trout = getCanonicalResourceItem('item-headwater-coldstream-trout');
    assert.ok(trout.provenance.some((entry) => entry.sourceId === 'source-headwater-coldstream-trout-run' && entry.placeId === 'headwater-lower-vale' && entry.action === 'fish'));
    const hide = getCanonicalResourceItem('item-headwater-red-deer-hide');
    assert.ok(hide.provenance.some((entry) => entry.sourceId === 'enemy-headwater-red-deer' && entry.placeId === 'headwater-upper-vale' && entry.action === 'skin'));
});

test('population-backed red deer hunting depletes only on victory and preserves body recovery', () => {
    const state = stateAt('headwater-upper-vale');
    const options = listPopulationEncounterOptions(state, { includeInactive: true });
    assert.ok(options.some((entry) => entry.speciesId === 'species-headwater-red-deer'));
    const before = getPopulationAvailability(state, 'population-headwater-red-deer').availableUnits;
    const started = startPopulationEncounter(state, 'Headwater Red Deer', { rng: () => 0 });
    assert.equal(started.ok, true, started.display?.text);
    assert.equal(getPopulationAvailability(state, 'population-headwater-red-deer').availableUnits, before);
    const enemy = state.activeBattle.combatants.find((entry) => entry.type === 'enemy');
    enemy.resources.hp = 1;
    const result = performPlayerAttack(state);
    assert.match(result, /Battle: victory/);
    assert.equal(getPopulationAvailability(state, 'population-headwater-red-deer').availableUnits, before - 1);
    const body = state.activeBattle.rewards.resourceOpportunities[0];
    assert.equal(body.type, 'body');
    assert.ok(body.outputs.some((entry) => entry.itemId === 'item-headwater-red-deer-hide' && entry.recoveryAction === 'skin'));
    assert.ok(body.outputs.some((entry) => entry.itemId === 'item-headwater-red-deer-venison' && entry.recoveryAction === 'butcher'));
    assert.ok(body.outputs.some((entry) => entry.itemId === 'item-headwater-red-deer-antler' && entry.recoveryAction === 'butcher'));
});

test('Headwater raw fish and game use practical safety language while prepared foods are ready to eat', () => {
    const rawFish = getCanonicalResourceItem('item-headwater-coldstream-trout');
    const rawVenison = getCanonicalResourceItem('item-headwater-red-deer-venison');
    assert.equal(rawFish.consumption.mode, 'processRequired');
    assert.equal(rawFish.consumption.hazard, 'pathogenRisk');
    assert.equal(rawVenison.consumption.mode, 'processRequired');
    assert.equal(rawVenison.consumption.hazard, 'pathogenRisk');
    assert.match(describeItemConsumption(rawFish), /cause sickness if eaten raw/i);
    assert.match(describeItemConsumption(rawVenison), /cause sickness if eaten raw/i);
    for (const id of ['item-headwater-trout-cress-stew', 'item-headwater-alder-smoked-trout', 'item-headwater-smoked-venison']) {
        assert.equal(getProductionItem(id).consumption.mode, 'direct', id);
    }
    assert.deepEqual(validateProductionCatalog(), []);
    assert.deepEqual(validateProductionItemCatalog(), []);
});

test('Headwater lodge POIs expose the workstations used by its local production graph', () => {
    const tags = new Set([
        ...getWorkstationTagsForPoi(getPointOfInterest('poi-headwater-riverworks-yard')),
        ...getWorkstationTagsForPoi(getPointOfInterest('poi-headwater-common-hearth')),
    ]);
    for (const required of ['kitchen', 'workshop', 'woodshop', 'tannery']) assert.ok(tags.has(required), required);
});

test('every new Headwater raw has production demand and packs own the connected regional graph', () => {
    const rawIds = [
        'item-headwater-coldstream-trout', 'item-headwater-spring-cress', 'item-headwater-meadowsweet',
        'item-headwater-alder-bark', 'item-headwater-willow-withe', 'item-headwater-alder-timber',
        'item-headwater-red-deer-hide', 'item-headwater-red-deer-venison', 'item-headwater-red-deer-antler',
    ];
    const recipeIds = [
        'process-headwater-dress-trout', 'cook-headwater-trout-cress-stew', 'process-headwater-alder-smoked-trout',
        'process-headwater-dry-meadowsweet', 'process-headwater-alder-tanned-leather', 'craft-headwater-antler-toggle-set',
        'process-headwater-alder-board', 'craft-headwater-willow-creel', 'process-headwater-smoked-venison',
        'craft-headwater-bridge-repair-kit',
    ];
    const demanded = new Set(recipeIds.flatMap((id) => getProductionDefinition(id).inputs.map((entry) => entry.itemId)));
    for (const id of rawIds) assert.ok(demanded.has(id), `${id} lacks Headwater production demand`);
    assert.deepEqual(validateContentPacks(REGIONAL_CONTENT_PACKS), []);
    const ecologyPack = REGIONAL_CONTENT_PACKS.find((entry) => entry.id === 'pack-headwater-vale-ecology');
    const valePack = REGIONAL_CONTENT_PACKS.find((entry) => entry.id === 'pack-headwater-vale');
    assert.ok(ecologyPack);
    assert.ok(valePack);
    assert.ok(valePack.dependencies.includes(ecologyPack.id));
    assert.ok(valePack.records.routes.some((entry) => entry.id === 'route-headwater-upper-trail'));
});
