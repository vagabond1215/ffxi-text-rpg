# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.200.2
Package:       0.9.200
Account Save:  5
Game State:    15
Data:          64
Benchmark:     3
Codename:      Unified Combat Resolution
Runtime:       Node >=24
Phase:         0.9
Track:         0.9.200 Adventure Vertical Slices ACTIVE
Slice A:       COMPLETE
Slice B B1:    COMPLETE
Next packet:   B2 Enemy Attention Foundation — QUEUED / NOT STARTED
```

## Latest bounded unit — Combat 2.0 Packet B1

Permanent record:
- `docs/COMBAT_2_0_B1_UNIFIED_RESOLUTION.md`.

Permanent design authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Slice B plan:
- `docs/COMBAT_2_0_SLICE_B_IMPLEMENTATION_PLAN.md`.

### Behavioral implementation freeze

`20b7351a61f56203975e101ef04fd7311e110d9b`

Hosted evidence:
- Check #1860 / run `33457301272`;
- job `99699909419`;
- Repository Audit PASS;
- **832/832 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #1990 / run `33457300712` PASS.

This freeze deliberately retained the prior Product/Data labels so runtime behavior could be validated before version/continuity synchronization.

### Promoted synchronized-authority checkpoint

`6c78dac5d0b296753ac9a7f28f39b9980e5e4085`

Hosted evidence:
- Check #1877 / run `33457770272`;
- job `99702030085`;
- Repository Audit PASS;
- **832/832 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #2007 / run `33457765562` PASS.

A later profile-only evidence write occurred before this final handoff. This handoff is the final repository-file mutation for B1. Do not mutate repository files after it before exact-head final validation.

## What B1 implements

New runtime authority:
- `js/text/systems/combatResolutionEngine.js`.

It is a **stateless combat-resolution authority**, not a second combat engine.

It provides a shared representative vocabulary for:
- physical / magical / hybrid channels;
- delivery type;
- damage type;
- element and element source;
- physical, magic, or automatic accuracy;
- physical defense, magic defense, magic evasion, or no-resistance models;
- defense penetration;
- critical eligibility/modifiers;
- deterministic target-status land/resist.

It consumes:
- existing combatant combat profiles;
- existing active-battle deterministic RNG.

It does not own:
- combatants;
- battle lifecycle;
- fictional time;
- ability tasks;
- status storage;
- cooldown storage;
- persistence.

## Representative B1 migrations

### Basic melee

Basic melee now uses the shared physical accuracy/defense contract and records structured resolution evidence in existing combat-action `data`.

Basic attack cadence is still the existing fixed player/companion recovery. Weapon-driven `weaponDelay` cadence remains B4 work.

### Ember Dart

Now explicitly resolves as:
- projectile delivery;
- magical channel;
- fire element;
- magic accuracy;
- magic-defense resolution;
- 2-second action recovery.

Fire resistance materially changes damage.

### Ridge Breaker

Now explicitly resolves as:
- melee physical impact;
- physical accuracy/defense;
- 25% defense penetration;
- critical eligibility;
- +5 critical-rate modifier;
- +50 critical bonus percentage;
- 4-second action recovery.

This makes the **Breaker** name materially more honest without yet creating a full guard/stability subsystem.

### Rivet Guard

Its attack now has:
- explicit melee physical/slashing resolution;
- physical accuracy/defense;
- 3-second recovery.

Its existing defensive self-status remains.

### Fracture Sigil

Now has:
- magical sigil delivery;
- magic accuracy;
- +5 accuracy modifier;
- magic-evasion resistance;
- deterministic land/resist;
- 2-second recovery.

It is no longer an unconditional target debuff.

## Canonical action timing

Canonical abilities now distinguish:
- activation/startup duration;
- post-resolution action recovery;
- cooldown.

Combat readiness enforces canonical recovery.

A timed canonical activation also blocks overlapping:
- basic attack;
- transitional arbitrary-string Weapon Skill;
- transitional legacy cast path.

The activation must resolve or be interrupted first.

## Legacy combat boundary

`performWeaponSkill(state, skillName)` and legacy `castSpell` remain compatibility/regression surfaces.

B1 adds no new advanced-combat semantics to those paths.

Canonical spells/techniques should continue migrating through:
- ability catalog;
- ability engine;
- shared combat action/resolution contract.

## Version / persistence decision

```text
Product       0.9.200.1 -> 0.9.200.2
Package       0.9.200   -> 0.9.200
Data          63        -> 64
Game State    15        -> 15
Account Save  5         -> 5
Benchmark     3         -> 3
```

### Why Data 64

Existing canonical ability records gained authored:
- `recoverySeconds`;
- structured resolution metadata.

No new ability record was added.

### Why Game State remains 15

B1 introduces no new **required** serialized state family.

Still true:
- `activeBattle.contract.version = 2`;
- ability runtime version = 1;
- resolution details are nested in already-existing flexible combat-action `data`;
- no supported-save migration;
- no new timed-task owner;
- no second clock;
- no second battle store.

## Current system versions changed by B1

```text
abilityCatalog     0.5.0
abilityEngine      0.4.0
battleEngine       0.9.0
combatTurns        0.3.2
combatActions      0.9.0
combatResolution   0.1.0
```

## Current census

Data 64 changes mechanics semantics, not breadth.

```text
places/localities                       55
named NPCs                              48
shop/service sites                      37
creatures                              123
resource sources                       143
canonical items                        408
recipes/processes                      234
abilities/techniques                    41
quests/contracts                        20
companions                               2
transport services                       7
raw resources with production demand  145 / 154
luxury raws with production demand      14 / 14
routes                                  25
NPC schedules                           27
regional/shared packs                   39
pack-owned records                    1325
runtime seed NPCs                       47
runtime seed enemies                    17
```

Mechanics-scale remains **NOT READY**:
- abilities/techniques 41/100;
- quests/contracts 20/30;
- companions 2/4;
- named NPCs 48/50.

Do not author disconnected or mechanically duplicate records merely to close census gaps.

## Next bounded unit — B2 only

**Packet B2 — Enemy Attention Foundation** is queued and **NOT STARTED**.

A future explicit `continue` should start B2 only.

### B2 design contract

Implement on the existing active-battle authority:

```text
absolute Enmity
    -> normalized Focus
    -> nonlinear target-selection weight
    -> sticky Aggro
    -> optional Fixation / Priority
