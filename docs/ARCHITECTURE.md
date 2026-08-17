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

- Fictional time, timed tasks, interrupts, work, travel, combat readiness, statuses, recovery, and day review share one canonical simulation substrate.
- Continuous-character stats, learned skills/capabilities, and work proficiency belong to the person; disciplines are contextual training traditions.
- Inventory/equipment/tool state is canonical for preparation and practical capability checks.
- Resources preserve source/transformation provenance and one-time ownership; same-ID stacks with different provenance histories remain distinct.
- Commitments own accepted/resolved/follow-up state and one-time rewards.
- General named-NPC relationship continuity lives in `state.relationships`; companion-specific relationship state remains in party/companion authority.
- Maps, campaign guidance, transport boards, settlement service boards, and player information views are projections of acquired/current state; they do not own simulation state.
- Safe settlements use named locality navigation; terrain-sensitive wilderness/dungeon spaces use discovery-relative spatial exploration.
- Persistent companions remain NPC-backed world participants.
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

Derived scheduled-service board introduced in PX-9. For the character's current real stop it reads canonical route/service data plus wallet/activity/journey state and derives destination, fare, cadence, journey time, next boardable departure, and blockers.

It owns no route, fare deduction, transport task, fictional clock, party movement, or persisted journey state. `transportEngine` remains authoritative.

### `settlementServiceBoardEngine`

`SETTLEMENT_SERVICE_BOARD_VERSION = 1` is the `0.7.200` settlement-economy projection. It derives real workshop, production, merchant, wallet, work-mastery, and recovery choices from existing locality/POI/workstation, production, inventory, shop, activity, and recovery state.

The board stores nothing in game state. Mutation authority remains separated:

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

`PLAYER_INFORMATION_VERSION = 1` is the `0.7.300` semantic information projection.

It derives only information that can be justified from the current character and current/acquired world state:

- accessible unlocked inventory containers and their current items;
- current equipment plus semantic equip/unequip readiness;
- effective skills under the current discipline context;
- character-owned learned capabilities;
- learned spells/techniques and current ability readiness;
- maps actually acquired by the character;
- places represented in the character's visited atlas;
- POIs/contacts actually discovered through play;
- current safe-locality destinations and POI actions;
- deterministic bounded search results over that same set.

It intentionally does **not** enumerate the global map, place, route, POI, resource, or encounter catalogs. Therefore search cannot reveal authored remote topology merely because the record exists in data.

Search query state lives only in `uiState.informationQuery`; it is not written into `state` or the account/game save. `createGameViewModel` recomputes the information model each render.

The active DOM consumes this projection as structured Character, Spellbook, Codex, and World views. Semantic action buttons dispatch existing domain intents such as `equipment.equip`, `equipment.unequip`, `ability.activate`, `locality.move`, and `locality.poi`. The omnibox searches the derived information model by default; a leading `/` explicitly uses the existing command shell as an optional power/diagnostic surface.

`tests/playerInformationAccess.test.js` guards the acquired-knowledge boundary, including an explicit assertion that **Tall Reedbed** is not searchable before discovery.

### Player-language boundary

Model diagnostics may remain implementation-facing internally. Ordinary Journal/service/scene prose must remain character/world-facing. Detailed Journal requirements remain collapsible, Day Review renders memory rather than telemetry, and `tests/playerFacingLanguage.test.js` guards the boundary.

### `activityAdvanceEngine.js`

Provides semantic advance-to-completion for the current canonical activity without a second clock. It composes direct/scheduled travel, gathering/production work, defeated-body recovery, and campaign recovery while domain engines retain completion effects.

## Commitment and relationship architecture

**Data 30 / commitment catalog v2** contains three proving definitions under one generic schema:

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

`commitmentEngine` remains canonical for acceptance/resolution/reward/follow-up. `relationshipEngine` remains canonical for general named-NPC familiarity/respect/trust/obligation. Game State 5 already contains the generic registries.

## Navigation architecture

### Safe locality

`localityEngine.js` derives named settlement transitions from existing connections. The renderer intentionally omits wilderness map/D-pad controls in locality mode.

`0.7.300` improves locality information access without changing this authority: the World view lists currently reachable named districts and current local POIs/services from `playerInformationEngine`, and actions still delegate to `localityEngine`.

### Exploration

Exploration spaces use internal coordinates and `navigationEngine`. `minimapModel` renders discovered/locally knowable geometry only; total authored extent and absolute placement remain private.

