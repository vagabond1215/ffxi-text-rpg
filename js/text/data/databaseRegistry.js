export const DATABASES = Object.freeze({
    players: database('players', 'Player characters and account-local save state.', 'implemented', '0.1.0'),
    npcs: database('npcs', 'Non-player characters, services, dialogue hooks, shops, quest givers.', 'seeded', '0.1.0'),
    enemies: database('enemies', 'Encounter-instance templates linked to canonical species plus combat, resource-opportunity, and EXP hooks.', 'seeded', '0.2.1'),
    ecologyFamilies: database('ecologyFamilies', 'Canonical creature family records shared across species and population definitions.', 'seeded', '0.1.0'),
    species: database('species', 'Canonical species records separated from encounter instances, with habitat and behavior metadata.', 'seeded', '0.1.0'),
    populations: database('populations', 'Place-bound species populations with capacity, density, rarity, respawn, and deterministic appearance hooks.', 'seeded', '0.1.0'),
    gatheringSources: database('gatheringSources', 'Flora, mineral, and fishing sources with place, action, tool, output, depletion, and regeneration contracts.', 'seeded', '0.1.0'),
    resourceItems: database('resourceItems', 'Representative canonical raw-material item templates cross-linked to gathering provenance and sinks.', 'seeded', '0.1.0'),
    places: database('places', 'Continents, regions, localities, landmarks, cities, dungeons, interiors.', 'seeded', '0.3.1'),
    maps: database('maps', 'Map records connecting map knowledge/ownership to place clusters.', 'seeded', '0.3.1'),
    powers: database('powers', 'Starting power definitions, start places, and initial map/permission grants.', 'seeded', '0.3.2'),
    placeConnections: database('placeConnections', 'Graph edges between places including directionality, travel time, and restrictions.', 'seeded', '0.3.2'),
    travel: database('travel', 'Travel methods, movement rules, mounts, roads, ferries, scheduled transport, and travel markers.', 'seeded', '0.3.2'),
    projects: database('projects', 'Persistent project state with stable IDs, material contributions, labor, canonical time, and completion events.', 'implemented', '0.1.0'),
    resourceProvenance: database('resourceProvenance', 'Physical, economic, social, crafting, and explicitly exceptional magical acquisition metadata plus item sinks.', 'implemented', '0.1.0'),
    resourceOpportunities: database('resourceOpportunities', 'Persistent defeated-creature/body, carried-goods, and salvage opportunities with timed recovery actions.', 'implemented', '0.1.0'),

    // Explicit historical/reference registries. These names remain non-canonical by design.
    ffxiStatGrades: database('ffxiStatGrades', 'FFXI-style race/job HP MP and attribute grade tables from the historical stat calculator model.', 'seeded-reference', '0.3.2'),
    ffxiInferredJobGrades: database('ffxiInferredJobGrades', 'HP/MP-only inferred historical job grades used for comparison research.', 'seeded-inferred-reference', '0.3.2'),
    expCalculation: database('expCalculation', 'Historical EXP calculation research notes and future pure-engine target.', 'documented-reference', '0.3.2'),
    legacyRecoveredData: database('legacyRecoveredData', 'Unverified useful data recovered from stale branches before pruning.', 'seeded-reference', '0.3.1'),

    quests: database('quests', 'Quest and commission definitions, objectives, prerequisites, rewards, repeatability, flags.', 'planned', '0.0.0'),
    achievements: database('achievements', 'Milestones, account/local accomplishments, titles, rewards.', 'planned', '0.0.0'),
    items: database('items', 'Equipment, consumables, materials, tools, provenance metadata, sinks, and currencies-as-items where needed.', 'seeded', '0.7.0'),
    keyItems: database('keyItems', 'Persistent unlocks, permissions, quest objects, maps, licenses, mounts, and companion access.', 'planned', '0.0.0'),
    magic: database('magic', 'Spells, magical proficiencies, costs, cast times, recasts, elements, targeting, effects.', 'planned', '0.0.0'),
    abilities: database('abilities', 'Discipline abilities, traits, weapon techniques, companion abilities, and enemy abilities.', 'planned', '0.0.0'),
    lootTables: database('lootTables', 'Transitional candidate output pools consumed by provenance-aware resource opportunities.', 'seeded-transitional', '0.1.0'),
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
