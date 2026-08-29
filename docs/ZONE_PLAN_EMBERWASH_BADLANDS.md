# Zone Plan — Emberwash Badlands

Status: **AUTHORIZED bounded implementation plan.** This plan may add Emberwash runtime content, but it does not authorize the farther desert approaches, southern strait, Veyra ports, or Veyra heartland.

## 1. Macro role and hard boundary

Emberwash is the **northern arid frontier south of South Redstone Reach**.

Canonical progression:

```text
Brasshaven / South Redstone Reach
  -> Emberwash North Wash
  -> Cinderwell Station
  -> Saltpan Verge
  -> farther salt-basin / true-desert approaches [not yet routed]
  -> southern strait port [not yet authored]
  -> sea crossing [not yet authored]
  -> Veyra northern port / heartland [not yet authored]
```

This pass must not collapse Emberwash directly into Veyra territory.

## 2. Places

### Emberwash North Wash
- id: `emberwash-north-wash`
- type: wilderness
- danger: 2
- role: transition from Redstone dry upland into eroded badland gullies, rocky grass, flash-flood channels, thorn scrub, and exposed gypsum/ochre.
- ordinary route corridor supports wagons and caravans, but side canyons and wash walls are not implicit exits.

### Cinderwell Station
- id: `cinderwell-station`
- type: travel hub
- danger: 0
- role: small fortified caravan well and route station, not a town or southern gate city.
- services: water/cistern access, exchange, route guidance, shade/rest, field repairs, pack-animal care.
- **wagon limit** for this pass.

### Saltpan Verge
- id: `emberwash-saltpan-verge`
- type: wilderness
- danger: 3
- role: first salt-basin/desert-scrub edge, with glare, windblown dust, unstable crust, dry channels, sparse browse, and preparation-sensitive travel.
- no ordinary route leaves its southern edge in this pass.

## 3. Routes

### Cinderwell Caravan Road
`south-redstone-reach -> emberwash-north-wash -> cinderwell-station`

Allowed modes:
- walk
- mount
- wagon
- caravan

Hazards:
- heat
- dust
- flash-flood wash
- loose stone
- scarce shade

### Saltpan Foretrail
`cinderwell-station -> emberwash-saltpan-verge`

Allowed modes:
- walk
- mount
- caravan

Wagons stop at Cinderwell because broken gullies, soft wash beds, and salt crust make the foretrail unsuitable for ordinary wagon traffic.

Hazards:
- heat
- salt glare
- dust wind
- soft crust
- scarce water

No route in this pass continues to a southern strait port, Veyra settlement, or Veyra homeland.

## 4. Ecology target

Eight Emberwash species/populations:

Reused canonical families:
1. Ashhorn Ridge Ibex — Ridge Ibex family
2. Copperback Sun Lizard — Lizard family
3. Redtail Scorpion — Scorpion family
4. Saltwind Vulture — Vulture family

New families:
5. Dust Hare
6. Washrunner Quail
7. Glasswing Beetle
8. Saltbrush Tortoise

Behavior remains passive, wary, or territorial. This pass does **not** manufacture hostile encounter templates merely to create loot.

## 5. Gathering and raw resources

Seven exact-provenance raw resources:

1. Emberpod
2. Cinder Pear
3. Desert Sage
4. Cinderbrush Fiber
5. Salt Crust
6. Red Ochre
7. Gypsum Nodule

Each raw must have intentional downstream production demand.

## 6. Production and outputs

Ten transformations/outputs:

1. grind Emberpod Meal
2. bake Emberpod Trail Cakes
3. dry Cinder Pear Strips
4. dry Desert Sage
5. twist Cinderbrush Cord
6. refine Caravan Salt
7. grind Red Ochre Pigment
8. burn Gypsum Plaster
9. assemble a Dustwrap Repair Kit using canonical Crownfields linen
10. mix Cistern Patch Compound for route/well maintenance

Required workstation coverage:
- kitchen
- workshop

## 7. Food-safety contract

Use practical fantasy-era preparation metadata:

- raw Emberpod: process required; grind/cook before ordinary eating.
- raw Cinder Pear: direct-ready only after peeling and removing spines.
- Emberpod Trail Cakes: direct-ready.
- Dried Cinder Pear Strips: direct-ready.

No modern technical language is required in player-facing notes.

## 8. Cinderwell service layer

Three staff:
- field factor / exchange keeper
- caravan warden / route guide
- station keeper / cistern and hearth steward

Two ordinary daytime schedules:
- exchange
- warden desk

POIs:
- Cinderwell Exchange
- Caravan Warden Desk
- Cistern Workyard
- Shade Hearth / common bunkhouse

Shop stock should emphasize prepared trail food, salt, field repair goods, and desert-route necessities.

## 9. Pack-v2 ownership

Two packs:
1. `pack-emberwash-badlands-ecology`
2. `pack-emberwash-cinderwell-station`

The station pack depends on the ecology pack plus existing Redstone/Crownfields foundation content needed by its recipes.

## 10. Persistence decision

Expected: **Game State remains 14**.

This pass should use existing place, route, ecology, gathering, production, schedule, shop, and content-pack state families. Environmental preparation is represented through authored route/place hazards and services, not a new durable survival-meter family.

## 11. Explicit exclusions

Deferred:
- farther salt basin
- true desert
- southern strait port
- sea crossing
- Veyra northern port
- Veyra heartland/capital
- new survival meters
- new weather persistence
- mandatory hostile wildlife
- southern gate-city politics

## 12. Validation target

Add a focused Emberwash flow guard covering:

- reciprocal map/place integrity;
- wagon access ending at Cinderwell;
- Saltpan Verge having no onward southern route;
- exact ecology/source/resource provenance;
- no forced hostile encounter templates for ordinary wildlife;
- practical food-safety metadata;
- production demand for all seven raws;
- kitchen/workshop coverage;
- two-pack ownership/dependencies;
- explicit absence of Veyra/strait onward routes.
