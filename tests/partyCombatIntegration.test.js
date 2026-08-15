import test from 'node:test';
import assert from 'node:assert/strict';

import { getPlace } from '../js/text/data/places.js';
import { createNewGameState } from '../js/text/gameState.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import {
    COMBAT_SIDES,
    getCombatantSide,
    resolveBasicAttack,
    updateBattlePhase,
} from '../js/text/systems/battleEngine.js';
import { performPlayerAttack, startEncounter } from '../js/text/systems/combatActionEngine.js';
import { finalizeCombatState } from '../js/text/systems/combatTurnEngine.js';
import { getRecruitedCompanion, recruitCompanion } from '../js/text/systems/partyEngine.js';
import { createSequenceRng } from '../js/text/systems/rng.js';

const MARA_ID = 'companion-mara-venn';

function setupPartyBattle() {
    const state = createNewGameState();
    const place = getPlace('timbercross-landing');
    const moved = setPositionAndDiscover(state, place.id, place.coordinateSystem.start);
    assert.equal(moved.ok, true);
    assert.equal(recruitCompanion(state, MARA_ID).ok, true);
    const started = startEncounter(state, 'Redfang Raider', {
        rng: createSequenceRng([0.1, 0.5, 0.1, 0.5, 0.1, 0.5, 0.1, 0.5]),
    });
    assert.equal(started.ok, true);
    return state;
}

test('active persistent companion enters battle as an ally and cannot be hit by friendly basic attacks', () => {
    const state = setupPartyBattle();
    const player = state.activeBattle.combatants.find((entry) => entry.type === 'player');
    const companion = state.activeBattle.combatants.find((entry) => entry.type === 'companion');

    assert.ok(companion);
    assert.equal(getCombatantSide(player), COMBAT_SIDES.ALLY);
    assert.equal(getCombatantSide(companion), COMBAT_SIDES.ALLY);

    const friendly = resolveBasicAttack(state.activeBattle, player.id, companion.id);
    assert.equal(friendly.ok, false);
    assert.equal(friendly.outcome, 'friendly-target');
});

test('ready companion contributes a structured Combat 2.0 action after the player acts', () => {
    const state = setupPartyBattle();

    performPlayerAttack(state);

    const companionActions = state.activeBattle.contract.actions.filter((entry) => entry.actorType === 'companion');
    assert.equal(companionActions.length, 1);
    assert.equal(companionActions[0].kind, 'basicAttack');
    assert.equal(companionActions[0].sourceId, 'basic-attack-v1');
    assert.equal(companionActions[0].data.triggerActionId, 'combat-action-000001');
});

test('companion battle resources synchronize back to the persistent party record', () => {
    const state = setupPartyBattle();
    const combatant = state.activeBattle.combatants.find((entry) => entry.type === 'companion');
    combatant.resources.hp = Math.max(1, combatant.resources.hp - 7);

    finalizeCombatState(state);

    assert.equal(getRecruitedCompanion(state, MARA_ID).resources.hp, combatant.resources.hp);
});

test('battle defeat is side-based: a living companion can remain after the player falls', () => {
    const state = setupPartyBattle();
    const player = state.activeBattle.combatants.find((entry) => entry.type === 'player');
    const companion = state.activeBattle.combatants.find((entry) => entry.type === 'companion');

    player.resources.hp = 0;
    player.battle.defeated = true;
    assert.equal(updateBattlePhase(state.activeBattle), 'active');

    companion.resources.hp = 0;
    companion.battle.defeated = true;
    assert.equal(updateBattlePhase(state.activeBattle), 'defeat');
});
