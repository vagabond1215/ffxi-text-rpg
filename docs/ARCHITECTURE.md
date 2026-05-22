# Architecture

This branch is a text-first rebuild. The goal is a stable foundation that can absorb researched FFXI-style systems without dragging forward old UI assumptions.

## Principles

1. Text first. The browser shell renders text/HUD controls and accepts slash commands.
2. Logic does not touch the DOM.
3. Backwards compatibility is not required unless explicitly reintroduced later.
4. Data, state, and engines should stay separate.
5. Exact formulas are migrated only when they are sourced and understood.
6. Conservative approximations are acceptable when clearly marked and easy to replace.
7. Every major runtime system should have tests, validation where practical, and version tracking.

## Current runtime flow

```text
index.html
  -> js/main.js
      -> loadActiveCharacter() or createInitialState()
      -> createSlashCommandRouter(state)
          -> createCommandRouter(state) for internal command dispatch
      -> createSidebar(...)
      -> createTextShell(...)
```

The UI-facing router requires slash commands. It forwards slash gameplay commands to the internal bare-command router after stripping `/`. Character-creation prompt answers are the exception: while prompts are active, natural answers are passed through without requiring `/`.

## UI layer

```text
js/main.js
js/text/textShell.js
js/text/sidebar.js
js/text/slashCommandRouter.js
```

- `main.js` wires browser DOM to the current state, sidebar, shell, save services, and slash router.
- `textShell.js` is DOM-only input/output. It should not own game logic.
- `sidebar.js` renders the character HUD, resource bars, and slash-command menu buttons.
- `slashCommandRouter.js` owns `/menu`, `/commands`, `/help`, `/newcharacter`, `/characters`, `/load`, `/save`, `/account`, and `/reset`.

## Command layer

```text
js/text/commandRouter.js
js/text/commands/parser.js
js/text/systems/ffxiCommandAdapter.js
```

- `commandRouter.js` is the internal engine-facing dispatcher.
- `parser.js` handles tokenization, aliases, positional arguments, and `--named=value` args.
- `ffxiCommandAdapter.js` accepts FFXI-style slash forms inside the internal engine path where relevant.

## Save/account layer

```text
js/text/save.js
```

The current browser save key is:

```text
ffxiTextRpgAccount
```

The saved payload is encoded as:

```text
base64-json-v1
```

This is encoded local storage, not strong encryption. It prevents immediate plain JSON readability, but it is not secure against users with browser/devtools access. Strong encryption should use a password-derived key or platform-backed key later.

Account state includes:

- account profile
- last active character ID
- character summaries
- encoded character game states

The old key `ffxiTextRpgSave` is only used for migration when no account save exists.

`reviveGameState()` relinks `player.inventory` to `player.inventoryState.containers.inventory.items` after JSON load, because JSON serialization breaks object references.

## Current module layout

```text
js/text/
  slashCommandRouter.js
  commandRouter.js
  gameState.js
  save.js
  sidebar.js
  textShell.js
  version.js

  commands/
    parser.js

  data/
    actionControls.js
    databaseRegistry.js
    equipmentCatalog.js
    guildServices.js
    inventoryContainers.js
    jobs.js
    maps.js
    mogHouseFurniture.js
    nations.js
    places.js
    pointsOfInterest.js
    questHooks.js
    races.js
    seedEntities.js
    shopCatalogs.js
    skillCaps.js
    systemConstants.js

  entities/
    entityFactory.js

  systems/
    aggroEngine.js
    atlasEngine.js
    battleEngine.js
    characterCreator.js
    combatActionEngine.js
    equipmentEngine.js
    ffxiCommandAdapter.js
    inventoryEngine.js
    menuDescriptions.js
    poiEngine.js
    shopEngine.js
    statEngine.js
    statusEngine.js
    statFormulaDescriptions.js
    tickEngine.js
    travelEngine.js
    validation.js
```

## Entity model

### Player

Player entities own identity, jobs, progression, wallet, equipment, inventory state, key items, statuses, flags, resources, and calculated combat profile.

Important inventory note:

```text
player.inventory
```

is intentionally a compatibility reference to:

