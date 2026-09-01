import { getPlace } from '../data/places.js';
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
import { advanceActiveActivityToCompletion } from '../systems/activityAdvanceEngine.js';
import { setCreatorName, validateCreator } from '../systems/characterCreationModel.js';
import { startCampaignRecovery } from '../systems/campaignRecoveryEngine.js';
import {
    acceptCommitment,
    performCommitmentFollowUp,
    resolveCommitment,
} from '../systems/commitmentEngine.js';
import { performPlayerAttack, startEncounter } from '../systems/combatActionEngine.js';
import { advanceCombatSimulation } from '../systems/combatSimulationEngine.js';
import { startCombatEquipTransition, startCombatUnequipTransition } from '../systems/combatLoadoutEngine.js';
import { equipItem, unequipItem } from '../systems/equipmentEngine.js';
import { startGatheringWork } from '../systems/gatheringWorkEngine.js';
import {
    enterLocalityPoi,
    exploreLocality,
    leaveLocalityPoi,
    lookAroundLocality,
    moveWithinLocality,
    performLocalityPoiAction,
    visitLocalityPoi,
} from '../systems/localityEngine.js';
import { claimOriginStarterKit } from '../systems/playerExperienceEngine.js';
import { claimProductionOutputs, startProductionWork } from '../systems/productionEngine.js';
import { startCharacterResourceRecovery } from '../systems/resourceRecoveryWorkAdapter.js';
import { buyFromCurrentShopAction, sellToCurrentShopAction } from '../systems/shopEngine.js';
import { startScheduledTransport } from '../systems/transportEngine.js';
import { startTravel } from '../systems/travelEngine.js';
import { appendOutput, isMovementOnCooldown, setActiveFeedback } from './canvasInput.js';
import { createCommandIntentAdapter } from './commandIntentAdapter.js';
import { renderDomApp } from './domRenderer.js';
import { createGameViewModel } from './gameViewModel.js';
import { createMenuActionList } from './uiActions.js';
import { dispatchUiIntent } from './uiIntentDispatcher.js';
import { createUiState, setActiveView } from './uiState.js';

