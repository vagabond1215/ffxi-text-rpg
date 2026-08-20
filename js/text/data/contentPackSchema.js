export const CONTENT_PACK_SCHEMA_VERSION = 2;

export const CONTENT_PACK_COLLECTIONS = Object.freeze([
    'places',
    'routes',
    'transportServices',
    'ecologyFamilies',
    'species',
    'populations',
    'gatheringSources',
    'items',
    'npcs',
    'npcSchedules',
    'shops',
    'recipes',
    'quests',
    'relationships',
    'spellSchools',
    'capabilities',
    'abilities',
    'companions',
]);

export function createContentPack(definition = {}) {
    const records = {};
    for (const collection of CONTENT_PACK_COLLECTIONS) {
        const entries = Array.isArray(definition.records?.[collection]) ? definition.records[collection] : [];
        records[collection] = Object.freeze(entries.map((entry) => Object.freeze(cloneRecord(entry))));
    }

    return Object.freeze({
        id: String(definition.id ?? '').trim(),
        schemaVersion: CONTENT_PACK_SCHEMA_VERSION,
        dataVersion: Number(definition.dataVersion),
        ownership: Object.freeze({
            scope: definition.ownership?.scope === 'shared' ? 'shared' : 'region',
            regionIds: Object.freeze(normalizeStringArray(definition.ownership?.regionIds)),
            steward: String(definition.ownership?.steward ?? '').trim(),
        }),
        dependencies: Object.freeze(normalizeStringArray(definition.dependencies)),
        legacyAdapters: Object.freeze(normalizeLegacyAdapters(definition.legacyAdapters)),
        records: Object.freeze(records),
        metadata: Object.freeze({
            name: String(definition.metadata?.name ?? definition.id ?? '').trim(),
            notes: String(definition.metadata?.notes ?? '').trim(),
        }),
    });
}

export function validateContentPackManifest(pack) {
    const issues = [];
    if (!plainObject(pack)) return ['content pack must be an object.'];
    if (!validStableId(pack.id)) issues.push('pack id must be a stable id.');
    if (pack.schemaVersion !== CONTENT_PACK_SCHEMA_VERSION) {
        issues.push(`${pack.id || 'pack'} schemaVersion must be ${CONTENT_PACK_SCHEMA_VERSION}.`);
    }
    if (!Number.isInteger(pack.dataVersion) || pack.dataVersion <= 0) {
        issues.push(`${pack.id || 'pack'} dataVersion must be a positive integer.`);
    }

    if (!plainObject(pack.ownership)) {
        issues.push(`${pack.id || 'pack'} ownership must be an object.`);
    } else {
        if (!['shared', 'region'].includes(pack.ownership.scope)) {
            issues.push(`${pack.id || 'pack'} ownership.scope must be shared or region.`);
        }
        if (!Array.isArray(pack.ownership.regionIds)) {
            issues.push(`${pack.id || 'pack'} ownership.regionIds must be an array.`);
        } else {
            for (const regionId of pack.ownership.regionIds) {
                if (!validStableId(regionId)) issues.push(`${pack.id || 'pack'} has invalid region id ${regionId}.`);
            }
            if (pack.ownership.scope === 'region' && pack.ownership.regionIds.length === 0) {
                issues.push(`${pack.id || 'pack'} regional ownership requires at least one region id.`);
            }
        }
    }

    if (!Array.isArray(pack.dependencies)) {
        issues.push(`${pack.id || 'pack'} dependencies must be an array.`);
    } else {
        for (const dependencyId of pack.dependencies) {
            if (!validStableId(dependencyId)) issues.push(`${pack.id || 'pack'} has invalid dependency id ${dependencyId}.`);
        }
    }

    if (!Array.isArray(pack.legacyAdapters)) {
        issues.push(`${pack.id || 'pack'} legacyAdapters must be an array.`);
    } else {
        for (const [index, adapter] of pack.legacyAdapters.entries()) {
            if (!plainObject(adapter)) {
                issues.push(`${pack.id || 'pack'} legacyAdapters[${index}] must be an object.`);
                continue;
            }
            if (!validStableId(adapter.legacyId)) issues.push(`${pack.id || 'pack'} legacyAdapters[${index}].legacyId is invalid.`);
            if (!validStableId(adapter.canonicalId)) issues.push(`${pack.id || 'pack'} legacyAdapters[${index}].canonicalId is invalid.`);
            if (!adapter.reason) issues.push(`${pack.id || 'pack'} legacyAdapters[${index}] requires a reason.`);
        }
    }

    if (!plainObject(pack.records)) {
        issues.push(`${pack.id || 'pack'} records must be an object.`);
        return issues;
    }

    for (const collection of CONTENT_PACK_COLLECTIONS) {
        const entries = pack.records[collection];
        if (!Array.isArray(entries)) {
            issues.push(`${pack.id || 'pack'} records.${collection} must be an array.`);
            continue;
        }
        const ids = new Set();
        for (const [index, record] of entries.entries()) {
            if (!plainObject(record)) {
                issues.push(`${pack.id || 'pack'} records.${collection}[${index}] must be an object.`);
                continue;
            }
            if (!validStableId(record.id)) {
                issues.push(`${pack.id || 'pack'} records.${collection}[${index}] has invalid id ${record.id}.`);
                continue;
            }
            if (ids.has(record.id)) issues.push(`${pack.id || 'pack'} duplicates ${collection} id ${record.id}.`);
            ids.add(record.id);
        }
    }

    return issues;
}

export function listContentPackRecords(pack) {
    if (!plainObject(pack?.records)) return [];
    return CONTENT_PACK_COLLECTIONS.flatMap((collection) =>
        (Array.isArray(pack.records[collection]) ? pack.records[collection] : [])
            .map((record) => ({ collection, record })),
    );
}

function normalizeStringArray(value) {
    if (!Array.isArray(value)) return [];
    return value.map((entry) => String(entry).trim()).filter(Boolean);
}

function normalizeLegacyAdapters(value) {
    if (!Array.isArray(value)) return [];
    return value.map((entry) => Object.freeze({
        legacyId: String(entry?.legacyId ?? '').trim(),
        canonicalId: String(entry?.canonicalId ?? '').trim(),
        reason: String(entry?.reason ?? '').trim(),
    }));
}

function cloneRecord(record) {
    if (!plainObject(record)) return record;
    return structuredCloneSafe(record);
}

function structuredCloneSafe(value) {
    if (Array.isArray(value)) return value.map((entry) => structuredCloneSafe(entry));
    if (plainObject(value)) {
        return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, structuredCloneSafe(entry)]));
    }
    return value;
}

function validStableId(value) {
    return typeof value === 'string' && /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(value);
}

function plainObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
