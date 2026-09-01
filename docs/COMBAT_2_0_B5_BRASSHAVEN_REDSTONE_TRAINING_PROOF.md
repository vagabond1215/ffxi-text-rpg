# Combat 2.0 Packet B5 — Brasshaven / Redstone Combat-Training Proof

Status: **COMPLETE IMPLEMENTATION RECORD / PRODUCT 0.9.200.6 / GAME STATE 18 / DATA 67.**

B5 closes the bounded `0.9.200 Adventure Vertical Slices` combat bridge by proving the B1–B4 combat contracts together in existing Brasshaven / Redstone geography. It adds the minimum real training-service adapter needed to connect existing Redstone techniques to the player, then exercises those techniques alongside weapon cadence, ranged ammunition, elemental resolution, party attention, combat loadout transitions, armor-pressure legality, and skill progression.

B5 does **not** start `0.9.300 Advanced Combat / Training`.

## Behavioral implementation freeze

`764faae437f3bc58d4d55a7e46dc4921a4a85c05`

Hosted evidence:
- Check #1939 / run `33472621389`;
- job `99745292387`;
- Repository Audit PASS;
- **855/855 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #2069 / run `33472620984` PASS.

This freeze intentionally predates Product/Data promotion and current-authority synchronization.

## Existing-world anchor

B5 adds no new region, settlement, route, trainer NPC, companion, enemy family, or combat arena.

It reuses:
- Brasshaven Market Ring;
- Marshal Varric Stone;
- the canonical Brasshaven -> South Redstone road;
- South Redstone Reach;
- existing Redstone wildlife/encounters;
- existing Redstone techniques Ridge Breaker and Rivet Guard;
- the existing party/companion system;
- existing B1–B4 combat authorities.

Varric already functioned as a Brasshaven orientation/commission contact. B5 extends that same canonical person and POI with a bounded Forge-Road combat-instruction service.

## Training service adapter

New stateless service adapter:
- `js/text/systems/trainingServiceEngine.js`.

The service owns **context**, not progression.

It:
- validates that a real authored training POI and instructor NPC exist;
- exposes only authored technique capability IDs;
- checks the existing capability learning requirements;
- delegates learning to `capabilityEngine.learnCapability()`;
- records ordinary capability provenance with source `instruction`;
- emits an existing semantic-event record;
- rejects combat/travel/wrong-place/absent-instructor contexts;
- does not add a new progression registry, task, clock, or save family.

Varric's authored B5 instruction list is:
- Ridge Breaker;
- Rivet Guard.

Learning eligibility remains the existing discipline learning-path rule. Executing the technique still respects its existing weapon/proficiency/resource requirements.

Repeatable instruction is deliberately **not** a relationship farming action. B5 adds no automatic relationship or commitment reward because the fiction does not justify one merely for asking Varric to drill an already-defined movement.

## Player-facing integration

The command adapter adds:
- `training`;
- `train <technique>`.

The world-interface adapter can expose:
- a Training service action at Varric;
- distinct Learn/Review actions for available techniques.

B5 also fixes a pre-existing contextual-action deduplication weakness: semantic actions at the same POI now remain distinct by POI action, and capability-training actions remain distinct by `capabilityId`.

The active POI is prioritized inside the bounded locality listing so an engaged service contact cannot disappear simply because a settlement has more than eight known POIs.

These are presentation/navigation corrections. They do not become gameplay authority.

## Integrated combat proof

Focused guard:
- `tests/playerBrasshavenRedstoneCombatTrainingFlow.test.js`.

The proof composes the following existing authorities.

### B1 — Unified resolution

The proof uses:
- trained Rivet Guard;
- trained Ridge Breaker;
- character-owned Ember Dart.

It confirms representative canonical ability execution continues through the structured B1 contract, including Ridge Breaker's physical-defense penetration and Ember Dart's fire-element resolution.

A character who learned Ember Dart under prior magical study can still own/use that capability while Vanguard is active, subject to the ordinary ability requirements. This preserves the project law that learned capability belongs to the character rather than disappearing with temporary discipline identity.

### B2 — Party attention

The Redstone encounter includes the player plus an existing companion as two credible allied attention actors.

The proof establishes explicit hostile attention baselines and sticky Aggro, then verifies the encounter exposes the same B2 Enmity/Focus/Aggro authority rather than a B5-specific threat model.

### B3 — Combat loadout / armor pressure

The player changes the main-hand weapon during active combat through the B3 timed loadout owner.

The same hostile pressure then blocks a full body-armor change.

