# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md`
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
- `docs/ROADMAP.md`
- `docs/THREAD_HANDOFF.md`

## Current baseline

```text
Product:      0.6.900.1
Package:      0.6.900
Account Save: 4
Game State:   5
Data:         30
Benchmark:    1
Codename:     Integrated Mechanics Gate
Compatibility: pre-release-current-schema
```

Phase 0.6 is complete. Phase 0.7 is in progress. The product version remains at the last completed product milestone until `0.7.100` closes.

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`. `package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority.

## Independent schema/data versions

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 4 | local account/session/character registry contract |
| Game State | 5 | serialized character/world runtime contract |
| Data | 30 | canonical authored-data contract |
| Benchmark | 1 | benchmark protocol/comparability |

### Account Save

Bump when the persisted account/session registry changes materially. Pre-alpha bumps do not require preserving old local account data.

### Game State

Bump when persisted game-state structure or meaning changes materially. Keep derived/presentation state unpersisted when canonical authority already exists.

PX-5 readability, PX-6 aftermath, player-language presentation, and the generic known-commitment Journal projection are derived. PX-7/PX-8 use the existing generic `state.commitments` and `state.relationships` registries, so Game State remains 5.

### Data

Bump when canonical authored-data contracts/catalogs gain meaningful shape or authority/content changes that should not be mistaken for the prior authored set.

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
- Data 29 — commitment catalog v2, persistent Reader Soli Venn, `Marrowleaf for the Ward`, and raw-resource/source/return guidance;
- **Data 30 — persistent Sera Talwin NPC-backed contact plus `Sweetroot for Southgate`, completing the third-origin authored community-continuity set without changing commitment catalog v2 shape.**

### Benchmark

Bump only if the benchmark workload/protocol changes enough that prior numbers are not comparable. PX-8 retains Benchmark 1.

## Compatibility policy

Current mode:

```text
pre-release-current-schema
```

Current-format save/load/validation/resume must be deterministic. Old pre-alpha local saves/accounts may be reset when a cleaner schema materially improves the project. Do not add compatibility-only duplicate fields, normalization, or adapters by reflex. Legacy identifiers are allowed only at explicit research/import boundaries.

## Release discipline

A coherent checkpoint requires bounded implementation/tests, observed full test suite, observed benchmark, browser/build/deploy verification where applicable, deliberate product/schema/data registration, synchronized docs, and a stop at the declared boundary.

In-progress Phase 0.7 work may advance subsystem/Data contracts without advancing the Product milestone number.

## Phase history

### 0.4 — Foundation — complete

Direction lock, version protocol, persistence migrations, structured action results/events, architecture stabilization.

### 0.5 — Simulation/content substrate — complete

