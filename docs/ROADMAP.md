# Hearth & Horizon Roadmap

Milestones are criteria-driven rather than calendar-driven.

## Current baseline

```text
Product:       0.9.100.8
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          47
Benchmark:     3
Codename:      Regional Ingredient & Luxury Processing
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
```

## Active bounded unit

### Regional Ingredient & Luxury Processing

**Status: COMPLETE / MERGED through PR #394 at `fb7a4ec0145c6072aac21525cb15e931125fc327`; final PR Check #1326 and post-merge main Check #1327 passed.**

Purpose:
- make intermediate crafting ingredients first-class rather than skipping raw -> finished;
- deepen existing regional raw-resource demand before adding another large gatherable tranche;
- convert all 11 existing luxury raws from trade-only potential into real production inputs;
- add cross-regional textile, perfume, gem, veneer, ceramic/glaze, food, and reference-artifact chains.

Permanent design record:

`docs/REGIONAL_INGREDIENT_LUXURY_PROCESSING.md`

Pre-promotion Check #1311 / run `33202128019`: **736/736 tests**, full gate green.

Depth result:

```text
raw resource utilization    15/44 -> 33/44
luxury raw utilization       0/11 -> 11/11
canonical items                96 -> 126
recipes/processes              29 -> 59
```

## Current content census

| Category | Current | Mechanics floor | Status |
| --- | ---: | ---: | --- |
| Places/localities | 31 | 10 | reached |
| Named NPCs | 23 | 50 | 27 short |
| Shop/service sites | 21 | 20 | reached |
| Creature definitions | 45 | 40 | reached |
| Resource sources | 41 | 40 | reached |
| Canonical items | 126 | 200 | 74 short |
| Recipes/processes | 59 | 75 | 16 short |
| Abilities/techniques | 41 | 100 | 59 short |
| Quests/contracts | 18 | 30 | 12 short |
| Companions | 1 | 4 | 3 short |
| Transport services | 5 | 5 | reached |

Supplemental:

```text
routes                         8
spell schools                  4
capabilities                  44
NPC schedules                 11
regional/shared packs         16
pack-owned records           470
runtime seed NPCs             22
runtime seed enemies          13
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
2. Crownfields.

Next ranked candidates:
3. Great Mere;
4. Ironspine Highlands;
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

- population-backed passive/wary hunting encounters;
- companion breadth;
- production/recipe breadth: Data 47 closes most of the gap, leaving 16 recipes/processes to the mechanics floor;
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
- Game State changes only for new durable serialized state.

## Validation contract

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```
