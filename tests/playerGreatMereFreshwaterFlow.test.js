import test from 'node:test';
import assert from 'node:assert/strict';

import { getMap } from '../js/text/data/maps.js';
import { getConnectionsFrom, getPlace } from '../js/text/data/places.js';
import {
    getGreatMereGatheringSource,
    listGreatMereEcologyFamilies,
    listGreatMereGatheringSources,
    listGreatMerePopulations,
    listGreatMereSpecies,
    validateGreatMereEcology,
} from '../js/text/data/greatMereEcology.js';
import { listGreatMereResourceItems } from '../js/text/data/greatMereResourceItems.js';
import { listGreatMereProcessDefinitions } from '../js/text/data/greatMereProductionCatalog.js';
import { listGreatMereProductionItems } from '../js/text/data/greatMereProductionItems.js';
import { listCanonicalResourceItems, validateResourceItemRegistry } from '../js/text/data/resourceItemRegistry.js';
import { listProductionItems, validateProductionItemCatalog } from '../js/text/data/productionItems.js';
import { getProductionDefinition, validateProductionCatalog } from '../js/text/data/productionCatalog.js';
import { getServiceJourney, validateRouteCatalog } from '../js/text/data/routeCatalog.js';
import { REGIONAL_CONTENT_PACKS } from '../js/text/data/regionalContentPacks.js';
import { validateEcologyRegistry } from '../js/text/data/ecologyRegistry.js';
import { createNewGameState } from '../js/text/gameState.js';
import { advanceActiveActivityToCompletion } from '../js/text/systems/activityAdvanceEngine.js';
import { validateContentPacks } from '../js/text/systems/contentPackValidator.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { createPlayerInformationModel } from '../js/text/systems/playerInformationEngine.js';
import { startProductionWork } from '../js/text/systems/productionEngine.js';
import { validateWorldData } from '../js/text/systems/validation.js';
import { gainWorkProficiency } from '../js/text/systems/workProficiencyEngine.js';

function addItem(state, item, quantity = 1) {
    const result = addItemToContainer(state.player.inventoryState, 'inventory', { ...item, quantity });
    assert.equal(result.ok, true, result.reason);
}

function quantity(state, itemId) {
    return state.player.inventory
        .filter((item) => item.id === itemId || item.templateId === itemId)
        .reduce((sum, item) => sum + Math.max(1, Number(item.quantity) || 1), 0);
}

test('Great Mere geography is reciprocal, connected, and preserves boat-only deep-water boundaries', () => {
    assert.deepEqual(validateWorldData(), []);
    assert.deepEqual(validateRouteCatalog(), []);

    const map = getMap('map-great-mere');
    assert.deepEqual(map.placeIds, ['great-mere-westshore', 'merewatch-landing', 'reedcrown-isle']);
    for (const placeId of map.placeIds) assert.equal(getPlace(placeId).mapId, map.id);

    assert.equal(
        getConnectionsFrom('reedcrown-isle').some((entry) => ['walk', 'mount'].includes(entry.mode)),
        false,
        'Reedcrown Isle must not gain a fake overland edge',
    );

    const journey = getServiceJourney('service-great-mere-ferry', 'mistmere-reedport', 'reedcrown-isle');
    assert.ok(journey);
    assert.equal(journey.segmentCount, 2);
    assert.equal(journey.distanceYalms, 16000);
    assert.equal(journey.durationSeconds, 4200);

    const shoreJourney = getServiceJourney('service-great-mere-ferry', 'merewatch-landing', 'reedcrown-isle');
    assert.ok(shoreJourney);
    assert.equal(shoreJourney.segmentCount, 1);
});

test('Great Mere has coherent freshwater flora fauna populations sources and resource provenance', () => {
    assert.deepEqual(validateGreatMereEcology(), []);
    assert.deepEqual(validateEcologyRegistry(), []);
    assert.deepEqual(validateResourceItemRegistry(), []);

    assert.equal(listGreatMereEcologyFamilies().length, 5);
    assert.equal(listGreatMereSpecies().length, 7);
    assert.equal(listGreatMerePopulations().length, 7);
    assert.equal(listGreatMereGatheringSources().length, 9);
    assert.equal(listGreatMereResourceItems().length, 9);

    const westshorePops = listGreatMerePopulations().filter((entry) => entry.placeId === 'great-mere-westshore');
    const islandPops = listGreatMerePopulations().filter((entry) => entry.placeId === 'reedcrown-isle');
    const westshoreSources = listGreatMereGatheringSources().filter((entry) => entry.placeId === 'great-mere-westshore');
    const islandSources = listGreatMereGatheringSources().filter((entry) => entry.placeId === 'reedcrown-isle');

    assert.ok(westshorePops.length >= 5);
    assert.ok(islandPops.length >= 2);
    assert.ok(westshoreSources.length >= 8);
    assert.ok(islandSources.some((entry) => entry.id === 'source-great-mere-cloudwater-pearl-bed'));

    for (const species of listGreatMereSpecies()) {
        assert.ok(['passive', 'wary'].includes(species.behavior.aggression), `${species.id} should remain ordinary wildlife`);
        assert.equal(species.encounterTemplateId, null);
    }

    for (const source of listGreatMereGatheringSources()) {
        const item = listGreatMereResourceItems().find((entry) => entry.id === source.outputItemId);
        assert.ok(item, `missing resource for ${source.id}`);
        assert.ok(item.provenance.some((entry) =>
            entry.sourceId === source.id
            && entry.placeId === source.placeId
            && entry.action === source.action
        ));
    }
});

