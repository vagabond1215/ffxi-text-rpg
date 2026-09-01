# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

## Current baseline

```text
Product:       0.9.200.1
Package:       0.9.200
Account Save:  5
Game State:    15
Data:          63
Benchmark:     3
Codename:      Slatewater Road Scout
```

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`.

`package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority. Planning a track does not open its runtime version; implementation does.

## Independent contract versions

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 5 | local account/session/character registry contract |
| Game State | 15 | serialized character/world runtime contract |
| Data | 63 | canonical authored-data, geography/ecology/resource/production/social/companion stable IDs, item safety, route/service topology, pack ownership and validation contract |
| Benchmark | 3 | workload/measurement comparability contract |

These advance independently.

## `0.9.100` history and `0.9.200` current decision

### `0.9.100.1` — Content Pack Scale Contract v2

Packet A opened Content Scale Gate A with infrastructure before volume:

```text
Product       0.8.900.1 -> 0.9.100.1
Package       0.8.900   -> 0.9.100
Data          39        -> 40
Game State    14        -> 14
Account Save  5         -> 5
Benchmark     3         -> 3
```

Data 40 established Pack v2 ownership/validation and the catalog bridge for scale-critical content families without increasing gameplay breadth or persisted authority.

### `0.9.100.2` — Redstone Forge-Road

Packet B added the first authored regional tranche on top of Pack v2:

```text
Product       0.9.100.1 -> 0.9.100.2
Package       0.9.100   -> 0.9.100
Data          40        -> 41
Game State    14        -> 14
Account Save  5         -> 5
Benchmark     3         -> 3
```

Data 41 added four Redstone capabilities/abilities, six downstream forge outputs/processes, three provenance-qualified Brasshaven commitments, and `pack-redstone-forge-road`. Game State stayed 14 because all consequences reused existing capability/ability, inventory/provenance, production/work, commitment/relationship/schedule, and fictional-time authorities.

### `0.9.100.3` — Elderwood Hunt-Timber

Packet C adds the second authored Gate A regional tranche and deliberately stresses hunt/timber recovery, production, persistent contacts, fictional-time civic availability, commitments, and field techniques rather than repeating the Redstone forge shape.

```text
Product       0.9.100.2 -> 0.9.100.3
Package       0.9.100   -> 0.9.100
Data          41        -> 42
Game State    14        -> 14
Account Save  5         -> 5
Benchmark     3         -> 3
```

#### Why Data 42

Data 42 adds stable canonical authored records and connected relationships across existing catalogs:

- four Elderwood character-owned capabilities and four executable abilities;
- six downstream Elderwood production outputs and six production processes;
- three existing POI people promoted to persistent NPC definitions;
- one canonical fictional-time NPC schedule for Oren Vale's roadworks availability;
- three provenance-qualified Thornwall commitments;
- `pack-elderwood-hunt-timber` as a child Pack v2 ownership graph depending on shared foundation, Elderwood opening, and Elderwood ecology breadth;
- source/sink/provenance/social/schedule connections that make those IDs part of the current canonical data contract.

The census consequently moves from the Redstone checkpoint to 15 named NPCs, 62 canonical items, 23 recipes/processes, 13 abilities/techniques, and 14 quests/contracts. Supplemental coverage moves to 16 capabilities, 5 schedules, 9 packs and 171 pack-owned records. Places, shop/service sites, creatures, resource sources, companions, and transport remain unchanged in this bounded tranche.

#### Why Game State stays 14

No new durable player/world fact was introduced. Elderwood Hunt-Timber reuses existing:

- character capability/skill authority;
- ability runtime authority;
- inventory/equipment and provenance authority;
- work-task/work-proficiency/production authority;
- commitment/relationship/NPC-schedule authority;
- canonical seed NPC projection authority;
- canonical fictional world time.

There is no new simulation clock, direct timed-task owner, persistence family, inventory store, progression meter, social state family, place authority, or companion state. Bumping Game State merely because authored content grew would create a false compatibility boundary.

### `0.9.100.4` — Universal Magic & Starfen Marshcraft

Packet D adds the third authored Gate A tranche and corrects an important ownership rule: canonical magic is universal/shared rather than location-owned.

```text
Product       0.9.100.3 -> 0.9.100.4
Package       0.9.100   -> 0.9.100
Data          42        -> 43
Game State    14        -> 14
Account Save  5         -> 5
Benchmark     3         -> 3
```

#### Why Data 43

Data 43 changes stable canonical authored data and ownership/validation relationships:

- four spell schools, including the new original Veilscript seal-magic tradition;
- 33 shared spell capabilities and 33 shared executable spell abilities, including eight elemental families plus restoration/support/warding/sigils;
- regional spell IDs/tags removed or renamed so spell ownership is shared/universal;
- external Tales of Symphonia research retained only in a non-canonical reference document; canonical names, IDs, effects, lore, and progression are original Hearth & Horizon content;
- six downstream Starfen marshcraft outputs/processes;
- two persistent Mistmere NPCs and two fictional-time schedules;
- four Starfen/Mistmere production/community commitments;
- `pack-starfen-marshcraft`, while universal spell ownership remains in `pack-shared-foundation`;
- commitment catalog-ref cross-reference validation extended to giver/place/item/source/capability relationships;
- one existing cross-pack Redstone Sweetroot dependency made explicit.

#### Why Game State stays 14

No new durable player/world fact was introduced. Universal magic reuses existing character capability/skill and ability-runtime state; Starfen marshcraft reuses inventory/provenance, production/work, NPC schedules, commitments/relationships, and fictional time. The optional commitment capability reward writes into the existing capability registry rather than creating a new progression family.

### `0.9.100.5` — World Edge Expansion & Slatewater Waylodge

This revision synchronizes the canonical data contract after the post-Packet-D ecology/geography expansion and lands the first world-edge corridor tranche.

```text
Product       0.9.100.4 -> 0.9.100.5
Package       0.9.100   -> 0.9.100
Data          43        -> 44
Game State    14        -> 14
Account Save  5         -> 5
Benchmark     3         -> 3
```

#### Why Data 44

Stable canonical authored data changed materially after Data 43:

- ecology breadth expanded across previously missing families and staple/luxury resource classes;
- Coppergrass Steppe was inserted into the Forge-Mere corridor with its own map, place, ecology pack, populations, sources, items, and preserved route geometry;
- Slatewater Foothills was inserted into the Crown-Forge corridor;
- Slatewater Waylodge adds a neutral safe locality with a field exchange, field guild, hearth/bunkroom, stableyard, NPC staff, schedules, and a scheduled foothill caravan;
- four Slatewater fauna families/species/populations and six exact-provenance gathering resources were added;
- Pack-v2 ownership expands to `pack-slatewater-foothills-ecology` and `pack-slatewater-waylodge`;
- route, map, place, schedule, shop, ecology, resource, and content-pack catalogs all gained stable records.

The validated Slatewater branch census is 29 places/localities, 20 named NPCs, 19 shop/service sites, 40 creature definitions, 35 resource sources, 90 canonical items, 29 recipes/processes, 41 abilities/techniques, 18 quests/contracts, 1 companion, and 4 transport services. Supplemental coverage is 7 routes, 4 spell schools, 44 capabilities, 9 schedules, 13 packs, and 374 pack-owned records.

#### Why Game State stays 14

No new durable player/world state family was introduced. The tranche reuses existing:

- place/map/atlas and travel state;
- canonical routes and transport tasks;
- shop transactions and wallet/inventory;
- campaign recovery for safe lodge rest;
- NPC projection and fictional-time schedules;
- ecology populations and gathering work;
- resource provenance;
- Pack-v2 ownership metadata.

