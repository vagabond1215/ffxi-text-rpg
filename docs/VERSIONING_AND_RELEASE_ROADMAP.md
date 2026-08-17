# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.400.1
Package:       0.8.400
Account Save:  4
Game State:    5
Data:          35
Benchmark:     1
Codename:      Portable Field Logistics
Compatibility: pre-release-current-schema
```

**Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.400` are complete and audited.** The project remains pre-alpha and unreleased.

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`. `package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority.

## Independent schema/data versions

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 4 | local account/session/character registry contract |
| Game State | 5 | serialized character/world runtime contract |
| Data | 35 | canonical authored-data contract |
| Benchmark | 1 | benchmark protocol/comparability |

Account Save changes when the account/session registry changes materially. Game State changes when persisted runtime structure or meaning changes materially. Data changes when canonical authored-data shape/authority/content changes materially. Benchmark changes only when the workload/protocol changes enough that previous results stop being comparable.

Recent Data history:

- Data 31 — companion field-approach content plus character-facing place/POI cleanup;
- Data 32 — first home-infrastructure definition linking regional materials/project labor to Storage Chest capacity;
- Data 33 — original character names, starting-discipline kits, and authored origin openings;
- Data 34 — Joiner's Workbench furnishing/home-improvement definition plus explicit construction sinks for infrastructure goods;
- Data 35 — Field Satchel home-improvement/container semantics plus Resin-Cured Hide Binding construction sink.

Game State remains 5 through Data 35 because the Phase 0.8 additions reuse existing project records/data, placed furnishing IDs, inventory containers and their existing `unlocked` field, transport journey data, production/work state, and provenance. Account Save remains 4 because account/session/character-registry semantics are unchanged.

## Compatibility policy

Current mode is `pre-release-current-schema`. Current-format save/load/validation/resume must be deterministic. Old pre-alpha local saves/accounts may be reset when a cleaner schema materially improves the project. Do not add compatibility-only duplicate state or adapters by reflex.

## Release discipline

A coherent checkpoint requires a bounded player-facing implementation, regression coverage, observed full Check/Test and Benchmark gates, deliberate product/schema/data registration, synchronized authority docs, and a stop at the declared boundary. Do not claim a test count or performance figure that was not retained in observed evidence.

# Phase history

Phases 0.4, 0.5, and 0.6 established foundation, deterministic simulation/content substrate, and integrated character/mechanics. Phase 0.7 closed the multi-region playable-alpha proof at Product `0.7.400.1`, Data 31, checkpoint `1e217fe1f7e62593fa9ed33eebdf1b3878490336`, with 495/495 tests and Benchmark 1 success.

Later shared-authority revisions do not reopen historical phase gates.

# Phase 0.8 — Life and infrastructure expansion — in progress

## `0.8.100` — Home Foothold & Infrastructure — complete

Storage Chest: 2 Resin-Sealed Hardwood Boards + 1 Redstone Copper Ingot + 30 minutes project labor → exactly-once furnishing, storage 3→8. Original checkpoint `0b9251a43285443087050127da36b977cabdf7ee`, Product `0.8.100.1`, Data 32, 496/496 tests, Benchmark 1.

`0.8.100.2` closed onboarding/creator polish at checkpoint `0f00ef68a01ad001063803d67ff0efffc48ab3ef`, Data 33, 505/505 tests, Benchmark 1.

## `0.8.200` — Home Workshop Capability — complete

Joiner's Workbench: 2 Resin-Sealed Hardwood Boards + 1 Copper Trail Clasp + 45 minutes labor → locality-bound `woodshop`/`workshop` context with zero hidden storage. Existing production/mastery/provenance authorities remain canonical.

Checkpoint `03ab71c7e96c54eaeffb75598ed01243fd390f21`, Product `0.8.200.1`, Package `0.8.200`, Data 34, 506/506 tests, Benchmark 1.

## `0.8.300` — Carried Load & Transport Logistics — complete

### Version decision

```text
Product:       0.8.300.1
Package:       0.8.300
Account Save:  4
Game State:    5
Data:          34
Benchmark:     1
Codename:      Carried Load and Transport Logistics
```

No Data bump was required: this track repaired runtime authority rather than authored content. Scheduled transport already had cargo allowances; the defect was that caller/UI payload supplied the cargo number.

### Authority decision

