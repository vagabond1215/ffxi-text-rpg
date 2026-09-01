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


test('version manifest separates product package persistence data and scale-content versions', () => {
    assert.equal(PRODUCT_VERSION, '0.9.300.7');
    assert.equal(PACKAGE_VERSION, '0.9.300');
    assert.equal(VERSION.product, PRODUCT_VERSION);
    assert.equal(VERSION.package, PACKAGE_VERSION);
    assert.equal(VERSION.accountSave, 5);
    assert.equal(VERSION.gameState, 21);
    assert.equal(VERSION.data, 74);
    assert.equal(VERSION.benchmark, 3);
    assert.equal(Object.hasOwn(VERSION, 'app'), false);
    assert.equal(Object.hasOwn(VERSION, 'save'), false);
    assert.equal(VERSION.codename, 'Radiant Arc Propagation Foundation');
    assert.equal(VERSION.compatibility, 'pre-release-current-schema');

    assert.deepEqual(
        {
            versionManifest: SYSTEM_VERSIONS.versionManifest,
            actionResults: SYSTEM_VERSIONS.actionResults,
            performanceHarness: SYSTEM_VERSIONS.performanceHarness,
            lifecycleHarness: SYSTEM_VERSIONS.lifecycleHarness,
            timedTasks: SYSTEM_VERSIONS.timedTasks,
            projects: SYSTEM_VERSIONS.projects,
            cultivation: SYSTEM_VERSIONS.cultivation,
            campaignRecovery: SYSTEM_VERSIONS.campaignRecovery,
            workTasks: SYSTEM_VERSIONS.workTasks,
            workProficiencies: SYSTEM_VERSIONS.workProficiencies,
            dayCycle: SYSTEM_VERSIONS.dayCycle,
            dayCyclePersistence: SYSTEM_VERSIONS.dayCyclePersistence,
            resourceOpportunities: SYSTEM_VERSIONS.resourceOpportunities,
            abilityEngine: SYSTEM_VERSIONS.abilityEngine,
            transport: SYSTEM_VERSIONS.transport,
            liveTick: SYSTEM_VERSIONS.liveTick,
            domRoot: SYSTEM_VERSIONS.domRoot,
            commandShell: SYSTEM_VERSIONS.commandShell,
            slashCommands: SYSTEM_VERSIONS.slashCommands,
            accountSaves: SYSTEM_VERSIONS.accountSaves,
            commitments: SYSTEM_VERSIONS.commitments,
            npcSchedules: SYSTEM_VERSIONS.npcSchedules,
            contentCatalogRegistry: SYSTEM_VERSIONS.contentCatalogRegistry,
            contentPackSchema: SYSTEM_VERSIONS.contentPackSchema,
            regionalContentPacks: SYSTEM_VERSIONS.regionalContentPacks,
            contentPackValidation: SYSTEM_VERSIONS.contentPackValidation,
            contentScaleGate: SYSTEM_VERSIONS.contentScaleGate,
            productionCatalog: SYSTEM_VERSIONS.productionCatalog,
            productionItems: SYSTEM_VERSIONS.productionItems,
            capabilities: SYSTEM_VERSIONS.capabilities,
            abilityCatalog: SYSTEM_VERSIONS.abilityCatalog,
            carriedInventory: SYSTEM_VERSIONS.carriedInventory,
            carriedLoad: SYSTEM_VERSIONS.carriedLoad,
            inventoryContainers: SYSTEM_VERSIONS.inventoryContainers,
            inventoryTransfers: SYSTEM_VERSIONS.inventoryTransfers,
            validation: SYSTEM_VERSIONS.validation,
            walletPersistence: SYSTEM_VERSIONS.walletPersistence,
            playerDerivedState: SYSTEM_VERSIONS.playerDerivedState,
            npcWorldProjection: SYSTEM_VERSIONS.npcWorldProjection,
            enemyEncounterProjection: SYSTEM_VERSIONS.enemyEncounterProjection,
            presentationLog: SYSTEM_VERSIONS.presentationLog,
            playerEquipmentPersistence: SYSTEM_VERSIONS.playerEquipmentPersistence,
            playerStatusPersistence: SYSTEM_VERSIONS.playerStatusPersistence,
            activeBattlePersistence: SYSTEM_VERSIONS.activeBattlePersistence,
            battleDerivedCachePersistence: SYSTEM_VERSIONS.battleDerivedCachePersistence,
            playerPersistenceHarness: SYSTEM_VERSIONS.playerPersistenceHarness,
            playerIdentityPersistence: SYSTEM_VERSIONS.playerIdentityPersistence,
            locationPersistence: SYSTEM_VERSIONS.locationPersistence,
            combatIdentityPersistence: SYSTEM_VERSIONS.combatIdentityPersistence,
            statusEngine: SYSTEM_VERSIONS.statusEngine,
            battleEngine: SYSTEM_VERSIONS.battleEngine,
            combatTurns: SYSTEM_VERSIONS.combatTurns,
            combatSimulation: SYSTEM_VERSIONS.combatSimulation,
            combatActions: SYSTEM_VERSIONS.combatActions,
            combatResolution: SYSTEM_VERSIONS.combatResolution,
            combatGeometry: SYSTEM_VERSIONS.combatGeometry,
            combatFields: SYSTEM_VERSIONS.combatFields,
            combatAttention: SYSTEM_VERSIONS.combatAttention,
            combatLoadout: SYSTEM_VERSIONS.combatLoadout,
            saveEncoding: SYSTEM_VERSIONS.saveEncoding,
            placeAtlas: SYSTEM_VERSIONS.placeAtlas,
            localKnowledge: SYSTEM_VERSIONS.localKnowledge,
            discoveryPersistence: SYSTEM_VERSIONS.discoveryPersistence,
            poiDiscovery: SYSTEM_VERSIONS.poiDiscovery,
            gameViewModels: SYSTEM_VERSIONS.gameViewModels,
            trainingServices: SYSTEM_VERSIONS.trainingServices,
            playerEntity: SYSTEM_VERSIONS.playerEntity,
            progression: SYSTEM_VERSIONS.progression,
            characterAffinity: SYSTEM_VERSIONS.characterAffinity,
        },
        {
            versionManifest: '0.9.300.7',
            actionResults: '0.2.0',
            performanceHarness: '0.3.0',
            lifecycleHarness: '0.13.0',
            timedTasks: '0.2.0',
            projects: '0.2.0',
            cultivation: '0.2.0',
            campaignRecovery: '0.3.0',
            workTasks: '0.2.0',
            workProficiencies: '0.2.0',
            dayCycle: '0.2.0',
            dayCyclePersistence: '0.1.0',
            resourceOpportunities: '0.2.0',
            abilityEngine: '0.7.0',
            transport: '0.4.1',
            liveTick: '0.2.1',
            domRoot: '0.1.0',
            commandShell: '0.5.4',
            slashCommands: '0.5.0',
            accountSaves: '0.7.1',
            commitments: '0.8.0',
            npcSchedules: '0.9.0',
            contentCatalogRegistry: '0.3.0',
            contentPackSchema: '0.2.0',
            regionalContentPacks: '0.22.0',
            contentPackValidation: '0.4.0',
            contentScaleGate: '0.2.0',
            productionCatalog: '0.17.0',
            productionItems: '0.18.0',
            capabilities: '0.5.0',
            abilityCatalog: '0.10.0',
            carriedInventory: '0.1.0',
            carriedLoad: '0.2.1',
            inventoryContainers: '0.7.0',
            inventoryTransfers: '0.8.0',
            validation: '0.53.0',
            walletPersistence: '0.1.0',
            playerDerivedState: '0.1.2',
            npcWorldProjection: '0.1.1',
            enemyEncounterProjection: '0.1.0',
            presentationLog: '0.1.0',
            playerEquipmentPersistence: '0.2.0',
            playerStatusPersistence: '0.1.0',
            activeBattlePersistence: '0.6.0',
            battleDerivedCachePersistence: '0.1.0',
            playerPersistenceHarness: '0.1.0',
            playerIdentityPersistence: '0.2.0',
            locationPersistence: '0.1.0',
            combatIdentityPersistence: '0.3.0',
            statusEngine: '0.4.0',
            battleEngine: '0.14.0',
            combatTurns: '0.7.0',
            combatSimulation: '0.3.0',
            combatActions: '0.12.0',
            combatResolution: '0.2.0',
            combatGeometry: '0.3.0',
            combatFields: '0.1.0',
            combatAttention: '0.3.0',
            combatLoadout: '0.2.0',
            saveEncoding: '0.9.0',
            placeAtlas: '0.6.0',
            localKnowledge: '0.1.0',
            discoveryPersistence: '0.2.0',
            poiDiscovery: '0.4.0',
            gameViewModels: '0.19.0',
            trainingServices: '0.1.0',
            playerEntity: '0.11.0',
            progression: '0.8.0',
            characterAffinity: '0.1.0',
        },
    );

    assert.equal(Object.hasOwn(SYSTEM_VERSIONS, 'saveMigrations'), false);
    assert.match(describeVersion(), /Product: 0\.9\.300\.7/);
    assert.match(describeVersion(), /Package: 0\.9\.300/);
    assert.match(describeVersion(), /Account Save: 5/);
    assert.match(describeVersion(), /Game State: 21/);
    assert.match(describeVersion(), /Data: 74/);
    assert.match(describeVersion(), /Benchmark: 3/);
    assert.match(describeVersion(), /Codename: Radiant Arc Propagation Foundation/);
    assert.match(describeVersion(), /Compatibility: pre-release-current-schema/);
    assert.match(describeSystemVersions(), /contentCatalogRegistry: 0\.3\.0/);
    assert.match(describeSystemVersions(), /contentPackSchema: 0\.2\.0/);
    assert.match(describeSystemVersions(), /regionalContentPacks: 0\.22\.0/);
    assert.match(describeSystemVersions(), /contentPackValidation: 0\.4\.0/);
    assert.match(describeSystemVersions(), /contentScaleGate: 0\.2\.0/);
    assert.match(describeSystemVersions(), /productionCatalog: 0\.17\.0/);
    assert.match(describeSystemVersions(), /productionItems: 0\.18\.0/);
    assert.match(describeSystemVersions(), /capabilities: 0\.5\.0/);
    assert.match(describeSystemVersions(), /abilityCatalog: 0\.10\.0/);
    assert.match(describeSystemVersions(), /npcSchedules: 0\.9\.0/);
    assert.match(describeSystemVersions(), /validation: 0\.53\.0/);
    assert.match(describeSystemVersions(), /cultivation: 0\.2\.0/);
    assert.match(describeSystemVersions(), /commitments: 0\.8\.0/);
    assert.match(describeSystemVersions(), /npcWorldProjection: 0\.1\.1/);
    assert.match(describeSystemVersions(), /enemyEncounterProjection: 0\.1\.0/);
    assert.match(describeSystemVersions(), /presentationLog: 0\.1\.0/);
    assert.match(describeSystemVersions(), /locationPersistence: 0\.1\.0/);
    assert.match(describeSystemVersions(), /combatIdentityPersistence: 0\.3\.0/);
    assert.match(describeSystemVersions(), /activeBattlePersistence: 0\.6\.0/);
    assert.match(describeSystemVersions(), /battleDerivedCachePersistence: 0\.1\.0/);
    assert.match(describeSystemVersions(), /playerStatusPersistence: 0\.1\.0/);
    assert.match(describeSystemVersions(), /playerEquipmentPersistence: 0\.2\.0/);
    assert.match(describeSystemVersions(), /playerDerivedState: 0\.1\.2/);
    assert.match(describeSystemVersions(), /playerPersistenceHarness: 0\.1\.0/);
    assert.match(describeSystemVersions(), /playerIdentityPersistence: 0\.2\.0/);
    assert.match(describeSystemVersions(), /battleEngine: 0\.14\.0/);
    assert.match(describeSystemVersions(), /combatTurns: 0\.7\.0/);
    assert.match(describeSystemVersions(), /combatSimulation: 0\.3\.0/);
    assert.match(describeSystemVersions(), /abilityEngine: 0\.7\.0/);
    assert.match(describeSystemVersions(), /combatActions: 0\.12\.0/);
    assert.match(describeSystemVersions(), /combatResolution: 0\.2\.0/);
    assert.match(describeSystemVersions(), /combatGeometry: 0\.3\.0/);
    assert.match(describeSystemVersions(), /combatFields: 0\.1\.0/);
    assert.match(describeSystemVersions(), /combatAttention: 0\.3\.0/);
    assert.match(describeSystemVersions(), /combatLoadout: 0\.2\.0/);
    assert.match(describeSystemVersions(), /weaponCadence: 0\.1\.0/);
    assert.match(describeSystemVersions(), /weaponKataCatalog: 0\.3\.0/);
    assert.match(describeSystemVersions(), /weaponKata: 0\.3\.0/);
    assert.match(describeSystemVersions(), /trainingServices: 0\.1\.0/);
    assert.match(describeSystemVersions(), /playerEntity: 0\.11\.0/);
    assert.match(describeSystemVersions(), /progression: 0\.8\.0/);
    assert.match(describeSystemVersions(), /characterAffinity: 0\.1\.0/);
    assert.match(describeSystemVersions(), /localityNavigation: 0\.4\.0/);
    assert.match(describeSystemVersions(), /pois: 0\.4\.5/);
    assert.match(describeSystemVersions(), /walletPersistence: 0\.1\.0/);
    assert.match(describeSystemVersions(), /statusEngine: 0\.4\.0/);
    assert.match(describeSystemVersions(), /saveEncoding: 0\.9\.0/);
    assert.match(describeSystemVersions(), /dayCyclePersistence: 0\.1\.0/);
    assert.match(describeSystemVersions(), /workProficiencies: 0\.2\.0/);
    assert.match(describeSystemVersions(), /placeAtlas: 0\.6\.0/);
    assert.match(describeSystemVersions(), /discoveryPersistence: 0\.2\.0/);
    assert.match(describeSystemVersions(), /poiDiscovery: 0\.4\.0/);
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
    tickEngine.subscribe('test', (event) => { handled += 1; assert.equal(event.tick, 1); });
    assert.equal(tickEngine.elapsedTicks, 0);
    assert.equal(tickEngine.subscriberCount, 1);
    tickEngine.tick();
    assert.equal(handled, 1);
    assert.equal(tickEngine.subscriberCount, 1);
});