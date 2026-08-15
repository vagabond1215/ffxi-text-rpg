# Architecture

Hearth & Horizon is a text-first persistent fantasy life RPG. Runtime architecture keeps simulation authority, canonical data, player-facing presentation, and legacy compatibility boundaries distinct so each can evolve without broad rewrites.

## Principles

1. **Game state and engines are authoritative; presentation is derived.** UI views consume state/semantic view models and dispatch intents/actions into engines.
2. **Text first, browser-native where practical.** The active shell is semantic HTML/CSS. SVG is used only where a knowledge map adds value. Canvas remains bounded compatibility/reference code.
3. **Commands and UI controls are adapters.** New UI behavior should prefer semantic intents/direct engine seams instead of manufacturing command strings when a stable semantic seam exists.
4. **Canonical fictional time is the only gameplay clock.** Wall-clock callbacks are scheduler inputs, not simulation truth.
5. **Maps represent acquired knowledge.** Presentation must not expose raw authored coordinates, undiscovered total extent, or hidden placement inside authored bounds.
6. **Navigation presentation follows gameplay meaning.** Named localities are used where destinations/services/relationships matter; fine movement is used where terrain/path decisions matter.
7. **Content is data, not renderer logic.** High-volume world content belongs in validated catalogs/packs.
8. **Legacy material is bounded.** Historical FFXI-derived names/data exist only at explicit research, migration, comparison, or compatibility seams.
9. Major runtime contracts should have focused tests, version tracking, and validation where practical.

## Current browser flow

```text
index.html
  -> js/main.js
      -> createDomApp(host)
          -> load/create authoritative game state
          -> command/slash compatibility adapters
          -> semantic UI actions
          -> createGameViewModel(state, uiState)
          -> renderDomApp(...)
              -> semantic HTML/CSS shell
              -> conditional SVG discovery map in exploration only
```

The active browser shell has been DOM-first since `0.6.250`. `js/text/ui/canvas*` remains for bounded regression/reference coverage but is not mounted by `js/main.js`.

## UI and navigation architecture

Primary files:

```text
js/text/ui/domApp.js
js/text/ui/domRenderer.js
js/text/ui/gameViewModel.js
js/text/ui/uiState.js
js/text/ui/uiIntentDispatcher.js
js/text/ui/commandIntentAdapter.js
js/text/ui/minimapModel.js
js/text/systems/localityEngine.js
```

`gameViewModel.js` is a disposable renderer-facing projection. It exposes scene/status/activity/context actions plus a semantic navigation mode; it is not persisted and is not a second game-state schema.

Current navigation modes:

```text
locality     -> named settlement destinations + locality/POI actions
exploration  -> acquired-knowledge map + directional movement
route        -> journey/progress + route/transport controls
combat       -> combat state + tactical actions
```

### Safe locality

`localityEngine.js` treats guarded danger-0 city/city-interior/travel-hub `place` records as locality nodes. Existing place connections provide bounded adjacent-district travel; a redundant locality geography database was intentionally not introduced.

Locality crossing:

```text
semantic destination action
  -> localityEngine.moveWithinLocality()
  -> authored coarse travelSeconds
  -> advanceSimulationUntilInterrupt()
  -> destination place/atlas update
  -> locality.changed semantic event
```

Ordinary browsing consumes no fictional time. Crossings/activities may consume authored time and remain interruptible. A safe locality is a hazard policy, not a second clock.

The active DOM renderer omits map and D-pad markup outside exploration mode. Internal POI coordinates can still locate implementation targets, but player-facing city navigation uses names/actions rather than coordinate identity.

### Exploration

`navigationEngine.js`, atlas state, and `minimapModel.js` retain fine directional exploration for wilderness/dungeons/other movement-sensitive spaces. The SVG projection is discovery-relative. Higher-resolution shaped/seam-compatible cartography can be added later without making detailed maps mandatory for every settlement.

### Semantic locality actions

`domApp.js` directly dispatches `locality.move` and `locality.poi` into `localityEngine`. Command-backed adapters remain available for older surfaces and power use, but locality UI does not need to synthesize compass commands.

## Character creation

The active creator is a single-screen configuration surface. `characterCreationModel.js` remains choice/validation authority. Name, ancestry, sex, origin, and starting discipline remain visible with a live summary. Starting discipline is initial training, not permanent class identity.

## Combat architecture

Primary files:

```text
js/text/systems/battleEngine.js
js/text/systems/combatActionEngine.js
js/text/systems/combatTurnEngine.js
js/text/systems/combatSimulationEngine.js
js/text/systems/abilityEngine.js
js/text/systems/statusEngine.js
js/text/data/enemyAbilities.js
```

### Combat action contract

Combat 2.0 contract v2 is additive battle runtime state:

```js
battle.contract = {
  version: 2,
  actionSequence,
  actions,
  lastActionId,
  timeline: {
    startedAtWorldSeconds,
    readyAtByActorId
  }
}
```

Basic attacks, canonical abilities, bounded legacy cast/technique adapters, and enemy actions record structured outcomes and emit `combat.action.resolved`. Battle display prose is not combat authority.

### Fictional-time readiness

