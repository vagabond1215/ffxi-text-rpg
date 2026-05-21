import test from 'node:test';
import assert from 'node:assert/strict';

import { describeDatabases, listDatabases } from '../js/text/data/databaseRegistry.js';
import { describeLegacyRecoveredData } from '../js/text/data/legacyRecoveredData.js';
import { createTickEngine } from '../js/text/systems/tickEngine.js';
import { describeSystemVersions, describeVersion, VERSION } from '../js/text/version.js';


test('version manifest exposes app save data and benchmark versions', () => {
    assert.equal(VERSION.app, '0.3.1');
    assert.equal(VERSION.save, 2);
    assert.equal(VERSION.data, 3);
    assert.equal(VERSION.benchmark, 1);
    assert.match(describeVersion(), /App: 0.3.1/);
    assert.match(describeSystemVersions(), /characterCreation/);
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
