# Architecture

Hearth & Horizon is a text-first persistent fantasy life RPG. Runtime architecture should keep simulation authority, canonical data, player-facing presentation, and legacy compatibility boundaries distinct so each can evolve without forcing broad rewrites.

## Principles

1. **Game state and engines are authoritative; presentation is not.** UI views consume state or semantic view models and dispatch intents/actions back into engines.
2. **Text first, browser-native where practical.** The active application shell uses semantic HTML/CSS; SVG is used for the local discovery map. Canvas remains a bounded compatibility/reference implementation, not the active browser shell.
3. **UI controls and typed commands are adapters into shared gameplay behavior.** New player-facing features should prefer semantic intents/view models over manufacturing command strings where a stable direct seam exists.
4. **Simulation time is canonical fictional time.** Wall-clock callbacks are only scheduler input.
5. **Maps represent acquired knowledge.** Player map views derive from atlas/discovery state rather than exposing complete authored topology.
6. **Data, persistent state, engines, and presentation stay separate.** High-volume content belongs in validated data/content packs; UI code should not become content authority.
7. **Legacy material is bounded.** Historical FFXI-derived data/names may remain only at explicit research, migration, comparison, or compatibility seams.
8. Every major runtime contract should have tests, version tracking, and validation where practical.

## Current browser flow

```text
index.html
  -> js/main.js
      -> createDomApp(host)
          -> loadActiveCharacter() or createInitialState()
          -> createCommandRouter(state)
          -> createSlashCommandRouter(state)
          -> dispatchUiIntent(...)
          -> createGameViewModel(state, uiState)
          -> renderDomApp(...)
              -> semantic HTML/CSS application shell
              -> SVG local discovery map
```

The active browser shell is DOM-first as of `0.6.250`. The previous canvas application remains in `js/text/ui/canvas*` so existing compatibility tests and useful implementation seams are not destroyed during the transition. It is no longer mounted by `js/main.js`.

## UI architecture

```text
js/text/ui/
  domApp.js
  domRenderer.js
  gameViewModel.js
  uiState.js
  uiIntentDispatcher.js
  commandIntentAdapter.js
  minimapModel.js

  canvasApp.js          # transitional / compatibility shell
  canvasRenderer.js     # transitional / compatibility shell
  canvasLayout.js       # transitional / compatibility shell
  canvasInput.js        # shared structural helpers still used incrementally
  uiActions.js
  uiTheme.js
```

### Semantic presentation model

`gameViewModel.js` converts authoritative runtime state into renderer-oriented meaning without making display prose authoritative. Its current model exposes:

- place/region/coordinate and canonical fictional time;
- compact character identity, HP/MP/TP, and primary attributes;
- current scene description and nearby POIs;
- discovery-derived local map state;
- legal movement directions;
- a small set of contextual actions;
- current travel/timed-task activity;
- recent display lines with command echoes filtered out.

This is intentionally not a second game-state schema. View models are derived and disposable.

### DOM shell

`domApp.js` owns browser event delegation and wires existing save/account, command, slash-command, and direct-intent services to `domRenderer.js`.

The main game surface is organized around:

```text
location/time header
  + compact primary information navigation

local discovery map     world/scene or selected information view     character status

contextual actions
recent meaningful events
universal Search-or-act input
```

The scene is the primary presentation surface. There is no player-facing permanent "Output Log" panel. Command output can still feed recent events while systems are migrated toward dedicated view models.

### Character creation

The active DOM creator is a single-screen configuration surface rather than a wizard. Name, ancestry, sex, origin, and starting discipline remain visible with a continuously updated starting-profile summary. Existing `characterCreationModel.js` remains the choice/validation authority.

### Context actions

Context actions should answer "what can I meaningfully do here now?" rather than duplicate every command. Current derivation prioritizes nearby POI interaction, battle actions, travel stop, and basic world observation, capped to a small action set. Information destinations such as Character, Codex, World, and Craft are navigation, not world actions.

### Universal input

The bottom Search-or-act field currently routes typed engine/slash commands. It is the keyboard/power-user adapter. Full fuzzy entity/action search is not implemented yet and should not be confused with the current command-capable omnibox.

## Command and intent layer

```text
js/text/commandRouter.js
js/text/slashCommandRouter.js
js/text/commands/parser.js
js/text/ui/uiIntentDispatcher.js
js/text/ui/commandIntentAdapter.js
js/text/systems/ffxiCommandAdapter.js
```

- `commandRouter.js` remains the engine-facing text command dispatcher.
- `slashCommandRouter.js` owns slash/account compatibility routes.
- `uiIntentDispatcher.js` owns direct UI intents for account/menu/settings/creator/navigation behavior.
- `commandIntentAdapter.js` lets a semantic UI action reach an existing command-backed feature without teaching the renderer command semantics.
- `ffxiCommandAdapter.js` is a bounded historical compatibility seam and must not become canonical product vocabulary.

