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
Product:      0.8.100.2
Package:      0.8.100
Account Save: 4
Game State:   5
Data:         33
Benchmark:    1
Codename:     Home Foothold and Infrastructure
```

**Phase 0.7 — Multi-region playable alpha is complete. Phase 0.8 — Life and infrastructure expansion is in progress.** The bounded `0.8.100` track remains complete; `0.8.100.2` is a follow-up onboarding/character-creation polish revision, not a new Phase 0.8 feature track. The project remains pre-alpha and `released: false`.

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

Mara Venn's persistent field approach lives in the existing party tactics record, survives save/load and travel, and affects only derived battle-entry attributes. The Character view presents Mara as a persistent traveling person with voiced intent and semantic preparation/party actions.

The same track established the carried-forward character-POV rule: ordinary browser surfaces speak in terms of what the character sees, knows, carries, remembers, needs, or can decide; implementation vocabulary stays outside normal play.

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

## Phase 0.7 closure audit

**PASS. Phase 0.7 closes at Product `0.7.400.1`.** Later shared-authority improvements do not reopen it.

# 0.8 — Life and infrastructure expansion — in progress

Phase 0.8 expands the persistent-life half of the game: property, workshops, agriculture, logistics, home/infrastructure, relationships, social schedules, companion depth, and earned automation. Each track must grow from existing simulation and material authorities rather than becoming a disconnected management minigame.

## `0.8.100` — Home Foothold & Infrastructure — complete

The first Phase 0.8 track turns the character's starting lodging into a small durable infrastructure loop. **Build a Storage Chest** consumes 2 Resin-Sealed Hardwood Boards, 1 Redstone Copper Ingot, and 30 minutes of canonical project labor, then places the existing Storage Chest furnishing exactly once and raises furnishing-backed storage from 3 to 8 slots.

The Journal derives **Home & Foothold** with semantic Plan → Set aside materials → Start work → Finish actions. `projectEngine` retains material/labor authority; world time/timed tasks own duration; inventory/furnishing authority owns storage capacity; `homeInfrastructureEngine` remains a bounded adapter and projection.

Original track checkpoint:

```text
0b9251a43285443087050127da36b977cabdf7ee
496/496 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.8.100.1
Data 32
```

## `0.8.100.2` — Onboarding and character-creation polish — complete

This revision repairs the player-facing beginning without opening a new Phase 0.8 feature track.

- The active browser has two deliberate palettes only: **Dark** uses charcoal/grayscale/navy; **Light** uses silver-gray/dark navy/dark gray/black. Decorative gold/brown selection chrome was removed, including the follow-up resource-meter audit. Semantic danger/success colors remain restrained.
- Character save cards have a top-right `×`; deletion works against the account registry by character ID even when the encoded character state cannot be decoded. Settings exposes clear-all local data with destructive confirmation, and the logged-out landing has a reset path for account-registry corruption.
- Character creation has an original-world ancestry/sex-aware name die and a whole-character die. The canonical randomizer is deterministic under injected RNG for tests and does not reuse legacy FFXI name data.
- The six starting disciplines now expose truthful level-1 differences: active attribute emphasis, resource tendency, combat focus, weapon/magic training, protection, play style, and actual starting gear.
- Guided browser creation grants a small real two-item discipline kit through canonical inventory authority. The kit begins **carried, not auto-equipped**, preserving an immediate preparation decision. Generic `createNewGameState()` remains neutral; only guided creator options request the kit.
- The generic six-paragraph intro was replaced by three authored arrival scenes. Thornwall arrives by timber wagon and introduces Warden Halric Dane/Sera Talwin; Brasshaven arrives with freight and a predatory labor broker before Varric Stone intervenes; Mistmere arrives by ferry and exposes a bogus visitor-fee pitch before the registrar points toward Soli Venn. Each opening adds one restrained discipline-aware observation.
- Diegetic prose no longer explains game-design concepts such as permanent-class rules; that guidance remains in the creator UI where it belongs.

Data advances `32 -> 33` because canonical names, starter-kit definitions, and authored opening content changed. Account Save remains 4 and Game State remains 5 because deletion uses the existing account registry and starter gear uses existing inventory records.

Authoritative promoted runtime checkpoint:

```text
0f00ef68a01ad001063803d67ff0efffc48ab3ef
505/505 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.8.100.2
Package 0.8.100
Data 33
```

Benchmark 1:

```text
1,000 player combat profiles      463.353ms  0.463353ms/op
1,000 enemy combat profiles       125.126ms  0.125126ms/op
1,000 basic attacks               551.861ms  0.551861ms/op
10,000 ticks / 5 subscribers       48.338ms  0.004834ms/op
10,000 direct route lookups      8665.221ms  0.866522ms/op
```

Primary new guards are `tests/playerCreatorPolish.test.js` and `tests/saveRecovery.test.js`.

Known non-blocking seams after the audit:

- the legacy prompt/fast-create command adapter still creates neutral generic new-game state and therefore does not opt into the semantic browser creator's starter-kit flag;
- the historical account settings normalizer still accepts `highContrast`, but the active new browser UI exposes only Light and Dark;
- this checkpoint is validated by code/DOM/CSS regressions, full CI, Benchmark 1, and Pages build/deploy; no manual visual-browser walkthrough is claimed.

## Next Phase 0.8 boundary

`0.8.100` remains complete. Do not mass-author property, farms, workshops, or automation as a follow-on to this revision. The next work order should select one bounded Phase 0.8 track and first audit its existing authority/data seam. Candidate directions include workshop/home-production depth, agriculture/stewardship, logistics, social schedules/relationship life, companion life breadth, or earned automation.

# Later phases

## 0.9 — Adventure depth and release hardening

Difficult regions/dungeons, advanced combat/abilities, rare systems, high-level economy/production, UI/accessibility, balance, persistence policy, performance, and release tooling.

## 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, migratable, performant, and supported by enough interconnected content to sustain real play.
