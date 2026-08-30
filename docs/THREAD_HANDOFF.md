# Thread Handoff

Read this first when continuing Hearth & Horizon in a new development thread.

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.100.18
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          57
Benchmark:     3
Codename:      Waymeet Marches & Cairnward Relay
Runtime:       Node >=24
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Current integration state

**Waymeet Marches & Cairnward Relay is the latest promoted runtime/data bounded unit on `main`.**

Waymeet implementation freeze:
- `3ef4830baf992e6f9ff973576d6be642e47dc3fa`;
- Check **#1592 / run `33293624219`**;
- Repository Audit, **797/797 tests**, Census, Benchmark 3, Benchmark Sample green.

Promoted runtime/data commit:
- `bf2103355ac3fc79b69e0007c46f9d3f14552054`;
- Product 0.9.100.18 / Data 57 / Game State 14 / Package 0.9.100.

Release-authority synchronization commit:
- `76aa98c56d2fbceee7ada4d0b4d694e92ad87eb2`;
- README, PROJECT_PROFILE, ROADMAP, EXECUTION_PIPELINE, SYSTEM_CATALOG, and VERSIONING_AND_RELEASE_ROADMAP moved to Data 57;
- hosted Check #1594 failed only because this handoff still carried the Data 56 version block;
- Pages #1726 was green.

The current ecology/location diversity audit is documentation-only and does not change Product/Data/Game State.

Normal low-risk work continues directly on `main`. Use a branch only when rollback/blast-radius risk materially exceeds what ordinary GitHub revert/history can safely contain.

## Data 57 — Waymeet Marches & Cairnward Relay

Plan:
- `docs/ZONE_PLAN_WAYMEET_MARCHES.md`.

Bounded geography:
- Windscar Saddle — exposed central-plateau saddle;
- Cairnward Relay — sparse neutral pack-to-wagon logistics relay;
- Waymeet South Marches — first open southern march country;
- Headwater–Cairnward Pack Road — walk/mount/caravan, **no wagons**;
- Cairnward South March Road — walk/mount/wagon/caravan;
- no route continues from South Marches to inner Waymeet Marches or Waymeet metropolis.

Ecology/resources:
- 8 plateau species/populations;
- 7 exact-provenance raw resources;
- established Marmot, Grouse, Fox, Mountain Eagle, Bee, Owl, and Waterfowl families reused;
- Moor Char is the only new family required by the bounded biome;
- ordinary wildlife remains passive, wary, or naturally territorial;
- 10 transformations / 10 outputs;
- every new raw has production demand;
- raw production utilization **124/135**;
- luxury utilization **14/14**.

People/services:
- Sella Ward — Cairnward Relay Factor;
- Kellan Rusk — Plateau Route Warden;
- Tam Berrow — Cairnward Cartwright;
- 2 schedules;
- exchange, route desk, cart/repair shelter, common hearth/cistern/bunks.

Persistence:
- Game State remains 14;
- no wagon-transfer, route-condition, weather, permit, border, settlement, or macro-coordinate state family was added.

## Data 57 census

```text
places/localities                        55
named NPCs                               47
shop/service sites                       37
creature definitions                    104
resource sources                        124
canonical items                         369
recipes/processes                       214
abilities/techniques                     41
quests/contracts                         18
companions                                1
transport services                        7
routes                                   25
spell schools                             4
capabilities/training definitions        44
NPC schedules                            27
regional/shared content packs            33
pack-owned records                     1183
runtime seed NPCs                        46
runtime seed enemies                     17
```

Mechanics-scale gate remains **NOT READY**:
- companions 1/4;
- abilities 41/100;
- quests 18/30;
- named NPCs 47/50.

## Location flora/fauna diversity audit

Permanent audit:
- `docs/LOCATION_FLORA_FAUNA_DIVERSITY_AUDIT.md`;
- audit commit `329b0c0249f2b1ca2f55663614fee3e188c0efa1`;
- documentation/planning only;
- no version or persistence change.

Audit scope:
- all 55 places;
- all 30 wilderness/dungeon-scale locations;
- fauna family/species/population spread;
- flora/fungal gathering-source coverage;
- trophic overlap;
- biome-transition continuity;
- prior deferred ecology gaps.

### Highest-confidence location gaps

P0:
1. **Emberwash Saltpan Verge** — place fiction explicitly names saltbrush but there are zero flora sources.
2. **Thornwall Old Gaol** — only wilderness/dungeon-scale place with zero populations and zero sources.
3. **Timbercross Landing** — river bend has Otter/Turtle but zero flora sources and no fish population/source.
4. **Reedcrown Isle** — explicit reed-crown habitat but zero flora sources; Grebe prey is only regionally, not locally, represented.

P1:
- Headwater Upper Vale — too little meadow/tributary/saddle-transition spread;
- North Redstone Reach — too little ridge/scrub fauna/flora spread below Ironspine;
- East Elderwood — flora-rich but fauna-thin;
- East Starfen — flora-rich fen but aquatic/wader guilds are thin;
- Slatewater Foothills — headline large vertebrates are good, small prey/pollinators thin;
- Crownfields — managed ecology lacks ordinary hedgerow/ditch wild fauna;
- Ironspine — no pollinator/insect population;
- Coppergrass — missing small burrowing prey base;
- South Redstone — vegetation coverage is much thinner than fauna/mineral coverage.

