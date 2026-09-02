# 0.9.300 Advanced Combat / Training — Maturity Reassessment

Status: **COMPLETE / DECISION: CLOSE 0.9.300 AT PRODUCT 0.9.300.8.**

Decision baseline:
```text
Product:       0.9.300.8
Package:       0.9.300
Account Save:  5
Game State:    21
Data:          75
Benchmark:     3
Codename:      Martial Structured Resolution Breadth
```

This is a decision-only checkpoint. It changes no runtime behavior, authored data, persistence schema, package version, or benchmark contract.

## Question

After Combat 2.0 B1–B5 and 0.9.300 Packets 1–8, does the project need another bounded advanced-combat implementation packet before returning to the broader persistent-life roadmap?

## Decision

**No.**

`0.9.300 Advanced Combat / Training` is complete for the current Phase 0.9 maturity target.

No Packet 9 is selected.

The next implementation track is:

```text
0.9.400 Economy / Production Depth
Packet A — Occupational Tool Conversion
Status: SELECTED AS NEXT BOUNDED IMPLEMENTATION / NOT STARTED
```

Authority:
- `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.

## Why the combat track can close now

The current player-facing combat loop already proves:

1. shared physical and magical hit/damage/defense/resistance resolution;
2. canonical fictional-time activation, cooldown, recovery, readiness, and interruption;
3. hostile Enmity / Focus / Aggro / Fixation authority;
4. timed combat equipment transitions and armor-pressure rules;
5. equipment-derived melee cadence;
6. a first-class ranged attack with ammunition;
7. automatic weapon kata across current canonical melee families;
8. character-owned elemental affinity substitutions;
9. all eight novice Elemental Form attacks on structured elemental resolution;
10. one real resistible hard-control semantic through Thunder Cage;
11. deterministic target-centered radial geometry through Tempest Ring;
12. durable fictional-time persistent fields through Umbral Well;
13. synchronous target-to-target propagation through Radiant Arc;
14. all five current executable martial techniques on structured damage resolution where applicable;
15. training-service learning integrated into an actual Brasshaven / Redstone combat slice;
16. victory rewards, population consequence, and defeated-body resource opportunity;
17. defeat aftermath and fictional-time campaign recovery;
18. current-schema save/load coverage for the durable combat facts that actually affect future outcomes.

The remaining combat backlog therefore consists primarily of **depth, tactical richness, cleanup, and semantic expansion**, not missing ownership required for the current playable loop.

## Blocker assessment

### 1. Stale combatant placeholders

`battleEngine.refreshCombatant()` still creates:
- `battle.targetId`;
- `battle.actionDelay`;
- `battle.recasts`;
- `battle.casting`.

`activeBattlePersistence` still validates those fields.

Current production behavior does not use them as combat authority:
- target selection belongs to combat attention/action targeting;
- readiness belongs to the combat timeline;
- ability activation/cooldowns belong to `abilityEngine`.

Decision:
- **not an alpha-loop blocker**;
- retain as explicit schema cleanup debt;
- do not create Packet 9 merely to delete inert fields;
- remove them in a future bounded current-schema cleanup when that cleanup can include persistence guards/tests coherently.

### 2. Engagement geometry / LOS / pursuit / disengagement

The runtime has deterministic derived formation for bounded geometry but no mutable combat coordinates, LOS, line-of-fire, reachability, pursuit, search, or disengagement state.

Current armor pressure remains deliberately conservative: living non-hard-disabled hostiles retain pressure rather than granting exceptions from invented LOS/reachability facts.

There is also no explicit mid-combat flee/retreat action.

Decision:
- **not required to close 0.9.300**;
- the current combat loop is coherent as an encounter commitment ending in victory or defeat;
- fleeing, pursuit, LOS, cover, reachability, movement attacks, knockback/pull, and pressure release belong to one later engagement architecture program;
- do not implement those features piecemeal inside an unrelated technique or spell.

### 3. Passive defense / reactions

`statEngine` currently derives values such as shield block, parry, guard, counter, and spell interruption rate, but there is no universal passive execution model for them.

Current combat already has:
- evasion;
- physical defense;
- magical defense/evasion;
- active defensive techniques/statuses;
- hard-disable and interruption behavior.

Decision:
- **not an alpha-loop blocker**;
- leave passive block/parry/guard/counter/reaction semantics deferred until the project chooses whether they are passive probabilities, stances, weapon behaviors, explicit reactions, technique-specific effects, or enemy-specific logic.

### 4. Remaining semantically rich spell names

Remaining names such as:
- Flare Bloom;
- Rimefall;
- Fault Rush;

still imply richer behavior than generic single-target resolution.

Decision:
- **not a blocker**;
- do not create another spell-semantics packet merely to continue the pattern;
- Flare Bloom and Rimefall may return as future depth examples;
- Fault Rush should wait for real movement/engagement authority rather than inventing local movement semantics.

### 5. Weapon resonance / imbuement and unsupported breadth

Weapon resonance, generic imbuement, unsupported family kata, named loadout presets, broader aura/stance/channel/reaction families, and broad legacy technique migration remain future depth.

Decision:
- **not blockers**;
- keep them visible but do not delay the broader life-RPG roadmap.

### 6. Ability census

Executable ability count remains 41 against the 100 planning floor.

Decision:
- the count is **not a release gate by itself and not justification for filler**;
- future abilities should emerge from new mechanics, trainers, regions, professions, enemies, quests, and equipment interactions;
- do not keep 0.9.300 open merely to inflate the census.

## Why 0.9.400 is now stronger

The project already exceeds current production/recipe mechanics floors but still has a material-culture coherence gap: many ordinary tools and starter goods exist as equipment/shop records without corresponding production outputs or fully active occupational-tool loops.

Occupational Tool Conversion is already prepared to:
- convert existing Field Knife, Prospector Pick, Woodsman Hatchet, Digging Spade, Reed Sickle, Marsh Fishing Rod, Ash Staff, Maple Wand, Iron Buckler, Brass Ring, bronze equipment, and basic leather garments into real production outputs;
- add shared smithing, woodworking, masonry, textile, leatherworking, cooking, and measurement tools;
- make existing `requiredToolTags` materially consequential;
- keep durable tools as requirements rather than consumed ingredients;
- strengthen gather -> tool -> profession -> production -> equipment/infrastructure -> trade loops.

That work now offers more project-wide value than another isolated combat-semantic packet.

## Track decision

```text
0.9.300 Advanced Combat / Training
COMPLETE — B1-B5 + Packets 1-8 + maturity reassessment

