# FFXI Text RPG

A text-only RPG foundation inspired by Final Fantasy XI systems.

This branch intentionally resets the project around a stable command shell, structured entities, conservative stat engines, parser-backed commands, validation helpers, version tracking, benchmarks, a database registry, seeded world graph, coordinate atlas, travel scaffold, text HUD/control metadata, and implementation-first documentation. Backwards compatibility with the previous UI/save shape is not considered until explicitly reintroduced.

## Running

Open `index.html` in a browser. No build step is required for the browser shell.

## Development

Node 20+ is recommended for tests and benchmarks.

```bash
npm test
npm run benchmark
npm run check
```

## Current commands

- `help` - show command list
- `look` - describe the current location and current grid
- `character` - show the player summary
- `stats` - show attributes and derived combat stats
- `inventory` - show carried items
- `npcs` - list loaded NPCs
- `enemies` - list loaded enemies
- `zones` - list known seeded places
- `zone [id/name]` - inspect current or named zone
- `atlas [id/name]` - show discovered zone atlas grids; unknown grids remain hidden as `?`
- `grid` - inspect the current grid and known local spawn pressure
- `move <direction>` - move within the current zone grid using `n`, `ne`, `e`, `se`, `s`, `sw`, `w`, or `nw`
- `controls` - show resource bars, live tick bar, 8-way keypad, and action control groups
- `travel <destination>` - start direct travel to a connected zone
- `wait [seconds]` - manually advance time for travel/tick testing
- `databases` - list planned/seeded/implemented data registries
- `version` - show app/save/data/benchmark versions
- `systems` - show per-system version tracking
- `tick` - inspect the live tick engine baseline
- `inspect <target>` - inspect `player`, `stats`, `inventory`, `npcs`, `enemies`, `zone`, `atlas`, `grid`, `travel`, `controls`, `state`, `log`, `version`, `systems`, or `databases`
- `validate` - validate the current game state
- `log [limit]` - show recent command history
- `save` - save local state if validation passes
- `reset` - clear local save and reload

Command aliases are supported for common short forms, such as `?`, `l`, `char`, `status`, `stat`, `i`, `inv`, `npc`, and `enemy`.

## Current architecture

```text
index.html
css/style.css
js/main.js
js/text/
  commandRouter.js
  gameState.js
  save.js
  textShell.js
  version.js
  commands/
    parser.js
  data/
    actionControls.js
    databaseRegistry.js
    jobs.js
    places.js
    races.js
    seedEntities.js
    systemConstants.js
  entities/
    entityFactory.js
  systems/
    aggroEngine.js
    atlasEngine.js
    battleEngine.js
    statEngine.js
    statusEngine.js
    tickEngine.js
    travelEngine.js
    validation.js
scripts/
  benchmark.js
tests/
  atlasAndControls.test.js
  commandParser.test.js
  pipeline.test.js
  statEngine.test.js
  travelEngine.test.js
docs/
  ARCHITECTURE.md
  BASELINE_PIPELINE.md
  RESEARCH_REFERENCES.md
  ROADMAP.md
  SYSTEM_CATALOG.md
```

## Implemented foundation

- Text-only browser shell.
- Argument-aware command parser.
- Structured player character entity.
- Structured NPC entity.
- Structured enemy entity.
- Race seed definitions.
- Job seed definitions for standard FFXI player jobs through Rune Fencer.
- Seeded places, coordinate systems, and zone connections.
- Zone atlas discovery where unvisited grids remain unknown until visited.
- 8-way grid movement inside zones.
- Foot-travel aggro risk scaffold based on grid spawn rules, spawn count, and aggro types.
- Text HUD/control metadata for HP/MP/TP bars, live tick bar, 8-way nav keypad, and action groups.
- Direct travel engine with restrictions, arrival coordinates, atlas recording, and manual time advancement.
- Attribute/resource/derived-stat/skill/equipment/currency constants.
- Conservative stat calculation engine.
- Simple battle-state engine.
- Status effect lifecycle engine.
- Live tick engine scaffold.
- Version manifest and system version tracking.
- Database registry for enemies, NPCs, places, zones, travel, quests, achievements, items, key items, magic, loot, leveling, trusts, crafting, mounts, and tick channels.
- Baseline benchmark harness.
- Game-state validation helpers.
- Safe save/load behavior that rejects incompatible local saves.
- Seed NPCs and enemies.
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

## Planning documents

- `docs/ARCHITECTURE.md`
- `docs/BASELINE_PIPELINE.md`
- `docs/RESEARCH_REFERENCES.md`
- `docs/ROADMAP.md`
- `docs/SYSTEM_CATALOG.md`
- `CHANGELOG.md`
