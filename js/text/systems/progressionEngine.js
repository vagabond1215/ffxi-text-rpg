import { getExpToNextLevel } from '../data/expTables.js';
import { getJob } from '../data/jobs.js';
import { calculateCombatProfile } from './statEngine.js';

export function awardExperience(player, amount, options = {}) {
    if (!player) return { ok: false, message: 'No player found.' };
    const gained = Math.max(0, Math.floor(Number(amount) || 0));
    ensureProgressionState(player);

    const activeJobId = player.jobs.mainJobId;
    const jobRecord = getJobProgressionRecord(player, activeJobId);
    const before = snapshotProgression(player, jobRecord);
    jobRecord.exp += gained;

    const levelUps = [];
    const levelCap = getLevelCap(player, options.levelCap);
    while (jobRecord.level < levelCap) {
        const needed = getExpToNextLevel(jobRecord.level, levelCap);
        if (!needed || jobRecord.exp < needed) break;
        jobRecord.exp -= needed;
        jobRecord.level += 1;
        levelUps.push(jobRecord.level);
    }

    applyJobRecordToActiveJob(player, activeJobId, jobRecord);
    refreshProgressionDerivedState(player);
    const after = snapshotProgression(player, jobRecord);

    return {
        ok: true,
        jobId: activeJobId,
        expGained: gained,
        levelUps,
        before,
        after,
        message: describeExperienceAward({ expGained: gained, levelUps, after }),
    };
}

export function switchMainJob(player, jobQuery, options = {}) {
    if (!player) return { ok: false, message: 'No player found.' };
    ensureProgressionState(player);

    const job = resolveUnlockedJob(player, jobQuery);
    if (!job) return { ok: false, message: `Job is not unlocked: ${jobQuery}` };
    if (player.jobs.mainJobId === job.id) {
        refreshProgressionDerivedState(player, { preserveTp: options.preserveTp ?? false });
        return { ok: true, unchanged: true, jobId: job.id, message: `Already set to ${job.name}.` };
    }

    syncActiveJobRecord(player);
    const previousJobId = player.jobs.mainJobId;
    const record = getJobProgressionRecord(player, job.id);
    player.jobs.mainJobId = job.id;
    player.jobs.mainJobName = job.name;
    player.jobs.level = record.level;
    player.jobs.jobLevels[job.id] = record.level;
    player.progression.exp = record.exp;
    refreshProgressionDerivedState(player, { preserveTp: options.preserveTp ?? false });

    return {
        ok: true,
        previousJobId,
        jobId: job.id,
        level: record.level,
        exp: record.exp,
        message: `Changed main job to ${job.name} Lv.${record.level}.`,
    };
}

export function describeJobProgression(player) {
    ensureProgressionState(player);
    const unlocked = player.jobs.unlockedJobs ?? [];
    const lines = ['Job Progression:'];
    for (const jobId of unlocked) {
        const job = getJob(jobId);
        const record = getJobProgressionRecord(player, jobId);
        const active = player.jobs.mainJobId === jobId ? ' *active*' : '';
        lines.push(`- ${job.name} (${job.abbreviation}) Lv.${record.level} EXP ${record.exp}/${getExpToNextLevel(record.level, getLevelCap(player)) || 'CAP'}${active}`);
    }
    return lines.join('\n');
}

export function ensureProgressionState(player) {
    player.jobs ??= {};
    player.jobs.jobLevels ??= {};
    player.jobs.unlockedJobs ??= player.jobs.mainJobId ? [player.jobs.mainJobId] : [];
    player.progression ??= {};
    player.progression.jobProgression ??= {};
    const activeJobId = player.jobs.mainJobId ?? 'warrior';
    const activeLevel = Math.max(1, Number(player.jobs.level) || 1);
    const activeExp = Math.max(0, Math.floor(Number(player.progression.exp) || 0));

    for (const jobId of player.jobs.unlockedJobs) {
        const record = player.progression.jobProgression[jobId] ?? {};
        const level = Math.max(1, Number(record.level ?? player.jobs.jobLevels[jobId] ?? (jobId === activeJobId ? activeLevel : 1)) || 1);
        const exp = Math.max(0, Math.floor(Number(record.exp ?? (jobId === activeJobId ? activeExp : 0)) || 0));
        player.progression.jobProgression[jobId] = { level, exp };
        player.jobs.jobLevels[jobId] = level;
    }

    if (!player.jobs.unlockedJobs.includes(activeJobId)) player.jobs.unlockedJobs.push(activeJobId);
    const activeRecord = getJobProgressionRecord(player, activeJobId);
    applyJobRecordToActiveJob(player, activeJobId, activeRecord);
    return player.progression;
}

