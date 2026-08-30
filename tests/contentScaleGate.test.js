import test from 'node:test';
import assert from 'node:assert/strict';

import { createContentPack } from '../js/text/data/contentPackSchema.js';
import {
    CONTENT_SCALE_METRICS,
    CONTENT_SCALE_TARGETS,
    collectContentScaleCounts,
    evaluateContentScaleGate,
    formatContentScaleReport,
} from '../js/text/systems/contentScaleGate.js';


test('content scale targets preserve repository planning lower bounds', () => {
    assert.deepEqual(CONTENT_SCALE_TARGETS.mechanicsIntegration, {
        places: 10,
        npcs: 50,
        functionalServices: 20,
        creatures: 40,
        resources: 40,
        items: 200,
        recipes: 75,
        abilities: 100,
        quests: 30,
        companions: 4,
        transportServices: 5,
    });
    assert.deepEqual(CONTENT_SCALE_TARGETS.playableAlpha, {
        places: 30,
        npcs: 250,
        functionalServices: 60,
        creatures: 120,
        resources: 100,
        items: 800,
        recipes: 300,
        abilities: 250,
        quests: 150,
        companions: 12,
        transportServices: 20,
    });
    assert.deepEqual(CONTENT_SCALE_TARGETS.onePointZero, {
        places: 75,
        npcs: 700,
        functionalServices: 150,
        creatures: 300,
        resources: 250,
        items: 2500,
        recipes: 800,
        abilities: 500,
        quests: 500,
        companions: 25,
        transportServices: 50,
    });
});

test('default content census exposes catalog breadth and Pack v2 ownership coverage separately', () => {
    const counts = collectContentScaleCounts();
    console.log('DRY_UPLAND_SALTPAN_MEASURED_CONTENT_SCALE', JSON.stringify(counts));

    for (const metric of CONTENT_SCALE_METRICS) {
        assert.ok(Number.isInteger(counts[metric]));
        assert.ok(counts[metric] >= 0);
    }
    assert.ok(counts.places > 0);
    assert.ok(counts.items > 0);
    assert.ok(counts.creatures > 0);
    assert.ok(counts.supplemental.routes > 0);
    assert.equal(counts.supplemental.spellSchools, 4);
    assert.equal(counts.supplemental.capabilities, 44);
    assert.equal(counts.supplemental.npcSchedules, 27);
    assert.equal(counts.supplemental.contentPacks, 34);
    assert.ok(counts.supplemental.ownedPackRecords >= 248);
    assert.equal(counts.supplemental.packOwnedByCollection.spellSchools, 4);
    assert.equal(counts.supplemental.packOwnedByCollection.capabilities, 44);
    assert.equal(counts.supplemental.packOwnedByCollection.abilities, 41);
    assert.equal(counts.supplemental.packOwnedByCollection.npcSchedules, 27);
    assert.equal(counts.supplemental.packOwnedByCollection.companions, 1);
    assert.ok(counts.supplemental.seedNpcs > 0);
    assert.ok(counts.supplemental.seedEnemies > 0);
    assert.deepEqual(counts.supplemental.packIndexIssues, []);
});

test('census counts future pack-owned abilities and companions without double-counting catalog refs', () => {
    const pack = createContentPack({
        id: 'pack-census-v2-fixture',
        dataVersion: 26,
        ownership: { scope: 'region', regionIds: ['census-v2'] },
        records: {
            capabilities: [{
                id: 'technique-census-v2', name: 'Census V2', type: 'technique', tags: ['test'],
                learning: { open: true, anyDiscipline: [] },
                use: { contexts: ['combat'], requiredSkills: [], mainHandTags: [], requiredToolTags: [], requiredPreparationTags: [], requiredFlags: [], resources: {} },
            }],
            abilities: [{
                id: 'ability-census-v2', name: 'Census V2', kind: 'technique', capabilityId: 'technique-census-v2', tags: ['test'],
                contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 0, interruptible: false }, cooldownSeconds: 1,
                costs: {}, effects: [{ type: 'damage', recipient: 'target', stat: 'str', base: 1, coefficient: 1 }],
            }],
            npcs: [{ id: 'npc-census-v2', name: 'Census V2', placeId: 'thornwall-southgate' }],
            companions: [{
                id: 'companion-census-v2', npcId: 'npc-census-v2', name: 'Census V2', description: 'Fixture.', homePlaceId: 'thornwall-southgate',
                recruitment: { placeIds: ['thornwall-southgate'], requiredFlags: [] }, level: 1,
                tactics: { role: 'test', policy: 'basic-attack-v1', defaultApproachId: 'steady-road' },
                fieldApproaches: [
                    { id: 'steady-road', name: 'Steady', summary: 'Fixture.', quote: '“Steady.”', attributeModifiers: {} },
                    { id: 'quick-road', name: 'Quick', summary: 'Fixture.', quote: '“Quick.”', attributeModifiers: {} },
                ],
                relationshipDimensions: ['trust'],
            }],
        },
    });
    const counts = collectContentScaleCounts({ contentPacks: [pack] });

    assert.equal(counts.abilities, 42);
    assert.equal(counts.companions, 2);
    assert.equal(counts.supplemental.capabilities, 45);
    assert.equal(counts.supplemental.packOwnedByCollection.abilities, 1);
    assert.equal(counts.supplemental.packOwnedByCollection.companions, 1);
});

test('content scale stage readiness is criteria-driven rather than calendar-driven', () => {
    const exactMechanics = { ...CONTENT_SCALE_TARGETS.mechanicsIntegration };
    const mechanicsReport = evaluateContentScaleGate({ counts: exactMechanics });
    assert.equal(mechanicsReport.stages.mechanicsIntegration.ready, true);
    assert.equal(mechanicsReport.mechanicsScaleReady, true);
    assert.equal(mechanicsReport.stages.playableAlpha.ready, false);
    assert.equal(mechanicsReport.gaps.length, 0);
    assert.equal(mechanicsReport.nextPriority, null);

    const almost = { ...exactMechanics, companions: exactMechanics.companions - 1 };
    const almostReport = evaluateContentScaleGate({ counts: almost });
    assert.equal(almostReport.mechanicsScaleReady, false);
    assert.equal(almostReport.stages.mechanicsIntegration.metrics.companions.remaining, 1);
    assert.equal(almostReport.nextPriority, 'companions');
});

test('content scale report exposes outstanding gaps and infrastructure coverage without treating gaps as failures', () => {
    const report = evaluateContentScaleGate({
        counts: {
            ...CONTENT_SCALE_TARGETS.mechanicsIntegration,
            npcs: 10,
            items: 50,
            supplemental: {
                spellSchools: 3,
                capabilities: 8,
                npcSchedules: 4,
                packOwnedByCollection: { abilities: 5, capabilities: 8, npcSchedules: 4, companions: 1 },
            },
        },
    });
    const text = formatContentScaleReport(report);

    assert.match(text, /Hearth & Horizon Content Scale Gate v2/);
    assert.match(text, /Mechanics-scale gate: NOT READY/);
    assert.match(text, /Named NPCs: 10\/50 \(40 remaining\)/);
    assert.match(text, /Canonical items: 50\/200 \(150 remaining\)/);
    assert.match(text, /pack-owned abilities\/capabilities\/schedules\/companions: 5\/8\/4\/1/);
    assert.ok(report.gaps.some((gap) => gap.id === 'npcs'));
    assert.ok(report.gaps.some((gap) => gap.id === 'items'));
});
