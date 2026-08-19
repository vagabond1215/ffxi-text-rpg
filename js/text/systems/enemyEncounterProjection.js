import { createSeedEnemies } from '../data/seedEntities.js';

export const ENEMY_ENCOUNTER_PROJECTION_VERSION = 1;

export function refreshEnemyEncounterProjection(state) {
    if (!state || typeof state !== 'object' || Array.isArray(state)) return [];
    state.enemies = createSeedEnemies();
    return state.enemies;
}
