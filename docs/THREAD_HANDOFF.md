# Thread Handoff

Read this first when continuing Hearth & Horizon in a new development thread.

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.100.19
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          58
Benchmark:     3
Codename:      Legacy Elderwood Ecology Repair
Runtime:       Node >=24
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Current integration state

**Legacy Elderwood Ecology Repair is complete and promoted on `main` as Data 58.**

Plan:
- `docs/LEGACY_ELDERWOOD_FLORA_FAUNA_REPAIR_PLAN.md`;
- plan commit `5e892825d47599b43be8cd227003a54a202885bd`.

Implementation freeze:
- `3732f22a464a3cdd2d11409475730ea804dfa1a6`;
- Check **#1601 / run `33314083287`**;
- Repository Audit, **802/802 tests**, Census, Benchmark 3, Benchmark Sample green.

Promoted runtime/data:
- `9988c34e985d28586624d64258955cecec55e5d5`;
- Product 0.9.100.19 / Data 58 / Game State 14 / Package 0.9.100.

Continuity synchronization:
- `2c6deec49fb0c87f0c29b481596afb03c28fbb13`;
- PROJECT_PROFILE, README, roadmap, execution pipeline, system catalog, version roadmap, diversity audit, and bounded repair plan synchronized to Data 58.

Normal low-risk work continues directly on `main`. Use a branch only when rollback/blast-radius risk materially exceeds ordinary GitHub history/revert.

## Data 58 — Legacy Elderwood Ecology Repair

This is repair unit **1 of 5** from `docs/LOCATION_FLORA_FAUNA_DIVERSITY_AUDIT.md`.

### East Elderwood

New recoverable flora:
- Wood Sorrel Bank — edible understory herb;
- Wayleaf Patch — medicinal/alchemical herb;
- Bluebell Glade — decorative/aromatic/dye flower.

Fauna spread:
- Brush Hare;
- Crownwood Hart in the existing Hart family;
- Elderwood Barkboar;
- Moss Owl.

Existing tree/nut/fruit layers remain; the place description now also carries bracken, moss, leaf litter, grasses, and other non-node vegetation so “flora diversity” is not synonymous with inventory-node count.

### Timbercross Landing

New riparian flora/resources:
- River Mint;
- Willowherb;
- Sedge Fiber;
- River Currants.

New fauna:
- Timbercross Bronze Dace;
- River Teal;
- Bank Frog.

The one justified new family is **River Dace**, representing a navigable lower-river fish niche distinct from cold-stream trout and Great Mere lake fish.

The place description also carries alder/willow, rush/sedge margins, nettles, bank grass, damp moss, gravel runs, and backwater vegetation.

### Thornwall Old Gaol

New restrained cellar/cistern substrate:
- Thornwall Cellar Bat;
- Gaol Webspider;
- Cistern Moss;
- Gaol Shelf Fungus.

The repair deliberately does not turn Old Gaol into a second Deepvein cave biome.

### Redfang Camp

No broad ecology expansion was added. It remains primarily an occupied fortified raider site; census inflation was not considered sufficient justification.

## Flora diversity policy established by Data 58

For future biome audits, evaluate flora as a guild/layer mix:

1. canopy/woody structure;
2. shrubs/understory;
3. herbaceous/ground layer;
4. wet-margin/aquatic vegetation where appropriate;
5. fungi/moss/lichen/decomposer substrate where appropriate;
6. edible forage;
7. medicinal/alchemical/aromatic plants;
8. fiber/binder/timber/dye/material plants;
9. decorative or visually distinctive flora;
10. ordinary non-harvested background vegetation.

Do **not** require every location to have one gatherable node in every category.

Decorative/background plants should stay descriptive when harvesting them does not support a real player loop. Every new recoverable raw still requires:
- exact provenance;
- a deliberate sink;
- practical food-safety metadata if food-capable;
- processing/production demand where appropriate.

Do not introduce a new durable botanical-population state family merely to make plants symmetric with fauna.

## Data 58 production

Ten new exact-provenance raws feed eleven transformations/outputs:

- Sorrel-Crabapple Relish;
- Wayleaf Field Wash;
- Bluebell Dye Bath;
- River-Mint Tea;
- Willowherb Poultice;
- Landing Sedge Mat;
- River Currant Compote;
- Cleaned Bronze Dace;
- Minted Bronze Dace Pot;
- Clean Cistern Moss Packing;
- Dried Gaol Fungus Tinder.

Food safety:
- clean Wood Sorrel, River Mint, and ripe River Currants are direct-ready;
- raw Bronze Dace requires cleaning and cooking/smoking;
- cleaned Bronze Dace remains raw until cooked;
- shelf fungus and cistern moss are not food.

Raw-resource production utilization is now **135/145**.

## Data 58 census

```text
places/localities                        55
named NPCs                               47
shop/service sites                       37
creature definitions                    110
resource sources                        134
canonical items                         390
recipes/processes                       225
abilities/techniques                     41
quests/contracts                         18
companions                                1
transport services                        7
routes                                   25
spell schools                             4
capabilities/training definitions        44
NPC schedules                            27
regional/shared content packs            34
pack-owned records                     1241
runtime seed NPCs                        46
runtime seed enemies                     17
raw resources with production demand 135/145
luxury raws with production demand      14/14
```

Mechanics-scale gate remains **NOT READY**:
- companions 1/4;
- abilities 41/100;
- quests 18/30;
- named NPCs 47/50.

## Persistence decision

Game State remains **14**.

Data 58 adds static authored catalog definitions and instances of existing ecology population/source authority. It adds no new durable serialized family for:
- botanical populations;
- river fishing state;
- cellar ecology;
- location vegetation;
- route/world geography;
- player state.

## Ecology repair ranking

Completed:
1. **Legacy Elderwood Ecology Repair — COMPLETE / Data 58.**

Next ranked, **not auto-started**:
2. **Dry Upland & Saltpan Ecology Repair**
   - North/South Redstone vegetation;
   - Emberwash Saltpan halophytes;
   - existing-family transition spread.

Then:
3. Headwater / Highland Transition Spread;
4. Wetland / Island Distribution Repair;
5. Cross-biome family breadth.

Potential later new-family candidates remain:
- ground-squirrel / vole / small burrowing rodent;
- scoped small passerine;
- shorebird/wader where coastal depth warrants it;
- snake only as optional ecological breadth.

The lower-river fish gap was resolved in Data 58 through River Dace.

## World geography state

Data 58 does not change route or macro-topology authority.

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

The first fully synchronized Data 58 head, `7f445418aa69ff765cdb4753b9afc75b715c8e61`, passed Repository Audit but exposed one stale regression expectation in `tests/pipeline.test.js`: `describeVersion()` was still matched against Product 0.9.100.18.

Repair:
- `25dea3611bfbe03a4b14fe76233ea1df1cf9579b`;
- assertion-only correction to Product 0.9.100.19;
- no runtime, ecology, census, persistence, or content change.

The exact head after this handoff is the final Data 58 continuity candidate and must have hosted Check + Pages green before closure.

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
5. `docs/LEGACY_ELDERWOOD_FLORA_FAUNA_REPAIR_PLAN.md`
6. `docs/EXECUTION_PIPELINE.md`
7. `docs/ITEM_CONSUMPTION_SAFETY.md`
8. `docs/ROADMAP.md`
9. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
10. relevant ecology/resource/production/runtime/tests for the explicitly selected next unit
