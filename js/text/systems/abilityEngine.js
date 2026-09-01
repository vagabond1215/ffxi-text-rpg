import { findAbility, getAbility, getSpellSchool, listAbilities } from '../data/abilities.js';
import { getPlace } from '../data/places.js';
import { actionFailure, actionSuccess, describeActionResult } from './actionResult.js';
import { canUseCapability, knowsCapability } from './capabilityEngine.js';
import { appendBattleLog } from './battleEngine.js';
import { finalizeCombatState, getCombatantReadyAt, isCombatantReady, recordCombatAction, resolveEnemyResponse } from './combatTurnEngine.js';
import { resolveCombatDamage, resolveCombatStatus } from './combatResolutionEngine.js';
import { createCombatField } from './combatFieldEngine.js';
import { getCombatFormationPosition, resolveCombatGeometryTargets } from './combatGeometryEngine.js';
import { describeCombatLoadoutBlock, isCombatLoadoutTransitionActive } from './combatLoadoutEngine.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import { calculateCombatProfile } from './statEngine.js';
import { applyStatus } from './statusEngine.js';
import {
    cancelTimedTask,
    findTimedTask,
    reconcileTimedTasks,
    releaseTimedTask,
    startTimedTask,
    TIMED_TASK_STATUSES,
} from './timedTaskEngine.js';
import { ensureWorldTimeState } from './worldTimeEngine.js';

export const ABILITY_RUNTIME_STATE_VERSION = 1;
export const ABILITY_TASK_KIND = 'ability.activation';
export const ABILITY_TASK_CHANNEL = 'ability';
export const ABILITY_INTERRUPT_PRIORITY = 550;

export function createAbilityRuntimeState() {
    return {
        version: ABILITY_RUNTIME_STATE_VERSION,
        cooldowns: {},
        active: null,
    };
}

export function ensureAbilityRuntimeState(state) {
    if (!state || typeof state !== 'object') throw new Error('Ability runtime requires game state.');
    if (!state.abilities || typeof state.abilities !== 'object' || Array.isArray(state.abilities)) {
        state.abilities = createAbilityRuntimeState();
        return state.abilities;
    }
    if (state.abilities.version !== ABILITY_RUNTIME_STATE_VERSION) {
        state.abilities = createAbilityRuntimeState();
        return state.abilities;
    }
    if (!state.abilities.cooldowns || typeof state.abilities.cooldowns !== 'object' || Array.isArray(state.abilities.cooldowns)) {
        state.abilities.cooldowns = {};
    }
    if (state.abilities.active !== null && (typeof state.abilities.active !== 'object' || Array.isArray(state.abilities.active))) {
        state.abilities.active = null;
    }
    return state.abilities;
}

