import { createCharacterStatState } from './characterStatEngine.js';
import { calculateCombatProfile } from './statEngine.js';

export const PLAYER_DERIVED_STATE_VERSION = 1;

export function refreshPlayerDerivedState(player) {
    if (!player || player.type !== 'player') return player;
    player.statState = createCharacterStatState(player);
    player.combat = calculateCombatProfile(player);
    return player;
}

export function refreshActiveBattleDerivedState(battle) {
    if (!battle || !Array.isArray(battle.combatants)) return battle;
    for (const combatant of battle.combatants) {
        if (!combatant || typeof combatant !== 'object') continue;
        delete combatant.combat;
        if (combatant.type === 'player') delete combatant.statState;
        combatant.combat = calculateCombatProfile(combatant);
    }
    return battle;
}

export function stripPlayerDerivedStateForPersistence(state) {
    if (!state || typeof state !== 'object') return state;
    const persisted = JSON.parse(JSON.stringify(state));
    if (persisted.player && typeof persisted.player === 'object') {
        delete persisted.player.combat;
        delete persisted.player.statState;
    }
    if (Array.isArray(persisted.activeBattle?.combatants)) {
        for (const combatant of persisted.activeBattle.combatants) {
            if (!combatant || typeof combatant !== 'object') continue;
            delete combatant.combat;
            if (combatant.type === 'player') delete combatant.statState;
        }
    }
    return persisted;
}
