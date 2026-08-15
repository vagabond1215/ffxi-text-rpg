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
    assert.deepEqual(index.packIds, [
        'pack-shared-foundation',
        'pack-elderwood-opening',
        'pack-starfen-opening',
        'pack-elderwood-ecology-breadth',
        'pack-redstone-ecology-breadth',
        'pack-starfen-ecology-breadth',
    ]);
    assert.equal(index.recordCounts.places, 6);
    assert.equal(index.recordCounts.items, 16);
    assert.equal(index.recordCounts.recipes, 2);
    assert.ok(index.ownerCount > 40);
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

    const issues = validateContentPacks([SHARED_FOUNDATION_PACK, ELDERWOOD_PACK, dependent], { includeCanonicalCatalogs: false });
    assert.ok(issues.some((issue) => issue.includes('owned by pack-elderwood-opening without declaring it as a dependency')));
});

test('dangling topology, source-sink, quest, and relationship references are reported', () => {
    const broken = createContentPack({
        id: 'pack-broken-references',
        dataVersion: 19,
        ownership: { scope: 'region', regionIds: ['broken-reach'] },
        records: {
            places: [{ id: 'broken-place' }],
            routes: [{ id: 'broken-route', stops: [{ id: 'start', placeId: 'broken-place' }, { id: 'finish', placeId: 'missing-place' }] }],
            items: [{
                id: 'broken-item',
                provenance: [{ type: 'flora', sourceId: 'missing-source', placeId: 'broken-place', action: 'forage' }],
                sinks: [{ type: 'contract', targetId: 'missing-quest' }],
            }],
            quests: [{ id: 'broken-quest', giverNpcId: 'missing-npc', placeId: 'broken-place', objectives: [{ type: 'deliverItem', itemId: 'missing-item' }], rewards: [] }],
            relationships: [{ id: 'broken-relationship', npcId: 'missing-npc', unlockQuestIds: ['missing-quest'] }],
        },
    });

    const issues = validateContentPacks([broken], { includeCanonicalCatalogs: false });
    assert.ok(issues.some((issue) => issue.includes('unknown place missing-place')));
    assert.ok(issues.some((issue) => issue.includes('unknown gathering source missing-source')));
    assert.ok(issues.some((issue) => issue.includes('unknown target missing-quest')));
    assert.ok(issues.some((issue) => issue.includes('unknown NPC missing-npc')));
    assert.ok(issues.some((issue) => issue.includes('unknown item missing-item')));
});

test('legacy identifiers are rejected from canonical packs unless an explicit adapter is declared', () => {
    const leaked = createContentPack({
        id: 'pack-legacy-leak',
        dataVersion: 19,
        ownership: { scope: 'region', regionIds: ['legacy-test'] },
        records: { npcs: [{ id: 'npc-san-doria-guard', placeId: 'west-elderwood' }] },
    });
    const issues = validateContentPacks([leaked]);
    assert.ok(issues.some((issue) => issue.includes('legacy identifier')));

    const explicitAdapter = createContentPack({
        id: 'pack-legacy-adapter',
        dataVersion: 19,
        ownership: { scope: 'region', regionIds: ['legacy-test'] },
        records: { npcs: [{ id: 'npc-san-doria-guard', placeId: 'west-elderwood', legacyAdapter: true }] },
    });
    assert.equal(validateContentPacks([explicitAdapter]).some((issue) => issue.includes('legacy identifier')), false);
});

test('legacy normalization produces review-only candidates rather than canonical imports', () => {
    const candidate = normalizeLegacyCandidate('items', {
        id: 'Rabbit Hide',
        name: 'Rabbit Hide',
        source: 'Rarab in East Ronfaure',
        notes: 'Historical source: FFXI',
    }, { sourceDocument: 'legacyRecoveredData.js' });

    assert.equal(candidate.status, 'review-only');
    assert.equal(candidate.canonical, false);
    assert.equal(candidate.normalizedId, 'item-rabbit-hide');
    assert.match(candidate.sourceDocument, /legacyRecoveredData/);
    assert.deepEqual(validateLegacyCandidateRecord(candidate), []);
});