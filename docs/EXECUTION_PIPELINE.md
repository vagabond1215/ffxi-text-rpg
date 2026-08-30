# Execution Pipeline

Operational continuation path for Hearth & Horizon.

## Current baseline

```text
Product:       0.9.100.23
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          62
Benchmark:     3
Codename:      Cross-Biome Family Breadth
```

## Current bounded-unit state

**Cross-Biome Family Breadth** is the latest runtime/data bounded unit on `main`.

- Plan commit: `b6b0c309c60357916550d92928f86d07847229f8`.
- Implementation freeze: `c5e12b5d8f0b6ddf7a76f5df01316567b43d4528`.
- Check #1634 / run `33331659415`: full gate green, **822/822 tests**.
- Promoted runtime/data SHA: `bc472b60374a048686b0ee6c877ba26c515aec35`.
- Product 0.9.100.23 / Data 62 / Game State 14 / Package 0.9.100.
- Authored delta: 2 families, 7 species, 7 populations, no resources/production/geography.

This completes the five-part location flora/fauna diversity repair sequence.

## Data 62 metrics

```text
places/localities                       55
named NPCs                              47
shop/service sites                      37
creatures                              123
resource sources                       143
canonical items                        408
recipes/processes                      234
abilities/techniques                    41
quests/contracts                        18
companions                               1
transport services                       7
raw resources with production demand  145 / 154
luxury raws with production demand      14 / 14
routes                                  25
NPC schedules                           27
regional/shared packs                   39
pack-owned records                    1320
runtime seed NPCs                       46
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
- companions: 1/4;
- abilities/techniques: 41/100;
- named NPCs: 47/50;
- quests/contracts: 18/30;

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

## Next decision boundary

The ordered location flora/fauna diversity repair sequence is **complete through Data 62**.

No additional ecology unit is auto-authorized. Fresh selection may choose among:
- broader Crownfields ordinary-wildlife spread using existing families;
- secondary dungeon ecology/substrate cleanup;
- shorebird/wader breadth if coastal depth is selected;
- snake breadth only with a concrete ecological/player loop;
- formal Packet E;
- Waymeet Inner Marches / outer crossroads world-edge work;
- Occupational Tool Conversion.

The separate world-edge ranking remains Waymeet Inner Marches / outer crossroads approach, Coppergrass extensions, then Drowned Vaults.

## Validation

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```
