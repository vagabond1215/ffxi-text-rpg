# Zone Profile — Gloamwood & Oldbough Refuge

Status: **Data 54 canonical regional profile.**

## Role

Gloamwood realizes the first true old-growth barrier on the western ancestral corridor without opening the Lethari homeland or the western mountain crescent.

```text
West Elderwood
  -> Oldgrowth Cart Track
  -> Gloamwood Verge
  -> Oldbough Refuge [wagon limit]
  -> Deepwood Forester Trail
  -> Gloamwood Deep
  -> western mountain crescent [not yet authored]
  -> guarded Lethari pass/cities [not yet authored]
  -> Lethari ancestral heartland [not yet authored]
```

The zone is a wet, difficult transition and travel barrier, not a disguised homeland settlement chain.

## Places

### Gloamwood Verge

Danger 2 wilderness.

- immense root plates and mossed trunks;
- wet hollows, fern brakes, and abandoned cutting lanes;
- old-growth transition beyond Thornwall's maintained forest;
- one maintained cart corridor;
- broad forest adjacency does not imply unrestricted wagon travel.

### Oldbough Refuge

Danger 0 travel/service locality.

Oldbough is a small boundary-forester refuge and work station, not a town, pass fortress, or ancestral gate city.

Functions:
- field exchange;
- forester route desk;
- common hearth and drying support;
- timber/resin/route-repair workyard;
- simple shelter and safe-rest fiction;
- last dependable wagon turnaround.

### Gloamwood Deep

Danger 3 wilderness.

Ancient wet forest of blackwater pools, flooded gullies, ravines, deadfall fields, root tangles, dim canopy, and moss-softened stone. Marked foot/mount travel is the only canonical onward travel in Data 54.

There is no authored route onward into the western mountain crescent or Lethari realm.

## Route contract

### Oldgrowth Cart Track

`route-gloamwood-oldgrowth-cart-track`

- West Elderwood -> Gloamwood Verge -> Oldbough Refuge;
- walk / mount / wagon;
- 12,000 yalms total;
- 5,400 seconds total;
- forest weather, root heave, fallen timber, seasonal mud, deep mud, and narrow-track hazards.

Oldbough Refuge is the wagon limit.

### Deepwood Forester Trail

`route-gloamwood-deepwood-forester-trail`

- Oldbough Refuge -> Gloamwood Deep;
- walk / mount;
- 7,000 yalms;
- 3,600 seconds;
- ravines, flooded gullies, deadfall, root tangles, and low visibility.

No route exits Gloamwood Deep westward in Data 54.

## Ecology

Eight canonical species/populations:

- Gloam Barkboar;
- Deep Embercoat Fox;
- Gloam Moss Owl;
- Rain Lantern Moth;
- Rootback Newt;
- Hollow Crow;
- Moss-Shell Land Snail;
- Greywood Deer.

Four established families are reused: Barkboar, Fox, Owl, and Lantern Moth.

Four Gloamwood families are added: Rootback Newt, Hollow Crow, Land Snail, and Greywood Deer.

Behavior remains passive, wary, or naturally territorial. None receives an encounter template merely to manufacture loot. No new hunting/body-recovery authority is introduced.

## Resource sources

Seven exact-provenance sources:

1. Raincap Ring -> Gloam Raincap;
2. Bitterbark Stand -> Gloam Bitterbark;
3. Ironoak Deadfall -> Ironoak Deadfall;
4. Velvet Moss Bank -> Velvet Moss;
5. Nightberry Brake -> Gloam Nightberry;
6. Candle-Resin Grove -> Candle Resin;
7. Bog-Iron Seep -> Bog-Iron Nodule.

Recovery uses existing forage, gather, log, and mine authority. Every new raw has production demand.

## Production

Ten transformations produce ten outputs:

