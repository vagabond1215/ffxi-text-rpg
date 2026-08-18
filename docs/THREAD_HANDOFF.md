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
8. `docs/ARCHITECTURE.md`, `docs/QUALITY_GATES.md`, `PROJECT_PROFILE.yaml`, `js/text/version.js`, and systems/tests relevant to the next bounded work order.

## Workflow and autonomous-session rule

Hearth & Horizon is pre-alpha. Old local saves/accounts are not a compatibility requirement unless a future work order explicitly changes that policy.

Runtime first. Freeze runtime before documentation. Update this handoff last. Report only validation that actually ran.

When elapsed-time enforcement is unavailable, autonomous work is capped at six cycles; **cycle 6 is stabilization/handoff only**. The maintenance train documented here used five runtime cycles plus the mandatory sixth documentation cycle, so a fresh user message is required before more implementation.

## Product laws

Working title: **Hearth & Horizon**. FFXI-derived material is bounded research/reference only.

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

Fictional time is separate from wall-clock scheduling. Resources retain provenance. Companions are persistent NPC-backed people. Commitments and relationships remain separate authorities. Presentation and combat/stat projections remain derived from canonical state.

## Current baseline

```text
Product:       0.8.600.38
Package:       0.8.600
Account Save:  5
Game State:    7
Data:          37
Benchmark:     3
Codename:      Strict Player Wallet
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
Validation:    0.30.0
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` remain complete and audited. Revisions `.2` through `.38` are maintenance/hardening revisions over the closed `0.8.600` track and **do not open `0.8.700`**.

## Current runtime freeze

The latest persistence-hardening train ended with PR **#361** (`maintenance/strict-player-wallet`) and was squash-merged to `main` as:

```text
dc588d194211ccaed671d58362617bea6b2c5a73
```

Exact validated PR head:

```text
a356c67124167ab60efd4cf4a57c742d3d94c355
Check 32197699859
Node 24.19.0
```

Observed exact-head validation:

```text
tests              629
pass               629
fail               0
cancelled          0
skipped            0
Benchmark 3        success
Benchmark Sample   success
```

Benchmark 3 single run:

```text
player profiles  0.352213 ms/op
enemy profiles   0.066914 ms/op
basic attacks    0.003626 ms/op
tick dispatch    0.000750 ms/op
route lookup     0.007245 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.332962 ms/op    7.70%
enemy profiles   0.063346 ms/op   11.90%
basic attacks    0.001369 ms/op  150.99%
tick dispatch    0.000825 ms/op   33.05%
route lookup     0.007222 ms/op    5.66%
```

No hard performance threshold is accepted. Benchmark 1/2 are not directly comparable to Benchmark 3.

Runtime was frozen after promotion of `dc588d194211ccaed671d58362617bea6b2c5a73`. Cycle-6 commits after that point are documentation synchronization only and are not new runtime validation checkpoints.

## Strict persistence train `.33`–`.38`

| Revision | Contract | PR | Promoted main | Exact head | Check | Tests |
| --- | --- | ---: | --- | --- | ---: | ---: |
| `.33` | Strict Player Progression: durable disciplines, EXP, continuous training, and learned skills validate before revival | #356 | `4a4710464c0b47fc6abe0fdc924e70e3d1681577` | `98c1d2e9c6499fb85256b40c5d225c329b623e7c` | `32186702816` | 607/607 |
| `.34` | Canonical Discovery Time: atlas visits use fictional seconds and acquired atlas/POI state validates before revival | #357 | `cfaa7ce2c7afa613925f51c94aa2d12b311cd8e9` | `3037e1a7ad3e9883b9dce0252866290bf1e52917` | `32196254452` | 611/611 |
| `.35` | Strict Work Proficiencies: absence remains valid; persisted mastery must satisfy its domain contract | #358 | `be4c29eb5e4dd60993da113f3ccfa2241b8b06b8` | `f01dbe687d434f88b61c72e7889a61e09bec8ff4` | `32196637167` | 616/616 |
| `.36` | Strict Player Resources: persisted HP/MP/TP validate while combat profiles remain derived | #359 | `3759f130174d804ccb76c9b243dca4d7826b10c1` | `fec79d286c9d6ed117b92375bddaffd9e8f04f56` | `32196927507` | 620/620 |
| `.37` | Strict Day Cycle: optional persisted day-review history validates against canonical world-day boundaries | #360 | `4dd5b126b37810a807c5f1e03c074c68178ede06` | `29aecd95fd92930330b64734dd24a573c93d4cda` | `32197342668` | 625/625 |
| `.38` | Strict Player Wallet: complete canonical currency keys and non-negative balances validate before revival | #361 | `dc588d194211ccaed671d58362617bea6b2c5a73` | `a356c67124167ab60efd4cf4a57c742d3d94c355` | `32197699859` | 629/629 |

Every final head passed Test, Benchmark 3, and Benchmark Sample on Node 24.19.0 before promotion.

### Independent-version decision

Account Save 5, Data 37, and Benchmark 3 remained unchanged throughout `.33`–`.38`.

Only `.34` changed persisted meaning: atlas wall-clock `visitedAt` became canonical fictional `visitedAtWorldSeconds`. Therefore **Game State advanced 6 → 7**. Under the current pre-alpha policy no automatic Game State 6 migration was added.

`.33` and `.35`–`.38` enforce/classify already-intended authority without changing Game State 7 serialized meaning, so no further Game State bump occurred.

## Current raw Game State 7 boundary

`currentGameStateSchema.js` validates decoded state **before reference revival and before runtime `ensure*` normalization**.

Required raw validation covers:

