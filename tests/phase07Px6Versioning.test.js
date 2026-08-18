import test from 'node:test';
import assert from 'node:assert/strict';

import { COMMITMENT_CATALOG_VERSION } from '../js/text/data/commitments.js';
import { COMPANION_CATALOG_VERSION } from '../js/text/data/companions.js';
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

test('Phase 0.7 companion-life gate remains satisfied as later tracks extend shared authorities', () => {
    assert.ok(compareProductVersions(VERSION.product, '0.7.400.1') >= 0);
    assert.equal(VERSION.accountSave, 4);
    assert.equal(VERSION.gameState, 5);
    assert.ok(VERSION.data >= 31);
    assert.equal(VERSION.benchmark, 1);

    assert.ok(ACTIVITY_ADVANCE_VERSION >= 2);
    assert.ok(CAMPAIGN_RECOVERY_VERSION >= 1);
    assert.equal(RESOURCE_RECOVERY_WORK_ADAPTER_VERSION, 3);
    assert.equal(COMMITMENT_CATALOG_VERSION, 2);
    assert.equal(COMPANION_CATALOG_VERSION, 2);
    assert.equal(PLAYER_CONTINUITY_VERSION, 5);
    assert.equal(PLAYER_CAMPAIGN_READABILITY_VERSION, 2);
    assert.equal(PLAYER_DANGER_RECOVERY_VERSION, 2);
    assert.ok(TRANSPORT_SERVICE_BOARD_VERSION >= 1);
    assert.ok(SETTLEMENT_SERVICE_BOARD_VERSION >= 1);
    assert.equal(PLAYER_INFORMATION_VERSION, 1);

    assert.ok(compareSemver(SYSTEM_VERSIONS.activityAdvance, '0.2.0') >= 0);
    assert.ok(compareSemver(SYSTEM_VERSIONS.campaignRecovery, '0.1.0') >= 0);
    assert.equal(SYSTEM_VERSIONS.resourceRecoveryWork, '0.3.0');
    assert.ok(compareSemver(SYSTEM_VERSIONS.characterActivity, '0.2.0') >= 0);
    assert.ok(compareSemver(SYSTEM_VERSIONS.commitments, '0.2.0') >= 0);
    assert.equal(SYSTEM_VERSIONS.playerContinuity, '0.5.0');
    assert.equal(SYSTEM_VERSIONS.playerCampaignReadability, '0.2.0');
    assert.equal(SYSTEM_VERSIONS.playerDangerRecovery, '0.2.0');
    assert.ok(compareSemver(SYSTEM_VERSIONS.transportServiceBoard, '0.1.0') >= 0);
    assert.ok(compareSemver(SYSTEM_VERSIONS.settlementServiceBoard, '0.1.0') >= 0);
    assert.ok(compareSemver(SYSTEM_VERSIONS.workstations, '0.2.0') >= 0);
    assert.equal(SYSTEM_VERSIONS.shopTransactions, '0.5.0');
    assert.equal(SYSTEM_VERSIONS.playerInformation, '0.1.1');
    assert.ok(compareSemver(SYSTEM_VERSIONS.gameViewModels, '0.12.0') >= 0);
    assert.equal(SYSTEM_VERSIONS.domUi, '0.10.0');
    assert.ok(compareSemver(SYSTEM_VERSIONS.uiIntents, '0.9.0') >= 0);
    assert.equal(SYSTEM_VERSIONS.companionCatalog, '0.2.0');
    assert.equal(SYSTEM_VERSIONS.party, '0.2.0');
    assert.equal(SYSTEM_VERSIONS.companions, '0.2.0');
});

function compareProductVersions(left, right) {
    return compareNumberParts(left, right, 4);
}

function compareSemver(left, right) {
    return compareNumberParts(left, right, 3);
}

function compareNumberParts(left, right, length) {
    const a = String(left ?? '').split('.').map((part) => Number(part) || 0);
    const b = String(right ?? '').split('.').map((part) => Number(part) || 0);
    for (let index = 0; index < length; index += 1) {
        if ((a[index] ?? 0) !== (b[index] ?? 0)) return (a[index] ?? 0) - (b[index] ?? 0);
    }
    return 0;
}
