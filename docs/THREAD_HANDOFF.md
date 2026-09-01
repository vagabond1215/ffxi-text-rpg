# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.200.6
Package:       0.9.200
Account Save:  5
Game State:    18
Data:          67
Benchmark:     3
Codename:      Brasshaven Redstone Combat Training
Runtime:       Node >=24
Phase:         0.9
0.9.100:       COMPLETE
0.9.200:       COMPLETE — Adventure Vertical Slices
Slice A:       COMPLETE
Slice B B1:    COMPLETE
Slice B B2:    COMPLETE
Slice B B3:    COMPLETE
Slice B B4:    COMPLETE
Slice B B5:    COMPLETE
Next track:    0.9.300 Advanced Combat / Training — QUEUED / NOT STARTED
```

## Latest bounded unit — Combat 2.0 Packet B5

Permanent record:
- `docs/COMBAT_2_0_B5_BRASSHAVEN_REDSTONE_TRAINING_PROOF.md`.

Permanent design authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Completed Slice B plan:
- `docs/COMBAT_2_0_SLICE_B_IMPLEMENTATION_PLAN.md`.

Adjacent/stale combat audit:
- `docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md`.

### Behavioral implementation freeze

`764faae437f3bc58d4d55a7e46dc4921a4a85c05`

Hosted evidence:
- Check #1939 / run `33472621389`;
- job `99745292387`;
- Repository Audit PASS;
- **855/855 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #2069 / run `33472620984` PASS.

This freeze intentionally predates Product/Data promotion and authority synchronization.

### Promoted synchronized-authority checkpoint before handoff

`34f637927036ac1807646cbd49e6e74cf0b2ddb4`

At this checkpoint:
- Product 0.9.200.6 / Data 67 promotion is complete;
- Game State remains 18;
- all current B5 release/design/architecture/lifecycle authorities are synchronized;
- `0.9.200 Adventure Vertical Slices` is marked COMPLETE;
- `0.9.300 Advanced Combat / Training` is queued/not started;
- Check #1943 / run `33473029839` confirms the Repository Audit's only failure is this handoff still advertising Product 0.9.200.5;
- no 0.9.300 implementation has started.

This handoff write is therefore the intended final repository mutation for B5.

## B4 foundation retained

The detailed B4 cadence/ranged/kata record below is retained because B5 directly integrates and regression-proves it.
## What B4 implements

### One weapon cadence authority

New stateless owner:
- `js/text/systems/weaponCadenceEngine.js`.

Representative conversion:

```text
recoverySeconds = round(weaponDelay / 60)
minimum = 1 second
```

Representative outcomes:
- Bronze Dagger 190 -> 3s;
- Bronze Sword 236 -> 4s;
- Bronze Axe 288 -> 5s;
- Ash Staff 366 -> 6s;
- Braided Sling 240 -> 4s.

Player and companion basic attacks now use equipped weapon cadence rather than one universal 3-second constant.

Enemy action recovery remains under the existing enemy action contract because seeded enemies do not share the player equipment/loadout model.

The underlying delay values remain provisional balance data with provenance; the conversion authority is now deterministic.

### First-class ranged action

New player action:
- `performPlayerRangedAttack()`.

It requires:
- an equipped ranged weapon;
- compatible equipped ammunition;
- canonical combat readiness;
- no active loadout transition;
- no conflicting active ability commitment.

It executes through:
- existing ranged skill inference;
- `derived.rangedAttack`;
- `derived.rangedAccuracy`;
- explicit ranged accuracy in `combatResolutionEngine`;
- physical defense;
- weapon-derived ranged cadence;
- structured combat action history.

Minimum B4 proof data:
- Braided Sling;
- Rounded Sling Stones.

The sling uses the existing `throwing` skill rather than inventing a new skill/cap table solely for the packet.

### Ammunition ownership

B4 creates no quiver or duplicate combat inventory.

The equipped `ammo` slot remains the physical item authority. `equipmentEngine.consumeEquippedItemQuantity()`:
- consumes one unit after a shot is resolved;
- clears the ammo slot when depleted;
- synchronizes active-battle player equipment;
- recomputes affected combat profiles.

One unit is consumed for every attempted shot, hit or miss.

### Minimal weapon kata

Authored authority:
- `js/text/data/weaponKataCatalog.js`.

Runtime/configuration owner:
- `js/text/systems/weaponKataEngine.js`.

B4 implements only representative physical sequence breadth:
- dagger;
- sword;
- up to three automatic sequence slots;
- slot count/options gated by character-owned learned proficiency;
- one configurable dagger opening;
- one manual dagger sequence interaction.

Dagger default:
1. Quick Thrust
2. Cross Cut
3. Driving Thrust

Sword default:
1. Forward Cut
2. Return Cut
3. Committed Cut

Dagger slot 1 can be configured to Careful Thrust once its proficiency requirement is met.

Manual proof:
- Recenter Cut resets the dagger sequence to slot 1.

Proficiency proof thresholds:
- learned 0 -> slot 1;
- learned 2 -> slots 1–2;
- learned 4 -> slots 1–3.

These are original Hearth & Horizon mechanics records, not recovered legacy weapon skills.

### Durable sequence state

Player configuration:
- `player.progression.weaponKata`.

Encounter-local state:
- `activeBattle.weaponKata.byActorId[actorId]`.

The active record carries:
- weapon family;
- next slot;
- last move;
- action count;
- reset count;
- last reset reason.

Kata configuration is blocked during active combat in B4.

### B3 reset intent is now consumed

B3 already recorded `resetWeaponSequence: true` for ordinary weapon-set transitions.

After successful B4-era loadout reconciliation:
- battle-player equipment is synchronized;
- the kata owner resets the sequence;
- the cursor rebinds to the newly equipped supported weapon family;
- structured loadout action evidence records the reset result.

This closes the B3 -> B4 handoff without moving loadout ownership into the kata engine.

## Interface adapters

Command adapter now exposes:
- `ranged [target]`;
- `kata [family]`;
- `kata set <family> <slot> <move>`;
- `kata use <move> [target]`.

The DOM contextual combat surface exposes **Ranged** only when the ranged/ammo loadout is valid.

These are adapters; they do not own combat state.

## Version / persistence decision

```text
Product       0.9.200.4 -> 0.9.200.5
Package       0.9.200   -> 0.9.200
Account Save  5         -> 5
Game State    17        -> 18
Data          65        -> 66
Benchmark     3         -> 3
```

### Game State 18

The bump is required because B4 adds outcome-affecting durable state:
- player kata selections;
- encounter-local next sequence cursor/reset state.

Without those fields, a resumed battle can choose a different next attack.

Active-battle persistence component version advances 3 -> 4.

No supported migration is added. Pre-alpha persistence remains strict current-schema-only.

### Data 66

The bump is independent and covers authored mechanics definitions:
- Braided Sling;
- Rounded Sling Stones;
- dagger/sword kata families and moves.

## B5 integrated proof and corrections

B5 reuses Marshal Varric Stone and his existing Brasshaven Market Ring POI as a bounded Forge-Road training contact. `trainingServiceEngine.js` owns only trainer/POI context and delegates actual learning to `capabilityEngine`; it adds no training progression registry, clock, task owner, commitment, or automatic relationship reward.

Player-facing training adds `training`, `train <technique>`, and semantic Learn/Review actions for the existing Ridge Breaker and Rivet Guard capabilities.

The focused guard `tests/playerBrasshavenRedstoneCombatTrainingFlow.test.js` proves:
- canonical Brasshaven -> South Redstone travel;
- B1 Rivet Guard, Ridge Breaker, and Ember Dart resolution;
- B2 player + companion attention/Aggro state;
- B3 timed weapon transition and armor-pressure blocking;
- pressure release through the already-recognized explicit hard-disable boundary, not invented LOS/pursuit state;
- B4 sword cadence/kata, first-class sling ammunition, and weapon-sequence reset;
- ordinary character-owned sword skill gain.

B5 also surfaced and fixed two integration defects:
1. partially consumed equipped ammo was valid runtime state but rejected by the older quantity-1 equipment validator; Game State 18 now permits a valid positive stack specifically in the canonical `ammo` slot while ordinary equipment retains strict non-stackable quantity-1 invariants;
2. locality action deduplication could collapse distinct actions at one POI or distinct capability-training actions; active-POI visibility and semantic deduplication keys now preserve those choices.

Version decision:
```text
Product       0.9.200.5 -> 0.9.200.6
Package       0.9.200   -> 0.9.200
Account Save  5         -> 5
Game State    18        -> 18
Data          66        -> 67
Benchmark     3         -> 3
```

Game State stays 18 because B5 adds no required durable state family. Data 67 records the authored Varric/POI combat-training metadata. No supported migration is added.
## Task/resource ownership

B4 adds **no direct timed-task owner**.

The current seven direct task owners remain:
- ability;
- campaign recovery;
- combat loadout;
- project;
- resource opportunity;
- transport;
- work task.

Weapon cadence is stateless. Kata config/cursor persists directly in player/active-battle state. Ranged shots are synchronous combat actions whose ammo mutation goes through equipment authority.

B5 also adds no direct timed-task owner. Training is synchronous context around capability progression and semantic events; the ammo-persistence repair changes validation of physical equipment state, not task lifecycle.

The stale architecture list that omitted B3's combat-loadout owner was corrected during B4 synchronization.

## Adjacent/stale boundaries carried forward

Do not build 0.9.300 on stale placeholders:
- `battle.targetId`;
- `battle.actionDelay`;
- `battle.recasts`;
- `battle.casting`.

Do not add new behavior to noncanonical legacy surfaces:
- root `js/ui.js` timer combat;
- root `js/encounter.js`;
- root `data/weaponskills.js`.

Exploration spawn detection `aggroEngine` remains separate from active-battle Aggro/Enmity.

## Explicitly deferred after B5

Do not silently treat these as implemented or absorb them into the first 0.9.300 packet without a fresh bounded decision:

1. full LOS/reachability/pursuit/search/disengagement simulation;
2. named prepared combat-loadout presets;
3. partial physical equipment state such as stowed-but-not-ready;
4. universal passive shield block/parry/guard/counter/interruption rolls;
5. broad recovered `/techniques` and discipline-menu migration;
6. elemental weapon-affinity kata substitutions;
7. broad kata catalogs for every weapon family;
8. generalized ranged line-of-fire geometry.

The B3 audit remains the authority for why these are not implied existing systems.

## `0.9.200 Adventure Vertical Slices` closure

The track is deliberately **COMPLETE**:
- Slice A — Slatewater Road Scout;
- B1 — Unified Combat Resolution;
- B2 — Enemy Attention Foundation;
- B3 — Combat Loadout Transitions;
- B4 — Weapon Cadence, Ranged Action, and Minimal Kata;
- B5 — Brasshaven / Redstone Combat-Training Proof.

Do not reopen these packets without a fresh bounded order identifying a concrete defect or extension.

## Next track — do not auto-start

**`0.9.300 Advanced Combat / Training` — QUEUED / NOT STARTED.**

A future explicit `continue` may select the first bounded 0.9.300 packet. It must not treat the entire permanent advanced-combat design as one implementation order.

Candidate domains include broader weapon-family kata, affinity substitutions, differentiated manual melee/ranged techniques, aura/stance/zone/channel/reaction mechanics, enemy technique/attention personality breadth, and differentiated ability expansion. None is pre-authorized as the first packet.
## Preserved interrupted/resumable circles

B5 completion does **not** cancel earlier queues.

- **Locality enrichment — deferred/resumable:** ambient/risk events, wandering/seasonal merchants, generalized directions/help dialogue, richer contextual dialogue, staged shop category/browse depth, learned-locality graphical presentation. Authority: `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md`.
- **Occupational Tool Conversion — preserved/queued:** strongest prepared `0.9.400 Economy / Production Depth` candidate. Authority: `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.
- **World edge — paused/resumable:** Waymeet Inner Marches / outer crossroads first, then Coppergrass extensions, then Drowned Vaults. Authorities: `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md`, `docs/WORLD_MACRO_TOPOLOGY.md`.
- **Ecology:** the five-part flora/fauna diversity repair sequence is COMPLETE. Do not restart without a fresh bounded work order.

