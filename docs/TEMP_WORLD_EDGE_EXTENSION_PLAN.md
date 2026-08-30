# Temporary World Edge Extension Plan

Status: **ACTIVE AS A TEMPORARY PLANNING REFERENCE AFTER THE MACRO-TOPOLOGY LOCK.**

The macro-world planning blocker is resolved by `docs/WORLD_MACRO_TOPOLOGY.md`. Headwater Vale, Starfen Delta / Brackish Coast, Gloamwood & Oldbough Refuge, Emberwash Badlands & Cinderwell Station, and Lower Deepvein & Lantern Sump Station have since been realized through Data 56. The historical numbered sections remain design notes rather than automatic authorization for later zones.

Purpose: preserve the current macro-geography, boundary-access rules, and prioritized zone-extension sequence so a new thread can resume from repository evidence without repeating the world-edge audit. This file may be deleted once its decisions have been absorbed into permanent regional/world-cartography documents.

## Current macro-geographic interpretation

The runtime owns local place grids and a route graph, not a single authoritative global-coordinate world polygon. Macro-geography therefore comes from canonical place descriptions, directional connections, established routes, ports/rivers/mines, and authored biome transitions.

Current anchors:

- Thornwall / Elderwood: temperate managed forest grading into old growth; Timbercross sits on a navigable river bend north of Thornwall.
- Brasshaven / Redstone Reach: dry mineral uplands, quarry roads, mines, wind-scoured ridges.
- Mistmere / Starfen: bright marsh-grassland, shallow waterways, reed routes, wetland ruins.
- Coppergrass Steppe: neutral temperate semi-arid steppe occupying the Forge-Mere corridor between Redstone and Starfen.
- Waymeet: future neutral crossroads hub; the current direct Thornwall link is a long-distance skyferry connection.

## World-edge rule

A local map edge is not automatically a walkable adjacent zone.

Boundary types should be selected from the fiction:

- open wilderness seam: ordinary walking may continue;
- mountain/cliff: impassable except via pass, tunnel, climbing route, or air travel;
- major river: cross only at bridge, ford, ferry, or boat route;
- deep lake/open sea: boat or ship required;
- flooded ruin: diving, drainage, or specialist equipment required;
- deep mine/cave: shaft, tunnel, lift, or subterranean route only;
- canyon: bridge/pass/trail required;
- long-distance sky route: air transport may bypass multiple overland zones;
- political/fortified boundary: physically traversable but legally restricted by permit, standing, invitation, or quest state;
- harsh environment: physically traversable but preparation-gated by water, weather, heat/cold, animals, supplies, or route knowledge.

Physical impossibility, legal restriction, and environmental danger should remain distinct concepts.

## Macro topology lock completed

The prior edge-by-edge sequence was paused until continents, seas, mountain chains, drainage, homeland envelopes, and barriers were established.

That blocker is now resolved by `docs/WORLD_MACRO_TOPOLOGY.md`.

The historical numbered sections below are retained as candidate design notes, **not as the current implementation order**.

Post-lock world-edge status:

- **Headwater Vale — COMPLETE / Data 52.**
- **Starfen Delta / Brackish Coast — COMPLETE / Data 53.**
- **Gloamwood & Oldbough Refuge — COMPLETE / Data 54.**
- **Emberwash Badlands & Cinderwell Station — COMPLETE / Data 55.**
- **Lower Deepvein & Lantern Sump Station — COMPLETE / Data 56.**

Remaining recommended order:

1. Waymeet Marches / central plateau approaches;
2. Coppergrass extensions;
3. Drowned Vaults.

Key reasons:

- Headwater Vale now anchors the Timbercross river headwaters and the first overland leg toward Waymeet;
- the Great Mere outflow is now explicitly east-draining, so the brackish delta/coast has a valid hydrological placement;
- Gloamwood is the first western barrier toward the Lethari heartland;
- Emberwash remains important but is now explicitly only the northern arid frontier before the southern strait/Veyra sphere;
- Lower Deepvein now realizes the first controlled Deep World frontier and still stops before farther deep roads or Korren settlements.

No remaining candidate is auto-authorized.

## Headwater Vale implementation result

Headwater Vale is complete in Data 52 / Product 0.9.100.13.

Implemented directly on `main` with:

