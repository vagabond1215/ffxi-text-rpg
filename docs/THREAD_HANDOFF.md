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
Product:       0.8.600.27
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     3
Codename:      Strict Character Runtime
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
```

Relevant system versions:

```text
performanceHarness    0.3.0
lifecycleHarness      0.13.0
timedTasks            0.2.0
projects              0.2.0
commitments           0.3.1
relationships         0.1.0
resourceOpportunities 0.2.0
ecologyState          0.1.0
party                  0.3.0
abilityEngine          0.3.0
validation             0.19.0
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` remain complete and audited. Revisions `.2` through `.27` are maintenance/hardening revisions over the closed `0.8.600` track and **do not** open `0.8.700`.

## Current runtime freeze

The strict current-schema registry-validation train ended with PR **#350** (`maintenance/strict-character-runtime`), squash-merged to `main` as:

```text
bccd49848593e47e7f5b3d69e0132d3a598ebe4a
```

The exact validated PR head was:

```text
5d0d8071d9f94cac818c43a1fe018583eb56286f
Check 32174533957
Node 24.19.0
```

Observed exact-head validation:

```text
tests              575
pass               575
fail               0
cancelled          0
skipped            0
Benchmark 3        success
Benchmark Sample   success
```

Benchmark 3 single-run evidence:

```text
1,000 player combat profiles   0.381457 ms/op
1,000 enemy combat profiles    0.067924 ms/op
1,000 basic attacks            0.003165 ms/op
10,000 steady tick dispatches  0.000865 ms/op
10,000 direct route lookups    0.007660 ms/op
```

Three-sample medians/spreads:

```text
player profiles  median 0.357477 ms/op   spread   6.21%
enemy profiles   median 0.064718 ms/op   spread   8.92%
basic attacks    median 0.001198 ms/op   spread 200.77%
tick dispatch    median 0.000698 ms/op   spread  69.53%
route lookup     median 0.007425 ms/op   spread  17.56%
```

**No hard performance threshold is accepted yet.** Benchmark 1, 2, and 3 are separate comparability protocols; do not describe numeric changes across protocol versions as direct optimization results.

Runtime was frozen after promotion of `bccd49848593e47e7f5b3d69e0132d3a598ebe4a`. Cycle-6 commits after that point synchronize documentation only and are not new runtime validation checkpoints.

## Strict registry-validation hardening `.23`–`.27`

| Revision | Contract | PR | Promoted main commit | Exact-head Check | Tests |
| --- | --- | ---: | --- | ---: | ---: |
| `0.8.600.23` | Strict Project Registry: compose project version/sequence/record/material validator before revival | #346 | `d99d8b56cb3a79f24a3aa9c1c0212ca21c7b8e74` | `32172651042` | 555/555 |
| `0.8.600.24` | Strict Continuity Registries: compose commitment and relationship validators before revival | #347 | `d9fab2ac9096243687afc72ef5c9faac16a27216` | `32173390833` | 560/560 |
| `0.8.600.25` | Strict Resource Opportunities: compose resource-opportunity version/sequence/action/outcome validator | #348 | `8b15db6696bb38988e023935df13345dac5574d8` | `32173721913` | 565/565 |
| `0.8.600.26` | Strict Ecology Registry: compose persistent population/source depletion-regeneration validator | #349 | `d1f55853a366604cf36b274c915935dd7978575b` | `32174111312` | 569/569 |
| `0.8.600.27` | Strict Character Runtime: compose existing Party + Ability runtime validators before `ensure*` normalization | #350 | `bccd49848593e47e7f5b3d69e0132d3a598ebe4a` | `32174533957` | 575/575 |

Exact validated heads:

```text
.23  9facc76633f706cf808371e60b24ce901c0659af
.24  e71cbfe13ec08f39462cfad59a3793643e478c25
.25  1251d915706f4c7e4c1a795512aa1e24f4eea17b
.26  ae497c08ffa017a76d5baa2ba190cde39c1c4a3a
.27  5d0d8071d9f94cac818c43a1fe018583eb56286f
```

Every final PR head passed Test, Benchmark 3, and Benchmark Sample on Node 24.19.0 before promotion.

### Independent-version decision

Account Save 5, Game State 6, Data 37, and Benchmark 3 remained unchanged throughout `.23`–`.27`.

These revisions enforce invariants that were already part of the intended Game State 6 contract. They do not change persisted shape/meaning, authored-data identity, or benchmark protocol. Product revision and `SYSTEM_VERSIONS.validation` advance to record stricter enforcement; schema/data/benchmark versions do not advance merely because invalid current payloads are rejected earlier.

## Current raw Game State 6 boundary

`currentGameStateSchema.js` runs against decoded persisted state **before** reference revival and before runtime `ensure*` helpers can normalize domain state.

Current raw domain validation covers:

```text
timed tasks
  -> version, monotonic sequence, unique ids, status/timing/data

