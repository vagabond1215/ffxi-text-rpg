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
- Campaign recovery remains the one character/party recovery authority. Settlement recovery may restore recruited companions physically present in the safe locality without changing their active-party membership.
- Maps, campaign guidance, transport boards, settlement service boards, player information, home opportunity models, and social-schedule opportunity decoration are projections of acquired/current state.
- Safe settlements use named locality navigation; terrain-sensitive wilderness/dungeon spaces use discovery-relative spatial exploration.
- Persistent companions remain NPC-backed world participants; party authority owns recruitment, active membership, location continuity, safe separation/reunion, and battle synchronization.
- Ordinary browser presentation exposes what the character sees, knows, carries, remembers, needs, or can decide; implementation vocabulary stays outside normal play.

## Shared player-experience projections

`playerExperienceEngine`, `playerOpportunityEngine`, `playerContinuityEngine`, `playerDangerRecoveryEngine`, `playerCampaignReadabilityEngine`, `transportServiceBoardEngine`, `settlementServiceBoardEngine`, `playerInformationEngine`, and `playerSocialScheduleEngine` remain derived views/decorators over canonical domain authorities.

`activityAdvanceEngine` provides semantic advance-to-completion without a second clock. It composes travel, gathering/production work, recovery, and generic `project.labor`, including home-infrastructure completion effects.

# Home and infrastructure authority (`0.8.100`–`0.8.400`)

`projectEngine.js` remains the persistent construction/work substrate. A project owns stable identity/status, material requirements/contributions, labor duration, linked `project.labor` task, timestamps, and bounded domain `data`. Material contribution atomically removes canonical inventory quantity. Labor advances through shared fictional time.

`homeInfrastructure.js` authors bounded improvements rather than a property-management simulation. Current durable proofs are Storage Chest capacity, Joiner's Workbench workstation context, and Field Satchel portable capacity. `homeInfrastructureEngine` composes generic project and domain authorities; furnishings own placed-object/storage effects, inventory owns container unlock/capacity/transfer, `workstationEngine` owns station context, and `productionEngine` owns recipes, inputs, timed work, provenance, output, and mastery.

# Logistics authority (`0.8.300`–`0.8.400`)

`carriedLoadEngine.js` is a pure projection over unlocked inventory containers marked `countsAsCarriedCargo`. It does not persist a weight/cargo number.

At `0.8.300`, scheduled transport quotes and bookings stopped trusting caller-provided cargo. `transportServiceBoardEngine` derives current load for presentation and `transportEngine` independently derives it at booking, checks service allowance before fare deduction, and records canonical load.

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

`npcSchedules.js` is the canonical recurring NPC-availability catalog. It authors stable NPC/POI/place references and public availability windows; it does not contain a simulation clock or persisted runtime records. The first proving record is Sera Talwin's Southgate guide duty, daily 08:00–18:00.

`npcScheduleEngine` is the single runtime availability authority. It reads canonical `state.worldTime` and authored schedule data to derive current availability, current-window end, next available fictional world second, time until return, and player-readable guidance. There is no `state.npcSchedules` registry.

The same authority is enforced beneath presentation by locality interaction, command-path POI talk/action, and commitment accept/resolve/follow-up. `playerSocialScheduleEngine` and `gameViewModel` only project that state into Journal/locality/browser decisions. The current model is public availability at a static canonical NPC location, not autonomous multi-location NPC pathfinding.

# Companion convalescence authority (`0.8.600`)

## Recovery scope

`campaignRecoveryEngine.js` remains the one recovery authority and advances to version 2. `0.8.600` does **not** add a companion-specific recovery registry, passive healing clock, new task kind, or wall-clock dependency.

The recovery scope is deliberately asymmetric:

```text
field recovery
  -> player + active companions

defeat recovery
  -> player + active companions

settlement recovery
  -> player
  -> active companions
  -> inactive recruited companions whose locationId equals the current safe settlement
```

Settlement rest still uses the existing `recovery.settlement` timed task and 3600 canonical fictional seconds. Recovery can be available when the player is healthy but a nearby recruited companion is injured. Restoring an inactive companion changes HP/MP only; it does not silently add that person back to `activeCompanionIds`.

The recovery model now projects `playerInjured`, `injuredCompanionCount`, and the local recoverable companion set so presentation can explain why safe rest is useful. Recovery start/completion semantic events include the companion scope and before/after resource snapshots.

