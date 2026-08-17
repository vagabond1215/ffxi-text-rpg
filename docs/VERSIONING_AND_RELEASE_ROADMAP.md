# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md`
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
- `docs/ROADMAP.md`
- `docs/THREAD_HANDOFF.md`

## Current baseline

```text
Product:       0.7.400.1
Package:       0.7.400
Account Save:  4
Game State:    5
Data:          31
Benchmark:     1
Codename:      Companion Life and Party Depth
Compatibility: pre-release-current-schema
```

**Phases 0.4, 0.5, 0.6, and 0.7 are complete.** The project remains pre-alpha and unreleased. Phase 0.8 is planned but must begin only from a new bounded work order.

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`. `package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority.

## Independent schema/data versions

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 4 | local account/session/character registry contract |
| Game State | 5 | serialized character/world runtime contract |
| Data | 31 | canonical authored-data contract |
| Benchmark | 1 | benchmark protocol/comparability |

Account Save changes when the account/session registry changes materially. Game State changes when persisted runtime structure or meaning changes materially. Data changes when canonical authored-data shape/authority/content changes materially. Benchmark changes only when the workload/protocol changes enough that prior results stop being comparable.

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
- Data 30 — Sera Talwin plus `Sweetroot for Southgate`, completing the three-origin authored community-continuity set;
- Data 31 — companion catalog v2 with voiced field approaches plus character-facing place/POI authored-content cleanup.

PX-9, `0.7.200`, and `0.7.300` did not advance Data because they added derived access/presentation over existing authored records. `0.7.400` advances Data but not Game State: the selected companion field approach uses the already-existing party tactics record, while the POV audit changes authored/presentation content.

## Compatibility policy

Current mode remains `pre-release-current-schema`. Current-format save/load/validation/resume must be deterministic. Old pre-alpha local saves/accounts may be reset when a cleaner schema materially improves the project. Do not add compatibility-only duplicate state or adapters by reflex.

## Release discipline

A coherent checkpoint requires bounded implementation/tests, observed full suite, observed benchmark, browser/build/deploy verification where applicable, deliberate product/schema/data registration, synchronized docs, and a stop at the declared boundary.

A product milestone advances only when its player-facing gate closes. A completed phase does not imply the product is released.

# Phase history

## 0.4 — Foundation — complete

Direction lock, version protocol, persistence migrations, structured action results/events, architecture stabilization.

## 0.5 — Simulation/content substrate — complete

Fictional time, pause/scheduler, timed tasks, interrupts, day review, original-world identity, provenance/projects, ecology/gathering, routes/transport, content packs, validation.

## 0.6 — Integrated character/mechanics — complete

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

# Phase 0.7 — Multi-region playable alpha — complete

## Final registrations

```text
versionManifest:              0.7.400.1
activityAdvance:              0.2.0
campaignRecovery:             0.1.0
characterActivity:            0.2.0
commitments:                  0.2.0
relationships:                0.1.0
dayCycle:                     0.2.0
resourceRecoveryWork:         0.3.0
transport:                    0.2.0
transportServiceBoard:        0.1.0
settlementServiceBoard:       0.1.0
workstations:                 0.2.0
shopTransactions:             0.5.0
playerInformation:            0.1.1
gameViewModels:               0.12.0
playerExperience:             0.3.0
playerOpportunities:          0.2.0
playerContinuity:             0.5.0
playerCampaignReadability:    0.2.0
playerDangerRecovery:         0.2.0
domUi:                        0.10.0
uiIntents:                    0.9.0
companionCatalog:             0.2.0
party:                        0.2.0
companions:                   0.2.0
```

The database registry also records `companions` and `party` as implemented `0.2.0` contracts.

## Phase 0.7 decision sequence

- **PX-1/PX-2/PX-3:** Data 27 established origin experience, actionable opportunity projection, starter-tool flow, and the first Brasshaven/Redstone regional loop.
- **PX-4:** Data 28 added canonical commitment definitions and persistent general NPC relationship/follow-up authority.
- **PX-5:** no schema/data bump; campaign readability is derived.
- **PX-6:** no schema/data bump; recovery reuses timed-task/battle state and aftermath is derived.
- **Player-language hygiene:** no Data/Game State bump; ordinary presentation stops exposing internal rationale.
- **PX-7:** Data 29; Reader Soli Venn and `Marrowleaf for the Ward` establish the second persistent community.
- **PX-8:** Data 30; Sera Talwin and `Sweetroot for Southgate` establish third-origin continuity without changing persistence shape.
- **PX-9 / `0.7.100`:** no Data/Game State bump. `transportServiceBoard 0.1.0` derives actual scheduled-service choices; Product becomes `0.7.100.1`.
- **`0.7.200`:** no Data/Game State bump. `settlementServiceBoard 0.1.0`, structured shop transactions, and richer Craft presentation close the settlement return/economy gap. Product becomes `0.7.200.1`.
- **`0.7.300`:** no Data/Game State bump. `playerInformation` derives accessible preparation, learned skills/capabilities/abilities, acquired/visited/discovered world knowledge, current locality actions, and bounded semantic search. Product becomes `0.7.300.1`.
- **`0.7.400`:** Data 31. Companion catalog v2 gives Mara a persistent voiced field approach with a real pre-battle tradeoff; Character presentation exposes it semantically; the same track performs a character-POV authored/UI hygiene pass. Product becomes `0.7.400.1`.

