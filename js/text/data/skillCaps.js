import { JOB_DEFINITIONS } from './jobs.js';
import { canonicalizeDisciplineId } from './legacyIdentity.js';
import { CONFIDENCE_LABELS } from './itemSchema.js';
import { SKILL_KEYS } from './systemConstants.js';

export const SKILL_CAP_METADATA = Object.freeze({
    confidence: CONFIDENCE_LABELS.PLACEHOLDER,
    source: 'Skill-cap foundation pass; rank math is a stable scaffold for early progression testing.',
    notes: 'Replace with the game’s own researched and balance-tested proficiency curves before final combat or training pacing.',
});

export const SKILL_RANK_CAP_RULES = deepFreeze({
    A: { rank: 'A', perLevel: 3.0 },
    B: { rank: 'B', perLevel: 2.8 },
    C: { rank: 'C', perLevel: 2.5 },
    D: { rank: 'D', perLevel: 2.2 },
    E: { rank: 'E', perLevel: 1.8 },
});

export const JOB_SKILL_RANKS = deepFreeze({
    vanguard: { sword: 'B', axe: 'A', greatAxe: 'A', dagger: 'C', shield: 'C', parrying: 'C', evasion: 'C' },
    pugilist: { handToHand: 'A', guard: 'B', staff: 'C', evasion: 'B' },
    lifewarden: { club: 'B', staff: 'C', healingMagic: 'A', divineMagic: 'B', enhancingMagic: 'C', enfeeblingMagic: 'D' },
    elementalist: { staff: 'C', club: 'D', elementalMagic: 'A', darkMagic: 'B', enfeeblingMagic: 'C' },
    spellblade: { sword: 'B', dagger: 'C', club: 'D', enhancingMagic: 'B', enfeeblingMagic: 'A', elementalMagic: 'C', healingMagic: 'C' },
    shadowhand: { dagger: 'A', sword: 'C', throwing: 'C', evasion: 'A', parrying: 'D' },
});

export function getSkillRank(jobId, skillId) {
    const canonicalJobId = canonicalizeDisciplineId(jobId);
    if (!JOB_DEFINITIONS[canonicalJobId] || !SKILL_KEYS.includes(skillId)) return null;
    return JOB_SKILL_RANKS[canonicalJobId]?.[skillId] ?? null;
}

export function getSkillCap(jobId, skillId, level = 1) {
    const rank = getSkillRank(jobId, skillId);
    if (!rank) return 0;
    const rule = SKILL_RANK_CAP_RULES[rank];
    if (!rule) return 0;
    const safeLevel = Math.max(1, Math.min(99, Number(level) || 1));
    return Math.floor(safeLevel * rule.perLevel);
}

export function getEffectiveSkill(player, skillId) {
    const jobId = canonicalizeDisciplineId(player?.jobs?.mainJobId ?? 'vanguard');
    const level = Math.max(1, Math.min(99, Number(player?.jobs?.level) || 1));
    const rank = getSkillRank(jobId, skillId);
    const cap = getSkillCap(jobId, skillId, level);
    const learned = normalizeLearnedSkill(player?.progression?.skills?.[skillId]);
    const effective = Math.min(learned, cap);
    const cappedForCurrentJob = cap > 0 && effective >= cap;

    return {
        skillId,
        jobId,
        level,
        rank,
        learned,
        cap,
        effective,
        current: effective,
        cappedForCurrentJob,
        capped: cappedForCurrentJob,
        overCurrentCap: learned > cap,
        confidence: SKILL_CAP_METADATA.confidence,
        source: SKILL_CAP_METADATA.source,
    };
}

export function listSkillRankEntries() {
    return Object.entries(JOB_SKILL_RANKS).flatMap(([jobId, skills]) => (
        Object.entries(skills).map(([skillId, rank]) => ({ jobId, skillId, rank }))
    ));
}

function normalizeLearnedSkill(value) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : 0;
}

function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
}