## Party safety and reunion

`partyEngine` keeps the existing persistent companion state and advances its registered behavioral responsibility to `0.3.0` without changing `PARTY_STATE_VERSION = 1`.

A companion at 0 HP:

- cannot rejoin until recovered, preserving the existing `joinCompanion` rule;
- may be left inactive in a safe settlement, where settlement recovery can restore them;
- may **not** be left behind in unsafe wilderness. `leaveCompanion` returns `party.downed-in-danger` before membership/location mutation.

After settlement recovery, reunion remains an explicit party action. This preserves the distinction between physical recovery and social/party membership.

## Settlement classification dependency

`localityClassificationEngine.js` now owns the dependency-light safe-settlement predicate used by both locality and party code. `localityEngine.js` re-exports `SETTLEMENT_LOCALITY_TYPES` and `isSettlementLocality`, preserving its public API and locality-navigation semantics.

The extraction exists to avoid a `partyEngine <-> localityEngine` circular dependency. It is a structural refactor of an existing classification rule, not a second locality authority.

## Browser agreement

`gameViewModel` advances to `0.15.0`. An inactive local companion only receives the **Travel together** action when HP is above zero. At 0 HP the Character surface still shows the companion and HP state but suppresses the impossible reunion action; after canonical settlement recovery the action reappears.

This is presentation alignment only. `partyEngine` remains authoritative for whether joining succeeds.

# Resource lifecycle

Infrastructure/logistics consume ordinary canonical production goods. Current explicit construction sinks include Resin-Sealed Hardwood Board, Redstone Copper Ingot, Copper Trail Clasp, and Resin-Cured Hide Binding. Sink metadata is descriptive; actual consumption remains project/inventory authority.

# Character creation, navigation, economy, combat, and party

Guided creator state uses canonical original-world names/content and places starter equipment into ordinary carried inventory without auto-equipping it. Generic `createNewGameState()` remains neutral unless creator-specific options request the kit.

Safe-locality navigation remains named-place/POI based; wilderness/dungeons remain discovery-relative. Gathering/production/shop/inventory authorities own source capacity, tools, provenance, mastery, transactions, wallet changes, and storage. Combat 2.0 uses structured battle-local history and fictional-time readiness. Persistent party state remains NPC-backed.

# Persistence and version policy

Current compatibility mode: `pre-release-current-schema`.

```text
Product:       0.8.600.1
Package:       0.8.600
Account Save:  4
Game State:    5
Data:          36
Benchmark:     1
Codename:      Companion Convalescence
```

Data 36 remains current. `0.8.600` changes no authored gameplay catalog: it composes existing companion HP/location/membership state, safe-locality classification, recovery tasks, and fictional time. Game State remains 5 because no persisted structure or meaning is added; Account Save remains 4. Benchmark remains 1 because the workload is unchanged.

Relevant current registrations:

```text
versionManifest:          0.8.600.1
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
campaignRecovery:         0.2.0
party:                    0.3.0
localityNavigation:       0.2.0
gameViewModels:           0.15.0
validation:               0.10.0
```

Database registration reflects party's expanded safe separation/reunion responsibility at `implemented 0.3.0`; the companion catalog remains `0.2.0` because no companion definition changed.

## Current authoritative runtime checkpoint

```text
04211e8909996b1ac34fa91ae1cdd7aa216b86f8
511/511 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.8.600.1
Package 0.8.600
Data 36
```

Benchmark 1:

```text
player combat profiles  0.436701 ms/op
enemy combat profiles   0.102201 ms/op
basic attacks            0.519382 ms/op
tick dispatch            0.005689 ms/op
direct route lookup      0.810038 ms/op
```

Primary companion-convalescence guard: `tests/playerCompanionRecoveryFlow.test.js`. It proves safe separation, blocked zero-HP reunion, healthy-player settlement recovery for an inactive local companion, exact one-hour fictional-time cost, full HP/MP restoration without implicit membership change, semantic reunion availability after recovery, save/load, validation, and unsafe-wilderness separation blocking.

## Carried-forward rule

Presentation adapters may make canonical state easier to understand and operate, but they must not become second authorities. Future Phase 0.8 work should extend real fictional time, materials, inventory, projects, relationships, locations, party state, recovery, production, transport, world knowledge, and bounded authored schedules rather than creating isolated management simulations.
