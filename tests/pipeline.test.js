import test from 'node:test';
import assert from 'node:assert/strict';

import { describeDatabases, listDatabases } from '../js/text/data/databaseRegistry.js';
import { describeLegacyRecoveredData } from '../js/text/data/legacyRecoveredData.js';
import { createTickEngine } from '../js/text/systems/tickEngine.js';
import { describeSystemVersions, describeVersion, VERSION } from '../js/text/version.js';


test('version manifest exposes explicit app account save game state data and benchmark versions', () => {
    assert.equal(VERSION.app, '0.4.1');
    assert.equal(VERSION.accountSave, 3);
    assert.equal(VERSION.gameState, 2);
    assert.equal(VERSION.data, 12);
    assert.equal(VERSION.benchmark, 1);
    assert.equal(VERSION.save, VERSION.accountSave);
    assert.match(describeVersion(), /App: 0.4.1/);
    assert.match(describeVersion(), /Account Save: 3/);
    assert.match(describeVersion(), /Game State: 2/);
    assert.match(describeSystemVersions(), /characterCreation/);
    assert.match(describeSystemVersions(), /canvasUi: 0.6.0/);
    assert.match(describeSystemVersions(), /battleRewards: 0.5.2/);
    assert.match(describeSystemVersions(), /itemSchema: 0.6.0/);
    assert.match(describeSystemVersions(), /equipmentEligibility: 0.5.0/);
    assert.match(describeSystemVersions(), /skillCaps: 0.5.1/);
    assert.match(describeSystemVersions(), /skillProgression: 0.5.1/);
    assert.match(describeSystemVersions(), /leveling: 0.5.3/);
});

test('database registry includes major planned systems and recovered legacy data', () => {
    const ids = listDatabases().map((database) => database.id);

    assert.ok(ids.includes('places'));
    assert.ok(ids.includes('maps'));
    assert.ok(ids.includes('nations'));
    assert.ok(ids.includes('zoneConnections'));
    assert.ok(ids.includes('travel'));
    assert.ok(ids.includes('legacyRecoveredData'));
    assert.ok(ids.includes('quests'));
    assert.ok(ids.includes('achievements'));
    assert.ok(ids.includes('items'));
    assert.ok(ids.includes('keyItems'));
    assert.ok(ids.includes('magic'));
    assert.ok(ids.includes('lootTables'));
    assert.ok(ids.includes('leveling'));
    assert.ok(ids.includes('trusts'));
    assert.ok(ids.includes('crafting'));
    assert.ok(ids.includes('mounts'));
    assert.match(describeDatabases(), /legacyRecoveredData/);
    assert.match(describeLegacyRecoveredData(), /weapon skills/);
});

test('tick engine dispatches to subscribers', () => {
    const tickEngine = createTickEngine({ tickLengthMs: 1000 });
    let handled = 0;

    tickEngine.subscribe('test', (event) => {
        handled += 1;
        assert.equal(event.tick, 1);
    });

    tickEngine.tick();

    assert.equal(handled, 1);
    assert.equal(tickEngine.elapsedTicks, 1);
    assert.equal(tickEngine.subscriberCount, 1);
});
