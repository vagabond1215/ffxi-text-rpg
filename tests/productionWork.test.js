import test from 'node:test';
import assert from 'node:assert/strict';
import { useKnownPoi } from './helpers/localKnowledgeTestSupport.js';

import { getEquipmentCatalogEntry } from '../js/text/data/equipmentCatalog.js';
import { getProductionDefinition, validateProductionCatalog } from '../js/text/data/productionCatalog.js';
import { getProductionItem } from '../js/text/data/productionItems.js';
import { getResourceItem } from '../js/text/data/resourceItems.js';
import { createEnemy } from '../js/text/entities/entityFactory.js';
import { createInitialState, createNewGameState } from '../js/text/gameState.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { equipItem } from '../js/text/systems/equipmentEngine.js';
import { startGatheringWork, reconcileGatheringWork } from '../js/text/systems/gatheringWorkEngine.js';
import { moveInDirection } from '../js/text/systems/navigationEngine.js';
import { performLocalityPoiAction } from '../js/text/systems/localityEngine.js';
import {
    claimProductionOutputs,
    reconcileProductionWork,
    startProductionWork,
} from '../js/text/systems/productionEngine.js';
import { createDefeatedEnemyResourceOpportunity } from '../js/text/systems/resourceOpportunityEngine.js';
import {
    reconcileCharacterResourceRecoveries,
    startCharacterResourceRecovery,
} from '../js/text/systems/resourceRecoveryWorkAdapter.js';
import { collectAvailableWorkstationTags } from '../js/text/systems/workstationEngine.js';
import {
    gainWorkProficiency,
    getWorkProficiency,
    workDurationForProficiency,
} from '../js/text/systems/workProficiencyEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

function addItem(state, item, quantity = 1) {
    const result = addItemToContainer(state.player.inventoryState, 'inventory', { ...item, quantity });
    assert.equal(result.ok, true, result.reason);
}

function addEquipment(state, id) {
    const item = getEquipmentCatalogEntry(id);
    assert.ok(item, `missing equipment ${id}`);
    addItem(state, item, 1);
}

function hare() {
    return createEnemy({
        id: 'enemy-work-hare',
        name: 'Work Hare',
        family: 'hare',
        ecosystem: 'beast',
        zoneId: 'west-elderwood',
        level: 1,
        lootTableId: 'starterBeast',
    });
}

test('production catalog proves processing crafting cooking salvage and a lossy recycling loop', () => {
    assert.deepEqual(validateProductionCatalog(), []);
    const kinds = new Set([
        'process-redstone-copper-ingot',
        'craft-copper-trail-clasp',
        'cook-silverfin-sweetroot-stew',
        'salvage-copper-trail-clasp',
    ].map((id) => getProductionDefinition(id).kind));
    assert.deepEqual(kinds, new Set(['processing', 'crafting', 'cooking', 'salvage']));
    assert.equal(getProductionDefinition('salvage-copper-trail-clasp').outputs[0].quantity, 1);
    assert.equal(getProductionDefinition('process-copper-scrap-remelt').inputs[0].quantity, 2);
});

test('work proficiency improves duration but cannot be reduced by a lower later cap', () => {
    const state = createNewGameState();
    assert.equal(workDurationForProficiency(300, 0), 300);
    gainWorkProficiency(state, 'metalworking', 100);
    assert.equal(workDurationForProficiency(300, getWorkProficiency(state.player, 'metalworking')), 150);

    const result = gainWorkProficiency(state, 'metalworking', 10, { cap: 50 });
    assert.equal(result.after, 100);
    assert.equal(getWorkProficiency(state.player, 'metalworking'), 100);
});

test('environmental gathering is timed, uses equipped tool tags, gains character work proficiency, and owns movement', () => {
    const state = createNewGameState();
    state.currentPlaceId = 'south-redstone-reach';
    state.location = 'South Redstone Reach';
    addEquipment(state, 'prospector-pick');
    assert.match(equipItem(state, 'Prospector Pick'), /Equipped Prospector Pick/);

    const started = startGatheringWork(state, 'source-south-redstone-copper-seam', { quantity: 2 });
    assert.equal(started.ok, true);
    assert.equal(started.data.task.durationSeconds, 300);
    assert.equal(state.player.inventory.some((item) => item.id === 'item-redstone-copper-ore'), false);
    assert.match(moveInDirection(state, 'n').reason, /still in progress/);

    advanceWorldTime(state, 299);
    assert.deepEqual(reconcileGatheringWork(state), []);
    advanceWorldTime(state, 1);
    const [completed] = reconcileGatheringWork(state);

    assert.equal(completed.ok, true);
    const ore = state.player.inventory.find((item) => item.id === 'item-redstone-copper-ore');
    assert.equal(ore.quantity, 2);
    assert.equal(ore.provenance[0].sourceId, 'source-south-redstone-copper-seam');
    assert.equal(getWorkProficiency(state.player, 'mining'), 2);
});

