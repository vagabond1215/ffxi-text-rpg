import { EXP_CHAIN_BONUS_PERCENT, EXP_CON_RANKS, EXP_GUIDE_SOURCE } from '../data/expTables.js';

export function calculateExpBreakdown(options = {}) {
    const playerLevel = clampLevel(options.playerLevel ?? 1);
    const monsterLevel = clampLevel(options.monsterLevel ?? playerLevel);
    const levelDifference = monsterLevel - playerLevel;
    const conRank = options.conRank ?? inferConRank(levelDifference);
    const baseExp = options.baseExp ?? estimatePlaceholderBaseExp(levelDifference, conRank);
    const partyShare = clampPositive(options.partyShare ?? 1);
    const cappedExp = Math.min(baseExp, options.cap ?? baseExp);
    const chainBonusPercent = getChainBonusPercent(options.chainCount ?? 0);
    const bonusPercent = Math.max(0, Number(options.bonusPercent) || 0);
    const afterParty = Math.floor(cappedExp * partyShare);
    const chainBonus = Math.floor(afterParty * (chainBonusPercent / 100));
    const extraBonus = Math.floor((afterParty + chainBonus) * (bonusPercent / 100));
    const finalExp = Math.max(0, afterParty + chainBonus + extraBonus);

    return {
        source: EXP_GUIDE_SOURCE.id,
        status: 'research-scaffold',
        playerLevel,
        monsterLevel,
        levelDifference,
        conRank,
        baseExp,
        partyShare,
        cap: options.cap ?? null,
        cappedExp,
        chainCount: Math.max(0, Number(options.chainCount) || 0),
        chainBonusPercent,
        chainBonus,
        bonusPercent,
        bonusExp: extraBonus,
        finalExp,
        notes: [
            EXP_GUIDE_SOURCE.caveat,
            'Base EXP table is not finalized. Pass explicit baseExp for verified calculations.',
        ],
    };
}

export function describeExpBreakdown(options = {}) {
    const result = calculateExpBreakdown(options);
    return [
        'EXP calculation scaffold:',
        `Player level: ${result.playerLevel}`,
        `Monster level: ${result.monsterLevel}`,
        `Level difference: ${result.levelDifference}`,
        `Con rank: ${result.conRank}`,
        `Base EXP: ${result.baseExp}`,
        `Party share: ${result.partyShare}`,
        `Capped EXP: ${result.cappedExp}`,
        `Chain: ${result.chainCount} (+${result.chainBonusPercent}%, +${result.chainBonus})`,
        `Bonus modifiers: +${result.bonusPercent}% (+${result.bonusExp})`,
        `Final EXP: ${result.finalExp}`,
        '',
        ...result.notes.map((note) => `- ${note}`),
    ].join('\n');
}

export function inferConRank(levelDifference) {
    if (levelDifference <= -7) return EXP_CON_RANKS.TOO_WEAK;
    if (levelDifference <= -3) return EXP_CON_RANKS.EASY_PREY;
    if (levelDifference <= -1) return EXP_CON_RANKS.DECENT_CHALLENGE;
    if (levelDifference === 0) return EXP_CON_RANKS.EVEN_MATCH;
    if (levelDifference <= 2) return EXP_CON_RANKS.TOUGH;
    if (levelDifference <= 4) return EXP_CON_RANKS.VERY_TOUGH;
    return EXP_CON_RANKS.INCREDIBLY_TOUGH;
}

export function getChainBonusPercent(chainCount) {
    const normalized = Math.max(0, Number(chainCount) || 0);
    if (normalized >= 5) return EXP_CHAIN_BONUS_PERCENT[5];
    return EXP_CHAIN_BONUS_PERCENT[normalized] ?? 0;
}

function estimatePlaceholderBaseExp(levelDifference, conRank) {
    if (conRank === EXP_CON_RANKS.TOO_WEAK) return 0;
    if (levelDifference === 0) return 100;
    if (levelDifference > 0) return 100 + levelDifference * 20;
    return Math.max(0, 100 + levelDifference * 15);
}

function clampLevel(value) {
    return Math.max(1, Math.min(99, Number(value) || 1));
}

function clampPositive(value) {
    return Math.max(0, Number(value) || 0);
}
