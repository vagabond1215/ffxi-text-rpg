import { getEffectiveSkill, getSkillCap, getSkillRank, SKILL_CAP_METADATA } from '../data/skillCaps.js';
import { SKILL_KEYS } from '../data/systemConstants.js';
import { enrichEquipmentItem } from '../data/equipmentCatalog.js';

const MAIN_HAND_SKILL_BY_WEAPON_CATEGORY = Object.freeze({
    handToHand: 'handToHand',
    unarmed: 'handToHand',
    dagger: 'dagger',
    sword: 'sword',
    greatSword: 'greatSword',
    axe: 'axe',
    greatAxe: 'greatAxe',
    scythe: 'scythe',
    polearm: 'polearm',
    katana: 'katana',
    greatKatana: 'greatKatana',
    club: 'club',
    staff: 'staff',
});

const RANGED_SKILL_BY_WEAPON_CATEGORY = Object.freeze({
    sling: 'throwing',
    bow: 'archery',
    archery: 'archery',
    gun: 'marksmanship',
    crossbow: 'marksmanship',
    firearm: 'marksmanship',
    marksmanship: 'marksmanship',
    throwing: 'throwing',
});

const HEALING_SPELL_TERMS = Object.freeze([
    'cure',
    'curaga',
    'cura',
    'raise',
    'regen',
    'poisona',
    'paralyna',
    'blindna',
    'silena',
    'erase',
    'cursna',
]);

export function createSkillState(overrides = {}) {
    const skills = {};
    for (const [skillId, value] of Object.entries(overrides ?? {})) {
        if (SKILL_KEYS.includes(skillId)) skills[skillId] = normalizeSkillValue(value);
    }
    return skills;
}

export function ensureSkillState(player) {
    player.progression ??= {};
    if (!isPlainObject(player.progression.skills)) player.progression.skills = {};
    for (const [skillId, value] of Object.entries(player.progression.skills)) {
        if (isPlainObject(value)) continue;
        player.progression.skills[skillId] = normalizeSkillValue(value);
    }
    return player.progression.skills;
}

export function getLearnedSkill(player, skillId) {
    if (!SKILL_KEYS.includes(skillId)) return 0;
    const skills = ensureSkillState(player);
    return normalizeSkillValue(skills[skillId]);
}

export function setLearnedSkill(player, skillId, value) {
    if (!SKILL_KEYS.includes(skillId)) return { ok: false, message: `Unknown skill: ${skillId}` };
    const skills = ensureSkillState(player);
    skills[skillId] = normalizeSkillValue(value);
    return { ok: true, skillId, learned: skills[skillId] };
}

export function addLearnedSkill(player, skillId, amount, options = {}) {
    if (!SKILL_KEYS.includes(skillId)) return { ok: false, message: `Unknown skill: ${skillId}` };
    const current = getLearnedSkill(player, skillId);
    const requestedGain = Math.max(0, Math.floor(Number(amount) || 0));
    const next = current + requestedGain;
    const trainingCap = getSkillCap(player?.jobs?.mainJobId, skillId, player?.jobs?.level);
    let learned = next;

    if (options.clampToCurrentJobCap ?? true) {
        if (trainingCap <= 0 || current >= trainingCap) learned = current;
        else learned = Math.min(next, trainingCap);
    }

    setLearnedSkill(player, skillId, learned);
    return {
        ok: true,
        skillId,
        before: current,
        requestedGain,
        gained: Math.max(0, learned - current),
        learned,
        trainingCap,
        // Transitional aliases while callers move from job-cap terminology.
        gain: requestedGain,
        cap: trainingCap,
    };
}

export function inferMainHandSkill(player) {
    const item = player?.equipment?.mainHand;
    if (!item) return 'handToHand';
    return inferWeaponSkill(item, MAIN_HAND_SKILL_BY_WEAPON_CATEGORY);
}

export function inferRangedSkill(player) {
    const ranged = player?.equipment?.ranged;
    const ammo = player?.equipment?.ammo;
    return inferWeaponSkill(ranged, RANGED_SKILL_BY_WEAPON_CATEGORY)
        ?? inferWeaponSkill(ammo, RANGED_SKILL_BY_WEAPON_CATEGORY);
}

export function inferSpellSkill(spellName) {
    const normalized = normalizeToken(spellName || '');
    if (!normalized) return null;
    if (HEALING_SPELL_TERMS.some((term) => normalized.includes(term))) return 'healingMagic';
    return 'elementalMagic';
}

