# Roadmap

This is the authoritative implementation summary and phase index for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md` — design north star.
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — naming, provenance, scale, and legacy/reference policy.
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — product/schema version protocol and release gates.
- `docs/ARCHITECTURE.md` — current runtime/module boundaries.
- `docs/THREAD_HANDOFF.md` — latest implementation handoff.
- `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md` — Phase 0.7 player-facing sequencing and acceptance checks.

## Current baseline

```text
Product:      0.7.100.1
Package:      0.7.100
Account Save: 4
Game State:   5
Data:         30
Benchmark:    1
Codename:     Playable Campaign Slice
```

Phase 0.7 remains in progress. The first bounded Phase 0.7 milestone, `0.7.100`, is complete.

## Product laws

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

```text
Use fine movement where movement itself creates decisions.
Use named localities and actions where destinations and relationships create decisions.
```

Campaign guidance and maps reflect acquired knowledge. Resources preserve provenance. Commitments/relationships are canonical gameplay state; Journal/readability/service boards are projections. Companions are persistent NPC-backed people. Legacy FFXI-derived material remains research/reference only.

## Phase summary

| Phase | Theme | Status |
| --- | --- | --- |
| `0.4` | Foundation and direction lock | **Complete** |
| `0.5` | Simulation + original-world/content substrate | **Complete** |
| `0.6` | Integrated character/mechanics content | **Complete** |
| `0.7` | Multi-region playable alpha | **In progress** |
| `0.8` | Life and infrastructure expansion | Planned |
| `0.9` | Adventure depth and release hardening | Planned |
| `1.0` | Live foundation | Planned |

## Completed phase history

### 0.4 — Foundation

Direction/version protocol, ordered persistence migrations, structured action results/events, and architecture stabilization.

### 0.5 — Simulation and content substrate

Deterministic fictional time, scheduler/pause, timed tasks, interrupts, day review, original-world identity, projects/provenance, ecology/gathering/populations, routes/scheduled transport, content packs, and scalable validation.

### 0.6 — Integrated character and mechanics

| Track | Contract | Result |
| --- | --- | --- |
| `0.6.100` | Continuous-character stats/progression | Data 19 |
| `0.6.200` | Skills/proficiencies/disciplines/capabilities | Data 20 |
| `0.6.250` | Semantic DOM player interface | Data 20 |
| `0.6.300` | Original magic/active ability engine | Data 21 |
| `0.6.400` | Combat 2.0 | Data 22 |
| `0.6.450` | Locality/exploration navigation | Data 22 |
| `0.6.500` | Equipment/field-tool breadth | Data 23 |
| `0.6.600` | Gathering/production/crafting breadth | Data 24 |
| `0.6.700` | Regional ecology/resource breadth | Data 25 |
| `0.6.800` | Persistent companion/party foundation | Data 26 |
| `0.6.900` | Integrated-mechanics exit gate | Product `0.6.900.1` / Data 26 |

# 0.7 — Multi-region playable alpha — in progress

Phase 0.7 turns proven systems into sustained ordinary play; it is not another architecture reset.

## Phase exit direction

A normal player should sustain repeated multi-session play across connected settlements/regions without test-only setup or command expertise. The campaign should combine persistent NPC communities, economy/services/transport, commitments/social consequences, livelihood/resources/production, adventure/combat/recovery, companions where relevant, competing goals, semantic browser actions, deterministic save/load, acquired-knowledge privacy, and provenance/source-sink integrity.

## `0.7.100` — Playable campaign slice — complete

The proving geography spans **Thornwall / Elderwood / Brasshaven / Redstone Reach / Mistmere / Starfen**.

Completed player-experience sequence:

- **PX-1:** arrival and footing for all three origins.
- **PX-2:** actionable first-day livelihood/training/exploration/service choices.
- **PX-3:** Brasshaven -> Redstone livelihood/production loop.
- **PX-4:** Varric several-day commitment/relationship/save-load continuity.
- **PX-5:** acquired-knowledge multi-region Journal readability.
- **PX-6:** ordinary combat, physical aftermath, recovery, and resumed campaign.
- **Player-language hygiene:** character-facing Journal/Day Review information hierarchy.
- **PX-7:** Mistmere/Soli/Starfen second-community continuity.
- **PX-8:** Thornwall/Sera/Elderwood third-origin continuity.
- **PX-9:** generic scheduled-transport browser access and cross-community rotation.

### PX-9 closure result

`transportServiceBoardEngine` derives scheduled destinations, fare, cadence, next boardable departure, duration, and blockers from existing canonical route/service and current player state. The game view exposes direct `transport.start` actions; Travel Desk POIs describe the same service board. `transportEngine` still owns booking, fare deduction, cargo rules, fictional time, departure/arrival, and party movement.

The end-to-end proof rotates a real character through:

```text
Thornwall Rivergate
  -> Crown-Forge Caravan
  -> Brasshaven Iron Quay
  -> Forge-Mere Caravan
  -> Mistmere Reedport
  -> return through the same canonical service graph
```

The proof covers real fares, one-time payment per booking, save/load during scheduled travel, correct per-stop service visibility, return travel, and acquired-knowledge privacy.

No Data or Game State bump accompanies PX-9: no authored world record or persisted contract changed.

Authoritative promoted runtime checkpoint:

```text
d15bd9517803faf6bceae5fb3376193648cca09d
485/485 tests
Benchmark 1 success
Product 0.7.100.1
Data 30
```

Benchmark 1:

```text
player profile      0.439616ms/op
enemy profile       0.116070ms/op
basic attack        0.504204ms/op
tick dispatch       0.004863ms/op
direct route lookup 0.806415ms/op
```

`0.7.100` is a **closed pre-alpha milestone**, not a claim that Phase 0.7 or the game is feature-complete.

## `0.7.200` — Settlement service and economy depth — next

Now that the proving communities are connected through ordinary semantic play, deepen the reasons to return to and spend time in settlements.

Start with an audit of existing authority and one bounded reusable loop. Priorities:

- expose meaningful shop/service/recovery/workstation choices through browser UI;
- turn the compact Craft surface into a real production-choice surface using existing production/workstation authority;
- strengthen material source -> process -> trade/use/service decisions;
- if paid recovery/service quality is added, use the existing wallet, fictional-time, and service authorities rather than a parallel rest economy;
- create repeated economic/social reasons to revisit communities without drifting into property/infrastructure systems reserved for 0.8.

Do not begin by mass-authoring shops, recipes, or services. Prove one reusable settlement-service/economic loop first, then reassess breadth.

## Known later Phase 0.7 depth

- Search-or-act remains command-capable rather than true semantic fuzzy search.
- Some information views still bridge command output.
- Craft browser depth is limited.
- Settlement recovery is executable but not yet a priced/service-quality economy.
- Companion tactical/dialogue/equipment/progression breadth remains small.
- Safe-locality hierarchy/density can improve without restoring wilderness controls there.
- `gil` remains current currency terminology pending deliberate original-currency design.

# Later phases

## 0.8 — Life and infrastructure expansion

Deepen property, workshops, agriculture, logistics, home/infrastructure, relationships, companions, and earned automation.

## 0.9 — Adventure depth and release hardening

Expand difficult regions/dungeons, advanced combat/abilities, rare systems, high-level economy/production, UI/accessibility, balance, persistence policy, performance, and release tooling.

## 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, migratable, performant, and supported by enough interconnected content to sustain real play.
