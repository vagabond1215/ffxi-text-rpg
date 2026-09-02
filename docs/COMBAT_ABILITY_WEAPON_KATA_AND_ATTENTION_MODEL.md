# Combat Ability, Weapon Kata, Loadout, and Attention Model

Status: **PERMANENT DESIGN AUTHORITY / RUNTIME IMPLEMENTATION PARTIAL.**

This document defines the intended advanced-combat direction for Hearth & Horizon. It records the design decisions that must guide future ability, technique, weapon, loadout, enmity, and targeting work.

It does **not** claim that the full model below is implemented. Current runtime is Product 0.9.300.8 / Game State 21 / Data 75. Packets B1-B5 establish the playable foundation; Packets 1–7 broaden kata, affinity, elemental resolution, control, ring geometry, fields, and propagation; Packet 8 migrates the remaining three raw-damage executable martial techniques so all five current executable techniques now use structured damage resolution where applicable. Unsupported weapon families, weapon resonance, broader engagement geometry, passive defense/reactions, and richer action families remain future work.

## Implementation status

**Packets B1-B5 are COMPLETE; 0.9.300 Packets 1–8 are COMPLETE. A maturity reassessment is next.**

Permanent records:
- `docs/COMBAT_2_0_B1_UNIFIED_RESOLUTION.md`;
- `docs/COMBAT_2_0_B2_ENEMY_ATTENTION.md`;
- `docs/COMBAT_2_0_B3_LOADOUT_TRANSITIONS.md`;
- `docs/COMBAT_2_0_B4_WEAPON_CADENCE_RANGED_KATA.md`;
- `docs/COMBAT_2_0_B5_BRASSHAVEN_REDSTONE_TRAINING_PROOF.md`;
- `docs/ADVANCED_COMBAT_0_9_300_P1_MELEE_KATA_BREADTH.md`;
- `docs/ADVANCED_COMBAT_0_9_300_P2_CHARACTER_AFFINITY_KATA_SUBSTITUTION.md`;
- `docs/ADVANCED_COMBAT_0_9_300_P3_NOVICE_ELEMENTAL_RESOLUTION_BREADTH.md`;
- `docs/ADVANCED_COMBAT_0_9_300_P4_THUNDER_CAGE_CONTROL_FOUNDATION.md`;
- `docs/ADVANCED_COMBAT_0_9_300_P5_TEMPEST_RING_GEOMETRY_FOUNDATION.md`;
- `docs/ADVANCED_COMBAT_0_9_300_P6_UMBRAL_WELL_FIELD_FOUNDATION.md`;
- `docs/ADVANCED_COMBAT_0_9_300_P7_RADIANT_ARC_PROPAGATION_FOUNDATION.md`;
- `docs/ADVANCED_COMBAT_0_9_300_P8_MARTIAL_STRUCTURED_RESOLUTION_BREADTH.md`.

Implemented subset:
- shared representative physical/magical/hybrid resolution vocabulary;
- physical and magic accuracy paths;
- physical defense, magic defense, and magic-evasion resistance models;
- executable elemental resistance for Ember Dart;
- explicit defense penetration/critical eligibility for Ridge Breaker;
- resistible Fracture Sigil;
- explicit canonical ability recovery distinct from activation/cooldown;
- structured resolution evidence in combat action history.

Implemented by B2:
- hostile-specific absolute Enmity;
- normalized Focus distinct from literal target probability;
- nonlinear target-selection concentration;
- sticky Aggro with meaningful reassessment;
- Fixation/Priority preserving underlying Enmity;
- baseline/transient/floor/fictional-time decay state persisted with active battle.

Implemented by B3:
- canonical fictional-time combat loadout transition tasks;
- directional stow/draw/ready handling for representative equipment;
- quick weapon-set versus full-equipment classification;
- B2 Aggro/Focus/Fixation armor-pressure legality;
- atomic completion/cancellation and root/battle equipment coherence;
- canonical cooldown preservation and structured future weapon-sequence reset intent.

Implemented by B4:
- one weapon-delay -> fictional-time cadence authority;
- equipment-derived player/companion basic-attack readiness;
- first-class ranged attack using ranged attack/accuracy and equipped ammo;
- persisted dagger/sword kata configuration plus encounter-local cursor;
- proficiency-gated slots/options and one manual sequence-reset technique;
- B3 weapon-set reset intent consumed by the kata owner.

