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
    setCombatantReadyAt,
} from '../js/text/systems/combatTurnEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { createSequenceRng } from '../js/text/systems/rng.js';
import { listSemanticEvents } from '../js/text/systems/semanticEventEngine.js';
import { setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';
import { applyStatus } from '../js/text/systems/statusEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

test('Packet 7 gives Radiant Arc explicit Light resolution and deterministic propagation geometry', () => {
    assert.equal(ABILITY_CATALOG_VERSION, 12);
    assert.equal(listAbilities().length, 41);
    assert.deepEqual(validateAbilityCatalog(), []);

    const arc = getAbility('ability-radiant-arc');
    assert.ok(arc);
    assert.equal(arc.capabilityId, 'spell-radiant-arc');
    assert.equal(arc.schoolId, 'school-elemental-form');
    assert.deepEqual(arc.contexts, ['combat']);
    assert.deepEqual(arc.target, {
        kind: 'enemy',
        geometry: {
            kind: 'arc',
            jumpRange: 2,
            maximumTargets: 3,
            repeatTargets: false,
            ordering: 'nearest-then-encounter-order',
        },
    });
    assert.deepEqual(arc.activation, { durationSeconds: 6, interruptible: true });
    assert.equal(arc.recoverySeconds, 3);
    assert.equal(arc.cooldownSeconds, 18);
    assert.deepEqual(arc.costs, { mp: 20 });
    assert.equal(arc.effects.length, 1);
    assert.deepEqual(arc.effects[0], {
        type: 'damage',
        recipient: 'target',
        stat: 'mnd',
        base: 16,
        coefficient: 1.75,
        resolution: {
            delivery: 'spell',
            channel: 'magical',
            damageType: 'spell',
            element: 'light',
            elementSource: 'ability',
            accuracyModel: 'magic',
            resistanceModel: 'magicDefense',
            criticalEligible: false,
        },
        status: undefined,
    });
});

test('Radiant Arc walks target-to-target and can reach outside the primary target radius', () => {
    const state = createArcState({ enemyCount: 6 });
    const player = battlePlayer(state);
    const enemies = battleEnemies(state);
    const primary = enemies[5];

    assert.equal(COMBAT_GEOMETRY_VERSION, 1);
    assert.deepEqual(getCombatFormationPosition(state.activeBattle, primary.id), { x: 5, y: 2 });

    const geometry = resolveCombatGeometryTargets(state.activeBattle, {
        actorId: player.id,
        primaryTargetId: primary.id,
        geometry: getAbility('ability-radiant-arc').target.geometry,
    });

    assert.deepEqual(geometry.targets.map((entry) => entry.id), [
        enemies[5].id,
        enemies[1].id,
        enemies[0].id,
    ]);
    assert.deepEqual(geometry.evidence.recipients.map((entry) => ({
        id: entry.id,
        jump: entry.jump,
        fromId: entry.fromId,
        distance: entry.distance,
    })), [
        { id: enemies[5].id, jump: 1, fromId: null, distance: 0 },
        { id: enemies[1].id, jump: 2, fromId: enemies[5].id, distance: Math.SQRT2 },
        { id: enemies[0].id, jump: 3, fromId: enemies[1].id, distance: Math.SQRT2 },
    ]);

    const primaryPosition = getCombatFormationPosition(state.activeBattle, enemies[5].id);
    const thirdPosition = getCombatFormationPosition(state.activeBattle, enemies[0].id);
    assert.ok(Math.hypot(
        thirdPosition.x - primaryPosition.x,
        thirdPosition.y - primaryPosition.y,
    ) > 2);
    assert.equal(new Set(geometry.targets.map((entry) => entry.id)).size, geometry.targets.length);
});

test('Radiant Arc stops early when no eligible next target exists', () => {
    const state = createArcState({ enemyCount: 1 });
    const player = battlePlayer(state);
    const enemy = battleEnemies(state)[0];

    const geometry = resolveCombatGeometryTargets(state.activeBattle, {
        actorId: player.id,
        primaryTargetId: enemy.id,
        geometry: getAbility('ability-radiant-arc').target.geometry,
    });

    assert.deepEqual(geometry.targets.map((entry) => entry.id), [enemy.id]);
    assert.equal(geometry.evidence.recipients.length, 1);
    assert.equal(geometry.evidence.maximumTargets, 3);
});

test('Radiant Arc independently resolves Light resistance and records propagation evidence with per-recipient attention', () => {
    const state = createArcState({
        enemyCount: 6,
        lightResistanceIndex: 1,
        lightResistance: 50,
        rng: createSequenceRng([0, 0, 0]),
    });
    const enemies = battleEnemies(state);
    const player = battlePlayer(state);

    const result = resolveRadiantArc(state, 'Arc Dummy 6');
    assert.equal(result.data.effects.length, 3);
    assert.deepEqual(result.data.effects.map((effect) => effect.recipientId), [
        enemies[5].id,
        enemies[1].id,
        enemies[0].id,
    ]);

    const [primaryEffect, resistedEffect, thirdEffect] = result.data.effects;
    for (const effect of result.data.effects) {
        assert.equal(effect.type, 'damage');
        assert.equal(effect.applied, true);
        assert.equal(effect.resolution.contract.element, 'light');
        assert.equal(effect.resolution.contract.accuracyModel, 'magic');
        assert.equal(effect.resolution.contract.resistanceModel, 'magicDefense');
    }

    assert.equal(primaryEffect.resolution.element.resistance, 0);
    assert.equal(resistedEffect.resolution.element.resistance, 50);
    assert.equal(resistedEffect.resolution.element.multiplier, 0.5);
    assert.ok(resistedEffect.amount < primaryEffect.amount);
    assert.equal(thirdEffect.resolution.element.resistance, 0);

    const geometry = result.data.geometry;
    assert.equal(geometry.kind, 'arc');
    assert.equal(geometry.primaryTargetId, enemies[5].id);
    assert.equal(geometry.jumpRange, 2);
    assert.equal(geometry.maximumTargets, 3);
    assert.equal(geometry.repeatTargets, false);
    assert.equal(geometry.ordering, 'nearest-then-encounter-order');
    assert.deepEqual(geometry.recipients.map((entry) => entry.id), [
        enemies[5].id,
        enemies[1].id,
        enemies[0].id,
    ]);

    const action = state.activeBattle.contract.actions.find((entry) => entry.sourceId === 'ability-radiant-arc');
    assert.ok(action);
    assert.equal(action.data.attention.mode, 'per-recipient');
    assert.deepEqual(action.data.geometry, geometry);
    assert.deepEqual(action.data.attention.applied.map((entry) => entry.enemyId), [
        enemies[5].id,
        enemies[1].id,
        enemies[0].id,
    ]);
    for (const enemy of [enemies[5], enemies[1], enemies[0]]) {
        assert.ok(state.activeBattle.enmity.byEnemyId[enemy.id].entries[player.id].transient > 0);
    }
    for (const enemy of [enemies[2], enemies[3], enemies[4]]) {
        assert.equal(state.activeBattle.enmity.byEnemyId[enemy.id].entries[player.id].transient, 0);
    }

    const event = listSemanticEvents(state, { type: 'ability.resolved' }).find((entry) => entry.id === result.data.eventId);
    assert.ok(event);
    assert.deepEqual(event.data.geometry, geometry);

    assert.equal(Object.hasOwn(state.activeBattle, 'propagation'), false);
    assert.equal(Object.hasOwn(state.activeBattle, 'arc'), false);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('Radiant Arc attention excludes a missed primary while preserving landed propagated recipients', () => {
    const state = createArcState({
        enemyCount: 6,
        rng: createSequenceRng([0.99, 0, 0]),
    });
    const enemies = battleEnemies(state);
    const player = battlePlayer(state);

    const result = resolveRadiantArc(state, 'Arc Dummy 6');
    assert.equal(result.data.effects[0].applied, false);
    assert.equal(result.data.effects[1].applied, true);
    assert.equal(result.data.effects[2].applied, true);

    const action = state.activeBattle.contract.actions.find((entry) => entry.sourceId === 'ability-radiant-arc');
    assert.ok(action);
    assert.deepEqual(action.data.attention.applied.map((entry) => entry.enemyId), [
        enemies[1].id,
        enemies[0].id,
    ]);
    assert.equal(state.activeBattle.enmity.byEnemyId[enemies[5].id].entries[player.id].transient, 0);
});

function createArcState(options = {}) {
    const state = createNewGameState({ mainJobId: 'lifewarden' });
    grantCapability(state.player, 'spell-radiant-arc');
    setLearnedSkill(state.player, 'divineMagic', 3);
    state.player.resources.mp = 100;
    state.player.resources.hp = 9999;

    const source = state.enemies.find((entry) => entry.identity?.name === 'Training Dummy');
    assert.ok(source);
    const count = options.enemyCount ?? 1;
    const enemies = Array.from({ length: count }, (_, index) => {
        const enemy = structuredClone(source);
        enemy.id = `arc-dummy-${index + 1}`;
        enemy.identity = { ...enemy.identity, name: `Arc Dummy ${index + 1}` };
        enemy.resources = { ...enemy.resources, hp: 999 };

        if (index === options.lightResistanceIndex) {
            applyStatus(enemy, {
                id: `status-test-light-resistance-${index + 1}`,
                name: 'Light Resistance',
                category: 'buff',
                durationSeconds: 60,
                stackGroup: `test-light-resistance-${index + 1}`,
                stackRule: 'replace',
                modifiers: { resistances: { light: options.lightResistance ?? 50 } },
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
    state.activeBattle.source = 'packet-7-test';
    ensureCombatContract(state.activeBattle, {
        nowWorldSeconds: state.worldTime.totalSeconds,
        combatants: state.activeBattle.combatants,
    });
    initializeCombatTimeline(state, state.activeBattle);
    battlePlayer(state).resources.mp = 100;
    battlePlayer(state).resources.hp = 9999;

    for (const enemy of battleEnemies(state)) {
        setCombatantReadyAt(state, enemy.id, state.worldTime.totalSeconds + 100000);
    }
    return state;
}

function resolveRadiantArc(state, targetQuery) {
    const started = activateAbility(state, 'Radiant Arc', { targetQuery });
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
