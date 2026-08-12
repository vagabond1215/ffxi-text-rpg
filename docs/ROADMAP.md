# Roadmap

This is the authoritative implementation summary and phase index for the original text-first persistent fantasy life RPG currently using the working title **Hearth & Horizon**.

Authoritative companion documents:

- `docs/DEVELOPMENT_DIRECTION.md` — design north star.
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-setting, naming, content-provenance, scale, and import rules.
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — detailed version protocol and release gates.
- `docs/TRANSITIONAL_ARCHITECTURE.md` — temporary seams that must not harden into final design.
- `docs/ARCHITECTURE.md` — current runtime/module boundaries.

## Current baseline

```text
Product:      0.5.500.0
Package:      0.5.500
Account Save: 4
Game State:   4
Data:         13
Codename:     Day Boundary Review
```

This remains pre-alpha product development. A milestone number identifies the active development contract; it is not a completion percentage.

## Product direction

Core progression law:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

The intended game is one connected simulation of life, work, exploration, relationships, logistics, preparation, danger, combat, and long-term ambition.

Key rules:

- fictional simulation time and real-world waiting are separate concepts;
- the player controls one continuous person rather than switching magical class identities;
- disciplines describe training traditions, capabilities enable actions, and loadouts/preparation constrain effective use;
- settlements are social/economic/logistical places rather than isolated menus;
- a home base may matter greatly, but the world is not confined to one city;
- roads, wilderness, smaller settlements, caravans, ferries, mounts, and other transport connect a larger sandbox;
- player-facing hard zone transitions are minimized; internal world partitions exist for simulation, navigation, maps, and data management;
- maps represent acquired geographic knowledge and can be incomplete;
- creatures, flora, minerals, shops, recipes, quests, NPCs, and transport exist as interconnected data rather than one-off encounter text;
- animal/construct/environmental rewards have physical provenance through searching, skinning, butchering, gathering, mining, salvage, fishing, processing, or other appropriate work;
- high-volume content production is a first-class engineering concern and grows continuously with mechanics;
- legacy FFXI-derived material is reference/research only and must not define canonical names or new content databases.

## Phase summary

| Phase | Theme | Exit promise |
| --- | --- | --- |
| `0.4` | Foundation and direction lock | Architecture can evolve without another broad reset. |
| `0.5` | Simulation + original-world/content substrate | Time, interrupts, day review, canonical naming, provenance, ecology, transport, projects, and scalable content validation exist. |
| `0.6` | Integrated character/mechanics content | Stats, skills, disciplines, magic, combat, items, gathering/crafting, ecology, and AI party play form a substantial connected mechanics layer. |
| `0.7` | Multi-region playable alpha | Multiple cities/regions, transport, NPC populations, quests, relationships, regional economies, and substantial authored content support a real sandbox campaign. |
| `0.8` | Life and infrastructure expansion | Property, farming, construction, taming/husbandry, logistics, relationships, production chains, and labor-saving infrastructure deepen long-form play. |
| `0.9` | Adventure depth and release hardening | Advanced combat/magic/content/balance/UI/persistence reach release-candidate quality at meaningful scale. |
| `1.0` | Live foundation | The central persistent-life/adventure promise is coherent, stable, migratable, and content-complete enough for release. |

---

# 0.4 — Foundation — complete

- [x] `0.4.100` Development direction and version protocol.
- [x] `0.4.200` Four-part product version and package-version separation.
- [x] `0.4.300` Ordered persistence migrations.
- [x] `0.4.400` Structured `ActionResult` contract.
- [x] `0.4.500` Bounded semantic-event foundation.
- [x] `0.4.600` Foundation stabilization and transitional architecture rules.
- [x] `0.4.900` Foundation exit certification.

---

# 0.5 — Simulation and Content Substrate — active

## 0.5.100 — Deterministic world clock — complete

- [x] Canonical simulated seconds in Game State v4.
- [x] Deterministic advancement independent of wall-clock reads.
- [x] Derived day/hour/minute/second formatting.
- [x] Persistence migration and deterministic rollover tests.

## 0.5.200 — Pause and speed control — complete

- [x] Pause/resume semantics.
- [x] Whole-number speed multipliers up to the engine limit.
- [x] Scheduler-to-simulation conversion with sub-second remainder.
- [x] Paused wall time is discarded rather than banked.

## 0.5.300 — Canonical timed tasks — complete

- [x] Versioned task registry and stable IDs.
- [x] Start/progress/complete/cancel semantics.
- [x] Canonical world-time deadlines and deterministic reconciliation.
- [x] Multiple task channels without prematurely hard-coded concurrency policy.

