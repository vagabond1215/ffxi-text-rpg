# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.500.1
Package:       0.8.500
Account Save:  4
Game State:    5
Data:          36
Benchmark:     1
Codename:      Daily Social Availability
Compatibility: pre-release-current-schema
```

**Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.500` are complete and audited.** The project remains pre-alpha and unreleased.

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`. `package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority.

## Independent schema/data versions

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 4 | local account/session/character registry contract |
| Game State | 5 | serialized character/world runtime contract |
| Data | 36 | canonical authored-data contract |
| Benchmark | 1 | benchmark protocol/comparability |

Account Save changes when account/session registry semantics change materially. Game State changes when persisted runtime structure or meaning changes materially. Data changes when canonical authored-data shape/authority/content changes materially. Benchmark changes only when the benchmark workload/protocol stops being comparable.

Recent Data history:

- Data 31 — companion field-approach content plus character-facing place/POI cleanup;
- Data 32 — first home-infrastructure definition linking regional materials/project labor to Storage Chest capacity;
- Data 33 — original character names, starting-discipline kits, and authored origin openings;
- Data 34 — Joiner's Workbench furnishing/home-improvement definition plus explicit construction sinks for infrastructure goods;
- Data 35 — Field Satchel home-improvement/container semantics plus Resin-Cured Hide Binding construction sink;
- Data 36 — canonical recurring NPC-availability schedule data, beginning with Sera Talwin's Southgate duty window.

Game State remains 5 through Data 36. The Phase 0.8 additions reuse existing project records/data, furnishings, inventory containers/`unlocked`, transport journey data, production/work state, provenance, relationships/commitments, and canonical world time. `0.8.500` adds no serialized schedule state; availability is re-derived from fictional time. Account Save remains 4 because account/session/character-registry semantics are unchanged.

## Compatibility policy

Current mode is `pre-release-current-schema`. Current-format save/load/validation/resume must be deterministic. Old pre-alpha local saves/accounts may be reset when a cleaner schema materially improves the project. Do not add compatibility-only duplicate state or adapters by reflex.

## Release discipline

A coherent checkpoint requires a bounded player-facing implementation, regression coverage, observed full Test and Benchmark gates, deliberate product/schema/data registration, synchronized authority docs, and a stop at the declared boundary. Do not claim test counts or performance figures that were not observed.

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

```text
Product:       0.8.300.1
Package:       0.8.300
Account Save:  4
Game State:    5
Data:          34
Benchmark:     1
Codename:      Carried Load and Transport Logistics
```

No Data bump was required: this track repaired runtime authority rather than authored content. `carriedLoadEngine` derives actual occupied carried slots, `transportServiceBoardEngine` projects the fact, and `transportEngine` independently derives it at booking. Caller-provided cargo is ignored; service capacity is checked before fare deduction.

Checkpoint `4f8c0de9e6ba926ee903f5787d34cca73c40eb6d` — 507/507 tests, Benchmark 1.

## `0.8.400` — Portable Field Logistics — complete

```text
Product:       0.8.400.1
Package:       0.8.400
Account Save:  4
Game State:    5
Data:          35
Benchmark:     1
Codename:      Portable Field Logistics
```

Data advances `34 -> 35` because the track adds canonical Field Satchel improvement/container semantics and the Resin-Cured Hide Binding construction sink. The satchel is built through existing project/home authority and unlocked through inventory authority.

The cargo rule is explicit: Inventory→Field Satchel leaves total carried load unchanged; portable container→Home Safe reduces carried load. Promoted checkpoint `d1a43568c5ca4dd7e57fb86316b422c35025ce07`; Check `32080844409` completed successfully with Test and Benchmark steps green.

## `0.8.500` — Daily Social Availability — complete

### Version decision

```text
Product:       0.8.500.1
Package:       0.8.500
Account Save:  4
Game State:    5
Data:          36
Benchmark:     1
Codename:      Daily Social Availability
Compatibility: pre-release-current-schema
```

Data advances `35 -> 36` because `0.8.500` adds canonical authored NPC-schedule data. Game State remains 5 because the schedule does not add persisted runtime fields: availability is derived from existing canonical `worldTime.totalSeconds`. Account Save remains 4. Benchmark remains 1 because the benchmark protocol is unchanged.

### Authored-data contract

The first proving record is deliberately narrow:

