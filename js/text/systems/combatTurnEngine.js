import { getEnemyAbility } from '../data/enemyAbilities.js';
import { applyCombatActionAttention, selectEnemyAttentionTarget } from './combatAttentionEngine.js';
import { appendBattleLog, COMBAT_SIDES, getCombatant, getCombatantSide, resolveBasicAttack, updateBattlePhase } from './battleEngine.js';
import { syncCompanionsFromBattle } from './partyEngine.js';
import { refreshPlayerDerivedState } from './playerDerivedState.js';
import { resolveBattleRewards } from './rewardEngine.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import { calculateCombatProfile } from './statEngine.js';
import { getHardDisableUntilWorldSeconds, isHardDisabledByStatus, reconcileStatusesAtWorldTime } from './statusEngine.js';
import { ensureWorldTimeState } from './worldTimeEngine.js';
import { getMeleeCadenceProfile } from './weaponCadenceEngine.js';

export const COMBAT_CONTRACT_VERSION = 2;
export const COMBAT_ACTION_HISTORY_LIMIT = 100;
export const PLAYER_ACTION_RECOVERY_SECONDS = 3;
export const COMPANION_ACTION_RECOVERY_SECONDS = 3;
export const ENEMY_ACTION_RECOVERY_SECONDS = 4;
export const ENEMY_OPENING_DELAY_SECONDS = 3;
export const COMBAT_INTERRUPT_PRIORITY = 900;

export function ensureCombatContract(battle, options = {}) {
    if (!battle || typeof battle !== 'object') return null;
    const current = battle.contract;
    if (!current || typeof current !== 'object' || Array.isArray(current)) {
        battle.contract = createCombatContractState(options);
        return battle.contract;
    }
    if (current.version === 1) {
        battle.contract = {
            version: COMBAT_CONTRACT_VERSION,
            actionSequence: Number.isInteger(current.actionSequence) && current.actionSequence >= 0 ? current.actionSequence : 0,
            actions: Array.isArray(current.actions) ? current.actions : [],
            lastActionId: current.lastActionId ?? null,
            timeline: createCombatTimeline(options),
        };
        return normalizeCombatContract(battle.contract);
    }
    if (current.version !== COMBAT_CONTRACT_VERSION) {
        battle.contract = createCombatContractState(options);
        return battle.contract;
    }
    if (!current.timeline || typeof current.timeline !== 'object' || Array.isArray(current.timeline)) current.timeline = createCombatTimeline(options);
    return normalizeCombatContract(current);
}

export function createCombatContractState(options = {}) {
    return {
        version: COMBAT_CONTRACT_VERSION,
        actionSequence: 0,
        actions: [],
        lastActionId: null,
        timeline: createCombatTimeline(options),
    };
}

export function initializeCombatTimeline(state, battle = state?.activeBattle) {
    if (!battle) return null;
    const now = ensureWorldTimeState(state).totalSeconds;
    const contract = ensureCombatContract(battle, { nowWorldSeconds: now, combatants: battle.combatants });
    if (!Number.isInteger(contract.timeline.startedAtWorldSeconds)) contract.timeline.startedAtWorldSeconds = now;
    for (const combatant of battle.combatants ?? []) {
        if (Number.isInteger(contract.timeline.readyAtByActorId[combatant.id])) continue;
        contract.timeline.readyAtByActorId[combatant.id] = getCombatantSide(combatant) === COMBAT_SIDES.ENEMY
            ? now + ENEMY_OPENING_DELAY_SECONDS
            : now;
    }
    return contract.timeline;
}

export function getCombatantReadyAt(state, actorId) {
    const battle = state?.activeBattle;
    if (!battle) return 0;
    const timeline = initializeCombatTimeline(state, battle);
    return Number(timeline?.readyAtByActorId?.[actorId]) || 0;
}

export function isCombatantReady(state, actorId) {
    return ensureWorldTimeState(state).totalSeconds >= getCombatantReadyAt(state, actorId);
}

