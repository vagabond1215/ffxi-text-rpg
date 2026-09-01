import { getExpToNextLevel } from '../data/expTables.js';
import { JOB_DEFINITIONS } from '../data/jobs.js';
import { SKILL_KEYS } from '../data/systemConstants.js';
import { validateWeaponKataConfiguration } from '../data/weaponKataCatalog.js';
import { validateCharacterAffinityState } from './characterAffinityEngine.js';
import { CHARACTER_PROGRESSION_STATE_VERSION } from './progressionEngine.js';

export function validatePersistedPlayerProgression(player) {
    const issues = [];
    if (!isObject(player)) return ['player must be an object.'];

    const jobs = player.jobs;
    const progression = player.progression;
    if (!isObject(jobs)) return ['jobs must be an object.'];
    if (!isObject(progression)) return ['progression must be an object.'];

    const levelCap = validateLevelCap(jobs.levelCap, issues);
    const mainJobId = jobs.mainJobId;
    if (!knownJob(mainJobId)) issues.push(`jobs.mainJobId references unknown discipline ${String(mainJobId)}.`);
    if (!validLevel(jobs.level, levelCap)) issues.push(`jobs.level must be an integer from 1 to ${levelCap}.`);

    const unlockedJobs = validateUnlockedJobs(jobs.unlockedJobs, mainJobId, issues);
    validateJobLevels(jobs.jobLevels, unlockedJobs, mainJobId, jobs.level, levelCap, issues);
    validateJobProgression(progression, jobs.jobLevels, unlockedJobs, mainJobId, jobs.level, levelCap, issues);
    validateCharacterProgression(progression.character, progression.jobProgression, jobs.level, issues);
    validateSkillState(progression.skills, issues);
    issues.push(...validateCharacterAffinityState(progression.affinities).map((issue) => `progression.${issue}`));
    issues.push(...validateWeaponKataConfiguration(progression.weaponKata).map((issue) => `progression.${issue}`));

    return issues;
}

function validateLevelCap(value, issues) {
    if (!Number.isInteger(value) || value < 1 || value > 99) {
        issues.push('jobs.levelCap must be an integer from 1 to 99.');
        return 99;
    }
    return value;
}

function validateUnlockedJobs(value, mainJobId, issues) {
    if (!Array.isArray(value)) {
        issues.push('jobs.unlockedJobs must be an array.');
        return [];
    }

    const seen = new Set();
    for (const [index, jobId] of value.entries()) {
        if (!knownJob(jobId)) issues.push(`jobs.unlockedJobs[${index}] references unknown discipline ${String(jobId)}.`);
        if (seen.has(jobId)) issues.push(`jobs.unlockedJobs duplicates ${String(jobId)}.`);
        seen.add(jobId);
    }
    if (knownJob(mainJobId) && !seen.has(mainJobId)) issues.push('jobs.unlockedJobs must include jobs.mainJobId.');
    return [...seen].filter(knownJob);
}

function validateJobLevels(value, unlockedJobs, mainJobId, mainLevel, levelCap, issues) {
    if (!isObject(value)) {
        issues.push('jobs.jobLevels must be an object.');
        return;
    }

    for (const [jobId, level] of Object.entries(value)) {
        if (!knownJob(jobId)) issues.push(`jobs.jobLevels.${jobId} references unknown discipline.`);
        if (!validLevel(level, levelCap)) issues.push(`jobs.jobLevels.${jobId} must be an integer from 1 to ${levelCap}.`);
    }
    for (const jobId of unlockedJobs) {
        if (!validLevel(value[jobId], levelCap)) issues.push(`jobs.jobLevels.${jobId} must persist the unlocked discipline level.`);
    }
    if (knownJob(mainJobId) && validLevel(mainLevel, levelCap) && value[mainJobId] !== mainLevel) {
        issues.push(`jobs.jobLevels.${mainJobId} must match jobs.level.`);
    }
}

