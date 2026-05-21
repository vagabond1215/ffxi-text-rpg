import { FFXI_JOB_GRADES, FFXI_RACE_GRADES, hasFfxiRaceGrades, isNoMpGrade } from '../data/ffxiStatGrades.js';
import { getInferredJobHpMpGrades } from '../data/ffxiInferredJobGrades.js';
import {
    calculateJobHp,
    calculateJobMp,
    calculateRaceHp,
    calculateRaceMp,
    calculateSupportJobHp,
    calculateSupportJobMp,
} from './ffxiStatFormula.js';

export function canUseInferredJobResourceFormula(entity) {
    return entity?.type === 'player'
        && hasFfxiRaceGrades(entity.identity?.raceId)
        && !FFXI_JOB_GRADES[entity.jobs?.mainJobId]
        && Boolean(getInferredJobHpMpGrades(entity.jobs?.mainJobId));
}

export function calculateInferredJobResources(entity) {
    if (!canUseInferredJobResourceFormula(entity)) {
        throw new Error('Entity is missing inferred newer-job HP/MP grades.');
    }

    const mainLevel = clampLevel(entity.jobs?.level ?? entity.level ?? 1);
    const supportLevel = clampSupportLevel(entity.jobs?.supportLevel ?? 0, mainLevel);
    const raceGrades = FFXI_RACE_GRADES[entity.identity.raceId];
    const mainJobGrades = resolveHpMpGrades(entity.jobs.mainJobId);
    const supportJobGrades = entity.jobs?.supportJobId ? resolveHpMpGrades(entity.jobs.supportJobId) : null;
    const hasMpSource = hasNativeMp(mainJobGrades.mp) || hasNativeMp(supportJobGrades?.mp);

    const raceHp = calculateRaceHp(raceGrades.hp, mainLevel);
    const jobHp = calculateJobHp(mainJobGrades.hp, mainLevel, entity.jobs.mainJobId);
    const supportHp = calculateSupportJobHp(supportJobGrades?.hp, supportLevel, entity.jobs.supportJobId);
    const raceMp = hasMpSource ? calculateRaceMp(raceGrades.mp, mainLevel) : 0;
    const jobMp = calculateJobMp(mainJobGrades.mp, mainLevel, entity.jobs.mainJobId);
    const supportMp = calculateSupportJobMp(supportJobGrades?.mp, supportLevel, entity.jobs.supportJobId);

    return {
        source: 'ffxi-inferred-newer-job-hp-mp',
        level: mainLevel,
        supportLevel,
        mainJobConfidence: mainJobGrades.confidence ?? 'known',
        resources: {
            maxHp: Math.max(1, Math.floor(raceHp + jobHp + supportHp)),
            maxMp: Math.max(0, Math.floor(raceMp + jobMp + supportMp)),
            maxTp: 3000,
        },
        notes: [
            'HP/MP use inferred newer-job grades.',
            'Attributes still use provisional fallback until full STR/DEX/VIT/AGI/INT/MND/CHR grades are sourced.',
        ],
    };
}

export function resolveHpMpGrades(jobId) {
    const known = FFXI_JOB_GRADES[jobId];
    if (known) return { id: jobId, hp: known.hp, mp: known.mp, confidence: 'known' };

    const inferred = getInferredJobHpMpGrades(jobId);
    if (inferred) return inferred;

    return null;
}

function hasNativeMp(grade) {
    return Boolean(grade) && !isNoMpGrade(grade);
}

function clampLevel(value) {
    return Math.max(1, Math.min(99, Number(value) || 1));
}

function clampSupportLevel(value, mainLevel) {
    return Math.max(0, Math.min(Math.floor(mainLevel / 2), Number(value) || 0));
}
