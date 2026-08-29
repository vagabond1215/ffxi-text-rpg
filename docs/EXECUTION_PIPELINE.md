# Execution Pipeline

Operational continuation path for Hearth & Horizon.

## Current baseline

```text
Product:       0.9.100.14
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          53
Benchmark:     3
Codename:      Starfen Delta & Brackish Coast
```

## Current bounded-unit state

**Starfen Delta & Brackish Coast** is the latest runtime/data bounded unit on `main`. It realizes the Great Mere outflow, Tideglass Landing, and the first true Eastern Sea coast without opening Miri or generalized ocean travel.

Latest bounded implementation:
- population-backed hunting bridge merged through PR #400 at `e18990188935f52b66fe96cfa9d374ff845618ef`;
- Ironspine implementation freeze `53323564ac724044ff06b1341c5466e73a34ab37`;
- Check #1368 / run `33215878907`: full gate green, 753/753 tests;
- promoted PR #402 merged at `a410eb18e6f8df2f58b965ab9697f8ae813b1c4d`;
- exact promoted-head Check #1381 / run `33217086478`: full gate green;
- Headwater implementation freeze `aa39347a0faa754690a194d926262256e92027f1`;
- Check #1476 / run `33264692343`: full gate green, 770/770 tests, Data 52 pre-promotion census confirmed;
- Starfen Delta implementation freeze `c515588c404c0f80a724d767b74535f1e39ae166`;
- Check #1491 / run `33267789356`: full gate green, 776/776 tests;
- promoted Data 53 head `8f968155d092431b0a3314d38f4d890b0c87f599`;
- Check #1493 / run `33267935109`: full gate green, 776/776 tests, Data 53 census confirmed.

No later unit is auto-started. Normal low-risk work should proceed directly on `main`; use a branch only when a change has material rollback/blast-radius risk beyond an ordinary GitHub revert.

## Data 53 metrics

```text
places/localities                       43
named NPCs                              35
shop/service sites                      29
creatures                               72
resource sources                        96
canonical items                        301
recipes/processes                      174
abilities/techniques                    41
quests/contracts                        18
companions                               1
transport services                       7

raw resources with production demand   96 / 107
luxury raws with production demand      14 / 14
routes                                  17
NPC schedules                           19
regional/shared packs                   25
pack-owned records                     927
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
- named NPCs: 35/50;
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

Headwater Vale and Starfen Delta / Brackish Coast are complete. Next ranked world-edge candidate: **Gloamwood**. It is queued, not auto-authorized.

## Next bounded material-culture candidate

- Occupational Tool Conversion: turn existing shop/equipment-only tools and starter metal/leather goods into real production outputs, then add shared smithing/woodworking/masonry/textile/leatherworking/cooking/measurement tools.
- This is queued but not auto-authorized.
- See `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.

## Next decision boundary

Formal roadmap:
- Packet E — Gate A integration/census audit.

World-edge planning:
- Gloamwood is now the next ranked candidate.
- Emberwash follows; Lower Deepvein remains the next Deep World approach candidate.

Strong system/content candidates:
- companion breadth;
- NPC/quest/ability density.

No next unit is auto-started.

## Validation

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```