export function canActivateAbility(state, abilityQuery, options = {}) {
    const ability = resolveAbility(abilityQuery);
    if (!ability) return failure('ability.unknown', { abilityQuery }, `Unknown ability: ${String(abilityQuery ?? '')}.`);
    if (!state?.player) return failure('ability.no-player', { abilityId: ability.id }, 'No player is available to use abilities.');

    const runtime = ensureAbilityRuntimeState(state);
    if (isCombatLoadoutTransitionActive(state)) {
        return failure('ability.loadout-transition', { abilityId: ability.id }, describeCombatLoadoutBlock(state));
    }
    if (runtime.active) {
        return failure('ability.already-activating', { abilityId: ability.id, active: snapshotActivation(runtime.active) }, 'Another ability is already being activated.');
    }

    const contextType = getAbilityContext(state);
    if (!ability.contexts.includes(contextType)) {
        return failure('ability.invalid-context', { abilityId: ability.id, contextType, allowedContexts: [...ability.contexts] }, `${ability.name} cannot be used in ${contextType}.`);
    }

    const now = ensureWorldTimeState(state).totalSeconds;
    const readyAtWorldSeconds = Number(runtime.cooldowns[ability.id]) || 0;
    if (readyAtWorldSeconds > now) {
        return failure('ability.cooldown', {
            abilityId: ability.id,
            readyAtWorldSeconds,
            remainingSeconds: readyAtWorldSeconds - now,
        }, `${ability.name} is recovering for ${readyAtWorldSeconds - now}s.`);
    }

    const caster = getPlayerActor(state, contextType);
    if (contextType === 'combat' && caster?.id && !isCombatantReady(state, caster.id)) {
        const readyAtWorldSeconds = getCombatantReadyAt(state, caster.id);
        return failure('ability.action-recovery', {
            abilityId: ability.id,
            readyAtWorldSeconds,
            remainingSeconds: Math.max(1, readyAtWorldSeconds - now),
        }, `${ability.name} cannot be used while you are recovering for ${Math.max(1, readyAtWorldSeconds - now)}s.`);
    }
    const capabilityResult = canUseCapability(state.player, ability.capabilityId, {
        type: contextType,
        resources: caster?.resources ?? state.player.resources,
        toolTags: options.toolTags,
        preparationTags: options.preparationTags,
        flags: options.flags,
    });
    if (!capabilityResult.ok) {
        return failure('ability.capability-requirement', {
            abilityId: ability.id,
            capabilityId: ability.capabilityId,
            requirementCode: capabilityResult.code,
            requirement: capabilityResult,
        }, capabilityResult.reason ?? `${ability.name} cannot currently be used.`);
    }

    const target = resolveTarget(state, ability, options.targetQuery);
    if (!target.ok) return target;

    for (const [resourceId, amount] of Object.entries(ability.costs)) {
        const available = Math.max(0, Number(caster?.resources?.[resourceId]) || 0);
        if (available < amount) {
            return failure('ability.resource-cost', { abilityId: ability.id, resourceId, required: amount, available }, `${ability.name} requires ${amount} ${resourceId.toUpperCase()}; available ${available}.`);
        }
    }

    return actionSuccess({
        action: 'ability.check',
        code: 'ability.available',
        outcome: 'available',
        data: {
            abilityId: ability.id,
            capabilityId: ability.capabilityId,
            contextType,
            target: target.target,
            costs: { ...ability.costs },
            readyAtWorldSeconds,
        },
        display: { text: `${ability.name} is ready.` },
    });
}

export function activateAbility(state, abilityQuery, options = {}) {
    const ability = resolveAbility(abilityQuery);
    if (!ability) return failure('ability.unknown', { abilityQuery }, `Unknown ability: ${String(abilityQuery ?? '')}.`);
    const check = canActivateAbility(state, ability.id, options);
    if (!check.ok) return check;

    const runtime = ensureAbilityRuntimeState(state);
    const contextType = check.data.contextType;
    const caster = getPlayerActor(state, contextType);
    const now = ensureWorldTimeState(state).totalSeconds;
    const activation = {
        abilityId: ability.id,
        capabilityId: ability.capabilityId,
        taskId: null,
        contextType,
        target: { ...check.data.target },
        costs: { ...ability.costs },
        startedAtWorldSeconds: now,
        completesAtWorldSeconds: now + ability.activation.durationSeconds,
        interruptible: ability.activation.interruptible,
    };

    if (ability.activation.durationSeconds > 0) {
        const taskResult = startTimedTask(state, {
            kind: ABILITY_TASK_KIND,
            label: ability.name,
            channel: ABILITY_TASK_CHANNEL,
            durationSeconds: ability.activation.durationSeconds,
            data: {
                abilityId: ability.id,
                capabilityId: ability.capabilityId,
                contextType,
                target: { ...activation.target },
            },
        });
        if (!taskResult.ok) return taskResult;
        activation.taskId = taskResult.data.task.id;
        activation.completesAtWorldSeconds = taskResult.data.task.completesAtWorldSeconds;
    }

    spendCosts(caster, ability.costs);
    syncPlayerActor(state, caster, contextType);
    const event = emitSemanticEvent(state, 'ability.started', activationEventData(activation), { source: 'abilityEngine' });

    if (ability.activation.durationSeconds === 0) {
        return resolveActivation(state, activation, ability, event.id);
    }

    runtime.active = activation;
    return actionSuccess({
        action: 'ability.activate',
        code: 'ability.started',
        outcome: 'activating',
        data: {
            abilityId: ability.id,
            capabilityId: ability.capabilityId,
            activation: snapshotActivation(activation),
            eventId: event.id,
        },
        display: { text: `${ability.name} begins; activation completes in ${ability.activation.durationSeconds}s.` },
    });
}

