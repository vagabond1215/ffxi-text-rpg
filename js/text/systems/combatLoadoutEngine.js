import { EQUIPMENT_SLOTS } from '../data/systemConstants.js';
import { enrichEquipmentItem } from '../data/equipmentCatalog.js';
import { hasItemFlag } from '../data/itemSchema.js';
import { actionFailure, actionSuccess } from './actionResult.js';
import { appendBattleLog } from './battleEngine.js';
import { getEnemyAttentionSnapshot } from './combatAttentionEngine.js';
import { isCombatantReady, recordCombatAction } from './combatTurnEngine.js';
import {
    equipItem,
    findEquippableItem,
    inferEquipmentSlot,
    unequipItem,
    validateEquipmentEligibility,
} from './equipmentEngine.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import { calculateCombatProfile } from './statEngine.js';
import {
    cancelTimedTask,
    findTimedTask,
    reconcileTimedTasks,
    releaseTimedTask,
    startTimedTask,
    TIMED_TASK_STATUSES,
} from './timedTaskEngine.js';
import { ensureWorldTimeState } from './worldTimeEngine.js';

export const COMBAT_LOADOUT_TRANSITION_VERSION = 1;
export const COMBAT_LOADOUT_TASK_KIND = 'combat.loadout-transition';
export const COMBAT_LOADOUT_TASK_CHANNEL = 'combat:loadout';
export const DEFAULT_ARMOR_PRESSURE_FOCUS_THRESHOLD = 0.15;

const WEAPON_SLOTS = Object.freeze(['mainHand', 'offHand', 'ranged', 'ammo']);
const HARD_DISABLE_FLAGS = Object.freeze(['hardDisabled', 'stunned', 'asleep', 'cannotAct', 'incapacitated']);

export function startCombatEquipTransition(state, itemQuery, options = {}) {
    const battle = activeBattle(state);
    if (!battle) return fail('combat.loadout.not-active', 'Combat loadout transitions require an active battle.');
    if (!itemQuery) return fail('combat.loadout.item-required', 'Equip what?');
    const common = validateTransitionStart(state, battle);
    if (!common.ok) return common;

    const source = findEquippableItem(state, itemQuery, options.fromContainerId);
    if (!source.ok) return fail('combat.loadout.item-unavailable', source.reason);
    const item = enrichEquipmentItem(source.item);
    const slot = options.slot ?? inferEquipmentSlot(item);
    const eligibility = validateEquipmentEligibility(state, item, slot);
    if (!eligibility.ok) return fail('combat.loadout.ineligible', eligibility.reason);

    const plan = {
        operation: 'equip',
        itemId: String(source.item.id ?? item.id),
        itemTemplateId: String(source.item.templateId ?? item.templateId ?? item.id),
        itemName: String(item.name ?? item.id),
        sourceContainerId: source.containerId,
        returnContainerId: options.returnContainerId ?? source.containerId,
        slot,
        expectedCurrentItemId: state.player?.equipment?.[slot]?.id ?? null,
    };
    return startTransition(state, battle, plan, item, state.player?.equipment?.[slot] ?? null);
}

export function startCombatUnequipTransition(state, slot, destinationContainerId = 'inventory') {
    const battle = activeBattle(state);
    if (!battle) return fail('combat.loadout.not-active', 'Combat loadout transitions require an active battle.');
    const common = validateTransitionStart(state, battle);
    if (!common.ok) return common;
    if (!EQUIPMENT_SLOTS.includes(slot)) return fail('combat.loadout.slot-invalid', `Unknown equipment slot: ${slot}`);

    const current = state.player?.equipment?.[slot] ?? null;
    if (!current) return fail('combat.loadout.empty-slot', `Nothing is equipped in ${slot}.`);
    const plan = {
        operation: 'unequip',
        itemId: String(current.id ?? current.templateId),
        itemTemplateId: String(current.templateId ?? current.id),
        itemName: String(current.name ?? current.id),
        destinationContainerId,
        slot,
        expectedCurrentItemId: current.id ?? null,
    };
    return startTransition(state, battle, plan, null, current);
}

