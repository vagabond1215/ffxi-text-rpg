import { enrichEquipmentItem } from '../data/equipmentCatalog.js';
import { getCapability, listCapabilities } from '../data/capabilities.js';
import { getLearnedSkill } from './skillProgressionEngine.js';

export const CAPABILITY_STATE_VERSION = 1;

export function createCapabilityState() {
    return {
        version: CAPABILITY_STATE_VERSION,
        known: {},
    };
}

export function ensureCapabilityState(player) {
    if (!player || player.type !== 'player') return null;
    player.progression ??= {};
    const existing = player.progression.capabilities;
    if (!existing || typeof existing !== 'object' || Array.isArray(existing) || existing.version !== CAPABILITY_STATE_VERSION) {
        player.progression.capabilities = createCapabilityState();
        return player.progression.capabilities;
    }
    if (!existing.known || typeof existing.known !== 'object' || Array.isArray(existing.known)) existing.known = {};
    return existing;
}

export function learnCapability(player, capabilityId, options = {}) {
    const definition = getCapability(capabilityId);
    if (!definition) return failure('unknown-capability', `Unknown capability: ${capabilityId}`);
    const state = ensureCapabilityState(player);
    if (!state) return failure('no-player', 'No player found.');
    if (state.known[definition.id]) {
        return { ok: true, unchanged: true, capabilityId: definition.id, record: state.known[definition.id] };
    }

    const learning = evaluateLearningRequirements(player, definition);
    if (!learning.ok) return learning;

    const record = {
        capabilityId: definition.id,
        source: options.source ?? 'training',
        learnedAtWorldSeconds: normalizeWorldSeconds(options.worldSeconds),
        learnedFromDisciplineId: learning.disciplineId ?? null,
    };
    state.known[definition.id] = record;
    return { ok: true, capabilityId: definition.id, record };
}

export function grantCapability(player, capabilityId, options = {}) {
    const definition = getCapability(capabilityId);
    if (!definition) return failure('unknown-capability', `Unknown capability: ${capabilityId}`);
    const state = ensureCapabilityState(player);
    if (!state) return failure('no-player', 'No player found.');
    if (state.known[definition.id]) {
        return { ok: true, unchanged: true, capabilityId: definition.id, record: state.known[definition.id] };
    }

    const record = {
        capabilityId: definition.id,
        source: options.source ?? 'grant',
        learnedAtWorldSeconds: normalizeWorldSeconds(options.worldSeconds),
        learnedFromDisciplineId: null,
    };
    state.known[definition.id] = record;
    return { ok: true, capabilityId: definition.id, record };
}

export function knowsCapability(player, capabilityId) {
    const state = ensureCapabilityState(player);
    return Boolean(state?.known?.[String(capabilityId ?? '').trim()]);
}

export function listKnownCapabilities(player) {
    const state = ensureCapabilityState(player);
    if (!state) return [];
    return Object.keys(state.known)
        .map((capabilityId) => getCapability(capabilityId))
        .filter(Boolean);
}

export function canUseCapability(player, capabilityId, context = {}) {
    const definition = getCapability(capabilityId);
    if (!definition) return failure('unknown-capability', `Unknown capability: ${capabilityId}`);
    if (!player || player.type !== 'player') return failure('no-player', 'No player found.');
    if (!knowsCapability(player, definition.id)) {
        return failure('not-learned', `${definition.name} has not been learned.`, { capabilityId: definition.id });
    }

    const use = definition.use;
    if (use.contexts.length && !use.contexts.includes(context.type)) {
        return failure('invalid-context', `${definition.name} cannot be used in context ${String(context.type ?? 'none')}.`, {
            capabilityId: definition.id,
            allowedContexts: [...use.contexts],
        });
    }

    for (const requirement of use.requiredSkills) {
        const learned = getLearnedSkill(player, requirement.skillId);
        if (learned < requirement.min) {
            return failure('insufficient-skill', `${definition.name} requires ${requirement.skillId} ${requirement.min}; learned ${learned}.`, {
                capabilityId: definition.id,
                skillId: requirement.skillId,
                required: requirement.min,
                learned,
            });
        }
    }

    if (use.mainHandTags.length) {
        const mainHandTags = new Set(getItemTags(player.equipment?.mainHand));
        if (!use.mainHandTags.some((tag) => mainHandTags.has(tag))) {
            return failure('equipment-requirement', `${definition.name} requires a compatible main-hand item (${use.mainHandTags.join(' or ')}).`, {
                capabilityId: definition.id,
                requiredTags: [...use.mainHandTags],
            });
        }
    }

    const availableToolTags = new Set([
        ...normalizeTagList(context.toolTags),
        ...collectEquippedTags(player),
    ]);
    for (const tag of use.requiredToolTags) {
        if (!availableToolTags.has(tag)) {
            return failure('tool-requirement', `${definition.name} requires tool capability ${tag}.`, {
                capabilityId: definition.id,
                requiredToolTag: tag,
            });
        }
    }

    const preparationTags = new Set(normalizeTagList(context.preparationTags));
    for (const tag of use.requiredPreparationTags) {
        if (!preparationTags.has(tag)) {
            return failure('preparation-requirement', `${definition.name} requires preparation ${tag}.`, {
                capabilityId: definition.id,
                requiredPreparationTag: tag,
            });
        }
    }

    for (const flag of use.requiredFlags) {
        if (!player.flags?.[flag] && !context.flags?.[flag]) {
            return failure('flag-requirement', `${definition.name} requires condition ${flag}.`, {
                capabilityId: definition.id,
                requiredFlag: flag,
            });
        }
    }

    for (const [resourceId, amount] of Object.entries(use.resources)) {
        const available = Math.max(0, Number(context.resources?.[resourceId] ?? player.resources?.[resourceId]) || 0);
        if (available < amount) {
            return failure('resource-requirement', `${definition.name} requires ${amount} ${resourceId.toUpperCase()}; available ${available}.`, {
                capabilityId: definition.id,
                resourceId,
                required: amount,
                available,
            });
        }
    }

    return {
        ok: true,
        capabilityId: definition.id,
        capability: definition,
        activeDisciplineId: player.jobs?.mainJobId ?? null,
        disciplineUseGate: false,
    };
}

