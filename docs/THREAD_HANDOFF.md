# Thread Handoff

Read this first when continuing Hearth & Horizon in a new development thread.

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.100.12
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          51
Benchmark:     3
Codename:      Regional Resource & Trade Resilience
Runtime:       Node >=24
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Current integration state

**Regional Resource & Trade Resilience is complete and validated on `main`.**

Data 51 Check **#1454 / run `33226362127`** passed on head `d047bf03d7fb17af928ce9aae0838db25a2969e7`: Repository Audit, **764/764 tests**, Content Census, Benchmark 3, and Benchmark Sample all green.

Normal low-risk work should continue directly on `main`. Use a feature branch only when rollback/blast-radius risk materially exceeds what an ordinary GitHub revert can safely contain.

Prior validated product checkpoint:
- Data 50 final Check #1429 / run `33224409426` on `0f94d44b72105982370ffabd859b7d8175effef4`: Repository Audit, **759/759 tests**, Census, Benchmark 3, Benchmark Sample green.

## Data 51 — Regional Resource & Trade Resilience

The audit asks whether each established economic area, together with dependable nearby trade partners, can support ordinary food, tools, repair, construction, bindings, fuel, medicine, and preservation without requiring an implausibly unique distant ingredient.

The governing principle is:

> **Ordinary substitutes should exist; premium outcomes may still require specialty trade.**

This does not require every region to own every ore, tree, grain, herb, or luxury material.

Permanent audit:
- `docs/REGIONAL_RESOURCE_DISTRIBUTION_AUDIT.md`.

Regression guard:
- `tests/regionalResourceDistribution.test.js`.

## Reliable trade basins

Western manufacturing basin:
- Elderwood / Thornwall;
- Crownfields;
- Slatewater Foothills;
- Redstone Reach / Brasshaven.

Reliable links:
- Southfield Farm Road + Crownfields Produce Wagon;
- Crown-Forge Caravan Road;
- Slatewater Foothill Caravan.

Eastern corridor:
- Redstone Reach;
- Coppergrass Steppe;
- Starfen / Mistmere.

Reliable physical link:
- Forge-Mere Long Road.

Scheduled through-service:
- Forge-Mere Caravan between Brasshaven and Mistmere.

Important: Coppergrass is a **transit wilderness**, not a staffed locality. The route crosses Coppergrass, but the current scheduled Forge-Mere service does not expose Coppergrass as a boarding stop.

Freshwater basin:
- Starfen / Mistmere;
- Great Mere / Merewatch.

Reliable links:
- East Fen Shore Track;
- Reedport-Mere Waterway;
- Great Mere Ferry.

Highland dependency:
- Ironspine Highlands;
- Redstone Reach / Brasshaven.

Reliable link:
- wagon-capable Ironspine Lower Pass Road to High-Pass Watch.

## Area audit result

### Elderwood / Thornwall
**Robust.**

Local:
- abundant differentiated timber;
- resin;
- Barkboar hide;
- roots, mushrooms, nuts, fruit, sap;
- medicines;
- forge/workshop/woodshop/tannery infrastructure.

Trade fills:
- Crownfields grain/fiber;
- Slatewater stone/clay/abrasives;
- Redstone metal/salt.

No local ore duplication is required.

### Crownfields
**Robust agricultural basin.**

Local:
- rye, peas, apples;
- flax/hemp;
- orchard wood;
- **new Crownfields Brick Clay**;
- kitchen/workshop at the Grange.

The added clay fixes an implausible omission for a drained alluvial farming lowland.

### Slatewater Foothills
**Robust corridor region.**

Local:
- spruce/cedar;
- clay, slate, limestone, whetstone stone;
- pitch resin;
- herbs/berries.

Trade:
- Redstone metal/salt;
- Elderwood/Crownfields food, hide, fiber.

Corrections:
- Slatewater Spruce can now make ordinary charcoal;
- Waylodge Hearth now exposes kitchen + workshop support already implied by its fiction.

### Redstone Reach / Brasshaven
**Strong industrial center.**

Local:
- copper, iron, tin, calamine, lead, silver;
- clay, abrasives, alum, glass sand;
- rock salt;
- millet;
- Ridge Ibex hide;
- major forge/workshop infrastructure.

Key correction:
- metallurgy no longer depends specifically on Elderwood Crown Oak for charcoal; Slatewater timber is an immediate and logical fuel source.

### Coppergrass Steppe
**Adequate as transit wilderness.**

Local:
- groundpea;
- prairie flax;
- madder;
- agate;
- **new Coppergrass Thornwood** for camp fuel, handles, and rough construction.

Trade:
- Redstone metals/salt/stone;
- Starfen grain/fish/herbs/wetland materials.

Do not infer settlement-level workshops until a permanent locality is intentionally authored.

### Starfen / Mistmere
**Robust wetland craft/food basin after remediation.**