## Standing governance rules

Preserve:
- one canonical fictional world clock;
- one domain authority per state family;
- active battle owns encounter/attention/loadout/kata encounter state;
- combat resolution owns hit/damage/resistance formulas;
- combat attention owns attention calculation/selection;
- combat loadout owns timed equipment transition/reconciliation;
- weapon cadence owns delay conversion only;
- weapon kata owns configuration/cursor semantics only;
- equipment/inventory remain physical item authorities;
- training service owns context only and delegates learning to capability progression;
- ability engine owns canonical activation/cooldowns;
- action history stores structured evidence; prose is not authority;
- current-schema-only pre-alpha persistence;
- Data and Game State advance independently;
- no hard benchmark timing thresholds;
- no census filler;
- exact behavioral implementation freeze before promotion/synchronization;
- `docs/THREAD_HANDOFF.md` is the final repository-file write for the packet.

## Restart order for a future 0.9.300 continuation

1. `AGENTS.md`
2. this handoff
3. `PROJECT_PROFILE.yaml`
4. `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`
5. `docs/COMBAT_2_0_B5_BRASSHAVEN_REDSTONE_TRAINING_PROOF.md`
6. `docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md`
7. `docs/COMBAT_2_0_SLICE_B_IMPLEMENTATION_PLAN.md` for completed proof context only
8. `docs/EXECUTION_PIPELINE.md`
9. `docs/ROADMAP.md`
10. `docs/ARCHITECTURE.md`
11. inspect current advanced-combat runtime/data and the stale/nonexistent boundaries above
12. select **one bounded 0.9.300 packet** with explicit non-goals before implementation
## Final validation contract

This handoff is the final repository-file mutation for B5 and the closing write for `0.9.200 Adventure Vertical Slices`.

After this write:
- perform **no repository-file mutations**;
- validate the exact resulting `main` SHA with hosted Check;
- confirm Repository Audit, **855/855 tests**, Census, Benchmark 3, and Benchmark Sample;
- confirm Pages succeeds on the same exact SHA;
- confirm `main` remains on that exact SHA after validation.

The final SHA and final Check/Pages run IDs are external validation evidence and must not be inserted by another repository write.
