# Thread Handoff

Read this first when continuing Hearth & Horizon in a new development thread.

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.100.10
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          49
Benchmark:     3
Codename:      Ironspine Highlands & Population Hunting
Runtime:       Node >=24
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Current integration state

Population-backed hunting is merged through PR #400 at `e18990188935f52b66fe96cfa9d374ff845618ef`.

Ironspine Highlands is implemented on PR #401. The implementation freeze before version/document promotion is:

- head: `53323564ac724044ff06b1341c5466e73a34ab37`;
- Check #1368 / run `33215878907`;
- Repository Audit: PASS;
- tests: **753/753**;
- Content Census: PASS;
- Benchmark 3: PASS;
- Benchmark Sample: PASS.

The promoted Data 49 PR head must pass the same full hosted gate before merge. After PR #401 lands, work should normally continue directly on `main`. Use a branch only when a change has material rollback/blast-radius risk that an ordinary GitHub revert would not safely contain.

## Data 49 Ironspine geography

Canonical places:

- `ironspine-lower-pass` — danger-2 subalpine pass wilderness;
- `ironspine-watchpost` — danger-0 survey lodge/watch locality;
- `ironspine-high-meadow` — danger-3 alpine meadow/scree wilderness.

Canonical routes:

- `route-redstone-ironspine-pass-road` — North Redstone -> Lower Pass -> High-Pass Watch; walk/mount/wagon;
- `route-ironspine-high-trail` — High-Pass Watch -> High Meadow; walk/mount only.

Boundary rule:

- maintained pass corridors are traversable;
- wagons stop at the watchpost;
- broad cliff bands and unstable scree are not implicit exits;
- route hazards include falling rock, fog, exposure, cold, scree, and whiteout.

High-Pass Watch staff:

- Vara Kell — High-Pass Survey Factor;
- Dain Rove — Ironspine Warden;
- Mara Fell — Pass Lodge Keeper.

## Population-backed hunting

The hunting bridge deliberately avoids a second hunting-state authority.

```text
persistent ecology population
  -> deliberate track/hunt discovery
  -> existing encounter template
  -> existing battle
  -> victory
  -> consume one population unit exactly once
  -> existing defeated-body recovery
  -> provenance-bearing materials
```

Encounter start alone does **not** deplete population availability. Defeat, retreat, or merely locating sign does not falsely reduce ecology.

Hostile populations remain governed by ordinary encounter/aggro authority.

Ironspine encounter-backed populations:

- Ironspine Snowhorn Ibex;
- Ironspine Cliff Bear;
- Froststep Lynx.

## Ironspine ecology and resources

Species/populations:

- Ironspine Snowhorn Ibex;
- Ironspine Cliff Bear;
- Froststep Lynx;
- Ironspine Crag Marmot;
- Whitecrest Eagle;
- Ironspine Snow Grouse.

Gathering sources:

- Stonepine Cone Grove;
- Alpine Sorrel Patch;
- Frost Lichen Face;
- Dwarf Willow Scrub;
- Lodestone Iron Seam;
- Cloud Quartz Pocket.

Body recovery:

- Snowhorn -> hide + fresh game meat;
- Cliff Bear -> hide + fat;
- Froststep Lynx -> pelt.

No passive species was made generically aggressive merely to force loot.

## Production and food preparation

Data 49 adds thirteen regional transformations and thirteen outputs across:

- roasted trail kernels;
- Snowhorn Sorrel Stew;
- salt-smoked Snowhorn;
- rendered bear tallow;
- willow-tanned highland leather;
- dressed Froststep fur lining;
- frost-lichen tallow salve;
- lodestone billet and pointer;
- polished Cloud Quartz;
- High-Pass Survey Compass;
- bearhide bedroll;
- Ironspine Weather Mantle.

Every new Ironspine raw/body resource has intentional production demand.

Food-safety metadata remains explicit internally, but normal world-facing prose uses practical late-medieval/fantasy knowledge:

- raw or poorly prepared game can cause sickness;
- roasting, boiling, stewing, salting, smoking, leaching, washing, drying, or similar preparation is described as accumulated field/kitchen knowledge;
- technical hazard identifiers do not force NPC/player-facing prose to sound like modern microbiology.

Permanent authorities:

- `docs/ZONE_PROFILE_IRONSPINE_HIGHLANDS.md`;
- `docs/ITEM_CONSUMPTION_SAFETY.md`.

## Data 49 census

Validated implementation-freeze census:

```text
places/localities                        37
named NPCs                               29
shop/service sites                       25
creature definitions                    58
resource sources                        56
canonical items                        182
recipes/processes                       94
abilities/techniques                    41
quests/contracts                        18
companions                               1
transport services                       6

routes                                   12
spell schools                             4
capabilities/training definitions        44
NPC schedules                            15
regional/shared content packs            20
pack-owned records                      630
runtime seed NPCs                        28
runtime seed enemies                     16
```

Raw-resource production utilization: **56/64 (87.5%)**.

Luxury raw production utilization: **13/13**.

Mechanics-scale gate remains **NOT READY**. Companions remain the largest relative gap. Canonical items are now 18 short; abilities, NPC breadth, and quests remain materially short.

## Next decision boundary

Formal roadmap:

- Packet E — Gate A integration/census audit.

World-edge sequence:

- Ironspine Highlands is Item 4;
- **Emberwash Badlands** is the next ranked geography candidate.

Other high-value gaps:

- companion breadth;
- NPC/quest network density;
- ability/technique breadth;
- deeper managed husbandry only when a real husbandry source authority is intentionally designed;
- deferred sparse-resource coverage in Old Gaol, Timbercross, and dungeon spaces.

No later unit is auto-started merely because it appears in planning.

## Restart order

1. `AGENTS.md`
2. this file
3. `PROJECT_PROFILE.yaml`
4. `docs/EXECUTION_PIPELINE.md`
5. `docs/ZONE_PROFILE_IRONSPINE_HIGHLANDS.md`
6. `docs/ITEM_CONSUMPTION_SAFETY.md`
7. `docs/ROADMAP.md`
8. relevant runtime/data/tests for the explicitly selected next unit

Do not redo broad discovery unless repository evidence contradicts this checkpoint.
