import test from 'node:test';
import assert from 'node:assert/strict';

import { listRegionalContentPacks } from '../js/text/data/regionalContentPacks.js';
import {
    getCanonicalGatheringSource,
    listCanonicalEcologyFamilies,
    listCanonicalPopulations,
    listCanonicalSpecies,
    validateEcologyRegistry,
} from '../js/text/data/ecologyRegistry.js';
import { getEquipmentCatalogEntry } from '../js/text/data/equipmentCatalog.js';
import { getProductionDefinition, validateProductionCatalog } from '../js/text/data/productionCatalog.js';
import { getCanonicalResourceItem, listCanonicalResourceItems, validateResourceItemRegistry } from '../js/text/data/resourceItemRegistry.js';
import { createSeedEnemies } from '../js/text/data/seedEntities.js';
import { createNewGameState } from '../js/text/gameState.js';
import { validateContentPacks } from '../js/text/systems/contentPackValidator.js';
import { equipItem } from '../js/text/systems/equipmentEngine.js';
import { startGatheringWork, reconcileGatheringWork } from '../js/text/systems/gatheringWorkEngine.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { startProductionWork, reconcileProductionWork } from '../js/text/systems/productionEngine.js';
import { createDefeatedEnemyResourceOpportunity } from '../js/text/systems/resourceOpportunityEngine.js';
import { reconcileCharacterResourceRecoveries, startCharacterResourceRecovery } from '../js/text/systems/resourceRecoveryWorkAdapter.js';
import { gainWorkProficiency } from '../js/text/systems/workProficiencyEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

function add(state, item, quantity = 1) {
    const result = addItemToContainer(state.player.inventoryState, 'inventory', { ...item, quantity });
    assert.equal(result.ok, true, result.reason);
}

test('regional ecology breadth validates as one canonical registry and pack graph', () => {
    assert.deepEqual(validateEcologyRegistry(), []);
    assert.deepEqual(validateResourceItemRegistry(), []);
    assert.deepEqual(validateProductionCatalog(), []);
    assert.deepEqual(validateContentPacks(listRegionalContentPacks()), []);

    assert.ok(listCanonicalSpecies().length >= 16);
    assert.ok(listCanonicalPopulations().length >= 14);
    const packIds = new Set(listRegionalContentPacks().map((pack) => pack.id));
    assert.ok(packIds.has('pack-elderwood-ecology-breadth'));
    assert.ok(packIds.has('pack-redstone-ecology-breadth'));
    assert.ok(packIds.has('pack-starfen-ecology-breadth'));
});

test('ecology breadth covers missing animal families, underused environments, and staple/luxury resources', () => {
    const familyIds = new Set(listCanonicalEcologyFamilies().map((entry) => entry.id));
    const expectedFamilies = [
        'family-fox', 'family-otter', 'family-owl', 'family-bee', 'family-turtle',
        'family-marmot', 'family-lizard', 'family-scorpion', 'family-salamander', 'family-vulture',
        'family-frog', 'family-crab', 'family-waterfowl', 'family-mussel', 'family-spider',
    ];
    for (const familyId of expectedFamilies) assert.ok(familyIds.has(familyId), `missing ecology family ${familyId}`);

    assert.ok(listCanonicalEcologyFamilies().length >= 30);
    assert.ok(listCanonicalSpecies().length >= 31);
    assert.ok(listCanonicalPopulations().length >= 29);

    const populatedPlaces = new Set(listCanonicalPopulations().map((entry) => entry.placeId));
    for (const placeId of [
        'east-elderwood', 'timbercross-landing', 'north-redstone-reach',
        'deepvein-mine', 'east-starfen', 'sunken-archive',
    ]) {
        assert.ok(populatedPlaces.has(placeId), `expected ecology breadth in ${placeId}`);
    }

    const resources = listCanonicalResourceItems();
    const staples = resources.filter((item) => item.tags.includes('staple'));
    const luxuries = resources.filter((item) => item.tags.includes('luxury'));
    assert.ok(staples.length >= 6);
    assert.ok(luxuries.length >= 6);

    for (const item of [...staples, ...luxuries]) {
        const provenance = item.provenance[0];
        const source = getCanonicalGatheringSource(provenance.sourceId);
        assert.ok(source, `${item.id} should resolve to a canonical gathering source`);
        assert.equal(source.outputItemId, item.id);
        assert.equal(source.placeId, provenance.placeId);
        assert.equal(source.action, provenance.action);
    }
});

