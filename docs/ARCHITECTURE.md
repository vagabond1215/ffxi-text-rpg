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

It does not persist tutorial/quest progress. Internal `reason` fields may describe design/diagnostic rationale for tests and inspection, but ordinary rendering does **not** expose them directly.

### `playerContinuityEngine.js`

After PX-7 this is a generic projection over **actually known commitment definitions**, not a Varric-specific branch. A commitment can appear when its giver POI is known or when persistent commitment state already exists.

The projection handles:

- offer/accept presentation;
- active provenance-qualified material requirements;
- field-source gathering actions when the commitment names a real canonical gathering source;
- semantic return through existing locality/travel authority, including an authored bounded return hub where needed;
- delivery/resolution;
- later-day follow-up;
- completed remembered history;
- memory-style day review.

It still does not own commitment acceptance/resolution, relationship changes, rewards, work, travel, fictional time, or save/load.

### `playerDangerRecoveryEngine.js`

A pure aftermath projection over canonical battle/resource/injury state. It creates Journal entries only for actual injuries/defeat or actual local defeated-body resource opportunities. Actions delegate to recovery/resource engines; there is no encounter-campaign registry or auto-loot path.

### `playerCampaignReadabilityEngine.js`

Pure presentation over the composed opportunity model. It derives regional grouping, current-region emphasis, readiness ordering, counts, knowledge-source metadata, and the bounded Copper Trail Clasp cross-region projection.

Knowing an ambition is not knowing every hidden route/resource implementation. Explicit truthful upstream `regionLabel` metadata wins over fallback inference.

There is no persisted `state.campaignReadability` registry.

### Player-language boundary

The PX-7 pre-pass formalized a presentation boundary that had previously been implicit:

- model/engine diagnostic rationale may remain precise and implementation-facing internally;
- player-visible summaries/motivation/progress must be written from character/world perspective;
- the Journal renderer does not render `entry.reason` as ordinary prose;
- detailed requirements/progress are available in a collapsible **Details** disclosure;
- Day Review is generated from structured semantic history but rendered as character memory;
- completed entries visually recede and suggested actionable entries receive emphasis.

`tests/playerFacingLanguage.test.js` guards ordinary Journal/Spellbook/Codex/Craft surfaces against developer jargon.

### `activityAdvanceEngine.js`

Provides semantic advance-to-completion for the currently active canonical activity without creating a second clock. It composes direct/scheduled travel, gathering/production work, defeated-body recovery, and campaign recovery while domain engines retain ownership of completion effects.

### DOM semantic gameplay intents

`domApp.js` routes direct gameplay intents for locality movement/POI interaction, starter-kit claim, equipment, direct travel, scheduled transport, gathering, production, activity completion, commitments, combat encounter, attack/wait, resource recovery, character/party recovery, abilities, party actions, and other UI authorities.

Commands remain available as power/diagnostic adapters but are not required for the proven PX-1 through PX-7 flows.

## Commitment and relationship architecture

### `commitments.js`

**Data 29 / commitment catalog v2** supports provenance-aware requirements across either:

- transformed/production goods such as the Redstone Copper Ingot; or
- raw canonical gathered resources such as Starfen Marrowleaf.

Definitions may also name a real `fieldSourceId` and a bounded `returnViaPlaceId`. Those fields make the requested work/return leg legible; they do **not** transfer gathering or travel authority into the commitment system.

