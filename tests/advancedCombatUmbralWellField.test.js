import test from 'node:test';
import assert from 'node:assert/strict';

import {
    ABILITY_CATALOG_VERSION,
    getAbility,
    listAbilities,
    validateAbilityCatalog,
} from '../js/text/data/abilities.js';
import { createNewGameState } from '../js/text/gameState.js';
import {
    createAccountWithPassword,
    loadCharacter,
    saveGame,
} from '../js/text/save.js';
import { activateAbility, reconcileAbilityActivation } from '../js/text/systems/abilityEngine.js';
import { createBattleState } from '../js/text/systems/battleEngine.js';
import { grantCapability } from '../js/text/systems/capabilityEngine.js';
import { startEncounter } from '../js/text/systems/combatActionEngine.js';
import { advanceCombatSimulation } from '../js/text/systems/combatSimulationEngine.js';
import {
    COMBAT_FIELD_INTERRUPT_PRIORITY,
    COMBAT_FIELD_STATE_VERSION,
    validateBattleFieldState,
} from '../js/text/systems/combatFieldEngine.js';
import { getCombatFormationPosition } from '../js/text/systems/combatGeometryEngine.js';
import {
    ensureCombatContract,
    finalizeCombatState,
    initializeCombatTimeline,
    setCombatantReadyAt,
} from '../js/text/systems/combatTurnEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { createSequenceRng } from '../js/text/systems/rng.js';
import { setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';
import { applyStatus } from '../js/text/systems/statusEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

test('Packet 6 gives Umbral Well explicit Dark impact plus a bounded persistent field contract', () => {
    assert.equal(ABILITY_CATALOG_VERSION, 12);
    assert.equal(listAbilities().length, 41);
    assert.deepEqual(validateAbilityCatalog(), []);

    const well = getAbility('ability-umbral-well');
    assert.ok(well);
    assert.equal(well.capabilityId, 'spell-umbral-well');
    assert.equal(well.schoolId, 'school-elemental-form');
    assert.deepEqual(well.contexts, ['combat']);
    assert.deepEqual(well.target, { kind: 'enemy' });
    assert.deepEqual(well.activation, { durationSeconds: 6, interruptible: true });
    assert.equal(well.recoverySeconds, 3);
    assert.equal(well.cooldownSeconds, 18);
    assert.deepEqual(well.costs, { mp: 20 });
    assert.equal(well.effects.length, 2);

    const impact = well.effects[0];
    assert.equal(impact.type, 'damage');
    assert.equal(impact.stat, 'int');
    assert.equal(impact.base, 16);
    assert.equal(impact.coefficient, 1.75);
    assert.equal(impact.resolution.element, 'dark');
    assert.equal(impact.resolution.accuracyModel, 'magic');
    assert.equal(impact.resolution.resistanceModel, 'magicDefense');

    const field = well.effects[1];
    assert.equal(field.type, 'field');
    assert.equal(field.recipient, 'target');
    assert.equal(field.field.durationSeconds, 12);
    assert.equal(field.field.pulseSeconds, 4);
    assert.deepEqual(field.field.geometry, { kind: 'radius', radius: 2, maximumTargets: 4 });
    assert.equal(field.field.effect.type, 'damage');
    assert.equal(field.field.effect.stat, 'int');
    assert.equal(field.field.effect.base, 4);
    assert.equal(field.field.effect.coefficient, 0.45);
    assert.equal(field.field.effect.resolution.element, 'dark');
    assert.equal(field.field.effect.resolution.criticalEligible, false);
});

test('Umbral Well creation persists center, deadlines, and cast-time source snapshot through real save/load', () => {
    globalThis.localStorage = new MemoryStorage();
    assert.equal(createAccountWithPassword('Umbral Field Account', 'pwd', { persistentLogin: true }).ok, true);

    const state = createNewGameState({ mainJobId: 'elementalist' });
    state.player.identity.name = 'Wellkeeper';
    grantCapability(state.player, 'spell-umbral-well');
    setLearnedSkill(state.player, 'darkMagic', 3);
    state.player.resources.mp = 100;
    startEncounter(state, 'Training Dummy', { rng: () => 0 });
    battlePlayer(state).resources.mp = 100;
    battlePlayer(state).resources.hp = 9999;

    const result = resolveUmbralWell(state);
    assert.equal(result.data.effects[0].type, 'damage');
    assert.equal(result.data.effects[1].type, 'field');
    assert.equal(result.data.effects[1].applied, true);

    assert.equal(state.activeBattle.fields.version, COMBAT_FIELD_STATE_VERSION);
    assert.equal(state.activeBattle.fields.sequence, 1);
    assert.equal(state.activeBattle.fields.records.length, 1);
    const field = structuredClone(state.activeBattle.fields.records[0]);
    assert.equal(field.id, 'combat-field-000001');
    assert.equal(field.sourceActorId, battlePlayer(state).id);
    assert.equal(field.sourceAbilityId, 'ability-umbral-well');
    assert.equal(field.centerTargetId, battleEnemies(state)[0].id);
    assert.deepEqual(field.centerPosition, getCombatFormationPosition(state.activeBattle, field.centerTargetId));
    assert.equal(field.createdAtWorldSeconds, state.worldTime.totalSeconds);
    assert.equal(field.expiresAtWorldSeconds, field.createdAtWorldSeconds + 12);
    assert.equal(field.nextPulseAtWorldSeconds, field.createdAtWorldSeconds + 4);
    assert.equal(field.pulseSequence, 0);
    assert.equal(field.sourceSnapshot.scalingStat, 'int');
    assert.ok(Number.isFinite(field.sourceSnapshot.scalingValue));
    assert.ok(Number.isFinite(field.sourceSnapshot.magicAccuracy));
    assert.ok(Number.isFinite(field.sourceSnapshot.magicAttack));
    assert.deepEqual(validateBattleFieldState(state.activeBattle), []);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);

    state.activeBattle.rng = null;
    assert.equal(saveGame(state), true);
    const loaded = loadCharacter('Wellkeeper');
    assert.ok(loaded);
    assert.deepEqual(loaded.activeBattle.fields, state.activeBattle.fields);
    assert.deepEqual(validateCurrentGameStateStructure(loaded), []);

    loaded.activeBattle.rng = () => 0;
    setAllEnemyReadinessFarFuture(loaded);
    const pulse = advanceCombatSimulation(loaded, 4);
    assert.equal(pulse.interrupt.type, 'combat.field-pulse');
    assert.equal(pulse.fieldResult.ok, true);
    assert.equal(pulse.fieldResult.scheduledAtWorldSeconds, field.nextPulseAtWorldSeconds);
});