export function setCombatantReadyAt(state, actorId, readyAtWorldSeconds) {
    const battle = state?.activeBattle;
    if (!battle || !actorId) return null;
    const timeline = initializeCombatTimeline(state, battle);
    const readyAt = Math.max(0, Math.floor(Number(readyAtWorldSeconds) || 0));
    timeline.readyAtByActorId[actorId] = readyAt;
    return readyAt;
}

export function setCombatantRecovery(state, actorId, recoverySeconds = PLAYER_ACTION_RECOVERY_SECONDS) {
    const now = ensureWorldTimeState(state).totalSeconds;
    return setCombatantReadyAt(state, actorId, now + Math.max(0, Math.floor(Number(recoverySeconds) || 0)));
}

export function recordCombatAction(state, definition = {}) {
    const battle = definition.battle ?? state?.activeBattle;
    const contract = ensureCombatContract(battle, {
        nowWorldSeconds: state ? ensureWorldTimeState(state).totalSeconds : 0,
        combatants: battle?.combatants,
    });
    if (!battle || !contract) return null;

    contract.actionSequence += 1;
    const atWorldSeconds = state ? ensureWorldTimeState(state).totalSeconds : null;
    const record = {
        id: `combat-action-${String(contract.actionSequence).padStart(6, '0')}`,
        round: Math.max(1, Number(battle.round) || 1),
        atWorldSeconds,
        actorId: definition.actorId ?? null,
        actorType: definition.actorType ?? null,
        targetId: definition.targetId ?? null,
        kind: definition.kind ?? 'unknown',
        sourceId: definition.sourceId ?? null,
        outcome: definition.outcome ?? 'resolved',
        data: clonePlain(definition.data ?? {}),
    };

    contract.actions.push(record);
    if (contract.actions.length > COMBAT_ACTION_HISTORY_LIMIT) contract.actions.splice(0, contract.actions.length - COMBAT_ACTION_HISTORY_LIMIT);
    contract.lastActionId = record.id;
    if (state && definition.actorId && definition.recoverySeconds !== undefined) {
        setCombatantRecovery(state, definition.actorId, definition.recoverySeconds);
    }
    const attentionChanges = applyCombatActionAttention(battle, record, { nowWorldSeconds: atWorldSeconds ?? 0 });
    if (attentionChanges.length) {
        record.data.attention = {
            ...(record.data.attention ?? {}),
            applied: attentionChanges.map((entry) => ({ ...entry })),
        };
    }

    if (state) {
        emitSemanticEvent(state, 'combat.action.resolved', {
            battleId: battle.id ?? null,
            actionId: record.id,
            round: record.round,
            atWorldSeconds,
            actorId: record.actorId,
            actorType: record.actorType,
            targetId: record.targetId,
            kind: record.kind,
            sourceId: record.sourceId,
            outcome: record.outcome,
            data: clonePlain(record.data),
        }, { source: 'combatTurnEngine' });
    }

    return record;
}

export function selectEnemyAction(battle, enemy, options = {}) {
    if (!battle || battle.phase !== 'active' || !enemy || enemy.battle?.defeated) return null;
    if (isHardDisabledByStatus(enemy, options.nowWorldSeconds ?? 0)) return null;
    const targetId = selectEnemyAttentionTarget(battle, enemy.id, options);
    const target = targetId ? getCombatant(battle, targetId) : null;
    if (!target) return null;

    const ability = (enemy.combatAbilityIds ?? []).map(getEnemyAbility).find(Boolean) ?? null;
    if (ability && Math.max(1, Number(battle.round) || 1) % 3 === 0) {
        return Object.freeze({
            kind: 'enemyAbility',
            actorId: enemy.id,
            targetId: target.id,
            sourceId: ability.id,
            policy: 'ability-cycle-v1',
        });
    }

    return Object.freeze({
        kind: 'basicAttack',
        actorId: enemy.id,
        targetId: target.id,
        policy: 'basic-attack-v1',
    });
}