- Headwater Lower Vale, Warden Lodge, and Upper Vale;
- Timbercross river road with wagon access only as far as the lodge;
- walk/mount-only Upper Trail;
- deliberate lack of an onward Upper Vale route until future plateau/Waymeet-Marches work;
- six species/populations, six gathering sources, and population-backed Red Deer hunting;
- nine raw/body resources;
- ten production transformations and ten outputs;
- three lodge NPCs, two schedules, exchange and workstation services;
- two Pack-v2 ownership graphs;
- exact provenance and practical fantasy-era food-safety treatment.

Implementation freeze `aa39347a0faa754690a194d926262256e92027f1` passed Check #1476 / run `33264692343` with **770/770 tests**, Census, Benchmark 3, and Benchmark Sample.

At the Headwater checkpoint, **Gloamwood** remained a ranked western candidate; Starfen Delta / Brackish Coast was subsequently selected and authored before it.

## Starfen Delta / Brackish Coast implementation result

Starfen Delta / Brackish Coast is complete in Data 53 / Product 0.9.100.14.

Implemented directly on `main` with:

- Lower Delta, Tideglass Landing, and Brackish Coast;
- an East Starfen levee route;
- a Merewatch -> Lower Delta -> Tideglass packet waterway/service;
- Tideglass Coast Track;
- explicit Eastern Sea non-walkability and no Miri/open-ocean route;
- eight coastal species/populations and seven exact-provenance sources/raws;
- ten transformations producing eleven outputs;
- three Tideglass staff, two schedules, exchange/pilot/workstation services;
- two Pack-v2 ownership graphs;
- practical raw-seafood safety treatment.

Implementation freeze `c515588c404c0f80a724d767b74535f1e39ae166` passed Check #1491 / run `33267789356` with **776/776 tests**. Promoted Data 53 Check #1493 / run `33267935109` was also fully green.

The next ranked world-edge candidate is **Emberwash Badlands**.

## Gloamwood & Oldbough Refuge implementation result

Gloamwood & Oldbough Refuge is complete in Data 54 / Product 0.9.100.15.

Implemented directly on `main` with:

- Gloamwood Verge, Oldbough Refuge, and Gloamwood Deep;
- Oldgrowth Cart Track from West Elderwood to Oldbough with walk/mount/wagon access;
- Deepwood Forester Trail from Oldbough to Gloamwood Deep with walk/mount only;
- Oldbough as the explicit wagon limit;
- no onward route into the western mountain crescent or Lethari homeland;
- eight old-growth species/populations and seven exact-provenance sources/raws;
- ten transformations producing ten outputs;
- three refuge staff, two schedules, exchange/forester/workyard/hearth services;
- two Pack-v2 ownership graphs;
- practical mushroom/berry safety treatment.

Implementation freeze `83cfa4de61e315fb54689a5d7d2899d2ade41743` passed Check #1504 / run `33269167675` with **781/781 tests**. Promoted Data 54 head `2de11cd73302751e9a83088d77c2de42df3313e8` passed Check #1507 / run `33269370813` with the same full gate.

At the Data 54 checkpoint, **Emberwash Badlands** was the next ranked world-edge candidate. It has since been implemented and promoted as Data 55; **Lower Deepvein** is now next.

## Emberwash Badlands & Cinderwell Station implementation result

Emberwash Badlands & Cinderwell Station is complete in Data 55 / Product 0.9.100.16.

Implemented directly on `main` with:

- Emberwash North Wash, Cinderwell Station, and Emberwash Saltpan Verge;
- Cinderwell Caravan Road from South Redstone through North Wash to Cinderwell with walk/mount/wagon/caravan access;
- Saltpan Foretrail from Cinderwell to the Saltpan Verge with walk/mount/caravan only;
- Cinderwell as the explicit wagon limit;
- no onward route into the farther true desert, southern strait, or Veyra sphere;
- eight arid-frontier species/populations and seven exact-provenance sources/raws;
- ten transformations producing ten outputs;
- three Cinderwell staff, two schedules, exchange/warden/workyard/hearth services;
- two Pack-v2 ownership graphs;
- practical Emberpod/Cinder Pear safety treatment.

Implementation freeze `2e8d8a519dcc916f91a120fb66337fe16753f6a4` passed Check #1547 / run `33279116948` with **786/786 tests**. Promoted Data 55 head `6f850b4a63a152f17a55dec23224dff42c512cad` passed Check #1559 / run `33279480611` with the same full gate. Pages #1692 also passed.

