# Versioning and Release Roadmap

This document defines the product-version protocol and the milestone gates from the current pre-alpha foundation to 1.0.

The roadmap is milestone-driven rather than calendar-driven. A version changes because its exit criteria are met, not because a date arrived or because a large number of commits accumulated.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md` — product/design north star.
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-setting, naming, provenance, content scale, and import policy.
- `docs/ROADMAP.md` — concise implementation status and phase index.

## Current baseline

```text
Product:      0.5.500.0
Package:      0.5.500
Account Save: 4
Game State:   4
Data:         13
Codename:     Day Boundary Review
```

The repository is pre-alpha. It has a useful deterministic simulation foundation and several gameplay scaffolds, but content breadth and many integrated mechanics remain far below the intended game.

## Product version format

Use:

```text
MAJOR.PHASE.TRACK.REVISION
```

Example:

```text
0.5.550.3
```

| Segment | Meaning |
| --- | --- |
| `MAJOR` | Stability/compatibility generation. `0` is pre-1.0; `1` begins the live compatibility contract. |
| `PHASE` | Major development milestone, such as `0.5`, `0.6`, or `0.7`. |
| `TRACK` | Three-digit scoped milestone within the phase. Planned tracks normally use `100`, `200`, etc.; inserted tracks such as `550` are allowed. |
| `REVISION` | Runtime-affecting integration counter inside the active track. |

The track numbering is a stable planning label, not an estimate of percentage complete or amount of work.

## Product version versus package version

The four-part product version is authoritative for game-development milestones.

`package.json.version` remains valid three-part SemVer and normally mirrors `MAJOR.PHASE.TRACK` while omitting the product revision.

Example:

```text
Product: 0.5.550.4
Package: 0.5.550
```

Do not put a four-part numeric product version directly into `package.json.version`.

## Independent schema/system versions

Do not collapse these into the product version:

- Account Save;
- Game State;
- Data;
- Benchmark;
- individual system versions.

The product version answers **what development milestone does this build represent?**

Persistence versions answer **can saved data be read, migrated, or rejected safely?**

The Data version answers **has the canonical data contract changed in a way consumers/migrations must distinguish?**

System versions answer **what revision of one subsystem contract is present?**

## Runtime version-bump protocol

Every runtime PR should declare:

1. target product phase/track;
2. previous and resulting product version or whether the PR does not yet complete the track;
3. affected system versions;
4. Game State / Account Save / Data version impact;
5. migration/reset implications;
6. tests and benchmark status;
7. known limitations and intentionally deferred work.

A runtime change inside an active track normally increments the fourth segment. Completing a track advances the three-digit track and resets revision to zero only when the prior gate is actually satisfied.

Docs-only planning changes normally do **not** bump product version.

A product-version bump never substitutes for a persistence migration. If stable IDs or persisted schema change, bump and migrate the relevant persistence version explicitly.

---

# Historical milestone record

## 0.4 — Foundation closeout — complete

### 0.4.100 Direction and version protocol

- development north star;
- version protocol;
- explicit move away from formula-reconstruction as roadmap spine.

### 0.4.200 Version manifest separation

- four-part product version;
- package/product version separation;
- CI version tests.

### 0.4.300 Ordered persistence migrations

- ordered Game State migration engine;
- deterministic handling of unsupported/future state.

### 0.4.400 Structured action contract

- `ActionResult`-style semantic outcome contract;
- display prose separated from engine meaning.

### 0.4.500 Semantic event foundation

- stable event IDs/types;
- bounded structured event history;
- consumers do not need to parse log prose.

### 0.4.600 / 0.4.900 stabilization and exit

- existing travel/inventory/combat foundations preserved;
- architecture certified ready for deterministic world time.

---

# 0.5 — Simulation and Content Substrate — active

## Purpose

Finish the deterministic long-duration simulation foundation **and** establish the original-world/content infrastructure required before thousands of gameplay records are authored.

The phase was re-baselined after 0.5.500 because the earlier plan materially underestimated the data scale required for a sandbox life/adventure RPG.

## 0.5.100 — Deterministic world clock — complete

Deliverables met:

- canonical simulation seconds;
- exact deterministic advancement;
- persistence migration;
- day/hour/minute derivation;
- no dependency on `Date.now()` for simulation truth.

## 0.5.200 — Pause and speed control — complete

Deliverables met:

- pause/resume;
- configurable deterministic speed multiplier;
- wall-clock scheduler adapter;
- sub-second remainder;
- no catch-up burst after pause.

## 0.5.300 — Canonical timed tasks — complete

Deliverables met:

- versioned task registry;
- stable task IDs;
- canonical start/completion boundaries;
- deterministic progress, completion, cancellation, and reconciliation.

## 0.5.400 — Interrupt model — complete

Deliverables met:

- advance-until-event;
- deterministic interrupt ordering;
- task-completion source;
- generic provider seam for combat, exhaustion, project completion, tool failure, day boundaries, and later systems;
- interrupt-aware accelerated scheduler.

## 0.5.500 — Day boundary and end-of-day review — complete

Deliverables met:

- deterministic midnight boundaries;
- structured daily summaries;
- end-of-day auto-pause preference;
- day start/end semantic events;
- priority-safe simultaneous interrupts;
- lazy compatibility for older Game State v4 records.

## 0.5.550 — Original-world identity and stable-ID migration — next

### Purpose

Remove inherited FFXI world identity before large content generation multiplies migration cost.

### Deliverables

- canonical original world/power/region/place/map identifiers and display names;
- canonical ancestry terminology;
- canonical discipline terminology for the transitional job scaffold;
- canonical currency, storage, travel, companion, faction, and other player-facing system vocabulary where inherited terminology exists;
- current creature, NPC, shop, POI, and landmark names originalised;
- bounded legacy-to-canonical alias/migration table;
- ordered persistence migration for renamed identifiers carried by saves;
- tests proving old saves resolve to canonical IDs and new saves do not emit legacy IDs;
- legacy FFXI-derived files clearly quarantined as research/reference data;
- package/readme/player-facing copy no longer presents the project as an FFXI world implementation.

### Persistence expectation

Stable place/nation/ancestry/discipline identifiers are already persisted. This track is expected to require a Game State schema migration unless implementation proves all persisted references can be safely migrated at an already-versioned boundary. Prefer an explicit Game State version bump over indefinite dual schemas.

### Exit gate

New canonical content can be authored without FFXI proper nouns or stable IDs. Compatibility aliases are isolated to migration/input boundaries.

## 0.5.600 — Resource provenance and persistent projects

### Deliverables

- persistent project model with materials, labor, canonical time, progress, and completion events;
- acquisition-source schema for carried goods, body processing, flora, minerals, fishing, salvage, crafting, commerce, contracts, and exceptional magic;
- post-combat bodies/resource opportunities rather than automatic finished-item drops for creatures where that fiction does not make sense;
- search/skin/butcher/pluck/extract/salvage action foundation;
- item source/sink metadata and validation hooks.

## 0.5.650 — Ecology, gathering, and spawn substrate

### Deliverables

- species/family records separate from encounter instances;
- habitat, population density, rarity, aggression, senses, social/link behavior, and environmental hooks;
- flora/mineral/fishing/gathering-source definitions;
- deterministic regeneration/respawn rules;
- rare/named spawn foundation;
- environment/resource outputs reference canonical items rather than free-form strings.

## 0.5.700 — Canonical travel and scheduled transport

### Deliverables

- walking/local travel consumes canonical simulation time;
- route/road representation independent of artificial player-facing zone screens;
- scheduled caravan implementation with stops, fares, cargo, travel time, and interrupt hooks;
- shared transport contract suitable for ferries, wagons, mounts, and later air transport;
- map/route-knowledge discovery hooks;
- at least one non-travel work activity uses the same time system.

## 0.5.800 — Regional content packs, import normalization, and validation

### Deliverables

- content-pack schema for places/routes/maps/NPCs/shops/ecology/resources/items/recipes/quests/relationships/transport;
- cross-reference validation across those record families;
- tools that transform legacy/reference data into reviewable candidate records rather than direct canonical imports;
- validation of item sources/sinks, recipe references, reachable quest objectives, transport topology, maps, and companion/NPC references;
- data workflow tested at realistic hundreds-of-record scale.

## 0.5.900 — Phase exit gate

0.5 closes when:

- multi-hour/day simulation can safely fast-forward, interrupt, and summarize;
- original-world canonical naming and stable IDs are established;
- provenance/projects/ecology/gathering/transport substrate exists;
- content packs and validators can support high-volume original content generation;
- the engine has demonstrated that broad data can be added without giant monolithic files or another naming reset.

---

# 0.6 — Integrated Character and Mechanics Content

## Purpose

Turn the substrate into a substantial playable mechanics layer. Mechanics and content are developed together; no subsystem is considered validated from a toy catalog alone.

## 0.6.100 Character stats and progression

- complete primary/resource/derived stat contracts;
- character-owned advancement;
- balance/progression rules used by work, training, exploration, and combat;
- confidence-labeled formulas and deterministic tests.

## 0.6.200 Skills, proficiencies, disciplines, capabilities

- full canonical skill registry;
- original discipline/training traditions;
- learned capabilities independent of current equipment;
- hard/soft/enhancing requirements;
- cross-discipline access based on actual prerequisites.

## 0.6.300 Magic and active ability engine

- canonical spell/technique schema;
- cost, cast/use time, recast, target, effect, unlock/training provenance;
- casting/interruption/recast behavior;
- substantial original spell/ability catalog.

## 0.6.400 Combat 2.0

- tactical enemy AI;
- family abilities;
- statuses and resistance/mitigation;
- attention/threat;
- weapon techniques and party interactions;
- KO/injury/recovery;
- simulation-time integration.

## 0.6.500 Items, equipment, tools, maps, consumables

- hundreds-scale validated canonical item catalog;
- equipment and direct-use behavior;
- tools, containers, maps, reagents, ammunition, food, medicine, permissions, and quest objects;
- repair/maintenance where economically useful.

## 0.6.600 Gathering, hunting, processing, crafting, cooking, salvage

- complete loops for major gathering modes;
- body processing and yield/quality decisions;
- recipe/process engine with tools/stations/time/proficiency/quality/byproducts;
- multiple craft and cooking/medicine branches;
- regional material chains.

## 0.6.700 Ecology/content integration

Planning-scale target for phase exit:

- 40–60 meaningful creature/fauna definitions;
- 40+ environmental resource/flora definitions;
- multiple families, variants, habitats, rare encounters, and economic/quest uses.

## 0.6.800 AI party/companion foundation

- recruitable persistent companions;
- tactical role/preferences/equipment/progression;
- resource use and KO/recovery;
- relationship hooks separate from combat AI;
- at least 4–6 distinct companions proving different behavior profiles.

## 0.6.900 Phase exit gate

One continuous character can train across disciplines, use substantial skill/magic/item catalogs, gather and transform world resources, fight tactically with or without companions, and improve through multiple interconnected activities.

---

# 0.7 — Multi-Region Playable Alpha

## Purpose

Deliver an actual sandbox campaign rather than a vertical systems demonstration.

## 0.7.100 Multi-region world graph and exploration

- multiple major cities/hubs and smaller settlements;
- 30–50 meaningful places/localities by phase exit;
- roads/wilderness/landmarks/maps/discovery;
- internal partitions are not mandatory gamey player-facing zone screens.

## 0.7.200 Regional transport and logistics

- caravans, ferries, hired transport, mounts/pack animals where appropriate;
- schedules, stops, cargo, fares, risk, delays, escorts, and route reputation;
- approximately 20–30 scheduled routes is the alpha-scale planning range.

## 0.7.300 NPC populations and regional economies

- approximately 250–400 named NPCs by phase exit;
- schedules/locations/services/dialogue;
- 60–100 functional shops/services;
- regional supply/demand and production differences create reasons to travel.

## 0.7.400 Quest/contract/reward/reputation engine and content

- semantic objective state;
- broad objective vocabulary across social, exploration, gathering, work, crafting, transport, combat, delivery, escort, and projects;
- real canonical rewards and world changes;
- approximately 150–250 quests/contracts is the alpha-scale planning range.

## 0.7.500 Relationships and romance

- persistent multidimensional relationship state where useful;
- friendship/rivalry/mentorship/community/romance;
- candidates have schedules, goals, boundaries, and lives outside the player;
- approximately 8–12 deep romance-capable NPCs is the alpha-scale planning range.

## 0.7.600 Regional ecology/content packs

- distinct biomes, resources, creature families, landmarks, settlements, dungeons, and local conflicts;
- avoid copy-pasted region templates.

## 0.7.700 Item/recipe/spell/technique/economy breadth

Alpha-scale planning ranges:

- 800–1,500 canonical items;
- 300–500 recipes/processes;
- 250–400 spells/abilities/techniques;
- 120–180 creature/fauna definitions;
- 100–150 flora/resource definitions.

These are scale targets across the phase, not requirements for one PR.

## 0.7.800 Complete multi-city opening campaign layer

A new player can establish a foothold, explore and acquire maps/route knowledge, gather/hunt/fight, recover resources naturally, process/craft/cook/trade, recruit companions, form relationships, undertake systemic quests, use scheduled transport, reach other cities, and return/improve their home base.

The earlier **A Week Beyond the West Gate** concept may survive as one polished introductory arc, but is not the boundary of the game.

## 0.7.900 Playable-alpha exit gate

The project is coherent enough to play as a substantial multi-region sandbox campaign rather than a framework demonstration.

---

# 0.8 — Life and Infrastructure Expansion

Primary tracks will deepen:

- property/home/land acquisition and renovation;
- construction and persistent large projects;
- farming/gardening/orchards;
- husbandry/taming and practical animal systems;
- workshops and specialist facilities;
- logistics, carts, warehouses, roads, irrigation, hired labor, and earned automation;
- relationships, households, civic institutions, and reputation;
- production chains, maintenance, transport capacity, and regional ambition.

The core progression law remains:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

Earlier chores should become easier to manage because the character has earned tools, knowledge, infrastructure, labor, and relationships—not because identical tasks receive arbitrary exponential costs.

---

# 0.9 — Adventure Depth and Release Hardening

Primary tracks will deepen:

- advanced combat and party tactics;
- high-level magic/techniques;
- bosses, rare threats, dungeons, expeditions, and dangerous-region traversal;
- high-tier equipment/crafting and professions;
- regional/faction/relationship arcs;
- long-simulation economy and resource-source/sink balance;
- UI/accessibility/readability/discoverability;
- save migration compatibility;
- validation/performance at thousands-of-record scale;
- content-complete beta and release-candidate freeze.

---

# 1.0 — Live Foundation

1.0 begins the explicit compatibility/product promise.

The release must support one persistent character living across a connected original fantasy world with meaningful home/infrastructure, multiple cities/regions, livelihoods, preparation, exploration, natural resource acquisition, crafting/production, combat, companions, relationships, quests/contracts, regional economy, transport, and stable save migrations.

Content can continue after 1.0, but 1.0 cannot depend on the promise that missing core breadth will be filled in later.

## Formula policy

Formula confidence labels remain:

- exact/sourced;
- researched approximation;
- intentional simplification;
- placeholder.

Research from other games may inform design choices but does not define canonical balance or naming. Refine formulas when doing so materially improves a real player-facing loop at representative data scale.