export function reconcileAbilityActivation(state) {
    const runtime = ensureAbilityRuntimeState(state);
    const active = runtime.active;
    if (!active) return null;

    reconcileTimedTasks(state);
    const now = ensureWorldTimeState(state).totalSeconds;
    const task = active.taskId ? findTimedTask(state, active.taskId) : null;
    if (now < active.completesAtWorldSeconds && task?.status !== TIMED_TASK_STATUSES.COMPLETED) return null;

    const ability = getAbility(active.abilityId);
    if (!ability) {
        runtime.active = null;
        releaseAbilityTask(state, active.taskId);
        return failure('ability.missing-definition', { activation: snapshotActivation(active) }, `Active ability definition is missing: ${active.abilityId}.`);
    }
    return resolveActivation(state, active, ability, null);
}

export function interruptActiveAbility(state, reason = 'interrupted') {
    const runtime = ensureAbilityRuntimeState(state);
    const active = runtime.active;
    if (!active) return failure('ability.no-active-activation', {}, 'No ability is currently being activated.');
    if (!active.interruptible) return failure('ability.not-interruptible', { activation: snapshotActivation(active) }, 'The active ability cannot be interrupted.');

    if (active.taskId) {
        const task = findTimedTask(state, active.taskId);
        if (task?.status === TIMED_TASK_STATUSES.ACTIVE) cancelTimedTask(state, active.taskId);
    }
    runtime.active = null;
    const event = emitSemanticEvent(state, 'ability.interrupted', {
        ...activationEventData(active),
        reason: String(reason ?? 'interrupted'),
        costsRetained: true,
    }, { source: 'abilityEngine' });
    const ability = getAbility(active.abilityId);
    releaseAbilityTask(state, active.taskId);
    return actionSuccess({
        action: 'ability.interrupt',
        code: 'ability.interrupted',
        outcome: 'interrupted',
        data: { abilityId: active.abilityId, activation: snapshotActivation(active), eventId: event.id, costsRetained: true },
        display: { text: `${ability?.name ?? active.abilityId} was interrupted. Spent resources are not refunded.` },
    });
}

export function provideAbilityInterrupts({ state, nowWorldSeconds, horizonWorldSeconds }) {
    const active = ensureAbilityRuntimeState(state).active;
    if (!active) return [];
    if (active.completesAtWorldSeconds < nowWorldSeconds || active.completesAtWorldSeconds > horizonWorldSeconds) return [];
    return [{
        id: `ability-completion:${active.taskId ?? active.abilityId}`,
        type: 'ability.activation-complete',
        atWorldSeconds: active.completesAtWorldSeconds,
        priority: ABILITY_INTERRUPT_PRIORITY,
        source: 'abilityEngine',
        data: { abilityId: active.abilityId, capabilityId: active.capabilityId, taskId: active.taskId },
    }];
}

export function listAbilityAvailability(state) {
    const contextType = getAbilityContext(state);
    return listAbilities().map((ability) => {
        const known = knowsCapability(state?.player, ability.capabilityId);
        const check = canActivateAbilityForList(state, ability, contextType);
        return Object.freeze({
            ability,
            school: ability.schoolId ? getSpellSchool(ability.schoolId) : null,
            known,
            available: check.ok,
            code: check.code,
            reason: check.reason,
            cooldownRemainingSeconds: check.cooldownRemainingSeconds,
        });
    });
}

export function describeAbilities(state) {
    const entries = listAbilityAvailability(state);
    return [
        'Canonical abilities:',
        ...entries.map((entry) => {
            const school = entry.school ? ` · ${entry.school.name}` : '';
            const stateText = entry.available ? 'ready' : entry.known ? entry.reason : 'not learned';
            return `- ${entry.ability.name} [${entry.ability.kind}${school}] ${stateText}; cost=${formatCosts(entry.ability.costs)}, activation=${entry.ability.activation.durationSeconds}s, recovery=${entry.ability.recoverySeconds}s, cooldown=${entry.ability.cooldownSeconds}s`;
        }),
    ].join('\n');
}