test('processing consumes inputs at start and materializes provenance-bearing output only at completion', () => {
    const state = createNewGameState();
    addItem(state, getResourceItem('item-redstone-copper-ore'), 2);

    const started = startProductionWork(state, 'process-redstone-copper-ingot', { stationTags: ['forge'] });
    assert.equal(started.ok, true);
    assert.equal(state.player.inventory.some((item) => item.id === 'item-redstone-copper-ore'), false);
    assert.equal(state.player.inventory.some((item) => item.id === 'item-redstone-copper-ingot'), false);

    advanceWorldTime(state, 300);
    const [completed] = reconcileProductionWork(state);
    assert.equal(completed.ok, true);
    const ingot = state.player.inventory.find((item) => item.id === 'item-redstone-copper-ingot');
    assert.ok(ingot);
    assert.equal(ingot.provenance[0].type, 'crafting');
    assert.equal(ingot.provenance[0].action, 'process');
    assert.equal(ingot.provenance[0].sourceId, 'process-redstone-copper-ingot');
    assert.equal(ingot.provenance[0].data.inputSources[0].itemId, 'item-redstone-copper-ore');
    assert.equal(getWorkProficiency(state.player, 'metalworking'), 2);
});

test('crafted production equipment is a real equippable item rather than a log-only reward', () => {
    const state = createNewGameState();
    addItem(state, getProductionItem('item-redstone-copper-ingot'));
    addItem(state, getResourceItem('item-starfen-reed-fiber'));

    const started = startProductionWork(state, 'craft-copper-trail-clasp', { stationTags: ['forge'] });
    assert.equal(started.ok, true);
    advanceWorldTime(state, started.data.task.durationSeconds);
    reconcileProductionWork(state);

    assert.match(equipItem(state, 'Copper Trail Clasp'), /Equipped Copper Trail Clasp to waist/);
    assert.equal(state.player.equipment.waist.id, 'item-copper-trail-clasp');
});

test('completed production persists pending outputs when storage is full and claims them exactly once later', () => {
    const state = createNewGameState();
    addItem(state, getResourceItem('item-redstone-copper-ore'), 2);
    for (let index = 0; index < 29; index += 1) {
        state.player.inventoryState.containers.inventory.items.push({ id: `filler-${index}`, name: `Filler ${index}`, kind: 'misc', stackable: false, quantity: 1 });
    }
    assert.equal(state.player.inventory.length, 30);

    const started = startProductionWork(state, 'process-redstone-copper-ingot', { stationTags: ['forge'] });
    assert.equal(started.ok, true);
    assert.equal(state.player.inventory.length, 29);
    state.player.inventoryState.containers.inventory.items.push({ id: 'replacement-filler', name: 'Replacement Filler', kind: 'misc', stackable: false, quantity: 1 });

    advanceWorldTime(state, started.data.task.durationSeconds);
    const [pending] = reconcileProductionWork(state);
    assert.equal(pending.code, 'production.output-pending');
    assert.equal(state.player.inventory.some((item) => item.id === 'item-redstone-copper-ingot'), false);
    assert.equal(getWorkProficiency(state.player, 'metalworking'), 0);

    state.player.inventoryState.containers.inventory.items.pop();
    const claimed = claimProductionOutputs(state, started.data.work.id);
    assert.equal(claimed.code, 'production.completed');
    assert.equal(state.player.inventory.filter((item) => item.id === 'item-redstone-copper-ingot').length, 1);
    assert.equal(getWorkProficiency(state.player, 'metalworking'), 2);
    assert.equal(claimProductionOutputs(state, started.data.work.id).ok, false);
});

test('locality POI tags provide workstation context without exposing a separate facility database', () => {
    const state = createNewGameState({ nationId: 'mistmere' });
    assert.equal(state.currentPlaceId, 'mistmere-canal-ward');
    const focused = useKnownPoi(state, 'poi-waters-chomo-jinjahl', 'guild');
    assert.equal(focused.ok, true);
    assert.ok(collectAvailableWorkstationTags(state).includes('kitchen'));
});

test('character resource recovery automatically composes equipped tools and persistent work proficiency', () => {
    const state = createInitialState();
    state.currentPlaceId = 'west-elderwood';
    addEquipment(state, 'field-knife');
    assert.match(equipItem(state, 'Field Knife'), /Equipped Field Knife/);
    const created = createDefeatedEnemyResourceOpportunity(state, hare());

    const started = startCharacterResourceRecovery(state, created.data.opportunity.id, 'skin', { rng: () => 0 });
    assert.equal(started.ok, true);
    assert.match(moveInDirection(state, 'n').reason, /still in progress/);
    advanceWorldTime(state, 90);
    const [completed] = reconcileCharacterResourceRecoveries(state);

    assert.equal(completed.items.length, 1);
    assert.equal(getWorkProficiency(state.player, 'fieldDressing'), 1);
});
