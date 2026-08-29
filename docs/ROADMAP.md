# Hearth & Horizon Roadmap

Milestones are criteria-driven rather than calendar-driven.

## Current baseline

```text
Product:       0.9.100.12
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          51
Benchmark:     3
Codename:      Regional Resource & Trade Resilience
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
Ironspine Highlands                           COMPLETE / MERGED
```

## Latest bounded unit

### Regional Resource & Trade Resilience

**Status: IMPLEMENTED ON `main`; Data 51 promoted as Product 0.9.100.12; exact-head validation pending final continuity synchronization.**

Purpose:
- audit established economic areas as local-region + dependable-trade basins;
- ensure ordinary food, tools, repairs, fuel, bindings, construction stock, medicine, and preservation do not hinge on one implausibly distant specialty input;
- preserve genuine regional specialties and premium trade.

Data 51 remediation:
- Crownfields Brick Clay;
- Starfen Alluvial Clay and Marsh Willow timber;
- Coppergrass Thornwood;
- Ironspine Stonepine timber and common pass stone;
- four regional charcoal alternatives;
- a lower-yield Great Mere dry-smoking fallback without imported rock salt;
- practical kitchen/workshop exposure at Slatewater, Ironspine, and Mistmere where existing descriptions already implied it.

Expected growth from Data 50:
```text
resource sources               77 -> 83
canonical items               258 -> 264
recipes/processes             149 -> 154
regional/shared packs          21 -> 21
pack-owned records            782 -> 799
raw production utilization  77/85 -> 80/91
luxury raw utilization      14/14 -> 14/14
```

The governing rule is **ordinary substitutes should exist; premium outcomes may still require specialty trade**. Coppergrass remains a transit wilderness rather than a staffed manufacturing locality.

Permanent audit: `docs/REGIONAL_RESOURCE_DISTRIBUTION_AUDIT.md`.

Game State remains 14; no new durable state family was introduced.

## Current content census

| Category | Current | Mechanics floor | Status |
| --- | ---: | ---: | --- |
| Places/localities | 37 | 10 | reached |
| Named NPCs | 29 | 50 | 21 short |
| Shop/service sites | 25 | 20 | reached |
| Creature definitions | 58 | 40 | reached |
| Resource sources | 83 | 40 | reached |
| Canonical items | 264 | 200 | reached |
| Recipes/processes | 154 | 75 | reached |
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
regional/shared packs         21
pack-owned records           799
runtime seed NPCs             28
runtime seed enemies          16
```

Mechanics-scale gate remains **NOT READY**. Companions remain the largest relative gap.

## Latest planning pass

### Macro-World Topology Lock

**Status: COMPLETE ON `main`; documentation/planning only.**

No Product, Data, Game State, or Benchmark change accompanies this pass. The latest runtime/data checkpoint remains Data 51.

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

## Macro-world topology

**TOPOLOGY LOCK COMPLETE / NO VERSION CHANGE.**

Permanent authority:
- `docs/WORLD_MACRO_TOPOLOGY.md`.

The lock establishes:

- irregular continuous world geography rather than a global square/hex board;
- route graph as inter-place traversability/distance/time authority;
- local grids/topologies as place-scale exploration abstractions;
- Central Continent + Southern Landmass + Eastern Archipelago;
- Deep World + Pelagic layers;
- Ironspine and western mountain-crescent barriers;
- Great Mere east-draining freshwater outflow to a future brackish delta/Eastern Sea;
- reserved Lethari, Korren, Miri, Veyra, Waymeet, and pelagic civilization envelopes.

The old macro-planning hold is lifted as a geography blocker. Edge implementation still requires an explicit bounded work order.

Post-lock world-edge ranking:

1. Headwater Vale;
2. Starfen Delta / Brackish Coast;
3. Gloamwood;
4. Emberwash Badlands;
5. Lower Deepvein;
6. Waymeet Marches / central plateau approaches;
7. Coppergrass extensions;
8. Drowned Vaults.

The temporary detailed edge notes remain in `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md`.

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
