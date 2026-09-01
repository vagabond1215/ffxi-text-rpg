import { enrichEquipmentItem } from '../data/equipmentCatalog.js';
import {
    WEAPON_KATA_CONFIGURATION_VERSION,
    WEAPON_KATA_FAMILIES,
    WEAPON_KATA_SLOT_THRESHOLDS,
    createDefaultWeaponKataConfiguration,
    getWeaponKataFamily,
    getWeaponKataMove,
    validateWeaponKataConfiguration,
} from '../data/weaponKataCatalog.js';
import { actionFailure, actionSuccess } from './actionResult.js';
import { getCharacterAffinityRank } from './characterAffinityEngine.js';
import { getLearnedSkill } from './skillProgressionEngine.js';

export const BATTLE_WEAPON_KATA_STATE_VERSION = 1;

export function createBattleWeaponKataState() {
    return { version: BATTLE_WEAPON_KATA_STATE_VERSION, byActorId: {} };
}

export function ensureWeaponKataConfiguration(player) {
    player.progression ??= {};
    if (!player.progression.weaponKata || validateWeaponKataConfiguration(player.progression.weaponKata).length) {
        player.progression.weaponKata = createDefaultWeaponKataConfiguration();
    }
    return player.progression.weaponKata;
}

export function getUnlockedWeaponKataSlotCount(player, familyId) {
    const family = getWeaponKataFamily(familyId);
    if (!family) return 0;
    const learned = getLearnedSkill(player, family.skillId);
    let count = 1;
    for (let index = 1; index < WEAPON_KATA_SLOT_THRESHOLDS.length; index += 1) {
        if (learned >= WEAPON_KATA_SLOT_THRESHOLDS[index]) count = index + 1;
    }
    return Math.min(count, family.slots.length);
}

export function prepareAutomaticWeaponKataAttack(state, actor) {
    const familyId = inferKataWeaponFamily(actor);
    const family = getWeaponKataFamily(familyId);
    if (!family || !state?.activeBattle) return { active: false, familyId: familyId ?? null };
    const battleState = ensureBattleWeaponKataState(state.activeBattle);
    const record = ensureActorSequenceRecord(battleState, actor.id, family.id);
    const unlockedSlots = getUnlockedWeaponKataSlotCount(state.player, family.id);
    if (record.nextSlot > unlockedSlots) record.nextSlot = 1;
    const slot = Math.max(1, record.nextSlot);
    const move = getSelectedAutomaticMove(state.player, family, slot);
    return {
        active: true,
        familyId: family.id,
        slot,
        unlockedSlots,
        move,
        nextSlotAfter: slot >= unlockedSlots ? 1 : slot + 1,
    };
}

export function commitAutomaticWeaponKataAttack(state, actorId, prepared) {
    if (!prepared?.active || !state?.activeBattle) return null;
    const battleState = ensureBattleWeaponKataState(state.activeBattle);
    const record = ensureActorSequenceRecord(battleState, actorId, prepared.familyId);
    record.family = prepared.familyId;
    record.nextSlot = prepared.nextSlotAfter;
    record.lastMoveId = prepared.move?.id ?? null;
    record.actionCount += 1;
    return { ...record };
}

export function resetWeaponKataSequence(state, actorId, options = {}) {
    if (!state?.activeBattle || !actorId) return null;
    const battleState = ensureBattleWeaponKataState(state.activeBattle);
    const actor = state.activeBattle.combatants?.find((entry) => entry.id === actorId);
    const family = inferKataWeaponFamily(actor);
    const record = ensureActorSequenceRecord(battleState, actorId, family);
    record.family = family;
    record.nextSlot = 1;
    record.lastMoveId = null;
    record.resetCount += 1;
    record.lastResetReason = String(options.reason ?? 'reset');
    return { ...record };
}

export function getManualWeaponKataMove(player, moveId) {
    const move = getWeaponKataMove(moveId);
    if (!move || move.kind !== 'manual') return { ok: false, code: 'combat.kata.manual-not-found', reason: `Unknown manual kata technique: ${moveId}` };
    const family = getWeaponKataFamily(move.family);
    const equippedFamily = inferKataWeaponFamily(player);
    if (equippedFamily !== move.family) return { ok: false, code: 'combat.kata.weapon-family', reason: `${move.name} requires a ${move.family} main-hand weapon.` };
    const learned = getLearnedSkill(player, family.skillId);
    if (learned < move.requiredSkill) return { ok: false, code: 'combat.kata.proficiency', reason: `${move.name} requires ${family.skillId} proficiency ${move.requiredSkill}; learned ${learned}.` };
    return { ok: true, move, family };
}

