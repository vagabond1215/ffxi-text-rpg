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
Product:      0.7.300.1
Package:      0.7.300
Account Save: 4
Game State:   5
Data:         30
Benchmark:    1
Codename:     Semantic Information Access
```

Phase 0.7 remains in progress. `0.7.100`, `0.7.200`, and `0.7.300` are complete bounded milestones.

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

Campaign guidance and maps reflect acquired knowledge. Resources preserve provenance. Commitments/relationships are canonical gameplay state; Journal/readability/service/information models are projections. Companions are persistent NPC-backed people. Legacy FFXI-derived material remains research/reference only.

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

PX-1 through PX-9 established the proving geography across **Thornwall / Elderwood / Brasshaven / Redstone Reach / Mistmere / Starfen**: three persistent community loops, livelihood/production, danger/combat/recovery, acquired-knowledge campaign readability, and generic semantic scheduled transport among the communities.

Authoritative promoted runtime checkpoint:

```text
d15bd9517803faf6bceae5fb3376193648cca09d
485/485 tests
Benchmark 1 success
Product 0.7.100.1
Data 30
```

## `0.7.200` — Settlement service and economy depth — complete

`settlementServiceBoardEngine` derives real workshop, production, merchant, wallet, work-mastery, and recovery choices from existing authorities. The active Craft browser surface is **Work, Trade & Recover** and dispatches semantic workshop/production/trade/recovery actions without creating a parallel economy.

The bounded Brasshaven/Redstone proof turns gathered ore into a process-vs-sell decision, persistent work mastery, finished-goods trade, preparation purchase, optional one-hour safe recovery, and save/load continuity. The same derived board discovers existing Thornwall tannery, Brasshaven forge, and Mistmere kitchen authority.

Authoritative promoted runtime checkpoint:

```text
61c8c6c602bc71a4e7325d04b3e7698f669843c4
487/487 tests
Benchmark 1 success
Product 0.7.200.1
Data 30
```

## `0.7.300` — Semantic information access and locality usability — complete

The third Phase 0.7 track removes ordinary command knowledge from the core information needed to make decisions while preserving the command shell as an optional power/diagnostic surface.

### Derived known/current information model

`playerInformationEngine` is a pure projection over existing authorities. It derives only information the character carries, has learned, has visited/acquired, or can currently act on:

- accessible carried containers and equipment, with semantic equip/unequip actions;
- effective skills and character-owned learned capabilities;
- learned spells/techniques and current readiness;
- acquired maps and visited places;
- discovered named POIs/contacts;
- currently usable safe-locality destinations and POI actions;
- deterministic bounded search results over those entries only.

Search state is transient UI state, not game state. The model does not enumerate the global map/place/POI/resource catalogs and cannot become an omniscient world index.

### Browser result

Character, Spellbook, Codex, and World now render structured state directly. Safe-locality World presentation exposes named districts and local places/people through semantic actions while still omitting wilderness D-pad/minimap controls. The omnibox searches **what the character knows or can do**; a leading `/` explicitly opts into the command shell.

The focused privacy regression proves a fresh Thornwall character can search Sera Talwin and a learned Ore Survey capability, can inspect the acquired Thornwall map/current locality, and cannot find the hidden **Tall Reedbed** before discovery.

No Data, Game State, Account Save, or Benchmark bump accompanies `0.7.300`: no authored record or persisted gameplay contract changed.

Authoritative promoted runtime checkpoint:

```text
0f6af06ff8571658d51bc2be53112a50d51275cb
490/490 tests
Benchmark 1 success
Product 0.7.300.1
Data 30
```

Benchmark 1:

```text
player profile      0.464067ms/op
enemy profile       0.114406ms/op
basic attack        0.543591ms/op
tick dispatch       0.004843ms/op
direct route lookup 0.869373ms/op
```

`0.7.300` deliberately does **not** attempt a total command purge, a general natural-language agent, or an omniscient fuzzy world search.

## `0.7.400` — Companion life and party depth — next

The next bounded track should make the existing persistent companion foundation matter more often in ordinary campaign play rather than add another companion framework or content region.

Begin with an audit of Mara's existing NPC/party/relationship/tactics state, recruitment and leave/join flows, companion battle behavior, travel/recovery synchronization, current browser presentation, and save/load coverage. Choose one concrete multi-session companion loop before adding breadth.

A good first proof should make a recruited companion create at least one meaningful preparation/tactical/social choice outside a single automatic battle action, persist the consequence, survive real save/load, and remain the same NPC-backed person across travel/community play.

Do not begin with a summon system, universal party-AI framework, mass-authored companions, or a duplicate relationship/equipment/progression authority.

## Known later Phase 0.7 depth

- A few explicit utility/combat and wilderness POI actions still retain command bridges; commands remain optional power surfaces rather than normal core information access.
- Companion tactical/dialogue/equipment/progression breadth remains intentionally small until `0.7.400`.
- Safe-locality density/hierarchy can still improve without restoring wilderness controls there.
- `gil` remains current currency terminology pending deliberate original-currency design.
- Paid/service-quality recovery remains unauthored; safe recovery currently costs fictional time rather than fabricated money.

# Later phases

## 0.8 — Life and infrastructure expansion

Deepen property, workshops, agriculture, logistics, home/infrastructure, relationships, companions, and earned automation.

## 0.9 — Adventure depth and release hardening

Expand difficult regions/dungeons, advanced combat/abilities, rare systems, high-level economy/production, UI/accessibility, balance, persistence policy, performance, and release tooling.

## 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, migratable, performant, and supported by enough interconnected content to sustain real play.