Implemented by B5:
- existing Marshal Varric Stone as the player-facing Redstone technique instructor;
- stateless training-service context delegating to capability progression;
- one playable Brasshaven -> South Redstone proof composing B1–B4;
- explicit hard-disable pressure-release proof without inventing LOS/pursuit;
- current-schema acceptance for partially consumed equipped ammo stacks;
- distinct same-POI semantic training actions in the world interface.

Implemented by 0.9.300 Packet 1:
- automatic axe, staff, and club kata families under the existing weapon-kata owner;
- five-family current equipped melee coverage across dagger/sword/axe/staff/club;
- version-2 durable player kata configuration and Game State 19 persistence;
- unchanged encounter-local kata record shape/version 1.

Implemented by 0.9.300 Packet 2:
- versioned character-owned affinity ranks for all eight canonical elements;
- affinity independent of active discipline and spell knowledge;
- affinity-aware kata option eligibility with safe physical fallback;
- Rimepoint Thrust (Ice dagger) and Cinder-Braced Drive (Fire staff) representative substitutions;
- existing melee resolution widened to pass structured element metadata into the unified resolver;
- Game State 20 / Data 69 with kata configuration version 2 and battle kata version 1 unchanged.

Implemented by 0.9.300 Packet 3:
- structured magical resolution for Cinder Bolt, Stone Shards, Gale Cutter, Tide Needle, Storm Jolt, Rime Splinters, Sunlance, and Gloam Spike;
- correct canonical element, magic accuracy, magic-defense resistance, and explicit 2-second recovery for each novice attack;
- unchanged ability count and unchanged Game State 20;
- explicit non-migration of Tempest Ring, Thunder Cage, Umbral Well, and other adept names whose semantics may require geometry/control/field mechanics.

Implemented by 0.9.300 Packet 4:
- Thunder Cage lightning damage routed through the unified magic-defense/elemental-resistance path;
- separately resistible containment through magic accuracy / magic evasion with lightning resistance contributing to control resistance;
- six-second `cannotAct` hard-disable status using the existing generic status record;
- shared hard-disable flag recognition centralized in status authority and reused by combat-loadout pressure;
- enemy response/readiness suppression while hard-disabled, with ready interrupts deferred to the latest active disable expiry;
- no target geometry, zone state, new clock, or new persistence family.

Implemented by 0.9.300 Packet 5:
- stateless `combatGeometryEngine` version 1 deriving encounter-relative formation from existing combatant side/order;
- Tempest Ring target-centered `ring` geometry with radius 2 and maximum 4 recipients;
- independent per-recipient wind magic accuracy, magic-defense, and elemental-resistance resolution;
- ordinary ability result/event/action evidence carrying center, radius, cap, selected recipient IDs, distances, and derived positions;
- multi-recipient hostile attention applied only to enemies with effects that actually landed;
- no mutable combat-position state, movement, LOS, pursuit, ground targeting, zone state, new clock, or new persistence family.

Implemented by 0.9.300 Packet 6:
- versioned durable `activeBattle.fields` state under a new `combatFieldEngine`;
- Umbral Well explicit Dark magical impact plus a 12-second persistent field with +4/+8/+12-second pulses;
- field center persisted as a point snapshot of the selected target's derived encounter position;
- cast-time source INT/magic-accuracy/magic-attack snapshot with pulse-time live defender magic evasion, magic defense, and Dark resistance;
- point-radius geometry queries over Packet-5 derived combatant formation;
- field-pulse combat interrupts on canonical world time, prioritized before ordinary enemy readiness at the same timestamp;
- one structured `fieldPulse` combat action per pulse with per-recipient effects, geometry, and hostile attention;
- explicit per-recipient area attention even when only one secondary recipient actually receives an applied effect;
- no direct timed-task owner, second combat clock, mutable combat positions, player ground targeting, LOS, pursuit, or generic zone scripting.

Implemented by 0.9.300 Packet 7:
- `arc` geometry under the existing stateless `combatGeometryEngine`;
- primary-target-first synchronous propagation across at most three living opponents;
- each later jump sourced from the previous recipient and limited to two derived formation units;
- deterministic nearest-distance selection with encounter-order then stable-ID tie breaking;
- no repeated recipients;
- independent Light magic-accuracy, magic-defense, and elemental-resistance resolution for every recipient;
- structured result/event/action evidence carrying jump number, previous recipient, distance, and derived position;
- existing explicit per-recipient attention applied only where effects actually land;
- no propagation timer, future deadline, mutable position, LOS, pathfinding, new clock, or persistence family.

