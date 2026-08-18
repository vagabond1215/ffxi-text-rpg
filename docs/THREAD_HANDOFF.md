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
8. `docs/ARCHITECTURE.md`, `docs/TRANSITIONAL_ARCHITECTURE.md`, `docs/SYSTEM_CATALOG.md`, `docs/QUALITY_GATES.md`, `docs/PERFORMANCE_BUDGET.md`, `docs/RESOURCE_LIFECYCLE.md`, `PROJECT_PROFILE.yaml`, `js/text/version.js`, and systems/tests relevant to the next bounded work order.

## Workflow and pre-alpha policy

Work directly on `main` by default. Use a branch/PR for risky multi-file runtime refactors or when hosted exact-head validation is useful. Treat each prompt as a bounded work order and stop at a coherent checkpoint.

Hearth & Horizon is pre-alpha. Old local saves/accounts are **not** a compatibility requirement. Prefer one clean current schema and one clear authority over compatibility-only migrations, duplicate fields, aliases, lazy reconstruction, or fallback storage keys. A migration is deliberate future engineering work only when explicitly required or independently useful.

Runtime first. Freeze runtime before documentation. Update this handoff last. Report only validation that actually ran.

Autonomous-session discipline remains binding: when elapsed-time enforcement is unavailable, use at most six cycles; cycle 6 is stabilization/handoff only.

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
Product:       0.8.600.22
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     3
Codename:      Active Task Persistence Matrix
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
```

Relevant system versions:

```text
performanceHarness    0.3.0
lifecycleHarness      0.13.0
timedTasks            0.2.0
campaignRecovery      0.3.0
workTasks             0.2.0
projects              0.2.0
transport             0.4.1
abilityEngine         0.3.0
resourceOpportunities 0.2.0
validation            0.14.0
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` remain complete and audited. Revisions `.2` through `.22` are maintenance/hardening revisions over the closed `0.8.600` track and **do not** open `0.8.700`.

## Current runtime freeze

The current task-integrity hardening train ended with PR **#345** (`maintenance/active-task-persistence-matrix`), squash-merged to `main` as:

```text
7a148ebdff594523f956ed6be83aba59e26d564f
```

The exact validated PR head was:

```text
be561e922f1b0316727e13a91381595418b956e2
Check 32171224914
Node 24.19.0
```

Observed exact-head validation:

```text
tests              550
pass               550
fail               0
cancelled          0
skipped            0
Benchmark 3        success
Benchmark Sample   success
```

Benchmark 3 single-run evidence from that gate:

```text
1,000 player combat profiles   0.394555 ms/op
1,000 enemy combat profiles    0.071987 ms/op
1,000 basic attacks            0.003521 ms/op
10,000 steady tick dispatches  0.001158 ms/op
10,000 direct route lookups    0.007919 ms/op
```

Three-sample medians/spreads:

```text
player profiles  median 0.364139 ms/op   spread   7.99%
enemy profiles   median 0.070800 ms/op   spread  11.17%
basic attacks    median 0.001303 ms/op   spread 219.89%
tick dispatch    median 0.000713 ms/op   spread  18.43%
route lookup     median 0.007434 ms/op   spread   6.93%
```

**No hard performance threshold is accepted yet.** Benchmark 1, 2, and 3 are separate comparability protocols; do not describe numeric changes across protocol versions as direct optimization results.

Runtime was frozen after promotion of `7a148ebdff594523f956ed6be83aba59e26d564f`. Cycle-6 commits after that point synchronize documentation only and are not new runtime validation checkpoints.

## Task-integrity hardening `.18`–`.22`

| Revision | Contract | PR | Promoted main commit | Exact-head Check | Tests |
| --- | --- | ---: | --- | ---: | ---: |
| `0.8.600.18` | Task Owner Guard: direct production task creators restricted to six audited release owners; managed lifecycle steady state reaches zero retained tasks | #341 | `6dbea79abd82dab5b4dc9e1b141a409383937530` | `32169108628` | 535/535 |
| `0.8.600.19` | Strict Active Travel: remove runtime legacy reconstruction; require Travel State 2 and matching persisted travel task | #342 | `fcd435c0c3802c7301670a4c48700def1c2465e7` | `32169787083` | 539/539 |
| `0.8.600.20` | Active Task Link Integrity: active project/work/ability/resource records require matching persisted tasks | #343 | `2c11cda829c407dea6564c4eb622e17238f8dc4c` | `32170142917` | 543/543 |
| `0.8.600.21` | Strict Task Registry: validate persisted task registry version/records/status/timing/duplicates/sequence before revival | #344 | `8c3995d8957dfa3a9542688d9cc8dc79e69a1903` | `32170589178` | 547/547 |
| `0.8.600.22` | Active Task Persistence Matrix: positive save/load/reconcile/release evidence across all six audited task owners | #345 | `7a148ebdff594523f956ed6be83aba59e26d564f` | `32171224914` | 550/550 |

Every final PR head passed Test, Benchmark 3, and Benchmark Sample before promotion.

## Current timed-task authority

Direct production `startTimedTask()` ownership is currently limited by `tests/architectureDebtGuard.test.js` to:

```text
abilityEngine.js
campaignRecoveryEngine.js
projectEngine.js
resourceOpportunityEngine.js
transportEngine.js
workTaskEngine.js
```

Each direct owner must depend on `releaseTimedTask`.

Lifecycle law:

```text
owner starts task
  -> active owner record references task
  -> task reaches completed/cancelled
  -> owner commits durable consequence + exactly-once semantic transition
  -> owner releases terminal task
  -> task record disappears
  -> durable owner record/event may retain historical taskId
