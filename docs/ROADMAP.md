# Roadmap

This is the authoritative implementation summary and phase index for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md` — design north star.
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — naming, provenance, scale, and legacy/reference policy.
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — product/schema version protocol and release gates.
- `docs/ARCHITECTURE.md` — current runtime/module boundaries.
- `docs/THREAD_HANDOFF.md` — latest implementation handoff.
- `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md` — player-facing sequencing and acceptance checks.

## Current baseline

```text
Product:      0.7.400.1
Package:      0.7.400
Account Save: 4
Game State:   5
Data:         31
Benchmark:    1
Codename:     Companion Life and Party Depth
```

**Phase 0.7 — Multi-region playable alpha is complete.** The project remains pre-alpha and `released: false`; completing Phase 0.7 does not imply release readiness.

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

Campaign guidance and maps reflect acquired knowledge. Resources preserve provenance. Commitments and relationships are canonical gameplay state; Journal/readability/service/information models are projections. Companions are persistent NPC-backed people. Legacy FFXI-derived material remains research/reference only.

## Phase summary

| Phase | Theme | Status |
| --- | --- | --- |
| `0.4` | Foundation and direction lock | **Complete** |
| `0.5` | Simulation + original-world/content substrate | **Complete** |
| `0.6` | Integrated character/mechanics content | **Complete** |
| `0.7` | Multi-region playable alpha | **Complete** |
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

# 0.7 — Multi-region playable alpha — complete

Phase 0.7 turned the proven systems into a sustained ordinary-play campaign rather than another architecture reset.

## Exit contract

A normal player can sustain repeated multi-session play across connected settlements/regions without test-only setup or command expertise. The campaign combines persistent NPC communities, economy/services/transport, commitments/social consequences, livelihood/resources/production, adventure/combat/recovery, companion preparation, competing goals, semantic browser actions, deterministic save/load, acquired-knowledge privacy, and provenance/source-sink integrity.

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

Authoritative promoted runtime checkpoint:

```text
61c8c6c602bc71a4e7325d04b3e7698f669843c4
487/487 tests
Benchmark 1 success
Product 0.7.200.1
Data 30
```

## `0.7.300` — Semantic information access and locality usability — complete

`playerInformationEngine` derives only information the character carries, has learned, has visited/acquired, or can currently act on. Character, Spellbook, Codex, World, and the default omnibox expose ordinary decision information without requiring command vocabulary. Search remains bounded by acquired/current knowledge; hidden topology is not an indexable catalog.

Authoritative promoted runtime checkpoint:

```text
0f6af06ff8571658d51bc2be53112a50d51275cb
490/490 tests
Benchmark 1 success
Product 0.7.300.1
Data 30
```

## `0.7.400` — Companion life, party depth, and character POV — complete

The existing Mara Venn companion foundation now creates a real preparation decision outside the automatic combat contribution. Mara remains the same NPC-backed person through recruitment, active-party changes, travel, battle-resource synchronization, recovery, and real save/load.

Her persistent field approach lives in the existing party tactics record:

- **Guard the Road** — tighter defense/evasion at the cost of striking power; Mara says, “Stay inside my reach. We get home together.”
- **Seek the Opening** — more attack at the cost of caution; Mara says, “Hold their eye. I’ll find the seam.”

Changing approach is a pre-battle decision. Battle entry derives its modifiers without mutating Mara's permanent attributes, creating companion XP, or adding a second combat-AI/progression authority.

The Character view presents Mara as a traveling person rather than a raw policy record: identity, description, location, condition, current approach, voiced intent, alternative approaches, and semantic travel/part-ways/preparation actions.

The same track completed a character-POV hygiene audit. Ordinary browser surfaces and encounterable place/POI descriptions now speak in terms of what the character sees, knows, carries, remembers, needs, or can decide. Development-roadmap language, raw state/task labels, authored-world explanations, and similar implementation vocabulary stay outside normal play. `tests/playerPointOfViewPresentation.test.js` and `tests/playerFacingLanguage.test.js` guard that boundary.

Authoritative promoted runtime checkpoint:

```text
1e217fe1f7e62593fa9ed33eebdf1b3878490336
495/495 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.7.400.1
Data 31
```

Benchmark 1:

```text
player profile       0.470213ms/op
enemy profile        0.124768ms/op
basic attack         0.538006ms/op
tick dispatch        0.005020ms/op
direct route lookup  0.861264ms/op
```

Data advances to 31 because the canonical companion catalog and player-visible authored world/POI content changed. Account Save 4 and Game State 5 remain unchanged because field approach uses the existing party tactics structure.

## Phase 0.7 closure audit

**PASS. Phase 0.7 closes at Product `0.7.400.1`.**

The exit contract is satisfied by the combined proofs:

- three several-day persistent community loops with named NPC relationships and later follow-up;
- livelihood, gathering, provenance, processing, trade, preparation, and persistent work mastery;
- danger, Combat 2.0, physical-body recovery, defeat consequences, and return to the same campaign;
- semantic scheduled transport across the proving communities;
- useful settlement return choices for work, trade, recovery, preparation, and social continuity;
- acquired/current information access and search without omniscient topology leakage;
- current-format deterministic save/load with exactly-once rewards, fares, trades, and progress;
- a persistent companion whose pre-battle choice matters and survives travel/save-load;
- clean character-facing prose and a simple decision-first browser hierarchy.

The audit does **not** require every future depth system to be complete. Residual breadth belongs to later phases unless it becomes a concrete player blocker.

## Deferred depth after Phase 0.7

- Broader companion dialogue, equipment, progression, goals, schedules, and relationship consequences.
- Richer generic NPC/vendor voice and denser social life.
- A few optional utility/combat/wilderness command adapters outside the core ordinary information path.
- Further safe-locality density/hierarchy refinement without restoring wilderness controls there.
- Deliberate original-currency terminology to replace current `gil` wording.
- Authored paid/service-quality recovery rather than fabricated fees.
- Broader content scale and harder adventure/economy loops appropriate to Phases 0.8/0.9.

# Later phases

## 0.8 — Life and infrastructure expansion

Property, workshops, agriculture, logistics, home/infrastructure, relationships, companions, social schedules, and earned automation. **Do not begin automatically; choose a bounded track only on a new work order.**

## 0.9 — Adventure depth and release hardening

Difficult regions/dungeons, advanced combat/abilities, rare systems, high-level economy/production, UI/accessibility, balance, persistence policy, performance, and release tooling.

## 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, migratable, performant, and supported by enough interconnected content to sustain real play.
