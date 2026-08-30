# Lower Deepvein Zone Plan

Status: **AUTHORIZED BOUNDED WORLD-EDGE UNIT.** Planning authority for the next Deep World approach pass. This plan does not authorize a Korren gate city, deep-road network, or ancestral capital.

## 1. Macro role

Lower Deepvein extends the existing Deepvein Mine downward into the first controlled Deep World frontier while preserving the macro separation between Brasshaven mining country and the Korren ancestral realm.

Canonical bounded sequence:

```text
Brasshaven Delvers’ Ward
  -> Deepvein Mine
  -> Deepvein Lower Decline
  -> Lantern Sump Station
  -> Echoing Shelf
  -> farther deep roads / northern gate country [not routed]
  -> Korren trade/gate settlements [not authored]
  -> Korren ancestral citadel [not authored]
```

Lower Deepvein remains a **Brasshaven mining frontier**, not a Korren homeland shortcut.

## 2. Places

### Deepvein Lower Decline
- id: `deepvein-lower-decline`
- type: dungeon
- danger: 3
- nation: Brasshaven
- role: maintained-to-abandoned transition of hand-cut declines, ore galleries, seep channels, timbered ledges, and natural cave openings below the existing mine.

### Lantern Sump Station
- id: `lantern-sump-station`
- type: travel hub
- danger: 0
- nation: Brasshaven
- role: small staffed underground delver station with exchange counter, route/survey desk, lamp-and-repair workbay, common hearth, water cistern, bunks, and first-aid stores.
- it is a frontier work station, not a town, gate city, or Korren settlement.

### Echoing Shelf
- id: `lower-deepvein-echoing-shelf`
- type: dungeon
- danger: 4
- nation: null
- role: broad natural cavern shelf with black pools, mineral curtains, fungus banks, collapsed workings, and marked foot passages.
- no ordinary route continues beyond the authored shelf in this pass.

## 3. Routes

### Lower Deepvein Haulage Decline
- id: `route-lower-deepvein-haulage-decline`
- mode: walk only
- Deepvein Mine -> Deepvein Lower Decline -> Lantern Sump Station
- planned distance: 4,500 yalms total
- planned travel time: 3,300 seconds total
- hazards: darkness, steep grade, slick stone, timbered galleries, seep crossings, loose rock
- this is a tunnel/decline route; no surface-edge walking is implied.

### Echoing Shelf Traverse
- id: `route-lower-deepvein-echoing-shelf`
- mode: walk only
- Lantern Sump Station -> Echoing Shelf
- planned distance: 3,500 yalms
- planned travel time: 2,700 seconds
- hazards: darkness, narrow ledges, black-water pools, low ceilings, broken galleries, loose stone

No lift, ventilation, mine-certification, quest, or permit state family is added by this pass. The maintained tunnel itself is the bounded access solution.

## 4. Ecology

Eight non-manufactured-hostility species/populations:

Reused family lines:
- Sump Sootwing Bat — Bat family
- Lower Deepvein Glass Salamander — Salamander family
- Blind Sump Crab — Crab family
- Pale Threadspider — Spider family
- Ashwing Lantern Moth — Lantern Moth family

New families:
- Threadfin Cavefish
- Salt Springtail
- Slateback Cave Isopod

Behavior remains passive, wary, or naturally territorial. No new Lower Deepvein wildlife is made generically hostile merely to create loot.

## 5. Exact-provenance resources

Seven raw resources and sources:

1. Lower Deepvein Lampcap — Lampcap Shelf
2. Threadfin Cavefish — Blackpool Threadfin Shoal
3. Blind Sump Crab — Sump Crab Trap Bed
4. Glowmoss Fiber — Glowmoss Seep Wall
5. Cave Salt Bloom — Salt Bloom Gallery
6. Deepvein Quartz Cluster — Quartz Rib
7. Sump Clay — Sump Clay Bank

The existing Deepvein lead and silver sources remain canonical specialty deposits and are not duplicated by this pass.

## 6. Production and sinks

Ten transformations / ten outputs:

1. Lampcap -> Cooked Lampcaps
2. Threadfin Cavefish -> Cleaned Threadfin Fillet
3. Cleaned Threadfin Fillet + refined cave salt -> Salt-Baked Threadfin Ration
4. Blind Sump Crab -> Boiled Blind Sump Crab
5. Glowmoss Fiber -> Glowmoss Wick Cord
6. Cave Salt Bloom -> Refined Deepvein Cave Salt
7. Deepvein Quartz Cluster -> Polished Deepvein Quartz
8. Sump Clay -> Fired Sump-Clay Lamp Cup
9. lamp cup + wick cord + polished quartz -> Deepvein Reflector Lamp Kit
10. glowmoss fiber + sump clay -> Deepvein Gallery Seep Packing

Required workstation coverage:
- kitchen
- workshop

Every new raw must have at least one intentional production demand.

## 7. Food safety

Player-facing guidance remains practical late-medieval/fantasy knowledge:

- raw Lampcap: process required; fresh gills are irritating and should be cooked before eating;
- raw Threadfin Cavefish: process required; clean and cook before eating;
- raw Blind Sump Crab: process required; clean and boil thoroughly;
- cleaned Threadfin remains raw until cooked;
- Cooked Lampcaps, Salt-Baked Threadfin, and Boiled Blind Sump Crab are direct-ready;
- non-food mineral/fiber/clay goods remain explicitly non-food where metadata is present.

## 8. Lantern Sump service layer

Planned POIs:
- `poi-lantern-sump-exchange`
- `poi-lantern-sump-survey-desk`
- `poi-lantern-sump-lampworks`
- `poi-lantern-sump-hearth`

Planned NPCs:
- Ressa Kell — Lower Deepvein Factor
- Borin Vale — Deepvein Survey Warden
- Hessa Rusk — Lantern Sump Station Keeper

Planned schedules:
- Ressa: 06:00–16:00
- Borin: 07:00–18:00

The live exchange may stock water and field tools in addition to prepared local goods. Pack-v2 stock ownership should include only canonical Pack-v2 items.

## 9. Pack-v2 ownership

Planned packs:
- `pack-lower-deepvein-ecology`
- `pack-lower-deepvein-lantern-sump`

The station pack should depend on:
- shared foundation;
- Redstone opening/ecology;
- material foundations where required;
- Lower Deepvein ecology.

## 10. Persistence and boundary decision

Expected version decision:
- Product increment for promoted bounded content;
- Data increment;
- Game State remains **14** unless implementation unexpectedly requires a new durable serialized family.

Explicit exclusions:
- no survival/oxygen meter;
- no dynamic ventilation state;
- no repaired-lift state family;
- no mining-certification state;
- no Korren border/permit state;
- no farther deep-road route;
- no Korren gate city;
- no Korren ancestral capital.