```

`releaseTimedTask` rejects active tasks and never rewinds `nextSequence`; released task IDs are not reused.

Production-style repeated owner lifecycles return the timed-task registry to **zero retained task records** after reconciliation. A deliberately low-level generic terminal task remains retained in the long-session test because the generic engine does not perform blind global pruning.

There is currently **no production generic/unowned timed-task producer**, so there is no accepted generic history cap or global task-prune policy.

## Current-schema task/travel integrity

Game State 6 raw validation now occurs before runtime normalization and enforces:

- complete required persisted structure;
- timed-task registry version, IDs, statuses, timing/data shape, duplicate detection, and monotonic `nextSequence`;
- active Travel State 2 plus matching task kind/channel/endpoints/deadline;
- active project -> matching `project.labor` task;
- active work -> matching `work.<kind>` task;
- active timed ability -> matching `ability.activation` task;
- active resource recovery -> matching `resource.recovery` task.

An active owner may reference an active task or a just-completed task awaiting owner reconciliation. A terminal owner record may retain historical `taskId` after terminal task release.

Malformed, orphaned, or legacy-shaped active task/travel state is rejected rather than repaired. `transportEngine` no longer reconstructs legacy active travel or manufactures replacement tasks during runtime access.

Positive current-schema persistence evidence exists across all six owners:

- campaign recovery — completed task survives save/load until owner reconciliation, then releases exactly once;
- projects — active labor survives save/load and later releases;
- transport — active journey survives save/load with the same task and later releases;
- work — active work survives save/load, completes once, releases, and remains released after reload;
- timed ability — active activation survives save/load, resolves once, releases, and remains released after reload;
- resource recovery — active recovery preserves task and persisted outcome rolls through save/load, resolves once, releases, and remains released after reload.

## Earlier hardening context

The `.13`–`.17` train introduced owner-gated terminal release across campaign recovery, work/projects, transport, abilities/resource recovery, followed by a mixed retention soak.

The `.8`–`.12` train established deterministic 130-day save/load evidence, benchmark sampling/protocol corrections, stale-safe tick subscription ownership, DOM root cleanup, and Benchmark 3 warm-up.

The `.2`–`.7` train established current-schema cleanup, canonical command/action contracts, strict Game State 6 structure, carried commitment delivery, Node 24/current Actions, and executable compatibility-debt guards.

See `docs/ROADMAP.md` and `docs/VERSIONING_AND_RELEASE_ROADMAP.md` for the full revision history.

## Stable authority boundaries to preserve

- one fictional-time/task/interrupt substrate;
- strict current-schema persistence during pre-alpha unless compatibility is explicitly requested;
- raw current-schema validation runs before runtime normalization;
- runtime `ensure*` helpers do not make incomplete persisted saves loadable;
- direct timed-task creators require explicit domain ownership, exactly-once reconciliation, and terminal release;
- do not add blind global task pruning without a concrete generic producer/history requirement;
- inventory owns container unlock/access/capacity/transfer and carried-item facts;
- carried inventory/load derives from container definitions, not consumer-specific container lists;
- home infrastructure composes project/inventory/furnishing/workstation authorities rather than creating parallel stores or timers;
- transport owns fares/cadence/departure/arrival/service allowance and independently derives carried load;
- projects own material + labor + completion state;
- work authorities own durable completion/failure/storage/cancellation records;
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

The timed-task retention/ownership seam is substantially closed. Do not continue adding generic task-history machinery without new evidence.

The strongest next persistence-hardening family is broader **current-schema registry validator composition**. Several required persisted registries are structurally required at the raw boundary, but not every subsystem validator is necessarily composed there yet.

Proceed one bounded registry family at a time. Before tightening rejection behavior, classify the state as:

```text
persistent required authority
  -> validate before revival

