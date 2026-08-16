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
- Resources preserve source/transformation provenance and exactly-once ownership; same-ID stacks with different provenance histories remain distinct.
- Commitments own accepted/resolved/follow-up state and one-time commitment rewards.
- General named-NPC relationship continuity lives in `state.relationships`; companion-specific relationship state remains in party/companion authority.
- Maps and campaign guidance represent acquired knowledge; authored coordinates, undiscovered extent, hidden routes, and remote source sites remain internal.
- Safe settlements use named locality navigation; terrain-sensitive wilderness/dungeon spaces use discovery-relative spatial exploration.
- Persistent companions remain NPC-backed world participants.
- Content packs and cross-reference validation remain the scale mechanism for authored world growth.

## Player-experience architecture

Phase 0.7 guidance composes existing authorities rather than creating a tutorial/quest simulation.

### `playerExperienceContent.js` / `playerExperienceEngine.js`

Origin content owns authored first contacts, regional horizons, starter framing, and bounded regional-loop presentation. The engine projects orientation from identity/place/POI discovery and owns the real starter-kit grant behind the first-contact condition.

### `playerOpportunityEngine.js`

Projects base Journal opportunities from guide discovery, equipment, locality/routes, work/travel, gathering requirements, inventory, workstation context, production requirements, and encounter availability. It does not persist tutorial/quest progress.

### `playerContinuityEngine.js`

Generic projection over actually known commitment definitions. It handles offer/accept presentation, provenance-qualified material requirements, field-source work, semantic return, resolution, later-day follow-up, completed history, and day-review projection while domain engines retain state ownership.

PX-7 proved it with Mistmere/Soli/Starfen; PX-8 proved the same machinery unchanged with Thornwall/Sera/Elderwood.

### `playerDangerRecoveryEngine.js`

Pure aftermath projection over canonical battle/resource/injury state. It creates Journal entries only for actual injuries/defeat or actual defeated-body resource opportunities. Actions delegate to recovery/resource engines.

### `playerCampaignReadabilityEngine.js`

Pure presentation over the composed opportunity model. It derives regional grouping, current-region emphasis, readiness ordering, knowledge-source metadata, and the bounded Copper Trail Clasp cross-region projection. There is no persisted campaign-readability registry.

### `transportServiceBoardEngine.js`

PX-9 adds a **derived scheduled-service board**, not a new transport authority.

For the character's current real service stop it reads the canonical route/service catalog plus current wallet/activity/travel state and derives:

- services that actually serve the current stop;
- reachable served destinations;
- canonical fare, cadence, duration, and next boardable departure;
- current-funds, cargo, active-work, and active-journey blockers;
- player-facing service-board prose.

It owns no route records, fare deduction, transport task, fictional clock, party movement, or persisted journey state. The board is recomputed from canonical state and therefore requires no Game State schema field.

`gameViewModel.js` turns board entries into direct `transport.start` contextual actions. `poiEngine` uses the same board for Travel Desk interaction. `domApp.js` already dispatches `transport.start` to `startScheduledTransport`, so no command-string adapter is required for ordinary booking.

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
  field source: West Starfen Marrowleaf Bed
  return hub: Mistmere Reedport
  reward: 24 gil + familiarity/respect

Sweetroot for Southgate
  giver: Sera Talwin
  material: 2 provenance-qualified Elderwood Sweetroot
  field source: West Elderwood Sweetroot Patch
  reward: 20 gil + familiarity/respect
```

`commitmentEngine` remains canonical for acceptance/resolution/reward/follow-up. `relationshipEngine` remains canonical for general named-NPC familiarity/respect/trust/obligation. Marshal Varric Stone, Reader Soli Venn, and Sera Talwin are persistent NPC-backed world contacts rather than Journal-manufactured quest identities.

Game State 5 already contains the generic commitment/relationship registries, so PX-7/PX-8 required no persistence schema bump.

## Navigation architecture

### Safe locality

`localityEngine.js` derives named settlement transitions from existing connections. The renderer intentionally omits wilderness map/D-pad controls in locality mode.

### Exploration

Exploration spaces use internal coordinates and `navigationEngine`. `minimapModel` renders discovered/locally knowable geometry only; total authored extent and absolute placement remain private.

### Routes and scheduled transport

`routeCatalog.js`, `travelEngine.js`, and `transportEngine.js` own inter-place travel. Direct and scheduled travel consume fictional time and share task/interrupt laws.

The proving graph is connected:

```text
Thornwall Rivergate
  -> Timbercross Landing
  -> Brasshaven Iron Quay
  -> Mistmere Reedport
  -> West Starfen
