# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.600.2
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     1
Codename:      Current Schema Cleanup
Compatibility: pre-release-current-schema
```

**Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. `0.8.600.2` is a maintenance/schema cleanup revision, not a new track.** The project remains pre-alpha and unreleased.

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`. `package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority.

## Independent schema/data versions

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 5 | local account/session/character registry contract |
| Game State | 6 | serialized character/world runtime contract |
| Data | 37 | canonical authored-data and stable-identifier contract |
| Benchmark | 1 | benchmark protocol/comparability |

Account Save changes when account/session registry semantics change materially. Game State changes when persisted runtime structure or meaning changes materially. Data changes when canonical authored-data shape/authority/content or stable identifiers change materially. Benchmark changes only when the benchmark workload/protocol stops being comparable.

Recent Data history:

- Data 31 — companion field-approach content plus character-facing place/POI cleanup;
- Data 32 — first home-infrastructure definition linking regional materials/project labor to Storage Chest capacity;
- Data 33 — original character names, starting-discipline kits, and authored origin openings;
- Data 34 — Joiner's Workbench furnishing/home-improvement definition plus explicit construction sinks for infrastructure goods;
- Data 35 — Field Satchel home-improvement/container semantics plus Resin-Cured Hide Binding construction sink;
- Data 36 — canonical recurring NPC-availability schedule data, beginning with Sera Talwin's Southgate duty window;
- Data 37 — canonical home furnishing/container identifier cleanup (`homeSafe`, `storage`, `fieldSatchel`, and `inventoryState.home`) replacing inherited `mog*` identifiers.

The original `0.8.600.1` Companion Convalescence promotion was a behavioral composition track and did not advance Data. The later `0.8.600.2` maintenance revision advances Data because stable canonical home/container identifiers change.

## Compatibility policy

Current mode is `pre-release-current-schema`.

Current-format save/load/validation/resume must be deterministic. **Old pre-alpha local saves/accounts are not a supported compatibility surface.** When a cleaner current schema materially improves the project, incompatible old registries/states may be rejected and reset rather than automatically migrated. Do not add compatibility-only duplicate state, aliases, fallback storage keys, lazy reconstruction, or adapter layers by reflex.

The generic ordered migration engine remains available for a future migration when compatibility is explicitly required or independently useful. Its existence does not make migration automatic.

## Release discipline

A coherent checkpoint requires a bounded player-facing implementation or maintenance contract, regression coverage, observed full Test and Benchmark gates, deliberate product/schema/data registration, synchronized authority docs, and a stop at the declared boundary. Do not claim test counts or performance figures that were not observed.

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

`carriedLoadEngine` derives actual occupied carried slots, `transportServiceBoardEngine` projects the fact, and `transportEngine` independently derives it at booking. Caller-provided cargo is ignored; service capacity is checked before fare deduction.

Checkpoint `4f8c0de9e6ba926ee903f5787d34cca73c40eb6d` — 507/507 tests, Benchmark 1, Product `0.8.300.1`, Data 34.

## `0.8.400` — Portable Field Logistics — complete

The Field Satchel is built through existing project/home authority and unlocked through inventory authority. Inventory→Field Satchel leaves total carried load unchanged; portable container→Home Safe reduces carried load. Promoted checkpoint `d1a43568c5ca4dd7e57fb86316b422c35025ce07`; Check `32080844409` completed successfully with Test and Benchmark steps green.

## `0.8.500` — Daily Social Availability — complete

```text
Product:       0.8.500.1
Package:       0.8.500
Account Save:  4
Game State:    5
Data:          36
Benchmark:     1
Codename:      Daily Social Availability
```

Data advanced `35 -> 36` because `0.8.500` added canonical authored NPC-schedule data. `npcScheduleEngine` derives current/next availability from that data and canonical fictional time. Locality/POI/commitment domain paths and browser/Journal projections consume the same authority; no schedule state is serialized.

Authoritative checkpoint `fde1d30d76264ea25af6bad4d829545c488eec9b` — 509/509 tests, Benchmark 1.

## `0.8.600` — Companion Convalescence — complete

### Original version decision

```text
Product:       0.8.600.1
Package:       0.8.600
Account Save:  4
Game State:    5
Data:          36
Benchmark:     1
Codename:      Companion Convalescence
Compatibility: pre-release-current-schema
```

No Data bump was required for the original companion-convalescence promotion: it added no authored gameplay record. No Game State bump was required because companion HP/MP, location, active membership, and recovery timed tasks already existed in Game State 5. Account Save and Benchmark remained unchanged.

### Authority decision

The defect was an authority gap rather than missing content. `joinCompanion` correctly rejected a recruited companion at 0 HP, but campaign recovery previously restored only active companions. An injured companion left inactive could therefore become permanently unavailable.

`campaignRecoveryEngine` v2 remains the one recovery authority. Settlement recovery now considers recruited companions physically present in the current safe settlement even when inactive. Field and defeat recovery keep their existing active-party scope. Settlement recovery still uses the existing `recovery.settlement` task and costs exactly 3600 fictional seconds.

`partyEngine` v0.3.0 additionally refuses to leave a 0-HP companion behind outside a safe settlement. The check occurs before membership/location mutation. Safe settlement separation remains valid, and recovery does not silently reactivate the companion; reunion stays an explicit party action.

A dependency-light `localityClassificationEngine` owns the shared safe-settlement predicate, while `localityEngine` re-exports it. This removes a party/locality import cycle without changing locality-navigation semantics.

### Original promoted runtime checkpoint

```text
04211e8909996b1ac34fa91ae1cdd7aa216b86f8
511/511 tests
0 failed
0 skipped
Benchmark 1 success
```

**PASS. `0.8.600` is closed. Phase 0.8 remains open.**

## `0.8.600.2` — Current Schema Cleanup — maintenance revision

### Version decision

```text
Product:       0.8.600.2
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     1
Codename:      Current Schema Cleanup
Compatibility: pre-release-current-schema
```

Account Save advances because the local account/session namespace and accepted registry contract are now strictly current. Game State advances because persisted inventory/home state and container identifiers change. Data advances because canonical furnishing/container stable identifiers change. Benchmark remains 1 because the workload is unchanged.

No migration is supplied. Older pre-alpha account registries and Game State payloads are rejected without rewriting them. The obsolete active save-migration module is removed; the generic migration engine remains available for a future deliberate compatibility requirement.

Relevant registrations changed by this maintenance revision:

```text
versionManifest:       0.8.600.2
homeInfrastructure:    0.4.0
workstations:          0.3.1
gameViewModels:        0.15.1
uiIntents:             0.10.1
accountSaves:          0.7.0
saveEncoding:          0.5.0
validation:            0.11.0
inventoryContainers:   0.7.0
inventoryTransfers:    0.7.0
homeStorage:           0.4.0
```

Validated cleanup runtime checkpoint `23c373310bac90b20e14b840cc4221e3ca648daf` passed Check run `32104815961` with 507/507 tests, 0 failures/skips, and Benchmark 1 success.

Benchmark 1 on that checkpoint:

```text
player combat profiles  0.465978 ms/op
enemy combat profiles   0.117722 ms/op
basic attacks            0.538805 ms/op
tick dispatch            0.004715 ms/op
direct route lookup      0.894560 ms/op
```

The test count is lower than `0.8.600.1` because obsolete save-migration integration tests were removed with the compatibility layer; current-schema rejection and round-trip coverage replaces the relevant persistence contract.

## Next Phase 0.8 decision

Do not automatically begin `0.8.700` or create passive companion healing/routine systems. The next work order should re-audit one bounded seam before implementation. Candidate families: agriculture/stewardship, earned automation, further companion/social-life breadth only with a concrete player decision and existing authority path, or another life/logistics seam only where an existing gap justifies it.

# Planned later phases

## 0.9 — Adventure depth and release hardening

Advanced regions/dungeons, combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, performance, and release tooling.

## 1.0 — Live foundation

Release when the persistent-life/adventure promise is coherent, durable, original, stable, performant, and supported by enough interconnected content for real play.

## Gate philosophy

Do not inflate version numbers to imply completion. Do not mass-author content merely to fill numeric ranges. Close a track or phase only when its player-facing gate and authority boundaries are coherent enough for the next bounded work order to build on safely.
