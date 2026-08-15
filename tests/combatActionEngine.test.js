import test from 'node:test';
import assert from 'node:assert/strict';

import { createCommandRouter } from '../js/text/commandRouter.js';
import { createInitialState, createNewGameState } from '../js/text/gameState.js';
import {
    castSpell,
    performPlayerAttack,
    performWeaponSkill,
    startEncounter,
} from '../js/text/systems/combatActionEngine.js';
import { equipItem } from '../js/text/systems/equipmentEngine.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { getLearnedSkill, setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';


test('startEncounter creates an active battle', () => {
    const state = createInitialState();
    const result = startEncounter(state, 'Brush Hare');

    assert.equal(result.ok, true);
    assert.equal(state.activeBattle.phase, 'active');
    assert.match(result.message, /Battle/);
});

test('performPlayerAttack advances battle log', () => {
    const state = createInitialState();
    startEncounter(state, 'Brush Hare');
    const before = state.activeBattle.log.length;
    const result = performPlayerAttack(state);

    assert.ok(state.activeBattle.log.length > before);
    assert.match(result, /Battle/);
});

test('basic attack with Bronze Sword gains sword skill', () => {
    const state = createInitialState();
    equipCatalogItem(state, 'bronze-sword', 'Bronze Sword', ['weapon', 'sword', 'starter']);
    startEncounter(state, 'Brush Hare');

    const result = performPlayerAttack(state);

    assert.equal(getLearnedSkill(state.player, 'sword'), 1);
    assert.match(result, /Skill gained: sword 0 -> 1 \/ cap 2\./);
});

test('skills command reflects skill gains after combat actions', () => {
    const state = createInitialState();
    equipCatalogItem(state, 'bronze-sword', 'Bronze Sword', ['weapon', 'sword', 'starter']);
    startEncounter(state, 'Brush Hare');
    performPlayerAttack(state);

    const router = createCommandRouter(state, commandServices());

    assert.match(router('skills'), /sword: learned 1/);
});

test('basic attack with Bronze Axe gains axe skill', () => {
    const state = createInitialState();
    equipCatalogItem(state, 'bronze-axe', 'Bronze Axe', ['weapon', 'axe', 'starter']);
    startEncounter(state, 'Brush Hare');

    const result = performPlayerAttack(state);

    assert.equal(getLearnedSkill(state.player, 'axe'), 1);
    assert.match(result, /Skill gained: axe 0 -> 1 \/ cap 3\./);
});

test('basic attack with no main-hand weapon gains handToHand for disciplines with a cap', () => {
    const state = createNewGameState({ mainJobId: 'pugilist' });
    startEncounter(state, 'Brush Hare');

    const result = performPlayerAttack(state);

    assert.equal(getLearnedSkill(state.player, 'handToHand'), 1);
    assert.match(result, /Skill gained: handToHand 0 -> 1 \/ cap 3\./);
});

test('weapon skill requires TP', () => {
    const state = createInitialState();
    startEncounter(state, 'Brush Hare');

    assert.match(performWeaponSkill(state, 'Fast Blade'), /Not enough TP/);
});

test('weapon skill gains the equipped main-hand weapon skill once', () => {
    const state = createInitialState();
    equipCatalogItem(state, 'bronze-sword', 'Bronze Sword', ['weapon', 'sword', 'starter']);
    startEncounter(state, 'Brush Hare');
    getBattlePlayer(state).resources.tp = 1000;

    const result = performWeaponSkill(state, 'Fast Blade');

    assert.equal(getLearnedSkill(state.player, 'sword'), 1);
    assert.match(result, /Skill gained: sword 0 -> 1 \/ cap 2\./);
});

test('cast spell requires active battle', () => {
    const state = createInitialState();

    assert.equal(castSpell(state, 'Cure'), 'You are not in battle.');
});

test('Cure-like spells gain healing magic', () => {
    const state = createNewGameState({ mainJobId: 'lifewarden' });
    startEncounter(state, 'Brush Hare');
    getBattlePlayer(state).resources.mp = 100;

    const result = castSpell(state, 'Cure');

    assert.equal(getLearnedSkill(state.player, 'healingMagic'), 1);
    assert.match(result, /Skill gained: healingMagic 0 -> 1 \/ cap 3\./);
});

test('offensive placeholder spells gain elemental magic', () => {
    const state = createNewGameState({ mainJobId: 'elementalist' });
    startEncounter(state, 'Brush Hare');
    getBattlePlayer(state).resources.mp = 100;

    const result = castSpell(state, 'Fire');

    assert.equal(getLearnedSkill(state.player, 'elementalMagic'), 1);
    assert.match(result, /Skill gained: elementalMagic 0 -> 1 \/ cap 3\./);
});

test('skill gain clamps at current discipline cap and omits capped spam', () => {
    const state = createInitialState();
    equipCatalogItem(state, 'bronze-axe', 'Bronze Axe', ['weapon', 'axe', 'starter']);
    setLearnedSkill(state.player, 'axe', 3);
    startEncounter(state, 'Brush Hare');

    const result = performPlayerAttack(state);

    assert.equal(getLearnedSkill(state.player, 'axe'), 3);
    assert.doesNotMatch(result, /Skill gained:/);
});

test('router exposes encounter battle attack and slash commands across combat recovery', () => {
    const state = createInitialState();
    const router = createCommandRouter(state, commandServices());

    assert.match(router('encounter Brush Hare'), /Battle/);
    assert.match(router('battle'), /Battle/);
    assert.match(router('attack'), /Battle/);
    assert.match(router('wait 3'), /Advanced 3s/);
    assert.match(router('/attack'), /Battle/);
});

function equipCatalogItem(state, id, name, tags) {
    addItemToContainer(state.player.inventoryState, 'inventory', { id, name, kind: 'equipment', quantity: 1, tags });
    const result = equipItem(state, name);
    assert.match(result, new RegExp(`Equipped ${name}`));
}

function getBattlePlayer(state) {
    return state.activeBattle.combatants.find((combatant) => combatant.type === 'player');
}

function commandServices() {
    return {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    };
}
