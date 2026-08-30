# Zone Plan — Waymeet Marches / Central Plateau Approaches

Status: **AUTHORIZED BOUNDED WORLD-EDGE UNIT.** Planning authority for the next overland Waymeet-corridor pass. This plan does not authorize Waymeet metropolis, its outer wards, or a direct road from Headwater Vale to the city.

## 1. Macro role

This pass continues the grounded overland route north of Headwater Vale into the central plateau/saddle country and establishes the first southern Waymeet-march approach without collapsing the remaining journey into Waymeet itself.

Canonical bounded sequence:

```text
Timbercross
  -> Headwater Vale
  -> Windscar Saddle
  -> Cairnward Relay
  -> Waymeet South Marches
  -> farther Waymeet Marches [not routed]
  -> Waymeet [not authored]
```

The existing Thornwall -> Waymeet skyferry remains the long-distance bypass. The new overland corridor is route-owned and physically constrained; touching macro envelopes do not create travel edges.

## 2. Geographic character

The bounded leg crosses three linked terrain roles:

1. **Windscar Saddle** — high, exposed saddle country above the Headwater Upper Vale, with broken heather, sedge benches, shallow tarns, wind-thrown stone, and steep ravines on either side.
2. **Cairnward Relay** — a sparse service node on the plateau shoulder where pack traffic over the saddle transfers to carts and wagons using the easier march road.
3. **Waymeet South Marches** — broad cool plateau grassland cut by shallow burns, peat-dark hollows, low drumlin-like rises, old boundary cairns, and maintained road embankments leading toward the still-unrealized inner marches.

Drainage continues away from the saddle through small plateau burns rather than creating a new major river basin. The Headwater Vale remains the southward runoff corridor; no contradictory east/west drainage authority is introduced.

## 3. Places

### Windscar Saddle
- id: `windscar-saddle`
- type: wilderness
- danger: 3
- nation: null
- role: exposed high saddle and the only authored ordinary crossing from Headwater Upper Vale onto this plateau shoulder.
- wagon access: **no**; the grade, switchbacks, stone steps, and narrow ravine crossings limit the southern approach to walking, mounts, and pack caravans.

### Cairnward Relay
- id: `cairnward-relay`
- type: travel hub
- danger: 0
- nation: null
- role: small neutral road-service relay with a field exchange, route desk, cartwright/work shelter, common hearth, cistern, feed shed, hitching yard, and bunks.
- it is a relay/transfer station, not a village, march town, Waymeet suburb, or political gate.

### Waymeet South Marches
- id: `waymeet-south-marches`
- type: wilderness
- danger: 2
- nation: null
- role: first open southern march country beyond the relay, suitable for wagon movement on the maintained road but still outside Waymeet's urban sphere.
- no authored route leaves the northern edge in this pass.

## 4. Routes

### Headwater–Cairnward Pack Road
- id: `route-headwater-cairnward-pack-road`
- Headwater Upper Vale -> Windscar Saddle -> Cairnward Relay;
- modes: walk, mount, caravan;
- wagons excluded;
- hazards: steep switchbacks, exposed crosswind, loose stone, ravine crossing, fog, winter icing, shallow ford/tarn runoff;
- route geometry, not local map edges, owns the saddle crossing.

### Cairnward March Road
- id: `route-cairnward-south-march-road`
- Cairnward Relay -> Waymeet South Marches;
- modes: walk, mount, wagon, caravan;
- hazards: crosswind, boggy verge, shallow burn crossings, wheel-rut mud, low visibility in plateau rain, exposed road;
- the route stops in the South Marches. There is **no** Data 57 road to Waymeet or to any inner-march settlement.

Travel-time intent: this pair should add a meaningful multi-hour overland leg after Headwater Vale, preserving the fiction that Waymeet is reached through multiple regions rather than a one-zone northern walk.

## 5. Habitation and economic function

Cairnward Relay exists because the saddle creates a real logistics break:

- southern wagons terminate below the Headwater upper trail;
- pack animals and mounted traffic cross Windscar Saddle;
- plateau-side carts and wagons can collect freight at Cairnward;
- the relay maintains road tools, wheel/axle repair, feed, water, shelter, and route information.

Do not add a major settlement. Persistent staff should remain a minimal road-service crew justified by the transfer function.

Planned NPC roles:
- relay keeper / factor;
- plateau route warden;
- cartwright / farrier-equivalent road mechanic.

Two schedules are sufficient unless implementation evidence requires more.

## 6. Ecology and resources

