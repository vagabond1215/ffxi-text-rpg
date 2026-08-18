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
- NPC schedules are authored recurring availability data evaluated against canonical fictional time. Availability is derived, not serialized as a second clock/state registry.
- Maps, campaign guidance, transport boards, settlement service boards, player information, home opportunity models, and social-schedule opportunity decoration are projections of acquired/current state.
- Safe settlements use named locality navigation; terrain-sensitive wilderness/dungeon spaces use discovery-relative spatial exploration.
- Persistent companions remain NPC-backed world participants.
- Ordinary browser presentation exposes what the character sees, knows, carries, remembers, needs, or can decide; implementation vocabulary stays outside normal play.

## Shared player-experience projections

`playerExperienceEngine`, `playerOpportunityEngine`, `playerContinuityEngine`, `playerDangerRecoveryEngine`, `playerCampaignReadabilityEngine`, `transportServiceBoardEngine`, `settlementServiceBoardEngine`, `playerInformationEngine`, and `playerSocialScheduleEngine` remain derived views/decorators over canonical domain authorities.

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

`homeInfrastructureEngine` is a bounded adapter over generic project and domain authorities. Furnishings own placed-object/storage effects; inventory owns container unlock/capacity/transfer; `workstationEngine` owns station context; `productionEngine` owns recipes, inputs, timed work, provenance, output, and mastery.

# Logistics authority (`0.8.300`–`0.8.400`)

`carriedLoadEngine.js` is a pure projection over unlocked inventory containers marked `countsAsCarriedCargo`. It does not persist a weight/cargo number.

At `0.8.300`, scheduled transport quotes and bookings stopped trusting caller-provided cargo. `transportServiceBoardEngine` derives current load for presentation and `transportEngine` independently derives it at booking, checks service allowance before fare deduction, and records the canonical load.

At `0.8.400`, the Field Satchel became an earned portable container while remaining cargo-honest:

```text
Inventory -> Field Satchel
  portable distribution changes
  total carried cargo does NOT change

Inventory/Field Satchel -> Home Safe
  goods leave portable carriage
  total carried cargo decreases
```

This remains intentionally slot-based rather than a premature mass/encumbrance simulation.

# Daily social availability authority (`0.8.500`)

## Authored schedule data

`npcSchedules.js` is the first canonical recurring NPC-availability catalog. It authors stable references and public availability windows; it does not contain a simulation clock or persisted runtime records.

Current proving record:

```text
schedule-thornwall-sera-talwin
NPC:   npc-thornwall-sera-talwin
POI:   poi-sandoria-s-alaune
Place: thornwall-southgate
Daily: 08:00–18:00
Role:  Southgate guide duty
```

`validateNpcScheduleCatalog()` owns cross-reference and window validation for this authored catalog: schedule IDs, NPC existence, POI/place consistency, unique claimed POI, integer in-day windows, ordering, and overlap checks. This validator is directly exercised by the track regression. The broader `validation` subsystem remains version `0.10.0`; `0.8.500` did not change its global contract merely to duplicate ownership.

## `npcScheduleEngine.js`

`NPC_SCHEDULE_ENGINE_VERSION = 1` is the single runtime availability authority. It reads canonical `state.worldTime` and authored schedule data to derive:

- whether the NPC/POI is available now;
- current window/end time when present;
- next available fictional world second;
- time until return;
- human-readable daily window and return guidance.

No `state.npcSchedules` registry is created. Save/load persists canonical fictional time through existing Game State 5; availability is recomputed after load.

The current model represents **public availability at a static canonical NPC location**. Sera's persistent NPC location remains Southgate. The schedule says when she is available there; it does not teleport or pathfind her elsewhere. Multi-location daily movement would be a separate future authority decision.

## Interaction enforcement

Availability is enforced below presentation so UI/command callers cannot bypass it:

```text
npcScheduleEngine
    |
    +-> localityEngine
    |     scheduled POI unavailable -> fail before position/discovery mutation
    |
    +-> poiEngine
    |     talk / POI action -> same availability check
    |
    +-> commitmentEngine
          accept / resolve / follow-up -> same giver availability check
```