P2:
- Deepvein Mine;
- Sunken Archive;
- Redfang Camp.

These remain bounded secondary ecology/substrate gaps rather than broken references.

### Recommended existing-family spread before new taxonomy

Reuse first:
- Hare;
- Bee;
- Grouse;
- Waterfowl;
- Frog;
- Dragonfly;
- Mire Heron;
- Reed Eel;
- Crab;
- Ridge Ibex;
- Lizard;
- Bat;
- Spider.

### Best genuinely new family candidates

1. **Ground-squirrel / vole / small burrowing rodent** — highest value across Coppergrass, Waymeet plateau, Crownfields margins, and selected foothill habitats.
2. **Scoped small passerine** such as Finch/Lark/Thrush — fills forest, hedgerow, orchard, foothill, and grassland small-bird absence.
3. **Lower-river fish** — gives Timbercross/lower western rivers a distinct niche instead of forcing cold-stream trout downstream.
4. Shorebird/small wader — useful future delta/coast depth.
5. Snake — optional broad ecological breadth, not a current coherence defect.

### New-biome verdicts

- Waymeet Marches: **good**; needs local overlap/refinement, not another family batch.
- Emberwash: **good north wash; incomplete saltpan flora**.
- Lower Deepvein: **strong cave-frontier diversity**.
- Gloamwood: **strong old-growth diversity**.
- Starfen Delta/Brackish Coast: **strong coast; moderately thin lower-delta spread**.

## Recommended ecology repair order

If explicitly authorized:

1. Legacy Elderwood Ecology Repair
   - Timbercross Landing;
   - East Elderwood;
   - Thornwall Old Gaol;
   - Redfang Camp only where useful.
2. Dry Upland & Saltpan Ecology Repair
   - North/South Redstone vegetation;
   - Emberwash Saltpan halophytes;
   - transition-family spread.
3. Headwater / Highland Transition Spread
   - Headwater Upper Vale;
   - Windscar Grouse overlap;
   - Slatewater/Ironspine pollinators and small prey.
4. Wetland / Island Distribution Repair
   - East Starfen;
   - Reedcrown Isle;
   - Starfen Lower Delta.
5. Cross-biome family breadth
   - small burrowing rodent;
   - scoped passerine;
   - lower-river fish.

Do not implement all five automatically as a single ecology megatranch.

## World geography state

`docs/WORLD_MACRO_TOPOLOGY.md` remains the macro-topology authority.

Completed post-lock world-edge runtime/data units:
1. Headwater Vale — Data 52;
2. Starfen Delta / Brackish Coast — Data 53;
3. Gloamwood & Oldbough Refuge — Data 54;
4. Emberwash Badlands & Cinderwell Station — Data 55;
5. Lower Deepvein & Lantern Sump Station — Data 56;
6. Waymeet Marches & Cairnward Relay — Data 57.

Current overland sequence:

```text
Timbercross
  -> Headwater Vale
  -> Windscar Saddle
  -> Cairnward Relay
  -> Waymeet South Marches
  -X-> inner marches / Waymeet
```

The next possible Waymeet continuation remains a separately bounded **inner-marches / outer-crossroads approach**, not automatic authorization for the metropolis.

Existing ranked world-edge alternatives remain:
- Coppergrass extensions;
- Drowned Vaults.

### Known continuity note

The prior Waymeet run synchronized the repository-audit-required release authorities but did not finish all optional/planning continuity edits originally intended for:
- `docs/WORLD_MACRO_TOPOLOGY.md`;
- `docs/WORLD_CIVILIZATION_GEOGRAPHY_PLAN.md`;
- `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md`;
- a permanent Waymeet regional profile.

Repository runtime/data authority is Data 57. Before another Waymeet world-edge implementation, normalize those planning documents against current Data 57 evidence rather than assuming their older prose is current.

## Audit validation note

The first exact audit-head Check (#1596 / run `33311920739`) passed Repository Audit but exposed one stale Data 56-era regression assertion in `tests/pipeline.test.js`: `describeVersion()` was still expected to print Product 0.9.100.17 even though all primary manifest assertions already expected 0.9.100.18 / Data 57.

Repair commit:
- `93566e516d6ab6ed53ed4d89fcb08d235e611caf`;
- changes only the stale expected Product string;
- no runtime/data/ecology behavior changes.

The exact final audit head after this handoff must pass the full hosted Check and Pages before the audit is treated as closed.

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
5. `docs/EXECUTION_PIPELINE.md`
6. `docs/WORLD_MACRO_TOPOLOGY.md`
7. `docs/ZONE_PLAN_WAYMEET_MARCHES.md`
8. `docs/ITEM_CONSUMPTION_SAFETY.md`
9. `docs/ROADMAP.md`
10. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
11. relevant runtime/data/tests for the explicitly selected next unit
