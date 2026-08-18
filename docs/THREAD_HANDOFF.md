# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Required read order

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/DEVELOPMENT_DIRECTION.md`
4. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
5. `docs/ROADMAP.md`
6. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
7. `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`
8. `docs/ARCHITECTURE.md`, `docs/TRANSITIONAL_ARCHITECTURE.md`, `docs/SYSTEM_CATALOG.md`, `docs/QUALITY_GATES.md`, `docs/PERFORMANCE_BUDGET.md`, `docs/RESOURCE_LIFECYCLE.md`, `js/text/version.js`, and systems/tests relevant to the next bounded work order.

## Workflow and pre-alpha policy

Work directly on `main` by default. Use a branch/PR for risky multi-file runtime refactors or when hosted exact-head validation is useful. Treat each prompt as a bounded work order and stop at a coherent checkpoint.

Hearth & Horizon is pre-alpha. Old local saves/accounts are **not** a compatibility requirement. Prefer one clean current schema and one clear authority over compatibility-only migrations, duplicate fields, aliases, lazy reconstruction, or fallback storage keys. A migration is deliberate future engineering work only when explicitly required or independently useful.

Runtime first. Freeze runtime before documentation. Update this handoff last. Report only validation that actually ran.

Autonomous-session discipline from `AGENTS.md` remains binding. If reliable elapsed time is unavailable, use at most six cycles; cycle 6 is stabilization/handoff only.

## Product laws

Working title: **Hearth & Horizon**. FFXI-derived material is legacy research/reference material only.

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

Maps/campaign guidance represent acquired character knowledge. Fictional time is separate from wall-clock scheduling. Resources retain provenance. Companions are persistent NPC-backed people. Commitments/relationships remain separate canonical authorities. Presentation/view models remain derived.

## Current baseline

```text
Product:       0.8.600.12
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     3
Codename:      Warm Benchmark Baseline
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` remain complete and audited. Revisions `.2` through `.12` are maintenance/hardening revisions over the closed `0.8.600` track and do **not** open `0.8.700`.

## Current runtime freeze

The second hardening train ended with PR **#335** (`maintenance/benchmark-warmup-v3`), squash-merged to `main` as:

```text
3de675d60ba46852f193b5cd319df2ce056aa00f
```

The exact validated PR head was:

```text
10ab2c5af9ddcf0760f49817ff5a8c41ec1caa07
Check 32160936491
Node 24.19.0
```

Observed exact-head validation:

```text
tests              527
pass               527
fail               0
cancelled          0
skipped            0
Benchmark 3        success
Benchmark Sample   success
```

Runtime was frozen after promotion of `3de675d60ba46852f193b5cd319df2ce056aa00f`. Cycle-6 commits after that point synchronize documentation only; do not describe those later documentation heads as new runtime validation checkpoints.

## Hardening train `.8`–`.12`

The user authorized continued hardening until input became necessary. Five runtime cycles were promoted, followed by the mandatory sixth-cycle stabilization/handoff.

| Revision | Work | PR | Promoted main commit | Exact-head Check | Tests |
| --- | --- | ---: | --- | ---: | ---: |
| `0.8.600.8` | Long-session evidence | #331 | `8fad34adb0d7db253a6593e7ffbeab3f28c28293` | `32159065893` | 518/518 |
| `0.8.600.9` | Benchmark Protocol V2 | #332 | `7f562e20b335c4fdb449f74a8fd2a48c6378e182` | `32159773159` | 521/521 |
| `0.8.600.10` | Tick subscription ownership | #333 | `cc75d707f3a6ca492a6de6883c7ac59b871836c8` | `32160017162` | 523/523 |
| `0.8.600.11` | DOM root ownership | #334 | `b9d1be0d72cb1bb27d414349bc894726deb6ace3` | `32160575028` | 526/526 |
| `0.8.600.12` | Warm Benchmark Baseline / Benchmark 3 | #335 | `3de675d60ba46852f193b5cd319df2ce056aa00f` | `32160936491` | 527/527 |

Every final PR head passed the full Test gate and the current Benchmark gate before merge. From `.8` onward hosted Check also ran sampled benchmark evidence.

## `0.8.600.8` — Long Session Evidence

Added reusable performance/lifecycle evidence rather than inventing thresholds:

- `scripts/benchmarkSuite.js` centralizes benchmark workloads;
- `scripts/benchmarkSample.js` runs repeated measurements and reports min/median/max/mean/spread;
- `npm run benchmark:sample` and `npm run hardening` are repository entry points;
- hosted Check runs benchmark sampling after Test and Benchmark;
- `tests/longSessionLifecycle.test.js` performs deterministic long-session save/load coverage.

The lifecycle smoke proves:

```text
one active task
  -> repeated save/load keeps one task + one start event
  -> completion reconciles exactly once
  -> save/load
  -> second reconciliation does not duplicate completion
  -> 130 fictional days advance with save/load every 10 days
  -> semantic event history stays bounded at 200
  -> day summaries stay bounded at 120
  -> final time + registry counts survive another save/load