## `0.7.100` — Playable campaign slice — complete

PX-1 through PX-9 jointly prove three origin/community continuity loops, competing livelihood/social/danger choices, production, combat/recovery, acquired-knowledge readability, semantic scheduled transport, current-version save/load, and provenance/one-time ownership.

Authoritative runtime checkpoint:

```text
d15bd9517803faf6bceae5fb3376193648cca09d
485/485 tests
Benchmark 1 success
Data 30
```

## `0.7.200` — Settlement service and economy depth — complete

The active Craft surface exposes derived workshop, production, merchant, and recovery choices through semantic actions while domain engines retain mutation authority.

Authoritative promoted runtime checkpoint:

```text
61c8c6c602bc71a4e7325d04b3e7698f669843c4
487/487 tests
Benchmark 1 success
Data 30
```

## `0.7.300` — Semantic information access and locality usability — complete

Character, Spellbook, Codex, World, and default omnibox search expose only current/acquired character information. Hidden world topology remains private; `/` keeps the command shell optional rather than mandatory.

Authoritative promoted runtime checkpoint:

```text
0f6af06ff8571658d51bc2be53112a50d51275cb
490/490 tests
Benchmark 1 success
Data 30
```

## `0.7.400` — Companion life, party depth, and character POV — complete

Mara Venn now has two authored field approaches stored in existing party tactics state:

- **Guard the Road** — favors evasion over attack.
- **Seek the Opening** — favors attack over caution.

The choice is made outside combat, survives real save/load and canonical travel, and changes only battle-entry derived attributes. Mara's permanent stats, NPC identity, relationship authority, and party/travel/recovery synchronization remain intact. No companion XP, summon layer, duplicate relationship registry, or second combat AI was introduced.

The Character view presents Mara's identity, condition, location, selected approach, authored voice, and semantic preparation/party actions. The accompanying POV pass removes implementation/roadmap language from ordinary browser and representative encounterable world content, guarded by `playerPointOfViewPresentation.test.js` and the existing player-language tests.

Data advances:

```text
30 -> 31
```

Persistence stays:

```text
Account Save 4
Game State 5
```

Authoritative promoted runtime checkpoint:

```text
1e217fe1f7e62593fa9ed33eebdf1b3878490336
495/495 tests
0 failed
0 skipped
Benchmark 1 success
Data 31
```

Benchmark 1:

```text
1,000 player combat profiles     470.213ms  0.470213ms/op
1,000 enemy combat profiles      124.768ms  0.124768ms/op
1,000 basic attacks              538.006ms  0.538006ms/op
10,000 ticks / 5 subscribers      50.197ms  0.005020ms/op
10,000 direct route lookups     8612.637ms  0.861264ms/op
```

Benchmark protocol remains 1 and results remain comparable.

## Phase 0.7 exit decision

**PASS — Phase 0.7 closes at Product `0.7.400.1`.**

The completed tracks jointly satisfy the phase gate: sustained multi-session play across connected communities, persistent NPC/social consequences, economy/services/transport, livelihood/resources/production, danger/combat/recovery, semantic browser actions, acquired-knowledge privacy, deterministic save/load, exactly-once ownership, provenance/source-sink integrity, and a companion whose persistent preparation choice matters in ordinary campaign play.

The phase is not held open for later breadth that does not block the current player promise. Deferred items include broader companion dialogue/equipment/progression/goals, richer generic NPC/vendor voice, residual optional command adapters, further safe-locality hierarchy refinement, original currency terminology, and authored paid/service-quality recovery.

# Planned later phases

## 0.8 — Life and infrastructure expansion

Property, workshops, agriculture, logistics, relationships, social schedules, companion depth, home/infrastructure, and earned automation. **Do not begin automatically; choose a bounded track from a new work order.**

## 0.9 — Adventure depth and release hardening

Advanced regions/dungeons, combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, performance, and release tooling.

## 1.0 — Live foundation

Release when the core persistent-life/adventure promise is coherent, durable, original, stable, and supported by enough interconnected content for real play.

## Gate philosophy

Do not inflate version numbers to imply completion. Do not mass-author content merely to fill numeric ranges. Close a track or phase only when its player-facing gate and authority boundaries are coherent enough for the next bounded work order to build on safely.