Mount and pack-animal care at Slatewater is currently represented by place/POI/NPC/travel-service content. A durable mount-condition authority is still planned and was not introduced indirectly by this data pass.

### `0.9.100.6` — Ecology & Geography Integrity

This revision performs a post-Slatewater integrity audit over canonical world/ecology data and closes validation blind spots exposed by the larger geography graph.

```text
Product       0.9.100.5 -> 0.9.100.6
Package       0.9.100   -> 0.9.100
Data          44        -> 45
Game State    14        -> 14
Account Save  5         -> 5
Benchmark     3         -> 3
```

#### Why Data 45

Stable canonical authored geography changed:

- five obsolete direct zone edges that duplicated canonical route legs with contradictory travel times were removed;
- Strider Yard, Old Gaol, and the Thornwall skyferry mooring gained outbound return paths;
- Crownward/West Elderwood ordinary walk gates became reciprocal;
- one reversed Rivergate/Crownward direction label was corrected.

Data-validation contracts also became stricter:

- raw foundation + regional ecology IDs are checked for duplicates before canonical deduplication;
- resource IDs receive the same raw duplicate protection plus provenance/sink/place validation;
- regional ecology validation now covers stable IDs, enums, conditions, source/action/tool/proficiency shape, and provenance at foundation-level rigor;
- Pack-v2 catalog references resolve canonical regional ecology through the ecology registry;
- place/map membership is validated reciprocally;
- route stop coordinates, ordered segment chains, service-stop subsequences, boarding lead, fare shape, and cargo multipliers are validated;
- a dedicated ecology/geography integrity regression test covers the connected graph.

The content census remains 29 places, 20 NPCs, 19 shop/service sites, 40 creatures, 35 resource sources, 90 items, 29 recipes/processes, 41 abilities/techniques, 18 quests/contracts, 1 companion, and 4 transport services. Supplemental coverage remains 7 routes, 4 spell schools, 44 capabilities, 9 schedules, 13 packs, and 374 pack-owned records.

#### Why Game State stays 14

No new durable player/world fact was introduced. Data 45 changes authored records and validation behavior only. Existing place/map, route/transport, ecology/population, inventory/provenance, and Pack-v2 authorities remain the runtime owners.

### `0.9.100.7` — Crownfields Agricultural Lowlands

This revision adds Thornwall's agricultural hinterland as a managed ecological/economic region rather than another monster-heavy wilderness.

```text
Product       0.9.100.6 -> 0.9.100.7
Package       0.9.100   -> 0.9.100
Data          45        -> 46
Game State    14        -> 14
Account Save  5         -> 5
Benchmark     3         -> 3
```

#### Why Data 46

Stable canonical authored data expands with:

- `crownfields` and `crownfields-grange`;
- `map-crownfields`;
- Southfield Farm Road and a scheduled Crownfields Produce Wagon;
- four new managed-agriculture families plus five species/populations, with Orchard Honeybee reusing the existing canonical Bee family through a declared pack dependency;
- six exact-provenance field/orchard resources: Crown Rye, Field Pea, Blue Flax Straw, Cider Apple, Meadow Hay, and Dyer's Woad;
- three Grange staff NPCs, two fictional-time schedules, produce-market/guild/travel service content;
- `pack-crownfields-agricultural-ecology` and `pack-crownfields-grange`.

The validated pre-promotion census is 31 places/localities, 23 named NPCs, 21 shop/service sites, 45 creature definitions, 41 resource sources, 96 canonical items, 29 recipes/processes, 41 abilities/techniques, 18 quests/contracts, 1 companion, and 5 transport services. Supplemental coverage is 8 routes, 4 spell schools, 44 capabilities, 11 schedules, 15 packs, and 410 pack-owned records.

Places, shop/service sites, creature definitions, resource sources, and transport services now meet or exceed their mechanics floors.

#### Why Game State stays 14

No new durable player/world state family is introduced. Managed crops reuse ecology gathering sources, timed gathering, work proficiency, inventory/provenance, commerce, and transport. Cattle, sheep, hens, rats, and bees are ecology populations only.

Animal products such as milk, wool, eggs, honey, manure, meat, or hides are deliberately **not** modeled through fake flora sources. A future husbandry/managed-animal source authority must be deliberate if those loops are added.

### `0.9.100.8` — Regional Ingredient & Luxury Processing

This revision deepens the existing regional resource economy by making processed ingredients and components first-class canonical outputs.

```text
Product       0.9.100.7 -> 0.9.100.8
Package       0.9.100   -> 0.9.100
Data          46        -> 47
Game State    14        -> 14
Account Save  5         -> 5
Benchmark     3         -> 3
```

#### Why Data 47

Stable canonical authored data expands with:

- 30 production transformations;
- 30 production outputs;
- `ingredientLuxuryProductionCatalog` and `ingredientLuxuryProductionItems` modular subcatalogs behind the existing canonical production interfaces;
- `pack-regional-ingredient-luxury-processing`, owning those 60 stable records;
- Crownfields staple chains for flour/bread, pea meal/pottage, flax thread/linen, woad pigment/dyed linen, and apple must/vinegar;
- Elderwood perfume/veneer/fine-casket work;
- Redstone crocus pigment, cut Fire Opal, and brooch work;
- Starfen indigo textile and Moonlotus perfume chains;
- Coppergrass madder textile and Windglass ornament work;
- Slatewater lichen pigment, clay slip/glaze, polished Blue Slate, and decorative plaque work;
- a Five-Region Dyer's Sample Book combining processed dye inputs across Crownfields, Redstone, Starfen, Coppergrass, and Slatewater.

The pre-promotion validated census is:

```text
places/localities       31
named NPCs              23
shop/service sites      21
creature definitions    45
resource sources        41
canonical items        126
recipes/processes       59
abilities/techniques    41
quests/contracts        18
companions               1
transport services       5

routes                    8
spell schools             4
capabilities             44
NPC schedules            11
regional/shared packs    16
pack-owned records      470
```

Production-depth evidence moves from 15/44 to 33/44 canonical raw resources with direct production demand, and from 0/11 to 11/11 luxury raws.

#### Why Game State stays 14

No new durable player/world state family is introduced. Data 47 reuses:

- production work/task state;
- work proficiency;
- workstation resolution;
- inventory/container state;
- canonical item provenance;
- fictional world time;
- Pack-v2 placement/dependency metadata.

Intermediate goods are ordinary canonical inventory items. They do not require a separate crafting queue, luxury inventory, recipe-state family, or processing clock.

### `0.9.100.9` — Great Mere Freshwater Economy & Food Safety

This revision adds the third ranked world-edge zone and establishes a standing authored consumption-safety contract for canonical food-capable items.

```text
Product       0.9.100.8 -> 0.9.100.9
Package       0.9.100   -> 0.9.100
Data          47        -> 48
Game State    14        -> 14
Account Save  5         -> 5
Benchmark     3         -> 3
```

#### Why Data 48

Stable canonical authored data expands with:

- Great Mere Westshore, Merewatch Landing, and Reedcrown Isle;
- `map-great-mere`;
- East Fen Shore Track and Reedport-Mere Waterway;
- Great Mere Ferry;
- five new freshwater ecology families, seven species/populations, and declared reuse of canonical turtle/mussel families;
- nine gathering/fishing sources and nine exact-provenance raw resources;
- three Merewatch NPCs and two schedules;
- 22 production transformations producing 23 outputs;
- two Great Mere Pack-v2 ownership graphs;
- explicit item consumption metadata covering direct, process-required, non-food, pathogen-risk, raw-irritant, and raw-toxic states;
- player-information presentation of consumption-safety labels;
- retrofitted safety metadata for existing canonical food-tagged resource and production items.

