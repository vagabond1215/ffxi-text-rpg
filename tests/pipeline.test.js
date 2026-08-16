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
    assert.equal(PRODUCT_VERSION, '0.7.100.1');
    assert.equal(PACKAGE_VERSION, '0.7.100');
    assert.equal(VERSION.product, PRODUCT_VERSION);
    assert.equal(VERSION.package, PACKAGE_VERSION);
    assert.equal(VERSION.app, PRODUCT_VERSION);
    assert.equal(VERSION.accountSave, 4);
    assert.equal(VERSION.gameState, 5);
    assert.equal(VERSION.data, 30);
    assert.equal(VERSION.benchmark, 1);
    assert.equal(VERSION.save, VERSION.gameState);
    assert.equal(VERSION.codename, 'Playable Campaign Slice');
    assert.equal(VERSION.compatibility, 'pre-release-current-schema');

    assert.deepEqual(
        {
            versionManifest: SYSTEM_VERSIONS.versionManifest,
            integratedMechanicsGate: SYSTEM_VERSIONS.integratedMechanicsGate,
            transport: SYSTEM_VERSIONS.transport,
            transportServiceBoard: SYSTEM_VERSIONS.transportServiceBoard,
            characterActivity: SYSTEM_VERSIONS.characterActivity,
            activityAdvance: SYSTEM_VERSIONS.activityAdvance,
            campaignRecovery: SYSTEM_VERSIONS.campaignRecovery,
            resourceRecoveryWork: SYSTEM_VERSIONS.resourceRecoveryWork,
            commitments: SYSTEM_VERSIONS.commitments,
            relationships: SYSTEM_VERSIONS.relationships,
            dayCycle: SYSTEM_VERSIONS.dayCycle,
            gameViewModels: SYSTEM_VERSIONS.gameViewModels,
            playerExperience: SYSTEM_VERSIONS.playerExperience,
            playerOpportunities: SYSTEM_VERSIONS.playerOpportunities,
            playerContinuity: SYSTEM_VERSIONS.playerContinuity,
            playerCampaignReadability: SYSTEM_VERSIONS.playerCampaignReadability,
            playerDangerRecovery: SYSTEM_VERSIONS.playerDangerRecovery,
            domUi: SYSTEM_VERSIONS.domUi,
            uiIntents: SYSTEM_VERSIONS.uiIntents,
            companionCatalog: SYSTEM_VERSIONS.companionCatalog,
            party: SYSTEM_VERSIONS.party,
            battleEngine: SYSTEM_VERSIONS.battleEngine,
            combatTurns: SYSTEM_VERSIONS.combatTurns,
            combatActions: SYSTEM_VERSIONS.combatActions,
            companions: SYSTEM_VERSIONS.companions,
        },
        {
            versionManifest: '0.7.100.1',
            integratedMechanicsGate: '0.1.0',
            transport: '0.2.0',
            transportServiceBoard: '0.1.0',
            characterActivity: '0.2.0',
            activityAdvance: '0.2.0',
            campaignRecovery: '0.1.0',
            resourceRecoveryWork: '0.3.0',
            commitments: '0.2.0',
            relationships: '0.1.0',
            dayCycle: '0.2.0',
            gameViewModels: '0.9.0',
            playerExperience: '0.3.0',
            playerOpportunities: '0.2.0',
            playerContinuity: '0.5.0',
            playerCampaignReadability: '0.2.0',
            playerDangerRecovery: '0.2.0',
            domUi: '0.7.0',
            uiIntents: '0.6.0',
            companionCatalog: '0.1.0',
            party: '0.1.0',
            battleEngine: '0.8.0',
            combatTurns: '0.3.0',
            combatActions: '0.8.0',
            companions: '0.1.0',
        },
    );

    assert.match(describeVersion(), /Product: 0\.7\.100\.1/);
    assert.match(describeVersion(), /Package: 0\.7\.100/);
    assert.match(describeVersion(), /Game State: 5/);
    assert.match(describeVersion(), /Data: 30/);
    assert.match(describeVersion(), /Codename: Playable Campaign Slice/);
    assert.match(describeVersion(), /Compatibility: pre-release-current-schema/);
    assert.match(describeSystemVersions(), /integratedMechanicsGate: 0\.1\.0/);
    assert.match(describeSystemVersions(), /transportServiceBoard: 0\.1\.0/);
    assert.match(describeSystemVersions(), /activityAdvance: 0\.2\.0/);
    assert.match(describeSystemVersions(), /campaignRecovery: 0\.1\.0/);
    assert.match(describeSystemVersions(), /resourceRecoveryWork: 0\.3\.0/);
    assert.match(describeSystemVersions(), /commitments: 0\.2\.0/);
    assert.match(describeSystemVersions(), /relationships: 0\.1\.0/);
    assert.match(describeSystemVersions(), /playerContinuity: 0\.5\.0/);
    assert.match(describeSystemVersions(), /playerCampaignReadability: 0\.2\.0/);
    assert.match(describeSystemVersions(), /playerDangerRecovery: 0\.2\.0/);
    assert.match(describeSystemVersions(), /gameViewModels: 0\.9\.0/);
    assert.match(describeSystemVersions(), /domUi: 0\.7\.0/);
    assert.match(describeSystemVersions(), /party: 0\.1\.0/);
});

test('database registry includes canonical systems plus explicitly bounded legacy research', () => {
    const ids = listDatabases().map((database) => database.id);
    const required = [
        'places', 'maps', 'powers', 'placeConnections', 'routes', 'transportServices',
        'contentPacks', 'contentPackValidation', 'legacyCandidates', 'travel', 'projects',
        'commitments', 'relationships', 'resourceProvenance', 'resourceOpportunities',
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
    assert.match(description, /production \[implemented 0\.1\.0\]/);
    assert.match(description, /commitments \[implemented 0\.2\.0\]/);
    assert.match(description, /relationships \[implemented 0\.1\.0\]/);
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

    assert.equal(tickEngine.elapsedTicks, 0);
    tickEngine.tick();

    assert.equal(handled, 1);
    assert.equal(tickEngine.elapsedTicks, 1);
    assert.equal(tickEngine.subscriberCount, 1);
});
