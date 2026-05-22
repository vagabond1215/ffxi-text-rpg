export const DEFAULT_LEVEL_CAP = 50;
export const ABSOLUTE_LEVEL_CAP = 99;

export const EXP_TABLE_SOURCE = Object.freeze({
    kind: 'conservative-placeholder',
    caveat: 'Starter EXP thresholds are intentionally simplified and testable, not final retail FFXI math.',
});

export function getExpToNextLevel(level, levelCap = DEFAULT_LEVEL_CAP) {
    const safeLevel = clampLevel(level);
    const safeCap = clampLevel(levelCap);
    if (safeLevel >= safeCap) return 0;
    return estimateExpToNext(safeLevel);
}

export function getTotalExpForLevel(level) {
    const safeLevel = clampLevel(level);
    let total = 0;
    for (let current = 1; current < safeLevel; current += 1) {
        total += getExpToNextLevel(current, ABSOLUTE_LEVEL_CAP);
    }
    return total;
}

export function describeExpTable() {
    return [
        'EXP Table:',
        `Source kind: ${EXP_TABLE_SOURCE.kind}`,
        `Caveat: ${EXP_TABLE_SOURCE.caveat}`,
        `Default level cap: ${DEFAULT_LEVEL_CAP}`,
        `Absolute level cap: ${ABSOLUTE_LEVEL_CAP}`,
    ].join('\n');
}

function estimateExpToNext(level) {
    const safeLevel = clampLevel(level);
    if (safeLevel < 10) return 250 + safeLevel * 150;
    if (safeLevel < 30) return 1600 + (safeLevel - 10) * 220;
    if (safeLevel < 50) return 6000 + (safeLevel - 30) * 450;
    if (safeLevel < 75) return 15000 + (safeLevel - 50) * 900;
    return 40000 + (safeLevel - 75) * 1500;
}

function clampLevel(level) {
    return Math.max(1, Math.min(ABSOLUTE_LEVEL_CAP, Number.parseInt(level, 10) || 1));
}