`localityEngine` v2 exposes schedule status on locality POI records and rejects unavailable scheduled interactions before moving the character. `poiEngine` uses the same schedule for command-path talk/action. `commitmentEngine` v0.3.0 applies the giver check to acceptance, delivery resolution, and later follow-up.

This preserves authority separation: commitments still own obligation/reward state, relationships still own social continuity dimensions, NPC schedule data only constrains whether the conversation is currently available, and fictional time remains the clock.

## Browser projection

`playerSocialScheduleEngine` is pure derived presentation. It decorates commitment opportunity cards whose giver is currently unavailable:

- marks the opportunity blocked;
- adds the schedule/return-time requirement;
- removes the executable social action;
- recomputes recommendation so an impossible conversation is not recommended.

`gameViewModel` v0.14.0 also carries locality availability into nearby records and omits contextual Talk actions for scheduled-away POIs. The person/place remains visible with useful away/return guidance rather than disappearing from the player's knowledge.

No UI-owned schedule, appointment state, romance meter, wall-clock timer, or relationship counter was added.

# Resource lifecycle

Infrastructure/logistics consume ordinary canonical production goods. Current explicit construction sinks include Resin-Sealed Hardwood Board, Redstone Copper Ingot, Copper Trail Clasp, and Resin-Cured Hide Binding. Sink metadata is descriptive; actual consumption remains project/inventory authority.

# Character creation, navigation, economy, combat, and party

Guided creator state uses canonical original-world names/content and places starter equipment into ordinary carried inventory without auto-equipping it. Generic `createNewGameState()` remains neutral unless creator-specific options request the kit.

Safe-locality navigation remains named-place/POI based; wilderness/dungeons remain discovery-relative. Gathering/production/shop/inventory authorities own source capacity, tools, provenance, mastery, transactions, wallet changes, and storage. Combat 2.0 uses structured battle-local history and fictional-time readiness. Persistent party state remains NPC-backed.

# Persistence and version policy

Current compatibility mode: `pre-release-current-schema`.

```text
Product:       0.8.500.1
Package:       0.8.500
Account Save:  4
Game State:    5
Data:          36
Benchmark:     1
Codename:      Daily Social Availability
```

Data 35 introduced Field Satchel authored/container semantics. Data 36 adds the canonical NPC schedule catalog. Account Save remains 4. Game State remains 5 because `0.8.500` derives availability from existing persisted fictional time and introduces no persisted schedule field/meaning. Benchmark remains 1 because the workload is unchanged.

Relevant current registrations:

```text
versionManifest:          0.8.500.1
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
commitments:              0.3.0
relationships:            0.1.0
npcSchedules:             0.1.0
playerSocialSchedules:    0.1.0
localityNavigation:       0.2.0
gameViewModels:           0.14.0
validation:               0.10.0
```

Database registration:

```text
npcSchedules  implemented 0.1.0
```

## Current authoritative runtime checkpoint

```text
fde1d30d76264ea25af6bad4d829545c488eec9b
509/509 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.8.500.1
Package 0.8.500
Data 36
```

Benchmark 1:

```text
player combat profiles  0.367612 ms/op
enemy combat profiles   0.101654 ms/op
basic attacks            0.434260 ms/op
tick dispatch            0.004321 ms/op
direct route lookup      0.687768 ms/op
```

Primary social-availability guard: `tests/playerSocialScheduleFlow.test.js`. It proves present-at-08:00, away-at-18:30, semantic and command enforcement, Journal/browser alignment, no hidden mutation, save/load re-derivation, next-day return, commitment availability, catalog validation, and current game/world validation.

## Carried-forward rule

Presentation adapters may make canonical state easier to understand and operate, but they must not become second authorities. Future Phase 0.8 work should extend real fictional time, materials, inventory, projects, relationships, locations, party state, production, transport, world knowledge, and bounded authored schedules rather than creating isolated management simulations.
