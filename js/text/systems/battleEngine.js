import { createBattleAttentionState } from './combatAttentionEngine.js';
import { resolveCombatDamage } from './combatResolutionEngine.js';
import { calculateCombatProfile } from './statEngine.js';

export const COMBAT_SIDES = Object.freeze({ ALLY: 'ally', ENEMY: 'enemy' });

export function createBattleState({ id = null, player, allies = [], enemies = [], rngSeed = null, rng = null } = {}) {
    if (!player) throw new Error('createBattleState requires a player entity.');
    if (!enemies.length) throw new Error('createBattleState requires at least one enemy.');

    const combatants = [
        refreshCombatant(player, COMBAT_SIDES.ALLY),
        ...allies.map((ally) => refreshCombatant(ally, COMBAT_SIDES.ALLY)),
        ...enemies.map((enemy) => refreshCombatant(enemy, COMBAT_SIDES.ENEMY)),
    ];
    return {
        id: id ?? `battle-${Date.now()}`,
        round: 1,
        phase: 'active',
        rngSeed,
        rng,
        combatants,
        enmity: createBattleAttentionState(combatants),
        loadoutTransition: null,
        skillchain: null,
        magicBurstWindow: null,
        log: ['Battle begins.'],
    };
}

export function refreshCombatant(entity, side = null) {
    const combat = calculateCombatProfile(entity);
    return {
        ...entity,
        combat,
        resources: {
            hp: entity.resources?.hp ?? combat.resources.maxHp,
            mp: entity.resources?.mp ?? combat.resources.maxMp,
            tp: entity.resources?.tp ?? 0,
        },
        battle: {
            side: side ?? inferCombatSide(entity),
            targetId: null,
            actionDelay: 0,
            recasts: {},
            casting: null,
            defeated: false,
        },
    };
}

export function resolveBasicAttack(battle, attackerId, defenderId, options = {}) {
    const attacker = getCombatant(battle, attackerId);
    const defender = getCombatant(battle, defenderId);
    if (!attacker || !defender) {
        appendBattleLog(battle, 'Invalid combatant.');
        return {
            ok: false,
            outcome: 'invalid-combatant',
            attackerId,
            defenderId,
            hit: false,
            damage: 0,
            defeatedTarget: false,
            resolution: null,
        };
    }
    if (attacker.battle.defeated || defender.battle.defeated) {
        return {
            ok: false,
            outcome: 'unavailable',
            attackerId,
            defenderId,
            hit: false,
            damage: 0,
            defeatedTarget: Boolean(defender.battle.defeated),
            resolution: null,
        };
    }
    if (getCombatantSide(attacker) === getCombatantSide(defender)) {
        return {
            ok: false,
            outcome: 'friendly-target',
            attackerId,
            defenderId,
            hit: false,
            damage: 0,
            defeatedTarget: false,
            resolution: null,
        };
    }

    const resolution = resolveCombatDamage(attacker, defender, {
        stat: 'str',
        base: Math.max(1, Number(attacker.combat?.level) || 1),
        coefficient: 0.5,
        resolution: {
            delivery: 'melee',
            channel: 'physical',
            damageType: 'physical',
            accuracyModel: 'physical',
            resistanceModel: 'physicalDefense',
            criticalEligible: false,
        },
    }, { rng: options.rng ?? battle.rng ?? Math.random });

    if (!resolution.hit) {
        appendBattleLog(battle, `${attacker.identity.name} misses ${defender.identity.name}.`);
        return {
            ok: true,
            outcome: 'miss',
            attackerId,
            defenderId,
            hit: false,
            damage: 0,
            hitChance: resolution.accuracy.chance,
            roll: resolution.accuracy.roll,
            defeatedTarget: false,
            resolution,
        };
    }

    const damage = resolution.damage;
    const hpBefore = defender.resources.hp;
    defender.resources.hp = Math.max(0, defender.resources.hp - damage);
    attacker.resources.tp = Math.min(attacker.combat.resources.maxTp, attacker.resources.tp + 100);
    defender.resources.tp = Math.min(defender.combat.resources.maxTp, defender.resources.tp + 30);

    appendBattleLog(battle, `${attacker.identity.name} hits ${defender.identity.name} for ${damage} damage.`);

    let defeatedTarget = false;
    if (defender.resources.hp <= 0) {
        defender.battle.defeated = true;
        defeatedTarget = true;
        appendBattleLog(battle, `${defender.identity.name} is defeated.`);
    }

    updateBattlePhase(battle);
    return {
        ok: true,
        outcome: defeatedTarget ? 'defeated-target' : 'hit',
        attackerId,
        defenderId,
        hit: true,
        damage,
        hpBefore,
        hpAfter: defender.resources.hp,
        hitChance: resolution.accuracy.chance,
        roll: resolution.accuracy.roll,
        defeatedTarget,
        resolution,
    };
}

export function performBasicAttack(battle, attackerId, defenderId, options = {}) {
    resolveBasicAttack(battle, attackerId, defenderId, options);
    return battle;
}

export function calculateHitChance(attacker, defender) {
    const accuracy = attacker.combat.derived.accuracy;
    const evasion = defender.combat.derived.evasion;
    return clamp(75 + (accuracy - evasion) / 2, 20, 95);
}

export function calculatePhysicalDamage(attacker, defender, options = {}) {
    const rng = options.rng ?? Math.random;
    const attack = attacker.combat.derived.attack;
    const defense = Math.max(1, defender.combat.derived.defense);
    const ratio = attack / defense;
    const base = Math.max(1, Math.floor(attacker.combat.level + attacker.combat.attributes.str / 2));
    const variance = 0.9 + rng() * 0.2;
    return Math.max(1, Math.floor(base * ratio * variance));
}

export function getCombatant(battle, id) {
    return battle.combatants.find((combatant) => combatant.id === id);
}

export function getCombatantSide(combatant) {
    return combatant?.battle?.side ?? inferCombatSide(combatant);
}

export function appendBattleLog(battle, entry) {
    battle.log.push(entry);
    if (battle.log.length > 100) battle.log.splice(0, battle.log.length - 100);
    return battle;
}

export function updateBattlePhase(battle) {
    const alliesAlive = battle.combatants.some((combatant) => getCombatantSide(combatant) === COMBAT_SIDES.ALLY && !combatant.battle.defeated);
    const enemiesAlive = battle.combatants.some((combatant) => getCombatantSide(combatant) === COMBAT_SIDES.ENEMY && !combatant.battle.defeated);
    if (!alliesAlive) battle.phase = 'defeat';
    else if (!enemiesAlive) battle.phase = 'victory';
    return battle.phase;
}

function inferCombatSide(entity) {
    return entity?.type === 'enemy' ? COMBAT_SIDES.ENEMY : COMBAT_SIDES.ALLY;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
