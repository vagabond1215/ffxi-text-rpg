# Architecture

Hearth & Horizon is a text-first persistent fantasy life RPG. Runtime architecture keeps simulation authority, canonical data, player-facing presentation, and legacy compatibility boundaries distinct so each can evolve without broad rewrites.

Current baseline:

```text
Product:      0.6.900.1
Package:      0.6.900
Account Save: 4
Game State:   5
Data:         26
Benchmark:    1
```

Phase 0.6 is complete. `integratedMechanicsGate.js` is now the executable cross-system readiness seam protecting the completed mechanics baseline as Phase 0.7 grows playable content.

## Principles

1. **Game state and engines are authoritative; presentation is derived.** UI views consume state/semantic view models and dispatch intents/actions into engines.
2. **Text first, browser-native where practical.** The active shell is semantic HTML/CSS. SVG is used only where a knowledge map adds value. Canvas remains bounded compatibility/reference code.
3. **Commands and UI controls are adapters.** New UI behavior should prefer semantic intents/direct engine seams instead of manufacturing command strings when a stable semantic seam exists.
4. **Canonical fictional time is the only gameplay clock.** Wall-clock callbacks are scheduler inputs, not simulation truth.
5. **Maps represent acquired knowledge.** Presentation must not expose raw authored coordinates, undiscovered total extent, or hidden placement inside authored bounds.
6. **Navigation presentation follows gameplay meaning.** Named localities are used where destinations/services/relationships matter; fine movement is used where terrain/path decisions matter.
7. **Continuous-character ownership is explicit.** Disciplines describe training; learned capabilities, skills, work proficiency, progression, and relationships belong to the persistent person.
8. **Resources have provenance and intended sinks.** Combat, gathering, recovery, production, trade, and social rewards must not bypass physical/economic/social ownership rules.
9. **Persistent companions are world characters.** Party membership promotes an NPC-backed persistent person into active party state; companions are not summons or disposable battle copies.
10. **Content is data, not renderer logic.** High-volume world content belongs in validated catalogs/packs.
11. **Legacy material is bounded.** Historical FFXI-derived names/data exist only at explicit research, migration, comparison, or compatibility seams.
12. Major runtime contracts should have focused tests, subsystem versions, and validation where practical.

## Current browser flow

```text
index.html
  -> js/main.js
      -> createDomApp(host)
          -> load/create authoritative game state
          -> command/slash compatibility adapters
          -> semantic UI actions/intents
          -> createGameViewModel(state, uiState)
          -> renderDomApp(...)
              -> semantic HTML/CSS shell
              -> conditional SVG discovery map in exploration only
```

The active browser shell has been DOM-first since `0.6.250`. `js/text/ui/canvas*` remains for bounded regression/reference coverage but is not mounted by `js/main.js`.

## Authoritative state composition

Game State 5 remains the persistence contract. Major current state domains include:

```text
player
worldTime
simulation
tasks
events
atlas / discovered POIs
abilities
battle
projects
resourceOpportunities
ecology
work
party
journey / transport state
world flags and persistent NPC state
```

Several Phase 0.6 registries are additive and lazily normalizable. The integrated mechanics gate explicitly proves that missing additive simulation/task/event/ability/party/project/resource-opportunity/ecology/work registries can be reconstructed without changing Game State 5.

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
js/text/systems/navigationEngine.js
```

`gameViewModel.js` is a disposable renderer-facing projection. It exposes scene/status/activity/context actions, party state, learned abilities, and semantic navigation mode; it is not persisted and is not a second game-state schema.

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
  -> active companion location synchronization
  -> locality.changed semantic event
```

Ordinary browsing consumes no fictional time. Crossings/activities may consume authored time and remain interruptible. A safe locality is a hazard policy, not a second clock.

The active DOM renderer omits map and D-pad markup outside exploration mode. Internal POI coordinates can locate implementation targets, but player-facing city navigation uses names/actions rather than coordinate identity.

### Exploration and map privacy

`navigationEngine.js`, atlas state, and `minimapModel.js` retain fine directional exploration for wilderness/dungeons/other movement-sensitive spaces. The SVG projection is discovery-relative and dynamically rebases/fits known geometry. Full authored bounds, raw coordinates, hidden relative placement, and total undiscovered extent are not player knowledge.

Legacy POI data may retain internal source positions for compatibility/mapping, but exported player-facing POI descriptions no longer print those values.

## Character, capabilities, equipment, and work

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

Player state owns identity, character stats, progression, discipline-training records, character-owned skills/capabilities, work proficiencies, resources, wallet, equipment, inventory/storage, flags, and statuses. Internal names such as `player.jobs`/`mainJobId` remain compatibility seams; active discipline does not own the person.

`capabilityEngine.js` separates learning from current use. Executable effects live in the ability/combat systems rather than capability records.

### Equipment and tools

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

Canonical authored equipment no longer carries active-discipline `allowedJobs` gates. The generic eligibility field remains accepted for explicit historical/migration/compatibility input and is covered by a bounded legacy test fixture.

`equipmentToolEngine.js` resolves tags supplied by equipped loadout items. Field Knife, Prospector Pick, Woodsman Hatchet, Digging Spade, Reed Sickle, and Marsh Fishing Rod can therefore satisfy practical capability/gathering requirements without a second tool-state system.

### Work and production

Primary files:

```text
js/text/systems/workTaskEngine.js
js/text/systems/workProficiencyEngine.js
js/text/systems/gatheringWorkEngine.js
js/text/systems/resourceRecoveryWorkEngine.js
js/text/systems/productionEngine.js
js/text/data/productionCatalog.js
```