export function selectCompanionAction(battle, companion) {
    if (!battle || battle.phase !== 'active' || !companion || companion.battle?.defeated) return null;
    const target = battle.combatants.find((combatant) => getCombatantSide(combatant) === COMBAT_SIDES.ENEMY && !combatant.battle?.defeated && combatant.resources?.hp > 0);
    if (!target) return null;
    return Object.freeze({
        kind: 'basicAttack',
        actorId: companion.id,
        targetId: target.id,
        policy: companion.tactics?.policy ?? 'basic-attack-v1',
    });
}

export function provideCombatInterrupts({ state, nowWorldSeconds, horizonWorldSeconds }) {
    const battle = state?.activeBattle;
    if (!battle || battle.phase !== 'active') return [];
    const timeline = initializeCombatTimeline(state, battle);
    return battle.combatants
        .filter((combatant) => getCombatantSide(combatant) === COMBAT_SIDES.ENEMY && !combatant.battle?.defeated && combatant.resources?.hp > 0)
        .map((enemy) => {
            let readyAt = Math.max(nowWorldSeconds, Number(timeline.readyAtByActorId[enemy.id]) || nowWorldSeconds);
            const disabledUntil = getHardDisableUntilWorldSeconds(enemy, nowWorldSeconds);
            if (disabledUntil === Infinity) return null;
            if (Number.isInteger(disabledUntil)) readyAt = Math.max(readyAt, disabledUntil);
            if (readyAt > horizonWorldSeconds) return null;
            return {
                id: `combat-ready:${enemy.id}:${readyAt}`,
                type: 'combat.enemy-ready',
                atWorldSeconds: readyAt,
                priority: COMBAT_INTERRUPT_PRIORITY,
                source: 'combatTurnEngine',
                data: { battleId: battle.id ?? null, enemyId: enemy.id },
            };
        })
        .filter(Boolean);
}

export function resolveEnemyReadyAction(state, enemyId, options = {}) {
    const battle = state?.activeBattle;
    if (!battle || battle.phase !== 'active') return { ok: false, code: 'combat.not-active', action: null };
    const enemy = getCombatant(battle, enemyId);
    if (!enemy || getCombatantSide(enemy) !== COMBAT_SIDES.ENEMY || enemy.battle?.defeated) return { ok: false, code: 'combat.enemy-unavailable', action: null };
    const nowWorldSeconds = ensureWorldTimeState(state).totalSeconds;
    const disabledUntilWorldSeconds = getHardDisableUntilWorldSeconds(enemy, nowWorldSeconds);
    if (disabledUntilWorldSeconds !== null) return { ok: false, code: 'combat.enemy-disabled', action: null, disabledUntilWorldSeconds };
    if (!options.force && !isCombatantReady(state, enemy.id)) {
        return { ok: false, code: 'combat.enemy-recovering', action: null, readyAtWorldSeconds: getCombatantReadyAt(state, enemy.id) };
    }

    const selection = selectEnemyAction(battle, enemy, {
        reassess: true,
        nowWorldSeconds,
        rng: options.rng,
    });
    if (!selection) return { ok: false, code: 'combat.no-action', action: null };
    const resolution = resolveEnemySelection(battle, selection, options);
    const action = recordCombatAction(state, {
        battle,
        actorId: selection.actorId,
        actorType: 'enemy',
        targetId: selection.targetId,
        kind: selection.kind,
        sourceId: selection.sourceId ?? selection.policy,
        outcome: resolution.outcome,
        recoverySeconds: resolution.recoverySeconds,
        data: {
            hit: resolution.hit,
            damage: resolution.damage,
            defeatedTarget: resolution.defeatedTarget,
            policy: selection.policy,
            abilityId: selection.kind === 'enemyAbility' ? selection.sourceId : null,
            triggerActionId: options.triggerActionId ?? null,
        },
    });

    battle.round = Math.max(1, Number(battle.round) || 1) + 1;
    finalizeCombatState(state);
    return { ok: true, code: 'combat.enemy-action-resolved', action, resolution, phase: battle.phase };
}