```

This is deterministic retained-state evidence, not a claim about total process memory.

## `0.8.600.9` — Benchmark Protocol V2

The `.8` sampling audit showed several Benchmark 1 labels did not match their measured regions: battle/entity setup, tick subscription setup, and route state creation were included inside timed loops.

Benchmark 2 corrected those boundaries:

- player/enemy profile creation remains measured because creation is the workload;
- basic-attack battles are prepared before timing;
- one tick engine with five steady subscribers is prepared before timing;
- one game state is prepared before direct route lookup timing.

Because the meaning of the measurements changed, Benchmark advanced `1 -> 2`. Historical Phase 0.7 benchmark assertions now require the historical minimum rather than freezing Benchmark 1 forever.

Do **not** compare Benchmark 1 and Benchmark 2 numbers as an optimization result.

## `0.8.600.10` — Subscription Ownership

Fixed a real stale-owner lifecycle defect in `tickEngine`.

A stable subscriber ID may be replaced, but the disposer returned to the old subscriber now removes the subscription only when that exact subscriber record is still current.

```text
A subscribes id X
B replaces id X
A's stale disposer runs
  -> B remains
explicit unsubscribe(X)
  -> current B is removed
```

`tests/tickLifecycle.test.js` guards both behaviors. `liveTick` advanced to `0.2.1`; `lifecycleHarness` advanced to `0.2.0`.

## `0.8.600.11` — DOM Root Ownership

Lower browser layers already exposed cleanup primitives, but `js/main.js` discarded them. `domRoot.js` now owns the active DOM app and onboarding enhancement disposer.

Current lifecycle:

```text
mount
  -> unmount previous resources if any
  -> createDomApp
  -> install onboarding enhancement observer

unmount
  -> dispose onboarding observer
  -> domApp.destroy
      -> remove host/window listeners
      -> stop movement interval
