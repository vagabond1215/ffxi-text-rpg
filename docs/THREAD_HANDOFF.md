# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Required read order

1. `AGENTS.md`
2. this file
3. `docs/EXECUTION_PIPELINE.md`
4. inspect PR #378 status
5. `docs/ROADMAP.md`
6. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
7. only the architecture/runtime/tests named by the next bounded action

If these checkpoints still match repository state, **do not restart a broad repository audit**.

## Current repository state

`main` was refreshed immediately before this handoff and remains:

```text
a77db18722a1c55daa7c4666db9aabd785d91eaf
```

Active feature branch:

```text
feature/0.8.700-cultivation-stewardship
```

Active PR:

```text
#378 — 0.8.700 Cultivation & Stewardship
state: open
review state: draft
merged: false
base: main @ a77db18722a1c55daa7c4666db9aabd785d91eaf
```

The exact **implementation/runtime/test freeze** is:

```text
c125f7ae5f94800893dc28c7fa0ceb61553e3db8
```

No runtime/source/test changes were made after that SHA. Documentation/config synchronization commits follow it on the feature branch.

The documentation tip immediately before this handoff write was:

```text
0d16bbe046f239c731e98aeb52c106317107a98c
```

The commit containing this handoff is the final repository-file write for this pass. A future thread must fetch the branch/PR rather than assuming this chat's SHA is still current.

## Proposed 0.8.700 baseline — feature branch only

```text
Product:       0.8.700.1
Package:       0.8.700
Account Save:  5
Game State:    13
Data:          38
Benchmark:     3
Codename:      Cultivation & Stewardship
Compatibility: pre-release-current-schema
Phase:         0.8 in progress
```

These values are **not on `main` yet** because PR #378 has not been merged.

## `0.8.700` status

**IMPLEMENTED AND VALIDATED / PENDING LANDING.**

The bounded player-facing proof is one reusable home Sweetroot bed:

```text
prepare bed
  -> short existing work task
  -> consume 1 physical Elderwood Sweetroot
  -> persist crop state + seed provenance
  -> canonical fictional time advances
  -> tending becomes due after 1 fictional day
  -> short existing work task performs tending
  -> maturity after 2 fictional days
  -> harvest exactly once
  -> 3 ordinary Sweetroots enter normal inventory
  -> cultivated provenance records home plot + seed history
  -> existing consume / cooking / trade sinks remain valid
  -> cultivation proficiency reduces later hands-on duration
```

## Authority decisions to preserve

### Cultivation state

`state.cultivation` is **required durable Game State authority** in Game State 13.

It owns:

```text
plot id / home place
phase / cycle / harvest count
active cultivation work link when present
preparation and last-harvest fictional timestamps
crop item/cycle
growth/tending/readiness fictional timestamps
seed provenance while crop is growing
```

These facts cannot be reconstructed safely without losing consumed inputs, elapsed growth, tending state, replay protection or provenance.

### Growth clock

Canonical fictional world time is the **only** growth clock.

Crop growth creates:

```text
no timer
no interval
no background worker
no offline/wall-clock authority
no crop-owned timed task
```

Readiness is derived by comparing canonical world time with persisted crop timestamps.

### Hands-on labor

Preparation and tending reuse the existing `workTaskEngine` owner. Cultivation does not call the generic timed-task creator directly.

The sequence is:

```text
start cultivation labor
  -> existing work record
  -> existing work timed task
  -> activity advancement reaches boundary
  -> cultivation reconciliation copies durable consequence
  -> cultivation proficiency gain
  -> work completion
  -> work owner releases terminal task
```

### Inventory/provenance

Planting consumes one existing `item-elderwood-sweetroot` from ordinary inventory.

The exact removed item's provenance is persisted in crop state. Harvest produces the **same canonical item ID**, not a farm-only duplicate, with:

```text
sourceId = plot-home-sweetroot-bed
placeId  = character home place
seed provenance nested in cultivated provenance data
```

Existing Sweetroot sink families remain:

```text
consume
craftIngredient
trade
```

The existing Silverfin Sweetroot Stew process proves production participation; normal item behavior proves trade/shop-sale participation.

### Mastery

Stable persistent work-proficiency id:

```text
cultivation
```

Preparation/tending/harvest add cultivation mastery. Existing `workDurationForProficiency` reduces later hands-on duration. There is no separate farming level or crop XP system.

### Semantic UI

Direct player intents:

```text
cultivation.prepare
cultivation.plant
cultivation.tend
cultivation.harvest
```

The Journal/context model exposes status and actions without requiring command strings or leaking raw plot/timestamp/provenance implementation data.

Recommendation integration learned during CI:

- active cultivation work may surface strongly;
- a merely ready cultivation bed must not displace stronger existing active/ready commitment, livelihood, home or recovery decisions;
- ready commitment follow-ups retain their existing priority;
- cultivation entries inherit the canonical home region for campaign grouping.

## Exact validation evidence

PR #378 current frozen implementation head:

```text
c125f7ae5f94800893dc28c7fa0ceb61553e3db8
```

Hosted run:

```text
Check:              32340190710
Job:                96337561458
Node:               24.19.0
npm:                11.17.0
Tests:              695
Passed:             695
Failed:             0
Cancelled:          0
Skipped:            0
Benchmark 3:        success
Benchmark Sample:   success
```

Focused cultivation tests passed:

```text
Game State 13 requires durable cultivation authority before runtime normalization
cultivation schema rejects forged crop timing and malformed active work links
0.8.700 turns one physical Sweetroot into a deterministic multi-day home crop with provenance, mastery, and exactly-once harvest
```

Full regression coverage also remained green after two recommendation-integration fixes.

### Integration CI history

