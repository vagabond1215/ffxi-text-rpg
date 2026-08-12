import { awardExperience } from './progressionEngine.js';
import { createDefeatedEnemyResourceOpportunity } from './resourceOpportunityEngine.js';

export function resolveBattleRewards(state, battle, options = {}) {
    if (!state?.player || !battle) return { ok: false, message: 'No battle rewards can be resolved.' };
    if (battle.phase !== 'victory') return { ok: false, message: 'Battle rewards require victory.' };
    if (battle.rewards?.resolved) return { ok: false, duplicate: true, message: 'Battle rewards already resolved.' };

    const defeatedEnemies = battle.combatants.filter((combatant) => combatant.type === 'enemy' && combatant.battle.defeated);
    const exp = defeatedEnemies.reduce((total, enemy) => total + (Number(enemy.expValue) || 0), 0);
    const gil = defeatedEnemies.reduce((total, enemy) => total + inferGilReward(enemy), 0);
    const resourceOpportunities = [];

    const progression = awardExperience(state.player, exp);
    state.player.wallet.gil = (state.player.wallet.gil ?? 0) + gil;

    for (const enemy of defeatedEnemies) {
        const result = createDefeatedEnemyResourceOpportunity(state, enemy, {
            battleId: battle.id,
            placeId: options.placeId ?? state.currentPlaceId ?? enemy.identity?.zoneId ?? null,
            condition: options.bodyCondition ?? 1,
        });
        if (result?.ok) resourceOpportunities.push(result.data.opportunity);
    }

    battle.rewards = {
        resolved: true,
        exp,
        gil,
        progression,
        items: [],
        failedItems: [],
        resourceOpportunities,
    };

    return {
        ok: true,
        exp,
        gil,
        progression,
        items: [],
        failedItems: [],
        resourceOpportunities,
        message: describeRewardResult({ exp, gil, progression, resourceOpportunities }),
    };
}

export function describeRewardResult(result) {
    const opportunities = result.resourceOpportunities ?? [];
    const lines = [
        'Battle rewards:',
        `- EXP: ${result.exp}`,
        `- Gil: ${result.gil}`,
    ];
    if (result.progression?.levelUps?.length) {
        lines.push(`- Level up: ${result.progression.levelUps.join(', ')}`);
    }
    if (opportunities.length) {
        lines.push(`- Recoverable resources: ${opportunities.map((entry) => `${entry.id} ${entry.sourceName}`).join(', ')}`);
        lines.push('- Materials remain in the world until recovered through an appropriate action.');
    } else {
        lines.push('- Recoverable resources: none');
    }
    return lines.join('\n');
}

function inferGilReward(enemy) {
    if (Number.isFinite(enemy.gilValue)) return Math.max(0, Math.floor(enemy.gilValue));
    if ((enemy.identity?.family ?? enemy.family) === 'construct') return 0;
    return Math.max(0, Math.floor((enemy.level ?? 1) * 3));
}
