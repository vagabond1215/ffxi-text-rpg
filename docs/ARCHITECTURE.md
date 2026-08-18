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

- Fictional time, timed tasks, interrupts, work, projects, travel, combat readiness, recovery, and day review share one canonical deterministic simulation substrate.
- Continuous-character stats, learned skills/capabilities, and work proficiency belong to the person; disciplines are contextual training traditions.
- Inventory/equipment/tool/container state is canonical for preparation, capacity, access, carried load, and practical capability checks.
- Resources preserve source/transformation provenance and one-time ownership.
- Projects own persistent material/labor progress; bounded domain adapters may attach project metadata and apply exactly-once completion effects.
- Home/infrastructure composes projects, timed tasks, materials, inventory, furnishings, workstations, production, and container unlocks. It does not own a second item store, construction clock, workstation registry, recipe engine, mastery counter, cargo wallet, or capacity formula.
- Transport owns fares, cadence, departure, arrival, journey cargo snapshots, and service cargo limits. It derives carried load from inventory and does not trust UI/caller cargo counts.
- Commitments own accepted/resolved/follow-up state and one-time rewards. General named-NPC relationship continuity lives in `state.relationships`; companion-specific state remains in party/companion authority.
- NPC schedules are authored recurring availability data evaluated against canonical fictional time. Availability is derived, not serialized as a second clock/state registry.
- Campaign recovery remains the one character/party recovery authority. Settlement recovery may restore recruited companions physically present in the safe locality without changing active-party membership.
- Maps, campaign guidance, transport boards, settlement service boards, player information, home opportunity models, and social-schedule decoration are projections of acquired/current state.
- Safe settlements use named locality navigation; terrain-sensitive wilderness/dungeon spaces use discovery-relative spatial exploration.
- Persistent companions remain NPC-backed world participants; party authority owns recruitment, active membership, location continuity, safe separation/reunion, and battle synchronization.
- Ordinary browser presentation exposes what the character sees, knows, carries, remembers, needs, or can decide; implementation vocabulary stays outside normal play.

## Shared player-experience projections

`playerExperienceEngine`, `playerOpportunityEngine`, `playerContinuityEngine`, `playerDangerRecoveryEngine`, `playerCampaignReadabilityEngine`, `transportServiceBoardEngine`, `settlementServiceBoardEngine`, `playerInformationEngine`, and `playerSocialScheduleEngine` remain derived views/decorators over canonical domain authorities.

`activityAdvanceEngine` provides semantic advance-to-completion without a second clock. It composes travel, gathering/production work, recovery, and generic `project.labor`, including home-infrastructure completion effects.

## Home, inventory, and infrastructure authority

`projectEngine.js` remains the persistent construction/work substrate. A project owns stable identity/status, material requirements/contributions, labor duration, linked `project.labor` task, timestamps, and bounded domain `data`. Material contribution atomically removes canonical inventory quantity. Labor advances through shared fictional time.

`homeInfrastructure.js` authors bounded improvements rather than a property-management simulation. Current durable proofs are Storage Chest capacity, Joiner's Workbench workstation context, and Field Satchel portable capacity.

Canonical home/inventory state after `0.8.600.2` is:

```text
player.inventoryState.home
  isAtHome
  placedFurniture

player.inventoryState.containers
  inventory
  homeSafe
  homeSafe2
  storage
  homeLocker
  fieldSatchel
  fieldSack
  fieldCase
  wardrobe1 ... wardrobe8
```

Inherited `mogHouse` state and `mog*` home/portable container identifiers are not canonical aliases and are not reconstructed on load. `homeFurnishings.js` owns canonical furnishing definitions; inventory owns container unlock/access/capacity/transfer; `workstationEngine` derives home workstation context from placed furnishings; `productionEngine` owns recipe requirements/work/inputs/outputs/provenance/mastery.

## Logistics authority

`carriedLoadEngine.js` is a pure projection over unlocked inventory containers marked `countsAsCarriedCargo`. It does not persist a second live cargo counter.

```text
Inventory -> Field Satchel
  portable distribution changes
  total carried cargo does NOT change

Inventory/Field Satchel -> Home Safe
  goods leave portable carriage
  total carried cargo decreases
```

`transportServiceBoardEngine` derives current load for presentation and `transportEngine` independently derives it at booking, checks allowance before fare deduction, and records the canonical journey load. The view-model transport action no longer sends the historical `cargoUnits: 0` placeholder.

