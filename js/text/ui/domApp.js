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
import { setCreatorName, validateCreator } from '../systems/characterCreationModel.js';
import { advanceCombatSimulation } from '../systems/combatSimulationEngine.js';
import { moveWithinLocality, performLocalityPoiAction } from '../systems/localityEngine.js';
import { appendOutput, isMovementOnCooldown, setActiveFeedback } from './canvasInput.js';
import { createCommandIntentAdapter } from './commandIntentAdapter.js';
import { renderDomApp } from './domRenderer.js';
import { createGameViewModel } from './gameViewModel.js';
import { createMenuActionList } from './uiActions.js';
import { dispatchUiIntent } from './uiIntentDispatcher.js';
import { createUiState, setActiveView } from './uiState.js';

export function createDomApp({ host }) {
    if (!host) throw new Error('DOM app requires a host element.');

    const loadedState = loadActiveCharacter();
    const state = loadedState ?? createInitialState();
    let session = loadAccountSession();
    const hasPlayableCharacter = Boolean(session.loggedIn && session.characterCount > 0 && loadedState);
    const uiState = createUiState({
        screen: hasPlayableCharacter ? 'game' : 'menu',
        activeView: 'scene',
        activeFeedback: '',
        outputLines: ['Hearth & Horizon interface initialized.'],
        selectedAccountId: session.accounts?.[0]?.id ?? null,
    });

    const commandRouter = createCommandRouter(state, { saveGame, clearSave, reload: () => window.location.reload() });
    const slashRouter = createSlashCommandRouter(state, { saveGame, clearSave, reload: () => window.location.reload() });

    function refreshSession() {
        session = loadAccountSession();
        if (!uiState.selectedAccountId && session.accounts?.length) uiState.selectedAccountId = session.accounts[0].id;
        return session;
    }

    function routeCommand(command) {
        const value = String(command ?? '').trim();
        if (!value) return '';
        const combatWait = /^\/?wait(?:\s+(\d+))?$/i.exec(value);
        if (combatWait && state.activeBattle?.phase === 'active') {
            return advanceCombatSimulation(state, combatWait[1] ?? 1).message;
        }
        return value.startsWith('/') ? slashRouter(value) : commandRouter(value);
    }

    const commandAdapter = createCommandIntentAdapter(routeCommand);
    const services = {
        loadAccountSession: refreshSession,
        createAccountWithPassword,
        loginAccount,
        logoutAccount,
        updateAccountSettings,
        loadCharacter,
        replaceState,
        saveGame,
        commandAdapter,
    };

    function dispatch(intent, payload = {}, options = {}) {
        let result;
        if (intent === 'locality.move') {
            result = moveWithinLocality(state, payload.destinationId);
            setActiveFeedback(uiState, result.message);
            appendOutput(uiState, result.message);
        } else if (intent === 'locality.poi') {
            result = performLocalityPoiAction(state, payload.poiId, payload.action);
            setActiveFeedback(uiState, result.message);
            appendOutput(uiState, result.message);
        } else {
            result = dispatchUiIntent({ intent, payload, state, uiState, session, services });
        }
        session = result.session ?? session;
        if (!result.ok && !['locality.move', 'locality.poi'].includes(intent)) {
            setActiveFeedback(uiState, result.reason);
            appendOutput(uiState, result.reason);
        }
        if (options.render !== false) render();
        return result;
    }

    function runCommand(command) {
        return dispatch('command.route', { command: String(command ?? '').trim() });
    }

    function render() {
        refreshSession();
        const model = uiState.screen === 'game' ? createGameViewModel(state, uiState) : null;
        host.innerHTML = renderDomApp({ state, uiState, session });
        host.dataset.screen = uiState.screen;
        host.dataset.navigationMode = model?.navigation?.mode ?? '';
        if (uiState.screen === 'creator') {
            const nameInput = host.querySelector('#creator-name');
            if (nameInput && document.activeElement === host) nameInput.focus();
        }
    }

    function findMenuAction(actionId) {
        return createMenuActionList(session, uiState.modal, uiState.modalPage).find((action) => action.id === actionId) ?? null;
    }

    function handleClick(event) {
        const button = event.target.closest('button');
        if (!button || !host.contains(button) || button.disabled) return;

        if (button.dataset.view) {
            setActiveView(uiState, button.dataset.view);
            render();
            return;
        }

        if (button.dataset.contextAction) {
            const model = createGameViewModel(state, uiState);
            const action = model.contextualActions.find((item) => item.id === button.dataset.contextAction);
            if (action) dispatch(action.intent, action.payload);
            return;
        }

        if (button.dataset.move) {
            dispatch('navigation.move', { direction: button.dataset.move, source: 'ui', nowMs: Date.now() });
            return;
        }

        if (button.dataset.creatorChoice) {
            const kind = button.dataset.creatorChoice;
            const value = button.dataset.value;
            const intent = kind === 'race' ? 'creator.selectRace'
                : kind === 'sex' ? 'creator.selectSex'
                    : kind === 'nation' ? 'creator.selectNation'
                        : kind === 'job' ? 'creator.selectJob'
                            : null;
            const payload = kind === 'race' ? { raceId: value }
                : kind === 'sex' ? { sex: value }
                    : kind === 'nation' ? { nationId: value }
                        : { mainJobId: value };
            if (intent) dispatch(intent, payload);
            return;
        }

        if (button.dataset.characterId) {
            const character = (session.characters ?? []).find((item) => item.id === button.dataset.characterId);
            dispatch('character.select', { characterId: button.dataset.characterId, displayName: character?.name ?? button.dataset.characterId });
            setActiveView(uiState, 'scene');
            return;
        }

        if (button.dataset.menuAction) {
            const action = findMenuAction(button.dataset.menuAction);
            if (action) dispatch(action.intent, { ...(action.payload ?? {}), action });
            return;
        }

        if (button.dataset.command !== undefined) {
            runCommand(button.dataset.command);
            return;
        }

        if (button.dataset.intent) {
            const result = dispatch(button.dataset.intent);
            if (button.dataset.intent === 'creator.begin' && result.ok) setActiveView(uiState, 'scene');
        }
    }

    function handleInput(event) {
        const target = event.target;
        if (!(target instanceof HTMLInputElement)) return;
        if (target.id === 'creator-name') {
            uiState.creator = setCreatorName(uiState.creator, target.value);
            const summaryName = host.querySelector('.creator-summary h2');
            if (summaryName) summaryName.textContent = uiState.creator.name || 'Traveler';
            const submit = host.querySelector('.creator-submit');
            if (submit) submit.disabled = validateCreator(uiState.creator).length > 0;
            return;
        }
        if (target.dataset.modalField) {
            uiState.modalInputs[target.dataset.modalField] = target.value;
        }
    }

    function handleSubmit(event) {
        if (event.target.id !== 'omnibox-form') return;
        event.preventDefault();
        const input = host.querySelector('#omnibox-input');
        const command = input?.value?.trim();
        if (!command) return;
        runCommand(command);
    }

    function handleKeyDown(event) {
        if (uiState.screen !== 'game' || uiState.modal) return;
        const target = event.target;
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable) return;
        const direction = keyDirection(event.key);
        if (!direction) return;
        if (createGameViewModel(state, uiState).navigation.mode !== 'exploration') return;
        event.preventDefault();
        dispatch('navigation.move', { direction, source: 'keyboard', nowMs: Date.now() });
    }

    host.addEventListener('click', handleClick);
    host.addEventListener('input', handleInput);
    host.addEventListener('submit', handleSubmit);
    window.addEventListener('keydown', handleKeyDown);

    const movementTimer = window.setInterval(() => {
        if (uiState.modal || uiState.screen !== 'game' || !uiState.activeAutoRunDirection) return;
        if (createGameViewModel(state, uiState).navigation.mode !== 'exploration') return;
        const nowMs = Date.now();
        if (isMovementOnCooldown(uiState, nowMs)) return;
        dispatch('navigation.move', { direction: uiState.activeAutoRunDirection, source: 'autoRun', nowMs });
    }, 250);

    render();

    return {
        state,
        uiState,
        render,
        runCommand,
        dispatch,
        listCharacters,
        getSession: () => session,
        destroy() {
            host.removeEventListener('click', handleClick);
            host.removeEventListener('input', handleInput);
            host.removeEventListener('submit', handleSubmit);
            window.removeEventListener('keydown', handleKeyDown);
            window.clearInterval(movementTimer);
        },
    };
}

function keyDirection(key) {
    const value = String(key ?? '').toLowerCase();
    if (value === 'arrowup' || value === 'w') return 'north';
    if (value === 'arrowright' || value === 'd') return 'east';
    if (value === 'arrowdown' || value === 's') return 'south';
    if (value === 'arrowleft' || value === 'a') return 'west';
    if (value === 'q') return 'northwest';
    if (value === 'e') return 'northeast';
    if (value === 'z') return 'southwest';
    if (value === 'c') return 'southeast';
    return null;
}
