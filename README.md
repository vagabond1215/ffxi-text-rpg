# FFXI Text RPG

A text-only RPG foundation inspired by Final Fantasy XI systems.

This branch intentionally resets the project around a stable canvas-first text shell, structured entities, account/character save slots, conservative stat engines, parser-backed commands, validation helpers, version tracking, benchmarks, a database registry, seeded world graph, starter city maps, coordinate atlas, travel scaffold, text HUD/control metadata, inventory/storage containers, item schema and stacking, POI discovery, starter shops/guild hooks, equipment commands and eligibility checks, deterministic combat, battle rewards, EXP tables, level-up rules, character-owned skill progression scaffolding, skill-cap scaffolding, and implementation-first documentation.

Backwards compatibility with the previous UI/save shape is not considered until explicitly reintroduced.

## Current version

```text
App/package: 0.4.1
Account Save: 3
Game State: 2
Data: 12
Codename: Slash UI Account Saves
```

`VERSION.save` remains as a backward-compatible alias for `VERSION.accountSave` while callers migrate to the clearer name.

See `js/text/version.js` for the authoritative runtime/system version map.

## Running

Do not open `index.html` directly with a `file://` URL. The browser blocks ES module imports from local files, so the canvas shell must be served over localhost.

From the repo root:

```bash
npm run serve
```

Then open:

```text
http://127.0.0.1:4173/
```

No build step is required. The visible game UI is rendered into one canvas; HTML is only the host layer.

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

## Canvas UI Command Policy

The active browser UI is canvas-first. It draws the title/status bar, command buttons, output log, context panel, and command input inside `#game-canvas`.

The left-side canvas buttons dispatch existing `commandRouter.js` commands:

```text
character
stats
job
skills
inventory
equipment
maps
look
here
battle
help
validate
save
```

The canvas command input accepts existing bare commands and still accepts slash commands where the slash router owns account/menu behavior:

```text
look
stats
skills
skill <id>
inspect skills
inspect skill <id>
inventory
item <query>
inspect item <query>
equipment
containers
container <id>
transfer <item> from <source> to <destination>
equip <item> [to slot] [from container]
unequip <slot> [to container]
equipSources
here
talk <name>
shop <name>
buy <item>
guild <name>
quest <name>
discovered
fastpoi <name>
zonefast
maps
map <id>
zones
zone <id|name>
atlas <id|name>
grid
move <n|ne|e|se|s|sw|w|nw>
travel <destination>
wait <seconds>
controls
tick
version
systems
databases
validate
log
```

Slash forms like `/menu`, `/commands`, `/newcharacter`, `/characters`, `/load <name|number>`, `/save`, `/account`, and `/reset` are still accepted by the canvas input.

## Canvas UI Shell

The browser shell remains text-first, but the visible UI is drawn on canvas. The first pass includes a top status bar, left clickable command sidebar, main output log, right context/history panel on desktop widths, and a bottom command input row.

## Character creation

Use:

```text
/newcharacter
```

The command starts prompt-based character creation. While prompts are active, answers are natural text and do not require `/`. The current prompt order is name, nation, race, sex, starting job, then confirmation:

```text
CharacterName
sandoria
hume
male
warrior
yes
```

A completed and confirmed character is saved automatically into the local account save.

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
  sidebar.js               legacy DOM sidebar/HUD helper, inactive in current entry path
  topBar.js                legacy DOM top bar helper, inactive in current entry path
  ui/
    canvasApp.js           browser canvas shell bootstrap
    canvasRenderer.js      canvas drawing only
    canvasLayout.js        pure panel/button bounds and hit testing
    canvasInput.js         canvas pointer/keyboard state helpers
    uiActions.js           pure button-to-command registry
    uiTheme.js             canvas color/type constants
  textShell.js             legacy DOM shell helper, inactive in current entry path
  uiPanels.js              legacy reusable DOM panel helpers and feedback classifier
  version.js               app/account-save/game-state/data/system version manifest
  commands/
    parser.js
  data/
    actionControls.js
    databaseRegistry.js
    equipmentCatalog.js
    expTables.js
    guildServices.js
    inventoryContainers.js
    itemSchema.js
    jobs.js
    lootTables.js
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
    progressionEngine.js
    rewardEngine.js
    rng.js
    shopEngine.js
    skillProgressionEngine.js
    statEngine.js
    statusEngine.js
    tickEngine.js
    travelEngine.js
    validation.js