test('Umbral Well pulses at 4/8/12 seconds, snapshots source offense, reads live Dark resistance, then expires', () => {
    const state = createUmbralState({ enemyCount: 1, rng: () => 0 });
    const result = resolveUmbralWell(state);
    const player = battlePlayer(state);
    const enemy = battleEnemies(state)[0];
    const field = state.activeBattle.fields.records[0];
    const snapshot = { ...field.sourceSnapshot };
    const createdAt = field.createdAtWorldSeconds;

    player.combat.attributes.int = 999;
    player.combat.derived.magicAccuracy = 999;
    player.combat.derived.magicAttack = 999;

    const first = advanceCombatSimulation(state, 4);
    assert.equal(first.interrupt.type, 'combat.field-pulse');
    assert.equal(first.interrupt.priority, COMBAT_FIELD_INTERRUPT_PRIORITY);
    assert.equal(first.fieldResult.scheduledAtWorldSeconds, createdAt + 4);
    assert.equal(first.fieldResult.pulseSequence, 1);
    const firstDamage = first.fieldAction.data.effects[0];
    assert.equal(firstDamage.resolution.accuracy.attackerValue, snapshot.magicAccuracy);
    assert.equal(firstDamage.resolution.potency, 4 + snapshot.scalingValue * 0.45);
    assert.equal(state.activeBattle.fields.records[0].nextPulseAtWorldSeconds, createdAt + 8);

    applyStatus(enemy, {
        id: 'status-test-dark-resistance',
        name: 'Dark Resistance',
        category: 'buff',
        durationSeconds: 30,
        stackGroup: 'test-dark-resistance',
        stackRule: 'replace',
        modifiers: { resistances: { dark: 50 } },
        flags: {},
    }, { nowWorldSeconds: state.worldTime.totalSeconds });

    const second = advanceCombatSimulation(state, 4);
    assert.equal(second.fieldResult.scheduledAtWorldSeconds, createdAt + 8);
    assert.equal(second.fieldResult.pulseSequence, 2);
    const secondDamage = second.fieldAction.data.effects[0];
    assert.equal(secondDamage.resolution.element.resistance, 50);
    assert.equal(secondDamage.resolution.element.multiplier, 0.5);
    assert.ok(secondDamage.amount < firstDamage.amount);
    assert.equal(state.activeBattle.fields.records[0].nextPulseAtWorldSeconds, createdAt + 12);

    const third = advanceCombatSimulation(state, 4);
    assert.equal(third.fieldResult.scheduledAtWorldSeconds, createdAt + 12);
    assert.equal(third.fieldResult.pulseSequence, 3);
    assert.equal(third.fieldResult.ended, true);
    assert.equal(state.activeBattle.fields.records.length, 0);
});

