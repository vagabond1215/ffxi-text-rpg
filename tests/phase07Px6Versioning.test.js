import test from 'node:test';
import assert from 'node:assert/strict';

import { COMMITMENT_CATALOG_VERSION } from '../js/text/data/commitments.js';
import { ACTIVITY_ADVANCE_VERSION } from '../js/text/systems/activityAdvanceEngine.js';
import { CAMPAIGN_RECOVERY_VERSION } from '../js/text/systems/campaignRecoveryEngine.js';
import { PLAYER_CAMPAIGN_READABILITY_VERSION } from '../js/text/systems/playerCampaignReadabilityEngine.js';
import { PLAYER_CONTINUITY_VERSION } from '../js/text/systems/playerContinuityEngine.js';
import { PLAYER_DANGER_RECOVERY_VERSION } from '../js/text/systems/playerDangerRecoveryEngine.js';
import { PLAYER_INFORMATION_VERSION } from '../js/text/systems/playerInformationEngine.js';
import { RESOURCE_RECOVERY_WORK_ADAPTER_VERSION } from '../js/text/systems/resourceRecoveryWorkAdapter.js';
import { SETTLEMENT_SERVICE_BOARD_VERSION } from '../js/text/systems/settlementServiceBoardEngine.js';
import { TRANSPORT_SERVICE_BOARD_VERSION } from '../js/text/systems/transportServiceBoardEngine.js';
import { SYSTEM_VERSIONS, VERSION } from '../js/text/version.js';

test('Phase 0.7 semantic information access keeps campaign authority while exposing acquired and current knowledge directly', () => {
    assert.equal(VERSION.product, '0.7.300.1');
    assert.equal(VERSION.package, '0.7.300');
    assert.equal(VERSION.accountSave, 4);
    assert.equal(VERSION.gameState, 5);
    assert.equal(VERSION.data, 30);
    assert.equal(VERSION.benchmark, 1);

    assert.equal(ACTIVITY_ADVANCE_VERSION, 2);
    assert.equal(CAMPAIGN_RECOVERY_VERSION, 1);
    assert.equal(RESOURCE_RECOVERY_WORK_ADAPTER_VERSION, 3);
    assert.equal(COMMITMENT_CATALOG_VERSION, 2);
    assert.equal(PLAYER_CONTINUITY_VERSION, 5);
    assert.equal(PLAYER_CAMPAIGN_READABILITY_VERSION, 2);
    assert.equal(PLAYER_DANGER_RECOVERY_VERSION, 2);
    assert.equal(TRANSPORT_SERVICE_BOARD_VERSION, 1);
    assert.equal(SETTLEMENT_SERVICE_BOARD_VERSION, 1);
    assert.equal(PLAYER_INFORMATION_VERSION, 1);

    assert.equal(SYSTEM_VERSIONS.activityAdvance, '0.2.0');
    assert.equal(SYSTEM_VERSIONS.campaignRecovery, '0.1.0');
    assert.equal(SYSTEM_VERSIONS.resourceRecoveryWork, '0.3.0');
    assert.equal(SYSTEM_VERSIONS.characterActivity, '0.2.0');
    assert.equal(SYSTEM_VERSIONS.commitments, '0.2.0');
    assert.equal(SYSTEM_VERSIONS.playerContinuity, '0.5.0');
    assert.equal(SYSTEM_VERSIONS.playerCampaignReadability, '0.2.0');
    assert.equal(SYSTEM_VERSIONS.playerDangerRecovery, '0.2.0');
    assert.equal(SYSTEM_VERSIONS.transportServiceBoard, '0.1.0');
    assert.equal(SYSTEM_VERSIONS.settlementServiceBoard, '0.1.0');
    assert.equal(SYSTEM_VERSIONS.workstations, '0.2.0');
    assert.equal(SYSTEM_VERSIONS.shopTransactions, '0.5.0');
    assert.equal(SYSTEM_VERSIONS.playerInformation, '0.1.0');
    assert.equal(SYSTEM_VERSIONS.gameViewModels, '0.11.0');
    assert.equal(SYSTEM_VERSIONS.domUi, '0.9.0');
    assert.equal(SYSTEM_VERSIONS.uiIntents, '0.8.0');
});
