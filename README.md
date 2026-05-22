# FFXI Text RPG

A text-only RPG foundation inspired by Final Fantasy XI systems.

This branch intentionally resets the project around a stable slash-command shell, structured entities, account/character save slots, conservative stat engines, parser-backed commands, validation helpers, version tracking, benchmarks, a database registry, seeded world graph, starter city maps, coordinate atlas, travel scaffold, text HUD/control metadata, inventory/storage containers, POI discovery, starter shops/guild hooks, equipment commands, and implementation-first documentation.

Backwards compatibility with the previous UI/save shape is not considered until explicitly reintroduced.

## Current version

```text
App/package: 0.4.1
Save: 3
Data: 7
Codename: Slash UI Account Saves
```

See `js/text/version.js` for the authoritative runtime/system version map.

## Running

Open `index.html` in a browser. No build step is required for the browser shell.

Suggested local repo path for Codex desktop work:

```text
C:\Codex\ffxi-text-rpg
```

## Development

Node 20+ is recommended for tests and benchmarks.

```bash
npm test
npm run benchmark
npm run check
```

## Important handoff docs

Read these first in a new thread or fresh development session:

1. `docs/THREAD_HANDOFF.md` - concise current-state handoff and next-pass guidance.
2. `docs/ARCHITECTURE.md` - runtime/module boundaries.
3. `docs/ROADMAP.md` - versioned implementation plan.
4. `docs/BASELINE_PIPELINE.md` - full baseline pipeline expectations.
5. `docs/SYSTEM_CATALOG.md` - system/data registry notes.
6. `CHANGELOG.md` - notable reset-branch changes.

## UI command policy

The browser UI now expects slash commands.

```text
/menu
/commands
/help
/newcharacter
/characters
/load <name|number>
/save
/account
/reset
```

Gameplay commands are also slash-prefixed in the UI:

```text
/look
/stats
/inventory
/equipment
/containers
/container <id>
/transfer <item> from <source> to <destination>
/equip <item> [to slot] [from container]
/unequip <slot> [to container]
/equipSources
/here
/talk <name>
/shop <name>
/buy <item>
/guild <name>
/quest <name>
/discovered
/fastpoi <name>
/zonefast
/maps
/map <id>
/zones
/zone <id|name>
/atlas <id|name>
/grid
/move <n|ne|e|se|s|sw|w|nw>
/travel <destination>
/wait <seconds>
/controls
/tick
/version
/systems
/databases
/validate
/log
```

Bare commands are rejected by the UI except while answering active character-creation prompts. The lower-level internal router still accepts bare commands for tests and engine reuse.

## Character creation

Use:

```text
/newcharacter
```

The command starts prompt-based character creation. While prompts are active, answers are natural text and do not require `/`:

```text
sandoria
hume
male
warrior
CharacterName
```

A completed character is saved automatically into the local account save.

## Save model

Local saves are stored under:

```text
ffxiTextRpgAccount
```

The save payload is encoded as:

```text
base64-json-v1
```

This is encoded storage, not strong encryption. It keeps player data from being plain readable JSON at a glance, but it is not secure against anyone with browser/devtools access. Real encryption should use a password-derived key or platform key later.

The old single-save key:

```text
ffxiTextRpgSave
```

is read only for migration when no account save exists, then removed after account save creation.

## Current architecture

```text
index.html
css/style.css
js/main.js
js/text/
  slashCommandRouter.js    UI-facing slash command wrapper
  commandRouter.js         internal command parsing and dispatch
  gameState.js             initial state and text descriptions
  save.js                  encoded account/character localStorage adapter
  sidebar.js               DOM sidebar/HUD/menu buttons
  textShell.js             DOM shell only
  version.js               app/save/data/system version manifest
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
    tickEngine.js
    travelEngine.js
    validation.js
scripts/
  benchmark.js
tests/
  *.test.js
docs/
  ARCHITECTURE.md
  BASELINE_PIPELINE.md
  RESEARCH_REFERENCES.md
  ROADMAP.md
  SYSTEM_CATALOG.md
  THREAD_HANDOFF.md
```

## Implemented foundation

- Text-only browser shell with slash-command UI.
- Account profile and multiple encoded local character save slots.
- Prompt-based character creation from `/newcharacter`.
- Argument-aware command parser.
- Structured player character entity.
- Structured NPC entity.
- Structured enemy entity.
- Race seed definitions.
- Job seed definitions for standard FFXI player jobs through Rune Fencer.
- Three starter city clusters: San d’Oria, Bastok, and Windurst.
- Starter city maps, starter region maps, and starter dungeon-hook maps.
- Seeded places, coordinate systems, map IDs, connection grids, and zone connections.
- Zone atlas discovery where unvisited grids remain unknown until visited.
- 8-way grid movement inside zones.
- Foot-travel aggro risk scaffold based on grid spawn rules, spawn count, and aggro types.
- Text HUD/control metadata for HP/MP/TP bars, live tick bar, 8-way nav keypad, and action groups.
- Direct travel engine with restrictions, departure coordinates, arrival coordinates, atlas recording, and manual time advancement.
- Starter-city POIs, same-zone POI discovery, and same-zone POI fast travel.
- Starter shop catalogs, guild service hooks, and quest/mission hooks.
- Inventory container framework: Inventory, Mog Safe, Mog Safe 2, Storage, Mog Locker, Mog Satchel, Mog Sack, Mog Case, and Mog Wardrobes 1-8.
- Mog House-only Storage/Mog Safe access and furniture-derived Storage capacity.
- Container transfer rules with capacity/access/item-kind validation.
- Shop buying into Inventory.
- Equip/unequip commands using Inventory and accessible Wardrobes.
- Starter equipment catalog with conservative stat modifiers.
- Attribute/resource/derived-stat/skill/equipment/currency constants.
- Conservative stat calculation engine.
- Simple battle-state engine.
- Status effect lifecycle engine.
- Live tick engine scaffold.
- Version manifest and system version tracking.
- Database registry for enemies, NPCs, places, zones, travel, quests, achievements, items, key items, magic, loot, leveling, trusts, crafting, mounts, and tick channels.
- Baseline benchmark harness.
- Game-state and world-data validation helpers.
- Node test harness using the built-in `node:test` runner.

## Formula policy

Current formulas are conservative placeholders. They exist to make the architecture executable and testable. Exact FFXI-like formulas should be added only after they are sourced, understood, marked with confidence, and covered by tests.

## Rebuild rules

- Keep the active runtime text based.
- Keep game logic separate from DOM rendering.
- Prefer small modules over giant files.
- Preserve reusable legacy data only when it can be migrated cleanly.
- Do not preserve backwards compatibility unless explicitly instructed.
- Document every new engine, schema, or pipeline change.
- Every major runtime system should have validation, tests, benchmark coverage, and version tracking.

## Current next best pass

The current recommended next pass is UI hardening, not new combat systems:

1. Make the main menu visually clearer and less terminal-only.
2. Add character-slot cards/buttons for `/characters` and `/load`.
3. Add visible command chips/buttons for common slash commands.
4. Add save/load error display in the UI.
5. Then resume game-system work with battle rewards: EXP, gil, and loot into Inventory.
