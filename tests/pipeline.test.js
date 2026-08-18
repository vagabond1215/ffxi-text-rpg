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


test('version manifest separates product package persistence data and focused cleanup versions', () => {
    assert.equal(PRODUCT_VERSION, '0.8.600.5');
    assert.equal(PACKAGE_VERSION, '0.8.600');
    assert.equal(VERSION.product, PRODUCT_VERSION);
    assert.equal(VERSION.package, PACKAGE_VERSION);
    assert.equal(VERSION.accountSave, 5);
    assert.equal(VERSION.gameState, 6);
    assert.equal(VERSION.data, 37);
    assert.equal(VERSION.benchmark, 1);
    assert.equal(Object.hasOwn(VERSION, 'app'), false);
    assert.equal(Object.hasOwn(VERSION, 'save'), false);
    assert.equal(VERSION.codename, 'Carried Commitment Delivery');
    assert.equal(VERSION.compatibility, 'pre-release-current-schema');

    assert.deepEqual(
        {
            versionManifest: SYSTEM_VERSIONS.versionManifest,
            commandShell: SYSTEM_VERSIONS.commandShell,
            slashCommands: SYSTEM_VERSIONS.slashCommands,
            accountSaves: SYSTEM_VERSIONS.accountSaves,
            commitments: SYSTEM_VERSIONS.commitments,
            carriedInventory: SYSTEM_VERSIONS.carriedInventory,
            carriedLoad: SYSTEM_VERSIONS.carriedLoad,
            inventoryContainers: SYSTEM_VERSIONS.inventoryContainers,
            inventoryTransfers: SYSTEM_VERSIONS.inventoryTransfers,
            validation: SYSTEM_VERSIONS.validation,
            gameViewModels: SYSTEM_VERSIONS.gameViewModels,
        },
        {
            versionManifest: '0.8.600.5',
            commandShell: '0.5.1',
            slashCommands: '0.5.0',
            accountSaves: '0.7.1',
            commitments: '0.3.1',
            carriedInventory: '0.1.0',
            carriedLoad: '0.2.1',
            inventoryContainers: '0.7.0',
            inventoryTransfers: '0.7.0',
            validation: '0.11.0',
            gameViewModels: '0.15.1',
        },
    );

    assert.equal(Object.hasOwn(SYSTEM_VERSIONS, 'saveMigrations'), false);
    assert.match(describeVersion(), /Product: 0\.8\.600\.5/);
    assert.match(describeVersion(), /Package: 0\.8\.600/);
    assert.match(describeVersion(), /Account Save: 5/);
    assert.match(describeVersion(), /Game State: 6/);
    assert.match(describeVersion(), /Data: 37/);
    assert.match(describeVersion(), /Codename: Carried Commitment Delivery/);
    assert.match(describeVersion(), /Compatibility: pre-release-current-schema/);
    assert.match(describeSystemVersions(), /carriedInventory: 0\.1\.0/);
    assert.doesNotMatch(describeSystemVersions(), /saveMigrations:/);
});

test('database registry includes canonical systems plus explicitly bounded legacy research', () => {
    const ids = listDatabases().map((database) => database.id);
    const required = [
        'places', 'maps', 'powers', 'placeConnections', 'routes', 'transportServices',
        'contentPacks', 'contentPackValidation', 'legacyCandidates', 'travel', 'projects',
        'homeInfrastructure', 'commitments', 'relationships', 'npcSchedules', 'resourceProvenance', 'resourceOpportunities',
        'capabilities', 'ecologyFamilies', 'species', 'populations', 'gatheringSources',
        'gatheringWork', 'resourceItems', 'productionItems', 'productionProcesses',
        'production', 'workTasks', 'workProficiencies', 'workstations',
        'legacyRecoveredData', 'quests', 'items', 'magic', 'abilities', 'lootTables',
        'leveling', 'companions', 'party', 'crafting',
    ];
    for (const id of required) assert.ok(ids.includes(id), `registry missing ${id}`);

    assert.equal(ids.includes('nations'), false);
    assert.equal(ids.includes('zoneConnections'), false);
    assert.equal(ids.includes('trusts'), false);

    const description = describeDatabases();
    assert.match(description, /npcSchedules \[implemented 0\.1\.0\]/);
    assert.match(description, /production \[implemented 0\.1\.0\]/);
    assert.match(description, /productionItems \[seeded 0\.2\.0\]/);
    assert.match(description, /workstations \[implemented 0\.2\.0\]/);
    assert.match(description, /homeInfrastructure \[implemented 0\.2\.0\]/);
    assert.match(description, /commitments \[implemented 0\.2\.0\]/);
    assert.match(description, /relationships \[implemented 0\.1\.0\]/);
    assert.match(description, /capabilities \[seeded 0\.2\.0\]/);
    assert.match(description, /magic \[seeded 0\.1\.0\]/);
    assert.match(description, /abilities \[implemented 0\.1\.0\]/);
    assert.match(description, /companions \[implemented 0\.2\.0\]/);
    assert.match(description, /party \[implemented 0\.3\.0\]/);
    assert.match(describeLegacyRecoveredData(), /weapon skills/);
});

test('tick engine dispatches to subscribers', () => {
    const tickEngine = createTickEngine({ tickLengthMs: 1000 });
    let handled = 0;

    tickEngine.subscribe('test', (event) => {
        handled += 1;
        assert.equal(event.tick, 1);
    });

    assert.equal(tickEngine.elapsedTicks, 0);
    tickEngine.tick();

    assert.equal(handled, 1);
    assert.equal(tickEngine.subscriberCount, 1);
});
