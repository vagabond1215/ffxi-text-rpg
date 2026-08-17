export const DATABASES = Object.freeze({
    players: database('players', 'Player characters and account-local save state.', 'implemented', '0.2.0'),
    npcs: database('npcs', 'Non-player characters, services, dialogue hooks, shops, quest givers.', 'seeded', '0.2.0'),
    enemies: database('enemies', 'Encounter-instance templates linked to canonical species plus combat, resource-opportunity, and EXP hooks.', 'seeded', '0.2.1'),
    ecologyFamilies: database('ecologyFamilies', 'Canonical creature family records shared across species and population definitions.', 'seeded', '0.1.0'),
    species: database('species', 'Canonical species records separated from encounter instances, with habitat and behavior metadata.', 'seeded', '0.1.0'),
    populations: database('populations', 'Place-bound species populations with capacity, density, rarity, respawn, and deterministic appearance hooks.', 'seeded', '0.1.0'),
    gatheringSources: database('gatheringSources', 'Flora, mineral, and fishing sources with place, action, tool, output, depletion, and regeneration contracts.', 'seeded', '0.2.0'),
    gatheringWork: database('gatheringWork', 'Timed character-owned gathering work that composes ecology sources, equipped tools, proficiency, fictional time, and provenance.', 'implemented', '0.1.0'),
    resourceItems: database('resourceItems', 'Representative canonical raw-material item templates cross-linked to gathering provenance and sinks.', 'seeded', '0.1.0'),
    productionItems: database('productionItems', 'Canonical processed materials, crafted goods, meals, and salvage outputs with provenance and sink metadata.', 'seeded', '0.1.0'),
    productionProcesses: database('productionProcesses', 'Processing, crafting, cooking, salvage, and recycling definitions with inputs, outputs, stations, proficiency, and duration.', 'seeded', '0.1.0'),
    production: database('production', 'Canonical timed production execution, atomic input consumption, output storage recovery, proficiency gain, and provenance transformation.', 'implemented', '0.1.0'),
    workTasks: database('workTasks', 'Persistent hands-on work records coordinated with canonical timed tasks and activity ownership.', 'implemented', '0.1.0'),
    workProficiencies: database('workProficiencies', 'Continuous-character gathering, recovery, processing, crafting, cooking, and salvage mastery.', 'implemented', '0.1.0'),
    workstations: database('workstations', 'Semantic workstation availability derived from current locality service/POI context.', 'implemented', '0.1.0'),
    places: database('places', 'Continents, regions, localities, landmarks, cities, dungeons, interiors.', 'seeded', '0.3.1'),
    maps: database('maps', 'Map records connecting map knowledge/ownership to place clusters.', 'seeded', '0.3.1'),
    powers: database('powers', 'Starting power definitions, start places, and initial map/permission grants.', 'seeded', '0.3.2'),
    placeConnections: database('placeConnections', 'Transitional local graph edges and exit coordinates between places.', 'seeded-transitional', '0.3.2'),
    routes: database('routes', 'Canonical roads, tracks, causeways, caravan roads, waterways, stable stops, duration, distance, hazards, cargo, and knowledge hooks.', 'seeded', '0.1.0'),
    transportServices: database('transportServices', 'Scheduled reusable caravan/ferry service records with cadence, fares, stops, and cargo allowances.', 'seeded', '0.1.0'),
    contentPacks: database('contentPacks', 'Regional/shared content manifests with stable-ID ownership, dependencies, explicit collections, and cross-region references.', 'seeded', '0.1.0'),
    contentPackValidation: database('contentPackValidation', 'Unified pack ownership, topology, source/sink, dangling-reference, legacy-leak, and scale validation.', 'implemented', '0.1.0'),
    legacyCandidates: database('legacyCandidates', 'Review-only normalization records for historical/reference material; candidates are never canonical by parsing alone.', 'normalization-boundary', '0.1.0'),
    travel: database('travel', 'Canonical world-time journeys, route traversal, scheduled departures/arrivals, cancellation, and interrupt hooks.', 'implemented', '0.5.0'),
    projects: database('projects', 'Persistent project state with stable IDs, material contributions, labor, canonical time, and completion events.', 'implemented', '0.1.0'),
    commitments: database('commitments', 'Persistent accepted/resolved obligations tied to named NPC givers, provenance-aware requirements across gathered or produced goods, exactly-once rewards, and later follow-up.', 'implemented', '0.2.0'),
    relationships: database('relationships', 'Persistent NPC-specific familiarity, respect, trust, and obligation dimensions changed by concrete social/economic history.', 'implemented', '0.1.0'),
    resourceProvenance: database('resourceProvenance', 'Physical, economic, social, crafting, and explicitly exceptional magical acquisition metadata plus item sinks.', 'implemented', '0.1.0'),
    resourceOpportunities: database('resourceOpportunities', 'Persistent defeated-creature/body, carried-goods, and salvage opportunities with timed recovery actions.', 'implemented', '0.1.0'),
    capabilities: database('capabilities', 'Character-owned learned spells, techniques, and practical capabilities with separate learning paths and use requirements.', 'seeded', '0.2.0'),

    // Explicit historical/reference registries. These names remain non-canonical by design.
    ffxiStatGrades: database('ffxiStatGrades', 'FFXI-style race/job HP MP and attribute grade tables from the historical stat calculator model.', 'seeded-reference', '0.3.2'),
    ffxiInferredJobGrades: database('ffxiInferredJobGrades', 'HP/MP-only inferred historical job grades used for comparison research.', 'seeded-inferred-reference', '0.3.2'),
    expCalculation: database('expCalculation', 'Historical EXP calculation research notes and future pure-engine target.', 'documented-reference', '0.3.2'),
    legacyRecoveredData: database('legacyRecoveredData', 'Unverified useful data recovered from stale branches before pruning.', 'seeded-reference', '0.3.1'),

    quests: database('quests', 'Broader quest-definition pack fixtures beyond the canonical commitment runtime.', 'seeded-pack-fixture', '0.1.0'),
    achievements: database('achievements', 'Milestones, account/local accomplishments, titles, rewards.', 'planned', '0.0.0'),
    items: database('items', 'Equipment, consumables, materials, tools, provenance metadata, sinks, and currencies-as-items where needed.', 'seeded', '0.7.0'),
    keyItems: database('keyItems', 'Persistent unlocks, permissions, quest objects, maps, licenses, mounts, and companion access.', 'planned', '0.0.0'),
    magic: database('magic', 'Original spell schools and executable spell definitions with costs, activation time, cooldowns, targeting, and structured effects.', 'seeded', '0.1.0'),
    abilities: database('abilities', 'Executable active effect definitions for spells, techniques, and contextual actions; distinct from character capability ownership.', 'implemented', '0.1.0'),
    lootTables: database('lootTables', 'Transitional candidate output pools consumed by provenance-aware resource opportunities.', 'seeded-transitional', '0.1.0'),
    leveling: database('leveling', 'Character growth, EXP curves, discipline training records, proficiency training caps, and later advanced progression.', 'seeded', '0.6.0'),
    companions: database('companions', 'Persistent NPC-backed companion definitions, recruitment conditions, relationship dimensions, voiced field approaches, tactical roles, and combat integration.', 'implemented', '0.2.0'),
    party: database('party', 'Persistent recruited-companion membership, active-party capacity, location continuity, field preparation, and battle synchronization.', 'implemented', '0.2.0'),
    crafting: database('crafting', 'Canonical processing/crafting/cooking/salvage processes, tools/stations, timed work, proficiency, and provenance-bearing transformations.', 'implemented', '0.2.0'),
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