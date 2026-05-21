import { describeFfxiStatGrades, FFXI_JOB_GRADES, FFXI_RACE_GRADES } from '../data/ffxiStatGrades.js';
import { describeHpMpGradeComparisons, describeInferredJobHpMpGrades } from '../data/ffxiInferredJobGrades.js';

export function describeJobStatGrades() {
    return [
        'Known classic job stat grades:',
        ...Object.entries(FFXI_JOB_GRADES).map(([jobId, grades]) => `${jobId}: HP ${grades.hp}, MP ${grades.mp}, STR ${grades.str}, DEX ${grades.dex}, VIT ${grades.vit}, AGI ${grades.agi}, INT ${grades.int}, MND ${grades.mnd}, CHR ${grades.chr}`),
        '',
        'Newer jobs currently have HP/MP inference only; use hpmpGrades for that data.',
    ].join('\n');
}

export function describeRaceStatGrades() {
    return [
        'Race stat grades:',
        ...Object.entries(FFXI_RACE_GRADES).map(([raceId, grades]) => `${raceId}: HP ${grades.hp}, MP ${grades.mp}, STR ${grades.str}, DEX ${grades.dex}, VIT ${grades.vit}, AGI ${grades.agi}, INT ${grades.int}, MND ${grades.mnd}, CHR ${grades.chr}`),
    ].join('\n');
}

export function describeStatFormulaOverview() {
    return [
        describeFfxiStatGrades(),
        '',
        'Commands:',
        '- raceGrades: show race HP/MP/stat grades.',
        '- jobGrades: show known classic full job grades.',
        '- hpmpGrades: show inferred newer-job HP/MP grades.',
        '- hpmpCompare: show HP/MP comparison values by level.',
    ].join('\n');
}

export { describeHpMpGradeComparisons, describeInferredJobHpMpGrades };
