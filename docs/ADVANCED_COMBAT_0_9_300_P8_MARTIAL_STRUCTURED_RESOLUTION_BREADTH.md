# Advanced Combat 0.9.300 Packet 8 — Martial Structured Resolution Breadth

Status: **COMPLETE / PRODUCT 0.9.300.8 / GAME STATE 21 / DATA 75.**

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

## Implementation result

### Authored data changes

`ABILITY_CATALOG_VERSION` advances 11 -> 12.

Exactly three ability definitions change:
- Guarded Cut gains three-second recovery and sword/slashing physical resolution with no critical eligibility;
- Barkboar Brace gains four-second recovery and axe/slashing physical resolution with no critical eligibility;
- Thicket Feint gains two-second recovery and dagger/piercing physical resolution with existing-character critical eligibility.

No capability definition, learning path, equipment definition, status definition, ability count, or execution engine changes.

### Runtime behavior

The existing `abilityEngine` and `combatResolutionEngine` require no Packet-8-specific branch.

For each migrated technique:
1. capability/equipment/resource legality is checked through the existing capability path;
2. the target damage effect uses physical accuracy against evasion;
3. landed damage uses physical attack versus target physical defense;
4. physical variance uses the existing resolver;
5. critical behavior follows the authored eligibility flag;
6. the independent self-status effect resolves afterward;
7. combat action recovery uses the authored 3/4/2-second value;
8. ordinary action history stores the structured resolution evidence.

A target miss does not cancel the self-buff because Packet 8 deliberately preserves the pre-existing independent effect model.

### Focused guard

Primary guard:
- `tests/advancedCombatMartialStructuredResolution.test.js`.

It proves:
- ability catalog version 12;
- ability count 41;
- exact stable identity/cost/cooldown/potency/self-buff preservation for all three techniques;
- weapon-context gating;
- shared physical defense sensitivity;
- deterministic physical misses;
- self-buff application on a missed target attack;
- non-critical Guarded Cut/Barkboar Brace;
- critical-eligible Thicket Feint using existing critical stats;
- 3/4/2-second recovery;
- action-history resolution evidence;
- no martial/technique durable state family;
- valid Game State 21 structure.

### Behavioral/data implementation freeze

`4a89df88f408062aa3e90b1284c9c3497e248f6e`

Hosted evidence:
- Check #2132 / run `33575392561`;
- Repository Audit PASS;
- **895/895 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #2261 / run `33575391923` PASS.

### Promotion result

```text
Product       0.9.300.7 -> 0.9.300.8
Package       0.9.300   -> 0.9.300
Account Save  5         -> 5
Game State    21        -> 21
Data          74        -> 75
Benchmark     3         -> 3
```

System versions:
- version manifest 0.9.300.7 -> 0.9.300.8;
- ability catalog 0.10.0 -> 0.11.0.

Game State remains 21 because no new durable fact exists. Existing cooldowns, statuses, readiness, equipment/capability state, and action history already own all future consequences.

No supported-save migration is added.

## 0.9.300 maturity consequence

Packet 8 closes the current executable martial raw-damage gap:
- Guarded Cut — structured;
- Ridge Breaker — structured;
- Rivet Guard — structured;
- Barkboar Brace — structured;
- Thicket Feint — structured.

Together with Packets 3–7, the current combat substrate now has representative proofs for:
- direct elemental spell resolution;
- resistible hard control;
- target-centered radial geometry;
- persistent fields on fictional time;
- synchronous target-to-target propagation;
- all current executable martial techniques;
- weapon cadence/ranged/kata;
- affinity substitutions;
- hostile attention;
- timed combat loadout transitions.

This is sufficient evidence to stop auto-expanding combat by semantic family and reassess the track.

## Next decision boundary

**No Packet 9 is selected.**

The next bounded unit is an explicit **0.9.300 maturity reassessment**.

That reassessment should answer:
1. are any remaining combat defects blocking a coherent alpha loop, rather than merely enriching it?
2. do stale placeholders or legacy surfaces now justify one cleanup packet?
3. is engagement geometry / LOS / pursuit required before leaving the track, or can it remain a later depth program?
4. are passive block/parry/guard/counter/reaction mechanics required now, or are authored techniques/statuses sufficient for the present milestone?
5. should remaining spell names such as Rimefall / Flare Bloom stay deferred rather than forcing another semantics packet?
6. can `0.9.300` be paused/closed so the project returns to its broader persistent-life loop?

Expected recommendation absent a newly discovered blocker:
- treat `0.9.300` as mature enough to pause after the reassessment;
- switch to `0.9.400 Economy / Production Depth`;
- begin with **Occupational Tool Conversion** from `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.

The reassessment itself is a bounded decision unit. It must not silently implement Packet 9 or start 0.9.400.

## Closure discipline

`docs/THREAD_HANDOFF.md` remains the final repository-file write for the packet, followed only by exact-head hosted validation.
