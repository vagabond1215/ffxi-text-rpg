# World Macro Topology

Status: **LOCKED planning authority for world-scale topology.** This document does not create runtime places, routes, maps, or persistent state.

Purpose: establish the spatial skeleton Hearth & Horizon must obey before further edge-by-edge region authoring.

## 1. Geometry doctrine

Hearth & Horizon does **not** use a single global square or hex tessellation as world authority.

The world is continuous and geographically irregular. Forests, basins, mountain chains, wetlands, coasts, deserts, political regions, and civilization envelopes may have whatever shapes the fiction and physical geography require.

Geography is represented at three distinct scales:

1. **Macro geographic envelope** — relative placement, approximate extent, climate, drainage, boundaries, and civilization-scale geography.
2. **Inter-place route graph** — canonical traversability, distance, fictional travel time, transport modes, hazards, gates, ferries, passes, tunnels, and other real approaches.
3. **Local place coordinates** — the existing grid or topology system used for fine exploration inside a place.

Consequences:

- a local 8x8 wilderness grid is an exploration abstraction, not proof that the region is a literal square on the world map;
- two macro regions may physically touch without sharing a walkable crossing;
- a mountain wall, deep lake, sea, cliff band, major river, political border, or magical barrier may leave only one or two legitimate passages;
- approximate regional length/width may be recorded as scale ranges, but the ranges do not turn the region into a rectangle;
- route distance/time remains travel authority even when a cartographic rendering places two regions close together;
- local topology areas remain appropriate for cities, interiors, dungeons, passes, and other authored networks;
- a future special-purpose local hex coordinate system is not forbidden, but it would be added only for a place whose gameplay benefits from six-way uniform movement. It would not redefine the planet as a hex board.

No runtime macro-coordinate schema is introduced by this pass. A later cartographic renderer may add non-authoritative plotting anchors or approximate envelopes without replacing route authority.

## 2. Surface and vertical world structure

The locked baseline is:

- **Central Continent** — contains the currently authored world, Waymeet, the Lethari western/northwestern heartland, Ironspine approaches, and the northern surface gates toward the Korren deep realm.
- **Southern Landmass** — contains the principal Veyra ancestral heartland, separated from the Central Continent by a meaningful southern strait/inner sea and arid approaches.
- **Eastern Archipelago** — the principal Miri ancestral realm beyond the eastern coast, treated as a major island chain rather than another contiguous biome attached to Starfen.
- **Deep World** — cavern, deep-road, underground-river, mine, and citadel geography beneath the northern massifs; the Korren ancestral realm belongs here.
- **Pelagic World** — continental shelf, reef, submerged-city, and deep-water civilization space beyond the eastern/southern coasts.

The Central Continent has meaningful ocean access on the west and east and opens to the southern strait/sea. Its northern extent continues into high mountains and farther continental terrain; no northern coastline is required by the current plan.

## 3. Locked relative placement

The existing authored corridor remains the Central Civilized Belt.

West-to-east core:

```text
Elderwood / Thornwall
  -> Slatewater Foothills
  -> Redstone Reach / Brasshaven
  -> Coppergrass Steppe
  -> Starfen / Mistmere
  -> Great Mere
  -> future lower outflow / brackish delta / eastern coast
  -> Eastern Sea
  -> Miri Archipelago
```

North and northwest:

```text
West Elderwood
  -> Gloamwood
  -> western mountain crescent
  -> Lethari fertile-valley heartland

Timbercross
  -> Headwater Vale
  -> central highland/plateau approaches
  -> Waymeet Marches
  -> Waymeet

North Redstone
  -> Ironspine Highlands
  -> northern gate country
  -> controlled shafts / deep roads
  -> Korren Deep World
```

South:

```text
Thornwall
  -> Crownfields
  -> lower western/southwestern river country

South Redstone
  -> Emberwash dry frontier
  -> badlands / salt-basin / desert approaches
  -> southern strait port
  -> sea crossing
  -> Veyra northern port
  -> Veyra heartland
```

