# Advanced Combat 0.9.300 Packet 5 — Tempest Ring Geometry Foundation

Status: **COMPLETE / PRODUCT 0.9.300.5 / GAME STATE 20 / DATA 72.**

Entry baseline:
```text
Product:       0.9.300.4
Package:       0.9.300
Account Save:  5
Game State:    20
Data:          71
Benchmark:     3
```

Permanent combat authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Previous packet:
- `docs/ADVANCED_COMBAT_0_9_300_P4_THUNDER_CAGE_CONTROL_FOUNDATION.md`.

## Why this packet is selected

The post-Packet-4 decision boundary ranks Tempest Ring Geometry Foundation first.

The ability already exists and its canonical naming law requires radial behavior. Treating "ring" as an alias for "all enemies" would still be mechanically dishonest because active battle currently has no target-distance contract.

Packet 5 therefore introduces the smallest real encounter geometry needed to express one radial spell:
- deterministic encounter-relative formation coordinates derived from combatant side/order;
- radial distance selection around a primary target;
- bounded maximum targets;
- per-recipient independent combat resolution;
- per-recipient hostile attention for enemies actually struck.

It does **not** introduce movement, LOS, pursuit, disengagement, ground targeting, zones, or a tactical grid.

## Geometry ownership model

A new stateless `combatGeometryEngine` owns encounter-relative formation projection and geometry queries.

Packet 5 geometry is deliberately **derived**, not persisted:
- combatants already persist in stable array order;
- player/allied/enemy formation coordinates are deterministic projections of that existing order;
- there is no movement system yet, so no mutable positional fact exists to serialize;
- save/load therefore reproduces the same formation and ring selection without a new state field.

This is a foundation, not a claim that combat movement/engagement geometry exists.

If later packets add movement, knockback, pursuit, LOS, or player-controlled positioning, mutable combat position will require a separately selected persistence decision.

## Selected target contract

Tempest Ring remains an enemy-targeted spell but gains authored target geometry:

```text
kind:           enemy
geometry:
  kind:         ring
  center:       target
  radius:       2 formation units
  maximumTargets: 4
```

Semantics:
- the selected primary enemy is the radial center;
- living hostile combatants at distance <= radius are eligible;
- primary target is ordered first;
- remaining targets are ordered by distance then stable encounter order;
- selection stops at `maximumTargets`;
- every selected recipient resolves hit, magic defense, and wind resistance independently.

The ring does not hit allies.

## Tempest Ring authored resolution

Tempest Ring keeps its existing:
- stable ability/capability IDs;
- Elemental Form school;
- adept/wind identity;
- six-second interruptible activation;
- 20 MP cost;
- 18-second cooldown;
- INT scaling;
- base 16;
- coefficient 1.75.

It gains:
- explicit wind magical resolution;
- explicit post-action recovery;
- ring geometry metadata.

No new ability is added.

## Attention boundary

Current B2 attention applies a single action's total enmity to the primary hostile target. That is insufficient for a real area spell.

Packet 5 must preserve single-target behavior while adding a multi-recipient path:
- when an action has applied effects on multiple enemy recipient IDs, each struck enemy receives enmity from the effects that actually landed on that enemy;
- enemies outside the ring receive no Tempest Ring damage enmity;
- ordinary single-target actions continue through the existing attention path.

No new attention store or target-selection owner is introduced.

## Expected version decision

If green:

```text
Product       0.9.300.4 -> 0.9.300.5
Package       0.9.300   -> 0.9.300
Account Save  5         -> 5
Game State    20        -> 20
Data          71        -> 72
Benchmark     3         -> 3
```

Game State should remain 20 because Packet 5 adds no mutable/persisted geometry state; formation positions are deterministic projections from already-persisted combatant order.

Data should advance to 72 because Tempest Ring's canonical authored target/recovery/resolution definition changes.

No supported-save migration is added.

## Focused proof requirements

Packet 5 is complete only when tests prove:
1. Tempest Ring preserves its stable identity, capability, activation, MP cost, cooldown, potency, and scaling;
2. the ring contract validates as real structured target geometry rather than a tag/name convention;
3. deterministic encounter formation gives stable coordinates for player/allies/enemies;
4. target-centered radius selection includes nearby enemies and excludes enemies outside the ring;
5. `maximumTargets` is honored deterministically;
6. every selected target independently resolves magic accuracy, magic defense, and wind resistance;
7. one target's resistance does not alter another target's damage;
8. action/event evidence records the ring center, radius, cap, and selected recipient IDs;
9. secondary enemies actually hit by Tempest Ring receive hostile attention; excluded enemies do not;
10. save/load-equivalent cloned current state reproduces the same formation/selection with no new persisted geometry family;
11. ability count remains 41;
12. no movement, LOS, pursuit, disengagement, zone, ground-target, aura, or broader AoE system is introduced.

## Explicit non-goals

Not part of Packet 5:
- player-controlled combat movement;
- mutable battle coordinates;
- minimum/maximum weapon range;
- LOS or line-of-fire;
- pursuit/search/disengagement;
- cone/line/arc/chain geometry;
- ground/location targeting;
- Tempest Ring knockback or displacement;
- Umbral Well field behavior;
- Rimefall/Radiant Arc/Flare Bloom breadth migration;
- broad multi-target ability migration;
- new abilities or mechanics-census filler.

## Implementation result

### Stateless geometry authority

Packet 5 adds `js/text/systems/combatGeometryEngine.js` with `COMBAT_GEOMETRY_VERSION = 1`.

The engine owns encounter-relative formation projection and geometry queries only. It does not own mutable battle position.

