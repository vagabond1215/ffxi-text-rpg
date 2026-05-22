import { getLootTable } from '../data/lootTables.js';
import { addItemToContainer } from './inventoryEngine.js';

export function resolveBattleRewards(state, battle, options = {}) {
    if (!state?.player || !battle) return { ok: false, message: 'No battle rewards can be resolved.' };
    if (battle.phase !== 'victory') return { ok: false, message: 'Battle rewards require victory.' };
    if (battle.rewards?.resolved) return { ok: false, duplicate: true, message: 'Battle rewards already resolved.' };

    const rng = options.rng ?? battle.rng ?? Math.random;
    const defeatedEnemies = battle.combatants.filter((combatant) => combatant.type === 'enemy' && combatant.battle.defeated);
    const exp = defeatedEnemies.reduce((total, enemy) => total + (Number(enemy.expValue) || 0), 0);
    const gil = defeatedEnemies.reduce((total, enemy) => total + inferGilReward(enemy), 0);
    const lootResults = defeatedEnemies.flatMap((enemy) => rollLootForEnemy(enemy, rng));
    const inserted = [];
    const failed = [];

    state.player.progression.exp = (state.player.progression.exp ?? 0) + exp;
    state.player.wallet.gil = (state.player.wallet.gil ?? 0) + gil;

    for (const loot of lootResults) {
        const result = addItemToContainer(state.player.inventoryState, 'inventory', loot.item);
        if (result.ok) inserted.push(loot.item);
        else failed.push({ item: loot.item, reason: result.reason });
    }

    battle.rewards = {
        resolved: true,
        exp,
        gil,
        items: inserted,
        failedItems: failed,
    };

    return {
        ok: true,
        exp,
        gil,
        items: inserted,
        failedItems: failed,
        message: describeRewardResult({ exp, gil, items: inserted, failedItems: failed }),
    };
}

export function describeRewardResult(result) {
    const lines = [
        'Battle rewards:',
        `- EXP: ${result.exp}`,
        `- Gil: ${result.gil}`,
    ];
    if (result.items.length) lines.push(`- Loot: ${result.items.map((item) => item.name).join(', ')}`);
    else lines.push('- Loot: none');
    if (result.failedItems.length) {
        lines.push('- Loot storage failed:');
        lines.push(...result.failedItems.map((entry) => `  - ${entry.item.name}: ${entry.reason}`));
    }
    return lines.join('\n');
}

function rollLootForEnemy(enemy, rng) {
    const table = getLootTable(enemy.lootTableId);
    if (!table) return [];
    return table.drops
        .filter((drop) => rng() < drop.chance)
        .map((drop) => ({ enemy, item: createLootItem(drop, enemy, table) }));
}

function createLootItem(drop, enemy, table) {
    return {
        id: drop.id,
        name: drop.name,
        kind: drop.kind,
        quantity: drop.quantity,
        valueGil: drop.valueGil,
        tags: [...drop.tags],
        source: {
            type: 'loot',
            enemyId: enemy.sourceEnemyId ?? enemy.id,
            lootTableId: table.id,
        },
    };
}

function inferGilReward(enemy) {
    if (Number.isFinite(enemy.gilValue)) return Math.max(0, Math.floor(enemy.gilValue));
    if (enemy.family === 'construct') return 0;
    return Math.max(0, Math.floor((enemy.level ?? 1) * 3));
}