function validateJobProgression(progression, jobLevels, unlockedJobs, mainJobId, mainLevel, levelCap, issues) {
    const records = progression.jobProgression;
    if (!isObject(records)) {
        issues.push('progression.jobProgression must be an object.');
        return;
    }

    for (const [jobId, record] of Object.entries(records)) {
        if (!knownJob(jobId)) issues.push(`progression.jobProgression.${jobId} references unknown discipline.`);
        if (!isObject(record)) {
            issues.push(`progression.jobProgression.${jobId} must be an object.`);
            continue;
        }
        if (!validLevel(record.level, levelCap)) issues.push(`progression.jobProgression.${jobId}.level must be an integer from 1 to ${levelCap}.`);
        if (!nonNegativeInteger(record.exp)) issues.push(`progression.jobProgression.${jobId}.exp must be a non-negative integer.`);
        if (isObject(jobLevels) && validLevel(jobLevels[jobId], levelCap) && validLevel(record.level, levelCap) && record.level !== jobLevels[jobId]) {
            issues.push(`progression.jobProgression.${jobId}.level must match jobs.jobLevels.${jobId}.`);
        }
    }

    for (const jobId of unlockedJobs) {
        if (!isObject(records[jobId])) issues.push(`progression.jobProgression.${jobId} must persist the unlocked discipline record.`);
    }

    const active = records[mainJobId];
    if (knownJob(mainJobId) && isObject(active)) {
        if (validLevel(mainLevel, levelCap) && active.level !== mainLevel) {
            issues.push(`progression.jobProgression.${mainJobId}.level must match jobs.level.`);
        }
        if (!nonNegativeInteger(progression.exp)) {
            issues.push('progression.exp must be a non-negative integer.');
        } else if (nonNegativeInteger(active.exp) && progression.exp !== active.exp) {
            issues.push(`progression.exp must match progression.jobProgression.${mainJobId}.exp.`);
        }
        const expectedNext = validLevel(mainLevel, levelCap) ? getExpToNextLevel(mainLevel, levelCap) : null;
        if (!nonNegativeInteger(progression.expToNext)) {
            issues.push('progression.expToNext must be a non-negative integer.');
        } else if (expectedNext !== null && progression.expToNext !== expectedNext) {
            issues.push('progression.expToNext must match the active discipline level and level cap.');
        }
    }
}

function validateCharacterProgression(value, records, activeLevel, issues) {
    if (!isObject(value)) {
        issues.push('progression.character must be an object.');
        return;
    }
    if (value.version !== CHARACTER_PROGRESSION_STATE_VERSION) {
        issues.push(`progression.character.version must be ${CHARACTER_PROGRESSION_STATE_VERSION}.`);
    }
    if (!nonNegativeInteger(value.totalExperience)) issues.push('progression.character.totalExperience must be a non-negative integer.');
    if (!Number.isInteger(value.highestDisciplineLevel) || value.highestDisciplineLevel < 1 || value.highestDisciplineLevel > 99) {
        issues.push('progression.character.highestDisciplineLevel must be an integer from 1 to 99.');
    }

    const persistedLevels = isObject(records)
        ? Object.values(records).filter(isObject).map((record) => Number(record.level) || 0)
        : [];
    const highestPersistedLevel = Math.max(Number(activeLevel) || 1, ...persistedLevels);
    if (Number.isInteger(value.highestDisciplineLevel) && value.highestDisciplineLevel < highestPersistedLevel) {
        issues.push('progression.character.highestDisciplineLevel cannot be below persisted discipline progress.');
    }
}

function validateSkillState(value, issues) {
    if (!isObject(value)) {
        issues.push('progression.skills must be an object.');
        return;
    }
    for (const [skillId, learned] of Object.entries(value)) {
        if (!SKILL_KEYS.includes(skillId)) issues.push(`progression.skills.${skillId} references unknown skill.`);
        if (!nonNegativeInteger(learned)) issues.push(`progression.skills.${skillId} must be a non-negative integer.`);
    }
}

function knownJob(jobId) {
    return typeof jobId === 'string' && Boolean(JOB_DEFINITIONS[jobId]);
}

function validLevel(value, levelCap) {
    return Number.isInteger(value) && value >= 1 && value <= levelCap;
}

function nonNegativeInteger(value) {
    return Number.isInteger(value) && value >= 0;
}

function isObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