Lower Deepvein was the next ranked world-edge candidate after Data 55 and has since been implemented and promoted as Data 56.

## Lower Deepvein & Lantern Sump Station implementation result

Lower Deepvein & Lantern Sump Station is complete in Data 56 / Product 0.9.100.17.

Implemented directly on `main` with:

- Deepvein Lower Decline, Lantern Sump Station, and Lower Deepvein Echoing Shelf;
- walk-only Lower Deepvein Haulage Decline from Deepvein Mine through the Lower Decline to Lantern Sump;
- walk-only Echoing Shelf Traverse;
- no onward route into farther deep roads, northern gate country, or Korren settlements;
- eight cave species/populations and seven exact-provenance sources/raws;
- ten transformations producing ten outputs;
- three Lantern Sump staff, two schedules, exchange/survey/lampworks/hearth services;
- two Pack-v2 ownership graphs;
- practical Lampcap/Threadfin/Sump Crab safety treatment;
- explicit non-duplication of existing Deepvein lead and silver deposits.

Implementation freeze `b0c0048903ee6952f3c4bc337732f894340f540e` passed Check #1577 / run `33288699319` with **791/791 tests**. Promoted Data 56 head `7e162e26eb00b3249eef9ca26cd1a3100ea04f43` passed Check #1580 / run `33288912478` with the same full gate. Pages #1712 also passed.

The next ranked world-edge candidate is **Waymeet Marches / central plateau approaches**, followed by **Coppergrass extensions** and **Drowned Vaults**.

## Prioritized zone/biome extensions

### 1. Slatewater Foothills — MERGED / AUDITED

Placement: between Timbercross/Elderwood and Brasshaven/Redstone along the long Crown-Forge road.

Biome: temperate foothill woodland grading into rocky montane scrub.

Geographic purpose:
- explains the current long Elderwood-to-Redstone transition;
- introduces valley/pass topology instead of treating uplands as flat open ground;
- supports river ravines, mixed woodland, rockier eastern slopes, exposed mineral geology, and caravan bottlenecks.

Access:
- road/pass corridors: walk, mount, wagon, caravan;
- broad cliff bands: not directly walkable;
- future side paths may be foot/mount only.

Habitation direction:
- **Slatewater Waylodge**: guild-supported road lodge for gatherers, hunters, and traders;
- buy/sell local field goods and practical supplies;
- safe food and sleeping;
- mount and pack-animal stabling/care as a travel/logistics service;
- field information, route guidance, and guild presence;
- surrounding foothills remain wilderness rather than settlement.

Likely ecology/resource direction:
- deer/goat-like browsers and grazers;
- bear or lynx-like predator niche;
- eagles/raptors;
- mixed pine/hardwood;
- medicinal lichen/herbs;
- stone, clay, mineral wash deposits;
- hides, resin, nuts/berries, upland fungi;
- staple + specialty trade goods.

### 2. Crownfields — MERGED / VALIDATED

Placement: south of Thornwall.

Biome: temperate agricultural lowland, pasture, hedgerows, orchards.

Purpose:
- supplies Thornwall's food economy;
- introduces managed/agricultural ecology.

Access: broadly walkable and wagon/mount friendly.

Habitation: dispersed farms, hamlets, mills, shepherd camps, granaries, agricultural guild sites; no need for another major city.

Priority content: cattle, sheep/goats, poultry, working animals, cats/dogs, crop pests, cereals, pulses, flax/oil crops, orchards, hay/fodder, managed apiaries.

## Item 2 implementation result

The user explicitly authorized continuing with the next recommended zone, **Crownfields**.

Implemented on PR #392 and merged at `738faa5813e4aca30950b0d787f1209ae9a3d917`:

1. `crownfields` added as Thornwall's danger-1 managed agricultural lowlands;
2. `crownfields-grange` added as a danger-0 farm-market/service hamlet rather than a city;
3. `map-crownfields` added under Data 45 reciprocal map/place integrity rules;
4. Southfield Farm Road connects Thornwall Southgate and the Grange at 9,000 yalms / 3,600 seconds;
5. Crownfields Produce Wagon adds scheduled wagon/freight transport;
6. Grange Produce Exchange, Growers' Hall, wagon yard, millhouse/common loft, three staff NPCs, and two schedules make the hamlet functional;
7. managed ecology adds cattle, sheep, hens, field rats, and orchard honeybees;
8. six exact-provenance crop resources add grain, pulse, fiber, orchard fruit, fodder, and dye-crop roles;
9. the existing Bee family is reused through an explicit Elderwood ecology dependency rather than duplicate ownership;
10. husbandry products are deferred until a proper managed-animal source model exists.

