# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Read order

1. `AGENTS.md` — direct-`main` workflow, autonomous-session budget, scope boundaries, and handoff protocol.
2. `docs/DEVELOPMENT_DIRECTION.md` — authoritative design north star.
3. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-setting, naming, legacy-data, provenance, scale, and content-pack policy.
4. `docs/ROADMAP.md` — current implementation sequence and milestone gates.
5. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — version protocol.
6. `docs/TRANSITIONAL_ARCHITECTURE.md` — temporary seams that must not harden into final design.
7. `docs/ARCHITECTURE.md` — current module boundaries.
8. `js/text/version.js` — authoritative active version values.
9. This handoff, then relevant runtime/data/tests for the next bounded unit.

Older planning documents preserve useful history but do not override the files above.

## Current Git workflow

The repository is in an early single-maintainer development phase. Per `AGENTS.md`, **continue directly on `main` by default**.

Do not create a branch/PR merely as ceremony. Use isolation if the user asks, a tool requires it, or the change is unusually risky enough that isolation materially helps.

Remote branch deletion is not exposed by the current GitHub connector, so stale remote branches remain a manual repository-maintenance task. Do not create replacement cleanup branches.

## Autonomous work-session limit

`AGENTS.md` sets the operating guardrail:

- maximum autonomous session: **2 hours 45 minutes**;
- **2:15** stabilization checkpoint;
- **2:30** start no new implementation unit;
- by **2:45** persist a coherent state, update this handoff, and report;
- if elapsed time cannot be measured reliably, use the fallback maximum of **6 autonomous work cycles**, reserving cycle 6 for stabilization/handoff.

A new user message starts a new budget. Roadmap `Next` sections do not authorize an endless autonomous chain.

## Product identity

Working title: **Hearth & Horizon**.

This is an original text-first persistent fantasy life RPG about one continuous character building livelihood, skills, relationships, reputation, material capability, home/infrastructure, and geographic reach across a connected fantasy world.

Earlier FFXI-derived material is **legacy research/reference/migration material**, not canonical world content.

Core laws:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

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

`js/text/version.js` is authoritative.

## Completed sequence

The coherent sequence on `main` is now:

- 0.4 foundation/versioning/ordered migrations/ActionResult/semantic events/stabilization;
- 0.5.100 deterministic world clock;
- 0.5.200 pause/speed controls;
- 0.5.300 canonical timed tasks;
- 0.5.400 deterministic interrupt model;
- 0.5.500 day boundaries/end-of-day review;
- 0.5.550 original-world identity/stable-ID migration;
- 0.5.600 persistent projects and resource provenance;
- 0.5.650 ecology, gathering-source, and population substrate;
- 0.5.700 canonical routes and scheduled transport substrate;
- 0.5.800 regional content packs, candidate normalization, and scalable validation;
- 0.5.900 explicit simulation/content-substrate exit gate.

**Phase 0.5 is complete.** Do not reopen earlier tracks broadly unless a concrete regression requires it.

## 0.5.800 — regional content pack status

`js/text/data/contentPackSchema.js` defines pack schema v1 with:

- stable pack IDs;
- `shared` or `region` ownership;
- owned region IDs/steward metadata;
- dependencies;
- Data-contract version;
- explicit collections for places, routes, transport services, ecology families/species/populations/sources, items, NPCs, shops, recipes, quests, and relationships;
- bounded explicit legacy adapters.

`js/text/data/regionalContentPacks.js` provides representative packs:

- `pack-shared-foundation`;
- `pack-elderwood-opening`;
- `pack-starfen-opening`.

Existing canonical runtime catalog records can be claimed with `catalogRef: true` so stable ownership/dependency contracts can be established without immediately relocating every existing data definition. This is an intentional migration seam, not the final content organization.

Representative pack-defined records prove a connected social/economic graph:

- Elderwood waywarden NPC, provisions shop, Sweetroot Field Tonic, recipe, road-repair quest, and relationship record;
- Starfen ferrymaster NPC, fenmarket, Fenfield Dressing, recipe, ferry-supplies quest, and relationship record;
- Starfen intentionally consumes Elderwood resources and declares the Elderwood pack as a dependency.

### Unified content-pack validator

`js/text/systems/contentPackValidator.js` provides:

- manifest validation;
- duplicate pack-ID detection;
- stable-ID ownership conflict detection across packs;
- cross-collection canonical ID collision detection;
- dependency existence/self/cycle checks;
- required dependency checks when a record references another pack's owned ID;
- bounded legacy-ID leak detection;
- canonical `catalogRef` resolution;
- route/service topology validation;
- species/family/population/place validation;
- gathering-source/item/place validation;
- item provenance/source/sink validation;
- NPC/shop/recipe/quest/relationship cross-reference validation;
- production route/ecology validator composition.

`tests/contentPackValidator.test.js` includes a generated **600-record** fixture: 300 items plus 300 recipes, all cross-validated through the pack contract.

### Legacy candidate normalization

`js/text/data/legacyCandidateNormalizer.js` is intentionally one-way into review state, not into canon. Normalized historical/reference records are always:

```text
reviewStatus: candidate
canonical: false
requiresOriginalityReview: true
source.kind: legacyReference
```

Existing bounded identity adapters may suggest a canonical ID, but parsing/normalization success never authorizes canonical import.

### 0.5.800 version impact

```text
Product                     0.5.700.1 -> 0.5.800.1
Package                     0.5.700   -> 0.5.800
Account Save                4         unchanged
Game State                  5         unchanged
Data                        18        -> 19
contentPackSchema            new       0.1.0
regionalContentPacks         new       0.1.0
contentPackValidation        new       0.1.0
legacyCandidateNormalization new       0.1.0
validation                  0.8.x     -> 0.9.0
```

Database registry now includes `contentPacks`, `contentPackValidation`, and `legacyCandidates`; representative pack fixture contracts move `quests`, `relationships`, and `crafting` out of purely planned status without claiming those gameplay engines are complete.

## 0.5.900 — exit-gate status

`js/text/systems/simulationSubstrateGate.js` provides `evaluateSimulationSubstrateGate()` and `validateSimulationSubstrateGate()`.

The production gate evaluates seven structured groups:

1. **deterministicSimulation** — world time, simulation control, timed tasks, interrupts, day cycle, semantic events;
2. **originalWorldIdentity** — original-world identity generation and v5 identity contract;
3. **projectsAndProvenance** — projects, provenance, resource opportunities, recovery;
4. **ecologyAndGathering** — production ecology validation plus representative family/species/population/source breadth and flora/mineral/fishing coverage;
5. **routesAndTransport** — production route validation, representative route/service breadth, deterministic scheduled departures;
6. **regionalContentScale** — valid pack/index graph, multiple regional/shared packs, cross-pack dependency, content-pack validation, candidate normalization;
7. **persistenceCompatibility** — Account Save v4, Game State v5, Data >=19, ordered migration compatibility.

The current production gate reports ready. Regression tests also inject broken validator outputs and a planned required subsystem to prove failures become structured diagnostics.

### 0.5.900 version impact

```text
Product                 0.5.800.1 -> 0.5.900.1
Package                 0.5.800   -> 0.5.900
Account Save            4         unchanged
Game State              5         unchanged
Data                    19        unchanged
simulationSubstrateGate new       0.1.0
```

No persistence/data bump was justified by the readiness gate itself because it adds integration assertions rather than a new persisted or canonical data shape.

## Validation checkpoint

Runtime integration head:

```text
f0b9323c174aff31a6893cc8c487dbbae899c026
```

GitHub Actions test job `94268541659` completed successfully on 2026-08-12.

Exact result:

```text
tests       351
pass        351
fail        0
cancelled   0
skipped     0
todo        0
```

Benchmark from the same green runtime head:

