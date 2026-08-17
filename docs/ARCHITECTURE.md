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

The semantic DOM/CSS shell is the active player interface. Canvas code remains bounded regression/reference code.

## Authority rules

- Fictional time, timed tasks, interrupts, work, projects, travel, combat readiness, recovery, and day review share one canonical simulation substrate.
- Continuous-character stats, learned skills/capabilities, and work proficiency belong to the person; disciplines are contextual training traditions.
- Inventory/equipment/tool/container state is canonical for preparation, capacity, access, and practical capability checks.
- Resources preserve source/transformation provenance and one-time ownership.
- Projects own persistent material/labor progress; bounded domain adapters may attach project metadata and apply exactly-once completion effects.
- Home/infrastructure composes projects, timed tasks, materials, inventory, furnishings, workstations, production, and container unlocks. It does not own a second item store, construction clock, workstation registry, recipe engine, mastery counter, cargo wallet, or capacity formula.
- Transport owns fares, cadence, departure, arrival, and service cargo limits. It does not trust UI-supplied cargo counts.
- Commitments own accepted/resolved/follow-up state and one-time rewards. General named-NPC relationship continuity lives in `state.relationships`; companion-specific state remains in party/companion authority.
- Maps, campaign guidance, transport boards, settlement service boards, player information, and home opportunity models are projections of acquired/current state.
- Safe settlements use named locality navigation; terrain-sensitive wilderness/dungeon spaces use discovery-relative spatial exploration.
- Persistent companions remain NPC-backed world participants.
- Ordinary browser presentation exposes what the character sees, knows, carries, remembers, needs, or can decide; implementation vocabulary stays outside normal play.

## Shared player-experience projections

`playerExperienceEngine`, `playerOpportunityEngine`, `playerContinuityEngine`, `playerDangerRecoveryEngine`, `playerCampaignReadabilityEngine`, `transportServiceBoardEngine`, `settlementServiceBoardEngine`, and `playerInformationEngine` remain derived views over canonical domain authorities.

`activityAdvanceEngine` provides semantic advance-to-completion without a second clock. It composes travel, gathering/production work, recovery, and generic `project.labor`, including home-infrastructure completion effects.

# Home and infrastructure authority (`0.8.100`–`0.8.400`)

## Generic projects

`projectEngine.js` remains the persistent construction/work substrate. A project owns stable identity/status, material requirements/contributions, labor duration, linked `project.labor` task, timestamps, and bounded domain `data`. Material contribution atomically removes canonical inventory quantity. Labor advances through shared fictional time.

## Authored home improvements

`homeInfrastructure.js` contains authored improvements, not a property-management simulation.

Current bounded improvements:

```text
Build a Storage Chest
  2 Resin-Sealed Hardwood Boards
  1 Redstone Copper Ingot
  30 minutes labor
    -> Storage Chest furnishing
    -> +5 furnishing-backed home-storage slots

Build a Joiner's Workbench
  2 Resin-Sealed Hardwood Boards
  1 Copper Trail Clasp
  45 minutes labor
    -> Joiner's Workbench furnishing
    -> woodshop + workshop context while at home

Make a Field Satchel
  2 Resin-Cured Hide Bindings
  1 Copper Trail Clasp
  30 minutes labor
    -> unlock existing Field Satchel container
    -> 8 portable slots
    -> contents remain carried transport cargo
```

The definition contract supports exactly one durable **furnishing** or **container** benefit. The adapter does not invent separate construction state for either type.

## `homeInfrastructureEngine.js`

Current `HOME_INFRASTRUCTURE_VERSION = 3` is a bounded adapter. It resolves the character's existing home, begins generic projects, delegates material contribution/labor, reconciles generic completion, and then applies the authored durable benefit exactly once:

- furnishing benefit → place the furnishing in existing furnishing state;
- container benefit → call canonical inventory container-unlock authority.

It emits `home.infrastructure-completed`, derives **Home & Foothold** Journal entries/actions, and validates project-to-definition references. It owns neither inventory capacity nor portable cargo accounting.

## Furnishing/workstation/production authority

Furnishings own placed-object identity and furnishing storage contribution. `workstationEngine` is the sole semantic workstation-context authority and derives station tags from current contextual POIs/services plus placed workstation-bearing furnishings only while the character is physically at home.

The Joiner's Workbench therefore changes production **context**, not recipes. `productionEngine` remains authoritative for recipe requirements, station checks, input consumption, timed work, output storage, provenance, and work proficiency. The existing **Work, Trade & Recover** service projection discovers home-enabled recipes without creating a home-only crafting menu.

