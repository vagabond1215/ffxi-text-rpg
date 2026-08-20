# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions: `docs/THREAD_HANDOFF.md`, `docs/EXECUTION_PIPELINE.md`, `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, and `docs/ROADMAP.md`.

## Draft 0.8.700 baseline

Draft PR #378 is open and unmerged. Its proposed runtime baseline is:

```text
Product:       0.8.700.1
Package:       0.8.700
Account Save:  5
Game State:    13
Data:          38
Benchmark:     3
Codename:      Cultivation & Stewardship
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Exact validated implementation head:

```text
c125f7ae5f94800893dc28c7fa0ceb61553e3db8
PR #378 draft, open, unmerged
Check 32340190710
Job 96337561458
Node 24.19.0
695/695 tests
Benchmark 3 success
Benchmark Sample success
```

Until #378 is explicitly merged, `main` remains on Product `0.8.600.52` / Game State 12 / Data 37.

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`.

`package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority. Planning a track does not open its runtime version; implementation does.

## Independent contract versions

| Version | #378 value | Purpose |
| --- | ---: | --- |
| Account Save | 5 | local account/session/character registry contract |
| Game State | 13 | serialized character/world runtime contract |
| Data | 38 | canonical authored-data and stable-identifier contract |
| Benchmark | 3 | workload/measurement comparability contract |

These advance independently.

## Persistence-version history

- `.34`: atlas timing uses canonical `visitedAtWorldSeconds` — **Game State 6 -> 7**.
- `.39`: root player combat/stat caches leave serialized authority — **7 -> 8**.
- `.41`: persisted statuses use canonical nested modifier blocks — **8 -> 9**.
- `.50`: reconstructible `state.npcs` leaves serialized authority — **9 -> 10**.
- `.51`: reconstructible `state.enemies` leaves serialized authority — **10 -> 11**.
- `.52`: session command presentation history leaves serialized authority — **11 -> 12**.
- `0.8.700.1`: required durable cultivation plot/crop authority is introduced — **12 -> 13**.

Under the pre-alpha policy, no automatic migrations were added for these transitions.

## Why Game State 13

`0.8.700` introduces new durable character/world facts that cannot be safely reconstructed from other authority:

```text
state.cultivation.version
state.cultivation.plot.id
state.cultivation.plot.homePlaceId
state.cultivation.plot.phase
state.cultivation.plot.cycle
state.cultivation.plot.harvestCount
state.cultivation.plot.activeWorkId / activeWorkKind when labor is active
state.cultivation.plot.preparedAtWorldSeconds
state.cultivation.plot.lastHarvestedAtWorldSeconds
state.cultivation.plot.crop when growing:
  itemId / cycle
  plantedAtWorldSeconds
  tendDueAtWorldSeconds
  readyAtWorldSeconds
  tendedAtWorldSeconds
  seedProvenance
```

Those fields determine whether the player has consumed a propagation input, whether tending is due, when harvest may occur, whether harvest has already occurred, and what provenance must flow into output. Treating them as reconstructible would permit duplication or loss of player work.

Raw Game State 13 validation therefore requires `state.cultivation` before runtime normalization and rejects forged crop timing or malformed active-work links.

## Why Data 38

The feature adds the stable persistent work-proficiency identifier:

```text
cultivation
```

It also establishes the stable cultivation state/plot contract and semantic action/event vocabulary. This is a canonical data/identifier expansion, so Data advances 37 -> 38.

## Compatibility policy

Mode: `pre-release-current-schema`.

On #378:

1. Account/session payloads must match Account Save 5 exactly.
2. Character payloads must match Game State 13 exactly.
3. Required authority must already be complete before revival or `ensure*` normalization.
4. `state.cultivation` is required and validated before runtime access.
5. Optional state may be absent only where its domain contract explicitly allows absence.
6. If cultivation has active hands-on work, its `activeWorkId` must reference the persisted active work registry record and existing timed-task ownership chain.
7. Growth itself owns no timed task; elapsed growth derives from canonical fictional timestamps.
8. Incompatible, incomplete, malformed, or legacy-shaped saves are rejected rather than migrated.
9. Root player caches, `state.npcs`, `state.enemies`, top-level `state.log`, and `activeBattle.rng` remain derived/transient as previously documented.
10. Supported-save migrations remain deferred until the explicit release-transition work unless a future work order changes policy.

## Game State 13 raw validation families

```text
world time / simulation control / timed tasks
active Travel State 2 and owner/task links
projects / commitments / relationships
resource opportunities / ecology
cultivation plot/crop authority
party / ability runtime
semantic events
atlas and POI discovery
player envelope / identity / key items / flags
player progression / training / skills / capabilities
player inventory / mutable resources / wallet
equipment / canonical statuses
top-level world flags
current location/position coherence
combat identity sequence
active battle and deterministic encounter combat/stat snapshots
active battle player / root player live-authority coherence
```

Optional persisted authority remains:

```text
state.work
player.progression.workProficiencies
state.dayCycle
```

`state.work` becomes concretely required by cross-link validation while `state.cultivation.plot.activeWorkId` is non-null.

## 0.8.700 authority/version decisions

| Contract | Decision |
| --- | --- |
| Product | `0.8.700.1` because a new feature track is implemented |
| Package | `0.8.700` |
| Account Save | unchanged at 5; account envelope did not change |
| Game State | 12 -> 13 for required cultivation authority |
| Data | 37 -> 38 for stable cultivation proficiency/state identifiers |
| Benchmark | unchanged at 3; workloads/protocol are unchanged |
| Save migration | none; current-schema-only pre-alpha policy |

Subsystem manifest changes include `cultivation: 0.1.0`, work proficiency expansion, activity-advance cultivation reconciliation, semantic game-view/UI intent support, and stricter validation.

## Cultivation ownership contract

```text
canonical world time
  -> determines tend-due / harvest-ready state

