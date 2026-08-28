# Hearth & Horizon Roadmap

Milestones are criteria-driven rather than calendar-driven.

## Current baseline

```text
Product:       0.9.100.10
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          49
Benchmark:     3
Codename:      Ironspine Highlands & Population Hunting
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Completed foundation and major tranches

```text
Phase 0.4–0.8 foundation                COMPLETE
Content Pack Scale Contract v2          COMPLETE / MERGED
Redstone Forge-Road                      COMPLETE / MERGED
Elderwood Hunt-Timber                    COMPLETE / MERGED
Universal Magic & Starfen Marshcraft    COMPLETE / MERGED
Ecology family/resource breadth         COMPLETE / MERGED
Coppergrass Steppe                       COMPLETE / MERGED
Slatewater Foothills & Waylodge         COMPLETE / MERGED
Ecology & Geography Integrity           COMPLETE / MERGED
Crownfields Agricultural Lowlands        COMPLETE / MERGED
Regional Ingredient & Luxury Processing COMPLETE / MERGED
Great Mere Freshwater Economy & Food Safety COMPLETE / MERGED
Population-backed Hunting Bridge             COMPLETE / MERGED
Ironspine Highlands                           IMPLEMENTED / DATA 49 PROMOTION
```

## Latest bounded unit

### Ironspine Highlands & Population Hunting

**Status: implementation frozen on `53323564ac724044ff06b1341c5466e73a34ab37`; Check #1368 / run `33215878907` passed Repository Audit, 753/753 tests, Census, Benchmark 3, and Benchmark Sample. PR #401 performs Data 49 promotion/document synchronization.**

Purpose:
- extend North Redstone into believable alpine/subalpine terrain with pass, wagon-limit, cliff, scree, and high-trail semantics;
- connect passive/wary/territorial ecology populations to deliberate encounters without making ordinary wildlife aggressive;
- consume population units only after victory and preserve defeated-body recovery/provenance;
- add alpine flora/fauna, highland gathering, hunted materials, preservation, leather/fur work, field remedies, survey craft, and cold-weather equipment;
- keep food-safety metadata precise internally while presenting preparation as period-appropriate field and kitchen knowledge.

Permanent profiles:

- `docs/ZONE_PROFILE_IRONSPINE_HIGHLANDS.md`
- `docs/ITEM_CONSUMPTION_SAFETY.md`

Implementation-freeze Check #1368 / run `33215878907`: **753/753 tests**, full gate green.

Measured change from Data 47:

```text
places/localities              34 -> 37
named NPCs                     26 -> 29
creatures                      52 -> 58
resource sources               50 -> 56
canonical items               158 -> 182
recipes/processes              81 -> 94
routes                          10 -> 12
NPC schedules                  13 -> 15
packs                          18 -> 20
pack-owned records            564 -> 630
raw production utilization  45/53 -> 56/64
luxury raw utilization      12/12 -> 13/13
```

## Current content census

| Category | Current | Mechanics floor | Status |
| --- | ---: | ---: | --- |
| Places/localities | 37 | 10 | reached |
| Named NPCs | 29 | 50 | 21 short |
| Shop/service sites | 25 | 20 | reached |
| Creature definitions | 58 | 40 | reached |
| Resource sources | 56 | 40 | reached |
| Canonical items | 182 | 200 | 18 short |
| Recipes/processes | 94 | 75 | reached |
| Abilities/techniques | 41 | 100 | 59 short |
| Quests/contracts | 18 | 30 | 12 short |
| Companions | 1 | 4 | 3 short |
| Transport services | 6 | 5 | reached |

Supplemental:

```text
routes                        12
spell schools                  4
capabilities                  44
NPC schedules                 15
regional/shared packs         20
pack-owned records           630
runtime seed NPCs             28
runtime seed enemies          16
```

Mechanics-scale gate remains **NOT READY**. Companions remain the largest relative gap.

## Formal Phase 0.9 sequence

Packets A–D: **COMPLETE / MERGED**.

### Packet E — Gate A integration/census audit

**QUEUED / NOT STARTED.**

Packet E remains the next formal roadmap gate unless a future explicit work order chooses another bounded content/system tranche first.

Packet E should inspect:
- which remaining count gaps correspond to missing player loops versus simple breadth;
- pack dependency/ownership density;
- route/service reachability;
- item source/sink depth;
- NPC/quest/companion network gaps;
- production and ability breadth;
- architecture debt exposed by the larger world.

## World-edge sequence

The temporary detailed plan remains in `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md`.

Implemented:
1. Slatewater Foothills;
2. Crownfields;
3. Great Mere;
4. Ironspine Highlands.

Next ranked candidates:
5. Emberwash Badlands;
6. Gloamwood;
7. Headwater Vale;
8. Lower Deepvein;
9. Drowned Vaults;
10. Coppergrass extensions;
11. Starfen delta/coast;
12. Waymeet approaches.

The sequence is planning, not automatic authorization.

## High-value system/content gaps

- companion breadth;
- production/recipe breadth already exceeds the mechanics floor; future recipes should deepen utility rather than chase count;
- NPC and quest network density;
- ability/technique breadth;
- deeper Crownfields agricultural processing/husbandry when justified;
- sparse Old Gaol/Timbercross/dungeon resource coverage from the Data 45 audit.

## Durable constraints

- one domain authority per state family;
- one fictional world clock;
- maps/places/routes must cross-reference cleanly;
- no contradictory direct edges shadowing canonical routes;
- player-enterable places require an escape path unless deliberate;
- Pack v2 owns placement/dependencies, not duplicate definitions;
- universal magic remains shared/character-owned;
- managed animal products should wait for a real husbandry source model;
- new zone food-capable raws require explicit consumption safety plus plausible processing paths, with world-facing language grounded in practical fantasy-era knowledge;
- Game State changes only for new durable serialized state.

## Validation contract

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```
