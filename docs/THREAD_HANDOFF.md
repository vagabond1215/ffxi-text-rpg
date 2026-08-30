# Thread Handoff

Read this first when continuing Hearth & Horizon in a new development thread.

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.100.16
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          55
Benchmark:     3
Codename:      Emberwash Badlands & Cinderwell Station
Runtime:       Node >=24
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Current integration state

**Emberwash Badlands & Cinderwell Station is complete and promoted on `main` as Data 55.**

Implementation freeze:
- `2e8d8a519dcc916f91a120fb66337fe16753f6a4`;
- Check **#1547 / run `33279116948`**;
- Repository Audit, **786/786 tests**, Census, Benchmark 3, Benchmark Sample green.

Promoted Data 55 checkpoint:
- `6f850b4a63a152f17a55dec23224dff42c512cad`;
- Check **#1559 / run `33279480611`**;
- same full gate green;
- Pages #1692 green.

Normal low-risk work continues directly on `main`. Use a branch only when rollback/blast-radius risk materially exceeds what ordinary GitHub revert/history can safely contain.

## Data 55 — Emberwash Badlands & Cinderwell Station

Plan:
- `docs/ZONE_PLAN_EMBERWASH_BADLANDS.md`.

Permanent profile:
- `docs/ZONE_PROFILE_EMBERWASH_BADLANDS.md`.

Geography:
- Emberwash North Wash — danger 2 dry-upland/badland transition wilderness;
- Cinderwell Station — danger 0 fortified caravan well and route station;
- Emberwash Saltpan Verge — danger 3 salt-basin/desert-scrub edge;
- Cinderwell Caravan Road — South Redstone -> North Wash -> Cinderwell, walk/mount/wagon/caravan;
- Saltpan Foretrail — Cinderwell -> Saltpan Verge, walk/mount/caravan;
- Cinderwell is the wagon limit;
- no farther-desert, southern-strait, or Veyra onward route yet.

Ecology/resources:
- 8 species/populations;
- 4 reused arid/highland families + 4 new Emberwash families;
- 7 exact-provenance forage/gather/mine sources/resources;
- ordinary wildlife remains passive, wary, or naturally territorial rather than being forced hostile for loot.

Production:
- 10 transformations / 10 outputs;
- ground emberpod meal and baked trail cakes;
- dried cinder pear and desert sage;
- cinderbrush cord;
- refined caravan salt;
- red ochre pigment;
- gypsum plaster;
- dustwrap repair kit using canonical Crownfields linen;
- cistern patch compound;
- every new raw has production demand;
- raw production utilization **110/121**;
- luxury utilization **14/14**.

Food:
- raw Emberpod requires milling/cooking before ordinary eating;
- ripe Cinder Pear is direct-ready after peeling and despining;
- trail cakes and dried pear are direct-ready;
- language remains practical late-medieval/fantasy knowledge.

People:
- Tarin Hove — Cinderwell Field Factor;
- Merek Sorn — Emberwash Caravan Warden;
- Pella Aven — Cinderwell Station Keeper;
- 2 schedules;
- exchange, warden desk, cistern workyard, shade hearth/bunks.

Persistence:
- Game State remains 14;
- no durable survival meter, weather state, Veyra-border state, or desert-access state family.

## Data 55 census

```text
places/localities                        49
named NPCs                               41
shop/service sites                       33
creature definitions                     88
resource sources                        110
canonical items                         335
recipes/processes                       194
abilities/techniques                     41
quests/contracts                         18
companions                                1
transport services                        7
routes                                   21
spell schools                             4
capabilities/training definitions        44
NPC schedules                            23
regional/shared content packs            29
pack-owned records                     1057
runtime seed NPCs                        40
runtime seed enemies                     17
```

Mechanics-scale gate remains **NOT READY**:
- companions 1/4;
- abilities 41/100;
- quests 18/30;
- named NPCs 41/50.

## World geography state

`docs/WORLD_MACRO_TOPOLOGY.md` remains authoritative.

Completed post-lock world-edge units:
1. Headwater Vale — Data 52;
2. Starfen Delta / Brackish Coast — Data 53;
3. Gloamwood & Oldbough Refuge — Data 54;
4. Emberwash Badlands & Cinderwell Station — Data 55.

Next ranked geography:
1. **Lower Deepvein**;
2. Waymeet Marches / central plateau approaches;
3. Coppergrass extensions;
4. Drowned Vaults.

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
6. `docs/ZONE_PROFILE_EMBERWASH_BADLANDS.md`
7. `docs/ZONE_PLAN_EMBERWASH_BADLANDS.md`
8. `docs/ITEM_CONSUMPTION_SAFETY.md`
9. `docs/ROADMAP.md`
10. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
11. relevant runtime/data/tests for the explicitly selected next unit
