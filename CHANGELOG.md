# Changelog

## 0.9.300.3 — Novice Elemental Resolution Breadth

- Migrated the eight existing novice Elemental Form attacks—Cinder Bolt, Stone Shards, Gale Cutter, Tide Needle, Storm Jolt, Rime Splinters, Sunlance, and Gloam Spike—to explicit unified combat-resolution metadata.
- Each migrated spell now uses its canonical element, magic accuracy, magic-defense resistance, `elementSource: ability`, and 2-second post-action recovery while retaining existing activation, MP cost, cooldown, potency, scaling, capability, and stable IDs.
- Preserved Sunlance MND scaling and the existing INT scaling of the other seven novice attacks.
- Kept executable ability count at 41; no new ability/capability, state family, combat clock, task owner, or target-geometry system was added.
- Deliberately left Tempest Ring, Thunder Cage, Umbral Well, and the rest of the adept elemental tranche unmigrated because their names imply richer geometry/control/field semantics than single-target damage metadata can honestly provide.
- Advanced Product 0.9.300.2 -> 0.9.300.3 and Data 69 -> 70; Game State remains 20 and Package remains 0.9.300.
- Behavioral/data freeze `32f0ee268525f096f40421414af180e90a724397` passed Repository Audit, 870/870 tests, Census, Benchmark 3, Benchmark Sample, and Pages via Check #1981 / run `33515422352` and Pages #2111 / run `33515422056`.
- No subsequent 0.9.300 packet is selected automatically.

## 0.9.300.2 — Character Affinity & Kata Substitution

- Added versioned character-owned elemental affinity ranks under `player.progression.affinities` for the eight canonical elements, independent of active discipline and spell knowledge.
- Added explicit affinity gain/set/read/validation operations without introducing a separate affinity XP economy, clock, or task owner.
- Added Rimepoint Thrust (Ice dagger) and Cinder-Braced Drive (Fire staff) as two authored affinity-gated kata substitutions requiring both weapon proficiency and earned affinity.
- Kept physical kata defaults viable and made runtime selection fall back safely when a configured substitution is no longer affinity-eligible.
- Widened the existing melee attack profile only enough to pass structured element/channel/resistance metadata into `combatResolutionEngine`; no duplicate elemental-kata resolver was added.
- Advanced Game State 19 -> 20 for required durable affinity state and Data 68 -> 69 for authored substitution definitions. Kata configuration remains version 2; battle kata state remains version 1; Package remains 0.9.300.
- Behavioral freeze `cbbec82e7d908c32dcb849e13f59461c83b6637a` passed Repository Audit, 867/867 tests, Census, Benchmark 3, Benchmark Sample, and Pages via Check #1956 / run `33477009897` and Pages #2086 / run `33477008886`.
- No subsequent 0.9.300 packet is selected automatically.

## 0.9.300.1 — Current Melee Kata Breadth

- Opened `0.9.300 Advanced Combat / Training` with a bounded extension of the already-proven weapon-kata authority.
- Added original automatic kata families for axe, staff, and club, bringing current equipped melee kata coverage to dagger, sword, axe, staff, and club.
- Gave the new families distinct accuracy, penetration, coefficient, and recovery profiles without adding ability/capability filler or new equipment.
- Advanced weapon-kata configuration version 1 -> 2 and Game State 18 -> 19 because player progression now requires durable selections for the additional families; encounter-local kata record shape remains version 1.
- Advanced Data 67 -> 68 for authored kata definitions and Package 0.9.200 -> 0.9.300; no supported-save migration was added.
- Behavioral freeze `ccd8d5ba6cc02928c0b93755b42c4f1f6aca0aef` passed 860/860 tests plus the full hosted gate and Pages.
- Packet 2 — Character Affinity & Kata Substitution Foundation — remains queued/not started.

## 0.9.200.6 — Brasshaven Redstone Combat Training

- Added Marshal Varric Stone's bounded Forge-Road training service at the existing Brasshaven Market Ring contact, delegating technique learning to the existing capability authority.
- Added player-facing Training / Learn actions and command adapters without a new training state family, clock, or timed-task owner.
- Added the playable B5 Brasshaven -> South Redstone integration proof across B1 unified resolution, B2 party attention, B3 loadout/armor pressure, and B4 cadence/kata/ranged ammunition.
- Fixed current-schema persistence for partially consumed stackable ammunition in the canonical ammo equipment slot while retaining strict non-stackable invariants for ordinary equipment.
- Fixed locality action presentation so an active POI remains visible and distinct same-POI/capability actions are not incorrectly deduplicated.
- Advanced Data 66 -> 67 for authored Varric/POI training metadata; Game State remains 18 and no supported-save migration was added.
- Behavioral freeze `764faae437f3bc58d4d55a7e46dc4921a4a85c05` passed 855/855 tests plus the full hosted gate and Pages.
- Closed `0.9.200 Adventure Vertical Slices`; `0.9.300 Advanced Combat / Training` remains queued/not started.