export function validateAbilityRuntimeState(abilityState) {
    if (!abilityState || typeof abilityState !== 'object' || Array.isArray(abilityState)) return ['abilities must be an object.'];
    const issues = [];
    if (abilityState.version !== ABILITY_RUNTIME_STATE_VERSION) issues.push(`abilities.version must be ${ABILITY_RUNTIME_STATE_VERSION}.`);
    if (!abilityState.cooldowns || typeof abilityState.cooldowns !== 'object' || Array.isArray(abilityState.cooldowns)) return [...issues, 'abilities.cooldowns must be an object.'];
    for (const [abilityId, readyAt] of Object.entries(abilityState.cooldowns)) {
        if (!getAbility(abilityId)) issues.push(`abilities.cooldowns references unknown ability ${abilityId}.`);
        if (!nonNegativeInteger(readyAt)) issues.push(`abilities.cooldowns.${abilityId} must be a non-negative integer.`);
    }
    if (abilityState.active !== null) {
        const active = abilityState.active;
        if (!active || typeof active !== 'object' || Array.isArray(active)) return [...issues, 'abilities.active must be null or an object.'];
        const ability = getAbility(active.abilityId);
        if (!ability) issues.push(`abilities.active references unknown ability ${active.abilityId}.`);
        if (ability && active.capabilityId !== ability.capabilityId) issues.push('abilities.active.capabilityId does not match the ability definition.');
        if (active.taskId !== null && !/^task-\d{6,}$/.test(active.taskId ?? '')) issues.push('abilities.active.taskId is invalid.');
        if (!nonNegativeInteger(active.startedAtWorldSeconds)) issues.push('abilities.active.startedAtWorldSeconds is invalid.');
        if (!nonNegativeInteger(active.completesAtWorldSeconds)) issues.push('abilities.active.completesAtWorldSeconds is invalid.');
        if (nonNegativeInteger(active.startedAtWorldSeconds) && nonNegativeInteger(active.completesAtWorldSeconds)
            && active.completesAtWorldSeconds < active.startedAtWorldSeconds) issues.push('abilities.active completes before it starts.');
    }
    return issues;
}

function resolveActivation(state, activation, ability, startEventId = null) {
    const runtime = ensureAbilityRuntimeState(state);
    const effectResults = [];
    const actor = getPlayerActor(state, activation.contextType);
    const target = getStoredTarget(state, activation.target);
    const targeting = resolveAbilityTargeting(state, ability, actor, target);

    for (const effect of ability.effects) {
        if (effect.recipient === 'target' && ability.target?.geometry) {
            if (!targeting.targets.length) {
                effectResults.push(applyAbilityEffect(state, ability, activation, effect, actor, null));
            } else {
                for (const recipient of targeting.targets) {
                    effectResults.push(applyAbilityEffect(state, ability, activation, effect, actor, recipient));
                }
            }
        } else {
            effectResults.push(applyAbilityEffect(state, ability, activation, effect, actor, target));
        }
    }

    if (activation.contextType === 'combat') {
        updateBattlePhase(state.activeBattle);
        syncPlayerActor(state, actor, 'combat');
    }

    const now = ensureWorldTimeState(state).totalSeconds;
    const cooldownReadyAtWorldSeconds = now + ability.cooldownSeconds;
    runtime.cooldowns[ability.id] = cooldownReadyAtWorldSeconds;
    runtime.active = null;
    const event = emitSemanticEvent(state, 'ability.resolved', {
        ...activationEventData(activation),
        cooldownReadyAtWorldSeconds,
        geometry: targeting.geometry,
        effects: effectResults.map((entry) => ({ ...entry })),
    }, { source: 'abilityEngine' });

    let combatAction = null;
    let enemyResponse = null;
    if (activation.contextType === 'combat') {
        combatAction = recordCombatAction(state, {
            actorId: actor?.id ?? state.player?.id ?? null,
            actorType: 'player',
            targetId: target?.id ?? actor?.id ?? null,
            kind: 'ability',
            sourceId: ability.id,
            outcome: effectResults.some((entry) => entry.type === 'damage' && entry.applied === false || entry.type === 'status' && entry.applied === false) && !effectResults.some((entry) => entry.applied === true) ? 'resisted' : 'resolved',
            recoverySeconds: ability.recoverySeconds,
            data: {
                abilityId: ability.id,
                capabilityId: ability.capabilityId,
                geometry: targeting.geometry,
                ...(targeting.geometry ? { attention: { mode: 'per-recipient' } } : {}),
                effects: effectResults.map((entry) => ({ ...entry })),
            },
        });
        finalizeCombatState(state);
        if (state.activeBattle?.phase === 'active') {
            enemyResponse = resolveEnemyResponse(state, { triggerActionId: combatAction?.id ?? null });
        }
    }

    releaseAbilityTask(state, activation.taskId);
    return actionSuccess({
        action: 'ability.activate',
        code: 'ability.resolved',
        outcome: 'resolved',
        data: {
            abilityId: ability.id,
            capabilityId: ability.capabilityId,
            activation: snapshotActivation(activation),
            geometry: targeting.geometry,
            effects: effectResults,
            startEventId,
            eventId: event.id,
            cooldownReadyAtWorldSeconds,
            combatActionId: combatAction?.id ?? null,
            enemyResponseActionIds: enemyResponse?.actions?.map((entry) => entry.id) ?? [],
        },
        display: { text: describeResolution(ability, effectResults) },
    });
}

