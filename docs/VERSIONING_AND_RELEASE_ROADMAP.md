# Versioning and Release Roadmap

This document defines the product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md` — product/design north star.
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-setting, naming, provenance, content scale, and import policy.
- `docs/ROADMAP.md` — implementation status and phase index.
- `docs/THREAD_HANDOFF.md` — current implementation continuation state.

## Current baseline

```text
Product:      0.5.700.1
Package:      0.5.700
Account Save: 4
Game State:   5
Data:         18
Benchmark:    1
Codename:     Routes and Transport
```

The repository is pre-alpha. Deterministic simulation, original-world identity, persistent projects, provenance-aware physical resource recovery, ecology/population/environmental gathering, and canonical route/scheduled-transport substrates are established; content breadth and many integrated mechanics remain far below the intended game.

## Product version format

Use:

```text
MAJOR.PHASE.TRACK.REVISION
```

Example:

```text
0.5.700.1
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

Current intentional compatibility examples include historical localStorage keys, legacy POI hook IDs, explicit legacy/reference modules, transitional encounter `spawnRules`, transitional place connections used as route fallbacks, and `gil` pending deliberate original currency design.

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

Resulting baseline was `0.5.650.1 / Package 0.5.650 / Game State 5 / Data 17`. It delivered family/species separation, place-bound populations, environmental gathering sources, deterministic depletion/regeneration and rare/named conditions, resource-item provenance links, and ecology cross-reference validation.

## 0.5.700 — Travel and scheduled transport substrate — complete

Resulting baseline:

```text
Product:      0.5.700.1
Package:      0.5.700
Account Save: 4
Game State:   5
Data:         18
Benchmark:    1
Codename:     Routes and Transport
```

### Version impact

- **Product:** `0.5.650.1` -> `0.5.700.1`.
- **Package:** `0.5.650` -> `0.5.700`.
- **Account Save:** unchanged at 4.
- **Game State:** unchanged at 5. No required top-level persistence registry was added; active travel records gain a richer shape and older active-travel records are normalized lazily at the travel boundary.
- **Data:** 17 -> 18 for canonical route, stop, segment, and scheduled-service contracts.
- **Travel system:** `0.4.4` -> `0.5.0`.
- **Navigation system:** `0.1.0` -> `0.1.1` so stopping movement cancels the associated canonical travel task.
- New systems: `routeCatalog 0.1.0`, `transport 0.1.0`.

### Delivered

- canonical route records independent of incidental place-transition UI;
- stable route-stop records with place/coordinate references;
- route segment duration, distance, hazard, directionality, supported-mode, cargo/encumbrance, and map/knowledge metadata;
- canonical walking/overland travel using the existing timed-task and world-time authorities;
- existing place connections retained as a bounded fallback for places not yet represented in the route catalog;
- scheduled service records with deterministic cadence, stable stops, boarding lead, fare, cargo allowance, mode, route, and travel duration;
- shared scheduled transport contract demonstrated by caravan and ferry services and shaped for later wagon/coach/mount use;
- explicit waiting and in-transit journey phases;
- deterministic departure and arrival semantic events and simulation-interrupt candidates;
- linked task cancellation when travel stops;
- representative interregional services plus local regional road/causeway/waterway examples;
- standalone route/service validation and regression coverage for route cross-references, schedule calculations, fare/cargo enforcement, canonical timed travel, interrupts, arrival, and cancellation;
- semantic-event regressions updated to filter by type rather than assuming travel owns the first event sequence after timed tasks were composed into the same action.

### Intentionally deferred

- broad command/UI booking flows for scheduled service;
- fare-refund policy on cancellation;
- calendars/service days, stop dwell, weather suspension, ticket/reservation state, vehicle/NPC actors, and capacity competition;
- full en-route hazard/encounter/event resolution;
- universal hard gating by route/map knowledge;
- balanced final route distances/times and mass-authored transport networks;
- replacement of all transitional place connections;
- final original currency design; current fares intentionally use `gil`.

---

# Active and future milestone gates

## 0.5.800 — Regional content packs, normalization, and validation — next

Deliver:

- regional content-pack manifests with stable pack IDs, ownership/region metadata, contract version, and explicit content collections;
- stable-ID ownership and duplicate/conflict detection across packs;
- unified cross-reference validation across places/routes/NPCs/shops/ecology/resources/items/recipes/quests/relationships/transport;
- source/sink graph validation and explicit exemptions;
- detection of dangling references, invalid route/service topology, and legacy identifiers leaking into canonical packs without adapters;
- legacy/reference normalization that produces reviewable candidate records rather than direct canonical imports;
- representative multi-pack and cross-region references;
- generated scale fixtures at hundreds-of-record breadth before large hand-authored content expansion.

Do not mass-author regional catalogs until the pack contract and validators are coherent.

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