export function resolveCompanionResponse(state, options = {}) {
    const battle = state?.activeBattle;
    if (!battle || battle.phase !== 'active') return { ok: true, actions: [], phase: battle?.phase ?? null };
    const actions = [];
    const companions = battle.combatants.filter((combatant) => combatant.type === 'companion' && !combatant.battle?.defeated && combatant.resources?.hp > 0);
    for (const companion of companions) {
        if (!isCombatantReady(state, companion.id)) continue;
        const selection = selectCompanionAction(battle, companion);
        if (!selection) continue;
        const cadence = getMeleeCadenceProfile(companion);
        const resolution = resolveBasicAttack(battle, selection.actorId, selection.targetId, { rng: options.rng });
        const action = recordCombatAction(state, {
            battle,
            actorId: companion.id,
            actorType: 'companion',
            targetId: selection.targetId,
            kind: selection.kind,
            sourceId: selection.policy,
            outcome: resolution.outcome,
            recoverySeconds: cadence.recoverySeconds,
            data: {
                hit: resolution.hit,
                damage: resolution.damage,
                defeatedTarget: resolution.defeatedTarget,
                resolution: resolution.resolution ?? null,
                policy: selection.policy,
                cadence,
                triggerActionId: options.triggerActionId ?? null,
            },
        });
        actions.push(action);
        if (battle.phase !== 'active') break;
    }
    finalizeCombatState(state);
    return { ok: true, actions, phase: battle.phase };
}

export function resolveEnemyResponse(state, options = {}) {
    const battle = state?.activeBattle;
    if (!battle || battle.phase !== 'active') {
        finalizeCombatState(state);
        return { ok: true, actions: [], phase: battle?.phase ?? null };
    }

    const resolvedActions = [];
    const nowWorldSeconds = ensureWorldTimeState(state).totalSeconds;
    const enemies = battle.combatants.filter((combatant) => getCombatantSide(combatant) === COMBAT_SIDES.ENEMY && !combatant.battle?.defeated && combatant.resources?.hp > 0 && !isHardDisabledByStatus(combatant, nowWorldSeconds));

    for (const enemy of enemies) {
        const selection = selectEnemyAction(battle, enemy, {
            reassess: true,
            nowWorldSeconds,
            rng: options.rng,
        });
        if (!selection) continue;
        const resolution = resolveEnemySelection(battle, selection, options);
        const action = recordCombatAction(state, {
            battle,
            actorId: selection.actorId,
            actorType: 'enemy',
            targetId: selection.targetId,
            kind: selection.kind,
            sourceId: selection.sourceId ?? selection.policy,
            outcome: resolution.outcome,
            recoverySeconds: resolution.recoverySeconds,
            data: {
                hit: resolution.hit,
                damage: resolution.damage,
                defeatedTarget: resolution.defeatedTarget,
                resolution: resolution.resolution ?? null,
                policy: selection.policy,
                abilityId: selection.kind === 'enemyAbility' ? selection.sourceId : null,
                triggerActionId: options.triggerActionId ?? null,
            },
        });
        resolvedActions.push(action);

        if (battle.phase !== 'active') break;
    }

    if (resolvedActions.length) battle.round = Math.max(1, Number(battle.round) || 1) + 1;
    finalizeCombatState(state);
    return { ok: true, actions: resolvedActions, phase: battle.phase };
}

export function resolvePartyAndEnemyResponses(state, options = {}) {
    const companion = resolveCompanionResponse(state, options);
    const enemy = state.activeBattle?.phase === 'active'
        ? resolveEnemyResponse(state, options)
        : { ok: true, actions: [], phase: state.activeBattle?.phase ?? null };
    return {
        ok: true,
        companionActions: companion.actions ?? [],
        enemyActions: enemy.actions ?? [],
        phase: state.activeBattle?.phase ?? enemy.phase ?? companion.phase ?? null,
    };
}