```text
world time
simulation control
timed tasks
active Travel State 2
projects
commitments
relationships
resource opportunities
ecology
party
ability runtime
semantic events
atlas discovery
POI discovery
player discipline progression / lifetime training / learned skills
player capability registry
player inventory/container state
player mutable HP/MP/TP
player canonical wallet
```

Active project/work/travel/timed-ability/resource-recovery records also require consistent persisted timed-task links until owner reconciliation.

Optional persisted authority:

```text
state.work
player.progression.workProficiencies
state.dayCycle
```

Absence is valid construction state for those fields. Once persisted, each must satisfy its domain contract before runtime access.

### Discovery-time contract

Game State 7 atlas visit records store `visitedAtWorldSeconds` from canonical fictional time. Legacy wall-clock `visitedAt` is not current discovery authority and causes the save to be rejected without repair, migration, or rewrite. POI discovery validates canonical place ownership and duplicate-free acquired knowledge. Map privacy remains acquired-knowledge only.

### Player authority split

Durable serialized player authority now explicitly includes:

- discipline progression and per-discipline EXP/levels;
- continuous-character lifetime training summary;
- character-owned learned skills and capabilities;
- inventory/container state;
- optional work proficiency mastery when constructed;
- mutable HP/MP/TP;
- canonical wallet balances.

Do **not** compose broad `validatePlayer()` wholesale into raw validation. Flat `player.inventory` identity remains post-revival. `player.combat` and derived combat/stat maxima remain projections rather than accepted raw authority.

`player.statState` is the next unresolved cache/authority question. It currently has deterministic continuous-character base-state semantics plus reconstruction/synchronization behavior; audit its production readers and relationship to `player.combat` before deciding whether to make it strict, recompute it on load, or remove it from persisted-cache expectations.

## State-classification law

Do not mechanically attach runtime validators to save/load.

```text
persistent required authority
  -> validate before revival

derived/transient
  -> recompute from authoritative inputs

construction convenience
  -> initialize in factory/new-state/internal paths

optional persisted authority
  -> absence is valid; present stored state must satisfy its domain contract
```

Historical lazy-`ensure*` tests may remain correct internal construction tests. They are not promises that malformed or incomplete current Game State 7 saves will load.

## Timed-task authority remains unchanged

Direct production `startTimedTask()` ownership is limited by the architecture guard to:

```text
abilityEngine.js
campaignRecoveryEngine.js
projectEngine.js
resourceOpportunityEngine.js
transportEngine.js
workTaskEngine.js
```

Each owner owns exactly-once reconciliation and terminal release. `releaseTimedTask` rejects active tasks and does not rewind sequence allocation. Managed repeated lifecycles return the task registry to zero retained records. There is no production generic/unowned task producer and no accepted blind global task prune.

## Stable authority boundaries to preserve

- one fictional-time/task/interrupt substrate;
- strict current-schema persistence during pre-alpha unless compatibility is explicitly requested;
- raw persistence validation before revival/runtime normalization;
- inventory owns container/access/capacity/transfer/carried-item facts;
- transport independently derives carried load and owns fare/cadence/departure/arrival/service limits;
- projects own material/labor/completion state;
- work owns durable work records when constructed;
- work proficiency is character-owned mastery and optional persisted authority;
- production owns recipe/work/input/output/provenance/mastery;
- campaign recovery remains the single player/party recovery authority;
- party owns persistent companion membership/location/tactics;
- commitments remain separate from relationships and Journal projection;
- NPC schedules are recurring availability against canonical fictional time, not a second clock;
- atlas/POI discovery is acquired knowledge and uses canonical fictional visit time;
- semantic events are bounded observational history, not world authority, while persisted ID/order/sequence integrity is strict;
- mutable HP/MP/TP and wallet balances persist; combat/stat profiles remain derived;
- canonical ActionResult logic uses structured fields rather than prose parsing;
- Benchmark protocol changes require a Benchmark version bump when comparability changes;
- legacy FFXI-derived records remain bounded research/reference material.

## Cycle-6 documentation synchronization

After runtime freeze at `dc588d194211ccaed671d58362617bea6b2c5a73`, Cycle 6 changed documentation/configuration only:

- `PROJECT_PROFILE.yaml` — Game State 7 raw/optional/derived authority map and next classification audit;
- `docs/QUALITY_GATES.md` — Game State 7 persistence rules and focused evidence list;
- `docs/ARCHITECTURE.md` — current authority split, Game State 7 discovery semantics, `.38` runtime gate;
- `docs/ROADMAP.md` — `.33`–`.38` train and next maintenance boundary;
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — Game State 7 version rationale and independent-version decisions;
- this handoff **last**.

No runtime validation was rerun after the freeze for these documentation-only commits.

## Next recommended work

**Do not automatically begin `0.8.700`.**

If continuing maintenance, start a fresh bounded train from current `main` with the **derived combat/stat cache audit** as the first unit:

1. enumerate production readers/writers and save/load behavior for `player.combat` and `player.statState`;
2. classify each field/subfield as durable authority, deterministic cache/projection, or construction convenience;
3. determine whether load should validate, recompute, or stop persisting the derived portions;
4. change the required raw-field list only after that authority decision;
5. add positive save/load and malformed/recompute evidence for the selected contract;
6. preserve mutable `player.resources` independently from derived maximum-resource calculations.

A later separate candidate is durable equipment/status persistence validation. Do not combine it mechanically with the combat/stat cache decision.

If returning to feature work, agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam remain candidate families, but a new feature track requires explicit authorization.

## Stop condition

This session reached the six-cycle autonomous boundary: five runtime cycles plus Cycle 6 stabilization/handoff. **A fresh user message is required before more implementation.**