# Logistics authority (`0.8.300`–`0.8.400`)

## Canonical carried load

`carriedLoadEngine.js` is a pure derived projection over inventory containers. It does not persist a weight/cargo number.

At `0.8.300`, scheduled-transport cargo became canonical: service quotes and bookings derive current occupied carried slots rather than trusting caller-provided `cargoUnits`. `transportEngine` checks that load against the authored service allowance before fare deduction and records the derived load in the journey snapshot.

At `0.8.400`, carried load expanded from the main Inventory alone to **all unlocked container definitions marked `countsAsCarriedCargo`**. Current carried containers include the main Inventory and the earned Field Satchel. Home Safe/storage and wardrobes are not transport cargo.

Consequences:

```text
Inventory -> Field Satchel
  portable space distribution changes
  total carried cargo does NOT change

Inventory/Field Satchel -> Home Safe
  goods leave portable carried containers
  total carried cargo decreases
```

This is intentionally slot-based rather than a premature mass/encumbrance simulation. The transport allowance therefore measures occupied portable slots under the current contract.

## Inventory container authority

`inventoryContainers.js` authors capacity/access/cargo semantics. `inventoryEngine.js` owns current container records, access, storage, transfer, and the idempotent `unlockInventoryContainer` operation.

The stable internal ID `mogSatchel` remains legacy-shaped for persistence continuity, but player-facing copy is **Field Satchel**. Unlocking it changes the existing `unlocked` field; no Game State migration or second portable-inventory registry is required.

## Transport service projection

`transportServiceBoardEngine` derives the same current carried-load fact used by `transportEngine`. The board can explain `load N/allowance` and capacity blockers; the booking path independently derives the load again, so a browser or command caller cannot bypass the rule by falsifying payload data.

# Resource lifecycle

Infrastructure and logistics consume ordinary canonical production goods. Current explicit construction sinks include:

```text
Resin-Sealed Hardwood Board
Redstone Copper Ingot
Copper Trail Clasp
Resin-Cured Hide Binding
```

Sink metadata is descriptive. Actual consumption remains project/inventory authority.

# Character creation, navigation, economy, combat, and party

Guided creator state uses canonical original-world names/content and places starter equipment into ordinary carried inventory without auto-equipping it. Generic `createNewGameState()` remains neutral unless creator-specific options request the kit.

Safe-locality navigation remains named-place/POI based; wilderness/dungeons remain discovery-relative. Gathering/production/shop/inventory authorities own source capacity, tools, provenance, mastery, transactions, wallet changes, and storage. Combat 2.0 uses structured battle-local history and fictional-time readiness. Persistent party state remains NPC-backed.

# Persistence and version policy

Current compatibility mode: `pre-release-current-schema`.

```text
Product:       0.8.400.1
Package:       0.8.400
Account Save:  4
Game State:    5
Data:          35
Benchmark:     1
Codename:      Portable Field Logistics
```

Data 34 introduced the Joiner's Workbench and related construction lifecycle metadata. Data 35 adds the canonical Field Satchel home-improvement/container semantics and Resin-Cured Hide Binding construction sink.

Account Save remains 4. Game State remains 5 because all new durable behavior fits existing project records, furnishing IDs, container records/`unlocked`, inventory, transport journey data, production, work proficiency, and provenance structures.

Relevant current registrations:

```text
versionManifest:          0.8.400.1
homeInfrastructure:       0.3.0
activityAdvance:          0.5.0
workstations:             0.3.0
productionItems:          0.4.0
settlementServiceBoard:   0.2.0
transport:                0.3.0
carriedLoad:              0.2.0
transportServiceBoard:    0.2.0
inventoryContainers:      0.6.0
inventoryTransfers:       0.6.0
```

## Current authoritative runtime checkpoint

```text
d1a43568c5ca4dd7e57fb86316b422c35025ce07
Product 0.8.400.1
Package 0.8.400
Data 35
Benchmark 1
```

Promoted Check run `32080844409` completed successfully; its Test and Benchmark steps both succeeded. Exact test-count/timing lines were not retained in the available connector evidence and are therefore not claimed here.

Primary logistics guards are `tests/playerTransportLogisticsFlow.test.js` and `tests/playerPortableFieldLogisticsFlow.test.js`, alongside the canonical transport/inventory/home-infrastructure regressions.

## Carried-forward rule

Presentation adapters may make canonical state easier to understand and operate, but they must not become second authorities. Future Phase 0.8 work should extend real fictional time, materials, inventory, projects, relationships, locations, party state, production, transport, and world knowledge rather than creating isolated management simulations.
