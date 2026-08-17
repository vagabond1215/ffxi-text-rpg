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
Product:      0.8.200.1
Package:      0.8.200
Account Save: 4
Game State:   5
Data:         34
Benchmark:    1
Codename:     Home Workshop Capability
```

**Phase 0.7 — Multi-region playable alpha is complete. Phase 0.8 — Life and infrastructure expansion is in progress. `0.8.100` and `0.8.200` are complete and audited.** The project remains pre-alpha and `released: false`.

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

Campaign guidance and maps reflect acquired knowledge. Resources preserve provenance. Commitments and relationships are canonical gameplay state; Journal/readability/service/information/home models are projections. Companions are persistent NPC-backed people. Home and infrastructure work must compose canonical projects, fictional time, materials, inventory, furnishings, workstations, production, and mastery rather than introducing parallel management state. Legacy FFXI-derived material remains research/reference only.

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

# Completed phase history

## 0.4 — Foundation

Direction/version protocol, ordered persistence migrations, structured action results/events, and architecture stabilization.

## 0.5 — Simulation and content substrate

Deterministic fictional time, scheduler/pause, timed tasks, interrupts, day review, original-world identity, projects/provenance, ecology/gathering/populations, routes/scheduled transport, content packs, and scalable validation.

## 0.6 — Integrated character and mechanics

Continuous-character stats/progression, skills/proficiencies/disciplines/capabilities, semantic DOM UI, original magic/abilities, Combat 2.0, locality/exploration navigation, equipment/field tools, production/crafting, regional ecology/resources, persistent companions/party, and the integrated-mechanics exit gate. Phase 0.6 closed at Product `0.6.900.1` / Data 26.

# 0.7 — Multi-region playable alpha — complete

Phase 0.7 turned the systems into a sustained ordinary-play campaign across **Thornwall / Elderwood / Brasshaven / Redstone Reach / Mistmere / Starfen**.

The completed proof includes:

- three persistent community loops with named NPC continuity;
- livelihood, gathering, provenance, processing, trade, and persistent work mastery;
- danger, Combat 2.0, physical resource recovery, defeat, and campaign recovery;
- acquired-knowledge campaign readability and semantic information access;
- scheduled transport among proving communities;
- settlement work/trade/recovery services;
- a persistent NPC-backed companion with a real preparation choice;
- character-POV browser presentation and deterministic account save/load.

Final Phase 0.7 runtime checkpoint:

```text
1e217fe1f7e62593fa9ed33eebdf1b3878490336
495/495 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.7.400.1
Data 31
```

**Phase 0.7 remains closed.** Later shared-authority revisions do not reopen its historical gate.

# 0.8 — Life and infrastructure expansion — in progress

Phase 0.8 deepens the persistent-life half of the game. New property, workshop, agriculture, logistics, social-life, companion-life, and automation features must consume or extend real world resources, fictional time, skills, relationships, locations, and existing persistent authorities.

## `0.8.100` — Home Foothold & Infrastructure — complete

The first authored improvement is **Build a Storage Chest**:

```text
2 Resin-Sealed Hardwood Boards
1 Redstone Copper Ingot
30 minutes canonical project labor
  -> Storage Chest furnishing
  -> furnishing-backed home storage 3 -> 8 slots
```

The Journal derives **Home & Foothold** with semantic Plan → Set aside materials → Start work → Finish actions. `projectEngine` owns project/material/labor state; world time/timed tasks own duration; inventory/furnishing authority owns the durable storage result; `homeInfrastructureEngine` is a bounded adapter/projection.

Original promoted track checkpoint:

```text
0b9251a43285443087050127da36b977cabdf7ee
496/496 tests
Benchmark 1 success
Product 0.8.100.1
Data 32
```

### `0.8.100.2` — onboarding and character-creation polish — complete

The follow-up revision added two deliberate Light/Dark palettes, corrupt-save deletion and clear-all recovery, original-world creator randomization, truthful six-discipline previews and real carried starter kits, and distinct authored Thornwall/Brasshaven/Mistmere arrival scenes.

Promoted checkpoint:

```text
0f00ef68a01ad001063803d67ff0efffc48ab3ef
505/505 tests
Benchmark 1 success
Product 0.8.100.2
Package 0.8.100
Data 33
```

## `0.8.200` — Home Workshop Capability — complete

This track proves that a home improvement can unlock a **real reusable production capability**, not merely a storage number or isolated property bonus.

The authored improvement is **Build a Joiner's Workbench**:

```text
2 Resin-Sealed Hardwood Boards
1 Copper Trail Clasp
45 minutes canonical project labor
  -> Joiner's Workbench furnishing
  -> woodshop + workshop workstation context while at home
