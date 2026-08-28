import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeItem } from '../js/text/data/itemSchema.js';
import {
    hasIntentionalSink,
    hasIntentionalSource,
    normalizeItemSinks,
    normalizeProvenance,
    validateItemResourceMetadata,
    validateItemSinks,
    validateProvenance,
} from '../js/text/data/resourceProvenance.js';


test('provenance normalizes physical economic social and exceptional sources', () => {
    const entries = normalizeProvenance([
        { type: 'body', sourceId: 'brush-hare', placeId: 'west-elderwood', action: 'skin' },
        { type: 'commerce', sourceId: 'thornwall-tanner', action: 'purchase' },
        { type: 'contract', sourceId: 'contract-hide-order', action: 'earn' },
        { type: 'exceptionalMagic', sourceId: 'ritual-moon-thread', action: 'conjure', exceptional: true },
    ]);

    assert.equal(entries.length, 4);
    assert.equal(entries[0].version, 1);
    assert.equal(entries[0].type, 'body');
    assert.equal(entries[3].exceptional, true);
    assert.deepEqual(validateProvenance(entries, { requireSource: true }), []);
});

test('provenance validation rejects unknown actions invalid ids and unmarked exceptional magic', () => {
    const entries = normalizeProvenance([
        { type: 'body', sourceId: 'bad id!', action: 'teleport' },
        { type: 'exceptionalMagic', sourceId: 'ritual-thread', action: 'conjure' },
    ]);

    const issues = validateProvenance(entries);

    assert.ok(issues.some((issue) => issue.includes('action is unknown')));
    assert.ok(issues.some((issue) => issue.includes('exceptional must be true')));
});

test('item sinks normalize intentional material uses', () => {
    const sinks = normalizeItemSinks([
        { type: 'craftIngredient', targetId: 'recipe-leather-wrap' },
        { type: 'construction', targetId: 'project-field-shelter' },
        'trade',
    ]);

    assert.equal(sinks.length, 3);
    assert.equal(sinks[0].targetId, 'recipe-leather-wrap');
    assert.deepEqual(validateItemSinks(sinks, { requireSink: true }), []);
});

test('normalized items expose provenance and sink metadata without removing legacy source notes', () => {
    const item = normalizeItem({
        id: 'hare-hide',
        name: 'Hare Hide',
        kind: 'material',
        source: { type: 'legacy-loot-note' },
        provenance: [{ type: 'body', sourceId: 'brush-hare', action: 'skin' }],
        sinks: [{ type: 'craftIngredient', targetId: 'recipe-cured-hide' }],
    });

    assert.equal(item.schemaVersion, 4);
    assert.equal(item.source.type, 'legacy-loot-note');
    assert.equal(item.provenance[0].type, 'body');
    assert.equal(item.sinks[0].type, 'craftIngredient');
    assert.equal(hasIntentionalSource(item), true);
    assert.equal(hasIntentionalSink(item), true);
    assert.deepEqual(validateItemResourceMetadata(item, { requireSource: true, requireSink: true }), []);
});

test('resource metadata validation can require both a source and a sink', () => {
    const item = normalizeItem({ id: 'orphan-material', name: 'Orphan Material', kind: 'material' });
    const issues = validateItemResourceMetadata(item, { requireSource: true, requireSink: true });

    assert.ok(issues.some((issue) => issue.includes('at least one intentional source')));
    assert.ok(issues.some((issue) => issue.includes('at least one intentional use or sink')));
});