Pre-promotion hosted Check #1294 / run `33199542741` passed Repository Audit, **731/731 tests**, Content Census, Benchmark 3, and Benchmark Sample.

Measured census: 31 places, 23 NPCs, 21 service sites, 45 creatures, 41 resource sources, 96 items, 29 recipes/processes, 41 abilities, 18 quests/contracts, 1 companion, 5 transport services, 8 routes, 11 schedules, 15 packs, and 410 owned records.

**No later numbered item is automatically authorized by completion of Item 2.** Great Mere is the next ranked geography candidate.

### 3. Great Mere — MERGED / VALIDATED

Placement: east or southeast of Starfen as a deep-freshwater body connected to the wetland system.

Biome: large freshwater lake, reed margins, islands, open water.

Access:
- shore: walkable;
- open lake: no walking;
- ferry/skiff/fishing boat required;
- islands only via water routes unless specifically connected by causeway.

Habitation: fishing hamlets, ferry stations, fisheries guild lodge, research post, shrine, or uninhabited nesting islands.

Priority ecology: multiple fish families, predatory fish, freshwater crustaceans, aquatic insects, diving birds, turtles/amphibians, mussels, aquatic plants.

## Item 3 implementation result

The user explicitly authorized continuing with the next recommended zone, **Great Mere**, with a standing requirement that new zones receive plausible flora/fauna, resources/catches/drops, connected processing/recipes, and explicit food-safety labeling.

Implemented on PR #396 and merged at `e327181fcd1e93579f335045a817de1fdae842a5`:

1. Great Mere Westshore, Merewatch Landing, and boat-only Reedcrown Isle;
2. Chart of the Great Mere;
3. East Fen Shore Track and Reedport-Mere Waterway;
4. scheduled Great Mere Ferry;
5. five new freshwater ecology families plus reuse of canonical turtle/mussel families;
6. seven passive/wary species/populations;
7. nine resource sources and nine exact-provenance raws;
8. Merewatch fishery exchange, lakesmen’s hall, smokehouse/common loft, ferry landing, three NPCs, and two schedules;
9. 22 transformations producing 23 outputs across cleaning, preservation, cooking, detoxification, shell-lime byproducts, rush/net craft, and pearl work;
10. explicit item consumption metadata distinguishing direct, process-required, non-food, pathogen-risk, raw-irritant, and raw-toxic states;
11. Bitterflag Rhizome as the reference raw-toxic food with an actual slice/leach/boil detoxification chain;
12. recipes/processes rise past the mechanics floor.

Final exact PR-head Check #1348 / run `33212388143` and post-merge main Check #1349 / run `33212454122` passed Repository Audit, **743/743 tests**, Content Census, Benchmark 3, and Benchmark Sample.

Measured census: 34 places, 26 NPCs, 23 service sites, 52 creatures, 50 resource sources, 158 items, 81 recipes/processes, 41 abilities, 18 quests/contracts, 1 companion, 6 transport services, 10 routes, 13 schedules, 18 packs, and 564 owned records.

**No later numbered item is automatically authorized by completion of Item 3. Ironspine Highlands becomes the next ranked geography candidate after Great Mere lands.**

### 4. Ironspine Highlands — MERGED / VALIDATED

Placement: north of North Redstone Reach.

Biome: alpine/subalpine mountains.

Access:
- broad cliff/scree walls: impassable;
- authored mountain passes: walk/mount;
- wagon access only where a maintained pass road exists;
- future tunnels/skyferry possible.

Habitation: sparse prospector camps, mining survey lodge, high-pass watchpost, herder shelters; no city required.

Priority ecology/resources: bears, lynx-like cats, pikas/marmots, mountain sheep/goats, eagles/grouse, conifers, lichens, alpine medicine, wool/fur, high-altitude minerals.

## Item 4 implementation result

The user explicitly authorized continuing with the next recommended zone, **Ironspine Highlands**, after first completing the population-backed hunting bridge.

