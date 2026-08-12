import { ATTRIBUTE_KEYS, createZeroBlock } from '../data/systemConstants.js';
import { getJob } from '../data/jobs.js';
import { getRace } from '../data/races.js';

export const CHARACTER_STAT_STATE_VERSION = 1;
export const CHARACTER_STAT_MODEL_ID = 'continuous-character-core-v1';
export const CHARACTER_STAT_CONFIDENCE = 'provisional';

const BASE_ATTRIBUTE_VALUE = 6;
const BASE_HP = 24;
const BASE_TP = 3000;
const MAGIC_SKILL_IDS = new Set([
    'healingMagic',
    'divineMagic',
    'enhancingMagic',
    'enfeeblingMagic',
    'elementalMagic',
    'darkMagic',
    'summoningMagic',
    'ninjutsu',
    'singing',
    'blueMagic',
    'geomancy',
]);

export function createCharacterStatState(player, options = {}) {
    const ancestry = getRace(options.ancestryId ?? player?.identity?.raceId);
    const growthRank = clampGrowthRank(options.growthRank ?? getHighestDisciplineLevel(player));
    const baseAttributes = calculateCharacterBaseAttributes(ancestry, growthRank);
    const baseResources = calculateCharacterBaseResources(ancestry, growthRank, baseAttributes);

    return {
        version: CHARACTER_STAT_STATE_VERSION,
        ancestryId: ancestry.id,
        growthRank,
        base: {
            attributes: baseAttributes,
            resources: baseResources,
        },
        provenance: {
            kind: 'originalDesign',
            modelId: CHARACTER_STAT_MODEL_ID,
            confidence: CHARACTER_STAT_CONFIDENCE,
            notes: [
                'Character-owned base stats follow the highest attained discipline training rank rather than the currently active discipline.',
                'Active discipline, equipment, status, and later capability/preparation systems apply contextual modifiers around this base.',
                'Values are an original provisional balance model and are intentionally replaceable without treating historical reference formulas as canon.',
            ],
        },
    };
}

export function ensureCharacterStatState(player) {
    if (!player || player.type !== 'player') return null;
    const existing = player.statState;
    if (!isCharacterStatState(existing)) {
        player.statState = createCharacterStatState(player);
        return player.statState;
    }
    return synchronizeCharacterStatState(player);
}

export function synchronizeCharacterStatState(player) {
    if (!player || player.type !== 'player') return null;
    if (!isCharacterStatState(player.statState)) {
        player.statState = createCharacterStatState(player);
        return player.statState;
    }

    const ancestry = getRace(player.identity?.raceId);
    const growthRank = Math.max(player.statState.growthRank, getHighestDisciplineLevel(player));
    const requiresRefresh = player.statState.ancestryId !== ancestry.id || player.statState.growthRank !== growthRank;
    if (!requiresRefresh) return player.statState;

    const next = createCharacterStatState(player, { ancestryId: ancestry.id, growthRank });
    player.statState = {
        ...next,
        provenance: {
            ...next.provenance,
            notes: [...next.provenance.notes, 'Base stats were deterministically refreshed after persistent character growth or ancestry migration.'],
        },
    };
    return player.statState;
}

export function getActiveDisciplineStatContext(player) {
    const discipline = getJob(player?.jobs?.mainJobId);
    const level = clampGrowthRank(player?.jobs?.level ?? 1);
    const attributes = createZeroBlock(ATTRIBUTE_KEYS);
    for (const key of discipline.primaryAttributes ?? []) {
        if (ATTRIBUTE_KEYS.includes(key)) attributes[key] += 2;
    }

    const hasMagicTraining = (discipline.skillFocus ?? []).some((skillId) => MAGIC_SKILL_IDS.has(skillId));
    const resources = {
        hp: discipline.primaryAttributes?.includes('vit') ? level * 2 : 0,
        mp: hasMagicTraining ? 10 + level * 4 : 0,
        tp: 0,
    };

    return {
        disciplineId: discipline.id,
        disciplineName: discipline.name,
        level,
        attributes,
        resources,
        derivedFocus: [...(discipline.derivedFocus ?? [])],
        skillFocus: [...(discipline.skillFocus ?? [])],
        provenance: {
            kind: 'trainingContext',
            modelId: 'active-discipline-context-v1',
            confidence: CHARACTER_STAT_CONFIDENCE,
            capabilityGate: false,
        },
    };
}

