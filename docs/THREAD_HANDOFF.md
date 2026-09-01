# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

No runtime/data/persistence version changed during the combat-design/planning pass.

```text
Product:       0.9.200.1
Package:       0.9.200
Account Save:  5
Game State:    15
Data:          63
Benchmark:     3
Codename:      Slatewater Road Scout
Runtime:       Node >=24
Phase:         0.9
Track:         0.9.200 Adventure Vertical Slices ACTIVE
Slice A:       COMPLETE
Slice B:       SELECTED / PLANNED / NOT STARTED
Next packet:   B1 Unified Combat Resolution Contract
```

## Latest implemented bounded unit

Adventure Vertical Slice A — **Slatewater Road Scout** remains the latest runtime/data implementation.

Permanent record:
- `docs/ADVENTURE_VERTICAL_SLICE_A_SLATEWATER_ROAD_SCOUT.md`.

Implementation freeze:
- `63cbd31edb149c9cf10af0a83bcf6f667abe17b8`;
- Check #1815 / run `33361131795`;
- Repository Audit PASS;
- **826/826 tests**;
- Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS.

Data 63 census remains:

```text
places/localities       55
named NPCs              48
shop/service sites      37
creatures              123
resource sources       143
canonical items        408
recipes/processes      234
abilities/techniques    41
quests/contracts        20
companions               2
transport services       7
routes                   25
NPC schedules            27
regional/shared packs    39
pack-owned records     1325
runtime seed NPCs        47
runtime seed enemies     17
```

Mechanics-scale remains NOT READY:
- abilities/techniques 41/100;
- companions 2/4;
- quests/contracts 20/30;
- named NPCs 48/50.

Abilities/techniques remain the largest relative and absolute listed gap.

## Combat design authority added

Permanent design authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

This authority records the user-selected combat direction.

### Naming

Ability/technique names should be original Hearth & Horizon names that are:
- concise;
- lore-friendly;
- descriptive of force/form/motion/result;
- mechanically honest.

Words such as Ring, Chain, Cage, Well, Rain, Breaker, Volley, Ward, Sigil, etc. should imply real executable behavior rather than decoration.

Do not create new names for pure numeric rank increases when rank/mastery can preserve the same action identity.

### Unified action metadata

Future spells, melee/ranged techniques, hybrid actions, auras, stances, zones, channels, reactions, and practical combat actions should share a structured execution vocabulary covering where relevant:
- startup/buildup;
- active/channel timing;
- recovery;
- cooldown;
- linger;
- delivery;
- geometry/range/targets;
- physical/magical/hybrid channel;
- weapon and attribute scaling;
- element/element source;
- accuracy;
- defense/resistance;
- critical behavior;
- status accuracy/resistance;
- penetration/sunder/stagger/interrupt;
- enmity contribution.

### Weapon kata / auto sequences

Ordinary weapon attacks should evolve into weapon-specific automatic sequences on canonical combat time.

Weapon proficiency can:
- unlock additional sequence stages;
- unlock selectable moves within stages;
- improve existing moves;
- unlock affinity-dependent substitutions.

Defaults should generally remain physical. Elemental variants are selectable mutations/tradeoffs rather than automatic free bonus damage.

A skilled weapon user should visibly fight differently from a novice even while allowing automatic attacks to run.

### Elemental weapon actions

Distinguish:
- element supplied by an explicitly enchanted weapon;
- weapon affinity/resonance requiring the wielder's matching affinity;
- character-affinity substitutions within a weapon sequence;
- generic imbuement actions versus specialist elemental techniques.

Do not globally assign one mandatory element to every weapon family.

### Loadouts

Prepared combat loadouts may include:
- equipment;
- weapon set;
- ammunition;
- configured kata;
- selected manual techniques;
- stance/aura preset;
- affinity substitutions.

Combat swapping is timed and interruptible:
- outgoing stow time and incoming draw/ready time both matter;
- compact weapons are faster than cumbersome bows/greatswords/mauls where authored;
- direction matters;
- attacks/weapon abilities have post-swap readiness;
- canonical ability cooldowns never reset because a loadout changes.

### Armor pressure rule

Equipped armor cannot be swapped while the character remains under meaningful active hostile pressure from a hostile that can pursue or threaten them.

It is not enough that another party member is currently selected as the enemy target.

