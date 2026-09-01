# Execution Pipeline

Operational continuation path for Hearth & Horizon.

## Current baseline

```text
Product:       0.9.200.3
Package:       0.9.200
Account Save:  5
Game State:    16
Data:          64
Benchmark:     3
Codename:      Enemy Attention Foundation
```

## Current bounded-unit state

**Combat 2.0 Packet B2 — Enemy Attention Foundation** is the latest bounded unit on `main`.

- permanent record `docs/COMBAT_2_0_B1_UNIFIED_RESOLUTION.md`;
- Product 0.9.200.3 / Package 0.9.200 / Game State 16 / Data 64 / Account Save 5 / Benchmark 3;
- behavioral implementation freeze `20b7351a61f56203975e101ef04fd7311e110d9b`;
- Check #1860 / run `33457301272`: Repository Audit, **832/832 tests**, Census, Benchmark 3, and Benchmark Sample green;
- Pages #1990 / run `33457300712`: green.

B2 adds one stateless combat-attention calculation authority while durable attention remains inside existing `activeBattle`. Hostile-specific entries carry baseline/transient Enmity, floors/decay, sticky Aggro, Fixation, and tuning policy; combat actions feed the same attention seam.

Game State advances 15 -> 16 because those fields change future resumable target selection and therefore cannot be reconstructed safely from prose or canonical catalogs. Data stays 64 because no authored content records changed.

The previous Local Knowledge & Familiarity Foundation remains complete:
- implementation freeze `da168ddff6cc9e3611c9b8c06165b117081ea5c0`;
- Check #1770 / run `33355620265`;
- 823/823 tests plus full hosted gate.

Packet E / Content Scale Gate A remains PASS / COMPLETE. The five-part flora/fauna repair sequence remains complete through Data 62 and is not reopened.

## Data 64 metrics

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

Adventure Vertical Slice B remains the active formal track.

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

### Next bounded unit — Packet B3

**Combat Loadout Transition Foundation — QUEUED / ENTRY AUDIT COMPLETE.**

Fresh authority: `docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md`.

The audit identifies one live B3 defect: direct equipment commands can mutate root equipment during active combat while the encounter combatant remains a snapshot. B3 must close that split through a canonical timed loadout owner. It also records exploration detection/combat Aggro separation, stale battle placeholders, legacy timer-combat boundaries, and genuinely nonexistent LOS/pursuit/kata systems so they are not accidentally reused.

B3 should add timed directional stow/draw/ready transitions, distinguish prepared quick weapon-set swaps from full loadout changes, preserve canonical ability cooldowns, and block armor swaps under meaningful Aggro/Focus/Fixation pressure. Pursuit/LOS remains conservative until a real engagement model exists.

Later B4 weapon cadence/ranged/minimal kata and B5 playable Brasshaven/Redstone proof remain separately bounded.


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
