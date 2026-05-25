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
    setCanvasModal,
    setCanvasScreen,
    updatePointerHover,
} from './canvasInput.js';
import { renderCanvasApp } from './canvasRenderer.js';
import { createActionList, createMenuActionList, dispatchAction, TOP_ACTIONS } from './uiActions.js';

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
    });
    const commandRouter = createCommandRouter(state, { saveGame, clearSave, reload: () => window.location.reload() });
    const slashRouter = createSlashCommandRouter(state, { saveGame, clearSave, reload: () => window.location.reload() });

    let layout = null;
    let selectedAccountId = session.accounts[0]?.id ?? null;
    const ctx = canvas.getContext('2d');
    canvas.tabIndex = 0;

    function refreshSession() {
        session = loadAccountSession();
        if (!selectedAccountId && session.accounts.length) selectedAccountId = session.accounts[0].id;
        return session;
    }

    function routeCommand(command) {
        const value = String(command ?? '').trim();
        if (!value) return '';
        return value.startsWith('/') ? slashRouter(value) : commandRouter(value);
    }

    function runCommand(command) {
        if (!session.loggedIn && !String(command).startsWith('/account')) {
            const message = 'Login or create a local account first.';
            setActiveFeedback(uiState, message);
            appendOutput(uiState, message);
            render();
            return message;
        }
        const response = routeCommand(command);
        refreshSession();
        setActiveFeedback(uiState, `Ran: ${command}`);
        appendOutput(uiState, `> ${command}`);
        appendOutput(uiState, response);
        appendOutput(uiState, '');
        render();
        return response;
    }

    function parseCredentialInput() {
        const value = uiState.inputBuffer.trim();
        const [namePart, passwordPart] = value.split('|').map((part) => String(part ?? '').trim());
        return { accountName: namePart, password: passwordPart };
    }

    function cycleSetting(intent) {
        const settings = session.settings ?? {};
        const updates = {};
        if (intent === 'settings.cycleTheme') updates.theme = nextValue(settings.theme, ['dark', 'light', 'highContrast']);
        if (intent === 'settings.cycleTimeZone') updates.timeZone = nextValue(settings.timeZone, ['local', 'UTC', 'America/New_York', 'America/Los_Angeles']);
        if (intent === 'settings.toggleClock') updates.showClock = !(settings.showClock !== false);
        if (intent === 'settings.toggleClockFormat') updates.clockFormat = settings.clockFormat === '24h' ? '12h' : '24h';
        const result = updateAccountSettings(updates);
        if (!result.ok) {
            setActiveFeedback(uiState, result.reason);
            appendOutput(uiState, result.reason);
            return;
        }
        session = result.session;
        setActiveFeedback(uiState, 'Settings saved.');
    }

    function handleIntent(action) {
        switch (action.intent) {
            case 'ui.menu.open':
                refreshSession();
                setCanvasScreen(uiState, 'menu');
                setCanvasModal(uiState, null);
                setActiveFeedback(uiState, '');
                break;
            case 'ui.modal.close':
                setCanvasModal(uiState, null);
                setActiveFeedback(uiState, '');
                break;
            case 'account.login.open':
                if (session.accounts.length) {
                    setCanvasModal(uiState, 'login');
                    setActiveFeedback(uiState, '');
                }
                break;
            case 'account.select':
                selectedAccountId = action.payload?.accountId ?? action.command;
                setCanvasModal(uiState, 'loginPassword');
                setActiveFeedback(uiState, `Selected ${action.label}.`);
                break;
            case 'account.login.confirm': {
                const { password } = parseCredentialInput();
                const result = loginAccount(selectedAccountId, password, { persistentLogin: true });
                if (!result.ok) {
                    setActiveFeedback(uiState, result.reason);
                    appendOutput(uiState, result.reason);
                    break;
                }
                session = result.session;
                uiState.inputBuffer = '';
                setCanvasModal(uiState, null);
                setCanvasScreen(uiState, 'menu');
                setActiveFeedback(uiState, `Logged in as ${session.displayName}.`);
                appendOutput(uiState, `Logged in as ${session.displayName}.`);
                break;
            }
            case 'account.create': {
                const { accountName, password } = parseCredentialInput();
                const result = createAccountWithPassword(accountName, password, { persistentLogin: true });
                if (!result.ok) {
                    setActiveFeedback(uiState, result.reason);
                    appendOutput(uiState, result.reason);
                    break;
                }
                session = result.session;
                selectedAccountId = session.accountId;
                uiState.inputBuffer = '';
                setCanvasModal(uiState, null);
                setCanvasScreen(uiState, 'menu');
                setActiveFeedback(uiState, `Created ${session.displayName}.`);
                appendOutput(uiState, `Created account: ${session.displayName}.`);
                break;
            }
            case 'account.logout':
                session = logoutAccount();
                setCanvasModal(uiState, null);
                setCanvasScreen(uiState, 'menu');
                setActiveFeedback(uiState, 'Logged out.');
                appendOutput(uiState, 'Logged out.');
                break;
            case 'character.select': {
                const loaded = loadCharacter(action.payload?.characterId ?? action.command);
                if (!loaded) {
                    setActiveFeedback(uiState, `Unable to load character: ${action.label}`);
                    appendOutput(uiState, `Unable to load character: ${action.label}`);
                    break;
                }
                replaceState(state, loaded);
                refreshSession();
                setCanvasModal(uiState, null);
                setCanvasScreen(uiState, 'game');
                setActiveFeedback(uiState, `Loaded ${loaded.player.identity.name}.`);
                appendOutput(uiState, `Loaded ${loaded.player.identity.name}.`);
                break;
            }
            case 'settings.open':
                if (session.loggedIn) setCanvasModal(uiState, 'settings');
                break;
            case 'settings.cycleTheme':
            case 'settings.cycleTimeZone':
            case 'settings.toggleClock':
            case 'settings.toggleClockFormat':
                cycleSetting(action.intent);
                break;
            default:
                return false;
        }
        refreshSession();
        render();
        return true;
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
        if (action.intent !== 'command.route' && handleIntent(action)) return;
        const dispatched = dispatchAction(action, runCommand, allActions);
        if (!dispatched.ok) {
            setActiveFeedback(uiState, dispatched.reason);
            appendOutput(uiState, dispatched.reason);
            render();
        } else if (action.id === 'newCharacter') {
            setActiveFeedback(uiState, '');
            setCanvasScreen(uiState, 'game');
        }
    }

    function submitFromInput(command) {
        if (uiState.screen === 'menu') {
            if (uiState.modal === 'loginPassword') {
                dispatchCanvasAction('confirmLogin');
                return '';
            }
            if (!session.loggedIn && !session.accounts.length) {
                dispatchCanvasAction('createAccount');
                return '';
            }
        }
        return runCommand(command);
    }

    function render() {
        refreshSession();
        const actions = createActionList(state);
        const menuActions = createMenuActionList(session, uiState.modal);
        layout = createCanvasLayout({ width: canvas.clientWidth || window.innerWidth, height: canvas.clientHeight || window.innerHeight, actions, menuActions, topActions: TOP_ACTIONS });
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
            setCanvasModal(uiState, null);
            setActiveFeedback(uiState, '');
            render();
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
        logout() { session = logoutAccount(); render(); return session; },
        loadCharacter(selector) { const loaded = loadCharacter(selector); if (loaded) replaceState(state, loaded); render(); return loaded; },
        listCharacters,
        getSession: () => session,
        destroy() { window.removeEventListener('resize', resize); },
    };
}

function nextValue(current, values) {
    const index = values.indexOf(current);
    return values[(index + 1) % values.length];
}
