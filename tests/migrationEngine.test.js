import test from 'node:test';
import assert from 'node:assert/strict';

import { migrateVersionedValue } from '../js/text/systems/migrationEngine.js';


test('ordered migration engine applies every required step in sequence', () => {
    const source = { version: 1, values: [] };
    const result = migrateVersionedValue(source, {
        currentVersion: 3,
        label: 'fixture',
        migrations: [
            { id: 'one-to-two', from: 1, to: 2, migrate: (value) => ({ ...value, version: 2, values: [...value.values, 2] }) },
            { id: 'two-to-three', from: 2, to: 3, migrate: (value) => ({ ...value, version: 3, values: [...value.values, 3] }) },
        ],
    });

    assert.equal(result.ok, true);
    assert.equal(result.migrated, true);
    assert.deepEqual(result.applied, ['one-to-two', 'two-to-three']);
    assert.deepEqual(result.value.values, [2, 3]);
    assert.equal(source.version, 1);
    assert.deepEqual(source.values, []);
});

test('ordered migration engine fails deterministically on missing or future versions', () => {
    const missing = migrateVersionedValue({ version: 1 }, {
        currentVersion: 3,
        label: 'fixture',
        migrations: [{ id: 'two-to-three', from: 2, to: 3, migrate: (value) => ({ ...value, version: 3 }) }],
    });
    assert.equal(missing.ok, false);
    assert.equal(missing.code, 'missing-migration');
    assert.equal(missing.stoppedAtVersion, 1);

    const future = migrateVersionedValue({ version: 6 }, { currentVersion: 5, label: 'fixture' });
    assert.equal(future.ok, false);
    assert.equal(future.code, 'future-version');
});
