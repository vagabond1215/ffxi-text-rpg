import { getEffectiveSkill, getSkillCap, getSkillRank, SKILL_CAP_METADATA } from '../data/skillCaps.js';
import { SKILL_KEYS } from '../data/systemConstants.js';

export function createSkillState(overrides = {}) {
    const skills = {};
    for (const [skillId, value] of Object.entries(overrides ?? {})) {
        if (SKILL_KEYS.includes(skillId)) skills[skillId] = normalizeSkillValue(value);
    }
    return skills;
}

export function ensureSkillState(player) {
    player.progression ??= {};
    if (!isPlainObject(player.progression.skills)) player.progression.skills = {};
    for (const [skillId, value] of Object.entries(player.progression.skills)) {
        if (isPlainObject(value)) continue;
        player.progression.skills[skillId] = normalizeSkillValue(value);
    }
    return player.progression.skills;
}

export function getLearnedSkill(player, skillId) {
    if (!SKILL_KEYS.includes(skillId)) return 0;
    const skills = ensureSkillState(player);
    return normalizeSkillValue(skills[skillId]);
}

export function setLearnedSkill(player, skillId, value) {
    if (!SKILL_KEYS.includes(skillId)) return { ok: false, message: `Unknown skill: ${skillId}` };
    const skills = ensureSkillState(player);
    skills[skillId] = normalizeSkillValue(value);
    return { ok: true, skillId, learned: skills[skillId] };
}

export function addLearnedSkill(player, skillId, amount, options = {}) {
    if (!SKILL_KEYS.includes(skillId)) return { ok: false, message: `Unknown skill: ${skillId}` };
    const current = getLearnedSkill(player, skillId);
    const gained = Math.max(0, Math.floor(Number(amount) || 0));
    const next = current + gained;
    const cap = getSkillCap(player?.jobs?.mainJobId, skillId, player?.jobs?.level);
    const learned = options.clampToCurrentJobCap ?? true ? Math.min(next, cap) : next;
    setLearnedSkill(player, skillId, learned);
    return { ok: true, skillId, before: current, gained, learned, cap };
}

export function getEffectiveSkillForCurrentJob(player, skillId) {
    ensureSkillState(player);
    return getEffectiveSkill(player, skillId);
}

export function listEffectiveSkillsForCurrentJob(player) {
    ensureSkillState(player);
    const jobId = player?.jobs?.mainJobId;
    return SKILL_KEYS
        .map((skillId) => getEffectiveSkill(player, skillId))
        .filter((entry) => entry.cap > 0 || entry.learned > 0 || getSkillRank(jobId, entry.skillId));
}

export function describeSkillProgression(player, skillId = null) {
    ensureSkillState(player);
    if (skillId) {
        if (!SKILL_KEYS.includes(skillId)) return `Unknown skill: ${skillId}`;
        return describeSkillLine(getEffectiveSkill(player, skillId), player);
    }

    const entries = listEffectiveSkillsForCurrentJob(player);
    const lines = [
        `Skills for ${player.jobs?.mainJobName ?? player.jobs?.mainJobId ?? 'current job'} Lv.${player.jobs?.level ?? 1}:`,
        ...entries.map((entry) => `- ${describeSkillLine(entry, player)}`),
        `Confidence: ${SKILL_CAP_METADATA.confidence} (${SKILL_CAP_METADATA.source})`,
    ];
    return lines.join('\n');
}

function describeSkillLine(entry, player) {
    const jobLabel = `${player.jobs?.mainJobName ?? entry.jobId} cap`;
    const rank = entry.rank ?? 'none';
    const status = entry.overCurrentCap ? ' / over current cap' : entry.cappedForCurrentJob ? ' / capped for current job' : '';
    return `${entry.skillId}: learned ${entry.learned} / ${jobLabel} ${entry.cap} / effective ${entry.effective} / rank ${rank}${status}`;
}

function normalizeSkillValue(value) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : 0;
}

function isPlainObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
