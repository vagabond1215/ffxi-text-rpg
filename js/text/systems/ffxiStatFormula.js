import { ATTRIBUTE_KEYS, createZeroBlock } from '../data/systemConstants.js';
import {
    FFXI_JOB_GRADES,
    FFXI_RACE_GRADES,
    FFXI_STAT_SOURCE,
    getGradeScale,
    hasFfxiJobGrades,
    hasFfxiRaceGrades,
    isNoMpGrade,
} from '../data/ffxiStatGrades.js';

export function canUseFfxiStatFormula(entity) {
    return entity?.type === 'player'
        && hasFfxiRaceGrades(entity.identity?.raceId)
        && hasFfxiJobGrades(entity.jobs?.mainJobId);
}

export function calculateFfxiBaseProfile(entity) {
    if (!canUseFfxiStatFormula(entity)) {
        throw new Error('Entity is missing FFXI race/job stat grades.');
    }

    const mainLevel = clampLevel(entity.jobs?.level ?? entity.level ?? 1);
    const supportLevel = clampSupportLevel(entity.jobs?.supportLevel ?? 0, mainLevel);
    const raceGrades = FFXI_RACE_GRADES[entity.identity.raceId];
    const mainJobGrades = FFXI_JOB_GRADES[entity.jobs.mainJobId];
    const supportJobGrades = entity.jobs?.supportJobId ? FFXI_JOB_GRADES[entity.jobs.supportJobId] : null;

    return {
        source: FFXI_STAT_SOURCE.id,
        level: mainLevel,
        supportLevel,
        attributes: calculateFfxiAttributes({ raceGrades, mainJobGrades, supportJobGrades, mainLevel, supportLevel }),
        resources: calculateFfxiResources({ raceGrades, mainJobGrades, supportJobGrades, mainLevel, supportLevel, mainJobId: entity.jobs.mainJobId, supportJobId: entity.jobs.supportJobId }),
    };
}

export function calculateFfxiAttributes({ raceGrades, mainJobGrades, supportJobGrades = null, mainLevel, supportLevel = 0 }) {
    const attributes = createZeroBlock(ATTRIBUTE_KEYS);

    for (const key of ATTRIBUTE_KEYS) {
        const total = calculateRaceStatus(raceGrades[key], mainLevel)
            + calculateJobStatus(mainJobGrades[key], mainLevel)
            + calculateSupportJobStatus(supportJobGrades?.[key], supportLevel);
        attributes[key] = Math.floor(total);
    }

    return attributes;
}

export function calculateFfxiResources({ raceGrades, mainJobGrades, supportJobGrades = null, mainLevel, supportLevel = 0, mainJobId = null, supportJobId = null }) {
    const raceHp = calculateRaceHp(raceGrades.hp, mainLevel);
    const jobHp = calculateJobHp(mainJobGrades.hp, mainLevel, mainJobId);
    const supportHp = calculateSupportJobHp(supportJobGrades?.hp, supportLevel, supportJobId);
    const hasMpSource = hasNativeMp(mainJobGrades.mp) || hasNativeMp(supportJobGrades?.mp);
    const raceMp = hasMpSource ? calculateRaceMp(raceGrades.mp, mainLevel) : 0;
    const jobMp = calculateJobMp(mainJobGrades.mp, mainLevel, mainJobId);
    const supportMp = calculateSupportJobMp(supportJobGrades?.mp, supportLevel, supportJobId);

    return {
        maxHp: Math.max(1, Math.floor(raceHp + jobHp + supportHp)),
        maxMp: Math.max(0, Math.floor(raceMp + jobMp + supportMp)),
        maxTp: 3000,
    };
}

export function calculateRaceHp(grade, level) {
    const scale = requireGradeScale(grade, 'HP');
    const levelOver10 = Math.max(level - 10, 0);
    const levelOver30 = Math.max(level - 30, 0);
    return scale.hpScale * (level - 1) + scale.hpBase + 2 * levelOver10 + scale.hpScaleAfter30 * levelOver30;
}

export function calculateJobHp(grade, level, jobId = null) {
    const scale = requireGradeScale(grade, 'HP');
    const levelOver30 = Math.max(level - 30, 0);
    return scale.hpScale * (level - 1) + scale.hpBase + scale.hpScaleAfter30 * levelOver30 + monkHpBonus(jobId, level);
}

export function calculateSupportJobHp(grade, level, jobId = null) {
    if (!grade || level <= 0) return 0;
    const scale = requireGradeScale(grade, 'support HP');
    const levelOver10 = Math.max(level - 10, 0);
    return (scale.hpScale * (level - 1) + scale.hpBase + levelOver10) / 2 + monkHpBonus(jobId, level);
}

export function calculateRaceMp(grade, level) {
    const scale = getGradeScale(grade);
    if (!scale) return 0;
    return scale.mpScale * (level - 1) + scale.mpBase;
}

export function calculateJobMp(grade, level, jobId = null) {
    if (!hasNativeMp(grade)) return 0;
    const scale = getGradeScale(grade);
    if (!scale) return 0;
    return scale.mpScale * (level - 1) + scale.mpBase + summonerMpBonus(jobId, level, false);
}

export function calculateSupportJobMp(grade, level, jobId = null) {
    if (!grade || level <= 0 || !hasNativeMp(grade)) return 0;
    const scale = getGradeScale(grade);
    if (!scale) return 0;
    return (scale.mpScale * (level - 1) + scale.mpBase) / 2 + summonerMpBonus(jobId, level, true);
}

export function calculateRaceStatus(grade, level) {
    const scale = requireGradeScale(grade, 'race status');
    return scale.statusScale * (level - 1) + scale.statusBase;
}

export function calculateJobStatus(grade, level) {
    const scale = requireGradeScale(grade, 'job status');
    return scale.statusScale * (level - 1) + scale.statusBase;
}

export function calculateSupportJobStatus(grade, level) {
    if (!grade || level <= 0) return 0;
    const scale = requireGradeScale(grade, 'support job status');
    return (scale.statusScale * (level - 1) + scale.statusBase) / 2;
}

function hasNativeMp(grade) {
    return Boolean(grade) && !isNoMpGrade(grade) && Boolean(getGradeScale(grade));
}

function requireGradeScale(grade, label) {
    const scale = getGradeScale(grade);
    if (!scale) throw new Error(`Missing FFXI grade scale for ${label}: ${grade}`);
    return scale;
}

function monkHpBonus(jobId, level) {
    if (jobId !== 'monk') return 0;
    if (level >= 35) return 60;
    if (level >= 15) return 30;
    return 0;
}

function summonerMpBonus(jobId, level, support) {
    if (jobId !== 'summoner') return 0;
    if (support) {
        if (level >= 30) return 30;
        if (level >= 10) return 15;
        return 0;
    }
    if (level >= 70) return 50;
    if (level >= 50) return 40;
    if (level >= 30) return 30;
    if (level >= 10) return 15;
    return 0;
}

function clampLevel(value) {
    return Math.max(1, Math.min(99, Number(value) || 1));
}

function clampSupportLevel(value, mainLevel) {
    return Math.max(0, Math.min(Math.floor(mainLevel / 2), Number(value) || 0));
}
