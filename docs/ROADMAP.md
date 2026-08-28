# Hearth & Horizon Roadmap

Milestones are criteria-driven rather than calendar-driven.

## Current baseline

```text
Product:       0.9.100.7
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          46
Benchmark:     3
Codename:      Crownfields Agricultural Lowlands
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
```

## Active bounded unit

### Crownfields Agricultural Lowlands

**Status: implementation validated on PR #392; Data 46 promotion and final exact-head integration in progress.**

Purpose:
- give Thornwall a believable food-producing hinterland;
- introduce managed/agricultural ecology;
- add a non-urban service hamlet rather than another major city;
- connect farm production to Thornwall through real route/transport/trade authorities.

Permanent profile:

`docs/ZONE_PROFILE_CROWNFIELDS.md`

Validated pre-promotion Check #1294 / run `33199542741`: **731/731 tests**, full gate green.

## Current content census

| Category | Current | Mechanics floor | Status |
| --- | ---: | ---: | --- |
| Places/localities | 31 | 10 | reached |
| Named NPCs | 23 | 50 | 27 short |
| Shop/service sites | 21 | 20 | reached |
| Creature definitions | 45 | 40 | reached |
| Resource sources | 41 | 40 | reached |
| Canonical items | 96 | 200 | 104 short |
| Recipes/processes | 29 | 75 | 46 short |
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
regional/shared packs         15
pack-owned records           410
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
- production/recipe breadth;
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
