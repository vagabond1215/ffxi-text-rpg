# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions: `docs/THREAD_HANDOFF.md`, `docs/EXECUTION_PIPELINE.md`, `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, and `docs/PHASE_0_8_EXIT_GATE.md`.

## Current baseline

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
Phase:         0.8 complete
```

Exact frozen runtime:

```text
ca7d37c643adc4115b519148615f6120d03228df
```

Hosted Check `32395768383` passed 699/699 tests, Benchmark 3 and Benchmark Sample on Node 24.19.0. Phase-exit validation Check `32395959505` additionally passed Content Census and Hardening. Validation-only PR #380 is closed without merge.

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`.

`package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority. Planning a track does not open its runtime version; implementation does.

## Independent contract versions

| Version | Current value | Purpose |
| --- | ---: | --- |
| Account Save | 5 | local account/session/character registry contract |
| Game State | 14 | serialized character/world runtime contract |
| Data | 39 | canonical authored-data and stable-identifier contract |
| Benchmark | 3 | workload/measurement comparability contract |

These advance independently.

## Persistence-version history

- `.34`: atlas timing uses canonical `visitedAtWorldSeconds` — **Game State 6 -> 7**.
- `.39`: root player combat/stat caches leave serialized authority — **7 -> 8**.
- `.41`: persisted statuses use canonical nested modifier blocks — **8 -> 9**.
- `.50`: reconstructible `state.npcs` leaves serialized authority — **9 -> 10**.
- `.51`: reconstructible `state.enemies` leaves serialized authority — **10 -> 11**.
- `.52`: session command presentation history leaves serialized authority — **11 -> 12**.
- `0.8.700.1`: required durable cultivation plot/crop authority introduced — **12 -> 13**.
- `0.8.800.1`: paid pending cultivation delegation appointment introduced — **13 -> 14**.
- `0.8.900.1`: no Game State change; existing commitment/relationship/schedule contracts own the new social content.

Under the pre-alpha policy, no automatic migrations were added for these transitions.

## Why Game State 14

Game State 13 made `state.cultivation` required durable authority because crop lifecycle facts encode consumed physical input, elapsed growth boundaries, tending state, harvest replay protection and provenance that cannot be reconstructed safely.

Game State 14 adds the paid pending routine-delegation appointment under cultivation authority. Once the player spends the wage, the assignment must survive save/load without duplicate charging or ambiguous completion.

Required cultivation/delegation facts include the established plot/crop fields plus bounded delegation state such as cycle identity, scheduled/completion boundaries, wage and exactly-once completion bookkeeping.

Growth itself still owns no long-lived timed task.

## Why Data 39

Data 38 established stable cultivation identifiers, including the persistent work-proficiency id `cultivation`.

Data 39 expands canonical authored identity for Household & Community Continuity: persistent NPC-backed local contacts, their fictional-time schedules, and the new home-produce commitment definitions.

The item remains the existing canonical Elderwood Sweetroot. Home-grown identity is carried through provenance source `plot-home-sweetroot-bed`; no duplicate crop item is introduced.

## Compatibility policy

Mode: `pre-release-current-schema`.

1. Account/session payloads must match Account Save 5 exactly.
2. Character payloads must match Game State 14 exactly.
3. Required authority must be complete before revival or `ensure*` normalization.
4. `state.cultivation` is required and validated before runtime access.
5. Optional state may be absent only where its domain contract explicitly allows absence.
6. Active owner/task links must reference persisted current owner/task records.
7. Crop growth and delegated-tending timing derive from canonical fictional time; no offline/wall-clock simulation is authoritative.
8. Incompatible, incomplete, malformed, or legacy-shaped saves are rejected rather than migrated.
9. Root player caches, `state.npcs`, `state.enemies`, top-level `state.log`, and `activeBattle.rng` remain derived/transient.
10. Supported-save migrations remain deferred until explicit release-transition work unless a future work order changes policy.

## Current raw validation families

Required persisted families include:

```text
world time / simulation control / timed tasks
active travel and owner/task links
projects / commitments / relationships
resource opportunities / ecology
cultivation plot/crop/delegation authority
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

## Phase 0.8 version decisions

| Track | Product | Package | Game State | Data | Main reason |
| --- | --- | --- | ---: | ---: | --- |
| `0.8.700` | `0.8.700.1` | `0.8.700` | 13 | 38 | durable cultivation + stable cultivation identifiers |
| `0.8.800` | `0.8.800.1` | `0.8.800` | 14 | 38 | durable paid pending delegation appointment |
| `0.8.900` | `0.8.900.1` | `0.8.900` | 14 | 39 | authored NPC/schedule/commitment identity expansion |