function resolveAbilityTargeting(state, ability, actor, target) {
    if (!ability.target?.geometry || !state.activeBattle || !actor?.id || !target?.id) {
        return { targets: target ? [target] : [], geometry: null };
    }
    const resolved = resolveCombatGeometryTargets(state.activeBattle, {
        actorId: actor.id,
        primaryTargetId: target.id,
        geometry: ability.target.geometry,
    });
    return {
        targets: [...resolved.targets],
        geometry: resolved.evidence,
    };
}

function applyAbilityEffect(state, ability, activation, effect, actor, target) {
    const recipient = effect.recipient === 'self' ? actor : effect.recipient === 'target' ? target : null;
    const combat = actor?.combat ?? calculateCombatProfile(state.player);
    const scaleValue = Number(combat?.attributes?.[effect.stat]) || 0;

    if (effect.type === 'damage') {
        if (!recipient?.resources) return { type: 'damage', applied: false, reason: 'missing-target' };
        if (effect.resolution) {
            const resolution = resolveCombatDamage(actor, recipient, effect, { rng: state.activeBattle?.rng ?? Math.random });
            if (!resolution.hit) {
                if (state.activeBattle) appendBattleLog(state.activeBattle, `${recipient.identity?.name ?? 'The target'} avoids ${ability.name}.`);
                return {
                    type: 'damage',
                    applied: false,
                    reason: 'miss',
                    recipientId: recipient.id ?? null,
                    amount: 0,
                    resolution,
                };
            }
            const before = Math.max(0, Number(recipient.resources.hp) || 0);
            recipient.resources.hp = Math.max(0, before - resolution.damage);
            if (recipient.resources.hp <= 0 && recipient.battle) recipient.battle.defeated = true;
            if (state.activeBattle) appendBattleLog(state.activeBattle, `${ability.name} deals ${resolution.damage} damage to ${recipient.identity?.name ?? 'the target'}${resolution.critical ? ' (critical)' : ''}.`);
            return {
                type: 'damage',
                applied: true,
                recipientId: recipient.id ?? null,
                amount: resolution.damage,
                before,
                after: recipient.resources.hp,
                resolution,
            };
        }
        const amount = Math.max(0, Math.floor(effect.base + scaleValue * effect.coefficient));
        const before = Math.max(0, Number(recipient.resources.hp) || 0);
        recipient.resources.hp = Math.max(0, before - amount);
        if (recipient.resources.hp <= 0 && recipient.battle) recipient.battle.defeated = true;
        if (state.activeBattle) appendBattleLog(state.activeBattle, `${ability.name} deals ${amount} damage to ${recipient.identity?.name ?? 'the target'}.`);
        return { type: 'damage', applied: true, recipientId: recipient.id ?? null, amount, before, after: recipient.resources.hp };
    }

    if (effect.type === 'heal') {
        if (!recipient?.resources) return { type: 'heal', applied: false, reason: 'missing-target' };
        const profile = recipient.combat ?? calculateCombatProfile(recipient);
        const maxHp = Math.max(0, Number(profile?.resources?.maxHp) || 0);
        const amount = Math.max(0, Math.floor(effect.base + scaleValue * effect.coefficient));
        const before = Math.max(0, Number(recipient.resources.hp) || 0);
        recipient.resources.hp = Math.min(maxHp, before + amount);
        const restored = recipient.resources.hp - before;
        if (state.activeBattle) appendBattleLog(state.activeBattle, `${ability.name} restores ${restored} HP to ${recipient.identity?.name ?? 'the target'}.`);
        return { type: 'heal', applied: true, recipientId: recipient.id ?? null, amount: restored, requestedAmount: amount, before, after: recipient.resources.hp };
    }

    if (effect.type === 'status') {
        if (!recipient) return { type: 'status', applied: false, reason: 'missing-target' };
        let resolution = null;
        if (effect.resolution && effect.recipient === 'target') {
            resolution = resolveCombatStatus(actor, recipient, effect.resolution, { rng: state.activeBattle?.rng ?? Math.random });
            if (!resolution.landed) {
                if (state.activeBattle) appendBattleLog(state.activeBattle, `${recipient.identity?.name ?? 'The target'} resists ${effect.status.name}.`);
                return {
                    type: 'status',
                    applied: false,
                    reason: 'resisted',
                    recipientId: recipient.id ?? null,
                    statusId: effect.status.id,
                    durationSeconds: effect.status.durationSeconds,
                    resolution,
                };
            }
        }
        applyStatus(recipient, { ...effect.status, sourceId: ability.id }, { nowWorldSeconds: ensureWorldTimeState(state).totalSeconds });
        if (state.activeBattle) appendBattleLog(state.activeBattle, `${recipient.identity?.name ?? 'The target'} gains ${effect.status.name}.`);
        return { type: 'status', applied: true, recipientId: recipient.id ?? null, statusId: effect.status.id, durationSeconds: effect.status.durationSeconds, resolution };
    }

    if (effect.type === 'field') {
        if (!state.activeBattle || activation.contextType !== 'combat' || !recipient?.id || !actor?.id || !effect.field) {
            return { type: 'field', applied: false, reason: 'missing-field-context' };
        }
        const centerPosition = getCombatFormationPosition(state.activeBattle, recipient.id);
        const created = createCombatField(state.activeBattle, {
            sourceActorId: actor.id,
            sourceAbilityId: ability.id,
            centerTargetId: recipient.id,
            centerPosition,
            fieldDefinition: effect.field,
            fieldName: ability.name,
            nowWorldSeconds: ensureWorldTimeState(state).totalSeconds,
        });
        if (!created.ok) return { type: 'field', applied: false, reason: created.code };
        return {
            type: 'field',
            applied: true,
            fieldId: created.field.id,
            sourceActorId: created.field.sourceActorId,
            centerTargetId: created.field.centerTargetId,
            centerPosition: { ...created.field.centerPosition },
            createdAtWorldSeconds: created.field.createdAtWorldSeconds,
            expiresAtWorldSeconds: created.field.expiresAtWorldSeconds,
            pulseSeconds: created.field.pulseSeconds,
            nextPulseAtWorldSeconds: created.field.nextPulseAtWorldSeconds,
            geometry: { ...created.field.geometry },
            sourceSnapshot: { ...created.field.sourceSnapshot },
        };
    }

    if (effect.type === 'context' && effect.operation === 'survey-current-place') {
        const place = getPlace(state.currentPlaceId);
        const visited = state.atlas?.[state.currentPlaceId]?.visited ?? {};
        return {
            type: 'context',
            applied: true,
            operation: effect.operation,
            placeId: state.currentPlaceId ?? null,
            placeName: place?.name ?? state.location ?? null,
            coordinate: state.position ? { ...state.position } : null,
            knownCoordinateCount: Object.keys(visited).length,
        };
    }

    return { type: effect.type, applied: false, reason: 'unsupported-effect' };
}