Waymeet is reserved on the northwestern-to-north-central interior plateau between the western homeland approaches and the Ironspine sphere. It is not one ordinary zone north of Thornwall. The existing Thornwall-Waymeet skyferry remains a long-distance bypass over a future multi-region overland journey.

## 4. Major mountain and barrier skeleton

### Ironspine system

The Ironspine is a true northern massif, not an isolated three-place ridge.

It:

- rises north of Redstone;
- continues beyond the currently authored lower pass/high meadow;
- separates the Central Belt from northern high country and major Deep World gates;
- supplies important headwaters to eastern and central basins;
- provides the principal physical barrier before the Korren realm.

The existing Lower Pass Road and High Trail remain valid local approaches. They do not imply unrestricted crossing anywhere along the massif.

### Western mountain crescent

A separate western/northwestern mountain crescent encloses or shelters the Lethari ancestral basin beyond Gloamwood.

It:

- is distinct from the Ironspine;
- prevents the Lethari homeland from being directly adjacent to West Elderwood;
- creates guarded pass geography, ravines, and partially warded old routes;
- allows the Lethari heartland to be fertile and settled rather than one continuous forest tile.

### Central plateau and saddles

Between the western crescent and the Ironspine lies a higher interior of valleys, saddles, and plateau country.

This is the broad future approach to Waymeet and explains why the Thornwall-Waymeet overland route requires Headwater Vale plus additional travel rather than a direct local edge.

### Southern arid barrier

South of Redstone the land descends through dry uplands into badlands, washes, salt basins, and increasingly arid country.

Emberwash belongs to this system. It is a **northern arid frontier**, not the Veyra homeland itself. A further strait/inner sea remains between the harsh southern approach and the main Veyra landmass.

## 5. Drainage lock

### Thornwall / Timbercross drainage

The navigable bend at Timbercross belongs to a western drainage whose headwaters rise in Headwater Vale and adjacent plateau/highland country.

The river system:

- runs down through Elderwood;
- supports Thornwall river traffic and the agricultural water logic of the Crownfields basin;
- ultimately drains toward the western or southwestern sea;
- is not required to connect to Great Mere.

Exact tributaries, river names, and mouth geography remain future cartographic detail.

### Great Mere drainage

Great Mere is locked as an **open freshwater lake within a larger east-draining basin**, not a terminal salt lake.

It receives water from:

- eastern/southeastern Ironspine headwaters;
- Starfen wetland channels and tributaries;
- seasonal Coppergrass/Redstone-side runoff where geography permits.

Its principal outflow leaves the eastern/southeastern lake basin and becomes the future lower reed river / delta system before reaching the **Eastern Sea**.

This resolves the placement requirement for the future **Starfen Delta / Brackish Coast**. Existing Starfen and Great Mere remain freshwater/wetland environments; brackish and tidal conditions occur farther downstream.

### Redstone and Emberwash drainage

Redstone remains comparatively dry upland country.

Some runoff drains east toward Coppergrass/Starfen tributaries. Southern drainage increasingly becomes seasonal washes and internally drained basins through Emberwash, supporting badlands, salt flats, intermittent watercourses, and preparation-sensitive travel.

## 6. Climate skeleton

The Central Continent occupies broadly temperate latitudes in the currently authored belt.

Locked climate logic:

- **Elderwood / Crownfields:** temperate humid to subhumid forest and agricultural lowland.
- **Slatewater Foothills:** cooler, wetter orographic transition with mixed woodland and exposed stone.
- **Redstone Reach:** drier continental upland in partial rain shadow, with strong winds and mineral exposure.
- **Coppergrass:** semi-arid temperate steppe transition.
- **Starfen / Great Mere:** low eastern basin re-wetted by lake, river, marsh, and eastern maritime weather.
- **Ironspine:** alpine/highland climate with snow, cold, scree, and strong elevation gradients.
- **Gloamwood / Lethari approaches:** increasingly old, wet western forest backed by mountain precipitation and sheltered fertile basins.
- **Emberwash:** southward aridification from dry upland to badland, salt basin, desert scrub, and eventually true desert approaches.
- **Veyra landmass:** warmer seasonal climate with dry woodland, savanna, broken highlands, river corridors, and more fertile coastal zones.
- **Miri archipelago:** maritime climate with storms, reefs, sheltered islands, and strong coastal moderation.

