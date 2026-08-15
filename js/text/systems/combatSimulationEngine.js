import {
    ensureAbilityRuntimeState,
    interruptActiveAbility,
    provideAbilityInterrupts,
    reconcileAbilityActivation,
} from './abilityEngine.js';
import {
    finalizeCombatState,
    provideCombatInterrupts,
    reconcileCombatStatuses,
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
        providers: [provideCombatInterrupts, provideAbilityInterrupts],
    });
    reconcileCombatStatuses(state);

    let enemyResult = null;
    let abilityResult = null;
    let abilityInterrupt = null;
    const interrupt = result.data?.interrupt ?? null;

    if (interrupt?.type === 'combat.enemy-ready') {
        enemyResult = resolveEnemyReadyAction(state, interrupt.data.enemyId);
        const active = ensureAbilityRuntimeState(state).active;
        if (enemyResult?.resolution?.hit && active?.interruptible && state.activeBattle?.phase === 'active') {
            abilityInterrupt = interruptActiveAbility(state, `hit by ${enemyResult.action?.sourceId ?? 'enemy action'}`);
        }
    } else if (interrupt?.type === 'ability.activation-complete' || interrupt?.type === 'task.completed') {
        abilityResult = reconcileAbilityActivation(state);
    } else if (!result.data?.interrupted) {
        abilityResult = reconcileAbilityActivation(state);
    }

    finalizeCombatState(state);
    const advanced = Number(result.data?.secondsAdvanced) || 0;
    const lines = [`Advanced combat time ${advanced}s.`];
    if (enemyResult?.action) lines.push(`Enemy action: ${enemyResult.action.kind}${enemyResult.action.sourceId ? ` (${enemyResult.action.sourceId})` : ''}.`);
    if (abilityInterrupt?.message) lines.push(abilityInterrupt.message);
    if (abilityResult?.message) lines.push(abilityResult.message);

    return {
        ok: true,
        code: result.data?.interrupted ? 'combat.interrupted' : 'combat.advance-complete',
        secondsAdvanced: advanced,
        nowWorldSeconds: ensureWorldTimeState(state).totalSeconds,
        interrupt,
        enemyResult,
        abilityResult,
        abilityInterrupt,
        message: lines.join('\n'),
    };
}