export function refreshProgressionDerivedState(player, options = {}) {
    ensureProgressionState(player);
    const levelCap = getLevelCap(player, options.levelCap);
    const activeRecord = getJobProgressionRecord(player, player.jobs.mainJobId);
    player.progression.exp = activeRecord.exp;
    player.progression.expToNext = getExpToNextLevel(activeRecord.level, levelCap);
    player.combat = calculateCombatProfile(player);
    player.resources ??= {};
    player.resources.hp = player.combat.resources.maxHp;
    player.resources.mp = player.combat.resources.maxMp;
    player.resources.tp = options.preserveTp ? Math.min(player.resources.tp ?? 0, player.combat.resources.maxTp) : 0;
    return player;
}

export function describeExperienceAward(result) {
    const lines = [`EXP gained: ${result.expGained}`];
    if (result.levelUps.length) {
        lines.push(`Level up: ${result.levelUps.join(', ')}`);
    }
    lines.push(`Current level: ${result.after.level}`);
    lines.push(`EXP: ${result.after.exp}/${result.after.expToNext || 'CAP'}`);
    return lines.join('\n');
}

function resolveUnlockedJob(player, jobQuery) {
    const normalized = normalizeJobQuery(jobQuery);
    const unlocked = player.jobs.unlockedJobs ?? [];
    for (const jobId of unlocked) {
        const job = getJob(jobId);
        if ([job.id, job.name, job.abbreviation].map(normalizeJobQuery).includes(normalized)) return job;
    }
    return null;
}

function syncActiveJobRecord(player) {
    const activeJobId = player.jobs.mainJobId;
    const record = getJobProgressionRecord(player, activeJobId);
    record.level = Math.max(1, Number(player.jobs.level) || record.level || 1);
    record.exp = Math.max(0, Math.floor(Number(player.progression.exp) || record.exp || 0));
    player.jobs.jobLevels[activeJobId] = record.level;
}

function getJobProgressionRecord(player, jobId) {
    player.progression.jobProgression ??= {};
    if (!player.progression.jobProgression[jobId]) {
        player.progression.jobProgression[jobId] = {
            level: Math.max(1, Number(player.jobs.jobLevels?.[jobId]) || 1),
            exp: 0,
        };
    }
    return player.progression.jobProgression[jobId];
}

function applyJobRecordToActiveJob(player, jobId, record) {
    const job = getJob(jobId);
    player.jobs.mainJobId = job.id;
    player.jobs.mainJobName = job.name;
    player.jobs.level = record.level;
    player.jobs.jobLevels[job.id] = record.level;
    player.progression.exp = record.exp;
    player.progression.expToNext = getExpToNextLevel(record.level, getLevelCap(player));
    if (player.jobs.supportJobId) player.jobs.supportLevel = Math.floor(record.level / 2);
}

function snapshotProgression(player, record = null) {
    const activeRecord = record ?? getJobProgressionRecord(player, player.jobs.mainJobId);
    return {
        jobId: player.jobs.mainJobId,
        level: activeRecord.level,
        exp: activeRecord.exp,
        expToNext: getExpToNextLevel(activeRecord.level, getLevelCap(player)),
        levelCap: getLevelCap(player),
    };
}

function getLevelCap(player, override = null) {
    return Math.max(1, Math.min(99, Number(override ?? player.jobs?.levelCap ?? 50) || 50));
}

function normalizeJobQuery(value) {
    return String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}
