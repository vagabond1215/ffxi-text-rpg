import {
    appendBattleLog,
    createBattleState,
    getCombatant,
    resolveBasicAttack,
    resolveRangedAttack,
    updateBattlePhase,
} from './battleEngine.js';
import {
    ensureCombatContract,
    finalizeCombatState,
    getCombatantReadyAt,
    initializeCombatTimeline,
    isCombatantReady,
    PLAYER_ACTION_RECOVERY_SECONDS,
    recordCombatAction,
    resolvePartyAndEnemyResponses,
} from './combatTurnEngine.js';
import { getActiveCompanionCombatEntities } from './partyEngine.js';
import { consumeEquippedItemQuantity } from './equipmentEngine.js';
import { getMeleeCadenceProfile, getRangedCadenceProfile, scaleWeaponRecoverySeconds, validateRangedLoadout } from './weaponCadenceEngine.js';
import { applyManualWeaponKataSequenceEffect, commitAutomaticWeaponKataAttack, getManualWeaponKataMove, prepareAutomaticWeaponKataAttack } from './weaponKataEngine.js';
import { describeCombatLoadoutBlock, isCombatLoadoutTransitionActive } from './combatLoadoutEngine.js';
import { ensureWorldTimeState } from './worldTimeEngine.js';
import { describeSkillGainResult, resolveSkillGainForAction } from './skillProgressionEngine.js';

export function startEncounter(state, enemyId, options = {}) {
    if (state.activeBattle?.phase === 'active') return { ok: false, message: 'You are already in battle.' };

    const enemy = findEnemyDefinition(state, enemyId);
    if (!enemy) return { ok: false, message: `Unknown enemy: ${enemyId}` };

    state.combatSequence = Math.max(0, Number.isInteger(state.combatSequence) ? state.combatSequence : 0) + 1;
    const sequence = String(state.combatSequence).padStart(6, '0');
    state.activeBattle = createBattleState({
        id: `battle-${sequence}`,
        player: state.player,
        allies: getActiveCompanionCombatEntities(state),
        enemies: [{ ...enemy, id: `${enemy.id}-encounter-${sequence}` }],
        rng: options.rng,
        rngSeed: options.rngSeed ?? null,
    });
    ensureCombatContract(state.activeBattle, {
        nowWorldSeconds: ensureWorldTimeState(state).totalSeconds,
        combatants: state.activeBattle.combatants,
    });
    initializeCombatTimeline(state, state.activeBattle);
    state.activeBattle.source = options.source ?? 'manual';
    state.activeBattle.sourceEnemyId = enemy.id;
    appendBattleLog(state.activeBattle, `${enemy.identity.name} engages you${options.reason ? `: ${options.reason}` : '.'}`);

    return { ok: true, message: describeBattle(state.activeBattle), battle: state.activeBattle };
}

export function performPlayerAttack(state, targetQuery = null) {
    const battle = state.activeBattle;
    if (!isActiveBattle(battle)) return 'You are not in battle.';

    const player = getPlayerCombatant(battle);
    if (isCombatLoadoutTransitionActive(state)) return describeCombatLoadoutBlock(state);
    const activationBlock = describeActiveAbilityCommitment(state);
    if (activationBlock) return activationBlock;
    const target = getTargetCombatant(battle, targetQuery);
    if (!player || !target) return 'No valid target.';
    const recovery = describeRecovery(state, player.id);
    if (recovery) return recovery;

    const cadence = getMeleeCadenceProfile(player);
    const kata = prepareAutomaticWeaponKataAttack(state, player);
    const recoverySeconds = kata.active
        ? scaleWeaponRecoverySeconds(cadence.recoverySeconds, kata.move.recoveryMultiplier)
        : cadence.recoverySeconds;
    const resolution = resolveBasicAttack(battle, player.id, target.id, kata.active ? {
        attackProfile: kata.move.attack,
        actionName: kata.move.name,
    } : {});
    const sequence = kata.active ? commitAutomaticWeaponKataAttack(state, player.id, kata) : null;
    const action = recordCombatAction(state, {
        battle,
        actorId: player.id,
        actorType: 'player',
        targetId: target.id,
        kind: 'basicAttack',
        sourceId: kata.active ? kata.move.id : 'basic-attack',
        outcome: resolution.outcome,
        recoverySeconds,
        data: {
            hit: resolution.hit,
            damage: resolution.damage,
            defeatedTarget: resolution.defeatedTarget,
            resolution: resolution.resolution ?? null,
            cadence,
            kata: kata.active ? {
                family: kata.familyId,
                slot: kata.slot,
                moveId: kata.move.id,
                moveName: kata.move.name,
                unlockedSlots: kata.unlockedSlots,
                nextSlot: sequence?.nextSlot ?? kata.nextSlotAfter,
            } : null,
        },
    });

    appendSkillGainLog(state, battle, { actionType: 'basicAttack' });
    if (battle.phase === 'active') resolvePartyAndEnemyResponses(state, { triggerActionId: action?.id ?? null });
    else finalizeCombatState(state);
    return describeBattleTurn(battle);
}