## 0.9.200.5 — Weapon Cadence, Ranged Action, and Minimal Kata

- Added one weapon-delay conversion authority and routed player/companion basic-attack recovery through equipped weapon cadence.
- Added first-class ranged attacks using ranged attack/accuracy, equipped ranged weapon/ammunition, structured action evidence, and exactly one ammo unit per attempted shot.
- Added original Braided Sling and Rounded Sling Stones as the minimum ranged proof.
- Added persisted proficiency-gated dagger/sword kata configuration, encounter-local sequence cursors, a configurable dagger opening, and Recenter Cut manual reset interaction.
- Consumed B3 weapon-set sequence-reset intent after successful loadout transitions.
- Advanced Game State 17 -> 18 and Data 65 -> 66 independently; no supported-save migration was added.
- Behavioral freeze `0c3ef0a2720850d362cea06dffdbfd452f5a0c19` passed 852/852 tests plus the full hosted gate and Pages.

## 0.9.200.4 — Combat Loadout Transitions

- Added `combatLoadoutEngine` as the canonical active-combat equipment transition owner using fictional-time tasks and exactly-once reconciliation.
- Added directional stow/draw/ready handling metadata for representative equipment and distinguished weapon-set from full-equipment transitions.
- Blocked direct in-combat equipment mutation, attacks, legacy combat actions, and canonical ability activation during a transition while preserving ability cooldown timestamps.
- Added B2 Aggro/Focus/Fixation armor-pressure legality, conservative handling for nonexistent LOS/pursuit state, hard-disable cancellation, and root/battle equipment coherence validation.
- Advanced Game State 16 -> 17 and Data 64 -> 65 independently. Behavioral freeze `3ef9a1c48f22911fe90a08a60c03a72c09d7fd67` passed 844/844 tests plus the full hosted gate and Pages.

## 0.9.200.3 — Enemy Attention Foundation

- Added durable active-battle enemy attention with hostile-specific Enmity, normalized Focus, nonlinear target-selection weighting, sticky Aggro, Fixation/Priority, and fictional-time decay/floors.
- Routed representative combat-action pressure into the shared attention contract without creating a second battle authority.
- Advanced Game State 15 -> 16 because attention affects resumable battle outcomes; Data remains 64 and no supported-save migration is added.
- Added deterministic three-actor, stickiness, fixation, decay/floor, and persistence-link coverage; behavioral freeze passed 837/837 tests plus the full hosted gate.


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
- Encoded local account/character save model under `ffxiTextRpgAccounts` with active session state under `ffxiTextRpgAccountSession`.
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
- San d’Oria alphanumeric coordinate topology for Southern San d’Oria, Northern San d’Oria, Port San d’Oria, Chateau d’Oraguille, and required connected placeholders.
- Direction-aware navigation engine with movement timing metadata, topology edges, exit transitions, and stop behavior.
- Canvas 3x3 compass rose with arrow buttons, center stop/rest action, direct navigation intents, and Auto Run toggle state.
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
- Runtime item behavior helpers for conservative sell eligibility/value, latent metadata, enchantment metadata, charge metadata, and ranged/ammo metadata inspection.
- Conservative shop selling from Inventory with current-shop requirements, `noSell`/key-item/zero-value rejection, stack quantity removal, and wallet credit after successful removal.
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
- Conservative skill-gain resolver helpers for main-hand, ranged/ammo, and placeholder spell skill inference.
- Deterministic +1 learned skill hooks for basic attacks, placeholder weapon skills, and placeholder spell casts, with concise battle-log output only when a skill increases.
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
- Node test coverage for command parsing, validation, entity factories, stat calculations, baseline pipeline, versioning, database registry, tick dispatch, zone graph, starter maps, world-data validation, travel flow, atlas discovery, controls, aggro checks, POI discovery, shop transactions, inventory transfers, equipment commands, save accounts, slash commands, UI panel helpers, deterministic RNG, battle rewards, item schema/stacking, basic battle flow, and conservative skill gains from combat actions.
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
- Updated app/package version to `0.4.4`, account save version to `4`, game state version to `3`, data version to `13`, and codename to `Conservative Skill Gains`.
- Replaced San d’Oria placeholder numeric city grids with alphanumeric topology coordinates and direction-aware exits.
- Updated data/system version tracking for item schema, item behavior, equipment catalog, equipment eligibility, item inspection, shop transactions, validation, skill caps, skill progression, and combat actions.
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
- `skillCaps.js` remains formula-scaffold-only: skill gains can clamp against current job caps, but learned/effective skill values are not wired into combat or magic calculations.
- Current recommended next pass is conservative formula and item behavior application planning: skill-cap formula wiring and metadata behavior application should remain scoped and tested. Latent/enchantment/charge/ranged-ammo behavior remains metadata-only until action semantics are explicit.