Fictional time, pause/scheduler, timed tasks, interrupts, day review, original-world identity, provenance/projects, ecology/gathering, routes/transport, content packs, validation.

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
activityAdvance:            0.2.0
campaignRecovery:           0.1.0
characterActivity:          0.2.0
commitments:                0.2.0
relationships:              0.1.0
dayCycle:                   0.2.0
resourceRecoveryWork:       0.3.0
gameViewModels:             0.8.0
playerExperience:           0.3.0
playerOpportunities:        0.2.0
playerContinuity:           0.5.0
playerCampaignReadability:  0.2.0
playerDangerRecovery:       0.2.0
domUi:                      0.7.0
uiIntents:                  0.6.0
```

PX-8 changes no subsystem contract version. It proves the existing catalog-v2 and generic continuity contracts with a third authored community.

### Phase 0.7 decision sequence

- **PX-1/PX-2/PX-3:** Data 27 established origin experience content, actionable opportunity projection, starter-tool flow, and first Brasshaven/Redstone regional-loop authored contract.
- **PX-4:** Data 28 added canonical commitment definitions and persistent general NPC relationship/follow-up authority; provenance-safe stacking/delivery was hardened.
- **PX-5:** no schema/data bump; campaign readability is derived and transport authority remains canonical.
- **PX-6:** no schema/data bump; recovery reuses timed-task/battle state and aftermath is derived.
- **Player-language hygiene:** no Data/Game State bump; DOM presentation stops exposing internal rationale and renders deeper requirements/details appropriately.
- **PX-7:** Data 29. Reader Soli Venn and `Marrowleaf for the Ward` establish the second persistent community; commitment catalog v2 supports provenance-qualified raw or transformed goods and optional real field-source/return guidance. `playerContinuity 0.5.0` becomes generic over actually known commitment definitions.
- **PX-8:** Data 30. Sera Talwin becomes a persistent NPC-backed Thornwall contact and `Sweetroot for Southgate` establishes the third-origin several-day continuity proof. The existing generic catalog/projection handles it without a new engine branch or persistence schema.

No Account Save or Game State bump accompanies PX-8 because existing registries already serialize the new records correctly.

## Authoritative PX-8 runtime checkpoint

```text
63a234edfc1e327d90823c4171bdf315f01aa044
484/484 tests
Benchmark 1 success
Data 30
```

Benchmark 1:

```text
1,000 player combat profiles     400.261ms  0.400261ms/op
1,000 enemy combat profiles      104.237ms  0.104237ms/op
1,000 basic attacks              509.356ms  0.509356ms/op
10,000 ticks / 5 subscribers      50.139ms  0.005014ms/op
10,000 direct route lookups     7969.682ms  0.796968ms/op
```

The benchmark protocol is unchanged and results remain comparable to prior Phase 0.7 gates.

## `0.7.100` — Playable campaign slice — still open

PX-1 through PX-8 now prove:

- arrival/footing for all three origins;
- ordinary first-day semantic opportunities;
- complete regional livelihood/production loops;
- persistent several-day community continuity in Thornwall, Brasshaven, and Mistmere;
- provenance-qualified raw/transformed community requests and exactly-once social/economic rewards;
- acquired-knowledge multi-region readability;
- ordinary danger/combat/body/recovery composition;
- player-facing Journal language/hierarchy separated from diagnostics;
- real save/load across resolution, day progression, and changed follow-up.

The post-PX-8 exit audit found one concrete blocker rather than a need for another community: **generic scheduled transport is not yet presented as an executable ordinary Travel Desk/browser choice.**

The authored route graph already connects Thornwall Rivergate -> Timbercross -> Brasshaven Iron Quay -> Mistmere Reedport, and `transportEngine` plus `domApp` already support canonical `transport.start`. But generic POI Travel Desk interaction still reports that travel-service behavior is not implemented; only the specific PX-5 Copper Trail readability path surfaces a scheduled booking semantically.

Therefore the normal-player requirement to rotate among several connected communities without command/API expertise is not yet met. Product remains `0.6.900.1`; Package remains `0.6.900`.

### Next bounded unit

**PX-9 — cross-community rotation / `0.7.100` gate.** Derive services from the player’s actual route stop, present destination/fare/timing/blockers through the Travel Desk/context UI, dispatch existing `transport.start`, prove ordinary Thornwall -> Brasshaven -> Mistmere rotation, and immediately re-audit the milestone.

Do not advance Product to `0.7.100` merely because the route engine already contains the graph.

## Planned later phases

### 0.8 — Life and infrastructure expansion

Property, workshops, agriculture, logistics, relationships, social schedules, and earned automation.

### 0.9 — Adventure depth and release hardening

Advanced regions/dungeons, combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, performance, release tooling.

### 1.0 — Live foundation

Release when the core persistent-life/adventure promise is coherent, durable, original, stable, and supported by enough interconnected content for real play.

## Gate philosophy

Do not inflate version numbers to imply completion. Do not mass-author content merely to fill numeric ranges. Close a track only when its authority boundary and ordinary player experience are coherent enough for the next track to build on safely.
