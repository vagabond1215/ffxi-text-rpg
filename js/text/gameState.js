import { createPlayerCharacter } from './entities/entityFactory.js';
import { createSeedEnemies, createSeedNpcs } from './data/seedEntities.js';
import { describePlace } from './systems/travelEngine.js';
import { calculateCombatProfile } from './systems/statEngine.js';

export function createInitialState() {
    const player = createPlayerCharacter({
        name: 'Adventurer',
        raceId: 'hume',
        mainJobId: 'warrior',
        level: 1,
    });

    return {
        version: 2,
        currentPlaceId: 'southern-sandoria',
        location: 'Southern San d\u2019Oria',
        travel: null,
        player,
        npcs: createSeedNpcs(),
        enemies: createSeedEnemies(),
        inventory: player.inventory,
        flags: {},
        log: [],
        activeBattle: null,
    };
}

export function describeLocation(state) {
    const currentPlaceId = state.currentPlaceId ?? 'southern-sandoria';
    const npcsHere = (state.npcs ?? [])
        .filter((npc) => npc.identity.locationId === currentPlaceId)
        .map((npc) => `- ${npc.identity.name}${npc.identity.title ? `, ${npc.identity.title}` : ''}`);

    return [
        describePlace(currentPlaceId),
        '',
        'Visible NPCs:',
        ...(npcsHere.length ? npcsHere : ['- None']),
    ].join('\n');
}

export function describeCharacter(state) {
    const player = state.player;
    const combat = calculateCombatProfile(player);
    const identity = player.identity;
    const jobs = player.jobs;

    return [
        `${identity.name}`,
        `Race: ${identity.raceName} (${identity.sex})`,
        `Nation: ${identity.nation}`,
        `Title: ${identity.title}`,
        `Job: ${jobs.mainJobName} Lv.${jobs.level}${jobs.supportJobName ? ` / ${jobs.supportJobName} Lv.${jobs.supportLevel}` : ''}`,
        `HP: ${player.resources.hp}/${combat.resources.maxHp}`,
        `MP: ${player.resources.mp}/${combat.resources.maxMp}`,
        `TP: ${player.resources.tp}/${combat.resources.maxTp}`,
        `Gil: ${player.wallet.gil}`,
        `Location: ${state.location}`,
    ].join('\n');
}

export function describeStats(state) {
    const combat = calculateCombatProfile(state.player);
    const attrs = combat.attributes;
    const derived = combat.derived;

    return [
        'Attributes:',
        `STR ${attrs.str}  DEX ${attrs.dex}  VIT ${attrs.vit}  AGI ${attrs.agi}`,
        `INT ${attrs.int}  MND ${attrs.mnd}  CHR ${attrs.chr}`,
        '',
        'Derived:',
        `Attack ${derived.attack}  Defense ${derived.defense}`,
        `Accuracy ${derived.accuracy}  Evasion ${derived.evasion}`,
        `Magic Attack ${derived.magicAttack}  Magic Accuracy ${derived.magicAccuracy}`,
        `Magic Defense ${derived.magicDefense}  Magic Evasion ${derived.magicEvasion}`,
    ].join('\n');
}

export function describeNpcs(state) {
    if (!state.npcs?.length) return 'No NPCs are currently loaded.';

    return state.npcs
        .map((npc) => [
            `${npc.identity.name}${npc.identity.title ? `, ${npc.identity.title}` : ''}`,
            `  Disposition: ${npc.disposition}`,
            `  Services: ${npc.services.length ? npc.services.join(', ') : 'none'}`,
        ].join('\n'))
        .join('\n\n');
}

export function describeEnemies(state) {
    if (!state.enemies?.length) return 'No enemies are currently loaded.';

    return state.enemies
        .map((enemy) => {
            const combat = calculateCombatProfile(enemy);
            return `${enemy.identity.name} Lv.${enemy.level} (${enemy.identity.family}) HP ${enemy.resources.hp}/${combat.resources.maxHp}`;
        })
        .join('\n');
}

export function describeInventory(state) {
    const inventory = state.player?.inventory ?? state.inventory ?? [];
    if (!inventory.length) {
        return 'Inventory is empty.';
    }

    return inventory
        .map((item, index) => `${index + 1}. ${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ''}`)
        .join('\n');
}

export function appendLog(state, entry) {
    state.log.push({
        at: new Date().toISOString(),
        entry,
    });

    if (state.log.length > 100) {
        state.log.splice(0, state.log.length - 100);
    }
}
