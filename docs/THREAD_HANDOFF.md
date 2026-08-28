# Thread Handoff

Read this first when continuing Hearth & Horizon in a new development thread.

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.100.8
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          47
Benchmark:     3
Codename:      Regional Ingredient & Luxury Processing
Runtime:       Node >=24
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Current main checkpoint

```text
product merge:  fb7a4ec0145c6072aac21525cb15e931125fc327
PR #394:        MERGED
PR Check #1326: PASS / run 33202537431
main Check #1327: PASS / run 33202596523
tests:          736/736
```

No implementation PR is active. The repository is awaiting the next explicitly authorized bounded unit.

## Data 47 result

Regional Ingredient & Luxury Processing added:

- 30 new production transformations;
- 30 new production outputs;
- intermediate ingredients/components as first-class canonical items;
- Crownfields flour/bread, pea meal/pottage, flax thread/linen, woad pigment/textile, apple must/vinegar;
- regional pigments, perfume extracts, cut stones, veneer, glazes, textiles, jewelry/decorative goods;
- a Five-Region Dyer’s Sample Book;
- `pack-regional-ingredient-luxury-processing`;
- local Crownfields kitchen/workshop access through existing workstation authority.

Permanent design record:

`docs/REGIONAL_INGREDIENT_LUXURY_PROCESSING.md`

## Production-depth result

```text
canonical raw resources used by production   33 / 44
luxury raws used by production               11 / 11
canonical items                             126
recipes/processes                            59
regional/shared packs                        16
pack-owned records                          470
```

Before Data 47 the comparable utilization was 15/44 raws and 0/11 luxury raws.

The eleven remaining unused raw resources are documented as future content opportunities, not failures.

## Current census

```text
places/localities                        31
named NPCs                               23
shop/service sites                       21
creature definitions                    45
resource sources                        41
canonical items                        126
recipes/processes                       59
abilities/techniques                    41
quests/contracts                        18
companions                               1
transport services                       5

routes                                    8
spell schools                             4
capabilities/training definitions        44
NPC schedules                            11
regional/shared content packs            16
pack-owned records                      470
runtime seed NPCs                        22
runtime seed enemies                     13
```

Mechanics-scale gate remains **NOT READY**. Recipes are 16 short of their mechanics floor and items 74 short. Companions remain the largest relative gap.

## Deferred findings

Do not rediscover or misclassify these as dangling references:

- eleven raw resources remain production opportunities rather than broken content;
- animal products still require a deliberate husbandry/managed-animal source model;
- population-backed hunting remains an ecology/player-loop gap;
- Old Gaol, Timbercross and several dungeon/resource areas remain intentionally sparse.

## Next decision boundary

Formal roadmap:
- **Packet E — Gate A integration/census audit**.

World-edge planning:
- **Great Mere** remains the next ranked zone.

Strong separate system candidate:
- **population-backed hunting encounter discovery**.

Content-scale candidates:
- companion breadth;
- NPC/quest network density;
- ability breadth;
- connected production depth if deliberately selected.

None is auto-started.

## Restart order

1. `AGENTS.md`
2. this file
3. `docs/EXECUTION_PIPELINE.md`
4. `docs/REGIONAL_INGREDIENT_LUXURY_PROCESSING.md`
5. `docs/ROADMAP.md`
6. only runtime/data/tests relevant to the next explicit unit

Do not redo broad discovery unless repository evidence contradicts this checkpoint.