function canActivateAbilityForList(state, ability, contextType) {
    if (!state?.player) return { ok: false, code: 'no-player', reason: 'No player.' };
    const runtime = ensureAbilityRuntimeState(state);
    if (!knowsCapability(state.player, ability.capabilityId)) return { ok: false, code: 'not-learned', reason: 'Not learned.', cooldownRemainingSeconds: 0 };
    if (!ability.contexts.includes(contextType)) return { ok: false, code: 'invalid-context', reason: `Unavailable in ${contextType}.`, cooldownRemainingSeconds: 0 };
    if (runtime.active) return { ok: false, code: 'already-activating', reason: 'Another ability is activating.', cooldownRemainingSeconds: 0 };
    const now = ensureWorldTimeState(state).totalSeconds;
    const readyAt = Number(runtime.cooldowns[ability.id]) || 0;
    if (readyAt > now) return { ok: false, code: 'cooldown', reason: `Recovering ${readyAt - now}s.`, cooldownRemainingSeconds: readyAt - now };
    const actor = getPlayerActor(state, contextType);
    if (contextType === 'combat' && actor?.id && !isCombatantReady(state, actor.id)) {
        const now = ensureWorldTimeState(state).totalSeconds;
        const readyAt = getCombatantReadyAt(state, actor.id);
        return { ok: false, code: 'action-recovery', reason: `Recovering ${Math.max(1, readyAt - now)}s.`, cooldownRemainingSeconds: 0 };
    }
    const capability = canUseCapability(state.player, ability.capabilityId, { type: contextType, resources: actor?.resources ?? state.player.resources });
    if (!capability.ok) return { ok: false, code: capability.code, reason: capability.reason, cooldownRemainingSeconds: 0 };
    for (const [resourceId, amount] of Object.entries(ability.costs)) {
        if ((Number(actor?.resources?.[resourceId]) || 0) < amount) return { ok: false, code: 'resource-cost', reason: `Needs ${amount} ${resourceId.toUpperCase()}.`, cooldownRemainingSeconds: 0 };
    }
    return { ok: true, code: 'ready', reason: 'Ready.', cooldownRemainingSeconds: 0 };
}