The world may include magical climate anomalies later, but ordinary geography should explain the baseline before magic is invoked.

## 7. Civilization and capital reservation matrix

| Civilization / polity | Reserved macro position | Capital form | Primary barrier | Ordinary approach | Specialist alternative | Secondary-city reservation |
| --- | --- | --- | --- | --- | --- | --- |
| Thornwall | western Central Belt | mixed political capital | none inside core | road/river | skyferry | regional towns remain future |
| Brasshaven | central dry-upland Belt | mixed republic/industrial capital | none inside core | caravan roads | future specialist transport | mining/industrial satellites |
| Mistmere | eastern wetland Belt | mixed civic/scholarly capital | wetlands/channels | road/ferry | specialist water/air | future delta/coastal city |
| Waymeet | northwestern/north-central interior plateau | neutral cosmopolitan metropolis | distance + upland approaches | Headwater/plateau road chain | existing skyferry | march towns / route forts |
| Lethari heartland | west/northwest beyond Gloamwood and western crescent | fertile-valley ancestral capital | old forest + mountains + wards | guarded pass | guided/warded old route | pass city + orchard/river city |
| Korren heartland | north beyond/under Ironspine | cavern citadel | massif + controlled deep roads | gate city + tunnel/lift | specialist deep/high route | surface gate city + underground river/forge city |
| Miri heartland | eastern archipelago | island/archipelago capital | open sea + reefs/storms | ship | skyferry / specialist navigation | major port + academy/shipyard island |
| Veyra heartland | Southern Landmass | major clan/trade capital | arid approach + southern strait | caravan to port + ship | specialist sea/air route | coastal port + inland caravan city |
| Merfolk/pelagic realm | eastern/southern shelf and reef world | submerged capital | underwater environment | guided aquatic route | breathing/diving magic/equipment | reef gate + shelf city |

Humans remain intentionally widespread and cosmopolitan; no exclusive human ancestral capital is reserved by this pass.

A dark-Lethari/dark-elven concept remains unresolved cultural design and receives no separate geography yet.

Beastfolk political geography remains faction- and people-specific. No species-wide hostile territory is established by this topology lock.

## 8. Capital separation and travel scale

The existing starting capitals remain deliberately compact:

- Thornwall -> Brasshaven: roughly six route-hours;
- Brasshaven -> Mistmere: roughly five route-hours;
- Thornwall -> Mistmere through the current road chain: roughly eleven route-hours.

Ancestral capitals remain larger journeys.

Planning target retained:

- normally **3-8 major travel legs** from the Central Belt;
- roughly **12-30+ route-hours** before special delays;
- at least one barrier that materially changes travel;
- one primary mundane approach;
- one specialist/expensive alternative where the setting supports it.

Distance is not sufficient by itself. A homeland separated by only one open biome is too close even if that biome is numerically large.

## 9. Long-distance route skeleton

These are planning corridors, not runtime route records yet.

### Western ancestral corridor
Thornwall / West Elderwood -> Gloamwood -> western pass country -> Lethari gate city -> Lethari capital.

### Waymeet overland corridor
Thornwall / Timbercross -> Headwater Vale -> central plateau/saddle -> Waymeet Marches -> Waymeet.

The existing skyferry remains the fast specialist bypass.

### Northern/deep corridor
Brasshaven / North Redstone -> Ironspine Lower Pass -> upper highlands -> northern gate city -> shafts/lifts/deep roads -> Korren capital.

### Eastern maritime corridor
Mistmere / Great Mere -> lower outflow -> Starfen Delta / Brackish Coast -> eastern port -> ship lanes -> Miri Archipelago.

### Southern corridor
Brasshaven / South Redstone -> Emberwash -> salt-basin/desert approaches -> southern strait port -> sea crossing -> Veyra northern port -> Veyra capital.

