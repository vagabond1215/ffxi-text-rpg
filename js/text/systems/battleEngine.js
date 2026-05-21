import { calculateCombatProfile } from './statEngine.js';

export function createBattleState({ player, enemies = [], rngSeed = null } = {}) {
    if (!player) throw new Error('createBattleState requires a player entity.');
    if (!enemies.length) throw new Error('createBattleState requires at least one enemy.');

    return {
        id: `battle-${Date.now()}`,
        round: 1,
        phase: 'active',
        rngSeed,
        combatants: [refreshCombatant(player), ...enemies.map(refreshCombatant)],
        enmity: {},
        skillchain: null,
        magicBurstWindow: null,
        log: ['Battle begins.'],
    };
}

export function refreshCombatant(entity) {
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
            targetId: null,
            actionDelay: 0,
            recasts: {},
            casting: null,
            defeated: false,
        },
    };
}

export function performBasicAttack(battle, attackerId, defenderId) {
    const attacker = getCombatant(battle, attackerId);
    const defender = getCombatant(battle, defenderId);
    if (!attacker || !defender) return appendBattleLog(battle, 'Invalid combatant.');
    if (attacker.battle.defeated || defender.battle.defeated) return battle;

    const hitChance = calculateHitChance(attacker, defender);
    const roll = Math.random() * 100;
    if (roll > hitChance) {
        return appendBattleLog(battle, `${attacker.identity.name} misses ${defender.identity.name}.`);
    }

    const damage = calculatePhysicalDamage(attacker, defender);
    defender.resources.hp = Math.max(0, defender.resources.hp - damage);
    attacker.resources.tp = Math.min(attacker.combat.resources.maxTp, attacker.resources.tp + 100);
    defender.resources.tp = Math.min(defender.combat.resources.maxTp, defender.resources.tp + 30);

    appendBattleLog(battle, `${attacker.identity.name} hits ${defender.identity.name} for ${damage} damage.`);

    if (defender.resources.hp <= 0) {
        defender.battle.defeated = true;
        appendBattleLog(battle, `${defender.identity.name} is defeated.`);
    }

    updateBattlePhase(battle);
    return battle;
}

export function calculateHitChance(attacker, defender) {
    const accuracy = attacker.combat.derived.accuracy;
    const evasion = defender.combat.derived.evasion;
    return clamp(75 + (accuracy - evasion) / 2, 20, 95);
}

export function calculatePhysicalDamage(attacker, defender) {
    const attack = attacker.combat.derived.attack;
    const defense = Math.max(1, defender.combat.derived.defense);
    const ratio = attack / defense;
    const base = Math.max(1, Math.floor(attacker.combat.level + attacker.combat.attributes.str / 2));
    const variance = 0.9 + Math.random() * 0.2;
    return Math.max(1, Math.floor(base * ratio * variance));
}

export function getCombatant(battle, id) {
    return battle.combatants.find((combatant) => combatant.id === id);
}

export function appendBattleLog(battle, entry) {
    battle.log.push(entry);
    if (battle.log.length > 100) battle.log.splice(0, battle.log.length - 100);
    return battle;
}

function updateBattlePhase(battle) {
    const playersAlive = battle.combatants.some((combatant) => combatant.type === 'player' && !combatant.battle.defeated);
    const enemiesAlive = battle.combatants.some((combatant) => combatant.type === 'enemy' && !combatant.battle.defeated);
    if (!playersAlive) battle.phase = 'defeat';
    if (!enemiesAlive) battle.phase = 'victory';
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
