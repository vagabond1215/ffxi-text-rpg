export const RESOURCE_PROVENANCE_VERSION = 1;

export const PROVENANCE_SOURCE_TYPES = Object.freeze([
    'carriedInventory',
    'body',
    'flora',
    'mineral',
    'fishing',
    'salvage',
    'crafting',
    'commerce',
    'contract',
    'socialReward',
    'exceptionalMagic',
]);

export const RESOURCE_RECOVERY_ACTIONS = Object.freeze([
    'search',
    'skin',
    'butcher',
    'pluck',
    'extract',
    'salvage',
    'gather',
    'forage',
    'log',
    'mine',
    'fish',
    'trap',
    'process',
    'craft',
    'purchase',
    'barter',
    'earn',
    'receive',
    'conjure',
]);

export const ITEM_SINK_TYPES = Object.freeze([
    'consume',
    'equipment',
    'toolUse',
    'craftIngredient',
    'processInput',
    'construction',
    'repair',
    'trade',
    'contract',
    'quest',
    'salvage',
    'decorative',
    'collectible',
    'keyItem',
]);

export function normalizeProvenance(rawEntries = []) {
    const entries = normalizeArray(rawEntries);
    return entries.map((entry) => normalizeProvenanceEntry(entry));
}

export function normalizeItemSinks(rawEntries = []) {
    const entries = normalizeArray(rawEntries);
    return entries.map((entry) => normalizeSinkEntry(entry));
}

export function validateProvenance(entries, options = {}) {
    const issues = [];
    if (!Array.isArray(entries)) return ['provenance must be an array.'];
    if (options.requireSource && entries.length === 0) issues.push('provenance requires at least one intentional source.');

    for (const [index, entry] of entries.entries()) {
        const prefix = `provenance[${index}]`;
        if (!plainObject(entry)) {
            issues.push(`${prefix} must be an object.`);
            continue;
        }
        if (entry.version !== RESOURCE_PROVENANCE_VERSION) issues.push(`${prefix}.version must be ${RESOURCE_PROVENANCE_VERSION}.`);
        if (!PROVENANCE_SOURCE_TYPES.includes(entry.type)) issues.push(`${prefix}.type is unknown: ${entry.type}.`);
        if (entry.action !== null && entry.action !== undefined && !RESOURCE_RECOVERY_ACTIONS.includes(entry.action)) {
            issues.push(`${prefix}.action is unknown: ${entry.action}.`);
        }
        if (entry.sourceId !== null && entry.sourceId !== undefined && !validStableId(entry.sourceId)) {
            issues.push(`${prefix}.sourceId is invalid.`);
        }
        if (entry.placeId !== null && entry.placeId !== undefined && !validStableId(entry.placeId)) {
            issues.push(`${prefix}.placeId is invalid.`);
        }
        if (entry.type === 'exceptionalMagic' && entry.exceptional !== true) {
            issues.push(`${prefix}.exceptional must be true for exceptionalMagic sources.`);
        }
        if (!plainObject(entry.data)) issues.push(`${prefix}.data must be an object.`);
    }
    return issues;
}

export function validateItemSinks(entries, options = {}) {
    const issues = [];
    if (!Array.isArray(entries)) return ['sinks must be an array.'];
    if (options.requireSink && entries.length === 0) issues.push('sinks requires at least one intentional use or sink.');

    for (const [index, entry] of entries.entries()) {
        const prefix = `sinks[${index}]`;
        if (!plainObject(entry)) {
            issues.push(`${prefix} must be an object.`);
            continue;
        }
        if (!ITEM_SINK_TYPES.includes(entry.type)) issues.push(`${prefix}.type is unknown: ${entry.type}.`);
        if (entry.targetId !== null && entry.targetId !== undefined && !validStableId(entry.targetId)) {
            issues.push(`${prefix}.targetId is invalid.`);
        }
        if (!plainObject(entry.data)) issues.push(`${prefix}.data must be an object.`);
    }
    return issues;
}

export function validateItemResourceMetadata(item, options = {}) {
    if (!plainObject(item)) return ['item must be an object.'];
    return [
        ...validateProvenance(item.provenance ?? [], { requireSource: options.requireSource ?? false }),
        ...validateItemSinks(item.sinks ?? [], { requireSink: options.requireSink ?? false }),
    ];
}

export function hasIntentionalSource(item) {
    return Array.isArray(item?.provenance) && item.provenance.length > 0;
}

export function hasIntentionalSink(item) {
    return Array.isArray(item?.sinks) && item.sinks.length > 0;
}

function normalizeProvenanceEntry(rawEntry) {
    const entry = typeof rawEntry === 'string' ? { type: rawEntry } : (plainObject(rawEntry) ? rawEntry : {});
    const type = PROVENANCE_SOURCE_TYPES.includes(entry.type) ? entry.type : String(entry.type ?? '').trim();
    return {
        version: RESOURCE_PROVENANCE_VERSION,
        type,
        sourceId: normalizeNullableStableId(entry.sourceId ?? entry.id),
        placeId: normalizeNullableStableId(entry.placeId),
        action: entry.action === null || entry.action === undefined ? null : String(entry.action).trim(),
        exceptional: Boolean(entry.exceptional),
        notes: String(entry.notes ?? ''),
        data: plainObject(entry.data) ? { ...entry.data } : {},
    };
}

function normalizeSinkEntry(rawEntry) {
    const entry = typeof rawEntry === 'string' ? { type: rawEntry } : (plainObject(rawEntry) ? rawEntry : {});
    return {
        type: ITEM_SINK_TYPES.includes(entry.type) ? entry.type : String(entry.type ?? '').trim(),
        targetId: normalizeNullableStableId(entry.targetId ?? entry.id),
        notes: String(entry.notes ?? ''),
        data: plainObject(entry.data) ? { ...entry.data } : {},
    };
}

function normalizeArray(value) {
    if (value === null || value === undefined) return [];
    return Array.isArray(value) ? value : [value];
}

function normalizeNullableStableId(value) {
    if (value === null || value === undefined || value === '') return null;
    return String(value).trim().toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9.-]+/g, '-').replace(/^-+|-+$/g, '');
}

function validStableId(value) {
    return typeof value === 'string' && /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(value);
}

function plainObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