export function getCharacterStatMetadata(player) {
    const statState = ensureCharacterStatState(player);
    if (!statState) return null;
    return {
        ownership: 'continuousCharacter',
        baseModelId: statState.provenance.modelId,
        baseConfidence: statState.provenance.confidence,
        growthRank: statState.growthRank,
        ancestryId: statState.ancestryId,
        activeDiscipline: getActiveDisciplineStatContext(player),
        historicalReferenceRuntimeAuthority: false,
    };
}

export function calculateCharacterBaseAttributes(ancestryOrId, growthRank) {
    const ancestry = typeof ancestryOrId === 'string' ? getRace(ancestryOrId) : ancestryOrId;
    const rank = clampGrowthRank(growthRank);
    const result = createZeroBlock(ATTRIBUTE_KEYS);
    for (const key of ATTRIBUTE_KEYS) {
        result[key] = Math.max(1, BASE_ATTRIBUTE_VALUE + Math.floor(rank * 0.85) + (ancestry?.attributeBias?.[key] ?? 0));
    }
    return result;
}

export function calculateCharacterBaseResources(ancestryOrId, growthRank, attributes = null) {
    const ancestry = typeof ancestryOrId === 'string' ? getRace(ancestryOrId) : ancestryOrId;
    const rank = clampGrowthRank(growthRank);
    const attrs = attributes ?? calculateCharacterBaseAttributes(ancestry, rank);
    const hpBias = Number(ancestry?.resourceBias?.hp) || 0;
    const mpBias = Number(ancestry?.resourceBias?.mp) || 0;
    const latentFocus = Math.max(0, (attrs.int ?? 0) + (attrs.mnd ?? 0) - 12);

    return {
        maxHp: Math.max(1, BASE_HP + rank * 8 + (attrs.vit ?? 0) * 2 + hpBias * rank),
        maxMp: Math.max(0, (rank - 1) * 2 + latentFocus + mpBias * rank),
        maxTp: BASE_TP,
    };
}

export function getHighestDisciplineLevel(player) {
    const levels = Object.values(player?.jobs?.jobLevels ?? {}).map((value) => Number(value) || 0);
    levels.push(Number(player?.jobs?.level) || 1);
    return clampGrowthRank(Math.max(...levels));
}

export function validateCharacterStatState(statState) {
    const issues = [];
    if (!statState || typeof statState !== 'object' || Array.isArray(statState)) return ['statState must be an object.'];
    if (statState.version !== CHARACTER_STAT_STATE_VERSION) issues.push(`statState.version must be ${CHARACTER_STAT_STATE_VERSION}.`);
    if (getRace(statState.ancestryId).id !== statState.ancestryId) issues.push(`statState.ancestryId references unknown ancestry ${String(statState.ancestryId)}.`);
    if (!Number.isInteger(statState.growthRank) || statState.growthRank < 1 || statState.growthRank > 99) issues.push('statState.growthRank must be an integer from 1 to 99.');

    for (const key of ATTRIBUTE_KEYS) {
        const value = statState.base?.attributes?.[key];
        if (!Number.isInteger(value) || value < 1) issues.push(`statState.base.attributes.${key} must be a positive integer.`);
    }
    for (const key of ['maxHp', 'maxMp', 'maxTp']) {
        const value = statState.base?.resources?.[key];
        if (!Number.isInteger(value) || value < (key === 'maxHp' ? 1 : 0)) issues.push(`statState.base.resources.${key} has an invalid value.`);
    }
    if (statState.provenance?.modelId !== CHARACTER_STAT_MODEL_ID) issues.push(`statState.provenance.modelId must be ${CHARACTER_STAT_MODEL_ID}.`);
    if (statState.provenance?.confidence !== CHARACTER_STAT_CONFIDENCE) issues.push(`statState.provenance.confidence must be ${CHARACTER_STAT_CONFIDENCE}.`);
    return issues;
}

function isCharacterStatState(value) {
    return Boolean(value)
        && typeof value === 'object'
        && !Array.isArray(value)
        && value.version === CHARACTER_STAT_STATE_VERSION
        && value.base?.attributes
        && value.base?.resources;
}

function clampGrowthRank(value) {
    return Math.max(1, Math.min(99, Math.floor(Number(value) || 1)));
}
