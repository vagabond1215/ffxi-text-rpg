# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.300.8
Package:       0.9.300
Account Save:  5
Game State:    21
Data:          75
Benchmark:     3
Codename:      Martial Structured Resolution Breadth
Runtime:       Node >=24
Phase:         0.9
0.9.100:       COMPLETE
0.9.200:       COMPLETE — Adventure Vertical Slices
0.9.300:       COMPLETE — Advanced Combat / Training
0.9.400:       NEXT — Economy / Production Depth
Next packet:   Packet A — Occupational Tool Conversion
Next status:   SELECTED / NOT STARTED
```

The 0.9.300 maturity reassessment is decision-only. It changes no Product, Package, Data, Game State, Account Save, Benchmark, runtime, or persistence contract.

## Latest bounded unit — 0.9.300 maturity reassessment

Decision authority:
- `docs/ADVANCED_COMBAT_0_9_300_MATURITY_REASSESSMENT.md`.

Permanent combat design authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Latest implementation packet:
- `docs/ADVANCED_COMBAT_0_9_300_P8_MARTIAL_STRUCTURED_RESOLUTION_BREADTH.md`.

### Decision checkpoint

Validated decision head:
- `e3325f958d5defcc1c25f542c51ead137808cfdc`.

Hosted evidence:
- Check #2168 / run `33657464302`;
- Repository Audit PASS;
- **895/895 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #2297 / run `33657463220` PASS.

### Packet 8 behavioral/data freeze

`4a89df88f408062aa3e90b1284c9c3497e248f6e`

Packet 8 remains the latest runtime/data behavior freeze:
- 895/895 tests;
- Repository Audit, Census, Benchmark, Benchmark Sample PASS;
- Pages PASS;
- Product 0.9.300.8 / Data 75 / Game State 21.

### Promoted authority checkpoint before this handoff

`3aff059437149a2c2bf10533ebeae2684efb9cfa`

At this checkpoint:
- README, execution pipeline, roadmap, version roadmap, project profile, system catalog, architecture, combat design, Phase 0.9 plan, quality gates, lifecycle guidance, development direction, and material-culture plan are synchronized;
- 0.9.300 is closed;
- no Packet 9 is selected;
- 0.9.400 Packet A — Occupational Tool Conversion — is selected as the next bounded implementation but has not started;
- no runtime/data/schema version changed during the reassessment.

This handoff write is intended to be the final repository-file mutation for the 0.9.300 maturity reassessment.

## Maturity decision

**0.9.300 Advanced Combat / Training is complete for the current Phase 0.9 target.**

Reason: the current combat/training loop already has coherent ownership and player-facing proof for:
- shared physical/magical hit, damage, defense, and resistance;
- fictional-time activation, cooldown, recovery, readiness, and interruption;
- Enmity / Focus / Aggro / Fixation;
- timed combat loadout transitions and armor pressure;
- equipment-derived melee cadence;
- first-class ranged action with ammunition;
- automatic weapon kata across current canonical melee families;
- character-owned elemental affinity substitutions;
- structured novice elemental resolution;
- resistible hard control;
- radial geometry;
- persistent combat fields;
- target-to-target propagation;
- all five current executable martial techniques on structured damage resolution where applicable;
- real training-service learning in a playable regional slice;
- victory rewards and defeated-body resource opportunity;
- defeat aftermath and fictional-time recovery;
- current-schema persistence for outcome-affecting durable combat facts.

The remaining combat backlog is depth, enrichment, or cleanup rather than a current alpha-loop ownership blocker.

## Explicit deferred combat depth

### Inert current-schema placeholders

`battleEngine` still creates and `activeBattlePersistence` still validates:
- `battle.targetId`;
- `battle.actionDelay`;
- `battle.recasts`;
- `battle.casting`.

They are not current combat authority.

Do not reuse them.

They remain a future bounded current-schema cleanup candidate, not justification for Packet 9.

### Engagement / LOS / pursuit / flee

Still nonexistent as canonical combat state:
- mutable combat coordinates;
- line of sight / line of fire / cover;
- reachability;
- pursuit;
- search;
- disengagement;
- explicit mid-combat flee/retreat;
- knockback / pull / movement attacks;
- pathfinding.

Current combat remains a conservative encounter commitment ending in victory or defeat. Armor-pressure logic must not infer nonexistent LOS/reachability exceptions.

Treat these features as one later engagement architecture program rather than piecemeal additions.

### Passive defense / reaction execution

Derived values such as:
- shield block;
- parry;
- guard;
- counter;
- spell interruption rate;

do not yet imply universal passive execution.

Current evasion/defense, active techniques/statuses, and hard-disable/interruption behavior are sufficient for the current milestone.

Future work must first choose whether these become:
- passive probabilities;
- stance behavior;
- weapon/equipment behavior;
- explicit reactions;
- technique-specific mechanics;
- enemy-specific mechanics.

### Remaining rich spell/action semantics

Deferred:
- Flare Bloom;
- Rimefall;
- Fault Rush;
- broader aura/stance/channel/reaction families;
- weapon resonance / generic imbuement;
- unsupported weapon-family kata;
- named loadout presets;
- broader legacy technique migration.

Fault Rush should wait for real movement/engagement authority.

Do not keep 0.9.300 open merely to migrate every evocative name.

### Census rule

Executable ability count remains 41 against the 100 planning floor.

That shortfall is roadmap evidence, not authorization for filler.

Future abilities should emerge from connected mechanics, trainers, enemies, regions, professions, quests, equipment, and affinity interactions.

## Next selected implementation — 0.9.400 Packet A

**Occupational Tool Conversion — SELECTED / NOT STARTED.**

Primary authority:
- `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.