Data 48 also repairs nearby economic depth:
- Starfen Reedgrain gains milling and fishcake use;
- Starfen Fen Mussel gains a safe cooked dish;
- Slatewater Pitch Pine Resin gains tarred-net-line use.

The repaired pre-promotion census is:

```text
places/localities       34
named NPCs              26
shop/service sites      23
creature definitions    52
resource sources        50
canonical items        158
recipes/processes       81
abilities/techniques    41
quests/contracts        18
companions               1
transport services       6

routes                   10
spell schools             4
capabilities             44
NPC schedules            13
regional/shared packs    18
pack-owned records      564
runtime seed NPCs        25
runtime seed enemies     13
```

Recipes/processes now exceed the mechanics floor. Raw-resource production utilization is 45/53 and all 12 current luxury raws have production demand.

#### Why Game State stays 14

No new durable mutable player/world fact is introduced.

The new consumption profile is static canonical item-definition metadata. Great Mere reuses existing:

- place/map/route/transport state;
- ecology populations and gathering work;
- inventory/container authority;
- item provenance;
- production/work tasks and work proficiency;
- workstation resolution;
- shops and campaign recovery;
- NPC schedules and fictional world time;
- player-information presentation;
- Pack-v2 ownership/dependencies.

No hunger, nutrition, spoilage, poison timer, food queue, lake-state family, or second inventory/production authority is added.

### `0.9.100.10` — Ironspine Highlands & Population Hunting

This revision adds the fourth ranked world-edge zone and makes passive/wary wildlife populations directly playable through deliberate hunting without collapsing ecology into ordinary aggro behavior.

```text
Product       0.9.100.9 -> 0.9.100.10
Package       0.9.100   -> 0.9.100
Data          48        -> 49
Game State    14        -> 14
Account Save  5         -> 5
Benchmark     3         -> 3
```

#### Why Data 49

Stable authored geography/content expands with:

- Ironspine Lower Pass, High-Pass Watch, and High Meadow;
- `map-ironspine-highlands`;
- a wagon-capable maintained lower pass road and a separate walk/mount-only high trail;
- six alpine species/populations reusing established Ibex, Bear, Lynx, Marmot, Mountain Eagle, and Grouse families;
- six gathering sources and eleven exact-provenance gathered/body resources;
- three high-pass NPCs and two schedules;
- thirteen production transformations and thirteen outputs across provisions, preservation, tanning, fur work, field remedies, survey instruments, bedding, and weather gear;
- two Ironspine Pack-v2 ownership graphs;
- a population-backed encounter bridge that consumes one population unit only after encounter victory and leaves defeated-body recovery authoritative;
- period-appropriate player-facing food-preparation wording while preserving explicit internal safety metadata.

Implementation-freeze Check #1368 / run `33215878907` passed Repository Audit, **753/753 tests**, Census, Benchmark 3, and Benchmark Sample.

Validated census:

```text
places/localities       37
named NPCs              29
shop/service sites      25
creature definitions    58
resource sources        56
canonical items        182
recipes/processes       94
abilities/techniques    41
quests/contracts        18
companions               1
transport services       6

routes                   12
spell schools             4
capabilities             44
NPC schedules            15
regional/shared packs    20
pack-owned records      630
runtime seed NPCs        28
runtime seed enemies     16
```

Raw-resource production utilization is 56/64 and luxury raw utilization is 13/13.

#### Why Game State stays 14

No new durable state family is introduced. The hunting bridge stores its population source on the existing active-battle record, uses the existing ecology population state, and reconciles population depletion through existing battle rewards. Ironspine otherwise reuses existing geography, travel, ecology, resource recovery, inventory/provenance, production/work, workstation, shop, schedule, and Pack-v2 authorities.


### `0.9.100.11` — Material Foundations & Common Components

This revision establishes a shared late-medieval/fantasy material-culture substrate before profession-specific finished tools are expanded.

```text
Product       0.9.100.10 -> 0.9.100.11
Package       0.9.100    -> 0.9.100
Data          49         -> 50
Game State    14         -> 14
Account Save  5          -> 5
Benchmark     3          -> 3
```

#### Why Data 50

Stable authored content expands with:
- 21 gathering sources and 21 raw materials across existing Elderwood, Redstone/Deepvein, Starfen, Crownfields, Slatewater, and Ironspine geography;
- 55 reusable production outputs and 55 transformations;
- standard nonferrous metals plus bronze, brass, pewter, solder, steel, sheet/wire stock, common iron hardware, tool/blade blanks, and silver setting stock;
- differentiated woods for handles, structures, decorative work, bows, spars/masts, cooperage, carving, coppice, sap/syrup, and a Giant Cane bamboo analogue;
- an explicit hemp fiber -> yarn -> twine -> cord -> rope -> hawser hierarchy plus canvas, net webbing, flax wick, and nettle thread;
- charcoal, quicklime, whetstone, alum mordant, potash, glass batch, pine tar, and hide glue;
- Cloudsilver Spellwire assembled from silver wire, polished Cloud Quartz, and lodestone billet rather than an isolated magical ore;
- `pack-material-foundations-common-components` as the shared Pack-v2 owner.

The census target for this authored delta is:

```text
places/localities              37
named NPCs                     29
shop/service sites             25
creature definitions           58
resource sources               77
canonical items               258
recipes/processes             149
abilities/techniques           41
quests/contracts               18
companions                      1
transport services              6

routes                          12
spell schools                    4
capabilities                    44
NPC schedules                   15
regional/shared packs           21
pack-owned records             782
runtime seed NPCs               28
runtime seed enemies             16
```

Raw-resource production utilization rises from 56/64 to **77/85**. Luxury raw utilization rises from 13/13 to **14/14**.

#### Why Game State stays 14

No new durable player/world state is introduced. Data 50 reuses existing gathering/ecology, inventory/container, provenance, production, workstation, work-proficiency, and Pack-v2 authorities. The production schema already supported `requiredToolTags`; selected woodworking transformations now exercise that existing seam.

Wool and other managed-animal outputs remain deliberately deferred. Existing Crownfields sheep/cattle/hen/bee populations do not justify fake flora sources; a future husbandry/managed-animal source authority must be intentional.


### `0.9.100.12` — Regional Resource & Trade Resilience

This revision audits the established world as connected economic basins rather than isolated zones.

```text
Product       0.9.100.11 -> 0.9.100.12
Package       0.9.100    -> 0.9.100
Data          50         -> 51
Game State    14         -> 14
Account Save  5          -> 5
Benchmark     3          -> 3
```

#### Why Data 51

Stable authored content expands with six common regional resources/sources and five substitute production routes. The additions correct biome omissions and brittle dependencies: Crownfields brick clay; Starfen alluvial clay and marsh willow; Coppergrass thornwood; Ironspine Stonepine timber and pass stone; four non-Crown-Oak charcoal paths; and a lower-yield Great Mere dry-smoking fallback.

Slatewater, Ironspine, and Mistmere also expose kitchen/light-workshop support already implied by their authored service spaces.

The intended census is 83 sources, 264 canonical items, 154 recipes/processes, 21 packs, and 799 pack-owned records. Raw-resource production demand is 80/91, with three added clay/stone raws intentionally serving direct construction sinks rather than forced processing recipes. Luxury raw utilization remains 14/14.

#### Why Game State stays 14

