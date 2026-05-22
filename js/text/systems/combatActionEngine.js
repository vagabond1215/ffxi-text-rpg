import {
    appendBattleLog,
    createBattleState,
    getCombatant,
    performBasicAttack,
} from './battleEngine.js';
import { resolveBattleRewards } from './rewardEngine.js';

export function startEncounter(state, enemyId, options = {}) {
    if (state.activeBattle?.phase === 'active') {
        return { ok: false, message: 'You are already in battle.' };
    }

    const enemy = findEnemyDefinition(state, enemyId);
    if (!enemy) {
        return { ok: false, message: `Unknown enemy: ${enemyId}` };
    }

    state.activeBattle = createBattleState({
        player: state.player,
        enemies: [{ ...enemy, id: `${enemy.id}-encounter-${Date.now()}` }],
        rng: options.rng,
        rngSeed: options.rngSeed ?? null,
    });
    state.activeBattle.source = options.source ?? 'manual';
    state.activeBattle.sourceEnemyId = enemy.id;
    appendBattleLog(state.activeBattle, `${enemy.identity.name} engages you${options.reason ? `: ${options.reason}` : '.'}`);

    return {
        ok: true,
        message: describeBattle(state.activeBattle),
        battle: state.activeBattle,
    };
}

export function performPlayerAttack(state, targetQuery = null) {
    const battle = state.activeBattle;
    if (!isActiveBattle(battle)) return 'You are not in battle.';

    const player = getPlayerCombatant(battle);
    const target = getTargetCombatant(battle, targetQuery);
    if (!player || !target) return 'No valid target.';

    performBasicAttack(battle, player.id, target.id);
    if (battle.phase === 'active') performEnemyAutoActions(battle);
    syncPlayerFromBattle(state);
    return describeBattleTurn(battle);
}

export function performWeaponSkill(state, skillName = 'Weapon Skill', targetQuery = null) {
    const battle = state.activeBattle;
    if (!isActiveBattle(battle)) return 'You are not in battle.';

    const player = getPlayerCombatant(battle);
    const target = getTargetCombatant(battle, targetQuery);
    if (!player || !target) return 'No valid target.';
    if (player.resources.tp < 1000) return `Not enough TP. ${skillName} requires 1000 TP.`;

    player.resources.tp -= 1000;
    appendBattleLog(battle, `${player.identity.name} uses ${skillName}.`);
    performBasicAttack(battle, player.id, target.id);
    performBasicAttack(battle, player.id, target.id);
    if (battle.phase === 'active') performEnemyAutoActions(battle);
    syncPlayerFromBattle(state);
    return describeBattleTurn(battle);
}

export function castSpell(state, spellName = 'Cure', targetQuery = null) {
    const battle = state.activeBattle;
    if (!isActiveBattle(battle)) return 'You are not in battle.';

    const player = getPlayerCombatant(battle);
    if (!player) return 'No player combatant.';

    const normalized = String(spellName || 'Cure').toLowerCase();
    const mpCost = normalized.includes('cure') ? 8 : 10;
    if (player.resources.mp < mpCost) return `Not enough MP. ${spellName} requires ${mpCost} MP.`;
    player.resources.mp -= mpCost;

    if (normalized.includes('cure')) {
        const amount = Math.max(8, Math.floor(player.combat.attributes.mnd * 1.5));
        player.resources.hp = Math.min(player.combat.resources.maxHp, player.resources.hp + amount);
        appendBattleLog(battle, `${player.identity.name} casts ${spellName} and recovers ${amount} HP.`);
    } else {
        const target = getTargetCombatant(battle, targetQuery);
        if (!target) return 'No valid target.';
        const damage = Math.max(5, Math.floor(player.combat.attributes.int * 1.4));
        target.resources.hp = Math.max(0, target.resources.hp - damage);
        appendBattleLog(battle, `${player.identity.name} casts ${spellName} on ${target.identity.name} for ${damage} damage.`);
        if (target.resources.hp <= 0) {
            target.battle.defeated = true;
            appendBattleLog(battle, `${target.identity.name} is defeated.`);
            updateBattlePhaseLoose(battle);
        }
    }

    if (battle.phase === 'active') performEnemyAutoActions(battle);
    syncPlayerFromBattle(state);
    return describeBattleTurn(battle);
}

