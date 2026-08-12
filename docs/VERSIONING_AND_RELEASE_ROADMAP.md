# Versioning and Release Roadmap

This document defines the product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md` — product/design north star.
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-setting, naming, provenance, content scale, and import policy.
- `docs/ROADMAP.md` — implementation status and phase index.
- `docs/THREAD_HANDOFF.md` — current implementation continuation state.

## Current baseline

```text
Product:      0.6.300.1
Package:      0.6.300
Account Save: 4
Game State:   5
Data:         21
Benchmark:    1
Codename:     Original Magic and Abilities
```

The repository is pre-alpha. Phase 0.5 is complete and Phase 0.6 is active. Character-owned stat/progression, capability/proficiency semantics, semantic player-interface architecture, and the first canonical executable magic/ability layer are established on top of the deterministic simulation/content substrate.

## Product version format

Use:

```text
MAJOR.PHASE.TRACK.REVISION
```

Example:

```text
0.6.300.1
```

| Segment | Meaning |
| --- | --- |
| `MAJOR` | Stability/compatibility generation. `0` is pre-1.0; `1` begins the live compatibility contract. |
| `PHASE` | Major development milestone such as `0.5`, `0.6`, or `0.7`. |
| `TRACK` | Three-digit scoped milestone within the phase. Inserted tracks such as `250` or `550` are allowed. |
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

Current intentional compatibility examples include historical localStorage keys, legacy POI hook IDs, explicit legacy/reference modules, transitional encounter `spawnRules`, transitional place connections used as route fallbacks, internal `player.jobs`/`mainJobId`/`raceId`/`nationId`-shaped persisted properties awaiting incremental evolution, discipline-shaped equipment eligibility scaffolding, typed/global commands retained as power-user/compatibility interfaces while semantic DOM views mature, the transitional canvas UI implementation retained for regression comparison, transitional legacy `cast`/combat-technique adapters pending Combat 2.0, and `gil` pending deliberate original currency design.

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

Version impact:

- **Product:** `0.5.900.1` -> `0.6.100.1`.
- **Package:** `0.5.900` -> `0.6.100`.
- **Account Save:** unchanged at 4.
- **Game State:** unchanged at 5; `statState` and `progression.character` are additive/lazily reconstructible.
- **Data:** unchanged at 19.
- New system: `characterStats 0.1.0`.

Delivered character-owned base stats, highest-training persistent growth, lifetime character progression, contextual active-discipline modifiers, and removal of historical FFXI stat formulas from canonical player runtime authority.

## 0.6.200 — Skills, proficiencies, disciplines, and capabilities — complete

Capability-contract baseline:

```text
Product:      0.6.200.1
Package:      0.6.200
Account Save: 4
Game State:   5
Data:         20
Benchmark:    1
Codename:     Character Capabilities
```

Capability-track impact:

- **Product:** `0.6.100.1` -> `0.6.200.1`.
- **Package:** `0.6.100` -> `0.6.200`.
- **Account Save:** unchanged at 4.
- **Game State:** unchanged at 5; `progression.capabilities` is additive/lazily initialized.
- **Data:** 19 -> 20 for the canonical capability catalog and learning/use requirement contract.
- New system: `capabilities 0.1.0`.

Delivered character-owned capability definitions, separate learning/use requirements, discipline-as-training-path semantics, non-destructive character proficiency, and capability/effect responsibility separation.

### 0.6.200.2 — canvas UI usability revision

```text
Product:      0.6.200.2
Package:      0.6.200
Account Save: 4
Game State:   5
Data:         20
```

- **Product:** `0.6.200.1` -> `0.6.200.2`.
- **Package / Account Save / Game State / Data:** unchanged.
- `canvasUi` advanced to `0.8.0`.
- `uiIntents` advanced to `0.2.0`.
- `characterCreation` advanced to `0.5.2`.

Delivered creator wording/wrapping fixes, discovery local minimap, compact D-pad, categorized canvas actions, and at-a-glance right-pane character information. This revision exposed the larger architectural problem that the browser shell was still rebuilding native layout/forms/text behavior manually in Canvas.

## 0.6.250 — Player interface architecture — complete

Resulting baseline:

```text
Product:      0.6.250.1
Package:      0.6.250
Account Save: 4
Game State:   5
Data:         20
Benchmark:    1
Codename:     Player Interface Architecture
```

### Version impact

- **Product:** `0.6.200.2` -> `0.6.250.1`.
- **Package:** `0.6.200` -> `0.6.250`.
- **Account Save:** unchanged at 4.
- **Game State:** unchanged at 5; new UI state is ephemeral and no authoritative persisted shape changed.
- **Data:** unchanged at 20; no canonical gameplay/content data contract changed.
- New system: `domUi 0.1.0`.
- New system: `gameViewModels 0.1.0`.
- `canvasUi 0.8.0` remains tracked as a transitional compatibility/reference implementation.
- `uiIntents 0.2.0` remains valid; the DOM shell reuses the established intent contract rather than inventing a second dispatcher.

### Delivered

- active browser boot moved from `createCanvasApp(canvas)` to `createDomApp(host)`;
- semantic HTML/CSS application shell with native text wrapping, forms, focus, responsive layout, and scroll behavior;
- renderer-independent game presentation model for scene, status, local map, movement, activity, and contextual actions;
- scene/world-first center presentation instead of a permanent `Output Log` surface;
- SVG discovery map backed by existing atlas knowledge and compact D-pad/keyboard navigation;
- primary information navigation for Scene, Character, Spellbook, Journal, Codex, Craft, and World;
- small state-dependent contextual action set instead of presenting the entire command catalog;
- compact persistent character resources/attributes/activity status;
- Search-or-act command-capable omnibox for keyboard/power-user interaction;
- single-screen character creation with ancestry/sex/origin/discipline descriptions and continuously visible summary;
- explicit empty/planned states for unfinished Journal/Codex/Craft depth rather than presenting legacy data as complete gameplay;
- semantic-interface regression tests while preserving canvas compatibility tests.

### No migration rationale

The DOM shell derives from existing Game State v5 player, atlas, simulation, POI, travel, battle, and timed-task state. It does not create a new authoritative persistent UI schema. The local map remains a view of atlas knowledge, not a new geography database. Therefore neither Game State nor Data advances.

### Intentionally deferred

- dedicated presentation models for every inventory/equipment/spell/codex/journal/crafting domain; several current view buttons still bridge to typed commands;
- true fuzzy cross-database omnibox search and suggestions;
- richer map iconography, landmarks, multi-level maps, and regional/world map composition;
- fully extracted renderer-neutral UI state (some structural helpers are still reused from canvas input code);
- dedicated active-browser simulation-time controls until scheduler/interrupt wiring is cleanly exposed to the DOM shell;
- deletion of canvas modules before their compatibility/regression value is exhausted.

## 0.6.300 — Original magic and active ability engine — complete

Resulting baseline:

```text
Product:      0.6.300.1
Package:      0.6.300
Account Save: 4
Game State:   5
Data:         21
Benchmark:    1
Codename:     Original Magic and Abilities
```

### Version impact

- **Product:** `0.6.250.1` -> `0.6.300.1`.
- **Package:** `0.6.250` -> `0.6.300`.
- **Account Save:** unchanged at 4.
- **Game State:** unchanged at 5; `state.abilities` is additive and lazily initialized by the ability runtime boundary.
- **Data:** 20 -> 21 because original spell-school and executable ability records establish a new canonical data contract.
- `capabilities` advanced to `0.2.0` to add original spell learning/use paths and exploration capability context.
- New system: `abilityCatalog 0.1.0`.
- New system: `abilityEngine 0.1.0`.
- `magic` and `abilities` database/system contracts now exist at `0.1.0`.
- `gameViewModels` advanced to `0.2.0` and `uiIntents` to `0.3.0` for semantic learned-ability presentation/activation.

### Delivered

- original Embercraft, Vital Weave, and Ward Lore traditions with stable canonical IDs;
- executable ability records are separate from character-owned capabilities;
- representative Ember Dart, Mending Thread, Stone Ward, Guarded Cut, and Waymark Reading effects;
- deterministic self/enemy/context targeting, MP/TP cost spending, activation duration, cooldown deadlines, structured damage/heal/status/context effects, and interruption semantics;
- non-instant activation backed by canonical timed tasks and a dedicated completion interrupt priority above generic task completion;
- `ability.started`, `ability.resolved`, and `ability.interrupted` semantic events;
- resource costs are spent once when activation begins; cooldown begins on successful resolution; interruption retains spent resources and does not begin cooldown;
- Waymark Reading reports only acquired atlas knowledge and does not reveal full authored topology;
- semantic `ability.activate` UI intent and learned-only spellbook view-model records;
- combat contextual actions can expose ready learned canonical abilities without generating command strings;
- bounded `invoke <ability>` command adapter for keyboard/power-user access while the old `cast` and transitional technique adapters remain isolated for Combat 2.0;
- non-travel `wait` now advances canonical fictional world time and reconciles ability activation rather than advancing only the wall-clock tick adapter.

### No Game State migration rationale

The ability runtime stores cooldown deadlines and at most one active activation under an additive `state.abilities` object. Missing state can be reconstructed deterministically by lazy initialization without reinterpretation of existing saved fields. Account Save remains 4 and Game State remains 5. Data advances because the executable magic/ability catalog itself is a new canonical data contract.

### Intentionally deferred

- Combat 2.0 encounter/action architecture, opponent canonical ability selection, tactical action timing/recovery, and deeper interruption/status interaction;
- AoE, multi-target, ground targeting, resistance/accuracy layers, and final combat balance;
- broad spell/technique content expansion;
- world-time status-expiry orchestration beyond existing status metadata;
- multiple simultaneous/queued active ability activations;
- complete dedicated DOM Spellbook cards; the semantic view-model/intent seam exists and should be extended incrementally;
- removal of `combatActionEngine.castSpell()` or transitional technique commands before their compatibility value is replaced by 0.6.400.

---

# Active and future milestone gates

## 0.6.400 — Combat 2.0 — next

Establish canonical tactical combat on the deterministic simulation/action substrate:

- define canonical encounter/combat state without making the active discipline a hard class identity;
- make canonical abilities first-class combat actions with deterministic target/action resolution;
- define opponent action selection/AI and action timing/recovery/interruption semantics;
- integrate statuses, skills, equipment, capabilities, preparation, and resources compositionally;
- migrate `attack`, legacy `cast`, and transitional `technique` command paths behind bounded canonical-combat adapters;
- preserve victory/defeat, EXP, provenance-aware physical resource opportunities, and reward semantics;
- prove representative tactical combat without rolling into item/equipment breadth.

Do not open `0.6.500` inside this track.

## Later 0.6 tracks

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