As systems mature, dedicated semantic views/actions should replace command-output presentation incrementally. Commands remain useful for testing, accessibility/power use, and compatibility.

## Save/account layer

```text
js/text/save.js
js/text/systems/saveMigrations.js
```

Current persistence contracts:

```text
Account Save: 4
Game State:   5
```

Historical localStorage keys are retained deliberately:

```text
ffxiTextRpgAccounts
ffxiTextRpgAccountSession
```

Payload encoding is `base64-json-v1`; it is encoding, not cryptographic protection. Ordered migrations handle supported persistence-version transitions. `reviveGameState()` repairs post-JSON references such as the flat inventory compatibility reference.

UI architecture state is ephemeral and does not justify a Game State migration. The `0.6.250` DOM transition consumes existing player, atlas, simulation, POI, and activity state.

## Major runtime layers

### Continuous character

Player state owns identity, character stats, progression, discipline-training records, character-owned skills/capabilities, resources, wallet, equipment, inventory/storage, flags, statuses, and related persistent records. Internal names such as `player.jobs` and `mainJobId` remain compatibility seams; active discipline does not own the person.

### Simulation

Canonical fictional seconds, simulation control, timed tasks, interrupt providers, and day-cycle reconciliation are separate from browser wall-clock time. Long actions should compose with those systems rather than inventing UI timers.

### Geography and travel

Places/maps/coordinates define geography. Atlas state records discovered knowledge. Navigation resolves local movement. Canonical routes and transport services own longer travel/scheduled services, with place connections retained only as bounded fallback data where needed.

### Ecology and resources

Species/families/populations/gathering sources define environmental substrate. Ecology runtime owns deterministic availability/depletion/regeneration. Resource provenance and opportunities prevent combat or gathering from becoming unexplained item generation.

### Content packs

Regional/shared content packs declare ownership and dependencies. Cross-reference validation checks geography, routes, ecology, resources/items, NPCs, shops, recipes, quests, and relationships at scale. Legacy normalization produces review candidates, never automatic canon.

### Character mechanics

`characterStatEngine.js`, progression/skill engines, `data/capabilities.js`, and `capabilityEngine.js` establish continuous-character ownership. Capability learning requirements and current-use requirements are separate. Executable magic/ability effects remain the next dedicated mechanics contract (`0.6.300`).

### Combat and items

Current battle/combat/item/equipment systems remain functional scaffolds with several transitional compatibility assumptions. Combat 2.0 is intentionally later (`0.6.400`); the UI architecture track does not rewrite combat behavior.

## Current module landmarks

```text
js/text/
  commandRouter.js
  slashCommandRouter.js
  gameState.js
  save.js
  version.js

  ui/
    domApp.js
    domRenderer.js
    gameViewModel.js
    uiState.js
    uiIntentDispatcher.js
    commandIntentAdapter.js
    minimapModel.js
    canvas*.js

  data/
    capabilities.js
    contentPackSchema.js
    regionalContentPacks.js
    ecologyCatalog.js
    routeCatalog.js
    resourceItems.js
    places.js
    maps.js
    pointsOfInterest.js
    equipmentCatalog.js

  systems/
    characterStatEngine.js
    capabilityEngine.js
    progressionEngine.js
    skillProgressionEngine.js
    worldTimeEngine.js
    simulationControlEngine.js
    simulationInterruptEngine.js
    timedTaskEngine.js
    navigationEngine.js
    travelEngine.js
    transportEngine.js
    ecologyEngine.js
    resourceOpportunityEngine.js
    contentPackValidator.js
    battleEngine.js
    combatActionEngine.js
```

## Transitional seams to preserve deliberately

- Canvas UI modules remain temporarily for regression coverage and migration comparison, but new browser presentation work should target the DOM shell.
- Some DOM views still call command-backed adapters (Inventory, Equipment, Skills, existing Spell/Technique/Bestiary views) because those systems do not yet expose dedicated presentation models.
- `uiState.js` currently reuses structural state helpers from `canvasInput.js`; extract renderer-neutral state incrementally rather than through a broad rewrite.
- The omnibox is command-capable, not yet a true cross-database fuzzy search system.
- The local map is intentionally rough and knowledge-driven. Richer landmarks/icons/regional maps should preserve atlas knowledge as authority.
- Legacy POI IDs, `gil`, historical save-key names, and internal discipline/job-shaped storage remain intentional compatibility debt documented elsewhere.

## New-thread startup checklist

1. Read `AGENTS.md` and `docs/THREAD_HANDOFF.md` first.
2. Read development direction, world/content policy, roadmap, and versioning roadmap in the required order.
3. Check `js/text/version.js` for the current product/schema/system versions.
4. Inspect the relevant semantic view model/intent seam before adding UI-specific game logic.
5. Run `npm test`, `npm run benchmark`, and relevant build checks.
6. Update tests, version tracking, architecture, and handoff when a major contract changes.