The next explicit `continue` authorizes this bounded Packet A only.

Packet A should begin from the existing prepared conversion list rather than restarting material-culture research.

Initial conversion targets:
- Field Knife;
- Prospector Pick;
- Woodsman Hatchet;
- Digging Spade;
- Reed Sickle;
- Marsh Fishing Rod;
- Ash Staff;
- Maple Wand;
- Iron Buckler;
- Brass Ring;
- bronze weapons/armor;
- basic leather garments.

Then add bounded shared profession tools for:
- smithing;
- woodworking;
- masonry;
- textiles;
- leatherworking;
- cooking;
- measurement.

Packet A design intent:
- make existing `requiredToolTags` materially active;
- durable tools are requirements, not consumed ingredients;
- create real production outputs for existing ordinary goods;
- strengthen gather -> tool -> profession -> production -> equipment/infrastructure -> trade;
- do not auto-start Packets B-E.

### Version decision for next packet

Do not pre-bump versions merely because 0.9.400 is selected.

The Packet A implementation must decide Product / Package / Data / Game State from its actual authored/runtime changes.

Expected direction, not yet frozen:
- Product enters the 0.9.400 track when real implementation begins;
- Data likely advances because production/item definitions will change;
- Game State should advance only if Packet A introduces a genuinely new durable serialized fact.

## Preserved independent queues

- World edge: Waymeet Inner Marches / outer crossroads first, then Coppergrass extensions, then Drowned Vaults.
- Locality enrichment: ambient/risk events, wandering/seasonal merchants, directions/help, richer dialogue, shop browse/category depth, learned-locality presentation.
- Quest/social/companion depth remains a later 0.9.500 track.
- Ecology five-part repair remains complete; do not restart without fresh selection.

## Standing governance

Preserve:
- one canonical fictional world clock;
- one owner per state family;
- no duplicate resolver/task owner;
- current-schema-only pre-alpha persistence;
- implementation/data freeze before Product/Data promotion;
- Data and Game State advance independently;
- no mechanics-census filler;
- no hidden compatibility scaffolding for unsupported saves;
- legacy FFXI/root combat surfaces remain noncanonical;
- exploration aggro remains separate from active-battle attention;
- `docs/THREAD_HANDOFF.md` is the final repository-file write for a closed bounded unit.

## Restart order for 0.9.400 Packet A

1. `AGENTS.md`;
2. this handoff;
3. `PROJECT_PROFILE.yaml`;
4. `docs/EXECUTION_PIPELINE.md`;
5. `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`;
6. `docs/DEVELOPMENT_DIRECTION.md`;
7. `docs/ROADMAP.md`;
8. inspect current production/item/equipment/tool-tag authorities only;
9. define the exact Packet A conversion tranche and version contract before implementation;
10. implement Occupational Tool Conversion only.

Do not reopen the advanced-combat audit unless a concrete 0.9.400 blocker depends on a combat-owned fact.

## Final validation contract

This handoff is the intended final repository-file mutation for the maturity-reassessment closure.

After this write:
- perform **no repository-file mutation** unless exact-head validation exposes a real failure;
- validate the exact resulting `main` SHA with hosted Check;
- confirm Repository Audit, **895/895 tests**, Census, Benchmark 3, and Benchmark Sample;
- confirm Pages succeeds on the same exact SHA;
- confirm `main` remains on that exact SHA.

If exact-head validation exposes a real synchronization defect, repair it and rewrite this handoff last again.
