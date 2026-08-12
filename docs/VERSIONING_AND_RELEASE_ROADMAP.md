# Versioning and Release Roadmap

This document defines the product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md` — product/design north star.
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-setting, naming, provenance, content scale, and import policy.
- `docs/ROADMAP.md` — implementation status and phase index.
- `docs/THREAD_HANDOFF.md` — current implementation continuation state.

## Current baseline

```text
Product:      0.6.200.1
Package:      0.6.200
Account Save: 4
Game State:   5
Data:         20
Benchmark:    1
Codename:     Character Capabilities
```

The repository is pre-alpha. Phase 0.5 is complete and Phase 0.6 is active. Character-owned stat/progression state and character-owned capability/proficiency semantics are now established on top of the deterministic simulation/content substrate.

## Product version format

Use:

```text
MAJOR.PHASE.TRACK.REVISION
```

Example:

```text
0.6.200.1
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

`js/text/version.js` is authoritative for active values.

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

Current intentional compatibility examples include historical localStorage keys, legacy POI hook IDs, explicit legacy/reference modules, transitional encounter `spawnRules`, transitional place connections used as route fallbacks, internal `player.jobs`/`mainJobId`/`raceId`/`nationId`-shaped persisted properties awaiting incremental evolution, discipline-shaped equipment eligibility scaffolding, and `gil` pending deliberate original currency design.

Additive/lazily defaulted fields do not require a Game State bump merely because a newer runtime knows about them. A Game State bump is required when the persistence contract becomes semantically incompatible, mandatory shapes cannot be reconstructed deterministically, or an ordered migration is necessary.

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

Resulting baseline was `0.5.600.1 / Package 0.5.600 / Game State 5 / Data 16`. Delivered persistent projects, provenance/source/sink contracts, post-combat physical resource opportunities, deterministic timed recovery, and provenance-tagged materials.

## 0.5.650 — Ecology, gathering, and spawn substrate — complete

Resulting baseline was `0.5.650.1 / Package 0.5.650 / Game State 5 / Data 17`. Delivered family/species separation, place-bound populations, environmental gathering sources, deterministic depletion/regeneration, rare/named conditions, and ecology validation.

## 0.5.700 — Travel and scheduled transport substrate — complete

Resulting baseline was `0.5.700.1 / Package 0.5.700 / Game State 5 / Data 18`. Delivered canonical routes/stops, timed walking travel, scheduled service contracts, deterministic departure/arrival, travel interrupts, and route/service validation.

## 0.5.800 — Regional content packs, normalization, and validation — complete

Resulting baseline was `0.5.800.1 / Package 0.5.800 / Game State 5 / Data 19`. Delivered regional/shared pack manifests, stable ownership/dependency semantics, unified cross-reference validation, review-only legacy candidate normalization, representative multi-pack content, and a generated 600-record scale fixture.

## 0.5.900 — Simulation/content-substrate exit gate — complete

Resulting baseline was `0.5.900.1 / Package 0.5.900 / Game State 5 / Data 19`. Added `simulationSubstrateGate 0.1.0` and formally closed Phase 0.5 across deterministic simulation, identity, provenance/projects, ecology/gathering, transport, regional content/scale, and persistence compatibility.

The gate is intentionally evaluated as a historical minimum (`product >= 0.5.900.0`) so it remains valid during later phases rather than failing simply because the product advanced to 0.6.

## 0.6.100 — Character stats and progression — complete

Resulting baseline:

```text
Product:      0.6.100.1
Package:      0.6.100
Account Save: 4
Game State:   5
Data:         19
Benchmark:    1
Codename:     Continuous Character
```

### Version impact

- **Product:** `0.5.900.1` -> `0.6.100.1`.
- **Package:** `0.5.900` -> `0.6.100`.
- **Account Save:** unchanged at 4.
- **Game State:** unchanged at 5; `statState` and `progression.character` are additive/lazily reconstructible.
- **Data:** unchanged at 19; this track changes runtime ownership/formulas rather than adding a new canonical data catalog contract.
- New system: `characterStats 0.1.0`.
- `playerEntity` advanced to 0.7.0.
- `statEngine` advanced to 0.5.0.
- `progression`, `disciplineSwitching`, and `leveling` advanced to 0.6.0.