Hands-on gathering, body recovery, processing, crafting, cooking, salvage, and recycling compose with canonical timed tasks and character activity ownership. Work consumes inputs or source capacity at the appropriate authority boundary and materializes outputs at completion. Full inventory creates persistent pending output rather than duplication/loss.

Workstations are derived from locality POI/service tags rather than a duplicate facility database. Higher proficiency can improve duration while stored mastery remains character-owned.

## Combat, abilities, and party

Primary files:

```text
js/text/systems/battleEngine.js
js/text/systems/combatActionEngine.js
js/text/systems/combatTurnEngine.js
js/text/systems/combatSimulationEngine.js
js/text/systems/abilityEngine.js
js/text/systems/statusEngine.js
js/text/systems/partyEngine.js
js/text/data/enemyAbilities.js
js/text/data/companions.js
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

Basic attacks, canonical abilities, bounded legacy cast/technique adapters, enemy actions, and representative companion actions record structured outcomes. Battle display prose is not combat authority.

### Fictional-time readiness

Player/enemy recovery is expressed as absolute canonical readiness time. Combat and ability completion contribute interrupt candidates to the existing simulation substrate, so timed abilities can be interrupted by enemy readiness. There is no separate combat tick clock.

### Persistent companions

`data/companions.js` owns canonical companion definitions. `partyEngine.js` owns recruited/active party state, NPC linkage, relationship dimensions, resources/statuses, location continuity, and membership operations.

A recruited companion remains one persistent NPC-backed person. Active companions participate on the ally side of Combat 2.0 and synchronize combat state back to the persistent party record. They follow canonical place-transition authorities including exploration exits, locality crossings, direct route travel, and scheduled transport arrivals.

The active UI uses semantic `party.recruit` when available. The older `companion` command/POI route now delegates to `partyEngine`; it is a compatibility adapter, not companion authority.

## Simulation architecture

Canonical fictional seconds, simulation control, timed tasks, interrupt providers, day-cycle reconciliation, combat readiness, ability completion, work, projects, and transport all compose around one simulation timeline.

Important modules:

```text
worldTimeEngine.js
simulationControlEngine.js
simulationInterruptEngine.js
timedTaskEngine.js
dayCycleEngine.js
combatSimulationEngine.js
```

Long actions must compose with these systems rather than create domain-specific clocks.

## Geography, ecology, resources, provenance, and content

- Places/maps/coordinates define authored geography.
- Atlas state records acquired character knowledge.
- Routes/transport own longer travel and scheduled services.
- Species/families/populations/gathering sources define environmental substrate.
- Ecology runtime owns deterministic availability/depletion/regeneration.
- Resource opportunities represent bodies, carried goods, and other recoverable world resources rather than magical drops.
- Production transforms provenance-bearing inputs into provenance-bearing outputs.
- Regional/shared content packs declare ownership/dependencies and are cross-reference validated at scale.
- Legacy normalization produces review candidates, never automatic canon.

## Validation and exit-gate architecture

`validation.js` remains broad current-state/world validation. Domain catalogs have focused validators. Two higher-level gates now exist:

```text
simulationSubstrateGate.js     -> protects completed Phase 0.5 substrate
integratedMechanicsGate.js     -> protects completed Phase 0.6 mechanics integration
```

`integratedMechanicsGate.js` evaluates grouped contracts for:

```text
persistenceAndNormalization
fictionalTimeAndInterrupts
continuousCharacterOwnership
combatPartyWorkTravel
provenanceAndProduction
semanticUiAuthority
worldAndContentValidation
phaseExitReadiness
```

It intentionally consumes existing validators/system/database versions instead of becoming a second implementation authority.

## Save/account layer

```text
Account Save: 4
Game State:   5
Data:         26
```

Historical localStorage keys remain deliberately:

```text
ffxiTextRpgAccounts
ffxiTextRpgAccountSession
```

Payload encoding remains `base64-json-v1`; this is encoding, not cryptographic protection. Ordered migrations handle supported persistence versions. Additive Phase 0.6 runtime state remains compatible with Game State 5.

## Current compatibility and deferred depth

Preserve deliberately unless directly in scope:

- Canvas UI regression/reference modules.
- Command-backed DOM information views where dedicated presentation models do not yet exist.
- `uiState.js` reuse of some old canvas input-state helpers.
- Search-or-act is command-capable, not full fuzzy entity/action search.
- Legacy-shaped POI stable IDs and historical localStorage keys.
- Internal POI/source coordinates remain valid simulation data but must stay out of player presentation.
- `gil` pending deliberate original currency design.
- `player.jobs`, `mainJobId`, `raceId`, `nationId` and related persisted/internal identifiers.
- Explicit legacy `allowedJobs` eligibility may be accepted at compatibility boundaries; canonical authored equipment should not use active discipline as a universal gate.
- Legacy combat cast/weapon-technique adapters where tests/migration still depend on them.
- `places.js` spawn rules and fallback place connections where newer ecology/routes do not yet own the whole domain.
- Historical FFXI research modules at explicit reference boundaries.
- Companion content/tactics/dialogue/equipment/progression breadth remains limited.
- Achievements, key-item depth, mounts, high-resolution exploration cartography, and broader social/economic content remain later work rather than Phase 0.6 blockers.

## Next architecture direction — Phase 0.7

Do not introduce another parallel mechanics foundation. `0.7.100` should assemble a **playable campaign slice** by composing existing authorities:

```text
persistent NPC/community state
+ semantic settlement UI
+ contracts/quests/relationships
+ regional ecology and livelihood economy
+ routes/transport
+ combat/abilities/party
+ recovery/production/trade
+ canonical time/interrupts
+ save/content validation
-> repeatable multi-session regional campaign slice
```

Add new reusable primitives only when that campaign slice proves an actual missing authority. Content breadth should then expand through validated data/packs rather than renderer or command special cases.
