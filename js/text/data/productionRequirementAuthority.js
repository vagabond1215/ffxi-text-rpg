import { listEquipmentCatalogEntries } from './equipmentCatalog.js';

export const PRODUCTION_REQUIREMENT_AUTHORITY_VERSION = 1;

export const WORKSTATION_TAGS = Object.freeze([
    'forge',
    'kitchen',
    'woodshop',
    'tannery',
    'workshop',
]);

export const CONTEXTUAL_PRODUCTION_TOOL_TAGS = Object.freeze([]);

const GENERIC_TOOL_TAGS = new Set(['equipment', 'tool', 'field']);

export function listCanonicalPortableToolTagProviders() {
    const providers = new Map();

    for (const entry of listEquipmentCatalogEntries()) {
        const tags = new Set(entry?.tags ?? []);
        const portableTool = entry?.family === 'tool' || tags.has('tool');
        if (!portableTool || entry?.kind !== 'equipment') continue;

        for (const tag of tags) {
            const normalized = String(tag ?? '').trim();
            if (!normalized || GENERIC_TOOL_TAGS.has(normalized)) continue;
            if (!providers.has(normalized)) providers.set(normalized, []);
            providers.get(normalized).push(entry.id);
        }
    }

    return Object.freeze(Object.fromEntries(
        [...providers.entries()]
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([tag, itemIds]) => [tag, Object.freeze([...new Set(itemIds)].sort())]),
    ));
}

export function listAuthorizedProductionToolTags() {
    return Object.freeze([
        ...new Set([
            ...Object.keys(listCanonicalPortableToolTagProviders()),
            ...CONTEXTUAL_PRODUCTION_TOOL_TAGS,
        ]),
    ].sort());
}

export function validateProductionRequirementAuthority(definitions) {
    const issues = [];
    const stationTags = new Set(WORKSTATION_TAGS);
    const portableProviders = listCanonicalPortableToolTagProviders();
    const contextualTags = new Set(CONTEXTUAL_PRODUCTION_TOOL_TAGS);

    for (const definition of definitions ?? []) {
        for (const tag of definition?.requiredStationTags ?? []) {
            if (!stationTags.has(tag)) {
                issues.push(`${definition.id} requires unknown workstation tag ${tag}.`);
            }
        }

        for (const tag of definition?.requiredToolTags ?? []) {
            if (!portableProviders[tag] && !contextualTags.has(tag)) {
                issues.push(`${definition.id} requires tool capability ${tag} with no canonical portable-tool provider or declared contextual authority.`);
            }
        }
    }

    return issues;
}
