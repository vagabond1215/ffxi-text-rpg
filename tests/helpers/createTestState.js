import { createNewGameState } from '../../js/text/gameState.js';

export function createTestState(options = {}) {
    return createNewGameState({
        startWorldTimeSeconds: 0,
        ...options,
    });
}

export function createIsolatedTestState(options = {}) {
    const state = createTestState(options);
    state.player.inventoryState.containers.inventory.items.length = 0;
    return state;
}
