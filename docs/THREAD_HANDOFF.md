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

Fictional time is separate from wall-clock scheduling. Resources retain provenance. Companions are persistent NPC-backed people. Commitments and relationships remain separate authorities. Presentation remains derived from canonical state.

## Current baseline

```text
Product:       0.8.600.32
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     3
Codename:      Strict Optional Work Registry
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
Validation:    0.24.0
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` remain complete and audited. Revisions `.2` through `.32` are maintenance/hardening revisions over the closed `0.8.600` track and **do not open `0.8.700`**.

## Current runtime freeze

The latest strict-state maintenance train ended with PR **#355** (`maintenance/strict-work-registry`) and was squash-merged to `main` as:

```text
9423e87b6d681841a7576d938950bfbb631dd257
```

Exact validated PR head:

```text
458a87b3dbf08f6d6da086cc24bc1da6c539ede4
Check 32178015948
Node 24.19.0
```

Observed exact-head validation:

```text
tests              602
pass               602
fail               0
cancelled          0
skipped            0
Benchmark 3        success
Benchmark Sample   success
```

Benchmark 3 single run:

```text
player profiles  0.270363 ms/op
enemy profiles   0.053653 ms/op
basic attacks    0.002913 ms/op
tick dispatch    0.000814 ms/op
route lookup     0.005602 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.259028 ms/op   7.25%
enemy profiles   0.051633 ms/op  11.45%
basic attacks    0.001148 ms/op 186.78%
tick dispatch    0.000478 ms/op 133.64%
route lookup     0.005363 ms/op  14.08%
```

No hard performance threshold is accepted. Benchmark 1/2 are not directly comparable to Benchmark 3.

Runtime was frozen after promotion of `9423e87b6d681841a7576d938950bfbb631dd257`. Cycle-6 commits after that point are documentation synchronization only and are not new runtime validation checkpoints.

## Strict-state validation train `.28`–`.32`

| Revision | Contract | PR | Promoted main | Exact head | Check | Tests |
| --- | --- | ---: | --- | --- | ---: | ---: |
| `.28` | Strict World Simulation: validate canonical world time + simulation control before runtime normalization | #351 | `3d1f59b9bfdf03a17e7c96ef00c4eee6bed72087` | `5c1d4108fc8714ea67a5b009ada5cfac43da3e4a` | `32175617550` | 581/581 |
| `.29` | Strict Player Capabilities: validate required character capability registry before `ensureCapabilityState()` | #352 | `eac701fb968bb326e768c2c105fe814c84272a10` | `31e0f665e7d022508e10f1dce0ef18fd1420e739` | `32176059398` | 586/586 |
| `.30` | Strict Inventory State: validate canonical containers, unlocks, capacity, and home context before revival | #353 | `86eb8365fc1b2ff9c2207ce52ffe84321c713f9e` | `229cf4992c61dd1c887b5ec85886443122739dbe` | `32176647509` | 591/591 |
| `.31` | Strict Semantic Events: validate event record/order/sequence integrity before normalization | #354 | `e947f82f132d0f1fb972688471a23140731ab34c` | `f5842eb71eb16861ecb8c0c50b56454396e3f5f4` | `32177641185` | 597/597 |
| `.32` | Strict Optional Work Registry: absence remains valid; persisted work must satisfy its validator | #355 | `9423e87b6d681841a7576d938950bfbb631dd257` | `458a87b3dbf08f6d6da086cc24bc1da6c539ede4` | `32178015948` | 602/602 |

Every final head passed Test, Benchmark 3, and Benchmark Sample on Node 24.19.0 before promotion.

### Independent-version decision

Account Save 5, Game State 6, Data 37, and Benchmark 3 remained unchanged throughout `.28`–`.32`.

These revisions enforce existing intended persistence invariants. They do not change persisted shape/meaning, authored-data identity, or benchmark protocol. Product revision and `SYSTEM_VERSIONS.validation` advance to record stricter enforcement.

## Current raw Game State 6 boundary

