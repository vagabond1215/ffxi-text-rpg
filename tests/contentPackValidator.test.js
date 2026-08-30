import test from 'node:test';
import assert from 'node:assert/strict';

import {
    CONTENT_PACK_SCHEMA_VERSION,
    createContentPack,
} from '../js/text/data/contentPackSchema.js';
import {
    ELDERWOOD_PACK,
    REDSTONE_PACK,
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


test('Pack v2 owns the scale-critical catalog families in one cross-linked regional graph', () => {
    assert.equal(CONTENT_PACK_SCHEMA_VERSION, 2);
    assert.equal(SHARED_FOUNDATION_PACK.schemaVersion, 2);
    assert.equal(SHARED_FOUNDATION_PACK.ownership.scope, 'shared');
    assert.deepEqual(ELDERWOOD_PACK.ownership.regionIds, ['elderwood']);
    assert.deepEqual(REDSTONE_PACK.ownership.regionIds, ['redstone-reach']);
    assert.deepEqual(STARFEN_PACK.ownership.regionIds, ['starfen']);
    assert.ok(STARFEN_PACK.dependencies.includes('pack-elderwood-opening'));
    assert.deepEqual(validateContentPacks(REGIONAL_CONTENT_PACKS), []);
});

test('content pack index records expanded stable ownership without changing canonical ids', () => {
    const index = buildContentPackIndex(REGIONAL_CONTENT_PACKS);

    assert.deepEqual(index.issues, []);
    console.log('WETLAND_ISLAND_MEASURED_PACK_INDEX', JSON.stringify({ packIds: index.packIds, recordCounts: index.recordCounts, ownerCount: index.ownerCount }));
    assert.deepEqual(index.packIds, [
        'pack-shared-foundation',
        'pack-elderwood-opening',
        'pack-elderwood-hunt-timber',
        'pack-crownfields-grange',
        'pack-regional-ingredient-luxury-processing',
        'pack-material-foundations-common-components',
        'pack-slatewater-waylodge',
        'pack-great-mere-merewatch',
        'pack-ironspine-highlands',
        'pack-headwater-vale',
        'pack-waymeet-marches-cairnward',
        'pack-emberwash-cinderwell-station',
        'pack-lower-deepvein-lantern-sump',
        'pack-gloamwood-oldbough-refuge',
        'pack-starfen-delta-tideglass',
        'pack-redstone-opening',
        'pack-redstone-forge-road',
        'pack-starfen-opening',
        'pack-starfen-marshcraft',
        'pack-elderwood-ecology-breadth',
        'pack-redstone-ecology-breadth',
        'pack-starfen-ecology-breadth',
        'pack-coppergrass-steppe-ecology',
        'pack-crownfields-agricultural-ecology',
        'pack-slatewater-foothills-ecology',
        'pack-great-mere-freshwater-ecology',
        'pack-ironspine-highlands-ecology',
        'pack-headwater-vale-ecology',
        'pack-emberwash-badlands-ecology',
        'pack-lower-deepvein-ecology',
        'pack-gloamwood-oldgrowth-ecology',
        'pack-starfen-delta-brackish-ecology',
        'pack-waymeet-marches-ecology',
        'pack-elderwood-legacy-ecology-repair',
        'pack-headwater-highland-transition-repair',
        'pack-redstone-dry-upland-ecology-repair',
        'pack-emberwash-saltpan-ecology-repair',
    ]);
    assert.equal(index.recordCounts.places, 37);
    assert.equal(index.recordCounts.items, 377);
    assert.equal(index.recordCounts.recipes, 228);
    assert.equal(index.recordCounts.npcs, 43);
    assert.equal(index.recordCounts.npcSchedules, 27);
    assert.equal(index.recordCounts.spellSchools, 4);
    assert.equal(index.recordCounts.capabilities, 44);
    assert.equal(index.recordCounts.abilities, 41);
    assert.equal(index.recordCounts.companions, 1);
    assert.ok(index.ownerCount >= 248);
});

test('catalog refs bridge canonical resource production equipment recipe quest and NPC catalogs', () => {
    const bridgePack = createContentPack({
        id: 'pack-catalog-bridge-fixture',
        dataVersion: 26,
        ownership: { scope: 'region', regionIds: ['catalog-bridge'] },
        records: {
            places: [{ id: 'brasshaven-market-ring', catalogRef: true }],
            items: [
                { id: 'item-elderwood-sweetroot', catalogRef: true },
                { id: 'item-redstone-copper-ingot', catalogRef: true },
                { id: 'bronze-sword', catalogRef: true },
            ],
            recipes: [{ id: 'process-redstone-copper-ingot', catalogRef: true }],
            quests: [{ id: 'commitment-brasshaven-copper-return', catalogRef: true }],
            npcs: [{ id: 'npc-brasshaven-marshal-varric-stone', catalogRef: true }],
        },
    });

    assert.deepEqual(validateContentPacks([bridgePack], { includeCanonicalCatalogs: false }), []);
});

test('duplicate stable-id ownership across packs is rejected', () => {
    const conflicting = createContentPack({
        id: 'pack-conflicting-owner',
        dataVersion: 26,
        ownership: { scope: 'region', regionIds: ['conflict-reach'] },
        records: { items: [{ id: 'item-elderwood-root-tonic', exemptions: { source: true, sink: true } }] },
    });

    const issues = validateContentPacks([ELDERWOOD_PACK, conflicting], { includeCanonicalCatalogs: false });
    assert.ok(issues.some((issue) => issue.includes('stable-id ownership conflict for items:item-elderwood-root-tonic')));
});

test('cross-pack references require declared dependencies even for new ability-capability families', () => {
    const capabilityPack = createContentPack({
        id: 'pack-training-owner',
        dataVersion: 26,
        ownership: { scope: 'shared', regionIds: [] },
        records: {
            capabilities: [{
                id: 'technique-scale-dependency',
                name: 'Scale Dependency',
                type: 'technique',
                tags: ['test'],
                learning: { open: true, anyDiscipline: [] },
                use: {
                    contexts: ['combat'], requiredSkills: [], mainHandTags: [], requiredToolTags: [],
                    requiredPreparationTags: [], requiredFlags: [], resources: {},
                },
            }],
        },
    });
    const abilityPack = createContentPack({
        id: 'pack-ability-consumer',
        dataVersion: 26,
        ownership: { scope: 'region', regionIds: ['dependency-test'] },
        records: {
            abilities: [{
                id: 'ability-scale-dependency',
                name: 'Scale Dependency',
                kind: 'technique',
                capabilityId: 'technique-scale-dependency',
                tags: ['test'],
                contexts: ['combat'],
                target: { kind: 'enemy' },
                activation: { durationSeconds: 0, interruptible: false },
                cooldownSeconds: 1,
                costs: {},
                effects: [{ type: 'damage', recipient: 'target', stat: 'str', base: 1, coefficient: 1 }],
            }],
        },
    });

    const issues = validateContentPacks([capabilityPack, abilityPack], { includeCanonicalCatalogs: false });
    assert.ok(issues.some((issue) => issue.includes('capabilities:technique-scale-dependency owned by pack-training-owner without declaring it as a dependency')));
});

test('cross-pack references require declared dependencies even when the target id is canonical', () => {
    const dependent = createContentPack({
        id: 'pack-unannounced-trade',
        dataVersion: 26,
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

test('dangling scale-family references are reported before content volume can grow', () => {
    const broken = createContentPack({
        id: 'pack-broken-scale-families',
        dataVersion: 26,
        ownership: { scope: 'region', regionIds: ['broken-scale'] },
        records: {
            abilities: [{
                id: 'ability-broken-scale', name: 'Broken Scale', kind: 'spell', schoolId: 'school-missing', capabilityId: 'capability-missing',
                tags: ['test'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 1, interruptible: true },
                cooldownSeconds: 1, costs: { mp: 1 }, effects: [{ type: 'damage', recipient: 'target', stat: 'int', base: 1, coefficient: 1 }],
            }],
            npcSchedules: [{
                id: 'schedule-broken-scale', npcId: 'npc-missing-scale', poiId: 'poi-broken-scale', placeId: 'missing-scale-place',
                label: 'Broken schedule', windows: [{ startSecond: 0, endSecond: 60, label: 'Broken window' }], unavailableText: 'Missing.',
            }],
            companions: [{
                id: 'companion-broken-scale', npcId: 'npc-missing-scale', name: 'Broken Scale', description: 'Fixture.', homePlaceId: 'missing-scale-place',
                recruitment: { placeIds: ['missing-scale-place'], requiredFlags: [] }, level: 1, tactics: { role: 'test', policy: 'basic-attack-v1', defaultApproachId: 'steady-road' },
                fieldApproaches: [
                    { id: 'steady-road', name: 'Steady', summary: 'Fixture.', quote: '“Steady.”', attributeModifiers: {} },
                    { id: 'quick-road', name: 'Quick', summary: 'Fixture.', quote: '“Quick.”', attributeModifiers: {} },
                ],
                relationshipDimensions: ['trust'],
            }],
        },
    });

    const issues = validateContentPacks([broken], { includeCanonicalCatalogs: false });
    assert.ok(issues.some((issue) => issue.includes('missing spellSchools id school-missing')));
    assert.ok(issues.some((issue) => issue.includes('missing capabilities id capability-missing')));
    assert.ok(issues.some((issue) => issue.includes('missing npcs id npc-missing-scale')));
    assert.ok(issues.some((issue) => issue.includes('missing places id missing-scale-place')));
});

test('dangling topology, source-sink, quest, and relationship references are reported', () => {
    const broken = createContentPack({
        id: 'pack-broken-fixture',
        dataVersion: 26,
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
        dataVersion: 26,
        ownership: { scope: 'region', regionIds: ['legacy-test'] },
        records: { places: [{ id: 'west-ronfaure', catalogRef: true }] },
    });
    const adapted = createContentPack({
        id: 'pack-legacy-adapter-fixture',
        dataVersion: 26,
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

test('generated scale fixture validates all Pack v2 families at four-digit ownership volume', () => {
    const count = 200;
    const items = [];
    const recipes = [];
    const npcs = [];
    const npcSchedules = [];
    const capabilities = [];
    const abilities = [];
    const companions = [];

    for (let index = 0; index < count; index += 1) {
        const suffix = String(index).padStart(3, '0');
        const itemId = `item-scale-fixture-${suffix}`;
        const recipeId = `recipe-scale-fixture-${suffix}`;
        const npcId = `npc-scale-fixture-${suffix}`;
        const scheduleId = `schedule-scale-fixture-${suffix}`;
        const capabilityId = `technique-scale-fixture-${suffix}`;
        const abilityId = `ability-scale-fixture-${suffix}`;
        const companionId = `companion-scale-fixture-${suffix}`;

        items.push({
            id: itemId,
            name: `Scale Fixture ${suffix}`,
            kind: 'material',
            provenance: [{
                version: 1,
                type: 'crafting',
                sourceId: recipeId,
                placeId: 'scale-fixture-place',
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
            placeIds: ['scale-fixture-place'],
            inputs: [{ itemId: 'item-elderwood-sweetroot', quantity: 1 }],
            outputs: [{ itemId, quantity: 1 }],
        });
        npcs.push({ id: npcId, name: `Scale NPC ${suffix}`, placeId: 'scale-fixture-place' });
        npcSchedules.push({
            id: scheduleId,
            npcId,
            poiId: `poi-scale-fixture-${suffix}`,
            placeId: 'scale-fixture-place',
            label: `Scale schedule ${suffix}`,
            windows: [{ startSecond: 3600, endSecond: 7200, label: 'Scale window' }],
            unavailableText: 'Off duty.',
        });
        capabilities.push({
            id: capabilityId,
            name: `Scale Technique ${suffix}`,
            type: 'technique',
            tags: ['scale'],
            learning: { open: true, anyDiscipline: [] },
            use: {
                contexts: ['combat'], requiredSkills: [], mainHandTags: [], requiredToolTags: [],
                requiredPreparationTags: [], requiredFlags: [], resources: {},
            },
        });
        abilities.push({
            id: abilityId,
            name: `Scale Technique ${suffix}`,
            kind: 'technique',
            capabilityId,
            tags: ['scale'],
            contexts: ['combat'],
            target: { kind: 'enemy' },
            activation: { durationSeconds: 0, interruptible: false },
            cooldownSeconds: 1,
            costs: {},
            effects: [{ type: 'damage', recipient: 'target', stat: 'str', base: 1, coefficient: 1 }],
        });
        companions.push({
            id: companionId,
            npcId,
            name: `Scale Companion ${suffix}`,
            description: 'Generated validation fixture.',
            homePlaceId: 'scale-fixture-place',
            recruitment: { placeIds: ['scale-fixture-place'], requiredFlags: [] },
            level: 1,
            tactics: { role: 'skirmisher', policy: 'basic-attack-v1', defaultApproachId: 'steady-road' },
            fieldApproaches: [
                { id: 'steady-road', name: 'Steady Road', summary: 'Generated validation fixture.', quote: '“Steady.”', attributeModifiers: {} },
                { id: 'quick-road', name: 'Quick Road', summary: 'Generated validation fixture.', quote: '“Quick.”', attributeModifiers: {} },
            ],
            relationshipDimensions: ['trust'],
        });
    }

    const scalePack = createContentPack({
        id: 'pack-scale-fixture',
        dataVersion: 26,
        ownership: { scope: 'region', regionIds: ['scale-fixture'] },
        records: {
            places: [{ id: 'scale-fixture-place', name: 'Scale Fixture Place' }],
            items,
            recipes,
            npcs,
            npcSchedules,
            capabilities,
            abilities,
            companions,
        },
    });
    const issues = validateContentPacks([scalePack], { includeCanonicalCatalogs: false });
    const index = buildContentPackIndex([scalePack]);

    assert.deepEqual(issues, []);
    assert.equal(index.recordCounts.items, count);
    assert.equal(index.recordCounts.recipes, count);
    assert.equal(index.recordCounts.npcs, count);
    assert.equal(index.recordCounts.npcSchedules, count);
    assert.equal(index.recordCounts.capabilities, count);
    assert.equal(index.recordCounts.abilities, count);
    assert.equal(index.recordCounts.companions, count);
    assert.equal(index.ownerCount, 1 + (count * 7));
});
