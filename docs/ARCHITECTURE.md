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
- Resources preserve source/transformation provenance and exactly-once ownership; same-ID inventory stacks with different provenance histories remain distinct.
- Canonical commitments own accepted/resolved/follow-up gameplay state and exactly-once commitment rewards.
- General named-NPC relationship continuity lives in `state.relationships`; companion-specific relationship state remains part of persistent party/companion authority.
- Maps and campaign guidance represent acquired knowledge; authored coordinates, undiscovered extent, hidden routes, and remote resource sites remain internal.
- Safe settlements use named locality navigation; wilderness/dungeon-style spaces use discovery-relative spatial exploration where terrain matters.
- Persistent companions remain NPC-backed world participants.
- Content packs and cross-reference validation are the scale mechanism for authored world growth.

## Player-experience architecture

Phase 0.7 guidance deliberately composes existing authorities instead of creating a tutorial/quest subsystem.

### `playerExperienceContent.js`

Authored origin-facing presentation contract. It owns stable content such as first contact, regional horizon, first livelihood source, departure locality, and—where authored—the first regional-loop recipe.

Data 27 added the Brasshaven `regionalLoop` shape: target resource/quantity, return locality, workstation POI, production process/output, and larger ambition. Data 28 later added canonical commitment/relationship authored authority. Player-experience data does **not** own progress state.

### `playerExperienceEngine.js`

Projects first-session orientation from canonical player identity, current place, and POI discovery. It also owns the semantic origin starter-kit claim because that is a real item grant tied to a real first-contact condition, not renderer prose.

### `playerOpportunityEngine.js`

Projects the base Journal/Opportunities model from canonical state. Current opportunity stages derive from real guide/POI discovery, carried/equipped items, locality/routes, active travel/work, gathering requirements/source capacity, inventory/provenance, workstation context, production requirements, active battle/encounter availability, and canonical continuity.

The Journal may recommend, rank, or group actions but does not persist duplicate quest/tutorial/social progress.

### `playerContinuityEngine.js`

Composes the player-facing Phase 0.7 projection layers before final readability grouping. The current contract includes canonical several-day commitment continuity plus PX-6 danger/recovery aftermath.

It does not own acceptance, resolution, relationship changes, battle rewards, recovery state, resource opportunities, or fictional time. The first commitment projection is deliberately Brasshaven/copper-specific; generalize only when another real regional/social slice proves the reusable shape.

### `playerDangerRecoveryEngine.js`

PX-6 adds a pure aftermath projection over canonical battle/resource/injury state. It creates Journal entries only when the character actually has current injuries/defeat consequences or an actual local defeated-body resource opportunity.

It does **not** persist an encounter-campaign registry, auto-loot physical creature resources, scan hidden remote sources, or invent recovery state. Its semantic actions delegate to `campaignRecoveryEngine`, `resourceRecoveryWorkAdapter`, and `activityAdvanceEngine`.

Explicit acquired/current-context region metadata is attached to aftermath entries so the existing campaign-readability layer can group a Redstone consequence under Redstone rather than falling back to the origin region.

### `playerCampaignReadabilityEngine.js`

PX-5 is a pure presentation decorator over the composed opportunity/continuity model. It owns no persisted campaign state. It derives regional grouping and current-region emphasis, readiness ordering (`active`, `ready`, `available`, `blocked`, `complete`), per-group counts, knowledge-source metadata, and the bounded Copper Trail Clasp cross-region projection.

The key privacy rule is that **knowing an ambition is not the same as knowing its hidden route/resource implementation**. Varric's later-day follow-up may make Starfen reed fiber a known objective, but the remote Tall Reedbed/source record is not exposed until the character actually reaches West Starfen. Likewise, a distant route action appears only where route/transport authority says it can be used.

PX-6 revised the projection contract to version 2: explicit `regionLabel` metadata supplied by a truthful upstream projection now wins over fallback origin/target inference. This is required for current-context aftermath such as a Redstone defeat.

There is no `state.campaignReadability` or equivalent registry.

### `activityAdvanceEngine.js`

Provides semantic `activity.advanceToCompletion` behavior for ordinary browser play without creating a second clock.

It composes:

- current canonical direct/scheduled travel remaining time through travel/transport authority;
- active gathering/production work through work + timed-task + interrupt authority;
- standalone defeated-body `resource.recovery` work through `resourceRecoveryWorkAdapter`; and
- `recovery.field`, `recovery.settlement`, and `recovery.defeat` tasks through `campaignRecoveryEngine`.

