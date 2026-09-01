# Advanced Combat 0.9.300 Packet 3 — Novice Elemental Resolution Breadth

Status: **SELECTED / IMPLEMENTATION STARTED.**

Entry baseline:
```text
Product:       0.9.300.2
Package:       0.9.300
Account Save:  5
Game State:    20
Data:          69
Benchmark:     3
```

Permanent combat authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Previous packet:
- `docs/ADVANCED_COMBAT_0_9_300_P2_CHARACTER_AFFINITY_KATA_SUBSTITUTION.md`.

## Why this packet is selected

The post-Packet-2 debt boundary lists action-contract/catalog migration first because much of the existing 41-ability catalog still resolves through generic pre-B1 behavior.

The smallest coherent high-leverage tranche is the eight existing **novice Elemental Form single-target attacks**:

- Cinder Bolt — fire;
- Stone Shards — earth;
- Gale Cutter — wind;
- Tide Needle — water;
- Storm Jolt — lightning;
- Rime Splinters — ice;
- Sunlance — light;
- Gloam Spike — dark.

These abilities already exist, are already shared universal capabilities, and already execute through `abilityEngine`. Their current damage effects have no structured resolution metadata, so elemental resistance and magic accuracy/defense are not actually part of their resolution.

This packet migrates those eight definitions into the already-implemented B1 combat-resolution vocabulary. It does **not** add new abilities.

## Selected contract

Each novice Elemental Form attack receives explicit:
- elemental identity matching its canonical tag;
- `elementSource: ability`;
- magical channel;
- magic accuracy;
- magic-defense resistance;
- non-critical default;
- explicit post-action recovery distinct from activation and cooldown.

All eight remain:
- single-target enemy actions;
- interruptible timed spells;
- existing MP costs/cooldowns/potency/scaling;
- existing capability IDs and learning requirements.

The packet does not invent geometry merely because later adept names imply rings, cages, wells, arcs, rushes, or falls.

## Why novice-only

The adept elemental tranche contains names such as **Tempest Ring**, **Thunder Cage**, and **Umbral Well** whose honest mechanics may require geometry, status, zone, or other action-family semantics that do not yet exist.

Migrating them only to elemental single-target damage would partially improve resistance behavior while deepening the mismatch between name and execution.

Packet 3 therefore stops at the novice tranche, whose names are compatible with direct single-target delivery.

## Expected version decision

If green:

```text
Product       0.9.300.2 -> 0.9.300.3
Package       0.9.300   -> 0.9.300
Account Save  5         -> 5
Game State    20        -> 20
Data          69        -> 70
Benchmark     3         -> 3
```

Game State should remain 20 because no durable serialized state shape changes.

Data should advance to 70 because eight canonical authored ability definitions gain executable resolution/recovery metadata.

No supported-save migration is added.

## Focused proof requirements

Packet 3 is complete only when tests prove:
1. the eight novice definitions retain their existing IDs, schools, capability links, costs, activation, cooldown, potency, and scaling;
2. each carries the correct canonical element;
3. each uses magic accuracy and magic defense through `combatResolutionEngine`;
4. target elemental resistance changes structured resolution evidence and damage;
5. all eight record explicit action recovery;
6. light still scales from MND while the other seven preserve their existing scaling stats;
7. ability count remains unchanged;
8. adept geometry-signaling names remain intentionally unmigrated;
9. no new combat clock, task owner, target geometry system, or state family is introduced.

## Explicit non-goals

Not part of Packet 3:
- adept Elemental Form migration;
- ring/cone/line/chain/zone geometry;
- Thunder Cage control/binding semantics;
- Umbral Well zone/persistent-field semantics;
- aura/stance/channel/reaction systems;
- weapon resonance or imbuement;
- passive defense reactions;
- broad martial-technique migration;
- Veilscript breadth migration;
- new abilities or census filler.

## Closure discipline

Freeze the exact behavioral/data implementation SHA before Product/Data promotion and repository authority synchronization. `docs/THREAD_HANDOFF.md` remains the final repository-file write for the packet.
