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
Product:       0.8.600.17
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     3
Codename:      Bounded Task Retention
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
```

Relevant system versions:

```text
performanceHarness    0.3.0
lifecycleHarness      0.8.0
timedTasks            0.2.0
campaignRecovery      0.3.0
workTasks             0.2.0
projects              0.2.0
transport             0.4.0
abilityEngine         0.3.0
resourceOpportunities 0.2.0
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` remain complete and audited. Revisions `.2` through `.17` are maintenance/hardening revisions over the closed `0.8.600` track and **do not** open `0.8.700`.

## Current runtime freeze

The terminal-task ownership hardening train ended with PR **#340** (`maintenance/bounded-task-retention-soak`), squash-merged to `main` as:

```text
e4ebdbc14776329156f2df2dee8c598e3b8b91cb
```

The exact validated PR head was:

```text
666d2f432c3db097012ef035d2e4655405c5747d
Check 32168023319
Node 24.19.0
```

Observed exact-head validation:

```text
tests              534
pass               534
fail               0
cancelled          0
skipped            0
Benchmark 3        success
Benchmark Sample   success
```

Latest Benchmark 3 single-run evidence:

```text
1,000 player combat profiles   0.379708 ms/op
1,000 enemy combat profiles    0.071495 ms/op
1,000 basic attacks            0.003396 ms/op
10,000 steady tick dispatches  0.000927 ms/op
10,000 direct route lookups    0.007520 ms/op
```

Latest three-sample medians/spreads:

```text
player profiles  median 0.359505 ms/op   spread   6.21%
enemy profiles   median 0.070873 ms/op   spread  10.10%
basic attacks    median 0.001285 ms/op   spread 189.74%
tick dispatch    median 0.000798 ms/op   spread  28.18%
route lookup     median 0.007662 ms/op   spread   6.59%
```

**No hard performance threshold is accepted yet.** Benchmark 1, 2, and 3 are separate comparability protocols; do not describe numeric changes across those protocol versions as direct optimization results.

Documentation-only synchronization after the runtime merge does not create a new runtime validation checkpoint.

## Terminal-task ownership hardening `.13`–`.17`

| Revision | Contract | PR | Promoted main commit | Exact-head Check | Tests |
| --- | --- | ---: | --- | ---: | ---: |
| `0.8.600.13` | terminal-only release API + campaign recovery owner reconciliation | #336 | `be8db394e81da0e2aa96069efb7df51cd0b68b9b` | `32162369191` | 529/529 |
| `0.8.600.14` | work/project terminal release after durable transition | #337 | `f7d51365f13fa1cb703383ec4799934e07a3f90f` | `32162896278` | 533/533 |
| `0.8.600.15` | transport arrival/cancellation terminal release | #338 | `588d6dd0e0a882a6cfdc76d60797c0488330141d` | `32163232356` | 533/533 |
| `0.8.600.16` | ability/resource recovery terminal release | #339 | `67ec4ea8ae19b1032894a604ed372802d794cf92` | `32163982824` | 533/533 |
| `0.8.600.17` | mixed repeated retention soak across real save/load | #340 | `e4ebdbc14776329156f2df2dee8c598e3b8b91cb` | `32168023319` | 534/534 |

Every exact PR head passed Test, Benchmark 3, and Benchmark Sample before promotion.

### Current timed-task release contract

`releaseTimedTask(state, taskId)` is terminal-only:

- active tasks cannot be released;
- release removes the task record but does not rewind `nextSequence`;
- task IDs remain monotonic and are never reused;
- domain records/results/events may keep `taskId` as historical correlation after the task record is gone.

A domain owns the release point. It may release only **after** every durable consequence it needs has been copied/committed and the exactly-once semantic transition has been recorded.

Current release owners:

- campaign recovery — after recovery consequence/event reconciliation;
- work — after completed, failed, awaiting-storage, or cancelled transition/event;
- projects — after completion/cancellation transition/event;
- transport — after arrival/cancellation updates travel/location and emits the semantic event;
- abilities — after resolution/cooldown/effects or interruption state/event;
- resource recovery — after recovered/failed-storage outcome and completion event.

An unreconciled terminal task is intentionally retained across save/load until the owner consumes it. Campaign recovery has a direct save/load proof for this boundary.

### Mixed retention soak

`tests/longSessionLifecycle.test.js` now includes a mixed owner-managed retention test against one persisted state.

```text
one completed generic/unowned terminal task retained as baseline
  -> work completes/releases
  -> project starts
  -> real account save/load while project task is active
  -> project completes/releases
  -> route travel arrives/releases
  -> timed ability resolves/releases
  -> resource recovery resolves/releases
  -> save/load
  -> repeat three cycles