export function describeBattle(battle) {
    if (!battle) return 'No active battle.';

    const lines = [
        `Battle: ${battle.phase} round ${battle.round}`,
        ...battle.combatants.map((combatant) => {
            const tag = combatant.type === 'player' ? 'Player' : 'Enemy';
            const defeated = combatant.battle.defeated ? ' defeated' : '';
            return `${tag}: ${combatant.identity.name} HP ${combatant.resources.hp}/${combatant.combat.resources.maxHp} MP ${combatant.resources.mp}/${combatant.combat.resources.maxMp} TP ${combatant.resources.tp}/${combatant.combat.resources.maxTp}${defeated}`;
        }),
    ];

    if (battle.rewards?.resolved) {
        lines.push('', 'Rewards:', `- EXP: ${battle.rewards.exp}`, `- Gil: ${battle.rewards.gil}`);
        lines.push(`- Loot: ${battle.rewards.items.length ? battle.rewards.items.map((item) => item.name).join(', ') : 'none'}`);
    }

    lines.push('', 'Recent log:', ...battle.log.slice(-8).map((entry) => `- ${entry}`));
    return lines.join('\n');
}

export function describeBattleTurn(battle) {
    return describeBattle(battle);
}

export function isActiveBattle(battle) {
    return Boolean(battle && battle.phase === 'active');
}

function performEnemyAutoActions(battle) {
    const player = getPlayerCombatant(battle);
    if (!player || player.battle.defeated) return;

    const enemies = battle.combatants.filter((combatant) => combatant.type === 'enemy' && !combatant.battle.defeated);
    for (const enemy of enemies) {
        performBasicAttack(battle, enemy.id, player.id);
    }
    battle.round += 1;
}

function syncPlayerFromBattle(state) {
    const playerCombatant = getPlayerCombatant(state.activeBattle);
    if (!playerCombatant) return;
    state.player.resources = { ...playerCombatant.resources };
    if (state.activeBattle.phase === 'victory' && !state.activeBattle.rewards?.resolved) {
        const rewards = resolveBattleRewards(state, state.activeBattle);
        appendBattleLog(state.activeBattle, rewards.message);
    }
    if (state.activeBattle.phase !== 'active' && !state.activeBattle.endLogged) {
        appendBattleLog(state.activeBattle, `Battle ended: ${state.activeBattle.phase}.`);
        state.activeBattle.endLogged = true;
    }
}

function getPlayerCombatant(battle) {
    return battle?.combatants.find((combatant) => combatant.type === 'player') ?? null;
}

function getTargetCombatant(battle, targetQuery) {
    const enemies = battle.combatants.filter((combatant) => combatant.type === 'enemy' && !combatant.battle.defeated);
    if (!targetQuery) return enemies[0] ?? null;
    const normalized = normalize(targetQuery);
    return enemies.find((enemy) => normalize(enemy.identity.name).includes(normalized) || normalize(enemy.id).includes(normalized)) ?? enemies[0] ?? null;
}

function findEnemyDefinition(state, enemyId) {
    const normalized = normalize(enemyId);
    return (state.enemies ?? []).find((enemy) => normalize(enemy.id) === normalized || normalize(enemy.identity.name).includes(normalized)) ?? null;
}

function updateBattlePhaseLoose(battle) {
    const playersAlive = battle.combatants.some((combatant) => combatant.type === 'player' && !combatant.battle.defeated);
    const enemiesAlive = battle.combatants.some((combatant) => combatant.type === 'enemy' && !combatant.battle.defeated);
    if (!playersAlive) battle.phase = 'defeat';
    if (!enemiesAlive) battle.phase = 'victory';
}

function normalize(value) {
    return String(value ?? '').trim().toLowerCase().replace(/\s+/g, '-');
}
