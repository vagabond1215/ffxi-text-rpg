import { createCommandRouter } from '../commandRouter.js';
import { createInitialState, replaceState } from '../gameState.js';
import {
    clearSave,
    listCharacters,
    loadAccountSession,
    loadActiveCharacter,
    loadCharacter,
    loginAccount,
    logoutAccount,
    saveGame,
} from '../save.js';
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
    setCanvasScreen,
    updatePointerHover,
} from './canvasInput.js';
import { renderCanvasApp } from './canvasRenderer.js';
import { createActionList, createMenuActionList, dispatchAction, TOP_ACTIONS } from './uiActions.js';

export function createCanvasApp({ canvas }) {
    if (!canvas) throw new Error('Canvas app requires a canvas host.');

    const state = loadActiveCharacter() ?? createInitialState();
    let session = loadAccountSession();
    const uiState = createCanvasUiState({
        screen: session.loggedIn ? 'game' : 'menu',
        activeFeedback: session.loggedIn ? `Welcome back, ${session.displayName}.` : 'Login or select a local account to continue.',
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

    function refreshSession() {
        session = loadAccountSession();
        return session;
    }

    function routeCommand(command) {
        const value = String(command ?? '').trim();
        if (!value) return '';
        return value.startsWith('/') ? slashRouter(value) : commandRouter(value);
    }

    function runCommand(command) {
        const response = routeCommand(command);
        refreshSession();
        setActiveFeedback(uiState, `Ran: ${command}`);
        appendOutput(uiState, `> ${command}`);
        appendOutput(uiState, response);
        appendOutput(uiState, '');
        render();
        return response;
    }

    function handleUiAction(action) {
        switch (action.id) {
            case 'menu':
                setCanvasScreen(uiState, 'menu');
                setActiveFeedback(uiState, 'Main menu opened.');
                break;
            case 'continue':
                setCanvasScreen(uiState, 'game');
                setActiveFeedback(uiState, `Continuing as ${session.displayName}.`);
                break;
            case 'login': {
                const typedName = uiState.inputBuffer.trim();
                session = loginAccount(typedName || session.displayName);
                uiState.inputBuffer = '';
                setCanvasScreen(uiState, 'game');
                setActiveFeedback(uiState, `Logged in as ${session.displayName}.`);
                appendOutput(uiState, `Logged in as ${session.displayName}.`);
                break;
            }
            case 'logout':
                session = logoutAccount();
                setCanvasScreen(uiState, 'menu');
                setActiveFeedback(uiState, 'Logged out. Local account data remains saved.');
                appendOutput(uiState, 'Logged out. Local account data remains saved.');
                break;
            default:
                return false;
        }
        render();
        return true;
    }

    function dispatchCanvasAction(actionId) {
        const allActions = [
            ...TOP_ACTIONS,
            ...createMenuActionList(session),
            ...createActionList(state),
        ];
        const action = allActions.find((item) => item.id === actionId);
        if (!action) {
            appendOutput(uiState, `Unknown action: ${actionId}`);
            render();
            return;
        }
        if (action.disabled) {
            setActiveFeedback(uiState, `${action.label} is unavailable.`);
            appendOutput(uiState, `${action.label} is unavailable.`);
            render();
            return;
        }
        if (action.kind === 'ui' && handleUiAction(action)) return;
        const dispatched = dispatchAction(action, runCommand, allActions);
        if (!dispatched.ok) {
            setActiveFeedback(uiState, dispatched.reason);
            appendOutput(uiState, dispatched.reason);
            render();
        } else if (uiState.screen === 'menu' && ['newCharacter', 'characters', 'account'].includes(action.id)) {
            setActiveFeedback(uiState, dispatched.command);
        }
    }

    function submitFromInput(command) {
        if (uiState.screen === 'menu' && !command.startsWith('/')) {
            session = loginAccount(command);
            setCanvasScreen(uiState, 'game');
            setActiveFeedback(uiState, `Logged in as ${session.displayName}.`);
            appendOutput(uiState, `Logged in as ${session.displayName}.`);
            render();
            return `Logged in as ${session.displayName}.`;
        }
        return runCommand(command);
    }

    function render() {
        const actions = createActionList(state);
        const menuActions = createMenuActionList(session);
        layout = createCanvasLayout({
            width: canvas.clientWidth || window.innerWidth,
            height: canvas.clientHeight || window.innerHeight,
            actions,
            menuActions,
            topActions: TOP_ACTIONS,
        });
        renderCanvasApp(ctx, { layout, state, uiState, session });
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
        return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
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
            dispatchCanvasAction(result.actionId);
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
        if (result.type === 'menu') {
            setCanvasScreen(uiState, 'menu');
            setActiveFeedback(uiState, 'Main menu opened.');
            render();
        } else if (result.type === 'submit') submitFromInput(result.command);
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
        login(displayName) {
            session = loginAccount(displayName);
            setCanvasScreen(uiState, 'game');
            setActiveFeedback(uiState, `Logged in as ${session.displayName}.`);
            render();
            return session;
        },
        logout() {
            session = logoutAccount();
            setCanvasScreen(uiState, 'menu');
            setActiveFeedback(uiState, 'Logged out.');
            render();
            return session;
        },
        loadCharacter(selector) {
            const loaded = loadCharacter(selector);
            if (loaded) replaceState(state, loaded);
            render();
            return loaded;
        },
        listCharacters,
        getSession: () => session,
        destroy() { window.removeEventListener('resize', resize); },
    };
}