export function applyManualWeaponKataSequenceEffect(state, actorId, move) {
    if (!move) return null;
    if (move.sequenceEffect === 'reset') return resetWeaponKataSequence(state, actorId, { reason: `manual:${move.id}` });
    return null;
}

export function configureWeaponKataSelection(state, familyId, slotNumber, moveId) {
    if (state?.activeBattle?.phase === 'active') return fail('combat.kata.configure-in-combat', 'Configure weapon kata outside active combat.');
    const player = state?.player;
    const family = getWeaponKataFamily(familyId);
    if (!player || !family) return fail('combat.kata.family', `Unknown weapon kata family: ${familyId}`);
    const slot = family.slots.find((entry) => entry.slot === Number(slotNumber));
    if (!slot) return fail('combat.kata.slot', `Unknown ${family.id} kata slot: ${slotNumber}`);
    if (!slot.optionMoveIds.includes(moveId)) return fail('combat.kata.move', `${moveId} is not an option for ${family.id} slot ${slot.slot}.`);
    const move = getWeaponKataMove(moveId);
    const learned = getLearnedSkill(player, family.skillId);
    if (learned < move.requiredSkill) return fail('combat.kata.proficiency', `${move.name} requires ${family.skillId} proficiency ${move.requiredSkill}; learned ${learned}.`);
    if (!meetsAffinityRequirement(player, move)) {
        const requirement = move.requiredAffinity;
        return fail('combat.kata.affinity', `${move.name} requires ${requirement.element} affinity rank ${requirement.rank}; earned ${getCharacterAffinityRank(player, requirement.element)}.`);
    }
    const unlocked = getUnlockedWeaponKataSlotCount(player, family.id);
    if (slot.slot > unlocked) return fail('combat.kata.slot-locked', `${family.id} kata slot ${slot.slot} unlocks with more ${family.skillId} proficiency.`);

    const config = ensureWeaponKataConfiguration(player);
    config.selections[family.id][String(slot.slot)] = move.id;
    return actionSuccess({
        action: 'combat.kata.configure',
        code: 'combat.kata.configured',
        outcome: 'configured',
        data: { familyId: family.id, slot: slot.slot, moveId: move.id },
        display: { text: `${family.id} kata slot ${slot.slot} set to ${move.name}.` },
    });
}

export function describeWeaponKata(player, requestedFamily = null) {
    const config = ensureWeaponKataConfiguration(player);
    const families = requestedFamily ? [getWeaponKataFamily(requestedFamily)].filter(Boolean) : Object.values(WEAPON_KATA_FAMILIES);
    if (!families.length) return `Unknown weapon kata family: ${requestedFamily}`;
    const lines = ['Weapon Kata:'];
    for (const family of families) {
        const learned = getLearnedSkill(player, family.skillId);
        const unlocked = getUnlockedWeaponKataSlotCount(player, family.id);
        lines.push(`- ${family.id}: ${family.skillId} learned ${learned}; slots ${unlocked}/${family.slots.length}`);
        for (const slot of family.slots) {
            const moveId = config.selections[family.id][String(slot.slot)];
            const move = getWeaponKataMove(moveId);
            const affinity = move?.requiredAffinity ? `; requires ${move.requiredAffinity.element} affinity ${move.requiredAffinity.rank}` : '';
            lines.push(`  ${slot.slot}. ${move?.name ?? moveId}${slot.slot > unlocked ? ' [locked]' : ''}${affinity}`);
        }
        for (const moveId of family.manualMoveIds) {
            const move = getWeaponKataMove(moveId);
            lines.push(`  manual: ${move.name} (requires ${family.skillId} ${move.requiredSkill})`);
        }
    }
    return lines.join('\n');
}

