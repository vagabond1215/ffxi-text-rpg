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
8. only the architecture/runtime/tests named by the next bounded action

If these checkpoints still match repository state, **do not restart a broad repository audit**.

## Current checkpoint

**Phase 0.8 — Life and Infrastructure Expansion is complete.**

Current runtime contract:

```text
Product:       0.8.900.1
Package:       0.8.900
Account Save:  5
Game State:    14
Data:          39
Benchmark:     3
Codename:      Household & Community Continuity
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Exact frozen runtime implementation SHA:

```text
ca7d37c643adc4115b519148615f6120d03228df
```

The documentation tip immediately before this handoff write was:

```text
64216f9550110c9a9c8711bdf3751a8d4f92d07a
```

This handoff is the final repository-file write for the completed Phase 0.8 pass. A future thread must refresh `main` rather than assuming this chat's final commit SHA is still current.

There is no active feature branch or open PR. Validation-only PR #380 is closed without merge.

## Exact validation evidence

Frozen runtime `ca7d37c643adc4115b519148615f6120d03228df` passed hosted Check:

```text
Check:              32395768383
Node:               24.19.0
Tests:              699
Passed:             699
Failed:             0
Skipped:            0
Benchmark 3:        success
Benchmark Sample:   success
```

Frozen-runtime sample medians/spreads:

```text
player profiles  0.359735 ms/op    6.77%
enemy profiles   0.068665 ms/op    8.93%
basic attacks    0.001223 ms/op  172.92%
tick dispatch    0.000821 ms/op   27.23%
route lookup     0.007260 ms/op    6.40%
```

No hard performance threshold is accepted.

### Phase 0.8 exit validation

Validation-only PR #380 temporarily added Census + Hardening steps on its validation branch only. Production runtime remained frozen at `ca7d37c6...`.

Hosted Check:

```text
Check:              32395959505
Test:               success
Benchmark 3:        success
Benchmark Sample:   success
Content Census:     success
Hardening:          success
```

Hardening passed `tests/longSessionLifecycle.test.js` **2/2** plus another Benchmark Sample. It confirms deterministic multi-day save/load continuation and mixed owner-managed task lifecycles returning retained task state to zero.

## Phase 0.8 connected-life proof

The completed player-facing arc is:

```text
regional materials
  -> home storage improvement
  -> home workshop capability
  -> carried-load / Field Satchel logistics
  -> fictional-time NPC schedules and companion convalescence
  -> home Sweetroot cultivation
  -> repeated manual cultivation mastery
  -> earned paid delegation of one tending chore
  -> cultivated produce with home-plot provenance
  -> scheduled named community commitments and persistent relationships
  -> ordinary services / preparation / travel / adventure remain connected
