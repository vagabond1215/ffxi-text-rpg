# Hearth & Horizon Roadmap

Milestones are criteria-driven rather than calendar-driven.

## Current baseline

```text
Product:       0.9.100.15
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          54
Benchmark:     3
Codename:      Gloamwood & Oldbough Refuge
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
Starfen Delta & Brackish Coast                 COMPLETE / MAIN
```

## Latest bounded unit

### Starfen Delta & Brackish Coast

**Status: IMPLEMENTED ON `main`; promoted as Data 53 / Product 0.9.100.14.**

Purpose:
- realize the Great Mere eastward outflow;
- establish the freshwater-to-brackish transition and first Eastern Sea coast;
- keep Tideglass a small pilot/fishery/salt-work port rather than another major city;
- preserve open-sea non-walkability and defer Miri/open-ocean travel;
- connect coastal resources to preservation, packing, construction, and trade.

Data 53 authored delta:
- 3 places, 3 routes, 1 scheduled packet-boat service;
- 3 persistent NPCs and 2 schedules;
- 8 species/populations and 7 exact-provenance sources/raws;
- 10 transformations producing 11 outputs;
- 2 Pack-v2 ownership graphs;
- practical raw-seafood safety with fantasy-era presentation.

Implementation freeze:
- `c515588c404c0f80a724d767b74535f1e39ae166`;
- Check #1491 / run `33267789356`: Repository Audit, **776/776 tests**, Census, Benchmark 3, Benchmark Sample green.

Promoted Data 53:
- `8f968155d092431b0a3314d38f4d890b0c87f599`;
- Check #1493 / run `33267935109`: same full gate green.

Game State remains 14; no durable tide, ocean, ship, or fishing-state family was introduced.

## Current content census

| Category | Current | Mechanics floor | Status |
| --- | ---: | ---: | --- |
| Places/localities | 43 | 10 | reached |
| Named NPCs | 35 | 50 | 15 short |
| Shop/service sites | 29 | 20 | reached |
| Creature definitions | 72 | 40 | reached |
| Resource sources | 96 | 40 | reached |
| Canonical items | 301 | 200 | reached |
| Recipes/processes | 174 | 75 | reached |
| Abilities/techniques | 41 | 100 | 59 short |
| Quests/contracts | 18 | 30 | 12 short |
| Companions | 1 | 4 | 3 short |
| Transport services | 7 | 5 | reached |

Supplemental:

```text
routes                        17
spell schools                  4
capabilities                  44
NPC schedules                 19
regional/shared packs         25
pack-owned records           927
runtime seed NPCs             34
runtime seed enemies          17
```

Mechanics-scale gate remains **NOT READY**. Companions remain the largest relative gap.

## Latest planning pass

### Macro-World Topology Lock

**Status: COMPLETE ON `main`; documentation/planning only.**

No Product, Data, Game State, or Benchmark change accompanies this pass. The latest runtime/data checkpoint is Data 53.

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
- **Starfen Delta / Brackish Coast — COMPLETE / Data 53.**

Remaining ranking:
1. Gloamwood;
2. Emberwash Badlands;
3. Lower Deepvein;
4. Waymeet Marches / central plateau approaches;
5. Coppergrass extensions;
6. Drowned Vaults.

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