export function performPlayerRangedAttack(state, targetQuery = null) {
    const battle = state.activeBattle;
    if (!isActiveBattle(battle)) return 'You are not in battle.';

    const player = getPlayerCombatant(battle);
    if (isCombatLoadoutTransitionActive(state)) return describeCombatLoadoutBlock(state);
    const activationBlock = describeActiveAbilityCommitment(state);
    if (activationBlock) return activationBlock;
    const target = getTargetCombatant(battle, targetQuery);
    if (!player || !target) return 'No valid target.';
    const recovery = describeRecovery(state, player.id);
    if (recovery) return recovery;

    const loadout = validateRangedLoadout(player);
    if (!loadout.ok) return loadout.reason;
    const cadence = getRangedCadenceProfile(player);
    if (!cadence) return 'No usable ranged cadence is available.';

    const resolution = resolveRangedAttack(battle, player.id, target.id);
    const consumed = consumeEquippedItemQuantity(state, 'ammo', 1, { allowActiveBattleImmediate: true });
    if (!consumed.ok) return consumed.reason;

    const action = recordCombatAction(state, {
        battle,
        actorId: player.id,
        actorType: 'player',
        targetId: target.id,
        kind: 'rangedAttack',
        sourceId: loadout.weapon.id,
        outcome: resolution.outcome,
        recoverySeconds: cadence.recoverySeconds,
        data: {
            hit: resolution.hit,
            damage: resolution.damage,
            defeatedTarget: resolution.defeatedTarget,
            resolution: resolution.resolution ?? null,
            rangedWeaponId: loadout.weapon.id,
            ammoItemId: loadout.ammo.id,
            ammoConsumed: 1,
            ammoRemaining: consumed.remaining,
            cadence,
        },
    });

    appendSkillGainLog(state, battle, { actionType: 'rangedAttack' });
    if (battle.phase === 'active') resolvePartyAndEnemyResponses(state, { triggerActionId: action?.id ?? null });
    else finalizeCombatState(state);
    return describeBattleTurn(battle);
}

export function performManualWeaponKataTechnique(state, moveId, targetQuery = null) {
    const battle = state.activeBattle;
    if (!isActiveBattle(battle)) return 'You are not in battle.';

    const player = getPlayerCombatant(battle);
    if (isCombatLoadoutTransitionActive(state)) return describeCombatLoadoutBlock(state);
    const activationBlock = describeActiveAbilityCommitment(state);
    if (activationBlock) return activationBlock;
    const target = getTargetCombatant(battle, targetQuery);
    if (!player || !target) return 'No valid target.';
    const recovery = describeRecovery(state, player.id);
    if (recovery) return recovery;

    const manual = getManualWeaponKataMove(state.player, moveId);
    if (!manual.ok) return manual.reason;
    const cadence = getMeleeCadenceProfile(player);
    const recoverySeconds = scaleWeaponRecoverySeconds(cadence.recoverySeconds, manual.move.recoveryMultiplier);
    const resolution = resolveBasicAttack(battle, player.id, target.id, {
        attackProfile: manual.move.attack,
        actionName: manual.move.name,
    });
    const sequence = applyManualWeaponKataSequenceEffect(state, player.id, manual.move);
    const action = recordCombatAction(state, {
        battle,
        actorId: player.id,
        actorType: 'player',
        targetId: target.id,
        kind: 'weaponKataTechnique',
        sourceId: manual.move.id,
        outcome: resolution.outcome,
        recoverySeconds,
        data: {
            hit: resolution.hit,
            damage: resolution.damage,
            defeatedTarget: resolution.defeatedTarget,
            resolution: resolution.resolution ?? null,
            manual: true,
            family: manual.family.id,
            sequenceEffect: manual.move.sequenceEffect,
            sequence: sequence ? { nextSlot: sequence.nextSlot, resetCount: sequence.resetCount, lastResetReason: sequence.lastResetReason } : null,
            cadence,
        },
    });

    appendSkillGainLog(state, battle, { actionType: 'basicAttack', skillId: manual.family.skillId });
    if (battle.phase === 'active') resolvePartyAndEnemyResponses(state, { triggerActionId: action?.id ?? null });
    else finalizeCombatState(state);
    return describeBattleTurn(battle);
}