Current proving definitions:

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
```

Catalog validation accepts either canonical raw-resource items or canonical production items and verifies provenance/source cross-references.

### `commitmentEngine.js`

`state.commitments` remains canonical runtime authority for acceptance, resolution, exactly-once reward ownership, and later-day follow-up bookkeeping.

Resolution plans delivery before mutation and consumes only qualifying provenance-bearing stack quantities. Semantic resolution events record delivered provenance.

### `relationshipEngine.js`

`state.relationships` remains the canonical general named-NPC relationship registry with familiarity, respect, trust, and obligation dimensions. Companion-specific relationship state remains separate because companions carry additional party/character semantics.

### Persistent NPC identity

Marshal Varric Stone and Reader Soli Venn are both NPC-backed persistent world contacts. The Journal does not manufacture them as quest records. PX-7 specifically proves that the same relationship/commitment machinery works for two different communities and two different material shapes.

### Day review and save/load

Commitment/relationship events participate in the existing day-cycle summary. Follow-up availability derives from canonical fictional day/time. Game State 5 already contains generic commitment/relationship registries, so the second community requires no new persistence schema.

Focused tests exercise the real local-account save/load path across resolution, day transition, later follow-up, and repeated exactly-once handling.

## Navigation architecture

### Safe locality

`localityEngine.js` derives named destination transitions from existing settlement connections. The renderer omits wilderness map/D-pad controls in locality mode intentionally.

### Exploration

Exploration spaces use internal coordinates and `navigationEngine`. `minimapModel` renders discovered/locally knowable geometry only; authored total extent and absolute placement remain private.

### Routes / transport

`routeCatalog.js`, `travelEngine.js`, and `transportEngine.js` own inter-place travel. Direct and scheduled travel consume fictional time and share task/interrupt laws.

PX-5 proves known destination vs currently usable transport. PX-7 adds no new travel graph: Soli’s field request uses existing Canal Ward -> Reedport locality movement, Reedport -> West Starfen travel, and the same path back.

## Work and resource architecture

`ecologyRegistry` exposes canonical gathering sources/populations. `gatheringWorkEngine` owns timed gathering, tool requirements, source capacity, acquisition provenance, and work proficiency.

`productionCatalog` + `productionEngine` own processing/crafting/cooking/salvage. Inputs are consumed at start; outputs materialize at completion with transformation/input provenance. Workstations come from real POI/locality context.

`inventoryEngine` preserves provenance identity while stacking. Commitment delivery therefore cannot lose source history by merging incompatible same-ID stacks.

### Raw gathered commitment requirements

PX-7 deliberately reuses `item-starfen-marrowleaf` as a social/economic sink instead of manufacturing a quest-token item. `commitmentEngine` still owns delivery; `gatheringWorkEngine` still owns acquisition; the required provenance connects the two.

### Defeated-body recovery

Victory progression/economic rewards remain owned by `rewardEngine`. Physical creature material remains a separate `state.resourceOpportunities` path governed by `resourceOpportunityEngine` and `resourceRecoveryWorkAdapter`.

PX-6 proves the Redstone Burrower `extract` path and cutting-tool requirement. PX-7 leaves this authority unchanged while adding Starfen Rootling danger as a competing ordinary regional choice.

## Combat, party, and recovery architecture

Combat 2.0 uses structured battle-local action history and fictional-time readiness/recovery. Persistent party state is NPC-backed and companions compose with combat/travel/recovery rather than functioning as summons.

Victory EXP/currency are exactly-once consequences. Defeat remains battle state until explicit campaign recovery resolves it.

`campaignRecoveryEngine` uses canonical timed tasks:

```text
recovery.field       10 minutes   partial missing-resource restoration
recovery.settlement  60 minutes   full active-party safe rest
recovery.defeat      120 minutes  retreat to known safe home + bounded partial restoration
```

The safe-settlement rest primitive is not a fabricated paid inn/healing economy. Pricing/service quality requires executable economy content if added later.

## Persistence and version policy

Current compatibility mode: `pre-release-current-schema`.

Current runtime:

```text
Product:      0.6.900.1
Package:      0.6.900
Account Save: 4
Game State:   5
Data:         29
Benchmark:    1
```

Data 29 is required because PX-7 adds a second canonical commitment, a persistent Soli NPC seed, and the commitment-v2 raw-resource/source/return authored contract. Account Save 4 / Game State 5 remain valid because no new persistent registry or structural meaning is introduced.

Derived UI/guidance/readability/aftermath state remains recomputed.

## Validation and performance

Authoritative PX-7 runtime checkpoint:

```text
0411083b07bc4063fe4810fcb225e1dffd2895a4
483/483 tests
Benchmark 1 success
Data 29
```

Benchmark 1 at that checkpoint:

```text
1,000 player combat profiles     468.655ms  0.468655ms/op
1,000 enemy combat profiles      110.203ms  0.110203ms/op
1,000 basic attacks              553.072ms  0.553072ms/op
10,000 ticks / 5 subscribers      48.620ms  0.004862ms/op
10,000 direct route lookups     8767.498ms  0.876750ms/op
```

Important Phase 0.7 focused coverage now includes:

- `tests/playerFacingLanguage.test.js`
- `tests/playerContinuityFlow.test.js`
- `tests/playerCampaignReadability.test.js`
- `tests/playerDangerRecoveryFlow.test.js`
- `tests/playerCommunityBreadthFlow.test.js`
- version/pipeline/validation gates.

## Known transitional seams

- Search-or-act still routes commands rather than providing full semantic fuzzy search.
- Some information views still bridge command output.
- Canvas modules remain regression/reference code.
- Legacy-shaped stable POI IDs and several internal field names remain bounded debt.
- `gil` remains current currency terminology pending deliberate original-currency design.
- Safe-settlement rest is executable but not yet a priced/service-quality economy.
- The active Craft browser view still needs a richer dedicated production surface.
- Companion tactical/dialogue/equipment/progression breadth remains intentionally small.
- Safe-locality DOM density/hierarchy still has room to improve; do not restore wilderness exploration controls there.
- Two persistent community proofs now exist (Brasshaven/Varric and Mistmere/Soli), but Thornwall/Elderwood still lacks equivalent several-day continuity and the overall campaign still needs more repeated alternatives before `0.7.100` can close.
