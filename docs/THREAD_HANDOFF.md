# Thread Handoff

Read this first when continuing Hearth & Horizon in a new development thread.

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.100.17
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          56
Benchmark:     3
Codename:      Lower Deepvein & Lantern Sump Station
Runtime:       Node >=24
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Current integration state

**Lower Deepvein & Lantern Sump Station is implemented on `main` as Data 56; final promotion synchronization is in progress.**

Implementation freeze:
- `b0c0048903ee6952f3c4bc337732f894340f540e`;
- Check **#1577 / run `33288699319`**;
- Repository Audit, **791/791 tests**, Census, Benchmark 3, Benchmark Sample green;
- Pages #1709 green.

Normal low-risk work continues directly on `main`. Use a branch only when rollback/blast-radius risk materially exceeds what ordinary GitHub revert/history can safely contain.

## Data 56 — Lower Deepvein & Lantern Sump Station

Plan:
- `docs/ZONE_PLAN_LOWER_DEEPVEIN.md`.

Permanent profile:
- `docs/ZONE_PROFILE_LOWER_DEEPVEIN.md`.

Geography:
- Deepvein Lower Decline — danger 3 mine-to-natural-cave transition;
- Lantern Sump Station — danger 0 staffed Brasshaven delver station;
- Lower Deepvein Echoing Shelf — danger 4 natural cavern shelf;
- Lower Deepvein Haulage Decline — Deepvein Mine -> Lower Decline -> Lantern Sump, walk only;
- Echoing Shelf Traverse — Lantern Sump -> Echoing Shelf, walk only;
- no ordinary route continues toward farther deep roads, northern gate country, or Korren settlements.

Ecology/resources:
- 8 species/populations;
- 5 reused cave-capable families + 3 new Lower Deepvein families;
- 7 exact-provenance forage/fish/trap/gather/mine sources/resources;
- ordinary wildlife remains passive, wary, or naturally territorial rather than being forced hostile for loot;
- existing Deepvein lead and silver sources are not duplicated.

Production:
- 10 transformations / 10 outputs;
- cooked lampcaps, cleaned/cooked threadfin, boiled sump crab;
- glowmoss wick cord, refined cave salt, polished quartz, fired lamp cup;
- reflector lamp kit and gallery seep packing;
- every new raw has production demand;
- raw production utilization **117/128**;
- luxury utilization **14/14**.

People:
- Ressa Kell — Lower Deepvein Factor;
- Borin Vale — Deepvein Survey Warden;
- Hessa Rusk — Lantern Sump Station Keeper;
- 2 schedules;
- exchange, survey desk, lampworks, hearth/cistern/bunks.

Persistence:
- Game State remains 14;
- no oxygen/survival meter, ventilation state, repaired-lift state, mining-certification state, Korren-border state, or farther-deep-road state family.

## Data 56 census

```text
places/localities                        52
named NPCs                               44
shop/service sites                       35
creature definitions                     96
resource sources                        117
canonical items                         352
recipes/processes                       204
abilities/techniques                     41
quests/contracts                         18
companions                                1
transport services                        7
routes                                   23
spell schools                             4
capabilities/training definitions        44
NPC schedules                            25
regional/shared content packs            31
pack-owned records                     1121
runtime seed NPCs                        43
runtime seed enemies                     17
```

Mechanics-scale gate remains **NOT READY**:
- companions 1/4;
- abilities 41/100;
- quests 18/30;
- named NPCs 44/50.

## World geography state

`docs/WORLD_MACRO_TOPOLOGY.md` remains authoritative.

Completed post-lock world-edge units:
1. Headwater Vale — Data 52;
2. Starfen Delta / Brackish Coast — Data 53;
3. Gloamwood & Oldbough Refuge — Data 54;
4. Emberwash Badlands & Cinderwell Station — Data 55;
5. Lower Deepvein & Lantern Sump Station — Data 56.

Next ranked geography:
1. **Waymeet Marches / central plateau approaches**;
2. Coppergrass extensions;
3. Drowned Vaults.

The Central Continent surface-completion estimate remains roughly **55–65%** because Lower Deepvein is a vertical/subterranean pass and is deliberately excluded from the surface-region percentage.

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
4. `docs/EXECUTION_PIPELINE.md`
5. `docs/WORLD_MACRO_TOPOLOGY.md`
6. `docs/ZONE_PROFILE_LOWER_DEEPVEIN.md`
7. `docs/ZONE_PLAN_LOWER_DEEPVEIN.md`
8. `docs/ITEM_CONSUMPTION_SAFETY.md`
9. `docs/ROADMAP.md`
10. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
11. relevant runtime/data/tests for the explicitly selected next unit
