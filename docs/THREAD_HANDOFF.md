# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Required read order

1. `AGENTS.md`
2. this file
3. `docs/EXECUTION_PIPELINE.md`
4. `docs/DEVELOPMENT_DIRECTION.md`
5. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
6. `docs/ROADMAP.md`
7. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
8. `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md` when Phase 0.9 work is authorized
9. only the architecture/runtime/tests named by the next bounded action

If these checkpoints still match repository state, **do not restart a broad repository audit**.

## Current checkpoint

Phase 0.8 is complete. Phase 0.9 / `0.9.100 Content Scale Gate A` is in progress. Content Pack Scale Contract v2 is merged, and the first authored regional tranche — **Redstone Forge-Road** — is implemented, validated before promotion, version/document synchronized, and awaiting only the final exact-head hosted Check + PR landing.

```text
Product:       0.9.100.2
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          41
Benchmark:     3
Codename:      Redstone Forge-Road
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

### Repository state immediately before this handoff write

```text
main:            68fa9ba483571699e9a448201364381099bd53c8
main protected:  false
PR:              #383 open / draft / mergeable
branch:          feature/0.9.100-redstone-forge-road
pre-handoff tip: beb43e723f5c71bc9595adf21b93948193f8e0bd
```

This file is the **final repository-file write** for the Redstone Forge-Road packet. GitHub-side final validation/readiness/merge occur after this write. If a future thread resumes before/after those operations, refresh PR #383 and `main` instead of guessing final status from this document.

## Frozen implementation/content checkpoint

The exact gameplay/content implementation freeze is:

```text
440a77c542fcc6a6efcce7a45ca989e9068499f8
```

No gameplay/content behavior was changed after this SHA. Later commits only promoted version/system metadata, updated version assertions, and synchronized repository documentation/profile contracts.

Pre-promotion hosted evidence on the frozen implementation SHA:

```text
Check:              32416678697
Job:                96579293377
Node:               24.19.0
Repository Audit:   PASS
Tests:              707/707 passed
Content Census:     success
Benchmark 3:        success
Benchmark Sample:   success
```

## What Redstone Forge-Road implements

The tranche deliberately deepens existing Brasshaven/Redstone authorities instead of bulk-generating disconnected records.

```text
existing Redstone iron / sunstone / Ridge Ibex inputs
  -> existing inventory + provenance
  -> existing forge / production / work-task / work-proficiency authority
  -> forge flux / tempered iron / rivets
  -> wearable work gear / caravan hardware
  -> provenance-qualified Brasshaven commitments
  -> character-owned Redstone techniques/spells
  -> Pack v2 regional ownership
```

Implemented content:

- four character-owned Redstone capabilities:
  - Ridge Breaker
  - Rivet Guard
  - Forge Spark
  - Ironbound Ward
- four executable abilities using the existing ability engine;
- six additional downstream forge outputs, including tempered iron, rivets, work equipment and caravan hardware;
- six additional forge processes connected to existing iron, sunstone, Ridge Ibex recovery, station, work, inventory and provenance authorities;
- three provenance-qualified Brasshaven commitments consuming real forged output;
- `pack-redstone-forge-road`, depending on:
  - `pack-shared-foundation`
  - `pack-redstone-opening`
  - `pack-redstone-ecology-breadth`
- `tests/playerRedstoneForgeRoadFlow.test.js` proving Pack v2 ownership, production/provenance, exactly-once contract consumption/reward behavior, census growth and real Ridge Breaker execution.

No new simulation clock, persistence family, direct timed-task owner, inventory authority, progression meter, social state family, companion system, or bulk import/generation was introduced.

## Continuity regression learned and closed

The first hosted integration run reached 707 tests with 702 passing and five failures.

Four failures were stale baseline assertions caused by the intended pack/ability/census growth.

The real regression was campaign readability: later Forge-Road jobs offered through Varric's already-discovered contact could outrank the established `Copper for the Ring` continuity path.

The repair was made at authored-content placement rather than by weakening recommendation/continuity tests:

```text
Varric Stone
  -> existing Copper for the Ring path remains intact

Mae Oris
  -> later Forge-Road orders
  -> existing 11:00–17:00 fictional-time schedule remains authoritative
```

The original PX4 copper continuity test was left unchanged and passed on the final frozen implementation Check.

## Version decisions

```text
Product       0.9.100.1 -> 0.9.100.2
Package       0.9.100   -> 0.9.100
Data          40        -> 41
Game State    14        -> 14
Account Save  5         -> 5
Benchmark     3         -> 3
```

### Why Data 41

Data 41 adds stable canonical authored abilities/capabilities, production items/processes, commitments, and their source/sink/social/Pack-v2 relationships.

### Why Game State remains 14

The tranche reuses existing character capability/ability, production/work, inventory/provenance, commitment/relationship/schedule, and fictional-time authorities. It adds no new durable player/world fact.

Current promoted system/catalog bookkeeping includes:

```text
versionManifest       0.9.100.2
commitments           0.5.0
productionCatalog     0.3.0
productionItems       0.5.0
regionalContentPacks  0.4.0
capabilities          0.3.0
abilityCatalog        0.2.0
```

## Current content census

Validated canonical gameplay breadth on the frozen implementation Check:

```text
places/localities       26 / mechanics floor 10
named NPCs              12 / 50
shop/service sites      17 / 20
creatures               16 / 40
resource sources        13 / 40
canonical items         56 / 200
recipes/processes       17 / 75
abilities/techniques     9 / 100
quests/contracts        11 / 30
companions                1 / 4
transport services        3 / 5
```

Supplemental infrastructure coverage:

```text
routes                                   7
spell schools                            3
capabilities/training definitions       12
NPC schedules                            4
regional/shared content packs            8
pack-owned records                     140
pack-owned abilities/capabilities/
  schedules/companions                9/12/4/1