Account Save remains 5 and Benchmark remains 3 throughout these tracks.

## Cultivation/delegation ownership contract

```text
canonical world time
  -> determines tend-due / helper-complete / harvest-ready state

inventory
  -> owns physical propagation root and harvested Sweetroots

state.cultivation
  -> owns plot/crop lifecycle facts, seed provenance and paid delegation appointment

workTaskEngine
  -> owns only manual short preparation/tending labor tasks

work proficiency
  -> owns player cultivation mastery / duration efficiency

resource provenance
  -> distinguishes cultivated output while retaining canonical item identity
```

There is no crop/helper background task, offline clock, growth wallet, parallel inventory, or helper mastery counter.

## Semantic UI contract

Canonical semantic results still use:

```text
ok
action
code
outcome
data
display
```

Current direct player intents include:

```text
cultivation.prepare
cultivation.plant
cultivation.tend
cultivation.harvest
commitment.accept
commitment.resolve
commitment.followUp
```

Domain logic does not parse presentation prose.

## Runtime/tooling baseline

Hosted `Check` uses Node 24 and normally runs:

```text
npm test
npm run benchmark
npm run benchmark:sample
```

Additional progression/hardening commands are:

```text
npm run census
npm run hardening
```

The Phase 0.8 exit validation branch ran all five gates successfully. Census breadth targets remain progression indicators, not ordinary CI thresholds.

## Benchmark protocol

Benchmark 3 remains the current comparability contract. No hard timing thresholds are accepted.

Frozen-runtime sample medians/spreads from Check `32395768383`:

```text
player profiles  0.359735 ms/op    6.77%
enemy profiles   0.068665 ms/op    8.93%
basic attacks    0.001223 ms/op  172.92%
tick dispatch    0.000821 ms/op   27.23%
route lookup     0.007260 ms/op    6.40%
```

The attack/tick microbenchmarks remain noise-sensitive. Do not derive CI thresholds from them.

## Historical late-0.8 checkpoints

| Contract | PR | Exact validated head | Check |
| --- | ---: | --- | ---: |
| Derived NPC World Projection `.50` | #374 | `181bc67b69172390d1a59fa3dfca35980a026b3d` | `32292959171` |
| Derived Enemy Encounter Projection `.51` | #375 | `5a97a109d9476438d001ee75b8e20293f57360dd` | `32297557960` |
| Transient Command Presentation Log `.52` | #376 | `0fb444aee8b6dbd3a35bb1d3b7662728d85fd691` | `32301160532` |
| C0 continuation/content census | #377 validation-only | `b0c1e067a1907a8587a08a128126f9207c6d6134` | `32308719621` |
| Cultivation & Stewardship `0.8.700.1` | #378 | landed before later tracks | validated |
| Earned Routine Delegation `0.8.800.1` | #379 validation-only | `951de1c4cf03677e66bd67dae82bd8d45a754b68` | `32392693654` |
| Household & Community Continuity `0.8.900.1` | #380 validation-only | `ca7d37c643adc4115b519148615f6120d03228df` | `32395768383` |
| Phase 0.8 exit validation | #380 validation-only instrumentation | runtime remains `ca7d37c643adc4115b519148615f6120d03228df` | `32395959505` |

## Release discipline

A coherent implementation checkpoint requires one bounded contract, focused deterministic regression coverage, full hosted Test + current Benchmark evidence when material, deliberate independent version decisions, and an exact frozen implementation SHA before documentation synchronization. `docs/THREAD_HANDOFF.md` is updated last.

Validation-only PRs are closed without merge after evidence collection. Documentation synchronization after a frozen implementation does not create a new runtime checkpoint.

## Phase 0.9 planning envelope

Phase 0.9 is **planned but not opened**.

```text
0.9.100 content-scale gate A
0.9.200 deeper adventure vertical slices
0.9.300 advanced combat/training
0.9.400 economy/production depth
0.9.500 quest/social depth
0.9.600 playable-alpha content-scale push
0.9.700 browser E2E/accessibility hardening
0.9.800 supported persistence/release transition
0.9.900 release-candidate soak/performance/release hardening
```

At explicit Phase 0.9 opening, revisit protected `main` + required green Check + PR-based integration. Do not change governance or open runtime `0.9.x` merely because the plan exists.

## 1.0 — Live foundation

Release when the persistent-life/adventure promise is coherent, durable, original, stable, performant, usable through ordinary browser play, and supported by enough interconnected content for sustained play. Calendar targets remain planning envelopes, not commitments.
