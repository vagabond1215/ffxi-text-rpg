import { appendBattleLog, getCombatant, resolveBasicAttack } from './battleEngine.js';
import { resolveBattleRewards } from './rewardEngine.js';
import { emitSemanticEvent } from './semanticEventEngine.js';

export const COMBAT_CONTRACT_VERSION = 1;
export const COMBAT_ACTION_HISTORY_LIMIT = 100;

export function ensureCombatContract(battle) {
    if (!battle || typeof battle !== 'object') return null;
    const current = battle.contract;
    if (!current || typeof current !== 'object' || Array.isArray(current) || current.version !== COMBAT_CONTRACT_VERSION) {
        battle.contract = createCombatContractState();
        return battle.contract;
    }
    if (!Number.isInteger(current.actionSequence) || current.actionSequence < 0) current.actionSequence = 0;
    if (!Array.isArray(current.actions)) current.actions = [];
    if (current.actions.length > COMBAT_ACTION_HISTORY_LIMIT) {
        current.actions.splice(0, current.actions.length - COMBAT_ACTION_HISTORY_LIMIT);
    }
    return current;
}

export function createCombatContractState() {
    return {
        version: COMBAT_CONTRACT_VERSION,
        actionSequence: 0,
        actions: [],
        lastActionId: null,
    };
}

export function recordCombatAction(state, definition = {}) {
    const battle = definition.battle ?? state?.activeBattle;
    const contract = ensureCombatContract(battle);
    if (!battle || !contract) return null;

    contract.actionSequence += 1;
    const record = {
        id: `combat-action-${String(contract.actionSequence).padStart(6, '0')}`,
        round: Math.max(1, Number(battle.round) || 1),
        actorId: definition.actorId ?? null,
        actorType: definition.actorType ?? null,
        targetId: definition.targetId ?? null,
        kind: definition.kind ?? 'unknown',
        sourceId: definition.sourceId ?? null,
        outcome: definition.outcome ?? 'resolved',
        data: clonePlain(definition.data ?? {}),
    };

    contract.actions.push(record);
    if (contract.actions.length > COMBAT_ACTION_HISTORY_LIMIT) {
        contract.actions.splice(0, contract.actions.length - COMBAT_ACTION_HISTORY_LIMIT);
    }
    contract.lastActionId = record.id;

    if (state) {
        emitSemanticEvent(state, 'combat.action.resolved', {
            battleId: battle.id ?? null,
            actionId: record.id,
            round: record.round,
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

export function selectEnemyAction(battle, enemy) {
    if (!battle || battle.phase !== 'active' || !enemy || enemy.battle?.defeated) return null;
    const target = battle.combatants.find((combatant) => combatant.type === 'player' && !combatant.battle?.defeated && combatant.resources?.hp > 0);
    if (!target) return null;

    return Object.freeze({
        kind: 'basicAttack',
        actorId: enemy.id,
        targetId: target.id,
        policy: 'basic-attack-v1',
    });
}

export function resolveEnemyResponse(state, options = {}) {
    const battle = state?.activeBattle;
    if (!battle || battle.phase !== 'active') {
        finalizeCombatState(state);
        return { ok: true, actions: [], phase: battle?.phase ?? null };
    }

    const resolvedActions = [];
    const enemies = battle.combatants.filter((combatant) => combatant.type === 'enemy' && !combatant.battle?.defeated && combatant.resources?.hp > 0);

    for (const enemy of enemies) {
        const selection = selectEnemyAction(battle, enemy);
        if (!selection) continue;
        const resolution = resolveBasicAttack(battle, selection.actorId, selection.targetId, { rng: options.rng });
        const action = recordCombatAction(state, {
            battle,
            actorId: selection.actorId,
            actorType: 'enemy',
            targetId: selection.targetId,
            kind: 'basicAttack',
            sourceId: selection.policy,
            outcome: resolution.outcome,
            data: {
                hit: resolution.hit,
                damage: resolution.damage,
                defeatedTarget: resolution.defeatedTarget,
                triggerActionId: options.triggerActionId ?? null,
            },
        });
        resolvedActions.push(action);

        const target = getCombatant(battle, selection.targetId);
        if (!target || target.battle?.defeated || target.resources?.hp <= 0 || battle.phase !== 'active') break;
    }

    if (resolvedActions.length) battle.round = Math.max(1, Number(battle.round) || 1) + 1;
    finalizeCombatState(state);
    return { ok: true, actions: resolvedActions, phase: battle.phase };
}

export function finalizeCombatState(state) {
    const battle = state?.activeBattle;
    if (!battle) return null;
    ensureCombatContract(battle);
    syncPlayerFromCombat(state);

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
        modifiers: { ...(status.modifiers ?? {}) },
        flags: { ...(status.flags ?? {}) },
    }));
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
        if (!action.kind) issues.push(`${action.id}.kind is required.`);
        if (!action.outcome) issues.push(`${action.id}.outcome is required.`);
    }
    return issues;
}

function clonePlain(value) {
    if (Array.isArray(value)) return value.map(clonePlain);
    if (!value || typeof value !== 'object') return value;
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, clonePlain(child)]));
}
