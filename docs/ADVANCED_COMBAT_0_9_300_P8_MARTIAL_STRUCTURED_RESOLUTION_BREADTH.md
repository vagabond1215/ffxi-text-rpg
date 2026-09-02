# Advanced Combat 0.9.300 Packet 8 — Martial Structured Resolution Breadth

Status: **SELECTED / IMPLEMENTATION STARTED.**

Entry baseline:
```text
Product:       0.9.300.7
Package:       0.9.300
Account Save:  5
Game State:    21
Data:          74
Benchmark:     3
```

Permanent combat authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Previous packet:
- `docs/ADVANCED_COMBAT_0_9_300_P7_RADIANT_ARC_PROPAGATION_FOUNDATION.md`.

## Why this packet is selected

Packets 3–7 establish representative structured spell semantics across direct elemental damage, control, radial targeting, persistent fields, and propagation.

The remaining existing martial techniques are uneven:
- Ridge Breaker already uses shared physical accuracy, physical defense, penetration, criticals, and recovery;
- Rivet Guard already uses shared physical accuracy/defense and recovery;
- Guarded Cut, Barkboar Brace, and Thicket Feint still apply raw fixed damage without hit/defense evidence or canonical action recovery.

Packet 8 closes that bounded martial inconsistency without creating another combat subsystem or manufacturing new abilities.

## Selected tranche

Exactly three existing techniques are migrated:

### Guarded Cut

Preserve:
- `ability-guarded-cut`;
- `technique-guarded-cut`;
- sword requirement;
- STR scaling;
- base 4;
- coefficient 0.9;
- 250 TP;
- 8-second cooldown;
- 12-second self Guarded Cut status;
- defense +2 and `guarded` flag.

Add:
```text
recoverySeconds: 3
delivery: melee
channel: physical
damageType: slashing
accuracyModel: physical
resistanceModel: physicalDefense
criticalEligible: false
```

### Barkboar Brace

Preserve:
- `ability-barkboar-brace`;
- `technique-barkboar-brace`;
- axe requirement;
- STR scaling;
- base 6;
- coefficient 1.05;
- 300 TP;
- 10-second cooldown;
- 15-second self Barkboar Brace status;
- defense +3 and `braced` flag.

Add:
```text
recoverySeconds: 4
delivery: melee
channel: physical
damageType: slashing
accuracyModel: physical
resistanceModel: physicalDefense
criticalEligible: false
```

### Thicket Feint

Preserve:
- `ability-thicket-feint`;
- `technique-thicket-feint`;
- dagger requirement;
- DEX scaling;
- base 5;
- coefficient 1.0;
- 225 TP;
- 8-second cooldown;
- 10-second self Thicket Feint status;
- defense +1 and `mobile` flag.

Add:
```text
recoverySeconds: 2
delivery: melee
channel: physical
damageType: piercing
accuracyModel: physical
resistanceModel: physicalDefense
criticalEligible: true
```

No critical-rate or critical-damage bonus is authored for Thicket Feint; it simply participates in the character's existing canonical critical stats.

## Effect-order law

The existing ability engine resolves effects independently in authored order.

For these techniques:
1. target damage resolves first;
2. the self-buff resolves second.

The self-buff is not conditional on target damage landing. A missed Guarded Cut still represents a guarded follow-through; a missed Barkboar Brace still leaves the actor braced; a missed Thicket Feint still leaves the actor in the authored mobile/feint state.

Packet 8 does not introduce effect dependency or combo state.

## Resolution/attention law

All three migrated damage effects use the existing `combatResolutionEngine`.

That means:
- target evasion can cause a miss;
- target physical defense changes damage;
- physical variance uses the existing resolver;
- Thicket Feint may critically strike using existing critical stats;
- Guarded Cut and Barkboar Brace cannot critically strike;
- structured resolution evidence appears on ability results and ordinary combat actions.

Existing attention logic consumes the resulting applied enemy damage effect. A miss does not create damage-derived enemy attention; the self-buff does not target the enemy.

## Persistence/version expectation

If green:
```text
Product       0.9.300.7 -> 0.9.300.8
Package       0.9.300   -> 0.9.300
Account Save  5         -> 5
Game State    21        -> 21
Data          74        -> 75
Benchmark     3         -> 3
```

Game State remains 21 because Packet 8 changes authored ability resolution/recovery only. Existing statuses, cooldown timestamps, readiness, action history, and capability/equipment state already persist under current authority.

Data advances because three canonical ability definitions change.

Expected system-version change:
- ability catalog only.

No supported-save migration is planned.

## Focused proof requirements

Packet 8 is complete only when tests prove:
1. ability count remains 41 and catalog validation passes;
2. exactly Guarded Cut, Barkboar Brace, and Thicket Feint receive the selected structured physical contracts;
3. their stable IDs, capability links, target kind, activation, TP cost, cooldown, base potency, scaling stat/coefficient, and existing self-buff definitions remain intact;
4. Guarded Cut requires sword capability context and records slashing physical resolution;
5. Barkboar Brace requires axe capability context and records slashing physical resolution;
6. Thicket Feint requires dagger capability context and records piercing physical resolution;
7. increased target physical defense lowers landed damage through shared resolution;
8. physical accuracy can miss deterministically;
9. a missed attack still applies the authored self-buff;
10. Guarded Cut and Barkboar Brace are explicitly non-critical;
11. Thicket Feint is critical-eligible and can use existing critical stats;
12. recovery is 3/4/2 seconds respectively;
13. ordinary action history contains the same structured resolution evidence;
14. no new state family, clock, timed-task owner, movement, reaction, combo, stance, or passive-defense system is introduced;
15. current-schema Game State 21 remains valid.

## Explicit non-goals

Not part of Packet 8:
- Shadow Feint migration;
- new martial techniques;
- movement or repositioning from `mobile`/feint terminology;
- guard/parry/block/counter execution;
- reaction windows;
- combo chains;
- weapon resonance;
- loadout presets;
- broad legacy Weapon Skill migration;
- broad ability-catalog cleanup;
- mechanics-census filler.

## Closure discipline

Freeze the exact behavioral/data implementation SHA before Product/Data promotion and authority synchronization. `docs/THREAD_HANDOFF.md` remains the final repository-file write for the packet.
