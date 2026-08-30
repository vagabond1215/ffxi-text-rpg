# Thread Handoff

Read this first when continuing Hearth & Horizon in a new development thread.

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.100.21
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          60
Benchmark:     3
Codename:      Headwater / Highland Transition Repair
Runtime:       Node >=24
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Current integration state

**Headwater / Highland Transition Repair is complete and promoted on `main` as Data 60.**

Plan:
- `docs/HEADWATER_HIGHLAND_TRANSITION_REPAIR_PLAN.md`;
- plan commit `1e9a035161f870ad224df65f5bef17af6277ad0e`.

Implementation:
- initial implementation `65753050b5fd5501ad836265acf01bf67c00a8cd`;
- measured guard synchronization / implementation freeze `13ba1f7b03ace684778e5c388450af8efc9183b8`.

Implementation-freeze evidence:
- Check **#1618 / run `33325161966`**;
- Repository Audit PASS;
- **812/812 tests PASS**;
- Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS.

Promoted runtime/data:
- `9c3c4d8a0b9e910c3312653d8836f3bbe03309bb`;
- Product 0.9.100.21 / Data 60 / Game State 14 / Package 0.9.100.

The first promotion-head audit correctly stopped before tests because the permanent authority docs still carried Data 59. The authority synchronization commit `7fa035c5a8b54badaeff117674f9c583acd98d46` updates PROJECT_PROFILE, README, roadmap, execution pipeline, system catalog, version roadmap, diversity audit, plan completion state, and the escaped pipeline version-regression assertion. This handoff is the final synchronization write.

Normal low-risk work continues directly on `main`. Use a branch only when rollback/blast-radius risk materially exceeds ordinary GitHub history/revert.

## Data 60 — Headwater / Highland Transition Repair

This is repair unit **3 of 5** from `docs/LOCATION_FLORA_FAUNA_DIVERSITY_AUDIT.md`.

The tranche is deliberately distribution-heavy:
- **0 new ecology families**;
- **5 new species variants**;
- **10 new population placements**;
- **1 new gathering source/raw**;
- **1 transformation/output**;
- **1 cross-region Pack-v2 repair graph**.

### Headwater Upper Vale

New species:
- **Headwater Meadow Grouse** — existing Grouse family;
- **Headwater Meadow Bee** — existing Bee family.

Distribution:
- existing **Coldstream Trout** now also occupies suitable Upper Vale cold tributaries.

New recoverable flora:
- **Upper Vale Bilberries** — edible shrub/berry layer.

Descriptive non-node vegetation now includes:
- upland fescue;
- wet sedges;
- harebells;
- clover-like flowering groundcover;
- dwarf willow;
- moss;
- ordinary berry mats.

The established Lower Vale fishery remains the authored trout recovery source; Upper Vale trout presence is ecological distribution only.

### Windscar Saddle

New distribution:
- existing **South March Grey Grouse** now overlaps Windscar Saddle.

No new Windscar species or resource source was added. Existing heather and whortleberry recovery already provide sufficient botanical structure.

### Slatewater Foothills

New distribution:
- existing **Brush Hare**;
- new **Slatewater Thyme Bee** using the existing Bee family.

No new Slatewater gathering source was added. Existing serviceberry, pitch pine, mountain thyme, silver lichen, clay, and slate recovery is already sufficient.

The place description now also carries clover, flowering verges, grasses, pine litter, and ordinary lichen structure.

### Ironspine Highlands

New species:
- **Ironspine Snow Hare** — existing Hare family;
- **Ironspine Sorrel Bee** — existing Bee family.

New distribution:
- Snow Hare in High Meadow;
- Sorrel Bee in Lower Pass and High Meadow;
- existing **Ironspine Snow Grouse** now also occupies High Meadow.

No new Ironspine gathering source was added. Existing stonepine, dwarf willow, alpine sorrel, frost lichen, lodestone, and quartz recovery remains sufficient.

Descriptive alpine layers now include dwarf sedge, snowbed flowers, low willow, sorrel, and frost lichen around sheltered moisture pockets.

## Deliberate predator-link decision

The planning draft proposed adding Hare to the prey-family metadata of:
- Slatewater Scree Lynx;
- Ironspine Froststep Lynx.

Data 60 deliberately **does not rewrite those existing species records**.

Reason:
- the actual ecological defect was missing hare/small-prey distribution, which is now repaired;
- those predators are owned by older regional packs;
- changing family-link metadata would broaden this distribution-only tranche into old ownership/dependency authority without adding current player-visible mechanics;
- cross-biome predator/prey metadata normalization can be reconsidered during the later family-breadth pass if it becomes mechanically meaningful.

Do not treat this as unfinished Data 60 work.

## Data 60 food and production loop

New raw:
- **Upper Vale Bilberries**
  - direct-ready after ordinary rinsing;
  - exact source/place/action provenance.

Connected transformation:
- 2 Upper Vale Bilberries + 1 existing Dried Headwater Meadowsweet
  -> **Bilberry-Meadowsweet Preserve**.

The preserve is fully cooked and direct-ready.

This one loop is intentionally enough. Upper Vale did not need duplicate timber, cordage, tannin, or mineral nodes because the surrounding Headwater/Ironspine economy already supplies those functions.

