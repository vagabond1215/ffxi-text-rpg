# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.200.5
Package:       0.9.200
Account Save:  5
Game State:    18
Data:          66
Benchmark:     3
Codename:      Weapon Cadence, Ranged Action, and Minimal Kata
Runtime:       Node >=24
Phase:         0.9
Track:         0.9.200 Adventure Vertical Slices ACTIVE
Slice A:       COMPLETE
Slice B B1:    COMPLETE
Slice B B2:    COMPLETE
Slice B B3:    COMPLETE
Slice B B4:    COMPLETE
Next packet:   B5 Playable Brasshaven / Redstone Combat-Training Proof — QUEUED / NOT STARTED
```

## Latest bounded unit — Combat 2.0 Packet B4

Permanent record:
- `docs/COMBAT_2_0_B4_WEAPON_CADENCE_RANGED_KATA.md`.

Permanent design authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Slice B plan:
- `docs/COMBAT_2_0_SLICE_B_IMPLEMENTATION_PLAN.md`.

Adjacent/stale combat audit:
- `docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md`.

### Behavioral implementation freeze

`0c3ef0a2720850d362cea06dffdbfd452f5a0c19`

Hosted evidence:
- Check #1925 / run `33470044213`;
- job `99737773726`;
- Repository Audit PASS;
- **852/852 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #2055 / run `33470043871` PASS.

This freeze intentionally predates Product/Game State/Data promotion.

### Promoted synchronized-authority checkpoint before handoff

`5bb4fd91db8cb017629beb20af573171702c5f92`

At this checkpoint:
- Product/Game State/Data promotion is complete;
- release authorities, design, architecture, lifecycle, roadmap, profile, and changelog are synchronized;
- Check #1929 confirms the **only Repository Audit failure** is that this handoff still advertised Product 0.9.200.4 / Game State 17;
- no B5 implementation has started.

This handoff write is therefore the intended final repository mutation for B4.

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

The stale architecture list that omitted B3's combat-loadout owner was corrected during B4 synchronization.

## Adjacent/stale boundaries carried forward

Do not build B5 on stale placeholders:
- `battle.targetId`;
- `battle.actionDelay`;
- `battle.recasts`;
- `battle.casting`.

Do not add new behavior to noncanonical legacy surfaces:
- root `js/ui.js` timer combat;
- root `js/encounter.js`;
- root `data/weaponskills.js`.

Exploration spawn detection `aggroEngine` remains separate from active-battle Aggro/Enmity.

## Explicitly deferred after B4

Do not silently absorb these into B5 unless required by the playable proof and explicitly bounded:

1. full LOS/reachability/pursuit/search/disengagement simulation;
2. named prepared combat-loadout presets;
3. partial physical equipment state such as stowed-but-not-ready;
4. universal passive shield block/parry/guard/counter/interruption rolls;
5. broad recovered `/techniques` and discipline-menu migration;
6. elemental weapon-affinity kata substitutions;
7. broad kata catalogs for every weapon family;
8. generalized ranged line-of-fire geometry.

The B3 audit remains the authority for why these are not implied existing systems.

## Next bounded unit — B5 only

**Packet B5 — Playable Brasshaven / Redstone Combat-Training Proof** is queued and **NOT STARTED**.

A future explicit `continue` should start B5 only.

B5's purpose is integration proof, not another generic combat foundation. It should use existing Brasshaven/Redstone geography and compose B1–B4 into a coherent playable training/combat loop.

Required proof should cover, where fiction and existing content support it:
- real existing training/service/social contact rather than a gratuitous new NPC;
- melee action through weapon cadence/kata;
- first-class ranged action and ammunition;
- at least one representative elemental/canonical ability;
- party attention;
- weapon-set transition;
- armor-pressure blocking;
- skill/proficiency progression;
- a defensible pressure-break/disengagement proof only if a real required state model is deliberately added.

B5 must not automatically implement every deferred combat mechanic merely because the design document describes a larger future model.

When B5 is green, deliberately decide whether `0.9.200 Adventure Vertical Slices` closes and `0.9.300 Advanced Combat / Training` opens. Do not assume that track transition before B5 validation.

## Preserved interrupted/resumable circles

B4 completion does **not** cancel earlier queues.

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
- ability engine owns canonical activation/cooldowns;
- action history stores structured evidence; prose is not authority;
- current-schema-only pre-alpha persistence;
- Data and Game State advance independently;
- no hard benchmark timing thresholds;
- no census filler;
- exact behavioral implementation freeze before promotion/synchronization;
- `docs/THREAD_HANDOFF.md` is the final repository-file write for the packet.

## Restart order for B5

1. `AGENTS.md`
2. this handoff
3. `PROJECT_PROFILE.yaml`
4. `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`
5. `docs/COMBAT_2_0_B4_WEAPON_CADENCE_RANGED_KATA.md`
6. `docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md`
7. `docs/COMBAT_2_0_SLICE_B_IMPLEMENTATION_PLAN.md`
8. `docs/EXECUTION_PIPELINE.md`
9. `docs/ROADMAP.md`
10. `docs/ARCHITECTURE.md`
11. existing Brasshaven/Redstone contacts/services/commitments/POIs
12. `js/text/systems/combatActionEngine.js`
13. `js/text/systems/combatTurnEngine.js`
14. `js/text/systems/combatAttentionEngine.js`
15. `js/text/systems/combatLoadoutEngine.js`
16. `js/text/systems/weaponCadenceEngine.js`
17. `js/text/systems/weaponKataEngine.js`
18. current-schema persistence and focused vertical-slice tests

## Final validation contract

This handoff is the final repository-file mutation for B4.

After this write:
- perform **no repository-file mutations**;
- validate the exact resulting `main` SHA with hosted Check;
- confirm Repository Audit, **852/852 tests**, Census, Benchmark 3, and Benchmark Sample;
- confirm Pages succeeds on the same exact SHA;
- confirm `main` remains on that exact SHA after validation.

The final SHA and final Check/Pages run IDs are external validation evidence and must not be inserted by another repository write.
