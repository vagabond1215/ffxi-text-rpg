# Versioning and Release Roadmap

This document defines the product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md` — product/design north star.
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-setting, naming, provenance, content scale, and import policy.
- `docs/ROADMAP.md` — implementation status and phase index.
- `docs/THREAD_HANDOFF.md` — current implementation continuation state.

## Current baseline

```text
Product:      0.5.900.1
Package:      0.5.900
Account Save: 4
Game State:   5
Data:         19
Benchmark:    1
Codename:     Simulation Substrate Gate
```

The repository is pre-alpha. **Phase 0.5 is complete:** deterministic simulation, original-world identity, persistent projects, provenance-aware resources, ecology/gathering/populations, canonical routes/scheduled transport, regional content packs, scalable cross-reference validation, and an explicit substrate readiness gate are established. Phase 0.6 now integrates substantial character and mechanics content on top of that substrate.

## Product version format

Use:

```text
MAJOR.PHASE.TRACK.REVISION
```

Example:

```text
0.5.900.1
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

Current intentional compatibility examples include historical localStorage keys, legacy POI hook IDs, explicit legacy/reference modules, transitional encounter `spawnRules`, transitional place connections used as route fallbacks, internal `mainJobId`/`raceId`/`nationId`-shaped persisted properties awaiting incremental 0.6 evolution, and `gil` pending deliberate original currency design.

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

Resulting baseline was `0.5.700.1 / Package 0.5.700 / Game State 5 / Data 18`. It delivered canonical routes/stops, canonical timed walking travel, scheduled service contracts, deterministic departure/arrival, travel interrupts, cancellation coupling, and route/service cross-reference validation.

## 0.5.800 — Regional content packs, normalization, and validation — complete

Resulting baseline:

```text
Product:      0.5.800.1
Package:      0.5.800
Account Save: 4
Game State:   5
Data:         19
Benchmark:    1
Codename:     Regional Content Packs
```

### Version impact

- **Product:** `0.5.700.1` -> `0.5.800.1`.
- **Package:** `0.5.700` -> `0.5.800`.
- **Account Save:** unchanged at 4.
- **Game State:** unchanged at 5; pack manifests and validators are canonical data architecture, not mandatory persisted runtime state.
- **Data:** 18 -> 19 for regional/shared content-pack manifests, stable ownership/dependency semantics, recipe/quest/relationship fixture contracts, and canonical validation rules.
- New systems: `contentPackSchema 0.1.0`, `regionalContentPacks 0.1.0`, `contentPackValidation 0.1.0`, `legacyCandidateNormalization 0.1.0`.
- Unified validation subsystem advanced to `0.9.0`.

### Delivered

- content-pack manifest schema with stable IDs, shared/regional ownership, dependencies, data version, metadata, and explicit record collections;
- pack-level ownership indexing and duplicate/conflict detection while preserving human-meaningful canonical IDs;
- unified cross-reference validation across geography, routes/services, ecology, gathering sources, items/provenance/sinks, NPCs, shops, recipes, quests, and relationships;
- validation of missing references, source/sink requirements, route topology, undeclared cross-pack dependencies, ownership conflicts, and legacy-ID leaks;
- explicit legacy-adapter declarations at bounded pack boundaries;
- review-only legacy/reference normalization whose output stays `candidate`, `canonical: false`, and `requiresOriginalityReview: true`;
- representative shared, Elderwood, and Starfen pack manifests;
- representative pack-defined NPC/shop/recipe/quest/relationship records and intentional cross-region resource dependencies;
- generated scale test covering 300 items plus 300 recipes in one validated 600-record graph.

### Intentionally deferred

- physically relocating every established runtime catalog record into regional pack files;
- full crafting/quest/relationship runtime engines for pack fixture records;
- mass canonical content generation;
- automatic canonical acceptance of legacy/reference candidates, which is intentionally prohibited.

