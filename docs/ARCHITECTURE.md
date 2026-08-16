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

- Fictional time, timed tasks, interrupts, work, travel, combat readiness, statuses, and day review share one canonical simulation substrate.
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

Data 27 added the Brasshaven `regionalLoop` shape: target resource/quantity, return locality, workstation POI, production process/output, and larger ambition.

This data does **not** own progress state.

### `playerExperienceEngine.js`

Projects first-session orientation from canonical player identity, current place, and POI discovery. It also owns the semantic origin starter-kit claim because that is a real item grant tied to a real first-contact condition, not renderer prose.

### `playerOpportunityEngine.js`

Projects the base Journal/Opportunities model from canonical state. Current opportunity stages derive from real:

- guide/POI discovery;
- carried/equipped items;
- locality graph and routes;
- active travel/work;
- gathering requirements/source capacity;
- inventory quantities and provenance;
- workstation context;
- production requirements;
- active battle/encounter availability;
- canonical commitment/relationship continuity projected through `playerContinuityEngine`.

The Journal may recommend, rank, or group actions but does not persist duplicate quest/tutorial/social progress.

### `playerContinuityEngine.js`

Projects canonical several-day continuity into the Journal. The current proving slice derives from `Copper for the Ring`, Marshal Varric Stone's relationship state, fictional day review, and follow-up readiness.

It does not own acceptance, resolution, relationship changes, reward ownership, or fictional time. The current commitment projection is deliberately Brasshaven/copper-specific; generalize only when another real regional/social slice proves the reusable shape.

### `playerCampaignReadabilityEngine.js`

PX-5 adds a pure presentation decorator over the base opportunity + continuity model. It owns no persisted campaign state. It derives:

- regional grouping and current-region emphasis;
- readiness ordering (`active`, `ready`, `available`, `blocked`, `complete`);
- per-group readiness counts;
- knowledge-source metadata for why an opportunity is currently knowable;
- a bounded Copper Trail Clasp cross-region projection that composes existing commitment, locality, transport, travel, ecology, work, inventory, and production authorities.

The key privacy rule is that **knowing an ambition is not the same as knowing its hidden route/resource implementation**. Varric's later-day follow-up may make Starfen reed fiber a known objective, but the remote Tall Reedbed/source record is not exposed until the character actually reaches West Starfen. Likewise, a distant route action appears only from a place where canonical route/transport authority says it can be used.

This layer is intentionally derived and idempotent after ordinary lazy state normalization. There is no `state.campaignReadability` or equivalent registry.

### `activityAdvanceEngine.js`

Provides semantic `activity.advanceToCompletion` behavior for ordinary browser play.

It does not create a second clock. It composes:

- current canonical direct or scheduled travel remaining time through travel/transport authority; or
- the active work record + timed task through `simulationInterruptEngine`;
- then the existing gathering/production domain reconciliation authority.

This is the browser-facing “finish current activity” seam demonstrated by the regional campaign slices.

### DOM semantic gameplay intents

`domApp.js` routes direct gameplay intents for locality movement/POI interaction, starter-kit claim, equipment, direct travel, scheduled transport, gathering, production, activity completion, commitment acceptance/resolution/follow-up, combat encounter, ability, party, and other UI authorities. `transport.start` delegates directly to `startScheduledTransport`; it does not synthesize a route command or bypass fare/cadence/cargo rules.

Command routing remains available as a power/diagnostic adapter but is not required for the proven PX-1 through PX-5 flows.

### Journal rendering

The semantic DOM Journal consumes the derived opportunity `groups` model and renders separate regional/continuity sections with readiness counts. Individual cards retain what/why/progress/requirements/blockers/actions, while redundant region prefixes are removed at presentation time because the section heading now owns that hierarchy.

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

PX-5 proves the distinction between **known destination** and **currently usable transport**. From Brasshaven Iron Quay, the Forge–Mere caravan is visible because the player is at a served stop, but the semantic booking action is available only when the real fare is affordable. The Varric continuity reward leaves 36 gil against the current 52-gil proving fare, so the Journal truthfully surfaces a blocked known route rather than granting free travel.

## Work and resource architecture

`ecologyRegistry` exposes canonical gathering sources/populations. `gatheringWorkEngine` creates timed hands-on work, resolves equipped tool requirements, consumes source capacity at completion, preserves acquisition provenance, and advances character-owned work proficiency.

`productionCatalog` + `productionEngine` own processing/crafting/cooking/salvage records. Inputs are consumed at start, outputs materialize at completion, and output provenance records transformation plus input sources. Workstation context comes from real POI/locality tags through `workstationEngine`, not from a parallel facility database.

`inventoryEngine` preserves provenance identity when stacking: same item IDs may stack only when their provenance structures also match. This prevents later contract, production, or audit logic from losing the history that source/sink rules depend on.

PX-3 composes the gathering/production authorities into the first ordinary player loop; PX-4 consumes a provenance-qualified output from that loop through canonical commitment resolution; PX-5 makes the resulting cross-region ambition readable without moving any material authority into the Journal.

## Combat and party architecture

Combat 2.0 uses structured battle-local action history and fictional-time readiness/recovery. `combatSimulationEngine` composes enemy readiness and ability completion as canonical interrupts. Status expiry uses canonical world time.

Persistent party state is NPC-backed. Active companions participate through Combat 2.0 and synchronize resources/statuses/location back to persistent companion records.

Meaningful danger/combat/recovery still needs to be composed into the same ordinary Phase 0.7 campaign flow before `0.7.100` can close; this is the next bounded PX integration unit, not permission to create a second combat or recovery authority.

## Persistence policy

Current mode: `pre-release-current-schema`.

Prefer one clean current model to compatibility-only duplication. Persist only true gameplay authority. Derived UI/guidance/readability state should be recomputed when the authoritative source already exists.

Current runtime remains Account Save 4 / Game State 5. Data 28 is an authored-data contract bump from PX-4, not a PX-5 persistence/data bump. Current Game State 5 explicitly owns and validates commitment/relationship registries; PX-5 adds no new persisted registry.

## Validation and performance

`npm test` is the main correctness gate. `npm run benchmark` maintains Benchmark 1 comparability. GitHub Actions also exercises build/status reporting and Pages deployment.

Top-level current-state validation includes commitment and relationship registries; world validation includes the canonical commitment catalog. The integrated Phase 0.6 gate remains executable and must stay green as Phase 0.7 grows.

PX-5 focused tests assert acquired-knowledge privacy, grouped/readiness projection stability, competing goals, honest fare blocking, semantic scheduled transport, arrival-gated resource visibility, and existing cutting-tool enforcement.

## Known transitional seams

- Search-or-act still routes commands rather than providing full semantic fuzzy search.
- Some information views still bridge command output.
- Canvas modules remain regression/reference code.
- Legacy-shaped stable POI IDs and several persisted/internal field names remain bounded compatibility debt.
- `gil` remains current currency terminology pending deliberate original-currency design.
- The first commitment continuity projection and first cross-region readability proof are Brasshaven/copper-specific; do not prematurely generalize them into a universal quest/reputation/campaign database.
- The ordinary campaign slice still needs danger/combat/recovery composition before `0.7.100` can close.
- The active DOM layout still has visible vertical-density/hierarchy debt in safe-locality play; the absence of wilderness map/D-pad controls in safe settlements is intentional and must not be “fixed” by violating locality navigation policy.
