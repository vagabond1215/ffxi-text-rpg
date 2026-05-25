import { hitTestAction, hitTestRegion } from './canvasLayout.js';

export function createCanvasUiState(options = {}) {
    return {
        screen: options.screen ?? 'menu',
        modal: options.modal ?? null,
        outputLines: [...(options.outputLines ?? [])],
        commandHistory: [...(options.commandHistory ?? [])],
        historyIndex: null,
        inputBuffer: options.inputBuffer ?? '',
        outputScrollOffset: Math.max(0, Number(options.outputScrollOffset) || 0),
        activePanel: options.activePanel ?? 'main',
        activeFeedback: options.activeFeedback ?? '',
        selectedAccountId: options.selectedAccountId ?? null,
        hoveredActionId: null,
        pressedActionId: null,
        hoveredRegion: null,
        pressedRegion: null,
        focusedRegion: options.focusedRegion ?? 'input',
    };
}

export function appendOutput(uiState, text, limit = 600) {
    const lines = String(text ?? '').split('\n');
    uiState.outputLines.push(...lines);
    if (uiState.outputLines.length > limit) uiState.outputLines.splice(0, uiState.outputLines.length - limit);
    uiState.outputScrollOffset = 0;
    return uiState.outputLines;
}

export function setActiveFeedback(uiState, text) {
    uiState.activeFeedback = String(text ?? '');
    return uiState.activeFeedback;
}

export function setCanvasScreen(uiState, screen) {
    uiState.screen = screen === 'game' ? 'game' : 'menu';
    uiState.focusedRegion = 'input';
    uiState.hoveredActionId = null;
    uiState.pressedActionId = null;
    return uiState.screen;
}

export function setCanvasModal(uiState, modal) {
    uiState.modal = modal ?? null;
    uiState.focusedRegion = 'input';
    uiState.hoveredActionId = null;
    uiState.pressedActionId = null;
    return uiState.modal;
}

export function scrollOutput(uiState, deltaLines, maxOffset = uiState.outputLines.length) {
    const next = Number(uiState.outputScrollOffset || 0) + Number(deltaLines || 0);
    uiState.outputScrollOffset = Math.max(0, Math.min(Math.max(0, maxOffset), next));
    return uiState.outputScrollOffset;
}

export function submitCommandInput(uiState, routeCommand) {
    const command = uiState.inputBuffer.trim();
    if (!command) return { ok: false, reason: 'empty' };
    uiState.commandHistory.push(command);
    uiState.historyIndex = uiState.commandHistory.length;
    uiState.inputBuffer = '';
    const response = routeCommand(command);
    setActiveFeedback(uiState, `Ran: ${command}`);
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
            if (uiState.modal) {
                uiState.modal = null;
                return { type: 'modal' };
            }
            if (uiState.screen === 'game') return { type: 'menu' };
            uiState.inputBuffer = '';
            uiState.historyIndex = uiState.commandHistory.length;
            return { type: 'edit' };
        case 'ArrowUp':
            browseHistory(uiState, -1);
            return { type: 'history' };
        case 'ArrowDown':
            browseHistory(uiState, 1);
            return { type: 'history' };
        case 'PageUp':
            scrollOutput(uiState, 10);
            return { type: 'scroll' };
        case 'PageDown':
            scrollOutput(uiState, -10);
            return { type: 'scroll' };
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
    uiState.hoveredRegion = hitTestRegion(layout, x, y);
    return hit;
}

export function handlePointerDown(uiState, layout, x, y) {
    const hit = updatePointerHover(uiState, layout, x, y);
    uiState.pressedActionId = hit?.action?.disabled ? null : hit?.action?.id ?? null;
    uiState.pressedRegion = hitTestRegion(layout, x, y);
    uiState.focusedRegion = uiState.pressedRegion ?? uiState.focusedRegion;
    return hit;
}

export function handlePointerUp(uiState, layout, x, y) {
    const hit = updatePointerHover(uiState, layout, x, y);
    const pressedActionId = uiState.pressedActionId;
    uiState.pressedActionId = null;
    uiState.pressedRegion = null;
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
