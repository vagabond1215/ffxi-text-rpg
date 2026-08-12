function cloneValue(value) {
    if (typeof structuredClone === 'function') return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
}

function failure(code, message, details = {}) {
    return { ok: false, code, message, ...details };
}

export function migrateVersionedValue(value, options = {}) {
    const {
        currentVersion,
        migrations = [],
        label = 'payload',
        versionKey = 'version',
    } = options;

    if (!Number.isInteger(currentVersion) || currentVersion < 0) {
        throw new Error('Migration currentVersion must be a non-negative integer.');
    }
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return failure('invalid-payload', `${label} must be an object.`);
    }

    const startVersion = value[versionKey];
    if (!Number.isInteger(startVersion) || startVersion < 0) {
        return failure('missing-version', `${label} has no supported integer ${versionKey}.`);
    }
    if (startVersion > currentVersion) {
        return failure(
            'future-version',
            `${label} version ${startVersion} is newer than supported version ${currentVersion}.`,
            { fromVersion: startVersion, toVersion: currentVersion },
        );
    }

    const migrationsByFrom = new Map();
    for (const migration of migrations) {
        if (!migration || !Number.isInteger(migration.from) || !Number.isInteger(migration.to) || typeof migration.migrate !== 'function') {
            throw new Error(`Invalid migration definition for ${label}.`);
        }
        if (migration.to !== migration.from + 1) {
            throw new Error(`Migration ${migration.id ?? `${migration.from}->${migration.to}`} must advance exactly one version.`);
        }
        if (migrationsByFrom.has(migration.from)) {
            throw new Error(`Duplicate migration from version ${migration.from} for ${label}.`);
        }
        migrationsByFrom.set(migration.from, migration);
    }

    let working = cloneValue(value);
    let version = startVersion;
    const applied = [];

    while (version < currentVersion) {
        const migration = migrationsByFrom.get(version);
        if (!migration) {
            return failure(
                'missing-migration',
                `${label} cannot migrate from version ${version} to ${version + 1}.`,
                { fromVersion: startVersion, stoppedAtVersion: version, toVersion: currentVersion, applied },
            );
        }

        try {
            const migrated = migration.migrate(working);
            if (!migrated || typeof migrated !== 'object' || Array.isArray(migrated)) {
                return failure(
                    'invalid-migration-result',
                    `${label} migration ${migration.id ?? `${migration.from}->${migration.to}`} did not return an object.`,
                    { fromVersion: startVersion, stoppedAtVersion: version, toVersion: currentVersion, applied },
                );
            }
            if (migrated[versionKey] !== migration.to) {
                return failure(
                    'invalid-migration-version',
                    `${label} migration ${migration.id ?? `${migration.from}->${migration.to}`} did not set ${versionKey} to ${migration.to}.`,
                    { fromVersion: startVersion, stoppedAtVersion: version, toVersion: currentVersion, applied },
                );
            }
            working = migrated;
            version = migration.to;
            applied.push(migration.id ?? `${migration.from}->${migration.to}`);
        } catch (error) {
            return failure(
                'migration-error',
                `${label} migration ${migration.id ?? `${migration.from}->${migration.to}`} failed: ${error.message}`,
                { fromVersion: startVersion, stoppedAtVersion: version, toVersion: currentVersion, applied, error },
            );
        }
    }

    return {
        ok: true,
        value: working,
        fromVersion: startVersion,
        toVersion: currentVersion,
        applied,
        migrated: applied.length > 0,
    };
}
