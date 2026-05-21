# Research References

This document tracks external references to inspect while rebuilding systems. These are reference targets, not direct dependencies.

## Source quality ladder

1. Official Square Enix / PlayOnline documentation and version updates.
2. High-quality FFXI community wikis for terminology, player-facing mechanics, and cross-links.
3. Community testing/formula research for mechanics that are not officially documented.
4. Open-source server/emulator implementations for structural decomposition and database categories.
5. General MUD/text RPG architecture references for command parsing, tick loops, room graphs, and NPC scripting.

## Current reference targets

### Trusts / AI companions

Reference target: BG Wiki Trust category.

Research notes to verify during implementation:
- Trusts are magic-like alter ego companions.
- Default summon capacity starts at three and can increase through progression/key items.
- Trust magic has cast-time and cooldown concepts.
- Trust usage has restrictions, including aggro/combat/content restrictions.
- Trust stats and level scaling depend on player level and later item level/progression.

Implementation use:
- `trusts` database.
- `trustAi` tick channel.
- summon restrictions.
- party size rules.
- trust role profiles.
- trust recast/cooldown handling.

### Mounts

Reference target: BG Wiki Mounts category and official update notes where available.

Research notes to verify during implementation:
- Mounts need unlock state.
- Mount usage should be restricted by zone/state/content.
- Mounts should interact with travel speed and possibly encounter rules.

Implementation use:
- `mounts` database.
- travel modifiers.
- zone restrictions.
- key item / unlock tracking.

### Crafting / synthesis

Reference targets: official guides, BG Wiki, FFXIclopedia, formula research.

Research notes to verify during implementation:
- Crafting involves recipes, crystals, ingredients, skill, support, HQ chances, failures, and guild-related progression.

Implementation use:
- `crafting` database.
- recipe schema.
- crafting tick channel for timed crafting if desired.
- item/material integration.

### Open-source structural reference

Reference target: LandSandBoat server repository.

Research notes:
- It is an open-source server emulator for Final Fantasy XI.
- Useful structural areas include source, scripts, SQL, navigation meshes, modules, and tooling.
- Treat as a high-level architecture/database-shape reference only.
- Do not copy code into this project unless licensing and design implications are explicitly reviewed.

Implementation use:
- Database category inspiration.
- Server-side decomposition patterns.
- Naming and separation ideas for zones, NPCs, items, spells, mobs, and scripts.

## Research backlog by system

| System | Primary questions |
| --- | --- |
| Zones | What are canonical zone categories, connections, city/wilderness/dungeon rules, and travel gates? |
| Travel | What travel modes exist, what unlocks them, and where are they restricted? |
| Quests | What minimum quest state machine supports prerequisites, objectives, progress, turn-ins, repeatability, and rewards? |
| Achievements | Which achievements should be local milestones versus FFXI-inspired records? |
| Items | What item flags, equipment restrictions, charges, latent effects, enchantments, and stack rules are needed? |
| Key items | Which unlocks are mechanical: maps, mounts, trusts, travel, missions, quest gates? |
| Magic | How should spells model skill, element, MP cost, cast time, recast, target, interruption, and status effects? |
| Loot | How should drop tables handle rates, rare/exclusive rules, quest drops, and treasure modifiers? |
| Leveling | What EXP curve, job level model, skill caps, and level cap gates should be approximated first? |
| Trusts | What role profiles and AI rules are necessary for useful companions? |
| Crafting | What recipe and HQ/failure model is sufficient for text-first gameplay? |
| Mounts | Which zones allow mounts and how do mounts affect travel time/encounter rules? |