Local:
- reedgrain;
- fish/mussels;
- herbs, berries, kelp;
- reed/nettle fiber;
- Giant Cane;
- **new Marsh Willow timber**;
- **new alluvial clay**.

Corrections:
- Willow gives ordinary wetland wood and local charcoal;
- alluvial clay supports common ceramic/building work;
- Mistmere regional exchange now exposes light workshop/craft support.

Metal remains a Brasshaven import by design.

### Great Mere / Merewatch
**Robust freshwater basin after preservation fallback.**

Local:
- fish/crayfish/mussels;
- roots/starches/cress;
- rush fiber;
- shell lime;
- pearl;
- kitchen/workshop.

Correction:
- Silver Perch can now be dry-smoked without imported Redstone salt at reduced yield.
- imported salt still improves preservation and enables superior export-grade salted/pickled products.

### Ironspine Highlands
**Adequate highland frontier economy.**

Local:
- game, hides/furs, fat;
- alpine herbs/remedies;
- lodestone, quartz, gold;
- **new Stonepine timber**;
- **new common pass stone**.

Corrections:
- Stonepine was already present in the Lower Pass description but previously only cones were recoverable;
- mountain building stone is now explicit;
- Stonepine can produce local charcoal;
- High-Pass common hearth now exposes kitchen + workshop support.

Common metals/salt/forge flux remain Redstone imports.

## Data 51 authored delta

Added six gathering sources and six raw resources:
- Crownfields Brick Clay;
- Starfen Alluvial Clay;
- Starfen Marsh Willow Timber;
- Coppergrass Thornwood;
- Ironspine Stonepine Timber;
- Ironspine Pass Stone.

Added five substitute/fallback production routes:
- Slatewater Spruce Charcoal;
- Starfen Marsh Willow Charcoal;
- Coppergrass Thornwood Charcoal;
- Ironspine Stonepine Charcoal;
- Great Mere dry-smoked perch without salt.

Workstation corrections:
- Slatewater Hearth: kitchen + workshop;
- Ironspine Common Hearth: kitchen + workshop;
- Mistmere regional exchange: workshop.

## Data 51 validated census

```text
places/localities                        37
named NPCs                               29
shop/service sites                       25
creature definitions                    58
resource sources                         83
canonical items                         264
recipes/processes                       154
abilities/techniques                     41
quests/contracts                         18
companions                                1
transport services                        6

routes                                   12
spell schools                             4
capabilities/training definitions        44
NPC schedules                            15
regional/shared content packs            21
pack-owned records                      799
runtime seed NPCs                        28
runtime seed enemies                     16
```

Raw-resource production demand: **80/91**. Three newly explicit clay/stone resources intentionally have direct construction sinks rather than dummy processing recipes.

Luxury raw utilization remains **14/14**.

Mechanics-scale gate remains **NOT READY** because companions, abilities, NPC breadth, and quests remain materially short.

## What should remain scarce

Do not flatten:
- silver — Redstone/Deepvein specialty;
- gold — Ironspine specialty;
- copper/tin/bronze/brass industry — Redstone-centered;
- Cloud Quartz/lodestone — Ironspine;
- premium hardwood/bow wood — Elderwood;
- spruce/cedar mast stock — Slatewater;
- hemp/linen — Crownfields;
- wetland fiber/cane — Starfen/Great Mere;
- pearls — Great Mere;
- specialty dyes/perfumes/gems — regional.

## Persistence decision

Game State remains **14**.

Data 51 changes authored resources, gathering sources, recipes, POI workstation tags, and Pack-v2 ownership only. It reuses:
- route/service;
- ecology/gathering;
- inventory/provenance;
- production/work tasks;
- workstation;
- work proficiency;
- Pack-v2 authority.

No new durable state family was introduced.

## Next material-culture unit

Recommended:
- **Occupational Tool Conversion**.

It should consume the now-resilient regional substrate instead of inventing one-off inputs.

Priority conversions:
- Field Knife;
- Prospector Pick;
- Woodsman Hatchet;
- Digging Spade;
- Reed Sickle;
- Marsh Fishing Rod;
- Ash Staff;
- Maple Wand;
- Iron Buckler;
- Brass Ring;
- Bronze arms/armor;
- basic leather goods.

Do not auto-start it merely because it is next.

## Other queued decisions

Formal roadmap:
- Packet E — Gate A integration/census audit.

World edge:
- Emberwash Badlands remains the next ranked candidate.

Neither is auto-authorized.

## Restart order

1. `AGENTS.md`
2. this file
3. `PROJECT_PROFILE.yaml`
4. `docs/EXECUTION_PIPELINE.md`
5. `docs/REGIONAL_RESOURCE_DISTRIBUTION_AUDIT.md`
6. `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`
7. `docs/QUALITY_GATES.md`
8. `docs/ROADMAP.md`
9. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
10. relevant runtime/data/tests for the explicitly selected next unit