Armor becomes swappable only after actual pressure is broken, for example:
- sufficient disable/unreachability;
- LOS/reachability loss that progresses to qualifying temporary disengagement rather than mere pursuit;
- genuine attention transfer to allies plus the original character falling below the pressure threshold;
- ordinary combat disengagement.

Fixation on the character blocks armor swaps.

### Enemy attention vocabulary

Do not overload one `aggro` number.

- **Enmity** — absolute accumulated hostility/attention pressure.
- **Focus** — normalized relative attention share.
- **Aggro** — sticky current target/engagement.
- **Fixation/Priority** — exceptional targeting override.

Focus share is **not literal attack probability**.

On an actual target reassessment, focus is transformed nonlinearly, conceptually:

```text
selectionWeight_i = focus_i ^ concentrationExponent
```

then modified by reachability, perception, tactics, current-target stickiness, and special priorities.

Example: `40 / 40 / 20` focus might become roughly `47 / 47 / 6` at exponent 3 rather than a literal 20% chance for the low-focus actor.

No universal minimum targeting chance is required.

Do not reroll targets every tick. Retargeting occurs only at meaningful reassessment triggers.

Race/faction/species antagonism may affect baseline enmity, decay, focus floors, or priority rather than hard-scripting every target.

## Current combat runtime audit

Current executable catalog:
```text
33 spells
 5 martial techniques
 3 utilities
41 total executable abilities
44 capability/training definitions
```

Known current runtime seams:
- basic player/companion attacks still use fixed recovery rather than `weaponDelay` cadence;
- `performWeaponSkill(state, skillName)` remains transitional arbitrary-string behavior;
- no first-class player ranged attack authority;
- elemental ability tags do not yet drive resistance/damage;
- canonical ability damage does not yet share complete ordinary accuracy/defense/resistance resolution;
- canonical status effects do not yet have complete status accuracy/resistance;
- critical derived stats are not fully integrated into the representative action resolver;
- target geometry is still effectively self/enemy/context;
- aura/stance/zone/channel/reaction families are not first-class;
- configurable weapon kata is not implemented;
- timed combat loadout transitions are not implemented;
- party Enmity/Focus/Aggro/Fixation is not implemented.

Do **not** close the 41/100 ability gap by mass-authoring mechanically duplicate abilities on top of these seams.

## Adventure Vertical Slice B selected

Permanent implementation plan:
- `docs/COMBAT_2_0_SLICE_B_IMPLEMENTATION_PLAN.md`.

Slice B is now selected as a **Brasshaven / Redstone combat-training bridge**, using existing geography/content where possible:
- Brasshaven Market Ring;
- South Redstone Reach;
- existing Redstone techniques such as Ridge Breaker and Rivet Guard;
- existing starter equipment and current Redstone/training encounter substrate.

Do not add a new region merely to prove combat.

Do not add a new trainer/arena/POI unless the implementation audit shows that existing service/contact fiction cannot honestly own the training interaction.

## Immediate next bounded implementation — B1 only

A future user message **`continue`** should start:

### Packet B1 — Unified Combat Resolution Contract

B1 is contract-first, content-second.

Required initial audit:
- `js/text/systems/battleEngine.js`;
- `js/text/systems/combatTurnEngine.js`;
- `js/text/systems/combatActionEngine.js`;
- `js/text/systems/combatSimulationEngine.js`;
- `js/text/systems/abilityEngine.js`;
- `js/text/data/abilities.js`;
- `js/text/data/capabilities.js`;
- `js/text/data/systemConstants.js`;
- `js/text/systems/statEngine.js`;
- `js/text/systems/skillProgressionEngine.js`;
- `js/text/data/equipmentCatalog.js`;
- active-battle / ability persistence validation and tests.

B1 should introduce a normalized resolution vocabulary capable of representing at minimum:
- delivery;
- physical/magical/hybrid channel;
- damage type;
- element / element source;
- weapon/attribute coefficients;
- accuracy model/modifier;
- defense/resistance model;
- critical eligibility/modifier;
- status payload and accuracy/resistance;
- explicit action recovery;
- enmity metadata placeholder for later B2.

Representative B1 proof:
- one ordinary melee basic attack;
- Ridge Breaker;
- Rivet Guard;
- one direct elemental spell such as Ember Dart or Cinder Bolt;
- one status spell such as Fracture Sigil.