## 0.5.400 — Simulation interrupt model — complete

- [x] Advance-until-event semantics.
- [x] Deterministic time/priority/tie ordering.
- [x] Built-in task-completion interrupts.
- [x] Generic providers for combat, exhaustion, tool failure, projects, day boundaries, and later systems.
- [x] Accelerated scheduler advancement stops cleanly at meaningful interrupts.

## 0.5.500 — Day boundary and end-of-day review — complete

- [x] Deterministic midnight boundary provider.
- [x] Structured day summaries built from semantic events.
- [x] Configurable end-of-day auto-pause, enabled by default.
- [x] Higher-priority same-time interrupts remain visible while completed days still finalize.
- [x] Older Game State v4 records acquire day/simulation bookkeeping lazily.

## 0.5.550 — Original-world identity and canonical nomenclature — next

This track must finish **before high-volume canonical content databases are expanded**.

- [ ] Replace inherited world, nation, region, place, map, ancestry, discipline, currency, transport, storage, companion, creature, NPC, shop, and institutional terminology in canonical runtime data.
- [ ] Migrate stable IDs rather than changing only display strings.
- [ ] Add bounded legacy-to-canonical aliases at migration/input boundaries.
- [ ] Add ordered save migration for persisted renamed identifiers where needed.
- [ ] Quarantine historical FFXI-derived modules as legacy/reference sources rather than canonical gameplay data.
- [ ] Update player-facing copy, tests, examples, and package/project language.
- [ ] Establish the first original regional naming/cultural patterns described in `WORLD_IDENTITY_AND_CONTENT_POLICY.md`.

### 0.5.550 exit gate

No newly authored canonical gameplay record should require an FFXI proper noun or stable identifier. Existing legacy references may remain only behind documented compatibility/research boundaries.

## 0.5.600 — Resource provenance and persistent projects

- [ ] Persistent projects with material, labor, time, progress, and completion events.
- [ ] World-resource provenance schema: carried goods, carcass/body outputs, plants, minerals, fishing, salvage, crafting, trade, contracts, and exceptional magical sources.
- [ ] Body/resource opportunities created by combat rather than automatic finished-item confetti.
- [ ] Search/skin/butcher/pluck/extract/salvage action substrate with tools, time, condition, and proficiency hooks.
- [ ] Item source/sink metadata foundation.

## 0.5.650 — Ecology, gathering, and spawn substrate

- [ ] Species/family definitions separated from individual encounter instances.
- [ ] Habitat, time, weather/season hooks where useful, population density, aggression, senses, linking/social behavior, and rarity.
- [ ] Flora/mineral/fishing/gathering-source definitions with location and yield rules.
- [ ] Respawn/regeneration model compatible with deterministic simulation.
- [ ] Rare/named spawn hooks without magical arbitrary appearance rules.

## 0.5.700 — Travel and scheduled transport substrate

- [ ] Walking/local travel consumes canonical simulation time.
- [ ] Route/road records independent of artificial player-facing zone screens.
- [ ] Scheduled caravan service with stops, fare, cargo allowance, travel time, and interruption hooks.
- [ ] Generic transport contract suitable for ferries, hired wagons, mounts, and later air travel.
- [ ] Map/route knowledge and discovery hooks.
- [ ] At least one non-travel work activity integrated with canonical time.

## 0.5.800 — Content-pack schema, import normalization, and validation

- [ ] Regional content-pack contract for places, routes, NPCs, shops, ecology, resources, items, recipes, quests, relationships, and transport.
- [ ] Legacy-data ingestion tools produce candidate normalized records, never direct canonical imports.
- [ ] Cross-reference validation for IDs, sources/sinks, spawns, recipes, shops, quests/rewards, routes, maps, and companions.
- [ ] Explicit originality/provenance metadata where imported research materially informs a canonical record.
- [ ] Data-generation workflow designed for hundreds/thousands of records rather than giant manually edited monoliths.

## 0.5.900 — Simulation/content-substrate exit gate

0.5 closes when:

- long fictional activities advance safely with deterministic interrupts and day review;
- the original-world naming/stable-ID migration is complete;
- persistent projects and resource provenance exist;
- ecology/gathering/spawn definitions can populate the world;
- scheduled transport can connect multiple settlements/regions;
- regional content packs and validators can safely support large-scale data production;
- no new content pipeline depends on inherited FFXI naming.

---

# 0.6 — Integrated Character and Mechanics Content