export function reconcileCombatStatuses(state) {
    const now = ensureWorldTimeState(state).totalSeconds;
    const battle = state?.activeBattle;
    const expired = [];
    if (battle?.combatants) {
        for (const combatant of battle.combatants) {
            for (const statusId of reconcileStatusesAtWorldTime(combatant, now)) expired.push({ combatantId: combatant.id, statusId });
            combatant.combat = calculateCombatProfile(combatant);
        }
    } else if (state?.player) {
        for (const statusId of reconcileStatusesAtWorldTime(state.player, now)) expired.push({ combatantId: state.player.id, statusId });
        refreshPlayerDerivedState(state.player);
    }
    return expired;
}

export function finalizeCombatState(state) {
    const battle = state?.activeBattle;
    if (!battle) return null;
    ensureCombatContract(battle, { nowWorldSeconds: ensureWorldTimeState(state).totalSeconds, combatants: battle.combatants });
    reconcileCombatStatuses(state);
    syncPlayerFromCombat(state);
    syncCompanionsFromBattle(state, battle);

    if (battle.phase === 'victory' && !battle.rewards?.resolved) {
        const rewardResult = resolveBattleRewards(state, battle);
        if (rewardResult?.ok && rewardResult.message) appendBattleLog(battle, rewardResult.message);
    }
    if (battle.phase !== 'active' && !battle.endLogged) {
        appendBattleLog(battle, `Battle ended: ${battle.phase}.`);
        battle.endLogged = true;
    }
    return battle;
}

export function syncPlayerFromCombat(state) {
    const battle = state?.activeBattle;
    const playerCombatant = battle?.combatants?.find((combatant) => combatant.type === 'player');
    if (!playerCombatant || !state?.player) return null;

    state.player.resources = { ...playerCombatant.resources };
    state.player.statuses = (playerCombatant.statuses ?? []).map((status) => ({
        ...status,
        modifiers: cloneModifierBlocks(status.modifiers),
        flags: { ...(status.flags ?? {}) },
    }));
    refreshPlayerDerivedState(state.player);
    return playerCombatant;
}

export function validateCombatContract(battle) {
    const issues = [];
    const contract = battle?.contract;
    if (!contract || typeof contract !== 'object' || Array.isArray(contract)) return ['battle.contract must be an object.'];
    if (contract.version !== COMBAT_CONTRACT_VERSION) issues.push(`battle.contract.version must be ${COMBAT_CONTRACT_VERSION}.`);
    if (!Number.isInteger(contract.actionSequence) || contract.actionSequence < 0) issues.push('battle.contract.actionSequence must be a non-negative integer.');
    if (!Array.isArray(contract.actions)) return [...issues, 'battle.contract.actions must be an array.'];
    if (contract.actions.length > COMBAT_ACTION_HISTORY_LIMIT) issues.push(`battle.contract.actions must contain at most ${COMBAT_ACTION_HISTORY_LIMIT} records.`);
    if (!contract.timeline || typeof contract.timeline !== 'object' || Array.isArray(contract.timeline)) issues.push('battle.contract.timeline must be an object.');
    else {
        if (!Number.isInteger(contract.timeline.startedAtWorldSeconds) || contract.timeline.startedAtWorldSeconds < 0) issues.push('battle.contract.timeline.startedAtWorldSeconds must be a non-negative integer.');
        if (!contract.timeline.readyAtByActorId || typeof contract.timeline.readyAtByActorId !== 'object' || Array.isArray(contract.timeline.readyAtByActorId)) issues.push('battle.contract.timeline.readyAtByActorId must be an object.');
        else for (const [actorId, readyAt] of Object.entries(contract.timeline.readyAtByActorId)) {
            if (!actorId || !Number.isInteger(readyAt) || readyAt < 0) issues.push(`battle.contract.timeline ready time is invalid for ${actorId}.`);
        }
    }

    const ids = new Set();
    for (const action of contract.actions) {
        if (!action || typeof action !== 'object' || Array.isArray(action)) {
            issues.push('battle.contract action records must be objects.');
            continue;
        }
        if (!/^combat-action-\d{6,}$/.test(action.id ?? '')) issues.push(`Invalid combat action id ${String(action.id)}.`);
        if (ids.has(action.id)) issues.push(`Duplicate combat action id ${action.id}.`);
        ids.add(action.id);
        if (!Number.isInteger(action.round) || action.round < 1) issues.push(`${action.id}.round must be a positive integer.`);
        if (action.atWorldSeconds !== null && (!Number.isInteger(action.atWorldSeconds) || action.atWorldSeconds < 0)) issues.push(`${action.id}.atWorldSeconds must be null or a non-negative integer.`);
        if (!action.kind) issues.push(`${action.id}.kind is required.`);
        if (!action.outcome) issues.push(`${action.id}.outcome is required.`);
    }
    return issues;
}

