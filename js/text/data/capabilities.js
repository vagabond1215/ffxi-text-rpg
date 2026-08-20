import { JOB_DEFINITIONS } from './jobs.js';
import { SKILL_KEYS } from './systemConstants.js';

export const CAPABILITY_CATALOG_VERSION = 4;
export const CAPABILITY_TYPES = Object.freeze(['spell', 'technique', 'practical', 'passive']);
export const CAPABILITY_CONTEXTS = Object.freeze(['combat', 'exploration', 'gathering', 'resourceRecovery', 'travel', 'project']);

const CAPABILITY_DEFINITIONS = Object.freeze({
    'spell-ember-dart': capability({
        id: 'spell-ember-dart',
        name: 'Ember Dart',
        type: 'spell',
        tags: ['magic', 'embercraft', 'offensive'],
        learning: { anyDiscipline: [{ disciplineId: 'elementalist', minLevel: 1 }, { disciplineId: 'spellblade', minLevel: 2 }] },
        use: { contexts: ['combat'], requiredSkills: [{ skillId: 'elementalMagic', min: 1 }] },
    }),
    'spell-mending-thread': capability({
        id: 'spell-mending-thread',
        name: 'Mending Thread',
        type: 'spell',
        tags: ['magic', 'vital-weave', 'restorative'],
        learning: { anyDiscipline: [{ disciplineId: 'lifewarden', minLevel: 1 }, { disciplineId: 'spellblade', minLevel: 3 }] },
        use: { contexts: ['combat', 'exploration'], requiredSkills: [{ skillId: 'healingMagic', min: 1 }] },
    }),
    'spell-stone-ward': capability({
        id: 'spell-stone-ward',
        name: 'Stone Ward',
        type: 'spell',
        tags: ['magic', 'ward-lore', 'defensive'],
        learning: { anyDiscipline: [{ disciplineId: 'oathguard', minLevel: 2 }, { disciplineId: 'lifewarden', minLevel: 2 }, { disciplineId: 'savant', minLevel: 2 }] },
        use: { contexts: ['combat', 'exploration'], requiredSkills: [{ skillId: 'enhancingMagic', min: 1 }] },
    }),
    'technique-guarded-cut': capability({
        id: 'technique-guarded-cut',
        name: 'Guarded Cut',
        type: 'technique',
        tags: ['martial', 'weapon-technique', 'defensive'],
        learning: { anyDiscipline: [{ disciplineId: 'spellblade', minLevel: 2 }, { disciplineId: 'vanguard', minLevel: 1 }] },
        use: { contexts: ['combat'], requiredSkills: [{ skillId: 'sword', min: 1 }], mainHandTags: ['sword'], resources: { tp: 250 } },
    }),
    'technique-shadow-feint': capability({
        id: 'technique-shadow-feint',
        name: 'Shadow Feint',
        type: 'technique',
        tags: ['martial', 'weapon-technique', 'mobility'],
        learning: { anyDiscipline: [{ disciplineId: 'shadowhand', minLevel: 1 }, { disciplineId: 'veilrunner', minLevel: 2 }] },
        use: { contexts: ['combat'], requiredSkills: [{ skillId: 'dagger', min: 1 }], mainHandTags: ['dagger'], resources: { tp: 200 } },
    }),
    'practical-field-dressing': capability({
        id: 'practical-field-dressing', name: 'Field Dressing', type: 'practical', tags: ['resource-recovery', 'anatomy', 'fieldcraft'],
        learning: { open: true }, use: { contexts: ['resourceRecovery'], requiredToolTags: ['cutting'] },
    }),
    'practical-ore-survey': capability({
        id: 'practical-ore-survey', name: 'Ore Survey', type: 'practical', tags: ['gathering', 'mining', 'fieldcraft'],
        learning: { open: true }, use: { contexts: ['gathering'], requiredToolTags: ['mining'] },
    }),
    'practical-waymark-reading': capability({
        id: 'practical-waymark-reading', name: 'Waymark Reading', type: 'practical', tags: ['fieldcraft', 'navigation', 'observation'],
        learning: { anyDiscipline: [{ disciplineId: 'wayfinder', minLevel: 1 }, { disciplineId: 'leykeeper', minLevel: 2 }] },
        use: { contexts: ['exploration'] },
    }),
    'technique-ridge-breaker': capability({
        id: 'technique-ridge-breaker', name: 'Ridge Breaker', type: 'technique',
        tags: ['martial', 'weapon-technique', 'axe', 'redstone'],
        learning: { anyDiscipline: [{ disciplineId: 'vanguard', minLevel: 3 }, { disciplineId: 'spellblade', minLevel: 4 }] },
        use: { contexts: ['combat'], requiredSkills: [{ skillId: 'axe', min: 2 }], mainHandTags: ['axe'], resources: { tp: 300 } },
    }),
    'technique-rivet-guard': capability({
        id: 'technique-rivet-guard', name: 'Rivet Guard', type: 'technique',
        tags: ['martial', 'weapon-technique', 'sword', 'defensive', 'redstone'],
        learning: { anyDiscipline: [{ disciplineId: 'vanguard', minLevel: 3 }, { disciplineId: 'oathguard', minLevel: 3 }, { disciplineId: 'spellblade', minLevel: 4 }] },
        use: { contexts: ['combat'], requiredSkills: [{ skillId: 'sword', min: 2 }], mainHandTags: ['sword'], resources: { tp: 250 } },
    }),
    'spell-forge-spark': capability({
        id: 'spell-forge-spark', name: 'Forge Spark', type: 'spell',
        tags: ['magic', 'embercraft', 'offensive', 'redstone'],
        learning: { anyDiscipline: [{ disciplineId: 'elementalist', minLevel: 2 }, { disciplineId: 'spellblade', minLevel: 3 }] },
        use: { contexts: ['combat'], requiredSkills: [{ skillId: 'elementalMagic', min: 2 }] },
    }),
    'spell-ironbound-ward': capability({
        id: 'spell-ironbound-ward', name: 'Ironbound Ward', type: 'spell',
        tags: ['magic', 'ward-lore', 'defensive', 'redstone'],
        learning: { anyDiscipline: [{ disciplineId: 'oathguard', minLevel: 3 }, { disciplineId: 'lifewarden', minLevel: 3 }, { disciplineId: 'savant', minLevel: 3 }] },
        use: { contexts: ['combat', 'exploration'], requiredSkills: [{ skillId: 'enhancingMagic', min: 2 }] },
    }),
    'technique-barkboar-brace': capability({
        id: 'technique-barkboar-brace', name: 'Barkboar Brace', type: 'technique',
        tags: ['martial', 'weapon-technique', 'axe', 'defensive', 'elderwood'],
        learning: { anyDiscipline: [{ disciplineId: 'vanguard', minLevel: 3 }, { disciplineId: 'wayfinder', minLevel: 3 }] },
        use: { contexts: ['combat'], requiredSkills: [{ skillId: 'axe', min: 2 }], mainHandTags: ['axe'], resources: { tp: 300 } },
    }),
    'technique-thicket-feint': capability({
        id: 'technique-thicket-feint', name: 'Thicket Feint', type: 'technique',
        tags: ['martial', 'weapon-technique', 'dagger', 'mobility', 'elderwood'],
        learning: { anyDiscipline: [{ disciplineId: 'shadowhand', minLevel: 2 }, { disciplineId: 'wayfinder', minLevel: 3 }] },
        use: { contexts: ['combat'], requiredSkills: [{ skillId: 'dagger', min: 2 }], mainHandTags: ['dagger'], resources: { tp: 225 } },
    }),
    'spell-barkskin-ward': capability({
        id: 'spell-barkskin-ward', name: 'Barkskin Ward', type: 'spell',
        tags: ['magic', 'ward-lore', 'defensive', 'elderwood'],
        learning: { anyDiscipline: [{ disciplineId: 'oathguard', minLevel: 3 }, { disciplineId: 'lifewarden', minLevel: 3 }, { disciplineId: 'savant', minLevel: 3 }] },
        use: { contexts: ['combat', 'exploration'], requiredSkills: [{ skillId: 'enhancingMagic', min: 2 }] },
    }),
    'practical-elderwood-trail-read': capability({
        id: 'practical-elderwood-trail-read', name: 'Elderwood Trail Read', type: 'practical',
        tags: ['fieldcraft', 'navigation', 'tracking', 'elderwood'],
        learning: { anyDiscipline: [{ disciplineId: 'wayfinder', minLevel: 2 }, { disciplineId: 'leykeeper', minLevel: 3 }] },
        use: { contexts: ['exploration'] },
    }),
});