```text
player.inventoryState.containers.inventory.items
```

After loading from localStorage, `reviveGameState()` must restore that reference.

### NPC

NPC entities are service/dialogue/quest/shop holders. They are not combat actors by default.

### Enemy

Enemy entities are combat actors with level, family, ecosystem, aggro flags, skills, loot hooks, EXP value, statuses, resources, and calculated combat profile.

## Core systems

### Stat engine

The stat engine calculates:

- attributes
- HP/MP/TP maxima
- skills
- derived combat stats
- elemental resistances

Equipment modifiers from `equipmentCatalog.js` are included in the combat profile when gear is equipped.

### Inventory engine

The inventory engine owns:

- Inventory
- Mog Safe
- Mog Safe 2
- Storage
- Mog Locker
- Mog Satchel
- Mog Sack
- Mog Case
- Mog Wardrobes 1-8
- container access rules
- capacity checks
- item-kind checks
- container transfers

Storage capacity is furniture-derived and is only accessible from Mog House context. Mog Safe is also Mog House-only. Wardrobe 1 is unlocked by default and equipment-only; other wardrobes are present but locked by default.

### Equipment engine

The equipment engine owns:

- equipping from Inventory or accessible Wardrobes
- unequipping to valid containers
- source/destination capacity checks
- slot inference from item metadata or tags
- eligibility checks for equipment kind, allowed slot, main-job level, allowed jobs, allowed races, simple sex/nation/key-item/quest requirements, two-handed/offhand conflicts, and ranged/ammo slot constraints
- text-first item inspection for accessible inventory, wardrobe, and equipped items
- safe replacement behavior

Equipment catalog entries are static templates. Runtime inventory records remain item instances with quantity, source, and future instance-specific fields. Template-sensitive fields such as weapon delay, requirements, modifiers, and starter eligibility carry confidence/source metadata and should not be treated as exact retail data unless marked that way.

### Skill caps

`js/text/data/skillCaps.js` owns the current sparse skill rank/cap scaffold. It exposes `getSkillCap(jobId, skillId, level)` and `getEffectiveSkill(player, skillId)` for future combat and magic integration. The cap formula is explicitly placeholder metadata, so battle and command handlers should not bake it in as exact FFXI behavior.

### POI engine

The POI engine owns:

- current-grid POI discovery
- same-zone POI fast travel
- current-grid contextual actions
- shop/guild/quest action dispatch

### Shop engine

The shop engine currently supports buying only. Purchases spend gil, create/enrich items, and add them into Inventory through container rules. Selling is intentionally a placeholder until item value/flags/vendor restrictions are defined.

### Battle engine

The battle engine owns battle-local state:

- combatants
- current HP/MP/TP
- phase
- round
- enmity placeholder
- skillchain placeholder
- magic burst placeholder
- log

Combat actions exist, but battle rewards are not implemented yet.

### Status engine

The status engine owns:

- status creation
- stacking behavior
- replacement/ignore/stack rules
- duration advancement
- tick effects

### Travel/atlas/aggro engines

Travel and movement systems own:

- zone graph lookup
- direct travel state
- travel restrictions
- grid movement
- atlas discovery
- foot-travel aggro scaffold

## Save compatibility

The current save version is `3`. Backwards compatibility is not guaranteed except for one migration path from the previous raw `ffxiTextRpgSave` key into the encoded account save format.

During this rebuild, it is acceptable to clear local saves when state shape changes unless explicit migration is requested.

## Migration notes

Existing legacy data may be reused, but each piece should be migrated deliberately into the new text-first schema. Do not blindly import legacy modules into new systems unless they are pure data and do not carry UI assumptions.

## New-thread startup checklist

1. Read `README.md`.
2. Read `docs/THREAD_HANDOFF.md`.
3. Check `js/text/version.js` for current system versions.
4. Run `npm test` and `npm run benchmark` locally.
5. Inspect recent systems before changing them: `slashCommandRouter.js`, `save.js`, `inventoryEngine.js`, `equipmentEngine.js`, `poiEngine.js`, `shopEngine.js`, and `commandRouter.js`.
6. Update docs, tests, and version tracking with every major change.
