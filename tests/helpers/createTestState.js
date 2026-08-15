import { createNewGameState } from '../../js/text/gameState.js';

export function createTestState(options = {}) {
    return createNewGameState({
        startWorldTimeSeconds: 0,
        ...options,
    });
}
