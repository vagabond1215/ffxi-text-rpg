import test from 'node:test';
import assert from 'node:assert/strict';

import { describeDatabases, listDatabases } from '../js/text/data/databaseRegistry.js';
import { describeLegacyRecoveredData } from '../js/text/data/legacyRecoveredData.js';
import { createTickEngine } from '../js/text/systems/tickEngine.js';
import {
    describeSystemVersions,
    describeVersion,
    PACKAGE_VERSION,
    PRODUCT_VERSION,
    VERSION,
} from '../js/text/version.js';


test('version manifest separates product package and persistence versions', () => {
    assert.equal(PRODUCT_VERSION, '0.5.650.1');
    assert.equal(PACKAGE_VERSION, '0.5.650');
    assert.equal(VERSION.product, PRODUCT_VERSION);
    assert.equal(VERSION.package, PACKAGE_VERSION);
    assert.equal(VERSION.app, PRODUCT_VERSION);
    assert.equal(VERSION.accountSave, 4);
    assert.equal(VERSION.gameState, 5);
    assert.equal(VERSION.data, 17);
    assert.equal(VERSION.benchmark, 1);
    assert.equal(VERSION.save, VERSION.gameState);
    assert.match(describeVersion(), /Product: 0\.5\.650\.1/);
    assert.match(describeVersion(), /Package: 0\.5\.650/);
    assert.match(describeVersion(), /Account Save: 4/);
    assert.match(describeVersion(), /Game State: 5/);
    assert.match(describeVersion(), /Data: 17/);
    assert.match(describeVersion(), /Codename: Ecology Substrate/);
    assert.match(describeVersion(), /Compatibility: migrate-supported-save-versions/);
    assert.match(describeSystemVersions(), /versionManifest: 0\.5\.650\.1/);
    assert.match(describeSystemVersions(), /saveMigrations: 0\.3\.0/);
    assert.match(describeSystemVersions(), /worldIdentity: 0\.1\.1/);
    assert.match(describeSystemVersions(), /actionResults: 0\.1\.0/);
    assert.match(describeSystemVersions(), /semanticEvents: 0\.1\.0/);
    assert.match(describeSystemVersions(), /worldTime: 0\.2\.0/);
    assert.match(describeSystemVersions(), /simulationControl: 0\.3\.0/);
    assert.match(describeSystemVersions(), /simulationInterrupts: 0\.1\.0/);
    assert.match(describeSystemVersions(), /timedTasks: 0\.1\.0/);
    assert.match(describeSystemVersions(), /projects: 0\.1\.0/);
    assert.match(describeSystemVersions(), /resourceProvenance: 0\.1\.0/);
    assert.match(describeSystemVersions(), /resourceOpportunities: 0\.1\.0/);
    assert.match(describeSystemVersions(), /resourceRecovery: 0\.1\.0/);
    assert.match(describeSystemVersions(), /ecologyCatalog: 0\.1\.0/);
    assert.match(describeSystemVersions(), /ecologyState: 0\.1\.0/);
    assert.match(describeSystemVersions(), /populations: 0\.1\.0/);
    assert.match(describeSystemVersions(), /gatheringSources: 0\.1\.0/);
    assert.match(describeSystemVersions(), /resourceItems: 0\.1\.0/);
    assert.match(describeSystemVersions(), /dayCycle: 0\.1\.0/);
    assert.match(describeSystemVersions(), /commandShell: 0\.4\.5/);
    assert.match(describeSystemVersions(), /characterCreation: 0\.5\.1/);
    assert.match(describeSystemVersions(), /powers: 0\.4\.1/);
    assert.match(describeSystemVersions(), /validation: 0\.8\.0/);
    assert.match(describeSystemVersions(), /travel: 0\.4\.4/);
    assert.match(describeSystemVersions(), /pois: 0\.3\.7/);
    assert.match(describeSystemVersions(), /travelExits: 0\.3\.6/);
    assert.match(describeSystemVersions(), /homeStorage: 0\.3\.9/);
    assert.match(describeSystemVersions(), /companions: planned/);
    assert.match(describeSystemVersions(), /canvasUi: 0\.7\.0/);
    assert.match(describeSystemVersions(), /combatActions: 0\.5\.1/);
    assert.match(describeSystemVersions(), /battleRewards: 0\.6\.0/);
    assert.match(describeSystemVersions(), /itemSchema: 0\.7\.0/);
    assert.match(describeSystemVersions(), /itemBehavior: 0\.1\.0/);
    assert.match(describeSystemVersions(), /equipmentEligibility: 0\.5\.1/);
    assert.match(describeSystemVersions(), /shopTransactions: 0\.3\.8/);
    assert.match(describeSystemVersions(), /skillCaps: 0\.5\.2/);
    assert.match(describeSystemVersions(), /skillProgression: 0\.5\.3/);
    assert.match(describeSystemVersions(), /leveling: 0\.5\.3/);
});

test('database registry includes canonical systems plus explicitly bounded legacy research', () => {
    const ids = listDatabases().map((database) => database.id);

    assert.ok(ids.includes('places'));
    assert.ok(ids.includes('maps'));
    assert.ok(ids.includes('powers'));
    assert.ok(ids.includes('placeConnections'));
    assert.ok(ids.includes('travel'));
    assert.ok(ids.includes('projects'));
    assert.ok(ids.includes('resourceProvenance'));
    assert.ok(ids.includes('resourceOpportunities'));
    assert.ok(ids.includes('ecologyFamilies'));
    assert.ok(ids.includes('species'));
    assert.ok(ids.includes('populations'));
    assert.ok(ids.includes('gatheringSources'));
    assert.ok(ids.includes('resourceItems'));
    assert.ok(ids.includes('legacyRecoveredData'));
    assert.ok(ids.includes('quests'));
    assert.ok(ids.includes('achievements'));
    assert.ok(ids.includes('items'));
    assert.ok(ids.includes('keyItems'));
    assert.ok(ids.includes('magic'));
    assert.ok(ids.includes('lootTables'));
    assert.ok(ids.includes('leveling'));
    assert.ok(ids.includes('companions'));
    assert.ok(ids.includes('crafting'));
    assert.ok(ids.includes('mounts'));
    assert.equal(ids.includes('nations'), false);
    assert.equal(ids.includes('zoneConnections'), false);
    assert.equal(ids.includes('trusts'), false);
    assert.match(describeDatabases(), /resourceProvenance/);
    assert.match(describeDatabases(), /resourceOpportunities/);
    assert.match(describeDatabases(), /gatheringSources/);
    assert.match(describeDatabases(), /populations/);
    assert.match(describeDatabases(), /legacyRecoveredData/);
    assert.match(describeDatabases(), /companions/);
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