active travel
  -> Travel State 2 + matching task kind/channel/endpoints/deadline

projects
  -> version, sequence, stable ids/status, labor/material progress

commitments
  -> canonical definition ids, status, one-time reward/follow-up bookkeeping

relationships
  -> version, npc-key consistency, integer dimensions, timestamps

resource opportunities
  -> version, sequence, stable ids/status, recovery actions, persisted output rolls

ecology
  -> version, required population/source maps, canonical references, quantities, timestamps

party
  -> version, capacity, unique active membership, recruited companion records/resources/tactics

ability runtime
  -> version, cooldown map, active activation structure
```

Separate active-owner link validation requires active travel/project/work/timed-ability/resource-recovery state to retain a matching active or just-completed timed task until owner reconciliation.

Malformed current required state is rejected rather than repaired. The `.27` hosted gate explicitly proved that malformed Party and Ability payloads are rejected before `ensurePartyState()` / `ensureAbilityRuntimeState()` can normalize them.

Positive current save/load evidence now exists for every newly composed family:

- projects — non-empty project registry persists unchanged;
- continuity — non-empty relationship state persists while malformed commitment/relationship state is rejected;
- resource opportunities — non-empty opportunity records persist, including their stable identity;
- ecology — non-empty population runtime state persists;
- party + ability runtime — recruited companion membership and a persisted ability cooldown survive load unchanged.

Each family also has malformed encoded-current-save rejection evidence demonstrating that load does not silently rewrite the corrupted payload.

## State-classification rule

Do **not** mechanically attach every runtime validator to current-save load.

Before tightening another state family, classify it:

```text
persistent required authority
  -> validate before revival

derived/transient
  -> recompute freely from authoritative inputs

construction convenience
  -> initialize in new-game/factory/internal paths, not as implicit current-save migration
