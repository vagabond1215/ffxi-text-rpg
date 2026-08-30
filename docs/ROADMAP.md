# Hearth & Horizon Roadmap

Milestones are criteria-driven rather than calendar-driven.

## Current baseline

```text
Product:       0.9.100.18
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          57
Benchmark:     3
Codename:      Waymeet Marches & Cairnward Relay
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
Lower Deepvein & Lantern Sump Station             COMPLETE / MAIN
Waymeet Marches & Cairnward Relay                  COMPLETE / MAIN
```

## Latest bounded unit

### Waymeet Marches & Cairnward Relay

**Status: IMPLEMENTED ON `main`; promoted as Data 57 / Product 0.9.100.18.**

Data 57 continues Headwater Upper Vale through Windscar Saddle to Cairnward Relay and Waymeet South Marches. Windscar is walk/mount/pack-caravan only; wagon operation begins at Cairnward on the plateau side. Cairnward is a small neutral logistics relay, not a settlement or city gate. The route graph stops in the South Marches before inner-march or Waymeet authority.

Authored delta:
- 3 places and 2 routes;
- 3 NPCs and 2 schedules;
- 8 species/populations and 7 exact-provenance sources/raws;
- 10 transformations and 10 outputs;
- 2 Pack-v2 ownership graphs;
- practical food-preparation metadata;
- no manufactured hostile wildlife.

Implementation freeze `3ef4830baf992e6f9ff973576d6be642e47dc3fa` passed Check #1592 / run `33293624219` with **797/797 tests**, Census, Benchmark 3, and Benchmark Sample. Promoted runtime/data SHA: `bf2103355ac3fc79b69e0007c46f9d3f14552054`.

Game State remains 14; no new durable serialized family was introduced.

## Current content census

| Category | Current | Mechanics floor | Status |
| --- | ---: | ---: | --- |
| Places/localities | 55 | 10 | reached |
| Named NPCs | 47 | 50 | 3 short |
| Shop/service sites | 37 | 20 | reached |
| Creature definitions | 104 | 40 | reached |
| Resource sources | 124 | 40 | reached |
| Canonical items | 369 | 200 | reached |
| Recipes/processes | 214 | 75 | reached |
| Abilities/techniques | 41 | 100 | 59 short |
| Quests/contracts | 18 | 30 | 12 short |
| Companions | 1 | 4 | 3 short |
| Transport services | 7 | 5 | reached |

```text
routes                        25
spell schools                  4
capabilities                  44
NPC schedules                 27
regional/shared packs         33
pack-owned records          1183
runtime seed NPCs             46
runtime seed enemies          17
raw-resource utilization   124/135
luxury-raw utilization       14/14
```

Mechanics-scale gate remains **NOT READY**.

## Latest planning pass

### Macro-World Topology Lock

**Status: COMPLETE ON `main`; documentation/planning only.**

No Product, Data, Game State, or Benchmark change accompanies this pass. The latest runtime/data checkpoint is Data 57.

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
- **Lower Deepvein & Lantern Sump Station — COMPLETE / Data 56.**
- **Waymeet Marches & Cairnward Relay — COMPLETE / Data 57.**

Remaining ranking:
1. Waymeet Inner Marches / outer crossroads approach;
2. Coppergrass extensions;
3. Drowned Vaults.

The temporary detailed edge notes remain in `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md`.

### Central Continent completion budget

Planning intent established at Data 55 and updated after the Data 57 surface pass:

- current surface-region maturity is approximately **60–70%** at the present authored granularity;
- budget approximately **9–13 additional substantial surface-region passes** for a broadly complete Central Continent;
- roughly **5–7** of those are enough to finish the minimum coherent continental skeleton; the remainder should add warranted route, ecology, economy, settlement, and civilization-approach density;
- **Lower Deepvein and Drowned Vaults are not counted in the surface percentage** because they are vertical/subterranean expansions;
- avoid subdividing wilderness for its own sake; after the Central Continent reaches a coherent skeleton, prefer outward expansion toward Veyra, Miri, Korren, and Pelagic realms.

The detailed corridor budget and completion doctrine live in `docs/WORLD_MACRO_TOPOLOGY.md`.

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