Current deterministic formation is derived from existing combatant side/order:
- ally formation starts with the player at `{ x: 0, y: 0 }` and deterministic companion slots behind/around that anchor;
- enemy formation uses deterministic front/flank/rear slots beginning at `{ x: 3, y: 0 }`;
- fallback slots remain deterministic for larger encounter arrays.

The ring query:
- centers on the selected primary target;
- considers living opposing-side combatants only;
- uses Euclidean distance in formation units;
- filters to authored radius;
- places the primary target first;
- sorts remaining candidates by distance then encounter order;
- stops at authored `maximumTargets`;
- returns frozen structured evidence containing center, derived center position, radius, cap, recipient IDs, distances, and derived positions.

No `activeBattle.geometry` or combatant position field is created.

### Tempest Ring authored contract

`ABILITY_CATALOG_VERSION` advances 8 -> 9.

Tempest Ring preserves:
- `ability-tempest-ring`;
- `spell-tempest-ring`;
- Elemental Form / adept / wind identity;
- enemy-targeted activation;
- 6-second interruptible activation;
- 20 MP cost;
- 18-second cooldown;
- INT scaling;
- base 16;
- coefficient 1.75.

It gains:
- `recoverySeconds: 3`;
- target geometry `{ kind: 'ring', center: 'target', radius: 2, maximumTargets: 4 }`;
- explicit wind magical resolution using magic accuracy, magic defense, elemental resistance, and `elementSource: ability`.

The executable ability count remains 41.

### Ability execution

`abilityEngine` now detects authored target geometry and asks `combatGeometryEngine` for recipients.

Only target-recipient effects are expanded across geometric recipients. Every selected recipient is then processed through the pre-existing effect path independently.

For Tempest Ring this means every selected enemy gets its own:
- magic-accuracy roll;
- magic-defense multiplier;
- wind-resistance evidence/multiplier;
- HP mutation;
- hit/miss result.

Geometry evidence is included on:
- the `ability.resolved` semantic event;
- the returned ability ActionResult;
- the ordinary combat action data.

The primary selected enemy remains `action.targetId`; the complete geometric recipient set remains explicit in `action.data.geometry` and effect recipient IDs.

### Multi-recipient attention seam

`combatAttentionEngine` preserves the existing single-target attention path.

When one combat action contains applied effects on more than one distinct enemy recipient, it now derives enmity separately per recipient from the effects actually applied to that enemy.

Therefore:
- secondary Tempest Ring targets actually damaged gain hostility toward the caster;
- each target's enmity amount reflects that target's own resolved damage/effects;
- enemies excluded by radius/cap receive no Tempest Ring damage enmity;
- no second attention store or target-selection owner exists.

### Focused guard

Primary guard:
- `tests/advancedCombatTempestRingGeometry.test.js`.

It proves:
- ability catalog version 9;
- executable ability count 41;
- stable Tempest Ring identity/cost/timing/potency/scaling;
- exact ring target contract;
- deterministic ally/enemy formation coordinates;
- radius inclusion/exclusion;
- four-target authored cap;
- independent per-target wind resistance;
- structured geometry evidence;
- per-recipient hostile attention;
- no attention for excluded enemies;
- current-schema validation with no `activeBattle.geometry`;
- cloned current state reproduces identical derived geometry.

### Hosted validation history

The first full focused geometry run after the runtime implementation:
- Check #2033 / run `33543929815`;
- Repository Audit PASS;
- **878/879 tests**;
- one focused save/load-stability proof failed.

The failure was a test-fixture coherence defect: the manually constructed six-enemy battle used `combatSequence = 0` and a noncanonical battle ID, while current-schema validation correctly requires a positive combat sequence and matching `battle-000001` identity.

The fixture alone was repaired. No runtime geometry, ability, resolution, attention, or persistence behavior changed.

### Behavioral/data implementation freeze

`29d6da27e48850aa96307553b4c124f2598c8caa`

Hosted evidence:
- Check #2034 / run `33544018110`;
- Repository Audit PASS;
- **879/879 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #2164 / run `33544018073` PASS.

### Promotion result

```text
Product       0.9.300.4 -> 0.9.300.5
Package       0.9.300   -> 0.9.300
Account Save  5         -> 5
Game State    20        -> 20
Data          71        -> 72
Benchmark     3         -> 3
```

System versions advance:
- ability catalog: 0.7.0 -> 0.8.0;
- ability engine: 0.5.0 -> 0.6.0;
- combat geometry: new 0.1.0;
- combat attention: 0.1.0 -> 0.2.0.

Game State remains 20 because no mutable or required persisted geometry field is added. Existing combatant side/order reproduces the same current formation while combat movement remains nonexistent.

Data 72 records the changed canonical Tempest Ring target/resolution/recovery contract.

No supported-save migration is added.

## Next decision boundary

Packet 5 does not authorize broader AoE/geometry migration.

A future explicit advanced-combat continuation must freshly select exactly one family. The strongest semantic continuation is **Umbral Well Field Foundation**, but it is not selected: a persistent combat field would require explicit lifetime, ownership, tick/application semantics, save/load behavior, and a new Game State decision if resumable field state becomes durable.

Other separately bounded candidates remain:
- one coherent martial-technique resolution migration tranche;
- engagement geometry / LOS / pursuit / disengagement;
- weapon resonance / imbuement;
- passive defense/reaction semantics;
- another specific geometry family only when a canonical ability genuinely requires it.

Do not combine these automatically.

## Closure discipline

`docs/THREAD_HANDOFF.md` remains the final repository-file write for the packet, followed only by exact-head hosted validation.