```

Historical tests that say an `ensure*` helper lazily initializes missing state may still be correct for internal/new-state construction. They do not imply that an incomplete current Game State 6 save is load-compatible.

## Timed-task authority remains unchanged

Direct production `startTimedTask()` ownership remains limited by `tests/architectureDebtGuard.test.js` to:

```text
abilityEngine.js
campaignRecoveryEngine.js
projectEngine.js
resourceOpportunityEngine.js
transportEngine.js
workTaskEngine.js
```

Each direct owner owns exactly-once consequence reconciliation and terminal release. `releaseTimedTask` rejects active tasks and never rewinds `nextSequence`; released task IDs are not reused.

Production-style repeated owner lifecycles return the task registry to zero retained task records after reconciliation. There is currently no production generic/unowned timed-task producer, so there is no accepted global task-history prune policy.

## Earlier hardening context

The `.18`–`.22` train established the six-owner task guard, strict active travel, active owner/task-link integrity, strict task-registry validation, and positive persistence evidence across all task owners.

The `.13`–`.17` train established owner-gated terminal release and repeated retention steady-state evidence.

The `.8`–`.12` train established deterministic 130-day save/load evidence, benchmark sampling/protocol corrections, stale-safe tick subscription ownership, DOM-root cleanup, and Benchmark 3 warm-up.

The `.2`–`.7` train established current-schema cleanup, canonical command/action contracts, strict Game State 6 structure, carried commitment delivery, Node 24/current Actions, and executable compatibility-debt guards.

See `docs/ROADMAP.md` and `docs/VERSIONING_AND_RELEASE_ROADMAP.md` for the full revision history.

## Stable authority boundaries to preserve

- one fictional-time/task/interrupt substrate;
- strict current-schema persistence during pre-alpha unless compatibility is explicitly requested;
- raw current-schema validation runs before reference revival/runtime normalization;
- required persisted domain registries must already satisfy their declared current contract;
- runtime `ensure*` helpers do not make incomplete current saves loadable;
- derived/transient state should remain derivable rather than becoming new persisted authority;
- direct timed-task creators require explicit domain ownership, exactly-once reconciliation, and terminal release;
- inventory owns container unlock/access/capacity/transfer and carried-item facts;
- carried inventory/load derives from container definitions, not consumer-specific lists;
- home infrastructure composes project/inventory/furnishing/workstation authorities rather than creating parallel stores or timers;
- transport owns fares/cadence/departure/arrival/service allowance and derives carried load;
- projects own material + labor + completion state;
- work authorities own durable completion/failure/storage/cancellation records;
- `workstationEngine` owns workstation-context derivation;
- `productionEngine` owns recipe requirements/work/inputs/outputs/provenance/mastery;
- campaign recovery remains the single player/party recovery authority;
- recovery never silently changes active party membership;
- party remains the persistent companion membership/location/tactics authority;
- commitments remain separate from relationships and Journal projection;
- NPC schedules are recurring availability evaluated against canonical fictional time, never a second clock/state registry;
- maps/routes/resources/contacts/search preserve acquired-knowledge privacy;
- canonical ActionResult logic uses structured semantic fields, not prose parsing;
- wall-clock subscriptions/listeners/observers require explicit lifecycle owners and stale-owner-safe disposal;
- Benchmark protocol changes require a Benchmark version bump when comparability changes;
- legacy FFXI-derived records remain bounded research/reference material, not canonical world identity.

## Known non-blocking debt / future hardening

The registry-composition train closed the most obvious required domain registries identified at the `.22` boundary. Remaining top-level/player state must **not** be treated as one bulk validator task.

Potential future audit families include world/simulation control, player progression/resources, inventory/equipment, semantic event/history state, atlas/discovery, and other top-level runtime containers. These are candidates for classification, not declarations that each should become stricter persisted authority.

For each future family, inspect its construction path, real persistence caller, current validator (if any), and whether its fields are authoritative versus derived before changing rejection behavior.

Other carried debt:

- internal implementation names such as `player.jobs`, `races`, or `nations` remain in some non-player-facing modules; refactor only when a bounded authority improvement warrants it;
- original currency terminology remains deferred;
- NPC schedules remain static-location recurring availability; autonomous multi-location pathfinding is future work;
- enemy tactical/content breadth remains representative rather than deep;
- broad quest/romance/social-life content remains shallower than long-term design;
- no passive/offline companion healing or autonomous companion routine exists, deliberately;
- regional content breadth/balance remains pre-alpha;
- no browser heap/profiler run was claimed; deterministic lifecycle tests remain the observed long-session retention evidence.

## Cycle-6 documentation synchronization

After runtime freeze at `bccd49848593e47e7f5b3d69e0132d3a598ebe4a`, Cycle 6 updated documentation/configuration only:

- `PROJECT_PROFILE.yaml` — records the current raw-domain validator set and focused guard tests;
- `docs/QUALITY_GATES.md` — records the three-way state-classification rule and strict-registry evidence;
- `docs/ARCHITECTURE.md` — records the complete current raw persistence boundary and `.27` runtime gate;
- `docs/ROADMAP.md` — adds `.23`–`.27`, promoted commits, checks, and current next boundary;
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — records independent-version decisions and current strict-persistence policy;
- this handoff **last**.

These documentation commits were not followed by a new runtime validation run and must not be presented as runtime checkpoints.

## Next work

**Do not automatically begin `0.8.700`.** A fresh feature work order is required before starting another Phase 0.8 feature track.

If continuing maintenance/hardening, use this bounded sequence:

```text
remaining current-schema state audit
  -> choose ONE top-level/player state family
  -> identify its authoritative construction + persistence consumers
  -> classify fields as persistent authority / derived-transient / construction convenience
  -> determine whether a dedicated raw validator is justified
  -> if justified, compose only the authoritative invariants before revival
  -> add positive non-trivial current save/load evidence
  -> add malformed-current-save rejection/no-repair evidence
  -> make deliberate Product/Account/Game/Data/Benchmark decisions
  -> run exact-head Test + Benchmark 3 + Sample before promotion
```

Do not add a validator merely because one exists elsewhere in runtime code.

If returning to Phase 0.8 feature work, strong candidate families remain:

- agriculture/stewardship;
- earned automation that reduces already-established chore attention through investment/mastery;
- further companion/social-life breadth only where a concrete player decision and existing authority path justify it;
- another specific life/logistics seam only when current runtime evidence identifies a real gap.

## Session boundary

This work order used five runtime cycles followed by the mandatory sixth stabilization/documentation cycle. The six-cycle autonomous boundary is reached. **A new user message is required before another implementation cycle begins.**
