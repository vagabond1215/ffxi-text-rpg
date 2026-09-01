import test from 'node:test';
import assert from 'node:assert/strict';

import {
    ABILITY_CATALOG_VERSION,
    getAbility,
    listAbilities,
    validateAbilityCatalog,
} from '../js/text/data/abilities.js';
import { createNewGameState } from '../js/text/gameState.js';
import { activateAbility, reconcileAbilityActivation } from '../js/text/systems/abilityEngine.js';
import { grantCapability } from '../js/text/systems/capabilityEngine.js';
import {
    getCombatantReadyAt,
    reconcileCombatStatuses,
    setCombatantReadyAt,
} from '../js/text/systems/combatTurnEngine.js';
import { startEncounter } from '../js/text/systems/combatActionEngine.js';
import { setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';
import { applyStatus } from '../js/text/systems/statusEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

const NOVICE_ELEMENTAL = Object.freeze([
    { id: 'ability-cinder-bolt', capabilityId: 'spell-cinder-bolt', element: 'fire', skillId: 'elementalMagic', stat: 'int', delivery: 'projectile' },
    { id: 'ability-stone-shards', capabilityId: 'spell-stone-shards', element: 'earth', skillId: 'elementalMagic', stat: 'int', delivery: 'projectile' },
    { id: 'ability-gale-cutter', capabilityId: 'spell-gale-cutter', element: 'wind', skillId: 'elementalMagic', stat: 'int', delivery: 'spell' },
    { id: 'ability-tide-needle', capabilityId: 'spell-tide-needle', element: 'water', skillId: 'elementalMagic', stat: 'int', delivery: 'projectile' },
    { id: 'ability-storm-jolt', capabilityId: 'spell-storm-jolt', element: 'lightning', skillId: 'elementalMagic', stat: 'int', delivery: 'spell' },
    { id: 'ability-rime-splinters', capabilityId: 'spell-rime-splinters', element: 'ice', skillId: 'elementalMagic', stat: 'int', delivery: 'projectile' },
    { id: 'ability-sunlance', capabilityId: 'spell-sunlance', element: 'light', skillId: 'divineMagic', stat: 'mnd', delivery: 'projectile' },
    { id: 'ability-gloam-spike', capabilityId: 'spell-gloam-spike', element: 'dark', skillId: 'darkMagic', stat: 'int', delivery: 'projectile' },
]);

test('Packet 3 migrates exactly the eight novice Elemental Form attacks without adding abilities', () => {
    assert.equal(ABILITY_CATALOG_VERSION, 7);
    assert.equal(listAbilities().length, 41);
    assert.deepEqual(validateAbilityCatalog(), []);

    for (const entry of NOVICE_ELEMENTAL) {
        const ability = getAbility(entry.id);
        assert.ok(ability);
        assert.equal(ability.capabilityId, entry.capabilityId);
        assert.equal(ability.schoolId, 'school-elemental-form');
        assert.deepEqual(ability.contexts, ['combat']);
        assert.equal(ability.target.kind, 'enemy');
        assert.deepEqual(ability.activation, { durationSeconds: 4, interruptible: true });
        assert.equal(ability.recoverySeconds, 2);
        assert.equal(ability.cooldownSeconds, 9);
        assert.deepEqual(ability.costs, { mp: 9 });

        const effect = ability.effects[0];
        assert.equal(effect.type, 'damage');
        assert.equal(effect.recipient, 'target');
        assert.equal(effect.stat, entry.stat);
        assert.equal(effect.base, 7);
        assert.equal(effect.coefficient, 1.25);
        assert.deepEqual(effect.resolution, {
            delivery: entry.delivery,
            channel: 'magical',
            damageType: 'spell',
            element: entry.element,
            elementSource: 'ability',
            accuracyModel: 'magic',
            resistanceModel: 'magicDefense',
            criticalEligible: false,
        });
    }
});

test('each novice elemental spell uses its target elemental resistance through shared resolution', () => {
    for (const entry of NOVICE_ELEMENTAL) {
        const normal = createSpellState(entry);
        const normalResult = resolveSpell(normal, entry.id);

        const resisted = createSpellState(entry, 50);
        const resistedResult = resolveSpell(resisted, entry.id);

        const normalEffect = normalResult.data.effects[0];
        const resistedEffect = resistedResult.data.effects[0];

        assert.equal(normalEffect.applied, true, entry.id);
        assert.equal(normalEffect.resolution.contract.channel, 'magical', entry.id);
        assert.equal(normalEffect.resolution.contract.accuracyModel, 'magic', entry.id);
        assert.equal(normalEffect.resolution.contract.resistanceModel, 'magicDefense', entry.id);
        assert.equal(normalEffect.resolution.contract.element, entry.element, entry.id);
        assert.equal(normalEffect.resolution.element.resistance, 0, entry.id);
        assert.equal(resistedEffect.resolution.element.resistance, 50, entry.id);
        assert.equal(resistedEffect.resolution.element.multiplier, 0.5, entry.id);
        assert.ok(resistedEffect.amount < normalEffect.amount, entry.id);

        const player = battlePlayer(resisted);
        assert.equal(getCombatantReadyAt(resisted, player.id), resisted.worldTime.totalSeconds + 2, entry.id);
    }
});

test('Packet 3 deliberately leaves geometry-signaling adept elemental names unmigrated', () => {
    for (const id of ['ability-tempest-ring', 'ability-thunder-cage', 'ability-umbral-well']) {
        const ability = getAbility(id);
        assert.ok(ability);
        assert.equal(ability.effects[0].resolution, undefined);
        assert.equal(ability.recoverySeconds, 0);
    }
});

function createSpellState(entry, resistance = 0) {
    const state = createNewGameState({ mainJobId: 'elementalist' });
    grantCapability(state.player, entry.capabilityId);
    setLearnedSkill(state.player, entry.skillId, 1);
    state.player.resources.mp = 100;

    const started = startEncounter(state, 'Training Dummy', { rng: () => 0 });
    assert.equal(started.ok, true);
    const player = battlePlayer(state);
    const enemy = battleEnemy(state);
    player.resources.mp = 100;
    enemy.resources.hp = 999;
    setCombatantReadyAt(state, enemy.id, state.worldTime.totalSeconds + 100000);

    if (resistance > 0) {
        applyStatus(enemy, {
            id: `status-test-${entry.element}-resistance`,
            name: `${entry.element} resistance`,
            durationSeconds: 30,
            modifiers: { resistances: { [entry.element]: resistance } },
        }, { nowWorldSeconds: state.worldTime.totalSeconds });
        reconcileCombatStatuses(state);
    }
    return state;
}

function resolveSpell(state, abilityId) {
    const started = activateAbility(state, abilityId);
    assert.equal(started.code, 'ability.started', abilityId);
    advanceWorldTime(state, 4);
    const resolved = reconcileAbilityActivation(state);
    assert.equal(resolved.code, 'ability.resolved', abilityId);
    return resolved;
}

function battlePlayer(state) {
    return state.activeBattle.combatants.find((entry) => entry.type === 'player');
}

function battleEnemy(state) {
    return state.activeBattle.combatants.find((entry) => entry.type === 'enemy');
}
