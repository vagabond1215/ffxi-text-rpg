# Zone Profile — Starfen Delta / Brackish Coast

Status: **Data 53 canonical regional profile.**

## Role

Starfen Delta / Brackish Coast realizes the Great Mere's locked eastward freshwater outflow and the first true Eastern Sea coastline.

Canonical sequence:

```text
Great Mere / Merewatch
  -> Mere-Delta Waterway
  -> Starfen Lower Delta
  -> Tideglass Landing
  -> Starfen Brackish Coast
  -> Eastern Sea [not walkable; no authored Miri route]
```

The zone is a freshwater-to-brackish transition, not a retroactive conversion of Starfen or Great Mere into saltwater environments.

## Places

### Starfen Lower Delta

Danger 2 wilderness.

- broad distributary channels;
- reed islands and natural levees;
- muddy cutbanks and drift lines;
- water becoming weakly brackish downstream;
- marked levees support walk/mount travel;
- boat channels remain the dependable through-route.

### Tideglass Landing

Danger 0 village-scale travel/service locality.

Tideglass is intentionally a small pilot/fishery/salt-work port, not another capital or major metropolis.

Functions:
- delta exchange;
- pilot house and tide/shoal notices;
- packet-boat stop;
- smokehouse and cook shed;
- net/packing/matting repair;
- shell-lime and salt cleaning;
- simple crew lodging.

### Starfen Brackish Coast

Danger 3 coastal wilderness.

- salt marsh;
- tidal creeks;
- mudflats;
- eelgrass and kelp wrack;
- shell beds;
- sandbars and exposed strand;
- outer nearshore wildlife.

The open Eastern Sea is explicitly not a walkable local edge.

## Route contract

### East Fen Delta Levee

`route-east-starfen-lower-delta-levee`

- East Starfen -> Lower Delta;
- walk / mount;
- 8,000 yalms;
- 3,200 seconds;
- reed-channel, soft-levee, seasonal-flood, fen-weather hazards.

### Mere-Delta Waterway

`route-great-mere-delta-waterway`

- Merewatch -> Lower Delta -> Tideglass;
- ferry authority;
- 20,000 yalms total;
- 6,000 seconds total;
- lake weather, shallow bars, river current, distributary channels, mud banks and tide-turn hazards.

Scheduled service:
- `service-mere-delta-packet`;
- Merewatch -> Lower Delta -> Tideglass;
- Lower Delta is a real field stop rather than an invisible pass-through.

### Tideglass Coast Track

`route-tideglass-brackish-coast-track`

- Tideglass -> Brackish Coast;
- walk / mount;
- 6,000 yalms;
- 2,400 seconds;
- tidal cuts, mudflat, saltwind and high-water hazards.

No open-ocean route, Miri route, or generalized ship mode is introduced.

## Ecology

Eight canonical species/populations:

- Brackish Reed Eel;
- Saltflat Mud Crab;
- Grey Delta Heron;
- Saltmarsh Duck;
- Tideglass Oyster;
- Pale Shoal Ray;
- Greyback Seal;
- Windward Gull.

Four established families are reused:
- Reed Eel;
- Crab;
- Mire Heron;
- Waterfowl.

Four coastal families are added:
- Tide Oyster;
- Shoal Ray;
- Coast Seal;
- Coast Gull.

All remain ordinary passive/wary/territorial ecology in this tranche. None receives an encounter template merely to manufacture drops.

## Resource sources

Seven exact-provenance sources:

1. Brackish Eel Channel -> Brackish Reed Eel;
2. Saltflat Mud Crab Ground -> Saltflat Mud Crab;
3. Tideglass Oyster Bed -> Tideglass Oyster;
4. Coast Kelp Wrack -> Coast Kelp;
5. Marsh Samphire Bed -> Marsh Samphire;
6. Saltmarsh Reed Bed -> Saltmarsh Reed;
7. Tidepan Salt Crust -> Tidepan Salt Crust.

Every new raw resource participates in production demand.

## Production

Ten transformations produce eleven outputs:

1. clean eel -> Cleaned Brackish Eel;
2. smoke eel with Starfen Marsh Willow -> Willow-Smoked Brackish Eel;
3. boil mud crab -> Boiled Saltflat Mud Crab;
4. shuck oysters -> Oyster Meat + Oyster Shell;
5. roast oyster meat -> Roasted Tide Oysters;
6. burn oyster shell -> Coastal Shell Lime;
7. dry kelp -> Dried Coast Kelp;
8. refine tidepan crust -> Tideglass Sea Salt;
9. weave saltmarsh reed + hemp twine -> Woven Saltmarsh Matting;
10. pickle samphire + sea salt + Crownfields cider vinegar -> Pickled Marsh Samphire.

Cross-regional inputs deliberately reuse established trade substrates rather than duplicating them locally.

Canonical raw-resource production utilization after this tranche is **96/107**. Luxury utilization remains **14/14**.

## Food safety

Internal metadata remains explicit.

World-facing treatment uses practical fantasy-era knowledge:

- raw eel, crab and oysters require cleaning/cooking and can cause sickness if eaten raw;
- shucked oyster meat remains raw until cooked;
- smoked eel, boiled crab and roasted oysters are ready to eat;
- young clean kelp and samphire may be eaten after rinsing;
- drying/pickling provides keeping forms.

No ordinary description assumes modern germ theory.

## People and services

Persistent staff:

- Lessa Venn — Tideglass Delta Factor;
- Orin Cade — Delta Pilot;
- Maela Thorne — Tideglass Smokehouse Keeper.

Schedules:
- Lessa exchange: 06:00–16:00;
- Orin pilot desk: 05:00–18:00.

Workstation exposure:
- smokehouse -> kitchen + workshop;
- tideworks -> workshop.

## Pack ownership

`pack-starfen-delta-brackish-ecology` owns:
- 2 wilderness places;
- 4 new ecology families;
- 8 species;
- 8 populations;
- 7 gathering sources;
- 7 raw resources.

`pack-starfen-delta-tideglass` owns:
- Tideglass Landing;
- 3 routes;
- 1 transport service;
- 3 NPCs;
- 2 schedules;
- 1 shop;
- 11 production outputs;
- 10 recipes.

Canonical catalogs remain definition authority.

## Persistence decision

Game State remains **14**.

Data 53 composes existing:
- place/map/route/transport;
- ecology/population;
- gathering;
- inventory/provenance;
- production/work/workstations;
- commerce;
- NPC schedules;
- Pack v2.

No durable tide clock, ocean-state family, ship-state authority, or new fishing persistence family is introduced.

## Validation

Implementation freeze:
- SHA `c515588c404c0f80a724d767b74535f1e39ae166`;
- Check #1491 / run `33267789356`;
- **776/776 tests**;
- Repository Audit, Census, Benchmark 3, Benchmark Sample green.

Promoted Data 53 head:
- SHA `8f968155d092431b0a3314d38f4d890b0c87f599`;
- Check #1493 / run `33267935109`;
- **776/776 tests**;
- Repository Audit, Census, Benchmark 3, Benchmark Sample green.

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
capabilities/training definitions        44
NPC schedules                            19
regional/shared content packs            25
pack-owned records                      927
runtime seed NPCs                        34
runtime seed enemies                     17
```

Mechanics-scale gate remains NOT READY. Companions remain the largest relative gap.