## 0.6.100 — Character stat and progression model

- [ ] Complete primary/resource/derived stat contracts.
- [ ] Character-owned progression independent of temporary loadout classification.
- [ ] EXP/advancement or replacement progression law integrated with origins, training, work, and combat.
- [ ] Confidence-labeled balance formulas with deterministic tests.

## 0.6.200 — Skills, proficiency, disciplines, and capabilities

- [ ] Full canonical skill/proficiency registry across martial, magical, gathering, crafting, social, and practical domains.
- [ ] Original discipline registry and training paths.
- [ ] Learned capabilities stored on the character.
- [ ] Hard, soft, and enhancing preparation/equipment prerequisites.
- [ ] Cross-discipline capability use where real requirements are met.

## 0.6.300 — Magic and active ability engine

- [ ] Canonical spell/technique records with cost, cast/use time, recast, target rules, tags, effects, and training/unlock provenance.
- [ ] Casting/channel/interruption/recast engine.
- [ ] First substantial original spell/technique catalog rather than placeholder Cure/generic damage logic.

## 0.6.400 — Combat 2.0

- [ ] Tactical enemy AI and family abilities.
- [ ] Status effects, resistance/mitigation, threat/attention, positioning/range where meaningful in text.
- [ ] Weapon techniques and party interactions.
- [ ] KO/injury/recovery and battle cleanup.
- [ ] Combat consumes simulation time and interacts with interrupts/ecology.

## 0.6.500 — Canonical item, equipment, tool, and direct-use expansion

- [ ] Hundreds-scale item catalog using source/sink validation.
- [ ] Equipment tiers and meaningful tradeoffs.
- [ ] Consumables, tools, containers, maps, reagents, ammunition, food, medicine, keys/permissions, and quest objects.
- [ ] Wear/maintenance/repair hooks where they create useful economic decisions.

## 0.6.600 — Gathering, hunting, processing, crafting, cooking, and salvage

- [ ] Mining, logging, harvesting/foraging, fishing/trapping, and hunting loops.
- [ ] Carcass processing and quality/yield decisions.
- [ ] Recipe/process engine with stations, tools, time, proficiency, quality, and byproducts.
- [ ] Cooking, medicine/alchemy, smithing, woodworking, leatherwork, textiles, and other useful production branches.
- [ ] Regional materials circulate through multiple production chains.

## 0.6.700 — Ecology and regional creature/resource content

- [ ] At least 40–60 meaningful creature/fauna definitions.
- [ ] At least 40 environmental resource/flora definitions.
- [ ] Multiple families, variants, behaviors, rare encounters, and habitat differences.
- [ ] Ecology connects to gathering, recipes, quests, economy, and travel danger.

## 0.6.800 — AI party and companion foundation

- [ ] Persistent recruitable companion entities.
- [ ] Role/tactics preferences, equipment, progression, resource use, KO/recovery, and party targeting.
- [ ] Relationship/affinity hooks separated from tactical AI.
- [ ] At least 4–6 distinct companions proving multiple combat/support personalities.

## 0.6.900 — Mechanics integration exit gate

0.6 closes when one continuous character can train across original disciplines, acquire and use a substantial catalog of skills/magic/items, gather and transform natural resources, fight tactically with or without companions, improve through multiple activities, and participate in a functioning material economy.

---

# 0.7 — Multi-Region Playable Alpha

## 0.7.100 — Multi-region sandbox graph

- [ ] Multiple major cities/hubs plus smaller settlements and wilderness connectors.
- [ ] At least 30–50 meaningful places/localities by alpha exit.
- [ ] Internal partitions serve simulation/navigation without gamey mandatory player-facing zone loading.
- [ ] Exploration, landmark, and cartography progression.

## 0.7.200 — Caravans, ferries, mounts, and regional logistics

- [ ] Scheduled transport network connecting major routes.
- [ ] Freight/cargo, fares, route safety, delays/interrupts, and reputation/service variation.
- [ ] Travel encounters and escort opportunities.
- [ ] Mount/pack-animal or equivalent mobility layer where appropriate.

## 0.7.300 — NPC populations, shops, guilds, and regional economies

- [ ] Hundreds-scale named NPC population target by alpha exit.
- [ ] NPC schedules/availability and contextual dialogue.
- [ ] Regional shops/services with buy/sell/service behavior and meaningful stock.
- [ ] Production/trade differences among regions create reasons to travel.

## 0.7.400 — Quest, contract, mission, reward, and reputation engine

