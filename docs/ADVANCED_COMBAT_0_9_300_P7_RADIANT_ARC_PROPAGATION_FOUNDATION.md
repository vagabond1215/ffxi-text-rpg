# Advanced Combat 0.9.300 Packet 7 — Radiant Arc Propagation Foundation

Status: **SELECTED / IMPLEMENTATION STARTED.**

Entry baseline:
```text
Product:       0.9.300.6
Package:       0.9.300
Account Save:  5
Game State:    21
Data:          73
Benchmark:     3
```

Permanent combat authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Previous packet:
- `docs/ADVANCED_COMBAT_0_9_300_P6_UMBRAL_WELL_FIELD_FOUNDATION.md`.

## Why this packet is selected

Packets 4–6 made three adept Elemental Form names mechanically honest:
- Thunder Cage -> resistible control;
- Tempest Ring -> target-centered radial geometry;
- Umbral Well -> persistent field state.

Radiant Arc remains a generic single-target placeholder even though the permanent naming law places Arc / Chain / Fork in the arcing/propagating family.

Packet 7 therefore introduces one bounded synchronous propagation geometry and proves it only with Radiant Arc.

## Selected propagation contract

Radiant Arc uses target-to-target propagation.

```text
primary target
  -> nearest eligible unhit enemy within 2 formation units
     -> nearest eligible unhit enemy within 2 formation units
```

Authored geometry:
```text
kind:            arc
jumpRange:       2
maximumTargets:  3
repeatTargets:   false
ordering:        nearest-then-encounter-order
```

Semantics:
- the explicitly selected enemy is always recipient 1;
- each later jump originates from the previous recipient, not the original center;
- only living opposing-side combatants are eligible;
- a recipient cannot be selected twice;
- candidates must lie within `jumpRange` of the previous recipient;
- nearest distance wins;
- ties use stable encounter order, then stable ID;
- propagation stops when the target cap is reached or no eligible jump remains.

This is intentionally distinct from Tempest Ring:
- Ring selects peers around one fixed center;
- Arc walks target-to-target and can reach a later recipient outside the primary target's original radius.

## Damage law

Packet 7 does **not** introduce jump falloff.

All selected recipients use the existing Radiant Arc direct potency:
- MND scaling;
- base 16;
- coefficient 1.75.

Every recipient independently resolves:
- magic accuracy;
- magic defense;
- Light resistance;
- hit/miss;
- damage.

The bounded three-target cap is the balancing constraint in this foundation packet.

No per-jump potency multiplier or persistent propagation state is added.

## Attention/evidence

Radiant Arc is one cast and one combat action.

The action keeps the explicitly selected enemy as its primary `targetId`, while structured geometry evidence records:
- propagation kind;
- primary target;
- jump range;
- maximum targets;
- repeat-target policy;
- recipient order;
- each recipient's jump number;
- previous recipient/source ID for each jump;
- distance from the previous recipient;
- derived position.

Because geometric actions already use explicit per-recipient attention, each enemy receives enmity only from effects actually applied to that enemy.

## Persistence/version expectation

If green:
```text
Product       0.9.300.6 -> 0.9.300.7
Package       0.9.300   -> 0.9.300
Account Save  5         -> 5
Game State    21        -> 21
Data          73        -> 74
Benchmark     3         -> 3
```

Game State should remain 21 because propagation resolves synchronously inside the ability action and creates no future durable fact.

Data should advance because Radiant Arc's canonical target/resolution/recovery contract changes.

No supported-save migration is planned.

## Focused proof requirements

Packet 7 is complete only when tests prove:
1. Radiant Arc preserves stable identity, capability, activation, MP cost, cooldown, potency, scaling, and ability count;
2. the authored target contract uses structured `arc` geometry rather than a name/tag convention;
3. the primary target is always recipient 1;
4. each later jump selects the nearest eligible unhit enemy from the previous recipient;
5. encounter order breaks equal-distance ties deterministically;
6. the three-target cap is honored;
7. propagation stops early when no eligible next target exists;
8. a later jump can reach an enemy outside the primary target's original radius, proving propagation is not ring aliasing;
9. recipients never repeat;
10. every recipient independently resolves magic accuracy, magic defense, and Light resistance;
11. one recipient's resistance does not alter another recipient;
12. action/result/event evidence records propagation order and per-jump origin/distance;
13. hostile attention is per recipient and excludes missed/unselected enemies;
14. save/load schema remains unchanged and no durable propagation state appears;
15. no movement, LOS, chain timer, field state, or general pathfinding system is introduced.

## Explicit non-goals

Not part of Packet 7:
- propagation delay between jumps;
- jump damage falloff;
- repeated-target bouncing;
- ally/friendly chaining;
- line/cone/arc trajectory collision;
- mutable combat positions;
- LOS/line-of-fire;
- pursuit/search/disengagement;
- player-selected ground targeting;
- new persistent state;
- broad adept migration;
- new abilities or mechanics-census filler.

## Closure discipline

Freeze the exact behavioral/data implementation SHA before Product/Data promotion and authority synchronization. `docs/THREAD_HANDOFF.md` remains the final repository-file write for the packet.