No new durable player/world fact is introduced. Data 51 reuses route/service, POI/workstation, ecology/gathering, inventory/provenance, production, proficiency, and Pack-v2 authorities.

### `0.9.100.13` — Headwater Vale & Waymeet Approach

This revision realizes the Timbercross headwaters and the first grounded overland leg toward Waymeet without prematurely opening the later plateau/march connection.

```text
Product       0.9.100.12 -> 0.9.100.13
Package       0.9.100    -> 0.9.100
Data          51         -> 52
Game State    14         -> 14
Account Save  5          -> 5
Benchmark     3          -> 3
```

#### Why Data 52

Stable authored geography/content expands with:

- Headwater Lower Vale, Headwater Warden Lodge, and Headwater Upper Vale;
- `map-headwater-vale`;
- a wagon-capable Timbercross river road whose wagon movement ends at the lodge;
- a separate walk/mount-only Upper Trail;
- six species/populations, including deliberate population-backed Red Deer hunting and Coldstream Trout fishing;
- six exact-provenance gathering sources plus three Red Deer body resources;
- three persistent lodge NPCs and two fictional-time schedules;
- ten processing/crafting transformations and ten outputs spanning prepared fish/game, deer leather/antler components, alder/willow work, fishing gear, and bridge repair;
- `pack-headwater-vale-ecology` and `pack-headwater-vale`;
- practical fantasy-era food-safety presentation backed by explicit internal consumption metadata.

The implementation deliberately leaves the Upper Vale northern rim without an onward route. Future central-plateau / Waymeet-Marches work must author a real route instead of treating map proximity as traversability.

Implementation freeze `aa39347a0faa754690a194d926262256e92027f1` passed Check #1476 / run `33264692343` with Repository Audit, **770/770 tests**, Content Census, Benchmark 3, and Benchmark Sample.

Validated Data 52 census:

```text
places/localities                        40
named NPCs                               32
shop/service sites                       27
creature definitions                     64
resource sources                         89
canonical items                         283
recipes/processes                       164
abilities/techniques                     41
quests/contracts                         18
companions                                1
transport services                        6
routes                                   14
spell schools                             4
capabilities                             44
NPC schedules                            17
regional/shared packs                    23
pack-owned records                      859
runtime seed NPCs                        31
runtime seed enemies                     17
```

Raw-resource production utilization is **89/100** and luxury raw utilization remains **14/14**.

#### Why Game State stays 14

Data 52 composes existing place/map/route, ecology/population, population-encounter, battle/body-recovery, gathering, inventory/provenance, production/work/workstation, shop, NPC-schedule, and Pack-v2 authorities. No new durable serialized state family is introduced.

### `0.9.100.14` — Starfen Delta & Brackish Coast

This revision realizes the Great Mere's locked eastward outflow and the first canonical Eastern Sea coast.

```text
Product       0.9.100.13 -> 0.9.100.14
Package       0.9.100    -> 0.9.100
Data          52         -> 53
Game State    14         -> 14
Account Save  5          -> 5
Benchmark     3          -> 3
```

#### Why Data 53

Stable authored content expands with:

- Starfen Lower Delta, Tideglass Landing, and Starfen Brackish Coast;
- `map-starfen-delta`;
- the East Fen Delta Levee, Mere-Delta Waterway, and Tideglass Coast Track;
- the scheduled Mere-Delta Packet Boat with a real Lower Delta field stop;
- eight brackish/coastal species and seven exact-provenance gathering/fishing/mineral sources;
- seven new raw resources;
- ten processing/crafting transformations producing eleven outputs;
- three persistent Tideglass staff and two schedules;
- `pack-starfen-delta-brackish-ecology` and `pack-starfen-delta-tideglass`;
- explicit raw seafood safety metadata with practical fantasy-era presentation.

The Eastern Sea remains outside walkable authority. No Miri route, generalized ship mode, durable tide simulation, or new ocean-state family is introduced.

Implementation freeze `c515588c404c0f80a724d767b74535f1e39ae166` passed Check #1491 / run `33267789356` with Repository Audit, **776/776 tests**, Census, Benchmark 3, and Benchmark Sample.

Promoted Data 53 head `8f968155d092431b0a3314d38f4d890b0c87f599` passed Check #1493 / run `33267935109` with the same full gate.

Validated Data 53 census:

```text
places/localities                        43
named NPCs                               35
shop/service sites                       29
creature definitions                     72
resource sources                         96
canonical items                         301
recipes/processes                       174
abilities/techniques                     41
quests/contracts                         18
companions                                1
transport services                        7
routes                                   17
spell schools                             4
capabilities                             44
NPC schedules                            19
regional/shared packs                    25
pack-owned records                      927
runtime seed NPCs                        34
runtime seed enemies                     17
```

Raw-resource production utilization is **96/107**. Luxury utilization remains **14/14**.

#### Why Game State stays 14

Data 53 composes existing place/map/route/transport, ecology/population, gathering, inventory/provenance, production/work/workstation, commerce, NPC-schedule, and Pack-v2 authorities. Tides remain authored hazards/fiction rather than a new serialized simulation state.

### `0.9.100.15` — Gloamwood & Oldbough Refuge

This revision establishes the first canonical old-growth barrier on the western ancestral corridor while deliberately stopping before the western mountain crescent and Lethari homeland.

```text
Product       0.9.100.14 -> 0.9.100.15
Package       0.9.100    -> 0.9.100
Data          53         -> 54
Game State    14         -> 14
Account Save  5          -> 5
Benchmark     3          -> 3
```

#### Why Data 54

Stable authored content expands with:

- Gloamwood Verge, Oldbough Refuge, and Gloamwood Deep;
- `map-gloamwood`;
- Oldgrowth Cart Track from West Elderwood to Oldbough with walk/mount/wagon access;
- Deepwood Forester Trail from Oldbough to Gloamwood Deep with walk/mount access only;
- Oldbough as the explicit wagon limit;
- eight old-growth species/populations, reusing four established forest families and adding four Gloamwood families;
- seven exact-provenance forage/gather/log/mine sources and seven raw resources;
- ten processing/crafting transformations producing ten outputs;
- three persistent Oldbough staff and two schedules;
- `pack-gloamwood-oldgrowth-ecology` and `pack-gloamwood-oldbough-refuge`;
- explicit practical preparation metadata for raincaps/nightberries.

No route leaves Gloamwood Deep for the western mountain crescent or Lethari realm. No generalized magical-navigation, ward-state, pass-state, or border-state authority is introduced.

Implementation freeze `83cfa4de61e315fb54689a5d7d2899d2ade41743` passed Check #1504 / run `33269167675` with Repository Audit, **781/781 tests**, Census, Benchmark 3, and Benchmark Sample.

Promoted Data 54 head `2de11cd73302751e9a83088d77c2de42df3313e8` passed Check #1507 / run `33269370813` with the same full gate.

Validated Data 54 census:

```text
places/localities                        46
named NPCs                               38
shop/service sites                       31
creature definitions                     80
resource sources                        103
canonical items                         318
recipes/processes                       184
abilities/techniques                     41
quests/contracts                         18
companions                                1
transport services                        7
routes                                   19
spell schools                             4
capabilities                             44
NPC schedules                            21
regional/shared packs                    27
pack-owned records                      992
runtime seed NPCs                        37
runtime seed enemies                     17
```

Raw-resource production utilization is **103/114**. Luxury utilization remains **14/14**.

#### Why Game State stays 14

Data 54 composes existing place/map/route, ecology/population, gathering/resource recovery, inventory/provenance, production/work/workstation, commerce, NPC-schedule, and Pack-v2 authorities. No new durable serialized state family is introduced.

