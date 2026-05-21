# Changelog

All notable reset-branch changes are tracked here.

## Unreleased

### Added
- Text-only browser shell with command input/output.
- Argument-aware command parser with aliases, quoted arguments, positional args, and `--named=value` args.
- Local save/load adapter for reset-state persistence.
- Save validation that rejects incompatible or malformed local state.
- Core constants for attributes, resources, elements, derived stats, skills, equipment slots, currencies, entity types, and status categories.
- Race seed definitions for Hume, Elvaan, Tarutaru, Mithra, and Galka.
- Job seed definitions for all standard FFXI player jobs through Rune Fencer.
- Player, NPC, and enemy entity factories.
- Conservative stat engine for attributes, resources, skills, derived stats, and resistances.
- Simple battle-state engine with combatants, HP/MP/TP, hit chance, basic physical damage, victory/defeat state, and battle log.
- Status effect engine with apply/remove/advance behavior and basic tick support.
- Game-state and entity validation helpers.
- Seed NPCs and enemies for early command-shell verification.
- `inspect <target>` command for player, stats, inventory, NPC, enemy, state, and log inspection.
- `validate` command for current state validation.
- Node test coverage for command parsing, validation, entity factories, stat calculations, and basic battle flow.
- Architecture, roadmap, and pipeline documents for the rebuild.

### Changed
- Replaced the old graphical/menu-heavy entry path with a minimal text-first foundation.
- Expanded command shell with `stats`, `npcs`, `enemies`, `inspect`, and `validate` commands.
- Rebuilt initial game state around structured player, NPC, and enemy entities.
- Refactored command routing to operate on parsed command objects instead of whole-command strings.

### Removed
- Active panzoom dependency from the text-only branch.
- Active map/image/popup/scale/orientation hooks from the reset entry path.

### Notes
- Backwards compatibility with the old browser UI and save shape is intentionally not preserved.
- Current formulas are conservative approximations until exact researched formulas are migrated deliberately.
