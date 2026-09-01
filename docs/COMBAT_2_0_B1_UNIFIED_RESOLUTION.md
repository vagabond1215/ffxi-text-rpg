# Combat 2.0 Packet B1 — Unified Combat Resolution

Status: **COMPLETE / IMPLEMENTED ON MAIN.**

## Runtime result

```text
Product:       0.9.200.2
Package:       0.9.200
Account Save:  5
Game State:    15
Data:          64
Benchmark:     3
Codename:      Unified Combat Resolution
```

Behavioral implementation freeze:
- `20b7351a61f56203975e101ef04fd7311e110d9b`;
- Check #1860 / run `33457301272`;
- Repository Audit PASS;
- **832/832 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #1990 / run `33457300712` PASS.

The freeze deliberately used the prior Product/Data labels so runtime behavior could be validated before continuity/version synchronization. Product 0.9.200.2 / Data 64 is the promotion of that exact behavior plus manifest/authority synchronization.

## What B1 adds

New authority:
- `js/text/systems/combatResolutionEngine.js`.

The resolver now owns a common vocabulary for representative:
- physical/magical/hybrid channels;
- delivery;
- damage type;
- element and element source;
- physical/magic/automatic accuracy;
- physical defense, magic defense, magic evasion, or no-resistance models;
- defense penetration;
- critical eligibility/modifiers;
- deterministic status land/resist.

It consumes existing combat profiles and the existing canonical battle RNG. It does **not** own a clock, battle state, task family, or persistence schema.

## Representative migrations

### Basic melee attack

Basic melee now resolves through the shared physical accuracy/defense contract and records its structured resolution inside existing combat-action `data`.

This does not yet replace fixed basic-attack recovery with equipment `weaponDelay`; that belongs to later Slice B work.

### Ember Dart

Ember Dart now carries explicit:
- projectile delivery;
- magical channel;
- fire element;
- magic accuracy;
- magic-defense resolution;
- 2-second post-resolution recovery.

Fire resistance now materially changes its damage.

### Ridge Breaker

Ridge Breaker now carries explicit:
- melee physical impact;
- physical accuracy/defense;
- 25% defense penetration;
- critical eligibility;
- 4-second recovery.

This is the first bounded step toward making the **Breaker** name mechanically honest. It is not yet a full guard/stability subsystem.

### Rivet Guard

Rivet Guard now carries explicit physical/slashing resolution for its attack and 3-second recovery while retaining its existing defensive self-status.

### Fracture Sigil

Fracture Sigil now carries:
- magical sigil delivery;
- magic accuracy;
- magic-evasion resistance;
- deterministic land/resist behavior;
- 2-second recovery.

It is no longer an unconditional target debuff.

## Action timing

Canonical abilities now expose `recoverySeconds` separately from:
- startup/cast activation;
- cooldown.

Combat readiness enforces recovery.

A timed canonical activation also blocks overlapping basic attacks, the transitional arbitrary-string Weapon Skill path, and the transitional legacy cast path until the activation resolves or is interrupted.

## Persistence/version decision

### Data 63 -> 64

Required because canonical authored ability definitions changed:
- recovery metadata;
- structured resolution metadata.

No new ability records were added, so census breadth remains 41 abilities/techniques.

### Game State stays 15

B1 adds no required serialized state family and no new required `activeBattle` field.

Structured resolution evidence lives inside the already-existing flexible combat action `data` records. Combat contract version remains 2 and ability runtime version remains 1.

No supported-save migration, new timed-task owner, second battle state, or second combat clock was introduced.

## Legacy boundary

`performWeaponSkill(state, skillName)` and legacy `castSpell` remain compatibility/regression surfaces.

B1 deliberately does not add new advanced-combat semantics to them. Canonical techniques/spells continue moving through the ability/action contract.

## Deferred to later Slice B packets

Not part of B1:
- Enmity / Focus / Aggro / Fixation;
- timed loadout transitions;
- armor-pressure swap lock;
- weapon-delay attack cadence;
- first-class ranged attack;
- configurable weapon kata;
- affinity substitutions;
- auras, stances, zones, channels, reactions;
- broad ability-catalog expansion.

The next bounded unit is **B2 — Enemy Attention Foundation**, but it is not automatically started by B1 completion.
