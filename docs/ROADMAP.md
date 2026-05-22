# Roadmap

This roadmap turns the text-only reset into a stable expandable RPG foundation. Backwards compatibility is intentionally out of scope until explicitly restored.

## Version tracks

| Version | Theme | Gate |
| --- | --- | --- |
| 0.2.x | Foundation pipeline, version tracking, benchmarks, registries | Tests, benchmark harness, docs |
| 0.3.x | Places, zone connections, travel restrictions, tick-based travel, POIs, starter services | Zone graph tests, POI tests, travel benchmark |
| 0.4.x | Slash UI, account saves, character creation, inventory, equipment, starter item modifiers | Save/schema tests, UI command tests, equipment stat tests |
| 0.5.x | Combat rewards, enemies, loot, item schema, magic basics, enemy AI | Battle benchmarks and deterministic combat tests |
| 0.6.x | Quests, trusts, enmity, party AI, progression flags | Quest and trust AI tests |
| 0.7.x | Achievements, missions, skillchains, magic bursts, reputation | Formula confidence documentation |
| 0.8.x | Crafting, mounts, advanced travel/economy | Crafting and travel benchmark coverage |

## Phase 0: Reset shell

Status: complete enough for current development.

- [x] Strip active graphical UI entry path.
- [x] Add text command shell.
- [x] Add slash-command UI wrapper.
- [x] Add local account/character save adapter.
- [x] Add encoded localStorage payloads.
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
- [ ] Add explicit save migration/reset tooling beyond the current legacy raw-save migration.

## Phase 2: Character creation and inspection

Status: mostly complete for a starter shell.

- [x] Character creation flow: name, nation, race, sex, starting job, confirmation.
- [x] New Character entry from main menu via `/newcharacter`.
- [x] Job list and race list commands.
- [x] Full character sheet output.
- [x] Equipment sheet output.
- [x] Account character listing and load commands.
- [x] UI character-slot cards/buttons.
- [ ] Support job unlock placeholder.
- [ ] Level and EXP progression containers need real level-up rules.

## Phase 3: World graph, zones, and travel

Status: starter implementation complete.

- [x] Places database: starter cities, starter wilderness, starter dungeon hooks.
- [x] Zone schema with region, type, danger level, restrictions, services, map unlocks.
- [x] Zone connection schema with directionality, travel time, mode, and restrictions.
- [x] Travel restrictions scaffold: level, key item, quest flag, nation/rank, mount permission, combat state, content lock.
- [x] Travel command.
- [x] Tick-based travel progress via manual wait/tick scaffold.
- [x] Zone inspection command.
- [x] Travel benchmark for zone graph lookup.
- [x] Coordinate-grid atlas discovery where unvisited grids stay unknown.
- [x] Foot-travel aggro scaffold by grid spawn rule, spawn count, and aggro type.
- [ ] Expand all starter city POIs and exits with higher-fidelity coordinates.
- [ ] Add interior/Mog House places instead of temporary Mog House access flag.

## Phase 4: Inventory, items, key items, and equipment

Status: starter framework implemented.

- [x] Inventory container schema.
- [x] Main Inventory container.
- [x] Mog Safe, Mog Safe 2, Storage, Mog Locker, Satchel, Sack, Case, Wardrobes 1-8.
- [x] Storage capacity tied to Mog House furniture.
- [x] Mog House-only access rules for Storage/Mog Safe.
- [x] Anywhere/locked rules for portable containers.
- [x] Equipment-only Wardrobe rules.
- [x] Container transfer command.
- [x] Starter equipment catalog.
- [x] Stat aggregation from equipped gear.
- [x] Equip/unequip commands.
- [x] Shop buying into Inventory.
- [x] New full item schema foundation.
- [x] Inventory stack handling.
- [ ] Key item schema for unlocks and permissions.
- [ ] Equipment validation by job/race/level.
- [ ] Item flags: rare, exclusive, key item, no sell, latent, enchantment, charges.
- [ ] Item command inspection.
- [ ] Selling and vendor restrictions.

## Phase 5: Leveling, skills, and progression

Target: 0.5.x.

- [ ] EXP tables and level-up rules.
- [ ] Job-level state for all jobs.
- [ ] Level cap / limit break placeholders.
- [ ] Combat and magic skill caps.
- [ ] Skill gain hooks.
- [ ] Progression flags for maps, teleport points, mounts, trusts, quests, missions, achievements.

## Phase 6: Combat, enemies, loot, and drops

Target: 0.5.x.

- [x] Encounter command.
- [x] Basic target attack flow.
- [x] Placeholder weapon skill and cast commands.
- [x] Deterministic combat RNG injection.
- [x] EXP rewards.
- [x] Gil rewards.
- [x] Loot table schema.
- [x] Drop roll engine.
- [x] Inventory insertion through existing container rules.
- [x] Duplicate reward payout guard.
- [ ] Target selection improvements.
- [ ] Enemy AI turn.
- [ ] Battle tick integration.
- [ ] Death/KO flow.
- [ ] Simple rest/recovery flow.

## Phase 7: Magic, abilities, and status systems

Target: 0.5.x to 0.7.x.

- [x] Status effect lifecycle scaffold.
- [x] Placeholder cast command.
- [x] Recovered job ability and weapon skill display hooks.
- [ ] Magic database.
- [ ] Spell schema: skill, element, MP cost, cast time, recast, target, effect.
- [ ] Cast-time tick integration.
- [ ] Recast timers.
- [ ] Interruption rules.
- [ ] Job traits schema.
- [ ] Job abilities schema.
- [ ] Weapon skills as real combat actions.
- [ ] TP return model.
- [ ] Skillchains.
- [ ] Magic bursts.
- [ ] Food/song/roll/samba stacking rules.

## Phase 8: Quests, achievements, missions, and reputation

Target: 0.6.x to 0.7.x.

- [x] Starter quest/mission POI hooks.
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

- [x] Trust POI action placeholder.
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

- [x] Starter guild service hooks and recipe previews.
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

## Current recommended next pass

The next best implementation pass is progression, not more UI or loot plumbing:

1. Add EXP table data and level-up rules.
2. Update player/job progression containers when rewards grant EXP.
3. Refresh HP/MP/resources and EXP-to-next after level-up.
4. Add tests for no level-up, single level-up, multi-level-up, and level-cap behavior.
5. Update README, THREAD_HANDOFF, CHANGELOG, version map, and benchmark coverage if progression logic becomes runtime-heavy.