export function reconcileCombatLoadoutTransition(state) {
    const battle = state?.activeBattle;
    const transition = battle?.loadoutTransition;
    if (!transition) return null;

    if (battle.phase !== 'active') return cancelCombatLoadoutTransition(state, 'battle ended');
    if (isCombatActorHardDisabled(getBattlePlayer(battle))) {
        return cancelCombatLoadoutTransition(state, 'hard disabled');
    }

    reconcileTimedTasks(state);
    const task = findTimedTask(state, transition.taskId);
    const now = ensureWorldTimeState(state).totalSeconds;
    if (task?.status === TIMED_TASK_STATUSES.ACTIVE && now < transition.completesAtWorldSeconds) return null;
    if (!task || ![TIMED_TASK_STATUSES.COMPLETED, TIMED_TASK_STATUSES.CANCELLED].includes(task.status)) {
        return cancelCombatLoadoutTransition(state, 'loadout task is missing or invalid');
    }
    if (task.status === TIMED_TASK_STATUSES.CANCELLED) {
        return finishCancellation(state, transition, task, 'loadout task cancelled');
    }

    const beforeCooldowns = { ...(state.abilities?.cooldowns ?? {}) };
    const message = applyTransitionPlan(state, transition.plan);
    if (!transitionPlanApplied(state, transition.plan)) {
        return finishCancellation(state, transition, task, message || 'equipment transition could not be applied');
    }

    syncBattlePlayerEquipment(state);
    const action = recordCombatAction(state, {
        battle,
        actorId: transition.actorId,
        actorType: 'player',
        targetId: transition.actorId,
        kind: 'loadoutTransition',
        sourceId: transition.kind,
        outcome: 'resolved',
        recoverySeconds: transition.recoverySeconds,
        data: {
            operation: transition.plan.operation,
            slot: transition.plan.slot,
            itemId: transition.plan.itemId,
            transitionKind: transition.kind,
            durationSeconds: transition.durationSeconds,
            resetWeaponSequence: transition.resetWeaponSequence,
        },
    });
    const event = emitSemanticEvent(state, 'combat.loadout.completed', {
        battleId: battle.id,
        actorId: transition.actorId,
        taskId: transition.taskId,
        operation: transition.plan.operation,
        slot: transition.plan.slot,
        itemId: transition.plan.itemId,
        transitionKind: transition.kind,
        resetWeaponSequence: transition.resetWeaponSequence,
        combatActionId: action?.id ?? null,
    }, { source: 'combatLoadoutEngine' });
    appendBattleLog(battle, `${transition.plan.itemName} loadout transition completes.`);

    battle.loadoutTransition = null;
    releaseTimedTask(state, transition.taskId);

    return actionSuccess({
        action: 'combat.loadout.reconcile',
        code: 'combat.loadout.completed',
        outcome: 'completed',
        data: {
            taskId: transition.taskId,
            eventId: event.id,
            combatActionId: action?.id ?? null,
            message,
            cooldownsPreserved: sameShallowMap(beforeCooldowns, state.abilities?.cooldowns ?? {}),
        },
        display: { text: message },
    });
}

export function cancelCombatLoadoutTransition(state, reason = 'interrupted') {
    const battle = state?.activeBattle;
    const transition = battle?.loadoutTransition;
    if (!transition) return null;
    const task = findTimedTask(state, transition.taskId);
    if (task?.status === TIMED_TASK_STATUSES.ACTIVE) cancelTimedTask(state, transition.taskId, reason);
    const terminalTask = findTimedTask(state, transition.taskId);
    return finishCancellation(state, transition, terminalTask, reason);
}

export function interruptCombatLoadoutIfHardDisabled(state) {
    const transition = state?.activeBattle?.loadoutTransition;
    if (!transition) return null;
    return isCombatActorHardDisabled(getBattlePlayer(state.activeBattle))
        ? cancelCombatLoadoutTransition(state, 'hard disabled')
        : null;
}

export function isCombatLoadoutTransitionActive(state) {
    return Boolean(state?.activeBattle?.phase === 'active' && state.activeBattle.loadoutTransition);
}

export function describeCombatLoadoutBlock(state) {
    const transition = state?.activeBattle?.loadoutTransition;
    if (!transition) return '';
    const now = ensureWorldTimeState(state).totalSeconds;
    return `You are changing equipment for ${Math.max(0, transition.completesAtWorldSeconds - now)}s more.`;
}