export function getCapability(capabilityId) { return CAPABILITY_DEFINITIONS[String(capabilityId ?? '').trim()] ?? null; }
export function listCapabilities() { return Object.values(CAPABILITY_DEFINITIONS); }

export function validateCapabilityCatalog() {
    const issues = [];
    const ids = new Set();
    for (const definition of listCapabilities()) {
        if (!definition.id) issues.push('Capability id is required.');
        if (ids.has(definition.id)) issues.push(`Duplicate capability id ${definition.id}.`);
        ids.add(definition.id);
        if (!definition.name) issues.push(`${definition.id} is missing name.`);
        if (!CAPABILITY_TYPES.includes(definition.type)) issues.push(`${definition.id} has unknown type ${definition.type}.`);
        if (!Array.isArray(definition.tags)) issues.push(`${definition.id} tags must be an array.`);
        const learning = definition.learning ?? {};
        if (learning.open !== true && !(learning.anyDiscipline?.length)) issues.push(`${definition.id} requires an open or discipline learning path.`);
        for (const requirement of learning.anyDiscipline ?? []) {
            if (!JOB_DEFINITIONS[requirement.disciplineId]) issues.push(`${definition.id} learning references unknown discipline ${requirement.disciplineId}.`);
            if (!positiveInteger(requirement.minLevel)) issues.push(`${definition.id} has invalid learning level for ${requirement.disciplineId}.`);
        }
        const use = definition.use ?? {};
        for (const context of use.contexts ?? []) if (!CAPABILITY_CONTEXTS.includes(context)) issues.push(`${definition.id} references unknown context ${context}.`);
        for (const requirement of use.requiredSkills ?? []) {
            if (!SKILL_KEYS.includes(requirement.skillId)) issues.push(`${definition.id} use references unknown skill ${requirement.skillId}.`);
            if (!positiveInteger(requirement.min)) issues.push(`${definition.id} has invalid minimum for skill ${requirement.skillId}.`);
        }
        for (const field of ['mainHandTags', 'requiredToolTags', 'requiredPreparationTags', 'requiredFlags']) if (!Array.isArray(use[field])) issues.push(`${definition.id} use.${field} must be an array.`);
        for (const [resourceId, amount] of Object.entries(use.resources ?? {})) {
            if (!['hp', 'mp', 'tp'].includes(resourceId)) issues.push(`${definition.id} references unknown resource ${resourceId}.`);
            if (!nonNegativeInteger(amount)) issues.push(`${definition.id} has invalid ${resourceId} resource requirement.`);
        }
    }
    return issues;
}

