import { FFXI_JOB_GRADES, FFXI_STAT_SOURCE, NO_MP_GRADE } from './ffxiStatGrades.js';
import { calculateJobHp, calculateJobMp } from '../systems/ffxiStatFormula.js';

export const FFXICLOPEDIA_HP_SOURCE = Object.freeze({
    id: 'ffxiclopedia-hit-points-job-rankings',
    name: 'FFXIclopedia Hit Points job rankings',
    url: 'https://ffxiclopedia.fandom.com/wiki/Hit_Points',
});

export const FFXICLOPEDIA_MP_SOURCE = Object.freeze({
    id: 'ffxiclopedia-magic-points-job-rankings',
    name: 'FFXIclopedia Magic Points job rankings',
    url: 'https://ffxiclopedia.fandom.com/wiki/Magic_Points',
});

export const INFERRED_JOB_HP_MP_GRADES = Object.freeze({
    blueMage: inferred('blueMage', 'Blue Mage', 'D', 'D', 'high', [
        'HP ranking ties BLU with BRD, COR, DNC, NIN, PUP, RDM, and THF. Known RDM/THF/NIN/BRD are HP D.',
        'MP ranking ties BLU with RDM and SCH. Known RDM is MP D.',
    ]),
    corsair: inferred('corsair', 'Corsair', 'D', NO_MP_GRADE, 'high', [
        'HP ranking ties COR with BRD, BLU, DNC, NIN, PUP, RDM, and THF. Known RDM/THF/NIN/BRD are HP D.',
        'MP ranking places COR in the None group.',
    ]),
    puppetmaster: inferred('puppetmaster', 'Puppetmaster', 'D', NO_MP_GRADE, 'high', [
        'HP ranking ties PUP with BRD, BLU, COR, DNC, NIN, RDM, and THF. Known RDM/THF/NIN/BRD are HP D.',
        'MP ranking places PUP in the None group. Automaton MP is separate from master MP.',
    ]),
    dancer: inferred('dancer', 'Dancer', 'D', NO_MP_GRADE, 'high', [
        'HP ranking ties DNC with BRD, BLU, COR, NIN, PUP, RDM, and THF. Known RDM/THF/NIN/BRD are HP D.',
        'MP ranking places DNC in the None group.',
    ]),
    scholar: inferred('scholar', 'Scholar', 'E', 'D', 'high', [
        'HP ranking ties SCH with RNG and WHM. Known RNG/WHM are HP E.',
        'MP ranking ties SCH with BLU and RDM. Known RDM is MP D.',
    ]),
    geomancer: inferred('geomancer', 'Geomancer', 'F', 'C', 'medium', [
        'HP ranking source snapshot does not list GEO. HP F is a conservative caster-band placeholder pending a stronger HP source.',
        'MP ranking places GEO directly after WHM and before BLU/RDM/SCH, implying MP C if WHM remains known MP C. The page marks GEO verification needed.',
    ]),
    runeFencer: inferred('runeFencer', 'Rune Fencer', 'B', 'F', 'high', [
        'HP ranking ties RUN with SAM and WAR. Known SAM/WAR are HP B.',
        'MP ranking ties RUN with DRK and PLD. Known DRK/PLD are MP F.',
    ]),
});

export const HP_MP_COMPARISON_LEVELS = Object.freeze([1, 10, 30, 50]);

export function getInferredJobHpMpGrades(jobId) {
    return INFERRED_JOB_HP_MP_GRADES[jobId] ?? null;
}

export function listInferredJobHpMpGrades() {
    return Object.values(INFERRED_JOB_HP_MP_GRADES);
}

export function describeInferredJobHpMpGrades() {
    return [
        'Inferred newer-job HP/MP grades:',
        `Formula source: ${FFXI_STAT_SOURCE.url}`,
        `HP comparison source: ${FFXICLOPEDIA_HP_SOURCE.url}`,
        `MP comparison source: ${FFXICLOPEDIA_MP_SOURCE.url}`,
        '',
        ...Object.values(INFERRED_JOB_HP_MP_GRADES).flatMap((job) => [
            `${job.name}: HP ${job.hp}, MP ${job.mp}, confidence ${job.confidence}`,
            ...job.rationale.map((line) => `- ${line}`),
            '',
        ]),
        'These are HP/MP-only inferred grades. Full STR/DEX/VIT/AGI/INT/MND/CHR job grades remain unknown until separately sourced.',
    ].join('\n').trim();
}

export function describeHpMpGradeComparisons() {
    const known = Object.entries(FFXI_JOB_GRADES).map(([jobId, grades]) => comparisonRow(jobId, jobId, grades.hp, grades.mp, 'known'));
    const inferred = Object.values(INFERRED_JOB_HP_MP_GRADES).map((job) => comparisonRow(job.id, job.name, job.hp, job.mp, `inferred:${job.confidence}`));

    return [
        'FFXI HP/MP Grade Comparisons',
        `Levels: ${HP_MP_COMPARISON_LEVELS.join(', ')}`,
        '',
        'Known jobs:',
        ...known,
        '',
        'Inferred newer jobs:',
        ...inferred,
    ].join('\n');
}

function comparisonRow(jobId, label, hpGrade, mpGrade, kind) {
    const hpValues = HP_MP_COMPARISON_LEVELS.map((level) => `${level}:${Math.floor(calculateJobHp(hpGrade, level, jobId))}`).join(' ');
    const mpValues = HP_MP_COMPARISON_LEVELS.map((level) => `${level}:${Math.floor(calculateJobMp(mpGrade, level, jobId))}`).join(' ');
    return `${label} [${kind}] HP ${hpGrade} (${hpValues}) MP ${mpGrade} (${mpValues})`;
}

function inferred(id, name, hp, mp, confidence, rationale) {
    return Object.freeze({ id, name, hp, mp, confidence, rationale: Object.freeze(rationale) });
}
