import { JOB_DEFINITIONS } from '../data/jobs.js';
import { getEffectiveSkill, SKILL_CAP_METADATA } from '../data/skillCaps.js';
import { SKILL_KEYS } from '../data/systemConstants.js';

export function describeSkillProgression(player, skillId = null) {
    const requestedSkillId = skillId ? normalizeSkillId(skillId) : null;
    if (requestedSkillId && !SKILL_KEYS.includes(requestedSkillId)) {
        return `Unknown skill: ${skillId}`;
    }

    return requestedSkillId
        ? describeSingleSkill(player, requestedSkillId)
        : describeSkillSummary(player);
}

function describeSkillSummary(player) {
    const jobId = player?.jobs?.mainJobId ?? 'warrior';
    const jobName = JOB_DEFINITIONS[jobId]?.name ?? jobId;
    const level = Math.max(1, Math.min(99, Number(player?.jobs?.level) || 1));
    const rows = SKILL_KEYS
        .map((skillId) => getEffectiveSkill(player, skillId))
        .filter((skill) => skill.rank || skill.current > 0)
        .map((skill) => `- ${skill.skillId}: ${skill.current}/${skill.cap} (${skill.rank ? `rank ${skill.rank}` : 'unranked'})`);

    return [
        'Skills:',
        `Job: ${jobName} Lv.${level}`,
        ...(rows.length ? rows : ['- No ranked or trained skills for the current job.']),
        '',
        `Confidence: ${SKILL_CAP_METADATA.confidence}`,
        `Source: ${SKILL_CAP_METADATA.source}`,
    ].join('\n');
}

function describeSingleSkill(player, skillId) {
    const skill = getEffectiveSkill(player, skillId);
    const jobName = JOB_DEFINITIONS[skill.jobId]?.name ?? skill.jobId;

    return [
        `Skill: ${skill.skillId}`,
        `Job: ${jobName} Lv.${skill.level}`,
        `Rank: ${skill.rank ?? 'unranked'}`,
        `Current: ${skill.current}`,
        `Cap: ${skill.cap}`,
        `Capped: ${skill.capped ? 'yes' : 'no'}`,
        `Confidence: ${skill.confidence}`,
        `Source: ${skill.source}`,
    ].join('\n');
}

function normalizeSkillId(skillId) {
    const normalized = String(skillId ?? '').trim();
    return SKILL_KEYS.find((key) => key.toLowerCase() === normalized.toLowerCase()) ?? normalized;
}
