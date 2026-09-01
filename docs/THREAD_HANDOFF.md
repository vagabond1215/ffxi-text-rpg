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

Behavioral implementation freeze:
- `20b7351a61f56203975e101ef04fd7311e110d9b`;
- Check #1860 / run `33457301272`;
- Repository Audit PASS;
- **832/832 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #1990 / run `33457300712` PASS.

B1 adds `combatResolutionEngine.js` and representative shared resolution for:
- basic melee physical accuracy/defense;
- Ember Dart magic accuracy/magic defense/fire resistance;
- Ridge Breaker defense penetration/critical eligibility;
- Rivet Guard explicit physical resolution;
- Fracture Sigil deterministic land/resist;
- explicit canonical ability recovery distinct from activation/cooldown;
- action commitment that prevents overlapping basic/legacy actions during timed canonical activation.

No new ability record was added; abilities/techniques remain 41.

## Version / persistence decision

```text
Product       0.9.200.1 -> 0.9.200.2
Package       0.9.200   -> 0.9.200
Data          63        -> 64
Game State    15        -> 15
Account Save  5         -> 5
Benchmark     3         -> 3
```

Data advances because existing canonical ability records gain authored recovery/resolution metadata.

Game State remains 15:
- active battle combat contract remains version 2;
- ability runtime remains version 1;
- no new required serialized state family;
- structured resolution lives inside existing combat action `data`;
- no supported-save migration;
- no new timer/task owner;
- no second combat clock or battle store.

## Current mechanics-scale census

```text
places/localities       55
named NPCs              48
shop/service sites      37
creatures              123
resource sources       143
canonical items        408
recipes/processes      234
abilities/techniques    41
quests/contracts        20
companions               2
transport services       7
routes                   25
NPC schedules            27
regional/shared packs    39
pack-owned records     1325
runtime seed NPCs        47
runtime seed enemies     17
```

Mechanics-scale remains NOT READY:
- abilities/techniques 41/100;
- quests/contracts 20/30;
- companions 2/4;
- named NPCs 48/50.

Do not close these gaps with disconnected/mechanically duplicate filler.

## Next bounded unit — B2 only

**Packet B2 — Enemy Attention Foundation** is queued and **NOT STARTED**.

A future explicit `continue` should begin B2 only.

B2 design target:
- absolute Enmity per hostile/credible actor;
- normalized Focus;
- nonlinear target-selection weighting;
- sticky current Aggro;
- explicit Fixation/Priority;
- deterministic 3-actor proof;
- baseline race/faction/species antagonism without hard-scripted universal targeting;
- no universal minimum target probability;
- retarget only on meaningful reassessment triggers.

Because active battle persists, B2 must make an explicit Game State decision if attention tables/current target/fixation become required durable outcome-affecting state.

Do not start B3/B4/B5 automatically.

## Later Slice B packets

- B3 — timed combat loadout transitions and armor-pressure locking;
- B4 — weapon-delay cadence, first-class ranged attacks, minimal configurable kata;
- B5 — playable Brasshaven / Redstone combat-training proof.

After B5, deliberately close 0.9.200 and open 0.9.300 Advanced Combat / Training.

## Preserved interrupted/resumable circles

Combat work does not erase earlier queues.

### Locality enrichment — DEFERRED / RESUMABLE
- ambient/risk events;
- wandering/seasonal merchants;
- generalized directions/help;
- richer contextual dialogue;
- staged shop browse/category depth;
- learned-locality graphical presentation.

Authority: `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md`.

### Occupational Tool Conversion — PRESERVED / QUEUED
Still strongest prepared `0.9.400 Economy / Production Depth` candidate.

Authority: `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.

### World-edge continuation — PAUSED / RESUMABLE
1. Waymeet Inner Marches / outer crossroads approach;
2. Coppergrass extensions;
3. Drowned Vaults.

Authorities:
- `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md`;
- `docs/WORLD_MACRO_TOPOLOGY.md`.

### Ecology
The five-part flora/fauna repair sequence is COMPLETE, not interrupted. Do not restart automatically.

## Standing combat architecture rules

- one canonical fictional-time authority;
- active battle owns encounter state;
- ability engine owns canonical ability activation/cooldowns;
- combat resolution is stateless formula/resolution authority, not a second battle engine;
- action history stores structured evidence; prose is not authority;
- Focus is not direct target probability;
- cooldowns belong to canonical abilities, never loadout slots;
- legacy arbitrary-string Weapon Skill / cast paths are transitional compatibility surfaces and receive no new advanced-combat semantics;
- no mass ability authoring before the execution contract supports meaningful differentiation.

## Restart order for B2

1. `AGENTS.md`;
2. this handoff;
3. `PROJECT_PROFILE.yaml`;
4. `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`;
5. `docs/COMBAT_2_0_B1_UNIFIED_RESOLUTION.md`;
6. `docs/COMBAT_2_0_SLICE_B_IMPLEMENTATION_PLAN.md`;
7. `docs/EXECUTION_PIPELINE.md`;
8. `docs/ROADMAP.md`;
9. active battle/combat-turn/persistence files relevant to attention.

This is an interim synchronized handoff for promoted-contract validation. The final handoff must be the final repository-file mutation after a green synchronized Check/Pages run.
