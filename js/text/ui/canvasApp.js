import { createCommandRouter } from '../commandRouter.js';
import { createInitialState, replaceState } from '../gameState.js';
import {
    clearSave,
    createAccountWithPassword,
    listCharacters,
    loadAccountSession,
    loadActiveCharacter,
    loadCharacter,
    loginAccount,
    logoutAccount,
    saveGame,
    updateAccountSettings,
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
    updatePointerHover,
} from './canvasInput.js';
import { renderCanvasApp } from './canvasRenderer.js';
import { createCommandIntent, createCommandIntentAdapter } from './commandIntentAdapter.js';
import { createActionList, createMenuActionList, TOP_ACTIONS } from './uiActions.js';
import { dispatchUiIntent } from './uiIntentDispatcher.js';

export function createCanvasApp({ canvas }) {
    if (!canvas) throw new Error('Canvas app requires a canvas host.');

    const loadedState = loadActiveCharacter();
    const state = loadedState ?? createInitialState();
    let session = loadAccountSession();
    const hasPlayableCharacter = Boolean(session.loggedIn && session.characterCount > 0 && loadedState);
    const uiState = createCanvasUiState({
        screen: hasPlayableCharacter ? 'game' : 'menu',
        activeFeedback: '',
        outputLines: ['FFXI Text RPG canvas shell initialized.', ''],
        selectedAccountId: session.accounts[0]?.id ?? null,
    });
    const commandRouter = createCommandRouter(state, { saveGame, clearSave, reload: () => window.location.reload() });
    const slashRouter = createSlashCommandRouter(state, { saveGame, clearSave, reload: () => window.location.reload() });

    let layout = null;
    const ctx = canvas.getContext('2d');
    canvas.tabIndex = 0;

    function refreshSession() {
        session = loadAccountSession();
        if (!uiState.selectedAccountId && session.accounts.length) uiState.selectedAccountId = session.accounts[0].id;
        return session;
    }

    function routeCommand(command) {
        const value = String(command ?? '').trim();
        if (!value) return '';
        return value.startsWith('/') ? slashRouter(value) : commandRouter(value);
    }

    const commandAdapter = createCommandIntentAdapter(routeCommand);
    const intentServices = {
        loadAccountSession: refreshSession,
        createAccountWithPassword,
        loginAccount,
        logoutAccount,
        updateAccountSettings,
        loadCharacter,
        replaceState,
        commandAdapter,
    };

    function runCommand(command) {
        const { intent, payload } = createCommandIntent(command);
        const result = dispatchAndRender(intent, payload);
        return result.response ?? result.message ?? result.reason ?? '';
    }

    function dispatchIntent(intent, payload = {}) {
        const result = dispatchUiIntent({ intent, payload, state, uiState, session, services: intentServices });
        session = result.session ?? session;
        return result;
    }

    function dispatchAndRender(intent, payload = {}) {
        const result = dispatchIntent(intent, payload);
        if (!result.ok) {
            setActiveFeedback(uiState, result.reason);
            appendOutput(uiState, result.reason);
        }
        render();
        return result;
    }

    function dispatchCanvasAction(actionId) {
        const allActions = [...TOP_ACTIONS, ...createMenuActionList(session, uiState.modal), ...createActionList(state)];
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
        const payload = { ...(action.payload ?? {}), action };
        dispatchAndRender(action.intent, payload);
    }

    function submitFromInput(command) {
        if (uiState.screen === 'menu') {
            if (uiState.modal === 'loginPassword') {
                dispatchAndRender('account.login.confirm');
                return '';
            }
            if (uiState.modal === 'createAccount') {
                dispatchAndRender('account.create.confirm');
                return '';
            }
            if (!session.loggedIn && !session.accounts.length) {
                dispatchAndRender('account.create.open');
                return '';
            }
        }
        return runCommand(command);
    }

    function render() {
        refreshSession();
        const actions = createActionList(state);
        const menuActions = createMenuActionList(session, uiState.modal);
        layout = createCanvasLayout({
            width: canvas.clientWidth || window.innerWidth,
            height: canvas.clientHeight || window.innerHeight,
            actions,
            menuActions,
            topActions: TOP_ACTIONS,
            modal: uiState.modal,
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
            dispatchAndRender('ui.menu.open');
        } else if (result.type === 'modal') render();
        else if (result.type === 'submit') submitFromInput(result.command);
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
        login(accountSelector, passphrase) {
            const result = loginAccount(accountSelector, passphrase, { persistentLogin: true });
            if (result.ok) session = result.session;
            render();
            return result;
        },
        logout() { const result = dispatchAndRender('account.logout'); return result.session; },
        loadCharacter(selector) { const loaded = loadCharacter(selector); if (loaded) replaceState(state, loaded); render(); return loaded; },
        listCharacters,
        getSession: () => session,
        destroy() { window.removeEventListener('resize', resize); },
    };
}
