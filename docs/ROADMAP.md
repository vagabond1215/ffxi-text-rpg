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
Gloamwood & Oldbough Refuge                    COMPLETE / MAIN
```

## Latest bounded unit

### Gloamwood & Oldbough Refuge

**Status: IMPLEMENTED ON `main`; promoted as Data 54 / Product 0.9.100.15.**

Purpose:
- establish the first old-growth barrier beyond West Elderwood;
- create a useful forester refuge without inventing a town or ancestral gate city;
- make Oldbough the wagon turnaround;
- continue only by a walk/mount deepwood trail;
- stop before the western mountain crescent and Lethari homeland;
- connect seven old-growth raws to ten practical production outputs.

Data 54 authored Gloamwood:
- 3 places and 2 routes;
- 3 persistent NPCs and 2 schedules;
- 8 species/populations and 7 exact-provenance sources/raws;
- 10 transformations producing 10 outputs;
- 2 Pack-v2 ownership graphs;
- practical mushroom/berry safety with fantasy-era presentation.

Implementation freeze:
- `83cfa4de61e315fb54689a5d7d2899d2ade41743`;
- Check #1504 / run `33269167675`: Repository Audit, **781/781 tests**, Census, Benchmark 3, Benchmark Sample green.

Promoted Data 54:
- `2de11cd73302751e9a83088d77c2de42df3313e8`;
- Check #1507 / run `33269370813`: same full gate green.

Game State remains 14; no durable navigation, ward, pass, border, or hunting-state family was introduced.

## Current content census

| Category | Current | Mechanics floor | Status |
| --- | ---: | ---: | --- |
| Places/localities | 46 | 10 | reached |
| Named NPCs | 38 | 50 | 12 short |
| Shop/service sites | 31 | 20 | reached |
| Creature definitions | 80 | 40 | reached |
| Resource sources | 103 | 40 | reached |
| Canonical items | 318 | 200 | reached |
| Recipes/processes | 184 | 75 | reached |
| Abilities/techniques | 41 | 100 | 59 short |
| Quests/contracts | 18 | 30 | 12 short |
| Companions | 1 | 4 | 3 short |
| Transport services | 7 | 5 | reached |

Supplemental:

```text
routes                        19
spell schools                  4
capabilities                  44
NPC schedules                 21
regional/shared packs         27
pack-owned records           992
runtime seed NPCs             37
runtime seed enemies          17
```

Mechanics-scale gate remains **NOT READY**. Companions remain the largest relative gap.

## Latest planning pass

### Macro-World Topology Lock

**Status: COMPLETE ON `main`; documentation/planning only.**

No Product, Data, Game State, or Benchmark change accompanies this pass. The latest runtime/data checkpoint is Data 54.

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
- **Gloamwood & Oldbough Refuge — COMPLETE / Data 54.**

Remaining ranking:
1. Emberwash Badlands;
2. Lower Deepvein;
3. Waymeet Marches / central plateau approaches;
4. Coppergrass extensions;
5. Drowned Vaults.

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