## 0.5.900 — Simulation/content-substrate exit gate — complete

Current resulting baseline:

```text
Product:      0.5.900.1
Package:      0.5.900
Account Save: 4
Game State:   5
Data:         19
Benchmark:    1
Codename:     Simulation Substrate Gate
```

### Version impact

- **Product:** `0.5.800.1` -> `0.5.900.1`.
- **Package:** `0.5.800` -> `0.5.900`.
- **Account Save:** unchanged at 4.
- **Game State:** unchanged at 5.
- **Data:** unchanged at 19 because the readiness gate adds integration assertions, not a new canonical data shape.
- New system: `simulationSubstrateGate 0.1.0`.

### Delivered

`js/text/systems/simulationSubstrateGate.js` evaluates seven structured readiness groups:

1. deterministic simulation;
2. original-world identity;
3. projects and provenance;
4. ecology and gathering;
5. routes and transport;
6. regional content and scale;
7. persistence compatibility.

The gate checks required implemented subsystem versions, production route/ecology/content-pack validators, minimum representative ecology/route/service breadth, deterministic scheduled departures, multi-pack/cross-pack content dependencies, Data v19, Account Save v4, Game State v5, and the ordered migration compatibility contract.

Regression tests prove both the green production gate and structured failure diagnostics when validators or required subsystems are intentionally broken.

### 0.5 phase exit decision

Phase 0.5 is complete. Its exit promise is now backed by both subsystem regression tests and an explicit integration gate: long fictional activities can fast-forward/interrupt/summarize; original-world identity is established; projects/provenance exist; ecology/gathering populations can represent renewable world sources; scheduled transport spans regions; and regional pack validation can safely scale content authoring.

---

# Active and future milestone gates

## 0.6.100 — Character stats and progression — next

Deliver an original-world character-stat/progression contract centered on the continuous character while preserving migration compatibility:

- audit and bound historical FFXI formula dependencies;
- define canonical base/derived/resource stat ownership and progression metadata;
- separate character-owned progression from active-discipline caps/modifiers where currently conflated;
- ensure discipline identity describes training rather than universally enabling capabilities;
- retain migration-safe adapters around existing persisted/internal `player.jobs`, `mainJobId`, `raceId`, and related fields instead of forcing an unbounded save rewrite;
- add representative canonical ancestry/discipline progression tests;
- retain historical formulas only behind explicit research/comparison boundaries.

Do not open the full capability/magic/combat rewrite inside this first 0.6 track.

## Later 0.6 tracks

- `0.6.200` skills, proficiencies, disciplines, and capabilities;
- `0.6.300` original magic and active ability engine;
- `0.6.400` Combat 2.0;
- `0.6.500` canonical item/equipment/tool breadth;
- `0.6.600` gathering/hunting/processing/crafting/cooking/salvage;
- `0.6.700` ecology/regional creature/resource content;
- `0.6.800` AI party/companion foundation;
- `0.6.900` integrated-mechanics exit gate.

## 0.7 — Multi-Region Playable Alpha

Multiple settlements/regions, transport/logistics, hundreds-scale NPC populations, regional economies, systemic quests/contracts/reputation, relationships/romance, distinct ecology/content packs, and a complete multi-city opening campaign layer.

## 0.8 — Life and Infrastructure Expansion

Property, construction, agriculture, husbandry/taming, workshops, logistics, labor, households, civic institutions, production chains, maintenance, and earned automation.

## 0.9 — Adventure Depth and Release Hardening

Advanced combat/magic, bosses/dungeons/expeditions, high-tier equipment/crafting, regional/faction arcs, long-simulation balance, UI/accessibility, migrations, performance, and thousands-of-record validation.

## 1.0 — Live Foundation

1.0 begins the explicit compatibility/product promise for a persistent character living across a connected original fantasy world with meaningful livelihoods, relationships, exploration, material progression, danger, home/infrastructure, and long-term ambition.