```text
Product: 0.5.900.1
Package: 0.5.900
Account Save: 4
Game State: 5
Data: 19
Benchmark: 1
Codename: Simulation Substrate Gate

create 1,000 player combat profiles:              472.834ms total | 0.472834ms/op
create 1,000 enemy combat profiles:               117.784ms total | 0.117784ms/op
resolve 1,000 basic attacks:                      509.460ms total | 0.509460ms/op
run 10,000 tick dispatches with 5 subscribers:     49.618ms total | 0.004962ms/op
resolve 10,000 direct travel route lookups:      6608.749ms total | 0.660875ms/op
```

GitHub runner still emits the known non-blocking warning that Node-20-targeting checkout/setup actions are being forced under Node 24. Project commands themselves ran with Node 20.20.2.

Documentation closeout commits follow the green runtime head. On continuation, refetch `main` and its current check runs before coding.

## Phase 0.5 exit decision

0.5 is complete because the following commitments now coexist behind tests and an explicit integration gate:

- long fictional activities can fast-forward deterministically, interrupt, and produce day summaries without wall-clock authority;
- canonical original-world IDs and bounded legacy boundaries exist;
- persistent projects and physical/economic/social provenance exist;
- ecology/population/gathering sources deplete and regenerate through canonical time;
- route/scheduled transport connects multiple setting anchors through the same time/interrupt substrate;
- regional content packs establish ownership/dependencies and validators exercise hundreds-record scale;
- historical/reference normalization cannot become canonical merely because it parsed successfully;
- existing Account Save v4 and Game State v5 compatibility remain intact.

## Next target

```text
0.6.100 — Character stats and progression
```

Do **not** start with a broad combat/class rewrite. The first 0.6 unit should establish a canonical continuous-character stat/progression contract behind migration-safe interfaces.

Recommended bounded unit:

1. Audit `player` construction/state, progression engine, stat engine, level/EXP tables, skill cap/progression code, equipment-derived stats, save migrations, and tests to identify ownership boundaries and historical formula dependencies.
2. Define canonical character-owned base/derived/resource stat and progression metadata. Record confidence/provenance where formulas remain transitional rather than pretending historical research is original balance.
3. Preserve current save compatibility through adapters around `player.jobs`, `mainJobId`, `raceId`, `nationId`, and similar persisted/internal names; do not rename them atomically across the whole codebase.
4. Separate character-owned progression from active-discipline caps/modifiers where current code still conflates them.
5. Keep the product law explicit: disciplines describe training; capabilities and concrete prerequisites enable use. Do not make `mainJobId` the universal gate for future mechanics.
6. Add representative canonical tests across Human/Lethari/Miri/Veyra/Korren and multiple disciplines, focusing on deterministic progression/stat ownership rather than final balance numbers.
7. Quarantine FFXI stat-grade/formula modules behind explicit research/reference interfaces where they still feed runtime calculations; migrate incrementally rather than deleting useful research.
8. Version and hand off at a coherent `0.6.100` boundary before opening `0.6.200` capabilities.

## Current transitional technical debt

Treat these as temporary and replace incrementally behind migrations/tested interfaces:

- `mainJobId`, `player.jobs`, `raceId`, `nationId`, and related internal property names;
- historical FFXI stat-grade/formula modules still used by current character calculations;
- sparse placeholder skill-rank math;
- placeholder spell/weapon-skill combat actions;
- small starter equipment/shop/enemy/resource catalogs;
- `places.js` encounter `spawnRules` rather than population-driven encounter selection;
- `places.js` connection records as fallback rather than complete canonical route coverage;
- pack manifests using `catalogRef` while established catalogs are migrated incrementally;
- representative pack recipes/quests/relationships without full player-facing engines;
- minimal sink metadata on some starter materials;
- historical localStorage key names;
- legacy-shaped POI hook IDs;
- `gil` pending deliberate original currency design.

Do not solve these through an unbounded rewrite.
