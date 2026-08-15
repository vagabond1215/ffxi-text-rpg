export const COMPANION_CATALOG_VERSION = 1;

const COMPANIONS = Object.freeze({
    'companion-mara-venn': companion({
        id: 'companion-mara-venn',
        npcId: 'npc-elderwood-waywarden',
        name: 'Mara Venn',
        title: 'Waywarden',
        homePlaceId: 'timbercross-landing',
        recruitment: {
            placeIds: ['timbercross-landing'],
            requiredFlags: [],
        },
        level: 4,
        baseAttributes: { str: 1, dex: 2, vit: 1, agi: 2, mnd: 1 },
        skills: { sword: 10, dagger: 8, evasion: 10, parrying: 7 },
        tactics: { role: 'skirmisher', policy: 'basic-attack-v1' },
        relationshipDimensions: ['trust', 'respect', 'familiarity'],
    }),
});

export function getCompanionDefinition(companionId) {
    return COMPANIONS[String(companionId ?? '').trim()] ?? null;
}

export function findCompanionDefinition(query) {
    const normalized = normalize(query);
    if (!normalized) return null;
    return Object.values(COMPANIONS).find((entry) => normalize(entry.id) === normalized || normalize(entry.name).includes(normalized)) ?? null;
}

export function listCompanionDefinitions() {
    return Object.values(COMPANIONS);
}

export function validateCompanionCatalog() {
    const issues = [];
    const ids = new Set();
    const npcIds = new Set();
    for (const entry of listCompanionDefinitions()) {
        if (!stableId(entry.id)) issues.push(`Invalid companion id ${entry.id}.`);
        if (ids.has(entry.id)) issues.push(`Duplicate companion id ${entry.id}.`);
        ids.add(entry.id);
        if (!stableId(entry.npcId)) issues.push(`${entry.id}.npcId is invalid.`);
        if (npcIds.has(entry.npcId)) issues.push(`NPC ${entry.npcId} backs more than one companion definition.`);
        npcIds.add(entry.npcId);
        if (!entry.name) issues.push(`${entry.id}.name is required.`);
        if (!stableId(entry.homePlaceId)) issues.push(`${entry.id}.homePlaceId is invalid.`);
        if (!Number.isInteger(entry.level) || entry.level < 1) issues.push(`${entry.id}.level must be positive.`);
        if (!Array.isArray(entry.recruitment.placeIds) || !entry.recruitment.placeIds.length) issues.push(`${entry.id} requires recruitment places.`);
        if (!Array.isArray(entry.recruitment.requiredFlags)) issues.push(`${entry.id}.recruitment.requiredFlags must be an array.`);
        if (!Array.isArray(entry.relationshipDimensions) || !entry.relationshipDimensions.length) issues.push(`${entry.id} requires relationship dimensions.`);
        if (!entry.tactics?.policy) issues.push(`${entry.id} requires a tactics policy.`);
    }
    return issues;
}

function companion(definition) {
    return deepFreeze({
        version: COMPANION_CATALOG_VERSION,
        id: definition.id,
        npcId: definition.npcId,
        name: definition.name,
        title: definition.title ?? '',
        homePlaceId: definition.homePlaceId,
        recruitment: {
            placeIds: [...(definition.recruitment?.placeIds ?? [])],
            requiredFlags: [...(definition.recruitment?.requiredFlags ?? [])],
        },
        level: definition.level,
        baseAttributes: { ...(definition.baseAttributes ?? {}) },
        skills: { ...(definition.skills ?? {}) },
        tactics: { ...(definition.tactics ?? {}) },
        relationshipDimensions: [...(definition.relationshipDimensions ?? [])],
    });
}

function normalize(value) { return String(value ?? '').trim().toLowerCase(); }
function stableId(value) { return typeof value === 'string' && /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(value); }
function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
}
