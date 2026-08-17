# Architecture

Hearth & Horizon is an original text-first persistent fantasy life RPG built around one deterministic world state and one continuous character. This document describes current runtime authority, not speculative final architecture.

## Active browser path

```text
index.html
  -> js/main.js
      -> createDomApp(host)
          -> authoritative game/save/intent services
          -> createGameViewModel(state, uiState)
          -> renderDomApp(...)
      -> installOnboardingEnhancements(host)
          -> presentation-only theme/creator/save-recovery controls
```

The semantic DOM/CSS shell is the active player interface. Canvas modules remain bounded regression/reference code and must not become normal gameplay authority again.

## Authority rules

- Fictional time, timed tasks, interrupts, work, projects, travel, combat readiness, statuses, recovery, and day review share one canonical simulation substrate.
- Continuous-character stats, learned skills/capabilities, and work proficiency belong to the person; disciplines are contextual training traditions.
- Inventory/equipment/tool state is canonical for preparation and practical capability checks.
- Resources preserve source/transformation provenance and one-time ownership; same-ID stacks with different histories remain distinct.
- Projects own persistent material/labor progress; specialized systems may attach bounded project metadata and apply domain-specific completion effects.
- Home/infrastructure composes projects, timed tasks, canonical materials, inventory, furnishings, workstations, and production. It does not own a second item store, construction clock, workstation registry, recipe engine, mastery counter, or storage-capacity formula.
- Commitments own accepted/resolved/follow-up state and one-time rewards. General named-NPC relationship continuity lives in `state.relationships`; companion-specific relationship/tactics state remains in party/companion authority.
- Maps, campaign guidance, transport boards, settlement service boards, player information, and home opportunity models are projections of acquired/current state.
- Safe settlements use named locality navigation; terrain-sensitive wilderness/dungeon spaces use discovery-relative spatial exploration.
- Persistent companions remain NPC-backed world participants rather than summons.
- Ordinary browser presentation exposes what the character sees, knows, carries, remembers, needs, or can decide. Architecture, compatibility, raw state/task channels, and hidden topology stay outside normal play.

## Player-experience projections

`playerExperienceEngine` and `playerOpportunityEngine` read real origin, equipment, locality, route, work, gathering, inventory, encounter, and service state; they do not persist tutorial progress.

`playerContinuityEngine`, `playerDangerRecoveryEngine`, `playerCampaignReadabilityEngine`, `transportServiceBoardEngine`, `settlementServiceBoardEngine`, and `playerInformationEngine` remain derived views over canonical domain authorities. The semantic browser delegates actual mutations to travel, transport, production, shop, recovery, equipment, commitment, party, locality, inventory, and project engines.

`activityAdvanceEngine` provides semantic advance-to-completion for the current canonical activity without a second clock. It composes travel, gathering/production work, defeated-body recovery, campaign recovery, and generic `project.labor`.

## Home, project, workstation, and production architecture (`0.8.100`–`0.8.200`)

### Generic project authority

`projectEngine.js` remains the persistent construction/work substrate. A project owns:

- stable ID, kind, label, and status;
- material requirements and contributed quantities;
- labor duration and linked `project.labor` timed task;
- creation/start/completion world timestamps;
- bounded domain `data` used by systems that compose with the generic project contract.

Material contribution removes canonical inventory quantity atomically. Labor uses the shared fictional-time/timed-task substrate. Generic project reconciliation owns generic completion.

### Authored home-infrastructure data

`homeInfrastructure.js` contains authored improvement definitions, not a property simulation.

Current improvements:

```text
Build a Storage Chest
  2 Resin-Sealed Hardwood Boards
  1 Redstone Copper Ingot
  30 minutes labor
    -> Storage Chest furnishing
    -> +5 furnishing-backed storage slots

Build a Joiner's Workbench
  2 Resin-Sealed Hardwood Boards
  1 Copper Trail Clasp
  45 minutes labor
    -> Joiner's Workbench furnishing
    -> woodshop + workshop workstation tags while at home
```

The workbench deliberately has `storageSlots: 0`. Its value is production capability rather than hidden capacity.

### `homeInfrastructureEngine.js`

`HOME_INFRASTRUCTURE_VERSION = 2` remains a bounded domain adapter over generic authorities. It:

- resolves the character's current home from existing unlocked home points;
- begins generic project records with home-improvement metadata;
- delegates material contribution and labor to project authority;
- reconciles project completion;
- places the authored furnishing exactly once;
- emits `home.infrastructure-completed` with the durable benefit;
- derives the **Home & Foothold** Journal entries/actions;
- validates home-project references against authored definitions.

It does **not** own a property registry, construction queue, construction currency, home-only inventory, station registry, recipe list, mastery state, or UI persistence model.

### Furnishing authority

`mogHouseFurniture.js` remains the bounded internal legacy-named furnishing catalog; player-facing copy uses home/lodging/furnishing terminology.

Furnishings own durable placed-object identity and storage contribution. `calculateFurnitureStorageCapacity` remains the actual storage-capacity formula. A fresh Bronze Bed + Maple Table provide 3 slots; Storage Chest raises that to 8. Joiner's Workbench contributes zero storage.

### Workstation authority

