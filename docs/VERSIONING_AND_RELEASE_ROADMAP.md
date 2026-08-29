# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

## Current baseline

```text
Product:       0.9.100.12
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          51
Benchmark:     3
Codename:      Regional Resource & Trade Resilience
Compatibility: pre-release-current-schema
Runtime:       Node >=24
Phase:         0.9 / 0.9.100 in progress
```

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`.

`package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority. Planning a track does not open its runtime version; implementation does.

## Independent contract versions

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 5 | local account/session/character registry contract |
| Game State | 14 | serialized character/world runtime contract |
| Data | 49 | canonical authored-data, stable-ID, item-safety, population-hunting linkage, pack ownership and validation contract |
| Benchmark | 3 | workload/measurement comparability contract |

These advance independently.

## `0.9.100` history and current decision

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
regionalContentPacks   0.8.0
contentPackValidation  0.3.0
contentScaleGate       0.2.0
npcSchedules           0.3.0
commitments            0.7.0
productionCatalog      0.6.0
productionItems        0.8.0
capabilities           0.5.0
abilityCatalog         0.4.0
```

The schedule system version stays 0.3.0 because only authored schedule data grew; the schedule contract/behavior did not change.

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

The current Data 51 regional-resilience checkpoint supersedes Data 50: 37 places, 29 named NPCs, 25 service sites, 58 creatures, 83 sources, 264 items, 154 recipes/processes, 41 abilities, 18 quests/contracts, 1 companion, 6 transport services, 15 schedules, 21 packs, and 799 pack-owned records.

No hard timing thresholds are accepted. Benchmark 3 remains comparative evidence.

## Phase progression

```text
0.9.100 Content Scale Gate A                  IN PROGRESS
  Packet A Content Pack Scale Contract v2     COMPLETE / MERGED
  Packet B Redstone Forge-Road                COMPLETE / MERGED
  Packet C Elderwood Hunt-Timber              COMPLETE / MERGED
  Packet D Universal Magic + Starfen          COMPLETE / MERGED
  Packet E Gate A integration/census          QUEUED / NOT STARTED
0.9.200 Adventure vertical slices             QUEUED
0.9.300 Advanced combat/training              QUEUED
0.9.400 Economy/production depth              QUEUED
0.9.500 Quest/social depth                    QUEUED
0.9.600 Playable-alpha scale push             QUEUED
0.9.700 Browser E2E/accessibility              DEFERRED
0.9.800 Supported persistence transition      DEFERRED
0.9.900 RC soak/performance/release hardening DEFERRED
```

## Governance and release discipline

Phase 0.9 track work uses PR-based integration and merges only after required validation evidence is observed. Protected `main` remains recommended; if the available repository action surface cannot configure protection, record that administrative limitation rather than claiming it was changed.

A coherent checkpoint requires one bounded contract, focused/adversarial tests, relevant scale validation, full hosted Check, deliberate version decisions, an exact frozen implementation SHA before documentation synchronization, and `THREAD_HANDOFF.md` updated last.

## 1.0 — Live foundation

Release when the persistent-life/adventure promise is coherent, durable, original, stable, performant, usable through ordinary browser play, and supported by enough interconnected content for sustained play. Calendar targets remain planning envelopes, not commitments.