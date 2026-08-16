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

The semantic DOM/CSS shell is the active player interface. Canvas modules remain bounded regression/reference code and must not become the normal gameplay authority again.

## Authority rules

- Fictional time, timed tasks, interrupts, work, travel, combat readiness, statuses, recovery, and day review share one canonical simulation substrate.
- Continuous-character stats, learned skills/capabilities, and work proficiency belong to the person; disciplines are contextual training traditions.
- Inventory/equipment/tool state is canonical for preparation and practical capability checks.
- Resources preserve source/transformation provenance and exactly-once ownership; same-ID stacks with different provenance histories remain distinct.
- Commitments own accepted/resolved/follow-up state and exactly-once commitment rewards.
- General named-NPC relationship continuity lives in `state.relationships`; companion-specific relationship state remains part of party/companion authority.
- Maps and campaign guidance represent acquired knowledge; authored coordinates, undiscovered extent, hidden routes, and remote source sites remain internal.
- Safe settlements use named locality navigation; terrain-sensitive wilderness/dungeon spaces use discovery-relative spatial exploration.
- Persistent companions remain NPC-backed world participants.
- Content packs and cross-reference validation remain the scale mechanism for authored world growth.

## Player-experience architecture

Phase 0.7 guidance composes existing authorities rather than creating a tutorial/quest simulation.

### `playerExperienceContent.js` / `playerExperienceEngine.js`

Origin content owns authored first contacts, regional horizons, starter framing, and bounded regional-loop presentation. The engine projects orientation from identity/place/POI discovery and owns the real starter-kit grant behind the first-contact condition.

### `playerOpportunityEngine.js`

Projects the base Journal opportunities from guide discovery, carried/equipped items, locality/routes, active work/travel, gathering requirements, inventory, workstation context, production requirements, and encounter availability.

It does not persist tutorial/quest progress. Internal `reason` fields may remain implementation-facing for diagnostics/tests, but ordinary rendering does not expose them directly.

### `playerContinuityEngine.js`

This is now a generic projection over **actually known commitment definitions**, not an origin-specific branch. A commitment can appear when its giver POI is known or when persistent commitment state already exists.

The projection handles offer/accept, active provenance-qualified material requirements, real field-source gathering, semantic return through existing locality/travel authority, resolution, later-day follow-up, completed history, and memory-style day review. It does not own commitment state, relationships, rewards, work, travel, time, or persistence.

PX-7 proved the generic projection with Mistmere/Soli/Starfen. PX-8 proves the same projection unchanged with Thornwall/Sera/Elderwood.

### `playerDangerRecoveryEngine.js`

Pure aftermath projection over canonical battle/resource/injury state. It creates Journal entries only for actual injuries/defeat or actual local defeated-body resource opportunities. Actions delegate to recovery/resource engines; there is no encounter-campaign registry or auto-loot path.

### `playerCampaignReadabilityEngine.js`

Pure presentation over the composed opportunity model. It derives regional grouping, current-region emphasis, readiness ordering, counts, knowledge-source metadata, and the bounded Copper Trail Clasp cross-region projection.

Knowing an ambition is not knowing every hidden route/resource implementation. Explicit truthful upstream `regionLabel` metadata wins over fallback inference. There is no persisted campaign-readability registry.

### Player-language boundary

- model/engine diagnostics may remain precise and implementation-facing internally;
- player-visible summaries/motivation/progress are written from character/world perspective;
- Journal rendering does not display `entry.reason` as ordinary prose;
- detailed requirements/progress are collapsible;
- Day Review uses structured event authority but renders character memory;
- completed entries recede and actionable recommendations receive emphasis.

`tests/playerFacingLanguage.test.js` guards ordinary Journal/Spellbook/Codex/Craft surfaces against developer jargon.

### `activityAdvanceEngine.js`

Provides semantic advance-to-completion for the current canonical activity without creating a second clock. It composes direct/scheduled travel, gathering/production work, defeated-body recovery, and campaign recovery while domain engines retain ownership of completion effects.

