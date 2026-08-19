export const COMBAT_IDENTITY_PERSISTENCE_VERSION = 1;

export function validatePersistedCombatIdentity(state) {
    const issues = [];
    if (!Number.isInteger(state?.combatSequence) || state.combatSequence < 0) {
        return ['combatSequence must be a persisted non-negative integer.'];
    }
    const battle = state?.activeBattle;
    if (battle === null || battle === undefined) return issues;
    if (!battle || typeof battle !== 'object' || Array.isArray(battle)) return issues;

    const expectedId = formatBattleId(state.combatSequence);
    if (state.combatSequence < 1) issues.push('combatSequence must be positive when activeBattle is persisted.');
    if (battle.id !== expectedId) issues.push(`activeBattle.id must match combatSequence as ${expectedId}.`);
    return issues;
}

export function formatBattleId(sequence) {
    return `battle-${String(Math.max(0, Number(sequence) || 0)).padStart(6, '0')}`;
}
