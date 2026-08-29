# Thread Handoff

Read this first when continuing Hearth & Horizon in a new development thread.

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.100.14
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          53
Benchmark:     3
Codename:      Starfen Delta & Brackish Coast
Runtime:       Node >=24
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Current integration state

**Starfen Delta & Brackish Coast is complete and promoted on `main`.**

Implementation freeze:
- `c515588c404c0f80a724d767b74535f1e39ae166`;
- Check **#1491 / run `33267789356`**;
- Repository Audit, **776/776 tests**, Census, Benchmark 3, Benchmark Sample green.

Promoted Data 53 checkpoint:
- `8f968155d092431b0a3314d38f4d890b0c87f599`;
- Check **#1493 / run `33267935109`**;
- same full gate green.

Normal low-risk work continues directly on `main`. Use a branch only when rollback/blast-radius risk materially exceeds what ordinary GitHub revert/history can safely contain.

## Data 53 — Starfen Delta / Brackish Coast

Plan:
- `docs/ZONE_PLAN_STARFEN_DELTA_BRACKISH_COAST.md`.

Permanent profile:
- `docs/ZONE_PROFILE_STARFEN_DELTA_BRACKISH_COAST.md`.

Geography:
- Starfen Lower Delta — danger 2 distributary/levee wilderness;
- Tideglass Landing — danger 0 small pilot/fishery/salt-work port;
- Starfen Brackish Coast — danger 3 tidal coastal wilderness;
- East Fen Delta Levee — walk/mount;
- Mere-Delta Waterway — ferry, Merewatch -> Lower Delta -> Tideglass;
- Mere-Delta Packet Boat — scheduled service with Lower Delta field stop;
- Tideglass Coast Track — walk/mount;
- Eastern Sea is explicitly not walkable;
- no Miri/open-ocean route yet.

Ecology/resources:
- 8 species/populations;
- 4 reused wetland families + 4 new coastal families;
- 7 exact-provenance raw sources/resources;
- no ordinary coastal wildlife forced into encounter templates.

Production:
- 10 transformations / 11 outputs;
- eel cleaning/smoking;
- crab boiling;
- oyster shucking -> meat + shell;
- roasted oysters;
- shell lime;
- dried kelp;
- refined sea salt;
- woven reed matting;
- pickled samphire;
- every new raw has production demand;
- raw production utilization **96/107**;
- luxury utilization **14/14**.

Food:
- raw eel/crab/oyster require preparation and can cause sickness;
- shucked oyster meat remains raw;
- smoked/boiled/roasted forms are ready;
- kelp/samphire are rinsed before direct use;
- language remains practical late-medieval/fantasy knowledge.

People:
- Lessa Venn — Delta Factor;
- Orin Cade — Delta Pilot;
- Maela Thorne — Smokehouse Keeper;
- 2 schedules;
- exchange, pilot house, smokehouse, tideworks.

Persistence:
- Game State remains 14;
- no durable tide/ocean/ship/fishing state family.

## Data 53 census

```text
places/localities                        43
named NPCs                               35
shop/service sites                       29
creature definitions                     72
resource sources                         96
canonical items                         301
recipes/processes                       174
abilities/techniques                     41
quests/contracts                         18
companions                                1
transport services                        7
routes                                   17
spell schools                             4
capabilities/training definitions        44
NPC schedules                            19
regional/shared content packs            25
pack-owned records                      927
runtime seed NPCs                        34
runtime seed enemies                     17
```

Mechanics-scale gate remains **NOT READY**:
- companions 1/4;
- abilities 41/100;
- quests 18/30;
- named NPCs 35/50.

## World geography state

`docs/WORLD_MACRO_TOPOLOGY.md` remains authoritative.

Completed post-lock world-edge units:
1. Headwater Vale — Data 52;
2. Starfen Delta / Brackish Coast — Data 53.

Next ranked geography:
1. **Gloamwood**;
2. Emberwash Badlands;
3. Lower Deepvein;
4. Waymeet Marches / central plateau approaches;
5. Coppergrass extensions;
6. Drowned Vaults.

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
6. `docs/ZONE_PROFILE_STARFEN_DELTA_BRACKISH_COAST.md`
7. `docs/ITEM_CONSUMPTION_SAFETY.md`
8. `docs/ROADMAP.md`
9. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
10. relevant runtime/data/tests for the explicitly selected next unit
