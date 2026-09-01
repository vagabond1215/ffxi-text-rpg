# World Identity and Content Policy

This document is authoritative for setting identity, content provenance, naming, and the order in which new gameplay data is authored.

## Product identity

The project is an original text-first persistent fantasy life RPG. Its working product identity is **Hearth & Horizon** until a later title review deliberately replaces it.

The game may learn from the design tenets of older MMORPGs, life RPGs, tabletop games, survival games, and simulation games, but canonical content must not be a transcription of another game's world, proper nouns, factions, races, classes, currencies, maps, quests, monsters, NPCs, or item catalogs.

The design inheritance we want to preserve is systemic rather than nominal:

- dangerous travel and preparation matter;
- progress is earned through use, training, work, exploration, and relationships;
- one persistent character can learn across disciplines;
- equipment and preparation create practical build limits;
- the world contains regional economies and material chains;
- gathering, hunting, crafting, cooking, trade, combat, and quests share the same resources;
- settlements are social, economic, and logistical hubs rather than menu screens;
- the player can establish a home base without being confined to one city;
- roads, wilderness, caravans, ferries, mounts, and other transport connect a larger sandbox world;
- maps represent knowledge and navigation rather than artificial player-facing level boundaries;
- rewards should have physical or social provenance rather than appearing from nowhere.

## Legacy material policy

Existing FFXI-derived files and terminology are **legacy research/source material**, not canonical world content.

Legacy material may be used to study:

- pacing and progression curves;
- equipment and stat relationships;
- broad monster/ecology patterns;
- spell and ability taxonomies;
- gathering/crafting/economy structures;
- travel-network density;
- content-volume expectations;
- historical formulas where they provide useful reference points.

Legacy material must not be copied into new canonical databases as-is. Any imported structure must pass through an explicit normalization/originalization step.

### Allowed legacy artifacts

Legacy modules may remain temporarily when they are useful for regression comparison, migration, or research. They must be clearly named or documented as legacy/reference data and must not become the source of truth for new content.

Examples include historical stat-grade tables, recovered legacy datasets, old spell/item files, or command adapters retained for compatibility.

## Canonical naming rule

Before large content-database expansion, canonical runtime/player-facing names and stable IDs must move to the original setting.

This includes, where applicable:

- world, regions, cities, districts, roads, dungeons, landmarks, and transport routes;
- nations/factions and civic institutions;
- ancestries/species;
- disciplines and advanced training traditions;
- currencies and reputation resources;
- monsters, creature families, and named rare spawns;
- NPCs, shops, guilds, and services;
- mounts, companions, storage concepts, map terminology, and travel infrastructure;
- items, spells, abilities, recipes, quests, and achievements as those databases are expanded.

Generic fantasy or real-world vocabulary such as `sword`, `inn`, `goblin`, `caravan`, `iron`, `bread`, or `alchemy` may be used when it is the clearest language. The goal is not forced thesaurus renaming. The goal is to remove inherited proprietary identity and give regions, cultures, creatures, institutions, and histories their own character.

## Stable ID migration policy

Display-name replacement alone is not sufficient if canonical stable IDs still encode legacy setting names.

The runtime migration will therefore:

1. introduce canonical original IDs;
2. provide an explicit legacy-to-canonical alias table at migration/input boundaries;
3. migrate persisted Game State fields that contain renamed IDs;
4. update maps, place connections, POIs, shops, spawns, nation records, and tests atomically;
5. keep compatibility aliases bounded and documented rather than allowing them to become permanent second schemas.

If persisted state changes shape or identifier vocabulary, the relevant save schema version must be bumped and migrated using the existing ordered migration mechanism.

## Initial setting vocabulary

The first original-world pass uses the following working canon. These names are canonical once the runtime migration lands; changing them later requires a deliberate content migration rather than casual churn.

### Starting powers and regions

