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
import { createBattleState } from '../js/text/systems/battleEngine.js';
import { grantCapability } from '../js/text/systems/capabilityEngine.js';
import {
    COMBAT_GEOMETRY_VERSION,
    getCombatFormationPosition,
    resolveCombatGeometryTargets,
} from '../js/text/systems/combatGeometryEngine.js';
import {
    ensureCombatContract,
    initializeCombatTimeline,
} from '../js/text/systems/combatTurnEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';
import { applyStatus } from '../js/text/systems/statusEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

test('Packet 5 gives Tempest Ring structured target-centered ring geometry and wind resolution', () => {
    assert.equal(ABILITY_CATALOG_VERSION, 12);
    assert.equal(listAbilities().length, 41);
    assert.deepEqual(validateAbilityCatalog(), []);

    const ring = getAbility('ability-tempest-ring');
    assert.ok(ring);
    assert.equal(ring.capabilityId, 'spell-tempest-ring');
    assert.equal(ring.schoolId, 'school-elemental-form');
    assert.deepEqual(ring.contexts, ['combat']);
    assert.deepEqual(ring.target, {
        kind: 'enemy',
        geometry: {
            kind: 'ring',
            center: 'target',
            radius: 2,
            maximumTargets: 4,
        },
    });
    assert.deepEqual(ring.activation, { durationSeconds: 6, interruptible: true });
    assert.equal(ring.recoverySeconds, 3);
    assert.equal(ring.cooldownSeconds, 18);
    assert.deepEqual(ring.costs, { mp: 20 });
    assert.equal(ring.effects.length, 1);
    assert.deepEqual(ring.effects[0], {
        type: 'damage',
        recipient: 'target',
        stat: 'int',
        base: 16,
        coefficient: 1.75,
        resolution: {
            delivery: 'spell',
            channel: 'magical',
            damageType: 'spell',
            element: 'wind',
            elementSource: 'ability',
            accuracyModel: 'magic',
            resistanceModel: 'magicDefense',
            criticalEligible: false,
        },
        status: undefined,
    });
});

test('derived encounter formation makes ring radius and maximum-target selection deterministic', () => {
    const state = createTempestState();
    const player = battlePlayer(state);
    const enemies = battleEnemies(state);

    assert.equal(COMBAT_GEOMETRY_VERSION, 1);
    assert.deepEqual(getCombatFormationPosition(state.activeBattle, player.id), { x: 0, y: 0 });
    assert.deepEqual(getCombatFormationPosition(state.activeBattle, enemies[0].id), { x: 3, y: 0 });
    assert.deepEqual(getCombatFormationPosition(state.activeBattle, enemies[1].id), { x: 4, y: 1 });
    assert.deepEqual(getCombatFormationPosition(state.activeBattle, enemies[2].id), { x: 4, y: -1 });
    assert.deepEqual(getCombatFormationPosition(state.activeBattle, enemies[3].id), { x: 5, y: 0 });
    assert.deepEqual(getCombatFormationPosition(state.activeBattle, enemies[4].id), { x: 3, y: 2 });
    assert.deepEqual(getCombatFormationPosition(state.activeBattle, enemies[5].id), { x: 5, y: 2 });

    const uncapped = resolveCombatGeometryTargets(state.activeBattle, {
        actorId: player.id,
        primaryTargetId: enemies[0].id,
        geometry: { kind: 'ring', center: 'target', radius: 2, maximumTargets: 6 },
    });
    assert.deepEqual(uncapped.targets.map((entry) => entry.id), enemies.slice(0, 5).map((entry) => entry.id));
    assert.equal(uncapped.evidence.recipients.at(-1).distance, 2);
    assert.equal(uncapped.targets.some((entry) => entry.id === enemies[5].id), false);

    const authored = resolveCombatGeometryTargets(state.activeBattle, {
        actorId: player.id,
        primaryTargetId: enemies[0].id,
        geometry: getAbility('ability-tempest-ring').target.geometry,
    });
    assert.deepEqual(authored.targets.map((entry) => entry.id), enemies.slice(0, 4).map((entry) => entry.id));
    assert.equal(authored.evidence.radius, 2);
    assert.equal(authored.evidence.maximumTargets, 4);
});