export function validateBattleWeaponKataState(battle) {
    const value = battle?.weaponKata;
    const issues = [];
    if (!isObject(value)) return ['weaponKata must be an object.'];
    if (value.version !== BATTLE_WEAPON_KATA_STATE_VERSION) issues.push(`weaponKata.version must be ${BATTLE_WEAPON_KATA_STATE_VERSION}.`);
    if (!isObject(value.byActorId)) return [...issues, 'weaponKata.byActorId must be an object.'];
    const ids = new Set((battle.combatants ?? []).map((entry) => entry.id));
    for (const [actorId, record] of Object.entries(value.byActorId)) {
        if (!ids.has(actorId)) issues.push(`weaponKata.byActorId contains unknown actor ${actorId}.`);
        if (!isObject(record)) {
            issues.push(`weaponKata.byActorId.${actorId} must be an object.`);
            continue;
        }
        if (record.family !== null && record.family !== undefined && !getWeaponKataFamily(record.family)) issues.push(`weaponKata.byActorId.${actorId}.family is invalid.`);
        if (!Number.isInteger(record.nextSlot) || record.nextSlot < 1 || record.nextSlot > WEAPON_KATA_SLOT_THRESHOLDS.length) issues.push(`weaponKata.byActorId.${actorId}.nextSlot is invalid.`);
        if (record.lastMoveId !== null && record.lastMoveId !== undefined && !getWeaponKataMove(record.lastMoveId)) issues.push(`weaponKata.byActorId.${actorId}.lastMoveId is invalid.`);
        if (!Number.isInteger(record.actionCount) || record.actionCount < 0) issues.push(`weaponKata.byActorId.${actorId}.actionCount must be non-negative.`);
        if (!Number.isInteger(record.resetCount) || record.resetCount < 0) issues.push(`weaponKata.byActorId.${actorId}.resetCount must be non-negative.`);
        if (record.lastResetReason !== null && record.lastResetReason !== undefined && typeof record.lastResetReason !== 'string') issues.push(`weaponKata.byActorId.${actorId}.lastResetReason must be null or a string.`);
    }
    return issues;
}

export { WEAPON_KATA_CONFIGURATION_VERSION, validateWeaponKataConfiguration };

function getSelectedAutomaticMove(player, family, slotNumber) {
    const config = ensureWeaponKataConfiguration(player);
    const slot = family.slots.find((entry) => entry.slot === slotNumber) ?? family.slots[0];
    const selectedId = config.selections?.[family.id]?.[String(slot.slot)];
    const selected = getWeaponKataMove(selectedId);
    const learned = getLearnedSkill(player, family.skillId);
    if (selected && selected.kind === 'automatic' && selected.family === family.id && selected.slot === slot.slot && learned >= selected.requiredSkill && meetsAffinityRequirement(player, selected)) return selected;
    return getWeaponKataMove(slot.defaultMoveId);
}

function meetsAffinityRequirement(player, move) {
    if (!move?.requiredAffinity) return true;
    return getCharacterAffinityRank(player, move.requiredAffinity.element) >= move.requiredAffinity.rank;
}

function ensureBattleWeaponKataState(battle) {
    if (!isObject(battle.weaponKata)) battle.weaponKata = createBattleWeaponKataState();
    return battle.weaponKata;
}

function ensureActorSequenceRecord(battleState, actorId, family = null) {
    const current = battleState.byActorId[actorId];
    if (!isObject(current)) {
        battleState.byActorId[actorId] = { family, nextSlot: 1, lastMoveId: null, actionCount: 0, resetCount: 0, lastResetReason: null };
        return battleState.byActorId[actorId];
    }
    if (current.family !== family && family !== undefined) {
        current.family = family;
        current.nextSlot = 1;
        current.lastMoveId = null;
    }
    return current;
}

function inferKataWeaponFamily(actor) {
    const item = actor?.equipment?.mainHand ? enrichEquipmentItem(actor.equipment.mainHand) : null;
    const family = String(item?.weaponCategory ?? '').trim().toLowerCase().replace(/[\s_-]+/g, '');
    return getWeaponKataFamily(family)?.id ?? null;
}

function fail(code, text) {
    return actionFailure({
        action: 'combat.kata.configure',
        code,
        outcome: 'blocked',
        data: {},
        display: { text },
    });
}

function isObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
