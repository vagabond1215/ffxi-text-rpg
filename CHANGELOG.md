# Changelog

All notable reset-branch changes are tracked here.

## Unreleased

### Added
- Text-only browser shell with command input/output.
- Slim top bar with compact branding, active character/job/location status, last-command feedback, and quick action buttons.
- Populated sidebar panels for active character, resources, location/status, wallet/title, character slots, command chips, main menu actions, and full menu buttons.
- Slash-command UI wrapper requiring `/` commands in the browser shell.
- `/menu`, `/commands`, `/help`, `/newcharacter`, `/characters`, `/load`, `/save`, `/account`, and `/reset` commands.
- Prompt-based character creation from `/newcharacter`, with natural non-slash answers while prompts are active.
- Slash-router tests for FFXI macro-style browser commands such as `/macrohelp`, `/ma`, `/ws`, and `/item`.
- Encoded local account/character save model under `ffxiTextRpgAccount`.
- Multiple local character save slots with character summaries and last-active-character tracking.
- Legacy raw `ffxiTextRpgSave` migration into the encoded account save model.
- Account/save tests for encoding, slot listing, character loading, active character restore, save clearing, and inventory reference relinking.
- Slash-router tests for bare-command rejection, menu/help output, gameplay forwarding, account commands, and character creation prompts.
- Argument-aware command parser with aliases, quoted arguments, positional args, and `--named=value` args.
- Version manifest for app, save, data, benchmark, and system versions.
- Baseline benchmark harness for stat profile calculation, enemy profiles, battle attacks, tick dispatch, and direct travel route lookup.
- Database registry covering players, NPCs, enemies, places, zone connections, travel, quests, achievements, items, key items, magic, abilities, loot, leveling, trusts, crafting, mounts, status effects, and ticks.
- Live tick engine scaffold with subscriptions, manual ticks, start/stop, enabled state, and standard tick channels.
- Three starter city clusters: San d’Oria, Bastok, and Windurst.
- Starter city maps, starter outdoor-region maps, and starter dungeon-hook maps.
- Seeded places, coordinate grids, map IDs, start coordinates, departure coordinates, arrival coordinates, and zone connections for San d’Oria/Ronfaure, Bastok/Gustaberg, and Windurst/Sarutabaruta.
- Starter NPC guard seeds for San d’Oria, Bastok, and Windurst.
- Starter-region enemy seeds and grid spawn hooks for Ronfaure, Gustaberg, Sarutabaruta, Ghelsba, Zeruhn Mines, and Outer Horutoto Ruins.
- World-data validation for map references, place references, connection endpoints, connection grids, spawn grids, place start coordinates, POIs, shop catalogs, guild services, quest hooks, and inventory containers.
- `maps` and `map <id>` commands for starter map inspection.
- Zone atlas discovery where unvisited grids are unknown until visited and visited grids become visible through the atlas.
- Text HUD/control metadata for HP/MP/TP resource bars, visual tick timer bar, 8-button navigation keypad, and action control groups.
- Grid movement commands using 8-way navigation.
- Foot-travel aggro scaffold based on grid spawn rules, count, and aggro type such as sight or sound.
- Seed aggressive enemies for grid-spawn testing.
- Direct travel engine with connection lookup, restrictions, active travel state, manual time advancement, arrival coordinates, atlas recording, and zone descriptions.
- Starter-city points of interest with current-grid contextual actions.
- POI discovery and same-zone POI fast travel.
- Starter shop catalogs, guild service hooks, and quest/mission hooks.
- Shop buying into Inventory through the container system.
- Inventory container framework for Inventory, Mog Safe, Mog Safe 2, Storage, Mog Locker, Mog Satchel, Mog Sack, Mog Case, and Mog Wardrobes 1-8.
- Mog House-only access rules for Mog Safe and Storage.
- Furniture-derived Storage capacity for Mog House furniture.
- Atomic item transfer command between containers with access, capacity, and item-kind checks.
- Equip/unequip commands using Inventory and accessible Wardrobes.
- Starter equipment catalog with conservative stat modifiers.
- Equipped gear modifiers feeding into the stat/combat profile.
- Core constants for attributes, resources, elements, derived stats, skills, equipment slots, currencies, entity types, and status categories.
- Race seed definitions for Hume, Elvaan, Tarutaru, Mithra, and Galka.
- Job seed definitions for all standard FFXI player jobs through Rune Fencer.
- Player, NPC, and enemy entity factories.
- Conservative stat engine for attributes, resources, skills, derived stats, equipment modifiers, and resistances.
- Simple battle-state engine with combatants, HP/MP/TP, hit chance, basic physical damage, victory/defeat state, and battle log.
- Combat action command layer for attack, placeholder weapon skills, and placeholder casting.
- Status effect engine with apply/remove/advance behavior and basic tick support.
- Game-state and entity validation helpers.
- Seed NPCs and enemies for early command-shell verification.
- `inspect <target>` command for player, stats, inventory, NPC, enemy, state, log, version, systems, database, maps, zone, atlas, grid, travel, controls, and storage inspection.
- `validate` command for current state validation.
- `version`, `systems`, `databases`, `tick`, `maps`, `map`, `zones`, `zone`, `atlas`, `grid`, `move`, `controls`, `travel`, `wait`, `containers`, `container`, `transfer`, `equip`, `unequip`, `equipSources`, `here`, `talk`, `shop`, `buy`, `guild`, `quest`, `discovered`, `fastpoi`, and `zonefast` commands.
- Node test coverage for command parsing, validation, entity factories, stat calculations, baseline pipeline, versioning, database registry, tick dispatch, zone graph, starter maps, world-data validation, travel flow, atlas discovery, controls, aggro checks, POI discovery, shop transactions, inventory transfers, equipment commands, save accounts, slash commands, UI panel helpers, and basic battle flow.
- Architecture, roadmap, baseline pipeline, system catalog, research reference, and thread handoff documents for the rebuild.

### Changed
- Moved the browser shell into an app frame with a slim top bar above the sidebar/terminal grid.
- Preserved FFXI macro-style slash commands through the browser slash router so the FFXI command adapter can handle them.
- Aligned character-creation docs and slash-router tests with the current name-first, confirmation-based creator flow.
- Replaced the old graphical/menu-heavy entry path with a minimal text-first foundation.
- Replaced the UI-facing bare-command model with slash commands.
- Updated sidebar buttons to emit slash commands and include main menu, new character, characters, save, containers, and commands actions.
- Updated shell intro text to guide users toward `/menu`, `/newcharacter`, `/commands`, and `/help`.
- Rebuilt initial game state around structured player, NPC, enemy, place, coordinate, atlas, map, travel, inventory, POI, and account-save state.
- Refactored command routing to operate on parsed command objects instead of whole-command strings.
- Updated app/package version to `0.4.1`, save version to `3`, data version to `7`, and codename to `Slash UI Account Saves`.
- Refreshed README, architecture, roadmap, and handoff documentation for the current repo state.

### Removed
- Active panzoom dependency from the text-only branch.
- Active map/image/popup/scale/orientation hooks from the reset entry path.
- Duplicate `docs/PIPELINE.md` after merging its checklist guidance into `docs/BASELINE_PIPELINE.md`.
- UI reliance on bare commands for normal gameplay input.

### Notes
- Backwards compatibility with the old browser UI and old save shape is intentionally not preserved beyond the current raw-save migration path.
- `base64-json-v1` save storage is encoded, not strong encryption.
- Current formulas are conservative approximations until exact researched formulas are migrated deliberately.
- Current recommended next pass is version naming cleanup, then deterministic combat RNG before battle rewards.