```

Required properties:
- every credible party actor can have hostile-specific Enmity;
- baseline race/faction/species antagonism may contribute;
- action effects can change Enmity;
- decay/floors are authored/tunable;
- Focus is normalized relative attention;
- **Focus is not literal attack probability**;
- target reassessment applies nonlinear concentration;
- current target is sticky;
- retargeting happens on meaningful triggers, not every tick;
- no universal minimum target probability;
- Fixation/Priority can override ordinary switching while preserving underlying Enmity.

Representative proof should include three credible actors:
- one actor with elevated baseline hostility;
- a lower-Focus shield/tank actor landing a high-Enmity bash/stun-style action;
- one action materially changing Focus without necessarily stealing Aggro immediately;
- repeated tank actions eventually transferring Aggro;
- a low-Focus third actor becoming strongly de-weighted but not artificially forced to a fixed minimum.

### B2 persistence decision

Active battle persists through save/load.

If B2 attention tables, selected Aggro target, Fixation, decay deadlines, or other fields affect future resumable outcomes, they must be treated as real durable active-battle authority and receive an explicit Game State/schema decision.

Do not reconstruct meaningful attention state from battle prose.

## Later Slice B packets — not started

### B3
Timed combat loadout transitions:
- directional stow/draw/ready;
- quick weapon-set vs full loadout;
- cooldown preservation;
- interruption/disable rules;
- armor swap blocked under meaningful hostile pressure/pursuit/fixation.

### B4
Weapon cadence / ranged / minimal kata:
- one `weaponDelay` conversion/readiness authority;
- first-class ranged attack using ranged stats/skills/ammunition;
- minimal representative configurable weapon kata.

### B5
Playable Brasshaven / Redstone combat-training proof integrating B1–B4.

After B5, deliberately close `0.9.200` and open `0.9.300 Advanced Combat / Training`.

## Preserved interrupted/resumable circles

B1 completion does **not** cancel previous queues.

### Locality enrichment — DEFERRED / RESUMABLE

Foundation complete; still preserved:
- ambient/risk events;
- wandering/seasonal merchants;
- generalized direction/help dialogue;
- richer contextual dialogue;
- staged shop category/browse depth;
- learned-locality graphical presentation.

Authority:
- `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md`.

### Occupational Tool Conversion — PRESERVED / QUEUED

Still the strongest prepared `0.9.400 Economy / Production Depth` candidate.

Resume from the existing Packet A conversion list and `requiredToolTags` intent rather than restarting its audit.

Authority:
- `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.

### World edge — PAUSED / RESUMABLE

Ranking remains:
1. Waymeet Inner Marches / outer crossroads approach;
2. Coppergrass extensions;
3. Drowned Vaults.

Authorities:
- `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md`;
- `docs/WORLD_MACRO_TOPOLOGY.md`.

Combat Slice B deliberately reuses existing geography.

### Ecology

The five-part flora/fauna diversity repair sequence is **COMPLETE**, not interrupted.

Do not restart automatically. Any further ecology work requires a fresh bounded work order.

## Standing architecture/governance rules

Preserve:
- one canonical fictional world clock;
- one domain authority per state family;
- active battle owns encounter state;
- combat resolution owns formulas/results, not battle lifecycle;
- ability engine owns canonical ability activation/cooldowns;
- status engine owns status application/storage;
- action history stores structured evidence; prose is not authority;
- route graph owns inter-place travel;
- Pack v2 owns placement/dependencies, not duplicate definitions;
- current-schema-only pre-alpha persistence;
- no hard benchmark timing thresholds;
- no census filler;
- Game State changes only for genuine durable serialized contract changes;
- Data and Game State advance independently;
- exact implementation freeze before continuity sync;
- `docs/THREAD_HANDOFF.md` final repository-file write.

## Restart order for B2

1. `AGENTS.md`
2. this handoff
3. `PROJECT_PROFILE.yaml`
4. `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`
5. `docs/COMBAT_2_0_B1_UNIFIED_RESOLUTION.md`
6. `docs/COMBAT_2_0_SLICE_B_IMPLEMENTATION_PLAN.md`
7. `docs/EXECUTION_PIPELINE.md`
8. `docs/ROADMAP.md`
9. `docs/ARCHITECTURE.md`
10. `js/text/systems/combatTurnEngine.js`
11. `js/text/systems/battleEngine.js`
12. `js/text/systems/activeBattlePersistence.js`
13. companion/party combat integration and current-schema active-battle tests.

Do not restart broad combat research before inspecting these current authorities.

## Final validation contract

This handoff is the final repository-file mutation for B1.

After this write:
- perform **no repository-file mutations**;
- validate the exact resulting `main` SHA with hosted Check;
- confirm Repository Audit, 832/832 tests, Census, Benchmark 3, Benchmark Sample;
- confirm Pages succeeds on the same exact SHA.

The final SHA and final Check/Pages run IDs are external validation evidence and must not be inserted by another repository write.
