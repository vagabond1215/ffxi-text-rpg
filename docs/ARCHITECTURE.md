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
```

The semantic DOM/CSS shell is the active player interface. Canvas modules remain bounded regression/reference code and must not become normal gameplay authority again.

## Authority rules

- Fictional time, timed tasks, interrupts, work, projects, travel, combat readiness, statuses, recovery, and day review share one canonical simulation substrate.
- Continuous-character stats, learned skills/capabilities, and work proficiency belong to the person; disciplines are contextual training traditions.
- Inventory/equipment/tool state is canonical for preparation and practical capability checks.
- Resources preserve source/transformation provenance and one-time ownership; same-ID stacks with different provenance histories remain distinct.
- Projects own persistent material/labor progress; specialized systems may attach bounded project metadata and apply domain-specific completion effects.
- Home/infrastructure does not own a second item store, construction clock, or storage-capacity formula. It composes projects, timed tasks, canonical materials, inventory, and furnishings.
- Commitments own accepted/resolved/follow-up state and one-time rewards.
- General named-NPC relationship continuity lives in `state.relationships`; companion-specific relationship/tactics state remains in party/companion authority.
- Maps, campaign guidance, transport boards, settlement service boards, player information, and home opportunity models are projections of acquired/current state; they do not own simulation state.
- Safe settlements use named locality navigation; terrain-sensitive wilderness/dungeon spaces use discovery-relative spatial exploration.
- Persistent companions remain NPC-backed world participants rather than summons.
- Content packs and cross-reference validation remain the scale mechanism for authored world growth.

## Player-experience projections

### `playerExperienceEngine` / `playerOpportunityEngine`

Origin content owns authored first contacts and opening framing. Opportunity projection reads real equipment, locality/routes, work/travel, gathering, inventory, workstation, production, encounter, and service state. It does not persist tutorial progress.

### `playerContinuityEngine`

Generic projection over actually known commitment definitions. Commitment, relationship, gathering, travel, day, and persistence systems retain state ownership.

### `playerDangerRecoveryEngine`

Pure aftermath projection over canonical battle/resource/injury state. It surfaces real injury/defeat or actual defeated-body opportunities and delegates actions to recovery/resource engines.

### `playerCampaignReadabilityEngine`

Pure regional/readiness grouping of acquired campaign knowledge. It may summarize known ambitions without exposing hidden authored topology.

### `transportServiceBoardEngine`

For the character's current real stop it reads canonical route/service data plus wallet/activity/journey state and derives destination, fare, cadence, journey time, next boardable departure, and blockers. It owns no route, fare deduction, transport task, fictional clock, party movement, or persisted journey state. `transportEngine` remains authoritative.

### `settlementServiceBoardEngine`

Derives real workshop, production, merchant, wallet, work-mastery, and recovery choices from existing locality/POI/workstation, production, inventory, shop, activity, and recovery state.

```text
productionEngine        -> input consumption, timed work, provenance output, mastery
shopEngine              -> atomic buy/sell and wallet mutation
inventoryEngine         -> storage/stack/provenance ownership
workstationEngine       -> current authored workstation context
campaignRecoveryEngine  -> canonical recovery tasks/effects
localityEngine          -> named settlement movement/POI focus
worldTime/timedTasks    -> fictional time
```

The Craft browser surface renders the derived board as **Work, Trade & Recover** and dispatches semantic intents directly to the domain engines.

### `playerInformationEngine`

The semantic information projection derives only information justified by the current character and current/acquired world state: accessible carried items, equipment, effective skills, learned capabilities/abilities, acquired maps, visited places, discovered POIs/contacts, current locality destinations/actions, and deterministic bounded search over the same set.

It intentionally does **not** enumerate the global map, place, route, POI, resource, or encounter catalogs. Search query state lives only in `uiState.informationQuery`; it is not gameplay/save state. A leading `/` explicitly opts into the command shell as a power/diagnostic surface.

### Character-facing information boundary

Ordinary browser presentation follows a character-POV rule: expose what the character **sees, knows, carries, remembers, needs, or can decide**. Development-roadmap language, compatibility details, raw task/state channels, hidden authored topology, and implementation rationale stay outside normal play.

`tests/playerFacingLanguage.test.js` and `tests/playerPointOfViewPresentation.test.js` guard this boundary across the primary browser surfaces and representative encounterable place/POI data. `tests/playerHomeInfrastructureFlow.test.js` extends the same rule to the Home & Foothold Journal projection.

### `activityAdvanceEngine.js`

Provides semantic advance-to-completion for the current canonical activity without a second clock. It composes direct/scheduled travel, gathering/production work, defeated-body recovery, campaign recovery, and generic `project.labor`.

For project labor, generic project reconciliation remains in `projectEngine`. When the project carries a recognized home-infrastructure definition, the home adapter applies the domain completion effect after generic project completion. Unrelated project kinds remain generic and are not claimed by the home system.

## Home, project, and infrastructure architecture (`0.8.100`)

### Existing project authority

`projectEngine.js` remains the persistent construction/work substrate. A project owns:

- stable project ID, kind, label, and status;
- required/contributed material quantities;
- labor duration and linked `project.labor` timed task;
- creation/start/completion world timestamps;
- arbitrary bounded domain `data` for systems that compose with the generic project contract.

Material contribution removes canonical inventory quantity atomically through `inventoryEngine`; labor starts through the shared timed-task substrate; `reconcileProjects` owns generic completion.

### `homeInfrastructure.js` authored data

Data 32 adds the first canonical home-improvement definition:

```text
Build a Storage Chest
  materials: 2 Resin-Sealed Hardwood Boards
             1 Redstone Copper Ingot
  labor:     30 minutes
  benefit:   existing Storage Chest furnishing (+5 storage slots)
