import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { createEnemy } from '../js/text/entities/entityFactory.js';
import { listSemanticEvents } from '../js/text/systems/semanticEventEngine.js';
import {
    createDefeatedEnemyResourceOpportunity,
    describeResourceOpportunities,
    listResourceOpportunities,
    reconcileResourceRecoveries,
    RESOURCE_OPPORTUNITY_STATUSES,
    startResourceRecovery,
    validateResourceOpportunityState,
} from '../js/text/systems/resourceOpportunityEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

function hare() {
    return createEnemy({
        id: 'enemy-test-hare',
        name: 'Test Hare',
        family: 'hare',
        ecosystem: 'beast',
        zoneId: 'west-elderwood',
        level: 1,
        lootTableId: 'starterBeast',
    });
}

function raider() {
    return createEnemy({
        id: 'enemy-test-raider',
        name: 'Test Raider',
        family: 'goblin',
        ecosystem: 'raider',
        zoneId: 'west-elderwood',
        level: 1,
        lootTableId: 'starterGoblin',
    });
}


test('new games initialize an empty versioned resource-opportunity registry', () => {
    const state = createInitialState();

    assert.equal(state.resourceOpportunities.version, 1);
    assert.equal(state.resourceOpportunities.nextSequence, 1);
    assert.deepEqual(state.resourceOpportunities.records, []);
    assert.deepEqual(validateResourceOpportunityState(state.resourceOpportunities), []);
});

test('defeated beasts create body opportunities with recovery actions rather than inventory items', () => {
    const state = createInitialState();
    state.currentPlaceId = 'west-elderwood';

    const result = createDefeatedEnemyResourceOpportunity(state, hare(), { battleId: 'battle-test' });

    assert.equal(result.ok, true);
    assert.equal(result.data.opportunity.id, 'resource-000001');
    assert.equal(result.data.opportunity.type, 'body');
    assert.equal(result.data.opportunity.actions[0].id, 'skin');
    assert.equal(result.data.opportunity.outputs[0].itemId, 'wild-rabbit-hide');
    assert.equal(state.player.inventory.length, 0);
    assert.match(describeResourceOpportunities(state), /Test Hare/);
    const [event] = listSemanticEvents(state, { type: 'resource.opportunity-created' });
    assert.equal(event.data.opportunityId, 'resource-000001');
});

test('skinning exposes tool time proficiency condition and persisted outcome hooks before recovery starts', () => {
    const state = createInitialState();
    const created = createDefeatedEnemyResourceOpportunity(state, hare());
    const opportunityId = created.data.opportunity.id;

    const blocked = startResourceRecovery(state, opportunityId, 'skin');
    assert.equal(blocked.ok, false);
    assert.equal(blocked.code, 'resource.tool-required');
    assert.deepEqual(blocked.data.missingTools, ['cutting']);

    const started = startResourceRecovery(state, opportunityId, 'skin', {
        toolTags: ['cutting'],
        proficiencies: { fieldDressing: 0 },
        rng: () => 0.25,
    });
    assert.equal(started.ok, true);
    assert.equal(started.data.task.durationSeconds, 90);
    assert.equal(started.data.opportunity.actions[0].proficiencyId, 'fieldDressing');
    assert.equal(started.data.opportunity.actions[0].minCondition, 0.15);
    assert.deepEqual(started.data.opportunity.actions[0].outputRolls, [{ outputIndex: 0, roll: 0.25 }]);
});

test('completed recovery uses its persisted outcome roll and produces provenance-tagged material at the timed-task boundary', () => {
    const state = createInitialState();
    state.currentPlaceId = 'west-elderwood';
    const created = createDefeatedEnemyResourceOpportunity(state, hare());
    const opportunityId = created.data.opportunity.id;
    startResourceRecovery(state, opportunityId, 'skin', { toolTags: ['cutting'], rng: () => 0 });

    advanceWorldTime(state, 89);
    assert.deepEqual(reconcileResourceRecoveries(state, { rng: () => 1 }), []);
    assert.equal(state.player.inventory.length, 0);

    advanceWorldTime(state, 1);
    const completed = reconcileResourceRecoveries(state, { rng: () => 1 });
    assert.equal(completed.length, 1);
    assert.equal(completed[0].items.length, 1);
    const hide = state.player.inventory.find((item) => item.id === 'wild-rabbit-hide');
    assert.ok(hide);
    assert.equal(hide.provenance[0].type, 'body');
    assert.equal(hide.provenance[0].sourceId, 'enemy-test-hare');
    assert.equal(hide.provenance[0].action, 'skin');
    assert.equal(hide.sinks[0].type, 'trade');
    assert.equal(listResourceOpportunities(state)[0].status, RESOURCE_OPPORTUNITY_STATUSES.EXHAUSTED);
    const [event] = listSemanticEvents(state, { type: 'resource.recovery-completed' });
    assert.deepEqual(event.data.recoveredItemIds, ['wild-rabbit-hide']);
});

test('persisted failed outcome remains failed even if reconciliation receives a successful fallback rng', () => {
    const state = createInitialState();
    const created = createDefeatedEnemyResourceOpportunity(state, hare());
    startResourceRecovery(state, created.data.opportunity.id, 'skin', { toolTags: ['cutting'], rng: () => 0.9 });
    advanceWorldTime(state, 90);

    const [completed] = reconcileResourceRecoveries(state, { rng: () => 0 });

    assert.equal(completed.items.length, 0);
    assert.equal(state.player.inventory.length, 0);
});

test('raider rewards become searchable carried-inventory opportunities', () => {
    const state = createInitialState();
    const created = createDefeatedEnemyResourceOpportunity(state, raider());

    assert.equal(created.data.opportunity.type, 'carriedInventory');
    assert.equal(created.data.opportunity.actions[0].id, 'search');
    const started = startResourceRecovery(state, created.data.opportunity.id, 'search', { rng: () => 0 });
    assert.equal(started.ok, true);
    assert.equal(started.data.task.durationSeconds, 15);
});

test('recovery records storage failure without materializing an item outside inventory rules', () => {
    const state = createInitialState();
    for (let index = 0; index < 30; index += 1) {
        state.player.inventoryState.containers.inventory.items.push({
            id: `filler-${index}`,
            name: `Filler ${index}`,
            kind: 'misc',
            stackable: false,
            quantity: 1,
        });
    }
    const created = createDefeatedEnemyResourceOpportunity(state, hare());
    startResourceRecovery(state, created.data.opportunity.id, 'skin', { toolTags: ['cutting'], rng: () => 0 });
    advanceWorldTime(state, 90);

    const [completed] = reconcileResourceRecoveries(state);

    assert.equal(completed.items.length, 0);
    assert.equal(completed.failedItems.length, 1);
    assert.match(completed.failedItems[0].reason, /Inventory is full/);
    assert.equal(state.player.inventory.length, 30);
});

test('missing resource-opportunity registry initializes lazily without changing save version', () => {
    const state = createInitialState();
    const versionBefore = state.version;
    delete state.resourceOpportunities;

    const created = createDefeatedEnemyResourceOpportunity(state, hare());

    assert.equal(created.ok, true);
    assert.equal(state.resourceOpportunities.version, 1);
    assert.equal(state.version, versionBefore);
});