const DIRECT_GAMEPLAY_INTENTS = Object.freeze([
    'locality.look',
    'locality.explore',
    'locality.move',
    'locality.poi.visit',
    'locality.poi.enter',
    'locality.poi.leave',
    'locality.poi',
    'playerExperience.claimStarterKit',
    'commitment.accept',
    'commitment.resolve',
    'commitment.followUp',
    'equipment.equip',
    'equipment.unequip',
    'travel.start',
    'transport.start',
    'gathering.start',
    'production.start',
    'production.claimOutputs',
    'shop.buy',
    'shop.sell',
    'activity.advanceToCompletion',
    'combat.encounter',
    'combat.attack',
    'combat.wait',
    'resource.recovery.start',
    'recovery.start',
]);

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
        if (intent === 'ui.view.open') {
            const view = setActiveView(uiState, payload.view);
            result = { ok: true, view };
        } else if (intent === 'ui.search') {
            const query = String(payload.query ?? '').trim();
            uiState.informationQuery = query;
            setActiveView(uiState, 'codex');
            result = { ok: true, query };
        } else if (intent === 'ui.search.clear') {
            uiState.informationQuery = '';
            result = { ok: true };
        } else if (intent === 'locality.look') {
            result = lookAroundLocality(state);
            recordGameplayFeedback(result);
        } else if (intent === 'locality.explore') {
            result = exploreLocality(state);
            recordGameplayFeedback(result);
        } else if (intent === 'locality.move') {
            result = moveWithinLocality(state, payload.destinationId);
            recordGameplayFeedback(result);
        } else if (intent === 'locality.poi.visit') {
            result = visitLocalityPoi(state, payload.poiId);
            recordGameplayFeedback(result);
        } else if (intent === 'locality.poi.enter') {
            result = enterLocalityPoi(state, payload.poiId);
            recordGameplayFeedback(result);
        } else if (intent === 'locality.poi.leave') {
            result = leaveLocalityPoi(state);
            recordGameplayFeedback(result);
        } else if (intent === 'locality.poi') {
            result = performLocalityPoiAction(state, payload.poiId, payload.action);
            recordGameplayFeedback(result);
        } else if (intent === 'playerExperience.claimStarterKit') {
            result = claimOriginStarterKit(state);
            recordGameplayFeedback(result);
        } else if (intent === 'commitment.accept') {
            result = acceptCommitment(state, payload.commitmentId);
            recordGameplayFeedback(result);
        } else if (intent === 'commitment.resolve') {
            result = resolveCommitment(state, payload.commitmentId);
            recordGameplayFeedback(result);
        } else if (intent === 'commitment.followUp') {
            result = performCommitmentFollowUp(state, payload.commitmentId);
            recordGameplayFeedback(result);
        } else if (intent === 'equipment.equip') {
            if (state.activeBattle?.phase === 'active') {
                result = startCombatEquipTransition(state, payload.itemId, { slot: payload.slot, fromContainerId: payload.fromContainerId });
            } else {
                const message = equipItem(state, payload.itemId, { slot: payload.slot, fromContainerId: payload.fromContainerId });
                const equipped = Object.values(state.player?.equipment ?? {}).some((item) => item && (item.templateId === payload.itemId || item.id === payload.itemId));
                result = { ok: equipped, message };
            }
            recordGameplayFeedback(result);
        } else if (intent === 'equipment.unequip') {
            if (state.activeBattle?.phase === 'active') {
                result = startCombatUnequipTransition(state, payload.slot, payload.destinationContainerId ?? 'inventory');
            } else {
                const itemBefore = state.player?.equipment?.[payload.slot] ?? null;
                const message = unequipItem(state, payload.slot, payload.destinationContainerId ?? 'inventory');
                const unequipped = Boolean(itemBefore) && !state.player?.equipment?.[payload.slot];
                result = { ok: unequipped, message };
            }
            recordGameplayFeedback(result);
        } else if (intent === 'travel.start') {
            result = startTravel(state, payload.destinationId);
            recordGameplayFeedback(result);
        } else if (intent === 'transport.start') {
            result = startScheduledTransport(state, payload.serviceId, payload.destinationPlaceId, { cargoUnits: payload.cargoUnits ?? 0 });
            recordGameplayFeedback(result);
        } else if (intent === 'gathering.start') {
            result = startGatheringWork(state, payload.sourceId, { quantity: payload.quantity ?? 1 });
            recordGameplayFeedback(result);
        } else if (intent === 'production.start') {
            result = startProductionWork(state, payload.processId, { containerId: payload.containerId ?? 'inventory' });
            recordGameplayFeedback(result);
        } else if (intent === 'production.claimOutputs') {
            result = claimProductionOutputs(state, payload.workId, { containerId: payload.containerId ?? 'inventory' });
            recordGameplayFeedback(result);
        } else if (intent === 'shop.buy') {
            result = buyFromCurrentShopAction(state, payload.itemQuery, payload.shopQuery);
            recordGameplayFeedback(result);
        } else if (intent === 'shop.sell') {
            const query = payload.quantity > 1 ? `${payload.itemQuery} x${payload.quantity}` : payload.itemQuery;
            result = sellToCurrentShopAction(state, query, payload.shopQuery);
            recordGameplayFeedback(result);
        } else if (intent === 'activity.advanceToCompletion') {
            result = advanceActiveActivityToCompletion(state);
            recordGameplayFeedback(result);
        } else if (intent === 'combat.encounter') {
            const place = getPlace(state.currentPlaceId);
            const present = place?.spawnRules?.some((rule) => rule.enemyId === payload.enemyId);
            if ((Number(state.player?.resources?.hp) || 0) <= 0) {
                result = { ok: false, message: 'You are incapacitated and must recover before entering another encounter.' };
            } else {
                result = present
                    ? startEncounter(state, payload.enemyId, { source: 'player-opportunity' })
                    : { ok: false, message: 'That field threat is not present in the current place.' };
            }
            recordGameplayFeedback(result);
        } else if (intent === 'combat.attack') {
            const message = performPlayerAttack(state, payload.targetId);
            const ok = !/not in battle|still recovering|not yet ready/i.test(String(message));
            result = { ok, message };
            recordGameplayFeedback(result);
        } else if (intent === 'combat.wait') {
            result = advanceCombatSimulation(state, payload.seconds ?? 1);
            recordGameplayFeedback(result);
        } else if (intent === 'resource.recovery.start') {
            result = startCharacterResourceRecovery(state, payload.opportunityId, payload.actionId);
            recordGameplayFeedback(result);
        } else if (intent === 'recovery.start') {
            result = startCampaignRecovery(state);
            recordGameplayFeedback(result);
        } else {
            result = dispatchUiIntent({ intent, payload, state, uiState, session, services });
        }
        session = result.session ?? session;
        if (!result.ok && !DIRECT_GAMEPLAY_INTENTS.includes(intent)) {
            setActiveFeedback(uiState, result.reason);
            appendOutput(uiState, result.reason);
        }
        if (options.render !== false) render();
        return result;
    }

    function recordGameplayFeedback(result) {
        const message = result?.message ?? result?.display?.text ?? result?.reason ?? 'Action updated.';
        setActiveFeedback(uiState, message);
        appendOutput(uiState, message);
        appendOutput(uiState, '');
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

        if (button.dataset.informationAction) {
            const model = createGameViewModel(state, uiState);
            const action = model.information?.actions?.find((item) => item.id === button.dataset.informationAction);
            if (action) dispatch(action.intent, action.payload);
            return;
        }

        if (button.dataset.partyAction) {
            const model = createGameViewModel(state, uiState);
            const action = model.party?.actions?.find((item) => item.id === button.dataset.partyAction);
            if (action) dispatch(action.intent, action.payload);
            return;
        }

        if (button.dataset.opportunityAction) {
            const model = createGameViewModel(state, uiState);
            const opportunity = model.opportunities?.entries?.find((entry) => entry.id === button.dataset.opportunityAction);
            if (opportunity?.action) dispatch(opportunity.action.intent, opportunity.action.payload);
            return;
        }

        if (button.dataset.serviceAction) {
            const model = createGameViewModel(state, uiState);
            const action = model.settlementServices?.actions?.find((item) => item.id === button.dataset.serviceAction);
            if (action) dispatch(action.intent, action.payload);
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
        const value = input?.value?.trim();
        if (!value) return;
        if (value.startsWith('/')) runCommand(value);
        else dispatch('ui.search', { query: value });
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