export function performWeaponSkill(state, skillName = 'Weapon Skill', targetQuery = null) {
    const battle = state.activeBattle;
    if (!isActiveBattle(battle)) return 'You are not in battle.';

    const player = getPlayerCombatant(battle);
    if (isCombatLoadoutTransitionActive(state)) return describeCombatLoadoutBlock(state);
    const activationBlock = describeActiveAbilityCommitment(state);
    if (activationBlock) return activationBlock;
    const target = getTargetCombatant(battle, targetQuery);
    if (!player || !target) return 'No valid target.';
    const recovery = describeRecovery(state, player.id);
    if (recovery) return recovery;
    if (player.resources.tp < 1000) return `Not enough TP. ${skillName} requires 1000 TP.`;

    player.resources.tp -= 1000;
    appendBattleLog(battle, `${player.identity.name} uses ${skillName}.`);
    const first = resolveBasicAttack(battle, player.id, target.id);
    const second = battle.phase === 'active'
        ? resolveBasicAttack(battle, player.id, target.id)
        : { outcome: 'not-resolved', hit: false, damage: 0, defeatedTarget: first.defeatedTarget };
    const action = recordCombatAction(state, {
        battle,
        actorId: player.id,
        actorType: 'player',
        targetId: target.id,
        kind: 'legacyTechnique',
        sourceId: String(skillName ?? 'Weapon Skill'),
        outcome: first.defeatedTarget || second.defeatedTarget ? 'defeated-target' : 'resolved',
        recoverySeconds: PLAYER_ACTION_RECOVERY_SECONDS + 1,
        data: {
            hits: [first, second].filter((entry) => entry.hit).length,
            damage: (Number(first.damage) || 0) + (Number(second.damage) || 0),
            transitional: true,
        },
    });
    appendSkillGainLog(state, battle, { actionType: 'weaponSkill', actionName: skillName });
    if (battle.phase === 'active') resolvePartyAndEnemyResponses(state, { triggerActionId: action?.id ?? null });
    else finalizeCombatState(state);
    return describeBattleTurn(battle);
}

export function castSpell(state, spellName = 'Cure', targetQuery = null) {
    const battle = state.activeBattle;
    if (!isActiveBattle(battle)) return 'You are not in battle.';

    const player = getPlayerCombatant(battle);
    if (!player) return 'No player combatant.';
    if (isCombatLoadoutTransitionActive(state)) return describeCombatLoadoutBlock(state);
    const activationBlock = describeActiveAbilityCommitment(state);
    if (activationBlock) return activationBlock;
    const recovery = describeRecovery(state, player.id);
    if (recovery) return recovery;

    const normalized = String(spellName || 'Cure').toLowerCase();
    const mpCost = normalized.includes('cure') ? 8 : 10;
    if (player.resources.mp < mpCost) return `Not enough MP. ${spellName} requires ${mpCost} MP.`;
    player.resources.mp -= mpCost;

    let target = player;
    let effectType = 'heal';
    let amount = 0;
    if (normalized.includes('cure')) {
        amount = Math.max(8, Math.floor(player.combat.attributes.mnd * 1.5));
        player.resources.hp = Math.min(player.combat.resources.maxHp, player.resources.hp + amount);
        appendBattleLog(battle, `${player.identity.name} casts ${spellName} and recovers ${amount} HP.`);
    } else {
        target = getTargetCombatant(battle, targetQuery);
        if (!target) return 'No valid target.';
        effectType = 'damage';
        amount = Math.max(5, Math.floor(player.combat.attributes.int * 1.4));
        target.resources.hp = Math.max(0, target.resources.hp - amount);
        appendBattleLog(battle, `${player.identity.name} casts ${spellName} on ${target.identity.name} for ${amount} damage.`);
        if (target.resources.hp <= 0) {
            target.battle.defeated = true;
            appendBattleLog(battle, `${target.identity.name} is defeated.`);
            updateBattlePhase(battle);
        }
    }

    const action = recordCombatAction(state, {
        battle,
        actorId: player.id,
        actorType: 'player',
        targetId: target?.id ?? null,
        kind: 'legacyCast',
        sourceId: String(spellName ?? 'Cure'),
        outcome: target?.battle?.defeated ? 'defeated-target' : 'resolved',
        recoverySeconds: PLAYER_ACTION_RECOVERY_SECONDS + 1,
        data: { effectType, amount, mpCost, transitional: true },
    });
    appendSkillGainLog(state, battle, { actionType: 'spell', spellName: spellName || 'Cure' });
    if (battle.phase === 'active') resolvePartyAndEnemyResponses(state, { triggerActionId: action?.id ?? null });
    else finalizeCombatState(state);
    return describeBattleTurn(battle);
}