### Delivered

- versioned character-owned base stat state with explicit original-design provenance/confidence;
- persistent base growth derived from highest attained discipline training rank rather than current discipline identity;
- active discipline represented as contextual stat/training focus with `capabilityGate: false`;
- character-level lifetime EXP/highest-training metadata in addition to per-discipline levels/EXP;
- lower-level discipline switching cannot reduce persistent character base growth;
- historical FFXI stat formulas and inferred job-resource formulas retained for research/comparison but removed as canonical player runtime authority;
- compatibility fields and save schema preserved through additive/lazy state.

### Intentionally deferred

- final numerical stat balance;
- removal/renaming of all internal `jobs`/`mainJobId`/`raceId` properties;
- broader proficiency/capability ownership semantics, which move to 0.6.200;
- Combat 2.0.

## 0.6.200 — Skills, proficiencies, disciplines, and capabilities — complete

Resulting baseline:

```text
Product:      0.6.200.1
Package:      0.6.200
Account Save: 4
Game State:   5
Data:         20
Benchmark:    1
Codename:     Character Capabilities
```

### Version impact

- **Product:** `0.6.100.1` -> `0.6.200.1`.
- **Package:** `0.6.100` -> `0.6.200`.
- **Account Save:** unchanged at 4.
- **Game State:** unchanged at 5; `progression.capabilities` is additive/lazily initialized.
- **Data:** 19 -> 20 for the canonical capability catalog and learning/use requirement contract.
- New system: `capabilities 0.1.0`.
- `playerEntity` advanced to 0.8.0.
- `skillProgression` advanced to 0.6.0.
- `progression`, `disciplineSwitching`, and `characterStats` retain their 0.6.100 subsystem versions because their contracts were not replaced.

### Delivered

- stable character capability definitions separate from future executable ability/effect definitions;
- distinct capability **learning paths** and **use requirements**;
- discipline training can teach a capability, including qualifying training recorded while that discipline is inactive;
- learned capabilities persist on the continuous character across discipline changes;
- use eligibility checks learned proficiency, equipment/main-hand tags, tools, preparation, resources, flags, and action/world context;
- active discipline is explicitly not a universal capability-use gate;
- skill training caps limit new gain without truncating learned character proficiency when active discipline changes;
- representative martial and practical capabilities exercise combat, resource-recovery, and gathering-shaped requirements;
- capability state is validated and lazily initialized without a persistence migration;
- database registry separates `capabilities` (ownership/eligibility) from planned executable `abilities` (effects/actions).

### Intentionally deferred

- mass capability/technique catalogs;
- generalized executable effect engine;
- original magic schools/spell catalogs;
- universal capability-driven combat action routing;
- trainer/quest/preparation UI;
- capability-centered replacement of every discipline-shaped equipment restriction;
- final proficiency-cap math; current rank/cap scaffold remains explicitly placeholder-confidence.

---

# Active and future milestone gates

## 0.6.300 — Original magic and active ability engine — next

Deliver a bounded executable-effect layer without conflating it with character capability ownership:

- define stable original ability/effect and spell-school records;
- keep historical spell names/data out of canonical content;
- model targeting, resource costs, cast/activation time, recast/cooldown, interruption, and effect payloads deterministically;
- allow character-owned capabilities to enable executable effects while concrete use requirements remain under capability/loadout/preparation checks;
- emit structured `ActionResult`/semantic events independently of prose;
- preserve current battle/action behavior behind adapters until Combat 2.0 (`0.6.400`);
- prove representative offensive, restorative/support, and non-combat/contextual effects before broad content expansion.

Do not open Combat 2.0 inside this track.

## Later 0.6 tracks

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