Raw-resource production utilization is now **145/154**. Luxury-raw utilization remains **14/14**.

## Data 60 census

```text
places/localities                        55
named NPCs                               47
shop/service sites                       37
creature definitions                    116
resource sources                        143
canonical items                         408
recipes/processes                       234
abilities/techniques                     41
quests/contracts                         18
companions                                1
transport services                        7
routes                                   25
spell schools                             4
capabilities/training definitions        44
NPC schedules                            27
regional/shared content packs            37
pack-owned records                     1296
runtime seed NPCs                        46
runtime seed enemies                     17
raw resources with production demand 145/154
luxury raws with production demand      14/14
```

Mechanics-scale gate remains **NOT READY**:
- companions 1/4;
- abilities 41/100;
- quests 18/30;
- named NPCs 47/50.

Do not address those gaps with disconnected filler.

## Persistence decision

Game State remains **14**.

Data 60 adds static species variants, population placements, one source/raw, one production process/output, and descriptive habitat text. It adds no new durable serialized family for:
- pollinator state;
- alpine prey state;
- transition state;
- routes or geography;
- player state.

## Ecology repair ranking

Completed:
1. **Legacy Elderwood Ecology Repair — COMPLETE / Data 58**;
2. **Dry Upland & Saltpan Ecology Repair — COMPLETE / Data 59**;
3. **Headwater / Highland Transition Spread — COMPLETE / Data 60**.

Next ranked, **not auto-started**:
4. **Wetland / Island Distribution Repair**
   - East Starfen;
   - Reedcrown Isle;
   - Starfen Lower Delta.

Then:
5. **Cross-biome family breadth**
   - small burrowing rodent;
   - scoped passerine;
   - shorebird/wader where coastal depth warrants it;
   - optional snake only where a player/economic/ecological loop justifies it.

The lower-river fish gap was resolved in Data 58 through River Dace. Data 59 and Data 60 required no new fauna families.

## Botanical diversity policy

Data 58–60 establish the current standard:

Flora quality is assessed through habitat structure and useful ecological/economic roles, not equal gathering-node quotas.

Where appropriate, consider:
1. woody/shrub structure;
2. grasses/sedges/structural vegetation;
3. herbaceous/forb ground layer;
4. fungi/moss/lichen/crust substrate;
5. edible forage;
6. medicinal/alchemical/aromatic plants;
7. fiber/binder/resin/timber/dye/material plants;
8. decorative or visually distinctive flora;
9. ordinary non-harvested background vegetation.

Do **not** make every meadow grass, flower, moss, lichen, shrub, or alpine forb an inventory object.

Every new recoverable raw still requires:
- exact provenance;
- deliberate downstream demand;
- practical food-safety metadata where food-capable.

## World geography state

Data 60 does not change route or macro-topology authority.

Current overland Waymeet sequence remains:

```text
Timbercross
  -> Headwater Vale
  -> Windscar Saddle
  -> Cairnward Relay
  -> Waymeet South Marches
  -X-> inner marches / Waymeet
```

World-edge ranking remains:
1. Waymeet Inner Marches / outer crossroads approach;
2. Coppergrass extensions;
3. Drowned Vaults.

These are separate from the ecology-repair sequence and are not auto-started.

## Final synchronization validation note

The first fully synchronized Data 60 head, `be22f951f1ed6a91e29be65de86a422e0484597a`, passed Repository Audit but exposed one assertion-syntax defect in `tests/pipeline.test.js`: the `/` in the codename **Headwater / Highland Transition Repair** was not escaped inside a regular-expression literal.

Repair:
- `266a9e2fd57a535db97163a45017098175b6e035`;
- assertion-only regex delimiter escape;
- no runtime, ecology, census, persistence, or authored-content change.

The exact head after this handoff is the final Data 60 continuity candidate and must have hosted Check + Pages green before closure.

## Other queued choices

Formal roadmap:
- Packet E — Gate A integration/census audit.

Material culture:
- Occupational Tool Conversion.

High-value scale gaps:
- companion breadth;
- ability/technique breadth;
- NPC/quest network density.

## Restart order

1. `AGENTS.md`
2. this file
3. `PROJECT_PROFILE.yaml`
4. `docs/LOCATION_FLORA_FAUNA_DIVERSITY_AUDIT.md`
5. `docs/HEADWATER_HIGHLAND_TRANSITION_REPAIR_PLAN.md`
6. `docs/DRY_UPLAND_SALTPAN_FLORA_FAUNA_REPAIR_PLAN.md`
7. `docs/LEGACY_ELDERWOOD_FLORA_FAUNA_REPAIR_PLAN.md`
8. `docs/EXECUTION_PIPELINE.md`
9. `docs/ITEM_CONSUMPTION_SAFETY.md`
10. `docs/ROADMAP.md`
11. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
12. relevant ecology/resource/production/runtime/tests for the explicitly selected next unit

## Final validation requirement

The exact head after this handoff must have:
- hosted Check green;
- Pages green.

If a final synchronization assertion fails, repair only the stale authority/assertion, then write this handoff last again and rerun the exact head before closure.
