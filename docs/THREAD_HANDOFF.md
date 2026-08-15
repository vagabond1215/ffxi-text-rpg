# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Required read order

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/DEVELOPMENT_DIRECTION.md`
4. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
5. `docs/ROADMAP.md`
6. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
7. Relevant architecture/runtime/data/tests, especially `docs/ARCHITECTURE.md`, `docs/LOCALITY_AND_EXPLORATION_MODEL.md`, `docs/QUALITY_GATES.md`, `docs/PERFORMANCE_BUDGET.md`, and `js/text/version.js`.

## Workflow

Work directly on `main` by default. Treat each prompt as a bounded work order. Follow the `AGENTS.md` autonomous-session guardrail and update this handoff at the end of substantive work.

This repository remains early/single-maintainer pre-alpha development. Incremental commits may temporarily fail while a bounded unit is assembled, but coherent milestone checkpoints should be validated and known failures recorded. Do not create routine branches/PRs unless explicitly requested or later repository protection requires them.

## Product laws

Working title: **Hearth & Horizon**. Earlier FFXI-derived material is legacy research/reference/migration material, not canonical world content.

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

```text
Use fine movement where movement itself creates decisions.
Use named localities and actions where destinations and relationships create decisions.
```

Maps represent acquired character knowledge, not omniscient authored geography. Authored coordinates remain simulation/internal data. Resources have physical/economic/social provenance. Canonical fictional time is separate from wall-clock scheduling. Companions are persistent world characters, not summons.

## Current baseline

```text
Product:       0.6.900.1
Package:       0.6.900
Account Save:  4
Game State:    5
Data:          26
Benchmark:     1
Codename:      Integrated Mechanics Gate
Compatibility: migrate-supported-save-versions
```

**Phase 0.6 is complete. Phase 0.7 is next. No Phase 0.7 implementation has started.**

Authoritative coherent runtime/version checkpoint:

```text
58fed55122d8058152c70c8e7b3b2565d2cbeaf9
Test integrated mechanics gate version manifest
```

Documentation-only synchronization follows that green runtime checkpoint.

## Completed Phase 0.6 sequence

- `0.6.100` continuous-character stats/progression — Data 19.
- `0.6.200` character-owned skills/proficiencies/capabilities — Data 20.
- `0.6.250` semantic DOM player-interface architecture — Data 20.
- `0.6.300` original magic and active ability engine — Data 21.
- `0.6.400.2` Combat 2.0 — Data 22.
- `0.6.450` locality/exploration navigation — Data 22.
- `0.6.500` equipment and field-tool breadth — Data 23.
- `0.6.600` gathering/hunting/processing/crafting/cooking/salvage — Data 24.
- `0.6.700` ecology/regional creature/resource breadth — Data 25.
- `0.6.800` persistent companion/party foundation — Data 26.
- `0.6.900` integrated-mechanics exit gate — Data 26.

## 0.6.900 integrated mechanics gate — complete

Primary additions:

```text
js/text/systems/integratedMechanicsGate.js
tests/integratedMechanicsGate.test.js
```

The executable gate groups the completed mechanics contract into:

```text
persistenceAndNormalization
fictionalTimeAndInterrupts
continuousCharacterOwnership
combatPartyWorkTravel
provenanceAndProduction
semanticUiAuthority
worldAndContentValidation
phaseExitReadiness
```

It consumes existing state/world/catalog/content-pack validators and subsystem/database versions rather than becoming a second mechanics authority.

### Additive persistence proof

`validateAdditiveStateNormalization()` creates a current Game State 5 fixture, removes major additive runtime registries, and lazily reconstructs:

```text
simulation
tasks
events
abilities
party
projects
resourceOpportunities
ecology
work
```

The resulting state remains Game State 5 and passes current-state validation. No ordered Game State migration was required for the Phase 0.6 closure.

### Continuous-character equipment correction

The exit audit found canonical starter equipment still carrying active-discipline `allowedJobs` restrictions. Those authored gates were removed. Canonical starter/original equipment now defaults to unrestricted discipline eligibility and relies on possession/loadout/concrete requirements.

The generic `allowedJobs` field remains supported at explicit legacy/migration/compatibility boundaries, with a dedicated legacy test fixture proving that adapter behavior. Do not reintroduce active discipline as a universal equipment gate.

### Companion authority cleanup

The old `companion` command/POI route now resolves canonical companion definitions and delegates recruitment to `partyEngine`. It is an adapter, not authority. Focused testing proves repeated command recruitment produces only one persistent companion and one recruitment semantic event.

The unrelated Thornwall Southgate guide that previously duplicated **Mara Venn** is now **Sera Talwin**. Its stable legacy-shaped POI ID remains intact for compatibility.

Legacy POI presentation helpers were also sanitized: they no longer print authored coordinates or `sourcePosition` values. Internal coordinates/source positions remain valid simulation data only.

### Gate validation coverage

The gate directly checks or composes:

- current game-state and additive normalization validity;
- world-time, simulation control/interrupt, task, day-cycle, ability, combat, project, work, and transport subsystem readiness;
- character stats/progression/capabilities/skills/work-proficiency ownership;
- canonical authored equipment absence of active-discipline hard gates;
- battle/party/travel/locality/gathering/production readiness;
- resource provenance/opportunity/recovery/ecology/production contracts;
- semantic events, game view models, UI intents, DOM UI, and command adapter presence;
- world/ecology/route/production/companion/content-pack validation;
- required Phase 0.6 database contracts;
- Product `0.6.900.1` and Data 26 exit readiness.

## Persistence/version decision

`0.6.900` completed at Product `0.6.900.1`, Package `0.6.900`, while these remain unchanged:

```text
Account Save 4
Game State   5
Data         26
Benchmark    1
```

Relevant new/confirmed system version:

```text
versionManifest          0.6.900.1
integratedMechanicsGate  0.1.0
```

No Data bump was justified because the track repaired and validated existing Data 26 authority rather than introducing a new canonical authored-data shape.

## Validation checkpoint

At runtime/version head `58fed55122d8058152c70c8e7b3b2565d2cbeaf9`:

```text
tests       453
pass        453
fail        0
cancelled   0
skipped     0
todo        0
```

Build/deploy checks all completed successfully:

```text
test                  success
build                 success
report-build-status   success
deploy                success
```

Benchmark 1 at `0.6.900.1`:

```text
create 1,000 player combat profiles:              445.494 ms | 0.445494 ms/op
create 1,000 enemy combat profiles:               120.615 ms | 0.120615 ms/op
resolve 1,000 basic attacks:                      563.579 ms | 0.563579 ms/op
run 10,000 tick dispatches with 5 subscribers:     44.241 ms | 0.004424 ms/op
resolve 10,000 direct travel route lookups:      8660.062 ms | 0.866006 ms/op
```

Compared with the same Benchmark 1 workload at `0.6.800`, the measurements are broadly stable; no performance blocker was identified.

The recurring GitHub Actions warning about Node 20 action-runtime deprecation remains warning-only. Actions targeting Node 20 are forced through Node 24 internally while `setup-node` installs Node 20.20.2 for project tests/benchmarks.

## Stable Phase 0.6 authority boundaries

Do not casually reopen these while building Phase 0.7:

- one canonical fictional-time/task/interrupt substrate;
- continuous-character ownership of stats, learned skills/capabilities, and work mastery;
- active discipline is training/context, not universal use identity;
- semantic DOM/view-model/intents are normal browser presentation/action direction;
- command/slash routes are compatibility or power-user adapters;
- map presentation is acquired knowledge; raw coordinates and hidden authored extent remain private;
- resource acquisition/transformation/rewards preserve provenance and source/sink reasoning;
- companions are persistent NPC-backed people whose active party state composes with Combat 2.0 and travel;
- content-pack ownership/dependencies and cross-reference validation are the scale mechanism;
- additive Game State 5 normalization remains preferred over unnecessary save-version churn.

## Compatibility / deferred depth

Preserve deliberately unless directly in scope:

- `gil` remains current currency terminology until deliberate original currency design.
- Historical localStorage keys remain for save compatibility.
- Legacy-shaped POI stable IDs remain where catalogs/adapters depend on them.
- `player.jobs`, `mainJobId`, `raceId`, `nationId`, and related internal/persisted names remain compatibility seams.
- Historical FFXI research modules remain bounded reference surfaces.
- Canvas modules remain regression/reference code; active browser UI is semantic DOM.
- Some DOM information views still bridge command output until dedicated presentation models exist.
- Search-or-act remains command-capable rather than true fuzzy cross-entity/action search.
- `places.js` spawn rules and some place-connection fallbacks remain transitional seams.
- Explicit legacy equipment `allowedJobs` records may still be accepted at compatibility boundaries, but canonical authored equipment must not use active discipline as a universal gate.
- Legacy combat cast/weapon-technique adapters remain bounded compatibility surfaces.
- High-resolution shaped exploration cartography remains deferred.
- Companion tactical/dialogue/equipment/progression breadth remains limited; only one representative recruitable companion proves the foundation.
- Achievements, key-item depth, mounts, larger relationship/social systems, and broad authored content remain later work rather than Phase 0.6 blockers.

## Phase 0.7 entry contract

Phase 0.7 is **Multi-region playable alpha**. It must turn the proven mechanics into sustained ordinary play rather than create a new parallel mechanics foundation.

A credible playable-alpha campaign must eventually provide:

- several connected settlements/regions with meaningful travel reasons/costs/risks;
- persistent named NPC communities with shops/services, contracts/quests, relationship/reputation hooks, and companions;
- regional ecology/resources tied to work/production/trade sinks plus adventure/social hooks;
- combat, abilities, party, work, travel, scheduled transport, day review, recovery, and production coexisting in one save under the same fictional-time contract;
- ordinary campaign actions reachable from semantic browser UI without test-only setup or command expertise;
- save/resume and supported migrations across the campaign;
- green world/content-pack/source-sink/database validation as content grows;
- enough alternative short-term goals and repeatable loops that play feels like a sandbox rather than one linear systems demo.

## Next bounded target — 0.7.100 playable campaign slice

No `0.7.100` code has started.

Recommended first unit:

1. choose one connected regional corridor using existing anchors rather than inventing a new world slice unnecessarily;
2. audit current NPC/quest/relationship/shop/economy/UI seams needed for an ordinary player to complete a small campaign loop;
3. define one end-to-end player flow: settlement service/social contact -> contract/goal -> travel -> regional livelihood or danger/combat -> recovery/production/trade -> return/resolution;
4. expose that flow through semantic browser UI, using commands only as bounded adapters;
5. add only reusable primitives proven missing by the slice; do not introduce replacement quest/economy/dialogue clocks or state models;
6. author enough original NPC/content around the slice to make it repeatable and socially/economically legible;
7. preserve provenance, map privacy, companion identity, fictional time, exactly-once ownership, content-pack validation, and save compatibility;
8. validate/version/benchmark/document at a coherent `0.7.100` boundary before broad content multiplication.
