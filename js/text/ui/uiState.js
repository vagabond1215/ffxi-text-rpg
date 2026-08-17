import { createCanvasUiState } from './canvasInput.js';

export const PRIMARY_UI_VIEWS = Object.freeze(['scene', 'character', 'spellbook', 'journal', 'codex', 'craft', 'world']);

export function createUiState(options = {}) {
    return {
        ...createCanvasUiState(options),
        activeView: PRIMARY_UI_VIEWS.includes(options.activeView) ? options.activeView : 'scene',
        informationQuery: String(options.informationQuery ?? '').trim(),
    };
}

export function setActiveView(uiState, viewId) {
    const view = PRIMARY_UI_VIEWS.includes(viewId) ? viewId : 'scene';
    uiState.activeView = view;
    return view;
}
