# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md`
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
- `docs/ROADMAP.md`
- `docs/THREAD_HANDOFF.md`

## Current baseline

```text
Product:       0.7.100.1
Package:       0.7.100
Account Save:  4
Game State:    5
Data:          30
Benchmark:     1
Codename:      Playable Campaign Slice
Compatibility: pre-release-current-schema
```

Phase 0.6 is complete. Phase 0.7 remains in progress. The bounded `0.7.100` playable-campaign track is complete.

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`. `package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority.

## Independent schema/data versions

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 4 | local account/session/character registry contract |
| Game State | 5 | serialized character/world runtime contract |
| Data | 30 | canonical authored-data contract |
| Benchmark | 1 | benchmark protocol/comparability |

Account Save changes when the local account/session registry changes materially. Game State changes when persisted game-state structure or meaning changes materially. Data changes when canonical authored-data shape/authority/content changes materially. Benchmark changes only when the workload/protocol changes enough that prior results stop being comparable.

Recent Data history:

- Data 20 — character capability learning/use;
- Data 21 — original magic/active abilities;
- Data 22 — enemy ability/combat data;
- Data 23 — equipment/field-tool/shop breadth;
- Data 24 — production/process/output;
- Data 25 — regional ecology/resource breadth;
- Data 26 — persistent companion definitions;
- Data 27 — Phase 0.7 player-experience content/opportunity/regional-loop contract;
- Data 28 — canonical commitment definitions + general persistent NPC relationship/follow-up contract;
- Data 29 — commitment catalog v2, Reader Soli Venn, `Marrowleaf for the Ward`, raw-resource/source/return guidance;
- Data 30 — Sera Talwin plus `Sweetroot for Southgate`, completing the three-origin authored community-continuity set without changing commitment catalog v2 shape.

PX-9 does **not** advance Data because the route/service catalog is unchanged. Its service board is derived presentation over existing Data 30 records. It does not advance Game State because no new persisted field or meaning is introduced.

## Compatibility policy

Current mode remains `pre-release-current-schema`. Current-format save/load/validation/resume must be deterministic. Old pre-alpha local saves/accounts may be reset when a cleaner schema materially improves the project. Do not add compatibility-only duplicate state or adapters by reflex.

## Release discipline

A coherent checkpoint requires bounded implementation/tests, observed full suite, observed benchmark, browser/build/deploy verification where applicable, deliberate product/schema/data registration, synchronized docs, and a stop at the declared boundary.

A product milestone advances only when its player-facing gate closes. Closing a Phase 0.7 track does not imply the entire phase is complete.

## Phase history

### 0.4 — Foundation — complete

Direction lock, version protocol, persistence migrations, structured action results/events, architecture stabilization.

### 0.5 — Simulation/content substrate — complete

Fictional time, scheduler/pause, timed tasks, interrupts, day review, original-world identity, provenance/projects, ecology/gathering, routes/transport, content packs, validation.

### 0.6 — Integrated character/mechanics — complete

| Track | Contract | Result |
| --- | --- | --- |
| `0.6.100` | Continuous-character stats/progression | Data 19 |
| `0.6.200` | skills/proficiencies/disciplines/capabilities | Data 20 |
| `0.6.250` | semantic DOM UI | Data 20 |
| `0.6.300` | original magic/ability engine | Data 21 |
| `0.6.400` | Combat 2.0 | Data 22 |
| `0.6.450` | locality/exploration navigation | Data 22 |
| `0.6.500` | equipment/field tools | Data 23 |
| `0.6.600` | gathering/production/crafting | Data 24 |
| `0.6.700` | regional ecology/resources | Data 25 |
| `0.6.800` | persistent companions/party | Data 26 |
| `0.6.900` | integrated mechanics exit gate | Product `0.6.900.1` / Data 26 |

## Phase 0.7 current registrations

