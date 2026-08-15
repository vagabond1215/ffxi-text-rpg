import test from 'node:test';
import assert from 'node:assert/strict';

import { createNewGameState } from '../js/text/gameState.js';
import { grantCapability } from '../js/text/systems/capabilityEngine.js';
import { performPlayerAttack, startEncounter } from '../js/text/systems/combatActionEngine.js';
import { COMBAT_CONTRACT_VERSION, selectEnemyAction, validateCombatContract } from '../js/text/systems/combatTurnEngine.js';
import { equipItem } from '../js/text/systems/equipmentEngine.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { createSequenceRng } from '../js/text/systems/rng.js';
import { listSemanticEvents } from '../js/text/systems/semanticEventEngine.js';
import { setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';
import { createCanvasUiState } from '../js/text/ui/canvasInput.js';
import { dispatchUiIntent } from '../js/text/ui/uiIntentDispatcher.js';

test('encounter initializes the additive Combat 2.0 action contract', () => {
    const state = createNewGameState();
    startEncounter(state, 'Mossback Goblin', { rng: createSequenceRng([0.1, 0.5]) });

    assert.equal(state.activeBattle.contract.version, COMBAT_CONTRACT_VERSION);
    assert.equal(state.activeBattle.contract.actionSequence, 0);
    assert.deepEqual(state.activeBattle.contract.actions, []);
    assert.deepEqual(validateCombatContract(state.activeBattle), []);
});

test('player basic attack and deterministic enemy response share structured combat action history', () => {
    const state = createNewGameState();
    startEncounter(state, 'Mossback Goblin', { rng: createSequenceRng([0.1, 0.5, 0.1, 0.5]) });
    const player = getBattlePlayer(state);
    const enemy = getBattleEnemy(state);
    const playerHpBefore = player.resources.hp;

    performPlayerAttack(state);

    const actions = state.activeBattle.contract.actions;
    assert.equal(actions.length, 2);
    assert.deepEqual(actions.map((action) => action.kind), ['basicAttack', 'basicAttack']);
    assert.equal(actions[0].actorType, 'player');
    assert.equal(actions[0].targetId, enemy.id);
    assert.equal(actions[1].actorType, 'enemy');
    assert.equal(actions[1].targetId, player.id);
    assert.equal(actions[1].sourceId, 'basic-attack-v1');
    assert.equal(actions[1].data.triggerActionId, actions[0].id);
    assert.equal(state.activeBattle.round, 2);
    assert.ok(player.resources.hp < playerHpBefore);
    assert.equal(state.player.resources.hp, player.resources.hp);
    assert.deepEqual(validateCombatContract(state.activeBattle), []);

    const combatEvents = listSemanticEvents(state, { type: 'combat.action.resolved' });
    assert.equal(combatEvents.length, 2);
    assert.deepEqual(combatEvents.map((event) => event.data.actionId), actions.map((action) => action.id));
});

test('semantic canonical ability resolution receives the same deterministic enemy response without command routing', () => {
    const state = createNewGameState({ mainJobId: 'vanguard' });
    equipSword(state);
    grantCapability(state.player, 'technique-guarded-cut');
    setLearnedSkill(state.player, 'sword', 1);
    state.player.resources.tp = 500;
    startEncounter(state, 'Mossback Goblin', { rng: createSequenceRng([0.1, 0.5]) });
    getBattlePlayer(state).resources.tp = 500;

    const uiState = createCanvasUiState({ screen: 'game' });
    const session = { loggedIn: true, accounts: [], settings: {} };
    const result = dispatchUiIntent({
        intent: 'ability.activate',
        payload: { abilityId: 'ability-guarded-cut' },
        state,
        uiState,
        session,
        services: { loadAccountSession: () => session },
    });

    assert.equal(result.ok, true);
    assert.equal(result.abilityResult.code, 'ability.resolved');
    assert.deepEqual(uiState.commandHistory, []);

    const actions = state.activeBattle.contract.actions;
    assert.equal(actions.length, 2);
    assert.equal(actions[0].kind, 'ability');
    assert.equal(actions[0].sourceId, 'ability-guarded-cut');
    assert.equal(actions[0].actorType, 'player');
    assert.equal(actions[1].actorType, 'enemy');
    assert.equal(actions[1].data.triggerActionId, actions[0].id);
    assert.equal(result.abilityResult.data.combatActionId, actions[0].id);
    assert.deepEqual(result.abilityResult.data.enemyResponseActionIds, [actions[1].id]);
    assert.equal(state.activeBattle.round, 2);
    assert.deepEqual(validateCombatContract(state.activeBattle), []);
});

test('enemy action selection is explicit and deterministic rather than inferred from battle prose', () => {
    const state = createNewGameState();
    startEncounter(state, 'Mossback Goblin');
    const enemy = getBattleEnemy(state);
    const player = getBattlePlayer(state);

    assert.deepEqual(selectEnemyAction(state.activeBattle, enemy), {
        kind: 'basicAttack',
        actorId: enemy.id,
        targetId: player.id,
        policy: 'basic-attack-v1',
    });
});

function equipSword(state) {
    addItemToContainer(state.player.inventoryState, 'inventory', {
        id: 'bronze-sword',
        name: 'Bronze Sword',
        kind: 'equipment',
        quantity: 1,
        tags: ['weapon', 'sword', 'starter'],
    });
    const result = equipItem(state, 'Bronze Sword');
    assert.match(result, /Equipped Bronze Sword/);
}

function getBattlePlayer(state) {
    return state.activeBattle.combatants.find((combatant) => combatant.type === 'player');
}

function getBattleEnemy(state) {
    return state.activeBattle.combatants.find((combatant) => combatant.type === 'enemy');
}
