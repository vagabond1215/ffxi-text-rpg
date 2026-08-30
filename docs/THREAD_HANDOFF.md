# Thread Handoff

Read this first when continuing Hearth & Horizon in a new development thread.

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.100.20
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          59
Benchmark:     3
Codename:      Dry Upland & Saltpan Ecology Repair
Runtime:       Node >=24
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Current integration state

**Dry Upland & Saltpan Ecology Repair is complete and promoted on `main` as Data 59.**

Plan:
- `docs/DRY_UPLAND_SALTPAN_FLORA_FAUNA_REPAIR_PLAN.md`;
- plan commit `97e3d5542d01583ee38e350c0882ef80b46010c6`.

Implementation history:
- initial implementation `5955df251c1626808decda2547e11c9cddef1ff9`;
- one syntax-only Saltpan-description comma repair `1f33f9b00a4c6e8e92aa1997c5f797ded9777fb1`;
- measured guard synchronization / implementation freeze `786d9afd7c7aeced567dc5f91cd5c56cc6e9c77d`.

Implementation-freeze evidence:
- Check **#1610 / run `33322534675`**;
- Repository Audit PASS;
- **807/807 tests PASS**;
- Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS.

Promoted runtime/data:
- `4bc397beb5a0f987c462364599382419bf89cd43`;
- Product 0.9.100.20 / Data 59 / Game State 14 / Package 0.9.100.

Continuity synchronization:
- `0d88ebde51796613965a0ceb71e4b4a5ab6b2c84`;
- PROJECT_PROFILE, README, roadmap, execution pipeline, system catalog, version roadmap, diversity audit, and bounded repair plan synchronized to Data 59.

Normal low-risk work continues directly on `main`. Use a branch only when rollback/blast-radius risk materially exceeds ordinary GitHub history/revert.

## Data 59 — Dry Upland & Saltpan Ecology Repair

This is repair unit **2 of 5** from `docs/LOCATION_FLORA_FAUNA_DIVERSITY_AUDIT.md`.

### South Redstone Reach

New recoverable flora:
- **Sunbent Bunchgrass** — common grass/fiber/thatch layer;
- **Stone Thyme** — edible/aromatic/medicinal herb;
- **Drythorn Resin** — woody-scrub/alchemical/repair material.

Existing fauna was already adequate:
- Ridge Ibex;
- Glass-Shell Crawler;
- Sunscale Lizard;
- Ironclaw Scorpion.

The place description also carries crust lichen, brittle seedheads, sparse seasonal forbs, and ordinary dry scrub so the biome is not represented only by resource nodes.

### North Redstone Reach

New recoverable flora:
- **Wind Juniper Berries** — culinary/aromatic woody shrub;
- **Ridge Yarrow** — medicinal/alchemical flowering herb.

Transition-fauna spread:
- Redstone Ridge Ibex using the existing species/family;
- Sunscale Lizard using the existing species/family;
- **Redstone Stone Grouse**, one new species using the existing Grouse family.

No new fauna family was required.

The place description now also carries dry bunchgrass, dwarf scrub, crust lichen, and sheltered transition vegetation below the colder Ironspine ascent.

### Emberwash Saltpan Verge

New recoverable halophytes:
- **Saltbrush Shoots** — edible salt-tolerant shrub;
- **Saltgrass Fiber** — structural grass/fiber for matting and shade;
- **Panbloom Petals** — decorative/dye/aromatic flowering halophyte.

Existing Saltpan fauna remains:
- Redtail Scorpion;
- Saltwind Vulture;
- Dust Hare;
- Saltbrush Tortoise.

No fauna was added merely to increase counts.

The place description also carries low succulent mats, crust lichen, dry seed stalks, and ordinary saline vegetation beyond the gatherable plants.

## Botanical diversity policy

The Data 58 botanical standard remains authoritative and Data 59 confirms it across dry/arid biomes.

Flora quality is assessed through habitat structure and functional roles, including where appropriate:
1. woody/shrub structure;
2. grasses/sedges/structural vegetation;
3. herbaceous/forb ground layer;
4. fungi/moss/lichen/crust substrate;
5. edible forage;
6. medicinal/alchemical/aromatic plants;
7. fiber/binder/resin/timber/dye/material plants;
8. decorative or visually distinctive flora;
9. ordinary non-harvested background vegetation.

