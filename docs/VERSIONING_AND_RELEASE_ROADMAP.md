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
Data:         29
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
| Data | 29 | canonical authored-data contract |
| Benchmark | 1 | benchmark protocol/comparability |

### Account Save

Bump when the persisted account/session registry changes materially. Pre-alpha bumps do not require preserving old local account data.

### Game State

Bump when persisted game-state structure or meaning changes materially. Keep derived/presentation state unpersisted when canonical authority already exists.

PX-5 readability, PX-6 aftermath, the PX-7 player-facing hygiene pass, and PX-7 generic known-commitment Journal projection are derived and do not justify a Game State bump. PX-7 uses the existing generic `state.commitments` and `state.relationships` registries, so Game State remains 5.

### Data

Bump when canonical authored-data contracts/catalogs gain a meaningful shape or authority change.

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
- **Data 29 — commitment catalog v2, persistent Reader Soli Venn seed, `Marrowleaf for the Ward`, and provenance-aware commitment requirements across raw gathered or transformed goods plus bounded field-source/return guidance.**

### Benchmark

Bump only if the benchmark workload/protocol changes enough that prior numbers are not comparable. PX-7 retains Benchmark 1.

## Compatibility policy

Current mode:

```text
pre-release-current-schema
```

Rules:

- current-format save/load/validation/resume must be deterministic;
- old pre-alpha local saves/accounts may be reset when a cleaner current schema materially improves the project;
- do not add compatibility-only duplicate fields, lazy normalization, or adapters by reflex;
- unknown/future versions must fail deterministically when compatibility is deliberately supported;
- legacy identifiers are allowed only at explicit research/import boundaries, never as canonical world presentation.

## Release discipline

A coherent checkpoint requires:

1. bounded implementation and focused tests;
2. observed full test suite;
3. observed benchmark against current performance discipline;
4. browser/build/deploy checks where applicable;
5. deliberate product/schema/data registrations;
6. synchronized roadmap/architecture/handoff docs;
7. stop at the declared boundary rather than silently beginning the next track.

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

### Phase 0.7 decision sequence

- **PX-1/PX-2/PX-3:** Data 27 established origin experience content, actionable opportunity projection, starter-tool flow, and first Brasshaven/Redstone regional-loop authored contract.
- **PX-4:** Data 28 added canonical commitment definitions and persistent general NPC relationship/follow-up authority; provenance-safe stacking/delivery was hardened.
- **PX-5:** no schema/data bump; campaign readability is derived and transport authority remains canonical.
- **PX-6:** no schema/data bump; recovery reuses timed-task/battle state and aftermath is derived.
- **Player-language hygiene:** no Data/Game State bump; DOM presentation stops exposing internal rationale, adds collapsible details, and renders day history as character memory. `domUi` advances to `0.7.0`.
- **PX-7:** Data 29. Commitment catalog v2 supports provenance-qualified raw gathered or transformed goods and optional real field-source/return-hub guidance. Reader Soli Venn becomes a persistent NPC-backed contact and `Marrowleaf for the Ward` proves a second community. `commitments` advances to `0.2.0`; `playerContinuity` advances to `0.5.0` because the Journal projection is now generic over actually known commitment definitions.

No Account Save or Game State bump accompanies PX-7 because existing registries already serialize the new commitment/relationship records correctly.

## Authoritative PX-7 runtime checkpoint

```text
0411083b07bc4063fe4810fcb225e1dffd2895a4
483/483 tests
Benchmark 1 success
Data 29
```

Benchmark 1:

```text
1,000 player combat profiles     468.655ms  0.468655ms/op
1,000 enemy combat profiles      110.203ms  0.110203ms/op
1,000 basic attacks              553.072ms  0.553072ms/op
10,000 ticks / 5 subscribers      48.620ms  0.004862ms/op
10,000 direct route lookups     8767.498ms  0.876750ms/op
```

The benchmark protocol is unchanged and results remain comparable to prior Phase 0.7 gates.

## `0.7.100` — Playable campaign slice — still open

PX-1 through PX-7 now prove:

- arrival/footing for all three origins;
- ordinary first-day semantic opportunities;
- a complete Brasshaven/Redstone livelihood-production loop;
- persistent Varric several-day social continuity;
- acquired-knowledge multi-region readability;
- ordinary danger/combat/body/recovery composition;
- player-facing Journal language/hierarchy separated from developer diagnostics;
- a second persistent Mistmere/Soli/Starfen community loop with livelihood/danger alternatives and real save/load continuity.

The milestone remains open because sustained sandbox breadth is not yet proven across the full origin/community set. Thornwall/Elderwood lacks equivalent multi-day continuity, alternative social/economic goals remain thin after the two proving commitments, and several service/companion/Craft browser surfaces remain intentionally shallow.

### Next bounded unit

**PX-8 — sustained sandbox breadth / third-origin continuity.** Prefer Thornwall/Elderwood. Reuse the generic commitment/continuity projection, prove a third community loop with competing livelihood/danger/service choices and later save/load consequence, then perform an explicit `0.7.100` closure audit.

Do not advance Product to `0.7.100` until the ordinary multi-session exit gate is genuinely satisfied.

## Planned later phases

### 0.8 — Life and infrastructure expansion

Property, workshops, agriculture, logistics, relationships, social schedules, and earned automation.

### 0.9 — Adventure depth and release hardening

Advanced regions/dungeons, combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, performance, release tooling.

### 1.0 — Live foundation

Release when the core persistent-life/adventure promise is coherent, durable, original, stable, and supported by enough interconnected content for real play.

## Gate philosophy

Do not inflate version numbers to imply completion. Do not mass-author content merely to fill numeric ranges. Close a track when its authority boundary and player experience are coherent enough for the next track to build on safely.