```

PX-9 closes the former browser-access seam. Generic service-board/context UI now exposes only real scheduled destinations available from the current service stop and dispatches existing `transport.start`. The transport engine still owns fare/cargo/cadence/boarding/departure/arrival and party synchronization.

The PX-9 end-to-end regression verifies the 60-gil Rivergate -> Brasshaven Crown-Forge fare, the 52-gil Brasshaven -> Mistmere Forge-Mere fare, save/load during scheduled travel, correct return services, one fare deduction per booking, and no remote resource-topology leak.

Do not create a second route catalog, UI-owned journey state, or campaign-specific transport state machine.

## Work and resource architecture

`ecologyRegistry` exposes canonical gathering sources/populations. `gatheringWorkEngine` owns timed gathering, tool requirements, source capacity, acquisition provenance, and work proficiency.

`productionCatalog` + `productionEngine` own processing/crafting/cooking/salvage. Inputs are consumed at start; outputs materialize at completion with transformation/input provenance. Workstations come from real POI/locality context.

`inventoryEngine` preserves provenance identity while stacking. Community requests therefore consume only qualifying source-bearing stacks.

PX-7 reuses Starfen Marrowleaf and PX-8 reuses Elderwood Sweetroot as social/economic sinks instead of quest-token materials. Sweetroot was chosen instead of Amber Resin so Thornwall's ordinary resin livelihood remains an independent ambition.

### Defeated-body recovery

Victory progression/economic rewards remain owned by `rewardEngine`. Physical creature material remains a separate `state.resourceOpportunities` path governed by `resourceOpportunityEngine` and `resourceRecoveryWorkAdapter`.

## Combat, party, and recovery architecture

Combat 2.0 uses structured battle-local action history and fictional-time readiness/recovery. Persistent party state is NPC-backed and companions compose with combat/travel/recovery rather than functioning as summons.

Victory EXP/currency are one-time consequences. Defeat remains battle state until explicit campaign recovery resolves it.

`campaignRecoveryEngine` uses canonical timed tasks:

```text
recovery.field       10 minutes   partial missing-resource restoration
recovery.settlement  60 minutes   full active-party safe rest
recovery.defeat      120 minutes  retreat to known safe home + bounded partial restoration
```

The safe-settlement rest primitive is not yet a priced/service-quality economy; that is a candidate for later Phase 0.7 service/economic depth.

## Persistence and version policy

Current compatibility mode: `pre-release-current-schema`.

```text
Product:      0.7.100.1
Package:      0.7.100
Account Save: 4
Game State:   5
Data:         30
Benchmark:    1
Codename:     Playable Campaign Slice
```

PX-9 changes no authored data or persisted state contract. The service board is derived from Data 30 route/service content and Game State 5 wallet/activity/travel state. Account Save 4, Game State 5, Data 30, and Benchmark 1 therefore remain unchanged.

## Validation and performance

Authoritative promoted `0.7.100` runtime checkpoint:

```text
d15bd9517803faf6bceae5fb3376193648cca09d
485/485 tests
Benchmark 1 success
Data 30
```

Benchmark 1:

```text
1,000 player combat profiles     439.616ms  0.439616ms/op
1,000 enemy combat profiles      116.070ms  0.116070ms/op
1,000 basic attacks              504.204ms  0.504204ms/op
10,000 ticks / 5 subscribers      48.633ms  0.004863ms/op
10,000 direct route lookups     8064.154ms  0.806415ms/op
```

Important Phase 0.7 focused coverage includes:

- `tests/playerFacingLanguage.test.js`
- `tests/playerContinuityFlow.test.js`
- `tests/playerCampaignReadability.test.js`
- `tests/playerDangerRecoveryFlow.test.js`
- `tests/playerCommunityBreadthFlow.test.js`
- `tests/playerThirdCommunityFlow.test.js`
- `tests/playerCrossCommunityRotation.test.js`
- route/transport/party/save-load/version/pipeline/validation gates.

## Known transitional seams after `0.7.100`

The playable campaign slice is closed, but Phase 0.7 remains in progress. Remaining depth work includes:

- Search-or-act still routes commands rather than providing full semantic fuzzy search.
- Some information views still bridge command output.
- Legacy-shaped stable POI IDs and several internal field names remain bounded debt.
- `gil` remains current currency terminology pending deliberate original-currency design.
- Safe-settlement rest is executable but not yet a priced/service-quality economy.
- The active Craft browser view is compact rather than a rich production-choice surface.
- Companion tactical/dialogue/equipment/progression breadth remains intentionally small.
- Safe-locality DOM density/hierarchy can improve without restoring wilderness controls there.

The next bounded track is `0.7.200` settlement service and economy depth: deepen repeated return-to-settlement decisions using existing wallet, shop, production, recovery, workstation, and fictional-time authorities before broad content expansion.