```

The workbench has **0 storage slots**. Its durable value is capability: when the character is physically at the home place, `workstationEngine` derives `woodshop`/`workshop` tags from the placed furnishing. Away from home, those tags do not apply.

The existing **Work, Trade & Recover** surface then discovers recipes enabled by that furnishing through the existing settlement service projection. The proving recipe is the existing **Seal Elderwood Hardwood Board** process:

```text
1 Elderwood Hardwood
1 Elderwood Amber Resin
240 fictional seconds at crafting proficiency 0
  -> 1 Resin-Sealed Hardwood Board
  -> +2 crafting proficiency
  -> ordinary transformation/input/place provenance
```

This closes the intended infrastructure loop:

```text
regional effort
  -> durable home improvement
  -> local production capability
  -> less future workshop travel
  -> more efficient preparation and larger ambitions
```

Authority remains singular:

- generic projects own material/labor/status;
- timed tasks/world time own duration;
- furnishings own the durable placed object;
- `workstationEngine` owns workstation availability;
- `productionEngine` owns recipe requirements, input consumption, timed work, output, provenance, and mastery;
- the settlement service board and Journal remain derived presentation;
- no second property, workshop, production, inventory, mastery, or UI persistence system was introduced.

The follow-up resource-lifecycle audit also aligned authored sink metadata with actual infrastructure use: **Redstone Copper Ingot** and **Copper Trail Clasp** now explicitly advertise `construction` sinks, alongside the already-correct Resin-Sealed Hardwood Board.

Primary end-to-end guard: `tests/playerHomeWorkshopFlow.test.js`. It proves blocked-before-build → construction → active-build save/load → exactly-once furnishing → no hidden storage → home-only workstation tags → semantic production → canonical fictional time → output provenance/mastery → final save/load and validation.

Authoritative promoted runtime checkpoint:

```text
03ab71c7e96c54eaeffb75598ed01243fd390f21
506/506 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.8.200.1
Package 0.8.200
Data 34
```

Benchmark 1:

```text
1,000 player combat profiles      465.527ms  0.465527ms/op
1,000 enemy combat profiles       117.252ms  0.117252ms/op
1,000 basic attacks               550.132ms  0.550132ms/op
10,000 ticks / 5 subscribers       44.971ms  0.004497ms/op
10,000 direct route lookups      8708.613ms  0.870861ms/op
```

Data advances `33 -> 34` because the canonical furnishing catalog, home-infrastructure definition, and production-item sink metadata changed. Account Save remains 4 and Game State remains 5 because the track reuses existing project `data`, placed-furnishing IDs, work state, inventory, production, proficiency, and provenance contracts. Benchmark remains 1 because the workload/protocol is unchanged.

### `0.8.200` closure audit

**PASS.** The workbench is useful only at the actual home locality, grants no hidden storage, survives save/load, applies exactly once, feeds the existing workstation and production authorities, preserves provenance/mastery, and is surfaced through ordinary semantic browser play. The original `0.8.100` Storage Chest proof and all Phase 0.7 gates remain green.

Two integration failures were release/test synchronization issues rather than runtime defects: a historical Phase 0.7 test froze later shared subsystem versions, and the promoted pipeline manifest still pinned `0.8.100.2`. Both were repaired without weakening their historical/persistence contracts.

## Next Phase 0.8 boundary

`0.8.200` is closed. **Do not automatically broaden it into multiple workshop types, property tiers, farms, warehouses, social schedules, or automation.** The next work order should select one bounded Phase 0.8 seam and first audit its existing authority/data path.

Good candidate directions now include:

- agriculture/stewardship;
- logistics/warehousing/transport capacity;
- social schedules and relationship life;
- companion life breadth;
- earned automation.

# Later phases

## 0.9 — Adventure depth and release hardening

Difficult regions/dungeons, advanced combat/abilities, rare systems, high-level economy/production, UI/accessibility, balance, persistence policy, performance, and release tooling.

## 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, migratable, performant, and supported by enough interconnected content to sustain real play.
