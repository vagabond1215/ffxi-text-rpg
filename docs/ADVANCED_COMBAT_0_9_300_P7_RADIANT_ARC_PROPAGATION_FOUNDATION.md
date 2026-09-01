# Advanced Combat 0.9.300 Packet 7 — Radiant Arc Propagation Foundation

Status: **COMPLETE / PRODUCT 0.9.300.7 / GAME STATE 21 / DATA 74.**

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

## Implementation result

### Geometry authority

`combatGeometryEngine.js` remains stateless and keeps `COMBAT_GEOMETRY_VERSION = 1`. Its authored target geometry now includes both `ring` and `arc`.

The new arc query:
- keeps the explicitly selected target as jump 1;
- derives every later jump from the previous recipient's encounter-relative formation position;
- considers only living opposing combatants not already visited;
- enforces the authored two-unit jump range;
- sorts candidates by distance, then encounter order, then stable ID;
- stops at three recipients or when no eligible jump remains.

Structured evidence records the primary target, jump range, target cap, repeat-target policy, ordering law, and each recipient's jump number, previous-recipient ID, distance, and derived position. No propagation record is stored on `activeBattle`.

### Radiant Arc authored contract

`ABILITY_CATALOG_VERSION` advances 10 -> 11.

Radiant Arc preserves its stable ability/capability IDs, Elemental Form / adept / Light identity, enemy targeting, six-second interruptible activation, 20 MP cost, 18-second cooldown, MND scaling, base 16, and coefficient 1.75.

It gains:
- `recoverySeconds: 3`;
- `area` / `propagation` tags;
- `arc` target geometry with jumpRange 2, maximumTargets 3, no repeats, and nearest-then-encounter-order selection;
- explicit Light magical resolution through magic accuracy, magic defense, and elemental resistance.

Executable ability count remains 41.

### Synchronous execution

No Packet-7-specific execution owner is added. The existing geometric ability path selects the full propagation chain synchronously, applies the target-recipient effect independently to every selected enemy, records the same geometry on the ability result/event/action, and uses explicit per-recipient attention.

A miss on an earlier recipient does not erase later recipients already selected by geometry. No propagation delay exists.

### Focused guard

Primary guard: `tests/advancedCombatRadiantArcPropagation.test.js`.

It proves catalog version 11, ability count 41, exact authored contract, primary-first chaining, nearest-target selection, deterministic tie behavior, three-target cap, early stop, no repeat targets, a later recipient outside the primary target's original two-unit radius, independent Light resistance, structured result/event/action evidence, per-recipient attention, missed-primary attention exclusion, no durable propagation state, and valid Game State 21 structure.

### Behavioral/data implementation freeze

`65f10a96d4e479b758981f3798efbfc1ddf059ec`

Hosted evidence:
- Check #2106 / run `33569913910`: Repository Audit PASS, **889/889 tests**, Census PASS, Benchmark 3 PASS, Benchmark Sample PASS;
- Pages #2236 / run `33569912530`: PASS.

Direct-main Check scheduling briefly remained pending while Pages ran. A validation-only PR #405 was opened from the exact implementation parent with only a branch-local CI marker; Check #2107 / run `33570292266` independently passed the same gate and PR #405 was closed without merge. The direct-main Check then completed successfully and remains the authoritative freeze evidence.

### Promotion result

Product 0.9.300.6 -> 0.9.300.7
Package 0.9.300 -> 0.9.300
Account Save 5 -> 5
Game State 21 -> 21
Data 73 -> 74
Benchmark 3 -> 3

System versions advance:
- version manifest: 0.9.300.6 -> 0.9.300.7;
- ability catalog: 0.9.0 -> 0.10.0;
- combat geometry: 0.2.0 -> 0.3.0.

Game State remains 21 because Arc leaves no future deadline, propagation cursor, delayed jump, or other durable fact after its action resolves. Data 74 records the changed Radiant Arc target geometry, Light resolution, tags, and recovery. No supported-save migration is added.

The first post-promotion Check #2109 / run `33570442119` stopped at Repository Audit with eight expected stale authority-baseline findings because Product/Data were promoted before the authority synchronization pass. No runtime or focused-test behavior failed.

## Next decision boundary

**No Packet 8 is selected.**

The strongest bounded continuation inside `0.9.300 Advanced Combat / Training` is now a **structured martial-technique migration tranche**, not another adept spell.

Recommended scope:
- choose one coherent existing martial set whose fiction fits current single-target mechanics, with Guarded Cut / Barkboar Brace / Thicket Feint as strong candidates;
- give selected techniques explicit physical delivery, damage type, resistance, critical eligibility, and recovery metadata;
- preserve their existing status/self-buff semantics and stable IDs;
- prove them through the existing resolution/action-history/training authorities;
- do not invent movement or reaction semantics merely because a technique name hints at them.

Reason: Packets 3–7 now provide representative direct elemental damage, control, radial geometry, persistent fields, and propagation. A martial tranche adds more architectural breadth than another spell-semantic packet.

After that tranche, perform an explicit `0.9.300` maturity reassessment rather than automatically continuing combat. The likely track switch is `0.9.400 Occupational Tool Conversion`, which remains the strongest prepared economy/production packet unless new evidence exposes a higher-priority combat blocker.

Other separately bounded alternatives remain Rimefall repeated/falling-area semantics, Flare Bloom expanding radial semantics, Fault Rush after real movement authority exists, engagement geometry / LOS / pursuit, weapon resonance / imbuement, passive defense/reactions, Waymeet Inner Marches, locality enrichment, and quest/social/companion depth.

Do not combine these automatically.

## Closure discipline

`docs/THREAD_HANDOFF.md` remains the final repository-file write for the packet, followed only by exact-head hosted validation.
