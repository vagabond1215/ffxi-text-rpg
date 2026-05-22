export const DATABASES = Object.freeze({
    players: database('players', 'Player characters and account-local save state.', 'implemented', '0.1.0'),
    npcs: database('npcs', 'Non-player characters, services, dialogue hooks, shops, quest givers.', 'seeded', '0.1.0'),
    enemies: database('enemies', 'Enemy definitions, families, ecosystems, aggro rules, drops, EXP hooks.', 'seeded', '0.1.0'),
    places: database('places', 'Continents, regions, zones, landmarks, cities, dungeons, interiors.', 'seeded', '0.3.1'),
    maps: database('maps', 'Map records connecting key-item map ownership to place clusters.', 'seeded', '0.3.1'),
    nations: database('nations', 'Starting nation definitions, start places, and initial map/key-item grants.', 'seeded', '0.3.1'),
    zoneConnections: database('zoneConnections', 'Graph edges between places including directionality, travel time, and restrictions.', 'seeded', '0.3.1'),
    travel: database('travel', 'Travel methods, movement rules, mounts, teleports, ferries, airships, home points.', 'seeded', '0.3.1'),
    ffxiStatGrades: database('ffxiStatGrades', 'FFXI-style race/job HP MP and attribute grade tables from the historical stat calculator model.', 'seeded', '0.3.2'),
    ffxiInferredJobGrades: database('ffxiInferredJobGrades', 'HP/MP-only inferred newer-job grades derived from HP/MP ranking comparisons; full attribute grades still unknown.', 'seeded-inferred', '0.3.2'),
    expCalculation: database('expCalculation', 'FFXI-style EXP calculation research notes and future pure-engine target.', 'documented', '0.3.2'),
    legacyRecoveredData: database('legacyRecoveredData', 'Unverified useful data recovered from stale branches before pruning.', 'seeded', '0.3.1'),
    quests: database('quests', 'Quest definitions, objectives, prerequisites, rewards, repeatability, flags.', 'planned', '0.0.0'),
    achievements: database('achievements', 'Milestones, account/local accomplishments, titles, rewards.', 'planned', '0.0.0'),
    items: database('items', 'Equipment, consumables, materials, tools, currencies-as-items where needed.', 'seeded', '0.6.0'),
    keyItems: database('keyItems', 'Persistent unlocks, permissions, quest objects, maps, licenses, mounts, trusts.', 'planned', '0.0.0'),
    magic: database('magic', 'Spells, magic skills, costs, cast times, recasts, elements, targeting, effects.', 'planned', '0.0.0'),
    abilities: database('abilities', 'Job abilities, traits, weapon skills, trust abilities, enemy abilities.', 'planned', '0.0.0'),
    lootTables: database('lootTables', 'Drop pools, drop rates, treasure rules, currency drops, quest drops.', 'planned', '0.0.0'),
    leveling: database('leveling', 'EXP curves, level caps, skill caps, job levels, limit breaks, merits/job points.', 'seeded', '0.5.0'),
    trusts: database('trusts', 'AI companion unlocks, behavior profiles, roles, spells, abilities, progression.', 'planned', '0.0.0'),
    crafting: database('crafting', 'Recipes, crystals, ingredients, skill checks, HQ tiers, guild support.', 'planned', '0.0.0'),
    mounts: database('mounts', 'Mount unlocks, travel modifiers, restrictions, zone permission rules.', 'planned', '0.0.0'),
    statusEffects: database('statusEffects', 'Buffs, debuffs, food, songs, rolls, DoTs, regen/refresh/regain, KO states.', 'seeded', '0.1.0'),
    ticks: database('ticks', 'Live tick subscriptions for combat, travel, magic, status effects, respawns, cooldowns.', 'planned', '0.0.0'),
});

export function listDatabases() {
    return Object.values(DATABASES);
}

export function describeDatabases() {
    return listDatabases()
        .map((db) => `${db.id} [${db.status} ${db.version}] - ${db.description}`)
        .join('\n');
}

function database(id, description, status, version) {
    return Object.freeze({ id, description, status, version });
}
