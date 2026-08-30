# Thread Handoff

Read this first when continuing Hearth & Horizon in a new development thread.

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.100.23
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          62
Benchmark:     3
Codename:      Cross-Biome Family Breadth
Runtime:       Node >=24
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Current integration state

**Cross-Biome Family Breadth is complete and promoted on `main` as Data 62.**

Plan:
- `docs/CROSS_BIOME_FAMILY_BREADTH_PLAN.md`;
- plan commit `b6b0c309c60357916550d92928f86d07847229f8`.

Implementation:
- initial candidate `015389b05fbccc943a7d8c3e69dcfd5a42bfb8ef`;
- measured guard synchronization / implementation freeze `c5e12b5d8f0b6ddf7a76f5df01316567b43d4528`.

Implementation-freeze evidence:
- Check **#1634 / run `33331659415`**;
- Repository Audit PASS;
- **822/822 tests PASS**;
- Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS.

Promoted runtime/data:
- `bc472b60374a048686b0ee6c877ba26c515aec35`;
- Product 0.9.100.23 / Data 62 / Game State 14 / Package 0.9.100.

Permanent authority synchronization:
- `f6dcfde4344002aedd49100e4d52b18484ab31bd`;
- PROJECT_PROFILE, README, roadmap, execution pipeline, system catalog, version roadmap, location-diversity audit, and Cross-Biome plan updated for Data 62.

This handoff is the final synchronization write. The exact head after it must have hosted Check and Pages green before closure.

## Data 62 authored delta

This is repair unit **5 of 5** from `docs/LOCATION_FLORA_FAUNA_DIVERSITY_AUDIT.md`.

Added:
- **2 new ecology families**;
- **7 new species**;
- **7 new population placements**;
- **0 new gathering sources**;
- **0 new raw resources**;
- **0 new transformations/outputs**;
- **1 cross-region Pack-v2 repair graph**.

### Ground Squirrel family

New family:
- `family-ground-squirrel`.

Species:
- Coppergrass Loess Ground Squirrel — Coppergrass Steppe;
- Waymeet Cairn Ground Squirrel — Waymeet South Marches;
- Crownfields Hedgebank Ground Squirrel — Crownfields.

The family is deliberately scoped to small open-ground burrowers and does not replace Rat, Marmot, or Hare taxonomy.

Slatewater did not receive another burrowing mammal because Data 60 already added Brush Hare as its small-prey layer.

### Finch family

New family:
- `family-finch`.

Species:
- Coppergrass Seed Finch — Coppergrass Steppe;
- Crownfields Hedgerow Finch — Crownfields;
- Elderwood Hazel Finch — East Elderwood;
- Slatewater Thistle Finch — Slatewater Foothills.

The family is deliberately scoped to small seed-eating passerines rather than acting as a generic “songbird” bucket.

## Behavior and recovery boundary

All seven new species:
- are passive/wary;
- have no encounter template;
- have no authored body-resource, loot, hunting, or trapping source;
- were not made hostile merely to manufacture drops.

Ordinary seedgrass, hedges, thistles, coppice vegetation, and burrow evidence remain descriptive habitat rather than new inventory nodes.

Existing predator-family link metadata was deliberately left unchanged. The new prey families improve ecological presence, but family-link normalization has no current player-facing mechanical requirement and would rewrite older pack-owned predator records without enough benefit.

## Location-diversity sequence status

The ordered five-part repair sequence is **complete**:

1. Legacy Elderwood Ecology Repair — **COMPLETE / Data 58**;
2. Dry Upland & Saltpan Ecology Repair — **COMPLETE / Data 59**;
3. Headwater / Highland Transition Spread — **COMPLETE / Data 60**;
4. Wetland / Island Distribution Repair — **COMPLETE / Data 61**;
5. Cross-Biome Family Breadth — **COMPLETE / Data 62**.

Do **not** treat optional audit ideas as unfinished Data 62 work.

Post-sequence ecology opportunities requiring a fresh explicit selection:
- broader Crownfields ordinary-wildlife spread using existing families;
- Deepvein Mine / Sunken Archive secondary ecology/substrate cleanup;
- shorebird/wader breadth if future coastal depth warrants it;
- snake breadth only when tied to a concrete ecological/player/economic loop.

The lower-river fish gap is already resolved through River Dace from Data 58.

## Data 62 census

```text
places/localities                        55
named NPCs                               47
shop/service sites                       37
creature definitions                    123
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
regional/shared content packs            39
pack-owned records                     1320
runtime seed NPCs                        46
runtime seed enemies                     17
raw resources with production demand 145/154
luxury raws with production demand      14/14
```

Creature breadth now clears the playable-alpha planning lower bound of 120.

Mechanics-scale gate remains **NOT READY**:
- companions 1/4;
- abilities 41/100;
- quests 18/30;
- named NPCs 47/50.

Do not close those gaps with disconnected filler.

## Persistence decision

Game State remains **14**.

Data 62 adds static families, species, populations, and descriptive habitat text only. It adds no durable serialized ecology, route, recovery, or player/world-state family.

## Fresh decision boundary

The ecology repair sequence no longer owns the automatic next action.

Available independent queues:
- **Packet E — Gate A integration/census audit**;
- **Waymeet Inner Marches / outer crossroads approach**;
- **Occupational Tool Conversion**;
- optional post-sequence ecology work listed above.

World-edge ranking remains:
1. Waymeet Inner Marches / outer crossroads approach;
2. Coppergrass extensions;
3. Drowned Vaults.

None is auto-started.

## Restart order

1. `AGENTS.md`
2. this file
3. `PROJECT_PROFILE.yaml`
4. `docs/LOCATION_FLORA_FAUNA_DIVERSITY_AUDIT.md`
5. `docs/CROSS_BIOME_FAMILY_BREADTH_PLAN.md`
6. `docs/EXECUTION_PIPELINE.md`
7. `docs/ROADMAP.md`
8. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
9. relevant files for the explicitly selected next queue

## Final validation requirement

The exact head after this handoff must have:
- hosted Check green;
- Pages green.

If final synchronization validation exposes only stale authority/version assertions, repair them narrowly, rewrite this handoff last again, and rerun the exact head before closure.