The first feature Check found four presentation/recommendation regressions while all cultivation-domain tests were green. The second reduced that to one ready-commitment priority regression. The third run above is fully green.

Do not rediscover these as cultivation-domain defects; the final policy is already encoded in `playerSocialScheduleEngine.js`.

## Benchmark 3 evidence

Single run:

```text
player profiles  0.350069 ms/op
enemy profiles   0.068868 ms/op
basic attacks    0.003197 ms/op
tick dispatch    0.000788 ms/op
route lookup     0.007068 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.331167 ms/op    6.35%
enemy profiles   0.062892 ms/op    7.69%
basic attacks    0.001206 ms/op  166.26%
tick dispatch    0.000613 ms/op   54.43%
route lookup     0.006783 ms/op    5.66%
```

No hard performance threshold is accepted. Benchmark 3 protocol did not change.

## Version decision

```text
Product      0.8.600.52 -> 0.8.700.1
Package      0.8.600    -> 0.8.700
Game State   12         -> 13
Data         37         -> 38
Account Save 5 unchanged
Benchmark    3 unchanged
```

Game State 13 is required because cultivation lifecycle/provenance/replay facts are durable authority. Data 38 records the new stable cultivation proficiency/state contract.

No Game State 12 -> 13 migration was added. That is deliberate under the pre-alpha current-schema-only policy. Hosted tests observed the expected old-save rejection: Game State 12 is incompatible with current Game State 13 on this branch.

## Main files for 0.8.700

Runtime/data/integration:

```text
js/text/systems/cultivationEngine.js
js/text/systems/workProficiencyEngine.js
js/text/gameState.js
js/text/systems/currentGameStateSchema.js
js/text/systems/activityAdvanceEngine.js
js/text/systems/validation.js
js/text/systems/playerSocialScheduleEngine.js
js/text/ui/uiIntentDispatcher.js
js/text/ui/gameViewModel.js
js/text/version.js
package.json
```

Focused tests:

```text
tests/currentSchemaCultivation.test.js
tests/playerCultivationStewardshipFlow.test.js
```

Related Game State/version regression suites were advanced to Game State 13.

## Documentation synchronized after freeze

After implementation freeze `c125f7ae...`, documentation/configuration was synchronized without changing runtime/source/tests:

```text
docs/EXECUTION_PIPELINE.md
docs/ROADMAP.md
docs/VERSIONING_AND_RELEASE_ROADMAP.md
PROJECT_PROFILE.yaml
docs/QUALITY_GATES.md
docs/RESOURCE_LIFECYCLE.md
docs/PERFORMANCE_BUDGET.md
docs/ARCHITECTURE.md
docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md
README.md
docs/SYSTEM_CATALOG.md
this handoff (last)
```

## Content census note

No standalone `npm run census` output was recorded during 0.8.700.

No scale-count increase is claimed because the bounded proof deliberately reuses existing content and adds no census-counted place, named NPC, service site, creature, resource source, canonical item, recipe, ability, quest, companion or transport service.

Do not claim a census delta that was not actually run.

## Next action — landing decision first

PR #378 is still **draft and unmerged**.

A future `continue` should **not** start `0.8.800` while #378 remains unresolved by default. First:

```text
1. refresh main
2. inspect PR #378 status/head/check
3. if user authorizes merge, merge only the validated feature PR using the then-current head
4. refresh main after merge and update landing handoff/status
5. only then treat 0.8.800 as the next feature track
```

Do not merge #378 without explicit merge authorization.

If #378 was externally merged before the new thread begins, verify `main` contains the feature and then mark 0.8.700 DONE before selecting/starting the next pass.

If #378 was closed/replaced, resolve that repository state rather than blindly continuing from chat memory.

## Next bounded feature after landing

`0.8.800 — Earned Routine Delegation` is **READY NEXT after 0.8.700 lands**, not started.

Preferred first proof:

> After manually establishing the Sweetroot routine, can the player earn a bounded helper/hired-labor option for one cultivation chore that reduces repetitive attention while preserving wages/material/time costs, cultivation authority, save/load integrity and exactly-once consequences?

Do not start with a generic automation framework.

Following units remain queued:

```text
0.8.900 Household & Community Continuity
Phase 0.8 exit audit
```

## Deferred work — do not rediscover

- protected `main` / required-check transition — Phase 0.9 stabilization;
- supported-save compatibility/migrations — `0.9.800` unless explicitly requested earlier;
- dedicated browser E2E/accessibility program — `0.9.700`;
- hard performance thresholds — deferred until representative evidence supports them;
- balance certification — deferred until sustained content-scale play exists;
- quality/HQ crafting depth — deferred until it creates real decisions;
- mounts/warehouses/large logistics — deferred until existing logistics are stressed by content;
- deep romance framework — deferred beyond bounded household/community work.

## Do not redo

Closed unless a concrete regression/change directly touches them:

```text
Phase 0.4–0.7 broad discovery
C0 candidate-selection audit
state.npcs persistence classification
state.enemies persistence classification
top-level state.log persistence classification
root derived-cache serialization audit
active-battle identity/cache/player-link hardening sequence
0.8.700 authority discovery / crop-clock decision
```

## Session status

```text
Main:                           a77db18722a1c55daa7c4666db9aabd785d91eaf
Feature branch:                 feature/0.8.700-cultivation-stewardship
PR:                             #378 open draft, unmerged
Validated implementation head:  c125f7ae5f94800893dc28c7fa0ceb61553e3db8
Hosted Check:                   32340190710 success
Tests:                          695/695 passed
Benchmark 3 / Sample:           success / success
0.8.700 implementation:         complete and validated
0.8.700 landing:                pending explicit merge authorization
Known implementation blocker:   none
Next action:                     resolve PR #378 landing state
0.8.800:                        ready next only after landing; not started
```