The model remains intentionally slot-based rather than a premature mass/encumbrance simulation.

## Daily social availability authority

`npcSchedules.js` is the canonical recurring NPC-availability catalog. It authors stable NPC/POI/place references and public availability windows; it does not contain a simulation clock or persisted runtime records.

`npcScheduleEngine` reads canonical `state.worldTime` and authored schedule data to derive current availability, current-window end, next available fictional world second, time until return, and player-readable guidance. The same authority is enforced below presentation by locality interaction, command-path POI talk/action, and commitment accept/resolve/follow-up.

The current model is public availability at a static canonical NPC location, not autonomous multi-location NPC pathfinding.

## Companion convalescence authority

`campaignRecoveryEngine.js` remains the one recovery authority.

```text
field recovery
  -> player + active companions

defeat recovery
  -> player + active companions

settlement recovery
  -> player
  -> active companions
  -> inactive recruited companions physically present in the safe settlement
```

Settlement rest uses the existing `recovery.settlement` task and 3600 canonical fictional seconds. Recovery may be useful while the player is healthy if a nearby recruited companion is injured. Healing an inactive companion changes resources only; it does not silently change active membership.

`partyEngine` rejects leaving a 0-HP companion behind in unsafe wilderness before membership/location mutation. `localityClassificationEngine.js` owns the dependency-light safe-settlement predicate shared by party/locality code. Browser presentation suppresses **Travel together** while the local inactive companion is at 0 HP; party authority still decides whether joining succeeds.

## Persistence authority — current schema only

Current compatibility mode is `pre-release-current-schema`.

```text
Product:       0.8.600.2
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     1
Codename:      Current Schema Cleanup
```

`js/text/save.js` owns local account/session/character persistence. Current keys are `hearthHorizonAccounts` and `hearthHorizonAccountSession`; accepted persisted payloads use `base64-json-v1` and exact current Account/Game State versions.

Old pre-alpha registries/states are rejected rather than automatically migrated, rewritten, or lazily reconstructed. The deleted active `saveMigrations.js` layer is not part of the current runtime. `migrationEngine.js` remains a generic utility for a future deliberate migration requirement.

`createNewGameState()` derives its schema version from `VERSION.gameState`; validation uses the same runtime authority. This prevents independent hard-coded schema numbers from drifting.

Account Save 5 records the current account/session persistence contract. Game State 6 records the canonical home/container state and identifiers. Data 37 records the canonical furnishing/container stable-ID cleanup. Benchmark remains 1 because the benchmark workload is unchanged.

Relevant current registrations:

```text
versionManifest:       0.8.600.2
homeInfrastructure:    0.4.0
workstations:          0.3.1
gameViewModels:        0.15.1
uiIntents:             0.10.1
accountSaves:          0.7.0
saveEncoding:          0.5.0
validation:            0.11.0
inventoryContainers:   0.7.0
inventoryTransfers:    0.7.0
homeStorage:           0.4.0
```

Theme settings are currently Light/Dark only; the active intent layer does not generate the historical `highContrast` value.

## Validated cleanup runtime checkpoint

```text
23c373310bac90b20e14b840cc4221e3ca648daf
Check 32104815961
507/507 tests
0 failed
0 skipped
Benchmark 1 success
```

Benchmark 1:

```text
player combat profiles  0.465978 ms/op
enemy combat profiles   0.117722 ms/op
basic attacks            0.538805 ms/op
tick dispatch            0.004715 ms/op
direct route lookup      0.894560 ms/op
```

The lower test count versus the historical `0.8.600.1` gate is intentional: obsolete save-migration integration tests were removed with the compatibility layer, while strict current-schema rejection/round-trip tests cover the new persistence contract.

## Remaining transitional boundary

Legacy FFXI-derived research/reference data and some historical command-shell aliases remain bounded transitional surfaces. They must not feed canonical world identity or persisted gameplay state merely for compatibility. A future command-adapter cleanup should be its own bounded work order rather than being folded into unrelated simulation/schema work.

## Carried-forward rule

Presentation adapters may make canonical state easier to understand and operate, but they must not become second authorities. Future Phase 0.8 work should extend real fictional time, materials, inventory, projects, relationships, locations, party state, recovery, production, transport, world knowledge, and bounded authored schedules rather than creating isolated management simulations.