Implemented through PR #400 (hunting bridge) and PR #402 (Ironspine/Data 49), with Ironspine merged at `a410eb18e6f8df2f58b965ab9697f8ae813b1c4d`:

1. Ironspine Lower Pass, High-Pass Watch, and High Meadow establish a sparse alpine/subalpine region north of North Redstone Reach;
2. a maintained lower pass road supports walking, mounts, and wagons, while the upper High Trail supports only walking/mounts;
3. broad cliff/scree bands remain non-walkable except through authored route corridors;
4. the High-Pass Watch provides a survey exchange, warden desk, common hearth/sleeping space, and sheltered animal yard at the wagon limit;
5. six alpine species/populations reuse established regional families rather than duplicating taxonomy;
6. Snowhorn Ibex, Cliff Bear, and Froststep Lynx use population-backed deliberate hunting rather than forced generic aggression;
7. encounter start does not deplete ecology; victory consumes exactly one population unit and existing defeated-body recovery remains authoritative;
8. six gathering sources plus hunted-body recovery provide eleven exact-provenance raw/body resources;
9. thirteen transformations/outputs connect those materials to preserved provisions, leather/fur work, salves, survey instruments, bedding, and cold-weather gear;
10. every new Ironspine raw/body resource has intentional production demand;
11. food-safety metadata remains explicit, but player-facing language uses practical late-medieval/fantasy preparation knowledge such as raw game causing sickness and salting/smoking/stewing making it fit for use;
12. Game State remains 14 because no new durable state family was added.

Implementation-freeze Check #1368 / run `33215878907` and promoted exact-head Check #1381 / run `33217086478` both passed Repository Audit, **753/753 tests**, Content Census, Benchmark 3, and Benchmark Sample.

Measured Data 49 census: 37 places, 29 NPCs, 25 service sites, 58 creatures, 56 resource sources, 182 items, 94 recipes/processes, 41 abilities, 18 quests/contracts, 1 companion, 6 transport services, 12 routes, 15 schedules, 20 packs, and 630 owned records.

**At the Data 49 checkpoint, no later numbered item was automatically authorized by completion of Item 4. Emberwash Badlands was then a later ranked geography candidate and has since been completed as Data 55.**

### 5. Emberwash Badlands — IMPLEMENTED / VALIDATED

Placement: south of South Redstone Reach.

Biome progression: dry upland -> rocky grass -> badlands/dry washes -> salt basin/desert scrub -> true desert farther south.

Access: physically walkable but preparation-sensitive; water, heat, storms, wells, mount suitability, and canyon routes matter.

Habitation: caravan wells, salt camps, prospectors, fortified route station, ruins.

### 6. Gloamwood — IMPLEMENTED / VALIDATED

Placement: beyond West Elderwood / farther into old growth.

Biome: deeper old-growth temperate forest.

Access: mostly walkable on foot, but wagons limited to real tracks; ravines, deadfall, flooded gullies create local hard/soft barriers.

Habitation: preferably none or only ranger/forester/poacher camps, shrines, abandoned lodges, raider satellites.

### 7. Headwater Vale

Placement: north/upstream from Timbercross Landing.

Biome: cool river valley, mixed forest, upland meadow.

Access:
- roads/trails along valley;
- river freight where navigable;
- river crossings only at bridge/ford/ferry;
- steep side ridges restricted.

Habitation: lumber/fish camps, charcoal burners, river wardens, small village or guild lodge.

### 8. Lower Deepvein — IMPLEMENTED / VALIDATED

Placement: below/beyond Deepvein Mine.

Biome: deep subterranean cave/mining ecosystem.

Access: subterranean only through the authored walk-only haulage decline and cavern traverse; no surface-edge walking.

Implemented boundary: Lantern Sump is the safe operating node and Echoing Shelf is the hard stop. Repaired-lift, ventilation, certification, quest-gate, farther-deep-road, and Korren-border state families were deliberately not introduced.

Ecology/resources: blind crustaceans/fish, cave insects, fungi, guano, salts, crystals, rare ores.

### 9. Drowned Vaults

Placement: deeper than the Sunken Archive.

Biome: submerged ruin / underground aquatic habitat.

Access: initially impossible; later diving equipment, breathing magic, drainage projects, or flooded-tunnel boat access.

Habitation: none inside; expedition camps outside only.