Player/enemy recovery is expressed as absolute canonical `readyAtWorldSeconds`. `combatTurnEngine.provideCombatInterrupts()` contributes enemy-ready events to the existing simulation interrupt engine. `combatSimulationEngine.advanceCombatSimulation()` composes combat-ready and ability-completion interrupt providers, so an enemy can act during a timed cast and interrupt it before completion.

There is no separate combat tick clock.

### Enemy abilities

`data/enemyAbilities.js` is canonical original combat data. The initial representative active technique is `enemy-ability-rushing-cleave`; deterministic selection is deliberately small and extensible rather than presented as final AI.

### Status timing

Finite statuses may carry `appliedAtWorldSeconds` and `expiresAtWorldSeconds`. `statusEngine.reconcileStatusesAtWorldTime()` anchors older finite statuses lazily and expires them against canonical fictional time.

## Continuous character and capabilities

Player state owns identity, character stats, progression, discipline-training records, character-owned skills/capabilities, resources, wallet, equipment, inventory/storage, flags, and statuses. Internal names such as `player.jobs`/`mainJobId` remain compatibility seams; active discipline does not own the person.

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

`capabilityEngine.js` separates learning from current use. Executable effects live in the ability/combat systems rather than capability records.

## Equipment and tool architecture

Primary files:

```text
js/text/data/itemSchema.js
js/text/data/equipmentCatalog.js
js/text/systems/equipmentEngine.js
js/text/systems/equipmentEligibilityEngine.js
js/text/systems/equipmentToolEngine.js
js/text/data/shopCatalogs.js
js/text/systems/shopEngine.js
```

Equipment catalog v3 includes representative weapons, armor, shield/accessory/travel gear, and field tools. New original items default away from active-discipline restrictions; older starter `allowedJobs` records remain compatibility debt.

`equipmentToolEngine.js` is the shared resolver for tags provided by equipped loadout items. This lets one equipped Field Knife, Prospector Pick, Woodsman Hatchet, Digging Spade, Reed Sickle, or Marsh Fishing Rod satisfy practical capability/gathering prerequisites without each domain inventing a separate tool-state system.

Gathering flow now composes:

```text
equipped item
  -> normalized equipment tags
  -> equipmentToolEngine
  -> ecologyEngine requiredToolTags
  -> normal provenance-bearing gathered material
```

Explicit contextual `toolTags` are still accepted as a bounded adapter for tests/future non-equipped tool contexts.

Shop purchases tagged as equipment/tool are normalized through `enrichEquipmentItem()` before entering inventory, so purchased canonical field tools are immediately usable by normal equip/loadout systems.

## Simulation architecture

Canonical fictional seconds, simulation control, timed tasks, interrupt providers, and day-cycle reconciliation are separate from browser wall-clock time. Long actions must compose with these systems rather than create domain-specific clocks.

Important modules:

```text
worldTimeEngine.js
simulationControlEngine.js
simulationInterruptEngine.js
timedTaskEngine.js
dayCycleEngine.js
```

## Geography, ecology, resources, and content

- Places/maps/coordinates define authored geography.
- Atlas state records acquired character knowledge.
- Routes/transport own longer travel and scheduled services.
- Species/families/populations/gathering sources define environmental substrate.
- Ecology runtime owns deterministic availability/depletion/regeneration.
- Resource provenance/opportunities prevent combat/gathering from becoming unexplained item generation.
- Regional/shared content packs declare ownership/dependencies and are cross-reference validated at scale.
- Legacy normalization produces review candidates, never automatic canon.

## Save/account layer

```text
Account Save: 4
Game State:   5
Data:         23
```

Historical localStorage keys remain deliberately:

```text
ffxiTextRpgAccounts
ffxiTextRpgAccountSession
```

Payload encoding remains `base64-json-v1`; this is encoding, not cryptographic protection. Ordered migrations handle supported persistence versions. Additive combat timeline/status/tool/navigation behavior did not require a Game State bump.

## Current compatibility debt

Preserve deliberately unless directly in scope:

- Canvas UI regression/reference modules.
- Command-backed DOM information views where dedicated presentation models do not yet exist.
- `uiState.js` reuse of some old canvas input-state helpers.
- Search-or-act is command-capable, not full fuzzy entity/action search.
- Legacy-shaped POI stable IDs and historical localStorage keys.
- `gil` pending deliberate original currency design.
- `player.jobs`, `mainJobId`, `raceId`, `nationId` and related persisted/internal identifiers.
- Older starter equipment `allowedJobs` eligibility fields.
- Legacy combat cast/weapon-technique adapters where tests/migration still depend on them.
- `places.js` spawn rules and fallback place connections where newer ecology/routes do not yet own the whole domain.
- Historical FFXI research modules at explicit reference boundaries.

## Next architecture track

`0.6.600` should build production/work actions on existing authority rather than introduce parallel systems:

```text
canonical world time/tasks
+ equipment/tool tags
+ character proficiency/capability
+ resource provenance/sinks
+ locality/exploration context
+ regional content ownership
-> gathering/processing/crafting/cooking/salvage loops
```

Prove a small end-to-end source -> process -> finished-use/sink loop before broad recipe/content expansion.