export function isCombatActorHardDisabled(actor) {
    if (!actor || actor.battle?.defeated || Number(actor.resources?.hp) <= 0) return true;
    return (actor.statuses ?? []).some((status) => HARD_DISABLE_FLAGS.some((flag) => status?.flags?.[flag] === true));
}

export function getArmorPressureReport(state, actorId = state?.player?.id, options = {}) {
    const battle = activeBattle(state);
    if (!battle || !actorId) return Object.freeze({ blocked: false, threshold: DEFAULT_ARMOR_PRESSURE_FOCUS_THRESHOLD, hostiles: Object.freeze([]) });
    const threshold = Number.isFinite(Number(options.focusThreshold))
        ? Math.max(0, Math.min(1, Number(options.focusThreshold)))
        : DEFAULT_ARMOR_PRESSURE_FOCUS_THRESHOLD;
    const nowWorldSeconds = ensureWorldTimeState(state).totalSeconds;
    const hostiles = [];

    for (const enemy of battle.combatants.filter((entry) => entry.type === 'enemy' && !entry.battle?.defeated && Number(entry.resources?.hp) > 0)) {
        if (isCombatActorHardDisabled(enemy)) continue;
        const snapshot = getEnemyAttentionSnapshot(battle, enemy.id, { nowWorldSeconds });
        const actor = snapshot?.entries?.find((entry) => entry.actorId === actorId) ?? null;
        const reasons = [];
        if (snapshot?.aggroTargetId === actorId) reasons.push('aggro');
        if (snapshot?.fixation?.targetId === actorId) reasons.push('fixation');
        if ((actor?.focus ?? 0) >= threshold) reasons.push('focus');
        if (reasons.length) hostiles.push(Object.freeze({
            enemyId: enemy.id,
            focus: actor?.focus ?? 0,
            reasons: Object.freeze(reasons),
        }));
    }

    return Object.freeze({ blocked: hostiles.length > 0, threshold, hostiles: Object.freeze(hostiles) });
}

export function getEquipmentHandling(item) {
    if (!item) return Object.freeze({ stowSeconds: 0, drawSeconds: 0, readySeconds: 0, cumbersome: false });
    const normalized = enrichEquipmentItem(item);
    if (normalized.handling) return Object.freeze({ ...normalized.handling });

    const twoHanded = hasItemFlag(normalized, 'twoHanded');
    const family = normalized.family ?? '';
    if (family === 'armor') return Object.freeze({ stowSeconds: 2, drawSeconds: 3, readySeconds: 1, cumbersome: false });
    if (family === 'accessory') return Object.freeze({ stowSeconds: 1, drawSeconds: 1, readySeconds: 0, cumbersome: false });
    if (family === 'shield') return Object.freeze({ stowSeconds: 1, drawSeconds: 2, readySeconds: 1, cumbersome: false });
    if (twoHanded) return Object.freeze({ stowSeconds: 2, drawSeconds: 3, readySeconds: 2, cumbersome: true });
    if (normalized.weaponCategory || family === 'weapon' || family === 'tool') {
        return Object.freeze({ stowSeconds: 1, drawSeconds: 2, readySeconds: 1, cumbersome: false });
    }
    return Object.freeze({ stowSeconds: 1, drawSeconds: 2, readySeconds: 1, cumbersome: false });
}

