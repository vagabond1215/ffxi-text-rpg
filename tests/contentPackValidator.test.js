import test from 'node:test';
import assert from 'node:assert/strict';

import { createContentPack } from '../js/text/data/contentPackSchema.js';
import {
    ELDERWOOD_PACK,
    REGIONAL_CONTENT_PACKS,
    SHARED_FOUNDATION_PACK,
    STARFEN_PACK,
} from '../js/text/data/regionalContentPacks.js';
import {
    normalizeLegacyCandidate,
    validateLegacyCandidateRecord,
} from '../js/text/data/legacyCandidateNormalizer.js';
import {
    buildContentPackIndex,
    validateContentPacks,
} from '../js/text/systems/contentPackValidator.js';


test('representative shared Elderwood and Starfen packs validate as one cross-linked graph', () => {
    assert.equal(SHARED_FOUNDATION_PACK.ownership.scope, 'shared');
    assert.deepEqual(ELDERWOOD_PACK.ownership.regionIds, ['elderwood']);
    assert.deepEqual(STARFEN_PACK.ownership.regionIds, ['starfen']);
    assert.ok(STARFEN_PACK.dependencies.includes('pack-elderwood-opening'));
    assert.deepEqual(validateContentPacks(REGIONAL_CONTENT_PACKS), []);
});

test('content pack index records stable ownership without rewriting canonical ids', () => {
    const index = buildContentPackIndex(REGIONAL_CONTENT_PACKS);

    assert.deepEqual(index.issues, []);
    assert.deepEqual(index.packIds, ['pack-shared-foundation', 'pack-elderwood-opening', 'pack-starfen-opening']);
    assert.ok(index.recordCounts.places >= 5);
    assert.ok(index.recordCounts.items >= 9);
    assert.ok(index.recordCounts.recipes >= 2);
    assert.ok(index.ownerCount > 20);
});

test('duplicate stable-id ownership across packs is rejected', () => {
    const conflicting = createContentPack({
        id: 'pack-conflicting-owner',
        dataVersion: 19,
        ownership: { scope: 'region', regionIds: ['conflict-reach'] },
        records: { items: [{ id: 'item-elderwood-root-tonic', exemptions: { source: true, sink: true } }] },
    });

    const issues = validateContentPacks([ELDERWOOD_PACK, conflicting], { includeCanonicalCatalogs: false });
    assert.ok(issues.some((issue) => issue.includes('stable-id ownership conflict for items:item-elderwood-root-tonic')));
});

test('cross-pack references require declared dependencies even when the target id is canonical', () => {
    const dependent = createContentPack({
        id: 'pack-unannounced-trade',
        dataVersion: 19,
        ownership: { scope: 'region', regionIds: ['trade-test'] },
        records: {
            npcs: [{ id: 'npc-trade-test-keeper', placeId: 'west-elderwood' }],
            shops: [{
                id: 'shop-trade-test',
                placeId: 'west-elderwood',
                keeperNpcId: 'npc-trade-test-keeper',
                stockItemIds: ['item-elderwood-root-tonic'],
            }],
        },
    });

    const issues = validateContentPacks([ELDERWOOD_PACK, dependent], { includeCanonicalCatalogs: false });
    assert.ok(issues.some((issue) => issue.includes('owned by pack-elderwood-opening without declaring it as a dependency')));
});

test('dangling topology, source-sink, quest, and relationship references are reported', () => {
    const broken = createContentPack({
        id: 'pack-broken-fixture',
        dataVersion: 19,
        ownership: { scope: 'region', regionIds: ['broken-fixture'] },
        records: {
            routes: [{
                id: 'route-broken-fixture',
                stops: [
                    { id: 'stop-broken-a', placeId: 'west-elderwood' },
                    { id: 'stop-broken-b', placeId: 'missing-place' },
                ],
                segments: [{ fromStopId: 'stop-broken-a', toStopId: 'stop-broken-b', durationSeconds: 30 }],
            }],
            items: [{ id: 'item-broken-fixture', name: 'Broken Fixture' }],
            npcs: [{ id: 'npc-broken-fixture', placeId: 'missing-place' }],
            quests: [{
                id: 'quest-broken-fixture',
                giverNpcId: 'npc-missing-giver',
                placeId: 'missing-place',
                objectives: [{ type: 'deliverItem', itemId: 'item-missing-output', quantity: 1 }],
                rewards: [],
            }],
            relationships: [{
                id: 'relationship-broken-fixture',
                npcId: 'npc-missing-giver',
                dimensions: ['trust'],
                unlockQuestIds: ['quest-missing-unlock'],
            }],
        },
    });

    const issues = validateContentPacks([broken], { includeCanonicalCatalogs: false });
    assert.ok(issues.some((issue) => issue.includes('missing places id missing-place')));
    assert.ok(issues.some((issue) => issue.includes('provenance requires at least one intentional source')));
    assert.ok(issues.some((issue) => issue.includes('sinks requires at least one intentional use or sink')));
    assert.ok(issues.some((issue) => issue.includes('missing npcs id npc-missing-giver')));
    assert.ok(issues.some((issue) => issue.includes('missing items id item-missing-output')));
    assert.ok(issues.some((issue) => issue.includes('missing quests id quest-missing-unlock')));
});