### `0.9.100.16` — Emberwash Badlands & Cinderwell Station

This revision establishes the canonical northern arid frontier south of Redstone while deliberately stopping before the farther true desert, southern strait, and Veyra sphere.

```text
Product       0.9.100.15 -> 0.9.100.16
Package       0.9.100    -> 0.9.100
Data          54         -> 55
Game State    14         -> 14
Account Save  5          -> 5
Benchmark     3          -> 3
```

#### Why Data 55

Stable authored content expands with:

- Emberwash North Wash, Cinderwell Station, and Emberwash Saltpan Verge;
- `map-emberwash-badlands`;
- Cinderwell Caravan Road from South Redstone through North Wash to Cinderwell with walk/mount/wagon/caravan access;
- Saltpan Foretrail from Cinderwell to the saltpan verge with walk/mount/caravan access only;
- Cinderwell as the explicit ordinary-wagon limit;
- eight arid-frontier species/populations, reusing four established families and adding four Emberwash families;
- seven exact-provenance forage/gather/mine sources and seven raw resources;
- ten processing/crafting transformations producing ten outputs;
- three persistent Cinderwell staff and two schedules;
- `pack-emberwash-badlands-ecology` and `pack-emberwash-cinderwell-station`;
- explicit practical preparation metadata for Emberpod and Cinder Pear.

No route leaves Emberwash Saltpan Verge toward the farther true desert, southern strait, or Veyra realm. No generalized heat meter, thirst meter, weather persistence, desert-access state, or Veyra-border authority is introduced.

Implementation freeze `2e8d8a519dcc916f91a120fb66337fe16753f6a4` passed Check #1547 / run `33279116948` with Repository Audit, **786/786 tests**, Census, Benchmark 3, and Benchmark Sample.

Promoted Data 55 head `6f850b4a63a152f17a55dec23224dff42c512cad` passed Check #1559 / run `33279480611` with the same full gate. Pages #1692 also passed.

### `0.9.100.17` — Lower Deepvein & Lantern Sump Station

This revision establishes the first controlled Deep World frontier below the existing Deepvein Mine while deliberately stopping before farther deep roads, northern gate country, or the Korren sphere.

```text
Product       0.9.100.16 -> 0.9.100.17
Package       0.9.100    -> 0.9.100
Data          55         -> 56
Game State    14         -> 14
Account Save  5          -> 5
Benchmark     3          -> 3
```

#### Why Data 56

Stable authored content expands with:

- Deepvein Lower Decline, Lantern Sump Station, and Lower Deepvein Echoing Shelf;
- `map-lower-deepvein`;
- two walk-only subterranean routes totaling 8,000 yalms and explicitly stopping at Echoing Shelf;
- eight cave species/populations, reusing five established families and adding three Lower Deepvein families;
- seven exact-provenance forage/fish/trap/gather/mine sources and seven raw resources;
- ten processing/crafting transformations producing ten outputs;
- three persistent Lantern Sump staff and two schedules;
- `pack-lower-deepvein-ecology` and `pack-lower-deepvein-lantern-sump`;
- explicit practical preparation metadata for Lampcap, Threadfin Cavefish, and Blind Sump Crab.

No farther deep-road or Korren route is authored. No generalized oxygen/survival meter, ventilation state, repaired-lift state, mining-certification state, or Korren-border authority is introduced.

Implementation freeze `b0c0048903ee6952f3c4bc337732f894340f540e` passed Check #1577 / run `33288699319` with Repository Audit, **791/791 tests**, Census, Benchmark 3, and Benchmark Sample. Pages #1709 also passed.

Promoted Data 56 head `7e162e26eb00b3249eef9ca26cd1a3100ea04f43` passed Check #1580 / run `33288912478` with the same full gate. Pages #1712 / run `33288912192` also passed.


Validated Data 56 census:

```text
places/localities                        52
named NPCs                               44
shop/service sites                       35
creature definitions                     96
resource sources                        117
canonical items                         352
recipes/processes                       204
abilities/techniques                     41
quests/contracts                         18
companions                                1
transport services                        7
routes                                   23
spell schools                             4
capabilities                             44
NPC schedules                            25
regional/shared packs                    31
pack-owned records                     1121
runtime seed NPCs                        43
runtime seed enemies                     17
```

Raw-resource production utilization is **117/128**. Luxury utilization remains **14/14**.

#### Why Game State stays 14

Data 55 composes existing place/map/route, ecology/population, gathering/resource recovery, inventory/provenance, production/work/workstation, commerce, NPC-schedule, and Pack-v2 authorities. Preparation-sensitive travel remains authored through place/route hazards, services, and available stock rather than a new durable serialized state family.

### `0.9.100.18` — Waymeet Marches & Cairnward Relay

This revision continues the grounded overland Waymeet corridor without collapsing the remaining journey into the metropolis.

```text
Product       0.9.100.17 -> 0.9.100.18
Package       0.9.100    -> 0.9.100
Data          56         -> 57
Game State    14         -> 14
Account Save  5          -> 5
Benchmark     3          -> 3
```

Stable authored Data 57 adds Windscar Saddle, Cairnward Relay, Waymeet South Marches, two route authorities, eight plateau populations, seven exact-provenance raws, ten transformations/outputs, three relay NPCs, two schedules, four service POIs, and two Pack-v2 ownership graphs. The saddle excludes wagons; wagon-capable travel begins at Cairnward. No route continues from the South Marches to the inner marches or Waymeet.

Implementation freeze `3ef4830baf992e6f9ff973576d6be642e47dc3fa` passed Check #1592 / run `33293624219` with Repository Audit, **797/797 tests**, Census, Benchmark 3, and Benchmark Sample. Promoted runtime/data SHA: `bf2103355ac3fc79b69e0007c46f9d3f14552054`.

Validated Data 57 census: 55 places, 47 NPCs, 37 service sites, 104 creatures, 124 sources, 369 items, 214 recipes, 7 transport services, 25 routes, 27 schedules, 33 packs, 1,183 pack-owned records, 46 runtime seed NPCs, and 17 runtime seed enemies. Raw-resource production utilization is **124/135**; luxury utilization remains **14/14**.

#### Why Game State stays 14

No new durable serialized player/world-state family is introduced. Data 57 reuses place/map/route, ecology/population, gathering/resource recovery, inventory/provenance, production/work/workstation, commerce, NPC schedule, and Pack-v2 authorities.

### `0.9.100.19` — Legacy Elderwood Ecology Repair

This revision repairs under-spread flora/fauna in existing Elderwood locations rather than adding a new geographic region.

```text
Product       0.9.100.18 -> 0.9.100.19
Package       0.9.100    -> 0.9.100
Data          57         -> 58
Game State    14         -> 14
Account Save  5          -> 5
Benchmark     3          -> 3
```

Stable Data 58 additions:
- one new River Dace ecology family;
- six new species definitions and nine population placements;
- ten exact-provenance sources/raws across East Elderwood, Timbercross Landing, and Thornwall Old Gaol;
- eleven transformations and eleven outputs;
- explicit food-safety handling for raw/cleaned Bronze Dace and direct-ready forest/riparian forage;
- descriptive non-harvested vegetation layers so botanical diversity is not reduced to resource-node count;
- one Pack-v2 repair ownership graph.

Implementation freeze `3732f22a464a3cdd2d11409475730ea804dfa1a6` passed Check #1601 / run `33314083287` with Repository Audit, **802/802 tests**, Census, Benchmark 3, and Benchmark Sample. Promoted runtime/data SHA: `9988c34e985d28586624d64258955cecec55e5d5`.