test('each anchor region has new environmental resources connected to production', () => {
    const cases = [
        ['source-west-elderwood-amber-resin-grove', 'item-elderwood-amber-resin', 'craft-elderwood-resin-board'],
        ['source-south-redstone-iron-vein', 'item-redstone-iron-ore', 'process-redstone-iron-bloom'],
        ['source-west-starfen-bluekelp-pool', 'item-starfen-bluekelp', 'cook-starfen-bluekelp-broth'],
    ];
    for (const [sourceId, itemId, processId] of cases) {
        const source = getCanonicalGatheringSource(sourceId);
        const item = getCanonicalResourceItem(itemId);
        const process = getProductionDefinition(processId);
        assert.ok(source);
        assert.ok(item);
        assert.ok(process.inputs.some((input) => input.itemId === itemId));
        assert.ok(item.sinks.some((sink) => ['processInput', 'craftIngredient'].includes(sink.type)));
    }
});

test('new regional source participates in timed gathering and preserves source provenance', () => {
    const state = createNewGameState();
    state.currentPlaceId = 'west-elderwood';
    add(state, getEquipmentCatalogEntry('field-knife'));
    assert.match(equipItem(state, 'Field Knife'), /Equipped Field Knife/);

    const started = startGatheringWork(state, 'source-west-elderwood-amber-resin-grove');
    assert.equal(started.ok, true);
    advanceWorldTime(state, started.data.task.durationSeconds);
    const [resolved] = reconcileGatheringWork(state);

    assert.equal(resolved.ok, true);
    const resin = state.player.inventory.find((item) => item.id === 'item-elderwood-amber-resin');
    assert.ok(resin);
    assert.equal(resin.provenance[0].sourceId, 'source-west-elderwood-amber-resin-grove');
});

test('regional hunting body recovery restores production sinks and can feed canonical crafting', () => {
    const state = createNewGameState();
    state.currentPlaceId = 'west-elderwood';
    const barkboar = createSeedEnemies().find((enemy) => enemy.id === 'enemy-elderwood-barkboar');
    assert.ok(barkboar);
    add(state, getEquipmentCatalogEntry('field-knife'));
    assert.match(equipItem(state, 'Field Knife'), /Equipped Field Knife/);

    const opportunity = createDefeatedEnemyResourceOpportunity(state, barkboar);
    const recovery = startCharacterResourceRecovery(state, opportunity.data.opportunity.id, 'skin', { rng: () => 0 });
    assert.equal(recovery.ok, true);
    advanceWorldTime(state, recovery.data.task.durationSeconds);
    const [finished] = reconcileCharacterResourceRecoveries(state);
    const hide = finished.items.find((item) => item.id === 'item-elderwood-barkboar-hide');
    assert.ok(hide);
    assert.equal(hide.provenance[0].type, 'body');
    assert.ok(hide.sinks.some((sink) => sink.type === 'craftIngredient'));

    add(state, getCanonicalResourceItem('item-elderwood-amber-resin'));
    const craft = startProductionWork(state, 'craft-elderwood-hide-binding', { stationTags: ['tannery'] });
    assert.equal(craft.ok, true);
    advanceWorldTime(state, craft.data.task.durationSeconds);
    const [crafted] = reconcileProductionWork(state);
    assert.equal(crafted.code, 'production.completed');
    assert.ok(state.player.inventory.some((item) => item.id === 'item-elderwood-hide-binding'));
});

test('higher-tier Redstone iron source and process use persistent proficiency rather than discipline identity', () => {
    const state = createNewGameState();
    state.currentPlaceId = 'south-redstone-reach';
    add(state, getEquipmentCatalogEntry('prospector-pick'));
    assert.match(equipItem(state, 'Prospector Pick'), /Equipped Prospector Pick/);
    gainWorkProficiency(state, 'mining', 2);
    gainWorkProficiency(state, 'metalworking', 2);

    const gather = startGatheringWork(state, 'source-south-redstone-iron-vein', { quantity: 2 });
    assert.equal(gather.ok, true);
    advanceWorldTime(state, gather.data.task.durationSeconds);
    reconcileGatheringWork(state);
    const process = startProductionWork(state, 'process-redstone-iron-bloom', { stationTags: ['forge'] });
    assert.equal(process.ok, true);
});
