import { getCapability } from './capabilities.js';

export const ABILITY_CATALOG_VERSION = 1;
export const ABILITY_KINDS = Object.freeze(['spell', 'technique', 'utility']);
export const ABILITY_CONTEXTS = Object.freeze(['combat', 'exploration']);
export const ABILITY_TARGET_KINDS = Object.freeze(['self', 'enemy', 'context']);
export const ABILITY_EFFECT_TYPES = Object.freeze(['damage', 'heal', 'status', 'context']);
export const ABILITY_RESOURCE_KEYS = Object.freeze(['hp', 'mp', 'tp']);
export const ABILITY_SCALING_STATS = Object.freeze(['str', 'dex', 'vit', 'agi', 'int', 'mnd', 'chr']);

const SPELL_SCHOOLS = Object.freeze({
    'school-embercraft': school({
        id: 'school-embercraft',
        name: 'Embercraft',
        tradition: 'A practical study of heat, ignition, and tightly contained elemental force.',
        tags: ['elemental', 'heat', 'projection'],
    }),
    'school-vital-weave': school({
        id: 'school-vital-weave',
        name: 'Vital Weave',
        tradition: 'A restorative tradition that steadies living patterns and encourages recovery.',
        tags: ['restoration', 'life', 'support'],
    }),
    'school-ward-lore': school({
        id: 'school-ward-lore',
        name: 'Ward Lore',
        tradition: 'A defensive practice of shaping temporary barriers, anchors, and protective patterns.',
        tags: ['warding', 'defense', 'support'],
    }),
});

const ABILITIES = Object.freeze({
    'ability-ember-dart': ability({
        id: 'ability-ember-dart',
        name: 'Ember Dart',
        kind: 'spell',
        schoolId: 'school-embercraft',
        capabilityId: 'spell-ember-dart',
        tags: ['magic', 'offensive', 'heat'],
        contexts: ['combat'],
        target: { kind: 'enemy' },
        activation: { durationSeconds: 6, interruptible: true },
        cooldownSeconds: 12,
        costs: { mp: 10 },
        effects: [
            { type: 'damage', recipient: 'target', stat: 'int', base: 8, coefficient: 1.4 },
        ],
    }),
    'ability-mending-thread': ability({
        id: 'ability-mending-thread',
        name: 'Mending Thread',
        kind: 'spell',
        schoolId: 'school-vital-weave',
        capabilityId: 'spell-mending-thread',
        tags: ['magic', 'restorative', 'support'],
        contexts: ['combat', 'exploration'],
        target: { kind: 'self' },
        activation: { durationSeconds: 5, interruptible: true },
        cooldownSeconds: 10,
        costs: { mp: 8 },
        effects: [
            { type: 'heal', recipient: 'self', stat: 'mnd', base: 8, coefficient: 1.5 },
        ],
    }),
    'ability-stone-ward': ability({
        id: 'ability-stone-ward',
        name: 'Stone Ward',
        kind: 'spell',
        schoolId: 'school-ward-lore',
        capabilityId: 'spell-stone-ward',
        tags: ['magic', 'warding', 'support'],
        contexts: ['combat', 'exploration'],
        target: { kind: 'self' },
        activation: { durationSeconds: 4, interruptible: true },
        cooldownSeconds: 20,
        costs: { mp: 6 },
        effects: [
            {
                type: 'status',
                recipient: 'self',
                status: {
                    id: 'status-stone-ward',
                    name: 'Stone Ward',
                    category: 'buff',
                    durationSeconds: 30,
                    stackGroup: 'ward-defense',
                    stackRule: 'replace',
                    modifiers: { defense: 4 },
                    flags: { magicalWard: true },
                },
            },
        ],
    }),
    'ability-guarded-cut': ability({
        id: 'ability-guarded-cut',
        name: 'Guarded Cut',
        kind: 'technique',
        capabilityId: 'technique-guarded-cut',
        tags: ['martial', 'weapon-technique', 'defensive'],
        contexts: ['combat'],
        target: { kind: 'enemy' },
        activation: { durationSeconds: 0, interruptible: false },
        cooldownSeconds: 8,
        costs: { tp: 250 },
        effects: [
            { type: 'damage', recipient: 'target', stat: 'str', base: 4, coefficient: 0.9 },
            {
                type: 'status',
                recipient: 'self',
                status: {
                    id: 'status-guarded-cut',
                    name: 'Guarded Cut',
                    category: 'buff',
                    durationSeconds: 12,
                    stackGroup: 'guarded-cut',
                    stackRule: 'replace',
                    modifiers: { defense: 2 },
                    flags: { guarded: true },
                },
            },
        ],
    }),
    'ability-waymark-reading': ability({
        id: 'ability-waymark-reading',
        name: 'Waymark Reading',
        kind: 'utility',
        capabilityId: 'practical-waymark-reading',
        tags: ['fieldcraft', 'navigation', 'observation'],
        contexts: ['exploration'],
        target: { kind: 'context' },
        activation: { durationSeconds: 3, interruptible: true },
        cooldownSeconds: 5,
        costs: {},
        effects: [
            { type: 'context', recipient: 'context', operation: 'survey-current-place' },
        ],
    }),
});

