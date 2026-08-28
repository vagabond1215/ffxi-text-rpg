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

## Current integration state

Active PR: **#394 — Regional Ingredient & Luxury Processing**

Base main:

`07e5b01a2db80830bf272ec0175ecae14b2f10b6`

The implementation head before Data 47/version-document synchronization passed hosted Check **#1311 / run `33202128019`**:

```text
Repository Audit: PASS
Tests:            736/736
Content Census:   PASS
Benchmark 3:      PASS
Benchmark Sample: PASS
```

A final exact-head Check is required after Data 47 continuity synchronization before merge.

## What Data 47 adds

- 30 new production transformations;
- 30 new production outputs;
- intermediate ingredients/components as first-class canonical items;
- Crownfields milling, baking, pulse cooking, flax/linen, woad, apple must and vinegar;
- luxury pigment, perfume, gem-cutting, veneer, textile, glaze, jewelry/decorative chains across Elderwood, Redstone, Starfen, Coppergrass, Slatewater and Crownfields;
- a Five-Region Dyer's Sample Book requiring processed inputs from five regional dye traditions;
- `pack-regional-ingredient-luxury-processing`;
- Crownfields Grange workshop/kitchen access through existing workstation tags.

Permanent design record:

`docs/REGIONAL_INGREDIENT_LUXURY_PROCESSING.md`

## Production-depth result

Before this pass:

```text
canonical raw resources used by production   15 / 44
luxury raws used by production                0 / 11
canonical items                              96
recipes/processes                            29
```

After this pass:

```text
canonical raw resources used by production   33 / 44
luxury raws used by production               11 / 11
canonical items                             126
recipes/processes                            59
```

The remaining eleven unused raws are documented as future content opportunities, not reference failures.

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

Mechanics-scale gate remains **NOT READY**. Recipes are now only 16 short of their mechanics floor; items are 74 short. Companions remain the largest relative gap.

## Important deferred content

Do not misclassify these as broken references:

- remaining unused raw resources are intentional future production opportunities;
- animal products still require a deliberate husbandry/managed-animal source model;
- population-backed hunting remains an ecology/player-loop gap;
- sparse Old Gaol/Timbercross/dungeon resource coverage remains deferred.

## Next decision boundary

Formal roadmap:
- Packet E — Gate A integration/census audit.

World-edge planning:
- Great Mere remains the next ranked zone.

System/content candidates:
- population-backed hunting;
- companion breadth;
- another production pass could close the remaining 16-recipe mechanics gap, but should only do so through connected useful chains.

None is auto-started.

## Restart order

1. `AGENTS.md`
2. this file
3. `docs/EXECUTION_PIPELINE.md`
4. `docs/REGIONAL_INGREDIENT_LUXURY_PROCESSING.md`
5. `docs/ROADMAP.md`
6. `docs/ZONE_PROFILE_CROWNFIELDS.md`
7. relevant runtime/data/tests for the explicitly selected next unit

Do not redo broad discovery unless repository evidence contradicts this checkpoint.