Existing domain engines still own completion effects. `activityAdvanceEngine` owns only the player-facing act of advancing the active canonical activity to its next completion boundary.

### DOM semantic gameplay intents

`domApp.js` routes direct gameplay intents for locality movement/POI interaction, starter-kit claim, equipment, direct travel, scheduled transport, gathering, production, activity completion, commitments, combat encounter, combat attack/wait, resource recovery, character/party recovery, abilities, party actions, and other UI authorities.

PX-6 removes command knowledge from the ordinary basic combat loop: active-battle **Attack** delegates to `performPlayerAttack`; **Wait** delegates to `advanceCombatSimulation`. Defeated-body recovery delegates to `startCharacterResourceRecovery`; bodily/party recovery delegates to `startCampaignRecovery`.

Command routing remains available as a power/diagnostic adapter but is not required for the proven PX-1 through PX-6 campaign flow.

### Journal rendering

The semantic DOM Journal consumes the derived opportunity `groups` model and renders separate regional/continuity sections with readiness counts. Individual cards retain what/why/progress/requirements/blockers/actions, while the section heading owns regional hierarchy.

## Commitment and relationship architecture

### `commitments.js`

Data 28 introduces the first canonical commitment definition catalog. Definitions own authored giver/location/objective/material provenance requirements, reward shape, and follow-up delay/text. They do not own runtime status.

The first proving definition is `commitment-brasshaven-copper-return` / **Copper for the Ring**, offered by persistent NPC Marshal Varric Stone in Brasshaven.

### `commitmentEngine.js`

`state.commitments` is canonical persistent runtime authority for acceptance, resolution, exactly-once reward ownership, and later-day follow-up bookkeeping.

Resolution prechecks and consumption both honor the authored provenance requirement. Delivery is planned before mutation and consumes only qualifying provenance-bearing stack quantities; the semantic resolution event records delivered provenance.

### `relationshipEngine.js`

`state.relationships` is the canonical general named-NPC relationship registry. Current dimensions are familiarity, respect, trust, and obligation. Changes are explicit gameplay state and emit structured `relationship.changed` events.

This is separate from companion-specific relationship state because party companions have additional persistent character/party semantics. Do not duplicate general NPC relationships in Journal/UI state.

### Day review and save/load

Commitment and relationship semantic events participate in the existing day-cycle summary. Follow-up availability derives from canonical fictional day/time rather than a quest-specific clock.

The registries are serialized as part of Game State 5 and are validated as required current-state authority. Focused tests exercise the actual local-account save/load path and exactly-once follow-up behavior, not only JSON cloning.

## Navigation architecture

### Safe locality

`localityEngine.js` derives named destination transitions from existing settlement place connections. The renderer omits exploration map/compass markup in locality mode. POI actions can focus an internal coordinate while exposing only semantic named interaction.

Safe locality is a hazard/presentation policy, not a second time or geography authority.

### Exploration

Exploration spaces use internal coordinates and `navigationEngine` for directional movement. `minimapModel` renders only discovered/locally knowable geometry and dynamically fits known geometry. Authored total extent and absolute coordinate placement remain private.

### Routes / transport

`routeCatalog.js`, `travelEngine.js`, and `transportEngine.js` own inter-place travel. Direct and scheduled travel consume fictional time and participate in the shared task/interrupt/activity laws.

PX-5 proves the distinction between **known destination** and **currently usable transport**. From Brasshaven Iron Quay, the Forge–Mere caravan is visible because the player is at a served stop, but semantic booking is available only when the real fare is affordable. The Varric continuity reward leaves 36 gil against the current 52-gil proving fare, so the Journal surfaces a blocked known route rather than granting free travel.

## Work and resource architecture

`ecologyRegistry` exposes canonical gathering sources/populations. `gatheringWorkEngine` creates timed hands-on work, resolves equipped tool requirements, consumes source capacity at completion, preserves acquisition provenance, and advances character-owned work proficiency.

`productionCatalog` + `productionEngine` own processing/crafting/cooking/salvage records. Inputs are consumed at start, outputs materialize at completion, and output provenance records transformation plus input sources. Workstation context comes from real POI/locality tags through `workstationEngine`, not from a parallel facility database.

`inventoryEngine` preserves provenance identity when stacking: same item IDs may stack only when their provenance structures also match. This prevents later contract, production, or audit logic from losing the history that source/sink rules depend on.

### Defeated-body recovery

`rewardEngine` owns victory progression/economic rewards and may create canonical `state.resourceOpportunities` for a defeated creature. Physical creature material is not an automatic battle drop.

