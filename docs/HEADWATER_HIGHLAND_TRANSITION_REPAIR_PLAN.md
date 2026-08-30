# Headwater / Highland Transition Repair Plan

Status: **COMPLETE / PROMOTED DATA 60.**

Baseline: Product **0.9.100.20**, Data **59**, Game State **14**, Package **0.9.100**.

Promoted result: Product **0.9.100.21**, Data **60**, Game State **14**, Package **0.9.100**.

Authority:
- `docs/LOCATION_FLORA_FAUNA_DIVERSITY_AUDIT.md`
- `docs/DRY_UPLAND_SALTPAN_FLORA_FAUNA_REPAIR_PLAN.md`
- `docs/ITEM_CONSUMPTION_SAFETY.md`
- `docs/WORLD_MACRO_TOPOLOGY.md`

This is repair unit **3 of 5** from the location flora/fauna diversity audit. It does not authorize Wetland/Island Distribution Repair, Cross-biome Family Breadth, world-edge expansion, or material-culture work in the same bounded run.

## 1. Scope

This pass covers only:
- Headwater Upper Vale;
- Windscar Saddle;
- Slatewater Foothills;
- Ironspine Lower Pass;
- Ironspine High Meadow.

The objective is **transition distribution**, not a new-biome content tranche.

No new places, routes, settlements, NPCs, shops, services, quests, or durable state families are authorized.

## 2. Family-reuse rule

No new ecology family is planned.

Reuse:
- `family-grouse`;
- `family-bee`;
- `family-hare`;
- existing Headwater Stream Trout species;
- existing Waymeet Grey Grouse species;
- existing Ironspine Snow Grouse species;
- existing Brush Hare species where its habitat remains plausible.

New species variants are permitted only where elevation/habitat warrants a distinct regional form.

## 3. Headwater Upper Vale

Current:
- Red Deer;
- Moss Owl;
- Meadowsweet;
- meadow benches, cold tributaries, forest edges, cliffs, and spring-flood channels.

Planned fauna:
- **Headwater Meadow Grouse** — new species in the existing Grouse family;
- **Headwater Meadow Bee** — new species in the existing Bee family;
- Coldstream Trout population spread into suitable upper tributaries using the existing species.

Planned recoverable flora:
- **Upper Vale Bilberries** — edible berry/shrub layer with one connected preservation loop.

Descriptive non-node flora should also include meadow fescue, sedges, harebells/clover-like flowering groundcover, dwarf willow, moss, and ordinary berry mats.

No new fishing source is required: trout presence is ecological distribution, while the established lower-vale fishery remains the authored recovery source.

## 4. Windscar Saddle

Current:
- Windscar Marmot;
- Cairnward Eagle;
- Tarn Duck;
- heather and whortleberry sources;
- strong high-saddle vegetation.

Planned repair:
- add a Windscar population of the existing **South March Grey Grouse**.

No new Windscar flora node or new species is required.

## 5. Slatewater Foothills

Current fauna is weighted toward large vertebrates:
- Greyback Bear;
- Scree Lynx;
- Russet Grouse;
- Ridge Eagle.

Current flora is already strong:
- serviceberry;
- pitch pine;
- mountain thyme;
- silver lichen;
- mineral substrate.

Planned repair:
- spread the existing **Brush Hare** species into suitable mixed-woodland/forest-edge habitat;
- add **Slatewater Thyme Bee**, a new species in the existing Bee family around serviceberry and mountain-thyme flowering slopes;
- update Scree Lynx prey-family links to include Hare.

No new Slatewater gathering source is required.

## 6. Ironspine Highlands

Current:
- Snowhorn Ibex;
- Cliff Bear;
- Froststep Lynx;
- Crag Marmot;
- Whitecrest Eagle;
- Snow Grouse;
- stonepine, dwarf willow, alpine sorrel, frost lichen, and mineral recovery.

Primary defects:
- Snow Grouse is present only in the Lower Pass even though High Meadow is its authored habitat;
- no pollinator population exists;
- no hare/small-prey alpine form exists.

Planned repair:
- add High Meadow population of existing **Ironspine Snow Grouse**;
- add **Ironspine Snow Hare**, a new species in the existing Hare family, in High Meadow;
- add **Ironspine Sorrel Bee**, a new species in the existing Bee family, with Lower Pass and High Meadow populations;
- update Froststep Lynx prey-family links to include Hare.

No new Ironspine gathering source is required.

## 7. Planned authored delta

