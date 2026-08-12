# Versioning and Release Roadmap

This document defines the product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md` — product/design north star.
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-setting, naming, provenance, content scale, and import policy.
- `docs/ROADMAP.md` — implementation status and phase index.
- `docs/THREAD_HANDOFF.md` — current implementation continuation state.

## Current baseline

```text
Product:      0.5.650.1
Package:      0.5.650
Account Save: 4
Game State:   5
Data:         17
Benchmark:    1
Codename:     Ecology Substrate
```

The repository is pre-alpha. Deterministic simulation, original-world identity, persistent projects, provenance-aware physical resource recovery, and the first ecology/population/environmental gathering substrate are established; content breadth and many integrated mechanics remain far below the intended game.

## Product version format

Use:

```text
MAJOR.PHASE.TRACK.REVISION
```

Example:

```text
0.5.650.1
```

| Segment | Meaning |
| --- | --- |
| `MAJOR` | Stability/compatibility generation. `0` is pre-1.0; `1` begins the live compatibility contract. |
| `PHASE` | Major development milestone such as `0.5`, `0.6`, or `0.7`. |
| `TRACK` | Three-digit scoped milestone within the phase. Inserted tracks such as `550` are allowed. |
| `REVISION` | Runtime-affecting integration counter inside the active track. |

Track numbers are stable planning labels, not completion percentages.

## Product version versus package version

The four-part product version is authoritative for game-development milestones. `package.json.version` remains valid three-part SemVer and normally mirrors `MAJOR.PHASE.TRACK` while omitting the product revision.

Do not put a four-part numeric product version directly into `package.json.version`.

## Independent schema/system versions

Do not collapse these into the product version:

- Account Save;
- Game State;
- Data;
- Benchmark;
- individual subsystem versions.

The product version answers **what development milestone does this build represent?** Persistence versions answer **can saved data be read, migrated, or rejected safely?** Data version distinguishes canonical data-contract revisions. System versions distinguish subsystem contracts.

`js/text/version.js` is authoritative for the active values.

## Runtime version-bump protocol

For a runtime integration, record:

1. target phase/track;
2. previous/resulting product version;
3. affected subsystem versions;
4. Game State / Account Save / Data impact;
5. migration/reset implications;
6. test/benchmark/build status;
7. known limitations and intentionally deferred work.

A runtime change inside an active track normally increments the fourth segment. Completing a track does not automatically advance to the next track until its exit gate is satisfied and documentation/handoff are synchronized.

Docs-only planning changes normally do not bump product version. A product-version bump never substitutes for a persistence migration.

## Compatibility policy

Prefer bounded adapters and ordered migrations over permanent dual schemas.

Current intentional compatibility examples include historical localStorage keys, legacy POI hook IDs, explicit legacy/reference modules, transitional encounter `spawnRules`, and `gil` pending deliberate original currency design.

---

# Historical milestone record

## 0.4 — Foundation — complete

Delivered development direction/versioning, ordered Game State migrations, structured action outcomes, bounded semantic events, and architecture stabilization.

## 0.5.100 — Deterministic world clock — complete

Delivered canonical simulation seconds, deterministic advancement, persistence migration, time derivation, and independence from wall-clock truth.

## 0.5.200 — Pause and speed control — complete

Delivered pause/resume, deterministic speed multipliers, scheduler adaptation, sub-second remainder, and no paused-time catch-up burst.

## 0.5.300 — Canonical timed tasks — complete

Delivered versioned tasks, stable task IDs, canonical deadlines, deterministic progress/completion/cancellation, and reconciliation.

## 0.5.400 — Simulation interrupt model — complete

Delivered advance-until-event semantics, deterministic interrupt ordering, task-completion interrupts, generic providers, and interrupt-aware acceleration.

## 0.5.500 — Day boundary and end-of-day review — complete

Delivered deterministic midnight boundaries, structured daily summaries, configurable end-of-day pause, day start/end events, and priority-safe simultaneous interrupts.

## 0.5.550 — Original-world identity and stable-ID migration — complete

Delivered original powers, regions, places, maps, ancestries, transitional disciplines, Game State v4 -> v5 migration, bounded identity adapters, canonical world-facing vocabulary, and explicit quarantine of historical research/reference data.

## 0.5.600 — Resource provenance and persistent projects — complete

Resulting baseline was `0.5.600.1 / Package 0.5.600 / Game State 5 / Data 16`. It delivered persistent projects, provenance/source/sink contracts, post-combat body/carried-goods/salvage opportunities, deterministic timed recovery, and provenance-tagged physical materials.

## 0.5.650 — Ecology, gathering, and spawn substrate — complete

Resulting baseline:

```text
Product:      0.5.650.1
Package:      0.5.650
Account Save: 4
Game State:   5
Data:         17
Benchmark:    1
Codename:     Ecology Substrate
```

### Version impact

- **Product:** `0.5.600.1` -> `0.5.650.1`.
- **Package:** `0.5.600` -> `0.5.650`.
- **Account Save:** unchanged at 4.
- **Game State:** unchanged at 5 because ecology runtime state is additive and can lazily initialize when absent.
- **Data:** 16 -> 17 for the new canonical family/species/population/gathering-source/resource-item data contract.
- **Enemy entity:** `0.2.0` -> `0.2.1` to carry a canonical `speciesId` encounter link.
- New systems: `ecologyCatalog 0.1.0`, `ecologyState 0.1.0`, `populations 0.1.0`, `gatheringSources 0.1.0`, `resourceItems 0.1.0`.

### Delivered

- canonical creature-family records and species records separated from encounter instances;
- representative population records spanning forest, upland, mine/cave, wetland, raider, beast, plantoid, and rare-population cases;
- habitat, density, rarity, aggression, senses, social/link metadata, capacity, and respawn contracts;
- seed encounter templates linked to canonical species through `speciesId`;
- representative flora/mineral/fishing source records with tool/proficiency/action/output contracts;
- canonical raw-resource items with matching source/place/action provenance and intentional sinks;
- persistent depletion/availability records whose regeneration/respawn derives from `worldTime.totalSeconds`;
- atomic harvesting through the normal inventory engine;
- deterministic day/time appearance conditions and explicit flag-based named hooks instead of arbitrary appearance rolls;
- standalone ecology cross-reference validation covering species/families, populations/places, sources/actions/items, and output provenance;
- regression tests covering multiple families, habitats, source types, depletion/regeneration, rare conditions, named hooks, inventory behavior, and invalid runtime references.

### Intentionally deferred

- replacing the existing `places.js` encounter `spawnRules` arrays with population-driven encounter selection;
- broad player-facing gathering UI/commands;
- richer weather/season/migration/predation/reproduction/territory ecology;
- high-volume creature/flora/resource generation;
- hundreds/thousands-scale regional content validation, which belongs to `0.5.800`.

---

# Active and future milestone gates

## 0.5.700 — Travel and scheduled transport substrate — next

Deliver:

- canonical route records independent of incidental place-transition UI;
- timed local/walking/overland travel built on canonical world time, tasks, and interrupts;
- route distance/time, hazards, encumbrance/cargo, and map/knowledge hooks;
- scheduled caravans with stops, deterministic departure cadence, fare, cargo allowance, travel time, and arrival;
- a shared transport contract that later ferries, wagons, mounts, and other modes can use;
- representative cross-reference validation across routes, stops, places, schedules, and transport records.

Do not mass-author routes until the contracts and validators are coherent.

## 0.5.800 — Regional content packs, normalization, and validation

Deliver regional content-pack contracts across places/routes/NPCs/shops/ecology/resources/items/recipes/quests/relationships/transport; reviewable legacy/reference normalization; and high-volume cross-reference validation for stable IDs, sources/sinks, spawns, recipes, shops, quests/rewards, routes, maps, and companions.

## 0.5.900 — Simulation/content-substrate exit gate

0.5 closes when long fictional activities safely fast-forward/interrupt/summarize; original-world IDs are stable; projects/provenance exist; ecology/gathering/spawn definitions can populate the world; scheduled transport connects multiple regions; and regional content packs/validators can safely support high-volume original content generation.

---

# Later phases

## 0.6 — Integrated Character and Mechanics Content

Planned tracks cover character stats/progression; skills/proficiencies/disciplines/capabilities; original magic/active abilities; Combat 2.0; canonical item/equipment/tool breadth; gathering/hunting/processing/crafting/cooking/salvage; ecology/regional content; companions; and an integrated-mechanics exit gate.

## 0.7 — Multi-Region Playable Alpha

Multiple settlements/regions, transport/logistics, hundreds-scale NPC populations, regional economies, systemic quests/contracts/reputation, relationships/romance, distinct ecology/content packs, and a complete multi-city opening campaign layer.

## 0.8 — Life and Infrastructure Expansion

Property, construction, agriculture, husbandry/taming, workshops, logistics, labor, households, civic institutions, production chains, maintenance, and earned automation.

## 0.9 — Adventure Depth and Release Hardening

Advanced combat/magic, bosses/dungeons/expeditions, high-tier equipment/crafting, regional/faction arcs, long-simulation balance, UI/accessibility, migrations, performance, and thousands-of-record validation.

## 1.0 — Live Foundation

1.0 begins the explicit compatibility/product promise for a persistent character living across a connected original fantasy world with meaningful livelihoods, relationships, exploration, material progression, danger, home/infrastructure, and long-term ambition.
