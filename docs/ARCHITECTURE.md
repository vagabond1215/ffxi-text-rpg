# Architecture

This branch is a text-first rebuild. The goal is a stable foundation that can absorb researched FFXI-style systems without dragging forward old UI assumptions.

## Principles

1. Text first. The browser shell renders text and accepts commands only.
2. Logic does not touch the DOM.
3. Backwards compatibility is not required unless explicitly reintroduced later.
4. Data, state, and engines should stay separate.
5. Exact formulas are migrated only when they are sourced and understood.
6. Conservative approximations are acceptable when clearly marked and easy to replace.

## Current runtime flow

```text
index.html
  -> js/main.js
      -> loadGame() or createInitialState()
      -> createCommandRouter(state)
      -> createTextShell(...)
```

The command shell calls command handlers. Command handlers read or mutate the game state and return text.

## Current module layout

```text
js/text/
  commandRouter.js        command parsing and dispatch
  gameState.js            initial state and text descriptions
  save.js                 localStorage adapter
  textShell.js            DOM shell only

  data/
    systemConstants.js    attributes, skills, slots, currencies, categories
    races.js              race seed definitions
    jobs.js               job seed definitions
    seedEntities.js       seed NPCs and enemies

  entities/
    entityFactory.js      player, NPC, enemy constructors

  systems/
    statEngine.js         attributes, resources, skills, derived stats
    battleEngine.js       battle state and basic attack flow
    statusEngine.js       status effect lifecycle
```

## Entity model

### Player

Player entities own identity, jobs, progression, wallet, equipment, inventory, statuses, flags, resources, and calculated combat profile.

### NPC

NPC entities are service/dialogue/quest/shop holders. They are not combat actors by default.

### Enemy

Enemy entities are combat actors with level, family, ecosystem, aggro flags, skills, loot hooks, EXP value, statuses, resources, and calculated combat profile.

## Engine boundaries

### Stat engine

The stat engine calculates:

- attributes
- HP/MP/TP maxima
- skills
- derived combat stats
- elemental resistances

The current formulas are intentionally conservative placeholders.

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

The current action support is basic physical attack only.

### Status engine

The status engine owns:

- status creation
- stacking behavior
- replacement/ignore/stack rules
- duration advancement
- tick effects

## Save compatibility

The reset state uses `version: 2`. Older saves are not guaranteed to load correctly. During this rebuild, users should clear local saves when state shape changes.

## Migration notes

Existing legacy data under `/data` may be reused, but each piece should be migrated deliberately into the new text-first schema. Do not blindly import legacy modules into new systems unless they are pure data and do not carry UI assumptions.
