import { createSeedNpcs } from './seedEntities.js';

export const SOCIAL_REQUIREMENT_SCHEMA_VERSION = 1;
export const SOCIAL_RELATIONSHIP_DIMENSIONS = Object.freeze([
    'familiarity',
    'respect',
    'trust',
    'obligation',
]);

export function normalizeRelationshipRequirements(requirements = []) {
    return Object.freeze((requirements ?? []).map((requirement) => Object.freeze({
        npcId: String(requirement?.npcId ?? '').trim(),
        minimums: Object.freeze(Object.fromEntries(
            Object.entries(requirement?.minimums ?? {})
                .filter(([dimension, value]) => SOCIAL_RELATIONSHIP_DIMENSIONS.includes(dimension) && Number.isInteger(value))
                .map(([dimension, value]) => [dimension, value]),
        )),
    })));
}

export function validateRelationshipRequirements(requirements, options = {}) {
    const label = String(options.label ?? 'relationshipRequirements');
    const issues = [];
    if (!Array.isArray(requirements)) return [`${label} must be an array.`];

    const knownNpcIds = new Set(createSeedNpcs().map((npc) => npc.id));
    for (const [index, requirement] of requirements.entries()) {
        const entryLabel = `${label}[${index}]`;
        if (!requirement || typeof requirement !== 'object' || Array.isArray(requirement)) {
            issues.push(`${entryLabel} must be an object.`);
            continue;
        }
        if (!stableNpcId(requirement.npcId)) issues.push(`${entryLabel}.npcId must be a stable NPC id.`);
        else if (!knownNpcIds.has(requirement.npcId)) issues.push(`${entryLabel}.npcId references unknown NPC ${requirement.npcId}.`);

        if (!requirement.minimums || typeof requirement.minimums !== 'object' || Array.isArray(requirement.minimums)) {
            issues.push(`${entryLabel}.minimums must be an object.`);
            continue;
        }
        const entries = Object.entries(requirement.minimums);
        if (!entries.length) issues.push(`${entryLabel}.minimums must require at least one relationship dimension.`);
        for (const [dimension, minimum] of entries) {
            if (!SOCIAL_RELATIONSHIP_DIMENSIONS.includes(dimension)) issues.push(`${entryLabel}.minimums uses unknown relationship dimension ${dimension}.`);
            if (!Number.isInteger(minimum)) issues.push(`${entryLabel}.minimums.${dimension} must be an integer.`);
        }
    }
    return issues;
}

function stableNpcId(value) {
    return typeof value === 'string' && /^npc-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}
