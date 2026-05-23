import { hitTestAction, hitTestRegion } from './canvasLayout.js';

export function createCanvasUiState(options = {}) {
    return {
        outputLines: [...(options.outputLines ?? [])],
        commandHistory: [...(options.commandHistory ?? [])],
        historyIndex: null,
        inputBuffer: options.inputBuffer ?? '',
        activePanel: options.activePanel ?? 'main',
        hoveredActionId: null,
        pressedActionId: null,
        focusedRegion: options.focusedRegion ?? 'input',
    };
}

export function appendOutput(uiState, text, limit = 600) {
    const lines = String(text ?? '').split('\n');
    uiState.outputLines.push(...lines);
    if (uiState.outputLines.length > limit) {
        uiState.outputLines.splice(0, uiState.outputLines.length - limit);
    }
    return uiState.outputLines;
}

export function submitCommandInput(uiState, routeCommand) {
    const command = uiState.inputBuffer.trim();
    if (!command) return { ok: false, reason: 'empty' };
    uiState.commandHistory.push(command);
    uiState.historyIndex = uiState.commandHistory.length;
    uiState.inputBuffer = '';
    const response = routeCommand(command);
    appendOutput(uiState, `> ${command}`);
    appendOutput(uiState, response);
    appendOutput(uiState, '');
    return { ok: true, command, response };
}

export function applyCanvasKey(uiState, key, event = {}) {
    if (event.ctrlKey || event.metaKey || event.altKey) return { type: 'ignored' };
    switch (key) {
        case 'Enter': {
            const command = uiState.inputBuffer.trim();
            if (!command) return { type: 'ignored' };
            uiState.commandHistory.push(command);
            uiState.historyIndex = uiState.commandHistory.length;
            uiState.inputBuffer = '';
            return { type: 'submit', command };
        }
        case 'Backspace':
            uiState.inputBuffer = uiState.inputBuffer.slice(0, -1);
            return { type: 'edit' };
        case 'Escape':
            uiState.inputBuffer = '';
            uiState.historyIndex = uiState.commandHistory.length;
            return { type: 'edit' };
        case 'ArrowUp':
            browseHistory(uiState, -1);
            return { type: 'history' };
        case 'ArrowDown':
            browseHistory(uiState, 1);
            return { type: 'history' };
        default:
            if (typeof key === 'string' && key.length === 1) {
                uiState.inputBuffer += key;
                uiState.historyIndex = uiState.commandHistory.length;
                return { type: 'edit' };
            }
            return { type: 'ignored' };
    }
}

export function updatePointerHover(uiState, layout, x, y) {
    const hit = hitTestAction(layout, x, y);
    uiState.hoveredActionId = hit?.action?.disabled ? null : hit?.action?.id ?? null;
    return hit;
}

export function handlePointerDown(uiState, layout, x, y) {
    const hit = updatePointerHover(uiState, layout, x, y);
    uiState.pressedActionId = hit?.action?.disabled ? null : hit?.action?.id ?? null;
    uiState.focusedRegion = hitTestRegion(layout, x, y) ?? uiState.focusedRegion;
    return hit;
}

export function handlePointerUp(uiState, layout, x, y) {
    const hit = updatePointerHover(uiState, layout, x, y);
    const pressedActionId = uiState.pressedActionId;
    uiState.pressedActionId = null;
    if (hit?.action && !hit.action.disabled && hit.action.id === pressedActionId) {
        return { type: 'action', actionId: hit.action.id, action: hit.action };
    }
    return { type: 'none' };
}

function browseHistory(uiState, direction) {
    if (!uiState.commandHistory.length) return;
    const lastIndex = uiState.commandHistory.length - 1;
    const current = uiState.historyIndex === null ? uiState.commandHistory.length : uiState.historyIndex;
    const next = Math.max(0, Math.min(uiState.commandHistory.length, current + direction));
    uiState.historyIndex = next;
    uiState.inputBuffer = next > lastIndex ? '' : uiState.commandHistory[next];
}