Implemented by 0.9.300 Packet 8:
- Guarded Cut uses sword/slashing melee physical accuracy/defense resolution with three-second recovery and no critical eligibility;
- Barkboar Brace uses axe/slashing melee physical accuracy/defense resolution with four-second recovery and no critical eligibility;
- Thicket Feint uses dagger/piercing melee physical accuracy/defense resolution with two-second recovery and existing-character critical eligibility;
- all three preserve existing TP costs, cooldowns, potency/scaling, capability/equipment gates, and self-buff definitions;
- target damage and self-buff remain independent authored effects, so a miss does not erase the self-buff;
- combined with Ridge Breaker and Rivet Guard, all five current executable martial techniques now use structured damage resolution where applicable;
- no movement, combo, reaction, passive-defense, new clock, task owner, or persistence family is added.

Still deferred:
- weapon resonance / enchanted-weapon element behavior and generic imbuement;
- unsupported weapon-family kata where canonical equipment/runtime support does not yet exist;
- cone/line/chain/player-ground geometry; broader propagation families beyond the bounded Radiant Arc proof; generic/moving/friendly zone breadth; mutable combat movement/engagement geometry; and full aura/stance/channel/reaction breadth;
- generalized LOS/pursuit/disengagement and ranged line-of-fire models.

## Core combat law

Combat should reward:

```text
knowledge + preparation + proficiency + equipment + timing + positioning
    -> expressive tactical choices
    -> mastery that changes how the character fights
```

It should not collapse into:

```text
higher level -> same attack with a larger number
```

The character remains one continuous person. Learned techniques, weapon skill, magical affinities, equipment familiarity, and tactical knowledge persist independently of a temporary discipline/job selection.

## Ability naming law

Player-facing ability names should be:

- descriptive enough that the player can imagine the action;
- lore-friendly to Hearth & Horizon;
- concise rather than encyclopedic;
- distinctive without becoming opaque;
- mechanically honest.

Prefer names that combine at least two of:

- force/material/element;
- visible form;
- motion;
- delivery;
- result.

Useful vocabulary examples include:

```text
Dart / Bolt / Needle / Shard      small projectile
Lance / Spear / Orb               heavy or focused projectile
Arc / Chain / Fork                arcing or propagating attack
Ring / Nova / Bloom / Burst       radial or expanding effect
Rain / Hail / Fall                falling or repeated area effect
Well / Field / Mire / Pyre        persistent area
Ward / Veil / Aegis               protection
Sigil / Mark / Brand              applied magical sign/debuff
Cut / Thrust / Hew / Bash         physical technique
Feint / Step / Rush / Lunge       deception or movement
Breaker / Sunder / Crush          guard/armor/stability pressure
Volley / Scatter / Pinning Shot   ranged technique
Aura / Presence / Mantle          persistent radius influence
```

The vocabulary is semantic, not ornamental:

- a **Ring** should have radial behavior;
- a **Chain** should propagate;
- a **Well** should linger;
- a **Cage** should constrain/control;
- a **Rain** should affect an area or repeated impact window;
- a **Breaker** should interact with guard/stability/armor when the combat contract supports it.

Do not rename an ability merely because its numerical rank rises. New names should normally correspond to a changed form, delivery, geometry, timing, or tactical purpose.

External games may be studied for system patterns, but their copyrighted/proprietary names and fictional content are not Hearth & Horizon canon. New canonical abilities must remain original-world content.

## Current naming/runtime audit

Current executable player ability catalog: **41**.

```text
spells       33
techniques    5
utilities     3
```

Current capability/training definitions: **44**.

Notable current gaps:
- `technique-shadow-feint` is a learned combat capability without a matching executable ability;
- `Field Dressing` and `Ore Survey` are practical capabilities and need not be forced into combat execution.

Strong current naming examples include:
- Ember Dart;
- Cinder Bolt;
- Stone Shards;
- Gale Cutter;
- Tide Needle;
- Rime Splinters;
- Sunlance;
- Gloam Spike;
- Riptide Lance;
- Mending Thread;
- Thicket Feint;
- Fracture / Haze / Snare / Guardian Sigil.