```

The boards and ingot already belong to the canonical Elderwood/Redstone production economy. The improvement therefore creates a durable sink for real regional goods rather than a building-specific currency.

### `homeInfrastructureEngine.js`

`HOME_INFRASTRUCTURE_VERSION = 1` is a bounded adapter, not a second property simulation.

It:

- resolves the character's current home from existing unlocked home points;
- begins a generic project with home-improvement metadata;
- delegates material contribution to `contributeProjectMaterial`;
- delegates labor start to `startProjectLabor`;
- reconciles generic project completion;
- applies the authored furnishing exactly once;
- emits `home.infrastructure-completed` as a semantic event;
- derives the player-facing **Home & Foothold** Journal entry and its current semantic action;
- validates home-project references against the authored improvement catalog.

It does **not** own:

- a new property registry;
- a construction-specific clock/task queue;
- a separate inventory or construction-material wallet;
- storage-capacity math;
- a duplicate world location/home registry;
- a UI persistence model.

### Furnishing/storage authority

`mogHouseFurniture.js` is still a bounded internal legacy-named module, while player-facing copy uses lodging/home/furnishing terminology. `calculateFurnitureStorageCapacity` remains the actual furnishing capacity calculation consumed by inventory storage.

A fresh character's Bronze Bed + Maple Table provide 3 furnishing-storage slots. Completing the first improvement places the existing `storage-chest` furnishing once, adding 5 and producing an 8-slot total. The completed furnishing remains ordinary persisted inventory/home state, so the benefit naturally survives save/load.

### Journal/UI integration

`gameViewModel` decorates the existing opportunity model with a `Home & Foothold` group. The active flow is:

```text
Plan
  -> Set aside canonical materials
  -> Start 30m project labor
  -> Finish current activity
  -> completed furnishing benefit
```

`uiIntentDispatcher` handles semantic `home.infrastructure.begin`, `.contribute`, and `.start` intents. The final Finish action delegates the existing activity advance path. The renderer remains generic; no home-specific management screen or renderer state was added.

## Commitment and relationship architecture

Data 31 commitment catalog v2 retains the three proving definitions under one generic schema:

```text
Copper for the Ring
  giver: Marshal Varric Stone
  material: provenance-qualified Redstone Copper Ingot
  reward: 36 gil + familiarity/respect

Marrowleaf for the Ward
  giver: Reader Soli Venn
  material: 2 provenance-qualified Starfen Marrowleaf
  reward: 24 gil + familiarity/respect

Sweetroot for Southgate
  giver: Sera Talwin
  material: 2 provenance-qualified Elderwood Sweetroot
  reward: 20 gil + familiarity/respect
