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
Product:      0.8.100.1
Package:      0.8.100
Account Save: 4
Game State:   5
Data:         32
Benchmark:    1
Codename:     Home Foothold and Infrastructure
```

**Phase 0.7 — Multi-region playable alpha is complete. Phase 0.8 — Life and infrastructure expansion is in progress.** The project remains pre-alpha and `released: false`.

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

Campaign guidance and maps reflect acquired knowledge. Resources preserve provenance. Commitments and relationships are canonical gameplay state; Journal/readability/service/information models are projections. Companions are persistent NPC-backed people. Home/infrastructure work must reuse canonical projects, fictional time, materials, inventory, and furnishing/storage authority rather than introducing parallel management state. Legacy FFXI-derived material remains research/reference only.

## Phase summary

| Phase | Theme | Status |
| --- | --- | --- |
| `0.4` | Foundation and direction lock | **Complete** |
| `0.5` | Simulation + original-world/content substrate | **Complete** |
| `0.6` | Integrated character/mechanics content | **Complete** |
| `0.7` | Multi-region playable alpha | **Complete** |
| `0.8` | Life and infrastructure expansion | **In progress** |
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

The existing Mara Venn companion foundation creates a real preparation decision outside automatic combat contribution. Her persistent field approach lives in the existing party tactics record, survives save/load and travel, and affects only derived battle-entry attributes. The Character view presents Mara as a persistent traveling person with voiced intent and semantic preparation/party actions.

The same track completed the character-POV hygiene audit: ordinary browser surfaces and encounterable place/POI descriptions speak in terms of what the character sees, knows, carries, remembers, needs, or can decide. Implementation vocabulary stays outside normal play.

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

Data advanced to 31 because the canonical companion catalog and player-visible authored world/POI content changed. Account Save 4 and Game State 5 remained unchanged because field approach used the existing party tactics structure.

## Phase 0.7 closure audit

**PASS. Phase 0.7 closes at Product `0.7.400.1`.**

The exit contract is satisfied by the combined proofs: three several-day persistent community loops; livelihood/gathering/provenance/processing/trade/mastery; danger/combat/recovery; semantic scheduled transport; useful settlement returns; acquired/current information privacy; deterministic save/load; a persistent companion with a meaningful preparation choice; and simple character-facing browser presentation.

# 0.8 — Life and infrastructure expansion — in progress

Phase 0.8 expands the persistent-life half of the game: property, workshops, agriculture, logistics, home/infrastructure, relationships, social schedules, companion depth, and earned automation. Each track must grow from existing simulation and material authorities rather than becoming a disconnected management minigame.

## `0.8.100` — Home Foothold & Infrastructure — complete

The first Phase 0.8 track turns the character's starting lodging into a small durable infrastructure loop.

The first authored improvement is **Build a Storage Chest**:

- requires 2 **Resin-Sealed Hardwood Boards** from the existing Elderwood production chain;
- requires 1 **Redstone Copper Ingot** from the existing Redstone production chain;
- requires 30 minutes of hands-on fictional labor;
- completes through the existing generic project/timed-task substrate;
- places the existing **Storage Chest** furnishing exactly once;
- raises furnishing-backed home storage from the starting 3 slots to 8 slots.

The Journal derives a **Home & Foothold** opportunity with semantic Plan → Set aside materials → Start work → Finish actions. Materials leave carried inventory through the generic atomic project-contribution path. Active construction survives real account save/load. Completion is reconciled exactly once and the benefit survives subsequent save/load.

No second property registry, construction clock, inventory, storage-capacity system, or UI-owned economy state was introduced. `projectEngine` retains project/material/labor authority; canonical world time/timed tasks own duration; inventory/furnishing authority owns the storage benefit; `homeInfrastructureEngine` is the bounded authored adapter and derived presentation layer.

Authoritative promoted runtime checkpoint:

```text
0b9251a43285443087050127da36b977cabdf7ee
496/496 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.8.100.1
Package 0.8.100
Data 32
```

Benchmark 1:

```text
1,000 player combat profiles     466.332ms  0.466332ms/op
1,000 enemy combat profiles      108.813ms  0.108813ms/op
1,000 basic attacks              521.192ms  0.521192ms/op
10,000 ticks / 5 subscribers      48.255ms  0.004825ms/op
10,000 direct route lookups     8784.978ms  0.878498ms/op
```

Data advances `31 -> 32` because the canonical home-infrastructure definition and its material-to-durable-benefit contract are authored data. Account Save remains 4 and Game State remains 5 because the track reuses existing project `data`, timed tasks, placed furnishings, and inventory state.

## Next Phase 0.8 boundary

Do not mass-author property, farms, workshops, or automation as a follow-on to this checkpoint. The next work order should select one bounded Phase 0.8 track and first audit its existing authority/data seam. Candidate directions include workshop/home-production depth, agriculture/stewardship, logistics, social schedules/relationship life, companion life breadth, or earned automation.

# Later phases

## 0.9 — Adventure depth and release hardening

Difficult regions/dungeons, advanced combat/abilities, rare systems, high-level economy/production, UI/accessibility, balance, persistence policy, performance, and release tooling.

## 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, migratable, performant, and supported by enough interconnected content to sustain real play.