```

Mechanics-scale gate remains **NOT READY**. This is correct progression evidence, not a CI failure. Generated fixtures and catalog refs must not be counted as canonical gameplay breadth.

## Benchmark 3 evidence

Single run from Check `32416678697`:

```text
player combat profiles  0.189561 ms/op
enemy combat profiles   0.037361 ms/op
basic attacks            0.002428 ms/op
tick dispatch            0.000569 ms/op
direct route lookup      0.003900 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.184621 ms/op    8.18%
enemy profiles   0.037303 ms/op    5.66%
basic attacks    0.001110 ms/op  138.43%
tick dispatch    0.000492 ms/op   30.77%
route lookup     0.004237 ms/op   11.77%
```

No hard performance threshold is accepted. Benchmark protocol remains 3.

## Closure operation after this handoff

1. Refresh PR #383 and record the exact head produced by this handoff write.
2. Ignore intermediate CI runs from partially synchronized documentation heads.
3. Require the hosted `Check` associated with the **exact final handoff head** to pass:
   - Repository Audit
   - full test suite
   - Content Census
   - Benchmark 3
   - Benchmark Sample
4. Confirm census remains the same unless the exact head unexpectedly contains material changes.
5. If PR #383 is still draft, mark it ready for review.
6. Merge only the exact green head into `main`, using expected-head protection.
7. Refresh `main` and verify the Redstone changes landed.
8. Stop. Do **not** begin Elderwood Hunt-Timber automatically.

No repository file should be changed after this handoff write merely to record the final Check or merge SHA; those GitHub-side facts can be refreshed by the next thread or reported in chat.

## Next bounded unit

**Elderwood Hunt-Timber — NOT STARTED.**

It is the next proposed Gate A authored tranche only after Redstone lands and after a new explicit user continuation.

Preferred connected graph:

```text
named people / schedules / services
  -> hunt + forestry needs
  -> creature recovery / timber-resin sources
  -> hide / wood / resin transformations
  -> equipment / consumables / repair-home inputs
  -> practical techniques / capability access
  -> contracts / trade / relationships
  -> field danger / recovery / provenance
```

Do not start with a global NPC/item/ability quota dump. Places should not be added merely for count because the place mechanics floor is already exceeded.

Following Gate A work remains Starfen Marshcraft-Practical Magic, then Gate A integration/census review.

## Authority decisions to preserve

- canonical fictional simulation time remains separate from wall-clock scheduling;
- Game State 14 remains strict current-schema-only pre-alpha authority;
- content packs own regional/shared identity/dependencies, not gameplay state;
- canonical domain catalogs remain definition authorities;
- generated scale fixtures and Pack ownership counts do not inflate canonical breadth;
- direct timed-task creators remain the existing audited owner set; Redstone adds none;
- production uses existing work/task/proficiency/station/inventory/provenance ownership;
- capabilities remain character-owned and executable abilities use the existing ability engine;
- commitments/relationships/NPC schedules remain existing social authorities;
- `state.npcs`, `state.enemies`, top-level `state.log`, root combat/stat caches and active-battle RNG remain derived/transient as previously classified;
- `state.events` remains persisted structured semantic observation history;
- roadmap sequencing does not authorize the next independent packet automatically.

## Deferred work — do not rediscover

- protected `main` / required Check remains recommended governance work; current `main` is unprotected;
- stale historical remote branch deletion remains manual cleanup debt where no safe delete action exists;
- supported-save migrations remain deferred to the deliberate `0.9.800` transition;
- browser E2E/accessibility remains `0.9.700`;
- hard performance thresholds remain deferred;
- balance certification remains deferred;
- quality/HQ crafting, mounts/warehouses/large logistics and deep romance remain later decisions.

## Do not redo

Closed unless a concrete regression/change directly touches them:

```text
Phase 0.4–0.8 broad discovery
Phase 0.8 exit audit
post-0.8 status audit
late-0.8 persistence classification
Content Pack v2 ownership-gap discovery
catalog-bridge design
Pack v2 generated-scale proof
Redstone Forge-Road substrate discovery
Redstone Varric/Mae continuity diagnosis
cultivation/delegation clock and ownership decisions
```

## Restart protocol

```text
1. refresh current main SHA
2. refresh PR #383 state / final Check / merge state if relevant
3. read this handoff and EXECUTION_PIPELINE
4. confirm Product 0.9.100.2 / Package 0.9.100 / Game State 14 / Data 41
5. confirm the exact final Redstone PR head was green and landed
6. only then select/authorize Elderwood Hunt-Timber
```