function resolveTarget(state, ability, targetQuery) {
    if (ability.target.kind === 'context') return { ok: true, target: { kind: 'context', id: null } };
    if (ability.target.kind === 'self') {
        const actor = getPlayerActor(state, getAbilityContext(state));
        return { ok: true, target: { kind: 'self', id: actor?.id ?? state.player?.id ?? null } };
    }
    if (ability.target.kind === 'enemy') {
        const battle = state.activeBattle;
        if (!battle || battle.phase !== 'active') return failure('ability.target-required', { abilityId: ability.id }, `${ability.name} requires an active enemy target.`);
        const enemies = battle.combatants.filter((combatant) => combatant.type === 'enemy' && !combatant.battle?.defeated);
        const normalized = normalize(targetQuery);
        const target = normalized
            ? enemies.find((entry) => normalize(entry.id).includes(normalized) || normalize(entry.identity?.name).includes(normalized)) ?? enemies[0]
            : enemies[0];
        if (!target) return failure('ability.target-required', { abilityId: ability.id }, 'No valid enemy target is available.');
        return { ok: true, target: { kind: 'enemy', id: target.id } };
    }
    return failure('ability.target-invalid', { abilityId: ability.id }, `${ability.name} has an unsupported target contract.`);
}

function getStoredTarget(state, target) {
    if (target?.kind === 'context') return null;
    if (target?.kind === 'self') return getPlayerActor(state, getAbilityContext(state));
    if (target?.kind === 'enemy') return state.activeBattle?.combatants?.find((entry) => entry.id === target.id) ?? null;
    return null;
}

