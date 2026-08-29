# Hearth & Horizon Roadmap

Milestones are criteria-driven rather than calendar-driven.

## Current baseline

```text
Product:       0.9.100.11
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          50
Benchmark:     3
Codename:      Material Foundations & Common Components
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

### Material Foundations & Common Components

**Status: COMPLETE ON `main`; Data 50 promoted as Product 0.9.100.11.**

Purpose:
- establish ordinary material culture as a shared economic substrate before profession-specific finished tools are authored;
- give standard metals/alloys, differentiated woods, plant fibers/cordage, industrial minerals, hardware, maintenance goods, and magical-conductor stock explicit sources and production chains;
- make reusable components tradeable and cross-profession instead of hiding them as scenery or one-off recipe assumptions;
- begin using the existing `requiredToolTags` production seam without adding a second crafting authority.

Data 50 adds:
- 21 canonical gathering sources and 21 raw resources;
- 55 reusable production outputs and 55 transformations;
- tin, lead, silver, gold, bronze, brass, pewter, solder, steel, sheet/wire stock, fasteners/fittings, and Cloudsilver Spellwire;
- ash, Crown Oak, Silvermaple, yew, hazel, spruce, fragrant cedar, applewood, and Starfen Giant Cane working stocks;
- hemp fiber -> yarn -> twine -> cord -> rope -> hawser, plus canvas, net webbing, flax wick, and nettle thread;
- charcoal, quicklime, whetstone, alum mordant, potash, clear glass batch, pine tar, and hide glue;
- one shared Pack-v2 ownership unit: `pack-material-foundations-common-components`.

Intentional boundary:
- wool and other managed-animal products are not modeled as flora; they remain deferred until an explicit husbandry/managed-animal source authority exists.

Growth from Data 49:

```text
resource sources               56 -> 77
canonical items               182 -> 258
recipes/processes              94 -> 149
regional/shared packs          20 -> 21
pack-owned records            630 -> 782
raw production utilization  56/64 -> 77/85
luxury raw utilization      13/13 -> 14/14
```

Game State remains 14. The tranche adds authored source/item/recipe/pack definitions and reuses existing ecology, gathering, inventory/provenance, production/workstation, work-proficiency, and Pack-v2 authorities.

The durable follow-on plan is `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`. Its next recommended bounded unit is **Occupational Tool Conversion**, which should convert existing shop/equipment-only tools and starter goods into real production outputs and then add shared hand tools. It is queued, not auto-authorized.

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