### DOM semantic gameplay intents

`domApp.js` routes direct gameplay intents for locality movement/POI interaction, starter-kit claim, equipment, direct travel, scheduled transport, gathering, production, activity completion, commitments, combat encounter, attack/wait, resource recovery, character/party recovery, abilities, party actions, and other UI authorities.

`transport.start` is already executable at this seam. The remaining Phase 0.7 transport problem is **discovery/presentation of generic scheduled-service choices**, not the transport engine or intent dispatcher.

## Commitment and relationship architecture

### `commitments.js`

**Data 30 / commitment catalog v2** contains three proving definitions while retaining one generic schema:

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

Catalog v2 accepts provenance-aware requirements across transformed/production goods or raw canonical gathered resources. Definitions may name a real `fieldSourceId` and bounded `returnViaPlaceId`; these make work/return legible but do not transfer gathering/travel authority into commitments.

PX-8 does **not** advance the catalog shape beyond v2. Data advances to 30 because a third canonical commitment and persistent Sera NPC seed are new authored content authority.

### `commitmentEngine.js`

`state.commitments` remains canonical runtime authority for acceptance, resolution, exactly-once reward ownership, and later-day follow-up bookkeeping. Delivery is planned before mutation and consumes only provenance-qualified stack quantities.

### `relationshipEngine.js`

`state.relationships` remains canonical general named-NPC relationship authority with familiarity, respect, trust, and obligation dimensions. Companion-specific relationship state remains separate.

### Persistent NPC identity

Marshal Varric Stone, Reader Soli Venn, and Sera Talwin are persistent NPC-backed world contacts. The Journal does not manufacture them as quest records.

### Day review and save/load

Commitment/relationship events participate in the existing day-cycle summary. Follow-up availability derives from canonical fictional day/time. Game State 5 already contains generic commitment/relationship registries, so PX-7/PX-8 require no new persistence schema.

Focused tests exercise the real local-account save/load path across resolution, day transition, later follow-up, and repeated exactly-once handling.

## Navigation architecture

### Safe locality

`localityEngine.js` derives named settlement destination transitions from existing connections. The renderer intentionally omits wilderness map/D-pad controls in locality mode.

### Exploration

Exploration spaces use internal coordinates and `navigationEngine`. `minimapModel` renders discovered/locally knowable geometry only; authored total extent and absolute placement remain private.

### Routes / scheduled transport

`routeCatalog.js`, `travelEngine.js`, and `transportEngine.js` own inter-place travel. Direct and scheduled travel consume fictional time and share task/interrupt laws.

The authored graph already connects the proving communities:

```text
Thornwall Rivergate
  -> Timbercross Landing
  -> Brasshaven Iron Quay
  -> Mistmere Reedport
  -> West Starfen
```

`service-crown-forge-caravan` and `service-forge-mere-caravan` own real fare/cadence/cargo/departure/arrival behavior. PX-5 proves one semantic Forge–Mere booking path when the Copper Trail ambition makes that service knowable and usable.

### Current transport-access seam

The world/engine graph is more complete than the generic browser presentation. `performLocalityPoiAction(..., 'travel')` currently reaches `poiEngine`, whose travel interaction still reports that travel-service behavior is not implemented unless the POI is a route exit. Therefore a generic Travel Desk does not yet enumerate executable scheduled services and destinations.

This is now the concrete blocker for `0.7.100`: ordinary cross-community rotation cannot rely on one campaign-specific readability branch or command/API knowledge. The next bounded repair should derive services from the current real route stop and expose their destination/fare/timing/blockers as semantic `transport.start` actions while keeping `transportEngine` authoritative.

Do not create a second transport registry or UI-owned journey state.

## Work and resource architecture

`ecologyRegistry` exposes canonical gathering sources/populations. `gatheringWorkEngine` owns timed gathering, tool requirements, source capacity, acquisition provenance, and work proficiency.