export function getSpellSchool(schoolId) {
    return SPELL_SCHOOLS[String(schoolId ?? '').trim()] ?? null;
}

export function listSpellSchools() {
    return Object.values(SPELL_SCHOOLS);
}

export function getAbility(abilityId) {
    return ABILITIES[String(abilityId ?? '').trim()] ?? null;
}

export function findAbility(query) {
    const normalized = normalize(query);
    if (!normalized) return null;
    return getAbility(normalized)
        ?? listAbilities().find((entry) => normalize(entry.name) === normalized)
        ?? listAbilities().find((entry) => normalize(entry.name).includes(normalized) || entry.id.includes(normalized))
        ?? null;
}

export function listAbilities() {
    return Object.values(ABILITIES);
}

export function validateAbilityCatalog() {
    const issues = [];
    const schoolIds = new Set();
    for (const entry of listSpellSchools()) {
        if (!stableId(entry.id, 'school-')) issues.push(`Spell school id is invalid: ${entry.id}.`);
        if (schoolIds.has(entry.id)) issues.push(`Duplicate spell school id ${entry.id}.`);
        schoolIds.add(entry.id);
        if (!entry.name) issues.push(`${entry.id} is missing name.`);
        if (!entry.tradition) issues.push(`${entry.id} is missing tradition.`);
        if (!Array.isArray(entry.tags)) issues.push(`${entry.id} tags must be an array.`);
    }

    const abilityIds = new Set();
    for (const entry of listAbilities()) {
        if (!stableId(entry.id, 'ability-')) issues.push(`Ability id is invalid: ${entry.id}.`);
        if (abilityIds.has(entry.id)) issues.push(`Duplicate ability id ${entry.id}.`);
        abilityIds.add(entry.id);
        if (!entry.name) issues.push(`${entry.id} is missing name.`);
        if (!ABILITY_KINDS.includes(entry.kind)) issues.push(`${entry.id} has unknown kind ${entry.kind}.`);
        if (entry.kind === 'spell' && !entry.schoolId) issues.push(`${entry.id} spell is missing schoolId.`);
        if (entry.schoolId && !getSpellSchool(entry.schoolId)) issues.push(`${entry.id} references unknown school ${entry.schoolId}.`);
        if (!getCapability(entry.capabilityId)) issues.push(`${entry.id} references unknown capability ${entry.capabilityId}.`);
        if (!Array.isArray(entry.tags)) issues.push(`${entry.id} tags must be an array.`);
        if (!Array.isArray(entry.contexts) || !entry.contexts.length) issues.push(`${entry.id} contexts must be a non-empty array.`);
        for (const context of entry.contexts ?? []) {
            if (!ABILITY_CONTEXTS.includes(context)) issues.push(`${entry.id} references unknown context ${context}.`);
        }
        if (!ABILITY_TARGET_KINDS.includes(entry.target?.kind)) issues.push(`${entry.id} has invalid target kind ${entry.target?.kind}.`);
        if (!nonNegativeInteger(entry.activation?.durationSeconds)) issues.push(`${entry.id} activation duration must be a non-negative integer.`);
        if (typeof entry.activation?.interruptible !== 'boolean') issues.push(`${entry.id} activation interruptible must be boolean.`);
        if (!nonNegativeInteger(entry.cooldownSeconds)) issues.push(`${entry.id} cooldownSeconds must be a non-negative integer.`);
        for (const [resourceId, amount] of Object.entries(entry.costs ?? {})) {
            if (!ABILITY_RESOURCE_KEYS.includes(resourceId)) issues.push(`${entry.id} references unknown cost resource ${resourceId}.`);
            if (!nonNegativeInteger(amount)) issues.push(`${entry.id} has invalid ${resourceId} cost.`);
        }
        if (!Array.isArray(entry.effects) || !entry.effects.length) issues.push(`${entry.id} effects must be a non-empty array.`);
        for (const [index, effect] of (entry.effects ?? []).entries()) {
            validateEffect(entry, effect, index, issues);
        }
    }
    return issues;
}