```

Unmount is idempotent. If enhancement installation throws, the newly created app is destroyed and the root remains unmounted. `tests/domRootLifecycle.test.js` guards remount cleanup, repeated unmount, and failed-install cleanup.

`lifecycleHarness` advanced to `0.3.0`; `domRoot` registered at `0.1.0`.

## `0.8.600.12` — Warm Benchmark Baseline / Benchmark 3

Repeated Benchmark 2 samples showed very high relative noise in the shortest microbenchmarks. Benchmark 3 adds an explicit warm-up rather than converting noisy timing into a false threshold.

Current protocol:

- each workload warms up with 10% of its measured iteration count, minimum one;
- warm-up occurs before the timer;
- warm-up uses a separate setup context so mutable workloads do not contaminate measured fixtures;
- warm-up time is not reported;
- every sampled measurement performs its own warm-up.

Benchmark advanced `2 -> 3` because the measurement protocol changed. `performanceHarness` is `0.3.0`.

Single Benchmark 3 run from Check `32160936491`:

```text
1,000 player combat profiles   0.355492 ms/op   warmup=100
1,000 enemy combat profiles    0.066399 ms/op   warmup=100
1,000 basic attacks            0.002787 ms/op   warmup=100
10,000 steady tick dispatches  0.000923 ms/op   warmup=1000
10,000 direct route lookups    0.008017 ms/op   warmup=1000
```

Three-sample evidence from the same exact-head gate:

```text
player profiles  median 0.359021 ms/op   spread   7.97%
enemy profiles   median 0.068446 ms/op   spread  11.71%
basic attacks    median 0.000951 ms/op   spread 191.11%
tick dispatch    median 0.000646 ms/op   spread  61.69%
route lookup     median 0.007238 ms/op   spread   5.16%
```

**No hard performance threshold is accepted yet.** Basic attack and tick dispatch are so short that hosted timing noise remains a large share of the measurement. Player/enemy profile creation and route lookup are more stable, but additional repeated evidence is still required before release budgets are adopted.

Benchmark 1, 2, and 3 are separate comparability protocols. Do not describe lower Benchmark 3 values as direct improvement over earlier protocols.

## Earlier maintenance `.3`–`.7`

The preceding maintenance train remains authoritative history:

| Revision | Contract | Promoted main commit |
| --- | --- | --- |
| `.3` | canonical command contract; FFXI runtime command adapter/aliases removed | `c1fbfbe2629aee628cba4e60af3bed37bef86f7a` |
| `.4` | strict current Game State 6 persistence before revival | `ba3f38f05c83175f188b0231c175a89c9310309f` |
| `.5` | commitment delivery consumes canonical carried inventory | `0b62b13b25297acad853c2b17be8ffb86a63419f` |
| `.6` | ActionResult `.message`/`.reason` compatibility aliases removed | `268e17f4c5d8de08d1ea2fc68f6017371df4627a` |
| `.7` | Node 24/current Actions + architecture-debt guards | `f56b2f6f50d481f46babf80b47e13c70672d9176` |

The `.2` Current Schema Cleanup preceded those revisions and advanced Account Save `4->5`, Game State `5->6`, and Data `36->37` while removing inherited persistence/home identifiers and obsolete active save migration.

## Stable authority boundaries to preserve

- one fictional-time/task/interrupt substrate;
- strict current-schema persistence during pre-alpha unless compatibility is explicitly requested;
- runtime `ensure*` helpers do not make incomplete persisted saves loadable;
- inventory owns container unlock/access/capacity/transfer and carried-item facts;
- carried inventory/load derives from container definitions, not consumer-specific container lists;
- home infrastructure composes project/inventory/furnishing/workstation authorities rather than creating parallel stores or timers;
- transport owns fares/cadence/departure/arrival/service allowance and independently derives carried load;
- projects own material + labor + completion state;
- `workstationEngine` owns workstation-context derivation;
- `productionEngine` owns recipe requirements/work/inputs/outputs/provenance/mastery;
- campaign recovery remains the single player/party recovery authority;
- recovery never silently changes active party membership;
- commitments remain separate from relationships and Journal projection;
- NPC schedules are recurring availability evaluated against canonical fictional time, never a second clock/state registry;
- maps/routes/resources/contacts/search preserve acquired-knowledge privacy;
- player-facing browser information describes what the character sees, knows, carries, remembers, needs, or can decide;
- canonical ActionResult logic uses structured semantic fields, not prose parsing;
- wall-clock subscriptions/listeners/observers require explicit lifecycle owners and stale-owner-safe disposal;
- Benchmark protocol changes require a Benchmark version bump when comparability changes;
- legacy FFXI-derived records remain bounded research/reference material, not canonical world identity.

## Known non-blocking debt / future hardening

### Terminal timed-task retention is not solved

`timedTaskEngine` currently retains terminal task records. A generic retention cap/prune was audited during this hardening train and intentionally **not** implemented.

Several domain records can remain active while their linked task is already terminal and later reconcile through `findTimedTask(taskId)`. Blind central pruning could therefore orphan project/work/resource-recovery/transport/ability or other domain reconciliation.

The next task-retention design must first answer, per domain:

```text
when does the domain stop needing the linked terminal task?
who clears/releases that task reference?
what must survive save/load after release?
how is exactly-once reconciliation proved before compaction?
```

Only after domain release semantics exist should generic task-history compaction or retention limits be added. Do not duplicate task state into consumers and do not reconstruct missing terminal tasks as a compatibility workaround.

Other carried debt:

- internal implementation names such as `player.jobs`, `races`, or `nations` remain in some non-player-facing modules; refactor only when a bounded authority improvement warrants it;
- original currency terminology remains deferred;
- NPC schedules remain static-location recurring availability; autonomous multi-location pathfinding is future work;
- enemy tactical/content breadth remains representative rather than deep;
- broad quest/romance/social-life content remains shallower than long-term design;
- no passive/offline companion healing or autonomous companion routine exists, deliberately;
- regional content breadth/balance remains pre-alpha;
- no browser heap/profiler run was claimed in this train; deterministic lifecycle tests are the observed evidence.

## Cycle-6 documentation synchronization

After runtime freeze at `3de675d60ba46852f193b5cd319df2ce056aa00f`, Cycle 6 updated documentation only:

- `docs/PERFORMANCE_BUDGET.md` — accepted Benchmark 3 protocol, exact gate, sample variance, no thresholds;
- `docs/RESOURCE_LIFECYCLE.md` — 130-day smoke, tick ownership, DOM root ownership, deferred task-retention seam;
- `docs/ROADMAP.md` — baseline and `.8`–`.12` history;
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — Benchmark 1/2/3 comparability history and current versions;
- `docs/ARCHITECTURE.md` — root lifecycle, long-session evidence, Benchmark 3 guardrails;
- `PROJECT_PROFILE.yaml` — current hardening/benchmark/lifecycle validation entry points;
- this handoff last.

These documentation commits were not followed by a new runtime validation run and must not be presented as runtime checkpoints.

## Next work

**Do not automatically begin `0.8.700`.** A fresh user work order is required because this session reached the six-cycle autonomous stabilization boundary.

If continuing maintenance/hardening, the strongest known bounded seam is:

```text
domain-owned terminal task release/reconciliation audit
  -> identify one or more task-linked domain owners
  -> define safe release point after exactly-once reconciliation
  -> prove save/load behavior
  -> only then consider bounded generic task-history retention
```

Audit before implementation; do not assume the correct solution is a global prune.

If returning to Phase 0.8 feature work, strong candidate families remain:

- agriculture/stewardship;
- earned automation that reduces already-established chore attention through investment/mastery;
- further companion/social-life breadth only where a concrete player decision and existing authority path justify it;
- another life/logistics segment only when a specific current defect/opportunity warrants it.

A new user message is required before starting another implementation cycle.
