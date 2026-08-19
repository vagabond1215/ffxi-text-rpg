import test from 'node:test';
import assert from 'node:assert/strict';

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

test('default content census derives nonzero canonical breadth and supplemental evidence', () => {
    const counts = collectContentScaleCounts();

    for (const metric of CONTENT_SCALE_METRICS) {
        assert.ok(Number.isInteger(counts[metric]));
        assert.ok(counts[metric] >= 0);
    }
    assert.ok(counts.places > 0);
    assert.ok(counts.items > 0);
    assert.ok(counts.creatures > 0);
    assert.ok(counts.supplemental.routes > 0);
    assert.ok(counts.supplemental.contentPacks > 0);
    assert.ok(counts.supplemental.ownedPackRecords > 0);
    assert.ok(counts.supplemental.seedNpcs > 0);
    assert.ok(counts.supplemental.seedEnemies > 0);
    assert.deepEqual(counts.supplemental.packIndexIssues, []);
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

test('content scale report exposes outstanding gaps without treating them as failures', () => {
    const report = evaluateContentScaleGate({
        counts: {
            ...CONTENT_SCALE_TARGETS.mechanicsIntegration,
            npcs: 10,
            items: 50,
        },
    });
    const text = formatContentScaleReport(report);

    assert.match(text, /Hearth & Horizon Content Scale Gate v1/);
    assert.match(text, /Mechanics-scale gate: NOT READY/);
    assert.match(text, /Named NPCs: 10\/50 \(40 remaining\)/);
    assert.match(text, /Canonical items: 50\/200 \(150 remaining\)/);
    assert.ok(report.gaps.some((gap) => gap.id === 'npcs'));
    assert.ok(report.gaps.some((gap) => gap.id === 'items'));
});
