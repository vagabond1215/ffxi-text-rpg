# Execution Pipeline

Operational continuation path for Hearth & Horizon.

## Current baseline

```text
Product:       0.9.300.1
Package:       0.9.300
Account Save:  5
Game State:    19
Data:          68
Benchmark:     3
Codename:      Current Melee Kata Breadth
```

## Current bounded-unit state

**0.9.300 Packet 1 — Current Melee Kata Breadth** is the latest bounded unit on `main`; `0.9.300 Advanced Combat / Training` is ACTIVE.

- permanent record `docs/ADVANCED_COMBAT_0_9_300_P1_MELEE_KATA_BREADTH.md`;
- Product 0.9.300.1 / Package 0.9.300 / Game State 19 / Data 68 / Account Save 5 / Benchmark 3;
- behavioral implementation freeze `ccd8d5ba6cc02928c0b93755b42c4f1f6aca0aef`;
- Check #1947 / run `33474558525`: Repository Audit, **860/860 tests**, Census, Benchmark 3, and Benchmark Sample green;
- Pages #2077 / run `33474558121`: green.

B2 adds one stateless combat-attention calculation authority while durable attention remains inside existing `activeBattle`. Hostile-specific entries carry baseline/transient Enmity, floors/decay, sticky Aggro, Fixation, and tuning policy; combat actions feed the same attention seam.

Game State advances 15 -> 16 because those fields change future resumable target selection and therefore cannot be reconstructed safely from prose or canonical catalogs. Data stays 64 because no authored content records changed.

The previous Local Knowledge & Familiarity Foundation remains complete:
- implementation freeze `da168ddff6cc9e3611c9b8c06165b117081ea5c0`;
- Check #1770 / run `33355620265`;
- 823/823 tests plus full hosted gate.

Packet E / Content Scale Gate A remains PASS / COMPLETE. The five-part flora/fauna repair sequence remains complete through Data 62 and is not reopened.

## Data 68 metrics

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

Creature breadth now clears the playable-alpha planning lower bound of 120. This does not make the mechanics-scale gate ready.

## Regional resilience rule

Established settlements do not need identical local resource catalogs. Audit the **local region plus dependable trade partners** for staple food, structural stock, metal, bindings, fuel, medicine, preservation, and practical workstation access.

Prefer ordinary substitutes over duplicated specialties:
- local Willow/Thornwood/Stonepine charcoal can substitute for Crown Oak charcoal;
- dry smoking can preserve fish when trade salt is unavailable, at lower yield;
- common clay/stone/wood should exist when the established biome plainly implies it;
- silver, gold, premium timber, pearls, specialty dyes, and similar premium materials may remain geographically distinct.

Coppergrass remains a transit wilderness: the Forge-Mere route physically crosses it, but no staffed locality or scheduled boarding stop should be inferred until one is deliberately authored.

## Standing zone-authoring rule

Every newly authored zone should, where ecologically appropriate, include:

1. plausible biome/geography;
2. common-sense flora/fauna niches;
3. populations and/or encounter/catch/recovery paths;
4. resources/drops/catches with provenance;
5. connected processing and recipes;
6. intentional economic/use sinks;
7. explicit food-consumption safety for food-capable items, presented as practical late-medieval/fantasy preparation knowledge;
8. no conversion of passive wildlife into aggression merely to force drops.

See `docs/ITEM_CONSUMPTION_SAFETY.md`.

## Mechanics-floor status

Reached:
- places;
- shop/service sites;
- creatures;
- resource sources;
- recipes/processes;
- transport services.

Still short:
- companions: 2/4;
- abilities/techniques: 41/100;
- named NPCs: 48/50;
- quests/contracts: 20/30;

Do not close these gaps with disconnected filler. Canonical items now exceed their mechanics floor through connected material stocks/components.

## Macro-world topology state

The prior geography hold is resolved by `docs/WORLD_MACRO_TOPOLOGY.md`.

Locked model:

- continuous irregular macro geography;
- no global hex/square world tessellation;
- route graph owns inter-place traversability, distance, time, hazards, and travel modes;
- local place grids/topologies remain fine-exploration abstractions;
- Great Mere drains east through a future brackish delta to the Eastern Sea;
- Waymeet is approached overland through Headwater Vale and additional plateau/march country;
- Emberwash is the northern arid frontier, not a direct Veyra adjacency.

Headwater Vale, Starfen Delta / Brackish Coast, Gloamwood & Oldbough Refuge, Emberwash Badlands & Cinderwell Station, Lower Deepvein & Lantern Sump Station, and Waymeet Marches & Cairnward Relay are complete through Data 57. The route graph reaches Waymeet South Marches but not the inner marches or Waymeet. Next ranked world-edge candidate: **Waymeet Inner Marches / outer crossroads approach**. It is queued, not auto-authorized.

## Next bounded material-culture candidate

