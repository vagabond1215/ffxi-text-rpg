import {
    ensureAbilityRuntimeState,
    interruptActiveAbility,
    provideAbilityInterrupts,
    reconcileAbilityActivation,
} from './abilityEngine.js';
import { updateBattlePhase } from './battleEngine.js';
import { provideCombatFieldInterrupts, resolveCombatFieldPulse } from './combatFieldEngine.js';
import { COMBAT_LOADOUT_TASK_KIND, interruptCombatLoadoutIfHardDisabled, reconcileCombatLoadoutTransition } from './combatLoadoutEngine.js';
import {
    finalizeCombatState,
    provideCombatInterrupts,
    reconcileCombatStatuses,
    recordCombatAction,
    resolveEnemyReadyAction,
} from './combatTurnEngine.js';
import { advanceSimulationUntilInterrupt } from './simulationInterruptEngine.js';
import { ensureWorldTimeState } from './worldTimeEngine.js';

export function advanceCombatSimulation(state, requestedSeconds) {
    const battle = state?.activeBattle;
    if (!battle || battle.phase !== 'active') {
        return { ok: false, code: 'combat.not-active', secondsAdvanced: 0, message: 'No active battle is using combat time.' };
    }

    const seconds = Math.max(0, Math.floor(Number(requestedSeconds) || 0));
    const result = advanceSimulationUntilInterrupt(state, seconds, {
        providers: [provideCombatFieldInterrupts, provideCombatInterrupts, provideAbilityInterrupts],
    });
    reconcileCombatStatuses(state);

    let enemyResult = null;
    let fieldResult = null;
    let fieldAction = null;
    let abilityResult = null;
    let abilityInterrupt = null;
    let loadoutResult = null;
    const interrupt = result.data?.interrupt ?? null;

    if (interrupt?.type === 'combat.field-pulse') {
        fieldResult = resolveCombatFieldPulse(state.activeBattle, interrupt.data.fieldId, {
            nowWorldSeconds: ensureWorldTimeState(state).totalSeconds,
        });
        if (fieldResult.ok) {
            const source = state.activeBattle?.combatants?.find((combatant) => combatant.id === fieldResult.sourceActorId) ?? null;
            fieldAction = recordCombatAction(state, {
                actorId: fieldResult.sourceActorId,
                actorType: source?.type ?? 'player',
                targetId: fieldResult.centerTargetId,
                kind: 'fieldPulse',
                sourceId: fieldResult.sourceAbilityId,
                outcome: fieldResult.effects.some((effect) => effect.applied) ? 'resolved' : 'no-effect',
                data: {
                    fieldId: fieldResult.fieldId,
                    pulseSequence: fieldResult.pulseSequence,
                    scheduledAtWorldSeconds: fieldResult.scheduledAtWorldSeconds,
                    resolvedAtWorldSeconds: fieldResult.resolvedAtWorldSeconds,
                    ended: fieldResult.ended,
                    geometry: fieldResult.geometry,
                    attention: { mode: 'per-recipient' },
                    effects: fieldResult.effects,
                },
            });
            updateBattlePhase(state.activeBattle);
        }
        abilityResult = reconcileAbilityActivation(state);
    } else if (interrupt?.type === 'combat.enemy-ready') {
        enemyResult = resolveEnemyReadyAction(state, interrupt.data.enemyId);
        const active = ensureAbilityRuntimeState(state).active;
        if (enemyResult?.resolution?.hit && active?.interruptible && state.activeBattle?.phase === 'active') {
            abilityInterrupt = interruptActiveAbility(state, `hit by ${enemyResult.action?.sourceId ?? 'enemy action'}`);
        }
        loadoutResult = interruptCombatLoadoutIfHardDisabled(state);
    } else if (interrupt?.type === 'task.completed' && interrupt.data?.kind === COMBAT_LOADOUT_TASK_KIND) {
        loadoutResult = reconcileCombatLoadoutTransition(state);
    } else if (interrupt?.type === 'ability.activation-complete' || interrupt?.type === 'task.completed') {
        abilityResult = reconcileAbilityActivation(state);
    } else if (!result.data?.interrupted) {
        abilityResult = reconcileAbilityActivation(state);
    }

    finalizeCombatState(state);
    const advanced = Number(result.data?.secondsAdvanced) || 0;
    const lines = [`Advanced combat time ${advanced}s.`];
    if (enemyResult?.action) lines.push(`Enemy action: ${enemyResult.action.kind}${enemyResult.action.sourceId ? ` (${enemyResult.action.sourceId})` : ''}.`);
    if (fieldAction) lines.push(`Field pulse: ${fieldAction.sourceId ?? fieldAction.id}.`);
    if (abilityInterrupt?.message) lines.push(abilityInterrupt.message);
    if (abilityResult?.message) lines.push(abilityResult.message);
    if (loadoutResult?.display?.text || loadoutResult?.message) lines.push(loadoutResult.display?.text ?? loadoutResult.message);

    return {
        ok: true,
        code: result.data?.interrupted ? 'combat.interrupted' : 'combat.advance-complete',
        secondsAdvanced: advanced,
        nowWorldSeconds: ensureWorldTimeState(state).totalSeconds,
        interrupt,
        enemyResult,
        fieldResult,
        fieldAction,
        abilityResult,
        abilityInterrupt,
        loadoutResult,
        message: lines.join('\n'),
    };
}
