import test from 'node:test';
import assert from 'node:assert/strict';

import { createCommandRouter } from '../js/text/commandRouter.js';
import { getPointOfInterest, describePoisForPlace } from '../js/text/data/pointsOfInterest.js';
import { getPlace } from '../js/text/data/places.js';
import { createNewGameState } from '../js/text/gameState.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import {
    evaluateIntegratedMechanicsGate,
    INTEGRATED_MECHANICS_GATE_GROUPS,
    validateAdditiveStateNormalization,
} from '../js/text/systems/integratedMechanicsGate.js';
import { listSemanticEvents } from '../js/text/systems/semanticEventEngine.js';
import { SYSTEM_VERSIONS, VERSION } from '../js/text/version.js';

function moveTo(state, placeId) {
    const place = getPlace(placeId);
    assert.ok(place);
    const moved = setPositionAndDiscover(state, place.id, place.coordinateSystem.start);
    assert.equal(moved.ok, true);
}

test('Phase 0.6 integrated mechanics gate passes the completed contract when evaluated at 0.6.900.1', () => {
    const report = evaluateIntegratedMechanicsGate({
        version: { ...VERSION, product: '0.6.900.1' },
    });

    assert.equal(report.ready, true, report.issues.join('\n'));
    assert.deepEqual(report.groups.map((group) => group.id), INTEGRATED_MECHANICS_GATE_GROUPS);
    assert.equal(report.summary.passedGroups, report.summary.totalGroups);
});

test('integrated gate reports a missing required subsystem as a grouped diagnostic', () => {
    const report = evaluateIntegratedMechanicsGate({
        version: { ...VERSION, product: '0.6.900.1' },
        systemVersions: { ...SYSTEM_VERSIONS, worldTime: 'planned' },
    });

    assert.equal(report.ready, false);
    assert.ok(report.issues.some((issue) => issue.includes('[fictionalTimeAndInterrupts] system-worldTime')));
});

test('all additive Phase 0.6 runtime state can reconstruct lazily without changing Game State 5', () => {
    assert.deepEqual(validateAdditiveStateNormalization(), []);
});

test('legacy companion command adapter reaches canonical party authority exactly once', () => {
    const state = createNewGameState();
    moveTo(state, 'timbercross-landing');
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });

    const first = router('companion Mara Venn');
    const second = router('companion Mara Venn');

    assert.match(first, /Mara Venn joins your party/);
    assert.match(second, /already a persistent companion/);
    assert.deepEqual(state.party.activeCompanionIds, ['companion-mara-venn']);
    assert.equal(listSemanticEvents(state, { type: 'party.companion-recruited' }).length, 1);
});

test('legacy POI presentation no longer collides with Mara or exposes internal source coordinates', () => {
    const guide = getPointOfInterest('poi-sandoria-s-alaune');
    const output = describePoisForPlace('thornwall-southgate');

    assert.equal(guide.name, 'Sera Talwin');
    assert.doesNotMatch(output, /Mara Venn/);
    assert.doesNotMatch(output, /coordinate/i);
    assert.doesNotMatch(output, /source\s+[A-Z]-?\d+/i);
});
