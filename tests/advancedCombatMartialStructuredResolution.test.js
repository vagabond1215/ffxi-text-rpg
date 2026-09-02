import test from 'node:test';
import assert from 'node:assert/strict';

import {
    ABILITY_CATALOG_VERSION,
    getAbility,
    listAbilities,
    validateAbilityCatalog,
} from '../js/text/data/abilities.js';
import { getEquipmentCatalogEntry } from '../js/text/data/equipmentCatalog.js';
import { createNewGameState } from '../js/text/gameState.js';
import { activateAbility, canActivateAbility } from '../js/text/systems/abilityEngine.js';
import { grantCapability } from '../js/text/systems/capabilityEngine.js';
import { startEncounter } from '../js/text/systems/combatActionEngine.js';
import {
    getCombatantReadyAt,
    reconcileCombatStatuses,
    setCombatantReadyAt,
} from '../js/text/systems/combatTurnEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { createSequenceRng } from '../js/text/systems/rng.js';
import { setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';
import { applyStatus } from '../js/text/systems/statusEngine.js';

const MARTIAL_TRANCHE = Object.freeze([
    Object.freeze({
        id: 'ability-guarded-cut',
        name: 'Guarded Cut',
        capabilityId: 'technique-guarded-cut',
        skillId: 'sword',
        weaponId: 'bronze-sword',
        wrongWeaponId: 'bronze-axe',
        stat: 'str',
        base: 4,
        coefficient: 0.9,
        tp: 250,
        cooldownSeconds: 8,
        recoverySeconds: 3,
        damageType: 'slashing',
        criticalEligible: false,
        statusId: 'status-guarded-cut',
        statusDurationSeconds: 12,
        statusModifier: 2,
        statusFlag: 'guarded',
    }),
    Object.freeze({
        id: 'ability-barkboar-brace',
        name: 'Barkboar Brace',
        capabilityId: 'technique-barkboar-brace',
        skillId: 'axe',
        weaponId: 'bronze-axe',
        wrongWeaponId: 'bronze-sword',
        stat: 'str',
        base: 6,
        coefficient: 1.05,
        tp: 300,
        cooldownSeconds: 10,
        recoverySeconds: 4,
        damageType: 'slashing',
        criticalEligible: false,
        statusId: 'status-barkboar-brace',
        statusDurationSeconds: 15,
        statusModifier: 3,
        statusFlag: 'braced',
    }),
    Object.freeze({
        id: 'ability-thicket-feint',
        name: 'Thicket Feint',
        capabilityId: 'technique-thicket-feint',
        skillId: 'dagger',
        weaponId: 'bronze-dagger',
        wrongWeaponId: 'bronze-sword',
        stat: 'dex',
        base: 5,
        coefficient: 1.0,
        tp: 225,
        cooldownSeconds: 8,
        recoverySeconds: 2,
        damageType: 'piercing',
        criticalEligible: true,
        statusId: 'status-thicket-feint',
        statusDurationSeconds: 10,
        statusModifier: 1,
        statusFlag: 'mobile',
    }),
]);

test('Packet 8 migrates exactly the selected martial tranche without adding abilities', () => {
    assert.equal(ABILITY_CATALOG_VERSION, 12);
    assert.equal(listAbilities().length, 41);
    assert.deepEqual(validateAbilityCatalog(), []);

    for (const entry of MARTIAL_TRANCHE) {
        const ability = getAbility(entry.id);
        assert.ok(ability, entry.id);
        assert.equal(ability.name, entry.name);
        assert.equal(ability.kind, 'technique');
        assert.equal(ability.capabilityId, entry.capabilityId);
        assert.deepEqual(ability.contexts, ['combat']);
        assert.deepEqual(ability.target, { kind: 'enemy' });
        assert.deepEqual(ability.activation, { durationSeconds: 0, interruptible: false });
        assert.equal(ability.recoverySeconds, entry.recoverySeconds);
        assert.equal(ability.cooldownSeconds, entry.cooldownSeconds);
        assert.deepEqual(ability.costs, { tp: entry.tp });
        assert.equal(ability.effects.length, 2);

        const damage = ability.effects[0];
        assert.equal(damage.type, 'damage');
        assert.equal(damage.recipient, 'target');
        assert.equal(damage.stat, entry.stat);
        assert.equal(damage.base, entry.base);
        assert.equal(damage.coefficient, entry.coefficient);
        assert.deepEqual(damage.resolution, {
            delivery: 'melee',
            channel: 'physical',
            damageType: entry.damageType,
            accuracyModel: 'physical',
            resistanceModel: 'physicalDefense',
            criticalEligible: entry.criticalEligible,
        });

        const status = ability.effects[1];
        assert.equal(status.type, 'status');
        assert.equal(status.recipient, 'self');
        assert.equal(status.status.id, entry.statusId);
        assert.equal(status.status.durationSeconds, entry.statusDurationSeconds);
        assert.equal(status.status.modifiers.defense, entry.statusModifier);
        assert.equal(status.status.flags[entry.statusFlag], true);
    }
});

test('Packet 8 preserves real weapon-context gates for the selected techniques', () => {
    for (const entry of MARTIAL_TRANCHE) {
        const state = createTechniqueState(entry, {
            weaponId: entry.wrongWeaponId,
            rng: () => 0,
            startBattle: false,
        });
        startEncounter(state, 'Training Dummy', { rng: () => 0 });
        const enemy = battleEnemy(state);
        setCombatantReadyAt(state, enemy.id, state.worldTime.totalSeconds + 100000);

        const check = canActivateAbility(state, entry.name);
        assert.equal(check.ok, false, entry.name);
        assert.equal(check.code, 'ability.capability-requirement', entry.name);
        assert.equal(check.data.requirementCode, 'equipment-requirement', entry.name);
    }
});

test('each migrated martial technique uses physical defense and records canonical recovery/action evidence', () => {
    for (const entry of MARTIAL_TRANCHE) {
        const normal = createTechniqueState(entry, { rng: createSequenceRng([0, 0.5, 0]) });
        const normalResult = activateAbility(normal, entry.name);
        assert.equal(normalResult.code, 'ability.resolved', entry.name);
        const normalDamage = normalResult.data.effects[0];
        assert.equal(normalDamage.applied, true, entry.name);
        assert.equal(normalDamage.resolution.contract.delivery, 'melee', entry.name);
        assert.equal(normalDamage.resolution.contract.channel, 'physical', entry.name);
        assert.equal(normalDamage.resolution.contract.damageType, entry.damageType, entry.name);
        assert.equal(normalDamage.resolution.contract.accuracyModel, 'physical', entry.name);
        assert.equal(normalDamage.resolution.contract.resistanceModel, 'physicalDefense', entry.name);

        const defended = createTechniqueState(entry, {
            rng: createSequenceRng([0, 0.5, 0]),
            defenseBonus: 100,
        });
        const defendedResult = activateAbility(defended, entry.name);
        const defendedDamage = defendedResult.data.effects[0];
        assert.equal(defendedDamage.applied, true, entry.name);
        assert.ok(defendedDamage.resolution.defense.effective > normalDamage.resolution.defense.effective, entry.name);
        assert.ok(defendedDamage.amount < normalDamage.amount, entry.name);

        const player = battlePlayer(normal);
        assert.equal(getCombatantReadyAt(normal, player.id), normal.worldTime.totalSeconds + entry.recoverySeconds, entry.name);

        const action = normal.activeBattle.contract.actions.find((candidate) => candidate.sourceId === entry.id);
        assert.ok(action, entry.name);
        assert.equal(action.kind, 'ability', entry.name);
        assert.equal(action.data.effects[0].resolution.contract.damageType, entry.damageType, entry.name);
        assert.equal(action.data.effects[0].resolution.contract.resistanceModel, 'physicalDefense', entry.name);
    }
});

test('a deterministic martial miss still applies each authored self-buff', () => {
    for (const entry of MARTIAL_TRANCHE) {
        const state = createTechniqueState(entry, { rng: createSequenceRng([0.99]) });
        const result = activateAbility(state, entry.name);
        const [damage, status] = result.data.effects;

        assert.equal(result.code, 'ability.resolved', entry.name);
        assert.equal(damage.applied, false, entry.name);
        assert.equal(damage.reason, 'miss', entry.name);
        assert.equal(status.applied, true, entry.name);
        assert.equal(status.statusId, entry.statusId, entry.name);

        const player = battlePlayer(state);
        assert.ok(player.statuses.some((record) => record.id === entry.statusId), entry.name);
    }
});

test('Guarded Cut and Barkboar Brace cannot critical while Thicket Feint uses existing critical stats', () => {
    for (const entry of MARTIAL_TRANCHE) {
        const state = createTechniqueState(entry, { rng: createSequenceRng([0, 0.5, 0]) });
        const player = battlePlayer(state);
        player.combat.derived.criticalRate = 100;
        player.combat.derived.criticalDamage = 150;

        const result = activateAbility(state, entry.name);
        const resolution = result.data.effects[0].resolution;

        assert.equal(resolution.contract.criticalEligible, entry.criticalEligible, entry.name);
        assert.equal(resolution.criticalDetail.eligible, entry.criticalEligible, entry.name);
        assert.equal(resolution.critical, entry.criticalEligible, entry.name);
        if (entry.criticalEligible) assert.ok(resolution.criticalDetail.multiplier > 1, entry.name);
        else assert.equal(resolution.criticalDetail.multiplier, 1, entry.name);
    }
});

test('Packet 8 adds no durable martial state family and remains valid Game State 21', () => {
    const state = createTechniqueState(MARTIAL_TRANCHE[0], { rng: () => 0 });
    const result = activateAbility(state, 'Guarded Cut');
    assert.equal(result.code, 'ability.resolved');

    assert.equal(Object.hasOwn(state.activeBattle, 'martial'), false);
    assert.equal(Object.hasOwn(state.activeBattle, 'techniques'), false);
    assert.equal(Object.hasOwn(state, 'martial'), false);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

function createTechniqueState(entry, options = {}) {
    const state = createNewGameState({ mainJobId: 'vanguard' });
    grantCapability(state.player, entry.capabilityId);
    setLearnedSkill(state.player, entry.skillId, 3);

    const weapon = getEquipmentCatalogEntry(options.weaponId ?? entry.weaponId);
    assert.ok(weapon, options.weaponId ?? entry.weaponId);
    state.player.equipment.mainHand = structuredClone(weapon);
    state.player.resources.tp = 1000;
    state.player.resources.hp = 9999;

    if (options.startBattle === false) return state;

    const started = startEncounter(state, 'Training Dummy', { rng: options.rng ?? null });
    assert.equal(started.ok, true);
    const player = battlePlayer(state);
    const enemy = battleEnemy(state);
    player.resources.tp = 1000;
    player.resources.hp = 9999;
    enemy.resources.hp = 999;
    setCombatantReadyAt(state, enemy.id, state.worldTime.totalSeconds + 100000);

    if (options.defenseBonus) {
        applyStatus(enemy, {
            id: 'status-p8-defense-proof',
            name: 'Packet 8 Defense Proof',
            category: 'buff',
            durationSeconds: 30,
            stackGroup: 'packet-8-defense-proof',
            stackRule: 'replace',
            modifiers: { defense: options.defenseBonus },
            flags: {},
        }, { nowWorldSeconds: state.worldTime.totalSeconds });
        reconcileCombatStatuses(state);
    }

    return state;
}

function battlePlayer(state) {
    return state.activeBattle.combatants.find((entry) => entry.type === 'player');
}

function battleEnemy(state) {
    return state.activeBattle.combatants.find((entry) => entry.type === 'enemy');
}