export function validatePersistedCombatLoadoutTransition(battle) {
    const value = battle?.loadoutTransition;
    if (value === null) return [];
    if (!value || typeof value !== 'object' || Array.isArray(value)) return ['loadoutTransition must be persisted as null or an object.'];
    const issues = [];
    if (value.version !== COMBAT_LOADOUT_TRANSITION_VERSION) issues.push(`loadoutTransition.version must be ${COMBAT_LOADOUT_TRANSITION_VERSION}.`);
    if (typeof value.actorId !== 'string' || !value.actorId.trim()) issues.push('loadoutTransition.actorId must be a non-empty string.');
    if (typeof value.taskId !== 'string' || !value.taskId.trim()) issues.push('loadoutTransition.taskId must be a non-empty string.');
    if (!['weaponSet', 'fullEquipment'].includes(value.kind)) issues.push('loadoutTransition.kind is invalid.');
    if (!Number.isInteger(value.startedAtWorldSeconds) || value.startedAtWorldSeconds < 0) issues.push('loadoutTransition.startedAtWorldSeconds must be non-negative.');
    if (!Number.isInteger(value.completesAtWorldSeconds) || value.completesAtWorldSeconds < value.startedAtWorldSeconds) issues.push('loadoutTransition.completesAtWorldSeconds is invalid.');
    if (!Number.isInteger(value.durationSeconds) || value.durationSeconds < 1) issues.push('loadoutTransition.durationSeconds must be positive.');
    if (!Number.isInteger(value.recoverySeconds) || value.recoverySeconds < 0) issues.push('loadoutTransition.recoverySeconds must be non-negative.');
    if (typeof value.resetWeaponSequence !== 'boolean') issues.push('loadoutTransition.resetWeaponSequence must be boolean.');
    if (!value.plan || typeof value.plan !== 'object' || Array.isArray(value.plan)) issues.push('loadoutTransition.plan must be an object.');
    else {
        if (!['equip', 'unequip'].includes(value.plan.operation)) issues.push('loadoutTransition.plan.operation is invalid.');
        if (!EQUIPMENT_SLOTS.includes(value.plan.slot)) issues.push('loadoutTransition.plan.slot is invalid.');
        if (typeof value.plan.itemId !== 'string' || !value.plan.itemId.trim()) issues.push('loadoutTransition.plan.itemId must be a non-empty string.');
    }
    return issues;
}

function startTransition(state, battle, plan, incomingItem, outgoingItem) {
    const actor = getBattlePlayer(battle);
    const transitionKind = WEAPON_SLOTS.includes(plan.slot) ? 'weaponSet' : 'fullEquipment';
    if (transitionKind === 'fullEquipment') {
        const pressure = getArmorPressureReport(state, actor.id);
        if (pressure.blocked) {
            const reason = pressure.hostiles.map((entry) => `${entry.enemyId}(${entry.reasons.join('+')})`).join(', ');
            return fail('combat.loadout.armor-pressure', `Armor cannot be changed under active hostile pressure: ${reason}.`);
        }
    }

    const outgoing = getEquipmentHandling(outgoingItem);
    const incoming = getEquipmentHandling(incomingItem);
    const durationSeconds = Math.max(1, outgoing.stowSeconds + incoming.drawSeconds);
    const recoverySeconds = Math.max(outgoing.readySeconds, incoming.readySeconds);
    const now = ensureWorldTimeState(state).totalSeconds;
    const taskResult = startTimedTask(state, {
        kind: COMBAT_LOADOUT_TASK_KIND,
        label: `${plan.operation === 'equip' ? 'Equip' : 'Unequip'} ${plan.itemName}`,
        channel: COMBAT_LOADOUT_TASK_CHANNEL,
        durationSeconds,
        data: {
            battleId: battle.id,
            actorId: actor.id,
            operation: plan.operation,
            slot: plan.slot,
            itemId: plan.itemId,
        },
    });
    if (!taskResult.ok) return taskResult;

    battle.loadoutTransition = {
        version: COMBAT_LOADOUT_TRANSITION_VERSION,
        actorId: actor.id,
        taskId: taskResult.data.task.id,
        kind: transitionKind,
        plan: { ...plan },
        startedAtWorldSeconds: now,
        completesAtWorldSeconds: taskResult.data.task.completesAtWorldSeconds,
        durationSeconds,
        recoverySeconds,
        resetWeaponSequence: transitionKind === 'weaponSet',
    };
    const event = emitSemanticEvent(state, 'combat.loadout.started', {
        battleId: battle.id,
        actorId: actor.id,
        taskId: taskResult.data.task.id,
        operation: plan.operation,
        slot: plan.slot,
        itemId: plan.itemId,
        transitionKind,
        durationSeconds,
        recoverySeconds,
    }, { source: 'combatLoadoutEngine' });
    appendBattleLog(battle, `${actor.identity?.name ?? 'Player'} begins changing ${plan.slot} equipment (${durationSeconds}s).`);

    return actionSuccess({
        action: 'combat.loadout.start',
        code: 'combat.loadout.started',
        outcome: 'active',
        data: {
            transition: { ...battle.loadoutTransition, plan: { ...battle.loadoutTransition.plan } },
            eventId: event.id,
        },
        display: { text: `${plan.itemName}: ${transitionKind === 'weaponSet' ? 'quick weapon-set' : 'full equipment'} transition started; ${durationSeconds}s to change, then ${recoverySeconds}s readying.` },
    });
}