```

No second simulation clock, crop scheduler, helper clock, generic automation platform, social clock, duplicate inventory, or parallel progression system was introduced.

## Current authority decisions to preserve

### Persistence

Game State 14 is strict current-schema-only pre-alpha authority. No automatic migrations are supported by default.

`state.cultivation` is required persisted authority. It owns plot/crop lifecycle facts and the bounded paid tending assignment when present.

Optional persisted authority remains:

```text
state.work
player.progression.workProficiencies
state.dayCycle
```

Derived/transient runtime state remains:

```text
state.npcs
state.enemies
state.log
player.inventory alias identity
player.combat
player.statState
activeBattle.rng
```

`state.events` remains persisted structured semantic observation history. `activeBattle.log` remains persisted encounter-local history.

### Cultivation and delegation

Canonical fictional world time is the only crop/helper completion clock.

Manual preparation/tending reuse existing `workTaskEngine` ownership. Crop growth and delegated tending create no direct timed-task owner.

Direct production timed-task creators remain exactly:

```text
abilityEngine.js
campaignRecoveryEngine.js
projectEngine.js
resourceOpportunityEngine.js
transportEngine.js
workTaskEngine.js
```

After one manually completed cultivation cycle, the player may pay **12 gil** for one tending appointment. The wage is charged once, the appointment survives save/load, helper work grants no player mastery, completion is exactly once, and harvest remains normal cultivation output.

Planting and harvest use the existing canonical `item-elderwood-sweetroot`. Home cultivation is distinguished by provenance source:

```text
plot-home-sweetroot-bed
```

### Household/community continuity

Three existing locality people are persistent scheduled community contacts:

```text
Mira Fen  — Thornwall Southgate     06:00–11:00
Mae Oris   — Brasshaven Market Ring 11:00–17:00
Kiri Fen   — Mistmere Canal Ward    16:00–21:00
```

Their home-produce commitments require Sweetroot provenance from `plot-home-sweetroot-bed`; wild Sweetroot does not satisfy them.

These loops reuse existing commitment, relationship, NPC schedule, wallet, inventory/provenance, semantic-event and save/load authorities. No new social persistence family or clock exists.

Direct semantic Journal intents include:

```text
cultivation.prepare
cultivation.plant
cultivation.tend
cultivation.harvest
commitment.accept
commitment.resolve
commitment.followUp
```

## Content-scale exit evidence

Current census:

```text
places/localities       26 / mechanics floor 10
named NPCs              12 / 50
shop/service sites      17 / 20
creatures               16 / 40
resource sources        13 / 40
canonical items         50 / 200
recipes/processes       11 / 75
abilities/techniques     5 / 100
quests/contracts         8 / 30
companions                1 / 4
transport services        3 / 5
```

Supplemental evidence:

```text
routes                  7
regional content packs  6
pack-owned records      80
runtime seed NPCs       11
runtime seed enemies    13
```

Mechanics-scale gate: **NOT READY**.

Places already exceed their mechanics floor. Every other tracked category remains below it. The largest relative gap is abilities/techniques.

This is the central strategic input for Phase 0.9. Do **not** game counts with disconnected filler.

## Documentation synchronized after runtime freeze

Runtime was frozen before documentation synchronization. Current authorities now describe the completed phase:

```text
docs/PHASE_0_8_EXIT_GATE.md
docs/ROADMAP.md
docs/EXECUTION_PIPELINE.md
docs/SYSTEM_CATALOG.md
docs/VERSIONING_AND_RELEASE_ROADMAP.md
docs/ARCHITECTURE.md
docs/QUALITY_GATES.md
docs/PERFORMANCE_BUDGET.md
docs/RESOURCE_LIFECYCLE.md
docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md
PROJECT_PROFILE.yaml
README.md
this handoff (last)
```

Documentation-only synchronization does not create a new runtime validation checkpoint.

## Current decision boundary

There is **no active implementation unit**.

Phase 0.9 — Content Scale, Adventure Depth and Release Hardening — is planned but **not opened**.

Proposed first unit:

```text
0.9.100 — Content Scale Gate A
```

A future thread must not begin `0.9.100` merely because it is next in the roadmap. It requires a new explicit work order.

If Phase 0.9 is explicitly opened, the recommended first planning packet is:

1. refresh `main` and this handoff;
2. run/read the current census rather than estimating content breadth;
3. choose a dense cross-linked regional content tranche rather than adding empty geography/filler;
4. prioritize systems that create multiple playable connections, with special attention to the large ability/technique, recipe/process, NPC, item, quest, companion and ecology gaps;
5. explicitly decide the recommended governance transition to protected `main`, PR-based track integration and required green hosted Check before high-volume Phase 0.9 work accelerates.

Do not change branch protection or runtime to `0.9.x` without that explicit opening decision.

## Known blockers

```text
Phase 0.8 runtime blockers: none known
Open pull requests:           none
Mechanics-scale gate:         not ready by design
Highest strategic debt:       connected authored content breadth / throughput
```

The largest project risk has shifted from persistence/state coherence to producing enough interconnected original content on the mature substrate.

## Deferred work — do not rediscover

- protected `main` / required Check / PR integration — recommended at explicit Phase 0.9 opening;
- supported-save compatibility/migrations — later deliberate release-transition work unless explicitly requested earlier;
- dedicated browser E2E/accessibility program — proposed `0.9.700`;
- hard performance thresholds — deferred until representative evidence supports them;
- balance certification — deferred until sustained content-scale play exists;
- quality/HQ crafting depth — deferred until it creates real decisions;
- mounts/warehouses/large logistics — deferred until existing logistics are stressed by content;
- deep romance framework — deferred until broader authored social life exists.

## Do not redo

Closed unless a concrete regression/change directly touches them:

```text
Phase 0.4–0.8 broad discovery
C0 candidate-selection audit
state.npcs persistence classification
state.enemies persistence classification
top-level state.log persistence classification
root derived-cache serialization audit
active-battle identity/cache/player-link hardening sequence
0.8.700 cultivation clock/authority decision
0.8.800 delegation ownership decision
0.8.900 household/community authority discovery
Phase 0.8 exit audit
```

## Session status

```text
Documentation tip before handoff: 64216f9550110c9a9c8711bdf3751a8d4f92d07a
Frozen runtime:                   ca7d37c643adc4115b519148615f6120d03228df
Product / Package:                0.8.900.1 / 0.8.900
Account Save / Game State:        5 / 14
Data / Benchmark:                 39 / 3
Hosted runtime Check:             32395768383 success
Tests:                            699/699 passed
Phase-exit Check:                 32395959505 success
Census / Hardening:               success / success
Phase 0.8:                        COMPLETE
Open PRs:                         none
Active implementation:            none
Next proposed unit:               0.9.100 Content Scale Gate A
Next proposed unit status:        planned, not opened
Known Phase 0.8 blocker:          none
```
