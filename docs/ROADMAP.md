# Roadmap

This roadmap turns the text-only reset into a stable expandable RPG foundation. Backwards compatibility is intentionally out of scope until explicitly restored.

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
- [ ] Add state migration/reset tooling.

## Phase 2: Character creation and inspection

- [ ] Character creation flow: name, race, sex, nation, main job.
- [ ] Job list and race list commands.
- [ ] Support job unlock placeholder.
- [ ] Level and EXP containers.
- [ ] Full character sheet output.
- [ ] Equipment sheet output.

## Phase 3: Inventory and equipment

- [ ] New item schema.
- [ ] Inventory stack handling.
- [ ] Equipment validation by slot/job/race/level.
- [ ] Stat aggregation from equipment.
- [ ] Item flags: rare, exclusive, key item, no sell, latent, enchantment, charges.

## Phase 4: Zones, NPCs, and interaction

- [ ] Zone schema.
- [ ] Travel graph.
- [ ] NPC placement by zone.
- [ ] Basic talk command.
- [ ] Services: signet, shops, training, quests.
- [ ] Map/home point/survival guide unlock containers.

## Phase 5: Combat loop

- [ ] Encounter command.
- [ ] Target selection.
- [ ] Player attack command.
- [ ] Enemy AI turn.
- [ ] EXP rewards.
- [ ] Loot rewards.
- [ ] Death/KO flow.
- [ ] Simple rest/recovery flow.

## Phase 6: Jobs, abilities, spells, and skills

- [ ] Job traits schema.
- [ ] Job abilities schema.
- [ ] Spell schema.
- [ ] Skill rank/cap tables.
- [ ] Recast timers.
- [ ] Cast times and interruption.
- [ ] Skill gain hooks.

## Phase 7: FFXI-like depth systems

- [ ] TP return model.
- [ ] Weapon skills.
- [ ] Skillchains.
- [ ] Magic bursts.
- [ ] Enmity model.
- [ ] Food/song/roll/samba stacking rules.
- [ ] Conquest and nation progression.
- [ ] Fame/reputation and quest flags.

## Phase 8: Formula refinement

- [ ] Replace placeholder stat formulas with sourced formulas where useful.
- [ ] Separate exact, approximate, and intentionally simplified mechanics.
- [ ] Add formula confidence annotations.
- [ ] Add balancing tests and golden-character snapshots.
