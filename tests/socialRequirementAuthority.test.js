import test from 'node:test';
import assert from 'node:assert/strict';

import {
    SOCIAL_RELATIONSHIP_DIMENSIONS,
    normalizeRelationshipRequirements,
    validateRelationshipRequirements,
} from '../js/text/data/socialRequirements.js';
import { createNewGameState } from '../js/text/gameState.js';
import { checkCommitmentEligibility } from '../js/text/systems/commitmentEngine.js';
import { applyNpcRelationshipChange } from '../js/text/systems/relationshipEngine.js';
import { evaluateRelationshipRequirements } from '../js/text/systems/socialRequirementEngine.js';

test('Q0 relationship requirement schema shares the canonical social dimensions', () => {
    assert.deepEqual(SOCIAL_RELATIONSHIP_DIMENSIONS, ['familiarity', 'respect', 'trust', 'obligation']);

    const normalized = normalizeRelationshipRequirements([
        { npcId: 'npc-ironspine-vara-kell', minimums: { respect: 2, trust: 1 } },
    ]);
    assert.deepEqual(normalized, [
        { npcId: 'npc-ironspine-vara-kell', minimums: { respect: 2, trust: 1 } },
    ]);
    assert.equal(Object.isFrozen(normalized), true);
    assert.equal(Object.isFrozen(normalized[0]), true);
    assert.equal(Object.isFrozen(normalized[0].minimums), true);
    assert.deepEqual(validateRelationshipRequirements(normalized, { label: 'fixture.relationshipRequirements' }), []);
});

test('Q0 rejects unknown relationship dimensions and unknown persistent NPCs', () => {
    const issues = validateRelationshipRequirements([
        { npcId: 'npc-not-a-real-person', minimums: { trust: 1, affection: 2 } },
    ], { label: 'fixture.relationshipRequirements' });

    assert.deepEqual(issues, [
        'fixture.relationshipRequirements[0].npcId references unknown NPC npc-not-a-real-person.',
        'fixture.relationshipRequirements[0].minimums uses unknown relationship dimension affection.',
    ]);
});

test('Q0 evaluates cross-NPC relationship thresholds without adding state outside relationship authority', () => {
    const state = createNewGameState();
    const requirements = [
        { npcId: 'npc-ironspine-vara-kell', minimums: { respect: 2 } },
        { npcId: 'npc-ironspine-dain-rove', minimums: { trust: 1 } },
    ];

    let evaluated = evaluateRelationshipRequirements(state, requirements);
    assert.equal(evaluated.ok, false);
    assert.deepEqual(evaluated.unmet.map((entry) => [entry.npcId, entry.dimension, entry.actual, entry.minimum]), [
        ['npc-ironspine-vara-kell', 'respect', 0, 2],
        ['npc-ironspine-dain-rove', 'trust', 0, 1],
    ]);

    assert.equal(applyNpcRelationshipChange(state, 'npc-ironspine-vara-kell', { respect: 2 }, { source: 'test' }).ok, true);
    assert.equal(applyNpcRelationshipChange(state, 'npc-ironspine-dain-rove', { trust: 1 }, { source: 'test' }).ok, true);

    evaluated = evaluateRelationshipRequirements(state, requirements);
    assert.equal(evaluated.ok, true);
    assert.deepEqual(evaluated.unmet, []);
    assert.equal(state.version, 21);
});

test('Q0 commitment eligibility composes resolved prerequisites with cross-NPC relationship requirements', () => {
    const state = createNewGameState();
    const fixture = {
        id: 'commitment-q0-social-fixture',
        prerequisiteCommitmentIds: [],
        relationshipRequirements: [
            { npcId: 'npc-ironspine-vara-kell', minimums: { respect: 1 } },
        ],
    };

    let eligibility = checkCommitmentEligibility(state, fixture);
    assert.equal(eligibility.ok, false);
    assert.equal(eligibility.missingCommitmentIds.length, 0);
    assert.equal(eligibility.unmetRelationshipRequirements[0].npcId, 'npc-ironspine-vara-kell');

    assert.equal(applyNpcRelationshipChange(state, 'npc-ironspine-vara-kell', { respect: 1 }, { source: 'test' }).ok, true);
    eligibility = checkCommitmentEligibility(state, fixture);
    assert.equal(eligibility.ok, true);
    assert.deepEqual(eligibility.unmetRelationshipRequirements, []);
});
