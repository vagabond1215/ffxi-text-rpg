export const DATABASES = Object.freeze({
    players: database('players', 'Player characters and account-local save state.', 'implemented', '0.1.0'),
    npcs: database('npcs', 'Non-player characters, services, dialogue hooks, shops, quest givers.', 'seeded', '0.1.0'),
    enemies: database('enemies', 'Enemy definitions, families, ecosystems, aggro rules, drops, EXP hooks.', 'seeded', '0.1.0'),
    places: database('places', 'Continents, regions, localities, landmarks, cities, dungeons, interiors.', 'seeded', '0.3.1'),
    maps: database('maps', 'Map records connecting map knowledge/ownership to place clusters.', 'seeded', '0.3.1'),
    powers: database('powers', 'Starting power definitions, start places, and initial map/permission grants.', 'seeded', '0.3.2'),
    placeConnections: database('placeConnections', 'Graph edges between places including directionality, travel time, and restrictions.', 'seeded', '0.3.2'),
    travel: database('travel', 'Travel methods, movement rules, mounts, roads, ferries, scheduled transport, and travel markers.', 'seeded', '0.3.2'),

    // Explicit historical/reference registries. These names remain non-canonical by design.
    ffxiStatGrades: database('ffxiStatGrades', 'FFXI-style race/job HP MP and attribute grade tables from the historical stat calculator model.', 'seeded-reference', '0.3.2'),
    ffxiInferredJobGrades: database('ffxiInferredJobGrades', 'HP/MP-only inferred historical job grades used for comparison research.', 'seeded-inferred-reference', '0.3.2'),
    expCalculation: database('expCalculation', 'Historical EXP calculation research notes and future pure-engine target.', 'documented-reference', '0.3.2'),
    legacyRecoveredData: database('legacyRecoveredData', 'Unverified useful data recovered from stale branches before pruning.', 'seeded-reference', '0.3.1'),

    quests: database('quests', 'Quest and commission definitions, objectives, prerequisites, rewards, repeatability, flags.', 'planned', '0.0.0'),
    achievements: database('achievements', 'Milestones, account/local accomplishments, titles, rewards.', 'planned', '0.0.0'),
    items: database('items', 'Equipment, consumables, materials, tools, and currencies-as-items where needed.', 'seeded', '0.6.0'),
    keyItems: database('keyItems', 'Persistent unlocks, permissions, quest objects, maps, licenses, mounts, and companion access.', 'planned', '0.0.0'),
    magic: database('magic', 'Spells, magical proficiencies, costs, cast times, recasts, elements, targeting, effects.', 'planned', '0.0.0'),
    abilities: database('abilities', 'Discipline abilities, traits, weapon techniques, companion abilities, and enemy abilities.', 'planned', '0.0.0'),
    lootTables: database('lootTables', 'Legacy drop pools plus later provenance-aware reward/source rules.', 'planned', '0.0.0'),
    leveling: database('leveling', 'EXP curves, level caps, skill caps, discipline levels, and later advanced progression.', 'seeded', '0.5.0'),
    companions: database('companions', 'AI companion recruitment, behavior profiles, roles, equipment, abilities, and progression.', 'planned', '0.0.0'),
    crafting: database('crafting', 'Recipes/processes, catalysts, ingredients, tools/stations, skill checks, quality, and guild support.', 'planned', '0.0.0'),
    mounts: database('mounts', 'Mount unlocks, travel modifiers, restrictions, and place/route permission rules.', 'planned', '0.0.0'),
    statusEffects: database('statusEffects', 'Buffs, debuffs, food, stances, ongoing effects, regeneration, and KO states.', 'seeded', '0.1.0'),
    ticks: database('ticks', 'Live tick subscriptions for combat, travel, magic, status effects, respawns, and cooldowns.', 'planned', '0.0.0'),
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