test('Umbral Well field radius/cap are deterministic and field attention follows applied recipients even when only a secondary target lands', () => {
    const state = createUmbralState({ enemyCount: 6, rng: () => 0 });
    resolveUmbralWell(state);
    const player = battlePlayer(state);
    const enemies = battleEnemies(state);
    const field = state.activeBattle.fields.records[0];

    assert.deepEqual(field.centerPosition, { x: 3, y: 0 });
    const beforePrimaryAttention = state.activeBattle.enmity.byEnemyId[enemies[0].id].entries[player.id].transient;
    const beforeSecondaryAttention = state.activeBattle.enmity.byEnemyId[enemies[1].id].entries[player.id].transient;

    state.activeBattle.rng = createSequenceRng([0.99, 0, 0.99, 0.99]);
    const pulse = advanceCombatSimulation(state, 4);
    const action = pulse.fieldAction;

    assert.ok(action);
    assert.equal(action.kind, 'fieldPulse');
    assert.equal(action.sourceId, 'ability-umbral-well');
    assert.equal(action.data.attention.mode, 'per-recipient');
    assert.deepEqual(action.data.geometry.recipients.map((entry) => entry.id), enemies.slice(0, 4).map((enemy) => enemy.id));
    assert.equal(action.data.geometry.radius, 2);
    assert.equal(action.data.geometry.maximumTargets, 4);
    assert.equal(action.data.effects[0].applied, false);
    assert.equal(action.data.effects[1].applied, true);
    assert.equal(action.data.effects[2].applied, false);
    assert.equal(action.data.effects[3].applied, false);

    assert.deepEqual(action.data.attention.applied.map((entry) => entry.enemyId), [enemies[1].id]);
    assert.equal(state.activeBattle.enmity.byEnemyId[enemies[0].id].entries[player.id].transient, beforePrimaryAttention);
    assert.ok(state.activeBattle.enmity.byEnemyId[enemies[1].id].entries[player.id].transient > beforeSecondaryAttention);
    assert.equal(state.activeBattle.enmity.byEnemyId[enemies[4].id].entries[player.id].transient, 0);
    assert.equal(state.activeBattle.enmity.byEnemyId[enemies[5].id].entries[player.id].transient, 0);
});

test('current-schema field validation rejects corrupt durable records and battle finalization clears fields after combat ends', () => {
    const state = createUmbralState({ enemyCount: 2, rng: () => 0 });
    resolveUmbralWell(state);
    assert.deepEqual(validateBattleFieldState(state.activeBattle), []);
    state.activeBattle.rng = null;

    const missingSnapshot = structuredClone(state.activeBattle);
    delete missingSnapshot.fields.records[0].sourceSnapshot;
    assert.ok(validateBattleFieldState(missingSnapshot).some((issue) => issue.includes('sourceSnapshot must be an object')));

    const invalidDeadline = structuredClone(state.activeBattle);
    invalidDeadline.fields.records[0].nextPulseAtWorldSeconds = invalidDeadline.fields.records[0].expiresAtWorldSeconds + 1;
    assert.ok(validateBattleFieldState(invalidDeadline).some((issue) => issue.includes('outstanding pulse deadline')));

    state.activeBattle.phase = 'victory';
    finalizeCombatState(state);
    assert.equal(state.activeBattle.fields.records.length, 0);
});

function createUmbralState(options = {}) {
    const state = createNewGameState({ mainJobId: 'elementalist' });
    grantCapability(state.player, 'spell-umbral-well');
    setLearnedSkill(state.player, 'darkMagic', 3);
    state.player.resources.mp = 100;
    state.player.resources.hp = 9999;

    const source = state.enemies.find((entry) => entry.identity?.name === 'Training Dummy');
    assert.ok(source);
    const count = options.enemyCount ?? 1;
    const enemies = Array.from({ length: count }, (_, index) => {
        const enemy = structuredClone(source);
        enemy.id = `umbral-dummy-${index + 1}`;
        enemy.identity = { ...enemy.identity, name: `Umbral Dummy ${index + 1}` };
        enemy.resources = { ...enemy.resources, hp: 999 };
        return enemy;
    });

    state.combatSequence = 1;
    state.activeBattle = createBattleState({
        id: 'battle-000001',
        player: state.player,
        enemies,
        rng: options.rng ?? null,
    });
    state.activeBattle.source = 'packet-6-test';
    ensureCombatContract(state.activeBattle, {
        nowWorldSeconds: state.worldTime.totalSeconds,
        combatants: state.activeBattle.combatants,
    });
    initializeCombatTimeline(state, state.activeBattle);
    battlePlayer(state).resources.mp = 100;
    battlePlayer(state).resources.hp = 9999;
    return state;
}

function resolveUmbralWell(state) {
    const started = activateAbility(state, 'Umbral Well', { targetQuery: 'Umbral Dummy 1' });
    assert.equal(started.code, 'ability.started');
    advanceWorldTime(state, 6);
    const result = reconcileAbilityActivation(state);
    assert.equal(result.code, 'ability.resolved');
    setAllEnemyReadinessFarFuture(state);
    return result;
}

function setAllEnemyReadinessFarFuture(state) {
    for (const enemy of battleEnemies(state)) {
        setCombatantReadyAt(state, enemy.id, state.worldTime.totalSeconds + 100000);
    }
}

function battlePlayer(state) {
    return state.activeBattle.combatants.find((entry) => entry.type === 'player');
}

function battleEnemies(state) {
    return state.activeBattle.combatants.filter((entry) => entry.type === 'enemy');
}