function validateEffect(abilityDefinition, effect, index, issues) {
    const prefix = `${abilityDefinition.id}.effects[${index}]`;
    if (!effect || typeof effect !== 'object' || Array.isArray(effect)) {
        issues.push(`${prefix} must be an object.`);
        return;
    }
    if (!ABILITY_EFFECT_TYPES.includes(effect.type)) issues.push(`${prefix} has unknown type ${effect.type}.`);
    if (!['self', 'target', 'context'].includes(effect.recipient)) issues.push(`${prefix} has invalid recipient ${effect.recipient}.`);
    if (effect.type === 'damage' || effect.type === 'heal') {
        if (!ABILITY_SCALING_STATS.includes(effect.stat)) issues.push(`${prefix} has invalid scaling stat ${effect.stat}.`);
        if (!nonNegativeNumber(effect.base)) issues.push(`${prefix} base must be non-negative.`);
        if (!nonNegativeNumber(effect.coefficient)) issues.push(`${prefix} coefficient must be non-negative.`);
    }
    if (effect.type === 'status') {
        const status = effect.status;
        if (!status || typeof status !== 'object' || Array.isArray(status)) issues.push(`${prefix}.status must be an object.`);
        else {
            if (!stableId(status.id, 'status-')) issues.push(`${prefix}.status.id is invalid.`);
            if (!positiveInteger(status.durationSeconds)) issues.push(`${prefix}.status.durationSeconds must be positive.`);
            if (!status.stackGroup) issues.push(`${prefix}.status.stackGroup is required.`);
            if (!['replace', 'ignore', 'stack'].includes(status.stackRule)) issues.push(`${prefix}.status.stackRule is invalid.`);
        }
    }
    if (effect.type === 'context' && !effect.operation) issues.push(`${prefix}.operation is required.`);
}

function school(definition) {
    return deepFreeze({
        id: String(definition.id),
        name: String(definition.name),
        tradition: String(definition.tradition),
        tags: [...(definition.tags ?? [])],
    });
}

function ability(definition) {
    return deepFreeze({
        id: String(definition.id),
        name: String(definition.name),
        kind: definition.kind,
        schoolId: definition.schoolId ? String(definition.schoolId) : null,
        capabilityId: String(definition.capabilityId),
        tags: [...(definition.tags ?? [])],
        contexts: [...(definition.contexts ?? [])],
        target: { ...(definition.target ?? {}) },
        activation: {
            durationSeconds: Math.max(0, Math.floor(Number(definition.activation?.durationSeconds) || 0)),
            interruptible: definition.activation?.interruptible === true,
        },
        cooldownSeconds: Math.max(0, Math.floor(Number(definition.cooldownSeconds) || 0)),
        costs: { ...(definition.costs ?? {}) },
        effects: (definition.effects ?? []).map((effect) => ({
            ...effect,
            status: effect.status ? {
                ...effect.status,
                modifiers: { ...(effect.status.modifiers ?? {}) },
                flags: { ...(effect.status.flags ?? {}) },
            } : undefined,
        })),
    });
}

function normalize(value) {
    return String(value ?? '').trim().toLowerCase().replace(/\s+/g, '-');
}
function stableId(value, prefix) { return typeof value === 'string' && value.startsWith(prefix) && /^[a-z][a-z0-9-]*$/.test(value); }
function positiveInteger(value) { return Number.isInteger(value) && value > 0; }
function nonNegativeInteger(value) { return Number.isInteger(value) && value >= 0; }
function nonNegativeNumber(value) { return Number.isFinite(value) && value >= 0; }
function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
}
