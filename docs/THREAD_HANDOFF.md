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
8. `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md` only if Phase 0.9 planning/implementation is the authorized task
9. only the architecture/runtime/tests named by the next bounded action

If these checkpoints still match repository state, **do not restart a broad repository audit**.

## Current checkpoint

**Phase 0.8 is complete. The requested current-status audit, repair/optimization pass, and future implementation planning pass are also complete.**

Current runtime contract remains unchanged:

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

Exact frozen gameplay/runtime implementation SHA remains:

```text
ca7d37c643adc4115b519148615f6120d03228df
```

The documentation/planning tip immediately before this handoff write was:

```text
7fca0f2added3a51b6e873208b145375a3c5d221
```

This handoff is the final repository-file write for the status-audit/repair/planning pass. Refresh `main` before future work rather than assuming this chat's final commit SHA is still current.

There is no active feature PR. Validation-only PR #381 is closed without merge.

## Audit conclusion

The repository is technically healthy at the Phase 0.8 boundary.

No new gameplay, persistence, lifecycle, deterministic-simulation, version, or content-data defect was found that requires reopening Phase 0.8. The largest project risk remains **connected authored-content breadth and production throughput**, not persistence/state coherence.

Current `main` remains unprotected by deliberate policy. The recommendation remains to transition to protected `main` + required green hosted Check + PR-based integration only when Phase 0.9 is explicitly opened.

Several historical validation branches and `feature/0.8.700-cultivation-stewardship` remain remotely. The available connector exposes no safe branch-delete action. Treat them as manual cleanup debt only; do not continue new work from them.

## Repairs and optimizations completed

### Repository contract audit

Added:

```text
npm run audit:repo
scripts/repositoryAudit.js
tests/repositoryContractAudit.test.js
```

The audit detects drift between runtime/package/profile/core documentation and hosted validation contracts.

### Local/hosted validation parity

`npm run check` now runs:

```text
npm run audit:repo
npm test
npm run benchmark
npm run benchmark:sample
```

Hosted `Check` runs the same Repository Audit + Test + Benchmark + Benchmark Sample stages.

### Historical guidance cleanup

`docs/BASELINE_PIPELINE.md` is now explicitly historical. Its old App 0.2.0 / Save 2 / Data 1 / Benchmark 1 lanes, live-tick-as-canonical-clock guidance, command-first assumptions, FFXI-oriented next-version instructions, and `0.3.0` target are retired and must not be treated as current authority.

## Maintenance validation evidence

Validated maintenance head:

```text
c3d610e1f3820248a20de28bdc605e82da29e6f1
```

Validation-only PR #381:

```text
state:              closed without merge
Check:              32398650493
Job:                96521318203
Node:               24.19.0
npm:                11.17.0
Repository Audit:   PASS
Tests:              700/700 passed
Failed:             0
Skipped:            0
Benchmark 3:        success
Benchmark Sample:   success
```

Single Benchmark 3 run:

```text
player profiles  0.382597 ms/op
enemy profiles   0.070456 ms/op
basic attacks    0.003109 ms/op
tick dispatch    0.000811 ms/op
route lookup     0.007480 ms/op
```

Sample medians/spreads:

```text
player profiles  0.370199 ms/op    5.23%
enemy profiles   0.067141 ms/op    7.72%
basic attacks    0.001190 ms/op  188.10%
tick dispatch    0.000812 ms/op   25.13%
route lookup     0.006983 ms/op    6.44%
```

No hard performance thresholds were introduced. Results remain qualitatively consistent with Benchmark 3 history; attack/tick microbenchmarks remain noise-sensitive.

The new 700th test is the repository contract guard. No gameplay version increment is warranted for this maintenance packet.

## Content-scale status remains unchanged

No canonical content records changed during this pass, so the Phase 0.8 census remains authoritative:

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

Mechanics-scale gate: **NOT READY**. Places already exceed their mechanics floor; abilities/techniques remain the largest relative gap.

## Phase 0.9 readiness finding

The current regional content-pack schema owns:

```text
places
routes
transportServices
ecologyFamilies
species
populations
gatheringSources
items
npcs
shops
recipes
quests
relationships
```

It does **not** yet own several families that Phase 0.9 must scale heavily:

```text
abilities / techniques
capability / training definitions
NPC schedules
companions
```

The validator therefore cannot yet provide the same regional stable-ID ownership, dependency and cross-reference guarantees for those families.

**Do not begin Phase 0.9 by mass-authoring those categories into parallel global lists.** The first future implementation packet should repair this production boundary first.

## Future implementation plan

Detailed planning is recorded in:

```text
docs/PHASE_0_9_IMPLEMENTATION_PLAN.md
```

