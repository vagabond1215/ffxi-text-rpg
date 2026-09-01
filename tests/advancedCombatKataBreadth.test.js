import test from 'node:test';
import assert from 'node:assert/strict';

import { EQUIPMENT_CATALOG } from '../js/text/data/equipmentCatalog.js';
import {
    WEAPON_KATA_CONFIGURATION_VERSION,
    createDefaultWeaponKataConfiguration,
    validateWeaponKataCatalog,
    validateWeaponKataConfiguration,
} from '../js/text/data/weaponKataCatalog.js';
import { createNewGameState } from '../js/text/gameState.js';
import { performPlayerAttack, startEncounter } from '../js/text/systems/combatActionEngine.js';
import { getCombatantReadyAt, setCombatantReadyAt } from '../js/text/systems/combatTurnEngine.js';
import { equipItem } from '../js/text/systems/equipmentEngine.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';

test('0.9.300 P1 kata catalog covers every currently equipped canonical melee family', () => {
    assert.deepEqual(validateWeaponKataCatalog(), []);
    const config = createDefaultWeaponKataConfiguration();
    assert.equal(WEAPON_KATA_CONFIGURATION_VERSION, 2);
    assert.equal(config.version, 2);
    assert.deepEqual(Object.keys(config.selections).sort(), ['axe', 'club', 'dagger', 'staff', 'sword']);
    assert.deepEqual(validateWeaponKataConfiguration(config), []);
});

test('axe kata expresses committed cadence and increasing defense penetration', () => {
    const state = createNewGameState({ mainJobId: 'vanguard' });
    equip(state, 'bronze-axe');
    setLearnedSkill(state.player, 'axe', 4);
    const { player } = begin(state);

    performPlayerAttack(state);
    let action = lastPlayerAttack(state);
    assert.equal(action.sourceId, 'axe-set-hew');
    assert.equal(action.data.kata.family, 'axe');
    assert.equal(action.data.cadence.delayUnits, 288);
    assert.equal(getCombatantReadyAt(state, player.id), action.atWorldSeconds + 5);

    setCombatantReadyAt(state, player.id, state.worldTime.totalSeconds);
    performPlayerAttack(state);
    action = lastPlayerAttack(state);
    assert.equal(action.sourceId, 'axe-hooking-chop');
    assert.equal(action.data.resolution.defense.penetration, 0.05);
    assert.equal(getCombatantReadyAt(state, player.id), action.atWorldSeconds + 6);

    setCombatantReadyAt(state, player.id, state.worldTime.totalSeconds);
    performPlayerAttack(state);
    action = lastPlayerAttack(state);
    assert.equal(action.sourceId, 'axe-driving-cleave');
    assert.equal(action.data.resolution.defense.penetration, 0.12);
    assert.equal(getCombatantReadyAt(state, player.id), action.atWorldSeconds + 7);
    assert.equal(state.activeBattle.weaponKata.byActorId[player.id].nextSlot, 1);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('staff and club equipment bind to their own proficiency-gated kata families', () => {
    const cases = [
        { job: 'elementalist', itemId: 'ash-staff', skillId: 'staff', family: 'staff', sourceId: 'staff-measured-thrust', delay: 366, recovery: 6 },
        { job: 'lifewarden', itemId: 'maple-wand', skillId: 'club', family: 'club', sourceId: 'club-short-strike', delay: 216, recovery: 4 },
    ];

    for (const entry of cases) {
        const state = createNewGameState({ mainJobId: entry.job });
        equip(state, entry.itemId);
        setLearnedSkill(state.player, entry.skillId, 4);
        const { player } = begin(state);
        performPlayerAttack(state);
        const action = lastPlayerAttack(state);
        assert.equal(action.sourceId, entry.sourceId);
        assert.equal(action.data.kata.family, entry.family);
        assert.equal(action.data.kata.slot, 1);
        assert.equal(action.data.cadence.delayUnits, entry.delay);
        assert.equal(getCombatantReadyAt(state, player.id), action.atWorldSeconds + entry.recovery);
        assert.deepEqual(validateCurrentGameStateStructure(state), []);
    }
});

test('new kata families remain proficiency gated at one two and three automatic slots', () => {
    for (const learned of [0, 2, 4]) {
        const state = createNewGameState({ mainJobId: 'vanguard' });
        equip(state, 'bronze-axe');
        setLearnedSkill(state.player, 'axe', learned);
        const { player } = begin(state);

        performPlayerAttack(state);
        setCombatantReadyAt(state, player.id, state.worldTime.totalSeconds);
        performPlayerAttack(state);
        setCombatantReadyAt(state, player.id, state.worldTime.totalSeconds);
        performPlayerAttack(state);

        const sources = playerAttacks(state).slice(-3).map((action) => action.sourceId);
        if (learned === 0) assert.deepEqual(sources, ['axe-set-hew', 'axe-set-hew', 'axe-set-hew']);
        if (learned === 2) assert.deepEqual(sources, ['axe-set-hew', 'axe-hooking-chop', 'axe-set-hew']);
        if (learned === 4) assert.deepEqual(sources, ['axe-set-hew', 'axe-hooking-chop', 'axe-driving-cleave']);
    }
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