B5 does **not** invent LOS, pursuit, or disengagement state to make the second half pass. Instead the integration proof uses an explicit existing B3-recognized hard-disable status flag to demonstrate that a genuinely disabled hostile no longer exerts immediate armor-transition pressure. Once ordinary action recovery is also clear, the armor transition can begin and complete through the existing B3 owner.

This is a bounded proof of the already-defined hard-disable boundary, not a claim that a full crowd-control system or LOS model exists.

### B4 — Weapon cadence, kata, ranged ammunition

The proof exercises:
- Bronze Sword weapon-delay cadence;
- sword kata sequence evidence;
- first-class ranged attack with Braided Sling;
- Rounded Sling Stones ammunition consumption;
- a combat weapon-set transition to Bronze Axe;
- B3 -> B4 sequence reset consumption.

The axe is intentionally not promoted into a new B4 kata family merely for B5. The sequence owner resets to an unsupported/null kata family, preserving the bounded B4 catalog instead of inflating it.

### Skill progression

An ordinary sword attack gains character-owned sword proficiency through the existing skill progression authority.

B5 does not add a separate combat-training XP or mastery meter.

## Integration defect found — equipped ammo persistence

B4 made the equipped `ammo` slot a stackable physical ammunition authority and correctly decremented it during ranged attacks. Its focused tests proved consumption and zero-stack clearing, but one current-schema validator still imposed the older assumption that every equipped item must be non-stackable quantity 1.

B5 exposed that contradiction after a **partially consumed** ammo stack.

The fix is in `playerEquipmentPersistence.js`:
- non-ammo equipment keeps the strict quantity-1 / non-stackable contract;
- the canonical `ammo` slot may persist a valid positive stack up to `maxStack`;
- malformed stack invariants remain rejected.

This is a correction to the intended Game State 18 contract, not a new state family. Game State therefore remains 18.

Regression coverage now validates partially consumed equipped ammunition under the current schema.

## Version / persistence decision

```text
Product       0.9.200.5 -> 0.9.200.6
Package       0.9.200   -> 0.9.200
Account Save  5         -> 5
Game State    18        -> 18
Data          66        -> 67
Benchmark     3         -> 3
```

### Why Game State stays 18

B5 adds no required durable state family.

Technique learning already persists under the existing capability progression authority. Training observations use the existing semantic-event state. Combat remains under the existing active-battle schema. The ammo-validator repair makes Game State 18 accept the B4 stack shape it already intended to persist; it does not create a new serialized field.

No supported migration is added.

### Why Data advances to 67

Canonical authored world/service metadata changes:
- Varric's NPC services now include combat training;
- Varric's POI advertises the combat-training role;
- the POI authors the exact existing techniques he can teach.

No new NPC, POI, ability, capability, route, enemy, companion, item, or recipe count is added by B5.

## Task/resource ownership

B5 adds **no direct timed-task owner**.

Training is synchronous contextual instruction delegating to capability progression. Combat timing continues to use the B1–B4 owners.

The current direct timed-task owner set is unchanged:
- ability;
- campaign recovery;
- combat loadout;
- project;
- resource opportunity;
- transport;
- work task.

## Relationship / commitment decision

B5 deliberately does not create a new commitment merely to make the vertical slice look larger.

Varric's instruction is a repeatable civic/training service. Existing Redstone/Brasshaven commitments continue to carry their own narrative and relationship consequences. Technique instruction itself does not grant free trust/respect.

A future authored training storyline can add social consequences through the ordinary commitment/relationship authorities if the fiction calls for them.

## Deferred systems remain deferred

B5 does not implement:
- LOS/reachability/pursuit/search/disengagement simulation;
- named prepared loadout presets;
- partial stowed/not-ready equipment states;
- universal passive block/parry/guard/counter/interruption rolls;
- broad recovered `/techniques` migration;
- elemental weapon-affinity kata substitutions;
- kata families for every weapon;
- generalized ranged line-of-fire geometry.

The B3 adjacency/debt audit remains authoritative for these boundaries.

## Track closure

With B5 green, `0.9.200 Adventure Vertical Slices` is deliberately **COMPLETE**:
- Slice A complete;
- B1 Unified Combat Resolution complete;
- B2 Enemy Attention complete;
- B3 Combat Loadout Transitions complete;
- B4 Weapon Cadence / Ranged / Minimal Kata complete;
- B5 Brasshaven / Redstone playable integration proof complete.

The next roadmap track is:

**`0.9.300 Advanced Combat / Training — QUEUED / NOT STARTED.`**

Closing `0.9.200` does not authorize automatic implementation of `0.9.300`. A future explicit continuation must begin from the synchronized handoff and select a bounded 0.9.300 packet.
