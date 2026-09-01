# Combat 2.0 Packet B4 — Weapon Cadence, Ranged Action, and Minimal Kata

Status: **COMPLETE IMPLEMENTATION RECORD / PRODUCT 0.9.200.5 / GAME STATE 18 / DATA 66.**

B4 replaces the fixed player/companion basic-attack cadence with equipment-derived fictional-time readiness, adds a first-class ranged attack with ammunition consumption, and establishes the minimum persisted configurable weapon-kata architecture required before the playable B5 combat-training proof.

B4 does **not** start B5 and does not claim full advanced combat is complete.

## Behavioral implementation freeze

`0c3ef0a2720850d362cea06dffdbfd452f5a0c19`

Hosted evidence:
- Check #1925 / run `33470044213`;
- Repository Audit PASS;
- **852/852 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #2055 / run `33470043871` PASS.

This freeze intentionally predates Product/Game State/Data promotion and authority synchronization.

## Weapon cadence authority

New stateless authority:
- `js/text/systems/weaponCadenceEngine.js`.

B4 uses one representative conversion:

```text
fictional recovery seconds = round(weaponDelay / 60)
minimum recovery = 1 second
```

Representative existing equipment therefore yields:
- Bronze Dagger: 190 -> 3s;
- Bronze Sword: 236 -> 4s;
- Bronze Axe: 288 -> 5s;
- Ash Staff: 366 -> 6s.

Unarmed fallback is 180 -> 3s. Ranged fallback is 300 -> 5s. The delay values remain provisional balance data; B4 makes conversion and ownership deterministic.

Player basic attacks now use weapon cadence. Companion basic attacks also use equipped main-hand cadence. Enemy actions retain their existing enemy-action recovery authority because seeded enemies do not share the player equipment model.

## First-class ranged action

New action:
- `performPlayerRangedAttack()`.

It uses:
- equipped `ranged` weapon;
- equipped `ammo` stack;
- existing ranged skill inference;
- `derived.rangedAttack` and `derived.rangedAccuracy`;
- projectile/physical resolution;
- equipment-derived ranged cadence;
- one ammunition unit per attempted shot;
- canonical readiness;
- structured combat action history.

`combatResolutionEngine` now has an explicit `ranged` accuracy model using ranged accuracy against evasion and ranged attack for physical-defense scaling.

### Ammunition ownership

B4 creates no quiver or duplicate combat inventory.

The equipped ammo slot is already a stackable physical equipment record. `equipmentEngine.consumeEquippedItemQuantity()` is the explicit B4 shot-mutation seam: it decrements the equipped stack, clears the slot at zero, synchronizes the active-battle player snapshot, and refreshes affected combat profiles.

The shot resolves with the ammunition present when the action began, then one unit is consumed whether it hits or misses.

## Minimum ranged proof data

Data 66 adds:
- **Braided Sling** — ranged-slot `sling`, delay 240;
- **Rounded Sling Stones** — ammo-slot `sling` stack.

The sling maps to the existing `throwing` character skill. No new skill family or starter discipline cap table was invented solely for B4.

## Minimal weapon kata

New authored authority:
- `js/text/data/weaponKataCatalog.js`.

New runtime/configuration authority:
- `js/text/systems/weaponKataEngine.js`.

B4 intentionally implements only representative physical sequence breadth:
- dagger;
- sword;
- three automatic sequence slots;
- proficiency-gated slot count/options;
- one configurable dagger slot-1 choice;
- one manual dagger technique that resets sequence position.

Automatic moves:
- dagger: Quick Thrust -> Cross Cut -> Driving Thrust;
- sword: Forward Cut -> Return Cut -> Committed Cut.

Dagger slot 1 can be configured to Careful Thrust after sufficient learned dagger proficiency.

Manual proof:
- Recenter Cut resets the dagger automatic sequence to slot 1.

These are original provisional Hearth & Horizon mechanics records, not recovered legacy weapon-skill data.

## Proficiency and configuration

B4 proof thresholds use character-owned learned proficiency:
- learned 0: slot 1;
- learned 2: slots 1–2;
- learned 4: slots 1–3.

Current discipline continues to constrain training through existing skill caps.

Durable configuration:
- `player.progression.weaponKata`.

Encounter-local cursor:
- `activeBattle.weaponKata.byActorId[actorId]`.

The cursor records family, next slot, last move, action count, reset count, and reset reason.

Kata configuration is blocked during active combat in B4.

## B3 integration

B3 already persisted `resetWeaponSequence: true` for weapon-set loadout changes. B4 now consumes that intent: successful weapon-loadout completion resets the actor's kata cursor and rebinds it to the newly equipped supported family.

This closes the B3 -> B4 semantic handoff without creating another loadout authority.

## Structured evidence

B4 action records can now carry:
- weapon delay/conversion/recovery;
- kata family/slot/move;
- ranged weapon ID;
- ammo ID and quantity consumed/remaining;
- ranged resolution contract;
- manual sequence effect.

Combat prose remains presentation, not authority.

## Interface adapters

Command adapter:
- `ranged [target]`;
- `kata [family]`;
- `kata set <family> <slot> <move>`;
- `kata use <move> [target]`.

The DOM world interface exposes semantic Ranged combat action only when the current ranged/ammo loadout is valid.

## Version / persistence decision

```text
Product       0.9.200.4 -> 0.9.200.5
Package       0.9.200   -> 0.9.200
Account Save  5         -> 5
Game State    17        -> 18
Data          65        -> 66
Benchmark     3         -> 3
```

Game State advances because player kata configuration and the active-battle sequence cursor affect resumable future combat choices. Active-battle persistence component version advances 3 -> 4.

Data advances independently because B4 adds authored sling/ammunition and kata-family/move definitions.

No supported migration is added. Persistence remains strict current-schema-only.

## Explicitly deferred

B4 does not implement or decide:
- B5 playable Brasshaven/Redstone combat-training proof;
- LOS/reachability/pursuit/search/disengagement;
- named prepared loadout presets;
- partial stowed/not-ready equipment states;
- universal passive block/parry/guard/counter/interruption;
- recovered `/techniques` migration;
- elemental weapon-affinity substitutions;
- broad additional weapon-family kata catalogs;
- separate ranged line-of-fire geometry.

## Next bounded unit

**B5 — Playable Brasshaven / Redstone Combat-Training Proof — QUEUED / NOT STARTED.**

B5 should prove the existing B1–B4 contracts in one coherent playable training/combat loop rather than add another generic combat subsystem first.