```

After every owner-managed lifecycle, the timed-task registry returns to exactly the one intentional generic-terminal baseline record. The generic record remains present, proving owner-gated release is not a blind global prune.

## Earlier hardening context

The immediately preceding `.8`–`.12` train established:

- deterministic 130-day save/load lifecycle evidence;
- Benchmark Protocol V2 with setup removed from timed attack/tick/route workloads;
- stale-safe tick subscription ownership;
- explicit DOM-root app/observer teardown;
- Benchmark 3 separate-context warm-up and sampled evidence.

The `.2`–`.7` maintenance train established current-schema cleanup, canonical command/action contracts, strict current-schema persistence, carried commitment delivery, Node 24/current Actions, and executable debt guards.

See `docs/ROADMAP.md` and `docs/VERSIONING_AND_RELEASE_ROADMAP.md` for the full revision table.

## Stable authority boundaries to preserve

- one fictional-time/task/interrupt substrate;
- strict current-schema persistence during pre-alpha unless compatibility is explicitly requested;
- runtime `ensure*` helpers do not make incomplete persisted saves loadable;
- inventory owns container unlock/access/capacity/transfer and carried-item facts;
- carried inventory/load derives from container definitions, not consumer-specific container lists;
- home infrastructure composes project/inventory/furnishing/workstation authorities rather than creating parallel stores or timers;
- transport owns fares/cadence/departure/arrival/service allowance and independently derives carried load;
- projects own material + labor + completion state;
- work authorities own their durable completion/failure/storage/cancellation records;
- terminal timed-task release belongs to the domain after exactly-once reconciliation, not to a blind central prune;
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

### Generic/unowned terminal task history is now the only remaining task-retention question

Known gameplay/domain owners return terminal tasks to steady state. The generic timed-task authority still retains a completed/cancelled task when no domain owner releases it.

Do **not** add an age/count prune automatically. First audit concrete generic task producers/consumers and decide whether such records are needed for diagnostics/history at all. If a bounded generic history policy is justified, it must:

```text
preserve all active tasks
never substitute for domain reconciliation
never cause task-id reuse
remain deterministic across save/load
have explicit evidence for its retention rule
```

If no meaningful generic history consumer exists, deletion-at-owner or explicit caller release may remain preferable to central compaction.

Other carried debt:

- internal implementation names such as `player.jobs`, `races`, or `nations` remain in some non-player-facing modules; refactor only when a bounded authority improvement warrants it;
- original currency terminology remains deferred;
- NPC schedules remain static-location recurring availability; autonomous multi-location pathfinding is future work;
- enemy tactical/content breadth remains representative rather than deep;
- broad quest/romance/social-life content remains shallower than long-term design;
- no passive/offline companion healing or autonomous companion routine exists, deliberately;
- regional content breadth/balance remains pre-alpha;
- no browser heap/profiler run was claimed; deterministic lifecycle tests are the observed retention evidence;
- `docs/SYSTEM_CATALOG.md` remains secondary/historical where it conflicts with runtime/version/handoff authority.

## Next work

**Do not automatically begin `0.8.700`.** A fresh feature work order should re-audit one bounded Phase 0.8 seam before implementation.

If continuing maintenance/hardening, the next bounded audit is:

```text
generic/unowned terminal task history policy
  -> enumerate actual generic task producers/consumers
  -> determine whether terminal history has a real diagnostic/runtime consumer
  -> if yes, define a bounded deterministic retention rule
  -> if no, prefer explicit caller/owner release over central history machinery
  -> prove save/load + active-task preservation before promotion
```

Do not implement a global prune before that audit establishes a concrete requirement.

If returning to Phase 0.8 feature work, strong candidate families remain:

- agriculture/stewardship;
- earned automation that reduces already-established chore attention through investment/mastery;
- further companion/social-life breadth only where a concrete player decision and existing authority path justify it;
- another specific life/logistics seam only when current runtime evidence identifies a real gap.