test('legacy identifiers are rejected from canonical packs unless an explicit adapter is declared', () => {
    const leaking = createContentPack({
        id: 'pack-legacy-leak-fixture',
        dataVersion: 19,
        ownership: { scope: 'region', regionIds: ['legacy-test'] },
        records: { places: [{ id: 'west-ronfaure', catalogRef: true }] },
    });
    const adapted = createContentPack({
        id: 'pack-legacy-adapter-fixture',
        dataVersion: 19,
        ownership: { scope: 'region', regionIds: ['legacy-test-adapted'] },
        legacyAdapters: [{
            legacyId: 'west-ronfaure',
            canonicalId: 'west-elderwood',
            reason: 'Explicit migration-boundary fixture.',
        }],
        records: { places: [{ id: 'west-ronfaure', catalogRef: true }] },
    });

    const leakingIssues = validateContentPacks([leaking], { includeCanonicalCatalogs: false });
    const adaptedIssues = validateContentPacks([adapted], { includeCanonicalCatalogs: false });
    assert.ok(leakingIssues.some((issue) => issue.includes('legacy identifier west-ronfaure leaks into canonical pack')));
    assert.equal(adaptedIssues.some((issue) => issue.includes('legacy identifier west-ronfaure')), false);
});

test('legacy normalization produces review-only candidates rather than canonical imports', () => {
    const candidate = normalizeLegacyCandidate({
        sourceSystem: 'historical-place-table',
        recordType: 'place',
        sourceId: 'west-ronfaure',
        payload: { historicalLevelRange: [1, 8] },
    });

    assert.equal(candidate.proposedId, 'west-elderwood');
    assert.equal(candidate.reviewStatus, 'candidate');
    assert.equal(candidate.canonical, false);
    assert.equal(candidate.requiresOriginalityReview, true);
    assert.deepEqual(validateLegacyCandidateRecord(candidate), []);
});

test('generated hundreds-record fixture validates lookup and cross-reference breadth', () => {
    const count = 300;
    const items = [];
    const recipes = [];
    for (let index = 0; index < count; index += 1) {
        const suffix = String(index).padStart(3, '0');
        const itemId = `item-scale-fixture-${suffix}`;
        const recipeId = `recipe-scale-fixture-${suffix}`;
        items.push({
            id: itemId,
            name: `Scale Fixture ${suffix}`,
            kind: 'material',
            provenance: [{
                version: 1,
                type: 'crafting',
                sourceId: recipeId,
                placeId: 'west-elderwood',
                action: 'craft',
                exceptional: false,
                notes: '',
                data: {},
            }],
            sinks: [{ type: 'trade', targetId: null, notes: '', data: {} }],
        });
        recipes.push({
            id: recipeId,
            name: `Scale Recipe ${suffix}`,
            placeIds: ['west-elderwood'],
            inputs: [{ itemId: 'item-elderwood-sweetroot', quantity: 1 }],
            outputs: [{ itemId, quantity: 1 }],
        });
    }

    const scalePack = createContentPack({
        id: 'pack-scale-fixture',
        dataVersion: 19,
        ownership: { scope: 'region', regionIds: ['scale-fixture'] },
        records: { items, recipes },
    });
    const issues = validateContentPacks([scalePack], { includeCanonicalCatalogs: false });
    const index = buildContentPackIndex([scalePack]);

    assert.deepEqual(issues, []);
    assert.equal(index.recordCounts.items, 300);
    assert.equal(index.recordCounts.recipes, 300);
    assert.equal(index.ownerCount, 600);
});