`carriedLoadEngine` derives actual occupied carried slots from canonical inventory. `transportServiceBoardEngine` uses that value for player-facing quotes/blockers, and `transportEngine` independently derives it again at booking. Caller-provided `cargoUnits` is ignored. Cargo capacity is checked before fare deduction and the journey records the canonical booked load.

This makes home storage operationally meaningful: goods stored at home stop counting as carried cargo. No persisted weight state, cargo currency, separate warehouse ledger, or UI-owned transport state was added.

### Registrations

```text
versionManifest:          0.8.300.1
transport:                0.3.0
carriedLoad:              0.1.0
transportServiceBoard:    0.2.0
```

### Promoted checkpoint

```text
4f8c0de9e6ba926ee903f5787d34cca73c40eb6d
507/507 tests
0 failed
0 skipped
Benchmark 1 success
```

Benchmark 1:

```text
player combat profiles  0.492450 ms/op
enemy combat profiles   0.117547 ms/op
basic attacks            0.588062 ms/op
tick dispatch            0.005528 ms/op
direct route lookup      0.902781 ms/op
```

**PASS. `0.8.300` is closed.**

## `0.8.400` — Portable Field Logistics — complete

### Version decision

```text
Product:       0.8.400.1
Package:       0.8.400
Account Save:  4
Game State:    5
Data:          35
Benchmark:     1
Codename:      Portable Field Logistics
Compatibility: pre-release-current-schema
```

Data advances `34 -> 35` because the track adds canonical authored Field Satchel improvement/container semantics and the Resin-Cured Hide Binding construction sink. Game State remains 5 because container unlock uses the existing `unlocked` field and construction uses existing project records. Account Save remains 4.

### Player-facing contract

```text
Make a Field Satchel
  2 Resin-Cured Hide Bindings
  1 Copper Trail Clasp
  30 minutes project labor
    -> unlock Field Satchel
    -> 8 portable slots
```

The satchel is implemented through the existing home-infrastructure/project/timed-task adapter. Inventory remains authority for unlock/access/capacity/transfer.

The cargo rule is explicit:

```text
Inventory -> Field Satchel       carried cargo unchanged
portable container -> Home Safe carried cargo decreases
```

`carriedLoadEngine` v2 sums every unlocked authored container marked `countsAsCarriedCargo`. Portable capacity therefore supports longer field loops without becoming an exploit for scheduled-transport limits.

### Current registrations

```text
versionManifest:          0.8.400.1
homeInfrastructure:       0.3.0
activityAdvance:          0.5.0
productionItems:          0.4.0
carriedLoad:              0.2.0
transport:                0.3.0
transportServiceBoard:    0.2.0
inventoryContainers:      0.6.0
inventoryTransfers:       0.6.0
workstations:             0.3.0
settlementServiceBoard:   0.2.0
```

### Regression and repair trail

The first `0.8.400` pre-promotion validation exposed one stale `0.8.100` text assertion: the chest remained functionally correct but its generalized completion sentence no longer matched an old exact phrase. The regression was updated to assert the stable semantic fact rather than a historical verb. No gameplay authority was weakened.

A briefly drafted standalone portable-logistics project/catalog adapter was removed before validation because it duplicated the existing home-infrastructure/project authority. The final track has one construction authority and one inventory authority.

### Authoritative promoted runtime checkpoint

```text
d1a43568c5ca4dd7e57fb86316b422c35025ce07
Product 0.8.400.1
Package 0.8.400
Data 35
Account Save 4
Game State 5
Benchmark 1
```

Promoted Check run `32080844409` completed **SUCCESS**. The Test and Benchmark workflow steps both completed successfully. Exact test-count/timing lines are not claimed because they were not retained in the available connector evidence.

**PASS. `0.8.400` is closed. Phase 0.8 remains open.**

## Next Phase 0.8 decision

Do not automatically begin `0.8.500`. The next work order should re-audit one bounded seam before implementation. Candidate families: agriculture/stewardship, social schedules/relationship life, companion life breadth, earned automation, or another logistics segment only when an existing authority gap justifies it.

# Planned later phases

## 0.9 — Adventure depth and release hardening

Advanced regions/dungeons, combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, performance, and release tooling.

## 1.0 — Live foundation

Release when the persistent-life/adventure promise is coherent, durable, original, stable, performant, and supported by enough interconnected content for real play.

## Gate philosophy

Do not inflate version numbers to imply completion. Do not mass-author content merely to fill numeric ranges. Close a track or phase only when its player-facing gate and authority boundaries are coherent enough for the next bounded work order to build on safely.
