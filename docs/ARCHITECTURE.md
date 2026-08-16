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
- Resources preserve source/transformation provenance and exactly-once ownership.
- Maps represent acquired knowledge; authored coordinates and undiscovered extent remain internal.
- Safe settlements use named locality navigation; wilderness/dungeon-style spaces use discovery-relative spatial exploration where terrain matters.
- Persistent companions remain NPC-backed world participants.
- Content packs and cross-reference validation are the scale mechanism for authored world growth.

## Player-experience architecture

Phase 0.7 guidance deliberately composes existing authorities instead of creating a tutorial/quest subsystem.

### `playerExperienceContent.js`

Authored origin-facing presentation contract. It owns stable content such as first contact, regional horizon, first livelihood source, departure locality, and—where authored—the first regional-loop recipe.

Data 27 adds the Brasshaven `regionalLoop` shape: target resource/quantity, return locality, workstation POI, production process/output, and larger ambition.

This data does **not** own progress state.

### `playerExperienceEngine.js`

Projects first-session orientation from canonical player identity, current place, and POI discovery. It also owns the semantic origin starter-kit claim because that is a real item grant tied to a real first-contact condition, not renderer prose.

### `playerOpportunityEngine.js`

Projects the Journal/Opportunities model from canonical state. Current opportunity stages derive from real:

- guide/POI discovery;
- carried/equipped items;
- locality graph and routes;
- active travel/work;
- gathering requirements/source capacity;
- inventory quantities;
- workstation context;
- production requirements;
- active battle/encounter availability.

The Journal may recommend actions but does not persist duplicate quest/tutorial progress.

### `activityAdvanceEngine.js`

Provides semantic `activity.advanceToCompletion` behavior for ordinary browser play.

It does not create a second clock. It composes:

- current canonical travel remaining time through `travelEngine`; or
- the active work record + timed task through `simulationInterruptEngine`;
- then the existing gathering/production domain reconciliation authority.

This is the browser-facing “finish current activity” seam demonstrated by PX-3.

### DOM semantic gameplay intents

`domApp.js` currently routes direct gameplay intents for locality movement/POI interaction, starter-kit claim, equipment, travel, gathering, production, activity completion, combat encounter, ability, party, and other UI authorities. Command routing remains available as a power/diagnostic adapter but is not required for the first regional loop.

## Navigation architecture

### Safe locality

`localityEngine.js` derives named destination transitions from existing settlement place connections. The renderer omits exploration map/compass markup in locality mode. POI actions can focus an internal coordinate while exposing only semantic named interaction.

Safe locality is a hazard/presentation policy, not a second time or geography authority.

### Exploration

Exploration spaces use internal coordinates and `navigationEngine` for directional movement. `minimapModel` renders only discovered/locally knowable geometry and dynamically fits known geometry. Authored total extent and absolute coordinate placement remain private.

### Routes / transport

`routeCatalog.js`, `travelEngine.js`, and `transportEngine.js` own inter-place travel. Direct and scheduled travel consume fictional time and participate in the shared task/interrupt/activity laws.

## Work and resource architecture

`ecologyRegistry` exposes canonical gathering sources/populations. `gatheringWorkEngine` creates timed hands-on work, resolves equipped tool requirements, consumes source capacity at completion, preserves acquisition provenance, and advances character-owned work proficiency.

`productionCatalog` + `productionEngine` own processing/crafting/cooking/salvage records. Inputs are consumed at start, outputs materialize at completion, and output provenance records transformation plus input sources. Workstation context comes from real POI/locality tags through `workstationEngine`, not from a parallel facility database.

PX-3 composes these existing authorities into the first ordinary player loop; it does not special-case copper inside gathering or production engines.

## Combat and party architecture

Combat 2.0 uses structured battle-local action history and fictional-time readiness/recovery. `combatSimulationEngine` composes enemy readiness and ability completion as canonical interrupts. Status expiry uses canonical world time.

Persistent party state is NPC-backed. Active companions participate through Combat 2.0 and synchronize resources/statuses/location back to persistent companion records.

## Persistence policy

Current mode: `pre-release-current-schema`.

Prefer one clean current model to compatibility-only duplication. Persist only true gameplay authority. Derived UI/guidance state should be recomputed when the authoritative source already exists.

Current runtime remains Account Save 4 / Game State 5. Data 27 is an authored-data contract bump, not a persistence bump.

## Validation and performance

`npm test` is the main correctness gate. `npm run benchmark` maintains Benchmark 1 comparability. GitHub Actions also exercises build/status reporting and Pages deployment.

The integrated Phase 0.6 gate remains executable and must stay green as Phase 0.7 grows.

## Known transitional seams

- Search-or-act still routes commands rather than providing full semantic fuzzy search.
- Some information views still bridge command output.
- Canvas modules remain regression/reference code.
- Legacy-shaped stable POI IDs and several persisted/internal field names remain bounded compatibility debt.
- `gil` remains current currency terminology pending deliberate original-currency design.
- Active activity should outrank unrelated ready opportunity leads in contextual-action ranking.
- Typed `wait` should reconcile completed gathering/production consistently with the semantic activity-completion seam.
- Formal tracked contracts/commitments and relationship/reputation consequences are the next campaign-state authority to prove; do not implement them as Journal-owned flags.