- Occupational Tool Conversion: turn existing shop/equipment-only tools and starter metal/leather goods into real production outputs, then add shared smithing/woodworking/masonry/textile/leatherworking/cooking/measurement tools.
- This is queued but not auto-authorized.
- See `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.

## Next selected implementation

`0.9.200 Adventure Vertical Slices` is COMPLETE. `0.9.300 Advanced Combat / Training` is ACTIVE. Packet 1 — Current Melee Kata Breadth — is complete.

### Latest completed unit — Packet B2

**Enemy Attention Foundation — COMPLETE.**

Behavioral freeze `92e6d1623470fbc923ef9beebe148829418b7080` passed Check #1881 / run `33459747237` with Repository Audit, **837/837 tests**, Census, Benchmark 3, and Benchmark Sample. Pages #2011 / run `33459746331` passed.

B2 implements:
- absolute hostile-specific Enmity entries for every credible ally;
- baseline, transient, floor, and fictional-time decay semantics;
- normalized Focus;
- nonlinear concentration weighting;
- sticky Aggro with thresholded reassessment;
- explicit Fixation/Priority preserving underlying Enmity;
- common combat-action Enmity input;
- required active-battle persistence validation.

Focus is not literal attack probability. There is no universal minimum target probability.

### Latest completed unit — Packet B3

**Combat Loadout Transition Foundation — COMPLETE.**

Permanent record: `docs/COMBAT_2_0_B3_LOADOUT_TRANSITIONS.md`.

Behavioral freeze `3ef9a1c48f22911fe90a08a60c03a72c09d7fd67` passed Check #1908 / run `33462594046` with Repository Audit, **844/844 tests**, Census, Benchmark 3, and Benchmark Sample. Pages #2038 / run `33462592986` passed.

B3 adds `combatLoadoutEngine.js` as the seventh direct timed-task owner, persists `activeBattle.loadoutTransition`, closes direct active-combat equipment mutation, preserves canonical cooldowns, synchronizes root/battle equipment on completion, and enforces B2 Aggro/Focus/Fixation armor pressure. Game State advances 16 -> 17; Data advances 64 -> 65 for authored handling metadata.

### Latest completed unit — Packet B4

**Weapon Cadence, Ranged Action, and Minimal Kata — COMPLETE.**

Permanent record: `docs/COMBAT_2_0_B4_WEAPON_CADENCE_RANGED_KATA.md`.

Behavioral freeze `0c3ef0a2720850d362cea06dffdbfd452f5a0c19` passed Check #1925 / run `33470044213` with Repository Audit, **852/852 tests**, Census, Benchmark 3, and Benchmark Sample. Pages #2055 / run `33470043871` passed.

B4 centralizes weapon-delay conversion, routes player and companion basic attacks through equipment-derived cadence, adds a first-class ranged action using ranged stats and equipped ammunition, and persists minimal dagger/sword kata configuration plus encounter cursor state. B3 weapon-set reset intent is now consumed by the kata owner.

Game State advances 17 -> 18 because kata configuration/cursor state changes resumable combat outcomes. Data advances 65 -> 66 because B4 adds authored sling/ammunition and kata definitions.

### Latest completed unit — Packet B5

**Playable Brasshaven / Redstone Combat-Training Proof — COMPLETE.**

Permanent record: `docs/COMBAT_2_0_B5_BRASSHAVEN_REDSTONE_TRAINING_PROOF.md`.

Behavioral freeze `764faae437f3bc58d4d55a7e46dc4921a4a85c05` passed Check #1939 / run `33472621389` with Repository Audit, **855/855 tests**, Census, Benchmark 3, and Benchmark Sample. Pages #2069 / run `33472620984` passed.

B5 adds a stateless Varric training-service adapter delegating to capability progression, proves B1–B4 together in South Redstone, fixes partially consumed ammo persistence under Game State 18, and fixes same-POI contextual-action deduplication. Game State stays 18; Data advances 66 -> 67 for authored Varric/POI training metadata.

### Next track

**0.9.300 Advanced Combat / Training — QUEUED / NOT STARTED.** A future explicit continuation must select its first bounded packet; B5 does not auto-start it.

### Next bounded unit — 0.9.300 Packet 2

**Character Affinity & Kata Substitution Foundation — QUEUED / NOT STARTED.**

The current runtime has no canonical character-affinity state. Packet 2 must first define the smallest durable affinity authority needed for earned elemental kata substitutions, then prove one or two representative substitutions through the existing weapon-kata/combat-resolution contracts. It must not simultaneously add aura/stance/zone/channel/reaction families or a broad elemental move catalog.

## Preserved interrupted/resumable queues

Combat selection does not erase earlier circles:

- **Locality enrichment:** ambient/risk events, wandering merchants, generalized directions/help dialogue, richer conversation, shop browse/category depth, learned-locality graphical presentation. Foundation is complete; enrichment remains deferred.
- **Occupational Tool Conversion:** still the strongest prepared `0.9.400` economy/production packet; authority `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.
- **World edge:** Waymeet Inner Marches / outer crossroads approach remains first, then Coppergrass extensions, then Drowned Vaults.
- **Optional ecology:** five-part repair sequence is complete; any new ecology work requires fresh selection.

These are resumable queues, not canceled work. None should be silently folded into B1.


## Validation

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```