```text
versionManifest:              0.7.100.1
activityAdvance:              0.2.0
campaignRecovery:             0.1.0
characterActivity:            0.2.0
commitments:                  0.2.0
relationships:                0.1.0
dayCycle:                     0.2.0
resourceRecoveryWork:         0.3.0
transport:                    0.2.0
transportServiceBoard:        0.1.0
gameViewModels:               0.9.0
playerExperience:             0.3.0
playerOpportunities:          0.2.0
playerContinuity:             0.5.0
playerCampaignReadability:    0.2.0
playerDangerRecovery:         0.2.0
domUi:                        0.7.0
uiIntents:                    0.6.0
```

### Phase 0.7 decision sequence

- **PX-1/PX-2/PX-3:** Data 27 established origin experience, actionable opportunity projection, starter-tool flow, and the first Brasshaven/Redstone regional loop.
- **PX-4:** Data 28 added canonical commitment definitions and persistent general NPC relationship/follow-up authority; provenance-safe stacking/delivery was hardened.
- **PX-5:** no schema/data bump; campaign readability is derived and transport authority remains canonical.
- **PX-6:** no schema/data bump; recovery reuses timed-task/battle state and aftermath is derived.
- **Player-language hygiene:** no Data/Game State bump; ordinary presentation stops exposing internal rationale.
- **PX-7:** Data 29; Reader Soli Venn and `Marrowleaf for the Ward` establish the second persistent community. `playerContinuity 0.5.0` becomes generic over actually known commitment definitions.
- **PX-8:** Data 30; Sera Talwin and `Sweetroot for Southgate` establish third-origin several-day continuity without changing commitment schema or persistence shape.
- **PX-9:** no Data/Game State bump. `transportServiceBoard 0.1.0` derives actual scheduled-service choices from the existing route catalog and state. `gameViewModels` advances to `0.9.0` because generic scheduled transport is now exposed through ordinary semantic context actions.

## `0.7.100` — Playable campaign slice — complete

PX-1 through PX-9 jointly prove the milestone: three origin/community continuity loops, competing livelihood/social/danger choices, production, combat/recovery, acquired-knowledge readability, semantic scheduled transport across the connected proving graph, current-version save/load, and provenance/one-time ownership.

PX-9 removes the final audited access blocker by making the existing Crown-Forge and Forge-Mere scheduled service graph generically reachable through browser context/Travel Desk presentation while leaving `transportEngine` authoritative.

Product therefore advances:

```text
0.6.900.1 -> 0.7.100.1
package     -> 0.7.100
codename    -> Playable Campaign Slice
```

The milestone remains pre-alpha (`released: false`). Phase 0.7 itself remains open for additional depth.

## Authoritative promoted `0.7.100` runtime checkpoint

```text
d15bd9517803faf6bceae5fb3376193648cca09d
485/485 tests
Benchmark 1 success
Data 30
```

Benchmark 1:

```text
1,000 player combat profiles     439.616ms  0.439616ms/op
1,000 enemy combat profiles      116.070ms  0.116070ms/op
1,000 basic attacks              504.204ms  0.504204ms/op
10,000 ticks / 5 subscribers      48.633ms  0.004863ms/op
10,000 direct route lookups     8064.154ms  0.806415ms/op
```

Benchmark protocol remains 1 and results remain comparable.

## `0.7.200` — Settlement service and economy depth — next bounded track

With the playable campaign graph closed, the next track should deepen repeated return-to-settlement usefulness rather than add another region merely for breadth.

Audit and then prove one reusable loop across existing authorities: shops/wallet, recovery/time, workstations/production, source-sink economics, and semantic browser presentation. A richer Craft production-choice surface and deliberately priced/service-quality recovery are strong candidates if they can reuse existing domain systems.

Do not mass-author shops/recipes/services, create a parallel economy, or pull property/infrastructure scope forward from Phase 0.8.

## Planned later phases

### 0.8 — Life and infrastructure expansion

Property, workshops, agriculture, logistics, relationships, social schedules, and earned automation.

### 0.9 — Adventure depth and release hardening

Advanced regions/dungeons, combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, performance, release tooling.

### 1.0 — Live foundation

Release when the core persistent-life/adventure promise is coherent, durable, original, stable, and supported by enough interconnected content for real play.

## Gate philosophy

Do not inflate version numbers to imply completion. Do not mass-author content merely to fill numeric ranges. Close a track only when its authority boundary and ordinary player experience are coherent enough for the next track to build on safely.
