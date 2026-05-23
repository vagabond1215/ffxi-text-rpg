import { createCommandRouter } from '../commandRouter.js';
import { createInitialState } from '../gameState.js';
import { clearSave, loadActiveCharacter, saveGame } from '../save.js';
import { createSlashCommandRouter } from '../slashCommandRouter.js';
import { createCanvasLayout } from './canvasLayout.js';
import {
    appendOutput,
    applyCanvasKey,
    createCanvasUiState,
    handlePointerDown,
    handlePointerUp,
    scrollOutput,
    setActiveFeedback,
    updatePointerHover,
} from './canvasInput.js';
import { renderCanvasApp } from './canvasRenderer.js';
import { createActionList, dispatchAction } from './uiActions.js';

export function createCanvasApp({ canvas }) {
    if (!canvas) throw new Error('Canvas app requires a canvas host.');

    const state = loadActiveCharacter() ?? createInitialState();
    const uiState = createCanvasUiState({
        outputLines: [
            'FFXI Text RPG canvas shell initialized.',
            'Click a command button, or type a command and press Enter.',
            'Canvas input accepts existing commands; slash commands still work.',
            '',
        ],
    });
    const commandRouter = createCommandRouter(state, {
        saveGame,
        clearSave,
        reload: () => window.location.reload(),
    });
    const slashRouter = createSlashCommandRouter(state, {
        saveGame,
        clearSave,
        reload: () => window.location.reload(),
    });

    let layout = null;
    const ctx = canvas.getContext('2d');
    canvas.tabIndex = 0;

    function routeCommand(command) {
        const value = String(command ?? '').trim();
        if (!value) return '';
        return value.startsWith('/') ? slashRouter(value) : commandRouter(value);
    }

    function runCommand(command) {
        const response = routeCommand(command);
        setActiveFeedback(uiState, `Ran: ${command}`);
        appendOutput(uiState, `> ${command}`);
        appendOutput(uiState, response);
        appendOutput(uiState, '');
        render();
        return response;
    }

    function render() {
        const actions = createActionList(state);
        layout = createCanvasLayout({
            width: canvas.clientWidth || window.innerWidth,
            height: canvas.clientHeight || window.innerHeight,
            actions,
        });
        renderCanvasApp(ctx, { layout, state, uiState });
    }

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        const width = canvas.clientWidth || window.innerWidth;
        const height = canvas.clientHeight || window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        render();
    }

    function pointerPosition(event) {
        const bounds = canvas.getBoundingClientRect();
        return {
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top,
        };
    }

    canvas.addEventListener('pointermove', (event) => {
        const point = pointerPosition(event);
        updatePointerHover(uiState, layout, point.x, point.y);
        canvas.style.cursor = uiState.hoveredActionId ? 'pointer' : 'default';
        render();
    });

    canvas.addEventListener('pointerdown', (event) => {
        canvas.focus();
        const point = pointerPosition(event);
        handlePointerDown(uiState, layout, point.x, point.y);
        render();
    });

    canvas.addEventListener('pointerup', (event) => {
        const point = pointerPosition(event);
        const result = handlePointerUp(uiState, layout, point.x, point.y);
        if (result.type === 'action') {
            const dispatched = dispatchAction(result.actionId, runCommand, createActionList(state));
            if (!dispatched.ok) {
                setActiveFeedback(uiState, dispatched.reason);
                appendOutput(uiState, dispatched.reason);
                render();
            }
            return;
        }
        render();
    });

    canvas.addEventListener('wheel', (event) => {
        const point = pointerPosition(event);
        updatePointerHover(uiState, layout, point.x, point.y);
        if (uiState.hoveredRegion === 'main') {
            event.preventDefault();
            scrollOutput(uiState, event.deltaY < 0 ? 3 : -3);
            render();
        }
    }, { passive: false });

    canvas.addEventListener('keydown', (event) => {
        const result = applyCanvasKey(uiState, event.key, event);
        if (result.type !== 'ignored') event.preventDefault();
        if (result.type === 'submit') runCommand(result.command);
        else render();
    });

    window.addEventListener('resize', resize);
    resize();
    canvas.focus();

    return {
        state,
        uiState,
        runCommand,
        render,
        destroy() {
            window.removeEventListener('resize', resize);
        },
    };
}