export function evaluateLearningRequirements(player, capabilityOrId) {
    const definition = typeof capabilityOrId === 'string' ? getCapability(capabilityOrId) : capabilityOrId;
    if (!definition) return failure('unknown-capability', `Unknown capability: ${String(capabilityOrId)}`);
    if (!player || player.type !== 'player') return failure('no-player', 'No player found.');
    if (definition.learning.open) return { ok: true, capabilityId: definition.id, disciplineId: null };

    for (const requirement of definition.learning.anyDiscipline) {
        const level = getDisciplineTrainingLevel(player, requirement.disciplineId);
        if (level >= requirement.minLevel) {
            return {
                ok: true,
                capabilityId: definition.id,
                disciplineId: requirement.disciplineId,
                disciplineLevel: level,
            };
        }
    }

    return failure('training-requirement', `${definition.name} has not met a learning path.`, {
        capabilityId: definition.id,
        requirements: definition.learning.anyDiscipline.map((entry) => ({ ...entry })),
    });
}

export function getDisciplineTrainingLevel(player, disciplineId) {
    const recordLevel = Number(player?.progression?.jobProgression?.[disciplineId]?.level) || 0;
    const legacyLevel = Number(player?.jobs?.jobLevels?.[disciplineId]) || 0;
    const activeLevel = player?.jobs?.mainJobId === disciplineId ? Number(player?.jobs?.level) || 0 : 0;
    return Math.max(recordLevel, legacyLevel, activeLevel);
}

export function validateCapabilityState(player) {
    const issues = [];
    const state = player?.progression?.capabilities;
    if (!state || typeof state !== 'object' || Array.isArray(state)) return ['progression.capabilities must be an object.'];
    if (state.version !== CAPABILITY_STATE_VERSION) issues.push(`progression.capabilities.version must be ${CAPABILITY_STATE_VERSION}.`);
    if (!state.known || typeof state.known !== 'object' || Array.isArray(state.known)) return [...issues, 'progression.capabilities.known must be an object.'];

    for (const [capabilityId, record] of Object.entries(state.known)) {
        if (!getCapability(capabilityId)) issues.push(`progression.capabilities.known references unknown capability ${capabilityId}.`);
        if (!record || typeof record !== 'object' || Array.isArray(record)) {
            issues.push(`progression.capabilities.known.${capabilityId} must be an object.`);
            continue;
        }
        if (record.capabilityId !== capabilityId) issues.push(`progression.capabilities.known.${capabilityId}.capabilityId must match its key.`);
        if (!['training', 'grant', 'quest', 'social', 'origin', 'instruction'].includes(record.source)) {
            issues.push(`progression.capabilities.known.${capabilityId}.source is unknown: ${String(record.source)}.`);
        }
        if (record.learnedAtWorldSeconds !== null && (!Number.isInteger(record.learnedAtWorldSeconds) || record.learnedAtWorldSeconds < 0)) {
            issues.push(`progression.capabilities.known.${capabilityId}.learnedAtWorldSeconds must be null or a non-negative integer.`);
        }
    }
    return issues;
}

export function describeCapabilityState(player) {
    const known = listKnownCapabilities(player);
    if (!known.length) return 'Known capabilities: none.';
    return ['Known capabilities:', ...known.map((entry) => `- ${entry.name} [${entry.type}]`)].join('\n');
}

export function listCapabilityLearningOptions(player) {
    return listCapabilities().map((definition) => ({
        capability: definition,
        known: knowsCapability(player, definition.id),
        learning: evaluateLearningRequirements(player, definition),
    }));
}

function collectEquippedTags(player) {
    const tags = [];
    for (const item of Object.values(player?.equipment ?? {})) tags.push(...getItemTags(item));
    return tags;
}

function getItemTags(item) {
    if (!item) return [];
    const normalized = enrichEquipmentItem(item);
    return normalizeTagList([
        ...(normalized.tags ?? []),
        normalized.weaponCategory,
        normalized.family,
        normalized.archetype,
        normalized.subtype,
    ]);
}

function normalizeTagList(values) {
    return [...new Set((values ?? []).map((value) => String(value ?? '').trim()).filter(Boolean))];
}

function normalizeWorldSeconds(value) {
    if (value === null || value === undefined) return null;
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : null;
}

function failure(code, reason, data = {}) {
    return { ok: false, code, reason, ...data };
}