export function describeBattle(battle) {
    if (!battle) return 'No active battle.';

    const lines = [
        `Battle: ${battle.phase} round ${battle.round}`,
        ...battle.combatants.map((combatant) => {
            const tag = combatant.type === 'player' ? 'Player' : combatant.type === 'companion' ? 'Companion' : 'Enemy';
            const defeated = combatant.battle.defeated ? ' defeated' : '';
            return `${tag}: ${combatant.identity.name} HP ${combatant.resources.hp}/${combatant.combat.resources.maxHp} MP ${combatant.resources.mp}/${combatant.combat.resources.maxMp} TP ${combatant.resources.tp}/${combatant.combat.resources.maxTp}${defeated}`;
        }),
    ];

    if (battle.rewards?.resolved) {
        lines.push('', 'Rewards:', `- EXP: ${battle.rewards.exp}`, `- Gil: ${battle.rewards.gil}`);
        lines.push(`- Loot: ${battle.rewards.items.length ? battle.rewards.items.map((item) => item.name).join(', ') : 'none'}`);
    }

    lines.push('', 'Recent log:', ...battle.log.slice(-8).map((entry) => `- ${entry}`));
    return lines.join('\n');
}

export function describeBattleTurn(battle) { return describeBattle(battle); }
export function isActiveBattle(battle) { return Boolean(battle && battle.phase === 'active'); }

function appendSkillGainLog(state, battle, actionContext) {
    const result = resolveSkillGainForAction(state, actionContext);
    if (result?.gained) syncRootSkillStateIntoBattle(state, battle);
    const message = describeSkillGainResult(result);
    if (message) appendBattleLog(battle, message);
    return result;
}

function syncRootSkillStateIntoBattle(state, battle) {
    const player = getPlayerCombatant(battle);
    if (!player || !state?.player) return null;
    player.progression ??= {};
    player.progression.skills = { ...(state.player.progression?.skills ?? {}) };
    return player.progression.skills;
}

function describeActiveAbilityCommitment(state) {
    const active = state?.abilities?.active;
    if (!active) return null;
    return `You are already activating ${active.abilityId}; finish or interrupt it before another combat action.`;
}

function describeRecovery(state, actorId) {
    if (isCombatantReady(state, actorId)) return null;
    const now = ensureWorldTimeState(state).totalSeconds;
    return `You are recovering for ${Math.max(1, getCombatantReadyAt(state, actorId) - now)}s.`;
}

function getPlayerCombatant(battle) {
    return battle?.combatants.find((combatant) => combatant.type === 'player') ?? null;
}

function getTargetCombatant(battle, targetQuery) {
    const enemies = battle.combatants.filter((combatant) => combatant.type === 'enemy' && !combatant.battle.defeated);
    if (!targetQuery) return enemies[0] ?? null;
    const normalized = normalize(targetQuery);
    return enemies.find((enemy) => normalize(enemy.identity.name).includes(normalized) || normalize(enemy.id).includes(normalized)) ?? enemies[0] ?? null;
}

function findEnemyDefinition(state, enemyId) {
    const normalized = normalize(enemyId);
    return (state.enemies ?? []).find((enemy) => normalize(enemy.id) === normalized || normalize(enemy.identity.name).includes(normalized)) ?? null;
}

function normalize(value) {
    return String(value ?? '').trim().toLowerCase().replace(/\s+/g, '-');
}