Measured Data 58 census: 55 places, 47 NPCs, 37 service sites, 110 creatures, 134 sources, 390 items, 225 recipes/processes, 41 abilities, 18 quests/contracts, 1 companion, 7 transport services, 25 routes, 27 schedules, 34 packs, and 1,241 pack-owned records. Raw-resource production utilization is **135/145**; luxury utilization remains **14/14**.

#### Why Game State stays 14

The pass adds static catalog definitions and instances of existing population/source authorities. It does not add a new serialized botanical state, ecology family state, fishing state, cellar state, route state, or player/world-state family.

### `0.9.100.20` — Dry Upland & Saltpan Ecology Repair

This revision repairs underrepresented dry-upland and saline flora plus one transition-fauna gap without adding geography.

```text
Product       0.9.100.19 -> 0.9.100.20
Package       0.9.100    -> 0.9.100
Data          58         -> 59
Game State    14         -> 14
Account Save  5          -> 5
Benchmark     3          -> 3
```

Stable Data 59 additions:
- one new Redstone Stone Grouse species in the existing Grouse family;
- three North Redstone population placements using existing Ridge Ibex, Sunscale Lizard, and Grouse families;
- eight exact-provenance flora sources/raws across South Redstone, North Redstone, and Emberwash Saltpan;
- eight transformations and eight outputs;
- two Pack-v2 repair ownership graphs;
- explicit practical preparation metadata for Stone Thyme, Wind Juniper Berries, and Saltbrush Shoots;
- descriptive non-harvested vegetation layers so dryland/saltpan diversity is not reduced to node count;
- no new fauna family and no geography expansion.

Implementation freeze `786d9afd7c7aeced567dc5f91cd5c56cc6e9c77d` passed Check #1610 / run `33322534675` with Repository Audit, **807/807 tests**, Census, Benchmark 3, and Benchmark Sample. Promoted runtime/data SHA: `4bc397beb5a0f987c462364599382419bf89cd43`.

Measured Data 59 census: 55 places, 47 NPCs, 37 service sites, 111 creatures, 142 sources, 406 items, 233 recipes/processes, 41 abilities, 18 quests/contracts, 1 companion, 7 transport services, 25 routes, 27 schedules, 36 packs, and 1,277 pack-owned records. Raw-resource production utilization is **144/153**; luxury utilization remains **14/14**.

#### Why Game State stays 14

The pass adds static catalog definitions and instances of existing population/source authorities. It does not add a serialized botanical state, saltpan state, transition-fauna state, route state, or player/world-state family.

### `0.9.100.21` — Headwater / Highland Transition Repair

This revision repairs upper-valley, saddle, foothill, and alpine distribution gaps without adding geography.

```text
Product       0.9.100.20 -> 0.9.100.21
Package       0.9.100    -> 0.9.100
Data          59         -> 60
Game State    14         -> 14
Account Save  5          -> 5
Benchmark     3          -> 3
```

Stable Data 60 additions:
- five new regional species variants using established Grouse, Bee, and Hare families;
- ten new population placements, including reused Coldstream Trout, South March Grey Grouse, Brush Hare, and Ironspine Snow Grouse species;
- one Upper Vale Bilberry source/raw with exact provenance;
- one cooked Bilberry-Meadowsweet Preserve transformation/output using existing dried Meadowsweet;
- one cross-region Pack-v2 repair ownership graph;
- expanded non-harvested meadow, foothill, and alpine vegetation descriptions;
- no new ecology family and no geography expansion.

Existing Scree Lynx and Froststep Lynx prey-family metadata was intentionally not rewritten in this bounded pass; the hare populations repair ecological prey distribution while preserving older pack ownership/dependency authority.

Implementation freeze `13ba1f7b03ace684778e5c388450af8efc9183b8` passed Check #1618 / run `33325161966` with Repository Audit, **812/812 tests**, Census, Benchmark 3, and Benchmark Sample. Promoted runtime/data SHA: `9c3c4d8a0b9e910c3312653d8836f3bbe03309bb`.

Measured Data 60 census: 55 places, 47 NPCs, 37 service sites, 116 creatures, 143 sources, 408 items, 234 recipes/processes, 41 abilities, 18 quests/contracts, 1 companion, 7 transport services, 25 routes, 27 schedules, 37 packs, and 1,296 pack-owned records. Raw-resource production utilization is **145/154**; luxury utilization remains **14/14**.

#### Why Game State stays 14

The pass adds static catalog definitions and population/source instances only. It does not add a serialized transition-state, pollinator-state, alpine-prey-state, route-state, or player/world-state family.

### `0.9.100.22` — Wetland / Island Distribution Repair

This revision repairs freshwater-fen, lake-island, and lower-delta distribution using existing canonical species only.

```text
Product       0.9.100.21 -> 0.9.100.22
Package       0.9.100    -> 0.9.100
Data          60         -> 61
Game State    14         -> 14
Account Save  5          -> 5
Benchmark     3          -> 3
```

Stable Data 61 additions:
- eight new population placements;
- zero new ecology families;
- zero new species;
- zero new gathering sources/resources/processes/production outputs;
- one population-only cross-region Pack-v2 repair ownership graph;
- East Starfen wader/fish/crab/dragonfly overlap;
- Reedcrown Perch/Dragonfly/Fen Duck overlap and same-place Grebe prey-family overlap;
- Lower Delta Saltflat Mud Crab presence;
- expanded descriptive wetland/island/delta vegetation without inventory-node inflation.

Implementation freeze `48948292ea26a38d91d306d12998973c1ae35677` passed Check #1626 / run `33325861973` with Repository Audit, **817/817 tests**, Census, Benchmark 3, and Benchmark Sample. Promoted runtime/data SHA: `d861b1a6cdeca5a470fb13fa429a7329353b6b02`.

Measured Data 61 census remains 55 places, 47 NPCs, 37 service sites, 116 creatures, 143 sources, 408 items, 234 recipes/processes, 41 abilities, 18 quests/contracts, 1 companion, 7 transport services, and 25 routes. Pack ownership moves to **38 packs / 1,304 records / 129 population records**. Raw-resource utilization remains **145/154**; luxury utilization remains **14/14**.

#### Why Game State stays 14

The pass adds static authored population placements only. It does not introduce a serialized wetland-distribution state, island-state family, recovery-right state, route state, or other durable player/world fact.

### `0.9.100.23` — Cross-Biome Family Breadth

This revision closes the ordered five-part location flora/fauna diversity repair sequence with two scoped missing small-fauna families.

```text
Product       0.9.100.22 -> 0.9.100.23
Package       0.9.100    -> 0.9.100
Data          61         -> 62
Game State    14         -> 14
Account Save  5          -> 5
Benchmark     3          -> 3
```

Stable Data 62 additions:
- Ground Squirrel family;
- Finch family;
- seven species and seven population placements;
- one cross-region Pack-v2 family-breadth graph;
- descriptive burrow/seed/hedgerow/coppice/foothill habitat evidence;
- no resource, recovery, item, recipe, production, geography, or durable-state expansion.

The Ground Squirrel family is deliberately scoped below Rat/Marmot/Hare breadth, and Finch is deliberately scoped to small seed-eating passerines rather than a generic “songbird” family.

Implementation freeze `c5e12b5d8f0b6ddf7a76f5df01316567b43d4528` passed Check #1634 / run `33331659415` with Repository Audit, **822/822 tests**, Census, Benchmark 3, and Benchmark Sample. Promoted runtime/data SHA: `bc472b60374a048686b0ee6c877ba26c515aec35`.

