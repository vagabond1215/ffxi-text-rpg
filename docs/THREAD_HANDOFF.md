# Thread Handoff

Read this first when continuing Hearth & Horizon in a new development thread.

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.100.15
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          54
Benchmark:     3
Codename:      Gloamwood & Oldbough Refuge
Runtime:       Node >=24
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Current integration state

**Gloamwood & Oldbough Refuge is complete and promoted on `main` as Data 54.**

Implementation freeze:
- `83cfa4de61e315fb54689a5d7d2899d2ade41743`;
- Check **#1504 / run `33269167675`**;
- Repository Audit, **781/781 tests**, Census, Benchmark 3, Benchmark Sample green.

Promoted Data 54 checkpoint:
- `2de11cd73302751e9a83088d77c2de42df3313e8`;
- Check **#1507 / run `33269370813`**;
- same full gate green.

Normal low-risk work continues directly on `main`. Use a branch only when rollback/blast-radius risk materially exceeds what ordinary GitHub revert/history can safely contain.

## Data 54 — Gloamwood & Oldbough Refuge

Plan:
- `docs/ZONE_PLAN_GLOAMWOOD.md`.

Permanent profile:
- `docs/ZONE_PROFILE_GLOAMWOOD.md`.

Geography:
- Gloamwood Verge — danger 2 old-growth transition wilderness;
- Oldbough Refuge — danger 0 boundary-forester refuge/work station;
- Gloamwood Deep — danger 3 ancient wet forest;
- Oldgrowth Cart Track — West Elderwood -> Verge -> Oldbough, walk/mount/wagon;
- Deepwood Forester Trail — Oldbough -> Deep, walk/mount only;
- Oldbough is the wagon limit;
- no western-mountain/Lethari onward route yet.

Ecology/resources:
- 8 species/populations;
- 4 reused forest families + 4 new old-growth families;
- 7 exact-provenance forage/gather/log/mine sources/resources;
- ordinary wildlife remains passive, wary, or naturally territorial rather than being forced hostile for loot.

Production:
- 10 transformations / 10 outputs;
- cooked/dried raincaps;
- bitterbark tannin;
- seasoned ironoak;
- dry moss packing;
- dried nightberries;
- candle-resin weather sealant;
- washed bog-iron concentrate;
- route-repair stakes;
- field dressing roll using canonical hemp twine;
- every new raw has production demand;
- raw production utilization **103/114**;
- luxury utilization **14/14**.

Food:
- raw Gloam Raincaps require preparation and may cause stomach sickness/irritation;
- ripe Nightberries are direct-ready after ordinary rinsing;
- cooked/dried mushroom and dried berry outputs are direct-ready;
- language remains practical late-medieval/fantasy knowledge.

People:
- Mara Oren — Field Factor;
- Hale Rowan — Boundary Forester;
- Tessa Brin — Refuge Keeper;
- 2 schedules;
- exchange, forester desk, workyard, common hearth/bunks.

Persistence:
- Game State remains 14;
- no durable navigation/ward/mountain-pass/border state family.

## Data 54 census

```text
places/localities                        46
named NPCs                               38
shop/service sites                       31
creature definitions                     80
resource sources                        103
canonical items                         318
recipes/processes                       184
abilities/techniques                     41
quests/contracts                         18
companions                                1
transport services                        7
routes                                   19
spell schools                             4
capabilities/training definitions        44
NPC schedules                            21
regional/shared content packs            27
pack-owned records                      992
runtime seed NPCs                        37
runtime seed enemies                     17
```

Mechanics-scale gate remains **NOT READY**:
- companions 1/4;
- abilities 41/100;
- quests 18/30;
- named NPCs 38/50.

## World geography state

`docs/WORLD_MACRO_TOPOLOGY.md` remains authoritative.

Completed post-lock world-edge units:
1. Headwater Vale — Data 52;
2. Starfen Delta / Brackish Coast — Data 53;
3. Gloamwood & Oldbough Refuge — Data 54.

Next ranked geography:
1. **Emberwash Badlands**;
2. Lower Deepvein;
3. Waymeet Marches / central plateau approaches;
4. Coppergrass extensions;
5. Drowned Vaults.

No later unit is auto-authorized by ordering alone.

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
6. `docs/ZONE_PROFILE_GLOAMWOOD.md`
7. `docs/ITEM_CONSUMPTION_SAFETY.md`
8. `docs/ROADMAP.md`
9. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
10. relevant runtime/data/tests for the explicitly selected next unit