Do **not** require every biome to expose every plant as a resource node.

Decorative/background plants remain descriptive when harvesting would not create a meaningful loop. Every new recoverable raw still requires exact provenance, a deliberate sink, and practical food-safety metadata where applicable.

## Data 59 production

Eight new exact-provenance raws feed eight transformations/outputs:

- Sunbent Bunchgrass -> **Bunchgrass Thatch Mat**;
- Stone Thyme -> **Stone-Thyme Infusion**;
- Drythorn Resin -> **Drythorn Resin Sealant**;
- Wind Juniper Berries + existing Ridge Millet -> **Juniper-Millet Pot**;
- Ridge Yarrow -> **Ridge Yarrow Field Wash**;
- Saltbrush Shoots -> **Saltbrush Pot Greens**;
- Saltgrass Fiber -> **Saltgrass Shade Mat**;
- Panbloom Petals -> **Panbloom Dye Bath**.

The plan originally named a Ridge Yarrow Salve. Implementation uses **Ridge Yarrow Field Wash** because the current local recipe graph has no appropriate fat/wax carrier and the wash provides a real medicine/alchemy sink without inventing a support ingredient.

Food safety:
- clean Stone Thyme may be used directly in small culinary quantities;
- Wind Juniper Berries are process-required culinary spice: crush and cook;
- Saltbrush Shoots are process-required: rinse and blanch/cook before eating;
- Stone-Thyme Infusion, Juniper-Millet Pot, and Saltbrush Pot Greens are direct-ready prepared foods;
- Ridge Yarrow Field Wash is non-food.

Raw-resource production utilization is now **144/153**. The gain is nine used raws despite eight new raws because Juniper-Millet Pot also activates demand for previously underused existing Ridge Millet.

## Data 59 census

```text
places/localities                        55
named NPCs                               47
shop/service sites                       37
creature definitions                    111
resource sources                        142
canonical items                         406
recipes/processes                       233
abilities/techniques                     41
quests/contracts                         18
companions                                1
transport services                        7
routes                                   25
spell schools                             4
capabilities/training definitions        44
NPC schedules                            27
regional/shared content packs            36
pack-owned records                     1277
runtime seed NPCs                        46
runtime seed enemies                     17
raw resources with production demand 144/153
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

Data 59 adds static catalog definitions and instances of existing ecology population/source authority. It adds no new durable serialized family for:
- flora populations;
- saltpan vegetation;
- transition fauna;
- route/world geography;
- player state.

## Ecology repair ranking

Completed:
1. **Legacy Elderwood Ecology Repair — COMPLETE / Data 58**;
2. **Dry Upland & Saltpan Ecology Repair — COMPLETE / Data 59**.

Next ranked, **not auto-started**:
3. **Headwater / Highland Transition Spread**
   - Headwater Upper Vale;
   - Windscar Grouse overlap;
   - Slatewater/Ironspine pollinators and small prey where habitat supports them.

Then:
4. Wetland / Island Distribution Repair;
5. Cross-biome family breadth.

Potential later broadly reusable new-family candidates remain:
- ground-squirrel / vole / small burrowing rodent;
- scoped small passerine;
- shorebird/wader where coastal depth warrants it;
- snake only as optional ecological breadth.

The lower-river fish gap was already resolved in Data 58 through River Dace. Data 59 required no new fauna family.

## World geography state

Data 59 does not change route or macro-topology authority.

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
5. `docs/DRY_UPLAND_SALTPAN_FLORA_FAUNA_REPAIR_PLAN.md`
6. `docs/LEGACY_ELDERWOOD_FLORA_FAUNA_REPAIR_PLAN.md`
7. `docs/EXECUTION_PIPELINE.md`
8. `docs/ITEM_CONSUMPTION_SAFETY.md`
9. `docs/ROADMAP.md`
10. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
11. relevant ecology/resource/production/runtime/tests for the explicitly selected next unit