0.9.400 Economy / Production Depth
NEXT — Packet A Occupational Tool Conversion selected, not started
```

This does **not** claim that combat is feature-complete forever. It means the current track has met its Phase 0.9 purpose and remaining combat work can return later as explicitly selected depth programs.

## Version decision

No version changes are made by this reassessment.

```text
Product       0.9.300.8 -> 0.9.300.8
Package       0.9.300   -> 0.9.300
Account Save  5         -> 5
Game State    21        -> 21
Data          75        -> 75
Benchmark     3         -> 3
```

The first real 0.9.400 implementation must make its own Product/Package/Data/Game State decision from the actual Occupational Tool Conversion contract.

## Next bounded implementation

**0.9.400 Packet A — Occupational Tool Conversion.**

On the next explicit continuation:
1. read `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`;
2. inspect current production catalog/item/tool-tag authorities;
3. select the exact conversion tranche and validation contract;
4. implement only Packet A;
5. do not restart the material-culture audit from scratch;
6. do not reopen combat unless a concrete production blocker requires a combat-owned fact.

## Closure discipline

Synchronize the permanent roadmap/profile/design authorities for this decision. `docs/THREAD_HANDOFF.md` must be the final repository-file write, followed only by exact-head hosted validation unless that validation exposes a real synchronization failure.