Favor cool upland/plateau continuity rather than inventing an isolated biome.

Reuse established families where appropriate, especially:
- grouse;
- fox;
- marmot;
- mountain eagle;
- red deer or another already-established deer family when ecologically appropriate.

New families should be added only where the plateau needs a genuinely distinct niche.

Target ecology: roughly 7–8 species/populations across:
- exposed saddle grass/heather;
- shallow tarn/burn margins;
- plateau grassland;
- peat hollows;
- road-verge/cairn habitat.

Ordinary wildlife remains passive, wary, or naturally territorial. Do not add encounter templates merely to manufacture drops.

Target exact-provenance raws: roughly 7 sources/resources, emphasizing materials with real local value:
- upland oatgrass or seed grain gathered from semi-wild road verge;
- heather/ling or plateau aromatic;
- bog myrtle / bitter shrub for practical craft or preservation use;
- rush/sedge fiber;
- peat/turf fuel or clay/roadstone where source semantics support it;
- edible upland berry or root;
- burn/tarn fish only if the hydrology and existing fishing model justify it.

Avoid duplicating Headwater alder/willow/trout or Ironspine alpine minerals merely to increase counts.

## 7. Production and sinks

Every new raw must have at least one intentional production demand.

Target roughly 10 connected transformations/outputs using existing workstation families such as:
- kitchen;
- workshop;
- woodshop where justified.

Preferred local outputs:
- travel ration / cooked grain or berry food;
- dried aromatic or preservation bundle;
- woven rush/sedge matting or pack padding;
- peat/turf fuel bundle;
- road-mender packing / wheel-rut fascine material;
- cart grease, axle wrap, weatherproofing, or similar logistics consumable if ingredients support it;
- one or two durable trade goods that make the relay economically useful without inventing a new profession system.

New raws may combine with existing canonical items when that creates a more plausible regional production graph.

## 8. Food safety

Food-capable raws require explicit consumption metadata.

World-facing guidance must remain practical late-medieval/fantasy knowledge:
- raw fish or game: clean and cook before eating;
- bitter or irritating herbs/roots: boil, steep, parch, or otherwise prepare as appropriate;
- clean berries/greens may be direct-ready only where genuinely plausible;
- prepared rations/meals should be explicitly direct-ready.

Do not use modern microbiology prose in ordinary player-facing descriptions.

## 9. Service layer

Planned Cairnward POIs:
- `poi-cairnward-exchange`
- `poi-cairnward-route-desk`
- `poi-cairnward-cart-shelter`
- `poi-cairnward-hearth`

The exchange may stock water, feed/field supplies, and a small number of prepared local goods. Pack-v2 ownership should include only canonical Pack-v2 items.

## 10. Pack-v2 ownership

Planned packs:
- `pack-waymeet-marches-ecology`
- `pack-waymeet-marches-cairnward`

The Cairnward pack should depend on:
- shared foundation;
- Headwater Vale;
- material foundations where required;
- Waymeet Marches ecology.

Canonical catalogs remain definition authority.

## 11. Persistence and version decision

Expected promoted version:
- Product: **0.9.100.18**
- Package: **0.9.100**
- Data: **57**
- Game State: **14**
- Benchmark: **3**

No new durable serialized family is expected. This pass should compose existing place/map/route, ecology/population, gathering/resource recovery, inventory/provenance, production/work/workstations, commerce, NPC schedule, and Pack-v2 authorities.

## 12. Explicit exclusions

This bounded unit does **not** implement:
- Waymeet metropolis;
- Waymeet outer wards/suburbs;
- a Waymeet city gate;
- an inner-marches town;
- a route from South Marches directly into Waymeet;
- a new political-border or entry-permit state;
- a caravan ownership/logistics state family;
- dynamic weather survival meters;
- a new global macro-coordinate schema;
- direct adjacency from Headwater Vale to Waymeet.

Any later continuation must author a real next march route/approach rather than treating envelope proximity as traversability.

## 13. Validation and promotion contract

Focused player-flow coverage must verify:
- the Headwater -> saddle -> relay -> South Marches route chain;
- wagon prohibition over Windscar Saddle and wagon availability from Cairnward northward;
- no ordinary route from South Marches to Waymeet;
- ecology/resource registry validation and exact provenance;
- practical food-safety metadata;
- every new raw has production demand;
- Cairnward workstation exposure and Pack-v2 ownership.

Full validation:

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Promotion requires an exact implementation-freeze SHA with hosted **Check** green. Only measured census results may update deterministic census guards or continuity metrics.