### Routes and scheduled transport

`routeCatalog.js`, `travelEngine.js`, and `transportEngine.js` own inter-place travel. Direct and scheduled travel consume fictional time and share task/interrupt laws. PX-9 exposes scheduled service through semantic browser presentation while transport retains fare/cargo/cadence/boarding/departure/arrival and party synchronization.

## Work, production, and settlement economy

`ecologyRegistry` exposes canonical gathering sources/populations. `gatheringWorkEngine` owns timed gathering, tool requirements, source capacity, acquisition provenance, and work proficiency.

`productionCatalog` + `productionEngine` own processing/crafting/cooking/salvage. Inputs are consumed at start; outputs materialize at completion with transformation/input provenance. Workstations come from real POI/locality context.

`inventoryEngine` preserves provenance identity while stacking. Shop sale removes the inventory quantity before adding currency; shop purchase successfully stores the item before deducting currency.

The `0.7.200` proof reuses the Brasshaven/Redstone loop: two raw Redstone Copper Ore can be processed at Selka Aurum's workshop into a Redstone Copper Ingot, improving metalworking and changing the process-vs-sell choice before the player prepares for another outing.

Safe settlement recovery remains a one-hour fictional-time choice with no fabricated fee. Paid recovery/service quality should only be introduced when a real authored service contract exists.

### Defeated-body recovery

Victory progression/economic rewards remain owned by `rewardEngine`. Physical creature material remains a separate `state.resourceOpportunities` path governed by the resource opportunity/recovery systems.

## Combat, party, and recovery architecture

Combat 2.0 uses structured battle-local action history and fictional-time readiness/recovery. Persistent party state is NPC-backed and companions compose with combat/travel/recovery rather than functioning as summons.

`campaignRecoveryEngine` uses canonical timed tasks:

```text
recovery.field       10 minutes   partial missing-resource restoration
recovery.settlement  60 minutes   full active-party safe rest
recovery.defeat      120 minutes  retreat to known safe home + bounded partial restoration
```

## Persistence and version policy

Current compatibility mode: `pre-release-current-schema`.

```text
Product:      0.7.300.1
Package:      0.7.300
Account Save: 4
Game State:   5
Data:         30
Benchmark:    1
Codename:     Semantic Information Access
```

`0.7.300` adds a pure derived information/search projection and transient UI query state. No authored world record or persisted gameplay contract changed, so Account Save 4, Game State 5, Data 30, and Benchmark 1 remain unchanged.

## Validation and performance

Authoritative promoted `0.7.300` runtime checkpoint:

```text
0f6af06ff8571658d51bc2be53112a50d51275cb
490/490 tests
Benchmark 1 success
Data 30
```

Benchmark 1:

```text
1,000 player combat profiles     464.067ms  0.464067ms/op
1,000 enemy combat profiles      114.406ms  0.114406ms/op
1,000 basic attacks              543.591ms  0.543591ms/op
10,000 ticks / 5 subscribers      48.428ms  0.004843ms/op
10,000 direct route lookups     8693.735ms  0.869373ms/op
```

Important Phase 0.7 focused coverage includes:

- `tests/playerFacingLanguage.test.js`
- `tests/playerContinuityFlow.test.js`
- `tests/playerCampaignReadability.test.js`
- `tests/playerDangerRecoveryFlow.test.js`
- `tests/playerCommunityBreadthFlow.test.js`
- `tests/playerThirdCommunityFlow.test.js`
- `tests/playerCrossCommunityRotation.test.js`
- `tests/playerSettlementEconomyFlow.test.js`
- `tests/settlementServiceBoard.test.js`
- `tests/playerInformationAccess.test.js`
- route/transport/party/save-load/version/pipeline/validation gates.

## Known transitional seams after `0.7.300`

- A few explicit utility/combat and wilderness POI actions still use command adapters. Core Character/Spellbook/Codex/World information no longer depends on them.
- Companion tactical/dialogue/equipment/progression breadth remains intentionally small.
- Safe-locality DOM density/hierarchy can still improve without restoring wilderness controls there.
- `gil` remains current currency terminology pending deliberate original-currency design.
- Paid/service-quality recovery remains unauthored; do not invent a parallel rest economy.

The next bounded track is `0.7.400` companion life and party depth: make the existing persistent NPC-backed companion foundation create meaningful ordinary campaign choices beyond one automatic combat contribution, while preserving current party/relationship/travel/recovery authorities.