function createCombatTimeline(options = {}) {
    const now = Math.max(0, Math.floor(Number(options.nowWorldSeconds) || 0));
    const readyAtByActorId = {};
    for (const combatant of options.combatants ?? []) {
        readyAtByActorId[combatant.id] = getCombatantSide(combatant) === COMBAT_SIDES.ENEMY ? now + ENEMY_OPENING_DELAY_SECONDS : now;
    }
    return { startedAtWorldSeconds: now, readyAtByActorId };
}

function normalizeCombatContract(contract) {
    if (!Number.isInteger(contract.actionSequence) || contract.actionSequence < 0) contract.actionSequence = 0;
    if (!Array.isArray(contract.actions)) contract.actions = [];
    if (contract.actions.length > COMBAT_ACTION_HISTORY_LIMIT) contract.actions.splice(0, contract.actions.length - COMBAT_ACTION_HISTORY_LIMIT);
    if (!contract.timeline || typeof contract.timeline !== 'object' || Array.isArray(contract.timeline)) contract.timeline = createCombatTimeline();
    if (!Number.isInteger(contract.timeline.startedAtWorldSeconds) || contract.timeline.startedAtWorldSeconds < 0) contract.timeline.startedAtWorldSeconds = 0;
    if (!contract.timeline.readyAtByActorId || typeof contract.timeline.readyAtByActorId !== 'object' || Array.isArray(contract.timeline.readyAtByActorId)) contract.timeline.readyAtByActorId = {};
    return contract;
}

function resolveEnemySelection(battle, selection, options = {}) {
    if (selection.kind === 'enemyAbility') {
        const ability = getEnemyAbility(selection.sourceId);
        const actor = getCombatant(battle, selection.actorId);
        const target = getCombatant(battle, selection.targetId);
        if (!ability || !actor || !target) return { outcome: 'invalid-combatant', hit: false, damage: 0, defeatedTarget: false, recoverySeconds: ENEMY_ACTION_RECOVERY_SECONDS };
        const statValue = Number(actor.combat?.attributes?.[ability.effect.stat]) || 0;
        const damage = Math.max(1, Math.floor(ability.effect.base + statValue * ability.effect.coefficient));
        const hpBefore = Math.max(0, Number(target.resources?.hp) || 0);
        target.resources.hp = Math.max(0, hpBefore - damage);
        const defeatedTarget = target.resources.hp <= 0;
        if (defeatedTarget) target.battle.defeated = true;
        appendBattleLog(battle, `${actor.identity.name} uses ${ability.name} on ${target.identity.name} for ${damage} damage.`);
        if (defeatedTarget) appendBattleLog(battle, `${target.identity.name} is defeated.`);
        updateBattlePhase(battle);
        return {
            outcome: defeatedTarget ? 'defeated-target' : 'hit',
            hit: true,
            damage,
            hpBefore,
            hpAfter: target.resources.hp,
            defeatedTarget,
            recoverySeconds: ability.recoverySeconds,
        };
    }

    return {
        ...resolveBasicAttack(battle, selection.actorId, selection.targetId, { rng: options.rng }),
        recoverySeconds: ENEMY_ACTION_RECOVERY_SECONDS,
    };
}

function cloneModifierBlocks(modifiers = {}) {
    return Object.fromEntries(Object.entries(modifiers ?? {}).map(([category, values]) => [category, { ...(values ?? {}) }]));
}

function clonePlain(value) {
    if (Array.isArray(value)) return value.map(clonePlain);
    if (!value || typeof value !== 'object') return value;
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, clonePlain(child)]));
}