### Pelagic corridor
Eastern coast / reef embassy -> guided shelf route -> submerged settlements -> merfolk capital.

## 10. Approximate extents and cartographic plotting

Future macro maps may record:

- a relative cartographic anchor;
- approximate east-west and north-south extent ranges;
- dominant boundary features;
- neighboring geographic envelopes;
- known/possible route corridors.

Those values are **planning/cartographic metadata** unless a later runtime feature explicitly promotes them.

They must not:

- manufacture route adjacency;
- override authored route distance/time;
- imply every point inside a rectangular bounding box is traversable;
- force local place grids to align with global map axes.

The preferred representation is an irregular envelope with approximate scale, not a tile count.

## 11. Post-lock world-edge priority

Three post-lock geography units are now realized:

- **Headwater Vale — Data 52**: first grounded Timbercross-to-Waymeet corridor leg.
- **Starfen Delta / Brackish Coast — Data 53**: Great Mere outflow, Tideglass Landing, first Eastern Sea coast, explicit open-sea boundary.
- **Gloamwood & Oldbough Refuge — Data 54**: first western old-growth barrier, wagon-limited refuge, deepwood trail, and explicit stop before the western mountain crescent/Lethari realm.

Remaining recommended world-edge order:

1. **Emberwash Badlands** — establishes the northern arid frontier toward the southern strait without collapsing directly into Veyra territory.
2. **Lower Deepvein** — begins the controlled Deep World approach toward the Korren sphere.
3. **Waymeet Marches / central plateau approaches** — continues the overland route after Headwater Vale.
4. **Coppergrass belt extensions** — broadens steppe geography once the larger drainage/climate context is stable.
5. **Drowned Vaults** — remains a specialist submerged-expedition expansion rather than a macro-topology prerequisite.

This ranking is a planning recommendation, not automatic authorization.

## 12. Version and persistence decision for the topology-lock pass

The topology-lock pass itself changed planning/documentation authority only.

At the time of that lock:

- Product was **0.9.100.12**;
- Package was **0.9.100**;
- Account Save was **5**;
- Game State was **14**;
- Data was **51**;
- Benchmark was **3**.

That pass introduced no runtime state family, place, route, map, item, ecology record, or save contract.

## 13. Subsequent realization status

Headwater Vale subsequently realized the first Waymeet-corridor leg as **Product 0.9.100.13 / Data 52** while keeping **Game State 14**.

Canonical realized sequence:

```text
Timbercross Landing
  -> Headwater Lower Vale
  -> Headwater Warden Lodge [wagon limit]
  -> Headwater Upper Vale [walk/mount trail]
  -> future plateau/saddle [not yet routed]
  -> future Waymeet Marches
  -> Waymeet
```

The unfinished northern edge is intentional. Data 52 does not manufacture a route to the plateau or Waymeet simply because the macro envelopes are adjacent.

Starfen Delta subsequently realized the eastern drainage transition as **Product 0.9.100.14 / Data 53**:

```text
Great Mere / Merewatch
  -> Starfen Lower Delta
  -> Tideglass Landing
  -> Starfen Brackish Coast
  -> Eastern Sea [not walkable]
  -> future maritime/Miri routes [not yet authored]
```

This preserves the same doctrine: reaching the coastline does not manufacture an ocean route. Miri and pelagic long-distance access remain future authored connections.

Gloamwood subsequently realized the first western ancestral-corridor barrier as **Product 0.9.100.15 / Data 54**:

```text
West Elderwood
  -> Gloamwood Verge
  -> Oldbough Refuge [wagon limit]
  -> Gloamwood Deep [walk/mount trail]
  -> western mountain crescent [not yet routed]
  -> guarded Lethari pass/cities [not yet authored]
  -> Lethari heartland [not yet authored]
```

This again preserves route authority over envelope adjacency. Gloamwood Deep has no ordinary route westward; the western crescent, guarded pass, and Lethari settlements remain separate future bounded units.