`productionCatalog` + `productionEngine` own processing/crafting/cooking/salvage. Inputs are consumed at start; outputs materialize at completion with transformation/input provenance. Workstations come from real POI/locality context.

`inventoryEngine` preserves provenance identity while stacking. Commitment delivery therefore cannot lose source history by merging incompatible same-ID stacks.

### Community requests use real world resources

PX-7 reuses Starfen Marrowleaf as a social/economic sink instead of creating a quest token. PX-8 likewise reuses Elderwood Sweetroot, which already has food/medicine/trade sinks.

PX-8 deliberately does **not** use Amber Resin for Sera’s request because Amber Resin is already Thornwall’s ordinary livelihood route. This keeps community work, ordinary livelihood, and Brush Hare danger as independent choices.

### Defeated-body recovery

Victory progression/economic rewards remain owned by `rewardEngine`. Physical creature material remains a separate `state.resourceOpportunities` path governed by `resourceOpportunityEngine` and `resourceRecoveryWorkAdapter`.

## Combat, party, and recovery architecture

Combat 2.0 uses structured battle-local action history and fictional-time readiness/recovery. Persistent party state is NPC-backed and companions compose with combat/travel/recovery rather than functioning as summons.

Victory EXP/currency are exactly-once consequences. Defeat remains battle state until explicit campaign recovery resolves it.

`campaignRecoveryEngine` uses canonical timed tasks:

```text
recovery.field       10 minutes   partial missing-resource restoration
recovery.settlement  60 minutes   full active-party safe rest
recovery.defeat      120 minutes  retreat to known safe home + bounded partial restoration
```

The safe-settlement rest primitive is not a fabricated paid inn/healing economy.

## Persistence and version policy

Current compatibility mode: `pre-release-current-schema`.

```text
Product:      0.6.900.1
Package:      0.6.900
Account Save: 4
Game State:   5
Data:         30
Benchmark:    1
```

Data 30 adds the Sera persistent NPC seed and third canonical commitment definition. Account Save 4 / Game State 5 remain valid because no new persistent registry or structural meaning is introduced. Derived UI/guidance/readability/aftermath state remains recomputed.

## Validation and performance

Authoritative PX-8 runtime checkpoint:

```text
63a234edfc1e327d90823c4171bdf315f01aa044
484/484 tests
Benchmark 1 success
Data 30
```

Benchmark 1:

```text
1,000 player combat profiles     400.261ms  0.400261ms/op
1,000 enemy combat profiles      104.237ms  0.104237ms/op
1,000 basic attacks              509.356ms  0.509356ms/op
10,000 ticks / 5 subscribers      50.139ms  0.005014ms/op
10,000 direct route lookups     7969.682ms  0.796968ms/op
```

Important Phase 0.7 focused coverage includes:

- `tests/playerFacingLanguage.test.js`
- `tests/playerContinuityFlow.test.js`
- `tests/playerCampaignReadability.test.js`
- `tests/playerDangerRecoveryFlow.test.js`
- `tests/playerCommunityBreadthFlow.test.js`
- `tests/playerThirdCommunityFlow.test.js`
- version/pipeline/validation gates.

## Known transitional seams

- **Primary `0.7.100` blocker:** generic Travel Desk/browser presentation does not yet expose the existing scheduled transport graph as semantic service choices.
- Search-or-act still routes commands rather than providing full semantic fuzzy search.
- Some information views still bridge command output.
- Canvas modules remain regression/reference code.
- Legacy-shaped stable POI IDs and several internal field names remain bounded debt.
- `gil` remains current currency terminology pending deliberate original-currency design.
- Safe-settlement rest is executable but not yet a priced/service-quality economy.
- The active Craft browser view still needs a richer dedicated production surface.
- Companion tactical/dialogue/equipment/progression breadth remains intentionally small.
- Safe-locality DOM density/hierarchy still has room to improve; do not restore wilderness exploration controls there.