test('Tempest Ring independently resolves each selected target and applies per-recipient attention', () => {
    const state = createTempestState({ windResistanceIndex: 1, windResistance: 50, rng: () => 0 });
    const enemies = battleEnemies(state);
    const player = battlePlayer(state);
    const untouchedBefore = enemies.slice(4).map((enemy) => enemy.resources.hp);

    const result = resolveTempestRing(state);
    assert.equal(result.data.effects.length, 4);
    assert.deepEqual(result.data.effects.map((effect) => effect.recipientId), enemies.slice(0, 4).map((enemy) => enemy.id));
    assert.deepEqual(result.data.geometry.recipients.map((entry) => entry.id), enemies.slice(0, 4).map((enemy) => enemy.id));
    assert.equal(result.data.geometry.centerId, enemies[0].id);
    assert.equal(result.data.geometry.radius, 2);
    assert.equal(result.data.geometry.maximumTargets, 4);

    for (const effect of result.data.effects) {
        assert.equal(effect.type, 'damage');
        assert.equal(effect.applied, true);
        assert.equal(effect.resolution.contract.element, 'wind');
        assert.equal(effect.resolution.contract.accuracyModel, 'magic');
        assert.equal(effect.resolution.contract.resistanceModel, 'magicDefense');
    }

    const first = result.data.effects[0];
    const resisted = result.data.effects[1];
    assert.equal(first.resolution.element.resistance, 0);
    assert.equal(resisted.resolution.element.resistance, 50);
    assert.equal(resisted.resolution.element.multiplier, 0.5);
    assert.ok(resisted.amount < first.amount);

    assert.deepEqual(enemies.slice(4).map((enemy) => enemy.resources.hp), untouchedBefore);

    const action = state.activeBattle.contract.actions.find((entry) => entry.sourceId === 'ability-tempest-ring');
    assert.ok(action);
    assert.deepEqual(action.data.geometry.recipients.map((entry) => entry.id), enemies.slice(0, 4).map((enemy) => enemy.id));
    assert.deepEqual(action.data.attention.applied.map((entry) => entry.enemyId), enemies.slice(0, 4).map((enemy) => enemy.id));

    for (let index = 0; index < 4; index += 1) {
        const attention = state.activeBattle.enmity.byEnemyId[enemies[index].id].entries[player.id];
        assert.ok(attention.transient > 0);
        assert.equal(action.data.attention.applied[index].amount, result.data.effects[index].amount);
    }
    assert.equal(state.activeBattle.enmity.byEnemyId[enemies[4].id].entries[player.id].transient, 0);
    assert.equal(state.activeBattle.enmity.byEnemyId[enemies[5].id].entries[player.id].transient, 0);
});

test('Tempest Ring geometry is save/load-stable without persisted geometry state', () => {
    const state = createTempestState();
    const enemies = battleEnemies(state);
    const player = battlePlayer(state);

    const started = activateAbility(state, 'Tempest Ring', { targetQuery: 'Tempest Dummy 1' });
    assert.equal(started.code, 'ability.started');
    assert.equal(Object.hasOwn(state.activeBattle, 'geometry'), false);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);

    state.activeBattle.rng = null;
    const clone = structuredClone(state);
    assert.deepEqual(validateCurrentGameStateStructure(clone), []);
    assert.equal(Object.hasOwn(clone.activeBattle, 'geometry'), false);

    const originalSelection = resolveCombatGeometryTargets(state.activeBattle, {
        actorId: player.id,
        primaryTargetId: enemies[0].id,
        geometry: getAbility('ability-tempest-ring').target.geometry,
    });
    const clonedPlayer = battlePlayer(clone);
    const clonedEnemies = battleEnemies(clone);
    const clonedSelection = resolveCombatGeometryTargets(clone.activeBattle, {
        actorId: clonedPlayer.id,
        primaryTargetId: clonedEnemies[0].id,
        geometry: getAbility('ability-tempest-ring').target.geometry,
    });

    assert.deepEqual(
        clonedSelection.evidence.recipients.map((entry) => ({ id: entry.id, distance: entry.distance, position: entry.position })),
        originalSelection.evidence.recipients.map((entry) => ({ id: entry.id, distance: entry.distance, position: entry.position })),
    );
});

function createTempestState(options = {}) {
    const state = createNewGameState({ mainJobId: 'elementalist' });
    grantCapability(state.player, 'spell-tempest-ring');
    setLearnedSkill(state.player, 'elementalMagic', 3);
    state.player.resources.mp = 100;
    state.player.resources.hp = 9999;

    const source = state.enemies.find((entry) => entry.identity?.name === 'Training Dummy');
    assert.ok(source);
    const enemies = Array.from({ length: 6 }, (_, index) => {
        const enemy = structuredClone(source);
        enemy.id = `tempest-dummy-${index + 1}`;
        enemy.identity = { ...enemy.identity, name: `Tempest Dummy ${index + 1}` };
        enemy.resources = { ...enemy.resources, hp: 999 };
        if (index === options.windResistanceIndex) {
            applyStatus(enemy, {
                id: `status-test-wind-resistance-${index + 1}`,
                name: 'Wind Resistance',
                category: 'buff',
                durationSeconds: 60,
                stackGroup: `test-wind-resistance-${index + 1}`,
                stackRule: 'replace',
                modifiers: { resistances: { wind: options.windResistance ?? 50 } },
                flags: {},
            }, { nowWorldSeconds: state.worldTime.totalSeconds });
        }
        return enemy;
    });

    state.combatSequence = 1;
    state.activeBattle = createBattleState({
        id: 'battle-000001',
        player: state.player,
        enemies,
        rng: options.rng ?? null,
    });
    state.activeBattle.source = 'packet-5-test';
    ensureCombatContract(state.activeBattle, {
        nowWorldSeconds: state.worldTime.totalSeconds,
        combatants: state.activeBattle.combatants,
    });
    initializeCombatTimeline(state, state.activeBattle);
    battlePlayer(state).resources.mp = 100;
    battlePlayer(state).resources.hp = 9999;
    return state;
}

function resolveTempestRing(state) {
    const started = activateAbility(state, 'Tempest Ring', { targetQuery: 'Tempest Dummy 1' });
    assert.equal(started.code, 'ability.started');
    advanceWorldTime(state, 6);
    const result = reconcileAbilityActivation(state);
    assert.equal(result.code, 'ability.resolved');
    return result;
}

function battlePlayer(state) {
    return state.activeBattle.combatants.find((entry) => entry.type === 'player');
}

function battleEnemies(state) {
    return state.activeBattle.combatants.filter((entry) => entry.type === 'enemy');
}