B1 should begin making the names mechanically honest:
- Ridge Breaker gets real guard/stability/defense interaction when the minimal contract exists;
- elemental damage consults actual element/resistance data;
- status application has a deterministic accuracy/resistance path;
- canonical recovery is distinct from startup/cast time and cooldown.

Do not implement full kata, loadout swapping, attention, aura geometry, or broad ability expansion in B1.

The arbitrary-string legacy Weapon Skill path should receive no new feature growth; supported canonical techniques should move through the canonical ability/action contract.

## Later Slice B packets — not auto-started

After separate stable handoffs:

1. **B2 — Enemy Attention Foundation**
   - Enmity;
   - normalized Focus;
   - nonlinear target weighting;
   - sticky Aggro;
   - Fixation;
   - deterministic 3-actor proof including baseline antagonism and a Shield Bash-style attention swing.

2. **B3 — Combat Loadout Transition Foundation**
   - timed directional stow/draw/ready;
   - quick weapon-set vs full equipment transition;
   - cooldown preservation;
   - disable/interruption rules;
   - armor swap blocked under meaningful pressure/pursuit/fixation.

3. **B4 — Weapon Cadence / Ranged / Minimal Kata**
   - weapon-delay-derived attack readiness through one conversion authority;
   - first-class ranged action using ranged skill/stats/ammunition;
   - minimal configurable kata proof with only representative weapon families.

4. **B5 — Playable Brasshaven / Redstone Combat-Training Proof**
   - integrates the proven B1-B4 contracts in a real vertical slice.

After B5, deliberately close `0.9.200` and open `0.9.300 Advanced Combat / Training` for broad weapon-family, affinity, aura, stance, zone, channel, reaction, enemy-AI, and meaningful ability-catalog expansion.

## Preserved interrupted/resumable circles

The combat selection does **not** cancel previous work.

### Locality enrichment — DEFERRED / RESUMABLE

The Local Knowledge & Familiarity Foundation is complete.

Still preserved:
- ambient/risk event catalogs;
- wandering/seasonal merchants;
- generalized direction/help dialogue;
- richer contextual dialogue;
- staged shop category/browse depth;
- learned-locality graphical presentation.

Authority:
- `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md`.

### Occupational Tool Conversion — PRESERVED / QUEUED

Still the strongest prepared `0.9.400 Economy / Production Depth` candidate.

Resume from the existing Packet A conversion list and `requiredToolTags` design rather than repeating the audit.

Authority:
- `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.

### World-edge continuation — PAUSED / RESUMABLE

Ranking remains:
1. Waymeet Inner Marches / outer crossroads approach;
2. Coppergrass extensions;
3. Drowned Vaults.

Authorities:
- `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md`;
- `docs/WORLD_MACRO_TOPOLOGY.md`.

Combat Slice B intentionally reuses existing geography and does not supersede this queue.

### Ecology

The five-part flora/fauna diversity repair sequence is **COMPLETE**, not interrupted.

Do not restart automatically. Any additional ecology work requires fresh selection.

## Planning-pass validation

This design/planning pass changed documentation/profile only.

Pre-handoff synchronized authority head:
- `2d6667be48bcd3223b4cc2a608cbdf5d7e1bb089`.

Hosted validation:
- Check #1846 / run `33455798979` — SUCCESS;
- Repository Audit PASS;
- **826/826 tests**;
- Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #1976 / run `33455798113` — build/deploy/report SUCCESS.

This handoff file is the final repository-file mutation for the planning pass. The resulting handoff commit SHA is the final `main` SHA and must be validated externally after this write. Do not modify repository files merely to insert that self-referential SHA.

## Restart read order

For B1:
1. `AGENTS.md`;
2. this handoff;
3. `PROJECT_PROFILE.yaml`;
4. `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`;
5. `docs/COMBAT_2_0_SLICE_B_IMPLEMENTATION_PLAN.md`;
6. `docs/EXECUTION_PIPELINE.md`;
7. `docs/ROADMAP.md`;
8. `docs/ARCHITECTURE.md`;
9. B1 runtime files listed above.

Do not restart broad combat research before inspecting the current runtime and these authorities.

## Final validation contract

After this handoff write, perform no repository-file mutations.

Validate the exact final handoff SHA with:
```text
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

and confirm Pages succeeds on the exact same SHA.