```text
schedule-thornwall-sera-talwin
NPC:   npc-thornwall-sera-talwin
POI:   poi-sandoria-s-alaune
Place: thornwall-southgate
Daily: 08:00–18:00
```

`validateNpcScheduleCatalog()` validates schedule identity, canonical NPC/POI/place references, unique POI ownership, and well-formed/non-overlapping daily windows. It is owned by the NPC-schedule subsystem and is directly exercised by the end-to-end regression. The global `validation` registration remains `0.10.0`; the track does not duplicate schedule ownership there merely to manufacture another version bump.

### Authority decision

`npcScheduleEngine` is the one runtime availability authority. It derives current/next availability entirely from authored schedule data plus canonical fictional time. It creates no `state.npcSchedules` or second clock.

The same authority is consumed by:

- `localityEngine` v2 before a semantic scheduled-POI interaction can move/discover the character;
- `poiEngine` for command-path talk and POI actions;
- `commitmentEngine` v0.3.0 for accept, resolve, and follow-up giver context;
- `playerSocialScheduleEngine` for derived Journal blocking/recommendation;
- `gameViewModel` v0.14.0 for nearby schedule notes and suppression of dead contextual Talk actions.

Commitments remain obligation/reward authority; relationships remain social-continuity authority; schedule data only determines when the conversation is publicly available.

The current schedule contract is **availability at a static canonical NPC location**. It does not move Sera's persisted NPC location or implement autonomous multi-location routines.

### Current registrations

```text
versionManifest:          0.8.500.1
commitments:              0.3.0
relationships:            0.1.0
npcSchedules:             0.1.0
playerSocialSchedules:    0.1.0
localityNavigation:       0.2.0
gameViewModels:           0.14.0
validation:               0.10.0
```

Database registration:

```text
npcSchedules  implemented 0.1.0
```

### End-to-end gate

`tests/playerSocialScheduleFlow.test.js` proves:

- Sera is available at canonical 08:00 and her 08:00–18:00 window is visible;
- semantic locality interaction succeeds while available;
- at 18:30 both semantic and command-path talk are blocked with next-return guidance;
- blocked interaction does not move the character or create hidden time cost;
- commitment acceptance is independently blocked by domain authority while the giver is away;
- the browser retains useful away/return information while suppressing impossible contextual and Journal actions;
- save/load serializes fictional time but no schedule registry, then re-derives the same unavailable state;
- advancing to next-day 08:00 restores availability and commitment acceptance;
- schedule catalog, game state, and world data validations remain green.

### Regression and repair trail

The pre-promotion runtime passed 509/509 tests plus Benchmark 1. The first promoted run then exposed one historical Phase 0.7 assertion that froze `SYSTEM_VERSIONS.commitments` at exactly `0.2.0`. Since `0.8.500` legitimately extends that shared authority, the historical gate was changed to require a compatible minimum (`>= 0.2.0`), matching existing precedent for later shared-system evolution. No historical gameplay behavior was weakened.

### Authoritative promoted runtime checkpoint

```text
fde1d30d76264ea25af6bad4d829545c488eec9b
509/509 tests
0 failed
0 skipped
Benchmark 1 success
```

Benchmark 1:

```text
1,000 player combat profiles      367.612ms  0.367612ms/op
1,000 enemy combat profiles       101.654ms  0.101654ms/op
1,000 basic attacks               434.260ms  0.434260ms/op
10,000 ticks / 5 subscribers       43.213ms  0.004321ms/op
10,000 direct route lookups      6877.677ms  0.687768ms/op
```

**PASS. `0.8.500` is closed. Phase 0.8 remains open.**

## Next Phase 0.8 decision

Do not automatically begin `0.8.600` or mass-author more schedules. The next work order should re-audit one bounded seam before implementation. Candidate families: agriculture/stewardship, companion-life breadth, earned automation, additional social-life breadth with a concrete decision/authority path, or another life/logistics seam only where an existing gap justifies it.

# Planned later phases

## 0.9 — Adventure depth and release hardening

Advanced regions/dungeons, combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, performance, and release tooling.

## 1.0 — Live foundation

Release when the persistent-life/adventure promise is coherent, durable, original, stable, performant, and supported by enough interconnected content for real play.

## Gate philosophy

Do not inflate version numbers to imply completion. Do not mass-author content merely to fill numeric ranges. Close a track or phase only when its player-facing gate and authority boundaries are coherent enough for the next bounded work order to build on safely.