scripts/
  benchmark.js
  serve.js
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

- Canvas-first browser shell with command-backed clickable buttons and keyboard command input.
- Canvas-rendered top bar with character/location/status summary.
- Account profile and multiple encoded local character save slots.
- Canvas-rendered action sidebar, output log, context/history panel, and bottom command row.
- Prompt-based character creation from `/newcharacter`.
- Argument-aware command parser.
- Pure canvas UI action, layout, hit-testing, and keyboard input helpers.
- Local static dev server for browser module loading over localhost.
- Structured player, NPC, and enemy entities.
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
- Common item schema, item normalization, stack metadata, and stack-aware container insertion.
- Normalized equipment template fields for family/archetype/subtype, allowed slots, weapon category/delay, requirements, flags, always-on effects, latent/enchantment/augment scaffolds, charges, and confidence/source metadata.
- Container transfer rules with access, capacity, item-kind, and stack-handling validation.
- Shop buying into Inventory.
- Equip/unequip commands using Inventory and accessible Wardrobes, with job/race/level/slot eligibility and two-handed/offhand conflict checks.
- Text-first `item <query>` and `inspect item <query>` inspection for accessible inventory, wardrobe, and equipped items.
- Starter equipment catalog with conservative stat modifiers and explicit placeholder/intentional-simplification metadata.
- Attribute/resource/derived-stat/skill/equipment/currency constants.
- Conservative stat calculation engine.
- Character-owned current skill storage under `player.progression.skills[skillId]`.
- Sparse skill rank/cap helper data and text-first `skills`, `skill <id>`, `inspect skills`, and `inspect skill <id>` commands for future combat and magic skill progression.
- Simple battle-state engine with deterministic RNG injection.
- Battle reward resolution for EXP, gil, loot rolls, Inventory insertion, duplicate payout prevention, and progression engine integration.
- Conservative EXP table data, level-up rules, EXP-to-next tracking, level-cap behavior, and HP/MP/resource refresh after level-up.
- Status effect lifecycle engine.
- Live tick engine scaffold.
- Version manifest and system version tracking.
- Database registry for enemies, NPCs, places, zones, travel, quests, achievements, items, key items, magic, loot, leveling, trusts, crafting, mounts, and tick channels.
- Baseline benchmark harness.
- Game-state, world-data, equipment-catalog, item-requirement, modifier-key, flag/effect, skill-rank, and character-owned skill-state validation helpers.
- Node test harness using the built-in `node:test` runner.

## Formula policy

Current formulas are conservative placeholders. They exist to make the architecture executable and testable. Exact FFXI-like formulas should be added only after they are sourced, understood, marked with confidence, and covered by tests.

## Rebuild rules

- Keep the active runtime text based.
- Keep game logic separate from canvas/DOM rendering.
- Prefer small modules over giant files.
- Preserve reusable legacy data only when it can be migrated cleanly.
- Do not preserve backwards compatibility unless explicitly instructed.
- Document every new engine, schema, or pipeline change.
- Every major runtime system should have validation, tests, benchmark coverage, and version tracking.

## Current next best pass

The current recommended next pass is item behavior modules and conservative skill plumbing:

1. Implement item behaviors for latent effects, enchantments, charges, ranged/ammo, and sell/vendor restrictions in small rule modules.
2. Add isolated skill-gain hooks only after the character-owned skill-state rules are covered.
3. Wire skill caps into combat and magic calculations only after current skill state, gain flow, and formula confidence are explicit.
4. Add key-item item records and unlock/permission validation.
