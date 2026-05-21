export const STAT_GRADE_KEYS = Object.freeze(['hp', 'mp', 'str', 'dex', 'vit', 'agi', 'int', 'mnd', 'chr']);
export const NO_MP_GRADE = 'X';

export const FFXI_GRADE_SCALES = Object.freeze({
    A: gradeScale('A', { hpScale: 9, hpBase: 19, hpScaleAfter30: 1, mpScale: 6, mpBase: 16, statusScale: 0.5, statusBase: 5 }),
    B: gradeScale('B', { hpScale: 8, hpBase: 17, hpScaleAfter30: 1, mpScale: 5, mpBase: 14, statusScale: 0.45, statusBase: 4 }),
    C: gradeScale('C', { hpScale: 7, hpBase: 16, hpScaleAfter30: 1, mpScale: 4, mpBase: 12, statusScale: 0.4, statusBase: 4 }),
    D: gradeScale('D', { hpScale: 6, hpBase: 14, hpScaleAfter30: 0, mpScale: 3, mpBase: 10, statusScale: 0.35, statusBase: 3 }),
    E: gradeScale('E', { hpScale: 5, hpBase: 13, hpScaleAfter30: 0, mpScale: 2, mpBase: 8, statusScale: 0.3, statusBase: 3 }),
    F: gradeScale('F', { hpScale: 4, hpBase: 11, hpScaleAfter30: 0, mpScale: 1, mpBase: 6, statusScale: 0.25, statusBase: 2 }),
    G: gradeScale('G', { hpScale: 3, hpBase: 10, hpScaleAfter30: 0, mpScale: 0.5, mpBase: 4, statusScale: 0.2, statusBase: 2 }),
});

export const FFXI_RACE_GRADES = Object.freeze({
    hume: statGrades('D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'),
    elvaan: statGrades('C', 'E', 'B', 'E', 'C', 'F', 'F', 'B', 'D'),
    tarutaru: statGrades('G', 'A', 'F', 'D', 'E', 'C', 'A', 'E', 'D'),
    mithra: statGrades('D', 'D', 'E', 'A', 'E', 'B', 'D', 'E', 'F'),
    galka: statGrades('A', 'G', 'C', 'D', 'A', 'E', 'E', 'D', 'F'),
});

export const FFXI_JOB_GRADES = Object.freeze({
    warrior: statGrades('B', 'X', 'A', 'C', 'D', 'C', 'F', 'F', 'E'),
    monk: statGrades('A', 'X', 'C', 'B', 'A', 'F', 'G', 'D', 'E'),
    whiteMage: statGrades('E', 'C', 'D', 'F', 'D', 'E', 'E', 'A', 'C'),
    blackMage: statGrades('F', 'B', 'F', 'C', 'F', 'C', 'A', 'E', 'D'),
    redMage: statGrades('D', 'D', 'D', 'D', 'E', 'E', 'C', 'C', 'D'),
    thief: statGrades('D', 'X', 'D', 'A', 'D', 'B', 'C', 'G', 'G'),
    paladin: statGrades('C', 'F', 'B', 'E', 'A', 'G', 'G', 'C', 'C'),
    darkKnight: statGrades('C', 'F', 'A', 'C', 'C', 'D', 'C', 'G', 'G'),
    beastmaster: statGrades('C', 'X', 'D', 'C', 'D', 'F', 'E', 'E', 'A'),
    bard: statGrades('D', 'X', 'D', 'D', 'D', 'F', 'D', 'D', 'B'),
    ranger: statGrades('E', 'X', 'E', 'D', 'D', 'A', 'E', 'D', 'E'),
    ninja: statGrades('D', 'X', 'C', 'B', 'C', 'B', 'D', 'G', 'F'),
    summoner: statGrades('G', 'A', 'G', 'D', 'G', 'D', 'B', 'C', 'C'),
    samurai: statGrades('B', 'X', 'C', 'C', 'C', 'D', 'E', 'E', 'D'),
    dragoon: statGrades('C', 'X', 'C', 'E', 'C', 'E', 'F', 'E', 'C'),
});

export const FFXI_STAT_SOURCE = Object.freeze({
    id: 'ffxi-stat-calc-20050211',
    name: 'FFXI Statistics Calculator 20050211 formula document',
    url: 'https://ffxi-stat-calc.sourceforge.net/document.html',
    caveat: 'Historical calculator model. The source states that formula accuracy deteriorates above level 50, especially HP.',
});

export function hasFfxiRaceGrades(raceId) {
    return Boolean(FFXI_RACE_GRADES[raceId]);
}

export function hasFfxiJobGrades(jobId) {
    return Boolean(FFXI_JOB_GRADES[jobId]);
}

export function isNoMpGrade(grade) {
    return String(grade).toUpperCase() === NO_MP_GRADE;
}

export function getGradeScale(grade) {
    const normalized = String(grade ?? '').toUpperCase();
    if (isNoMpGrade(normalized)) return null;
    return FFXI_GRADE_SCALES[normalized] ?? null;
}

export function describeFfxiStatGrades() {
    return [
        `${FFXI_STAT_SOURCE.name}`,
        `Source: ${FFXI_STAT_SOURCE.url}`,
        `Caveat: ${FFXI_STAT_SOURCE.caveat}`,
        '',
        `Race grade sets: ${Object.keys(FFXI_RACE_GRADES).join(', ')}`,
        `Job grade sets: ${Object.keys(FFXI_JOB_GRADES).join(', ')}`,
        `Grades: ${Object.keys(FFXI_GRADE_SCALES).join(', ')}, ${NO_MP_GRADE} means no native MP for that job.`,
    ].join('\n');
}

function statGrades(hp, mp, str, dex, vit, agi, int, mnd, chr) {
    return Object.freeze({ hp, mp, str, dex, vit, agi, int, mnd, chr });
}

function gradeScale(id, values) {
    return Object.freeze({ id, ...values });
}
