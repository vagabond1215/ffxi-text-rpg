# Roadmap

This roadmap turns the text-only reset into a stable expandable RPG foundation. Backwards compatibility is intentionally out of scope until explicitly restored.

## Version tracks

| Version | Theme | Gate |
| --- | --- | --- |
| 0.2.x | Foundation pipeline, version tracking, benchmarks, registries | Tests, benchmark harness, docs |
| 0.3.x | Places, zone connections, travel restrictions, tick-based travel | Zone graph tests and travel benchmark |
| 0.4.x | Character creation, items, key items, inventory, equipment, leveling | Save/schema version review |
| 0.5.x | Combat loop, enemies, loot, magic basics, enemy AI | Battle benchmarks and deterministic combat tests |
| 0.6.x | Quests, trusts, enmity, party AI, progression flags | Quest and trust AI tests |
| 0.7.x | Achievements, missions, skillchains, magic bursts, reputation | Formula confidence documentation |
| 0.8.x | Crafting, mounts, advanced travel/economy | Crafting and travel benchmark coverage |

## Phase 0: Reset shell

Status: mostly complete.

- [x] Strip active graphical UI entry path.
- [x] Add text command shell.
- [x] Add local save/load adapter.
- [x] Add README and changelog.
- [x] Add basic dev package metadata and tests.

## Phase 1: Entity foundation

Status: mostly complete.

- [x] Define player, NPC, and enemy entities.
- [x] Define identity, job, equipment, wallet, progression, status, and combat containers.
- [x] Add seed NPCs and enemies.
- [x] Add conservative stat engine.
- [x] Add status engine.
- [x] Add simple battle-state engine.
- [x] Add schema validation helpers.
- [x] Add command parser with arguments instead of whole-command matching.
- [x] Add version manifest and system version map.
- [x] Add database registry for all major planned systems.
- [x] Add live tick engine scaffold.
- [x] Add baseline benchmark harness.
- [x] Add baseline pipeline, system catalog, and research reference docs.
- [ ] Add state migration/reset tooling.

## Phase 2: Character creation and inspection

Target: 0.4.x.

- [ ] Character creation flow: name, race, sex, nation, main job.
- [ ] Job list and race list commands.
- [ ] Support job unlock placeholder.
- [ ] Level and EXP containers.
- [ ] Full character sheet output.
- [ ] Equipment sheet output.

## Phase 3: World graph, zones, and travel

Target: 0.3.x.

- [ ] Places database: cities, wilderness, dungeons, interiors, landmarks.
- [ ] Zone schema with region, type, danger level, restrictions, services, map unlocks.
- [ ] Zone connection schema with directionality, travel time, mode, and restrictions.
- [ ] Travel restrictions: level, key item, quest flag, nation/rank, mount permission, combat state, content lock.
- [ ] Travel command.
- [ ] Tick-based travel progress.
- [ ] Zone inspection command.
- [ ] Travel benchmark for zone graph lookup.

## Phase 4: Inventory, items, key items, and equipment

Target: 0.4.x.

- [ ] New item schema.
- [ ] Key item schema for unlocks and permissions.
- [ ] Inventory stack handling.
- [ ] Equipment validation by slot/job/race/level.
- [ ] Stat aggregation from equipment.
- [ ] Item flags: rare, exclusive, key item, no sell, latent, enchantment, charges.
- [ ] Item command inspection.
- [ ] Equipment command inspection.

## Phase 5: Leveling, skills, and progression

Target: 0.4.x to 0.5.x.

- [ ] EXP tables and level-up rules.
- [ ] Job-level state for all jobs.
- [ ] Level cap / limit break placeholders.
- [ ] Combat and magic skill caps.
- [ ] Skill gain hooks.
- [ ] Progression flags for maps, teleport points, mounts, trusts, quests, missions, achievements.

## Phase 6: Combat, enemies, loot, and drops

Target: 0.5.x.

- [ ] Encounter command.
- [ ] Target selection.
- [ ] Player attack command.
- [ ] Enemy AI turn.
- [ ] Battle tick integration.
- [ ] EXP rewards.
- [ ] Loot table schema.
- [ ] Drop roll engine.
- [ ] Death/KO flow.
- [ ] Simple rest/recovery flow.

## Phase 7: Magic, abilities, and status systems

Target: 0.5.x to 0.7.x.

- [ ] Magic database.
- [ ] Spell schema: skill, element, MP cost, cast time, recast, target, effect.
- [ ] Cast command.
- [ ] Cast-time tick integration.
- [ ] Recast timers.
- [ ] Interruption rules.
- [ ] Job traits schema.
- [ ] Job abilities schema.
- [ ] Weapon skills.
- [ ] TP return model.
- [ ] Skillchains.
- [ ] Magic bursts.
- [ ] Food/song/roll/samba stacking rules.

## Phase 8: Quests, achievements, missions, and reputation

Target: 0.6.x to 0.7.x.

- [ ] Quest database.
- [ ] Quest state machine: unavailable, available, active, readyToTurnIn, completed, repeatableCooldown.
- [ ] Quest objectives: talk, kill, collect, travel, craft, unlock, inspect.
- [ ] Quest rewards: EXP, gil, items, key items, titles, fame, unlocks.
- [ ] Achievements database.
- [ ] Achievement triggers.
- [ ] Nation mission/rank progression.
- [ ] Fame/reputation containers.

## Phase 9: Trusts and AI companions

Target: 0.6.x.

- [ ] Trust database.
- [ ] Trust unlock key items/flags.
- [ ] Party slot rules.
- [ ] Trust summon/dismiss commands.
- [ ] Trust role profiles: tank, healer, melee, ranged, caster, support.
- [ ] Trust AI tick integration.
- [ ] Enmity model.
- [ ] Trust spell/ability access.

## Phase 10: Crafting, mounts, and advanced travel

Target: 0.8.x.

- [ ] Crafting recipe database.
- [ ] Crystals and ingredient rules.
- [ ] Crafting skill checks.
- [ ] HQ/failure model.
- [ ] Crafting guild/support hooks.
- [ ] Mount database.
- [ ] Mount unlock key items.
- [ ] Mount zone restrictions.
- [ ] Mount travel speed modifiers.
- [ ] Mount interaction with encounters.

## Phase 11: Formula refinement

Target: ongoing.

- [ ] Replace placeholder stat formulas with sourced formulas where useful.
- [ ] Separate exact, approximate, and intentionally simplified mechanics.
- [ ] Add formula confidence annotations.
- [ ] Add balancing tests and golden-character snapshots.
- [ ] Expand benchmarks as systems become runtime-heavy.
