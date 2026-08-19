import { createCharacterStatState } from './characterStatEngine.js';
import { calculateCombatProfile } from './statEngine.js';

export const PLAYER_DERIVED_STATE_VERSION = 1;

export function refreshPlayerDerivedState(player) {
    if (!player || player.type !== 'player') return player;
    player.statState = createCharacterStatState(player);
    player.combat = calculateCombatProfile(player);
    return player;
}

export function stripPlayerDerivedStateForPersistence(state) {
    if (!state || typeof state !== 'object') return state;
    const persisted = JSON.parse(JSON.stringify(state));
    if (persisted.player && typeof persisted.player === 'object') {
        delete persisted.player.combat;
        delete persisted.player.statState;
    }
    return persisted;
}