1. cook Gloam Raincaps -> Hearth-Cooked Raincaps;
2. dry Gloam Raincaps -> Dried Gloam Raincaps;
3. steep Bitterbark -> Bitterbark Tannin Liquor;
4. season Ironoak Deadfall -> Seasoned Gloam Ironoak;
5. dry Velvet Moss -> Dry Velvet-Moss Packing;
6. dry Gloam Nightberries -> Dried Nightberries;
7. cook Candle Resin -> Candle-Resin Weather Sealant;
8. wash Bog-Iron Nodules -> Washed Bog-Iron Concentrate;
9. combine seasoned ironoak + sealant -> Oldgrowth Route-Repair Stakes;
10. combine moss packing + tannin liquor + canonical hemp twine -> Gloamwood Field Dressing Roll.

The field-dressing recipe deliberately reuses the established common hemp-twine substrate rather than duplicating local cordage authority.

Canonical raw-resource production utilization is **103/114**. Luxury utilization remains **14/14**.

## Food safety

Internal metadata remains explicit while world-facing language stays practical to the late-medieval/fantasy setting.

- raw Gloam Raincaps require preparation and may bring stomach sickness/irritation if eaten raw;
- raincaps are cooked or properly dried before eating;
- ripe Gloam Nightberries are direct-ready after ordinary rinsing;
- cooked raincaps, dried raincaps, and dried nightberries are direct-ready.

No ordinary description assumes modern microbiology.

## People and services

Persistent staff:

- Mara Oren — Oldbough Field Factor;
- Hale Rowan — Gloamwood Boundary Forester;
- Tessa Brin — Oldbough Refuge Keeper.

Schedules:
- Mara exchange: 06:00–16:00;
- Hale forester desk: 07:00–18:00.

Service layer:
- Oldbough Field Exchange;
- forester route desk;
- workyard;
- common hearth and simple bunks.

Workstation exposure:
- workyard -> workshop + woodshop;
- common hearth -> kitchen + workshop.

## Pack ownership

`pack-gloamwood-oldgrowth-ecology` owns:
- 2 wilderness places;
- 4 new ecology families;
- 8 species;
- 8 populations;
- 7 gathering sources;
- 7 raw resources.

`pack-gloamwood-oldbough-refuge` owns:
- Oldbough Refuge;
- 2 routes;
- 3 NPCs;
- 2 schedules;
- 1 shop;
- 10 production outputs;
- 10 recipes.

Canonical catalogs remain definition authority.

## Persistence decision

Game State remains **14**.

Data 54 composes existing place/map/route, ecology/population, gathering/resource recovery, inventory/provenance, production/work/workstations, commerce, NPC schedules, and Pack v2 authorities.

No durable forest-navigation state, ward/disorientation state, mountain-pass state, nation-border state, or new hunting/body-recovery family is introduced.

## Explicit boundary exclusions

Data 54 does **not** implement:
- the western mountain crescent;
- a Lethari pass or gate city;
- the Lethari ancestral capital/fertile-valley heartland;
- generalized magical forest navigation;
- permanent ward/disorientation simulation;
- a new nation/political-border system.

Any future western continuation must add a real route rather than treating map proximity as adjacency.

## Validation

Implementation freeze:
- SHA `83cfa4de61e315fb54689a5d7d2899d2ade41743`;
- Check #1504 / run `33269167675`;
- **781/781 tests**;
- Repository Audit, Census, Benchmark 3, Benchmark Sample green.

Promoted Data 54 head:
- SHA `2de11cd73302751e9a83088d77c2de42df3313e8`;
- Check #1507 / run `33269370813`;
- **781/781 tests**;
- Repository Audit, Census, Benchmark 3, Benchmark Sample green.

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
capabilities/training definitions        44
NPC schedules                            21
regional/shared content packs            27
pack-owned records                      992
runtime seed NPCs                        37
runtime seed enemies                     17
```

Mechanics-scale gate remains **NOT READY**. Companions remain the largest relative gap; abilities, quests, and named-NPC breadth remain below mechanics floors.