inventory
  -> owns physical propagation root and harvested Sweetroots

state.cultivation
  -> owns plot/crop lifecycle facts and seed provenance during growth

workTaskEngine
  -> owns only short preparation/tending labor tasks

work proficiency
  -> owns cultivation mastery / duration efficiency

resource provenance
  -> distinguishes cultivated output while retaining the same canonical item id
```

There is no crop-owned background task, offline clock, growth wallet, or parallel inventory.

## ActionResult and semantic UI

Canonical semantic results still use:

```text
ok
action
code
outcome
data
display
```

Cultivation player actions are semantic intents rather than generated command strings:

```text
cultivation.prepare
cultivation.plant
cultivation.tend
cultivation.harvest
```

Domain logic continues to avoid presentation-prose parsing.

## Runtime/tooling baseline

Hosted `Check` uses Node 24 and runs:

```text
npm test
npm run benchmark
npm run benchmark:sample
```

Developer progression tooling additionally provides `npm run census`. The census is informational; future breadth targets do not fail CI because they remain unfinished.

## Benchmark protocol

Benchmark 3 remains the current comparability contract; `0.8.700` does not change its workloads or measurement rules.

Exact #378 single-run evidence:

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

No hard timing threshold is accepted.

## Historical late-0.8 checkpoints

| Contract | PR | Exact validated head | Check |
| --- | ---: | --- | ---: |
| Derived NPC World Projection `.50` | #374 | `181bc67b69172390d1a59fa3dfca35980a026b3d` | `32292959171` |
| Derived Enemy Encounter Projection `.51` | #375 | `5a97a109d9476438d001ee75b8e20293f57360dd` | `32297557960` |
| Transient Command Presentation Log `.52` | #376 | `0fb444aee8b6dbd3a35bb1d3b7662728d85fd691` | `32301160532` |
| C0 continuation/content census | #377 validation-only | `b0c1e067a1907a8587a08a128126f9207c6d6134` | `32308719621` |
| Cultivation & Stewardship `0.8.700.1` | #378 draft | `c125f7ae5f94800893dc28c7fa0ceb61553e3db8` | `32340190710` |

## Release discipline

A coherent implementation checkpoint requires one bounded contract, focused deterministic regression coverage, full hosted Test + current Benchmark evidence when material, deliberate independent version decisions, and an exact frozen implementation SHA before documentation synchronization. `docs/THREAD_HANDOFF.md` is updated last.

A green feature PR is **not** equivalent to a landed release. If #378 remains open, a future thread must resolve its landing state before starting `0.8.800` by default.

## Next Phase 0.8 unit

`0.8.800 — Earned Routine Delegation` is the recommended next bounded unit **only after 0.8.700 lands**. It should delegate one proven routine—preferably a cultivation chore—without free resources, a second clock, or a generic automation platform.

`0.8.900 — Household & Community Continuity` and the Phase 0.8 exit audit remain queued after that.

## Phase 0.9 planning envelope

```text
0.9.100 content-scale gate A
0.9.200 deeper adventure vertical slices
0.9.300 advanced combat/training
0.9.400 economy/production depth
0.9.500 quest/social depth
0.9.600 playable-alpha content-scale push
0.9.700 browser E2E/accessibility hardening
0.9.800 supported persistence + protected-main transition
0.9.900 release-candidate soak/performance/release hardening
```

See `docs/EXECUTION_PIPELINE.md` for statuses and deferred work.

## 1.0 — Live foundation

Release when the persistent-life/adventure promise is coherent, durable, original, stable, performant, usable through ordinary browser play, and supported by enough interconnected content for sustained play. Calendar targets remain planning envelopes, not commitments.