```

`commitmentEngine` remains canonical for acceptance/resolution/reward/follow-up. `relationshipEngine` remains canonical for general named-NPC familiarity/respect/trust/obligation. Game State 5 contains the generic registries.

## Navigation architecture

### Safe locality

`localityEngine.js` derives named settlement transitions from existing connections. The renderer intentionally omits wilderness map/D-pad controls in locality mode. World/local information surfaces list currently reachable named districts and current local POIs/services while actions still delegate to locality authority.

### Exploration

Exploration spaces use internal coordinates and `navigationEngine`. `minimapModel` renders discovered/locally knowable geometry only; total authored extent and absolute placement remain private.

### Routes and scheduled transport

`routeCatalog.js`, `travelEngine.js`, and `transportEngine.js` own inter-place travel. Direct and scheduled travel consume fictional time and share task/interrupt laws. The semantic transport board exposes bookable known/current service choices while transport retains fare/cargo/cadence/boarding/departure/arrival and party synchronization.

## Work, production, and settlement economy

`ecologyRegistry` exposes canonical gathering sources/populations. `gatheringWorkEngine` owns timed gathering, tool requirements, source capacity, acquisition provenance, and work proficiency.

`productionCatalog` + `productionEngine` own processing/crafting/cooking/salvage. Inputs are consumed at start; outputs materialize at completion with transformation/input provenance. Workstations come from real POI/locality context.

`inventoryEngine` preserves provenance identity while stacking. Shop sale removes inventory quantity before adding currency; shop purchase successfully stores the item before deducting currency.

Safe settlement recovery remains a one-hour fictional-time choice with no fabricated fee. Paid recovery/service quality should be introduced only when a real authored service contract exists.

### Defeated-body recovery

Victory progression/economic rewards remain owned by `rewardEngine`. Physical creature material remains a separate `state.resourceOpportunities` path governed by resource opportunity/recovery systems.

## Combat, party, companion, and recovery architecture

Combat 2.0 uses structured battle-local action history and fictional-time readiness/recovery. Persistent party state is NPC-backed and companions compose with combat/travel/recovery rather than functioning as summons.

### Mara Venn field preparation (`0.7.400`)

Mara's two authored field approaches live in `js/text/data/companions.js`; the selected approach is stored in her existing party tactics record. Party authority owns recruitment, active membership, companion location/condition, selected tactics, and synchronization with the backing NPC. Battle creation reads the choice and derives temporary battle-entry attributes without mutating permanent attributes or creating a second companion progression authority.

`tests/playerCompanionLifeFlow.test.js` proves the approach tradeoff, permanent-stat non-mutation, combat lockout, real save/load persistence, and backing-NPC identity through travel.

`campaignRecoveryEngine` continues to use canonical timed tasks:

```text
recovery.field       10 minutes   partial missing-resource restoration
recovery.settlement  60 minutes   full active-party safe rest
recovery.defeat      120 minutes  retreat to known safe home + bounded partial restoration
```

## Persistence and version policy

Current compatibility mode: `pre-release-current-schema`.

```text
Product:      0.8.100.1
Package:      0.8.100
Account Save: 4
Game State:   5
Data:         32
Benchmark:    1
Codename:     Home Foothold and Infrastructure
```

Data advances from 31 to 32 because the canonical home-infrastructure definition and its material-to-durable-benefit contract are authored data. Account Save 4 and Game State 5 remain unchanged because the track reuses existing project metadata, timed tasks, placed furnishings, and inventory state.

Current relevant subsystem registrations:

```text
projects:             0.1.0
homeInfrastructure:   0.1.0
homeStorage:          0.3.9
characterActivity:    0.3.0
activityAdvance:      0.3.0
gameViewModels:       0.13.0
uiIntents:            0.10.0
validation:           0.10.0
playerInformation:    0.1.1
domUi:                0.10.0
companionCatalog:     0.2.0
party:                0.2.0
companions:           0.2.0
```

## Validation and performance

World-data validation now checks the home-infrastructure catalog. Game-state validation first checks generic projects and then validates recognized home-project metadata/benefit consistency. Existing equipment-effect validation remains intact, including effects, latent effects, enchantments, augments, charges, requirements, modifiers, and metadata.

Authoritative promoted `0.8.100` runtime checkpoint:

```text
0b9251a43285443087050127da36b977cabdf7ee
496/496 tests
0 failed
0 skipped
Benchmark 1 success
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

Important current focused coverage includes:

- `tests/playerHomeInfrastructureFlow.test.js`
- `tests/projectEngine.test.js`
- `tests/playerFacingLanguage.test.js`
- `tests/playerPointOfViewPresentation.test.js`
- `tests/playerCompanionLifeFlow.test.js`
- `tests/playerContinuityFlow.test.js`
- `tests/playerCampaignReadability.test.js`
- `tests/playerDangerRecoveryFlow.test.js`
- `tests/playerCrossCommunityRotation.test.js`
- `tests/playerSettlementEconomyFlow.test.js`
- `tests/playerInformationAccess.test.js`
- route/transport/party/save-load/version/pipeline/validation gates.

## Current architecture boundary

**Phase 0.7 remains complete. Phase 0.8 is in progress; `0.8.100` is complete at Product `0.8.100.1`.**

The home track proves one life/infrastructure loop without duplicating simulation authority. Do not extrapolate this into a second property engine, a building currency, a home-only inventory, or automatic mass-authoring. The next Phase 0.8 work order should choose one bounded seam and audit existing authorities before implementation.
