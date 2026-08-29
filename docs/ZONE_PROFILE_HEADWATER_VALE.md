# Zone Profile — Headwater Vale

Status: **Data 52 canonical regional profile.**

## Role

Headwater Vale is the cool western watershed above Timbercross Landing and the first grounded overland leg toward the future Waymeet plateau route.

It is not a city expansion and does not yet connect all the way to Waymeet.

The canonical sequence is:

```text
Timbercross Landing
  -> Headwater River Road
  -> Headwater Lower Vale
  -> Headwater Warden Lodge [wagon limit]
  -> Headwater Upper Trail [walk / mount]
  -> Headwater Upper Vale
  -> no authored onward route yet
```

The northern rim of the Upper Vale points toward future central plateau / Waymeet Marches geography. Its proximity on a conceptual map does not create a traversable edge.

## Geography and access

### Headwater Lower Vale

Danger 2 wilderness.

Character:
- cool young river;
- clear gravel runs and deep pools;
- alder terraces and willow scrub;
- mixed forest;
- old timber tracks;
- bridge and ford bottlenecks.

The maintained road and marked crossings are travel authority. Steep wooded side slopes are not implicit exits.

### Headwater Warden Lodge

Danger 0 travel/service locality.

Functions:
- river factor and regional exchange;
- warden desk;
- common hearth and simple bunks;
- smokehouse;
- woodworking and bridge-repair yard;
- tanning racks/tubs;
- sheltered animal yard.

The lodge is intentionally small. It is a road/river work station, not a new urban center.

It is also the wagon limit for the current route.

### Headwater Upper Vale

Danger 3 wilderness.

Character:
- meadow benches;
- cold tributaries;
- deer lawns;
- mossy mixed forest;
- broken river cliffs;
- spring-flood channels;
- higher terrain below the central plateau.

The Upper Trail permits walk/mount travel only. Wagons stop at the lodge.

## Route contract

### Headwater River Road

`route-timbercross-headwater-road`

- Timbercross -> Lower Vale -> Warden Lodge;
- walk / mount / wagon;
- 12,000 yalms authored total distance;
- bridge/ford, fog, mud, fallen timber, river-weather and grade hazards.

### Headwater Upper Trail

`route-headwater-upper-trail`

- Warden Lodge -> Upper Vale;
- walk / mount only;
- 7,000 yalms;
- rocky ford, spring flood, steep side ridges and fallen timber.

No direct route to Waymeet or Waymeet Marches exists in Data 52.

## Ecology

Canonical Headwater species:

- Headwater Red Deer — wary, herd animal, population-backed deliberate hunt;
- Coldstream Trout — passive freshwater fish, recovered through fishing;
- Headwater River Otter — wary river predator/scavenger niche;
- Vale Embercoat Fox — wary forest/meadow-edge predator;
- Headwater Moss Owl — territorial nocturnal forest/river-cliff bird;
- Headwater Moss-Shell Turtle — passive basking river species.

Only Red Deer currently has an encounter template. Passive ecological presence is not converted into generic aggression merely to force drops.

## Gathering and body resources

Gathering sources:

- Coldstream Trout Run -> Coldstream Trout;
- Spring Cress Bank -> Headwater Spring Cress;
- Upland Meadowsweet Slope -> Headwater Meadowsweet;
- River Alder Bark Coppice -> River Alder Bark;
- River Willow Withe Stand -> River Willow Withe;
- Headwater Alder Stand -> Headwater Alder Timber.

Population-backed Red Deer body recovery:

- skin -> Headwater Red Deer Hide;
- butcher -> Fresh Headwater Venison;
- butcher -> Headwater Red Deer Antler.

All resources use exact source/place/action provenance.

## Production graph

Ten transformations / ten outputs:

1. clean and dress Coldstream Trout -> Cleaned Coldstream Trout;
2. trout + spring cress -> Headwater Trout-Cress Stew;
3. trout + alder -> Alder-Smoked Coldstream Trout;
4. meadowsweet -> Dried Headwater Meadowsweet;
5. deer hide + alder bark -> Alder-Tanned Deer Leather;
6. deer antler -> Carved Antler Toggle Set;
7. alder timber -> Headwater Alder Board;
8. willow withe + hemp cord + antler toggles -> Headwater Willow Creel;
9. venison + alder -> Alder-Smoked Headwater Venison;
10. alder boards + hemp rope + iron nail set -> Headwater Bridge Repair Kit.

Cross-regional common-component inputs deliberately reuse the Data 50 material substrate:
- hemp cord;
- hemp rope;
- iron nail sets.

Every new Headwater raw/body resource participates in production demand.

Canonical raw-resource production utilization after the tranche is **89/100**. Luxury utilization remains **14/14**.

## Food-safety framing

Internal consumption metadata remains explicit.

World-facing framing remains practical fantasy-era knowledge:

- fresh trout is cleaned and cooked or properly smoked; raw fish can cause sickness;
- fresh venison is roasted, stewed, or smoked; raw game can cause sickness;
- clean young spring cress may be eaten fresh in small amounts;
- prepared stew, smoked trout, and smoked venison are direct-ready food.

No ordinary description assumes germ theory.

## People and services

Persistent lodge staff:

- Elin Marr — Headwater River Factor;
- Torin Ash — Headwater Warden;
- Bessa Reed — Headwater Lodge Keeper.

Schedules:
- Elin exchange: 06:00–17:00;
- Torin warden desk: 07:00–18:00.

Workstation exposure:
- common hearth -> kitchen + workshop;
- riverworks yard -> woodshop + tannery + workshop.

## Pack ownership

`pack-headwater-vale-ecology` owns:
- Lower Vale + Upper Vale regional placement;
- 2 ecology families;
- 6 species;
- 6 populations;
- 6 gathering sources;
- 9 raw/body resource items.

`pack-headwater-vale` owns:
- Warden Lodge;
- 2 routes;
- 3 NPCs;
- 2 schedules;
- 1 regional shop;
- 10 production items;
- 10 recipes/processes.

Packs own placement/dependency metadata only. Existing canonical catalogs remain definition authority.

## Persistence decision

Game State remains **14**.

The tranche composes existing:
- places/maps/routes;
- ecology/population;
- population-backed encounter discovery;
- battle/body recovery;
- gathering;
- inventory/provenance;
- production/work/workstation;
- shops;
- NPC schedules;
- Pack v2.

No new durable player/world state family is introduced.

## Validation checkpoint

Implementation freeze:

- SHA: `aa39347a0faa754690a194d926262256e92027f1`;
- Check #1476 / run `33264692343`;
- Repository Audit PASS;
- **770/770 tests**;
- Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS.

Validated implementation census:

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
capabilities/training definitions        44
NPC schedules                            17
regional/shared content packs            23
pack-owned records                      859
runtime seed NPCs                        31
runtime seed enemies                     17
```

Mechanics-scale gate remains NOT READY. Companions remain the largest relative gap.