derived/transient
  -> recompute freely

construction convenience
  -> initialize in new-game/factory paths, not as an implicit load migration
```

Likely audit candidates include projects, commitments/relationships, resource opportunities, ecology, abilities, and party state, but do not assume every existing validator should simply be called wholesale. Inspect current factories, real save/load callers, and historical lazy-initialization tests first.

Other carried debt:

- internal implementation names such as `player.jobs`, `races`, or `nations` remain in some non-player-facing modules; refactor only when a bounded authority improvement warrants it;
- original currency terminology remains deferred;
- NPC schedules remain static-location recurring availability; autonomous multi-location pathfinding is future work;
- enemy tactical/content breadth remains representative rather than deep;
- broad quest/romance/social-life content remains shallower than long-term design;
- no passive/offline companion healing or autonomous companion routine exists, deliberately;
- regional content breadth/balance remains pre-alpha;
- no browser heap/profiler run was claimed; deterministic lifecycle tests are the observed retention evidence.

## Cycle-6 documentation synchronization

After runtime freeze at `7a148ebdff594523f956ed6be83aba59e26d564f`, Cycle 6 updated documentation only:

- `docs/RESOURCE_LIFECYCLE.md` — six-owner task law, zero-retained managed steady state, current-schema task integrity, no generic-prune requirement;
- `docs/ROADMAP.md` — `.18`–`.22` maintenance history and current baseline;
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — independent-version decisions, exact heads/checks, current strict-persistence policy;
- `docs/QUALITY_GATES.md` — raw-validator composition and task-owner quality rules;
- `docs/ARCHITECTURE.md` — current task ownership, strict task/travel persistence, latest runtime gate;
- `PROJECT_PROFILE.yaml` — current lifecycle guards and persistence constraints;
- this handoff last.

These documentation commits were not followed by a new runtime validation run and must not be presented as runtime checkpoints.

## Next work

**Do not automatically begin `0.8.700`.** A fresh feature work order is required before starting another Phase 0.8 feature track.

If continuing maintenance/hardening, the recommended bounded sequence is:

```text
current-schema registry validation audit
  -> choose one persisted registry family
  -> identify authoritative validator + production construction/save/load paths
  -> classify each field as persistent / derived / construction convenience
  -> compose only required persistent invariants into raw pre-revival validation
  -> add positive current save/load evidence
  -> add malformed-current-save rejection evidence
  -> keep Account/Game/Data versions unchanged unless persisted meaning/shape actually changes
  -> run Test + Benchmark 3 + Sample on exact head before promotion
```

If returning to Phase 0.8 feature work, strong candidate families remain:

- agriculture/stewardship;
- earned automation that reduces already-established chore attention through investment/mastery;
- further companion/social-life breadth only where a concrete player decision and existing authority path justify it;
- another specific life/logistics seam only when current runtime evidence identifies a real gap.