`resourceOpportunityEngine` owns recoverable body condition, available recovery actions, timed task, tool/proficiency requirements, outcome roll, inventory insertion, and acquisition provenance. `resourceRecoveryWorkAdapter` composes those requirements with actual character equipment/work proficiency and exposes the semantic readiness/start seam.

PX-6 proves this with the Redstone Burrower: victory creates one local body opportunity; its canonical action is `extract`; the action requires `fieldTool:cutting`; a Prospector Pick does not satisfy that requirement; a cutting-capable Field Knife does. The recovered `worm-segment` retains defeated-enemy source plus `extract` action provenance, and repeated reconciliation cannot duplicate it.

## Combat, party, and recovery architecture

Combat 2.0 uses structured battle-local action history and fictional-time readiness/recovery. `combatSimulationEngine` composes enemy readiness and ability completion as canonical interrupts. Status expiry uses canonical world time.

Persistent party state is NPC-backed. Active companions participate through Combat 2.0 and synchronize resources/statuses/location back to persistent companion records. PX-6 does not add a campaign-specific combat engine or second encounter clock.

Victory EXP/currency remain exactly-once `rewardEngine` consequences. Defeat remains battle state until explicit campaign recovery resolves it.

### `campaignRecoveryEngine.js`

PX-6 adds the smallest missing ordinary-campaign recovery primitive, implemented entirely through canonical timed tasks rather than a new state registry:

```text
recovery.field       10 fictional minutes   partial missing-resource restoration
recovery.settlement  60 fictional minutes   full active-party rest in safe locality
recovery.defeat      120 fictional minutes  retreat to known safe home + bounded partial restoration
```

`recovery.defeat` moves the active party through existing atlas/party location authorities, resets only bounded combat resources, and marks the persisted recovery task/battle consequence resolved exactly once. It is intentionally not a free full reset.

Recovery emits structured `recovery.started` / `recovery.completed` events and shares the same fictional-time budget as work, travel, commitments, and other activity. The task itself is persisted inside existing Game State 5 timed-task authority, so a recovery in progress survives the real save/load path without a new schema/registry.

The current safe-settlement rest primitive is **not** a fabricated paid inn/healing service. Pricing, quality tiers, or consumable healing require a later executable economy/service slice if the design calls for them.

## Persistence policy

Current mode: `pre-release-current-schema`.

Prefer one clean current model to compatibility-only duplication. Persist only true gameplay authority. Derived UI/guidance/readability/aftermath state should be recomputed when the authoritative source already exists.

Current runtime remains Account Save 4 / Game State 5 / Data 28. PX-6 adds no new persisted registry or authored-data schema: recovery uses existing timed-task/battle fields and aftermath/readability are derived projections. Product/Data/Game State therefore remain unchanged.

## Validation and performance

`npm test` is the main correctness gate. `npm run benchmark` maintains Benchmark 1 comparability. GitHub Actions also exercises build/status reporting and Pages deployment.

Top-level current-state validation includes commitment and relationship registries; world validation includes the canonical commitment catalog. The integrated Phase 0.6 gate remains executable and must stay green as Phase 0.7 grows.

PX-5 focused tests assert acquired-knowledge privacy, grouped/readiness projection stability, competing goals, honest fare blocking, semantic scheduled transport, arrival-gated resource visibility, and cutting-tool enforcement.

PX-6 focused tests assert competing livelihood/danger goals, semantic encounter/Attack/Wait, exactly-once victory rewards/body ownership, real save/load of recovery tasks, tool-gated defeated-body material recovery with provenance, two-hour defeat consequence/retreat, partial rather than free reset, and return to the ordinary Journal campaign.

## Known transitional seams

- Search-or-act still routes commands rather than providing full semantic fuzzy search.
- Some information views still bridge command output.
- Canvas modules remain regression/reference code.
- Legacy-shaped stable POI IDs and several persisted/internal field names remain bounded compatibility debt.
- `gil` remains current currency terminology pending deliberate original-currency design.
- The first commitment continuity projection and Copper Trail cross-region proof remain Brasshaven/copper-specific; prove a second real community slice before generalizing them into universal quest/reputation/campaign abstractions.
- Safe-settlement rest is executable but not yet a priced/service-quality economy; do not fake one in presentation text.
- The active Craft browser view still needs a richer dedicated production surface.
- The active DOM layout still has visible vertical-density/hierarchy debt in safe-locality play; the absence of wilderness map/D-pad controls in safe settlements is intentional.
- `0.7.100` still needs enough repeated multi-region/community breadth and alternative goals to sustain play beyond one deeply proven Brasshaven-centered corridor.