`workstationEngine.js` is the sole semantic workstation-availability authority.

It derives station tags from:

1. current contextual POIs/services; and
2. placed workstation-bearing furnishings **only when the character is physically at the current home place**.

For the Joiner's Workbench:

```text
furnishing tags: workbench + woodshop
        |
        v
workstationEngine
        |
        +-> workshop
        +-> woodshop
```

Away from home, those furnishing-derived tags are absent. This prevents a durable home upgrade from becoming an omnipresent crafting permission.

### Production authority

`productionEngine.js` remains authoritative for recipe requirements, station checks, atomic input consumption, timed work, output storage, transformation/input provenance, and persistent work proficiency.

The `0.8.200` proving loop reuses the existing `craft-elderwood-resin-board` definition:

```text
1 Elderwood Hardwood
1 Elderwood Amber Resin
woodshop required
240 seconds at proficiency 0
+2 crafting proficiency
  -> Resin-Sealed Hardwood Board
```

Building the workbench changes **context**, not the recipe. Once the furnishing makes `woodshop` available at home, the same existing production definition becomes executable through the same production engine.

### Settlement service projection

`settlementServiceBoardEngine` version 2 merges current home-derived station tags into the existing settlement work projection. It may expose a derived `homeWorkshop` summary and production choices, but it owns no furnishing, workstation permission, recipe, input/output, time, or mastery state.

The active Craft browser surface remains **Work, Trade & Recover**. Home-enabled production therefore appears through the same semantic player surface as public-workshop production rather than a second home-crafting menu.

### Resource lifecycle

Infrastructure consumes ordinary canonical goods. Authored item sink metadata now matches those real uses:

- Resin-Sealed Hardwood Board → `construction`;
- Redstone Copper Ingot → `construction`;
- Copper Trail Clasp → `construction`.

This is descriptive lifecycle metadata; actual item consumption remains atomic project contribution through inventory/project authority.

## Character creation and onboarding architecture (`0.8.100.2`)

`characterCreationModel.js` owns normalized creator choices and deterministic creator randomization over canonical ancestry, discipline, origin, original-world names, authored creator prose, and starter-kit definitions.

Guided browser creation explicitly requests the starter kit. Existing equipment items enter canonical carried inventory and are not auto-equipped. Generic `createNewGameState()` remains neutral unless that creator option is supplied.

`domOnboardingEnhancements.js` is a presentation adapter for name/whole-character dice, discipline preview, character-save delete controls, theme controls, and local-data recovery. `saveRecovery.js` mutates the existing account registry/save layer rather than introducing another persistence system.

The active browser exposes Light/Dark palettes only. The historical settings normalizer may still accept `highContrast`; that dormant value is non-blocking compatibility debt.

## Navigation, economy, combat, party, and recovery

Safe-locality navigation remains named-place/POI based. Wilderness/dungeons use discovery-relative spatial navigation and acquired map knowledge. Route/transport engines own inter-place travel, fares, cadence, cargo, fictional time, and party arrival.

Gathering/production/shop/inventory authorities continue to own source capacity, tools, transformation provenance, work mastery, atomic transactions, wallet mutation, and storage. Physical creature-material recovery remains separate from battle progression rewards.

Combat 2.0 uses structured battle-local history and fictional-time readiness. Persistent party state is NPC-backed. Mara Venn's field approach lives in existing party tactics and affects derived battle-entry attributes without mutating permanent stats or creating companion XP.

## Persistence and version policy

Current compatibility mode: `pre-release-current-schema`.

```text
Product:      0.8.200.1
Package:      0.8.200
Account Save: 4
Game State:   5
Data:         34
Benchmark:    1
Codename:     Home Workshop Capability
```

Data advances `33 -> 34` because the canonical furnishing catalog, second home-infrastructure definition, and production-item construction-sink metadata changed.

Account Save remains 4. Game State remains 5 because the new capability fits existing project `data`, placed-furnishing IDs, inventory, work/proficiency, production, and provenance structures. No persisted field or meaning requires migration.

Relevant advanced registrations:

```text
versionManifest:         0.8.200.1
homeInfrastructure:      0.2.0
activityAdvance:         0.4.0
workstations:            0.3.0
productionItems:         0.3.0
settlementServiceBoard:  0.2.0
```

## Current authoritative runtime checkpoint

```text
03ab71c7e96c54eaeffb75598ed01243fd390f21
506/506 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.8.200.1
Data 34
```

Benchmark 1:

```text
player combat profiles  0.465527 ms/op
enemy combat profiles   0.117252 ms/op
basic attacks            0.550132 ms/op
tick dispatch            0.004497 ms/op
direct route lookup      0.870861 ms/op
```

`tests/playerHomeWorkshopFlow.test.js` is the primary new end-to-end guard. It proves home-local station context, zero hidden storage, exactly-once furnishing application, active-build/final save-load continuity, semantic service discovery, canonical production time, provenance, mastery, validation, and player-facing presentation.

## Carried-forward rule

Presentation adapters may make canonical state easier to understand and operate, but they must not become second authorities. Future Phase 0.8 work should extend real fictional time, materials, inventory, projects, relationships, locations, party state, production, transport, and world knowledge rather than creating isolated management simulations.
