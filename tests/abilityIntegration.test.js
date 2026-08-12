import test from 'node:test';
import assert from 'node:assert/strict';

import { createCommandRouter } from '../js/text/commandRouter.js';
import { createNewGameState } from '../js/text/gameState.js';
import { grantCapability } from '../js/text/systems/capabilityEngine.js';
import { startEncounter } from '../js/text/systems/combatActionEngine.js';
import { setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';
import { createCanvasUiState } from '../js/text/ui/canvasInput.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { dispatchUiIntent } from '../js/text/ui/uiIntentDispatcher.js';

test('canonical ability commands list original abilities and invoke without using the legacy cast adapter', () => {
    const state = createNewGameState({ mainJobId: 'wayfinder' });
    grantCapability(state.player, 'practical-waymark-reading');
    const route = createCommandRouter(state);

    const listing = route('abilities');
    assert.match(listing, /Waymark Reading/);
    assert.doesNotMatch(listing, /\bCure\b|\bFire\b/);

    const started = route('invoke Waymark Reading');
    assert.match(started, /Waymark Reading begins/);
    assert.equal(state.abilities.active?.abilityId, 'ability-waymark-reading');
});

test('wait advances canonical fictional time and reconciles a non-combat ability activation', () => {
    const state = createNewGameState({ mainJobId: 'wayfinder' });
    grantCapability(state.player, 'practical-waymark-reading');
    const route = createCommandRouter(state);

    route('invoke Waymark Reading');
    const before = state.worldTime.totalSeconds;
    const result = route('wait 3');

    assert.equal(state.worldTime.totalSeconds, before + 3);
    assert.equal(state.abilities.active, null);
    assert.match(result, /Advanced 3s\./);
    assert.match(result, /Waymark Reading resolves/);
});

test('semantic ability UI intent activates an ability without manufacturing a command string', () => {
    const state = createNewGameState({ mainJobId: 'wayfinder' });
    grantCapability(state.player, 'practical-waymark-reading');
    const uiState = createCanvasUiState({ screen: 'game' });
    const session = { loggedIn: true, accounts: [], settings: {} };

    const result = dispatchUiIntent({
        intent: 'ability.activate',
        payload: { abilityId: 'ability-waymark-reading' },
        state,
        uiState,
        session,
        services: { loadAccountSession: () => session },
    });

    assert.equal(result.ok, true);
    assert.equal(result.abilityResult.code, 'ability.started');
    assert.equal(state.abilities.active?.abilityId, 'ability-waymark-reading');
    assert.deepEqual(uiState.commandHistory, []);
    assert.equal(uiState.outputLines.some((line) => line.startsWith('> ')), false);
});

test('game view model exposes only learned abilities and uses semantic ability actions in combat', () => {
    const state = createNewGameState({ mainJobId: 'elementalist' });
    grantCapability(state.player, 'spell-ember-dart');
    setLearnedSkill(state.player, 'elementalMagic', 1);
    state.player.resources.mp = 100;

    let model = createGameViewModel(state);
    assert.deepEqual(model.spellbook.entries.map((entry) => entry.name), ['Ember Dart']);
    assert.equal(model.spellbook.entries[0].intent, 'ability.activate');
    assert.equal(model.spellbook.entries[0].available, false);

    startEncounter(state, 'Brush Hare');
    model = createGameViewModel(state);
    const abilityAction = model.contextualActions.find((action) => action.payload?.abilityId === 'ability-ember-dart');

    assert.ok(abilityAction);
    assert.equal(abilityAction.intent, 'ability.activate');
    assert.equal(abilityAction.label, 'Ember Dart');
    assert.equal(Object.hasOwn(abilityAction.payload, 'command'), false);
});