Measured Data 62 census: 55 places, 47 NPCs, 37 service sites, 123 creatures, 143 sources, 408 items, 234 recipes/processes, 41 abilities, 18 quests/contracts, 1 companion, 7 transport services, 25 routes, 39 packs, and 1,320 pack-owned records. Raw-resource utilization remains **145/154**; luxury utilization remains **14/14**.

Creature breadth now clears the playable-alpha planning lower bound of 120.

#### Why Game State stays 14

The pass adds static families, species, populations, and descriptive habitat text only. It introduces no new durable serialized family.

### Packet E — Gate A Integration & Census Audit

Packet E closes `0.9.100 Content Scale Gate A` as an audit/integration milestone without opening a new runtime revision.

```text
Product       0.9.100.23 -> 0.9.100.23
Package       0.9.100    -> 0.9.100
Data          62         -> 62
Game State    14         -> 14
Account Save  5          -> 5
Benchmark     3          -> 3
```

Permanent evidence: `docs/GATE_A_INTEGRATION_CENSUS_AUDIT.md`.

Implementation freeze `81b2928611a297d765eaa64f7cedeadb5fd697ee` passed Check #1638 / run `33332932015` with Repository Audit, **822/822 tests**, Census, Benchmark 3, and Benchmark Sample.

Gate A passes because Data 62 clears the Packet E planning bands and the qualitative Pack-v2/integration requirements. The later mechanics-scale gate remains not ready at 47/50 named NPCs, 41/100 abilities, 18/30 quests, and 1/4 companions.

No new durable serialized family, canonical authored-data record, or runtime behavior was introduced, so no version or migration change is warranted.

### `0.9.100.24` — Local Knowledge & Familiarity Foundation

This bounded prerequisite implements the player-information/locality-discovery foundation before broader UI or adventure-slice work.

```text
Product       0.9.100.23 -> 0.9.100.24
Package       0.9.100    -> 0.9.100
Data          62         -> 62
Game State    14         -> 15
Account Save  5          -> 5
Benchmark     3          -> 3
```

Implementation freeze `da168ddff6cc9e3611c9b8c06165b117081ea5c0` passed Check #1770 / run `33355620265` with Repository Audit, **823/823 tests**, Census, Benchmark 3, and Benchmark Sample.

Game State advances because the character now owns durable gameplay facts that cannot be reconstructed from canonical catalogs alone:
- layered place/POI knowledge and familiarity;
- learned names and NPC identity linkage;
- known connector familiarity;
- POI interaction history;
- temporary guidance/search bias that changes future exploration probability;
- current local POI/interior context.

Data stays 62 because no canonical authored place, route, POI, NPC, ecology, resource, item, process, quest, or Pack-v2 ownership record changed.

No supported-save migration is added. The project remains pre-alpha current-schema-only, so Game State 14 saves are not silently coerced into Game State 15.

The foundation adds no new simulation clock, direct timed-task owner, listener/background owner, inventory authority, or route graph.

### `0.9.200.1` — Adventure Vertical Slice A: Slatewater Road Scout

This revision opens the `0.9.200 Adventure Vertical Slices` track with a character-centered slice built entirely on existing Slatewater geography and current gameplay authorities.

```text
Product       0.9.100.24 -> 0.9.200.1
Package       0.9.100    -> 0.9.200
Data          62         -> 63
Game State    15         -> 15
Account Save  5          -> 5
Benchmark     3          -> 3
```

Permanent record: `docs/ADVENTURE_VERTICAL_SLICE_A_SLATEWATER_ROAD_SCOUT.md`.

Implementation freeze `63cbd31edb149c9cf10af0a83bcf6f667abe17b8` passed Check #1815 / run `33361131795` with Repository Audit, **826/826 tests**, Census, Benchmark 3, and Benchmark Sample.

Data advances because Slice A adds canonical authored IDs/ownership for:
- Sable Renn as a persistent NPC;
- the Slatewater road-scout locality contact;
- `Resin for the Mile Posts`;
- chained `Silver for the Fog Marks`;
- `companion-sable-renn`;
- Pack-v2 relationship/ownership metadata.

Game State stays 15 because all durable consequences already belong to existing authorities:
- commitment records own accepted/resolved contract state;
- NPC relationships own trust/respect/familiarity;
- party state owns recruitment, active membership, tactics, and companion relationship;
- local knowledge owns character-specific discovery/interaction facts;
- backing-NPC projection derives mobile NPC location from party authority.

Slice A also generalizes two existing runtime seams without adding a persistence family: commitment prerequisites are enforced canonically at acceptance/recruitment, and a recruited companion inherits the backing NPC's earned relationship dimensions rather than resetting them.

No supported-save migration, second route graph, second clock, new timed-task owner, or parallel social/quest/party store is introduced.

## Persistence history

Relevant late history:

```text
Game State 6 -> 7   canonical atlas fictional-time visits
7 -> 8              root combat/stat caches become derived
8 -> 9              canonical nested status modifiers
9 -> 10             state.npcs becomes derived projection
10 -> 11            state.enemies becomes derived projection
11 -> 12            top-level command log becomes transient
12 -> 13            durable cultivation authority
13 -> 14            durable paid cultivation delegation appointment
14 -> 15            durable locality knowledge/familiarity and active local POI context
0.8.900.1           no Game State change
0.9.100.1           no Game State change; Data 39 -> 40
0.9.100.2           no Game State change; Data 40 -> 41
0.9.100.3           no Game State change; Data 41 -> 42
0.9.100.4           no Game State change; Data 42 -> 43
0.9.100.5           no Game State change; Data 43 -> 44
0.9.100.6           no Game State change; Data 44 -> 45
0.9.100.7           no Game State change; Data 45 -> 46
0.9.100.8           no Game State change; Data 46 -> 47
0.9.100.9           no Game State change; Data 47 -> 48
0.9.100.10          no Game State change; Data 48 -> 49
0.9.100.11          no Game State change; Data 49 -> 50
0.9.100.12          no Game State change; Data 50 -> 51
0.9.100.13          no Game State change; Data 51 -> 52
0.9.100.14          no Game State change; Data 52 -> 53
0.9.100.15          no Game State change; Data 53 -> 54
0.9.100.16          no Game State change; Data 54 -> 55
0.9.100.17          no Game State change; Data 55 -> 56
0.9.100.18          no Game State change; Data 56 -> 57
0.9.100.19          no Game State change; Data 57 -> 58
0.9.100.20          no Game State change; Data 58 -> 59
0.9.100.21          no Game State change; Data 59 -> 60
0.9.100.22          no Game State change; Data 60 -> 61
0.9.100.23          no Game State change; Data 61 -> 62
0.9.100.24          Game State 14 -> 15; Data remains 62
0.9.200.1           no Game State change; Data 62 -> 63
```

Current pre-alpha policy remains current-schema-only; unsupported legacy saves are rejected rather than automatically migrated.

## Current content infrastructure contract

Canonical definition authority remains in the existing catalogs. Content packs own stable-ID placement and regional/shared dependency metadata; they do not create a second gameplay database merely for ownership.

Pack v2 collections:

```text
places / routes / transportServices
ecologyFamilies / species / populations / gatheringSources
items / npcs / npcSchedules / shops
recipes / quests / relationships
spellSchools / capabilities / abilities / companions
```

`contentCatalogRegistry` is the bridge between ownership manifests and canonical catalogs.

Key current system/catalog versions include:

```text
contentCatalogRegistry 0.3.0
contentPackSchema      0.2.0
regionalContentPacks   0.22.0
contentPackValidation  0.4.0
contentScaleGate       0.2.0
npcSchedules           0.9.0
commitments            0.8.0
productionCatalog      0.17.0
productionItems        0.18.0
ecologyRegistry        0.16.0
resourceItemRegistry   0.15.0
routeCatalog           0.9.0
headwaterEcology       0.1.0
headwaterProduction    0.1.0
starfenDeltaEcology    0.1.0
starfenDeltaProduction 0.1.0
gloamwoodEcology        0.1.0
gloamwoodProduction     0.1.0
gloamwoodResourceItems  0.1.0
emberwashEcology         0.1.0
emberwashProduction      0.1.0
emberwashResourceItems   0.1.0
lowerDeepveinEcology       0.1.0
lowerDeepveinProductionCatalog 0.1.0
lowerDeepveinProductionItems   0.1.0
lowerDeepveinResourceItems     0.1.0
waymeetMarchesEcology             0.1.0
waymeetMarchesProductionCatalog   0.1.0
waymeetMarchesProductionItems     0.1.0
waymeetMarchesResourceItems       0.1.0
elderwoodRepairEcology             0.1.0
elderwoodRepairResourceItems       0.1.0
elderwoodRepairProductionCatalog   0.1.0
elderwoodRepairProductionItems     0.1.0
dryUplandSaltpanRepairEcology             0.1.0
dryUplandSaltpanRepairResourceItems       0.1.0
dryUplandSaltpanRepairProductionCatalog   0.1.0
dryUplandSaltpanRepairProductionItems     0.1.0
headwaterHighlandTransitionRepairEcology             0.1.0
wetlandIslandDistributionRepairEcology               0.1.0
crossBiomeFamilyBreadthEcology                         0.1.0
headwaterHighlandTransitionRepairResourceItems       0.1.0
headwaterHighlandTransitionRepairProductionCatalog   0.1.0
headwaterHighlandTransitionRepairProductionItems     0.1.0
capabilities           0.5.0
abilityCatalog         0.4.0
companionCatalog        0.3.0
party                   0.4.0
playerContinuity        0.6.0
localityNavigation      0.3.1
```

Waymeet Marches uses the existing schedule/travel/ecology/resource/production behavior and durable-state contract; catalog/system versions advance only to reflect the expanded canonical Data 57 registries.

## Validation baseline

Ordinary local/hosted Check runs:

```text
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Census is continuously executable but mechanics-scale target shortfalls remain progression information rather than pass/fail thresholds.

Ironspine implementation-freeze Check #1368 / run `33215878907` passed with **753/753 tests**, Content Census, Benchmark 3, and Benchmark Sample on head `53323564ac724044ff06b1341c5466e73a34ab37`. Promoted exact-head Check #1381 / run `33217086478` passed the same full gate, and PR #402 merged at `a410eb18e6f8df2f58b965ab9697f8ae813b1c4d`.

The current Data 63 Slatewater Road Scout checkpoint is 55 places, 48 named NPCs, 37 service sites, 123 creatures, 143 sources, 408 items, 234 recipes/processes, 41 abilities, 20 quests/contracts, 2 companions, 7 transport services, 27 schedules, 39 packs, and 1,325 pack-owned records. Runtime seed NPCs are 47. Implementation freeze: `63cbd31edb149c9cf10af0a83bcf6f667abe17b8`; Check #1815 / run `33361131795` passed the full gate with 826/826 tests.

Gloamwood implementation freeze Check #1504 / run `33269167675` and promoted Data 54 Check #1507 / run `33269370813` both passed the full gate with **781/781 tests**. Emberwash implementation freeze Check #1547 / run `33279116948` passed the full gate with **786/786 tests**. Promoted Data 55 Check #1559 / run `33279480611` passed the same full gate with **786/786 tests**. Lower Deepvein implementation freeze Check #1577 / run `33288699319` and promoted Data 56 Check #1580 / run `33288912478` both passed the full gate with **791/791 tests**.

No hard timing thresholds are accepted. Benchmark 3 remains comparative evidence.

## Combat planning decision — no version change

The advanced-combat design audit and Slice B implementation planning add **no runtime/data/persistence version change**.

Permanent authorities:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`;
- `docs/COMBAT_2_0_SLICE_B_IMPLEMENTATION_PLAN.md`.

Current runtime remains Product 0.9.200.1 / Package 0.9.200 / Game State 15 / Data 63.

The next implementation is intended to advance Product within 0.9.200 only when Packet B1 actually lands. Data changes only for authored canonical records. Game State changes only if the implemented durable combat configuration/active-battle contract genuinely changes serialization.

## Phase progression

```text
0.9.100 Content Scale Gate A                  COMPLETE
  Packet A Content Pack Scale Contract v2     COMPLETE / MERGED
  Packet B Redstone Forge-Road                COMPLETE / MERGED
  Packet C Elderwood Hunt-Timber              COMPLETE / MERGED
  Packet D Universal Magic + Starfen          COMPLETE / MERGED
  Packet E Gate A integration/census          COMPLETE
0.9.200 Adventure vertical slices             ACTIVE / SLICE A COMPLETE; SLICE B COMBAT BRIDGE SELECTED / NOT STARTED
0.9.300 Advanced combat/training              QUEUED AFTER SLICE B PROOF; DESIGN AUTHORITY LOCKED
0.9.400 Economy/production depth              QUEUED
0.9.500 Quest/social depth                    QUEUED
0.9.600 Playable-alpha scale push             QUEUED
0.9.700 Browser E2E/accessibility              DEFERRED
0.9.800 Supported persistence transition      DEFERRED
0.9.900 RC soak/performance/release hardening DEFERRED
```

## Player-information/locality discovery implementation decision

`docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md` remains the design authority for learned locality knowledge, NPC identity disclosure, familiarity-gated navigation, contextual exploration, and staged NPC-mediated interaction.

**Local Knowledge & Familiarity Foundation is implemented and complete.**

```text
Product       0.9.100.23 -> 0.9.100.24
Package       0.9.100    -> 0.9.100
Data          62         -> 62
Game State    14         -> 15
Account Save  5          -> 5
Benchmark     3          -> 3
```

Current `localKnowledge` replaces binary `discoveredPois` as durable authority. The new state survives save/load because familiarity, identity linkage, connector knowledge, interaction history, and temporary guidance affect future player-facing and simulation decisions.

The exact foundation implementation freeze is `da168ddff6cc9e3611c9b8c06165b117081ea5c0`; Check #1770 / run `33355620265` passed Repository Audit, 823/823 tests, Census, Benchmark 3, and Benchmark Sample. The subsequent current runtime/data checkpoint is Product 0.9.200.1 / Data 63; Game State remains 15.

Richer ambient locality events, wandering merchants, generalized guard directions, personality-varied dialogue, and deeper shop-category conversation remain future bounded work rather than part of this persistence transition.

## Governance and release discipline

Normal low-risk Phase 0.9 work proceeds directly on `main`. Use a feature branch/PR only when rollback or blast-radius risk materially exceeds what ordinary GitHub history/revert can safely contain. Required validation evidence still applies before a bounded checkpoint is treated as complete.

A coherent checkpoint requires one bounded contract, focused/adversarial tests, relevant scale validation, full hosted Check, deliberate version decisions, an exact frozen implementation SHA before documentation synchronization, and `THREAD_HANDOFF.md` updated last.

## 1.0 — Live foundation

Release when the persistent-life/adventure promise is coherent, durable, original, stable, performant, usable through ordinary browser play, and supported by enough interconnected content for sustained play. Calendar targets remain planning envelopes, not commitments.