function capability(definition) {
    return deepFreeze({
        id: String(definition.id), name: String(definition.name), type: definition.type, tags: [...(definition.tags ?? [])],
        learning: { open: definition.learning?.open === true, anyDiscipline: (definition.learning?.anyDiscipline ?? []).map((entry) => ({ disciplineId: String(entry.disciplineId), minLevel: Math.max(1, Math.floor(Number(entry.minLevel) || 1)) })) },
        use: {
            contexts: [...(definition.use?.contexts ?? [])],
            requiredSkills: (definition.use?.requiredSkills ?? []).map((entry) => ({ skillId: String(entry.skillId), min: Math.max(1, Math.floor(Number(entry.min) || 1)) })),
            mainHandTags: [...(definition.use?.mainHandTags ?? [])], requiredToolTags: [...(definition.use?.requiredToolTags ?? [])],
            requiredPreparationTags: [...(definition.use?.requiredPreparationTags ?? [])], requiredFlags: [...(definition.use?.requiredFlags ?? [])], resources: { ...(definition.use?.resources ?? {}) },
        },
    });
}
function positiveInteger(value) { return Number.isInteger(value) && value > 0; }
function nonNegativeInteger(value) { return Number.isInteger(value) && value >= 0; }
function deepFreeze(value) { if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value; for (const child of Object.values(value)) deepFreeze(child); return Object.freeze(value); }
