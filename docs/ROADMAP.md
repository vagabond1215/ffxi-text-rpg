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
Product:      0.7.200.1
Package:      0.7.200
Account Save: 4
Game State:   5
Data:         30
Benchmark:    1
Codename:     Settlement Economy Depth
```

Phase 0.7 remains in progress. `0.7.100` and `0.7.200` are complete bounded milestones.

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

The second Phase 0.7 track deepens the reason to return to settlements without creating a parallel economy.

### Reusable settlement-service surface

`settlementServiceBoardEngine` is a derived projection over existing locality POIs, workstation tags, production definitions, inventory, wallet, shops, work proficiency, active work, and campaign recovery. It stores nothing in game state.

The active Craft browser surface is now **Work, Trade & Recover**. It exposes real semantic actions for:

- going to an authored workshop;
- starting and completing production;
- claiming pending production output;
- visiting a local merchant;
- buying affordable real stock;
- selling carried goods at the current shop quote;
- starting/finishing safe-settlement recovery.

Production, shop, inventory, recovery, locality, wallet, and fictional-time systems remain authoritative.

### Proving economic loop

The bounded end-to-end proof is:

```text
Brasshaven
  -> South Redstone Reach
  -> gather 2 Redstone Copper Ore
  -> return to Brasshaven Market Ring
  -> visit Selka Aurum's forge/workshop
  -> compare raw sale value with processing
  -> smelt Redstone Copper Ingot
  -> persistent metalworking mastery shortens later work
  -> sell the finished ingot to Mae Oris
  -> use the proceeds for real preparation stock
  -> optionally spend one fictional hour on safe recovery
  -> save/load with wallet, item, time, and mastery intact
```

At the proving values, two raw ore carry a typical 10-gil shop value while the finished ingot carries a 14-gil shop value. Smelting initially takes 300 fictional seconds and grants +2 metalworking; the same projected process then falls to 295 seconds. Selling the ingot funds an 8-gil Flask of Water that was honestly blocked at the character's initial 0 gil. The sold ingot cannot pay twice.

The same board is explicitly tested against existing authored facilities in all three origin communities: Thornwall tannery work, Brasshaven forge work, and Mistmere kitchen work. This is not a Brasshaven-specific economy branch.

No Data, Game State, Account Save, or Benchmark bump accompanies `0.7.200`: no authored record, persisted registry, or benchmark protocol changed.

Authoritative promoted runtime checkpoint:

```text
61c8c6c602bc71a4e7325d04b3e7698f669843c4
487/487 tests
Benchmark 1 success
Product 0.7.200.1
Data 30
```

Benchmark 1:

```text
player profile      0.413227ms/op
enemy profile       0.102942ms/op
basic attack        0.513096ms/op
tick dispatch       0.004454ms/op
direct route lookup 0.776987ms/op
```

`0.7.200` closes settlement work/trade/recovery browser access and the first reusable return-to-town economic decision loop. It deliberately does **not** invent paid inns, market simulation, dynamic pricing, property, or infrastructure.

## `0.7.300` — Semantic information access and locality usability — next

The next bounded track should remove remaining ordinary-player dependence on command-backed information surfaces and tighten safe-locality interaction hierarchy before adding more content breadth.

Start with a concrete audit of the Character, Inventory/Equipment, Spellbook, Codex/World, locality point lists, and Search-or-act seams. Prefer derived semantic view models and direct actions over command-string bridges. Keep fuzzy/search scope bounded to existing known character/world information rather than creating an omniscient query layer.

A good first proof should let a normal player inspect character preparation, known abilities/knowledge, and relevant local options from the browser UI without knowing command vocabulary, while preserving acquired-knowledge privacy and the distinction between settlement locality navigation and wilderness exploration.

Do not turn this into a full UI rewrite, general natural-language agent, or hidden omniscient search index.

## Known later Phase 0.7 depth

- Search-or-act is still command-capable rather than a true semantic known-information/action surface.
- Several information views still bridge command output.
- Companion tactical/dialogue/equipment/progression breadth remains intentionally small.
- Safe-locality hierarchy/density can improve without restoring wilderness controls there.
- `gil` remains current currency terminology pending deliberate original-currency design.
- Paid/service-quality recovery remains unauthored; safe recovery currently costs fictional time rather than fabricated money.

# Later phases

## 0.8 — Life and infrastructure expansion

Deepen property, workshops, agriculture, logistics, home/infrastructure, relationships, companions, and earned automation.

## 0.9 — Adventure depth and release hardening

Expand difficult regions/dungeons, advanced combat/abilities, rare systems, high-level economy/production, UI/accessibility, balance, persistence policy, performance, and release tooling.

## 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, migratable, performant, and supported by enough interconnected content to sustain real play.
