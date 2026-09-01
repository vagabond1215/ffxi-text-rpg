# Combat 2.0 / Adventure Vertical Slice B Implementation Plan

Status: **NEXT IMPLEMENTATION PLAN SELECTED / NOT STARTED.**

Current runtime remains:

```text
Product:       0.9.200.1
Package:       0.9.200
Game State:    15
Data:          63
Benchmark:     3
```

Permanent combat design authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`

## Why the next implementation uses Slice B as a bridge

Adventure Vertical Slice B was the active-track unfinished circle after Slice A. The ability/technique audit then exposed that the largest mechanics gap is not merely content count: the current combat resolver cannot yet express many of the names and tactical behaviors the project wants.

Do not abandon Slice B and jump directly into an unbounded combat rewrite.

Instead:

> **Resume Slice B as a Brasshaven / Redstone combat-training bridge that proves bounded Combat 2.0 contracts on existing geography and existing technique content.**

This keeps `0.9.200 Adventure Vertical Slices` coherent, avoids inventing another zone, and provides a playable proof before `0.9.300 Advanced Combat / Training` broadens the system across the full catalog.

The preferred existing anchor is:
- Brasshaven Market Ring;
- South Redstone Reach / existing Redstone combat content;
- existing Redstone technique tranche (`Ridge Breaker`, `Rivet Guard`);
- existing starter sword/axe/dagger/staff/wand equipment;
- existing training dummy / Redstone enemies where appropriate.

Do not create a new trainer NPC, arena, or POI unless the implementation audit demonstrates that an existing contact/service cannot honestly own the training interaction.

## Implementation principle

The next work is **contract first, content second**.

Do not add dozens of abilities to raise the census until:
- hit/accuracy/defense/resistance are unified;
- element is executable metadata rather than only a tag;
- action timing is explicit;
- ranged attacks have a first-class action;
- weapon cadence can consume equipment delay;
- attention can support parties;
- loadout switching has deterministic timing and pressure rules.

## Packet B1 — Unified combat resolution contract

**This is the immediate next implementation unit.**

Bounded goal:

> Make basic attacks and representative canonical abilities resolve through one structured combat-resolution vocabulary without yet implementing the full kata/loadout/attention model.

### Required audit before edits

Inspect:
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
- active-battle and ability persistence validators/tests.

### B1 schema direction

Introduce a normalized resolution description capable of representing at minimum:

```text
delivery
physical/magical/hybrid channel
damage type
element or none
element source
scaling stat
weapon coefficient
attribute coefficient
accuracy model
accuracy modifier
defense/resistance model
critical eligibility
critical modifier
status payload
enmity hint/metadata placeholder
```

B1 does **not** need full geometry, aura, loadout, or kata configuration yet.

### B1 representative migration

Migrate/prove a deliberately small set:
- one ordinary melee basic attack;
- one existing physical technique such as `Ridge Breaker`;
- one existing defensive technique such as `Rivet Guard`;
- one direct elemental spell such as `Ember Dart` or `Cinder Bolt`;
- one status spell such as `Fracture Sigil`.

The names should begin matching mechanics:
- `Ridge Breaker` should have a real guard/stability/defense interaction once that minimal field exists;
- elemental spell resolution should consult actual element/resistance metadata;
- status application should have an explicit accuracy/resistance path rather than unconditional landing.

### B1 legacy boundary

The arbitrary-string `performWeaponSkill(state, skillName)` path is transitional.

B1 should:
- stop adding new behavior to it;
- route supported canonical techniques through the ability/action contract;
- retain compatibility only as narrowly as current tests/UI require;
- document the deletion/migration boundary.

### B1 timing

Do not redesign all attack cadence yet.

B1 should ensure canonical abilities can carry explicit recovery separately from startup/cast duration and cooldown, and that combat readiness respects that recovery.

### B1 validation

Focused tests should prove:
- deterministic hit/miss;
- physical defense interaction;
- magic accuracy/resistance;
- elemental resistance;
- critical eligibility where enabled;
- status resist/land;
- canonical recovery;
- structured combat action history;
- save/load validation if serialized contract fields change.

Then run the full repository gate.

## Packet B2 — Enemy attention foundation

After B1 is frozen, implement:

```text
absolute enmity
-> normalized focus
-> nonlinear target-selection weight
-> sticky current aggro
-> optional fixation/priority
```

Required behavior:
- every credible party actor can have an enmity entry;
- baseline race/faction/species hostility can contribute without hard-scripting the target;
- actions modify enmity;
- decay/floors are authored data;
- focus normalizes relative attention;
- focus is not direct attack probability;
- target reassessment uses a nonlinear concentration exponent;
- current target remains sticky;
- no universal minimum target probability;
- fixation can override ordinary switching while preserving underlying enmity.

Representative 3-actor proof:
- one actor begins with elevated baseline hostility;
- a lower-focus shield user lands a high-enmity stun/bash action;
- focus moves materially but does not necessarily steal aggro from one action;
- repeated tank actions can genuinely transfer aggro;
- a low-focus third actor remains possible but strongly de-weighted.

The exact exponent/threshold values are tuning data and should use deterministic tests rather than hard-coded genre folklore.

## Packet B3 — Combat loadout transition foundation

After attention exists, implement timed equipment transitions.

Distinguish:
- prepared quick weapon-set swap;
- full equipped-loadout change.

Required handling metadata:
- stow;
- draw/equip;
- ready/recovery;
- cumbersome/two-handed traits where useful.

Rules:
- direction matters;
- swap consumes canonical fictional combat time;
- attacks/weapon abilities are locked during transition/recovery;
- canonical ability cooldowns do not reset;
- weapon sequence resets by default;
- hard disables can block/interrupt transitions.

### Armor pressure lock

Armor slots are not swappable merely because another party member is the current target.

Armor swap is blocked while any credible hostile:
- is currently aggroed on the character;
- is fixated on the character;
- maintains focus/pressure above the armor-change threshold;
- is actively pursuing the character after LOS loss.

Armor becomes swappable only after actual pressure is broken or the hostile is sufficiently disabled/unreachable for the transition.

## Packet B4 — Weapon cadence, ranged action, and minimal kata

Only after B1-B3 are stable.

### Weapon cadence

Replace universal fixed basic-attack cadence with weapon/equipment-derived readiness.

Do not assume the existing numeric `weaponDelay` values are final balance; preserve provenance/placeholder labeling while establishing one conversion authority.

### First-class ranged action

Add a canonical ranged attack path using:
- ranged weapon/ammunition;
- ranged skill;
- ranged attack/accuracy;
- ammunition/recovery;
- structured combat action history.

If canonical ranged equipment is absent, add only the minimum original-world equipment/ammunition needed for the vertical proof rather than a large ranged catalog.

### Minimal kata proof

Do **not** author every weapon family.

Prove configurable sequence architecture with a small representative set, preferably:
- dagger for fast multi-stage melee;
- sword or axe for a slower contrasting sequence;
- ranged cadence separately.

Required concepts:
- weapon-family sequence slots;
- proficiency-gated slot count/options;
- physical default selections;
- saved/configured selected move per slot if the state contract requires it;
- chain reset on ordinary weapon change;
- one manual technique that can interact with the sequence.

Elemental affinity substitutions are designed now but may remain B5/`0.9.300` if implementing them in B4 would over-expand the bounded unit.

## Packet B5 — Slice B playable combat-training proof

Use existing Brasshaven / Redstone geography.

The final Slice B proof should connect:
- a real training/service/social contact;
- existing or minimally extended Redstone technique training;
- melee action;
- first-class ranged action;
- one elemental spell or elemental weapon technique;
- party attention;
- a weapon-set transition;
- armor swap blocked while meaningful hostile pressure persists;
- loss of pressure/disengagement enabling the armor change;
- skill/proficiency progression;
- relationship/commitment consequences only where fiction justifies them.

Do not require a new region.

When this vertical proof is green, `0.9.200 Adventure Vertical Slices` can be deliberately closed.

## Then open `0.9.300 Advanced Combat / Training`

The full `0.9.300` track should broaden proven Slice B contracts rather than invent them from scratch.

Priority breadth:
1. weapon kata across weapon families;
2. affinity-driven slot substitutions;
3. generic imbuements plus specialist elemental techniques;
4. manual melee/ranged techniques;
5. auras/presences;
6. stances;
7. zones/channels/reactions;
8. ranged families and ammunition behavior;
9. enemy technique/attention personality breadth;
10. ability catalog expansion toward and beyond 100 only after mechanical differentiation is real.

## Naming/content expansion gate

Before a new named ability enters canonical data, verify:
- name describes form/motion/element/result honestly;
- geometry/timing implied by the name is executable;
- it is not only a numeric copy of an existing action;
- learning and use requirements are explicit;
- damage/heal/status resolution metadata is complete;
- combat time/recovery is explicit;
- elemental behavior is structured, not tag-only;
- enmity/threat behavior has a default or explicit override;
- Pack-v2 ownership/dependencies are valid.

## Expected persistence/version decisions

Do not bump versions from planning alone.

During implementation:
- Product will advance within Package 0.9.200 for Slice B work;
- Data advances only when canonical authored records change;
- Game State advances if configured kata/loadouts or active-battle attention/transition state introduce a new durable serialized contract;
- Benchmark remains 3 unless workload/comparability changes.

Because active battle is already persistent, B2/B3/B4 must explicitly decide whether attention tables, equipment transitions, and kata selections are durable enough to require the next Game State schema. Do not reconstruct them from unrelated fields after load if they affect future outcomes.

## Interrupted/resumable circles — preserve, do not erase

The combat priority does not cancel earlier selected/deferred work.

### Adventure Vertical Slice B

**RESUMED by this plan** as the Brasshaven / Redstone combat-training bridge.

### Local Knowledge follow-on

Still deferred after the completed foundation:
- ambient/risk events;
- wandering/seasonal merchants;
- generalized direction/help dialogue;
- richer contextual dialogue;
- staged shop browsing;
- learned-locality graphical presentation.

Do not mix these into combat work unless a specific Slice B interaction requires one narrow piece.

### Occupational Tool Conversion

Still the strongest prepared `0.9.400 Economy / Production Depth` candidate.

Authority:
- `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.

Do not lose the existing Packet A conversion list.

### World-edge continuation

Still ranked:
1. Waymeet Inner Marches / outer crossroads approach;
2. Coppergrass extensions;
3. Drowned Vaults.

Authority:
- `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md`;
- `docs/WORLD_MACRO_TOPOLOGY.md`.

Do not resume geography expansion merely because combat needs encounters; existing regions are sufficient for Slice B.

### Ecology

The five-part flora/fauna repair sequence is **complete**, not interrupted.

Do not reopen it automatically. Optional ecology follow-ons require a fresh bounded work order.

## Stop points

Each B packet is a separate bounded implementation unit.

A `continue` after this planning pass should start **B1 only**.

Do not automatically proceed B1 -> B2 -> B3 -> B4 -> B5 without returning to the user at each stable handoff unless the user explicitly authorizes a broader sequence.