`currentGameStateSchema.js` validates decoded state **before reference revival and before runtime `ensure*` normalization**.

Required raw validation now covers:

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
player capability registry
player inventory/container state
```

Active project/work/travel/timed-ability/resource-recovery records also require consistent persisted timed-task links until owner reconciliation.

`work` is intentionally classified as **optional persisted authority**:

```text
work absent
  -> valid construction convenience

work present
  -> must be an object satisfying validateWorkState()
```

This prevents a malformed saved work registry from being replaced by `ensureWorkState()` while preserving legitimate lazy construction.

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

Historical lazy-`ensure*` tests may remain correct internal construction tests. They are not promises that malformed or incomplete current Game State 6 saves will load.

## Deliberate exclusions and deferred persistence work

### Broad player validator

Do **not** compose `validatePlayer()` wholesale into raw save validation. It currently mixes true persisted invariants with:

- post-revival flat inventory alias identity;
- derived combat/profile checks;
- other assumptions that are not raw serialized invariants.

If player persistence is tightened further, first extract a dedicated **raw-safe persisted player progression/stat validator** with explicit ownership semantics.

### Inventory alias identity

`player.inventory === player.inventoryState.containers.inventory.items` is a runtime reference relationship reconstructed after decode. Keep that identity check post-revival.

### Atlas / POI discovery

Atlas and POI discovery were audited but deliberately not tightened in this train. There is no dedicated raw-domain validator, and atlas visit records currently contain wall-clock timestamps. Resolve discovery authority and timestamp semantics before making that state stricter persistence law.

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
- production owns recipe/work/input/output/provenance/mastery;
- campaign recovery remains the single player/party recovery authority;
- party owns persistent companion membership/location/tactics;
- commitments remain separate from relationships and Journal projection;
- NPC schedules are recurring availability against canonical fictional time, not a second clock;
- maps and campaign information preserve acquired-knowledge privacy;
- semantic events are bounded observational history, not world authority, while their persisted ID/order/sequence integrity is strict;
- canonical ActionResult logic uses structured fields rather than prose parsing;
- Benchmark protocol changes require a Benchmark version bump when comparability changes;
- legacy FFXI-derived records remain bounded research/reference material.

## Cycle-6 documentation synchronization

After runtime freeze at `9423e87b6d681841a7576d938950bfbb631dd257`, Cycle 6 changed documentation/configuration only:

- `PROJECT_PROFILE.yaml` — current raw-domain guard set and deliberate exclusions;
- `docs/QUALITY_GATES.md` — required/derived/construction/optional classification and focused persistence evidence;
- `docs/ARCHITECTURE.md` — `.32` raw boundary, exclusions, runtime freeze, latest gate;
- `docs/ROADMAP.md` — `.28`–`.32` train and current next boundary;
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — independent-version decisions and strict-persistence policy;
- this handoff **last**.

No runtime validation was rerun after the freeze for these documentation-only commits.

## Next recommended work

**Do not automatically begin `0.8.700`.**

If continuing persistence hardening, start a fresh bounded train from current `main` and choose **one** family after classification. Recommended order:

1. **Player progression/stat persistence audit**
   - inspect `statState`, `progression`, lifetime training, job progression, skills, resources, and their construction/update paths;
   - extract or create a raw-safe persisted-state validator rather than using broad `validatePlayer()`;
   - distinguish derived combat resources/profile from durable character progression;
   - add non-trivial save/load and malformed-current-save/no-repair evidence only for true persisted authority.
2. **Atlas/POI discovery authority audit**
   - decide whether wall-clock visit timestamps belong in persisted gameplay state;
   - define a dedicated discovery validator only after that authority decision;
   - preserve acquired-knowledge privacy.
3. **Other optional persisted families** only where a real `ensure*` normalization gap is demonstrated.

If returning to feature work, agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam remain candidate families, but a new feature track requires explicit authorization.

## Stop condition

This session reached the six-cycle autonomous boundary: five runtime cycles plus Cycle 6 stabilization/handoff. **A fresh user message is required before more implementation.**
