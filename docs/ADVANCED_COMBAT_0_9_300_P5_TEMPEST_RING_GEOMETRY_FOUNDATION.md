# Advanced Combat 0.9.300 Packet 5 — Tempest Ring Geometry Foundation

Status: **SELECTED / IMPLEMENTATION STARTED.**

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

## Closure discipline

Freeze the exact behavioral/data implementation SHA before Product/Data promotion and repository authority synchronization. `docs/THREAD_HANDOFF.md` remains the final repository-file write for the packet.
