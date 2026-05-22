import { getExpToNextLevel } from '../data/expTables.js';
import { calculateCombatProfile } from './statEngine.js';

export function awardExperience(player, amount, options = {}) {
    if (!player) return { ok: false, message: 'No player found.' };
    const gained = Math.max(0, Math.floor(Number(amount) || 0));
    ensureProgressionState(player);

    const before = snapshotProgression(player);
    player.progression.exp += gained;

    const levelUps = [];
    const levelCap = getLevelCap(player, options.levelCap);
    while (player.jobs.level < levelCap) {
        const needed = getExpToNextLevel(player.jobs.level, levelCap);
        if (!needed || player.progression.exp < needed) break;
        player.progression.exp -= needed;
        player.jobs.level += 1;
        player.jobs.jobLevels[player.jobs.mainJobId] = player.jobs.level;
        if (player.jobs.supportJobId) player.jobs.supportLevel = Math.floor(player.jobs.level / 2);
        levelUps.push(player.jobs.level);
    }

    refreshProgressionDerivedState(player);
    const after = snapshotProgression(player);

    return {
        ok: true,
        expGained: gained,
        levelUps,
        before,
        after,
        message: describeExperienceAward({ expGained: gained, levelUps, after }),
    };
}

export function ensureProgressionState(player) {
    player.progression ??= {};
    player.progression.exp = Math.max(0, Math.floor(Number(player.progression.exp) || 0));
    player.progression.expToNext = getExpToNextLevel(player.jobs?.level ?? 1, getLevelCap(player));
    player.jobs ??= {};
    player.jobs.jobLevels ??= {};
    if (player.jobs.mainJobId) player.jobs.jobLevels[player.jobs.mainJobId] = player.jobs.level ?? 1;
    return player.progression;
}

export function refreshProgressionDerivedState(player, options = {}) {
    ensureProgressionState(player);
    const levelCap = getLevelCap(player, options.levelCap);
    player.progression.expToNext = getExpToNextLevel(player.jobs.level, levelCap);
    player.combat = calculateCombatProfile(player);
    player.resources ??= {};
    player.resources.hp = player.combat.resources.maxHp;
    player.resources.mp = player.combat.resources.maxMp;
    player.resources.tp = options.preserveTp === false ? 0 : Math.min(player.resources.tp ?? 0, player.combat.resources.maxTp);
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

function snapshotProgression(player) {
    return {
        level: player.jobs.level,
        exp: player.progression.exp,
        expToNext: player.progression.expToNext,
        levelCap: getLevelCap(player),
    };
}

function getLevelCap(player, override = null) {
    return Math.max(1, Math.min(99, Number(override ?? player.jobs?.levelCap ?? 50) || 50));
}
