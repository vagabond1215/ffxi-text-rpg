# Changelog

All notable reset-branch changes are tracked here.

## Unreleased

### Added
- Text-only browser shell with command input/output.
- Canvas-first browser shell with one visible `#game-canvas` host.
- Canvas-rendered title/status bar, command sidebar, output log, context/history panel, and bottom command input.
- Pure canvas UI action registry, layout, hit-testing, keyboard input, command history, and renderer modules.
- Legacy DOM slim top bar with compact branding, active character/job/location status, last-command feedback, and quick action buttons.
- Legacy DOM sidebar panels for active character, resources, location/status, wallet/title, character slots, command chips, main menu actions, and full menu buttons.
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
- Explicit version manifest fields for app, account save, game state, data, benchmark, and system versions.
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
- Common item schema helpers for item kinds, normalization, stackability, max stack, source, flags, modifiers, and item display.
- Expanded item/equipment schema helpers for static template metadata, family/archetype/subtype, allowed slots, weapon category/delay, requirements, normalized flags, effects, latent/enchantment/augment scaffolds, charges, and confidence/source notes.
- Stack-aware inventory insertion and transfer stacking for stackable consumables, materials, and misc items.
- Split-stack overflow protection so failed partial stacks do not mutate existing quantities.
- Atomic item transfer command between containers with access, capacity, item-kind, and stack-rule checks.
- Equip/unequip commands using Inventory and accessible Wardrobes.
- Equipment eligibility validation for kind, slot, main-job level, allowed jobs, allowed races, allowed sexes, simple key item/quest flag requirements, two-handed/offhand conflicts, and ranged/ammo slot constraints.
- Text-first `item <query>` and `inspect item <query>` commands for accessible inventory, wardrobe, and equipped item inspection.
- Starter equipment catalog with conservative stat modifiers, placeholder weapon delay metadata, and intentional-simplification requirement notes.
- Sparse skill rank/cap foundation with `getSkillCap` and `getEffectiveSkill` helpers for later combat and magic skill work.
- Character-owned skill progression storage under `player.progression.skills[skillId]`.
- Text-first `skills`, `skill <id>`, `inspect skills`, and `inspect skill <id>` command output.
- Validation for flat character-owned skill ids and non-negative integer skill values, including explicit rejection of nested job-keyed skill maps.
- Equipment catalog validation for requirement shapes, unknown jobs/races/slots, array-based flags/effects, modifier keys, and required confidence/source metadata.
- Equipped gear modifiers feeding into the stat/combat profile.
- Core constants for attributes, resources, elements, derived stats, skills, equipment slots, currencies, entity types, and status categories.
- Race seed definitions for Hume, Elvaan, Tarutaru, Mithra, and Galka.
- Job seed definitions for all standard FFXI player jobs through Rune Fencer.
- Player, NPC, and enemy entity factories.
- Conservative stat engine for attributes, resources, skills, derived stats, equipment modifiers, and resistances.
- Simple battle-state engine with combatants, HP/MP/TP, deterministic RNG injection, hit chance, basic physical damage, victory/defeat state, and battle log.
- Combat action command layer for attack, placeholder weapon skills, and placeholder casting.
- Starter loot table data and seed enemy loot table references.
- Battle reward resolution for victory EXP, gil, deterministic loot rolls, Inventory insertion, failed loot storage reporting, and duplicate payout prevention.
- Status effect engine with apply/remove/advance behavior and basic tick support.
- Game-state and entity validation helpers.
- Seed NPCs and enemies for early command-shell verification.
- `inspect <target>` command for player, stats, inventory, NPC, enemy, state, log, version, systems, database, maps, zone, atlas, grid, travel, controls, and storage inspection.
- `validate` command for current state validation.
- `version`, `systems`, `databases`, `tick`, `maps`, `map`, `zones`, `zone`, `atlas`, `grid`, `move`, `controls`, `travel`, `wait`, `containers`, `container`, `transfer`, `equip`, `unequip`, `equipSources`, `here`, `talk`, `shop`, `buy`, `guild`, `quest`, `discovered`, `fastpoi`, and `zonefast` commands.
- Node test coverage for command parsing, validation, entity factories, stat calculations, baseline pipeline, versioning, database registry, tick dispatch, zone graph, starter maps, world-data validation, travel flow, atlas discovery, controls, aggro checks, POI discovery, shop transactions, inventory transfers, equipment commands, save accounts, slash commands, UI panel helpers, deterministic RNG, battle rewards, item schema/stacking, and basic battle flow.
- Node test coverage for canvas UI action mapping, clickable layout bounds, hit testing, command dispatch, keyboard input, and command history.
- Node test coverage for equipment eligibility rejections, atomic failed equips, two-handed/offhand conflicts, item inspection, equipment catalog validation, and skill cap helpers.
- Architecture, roadmap, baseline pipeline, system catalog, research reference, and thread handoff documents for the rebuild.

### Changed
- Moved the earlier DOM browser shell into an app frame with a slim top bar above the sidebar/terminal grid.
- Replaced the active browser entry path with a canvas-first shell; previous DOM panel helpers are no longer the core visible UI.
- Preserved FFXI macro-style slash commands through the browser slash router so the FFXI command adapter can handle them.
- Aligned character-creation docs and slash-router tests with the current name-first, confirmation-based creator flow.
- Clarified version naming with `VERSION.accountSave` and `VERSION.gameState`; `VERSION.save` remains a temporary alias for account save version.
- Replaced the old graphical/menu-heavy entry path with a minimal text-first foundation.
- Replaced the UI-facing bare-command model with slash commands.
- Updated legacy sidebar buttons to emit slash commands and include main menu, new character, characters, save, containers, and commands actions.
- Updated shell intro text to guide users toward `/menu`, `/newcharacter`, `/commands`, and `/help`.
- Rebuilt initial game state around structured player, NPC, enemy, place, coordinate, atlas, map, travel, inventory, item, POI, and account-save state.
- Refactored command routing to operate on parsed command objects instead of whole-command strings.
- Updated app/package version to `0.4.1`, account save version to `3`, game state version to `2`, data version to `12`, and codename to `Slash UI Account Saves`.
- Updated data/system version tracking for item schema, equipment catalog, equipment eligibility, item inspection, validation, skill caps, and skill progression.
- Added `canvasUi` system version tracking.
- Updated `getEffectiveSkill` to read character-owned skill values and report missing skills as current value `0` against the active job cap.
- Refreshed README, roadmap, and handoff documentation for the current post-0.5 foundation state.

### Removed
- Active panzoom dependency from the text-only branch.
- Active map/image/popup/scale/orientation hooks from the reset entry path.
- Duplicate `docs/PIPELINE.md` after merging its checklist guidance into `docs/BASELINE_PIPELINE.md`.
- UI reliance on bare commands for normal gameplay input.

### Notes
- Backwards compatibility with the old browser UI and old save shape is intentionally not preserved beyond the current raw-save migration path.
- `base64-json-v1` save storage is encoded, not strong encryption.
- Current formulas are conservative approximations until exact researched formulas are migrated deliberately.
- `skillCaps.js` remains scaffold-only and is not wired into combat or magic calculations.
- Current recommended next pass is item behavior modules plus conservative skill plumbing: item behavior rules, isolated skill-gain hooks, skill-cap formula wiring, and tests.
