# Versioning and Release Roadmap

This document defines the product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md` — product/design north star.
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-setting, naming, provenance, content scale, and import policy.
- `docs/ROADMAP.md` — implementation status and phase index.
- `docs/THREAD_HANDOFF.md` — current implementation continuation state.

## Current baseline

```text
Product:      0.5.600.1
Package:      0.5.600
Account Save: 4
Game State:   5
Data:         16
Benchmark:    1
Codename:     Resource Provenance
```

The repository is pre-alpha. Deterministic simulation, original-world identity, persistent projects, and the first provenance-aware physical resource recovery substrate are established; content breadth and many integrated mechanics remain far below the intended game.

## Product version format

Use:

```text
MAJOR.PHASE.TRACK.REVISION
```

Example:

```text
0.5.600.1
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

Current intentional compatibility examples include historical localStorage keys, legacy POI hook IDs, explicit legacy/reference modules, and `gil` pending deliberate original currency design.

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

Resulting baseline:

```text
Product:      0.5.600.1
Package:      0.5.600
Account Save: 4
Game State:   5
Data:         16
```

### Version impact

- **Product:** `0.5.550.2` -> `0.5.600.1`.
- **Package:** `0.5.550` -> `0.5.600`.
- **Account Save:** unchanged at 4.
- **Game State:** unchanged at 5 because project/resource registries are additive and lazily initialize when absent.
- **Data:** 15 -> 16 because the item/provenance data contract changed and item schema advanced to v3.
- **Item schema system:** `0.6.0` -> `0.7.0`.
- **Battle rewards:** `0.5.2` -> `0.6.0` because physical material drops were replaced with recoverable world opportunities.
- New systems: `projects 0.1.0`, `resourceProvenance 0.1.0`, `resourceOpportunities 0.1.0`, `resourceRecovery 0.1.0`.

### Delivered

- persistent projects with stable IDs, real material contribution, canonical timed labor, progress, cancellation, completion, and semantic events;
- provenance categories spanning physical, economic, social, crafting, and explicitly exceptional magical acquisition;
- item sink/use metadata and validation hooks;
- defeated-enemy body/carried-goods/salvage opportunities instead of automatic finished-material insertion;
- timed search/skin/butcher/pluck/extract/salvage contracts with tool, proficiency, condition, time, inventory, and chance hooks;
- resource-yield rolls fixed and persisted when recovery starts, preventing later reconciliation from rerolling the same work;
- recovered items carry source/place/action provenance;
- starter loot tables reinterpreted as transitional candidate-output pools;
- regression tests for project state, provenance metadata, recovery actions, deterministic recovery outcomes, battle rewards, and version/database contracts.

### Intentionally deferred

- broad UI/command affordances for project/resource actions;
- hundreds-scale source/sink graph validation and content generation;
- environmental gathering nodes, species populations, depletion/regeneration, and respawn;
- final currency design;
- full processing/crafting chains.

---

# Active and future milestone gates

## 0.5.650 — Ecology, gathering, and spawn substrate — next

Deliver:

- species/family definitions separated from encounter instances;
- habitat/population data with place/biome, density, rarity, aggression, senses, social/link behavior, and environmental hooks;
- flora/mineral/fishing/gathering-source definitions referencing canonical item outputs and provenance actions;
- deterministic depletion/regeneration or respawn compatible with canonical world time and interrupts;
- rare/named population hooks;
- representative cross-reference validation among species, places, population records, resource sources, and item outputs.

Do not expand to high-volume creature/resource catalogs before these contracts are coherent.

## 0.5.700 — Canonical routes and scheduled transport

Deliver simulation-time walking/routes, scheduled caravans, shared transport contracts, interruption/cargo/fare hooks, and route/map knowledge.

## 0.5.800 — Regional content packs, normalization, and validation

Deliver content-pack contracts, candidate import normalization, broad cross-reference/source-sink validation, and workflows proven at hundreds/thousands-of-record scale.

## 0.5.900 — Simulation/content-substrate exit

0.5 closes when deterministic long-duration simulation, canonical identity, provenance/projects, ecology/gathering, scheduled transport, and scalable content-pack validation are all integrated.

## 0.6 — Integrated character and mechanics content

Major gates cover character stats/progression, capability-centered disciplines, original magic/abilities, Combat 2.0, broad item/tool catalogs, gathering/crafting/cooking/salvage, ecology content, and persistent AI companions.

## 0.7 — Multi-region playable alpha

Major gates cover a multi-settlement world graph, regional transport/logistics, hundreds-scale NPC populations, functioning regional economies, systemic quests/contracts/reputation, relationships/romance, and substantial regional content packs.

## 0.8 — Life and infrastructure expansion

Deepen property, construction, agriculture, husbandry/taming, workshops, logistics, households, civic institutions, production chains, labor, and earned automation.

## 0.9 — Adventure depth and release hardening

Deepen advanced combat/magic, expeditions/dungeons, high-tier professions/equipment, regional arcs, balance, accessibility, migrations, performance, and content-complete beta/RC stabilization.

## 1.0 — Live foundation

1.0 begins the explicit long-term compatibility promise. Saves, canonical IDs, persistence formats, and core gameplay contracts become live-support commitments rather than pre-alpha implementation details.
