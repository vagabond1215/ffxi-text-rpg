# Hearth & Horizon Roadmap

Milestones are criteria-driven rather than calendar-driven.

## Current baseline

```text
Product:       0.9.100.16
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          55
Benchmark:     3
Codename:      Emberwash Badlands & Cinderwell Station
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
Emberwash Badlands & Cinderwell Station         COMPLETE / MAIN
```

## Latest bounded unit

### Emberwash Badlands & Cinderwell Station

**Status: IMPLEMENTED ON `main`; promoted as Data 55 / Product 0.9.100.16.**

Purpose:
- establish the northern arid frontier beyond South Redstone without collapsing directly into the Veyra sphere;
- create a useful fortified caravan well rather than a city or southern gate capital;
- make Cinderwell the wagon turnaround;
- continue only by a preparation-sensitive walk/mount/caravan foretrail;
- stop before the farther true desert, southern strait, and Veyra lands;
- connect seven arid-frontier raws to ten practical production outputs.

Data 55 authored Emberwash:
- 3 places and 2 routes;
- 3 persistent NPCs and 2 schedules;
- 8 species/populations and 7 exact-provenance sources/raws;
- 10 transformations producing 10 outputs;
- 2 Pack-v2 ownership graphs;
- practical Emberpod/Cinder Pear safety with fantasy-era presentation.

Implementation freeze:
- `2e8d8a519dcc916f91a120fb66337fe16753f6a4`;
- Check #1547 / run `33279116948`: Repository Audit, **786/786 tests**, Census, Benchmark 3, Benchmark Sample green.

Promoted Data 55:
- `6f850b4a63a152f17a55dec23224dff42c512cad`;
- Check #1559 / run `33279480611`: same full gate green;
- Pages #1692 green.

Game State remains 14; no durable survival, weather, border, desert-access, or wildlife-hunting-state family was introduced.

## Current content census

| Category | Current | Mechanics floor | Status |
| --- | ---: | ---: | --- |
| Places/localities | 49 | 10 | reached |
| Named NPCs | 41 | 50 | 9 short |
| Shop/service sites | 33 | 20 | reached |
| Creature definitions | 88 | 40 | reached |
| Resource sources | 110 | 40 | reached |
| Canonical items | 335 | 200 | reached |
| Recipes/processes | 194 | 75 | reached |
| Abilities/techniques | 41 | 100 | 59 short |
| Quests/contracts | 18 | 30 | 12 short |
| Companions | 1 | 4 | 3 short |
| Transport services | 7 | 5 | reached |

Supplemental:

```text
routes                        21
spell schools                  4
capabilities                  44
NPC schedules                 23
regional/shared packs         29
pack-owned records          1057
runtime seed NPCs             40
runtime seed enemies          17
```

Mechanics-scale gate remains **NOT READY**. Companions remain the largest relative gap.

## Latest planning pass

### Macro-World Topology Lock

**Status: COMPLETE ON `main`; documentation/planning only.**

No Product, Data, Game State, or Benchmark change accompanies this pass. The latest runtime/data checkpoint is Data 55.

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
- **Emberwash Badlands & Cinderwell Station — COMPLETE / Data 55.**

Remaining ranking:
1. Lower Deepvein;
2. Waymeet Marches / central plateau approaches;
3. Coppergrass extensions;
4. Drowned Vaults.

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