Several names promise richer behavior than the current resolver can express:
- Flare Bloom;
- Fault Rush;
- Tempest Ring;
- Thunder Cage;
- Rimefall;
- Radiant Arc;
- Umbral Well;
- Ridge Breaker.

Prefer improving those mechanics to match their names rather than flattening the names to match today's placeholder resolver.

## Current runtime limitations that are explicitly transitional

The current combat substrate already provides:
- deterministic fictional-time combat readiness;
- structured combat action history;
- active battle persistence;
- canonical ability activation/cooldowns;
- timed interruptible ability activation;
- weapon skill progression;
- equipment `weaponDelay` metadata;
- derived melee/ranged/magic statistics;
- critical-rate/damage derived stats;
- status duration on canonical world time.

The following are still incomplete or transitional:
- player and companion basic attacks now use the B4 weapon cadence authority; enemy action recovery remains enemy-owned because seeded enemies do not use the player equipment model;
- the legacy arbitrary-string Weapon Skill path is transitional;
- a first-class player ranged-attack action now exists for equipped ranged weapon/ammunition;
- elemental resolution is proven for representative migrated abilities, but the wider catalog still needs explicit structured element metadata;
- all five current executable martial techniques now use shared hit/defense/resistance resolution where they deal damage; the wider spell/support catalog still contains pre-B1 effect definitions;
- Fracture Sigil proves deterministic status accuracy/resistance; the wider status catalog still needs explicit migration where target resistance is appropriate;
- critical derived stats are integrated for explicitly eligible migrated actions such as Ridge Breaker; basic attacks and the wider catalog remain intentionally unmigrated;
- target-centered ring geometry, one persisted point-radius Well field, and one synchronous target-to-target arc propagation are implemented; line/cone/chain/player-ground geometry, broader propagation families, mutable positioning, and generalized zone authoring remain deferred;
- one persistent field action is first-class enough for Umbral Well; aura/stance/channel/reaction and generalized zone families remain incomplete;
- dagger/sword/axe/staff/club weapon kata/auto-sequence configuration is implemented for every currently equipped canonical melee family; character affinity substitutions and unsupported weapon families remain deferred;
- timed combat loadout transitions and attention/enmity are implemented through B2-B3; named loadout presets, partial stowed/not-ready physical state, and LOS/pursuit-based pressure release remain deferred.

Do not mass-author abilities to the 100-ability mechanics floor on top of these limitations.

## Unified ability/technique execution contract

Future executable actions should be able to carry structured metadata in these domains.

### Identity and learning

```text
id
name
kind
school/tradition
tags
capabilityId
skill requirements
weapon/offhand/tool requirements
affinity requirements
training/prerequisite capabilities
```

### Timing

Distinguish where mechanically relevant:

```text
startup / buildup
active duration
channel duration
channel tick
recovery
cooldown
linger
interruptibility
```

A spell cast time, a maul wind-up, a bow draw, a shield bash recovery, and a lingering magical field are not the same timing concept.

### Targeting and geometry

Support:

```text
self
single ally/enemy
ground/location
line
cone
arc
ring
radius
chain
zone
aura
minimum/maximum range
line of sight
maximum targets
chain count / chain range
```

### Delivery

Support:

```text
melee
ranged
projectile
instant
multi-hit
volley
channel
zone
aura
reaction
```

Delivery may carry projectile count, hit intervals, ammunition consumption, and weapon-derived timing where relevant.

### Resolution

Combat outcomes should be structured rather than inferred from names/tags:

```text
physical / magical / hybrid damage
damage type
element
element source
weapon coefficient
attribute coefficient
affinity coefficient
accuracy model
accuracy modifier
defense/resistance model
critical eligibility/rate/damage
penetration/sunder
stagger/interrupt
status accuracy
threat/enmity contribution
```

A martial/ranged action may carry elemental damage. A magical action may still have a physical/projectile component where fiction supports it.

## Weapon kata / automatic attack sequences

Ordinary attacks should evolve into weapon-specific automatic sequences running on the canonical combat timeline.

A weapon family defines sequence roles rather than one universal five-hit template. Examples:

```text
dagger:     opening -> reposition -> pressure -> exploit -> finisher
sword:      opening -> return -> commitment -> guard response -> finisher
polearm:    probe -> thrust -> displacement -> pursuit -> finishing thrust
great axe:  setup -> commitment -> momentum -> breaker
hand-to-hand may support longer linked sequences
```

Weapon proficiency can:
- unlock additional sequence slots;
- unlock alternate moves for a slot;
- reduce handling/recovery penalties;
- unlock advanced substitutions/mutations;
- improve parameters without requiring a new named action.

A skilled user should visibly fight differently from a novice even when both are allowing the automatic sequence to run.

### Configurable sequence slots

The default sequence should be physically coherent and generally non-elemental.

Each unlocked slot may offer skill-gated alternatives. Alternatives can be:
- physical sidegrades;
- positional options;
- defensive transitions;
- armor/guard pressure;
- elemental affinity mutations;
- specialist finishers.

Do not guarantee every element for every slot. Author compatible options according to weapon identity and world training traditions.

## Elemental weapons and affinity-driven techniques

Distinguish three concepts.

### Weapon-supplied element

An explicitly enchanted/supernatural weapon can provide its own element.

### Weapon resonance

A weapon may have a native/resonant affinity but require the wielder to possess the matching affinity before elemental sequence behavior becomes available.

### Character affinity substitution

A character with sufficient weapon skill and magical affinity may replace a physical slot move with an affinity-specific variant.

Elemental variants should usually be tradeoffs rather than free additive damage.

Example concept:

```text
Needle Thrust
  strong physical coefficient
  armor penetration

Frost Needle
  lower physical coefficient
  ice contribution
  chill/status chance
  requires Ice affinity
```

The right move therefore depends on enemy resistances, vulnerabilities, positioning, and build intent.

Generic imbuement skills may coexist with specialist elemental techniques:
- a generic imbuement temporarily derives an element from a chosen character affinity;
- a specialist technique has deliberately authored coefficients, timing, geometry, and secondary effects.

## Weapon/loadout preparation

A prepared combat loadout may include:
- equipment;
- weapon set;
- ammunition;
- configured weapon kata;
- selected manual techniques;
- stance/aura preset;
- affinity substitutions.

Cooldowns belong to canonical abilities/shared cooldown families, **not** loadout slots. Swapping a loadout never resets an ability cooldown.

### Quick weapon-set changes versus full equipment changes

Weapon-set changes are ordinary combat maneuvers if the character is able to act.

Full equipment changes are legal only when simulation conditions allow them and cost the handling time of the changed equipment.

Equipment should be able to provide handling metadata such as:

```text
stowSeconds
drawSeconds
readySeconds
encumbrance/cumbersome traits
twoHanded handling
```

Swap duration should be directional:
- dagger -> bow need not equal bow -> dagger;
- greatswords, mauls, heavy shields, bows, and other cumbersome items take longer to stow/draw than compact weapons.

A swap creates:
- a transition interval;
- attack readiness delay;
- ability readiness delay where appropriate;
- possible chain reset;
- interruption risk.

Weapon-handling skill/equipment can reduce these penalties.

## Armor swap pressure rule

**Equipped armor may not be swapped while the character remains under meaningful active hostile pressure from an enemy that can presently pursue or threaten them.**

It is not sufficient that the enemy's current attack animation or target happens to point elsewhere.

Armor swapping becomes possible when hostile pressure is actually broken, for example:
- the hostile is sufficiently disabled and unable to threaten the character;
- line of sight/reachability has been broken long enough to establish temporary disengagement;
- another party member has genuinely taken the hostile's attention and the original character's pressure has fallen below the relevant threshold;
- combat is otherwise disengaged.

A hostile fixated on the character blocks armor swapping even if another target temporarily has high ordinary enmity.

If the enemy is merely pursuing after line-of-sight loss, armor remains locked until the pursuit/search state reaches a qualifying disengagement state.

## Attention model: Enmity -> Focus -> Aggro -> Fixation

Do not use one overloaded `aggro` number.

### Enmity

Absolute accumulated hostility/attention pressure for each hostile toward each credible actor.

Sources may include:
- baseline race/faction/species antagonism;
- damage;
- healing;
- buffs/mitigation;
- stun/root/interrupt/control;
- taunts/challenges;
- proximity/obstruction;
- killing an ally/offspring;
- objective theft/protection;
- special enemy behavior.