- [ ] Journal/objective state driven by semantic events rather than log parsing.
- [ ] Talk/search/gather/process/craft/travel/explore/combat/escort/deliver/project/social objective types.
- [ ] Branching/prerequisite/repeatability/failure/reputation hooks where needed.
- [ ] Rewards use real items, services, training, relationships, property, reputation, currency, or world changes.
- [ ] 150–250 quests/contracts is the alpha-scale planning range, not a launch-day mandate for one track.

## 0.7.500 — Relationships and romance

- [ ] Persistent relationship state, affinity/trust/respect dimensions where useful, memory of meaningful events, and schedule/location integration.
- [ ] Friendship, rivalry, mentorship, family/community, and romance are not reduced to one universal affection bar.
- [ ] Romance candidates have independent goals, boundaries, preferences, and lives outside the player.
- [ ] At least 8–12 deep romance-capable NPCs is the alpha-scale planning range.

## 0.7.600 — Regional ecology and world-content packs

- [ ] Distinct flora, fauna, monster families, gatherables, weather/terrain hooks, landmarks, dungeons, settlements, and local conflicts.
- [ ] Regional packs do not copy the same template with renamed nouns.

## 0.7.700 — Item, recipe, spell, technique, and economy content packs

- [ ] Alpha-scale hundreds/thousand item target approached through validated generation/import workflows.
- [ ] Regional ingredients and production chains create cross-region demand.
- [ ] Skills/magic/gear progression supports multiple viable preparations and livelihoods.

## 0.7.800 — First complete multi-city campaign layer

The earlier **A Week Beyond the West Gate** concept becomes one polished introductory arc rather than the definition of the whole game.

A new player should be able to:

- begin from an origin with a concrete foothold;
- explore a real settlement and surrounding routes;
- acquire maps and route knowledge;
- gather/hunt/fight and recover resources naturally;
- process, craft, cook, sell, buy, and equip useful goods;
- meet/recruit companions and build relationships;
- take quests/contracts that interact with the same world systems;
- travel to other settlements by road or scheduled transport;
- return to or improve a home base without being trapped there;
- end a substantial opening period with persistent skills, property/resources, relationships, reputation, and expanded geographic reach.

## 0.7.900 — Playable-alpha exit gate

0.7 closes when the above experience is coherent enough to play as a sandbox campaign rather than a systems demonstration.

---

# 0.8 — Life and Infrastructure Expansion

Planned focus:

- property acquisition, renovation, construction, workshops, storage, roads, carts, warehouses, irrigation, and other useful infrastructure;
- farming, orchards, gardens, animal husbandry/taming, breeding where appropriate, and seasonal production;
- hired labor and automation earned through mastery/investment rather than arbitrary idle timers;
- deeper crafting facilities and regional production chains;
- social institutions, households, civic reputation, faction consequences, and relationship depth;
- logistics that allow earlier chores to consume less player attention as capability grows;
- larger persistent projects and civic/regional ambitions.

---

# 0.9 — Adventure Depth and Release Hardening

Planned focus:

- advanced enemy/ecology behavior, bosses/rare threats, dungeons, expedition systems, and dangerous-region traversal;
- advanced magic, techniques, companion tactics, status interactions, equipment build depth, and balance;
- late-game professions, regional projects, reputation/faction arcs, and relationship conclusions/continuations;
- content breadth approaching 1.0 scale targets;
- economy/resource-source/sink balancing over long simulations;
- UI/accessibility/readability and discoverability hardening;
- save migration/compatibility hardening;
- deterministic validation/performance at thousands-of-record scale;
- content-complete beta and release-candidate freeze.

---

# 1.0 — Live Foundation

1.0 is a compatibility and product promise, not an assertion that no future content can be added.

A 1.0 player should be able to build one persistent life across a connected original fantasy world: establish and improve a foothold, travel among multiple regions/cities, learn across disciplines, prepare equipment and supplies for different goals, pursue livelihoods and crafting chains, gather/hunt/fight and recover resources naturally, form meaningful relationships and parties, undertake substantial quests/contracts, build useful infrastructure, participate in regional economies, and save/load under an explicit migration contract.

## Formula policy

Formula confidence categories remain:

- exact/sourced where the project owns or can justify an exact rule;
- researched approximation;
- intentional simplification;
- placeholder.

Historical game formulas may inform research, but canonical balance is chosen for this game's own simulation and player experience.

## Immediate next pass

```text
0.5.550 — Original-world identity and canonical nomenclature
```

Do not start high-volume item/monster/quest/recipe generation before that migration is complete.
