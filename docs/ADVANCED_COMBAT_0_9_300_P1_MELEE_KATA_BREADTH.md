# Advanced Combat 0.9.300 Packet 1 — Current Melee Kata Breadth

Status: **COMPLETE / PRODUCT 0.9.300.1 / GAME STATE 19 / DATA 68.**

Entry baseline:
```text
Product:       0.9.200.6
Package:       0.9.200
Account Save:  5
Game State:    18
Data:          67
Benchmark:     3
```

Permanent design authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Latest completed integration proof:
- `docs/COMBAT_2_0_B5_BRASSHAVEN_REDSTONE_TRAINING_PROOF.md`.

## Why this is the first 0.9.300 packet

B4 already established one canonical weapon-kata configuration/runtime owner, and B5 proved it in a real combat loop. The next lowest-risk advanced-combat step is therefore to broaden that proven authority across the remaining **currently equipped canonical melee weapon categories** that already have real equipment and skill support.

Selected families:
- `axe` — Bronze Axe / Woodsman Hatchet and Vanguard/Wildbinder skill identity;
- `staff` — Ash Staff and Pugilist/Elementalist/Eidolist skill identity where current skill-cap support exists;
- `club` — Maple Wand as the current canonical club-category main-hand weapon and Lifewarden/Elementalist/Spellblade skill identity.

Existing `dagger` and `sword` families remain unchanged except where shared validation/version plumbing requires synchronization.

## Explicit non-goals

This packet does **not** add:
- elemental affinity state or affinity-driven substitutions;
- weapon resonance or enchanted-weapon element rules;
- aura, stance, zone, channel, or reaction action families;
- LOS/reachability/pursuit/search/disengagement state;
- passive shield block/parry/guard/counter/interruption rolls;
- named prepared loadout presets;
- new weapons merely to manufacture kata coverage;
- great-axe, polearm, great-sword, katana, hand-to-hand, archery, or marksmanship kata without current canonical equipment/runtime support;
- new ability/capability records simply to increase the census.

## Bounded implementation contract

1. Extend `weaponKataCatalog` with original physical automatic sequences for `axe`, `staff`, and `club`.
2. Keep all moves inside the already-proven attack-profile vocabulary: scaling stat, coefficient, accuracy modifier, defense penetration, recovery multiplier.
3. Give the three families materially different profiles rather than numeric copies:
   - axe: commitment and increasing defense penetration at slower recovery;
   - staff: reach/control identity expressed through accuracy-biased early motions and a braced finishing drive;
   - club: compact accurate strikes with a modest committed finisher.
4. Preserve the same proficiency-gated 1/2/3 slot unlock law unless implementation evidence requires a separate rule.
5. Preserve one kata owner and one combat clock; no new timed-task owner.
6. Ensure loadout sequence reset automatically rebinds to the newly supported families.
7. Add focused tests for configuration validation, per-family sequence execution, cadence interaction, penetration/recovery evidence, and current-schema persistence.

## Persistence/version expectation

Expected promotion if the implementation is green:
```text
Product       0.9.200.6 -> 0.9.300.1
Package       0.9.200   -> 0.9.300
Account Save  5         -> 5
Game State    18        -> 19
Data          67        -> 68
Benchmark     3         -> 3
```

Game State is expected to advance because `player.progression.weaponKata` will require a new configuration version and durable selections for additional families. No supported migration is planned under the current pre-alpha policy.

Data is expected to advance because the canonical authored kata catalog gains new move/family definitions.

Battle kata record shape is expected to stay version 1 unless implementation requires a structural field change; widening the valid family references alone should not invent a new battle-state shape.

## Implementation result

The existing `weaponKataCatalog` and `weaponKataEngine` remain the only kata data/runtime authorities. Packet 1 adds three original automatic families:
- axe: Set Hew -> Hooking Chop -> Driving Cleave, with increasing defense penetration and slower committed recovery;
- staff: Measured Thrust -> Turning Sweep -> Braced Drive, with accuracy-biased early motions and a braced penetrating finish;
- club: Short Strike -> Returning Blow -> Braced Strike, with compact accuracy and a modest penetrating finish.

No new manual technique, ability/capability record, equipment item, task owner, combat clock, or battle-state field is added.

`WEAPON_KATA_CONFIGURATION_VERSION` advances 1 -> 2. `BATTLE_WEAPON_KATA_STATE_VERSION` remains 1.

### Behavioral implementation freeze

`ccd8d5ba6cc02928c0b93755b42c4f1f6aca0aef`

Hosted evidence:
- Check #1947 / run `33474558525`;
- job `99751006436`;
- Repository Audit PASS;
- **860/860 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #2077 / run `33474558121` PASS.

### Promotion result

```text
Product       0.9.200.6 -> 0.9.300.1
Package       0.9.200   -> 0.9.300
Account Save  5         -> 5
Game State    18        -> 19
Data          67        -> 68
Benchmark     3         -> 3
```

Game State 19 is required because player kata configuration version 2 adds required durable selections for axe/staff/club. Data 68 records the new authored move/family definitions. No supported migration is added.

### Next packet

**0.9.300 Packet 2 — Character Affinity & Kata Substitution Foundation — QUEUED / NOT STARTED.** The current runtime has no canonical character-affinity authority, so Packet 2 must establish the smallest durable affinity state before authoring representative elemental substitutions. It must not simultaneously add aura/stance/zone/channel/reaction or LOS/pursuit systems.

## Validation target

Focused guard:
- `tests/advancedCombatKataBreadth.test.js`.

Then run the full hosted gate before version promotion. The exact behavioral implementation SHA must be frozen before Product/Game State/Data synchronization.