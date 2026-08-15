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
    SYSTEM_VERSIONS,
    VERSION,
} from '../js/text/version.js';


test('version manifest separates product package and persistence versions', () => {
    assert.equal(PRODUCT_VERSION, '0.6.800.1');
    assert.equal(PACKAGE_VERSION, '0.6.800');
    assert.equal(VERSION.product, PRODUCT_VERSION);
    assert.equal(VERSION.package, PACKAGE_VERSION);
    assert.equal(VERSION.app, PRODUCT_VERSION);
    assert.equal(VERSION.accountSave, 4);
    assert.equal(VERSION.gameState, 5);
    assert.equal(VERSION.data, 26);
    assert.equal(VERSION.benchmark, 1);
    assert.equal(VERSION.save, VERSION.gameState);
    assert.equal(VERSION.codename, 'Persistent Companions and Party');
    assert.equal(VERSION.compatibility, 'migrate-supported-save-versions');

    assert.deepEqual(
        {
            versionManifest: SYSTEM_VERSIONS.versionManifest,
            transport: SYSTEM_VERSIONS.transport,
            gameViewModels: SYSTEM_VERSIONS.gameViewModels,
            uiIntents: SYSTEM_VERSIONS.uiIntents,
            companionCatalog: SYSTEM_VERSIONS.companionCatalog,
            party: SYSTEM_VERSIONS.party,
            battleEngine: SYSTEM_VERSIONS.battleEngine,
            combatTurns: SYSTEM_VERSIONS.combatTurns,
            combatActions: SYSTEM_VERSIONS.combatActions,
            companions: SYSTEM_VERSIONS.companions,
        },
        {
            versionManifest: '0.6.800.1',
            transport: '0.2.0',
            gameViewModels: '0.4.0',
            uiIntents: '0.4.0',
            companionCatalog: '0.1.0',
            party: '0.1.0',
            battleEngine: '0.8.0',
            combatTurns: '0.3.0',
            combatActions: '0.8.0',
            companions: '0.1.0',
        },
    );

    assert.match(describeVersion(), /Product: 0\.6\.800\.1/);
    assert.match(describeVersion(), /Package: 0\.6\.800/);
    assert.match(describeVersion(), /Game State: 5/);
    assert.match(describeVersion(), /Data: 26/);
    assert.match(describeVersion(), /Codename: Persistent Companions and Party/);
    assert.match(describeSystemVersions(), /party: 0\.1\.0/);
});

test('database registry includes canonical systems plus explicitly bounded legacy research', () => {
    const ids = listDatabases().map((database) => database.id);
    const required = [
        'places', 'maps', 'powers', 'placeConnections', 'routes', 'transportServices',
        'contentPacks', 'contentPackValidation', 'legacyCandidates', 'travel', 'projects',
        'resourceProvenance', 'resourceOpportunities', 'capabilities', 'ecologyFamilies',
        'species', 'populations', 'gatheringSources', 'gatheringWork', 'resourceItems',
        'productionItems', 'productionProcesses', 'production', 'workTasks',
        'workProficiencies', 'workstations', 'legacyRecoveredData', 'quests',
        'relationships', 'items', 'magic', 'abilities', 'lootTables', 'leveling',
        'companions', 'party', 'crafting',
    ];
    for (const id of required) assert.ok(ids.includes(id), `registry missing ${id}`);

    assert.equal(ids.includes('nations'), false);
    assert.equal(ids.includes('zoneConnections'), false);
    assert.equal(ids.includes('trusts'), false);

    const description = describeDatabases();
    assert.match(description, /production \[implemented 0\.1\.0\]/);
    assert.match(description, /capabilities \[seeded 0\.2\.0\]/);
    assert.match(description, /magic \[seeded 0\.1\.0\]/);
    assert.match(description, /abilities \[implemented 0\.1\.0\]/);
    assert.match(description, /companions \[implemented 0\.1\.0\]/);
    assert.match(description, /party \[implemented 0\.1\.0\]/);
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