function validateTransitionStart(state, battle) {
    if (battle.loadoutTransition) return fail('combat.loadout.already-active', describeCombatLoadoutBlock(state));
    if (state.abilities?.active) return fail('combat.loadout.ability-active', 'Finish or interrupt the active ability before changing combat equipment.');
    const actor = getBattlePlayer(battle);
    if (!actor) return fail('combat.loadout.no-player', 'No player combatant is available.');
    if (isCombatActorHardDisabled(actor)) return fail('combat.loadout.disabled', 'You cannot change combat equipment while hard-disabled.');
    if (!isCombatantReady(state, actor.id)) return fail('combat.loadout.recovery', 'You must finish current combat recovery before changing equipment.');
    return { ok: true };
}

function applyTransitionPlan(state, plan) {
    if (plan.operation === 'equip') {
        return equipItem(state, plan.itemId, {
            slot: plan.slot,
            fromContainerId: plan.sourceContainerId,
            returnContainerId: plan.returnContainerId,
            allowActiveBattleImmediate: true,
        });
    }
    return unequipItem(state, plan.slot, plan.destinationContainerId, { allowActiveBattleImmediate: true });
}

function transitionPlanApplied(state, plan) {
    const equipped = state.player?.equipment?.[plan.slot] ?? null;
    if (plan.operation === 'unequip') return equipped === null;
    return Boolean(equipped && (equipped.id === plan.itemId || equipped.templateId === plan.itemTemplateId));
}

function syncBattlePlayerEquipment(state) {
    const battlePlayer = getBattlePlayer(state.activeBattle);
    if (!battlePlayer) return;
    battlePlayer.equipment = clonePlain(state.player.equipment ?? {});
    battlePlayer.combat = calculateCombatProfile(state.player);
}

function finishCancellation(state, transition, task, reason) {
    const battle = state.activeBattle;
    const event = emitSemanticEvent(state, 'combat.loadout.cancelled', {
        battleId: battle?.id ?? null,
        actorId: transition.actorId,
        taskId: transition.taskId,
        operation: transition.plan.operation,
        slot: transition.plan.slot,
        itemId: transition.plan.itemId,
        reason: String(reason ?? 'interrupted'),
    }, { source: 'combatLoadoutEngine' });
    if (battle) {
        appendBattleLog(battle, `${transition.plan.itemName} loadout transition is interrupted: ${reason}.`);
        battle.loadoutTransition = null;
    }
    if (task && task.status !== TIMED_TASK_STATUSES.ACTIVE) releaseTimedTask(state, transition.taskId);
    return actionFailure({
        action: 'combat.loadout.reconcile',
        code: 'combat.loadout.cancelled',
        outcome: 'cancelled',
        data: { taskId: transition.taskId, eventId: event.id, reason: String(reason ?? 'interrupted') },
        display: { text: `Equipment change cancelled: ${reason}.` },
    });
}

function activeBattle(state) {
    return state?.activeBattle?.phase === 'active' ? state.activeBattle : null;
}

function getBattlePlayer(battle) {
    return battle?.combatants?.find((entry) => entry.type === 'player') ?? null;
}

function fail(code, text) {
    return actionFailure({
        action: 'combat.loadout',
        code,
        outcome: 'rejected',
        data: {},
        display: { text },
    });
}

function sameShallowMap(left, right) {
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    return leftKeys.length === rightKeys.length && leftKeys.every((key) => right[key] === left[key]);
}

function clonePlain(value) {
    if (Array.isArray(value)) return value.map(clonePlain);
    if (!value || typeof value !== 'object') return value;
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, clonePlain(child)]));
}
