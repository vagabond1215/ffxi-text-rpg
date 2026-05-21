# FFXI Text RPG

A text-only RPG foundation inspired by Final Fantasy XI systems.

This branch intentionally resets the project around a stable command shell, structured entities, conservative stat engines, parser-backed commands, validation helpers, and implementation-first documentation. Backwards compatibility with the previous UI/save shape is not considered until explicitly reintroduced.

## Running

Open `index.html` in a browser. No build step is required for the browser shell.

## Development

Node 20+ is recommended for tests.

```bash
npm test
```

## Current commands

- `help` - show command list
- `look` - describe the current location
- `character` - show the player summary
- `stats` - show attributes and derived combat stats
- `inventory` - show carried items
- `npcs` - list loaded NPCs
- `enemies` - list loaded enemies
- `inspect <target>` - inspect `player`, `stats`, `inventory`, `npcs`, `enemies`, `state`, or `log`
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
  commands/
    parser.js
  data/
    jobs.js
    races.js
    seedEntities.js
    systemConstants.js
  entities/
    entityFactory.js
  systems/
    battleEngine.js
    statEngine.js
    statusEngine.js
    validation.js
tests/
  commandParser.test.js
  statEngine.test.js
docs/
  ARCHITECTURE.md
  ROADMAP.md
  PIPELINE.md
```

## Implemented foundation

- Text-only browser shell.
- Argument-aware command parser.
- Structured player character entity.
- Structured NPC entity.
- Structured enemy entity.
- Race seed definitions.
- Job seed definitions for standard FFXI player jobs through Rune Fencer.
- Attribute/resource/derived-stat/skill/equipment/currency constants.
- Conservative stat calculation engine.
- Simple battle-state engine.
- Status effect lifecycle engine.
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

## Planning documents

- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `docs/PIPELINE.md`
- `CHANGELOG.md`
