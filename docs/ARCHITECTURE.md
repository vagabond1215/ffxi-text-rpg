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
- Maps, campaign guidance, transport boards, and settlement service boards represent projections of acquired/current state; they do not own simulation state.
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

`SETTLEMENT_SERVICE_BOARD_VERSION = 1` is the `0.7.200` settlement-economy projection.

For the character's current safe settlement locality it derives:

- authored workshop POIs and their existing workstation tags;
- production definitions that can actually be performed somewhere in that locality;
- current workshop readiness and a semantic route to the required workshop when needed;
- actual inputs, carried quantities, outputs, current proficiency, adjusted work duration, and production blockers;
- conservative current shop-value comparison between required materials and produced output;
- real local merchant providers, current stock, price, affordability, and sellable carried goods;
- safe-settlement recovery status and canonical fictional-time cost;
- direct semantic actions for workshop selection, production start/finish/output claim, merchant selection, buy/sell, and recovery.

The board stores nothing in game state. It does not invent recipes, prices, work, inventory ownership, wallet state, or recovery effects.

Mutation authority remains separated:

```text
productionEngine        -> input consumption, timed work, provenance output, mastery
shopEngine              -> atomic buy/sell and wallet mutation
inventoryEngine         -> storage/stack/provenance ownership
workstationEngine       -> current authored workstation context
campaignRecoveryEngine  -> canonical recovery tasks/effects
localityEngine          -> named settlement movement/POI focus
worldTime/timedTasks    -> fictional time
```

`gameViewModel.js` includes the derived board. The Craft browser surface renders it as **Work, Trade & Recover**, and `domApp.js` dispatches its semantic intents directly to the domain engines rather than manufacturing command strings.

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

### Exploration

Exploration spaces use internal coordinates and `navigationEngine`. `minimapModel` renders discovered/locally knowable geometry only; total authored extent and absolute placement remain private.

### Routes and scheduled transport

`routeCatalog.js`, `travelEngine.js`, and `transportEngine.js` own inter-place travel. Direct and scheduled travel consume fictional time and share task/interrupt laws.

The proving graph connects Thornwall, Brasshaven, and Mistmere. PX-9 exposes its scheduled services through semantic browser presentation while the transport engine retains fare/cargo/cadence/boarding/departure/arrival and party synchronization.

## Work, production, and settlement economy

`ecologyRegistry` exposes canonical gathering sources/populations. `gatheringWorkEngine` owns timed gathering, tool requirements, source capacity, acquisition provenance, and work proficiency.

`productionCatalog` + `productionEngine` own processing/crafting/cooking/salvage. Inputs are consumed at start; outputs materialize at completion with transformation/input provenance. Workstations come from real POI/locality context.

`inventoryEngine` preserves provenance identity while stacking. Shop sale removes the inventory quantity before adding currency; shop purchase successfully stores the item before deducting currency.

### `0.7.200` proving loop

The production/economy proof reuses the existing Brasshaven/Redstone loop:

```text
2 Redstone Copper Ore
  -> Selka Aurum workshop
  -> 300s initial smelt
  -> Redstone Copper Ingot +2 metalworking
  -> next projected smelt 295s
  -> Mae Oris merchant sale
  -> preparation purchase
```

Two raw ore have a conservative typical shop value of 10 gil; the finished ingot has a 14-gil typical shop value. The comparison is presentation only: the shop engine remains the source of the actual current transaction result.

The same derived settlement board is regression-tested against Thornwall tannery, Brasshaven forge, and Mistmere kitchen facilities. No settlement-specific economy branch was introduced.

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
Product:      0.7.200.1
Package:      0.7.200
Account Save: 4
Game State:   5
Data:         30
Benchmark:    1
Codename:     Settlement Economy Depth
```

`0.7.200` adds only derived presentation and structured semantic transaction interfaces over existing state. No authored world record or persisted state contract changed, so Account Save 4, Game State 5, Data 30, and Benchmark 1 remain unchanged.

## Validation and performance

Authoritative promoted `0.7.200` runtime checkpoint:

```text
61c8c6c602bc71a4e7325d04b3e7698f669843c4
487/487 tests
Benchmark 1 success
Data 30
```

Benchmark 1:

```text
1,000 player combat profiles     413.227ms  0.413227ms/op
1,000 enemy combat profiles      102.942ms  0.102942ms/op
1,000 basic attacks              513.096ms  0.513096ms/op
10,000 ticks / 5 subscribers      44.538ms  0.004454ms/op
10,000 direct route lookups     7769.865ms  0.776987ms/op
```

Important Phase 0.7 focused coverage now includes:

- `tests/playerFacingLanguage.test.js`
- `tests/playerContinuityFlow.test.js`
- `tests/playerCampaignReadability.test.js`
- `tests/playerDangerRecoveryFlow.test.js`
- `tests/playerCommunityBreadthFlow.test.js`
- `tests/playerThirdCommunityFlow.test.js`
- `tests/playerCrossCommunityRotation.test.js`
- `tests/playerSettlementEconomyFlow.test.js`
- `tests/settlementServiceBoard.test.js`
- route/transport/party/save-load/version/pipeline/validation gates.

## Known transitional seams after `0.7.200`

- Search-or-act still routes command text rather than operating as a semantic known-information/action surface.
- Several information views still use command-backed buttons for Inventory, Equipment, Skills, Codex, and world inspection.
- Companion tactical/dialogue/equipment/progression breadth remains intentionally small.
- Safe-locality DOM density/hierarchy can improve without restoring wilderness controls there.
- `gil` remains current currency terminology pending deliberate original-currency design.
- Paid/service-quality recovery remains unauthored; do not invent a parallel rest economy.

The next bounded track is `0.7.300` semantic information access and locality usability: replace ordinary command-backed information bridges with derived semantic views/actions and improve safe-locality interaction hierarchy without a full UI rewrite or omniscient search layer.