| Role | Canonical name | Character |
| --- | --- | --- |
| Western crown realm | **Thornwall** | Old forest capital shaped by oath, timber, hunting, stone keeps, and court politics. |
| Western wild region | **Elderwood** | Managed royal forest giving way to old growth, logging tracks, forgotten shrines, and raider territory. |
| Forge republic | **Brasshaven** | Dense mercantile-industrial city built around mines, foundries, engineering, labor, and civic competition. |
| Forge hinterland | **Redstone Reach** | Dry uplands, exposed ore, quarry roads, mines, wind-scoured ridges, and caravan routes. |
| Scholastic canal city | **Mistmere** | Wetland city of colleges, gardens, observatories, canals, herbalists, and practical magic. |
| Eastern wild region | **Starfen** | Bright marsh-grassland mosaic containing reed villages, ruins, herb beds, shallow waterways, and old magical works. |
| Central future trade hub | **Waymeet** | Neutral crossroads city intended to become a major caravan, ferry, guild, and long-distance travel interchange. |

These are starting anchors, not the complete world. New regions should develop their own naming patterns, economies, history, ecology, and social conflicts rather than repeating the three starter templates.

### Starting ancestry migration

The current five mechanical ancestry slots migrate to original identities while preserving existing stat behavior until a later balance pass:

| Legacy slot | Canonical ancestry | Direction |
| --- | --- | --- |
| Hume | **Human** | Broadly adaptable populations found across the major powers. |
| Elvaan | **Lethari** | Tall long-lived woodland and highland people with strong martial and oath traditions. |
| Tarutaru | **Miri** | Small-bodied people with strong traditions of scholarship, craft, and practical magic. |
| Mithra | **Veyra** | Agile clan-based people with strong hunting, scouting, trade, and travel traditions. |
| Galka | **Korren** | Large resilient people with deep mining, masonry, engineering, and diasporic traditions. |

These descriptions are starting cultural directions, not biological destiny. Origins, upbringing, training, relationships, and individual choices should matter more than ancestry stereotypes.

### Discipline migration

The current job scaffold remains mechanically transitional, but player-facing/canonical discipline names will migrate away from Final Fantasy-specific labels before capability database expansion.

| Legacy scaffold | Canonical discipline |
| --- | --- |
| Warrior | Vanguard |
| Monk | Pugilist |
| White Mage | Lifewarden |
| Black Mage | Elementalist |
| Red Mage | Spellblade |
| Thief | Shadowhand |
| Paladin | Oathguard |
| Dark Knight | Duskblade |
| Beastmaster | Wildbinder |
| Bard | Cantor |
| Ranger | Wayfinder |
| Samurai | Blade Adept |
| Ninja | Veilrunner |
| Dragoon | Sky Lancer |
| Summoner | Eidolist |
| Blue Mage | Echo Sage |
| Corsair | Free Captain |
| Puppetmaster | Artificer |
| Dancer | Rhythmblade |
| Scholar | Savant |
| Geomancer | Leykeeper |
| Rune Fencer | Wardsword |

The later capability system is not required to reproduce one-to-one class restrictions. Disciplines describe schools and training traditions; capabilities enable actions; loadouts and preparation constrain effective use.

## Content provenance model

The content model must support a physical/social origin for rewards.

Canonical acquisition categories include:

- carried inventory searched from defeated or surrendered humanoids;
- carcass/body processing such as skinning, butchering, plucking, bone recovery, gland extraction, or salvage;
- gathering from plants, fungi, trees, mineral deposits, clay, water, shoreline, nests, and similar world sources;
- fishing, trapping, hunting, and husbandry;
- salvage or dismantling of constructs, tools, equipment, ruins, and containers;
- crafting and processing transformations;
- purchase, barter, wages, contracts, gifts, reputation rewards, and quest rewards;
- deliberate exceptional magical creation where the fiction and mechanics explicitly justify it.

A defeated animal should not automatically materialize a finished pelt in inventory. Combat can create access to a body/resource opportunity; recovery actions, tools, time, condition, skill, and player choice determine what is obtained.

## Content graph requirement

Major content records should participate in a connected graph rather than isolated lists.

Examples:

`creature -> carcass/resource outputs -> processing -> ingredients/components -> recipes -> usable goods -> shops/contracts/quests`

`region -> habitats -> spawns/gathering nodes -> travel routes -> settlements -> services -> economy -> objectives`

`NPC -> schedule/location -> relationship -> services/dialogue -> quests/contracts -> faction/reputation`

