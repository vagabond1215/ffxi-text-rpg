# Hearth & Horizon Roadmap

Milestones are criteria-driven rather than calendar-driven.

## Current baseline

```text
Product:       0.9.100.13
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          52
Benchmark:     3
Codename:      Headwater Vale & Waymeet Approach
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
Headwater Vale & Waymeet Approach             COMPLETE / MAIN
```

## Latest bounded unit

### Headwater Vale & Waymeet Approach

**Status: IMPLEMENTED ON `main`; promoted as Data 52 / Product 0.9.100.13.**

Purpose:
- establish the western drainage headwaters above Timbercross;
- create the first real overland leg toward Waymeet without prematurely connecting the plateau;
- add a small wagon-limit warden lodge rather than another city;
- connect river fishing, deer hunting, alder/willow work, preservation, leatherwork, and bridge repair through existing authorities.

Data 52 authored delta:
- 3 places and 2 routes;
- 3 persistent lodge NPCs and 2 schedules;
- 6 species / populations, with Red Deer deliberately huntable and other wildlife remaining non-forced;
- 6 gathering sources + 3 deer body resources;
- 10 transformations and 10 production outputs;
- 2 Pack-v2 ownership graphs;
- practical raw-fish/raw-game safety with fantasy-era presentation.

Implementation freeze:
- `aa39347a0faa754690a194d926262256e92027f1`;
- Check #1476 / run `33264692343`: Repository Audit, **770/770 tests**, Census, Benchmark 3, Benchmark Sample green.

Game State remains 14; no new durable state family was introduced.

## Current content census

| Category | Current | Mechanics floor | Status |
| --- | ---: | ---: | --- |
| Places/localities | 40 | 10 | reached |
| Named NPCs | 32 | 50 | 18 short |
| Shop/service sites | 27 | 20 | reached |
| Creature definitions | 64 | 40 | reached |
| Resource sources | 89 | 40 | reached |
| Canonical items | 283 | 200 | reached |
| Recipes/processes | 164 | 75 | reached |
| Abilities/techniques | 41 | 100 | 59 short |
| Quests/contracts | 18 | 30 | 12 short |
| Companions | 1 | 4 | 3 short |
| Transport services | 6 | 5 | reached |

Supplemental:

```text
routes                        14
spell schools                  4
capabilities                  44
NPC schedules                 17
regional/shared packs         23
pack-owned records           859
runtime seed NPCs             31
runtime seed enemies          17
```

Mechanics-scale gate remains **NOT READY**. Companions remain the largest relative gap.

## Latest planning pass

### Macro-World Topology Lock

**Status: COMPLETE ON `main`; documentation/planning only.**

No Product, Data, Game State, or Benchmark change accompanies this pass. The latest runtime/data checkpoint is Data 52.

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

Post-lock world-edge status:

- **Headwater Vale — COMPLETE / Data 52.**

Remaining ranking:
1. Starfen Delta / Brackish Coast;
2. Gloamwood;
3. Emberwash Badlands;
4. Lower Deepvein;
5. Waymeet Marches / central plateau approaches;
6. Coppergrass extensions;
7. Drowned Vaults.

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