### 10. Coppergrass extensions

North: Windcut Tablelands — drier, rockier steppe/mesa country.

South: Longgrass Prairie — deeper soils, taller grass, larger herd ecology, seasonal ponds.

Purpose: make Coppergrass a biome belt rather than one isolated biome tile.

Habitation: herder camps, temporary caravan/warden shelters; major settlements unnecessary.

### 11. Starfen Delta / Brackish Coast

Placement: only after the world's drainage direction is deliberately established.

Biome progression: deep reed channels -> delta -> brackish marsh -> tidal flats -> open coast.

Access:
- levees/shallow marsh: selective walking;
- channels/delta: boats;
- open sea/islands: ships.

Priority ecology/resources: marine fish, rays/sharks, cephalopods, seabirds, marine mammals, shellfish, kelp/seaweed, salt, pearls, marine dyes/oils.

### 12. Waymeet approach regions

Direct Thornwall -> Waymeet remains **skyferry-only** as a bypass route.

A future overland journey should cross multiple zones, e.g. Timbercross -> Headwater Vale -> high pass/central plateau -> Waymeet Marches -> Waymeet.

Waymeet should not become a one-zone walk north of Thornwall.

## Habitation policy

New zones do not require settlements.

Valid content densities include:

- no habitation;
- temporary camp only;
- ranger/gatherer/hunter lodge;
- guild hall;
- mine/quarry/fishery work camp;
- caravan shelter or waystation;
- military/warden outpost;
- monastery/research station;
- village/hamlet;
- major settlement only when economy, population, services, and regional history justify it.

Sparse geography is a feature when it creates meaningful travel, preparation, ecology, and isolation.

## Item 1 implementation result

The user explicitly authorized **Item 1: Slatewater Foothills**, with a guild lodge for gatherers, hunters, and traders.

Implemented on PR #389 and merged at `edca59ac8955d999f7c80812688e7153d5aaafeb`:

1. Slatewater inserted into the Crown-Forge corridor with the established through-road distance/time preserved;
2. Slatewater Foothills created as danger-3 wilderness;
3. Slatewater Waylodge created as a neutral danger-0 locality/travel hub;
4. functional field exchange uses existing shop authority to buy sellable field finds and sell supplies/local goods;
5. hearth/bunkroom fiction uses existing safe-locality campaign recovery for actual rest;
6. stableyard/mount/pack-animal care uses place/POI/NPC/travel-service content without creating duplicate durable mount state;
7. four fauna families/species/populations and six exact-provenance gathering resources added;
8. ecology and lodge Pack-v2 ownership registered;
9. focused field→trade→provision→recovery and route/ecology/pack tests added.

Validated before final documentation synchronization by hosted Check #1253 / run `33182827321`: Repository Audit PASS, **724/724 tests**, Census PASS, Benchmark 3 PASS, Benchmark Sample PASS.

Validated census: 29 places, 20 named NPCs, 19 shop/service sites, 40 creature definitions, 35 resource sources, 90 items, 29 recipes/processes, 41 abilities, 18 quests/contracts, 1 companion, 4 transport services, 9 schedules, 13 packs, 374 pack-owned records.

**No later numbered item is automatically authorized by completion of Item 1.**

The subsequent Data 45 ecology/geography integrity audit is recorded in `docs/ECOLOGY_GEOGRAPHY_INTEGRITY_AUDIT.md`. It repaired route/connection conflicts and strengthened world/ecology validation without changing this ranked expansion sequence.

## Current repository checkpoint before Slatewater work

Main after Coppergrass:

- merge commit: `4c1b1956e5d3126fced402188f00f1612be853f3`;
- PR #388 merged;
- hosted post-merge Check #1242 / run `33179535968`: green;
- tests: 721/721;
- Product 0.9.100.4 / Package 0.9.100 / Game State 14 / Data 43 / Benchmark 3.

Post-Coppergrass census:

- places/localities: 27;
- named NPCs: 17;
- shop/service sites: 17;
- creature definitions: 36;
- resource sources: 29;
- canonical items: 84;
- recipes/processes: 29;
- abilities/techniques: 41;
- quests/contracts: 18;
- companions: 1;
- transport services: 3;
- routes: 7;
- regional/shared packs: 11;
- pack-owned records: 341.

Mechanics-scale gate remains NOT READY; this is progression evidence rather than a CI failure.