function getPlayerActor(state, contextType) {
    if (contextType === 'combat' && state.activeBattle?.phase === 'active') {
        return state.activeBattle.combatants.find((combatant) => combatant.type === 'player') ?? state.player;
    }
    return state.player;
}

function syncPlayerActor(state, actor, contextType) {
    if (!actor || contextType !== 'combat' || actor === state.player) return;
    state.player.resources = { ...actor.resources };
    state.player.statuses = (actor.statuses ?? []).map((status) => ({ ...status, modifiers: { ...(status.modifiers ?? {}) }, flags: { ...(status.flags ?? {}) } }));
}

function spendCosts(actor, costs) {
    if (!actor?.resources) return;
    for (const [resourceId, amount] of Object.entries(costs)) {
        actor.resources[resourceId] = Math.max(0, (Number(actor.resources[resourceId]) || 0) - amount);
    }
}

function updateBattlePhase(battle) {
    if (!battle) return;
    const playersAlive = battle.combatants.some((combatant) => combatant.type === 'player' && !combatant.battle?.defeated && combatant.resources.hp > 0);
    const enemiesAlive = battle.combatants.some((combatant) => combatant.type === 'enemy' && !combatant.battle?.defeated && combatant.resources.hp > 0);
    if (!playersAlive) battle.phase = 'defeat';
    else if (!enemiesAlive) battle.phase = 'victory';
}

function getAbilityContext(state) {
    return state.activeBattle?.phase === 'active' ? 'combat' : 'exploration';
}

function resolveAbility(query) {
    if (query && typeof query === 'object' && query.id) return getAbility(query.id);
    return findAbility(query);
}

function releaseAbilityTask(state, taskId) {
    const task = findTimedTask(state, taskId);
    if (!task || task.status === TIMED_TASK_STATUSES.ACTIVE) return false;
    const released = releaseTimedTask(state, task.id);
    if (!released.ok) throw new Error(`Terminal ability task ${task.id} could not be released: ${released.code}`);
    return true;
}

function activationEventData(activation) {
    return {
        abilityId: activation.abilityId,
        capabilityId: activation.capabilityId,
        taskId: activation.taskId,
        contextType: activation.contextType,
        target: { ...activation.target },
        costs: { ...activation.costs },
        startedAtWorldSeconds: activation.startedAtWorldSeconds,
        completesAtWorldSeconds: activation.completesAtWorldSeconds,
        interruptible: activation.interruptible,
    };
}

function snapshotActivation(active) {
    return Object.freeze({
        ...active,
        target: Object.freeze({ ...(active.target ?? {}) }),
        costs: Object.freeze({ ...(active.costs ?? {}) }),
    });
}

function describeResolution(ability, effects) {
    const damageEffects = effects.filter((effect) => effect.type === 'damage');
    if (damageEffects.length > 1) {
        const hits = damageEffects.filter((effect) => effect.applied);
        const totalDamage = hits.reduce((sum, effect) => sum + (Number(effect.amount) || 0), 0);
        return `${ability.name} resolves across ${damageEffects.length} targets: ${hits.length} hit, ${totalDamage} total damage.`;
    }
    const parts = effects.filter((effect) => effect.applied).map((effect) => {
        if (effect.type === 'damage') return `${effect.amount} damage`;
        if (effect.type === 'heal') return `${effect.amount} HP restored`;
        if (effect.type === 'status') return effect.statusId;
        if (effect.type === 'field') return `field ${effect.fieldId} established`;
        if (effect.type === 'context') return `${effect.placeName ?? effect.placeId} surveyed`;
        return effect.type;
    });
    return `${ability.name} resolves${parts.length ? `: ${parts.join(', ')}` : ''}.`;
}

function formatCosts(costs) {
    const entries = Object.entries(costs);
    return entries.length ? entries.map(([key, value]) => `${value} ${key.toUpperCase()}`).join('+') : 'none';
}

function failure(code, data, text) {
    return actionFailure({ action: 'ability.activate', code, outcome: 'rejected', data, display: { text } });
}
function normalize(value) { return String(value ?? '').trim().toLowerCase().replace(/\s+/g, '-'); }
function nonNegativeInteger(value) { return Number.isInteger(value) && value >= 0; }