Every canonical item should eventually have at least one intentional source and at least one meaningful sink/use, unless explicitly marked as decorative, collectible, quest-only, or transitional.

## Content-pack architecture

New world content should be authored in regional content packs rather than a single giant hand-maintained file.

A mature regional pack may contain:

- places and internal localities;
- route/connection data;
- map/cartography knowledge;
- landmarks and discoveries;
- NPC population records and schedules;
- shops, services, lodging, guilds, trainers, and transport;
- creature/ecology records and spawn populations;
- flora, minerals, fishing waters, and other gatherables;
- item/resource definitions introduced by the region;
- recipes and processing chains;
- quests, contracts, events, rewards, and reputation hooks;
- relationships and companion candidates;
- lore and descriptive text.

The runtime must validate cross-references between these records.

## Required content validation

Before large-scale data generation, validation must be able to detect at minimum:

- missing stable IDs and duplicate IDs;
- references to nonexistent places, items, creatures, NPCs, recipes, quests, shops, or transport routes;
- spawn definitions with no valid habitat/place;
- harvest outputs with no item definition;
- recipe ingredients/products that do not exist;
- items with no source or no use unless intentionally exempted;
- shops stocking nonexistent goods;
- quests whose objectives cannot be completed in reachable world data;
- rewards referencing nonexistent content;
- transport routes with missing stops or impossible topology;
- maps referencing nonexistent places;
- relationship/companion records referencing nonexistent NPCs;
- legacy identifiers leaking into canonical packs without an explicit adapter.

## Combat ability originality and naming

External RPGs may be studied for mechanical patterns, progression structures, timing models, and usability lessons. Their player-facing ability names, proper nouns, fictional schools, classes, monsters, items, and lore are not canonical content sources.

Hearth & Horizon combat names should:
- be original to this setting;
- describe visible force/form/motion/result clearly enough to be learnable;
- avoid opaque invented terminology when ordinary world language communicates the action better;
- avoid bland numbered renames when progression can remain a rank/mastery change;
- reserve a new name for a materially different form, delivery, geometry, timing, or tactical purpose.

Permanent combat naming/mechanics authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

## Scale policy

Content volume is a first-class engineering requirement. Engine milestones must ship with enough real interconnected content to expose scaling problems.

Planning ranges are not hard quotas, but the order of magnitude matters:

| Content | Mechanics integration target | Playable-alpha target | 1.0-scale target |
| --- | ---: | ---: | ---: |
| Connected regions/localities | 10–15 | 30–50 | 75–125+ |
| Named NPCs | 50+ | 250–400 | 700–1,200 |
| Functional shops/services | 20+ | 60–100 | 150+ |
| Creature/fauna definitions | 40–60 | 120–180 | 300–500 |
| Flora/resource definitions | 40+ | 100–150 | 250+ |
| Canonical items | 200–300 | 800–1,500 | 2,500–5,000 |
| Recipes/processes | 75–125 | 300–500 | 800–1,500 |
| Spells/abilities/techniques | 100+ | 250–400 | 500+ |
| Quests/contracts | 30–50 | 150–250 | 500+ |
| Recruitable companions | 4–6 | 12–20 | 25–40 |
| Deep romance-capable NPCs | 2–4 | 8–12 | 15–25 |
| Scheduled transport routes | 5+ | 20–30 | 50+ |

## Development ordering rule

From 0.5.500 forward:

1. finish the original-world naming/stable-ID migration;
2. establish resource provenance, ecology/spawn, transport, and content-pack validation substrates;
3. only then begin high-volume canonical content generation/import normalization;
4. grow mechanics and content together so each system is tested against realistic data breadth.

Do not expand hundreds of records under legacy FFXI names and plan to rename them later.

## Content originality test

Before a new content pack is accepted, ask:

1. Is the identity understandable without knowledge of another game?
2. Do names and institutions fit this region's own culture/history?
3. Does the content connect to the material economy and world simulation?
4. Are rewards physically, economically, or socially explainable?
5. Does the region offer more than a reskinned version of another starter region?
6. Are monsters, flora, routes, shops, NPCs, quests, and recipes cross-linked rather than isolated lists?
7. Can the content be validated automatically and migrated through stable IDs?

If the answer to several of these is no, the content is not ready to become canonical.
