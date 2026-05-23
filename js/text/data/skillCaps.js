import { JOB_DEFINITIONS } from './jobs.js';
import { CONFIDENCE_LABELS } from './itemSchema.js';
import { SKILL_KEYS } from './systemConstants.js';

export const SKILL_CAP_METADATA = Object.freeze({
    confidence: CONFIDENCE_LABELS.PLACEHOLDER,
    source: 'Skill-cap foundation pass; rank math is a stable scaffold, not a retail cap table.',
    notes: 'Replace with sourced rank cap tables before using this for exact combat or skill-up pacing.',
});

export const SKILL_RANK_CAP_RULES = deepFreeze({
    A: { rank: 'A', perLevel: 3.0 },
    B: { rank: 'B', perLevel: 2.8 },
    C: { rank: 'C', perLevel: 2.5 },
    D: { rank: 'D', perLevel: 2.2 },
    E: { rank: 'E', perLevel: 1.8 },
});

export const JOB_SKILL_RANKS = deepFreeze({
    warrior: { sword: 'B', axe: 'A', greatAxe: 'A', dagger: 'C', shield: 'C', parrying: 'C', evasion: 'C' },
    monk: { handToHand: 'A', guard: 'B', staff: 'C', evasion: 'B' },
    whiteMage: { club: 'B', staff: 'C', healingMagic: 'A', divineMagic: 'B', enhancingMagic: 'C', enfeeblingMagic: 'D' },
    blackMage: { staff: 'C', club: 'D', elementalMagic: 'A', darkMagic: 'B', enfeeblingMagic: 'C' },
    redMage: { sword: 'B', dagger: 'C', club: 'D', enhancingMagic: 'B', enfeeblingMagic: 'A', elementalMagic: 'C', healingMagic: 'C' },
    thief: { dagger: 'A', sword: 'C', throwing: 'C', evasion: 'A', parrying: 'D' },
});

export function getSkillRank(jobId, skillId) {
    if (!JOB_DEFINITIONS[jobId] || !SKILL_KEYS.includes(skillId)) return null;
    return JOB_SKILL_RANKS[jobId]?.[skillId] ?? null;
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
    const jobId = player?.jobs?.mainJobId ?? 'warrior';
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
