# Advanced Combat 0.9.300 Packet 2 — Character Affinity & Kata Substitution Foundation

Status: **SELECTED / IMPLEMENTATION STARTED.**

Entry baseline:
```text
Product:       0.9.300.1
Package:       0.9.300
Account Save:  5
Game State:    19
Data:          68
Benchmark:     3
```

Permanent design authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Previous packet:
- `docs/ADVANCED_COMBAT_0_9_300_P1_MELEE_KATA_BREADTH.md`.

## Packet purpose

The current runtime has no canonical character elemental-affinity authority. Packet 2 establishes the smallest durable character-owned affinity state needed for earned elemental kata substitutions and proves that state through the existing weapon-kata and combat-resolution authorities.

Affinity is not a discipline/job identity, spell-knowledge alias, magic-skill alias, equipment field, or battle-local statistic. It belongs to the continuous character.

## Selected affinity contract

Persist:

```text
player.progression.affinities
```

as a versioned character-owned authority over the existing eight canonical element IDs:

```text
fire / ice / wind / earth / lightning / water / light / dark
```

The foundation uses small non-negative integer ranks. Rank 0 means no earned affinity; higher ranks are thresholds for authored capability/kata requirements. Packet 2 does not introduce a separate affinity XP economy.

Required runtime operations:
- create/ensure current affinity state;
- read an affinity rank;
- set or increase a rank through an explicit progression action;
- validate element IDs and rank bounds;
- preserve affinity independently of active discipline selection.

Knowing an elemental spell, possessing elemental-magic skill, or selecting Elementalist does **not** automatically manufacture affinity.

## Kata substitution contract

Elemental substitutions remain ordinary authored weapon-kata move options under the existing `weaponKataCatalog` / `weaponKataEngine` authority.

Eligibility is conjunctive:

```text
required weapon proficiency
AND
required character affinity
```

Physical defaults remain valid without affinity. If a configured substitution becomes ineligible, runtime selection falls back to the slot default rather than inventing invalid combat state.

The serialized kata configuration shape remains:

```text
version
selections[familyId][slot] = moveId
```

Therefore `WEAPON_KATA_CONFIGURATION_VERSION` should remain 2 unless implementation evidence requires a structural change. Encounter-local `activeBattle.weaponKata` also remains shape/version 1 unless a new field becomes necessary.

## Representative proof

Packet 2 authors exactly two representative substitutions:

1. **Dagger / slot 1 / Ice** — an accuracy-biased, lower-coefficient thrust demonstrating an elemental tradeoff against the physical opener.
2. **Staff / slot 3 / Fire** — a lower-physical-commitment elemental finishing drive demonstrating the same character affinity authority in a second weapon family.

Both use the unified combat-resolution contract. No separate elemental-kata damage resolver is allowed.

The existing melee attack profile may be widened only enough to pass structured element/channel/resistance metadata into `combatResolutionEngine`.

## Persistence/version expectation

If implementation is green:

```text
Product       0.9.300.1 -> 0.9.300.2
Package       0.9.300   -> 0.9.300
Account Save  5         -> 5
Game State    19        -> 20
Data          68        -> 69
Benchmark     3         -> 3
```

Why Game State 20:
- `player.progression.affinities` is a new required durable character fact affecting future combat choices.

Why Data 69:
- the canonical kata catalog gains two authored elemental substitution definitions.

No supported-save migration is added under the current pre-alpha current-schema-only policy.

## Focused proof requirements

Packet 2 is not complete until focused tests prove:
- new characters own valid affinity state;
- affinity survives discipline changes and is not inferred from discipline/spell knowledge;
- invalid element/rank state is rejected;
- physical defaults remain usable at affinity rank 0;
- substitution configuration rejects insufficient affinity and insufficient weapon proficiency independently;
- qualified affinity enables configuration;
- selected substitutions execute through the existing kata path;
- elemental resistance is visible in structured resolution evidence;
- physical kata behavior remains unchanged;
- affinity plus configured substitutions survive current-schema save/load;
- no new battle clock, timed-task owner, loadout authority, or duplicate combat resolver is introduced.

## Explicit non-goals

Packet 2 does **not** implement:
- weapon-supplied enchanted elements or weapon resonance;
- generic temporary imbuements;
- aura, stance, zone, channel, or reaction families;
- LOS/reachability/pursuit/search/disengagement;
- passive universal block/parry/guard/counter/interruption;
- named loadout presets;
- unsupported weapon-family kata;
- broad elemental kata authoring;
- broad recovered `/techniques` migration;
- mechanics-census filler.

## Closure discipline

Freeze the exact behavioral implementation SHA before Product/Game State/Data promotion and authority synchronization. `docs/THREAD_HANDOFF.md` remains the final repository-file write for the packet, followed only by hosted validation of that exact final head.
