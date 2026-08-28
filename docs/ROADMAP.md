# Hearth & Horizon Roadmap

Milestones are criteria-driven rather than calendar-driven.

## Current baseline

```text
Product:       0.9.100.9
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          48
Benchmark:     3
Codename:      Great Mere Freshwater Economy & Food Safety
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
```

## Latest bounded unit

### Great Mere Freshwater Economy & Food Safety

**Status: COMPLETE / MERGED through PR #396 at `e327181fcd1e93579f335045a817de1fdae842a5`. Final exact PR-head Check #1348 / run `33212388143` and post-merge main Check #1349 / run `33212454122` both passed with 743/743 tests and the full hosted gate.**

Purpose:
- extend Starfen into a believable large freshwater lake with shore/boat boundary semantics;
- give the zone plausible lake flora/fauna and working fishery ecology;
- connect every new preparation-required Great Mere food raw to a real safe processing path;
- establish explicit direct/process-required/toxic/irritant/pathogen consumption metadata;
- deepen cross-regional preservation, lakecraft, and food processing without new parallel authorities.

Permanent profiles:

- `docs/ZONE_PROFILE_GREAT_MERE.md`
- `docs/ITEM_CONSUMPTION_SAFETY.md`

Final exact-head Check #1348 / run `33212388143`: **743/743 tests**, full gate green. Post-merge main Check #1349 / run `33212454122`: **743/743 tests**, full gate green.

Measured change from Data 47:

```text
places/localities              31 -> 34
creatures                      45 -> 52
resource sources               41 -> 50
canonical items               126 -> 158
recipes/processes              59 -> 81
transport services              5 -> 6
raw production utilization  33/44 -> 45/53
luxury raw utilization      11/11 -> 12/12
```

## Current content census

| Category | Current | Mechanics floor | Status |
| --- | ---: | ---: | --- |
| Places/localities | 34 | 10 | reached |
| Named NPCs | 26 | 50 | 24 short |
| Shop/service sites | 23 | 20 | reached |
| Creature definitions | 52 | 40 | reached |
| Resource sources | 50 | 40 | reached |
| Canonical items | 158 | 200 | 42 short |
| Recipes/processes | 81 | 75 | reached |
| Abilities/techniques | 41 | 100 | 59 short |
| Quests/contracts | 18 | 30 | 12 short |
| Companions | 1 | 4 | 3 short |
| Transport services | 6 | 5 | reached |

Supplemental:

```text
routes                        10
spell schools                  4
capabilities                  44
NPC schedules                 13
regional/shared packs         18
pack-owned records           564
runtime seed NPCs             25
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
2. Crownfields;
3. Great Mere.

Next ranked candidates:
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
- production/recipe breadth: Great Mere pushes recipes/processes past the mechanics floor; future recipes should deepen utility rather than chase count;
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
- new zone food-capable raws require explicit consumption safety plus plausible processing paths;
- Game State changes only for new durable serialized state.

## Validation contract

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```
