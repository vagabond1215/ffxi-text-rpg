# Versioning and Release Roadmap

This document defines the product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md` — product/design north star.
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-setting, naming, provenance, content scale, and import policy.
- `docs/ROADMAP.md` — implementation status and phase index.
- `docs/THREAD_HANDOFF.md` — current implementation continuation state.

## Current baseline

```text
Product:      0.5.550.2
Package:      0.5.550
Account Save: 4
Game State:   5
Data:         15
Benchmark:    1
Codename:     Original World Identity
```

The repository is pre-alpha. Deterministic simulation and original-world identity foundations are established; content breadth and many integrated mechanics remain far below the intended game.

## Product version format

Use:

```text
MAJOR.PHASE.TRACK.REVISION
```

Example:

```text
0.5.550.2
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

Example:

```text
Product: 0.5.550.2
Package: 0.5.550
```

Do not put a four-part numeric product version directly into `package.json.version`.

## Independent schema/system versions

Do not collapse these into the product version:

- Account Save;
- Game State;
- Data;
- Benchmark;
- individual subsystem versions.

The product version answers: **what development milestone does this build represent?**

Persistence versions answer: **can saved data be read, migrated, or rejected safely?**

The Data version answers: **has the canonical data contract changed in a way consumers/migrations must distinguish?**

System versions answer: **what revision of one subsystem contract is present?**

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

A runtime change inside an active track normally increments the fourth segment. Completing a track does not automatically advance to the next track until its exit gate is satisfied and the documentation/handoff are synchronized.

Docs-only planning changes normally do not bump product version.

A product-version bump never substitutes for a persistence migration. Persisted schema or stable-ID changes require an explicit migration/version decision.

## Compatibility policy

Prefer bounded adapters and ordered migrations over permanent dual schemas.

A compatibility token may remain when changing it would create needless migration risk, provided it is not treated as canonical new content. Current examples include historical localStorage keys, legacy POI hook IDs, and explicit legacy/reference modules.

`gil` is intentionally unchanged at the `0.5.550` exit. An original currency replacement must be deliberately designed rather than invented solely to remove a historical word.

---

# Historical milestone record

## 0.4 — Foundation — complete

Delivered:

- development direction and version protocol;
- four-part product/package separation;
- ordered Game State migrations;
- structured `ActionResult` outcomes;
- bounded semantic-event history;
- architecture stabilization and foundation exit certification.

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

Resulting baseline:

```text
Product:      0.5.550.2
Package:      0.5.550
Account Save: 4
Game State:   5
Data:         15
```

Delivered:

- original powers, regions, places, maps, ancestries, and transitional disciplines;
- Game State v4 -> v5 migration for persisted identity IDs;
- bounded legacy-to-canonical input/migration adapters;
- canonical character-creation defaults and player-facing command vocabulary;
- originalized starter world/NPC/service content;
- canonical home-storage, companion, place/exit, and travel terminology;
- explicit quarantine of FFXI-derived research/reference modules;
- canonical database/system diagnostic vocabulary;
- restored green test, benchmark, and build baseline.

Intentional non-blocking compatibility debt:

- `gil` pending deliberate original currency design;
- historical localStorage keys;
- some legacy-shaped POI hook IDs;
- explicit legacy/migration/research modules and tests;
- bounded legacy command/input aliases.

Exit criterion met: new canonical gameplay records and normal world-facing runtime state can be authored without inherited FFXI proper nouns or stable IDs.

---

# Active and future milestone gates

## 0.5.600 — Resource provenance and persistent projects — next

Deliverables:

- persistent project model with stable IDs, materials, labor, canonical time, progress, and completion events;
- provenance/source schema spanning bodies, gathering, minerals, fishing, salvage, crafting, commerce, contracts, and exceptional magic;
- post-combat body/resource opportunities instead of automatic finished-item drops where appropriate;
- search/skin/butcher/pluck/extract/salvage substrate;
- item source/sink metadata and validation hooks.

A Game State or Data version bump is required only if the persisted/runtime contract actually changes; make that decision from the concrete schema rather than pre-allocating a version.

## 0.5.650 — Ecology, gathering, and spawn substrate

Deliver species/family definitions, habitats/populations, flora/mineral/fishing sources, deterministic regeneration/respawn, and rare/named spawn hooks.

## 0.5.700 — Canonical routes and scheduled transport

Deliver simulation-time walking/routes, scheduled caravans, shared transport contracts, interruption/cargo/fare hooks, and route/map knowledge.

## 0.5.800 — Regional content packs, normalization, and validation

Deliver content-pack contracts, candidate import normalization, cross-reference validation, source/sink checks, and workflows proven at hundreds/thousands-of-record scale.

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