export function resolveSkillGainForAction(state, actionContext = {}) {
    const player = state?.player;
    if (!player) return { ok: false, gained: false, reason: 'No player found.' };

    const skillId = resolveActionSkill(player, actionContext);
    if (!skillId) return { ok: true, gained: false, reason: 'No eligible skill for action.' };
    if (!SKILL_KEYS.includes(skillId)) return { ok: false, gained: false, skillId, reason: `Unknown skill: ${skillId}` };

    const current = getEffectiveSkillForCurrentJob(player, skillId);
    if (current.cap <= 0) {
        return {
            ok: true,
            gained: false,
            reason: 'Active discipline provides no training window for this skill.',
            skillId,
            before: current.learned,
            learned: current.learned,
            cap: current.cap,
            trainingCap: current.cap,
        };
    }
    if (current.learned >= current.cap) {
        return {
            ok: true,
            gained: false,
            reason: 'Skill is at or above the active discipline training cap.',
            skillId,
            before: current.learned,
            learned: current.learned,
            cap: current.cap,
            trainingCap: current.cap,
        };
    }

    const requestedGain = Math.max(1, Math.floor(Number(actionContext.amount) || 1));
    const result = addLearnedSkill(player, skillId, requestedGain);
    return {
        ...result,
        gainedAmount: result.gained,
        gained: result.ok && result.learned > result.before,
    };
}

export function describeSkillGainResult(result) {
    if (!result?.gained) return '';
    return `Skill gained: ${result.skillId} ${result.before} -> ${result.learned} / cap ${result.cap}.`;
}

export function getEffectiveSkillForCurrentJob(player, skillId) {
    ensureSkillState(player);
    return getEffectiveSkill(player, skillId);
}

export function listEffectiveSkillsForCurrentJob(player) {
    ensureSkillState(player);
    const jobId = player?.jobs?.mainJobId;
    return SKILL_KEYS
        .map((skillId) => getEffectiveSkill(player, skillId))
        .filter((entry) => entry.cap > 0 || entry.learned > 0 || getSkillRank(jobId, entry.skillId));
}

export function describeSkillProgression(player, skillId = null) {
    ensureSkillState(player);
    if (skillId) {
        if (!SKILL_KEYS.includes(skillId)) return `Unknown skill: ${skillId}`;
        return describeSkillLine(getEffectiveSkill(player, skillId), player);
    }

    const entries = listEffectiveSkillsForCurrentJob(player);
    const lines = [
        `Skills for ${player.jobs?.mainJobName ?? player.jobs?.mainJobId ?? 'current job'} Lv.${player.jobs?.level ?? 1}:`,
        ...entries.map((entry) => `- ${describeSkillLine(entry, player)}`),
        `Confidence: ${SKILL_CAP_METADATA.confidence} (${SKILL_CAP_METADATA.source})`,
    ];
    return lines.join('\n');
}

function describeSkillLine(entry, player) {
    const jobLabel = `${player.jobs?.mainJobName ?? entry.jobId} cap`;
    const rank = entry.rank ?? 'none';
    const status = entry.overCurrentCap ? ' / over current cap' : entry.cappedForCurrentJob ? ' / at current cap' : '';
    return `${entry.skillId}: learned ${entry.learned} / ${jobLabel} ${entry.cap} / effective ${entry.effective} / rank ${rank}${status}`;
}

function normalizeSkillValue(value) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : 0;
}

function resolveActionSkill(player, actionContext = {}) {
    if (actionContext.skillId) return actionContext.skillId;
    const actionType = actionContext.actionType ?? actionContext.type;
    if (actionType === 'basicAttack' || actionType === 'weaponSkill') return inferMainHandSkill(player);
    if (actionType === 'rangedAttack') return inferRangedSkill(player);
    if (actionType === 'spell') return inferSpellSkill(actionContext.spellName);
    return null;
}

function inferWeaponSkill(item, skillMap) {
    if (!item) return null;
    const normalized = enrichEquipmentItem(item);
    const category = normalizeCategory(normalized.weaponCategory);
    if (category && skillMap[category]) return skillMap[category];

    const tags = normalized.tags ?? [];
    for (const tag of tags) {
        const tagCategory = normalizeCategory(tag);
        if (skillMap[tagCategory]) return skillMap[tagCategory];
    }
    return null;
}

function normalizeCategory(value) {
    const normalized = normalizeToken(value);
    const alias = {
        h2h: 'handToHand',
        handtohand: 'handToHand',
        greatsword: 'greatSword',
        greataxe: 'greatAxe',
        greatkatana: 'greatKatana',
    }[normalized];
    return alias ?? normalized;
}

function normalizeToken(value) {
    return String(value ?? '').trim().toLowerCase().replace(/[\s_-]+/g, '');
}

function isPlainObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