Expected:
- new ecology families: **0**;
- new species: **5**;
- new population placements: **10**;
- new gathering sources: **1**;
- new raw resources: **1**;
- new transformations: **1**;
- new production outputs: **1**.

Planned new species:
1. Headwater Meadow Grouse;
2. Headwater Meadow Bee;
3. Slatewater Thyme Bee;
4. Ironspine Snow Hare;
5. Ironspine Sorrel Bee.

Planned populations:
1. Headwater Meadow Grouse;
2. Headwater Meadow Bees;
3. Headwater Upper Coldstream Trout;
4. Windscar Grey Grouse;
5. Slatewater Brush Hares;
6. Slatewater Thyme Bees;
7. Ironspine Snow Hares;
8. Ironspine Lower Sorrel Bees;
9. Ironspine High Sorrel Bees;
10. Ironspine High Snow Grouse.

## 8. Upper Vale production loop

New raw:
- **Upper Vale Bilberries** — direct edible after ordinary cleaning.

Connected transformation:
- **Bilberry-Meadowsweet Preserve** — cooked bilberries with existing dried Headwater Meadowsweet.

This deliberately gives the new berry node a real food/preservation sink without inventing a second structural-material line in a location whose lower vale already supplies willow, alder, bark, and timber.

Food safety:
- clean ripe bilberries are direct-ready;
- the preserve is fully cooked and direct-ready.

## 9. Pack-v2 ownership

Create one bounded cross-region repair pack:

**Headwater / Highland Transition Repair**
- region ownership: Headwater Vale, Waymeet Marches, Slatewater Foothills, Ironspine Highlands;
- owns only the new species, populations, Upper Vale source/raw/output/process;
- depends on the existing Headwater, Waymeet, Slatewater, Ironspine, Elderwood opening, and Elderwood ecology packs needed for reused species/families.

Existing canonical records such as Brush Hare, Grey Grouse, Coldstream Trout, Snow Grouse, Scree Lynx, and Froststep Lynx remain owned by their existing packs.

## 10. Persistence/version intent

Expected if implemented and promoted:
- Product revision: **0.9.100.21**;
- Data: **60**;
- Game State: **14**;
- Package: **0.9.100**;
- Account Save: **5**;
- Benchmark: **3**.

Game State remains 14 because this is static catalog/distribution content. No new serialized ecology state family is planned.

## 11. Validation

Focused:
- ecology registry validation;
- existing-family reuse and no new family;
- exact bilberry source/item provenance;
- bilberry production demand;
- food consumption metadata;
- Pack-v2 dependencies/ownership;
- predator/prey link updates;
- non-node botanical descriptions;
- no geography expansion.

Full contract:

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Deterministic breadth guards move only from measured hosted results.


## 12. Implementation result

Implemented authored delta:
- new ecology families: **0**;
- new species variants: **5**;
- new population placements: **10**;
- new gathering sources/raws: **1**;
- new transformations/outputs: **1**;
- new Pack-v2 repair graphs: **1**.

The single new recovery loop is **Upper Vale Bilberries -> Bilberry-Meadowsweet Preserve**, using existing dried Headwater Meadowsweet. This keeps Upper Vale botanically richer without duplicating the Lower Vale's existing timber, willow, bark, and fish economy.

### Deliberate predator-link omission

The planning draft proposed adding Hare to Scree Lynx and Froststep Lynx `linksWithFamilyIds`. Implementation deliberately leaves those older species records unchanged.

Reason:
- the ecological defect was missing hare/small-prey **distribution**, which is now repaired;
- those predator species are owned by existing regional packs;
- rewriting their family-link metadata solely for this repair would broaden the change into older ownership/dependency authority without adding player-visible behavior;
- cross-biome predator/prey metadata normalization is better handled as part of the later family-breadth pass if it becomes mechanically meaningful.

This is an intentional bounded-scope decision, not a validation omission.

Implementation freeze:
- `13ba1f7b03ace684778e5c388450af8efc9183b8`;
- Check #1618 / run `33325161966`;
- Repository Audit PASS;
- **812/812 tests PASS**;
- Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS.

Promoted runtime/data SHA:
- `9c3c4d8a0b9e910c3312653d8836f3bbe03309bb`.

Measured Data 60 breadth:
- 116 creatures;
- 143 resource sources;
- 408 canonical items;
- 234 recipes/processes;
- 37 regional/shared packs;
- 1,296 pack-owned records;
- 145/154 canonical raw resources with production demand.

No later ecology repair is authorized by completion of this unit.