Baseline hostility can also modify decay or establish a floor.

### Focus

Normalize effective enmity across credible targets:

```text
focus_i = effectiveEnmity_i / sum(effectiveEnmity)
```

Focus is a relative attention share, **not literal target probability**.

Example:

```text
40 / 40 / 20 focus
```

does not imply a 40% / 40% / 20% attack roll.

### Target-selection concentration

When an enemy actually reassesses its target, transform focus nonlinearly:

```text
selectionWeight_i = focus_i ^ concentrationExponent
```

then apply reachability/perception/tactical/current-target modifiers and renormalize.

For 40 / 40 / 20:
- exponent 2 gives roughly 44 / 44 / 11;
- exponent 3 gives roughly 47 / 47 / 6;
- exponent 4 gives roughly 48.5 / 48.5 / 3.

Exact coefficients are tuning data, not fixed by this design document.

The concentration exponent may vary by:
- number of credible targets;
- enemy cognition/personality;
- frenzy/discipline/predator behavior;
- statuses.

There is **no universal minimum target probability**. A low-focus actor may effectively be ignored until a salient action or tactical condition raises their priority.

### Aggro

Aggro is the enemy's sticky current target/engagement choice.

Do not reroll it every tick.

Ordinary retargeting occurs only on meaningful reassessment triggers such as:
- challenger crosses a switch threshold;
- current target becomes unreachable;
- line of sight/disengagement changes;
- taunt/challenge;
- hard control;
- large salient action;
- scheduled AI reassessment.

Current-target stickiness prevents target ping-pong.

### Fixation / priority

Fixation is an explicit override or strong priority state:
- berserker rage;
- predator fixation on bleeding prey;
- territorial defense;
- racial/faction hatred;
- magical compulsion;
- retaliation for a specific act.

Focus/enmity still exists underneath fixation so ordinary behavior resumes coherently when fixation ends.

## Enmity decay and world identity

Enmity can have:
- transient combat pressure;
- baseline hostility;
- decay multiplier;
- focus floor;
- temporary salience;
- priority flags.

Race/faction/species antagonism should usually influence baseline/decay/floor rather than hard-script every target choice.

This permits behavior such as:
- a hated target is difficult to peel away from;
- one Shield Bash creates a major attention swing but may not instantly steal aggro;
- repeated tank actions eventually transfer aggro;
- a healer becomes increasingly dangerous to ignore;
- a fixated berserker can be deliberately baited to expose flanks/opportunity attacks.

## Focus and opportunity

High focus is both danger and tactical leverage.

An enemy concentrating heavily on one actor may expose:
- rear/flank attacks;
- opportunity strikes;
- reduced awareness toward low-focus actors;
- positional techniques;
- safe windows for other party members to disengage or reconfigure.

This should remain enemy-behavior-specific, not a universal automatic backstab rule.

## Auras, stances, zones, channels, and reactions

These are first-class future action families, not merely differently named 30-second statuses.

Auras may require:
- radius;
- recipient filter;
- pulse/continuous semantics;
- upkeep/resource cost;
- buildup/falloff;
- stacking family;
- source-disable behavior.

Stances modify the user's combat doctrine until changed/disabled.

Zones persist at a place/area and have explicit lifetime/tick behavior.

Channels maintain an action over time.

Reactions trigger from explicit combat events such as block, parry, enemy movement, ally hit, or target exposure.

All must use canonical fictional time and the shared combat action/event contract.

## Persistence and authority direction

Do not introduce a second combat clock.

Canonical world/combat time remains the timing authority.

Likely future durable state may include:
- configured loadouts;
- configured weapon kata slot selections;
- learned technique/mutation choices;
- active battle attention/focus state if battles persist through save/load;
- in-progress equipment transition if combat can be saved mid-transition.

Whether these require a Game State bump must be decided during implementation from the exact serialized shape. Do not predeclare a version bump solely from this design document.

## Content expansion rule

The mechanics-scale floor remains 100 abilities/techniques, but it is a planning target.

Before mass expansion:
1. make the execution contract capable of expressing the names;
2. migrate representative existing abilities through it;
3. prove melee + ranged + magic + status + party attention;
4. then expand the catalog with meaningful weapon/affinity/training breadth.

Do not create dozens of names that all resolve as the same single-target damage operation.
