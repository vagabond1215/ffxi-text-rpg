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
- General named-NPC relationship continuity lives in `state.relationships`; companion-specific relationship/tactics state remains in party/companion authority.
- Maps, campaign guidance, transport boards, settlement service boards, and player information views are projections of acquired/current state; they do not own simulation state.
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

The semantic information projection derives only information justified by the current character and current/acquired world state:

- accessible unlocked carried containers/items;
- current equipment plus semantic equip/unequip readiness;
- effective skills under current discipline context;
- character-owned learned capabilities;
- learned spells/techniques and current readiness;
- maps actually acquired;
- places represented in the visited atlas;
- POIs/contacts actually discovered;
- current safe-locality destinations and POI actions;
- deterministic bounded search results over the same set.

It intentionally does **not** enumerate the global map, place, route, POI, resource, or encounter catalogs. Search query state lives only in `uiState.informationQuery`; it is not gameplay/save state.

The active DOM consumes this projection as structured Character, Spellbook, Codex, and World views. Semantic actions dispatch existing domain intents. A leading `/` in the omnibox explicitly uses the command shell as an optional power/diagnostic surface.

### Character-facing information boundary

Ordinary browser presentation follows a character-POV rule: expose what the character **sees, knows, carries, remembers, needs, or can decide**. Development-roadmap language, compatibility details, raw task/state channels, hidden authored topology, and implementation rationale stay outside normal play.

`tests/playerFacingLanguage.test.js` and `tests/playerPointOfViewPresentation.test.js` guard this boundary across the primary browser surfaces and representative encounterable place/POI data.

### `activityAdvanceEngine.js`

Provides semantic advance-to-completion for the current canonical activity without a second clock. It composes direct/scheduled travel, gathering/production work, defeated-body recovery, and campaign recovery while domain engines retain completion effects.

## Commitment and relationship architecture

**Data 31 / commitment catalog v2** retains the three proving definitions under one generic schema:

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

The companion catalog is version 2 and the companion/party database registrations are `0.2.0`.

Mara's two authored field approaches are definitions in `js/text/data/companions.js`. The selected approach is stored in her **existing party tactics record**; no new top-level persistence registry was introduced.

```text
Guard the Road
  -> battle-entry attribute tradeoff favors evasion over attack

Seek the Opening
  -> battle-entry attribute tradeoff favors attack over caution
```

Party authority owns recruitment, active membership, companion location/condition, selected tactics, and synchronization with the backing NPC. Battle creation reads the selected approach and derives temporary battle-entry attributes; it does not mutate Mara's permanent attributes or create companion progression state. Tactic changes are rejected during active battle.

The Character view is presentation over these authorities. It shows Mara's identity, description, location, condition, selected approach, authored voice, and semantic approach/join/leave actions without exposing raw tactic IDs.

`tests/playerCompanionLifeFlow.test.js` proves the approach tradeoff, permanent-stat non-mutation, combat lockout, real save/load persistence, and backing-NPC identity through canonical travel.

`campaignRecoveryEngine` continues to use canonical timed tasks:

```text
recovery.field       10 minutes   partial missing-resource restoration
recovery.settlement  60 minutes   full active-party safe rest
recovery.defeat      120 minutes  retreat to known safe home + bounded partial restoration
```

## Persistence and version policy

Current compatibility mode: `pre-release-current-schema`.

```text
Product:      0.7.400.1
Package:      0.7.400
Account Save: 4
Game State:   5
Data:         31
Benchmark:    1
Codename:     Companion Life and Party Depth
```

Data advanced from 30 to 31 because the canonical companion catalog and player-visible authored place/POI content changed. Account Save 4 and Game State 5 remain unchanged because field approach fits the existing party tactics structure and the POV changes are authored/presentation data rather than a new persisted runtime contract.

Current relevant subsystem registrations:

```text
playerInformation:  0.1.1
gameViewModels:     0.12.0
domUi:              0.10.0
uiIntents:           0.9.0
companionCatalog:   0.2.0
party:              0.2.0
companions:         0.2.0
```

## Validation and performance

Authoritative promoted `0.7.400` runtime checkpoint:

```text
1e217fe1f7e62593fa9ed33eebdf1b3878490336
495/495 tests
0 failed
0 skipped
Benchmark 1 success
Data 31
```

Benchmark 1:

```text
1,000 player combat profiles     470.213ms  0.470213ms/op
1,000 enemy combat profiles      124.768ms  0.124768ms/op
1,000 basic attacks              538.006ms  0.538006ms/op
10,000 ticks / 5 subscribers      50.197ms  0.005020ms/op
10,000 direct route lookups     8612.637ms  0.861264ms/op
```

Important Phase 0.7 focused coverage includes:

- `tests/playerFacingLanguage.test.js`
- `tests/playerPointOfViewPresentation.test.js`
- `tests/playerCompanionLifeFlow.test.js`
- `tests/playerContinuityFlow.test.js`
- `tests/playerCampaignReadability.test.js`
- `tests/playerDangerRecoveryFlow.test.js`
- `tests/playerCommunityBreadthFlow.test.js`
- `tests/playerThirdCommunityFlow.test.js`
- `tests/playerCrossCommunityRotation.test.js`
- `tests/playerSettlementEconomyFlow.test.js`
- `tests/playerInformationAccess.test.js`
- route/transport/party/save-load/version/pipeline/validation gates.

## Phase 0.7 architecture closure

**Phase 0.7 is complete at Product `0.7.400.1`.** The ordinary player path now composes the existing authorities into a sustained multi-region campaign without requiring a duplicate simulation layer or command expertise.

Known later depth is intentionally deferred rather than treated as a reason to reopen Phase 0.7: broader companion dialogue/equipment/progression/goals, richer generic NPC/vendor voice, residual optional command adapters, safe-locality density refinement, original currency terminology, and authored paid/service-quality recovery.

Do not start Phase 0.8 automatically. Its first life/infrastructure track should be selected by a new bounded work order.
