import { FFXI_JOB_GRADES, FFXI_RACE_GRADES, hasFfxiRaceGrades, isNoMpGrade } from '../data/ffxiStatGrades.js';
import { getInferredJobHpMpGrades } from '../data/ffxiInferredJobGrades.js';
import { toLegacyDisciplineResearchId, toLegacyRaceResearchId } from '../data/legacyIdentity.js';
import {
    calculateJobHp,
    calculateJobMp,
    calculateRaceHp,
    calculateRaceMp,
    calculateSupportJobHp,
    calculateSupportJobMp,
} from './ffxiStatFormula.js';

// Bounded compatibility adapter for historical inferred resource research.
// Canonical disciplines remain the runtime identity.

export function canUseInferredJobResourceFormula(entity) {
    const raceResearchId = toLegacyRaceResearchId(entity?.identity?.raceId);
    const disciplineResearchId = toLegacyDisciplineResearchId(entity?.jobs?.mainJobId);
    return entity?.type === 'player'
        && hasFfxiRaceGrades(raceResearchId)
        && !FFXI_JOB_GRADES[disciplineResearchId]
        && Boolean(getInferredJobHpMpGrades(disciplineResearchId));
}

export function calculateInferredJobResources(entity) {
    if (!canUseInferredJobResourceFormula(entity)) {
        throw new Error('Entity is missing compatible inferred legacy HP/MP research grades.');
    }

    const mainLevel = clampLevel(entity.jobs?.level ?? entity.level ?? 1);
    const supportLevel = clampSupportLevel(entity.jobs?.supportLevel ?? 0, mainLevel);
    const raceResearchId = toLegacyRaceResearchId(entity.identity.raceId);
    const mainDisciplineResearchId = toLegacyDisciplineResearchId(entity.jobs.mainJobId);
    const supportDisciplineResearchId = entity.jobs?.supportJobId
        ? toLegacyDisciplineResearchId(entity.jobs.supportJobId)
        : null;
    const raceGrades = FFXI_RACE_GRADES[raceResearchId];
    const mainJobGrades = resolveHpMpGrades(mainDisciplineResearchId, { alreadyLegacy: true });
    const supportJobGrades = supportDisciplineResearchId
        ? resolveHpMpGrades(supportDisciplineResearchId, { alreadyLegacy: true })
        : null;
    const hasMpSource = hasNativeMp(mainJobGrades.mp) || hasNativeMp(supportJobGrades?.mp);

    const raceHp = calculateRaceHp(raceGrades.hp, mainLevel);
    const jobHp = calculateJobHp(mainJobGrades.hp, mainLevel, mainDisciplineResearchId);
    const supportHp = calculateSupportJobHp(supportJobGrades?.hp, supportLevel, supportDisciplineResearchId);
    const raceMp = hasMpSource ? calculateRaceMp(raceGrades.mp, mainLevel) : 0;
    const jobMp = calculateJobMp(mainJobGrades.mp, mainLevel, mainDisciplineResearchId);
    const supportMp = calculateSupportJobMp(supportJobGrades?.mp, supportLevel, supportDisciplineResearchId);

    return {
        source: 'legacy-inferred-discipline-hp-mp-research',
        level: mainLevel,
        supportLevel,
        mainJobConfidence: mainJobGrades.confidence ?? 'known',
        resources: {
            maxHp: Math.max(1, Math.floor(raceHp + jobHp + supportHp)),
            maxMp: Math.max(0, Math.floor(raceMp + jobMp + supportMp)),
            maxTp: 3000,
        },
        notes: [
            'HP/MP currently reuse mapped historical research as a transitional balance reference.',
            'Canonical discipline balance will replace this adapter during the dedicated progression/stat pass.',
        ],
    };
}

export function resolveHpMpGrades(jobId, options = {}) {
    const researchId = options.alreadyLegacy ? jobId : toLegacyDisciplineResearchId(jobId);
    const known = FFXI_JOB_GRADES[researchId];
    if (known) return { id: researchId, hp: known.hp, mp: known.mp, confidence: 'known' };

    const inferred = getInferredJobHpMpGrades(researchId);
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
