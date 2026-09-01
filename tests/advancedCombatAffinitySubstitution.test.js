import test from 'node:test';
import assert from 'node:assert/strict';

import { EQUIPMENT_CATALOG } from '../js/text/data/equipmentCatalog.js';
import { WEAPON_KATA_CONFIGURATION_VERSION, validateWeaponKataCatalog } from '../js/text/data/weaponKataCatalog.js';
import { createNewGameState } from '../js/text/gameState.js';
import { createAccountWithPassword, loadCharacter, saveGame } from '../js/text/save.js';
import {
    CHARACTER_AFFINITY_STATE_VERSION,
    gainCharacterAffinity,
    getCharacterAffinityRank,
    setCharacterAffinityRank,
    validateCharacterAffinityState,
} from '../js/text/systems/characterAffinityEngine.js';
import { performPlayerAttack, startEncounter } from '../js/text/systems/combatActionEngine.js';
import { setCombatantReadyAt } from '../js/text/systems/combatTurnEngine.js';
import { equipItem } from '../js/text/systems/equipmentEngine.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { switchMainJob } from '../js/text/systems/progressionEngine.js';
import { setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';
import { configureWeaponKataSelection } from '../js/text/systems/weaponKataEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';

test('Packet 2 adds character-owned affinity state without deriving it from discipline identity', () => {
    const state = createNewGameState({ mainJobId: 'elementalist' });
    assert.equal(state.player.progression.affinities.version, CHARACTER_AFFINITY_STATE_VERSION);
    assert.deepEqual(validateCharacterAffinityState(state.player.progression.affinities), []);
    assert.equal(getCharacterAffinityRank(state.player, 'fire'), 0);
    assert.equal(getCharacterAffinityRank(state.player, 'ice'), 0);

    const learned = gainCharacterAffinity(state.player, 'ice', 1, { source: 'training', worldSeconds: 12 });
    assert.equal(learned.ok, true);
    assert.equal(learned.rank, 1);
    assert.equal(switchMainJob(state.player, 'vanguard').ok, true);
    assert.equal(getCharacterAffinityRank(state.player, 'ice'), 1);
    assert.equal(getCharacterAffinityRank(state.player, 'fire'), 0);
});

test('affinity validation rejects unknown elements and malformed ranks', () => {
    const state = createNewGameState();
    state.player.progression.affinities.values.void = 1;
    state.player.progression.affinities.values.fire = 6;
    const issues = validateCharacterAffinityState(state.player.progression.affinities);
    assert.ok(issues.some((issue) => issue.includes('unknown element void')));
    assert.ok(issues.some((issue) => issue.includes('fire')));
    assert.equal(setCharacterAffinityRank(state.player, 'void', 1).ok, false);
    assert.equal(setCharacterAffinityRank(state.player, 'fire', -1).ok, false);
});

test('dagger affinity substitution requires both weapon proficiency and earned ice affinity', () => {
    assert.deepEqual(validateWeaponKataCatalog(), []);
    assert.equal(WEAPON_KATA_CONFIGURATION_VERSION, 2);
    const state = createNewGameState({ mainJobId: 'shadowhand' });
    setLearnedSkill(state.player, 'dagger', 2);

    let result = configureWeaponKataSelection(state, 'dagger', 1, 'dagger-rimepoint-thrust');
    assert.equal(result.ok, false);
    assert.equal(result.code, 'combat.kata.affinity');

    assert.equal(gainCharacterAffinity(state.player, 'ice', 1, { source: 'training' }).ok, true);
    setLearnedSkill(state.player, 'dagger', 0);
    result = configureWeaponKataSelection(state, 'dagger', 1, 'dagger-rimepoint-thrust');
    assert.equal(result.ok, false);
    assert.equal(result.code, 'combat.kata.proficiency');

    setLearnedSkill(state.player, 'dagger', 2);
    result = configureWeaponKataSelection(state, 'dagger', 1, 'dagger-rimepoint-thrust');
    assert.equal(result.ok, true);
    assert.equal(state.player.progression.weaponKata.selections.dagger['1'], 'dagger-rimepoint-thrust');
});

test('Rimepoint Thrust uses existing combat resolution and target ice resistance', () => {
    const state = createNewGameState({ mainJobId: 'shadowhand' });
    equip(state, 'bronze-dagger');
    setLearnedSkill(state.player, 'dagger', 2);
    gainCharacterAffinity(state.player, 'ice', 1, { source: 'training' });
    assert.equal(configureWeaponKataSelection(state, 'dagger', 1, 'dagger-rimepoint-thrust').ok, true);

    const { player, enemy } = begin(state);
    enemy.combat.resistances.ice = 50;
    performPlayerAttack(state);

    const action = lastPlayerAttack(state);
    assert.equal(action.sourceId, 'dagger-rimepoint-thrust');
    assert.equal(action.data.resolution.contract.channel, 'hybrid');
    assert.equal(action.data.resolution.contract.element, 'ice');
    assert.equal(action.data.resolution.contract.elementSource, 'characterAffinity');
    assert.equal(action.data.resolution.element.resistance, 50);
    assert.equal(action.data.resolution.element.multiplier, 0.5);
    assert.equal(action.data.kata.family, 'dagger');
    assert.equal(state.activeBattle.weaponKata.byActorId[player.id].lastMoveId, 'dagger-rimepoint-thrust');
});

test('configured affinity substitution falls back to physical default if affinity is later absent', () => {
    const state = createNewGameState({ mainJobId: 'shadowhand' });
    equip(state, 'bronze-dagger');
    setLearnedSkill(state.player, 'dagger', 2);
    gainCharacterAffinity(state.player, 'ice', 1);
    assert.equal(configureWeaponKataSelection(state, 'dagger', 1, 'dagger-rimepoint-thrust').ok, true);
    assert.equal(setCharacterAffinityRank(state.player, 'ice', 0).ok, true);

    begin(state);
    performPlayerAttack(state);
    assert.equal(lastPlayerAttack(state).sourceId, 'dagger-quick-thrust');
});

test('staff fire substitution proves the same affinity authority on a second weapon family', () => {
    const state = createNewGameState({ mainJobId: 'elementalist' });
    equip(state, 'ash-staff');
    setLearnedSkill(state.player, 'staff', 4);
    gainCharacterAffinity(state.player, 'fire', 1);
    assert.equal(configureWeaponKataSelection(state, 'staff', 3, 'staff-cinder-braced-drive').ok, true);

    const { player, enemy } = begin(state);
    enemy.combat.resistances.fire = 25;
    performPlayerAttack(state);
    setCombatantReadyAt(state, player.id, state.worldTime.totalSeconds);
    performPlayerAttack(state);
    setCombatantReadyAt(state, player.id, state.worldTime.totalSeconds);
    performPlayerAttack(state);

    const action = lastPlayerAttack(state);
    assert.equal(action.sourceId, 'staff-cinder-braced-drive');
    assert.equal(action.data.resolution.contract.element, 'fire');
    assert.equal(action.data.resolution.element.resistance, 25);
    assert.equal(action.data.resolution.defense.penetration, 0.03);
});

test('affinity and configured substitutions survive current-schema save/load', () => {
    globalThis.localStorage = new MemoryStorage();
    assert.equal(createAccountWithPassword('Affinity Kata Account', 'pwd', { persistentLogin: true }).ok, true);
    const state = createNewGameState({ mainJobId: 'shadowhand' });
    state.player.identity.name = 'Affinity Kata';
    setLearnedSkill(state.player, 'dagger', 2);
    gainCharacterAffinity(state.player, 'ice', 1, { source: 'training', worldSeconds: 22 });
    assert.equal(configureWeaponKataSelection(state, 'dagger', 1, 'dagger-rimepoint-thrust').ok, true);
    assert.equal(saveGame(state), true);

    const loaded = loadCharacter('Affinity Kata');
    assert.ok(loaded);
    assert.equal(loaded.player.progression.affinities.values.ice, 1);
    assert.equal(loaded.player.progression.weaponKata.version, 2);
    assert.equal(loaded.player.progression.weaponKata.selections.dagger['1'], 'dagger-rimepoint-thrust');
    assert.deepEqual(validateCurrentGameStateStructure(loaded), []);
});

function equip(state, id) {
    const stored = addItemToContainer(state.player.inventoryState, 'inventory', structuredClone(EQUIPMENT_CATALOG[id]));
    assert.equal(stored.ok, true, stored.reason);
    assert.match(equipItem(state, id), /Equipped/);
}

function begin(state) {
    const result = startEncounter(state, 'Training Dummy', { rng: () => 0.25 });
    assert.equal(result.ok, true, result.message);
    return {
        player: state.activeBattle.combatants.find((entry) => entry.type === 'player'),
        enemy: state.activeBattle.combatants.find((entry) => entry.type === 'enemy'),
    };
}

function playerAttacks(state) {
    return state.activeBattle.contract.actions.filter((entry) => entry.actorType === 'player' && entry.kind === 'basicAttack');
}

function lastPlayerAttack(state) {
    return playerAttacks(state).at(-1);
}

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}
