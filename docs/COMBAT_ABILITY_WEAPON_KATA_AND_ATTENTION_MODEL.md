# Combat Ability, Weapon Kata, Loadout, and Attention Model

Status: **PERMANENT DESIGN AUTHORITY / RUNTIME IMPLEMENTATION PARTIAL.**

This document defines the intended advanced-combat direction for Hearth & Horizon. It records the design decisions that must guide future ability, technique, weapon, loadout, enmity, and targeting work.

It does **not** claim that the full model below is implemented. Current runtime remains Product 0.9.200.1 / Game State 15 / Data 63 until a later bounded implementation changes those contracts.

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
- basic attacks use a fixed player/companion recovery rather than weapon-driven cadence;
- the legacy arbitrary-string Weapon Skill path is transitional;
- there is no first-class player ranged-attack action;
- elemental tags do not yet drive damage/resistance calculation;
- canonical ability damage largely bypasses ordinary hit/defense/resistance resolution;
- statuses from canonical abilities do not yet use a complete accuracy/resistance model;
- critical derived stats are not fully integrated into basic/canonical ability resolution;
- target geometry is effectively self/enemy/context rather than line/cone/ring/zone/chain/aura;
- aura/stance/channel/zone actions are not first-class;
- weapon kata/auto-sequence configuration is not implemented;
- combat loadout transitions and attention/enmity are not implemented.

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
