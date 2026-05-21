# FFXI Text RPG

This branch resets the project into a plain text-only browser RPG foundation.

The goal is to preserve useful data and rebuild the game deliberately around a stable, expandable command shell instead of the older graphical/menu-heavy interface.

## Running

Open `index.html` in a browser. No build step is required.

## Current reset state

The active app entry path is now intentionally small:

- `index.html` contains a single terminal-style panel.
- `css/style.css` contains only text-shell styling.
- `js/main.js` bootstraps the text shell.
- `js/text/gameState.js` owns the initial rebuild state.
- `js/text/commandRouter.js` maps typed commands to game actions.
- `js/text/textShell.js` renders command input/output.
- `js/text/save.js` handles localStorage save/load.

## Available commands

- `help`
- `look`
- `character`
- `inventory`
- `log`
- `save`
- `reset`

## Rebuild rules

- Keep the game text based.
- Keep game logic separate from DOM rendering.
- Preserve reusable data modules unless they are clearly obsolete.
- Reintroduce systems one at a time: character creation, zones, travel, inventory, vendors, combat, quests, persistence, then balancing tools.
- Avoid graphical dependencies unless they are strictly test/support tooling.

## Preserved data

Existing data files remain available for salvage and migration, including race, job, item, vendor, monster, zone, combat, and progression-related definitions. Some of those modules may still reflect the old architecture and should be treated as source material until migrated into the new text-first structure.