Phase 0.9 and `0.9.100` remain **planned / not opened**. The plan does not authorize implementation by itself.

### Proposed first packet — Content Pack Scale Contract v2

After explicit Phase 0.9 opening:

1. decide/perform the recommended protected-main + required Check + PR-integration transition;
2. extend regional/shared pack ownership for abilities/techniques, capability/training references, NPC schedules and companions where appropriate;
3. extend collision/dependency/cross-reference validation and generated scale fixtures;
4. keep census counts tied to canonical playable content rather than pack bookkeeping;
5. preserve existing runtime authorities and current-schema policy;
6. decide Product/Package/Data/Game State changes from the actual implementation rather than planning them in advance.

A Data-version increase is plausible for the expanded stable content contract. Game State should remain unchanged unless the implementation adds genuinely new durable player/world facts.

### Following proposed Gate A tranches

After Pack v2 is proven:

```text
Redstone Forge-Road
  -> mining / production / shops / caravan logistics / equipment / techniques / contracts

Elderwood Hunt-Timber
  -> creatures / forestry / body recovery / food-material chains / field techniques / recurring people

Starfen Marshcraft-Practical Magic
  -> wetland ecology / herbs / medicine-cooking / practical magic / training / schedules / water context

Gate A integration
  -> audit / tests / Benchmark 3 / sample / census
```

The planning document uses a relative 12-week envelope after explicit opening: Weeks 1–2 Pack v2/governance, Weeks 3–5 Redstone, Weeks 6–8 Elderwood, Weeks 9–11 Starfen, Week 12 integration/census. These are planning bands, not delivery promises.

Proposed Gate A content bands are also recorded there; they are not quotas and must not be satisfied with disconnected filler.

## Current decision boundary

There is **no active implementation unit**.

```text
Phase 0.8:                  COMPLETE
Status audit:               COMPLETE
Repair/optimization pass:   COMPLETE
Future planning pass:       COMPLETE
Phase 0.9:                  PLANNED / NOT OPENED
Next proposed unit:         0.9.100 Content Scale Gate A
First proposed packet:      Content Pack Scale Contract v2
Known runtime blocker:      none
Open PRs:                   none
Highest strategic debt:     connected authored-content breadth / throughput
```

A future `continue` must not automatically open Phase 0.9. Implementation requires a new explicit work order.

## Authority decisions to preserve

- fictional simulation time remains separate from wall-clock scheduling;
- Game State 14 remains strict current-schema-only pre-alpha authority;
- `state.cultivation` remains durable authority for crop/delegation facts;
- direct production timed-task owners remain the audited existing owner set;
- `state.npcs`, `state.enemies`, top-level `state.log`, root player combat/stat caches and `activeBattle.rng` remain derived/transient;
- `state.events` remains persisted semantic observation history;
- regional content expansion must preserve original-world IDs and source/sink/cross-reference integrity;
- content scale is release progression evidence, not an excuse for disconnected filler.

## Deferred work — do not rediscover

- protected `main` / required Check / PR integration — recommended at explicit Phase 0.9 opening;
- manual deletion of stale historical remote branches;
- supported-save compatibility/migrations — later deliberate release-transition work unless explicitly requested earlier;
- dedicated browser E2E/accessibility program — proposed `0.9.700`;
- hard performance thresholds — deferred until representative evidence supports them;
- balance certification — deferred until sustained content-scale play exists;
- quality/HQ crafting depth — deferred until it creates real decisions;
- mounts/warehouses/large logistics — deferred until current logistics are stressed by content;
- deep romance framework — deferred until broader authored social life exists.

## Do not redo

Closed unless a concrete regression/change directly touches them:

```text
Phase 0.4–0.8 broad discovery
Phase 0.8 exit audit
post-0.8 current-status audit
late-0.8 persistence classification sequence
cultivation/delegation clock and ownership decisions
household/community authority discovery
obsolete baseline-pipeline archaeology
```

## Session status

```text
Documentation/planning tip before handoff: 7fca0f2added3a51b6e873208b145375a3c5d221
Frozen gameplay runtime:                  ca7d37c643adc4115b519148615f6120d03228df
Validated maintenance head:               c3d610e1f3820248a20de28bdc605e82da29e6f1
Product / Package:                         0.8.900.1 / 0.8.900
Account Save / Game State:                 5 / 14
Data / Benchmark:                          39 / 3
Maintenance Check:                         32398650493 success
Repository Audit:                          PASS
Tests:                                     700/700 passed
Benchmark 3 / Sample:                      success / success
Open PRs:                                  none
Active implementation:                     none
Next proposed unit:                        0.9.100 Content Scale Gate A
Next proposed unit status:                 planned, not opened
```