test('all canonical food-tagged resources and production outputs explicitly state consumption safety', () => {
    assert.deepEqual(validateProductionItemCatalog(), []);
    assert.deepEqual(validateProductionCatalog(), []);

    const foods = [...listCanonicalResourceItems(), ...listProductionItems()]
        .filter((item) => item.tags?.includes('food'));

    assert.ok(foods.length > 20);
    for (const item of foods) {
        assert.equal(item.consumption.explicit, true, `${item.id} must explicitly state whether it is ready to eat`);
        assert.ok(['direct', 'processRequired'].includes(item.consumption.mode), `${item.id} has invalid food consumption mode`);
        if (item.consumption.mode === 'direct') assert.equal(item.consumption.hazard, 'none');
        if (item.consumption.mode === 'processRequired') assert.ok(item.consumption.preparation.length > 0);
    }
});

test('every preparation-required Great Mere raw food has a production path and Bitterflag is explicitly toxic raw', () => {
    const processes = listGreatMereProcessDefinitions();
    const processInputs = new Set(processes.flatMap((entry) => entry.inputs.map((input) => input.itemId)));
    const raws = listGreatMereResourceItems();

    for (const item of raws.filter((entry) => entry.tags.includes('food') && entry.consumption.mode === 'processRequired')) {
        assert.ok(processInputs.has(item.id), `${item.id} needs a processing recipe in the same zone tranche`);
        assert.equal(item.sinks.some((sink) => sink.type === 'consume'), false);
    }

    const bitterflag = raws.find((entry) => entry.id === 'item-great-mere-bitterflag-rhizome');
    assert.equal(bitterflag.consumption.mode, 'processRequired');
    assert.equal(bitterflag.consumption.hazard, 'rawToxic');
    assert.match(bitterflag.consumption.notes, /Poisonous if eaten raw/i);

    const detox = getProductionDefinition('process-great-mere-detox-bitterflag');
    assert.equal(detox.inputs[0].itemId, bitterflag.id);
    assert.equal(detox.outputs[0].itemId, 'item-great-mere-bitterflag-starch');

    const safeStarch = listGreatMereProductionItems().find((entry) => entry.id === 'item-great-mere-bitterflag-starch');
    assert.equal(safeStarch.consumption.hazard, 'none');
    assert.equal(safeStarch.consumption.mode, 'processRequired');
});

test('Great Mere processing preserves intermediate provenance through a safe fish ration', () => {
    const state = createNewGameState({ nationId: 'mistmere', name: 'Merewatch Auditor' });
    state.currentPlaceId = 'merewatch-landing';
    state.location = 'Merewatch Landing';
    gainWorkProficiency(state, 'cooking', 2);

    const perchSource = getGreatMereGatheringSource('source-great-mere-silver-perch-shoal');
    const perch = listGreatMereResourceItems().find((entry) => entry.id === perchSource.outputItemId);
    const salt = listCanonicalResourceItems().find((entry) => entry.id === 'item-redstone-rock-salt');
    addItem(state, perch, 1);
    addItem(state, salt, 1);

    let result = startProductionWork(state, 'process-great-mere-clean-perch', { stationTags: ['kitchen'] });
    assert.equal(result.ok, true, result.display?.text);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(quantity(state, 'item-great-mere-perch-fillet'), 2);

    result = startProductionWork(state, 'cook-great-mere-smoked-perch', { stationTags: ['kitchen'] });
    assert.equal(result.ok, true, result.display?.text);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(quantity(state, 'item-great-mere-smoked-perch-ration'), 2);

    const ration = state.player.inventory.find((item) => item.id === 'item-great-mere-smoked-perch-ration');
    assert.equal(ration.consumption.mode, 'direct');
    assert.equal(ration.consumption.hazard, 'none');
    assert.ok(ration.provenance[0].data.inputSources.some((input) =>
        input.itemId === 'item-great-mere-perch-fillet'
        && input.provenance.some((entry) => entry.sourceId === 'process-great-mere-clean-perch')
    ));
});

test('toxic and ready-to-eat item labels are visible on the player information surface', () => {
    const state = createNewGameState({ nationId: 'mistmere', name: 'Lake Cook' });
    const bitterflag = listGreatMereResourceItems().find((entry) => entry.id === 'item-great-mere-bitterflag-rhizome');
    const cress = listGreatMereResourceItems().find((entry) => entry.id === 'item-great-mere-lake-cress');
    addItem(state, bitterflag, 1);
    addItem(state, cress, 1);

    const carried = createPlayerInformationModel(state).preparation.containers
        .flatMap((container) => container.items);

    const bitterflagView = carried.find((entry) => entry.itemId === bitterflag.id);
    const cressView = carried.find((entry) => entry.itemId === cress.id);
    assert.match(bitterflagView.consumptionLabel, /toxic if eaten raw/i);
    assert.match(bitterflagView.consumptionLabel, /slice, leach, boil/i);
    assert.equal(cressView.consumptionLabel, 'Safe to consume as-is');
});

test('Great Mere packs own the lake ecology and Merewatch service-production graph without dangling refs', () => {
    assert.deepEqual(validateContentPacks(REGIONAL_CONTENT_PACKS), []);

    const ecology = REGIONAL_CONTENT_PACKS.find((pack) => pack.id === 'pack-great-mere-freshwater-ecology');
    const merewatch = REGIONAL_CONTENT_PACKS.find((pack) => pack.id === 'pack-great-mere-merewatch');
    assert.ok(ecology);
    assert.ok(merewatch);

    assert.ok(ecology.dependencies.includes('pack-starfen-ecology-breadth'));
    assert.ok(ecology.dependencies.includes('pack-elderwood-ecology-breadth'));
    assert.ok(merewatch.dependencies.includes(ecology.id));
    assert.equal(merewatch.records.recipes.length, 22);
    assert.equal(merewatch.records.items.length, 23);
});
