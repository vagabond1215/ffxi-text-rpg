# Execution Pipeline

Operational continuation path for Hearth & Horizon.

## Current baseline

```text
Product:       0.9.100.22
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          61
Benchmark:     3
Codename:      Wetland / Island Distribution Repair
```

## Current bounded-unit state

**Wetland / Island Distribution Repair** is the latest runtime/data bounded unit on `main`.

- Plan commit: `33575d6a8ae2aa202664d647558c66c91ecde025`.
- Implementation freeze: `48948292ea26a38d91d306d12998973c1ae35677`.
- Check #1626 / run `33325861973`: full gate green, **817/817 tests**.
- Promoted runtime/data SHA: `d861b1a6cdeca5a470fb13fa429a7329353b6b02`.
- Product 0.9.100.22 / Data 61 / Game State 14 / Package 0.9.100.
- Pure distribution pass: 8 populations, 0 species, 0 families, 0 sources, 0 resources, 0 processes.

The next ranked ecology repair is **Cross-biome Family Breadth**. It is queued, not auto-authorized.

## Data 61 metrics

```text
places/localities                       55
named NPCs                              47
shop/service sites                      37
creatures                              116
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
regional/shared packs                   38
pack-owned records                    1304
runtime seed NPCs                       46
runtime seed enemies                    17
```

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

Data 61 closes the fourth location-diversity repair. Next ranked ecology-quality unit:
1. **Cross-biome Family Breadth**.

Legacy Elderwood, Dry Upland & Saltpan, Headwater / Highland, and Wetland / Island repairs are complete. The separate world-edge, material-culture, and formal Packet E queues remain unchanged. No next unit is auto-started.

## Validation

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```
